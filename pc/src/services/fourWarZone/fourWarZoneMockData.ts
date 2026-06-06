export interface ProjectItem {
  id: string;
  name: string;
  type: string;
  amount: number;
  status: string;
  content: string;
  area: string;
  district: string;
  town: string;
  date: string;
  dataStatus: string;
}

export interface ActivityItem {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  activityContent: string;
  lxrxm: string;
  zw: string;
  lxdh: string;
  leaders: string;
  industryCode: string;
  industryName: string;
  zoneCode: string;
  zoneName: string;
  townCode: string;
  townName: string;
  zjbAddress: string;
  zjbCode: string;
  images: string;
  auditId: string;
  auditStatus: number;
  auditTime: string;
  auditRemark: string;
  createTime: string;
  updateTime: string;
}

export interface BusinessTripItem {
  id: string;
  createTime: string;
  updateTime: string;
  code: string;
  name: string;
  zoneCode: string;
  zoneName: string;
  townCode: string;
  townName: string;
  year: string;
  groupName: string;
  mainMembers: string;
  visitDestination: string;
  activitiesAndVisits: string;
  achievements: string;
  nextPlan: string;
}

export interface PersonItem {
  id: string;
  name: string;
  specialization: string;
  position: string;
  investPlace: string;
  districtCode: string;
  district: string;
  zoneCode: string;
  zone: string;
  townCode: string;
  town: string;
  xl: string;
  phone: string;
}

export interface RequirementItem {
  id: string;
  createTime: string;
  updateTime: string;
  districtCode: string;
  districtName: string | null;
  zoneCode: string;
  zoneName: string;
  townCode: string | null;
  townName: string | null;
  place: string;
  title: string;
  content: string;
  expectTime: string;
  linkerName: string;
  linkerTel: string;
  filePath: string;
  status: number;
  auditId: string | null;
  auditName: string | null;
  auditTime: string | null;
  auditRemark: string;
  replyId: string | null;
  replyName: string | null;
  replyTime: string | null;
  replyContent: string;
  creatorId: string;
  creatorName: string | null;
}

export interface StatItem {
  icon: string;
  label: string;
  value: string;
  color: string;
  dataIndex: string;
}

export interface ProjectTypeItem {
  value: string;
  label: string;
}

