import type { Statistic4KuVo } from '@/services/apis';
import fourWarZoneApi from '@/services/fourWarZone/fourWarZone';
import { BuildOutlined, RightOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import PersonModal from './PersonModal';
import ProjectDetailModal from './ProjectDetailModal';

// 数字滚动组件（id 用于区分多个实例，避免重复 id）
const CountUpNumber: React.FC<{
  id?: string;
  end: number;
  duration?: number;
  isDecimal?: boolean;
}> = ({ id, end, duration = 2000, isDecimal = false }) => {
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
      { threshold: 0.1 },
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
      const currentValue = easeOutQuart * end;
      // 根据类型决定取整方式：项目数取整，金额保留一位小数
      const currentCount = isDecimal
        ? Math.round(currentValue * 10) / 10
        : Math.floor(currentValue);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration, isDecimal]);

  return (
    <span id={domId} className={styles.countUpNumber}>
      {isDecimal && count !== 0 ? count.toFixed(1) : count.toLocaleString()}
    </span>
  );
};

/** 四库卡片上方：年度筛选（变更后请求 /statistic/four-library；全部不传 year；跳转 /xmgl 可带 year） */
const SIKU_FILTER_YEAR_OPTIONS: ReadonlyArray<{
  value: 'all' | '2023' | '2024' | '2025' | '2026';
  label: string;
}> = [
  // { value: 'all', label: '全部' },
  // { value: '2023', label: '2023年' },
  // { value: '2024', label: '2024年' },
  // { value: '2025', label: '2025年' },
  { value: '2026', label: '2026年' },
];

/** 金额范围：全部不传 range；「亿元以上」「亿元以下」以按钮文案作为接口 range、跳转 amountRange */
const SIKU_FILTER_AMOUNT_OPTIONS: ReadonlyArray<{
  value: 'all' | 'above' | 'below';
  label: string;
}> = [
  { value: 'all', label: '全部' },
  { value: 'above', label: '亿元以上' },
  { value: 'below', label: '亿元以下' },
];

/** 排名依据：全部不传 range；「亿元以上」「亿元以下」以按钮文案作为接口 range、跳转 amountRange */
const SIKU_FILTER_TYPE_OPTIONS: ReadonlyArray<{
  value: 'num' | 'money' | 'default';
  label: string;
}> = [
  { value: 'default', label: '默认' },
  { value: 'num', label: '项目数' },
  { value: 'money', label: '投资额' },
];

type SikuFilterYear = (typeof SIKU_FILTER_YEAR_OPTIONS)[number]['value'];
type SikuFilterAmount = (typeof SIKU_FILTER_AMOUNT_OPTIONS)[number]['value'];
type SikuFilterType = (typeof SIKU_FILTER_TYPE_OPTIONS)[number]['value'];

/** 四库卡片配置：标题、描述、背景图、接口字段、跳转参数*/

interface RegionCardItem {
  regionName: string; // 战区名称
  projectCount: number; // 项目数
  projectAmount: number; // 投资额(亿元)
}

const fourWarZoneDefaultSort = [
  '北京(京津冀)',
  '上海(长三角)',
  '深圳(珠三角)',
  '南京(南京、合肥)',
  '境外',
];

const fourWarZoneTableDefaultSort = [
  '北京(京津冀)',
  '上海(长三角)',
  '深圳(珠三角)',
  '南京(南京、合肥)',
  '其他地区',
];

const SIKU_CARD_CONFIG = [
  {
    title: '北京(京津冀)',
    labelNum: '(个)',
    labelMoney: '(亿元)',
    dataKey: 'signData' as keyof Statistic4KuVo,
    bgSvg: '/img/签约库背景.svg',
    cardClass: 'sikuCardBlue',
    progressValue: '2,3,4,5,6,7',
  },
  {
    title: '上海(长三角)',
    labelNum: '(个)',
    labelMoney: '(亿元)',
    dataKey: 'recordData' as keyof Statistic4KuVo,
    bgSvg: '/img/备案库背景.svg',
    cardClass: 'sikuCardGreen',
    progressValue: '4,5,6,7',
  },
  {
    title: '深圳(珠三角)',
    labelNum: '(个)',
    labelMoney: '(亿元)',
    dataKey: 'buildData' as keyof Statistic4KuVo,
    bgSvg: '/img/开工库背景.svg',
    cardClass: 'sikuCardOrange',
    progressValue: '6,7',
  },
  {
    title: '南京(南京、合肥)',
    labelNum: '(个)',
    labelMoney: '(亿元)',
    dataKey: 'productData' as keyof Statistic4KuVo,
    bgSvg: '/img/投产库背景.svg',
    cardClass: 'sikuCardPurple',
    progressValue: '7',
  },
  {
    title: '境外',
    labelNum: '(个)',
    labelMoney: '(亿元)',
    dataKey: 'overseasData' as keyof Statistic4KuVo,
    bgSvg: '/img/投产库背景.svg',
    cardClass: 'sikuCardPurple',
    progressValue: '7',
  },
] as const;

