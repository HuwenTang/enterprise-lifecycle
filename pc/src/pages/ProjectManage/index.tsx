import { KeyProjectApplyModal } from '@/pages/KeyProject';
import { useDistrictParkOptions } from '@/hooks/useDistrictParkOptions';
import { primeApi, systemApi } from '@/services/api';
import type { ListProjectDigitalInvestmentAttractingRequest } from '@/services/apis';
import { dayjsToApiDatePreservingCalendarDay } from '@/utils/apiDate';
import { useNavigate, useModel } from '@umijs/max';
import {
  AppstoreOutlined,
  BarsOutlined,
  CheckCircleOutlined,
  CloudDownloadOutlined,
  ColumnHeightOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
  SyncOutlined,
  TagsOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Input,
  InputNumber,
  MenuProps,
  message,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  inferInvestmentRangeFromUrlAmounts,
  investmentRangeToApiAmounts,
  parseUrlInvestmentAmount,
} from './investmentRange';
import type { FieldType } from './types';

type FieldDefinition = {
  key: string;
  title: string;
  width?: number;
  exportOnly?: boolean;
  render?: (record: any, rowIndex: number) => React.ReactNode;
  exportValue?: (record: any, rowIndex: number) => string | number;
};

type AttributeOption = {
  code: string;
  label: string;
  enabled: boolean;
  sort: number;
};

const STORAGE_DISPLAY_FIELDS = 'projectManage.displayFields.v2';
const STORAGE_EXPORT_FIELDS = 'projectManage.exportFields.v2';
const PROJECT_ATTRIBUTE_CATALOG = 'project_attribute';
const PROJECT_ATTRIBUTE_CATALOG_LABEL = '项目属性';
const ATTRIBUTE_COLORS = ['blue', 'green', 'orange', 'cyan', 'purple', 'geekblue', 'red'];

const defaultDisplayFieldKeys = [
  'index',
  'projectName',
  'projectAttributeList',
  'parkName',
  'currentProjectProgressLabel',
  'investmentAmount',
  'projectContent',
  'updateTime',
  'actions',
];

const defaultExportFieldKeys = [
  'projectCode',
  'projectName',
  'projectAttributeList',
  'parkName',
  'districtName',
  'projectSource',
  'currentProjectProgressLabel',
  'investmentAmount',
  'projectContent',
  'recordName',
  'recordNumber',
  'investor',
  'attractorUnit',
  'signingTime',
  'filingApprovalDate',
  'startConfirmDate',
  'endConfirmDate',
  'updateTime',
];

const statusTabs = [
  { key: 'all', label: '全部', color: '#1677ff' },
  { key: '签约', label: '签约', color: '#35b779' },
  { key: '开工', label: '开工', color: '#ff8b34' },
  { key: '备案', label: '备案', color: '#7c63f1' },
  { key: '竣工', label: '竣工', color: '#4c9aff' },
  { key: '撤销', label: '撤销/终止', color: '#8b95a5' },
];

const localSampleProjectTemplates = [
  {
    id: 'sample-001',
    projectCode: 'XM202605001',
    projectName: '兴化复大口腔门诊部项目',
    projectAttributeList: ['市重', '招商'],
    parkName: '昭阳街道',
    districtName: '兴化市',
    currentProjectProgressLabel: '签约',
    investmentFlagLabel: '内资',
    totalInvestmentCny: 0.05,
    projectContent: '总投资约500万元，投资主要用于场地装修、设备采购及门诊运营配套。',
    updateTime: '2026-05-20 14:30',
    recordName: '兴化复大口腔门诊部建设项目',
    recordNumber: '泰兴备〔2026〕001号',
    investor: '兴化复大医疗管理有限公司',
    attractorUnit: '昭阳街道办事处',
    industryOrService: '现代服务业',
    projectSource: '自行接洽',
    projectLocation: '兴化市昭阳街道长安中路',
    signingTime: '2026-03-18',
    actualSigningTime: '2026-03-20',
    filingApprovalDate: '2026-04-02',
    plannedStartTime: '2026-05-01',
    startConfirmDate: '',
    plannedEndTime: '2026-08-30',
    endConfirmDate: '',
    factoryType: '租赁商业用房',
    plannedRentalFactoryArea: 1200,
    projectProfile: '新建口腔门诊及配套数字化诊疗中心。',
    ltCode: '',
    isLt: false,
  },
  {
    id: 'sample-002',
    projectCode: 'XM202605002',
    projectName: '船用高端阀门及配件项目',
    projectAttributeList: ['招商', '增资'],
    parkName: '姜庄镇',
    districtName: '姜堰区',
    currentProjectProgressLabel: '签约',
    investmentFlagLabel: '内资',
    totalInvestmentCny: 0.3,
    projectContent: '该项目为增资扩产项目，无新增用地，企业利用现有厂房新增智能加工设备。',
    updateTime: '2026-05-19 09:18',
    recordName: '船用高端阀门及配件智能制造项目',
    recordNumber: '泰姜备〔2026〕018号',
    investor: '江苏海工阀门科技有限公司',
    attractorUnit: '姜庄镇人民政府',
    industryOrService: '高端装备',
    projectSource: '增资扩产',
    projectLocation: '姜堰区姜庄镇工业集中区',
    signingTime: '2026-02-26',
    actualSigningTime: '2026-03-01',
    filingApprovalDate: '2026-03-18',
    plannedStartTime: '2026-04-20',
    startConfirmDate: '',
    plannedEndTime: '2026-11-30',
    endConfirmDate: '',
    factoryType: '自有厂房',
    plannedPurchaseFactoryArea: 3600,
    fixedAssetInvestment: 1800,
    equipmentInvestment: 1200,
    projectProfile: '新增高端阀门加工中心和自动化检测线。',
    ltCode: 'LT-JY-2026-018',
    isLt: true,
  },
  {
    id: 'sample-003',
    projectCode: 'XM202605003',
    projectName: '食品用包装容器项目',
    projectAttributeList: ['省重', '技改'],
    parkName: '姜堰高新区',
    districtName: '姜堰区',
    currentProjectProgressLabel: '开工',
    investmentFlagLabel: '内资',
    totalInvestmentCny: 2,
    projectContent: '项目总投资2亿元，改造厂房1万平方米，建设食品级包装容器生产线。',
    updateTime: '2026-05-18 16:45',
    recordName: '食品用包装容器智能化生产项目',
    recordNumber: '泰姜备〔2026〕026号',
    investor: '泰州绿源包装科技有限公司',
    attractorUnit: '姜堰高新区管委会',
    industryOrService: '新材料',
    projectSource: '市级机关推荐',
    projectLocation: '姜堰高新区双登大道北侧',
    signingTime: '2026-01-12',
    actualSigningTime: '2026-01-15',
    filingApprovalDate: '2026-02-08',
    plannedStartTime: '2026-03-01',
    startConfirmDate: '2026-05-08',
    plannedEndTime: '2027-02-28',
    endConfirmDate: '',
    factoryType: '新建厂房',
    plannedLandArea: 15000,
    fixedAssetInvestment: 12000,
    equipmentInvestment: 6800,
    projectProfile: '建设食品级包装容器智能制造车间。',
    ltCode: 'LT-JY-2026-026',
    isLt: true,
  },
  {
    id: 'sample-004',
    projectCode: 'XM202605004',
    projectName: '星澜互动AI混剧产业项目',
    projectAttributeList: ['招商', '数经'],
    parkName: '马桥镇',
    districtName: '靖江市',
    currentProjectProgressLabel: '备案',
    investmentFlagLabel: '内资',
    totalInvestmentCny: 1,
    projectContent: '该项目拟租用6000平方米办公楼，建设AI内容生产、数字人直播与短剧制作基地。',
    updateTime: '2026-05-17 11:22',
    recordName: 'AI混剧数字内容产业基地项目',
    recordNumber: '泰靖备〔2026〕036号',
    investor: '江苏星澜互动科技有限公司',
    attractorUnit: '马桥镇人民政府',
    industryOrService: '数字经济',
    projectSource: '自行接洽',
    projectLocation: '靖江市马桥镇数字文创园',
    signingTime: '2026-04-01',
    actualSigningTime: '2026-04-03',
    filingApprovalDate: '2026-05-10',
    plannedStartTime: '2026-06-01',
    startConfirmDate: '',
    plannedEndTime: '2026-12-20',
    endConfirmDate: '',
    factoryType: '租赁办公楼',
    plannedRentalFactoryArea: 6000,
    expectedAnnualSalesAmount: 8000,
    expectedAnnualTax: 450,
    projectProfile: '建设AI内容生产、短剧制作和数字人直播基地。',
    ltCode: '',
    isLt: false,
  },
  {
    id: 'sample-005',
    projectCode: 'XM202605005',
    projectName: '板壳式换热器制造扩产项目',
    projectAttributeList: ['技改'],
    parkName: '姜庄镇',
    districtName: '姜堰区',
    currentProjectProgressLabel: '竣工',
    investmentFlagLabel: '内资',
    totalInvestmentCny: 0.5,
    projectContent: '该项目为增资扩产项目，项目拟建厂房，新增自动焊接、检测等设备。',
    updateTime: '2026-05-16 10:05',
    recordName: '板壳式换热器智能制造扩产项目',
    recordNumber: '泰姜备〔2026〕041号',
    investor: '泰州华能换热设备有限公司',
    attractorUnit: '姜庄镇人民政府',
    industryOrService: '高端装备',
    projectSource: '增资扩产',
    projectLocation: '姜堰区姜庄镇装备产业园',
    signingTime: '2025-11-20',
    actualSigningTime: '2025-11-25',
    filingApprovalDate: '2025-12-16',
    plannedStartTime: '2026-01-05',
    startConfirmDate: '2026-02-20',
    plannedEndTime: '2026-05-20',
    endConfirmDate: '2026-05-12',
    factoryType: '新建厂房',
    plannedLandArea: 8200,
    fixedAssetInvestment: 3200,
    equipmentInvestment: 2100,
    expectedAnnualSalesAmount: 12000,
    expectedAnnualTax: 900,
    projectProfile: '扩建板壳式换热器生产线并完成试生产。',
    ltCode: 'LT-JY-2026-041',
    isLt: true,
  },
  {
    id: 'sample-006',
    projectCode: 'XM202605006',
    projectName: '年产6000吨高端生产项目',
    projectAttributeList: ['招商', '增资'],
    parkName: '珊瑚镇',
    districtName: '泰兴市',
    currentProjectProgressLabel: '开工',
    investmentFlagLabel: '外资',
    totalInvestmentUsd: 0.05,
    projectContent: '租赁厂房约4000平方米，新建喷雾、干燥、包装等生产线及环保配套设施。',
    updateTime: '2026-05-15 15:30',
    recordName: '高端功能材料生产项目',
    recordNumber: '泰兴备〔2026〕052号',
    investor: '香港鸿盛实业有限公司',
    attractorUnit: '珊瑚镇人民政府',
    industryOrService: '新材料',
    projectSource: '市级机关推荐',
    projectLocation: '泰兴市珊瑚镇工业园',
    signingTime: '2026-02-10',
    actualSigningTime: '2026-02-18',
    filingApprovalDate: '2026-03-12',
    plannedStartTime: '2026-04-01',
    startConfirmDate: '2026-05-06',
    plannedEndTime: '2026-10-31',
    endConfirmDate: '',
    factoryType: '租赁厂房',
    plannedRentalFactoryArea: 4000,
    fixedAssetInvestment: 2600,
    equipmentInvestment: 1900,
    expectedAnnualSalesAmount: 9500,
    expectedAnnualTax: 520,
    projectProfile: '建设高端功能材料生产线及环保配套设施。',
    ltCode: '',
    isLt: false,
  },
];

