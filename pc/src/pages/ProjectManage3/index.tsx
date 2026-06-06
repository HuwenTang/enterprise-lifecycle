import { useDistrictParkOptions } from '@/hooks/useDistrictParkOptions';
import { usePersistedMoreSearch } from '@/hooks/usePersistedMoreSearch';
import { primeApi, systemApi } from '@/services/api';
import type {
  ExportProjectRequest,
  ListProjectDigitalInvestmentAttractingRequest,
} from '@/services/apis/apis/PrimeApiApi';
import { dayjsToApiDatePreservingCalendarDay } from '@/utils/apiDate';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate, useSearchParams } from '@umijs/max';
import {
  Button, Col, DatePicker, Form, FormProps, Input,
  message, Pagination, Row, Select, Space, Table,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import {
  inferInvestmentRangeFromUrlAmounts,
  investmentRangeToApiAmounts,
  parseUrlInvestmentAmount,
} from '../ProjectManage/investmentRange';
import type { InvestmentAmountRange } from '../ProjectManage/types';
import { buildColumns } from './columns';

const { RangePicker } = DatePicker;

type FieldType = {
  projectName?: string;
  currentProjectProgress?: string[];
  projectContent?: string;
  attractorUnit?: string;
  investmentFlag?: string;
  industryOrService?: string;
  signedProjectStatus?: string;
  district?: string;
  park?: string;
  projectSource?: string;
  investor?: string;
  investmentAmountRange?: InvestmentAmountRange;
  signingDateRange?: [dayjs.Dayjs, dayjs.Dayjs];
  signingStatRange?: [dayjs.Dayjs, dayjs.Dayjs];
  applyTimeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  isKc?: boolean;
  isQflp?: boolean;
};

const rangeToStartEnd = (r?: [dayjs.Dayjs, dayjs.Dayjs]) => {
  if (!r?.[0]?.isValid?.() || !r?.[1]?.isValid?.()) return { start: undefined, end: undefined };
  return {
    start: dayjsToApiDatePreservingCalendarDay(r[0]),
    end: dayjsToApiDatePreservingCalendarDay(r[1]),
  };
};

function buildListApiFilters(
  values: FieldType,
): Partial<ListProjectDigitalInvestmentAttractingRequest> {
  const cp = values.currentProjectProgress?.length ? values.currentProjectProgress : undefined;
  const signingActual = rangeToStartEnd(values.signingDateRange);
  const signingStat = rangeToStartEnd(values.signingStatRange);
  const applyR = rangeToStartEnd(values.applyTimeRange);
  const signed =
    values.signedProjectStatus !== undefined && values.signedProjectStatus !== ''
      ? Number(values.signedProjectStatus)
      : undefined;
  return {
    showAll: true,
    isProjectReview: true,
    projectName: values.projectName || undefined,
    currentProjectProgress: cp,
    projectContent: values.projectContent || undefined,
    district: values.district || undefined,
    park: values.park || undefined,
    investor: values.investor || undefined,
    attractorUnit: values.attractorUnit,
    investmentFlag: values.investmentFlag || undefined,
    industryOrService: values.industryOrService || undefined,
    signedProjectStatus:
      typeof signed === 'number' && Number.isFinite(signed) ? signed : undefined,
    projectSource: values.projectSource || undefined,
    ...investmentRangeToApiAmounts(values.investmentAmountRange),
    actualSigningTime1: signingActual.start,
    actualSigningTime2: signingActual.end,
    signingTime1: signingStat.start,
    signingTime2: signingStat.end,
    applyTime1: applyR.start,
    applyTime2: applyR.end,
    isKc: values.isKc === true || values.isKc === false ? values.isKc : undefined,
    isQflp: values.isQflp === true || values.isQflp === false ? values.isQflp : undefined,
  } as Partial<ListProjectDigitalInvestmentAttractingRequest>;
}

const ProjectManage3 = () => {
  const [form] = Form.useForm<FieldType>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMoreSearch, setShowMoreSearchPersist] = usePersistedMoreSearch();

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
  const [progressOptions, setProgressOptions] = useState<
    { value: string; label: string; enabled: boolean; sort: number; code: string }[]
  >([]);
  const [reviewProgressOptions, setReviewProgressOptions] = useState<
    { value: string; label: string }[]
  >([]);
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
      currentProjectProgress: p.get('currentProjectProgress')?.split(',') ?? [],
      projectContent: p.get('projectContent') || '',
      attractorUnit: p.get('attractorUnit') || '',
      industryOrService: p.get('industryOrService') || undefined,
      signedProjectStatus: p.get('signedProjectStatus') || undefined,
      investmentFlag: p.get('investmentFlag') || undefined,
      district: p.get('district') || undefined,
      park: p.get('park') || undefined,
      projectSource: p.get('projectSource') || undefined,
      investor: p.get('investor') || '',
      investmentAmount1: a1,
      investmentAmount2: a2,
      investmentAmountRange: inferInvestmentRangeFromUrlAmounts(a1, a2) ?? 'all',
      actualSigningTime1:
        p.get('actualSigningTime1') || p.get('signingDate1') || undefined,
      actualSigningTime2:
        p.get('actualSigningTime2') || p.get('signingDate2') || undefined,
      signingTime1: p.get('signingTime1') || undefined,
      signingTime2: p.get('signingTime2') || undefined,
      applyTime1: p.get('applyTime1') || undefined,
      applyTime2: p.get('applyTime2') || undefined,
      isKc:
        p.get('isKc') === 'true' ? true : p.get('isKc') === 'false' ? false : undefined as boolean | undefined,
      isQflp:
        p.get('isQflp') === 'true' ? true : p.get('isQflp') === 'false' ? false : undefined as boolean | undefined,
      page: parseInt(p.get('page') || '1', 10),
      pageSize: parseInt(p.get('pageSize') || '10', 10),
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUrlParams = (
    params: Record<string, string | number | boolean | string[] | null | undefined>,
  ) => {
    const next = new URLSearchParams(searchParams);
    next.delete('signingDate1');
    next.delete('signingDate2');
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        next.delete(key);
      } else if (Array.isArray(value)) {
        next.set(key, value.join(','));
      } else {
        next.set(key, String(value));
      }
    }
    setSearchParams(next);
  };

  const fetchData = async (params: Partial<ListProjectDigitalInvestmentAttractingRequest>) => {
    setLoading(true);
    try {
      const data = await primeApi.listProjectDigitalInvestmentAttracting(
        params as ListProjectDigitalInvestmentAttractingRequest,
      );
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        current: data.page,
        pageSize: data.size,
      }));
      setDataSource(data.records);
    } catch (e: unknown) {
      message.error(e instanceof Error ? e.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const getListRequestParams = (
    page: number,
    size: number,
  ): ListProjectDigitalInvestmentAttractingRequest => {
    const v = form.getFieldsValue(true) as FieldType;
    let filters = buildListApiFilters(v);
    const rangeIsAll = !v.investmentAmountRange || v.investmentAmountRange === 'all';
    const presetFromUrl = inferInvestmentRangeFromUrlAmounts(
      urlParams.investmentAmount1,
      urlParams.investmentAmount2,
    );
    if (
      rangeIsAll &&
      presetFromUrl === undefined &&
      (urlParams.investmentAmount1 !== undefined || urlParams.investmentAmount2 !== undefined)
    ) {
      filters = {
        ...filters,
        investmentAmount1: urlParams.investmentAmount1,
        investmentAmount2: urlParams.investmentAmount2,
      };
    }
    return { ...filters, page, size } as ListProjectDigitalInvestmentAttractingRequest;
  };

  useEffect(() => {
    systemApi
      .getDictItems({ catalog: 'project_progress' })
      .then((res) => {
        if (Array.isArray(res)) setProgressOptions(res as any);
      })
      .catch(() => {});

    systemApi
      .getDictItems({ catalog: 'review_progress' })
      .then((res) => {
        if (Array.isArray(res)) {
          setReviewProgressOptions(
            (res as any[])
              .filter((item) => item.enabled)
              .map((item) => ({
                value: String(item.code ?? item.value ?? ''),
                label: String(item.label ?? ''),
              }))
              .filter((o) => o.value),
          );
        }
      })
      .catch(() => {});

    loadDistrictPark();

    form.setFieldsValue({
      projectName: urlParams.projectName,
      currentProjectProgress: urlParams.currentProjectProgress,
      projectContent: urlParams.projectContent,
      attractorUnit: urlParams.attractorUnit,
      district: urlParams.district,
      park: urlParams.park,
      investmentFlag: urlParams.investmentFlag,
      industryOrService: urlParams.industryOrService,
      signedProjectStatus: urlParams.signedProjectStatus,
      projectSource: urlParams.projectSource,
      investor: urlParams.investor,
      investmentAmountRange: urlParams.investmentAmountRange as InvestmentAmountRange,
      signingDateRange:
        urlParams.actualSigningTime1 && urlParams.actualSigningTime2
          ? [dayjs(urlParams.actualSigningTime1), dayjs(urlParams.actualSigningTime2)]
          : undefined,
      signingStatRange:
        urlParams.signingTime1 && urlParams.signingTime2
          ? [dayjs(urlParams.signingTime1), dayjs(urlParams.signingTime2)]
          : undefined,
      applyTimeRange:
        urlParams.applyTime1 && urlParams.applyTime2
          ? [dayjs(urlParams.applyTime1), dayjs(urlParams.applyTime2)]
          : undefined,
      isKc: urlParams.isKc,
      isQflp: urlParams.isQflp,
    });

    const initialFilters = buildListApiFilters({
      ...urlParams,
      investmentAmountRange: urlParams.investmentAmountRange as InvestmentAmountRange,
      signingDateRange:
        urlParams.actualSigningTime1 && urlParams.actualSigningTime2
          ? [dayjs(urlParams.actualSigningTime1), dayjs(urlParams.actualSigningTime2)] as [dayjs.Dayjs, dayjs.Dayjs]
          : undefined,
      signingStatRange:
        urlParams.signingTime1 && urlParams.signingTime2
          ? [dayjs(urlParams.signingTime1), dayjs(urlParams.signingTime2)] as [dayjs.Dayjs, dayjs.Dayjs]
          : undefined,
      applyTimeRange:
        urlParams.applyTime1 && urlParams.applyTime2
          ? [dayjs(urlParams.applyTime1), dayjs(urlParams.applyTime2)] as [dayjs.Dayjs, dayjs.Dayjs]
          : undefined,
    });
    fetchData({
      ...initialFilters,
      ...(inferInvestmentRangeFromUrlAmounts(urlParams.investmentAmount1, urlParams.investmentAmount2) === undefined &&
        (urlParams.investmentAmount1 !== undefined || urlParams.investmentAmount2 !== undefined)
        ? { investmentAmount1: urlParams.investmentAmount1, investmentAmount2: urlParams.investmentAmount2 }
        : {}),
      page: urlParams.page,
      size: urlParams.pageSize,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!fullDistrictOpts.length) return;
    let districtVal = urlParams.district;
    if (!districtVal && urlParams.park) {
      districtVal = inferDistrictByPark(urlParams.park);
      if (districtVal) form.setFieldValue('district', districtVal);
    }
    updateParkByDistrict(districtVal || undefined);
  }, [fullDistrictOpts]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    const inv = investmentRangeToApiAmounts(values.investmentAmountRange);
    updateUrlParams({
      page: 1,
      pageSize: pagination.pageSize,
      projectName: values.projectName || '',
      currentProjectProgress: values.currentProjectProgress ?? [],
      projectContent: values.projectContent || '',
      attractorUnit: values.attractorUnit || '',
      industryOrService: values.industryOrService || '',
      signedProjectStatus: values.signedProjectStatus?.toString() || '',
      investmentFlag: values.investmentFlag || '',
      district: values.district || '',
      park: values.park || '',
      projectSource: values.projectSource || '',
      investor: values.investor || '',
      investmentAmount1: inv.investmentAmount1 != null ? String(inv.investmentAmount1) : '',
      investmentAmount2: inv.investmentAmount2 != null ? String(inv.investmentAmount2) : '',
      actualSigningTime1: values.signingDateRange?.[0]?.format('YYYY-MM-DD') ?? '',
      actualSigningTime2: values.signingDateRange?.[1]?.format('YYYY-MM-DD') ?? '',
      signingTime1: values.signingStatRange?.[0]?.format('YYYY-MM-DD') ?? '',
      signingTime2: values.signingStatRange?.[1]?.format('YYYY-MM-DD') ?? '',
      applyTime1: values.applyTimeRange?.[0]?.format('YYYY-MM-DD') ?? '',
      applyTime2: values.applyTimeRange?.[1]?.format('YYYY-MM-DD') ?? '',
      isKc: values.isKc === true ? 'true' : values.isKc === false ? 'false' : '',
      isQflp: values.isQflp === true ? 'true' : values.isQflp === false ? 'false' : '',
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData(getListRequestParams(1, pagination.pageSize));
  };

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue({ investmentAmountRange: 'all' });
    updateParkByDistrict(undefined);
    updateUrlParams({
      page: 1, pageSize: pagination.pageSize,
      projectName: '', currentProjectProgress: [], projectContent: '',
      attractorUnit: '', industryOrService: '', signedProjectStatus: '',
      investmentFlag: '', district: '', park: '', projectSource: '', investor: '',
      investmentAmount1: '', investmentAmount2: '',
      actualSigningTime1: '', actualSigningTime2: '',
      signingTime1: '', signingTime2: '',
      applyTime1: '', applyTime2: '',
      isKc: '', isQflp: '',
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData(getListRequestParams(1, pagination.pageSize));
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const listParams = getListRequestParams(pagination.current, pagination.pageSize);
      const exportParams = Object.fromEntries(
        Object.entries(listParams).filter(([k]) => k !== 'page' && k !== 'size'),
      ) as ExportProjectRequest;
      const res = await primeApi.exportProject(exportParams);
      if (!res?.path) { message.error('导出失败：未获取到文件路径'); return; }
      const cleanedPath = String(res.path).replace(/#+$/, '');
      const fileUrl = cleanedPath.startsWith('http')
        ? cleanedPath
        : `${window.location.origin}${cleanedPath.startsWith('/') ? '' : '/'}${cleanedPath}`;
      const a = Object.assign(document.createElement('a'), {
        href: fileUrl,
        download: res.name || `项目管理_${Date.now()}.xlsx`,
        target: '_blank',
        style: { display: 'none' },
      });
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 100);
      message.success('导出成功');
    } catch {
      message.error('导出失败');
    } finally {
      setExporting(false);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    updateUrlParams({ page, pageSize });
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    fetchData(getListRequestParams(page, pageSize));
  };

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
        onSign: (record) => {
          navigate(`/xmgl/pro-sign?id=${record.id}&zsid=${record.projectCode}`);
        },
      }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div style={{ display: 'flex' }}>
      <PageContainer
        style={{ width: '100%', height: '90vh', overflow: 'auto', scrollbarWidth: 'none' }}
        content="欢迎使用项目管理模块"
      >
        <div style={{ padding: 20, backgroundColor: 'white' }}>
          <div
            style={{ padding: 20, backgroundImage: 'url(/pm-bg1.png)', backgroundSize: '100% 100%' }}
          >
            <SectionTitle>查询</SectionTitle>
            <Form
              form={form}
              layout="horizontal"
              name="basic"
              initialValues={{ investmentAmountRange: 'all' }}
              onFinish={onFinish}
              autoComplete="off"
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
                    <Select
                      allowClear
                      placeholder="全部"
                      options={[{ value: '1', label: '内资' }, { value: '2', label: '外资' }]}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="所属产业" name="industryOrService">
                    <Select
                      allowClear
                      placeholder="全部"
                      options={[{ value: '工业', label: '工业' }, { value: '服务业', label: '服务业' }]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item<FieldType> label="项目状态" name="currentProjectProgress">
                    <Select
                      mode="multiple"
                      options={progressOptions
                        .filter((item) => item.enabled)
                        .map((item) => ({ value: item.value, label: item.label }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType>
                    label={<span style={{ whiteSpace: 'nowrap' }}>投资额</span>}
                    name="investmentAmountRange"
                  >
                    <Select
                      style={{ width: '100%' }}
                      placeholder="全部"
                      options={[
                        { value: 'all', label: '全部' },
                        { value: 'above100000', label: '10亿（1亿美元）以上' },
                        { value: 'above50000', label: '5亿（3000万美元）以上' },
                        { value: 'above10000', label: '1亿（1000万美元）以上' },
                        { value: 'mid500to10000', label: '500万-1亿（1000万美元）' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="所属市（区）" name="district">
                    <Select
                      allowClear
                      showSearch
                      placeholder="全部"
                      optionFilterProp="label"
                      options={districtOptions}
                      onChange={(v) => {
                        updateParkByDistrict(v);
                        form.setFieldValue('park', undefined);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="所属板块" name="park">
                    <Select
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      placeholder={searchParkOptions.length ? '请选择所属板块' : '请先选择所属市'}
                      options={searchParkOptions}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ display: showMoreSearch ? 'block' : 'none' }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item<FieldType> label="项目来源" name="projectSource">
                      <Select
                        allowClear
                        placeholder="全部"
                        options={[
                          { value: '市级机关推荐', label: '市级机关推荐' },
                          { value: '自行接洽', label: '自行接洽' },
                        ]}
                      />
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
                    <Form.Item<FieldType> label="签约时间" name="signingDateRange">
                      <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item<FieldType> label="签约统计时间" name="signingStatRange">
                      <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="是否科创项目" name="isKc">
                      <Select
                        allowClear
                        placeholder="全部"
                        options={[{ value: true, label: '是' }, { value: false, label: '否' }]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="是否QFLP外资项目" name="isQflp">
                      <Select
                        allowClear
                        placeholder="全部"
                        options={[{ value: true, label: '是' }, { value: false, label: '否' }]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item<FieldType> label="申请时间" name="applyTimeRange">
                      <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item<FieldType> label="审核状态" name="signedProjectStatus">
                      <Select allowClear placeholder="全部" options={reviewProgressOptions} />
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
            scroll={{ x: 2200 }}
            rowClassName={(record) =>
              record.light === 'green'
                ? 'even-row1'
                : record.light === 'yellow'
                  ? 'odd-row2'
                  : record.light === 'red'
                    ? 'odd-row3'
                    : ''
            }
            columns={columns}
            bordered
            dataSource={dataSource}
            pagination={false}
            loading={loading}
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', marginBottom: 20 }}>
      <div
        style={{ marginRight: 10, width: 5, height: 16, background: '#005BF5', borderRadius: 2.5 }}
      />
      <div style={{ fontSize: 16, fontWeight: 'bolder' }}>{children}</div>
    </div>
  );
}

export default ProjectManage3;
