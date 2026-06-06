import { useDistrictParkOptions } from '@/hooks/useDistrictParkOptions';
import { usePersistedMoreSearch } from '@/hooks/usePersistedMoreSearch';
import { primeApi, systemApi } from '@/services/api';
import type { ListProjectDigitalInvestmentAttractingRequest } from '@/services/apis';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import {
  Button, Col, Form, FormProps, Input,
  message, Pagination, Row, Select, Space, Table,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  inferInvestmentRangeFromUrlAmounts,
  investmentRangeToApiAmounts,
  parseUrlInvestmentAmount,
} from '../ProjectManage/investmentRange';
import type { InvestmentAmountRange } from '../ProjectManage/types';
import { buildColumns } from './columns';

type FieldType = {
  projectName?: string;
  currentProjectProgress?: string[];
  projectContent?: string;
  attractorUnit?: string;
  industryOrService?: string;
  investmentFlag?: string;
  district?: string;
  park?: string;
  projectSource?: string;
  investor?: string;
  isKc?: boolean;
  qualityEvaluationStatus?: number;
  investmentAmountRange?: InvestmentAmountRange;
};

function buildListApiFilters(
  values: FieldType,
): Omit<ListProjectDigitalInvestmentAttractingRequest, 'page' | 'size'> {
  const inv = investmentRangeToApiAmounts(values.investmentAmountRange);
  const cp = values.currentProjectProgress?.length ? values.currentProjectProgress : undefined;
  return {
    showAll: true,
    isQualityEvaluation: true,
    projectName: values.projectName || undefined,
    currentProjectProgress: cp,
    projectContent: values.projectContent || undefined,
    attractorUnit: values.attractorUnit || undefined,
    industryOrService: values.industryOrService || undefined,
    qualityEvaluationStatus:
      typeof values.qualityEvaluationStatus === 'number' ? values.qualityEvaluationStatus : undefined,
    district: values.district || undefined,
    park: values.park || undefined,
    investmentFlag: values.investmentFlag || undefined,
    projectSource: values.projectSource || undefined,
    investor: values.investor || undefined,
    isKc: values.isKc,
    ...inv,
  } as Omit<ListProjectDigitalInvestmentAttractingRequest, 'page' | 'size'>;
}