const LOCAL_SAMPLE_TOTAL = 11000;

const createLocalSampleProject = (index: number) => {
  const template = localSampleProjectTemplates[index % localSampleProjectTemplates.length];
  const no = index + 1;
  const statusCycle = ['签约', '开工', '备案', '竣工', '撤销/终止'];
  const status = statusCycle[index % statusCycle.length];
  const baseDate = dayjs('2026-01-01').add(index % 300, 'day');
  const isForeign = no % 9 === 0;
  const investment = Number((0.05 + (no % 240) / 20).toFixed(2));

  return {
    ...template,
    id: `sample-${String(no).padStart(5, '0')}`,
    projectCode: `XM2026${String(no).padStart(5, '0')}`,
    projectName: `${template.projectName}-${String(no).padStart(5, '0')}`,
    currentProjectProgressLabel: status,
    investmentFlagLabel: isForeign ? '外资' : '内资',
    totalInvestmentUsd: isForeign ? investment : undefined,
    totalInvestmentCny: isForeign ? undefined : investment,
    recordName: `${template.recordName}-${String(no).padStart(5, '0')}`,
    recordNumber: `泰样备〔2026〕${String(no).padStart(5, '0')}号`,
    signingTime: baseDate.format('YYYY-MM-DD'),
    actualSigningTime: baseDate.add(2, 'day').format('YYYY-MM-DD'),
    filingApprovalDate: baseDate.add(18, 'day').format('YYYY-MM-DD'),
    plannedStartTime: baseDate.add(35, 'day').format('YYYY-MM-DD'),
    startConfirmDate: ['开工', '竣工'].includes(status) ? baseDate.add(45, 'day').format('YYYY-MM-DD') : '',
    plannedEndTime: baseDate.add(180, 'day').format('YYYY-MM-DD'),
    endConfirmDate: status === '竣工' ? baseDate.add(168, 'day').format('YYYY-MM-DD') : '',
    updateTime: baseDate.add(60, 'day').format('YYYY-MM-DD HH:mm'),
    projectAttributeList: template.projectAttributeList,
    isLt: no % 3 === 0,
    ltCode: no % 3 === 0 ? `LT-SAMPLE-${String(no).padStart(5, '0')}` : '',
  };
};

const getLocalSampleProjects = (start = 0, size = LOCAL_SAMPLE_TOTAL) =>
  Array.from({ length: Math.max(0, Math.min(size, LOCAL_SAMPLE_TOTAL - start)) }, (_, index) =>
    createLocalSampleProject(start + index),
  );

const getString = (value: unknown) => (value === undefined || value === null || value === '' ? '-' : String(value));

const getInvestmentText = (record: any) => {
  const isForeign = record?.investmentFlagLabel === '外资' || record?.investmentFlag === '2';
  const value = isForeign ? record?.totalInvestmentUsd : record?.totalInvestmentCny;
  if (value === undefined || value === null || value === '') return '-';
  const n = Number(value);
  const text = Number.isFinite(n) ? n.toFixed(2) : String(value);
  return `${text}${isForeign ? '亿美元' : '亿元'}`;
};

const getDateText = (value: unknown) => {
  if (!value) return '-';
  const parsed = dayjs(value as any);
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : String(value);
};

const getAreaText = (value: unknown, unit = '平方米') => {
  if (value === undefined || value === null || value === '') return '-';
  return `${value}${unit}`;
};

const firstValue = (...values: unknown[]) =>
  values.find((value) => value !== undefined && value !== null && value !== '') ?? undefined;

const projectMatchKey = (record: any) =>
  String(record?.projectCode ?? record?.code ?? record?.projectName ?? record?.name ?? '').trim();

const mergeProjectLifecycleData = (
  project: any,
  signed?: any,
  construction?: any,
  completed?: any,
) => ({
  ...project,
  recordName: firstValue(project.recordName, signed?.checkName, project.filingApprovalProjectName),
  recordNumber: firstValue(project.recordNumber, signed?.checkCode, signed?.startCode),
  signingTime: firstValue(project.signingTime, signed?.signedDate),
  actualSigningTime: firstValue(project.actualSigningTime, signed?.signedDate),
  filingApprovalDate: firstValue(project.filingApprovalDate, signed?.checkDate),
  plannedStartTime: firstValue(project.plannedStartTime, signed?.planStartDate, construction?.plannedStartDate),
  startConfirmDate: firstValue(project.startConfirmDate, signed?.startDateCommit, completed?.commencementTime),
  plannedEndTime: firstValue(project.plannedEndTime, signed?.planEndDate, construction?.plannedCompletionDate),
  endConfirmDate: firstValue(project.endConfirmDate, signed?.completeDate, completed?.completionTime),
  projectLocation: firstValue(project.projectLocation, construction?.detailedAddress),
  factoryType: firstValue(project.factoryType, completed?.constructionNature),
  plannedLandArea: firstValue(project.plannedLandArea, completed?.proposedLandArea),
  plannedRentalFactoryArea: firstValue(project.plannedRentalFactoryArea, completed?.proposedRentalFactoryArea),
  fixedAssetInvestment: firstValue(project.fixedAssetInvestment, completed?.plannedFixedAssetInvestment),
  projectProfile: firstValue(project.projectProfile, signed?.desc, completed?.constructionScaleAndMainContent),
});

