import {
  Button,
  Col,
  DatePicker,
  Form,
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
import { useEffect, useMemo, useState } from 'react';
import { primeApi, systemApi } from '@/services/api';
import { useModel, useNavigate, useSearchParams } from '@umijs/max';
import type { FileDownloadVo, ListProjectDigitalInvestmentAttractingRequest } from '@/services/apis';
import DictSelection from '@/components/DictSelection';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { buildColumns } from './columns';
import type { FieldType } from './types';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', marginBottom: 20 }}>
      <div style={{ marginRight: 10, width: 5, height: 16, background: '#005BF5', borderRadius: 2.5 }} />
      <div style={{ fontSize: 16, fontWeight: 'bolder' }}>{children}</div>
    </div>
  );
}

const ProjectManage4 = () => {
  const [form] = Form.useForm<FieldType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 列表状态
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: parseInt(searchParams.get('page') || '1', 10),
    pageSize: parseInt(searchParams.get('pageSize') || '10', 10),
    total: 0,
  });

  // 项目申诉
  const [appealModalVisible, setAppealModalVisible] = useState(false);
  const [appealForm] = Form.useForm();
  const [appealFileList, setAppealFileList] = useState<UploadFile[]>([]);
  const [appealProjectId, setAppealProjectId] = useState('');
  const [appealProjectName, setAppealProjectName] = useState('');
  const [appealUploading, setAppealUploading] = useState(false);
  const [appealDepartment, setAppealDepartment] = useState('');

  // 得分情况
  const [scoreModalVisible, setScoreModalVisible] = useState(false);
  const [scoreData, setScoreData] = useState<any>(null);
  const [scoreLoading, setScoreLoading] = useState(false);

  // 计分台账
  const [projectScoreDetailModalVisible, setProjectScoreDetailModalVisible] = useState(false);
  const [projectScoreDetailData, setProjectScoreDetailData] = useState<any[]>([]);
  const [projectScoreDetailLoading, setProjectScoreDetailLoading] = useState(false);
  const [currentProjectRecord, setCurrentProjectRecord] = useState<any>(null);

  // ---------- URL 参数 ----------

  const updateUrlParams = (params: Record<string, string | number | null | undefined>) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      if (value === null || value === '') next.delete(key);
      else next.set(key, String(value));
    }
    setSearchParams(next);
  };

  // ---------- 数据获取 ----------

  const buildFetchParams = (
    page: number,
    size: number,
  ): ListProjectDigitalInvestmentAttractingRequest => {
    const v = form.getFieldsValue(true) as FieldType;
    const progressVal = v.currentProjectProgress;
    return {
      showAll: false,
      projectCode: v.projectCode || undefined,
      projectName: v.projectName || undefined,
      currentProjectProgress: progressVal ? [progressVal] : undefined,
      projectContent: v.projectContent || undefined,
      year: v.year ?? undefined,
      page,
      size,
    };
  };

  const fetchData = async (params: ListProjectDigitalInvestmentAttractingRequest) => {
    setLoading(true);
    try {
      const data = await primeApi.listProjectDigitalInvestmentAttracting(params);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        current: data.page,
        pageSize: data.size,
      }));
      setDataSource(data.records);
    } catch {
      message.error('获取项目数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    updateUrlParams({ page, pageSize });
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    fetchData(buildFetchParams(page, pageSize));
  };

  const handleSearch = () => {
    const v = form.getFieldsValue(true) as FieldType;
    updateUrlParams({
      page: 1,
      projectCode: v.projectCode || '',
      projectName: v.projectName || '',
      currentProjectProgress: v.currentProjectProgress || '',
      projectContent: v.projectContent || '',
      year: v.year ?? '',
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData(buildFetchParams(1, pagination.pageSize));
  };

  const handleReset = () => {
    form.resetFields();
    updateUrlParams({ page: 1, projectCode: '', projectName: '', currentProjectProgress: '', projectContent: '', year: '' });
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData({ showAll: false, page: 1, size: pagination.pageSize });
  };

  // ---------- 辅助 ----------

  const getDepartmentFromSession = async (): Promise<string> => {
    try {
      const session = await systemApi.getSession();
      if (session?.organizations?.length) {
        return session.organizations
          .map((org: any) => org.name)
          .filter(Boolean)
          .join(',');
      }
      return '';
    } catch {
      return '';
    }
  };

  // ---------- 计分台账 ----------

  const fetchProjectScoreDetailData = async (record: any) => {
    setProjectScoreDetailLoading(true);
    try {
      const data = await primeApi.getProjectDynamics({ projectId: record.id });
      const formatted = Array.isArray(data)
        ? data.map((item: any, i: number) => ({ ...item, id: item.id || `item-${i}` }))
        : [];
      setProjectScoreDetailData(formatted);
    } catch (err: any) {
      message.error(err?.message || '获取项目得分详情失败');
      setProjectScoreDetailData([]);
    } finally {
      setProjectScoreDetailLoading(false);
    }
  };

  const handleOpenProjectScoreDetailModal = async (record: any) => {
    setCurrentProjectRecord(record);
    setProjectScoreDetailModalVisible(true);
    await fetchProjectScoreDetailData(record);
  };

  const handleCloseProjectScoreDetailModal = () => {
    setProjectScoreDetailModalVisible(false);
    setProjectScoreDetailData([]);
    setCurrentProjectRecord(null);
  };

  // ---------- 得分情况 ----------

  const fetchScoreData = async () => {
    setScoreLoading(true);
    try {
      const data = await primeApi.projectDeptScoreDetail({ year: 2025 });
      const dept = await getDepartmentFromSession();
      if (Array.isArray(data) && data.length > 0) {
        const deptData = dept
          ? data.find((item: any) => item.deptName === dept || item.deptName?.includes(dept))
          : null;
        setScoreData(deptData ?? data[0]);
      } else {
        setScoreData(null);
      }
    } catch (err: any) {
      message.error(err?.message || '获取得分情况失败');
      setScoreData(null);
    } finally {
      setScoreLoading(false);
    }
  };

  // ---------- 申诉 ----------

  const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

  const appealUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    fileList: appealFileList,
    onChange({ file, fileList }) {
      setAppealUploading(file.status === 'uploading');
      setAppealFileList(fileList);
    },
    beforeUpload: () => { setAppealUploading(true); return true; },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAppealOpen = async (record: any) => {
    setAppealProjectId(record.id);
    setAppealProjectName(record.projectName || '');
    setAppealModalVisible(true);
    const department = await getDepartmentFromSession();
    setAppealDepartment(department);
    appealForm.setFieldsValue({ appealTime: dayjs() });
  };

  const handleAppealCancel = () => {
    setAppealModalVisible(false);
    appealForm.resetFields();
    setAppealFileList([]);
    setAppealDepartment('');
  };

  const handleAppealSubmit = async () => {
    try {
      const values = await appealForm.validateFields();
      const uploadedFiles = appealFileList.filter((f) => f.status === 'done');
      if (!uploadedFiles.length) { message.error('请上传文件'); return; }
      const images: FileDownloadVo[] = uploadedFiles.map((file) => {
        let path = '';
        let name = file.name || '';
        if (file.response) {
          const r = Array.isArray(file.response) ? file.response[0] : file.response;
          path = r?.path || r?.url || '';
          name = r?.name || file.name || '';
        } else if (file.url) {
          path = file.url;
        }
        return { name, path };
      }).filter((img) => img.path);
      if (!images.length) { message.error('请上传有效的文件'); return; }
      await primeApi.createProjectAppeal({
        projectAppealDto: {
          investmentId: appealProjectId,
          description: values.description,
          images,
          sjjgName: appealDepartment,
        } as any,
      });
      message.success('申诉提交成功');
      setAppealModalVisible(false);
      appealForm.resetFields();
      setAppealFileList([]);
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('提交申诉失败，请重试');
    }
  };

  // ---------- 初始化 ----------

  useEffect(() => {
    form.setFieldsValue({
      projectName: searchParams.get('projectName') || undefined,
      projectCode: searchParams.get('projectCode') || undefined,
      currentProjectProgress: searchParams.get('currentProjectProgress') || undefined,
      projectContent: searchParams.get('projectContent') || undefined,
      year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
    });
    fetchData(buildFetchParams(pagination.current, pagination.pageSize));
  }, []);

  // ---------- 表格列 ----------

  const columns = useMemo(
    () =>
      buildColumns({
        onDetail: (record) => {
          if (record.currentProjectProgress) {
            navigate(`/xmgl/xmjd?id=${record.id}`);
          } else {
            message.info('当前项目暂无进度');
          }
        },
        onSignApproval: (record) =>
          navigate(`/xmgl4/pro-sign?id=${record.id}&zsid=${record.projectCode}`),
        onStartApproval: (record) =>
          navigate(`/xmgl4/pro-start?id=${record.id}&zsid=${record.projectCode}`),
        onShowScore: handleOpenProjectScoreDetailModal,
      }),
    [],
  );

  // ---------- 渲染 ----------

  return (
    <div style={{ display: 'flex' }}>
      <PageContainer
        style={{ width: '100%', height: '90vh', overflow: 'auto', scrollbarWidth: 'none' }}
        content="欢迎使用项目管理模块"
      >
        <div style={{ padding: 20, backgroundColor: 'white' }}>
          {/* 筛选区 */}
          <div style={{ padding: 20, backgroundImage: 'url(/pm-bg1.png)', backgroundSize: '100% 100%' }}>
            <SectionTitle>查询</SectionTitle>
            <Form form={form} layout="horizontal" autoComplete="off" onFinish={handleSearch}>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item<FieldType> label="项目名称" name="projectName">
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="项目编号" name="projectCode">
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="项目状态" name="currentProjectProgress">
                    <DictSelection catalog="project_progress" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item<FieldType> label="项目内容" name="projectContent">
                    <Input allowClear />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item<FieldType> label="所属年份" name="year">
                    <Select
                      allowClear
                      placeholder="全部"
                      options={[2023, 2024, 2025, 2026].map((y) => ({ value: y, label: String(y) }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                      <Button type="primary" htmlType="submit">查询</Button>
                      <Button onClick={handleReset}>重置</Button>
                      <Button onClick={() => { setScoreModalVisible(true); fetchScoreData(); }}>
                        得分情况
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          {/* 表格 */}
          <Table
            style={{ marginTop: 20 }}
            rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            columns={columns}
            bordered
            dataSource={dataSource}
            pagination={false}
            loading={loading}
          />
          <Pagination
            showSizeChanger={false}
            current={pagination.current}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            onChange={handlePageChange}
            style={{ marginTop: 16 }}
          />
        </div>

        {/* 项目申诉 Modal */}
        <Modal
          title="项目申诉"
          open={appealModalVisible}
          onCancel={handleAppealCancel}
          onOk={handleAppealSubmit}
          okText="提交"
          cancelText="取消"
          width={600}
          confirmLoading={appealUploading}
        >
          <Form form={appealForm} layout="vertical" initialValues={{ appealTime: dayjs() }}>
            <Form.Item label="申诉人">
              <Input value={(currentUser as any)?.realName || currentUser?.name || ''} disabled />
            </Form.Item>
            <Form.Item label="所属单位">
              <Input value={appealDepartment} disabled />
            </Form.Item>
            <Form.Item label="申诉时间" name="appealTime">
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="申诉项目">
              <Input value={appealProjectName} disabled />
            </Form.Item>
            <Form.Item
              label="问题描述"
              name="description"
              rules={[
                { required: true, message: '请输入问题描述' },
                { max: 200, message: '最多输入200个字符' },
              ]}
            >
              <Input.TextArea rows={4} placeholder="请输入" showCount maxLength={200} />
            </Form.Item>
            <Form.Item
              label="文件上传"
              name="images"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                { required: true, message: '请上传文件' },
                {
                  validator: (_, value) => {
                    if (!value?.length) return Promise.reject(new Error('请上传文件'));
                    if (!value.some((f: UploadFile) => f.status === 'done'))
                      return Promise.reject(new Error('请等待文件上传完成'));
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Upload {...appealUploadProps}>
                <Button icon={<UploadOutlined />}>选择文件</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        {/* 得分情况 Modal */}
        <Modal
          title="得分情况"
          open={scoreModalVisible}
          onCancel={() => { setScoreModalVisible(false); setScoreData(null); }}
          footer={[
            <Button key="close" onClick={() => { setScoreModalVisible(false); setScoreData(null); }}>
              关闭
            </Button>,
          ]}
          width={600}
        >
          <div style={{ padding: '20px 0' }}>
            {scoreLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>加载中...</div>
            ) : scoreData ? (
              <>
                <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20 }}>
                  {scoreData.year || dayjs().year()}年度本部门得分情况如下
                </div>
                <div style={{ lineHeight: '1.8' }}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>实际得分：</strong>
                    {(scoreData.actualScore ?? 0).toFixed(1)}分，其中签约得分
                    {(scoreData.actualSignScore ?? 0).toFixed(1)}分，开工得分
                    {(scoreData.actualStartScore ?? 0).toFixed(1)}分
                  </div>
                  <div>
                    <strong>认定得分：</strong>
                    {(scoreData.score ?? 0).toFixed(1)}分，其中签约得分
                    {(scoreData.signScore ?? 0).toFixed(1)}分，开工得分
                    {(scoreData.startScore ?? 0).toFixed(1)}分
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>暂无数据</div>
            )}
          </div>
        </Modal>

        {/* 计分台账 Modal */}
        <Modal
          title="计分台账"
          open={projectScoreDetailModalVisible}
          onCancel={handleCloseProjectScoreDetailModal}
          footer={[
            <Button key="cancel" onClick={handleCloseProjectScoreDetailModal}>取消</Button>,
            <Button key="confirm" type="primary" onClick={handleCloseProjectScoreDetailModal}>确定</Button>,
          ]}
          width={1200}
        >
          <Table
            columns={[
              {
                title: '计分事件',
                dataIndex: 'step',
                align: 'center',
                width: 120,
                render: (text: string) =>
                  ({ sign: '签约计分', start: '开工计分', complete: '竣工计分' } as Record<string, string>)[text] ?? text ?? '-',
              },
              {
                title: '是否通过',
                dataIndex: 'result',
                align: 'center',
                width: 100,
                render: (text: string) => {
                  if (text === '1' || text === '通过') return '通过';
                  if (text === '2' || text === '驳回' || text === '未通过') return '驳回';
                  if (text === '3' || text === '不计分') return '不计分';
                  return text || '-';
                },
              },
              {
                title: '审批意见',
                dataIndex: 'comment',
                align: 'left',
                width: 200,
                ellipsis: true,
                render: (text: string) => text || '-',
              },
              {
                title: '计入分值',
                dataIndex: 'score',
                align: 'center',
                width: 100,
                render: (text: number | string | null | undefined) => {
                  if (text === null || text === undefined) return '0';
                  const n = typeof text === 'number' ? text : parseFloat(String(text));
                  if (isNaN(n)) return '0';
                  return n % 1 === 0 ? String(n) : n.toFixed(2);
                },
              },
              {
                title: '计分年度',
                dataIndex: 'year',
                align: 'center',
                width: 100,
                render: (text: number | string) =>
                  text ? String(text) : String(currentProjectRecord?.year || dayjs().year() || '-'),
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

export default ProjectManage4;
