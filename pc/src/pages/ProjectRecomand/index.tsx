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
  Space,
  Table,
  Tag,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import { primeApi, systemApi } from '@/services/api';
import { useModel } from '@umijs/max';
import { CascadeVoString } from '@/services/apis';
import type { ListProjectDigitalInvestmentAttractingRequest } from '@/services/apis/apis/PrimeApiApi';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { normalizeRecommendImageUrls, recommendImageUrlsToUploadFileList } from './recommendImageUrls';

type FieldType = {
  projectName?: string;
  park?: string;
  dept?: string;
};

type ParticipantItem = {
  participant?: string;
  department?: string;
};

type ActivityFormType = {
  projectName?: { value: string; label: string };
  department?: string;
  district?: string;
  park?: string;
  projectInfo?: string;
  projectStage?: string;
  activityTime?: dayjs.Dayjs;
  participants?: ParticipantItem[];
  visitedObject?: string;
  activityContent?: string;
  achievedResults?: string;
  images?: UploadFile[];
};

const ProjectRecomand = () => {
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [attractorUnitOptions, setAttractorUnitOptions] = useState<Array<{ value: string; label: string }>>([]);

  // 录入招商活动弹窗相关状态
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [activityForm] = Form.useForm<ActivityFormType>();
  const [activityFileList, setActivityFileList] = useState<UploadFile[]>([]);
  const [activityUploading, setActivityUploading] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false); // 是否为查看模式（回显时）
  // 查询模块承载园区：cascade 第三级数据组成的扁平列表
  const [queryParkOptions, setQueryParkOptions] = useState<Array<{ value: string; label: string }>>([]);

  // 录入弹窗：项目名称下拉（模糊搜索 /project-digital-investment-attracting/proj）
  const [projectSelectOptions, setProjectSelectOptions] = useState<Array<{ value: string; label: string; progressLabel?: string }>>([]);
  const [projectSelectLoading, setProjectSelectLoading] = useState(false);
  const projectInfoMapRef = useRef<Record<string, any>>({});
  const selectedProjectRef = useRef<any>(null);
  const projectSearchTimerRef = useRef<number | null>(null);
  /** 录入活动提交时 dept 传 cobId，与表单展示的「所属部门」中文分离 */
  const departmentCobIdRef = useRef<string>('');

  const searchProjects = (keyword: string) => {
    if (projectSearchTimerRef.current) {
      window.clearTimeout(projectSearchTimerRef.current);
    }
    projectSearchTimerRef.current = window.setTimeout(async () => {
      const kw = (keyword || '').trim();
      if (!kw) {
        setProjectSelectOptions([]);
        projectInfoMapRef.current = {};
        return;
      }
      setProjectSelectLoading(true);
      try {
        const list = await primeApi.listProjectDigitalInvestmentAttracting1({ projectName: kw });
        const options =
          (list || []).map((item: any) => ({
            value: item.id || item.projectCode || item.projectName,
            label: item.projectName || item.projectCode || '未命名项目',
            progressLabel: item.currentProjectProgressLabel || undefined,
          })) ?? [];
        setProjectSelectOptions(options);
        const map: Record<string, any> = {};
        (list || []).forEach((item: any) => {
          const k = item.id || item.projectCode || item.projectName;
          if (k) map[k] = item;
        });
        projectInfoMapRef.current = map;
      } catch (e) {
        console.error(e);
        setProjectSelectOptions([]);
        projectInfoMapRef.current = {};
      } finally {
        setProjectSelectLoading(false);
      }
    }, 350);
  };

  // 根据选项 value 取 label，查询时承载园区、招引部门传 label
  const getLabelByValue = (
    value: string | undefined,
    options: Array<{ value: string; label: string }>,
  ) => {
    if (value === undefined || value === null || value === '') return undefined;
    const found = options.find((o) => o.value === value);
    return found?.label ?? value;
  };

  // 获取招引部门选项
  const getAttractorUnitOptions = async () => {
    try {
      const data = await systemApi.getDictItems({ catalog: 'collection_dept' });
      const options = data.map((item: any) => ({
        label: item.label,
        value: item.code,
      }));
      setAttractorUnitOptions(options);
    } catch (e) {
      console.error('获取招引部门列表失败', e);
    }
  };

  // 获取数据：调用 /project-digital-investment-attracting，传 isRecommendedProject=true
  const fetchData = async (params: ListProjectDigitalInvestmentAttractingRequest) => {
    setLoading(true);
    try {
      const data = await primeApi.listProjectDigitalInvestmentAttracting({
        ...params,
        isRecommendedProject: true,
      });
      console.log('API response:', data);

      setPagination({
        current: data.page ?? 1,
        pageSize: data.size ?? 10,
        total: data.total ?? 0,
      });

      const mappedData = (data.records || []).map((item: any) => ({
        id: item.id,
        projectName: item.projectName,
        departmentDistrict: item.districtName || item.district || '',
        park: item.parkName || item.park || '',
        projectInfo: item.projectContent || '',
      }));

      setDataSource(mappedData);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
    fetchData({
      projectName: form.getFieldValue('projectName'),
      attractorUnit: getLabelByValue(form.getFieldValue('dept'), attractorUnitOptions),
      park: form.getFieldValue('park'),
      isRecommendedProject: true,
      page: pagination.current,
      size: pagination.pageSize,
    });
  };

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    setPagination({
      ...pagination,
      current: 1,
    });
    fetchData({
      projectName: values.projectName,
      attractorUnit: getLabelByValue(values.dept, attractorUnitOptions),
      park: values.park,
      isRecommendedProject: true,
      page: 1,
      size: pagination.pageSize,
    });
  };

  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // 获取所属部门展示（中文：优先委办局名称 cobName，否则组织名称 name）及提交用 cobId
  const getDepartmentFromSession = async (): Promise<{ displayName: string; cobId: string }> => {
    try {
      const session = await systemApi.getSession();
      if (session?.organizations && session.organizations.length > 0) {
        const displayName = session.organizations
          .map((org: any) => (org.cobName || org.name || '').trim())
          .filter(Boolean)
          .join(',');
        const cobIds = session.organizations
          .map((org: any) => org.cobId)
          .filter((id: string | undefined): id is string => !!id);
        const cobId = Array.from(new Set(cobIds)).join(',');
        return { displayName, cobId };
      }
      return { displayName: '', cobId: '' };
    } catch (error) {
      console.error('获取 session 信息失败:', error);
      return { displayName: '', cobId: '' };
    }
  };

  // 加载 cascade 接口数据（区县 -> 承载园区）
  const loadActivityCascade = async (): Promise<CascadeVoString[]> => {
    try {
      const res = await systemApi.getAdministrativeDivisionTree();
      const flatParks =
        res[0]?.children?.flatMap((d: CascadeVoString) =>
          (d.children ?? []).map((p: CascadeVoString) => ({
            value: p.value ?? p.label,
            label: p.label,
          })),
        ) ?? [];
      setQueryParkOptions(flatParks);
      return res;
    } catch (e) {
      console.error('获取区县/园区级联失败:', e);
      setQueryParkOptions([]);
      return [];
    }
  };

  const handleOpenActivityModal = async (record?: any) => {
    setActivityModalVisible(true);
    selectedProjectRef.current = null;
    await loadActivityCascade();
    if (record) {
      departmentCobIdRef.current = '';
      setIsViewMode(true);
      let parsedDate = dayjs();
      if (record.activityTime) {
        if (typeof record.activityTime === 'string') {
          const dateStr = record.activityTime;
          const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
          if (match) {
            const year = parseInt(match[1], 10);
            const month = parseInt(match[2], 10) - 1;
            const day = parseInt(match[3], 10);
            parsedDate = dayjs().year(year).month(month).date(day).hour(0).minute(0).second(0);
          } else {
            parsedDate = dayjs(record.activityTime) || dayjs();
          }
        } else {
          parsedDate = dayjs(record.activityTime) || dayjs();
        }
      }
      let participantsArray: ParticipantItem[] = [];
      if (record.participants) {
        const items = record.participants.split(';').filter((item: string) => item.trim());
        participantsArray = items.map((item: string) => {
          const parts = item.split('-');
          if (parts.length >= 2) {
            return {
              participant: parts[0].trim(),
              department: parts.slice(1).join('-').trim(),
            };
          } else {
            return {
              participant: parts[0].trim(),
              department: '',
            };
          }
        });
      }
      if (participantsArray.length === 0) {
        participantsArray = [{ participant: '', department: '' }];
      }
      const districtValue = record.departmentDistrict?.split(' ')[1] || record.district || '';
      const imageUrlsEcho = normalizeRecommendImageUrls(record.image as string | string[] | undefined);
      const imageFileListEcho = recommendImageUrlsToUploadFileList(imageUrlsEcho, 'idx');
      setActivityFileList(imageFileListEcho);
      activityForm.setFieldsValue({
        projectName: record.projectName ? { value: record.projectName, label: record.projectName } : undefined,
        department: record.departmentDistrict?.split(' ')[0] || (currentUser as any)?.departmentName || (currentUser as any)?.department || '',
        district: districtValue,
        park: record.park,
        projectInfo: record.projectInfo,
        projectStage: record.projectStage,
        activityTime: parsedDate,
        participants: participantsArray,
        visitedObject: record.visitedObject,
        activityContent: record.activityContent,
        achievedResults: record.achievedResults,
        images: imageFileListEcho as any,
      });
    } else {
      setIsViewMode(false);
      const { displayName, cobId } = await getDepartmentFromSession();
      departmentCobIdRef.current = cobId;
      setActivityFileList([]);
      activityForm.setFieldsValue({
        department:
          displayName ||
          (currentUser as any)?.departmentName ||
          (currentUser as any)?.department ||
          '',
        activityTime: dayjs(),
        participants: [{ participant: '', department: '' }],
        images: [],
      });
    }
  };

  const handleCloseActivityModal = () => {
    setActivityModalVisible(false);
    activityForm.resetFields();
    setActivityFileList([]);
    setIsViewMode(false);
    departmentCobIdRef.current = '';
  };

  const handleSubmitActivity = async () => {
    try {
      const values = await activityForm.validateFields();
      let imagePayload: string[] | undefined;
      if (activityFileList && activityFileList.length > 0) {
        const uploadedFiles = activityFileList.filter(file => file.status === 'done');
        const imageUrls = uploadedFiles
          .map(file => {
            if (file.response) {
              const response = Array.isArray(file.response) ? file.response[0] : file.response;
              return response?.path || response?.url || file.url || '';
            }
            if (file.url) {
              return file.url;
            }
            return '';
          })
          .filter(Boolean);
        imagePayload = imageUrls.length ? imageUrls : undefined;
      }
      let participantsStr = '';
      if (values.participants && Array.isArray(values.participants) && values.participants.length > 0) {
        participantsStr = values.participants
          .map(item => {
            const participant = item.participant || '';
            const department = item.department || '';
            if (participant && department) {
              return `${participant}-${department}`;
            } else if (participant) {
              return participant;
            }
            return '';
          })
          .filter(item => item)
          .join(';');
      }
      const deptCobId = departmentCobIdRef.current?.trim();
      if (!deptCobId) {
        message.error('未获取到部门所属委办局ID（cobId），请重新登录后重试');
        return;
      }
      // 需要带上招商项目ID（后端字段名可能未体现在 OpenAPI 类型里，这里用 any 透传）
      const dto: any = {
        digitalInvestmentId: values.projectName?.value,
        projName: values.projectName?.label,
        dept: deptCobId,
        district: selectedProjectRef.current?.district || values.district,
        park: selectedProjectRef.current?.park || values.park,
        projInfo: values.projectInfo,
        projStep: values.projectStage,
        activityTime: values.activityTime ? values.activityTime.toDate() : undefined,
        participants: participantsStr || undefined,
        target: values.visitedObject,
        content: values.activityContent,
        achievement: values.achievedResults,
        image: imagePayload,
      };
      await primeApi.createProjectInvestmentRecommend({
        projectInvestmentRecommendDto: dto,
      });
      message.success('录入成功');
      handleCloseActivityModal();
      fetchData({
        projectName: form.getFieldValue('projectName'),
        attractorUnit: getLabelByValue(form.getFieldValue('dept'), attractorUnitOptions),
        isRecommendedProject: true,
        page: pagination.current,
        size: pagination.pageSize,
      });
    } catch (error: any) {
      if (error?.errorFields) {
        return;
      }
      console.error('提交失败:', error);
      message.error('提交失败，请重试');
    }
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
      title: <TitleCom text={'项目名称'} icon={'/mg/icon6.png'} />,
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'center' as const,
      ellipsis: true,
      width: 200,
    },
    {
      title: <TitleCom text={'所属部门区县'} icon={'/mg/icon2.png'} />,
      dataIndex: 'departmentDistrict',
      key: 'departmentDistrict',
      align: 'center' as const,
      ellipsis: true,
      width: 180,
    },
    {
      title: <TitleCom text={'承载园区'} icon={'/mg/icon2.png'} />,
      dataIndex: 'park',
      key: 'park',
      align: 'center' as const,
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text={'项目信息'} icon={'/mg/icon7.png'} />,
      dataIndex: 'projectInfo',
      key: 'projectInfo',
      align: 'left' as const,
      ellipsis: true,
      width: 300,
      render: (text: any) => (
        <span style={{ textAlign: 'left' }} title={text}>
          {text}
        </span>
      ),
    },
    // {
    //   title: <TitleCom text={'项目环节'} icon={'/mg/icon5.png'} />,
    //   dataIndex: 'projectStage',
    //   key: 'projectStage',
    //   align: 'center' as const,
    //   width: 100,
    // },
    // {
    //   title: <TitleCom text={'活动时间'} icon={'/mg/icon2.png'} />,
    //   dataIndex: 'activityTime',
    //   key: 'activityTime',
    //   align: 'center' as const,
    //   width: 120,
    // },
    // {
    //   title: <TitleCom text={'参与人员'} icon={'/mg/icon2.png'} />,
    //   dataIndex: 'participants',
    //   key: 'participants',
    //   align: 'left' as const,
    //   ellipsis: true,
    //   width: 120,
    // },
    // {
    //   title: <TitleCom text={'拜访对象'} icon={'/mg/icon2.png'} />,
    //   dataIndex: 'visitedObject',
    //   key: 'visitedObject',
    //   align: 'left' as const,
    //   ellipsis: true,
    //   width: 120,
    // },
    // {
    //   title: <TitleCom text={'活动内容'} icon={'/mg/icon2.png'} />,
    //   dataIndex: 'activityContent',
    //   key: 'activityContent',
    //   align: 'left' as const,
    //   ellipsis: true,
    //   width: 150,
    // },
    // {
    //   title: <TitleCom text={'取得成果'} icon={'/mg/icon2.png'} />,
    //   dataIndex: 'achievedResults',
    //   key: 'achievedResults',
    //   align: 'left' as const,
    //   ellipsis: true,
    //   width: 200,
    //   render: (text: any) => (
    //     <span style={{ textAlign: 'left' }} title={text}>
    //       {text}
    //     </span>
    //   ),
    // },
    {
      title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      key: 'action',
      align: 'center' as const,
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: any) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
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
              onClick={() => {
                if (record?.id) {
                  window.open(`/project-recomand/recolist?id=${record.id}`, '_blank');
                } else {
                  message.warning('缺少招商ID，无法打开活动列表');
                }
              }}
            >
              <div>活动情况</div>
              <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getAttractorUnitOptions();
    loadActivityCascade();
    fetchData({
      isRecommendedProject: true,
      page: 1,
      size: pagination.pageSize,
    });
  }, []);

  // 文件上传配置
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const activityUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    onChange({ file, fileList }) {
      setActivityUploading(file.status === 'uploading');
      setActivityFileList(fileList);
    },
    beforeUpload: () => {
      setActivityUploading(true);
      return true;
    },
  };

  // 项目环节选项
  const projectStageOptions = [
    { label: '对接', value: '对接' },
    { label: '谈判', value: '谈判' },
    { label: '考察', value: '考察' },
  ];

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
        content="欢迎使用项目推荐模块"
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
                  label="承载园区"
                  name="park"
                >
                  <Select
                    options={queryParkOptions}
                    placeholder="请选择承载园区"
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
                {/* <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px',
                  }}
                  label="招引部门"
                  name="dept"
                >
                  <Select
                    options={attractorUnitOptions}
                    placeholder="请选择招引部门"
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item> */}
              </Row>
              <Row>
                <Form.Item
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 0,
                  }}
                >
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => handleOpenActivityModal()}
                    >
                      录入招商活动
                    </Button>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button
                      htmlType="button"
                      onClick={() => {
                        form.resetFields();
                        setPagination({
                          current: 1,
                          pageSize: 10,
                          total: 0,
                        });
                        fetchData({
                          isRecommendedProject: true,
                          page: 1,
                          size: 10,
                        });
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
            loading={loading}
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

        {/* 录入招商活动弹窗 */}
        <style>{`
          .activity-modal-body-hidden-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .activity-modal-body-hidden-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}</style>
        <Modal
          title={isViewMode ? "活动详细" : "录入招商活动"}
          open={activityModalVisible}
          onCancel={handleCloseActivityModal}
          onOk={isViewMode ? undefined : handleSubmitActivity}
          okText="确定"
          cancelText="取消"
          width={900}
          confirmLoading={activityUploading}
          style={{ maxHeight: '90vh' }}
          bodyStyle={{
            maxHeight: 'calc(90vh - 200px)',
            overflow: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          classNames={{ body: 'activity-modal-body-hidden-scrollbar' }}
          footer={isViewMode ? [
            <Button key="close" onClick={handleCloseActivityModal}>
              关闭
            </Button>
          ] : undefined}
        >
          <Form
            form={activityForm}
            layout="vertical"
            style={{ marginTop: '20px' }}
          >
            <Row gutter={16}>
              <Form.Item<ActivityFormType>
                label="项目名称"
                name="projectName"
                rules={[{ required: true, message: '请选择项目名称' }]}
                style={{ width: '40%' ,marginLeft:'20px'}}
              >
                <Select
                  showSearch
                  labelInValue
                  placeholder="请选择项目名称（支持模糊搜索）"
                  disabled={isViewMode}
                  filterOption={false}
                  options={projectSelectOptions}
                  loading={projectSelectLoading}
                  onSearch={(kw) => searchProjects(kw)}
                  optionRender={(option) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {option.label}
                      </span>
                      {option.data?.progressLabel && (
                        <Tag color="blue" style={{ flexShrink: 0 }}>{option.data.progressLabel}</Tag>
                      )}
                    </div>
                  )}
                  onChange={(val) => {
                    const v = (val as any)?.value;
                    if (!v) {
                      selectedProjectRef.current = null;
                      activityForm.setFieldsValue({
                        district: undefined,
                        park: undefined,
                        projectInfo: undefined,
                      });
                      return;
                    }
                    const info = projectInfoMapRef.current[v];
                    selectedProjectRef.current = info || null;
                    activityForm.setFieldsValue({
                      district: info?.districtName || info?.district || undefined,
                      park: info?.parkName || info?.park || undefined,
                      projectInfo: info?.projectContent || undefined,
                    });
                  }}
                  allowClear
                />
              </Form.Item>
              <Form.Item<ActivityFormType>
                label="所属部门"
                name="department"
                style={{ width: '40%', marginLeft: '20px' }}
              >
                <Input placeholder="自动填充,不可输入" disabled />
              </Form.Item>
            </Row>
            <Row gutter={16}>
              <Form.Item<ActivityFormType>
                label="区县"
                name="district"
                rules={[{ required: true, message: '请选择区县' }]}
                style={{ width: '40%' ,marginLeft:'20px'}}

              >
                <Input placeholder="自动填充" disabled />
              </Form.Item>
              <Form.Item<ActivityFormType>
                label="承载园区"
                name="park"
                style={{ width: '40%', marginLeft: '20px' }}
              >
                <Input placeholder="自动填充" disabled />
              </Form.Item>
            </Row>
            <Row gutter={16}>
              <Form.Item<ActivityFormType>
                label="项目信息"
                name="projectInfo"
                rules={[{ required: true, message: '请选择项目信息' }]}
                style={{ width: '82.5%' ,marginLeft:'20px'}}

              >
                <Input placeholder="自动填充" disabled />
              </Form.Item>

            </Row>

            <Row gutter={16}>

              <Form.Item<ActivityFormType>
                label="项目环节"
                name="projectStage"
                rules={[{ required: true, message: '请选择项目环节' }]}
                style={{ width: '40%', marginLeft: '20px' }}
              >
                <Select
                  options={projectStageOptions}
                  placeholder="下拉选择:对接/谈判/考察"
                  disabled={isViewMode}
                />
              </Form.Item>
            </Row>
            <Row gutter={16}>
              <Form.Item<ActivityFormType>
                label="活动时间"
                name="activityTime"
                rules={[{ required: true, message: '请选择活动时间' }]}
                style={{ width: '40%' ,marginLeft:'20px'}}

              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder="时间选择器"
                  disabled={isViewMode}
                />
              </Form.Item>
              <Form.Item<ActivityFormType>
                label="拜访对象"
                name="visitedObject"
                style={{ width: '40%', marginLeft: '20px' }}
              >
                <Input placeholder="文本输入" disabled={isViewMode} />
              </Form.Item>
            </Row>
            <Form.Item<ActivityFormType>
              label="参与人员"
              style={{ marginLeft: '20px' }}
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
                            rules={[{ required: false }]}
                          >
                            <Input placeholder="参与人员" disabled={isViewMode} />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, 'department']}
                            rules={[{ required: false }]}
                          >
                            <Input placeholder="参与部门" disabled={isViewMode} />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          {!isViewMode && fields.length > 1 && (
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
                    {!isViewMode && (
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
                    )}
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Row gutter={16}>
              <Form.Item<ActivityFormType>
                label="活动内容"
                name="activityContent"
                rules={[{ required: true, message: '请输入活动内容' }]}
                style={{ width: '40%', marginLeft: '20px' }}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="请输入活动内容"
                  disabled={isViewMode}
                />
              </Form.Item>
              <Form.Item<ActivityFormType>
                label="取得成果"
                name="achievedResults"
                style={{ width: '40%', marginLeft: '20px' }}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="文本输入"
                  maxLength={500}
                  showCount
                  disabled={isViewMode}
                />
              </Form.Item>
            </Row>
            <Row gutter={16}>
              <Form.Item<ActivityFormType>
                label="图片"
                name="images"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                style={{ marginLeft: '20px' }}

              >
                {isViewMode && activityFileList.length === 0 ? (
                  <div style={{ color: 'rgba(0,0,0,0.45)', lineHeight: '80px' }}>暂无图片</div>
                ) : (
                  <Upload {...activityUploadProps} listType="picture-card" disabled={isViewMode}>
                    {activityFileList.length < 10 && !isViewMode && (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>图片上传</div>
                      </div>
                    )}
                  </Upload>
                )}
              </Form.Item>
            </Row>
          </Form>
        </Modal>
      </PageContainer>
    </div>
  );
};

export default ProjectRecomand;