const enrichProjectLifecycleData = async (records: any[]) => {
  if (!records.length || isLocalPreview()) return records;
  try {
    const [signedRes, constructionResults, completedRes] = await Promise.all([
      withTimeout((primeApi as any).listExtZsProjProjectSigned?.({ page: 1, size: 1000 }) ?? Promise.resolve({ records: [] }), { records: [] }, 2500),
      Promise.all(
        records.map((record) =>
          withTimeout(
            (primeApi as any).listProjectConstructionApproval?.({
              projectCode: record.projectCode,
              projectName: record.projectName,
              page: 1,
              size: 1,
            }) ?? Promise.resolve({ records: [] }),
            { records: [] },
            1800,
          ).catch(() => ({ records: [] })),
        ),
      ),
      withTimeout((primeApi as any).listProjectCompletedInfo?.({ page: 1, size: 1000 }) ?? Promise.resolve({ records: [] }), { records: [] }, 2500),
    ]);
    const signedMap = new Map<string, any>();
    (signedRes.records ?? []).forEach((item: any) => signedMap.set(projectMatchKey(item), item));
    const completedMap = new Map<string, any>();
    (completedRes.records ?? []).forEach((item: any) => completedMap.set(projectMatchKey(item), item));
    return records.map((record, index) => {
      const key = projectMatchKey(record);
      return mergeProjectLifecycleData(
        record,
        signedMap.get(key) ?? signedMap.get(record.projectName),
        constructionResults[index]?.records?.[0],
        completedMap.get(key) ?? completedMap.get(record.projectName),
      );
    });
  } catch {
    return records;
  }
};

const normalizeAttributeList = (record: any): string[] => {
  const raw = record?.projectAttributeList ?? record?.projectAttributes ?? record?.attributeList;
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw === 'string') return raw.split(/[,，/、\s]+/).filter(Boolean);
  return [];
};

const readJsonStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJsonStorage = (key: string, value: unknown) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const isLocalPreview = () =>
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const withTimeout = async <T,>(task: Promise<T>, fallback: T, timeout = 3500): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      task,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), timeout);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

const escapeCsvCell = (value: unknown) => {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

const downloadCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const content = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => row.map(escapeCsvCell).join(',')),
  ].join('\r\n');
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const rangeToStartEnd = (r?: [dayjs.Dayjs, dayjs.Dayjs]) => {
  if (!r?.[0]?.isValid?.() || !r?.[1]?.isValid?.()) return { start: undefined, end: undefined };
  return {
    start: dayjsToApiDatePreservingCalendarDay(r[0]),
    end: dayjsToApiDatePreservingCalendarDay(r[1]),
  };
};

const parseYearNum = (y: unknown) => {
  if (y === undefined || y === null || y === '') return undefined;
  const n = Number(y);
  return Number.isFinite(n) ? n : undefined;
};

function buildListApiFilters(values: FieldType): ListProjectDigitalInvestmentAttractingRequest {
  const currentProgress = values.currentProjectProgress?.length ? values.currentProjectProgress : undefined;
  const signingActual = rangeToStartEnd(values.signingDateRange);
  const signingStat = rangeToStartEnd(values.signingStatRange);
  const record = rangeToStartEnd(values.recordTimeRange);
  const start = rangeToStartEnd(values.startTimeRange);
  const end = rangeToStartEnd(values.endTimeRange);
  return {
    showAll: true,
    projectName: values.projectName || undefined,
    recordName: values.recordName || undefined,
    recordNumber: values.recordNumber || undefined,
    currentProjectProgress: currentProgress,
    projectContent: values.projectContent || undefined,
    isListedProject: values.isListedProject === true || values.isListedProject === false ? values.isListedProject : undefined,
    park: values.park || undefined,
    district: values.district || undefined,
    year: parseYearNum(values.year),
    investor: values.investor || undefined,
    attractorUnit: values.attractorUnit,
    investmentFlag: values.investmentFlag || undefined,
    industryOrService: values.industryOrService || undefined,
    projectSource: values.projectSource || undefined,
    ...investmentRangeToApiAmounts(values.investmentAmountRange),
    actualSigningTime1: signingActual.start,
    actualSigningTime2: signingActual.end,
    signingTime1: signingStat.start,
    signingTime2: signingStat.end,
    recordTime1: record.start,
    recordTime2: record.end,
    startTime1: start.start,
    startTime2: start.end,
    endTime1: end.start,
    endTime2: end.end,
  };
}

