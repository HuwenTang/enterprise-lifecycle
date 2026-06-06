import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Upload,
  type UploadFile,
  type UploadProps,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '@umijs/max';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { primeApi } from '@/services/api';
import type { ProjectInvestmentRecommendVo } from '@/services/apis';
import { normalizeRecommendImageUrls, recommendImageUrlsToUploadFileList } from './recommendImageUrls';

type ParticipantItem = {
  participant?: string;
  department?: string;
};

/** 与「项目推荐-录入招商活动」弹窗字段一致 */
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

const projectStageOptions = [
  { label: '对接', value: '对接' },
  { label: '谈判', value: '谈判' },
  { label: '考察', value: '考察' },
];

/** 活动时间统一展示为 年月日 时分秒 */
const formatActivityTime = (v: unknown) => {
  if (v === null || v === undefined || v === '') return '—';
  const d = dayjs(v as string | number | Date);
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : String(v);
};

/** 所属部门中文回显（接口 departmentLabel；类型可能未同步生成） */
const getDepartmentLabelEcho = (row: ProjectInvestmentRecommendVo & { departmentLabel?: string }) => {
  const label = row.departmentLabel?.trim();
  if (label) return label;
  return row.dept?.trim() || '—';
};

const RecoList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // 接口参数使用 id，这里兼容旧的 zsId 传参
  const id = searchParams.get('id') || searchParams.get('zsId') || undefined;
  const [editActivityForm] = Form.useForm<ActivityFormType>();
  const [viewActivityForm] = Form.useForm<ActivityFormType>();

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ProjectInvestmentRecommendVo[]>([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [activityFileList, setActivityFileList] = useState<UploadFile[]>([]);
  const [activityUploading, setActivityUploading] = useState(false);
  const [viewActivityFileList, setViewActivityFileList] = useState<UploadFile[]>([]);
  const [projectSelectOptions, setProjectSelectOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [projectSelectLoading, setProjectSelectLoading] = useState(false);
  const projectInfoMapRef = useRef<Record<string, any>>({});
  const selectedProjectRef = useRef<any>(null);
  const projectSearchTimerRef = useRef<number | null>(null);
  /** 编辑保存时 dept 仍传 cobId（与表单「所属部门」展示 departmentLabel 分离） */
  const editDepartmentDeptRef = useRef<string>('');

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

  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewData, setViewData] = useState<ProjectInvestmentRecommendVo | null>(null);

  // 后端该接口在当前生成类型里仅声明了 id/page/size，但实际可能支持更多筛选字段
  // 这里用 any 以兼容透传 zsId 与表单筛选参数
  const fetchList = async (params: any) => {
    setLoading(true);
    try {
      const res = await primeApi.listProjectInvestmentRecommend(params);
      setPagination({
        current: res.page ?? 1,
        pageSize: res.size ?? 10,
        total: res.total ?? 0,
      });
      setDataSource(res.records ?? []);
    } catch (e) {
      console.error(e);
      message.error('获取招商活动列表失败');
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList({ ...(id ? ({ id } as any) : {}), page: 1, size: pagination.pageSize });
  }, [id]);

  const openView = async (record: ProjectInvestmentRecommendVo) => {
    setViewOpen(true);
    viewActivityForm.resetFields();
    setViewActivityFileList([]);
    if (!record?.id) {
      setViewData(record);
      return;
    }
    setViewLoading(true);
    try {
      const detail = await primeApi.getProjectInvestmentRecommend({ id: record.id });
      setViewData(detail);
    } catch (e) {
      console.error(e);
      // 回退使用列表行数据，至少可展示
      setViewData(record);
    } finally {
      setViewLoading(false);
    }
  };

  const closeView = () => {
    setViewOpen(false);
    setViewData(null);
    viewActivityForm.resetFields();
    setViewActivityFileList([]);
  };

  const parseParticipantsToForm = (participants?: string): ParticipantItem[] => {
    let participantsArray: ParticipantItem[] = [];
    if (participants) {
      const items = participants.split(';').filter((item: string) => item.trim());
      participantsArray = items.map((item: string) => {
        const parts = item.split('-');
        if (parts.length >= 2) {
          return {
            participant: parts[0].trim(),
            department: parts.slice(1).join('-').trim(),
          };
        }
        return {
          participant: parts[0].trim(),
          department: '',
        };
      });
    }
    if (participantsArray.length === 0) {
      participantsArray = [{ participant: '', department: '' }];
    }
    return participantsArray;
  };

  // 查看模式：把 viewData 回显到 viewActivityForm，并解析图片列表
  useEffect(() => {
    if (!viewOpen || !viewData) return;
    const projKey = viewData.digitalInvestmentId || viewData.projName || '';
    const projLabel = viewData.projName || '';

    setProjectSelectOptions(projKey ? [{ value: projKey, label: projLabel || projKey }] : []);

    const urls = normalizeRecommendImageUrls(viewData.image as string | string[] | undefined);
    const fileList = recommendImageUrlsToUploadFileList(urls, 'view');

    setViewActivityFileList(fileList);

    viewActivityForm.setFieldsValue({
      projectName: projKey ? { value: projKey, label: projLabel || projKey } : undefined,
      department: getDepartmentLabelEcho(viewData as ProjectInvestmentRecommendVo & { departmentLabel?: string }),
      district: viewData.districtName || viewData.district,
      park: viewData.parkName || viewData.park,
      projectInfo: viewData.projInfo,
      projectStage: viewData.projStep,
      activityTime: viewData.activityTime ? dayjs(viewData.activityTime) : undefined,
      participants: parseParticipantsToForm(viewData.participants),
      visitedObject: viewData.target,
      activityContent: viewData.content,
      achievedResults: viewData.achievement,
      images: fileList as any,
    });
  }, [viewOpen, viewData, viewActivityForm]);

  const openEdit = async (record: ProjectInvestmentRecommendVo) => {
    setEditingId(record.id);
    setEditOpen(true);
    selectedProjectRef.current = null;
    projectInfoMapRef.current = {};
    let data: ProjectInvestmentRecommendVo = record;
    if (record.id) {
      try {
        data = await primeApi.getProjectInvestmentRecommend({ id: record.id });
      } catch (e) {
        console.error(e);
      }
    }
    const projKey = data.digitalInvestmentId || data.projName || '';
    const projLabel = data.projName || '';
    if (projKey) {
      setProjectSelectOptions([{ value: projKey, label: projLabel || projKey }]);
    } else {
      setProjectSelectOptions([]);
    }
    const imageUrls = normalizeRecommendImageUrls(data.image as string | string[] | undefined);
    const editImageFileList = recommendImageUrlsToUploadFileList(imageUrls, 'edit');
    setActivityFileList(editImageFileList);
    const row = data as ProjectInvestmentRecommendVo & { departmentLabel?: string };
    editDepartmentDeptRef.current = (row.dept || '').trim();
    editActivityForm.setFieldsValue({
      projectName:
        projKey && projLabel
          ? { value: projKey, label: projLabel }
          : projKey
            ? { value: projKey, label: projKey }
            : undefined,
      department: row.departmentLabel?.trim() || row.dept?.trim() || '',
      district: data.districtName || data.district,
      park: data.parkName || data.park,
      projectInfo: data.projInfo,
      projectStage: data.projStep,
      activityTime: data.activityTime ? dayjs(data.activityTime) : undefined,
      participants: parseParticipantsToForm(data.participants),
      visitedObject: data.target,
      activityContent: data.content,
      achievedResults: data.achievement,
      images: editImageFileList as any,
    });
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditingId(undefined);
    editActivityForm.resetFields();
    setActivityFileList([]);
    selectedProjectRef.current = null;
    projectInfoMapRef.current = {};
    setProjectSelectOptions([]);
    editDepartmentDeptRef.current = '';
  };

  const handleEditSubmit = async () => {
    if (!editingId) return;
    try {
      const values = await editActivityForm.validateFields();
      setEditSubmitting(true);
      let imageList: string[] | undefined;
      if (activityFileList && activityFileList.length > 0) {
        const uploadedFiles = activityFileList.filter((file) => file.status === 'done');
        const urls = uploadedFiles
          .map((file) => {
            if (file.response) {
              const response = Array.isArray(file.response) ? file.response[0] : file.response;
              return response?.path || response?.url || file.url || '';
            }
            if (file.url) {
              return file.url;
            }
            return '';
          })
          .filter((u) => u);
        imageList = urls.length ? urls : undefined;
      }
      let participantsStr = '';
      if (values.participants && Array.isArray(values.participants) && values.participants.length > 0) {
        participantsStr = values.participants
          .map((item) => {
            const participant = item.participant || '';
            const department = item.department || '';
            if (participant && department) {
              return `${participant}-${department}`;
            }
            if (participant) {
              return participant;
            }
            return '';
          })
          .filter((item) => item)
          .join(';');
      }
      const deptSubmit = editDepartmentDeptRef.current.trim();
      if (!deptSubmit) {
        message.error('未获取到部门标识（dept），请刷新后重试');
        return;
      }
      const dto: any = {
        digitalInvestmentId: values.projectName?.value,
        projName: values.projectName?.label,
        dept: deptSubmit,
        district: selectedProjectRef.current?.districtName || selectedProjectRef.current?.district || values.district,
        park: selectedProjectRef.current?.parkName || selectedProjectRef.current?.park || values.park,
        projInfo: values.projectInfo,
        projStep: values.projectStage,
        activityTime: values.activityTime ? values.activityTime.toDate() : undefined,
        participants: participantsStr || undefined,
        target: values.visitedObject,
        content: values.activityContent,
        achievement: values.achievedResults,
        image: imageList,
      };
      await primeApi.updateProjectInvestmentRecommend({
        id: editingId,
        projectInvestmentRecommendDto: dto,
      });
      message.success('保存成功');
      closeEdit();
      fetchList({
        ...(id ? ({ id } as any) : {}),
        page: pagination.current,
        size: pagination.pageSize,
      });
    } catch (e: any) {
      if (e?.errorFields) return;
      console.error(e);
      message.error('保存失败');
    } finally {
      setEditSubmitting(false);
    }
  };

  // 参数名不能用 id：会遮蔽 URL 上的 id（父级招商推荐 id），导致删除后列表用“被删行 id”去查而全部为空
  const handleDelete = async (recordId?: string) => {
    if (!recordId) return;
    try {
      await primeApi.deleteProjectInvestmentRecommend({ id: recordId });
      message.success('删除成功');
      fetchList({
        ...(id ? ({ id } as any) : {}),
        page: 1,
        size: pagination.pageSize,
      });
    } catch (e) {
      console.error(e);
      message.error('删除失败');
    }
  };

  const columns = useMemo(
    () => [
      {
        title: '项目名称',
        dataIndex: 'projName',
        key: 'projName',
        ellipsis: true,
      },
      {
        title: '所属部门',
        dataIndex: 'dept',
        key: 'dept',
        width: 160,
        ellipsis: true,
        render: (_: unknown, record: ProjectInvestmentRecommendVo & { departmentLabel?: string }) =>
          getDepartmentLabelEcho(record),
      },
      {
        title: '项目环节',
        dataIndex: 'projStep',
        key: 'projStep',
        width: 120,
        ellipsis: true,
      },
      {
        title: '活动时间',
        dataIndex: 'activityTime',
        key: 'activityTime',
        width: 180,
        ellipsis: true,
        render: (v: any) => formatActivityTime(v),
      },
      {
        title: '拜访对象',
        dataIndex: 'target',
        key: 'target',
        width: 160,
        ellipsis: true,
      },
      {
        title: '操作',
        key: 'action',
        width: 260,
        fixed: 'right' as const,
        render: (_: any, record: ProjectInvestmentRecommendVo) => (
          <Space>
            <Button
              type="link"
              onClick={() => {
                openView(record);
              }}
            >
              查看活动
            </Button>
            <Button type="link" onClick={() => openEdit(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确定删除该活动？"
              okText="删除"
              cancelText="取消"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [],
  );

  return (
    <PageContainer
      title="招商活动列表"
      style={{ height: '90vh', overflow: 'auto', scrollbarWidth: 'none' }}
      breadcrumb={{
        routes: [
          { path: '/project-recomand', title: '项目推荐' },
          { path: '/project-recomand/recolist', title: '招商活动列表' },
        ],
        itemRender: (route, _params, routes) => {
          const last = routes.indexOf(route) === routes.length - 1;
          return last ? (
            <span>{route.title}</span>
          ) : (
            <a
              onClick={(e) => {
                e.preventDefault();
                if (route.path) navigate(route.path);
              }}
            >
              {route.title}
            </a>
          );
        },
      }}
    >
      <div style={{ padding: 20, background: '#fff' }}>
        <Table
          style={{ marginTop: 0 }}
          rowKey={(r) => r.id || `${r.projName}-${r.activityTime}`}
          columns={columns as any}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
          scroll={{ x: 1100 }}
        />

        <Pagination
          showSizeChanger={false}
          current={pagination.current}
          total={pagination.total}
          showTotal={(t) => `共 ${t} 条`}
          style={{ marginTop: 16 }}
          onChange={(page, pageSize) => {
            setPagination((p) => ({ ...p, current: page, pageSize: pageSize || p.pageSize }));
            fetchList({
              ...(id ? ({ id } as any) : {}),
              page,
              size: pageSize || pagination.pageSize,
            });
          }}
        />
      </div>

      <style>{`
        .reco-edit-activity-modal-body::-webkit-scrollbar {
          display: none;
        }
        .reco-edit-activity-modal-body {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      <Modal
        title="编辑招商活动"
        open={editOpen}
        onCancel={closeEdit}
        onOk={handleEditSubmit}
        confirmLoading={editSubmitting || activityUploading}
        okText="确定"
        cancelText="取消"
        width={900}
        destroyOnClose
        style={{ maxHeight: '90vh' }}
        bodyStyle={{
          maxHeight: 'calc(90vh - 200px)',
          overflow: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        classNames={{ body: 'reco-edit-activity-modal-body' }}
      >
        <Form form={editActivityForm} layout="vertical" style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="项目名称"
              name="projectName"
              rules={[{ required: true, message: '请选择项目名称' }]}
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Select
                showSearch
                labelInValue
                placeholder="请选择项目名称（支持模糊搜索）"
                filterOption={false}
                options={projectSelectOptions}
                loading={projectSelectLoading}
                onSearch={(kw) => searchProjects(kw)}
                onChange={(val) => {
                  const v = (val as any)?.value;
                  if (!v) {
                    selectedProjectRef.current = null;
                    editActivityForm.setFieldsValue({
                      district: undefined,
                      park: undefined,
                      projectInfo: undefined,
                    });
                    return;
                  }
                  const info = projectInfoMapRef.current[v];
                  selectedProjectRef.current = info || null;
                  editActivityForm.setFieldsValue({
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
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Input placeholder="自动填充,不可输入" disabled />
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="区县"
              name="district"
              rules={[{ required: true, message: '请选择区县' }]}
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Input placeholder="自动填充" disabled />
            </Form.Item>
            <Form.Item<ActivityFormType>
              label="承载园区"
              name="park"
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Input placeholder="自动填充" disabled />
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="项目信息"
              name="projectInfo"
              rules={[{ required: true, message: '请选择项目信息' }]}
              style={{ width: '82.5%', marginLeft: 20 }}
            >
              <Input placeholder="自动填充" disabled />
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="项目环节"
              name="projectStage"
              rules={[{ required: true, message: '请选择项目环节' }]}
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Select
                options={projectStageOptions}
                placeholder="下拉选择:对接/谈判/考察"
              />
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="活动时间"
              name="activityTime"
              rules={[{ required: true, message: '请选择活动时间' }]}
              style={{ width: '40%', marginLeft: 20 }}
            >
              <DatePicker showTime style={{ width: '100%' }} placeholder="时间选择器" />
            </Form.Item>
            <Form.Item<ActivityFormType>
              label="拜访对象"
              name="visitedObject"
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Input placeholder="文本输入" />
            </Form.Item>
          </Row>
          <Form.Item<ActivityFormType> label="参与人员" style={{ marginLeft: 20 }}>
            <Form.List name="participants">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16} style={{ marginBottom: 8 }}>
                      <Col span={10}>
                        <Form.Item {...restField} name={[name, 'participant']} rules={[{ required: false }]}>
                          <Input placeholder="参与人员" />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item {...restField} name={[name, 'department']} rules={[{ required: false }]}>
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
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                      新增人员
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="活动内容"
              name="activityContent"
              rules={[{ required: true, message: '请输入活动内容' }]}
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Input.TextArea rows={4} placeholder="请输入活动内容" />
            </Form.Item>
            <Form.Item<ActivityFormType>
              label="取得成果"
              name="achievedResults"
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Input.TextArea rows={4} placeholder="文本输入" maxLength={500} showCount />
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="图片"
              name="images"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              style={{ marginLeft: 20 }}
            >
              <Upload {...activityUploadProps} listType="picture-card">
                {activityFileList.length < 10 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>图片上传</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="查看活动"
        open={viewOpen}
        onCancel={closeView}
        footer={[
          <Button key="close" onClick={closeView}>
            关闭
          </Button>,
        ]}
        width={900}
        confirmLoading={viewLoading}
      >
        <Form form={viewActivityForm} layout="vertical" style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="项目名称"
              name="projectName"
              rules={[{ required: true, message: '请选择项目名称' }]}
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Select
                showSearch
                labelInValue
                placeholder="请选择项目名称（支持模糊搜索）"
                filterOption={false}
                options={projectSelectOptions}
                loading={projectSelectLoading}
                disabled
              />
            </Form.Item>
            <Form.Item<ActivityFormType>
              label="所属部门"
              name="department"
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Input placeholder="自动填充,不可输入" disabled />
            </Form.Item>
          </Row>

          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="区县"
              name="district"
              rules={[{ required: true, message: '请选择区县' }]}
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Input placeholder="自动填充" disabled />
            </Form.Item>
            <Form.Item<ActivityFormType>
              label="承载园区"
              name="park"
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Input placeholder="自动填充" disabled />
            </Form.Item>
          </Row>

          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="项目信息"
              name="projectInfo"
              rules={[{ required: true, message: '请选择项目信息' }]}
              style={{ width: '82.5%', marginLeft: 20 }}
            >
              <Input placeholder="自动填充" disabled />
            </Form.Item>
          </Row>

          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="项目环节"
              name="projectStage"
              rules={[{ required: true, message: '请选择项目环节' }]}
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Select options={projectStageOptions} disabled />
            </Form.Item>
          </Row>

          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="活动时间"
              name="activityTime"
              rules={[{ required: true, message: '请选择活动时间' }]}
              style={{ width: '40%', marginLeft: 20 }}
            >
              <DatePicker showTime style={{ width: '100%' }} placeholder="时间选择器" disabled />
            </Form.Item>
            <Form.Item<ActivityFormType>
              label="拜访对象"
              name="visitedObject"
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Input placeholder="文本输入" disabled />
            </Form.Item>
          </Row>

          <Form.Item<ActivityFormType> label="参与人员" style={{ marginLeft: 20 }}>
            <Form.List name="participants">
              {(fields) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16} style={{ marginBottom: 8 }}>
                      <Col span={10}>
                        <Form.Item {...restField} name={[name, 'participant']} rules={[{ required: false }]}>
                          <Input placeholder="参与人员" disabled />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item {...restField} name={[name, 'department']} rules={[{ required: false }]}>
                          <Input placeholder="参与部门" disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </Form.Item>

          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="活动内容"
              name="activityContent"
              rules={[{ required: true, message: '请输入活动内容' }]}
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Input.TextArea rows={4} placeholder="请输入活动内容" disabled />
            </Form.Item>
            <Form.Item<ActivityFormType>
              label="取得成果"
              name="achievedResults"
              style={{ width: '40%', marginLeft: 20 }}
            >
              <Input.TextArea rows={4} placeholder="文本输入" maxLength={500} showCount disabled />
            </Form.Item>
          </Row>

          <Row gutter={16}>
            <Form.Item<ActivityFormType>
              label="图片"
              name="images"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              style={{ marginLeft: 20 }}
            >
              {viewActivityFileList.length > 0 ? (
                <Upload
                  action="/system-api/file"
                  name="files"
                  multiple
                  listType="picture-card"
                  disabled
                  fileList={viewActivityFileList}
                />
              ) : (
                <div style={{ color: 'rgba(0,0,0,0.45)', lineHeight: '80px' }}>暂无图片</div>
              )}
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default RecoList;