export const PROJECT_TABLE_DATA: ProjectItem[] = [
  {
    id: '1',
    name: '杜进',
    type: '内资',
    amount: 0.9,
    status: '在谈',
    content: '项目拟购标厂房约2800平...',
    area: '医药高新区(高港区)',
    district: '电子信息产业区',
    town: '镇街1',
    date: '2026-04-14 10:02:25',
    dataStatus: '数据至当日',
  },
  {
    id: '2',
    name: '深圳市凯丰利科技有限...',
    type: '内资',
    amount: 5,
    status: '等待签约',
    content: '项目拟购标厂房约2800平...',
    area: '医药高新区(高港区)',
    district: '电子信息产业区',
    town: '镇街2',
    date: '2026-04-14 10:02:25',
    dataStatus: '数据至当日',
  },
  {
    id: '3',
    name: '上海恒达科技有限公司',
    type: '内资',
    amount: 3.2,
    status: '在谈',
    content: '拟投资建设智能制造基地...',
    area: '海陵区',
    district: '海陵工业园区',
    town: '镇街3',
    date: '2026-04-13 14:30:15',
    dataStatus: '数据至当日',
  },
  {
    id: '4',
    name: '江苏鼎益食品有限公司',
    type: '内资',
    amount: 1.05,
    status: '已签约',
    content: '项目拟购标厂房约2800平...',
    area: '医药高新区(高港区)',
    district: '高新区其他',
    town: '镇街4',
    date: '2026-04-12 09:15:42',
    dataStatus: '数据至当日',
  },
  {
    id: '5',
    name: '杭州创新医药科技公司',
    type: '内资',
    amount: 8.5,
    status: '等待签约',
    content: '新建生物医药研发中心...',
    area: '姜堰区',
    district: '姜堰经济开发区',
    town: '镇街5',
    date: '2026-04-11 16:45:33',
    dataStatus: '数据至当日',
  },
  {
    id: '6',
    name: '潘彬',
    type: '外资',
    amount: 0.8,
    status: '广告考察',
    content: '项目拟购标厂房约2800平...',
    area: '医药高新区(高港区)',
    district: '高新区其他',
    town: '镇街6',
    date: '2026-04-10 11:20:08',
    dataStatus: '数据至当日',
  },
  {
    id: '7',
    name: '泰州城发房地产开发有...',
    type: '内资',
    amount: 6.5,
    status: '规划签约',
    content: '项目拟购标厂房约2800平...',
    area: '医药高新区(高港区)',
    district: '高新区其他',
    town: '镇街7',
    date: '2026-04-09 15:55:12',
    dataStatus: '数据至当日',
  },
  {
    id: '8',
    name: '苏州工业园区科技公司',
    type: '内资',
    amount: 4.2,
    status: '在谈',
    content: '投资建设半导体封装项目...',
    area: '泰兴市',
    district: '泰兴经济开发区',
    town: '镇街8',
    date: '2026-04-08 10:30:25',
    dataStatus: '数据至当日',
  },
  {
    id: '9',
    name: '南京智能制造有限公司',
    type: '内资',
    amount: 2.8,
    status: '已签约',
    content: '引进高端制造生产线...',
    area: '靖江市',
    district: '靖江经济开发区',
    town: '镇街9',
    date: '2026-04-07 14:10:45',
    dataStatus: '数据至当日',
  },
  {
    id: '10',
    name: '无锡新材料科技集团',
    type: '内资',
    amount: 7.3,
    status: '等待签约',
    content: '建设新材料研发生产基地...',
    area: '兴化市',
    district: '兴化经济开发区',
    town: '镇街10',
    date: '2026-04-06 09:45:18',
    dataStatus: '数据至当日',
  },
  {
    id: '11',
    name: '常州精密机械有限公司',
    type: '外资',
    amount: 3.5,
    status: '在谈',
    content: '精密机械加工项目...',
    area: '海陵区',
    district: '海陵工业园区',
    town: '镇街11',
    date: '2026-04-05 16:20:33',
    dataStatus: '数据至当日',
  },
  {
    id: '12',
    name: '宁波电子科技有限公司',
    type: '内资',
    amount: 1.5,
    status: '广告考察',
    content: '电子产品组装生产线...',
    area: '姜堰区',
    district: '姜堰经济开发区',
    town: '镇街12',
    date: '2026-04-04 11:05:55',
    dataStatus: '数据至当日',
  },
  {
    id: '13',
    name: '合肥新能源科技公司',
    type: '内资',
    amount: 9.8,
    status: '规划签约',
    content: '新能源电池生产项目...',
    area: '医药高新区(高港区)',
    district: '电子信息产业区',
    town: '镇街13',
    date: '2026-04-03 14:35:20',
    dataStatus: '数据至当日',
  },
  {
    id: '14',
    name: '广州生物医药企业',
    type: '外资',
    amount: 12.5,
    status: '等待签约',
    content: '生物制药研发生产基地...',
    area: '泰兴市',
    district: '泰兴经济开发区',
    town: '镇街14',
    date: '2026-04-02 10:15:38',
    dataStatus: '数据至当日',
  },
  {
    id: '15',
    name: '北京数字科技有限公司',
    type: '内资',
    amount: 2.1,
    status: '在谈',
    content: '数字经济产业园项目...',
    area: '靖江市',
    district: '靖江经济开发区',
    town: '镇街15',
    date: '2026-04-01 15:40:12',
    dataStatus: '数据至当日',
  },
];