const ProjectManage = () => {
  const [form] = Form.useForm<FieldType>();
  const [ltForm] = Form.useForm();
  const [attributeForm] = Form.useForm();
  const navigate = useNavigate();
  const { initialState } = useModel('@@initialState');
  const [searchParams, setSearchParams] = useSearchParams();
  const isAdmin = Boolean(
    (initialState?.currentUser as any)?.access === 'admin' ||
    ((initialState?.currentUser as any)?.roleIds ?? []).map(String).includes('00'),
  );

  const {
    districtOptions,
    parkOptions: searchParkOptions,
    load: loadDistrictPark,
    updateParkByDistrict,
    inferDistrictByPark,
    fullDistrictOpts,
  } = useDistrictParkOptions();

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [progressDict, setProgressDict] = useState<{ value: string; label: string }[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showMoreSearch, setShowMoreSearch] = useState(false);
  const [displayFieldKeys, setDisplayFieldKeys] = useState<string[]>(() => readJsonStorage(STORAGE_DISPLAY_FIELDS, defaultDisplayFieldKeys));
  const [exportFieldKeys, setExportFieldKeys] = useState<string[]>(() => readJsonStorage(STORAGE_EXPORT_FIELDS, defaultExportFieldKeys));
  const [attributeOptions, setAttributeOptions] = useState<AttributeOption[]>([]);
  const [fieldModalOpen, setFieldModalOpen] = useState(false);
  const [attributeModalOpen, setAttributeModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyRecord, setApplyRecord] = useState<any>(null);
  const [isLtModalOpen, setIsLtModalOpen] = useState(false);
  const [ltEditingId, setLtEditingId] = useState('');
  const [pagination, setPagination] = useState({
    current: parseInt(searchParams.get('page') || '1', 10),
    pageSize: parseInt(searchParams.get('pageSize') || '10', 10),
    total: 0,
  });

  const urlParams = useMemo(() => {
    const p = searchParams;
    const a1 = parseUrlInvestmentAmount(p.get('investmentAmount1') ?? undefined);
    const a2 = parseUrlInvestmentAmount(p.get('investmentAmount2') ?? undefined);
    return {
      projectName: p.get('projectName') || '',
      recordName: p.get('recordName') || '',
      recordNumber: p.get('recordNumber') || '',
      currentProjectProgress: p.get('currentProjectProgress')?.split(',') ?? [],
      projectContent: p.get('projectContent') || '',
      year: p.get('year') ?? undefined,
      investor: p.get('investor') || '',
      attractorUnit: p.get('attractorUnit') || '',
      park: p.get('park') ?? undefined,
      isListedProject: p.get('isListedProject') === null ? undefined : p.get('isListedProject') === 'true',
      district: p.get('district') ?? undefined,
      investmentFlag: p.get('investmentFlag') ?? undefined,
      industryOrService: p.get('industryOrService') ?? undefined,
      projectSource: p.get('projectSource') ?? undefined,
      investmentAmount1: a1,
      investmentAmount2: a2,
      investmentAmountRange: inferInvestmentRangeFromUrlAmounts(a1, a2) ?? 'all',
      actualSigningTime1: p.get('actualSigningTime1') || p.get('signingDate1') || undefined,
      actualSigningTime2: p.get('actualSigningTime2') || p.get('signingDate2') || undefined,
      signingTime1: p.get('signingTime1') ?? undefined,
      signingTime2: p.get('signingTime2') ?? undefined,
      recordTime1: p.get('recordTime1') ?? undefined,
      recordTime2: p.get('recordTime2') ?? undefined,
      startTime1: p.get('startTime1') ?? undefined,
      startTime2: p.get('startTime2') ?? undefined,
      endTime1: p.get('endTime1') ?? undefined,
      endTime2: p.get('endTime2') ?? undefined,
      page: parseInt(p.get('page') || '1', 10),
      pageSize: parseInt(p.get('pageSize') || '10', 10),
    };
  }, []);

  const attributeColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    attributeOptions.forEach((item, index) => {
      map[item.label] = ATTRIBUTE_COLORS[index % ATTRIBUTE_COLORS.length];
      map[item.code] = ATTRIBUTE_COLORS[index % ATTRIBUTE_COLORS.length];
    });
    return map;
  }, [attributeOptions]);

  const fieldDefinitions = useMemo<FieldDefinition[]>(() => [
    {
      key: 'index',
      title: '序号',
      width: 76,
      render: (_record, rowIndex) => (pagination.current - 1) * pagination.pageSize + rowIndex + 1,
      exportValue: (_record, rowIndex) => (pagination.current - 1) * pagination.pageSize + rowIndex + 1,
    },
    {
      key: 'projectName',
      title: '项目名称',
      width: 210,
      render: (record) => <span title={record?.projectName}>{getString(record?.projectName)}</span>,
      exportValue: (record) => getString(record?.projectName),
    },
    {
      key: 'projectAttributeList',
      title: '项目属性',
      width: 150,
      render: (record) => {
        const list = normalizeAttributeList(record);
        if (!list.length) return '-';
        return (
          <Space size={[4, 4]} wrap>
            {list.map((item) => (
              <Tag key={item} color={attributeColorMap[item] || 'blue'}>{item}</Tag>
            ))}
          </Space>
        );
      },
      exportValue: (record) => normalizeAttributeList(record).join('、'),
    },
    { key: 'parkName', title: '所属板块', width: 140, render: (record) => getString(record?.parkName ?? record?.park), exportValue: (record) => getString(record?.parkName ?? record?.park) },
    { key: 'districtName', title: '所属市区', width: 140, render: (record) => getString(record?.districtName ?? record?.district), exportValue: (record) => getString(record?.districtName ?? record?.district) },
    { key: 'projectCode', title: '项目编号', width: 150, render: (record) => getString(record?.projectCode), exportValue: (record) => getString(record?.projectCode) },
    { key: 'projectSource', title: '项目来源', width: 140, render: (record) => getString(record?.projectSource ?? record?.source), exportValue: (record) => getString(record?.projectSource ?? record?.source) },
    {
      key: 'currentProjectProgressLabel',
      title: '项目状态',
      width: 130,
      render: (record) => <StatusTag text={record?.currentProjectProgressLabel} />,
      exportValue: (record) => getString(record?.currentProjectProgressLabel),
    },
    { key: 'investmentAmount', title: '投资额', width: 130, render: (record) => getInvestmentText(record), exportValue: (record) => getInvestmentText(record) },
    {
      key: 'projectContent',
      title: '项目简介',
      width: 360,
      render: (record) => (
        <span title={record?.projectContent} style={{ display: 'block', maxWidth: 330, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {getString(record?.projectContent)}
        </span>
      ),
      exportValue: (record) => getString(record?.projectContent),
    },
    { key: 'recordName', title: '备案项目名称', width: 180, exportOnly: true, render: (record) => getString(record?.recordName), exportValue: (record) => getString(record?.recordName) },
    { key: 'recordNumber', title: '备案项目代码', width: 180, exportOnly: true, render: (record) => getString(record?.recordNumber), exportValue: (record) => getString(record?.recordNumber) },
    { key: 'filingApprovalDate', title: '备案日期', width: 130, render: (record) => getDateText(record?.filingApprovalDate), exportValue: (record) => getDateText(record?.filingApprovalDate) },
    { key: 'signingTime', title: '签约时间', width: 130, render: (record) => getDateText(record?.signingTime), exportValue: (record) => getDateText(record?.signingTime) },
    { key: 'actualSigningTime', title: '实际签约时间', width: 140, render: (record) => getDateText(record?.actualSigningTime), exportValue: (record) => getDateText(record?.actualSigningTime) },
    { key: 'plannedStartTime', title: '计划开工时间', width: 140, render: (record) => getDateText(record?.plannedStartTime), exportValue: (record) => getDateText(record?.plannedStartTime) },
    { key: 'startConfirmDate', title: '开工确认时间', width: 140, render: (record) => getDateText(record?.startConfirmDate), exportValue: (record) => getDateText(record?.startConfirmDate) },
    { key: 'plannedEndTime', title: '计划竣工时间', width: 140, render: (record) => getDateText(record?.plannedEndTime), exportValue: (record) => getDateText(record?.plannedEndTime) },
    { key: 'endConfirmDate', title: '竣工确认时间', width: 140, render: (record) => getDateText(record?.endConfirmDate), exportValue: (record) => getDateText(record?.endConfirmDate) },
    { key: 'investor', title: '投资方名称', width: 180, render: (record) => getString(record?.investor), exportValue: (record) => getString(record?.investor) },
    { key: 'attractorUnit', title: '招引单位', width: 180, exportOnly: true, render: (record) => getString(record?.attractorUnit), exportValue: (record) => getString(record?.attractorUnit) },
    { key: 'investmentFlagLabel', title: '项目类别', width: 120, render: (record) => getString(record?.investmentFlagLabel), exportValue: (record) => getString(record?.investmentFlagLabel) },
    { key: 'industryOrService', title: '所属产业', width: 140, render: (record) => getString(record?.industryOrService), exportValue: (record) => getString(record?.industryOrService) },
    { key: 'projectLocation', title: '项目选址位置', width: 220, render: (record) => getString(record?.projectLocation), exportValue: (record) => getString(record?.projectLocation) },
    { key: 'factoryType', title: '厂房类型', width: 130, render: (record) => getString(record?.factoryType), exportValue: (record) => getString(record?.factoryType) },
    { key: 'plannedLandArea', title: '拟用地面积', width: 130, render: (record) => getAreaText(record?.plannedLandArea), exportValue: (record) => getAreaText(record?.plannedLandArea) },
    { key: 'plannedRentalFactoryArea', title: '拟租厂房面积', width: 140, render: (record) => getAreaText(record?.plannedRentalFactoryArea), exportValue: (record) => getAreaText(record?.plannedRentalFactoryArea) },
    { key: 'plannedPurchaseFactoryArea', title: '拟购厂房面积', width: 140, render: (record) => getAreaText(record?.plannedPurchaseFactoryArea), exportValue: (record) => getAreaText(record?.plannedPurchaseFactoryArea) },
    { key: 'fixedAssetInvestment', title: '固定资产投资', width: 140, render: (record) => getAreaText(record?.fixedAssetInvestment, '万元'), exportValue: (record) => getAreaText(record?.fixedAssetInvestment, '万元') },
    { key: 'equipmentInvestment', title: '设备投资', width: 130, render: (record) => getAreaText(record?.equipmentInvestment, '万元'), exportValue: (record) => getAreaText(record?.equipmentInvestment, '万元') },
    { key: 'expectedAnnualSalesAmount', title: '预计年销售', width: 130, render: (record) => getAreaText(record?.expectedAnnualSalesAmount, '万元'), exportValue: (record) => getAreaText(record?.expectedAnnualSalesAmount, '万元') },
    { key: 'expectedAnnualTax', title: '预计年税收', width: 130, render: (record) => getAreaText(record?.expectedAnnualTax, '万元'), exportValue: (record) => getAreaText(record?.expectedAnnualTax, '万元') },
    { key: 'projectProfile', title: '项目简介', width: 280, render: (record) => getString(record?.projectProfile), exportValue: (record) => getString(record?.projectProfile) },
    { key: 'isLt', title: '是否列统', width: 110, render: (record) => (record?.isLt === true ? '是' : record?.isLt === false ? '否' : '-'), exportValue: (record) => (record?.isLt === true ? '是' : record?.isLt === false ? '否' : '-') },
    { key: 'ltCode', title: '统计编码', width: 150, render: (record) => getString(record?.ltCode), exportValue: (record) => getString(record?.ltCode) },
    { key: 'updateTime', title: '更新时间', width: 180, render: (record) => getString(record?.updateTime ?? record?.updatedTime ?? record?.createTime), exportValue: (record) => getString(record?.updateTime ?? record?.updatedTime ?? record?.createTime) },
    {
      key: 'actions',
      title: '操作',
      width: 210,
      render: (record) => <RowActions record={record} />,
    },
  ], [attributeColorMap, pagination.current, pagination.pageSize]);

  const exportableFields = fieldDefinitions.filter((field) => field.key !== 'actions' && field.key !== 'index');
  const displayableFields = fieldDefinitions.filter((field) => !field.exportOnly);

  const updateUrlParams = (params: Record<string, string | number | boolean | string[] | null | undefined>) => {
    const next = new URLSearchParams(searchParams);
    next.delete('projectCode');
    next.delete('projectCategory');
    next.delete('signedProjectStatus');
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) return;
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) next.delete(key);
      else if (Array.isArray(value)) next.set(key, value.join(','));
      else next.set(key, String(value));
    });
    setSearchParams(next);
  };

  const getListRequestParams = (
    page: number,
    size: number,
    submitted?: FieldType,
  ): ListProjectDigitalInvestmentAttractingRequest => {
    const storeAll = form.getFieldsValue(true) as FieldType;
    const v = submitted ? ({ ...storeAll, ...submitted } as FieldType) : storeAll;
    const filters = buildListApiFilters(v);
    const rangeIsAll = !v.investmentAmountRange || v.investmentAmountRange === 'all';
    const presetFromUrl = inferInvestmentRangeFromUrlAmounts(urlParams.investmentAmount1, urlParams.investmentAmount2);
    if (rangeIsAll && presetFromUrl === undefined && (urlParams.investmentAmount1 !== undefined || urlParams.investmentAmount2 !== undefined)) {
      filters.investmentAmount1 = urlParams.investmentAmount1;
      filters.investmentAmount2 = urlParams.investmentAmount2;
    }
    return { ...filters, page, size };
  };

