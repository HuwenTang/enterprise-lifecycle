import { usePersistedMoreSearch } from '@/hooks/usePersistedMoreSearch';
import { primeApi, systemApi } from '@/services/api';
import type { ExportProjectKeyProjectRequest, ListProjectKeyProjectRequest } from '@/services/apis';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  FormProps,
  Input,
  InputNumber,
  message,
  Modal,
  Pagination,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  TreeSelect,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { handleApiError } from '@/utils/errorHandler';
import { dayjsToApiDatePreservingCalendarDay } from '@/utils/apiDate';
import { useAccess, useSearchParams } from '@umijs/max';
import { useNavigate } from 'react-router-dom';
import {
  legacyUrlCsvFromItems,
  mergeZzclForSubmit,
  parseZzclFieldFromVo,
  serializeZzclForApi,
  zzclItemsToUploadFileList,
} from './attachmentApi';

type FieldType = {
  projectName?: string;
  projectFgName?: string;
  /** 对应 list/export 接口 content */
  projectContent?: string;
  projectSource?: string;
  /** 项目类别：内资、外资 → investmentType */
  investmentType?: string;
  /** 所属产业：工业、服务业 → industryService */
  industryService?: string;
  district?: string;
  /** 项目所在园区，对应 list 接口 park */
  park?: string;
  investor?: string;
  /** 是否新开工 */
  isNewStart?: boolean;
  /** 是否开工 */
  isStart?: boolean;
  /** 是否统计入库 */
  isStatistics?: boolean;
};

type AddFormType = {
  fgName?: string;
  projectSource?: string;
  projectName?: string;
  district?: string;
  park?: string;
  /** 统计代码（ProjectKeyProjectDto.inInvestCode），非必填 */
  inInvestCode?: string;
  constructionContentAndScale?: string;
  mainProductsAndCapacity?: string;
  constructionPeriod?: string;
  phasedStatus?: string;
  plannedTotalInvestmentDomestic?: number;
  plannedTotalInvestmentForeign?: number;
  expectedOutputValue?: number;
  expectedTaxRevenue?: number;
  expectedInvoiceAmount?: number;
  expectedEmployment?: number;
  annualPlannedInvestment?: number;
  annualImageProgress?: string;
  estimatedStartDate?: any;
  actualOrEstimatedStartDate?: any;
  firstFullProductionDate?: any;
  /** 国民经济行业分类（gg_industry_category），对应接口 industryCode */
  industryCode?: string;
  /** 8+13+X，对应接口 x */
  x?: string;
  isExpansionOrReinvestment?: boolean;
  constructionLocation?: string;
  investorName?: string;
  unifiedSocialCreditCode?: string;
  investorNature?: string | string[];
  investorIntroduction?: string;
  totalLandRequirement?: string;
  leaseOrRevitalization?: string;
  newLandArea?: string;
  involvesBasicFarmland?: boolean;
  withinEcologicalRedline?: boolean;
  landProcedureStatus?: string;
  plotRatio?: number;
  annualEnergyConsumption?: number;
  isHighPollutionHighEnergy?: boolean;
  energyReviewOpinion?: string;
  environmentalImpactDescription?: string;
  eiaApprovalStatus?: string;
  isHighTechEnterprise?: boolean;
  rdPlatformLevel?: string;
  avgRdIntensityLast3years?: number;
  ledByHighLevelTalent?: boolean;
  intellectualPropertyInfo?: string;
  filingStatus?: string;
  onlinePlatformProjectCode?: string;
  safetyProductionStatus?: string;
  safetyEvaluationApproval?: string;
  isInStatisticalDatabase?: boolean;
  statisticalDatabaseCode?: string;
  projectHighlights?: string;
  supportingDocumentsUrl?: string;
  investmentCompletedByEnd2025?: number;
  plannedInvestment2026?: number;
  progressByEnd2025?: string;
  constructionTarget2026?: string;
  isNewlyStartedIn2026?: boolean;
  responsibleUnit?: string;
  projectLocationAdmin?: string;
  remarks?: string;
  projectEvaluationStatus?: string;
  /** 以下为展示用，不参与接口传参 */
  industryCategoryDisplay?: string;
  /** @deprecated 表单已改用 x */
  industrySubCategoryDisplay?: string;
  plannedInvestmentTypeDisplay?: string;
  plannedInvestmentAmountDisplay?: number;
  isPhasedDisplay?: string;
  amountPerPhaseDisplay?: number;
  constructionStartDateDisplay?: any;
  constructionEndDateDisplay?: any;
  taxPerMuDisplay?: number;
  projectTypeDisplay?: string;
  /** 项目用地 */
  landTypeDisplay?: string;
  landProcedureStatusNewDisplay?: string;
  landProcedureStatusStockDisplay?: string;
  existingAreaUsageDisplay?: string;
  /** 资源环境 */
  energyReviewCompletedDisplay?: string;
  energyReviewDocUrlDisplay?: string;
  eiaCompletedDisplay?: string;
  eiaDocUrlDisplay?: string;
  /** 审批情况 */
  isFilingDisplay?: string;
  filingDocUrlDisplay?: string;
  hasSafetyApprovalDisplay?: string;
  safetyApprovalDocUrlDisplay?: string;
  /** 知识产权 */
  inventionPatentCountDisplay?: number;
  utilityPatentCountDisplay?: number;
};

/** 8+13+X：新字段 x；兼容旧数据 industryCode 存点分/纯数字 code */
const isKeyProject813CodeLike = (val: unknown) => {
  const s = typeof val === 'string' ? val.trim() : String(val ?? '').trim();
  return /^\d+(\.\d+)*$/.test(s);
};

function resolveKeyProject813XFromVo(vo: any): string | undefined {
  const xv = vo?.x;
  if (xv !== null && xv !== undefined && String(xv).trim() !== '') return String(xv).trim();
  const ic = vo?.industryCode;
  if (ic !== null && ic !== undefined && isKeyProject813CodeLike(ic)) return String(ic).trim();
  return undefined;
}

/** 国民经济行业分类 code：接口 industryCode；兼容扩展字段 */
function resolveKeyProjectGgIndustryCodeFromVo(vo: any): string | undefined {
  const ic = vo?.industryCode;
  if (
    ic !== null &&
    ic !== undefined &&
    String(ic).trim() !== '' &&
    !isKeyProject813CodeLike(ic)
  )
    return String(ic).trim();
  const g = vo?.industryName ?? vo?.ggIndustryCategory ?? vo?.ggIndustryCode;
  if (g !== null && g !== undefined && String(g).trim() !== '') return String(g).trim();
  return undefined;
}

/** 接口可能返回 boolean / 0-1 / 字符串，需与 Radio value={true|false} 对齐 */
function normalizeTwoHighForForm(val: unknown): boolean | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  if (val === true || val === false) return val;
  if (typeof val === 'number') {
    if (val === 1) return true;
    if (val === 0) return false;
  }
  const s = String(val).trim().toLowerCase();
  if (s === '1' || s === 'true' || s === '是') return true;
  if (s === '0' || s === 'false' || s === '否') return false;
  return undefined;
}

/** 接口可能返回 boolean / 0-1 / '是/否' / 'true/false'，统一回显到 '是' | '否' */
function normalizeYesNoText(val: unknown): '是' | '否' | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  if (val === true) return '是';
  if (val === false) return '否';
  if (typeof val === 'number') {
    if (val === 1) return '是';
    if (val === 0) return '否';
  }
  const s = String(val).trim().toLowerCase();
  if (s === '是' || s === '1' || s === 'true' || s === 'y' || s === 'yes') return '是';
  if (s === '否' || s === '0' || s === 'false' || s === 'n' || s === 'no') return '否';
  return undefined;
}

/** 列表查询条件（与表单 FieldType 对齐），布尔仅在明确选择时传给接口 */
function pickKeyProjectListFilters(
  fv: FieldType,
): Omit<ListProjectKeyProjectRequest, 'status' | 'page' | 'size'> {
  return {
    projectName: fv.projectName || '',
    projectFgName: fv.projectFgName || '',
    content: fv.projectContent || '',
    projectSource: fv.projectSource || '',
    investmentType: fv.investmentType || '',
    industryService: fv.industryService || '',
    district: fv.district || '',
    park: fv.park || '',
    investor: fv.investor || '',
    ...(fv.isNewStart === true || fv.isNewStart === false ? { isNewStart: fv.isNewStart } : {}),
    ...(fv.isStart === true || fv.isStart === false ? { isStart: fv.isStart } : {}),
    ...(fv.isStatistics === true || fv.isStatistics === false ? { isStatistics: fv.isStatistics } : {}),
  };
}

/** 为 true 时显示「草稿箱」切换 */
const SHOW_DRAFT_UI = true;

/** 与 KeyProjectApplyModal、ProjectKeyProjectDto 一致：1 草稿，2 正文 */
const PROJECT_KEY_PROJECT_STATUS_DRAFT = 1;
const PROJECT_KEY_PROJECT_STATUS_FORMAL = 2;

