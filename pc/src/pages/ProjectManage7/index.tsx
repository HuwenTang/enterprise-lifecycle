/* eslint-disable no-use-before-define, @typescript-eslint/no-use-before-define, @typescript-eslint/no-unused-vars */
import {primeApi, systemApi} from '@/services/api';
import {
  CascadeVoString,
  CreateProjectNonInvestmentConfirmationRequest,
  ExportProjectNonInvestmentConfirmationRequest,
  ListProjectNonInvestmentConfirmationRequest,
  ProjectNonInvestmentConfirmationDto,
  ProjectNonInvestmentConfirmationVo,
  ProjectOnlineApprovalVo,
  UpdateProjectNonInvestmentConfirmationRequest,
} from '@/services/apis';
import { UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate, useSearchParams, useAccess } from '@umijs/max';
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Pagination,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  TreeSelect,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePersistedMoreSearch } from '@/hooks/usePersistedMoreSearch';
import { handleApiError } from '@/utils/errorHandler';
import { dayjsToApiDatePreservingCalendarDay } from '@/utils/apiDate';
import ZzkcKeyProjectApplyModal from './ZzkcKeyProjectApplyModal';
import pmStyles from './pm.module.css';

/** 开工/竣工认定提交：从列表行（及详情合并数据）提取需一并提交的项目基础字段 */
const buildConfirmationBaseDtoFromRecord = (
  record?: Record<string, unknown> | null,
  fallbackId?: string,
): ProjectNonInvestmentConfirmationDto => {
  if (!record && !fallbackId) return {};
  const str = (v: unknown) => {
    if (v === null || v === undefined) return undefined;
    const t = String(v).trim();
    return t || undefined;
  };
  const num = (v: unknown) => {
    if (v === null || v === undefined || v === '') return undefined;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const date = (v: unknown) => {
    if (v === null || v === undefined || v === '') return undefined;
    const d = dayjs(v as string | Date);
    return d.isValid() ? dayjsToApiDatePreservingCalendarDay(d) : undefined;
  };

  const recordId = record ? str(record.id) : undefined;
  const id = recordId ?? (fallbackId?.trim() || undefined);

  return {
    id,
    projectName: record ? str(record.projectName) : undefined,
    park: record ? (str(record.park) ?? str(record.parkName)) : undefined,
    investor: record ? str(record.investor) : undefined,
    projectAddress: record ? str(record.projectAddress) : undefined,
    unifiedSocialCreditCode: record ? str(record.unifiedSocialCreditCode) : undefined,
    mainProducts: record ? str(record.mainProducts) : undefined,
    industryCode: record ? str(record.industryCode) : undefined,
    industryClassification: record ? str(record.industryClassification) : undefined,
    industryDirection: record ? str(record.industryDirection) : undefined,
    investmentAmount: record ? num(record.investmentAmount) : undefined,
    fixedAssetInvestment: record ? num(record.fixedAssetInvestment) : undefined,
    approvalDepartment: record ? str(record.approvalDepartment) : undefined,
    approvalDate: record ? date(record.approvalDate) : undefined,
  };
};

/** 项目属性多标签配色（循环使用），与 ProjectManage 列表一致 */
const PROJECT_ATTRIBUTE_TAG_COLORS = [
  '#1890FF',
  '#52C41A',
  '#722ED1',
  '#FA8C16',
  '#EB2F96',
  '#13C2C2',
  '#FAAD14',
  '#2F54EB',
  '#FF7A45',
  '#73D13D',
];

type FieldType = {
  name?: string;
  code?: string;
  /** 申请备案时间（查询） */
  applyDateRange?: [Dayjs, Dayjs];
  startDateRange?: [Dayjs, Dayjs];
  endDateRange?: [Dayjs, Dayjs];
  projectStage?: string; // 项目进度（查询条件，接口参数名）
  investor?: string; // 投资主体名称 / 查询「投资方名称」
  /** 列表查询：项目内容 → 接口 content */
  content?: string;
  /** 列表查询：产业类别（工业、服务业）→ 接口 industryService */
  industryService?: string;
  district?: string; // 所属区县
  park?: string; // 所属园区
  projectAddress?: string; // 项目地址
  bindustry?: string; // 产业类别（工业/服务业）
  bIndustry?: string; // 产业类别
  pzwh?: string; // 批准部门及文号
  pzrq?: string; // 批准日期
  startDateCommit?: string; // 批准日期
  uCode?: string; // 统一社会信用代码
  ucode?: string; // 统一社会信用代码
  desc?: string; // 主要产品及产能
  industryName?: string; // 行业代码（国民经济行业分类）
  industryCode?: string; // 行业代码
  projType?: string; // 产业方向（8+13+X）
  investMoney?: string; // 计划总投资金额（万元）
  /** 列表查询：计划总投资区间（万元），与 ProjectManage 一致 */
  investmentAmountRange?:
    | 'all'
    | 'above50000'
    | 'above10000'
    | 'mid500to10000'
    | 'below500';
  fixedInvest?: string; // 固定资产投资
  databaseInclusionStatus?: boolean; // 是否已入库纳统（表单2等使用）
  isLt?: boolean; // 是否列统项目（查询条件，接口参数名）
  /** 列表查询：入库状态 → 接口 rkStat */
  rkStat?: number;
  statisticalProjectCode?: string; // 统计库项目编码
  statisticalProjectName?: string; // 统计库项目名称
  kgzzcl?: string; // kgzzcl  开工作证材料
  statisticalProjectPic?: string; // statisticalProjectPic  项目进度图片
  /** 投资类型：与接口 ifForeignCapital 一致，内资 false / 外资 true */
  ifForeignCapital?: boolean;
  recordNumber?: string; // 备案证号
  reportingUnit?: string; // 申报单位
  landUseType?: string;
  landSupplyProgress?: string;
  environmentalAssessment?: string;
  safetyAssessment?: string;
  energyAssessment?: string;
  constructionDrawingReview?: string;
  constructionPermitStatus?: string;
  remarks?: string;
  /** 编辑表单 / 列表查询：备案投资类型（字符串） */
  investmentType?: string;
  /** 查询表单：内外资 → list 接口 investmentNature（内资 false / 外资 true） */
  investmentNature?: boolean;
};

/** 计划总投资（万元）查询下拉 → list 接口 investmentAmount1/2（与 ProjectManage 区间一致） */
function investmentRangeToApiAmounts(
  range: FieldType['investmentAmountRange'],
): { investmentAmount1?: number; investmentAmount2?: number } {
  if (range === 'all' || range === undefined) return { investmentAmount1: undefined, investmentAmount2: undefined };
  if (range === 'above50000') return { investmentAmount1: 50000, investmentAmount2: undefined };
  if (range === 'above10000') return { investmentAmount1: 10000, investmentAmount2: undefined };
  if (range === 'mid500to10000') return { investmentAmount1: 500, investmentAmount2: 10000 };
  if (range === 'below500') return { investmentAmount1: undefined, investmentAmount2: 500 };
  return { investmentAmount1: undefined, investmentAmount2: undefined };
}

/** 从 URL 的 investmentAmount1/2 反推下拉值（仅匹配预设区间） */
function inferInvestmentRangeFromUrlAmounts(
  a1?: number,
  a2?: number,
): FieldType['investmentAmountRange'] {
  if (a1 === undefined && a2 === undefined) return 'all';
  if (a1 === 50000 && a2 === undefined) return 'above50000';
  if (a1 === 10000 && a2 === undefined) return 'above10000';
  if (a1 === 500 && a2 === 10000) return 'mid500to10000';
  if (a1 === undefined && a2 === 500) return 'below500';
  return undefined;
}

type ProjectQueryParams = Omit<ListProjectNonInvestmentConfirmationRequest, 'status'> & {
  code?: string;
  district?: string;
  park?: string;
};

const { RangePicker } = DatePicker;

/** 为 true 时显示「草稿箱」「暂存草稿」 */
const SHOW_DRAFT_UI = true;

/** 与 KeyProjectApplyModal 一致：字典 code 为 8+13+X 编码 */
const isIndustry813CodeLike = (val: unknown) => {
  const s = typeof val === 'string' ? val.trim() : '';
  return /^\d+(\.\d+)*$/.test(s);
};

function findSelectableProjTypeCodeByTitle(treeData: any[], title: string): string | undefined {
  const t = (title ?? '').trim();
  if (!t) return undefined;
  for (const node of treeData ?? []) {
    if (String(node?.title ?? '').trim() === t) return node?.value;
    const children = node?.children;
    if (Array.isArray(children) && children.length) {
      const found = findSelectableProjTypeCodeByTitle(children, t);
      if (found) return found;
    }
  }
  return undefined;
}

/** 与 KeyProjectApplyModal.buildIndustryTreeData 一致：产业集群 + 产业链树 */
function buildProjType813TreeData(items: any[]) {
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
}

/** 与 KeyProjectApplyModal.resolveIndustryDictCatalog 一致：2026 年及以后用新字典 */
function resolveProjType813Catalog(approvalDate?: Dayjs | Date | null, applicationTime?: Dayjs | Date | null): string {
  const d = approvalDate
    ? dayjs(approvalDate as any)
    : applicationTime
      ? dayjs(applicationTime as any)
      : dayjs();
  const y = d.year();
  return Number.isFinite(y) && y >= 2026 ? '8_13_x_2026' : '8_13_X';
}

/** 增资扩产 projectType（字典值）→ 重点项目「产业类别」 */
function mapZzkcProjectTypeToKeyIndustryCategory(projectType?: string): string | undefined {
  if (projectType === '1') return '服务业';
  if (projectType === '2') return '工业';
  return undefined;
}

/**
 * 增资扩产详情 → KeyProjectApplyModal.initialRecord。
 * 仅按对照表回填有对应关系的字段；无对应项的不放入 initialRecord，由用户在申报表中填写。
 */
async function buildKeyProjectInitialFromNonInvestmentDetail(
  detail: ProjectNonInvestmentConfirmationVo,
  loadProjType813TreeFn: (catalog: string) => Promise<any[]>,
): Promise<Record<string, unknown>> {
  const cat = resolveProjType813Catalog(
    detail.approvalDate ? dayjs(detail.approvalDate) : null,
    detail.applicationTime ? dayjs(detail.applicationTime) : null,
  );
  const treeData = await loadProjType813TreeFn(cat);
  const rawDir = detail.industryDirection;
  let dirStr =
    rawDir !== undefined && rawDir !== null && String(rawDir).trim() !== ''
      ? String(rawDir).trim()
      : undefined;
  let x813: string | undefined;
  if (dirStr) {
    if (isIndustry813CodeLike(dirStr)) {
      x813 = dirStr;
    } else {
      const code = findSelectableProjTypeCodeByTitle(treeData, dirStr);
      if (code) x813 = code;
    }
  }

  const industryCat = mapZzkcProjectTypeToKeyIndustryCategory(detail.projectType);
  const invType =
    detail.ifForeignCapital === true ? '外资' : detail.ifForeignCapital === false ? '内资' : undefined;

  /** 增资扩产投资额为人民币万元；外资申报表填万美元，不在此回填以免单位混淆 */
  const plannedTotalInvestment =
    invType === '内资' &&
    detail.investmentAmount !== undefined &&
    detail.investmentAmount !== null
      ? Number(detail.investmentAmount)
      : undefined;

  const signingTime = detail.approvalDate ?? detail.applicationTime;

  return {
    fgName: (detail as any)?.fgName ?? detail.projectName,
    projectSource: '增资扩产',
    projectCode: detail.projectCode,
    projectName: detail.projectName,
    investor: detail.investor,
    plannedTotalInvestment,
    projectRating: invType,
    projectType: industryCat,
    projectTypeDisplay: detail.investmentType,
    industryName: detail.industryClassification,
    industryMajorClassName: detail.industryDirection,
    ...(industryCat === '工业' && x813 ? { x: x813 } : {}),
    cityDistrict: detail.cityDistrict,
    park: detail.park,
    mainProducts: detail.mainProducts,
    signingTime,
    approvalDate: detail.approvalDate,
    applicationTime: detail.applicationTime,
  };
}

/** 与 fillFormByOnlineApproval 的 nullMap 一致：true 表示来源值为空，锁定场景下仍可填写 */
function buildOnlineApprovalNullMapFromVo(data: ProjectNonInvestmentConfirmationVo | null | undefined) {
  if (!data) return {} as Record<string, boolean>;
  return {
    code: data.projectCode === null || data.projectCode === undefined || String(data.projectCode).trim() === '',
    name: data.projectName === null || data.projectName === undefined || String(data.projectName).trim() === '',
    projectAddress:
      data.projectAddress === null ||
      data.projectAddress === undefined ||
      String(data.projectAddress).trim() === '',
    startDateCommit: data.applicationTime === null || data.applicationTime === undefined,
    desc:
      data.mainProducts === null || data.mainProducts === undefined || String(data.mainProducts).trim() === '',
    investMoney: data.investmentAmount === null || data.investmentAmount === undefined,
    uCode:
      data.unifiedSocialCreditCode === null ||
      data.unifiedSocialCreditCode === undefined ||
      String(data.unifiedSocialCreditCode).trim() === '',
    reportingUnit:
      data.department === null || data.department === undefined || String(data.department).trim() === '',
    investor: data.investor === null || data.investor === undefined || String(data.investor).trim() === '',
  };
}

/** 在线审批 VO → 表单 patch + nullMap（与 fillFormByOnlineApproval 同源） */
function buildOnlineApprovalPatchAndNullMapFromDetail(detail: ProjectOnlineApprovalVo) {
  const nullMap: Record<string, boolean> = {
    code: detail.projectCode === null || detail.projectCode === undefined,
    name: detail.projectName === null || detail.projectName === undefined,
    projectAddress: detail.constructionLocation === null || detail.constructionLocation === undefined,
    startDateCommit: detail.applicationTime === null || detail.applicationTime === undefined,
    desc: detail.constructionScaleAndContent === null || detail.constructionScaleAndContent === undefined,
    investMoney: detail.totalInvestment === null || detail.totalInvestment === undefined,
    uCode:
      (detail.legalCompanyDocumentNumber === null || detail.legalCompanyDocumentNumber === undefined) &&
      (detail.applicationCompanyDocumentNumber === null ||
        detail.applicationCompanyDocumentNumber === undefined),
    reportingUnit: detail.applicationCompany === null || detail.applicationCompany === undefined,
    investor:
      (detail.legalCompany === null || detail.legalCompany === undefined) &&
      (detail.applicationCompany === null || detail.applicationCompany === undefined),
  };

  const patch: Record<string, any> = {
    code: detail.projectCode === null || detail.projectCode === undefined ? undefined : detail.projectCode,
    name: detail.projectName === null || detail.projectName === undefined ? undefined : detail.projectName,
    projectAddress:
      detail.constructionLocation === null || detail.constructionLocation === undefined
        ? undefined
        : detail.constructionLocation,
    startDateCommit:
      detail.applicationTime === null || detail.applicationTime === undefined
        ? undefined
        : dayjs(detail.applicationTime),
    desc:
      detail.constructionScaleAndContent === null || detail.constructionScaleAndContent === undefined
        ? undefined
        : detail.constructionScaleAndContent,
    investMoney: detail.totalInvestment === null || detail.totalInvestment === undefined ? undefined : String(detail.totalInvestment),
    uCode:
      detail.legalCompanyDocumentNumber ??
      detail.applicationCompanyDocumentNumber ??
      undefined,
    reportingUnit:
      detail.applicationCompany === null || detail.applicationCompany === undefined ? undefined : detail.applicationCompany,
    investor: detail.legalCompany ?? detail.applicationCompany ?? undefined,
  };

  return { nullMap, patch };
}

/** 入库审核：意见类型 → rkStat（入库状态） */
const WAREHOUSE_REVIEW_OPINION_RK_STAT: Record<'通过' | '退回', number> = {
  通过: 1,
  退回: 2,
};

/** 列表展示：rkStat 与文案 */
const RK_STAT_LABEL: Record<number, string> = {
  0: '审核中',
  1: '已入库',
  2: '退回',
};

const RK_STAT_SEARCH_OPTIONS = (Object.entries(RK_STAT_LABEL) as [string, string][]).map(([key, label]) => ({
  value: Number(key),
  label,
}));

/** 未入库时点击开工/竣工认定的提示 */
const WAREHOUSE_OPERATION_TIP = '当前项目尚未入库，请等待工信局审核入库后操作。';

/** 查询表单项按顺序每行 4 个排列，顺序不变 */
function chunkSearchCols<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

const ONLINE_APPROVAL_SYNC_FORM_KEYS = [
  'code',
  'name',
  'projectAddress',
  'startDateCommit',
  'desc',
  'investMoney',
  'uCode',
  'reportingUnit',
  'investor',
] as const;

const ProjectManage7 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const access = useAccess();
  const [collapsed, setCollapsed] = useState(false);
  /** 与 ProjectManage 一致：URL 更新导致重挂载时会话内保持「更多查询」展开，避免点查询后折叠 */
  const [showMoreSearch, setShowMoreSearchPersist] = usePersistedMoreSearch();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [progressForm] = Form.useForm();
  const [commencementForm] = Form.useForm();
  const [completionForm] = Form.useForm();
  const [ltForm] = Form.useForm();
  const [warehouseReviewForm] = Form.useForm<{ opinionType?: '通过' | '退回'; comments?: string }>();

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isCommencementModalOpen, setIsCommencementModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isLtModalOpen, setIsLtModalOpen] = useState(false);
  const [ltEditingId, setLtEditingId] = useState<string>('');
  const [viewDetailData, setViewDetailData] = useState<any>(null);
  const [commencementRecordId, setCommencementRecordId] = useState<string>('');
  const [commencementSubmitRecord, setCommencementSubmitRecord] = useState<Record<string, unknown> | null>(
    null,
  );
  const [commencementFileList, setCommencementFileList] = useState<UploadFile[]>([]);
  const [commencementProgressImagesList, setCommencementProgressImagesList] = useState<UploadFile[]>([]);
  const [completionRecordId, setCompletionRecordId] = useState<string>('');
  const [completionSubmitRecord, setCompletionSubmitRecord] = useState<Record<string, unknown> | null>(null);
  const [completionFileList, setCompletionFileList] = useState<UploadFile[]>([]);

  const [warehouseReviewModalOpen, setWarehouseReviewModalOpen] = useState(false);
  const [warehouseReviewRecordId, setWarehouseReviewRecordId] = useState('');
  const [warehouseReviewDetail, setWarehouseReviewDetail] =
    useState<ProjectNonInvestmentConfirmationVo | null>(null);
  const [warehouseReviewLoading, setWarehouseReviewLoading] = useState(false);
  const [warehouseReviewSubmitting, setWarehouseReviewSubmitting] = useState(false);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileList2, setFileList2] = useState<UploadFile[]>([]);
  const [projectCodeDuplicate, setProjectCodeDuplicate] = useState(false);
  const [projectCodeHint, setProjectCodeHint] = useState('');
  const [originalProjectCode, setOriginalProjectCode] = useState('');
  const [checkingProjectCode, setCheckingProjectCode] = useState(false);
  /** 编辑弹窗：从在线审批拉取并刷新只读字段 */
  const [refreshingLockedFields, setRefreshingLockedFields] = useState(false);
  /** 新增弹窗：最近一次点击「查询」成功完成时所校验的项目代码；与当前表单 code 一致才允许提交 */
  const [addModalProjectCodeQueryToken, setAddModalProjectCodeQueryToken] = useState<string | null>(null);
  // 当命中“项目在线审批系统存在”后自动回填的字段：禁止继续手工填写
  const [isAutoFillLocked, setIsAutoFillLocked] = useState(false);
  // 回显字段值若为 null：允许置空并放宽 required 校验
  const [autoFillNullMap, setAutoFillNullMap] = useState<Record<string, boolean>>({});
  const [progressRecordId, setProgressRecordId] = useState<string>('');
  const [isOnlineApprovalModalOpen, setIsOnlineApprovalModalOpen] = useState(false);
  const [onlineApprovalDetail, setOnlineApprovalDetail] = useState<ProjectOnlineApprovalVo | null>(null);
  const [keyProjectApplyModalOpen, setKeyProjectApplyModalOpen] = useState(false);
  const [keyProjectApplyInitialRecord, setKeyProjectApplyInitialRecord] = useState<Record<
    string,
    unknown
  > | null>(null);
  /** 列表/详情 isOnlineApproval：与在线审批同源的字段有值则不可改，后端为 null 则可填 */
  const [isOnlineApprovalEditLocked, setIsOnlineApprovalEditLocked] = useState(false);
  /** 编辑弹窗：详情 isOnlineApproval 为 true 时才展示「更新」按钮 */
  const [editModalIsOnlineApproval, setEditModalIsOnlineApproval] = useState(false);
  const [serverOnlineApprovalNullMap, setServerOnlineApprovalNullMap] = useState<Record<string, boolean>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isUploading2, setIsUploading2] = useState(false);

  const mergedApprovalFieldLock = useMemo(() => {
    if (isAutoFillLocked) return { active: true as const, nullMap: autoFillNullMap };
    if (isOnlineApprovalEditLocked) return { active: true as const, nullMap: serverOnlineApprovalNullMap };
    return { active: false as const, nullMap: {} as Record<string, boolean> };
  }, [isAutoFillLocked, autoFillNullMap, isOnlineApprovalEditLocked, serverOnlineApprovalNullMap]);

  const approvalFieldDisabled = (key: string) =>
    mergedApprovalFieldLock.active && !mergedApprovalFieldLock.nullMap[key];

  const clearOnlineApprovalEditLock = () => {
    setIsOnlineApprovalEditLocked(false);
    setServerOnlineApprovalNullMap({});
  };

  const handleCancel1 = () => {
    setIsModalOpen1(false);
    setModalDraftSaving(false);
    setFileList([]);
    setFileList2([]);
    form2.resetFields();
    setProjectCodeDuplicate(false);
    setProjectCodeHint('');
    setOriginalProjectCode('');
    setAddModalProjectCodeQueryToken(null);
    setIsAutoFillLocked(false);
    setAutoFillNullMap({});
    clearOnlineApprovalEditLock();
    setEditModalIsOnlineApproval(false);
  };
  const handleCancel3 = () => {
    setIsModalOpen3(false);
    setViewDetailData(null);
  };
  const handleProgressModalCancel = () => {
    setIsProgressModalOpen(false);
    progressForm.resetFields();
    setProgressRecordId('');
  };

  const openCommencementModal = async (record: Record<string, unknown>) => {
    const recordId = String(record.id ?? '');
    if (!recordId) {
      message.error('未获取项目ID');
      return;
    }
    setCommencementRecordId(recordId);
    setCommencementSubmitRecord(record);
    setCommencementFileList([]);
    setCommencementProgressImagesList([]);
    commencementForm.resetFields();
    try {
      const data = await primeApi.getProjectNonInvestmentConfirmation({ id: recordId });
      setCommencementSubmitRecord({ ...record, ...(data as Record<string, unknown>) });

      // 处理 kgzzcl 文件列表 - 数组元素可能是字符串（path）或对象
      if (data?.kgzzcl && Array.isArray(data.kgzzcl)) {
        const list = data.kgzzcl
          .filter((item: any) => item) // 过滤掉无效项
          .map((item: any) => {
            // 如果是字符串，直接使用；如果是对象，使用 path 属性
            const path = typeof item === 'string' ? item : (item.path || '');
            const name = typeof item === 'string'
              ? path.split('/').pop()?.split('?')[0] || '文件'
              : (item.name || path.split('/').pop()?.split('?')[0] || '文件');
            return {
              uid: `${Math.random().toString(36).substr(2, 9)}`,
              name,
              status: 'done' as const,
              url: path,
              response: [{ url: path, path: path, name }],
            };
          });
        setCommencementFileList(list);
      }

      // 处理 progressImages 文件列表 - 数组元素可能是字符串（path）或对象
      if (data?.progressImages && Array.isArray(data.progressImages)) {
        const list2 = data.progressImages
          .filter((item: any) => item) // 过滤掉无效项
          .map((item: any) => {
            // 如果是字符串，直接使用；如果是对象，使用 path 属性
            const path = typeof item === 'string' ? item : (item.path || '');
            const name = typeof item === 'string'
              ? path.split('/').pop()?.split('?')[0] || '图片'
              : (item.name || path.split('/').pop()?.split('?')[0] || '图片');
            return {
              uid: `${Math.random().toString(36).substr(2, 9)}`,
              name,
              status: 'done' as const,
              url: path,
              response: [{ url: path, path: path, name }],
            };
          });
        setCommencementProgressImagesList(list2);
      }

      // 设置表单值（回显字段）
      commencementForm.setFieldsValue({
        projectCode: data.projectCode || '',
        projectName: data.projectName || '',
        cityDistrict: (data as any).cityName || data.cityDistrict || '',
        park: data.parkName || data.park || '',
        mainProducts: data.mainProducts || '',
        commencementDate: data.commencementDate ? dayjs(data.commencementDate) : undefined,
      });
    } catch (error) {
      console.error('获取项目详情失败:', error);
      await handleApiError(error);
      return;
    }
    setIsCommencementModalOpen(true);
  };

  const handleCommencementModalCancel = () => {
    setIsCommencementModalOpen(false);
    commencementForm.resetFields();
    setCommencementRecordId('');
    setCommencementSubmitRecord(null);
    setCommencementFileList([]);
    setCommencementProgressImagesList([]);
  };

  const handleCommencementSubmit = async () => {
    if (!commencementRecordId) {
      message.error('未获取项目ID，无法提交');
      return;
    }
    try {
      const values = await commencementForm.validateFields();

      // 处理文件上传 - kgzzcl，只提取 path 值
      const kgzzclFiles = commencementFileList
        .filter(file => file.status === 'done')
        .map(file => {
          // 如果是新上传的文件，从 response 中获取
          if (file.response) {
            const response = Array.isArray(file.response) ? file.response[0] : file.response;
            if (response) {
              return response.path || response.url || file.url || '';
            }
          }
          // 如果是已存在的文件，从 url 中获取
          return file.url || '';
        })
        .filter(path => path); // 过滤掉空字符串

      // 处理文件上传 - progressImages，只提取 path 值
      const progressImagesFiles = commencementProgressImagesList
        .filter(file => file.status === 'done')
        .map(file => {
          // 如果是新上传的文件，从 response 中获取
          if (file.response) {
            const response = Array.isArray(file.response) ? file.response[0] : file.response;
            if (response) {
              return response.path || response.url || file.url || '';
            }
          }
          // 如果是已存在的文件，从 url 中获取
          return file.url || '';
        })
        .filter(path => path); // 过滤掉空字符串

      await primeApi.updateProjectNonInvestmentConfirmation({
        id: commencementRecordId,
        projectNonInvestmentConfirmationDto: {
          ...buildConfirmationBaseDtoFromRecord(commencementSubmitRecord, commencementRecordId),
          isStarted: true,
          commencementDate: values.commencementDate
            ? dayjsToApiDatePreservingCalendarDay(dayjs(values.commencementDate))
            : undefined,
          kgzzcl: kgzzclFiles.length > 0 ? (kgzzclFiles as any) : undefined,
          progressImages: progressImagesFiles.length > 0 ? (progressImagesFiles as any) : undefined,
        },
      });

      message.success('开工确认已提交');
      handleCommencementModalCancel();
      void fetchData({
        ...getSearchFilters(),
        page: pagination.current,
        size: pagination.pageSize,
      });
    } catch (error) {
      if ((error as any)?.errorFields) {
        message.warning('请填写相关字段后重试');
        return;
      }
      console.error('提交开工确认失败:', error);
      await handleApiError(error);
    }
  };

  const openCompletionModal = async (record: Record<string, unknown>) => {
    const recordId = String(record.id ?? '');
    if (!recordId) {
      message.error('未获取项目ID');
      return;
    }
    setCompletionRecordId(recordId);
    setCompletionSubmitRecord(record);
    setCompletionFileList([]);
    completionForm.resetFields();
    try {
      const data = await primeApi.getProjectNonInvestmentConfirmation({ id: recordId });
      setCompletionSubmitRecord({ ...record, ...(data as Record<string, unknown>) });

      // 处理 jgzzcl 文件列表 - 数组元素可能是字符串（path）或对象
      if (data?.jgzzcl && Array.isArray(data.jgzzcl)) {
        const list = data.jgzzcl
          .filter((item: any) => item) // 过滤掉无效项
          .map((item: any) => {
            // 如果是字符串，直接使用；如果是对象，使用 path 属性
            const path = typeof item === 'string' ? item : (item.path || '');
            const name = typeof item === 'string'
              ? path.split('/').pop()?.split('?')[0] || '文件'
              : (item.name || path.split('/').pop()?.split('?')[0] || '文件');
            return {
              uid: `${Math.random().toString(36).substr(2, 9)}`,
              name,
              status: 'done' as const,
              url: path,
              response: [{ url: path, path: path, name }],
            };
          });
        setCompletionFileList(list);
      }

      // 设置表单值（回显字段）
      completionForm.setFieldsValue({
        projectCode: data.projectCode || '',
        projectName: data.projectName || '',
        cityDistrict: (data as any).cityName || data.cityDistrict || '',
        park: data.parkName || data.park || '',
        mainProducts: data.mainProducts || '',
        endDate: data.endDate ? dayjs(data.endDate) : undefined,
      });
    } catch (error) {
      console.error('获取项目详情失败:', error);
      await handleApiError(error);
      return;
    }
    setIsCompletionModalOpen(true);
  };

  const handleCompletionModalCancel = () => {
    setIsCompletionModalOpen(false);
    completionForm.resetFields();
    setCompletionRecordId('');
    setCompletionSubmitRecord(null);
    setCompletionFileList([]);
  };

  const handleCompletionSubmit = async () => {
    if (!completionRecordId) {
      message.error('未获取项目ID，无法提交');
      return;
    }
    try {
      const values = await completionForm.validateFields();

      // 处理文件上传 - jgzzcl，只提取 path 值
      const jgzzclFiles = completionFileList
        .filter(file => file.status === 'done')
        .map(file => {
          // 如果是新上传的文件，从 response 中获取
          if (file.response) {
            const response = Array.isArray(file.response) ? file.response[0] : file.response;
            if (response) {
              return response.path || response.url || file.url || '';
            }
          }
          // 如果是已存在的文件，从 url 中获取
          return file.url || '';
        })
        .filter(path => path); // 过滤掉空字符串

      await primeApi.updateProjectNonInvestmentConfirmation({
        id: completionRecordId,
        projectNonInvestmentConfirmationDto: {
          ...buildConfirmationBaseDtoFromRecord(completionSubmitRecord, completionRecordId),
          isEnd: true,
          endDate: values.endDate ? dayjsToApiDatePreservingCalendarDay(dayjs(values.endDate)) : undefined,
          jgzzcl: jgzzclFiles.length > 0 ? (jgzzclFiles as any) : undefined,
        },
      });

      message.success('竣工确认已提交');
      handleCompletionModalCancel();
      void fetchData({
        ...getSearchFilters(),
        page: pagination.current,
        size: pagination.pageSize,
      });
    } catch (error) {
      if ((error as any)?.errorFields) {
        message.warning('请填写相关字段后重试');
        return;
      }
      console.error('提交竣工确认失败:', error);
      await handleApiError(error);
    }
  };

  const navigate = useNavigate();

  // 从URL参数中获取分页信息及日期筛选
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialPageSize = parseInt(searchParams.get('size') || '10', 10);
  const initialName = searchParams.get('name') || '';
  const initialCode = searchParams.get('code') || '';
  const initialContent = searchParams.get('content') || '';
  const initialDistrict = searchParams.get('district') || '';
  const initialPark = searchParams.get('park') || '';
  const initialInvestor = searchParams.get('investor') || '';
  const initialIndustryService = searchParams.get('industryService') || '';
  const initialInvestmentType = searchParams.get('investmentType')?.trim() || '';
  const initialInvestmentNatureRaw = searchParams.get('investmentNature');
  const initialInvestmentNature =
    initialInvestmentNatureRaw === null
      ? undefined
      : initialInvestmentNatureRaw === 'true'
        ? true
        : initialInvestmentNatureRaw === 'false'
          ? false
          : undefined;
  const initialProjectStage = searchParams.get('projectStage') || '';
  const parseUrlInvAmount = (key: string): number | undefined => {
    const raw = searchParams.get(key);
    if (raw === null || raw === '') return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  };
  const initialInvestmentAmountMin = parseUrlInvAmount('investmentAmount1');
  const initialInvestmentAmountMax = parseUrlInvAmount('investmentAmount2');
  const initialInvestmentRange = inferInvestmentRangeFromUrlAmounts(
    initialInvestmentAmountMin,
    initialInvestmentAmountMax,
  );
  const initialIsLtRaw = searchParams.get('isLt');
  const initialIsLt =
    initialIsLtRaw === null
      ? undefined
      : initialIsLtRaw === 'true'
        ? true
        : initialIsLtRaw === 'false'
          ? false
          : undefined;
  const initialRkStatRaw = searchParams.get('rkStat');
  const initialRkStat =
    initialRkStatRaw !== null && initialRkStatRaw !== ''
      ? (() => {
          const n = Number(initialRkStatRaw);
          return Number.isFinite(n) ? n : undefined;
        })()
      : undefined;
  /** URL `status=true` 与草稿箱列表一致 */
  const initialDraftFromUrl = searchParams.get('status') === 'true';
  const recordDate1Param = searchParams.get('recordDate1');
  const recordDate2Param = searchParams.get('recordDate2');
  const startDate1Param = searchParams.get('startDate1');
  const startDate2Param = searchParams.get('startDate2');
  const endDate1Param = searchParams.get('endDate1');
  const endDate2Param = searchParams.get('endDate2');

  const initialApplyDateRange = useMemo(() => {
    if (recordDate1Param && recordDate2Param) {
      return [dayjs(recordDate1Param), dayjs(recordDate2Param)] as [Dayjs, Dayjs];
    }
    return undefined;
  }, [recordDate1Param, recordDate2Param]);

  const initialStartDateRange = useMemo(() => {
    if (startDate1Param && startDate2Param) {
      return [dayjs(startDate1Param), dayjs(startDate2Param)] as [Dayjs, Dayjs];
    }
    return undefined;
  }, [startDate1Param, startDate2Param]);

  const initialEndDateRange = useMemo(() => {
    if (endDate1Param && endDate2Param) {
      return [dayjs(endDate1Param), dayjs(endDate2Param)] as [Dayjs, Dayjs];
    }
    return undefined;
  }, [endDate1Param, endDate2Param]);

  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialPageSize,
    total: 0
  });

  /** true：草稿箱列表（接口 list 参数 status=true）；false：正式列表（status=false） */
  const [listDraftBoxMode, setListDraftBoxMode] = useState(initialDraftFromUrl);
  const [modalDraftSaving, setModalDraftSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  // 更新URL参数
  const updateUrlParams = (params: {
    page?: number;
    size?: number;
    name?: string;
    code?: string;
    content?: string;
    district?: string;
    park?: string;
    investor?: string;
    industryService?: string;
    investmentType?: string;
    investmentAmount1?: number;
    investmentAmount2?: number;
    investmentNature?: boolean;
    projectStage?: string;
    isLt?: boolean;
    rkStat?: number;
    recordDate1?: string;
    recordDate2?: string;
    startDate1?: string;
    startDate2?: string;
    endDate1?: string;
    endDate2?: string;
    /** 为 true 时 URL 带 `status=true`（草稿箱） */
    status?: boolean;
  }) => {
    const newParams = new URLSearchParams();
    if (params.page && params.page !== 1) newParams.set('page', String(params.page));
    if (params.size && params.size !== 10) newParams.set('size', String(params.size));
    if (params.name) newParams.set('name', params.name);
    if (params.code) newParams.set('code', params.code);
    if (params.content) newParams.set('content', params.content);
    if (params.district) newParams.set('district', params.district);
    if (params.park) newParams.set('park', params.park);
    if (params.investor) newParams.set('investor', params.investor);
    if (params.industryService) newParams.set('industryService', params.industryService);
    if (params.investmentType) newParams.set('investmentType', params.investmentType);
    if (
      params.investmentAmount1 !== undefined &&
      params.investmentAmount1 !== null &&
      Number.isFinite(params.investmentAmount1)
    ) {
      newParams.set('investmentAmount1', String(params.investmentAmount1));
    }
    if (
      params.investmentAmount2 !== undefined &&
      params.investmentAmount2 !== null &&
      Number.isFinite(params.investmentAmount2)
    ) {
      newParams.set('investmentAmount2', String(params.investmentAmount2));
    }
    if (params.investmentNature === true) newParams.set('investmentNature', 'true');
    if (params.investmentNature === false) newParams.set('investmentNature', 'false');
    if (params.projectStage !== undefined) {
      if (params.projectStage) newParams.set('projectStage', params.projectStage);
      else newParams.delete('projectStage');
    }
    if (params.isLt === true) newParams.set('isLt', 'true');
    if (params.isLt === false) newParams.set('isLt', 'false');
    if (
      params.rkStat !== undefined &&
      params.rkStat !== null &&
      Number.isFinite(params.rkStat)
    ) {
      newParams.set('rkStat', String(params.rkStat));
    }
    if (params.recordDate1) newParams.set('recordDate1', params.recordDate1);
    if (params.recordDate2) newParams.set('recordDate2', params.recordDate2);
    if (params.startDate1) newParams.set('startDate1', params.startDate1);
    if (params.startDate2) newParams.set('startDate2', params.startDate2);
    if (params.endDate1) newParams.set('endDate1', params.endDate1);
    if (params.endDate2) newParams.set('endDate2', params.endDate2);
    if (params.status === true) newParams.set('status', 'true');
    setSearchParams(newParams);
  };

  const formatDateParam = (value?: Dayjs | null): Date | undefined =>
    value ? dayjsToApiDatePreservingCalendarDay(value) : undefined;
  const formatDateString = (value?: Dayjs | null): string | undefined => (value ? value.format('YYYY-MM-DD') : undefined);

  const getRangeValues = () => ({
    applyRange: form.getFieldValue('applyDateRange') as [Dayjs, Dayjs] | undefined,
    startRange: form.getFieldValue('startDateRange') as [Dayjs, Dayjs] | undefined,
    endRange: form.getFieldValue('endDateRange') as [Dayjs, Dayjs] | undefined,
  });

  const extractRange = (range?: [Dayjs, Dayjs] | null) => ({
    start: formatDateParam(range?.[0]),
    end: formatDateParam(range?.[1]),
  });

  const getSearchFilters = (): Omit<ListProjectNonInvestmentConfirmationRequest, 'status' | 'page' | 'size'> => {
    const { applyRange, startRange, endRange } = getRangeValues();
    const { start: recordDate1, end: recordDate2 } = extractRange(applyRange);
    const { start: startDate1, end: startDate2 } = extractRange(startRange);
    const { start: endDate1, end: endDate2 } = extractRange(endRange);
    const investmentNature = form.getFieldValue('investmentNature') as boolean | undefined;
    const investmentAmountRange = form.getFieldValue('investmentAmountRange') as FieldType['investmentAmountRange'];
    let { investmentAmount1, investmentAmount2 } = investmentRangeToApiAmounts(investmentAmountRange);
    /** 与 ProjectManage 一致：URL 带 investmentAmount1/2 但不在预设区间时，表单为「全部」仍按 URL 区间筛选 */
    const urlA1 = parseUrlInvAmount('investmentAmount1');
    const urlA2 = parseUrlInvAmount('investmentAmount2');
    const presetFromUrl = inferInvestmentRangeFromUrlAmounts(urlA1, urlA2);
    const rangeIsAll = investmentAmountRange === 'all' || investmentAmountRange === undefined;
    if (rangeIsAll && presetFromUrl === undefined && (urlA1 !== undefined || urlA2 !== undefined)) {
      investmentAmount1 = urlA1;
      investmentAmount2 = urlA2;
    }
    const rawContent = (form.getFieldValue('content') as string | undefined)?.trim();
    const rawInvestor = (form.getFieldValue('investor') as string | undefined)?.trim();
    const svc = (form.getFieldValue('industryService') as string | undefined)?.trim();
    const invType = (form.getFieldValue('investmentType') as string | undefined)?.trim();
    const rkRaw = form.getFieldValue('rkStat') as number | undefined;
    const rkStat = typeof rkRaw === 'number' && Number.isFinite(rkRaw) ? rkRaw : undefined;
    return {
      name: form.getFieldValue('name') || '',
      code: form.getFieldValue('code') || '',
      content: rawContent || undefined,
      investmentType: invType || undefined,
      district: (form.getFieldValue('district') as string | undefined) || undefined,
      park: (form.getFieldValue('park') as string | undefined) || undefined,
      investor: rawInvestor || undefined,
      industryService: svc || undefined,
      investmentNature:
        investmentNature === true || investmentNature === false ? investmentNature : undefined,
      projectStage: (form.getFieldValue('projectStage') as string | undefined) || undefined,
      isLt: form.getFieldValue('isLt') as boolean | undefined,
      rkStat,
      investmentAmount1,
      investmentAmount2,
      recordDate1,
      recordDate2,
      startDate1,
      startDate2,
      endDate1,
      endDate2,
    };
  };

  const getUrlDateFilters = () => {
    const { applyRange, startRange, endRange } = getRangeValues();
    return {
      recordDate1: formatDateString(applyRange?.[0]),
      recordDate2: formatDateString(applyRange?.[1]),
      startDate1: formatDateString(startRange?.[0]),
      startDate2: formatDateString(startRange?.[1]),
      endDate1: formatDateString(endRange?.[0]),
      endDate2: formatDateString(endRange?.[1]),
    };
  };

  const [dataSource, setDataSource] = useState<any[]>([]);

  const fetchData = async (
    params: ProjectQueryParams,
    options?: { draftList?: boolean; signal?: AbortSignal },
  ) => {
    try {
      const useDraftList = options?.draftList ?? listDraftBoxMode;
      const payload = {
        ...params,
        status: useDraftList,
        investmentNature:
          params.investmentNature === true || params.investmentNature === false
            ? params.investmentNature
            : undefined,
      };
      delete (payload as { projectCategory?: string }).projectCategory;
      const initOverrides = options?.signal ? { signal: options.signal } : undefined;
      // OpenAPI 类型未声明 district/park，但接口实际支持时可透传
      const data = await primeApi.listProjectNonInvestmentConfirmation(payload as any, initOverrides);
      /** 分页状态以保持本次请求的 page/size 为准，不要用接口回传的 size 覆盖。列表请求与 ProjectManage 一致：进入页仅 mount 一次 + 查询/分页/草稿箱/重置等处显式 fetchData。 */
      setPagination((prev) => {
        const current =
          params.page !== undefined && params.page !== null ? params.page : (data.page ?? prev.current);
        const pageSize =
          params.size !== undefined && params.size !== null ? params.size : (data.size ?? prev.pageSize);
        const total = data.total ?? prev.total;
        if (current === prev.current && pageSize === prev.pageSize && total === prev.total) {
          return prev;
        }
        return { ...prev, current, pageSize, total };
      });
      setDataSource(data.records);
    } catch (error) {
      const aborted =
        (typeof AbortSignal !== 'undefined' && options?.signal?.aborted) ||
        (error as { name?: string })?.name === 'AbortError';
      if (aborted) return;
      console.error('获取增资扩产列表失败:', error);
      await handleApiError(error);
    }
  };

  /** 导出：与列表 list 使用同一套 getSearchFilters（与 ProjectManage 导出模式一致），不含 page/size */
  const handleExportNonInvestmentList = async () => {
    try {
      setExporting(true);
      const f = getSearchFilters();
      const req: ExportProjectNonInvestmentConfirmationRequest = {
        status: listDraftBoxMode,
        name: f.name || undefined,
        code: f.code || undefined,
        content: f.content,
        district: f.district,
        park: f.park,
        investor: f.investor,
        industryService: f.industryService,
        investmentType: f.investmentType,
        investmentNature:
          f.investmentNature === true || f.investmentNature === false ? f.investmentNature : undefined,
        projectStage: f.projectStage,
        isLt: f.isLt,
        rkStat: f.rkStat,
        investmentAmount1: f.investmentAmount1,
        investmentAmount2: f.investmentAmount2,
        recordDate1: f.recordDate1,
        recordDate2: f.recordDate2,
        startDate1: f.startDate1,
        startDate2: f.startDate2,
        endDate1: f.endDate1,
        endDate2: f.endDate2,
      };
      const res = await primeApi.exportProjectNonInvestmentConfirmation(req);
      if (!res?.path) {
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
      a.download = res.name || '增资扩产导出.xlsx';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
      await handleApiError(error);
    } finally {
      setExporting(false);
    }
  };

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    const recordDate1Str = formatDateString(values.applyDateRange?.[0]);
    const recordDate2Str = formatDateString(values.applyDateRange?.[1]);
    const startDate1Str = formatDateString(values.startDateRange?.[0]);
    const startDate2Str = formatDateString(values.startDateRange?.[1]);
    const endDate1Str = formatDateString(values.endDateRange?.[0]);
    const endDate2Str = formatDateString(values.endDateRange?.[1]);
    const { investmentAmount1, investmentAmount2 } = investmentRangeToApiAmounts(
      values.investmentAmountRange,
    );
    updateUrlParams({
      page: 1,
      size: pagination.pageSize,
      name: values.name || '',
      code: values.code || '',
      content: values.content?.trim() || undefined,
      district: values.district || undefined,
      park: values.park || undefined,
      investor: values.investor?.trim() || undefined,
      industryService: values.industryService?.trim() || undefined,
      investmentAmount1,
      investmentAmount2,
      investmentType: values.investmentType?.trim() || undefined,
      investmentNature: values.investmentNature,
      projectStage: values.projectStage || '',
      isLt: values.isLt,
      rkStat:
        typeof values.rkStat === 'number' && Number.isFinite(values.rkStat)
          ? values.rkStat
          : undefined,
      recordDate1: recordDate1Str,
      recordDate2: recordDate2Str,
      startDate1: startDate1Str,
      startDate2: startDate2Str,
      endDate1: endDate1Str,
      endDate2: endDate2Str,
      status: listDraftBoxMode,
    });
    const { start: recordDate1, end: recordDate2 } = extractRange(values.applyDateRange);
    const { start: startDate1, end: startDate2 } = extractRange(values.startDateRange);
    const { start: endDate1, end: endDate2 } = extractRange(values.endDateRange);
    void fetchData(
      {
        name: values.name || '',
        code: values.code || '',
        content: values.content?.trim() || undefined,
        district: values.district || undefined,
        park: values.park || undefined,
        investor: values.investor?.trim() || undefined,
        industryService: values.industryService?.trim() || undefined,
        investmentType: values.investmentType?.trim() || undefined,
        investmentNature:
          values.investmentNature === true || values.investmentNature === false
            ? values.investmentNature
            : undefined,
        projectStage: values.projectStage || undefined,
        isLt: values.isLt,
        rkStat:
          typeof values.rkStat === 'number' && Number.isFinite(values.rkStat)
            ? values.rkStat
            : undefined,
        investmentAmount1,
        investmentAmount2,
        recordDate1,
        recordDate2,
        startDate1,
        startDate2,
        endDate1,
        endDate2,
        page: 1,
        size: pagination.pageSize,
      },
      { draftList: listDraftBoxMode },
    );
  };

  const [isShowEnter, setIsShowEnter] = useState(false);
  const [isUpdata, setIsUpdata] = useState(false);
  const [id, setId] = useState('');

  const openKeyProjectApplyModal = async (recordId: string) => {
    try {
      const detail = await primeApi.getProjectNonInvestmentConfirmation({ id: recordId });
      const initial = await buildKeyProjectInitialFromNonInvestmentDetail(detail, loadProjType813Tree);
      setKeyProjectApplyInitialRecord(initial);
      setKeyProjectApplyModalOpen(true);
    } catch (error) {
      console.error('获取增资扩产项目信息失败:', error);
      await handleApiError(error);
    }
  };

  const openProgressModal = async (recordId: string) => {
    setProgressRecordId(recordId);
    progressForm.resetFields();
    try {
      const data = await primeApi.getProjectNonInvestmentConfirmation({ id: recordId });
      progressForm.setFieldsValue({
        landUseType: data.landUseType || undefined,
        landSupplyProgress: data.landSupplyProgress || undefined,
        environmentalAssessment: data.environmentalAssessment || undefined,
        safetyAssessment: data.safetyAssessment || undefined,
        energyAssessment: data.energyAssessment || undefined,
        constructionDrawingReview: data.constructionDrawingReview || undefined,
        constructionPermitStatus: data.constructionPermitStatus || undefined,
        remarks: data.remarks || undefined,
      });
    } catch (error) {
      console.error('获取项目进度详情失败:', error);
      await handleApiError(error);
      return;
    }
    setIsProgressModalOpen(true);
  };

  const handleWarehouseReviewCancel = () => {
    setWarehouseReviewModalOpen(false);
    setWarehouseReviewRecordId('');
    setWarehouseReviewDetail(null);
    warehouseReviewForm.resetFields();
  };

  const openWarehouseReviewModal = async (recordId: string) => {
    setWarehouseReviewRecordId(recordId);
    setWarehouseReviewDetail(null);
    warehouseReviewForm.resetFields();
    setWarehouseReviewModalOpen(true);
    setWarehouseReviewLoading(true);
    try {
      const data = await primeApi.getProjectNonInvestmentConfirmation({ id: recordId });
      setWarehouseReviewDetail(data);
    } catch (error) {
      console.error('获取项目详情失败:', error);
      await handleApiError(error);
      setWarehouseReviewModalOpen(false);
    } finally {
      setWarehouseReviewLoading(false);
    }
  };

  /** 列表点击项目名称：弹窗查看详情（原「查看」跳转改为名称点击） */
  const openProjectViewDetailModal = async (recordId: string) => {
    try {
      const data = await primeApi.getProjectNonInvestmentConfirmation({ id: recordId });
      setViewDetailData(data);
      setIsModalOpen3(true);
    } catch (error) {
      console.error('获取项目详情失败:', error);
      await handleApiError(error);
    }
  };

  const handleWarehouseReviewSubmit = async () => {
    try {
      const values = await warehouseReviewForm.validateFields();
      if (!warehouseReviewRecordId) {
        message.warning('缺少项目标识');
        return;
      }
      const opinion = values.opinionType;
      if (opinion !== '通过' && opinion !== '退回') {
        message.warning('请选择意见类型');
        return;
      }
      setWarehouseReviewSubmitting(true);
      const trimmedComments = values.comments?.trim();
      await primeApi.reviewProjectInvestment({
        id: warehouseReviewRecordId,
        projectNonInvestmentConfirmationDto: {
          rkStat: WAREHOUSE_REVIEW_OPINION_RK_STAT[opinion],
          ...(trimmedComments ? { comments: trimmedComments } : {}),
        } as ProjectNonInvestmentConfirmationDto,
      });
      message.success('提交成功');
      handleWarehouseReviewCancel();
      void fetchData({
        ...getSearchFilters(),
        page: pagination.current,
        size: pagination.pageSize,
      });
    } catch (error) {
      if ((error as any)?.errorFields) return;
      await handleApiError(error);
    } finally {
      setWarehouseReviewSubmitting(false);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const normFile2 = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const props: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    // maxCount: 1,
    fileList: fileList,
    onChange({ file, fileList }) {
      setIsUploading(true);
      setFileList(fileList);
      if (file.status !== 'uploading') {
        console.log(file, fileList);
        setIsUploading(false);
      }
    },
  };

  const props2: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    accept: '.jpg,.png,.jpeg,.webp',
    // maxCount: 1,
    fileList: fileList2,
    onChange({ file, fileList }) {
      setIsUploading2(true);
      setFileList2(fileList);
      if (file.status !== 'uploading') {
        console.log(file, fileList);
        setIsUploading2(false);
      }
    },
  };

  const commencementFileProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    fileList: commencementFileList,
    onChange({ file, fileList }) {
      if (file.status === 'done' && file.response) {
        // 处理上传成功后的响应
        const response = Array.isArray(file.response) ? file.response[0] : file.response;
        if (response) {
          const updatedFileList = fileList.map(f => {
            if (f.uid === file.uid) {
              return {
                ...f,
                response: [{ url: response.url || response.path, path: response.path || response.url, name: response.name || f.name }],
              };
            }
            return f;
          });
          setCommencementFileList(updatedFileList);
          return;
        }
      }
      setCommencementFileList(fileList);
    },
  };

  const commencementProgressImagesProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    accept: '.jpg,.png,.jpeg,.webp',
    fileList: commencementProgressImagesList,
    onChange({ file, fileList }) {
      if (file.status === 'done' && file.response) {
        // 处理上传成功后的响应
        const response = Array.isArray(file.response) ? file.response[0] : file.response;
        if (response) {
          const updatedFileList = fileList.map(f => {
            if (f.uid === file.uid) {
              return {
                ...f,
                response: [{ url: response.url || response.path, path: response.path || response.url, name: response.name || f.name }],
              };
            }
            return f;
          });
          setCommencementProgressImagesList(updatedFileList);
          return;
        }
      }
      setCommencementProgressImagesList(fileList);
    },
  };

  const completionFileProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    fileList: completionFileList,
    onChange({ file, fileList }) {
      if (file.status === 'done' && file.response) {
        // 处理上传成功后的响应
        const response = Array.isArray(file.response) ? file.response[0] : file.response;
        if (response) {
          const updatedFileList = fileList.map(f => {
            if (f.uid === file.uid) {
              return {
                ...f,
                response: [{ url: response.url || response.path, path: response.path || response.url, name: response.name || f.name }],
              };
            }
            return f;
          });
          setCompletionFileList(updatedFileList);
          return;
        }
      }
      setCompletionFileList(fileList);
    },
  };

  const resetProjectCodeState = () => {
    setProjectCodeDuplicate(false);
    setProjectCodeHint('');
    setIsAutoFillLocked(false);
    setAutoFillNullMap({});
    // 注意：不在此清除 isOnlineApprovalEditLocked，避免编辑拉详情后被重置；改在取消/新增/清空查询态时清
  };

  const handleProjectCodeChange = () => {
    resetProjectCodeState();
    setAddModalProjectCodeQueryToken(null);
  };

  const fillFormByOnlineApproval = (detail: ProjectOnlineApprovalVo) => {
    const { nullMap, patch } = buildOnlineApprovalPatchAndNullMapFromDetail(detail);
    const merged = {
      ...form2.getFieldsValue(),
      ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)),
    };
    clearOnlineApprovalEditLock();
    form2.setFieldsValue(merged);
    setIsAutoFillLocked(true);
    setAutoFillNullMap(nullMap);
  };

  const fetchOnlineApprovalDetail = async (projectCode: string) => {
    try {
      const detail = await primeApi.getProjectOnlineApprovalByCode({ code: projectCode });
      if (detail) {
        fillFormByOnlineApproval(detail);
        setOnlineApprovalDetail(detail);
        message.success('已从项目在线审批系统自动回填项目信息');
      } else {
        setIsAutoFillLocked(false);
        setAutoFillNullMap({});
        message.warning('未找到对应的在线审批项目信息，未执行自动填写');
      }
    } catch (error) {
      console.error('获取在线审批项目信息失败:', error);
      setIsAutoFillLocked(false);
      setAutoFillNullMap({});
      await handleApiError(error);
    }
  };

  /** 编辑弹窗：仅刷新当前不可编辑（在线审批同步）字段为最新在线审批数据 */
  const handleEditLockedFieldsRefreshClick = async () => {
    if (!isUpdata) return;
    if (!editModalIsOnlineApproval) return;
    if (!mergedApprovalFieldLock.active) {
      message.warning('当前项目无在线审批同步的只读字段，无需更新');
      return;
    }
    const code = String(form2.getFieldValue('code') ?? '').trim();
    if (!code) {
      message.warning('项目代码为空，无法拉取在线审批');
      return;
    }
    const wasLocked = (key: string) =>
      mergedApprovalFieldLock.active && !mergedApprovalFieldLock.nullMap[key];

    try {
      setRefreshingLockedFields(true);
      const detail = await primeApi.getProjectOnlineApprovalByCode({ code });
      if (!detail) {
        message.warning('未找到对应的在线审批项目信息');
        return;
      }
      const { nullMap: freshNullMap, patch } = buildOnlineApprovalPatchAndNullMapFromDetail(detail);
      const toApply: Record<string, any> = {};

      for (const key of ONLINE_APPROVAL_SYNC_FORM_KEYS) {
        if (!wasLocked(key)) continue;
        const v = patch[key];
        if (v !== undefined) {
          toApply[key] = v;
        } else if (key === 'startDateCommit') {
          toApply[key] = undefined;
        } else {
          toApply[key] = '';
        }
      }

      form2.setFieldsValue({
        ...form2.getFieldsValue(),
        ...toApply,
      });
      setOnlineApprovalDetail(detail);

      const nullFragment: Record<string, boolean> = {};
      for (const key of ONLINE_APPROVAL_SYNC_FORM_KEYS) {
        nullFragment[key] = freshNullMap[key];
      }
      if (isOnlineApprovalEditLocked) {
        setServerOnlineApprovalNullMap((prev) => ({ ...prev, ...nullFragment }));
      }
      if (isAutoFillLocked) {
        setAutoFillNullMap((prev) => ({ ...prev, ...nullFragment }));
      }

      message.success('已根据在线审批更新只读字段');
    } catch (error) {
      console.error('刷新在线审批字段失败:', error);
      await handleApiError(error);
    } finally {
      setRefreshingLockedFields(false);
    }
  };

  const handleProgressSubmit = async () => {
    if (!progressRecordId) {
      message.error('未获取项目ID，无法提交进度');
      return;
    }
    try {
      const values = await progressForm.validateFields();
      await primeApi.updateProjectNonInvestmentConfirmation({
        id: progressRecordId,
        projectNonInvestmentConfirmationDto: values,
      });
      message.success('项目进度已更新');
      progressForm.resetFields();
      handleProgressModalCancel();
      void fetchData({
        ...getSearchFilters(),
        page: pagination.current,
        size: pagination.pageSize,
      });
    } catch (error) {
      console.error('录入项目进度失败:', error);
      await handleApiError(error);
    }
  };

  const goToInvestmentProjectDetail = async (projectCode: string) => {
    try {
      const res = await primeApi.listProjectDigitalInvestmentAttracting({
        projectCode,
        page: 1,
        size: 1,
        showAll: true,
      });
      const target = res.records?.[0];
      if (target?.id) {
        navigate(`/xmgl/xmjd?id=${target.id}`);
      } else {
        // message.warning('未找到对应的招商项目详情');
      }
    } catch (error) {
      console.error('跳转招商项目详情失败:', error);
      await handleApiError(error);
    }
  };

  /**
   * 项目代码「查询」接口返回后的分支处理。
   * @returns 是否在新增弹窗中视为「本次查询已完成」以允许后续提交（招商且关闭弹窗等为 false）。
   */
  const handleProjectCodeStatusResult = async (status: string | undefined, code: string): Promise<boolean> => {
    const trimmedStatus = status?.trim();
    if (!trimmedStatus || trimmedStatus === '未查询到该项目信息，手动填写') {
      resetProjectCodeState();
      return true;
    }

    if (trimmedStatus.includes('该项目已在在线审批系统存在，自动填写')) {
      setProjectCodeHint(trimmedStatus);
      setProjectCodeDuplicate(false);
      await fetchOnlineApprovalDetail(code);
      return true;
    }

    if (trimmedStatus.includes('该项目已在招商项目录入，请核对确认项目代码')) {
      message.warning(trimmedStatus);
      await goToInvestmentProjectDetail(code);
      if (!isUpdata) {
        handleCancel1();
        return false;
      }
      resetProjectCodeState();
      return true;
    }

    if (trimmedStatus.includes('该项目已在增资扩产项目录入，请核对确认项目代码')) {
      message.error(trimmedStatus);
      setProjectCodeHint(trimmedStatus);
      setProjectCodeDuplicate(true);
      return true;
    }

    setProjectCodeHint(trimmedStatus);
    return true;
  };

  const checkProjectCodeStatus = async (rawCode?: string) => {
    const code = rawCode?.trim();
    if (!code) {
      resetProjectCodeState();
      if (!isUpdata) setAddModalProjectCodeQueryToken(null);
      return;
    }
    if (isUpdata && code === originalProjectCode) {
      resetProjectCodeState();
      return;
    }
    try {
      setCheckingProjectCode(true);
      const res = await primeApi.existsProjectNonInvestmentConfirmation({ code });
      const shouldRecordQueryForAdd = await handleProjectCodeStatusResult(res?.value, code);
      if (!isUpdata && shouldRecordQueryForAdd) {
        setAddModalProjectCodeQueryToken(code);
      }
    } catch (error) {
      console.error('项目代码校验失败:', error);
      await handleApiError(error);
      resetProjectCodeState();
      if (!isUpdata) setAddModalProjectCodeQueryToken(null);
    } finally {
      setCheckingProjectCode(false);
    }
  };

  const handleProjectCodeCheckClick = async () => {
    await checkProjectCodeStatus(form2.getFieldValue('code'));
  };

  const TitleCom = ({ text, icon }: { text: string; icon: string }) => {
    const showIcon = Boolean(icon?.trim());
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {showIcon ? (
          <img style={{ width: '10px', marginRight: '5px' }} src={icon} alt="" />
        ) : null}
        <div>{text}</div>
      </div>
    );
  };

  const getSys = () => {
    const lx = typeof window !== 'undefined' ? (window as any).lx : undefined;
    if (lx?.device?.getSystemInfo) {
      lx.device.getSystemInfo({
      success: function (res: any) {
        if (res.systemType === 'iOS' || res.systemType === 'Android') {
          setCollapsed(!collapsed);
        }
      },
      fail: function (err: any) {
        console.log(err);
      },
    });
    }
  };

  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFinishFailed2: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  //创建非招商项目
  const createProjectNonInvestmentConfirmation = async (
    values: CreateProjectNonInvestmentConfirmationRequest,
  ) => {
    try {
      const data = await primeApi.createProjectNonInvestmentConfirmation(values);
      console.log('response---', data);
    } catch (error) {
      console.error(`创建非招商项目失败:`, error);
      await handleApiError(error);
    }
  };

  //编辑非招商项目
  const updateProjectNonInvestmentConfirmation = async (
    values: UpdateProjectNonInvestmentConfirmationRequest,
  ) => {
    try {
      const data = await primeApi.updateProjectNonInvestmentConfirmation(values);
      console.log('response---', data);
    } catch (error) {
      console.error(`编辑非招商项目失败:`, error);
      await handleApiError(error);
    }
  };

  //删除非招商项目
  const deleteProjectNonInvestmentConfirmation = async (id: string) => {
    const data = await primeApi.deleteProjectNonInvestmentConfirmation({ id: id });
    console.log('deleteProjectNonInvestmentConfirmation', data);
  };

  //查询非招商项目详情
  // 查询非招商项目详情
  const getProjectNonInvestmentConfirmation = async (id: string, listSaysOnlineApproval?: boolean) => {
    setFileList([]);
    setFileList2([]);
    const data = await primeApi.getProjectNonInvestmentConfirmation({ id: id });

    // 处理 kgzzcl - 数组元素可能是字符串（path）或对象
    if (data?.kgzzcl && Array.isArray(data.kgzzcl)) {
      const list = data.kgzzcl
        .filter((item: any) => item) // 过滤掉无效项
        .map((item: any) => {
          // 如果是字符串，直接使用；如果是对象，使用 path 属性
          const path = typeof item === 'string' ? item : (item.path || '');
          const name = typeof item === 'string'
            ? path.split('/').pop()?.split('?')[0] || '文件'
            : (item.name || path.split('/').pop()?.split('?')[0] || '文件');
          return {
            uid: `${Math.random().toString(36).substr(2, 9)}`,
            name,
            status: 'done' as const,
            url: path,
            response: [{ url: path, path: path, name }],
          };
        });
      setFileList(list);
    } else {
      setFileList([]);
    }

    // 处理 statisticalProjectPic（后端可能返回，类型定义中可能未包含）
    const statisticalProjectPic = (data as any)?.statisticalProjectPic;
    if (statisticalProjectPic && Array.isArray(statisticalProjectPic)) {
      const list2 = statisticalProjectPic
        .filter((item: any) => item && (item.path || item.name)) // 过滤掉无效项
        .map((item: any) => {
          const name = item.name || (item.path ? item.path.split('/').pop()?.split('?')[0] : '') || '图片';
          const path = item.path || '';
          return {
            uid: path || `${Math.random().toString(36).substr(2, 9)}`,
            name,
            status: 'done' as const,
            url: path,
            response: [{ url: path, path: path, name }],
          };
        });
      setFileList2(list2);
    } else {
      setFileList2([]);
    }

    const cat = resolveProjType813Catalog(
      data.approvalDate ? dayjs(data.approvalDate) : null,
      data.applicationTime ? dayjs(data.applicationTime) : null,
    );
    const treeData = await loadProjType813Tree(cat);

    const rawIndustryDir = data.industryDirection;
    let projTypeVal: string | undefined =
      rawIndustryDir !== undefined &&
      rawIndustryDir !== null &&
      String(rawIndustryDir).trim() !== ''
        ? String(rawIndustryDir).trim()
        : undefined;
    if (projTypeVal && !isIndustry813CodeLike(projTypeVal)) {
      const code = findSelectableProjTypeCodeByTitle(treeData, projTypeVal);
      if (code) projTypeVal = code;
    }

    // 设置表单值，映射后端字段到表单字段
    form2.setFieldsValue({
      name: data.projectName,
      code: data.projectCode,
      district: data.cityDistrict,
      park: data.park,
      projectAddress: data.projectAddress,
      uCode: data.unifiedSocialCreditCode,
      pzwh: data.approvalDepartment,
      recordNumber: data.recordNumber,
      pzrq: data.approvalDate ? dayjs(data.approvalDate) : undefined,
      startDateCommit: data.applicationTime ? dayjs(data.applicationTime) : undefined,
      investor: data.investor,
      investMoney: data.investmentAmount?.toString(),
      investmentType: data.investmentType,
      ifForeignCapital: data.ifForeignCapital,
      reportingUnit: data.department,
      bindustry: data.projectType,
      projType: projTypeVal,
      industryName: data.industryClassification,
      desc: data.mainProducts,
    });
  setOriginalProjectCode(data.projectCode || '');
  resetProjectCodeState();

    setEditModalIsOnlineApproval(data.isOnlineApproval === true);

    const onlineFlag = data.isOnlineApproval === true || listSaysOnlineApproval === true;
    if (onlineFlag) {
      setIsOnlineApprovalEditLocked(true);
      setServerOnlineApprovalNullMap(buildOnlineApprovalNullMapFromVo(data));
    } else {
      clearOnlineApprovalEditLock();
    }

    // ✅ 关键：手动触发 changeEnter，更新 isShowEnter 状态
    // 注意：changeEnter 需要从表单获取值，所以需要先设置表单值后再调用
    const formValues = form2.getFieldsValue();
    if (formValues.databaseInclusionStatus === true) {
      setIsShowEnter(true);
    } else {
      setIsShowEnter(false);
    }

    // 同步处理 district -> parkOptions
    if (data.cityDistrict) {
      updateParkOptionsByDistrict(data.cityDistrict);
    }
  };

  // 根据 parkId 查找园区名称
  const getParkNameById = (parkId: string): string => {
    if (!parkId || !areaData || areaData.length === 0) return '未知园区';

    // 遍历所属区县 -> 所属园区
    for (const district of areaData[0]?.children || []) {
      const found = district.children?.find(park => park.value === parkId);
      if (found) {
        return found.label; // 返回汉字名称
      }
    }
    return '未知园区';
  };

  const buildSubmitProjectDto = (v: FieldType, statusNum: 1 | 2): ProjectNonInvestmentConfirmationDto => {
    if (statusNum === 1) {
      const trimmed = (x?: string) => {
        const t = (x ?? '').trim();
        return t || undefined;
      };
      const optNum = (x?: string) => {
        const t = (x ?? '').toString().trim();
        if (!t) return undefined;
        const n = parseFloat(t);
        return Number.isNaN(n) ? undefined : n;
      };
      return {
        projectName: trimmed(v.name),
        projectCode: trimmed(v.code),
        cityDistrict: trimmed(v.district),
        park: trimmed(v.park),
        projectAddress: trimmed(v.projectAddress),
        approvalDepartment: trimmed(v.pzwh),
        recordNumber: trimmed(v.recordNumber),
        approvalDate: v.pzrq ? dayjsToApiDatePreservingCalendarDay(dayjs(v.pzrq)) : undefined,
        applicationTime: v.startDateCommit ? dayjsToApiDatePreservingCalendarDay(dayjs(v.startDateCommit)) : undefined,
        investor: trimmed(v.investor),
        investmentType: trimmed(v.investmentType),
        investmentAmount: optNum(v.investMoney),
        isForeignCapital: typeof v.ifForeignCapital === 'boolean' ? v.ifForeignCapital : undefined,
        department: trimmed(v.reportingUnit),
        projectType: trimmed(v.bindustry),
        industryDirection: trimmed(v.projType),
        industryClassification: trimmed(v.industryName),
        fixedAssetInvestment: optNum(v.fixedInvest),
        unifiedSocialCreditCode: trimmed(v.uCode),
        mainProducts: trimmed(v.desc),
        status: 1,
      };
    }
    return {
      projectName: v.name || '',
      projectCode: v.code || '',
      cityDistrict: v.district || '',
      park: v.park || '',
      projectAddress: v.projectAddress || '',
      approvalDepartment: v.pzwh || '',
      recordNumber: v.recordNumber || '',
      approvalDate: v.pzrq ? dayjsToApiDatePreservingCalendarDay(dayjs(v.pzrq)) : undefined,
      applicationTime: v.startDateCommit ? dayjsToApiDatePreservingCalendarDay(dayjs(v.startDateCommit)) : undefined,
      investor: v.investor || '',
      investmentType: v.investmentType || '',
      investmentAmount: v.investMoney ? parseFloat(v.investMoney as string) : 0,
      isForeignCapital: v.ifForeignCapital ?? false,
      department: v.reportingUnit || '',
      projectType: v.bindustry || '',
      industryDirection: v.projType || '',
      industryClassification: v.industryName || '',
      fixedAssetInvestment: v.fixedInvest ? parseFloat(v.fixedInvest as string) : 0,
      unifiedSocialCreditCode: v.uCode || '',
      mainProducts: v.desc || '',
      status: 2,
    };
  };

  const handleModalDraftSave = async () => {
    if (modalDraftSaving) return;
    const codeTrimDraft = String(form2.getFieldValue('code') ?? '').trim();
    const nameTrimDraft = String(form2.getFieldValue('name') ?? '').trim();
    const draftFieldErrors: { name: 'code' | 'name'; errors: string[] }[] = [];
    if (!codeTrimDraft) {
      draftFieldErrors.push({ name: 'code', errors: ['请输入项目代码'] });
    }
    if (!nameTrimDraft) {
      draftFieldErrors.push({ name: 'name', errors: ['请输入项目名称'] });
    }
    if (draftFieldErrors.length > 0) {
      form2.setFields(draftFieldErrors);
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
      setModalDraftSaving(true);
      const storeAll = form2.getFieldsValue(true) as FieldType;
      const requestData = buildSubmitProjectDto(storeAll, 1);
      if (isUpdata) {
        await primeApi.updateProjectNonInvestmentConfirmation({
          id,
          projectNonInvestmentConfirmationDto: requestData,
        });
      } else {
        await primeApi.createProjectNonInvestmentConfirmation({
          projectNonInvestmentConfirmationDto: requestData,
        });
      }
      message.success('草稿已暂存');
      setIsModalOpen1(false);
      form2.resetFields();
      setFileList([]);
      setFileList2([]);
      setParkOptions([]);
      resetProjectCodeState();
      clearOnlineApprovalEditLock();
      setOriginalProjectCode('');
      setAddModalProjectCodeQueryToken(null);
      setEditModalIsOnlineApproval(false);
      void fetchData({
        ...getSearchFilters(),
        page: pagination.current,
        size: pagination.pageSize,
      });
    } catch (error) {
      console.error('暂存草稿失败:', error);
      await handleApiError(error);
    } finally {
      setModalDraftSaving(false);
    }
  };

  const onFinish2: FormProps<FieldType>['onFinish'] = async (values) => {
    if (projectCodeDuplicate) {
      message.error(projectCodeHint || '项目代码已存在，无法提交');
      return;
    }
    if (!isUpdata) {
      const storeAllForCode = form2.getFieldsValue(true) as FieldType;
      const codeTrim = String(storeAllForCode.code ?? values.code ?? '')
        .trim();
      if (!addModalProjectCodeQueryToken || codeTrim !== addModalProjectCodeQueryToken) {
        message.error('请先点击项目代码右侧「查询」完成校验后再提交');
        return;
      }
    }
    /**
     * onFinish 的 values 在部分场景下不完整（例如 disabled 控件、自定义组件与收集时机），
     * 仅用 values 会导致缺失项被拼成 ''，后端可能表现为“修改未生效”。
     * getFieldsValue(true) 取 store 全量，再用 values 覆盖本次提交收集到的字段。
     */
    const storeAll = form2.getFieldsValue(true) as FieldType;
    const v = { ...storeAll, ...values };

    const requestData = buildSubmitProjectDto(v, 2);

    // 如果是编辑模式，直接调用更新接口
    if (isUpdata) {
      try {
        await primeApi.updateProjectNonInvestmentConfirmation({
          id: id,
          projectNonInvestmentConfirmationDto: requestData,
        });

        message.success('保存成功');
        setIsModalOpen1(false);
        form2.resetFields();
        setFileList([]);
        setFileList2([]);
        setParkOptions([]);
        resetProjectCodeState();
        clearOnlineApprovalEditLock();
        setOriginalProjectCode('');
        setAddModalProjectCodeQueryToken(null);
        setEditModalIsOnlineApproval(false);
        void fetchData({
          ...getSearchFilters(),
          page: pagination.current,
          size: pagination.pageSize,
        });
      } catch (error) {
        console.error('更新非招商项目失败:', error);
        await handleApiError(error);
      }
      return;
    }

    // 新增模式：直接调用接口
    try {
      await primeApi.createProjectNonInvestmentConfirmation({
        projectNonInvestmentConfirmationDto: requestData,
      });

      message.success('保存成功');
      setIsModalOpen1(false);
      form2.resetFields();
      setFileList([]);
      setFileList2([]);
      setParkOptions([]);
      resetProjectCodeState();
      clearOnlineApprovalEditLock();
      setOriginalProjectCode('');
      setAddModalProjectCodeQueryToken(null);
      setEditModalIsOnlineApproval(false);
      void fetchData({
        ...getSearchFilters(),
        page: pagination.current,
        size: pagination.pageSize,
      });
    } catch (error) {
      console.error('创建非招商项目失败:', error);
      await handleApiError(error);
    }
  };

  const changeEnter: FormProps<FieldType>['onChange'] = () => {
    if (form2.getFieldsValue().databaseInclusionStatus === true) {
      setIsShowEnter(true);
    } else {
      setIsShowEnter(false);
    }
  };

  const progressLabelMap: Record<string, string> = {
    '1': '在谈',
    '2': '签约',
    '3': '注册',
    '4': '备案',
    '5': '报批',
    '6': '开工',
    '7': '竣工',
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
          await primeApi.deleteProjectNonInvestmentConfirmation({ id: recordId });
          message.success('删除成功');
          await fetchData(
            {
              ...getSearchFilters(),
              page: pagination.current,
              size: pagination.pageSize,
            },
            { draftList: listDraftBoxMode },
          );
        } catch (error) {
          await handleApiError(error);
        }
      },
    });
  };

  /** 超级管理员（角色 00 / canSuperAdmin）：正式列表「更多」中删除 */
  const confirmDeleteProjectRecord = (recordId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定删除该项目吗？删除后无法恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await primeApi.deleteProjectNonInvestmentConfirmation({ id: recordId });
          message.success('删除成功');
          await fetchData({
            ...getSearchFilters(),
            page: pagination.current,
            size: pagination.pageSize,
          });
        } catch (error) {
          await handleApiError(error);
        }
      },
    });
  };

  const columns = [
    {
      title: <TitleCom text={'序号'} icon={''} />,
      dataIndex: 'index',
      width: 80,
      render: (_: any, record: any, index: any) => {
        return index + 1;
      },
      align: 'center' as const,
    },
    {
      title: <TitleCom text={'项目名称'} icon={''} />,
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'left' as const,
      width: 150,
      ellipsis: { showTitle: false },
      render: (text: any, record: any) => {
        const display = String(text ?? record?.projectName ?? '').trim() || '-';
        const rid = record?.id as string | undefined;
        return (
          <span
            style={{
              display: 'block',
              width: 150,
              maxWidth: 150,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'left',
              cursor: rid && display !== '-' ? 'pointer' : undefined,
              color: rid && display !== '-' ? '#1890ff' : undefined,
            }}
            title={display}
            onClick={(e) => {
              if (!rid || display === '-') return;
              e.preventDefault();
              e.stopPropagation();
              navigate(`/xmgl/pro-other-start?id=${rid}`);
            }}
          >
            {display}
          </span>
        );
      },
    },
    {
      title: <TitleCom text={'项目属性'} icon={''} />,
      dataIndex: 'projectAttributeList',
      key: 'projectAttributeList',
      align: 'center' as const,
      width: 120,
      render: (_: unknown, record: any) => {
        const raw = record?.projectAttributeList;
        const list = Array.isArray(raw)
          ? raw.filter((x: unknown) => x !== null && x !== undefined && String(x).trim() !== '')
          : [];
        if (list.length === 0) return '-';
        return (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {list.map((txt: string, idx: number) => (
              <Tag
                key={`${String(txt)}-${idx}`}
                color={
                  String(txt).trim() === '市重点'
                    ? 'red'
                    : PROJECT_ATTRIBUTE_TAG_COLORS[idx % PROJECT_ATTRIBUTE_TAG_COLORS.length]
                }
              >
                {String(txt)}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: <TitleCom text={'所属板块'} icon={''} />,
      dataIndex: 'parkName',
      align: 'left' as const,
      ellipsis: true,
      key: 'parkName',
      width: 120,
    },
    {
      title: <TitleCom text={'项目进度'} icon={''} />,
      dataIndex: 'progressLabel',
      key: 'progressLabel',
      align: 'center' as const,
      width: 150,
      render: (text: any) => {
        if (text) {
          if (String(text).includes('在谈')) {
            return <Tag color="#FF7F50">{text}</Tag>;
          } else if (String(text).includes('签约')) {
            return <Tag color="#3CB371">{text}</Tag>;
          } else if (String(text).includes('注册')) {
            return <Tag color="#4169E1">{text}</Tag>;
          } else if (String(text).includes('备案')) {
            return <Tag color="#9370DB">{text}</Tag>;
          } else if (String(text).includes('开工')) {
            return <Tag color="#FF4500">{text}</Tag>;
          } else if (String(text).includes('报批')) {
            return <Tag color="#FF4500">{text}</Tag>;
          } else if (String(text).includes('竣工')) {
            return <Tag color="#708090">{text}</Tag>;
          } else {
            return <Tag color="blue">{text}</Tag>;
          }
        } else {
          return <Tag color="blue">-</Tag>;
        }
      },
    },
    {
      title: <TitleCom text={'投资额'} icon={''} />,
      dataIndex: 'investmentAmount',
      key: 'investmentAmount',
      align: 'center' as const,
      width: 150,
      render: (_: any, record: any) => {
        const investmentFlagLabel = record.investmentFlagLabel;
        let value: number | null = null;
        let unit: string = '';

        if (investmentFlagLabel === '内资') {
          value = record.totalInvestmentCny;
          unit = '亿元';
        } else if (investmentFlagLabel === '外资') {
          value = record.totalInvestmentUsd;
          unit = '亿美元';
        }

        if (value !== null && value !== undefined) {
          const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
          return `${formattedValue}${unit}`;
        }
        const v = record.investmentAmount;
        if (v === undefined || v === null || Number.isNaN(Number(v))) return '-';
        return `${Number(v).toLocaleString('zh-CN', {
          maximumFractionDigits: 2,
          useGrouping: false,
        })}万元`;
      },
    },
    {
      title: <TitleCom text={'项目简介'} icon={''} />,
      dataIndex: 'mainProducts',
      align: 'left' as const,
      key: 'mainProducts',
      width: 300,
      ellipsis: { showTitle: false },
      render: (text: any) => (
        <span
          style={{
            display: 'block',
            maxWidth: 300,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left',
          }}
          title={text}
        >
          {text}
        </span>
      ),
    },
    {
      title: <TitleCom text={'入库状态'} icon={''} />,
      dataIndex: 'rkStatName',
      key: 'rkStatName',
      align: 'center',
      width: 100,
    },
    {
      title: <TitleCom text={'是否列统'} icon={''} />,
      dataIndex: 'ifIncludedInDatabase',
      align: 'center' as const,
      key: 'ifIncludedInDatabase',
      width: 100,
      render: (val: any) => (val === true ? '是' : val === false ? '否' : '-'),
    },
    {
      title: <TitleCom text={'操作'} icon={''} />,
      align: 'center' as const,
      width: 320,
      minWidth: 260,
      fixed: 'right' as const,
      render: (text: any, record: any) => {
        const recordId = record.id as string;

        const openEditModal = async () => {
          setIsUpdata(true);
          setId(recordId);
          setModalDraftSaving(false);
          setIsModalOpen1(true);
          setEditModalIsOnlineApproval(record.isOnlineApproval === true);
          form2.resetFields();
          setFileList([]);
          setFileList2([]);
          resetProjectCodeState();
          setOriginalProjectCode('');
          setAddModalProjectCodeQueryToken(null);
          await getProjectNonInvestmentConfirmation(recordId, record.isOnlineApproval === true);
        };

        if (listDraftBoxMode) {
          return (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div
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
                  color: '#fff',
                }}
                key="edit-draft"
                onClick={() => void openEditModal()}
              >
                <div>编辑</div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
              </div>
              <div
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
                key="delete-draft"
                onClick={() => confirmDeleteDraft(recordId)}
              >
                <div>删除</div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
              </div>
            </div>
          );
        }

        const pillBase: React.CSSProperties = {
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '24px',
          background: '#1890FF',
          borderRadius: '12px',
          fontSize: '12px',
          color: '#fff',
        };

        const pillDanger: React.CSSProperties = {
          ...pillBase,
          background: '#ff4d4f',
        };

        const pillMutedStyle: React.CSSProperties = {
          background: '#bfbfbf',
          cursor: 'not-allowed',
        };

        const rkStat = Number(record?.rkStat);
        const progress = Number(record?.progress);
        const notWarehoused = rkStat !== 1;

        const commencementDisabled = !notWarehoused && progress > 5;
        const commencementMuted = notWarehoused || progress > 5;
        const completionDisabled = !notWarehoused && progress !== 6;
        const completionMuted = notWarehoused || progress !== 6;
        const warehouseReviewMuted = rkStat === 2;

        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* <div
              style={{
                ...pillBase,
                width: '85px',
              }}
              key="detail"
              onClick={() => {
                void openProjectViewDetailModal(recordId);
              }}
            >
              <div>详情</div>
              <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
            </div> */}

            {record?.isFilled !== true && (
              <div
                style={{
                  ...pillBase,
                  padding: '0 10px',
                  whiteSpace: 'nowrap',
                }}
                key="keyProjectApply"
                onClick={() => void openKeyProjectApplyModal(recordId)}
              >
                <div>申报重点项目</div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
              </div>
            )}

            <div
              style={{
                ...pillBase,
                padding: '0 10px',
                whiteSpace: 'nowrap',
              }}
              key="editLt"
              onClick={() => {
                setIsLtModalOpen(true);
                setLtEditingId(String(recordId ?? ''));
                ltForm.setFieldsValue({
                  ltCode: (record as any)?.ltCode ?? '',
                  isLt: (record as any)?.isLt,
                });
              }}
            >
              <div>编辑列统</div>
              <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
            </div>

            {Number(record?.rkStat) !== 1 && access.canWarehouseReview ? (
              <div
                style={{
                  ...pillBase,
                  ...(warehouseReviewMuted ? pillMutedStyle : null),
                  padding: '0 10px',
                  whiteSpace: 'nowrap',
                }}
                key="warehouseReview"
                onClick={() => {
                  if (warehouseReviewMuted) return;
                  void openWarehouseReviewModal(recordId);
                }}
              >
                <div>入库审核</div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
              </div>
            ) : null}

            {Number(record?.rkStat) !== 1 ? (
              <div
                style={{
                  ...pillBase,
                  padding: '0 10px',
                  whiteSpace: 'nowrap',
                }}
                key="edit"
                onClick={() => void openEditModal()}
              >
                <div>编辑</div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
              </div>
            ) : null}

            <div
              style={{
                ...pillBase,
                padding: '0 10px',
                whiteSpace: 'nowrap',
              }}
              key="progress"
              onClick={() => openProgressModal(recordId)}
            >
              <div>录入进度</div>
              <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
            </div>

            <div
              style={{
                ...pillBase,
                ...(commencementMuted ? pillMutedStyle : null),
                padding: '0 10px',
                whiteSpace: 'nowrap',
              }}
              key="commencement"
              onClick={() => {
                if (commencementDisabled) return;
                if (notWarehoused) {
                  message.warning(WAREHOUSE_OPERATION_TIP);
                  return;
                }
                if (progress > 5) return;
                void openCommencementModal(record as Record<string, unknown>);
              }}
            >
              <div>申请开工认定</div>
              <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
            </div>

            <div
              style={{
                ...pillBase,
                ...(completionMuted ? pillMutedStyle : null),
                padding: '0 10px',
                whiteSpace: 'nowrap',
              }}
              key="completion"
              onClick={() => {
                if (completionDisabled) return;
                if (notWarehoused) {
                  message.warning(WAREHOUSE_OPERATION_TIP);
                  return;
                }
                if (progress !== 6) return;
                void openCompletionModal(record as Record<string, unknown>);
              }}
            >
              <div>申请竣工认定</div>
              <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
            </div>

            {access.canSuperAdmin ? (
              <div
                style={{
                  ...pillDanger,
                  padding: '0 10px',
                  whiteSpace: 'nowrap',
                }}
                key="deleteProject"
                onClick={() => confirmDeleteProjectRecord(recordId)}
              >
                <div>删除</div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
              </div>
            ) : null}
          </div>
        );
      },
    },
  ];

  const [areaData, setAreaData] = useState<CascadeVoString[]>([]);
  const [districtOptions, setDistrictOptions] = useState<{ value: string; label: string }[]>([]);
  const [approvalDepartmentOptions, setApprovalDepartmentOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [parkOptions, setParkOptions] = useState<{ value: string; label: string }[]>([]);
  /** 列表查询：所属板块（园区），随查询表单「所属区县」联动 */
  const [searchParkOptions, setSearchParkOptions] = useState<{ value: string; label: string }[]>([]);
  const getAdministrativeDivisionTree = async () => {
    try {
      const res = await systemApi.getAdministrativeDivisionTree();
      setAreaData(res);
      console.log(res)
      const list =
        res[0]?.children?.map((item: any) => ({
          value: item.value ?? '',
          label: item.label ?? '',
        })) || [];
      setDistrictOptions(list);

      // 设置批准部门选项：在每个选项后面加上"数据局"，并添加"泰州市数据局"
      const approvalList =
        res[0]?.children?.map((item) => ({
          value: `${item.label}数据局`,
          label: `${item.label}数据局`,
        })) || [];
      // 添加"泰州市数据局"选项
      approvalList.unshift({
        value: '泰州市数据局',
        label: '泰州市数据局',
      });
      setApprovalDepartmentOptions(approvalList);
    } catch (error) {
      console.error('获取行政区划树失败:', error);
      await handleApiError(error);
    }
  };

  /** 仅根据所属区县刷新所属园区选项（编辑回显时不要清空已选园区） */
  const updateParkOptionsByDistrict = (value: string) => {
    const selectedDistrict = areaData[0]?.children?.find((d) => d.value === value);
    const parks =
      selectedDistrict?.children?.map((p) => ({
        value: p.value!,
        label: p.label,
      })) || [];
    setParkOptions(parks);
  };

  const updateSearchParkOptionsByDistrict = (value: string | undefined) => {
    if (!value) {
      setSearchParkOptions([]);
      return;
    }
    const selectedDistrict = areaData[0]?.children?.find((d) => d.value === value);
    const parks =
      selectedDistrict?.children?.map((p) => ({
        value: p.value!,
        label: p.label,
      })) || [];
    setSearchParkOptions(parks);
  };

  /** 新增/编辑弹窗内切换所属区县：刷新所属园区并清空园区选择（应作用于 form2，非查询表单） */
  const handleDistrictChangeInModal = (value: string) => {
    updateParkOptionsByDistrict(value);
    form2.setFieldValue('park', undefined);
  };

  const landUseOptions = [
    { label: '新增用地', value: '新增用地' },
    { label: '盘活用地', value: '盘活用地' },
    { label: '自有土地或厂房', value: '自有土地或厂房' },
    { label: '租用厂房', value: '租用厂房' },
    { label: '其他', value: '其他' },
  ];

  const landSupplyOptions = [
    { label: '成片开发方案阶段', value: '成片开发方案阶段' },
    { label: '征地拆迁阶段', value: '征地拆迁阶段' },
    { label: '土地挂牌阶段', value: '土地挂牌阶段' },
    { label: '土地摘牌', value: '土地摘牌' },
  ];

  const environmentalOptions = [
    { label: '环境影响报告书 已完成', value: '环境影响报告书 已完成' },
    { label: '环境影响报告表 已完成', value: '环境影响报告表 已完成' },
    { label: '环境影响登记表 已完成', value: '环境影响登记表 已完成' },
    { label: '未完成', value: '未完成' },
  ];

  const safetyOptions = [
    { label: '已完成', value: '已完成' },
    { label: '未完成', value: '未完成' },
  ];

  const energyOptions = [
    { label: '无需能评', value: '无需能评' },
    { label: '已完成', value: '已完成' },
    { label: '未完成', value: '未完成' },
  ];

  const drawingOptions = [
    { label: '无需施工图审查', value: '无需施工图审查' },
    { label: '已完成施工图审查', value: '已完成施工图审查' },
    { label: '未完成施工图审查', value: '未完成施工图审查' },
  ];

  const permitOptions = [
    { label: '无需施工许可', value: '无需施工许可' },
    { label: '未取得施工许可', value: '未取得施工许可' },
    { label: '已取得施工许可', value: '已取得施工许可' },
  ];

  const [projTypeTreeData, setProjTypeTreeData] = useState<any[]>([]);
  const projType813CatalogRef = useRef<string>('');
  const [industryCategoryOptions, setIndustryCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [projectStageOptions, setProjectStageOptions] = useState<{ value: string; label: string }[]>([]);

  const fetchProjectStageOptions = async () => {
    try {
      const res = await systemApi.getDictItems({ catalog: 'non_invest_project_progress' });
      const opts =
        (Array.isArray(res) ? res : [])
          .filter((x: any) => x?.enabled !== false)
          .map((x: any) => ({
            value: String(x.value ?? x.code ?? '').trim(),
            label: String(x.label ?? x.value ?? x.code ?? '').trim(),
          }))
          .filter((o: any) => o.value && o.label);
      setProjectStageOptions(opts);
    } catch (e) {
      await handleApiError(e);
      setProjectStageOptions([]);
    }
  };

  const loadProjType813Tree = async (catalog: string) => {
    try {
      const res = await systemApi.getDictItems({ catalog });
      const treeData = buildProjType813TreeData(res as any[]);
      setProjTypeTreeData(treeData);
      projType813CatalogRef.current = catalog;
      return treeData;
    } catch (e) {
      console.error('获取8+13+X字典失败:', e);
      await handleApiError(e);
      setProjTypeTreeData([]);
      return [];
    }
  };

  /** 批准日期 / 申请备案时间变化导致字典版本切换时，重载树并清空已选产业方向 */
  const maybeReloadProjType813Tree = async (pzrqVal?: Dayjs | null, startCommit?: Dayjs | null) => {
    const cat = resolveProjType813Catalog(
      pzrqVal,
      startCommit ?? (form2.getFieldValue('startDateCommit') as Dayjs | undefined),
    );
    if (cat !== projType813CatalogRef.current) {
      await loadProjType813Tree(cat);
      form2.setFieldValue('projType', undefined);
    }
  };

  const getIndustryCategoryOptions = async () => {
    try {
      const res = await systemApi.getDictItems({
        catalog: 'gg_industry_category',
      });
      const list = res?.map((p) => {
        // 将 value 和 label 拼接在一起作为 label
        const combinedLabel = `${p.value || ''}${p.label || ''}`;
        return {
          value: p.value || '',
          label: combinedLabel,
        };
      }) || [];
      setIndustryCategoryOptions(list);
    } catch (error) {
      console.error('获取行业代码选项失败:', error);
      await handleApiError(error);
      setIndustryCategoryOptions([]);
    }
  };

  useEffect(() => {
    void loadProjType813Tree(resolveProjType813Catalog());
    getIndustryCategoryOptions();
    fetchProjectStageOptions();
    getSys();
    getAdministrativeDivisionTree();
  }, []);

  useEffect(() => {
    if (!areaData.length) return;
    updateSearchParkOptionsByDistrict(initialDistrict || undefined);
  }, [areaData, initialDistrict]);

  // 初始列表加载（与 ProjectManage 一致：deps 为空[]）。开发环境 Strict Mode 会重复执行 effect，用 AbortController 取消前一次请求，避免两条完成的列表请求。
  useEffect(() => {
    const controller = new AbortController();
    void fetchData(
      {
        name: initialName,
        code: initialCode,
        content: initialContent.trim() || undefined,
        district: initialDistrict || undefined,
        park: initialPark || undefined,
        investor: initialInvestor.trim() || undefined,
        industryService: initialIndustryService.trim() || undefined,
        investmentType: initialInvestmentType || undefined,
        investmentNature: initialInvestmentNature,
        projectStage: initialProjectStage || undefined,
        isLt: initialIsLt,
        rkStat: initialRkStat,
        investmentAmount1:
          initialInvestmentRange !== undefined
            ? investmentRangeToApiAmounts(initialInvestmentRange).investmentAmount1
            : initialInvestmentAmountMin,
        investmentAmount2:
          initialInvestmentRange !== undefined
            ? investmentRangeToApiAmounts(initialInvestmentRange).investmentAmount2
            : initialInvestmentAmountMax,
        recordDate1: dayjsToApiDatePreservingCalendarDay(initialApplyDateRange?.[0]),
        recordDate2: dayjsToApiDatePreservingCalendarDay(initialApplyDateRange?.[1]),
        startDate1: dayjsToApiDatePreservingCalendarDay(initialStartDateRange?.[0]),
        startDate2: dayjsToApiDatePreservingCalendarDay(initialStartDateRange?.[1]),
        endDate1: dayjsToApiDatePreservingCalendarDay(initialEndDateRange?.[0]),
        endDate2: dayjsToApiDatePreservingCalendarDay(initialEndDateRange?.[1]),
        page: initialPage,
        size: initialPageSize,
      },
      { draftList: initialDraftFromUrl, signal: controller.signal },
    );
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 刻意仅在挂载时按首屏 URL 拉取一次，与 ProjectManage 一致
  }, []);

  // 不在此根据 URL 反复 setFieldsValue：点击「查询」后 setSearchParams 与渲染时序可能导致用旧 searchParams 覆盖表单，出现选项被清空；首次进页依赖 Form initialValues 即可。

  return (
    <div
      style={{
        display: 'flex',
        minWidth: 0,
        width: '100%',
      }}
    >
      {/*<OrgStruct setOrgId={setOrgId} setOption={setOption} option={option} responsive={collapsed} />*/}
      <PageContainer
        style={{
          width: '100%',
          minWidth: 0,
          height: '90vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content="欢迎使用增资扩产模块"
      >
        <div
          style={{
            padding: '20px',
            backgroundColor: 'white',
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
          }}
        >
          <div
            style={{
              padding: '20px',
              backgroundImage: 'url(/pm-bg1.png)',
              backgroundSize: '100% 100%',
            }}
          >
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <div
                style={{
                  marginRight: '10px',
                  width: ' 5px',
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
              initialValues={{
                remember: true,
                name: initialName,
                code: initialCode,
                content: initialContent.trim() || undefined,
                district: initialDistrict || undefined,
                park: initialPark || undefined,
                investor: initialInvestor.trim() || undefined,
                industryService: initialIndustryService.trim() || undefined,
                investmentType: initialInvestmentType || undefined,
                investmentAmountRange: initialInvestmentRange ?? 'all',
                applyDateRange: initialApplyDateRange,
                startDateRange: initialStartDateRange,
                endDateRange: initialEndDateRange,
                investmentNature: initialInvestmentNature,
                projectStage: initialProjectStage || undefined,
                isLt: initialIsLt,
                rkStat: initialRkStat,
              }}
              onFinish={onFinish1}
              onFinishFailed={onFinishFailed1}
              autoComplete="off"
            >
              {!showMoreSearch ? (
                <Form.Item<FieldType> name="district" preserve hidden>
                  <Select
                    allowClear
                    placeholder="全部"
                    options={districtOptions}
                    onChange={(v) => {
                      updateSearchParkOptionsByDistrict(v);
                      form.setFieldValue('park', undefined);
                    }}
                  />
                </Form.Item>
              ) : null}
              {chunkSearchCols(
                [
                  <Col span={6} key="name">
                    <Form.Item<FieldType> label="项目名称" name="name">
                      <Input allowClear />
                    </Form.Item>
                  </Col>,
                  <Col span={6} key="content">
                    <Form.Item<FieldType> label="项目内容" name="content">
                      <Input allowClear />
                    </Form.Item>
                  </Col>,
                  <Col span={6} key="code">
                    <Form.Item<FieldType> label="项目代码" name="code">
                      <Input allowClear />
                    </Form.Item>
                  </Col>,
                  <Col span={6} key="investmentType">
                    <Form.Item<FieldType> label="备案投资类型" name="investmentType">
                      <Select
                        allowClear
                        placeholder="全部"
                        style={{ width: '100%' }}
                        options={[
                          { label: '增资扩产', value: '增资扩产' },
                          { label: '外资利润再投资', value: '外资利润再投资' },
                          { label: '其他', value: '其他' },
                        ]}
                      />
                    </Form.Item>
                  </Col>,
                  <Col span={6} key="investmentNature">
                    <Form.Item<FieldType> label="投资类型" name="investmentNature">
                      <Select
                        allowClear
                        placeholder="全部"
                        options={[
                          { value: false, label: '内资' },
                          { value: true, label: '外资' },
                        ]}
                      />
                    </Form.Item>
                  </Col>,
                  <Col span={6} key="industryService">
                    <Form.Item<FieldType> label="产业类别" name="industryService">
                      <Select
                        allowClear
                        placeholder="全部"
                        options={[
                          { value: '2', label: '工业' },
                          { value: '1', label: '服务业' },
                        ]}
                      />
                    </Form.Item>
                  </Col>,
                  <Col span={6} key="projectStage">
                    <Form.Item<FieldType> label="项目进度" name="projectStage">
                      <Select allowClear placeholder="全部" options={projectStageOptions} />
                    </Form.Item>
                  </Col>,
                  <Col span={6} key="investmentAmountRange">
                    <Form.Item<FieldType>
                      label={<span style={{ whiteSpace: 'nowrap' }}>计划总投资</span>}
                      name="investmentAmountRange"
                    >
                      <Select
                        style={{ width: '100%' }}
                        placeholder="全部"
                        options={[
                          { value: 'all', label: '全部' },
                          { value: 'above50000', label: '5亿元以上' },
                          { value: 'above10000', label: '1亿元以上' },
                          { value: 'mid500to10000', label: '500万元-1亿元' },
                          { value: 'below500', label: '500万元以下' },
                        ]}
                      />
                    </Form.Item>
                  </Col>,
                  ...(showMoreSearch
                    ? [
                        <Col span={6} key="district">
                          <Form.Item<FieldType> label="所属市（区）" name="district" preserve>
                            <Select
                              allowClear
                              placeholder="全部"
                              options={districtOptions}
                              onChange={(v) => {
                                updateSearchParkOptionsByDistrict(v);
                                form.setFieldValue('park', undefined);
                              }}
                            />
                          </Form.Item>
                        </Col>,
                        <Col span={6} key="park">
                          <Form.Item<FieldType> label="所属板块" name="park" preserve>
                            <Select
                              allowClear
                              showSearch
                              optionFilterProp="label"
                              placeholder={
                                searchParkOptions.length ? '请选择所属板块' : '请先选择所属市（区）'
                              }
                              options={searchParkOptions}
                            />
                          </Form.Item>
                        </Col>,
                        <Col span={6} key="investor">
                          <Form.Item<FieldType> label="投资方名称" name="investor" preserve>
                            <Input allowClear />
                          </Form.Item>
                        </Col>,
                        <Col span={6} key="applyDateRange">
                          <Form.Item<FieldType> label="备案时间" name="applyDateRange" preserve>
                            <RangePicker
                              style={{ width: '100%' }}
                              format="YYYY-MM-DD"
                              allowClear
                              placeholder={['开始日期', '结束日期']}
                            />
                          </Form.Item>
                        </Col>,
                        <Col span={6} key="startDateRange">
                          <Form.Item<FieldType> label="开工时间" name="startDateRange" preserve>
                            <RangePicker
                              style={{ width: '100%' }}
                              format="YYYY-MM-DD"
                              allowClear
                              placeholder={['开始日期', '结束日期']}
                            />
                          </Form.Item>
                        </Col>,
                        <Col span={6} key="endDateRange">
                          <Form.Item<FieldType> label="竣工时间" name="endDateRange" preserve>
                            <RangePicker
                              style={{ width: '100%' }}
                              format="YYYY-MM-DD"
                              allowClear
                              placeholder={['开始日期', '结束日期']}
                            />
                          </Form.Item>
                        </Col>,
                        <Col span={6} key="isLt">
                          <Form.Item<FieldType> label="是否列统项目" name="isLt" preserve>
                            <Select
                              allowClear
                              placeholder="全部"
                              options={[
                                { value: true, label: '是' },
                                { value: false, label: '否' },
                              ]}
                            />
                          </Form.Item>
                        </Col>,
                        <Col span={6} key="rkStat">
                          <Form.Item<FieldType> label="入库状态" name="rkStat" preserve>
                            <Select
                              allowClear
                              placeholder="全部"
                              options={RK_STAT_SEARCH_OPTIONS}
                            />
                          </Form.Item>
                        </Col>,
                      ]
                    : []),
                ],
                4,
              ).map((cols, rowIdx) => (
                <Row key={rowIdx} gutter={16}>
                  {cols}
                </Row>
              ))}
              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Form.Item style={{ marginTop: '20px', marginBottom: 0 }}>
                    <Space>
                      <Button
                        type="primary"
                        size="middle"
                        onClick={() => {
                          form2.resetFields();
                          setIsUpdata(false);
                          setModalDraftSaving(false);
                          setIsModalOpen1(true);
                          setParkOptions([]);
                          setFileList([]);
                          setFileList2([]);
                          resetProjectCodeState();
                          clearOnlineApprovalEditLock();
                          setOriginalProjectCode('');
                          setAddModalProjectCodeQueryToken(null);
                          setEditModalIsOnlineApproval(false);
                          void loadProjType813Tree(resolveProjType813Catalog());
                        }}
                      >
                        新增项目
                      </Button>
                      {SHOW_DRAFT_UI && (
                        <Button
                          type={listDraftBoxMode ? 'primary' : 'default'}
                          size="middle"
                          onClick={() => {
                            const next = !listDraftBoxMode;
                            setListDraftBoxMode(next);
                            const f = getSearchFilters();
                            const dateParams = getUrlDateFilters();
                            setPagination((p) => ({ ...p, current: 1 }));
                            updateUrlParams({
                              page: 1,
                              size: pagination.pageSize,
                              name: f.name,
                              code: f.code,
                              content: f.content,
                              district: f.district,
                              park: f.park,
                              investor: f.investor,
                              industryService: f.industryService,
                              investmentType: f.investmentType,
                              investmentAmount1: f.investmentAmount1,
                              investmentAmount2: f.investmentAmount2,
                              investmentNature: f.investmentNature,
                              projectStage: f.projectStage || '',
                              isLt: f.isLt,
                              rkStat: f.rkStat,
                              ...dateParams,
                              status: next,
                            });
                            void fetchData(
                              { ...f, page: 1, size: pagination.pageSize },
                              { draftList: next },
                            );
                          }}
                        >
                          草稿箱
                        </Button>
                      )}
                      <Button
                        type="primary"
                        size="middle"
                        loading={exporting}
                        onClick={() => void handleExportNonInvestmentList()}
                      >
                        导出
                      </Button>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      {!showMoreSearch ? (
                        <Button htmlType="button" onClick={() => setShowMoreSearchPersist(true)}>
                          更多查询
                        </Button>
                      ) : (
                        <Button htmlType="button" onClick={() => setShowMoreSearchPersist(false)}>
                          收起查询
                        </Button>
                      )}
                      <Button
                        htmlType="button"
                        onClick={() => {
                          form.resetFields();
                          setSearchParkOptions([]);
                          form.setFieldsValue({
                            name: undefined,
                            code: undefined,
                            content: undefined,
                            district: undefined,
                            park: undefined,
                            investor: undefined,
                            industryService: undefined,
                            investmentType: undefined,
                            investmentAmountRange: 'all',
                            applyDateRange: undefined,
                            startDateRange: undefined,
                            endDateRange: undefined,
                            investmentNature: undefined,
                            projectStage: undefined,
                            isLt: undefined,
                            rkStat: undefined,
                          });
                          setListDraftBoxMode(false);
                          setPagination((p) => ({ ...p, current: 1 }));
                          updateUrlParams({
                            page: 1,
                            size: pagination.pageSize,
                            name: '',
                            code: '',
                            investmentNature: undefined,
                            projectStage: '',
                            isLt: undefined,
                            rkStat: undefined,
                            recordDate1: undefined,
                            recordDate2: undefined,
                            startDate1: undefined,
                            startDate2: undefined,
                            endDate1: undefined,
                            endDate2: undefined,
                        });
                          void fetchData(
                            {
                              name: '',
                              code: '',
                              content: undefined,
                              district: undefined,
                              park: undefined,
                              investor: undefined,
                              industryService: undefined,
                              investmentType: undefined,
                              investmentNature: undefined,
                              projectStage: undefined,
                              isLt: undefined,
                              rkStat: undefined,
                              investmentAmount1: undefined,
                              investmentAmount2: undefined,
                              recordDate1: undefined,
                              recordDate2: undefined,
                              startDate1: undefined,
                              startDate2: undefined,
                              endDate1: undefined,
                              endDate2: undefined,
                              page: 1,
                              size: pagination.pageSize,
                            },
                            { draftList: false },
                          );
                      }}
                    >
                      重置
                    </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          {/*</Form>*/}
          <div
            style={{
              marginTop: 20,
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              overflowX: 'auto',
            }}
          >
            <Table
              style={{ marginTop: 0 }}
              scroll={{ x: 'max-content' }}
              rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
              rowKey={(record) => record.id}
              columns={columns}
              bordered={true}
              dataSource={dataSource}
              pagination={false}
            />
          </div>
          <Pagination
            showSizeChanger={false}
            current={pagination.current}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            onChange={(page, pageSize) => {
              const nextSize = pageSize ?? pagination.pageSize;
              setPagination((prev) => ({ ...prev, current: page, pageSize: nextSize }));
              const f = getSearchFilters();
              const dateParams = getUrlDateFilters();
              updateUrlParams({
                page,
                size: nextSize,
                name: f.name,
                code: f.code,
                content: f.content,
                district: f.district,
                park: f.park,
                investor: f.investor,
                industryService: f.industryService,
                investmentType: f.investmentType,
                investmentAmount1: f.investmentAmount1,
                investmentAmount2: f.investmentAmount2,
                investmentNature: f.investmentNature,
                projectStage: f.projectStage || '',
                isLt: f.isLt,
                rkStat: f.rkStat,
                ...dateParams,
                status: listDraftBoxMode,
              });
              void fetchData({ ...f, page, size: nextSize }, { draftList: listDraftBoxMode });
            }}
            style={{ marginTop: '16px' }} // 可选：添加一些样式间距以改善布局
          />
        </div>

        {/* 新增非招商项目 Modal */}
        <Modal
          width={1200}
          title={isUpdata ? '编辑项目' : '新增项目'}
          open={isModalOpen1}
          footer={null}
          onCancel={handleCancel1}
          destroyOnClose
          className={mergedApprovalFieldLock.active ? 'autoFillLockedModal' : undefined}
        >
          <style>{`
            /* 回显锁定时：加深 disabled 控件文字颜色 */
            .autoFillLockedModal .ant-input[disabled],
            .autoFillLockedModal .ant-input-number[disabled],
            .autoFillLockedModal .ant-input-textarea[disabled],
            .autoFillLockedModal .ant-picker input:disabled {
              color: rgba(0, 0, 0, 0.88) !important;
            }

            .autoFillLockedModal .ant-select-disabled .ant-select-selector {
              color: rgba(0, 0, 0, 0.88) !important;
            }

            .autoFillLockedModal .ant-picker-disabled {
              color: rgba(0, 0, 0, 0.88) !important;
            }
          `}</style>
          <Form
            form={form2}
            layout={'vertical'}
            style={{ maxWidth: 1200, padding: '20px 0' }}
            onFinish={onFinish2}
            onFinishFailed={onFinishFailed2}
            autoComplete="off"
          >
            <Descriptions column={2} bordered>
              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    项目代码
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="code"
                    rules={[
                      {
                        required: !(mergedApprovalFieldLock.active && mergedApprovalFieldLock.nullMap.code),
                        message: '请输入项目代码',
                      },
                    ]}
                  validateStatus={projectCodeDuplicate ? 'error' : projectCodeHint ? 'warning' : undefined}
                  help={projectCodeHint || undefined}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    placeholder="请输入项目代码"
                    onChange={handleProjectCodeChange}
                    addonAfter={
                      isUpdata ? (
                        editModalIsOnlineApproval ? (
                          <Button
                            type="link"
                            size="small"
                            loading={refreshingLockedFields}
                            onClick={() => void handleEditLockedFieldsRefreshClick()}
                            disabled={!mergedApprovalFieldLock.active}
                            title={
                              mergedApprovalFieldLock.active
                                ? '从项目在线审批同步最新数据到下方只读字段'
                                : '暂无可同步的只读字段'
                            }
                          >
                            更新
                          </Button>
                        ) : undefined
                      ) : (
                        <Button
                          type="link"
                          size="small"
                          loading={checkingProjectCode}
                          onClick={handleProjectCodeCheckClick}
                          disabled={mergedApprovalFieldLock.active}
                        >
                          查询
                        </Button>
                      )
                    }
                    disabled={approvalFieldDisabled('code')}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    备案投资类型
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="investmentType"
                  rules={[{ required: true, message: '请选择备案投资类型' }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    style={{ width: '100%' }}
                    placeholder="请选择备案投资类型"
                    options={[
                      { label: '增资扩产', value: '增资扩产' },
                      { label: '外资利润再投资', value: '外资利润再投资' },
                      { label: '其他', value: '其他' },
                    ]}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    产业方向（8+13+X）
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="projType"
                  rules={[{ required: true, message: '请选择产业方向（8+13+X）' }]}
                  style={{ marginBottom: 0 }}
                >
                  <TreeSelect
                    style={{ width: '100%' }}
                    placeholder='8+13+X具体产业类别（与项目管理模块重点项目申报一致）'
                    treeData={projTypeTreeData}
                    allowClear
                    showSearch
                    treeDefaultExpandAll
                    filterTreeNode={(input, node) =>
                      String(node.title ?? '').toLowerCase().includes(String(input).toLowerCase())
                    }
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    项目名称
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="name"
                  rules={[
                    {
                      required: !(mergedApprovalFieldLock.active && mergedApprovalFieldLock.nullMap.name),
                      message: '请输入项目名称',
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="请输入项目名称" disabled={approvalFieldDisabled('name')} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    所属区县
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="district"
                  rules={[{ required: true, message: '请选择所属区县' }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="请选择所属区县"
                    onChange={handleDistrictChangeInModal}
                    options={districtOptions}
                    showSearch
                    optionFilterProp="label"
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    所属园区
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="park"
                  rules={[{ required: true, message: '请选择所属园区' }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="请选择所属园区（可搜索镇街/园区）"
                    options={parkOptions}
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    项目地址
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="projectAddress"
                  rules={[
                    {
                      required: !(mergedApprovalFieldLock.active && mergedApprovalFieldLock.nullMap.projectAddress),
                      message: '请输入项目地址',
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                <Input placeholder="请输入项目地址" disabled={approvalFieldDisabled('projectAddress')} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    法人单位社会统一信用代码
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="uCode"
                  rules={[
                    {
                      required: !(mergedApprovalFieldLock.active && mergedApprovalFieldLock.nullMap.uCode),
                      message: '请输入法人单位社会统一信用代码',
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                <Input
                  placeholder="请输入法人单位社会统一信用代码"
                  disabled={approvalFieldDisabled('uCode')}
                />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    批准部门
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="pzwh"
                  rules={[{ required: true, message: '请选择批准部门' }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="下拉选择，三市三区数据局"
                    options={approvalDepartmentOptions}
                    showSearch
                    optionFilterProp="label"
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    批准日期
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="pzrq"
                  rules={[{ required: true, message: '请选择批准日期' }]}
                  style={{ marginBottom: 0 }}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="yyyymmdd"
                    format="YYYY-MM-DD"
                    onChange={(d) => void maybeReloadProjType813Tree(d, form2.getFieldValue('startDateCommit') as Dayjs | undefined)}
                  />
                </Form.Item>
              </Descriptions.Item>



              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    申请备案时间
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="startDateCommit"
                  rules={[
                    {
                      required: !(mergedApprovalFieldLock.active && mergedApprovalFieldLock.nullMap.startDateCommit),
                      message: '请选择申请备案时间',
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="yyyymmdd"
                    format="YYYY-MM-DD"
                    disabled={approvalFieldDisabled('startDateCommit')}
                    onChange={(d) => void maybeReloadProjType813Tree(form2.getFieldValue('pzrq') as Dayjs | undefined, d)}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    投资主体名称
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="investor"
                  rules={[
                    {
                      required: !(mergedApprovalFieldLock.active && mergedApprovalFieldLock.nullMap.investor),
                      message: '请输入投资主体名称',
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                <Input placeholder="请输入投资主体名称" disabled={approvalFieldDisabled('investor')} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    计划总投资
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="investMoney"
                  rules={[
                    {
                      required: !(mergedApprovalFieldLock.active && mergedApprovalFieldLock.nullMap.investMoney),
                      message: '请输入计划总投资金额（万元）',
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                <Input type="number" placeholder="请输入计划总投资金额（万元）" disabled={approvalFieldDisabled('investMoney')} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    投资类型
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="ifForeignCapital"
                  rules={[{ required: true, message: '请选择投资类型（内资或外资）' }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="请选择内资或外资"
                    options={[
                      { value: false, label: '内资' },
                      { value: true, label: '外资' },
                    ]}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    申报单位
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="reportingUnit"
                  rules={[
                    {
                      required: !(mergedApprovalFieldLock.active && mergedApprovalFieldLock.nullMap.reportingUnit),
                      message: '请输入申报单位',
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                <Input placeholder="请输入申报单位" disabled={approvalFieldDisabled('reportingUnit')} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    产业类别
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="bindustry"
                  rules={[{ required: true, message: '请选择产业类别' }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="请选择工业或服务业"
                    options={[
                      { value: '2', label: '工业' },
                      { value: '1', label: '服务业' },
                    ]}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    行业代码
                  </span>
                }
                span={1}
              >
                <Form.Item<FieldType>
                  name="industryName"
                  rules={[{ required: true, message: '请选择行业代码' }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="请选择国民经济行业分类代码"
                    options={industryCategoryOptions}
                    showSearch
                    optionFilterProp="label"
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    主要产品及产能
                  </span>
                }
                span={2}
              >
                <Form.Item<FieldType>
                  name="desc"
                  rules={[
                    {
                      required: !(mergedApprovalFieldLock.active && mergedApprovalFieldLock.nullMap.desc),
                      message: '请输入主要产品及产能',
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                <Input.TextArea
                  rows={4}
                  placeholder="请输入主要产品及产能"
                  disabled={approvalFieldDisabled('desc')}
                />
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>

            <Form.Item style={{ marginTop: '20px', textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCancel1}>取消</Button>
                {SHOW_DRAFT_UI && (!isUpdata || listDraftBoxMode) && (
                  <Button loading={modalDraftSaving} onClick={() => void handleModalDraftSave()}>
                    暂存草稿
                  </Button>
                )}
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="编辑列统"
          open={isLtModalOpen}
          onCancel={() => {
            setIsLtModalOpen(false);
            setLtEditingId('');
            ltForm.resetFields();
          }}
          onOk={async () => {
            try {
              const values = await ltForm.validateFields();
              await primeApi.updateProjectNonInvestmentConfirmation({
                id: ltEditingId,
                projectNonInvestmentConfirmationDto: {
                  isLt: values?.isLt as boolean,
                  ltCode: values?.ltCode ?? '',
                } as any,
              });
              message.success('提交成功');
              setIsLtModalOpen(false);
              setLtEditingId('');
              ltForm.resetFields();
              void fetchData({
                ...getSearchFilters(),
                page: pagination.current,
                size: pagination.pageSize,
              });
            } catch (error) {
              // 表单校验失败：不走接口错误提示
              if ((error as any)?.errorFields) return;
              await handleApiError(error);
            }
          }}
          okText="提交"
          cancelText="取消"
          destroyOnClose
        >
          <Form form={ltForm} layout="vertical" preserve={false}>
            <Form.Item
              label="是否列统项目"
              name="isLt"
              rules={[{ required: true, message: '请选择是否列统项目' }]}
            >
              <Select
                placeholder="请选择"
                options={[
                  { value: true, label: '是' },
                  { value: false, label: '否' },
                ]}
              />
            </Form.Item>
            <Form.Item label="列统代码" name="ltCode">
              <Input placeholder="填写（非必填）" />
            </Form.Item>
          </Form>
        </Modal>

        {/* 查看详情 Modal */}
        <Modal
          width={1200}
          title="项目详情"
          open={isModalOpen3}
          footer={[
            <Button key="close" onClick={handleCancel3}>
              关闭
            </Button>,
          ]}
          onCancel={handleCancel3}
          destroyOnClose
        >
          {viewDetailData && (
            <Descriptions column={2} bordered>
              <Descriptions.Item label="项目代码" span={1}>
                {viewDetailData.projectCode || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="备案投资类型" span={1}>
                {viewDetailData.investmentType || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="产业方向（8+13+X）" span={1}>
                {viewDetailData.industryDirectionLabel || viewDetailData.industryDirection || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="项目名称" span={1}>
                {viewDetailData.projectName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="所属区县" span={1}>
                {viewDetailData.districtName || viewDetailData.cityDistrict || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="所属园区" span={1}>
                {viewDetailData.parkName || viewDetailData.park || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="项目地址" span={1}>
                {viewDetailData.projectAddress || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="法人单位社会统一信用代码" span={1}>
                {viewDetailData.unifiedSocialCreditCode || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="批准部门" span={1}>
                {viewDetailData.approvalDepartment || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="批准日期" span={1}>
                {viewDetailData.approvalDate
                  ? dayjs(viewDetailData.approvalDate).format('YYYY-MM-DD')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="申请备案时间" span={1}>
                {viewDetailData.applicationTime
                  ? dayjs(viewDetailData.applicationTime).format('YYYY-MM-DD')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="投资主体名称" span={1}>
                {viewDetailData.investor || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="计划总投资" span={1}>
                {viewDetailData.investmentAmount !== null && viewDetailData.investmentAmount !== undefined ? `${viewDetailData.investmentAmount}万元` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="投资类型" span={1}>
                {viewDetailData.ifForeignCapital === true ? '外资' : viewDetailData.ifForeignCapital === false ? '内资' : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="申报单位" span={1}>
                {viewDetailData.department || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="产业类别" span={1}>
                {viewDetailData.projectType === '1'
                  ? '服务业'
                  : viewDetailData.projectType === '2'
                  ? '工业'
                  : viewDetailData.projectType || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="行业代码" span={1}>
                {viewDetailData.industryClassification || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="主要产品及产能" span={2}>
                {viewDetailData.mainProducts || '-'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>

        <Modal
          width={900}
          title="在线审批项目信息"
          open={isOnlineApprovalModalOpen}
          footer={[
            <Button
              key="close-online"
              onClick={() => {
                setIsOnlineApprovalModalOpen(false);
                setOnlineApprovalDetail(null);
              }}
            >
              关闭
            </Button>,
          ]}
          onCancel={() => {
            setIsOnlineApprovalModalOpen(false);
            setOnlineApprovalDetail(null);
          }}
          destroyOnClose
        >
          {onlineApprovalDetail ? (
            <Descriptions column={2} bordered>
              <Descriptions.Item label="项目代码" span={1}>
                {onlineApprovalDetail.projectCode || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="项目名称" span={1}>
                {onlineApprovalDetail.projectName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="审批类型" span={1}>
                {onlineApprovalDetail.approvalType || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="项目类型" span={1}>
                {onlineApprovalDetail.projectType || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="建设性质" span={1}>
                {onlineApprovalDetail.constructionNature || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="申报时间" span={1}>
                {onlineApprovalDetail.applicationTime
                  ? dayjs(onlineApprovalDetail.applicationTime).format('YYYY-MM-DD')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="建设地点" span={1}>
                {onlineApprovalDetail.constructionLocation || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="总投资（万元）" span={1}>
                {onlineApprovalDetail.totalInvestment ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="建设规模及内容" span={2}>
                {onlineApprovalDetail.constructionScaleAndContent || '-'}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <div>暂无在线审批数据</div>
          )}
        </Modal>

        <Modal
          width={1200}
          title="增资扩产入库审核"
          open={warehouseReviewModalOpen}
          onCancel={handleWarehouseReviewCancel}
          destroyOnClose
          footer={[
            <Button key="cancel" onClick={handleWarehouseReviewCancel}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={warehouseReviewSubmitting}
              onClick={() => void handleWarehouseReviewSubmit()}
            >
              提交
            </Button>,
          ]}
        >
          <Spin spinning={warehouseReviewLoading}>
            {warehouseReviewDetail ? (
              <>
                <Descriptions
                  className={pmStyles.warehouseReviewModalDesc}
                  column={2}
                  bordered
                >
                  <Descriptions.Item label="项目代码" span={1}>
                    {warehouseReviewDetail.projectCode || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="备案投资类型" span={1}>
                    {warehouseReviewDetail.investmentType || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="产业方向（8+13+X）" span={1}>
                    {warehouseReviewDetail.industryDirectionLabel ||
                      warehouseReviewDetail.industryDirection ||
                      '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="项目名称" span={1}>
                    {warehouseReviewDetail.projectName || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="所属区县" span={1}>
                    {[warehouseReviewDetail.districtName, warehouseReviewDetail.cityDistrict]
                      .map((s) => (typeof s === 'string' ? s.trim() : ''))
                      .find(Boolean) || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="所属园区" span={1}>
                    {[warehouseReviewDetail.parkName, warehouseReviewDetail.park]
                      .map((s) => (typeof s === 'string' ? s.trim() : ''))
                      .find(Boolean) || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="项目地址" span={1}>
                    {warehouseReviewDetail.projectAddress || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="法人单位社会统一信用代码" span={1}>
                    {warehouseReviewDetail.unifiedSocialCreditCode || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="批准部门" span={1}>
                    {warehouseReviewDetail.approvalDepartment || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="批准日期" span={1}>
                    {warehouseReviewDetail.approvalDate
                      ? dayjs(warehouseReviewDetail.approvalDate).format('YYYY-MM-DD')
                      : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="申请备案时间" span={1}>
                    {warehouseReviewDetail.applicationTime
                      ? dayjs(warehouseReviewDetail.applicationTime).format('YYYY-MM-DD')
                      : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="投资主体名称" span={1}>
                    {warehouseReviewDetail.investor || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="计划总投资" span={1}>
                    {warehouseReviewDetail.investmentAmount ?? '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="投资类型" span={1}>
                    {warehouseReviewDetail.ifForeignCapital === true
                      ? '外资'
                      : warehouseReviewDetail.ifForeignCapital === false
                        ? '内资'
                        : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="申报单位" span={1}>
                    {warehouseReviewDetail.department || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="产业类别" span={1}>
                    {warehouseReviewDetail.projectType === '1'
                      ? '服务业'
                      : warehouseReviewDetail.projectType === '2'
                        ? '工业'
                        : warehouseReviewDetail.projectType || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="行业代码" span="filled">
                    {warehouseReviewDetail.industryClassification || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="主要产品及产能" span={2}>
                    {warehouseReviewDetail.mainProducts || '-'}
                  </Descriptions.Item>
                </Descriptions>
                <Form form={warehouseReviewForm} layout="vertical" style={{ marginTop: 16 }}>
                  <Form.Item
                    name="opinionType"
                    label="意见类型"
                    rules={[{ required: true, message: '请选择意见类型' }]}
                  >
                    <Radio.Group>
                      <Radio value="通过">通过</Radio>
                      <Radio value="退回">退回</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item name="comments" label="审核意见">
                    <Input.TextArea rows={4} placeholder="请输入审核意见" />
                  </Form.Item>
                </Form>
              </>
            ) : (
              !warehouseReviewLoading && <div>暂无数据</div>
            )}
          </Spin>
        </Modal>

        <Modal
          width={1000}
          title="录入项目进度"
          open={isProgressModalOpen}
          onCancel={handleProgressModalCancel}
          onOk={handleProgressSubmit}
          destroyOnClose
        >
          <Form form={progressForm} layout="vertical">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="用地类型" span={1}>
                <Form.Item name="landUseType" style={{ marginBottom: 0 }}>
                  <Select placeholder="从下拉列表中选择" options={landUseOptions} allowClear />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="供地进度" span={1}>
                <Form.Item name="landSupplyProgress" style={{ marginBottom: 0 }}>
                  <Select placeholder="从下拉列表中选择" options={landSupplyOptions} allowClear />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="环评进展" span={1}>
                <Form.Item name="environmentalAssessment" style={{ marginBottom: 0 }}>
                  <Select placeholder="从下拉列表中选择" options={environmentalOptions} allowClear />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="安评情况" span={1}>
                <Form.Item name="safetyAssessment" style={{ marginBottom: 0 }}>
                  <Select placeholder="从下拉列表中选择" options={safetyOptions} allowClear />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="能评情况" span={1}>
                <Form.Item name="energyAssessment" style={{ marginBottom: 0 }}>
                  <Select placeholder="从下拉列表中选择" options={energyOptions} allowClear />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="施工图审查情况" span={1}>
                <Form.Item name="constructionDrawingReview" style={{ marginBottom: 0 }}>
                  <Select placeholder="从下拉列表中选择" options={drawingOptions} allowClear />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="施工许可情况" span={1}>
                <Form.Item name="constructionPermitStatus" style={{ marginBottom: 0 }}>
                  <Select placeholder="从下拉列表中选择" options={permitOptions} allowClear />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>
                <Form.Item name="remarks" style={{ marginBottom: 0 }}>
                  <Input.TextArea placeholder="文本输入" rows={3} />
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>
          </Form>
        </Modal>

        <Modal
          width={900}
          title="开工认定"
          open={isCommencementModalOpen}
          onCancel={handleCommencementModalCancel}
          footer={[
            <Button key="cancel" onClick={handleCommencementModalCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={handleCommencementSubmit}>
              确定
            </Button>,
          ]}
          destroyOnClose
        >
          <div style={{ marginBottom: '16px', color: '#ff4d4f', fontSize: '14px' }}>
            请确认当前项目是否已开工。
          </div>
          <Form form={commencementForm} layout="vertical">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="项目代码" span={1}>
                <Form.Item name="projectCode" style={{ marginBottom: 0 }}>
                  <Input disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="项目名称" span={1}>
                <Form.Item name="projectName" style={{ marginBottom: 0 }}>
                  <Input disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="所属区县" span={1}>
                <Form.Item name="cityDistrict" style={{ marginBottom: 0 }}>
                  <Input disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="所属园区" span={1}>
                <Form.Item name="park" style={{ marginBottom: 0 }}>
                  <Input disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="主要产品及产能" span={2}>
                <Form.Item name="mainProducts" style={{ marginBottom: 0 }}>
                  <Input.TextArea rows={3} disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="开工日期" span={1}>
                <Form.Item
                  name="commencementDate"
                  style={{ marginBottom: 0 }}
                  rules={[{ required: true, message: '请选择开工日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="日期选择器" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="佐证资料" span={2}>
                <Form.Item
                  name="kgzzcl"
                  style={{ marginBottom: 0 }}
                  rules={[
                    {
                      validator: async () => {
                        if (commencementFileList?.length) return;
                        throw new Error('请上传佐证资料');
                      },
                    },
                  ]}
                >
                  <Upload {...commencementFileProps}>
                    <Button icon={<UploadOutlined />}>上传文件</Button>
                  </Upload>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="项目进展图片" span={2}>
                <Form.Item
                  name="progressImages"
                  style={{ marginBottom: 0 }}
                  rules={[
                    {
                      validator: async () => {
                        if (commencementProgressImagesList?.length) return;
                        throw new Error('请上传项目进展图片');
                      },
                    },
                  ]}
                >
                  <Upload {...commencementProgressImagesProps}>
                    <Button icon={<UploadOutlined />}>上传文件</Button>
                  </Upload>
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>
          </Form>
        </Modal>

        <ZzkcKeyProjectApplyModal
          open={keyProjectApplyModalOpen}
          initialRecord={keyProjectApplyInitialRecord ?? undefined}
          onCancel={() => {
            setKeyProjectApplyModalOpen(false);
            setKeyProjectApplyInitialRecord(null);
          }}
          onSuccess={() => {
            setKeyProjectApplyModalOpen(false);
            setKeyProjectApplyInitialRecord(null);
            void fetchData({
              ...getSearchFilters(),
              page: pagination.current,
              size: pagination.pageSize,
            });
          }}
        />

        <Modal
          width={900}
          title="竣工认定"
          open={isCompletionModalOpen}
          onCancel={handleCompletionModalCancel}
          footer={[
            <Button key="cancel" onClick={handleCompletionModalCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={handleCompletionSubmit}>
              确定
            </Button>,
          ]}
          destroyOnClose
        >
          <div style={{ marginBottom: '16px', color: '#ff4d4f', fontSize: '14px' }}>
            请确认当前项目是否已竣工。
          </div>
          <Form form={completionForm} layout="vertical">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="项目代码" span={1}>
                <Form.Item name="projectCode" style={{ marginBottom: 0 }}>
                  <Input disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="项目名称" span={1}>
                <Form.Item name="projectName" style={{ marginBottom: 0 }}>
                  <Input disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="所属区县" span={1}>
                <Form.Item name="cityDistrict" style={{ marginBottom: 0 }}>
                  <Input disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="所属园区" span={1}>
                <Form.Item name="park" style={{ marginBottom: 0 }}>
                  <Input disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="主要产品及产能" span={2}>
                <Form.Item name="mainProducts" style={{ marginBottom: 0 }}>
                  <Input.TextArea rows={3} disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="竣工日期" span={1}>
                <Form.Item name="endDate" style={{ marginBottom: 0 }} rules={[{ required: true, message: '请选择竣工日期' }]}>
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="日期选择器" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="佐证资料" span={2}>
                <Form.Item
                  name="jgzzcl"
                  style={{ marginBottom: 0 }}
                  rules={[
                    {
                      validator: async () => {
                        if (completionFileList?.length) return;
                        throw new Error('请上传佐证资料');
                      },
                    },
                  ]}
                >
                  <Upload {...completionFileProps}>
                    <Button icon={<UploadOutlined />}>上传文件</Button>
                  </Upload>
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>
          </Form>
        </Modal>

      </PageContainer>
    </div>
  );
};

export default ProjectManage7;




