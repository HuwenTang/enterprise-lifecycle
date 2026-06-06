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
  ExportProjectSGDZRequest,
  FormMonitorIndicatorFieldDto,
  FormSupportIndicatorDto, ListFormFileReportRequest,
  ListProjectDigitalInvestmentAttractingRequest,

} from '@/services/apis';
import { UploadOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';

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
  year?: number;
  projectName?: string;
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
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form4] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isUpdata, setIsUpdata] = useState(false);
  const [id, setId] = useState('');
  const [depart, setDepart] = useState<DepartOption[]>()
  const [type, setType] = useState<DepartOption[]>()
  const [collectionFrequencyList, setCollectionFrequencyList] = useState<DepartOption[]>()
  const [fileTemplate, setFileTemplate] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [exporting, setExporting] = useState(false)
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
  // 项目得分详情 Modal 相关状态
  const [projectScoreDetailModalVisible, setProjectScoreDetailModalVisible] = useState(false);
  const [projectScoreDetailData, setProjectScoreDetailData] = useState<any[]>([]);
  const [projectScoreDetailLoading, setProjectScoreDetailLoading] = useState(false);
  const [currentProjectRecord, setCurrentProjectRecord] = useState<any>(null);
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 获取项目得分详情数据
  const fetchProjectScoreDetailData = async (record: any) => {
    try {
      setProjectScoreDetailLoading(true);

      // 调用 getProjectDynamics 接口获取项目动态列表
      const data = await primeApi.getProjectDynamics({
        projectId: record.id,
      });
      console.log('项目得分详情数据:', data);

      // 将返回的数据转换为表格所需格式
      const formattedData = Array.isArray(data) ? data.map((item: any, index: number) => ({
        ...item,
        id: item.id || `item-${index}`,
      })) : [];

      setProjectScoreDetailData(formattedData);
    } catch (error: any) {
      console.error('获取项目得分详情失败:', error);
      message.error(error?.message || '获取项目得分详情失败');
      setProjectScoreDetailData([]);
    } finally {
      setProjectScoreDetailLoading(false);
    }
  };

  // 打开项目得分详情 Modal
  const handleOpenProjectScoreDetailModal = async (record: any) => {
    setCurrentProjectRecord(record);
    setProjectScoreDetailModalVisible(true);
    await fetchProjectScoreDetailData(record);
  };

  // 关闭项目得分详情 Modal
  const handleCloseProjectScoreDetailModal = () => {
    setProjectScoreDetailModalVisible(false);
    setProjectScoreDetailData([]);
    setCurrentProjectRecord(null);
  };

  /** 列表与导出 exportSGDZ.xlsx 共用筛选条件（不含分页） */
  const buildFilterParams = (values?: FieldType): ExportProjectSGDZRequest => {
    const formValues = values ?? form1.getFieldsValue();
    let departmentLabel = formValues.department;
    if (departmentLabel && depart && depart.length > 0) {
      const foundOption = depart.find((item) => item.value === departmentLabel);
      if (foundOption) {
        departmentLabel = foundOption.label;
      }
    }
    return {
      isSDZProject: true,
      projectName: formValues.taskName || undefined,
      projectCode: formValues.projectCode || undefined,
      attractorUnit: departmentLabel || undefined,
      year: formValues.year,
    };
  };

  /** 导出：GET /prime-api/project-digital-investment-attracting/exportSGDZ.xlsx（与当前查询条件一致） */
  const handleExport = async () => {
    try {
      setExporting(true);
      const res = await primeApi.exportProjectSGDZ(buildFilterParams());
      if (!res || !res.path) {
        message.error('导出失败：未获取到文件路径');
        return;
      }
      let fileUrl = String(res.path ?? '');
      if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
        fileUrl = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
      }
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = res.name || '三个大抓项目.xlsx';
      a.target = '_blank';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 100);
      message.success('导出成功');
    } catch (error: any) {
      message.error(error?.message || '导出失败');
    } finally {
      setExporting(false);
    }
  };

  // 查询支撑指标信息列表
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
  };

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    const data: ListProjectDigitalInvestmentAttractingRequest = {
      ...buildFilterParams(values),
      page: pagination.current || 1,
      size: pagination.pageSize || 10,
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
    const data = await systemApi.getDictItems({ catalog: 'project_dept'});
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
      title: '项目内容',
      dataIndex: 'projectContent',
      key: 'projectContent',
      width: 120,
      align: 'center',
      ellipsis: true,
    }, {
      title: '所属板块',
      dataIndex: 'parkName',
      key: 'parkName',
      width: 120,
      align: 'center',
    },{
      title: '项目状态',
      dataIndex: 'currentProjectProgressLabel',
      key: 'currentProjectProgressLabel',
      width: 120,
      align: 'center',
    },{
      title: '招引部门',
      dataIndex: 'sourceDepartmentName',
      key: 'sourceDepartmentName',
      width: 120,
      align: 'center',
    },{
      title: '计分',
      key: 'projectScore',
      width: 120,
      align: 'center',
      render: (_: any, record: any) => {
        const score = record.projectScore ?? 0;
        return (
          <span
            style={{
              color: '#1890FF',
              cursor: 'pointer',
            }}
            onClick={() => {
              handleOpenProjectScoreDetailModal(record);
            }}
          >
            {score}
          </span>
        );
      },
    },
    // {
    //   title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
    //   valueType: 'option',
    //   align: 'center',
    //   width: 120,
    //   fixed: 'right',
    //   render: (text: any, record: any) => [
    //     <div key="operate" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    //       <div
    //         style={{
    //           marginLeft: '10px',
    //           cursor: 'pointer',
    //           display: 'flex',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //           width: '70px',
    //           height: '28px',
    //           background: ' #1890FF',
    //           borderRadius: '14px',
    //           fontSize: '12px',
    //           color: '#fff',
    //         }}
    //         key="down"
    //         onClick={() => {
    //           setIsModalOpen(true);
    //           setIsUpdata(true);
    //           setId(record.id);
    //           getFormFileReport(record.id);
    //         }}
    //       >
    //         <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
    //           编辑
    //         </div>
    //         <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
    //       </div>

    //       <div
    //         style={{
    //           marginLeft: '10px',
    //           cursor: 'pointer',
    //           display: 'flex',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //           width: '70px',
    //           height: '28px',
    //           background: ' red',
    //           borderRadius: '14px',
    //           fontSize: '12px',
    //           color: '#fff',
    //         }}
    //         key="down"
    //         onClick={() => {
    //           console.log('删除', record.id);
    //           deleteFormSupportIndicator(record.id)
    //             .then(() => {
    //               message.success('删除成功');
    //               fetchData({
    //               });
    //             })
    //             .catch((e) => {
    //               message.error(e.message);
    //             });
    //         }}
    //       >
    //         <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
    //           删除
    //         </div>
    //         <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/del.png" alt="" />
    //       </div>
    //     </div>,
    //   ],
    // },
  ];



  useEffect(() => {
    fetchDict();
    getDictItems()
    getDictItems1()
    getDictItems2()
  }, []);

  useEffect(() => {
    fetchData({
      ...buildFilterParams(),
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
        content="欢迎使用三个大抓模块"
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
                  label="项目名称"
                  name="taskName"
                >
                  <Input />
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
                    options={depart}
                    fieldNames={{ label: 'label', value: 'value' }}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>

                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                    width: '25%',
                  }}
                  label="所属年份"
                  name="year"
                >
                  <Select
                    allowClear
                    placeholder="全部"
                    options={[
                      { value: 2023, label: '2023年' },
                      { value: 2024, label: '2024年' },
                      { value: 2025, label: '2025年' },
                      { value: 2026, label: '2026年' },
                    ]}
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
                  <Button
                    type="primary"
                    onClick={() => void handleExport()}
                    loading={exporting}
                  >
                    导出
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

        {/* 项目得分详情 Modal */}
        <Modal
          title="计分台账"
          open={projectScoreDetailModalVisible}
          onCancel={handleCloseProjectScoreDetailModal}
          footer={[
            <Button key="cancel" onClick={handleCloseProjectScoreDetailModal}>
              取消
            </Button>,
            <Button key="confirm" type="primary" onClick={handleCloseProjectScoreDetailModal}>
              确定
            </Button>,
          ]}
          width={1200}
        >
          <Table
            columns={[
              {
                title: '计分事件',
                dataIndex: 'step',
                key: 'step',
                width: 120,
                align: 'center' as const,
                render: (text: string) => {
                  // 根据 step 字段映射为中文
                  const stepMap: Record<string, string> = {
                    'sign': '签约计分',
                    'start': '开工计分',
                    'complete': '竣工计分',
                  };
                  return stepMap[text] || text || '-';
                },
              },
              {
                title: '是否通过',
                dataIndex: 'result',
                key: 'result',
                width: 100,
                align: 'center' as const,
                render: (text: string) => {
                  // 根据 result 字段映射为中文
                  if (text === '1' || text === '通过') {
                    return '通过';
                  } else if (text === '2' || text === '驳回' || text === '未通过') {
                    return '驳回';
                  } else if (text === '3' || text === '不计分') {
                    return '不计分';
                  }
                  return text || '-';
                },
              },
              {
                title: '审批意见',
                dataIndex: 'comment',
                key: 'comment',
                width: 200,
                align: 'left' as const,
                ellipsis: true,
                render: (text: string) => text || '-',
              },
              {
                title: '计入分值',
                dataIndex: 'score',
                key: 'score',
                width: 100,
                align: 'center' as const,
                render: (text: number | string | null | undefined) => {
                  if (text === null || text === undefined) {
                    return '0';
                  }
                  // 如果是数字类型，保留小数位（如果是整数则不显示小数点）
                  const numValue = typeof text === 'number' ? text : parseFloat(String(text));
                  if (isNaN(numValue)) {
                    return '0';
                  }
                  // 如果是整数，显示为整数；如果有小数，保留小数位
                  return numValue % 1 === 0 ? String(numValue) : numValue.toFixed(2);
                },
              },
              {
                title: '计分年度',
                dataIndex: 'year',
                key: 'year',
                width: 100,
                align: 'center' as const,
                render: (text: number | string) => {
                  if (!text) {
                    return currentProjectRecord?.year || dayjs().year() || '-';
                  }
                  return String(text);
                },
              },
            ]}
            dataSource={projectScoreDetailData}
            loading={projectScoreDetailLoading}
            pagination={false}
            bordered
            scroll={{ x: 1000 }}
            rowKey={(record, index) => record.id || String(index)}
          />
        </Modal>

      </PageContainer>
    </div>
  );
};

export default ThreeCatch;
