import {
  Button,
  Col,
  DatePicker,
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
import { useNavigate, useSearchParams } from '@umijs/max';
import {
  CreateFormFileReportRequest,
  FormMonitorIndicatorFieldDto,
  FormSupportIndicatorDto, ListFormFileReportRequest,
  ListProjectAppealRequest,
} from '@/services/apis';
import { UploadOutlined} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

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
  sjjgName?: string;
  appealTime?: [Dayjs, Dayjs];
  status?: string;
  currentProjectProgress?: string;
  projectContent?: string;
  investmentAmount?: string;
  content?: string;
  amount?: string;
  grantForTaizhengtong?: boolean;
  roles?: string[];
};
type KpiType = {
  supportIndicatorId?: string;
  indicatorName?: string;
  department?: string;
  description?: string;
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
const ThreeCatch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form4] = Form.useForm();

  // 从 URL 参数初始化分页状态
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const [pagination, setPagination] = useState({ current: initialPage, pageSize: initialPageSize, total: 0 });
  const [isUpdata, setIsUpdata] = useState(false);
  const [id, setId] = useState('');
  const [depart, setDepart] = useState<DepartOption[]>()
  const [type, setType] = useState<DepartOption[]>()
  const [collectionFrequencyList, setCollectionFrequencyList] = useState<DepartOption[]>()
  const [appealStatusList, setAppealStatusList] = useState<DepartOption[]>()
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
        setIsUploading( false)
        setFileTemplate(file.response[0].path)
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


  // 查询项目申诉列表
  const fetchData = async (params: ListProjectAppealRequest = {}) => {
    const { page, size, ...rest } = params || {};
    // page 不得为 0，最少为 1
    const query: ListProjectAppealRequest = {
      page: (page && page > 0 ? page : pagination.current) || 1,
      size: size || pagination.pageSize || 10,
      ...rest,
    };
    console.log(query);
    const data = await primeApi.listProjectAppeal(query);
    console.log(data);
    setPagination({
      ...pagination,
      total: data.total,
      current: data.page,
      pageSize: data.size,
    });
    console.log('data', data.records);
    setDataSource(data.records || []);
  };

  // 更新 URL 参数
  const updateUrlParams = (params: { page?: number; pageSize?: number; [key: string]: any }) => {
    const newParams = new URLSearchParams(searchParams);

    if (params.page !== undefined) {
      newParams.set('page', params.page.toString());
    }
    if (params.pageSize !== undefined) {
      newParams.set('pageSize', params.pageSize.toString());
    }

    // 更新查询参数
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'page' && key !== 'pageSize') {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'appealTime' && Array.isArray(value)) {
            // 日期范围特殊处理
            if (value.length === 2) {
              newParams.set('startTime', value[0].format('YYYY-MM-DD'));
              newParams.set('endTime', value[1].format('YYYY-MM-DD'));
            }
          } else {
            newParams.set(key, String(value));
          }
        } else {
          newParams.delete(key);
          if (key === 'appealTime') {
            newParams.delete('startTime');
            newParams.delete('endTime');
          }
        }
      }
    });

    setSearchParams(newParams);
  };

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);

    // 查询时重置到第一页
    const queryParams: ListProjectAppealRequest = {
      projectName: values.projectName,
      sjjgName: values.sjjgName,
      status: values.status,
      page: 1,
      size: pagination.pageSize || 10,
    };

    // 处理日期范围，只传递日期，不包含时分秒
    if (values.appealTime && values.appealTime.length === 2) {
      // 使用UTC时间创建Date对象，确保toISOString()返回的日期正确（API会调用toISOString().substring(0,10)）
      const startDateStr = values.appealTime[0].format('YYYY-MM-DD');
      const endDateStr = values.appealTime[1].format('YYYY-MM-DD');
      queryParams.startTime = new Date(startDateStr + 'T00:00:00Z');
      queryParams.endTime = new Date(endDateStr + 'T00:00:00Z');
    }

    // 更新 URL 参数
    updateUrlParams({
      page: 1,
      pageSize: pagination.pageSize,
      ...values,
    });

    // 更新分页状态
    setPagination({
      ...pagination,
      current: 1,
    });

    fetchData(queryParams);
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

  //查询处理状态 project_appeal_status
  const getAppealStatusDict = async () => {
    const data = await systemApi.getDictItems({ catalog: 'project_appeal_status'});
    console.log('getAppealStatusDict', data);
    const dataList = data.map((item: any) => ({
      label: item.label,
      value: item.code,
    }));
    setAppealStatusList(dataList);
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
    const list =[
      {
        uid: data.fileTemplate,
        name: data.fileTemplate,
        status: 'done',
        url: data.fileTemplate,
      }
    ]
    setFileList( list)
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
      updateFormSupportIndicator(id, values)
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
      createFormFileReport({ formFileReportDto: values })
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
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 120,
      align: 'center',
    }, {
      title: '所属单位',
      dataIndex: 'sjjgName',
      key: 'sjjgName',
      width: 120,
      align: 'center',
    }, {
      title: '申诉人',
      dataIndex: 'appealer',
      key: 'appealer',
      width: 120,
      align: 'center',
    },{
      title: '申诉时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      align: 'center',
      render: (text: any) => {
        if (!text) return '-';
        return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },{
      title: '状态',
      dataIndex: 'statusLabel',
      key: 'statusLabel',
      width: 120,
      align: 'center',
    },
    {
      title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      valueType: 'option',
      align: 'center',
      width: 120,
      fixed: 'right',
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
              // 先更新当前页面的 URL 参数，保存分页状态
              updateUrlParams({
                page: pagination.current,
                pageSize: pagination.pageSize,
              });
              // 然后跳转到详情页
              navigate(`/project-apeal-advance?id=${record.id}`);
            }}
          >
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              查看
            </div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
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
    getAppealStatusDict()
  }, []);

  // 初始化时从 URL 参数获取数据
  useEffect(() => {
    // 从 URL 参数获取查询条件
    const projectName = searchParams.get('projectName');
    const sjjgName = searchParams.get('sjjgName');
    const status = searchParams.get('status');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');

    const queryParams: ListProjectAppealRequest = {
      page: initialPage,
      size: initialPageSize,
    };

    if (projectName) {
      queryParams.projectName = projectName;
      form1.setFieldValue('projectName', projectName);
    }
    if (sjjgName) {
      queryParams.sjjgName = sjjgName;
      form1.setFieldValue('sjjgName', sjjgName);
    }
    if (status) {
      queryParams.status = status;
      form1.setFieldValue('status', status);
    }
    if (startTime && endTime) {
      queryParams.startTime = new Date(startTime + 'T00:00:00Z');
      queryParams.endTime = new Date(endTime + 'T00:00:00Z');
      // 设置日期范围到表单
      form1.setFieldValue('appealTime', [
        dayjs(startTime),
        dayjs(endTime),
      ]);
    }

    fetchData(queryParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        content="欢迎使用项目申诉模块"
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
                  label="项目名称"
                  name="projectName"
                >
                  <Input placeholder="请输入项目名称" />
                </Form.Item>
                </Col>
                <Col span={6}>
                <Form.Item<FieldType>
                  label="所属单位"
                  name="sjjgName"
                >
                  <Input placeholder="请输入所属单位" />
                </Form.Item>
                </Col>
                <Col span={6}>
                <Form.Item<FieldType>
                  label="申诉时间"
                  name="appealTime"
                >
                  <RangePicker
                    style={{ width: '100%' }}
                    placeholder={['开始时间', '结束时间']}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
                </Col>
                <Col span={6}>
                <Form.Item<FieldType>
                  label="处理状态"
                  name="status"
                >
                  <Select
                    options={appealStatusList}
                    placeholder="请选择处理状态"
                    allowClear
                  />
                </Form.Item>
                </Col>
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
                      form1.resetFields();

                      // 重置 URL 参数
                      const newParams = new URLSearchParams();
                      newParams.set('page', '1');
                      newParams.set('pageSize', pagination.pageSize.toString());
                      setSearchParams(newParams);

                      // 重置分页状态
                      setPagination({
                        current: 1,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                      });

                      fetchData({
                        page: 1,
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
            scroll={{ x: 1000 }}
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
              const newPagination = { ...pagination, current: page, pageSize: pageSize || pagination.pageSize };
              setPagination(newPagination);

              // 更新 URL 参数
              updateUrlParams({
                page: newPagination.current,
                pageSize: newPagination.pageSize,
              });

              // 获取数据
              const formValues = form1.getFieldsValue();
              const queryParams: ListProjectAppealRequest = {
                projectName: formValues.projectName,
                sjjgName: formValues.sjjgName,
                status: formValues.status,
                page: newPagination.current,
                size: newPagination.pageSize,
              };

              // 处理日期范围
              if (formValues.appealTime && formValues.appealTime.length === 2) {
                const startDateStr = formValues.appealTime[0].format('YYYY-MM-DD');
                const endDateStr = formValues.appealTime[1].format('YYYY-MM-DD');
                queryParams.startTime = new Date(startDateStr + 'T00:00:00Z');
                queryParams.endTime = new Date(endDateStr + 'T00:00:00Z');
              }

              fetchData(queryParams);
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

export default ThreeCatch;