const KeyProject = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const access = useAccess() as any;
  const canKeyProjectPush = !!access?.canKeyProjectPush;
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [showMoreSearch, setShowMoreSearchPersist] = usePersistedMoreSearch();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [districtOptions, setDistrictOptions] = useState<Array<{ value: string; label: string }>>([
    { value: '', label: '不限' },
  ]);
  const [areaData, setAreaData] = useState<any[]>([]);
  /** 查询区：随「所属区县」联动，仅当前区县下园区 +「不限」（与新增表单 parkOptions 分离） */
  const [listParkSearchOptions, setListParkSearchOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const searchDistrictWatch = Form.useWatch('district', form);
  const [parkOptions, setParkOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addFormLoading, setAddFormLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string>('');
  const [editFormLoading, setEditFormLoading] = useState(false);
  const [editDraftSaving, setEditDraftSaving] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFileList, setImportFileList] = useState<UploadFile[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);
  const [pushingProjectIds, setPushingProjectIds] = useState<string[]>([]);
  const [pushDeptOptions, setPushDeptOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [pushLoading, setPushLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [industrySubCategoryOptions, setIndustrySubCategoryOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [industrySubCategoryTreeData, setIndustrySubCategoryTreeData] = useState<any[]>([]);
  const [industryCategoryOptions, setIndustryCategoryOptions] = useState<Array<{ value: string; label: string }>>([]);

  /**
   * 与列表接口一致：query `status=true` 为草稿箱；`status=false` 或缺省为正式数据（默认 false）
   */
  const initialDraftFromUrl = searchParams.get('status') === 'true';
  /** true：草稿列表（status=true）；false：正式列表（status=false），默认 false */
  const [listDraftBoxMode, setListDraftBoxMode] = useState(initialDraftFromUrl);

  const syncDraftStatusUrl = (draft: boolean) => {
    const next = new URLSearchParams(searchParams);
    if (draft) {
      next.set('status', 'true');
    } else {
      next.set('status', 'false');
    }
    setSearchParams(next);
  };

  /** 与申报表 KeyProjectApplyModal 一致：将 8_13_X 字典项转为可展开/收起的树 */
  const buildIndustryTreeData = (items: any[]) => {
    const list = (Array.isArray(items) ? items : [])
      .filter((p) => p?.enabled !== false)
      .map((p) => ({
        code: String(p.value ?? p.code ?? '').trim(),
        label: String(p.label ?? p.value ?? p.code ?? '').trim(),
        sort: typeof p.sort === 'number' ? p.sort : 0,
      }))
      .filter((p) => p.code && p.label);

    const byCode = new Map<string, { code: string; label: string; sort: number }>();
    for (const item of list) {
      const prev = byCode.get(item.code);
      if (!prev) {
        byCode.set(item.code, item);
        continue;
      }
      if (item.label.length > prev.label.length) {
        byCode.set(item.code, item);
        continue;
      }
      if (item.label.length === prev.label.length && item.sort > prev.sort) {
        byCode.set(item.code, item);
      }
    }
    const deduped = Array.from(byCode.values());

    const isClusterCode = (code: string) => {
      const seg = code.split('.');
      return seg.length > 1 && seg[seg.length - 1] === '0';
    };
    const parentClusterCodeOf = (code: string) => {
      const seg = code.split('.');
      if (seg.length <= 1) return code;
      return [...seg.slice(0, -1), '0'].join('.');
    };

    const childrenByParent = new Map<string, Array<{ code: string; label: string; sort: number }>>();
    const roots: Array<{ code: string; label: string; sort: number }> = [];

    for (const item of deduped) {
      if (!item.code.includes('.')) {
        continue;
      }
      if (isClusterCode(item.code)) {
        roots.push(item);
      } else {
        const parent = parentClusterCodeOf(item.code);
        const arr = childrenByParent.get(parent) ?? [];
        arr.push(item);
        childrenByParent.set(parent, arr);
      }
    }

    for (const item of deduped) {
      if (!item.code.includes('.')) {
        roots.push(item);
      }
    }

    const rootByCode = new Map<string, { code: string; label: string; sort: number }>();
    for (const r of roots) rootByCode.set(r.code, r);
    const rootList = Array.from(rootByCode.values()).sort((a, b) => a.sort - b.sort);

    return rootList.map((r) => {
      const children = (childrenByParent.get(r.code) ?? []).sort((a, b) => a.sort - b.sort);
      const hasChildren = children.length > 0;
      return {
        title: r.label,
        value: r.code,
        key: r.code,
        selectable: !hasChildren,
        children: hasChildren
          ? children.map((c) => ({
              title: c.label,
              value: c.code,
              key: c.code,
              selectable: true,
            }))
          : undefined,
      };
    });
  };

  const getIndustryCategoryOptions = async () => {
    try {
      const res = await systemApi.getDictItems({ catalog: 'gg_industry_category' });
      const list =
        res?.map((p: any) => {
          const combinedLabel = `${p.value || ''}${p.label || ''}`;
          return {
            value: p.value || '',
            label: combinedLabel,
          };
        }) || [];
      setIndustryCategoryOptions(list);
    } catch (error) {
      console.error('获取行业分类字典失败:', error);
      setIndustryCategoryOptions([]);
    }
  };

  // 获取 8+13+X 字典（平铺用于新增弹窗；树形用于编辑弹窗 TreeSelect）
  const getIndustrySubCategoryOptions = async () => {
    try {
      const res = await systemApi.getDictItems({ catalog: '8_13_X' });
      const list =
        res?.map((p: any) => ({
          value: p.value ?? p.code ?? '',
          label: p.label ?? p.value ?? '',
        })) ?? [];
      setIndustrySubCategoryOptions(list);
      setIndustrySubCategoryTreeData(buildIndustryTreeData(res as any[]));
    } catch (error) {
      console.error('获取8+13+X字典失败:', error);
      setIndustrySubCategoryOptions([]);
      setIndustrySubCategoryTreeData([]);
    }
  };

  // 获取区县字典 - 参考 ProjectManage7 的实现方式
  const getDistrictOptions = async () => {
    try {
      const res = await systemApi.getAdministrativeDivisionTree();
      setAreaData(res);
      const list =
        res[0]?.children?.map((item: any) => ({
          value: item.value,
          label: item.label,
        })) || [];
      setDistrictOptions(list);
      setListParkSearchOptions([]);
    } catch (error) {
      console.error('获取区县字典失败:', error);
      // 如果获取失败，使用默认选项
      setDistrictOptions([
        { value: '海陵', label: '海陵' },
        { value: '兴化', label: '兴化' },
        { value: '泰兴', label: '泰兴' },
        { value: '姜堰', label: '姜堰' },
        { value: '靖江', label: '靖江' },
      ]);
      setListParkSearchOptions([]);
    }
  };

  // 获取推送部门字典
  const getPushDeptOptions = async () => {
    try {
      const data = await systemApi.getDictItems({ catalog: 'key_proj_dept' });
      const options = data.map((item: any) => ({
        value: item.label, // 使用 label（中文）作为 value
        label: item.label,
      }));
      setPushDeptOptions(options);
    } catch (error) {
      console.error('获取推送部门字典失败:', error);
      message.error('获取推送部门选项失败');
    }
  };

  /** 查询表单：区县变更 → 园区下拉仅展示该区县的园区，并重置园区筛选（与新增表单 handleDistrictChange 同源逻辑） */
  const updateSearchParkOptionsByDistrict = (districtValue: string | undefined) => {
    const v =
      districtValue === undefined || districtValue === null ? '' : String(districtValue).trim();
    if (!v) {
      setListParkSearchOptions([]);
      form.setFieldValue('park', undefined);
      return;
    }
    const selectedDistrict = areaData[0]?.children?.find((d: any) => d.value === v);
    const parks =
      selectedDistrict?.children?.map((p: any) => ({
        value: p.value,
        label: p.label,
      })) || [];
    setListParkSearchOptions(parks);
    form.setFieldValue('park', undefined);
  };

  // 监听"所属区县"变化 - 联动更新园区选项（新增/编辑弹窗）
  const handleDistrictChange = (value: string) => {
    if (!value) {
      setParkOptions([]);
      addForm.setFieldValue('park', undefined);
      addForm.setFieldValue('constructionLocation', undefined);
      return;
    }
    const selectedDistrict = areaData[0]?.children?.find((d: any) => d.value === value);
    const parks =
      selectedDistrict?.children?.map((p: any) => ({
        value: p.value,
        label: p.label,
      })) || [];
    setParkOptions(parks);
    // 清空已选园区和建设地点
    addForm.setFieldValue('park', undefined);
    addForm.setFieldValue('constructionLocation', undefined);
  };

  // 佐证资料上传：normFile 与路径提取（需在 handleEdit 之前定义）
  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList ?? [];
  };
  /** 后端佐证字段（含 `{url,name}[]` JSON）→ Upload fileList，列表展示原始文件名 */
  const pathsToFileList = (raw: unknown): UploadFile[] | undefined => {
    const items = parseZzclFieldFromVo(raw);
    return items.length ? zzclItemsToUploadFileList(items) : undefined;
  };
  const evidenceUploadProps: UploadProps = {
    action: '/system-api/file',
    // 后端上传接口 swagger: multipart/form-data 支持字段名 `files` 或 `file`
    // 这里用 `file` 以匹配“新的上传接口”字段名约定
    name: 'file',
    maxCount: 30,
    multiple: true,
    listType: 'text' as const,
  };

  /** 重点项目提交：新接口字段 + 原有扩展字段一并提交，避免后端仍读旧 key 时丢参 */
  const buildProjectKeyProjectDto = (values: AddFormType): any => {
    const toNull = (val: any) => {
      if (val === undefined || val === '' || val === null) return null;
      return val;
    };
    const yesNoToBool = (val: any) => {
      if (val === true || val === false) return val;
      if (val === '是' || val === '1' || val === 1) return true;
      if (val === '否' || val === '0' || val === 0) return false;
      return null;
    };
    const startYear =
      values.constructionPeriod && Array.isArray(values.constructionPeriod) && values.constructionPeriod.length === 2
        ? values.constructionPeriod[0]?.year?.()
        : null;
    const endYear =
      values.constructionPeriod && Array.isArray(values.constructionPeriod) && values.constructionPeriod.length === 2
        ? values.constructionPeriod[1]?.year?.()
        : null;

    const toOptionalFiniteNumberOrNull = (v: any): number | null => {
      if (v === undefined || v === null || v === '') return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    // API 新字段 currentAmount 目前只有一个口子：
    // - 服务业：对应“预期开票（万元）”(expectedInvoiceAmount)
    // - 工业：对应“本期金额（万元）”(amountPerPhaseDisplay，通常在是否分期为“是”时填写)
    const currentAmountVal =
      values.industryCategoryDisplay === '服务业'
        ? toOptionalFiniteNumberOrNull(values.expectedInvoiceAmount)
        : toOptionalFiniteNumberOrNull(values.amountPerPhaseDisplay);
    const landAreaVal =
      values.landTypeDisplay === '新增用地'
        ? toOptionalFiniteNumberOrNull(values.newLandArea)
        : values.landTypeDisplay === '存量厂房'
          ? toOptionalFiniteNumberOrNull(values.existingAreaUsageDisplay)
          : null;
    const isBasicFarmlandVal =
      values.landTypeDisplay === '新增用地'
        ? values.involvesBasicFarmland !== undefined
          ? values.involvesBasicFarmland
          : null
        : null;
    const isEcologicalBoundaryVal =
      values.landTypeDisplay === '新增用地'
        ? values.withinEcologicalRedline !== undefined
          ? values.withinEcologicalRedline
          : null
        : null;
    const landUseProceduresVal =
      values.landTypeDisplay === '新增用地'
        ? toNull(values.landProcedureStatus)
        : values.landTypeDisplay === '存量厂房'
          ? toNull(values.landProcedureStatusStockDisplay)
          : null;
    const invType = values.plannedInvestmentTypeDisplay;
    const invAmount = values.plannedInvestmentAmountDisplay;
    const plannedDomestic =
      invType === '内资' && invAmount !== null && invAmount !== undefined ? invAmount : null;
    const plannedForeign =
      invType === '外资' && invAmount !== null && invAmount !== undefined ? invAmount : null;

    const industryCodeVal = toNull(values.industryCode);
    const xVal = toNull(values.x);
    const investorNatureVal = Array.isArray(values.investorNature)
      ? JSON.stringify(values.investorNature)
      : toNull(values.investorNature);

    return {
      // --- 新接口 / ProjectKeyProjectDto 命名 ---
      digitalInvestmentId: toNull(values.onlinePlatformProjectCode),
      fgName: toNull(values.fgName),
      projectSource: toNull(values.projectSource),
      projectName: values.projectName || null,
      district: values.district || null,
      park: toNull(values.park),
      inInvestCode: toNull(values.inInvestCode),
      industryCategory: toNull(values.industryCategoryDisplay),
      x: xVal,
      investmentType: toNull(values.plannedInvestmentTypeDisplay),
      totalInvestmentAmount: toNull(values.plannedInvestmentAmountDisplay),
      ifPhased: yesNoToBool(values.isPhasedDisplay),
      constructionContent: toNull(values.constructionContentAndScale),
      mainProductsCapacity: toNull(values.mainProductsAndCapacity),
      startYear: toNull(startYear),
      endYear: toNull(endYear),
      annualPlanInvestment: toNull(values.annualPlannedInvestment),
      annualImageProgress: toNull(values.annualImageProgress),
      projectType: toNull(values.projectTypeDisplay),
      investorName: toNull(values.investorName),
      creditCode: toNull(values.unifiedSocialCreditCode),
      investorNature: investorNatureVal,
      investorIntro: toNull(values.investorIntroduction),
      industryCode: industryCodeVal,
      rdPlatform: toNull(values.rdPlatformLevel),
      rdRatioAvg3y: toNull(values.avgRdIntensityLast3years),
      inventionPatents: toNull(values.inventionPatentCountDisplay),
      utilityPatents: toNull(values.utilityPatentCountDisplay),
      landType: toNull(values.landTypeDisplay),
      currentAmount: toNull(currentAmountVal),
      ifTwoHigh: values.isHighPollutionHighEnergy !== undefined ? values.isHighPollutionHighEnergy : null,
      energyReviewDone: yesNoToBool(values.energyReviewCompletedDisplay),
      envAssessmentDone: yesNoToBool(values.eiaCompletedDisplay),
      ifFiled: yesNoToBool(values.isFilingDisplay),
      safetyApprovalDone: yesNoToBool(values.hasSafetyApprovalDisplay),
      highlights: toNull(values.projectHighlights),
      // 产业指标（工业：expectOutput；服务：currentAmount 由预期开票承接）
      expectOutput: toNull(values.expectedOutputValue),
      worker: toNull(values.expectedEmployment),
      revenuePerMu: toNull(values.taxPerMuDisplay),
      // 用地指标（新增/存量统一落到 landArea / landUseProcedures）
      landArea: landAreaVal,
      isBasicFarmland: isBasicFarmlandVal,
      isEcologicalBoundary: isEcologicalBoundaryVal,
      landUseProcedures: landUseProceduresVal,

      // --- 保留：原表单/历史接口使用的字段（与新字段并行，不删）---
      onlinePlatformProjectCode: toNull(values.onlinePlatformProjectCode),
      constructionLocation: toNull(values.constructionLocation),
      constructionContentAndScale: toNull(values.constructionContentAndScale),
      mainProductsAndCapacity: toNull(values.mainProductsAndCapacity),
      constructionPeriod:
        values.constructionPeriod && Array.isArray(values.constructionPeriod) && values.constructionPeriod.length === 2
          ? `${values.constructionPeriod[0].year()}-${values.constructionPeriod[1].year()}`
          : null,
      phasedStatus: toNull(values.phasedStatus),
      plannedTotalInvestmentDomestic: plannedDomestic ?? toNull(values.plannedTotalInvestmentDomestic),
      plannedTotalInvestmentForeign: plannedForeign ?? toNull(values.plannedTotalInvestmentForeign),
      expectedOutputValue: toNull(values.expectedOutputValue),
      expectedTaxRevenue: toNull(values.expectedTaxRevenue),
      expectedInvoiceAmount: toNull(values.expectedInvoiceAmount),
      expectedEmployment: toNull(values.expectedEmployment),
      annualPlannedInvestment: toNull(values.annualPlannedInvestment),
      estimatedStartDate: values.estimatedStartDate
        ? dayjsToApiDatePreservingCalendarDay(dayjs(values.estimatedStartDate)) ?? null
        : null,
      actualOrEstimatedStartDate: values.actualOrEstimatedStartDate
        ? dayjsToApiDatePreservingCalendarDay(dayjs(values.actualOrEstimatedStartDate)) ?? null
        : null,
      firstFullProductionDate: values.firstFullProductionDate
        ? dayjsToApiDatePreservingCalendarDay(dayjs(values.firstFullProductionDate)) ?? null
        : null,
      isExpansionOrReinvestment:
        values.isExpansionOrReinvestment !== undefined ? values.isExpansionOrReinvestment : null,
      unifiedSocialCreditCode: toNull(values.unifiedSocialCreditCode),
      investorIntroduction: toNull(values.investorIntroduction),
      totalLandRequirement: toNull(values.totalLandRequirement),
      leaseOrRevitalization: toNull(values.leaseOrRevitalization),
      newLandArea: toNull(values.newLandArea),
      involvesBasicFarmland: values.involvesBasicFarmland !== undefined ? values.involvesBasicFarmland : null,
      withinEcologicalRedline: values.withinEcologicalRedline !== undefined ? values.withinEcologicalRedline : null,
      landProcedureStatus: toNull(values.landProcedureStatus),
      existingAreaUsage: toNull(values.existingAreaUsageDisplay),
      landProcedureStatusStock: toNull(values.landProcedureStatusStockDisplay),
      plotRatio: toNull(values.plotRatio),
      annualEnergyConsumption: toNull(values.annualEnergyConsumption),
      isHighPollutionHighEnergy:
        values.isHighPollutionHighEnergy !== undefined ? values.isHighPollutionHighEnergy : null,
      /** 新接口：JSON 字符串，内容为 `{ url, name }[]` 便于回显原始文件名 */
      energyZzcl: (() => {
        const items = mergeZzclForSubmit(
          values.energyReviewOpinion as any,
          typeof values.energyReviewOpinion === 'string' ? values.energyReviewOpinion : undefined,
        );
        return serializeZzclForApi(items);
      })(),
      // 后端字段：项目环境影响情况使用 envSitu
      envSitu: toNull(values.environmentalImpactDescription),
      environmentZzcl: (() => {
        const items = mergeZzclForSubmit(
          values.eiaApprovalStatus as any,
          typeof values.eiaApprovalStatus === 'string' ? values.eiaApprovalStatus : undefined,
        );
        return serializeZzclForApi(items);
      })(),
      isHighTechEnterprise: values.isHighTechEnterprise !== undefined ? values.isHighTechEnterprise : null,
      rdPlatformLevel: toNull(values.rdPlatformLevel),
      avgRdIntensityLast3years: toNull(values.avgRdIntensityLast3years),
      ledByHighLevelTalent: values.ledByHighLevelTalent !== undefined ? values.ledByHighLevelTalent : null,
      intellectualPropertyInfo: toNull(values.intellectualPropertyInfo),
      filingStatus: toNull(values.isFilingDisplay),
      filedZzcl: (() => {
        const items = mergeZzclForSubmit(
          values.filingDocUrlDisplay as any,
          typeof values.filingDocUrlDisplay === 'string' ? values.filingDocUrlDisplay : undefined,
        );
        return serializeZzclForApi(items);
      })(),
      safetyProductionStatus: toNull(values.hasSafetyApprovalDisplay),
      safetyZzcl: (() => {
        const items = mergeZzclForSubmit(
          values.safetyEvaluationApproval as any,
          typeof values.safetyEvaluationApproval === 'string'
            ? values.safetyEvaluationApproval
            : undefined,
        );
        return serializeZzclForApi(items);
      })(),
      isInStatisticalDatabase: values.isInStatisticalDatabase !== undefined ? values.isInStatisticalDatabase : null,
      statisticalDatabaseCode: toNull(values.statisticalDatabaseCode),
      projectHighlights: toNull(values.projectHighlights),
      supportingDocumentsUrl: toNull(
        legacyUrlCsvFromItems(
          mergeZzclForSubmit(
            values.supportingDocumentsUrl as any,
            typeof values.supportingDocumentsUrl === 'string' ? values.supportingDocumentsUrl : undefined,
          ),
        ),
      ),
      investmentCompletedByEnd2025: toNull(values.investmentCompletedByEnd2025),
      plannedInvestment2026: toNull(values.plannedInvestment2026),
      progressByEnd2025: toNull(values.progressByEnd2025),
      constructionTarget2026: toNull(values.constructionTarget2026),
      isNewlyStartedIn2026: values.isNewlyStartedIn2026 !== undefined ? values.isNewlyStartedIn2026 : null,
      responsibleUnit: toNull(values.responsibleUnit),
      projectLocationAdmin: toNull(values.projectLocationAdmin),
      remarks: toNull(values.remarks),
      projectEvaluationStatus: toNull(values.projectEvaluationStatus),
    };
  };

  // 获取数据
  const fetchData = async (
    params?: Partial<ListProjectKeyProjectRequest> & { status?: boolean; page?: number; size?: number },
  ) => {
    setLoading(true);
    try {
      /** 接口 list：草稿 true，正式 false；未传参时与当前「草稿箱」开关一致，默认 false */
      const useDraftList: boolean =
        params?.status !== undefined && params?.status !== null ? params.status : listDraftBoxMode;
      const boolPick = {
        ...(params?.isNewStart === true || params?.isNewStart === false
          ? { isNewStart: params.isNewStart }
          : {}),
        ...(params?.isStart === true || params?.isStart === false ? { isStart: params.isStart } : {}),
        ...(params?.isStatistics === true || params?.isStatistics === false
          ? { isStatistics: params.isStatistics }
          : {}),
      };
      const data = await primeApi.listProjectKeyProject({
        status: useDraftList,
        projectName: params?.projectName ?? '',
        projectFgName: params?.projectFgName ?? '',
        content: params?.content ?? '',
        projectSource: params?.projectSource ?? '',
        investmentType: params?.investmentType ?? '',
        industryService: params?.industryService ?? '',
        district: params?.district ?? '',
        park: params?.park ?? '',
        investor: params?.investor ?? '',
        ...boolPick,
        page: params?.page ?? pagination.current,
        size: params?.size ?? pagination.pageSize,
      });
      const records = data.records || [];
      // 评估状态仅展示接口返回值：不在前端做推导/注入
      setDataSource(records);
      // 刷新列表后清空选择，避免状态变化后已勾选行仍可被批量操作
      setSelectedRowKeys([]);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
        current: data.page || prev.current,
        pageSize: data.size || prev.pageSize,
      }));
    } catch (error: any) {
      console.error('获取数据失败:', error);
      message.error(error?.message || '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 表单提交
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData({
      ...pickKeyProjectListFilters(values),
      page: 1,
      size: pagination.pageSize,
      status: listDraftBoxMode,
    });
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    setListParkSearchOptions([]);
    setListDraftBoxMode(false);
    syncDraftStatusUrl(false);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData({
      ...pickKeyProjectListFilters({}),
      page: 1,
      size: pagination.pageSize,
      status: false,
    });
  };

  /** 批量导出重点项目（/project-key-project/export.xlsx），筛选与列表 list 一致 */
  const handleExport = async () => {
    try {
      setExporting(true);
      const fv = form.getFieldsValue() as FieldType;
      const listFilters = pickKeyProjectListFilters(fv);
      const exportParams: ExportProjectKeyProjectRequest = {
        status: listDraftBoxMode,
        ...listFilters,
      };
      const res = await primeApi.exportProjectKeyProject(exportParams);
      if (!res || !res.path) {
        message.error('导出失败：未获取到文件路径');
        return;
      }
      const rawPath = String(res.path ?? '');
      const cleanedPath = rawPath.replace(/#+$/, '');
      let fileUrl: string = cleanedPath;
      if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
        const absPath = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
        fileUrl = `${window.location.origin}${absPath}`;
      }
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = res.name || '重点项目导出.xlsx';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
      message.success('导出成功');
    } catch (error: any) {
      console.error('导出失败:', error);
      message.error(error?.message || '导出失败');
    } finally {
      setExporting(false);
    }
  };

  // 推送（表格行操作）
  const handlePush = (projectId: string) => {
    setPushingProjectIds([projectId]);
    setIsPushModalOpen(true);
    setSelectedReviewers([]);
    if (pushDeptOptions.length === 0) {
      getPushDeptOptions();
    }
  };

  // 编辑项目
  const handleEdit = async (id: string) => {
    setEditingId(id);
    setIsEditModalOpen(true);
    setParkOptions([]);
    addForm.resetFields();

    try {
      const data = await primeApi.getProjectKeyProject({ id });
      const vo = data as any;

      // 根据区县设置园区选项
      if (vo.district) {
        const selectedDistrict = areaData[0]?.children?.find((d: any) => d.value === vo.district);
        const parks =
          selectedDistrict?.children?.map((p: any) => ({
            value: p.value,
            label: p.label,
          })) || [];
        setParkOptions(parks);
      }

      // 回显表单数据
      addForm.setFieldsValue({
        // --- 接口字段（ProjectKeyProjectVo）回显到表单展示字段 ---
        onlinePlatformProjectCode: vo.digitalInvestmentId ?? vo.onlinePlatformProjectCode ?? undefined,
        inInvestCode: vo.inInvestCode ?? undefined,
        projectName: vo.projectName || undefined,
        fgName:
          vo.fgName ??
          vo.fgProjectName ??
          vo.fg_project_name ??
          vo.fg_name ??
          undefined,
        projectSource:
          vo.projectSource ??
          vo.source ??
          vo.project_source ??
          undefined,
        district: vo.district || undefined,
        park: vo.park || undefined,
        industryCategoryDisplay: vo.industryCategory ?? undefined,
        projectTypeDisplay: vo.projectType ?? undefined,
        plannedInvestmentTypeDisplay: vo.investmentType ?? undefined,
        plannedInvestmentAmountDisplay: vo.totalInvestmentAmount ?? undefined,
        isPhasedDisplay: normalizeYesNoText(vo.ifPhased ?? vo.isPhased),
        amountPerPhaseDisplay: vo.currentAmount ?? vo.amountPerPhase ?? vo.phaseAmount ?? vo.perPhaseAmount ?? undefined,
        x: resolveKeyProject813XFromVo(vo),
        industryCode: resolveKeyProjectGgIndustryCodeFromVo(vo),
        inventionPatentCountDisplay: vo.inventionPatents ?? vo.inventionPatentCountDisplay ?? undefined,
        utilityPatentCountDisplay: vo.utilityPatents ?? vo.utilityPatentCountDisplay ?? undefined,
        taxPerMuDisplay: vo.revenuePerMu ?? vo.taxPerMu ?? vo.taxPerMuDisplay ?? undefined,
        constructionContentAndScale: vo.constructionContent ?? vo.constructionContentAndScale ?? undefined,
        mainProductsAndCapacity: vo.mainProductsCapacity ?? vo.mainProductsAndCapacity ?? undefined,
        constructionPeriod:
          vo.startYear !== undefined &&
          vo.startYear !== null &&
          vo.endYear !== undefined &&
          vo.endYear !== null
            ? [dayjs(String(vo.startYear)), dayjs(String(vo.endYear))]
            : undefined,
        constructionStartDateDisplay:
          vo.startYear !== undefined && vo.startYear !== null
            ? dayjs(new Date(Number(vo.startYear), 0, 1))
            : undefined,
        constructionEndDateDisplay:
          vo.endYear !== undefined && vo.endYear !== null
            ? dayjs(new Date(Number(vo.endYear), 0, 1))
            : undefined,
        phasedStatus: vo.phasedStatus || undefined,
        plannedTotalInvestmentDomestic: vo.plannedTotalInvestmentDomestic || undefined,
        plannedTotalInvestmentForeign: vo.plannedTotalInvestmentForeign || undefined,
        expectedOutputValue: (vo.expectOutput ?? vo.expectedOutputValue) ?? undefined,
        expectedTaxRevenue: (vo.revenuePerMu ?? vo.expectedTaxRevenue) ?? undefined,
        expectedInvoiceAmount: (vo.currentAmount ?? vo.expectedInvoiceAmount) ?? undefined,
        expectedEmployment: (vo.worker ?? vo.expectedEmployment) ?? undefined,
        annualPlannedInvestment: (vo.annualPlanInvestment ?? vo.annualPlannedInvestment) || undefined,
        annualImageProgress: vo.annualImageProgress || undefined,
        estimatedStartDate: vo.estimatedStartDate ? dayjs(vo.estimatedStartDate) : undefined,
        actualOrEstimatedStartDate: vo.actualOrEstimatedStartDate ? dayjs(vo.actualOrEstimatedStartDate) : undefined,
        firstFullProductionDate: vo.firstFullProductionDate ? dayjs(vo.firstFullProductionDate) : undefined,
        isExpansionOrReinvestment: vo.isExpansionOrReinvestment ?? undefined,
        constructionLocation: vo.constructionLocation || undefined,
        investorName: vo.investorName || undefined,
        unifiedSocialCreditCode: (vo.creditCode ?? vo.unifiedSocialCreditCode) || undefined,
        investorNature: (() => {
          const raw = vo.investorNature;
          if (!raw) return undefined;
          const s = String(raw).trim();
          // 兼容：后端可能返回 JSON 字符串或逗号字符串
          if (s.startsWith('[')) {
            try {
              const arr = JSON.parse(s);
              return Array.isArray(arr) ? arr : undefined;
            } catch {
              return undefined;
            }
          }
          return s.split(',').map((x) => x.trim()).filter(Boolean);
        })(),
        investorIntroduction: (vo.investorIntro ?? vo.investorIntroduction) || undefined,
        totalLandRequirement: vo.totalLandRequirement || undefined,
        leaseOrRevitalization: vo.leaseOrRevitalization || undefined,
        newLandArea: vo.landArea !== undefined && vo.landArea !== null ? String(vo.landArea) : vo.newLandArea || undefined,
        involvesBasicFarmland: vo.isBasicFarmland ?? vo.involvesBasicFarmland ?? undefined,
        withinEcologicalRedline: vo.isEcologicalBoundary ?? vo.withinEcologicalRedline ?? undefined,
        landProcedureStatus: vo.landUseProcedures ?? vo.landProcedureStatus ?? undefined,
        plotRatio: vo.plotRatio || undefined,
        annualEnergyConsumption: vo.annualEnergyConsumption || undefined,
        isHighPollutionHighEnergy: normalizeTwoHighForForm(
          vo.ifTwoHigh ?? vo.isTwoHigh ?? vo.isHighPollutionHighEnergy ?? (data as any).is_two_high,
        ),
        energyReviewOpinion: pathsToFileList(vo.energyZzcl ?? (data as any).energyReviewOpinion),
        environmentalImpactDescription: (vo.envSitu ?? vo.environmentalImpactDescription) || undefined,
        eiaApprovalStatus: pathsToFileList(vo.environmentZzcl ?? (data as any).eiaApprovalStatus),
        isHighTechEnterprise: vo.isHighTechEnterprise ?? undefined,
        rdPlatformLevel: (vo.rdPlatform ?? vo.rdPlatformLevel) || undefined,
        // 占比可为 0，不能用 || undefined 否则回显丢失
        avgRdIntensityLast3years: (() => {
          const v = vo.rdRatioAvg3y ?? vo.avgRdIntensityLast3years;
          if (v === undefined || v === null || v === '') return undefined;
          const n = Number(v);
          return Number.isFinite(n) ? n : undefined;
        })(),
        ledByHighLevelTalent: vo.ledByHighLevelTalent ?? undefined,
        intellectualPropertyInfo: vo.intellectualPropertyInfo || undefined,
        filingStatus: (data as any).filingStatus ?? undefined,
        safetyProductionStatus: (data as any).safetyProductionStatus ?? undefined,
        safetyEvaluationApproval: pathsToFileList(vo.safetyZzcl ?? (data as any).safetyEvaluationApproval),
        isInStatisticalDatabase: vo.isInStatisticalDatabase ?? undefined,
        statisticalDatabaseCode: vo.statisticalDatabaseCode || undefined,
        projectHighlights: (vo.highlights ?? vo.projectHighlights) || undefined,
        landTypeDisplay: (() => {
          const lt = vo.landType ?? vo.landTypeDisplay;
          if (lt === '新增用地' || lt === '存量厂房') return lt;
          if (vo.newLandArea !== null && vo.newLandArea !== undefined && vo.newLandArea !== '') return '新增用地';
          if ((data as any).landProcedureStatusStock || (data as any).existingAreaUsage) return '存量厂房';
          return undefined;
        })(),
        existingAreaUsageDisplay:
          vo.landArea !== undefined && vo.landArea !== null
            ? String(vo.landArea)
            : (data as any).existingAreaUsageDisplay ?? (data as any).existingAreaUsage ?? undefined,
        landProcedureStatusStockDisplay:
          vo.landUseProcedures ??
          ((data as any).landProcedureStatusStockDisplay ?? (data as any).landProcedureStatusStock ?? undefined),
        energyReviewCompletedDisplay: normalizeYesNoText((data as any).energyReviewDone),
        eiaCompletedDisplay: normalizeYesNoText((data as any).envAssessmentDone),
        isFilingDisplay: normalizeYesNoText(vo.ifFiled ?? vo.isFiled ?? vo.isFiledDisplay ?? vo.filingStatus),
        filingDocUrlDisplay: pathsToFileList(vo.filedZzcl ?? (data as any).filingEvidence),
        hasSafetyApprovalDisplay: normalizeYesNoText(
          vo.safetyApprovalDone ?? vo.hasSafetyApprovalDisplay ?? vo.safetyProductionStatus,
        ),
        supportingDocumentsUrl: vo.supportingDocumentsUrl
          ? pathsToFileList(vo.supportingDocumentsUrl)
          : undefined,
        investmentCompletedByEnd2025: vo.investmentCompletedByEnd2025 || undefined,
        plannedInvestment2026: vo.plannedInvestment2026 || undefined,
        progressByEnd2025: vo.progressByEnd2025 || undefined,
        constructionTarget2026: vo.constructionTarget2026 || undefined,
        isNewlyStartedIn2026: vo.isNewlyStartedIn2026 ?? undefined,
        responsibleUnit: vo.responsibleUnit || undefined,
        projectLocationAdmin: vo.projectLocationAdmin || undefined,
        remarks: vo.remarks || undefined,
        projectEvaluationStatus: vo.projectEvaluationStatus || undefined,
      });
    } catch (error: any) {
      console.error('获取项目详情失败:', error);
      message.error(error?.message || '获取项目详情失败');
      setIsEditModalOpen(false);
      setEditingId('');
    }
  };

  /** 列表行区县展示：接口多为 code，兼容 districtName / 字典 label */
  const getDistrictDisplayText = (record: any) => {
    const r = record as Record<string, unknown>;
    const byName = r.districtName ?? r.districtLabel;
    if (byName !== undefined && byName !== null && String(byName).trim() !== '') return String(byName);
    const code = r.district;
    if (code === null || code === undefined || code === '') return '';
    const opt = districtOptions.find((o) => o.value === code);
    return opt?.label !== undefined && opt?.label !== null && opt.label !== '' ? String(opt.label) : String(code);
  };

  /** 草稿箱列表：删除草稿并刷新 */
  const confirmDeleteDraft = (recordId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定删除该草稿吗？删除后无法恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await primeApi.deleteProjectKeyProject({ id: recordId });
          message.success('删除成功');
          const fv = form.getFieldsValue();
          await fetchData({
            ...pickKeyProjectListFilters(fv as FieldType),
            page: pagination.current,
            size: pagination.pageSize,
            status: listDraftBoxMode,
          });
        } catch (error) {
          await handleApiError(error);
        }
      },
    });
  };

  /** 草稿箱操作列：与 ProjectManage7 非招商草稿列表胶囊按钮一致 */
  const draftRowActionLabelStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    maxWidth: '90px',
  };

  // 表格列定义（字段名与 list 接口 ProjectKeyProjectVo 及后端扩展字段对齐）
  const columns = [
    {
      title: '发改项目名称',
      dataIndex: 'fgName',
      key: 'fgName',
      width: 200,
      align: 'left' as const,
      ellipsis: true,
      render: (text: unknown, record: any) => {
        const v =
          text ??
          record?.fgName ??
          record?.fgProjectName ??
          record?.fg_project_name ??
          record?.fg_name ??
          record?.fg_project_name;
        return v !== undefined && v !== null && String(v).trim() !== '' ? String(v) : '-';
      },
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 200,
      align: 'left' as const,
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '计划总投资',
      dataIndex: 'totalInvestmentAmount',
      key: 'totalInvestmentAmount',
      width: 140,
      align: 'center' as const,
      render: (text: unknown, record: any) => {
        if (text === undefined || text === null || text === '') return '-';
        const invType = record?.investmentType;
        const unit = invType === '内资' ? '万元' : invType === '外资' ? '万美元' : '';
        return `${String(text)}${unit}`;
      },
    },
    {
      title: '年度计划投资（万元）',
      dataIndex: 'annualPlanInvestment',
      key: 'annualPlanInvestment',
      width: 140,
      align: 'center' as const,
      render: (text: unknown, record: any) => {
        const v = text ?? record?.annualPlanInvestment ?? record?.annualPlannedInvestment;
        return v === undefined || v === null || v === '' ? '-' : String(v);
      },
    },
    {
      title: '形象进度',
      dataIndex: 'annualImageProgress',
      key: 'annualImageProgress',
      width: 220,
      align: 'center' as const,
      ellipsis: true,
      render: (text: unknown, record: any) => {
        const v = text ?? record?.annualImageProgress;
        return v === undefined || v === null || String(v).trim() === '' ? '-' : String(v);
      },
    },
    {
      title: (
        <span>
          是否2026年
          <br />
          新开工
        </span>
      ),
      dataIndex: 'ifNewStart2026',
      key: 'ifNewStart2026',
      width: 140,
      align: 'center' as const,
      render: (text: unknown, record: any) =>
        normalizeYesNoText(
          text ??
            record?.ifNewStart2026 ??
            record?.if_new_start_2026 ??
            record?.if_new_start2026 ??
            record?.ifNewStart ??
            record?.if_new_start,
        ) ?? '-',
    },
    {
      title: (
        <span>
          是否开工
          <br />
          （是/否）
        </span>
      ),
      dataIndex: 'ifStart',
      key: 'ifStart',
      width: 140,
      align: 'center' as const,
      render: (text: unknown, record: any) =>
        normalizeYesNoText(text ?? record?.ifStart ?? record?.if_start) ?? '-',
    },
    {
      title: (
        <span>
          是否列统
          <br />
          （是/否）
        </span>
      ),
      dataIndex: 'ifStorage',
      key: 'ifStorage',
      width: 160,
      align: 'center' as const,
      render: (text: unknown, record: any) =>
        normalizeYesNoText(text ?? record?.ifStorage ?? record?.if_storage) ?? '-',
    },
    {
      title: (
        <span>
          累计列统投资
          <br />
          （万元）
        </span>
      ),
      dataIndex: 'inInvest',
      key: 'inInvest',
      width: 150,
      align: 'center' as const,
    },
    {
      title: '列统投资完成率（%）',
      dataIndex: 'investmentCompletionRate',
      key: 'investmentCompletionRate',
      width: 150,
      align: 'center' as const,
      render: (text: unknown) => (text === undefined || text === null || text === '' ? '-' : String(text)),
    },
    {
      title: '项目内容',
      key: 'constructionContent',
      width: 200,
      align: 'left' as const,
      ellipsis: true,
      render: (_: unknown, record: any) => {
        const r = record as Record<string, unknown>;
        const v =
          r.constructionContent ?? r.constructionContentAndScale ?? r.projectContent ?? r.mainProductsCapacity;
        return v !== undefined && v !== null && String(v).trim() !== '' ? String(v) : '-';
      },
    },
    {
      title: '项目代码',
      dataIndex: 'digitalInvestmentId',
      key: 'digitalInvestmentId',
      width: 160,
      align: 'center' as const,
      ellipsis: true,
      render: (text: unknown, record: any) => {
        const v = text ?? record?.onlinePlatformProjectCode;
        return v !== undefined && v !== null && String(v).trim() !== '' ? String(v) : '-';
      },
    },
    {
      title: '来源',
      dataIndex: 'projectSource',
      key: 'projectSource',
      width: 120,
      align: 'center' as const,
      ellipsis: true,
      render: (text: unknown) =>
        text !== undefined && text !== null && String(text).trim() !== '' ? String(text) : '-',
    },
    {
      title: '所属板块',
      key: 'park',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: any) => {
        const r = record as Record<string, unknown>;

        // 1) 先优先使用后端如果直接返回的园区名称（不同接口字段名可能不同）
        const direct =
          r.parkName ??
          (r as any).PARKNAME ??
          (r as any).parkname ??
          r.belongingPark ??
          (r as any).parkNameDisplay;
        if (direct !== undefined && direct !== null && String(direct).trim() !== '') return String(direct).trim();

        // 2) 否则用行政区划树反查：district(区县) + park(园区 code) -> park 中文名
        const parkCode = String(r.park ?? (r as any).parkCode ?? '').trim();
        const districtCode = String(r.district ?? (r as any).districtCode ?? '').trim();
        const districtLabel = String(r.districtName ?? (r as any).districtLabel ?? '').trim();

        const districts = areaData[0]?.children ?? [];
        if (parkCode && districts.length) {
          const districtNode =
            districts.find((d: any) => String(d.value ?? '').trim() === districtCode) ??
            districts.find((d: any) => String(d.label ?? '').trim() === districtLabel);

          const parks = districtNode?.children ?? [];
          const parkNode =
            parks.find((p: any) => String(p.value ?? '').trim() === parkCode) ??
            parks.find((p: any) => String(p.label ?? '').trim() === parkCode);

          if (parkNode?.label) return String(parkNode.label).trim();
        }

        // 3) 兜底：展示 code
        return parkCode ? parkCode : '-';
      },
    },
    {
      title: '所属区县',
      key: 'district',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: any) => {
        const t = getDistrictDisplayText(record);
        return t !== '' ? t : '-';
      },
    },
    {
      title: '评估状态',
      key: 'projectEvaluationStatus',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: any) => {
        const v = record?.projectEvaluationStatus;
        return v === null || v === undefined ? '-' : String(v);
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: any) => {
        if (listDraftBoxMode) {
          const rid = record.id as string | undefined;
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  role="button"
                  tabIndex={0}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '85px',
                    height: '28px',
                    background: '#1890FF',
                    borderRadius: '14px',
                    fontSize: '14px',
                    marginRight: '10px',
                    color: '#fff',
                  }}
                  onClick={() => {
                    if (rid) {
                      handleEdit(rid);
                    } else {
                      message.warning('项目ID不存在');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (rid) {
                        handleEdit(rid);
                      } else {
                        message.warning('项目ID不存在');
                      }
                    }
                  }}
                >
                  <span style={draftRowActionLabelStyle}>编辑</span>
                  <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '85px',
                    height: '28px',
                    background: '#ff4d4f',
                    borderRadius: '14px',
                    fontSize: '14px',
                    color: '#fff',
                  }}
                  onClick={() => {
                    if (rid) {
                      confirmDeleteDraft(String(rid));
                    } else {
                      message.warning('项目ID不存在');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (rid) {
                        confirmDeleteDraft(String(rid));
                      } else {
                        message.warning('项目ID不存在');
                      }
                    }
                  }}
                >
                  <span style={draftRowActionLabelStyle}>删除</span>
                </div>
              </div>
            </div>
          );
        }

        // 推送显示/隐藏逻辑：
        // - projectEvaluationStatus 为 null/undefined/''/ '未推送' => 显示“推送”
        // - 其他任何非空值 => 隐藏“推送”
        const v = record?.projectEvaluationStatus;
        const showPush = v === null || v === undefined || v === '' || v === '未推送';

        return (
          <Space>
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => {
                if (record.id) {
                  handleEdit(record.id);
                } else {
                  message.warning('项目ID不存在');
                }
              }}
            >
              编辑
            </Button>

            {showPush && canKeyProjectPush && (
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  if (record.id) {
                    handlePush(record.id);
                  } else {
                    message.warning('项目ID不存在');
                  }
                }}
              >
                推送
              </Button>
            )}

            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => {
                if (record.id) {
                  navigate(`/key-project/detail?id=${record.id}`);
                } else {
                  message.warning('项目ID不存在');
                }
              }}
            >
              评估结果
            </Button>
          </Space>
        );
      },
    },
  ];

  // 行选择配置（草稿箱不展示多选，与正式列表批量推送无关）
  const rowSelection = listDraftBoxMode
    ? undefined
    : {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
          setSelectedRowKeys(selectedKeys);
        },
        // 只有当推送按钮可见时才允许勾选；即 projectEvaluationStatus 为 null/undefined/''/'未推送'
        getCheckboxProps: (record: any) => {
          const v = record?.projectEvaluationStatus;
          const showPush = v === null || v === undefined || v === '' || v === '未推送';
          return { disabled: !showPush || !canKeyProjectPush };
        },
      };

  // 分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    const formValues = form.getFieldsValue() as FieldType;
    fetchData({
      ...pickKeyProjectListFilters(formValues),
      page,
      size: pageSize,
      status: listDraftBoxMode,
    });
  };

  // 导入
  // const handleImport = () => {
  //   setIsImportModalOpen(true);
  //   setImportFileList([]);
  // };

  // 关闭导入弹框
  const handleImportCancel = () => {
    setIsImportModalOpen(false);
    setImportFileList([]);
  };

  // 下载模板
  const handleDownloadTemplate = async () => {
    try {
      const res = await primeApi.getProjectKeyProjectImportTemplate();
      if (!res || !res.path) {
        message.error('下载失败：未获取到文件路径');
        return;
      }

      // 处理文件路径
      let fileUrl = res.path;
      if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
        fileUrl = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
      }

      // 使用 a 标签下载
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = res.name || '重点项目导入模板.xlsx';
      a.target = '_blank';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);

      message.success('模板下载成功');
    } catch (error: any) {
      console.error('下载模板失败:', error);
      message.error(error?.message || '下载模板失败');
    }
  };

  // 文件上传配置
  const importUploadProps: UploadProps = {
    fileList: importFileList,
    beforeUpload: (file) => {
      // 只允许上传 Excel 文件
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls');
      if (!isExcel) {
        message.error('只能上传 Excel 文件（.xlsx 或 .xls）');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setImportLoading(true);
        const result = await primeApi.importProjectKeyProject({
          file: file as Blob,
        });

        if (onSuccess) {
          onSuccess(result as any);
        }

        message.success(`导入成功！成功：${result.successCount || 0} 条，失败：${result.failCount || 0} 条`);
        setIsImportModalOpen(false);
        setImportFileList([]);

        // 刷新列表
        const formValues = form.getFieldsValue() as FieldType;
        fetchData({
          ...pickKeyProjectListFilters(formValues),
          page: pagination.current,
          size: pagination.pageSize,
          status: listDraftBoxMode,
        });
      } catch (error: any) {
        console.error('导入失败:', error);
        if (onError) {
          onError(error as any);
        }
        message.error(error?.message || '导入失败');
      } finally {
        setImportLoading(false);
      }
    },
    onChange: ({ fileList }) => {
      setImportFileList(fileList);
    },
    maxCount: 1,
  };

  // 批量推送（顶部按钮）
  const handleBatchPush = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要推送的项目');
      return;
    }
    setPushingProjectIds(selectedRowKeys as string[]);
    setIsPushModalOpen(true);
    setSelectedReviewers([]);
    if (pushDeptOptions.length === 0) {
      getPushDeptOptions();
    }
  };

  // 关闭推送弹框
  const handlePushCancel = () => {
    setIsPushModalOpen(false);
    setPushingProjectIds([]);
    setSelectedReviewers([]);
  };

  // 确认推送
  const handlePushConfirm = async () => {
    if (pushingProjectIds.length === 0) {
      message.error('项目ID不存在');
      return;
    }
    if (selectedReviewers.length === 0) {
      message.warning('请至少选择一个推送部门');
      return;
    }

    setPushLoading(true);
    try {
      // 确保参数是数组格式
      const projectIdsArray = Array.isArray(pushingProjectIds) ? pushingProjectIds : [pushingProjectIds];
      const reviewerArray = Array.isArray(selectedReviewers) ? selectedReviewers : [selectedReviewers];

      await primeApi.createProjectKeyProjectReview({
        projectIds: projectIdsArray,
        reviewer: reviewerArray,
      });
      message.success('推送成功');
      setIsPushModalOpen(false);
      setPushingProjectIds([]);
      setSelectedReviewers([]);
      // 刷新列表
      const formValues = form.getFieldsValue() as FieldType;
      fetchData({
        ...pickKeyProjectListFilters(formValues),
        page: pagination.current,
        size: pagination.pageSize,
        status: listDraftBoxMode,
      });
    } catch (error: any) {
      console.error('推送失败:', error);
      message.error(error?.message || '推送失败');
    } finally {
      setPushLoading(false);
    }
  };

  // 新增
  // const handleAdd = () => {
  //   setIsModalOpen(true);
  //   addForm.resetFields();
  //   setParkOptions([]); // 重置园区选项
  // };

  // 关闭弹框
  const handleCancel = () => {
    setIsModalOpen(false);
    addForm.resetFields();
    setParkOptions([]); // 重置园区选项
  };

  // 关闭编辑弹框
  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    addForm.resetFields();
    setParkOptions([]);
    setEditingId('');
    setEditDraftSaving(false);
  };

  /** 草稿箱下编辑弹窗：暂存（status=1），校验逻辑与 KeyProjectApplyModal 一致 */
  const handleEditModalDraftSave = async () => {
    if (editDraftSaving || !editingId) return;
    const codeTrimDraft = String(addForm.getFieldValue('onlinePlatformProjectCode') ?? '').trim();
    const nameTrimDraft = String(addForm.getFieldValue('projectName') ?? '').trim();
    const draftFieldErrors: { name: 'onlinePlatformProjectCode' | 'projectName'; errors: string[] }[] = [];
    if (!codeTrimDraft) {
      draftFieldErrors.push({ name: 'onlinePlatformProjectCode', errors: ['请填写项目代码'] });
    }
    if (!nameTrimDraft) {
      draftFieldErrors.push({ name: 'projectName', errors: ['请输入项目名称'] });
    }
    if (draftFieldErrors.length > 0) {
      addForm.setFields(draftFieldErrors);
      message.warning(
        !codeTrimDraft && !nameTrimDraft
          ? '暂存草稿前请填写项目代码与项目名称'
          : !codeTrimDraft
            ? '暂存草稿前请填写项目代码'
            : '暂存草稿前请填写项目名称',
      );
      return;
    }
    try {
      setEditDraftSaving(true);
      const storeAll = addForm.getFieldsValue(true) as AddFormType;
      const projectData = {
        ...buildProjectKeyProjectDto(storeAll),
        status: PROJECT_KEY_PROJECT_STATUS_DRAFT,
      };
      await primeApi.updateProjectKeyProject({
        id: editingId,
        projectKeyProjectDto: projectData,
      });
      message.success('草稿已暂存');
      setIsEditModalOpen(false);
      addForm.resetFields();
      setParkOptions([]);
      setEditingId('');
      const formValues = form.getFieldsValue() as FieldType;
      fetchData({
        ...pickKeyProjectListFilters(formValues),
        page: pagination.current,
        size: pagination.pageSize,
        status: listDraftBoxMode,
      });
    } catch (error: any) {
      console.error('暂存草稿失败:', error);
      message.error(error?.message || '暂存草稿失败');
    } finally {
      setEditDraftSaving(false);
    }
  };

  // 新增表单提交
  const onAddFinish: FormProps<AddFormType>['onFinish'] = async (values) => {
    setAddFormLoading(true);
    try {
      const projectData = buildProjectKeyProjectDto(values);

      await primeApi.createProjectKeyProject({
        projectKeyProjectDto: projectData,
      });

      message.success('新增项目成功');
      setIsModalOpen(false);
      addForm.resetFields();
      setParkOptions([]); // 重置园区选项
      // 刷新列表
      const formValues = form.getFieldsValue() as FieldType;
      fetchData({
        ...pickKeyProjectListFilters(formValues),
        page: pagination.current,
        size: pagination.pageSize,
        status: listDraftBoxMode,
      });
    } catch (error: any) {
      console.error('新增项目失败:', error);
      message.error(error?.message || '新增项目失败');
    } finally {
      setAddFormLoading(false);
    }
  };

  // 编辑表单提交
  const onEditFinish: FormProps<AddFormType>['onFinish'] = async (values) => {
    if (!editingId) {
      message.error('项目ID不存在');
      return;
    }

    setEditFormLoading(true);
    try {
      const projectData = {
        ...buildProjectKeyProjectDto(values),
        status: PROJECT_KEY_PROJECT_STATUS_FORMAL,
      };

      await primeApi.updateProjectKeyProject({
        id: editingId,
        projectKeyProjectDto: projectData,
      });

      message.success('更新项目成功');
      setIsEditModalOpen(false);
      addForm.resetFields();
      setParkOptions([]);
      setEditingId('');
      // 刷新列表
      const formValues = form.getFieldsValue() as FieldType;
      fetchData({
        ...pickKeyProjectListFilters(formValues),
        page: pagination.current,
        size: pagination.pageSize,
        status: listDraftBoxMode,
      });
    } catch (error: any) {
      console.error('更新项目失败:', error);
      message.error(error?.message || '更新项目失败');
    } finally {
      setEditFormLoading(false);
    }
  };

  const onAddFinishFailed: FormProps<AddFormType>['onFinishFailed'] = (errorInfo) => {
    console.log('新增表单验证失败:', errorInfo);
  };

  useEffect(() => {
    getDistrictOptions();
    getIndustryCategoryOptions();
    getIndustrySubCategoryOptions();
    fetchData({
      ...pickKeyProjectListFilters({}),
      page: 1,
      size: pagination.pageSize,
      status: initialDraftFromUrl,
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content="欢迎使用重点项目模块"
      >
        <div style={{ padding: '10px', backgroundColor: 'white' }}>
          <div
            style={{
              padding: '20px',
              backgroundImage: 'url(/pm-bg1.png)',
              backgroundSize: '100% 100%',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              ></div>
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>查询</div>
            </div>
            <Form
              form={form}
              layout={'horizontal'}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item<FieldType> label="项目名称" name="projectName">
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="发改项目名称" name="projectFgName">
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="项目内容" name="projectContent">
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="项目来源" name="projectSource">
                    <Select
                      allowClear
                      placeholder="全部"
                      options={[
                        { value: '数字化招商', label: '数字化招商' },
                        { value: '增资扩产', label: '增资扩产' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item<FieldType> label="项目类别" name="investmentType">
                    <Select
                      allowClear
                      placeholder="全部"
                      options={[
                        { value: '内资', label: '内资' },
                        { value: '外资', label: '外资' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="所属产业" name="industryService">
                    <Select
                      allowClear
                      placeholder="全部"
                      options={[
                        { value: '工业', label: '工业' },
                        { value: '服务业', label: '服务业' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="所属市（区）" name="district">
                    <Select
                      allowClear
                      options={districtOptions}
                      placeholder="全部"
                      showSearch
                      optionFilterProp="label"
                      onChange={(val) => updateSearchParkOptionsByDistrict(val)}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="所属板块" name="park">
                    <Select
                      allowClear
                      options={listParkSearchOptions}
                      placeholder={
                        searchDistrictWatch ? '请选择所属板块' : '请先选择所属市（区）'
                      }
                      showSearch
                      optionFilterProp="label"
                      disabled={!searchDistrictWatch}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ display: showMoreSearch ? 'block' : 'none' }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item<FieldType> label="投资方名称" name="investor">
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="是否新开工" name="isNewStart">
                      <Select
                        allowClear
                        placeholder="全部"
                        options={[
                          { value: true, label: '是' },
                          { value: false, label: '否' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="是否开工" name="isStart">
                      <Select
                        allowClear
                        placeholder="全部"
                        options={[
                          { value: true, label: '是' },
                          { value: false, label: '否' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="是否列统项目" name="isStatistics">
                      <Select
                        allowClear
                        placeholder="全部"
                        options={[
                          { value: true, label: '是' },
                          { value: false, label: '否' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                      {/* <Button type="primary" onClick={handleImport}>
                        导入
                      </Button> */}
                      {canKeyProjectPush && !listDraftBoxMode ? (
                        <Button type="primary" onClick={handleBatchPush}>
                          推送
                        </Button>
                      ) : null}
                      <Button
                        type="primary"
                        htmlType="button"
                        loading={exporting}
                        onClick={handleExport}
                      >
                        导出
                      </Button>
                      {/* <Button type="primary" onClick={handleAdd}>
                        新增
                      </Button> */}
                      {SHOW_DRAFT_UI && (
                        <Button
                          type={listDraftBoxMode ? 'primary' : 'default'}
                          htmlType="button"
                          onClick={() => {
                            const next = !listDraftBoxMode;
                            setListDraftBoxMode(next);
                            syncDraftStatusUrl(next);
                            setPagination((p) => ({ ...p, current: 1 }));
                            const fv = form.getFieldsValue() as FieldType;
                            fetchData({
                              ...pickKeyProjectListFilters(fv),
                              page: 1,
                              size: pagination.pageSize,
                              status: next,
                            });
                          }}
                        >
                          草稿箱
                        </Button>
                      )}
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button
                        htmlType="button"
                        onClick={() => setShowMoreSearchPersist((p) => !p)}
                      >
                        {showMoreSearch ? '收起查询' : '更多查询'}
                      </Button>
                      <Button htmlType="button" onClick={handleReset}>
                        重置
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <Table
            style={{ marginTop: 20 }}
            columns={columns}
            rowKey={(record) => record.id || record.projectName || ''}
            scroll={{ x: 1000 }}
            bordered={true}
            dataSource={dataSource}
            loading={loading}
            pagination={false}
            rowSelection={rowSelection}
          />
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            showSizeChanger
            showQuickJumper
            onChange={handleTableChange}
            onShowSizeChange={handleTableChange}
            style={{ marginTop: '16px', textAlign: 'right' }}
          />
        </div>
      </PageContainer>

      {/* 新增项目弹框 */}
      <Modal
        title="新增重点项目"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <div
          style={{
            maxHeight: '70vh',
            overflowY: 'auto',
            padding: '20px 0',
          }}
          className="hide-scrollbar"
        >
          <Form
            form={addForm}
            layout="vertical"
            onFinish={onAddFinish}
            onFinishFailed={onAddFinishFailed}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>基本信息</div>
            </div>
            {/* 1. 项目ID（在线平台项目代码），与招商平台形成关联 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="项目ID（在线平台项目代码）"
                  name="onlinePlatformProjectCode"
                >
                  <Input placeholder="填写，与招商平台形成关联" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="项目名称"
                  name="projectName"
                  rules={[{ required: true, message: '请输入项目名称' }]}
                >
                  <Input placeholder="填写" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType> label="统计代码" name="inInvestCode">
                  <Input placeholder="填写（非必填）" />
                </Form.Item>
              </Col>
            </Row>
            {/* 区县、园区、建设地点 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="所属区县"
                  name="district"
                  rules={[{ required: true, message: '请选择所属区县' }]}
                >
                  <Select
                    options={districtOptions.filter((item) => item.value !== '')}
                    placeholder="请选择所属区县"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={handleDistrictChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType> label="所属园区" name="park">
                  <Select
                    options={parkOptions}
                    placeholder="请先选择所属区县"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    disabled={parkOptions.length === 0}
                    onChange={(v) => addForm.setFieldValue('constructionLocation', v)}
                  />
                </Form.Item>
              </Col>
              {/* <Col span={8}>
              <Form.Item<AddFormType>
                label="建设地点"
                name="constructionLocation"
                rules={[{ required: true, message: '请选择建设地点' }]}
              >
                <Select
                  options={parkOptions}
                  placeholder="请选择重点园区/乡镇街道"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  disabled={parkOptions.length === 0}
                  onChange={(v) => addForm.setFieldValue('park', v)}
                />
              </Form.Item>
            </Col> */}
            </Row>
            {/* 3. 产业类别：勾选工业、服务业，工业项目选8+13+X */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType> label="产业类别" name="industryCategoryDisplay">
                  <Select placeholder="请选择工业或服务业" allowClear>
                    <Select.Option value="工业">工业</Select.Option>
                    <Select.Option value="服务业">服务业</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) =>
                    prev.industryCategoryDisplay !== curr.industryCategoryDisplay
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue('industryCategoryDisplay') === '工业' ? (
                      <Form.Item<AddFormType> label="8+13+X" name="x">
                        <Select
                          placeholder="请选择"
                          allowClear
                          options={industrySubCategoryOptions}
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                        />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
              </Col>
            </Row>
            {/* 4. 计划总投资：点选类型（外资、内资）后，填写。内资为亿元，外资为万美元 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType> label="计划总投资" name="plannedInvestmentTypeDisplay">
                  <Select placeholder="请选择外资或内资" allowClear>
                    <Select.Option value="外资">外资</Select.Option>
                    <Select.Option value="内资">内资</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) =>
                    prev.plannedInvestmentTypeDisplay !== curr.plannedInvestmentTypeDisplay
                  }
                >
                  {({ getFieldValue }) => {
                    const type = getFieldValue('plannedInvestmentTypeDisplay');
                    const unit = type === '内资' ? '亿元' : type === '外资' ? '万美元' : '';
                    return (
                      <Form.Item<AddFormType>
                        label={`计划总投资金额${unit ? `（${unit}）` : ''}`}
                        name="plannedInvestmentAmountDisplay"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder={unit ? `填写（${unit}）` : '请先选择类型'}
                          min={0}
                          precision={2}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Col>
            </Row>
            {/* 5. 是否分期：点选（是、否），根据是否分期显示隐藏每期金额 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType> label="是否分期" name="isPhasedDisplay">
                  <Radio.Group>
                    <Radio value="是">是</Radio>
                    <Radio value="否">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) => prev.isPhasedDisplay !== curr.isPhasedDisplay}
                >
                  {({ getFieldValue }) =>
                    getFieldValue('isPhasedDisplay') === '是' ? (
                      <Form.Item<AddFormType> label="每期金额（万元）" name="amountPerPhaseDisplay">
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="填写每期金额"
                          min={0}
                          precision={2}
                        />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
              </Col>
            </Row>
            {/* 6. 建设内容及规模 */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<AddFormType>
                  label="建设内容及规模"
                  name="constructionContentAndScale"
                  rules={[{ required: true, message: '请输入建设内容及规模' }]}
                >
                  <Input.TextArea rows={3} placeholder="填写" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<AddFormType>
                  label="主要产品及产能"
                  name="mainProductsAndCapacity"
                  rules={[{ required: true, message: '请输入主要产品及产能' }]}
                >
                  <Input.TextArea rows={3} placeholder="请输入主要产品及产能" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) =>
                prev.industryCategoryDisplay !== curr.industryCategoryDisplay
              }
            >
              {({ getFieldValue }) => {
                const cat = getFieldValue('industryCategoryDisplay');
                if (cat === '工业') {
                  return (
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item<AddFormType> label="预期产值（万元）" name="expectedOutputValue">
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="填写"
                            min={0}
                            precision={2}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item<AddFormType> label="用工（人）" name="expectedEmployment">
                          <InputNumber style={{ width: '100%' }} placeholder="填写" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item<AddFormType> label="亩均税收（万元）" name="taxPerMuDisplay">
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="填写"
                            min={0}
                            precision={2}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }
                if (cat === '服务业') {
                  return (
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item<AddFormType>
                          label="预期开票（万元）"
                          name="expectedInvoiceAmount"
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="填写"
                            min={0}
                            precision={2}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item<AddFormType> label="用工（人）" name="expectedEmployment">
                          <InputNumber style={{ width: '100%' }} placeholder="填写" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item<AddFormType> label="亩均税收（万元）" name="taxPerMuDisplay">
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="填写"
                            min={0}
                            precision={2}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }
                return null;
              }}
            </Form.Item>
            {/* 8. 建设起止年限：选择预计开工、竣工时间 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="建设起止年限"
                  name="constructionPeriod"
                  rules={[{ required: true, message: '请选择建设起止年限' }]}
                >
                  <DatePicker.RangePicker
                    picker="year"
                    style={{ width: '100%' }}
                    placeholder={['预计开工', '竣工时间']}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* 9. 预期效益：根据产业类别，工业填写预期产值/用工/亩均税收，服务业填写预期开票/用工/亩均税收 - 见上方条件块 */}
            {/* 11. 年度计划投资：根据计划总投资类型填写 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType> label="年度计划投资（万元）" name="annualPlannedInvestment">
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="根据计划总投资类型（外资/内资）填写"
                    min={0}
                    precision={2}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="年度形象进度"
                  name="annualImageProgress"
                  rules={[{ required: true, message: '请输入年度形象进度' }]}
                >
                  <Input placeholder="填写" />
                </Form.Item>
              </Col>
            </Row>
            {/* 13. 项目类型 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType> label="项目类型" name="projectTypeDisplay">
                  <Select placeholder="请选择" allowClear>
                    <Select.Option value="增资扩产">增资扩产</Select.Option>
                    <Select.Option value="外资利润再投资">外资利润再投资</Select.Option>
                    <Select.Option value="新招引项目">新招引项目</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {/* 第二模块：投资主体 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>投资主体</div>
            </div>
            {/* 1. 投资主体名称 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="投资主体名称"
                  name="investorName"
                  rules={[{ required: true, message: '请输入投资主体名称' }]}
                >
                  <Input placeholder="填写" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="统一信用代码"
                  name="unifiedSocialCreditCode"
                  rules={[{ required: true, message: '请输入统一信用代码' }]}
                >
                  <Input placeholder="填写" />
                </Form.Item>
              </Col>
            </Row>
            {/* 3. 投资主体性质：勾选（可多选） */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<AddFormType> label="投资主体性质" name="investorNature">
                  <Checkbox.Group>
                    <Row gutter={[16, 8]}>
                      <Col span={8}>
                        <Checkbox value="上市公司">上市公司</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="民营企业">民营企业</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="央企">央企</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="世界500强">世界500强</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="民营500强">民营500强</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="高新技术企业">高新技术企业</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="专精特新企业">专精特新企业</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>
            {/* 4. 投资主体简介 */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<AddFormType>
                  label="投资主体简介"
                  name="investorIntroduction"
                  rules={[{ required: true, message: '请输入投资主体简介' }]}
                >
                  <Input.TextArea rows={2} placeholder="填写" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              {/*<Col span={12}>*/}
              {/*  <Form.Item<AddFormType> label="分期情况" name="phasedStatus">*/}
              {/*    <Input placeholder="请输入分期情况" />*/}
              {/*  </Form.Item>*/}
              {/*</Col>*/}
              <Col span={12}>
                <Form.Item<AddFormType> label="行业代码" name="industryCode">
                  <Input placeholder="请输入行业代码" />
                </Form.Item>
              </Col>
            </Row>
            {/*<Row gutter={16}>*/}
            {/*  <Col span={12}>*/}
            {/*    <Form.Item<AddFormType>*/}
            {/*      label="预计开工时间"*/}
            {/*      name="estimatedStartDate"*/}
            {/*      rules={[{ required: true, message: '请选择预计开工时间' }]}*/}
            {/*    >*/}
            {/*      <DatePicker style={{ width: '100%' }} placeholder="请选择预计开工时间" />*/}
            {/*    </Form.Item>*/}
            {/*  </Col>*/}
            {/*  <Col span={12}>*/}
            {/*    <Form.Item<AddFormType> label="（预计）开工时间" name="actualOrEstimatedStartDate">*/}
            {/*      <DatePicker style={{ width: '100%' }} placeholder="请选择（预计）开工时间" />*/}
            {/*    </Form.Item>*/}
            {/*  </Col>*/}
            {/*</Row>*/}
            {/*<Row gutter={16}>*/}
            {/*  <Col span={12}>*/}
            {/*    <Form.Item<AddFormType> label="（预计）首次达产时间" name="firstFullProductionDate">*/}
            {/*      <DatePicker style={{ width: '100%' }} placeholder="请选择（预计）首次达产时间" />*/}
            {/*    </Form.Item>*/}
            {/*  </Col>*/}
            {/*  <Col span={12}>*/}
            {/*    <Form.Item<AddFormType>*/}
            {/*      label="项目所在开发园区、乡镇/街道"*/}
            {/*      name="projectLocationAdmin"*/}
            {/*    >*/}
            {/*      <Input placeholder="请输入项目所在开发园区、乡镇/街道" />*/}
            {/*    </Form.Item>*/}
            {/*  </Col>*/}
            {/*</Row>*/}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>投资主体科技创新情况</div>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="研发平台"
                  name="rdPlatformLevel"
                  rules={[{ required: true, message: '请选择研发平台' }]}
                >
                  <Select placeholder="请选择" allowClear>
                    <Select.Option value="无">无</Select.Option>
                    <Select.Option value="市级">市级</Select.Option>
                    <Select.Option value="省级">省级</Select.Option>
                    <Select.Option value="国家级">国家级</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="近三年平均研发投入占比（%）"
                  name="avgRdIntensityLast3years"
                  rules={[{ required: true, message: '请填写近三年平均研发投入占比' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="填写"
                    min={0}
                    max={100}
                    precision={2}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="发明专利（件）"
                  name="inventionPatentCountDisplay"
                  rules={[{ required: true, message: '请填写发明专利数量' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="填写" min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="实用新型或外观专利（件）"
                  name="utilityPatentCountDisplay"
                  rules={[{ required: true, message: '请填写实用新型或外观专利数量' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="填写" min={0} />
                </Form.Item>
              </Col>
            </Row>
            {/* 三、项目用地 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>项目用地</div>
            </div>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<AddFormType> label="用地类型" name="landTypeDisplay">
                  <Radio.Group>
                    <Radio value="新增用地">新增用地</Radio>
                    <Radio value="存量厂房">存量厂房</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) => prev.landTypeDisplay !== curr.landTypeDisplay}
            >
              {({ getFieldValue }) => {
                const landType = getFieldValue('landTypeDisplay');
                const hasNew = landType === '新增用地';
                const hasStock = landType === '存量厂房';
                return (
                  <>
                    {hasNew && (
                      <>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item<AddFormType> label="用地面积（亩）" name="newLandArea">
                              <InputNumber
                                style={{ width: '100%' }}
                                placeholder="填写"
                                min={0}
                                precision={2}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item<AddFormType>
                              label="土地情况-基本农田"
                              name="involvesBasicFarmland"
                              valuePropName="checked"
                            >
                              <Switch checkedChildren="涉及" unCheckedChildren="不涉及" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item<AddFormType>
                              label="土地情况-生态红线"
                              name="withinEcologicalRedline"
                              valuePropName="checked"
                            >
                              <Switch checkedChildren="涉及" unCheckedChildren="不涉及" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item<AddFormType>
                              label="用地手续办理情况"
                              name="landProcedureStatus"
                            >
                              <Select placeholder="根据土地供应阶段选择" allowClear>
                                <Select.Option value="已完成供地">已完成供地</Select.Option>
                                <Select.Option value="已挂牌">已挂牌</Select.Option>
                                <Select.Option value="推进农转用征收">推进农转用征收</Select.Option>
                                <Select.Option value="编制成片开发方案">
                                  编制成片开发方案
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                    {hasStock && (
                      <>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item<AddFormType>
                              label="使用面积（平方米）"
                              name="existingAreaUsageDisplay"
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                placeholder="填写"
                                min={0}
                                precision={2}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item<AddFormType>
                              label="用地手续办理情况"
                              name="landProcedureStatusStockDisplay"
                            >
                              <Select placeholder="根据存量厂房情况选择" allowClear>
                                <Select.Option value="已签约">已签约</Select.Option>
                                <Select.Option value="正在推进">正在推进</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                  </>
                );
              }}
            </Form.Item>
            {/* 四、资源环境 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>资源环境</div>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label='是否为"两高"项目'
                  name="isHighPollutionHighEnergy"
                >
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="是否完成节能审查"
                  name="energyReviewCompletedDisplay"
                >
                  <Radio.Group>
                    <Radio value="是">是</Radio>
                    <Radio value="否">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) =>
                prev.energyReviewCompletedDisplay !== curr.energyReviewCompletedDisplay
              }
            >
              {({ getFieldValue }) =>
                getFieldValue('energyReviewCompletedDisplay') === '是' ? (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item<AddFormType> label="节能审查佐证资料" name="energyReviewOpinion" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload {...evidenceUploadProps}>
                          <Button icon={<UploadOutlined />}>点击上传</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                ) : null
              }
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="是否完成环评"
                  name="eiaCompletedDisplay"
                  rules={[{ required: true, message: '请选择是否完成环评' }]}
                >
                  <Radio.Group>
                    <Radio value="是">是</Radio>
                    <Radio value="否">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) => prev.eiaCompletedDisplay !== curr.eiaCompletedDisplay}
            >
              {({ getFieldValue }) => {
                const eia = getFieldValue('eiaCompletedDisplay');
                if (eia === '是') {
                  return (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item<AddFormType> label="环评佐证资料" name="eiaApprovalStatus" valuePropName="fileList" getValueFromEvent={normFile}>
                          <Upload {...evidenceUploadProps}>
                            <Button icon={<UploadOutlined />}>点击上传</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }
                if (eia === '否') {
                  return (
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item<AddFormType>
                          label="项目环境影响情况"
                          name="environmentalImpactDescription"
                        >
                          <Input.TextArea rows={2} placeholder="简要填写" />
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }
                return null;
              }}
            </Form.Item>
            {/* 五、投资主体科技创新情况 */}

            {/* 六、审批情况 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>审批情况</div>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="是否备案"
                  name="isFilingDisplay"
                  rules={[{ required: true, message: '请选择是否备案' }]}
                >
                  <Radio.Group>
                    <Radio value="是">是</Radio>
                    <Radio value="否">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="是否取得安评批复"
                  name="hasSafetyApprovalDisplay"
                  rules={[{ required: true, message: '请选择是否取得安评批复' }]}
                >
                  <Radio.Group>
                    <Radio value="是">是</Radio>
                    <Radio value="否">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) =>
                prev.isFilingDisplay !== curr.isFilingDisplay ||
                prev.hasSafetyApprovalDisplay !== curr.hasSafetyApprovalDisplay
              }
            >
              {({ getFieldValue }) => {
                const showFiling = getFieldValue('isFilingDisplay') === '是';
                const showSafety = getFieldValue('hasSafetyApprovalDisplay') === '是';
                if (!showFiling && !showSafety) return null;
                return (
                  <Row gutter={16}>
                    {showFiling && (
                      <Col span={12}>
                        <Form.Item<AddFormType> label="备案佐证资料" name="filingDocUrlDisplay" valuePropName="fileList" getValueFromEvent={normFile}>
                          <Upload {...evidenceUploadProps}>
                            <Button icon={<UploadOutlined />}>点击上传</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    )}
                    {showSafety && (
                      <Col span={12}>
                        <Form.Item<AddFormType> label="安评佐证资料" name="safetyEvaluationApproval" valuePropName="fileList" getValueFromEvent={normFile}>
                          <Upload {...evidenceUploadProps}>
                            <Button icon={<UploadOutlined />}>点击上传</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                );
              }}
            </Form.Item>
            {/* 七、项目特色亮点 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>项目特色亮点</div>
            </div>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<AddFormType> label="项目特色亮点" name="projectHighlights">
                  <Input.TextArea rows={3} placeholder="根据项目情况，自主填写相关内容" />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ display: 'none' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item<AddFormType>
                    label="相关佐证资料上传"
                    name="supportingDocumentsUrl"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                  >
                    <Upload {...evidenceUploadProps}>
                      <Button icon={<UploadOutlined />}>点击上传</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<AddFormType>
                    label="从开工到2025年底预计完成投资（万元）"
                    name="investmentCompletedByEnd2025"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="请输入从开工到2025年底预计完成投资"
                      min={0}
                      precision={2}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item<AddFormType>
                    label="2026年计划投资（万元）"
                    name="plannedInvestment2026"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="请输入2026年计划投资"
                      min={0}
                      precision={2}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<AddFormType>
                    label="截至2025年底建设进度或前期工作进展情况"
                    name="progressByEnd2025"
                  >
                    <Input placeholder="请输入截至2025年底建设进度或前期工作进展情况" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item<AddFormType>
                    label="2026年建设进度考核目标"
                    name="constructionTarget2026"
                  >
                    <Input.TextArea rows={2} placeholder="请输入2026年建设进度考核目标" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item<AddFormType> label="备注" name="remarks">
                    <Input placeholder="请输入备注" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: '20px' }}>
              <Space>
                <Button onClick={handleCancel}>取消</Button>
                <Button type="primary" htmlType="submit" loading={addFormLoading}>
                  确定
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* 编辑项目弹框 */}
      <Modal
        title="编辑重点项目"
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <div
          style={{
            maxHeight: '70vh',
            overflowY: 'auto',
            padding: '20px 0',
          }}
        >
          <Form
            form={addForm}
            layout="vertical"
            onFinish={onEditFinish}
            onFinishFailed={onAddFinishFailed}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>基本信息</div>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType> label="发改项目名称" name="fgName">
                  <Input placeholder="填写" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType> label="项目来源" name="projectSource">
                  <Input disabled placeholder="自动填写" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="项目代码"
                  name="onlinePlatformProjectCode"
                  rules={[{ required: true, message: '请填写项目代码' }]}
                >
                  <Input disabled placeholder="填写，与招商平台形成关联" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="项目名称"
                  name="projectName"
                  rules={[{ required: true, message: '请输入项目名称' }]}
                >
                  <Input disabled placeholder="填写" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType> label="统计代码" name="inInvestCode">
                  <Input placeholder="填写统计代码" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="所属区县"
                  name="district"
                  rules={[{ required: true, message: '请选择所属区县' }]}
                >
                  <Select
                    disabled
                    options={districtOptions.filter((item) => item.value !== '')}
                    placeholder="请选择所属区县"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={handleDistrictChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="所属园区"
                  name="park"
                  rules={[{ required: true, message: '请选择所属园区' }]}
                >
                  <Select
                    disabled
                    options={parkOptions}
                    placeholder="请先选择所属区县"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(v) => addForm.setFieldValue('constructionLocation', v)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="产业类别"
                  name="industryCategoryDisplay"
                  rules={[{ required: true, message: '请选择产业类别' }]}
                >
                  <Select disabled placeholder="请选择工业或服务业">
                    <Select.Option value="工业">工业</Select.Option>
                    <Select.Option value="服务业">服务业</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) =>
                    prev.industryCategoryDisplay !== curr.industryCategoryDisplay
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue('industryCategoryDisplay') === '工业' ? (
                      <Form.Item<AddFormType>
                        label="8+13+X"
                        name="x"
                        rules={[{ required: true, message: '请选择8+13+X' }]}
                      >
                        <TreeSelect
                          style={{ width: '100%' }}
                          placeholder="请选择"
                          allowClear
                          treeData={industrySubCategoryTreeData}
                          showSearch
                          treeDefaultExpandAll
                          filterTreeNode={(input, node) =>
                            String(node.title ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                        />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
              </Col>
            </Row>
            {/* 与申报表一致：行业代码放在「投资主体简介」之后 */}
            {/* 4. 计划总投资（与申报表一致：内资万元 / 外资万美元） */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="计划总投资"
                  name="plannedInvestmentTypeDisplay"
                  rules={[{ required: true, message: '请选择投资类型' }]}
                >
                  <Select placeholder="请选择外资或内资" allowClear>
                    <Select.Option value="外资">外资</Select.Option>
                    <Select.Option value="内资">内资</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) =>
                    prev.plannedInvestmentTypeDisplay !== curr.plannedInvestmentTypeDisplay
                  }
                >
                  {({ getFieldValue }) => {
                    const type = getFieldValue('plannedInvestmentTypeDisplay');
                    const unit = type === '内资' ? '万元' : type === '外资' ? '万美元' : '';
                    return (
                      <Form.Item<AddFormType>
                        label={`计划总投资金额${unit ? `（${unit}）` : ''}`}
                        name="plannedInvestmentAmountDisplay"
                        rules={[
                          {
                            required: true,
                            message: unit ? `请填写计划总投资金额（${unit}）` : '请先选择投资类型',
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder={unit ? `填写（${unit}）` : '请先选择类型'}
                          min={0}
                          precision={2}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Col>
            </Row>
            {/* 5. 是否分期 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="是否分期"
                  name="isPhasedDisplay"
                  rules={[{ required: true, message: '请选择是否分期' }]}
                >
                  <Radio.Group>
                    <Radio value="是">是</Radio>
                    <Radio value="否">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) => prev.isPhasedDisplay !== curr.isPhasedDisplay}
                >
                  {({ getFieldValue }) =>
                    getFieldValue('isPhasedDisplay') === '是' ? (
                      <Form.Item<AddFormType>
                        label="本期金额（万元）"
                        name="amountPerPhaseDisplay"
                        rules={[{ required: true, message: '请填写本期金额' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="填写本期金额"
                          min={0}
                          precision={2}
                        />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<AddFormType>
                  label="建设内容及规模"
                  name="constructionContentAndScale"
                  rules={[{ required: true, message: '请输入建设内容及规模' }]}
                >
                  <Input.TextArea rows={3} placeholder="填写" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<AddFormType>
                  label="主要产品及产能"
                  name="mainProductsAndCapacity"
                  rules={[{ required: true, message: '请输入主要产品及产能' }]}
                >
                  <Input.TextArea rows={3} placeholder="请输入主要产品及产能" />
                </Form.Item>
              </Col>
            </Row>
            {/*
              【原编辑弹窗扩展】建设起止年拆分 DatePicker（constructionStartDateDisplay / constructionEndDateDisplay）
              申报表仅使用 constructionPeriod（年 RangePicker），数据仍由 handleEdit 回显到 constructionPeriod
            */}
            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) =>
                prev.industryCategoryDisplay !== curr.industryCategoryDisplay
              }
            >
              {({ getFieldValue }) => {
                const cat = getFieldValue('industryCategoryDisplay');
                if (cat === '工业') {
                  return (
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item<AddFormType>
                          label="预期产值（万元）"
                          name="expectedOutputValue"
                          rules={[{ required: true, message: '请填写预期产值' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="填写"
                            min={0}
                            precision={2}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item<AddFormType>
                          label="用工（人）"
                          name="expectedEmployment"
                          rules={[{ required: true, message: '请填写用工' }]}
                        >
                          <InputNumber style={{ width: '100%' }} placeholder="填写" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item<AddFormType>
                          label="亩均税收（万元）"
                          name="taxPerMuDisplay"
                          rules={[{ required: true, message: '请填写亩均税收' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="填写"
                            min={0}
                            precision={2}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }
                if (cat === '服务业') {
                  return (
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item<AddFormType>
                          label="预期开票（万元）"
                          name="expectedInvoiceAmount"
                          rules={[{ required: true, message: '请填写预期开票' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="填写"
                            min={0}
                            precision={2}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item<AddFormType>
                          label="用工（人）"
                          name="expectedEmployment"
                          rules={[{ required: true, message: '请填写用工' }]}
                        >
                          <InputNumber style={{ width: '100%' }} placeholder="填写" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item<AddFormType>
                          label="亩均税收（万元）"
                          name="taxPerMuDisplay"
                          rules={[{ required: true, message: '请填写亩均税收' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder="填写"
                            min={0}
                            precision={2}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }
                return null;
              }}
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="建设起止年限"
                  name="constructionPeriod"
                  rules={[{ required: true, message: '请选择建设起止年限' }]}
                >
                  <DatePicker.RangePicker
                    picker="year"
                    style={{ width: '100%' }}
                    placeholder={['预计开工', '竣工时间']}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="年度计划投资（万元）"
                  name="annualPlannedInvestment"
                  rules={[{ required: true, message: '请填写年度计划投资' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="根据计划总投资类型（外资/内资）填写"
                    min={0}
                    precision={2}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="年度形象进度"
                  name="annualImageProgress"
                  rules={[{ required: true, message: '请输入年度形象进度' }]}
                >
                  <Input placeholder="填写" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="项目类型"
                  name="projectTypeDisplay"
                  rules={[{ required: true, message: '请选择项目类型' }]}
                >
                  <Select placeholder="请选择" allowClear>
                    <Select.Option value="增资扩产">增资扩产</Select.Option>
                    <Select.Option value="外资利润再投资">外资利润再投资</Select.Option>
                    <Select.Option value="新招引项目">新招引项目</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {/*
              【原编辑弹窗扩展字段，重点项目申报表无对应展示】仍通过 handleEdit / buildProjectKeyProjectDto 回显与提交：
              plannedTotalInvestmentDomestic、plannedTotalInvestmentForeign、expectedTaxRevenue、responsibleUnit
            */}
            {/* 第二模块：投资主体 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>投资主体</div>
            </div>
            {/* 1. 投资主体名称 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="投资主体名称"
                  name="investorName"
                  rules={[{ required: true, message: '请输入投资主体名称' }]}
                >
                  <Input placeholder="填写" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="统一信用代码"
                  name="unifiedSocialCreditCode"
                  rules={[{ required: true, message: '请输入统一信用代码' }]}
                >
                  <Input placeholder="填写" />
                </Form.Item>
              </Col>
            </Row>
            {/* 3. 投资主体性质：勾选（可多选） */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<AddFormType>
                  label="投资主体性质"
                  name="investorNature"
                  rules={[{ required: true, message: '请选择投资主体性质' }]}
                >
                  <Checkbox.Group>
                    <Row gutter={[16, 8]}>
                      <Col span={8}>
                        <Checkbox value="上市公司">上市公司</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="民营企业">民营企业</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="央企">央企</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="世界500强">世界500强</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="民营500强">民营500强</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="高新技术企业">高新技术企业</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="专精特新企业">专精特新企业</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>
            {/* 4. 投资主体简介 */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<AddFormType>
                  label="投资主体简介"
                  name="investorIntroduction"
                  rules={[{ required: true, message: '请输入投资主体简介' }]}
                >
                  <Input.TextArea rows={2} placeholder="填写" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  name="industryCode"
                  label="行业代码"
                  rules={[{ required: true, message: '请选择行业代码' }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="请选择行业代码"
                    options={industryCategoryOptions}
                    showSearch
                    optionFilterProp="label"
                  />
                </Form.Item>
              </Col>
            </Row>
            {/*
              【原编辑弹窗扩展字段，申报表主表单无对应展示】回显与提交仍由 handleEdit / buildProjectKeyProjectDto 处理：
              phasedStatus、estimatedStartDate、actualOrEstimatedStartDate、firstFullProductionDate、projectLocationAdmin
            */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>投资主体科技创新情况</div>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="研发平台"
                  name="rdPlatformLevel"
                  rules={[{ required: true, message: '请选择研发平台' }]}
                >
                  <Select placeholder="请选择" allowClear>
                    <Select.Option value="无">无</Select.Option>
                    <Select.Option value="市级">市级</Select.Option>
                    <Select.Option value="省级">省级</Select.Option>
                    <Select.Option value="国家级">国家级</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="近三年平均研发投入占比（%）"
                  name="avgRdIntensityLast3years"
                  rules={[{ required: true, message: '请填写近三年平均研发投入占比' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="填写"
                    min={0}
                    max={100}
                    precision={2}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="发明专利（件）"
                  name="inventionPatentCountDisplay"
                  rules={[{ required: true, message: '请填写发明专利数量' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="填写" min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="实用新型或外观专利（件）"
                  name="utilityPatentCountDisplay"
                  rules={[{ required: true, message: '请填写实用新型或外观专利数量' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="填写" min={0} />
                </Form.Item>
              </Col>
            </Row>
            {/*
              【申报表主表单无「知识产权情况」输入项】intellectualPropertyInfo 仍由 handleEdit / buildProjectKeyProjectDto 回显与提交
            */}
            {/* 项目用地 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>项目用地</div>
            </div>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<AddFormType>
                  label="用地类型"
                  name="landTypeDisplay"
                  rules={[{ required: true, message: '请选择用地类型' }]}
                >
                  <Radio.Group>
                    <Radio value="新增用地">新增用地</Radio>
                    <Radio value="存量厂房">存量厂房</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) => prev.landTypeDisplay !== curr.landTypeDisplay}
            >
              {({ getFieldValue }) => {
                const landType = getFieldValue('landTypeDisplay');
                const hasNew = landType === '新增用地';
                const hasStock = landType === '存量厂房';
                return (
                  <>
                    {hasNew && (
                      <>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item<AddFormType>
                              label="用地面积（亩）"
                              name="newLandArea"
                              rules={[{ required: true, message: '请填写用地面积' }]}
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                placeholder="填写"
                                min={0}
                                precision={2}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item<AddFormType>
                              label="土地情况-基本农田"
                              name="involvesBasicFarmland"
                              valuePropName="checked"
                            >
                              <Switch checkedChildren="涉及" unCheckedChildren="不涉及" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item<AddFormType>
                              label="土地情况-生态红线"
                              name="withinEcologicalRedline"
                              valuePropName="checked"
                            >
                              <Switch checkedChildren="涉及" unCheckedChildren="不涉及" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item<AddFormType>
                              label="用地手续办理情况"
                              name="landProcedureStatus"
                              rules={[{ required: true, message: '请选择用地手续办理情况' }]}
                            >
                              <Select placeholder="根据土地供应阶段选择" allowClear>
                                <Select.Option value="已完成供地">已完成供地</Select.Option>
                                <Select.Option value="已挂牌">已挂牌</Select.Option>
                                <Select.Option value="推进农转用征收">推进农转用征收</Select.Option>
                                <Select.Option value="编制成片开发方案">
                                  编制成片开发方案
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                    {hasStock && (
                      <>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item<AddFormType>
                              label="使用面积（平方米）"
                              name="existingAreaUsageDisplay"
                              rules={[{ required: true, message: '请填写使用面积' }]}
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                placeholder="填写"
                                min={0}
                                precision={2}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item<AddFormType>
                              label="用地手续办理情况"
                              name="landProcedureStatusStockDisplay"
                              rules={[{ required: true, message: '请选择用地手续办理情况' }]}
                            >
                              <Select placeholder="根据存量厂房情况选择" allowClear>
                                <Select.Option value="已签约">已签约</Select.Option>
                                <Select.Option value="正在推进">正在推进</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                  </>
                );
              }}
            </Form.Item>
            {/* 四、资源环境 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>资源环境</div>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label='是否为"两高"项目'
                  name="isHighPollutionHighEnergy"
                  rules={[{ required: true, message: '请选择是否为两高项目' }]}
                >
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="是否完成节能审查"
                  name="energyReviewCompletedDisplay"
                  rules={[{ required: true, message: '请选择是否完成节能审查' }]}
                >
                  <Radio.Group>
                    <Radio value="是">是</Radio>
                    <Radio value="否">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) =>
                prev.energyReviewCompletedDisplay !== curr.energyReviewCompletedDisplay
              }
            >
              {({ getFieldValue }) =>
                getFieldValue('energyReviewCompletedDisplay') === '是' ? (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item<AddFormType> label="节能审查佐证资料" name="energyReviewOpinion" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload {...evidenceUploadProps}>
                          <Button icon={<UploadOutlined />}>点击上传</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                ) : null
              }
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="是否完成环评"
                  name="eiaCompletedDisplay"
                  rules={[{ required: true, message: '请选择是否完成环评' }]}
                >
                  <Radio.Group>
                    <Radio value="是">是</Radio>
                    <Radio value="否">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) => prev.eiaCompletedDisplay !== curr.eiaCompletedDisplay}
            >
              {({ getFieldValue }) => {
                const eia = getFieldValue('eiaCompletedDisplay');
                if (eia === '是') {
                  return (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item<AddFormType> label="环评佐证资料" name="eiaApprovalStatus" valuePropName="fileList" getValueFromEvent={normFile}>
                          <Upload {...evidenceUploadProps}>
                            <Button icon={<UploadOutlined />}>点击上传</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }
                if (eia === '否') {
                  return (
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item<AddFormType>
                          label="项目环境影响情况"
                          name="environmentalImpactDescription"
                        >
                          <Input.TextArea rows={2} placeholder="简要填写" />
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }
                return null;
              }}
            </Form.Item>
            {/* 审批情况 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>审批情况</div>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="是否备案"
                  name="isFilingDisplay"
                  rules={[{ required: true, message: '请选择是否备案' }]}
                >
                  <Radio.Group>
                    <Radio value="是">是</Radio>
                    <Radio value="否">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<AddFormType>
                  label="是否取得安评批复"
                  name="hasSafetyApprovalDisplay"
                  rules={[{ required: true, message: '请选择是否取得安评批复' }]}
                >
                  <Radio.Group>
                    <Radio value="是">是</Radio>
                    <Radio value="否">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) =>
                prev.isFilingDisplay !== curr.isFilingDisplay ||
                prev.hasSafetyApprovalDisplay !== curr.hasSafetyApprovalDisplay
              }
            >
              {({ getFieldValue }) => {
                const showFiling = getFieldValue('isFilingDisplay') === '是';
                const showSafety = getFieldValue('hasSafetyApprovalDisplay') === '是';
                if (!showFiling && !showSafety) return null;
                return (
                  <Row gutter={16}>
                    {showFiling && (
                      <Col span={12}>
                        <Form.Item<AddFormType> label="备案佐证资料" name="filingDocUrlDisplay" valuePropName="fileList" getValueFromEvent={normFile}>
                          <Upload {...evidenceUploadProps}>
                            <Button icon={<UploadOutlined />}>点击上传</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    )}
                    {showSafety && (
                      <Col span={12}>
                        <Form.Item<AddFormType> label="安评佐证资料" name="safetyEvaluationApproval" valuePropName="fileList" getValueFromEvent={normFile}>
                          <Upload {...evidenceUploadProps}>
                            <Button icon={<UploadOutlined />}>点击上传</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                );
              }}
            </Form.Item>
            {/* 七、项目特色亮点 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  marginRight: '10px',
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>项目特色亮点</div>
            </div>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<AddFormType> label="项目特色亮点" name="projectHighlights">
                  <Input.TextArea rows={3} placeholder="根据项目情况，自主填写相关内容" />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ display: 'none' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item<AddFormType>
                    label="相关佐证资料上传"
                    name="supportingDocumentsUrl"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                  >
                    <Upload {...evidenceUploadProps}>
                      <Button icon={<UploadOutlined />}>点击上传</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<AddFormType>
                    label="从开工到2025年底预计完成投资（万元）"
                    name="investmentCompletedByEnd2025"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="请输入从开工到2025年底预计完成投资"
                      min={0}
                      precision={2}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item<AddFormType>
                    label="2026年计划投资（万元）"
                    name="plannedInvestment2026"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="请输入2026年计划投资"
                      min={0}
                      precision={2}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<AddFormType>
                    label="截至2025年底建设进度或前期工作进展情况"
                    name="progressByEnd2025"
                  >
                    <Input placeholder="请输入截至2025年底建设进度或前期工作进展情况" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item<AddFormType>
                    label="2026年建设进度考核目标"
                    name="constructionTarget2026"
                  >
                    <Input.TextArea rows={2} placeholder="请输入2026年建设进度考核目标" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item<AddFormType> label="备注" name="remarks">
                    <Input placeholder="请输入备注" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: '20px' }}>
              <Space>
                <Button onClick={handleEditCancel}>取消</Button>
                {listDraftBoxMode && (
                  <Button
                    loading={editDraftSaving}
                    disabled={editFormLoading}
                    onClick={() => void handleEditModalDraftSave()}
                  >
                    暂存草稿
                  </Button>
                )}
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={editFormLoading}
                  disabled={editDraftSaving}
                >
                  确定
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* 导入项目弹框 */}
      <Modal
        title="导入重点项目"
        open={isImportModalOpen}
        onCancel={handleImportCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
        <div style={{ padding: '20px 0' }}>
          <Row gutter={16} style={{ marginBottom: '20px' }}>
            <Col span={24}>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadTemplate}
                style={{ width: '100%' }}
              >
                下载模板
              </Button>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Upload.Dragger {...importUploadProps} disabled={importLoading}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">支持单个文件上传，仅支持 .xlsx 或 .xls 格式</p>
              </Upload.Dragger>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* 推送弹框 */}
      <Modal
        title="推送"
        open={isPushModalOpen}
        onCancel={handlePushCancel}
        footer={[
          <Button key="cancel" onClick={handlePushCancel}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={handlePushConfirm} loading={pushLoading}>
            确定
          </Button>,
        ]}
        width={500}
        destroyOnClose
      >
        <div style={{ padding: '20px 0' }}>
          <Checkbox.Group
            value={selectedReviewers}
            onChange={(values) => setSelectedReviewers(values as string[])}
            style={{ width: '100%' }}
          >
            <Row gutter={[16, 16]}>
              {pushDeptOptions.map((option) => (
                <Col span={8} key={option.value}>
                  <Checkbox value={option.value}>{option.label}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
      </Modal>
    </div>
  );
};

export default KeyProject;
export { default as KeyProjectApplyModal } from './KeyProjectApplyModal';