const fetchData = async (params: Partial<ListProjectDigitalInvestmentAttractingRequest>) => {
    setLoading(true);
    try {
      if (isLocalPreview()) {
        const page = Number(params.page ?? 1);
        const size = Number(params.size ?? 10);
        const projectName = String(params.projectName ?? '').trim();
        const projectContent = String(params.projectContent ?? '').trim();
        const currentProjectProgress = Array.isArray(params.currentProjectProgress) ? params.currentProjectProgress.map(String) : [];
        const hasFilters = Boolean(
          projectName ||
          projectContent ||
          params.investmentFlag ||
          params.industryOrService ||
          params.projectSource ||
          currentProjectProgress.length,
        );
        const filtered = hasFilters ? getLocalSampleProjects().filter((record) => {
          if (projectName && !record.projectName.includes(projectName)) return false;
          if (projectContent && !record.projectContent.includes(projectContent)) return false;
          if (params.investmentFlag && record.investmentFlagLabel !== params.investmentFlag) return false;
          if (params.industryOrService && record.industryOrService !== params.industryOrService) return false;
          if (params.projectSource && record.projectSource !== params.projectSource) return false;
          if (currentProjectProgress.length && !currentProjectProgress.some((item) => record.currentProjectProgressLabel.includes(item))) return false;
          return true;
        }) : [];
        const start = (page - 1) * size;
        const total = hasFilters ? filtered.length : LOCAL_SAMPLE_TOTAL;
        const records = hasFilters ? filtered.slice(start, start + size) : getLocalSampleProjects(start, size);
        setPagination((prev) => ({ ...prev, total, current: page, pageSize: size }));
        setDataSource(records);
        setSelectedRowKeys([]);
        return;
      }
      const data = await primeApi.listProjectDigitalInvestmentAttracting(params as any);
      const records = await enrichProjectLifecycleData(data.records ?? []);
      setPagination((prev) => ({ ...prev, total: data.total, current: data.page, pageSize: data.size }));
      setDataSource(records);
      setSelectedRowKeys([]);
    } catch {
      message.error('获取项目数据失败');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectAttributeOptions = async () => {
    if (isLocalPreview()) {
      setAttributeOptions([
        { code: 'city_key', label: '市重', enabled: true, sort: 1 },
        { code: 'province_key', label: '省重', enabled: true, sort: 2 },
        { code: 'investment', label: '招商', enabled: true, sort: 3 },
        { code: 'increase', label: '增资', enabled: true, sort: 4 },
        { code: 'tech', label: '技改', enabled: true, sort: 5 },
        { code: 'digital', label: '数经', enabled: true, sort: 6 },
      ]);
      return;
    }
    try {
      const items = await systemApi.getDictItems({ catalog: PROJECT_ATTRIBUTE_CATALOG, all: true });
      setAttributeOptions(
        (items ?? [])
          .map((item) => ({
            code: String(item.code ?? ''),
            label: String(item.label ?? ''),
            enabled: item.enabled !== false,
            sort: Number(item.sort ?? 0),
          }))
          .filter((item) => item.code && item.label)
          .sort((a, b) => a.sort - b.sort),
      );
    } catch {
      if (isLocalPreview()) {
        setAttributeOptions([
          { code: 'city_key', label: '市重', enabled: true, sort: 1 },
          { code: 'province_key', label: '省重', enabled: true, sort: 2 },
          { code: 'investment', label: '招商', enabled: true, sort: 3 },
          { code: 'increase', label: '增资', enabled: true, sort: 4 },
          { code: 'tech', label: '技改', enabled: true, sort: 5 },
          { code: 'digital', label: '数经', enabled: true, sort: 6 },
        ]);
      } else {
        setAttributeOptions([]);
      }
    }
  };

  useEffect(() => {
    if (isLocalPreview()) {
      setProgressDict(['签约', '开工', '备案', '竣工', '撤销'].map((item) => ({ value: item, label: item })));
      loadProjectAttributeOptions();
      form.setFieldsValue({
        projectName: urlParams.projectName,
        recordName: urlParams.recordName,
        recordNumber: urlParams.recordNumber,
        currentProjectProgress: urlParams.currentProjectProgress,
        projectContent: urlParams.projectContent,
        isListedProject: urlParams.isListedProject,
        park: urlParams.park,
        year: urlParams.year ? Number(urlParams.year) : undefined,
        investor: urlParams.investor,
        attractorUnit: urlParams.attractorUnit,
        district: urlParams.district,
        investmentFlag: urlParams.investmentFlag,
        industryOrService: urlParams.industryOrService,
        projectSource: urlParams.projectSource,
        investmentAmountRange: urlParams.investmentAmountRange,
      });
      fetchData({ ...buildListApiFilters({
        projectName: urlParams.projectName,
        recordName: urlParams.recordName,
        recordNumber: urlParams.recordNumber,
        currentProjectProgress: urlParams.currentProjectProgress,
        projectContent: urlParams.projectContent,
        isListedProject: urlParams.isListedProject,
        park: urlParams.park,
        year: urlParams.year,
        investor: urlParams.investor,
        attractorUnit: urlParams.attractorUnit,
        district: urlParams.district,
        investmentFlag: urlParams.investmentFlag,
        industryOrService: urlParams.industryOrService,
        projectSource: urlParams.projectSource,
        investmentAmountRange: urlParams.investmentAmountRange,
      } as FieldType), page: urlParams.page, size: urlParams.pageSize });
      return;
    }

    systemApi.getDictItems({ catalog: 'project_progress' })
      .then((res) => {
        if (Array.isArray(res)) setProgressDict(res.filter((item) => item.enabled).map((item) => ({ value: item.value, label: item.label })));
      })
      .catch(() => {
        if (isLocalPreview()) {
          setProgressDict(['签约', '开工', '备案', '竣工', '撤销'].map((item) => ({ value: item, label: item })));
        } else {
          message.error('获取字典数据失败');
        }
      });

    loadDistrictPark();
    loadProjectAttributeOptions();
    form.setFieldsValue({
      projectName: urlParams.projectName,
      recordName: urlParams.recordName,
      recordNumber: urlParams.recordNumber,
      currentProjectProgress: urlParams.currentProjectProgress,
      projectContent: urlParams.projectContent,
      isListedProject: urlParams.isListedProject,
      park: urlParams.park,
      year: urlParams.year ? Number(urlParams.year) : undefined,
      investor: urlParams.investor,
      attractorUnit: urlParams.attractorUnit,
      district: urlParams.district,
      investmentFlag: urlParams.investmentFlag,
      industryOrService: urlParams.industryOrService,
      projectSource: urlParams.projectSource,
      investmentAmountRange: urlParams.investmentAmountRange,
      signingDateRange: urlParams.actualSigningTime1 && urlParams.actualSigningTime2 ? [dayjs(urlParams.actualSigningTime1), dayjs(urlParams.actualSigningTime2)] as [dayjs.Dayjs, dayjs.Dayjs] : undefined,
      signingStatRange: urlParams.signingTime1 && urlParams.signingTime2 ? [dayjs(urlParams.signingTime1), dayjs(urlParams.signingTime2)] as [dayjs.Dayjs, dayjs.Dayjs] : undefined,
      recordTimeRange: urlParams.recordTime1 && urlParams.recordTime2 ? [dayjs(urlParams.recordTime1), dayjs(urlParams.recordTime2)] as [dayjs.Dayjs, dayjs.Dayjs] : undefined,
      startTimeRange: urlParams.startTime1 && urlParams.startTime2 ? [dayjs(urlParams.startTime1), dayjs(urlParams.startTime2)] as [dayjs.Dayjs, dayjs.Dayjs] : undefined,
      endTimeRange: urlParams.endTime1 && urlParams.endTime2 ? [dayjs(urlParams.endTime1), dayjs(urlParams.endTime2)] as [dayjs.Dayjs, dayjs.Dayjs] : undefined,
    });
    const initialFilters = buildListApiFilters({
      projectName: urlParams.projectName,
      recordName: urlParams.recordName,
      recordNumber: urlParams.recordNumber,
      currentProjectProgress: urlParams.currentProjectProgress,
      projectContent: urlParams.projectContent,
      isListedProject: urlParams.isListedProject,
      park: urlParams.park,
      year: urlParams.year,
      investor: urlParams.investor,
      attractorUnit: urlParams.attractorUnit,
      district: urlParams.district,
      investmentFlag: urlParams.investmentFlag,
      industryOrService: urlParams.industryOrService,
      projectSource: urlParams.projectSource,
      investmentAmountRange: urlParams.investmentAmountRange,
    } as FieldType);
    fetchData({ ...initialFilters, page: urlParams.page, size: urlParams.pageSize });
  }, []);

  useEffect(() => {
    if (!fullDistrictOpts.length) return;
    let districtVal = urlParams.district;
    if (!districtVal && urlParams.park) {
      districtVal = inferDistrictByPark(urlParams.park);
      if (districtVal) form.setFieldValue('district', districtVal);
    }
    updateParkByDistrict(districtVal || undefined);
  }, [fullDistrictOpts]);

  const columns = useMemo<ColumnsType<any>>(() => {
    const selected = fieldDefinitions.filter((field) => displayFieldKeys.includes(field.key));
    return selected.map((field) => ({
      title: field.title,
      key: field.key,
      dataIndex: field.key,
      width: field.width,
      fixed: field.key === 'actions' ? 'right' : undefined,
      ellipsis: !['actions', 'projectAttributeList', 'index'].includes(field.key),
      render: (_value: unknown, record: any, rowIndex: number) => field.render?.(record, rowIndex) ?? getString(record?.[field.key]),
    }));
  }, [displayFieldKeys, fieldDefinitions]);

  const statusCounts = useMemo(() => {
    if (isLocalPreview()) {
      return {
        all: LOCAL_SAMPLE_TOTAL,
        签约: 2200,
        开工: 2200,
        备案: 2200,
        竣工: 2200,
        撤销: 2200,
      };
    }
    const counts: Record<string, number> = { all: pagination.total || dataSource.length };
    dataSource.forEach((record) => {
      const status = String(record?.currentProjectProgressLabel ?? '');
      statusTabs.forEach((tab) => {
        if (tab.key !== 'all' && status.includes(tab.key)) counts[tab.key] = (counts[tab.key] || 0) + 1;
      });
    });
    return counts;
  }, [dataSource, pagination.total]);

  const onFinish = (values: FieldType) => {
    const inv = investmentRangeToApiAmounts(values.investmentAmountRange);
    updateUrlParams({
      page: 1,
      pageSize: pagination.pageSize,
      projectName: values.projectName || '',
      recordName: values.recordName || '',
      recordNumber: values.recordNumber || '',
      currentProjectProgress: values.currentProjectProgress ?? [],
      projectContent: values.projectContent || '',
      isListedProject: values.isListedProject ?? null,
      park: values.park || '',
      year: values.year?.toString() || '',
      investor: values.investor || '',
      attractorUnit: values.attractorUnit || '',
      district: values.district || '',
      investmentFlag: values.investmentFlag || '',
      industryOrService: values.industryOrService || '',
      projectSource: values.projectSource || '',
      investmentAmount1: inv.investmentAmount1 != null ? String(inv.investmentAmount1) : '',
      investmentAmount2: inv.investmentAmount2 != null ? String(inv.investmentAmount2) : '',
      actualSigningTime1: values.signingDateRange?.[0]?.format('YYYY-MM-DD') ?? '',
      actualSigningTime2: values.signingDateRange?.[1]?.format('YYYY-MM-DD') ?? '',
      signingTime1: values.signingStatRange?.[0]?.format('YYYY-MM-DD') ?? '',
      signingTime2: values.signingStatRange?.[1]?.format('YYYY-MM-DD') ?? '',
      recordTime1: values.recordTimeRange?.[0]?.format('YYYY-MM-DD') ?? '',
      recordTime2: values.recordTimeRange?.[1]?.format('YYYY-MM-DD') ?? '',
      startTime1: values.startTimeRange?.[0]?.format('YYYY-MM-DD') ?? '',
      startTime2: values.startTimeRange?.[1]?.format('YYYY-MM-DD') ?? '',
      endTime1: values.endTimeRange?.[0]?.format('YYYY-MM-DD') ?? '',
      endTime2: values.endTimeRange?.[1]?.format('YYYY-MM-DD') ?? '',
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData(getListRequestParams(1, pagination.pageSize, values));
  };

  const handleReset = () => {
    form.resetFields();
    updateParkByDistrict(undefined);
    updateUrlParams({
      page: 1,
      pageSize: 10,
      projectName: '',
      recordName: '',
      recordNumber: '',
      currentProjectProgress: [],
      projectContent: '',
      park: '',
      year: '',
      investor: '',
      attractorUnit: '',
      isListedProject: null,
      district: '',
      investmentFlag: '',
      industryOrService: '',
      projectSource: '',
      investmentAmount1: '',
      investmentAmount2: '',
      actualSigningTime1: '',
      actualSigningTime2: '',
      signingTime1: '',
      signingTime2: '',
      recordTime1: '',
      recordTime2: '',
      startTime1: '',
      startTime2: '',
      endTime1: '',
      endTime2: '',
    });
    setPagination((prev) => ({ ...prev, current: 1, pageSize: 10 }));
    fetchData({ showAll: true, page: 1, size: 10 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    updateUrlParams({ page, pageSize });
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    fetchData(getListRequestParams(page, pageSize));
  };

  const handleExport = async () => {
    const activeFields = exportableFields.filter((field) => exportFieldKeys.includes(field.key));
    if (!activeFields.length) {
      message.warning('请至少选择一个导出字段');
      return;
    }
    try {
      setExporting(true);
      const selectedSet = new Set(selectedRowKeys);
      let rows = selectedRowKeys.length
        ? dataSource.filter((record) => selectedSet.has(record?.id ?? record?.key))
        : [];
      if (!rows.length) {
        if (isLocalPreview()) {
          rows = getLocalSampleProjects();
        } else {
          const params = getListRequestParams(1, Math.min(Math.max(pagination.total || 1000, pagination.pageSize), 10000));
          const data = await withTimeout(
            primeApi.listProjectDigitalInvestmentAttracting(params as any).catch(() => ({ records: dataSource })),
            { records: dataSource },
          );
          rows = data.records ?? [];
        }
      }
      const headers = activeFields.map((field) => field.title);
      if (!rows.length) {
        downloadCsv(`项目管理_字段模板_${dayjs().format('YYYYMMDD_HHmmss')}.csv`, headers, []);
        message.warning('当前列表暂无数据，已导出字段表头模板');
        return;
      }
      const body = rows.map((record, index) => activeFields.map((field) => field.exportValue?.(record, index) ?? getString(record?.[field.key])));
      downloadCsv(`项目管理_${dayjs().format('YYYYMMDD_HHmmss')}.csv`, headers, body);
      message.success('已按自定义字段导出');
    } catch {
      message.error('导出失败');
    } finally {
      setExporting(false);
    }
  };

  const saveFieldSettings = () => {
    writeJsonStorage(STORAGE_DISPLAY_FIELDS, displayFieldKeys);
    writeJsonStorage(STORAGE_EXPORT_FIELDS, exportFieldKeys);
    setFieldModalOpen(false);
    message.success('字段设置已保存');
  };

  const openAttributeModal = () => {
    attributeForm.setFieldsValue({ options: attributeOptions });
    setAttributeModalOpen(true);
  };

  const saveAttributeOptions = async () => {
    const values = await attributeForm.validateFields();
    const options: AttributeOption[] = (values.options ?? [])
      .map((item: AttributeOption, index: number) => ({
        code: String(item?.code ?? '').trim(),
        label: String(item?.label ?? '').trim(),
        enabled: item?.enabled !== false,
        sort: Number(item?.sort ?? index + 1),
      }))
      .filter((item: AttributeOption) => item.code && item.label);

    const duplicateCode = options.find((item, index) => options.findIndex((other) => other.code === item.code) !== index);
    if (duplicateCode) {
      message.warning(`属性编码重复：${duplicateCode.code}`);
      return;
    }

    try {
      await systemApi.createDictCatalog({
        systemDictCatalogDto: {
          code: PROJECT_ATTRIBUTE_CATALOG,
          label: PROJECT_ATTRIBUTE_CATALOG_LABEL,
        },
      });
    } catch {
      // 目录已存在时后端会报错；后续字典项仍可正常保存。
    }

    const oldCodes = new Set(attributeOptions.map((item) => item.code));
    const nextCodes = new Set(options.map((item) => item.code));
    const removedCodes = [...oldCodes].filter((code) => !nextCodes.has(code));

    try {
      await Promise.all(
        options.map((item) =>
          systemApi.createOrUpdateDictItem({
            systemDictDto: {
              catalog: PROJECT_ATTRIBUTE_CATALOG,
              code: item.code,
              label: item.label,
              enabled: item.enabled,
              sort: item.sort,
            },
          }),
        ),
      );
      await Promise.all(
        removedCodes.map((code) =>
          systemApi.deleteDictItem({
            catalog: PROJECT_ATTRIBUTE_CATALOG,
            code,
          }),
        ),
      );
      await loadProjectAttributeOptions();
      setAttributeModalOpen(false);
      message.success('项目属性字段已保存到数据库字典表');
    } catch {
      message.error('项目属性字段保存失败，请确认当前账号有管理员权限');
    }
  };

  const handleStatusTab = (key: string) => {
    if (key === 'all') {
      form.setFieldValue('currentProjectProgress', []);
      onFinish({ ...form.getFieldsValue(true), currentProjectProgress: [] } as FieldType);
      return;
    }
    const found = progressDict.find((item) => item.label.includes(key) || item.value.includes(key));
    const value = found ? found.value : key;
    form.setFieldValue('currentProjectProgress', [value]);
    onFinish({ ...form.getFieldsValue(true), currentProjectProgress: [value] } as FieldType);
  };

  const goToZzkcDetail = (record: any) => {
    const investOnlineId = record?.investOnlineId;
    if (investOnlineId !== null && investOnlineId !== undefined && String(investOnlineId).trim() !== '') {
      navigate(`/xmgl/pro-other-start?id=${String(investOnlineId).trim()}`);
      return;
    }
    message.info('未找到增资扩产项目详情');
  };

  const detailRecord = (record: any) => {
    const source = String(record?.projectSource ?? record?.source ?? '').trim();
    if (source === '增资扩产') {
      goToZzkcDetail(record);
      return;
    }
    if (record.currentProjectProgress) navigate(`/xmgl/xmjd?id=${record.id}&fromPage=${pagination.current}`);
    else message.info('当前项目暂无进度');
  };

  function RowActions({ record }: { record: any }) {
    const items: MenuProps['items'] = [
      {
        key: 'apply',
        label: '申报重点项目',
        onClick: () => {
          setApplyRecord({
            ...record,
            fgName: record?.fgName ?? record?.fgProjectName ?? record?.projectName,
            projectSource: '数字化招商',
          });
          setIsApplyModalOpen(true);
        },
      },
      {
        key: 'lt',
        label: '编辑列统',
        onClick: () => {
          setIsLtModalOpen(true);
          setLtEditingId(String(record?.id ?? ''));
          ltForm.setFieldsValue({ ltCode: record?.ltCode ?? '', isLt: record?.isLt });
        },
      },
    ];
    return (
      <Space size={6}>
        <Tooltip title="详情"><Button size="small" icon={<EyeOutlined />} onClick={() => detailRecord(record)}>详</Button></Tooltip>
        <Tooltip title="跟踪"><Button size="small" style={{ color: '#0d9f66', borderColor: '#b7efd2' }} onClick={() => navigate('/service-track')}>跟</Button></Tooltip>
        <Tooltip title="编辑"><Button size="small" style={{ color: '#6f49e8', borderColor: '#d7c8ff' }} icon={<EditOutlined />}>编</Button></Tooltip>
        <Dropdown menu={{ items }} trigger={['click']}>
          <Button size="small">更多 <DownOutlined /></Button>
        </Dropdown>
      </Space>
    );
  }

  return (
    <div style={{ margin: -24, minHeight: 'calc(100vh - 56px)', background: '#f5f8fc', padding: '18px 40px 24px' }}>
      <style>
        {`
          .pm-search-card .ant-form-item { margin-bottom: 20px; }
          .pm-search-card .ant-form-item-label > label { color: #1f2a3d; font-weight: 600; }
          .pm-table-card .ant-table-thead > tr > th { background: #f0f5ff !important; color: #1f2a3d; font-weight: 700; }
          .pm-table-card .ant-table-cell { border-color: #edf1f7 !important; }
          .pm-table-card .ant-table-row:nth-child(even) td { background: #fcfdff; }
          .pm-tab-button { height: 44px; border-radius: 6px; border: 1px solid #e1e8f2; background: #fff; padding: 0 18px; cursor: pointer; font-weight: 600; }
          .pm-tool-button { width: 42px; height: 42px; border-radius: 8px; }
        `}
      </style>

      <h2 style={{ margin: '0 0 20px', fontSize: 20 }}>项目管理</h2>

      <div className="pm-search-card" style={{ background: '#fff', borderRadius: 10, padding: '26px 32px 20px', boxShadow: '0 10px 28px rgba(23, 70, 133, 0.07)' }}>
        <Form form={form} layout="vertical" initialValues={{ investmentAmountRange: 'all' }} onFinish={onFinish}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))', gap: '0 32px' }}>
            <Form.Item<FieldType> label="项目名称" name="projectName"><Input allowClear placeholder="请输入项目名称" /></Form.Item>
            <Form.Item<FieldType> label="项目内容" name="projectContent"><Input allowClear placeholder="请输入项目内容" /></Form.Item>
            <Form.Item<FieldType> label="备案项目名称" name="recordName"><Input allowClear placeholder="请输入备案项目名称" /></Form.Item>
            <Form.Item<FieldType> label="备案项目代码" name="recordNumber"><Input allowClear placeholder="请输入备案项目代码" /></Form.Item>
            <Form.Item<FieldType> label="项目类别" name="investmentFlag">
              <Select allowClear placeholder="全部" options={[{ value: '1', label: '内资' }, { value: '2', label: '外资' }]} />
            </Form.Item>
            <Form.Item<FieldType> label="所属产业" name="industryOrService">
              <Select allowClear placeholder="全部" options={[{ value: '工业', label: '工业' }, { value: '服务业', label: '服务业' }]} />
            </Form.Item>
            <Form.Item<FieldType> label="项目状态" name="currentProjectProgress">
              <Select mode="multiple" allowClear placeholder="全部" options={progressDict} />
            </Form.Item>
            <Form.Item<FieldType> label="投资额" name="investmentAmountRange">
              <Select placeholder="全部" options={[
                { value: 'all', label: '全部' },
                { value: 'above100000', label: '10亿（1亿美元）以上' },
                { value: 'above50000', label: '5亿（3000万美元）以上' },
                { value: 'above10000', label: '1亿（1000万美元）以上' },
                { value: 'mid500to10000', label: '500万-1亿（1000万美元）' },
              ]} />
            </Form.Item>
          </div>

          {showMoreSearch && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))', gap: '0 32px' }}>
              <Form.Item<FieldType> label="所属市（区）" name="district">
                <Select allowClear showSearch placeholder="全部" optionFilterProp="label" options={districtOptions}
                  onChange={(v) => { updateParkByDistrict(v); form.setFieldValue('park', undefined); }} />
              </Form.Item>
              <Form.Item<FieldType> label="所属板块" name="park">
                <Select allowClear showSearch optionFilterProp="label" placeholder={searchParkOptions.length ? '请选择所属板块' : '请先选择所属市'} options={searchParkOptions} />
              </Form.Item>
              <Form.Item<FieldType> label="项目来源" name="projectSource">
                <Select allowClear placeholder="全部" options={[{ value: '市级机关推荐', label: '市级机关推荐' }, { value: '自行接洽', label: '自行接洽' }, { value: '增资扩产', label: '增资扩产' }]} />
              </Form.Item>
              <Form.Item<FieldType> label="招引单位" name="attractorUnit"><Input allowClear placeholder="请输入招引单位" /></Form.Item>
              <Form.Item<FieldType> label="投资方名称" name="investor"><Input allowClear placeholder="请输入投资方名称" /></Form.Item>
              <Form.Item<FieldType> label="是否列统项目" name="isListedProject">
                <Select allowClear placeholder="全部" options={[{ value: true, label: '是' }, { value: false, label: '否' }]} />
              </Form.Item>
              <Form.Item<FieldType> label="所属年份" name="year">
                <Select allowClear placeholder="全部" options={[2023, 2024, 2025, 2026].map((y) => ({ value: y, label: String(y) }))} />
              </Form.Item>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ minWidth: 110 }}>查询</Button>
            <Button icon={<UndoOutlined />} onClick={handleReset} style={{ minWidth: 110 }}>重置</Button>
            <Button icon={<FilterOutlined />} onClick={() => setShowMoreSearch((v) => !v)} style={{ minWidth: 130 }}>
              更多筛选 <DownOutlined rotate={showMoreSearch ? 180 : 0} />
            </Button>
            <Button loading={exporting} icon={<CloudDownloadOutlined />} onClick={handleExport} style={{ minWidth: 110 }}>导出</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('请在项目进度页或业务详情页新建项目')} style={{ marginLeft: 'auto', minWidth: 128 }}>新建项目</Button>
          </div>
        </Form>
      </div>

      <div className="pm-table-card" style={{ marginTop: 18, background: '#fff', borderRadius: 10, padding: '16px 16px 18px', boxShadow: '0 10px 28px rgba(23, 70, 133, 0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 14, alignItems: 'center' }}>
          <Space wrap>
            {statusTabs.map((tab) => (
              <button key={tab.key} type="button" className="pm-tab-button" onClick={() => handleStatusTab(tab.key)}>
                <span style={{ color: tab.color, marginRight: 8 }}>●</span>
                {tab.label}
                <span style={{ color: tab.color, marginLeft: 8 }}>{statusCounts[tab.key] ?? 0}</span>
              </button>
            ))}
          </Space>
          <Space>
            <Button>批量操作 <DownOutlined /></Button>
            {isAdmin && <Button icon={<TagsOutlined />} onClick={openAttributeModal}>属性字段</Button>}
            <Tooltip title="字段设置"><Button className="pm-tool-button" icon={<SettingOutlined />} onClick={() => setFieldModalOpen(true)} /></Tooltip>
            <Tooltip title="刷新"><Button className="pm-tool-button" icon={<ReloadOutlined />} onClick={() => fetchData(getListRequestParams(pagination.current, pagination.pageSize))} /></Tooltip>
            <Tooltip title="列表"><Button className="pm-tool-button" icon={<BarsOutlined />} /></Tooltip>
          </Space>
        </div>

        <Table
          rowKey={(record) => record?.id ?? record?.key ?? record?.projectName}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
          scroll={{ x: columns.reduce((sum, column) => sum + Number(column.width || 120), 0) }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showSizeChanger
            showTotal={(total) => `共 ${total} 条`}
            onChange={handlePageChange}
          />
        </div>
      </div>

      <Modal
        title="字段设置"
        open={fieldModalOpen}
        onOk={saveFieldSettings}
        onCancel={() => setFieldModalOpen(false)}
        width={760}
        okText="保存"
        cancelText="取消"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <div>
            <h3><ColumnHeightOutlined /> 列表显示字段</h3>
            <Checkbox.Group
              value={displayFieldKeys}
              onChange={(values) => setDisplayFieldKeys(values.map(String))}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}
            >
              {displayableFields.map((field) => (
                <Checkbox key={field.key} value={field.key}>{field.title}</Checkbox>
              ))}
            </Checkbox.Group>
          </div>
          <div>
            <h3><CloudDownloadOutlined /> 导出字段</h3>
            <Checkbox.Group
              value={exportFieldKeys}
              onChange={(values) => setExportFieldKeys(values.map(String))}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}
            >
              {exportableFields.map((field) => (
                <Checkbox key={field.key} value={field.key}>{field.title}</Checkbox>
              ))}
            </Checkbox.Group>
          </div>
        </div>
      </Modal>

      <Modal
        title="项目属性字段（关联 system_dict）"
        open={attributeModalOpen}
        onOk={saveAttributeOptions}
        onCancel={() => setAttributeModalOpen(false)}
        width={640}
        okText="保存"
        cancelText="取消"
      >
        <Form form={attributeForm} layout="vertical">
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 12 }}>
                    <Form.Item {...field} name={[field.name, 'code']} rules={[{ required: true, message: '请输入属性编码' }]} style={{ width: 160, marginBottom: 0 }}>
                      <Input placeholder="编码，如 city_key" />
                    </Form.Item>
                    <Form.Item {...field} name={[field.name, 'label']} rules={[{ required: true, message: '请输入属性名称' }]} style={{ flex: 1, marginBottom: 0 }}>
                      <Input placeholder="属性名称，如 市重/招商" />
                    </Form.Item>
                    <Form.Item {...field} name={[field.name, 'sort']} style={{ width: 110, marginBottom: 0 }}>
                      <InputNumber min={0} placeholder="排序" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item {...field} name={[field.name, 'enabled']} valuePropName="checked" style={{ width: 70, marginBottom: 0 }}>
                      <Checkbox>启用</Checkbox>
                    </Form.Item>
                    <Button danger onClick={() => remove(field.name)}>删除</Button>
                  </Space>
                ))}
                <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add({ code: '', label: '', sort: fields.length + 1, enabled: true })}>新增属性字段</Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      <KeyProjectApplyModal
        open={isApplyModalOpen}
        onCancel={() => { setIsApplyModalOpen(false); setApplyRecord(null); }}
        initialRecord={applyRecord}
        onSuccess={() => fetchData(getListRequestParams(pagination.current, pagination.pageSize))}
      />

      <Modal
        title="编辑列统"
        open={isLtModalOpen}
        onCancel={() => { setIsLtModalOpen(false); setLtEditingId(''); ltForm.resetFields(); }}
        onOk={async () => {
          try {
            const values = await ltForm.validateFields();
            await primeApi.updateProjectDigitalInvestmentAttracting({
              id: ltEditingId,
              projectDigitalInvestmentAttractingDto: { isLt: values.isLt as boolean, ltCode: values.ltCode ?? '' } as any,
            });
            message.success('提交成功');
            setIsLtModalOpen(false);
            setLtEditingId('');
            ltForm.resetFields();
            fetchData(getListRequestParams(pagination.current, pagination.pageSize));
          } catch (error) {
            if ((error as any)?.errorFields) return;
            message.error('提交失败');
          }
        }}
        okText="提交"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={ltForm} layout="vertical" preserve={false}>
          <Form.Item label="是否列统项目" name="isLt" rules={[{ required: true, message: '请选择是否列统项目' }]}>
            <Select placeholder="请选择" options={[{ value: true, label: '是' }, { value: false, label: '否' }]} />
          </Form.Item>
          <Form.Item label="列统代码" name="ltCode">
            <Input placeholder="填写（非必填）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

function StatusTag({ text }: { text?: string }) {
  const value = text || '-';
  const matched = statusTabs.find((item) => item.key !== 'all' && value.includes(item.key));
  const color = matched?.color || '#1677ff';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 5, color, background: `${color}12`, border: `1px solid ${color}55` }}>
      {value}
      {value !== '-' ? <span style={{ width: 5, height: 5, borderRadius: 3, background: color }} /> : null}
    </span>
  );
}

export default ProjectManage;
