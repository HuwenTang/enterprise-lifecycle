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
import { useNavigate } from '@umijs/max';
import {
  CreateFormFileReportRequest,
  FormFileReportDto,
  FormMonitorIndicatorFieldDto,
  ListProjectDeptScoreRequest,
  ListProjectDeptScoreDetailRequest,
} from '@/services/apis';
import { UploadOutlined } from '@ant-design/icons';

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
  year?: string;
  deptClass?: string;
};
type DepartOption = {
  value?:string
  label?:string
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const TotalPoint = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isUpdata] = useState(false);
  const [id] = useState('');
  const [depart, setDepart] = useState<DepartOption[]>()
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
        const res = file.response;
        const first = Array.isArray(res) ? res[0] : res;
        if (first?.path) setFileTemplate(first.path);
      }
    },
  };
  const handleTableChange = (pagination: any) => {
    setPagination(pagination); // 更新 pagination 状态，触发数据重新获取
  };

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [exporting, setExporting] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // 计分台账 Modal 相关状态
  const [isScoreDetailModalOpen, setIsScoreDetailModalOpen] = useState(false);
  const [scoreDetailData, setScoreDetailData] = useState<any[]>([]);
  const [scoreDetailLoading, setScoreDetailLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [scoreDetailPagination, setScoreDetailPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 导出报表
  const handleExport = async () => {
    try {
      setExporting(true);

      // 获取查询模块的值
      const formValues = form1.getFieldsValue();
      // 确保 department 传递的是中文（label）而不是 code
      let departmentLabel = formValues.department;
      if (departmentLabel && depart && depart.length > 0) {
        const foundOption = depart.find(item => item.value === departmentLabel);
        if (foundOption) {
          departmentLabel = foundOption.label;
        }
      }
      // 如果没有设置年度，默认使用2025年
      const year = formValues.year ? Number(formValues.year) : 2025;

      // 构建请求参数
      const requestParams: { dept?: string; year?: number } = {};
      if (departmentLabel) {
        requestParams.dept = departmentLabel;
      }
      if (year) {
        requestParams.year = year;
      }

      const res = await primeApi.exportProjectDeptScore(requestParams);
      console.log('导出返回:', res);

      if (!res || !res.path) {
        message.error('导出失败：未获取到文件路径');
        return;
      }

      // 处理文件路径
      let fileUrl = res.path;
      // 如果 path 不是完整 URL，尝试拼接
      if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
        fileUrl = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
      }
      console.log('fileUrl:', fileUrl);

      // 使用 a 标签下载
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = res.name || '导出文件.xlsx';
      a.target = '_blank';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      // 延迟移除，确保下载开始
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);

      message.success('导出成功');
    } catch (error: any) {
      console.error('导出失败:', error);
      message.error(error?.message || '导出失败');
    } finally {
      setExporting(false);
    }
  };


  // 查询支撑指标信息列表
  const fetchData = async (params: ListProjectDeptScoreRequest = {}) => {
    const { page, size, ...rest } = params || {};
    // page 不得为 0，最少为 1
    const query: ListProjectDeptScoreRequest = {
      page: (page && page > 0 ? page : pagination.current) || 1,
      size: size || pagination.pageSize || 10,
      ...rest,
    };
    console.log(query);
    const data = await primeApi.listProjectDeptScore(query);
    console.log(data);
    setPagination((prev) => ({
      ...prev,
      total: data.total ?? prev.total,
      current: data.page ?? prev.current,
      pageSize: data.size ?? prev.pageSize,
    }));
    console.log('data', data.records);
    setDataSource(data.records);
  };

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
    setPagination((prev) => ({ ...prev, current: 1 }));
    const data: any = {
      dept: departmentLabel,
      year: values.year ? Number(values.year) : undefined, // 未选年度时不传，重置后查询不传年份
      deptClass: values.deptClass,
      page: 1,
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

  //创建支撑指标信息
  const createFormFileReport = async (values: CreateFormFileReportRequest) => {
    const data = await primeApi.createFormFileReport(values);
    console.log('createFormFileReport', data);
  };

  //修改支撑指标信息
  const updateFormSupportIndicator = async (id: string, values: FormFileReportDto) => {
    const data = await primeApi.updateFormFileReport({
      id: id,
      formFileReportDto: values,
    });
    console.log('updateFormSupportIndicator', data);
  };

  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    const dto: FormFileReportDto = {
      indicatorName: values.indicatorName || '',
      collectionFrequency: values.collectionFrequency || '',
      department: values.department || '',
      description: values.description,
      fileTemplate: values.fileTemplate || fileTemplate,
    };
    // if(fileTemplate===''){
    //   message.error('请上传文件模板');
    //   return
    // }
    if(isUploading){
      message.info('正在上传中');
       return
    }
    if (isUpdata) {
      updateFormSupportIndicator(id, dto)
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
      createFormFileReport({ formFileReportDto: dto })
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // 获取计分台账数据（需在 handleOpenScoreDetailModal 之前定义）
  const fetchScoreDetailData = async (record: any, page?: number, size?: number) => {
    try {
      setScoreDetailLoading(true);
      const params: ListProjectDeptScoreDetailRequest = {
        dept: record.deptName,
        year: record.year ? Number(record.year) : undefined,
        page: page || scoreDetailPagination.current,
        size: size || scoreDetailPagination.pageSize,
      };
      const data = await primeApi.listProjectDeptScoreDetail(params);
      console.log('计分台账数据:', data);
      // PageableResultProjectDigitalProjectReviewAllVo 使用 records 字段
      if (data && data.records) {
        setScoreDetailData(data.records);
        setScoreDetailPagination((prev) => ({
          ...prev,
          current: data.page || prev.current,
          total: data.total || 0,
          pageSize: data.size ?? prev.pageSize,
        }));
      } else if (Array.isArray(data)) {
        setScoreDetailData(data);
        setScoreDetailPagination((prev) => ({
          ...prev,
          total: data.length,
        }));
      } else {
        setScoreDetailData([]);
        setScoreDetailPagination((prev) => ({
          ...prev,
          total: 0,
        }));
      }
    } catch (error: any) {
      console.error('获取计分台账失败:', error);
      message.error(error?.message || '获取计分台账失败');
      setScoreDetailData([]);
      setScoreDetailPagination((prev) => ({
        ...prev,
        total: 0,
      }));
    } finally {
      setScoreDetailLoading(false);
    }
  };

  // 打开计分台账 Modal
  const handleOpenScoreDetailModal = async (record: any) => {
    setCurrentRecord(record);
    setIsScoreDetailModalOpen(true);
    setScoreDetailPagination({ current: 1, pageSize: 10, total: 0 });
    await fetchScoreDetailData(record, 1, 10);
  };

  // 关闭计分台账 Modal
  const handleCloseScoreDetailModal = () => {
    setIsScoreDetailModalOpen(false);
    setScoreDetailData([]);
    setCurrentRecord(null);
    setScoreDetailPagination({ current: 1, pageSize: 10, total: 0 });
  };

  const columns = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 120,
      align: 'center' as const,
    }, {
      title: '部门分类',
      dataIndex: 'deptClass',
      key: 'deptClass',
      width: 120,
      align: 'center' as const,
    }, {
      title: '年度',
      dataIndex: 'year',
      key: 'year',
      width: 120,
      align: 'center' as const,
    },{
      title: '计分',
      dataIndex: 'score',
      key: 'score',
      width: 120,
      align: 'center' as const,
    }, {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={() => handleOpenScoreDetailModal(record)}
          style={{
            color: '#1890FF',
            padding: 0,
          }}
        >
          查看
        </Button>
      ),
    }
  ];

  useEffect(() => {
    fetchDict();
    getDictItems()
    getDictItems1()

    // 设置默认年度为2025年
    form1.setFieldsValue({ year: '2025' });
  }, []);

  useEffect(() => {
    const formValues = form1.getFieldsValue();
    // 确保 department 传递的是中文（label）而不是 code
    let departmentLabel = formValues.department;
    if (departmentLabel && depart && depart.length > 0) {
      const foundOption = depart.find(item => item.value === departmentLabel);
      if (foundOption) {
        departmentLabel = foundOption.label;
      }
    }
    // 未选年度时不传 year，重置后查询不传年份
    const year = formValues.year ? Number(formValues.year) : undefined;
    fetchData({
      dept: departmentLabel,
      year,
      deptClass: formValues.deptClass,
      page: pagination.current,
      size: pagination.pageSize,
    } as any);
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
        content="欢迎使用部门计分总览模块"
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
                  label="招引部门"
                  name="department"
                >
                  <Select
                    options={depart}
                    showSearch
                    allowClear
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
                  label="部门分类"
                  name="deptClass"
                >
                  <Select
                    options={[
                      {
                        value: '一类',
                        label: '一类',
                      },
                      {
                        value: '二类',
                        label: '二类',
                      },
                      {
                        value: '三类',
                        label: '三类',
                      },
                    ]}
                    allowClear
                    placeholder="请选择部门分类"
                  />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                    width: '25%',
                  }}
                  label="年度"
                  name="year"
                >
                  <Select options={[
                    {
                      value: '2025',
                      label: '2025',
                    }
                  ]} />
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
                    onClick={handleExport}
                    loading={exporting}
                  >
                    导出报表
                  </Button>
                  <Button style={{ marginLeft: '20px' }} type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    style={{ marginLeft: '20px' }}
                    htmlType="button"
                    onClick={() => {
                      form1.resetFields();
                      setPagination((prev) => ({ ...prev, current: 1 }));
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

        {/* 计分台账 Modal */}
        <Modal
          title="计分台账"
          open={isScoreDetailModalOpen}
          onCancel={handleCloseScoreDetailModal}
          footer={[
            <Button key="cancel" onClick={handleCloseScoreDetailModal}>
              取消
            </Button>,
            <Button key="confirm" type="primary" onClick={handleCloseScoreDetailModal}>
              确定
            </Button>,
          ]}
          width={1200}
        >
          <Table
            columns={[
              {
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName',
                width: 200,
                align: 'left' as const,
                ellipsis: true,
              },
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
                    return '-';
                  }
                  return String(text);
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
                    return currentRecord?.year || '-';
                  }
                  return String(text);
                },
              },
              {
                title: '操作',
                key: 'action',
                width: 100,
                align: 'center' as const,
                render: (_: any, record: any) => (
                  <Button
                    type="link"
                    style={{
                      color: '#1890FF',
                      padding: 0,
                    }}
                    onClick={() => {
                      if (record.id) {
                        navigate(`/xmgl/xmjd?id=${record.id}`);
                      } else {
                        message.warning('项目ID不存在');
                      }
                    }}
                  >
                    查看
                  </Button>
                ),
              },
            ]}
            dataSource={scoreDetailData}
            loading={scoreDetailLoading}
            pagination={{
              current: scoreDetailPagination.current,
              pageSize: scoreDetailPagination.pageSize,
              total: scoreDetailPagination.total,
              showTotal: (total) => `共 ${total} 条`,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: (page, pageSize) => {
                setScoreDetailPagination((prev) => ({ ...prev, current: page, pageSize: pageSize }));
                if (currentRecord) {
                  fetchScoreDetailData(currentRecord, page, pageSize);
                }
              },
            }}
            bordered
            scroll={{ x: 1000 }}
            rowKey={(record, index) => record.id || String(index)}
          />
        </Modal>

      </PageContainer>
    </div>
  );
};

export default TotalPoint;
