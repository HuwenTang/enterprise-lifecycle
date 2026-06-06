import { primeApi, systemApi } from '@/services/api';
import { ListGdpStatisticalDataRecordsRequest } from '@/services/apis';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import {
  Button,
  Col,
  Form,
  FormProps,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

type FieldType = {
  statisticsName?: string;
  dataSource?: string;
  year?: number;
};
const BasicData = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const handleTableChange = (pagination: any) => {
    setPagination(pagination); // 更新 pagination 状态，触发数据重新获取
  };

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [optionsYear, setOptionsYear] = useState<any[]>([]);

  const fetchYear = () => {
    const yearsList = [
      {
        value: null,
        label: '不限',
      },
    ];
    let nowYear = dayjs().year();
    for (let index = 2023; index <= nowYear; index++) {
      yearsList.push({
        value: index,
        label: index,
      });
    }
    setOptionsYear(yearsList);
  };

  const fetchData = async (params: ListGdpStatisticalDataRecordsRequest) => {
    console.log(params);
    const data = await primeApi.listGdpStatisticalDataRecords(params);
    console.log(data);
    setPagination({
      ...pagination,
      total: data.total,
      current: data.page,
      pageSize: data.size,
    });
    setDataSource(data.records);
  };

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    const data = {
      statisticsName: values.statisticsName||'',
      dataSource: values.dataSource || '',
      year: values.year || undefined,
      page: pagination.current,
      size: pagination.pageSize,
    };
    fetchData(data);
  };

  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const fetchDict = async () => {
    const res = await systemApi.getDictItems({ catalog: 'project_progress' });
    console.log('resdict', res);
  };

  const TitleCom = ({ text, icon }: { text: string; icon: string }) => {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img style={{ width: '10px', marginRight: '5px' }} src={icon} alt="" />
        <div>{text}</div>
      </div>
    );
  };
  const columns = [
    {
      title: <TitleCom text={'统计名称'} icon={'/mg/icon6.png'} />,
      dataIndex: 'statisticsName',
      key: 'statisticsName',
      align: 'center',
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text={'年度'} icon={'/mg/icon7.png'} />,
      dataIndex: 'year',
      align: 'center',
      key: 'year',
      width: 200,
      ellipsis: true,
      render: (text: any) => (
        <span style={{ textAlign: 'left' }} title={text}>
          {text}
        </span>
      ), // 内容居右
    },
    {
      title: <TitleCom text={'数据来源'} icon={'/mg/icon2.png'} />,
      dataIndex: 'dataSource',
      align: 'center',
      ellipsis: true,
      key: 'dataSource',
      width: 120,
    },

    {
      title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      valueType: 'option',
      align: 'center',
      width: 180,
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
                key="down"
                onClick={() => {
                    navigate(`/gdp/basic-data-detail?id=${record.id}&name=${record.statisticsName}`);
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

  const getSys = () => {
    lx.device.getSystemInfo({
      success: function (res: any) {
        if (res.systemType === 'iOS' || res.systemType === 'Android') {
          setCollapsed(!collapsed);
        }
      },
      fail: function (err: any) {
        console.log(err);
      },
    });
  };

  useEffect(() => {
    fetchYear();
    getSys();
    fetchDict();
  }, []);

  useEffect(() => {
    fetchData({
      statisticsName: '',
      dataSource: '',
      year: undefined,
      page: pagination.current,
      size: pagination.pageSize,
    });
  }, [pagination.current, pagination.pageSize]);
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      {/*<OrgStruct setOrgId={setOrgId} setOption={setOption} option={option} responsive={collapsed} />*/}
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content="欢迎使用分市区基础数据模块"
      >
        <div style={{ padding: '20px', backgroundColor: 'white' }}>
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
                  width: ' 5px',
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
              onFinish={onFinish1}
              onFinishFailed={onFinishFailed1}
              autoComplete="off"
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item<FieldType>
                    label="统计名称"
                    name="statisticsName"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType>
                    label="数据来源"
                    name="dataSource"
                  >
                    <Select
                      options={[
                        {
                          value: '统计局',
                          label: '统计局',
                        },
                      ]}
                    ></Select>
                  </Form.Item>
                </Col>
                {/*<Col span={6}>*/}
                {/*  <Form.Item<FieldType>*/}
                {/*    label="统计年度"*/}
                {/*    name="year"*/}
                {/*  >*/}
                {/*    <Select options={optionsYear}></Select>*/}
                {/*  </Form.Item>*/}
                {/*</Col>*/}
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button
                        htmlType="button"
                        onClick={() => {
                          fetchData({
                            statisticsName: '',
                            dataSource: '',
                            year: undefined,
                            page: pagination.current,
                            size: pagination.pageSize,
                          });
                          form.resetFields();
                        }}
                      >
                        重置
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          {/*</Form>*/}
          <Table
            style={{ marginTop: 20 }}
            rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            columns={columns}
            rowKey={(record=>record.id)}
            bordered={true}
            dataSource={dataSource}
            pagination={false}
            onChange={handleTableChange}
          />
          <Pagination
            showSizeChanger={false}
            current={pagination.current}
            // pageSize={pagination.pageSize}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            onChange={(page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize: pageSize });
            }} // 直接在 Pagination 中更新页码状态以触发数据获取
            style={{ marginTop: '16px' }} // 可选：添加一些样式间距以改善布局
          />
        </div>
      </PageContainer>
    </div>
  );
};

export default BasicData;
