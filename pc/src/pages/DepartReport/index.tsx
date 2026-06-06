import {
  Button, Col,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Table, Tag, Upload, UploadFile,UploadProps
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { primeApi, systemApi } from '@/services/api';
import {

  FormMonitorIndicatorFieldDto,
   ListFormIndicatorRequest,
} from '@/services/apis';
import dayjs from "dayjs";
import {UploadOutlined} from "@ant-design/icons";
import {useParams} from "@@/exports";
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
type FieldType = {
  dynamicInputs?:Array<FormMonitorIndicatorFieldDto>,
  username?: string;
  supportIndicatorName?: string;
  weekOfYear?: number;
  departmentLabel?: string;
  weekOfMonth?: number;
  year?:number;
  submitted?:boolean;
  month?:number;
  quarter?:number;
  isUpload?:boolean;
  supportIndicatorId?: string;
  monitorIndicatorId?: string;
  fileReportTaskId?: string;
  indicatorName?: string;
  collectionFrequency?: string;
  department?: string;
  description?: string;
  projectCode?: string;
  projectName?: string;
  currentProjectProgress?: string;
  projectContent?: string;
  investmentAmount?: string;
  content?: string;
  amount?: string;
  grantForTaizhengtong?: boolean;
  roles?: string[];
};

type Option ={
  value?:string
  label?:string
}
const DepartReport = () => {
  const [isRead, setIsRead] = useState(false)
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [id, setId] = useState('');
  const [obj, setObj] = useState<Record<string, unknown>>({})
  const [depart, setDepart] = useState<Option[]>()
  const [supportList, setSupportList] = useState<Option[]>()
  const [monitorList, setMonitorList] = useState<Option[]>()
  const [fileReportList, setFileReportList] = useState<Option[]>([])
  const [fileTemplate, setFileTemplate] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [fileList1, setFileList1] = useState<UploadFile[]>([])
  let { deptId } = useParams();
  const handleTableChange = (pagination: any) => {
    // 防止 page 传 0
    setPagination({
      ...pagination,
      current: pagination?.current && pagination.current > 0 ? pagination.current : 1,
    }); // 更新 pagination 状态，触发数据重新获取
  };
  const [values, setValues] = useState({})
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [dataSource1, setDataSource1] = useState<any[]>([]);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  //查询频次 collection_frequency
  const getDictItems = async () => {
    await systemApi.getDictItems({ catalog: 'collection_frequency'});
  };

  const props: UploadProps = {
    action: '/system-api/file',
    name:"files",
    maxCount: 1,
    fileList:fileList,
    onChange({ file, fileList }) {
      setIsUploading(true)
      setFileList(fileList)
      if (file.status !== 'uploading') {
        console.log(file, fileList);
        setIsUploading( false)
        setFileTemplate(file.response[0].path)
      }
    },
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values)
    if(fileTemplate===''){
      message.error('请上传文件模板');
      return
    }
    if(isUploading){
      message.info('正在上传中');
      return
    }
  };

  //查询文件报送信息
  const getFormFileReport = async (id: string) => {
    const data = await primeApi.getFormFileReport({ id: id });
    console.log('getFormFileReport', data);
    const list: UploadFile[] = [
      {
        uid: data.fileTemplate ?? '',
        name: data.fileTemplate ?? '',
        status: 'done',
        url: data.fileTemplate ?? '',
      }
    ];
    setFileList1(list)
    form.setFieldsValue({
      indicatorName: data.indicatorName,
      departmentLabel: data.departmentName,
      description: data.description,
    });
  };

  //查询部门 collection_dept
  const getDictItems1 = async () => {
    const data = await systemApi.getDictItems({ catalog: 'collection_dept'});
    console.log('getDictItems', data);
    const dataList = data.map((item: any) => ({
      label: item.label,
      value: item.code,
    }));
    setDepart(dataList);
  };
  //获取字段表
  const getFormMonitorIndicatorFields = async (id:string) => {
    const data = await primeApi.getFormMonitorIndicatorFields({id:id});
    console.log('getFormMonitorIndicatorFields',data)
    setDataSource1(data)
  };

  // 查询监测指标信息列表
  const fetchData = async (params: ListFormIndicatorRequest & { current?: number; pageSize?: number } = {}) => {
    const { page, size, current, pageSize, ...rest } = params || {};
    // page 最低为 1，避免后端收到 0
    const query: ListFormIndicatorRequest = {
      page: (page && page > 0 ? page : (current && current > 0 ? current : pagination.current)) || 1,
      size: size ?? pageSize ?? pagination.pageSize ?? 10,
      ...rest,
    };
    if (deptId) {
      query.department = deptId;
    }
    console.log(query);
    try {
      const data = await primeApi.listFormIndicator(query);
      console.log(data);
      setPagination({
        ...pagination,
        total: data.total,
        current: data.page,
        pageSize: data.size,
      });

      console.log('data', data.records);
      setDataSource(data.records);
    }catch (e){
      console.log(e)
    }
  };

  //获取支撑列表
  const listFormSupportIndicator = async () => {
    // 有部门上下文时，按部门筛选支撑指标
    const params = deptId ? { department: deptId } : undefined;
    const data = await primeApi.allFormSupportIndicator(params);
    setSupportList(data);
    console.log('listFormSupportIndicator', data);
  };

  // 根据支撑指标获取监测指标列表
  const fetchMonitorBySupport = async (supportIndicatorId?: string) => {
    if (!supportIndicatorId) {
      // 清空选择时重置监测列表
      setMonitorList([]);
      return;
    }
    try {
      const data = await primeApi.allFormSupportIndicator1({ supportIndicatorId });
      // const list = data.map((item: any) => ({
      //   value: item.id,
      //   label: item.indicatorName,
      // }));
      setMonitorList(data);
    } catch (e) {
      console.log('fetchMonitorBySupport error', e);
    }
  };

  // 获取文件报送任务列表
  const fetchFileReportList = async () => {
    try {
      const params = deptId ? { department: deptId } : undefined;
      const data = await primeApi.allFormFileReport(params);
      setFileReportList(data);
      console.log('fetchFileReportList', data);
    } catch (e) {
      console.log('fetchFileReportList error', e);
    }
  };

  //查询监测指标填报记录
  const getFormIndicator = async (id:string) => {
    const data = await primeApi.getFormIndicator({id:id});
    console.log('getFormIndicator',data)
    setObj(data.data)
    if(data.data.file!==''){
      const fileUrl = data.data.file ?? '';
      const list: UploadFile[] = [
        {
          uid: fileUrl,
          name: fileUrl,
          status: 'done',
          url: fileUrl,
        }
      ];
      setFileList(list)
    }
  };

  // 获取监测列表（已废弃：改为按支撑指标动态拉取）
  // const listFormMonitorIndicator = async () => {
  //   const data = await primeApi.listFormMonitorIndicator({
  //     page: pagination.current,
  //     size: pagination.pageSize,
  //   });
  //   const list = data.records.map((item: any) => ({
  //     value: item.id,
  //     label: item.indicatorName,
  //   }));
  //   setMonitorList(list)
  // };

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    setValues( values)
    const data = {
      ...values,
      page: pagination.current || 1,
      size: pagination.pageSize || 10,
    };
    fetchData(data);
  };

  //查询监测指标信息
  const getFormMonitorIndicator = async (id: string) => {
    const data = await primeApi.getFormMonitorIndicator({ id: id });
    console.log('getFormSupportIndicator', data);
    form.setFieldsValue({
      indicatorName: data.indicatorName,
      collectionFrequency: data.collectionFrequency,
      department: data.departmentName,
      description: data.description,
    });
    form2.setFieldsValue({
      supportIndicatorName: data.supportIndicatorName,
      indicatorName: data.indicatorName,
      department: data.departmentName,
      description: data.description,
    });
  };

  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
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
      title: '序号',
      align: 'center' as const,
      dataIndex: 'index',
      width: 50,
      render: (text: string, record: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: '任务名称',
      ellipsis: true,
      dataIndex: 'monitorIndicatorName',
      key: 'monitorIndicatorName',
      width: 120,
      align: 'center' as const,
      render: (_:any,record:any) => (
        <span style={{ textAlign: 'center' }} >
          {record.monitorIndicatorName||record.fileReportTaskName}
        </span>
      ),
    },
    {
      title: '周期',
      ellipsis: true,
      width: 120,
      align: 'center' as const,
      render: (_text: string, record: any) => {
            return dayjs(record.startDate).format('YYYY-MM-DD') +"-"+ dayjs(record.endDate).format('YYYY-MM-DD');
        },
    },
    {
      title: '类型',
      dataIndex: 'collectionFrequencyLabel',
      align: 'center' as const,
      width: 80,
      ellipsis: true,
      key: 'collectionFrequencyLabel',
    },
    {
      title: '季度',
      dataIndex: 'quarter',
      align: 'center' as const,
      width: 80,
      ellipsis: true,
      key: 'quarter',
    },
    {
      title: '月度',
      dataIndex: 'month',
      align: 'center' as const,
      width: 80,
      ellipsis: true,
      key: 'month',
    },
    {
      title: '周次',
      dataIndex: 'weekOfMonth',
      align: 'center' as const,
      width: 80,
      ellipsis: true,
      key: 'weekOfMonth',
    },
    {
      title: '责任部门',
      dataIndex: 'departmentName',
      align: 'center' as const,
      width: 120,
      ellipsis: true,
      key: 'departmentName',
    },
    {
      title: '是否已填报',
      dataIndex: 'submitted',
      align: 'center' as const,
      width: 80,
      ellipsis: true,
      key: 'submitted',
      render: (text: boolean) => {
        if (text) {
          return <Tag color="green">已填报</Tag>;
        } else {
          return <Tag color="red">未填报</Tag>;
        }
      },
    },
    {
      title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      valueType: 'option',
      align: 'center' as const,
      width: 120,
      fixed: 'right' as const,
      render: (text: any, record: any) => [
        <div key="operate" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{marginLeft: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '70px', height: '28px', background: ' #1890FF', borderRadius: '14px', fontSize: '12px', color: '#fff',}}
               key="down"
               onClick={() => {
                 if(record.submitted){
                   setIsRead( true)
                 }else {
                   setIsRead(false)
                 }
                 if(record.monitorIndicatorId) {
                   setId(record.id);
                   setIsModalOpen1(true)
                   getFormMonitorIndicatorFields(record.monitorIndicatorId)
                   getFormMonitorIndicator(record.monitorIndicatorId);
                   getFormIndicator(record.id)
                 }else if(record.fileReportTaskName) {
                   setId(record.id)
                   setIsModalOpen2(true)
                   form.setFieldsValue({
                     collectionFrequency:dayjs(record.startDate).format('YYYY-MM-DD')+'-'+dayjs(record.endDate).format('YYYY-MM-DD')
                   })
                   getFormFileReport(record.fileReportTaskId)
                   getFormIndicator(record.id)
                 }
               }}
          >
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {record.submitted ? '查看' : '填报'}
            </div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
          </div>
        </div>,
      ],
    },
  ];

  const columns1 = [
    {
      title: '字段名称',
      ellipsis: true,
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 120,
      align: 'center' as const,
    },
    {
      title: '类型',
      dataIndex: 'fieldTypeLabel',
      align: 'center' as const,
      width: 120,
      ellipsis: true,
      key: 'fieldTypeLabel',
    },
    {
      title: ' 单位',
      ellipsis: true,
      dataIndex: 'fieldUnit',
      key: 'fieldUnit',
      width: 120,
      align: 'center' as const,
    },

    {
      title: '是否必填',
      dataIndex: 'notNull',
      align: 'center' as const,
      width: 120,
      ellipsis: true,
      render: (text: boolean) => {
        if (text) {
          return <Tag color="green">是</Tag>;
        } else {
          return <Tag color="blue">否</Tag>;
        }
      },
    },
    {
      title: ' 填报值',
      dataIndex: 'fieldUnit',
      key: 'fieldUnit',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Input value={String(obj[record.fieldName] ?? '')} onChange={(e) => {
          setObj( {
            ...obj,
            [record.fieldName]: e.target.value,
          })
          record.fieldValue = e.target.value;
        }} type={record.fieldType} placeholder={'请填写内容'} />
      ),
    },
  ];


  //创建监测指标信息
  const createFormMonitorIndicator = async (values: FieldType) => {
    await primeApi.updateFormMonitorIndicator({
      id,
      formMonitorIndicatorDto: {
        supportIndicatorId: values.supportIndicatorId ?? '',
        indicatorName: values.indicatorName ?? '',
        collectionFrequency: values.collectionFrequency ?? '',
        department: values.department ?? '',
        description: values.description ?? '',
        fields: values.dynamicInputs ?? [],
      },
    });
  };

  const onFinish2: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    createFormMonitorIndicator(values).then(() => {
      message.success('保存成功');
      setIsModalOpen1(false)
      fetchData({});
    });
  };

  //填报监测指标记录
  const submitFormIndicatorRecord =async (values:any) => {
      const data = await primeApi.submitFormIndicatorRecord({
        id:id,
        requestBody:values
      });
      console.log('submitFormIndicatorRecord',data)
      message.success('提交成功');
      fetchData({})
      setIsModalOpen1(false)
  };
  const submitFormIndicatorRecord2 =async (values:any) => {
    const data = await primeApi.submitFormIndicatorRecord({
      id:id,
      requestBody:values
    });
    console.log('submitFormIndicatorRecord',data)
    message.success('提交成功');
    fetchData({})
    setIsModalOpen2(false)
  };

  useEffect(() => {
    listFormSupportIndicator();
    fetchFileReportList();
    // 监测指标列表按支撑指标选择动态获取；初始不加载
  }, [deptId]);
  useEffect(() => {
    fetchData({});
    if(!deptId){
      getDictItems1()
    }
    getDictItems()
    console.log('deptId',deptId)
  }, [deptId]);


  useEffect(() => {
    console.log()
    fetchData({
      ...values,
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
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content="欢迎使用数据填报模块"
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
                  width: ' 5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              ></div>
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>查询</div>
            </div>
            <Form
              form={form1}
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
                  label="支撑指标"
                  name="supportIndicatorId"
                >
                  <Select
                    allowClear
                    options={supportList}
                    onChange={(val) => {
                      form1.setFieldsValue({ monitorIndicatorId: undefined });
                      if (!val) {
                        setMonitorList([]);
                        return;
                      }
                      fetchMonitorBySupport(val);
                    }}
                  />
                </Form.Item>
                </Col>
                <Col span={6}>
                <Form.Item<FieldType>
                  label="监测指标"
                  name="monitorIndicatorId"
                >
                  <Select options={monitorList} />
                </Form.Item>
                </Col>
                <Col span={6}>
                <Form.Item<FieldType>
                  label="文件报送任务"
                  name="fileReportTaskId"
                >
                  <Select allowClear options={fileReportList} />
                </Form.Item>
                </Col>
                <Col span={6}>
                <Form.Item<FieldType>
                  label="是否填报"
                  name="submitted"
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
                </Col>
              </Row>
              <Row gutter={16}>
                {!deptId && (
                  <Col span={6}>
                  <Form.Item<FieldType>
                    label="责任部门"
                    name="department"
                  >
                    <Select showSearch options={depart} />
                  </Form.Item>
                  </Col>
                )}
                <Col span={6}>
                <Form.Item<FieldType>
                  label="年度选择"
                  name="year"
                >
                  <Input placeholder="请输入年份" />
                </Form.Item>
                </Col>
                <Col span={6}>
                <Form.Item<FieldType>
                  label="月度"
                  name="month"
                >
                  <Select options={[
                    {
                      value: 1,
                      label: '1',
                    },
                    {
                      value: 2,
                      label: '2',
                    },
                    {
                      value: 3,
                      label: '3',
                    },
                    {
                      value: 4,
                      label: '4',
                    },
                    {
                      value: 5,
                      label: '5',
                    },
                    {
                      value: 6,
                      label: '6',
                    },
                    {
                      value: 7,
                      label: '7',
                    },{
                      value: 8,
                      label: '8',
                    },{
                      value: 9,
                      label: '9',
                    },{
                      value: 10,
                      label: '10',
                    },{
                      value: 11,
                      label: '11',
                    },{
                      value: 12,
                      label: '12',
                    },
                  ]} />
                </Form.Item>
                </Col>
                <Col span={6}>
                <Form.Item<FieldType>
                  label="周次"
                  name="weekOfMonth"
                >
                  <Select options={[
                    {
                      value: 1,
                      label: '1',
                    },{
                      value: 2,
                      label: '2',
                    }, {
                      value: 3,
                      label: '3',
                    },
                    {
                      value: 4,
                      label: '4',
                    },
                    {
                      value: 5,
                      label: '5',
                    }
                  ]} />
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
                  <Button
                    htmlType="button"
                    onClick={() => {
                      form1.resetFields();
                      fetchData({});
                      setValues({})
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
            // rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            columns={columns}
            scroll={{x: 1200}}
            bordered={true}
            dataSource={dataSource}
            pagination={false}
            onChange={handleTableChange}
          />
          <Pagination
            current={pagination.current}
            // pageSize={pagination.pageSize}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            onChange={(page, pageSize) => {
              // 保证 page 至少为 1，避免传 0
              setPagination({ ...pagination, current: page && page > 0 ? page : 1, pageSize: pageSize });
            }} // 直接在 Pagination 中更新页码状态以触发数据获取
            style={{ marginTop: '16px' }} // 可选：添加一些样式间距以改善布局
          />
        </div>
        <Modal width={800} title="数据填报" open={isModalOpen1} footer={false} onCancel={handleCancel1}>
          <Form
            form={form2}
            layout={'vertical'}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 800, paddingBottom: '20px', marginTop: '20px' }}
            initialValues={{ remember: true }}
            onFinish={onFinish2}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请输入指标名称' }]}
              label="支撑指标名称"
              name="supportIndicatorName"
            >
              <Select options={supportList} disabled={ true} />
            </Form.Item>
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请输入监测指标名称' }]}
              label="监测指标名称"
              name="indicatorName"
            >
              <Input placeholder={'请输入监测指标名称'} disabled={ true}/>
            </Form.Item>
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请选择责任部门' }]}
              label="责任部门"
              name="department"
            >
              <Select options={depart} showSearch disabled={ true}/>
            </Form.Item>
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请输入指标简介' }]}
              label="指标简介"
              name="description"
            >
              <Input.TextArea placeholder={'请输入指标简介'} disabled={ true}/>
            </Form.Item>
            <Table
              style={{ marginTop: 20 }}
              // rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
              columns={columns1}
              // scroll={{x: 1200}}
              bordered={true}
              dataSource={dataSource1}
              pagination={false}
              onChange={handleTableChange}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button type="primary" onClick={() => {
                console.log(obj)
                for(let i=0;i<dataSource1.length;i++){
                  const key = dataSource1[i].fieldName ?? dataSource1[i].id;
                  if(dataSource1[i].notNull && !obj[key]){
                    message.error((dataSource1[i].fieldName ?? '') + '该项未填写')
                    return
                  }
                }
                submitFormIndicatorRecord(obj)
              }}>
                {isRead ? '更新' : '确定'}
              </Button>
            </div>
          </Form>
        </Modal>

        <Modal title="文件报送" open={isModalOpen2} footer={false} onCancel={handleCancel2}>
          <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600,marginTop: '20px'}}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请输入指标名称' }]}
              label="任务名称"
              name="indicatorName"
            >
              <Input disabled={ true}/>
            </Form.Item>
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请选择收集频次' }]}
              label="收集频次"
              name="collectionFrequency"
            >
              <Input  disabled={ true}/>
            </Form.Item>
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请选择牵头部门' }]}
              label="责任部门"
              name="departmentLabel"
            >
              <Select disabled={ true} options={depart} optionFilterProp="label" showSearch/>
            </Form.Item>
            <Form.Item<FieldType>
              label="任务简介"
              name="description"
            >
              <Input.TextArea  disabled={ true}/>
            </Form.Item>
            <Form.Item<FieldType>
              label="模版下载"
            >
              <Button onClick={() =>{
                window.open(fileList1[0].name)
              }} type={'primary'} icon={<UploadOutlined />}>文件下载</Button>

            </Form.Item>

            <Form.Item label="文件上传" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: '请上传文件模版' }]}>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>文件上传</Button>
              </Upload>
            </Form.Item>
            <Form.Item label={null}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'right',
                }}
              >
                <Button type="primary" onClick={() => {
                  if(isUploading){
                    message.error('请等待文件上传完成')
                  }
                  console.log(fileList)
                  submitFormIndicatorRecord2({
                    file: fileList[0].response[0].path,
                  })
                }}>
                  提交
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

      </PageContainer>
    </div>
  );
};

export default DepartReport;
