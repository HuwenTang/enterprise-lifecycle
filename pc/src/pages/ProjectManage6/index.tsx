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
import type {
  ExportProjectJG1Request,
  ListProjectDigitalInvestmentAttractingRequest,
} from '@/services/apis/apis/PrimeApiApi';
import { PageContainer } from '@ant-design/pro-components';
import { usePersistedMoreSearch } from '@/hooks/usePersistedMoreSearch';
import { useDistrictParkOptions } from '@/hooks/useDistrictParkOptions';
import { useEffect, useMemo, useState } from 'react';
import { primeApi, systemApi } from '@/services/api';
import { useNavigate, useSearchParams } from '@umijs/max';
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

function buildCompletionFilters(
  values: FieldType,
): Omit<ListProjectDigitalInvestmentAttractingRequest, 'page' | 'size'> {
  const applyR = rangeToStartEnd(values.applyTimeRange);
  const endR = rangeToStartEnd(values.endTimeRange);
  const endApprovalR = rangeToStartEnd(values.endApprovalTimeRange);
  const currentProgress = values.currentProjectProgress?.length
    ? values.currentProjectProgress
    : undefined;
  return {
    showAll: true,
    isCompletionApproval: true,
    projectName: values.projectName || undefined,
    projectContent: values.projectContent || undefined,
    investmentFlag: values.investmentFlag || undefined,
    industryOrService: values.industryOrService || undefined,
    currentProjectProgress: currentProgress,
    ...investmentRangeToApiAmounts(values.investmentAmountRange),
    district: values.district || undefined,
    park: values.park || undefined,
    projectSource: values.projectSource || undefined,
    attractorUnit: values.attractorUnit || undefined,
    investor: values.investor || undefined,
    applyTime1: applyR.start,
    applyTime2: applyR.end,
    endTime1: endR.start,
    endTime2: endR.end,
    endApprovalStatus: values.endApprovalStatus || undefined,
    endApprovalTime1: endApprovalR.start,
    endApprovalTime2: endApprovalR.end,
  };
}

// ---------- SectionTitle ----------

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', marginBottom: 20 }}>
      <div style={{ marginRight: 10, width: 5, height: 16, background: '#005BF5', borderRadius: 2.5 }} />
      <div style={{ fontSize: 16, fontWeight: 'bolder' }}>{children}</div>
    </div>
  );
}

// ---------- 主组件 ----------

