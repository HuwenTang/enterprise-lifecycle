import { primeApi, systemApi } from '@/services/api';
import { UploadOutlined } from '@ant-design/icons';
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
  Radio,
  Row,
  Select,
  Space,
  Switch,
  TreeSelect,
  Upload,
  UploadProps,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  legacyUrlCsvFromItems,
  mergeZzclForSubmit,
  parseFileUploadResponse,
  serializeZzclForApi,
} from './attachmentApi';

export type AddFormType = {
  fgName?: string;
  projectSource?: string;
  projectName?: string;
  district?: string;
  park?: string;
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
  industryCategoryDisplay?: string;
  /** @deprecated 仅兼容旧数据回填，表单已改用 x */
  industrySubCategoryDisplay?: string;
  plannedInvestmentTypeDisplay?: string;
  plannedInvestmentAmountDisplay?: number;
  isPhasedDisplay?: string;
  amountPerPhaseDisplay?: number;
  constructionStartDateDisplay?: any;
  constructionEndDateDisplay?: any;
  taxPerMuDisplay?: number;
  projectTypeDisplay?: string;
  landTypeDisplay?: string;
  landProcedureStatusNewDisplay?: string;
  landProcedureStatusStockDisplay?: string;
  existingAreaUsageDisplay?: string;
  energyReviewCompletedDisplay?: string;
  energyReviewDocUrlDisplay?: string;
  eiaCompletedDisplay?: string;
  eiaDocUrlDisplay?: string;
  isFilingDisplay?: string;
  filingDocUrlDisplay?: string;
  hasSafetyApprovalDisplay?: string;
  safetyApprovalDocUrlDisplay?: string;
  inventionPatentCountDisplay?: number;
  utilityPatentCountDisplay?: number;
};

export interface KeyProjectApplyModalProps {
  open: boolean;
  onCancel: () => void;
  initialRecord?: any;
  onSuccess?: () => void;
}

/** ProjectKeyProjectDto.status：1 草稿（暂存），2 正文（正式提交） */
const PROJECT_KEY_PROJECT_STATUS_DRAFT = 1;
const PROJECT_KEY_PROJECT_STATUS_FORMAL = 2;

