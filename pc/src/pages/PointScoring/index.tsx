import {
  Button,
  Col,
  Descriptions,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Table, Upload, UploadFile, UploadProps,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { primeApi, systemApi } from '@/services/api';
import {
  CalculateScoreRequest,
  CreateFormFileReportRequest,
  FormFileReportDto,
  FormMonitorIndicatorFieldDto,
  ProjectScoreVo,
  ProjectDigitalInvestmentAttractingVo,
  ListProjectDigitalInvestmentAttractingRequest,
  ProjectDigitalProjectReviewAllDto,
  ProjectDetailRequest,
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
  projectName?: string;
  currentProjectProgress?: string;
  projectContent?: string;
  investmentAmount?: string;
  content?: string;
  amount?: string;
  grantForTaizhengtong?: boolean;
  roles?: string[];
  attractingDepartment?: string;
  park?: string;
  projectType?: string;
  isInnovationProject?: string;
  isQflpProject?: string;
  scoreValue?: number;
  scoringEvent?: string;
  scoringComment?: string;
  year?: number;
  deptType?: number;
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
const PointScoring = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form3] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [queryParams, setQueryParams] = useState<{ department?: string; year?: number; projectName?: string; deptType?: number }>({});
  const [isUpdata] = useState(false);
  const [id] = useState('');
  const [depart, setDepart] = useState<DepartOption[]>()
  const [, setType] = useState<DepartOption[]>()
  const [collectionFrequencyList, setCollectionFrequencyList] = useState<DepartOption[]>()
  const [fileTemplate, setFileTemplate] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [projectOptions, setProjectOptions] = useState<Array<{ value: string; label: string; project: ProjectDigitalInvestmentAttractingVo }>>([])
  const [searchingProject, setSearchingProject] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
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
  const [dataSource, setDataSource] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<ProjectScoreVo | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
    form3.resetFields();
    setProjectOptions([]);
    setSelectedProjectId('');
  };
  const handleDetailCancel = () => {
    setIsDetailModalOpen(false);
    setDetailData(null);
  };


  // 查询计分流水列表
  const fetchData = async (page?: number, size?: number) => {
    const query: CalculateScoreRequest = {
      page: page || pagination.current,
      size: size || pagination.pageSize || 10,
    };
    // 传递查询参数到接口（使用保存的查询条件）
    if (queryParams.department) {
      query.deptName = queryParams.department;
    }
    if (queryParams.year) {
      query.year = queryParams.year;
    }
    if (queryParams.projectName !== undefined && queryParams.projectName !== null && queryParams.projectName !== '') {
      query.projectName = queryParams.projectName.trim();
    }
    if (queryParams.deptType) {
      (query as any).deptType = queryParams.deptType;
    }
    try {
      const data = await primeApi.calculateScore(query);
      setPagination((prev) => ({
        ...prev,
        current: data.page || prev.current,
        total: data.total || 0,
        pageSize: data.size ?? prev.pageSize,
      }));
      setDataSource(data.records || []);
    } catch (error: any) {
      console.error('查询计分流水失败:', error);
      message.error(error?.message || '查询失败');
      setDataSource([]);
    }
  };

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    // 确保 department 传递的是中文（label）而不是 code
    let departmentLabel = values.department;
    // 如果 department 是 code（value），从 depart 数组中查找对应的 label
    if (departmentLabel && depart && depart.length > 0) {
      const foundOption = depart.find(item => item.value === departmentLabel);
      if (foundOption) {
        departmentLabel = foundOption.label;
      }
    }
    // 保存查询条件并重置页码为第一页（项目名称做 trim，避免空格导致查不到）
    const projectNameTrimmed = values.projectName?.trim();
    const newQueryParams = {
      department: departmentLabel,
      year: values.year ? Number(values.year) : undefined,
      deptType: values.deptType ? Number(values.deptType) : undefined,
      projectName: projectNameTrimmed || undefined,
    };
    setQueryParams(newQueryParams);
    setPagination((prev) => ({ ...prev, current: 1 }));
    setDataSource([]); // 换条件查询时先清空列表，避免仍显示上一次结果
    // 注意：这里不直接调用 fetchData，而是通过 useEffect 来触发
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
          updateFormSupportIndicator(id, values as any as FormFileReportDto)
        .then((res) => {
          form.resetFields();
          console.log(res);
          fetchData(pagination.current, pagination.pageSize);
          message.success('修改成功');
          setIsModalOpen(false);
        })
        .catch((err) => {
          console.log(err);
          message.error('修改失败');
          setIsModalOpen(false);
        });
    } else {
      createFormFileReport({ formFileReportDto: values as any as FormFileReportDto })
        .then((res) => {
          form.resetFields();
          console.log(res);
          fetchData(pagination.current, pagination.pageSize);
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

  // 搜索项目名称
  const searchProjectName = async (searchValue: string) => {
    if (!searchValue || searchValue.trim() === '') {
      setProjectOptions([]);
      return;
    }
    setSearchingProject(true);
    try {
      const params: ListProjectDigitalInvestmentAttractingRequest = {
        projectName: searchValue,
        page: 1,
        size: 20,
      };
      const data = await primeApi.listProjectDigitalInvestmentAttracting(params);
      const options = (data.records || []).map((project: ProjectDigitalInvestmentAttractingVo) => ({
        value: project.projectName || '',
        label: `${project.projectName || ''}${project.projectCode ? ` (${project.projectCode})` : ''}`,
        project: project,
      }));
      setProjectOptions(options);
    } catch (error: any) {
      console.error('搜索项目名称失败:', error);
      message.error(error?.message || '搜索失败');
      setProjectOptions([]);
    } finally {
      setSearchingProject(false);
    }
  };

  // 选择项目后自动填充表单
  const handleProjectSelect = (value: string) => {
    const selectedOption = projectOptions.find(opt => opt.value === value);
    if (selectedOption && selectedOption.project) {
      const project = selectedOption.project;
      setSelectedProjectId(project.id || '');
      form3.setFieldsValue({
        projectCode: project.projectCode,
        projectName: project.projectName,
        attractingDepartment: project.sourceDepartmentName || '',
        park: project.parkName || project.park || '',
        projectType: project.projectType || '',
        isInnovationProject: project.isKcProj || '',
        isQflpProject: project.isQflp || '',
      });
    }
  };

  const onFinish3: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('新增记分 Success:', values);
    if (!selectedProjectId) {
      message.error('请先选择项目');
      return;
    }
    try {
      const submitData: ProjectDigitalProjectReviewAllDto = {
        digitalInvestmentId: selectedProjectId,
        score: values.scoreValue,
        comment: values.scoringComment,
        step: 'ADDITIONAL_SCORE', // 根据业务需求设置步骤
      };
      await primeApi.createProjectDigitalService1({
        projectDigitalProjectReviewAllDto: submitData,
      });
      message.success('提交成功');
      setIsModalOpen2(false);
      form3.resetFields();
      setProjectOptions([]);
      setSelectedProjectId('');
      fetchData(pagination.current, pagination.pageSize);
    } catch (error: any) {
      console.error('提交失败:', error);
      message.error(error?.message || '提交失败');
    }
  };

  const onFinishFailed3: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // 查询项目详情
  const fetchDetailData = async (record: ProjectScoreVo) => {
    if (!record.projectId || !record.step) {
      message.error('项目ID或计分事件不能为空');
      return;
    }
    setDetailLoading(true);
    try {
      const params: ProjectDetailRequest = {
        projectId: record.projectId,
        step: record.step,
      };
      const data = await primeApi.projectDetail(params);
      setDetailData(data);
    } catch (error: any) {
      console.error('查询项目详情失败:', error);
      message.error(error?.message || '查询失败');
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // 处理查看按钮点击
  const handleViewClick = (record: ProjectScoreVo) => {
    setIsDetailModalOpen(true);
    fetchDetailData(record);
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'center' as const,
      width: 160,
    },
    {
      title: '招引部门',
      dataIndex: 'attractDept',
      key: 'attractDept',
      align: 'center' as const,
      width: 140,
    },
    {
      title: '部门类别',
      dataIndex: 'deptType',
      key: 'deptType',
      align: 'center' as const,
      width: 120,
    },
    {
      title: '所属板块',
      dataIndex: 'park',
      key: 'park',
      align: 'center' as const,
      width: 120,
    },
    {
      title: '项目类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center' as const,
      width: 120,
    },
    {
      title: '计分事件',
      dataIndex: 'step',
      key: 'step',
      align: 'center' as const,
      width: 120,
    },
    {
      title: '分值',
      dataIndex: 'score',
      key: 'score',
      align: 'center' as const,
      width: 100,
    },
    {
      title: '计分状态',
      dataIndex: 'result',
      key: 'result',
      align: 'center' as const,
      width: 120,
      render: (text: ProjectScoreVo['result']) => text || '-',
    },
    {
      title: '所属年度',
      dataIndex: 'year',
      key: 'year',
      align: 'center' as const,
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center' as const,
      width: 120,
      render: (_: any, record: ProjectScoreVo) => (
        <Button type="link" size="small" onClick={() => handleViewClick(record)}>
          查看
        </Button>
      ),
    },
  ];



  useEffect(() => {
    fetchDict();
    getDictItems()
    getDictItems1()
    getDictItems2()
  }, []);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, queryParams]);

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
        content="欢迎使用计分流水总览模块"
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
                    <Input  />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType>
                    label="招引部门"
                    name="department"
                  >
                    <Select
                      options={depart}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType>
                    label="部门类别"
                    name="deptType"
                  >
                    <Select
                      options={[
                        {
                          value: 1,
                          label: '一类',
                        },
                        {
                          value: 2,
                          label: '二类',
                        },
                        {
                          value: 3,
                          label: '三类',
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType>
                    label="年度"
                    name="year"
                  >
                    <Select options={[
                      {
                        value: 2025,
                        label: '2025',
                      },
                    ]} />
                  </Form.Item>
                </Col>

              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                      <Button
                        type="primary"
                        onClick={() => {
                          setIsModalOpen2(true);
                        }}
                      >
                        新增计分
                      </Button>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button
                        htmlType="button"
                        onClick={() => {
                          form1.resetFields();
                          setQueryParams({});
                          setPagination((prev) => ({ ...prev, current: 1 }));
                          setDataSource([]); // 重置时清空列表，与查询行为一致，避免再查询异常
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
            columns={columns}
            rowKey={(record: ProjectScoreVo) => record.projectId || record.projectName || ''}
            scroll={{ x: 1200 }}
            bordered={true}
            dataSource={dataSource}
            pagination={false}
          />
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            onChange={(page, pageSize) => {
              setPagination((prev) => ({ ...prev, current: page, pageSize: pageSize }));
            }}
            style={{ marginTop: '16px' }}
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

        <Modal title="新增计分" open={isModalOpen2} footer={false} onCancel={handleCancel2} width={800}>
          <Form
            form={form3}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 850, marginTop: '20px' }}
            initialValues={{ remember: true }}
            onFinish={onFinish3}
            onFinishFailed={onFinishFailed3}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<FieldType>
                  label="项目名称"
                  name="projectName"
                  rules={[{ required: true, message: '请选择项目名称' }]}
                >
                  <Select
                    placeholder="请输入项目名称进行搜索"
                    showSearch
                    filterOption={false}
                    onSearch={searchProjectName}
                    onSelect={handleProjectSelect}
                    loading={searchingProject}
                    options={projectOptions}
                    notFoundContent={searchingProject ? '搜索中...' : '请输入项目名称进行搜索'}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<FieldType>
                  label="项目代码"
                  name="projectCode"
                >
                  <Input disabled placeholder="自动填充,不可输入" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<FieldType>
                  label="招引部门"
                  name="attractingDepartment"
                >
                  <Input disabled placeholder="自动填充,不可输入" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<FieldType>
                  label="园区(镇街)"
                  name="park"
                >
                  <Input disabled placeholder="自动填充,不可输入" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<FieldType>
                  label="项目类型"
                  name="projectType"
                >
                  <Input disabled placeholder="自动填充,不可输入" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<FieldType>
                  label="是否科创项目"
                  name="isInnovationProject"
                >
                  <Input disabled placeholder="自动填充,不可输入" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="是否QFLP外资项目"
                  name="isQflpProject"
                >
                  <Input disabled placeholder="自动填充,不可输入" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="分值"
                  name="scoreValue"
                  rules={[{ required: true, message: '请输入分值' }]}
                >
                  <Input type="number" placeholder="数值输入" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="计分意见"
                  name="scoringComment"
                >
                  <Input.TextArea
                    placeholder="文本输入"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label={null}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >
                <Button onClick={handleCancel2}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="项目详情"
          open={isDetailModalOpen}
          onCancel={handleDetailCancel}
          footer={null}
          width={800}
        >
          {detailLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>
          ) : detailData ? (
            <Descriptions bordered column={2} style={{ marginTop: '20px' }}>
              <Descriptions.Item label="项目名称" span={1}>
                {detailData.projectName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="项目ID" span={1}>
                {detailData.projectId || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="招引部门" span={1}>
                {detailData.attractDept || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="部门类别" span={1}>
                {detailData.deptType || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="所属板块" span={1}>
                {detailData.park || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="项目类型" span={1}>
                {detailData.type || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="是否科创项目" span={1}>
                {detailData.isKc || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="年份" span={1}>
                {detailData.year || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="记分事件" span={1}>
                {detailData.step || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="得分" span={1}>
                {detailData.score !== undefined && detailData.score !== null ? detailData.score : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="计分状态" span={1}>
                {detailData.result || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="完成状态" span={1}>
                {detailData.status || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="审核委办局" span={1}>
                {detailData.cobName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="审核人部门名称" span={1}>
                {detailData.deptName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="审核人名称" span={1}>
                {detailData.name || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="审核评价" span={2}>
                {detailData.comment || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>
                {detailData.createTime ? dayjs(detailData.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>暂无数据</div>
          )}
        </Modal>

      </PageContainer>
    </div>
  );
};

export default PointScoring;
