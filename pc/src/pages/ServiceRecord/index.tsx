/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Button,
  Col,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { primeApi, systemApi } from '@/services/api';
import { useModel, useSearchParams } from '@umijs/max';
import { ListProjectDigitalServiceRequest } from '@/services/apis';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';

type FieldType = {
  projectName?: string;
  parkName?: string;
  attractingDepartment?: string;
};

type ParticipantItem = {
  participant?: string;
  department?: string;
};

type ServiceRecordFieldType = {
  projectId?: string;
  projectName?: string;
  department?: string;
  district?: string;
  parkName?: string;
  approvalItems?: string;
  participants?: ParticipantItem[];
  visitingObject?: string;
  coordinationProcess?: string;
  achievedResults?: string;
  files?: UploadFile[];
};

const ServiceRecord = () => {
  const [form] = Form.useForm();
  const [serviceRecordForm] = Form.useForm();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || searchParams.get('projectld') || searchParams.get('id');
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [depart, setDepart] = useState<{ value: string; label: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const uploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    fileList: fileList,
    onChange({ file, fileList: newFileList }) {
      setIsUploading(true);
      setFileList(newFileList);
      if (file.status !== 'uploading') {
        console.log('文件上传:', file, newFileList);
        setIsUploading(false);
      }
      if (file.status === 'done') {
        message.success(`${file.name} 上传成功`);
        setIsUploading(false);
      } else if (file.status === 'error') {
        message.error(`${file.name} 上传失败`);
        setIsUploading(false);
      }
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  // 查询服务记录列表
  const fetchData = async (params: ListProjectDigitalServiceRequest = {}) => {
    if (!projectId) {
      console.warn('缺少 projectId 参数');
      return;
    }
    const { page, size, ...rest } = params || {};
    const query: ListProjectDigitalServiceRequest = {
      investmentId: projectId,
      page: (page && page > 0 ? page : pagination.current) || 1,
      size: size || pagination.pageSize || 10,
      ...rest,
    };
    console.log('查询服务记录:', query);
    try {
      const data = await primeApi.listProjectDigitalService(query);
      console.log('服务记录数据:', data);
      setPagination({
        ...pagination,
        total: data.total,
        current: data.page,
        pageSize: data.size,
      });
      setDataSource(data.records || []);
    } catch (error) {
      console.error('获取服务记录失败:', error);
      message.error('获取服务记录失败');
      setDataSource([]);
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
      title: <TitleCom text={'项目名称'} icon={'/mg/icon6.png'} />,
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'left' as const,
      ellipsis: true,
      width: 200,
    },
    {
      title: <TitleCom text={'所属部门'} icon={'/mg/icon2.png'} />,
      dataIndex: 'department',
      key: 'department',
      align: 'left' as const,
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text={'区县'} icon={'/mg/icon2.png'} />,
      dataIndex: 'district',
      key: 'district',
      align: 'left' as const,
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text={'承载园区'} icon={'/mg/icon2.png'} />,
      dataIndex: 'carrierArea',
      key: 'carrierArea',
      align: 'left' as const,
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text={'审批事项'} icon={'/mg/icon2.png'} />,
      dataIndex: 'approvalItem',
      key: 'approvalItem',
      align: 'left' as const,
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text={'参与人员'} icon={'/mg/icon2.png'} />,
      dataIndex: 'participants',
      key: 'participants',
      align: 'left' as const,
      ellipsis: true,
      width: 120,
      render: (text: any) => {
        if (!text) return '-';
        try {
          // 尝试解析 JSON 字符串
          const parsed = typeof text === 'string' ? JSON.parse(text) : text;
          if (Array.isArray(parsed)) {
            return parsed.map((item: any) => {
              if (item.name && item.dept) {
                return `${item.name}-${item.dept}`;
              } else if (item.name) {
                return item.name;
              } else if (item.participant && item.department) {
                return `${item.participant}-${item.department}`;
              } else if (item.participant) {
                return item.participant;
              }
              return '';
            }).filter(Boolean).join('; ');
          }
          return text;
        } catch (e) {
          // 如果不是 JSON，直接显示字符串
          return text;
        }
      },
    },
    {
      title: <TitleCom text={'拜访对象'} icon={'/mg/icon2.png'} />,
      dataIndex: 'visitTarget',
      key: 'visitTarget',
      align: 'left' as const,
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text={'协调过程'} icon={'/mg/icon7.png'} />,
      dataIndex: 'coordinationProcess',
      key: 'coordinationProcess',
      align: 'left' as const,
      ellipsis: true,
      width: 300,
      render: (text: any) => (
        <span style={{ textAlign: 'left' }} title={text}>
          {text}
        </span>
      ),
    },
    {
      title: <TitleCom text={'取得成果'} icon={'/mg/icon2.png'} />,
      dataIndex: 'achievements',
      key: 'achievements',
      align: 'left' as const,
      ellipsis: true,
      width: 300,
      render: (text: any) => (
        <span style={{ textAlign: 'left' }} title={text}>
          {text}
        </span>
      ),
    },
    {
      title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      valueType: 'option',
      align: 'center' as const,
      width: 120,
      fixed: 'right' as const,
      render: (text: any, record: any) => {
        return (
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
              margin: '0 auto',
            }}
            onClick={() => {
              handleOpenModal(record);
            }}
          >
            活动详情
          </div>
        );
      },
    },
  ];

  // 查询部门列表
  const getDictItems = async () => {
    try {
      const data = await systemApi.getDictItems({ catalog: 'collection_dept' });
      const dataList = data.map((item: any) => ({
        label: item.label,
        value: item.code,
      }));
      setDepart(dataList);
    } catch (error) {
      console.error('获取部门列表失败:', error);
    }
  };

  // 获取项目详情
  const fetchProjectDetail = async (projectId: string) => {
    try {
      const data = await primeApi.getProjectDigitalInvestmentAttracting({ id: projectId });
      setSelectedProject(data);
      return data;
    } catch (error) {
      console.error('获取项目详情失败:', error);
      message.error('获取项目详情失败');
      return null;
    }
  };

  // 获取所属部门（从 session 中获取）
  const getDepartmentFromSession = async (): Promise<string> => {
    try {
      const session = await systemApi.getSession();
      if (session?.organizations && session.organizations.length > 0) {
        // 提取所有 organizations 中的 name，用逗号拼接
        const names = session.organizations
          .map((org: any) => org.name)
          .filter((name: string) => name) // 过滤掉空值
          .join(',');
        return names || '';
      }
      return '';
    } catch (error) {
      console.error('获取 session 信息失败:', error);
      return '';
    }
  };

  useEffect(() => {
    getDictItems();
    fetchProjectDetail(projectId as string);
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchData({
        page: pagination.current,
        size: pagination.pageSize,
      });
    }
  }, [pagination.current, pagination.pageSize, projectId]);

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    // 重新获取数据（如果需要根据查询条件筛选，可以在这里添加参数）
    if (projectId) {
      fetchData({
        page: 1,
        size: pagination.pageSize,
      });
      setPagination({ ...pagination, current: 1 });
    }
  };

  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    serviceRecordForm.resetFields();
    setSelectedProject(null);
    setFileList([]);
  };

  // 打开录入服务记录 Modal
  const handleOpenModal = async (record?: any) => {
    if (record) {
      // 回显数据
      setSelectedProject(record);

      // 处理参与人员数据 - 将字符串解析为数组
      let participantsArray: ParticipantItem[] = [];
      if (record.participants) {
        try {
          // 尝试解析 JSON 字符串
          const parsed = typeof record.participants === 'string' ? JSON.parse(record.participants) : record.participants;
          if (Array.isArray(parsed)) {
            participantsArray = parsed.map((item: any) => ({
              participant: item.name || item.participant || '',
              department: item.dept || item.department || '',
            }));
          } else {
            // 如果不是数组，尝试按字符串格式解析
            let items: string[] = [];
            if (typeof record.participants === 'string') {
              if (record.participants.includes(';')) {
                items = record.participants.split(';').filter((item: string) => item.trim());
              } else if (record.participants.includes('/')) {
                items = record.participants.split('/').map((item: string) => item.trim());
              } else {
                items = [record.participants.trim()];
              }
            }

            participantsArray = items.map((item: string) => {
              if (item.includes('-')) {
                const parts = item.split('-');
                return {
                  participant: parts[0].trim(),
                  department: parts.slice(1).join('-').trim(),
                };
              } else {
                return {
                  participant: item.trim(),
                  department: '',
                };
              }
            });
          }
        } catch (e) {
          // 解析失败，按字符串处理
          let items: string[] = [];
          if (typeof record.participants === 'string') {
            if (record.participants.includes(';')) {
              items = record.participants.split(';').filter((item: string) => item.trim());
            } else if (record.participants.includes('/')) {
              items = record.participants.split('/').map((item: string) => item.trim());
            } else {
              items = [record.participants.trim()];
            }
          }
          participantsArray = items.map((item: string) => {
            if (item.includes('-')) {
              const parts = item.split('-');
              return {
                participant: parts[0].trim(),
                department: parts.slice(1).join('-').trim(),
              };
            } else {
              return {
                participant: item.trim(),
                department: '',
              };
            }
          });
        }
      }
      // 如果数组为空，至少添加一行空数据
      if (participantsArray.length === 0) {
        participantsArray = [{ participant: '', department: '' }];
      }

      serviceRecordForm.setFieldsValue({
        projectName: record.projectName,
        department: record.department,
        district: record.districtName || record.district,
        parkName: record.parkName || record.carrierArea,
        approvalItems: record.approvalItem,
        participants: participantsArray,
        visitingObject: record.visitTarget,
        coordinationProcess: record.coordinationProcess,
        achievedResults: record.achievements,
      });
      setIsModalOpen(true);
    } else {
      // 新建模式 - 从项目详情接口获取数据并回显
      setIsModalOpen(true);
      // 获取部门信息
      const department = await getDepartmentFromSession();

      if (projectId) {
        try {
          const projectDetail = await fetchProjectDetail(projectId);
          if (projectDetail) {
            // 将项目详情数据回显到表单
            serviceRecordForm.setFieldsValue({
              projectName: projectDetail.projectName || '',
              district: projectDetail.districtName || '',
              parkName: projectDetail.parkName || '',
              department: department || (currentUser as any)?.departmentName || (currentUser as any)?.department || '',
              participants: [{ participant: '', department: '' }], // 初始化一行空数据
            });
          } else {
            // 如果获取失败，至少设置默认值
            serviceRecordForm.setFieldsValue({
              department: department || (currentUser as any)?.departmentName || (currentUser as any)?.department || '',
              participants: [{ participant: '', department: '' }], // 初始化一行空数据
            });
          }
        } catch (error) {
          console.error('获取项目详情失败:', error);
          // 如果获取失败，至少设置默认值
          serviceRecordForm.setFieldsValue({
            department: department || (currentUser as any)?.departmentName || (currentUser as any)?.department || '',
            participants: [{ participant: '', department: '' }], // 初始化一行空数据
          });
        }
      } else {
        // 没有 projectId，只设置默认值
        setSelectedProject(null);
        serviceRecordForm.setFieldsValue({
          department: department || (currentUser as any)?.departmentName || (currentUser as any)?.department || '',
          participants: [{ participant: '', department: '' }], // 初始化一行空数据
        });
      }
    }
  };

  const onServiceRecordFinish: FormProps<ServiceRecordFieldType>['onFinish'] = async (values) => {
    try {
      if (isUploading) {
        message.info('文件正在上传中，请稍候');
        return;
      }

      // 处理文件上传 - 提取已上传成功的文件路径
      let fileUrls: string[] = [];
      if (fileList && fileList.length > 0) {
        const uploadedFiles = fileList.filter(file => file.status === 'done');
        fileUrls = uploadedFiles.map(file => {
          if (file.response) {
            // 新上传的文件，从 response 中获取
            const response = Array.isArray(file.response) ? file.response[0] : file.response;
            return response?.path || response?.url || file.url || '';
          } else if (file.url) {
            // 已存在的文件
            return file.url;
          }
          return '';
        }).filter(url => url);
      }

      // 处理参与人员数据 - 将数组转换为 JSON 格式字符串
      let participantsStr = '';
      if (values.participants && Array.isArray(values.participants) && values.participants.length > 0) {
        const participantsArray = values.participants
          .map(item => {
            const participant = item.participant || '';
            const department = item.department || '';
            if (participant) {
              return {
                name: participant,
                dept: department || '',
              };
            }
            return null;
          })
          .filter(item => item !== null);

        if (participantsArray.length > 0) {
          participantsStr = JSON.stringify(participantsArray);
        }
      }

      // 处理附件路径 - 多个路径用分号分隔
      const attachmentUrl = fileUrls.length > 0 ? fileUrls.join(';') : undefined;

      // 准备服务记录数据
      const serviceRecordData = {
        digitalInvestmentId: projectId || '',
        projectName: values.projectName || '',
        department: values.department || '',
        district: values.district || '',
        carrierArea: values.parkName || '',
        approvalItem: values.approvalItems || '',
        participants: participantsStr || undefined,
        visitTarget: values.visitingObject || '',
        coordinationProcess: values.coordinationProcess || '',
        achievements: values.achievedResults || '',
        attachmentUrl: attachmentUrl,
      };

      // 判断是编辑还是新建模式
      const isEditMode = selectedProject?.id;

      if (isEditMode) {
        // 编辑模式 - 调用更新接口
        await primeApi.updateProjectDigitalService({
          id: selectedProject.id,
          projectDigitalServiceDto: serviceRecordData,
        });
        message.success('服务记录更新成功');
      } else {
        // 新建模式 - 调用创建接口
        await primeApi.createProjectDigitalService({
          projectDigitalServiceDto: serviceRecordData,
        });
        message.success('服务记录录入成功');
      }
      setIsModalOpen(false);
      serviceRecordForm.resetFields();
      setSelectedProject(null);
      setFileList([]);

      // 刷新列表数据
      if (projectId) {
        fetchData({
          page: pagination.current,
          size: pagination.pageSize,
        });
      }
    } catch (error) {
      console.error('录入服务记录失败:', error);
      message.error('录入服务记录失败');
    }
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
        content="欢迎使用服务记录模块"
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
                  name="projectName"
                >
                  <Input placeholder="请输入项目名称" />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                    width: '25%',
                  }}
                  label="所属板块"
                  name="parkName"
                >
                  <Input placeholder="请输入项目代码" />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px'
                  }}
                  label="招引部门"
                  name="attractingDepartment"
                >
                  <Select
                    placeholder="请选择招引部门"
                    options={depart}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </Row>
              <Row>
                <Form.Item style={{
                  marginLeft: '0',
                }}>
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => {
                        handleOpenModal();
                      }}
                    >
                      录入服务记录
                    </Button>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button
                      htmlType="button"
                      onClick={() => {
                        form.resetFields();
                        if (projectId) {
                          fetchData({
                            page: pagination.current,
                            size: pagination.pageSize,
                          });
                        }
                      }}
                    >
                      重置
                    </Button>
                  </Space>
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
            scroll={{ x: '1000' }}
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

        {/* 录入服务记录 Modal */}
        <Modal
          title="录入服务记录"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          <Form
            form={serviceRecordForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            onFinish={onServiceRecordFinish}
            initialValues={{ remember: true }}
          >
            <Form.Item<ServiceRecordFieldType>
              label="项目名称"
              name="projectName"
            >
              <Input disabled placeholder="自动填充，不可输入" />
            </Form.Item>
            <Form.Item<ServiceRecordFieldType>
              label="所属部门"
              name="department"
            >
              <Input disabled placeholder="自动填充，不可输入" />
            </Form.Item>
            <Row>
              <Col span={12}>
                <Form.Item<ServiceRecordFieldType>
                  label="区县"
                  name="district"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <Input disabled placeholder="自动填充，不可输入" />
                </Form.Item>
              </Col>

            </Row><Row>

              <Col span={12}>
                <Form.Item<ServiceRecordFieldType>
                  label="承载园区"
                  name="parkName"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <Input disabled placeholder="自动填充，不可输入" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item<ServiceRecordFieldType>
              label="审批事项"
              name="approvalItems"
              rules={[{ required: true, message: '请选择审批事项' }]}
            >
              <Select placeholder="请选择审批事项">
                <Select.Option value="土地供给">土地供给</Select.Option>
                <Select.Option value="规划审批">规划审批</Select.Option>
                <Select.Option value="环保评估">环保评估</Select.Option>
                <Select.Option value="能耗管控">能耗管控</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item<ServiceRecordFieldType>
              label="参与人员"
            >
              <Form.List name="participants">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={16} style={{ marginBottom: 8 }}>
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, 'participant']}
                            rules={[{ required: true, message: '请输入参与人员' }]}
                          >
                            <Input placeholder="参与人员" />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, 'department']}
                            rules={[{ required: true, message: '请输入参与部门' }]}
                          >
                            <Input placeholder="参与部门" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          {fields.length > 1 && (
                            <Button
                              type="link"
                              danger
                              icon={<MinusCircleOutlined />}
                              onClick={() => remove(name)}
                            >
                              删除
                            </Button>
                          )}
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                        style={{ marginTop: 8 }}
                      >
                        新增人员
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item<ServiceRecordFieldType>
              label="拜访对象"
              name="visitingObject"
              rules={[{ required: true, message: '请输入拜访对象' }]}
            >
              <Input placeholder="请输入拜访对象" />
            </Form.Item>
            <Form.Item<ServiceRecordFieldType>
              label="协调过程"
              name="coordinationProcess"
              rules={[{ required: true, message: '请输入协调过程' }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="请输入协调过程"
                maxLength={1000}
                showCount
              />
            </Form.Item>
            <Form.Item<ServiceRecordFieldType>
              label="取得成果"
              name="achievedResults"
              rules={[{ required: true, message: '请输入取得成果' }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="请输入取得成果"
                maxLength={1000}
                showCount
              />
            </Form.Item>
            <Form.Item<ServiceRecordFieldType>
              label="附件上传"
              name="files"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} disabled={isUploading}>
                  {isUploading ? '上传中...' : '选择文件'}
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button onClick={handleCancel}>取消</Button>
                <Button type="primary" htmlType="submit" loading={isUploading}>
                  确定
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </PageContainer>
    </div>
  );
};

export default ServiceRecord;