const ProjectManage6 = () => {
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
      investor: p.get('investor') || undefined,
      industryOrService: p.get('industryOrService') || undefined,
      investmentFlag: p.get('investmentFlag') || undefined,
      endApprovalStatus: p.get('endApprovalStatus') || undefined,
      applyTime1: p.get('applyTime1') || undefined,
      applyTime2: p.get('applyTime2') || undefined,
      endTime1: p.get('endTime1') || undefined,
      endTime2: p.get('endTime2') || undefined,
      endApprovalTime1: p.get('endApprovalTime1') || undefined,
      endApprovalTime2: p.get('endApprovalTime2') || undefined,
      park: p.get('park') || undefined,
      district: p.get('district') || undefined,
      projectSource: p.get('projectSource') || undefined,
      investmentAmount1: a1,
      investmentAmount2: a2,
      investmentAmountRange: inferInvestmentRangeFromUrlAmounts(a1, a2) ?? 'all',
    } as const;
  }, []);

  // 列表状态
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [progressOptions, setProgressOptions] = useState<{ value: string; label: string }[]>([]);
  const [pagination, setPagination] = useState({
    current: urlParams.page,
    pageSize: urlParams.pageSize,
    total: 0,
  });

  const endApprovalStatusOptions = [
    { value: '审核未完成', label: '审核未完成' },
    { value: '审核通过', label: '审核通过' },
    { value: '审核不通过', label: '审核不通过' },
  ];

  // ---------- URL 参数更新 ----------

  const updateUrlParams = (params: Record<string, string | number | string[] | null | undefined>) => {
    const next = new URLSearchParams(searchParams);
    next.delete('projectCode');
    next.delete('year');
    next.delete('projectCategory');
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

  const buildFetchParams = (
    page: number,
    size: number,
  ): ListProjectDigitalInvestmentAttractingRequest => {
    const v = form.getFieldsValue(true) as FieldType;
    const filters = buildCompletionFilters(v);
    const urlA1 = parseUrlInvestmentAmount(searchParams.get('investmentAmount1') ?? undefined);
    const urlA2 = parseUrlInvestmentAmount(searchParams.get('investmentAmount2') ?? undefined);
    const presetFromUrl = inferInvestmentRangeFromUrlAmounts(urlA1, urlA2);
    const rangeIsAll = !v.investmentAmountRange || v.investmentAmountRange === 'all';
    if (rangeIsAll && presetFromUrl === undefined && (urlA1 !== undefined || urlA2 !== undefined)) {
      (filters as any).investmentAmount1 = urlA1;
      (filters as any).investmentAmount2 = urlA2;
    }
    return { ...filters, page, size };
  };

  const fetchData = async (params: ListProjectDigitalInvestmentAttractingRequest) => {
    setLoading(true);
    try {
      const data = await primeApi.listProjectDigitalInvestmentAttracting(params);
      setPagination((prev) => ({ ...prev, total: data.total }));
      setDataSource(data.records ?? []);
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
      investor: values.investor || '',
      industryOrService: values.industryOrService || '',
      investmentFlag: values.investmentFlag || '',
      endApprovalStatus: values.endApprovalStatus || '',
      park: values.park || '',
      district: values.district || '',
      projectSource: values.projectSource || '',
      investmentAmount1: inv.investmentAmount1 != null ? String(inv.investmentAmount1) : '',
      investmentAmount2: inv.investmentAmount2 != null ? String(inv.investmentAmount2) : '',
      applyTime1: values.applyTimeRange?.[0]?.format('YYYY-MM-DD') ?? '',
      applyTime2: values.applyTimeRange?.[1]?.format('YYYY-MM-DD') ?? '',
      endTime1: values.endTimeRange?.[0]?.format('YYYY-MM-DD') ?? '',
      endTime2: values.endTimeRange?.[1]?.format('YYYY-MM-DD') ?? '',
      endApprovalTime1: values.endApprovalTimeRange?.[0]?.format('YYYY-MM-DD') ?? '',
      endApprovalTime2: values.endApprovalTimeRange?.[1]?.format('YYYY-MM-DD') ?? '',
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
      attractorUnit: '', investor: '', industryOrService: '', investmentFlag: '',
      endApprovalStatus: '', park: '', district: '', projectSource: '',
      investmentAmount1: '', investmentAmount2: '',
      applyTime1: '', applyTime2: '', endTime1: '', endTime2: '',
      endApprovalTime1: '', endApprovalTime2: '',
    });
    setPagination((prev) => ({ ...prev, current: 1, pageSize: 10 }));
    fetchData({ showAll: true, isCompletionApproval: true, page: 1, size: 10 });
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
      ) as ExportProjectJG1Request;
      const res = await primeApi.exportProjectJG1(exportParams);
      if (!res?.path) { message.error('导出失败：未获取到文件路径'); return; }
      const cleanedPath = String(res.path).replace(/#+$/, '');
      const fileUrl = cleanedPath.startsWith('http') ? cleanedPath : `${window.location.origin}${cleanedPath.startsWith('/') ? '' : '/'}${cleanedPath}`;
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
        res.filter((item) => item.enabled)
          .map((item) => ({ value: item.value, label: item.label, sort: item.sort }))
          .sort((a, b) => a.sort - b.sort),
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
      investor: urlParams.investor,
      industryOrService: urlParams.industryOrService,
      investmentFlag: urlParams.investmentFlag,
      endApprovalStatus: urlParams.endApprovalStatus,
      projectSource: urlParams.projectSource,
      district: urlParams.district,
      park: urlParams.park,
      investmentAmountRange: urlParams.investmentAmountRange,
      applyTimeRange: urlParams.applyTime1 && urlParams.applyTime2
        ? [dayjs(urlParams.applyTime1), dayjs(urlParams.applyTime2)] : undefined,
      endTimeRange: urlParams.endTime1 && urlParams.endTime2
        ? [dayjs(urlParams.endTime1), dayjs(urlParams.endTime2)] : undefined,
      endApprovalTimeRange: urlParams.endApprovalTime1 && urlParams.endApprovalTime2
        ? [dayjs(urlParams.endApprovalTime1), dayjs(urlParams.endApprovalTime2)] : undefined,
    });

    // 首屏数据
    const initialFilters = buildCompletionFilters({
      projectName: urlParams.projectName,
      currentProjectProgress: urlParams.currentProjectProgress,
      projectContent: urlParams.projectContent,
      attractorUnit: urlParams.attractorUnit,
      investor: urlParams.investor,
      industryOrService: urlParams.industryOrService,
      investmentFlag: urlParams.investmentFlag,
      endApprovalStatus: urlParams.endApprovalStatus,
      projectSource: urlParams.projectSource,
      district: urlParams.district,
      park: urlParams.park,
      investmentAmountRange: urlParams.investmentAmountRange as any,
      applyTimeRange: urlParams.applyTime1 && urlParams.applyTime2
        ? [dayjs(urlParams.applyTime1), dayjs(urlParams.applyTime2)] as [dayjs.Dayjs, dayjs.Dayjs] : undefined,
      endTimeRange: urlParams.endTime1 && urlParams.endTime2
        ? [dayjs(urlParams.endTime1), dayjs(urlParams.endTime2)] as [dayjs.Dayjs, dayjs.Dayjs] : undefined,
      endApprovalTimeRange: urlParams.endApprovalTime1 && urlParams.endApprovalTime2
        ? [dayjs(urlParams.endApprovalTime1), dayjs(urlParams.endApprovalTime2)] as [dayjs.Dayjs, dayjs.Dayjs] : undefined,
    });
    if (
      inferInvestmentRangeFromUrlAmounts(urlParams.investmentAmount1, urlParams.investmentAmount2) === undefined &&
      (urlParams.investmentAmount1 !== undefined || urlParams.investmentAmount2 !== undefined)
    ) {
      (initialFilters as any).investmentAmount1 = urlParams.investmentAmount1;
      (initialFilters as any).investmentAmount2 = urlParams.investmentAmount2;
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
        onDetail: (record) => {
          if (record.currentProjectProgress) {
            navigate(`/xmgl/xmjd?id=${record.id}`);
          } else {
            message.info('当前项目暂无进度');
          }
        },
        onCompletionApproval: (record) =>
          navigate(`/xmgl/pro-end?id=${record.id}&zsid=${record.projectCode}`),
      }),
    [],
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
                    <Select mode="multiple" allowClear options={progressOptions} maxTagCount="responsive" />
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
                    <Select allowClear showSearch placeholder="全部" optionFilterProp="label"
                      options={districtOptions}
                      onChange={(v) => { updateParkByDistrict(v); form.setFieldValue('park', undefined); }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="所属板块" name="park">
                    <Select allowClear showSearch optionFilterProp="label"
                      placeholder={searchParkOptions.length ? '请选择所属板块' : '请先选择所属市（区）'}
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
                    <Form.Item<FieldType> label="竣工时间" name="endTimeRange">
                      <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item<FieldType> label="申请时间" name="applyTimeRange">
                      <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="审核状态" name="endApprovalStatus">
                      <Select allowClear options={endApprovalStatusOptions} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="审核完成时间" name="endApprovalTimeRange">
                      <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={6} />
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
            showSizeChanger={false}
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

export default ProjectManage6;
