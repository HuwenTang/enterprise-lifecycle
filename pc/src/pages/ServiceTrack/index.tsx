import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Pagination,
  Row,
  Select,
  Table,
  Tag,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { primeApi, systemApi } from '@/services/api';
import { useNavigate } from '@umijs/max';
import { ListProjectDigitalInvestmentAttractingRequest } from '@/services/apis';

type FieldType = {
  taskName?: string;
  projectCode?: string;
  department?: string;
};

const ServiceTrack = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [depart, setDepart] = useState<{ value: string; label: string }[]>([]);

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  // 查询列表数据
  const fetchData = async (params: ListProjectDigitalInvestmentAttractingRequest = {}) => {
    const { page, size, ...rest } = params || {};
    // page 不得为 0，最少为 1
    const query: ListProjectDigitalInvestmentAttractingRequest = {
      page: (page && page > 0 ? page : pagination.current) || 1,
      size: size || pagination.pageSize || 10,
      isSDZProject: true,
      ...rest,
    };
    console.log(query);
    try {
      const data = await primeApi.listProjectDigitalInvestmentAttracting(query);
      console.log(data);
      setPagination({
        ...pagination,
        total: data.total,
        current: data.page,
        pageSize: data.size,
      });
      console.log('data', data.records);
      setDataSource(data.records);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.info('暂无数据');
    }
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

  const columns: any[] = [
    {
      title: <TitleCom text={'序号'} icon={'/mg/icon1.png'} />,
      dataIndex: 'index',
      width: 80,
      render: (_: any, record: any, index: any) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
      align: 'center' as const,
    },
    {
      title: <TitleCom text={'项目名称'} icon={'/mg/icon6.png'} />,
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'left' as const,
      ellipsis: true,
      width: 200,
    },
    {
      title: <TitleCom text={'项目内容'} icon={'/mg/icon7.png'} />,
      dataIndex: 'projectContent',
      align: 'left' as const,
      key: 'projectContent',
      width: 200,
      ellipsis: true,
      render: (text: any) => (
        <span style={{ textAlign: 'left' }} title={text}>
          {text}
        </span>
      ),
    },
    {
      title: <TitleCom text={'所属板块'} icon={'/mg/icon2.png'} />,
      dataIndex: 'parkName',
      align: 'left' as const,
      ellipsis: true,
      key: 'parkName',
      width: 120,
    },
    {
      title: <TitleCom text={'项目状态'} icon={'/mg/icon5.png'} />,
      dataIndex: 'currentProjectProgressLabel',
      key: 'currentProjectProgressLabel',
      align: 'center' as const,
      width: 100,
      render: (text: any) => {
        if (text) {
          if (text.includes('在谈')) {
            return <Tag color="#FF7F50">{text}</Tag>;
          } else if (text.includes('签约')) {
            return <Tag color="#3CB371">{text}</Tag>;
          } else if (text.includes('注册')) {
            return <Tag color="#4169E1">{text}</Tag>;
          } else if (text.includes('备案')) {
            return <Tag color="#9370DB">{text}</Tag>;
          } else if (text.includes('开工')) {
            return <Tag color="#FF4500">{text}</Tag>;
          } else if (text.includes('报批')) {
            return <Tag color="#FF4500">{text}</Tag>;
          } else if (text.includes('竣工')) {
            return <Tag color="#708090">{text}</Tag>;
          } else {
            return <Tag color="blue">{text}</Tag>;
          }
        } else {
          return <Tag color="blue">-</Tag>;
        }
      },
    },
    {
      title: <TitleCom text={'招引单位'} icon={'/mg/icon2.png'} />,
      dataIndex: 'sourceDepartmentName',
      align: 'left' as const,
      ellipsis: true,
      key: 'sourceDepartmentName',
      width: 120,
    },
    {
      title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      valueType: 'option',
      align: 'center' as const,
      width: 200,
      fixed: 'right' as const,
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '85px',
                height: '28px',
                border: '1px solid #1890FF',
                borderRadius: '14px',
                fontSize: '14px',
                color: '#1890FF',
                background: '#fff',
              }}
              onClick={() => {
                if (record.currentProjectProgress) {
                  navigate(`/xmgl/xmjd?id=${record.id}`);
                } else {
                  message.info('当前项目暂无进度');
                }
              }}
            >
              项目详情
            </div>
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '85px',
                height: '28px',
                border: '1px solid #1890FF',
                borderRadius: '14px',
                fontSize: '14px',
                color: '#1890FF',
                background: '#fff',
              }}
              onClick={() => {
                window.open(`/service-record?projectId=${record.id}`, '_blank');
              }}
            >
              服务记录
            </div>
          </div>
        );
      },
    },
  ];

  // 查询部门列表
  const getDictItems = async () => {
    try {
      const data = await systemApi.getDictItems({ catalog: 'project_dept' });
      console.log('getDictItems', data);
      const dataList = data.map((item: any) => ({
        label: item.label,
        value: item.code,
      }));
      setDepart(dataList);
    } catch (error) {
      console.error('获取部门列表失败:', error);
    }
  };

  useEffect(() => {
    getDictItems();
  }, []);

  useEffect(() => {
    const formValues = form.getFieldsValue();
    fetchData({
      projectName: formValues.taskName,
      projectCode: formValues.projectCode,
      attractorUnit: formValues.department,
      page: pagination.current,
      size: pagination.pageSize,
    });
  }, [pagination.current, pagination.pageSize]);

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    // 确保 department 传递的是中文（label）而不是 code
    let departmentLabel = values.department;
    // 如果 department 是 code（value），从 depart 数组中查找对应的 label
    if (departmentLabel && depart && depart.length > 0) {
      const foundOption = depart.find(item => item.value === departmentLabel);
      if (foundOption) {
        departmentLabel = foundOption.label;
      }
    }
    const data: ListProjectDigitalInvestmentAttractingRequest = {
      projectName: values.taskName,
      projectCode: values.projectCode,
      attractorUnit: departmentLabel,
      page: pagination.current || 1,
      size: pagination.pageSize || 10,
    };
    fetchData(data);
  };

  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ display: 'flex' }}>
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content="欢迎使用跟踪服务模块"
      >
        <div style={{ padding: '20px', backgroundColor: 'white' }}>
          <div style={{ padding: '20px', backgroundImage: 'url(/pm-bg1.png)', backgroundSize: '100% 100%' }}>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <div style={{
                marginRight: '10px',
                width: '5px',
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
              onFinish={onFinish1}
              onFinishFailed={onFinishFailed1}
              autoComplete="off"
            >
              <Row>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                  }}
                  label="项目名称"
                  name="taskName"
                >
                  <Input placeholder="请输入项目名称" />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                    width: '25%',
                  }}
                  label="招引部门"
                  name="department"
                >
                  <Select
                    placeholder="请选择招引部门"
                    options={depart}
                    fieldNames={{ label: 'label', value: 'value' }}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    style={{ marginLeft: '20px' }}
                    htmlType="button"
                    onClick={() => {
                      form.resetFields();
                      fetchData({
                        page: pagination.current,
                        size: pagination.pageSize,
                      });
                    }}
                  >
                    重置
                  </Button>
                </Form.Item>
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
            onChange={handleTableChange}
          />
          <Pagination
            showSizeChanger={false}
            current={pagination.current}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            onChange={(page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize: pageSize });
            }}
            style={{ marginTop: '16px' }}
          />
        </div>
      </PageContainer>
    </div>
  );
};

export default ServiceTrack;
