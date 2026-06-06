/**
 * 规上工业企业研发平台 MOCK 数据
 * 预留接口后替换为真实接口数据
 */

/** 全链条页 市(区) 选项（写死，按展示顺序） */
export const FULL_CHAIN_CITY_OPTIONS = [
  { label: '靖江市', value: '靖江市' },
  { label: '泰兴市', value: '泰兴市' },
  { label: '兴化市', value: '兴化市' },
  { label: '海陵区', value: '海陵区' },
  { label: '姜堰区', value: '姜堰区' },
  { label: '医药高新区（高港区）', value: '新高区' },
];

export const MOCK_DISTRICTS = FULL_CHAIN_CITY_OPTIONS;

export const MOCK_INNOVATIVE_CLUSTERS = [
  { label: '未来产业', value: '未来产业' },
  { label: '海工装备和高技术船舶', value: '海工装备和高技术船舶' },
  { label: '金属新材料及制品', value: '金属新材料及制品' },
  { label: '汽车及零部件', value: '汽车及零部件' },
  { label: '生物医药', value: '生物医药' },
  { label: '高端装备', value: '高端装备' },
  { label: '新能源', value: '新能源' },
  { label: '新一代信息技术', value: '新一代信息技术' },
];

export const MOCK_INDUSTRIAL_CHAINS = [
  { label: '高技术船舶', value: '高技术船舶' },
  { label: '金属新材料及制品', value: '金属新材料及制品' },
  { label: '海洋工程装备', value: '海洋工程装备' },
  { label: '汽车及零部件', value: '汽车及零部件' },
  { label: '生物医药', value: '生物医药' },
  { label: '医药', value: '医药' },
  { label: '医疗器械', value: '医疗器械' },
  { label: '高端装备', value: '高端装备' },
  { label: '新能源', value: '新能源' },
  { label: '新一代信息技术', value: '新一代信息技术' },
  { label: '节能环保', value: '节能环保' },
  { label: '新材料', value: '新材料' },
  { label: '集成电路', value: '集成电路' },
  { label: '人工智能', value: '人工智能' },
  { label: '其他', value: '其他' },
];

export const MOCK_FUTURE_CHAINS = [
  { label: '深空空天', value: '深空空天' },
  { label: '深海深地空天', value: '深海深地空天' },
  { label: '未来网络', value: '未来网络' },
  { label: '第三代半导体', value: '第三代半导体' },
  { label: '氢能与储能', value: '氢能与储能' },
  { label: '基因与细胞', value: '基因与细胞' },
];

/** 渲染勾选列（与接口 boolean | null 一致） */
export function renderCheck(checked?: boolean | null) {
  return checked === true ? '✓' : '';
}

/** 创新集群数据看板：子产业链统计行 */
export type ClusterDashboardSubItem = {
  name: string;
  count: number;
};

/** 创新集群数据看板：单张集群卡片 */
export type ClusterDashboardCard = {
  clusterName: string;
  total: number;
  items: ClusterDashboardSubItem[];
};

/**
 * 创新集群&产业链企业数量统计（示意图数据，后端提供接口后替换）
 */
export const CLUSTER_DASHBOARD_MOCK_CARDS: ClusterDashboardCard[] = [
  {
    clusterName: '生物医药',
    total: 200,
    items: [
      { name: '医药', count: 160 },
      { name: '医疗器械', count: 40 },
    ],
  },
  {
    clusterName: '健康食品',
    total: 360,
    items: [
      { name: '特医食品及功能性食品', count: 160 },
      { name: '农副食品深加工及预制菜', count: 200 },
    ],
  },
  {
    clusterName: '海工装备和高技术船舶',
    total: 479,
    items: [
      { name: '海洋工程装备', count: 379 },
      { name: '高技术船舶', count: 100 },
    ],
  },
  {
    clusterName: '汽车及零部件',
    total: 257,
    items: [{ name: '汽车及零部件', count: 257 }],
  },
  {
    clusterName: '新一代信息技术和智能装备',
    total: 420,
    items: [
      { name: '电子信息', count: 20 },
      { name: '智能装备', count: 220 },
      { name: '节能环保', count: 180 },
    ],
  },
  {
    clusterName: '化工及新材料',
    total: 200,
    items: [{ name: '化工及新材料', count: 200 }],
  },
  {
    clusterName: '未来产业',
    total: 2,
    items: [
      { name: '合成生物', count: 0 },
      { name: '细胞和基因技术', count: 0 },
      { name: '前沿新材料', count: 1 },
      { name: '新型储能', count: 0 },
      { name: '深海深地空天装备', count: 1 },
      { name: '人工智能', count: 0 },
      { name: '氢能', count: 0 },
    ],
  },
  {
    clusterName: '新能源',
    total: 230,
    items: [{ name: '新能源', count: 230 }],
  },
  {
    clusterName: '金属新材料及制品',
    total: 160,
    items: [{ name: '金属新材料及制品', count: 160 }],
  },
];

/** 中心统计数据看板：单类研发中心省/市（及可选国家级）数量 */
export type CenterDashboardCenter = {
  /** 中心类别展示名 */
  name: string;
  provincial: number;
  municipal: number;
  /** 科技-重点实验室 国家级等 */
  national?: number;
};

/**
 * 6 大中心省、市数量（示意图）
 */
export const CENTER_DASHBOARD_MOCK_CENTERS: CenterDashboardCenter[] = [
  {
    name: '发改-工程研究中心(产业技术创新中心)',
    provincial: 160,
    municipal: 40,
  },
  {
    name: '工信-企业技术中心',
    provincial: 178,
    municipal: 82,
  },
  {
    name: '商务-外资研发中心',
    provincial: 95,
    municipal: 55,
  },
  {
    name: '科技-工程技术研究中心',
    provincial: 120,
    municipal: 88,
  },
  {
    name: '科技-重点实验室',
    provincial: 140,
    municipal: 60,
  },
  {
    name: '科技-院士工作站',
    provincial: 88,
    municipal: 52,
  },
];