export const ACTIVITY_DATA: ActivityItem[] = [
  {
    id: '1',
    code: '001001',
    name: '靖江市招商活动',
    startTime: '2026-05-01',
    endTime: '2026-05-22',
    activityContent: '11111',
    lxrxm: '',
    zw: '',
    lxdh: '',
    leaders: '11',
    industryCode: '2',
    industryName: '2-传统产业',
    zoneCode: '001001001',
    zoneName: '靖江经济技术开发区（本部）',
    townCode: '',
    townName: '',
    zjbAddress: '北京（京津冀区域）',
    zjbCode: '101',
    images: '',
    auditId: '',
    auditStatus: 0,
    auditTime: '',
    auditRemark: '',
    createTime: '2026-05-18T09:42:44',
    updateTime: '2026-05-18T09:45:33',
  },
];

export const PERSON_DATA: PersonItem[] = [
  {
    id: '1',
    name: '蔡禄志',
    specialization: '产业招商',
    position: '泰州经济开发区三级调研员',
    investPlace: '泰州市',
    districtCode: '321200',
    district: '泰州市',
    zoneCode: '321200001',
    zone: '泰州经济开发区',
    townCode: '32120000101',
    town: '海陵区',
    xl: '本科',
    phone: '13952661908',
  },
  {
    id: '2',
    name: '张晓明',
    specialization: '产业招商',
    position: '医药高新区招商局副局长',
    investPlace: '泰州市',
    districtCode: '321200',
    district: '泰州市',
    zoneCode: '321200002',
    zone: '医药高新区',
    townCode: '32120000201',
    town: '高港区',
    xl: '硕士',
    phone: '13852668899',
  },
  {
    id: '3',
    name: '李雪梅',
    specialization: '产业招商',
    position: '海陵区招商科科长',
    investPlace: '泰州市',
    districtCode: '321200',
    district: '泰州市',
    zoneCode: '321200003',
    zone: '海陵区',
    townCode: '32120000301',
    town: '海陵区',
    xl: '本科',
    phone: '13752667788',
  },
  {
    id: '4',
    name: '王建国',
    specialization: '产业招商',
    position: '姜堰区招商局局长',
    investPlace: '泰州市',
    districtCode: '321200',
    district: '泰州市',
    zoneCode: '321200004',
    zone: '姜堰区',
    townCode: '32120000401',
    town: '姜堰区',
    xl: '博士',
    phone: '13652666677',
  },
  {
    id: '5',
    name: '刘芳华',
    specialization: '产业招商',
    position: '泰兴市招商专员',
    investPlace: '泰州市',
    districtCode: '321200',
    district: '泰州市',
    zoneCode: '321200005',
    zone: '泰兴市',
    townCode: '32120000501',
    town: '泰兴市',
    xl: '本科',
    phone: '13552665566',
  },
  {
    id: '6',
    name: '陈志强',
    specialization: '产业招商',
    position: '靖江市招商局副局长',
    investPlace: '泰州市',
    districtCode: '321200',
    district: '泰州市',
    zoneCode: '321200006',
    zone: '靖江市',
    townCode: '32120000601',
    town: '靖江市',
    xl: '硕士',
    phone: '13452664455',
  },
  {
    id: '7',
    name: '赵雅琴',
    specialization: '产业招商',
    position: '兴化市招商科副科长',
    investPlace: '泰州市',
    districtCode: '321200',
    district: '泰州市',
    zoneCode: '321200007',
    zone: '兴化市',
    townCode: '32120000701',
    town: '兴化市',
    xl: '本科',
    phone: '13352663344',
  },
  {
    id: '8',
    name: '孙伟明',
    specialization: '产业招商',
    position: '泰州港经济开发区招商专员',
    investPlace: '泰州市',
    districtCode: '321200',
    district: '泰州市',
    zoneCode: '321200008',
    zone: '泰州港经济开发区',
    townCode: '32120000801',
    town: '泰州港',
    xl: '本科',
    phone: '13252662233',
  },
  {
    id: '9',
    name: '周丽华',
    specialization: '产业招商',
    position: '海陵工业园区招商局局长',
    investPlace: '泰州市',
    districtCode: '321200',
    district: '泰州市',
    zoneCode: '321200009',
    zone: '海陵工业园区',
    townCode: '32120000901',
    town: '海陵工业园',
    xl: '硕士',
    phone: '13152661122',
  },
  {
    id: '10',
    name: '吴海涛',
    specialization: '产业招商',
    position: '高港区招商科科长',
    investPlace: '泰州市',
    districtCode: '321200',
    district: '泰州市',
    zoneCode: '321200010',
    zone: '高港区',
    townCode: '32120001001',
    town: '高港区',
    xl: '本科',
    phone: '13052660011',
  },
  {
    id: '11',
    name: '郑婷婷',
    specialization: '产业招商',
    position: '医药高新区招商专员',
    investPlace: '泰州市',
    districtCode: '321200',
    district: '泰州市',
    zoneCode: '321200011',
    zone: '医药高新区',
    townCode: '32120001101',
    town: '医药城',
    xl: '本科',
    phone: '12952669900',
  },
  {
    id: '12',
    name: '黄志伟',
    specialization: '产业招商',
    position: '泰州经济开发区招商局副局长',
    investPlace: '泰州市',
    districtCode: '321200',
    district: '泰州市',
    zoneCode: '321200001',
    zone: '泰州经济开发区',
    townCode: '32120000102',
    town: '经开区',
    xl: '硕士',
    phone: '12852668899',
  },
];

