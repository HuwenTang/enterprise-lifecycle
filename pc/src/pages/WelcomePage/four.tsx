import { primeApi } from '@/services/api';
import type { EnterpriseGdpVo, Statistic4KuVo } from '@/services/apis';
import { BuildOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Button, Input, Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.module.css';

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

/** 四库卡片上方：年度筛选（变更后请求 /statistic/four-library；全部不传 year；跳转 /xmgl 可带 year） */
const SIKU_FILTER_YEAR_OPTIONS: ReadonlyArray<{ value: 'all' | '2023' | '2024' | '2025' | '2026'; label: string }> = [
  { value: 'all', label: '全部' },
  { value: '2023', label: '2023年' },
  { value: '2024', label: '2024年' },
  { value: '2025', label: '2025年' },
  { value: '2026', label: '2026年' },
];

/** 金额范围：全部不传 range；「亿元以上」「亿元以下」以按钮文案作为接口 range、跳转 amountRange */
const SIKU_FILTER_AMOUNT_OPTIONS: ReadonlyArray<{ value: 'all' | 'above' | 'below'; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'above', label: '亿元以上' },
  { value: 'below', label: '亿元以下' },
];

type SikuFilterYear = (typeof SIKU_FILTER_YEAR_OPTIONS)[number]['value'];
type SikuFilterAmount = (typeof SIKU_FILTER_AMOUNT_OPTIONS)[number]['value'];

/** 金额筛选对应接口 range / 跳转文案；全部为 undefined */
function getSikuAmountRangeLabel(amount: SikuFilterAmount): string | undefined {
  if (amount === 'all') return undefined;
  return SIKU_FILTER_AMOUNT_OPTIONS.find((o) => o.value === amount)?.label;
}

/** 组装 GET /statistic/four-library 查询参数：year 为数值；range 仅非「全部」金额时为按钮文案 */
function buildFourLibraryRequestParams(year: SikuFilterYear, amount: SikuFilterAmount): { year?: number; range?: string } {
  const params: { year?: number; range?: string } = {};
  if (year !== 'all') {
    params.year = Number(year);
  }
  const rangeLabel = getSikuAmountRangeLabel(amount);
  if (rangeLabel) {
    params.range = rangeLabel;
  }
  return params;
}

/** 四库卡片配置：标题、描述、背景图、接口字段、跳转参数*/
const SIKU_CARD_CONFIG = [
  { title: '签约库', label: '协议项目数', dataKey: 'signData' as keyof Statistic4KuVo, bgSvg: '/img/签约库背景.svg', cardClass: 'sikuCardBlue', progressValue: '2,3,4,5,6,7' },
  { title: '备案库', label: '已备案项目数', dataKey: 'recordData' as keyof Statistic4KuVo, bgSvg: '/img/备案库背景.svg', cardClass: 'sikuCardGreen', progressValue: '4,5,6,7' },
  { title: '开工库', label: '已开工项目数', dataKey: 'buildData' as keyof Statistic4KuVo, bgSvg: '/img/开工库背景.svg', cardClass: 'sikuCardOrange', progressValue: '6,7' },
  { title: '投产库', label: '已投产项目数', dataKey: 'productData' as keyof Statistic4KuVo, bgSvg: '/img/投产库背景.svg', cardClass: 'sikuCardPurple', progressValue: '7' },
] as const;

/** 五率表格行数据 */
interface WulvRow {
  region: string;
  signCount: number;
  signNew: number;
  filingCount: number;
  filingNew: number;
  filingRate: string;
  startCount: number;
  startNew: number;
  startRate: string;
  totalInvest: number;
  completedInvest: number;
  investNew: number;
  investRate: string;
  productionCount: number;
  productionNew: number;
  productionRate: string;
  output: number;
  employment: number;
}

