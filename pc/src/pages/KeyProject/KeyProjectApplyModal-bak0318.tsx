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
  UploadFile,
  UploadProps,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export type AddFormType = {
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
  industryCode?: string;
  industryName?: string; // 行业分类
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

const KeyProjectApplyModal = ({ open, onCancel, initialRecord, onSuccess }: KeyProjectApplyModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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
    return e?.fileList ?? [];
  };

  const getPathFromFileList = (fileList: UploadFile[] | undefined): string | null => {
    if (!fileList?.length) return null;
    const done = fileList.find((f) => f.status === 'done');
    if (!done?.response) return null;
    const res = Array.isArray(done.response) ? done.response[0] : done.response;
    return (res as any)?.path ?? (res as any)?.url ?? null;
  };

  const evidenceUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    maxCount: 1,
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
    const prefill: Partial<AddFormType> = {
      onlinePlatformProjectCode: initialRecord.projectCode ?? initialRecord.id ?? undefined,
      projectName: initialRecord.projectName ?? undefined,
      constructionContentAndScale: initialRecord.projectContent ?? undefined,
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

  const handleCancel = () => {
    form.resetFields();
    setParkOptions([]);
    onCancel();
  };

  const onFinish: FormProps<AddFormType>['onFinish'] = async (values) => {
    setLoading(true);
    try {
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

      const projectData: any = {
        projectName: values.projectName || null,
        district: values.district || null,
        park: toNull(values.park),
        constructionLocation: toNull(values.constructionLocation),
        constructionContentAndScale: toNull(values.constructionContentAndScale),
        mainProductsAndCapacity: toNull(values.mainProductsAndCapacity),
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
        annualPlannedInvestment: toNull(values.annualPlannedInvestment),
        annualImageProgress: toNull(values.annualImageProgress),
        estimatedStartDate: values.estimatedStartDate
          ? dayjs(values.estimatedStartDate).toDate()
          : null,
        actualOrEstimatedStartDate: values.actualOrEstimatedStartDate
          ? dayjs(values.actualOrEstimatedStartDate).toDate()
          : null,
        firstFullProductionDate: values.firstFullProductionDate
          ? dayjs(values.firstFullProductionDate).toDate()
          : null,
        industryCode: toNull(values.industryCode),
        industryName: toNull(values.industryCode),
        isExpansionOrReinvestment:
          values.isExpansionOrReinvestment !== undefined
            ? values.isExpansionOrReinvestment
            : null,
        investorName: toNull(values.investorName),
        unifiedSocialCreditCode: toNull(values.unifiedSocialCreditCode),
        investorNature: Array.isArray(values.investorNature)
          ? values.investorNature.join(',')
          : toNull(values.investorNature),
        investorIntroduction: toNull(values.investorIntroduction),
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
        isHighPollutionHighEnergy:
          values.isHighPollutionHighEnergy !== undefined
            ? values.isHighPollutionHighEnergy
            : null,
        energyReviewOpinion: toNull(
          getPathFromFileList(values.energyReviewOpinion as any) ??
            (typeof values.energyReviewOpinion === 'string'
              ? values.energyReviewOpinion
              : null)
        ),
        environmentalImpactDescription: toNull(values.environmentalImpactDescription),
        eiaApprovalStatus: toNull(
          getPathFromFileList(values.eiaApprovalStatus as any) ??
            (typeof values.eiaApprovalStatus === 'string'
              ? values.eiaApprovalStatus
              : null)
        ),
        isHighTechEnterprise:
          values.isHighTechEnterprise !== undefined ? values.isHighTechEnterprise : null,
        rdPlatformLevel: toNull(values.rdPlatformLevel),
        avgRdIntensityLast3years: toNull(values.avgRdIntensityLast3years),
        ledByHighLevelTalent:
          values.ledByHighLevelTalent !== undefined ? values.ledByHighLevelTalent : null,
        intellectualPropertyInfo: toNull(values.intellectualPropertyInfo),
        filingStatus: toNull(values.isFilingDisplay),
        filingEvidence: toNull(
          getPathFromFileList(values.filingDocUrlDisplay as any) ??
            (typeof values.filingDocUrlDisplay === 'string'
              ? values.filingDocUrlDisplay
              : null)
        ),
        onlinePlatformProjectCode: toNull(values.onlinePlatformProjectCode),
        safetyProductionStatus: toNull(values.hasSafetyApprovalDisplay),
        safetyEvaluationApproval: toNull(
          getPathFromFileList(values.safetyEvaluationApproval as any) ??
            (typeof values.safetyEvaluationApproval === 'string'
              ? values.safetyEvaluationApproval
              : null)
        ),
        isInStatisticalDatabase:
          values.isInStatisticalDatabase !== undefined
            ? values.isInStatisticalDatabase
            : null,
        statisticalDatabaseCode: toNull(values.statisticalDatabaseCode),
        projectHighlights: toNull(values.projectHighlights),
        supportingDocumentsUrl: toNull(
          getPathFromFileList(values.supportingDocumentsUrl as any) ??
            (typeof values.supportingDocumentsUrl === 'string'
              ? values.supportingDocumentsUrl
              : null)
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

      await primeApi.createProjectKeyProject({
        projectKeyProjectDto: projectData,
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
        <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
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
                  onChange={(v) => form.setFieldValue('constructionLocation', v)}
                />
              </Form.Item>
            </Col>
          </Row>
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
                    <Form.Item<AddFormType> label="8+13+X" name="industrySubCategoryDisplay">
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
              <Form.Item<AddFormType> label="投资类型" name="plannedInvestmentTypeDisplay">
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
                    <Form.Item<AddFormType> label="本期金额（万元）" name="amountPerPhaseDisplay">
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
                name="industryName"
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
              <Form.Item<AddFormType> label="研发平台" name="rdPlatformLevel">
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
              <Form.Item<AddFormType> label="发明专利（件）" name="inventionPatentCountDisplay">
                <InputNumber style={{ width: '100%' }} placeholder="选填" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<AddFormType>
                label="实用新型或外观专利（件）"
                name="utilityPatentCountDisplay"
              >
                <InputNumber style={{ width: '100%' }} placeholder="选填" min={0} />
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
                valuePropName="checked"
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
                    <Form.Item<AddFormType>
                      label="节能审查佐证资料"
                      name="energyReviewOpinion"
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
              <Form.Item<AddFormType> label="是否完成环评" name="eiaCompletedDisplay">
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
              <Form.Item<AddFormType> label="是否备案" name="isFilingDisplay">
                <Radio.Group>
                  <Radio value="是">是</Radio>
                  <Radio value="否">否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<AddFormType> label="是否取得安评批复" name="hasSafetyApprovalDisplay">
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
          <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: '20px' }}>
            <Space>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default KeyProjectApplyModal;