export const STATS_DATA: StatItem[] = [
  {
    icon: 'RiseOutlined',
    label: '在谈项目',
    value: '127',
    color: '#16A34A',
    dataIndex: 'talkingCount',
  },
  {
    icon: 'UserOutlined',
    label: '招商活动',
    value: '12',
    color: '#7C3AED',
    dataIndex: 'investmentActivityCount',
  },
  {
    icon: 'UserOutlined',
    label: '因公出访',
    value: '12',
    color: '#7C3AED',
    dataIndex: 'officialVisitCount',
  },
  {
    icon: 'RiseOutlined',
    label: '累计投资额',
    value: '86.3亿',
    color: '#EA580C',
    dataIndex: 'totalInvestmentAmount',
  },
  {
    icon: 'TeamOutlined',
    label: '本月新增',
    value: '6个',
    color: '#2563EB',
    dataIndex: 'monthNewCount',
  },
  {
    icon: 'TeamOutlined',
    label: '累计新增',
    value: '26个',
    color: '#0891B2',
    dataIndex: 'totalNewCount',
  },
];

export const PROJECT_TYPE_DATA: ProjectTypeItem[] = [
  { value: '内资', label: '内资' },
  { value: '外资', label: '外资' },
];

export const PROJECT_STATUS_DATA: ProjectTypeItem[] = [
  { value: '1', label: '在谈' },
  { value: '2', label: '签约' },
  { value: '3', label: '注册' },
  { value: '4', label: '备案' },
  { value: '5', label: '报批' },
  { value: '6', label: '开工' },
  { value: '7', label: '竣工' },
];

export const AREA_DATA: ProjectTypeItem[] = [
  { value: '靖江市', label: '靖江市' },
  { value: '海陵区', label: '海陵区' },
  { value: '泰兴市', label: '泰兴市' },
  { value: '姜堰区', label: '姜堰区' },
  { value: '医药高新区（高港区）', label: '医药高新区（高港区）' },
  { value: '兴化市', label: '兴化市' },
];

