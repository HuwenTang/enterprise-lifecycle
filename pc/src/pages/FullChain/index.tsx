import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Col,
  Form,
  FormProps,
  Input,
  Pagination,
  Row,
  Select,
  Table
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { handleApiError } from '@/utils/errorHandler';
import type { CenterDashboardCenter, ClusterDashboardCard } from './mock';
import { renderCheck, FULL_CHAIN_CITY_OPTIONS } from './mock';
import {
  fetch8_13_XParsed,
  fetchCenterDashboardStatistics,
  fetchClusterDashboardStatistics,
  fetchFullChainList,
  FUTURE_INDUSTRY_CLUSTER_LABEL,
  type DictOption,
  type FullChainListResult,
  type FullChainQueryParams,
  type FullChainRecord,
} from './service';
import CenterDataDashboard from './CenterDataDashboard';
import ClusterDataDashboard from './ClusterDataDashboard';

/** 查询表单类型，与接口 GET /enterprise-innovative-clusters 的 Query 参数对齐 */
type QueryFormType = {
  /** 产业集群 */
  industryChain?: string;
  /** 产业链 或 未来产业链（二选一，由产业集群决定） */
  chainOrFutureChain?: string;
  /** 企业名称 */
  enterpriseName?: string;
  /** 市(区) */
  cityDistrict?: string;
  // 资质筛选（与接口参数对应，勾选后参与查询）
  fgEngineeringProvincial?: boolean;
  fgEngineeringMunicipal?: boolean;
  fgEngineeringNational?: boolean;
  gxTechCenterProvincial?: boolean;
  gxTechCenterMunicipal?: boolean;
  swForeignRdProvincial?: boolean;
  swForeignRdMunicipal?: boolean;
  kjEngineeringRdProvincial?: boolean;
  kjEngineeringRdMunicipal?: boolean;
  kjEngineeringRdNational?: boolean;
  kjKeyLabProvincial?: boolean;
  kjKeyLabMunicipal?: boolean;
  kjAcademicianProvincial?: boolean;
  kjAcademicianMunicipal?: boolean;
};

type ViewTabKey = 'allList' | 'clusterDashboard' | 'centerDashboard';

const VIEW_TABS: { key: ViewTabKey; label: string }[] = [
  { key: 'allList', label: '全部企业列表' },
  { key: 'clusterDashboard', label: '创新集群数据看板' },
  { key: 'centerDashboard', label: '中心统计数据看板' },
];