const ProjectManage2 = () => {
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
  const [exportingQuality, setExportingQuality] = useState(false);
  const [progressOptions, setProgressOptions] = useState<{ value: string; label: string }[]>([]);
  const [pagination, setPagination] = useState({
    current: parseInt(searchParams.get('page') || '1', 10),
    pageSize: parseInt(searchParams.get('pageSize') || '10', 10),
    total: 0,
  });

  const urlParams = useMemo(() => {
    const p = searchParams;
    const a1 = parseUrlInvestmentAmount(p.get('investmentAmount1') ?? undefined);
    const a2 = parseUrlInvestmentAmount(p.get('investmentAmount2') ?? undefined);
    const isKcRaw = p.get('isKc') ?? p.get('isSDZProject');
    return {
      projectName: p.get('projectName') || '',
      currentProjectProgress: p.get('currentProjectProgress')?.split(',') ?? [],
      projectContent: p.get('projectContent') || '',
      attractorUnit: p.get('attractorUnit') || '',
      industryOrService: p.get('industryOrService') || undefined,
      district: p.get('district') || undefined,
      park: p.get('park') || undefined,
      investmentFlag: p.get('investmentFlag') || undefined,
      projectSource: p.get('projectSource') || undefined,
      investor: p.get('investor') || '',
      isKc:
        isKcRaw === null ? undefined : isKcRaw === 'true' ? true : isKcRaw === 'false' ? false : undefined,
      qualityEvaluationStatus: p.get('qualityEvaluationStatus')
        ? Number(p.get('qualityEvaluationStatus'))
        : undefined,
      investmentAmount1: a1,
      investmentAmount2: a2,
      investmentAmountRange: inferInvestmentRangeFromUrlAmounts(a1, a2) ?? 'all',
      page: parseInt(p.get('page') || '1', 10),
      pageSize: parseInt(p.get('pageSize') || '10', 10),
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUrlParams = (
    params: Record<string, string | number | boolean | string[] | null | undefined>,
  ) => {
    const next = new URLSearchParams(searchParams);
    next.delete('isSDZProject');
    next.delete('projectCode');
    next.delete('projectCategory');
    next.delete('year');
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

  const fetchData = async (params: ListProjectDigitalInvestmentAttractingRequest) => {
    setLoading(true);
    try {
      const data = await primeApi.listProjectDigitalInvestmentAttracting(params);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        current: data.page,
        pageSize: data.size,
      }));
      setDataSource(data.records ?? []);
    } catch {
      message.error('获取项目数据失败');
    } finally {
      setLoading(false);
    }
  };

  const getListRequestParams = (
    page: number,
    size: number,
  ): ListProjectDigitalInvestmentAttractingRequest => {
    const v = form.getFieldsValue(true) as FieldType;
    const filters = buildListApiFilters(v) as any;
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
      filters.investmentAmount1 = urlParams.investmentAmount1;
      filters.investmentAmount2 = urlParams.investmentAmount2;
    }
    return { ...filters, page, size };
  };

  useEffect(() => {
    systemApi
      .getDictItems({ catalog: 'project_progress' })
      .then((res) => {
        if (Array.isArray(res)) {
          setProgressOptions(
            (res as any[])
              .filter((item) => item.enabled)
              .map((item) => ({ value: item.value, label: item.label })),
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
      industryOrService: urlParams.industryOrService,
      district: urlParams.district,
      park: urlParams.park,
      investmentFlag: urlParams.investmentFlag,
      projectSource: urlParams.projectSource,
      investor: urlParams.investor,
      isKc: urlParams.isKc,
      qualityEvaluationStatus: urlParams.qualityEvaluationStatus,
      investmentAmountRange: urlParams.investmentAmountRange as InvestmentAmountRange,
    });

    const initialFilters = buildListApiFilters({
      ...urlParams,
      investmentAmountRange: urlParams.investmentAmountRange as InvestmentAmountRange,
    }) as any;
    if (
      (urlParams.investmentAmountRange as string) === 'all' &&
      inferInvestmentRangeFromUrlAmounts(urlParams.investmentAmount1, urlParams.investmentAmount2) ===
        undefined &&
      (urlParams.investmentAmount1 !== undefined || urlParams.investmentAmount2 !== undefined)
    ) {
      initialFilters.investmentAmount1 = urlParams.investmentAmount1;
      initialFilters.investmentAmount2 = urlParams.investmentAmount2;
    }
    fetchData({ ...initialFilters, page: urlParams.page, size: urlParams.pageSize });
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
      district: values.district || '',
      park: values.park || '',
      investmentFlag: values.investmentFlag || '',
      projectSource: values.projectSource || '',
      investor: values.investor || '',
      isKc: values.isKc === true || values.isKc === false ? values.isKc : null,
      qualityEvaluationStatus:
        typeof values.qualityEvaluationStatus === 'number'
          ? String(values.qualityEvaluationStatus)
          : '',
      investmentAmount1: inv.investmentAmount1 != null ? String(inv.investmentAmount1) : '',
      investmentAmount2: inv.investmentAmount2 != null ? String(inv.investmentAmount2) : '',
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData(getListRequestParams(1, pagination.pageSize));
  };

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue({ investmentAmountRange: 'all' });
    updateParkByDistrict(undefined);
    updateUrlParams({
      page: 1, pageSize: 10,
      projectName: '', currentProjectProgress: [], projectContent: '',
      attractorUnit: '', industryOrService: '', district: '', park: '',
      investmentFlag: '', projectSource: '', investor: '',
      isKc: null, qualityEvaluationStatus: '',
      investmentAmount1: '', investmentAmount2: '',
    });
    setPagination((prev) => ({ ...prev, current: 1, pageSize: 10 }));
    fetchData({ showAll: true, isQualityEvaluation: true, page: 1, size: 10 } as any);
  };

  const handleExportQualityEvaluation = async () => {
    try {
      setExportingQuality(true);
      const filters = buildListApiFilters(form.getFieldsValue(true) as FieldType);
      const res = await primeApi.exportPGProject(filters as any);
      if (!res?.path) { message.error('导出失败：未获取到文件路径'); return; }
      const fileUrl = res.path.startsWith('http') ? res.path : `/${res.path.replace(/^\//, '')}`;
      const a = Object.assign(document.createElement('a'), {
        href: fileUrl, download: res.name || '质态评估表.xlsx', target: '_blank', style: { display: 'none' },
      });
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 100);
      message.success('导出成功');
    } catch {
      message.error('导出失败');
    } finally {
      setExportingQuality(false);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    updateUrlParams({ page, pageSize });
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    fetchData(getListRequestParams(page, pageSize));
  };

  const rowStyle = (record: any) => ({
    backgroundColor:
      record?.light === 'green'
        ? '#e6ffed'
        : record?.light === 'yellow'
          ? '#fffbe6'
          : record?.light === 'red'
            ? '#ffeded'
            : '#ffffff',
    color:
      record?.light === 'yellow'
        ? '#591d04'
        : record?.light === 'red'
          ? '#590404'
          : 'inherit',
  });

  const columns = useMemo(
    () =>
      buildColumns({
        onDetail: (record) => {
          if (record.currentProjectProgress) {
            navigate(`/xmgl/xmjd?id=${record.id}&fromPage=${pagination.current}`);
          } else {
            message.info('当前项目暂无进度');
          }
        },
        onQualityEval: (record) => {
          navigate(`/xmgl/qa-state?id=${record.id}&zsid=${record.projectCode}`);
        },
      }),
    [pagination.current], // eslint-disable-line react-hooks/exhaustive-deps
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
                    <Select mode="multiple" options={progressOptions} maxTagCount="responsive" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="投资额" name="investmentAmountRange">
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
                    <Form.Item<FieldType> label="是否科创项目" name="isKc">
                      <Select
                        allowClear
                        placeholder="全部"
                        options={[{ value: true, label: '是' }, { value: false, label: '否' }]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item<FieldType> label="评估状态" name="qualityEvaluationStatus">
                      <Select
                        allowClear
                        placeholder="请选择"
                        options={[{ value: 0, label: '未完成' }, { value: 1, label: '已完成' }]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                      <Button
                        type="primary"
                        loading={exportingQuality}
                        onClick={handleExportQualityEvaluation}
                      >
                        导出质态评估表
                      </Button>
                      <Button type="primary" htmlType="submit">查询</Button>
                      <Button onClick={() => setShowMoreSearchPersist((p) => !p)}>
                        {showMoreSearch ? '收起查询' : '更多查询'}
                      </Button>
                      <Button onClick={handleReset}>重置</Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          <Table
            style={{ marginTop: 20 }}
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
            onRow={(record) => ({ style: rowStyle(record) })}
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

export default ProjectManage2;
