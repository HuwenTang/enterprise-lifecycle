import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@umijs/max';
import { BuildOutlined, CloseOutlined, ProjectOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import { primeApi } from '@/services/api';
import type { EnterpriseGdpVo, IndexEnterpriseVo, StatisticVo } from '@/services/apis';
import styles from './index.module.css';

/** 四上企业卡片配置：标题 + 请求 getRevenueList 时的参数 */
const FOUR_UP_CARD_CONFIG: ReadonlyArray<{
  title: string;
  cardClass: string;
  requestKey: 'isTopIndustry' | 'isTopConstruction' | 'isTopTrade' | 'isTopService';
}> = [
  { title: '规模以上工业企业', cardClass: 'fourUpCardBlue', requestKey: 'isTopIndustry' },
  { title: '资质等级建筑企业', cardClass: 'fourUpCardGreen', requestKey: 'isTopConstruction' },
  { title: '限额以上批零住餐企业', cardClass: 'fourUpCardPurple', requestKey: 'isTopTrade' },
  { title: '规模以上服务业企业', cardClass: 'fourUpCardRed', requestKey: 'isTopService' },
];

/** 四上企业四个指标在接口中的名称（与后端 index 字段一致） */
const FOUR_UP_INDEX_KEYS = [
  '规模以上工业企业',
  '资质等级建筑业企业', // 接口为建筑业，展示为资质等级建筑企业
  '限额以上批零住餐企业',
  '规模以上服务业企业',
] as const;

// 数字滚动组件（id 用于区分多个实例，避免重复 id）
const CountUpNumber: React.FC<{ id?: string; end: number; duration?: number }> = ({ id, end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const domId = id ?? `count-${end}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(domId);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [domId]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span id={domId} className={styles.countUpNumber}>
      {count.toLocaleString()}
    </span>
  );
};

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [statistic, setStatistic] = useState<StatisticVo | null>(null);
  /** 四上企业四个指标第二季度的 count，顺序与 FOUR_UP_INDEX_KEYS 一致 */
  const [fourUpCounts, setFourUpCounts] = useState<[number, number, number, number]>([0, 0, 0, 0]);
  /** 悬停中的四上卡片索引，用于显示 overlay */
  const [hoveredFourUpIndex, setHoveredFourUpIndex] = useState<number | null>(null);
  /** 各卡片 hover 时请求的企业列表（按卡片顺序），未请求为 null */
  const [fourUpEnterpriseLists, setFourUpEnterpriseLists] = useState<(EnterpriseGdpVo[] | null)[]>([null, null, null, null]);
  /** 查看更多弹框：当前打开的卡片索引，null 表示关闭 */
  const [fourUpModalIndex, setFourUpModalIndex] = useState<number | null>(null);
  /** 弹框内前100名列表（按卡片索引请求一次） */
  const [fourUpModalList, setFourUpModalList] = useState<EnterpriseGdpVo[]>([]);
  /** 弹框内搜索关键词 */
  const [fourUpModalKeyword, setFourUpModalKeyword] = useState('');
  /** 弹框内搜索输入框受控值 */
  const [fourUpModalInput, setFourUpModalInput] = useState('');

  useEffect(() => {
    const loadStatistic = async () => {
      try {
        const res = await primeApi.getStatistic();
        setStatistic(res);
      } catch (e) {
        console.error('获取统计数据失败:', e);
      }
    };
    loadStatistic();
  }, []);

  useEffect(() => {
    const loadFourUp = async () => {
      try {
        const data: IndexEnterpriseVo[] = await primeApi.getUpEnterprise({ year: 2025 });
        if (!data || !Array.isArray(data)) {
          return;
        }
        const q2 = data.filter((item) => item.quarter === 4);
        const counts: [number, number, number, number] = [
          q2.find((item) => item.index === FOUR_UP_INDEX_KEYS[0])?.count ?? 0,
          q2.find((item) => item.index === FOUR_UP_INDEX_KEYS[1])?.count ?? 0,
          q2.find((item) => item.index === FOUR_UP_INDEX_KEYS[2])?.count ?? 0,
          q2.find((item) => item.index === FOUR_UP_INDEX_KEYS[3])?.count ?? 0,
        ];
        setFourUpCounts(counts);
      } catch (e) {
        console.error('获取四上企业数据失败:', e);
      }
    };
    loadFourUp();
  }, []);

  /** 打开「查看更多」弹框并拉取前100名 */
  const openFourUpModal = (cardIndex: number) => {
    setFourUpModalIndex(cardIndex);
    setFourUpModalKeyword('');
    setFourUpModalInput('');
    setFourUpModalList([]);
    const config = FOUR_UP_CARD_CONFIG[cardIndex];
    primeApi
      .getRevenueList({ year: 2025, page: 1, size: 100, [config.requestKey]: true })
      .then((res) => setFourUpModalList(res?.records ?? []))
      .catch((e) => {
        console.error('获取前100名失败:', e);
        setFourUpModalList([]);
      });
  };

  /** 弹框内过滤后的列表（按名称搜索） */
  const fourUpModalFilteredList = useMemo(() => {
    if (!fourUpModalKeyword.trim()) return fourUpModalList;
    const k = fourUpModalKeyword.trim().toLowerCase();
    return fourUpModalList.filter((item) => (item?.name ?? '').toLowerCase().includes(k));
  }, [fourUpModalList, fourUpModalKeyword]);

  /** 悬停某张四上卡片时拉取企业列表（revenue/2025?page=1&size=3&isTopXxx=true） */
  const fetchFourUpEnterprises = async (cardIndex: number) => {
    if (cardIndex < 0 || cardIndex > 3 || fourUpEnterpriseLists[cardIndex] !== null) return;
    const config = FOUR_UP_CARD_CONFIG[cardIndex];
    try {
      const res = await primeApi.getRevenueList({
        year: 2025,
        page: 1,
        size: 3,
        [config.requestKey]: true,
      });
      const list = res?.records ?? [];
      setFourUpEnterpriseLists((prev) => {
        const next = [...prev];
        next[cardIndex] = list;
        return next;
      });
    } catch (e) {
      console.error('获取四上企业列表失败:', e);
      setFourUpEnterpriseLists((prev) => {
        const next = [...prev];
        next[cardIndex] = [];
        return next;
      });
    }
  };

  return (
    <div className={styles.indexPage}>
      {/* 背景动画元素 */}
      <div className={styles.bgElements}>
        <div className={styles.bgElement}></div>
        <div className={styles.bgElement}></div>
        <div className={styles.bgElement}></div>
        <div className={styles.bgElement}></div>
      </div>

      <div className={styles.container}>
        <header>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <BuildOutlined />
            </div>
            <div className={styles.logoText}>
              <h1>泰州市企业全生命周期管理服务平台</h1>
              <p>Taizhou Enterprise Full Lifecycle Management Service System</p>
            </div>
          </div>
        </header>

        <div className={styles.statsOverviewWrap}>
          <div className={styles.statsOverviewTopRight}>
            <button
              type="button"
              className={styles.fourUpSikuBtn}
              onClick={() => navigate('/welcome/fourWarZone')}
            >
              <span className={styles.fourUpSikuBtnInner}>
                <span className={styles.fourUpSikuBtnRow}>
                  <span className={styles.fourUpSikuBtnTitle}>四大战区</span>
                  <RightOutlined className={styles.fourUpSikuBtnIcon} />
                </span>
                <span className={styles.fourUpSikuBtnDesc}>查看四大战区签约详情</span>
              </span>
            </button>
            <button
              type="button"
              className={styles.fourUpSikuBtn}
              onClick={() => navigate('/welcome/four')}
            >
              <span className={styles.fourUpSikuBtnInner}>
                <span className={styles.fourUpSikuBtnRow}>
                  <span className={styles.fourUpSikuBtnTitle}>四库五率</span>
                  <RightOutlined className={styles.fourUpSikuBtnIcon} />
                </span>
                <span className={styles.fourUpSikuBtnDesc}>查看签约库、备案库、开工库、投产库及五率指标详情</span>
              </span>
            </button>
          </div>
        <div className={styles.statsOverview}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <CountUpNumber id="stat-market" end={statistic?.data ?? 0} duration={2500} />
            </div>
            <div className={styles.statLabel}>市场主体</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <CountUpNumber id="stat-sign" end={statistic?.signData ?? 0} duration={2000} />
            </div>
            <div className={styles.statLabel}>已签约项目</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              <CountUpNumber id="stat-build" end={statistic?.buildData ?? 0} duration={1500} />
            </div>
            <div className={styles.statLabel}>在建项目</div>
          </div>

          {/* 四上企业 */}
          <section className={styles.fourUpSection}>
            <h2 className={styles.fourUpTitle}>四上企业</h2>
            <div className={styles.fourUpCards}>
              {FOUR_UP_CARD_CONFIG.map((config, index) => (
                <div
                  key={config.requestKey}
                  className={`${styles.fourUpCard} ${styles[config.cardClass as keyof typeof styles]}`}
                  onMouseEnter={() => {
                    setHoveredFourUpIndex(index);
                    fetchFourUpEnterprises(index);
                  }}
                  onMouseLeave={() => setHoveredFourUpIndex(null)}
                >
                  <div className={styles.fourUpValue}>
                    <CountUpNumber
                      id={`fourup-${config.requestKey}`}
                      end={fourUpCounts[index]}
                      duration={2000}
                    />
                  </div>
                  <div className={styles.fourUpLabel}>{config.title}</div>

                  {/* 悬停时从中心放大铺满卡片的浮层 */}
                  <div
                    className={`${styles.fourUpCardOverlay} ${hoveredFourUpIndex === index ? styles.fourUpCardOverlayVisible : ''}`}
                  >
                    <div className={styles.fourUpCardOverlayInner}>
                      <div className={styles.fourUpCardOverlayHead}>
                        <span className={styles.fourUpCardOverlayTitle}>{config.title}</span>
                        <span
                          role="button"
                          tabIndex={0}
                          className={styles.fourUpCardOverlayMore}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openFourUpModal(index);
                          }}
                        >
                          查看更多 &gt;&gt;
                        </span>
                      </div>
                      <ol className={styles.fourUpCardOverlayList}>
                        {(fourUpEnterpriseLists[index] ?? []).map((item, i) => (
                          <li key={item?.uscc ?? i} className={styles.fourUpCardOverlayItem}>
                            {item?.name ?? '-'}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        </div>

        <div className={styles.dashboard}>
          <div
            onClick={() => {
              window.location.replace('/home')

            }}
            className={`${styles.departmentCard} ${styles.bgCommerce}`}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.departmentHeader}>
              <div className={styles.departmentIcon}>
                <BuildOutlined />
              </div>
            </div>
            <h3>企业管理模块</h3>
            <p>全领域归集涉企数据，对企业进行精准画像，实现服务与管理一体化。</p>
            <div className={styles.departmentStages}>
              <div className={styles.stageTag}>数字招商</div>
              <div className={styles.stageTag}>在线审批</div>
              <div className={styles.stageTag}>工程建设</div>
              <div className={styles.stageTag}>竣工达产</div>
              <div className={styles.stageTag}>一企一档</div>
            </div>
          </div>

          <div
            onClick={() =>{
              window.location.replace('/tutorial')
            }}
            className={`${styles.departmentCard} ${styles.bgDevelopment}`}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.departmentHeader}>
              <div className={styles.departmentIcon}>
                <ProjectOutlined />
              </div>
            </div>
            <h3>项目管理模块</h3>
            <p>聚焦“前期招商”“备案审批”“投资进度”“投产达效”4大环节，采取“一项目一代码”贯穿全流程，实时监控全市项目建设情况</p>
            <div className={styles.departmentStages}>
              <div className={styles.stageTag}>前期招商</div>
              <div className={styles.stageTag}>备案审批</div>
              <div className={styles.stageTag}>开工竣工</div>
              <div className={styles.stageTag}>投产达效</div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <p>泰州市企业全生命周期管理服务平台 | 技术支持：市数据局 市数据产业集团有限公司</p>
        </div>
      </div>

      {/* 四上企业 - 查看更多弹框（前100名 + 搜索） */}
      <Modal
        open={fourUpModalIndex !== null}
        onCancel={() => setFourUpModalIndex(null)}
        footer={null}
        width={750}
        closable={false}
        className={styles.fourUpModal}
        styles={{ body: { paddingTop: 8 } }}
      >
        {fourUpModalIndex !== null && (
          <>
            <div className={styles.fourUpModalHeader}>
              <h3 className={styles.fourUpModalTitle}>
                {FOUR_UP_CARD_CONFIG[fourUpModalIndex].title} - 前100名
              </h3>
              <button
                type="button"
                aria-label="关闭"
                className={styles.fourUpModalClose}
                onClick={() => setFourUpModalIndex(null)}
              >
                <CloseOutlined />
              </button>
            </div>
            <div className={styles.fourUpModalSearch}>
              <Input
                placeholder={`搜索${FOUR_UP_CARD_CONFIG[fourUpModalIndex].title}`}
                value={fourUpModalInput}
                onChange={(e) => setFourUpModalInput(e.target.value)}
                onPressEnter={() => setFourUpModalKeyword(fourUpModalInput)}
                className={styles.fourUpModalInput}
              />
              <Button type="primary" onClick={() => setFourUpModalKeyword(fourUpModalInput)}>
                确认
              </Button>
            </div>
            <div className={styles.fourUpModalList}>
              {fourUpModalFilteredList.map((item, i) => {
                const originalIndex = fourUpModalList.findIndex((orig) => orig?.uscc === item?.uscc);
                const rank = originalIndex >= 0 ? originalIndex + 1 : i + 1;
                return (
                  <div key={item?.uscc ?? i} className={styles.fourUpModalListItem}>
                    <span className={rank <= 3 ? styles.fourUpModalNumOrange : styles.fourUpModalNumGray}>
                      {rank}
                    </span>
                    <span className={styles.fourUpModalItemName}>{item?.name ?? '-'}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default WelcomePage;
