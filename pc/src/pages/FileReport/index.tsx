import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Table, Upload, UploadFile, UploadProps,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { primeApi, systemApi } from '@/services/api';
import {
  CreateFormFileReportRequest,
  FormFileReportDto,
  FormMonitorIndicatorFieldDto,
  ListFormFileReportRequest,
} from '@/services/apis';
import { UploadOutlined} from '@ant-design/icons';

type FieldType = {
  dynamicInputs?:Array<FormMonitorIndicatorFieldDto>,
  username?: string;
  taskName?: string;
  supportIndicatorId?: string;
  fileTemplate?: string;
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
type DepartOption ={
  value?:string
  label?:string
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const FileReport = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isUpdata, setIsUpdata] = useState(false);
  const [id, setId] = useState('');
  const [depart, setDepart] = useState<DepartOption[]>()
  const [, setType] = useState<DepartOption[]>()
  const [collectionFrequencyList, setCollectionFrequencyList] = useState<DepartOption[]>()
  const [fileTemplate, setFileTemplate] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
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
        setIsUploading(false);
        const path = file.response?.[0]?.path ?? file.response?.path;
        if (path) setFileTemplate(path);
      }
    },
  };
  const handleTableChange = (pagination: any) => {
    setPagination(pagination); // 更新 pagination 状态，触发数据重新获取
  };

  const [dataSource, setDataSource] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };


  // 查询支撑指标信息列表
  const fetchData = async (params: ListFormFileReportRequest) => {
    console.log(params);
    const data = await primeApi.listFormFileReport(params);
    console.log(data);
    setPagination({
      ...pagination,
      total: data.total,
      current: data.page,
      pageSize: data.size,
    });
    console.log('data', data.records);
    setDataSource(data.records);
  };

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    const data = {
      ...values,
      current: pagination.current,
      pageSize: pagination.pageSize,
    };
    fetchData(data);
  };

  //查询频次 collection_frequency
  const getDictItems = async () => {
    const data = await systemApi.getDictItems({ catalog: 'collection_frequency'});
    console.log('getDictItems', data);
    const dataList = data.map((item: any) => ({
      label: item.label,
      value: item.code,
    }));
    setCollectionFrequencyList(dataList);
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

  //查询部门 field_type
  const getDictItems2 = async () => {
    const data = await systemApi.getDictItems({ catalog: 'field_type'});
    console.log('getDictItems', data);
    const dataList = data.map((item: any) => ({
      label: item.label,
      value: item.code,
    }));
    setType(dataList);
  };


  //创建支撑指标信息
  const createFormFileReport = async (values: CreateFormFileReportRequest) => {
    const data = await primeApi.createFormFileReport(values);
    console.log('createFormFileReport', data);
  };

  //删除支撑指标信息
  const deleteFormSupportIndicator = async (id: string) => {
    const data = await primeApi.deleteFormSupportIndicator({ id: id });
    console.log('deleteFormSupportIndicator', data);
  };

  //修改支撑指标信息
  const updateFormSupportIndicator = async (id: string, values: FormFileReportDto) => {
    const data = await primeApi.updateFormFileReport({
      id: id,
      formFileReportDto: values,
    });
    console.log('updateFormSupportIndicator', data);
  };

  //查询文件报送信息
  const getFormFileReport = async (id: string) => {
    const data = await primeApi.getFormFileReport({ id: id });
    console.log('getFormFileReport', data);
    const ft = data.fileTemplate ?? '';
    setFileList([{ uid: ft, name: ft, status: 'done' as const, url: ft }]);
    form.setFieldsValue({
      indicatorName: data.indicatorName,
      collectionFrequency: data.collectionFrequency,
      department: data.department,
      description: data.description,
    });
  };
  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    // if(fileTemplate===''){
    //   message.error('请上传文件模板');
    //   return
    // }
    if(isUploading){
      message.info('正在上传中');
       return
    }
    values.fileTemplate = fileTemplate;
    if (isUpdata) {
      updateFormSupportIndicator(id, values as FormFileReportDto)
        .then((res) => {
          form.resetFields();
          console.log(res);
          fetchData({

          });
          message.success('修改成功');
          setIsModalOpen(false);
        })
        .catch((err) => {
          console.log(err);
          message.error('修改失败');
          setIsModalOpen(false);
        });
    } else {
      createFormFileReport({ formFileReportDto: values as FormFileReportDto })
        .then((res) => {
          form.resetFields();
          console.log(res);
          fetchData({
          });
          message.success('提交成功');
          setIsModalOpen(false);
        })
        .catch((err) => {
          console.log(err);
          message.error('提交失败');
          setIsModalOpen(false);
        });
    }
  };

  const fetchDict = async () => {
    const res = await systemApi.getDictItems({ catalog: 'project_progress' });
    console.log('resdict', res);
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
      title: '任务名称',
      dataIndex: 'indicatorName',
      key: 'indicatorName',
      width: 120,
      align: 'center' as const,
    },
    {
      title: '任务简介',
      dataIndex: 'description',
      align: 'center' as const,
      width: 120,
      ellipsis: true,
      key: 'description',
      render: (text:string) => (
        <span style={{ textAlign: 'center' }}>
          {text||'暂无' }
        </span>
      ),
    },
    {
      title: '需求频次',
      dataIndex: 'collectionFrequencyLabel',
      align: 'center' as const,
      width: 120,
      ellipsis: true,
      key: 'collectionFrequencyLabel',
    },
    {
      title: '牵头部门',
      dataIndex: 'departmentName',
      align: 'center' as const,
      width: 120,
      ellipsis: true,
      key: 'departmentName',
    },

    {
      title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      valueType: 'option',
      align: 'center' as const,
      width: 120,
      fixed: 'right' as const,
      render: (text: any, record: any) => [
        <div key="operate" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              marginLeft: '10px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '70px',
              height: '28px',
              background: ' #1890FF',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#fff',
            }}
            key="down"
            onClick={() => {
              setIsModalOpen(true);
              setIsUpdata(true);
              setId(record.id);
              getFormFileReport(record.id);
            }}
          >
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              编辑
            </div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
          </div>

          <div
            style={{
              marginLeft: '10px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '70px',
              height: '28px',
              background: ' red',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#fff',
            }}
            key="down"
            onClick={() => {
              console.log('删除', record.id);
              deleteFormSupportIndicator(record.id)
                .then(() => {
                  message.success('删除成功');
                  fetchData({
                  });
                })
                .catch((e) => {
                  message.error(e.message);
                });
            }}
          >
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              删除
            </div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/del.png" alt="" />
          </div>
        </div>,
      ],
    },
  ];
  useEffect(() => {
    fetchDict();
    getDictItems()
    getDictItems1()
    getDictItems2()
  }, []);

  useEffect(() => {
    fetchData({
      taskName: form1.getFieldsValue().taskName,
      department: form1.getFieldsValue().department,
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
        content="欢迎使用材料报送任务模块"
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
              <Row>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                  }}
                  label="任务名称"
                  name="taskName"
                >
                  <Input />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                    width: '25%',
                  }}
                  label="牵头部门"
                  name="department"
                >
                  <Select optionFilterProp="label" showSearch  options={depart} />
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
                  <Button
                    type="primary"
                    onClick={() => {
                      setIsUpdata(false);
                      setIsModalOpen(true);
                    }}
                  >
                    新增报送任务
                  </Button>
                  <Button style={{ marginLeft: '20px' }} type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    style={{ marginLeft: '20px' }}
                    htmlType="button"
                    onClick={() => {
                      form1.resetFields();
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
          {/*</Form>*/}
          <Table
            style={{ marginTop: 20 }}
            columns={columns}
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
              setPagination({ ...pagination, current: page, pageSize: pageSize });
            }} // 直接在 Pagination 中更新页码状态以触发数据获取
            style={{ marginTop: '16px' }} // 可选：添加一些样式间距以改善布局
          />
        </div>
        <Modal title="新增报送任务" open={isModalOpen} footer={false} onCancel={handleCancel}>
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
              label="指标名称"
              name="indicatorName"
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请选择收集频次' }]}
              label="收集频次"
              name="collectionFrequency"
            >
              <Select options={collectionFrequencyList} />
            </Form.Item>
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请选择牵头部门' }]}
              label="牵头部门"
              name="department"
            >
              <Select options={depart} showSearch={true} optionFilterProp="label" />
            </Form.Item>
            <Form.Item<FieldType>
              label="任务简介"
              name="description"
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item label="模版上传" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: '请上传文件模版' }]}>
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
                <Button type="primary" htmlType="submit">
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

export default FileReport;