/** 五率表格行数据 */
interface WulvRow {
  regionName: string;
  signedCount: string;
  signedInvestmentAmount: string;
  monthNewCount: string;
  monthInvestmentAmount: string;
  startProjectCount: string;
  startMonthNewCount: string;
  startRate: string;
  cityKeyCount: string;
  provinceKeyCount: string;
}

/** 五率表头：指标名与单位分行展示，如「累计签约数」+「（个）」 */
const wulvColumnTitle = (label: string, unit: string) => (
  <span className={styles.wulvColumnTitle}>
    {label}
    <br />（{unit}）
  </span>
);

/** 五率表格列配置（分组表头） */
const WULV_COLUMNS: ColumnsType<WulvRow> = [
  {
    title: '战区',
    dataIndex: 'regionName',
    key: 'regionName',
    width: 120,
    fixed: 'left',
    align: 'left',
  },
  {
    title: wulvColumnTitle('在谈项目数', '个'),
    dataIndex: 'talkingCount',
    key: 'talkingCount',
    width: 200,
    align: 'center',
  },
  {
    title: '签约项目情况',
    children: [
      {
        title: wulvColumnTitle('累计签约数', '个'),
        dataIndex: 'signedCount',
        key: 'signedCount',
        width: 200,
        align: 'center',
      },
      {
        title: wulvColumnTitle('累计投资额', '亿元'),
        dataIndex: 'signedInvestmentAmount',
        key: 'signedInvestmentAmount',
        width: 200,
        align: 'center',
      },
      {
        title: wulvColumnTitle('当月新增数', '个'),
        dataIndex: 'monthNewCount',
        key: 'monthNewCount',
        width: 200,
        align: 'center',
      },
      {
        title: wulvColumnTitle('当月投资额', '亿元'),
        dataIndex: 'monthInvestmentAmount',
        key: 'monthInvestmentAmount',
        width: 200,
        align: 'center',
      },
    ],
  },
  {
    title: wulvColumnTitle('招商活动数', '个'),
    dataIndex: 'investmentActivityCount',
    key: 'investmentActivityCount',
    width: 180,
    align: 'center',
  },
  // {
  //   title: '项目开工情况',
  //   children: [
  //     {
  //       title: wulvColumnTitle('开工项目数', '个'),
  //       dataIndex: 'startProjectCount',
  //       key: 'startProjectCount',
  //       width: 100,
  //       align: 'center',
  //     },
  //     {
  //       title: wulvColumnTitle('当月新增数', '个'),
  //       dataIndex: 'startMonthNewCount',
  //       key: 'startMonthNewCount',
  //       width: 100,
  //       align: 'center',
  //     },
  //     {
  //       title: wulvColumnTitle('开工率', '%'),
  //       dataIndex: 'startRate',
  //       key: 'startRate',
  //       width: 100,
  //       align: 'center',
  //     },
  //   ],
  // },
  // {
  //   title: '重点项目入库情况',
  //   children: [
  //     {
  //       title: wulvColumnTitle('市重点数量', '个'),
  //       dataIndex: 'cityKeyCount',
  //       key: 'cityKeyCount',
  //       width: 100,
  //       align: 'center',
  //     },
  //     {
  //       title: wulvColumnTitle('省重大数量', '个'),
  //       dataIndex: 'provinceKeyCount',
  //       key: 'provinceKeyCount',
  //       width: 100,
  //       align: 'center',
  //     },
  //   ],
  // },
];

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  /** 四库卡片上方筛选(变更后请求 /statistic/four-library) */
  const [sikuFilterYear, setSikuFilterYear] = useState<SikuFilterYear>('2026');
  const [sikuFilterAmount, setSikuFilterAmount] = useState<SikuFilterAmount>('all');
  const [sikuFilterType, setSikuFilterType] = useState<SikuFilterType>('default');
  /** 用于触发动画的key,每次排序类型改变时更新 */
  const [animationKey, setAnimationKey] = useState(0);
  /** 弹窗相关状态 */
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCardTitle, setCurrentCardTitle] = useState('');
  const [personModalVisible, setPersonModalVisible] = useState(false);
  /** 首页统计数据 */
  const [regionCardsData, setRegionCardsData] = useState<RegionCardItem[]>([]);
  /** 战区详情数据（用于五率表格） */
  const [regionDetailsData, setRegionDetailsData] = useState<WulvRow[]>([]);
  /** 数据加载状态 */
  const [loading, setLoading] = useState(false);

  // 加载首页统计数据
  useEffect(() => {
    const loadDashboardStats = async () => {
      setLoading(true); // 开始加载
      try {
        // 构建请求参数：year 仅非 "all" 时传值，amountRange 仅非 "all" 时传值
        const params: { year?: number; amountRange?: 'above' | 'below' } = {};

        if (sikuFilterYear !== 'all') {
          params.year = Number(sikuFilterYear);
        }

        if (sikuFilterAmount !== 'all') {
          params.amountRange = sikuFilterAmount as 'above' | 'below';
        }

        const res = await fourWarZoneApi.getDashboardStats(params);

        if (res.data.regionCards) {
          const filterData = fourWarZoneDefaultSort.map((regionName) => {
            const found = res.data.regionCards.find(
              (item: RegionCardItem) => item.regionName === regionName,
            );
            return found || { regionName, projectCount: 0, projectAmount: 0 };
          });
          setRegionCardsData(filterData);
        }

        // 辅助函数：最多保留2位小数，处理浮点数精度问题
        const toFixed2 = (num: number): string => {
          return (Math.round(Number(num) * 100) / 100).toString();
        };

        // 处理五率表格数据：过滤掉"其他"，并转换字段名，按默认顺序排序
        if (res.data.regionDetails) {
          const detailsData = fourWarZoneTableDefaultSort
            .map((regionName) => {
              const found = res.data?.regionDetails?.find((item) => item.regionName === regionName);
              if (!found) return null;
              return {
                regionName: found.regionName,
                signedCount: toFixed2(found.signedCount),
                signedInvestmentAmount: toFixed2(found.signedInvestmentAmount),
                monthNewCount: toFixed2(found.monthNewCount),
                monthInvestmentAmount: toFixed2(found.monthInvestmentAmount),
                startProjectCount: toFixed2(found.startProjectCount),
                startMonthNewCount: toFixed2(found.startMonthNewCount),
                startRate: toFixed2(found.startRate),
                cityKeyCount: toFixed2(found.cityKeyCount || 0),
                provinceKeyCount: toFixed2(found.provinceKeyCount || 0),
                talkingCount: toFixed2(found.talkingCount || 0),
                investmentActivityCount: toFixed2(found.investmentActivityCount || 0),
              };
            })
            .filter(Boolean) as WulvRow[];
          setRegionDetailsData(detailsData);
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false); // 加载完成
      }
    };

    loadDashboardStats();
  }, [sikuFilterYear, sikuFilterAmount]);

  // 根据排名依据排序
  const getSortedData = (): RegionCardItem[] => {
    if (regionCardsData.length === 0) return [];

    const sorted = [...regionCardsData];

    if (sikuFilterType === 'default') {
      // 默认顺序：北、上、深、南、境外
      sorted.sort(
        (a, b) =>
          fourWarZoneDefaultSort.indexOf(a.regionName) -
          fourWarZoneDefaultSort.indexOf(b.regionName),
      );
    } else if (sikuFilterType === 'num') {
      // 按项目数降序
      sorted.sort((a, b) => b.projectCount - a.projectCount);
    } else if (sikuFilterType === 'money') {
      // 按投资额降序
      sorted.sort((a, b) => b.projectAmount - a.projectAmount);
    }

    return sorted;
  };

  // 当排名依据改变时,触发动画
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [sikuFilterType]);

  return (
    <Spin spinning={loading} tip="加载中...">
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
                className={`${styles.fourUpSikuBtn} ${styles.fourBackBtn}`}
                onClick={() => navigate('/')}
              >
                <span className={styles.fourUpSikuBtnInner}>
                  <span className={styles.fourUpSikuBtnRow}>
                    <span className={styles.fourUpSikuBtnTitle}>返回上一页</span>
                  </span>
                </span>
              </button>
            </div>

            {/* 四库卡片上方：年度 + 金额范围（变更后调用 /statistic/four-library） */}
            <div className={styles.sikuFilterBar}>
              <div className={styles.sikuFilterGroup}>
                <span className={styles.sikuFilterLabel}>年度:</span>
                {SIKU_FILTER_YEAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.sikuFilterTag} ${
                      sikuFilterYear === opt.value ? styles.sikuFilterTagActive : ''
                    }`}
                    onClick={() => setSikuFilterYear(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className={styles.sikuFilterDivider} aria-hidden />
              <div className={styles.sikuFilterGroup}>
                <span className={styles.sikuFilterLabel}>金额范围:</span>
                {SIKU_FILTER_AMOUNT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.sikuFilterTag} ${
                      sikuFilterAmount === opt.value ? styles.sikuFilterTagActive : ''
                    }`}
                    onClick={() => setSikuFilterAmount(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className={styles.sikuFilterDivider} aria-hidden />
              <div className={styles.sikuFilterGroup}>
                <span className={styles.sikuFilterLabel}>排名依据:</span>
                {SIKU_FILTER_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.sikuFilterTag} ${
                      sikuFilterType === opt.value ? styles.sikuFilterTagActive : ''
                    }`}
                    onClick={() => setSikuFilterType(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 四库卡片 */}
            <div className={styles.sikuCards}>
              {getSortedData()
                .map((zoneData, index) => {
                  const isMoneyMode = sikuFilterType === 'money';
                  const showValue = isMoneyMode ? zoneData.projectAmount : zoneData.projectCount;
                  const showLabel = isMoneyMode ? '(亿元)' : '(个)';
                  const isDecimal = isMoneyMode; // 金额模式保留一位小数，项目数模式取整
                  return { zoneData, showValue, showLabel, isDecimal, index };
                })
                .map(({ zoneData, showValue, showLabel, isDecimal, index }) => (
                  <div
                    key={`${zoneData.regionName}-${animationKey}`}
                    className={`${styles.sikuCard} ${
                      styles[
                        SIKU_CARD_CONFIG.find((c) => c.title === zoneData.regionName)?.cardClass ||
                          'sikuCardBlue'
                      ]
                    }`}
                    style={{
                      backgroundImage: `url(${
                        SIKU_CARD_CONFIG.find((c) => c.title === zoneData.regionName)?.bgSvg || ''
                      })`,
                      cursor: 'pointer',
                      animation: `cardShuffle 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${
                        index * 0.1
                      }s both`,
                    }}
                    onClick={() => {
                      setCurrentCardTitle(zoneData.regionName);
                      setModalVisible(true);
                    }}
                  >
                    <div className={styles.sikuCardTitle}>{zoneData.regionName}</div>
                    <div className={styles.sikuCardValue}>
                      <CountUpNumber
                        id={`siku-${zoneData.regionName}`}
                        end={showValue}
                        duration={2000}
                        isDecimal={isDecimal}
                      />
                    </div>
                    <div className={styles.sikuCardLabel}>{showLabel}</div>
                  </div>
                ))}
            </div>

            {/* 四大战区情况汇总：白底 + 圆角 20px */}
            <div className={styles.wulvSection}>
              <div className={styles.wulvTitleWrap}>
                <div className={styles.wulvTitleBox}>
                  <span className={styles.wulvTitleBar} />
                  <h2 className={styles.wulvTitle}>四大战区招商情况汇总</h2>
                  <span className={styles.wulvTitleBar} />
                </div>
                <div className={styles.teamListButton} onClick={() => setPersonModalVisible(true)}>
                  <TeamOutlined className={styles.leftIcon} />
                  <div className={styles.text}>招商人员名单</div>
                  <RightOutlined className={styles.rightIcon} />
                </div>
              </div>
              <br />

              <div className={styles.wulvTableWrap}>
                <Table<WulvRow>
                  columns={WULV_COLUMNS}
                  dataSource={regionDetailsData}
                  rowKey="regionName"
                  pagination={false}
                  bordered
                  scroll={{ x: 'max-content' }}
                />
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <p>泰州市企业全生命周期管理服务平台 | 技术支持：市数据局 市数据产业集团有限公司</p>
          </div>
        </div>
      </div>

      {/* 项目详情弹窗 */}
      <ProjectDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={currentCardTitle}
      />

      {/* 招商人员弹窗 */}
      <PersonModal visible={personModalVisible} onClose={() => setPersonModalVisible(false)} />
    </Spin>
  );
};

export default WelcomePage;