const KeyProjectApplyModal = ({ open, onCancel, initialRecord, onSuccess }: KeyProjectApplyModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalDraftSaving, setModalDraftSaving] = useState(false);
  const [districtOptions, setDistrictOptions] = useState<Array<{ value: string; label: string }>>([
    { value: '', label: '不限' },
  ]);
  const [areaData, setAreaData] = useState<any[]>([]);
  const [parkOptions, setParkOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [industrySubCategoryOptions, setIndustrySubCategoryOptions] = useState<
    Array<any>
  >([]);
  const [industryCategoryOptions, setIndustryCategoryOptions] = useState<{ value: string; label: string }[]>([]);

  const resolveIndustryDictCatalog = () => {
    const signingTime = initialRecord?.signingTime;
    const year = signingTime ? dayjs(signingTime).year() : NaN;
    // 2026年及以后使用新字典
    return Number.isFinite(year) && year >= 2026 ? '8_13_x_2026' : '8_13_X';
  };

  const isIndustryCodeLike = (val: any) => {
    const s = typeof val === 'string' ? val.trim() : '';
    // 字典 code：1.1.1.0 / 1.4.1.4，或独立大类 value 如 2（传统产业）
    return /^\d+(\.\d+)*$/.test(s);
  };

  const findSelectableCodeByTitle = (treeData: any[], title: string): string | undefined => {
    const t = (title ?? '').trim();
    if (!t) return undefined;

    for (const node of treeData ?? []) {
      // 优先找 title 精确匹配的节点；不区分 selectable（避免 initialRecord 只有大类名称时无法回显）
      if (String(node?.title ?? '').trim() === t) return node?.value;

      const children = node?.children;
      if (Array.isArray(children) && children.length) {
        const found: string | undefined = findSelectableCodeByTitle(children, t);
        if (found) return found;
      }
    }
    return undefined;
  };

  const buildIndustryTreeData = (items: any[]) => {
    const list = (Array.isArray(items) ? items : [])
      .filter((p) => p?.enabled !== false)
      .map((p) => ({
        code: String(p.value ?? p.code ?? '').trim(),
        label: String(p.label ?? p.value ?? p.code ?? '').trim(),
        sort: typeof p.sort === 'number' ? p.sort : 0,
      }))
      .filter((p) => p.code && p.label);

    // code 可能重复（后端数据存在同 code 不同 label），优先保留 label 更长的一条
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
      // 无 '.' 的顶级 code（如 2 传统产业）仅作独立根，勿挂到 parentClusterCodeOf 下，否则会挂到自己名下导致父节点不可选、无法回显
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

    // 如果存在无 '.' 的顶级项（如 code=2），也作为根节点展示（叶子）
    for (const item of deduped) {
      if (!item.code.includes('.')) {
        roots.push(item);
      }
    }

    // 去重 roots（避免同时被判定为 cluster 和顶级）
    const rootByCode = new Map<string, { code: string; label: string; sort: number }>();
    for (const r of roots) rootByCode.set(r.code, r);
    const rootList = Array.from(rootByCode.values()).sort((a, b) => a.sort - b.sort);

    const treeData = rootList.map((r) => {
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

    return treeData;
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
      console.error('获取行业分类选项失败:', error);
      setIndustryCategoryOptions([]);
    }
  };

  const getIndustrySubCategoryOptions = async () => {
    try {
      const catalog = resolveIndustryDictCatalog();
      const res = await systemApi.getDictItems({ catalog });
      const treeData = buildIndustryTreeData(res as any[]);
      setIndustrySubCategoryOptions(treeData);
    } catch (error) {
      console.error('获取8+13+X字典失败:', error);
      setIndustrySubCategoryOptions([]);
    }
  };

  const getDistrictOptions = async () => {
    try {
      const res = await systemApi.getAdministrativeDivisionTree();
      setAreaData(res);
      const list =
        res[0]?.children?.map((item: any) => ({
          value: item.value,
          label: item.label,
        })) || [];
      setDistrictOptions([{ value: '', label: '不限' }, ...list]);
    } catch (error) {
      console.error('获取区县字典失败:', error);
      setDistrictOptions([
        { value: '', label: '不限' },
        { value: '海陵', label: '海陵' },
        { value: '兴化', label: '兴化' },
        { value: '泰兴', label: '泰兴' },
        { value: '姜堰', label: '姜堰' },
        { value: '靖江', label: '靖江' },
      ]);
    }
  };

  const handleDistrictChange = (value: string) => {
    if (!value) {
      setParkOptions([]);
      form.setFieldValue('park', undefined);
      form.setFieldValue('constructionLocation', undefined);
      return;
    }
    const selectedDistrict = areaData[0]?.children?.find((d: any) => d.value === value);
    const parks =
      selectedDistrict?.children?.map((p: any) => ({
        value: p.value,
        label: p.label,
      })) || [];
    setParkOptions(parks);
    form.setFieldValue('park', undefined);
    form.setFieldValue('constructionLocation', undefined);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    const list = (e?.fileList ?? []) as any[];
    // 参照 ProjectManage7：上传成功后把 response 结构规范化，确保业务字段用真实 path，不被 url 兜底覆盖
    return list.map((f) => {
      if (f?.status !== 'done' || !f?.response) return f;
      const parsed = parseFileUploadResponse(f.response);
      if (!parsed?.path) return f;
      const normalized = {
        url: parsed.url || parsed.path,
        path: parsed.path, // 关键：只存真实 path
        name: parsed.name || f.name,
      };
      return { ...f, response: [normalized] };
    });
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

  useEffect(() => {
    getIndustryCategoryOptions();
    getDistrictOptions();
  }, []);

  useEffect(() => {
    if (!open) return;
    // 每次打开/切换记录时，根据 signingTime 选择字典版本
    getIndustrySubCategoryOptions();
  }, [open, initialRecord]);

  useEffect(() => {
    if (!open) return;
    if (!initialRecord) {
      form.resetFields();
      setParkOptions([]);
      return;
    }

    const x813Candidate =
      initialRecord?.x ??
      initialRecord?.industryCode ??
      initialRecord?.industrySubCategoryDisplay ??
      initialRecord?.industryClassification ??
      initialRecord?.industryMajorClassName;

    const x813 = isIndustryCodeLike(x813Candidate) ? String(x813Candidate).trim() : undefined;

    const ggIndustryCandidate =
      initialRecord?.industryName ??
      initialRecord?.ggIndustryCategory ??
      initialRecord?.ggIndustryCode ??
      (initialRecord?.industryCode != null &&
      String(initialRecord.industryCode).trim() !== '' &&
      !isIndustryCodeLike(initialRecord.industryCode)
        ? initialRecord.industryCode
        : undefined);

    const ggIndustry =
      ggIndustryCandidate != null && String(ggIndustryCandidate).trim() !== ''
        ? String(ggIndustryCandidate).trim()
        : undefined;

    const prefill: Partial<AddFormType> = {
      onlinePlatformProjectCode: initialRecord.projectCode ?? initialRecord.id ?? undefined,
      projectName: initialRecord.projectName ?? undefined,
      projectSource: initialRecord.projectSource ?? undefined,
      constructionContentAndScale: initialRecord.projectContent ?? undefined,
      investorName: initialRecord.investor ?? undefined,
      plannedInvestmentAmountDisplay:
        initialRecord.plannedTotalInvestment !== undefined && initialRecord.plannedTotalInvestment !== null
          ? Number(initialRecord.plannedTotalInvestment)
          : undefined,
      plannedInvestmentTypeDisplay: initialRecord.projectRating ?? undefined,
      industryCategoryDisplay: initialRecord.projectType ?? undefined,
      ...(x813 ? { x: x813 } : {}),
      ...(ggIndustry ? { industryCode: ggIndustry } : {}),
    };
    if (initialRecord.parkName && areaData.length > 0) {
      const districts = areaData[0]?.children ?? [];
      for (const d of districts) {
        const parks = d.children ?? [];
        const found = parks.find(
          (p: any) =>
            (p.label ?? '') === initialRecord.parkName || (p.value ?? '') === initialRecord.parkName
        );
        if (found) {
          prefill.district = d.value;
          prefill.park = found.value ?? found.label;
          const selectedDistrict = districts.find((x: any) => x.value === d.value);
          const parkOpts =
            selectedDistrict?.children?.map((p: any) => ({
              value: p.value,
              label: p.label,
            })) || [];
          setParkOptions(parkOpts);
          break;
        }
      }
      if (!prefill.park && initialRecord.parkName) {
        prefill.park = initialRecord.parkName;
      }
    }
    form.setFieldsValue(prefill);
  }, [open, initialRecord, areaData]);

  // 字典树加载完成后，若 initialRecord 只有“名称”而非 code，则反查可选叶子节点并回显
  useEffect(() => {
    if (!open || !initialRecord) return;
    if (!industrySubCategoryOptions?.length) return;

    const current = form.getFieldValue('x');

    const x813Candidate =
      initialRecord?.x ??
      initialRecord?.industryCode ??
      initialRecord?.industrySubCategoryDisplay ??
      initialRecord?.industryClassification ??
      initialRecord?.industryMajorClassName;

    if (isIndustryCodeLike(x813Candidate)) {
      const wanted = String(x813Candidate).trim();
      if (wanted && wanted !== current) {
        form.setFieldsValue({ x: wanted });
      }
      return;
    }

    if (!current) {
      const titleCandidate =
        initialRecord?.industryMajorClassName ??
        initialRecord?.industryClassification ??
        initialRecord?.industrySubCategoryDisplay;

      const foundCode = findSelectableCodeByTitle(industrySubCategoryOptions, String(titleCandidate ?? ''));
      if (foundCode && foundCode !== current) {
        form.setFieldsValue({ x: foundCode });
      }
    }
  }, [open, initialRecord, industrySubCategoryOptions, form]);

  const handleCancel = () => {
    form.resetFields();
    setParkOptions([]);
    onCancel();
  };

  const buildKeyProjectApplyPayload = (values: AddFormType): any => {
      const toNull = (val: any) => {
        if (val === undefined || val === '' || val === null) return null;
        return val;
      };

      const invType = values.plannedInvestmentTypeDisplay;
      const invAmount = values.plannedInvestmentAmountDisplay;
      const plannedDomestic =
        invType === '内资' && invAmount !== null && invAmount !== undefined ? invAmount : null;
      const plannedForeign =
        invType === '外资' && invAmount !== null && invAmount !== undefined ? invAmount : null;

      const yesNoToBool = (val: any) => {
        if (val === true || val === false) return val;
        if (val === '是' || val === '1' || val === 1) return true;
        if (val === '否' || val === '0' || val === 0) return false;
        return null;
      };

      const startYear =
        values.constructionPeriod &&
          Array.isArray(values.constructionPeriod) &&
          values.constructionPeriod.length === 2
          ? values.constructionPeriod[0]?.year?.()
          : null;
      const endYear =
        values.constructionPeriod &&
          Array.isArray(values.constructionPeriod) &&
          values.constructionPeriod.length === 2
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
        values.landTypeDisplay === '新增用地' ? (values.involvesBasicFarmland !== undefined ? values.involvesBasicFarmland : null) : null;
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

      const projectData: any = {
        // ↓↓↓ 按接口截图字段命名（会覆盖同含义旧字段，避免一份数据两套命名）
        digitalInvestmentId: toNull(values.onlinePlatformProjectCode),
        projectName: toNull(values.projectName),
        fgName: toNull(values.fgName),
        projectSource: toNull(values.projectSource),
        district: toNull(values.district),
        park: toNull(values.park),
        industryCategory: toNull(values.industryCategoryDisplay),
        x: toNull(values.x),
        investmentType: toNull(values.plannedInvestmentTypeDisplay),
        totalInvestmentAmount: toNull(values.plannedInvestmentAmountDisplay),
        isPhased: yesNoToBool(values.isPhasedDisplay),
        currentAmount: toNull(currentAmountVal),
        constructionContent: toNull(values.constructionContentAndScale),
        mainProductsCapacity: toNull(values.mainProductsAndCapacity),
        // 产业类别指标（工业：预期产值；服务业：预期开票/期金额 由 currentAmount 承接）
        expectOutput: toNull(values.expectedOutputValue),
        worker: toNull(values.expectedEmployment),
        revenuePerMu: toNull(values.taxPerMuDisplay),
        startYear: toNull(startYear),
        endYear: toNull(endYear),
        annualPlanInvestment: toNull(values.annualPlannedInvestment),
        annualImageProgress: toNull(values.annualImageProgress),
        projectType: toNull(values.projectTypeDisplay),
        investorName: toNull(values.investorName),
        creditCode: toNull(values.unifiedSocialCreditCode),
        // 后端该字段要求传 JSON 格式（如：["上市公司","民营企业"]），而不是逗号拼接字符串
        investorNature: Array.isArray(values.investorNature)
          ? JSON.stringify(values.investorNature)
          : toNull(values.investorNature),
        investorIntro: toNull(values.investorIntroduction),
        industryCode: toNull(values.industryCode),
        rdPlatform: toNull(values.rdPlatformLevel),
        rdRatioAvg3y: toNull(values.avgRdIntensityLast3years),
        inventionPatents: toNull(values.inventionPatentCountDisplay),
        utilityPatents: toNull(values.utilityPatentCountDisplay),
        landType: toNull(values.landTypeDisplay),
        isTwoHigh:
          (values.isHighPollutionHighEnergy !== undefined
            ? values.isHighPollutionHighEnergy
            : null) ?? null,
        energyReviewDone: yesNoToBool(values.energyReviewCompletedDisplay),
        envAssessmentDone: yesNoToBool(values.eiaCompletedDisplay),
        isFiled: yesNoToBool(values.isFilingDisplay),
        safetyApprovalDone: yesNoToBool(values.hasSafetyApprovalDisplay),
        highlights: toNull(values.projectHighlights),
        // 用地（新增/存量统一落到 landArea / landUseProcedures）
        landArea: landAreaVal,
        isBasicFarmland: isBasicFarmlandVal,
        isEcologicalBoundary: isEcologicalBoundaryVal,
        landUseProcedures: landUseProceduresVal,

        // ↓↓↓ 原来已有、截图里没有“同名/同含义字段”的，继续保留提交（不做覆盖）
        constructionLocation: toNull(values.constructionLocation),
        constructionPeriod:
          values.constructionPeriod &&
            Array.isArray(values.constructionPeriod) &&
            values.constructionPeriod.length === 2
            ? `${values.constructionPeriod[0].year()}-${values.constructionPeriod[1].year()}`
            : null,
        phasedStatus: toNull(values.phasedStatus),
        plannedTotalInvestmentDomestic:
          plannedDomestic ?? toNull(values.plannedTotalInvestmentDomestic),
        plannedTotalInvestmentForeign:
          plannedForeign ?? toNull(values.plannedTotalInvestmentForeign),
        expectedOutputValue: toNull(values.expectedOutputValue),
        expectedTaxRevenue: toNull(values.expectedTaxRevenue),
        expectedInvoiceAmount: toNull(values.expectedInvoiceAmount),
        expectedEmployment: toNull(values.expectedEmployment),
        estimatedStartDate: values.estimatedStartDate
          ? dayjs(values.estimatedStartDate).toDate()
          : null,
        actualOrEstimatedStartDate: values.actualOrEstimatedStartDate
          ? dayjs(values.actualOrEstimatedStartDate).toDate()
          : null,
        firstFullProductionDate: values.firstFullProductionDate
          ? dayjs(values.firstFullProductionDate).toDate()
          : null,
        isExpansionOrReinvestment:
          values.isExpansionOrReinvestment !== undefined
            ? values.isExpansionOrReinvestment
            : null,
        totalLandRequirement: toNull(values.totalLandRequirement),
        leaseOrRevitalization: toNull(values.leaseOrRevitalization),
        newLandArea: toNull(values.newLandArea),
        involvesBasicFarmland:
          values.involvesBasicFarmland !== undefined
            ? values.involvesBasicFarmland
            : null,
        withinEcologicalRedline:
          values.withinEcologicalRedline !== undefined
            ? values.withinEcologicalRedline
            : null,
        landProcedureStatus: toNull(values.landProcedureStatus),
        existingAreaUsage: toNull(values.existingAreaUsageDisplay),
        landProcedureStatusStock: toNull(values.landProcedureStatusStockDisplay),
        plotRatio: toNull(values.plotRatio),
        annualEnergyConsumption: toNull(values.annualEnergyConsumption),
        energyZzcl: (() => {
          const items = mergeZzclForSubmit(
            values.energyReviewOpinion as any,
            typeof values.energyReviewOpinion === 'string' ? values.energyReviewOpinion : undefined,
          );
          return serializeZzclForApi(items);
        })(),
        environmentalImpactDescription: toNull(values.environmentalImpactDescription),
        environmentZzcl: (() => {
          const items = mergeZzclForSubmit(
            values.eiaApprovalStatus as any,
            typeof values.eiaApprovalStatus === 'string' ? values.eiaApprovalStatus : undefined,
          );
          return serializeZzclForApi(items);
        })(),
        isHighTechEnterprise:
          values.isHighTechEnterprise !== undefined ? values.isHighTechEnterprise : null,
        rdPlatformLevel: toNull(values.rdPlatformLevel),
        ledByHighLevelTalent:
          values.ledByHighLevelTalent !== undefined ? values.ledByHighLevelTalent : null,
        intellectualPropertyInfo: toNull(values.intellectualPropertyInfo),
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
        isInStatisticalDatabase:
          values.isInStatisticalDatabase !== undefined
            ? values.isInStatisticalDatabase
            : null,
        statisticalDatabaseCode: toNull(values.statisticalDatabaseCode),
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
        isNewlyStartedIn2026:
          values.isNewlyStartedIn2026 !== undefined ? values.isNewlyStartedIn2026 : null,
        responsibleUnit: toNull(values.responsibleUnit),
        projectLocationAdmin: toNull(values.projectLocationAdmin),
        remarks: toNull(values.remarks),
        projectEvaluationStatus: toNull(values.projectEvaluationStatus),
      };

      return projectData;
  };

  const handleModalDraftSave = async () => {
    if (modalDraftSaving) return;
    const codeTrimDraft = String(form.getFieldValue('onlinePlatformProjectCode') ?? '').trim();
    const nameTrimDraft = String(form.getFieldValue('projectName') ?? '').trim();
    const draftFieldErrors: { name: 'onlinePlatformProjectCode' | 'projectName'; errors: string[] }[] = [];
    if (!codeTrimDraft) {
      draftFieldErrors.push({ name: 'onlinePlatformProjectCode', errors: ['请填写项目代码'] });
    }
    if (!nameTrimDraft) {
      draftFieldErrors.push({ name: 'projectName', errors: ['请输入项目名称'] });
    }
    if (draftFieldErrors.length > 0) {
      form.setFields(draftFieldErrors);
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
      const storeAll = form.getFieldsValue(true) as AddFormType;
      await primeApi.createProjectKeyProject({
        projectKeyProjectDto: {
          ...buildKeyProjectApplyPayload(storeAll),
          status: PROJECT_KEY_PROJECT_STATUS_DRAFT,
        },
      });
      message.success('草稿已暂存');
      handleCancel();
      onSuccess?.();
    } catch (error: any) {
      console.error('暂存草稿失败:', error);
      message.error(error?.message || '暂存草稿失败');
    } finally {
      setModalDraftSaving(false);
    }
  };

  const onFinish: FormProps<AddFormType>['onFinish'] = async (values) => {
    setLoading(true);
    try {
      await primeApi.createProjectKeyProject({
        projectKeyProjectDto: {
          ...buildKeyProjectApplyPayload(values),
          status: PROJECT_KEY_PROJECT_STATUS_FORMAL,
        },
      });

      message.success('申报重点项目成功');
      handleCancel();
      onSuccess?.();
    } catch (error: any) {
      console.error('申报重点项目失败:', error);
      message.error(error?.message || '申报重点项目失败');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<AddFormType>['onFinishFailed'] = (errorInfo) => {
    console.log('表单验证失败:', errorInfo);
  };

  return (
    <Modal
      title={<div style={{ textAlign: 'center' }}>市级重点项目申报表</div>}
      open={open}
      onCancel={handleCancel}
      width={1000}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="default" loading={modalDraftSaving} onClick={() => void handleModalDraftSave()}>
              暂存草稿
            </Button>
            <Button type="primary" loading={loading} onClick={() => form.submit()}>
              确定
            </Button>
          </Space>
        </div>
      }
    >
        <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <div
        style={{
          maxHeight: '65vh',
          overflowY: 'auto',
          padding: '20px 0',
        }}
        className="hide-scrollbar"
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
              <Form.Item<AddFormType>
                label="发改项目名称"
                name="fgName"
              >
                <Input placeholder="填写" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<AddFormType>
                label="项目来源"
                name="projectSource"
              >
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
              <Form.Item<AddFormType> label="所属园区" name="park" rules={[{ required: true, message: '请选择所属园区' }]}>
                <Select
                  disabled
                  options={parkOptions}
                  placeholder="请先选择所属区县"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(v) => form.setFieldValue('constructionLocation', v)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item<AddFormType> label="产业类别" name="industryCategoryDisplay" rules={[{ required: true, message: '请选择产业类别' }]}>
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
                    <Form.Item<AddFormType> label="8+13+X" name="x" rules={[{ required: true, message: '请选择8+13+X' }]}>
                      <TreeSelect
                        placeholder="请选择"
                        allowClear
                        treeData={industrySubCategoryOptions}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item<AddFormType> label="投资类型" name="plannedInvestmentTypeDisplay" rules={[{ required: true, message: '请选择投资类型' }]}>
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
                      rules={[{ required: true, message: unit ? `请填写计划总投资金额（${unit}）` : '请先选择投资类型' }]}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item<AddFormType> label="是否分期" name="isPhasedDisplay" rules={[{ required: true, message: '请选择是否分期' }]}>
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
                    <Form.Item<AddFormType> label="本期金额（万元）" name="amountPerPhaseDisplay" rules={[{ required: true, message: '请填写本期金额' }]}>
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
                      <Form.Item<AddFormType> label="预期产值（万元）" name="expectedOutputValue" rules={[{ required: true, message: '请填写预期产值' }]}>
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="填写"
                          min={0}
                          precision={2}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item<AddFormType> label="用工（人）" name="expectedEmployment" rules={[{ required: true, message: '请填写用工' }]}>
                        <InputNumber style={{ width: '100%' }} placeholder="填写" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item<AddFormType> label="亩均税收（万元）" name="taxPerMuDisplay" rules={[{ required: true, message: '请填写亩均税收' }]}>
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
                      <Form.Item<AddFormType> label="用工（人）" name="expectedEmployment" rules={[{ required: true, message: '请填写用工' }]}>
                        <InputNumber style={{ width: '100%' }} placeholder="填写" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item<AddFormType> label="亩均税收（万元）" name="taxPerMuDisplay" rules={[{ required: true, message: '请填写亩均税收' }]}>
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
              <Form.Item<AddFormType> label="年度计划投资（万元）" name="annualPlannedInvestment" rules={[{ required: true, message: '请填写年度计划投资' }]}>
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
              <Form.Item<AddFormType> label="项目类型" name="projectTypeDisplay" rules={[{ required: true, message: '请选择项目类型' }]}>
                <Select placeholder="请选择" allowClear>
                  <Select.Option value="增资扩产">增资扩产</Select.Option>
                  <Select.Option value="外资利润再投资">外资利润再投资</Select.Option>
                  <Select.Option value="新招引项目">新招引项目</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

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
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item<AddFormType> label="投资主体性质" name="investorNature" rules={[{ required: true, message: '请选择投资主体性质' }]}>
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
              {/* <Form.Item<AddFormType> label="行业代码" name="industryCode">
                <Input placeholder="请输入行业代码" />
              </Form.Item> */}
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
              <Form.Item<AddFormType> label="研发平台" name="rdPlatformLevel" rules={[{ required: true, message: '请选择研发平台' }]}>
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
              <Form.Item<AddFormType> label="发明专利（件）" name="inventionPatentCountDisplay" rules={[{ required: true, message: '请填写发明专利数量' }]}>
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
              <Form.Item<AddFormType> label="用地类型" name="landTypeDisplay" rules={[{ required: true, message: '请选择用地类型' }]}>
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
                          <Form.Item<AddFormType> label="用地面积（亩）" name="newLandArea" rules={[{ required: true, message: '请填写用地面积' }]}>
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
                              <Select.Option value="编制成片开发方案">编制成片开发方案</Select.Option>
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
                    <Form.Item<AddFormType>
                      label="节能审查佐证资料"
                      name="energyReviewOpinion"
                        preserve={false}
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                    >
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
              <Form.Item<AddFormType> label="是否完成环评" name="eiaCompletedDisplay" rules={[{ required: true, message: '请选择是否完成环评' }]}>
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
                      <Form.Item<AddFormType>
                        label="环评佐证资料"
                        name="eiaApprovalStatus"
                        preserve={false}
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                      >
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
              <Form.Item<AddFormType> label="是否备案" name="isFilingDisplay" rules={[{ required: true, message: '请选择是否备案' }]}>
                <Radio.Group>
                  <Radio value="是">是</Radio>
                  <Radio value="否">否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<AddFormType> label="是否取得安评批复" name="hasSafetyApprovalDisplay" rules={[{ required: true, message: '请选择是否取得安评批复' }]}>
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
                      <Form.Item<AddFormType>
                        label="备案佐证资料"
                        name="filingDocUrlDisplay"
                        preserve={false}
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                      >
                        <Upload {...evidenceUploadProps}>
                          <Button icon={<UploadOutlined />}>点击上传</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  )}
                  {showSafety && (
                    <Col span={12}>
                      <Form.Item<AddFormType>
                        label="安评佐证资料"
                        name="safetyEvaluationApproval"
                        preserve={false}
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                      >
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
      </div>
        </Form>
    </Modal>
  );
};

export default KeyProjectApplyModal;