const FullChain: React.FC = () => {
  const [form] = Form.useForm<QueryFormType>();
  const selectedIndustryCluster = Form.useWatch('industryChain', form) as string | undefined;
  const [dataSource, setDataSource] = useState<FullChainRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [industryClusterOptions, setIndustryClusterOptions] = useState<DictOption[]>([]);
  const [clusterLabelToCode, setClusterLabelToCode] = useState<Record<string, string>>({});
  const [clusterCodeToChains, setClusterCodeToChains] = useState<Record<string, DictOption[]>>({});
  const [activeViewTab, setActiveViewTab] = useState<ViewTabKey>('allList');
  const [clusterDashboardCards, setClusterDashboardCards] = useState<ClusterDashboardCard[]>([]);
  const [centerDashboardCenters, setCenterDashboardCenters] = useState<CenterDashboardCenter[]>([]);
  const [clusterDashboardLoading, setClusterDashboardLoading] = useState(false);
  const [centerDashboardLoading, setCenterDashboardLoading] = useState(false);

  const isFutureIndustry = selectedIndustryCluster === FUTURE_INDUSTRY_CLUSTER_LABEL;
  const chainOrFutureOptions = selectedIndustryCluster
    ? clusterCodeToChains[clusterLabelToCode[selectedIndustryCluster]] ?? []
    : [];

  const loadData = useCallback(
    async (params: FullChainQueryParams) => {
      setLoading(true);
      try {
        const values = form.getFieldsValue();
        const isFuture = values.industryChain === FUTURE_INDUSTRY_CLUSTER_LABEL;
        const apiParams: FullChainQueryParams = {
          industryChain: values.industryChain,
          chain: isFuture ? undefined : values.chainOrFutureChain,
          futureChain: isFuture ? values.chainOrFutureChain : undefined,
          enterpriseName: values.enterpriseName,
          cityDistrict: values.cityDistrict,
          page: params.page,
          size: params.size,
          // 资质筛选：表单字段名 -> 接口参数名
          fgProvincialLevel: values.fgEngineeringProvincial,
          fgMunicipalLevel: values.fgEngineeringMunicipal,
          fgNationalLevel: values.fgEngineeringNational,
          gxProvincialLevel: values.gxTechCenterProvincial,
          gxMunicipalLevel: values.gxTechCenterMunicipal,
          swProvincialLevel: values.swForeignRdProvincial,
          swMunicipalLevel: values.swForeignRdMunicipal,
          kjEngProvincialLevel: values.kjEngineeringRdProvincial,
          kjEngMunicipalLevel: values.kjEngineeringRdMunicipal,
          kjEngNationalLevel: values.kjEngineeringRdNational,
          kjLabProvincialLevel: values.kjKeyLabProvincial,
          kjLabMunicipalLevel: values.kjKeyLabMunicipal,
          kjAcademicianProvincialLevel: values.kjAcademicianProvincial,
          kjAcademicianMunicipalLevel: values.kjAcademicianMunicipal,
        };
        const res: FullChainListResult = await fetchFullChainList({
          ...apiParams,
          ...params,
        });
        setDataSource(res.records);
        setPagination((prev) => ({
          ...prev,
          current: res.page,
          pageSize: res.size,
          total: res.total,
        }));
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  const onFinish: FormProps<QueryFormType>['onFinish'] = (values) => {
    loadData({
      ...values,
      page: 1,
      size: pagination.pageSize,
    });
  };

  const onReset = () => {
    form.resetFields();
    loadData({ page: 1, size: pagination.pageSize });
  };

  useEffect(() => {
    loadData({ page: pagination.current, size: pagination.pageSize });
  }, []);

  useEffect(() => {
    fetch8_13_XParsed().then(({ industryClusterOptions: clusters, clusterLabelToCode: l2c, clusterCodeToChains: c2c }) => {
      setIndustryClusterOptions(clusters);
      setClusterLabelToCode(l2c);
      setClusterCodeToChains(c2c);
    });
  }, []);

  useEffect(() => {
    if (activeViewTab !== 'clusterDashboard') return;
    let cancelled = false;
    void (async () => {
      setClusterDashboardLoading(true);
      try {
        const cards = await fetchClusterDashboardStatistics();
        if (!cancelled) setClusterDashboardCards(cards);
      } catch (e) {
        if (!cancelled) await handleApiError(e);
      } finally {
        if (!cancelled) setClusterDashboardLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeViewTab]);

  useEffect(() => {
    if (activeViewTab !== 'centerDashboard') return;
    let cancelled = false;
    void (async () => {
      setCenterDashboardLoading(true);
      try {
        const centers = await fetchCenterDashboardStatistics();
        if (!cancelled) setCenterDashboardCenters(centers);
      } catch (e) {
        if (!cancelled) await handleApiError(e);
      } finally {
        if (!cancelled) setCenterDashboardLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeViewTab]);

  /** 展示文本：接口返回 string | null */
  const renderText = (val: string | null | undefined) => (val ?? '-');

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      fixed: 'left' as const,
      render: (_: unknown, __: FullChainRecord, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      width: 180,
      fixed: 'left' as const,
      ellipsis: true,
    },
    {
      title: '市(区)',
      dataIndex: 'cityDistrict',
      width: 100,
      render: renderText,
    },
    {
      title: '8个创新型集群',
      dataIndex: 'innovativeClusters8',
      width: 160,
      ellipsis: true,
      render: renderText,
    },
    {
      title: '13条产业链',
      dataIndex: 'industrialChains13',
      width: 160,
      ellipsis: true,
      render: renderText,
    },
    {
      title: '未来产业链',
      dataIndex: 'futureChainsX',
      width: 120,
      ellipsis: true,
      render: renderText,
    },
    {
      title: '发改-工程研究中心(产业技术创新中心)',
      children: [
        { title: '省级', dataIndex: 'fgProvincialLevel', width: 60, render: renderCheck },
        { title: '市级', dataIndex: 'fgMunicipalLevel', width: 60, render: renderCheck },
      ],
    },
    {
      title: '工信-企业技术中心',
      children: [
        { title: '省级', dataIndex: 'gxProvincialLevel', width: 60, render: renderCheck },
        { title: '市级', dataIndex: 'gxMunicipalLevel', width: 60, render: renderCheck },
      ],
    },
    {
      title: '商务-外资研发中心',
      children: [
        { title: '省级', dataIndex: 'swProvincialLevel', width: 60, render: renderCheck },
        { title: '市级', dataIndex: 'swMunicipalLevel', width: 60, render: renderCheck },
      ],
    },
    {
      title: '科技-工程技术研究中心',
      children: [
        { title: '省级', dataIndex: 'kjEngProvincialLevel', width: 60, render: renderCheck },
        { title: '市级', dataIndex: 'kjEngMunicipalLevel', width: 60, render: renderCheck },
      ],
    },
    {
      title: '科技-重点实验室',
      children: [
        { title: '国家级', dataIndex: 'kjLabNationalLevel', width: 64, render: renderCheck },
        { title: '省级', dataIndex: 'kjLabProvincialLevel', width: 60, render: renderCheck },
        { title: '市级', dataIndex: 'kjLabMunicipalLevel', width: 60, render: renderCheck },
      ],
    },
    {
      title: '科技-院士工作站',
      children: [
        { title: '省级', dataIndex: 'kjAcademicianProvincialLevel', width: 60, render: renderCheck },
        { title: '市级', dataIndex: 'kjAcademicianMunicipalLevel', width: 60, render: renderCheck },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content="欢迎使用规上工业企业研发平台模块"
      >
        <div style={{ padding: '10px', backgroundColor: 'white' }}>
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
                  width: '5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>查询</div>
            </div>
            <Form
              form={form}
              layout="horizontal"
              name="fullChainQuery"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item<QueryFormType> label="企业名称" name="enterpriseName">
                    <Input placeholder="请输入企业名称" allowClear />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item<QueryFormType> label="市(区)" name="cityDistrict">
                    <Select
                      placeholder="请选择市(区)"
                      allowClear
                      options={FULL_CHAIN_CITY_OPTIONS}
                      showSearch
                      optionFilterProp="label"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item<QueryFormType> label="产业集群" name="industryChain">
                    <Select
                      placeholder="请选择产业集群"
                      allowClear
                      options={industryClusterOptions}
                      showSearch
                      optionFilterProp="label"
                      onChange={() => form.setFieldValue('chainOrFutureChain', undefined)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item<QueryFormType>
                    label={isFutureIndustry ? '未来产业链' : '产业链'}
                    name="chainOrFutureChain"
                  >
                    <Select
                      placeholder={isFutureIndustry ? '请选择未来产业链' : '请选择产业链'}
                      allowClear
                      options={chainOrFutureOptions}
                      showSearch
                      optionFilterProp="label"
                      disabled={!selectedIndustryCluster}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {/* 资质筛选：目前接口不支持，暂时隐藏。接口支持后可恢复下方 Row */}
              {/* <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="资质筛选" style={{ marginBottom: 8 }}>
                    <span style={{ color: '#666', fontSize: 12 }}>
                      发改-工程研究中心：
                    </span>
                    <Form.Item name="fgEngineeringProvincial" noStyle valuePropName="checked">
                      <Checkbox>省级</Checkbox>
                    </Form.Item>
                    <Form.Item name="fgEngineeringMunicipal" noStyle valuePropName="checked">
                      <Checkbox>市级</Checkbox>
                    </Form.Item>
                    <Form.Item name="fgEngineeringNational" noStyle valuePropName="checked">
                      <Checkbox>国家级</Checkbox>
                    </Form.Item>
                    <span style={{ color: '#666', fontSize: 12, marginLeft: 16 }}>
                      工信-企业技术中心：
                    </span>
                    <Form.Item name="gxTechCenterProvincial" noStyle valuePropName="checked">
                      <Checkbox>省级</Checkbox>
                    </Form.Item>
                    <Form.Item name="gxTechCenterMunicipal" noStyle valuePropName="checked">
                      <Checkbox>市级</Checkbox>
                    </Form.Item>
                    <span style={{ color: '#666', fontSize: 12, marginLeft: 16 }}>
                      商务-外资研发中心：
                    </span>
                    <Form.Item name="swForeignRdProvincial" noStyle valuePropName="checked">
                      <Checkbox>省级</Checkbox>
                    </Form.Item>
                    <Form.Item name="swForeignRdMunicipal" noStyle valuePropName="checked">
                      <Checkbox>市级</Checkbox>
                    </Form.Item>
                    <span style={{ color: '#666', fontSize: 12, marginLeft: 16 }}>
                      科技-工程技术研究中心/重点实验室/院士工作站：
                    </span>
                    <Form.Item name="kjEngineeringRdProvincial" noStyle valuePropName="checked">
                      <Checkbox>工程技术省</Checkbox>
                    </Form.Item>
                    <Form.Item name="kjEngineeringRdMunicipal" noStyle valuePropName="checked">
                      <Checkbox>工程技术市</Checkbox>
                    </Form.Item>
                    <Form.Item name="kjEngineeringRdNational" noStyle valuePropName="checked">
                      <Checkbox>工程技术国</Checkbox>
                    </Form.Item>
                    <Form.Item name="kjKeyLabProvincial" noStyle valuePropName="checked">
                      <Checkbox>重点实验室省</Checkbox>
                    </Form.Item>
                    <Form.Item name="kjKeyLabMunicipal" noStyle valuePropName="checked">
                      <Checkbox>重点实验室市</Checkbox>
                    </Form.Item>
                    <Form.Item name="kjAcademicianProvincial" noStyle valuePropName="checked">
                      <Checkbox>院士工作站省</Checkbox>
                    </Form.Item>
                    <Form.Item name="kjAcademicianMunicipal" noStyle valuePropName="checked">
                      <Checkbox>院士工作站市</Checkbox>
                    </Form.Item>
                  </Form.Item>
                </Col>
              </Row> */}
              <Row>
                <Form.Item
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 0,
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button style={{ marginLeft: '20px' }} onClick={onReset}>
                    重置
                  </Button>
                </Form.Item>
              </Row>
            </Form>
          </div>
          <div
            role="tablist"
            aria-label="内容切换"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginTop: 20,
            }}
          >
            {VIEW_TABS.map((tab) => {
              const active = activeViewTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveViewTab(tab.key)}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    padding: '10px 20px',
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: active ? 700 : 400,
                    color: active ? '#fff' : '#666',
                    background: active ? '#005BF5' : '#E8EEF7',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          {activeViewTab === 'allList' && (
            <>
              <Table
                style={{ marginTop: 20 }}
                columns={columns}
                scroll={{ x: 1600 }}
                bordered
                dataSource={dataSource}
                rowKey="id"
                loading={loading}
                pagination={false}
              />
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger
                showTotal={(total) => `共 ${total} 条`}
                pageSizeOptions={['10', '20', '50', '100']}
                onChange={(page, pageSize) => {
                  setPagination((prev) => ({ ...prev, current: page, pageSize: pageSize || 10 }));
                  loadData({ page, size: pageSize || 10 });
                }}
                style={{ marginTop: '16px' }}
              />
            </>
          )}
          {activeViewTab === 'clusterDashboard' && (
            <ClusterDataDashboard
              cards={clusterDashboardCards}
              loading={clusterDashboardLoading}
            />
          )}
          {activeViewTab === 'centerDashboard' && (
            <CenterDataDashboard
              centers={centerDashboardCenters}
              loading={centerDashboardLoading}
            />
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default FullChain;
