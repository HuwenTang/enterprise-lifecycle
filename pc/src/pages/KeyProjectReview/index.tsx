import { primeApi, systemApi } from '@/services/api';
import { ListProjectKeyProjectReviewRequest } from '@/services/apis';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Col,
  Form,
  FormProps,
  Input,
  message,
  Pagination,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type FieldType = {
  projectName?: string;
  district?: string;
  evaluationStatus?: string;
};

const KeyProjectReview = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [districtOptions, setDistrictOptions] = useState<Array<{ value: string; label: string }>>([
    { value: '', label: '不限' },
  ]);
  const [evaluationStatusOptions] = useState<Array<{ value: string; label: string }>>([
    { value: '', label: '不限' },
    { value: '待评估', label: '待评估' },
    { value: '已评估', label: '已评估' },
  ]);

  // 获取数据
  const fetchData = async (params: ListProjectKeyProjectReviewRequest) => {
    setLoading(true);
    try {
      const data = await primeApi.listProjectKeyProjectReview({
        projectName: params.projectName || '',
        page: params.page || pagination.current,
        size: params.size || pagination.pageSize,
      });

      // 处理数据，如果接口返回的数据包含项目信息，直接使用；否则需要通过 keyProjectId 获取
      const processedData = await Promise.all(
        (data.records || []).map(async (record: any) => {
          // 如果返回的数据中已经包含项目信息，直接使用
          if (record.projectName) {
            return {
              ...record,
              // evaluationStatus: record.status === '已完成' ? '已评估' : '待评估',
              evaluationStatus: record.status || '',
              evaluationResult: record.keyProjectLevel || '',
            };
          }
          // 否则通过 keyProjectId 获取项目详情
          if (record.keyProjectId) {
            try {
              const projectData = await primeApi.getProjectKeyProject({ id: record.keyProjectId });
              return {
                ...record,
                projectName: projectData.projectName || '',
                constructionContentAndScale: projectData.constructionContentAndScale || '',
                parkName: projectData.parkName || '园区名称',
                districtName: projectData.districtName || projectData.district || '',
                applicationYear: (projectData as any).applicationYear || '',
                // evaluationStatus: record.status === '已完成' ? '已评估' : '待评估',
                evaluationStatus: record.status || '',
                evaluationResult: record.keyProjectLevel || '',
              };
            } catch (error) {
              console.error('获取项目详情失败:', error);
              return {
                ...record,
                projectName: '',
                constructionContentAndScale: '',
                parkName: '园区名称',
                districtName: '',
                applicationYear: '',
                // evaluationStatus: record.status === '已完成' ? '已评估' : '待评估',
                evaluationStatus: record.status || '',
                evaluationResult: record.keyProjectLevel || '',
              };
            }
          }
          return {
            ...record,
            evaluationStatus: record.status === '已完成' ? '已评估' : '待评估',
            evaluationResult: record.keyProjectLevel || '',
          };
        })
      );

      // 前端筛选：所属区县和评估状态
      let filteredData = processedData;
      const formValues = form.getFieldsValue();
      if (formValues.district) {
        filteredData = filteredData.filter((item: any) => item.districtName === formValues.district);
      }
      if (formValues.evaluationStatus) {
        filteredData = filteredData.filter((item: any) => item.evaluationStatus === formValues.evaluationStatus);
      }

      setDataSource(filteredData);
      setPagination((prev) => ({
        ...prev,
        total: filteredData.length, // 使用过滤后的数据长度
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

  // 获取区县字典
  const getDistrictOptions = async () => {
    try {
      const res = await systemApi.getAdministrativeDivisionTree();
      const list =
        res[0]?.children?.map((item: any) => ({
          value: item.value,
          label: item.label,
        })) || [];
      setDistrictOptions([{ value: '', label: '不限' }, ...list]);
    } catch (error) {
      console.error('获取区县字典失败:', error);
      // 如果获取失败，使用默认选项
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

  useEffect(() => {
    getDistrictOptions();
    // 初始加载数据
    fetchData({
      projectName: '',
      page: 1,
      size: pagination.pageSize,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 表单提交
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData({
      projectName: values.projectName || '',
      page: 1,
      size: pagination.pageSize,
    });
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData({
      projectName: '',
      page: 1,
      size: pagination.pageSize,
    });
  };

  // 评估操作
  const handleEvaluate = (record: any) => {
    if (record.keyProjectId) {
      navigate(`/key-project/detail?id=${record.keyProjectId}`);
    } else {
      message.warning('项目ID不存在');
    }
  };

  // 分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    const formValues = form.getFieldsValue();
    fetchData({
      projectName: formValues.projectName || '',
      page,
      size: pageSize,
    });
  };

  // 表格列定义
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 250,
      align: 'left' as const,
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '项目内容',
      dataIndex: 'projectContent',
      key: 'projectContent',
      width: 250,
      align: 'left' as const,
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '所属板块',
      dataIndex: 'parkName',
      key: 'parkName',
      width: 120,
      align: 'center' as const,
      render: (text: string) => text || '园区名称',
    },
    {
      title: '所属区县',
      dataIndex: 'districtName',
      key: 'districtName',
      width: 120,
      align: 'center' as const,
      render: (text: string) => text || '-',
    },
    {
      title: '申报年度',
      dataIndex: 'year',
      key: 'year',
      width: 120,
      align: 'center' as const,
      render: (text: string) => text || '-',
    },
    {
      title: '评估部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 120,
      align: 'center' as const,
      render: (text: string) => text || '-',
    },
    {
      title: '评估状态',
      dataIndex: 'evaluationStatus',
      key: 'evaluationStatus',
      width: 120,
      align: 'center' as const,
      render: (text: string) => text || '-',
    },
    {
      title: '评估结果',
      dataIndex: 'keyProjectLevel',
      key: 'keyProjectLevel',
      width: 120,
      align: 'center' as const,
      render: (text: string) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => handleEvaluate(record)}
          >
            评估
          </Button>
        </Space>
      ),
    },
  ];

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
        content="欢迎使用重点项目评估模块"
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
                    <Input placeholder="请输入项目名称" allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="所属区县" name="district">
                    <Select
                      options={districtOptions}
                      placeholder="不限"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="评估状态" name="evaluationStatus">
                    <Select
                      options={evaluationStatusOptions}
                      placeholder="不限"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        查询
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
            rowKey={(record) => record.id || record.keyProjectId || ''}
            scroll={{ x: 1200 }}
            bordered={true}
            dataSource={dataSource}
            loading={loading}
            pagination={false}
          />
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            showSizeChanger
            showQuickJumper
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            style={{ marginTop: '16px', textAlign: 'right' }}
          />
        </div>
      </PageContainer>
    </div>
  );
};

export default KeyProjectReview;