const WULV_TABLE_DATA: WulvRow[] = [
  { region: '泰州市', signCount: 72, signNew: 0, filingCount: 62, filingNew: 0, filingRate: '86.1%', startCount: 38, startNew: 0, startRate: '61.3%', totalInvest: 817.6, completedInvest: 218, investNew: 218, investRate: '26.7%', productionCount: 2, productionNew: 0, productionRate: '5.3%', output: 5.3, employment: 1217 },
  { region: '靖江市', signCount: 8, signNew: 0, filingCount: 7, filingNew: 0, filingRate: '87.5%', startCount: 4, startNew: 0, startRate: '57.1%', totalInvest: 110, completedInvest: 51.7, investNew: 51.7, investRate: '47.0%', productionCount: 1, productionNew: 0, productionRate: '25.0%', output: 2, employment: 917 },
  { region: '泰兴市', signCount: 14, signNew: 0, filingCount: 13, filingNew: 0, filingRate: '92.9%', startCount: 7, startNew: 0, startRate: '53.8%', totalInvest: 125.4, completedInvest: 29.3, investNew: 29.3, investRate: '23.3%', productionCount: 0, productionNew: 0, productionRate: '0.0%', output: 0, employment: 0 },
  { region: '兴化市', signCount: 16, signNew: 0, filingCount: 16, filingNew: 0, filingRate: '100.0%', startCount: 11, startNew: 0, startRate: '68.8%', totalInvest: 262, completedInvest: 63, investNew: 63, investRate: '24.1%', productionCount: 0, productionNew: 0, productionRate: '0.0%', output: 0, employment: 0 },
  { region: '海陵区', signCount: 6, signNew: 0, filingCount: 4, filingNew: 0, filingRate: '66.7%', startCount: 2, startNew: 0, startRate: '50.0%', totalInvest: 20, completedInvest: 4.7, investNew: 4.7, investRate: '23.3%', productionCount: 0, productionNew: 0, productionRate: '0.0%', output: 0, employment: 0 },
  { region: '姜堰区', signCount: 13, signNew: 0, filingCount: 11, filingNew: 0, filingRate: '84.6%', startCount: 8, startNew: 0, startRate: '72.7%', totalInvest: 145.1, completedInvest: 16.4, investNew: 16.4, investRate: '11.3%', productionCount: 0, productionNew: 0, productionRate: '0.0%', output: 0, employment: 0 },
  { region: '高港区', signCount: 0, signNew: 0, filingCount: 0, filingNew: 0, filingRate: '0.0%', startCount: 0, startNew: 0, startRate: '0.0%', totalInvest: 0, completedInvest: 0, investNew: 0, investRate: '0.0%', productionCount: 0, productionNew: 0, productionRate: '0.0%', output: 0, employment: 0 },
  { region: '医药高新区（高港区）', signCount: 15, signNew: 0, filingCount: 11, filingNew: 0, filingRate: '73.3%', startCount: 6, startNew: 0, startRate: '54.5%', totalInvest: 155, completedInvest: 52.9, investNew: 52.9, investRate: '34.1%', productionCount: 1, productionNew: 0, productionRate: '16.7%', output: 3.3, employment: 300 },
];