export const DISTRICT_DATA: ProjectTypeItem[] = [
  { value: '黄桥经济开发区（本部）', label: '黄桥经济开发区（本部）' },
  { value: '黄桥经济开发区', label: '黄桥经济开发区' },
  { value: '高端装备制造产业园', label: '高端装备制造产业园' },
  { value: '高港核心港区', label: '高港核心港区' },
  { value: '高港区其他', label: '高港区其他' },
  { value: '高新区其他', label: '高新区其他' },
  { value: '靖江经济技术开发区（本部）', label: '靖江经济技术开发区（本部）' },
  { value: '靖江经济技术开发区', label: '靖江经济技术开发区' },
  { value: '靖江市其他', label: '靖江市其他' },
  { value: '靖江城南园区', label: '靖江城南园区' },
  { value: '靖江城北园区', label: '靖江城北园区' },
  { value: '电子信息产业园', label: '电子信息产业园' },
  { value: '生物医药产业园', label: '生物医药产业园' },
  { value: '港口产业园', label: '港口产业园' },
  { value: '海陵新能源产业园', label: '海陵新能源产业园' },
  { value: '海陵工业园区（本部）', label: '海陵工业园区（本部）' },
  { value: '海陵区其他', label: '海陵区其他' },
  { value: '泰兴高新技术产业开发区', label: '泰兴高新技术产业开发区' },
  { value: '泰兴虹桥工业园区', label: '泰兴虹桥工业园区' },
  { value: '泰兴经济开发区（本部）', label: '泰兴经济开发区（本部）' },
  { value: '泰兴经济开发区', label: '泰兴经济开发区' },
  { value: '泰兴市其他', label: '泰兴市其他' },
  { value: '江阴-靖江工业园区', label: '江阴-靖江工业园区' },
  { value: '姜堰高新技术产业开发区', label: '姜堰高新技术产业开发区' },
  { value: '姜堰经济开发区（本部）', label: '姜堰经济开发区（本部）' },
  { value: '姜堰经济开发区', label: '姜堰经济开发区' },
  { value: '姜堰现代科技产业园区', label: '姜堰现代科技产业园区' },
  { value: '姜堰区其他', label: '姜堰区其他' },
  { value: '化学新材料产业园', label: '化学新材料产业园' },
  { value: '兴化高新技术产业开发区', label: '兴化高新技术产业开发区' },
  { value: '兴化经济开发区（本部）', label: '兴化经济开发区（本部）' },
  { value: '兴化经济开发区', label: '兴化经济开发区' },
  { value: '兴化市其他', label: '兴化市其他' },
];

export const INDUSTRY_CHAIN_DATA: ProjectTypeItem[] = [
  { value: '1', label: '生物医药' },
  { value: '2', label: '电子信息' },
  { value: '3', label: '新材料' },
  { value: '4', label: '新能源' },
  { value: '5', label: '高端装备制造' },
  { value: '6', label: '现代服务业' },
];

export const AUDIT_STATUS_DATA: ProjectTypeItem[] = [
  { value: '0', label: '待审核' },
  { value: '1', label: '审核通过' },
  { value: '2', label: '审核不通过' },
];

export const EDUCATION_DATA: ProjectTypeItem[] = [
  { value: '01', label: '小学' },
  { value: '02', label: '初中' },
  { value: '03', label: '高中' },
  { value: '04', label: '大专' },
  { value: '05', label: '本科' },
  { value: '06', label: '硕士研究生' },
  { value: '07', label: '博士研究生' },
];

export const INVEST_DIRECTION_DATA: ProjectTypeItem[] = [
  { value: '1', label: '产业招商' },
  { value: '2', label: '科技招商' },
  { value: '3', label: '金融招商' },
  { value: '4', label: '文旅招商' },
];

export const GROUP_NAME_DATA: ProjectTypeItem[] = [
  { value: '1', label: '医药高新区招商团' },
  { value: '2', label: '海陵区招商团' },
  { value: '3', label: '姜堰区招商团' },
  { value: '4', label: '泰兴市招商团' },
  { value: '5', label: '靖江市招商团' },
  { value: '6', label: '兴化市招商团' },
];

export const MAIN_MEMBERS_DATA: ProjectTypeItem[] = [
  { value: '1', label: '张晓明' },
  { value: '2', label: '李雪梅' },
  { value: '3', label: '王建国' },
  { value: '4', label: '刘芳华' },
  { value: '5', label: '陈志强' },
  { value: '6', label: '赵雅琴' },
];

