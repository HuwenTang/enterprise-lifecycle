import { primeApi, systemApi } from '@/services/api';
import { ProjectKeyProjectReviewDto } from '@/services/apis';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from 'antd';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { decodeDisplayFileName, fileLabelFromUrl, parseZzclFieldFromVo } from '../attachmentApi';
import './DescriptionsStyle.css';

/** 8+13+X 字典：code -> 展示用 label（与列表页 dedupe 规则一致） */
function buildIndustry813CodeLabelMap(items: any[]): Map<string, string> {
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
  const m = new Map<string, string>();
  for (const x of byCode.values()) {
    m.set(x.code, x.label);
  }
  return m;
}

function resolveDistrictLabel(code: string, areaData: any[]): string {
  if (!code || !areaData?.length) return code || '';
  const districts = areaData[0]?.children ?? [];
  const d = districts.find((x: any) => String(x.value ?? '').trim() === String(code).trim());
  return d?.label !== undefined && d?.label !== null ? String(d.label) : code;
}

function formatInvestorNature(raw: unknown): string {
  if (raw === null || raw === undefined || raw === '') return '';
  if (Array.isArray(raw)) return raw.filter(Boolean).join('、');
  const s = String(raw).trim();
  if (s.startsWith('[')) {
    try {
      const arr = JSON.parse(s);
      return Array.isArray(arr) ? arr.join('、') : s;
    } catch {
      return s;
    }
  }
  return s.split(',').map((x) => x.trim()).filter(Boolean).join('、');
}

function involveText(coerceBoolish: (v: unknown) => boolean | undefined, v: unknown): string {
  const b = coerceBoolish(v);
  if (b === true) return '涉及';
  if (b === false) return '不涉及';
  return '';
}

/** 佐证链接：优先展示 `{path,name}[]` 中的原始文件名 */
function renderFileLinks(raw: unknown): ReactNode {
  const items = parseZzclFieldFromVo(raw);
  if (!items.length) return '-';
  return (
    <span>
      {items.map((it, i) => (
        <span key={`${it.path}-${i}`}>
          {i > 0 ? <span style={{ margin: '0 6px' }}>|</span> : null}
          <a href={it.path} target="_blank" rel="noopener noreferrer">
            {decodeDisplayFileName(it.name) || fileLabelFromUrl(it.path)}
          </a>
        </span>
      ))}
    </span>
  );
}

const KeyProjectDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');
  const [form] = Form.useForm();
  const [formModal] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [areaData, setAreaData] = useState<any[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewList, setReviewList] = useState<any[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [canEvaluate, setCanEvaluate] = useState(false);
  /** 8+13+X：接口 x（兼容旧数据 industryCode 存点分 code）-> 中文 */
  const [industry813LabelMap, setIndustry813LabelMap] = useState<Map<string, string>>(() => new Map());
  /** gg_industry_category：字典 value -> 展示文案（与申报表 options 一致：value+label） */
  const [industryCategoryLabelByValue, setIndustryCategoryLabelByValue] = useState<Map<string, string>>(
    () => new Map(),
  );

  const breadcrumbList = [
    { path: '/key-project', title: '重点项目' },
    { path: '/key-project/detail', title: '项目详情' },
  ];

  /** 兼容后端 boolean / 0-1 / "是""否" / "true""false" */
  const coerceBoolish = (v: unknown): boolean | undefined => {
    if (v === true || v === false) return v;
    if (v === null || v === undefined || v === '') return undefined;
    if (typeof v === 'number') {
      if (v === 1) return true;
      if (v === 0) return false;
      return undefined;
    }
    const s = String(v).trim().toLowerCase();
    if (['true', '1', '是', 'y', 'yes', 't'].includes(s)) return true;
    if (['false', '0', '否', 'n', 'no', 'f'].includes(s)) return false;
    return undefined;
  };

  const boolToYesNoText = (v: unknown): string => {
    const b = coerceBoolish(v);
    if (b === true) return '是';
    if (b === false) return '否';
    return '';
  };

  /** 多个候选字段里取第一个能解析出是/否的 */
  const yesNoFromCandidates = (...candidates: unknown[]): string => {
    for (const c of candidates) {
      const t = boolToYesNoText(c);
      if (t !== '') return t;
    }
    return '';
  };

  const toOptionalNumber = (v: unknown): number | undefined => {
    if (v === undefined || v === null || v === '') return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  /** 将 getProjectKeyProject 返回（含新 DTO 字段 + 扩展字段）映射为详情表单字段 */
  const mapDetailToFormValues = (data: any) => {
    const vo = data as Record<string, any>;

    const constructionPeriodStr =
      vo.startYear !== undefined && vo.startYear !== null && vo.endYear !== undefined && vo.endYear !== null
        ? `${vo.startYear}-${vo.endYear}`
        : vo.constructionPeriod !== undefined &&
            vo.constructionPeriod !== null &&
            vo.constructionPeriod !== ''
          ? String(vo.constructionPeriod)
          : '';

    const invTypeRaw = String(vo.investmentType ?? '').trim();
    const isDomesticType = invTypeRaw === '内资' || invTypeRaw.includes('内资');
    const isForeignType = invTypeRaw === '外资' || invTypeRaw.includes('外资');

    // 内/外金额：先取历史字段与扩展字段，再按投资类型用 totalInvestmentAmount 补主金额列（不抹掉另一列已有值）
    let plannedDomestic =
      vo.plannedTotalInvestmentDomestic ??
      vo.plannedDomesticInvestment ??
      vo.domesticInvestmentAmount ??
      vo.totalInvestmentDomestic;
    let plannedForeign =
      vo.plannedTotalInvestmentForeign ??
      vo.plannedForeignInvestment ??
      vo.foreignInvestmentAmount ??
      vo.totalInvestmentForeign;

    if (
      isDomesticType &&
      vo.totalInvestmentAmount !== undefined &&
      vo.totalInvestmentAmount !== null &&
      vo.totalInvestmentAmount !== ''
    ) {
      plannedDomestic = plannedDomestic ?? vo.totalInvestmentAmount;
    }
    if (
      isForeignType &&
      vo.totalInvestmentAmount !== undefined &&
      vo.totalInvestmentAmount !== null &&
      vo.totalInvestmentAmount !== ''
    ) {
      plannedForeign = plannedForeign ?? vo.totalInvestmentAmount;
    }

    const phasedText =
      vo.phasedStatus !== undefined &&
      vo.phasedStatus !== null &&
      String(vo.phasedStatus).trim() !== ''
        ? String(vo.phasedStatus)
        : (vo.ifPhased ?? vo.isPhased) === true
          ? '是'
          : (vo.ifPhased ?? vo.isPhased) === false
            ? '否'
            : '';

    return {
      digitalInvestmentId: vo.digitalInvestmentId ?? vo.onlinePlatformProjectCode ?? '',
      district: vo.district ?? '',
      // 后端园区字段有时是 code（如 3212xxxx），需要用行政区划树反查中文名
      park: (() => {
        const parkCode = String(vo.park ?? '').trim();
        const districtCode = String(vo.district ?? '').trim();
        if (parkCode && areaData?.length) {
          const districts = areaData[0]?.children ?? [];
          // 优先按区县联动：找对应区县下的园区
          if (districtCode) {
            const d = districts.find((x: any) => String(x.value ?? '').trim() === districtCode);
            const p = (d?.children ?? []).find(
              (x: any) => String(x.value ?? '').trim() === parkCode || String(x.label ?? '').trim() === parkCode,
            );
            if (p?.label) return String(p.label);
          }
          // 回退：全局查找
          for (const d of districts) {
            const p = (d?.children ?? []).find(
              (x: any) => String(x.value ?? '').trim() === parkCode || String(x.label ?? '').trim() === parkCode,
            );
            if (p?.label) return String(p.label);
          }
        }
        // 反查失败则展示后端给的字段（可能已是中文）
        return vo.parkName ?? vo.park ?? '';
      })(),
      industryCategoryDisplay: vo.industryCategory ?? '',
      industrySubCategoryDisplay: (() => {
        const xv = String(vo.x ?? '').trim();
        if (xv) return xv;
        const ic = String(vo.industryCode ?? '').trim();
        if (ic && /^\d+(\.\d+)*$/.test(ic)) return ic;
        return '';
      })(),
      plannedInvestmentTypeDisplay: vo.investmentType ?? '',
      plannedInvestmentAmountDisplay: toOptionalNumber(vo.totalInvestmentAmount),
      projectTypeDisplay: vo.projectType ?? '',
      investorName: vo.investorName ?? '',
      unifiedSocialCreditCode: vo.creditCode ?? '',
      investorIntroduction: vo.investorIntro ?? '',
      // 年度/研发/知识产权
      annualPlannedInvestment: toOptionalNumber(vo.annualPlanInvestment),
      annualImageProgress: vo.annualImageProgress ?? '',
      rdPlatformLevel: vo.rdPlatform ?? '',
      avgRdIntensityLast3years: toOptionalNumber(vo.rdRatioAvg3y),
      inventionPatentCountDisplay: toOptionalNumber(vo.inventionPatents),
      utilityPatentCountDisplay: toOptionalNumber(vo.utilityPatents),
      // 资源环境/审批
      landTypeDisplay: vo.landType ?? '',
      energyReviewCompletedDisplay: boolToYesNoText(vo.energyReviewDone),
      eiaCompletedDisplay: boolToYesNoText(vo.envAssessmentDone),
      isFilingDisplay: yesNoFromCandidates(
        vo.ifFiled,
        vo.ifFiling,
        vo.isFiled,
        vo.isFiling,
        vo.filing,
        vo.filed,
        vo.filingStatus,
        vo.isFilingStatus,
      ),
      hasSafetyApprovalDisplay: boolToYesNoText(vo.safetyApprovalDone),
      projectHighlights: vo.highlights ?? '',
      remarks: vo.remarks ?? '',

      projectName: vo.projectName ?? '',
      constructionContentAndScale:
        vo.constructionContent ?? vo.constructionContentAndScale ?? vo.projectContent ?? '',
      mainProductsAndCapacity: vo.mainProductsCapacity ?? vo.mainProductsAndCapacity ?? '',
      constructionPeriod: constructionPeriodStr,
      phasedStatus: phasedText,
      plannedTotalInvestmentDomestic: toOptionalNumber(plannedDomestic),
      plannedTotalInvestmentForeign: toOptionalNumber(plannedForeign),
      // 表单项用文案展示，避免与 Form 受控冲突
      // 外资项目：后端字段名可能不一致，多候选
      isExpansionOrReinvestment: yesNoFromCandidates(
        vo.isExpansionOrReinvestment,
        vo.foreignInvestedProject,
        vo.isForeignInvestedProject,
        vo.isForeignProject,
        vo.waZiXiangMu,
      ),
      isHighPollutionHighEnergy: boolToYesNoText(vo.isHighPollutionHighEnergy ?? vo.isTwoHigh),
      isHighTechEnterprise: yesNoFromCandidates(
        vo.isHighTechEnterprise,
        vo.highTechEnterprise,
        vo.isHighTech,
        vo.highTech,
      ),
      isInStatisticalDatabase: yesNoFromCandidates(
        vo.isInStatisticalDatabase,
        vo.isListedEnterprise,
        vo.listedEnterprise,
        vo.isListed,
        vo.isListedCompany,
      ),
      industrialCorrelation:
        vo.industrialCorrelation ??
        vo.industryCorrelation ??
        vo.industryRelevance ??
        '',
      investorNatureRaw: vo.investorNature,
      environmentalImpactDescription: vo.environmentalImpactDescription ?? '',
      energyReviewOpinionPath: vo.energyZzcl ?? vo.energyReviewOpinion ?? '',
      eiaApprovalPath: vo.environmentZzcl ?? vo.eiaApprovalStatus ?? '',
      filingEvidencePath: vo.filedZzcl ?? vo.filingEvidence ?? vo.filingDoc ?? '',
      safetyEvaluationPath: vo.safetyZzcl ?? vo.safetyEvaluationApproval ?? '',
      newLandArea: vo.landArea ?? vo.newLandArea,
      involvesBasicFarmland: vo.isBasicFarmland ?? vo.involvesBasicFarmland,
      withinEcologicalRedline: vo.isEcologicalBoundary ?? vo.withinEcologicalRedline,
      landProcedureStatus: vo.landUseProcedures ?? vo.landProcedureStatus ?? '',
      existingAreaUsage: vo.landArea ?? vo.existingAreaUsage ?? vo.existingAreaUsageDisplay ?? '',
      landProcedureStatusStock: vo.landUseProcedures ?? vo.landProcedureStatusStock ?? vo.landProcedureStatusStockDisplay ?? '',
      expectedOutputValue: toOptionalNumber(vo.expectOutput ?? vo.expectedOutputValue),
      expectedInvoiceAmount: toOptionalNumber(vo.expectedInvoiceAmount),
      currentPeriodAmount: toOptionalNumber(
        vo.currentAmount ?? vo.currentPeriodAmount ?? vo.currentInvestmentAmount ?? vo.periodInvestmentAmount,
      ),
      expectedEmployment: toOptionalNumber(vo.worker ?? vo.expectedEmployment),
      taxPerMuDisplay: toOptionalNumber(vo.revenuePerMu ?? vo.taxPerMu ?? vo.taxPerMuDisplay),
      isDomesticType,
      isForeignType,
      industryCodeRaw: (() => {
        const ic = String(vo.industryCode ?? '').trim();
        if (ic && !/^\d+(\.\d+)*$/.test(ic)) return ic;
        return String(vo.industryName ?? vo.ggIndustryCategory ?? vo.ggIndustryCode ?? '').trim();
      })(),
      // 行业代码（国民经济分类）展示用
      industryNameRaw: String(vo.industryName ?? vo.ggIndustryCategory ?? vo.ggIndustryCode ?? '').trim(),
      // 接口字段名为 ifTwoHigh；同时兼容历史字段
      ifTwoHigh: vo.ifTwoHigh ?? vo.isTwoHigh ?? vo.isHighPollutionHighEnergy,
      isTwoHighDisplay: boolToYesNoText(vo.ifTwoHigh ?? vo.isTwoHigh ?? vo.isHighPollutionHighEnergy),
    };
  };

  // 获取项目详情
  const fetchProjectDetail = async () => {
    if (!id) {
      message.error('项目ID不存在');
      navigate('/key-project');
      return;
    }

    setLoading(true);
    try {
      const data = await primeApi.getProjectKeyProject({ id });
      setDetailData(data);
      form.setFieldsValue(mapDetailToFormValues(data));
    } catch (error: any) {
      console.error('获取项目详情失败:', error);
      message.error(error?.message || '获取项目详情失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdministrativeDivisionTree = async () => {
    try {
      const res = await systemApi.getAdministrativeDivisionTree();
      setAreaData(res ?? []);
    } catch (error) {
      console.error('获取行政区划树失败:', error);
      setAreaData([]);
    }
  };

  /** 详情展示用：8+13+X、行业代码（gg_industry_category）转中文 */
  const fetchDictsForDetail = async () => {
    try {
      const [r813, r813_2026, rCat] = await Promise.all([
        systemApi.getDictItems({ catalog: '8_13_X' }),
        systemApi.getDictItems({ catalog: '8_13_x_2026' }).catch(() => [] as any[]),
        systemApi.getDictItems({ catalog: 'gg_industry_category' }),
      ]);
      const merged813 = [...(Array.isArray(r813) ? r813 : []), ...(Array.isArray(r813_2026) ? r813_2026 : [])];
      setIndustry813LabelMap(buildIndustry813CodeLabelMap(merged813 as any[]));
      const catMap = new Map<string, string>();
      (rCat as any[])?.forEach((p: any) => {
        const val = String(p.value ?? '').trim();
        if (!val) return;
        catMap.set(val, `${p.value || ''}${p.label || ''}`);
      });
      setIndustryCategoryLabelByValue(catMap);
    } catch (e) {
      console.error('获取详情字典失败:', e);
    }
  };

  // 获取评估情况列表
  const fetchReviewList = async () => {
    if (!id) {
      return;
    }

    setReviewLoading(true);
    try {
      const data = await primeApi.projectKeyProjectReviewList({
        projectId: id,
        page: 1,
        size: 100,
      });
      setReviewList(data.records || []);
    } catch (error: any) {
      console.error('获取评估情况失败:', error);
      // 不显示错误提示，因为可能没有评估数据
    } finally {
      setReviewLoading(false);
    }
  };

  // 检查是否可以评估
  const checkCanEvaluate = async () => {
    if (!id) {
      return;
    }

    try {
      const result = await primeApi.checkEstimate({ projectId: id });
      setCanEvaluate(result.value || false);
    } catch (error: any) {
      console.error('检查评估权限失败:', error);
      setCanEvaluate(false);
    }
  };

  useEffect(() => {
    fetchAdministrativeDivisionTree();
    fetchDictsForDetail();
    fetchProjectDetail();
    fetchReviewList();
    checkCanEvaluate();
  }, [id]);

  // 打开评估弹框
  const handleEvaluate = () => {
    if (!id) {
      message.error('项目ID不存在');
      return;
    }
    // 将表单中的评估字段值同步到弹框表单
    const formValues = form.getFieldsValue(['keyProjectLevel', 'comment']);
    formModal.setFieldsValue(formValues);
    setModalVisible(true);
  };

  // 弹框中确认评估
  const handleModalOk = async () => {
    if (!id) {
      message.error('项目ID不存在');
      return;
    }

    try {
      const values = await formModal.validateFields();
      setEvaluating(true);

      const reviewData: ProjectKeyProjectReviewDto = {
        keyProjectId: id,
        keyProjectLevel: values.keyProjectLevel,
        comment: values.comment,
      };

      await primeApi.updateProjectKeyProjectReview({
        projectKeyProjectReviewDto: reviewData,
      });

      message.success('评估成功');
      setModalVisible(false);
      // 同步弹框表单值到主表单
      form.setFieldsValue({
        keyProjectLevel: values.keyProjectLevel,
        comment: values.comment,
      });
      // 刷新评估情况列表
      fetchReviewList();
      navigate('/key-project');
    } catch (error: any) {
      if (error?.errorFields) {
        // 表单验证错误
        return;
      }
      console.error('评估失败:', error);
      message.error(error?.message || '评估失败');
    } finally {
      setEvaluating(false);
    }
  };

  // 关闭弹框
  const handleModalCancel = () => {
    setModalVisible(false);
    formModal.resetFields();
  };

  const detailView = useMemo(() => {
    if (!detailData) return null;
    const base = mapDetailToFormValues(detailData);
    const vo = detailData as Record<string, any>;
    const code813Raw = String(vo.x ?? '').trim();
    const legacy813 =
      code813Raw === '' && /^\d+(\.\d+)*$/.test(String(vo.industryCode ?? '').trim())
        ? String(vo.industryCode).trim()
        : '';
    const code813 = code813Raw || legacy813;
    const label813 = code813 !== '' ? industry813LabelMap.get(code813) : undefined;
    const nameCode = String(vo.industryName ?? vo.ggIndustryCategory ?? vo.ggIndustryCode ?? '').trim();
    const icGg = String(vo.industryCode ?? '').trim();
    const icGgOnly = icGg !== '' && !/^\d+(\.\d+)*$/.test(icGg) ? icGg : '';
    return {
      ...base,
      districtDisplay: resolveDistrictLabel(String(vo.district ?? ''), areaData) || base.district || '-',
      industry813Label: code813 !== '' ? label813 ?? code813 : '-',
      industryNameLabel:
        nameCode !== ''
          ? industryCategoryLabelByValue.get(nameCode) ?? nameCode
          : icGgOnly !== ''
            ? industryCategoryLabelByValue.get(icGgOnly) ?? icGgOnly
            : '-',
    };
  }, [detailData, areaData, industry813LabelMap, industryCategoryLabelByValue]);

  return (
    <PageContainer
      style={{
        height: '90vh',
        overflow: 'auto',
        scrollbarWidth: 'none',
        backgroundImage: 'url(/mg/bg.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        padding: '0 120px 0',
      }}
      breadcrumb={{
        routes: breadcrumbList,
        itemRender: (route, params, routes) => {
          const last = routes.indexOf(route) === routes.length - 1;
          return last ? (
            <span>{route.title}</span>
          ) : (
            <a
              onClick={() => {
                if (route.path) {
                  navigate(route.path);
                }
              }}
            >
              {route.title}
            </a>
          );
        },
      }}
      title={false}
      extra={
        canEvaluate && (
          <Button type="primary" onClick={handleEvaluate}>
            评估
          </Button>
        )
      }
    >
      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col span={16}>
            <div style={{ backgroundColor: '#fff' }}>
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '24px',
                  padding: '30px 0 20px',
                  fontWeight: 'bolder',
                  color: '#333',
                }}
              >
                市级重点项目基本信息申报表
              </div>
              <Card
                style={{
                  marginBottom: 24,
                }}
                bordered={false}
              >
                {(() => {
                  const formatNum = (n: unknown) => {
                    if (n === null || n === undefined || n === '') return '-';
                    const num = Number(n);
                    if (!Number.isFinite(num)) return String(n);
                    return num.toLocaleString();
                  };

                  const v = detailView;
                  if (!v) return null;

                  const cat = String(v.industryCategoryDisplay ?? '').trim();
                  const isIndustrial = cat === '工业';
                  const isService = cat === '服务业';
                  const showDomesticOnly = v.isDomesticType && !v.isForeignType;
                  const showForeignOnly = v.isForeignType && !v.isDomesticType;
                  const showBothInvestment = !showDomesticOnly && !showForeignOnly;

                  const landType = String(v.landTypeDisplay ?? '').trim();
                  const isNewLand = landType === '新增用地';
                  const isStockLand = landType === '存量厂房';

                  const energyYes = v.energyReviewCompletedDisplay === '是';
                  const eiaYes = v.eiaCompletedDisplay === '是';
                  const filingYes = v.isFilingDisplay === '是';
                  const safetyYes = v.hasSafetyApprovalDisplay === '是';
                  const phasedYes = v.phasedStatus === '是';

                  return (
                    <div style={{ padding: '20px 26px' }}>
                      <Descriptions
                        bordered
                        size="middle"
                        column={2}
                        className="custom-descriptions key-project-detail-desc"
                      >
                        <Descriptions.Item label="项目名称">{v.projectName || '-'}</Descriptions.Item>
                        <Descriptions.Item label="在线招商项目代码">{v.digitalInvestmentId || '-'}</Descriptions.Item>
                        <Descriptions.Item label="所属区县">{v.districtDisplay || '-'}</Descriptions.Item>
                        <Descriptions.Item label="所属园区">{v.park || '-'}</Descriptions.Item>

                        <Descriptions.Item label="产业类别">{v.industryCategoryDisplay || '-'}</Descriptions.Item>
                        {isIndustrial ? (
                          <Descriptions.Item label="8+13+X">{v.industry813Label || '-'}</Descriptions.Item>
                        ) : (
                          <Descriptions.Item label="8+13+X">-</Descriptions.Item>
                        )}
                        <Descriptions.Item label="投资类型" span={2}>
                          {v.plannedInvestmentTypeDisplay || '-'}
                        </Descriptions.Item>

                        {showDomesticOnly && (
                          <Descriptions.Item label="计划总投资（内资）（万元）" span={2}>
                            {formatNum(v.plannedTotalInvestmentDomestic)}
                          </Descriptions.Item>
                        )}
                        {showForeignOnly && (
                          <Descriptions.Item label="计划总投资（外资）（万美元）" span={2}>
                            {formatNum(v.plannedTotalInvestmentForeign)}
                          </Descriptions.Item>
                        )}
                        {showBothInvestment && (
                          <>
                            <Descriptions.Item label="计划总投资（内资）（万元）">
                              {formatNum(v.plannedTotalInvestmentDomestic)}
                            </Descriptions.Item>
                            <Descriptions.Item label="计划总投资（外资）（万美元）">
                              {formatNum(v.plannedTotalInvestmentForeign)}
                            </Descriptions.Item>
                          </>
                        )}

                        <Descriptions.Item label="建设内容及规模" span={2}>
                          {v.constructionContentAndScale || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="主要产品及产能" span={2}>
                          {v.mainProductsAndCapacity || '-'}
                        </Descriptions.Item>

                        {isIndustrial && (
                          <>
                            <Descriptions.Item label="预期产值（万元）">
                              {formatNum(v.expectedOutputValue)}
                            </Descriptions.Item>
                            <Descriptions.Item label="用工（人）">{formatNum(v.expectedEmployment)}</Descriptions.Item>
                            <Descriptions.Item label="亩均税收（万元）" span={2}>
                              {formatNum(v.taxPerMuDisplay)}
                            </Descriptions.Item>
                          </>
                        )}
                        {isService && (
                          <>
                            <Descriptions.Item label="预期开票（万元）">
                              {formatNum(v.expectedInvoiceAmount)}
                            </Descriptions.Item>
                            <Descriptions.Item label="用工（人）">{formatNum(v.expectedEmployment)}</Descriptions.Item>
                            <Descriptions.Item label="亩均税收（万元）" span={2}>
                              {formatNum(v.taxPerMuDisplay)}
                            </Descriptions.Item>
                          </>
                        )}

                        <Descriptions.Item label="建设起止年限">{v.constructionPeriod || '-'}</Descriptions.Item>
                        <Descriptions.Item label="分期情况">{v.phasedStatus || '-'}</Descriptions.Item>
                        {phasedYes && (
                          <Descriptions.Item label="本期金额（万元）">{formatNum((v as any).currentPeriodAmount)}</Descriptions.Item>
                        )}
                        <Descriptions.Item label="年度计划投资（万元）">
                          {v.annualPlannedInvestment !== undefined && v.annualPlannedInvestment !== null
                            ? formatNum(v.annualPlannedInvestment)
                            : '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="年度形象进度">{v.annualImageProgress || '-'}</Descriptions.Item>

                        <Descriptions.Item label="项目类型" span={2}>
                          {v.projectTypeDisplay || '-'}
                        </Descriptions.Item>

                        <Descriptions.Item label="投资主体名称">{v.investorName || '-'}</Descriptions.Item>
                        <Descriptions.Item label="统一信用代码">{v.unifiedSocialCreditCode || '-'}</Descriptions.Item>
                        <Descriptions.Item label="投资主体性质" span={2}>
                          {formatInvestorNature(v.investorNatureRaw) || '-'}
                        </Descriptions.Item>

                        <Descriptions.Item label="投资主体简介" span={2}>
                          {v.investorIntroduction || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="行业代码" span={2}>
                          {v.industryNameLabel || '-'}
                        </Descriptions.Item>

                        <Descriptions.Item label="研发平台">{v.rdPlatformLevel || '-'}</Descriptions.Item>
                        <Descriptions.Item label="近三年平均研发投入占比（%）">
                          {v.avgRdIntensityLast3years !== undefined && v.avgRdIntensityLast3years !== null
                            ? formatNum(v.avgRdIntensityLast3years)
                            : '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="发明专利（件）">
                          {v.inventionPatentCountDisplay !== undefined && v.inventionPatentCountDisplay !== null
                            ? formatNum(v.inventionPatentCountDisplay)
                            : '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="实用新型或外观专利（件）">
                          {v.utilityPatentCountDisplay !== undefined && v.utilityPatentCountDisplay !== null
                            ? formatNum(v.utilityPatentCountDisplay)
                            : '-'}
                        </Descriptions.Item>

                        <Descriptions.Item label="用地类型" span={2}>
                          {v.landTypeDisplay || '-'}
                        </Descriptions.Item>

                        {isNewLand && (
                          <>
                            <Descriptions.Item label="用地面积（亩）">{formatNum(v.newLandArea)}</Descriptions.Item>
                            <Descriptions.Item label="土地情况-基本农田">
                              {involveText(coerceBoolish, v.involvesBasicFarmland) || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="土地情况（生态红线）">
                              {involveText(coerceBoolish, v.withinEcologicalRedline) || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="用地手续办理情况">
                              {v.landProcedureStatus || '-'}
                            </Descriptions.Item>
                          </>
                        )}
                        {isStockLand && (
                          <>
                            <Descriptions.Item label="使用面积（平方米）">
                              {formatNum(v.existingAreaUsage)}
                            </Descriptions.Item>
                            <Descriptions.Item label="用地手续办理情况">
                              {v.landProcedureStatusStock || '-'}
                            </Descriptions.Item>
                          </>
                        )}

                        <Descriptions.Item label='是否为"两高"项目' span={2}>
                          {v.isTwoHighDisplay || '-'}
                        </Descriptions.Item>

                        <Descriptions.Item label="是否完成节能审查" span={2}>
                          {v.energyReviewCompletedDisplay || '-'}
                        </Descriptions.Item>
                        {energyYes && (
                          <Descriptions.Item label="节能审查佐证材料" span={2}>
                            {renderFileLinks(v.energyReviewOpinionPath)}
                          </Descriptions.Item>
                        )}

                        <Descriptions.Item label="是否完成环评" span={2}>
                          {v.eiaCompletedDisplay || '-'}
                        </Descriptions.Item>
                        {eiaYes ? (
                          <Descriptions.Item label="环评佐证材料" span={2}>
                            {renderFileLinks(v.eiaApprovalPath)}
                          </Descriptions.Item>
                        ) : (
                          <Descriptions.Item label="项目环境影响情况" span={2}>
                            {v.environmentalImpactDescription || '-'}
                          </Descriptions.Item>
                        )}

                        <Descriptions.Item label="是否备案" span={2}>
                          {v.isFilingDisplay || '-'}
                        </Descriptions.Item>
                        {filingYes && (
                          <Descriptions.Item label="备案佐证材料" span={2}>
                            {renderFileLinks(v.filingEvidencePath)}
                          </Descriptions.Item>
                        )}

                        <Descriptions.Item label="是否取得安评批复" span={2}>
                          {v.hasSafetyApprovalDisplay || '-'}
                        </Descriptions.Item>
                        {safetyYes && (
                          <Descriptions.Item label="安评佐证材料" span={2}>
                            {renderFileLinks(v.safetyEvaluationPath)}
                          </Descriptions.Item>
                        )}

                        <Descriptions.Item label="项目特色亮点" span={2}>
                          {v.projectHighlights || '-'}
                        </Descriptions.Item>

                        {/* 评估页面去掉备注展示 */}
                      </Descriptions>
                    </div>
                  );
                })()}
              </Card>
            </div>
          </Col>
          <Col span={8}>
            <Card
              title="评估情况"
              bordered={false}
              style={{ backgroundColor: '#fff' }}
            >
              <Spin spinning={reviewLoading}>
                {reviewList.length > 0 ? (
                  <div>
                    {reviewList.map((item: any, index: number) => (
                      <div
                        key={item.id || index}
                        style={{
                          marginBottom: index < reviewList.length - 1 ? '20px' : 0,
                        }}
                      >
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '8px',
                          }}
                        >
                          {item.departmentName || item.departmentId || '未知部门'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {item.keyProjectLevel && (
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: '#f0f9ff',
                                border: '1px solid #52c41a',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#52c41a',
                                flexShrink: 0,
                              }}
                            >
                              {item.keyProjectLevel}
                            </div>
                          )}
                          <div
                            style={{
                              flex: 1,
                              fontSize: '14px',
                              color: '#666',
                            }}
                          >
                            {item.comment || '暂无评价'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      color: '#999',
                      padding: '20px 0',
                    }}
                  >
                    暂无评估情况
                  </div>
                )}
              </Spin>
            </Card>
          </Col>
        </Row>
      </Spin>

      <Modal
        title="项目评估"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={evaluating}
        width={600}
      >
        <Form
          form={formModal}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="项目级别"
            name="keyProjectLevel"
            rules={[{ required: true, message: '请选择项目级别' }]}
          >
            <Select placeholder="请选择项目级别">
              <Select.Option value="A">A</Select.Option>
              <Select.Option value="B">B</Select.Option>
              <Select.Option value="C">C</Select.Option>
              <Select.Option value="D">D</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="项目评价" name="comment">
            <Input.TextArea rows={4} placeholder="请输入项目评价" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default KeyProjectDetail;
