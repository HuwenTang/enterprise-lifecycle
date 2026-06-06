import {
  Button,
  Col,
  Form,
  FormProps,
  Input,
  message,
  Pagination,
  Row, Select,
  Space,
  Table, Tag,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { primeApi } from '@/services/api';
import { useNavigate } from "@umijs/max";
import { ListProjectConstructionApprovalRequest, ProjectConstructionApprovalVo } from "@/services/apis";
import DictSelection from "@/components/DictSelection";
import { useSearchParams } from "react-router-dom";

type FieldType = {
  projectName?: string;
  projectSource?: string;
  companyName?: string;
  uscc?: string;
};

const ProjectManageGG = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // 使用 URL 参数管理分页和筛选状态
  const [searchParams, setSearchParams] = useSearchParams();

  // 从 URL 参数初始化状态
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const initialProjectName = searchParams.get('projectName') || '';
  const initialCompanyName = searchParams.get('companyName') || '';

  // 从ApproveDetail传递的参数
  const district = searchParams.get('district') || '';
  const park = searchParams.get('park') || '';
  const year = searchParams.get('year') || '';
  const quarter = searchParams.get('quarter') || '';
  const field = searchParams.get('field') || '';

  // 分页状态管理，与 URL 参数同步
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialPageSize,
    total: 0
  });

  const [dataSource, setDataSource] = useState<ProjectConstructionApprovalVo[]>([]);
  const [loading, setLoading] = useState(false);

  // 更新 URL 参数
  const updateUrlParams = (
    params: {
      page?: number;
      pageSize?: number;
      projectName?: string;
      companyName?: string;
    }
  ) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (params.page !== undefined) {
      newSearchParams.set('page', params.page.toString());
    }
    if (params.pageSize !== undefined) {
      newSearchParams.set('pageSize', params.pageSize.toString());
    }
    if (params.projectName !== undefined) {
      if (params.projectName) {
        newSearchParams.set('projectName', params.projectName);
      } else {
        newSearchParams.delete('projectName');
      }
    }
    if (params.companyName !== undefined) {
      if (params.companyName) {
        newSearchParams.set('companyName', params.companyName);
      } else {
        newSearchParams.delete('companyName');
      }
    }

    setSearchParams(newSearchParams);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);

    // 更新URL参数
    updateUrlParams({
      page: 1, // 搜索时重置到第一页
      projectName: values.projectName,
      companyName: values.companyName,
    });

    // 更新分页状态
    setPagination({
      ...pagination,
      current: 1,
    });

    const data = {
      ...values,
      page: 1,
      size: pagination.pageSize,
    };
    fetchData(data);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const TitleCom = ({ text, icon }: { text: string; icon: string }) => {
    return (
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img style={{ width: '10px', marginRight: '5px' }} src={icon} alt="" />
        <div>{text}</div>
      </div>
    );
  };

  const columns = [
    {
      title: <TitleCom text={'序号'} icon={'/mg/icon1.png'} />,
      dataIndex: 'index',
      width: 80,
      render: (_: any, record: any, index: any) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
      align: 'center',
    },
    {
      title: <TitleCom text={'项目名称'} icon={'/mg/icon6.png'} />,
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'left',
      ellipsis: true,
      width: 200,
    },
    {
      title: <TitleCom text={'项目代码'} icon={'/mg/icon7.png'} />,
      dataIndex: 'projectCode',
      align: 'left',
      key: 'projectCode',
      width: 150,
      ellipsis: true,
    },
    {
      title: <TitleCom text={'企业名称'} icon={'/mg/icon2.png'} />,
      dataIndex: 'companyName',
      align: 'left',
      ellipsis: true,
      key: 'companyName',
      width: 200,
    },
    {
      title: <TitleCom text={'统一社会信用代码'} icon={'/mg/icon3.png'} />,
      dataIndex: 'uscc',
      ellipsis: true,
      align: 'center',
      key: 'uscc',
      width: 180,
    },
    {
      title: <TitleCom text={'项目类型'} icon={'/mg/icon4.png'} />,
      dataIndex: 'projectTypeLabel',
      align: 'center',
      key: 'projectTypeLabel',
      width: 120,
      render: (text: any) => {
        return text || '-';
      },
    },
    {
      title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      valueType: 'option',
      align: 'center',
      width: 150,
      minWidth: 100,
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '85px',
                  height: '28px',
                  background: ' #1890FF',
                  borderRadius: '14px',
                  fontSize: '14px',
                  color: '#fff',
                }}
                key="detail"
                onClick={() => {
                  // 跳转到工改项目详情页面
                  navigate(`/xmgl-gg/detail?id=${record.id}`);
                }}
              >
                <div>查看</div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const fetchData = async (params: ListProjectConstructionApprovalRequest) => {
    try {
      setLoading(true);

      // 构建请求参数，包含从ApproveDetail传递的筛选条件
      const requestParams: ListProjectConstructionApprovalRequest = {
        ...params,
        // 如果有传递的筛选参数，添加到请求中
        ...(district && { district }),
        ...(park && { park }),
        ...(year && { year: parseInt(year) }),
        ...(quarter && { quarter: parseInt(quarter) }),
        ...(field && { field }),
      };

      console.log('Fetching data with params:', requestParams);
      const data = await primeApi.listProjectConstructionApproval(requestParams);
      console.log('API response:', data);

      setPagination({
        ...pagination,
        total: data.total,
        current: data.page,
        pageSize: data.size,
      });

      setDataSource(data.records || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      message.error('获取数据失败');
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始化表单值
  useEffect(() => {
    form.setFieldsValue({
      projectName: initialProjectName,
      companyName: initialCompanyName,
    });
  }, [form, initialProjectName, initialCompanyName]);

  useEffect(() => {
    fetchData({
      page: pagination.current,
      size: pagination.pageSize,
    });
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    // 使用URL参数初始化数据
    const initialParams: ListProjectConstructionApprovalRequest = {
      projectName: initialProjectName,
      companyName: initialCompanyName,
      page: initialPage,
      size: initialPageSize,
    };

    // 如果有从ApproveDetail传递的参数，添加到初始请求中
    if (district || park || year || quarter || field) {
      fetchData(initialParams);
    } else {
      fetchData(initialParams);
    }
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content="欢迎使用工程建设模块"
      >
        <div style={{ padding: '20px', backgroundColor: 'white' }}>
          <div style={{ padding: '20px', backgroundImage: 'url(/pm-bg1.png)', backgroundSize: '100% 100%' }}>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <div style={{
                marginRight: '10px',
                width: ' 5px',
                height: '16px',
                background: '#005BF5',
                borderRadius: '2.5px',
              }}></div>
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
                  <Form.Item<FieldType>
                    label="项目名称"
                    name="projectName"
                  >
                    <Input placeholder="请输入项目名称" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType>
                    label="企业名称"
                    name="companyName"
                  >
                    <Input placeholder="请输入企业名称" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                      <Button type="primary" htmlType="submit" loading={loading}>
                        查询
                      </Button>
                      <Button
                        htmlType="button"
                        onClick={() => {
                          form.resetFields();

                        // 重置所有URL参数，包括从外部传入的筛选参数
                        const newSearchParams = new URLSearchParams();
                        newSearchParams.set('page', '1');
                        newSearchParams.set('pageSize', initialPageSize.toString());
                        setSearchParams(newSearchParams);

                        // 重置分页状态到第一页，使用初始的每页数量
                        setPagination({
                          ...pagination,
                          current: 1,
                          pageSize: initialPageSize,
                        });

                        // 重新获取数据，不使用任何筛选条件
                        fetchData({
                          page: 1,
                          size: initialPageSize,
                        });
                      }}
                    >
                      重置
                    </Button>
                  </Space>
                </Form.Item>
                </Col>
              </Row>

              <Row>
                {/*<Form.Item<FieldType>*/}
                {/*  style={{ width: '25%' }}*/}
                {/*  label="统一社会信用代码"*/}
                {/*  name="uscc"*/}
                {/*>*/}
                {/*  <Input placeholder="请输入统一社会信用代码" />*/}
                {/*</Form.Item>*/}

              </Row>
            </Form>
          </div>

          <Table
            style={{ marginTop: 20 }}
            rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            columns={columns}
            bordered={true}
            dataSource={dataSource}
            pagination={false}
            loading={loading}
            onChange={handleTableChange}
            rowKey="id"
          />

          <Pagination
            showSizeChanger={false}
            current={pagination.current}
            pageSize={pagination.pageSize}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            onChange={(page, pageSize) => {
              // 更新URL参数
              updateUrlParams({
                page: page,
                pageSize: pageSize,
              });

              // 更新分页状态
              setPagination({
                ...pagination,
                current: page,
                pageSize: pageSize,
              });

              // 重新获取数据
              fetchData({
                projectName: form.getFieldValue('projectName'),
                companyName: form.getFieldValue('companyName'),
                page: page,
                size: pageSize,
              });
            }}
            style={{ marginTop: '16px' }}
          />
        </div>
      </PageContainer>
    </div>
  );
};

export default ProjectManageGG;