export const BUSINESS_TRIP_DATA: BusinessTripItem[] = [
  {
    id: '1',
    createTime: '2026-04-07T15:34:22',
    updateTime: '2026-04-07T15:34:22',
    code: '001002',
    name: '泰兴市',
    zoneCode: '001002005',
    zoneName: '泰兴市其他',
    townCode: '',
    townName: '',
    year: '2026',
    groupName: '团组名称',
    mainMembers: '柯基极',
    visitDestination: '中国',
    activitiesAndVisits: '主要开展活动和拜访企业主要开展活动和拜访企业',
    achievements: '成果啊啊啊啊',
    nextPlan: '打算啊啊啊啊啊',
  },
];

export const REQUIREMENT_DATA: RequirementItem[] = [
  {
    id: '1',
    createTime: '2026-05-20T11:41:13',
    updateTime: '2026-05-20T17:07:06',
    districtCode: '001002',
    districtName: null,
    zoneCode: '001002001',
    zoneName: '靖江经济技术开发区（本部）',
    townCode: null,
    townName: '靖城街道',
    place: '101',
    title: '寻求高端装备制造项目合作',
    content: '希望引进投资额超过5亿元的高端装备制造项目，包括智能制造、精密机械等领域',
    expectTime: '2026-06-30',
    linkerName: '李明华',
    linkerTel: '13952661910',
    filePath: '',
    status: 1,
    auditId: null,
    auditName: null,
    auditTime: null,
    auditRemark: '符合招商方向，已列入重点对接项目',
    replyId: null,
    replyName: null,
    replyTime: null,
    replyContent: '已安排专人跟进，正在对接3家目标企业',
    creatorId: 'WAhxwUdyqw6wHaAdaIAEXKMuM5X',
    creatorName: null,
  },
  {
    id: '2',
    createTime: '2026-05-20T11:41:13',
    updateTime: '2026-05-20T17:07:06',
    districtCode: '001002',
    districtName: null,
    zoneCode: '001002004',
    zoneName: '黄桥经济开发区（本部）',
    townCode: null,
    townName: '黄桥镇',
    place: '101',
    title: '需要化工新材料产业链项目',
    content: '围绕现有化工产业基础，寻求延链补链强链的新材料项目合作',
    expectTime: '2026-07-15',
    linkerName: '王建国',
    linkerTel: '13952661911',
    filePath: '',
    status: 1,
    auditId: null,
    auditName: null,
    auditTime: null,
    auditRemark: '符合产业链发展规划',
    replyId: null,
    replyName: null,
    replyTime: null,
    replyContent: '已与2家新材料企业进行初步洽谈',
    creatorId: 'WAhxwUdyqw6wHaAdaIAEXKMuM5X',
    creatorName: null,
  },
];

export const mockApi = {
  getProjectList: () => Promise.resolve({ data: PROJECT_TABLE_DATA }),
  getActivityList: () => Promise.resolve({ data: ACTIVITY_DATA }),
  getPersonList: () => Promise.resolve({ data: PERSON_DATA }),
  getStats: () => Promise.resolve({ data: STATS_DATA }),
  getProjectTypes: () => Promise.resolve({ data: PROJECT_TYPE_DATA }),
  getProjectStatus: () => Promise.resolve({ data: PROJECT_STATUS_DATA }),
  getAreaList: () => Promise.resolve({ data: AREA_DATA }),
  getDistrictList: () => Promise.resolve({ data: DISTRICT_DATA }),
  getIndustryChain: () => Promise.resolve({ data: INDUSTRY_CHAIN_DATA }),
  getAuditStatus: () => Promise.resolve({ data: AUDIT_STATUS_DATA }),
  getEducation: () => Promise.resolve({ data: EDUCATION_DATA }),
  getInvestDirection: () => Promise.resolve({ data: INVEST_DIRECTION_DATA }),
  getBusinessTripList: () => Promise.resolve({ data: BUSINESS_TRIP_DATA }),
  getRequirementList: () => Promise.resolve({ data: REQUIREMENT_DATA }),
};
