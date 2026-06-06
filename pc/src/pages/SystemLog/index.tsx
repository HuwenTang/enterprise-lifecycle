import {
  Button,
  DatePicker,
  Form,
  FormProps,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { systemApi } from '@/services/api';
import { ListSystemLogRequest } from '@/services/apis';
import dayjs from 'dayjs';

type FieldType = {
  projectCode?: string;
  userName?: string;
  name?: string;
  success?: boolean;
  currentProjectProgress?: string;
  projectContent?: string;
  investmentAmount?: string;
  content?: string;
  startTime?: string;
  endTime?: string;
  amount?: string;
  grantForTaizhengtong?: boolean;
  roles?: string[];
};
const SystemLog = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [query, setQuery] = useState<Omit<ListSystemLogRequest, 'page' | 'size'>>({});

  const handleTableChange = (p: { current?: number; pageSize?: number; total?: number }) => {
    setPagination((prev) => ({ ...prev, ...p }));
  };

  const fetchData = async (params: ListSystemLogRequest) => {
    console.log(params);
    const data = await systemApi.listSystemLog(params);
    console.log(data);
    setPagination((prev) => ({
      ...prev,
      total: data.total,
      current: data.page,
      pageSize: data.size,
    }));
    console.log('data', data.records);
    setDataSource(data.records);
  };

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    const startTime: Date | undefined = values.startTime
      ? (dayjs.isDayjs(values.startTime) ? values.startTime.toDate() : new Date(values.startTime as string))
      : undefined;
    const endTime: Date | undefined = values.endTime
      ? (dayjs.isDayjs(values.endTime) ? values.endTime.toDate() : new Date(values.endTime as string))
      : undefined;
    // 更新查询条件，并重置到第一页
    const nextQuery: Omit<ListSystemLogRequest, 'page' | 'size'> = {
      userName: values.userName,
      name: values.name,
      success: values.success,
      startTime,
      endTime,
    };
    setQuery(nextQuery);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  const fetchDict = async () => {
    const res = await systemApi.getDictItems({catalog:'project_progress'});
    console.log('resdict',res)
  };


  const TitleCom = ({ text, icon }: { text: string; icon: string }) => {
    return (
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img style={{ width: '10px' ,marginRight: '5px'}} src={icon} alt="" />
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
        return index + 1;
      },
      align: 'center' as const,
    },
    {
      title: <TitleCom text={'用户姓名'} icon={'/mg/icon3.png'} />,
      dataIndex: 'userName',
      ellipsis: true,
      align: 'center' as const,
      key: 'userName',
    },
    {
      title: <TitleCom text={'日志名称'} icon={'/mg/icon2.png'} />,
      key: 'name',
      dataIndex: 'name',
      align: 'center' as const,
      ellipsis: true,
    },

    {
      title: <TitleCom text={'请求方法'} icon={'/mg/icon3.png'} />,
      dataIndex: 'method',
      ellipsis: true,
      align: 'center' as const,
      key: 'method',
    },
    {
      title: <TitleCom text={'耗时（ms）'} icon={'/mg/icon3.png'} />,
      dataIndex: 'duration',
      ellipsis: true,
      align: 'center' as const,
      key: 'duration',
    },
    {
      title: <TitleCom text={'开始时间'} icon={'/mg/icon3.png'} />,
      dataIndex: 'startTime',
      ellipsis: true,
      align: 'center' as const,
      key: 'startTime',
      render: (text: string) => <div>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</div>,
    },
    {
      title: <TitleCom text={'结束时间'} icon={'/mg/icon3.png'} />,
      dataIndex: 'endTime',
      ellipsis: true,
      align: 'center' as const,
      key: 'endTime',
      render: (text: string) => <div>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</div>,
    },

    // {
    //   title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
    //   valueType: 'option',
    //   align: 'center',
    //   width: 150,
    //   fixed: 'right',
    //   render: (text: any, record: any) => {
    //     return (
    //       <div style={{ display: 'flex', justifyContent: 'center' }}>
    //         <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    //           <div
    //             style={{
    //               cursor: 'pointer',
    //               display: 'flex',
    //               justifyContent: 'center',
    //               alignItems: 'center',
    //               width: '70px',
    //               height: '28px',
    //               background: ' #1890FF',
    //               borderRadius: '14px',
    //               fontSize: '14px',
    //               color: '#fff',
    //             }}
    //             key="down"
    //             onClick={() => {
    //               if (record.currentProjectProgress) {
    //                 navigate(`/xmgl/xmjd?id=${record.id}`);
    //               } else {
    //                 message.info('当前项目暂无进度');
    //               }
    //             }}
    //           >
    //             <div>详情</div>
    //             <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
    //           </div>
    //         </div>
    //
    //       </div>
    //     );
    //   },
    // },
  ];


  const downBlob = async () =>{
    try{
      const userName = form.getFieldValue('userName')
      const name = form.getFieldValue('name')
      const success = form.getFieldValue('success')
      const startTime = form.getFieldValue('startTime')
      const endTime = form.getFieldValue('endTime')

      const value = {
        userName,
        name,
        success,
        startTime,
        endTime
      }

      console.log(value)
      const res = await systemApi.exportSystemLog({...value})
      const a = document.createElement('a');
      a.href = res.path;
      a.download = res.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }catch (error) {
      console.error('下载失败:', error);
    }
  }
  useEffect(() => {
    fetchDict();
  }, []);

  // 分页或查询条件变化时拉取数据
  useEffect(() => {
    fetchData({
      ...query,
      page: pagination.current,
      size: pagination.pageSize,
    });
  }, [pagination.current, pagination.pageSize, query]);
  return (
    <div style={{display: 'flex',}}>
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content="欢迎使用系统日志模块"
      >
        <div style={{padding: '20px', backgroundColor: 'white',}}>
          <div style={{padding: '20px', backgroundImage: 'url(/pm-bg1.png)', backgroundSize: '100% 100%',}}>

            <div style={{display: 'flex', marginBottom: '20px',}}>
              <div style={{
                marginRight: '10px',
                width: ' 5px',
                height: '16px',
                background: '#005BF5',
                borderRadius: '2.5px',
              }}></div>
              <div style={{fontSize: '16px', fontWeight: 'bolder'}}>查询</div>
            </div>
            <Form form={form} layout={'horizontal'} name="basic" initialValues={{remember: true}} onFinish={onFinish1} onFinishFailed={onFinishFailed1} autoComplete="off">
              <Row>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                    width: '25%',
                  }}
                  label="用户名称"
                  name="userName"
                >
                  <Input/>
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                    width: '25%',
                  }}
                  label="日志名称"
                  name="name"
                >
                  <Input/>
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px'
                  }}
                  label="是否成功"
                  name="success"
                >
                 <Select options={[
                   {
                     value: true,
                     label: '是',
                   },
                   {
                     value: false,
                     label: '否',
                   },
                 ]} />
                </Form.Item>
              </Row>
              <Row>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                    width: '25%',
                  }}
                  label="开始时间"
                  name="startTime"
                >
                  <DatePicker />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                    width: '25%',
                  }}
                  label="结束时间"
                  name="endTime"
                >
                  <DatePicker />
                </Form.Item>
                <Form.Item style={{
                  marginLeft: '20px',
                }}>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button
                      htmlType="button"
                      onClick={() => {
                        // 清空条件并回到第一页
                        form.resetFields();
                        setQuery({});
                        setPagination((prev) => ({ ...prev, current: 1 }));
                      }}
                    >
                      重置
                    </Button>
                    <Button onClick={() => downBlob()}>下载日志</Button>
                  </Space>
                </Form.Item>
              </Row>

            </Form>
          </div>
          <Table style={{marginTop: 20}}
                 rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
                 columns={columns}
                 scroll={{x: 1200}}
                 bordered={true}
                 dataSource={dataSource}
                 pagination={false}
                 onChange={handleTableChange}/>



          <Pagination
            showSizeChanger={false}
            current={pagination.current}
            pageSize={pagination.pageSize}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            onChange={(page, pageSize) => {
              setPagination({...pagination, current: page, pageSize: pageSize})
            }} // 直接在 Pagination 中更新页码状态以触发数据获取
            style={{marginTop: '16px'}} // 可选：添加一些样式间距以改善布局
          />
        </div>
      </PageContainer>

    </div>
  );
};

export default SystemLog;
