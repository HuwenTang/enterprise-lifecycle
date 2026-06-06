import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Pagination,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useMemo, useState } from 'react';
import { primeApi, systemApi } from '@/services/api';
import { useNavigate, useSearchParams } from '@umijs/max';
import type { ExportProjectKGRequest, ListProjectDigitalInvestmentAttractingRequest } from '@/services/apis/apis/PrimeApiApi';
import { usePersistedMoreSearch } from '@/hooks/usePersistedMoreSearch';
import { useDistrictParkOptions } from '@/hooks/useDistrictParkOptions';
import { dayjsToApiDatePreservingCalendarDay } from '@/utils/apiDate';
import dayjs from 'dayjs';
import { buildColumns } from './columns';
import type { FieldType } from './types';
import {
  inferInvestmentRangeFromUrlAmounts,
  investmentRangeToApiAmounts,
  parseUrlInvestmentAmount,
} from './investmentRange';

const { RangePicker } = DatePicker;

// ---------- 工具函数 ----------

const rangeToStartEnd = (r?: [dayjs.Dayjs, dayjs.Dayjs]) => {
  if (!r?.[0]?.isValid?.() || !r?.[1]?.isValid?.())
    return { start: undefined as Date | undefined, end: undefined as Date | undefined };
  return {
    start: dayjsToApiDatePreservingCalendarDay(r[0]),
    end: dayjsToApiDatePreservingCalendarDay(r[1]),
  };
};

function buildKgListApiFilters(values: FieldType): Omit<ListProjectDigitalInvestmentAttractingRequest, 'page' | 'size'> {
  const currentProgress = values.currentProjectProgress?.length
    ? values.currentProjectProgress
    : undefined;
  const apply = rangeToStartEnd(values.applyTimeRange);
  const start = rangeToStartEnd(values.startTimeRange);
  const approvalComplete = rangeToStartEnd(values.startApprovalTimeRange);
  const sas =
    values.startApprovalstatus !== undefined &&
    values.startApprovalstatus !== null &&
    values.startApprovalstatus !== ''
      ? Number(values.startApprovalstatus)
      : undefined;
  return {
    showAll: true,
    isStartApproval: true,
    projectName: values.projectName || undefined,
    projectContent: values.projectContent || undefined,
    currentProjectProgress: currentProgress,
    investmentFlag: values.investmentFlag || undefined,
    industryOrService: values.industryOrService || undefined,
    district: values.district || undefined,
    park: values.park || undefined,
    projectSource: values.projectSource || undefined,
    attractorUnit: values.attractorUnit,
    investor: values.investor || undefined,
    ...investmentRangeToApiAmounts(values.investmentAmountRange),
    startTime1: start.start,
    startTime2: start.end,
    applyTime1: apply.start,
    applyTime2: apply.end,
    startApprovalTime1: approvalComplete.start,
    startApprovalTime2: approvalComplete.end,
    startApprovalStatus: typeof sas === 'number' && Number.isFinite(sas) ? sas : undefined,
    isKc: values.isKc === true || values.isKc === false ? values.isKc : undefined,
    isQflp: values.isQflp === true || values.isQflp === false ? values.isQflp : undefined,
  };
}

// ---------- 主组件 ----------

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', marginBottom: 20 }}>
      <div style={{ marginRight: 10, width: 5, height: 16, background: '#005BF5', borderRadius: 2.5 }} />
      <div style={{ fontSize: 16, fontWeight: 'bolder' }}>{children}</div>
    </div>
  );
}