/** 五率表格列配置（分组表头） */
const WULV_COLUMNS: ColumnsType<WulvRow> = [
  { title: '地区', dataIndex: 'region', key: 'region', width: 120, fixed: 'left', align: 'left' },
  {
    title: '签约项目备案情况',
    children: [
      { title: '签约数', dataIndex: 'signCount', key: 'signCount', width: 60, align: 'center' },
      { title: '当月新增', dataIndex: 'signNew', key: 'signNew', width: 60, align: 'center' },
      { title: '备案数', dataIndex: 'filingCount', key: 'filingCount', width: 60, align: 'center' },
      { title: '当月新增', dataIndex: 'filingNew', key: 'filingNew', width: 60, align: 'center' },
      { title: '备案率', dataIndex: 'filingRate', key: 'filingRate', width: 60, align: 'center' },
    ],
  },
  {
    title: '备案项目开工情况',
    children: [
      { title: '开工项目数', dataIndex: 'startCount', key: 'startCount', width: 60, align: 'center' },
      { title: '当月新增', dataIndex: 'startNew', key: 'startNew', width: 60, align: 'center' },
      { title: '开工率', dataIndex: 'startRate', key: 'startRate', width: 60, align: 'center' },
    ],
  },
  {
    title: '开工项目投资完成情况',
    children: [
      { title: '总投资', dataIndex: 'totalInvest', key: 'totalInvest', width: 60, align: 'center' },
      { title: '累计完成投资', dataIndex: 'completedInvest', key: 'completedInvest', width: 60, align: 'center' },
      { title: '当月新增', dataIndex: 'investNew', key: 'investNew', width: 60, align: 'center' },
      { title: '投资完成率', dataIndex: 'investRate', key: 'investRate', width: 60, align: 'center' },
    ],
  },
  {
    title: '开工项目投产情况',
    children: [
      { title: '投产项目数', dataIndex: 'productionCount', key: 'productionCount', width: 90, align: 'center' },
      { title: '当月新增', dataIndex: 'productionNew', key: 'productionNew', width: 80, align: 'center' },
      { title: '投产率', dataIndex: 'productionRate', key: 'productionRate', width: 72, align: 'center' },
    ],
  },
  {
    title: '投产项目达效情况',
    children: [
      { title: '产值', dataIndex: 'output', key: 'output', width: 72, align: 'center' },
      { title: '就业人数', dataIndex: 'employment', key: 'employment', width: 80, align: 'center' },
    ],
  },
];

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

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  /** 四库卡片上方筛选（变更后请求 /statistic/four-library） */
  const [sikuFilterYear, setSikuFilterYear] = useState<SikuFilterYear>('all');
  const [sikuFilterAmount, setSikuFilterAmount] = useState<SikuFilterAmount>('all');
  /** 四库卡片数据（/statistic/four-library） */
  const [fourLibraryData, setFourLibraryData] = useState<Statistic4KuVo | null>(null);
  /** 查看更多弹框：当前打开的卡片索引，null 表示关闭 */
  const [fourUpModalIndex, setFourUpModalIndex] = useState<number | null>(null);
  /** 弹框内前100名列表（按卡片索引请求一次） */
  const [fourUpModalList] = useState<EnterpriseGdpVo[]>([]);
  /** 弹框内搜索关键词 */
  const [fourUpModalKeyword, setFourUpModalKeyword] = useState('');
  /** 弹框内搜索输入框受控值 */
  const [fourUpModalInput, setFourUpModalInput] = useState('');

  useEffect(() => {
    const loadFourLibrary = async () => {
      try {
        const res = await primeApi.getFourLibrary(buildFourLibraryRequestParams(sikuFilterYear, sikuFilterAmount));
        setFourLibraryData(res);
      } catch (e) {
        console.error('获取四库数据失败:', e);
      }
    };
    loadFourLibrary();
  }, [sikuFilterYear, sikuFilterAmount]);

  /** 弹框内过滤后的列表（按名称搜索） */
  const fourUpModalFilteredList = useMemo(() => {
    if (!fourUpModalKeyword.trim()) return fourUpModalList;
    const k = fourUpModalKeyword.trim().toLowerCase();
    return fourUpModalList.filter((item) => (item?.name ?? '').toLowerCase().includes(k));
  }, [fourUpModalList, fourUpModalKeyword]);

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
            <button type="button" className={`${styles.fourUpSikuBtn} ${styles.fourBackBtn}`} onClick={() => navigate('/')}>
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
                  className={`${styles.sikuFilterTag} ${sikuFilterYear === opt.value ? styles.sikuFilterTagActive : ''}`}
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
                  className={`${styles.sikuFilterTag} ${sikuFilterAmount === opt.value ? styles.sikuFilterTagActive : ''}`}
                  onClick={() => setSikuFilterAmount(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 四库卡片 */}
          <div className={styles.sikuCards}>
            {SIKU_CARD_CONFIG.map((item) => (
              <div
                key={item.title}
                className={`${styles.sikuCard} ${styles[item.cardClass]}`}
                style={{ backgroundImage: `url(${item.bgSvg})`, cursor: 'pointer' }}
                onClick={() => {
                  const qs = new URLSearchParams();
                  qs.set('currentProjectProgress', item.progressValue);
                  if (sikuFilterYear !== 'all') {
                    qs.set('year', String(Number(sikuFilterYear)));
                  }
                  const amountRangeLabel = getSikuAmountRangeLabel(sikuFilterAmount);
                  if (amountRangeLabel) {
                    qs.set('amountRange', amountRangeLabel);
                  }
                  navigate(`/xmgl?${qs.toString()}`);
                }}
              >
                <div className={styles.sikuCardTitle}>{item.title}</div>
                <div className={styles.sikuCardValue}>
                  <CountUpNumber
                    id={`siku-${item.dataKey}`}
                    end={fourLibraryData?.[item.dataKey] ?? 0}
                    duration={2000}
                  />
                </div>
                <div className={styles.sikuCardLabel}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* 五率情况汇总：白底 + 圆角 20px */}
          <div className={styles.wulvSection}>
            <div className={styles.wulvTitleWrap}>
              <span className={styles.wulvTitleBar} />
              <h2 className={styles.wulvTitle}>10亿元以上签约项目「五率」情况汇总</h2>
              <span className={styles.wulvTitleBar} />
            </div>
            <p className={styles.wulvSubtitle}></p>

            <div className={styles.wulvTableWrap}>
              <Table<WulvRow>
                columns={WULV_COLUMNS}
                dataSource={WULV_TABLE_DATA}
                rowKey="region"
                pagination={false}
                bordered
                scroll={{ x: 'max-content' }}
              />
            </div>
          </div>

          <div className={styles.footer}>
            <p>泰州市企业全生命周期管理服务平台 | 技术支持：市数据局 市数据产业集团有限公司</p>
          </div>
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
              {fourUpModalFilteredList.map((item, i) => (
                <div key={item?.uscc ?? i} className={styles.fourUpModalListItem}>
                  <span className={i < 3 ? styles.fourUpModalNumOrange : styles.fourUpModalNumGray}>
                    {i + 1}
                  </span>
                  <span className={styles.fourUpModalItemName}>{item?.name ?? '-'}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default WelcomePage;