const ProjectManage5 = () => {
  const [form] = Form.useForm<FieldType>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMoreSearch, setShowMoreSearchPersist] = usePersistedMoreSearch();

  const {
    districtOptions,
    parkOptions: searchParkOptions,
    fullDistrictOpts,
    load: loadDistrictPark,
    updateParkByDistrict,
    inferDistrictByPark,
  } = useDistrictParkOptions();

  // 从 URL 读取初始值
  const urlParams = useMemo(() => {
    const p = searchParams;
    const a1 = parseUrlInvestmentAmount(p.get('investmentAmount1') ?? undefined);
    const a2 = parseUrlInvestmentAmount(p.get('investmentAmount2') ?? undefined);
    return {
      page: parseInt(p.get('page') || '1', 10),
      pageSize: parseInt(p.get('pageSize') || '10', 10),
      projectName: p.get('projectName') || undefined,
      currentProjectProgress: p.get('currentProjectProgress')?.split(',') ?? [],
      projectContent: p.get('projectContent') || undefined,
      attractorUnit: p.get('attractorUnit') || undefined,
      investmentFlag: p.get('investmentFlag') || undefined,
      industryOrService: p.get('industryOrService') || undefined,
      startApprovalstatus: p.get('startApprovalstatus') || undefined,
      district: p.get('district') || undefined,
      park: p.get('park') || undefined,
      projectSource: p.get('projectSource') || undefined,
      investor: p.get('investor') || undefined,
      investmentAmount1: a1,
      investmentAmount2: a2,
      investmentAmountRange: inferInvestmentRangeFromUrlAmounts(a1, a2) ?? 'all',
      applyTime1: p.get('applyTime1') || undefined,
      applyTime2: p.get('applyTime2') || undefined,
      startTime1: p.get('startTime1') || undefined,
      startTime2: p.get('startTime2') || undefined,
      startApprovalTime1: p.get('startApprovalTime1') || undefined,
      startApprovalTime2: p.get('startApprovalTime2') || undefined,
      isKc: p.get('isKc') === 'true' ? true : p.get('isKc') === 'false' ? false : undefined,
      isQflp: p.get('isQflp') === 'true' ? true : p.get('isQflp') === 'false' ? false : undefined,
    } as const;
  }, []);

  // 列表状态
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [progressOptions, setProgressOptions] = useState<{ value: string; label: string }[]>([]);
  const [reviewProgressOptions, setReviewProgressOptions] = useState<{ value: string; label: string }[]>([]);
  const [pagination, setPagination] = useState({
    current: urlParams.page,
    pageSize: urlParams.pageSize,
    total: 0,
  });

  // ---------- URL 参数更新 ----------

  const updateUrlParams = (params: Record<string, string | number | boolean | string[] | null | undefined>) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      if (value === null || value === '' || (Array.isArray(value) && !value.length)) {
        next.delete(key);
      } else if (Array.isArray(value)) {
        next.set(key, value.join(','));
      } else {
        next.set(key, String(value));
      }
    }
    setSearchParams(next);
  };

  // ---------- 数据获取 ----------

  const buildFetchParams = (page: number, size: number): ListProjectDigitalInvestmentAttractingRequest => {
    const v = form.getFieldsValue(true) as FieldType;
    const filters = buildKgListApiFilters(v);
    const urlA1 = parseUrlInvestmentAmount(searchParams.get('investmentAmount1') ?? undefined);
    const urlA2 = parseUrlInvestmentAmount(searchParams.get('investmentAmount2') ?? undefined);
    const presetFromUrl = inferInvestmentRangeFromUrlAmounts(urlA1, urlA2);
    const rangeIsAll = !v.investmentAmountRange || v.investmentAmountRange === 'all';
    if (rangeIsAll && presetFromUrl === undefined && (urlA1 !== undefined || urlA2 !== undefined)) {
      filters.investmentAmount1 = urlA1;
      filters.investmentAmount2 = urlA2;
    }
    return { ...filters, page, size };
  };

  const fetchData = async (params: ListProjectDigitalInvestmentAttractingRequest) => {
    setLoading(true);
    try {
      const data = await primeApi.listProjectDigitalInvestmentAttracting(params);
      setPagination((prev) => ({ ...prev, total: data.total }));
      setDataSource(data.records);
    } catch {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // ---------- 事件处理 ----------

  const onFinish = (values: FieldType) => {
    const inv = investmentRangeToApiAmounts(values.investmentAmountRange);
    updateUrlParams({
      page: 1,
      pageSize: pagination.pageSize,
      projectName: values.projectName || '',
      currentProjectProgress: values.currentProjectProgress ?? [],
      projectContent: values.projectContent || '',
      attractorUnit: values.attractorUnit || '',
      investmentFlag: values.investmentFlag || '',
      industryOrService: values.industryOrService || '',
      startApprovalstatus: values.startApprovalstatus || '',
      district: values.district || '',
      park: values.park || '',
      projectSource: values.projectSource || '',
      investor: values.investor || '',
      investmentAmount1: inv.investmentAmount1 != null ? String(inv.investmentAmount1) : '',
      investmentAmount2: inv.investmentAmount2 != null ? String(inv.investmentAmount2) : '',
      applyTime1: values.applyTimeRange?.[0]?.format('YYYY-MM-DD') ?? '',
      applyTime2: values.applyTimeRange?.[1]?.format('YYYY-MM-DD') ?? '',
      startTime1: values.startTimeRange?.[0]?.format('YYYY-MM-DD') ?? '',
      startTime2: values.startTimeRange?.[1]?.format('YYYY-MM-DD') ?? '',
      startApprovalTime1: values.startApprovalTimeRange?.[0]?.format('YYYY-MM-DD') ?? '',
      startApprovalTime2: values.startApprovalTimeRange?.[1]?.format('YYYY-MM-DD') ?? '',
      isKc: values.isKc === true ? 'true' : values.isKc === false ? 'false' : '',
      isQflp: values.isQflp === true ? 'true' : values.isQflp === false ? 'false' : '',
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData(buildFetchParams(1, pagination.pageSize));
  };

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue({ investmentAmountRange: 'all' });
    updateParkByDistrict(undefined);
    updateUrlParams({
      page: 1, pageSize: 10,
      projectName: '', currentProjectProgress: [], projectContent: '',
      attractorUnit: '', investmentFlag: '', industryOrService: '',
      startApprovalstatus: '', district: '', park: '', projectSource: '',
      investor: '', investmentAmount1: '', investmentAmount2: '',
      applyTime1: '', applyTime2: '', startTime1: '', startTime2: '',
      startApprovalTime1: '', startApprovalTime2: '', isKc: '', isQflp: '',
    });
    setPagination((prev) => ({ ...prev, current: 1, pageSize: 10 }));
    fetchData(buildFetchParams(1, 10));
  };

  const handlePageChange = (page: number, pageSize: number) => {
    updateUrlParams({ page, pageSize });
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    fetchData(buildFetchParams(page, pageSize));
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const listParams = buildFetchParams(pagination.current, pagination.pageSize);
      const exportParams = Object.fromEntries(
        Object.entries(listParams).filter(([k]) => k !== 'page' && k !== 'size'),
      ) as ExportProjectKGRequest;
      const res = await primeApi.exportProjectKG(exportParams);
      if (!res?.path) { message.error('导出失败：未获取到文件路径'); return; }
      let fileUrl = res.path;
      if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://'))
        fileUrl = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
      const a = Object.assign(document.createElement('a'), {
        href: fileUrl, download: res.name || '导出文件.xlsx',
        target: '_blank', style: { display: 'none' },
      });
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 100);
      message.success('导出成功');
    } catch (err: any) {
      message.error(err?.message || '导出失败');
    } finally {
      setExporting(false);
    }
  };

  // ---------- 初始化 ----------

  useEffect(() => {
    // 字典
    systemApi.getDictItems({ catalog: 'project_progress' }).then((res: any[]) => {
      setProgressOptions(
        res.map((item) => ({ value: String(item.code ?? item.value ?? ''), label: item.label })),
      );
    }).catch(() => {});

    systemApi.getDictItems({ catalog: 'review_progress_kg' }).then((res: any[]) => {
      setReviewProgressOptions(
        res.filter((item) => item.enabled).map((item) => ({ value: item.code, label: item.label })),
      );
    }).catch(() => {});

    // 区划
    loadDistrictPark();

    // 表单初始值
    form.setFieldsValue({
      projectName: urlParams.projectName,
      currentProjectProgress: urlParams.currentProjectProgress,
      projectContent: urlParams.projectContent,
      attractorUnit: urlParams.attractorUnit,
      investmentFlag: urlParams.investmentFlag,
      industryOrService: urlParams.industryOrService,
      startApprovalstatus: urlParams.startApprovalstatus,
      district: urlParams.district,
      park: urlParams.park,
      projectSource: urlParams.projectSource,
      investor: urlParams.investor,
      investmentAmountRange: urlParams.investmentAmountRange,
      isKc: urlParams.isKc,
      isQflp: urlParams.isQflp,
      applyTimeRange: urlParams.applyTime1 && urlParams.applyTime2
        ? [dayjs(urlParams.applyTime1), dayjs(urlParams.applyTime2)] : undefined,
      startTimeRange: urlParams.startTime1 && urlParams.startTime2
        ? [dayjs(urlParams.startTime1), dayjs(urlParams.startTime2)] : undefined,
      startApprovalTimeRange: urlParams.startApprovalTime1 && urlParams.startApprovalTime2
        ? [dayjs(urlParams.startApprovalTime1), dayjs(urlParams.startApprovalTime2)] : undefined,
    });

    // 首屏数据
    const initialFilters = buildKgListApiFilters({
      projectName: urlParams.projectName,
      currentProjectProgress: urlParams.currentProjectProgress,
      projectContent: urlParams.projectContent,
      attractorUnit: urlParams.attractorUnit,
      investmentFlag: urlParams.investmentFlag,
      industryOrService: urlParams.industryOrService,
      startApprovalstatus: urlParams.startApprovalstatus,
      district: urlParams.district,
      park: urlParams.park,
      projectSource: urlParams.projectSource,
      investor: urlParams.investor,
      investmentAmountRange: urlParams.investmentAmountRange as any,
      isKc: urlParams.isKc,
      isQflp: urlParams.isQflp,
      applyTimeRange: urlParams.applyTime1 && urlParams.applyTime2
        ? [dayjs(urlParams.applyTime1), dayjs(urlParams.applyTime2)] as [dayjs.Dayjs, dayjs.Dayjs] : undefined,
      startTimeRange: urlParams.startTime1 && urlParams.startTime2
        ? [dayjs(urlParams.startTime1), dayjs(urlParams.startTime2)] as [dayjs.Dayjs, dayjs.Dayjs] : undefined,
      startApprovalTimeRange: urlParams.startApprovalTime1 && urlParams.startApprovalTime2
        ? [dayjs(urlParams.startApprovalTime1), dayjs(urlParams.startApprovalTime2)] as [dayjs.Dayjs, dayjs.Dayjs] : undefined,
    });
    if (
      inferInvestmentRangeFromUrlAmounts(urlParams.investmentAmount1, urlParams.investmentAmount2) === undefined &&
      (urlParams.investmentAmount1 !== undefined || urlParams.investmentAmount2 !== undefined)
    ) {
      initialFilters.investmentAmount1 = urlParams.investmentAmount1;
      initialFilters.investmentAmount2 = urlParams.investmentAmount2;
    }
    fetchData({ ...initialFilters, page: urlParams.page, size: urlParams.pageSize });
  }, []);

  // 区划加载完成后联动板块
  useEffect(() => {
    if (!fullDistrictOpts.length) return;
    let districtVal = urlParams.district;
    if (!districtVal && urlParams.park) {
      districtVal = inferDistrictByPark(urlParams.park);
      if (districtVal) form.setFieldValue('district', districtVal);
    }
    updateParkByDistrict(districtVal || undefined);
  }, [fullDistrictOpts]);

  // ---------- 表格列 ----------

  const columns = useMemo(
    () =>
      buildColumns({
        pagination,
        onDetail: (record) => {
          if (record.currentProjectProgress) {
            navigate(`/xmgl/xmjd?id=${record.id}`);
          } else {
            message.info('当前项目暂无进度');
          }
        },
        onStartApproval: (record) =>
          navigate(`/xmgl/pro-start?id=${record.id}&zsid=${record.projectCode}`),
      }),
    [pagination.current, pagination.pageSize],
  );

  // ---------- 渲染 ----------

  return (
    <div style={{ display: 'flex' }}>
      <PageContainer
        style={{ width: '100%', height: '90vh', overflow: 'auto', scrollbarWidth: 'none' }}
        content="欢迎使用项目管理模块"
      >
        <div style={{ padding: 20, backgroundColor: 'white' }}>
          <div style={{ padding: 20, backgroundImage: 'url(/pm-bg1.png)', backgroundSize: '100% 100%' }}>
            <SectionTitle>查询</SectionTitle>
            <Form
              form={form}
              layout="horizontal"
              autoComplete="off"
              initialValues={{ investmentAmountRange: 'all' }}
              onFinish={onFinish}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item<FieldType> label="项目名称" name="projectName">
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="项目内容" name="projectContent">
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="项目类别" name="investmentFlag">
                    <Select allowClear placeholder="全部" options={[{ value: '1', label: '内资' }, { value: '2', label: '外资' }]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="所属产业" name="industryOrService">
                    <Select allowClear placeholder="全部" options={[{ value: '工业', label: '工业' }, { value: '服务业', label: '服务业' }]} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item<FieldType> label="项目状态" name="currentProjectProgress">
                    <Select mode="multiple" allowClear options={progressOptions} maxTagCount={2} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="投资额" name="investmentAmountRange">
                    <Select allowClear placeholder="全部" options={[
                      { value: 'all', label: '全部' },
                      { value: 'above100000', label: '10亿（1亿美元）以上' },
                      { value: 'above50000', label: '5亿（3000万美元）以上' },
                      { value: 'above10000', label: '1亿（1000万美元）以上' },
                      { value: 'mid500to10000', label: '500万-1亿（1000万美元）' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="所属市（区）" name="district">
                    <Select allowClear showSearch placeholder="全部" optionFilterProp="label" options={districtOptions}
                      onChange={(v) => { updateParkByDistrict(v); form.setFieldValue('park', undefined); }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="所属板块" name="park">
                    <Select allowClear showSearch optionFilterProp="label"
                      placeholder={searchParkOptions.length ? '请选择所属板块' : '请先选择所属市'}
                      options={searchParkOptions} />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ display: showMoreSearch ? 'block' : 'none' }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item<FieldType> label="项目来源" name="projectSource">
                      <Select allowClear placeholder="全部" options={[
                        { value: '市级机关推荐', label: '市级机关推荐' },
                        { value: '自行接洽', label: '自行接洽' },
                        { value: '增资扩产', label: '增资扩产' },
                      ]} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="招引单位" name="attractorUnit">
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="投资方名称" name="investor">
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="开工时间" name="startTimeRange">
                      <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item<FieldType> label="是否科创项目" name="isKc">
                      <Select allowClear placeholder="全部" options={[{ value: true, label: '是' }, { value: false, label: '否' }]} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="是否QFLP外资项目" name="isQflp">
                      <Select allowClear placeholder="全部" options={[{ value: true, label: '是' }, { value: false, label: '否' }]} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="申请时间" name="applyTimeRange">
                      <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="审核状态" name="startApprovalstatus">
                      <Select allowClear placeholder="全部" options={reviewProgressOptions} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item<FieldType> label="审核完成时间" name="startApprovalTimeRange">
                      <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                      <Button type="primary" htmlType="submit">查询</Button>
                      <Button onClick={() => setShowMoreSearchPersist((p) => !p)}>
                        {showMoreSearch ? '收起查询' : '更多查询'}
                      </Button>
                      <Button onClick={handleReset}>重置</Button>
                      <Button loading={exporting} onClick={handleExport}>导出</Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          <Table
            style={{ marginTop: 20 }}
            tableLayout="fixed"
            rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            columns={columns}
            bordered
            dataSource={dataSource}
            pagination={false}
            loading={loading}
            scroll={{ x: 1060 }}
          />
          <Pagination
            showSizeChanger
            current={pagination.current}
            pageSize={pagination.pageSize}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            onChange={handlePageChange}
            style={{ marginTop: 16 }}
          />
        </div>
      </PageContainer>
    </div>
  );
};

export default ProjectManage5;
