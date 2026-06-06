import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Table,
  Tabs,
  Tag,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { systemApi } from '@/services/api';
import WorkflowDesigner from './components/WorkflowDesigner';

type WorkflowItem = {
  id?: string;
  code?: string;
  name?: string;
};

type NodeItem = {
  id?: string;
  workflowCode?: string;
  code?: string;
  name?: string;
};

type TransitionItem = {
  id?: string;
  workflowCode?: string;
  currentNode?: string;
  resolvedNode?: string;
  rejectNode?: string;
  roleId?: string;
};

type LogItem = {
  id?: string;
  workflowCode?: string;
  recordId?: string;
  userid?: string;
  userName?: string;
  result?: boolean;
  content?: string;
  nodeCode?: string;
};

type RoleItem = {
  id?: string;
  name?: string;
};

const PAGE_SIZE = 10;

// ─────────────────────────────────────────────
// 工作流管理 Tab
// ─────────────────────────────────────────────
const WorkflowTab = ({
  onWorkflowListChange,
}: {
  onWorkflowListChange: (list: WorkflowItem[]) => void;
}) => {
  const [data, setData] = useState<WorkflowItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<WorkflowItem | null>(null);
  const [designerOpen, setDesignerOpen] = useState(false);
  const [designerWorkflow, setDesignerWorkflow] = useState<WorkflowItem | null>(null);
  const [form] = Form.useForm();

  const fetchList = async (page = 1) => {
    try {
      const res = await systemApi.listSystemWorkflow({ page, size: PAGE_SIZE });
      setData(res.records ?? []);
      setPagination((p) => ({ ...p, current: res.page ?? 1, total: res.total ?? 0 }));
      onWorkflowListChange(res.records ?? []);
    } catch {
      message.error('获取工作流列表失败');
    }
  };

  const openDesigner = (record: WorkflowItem) => {
    setDesignerWorkflow(record);
    setDesignerOpen(true);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const openCreate = () => {
    setEditRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: WorkflowItem) => {
    setEditRecord(record);
    form.setFieldsValue({ code: record.code, name: record.name });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await systemApi.deleteSystemWorkflow({ id });
      message.success('删除成功');
      fetchList(pagination.current);
    } catch {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: { code: string; name: string }) => {
    try {
      if (editRecord?.id) {
        await systemApi.updateSystemWorkflow({ id: editRecord.id, systemWorkflowDto: values });
        message.success('修改成功');
      } else {
        await systemApi.createSystemWorkflow({ systemWorkflowDto: values });
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchList(pagination.current);
    } catch {
      message.error(editRecord ? '修改失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '序号',
      width: 60,
      render: (_: unknown, __: unknown, i: number) =>
        (pagination.current - 1) * PAGE_SIZE + i + 1,
    },
    { title: '工作流代码', dataIndex: 'code', key: 'code' },
    { title: '工作流名称', dataIndex: 'name', key: 'name' },
    {
      title: '操作',
      width: 220,
      render: (_: unknown, record: WorkflowItem) => (
        <>
          <a style={{ marginRight: 12 }} onClick={() => openDesigner(record)}>可视化设计</a>
          <a style={{ marginRight: 12 }} onClick={() => openEdit(record)}>编辑</a>
          <Popconfirm
            title="确认删除该工作流？"
            onConfirm={() => handleDelete(record.id!)}
            okText="确认"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreate}>+ 新增工作流</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" bordered pagination={false} />
      <Pagination
        style={{ marginTop: 16 }}
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        showTotal={(t) => `共 ${t} 条`}
        onChange={(page) => fetchList(page)}
      />
      <Modal
        title={editRecord ? '编辑工作流' : '新增工作流'}
        open={modalOpen}
        footer={null}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={handleSubmit}>
          <Form.Item label="工作流代码" name="code" rules={[{ required: true, message: '请输入工作流代码' }]}>
            <Input placeholder="例如：PROJECT_AUDIT" />
          </Form.Item>
          <Form.Item label="工作流名称" name="name" rules={[{ required: true, message: '请输入工作流名称' }]}>
            <Input placeholder="例如：项目审批流程" />
          </Form.Item>
          <Form.Item label={null}>
            <div style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 8 }} onClick={() => setModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">提交</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <WorkflowDesigner
        open={designerOpen}
        workflow={designerWorkflow}
        onClose={() => setDesignerOpen(false)}
      />
    </>
  );
};

// ─────────────────────────────────────────────
// 节点管理 Tab
// ─────────────────────────────────────────────
const NodeTab = ({ workflowOptions }: { workflowOptions: WorkflowItem[] }) => {
  const [workflowCode, setWorkflowCode] = useState<string | undefined>();
  const [data, setData] = useState<NodeItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<NodeItem | null>(null);
  const [form] = Form.useForm();

  const fetchList = async (page = 1, wCode = workflowCode) => {
    try {
      const res = await systemApi.listSystemWorkflowNode({ workflowCode: wCode, page, size: PAGE_SIZE });
      setData(res.records ?? []);
      setPagination((p) => ({ ...p, current: res.page ?? 1, total: res.total ?? 0 }));
    } catch {
      message.error('获取节点列表失败');
    }
  };

  useEffect(() => {
    fetchList(1, workflowCode);
  }, [workflowCode]);

  const openCreate = () => {
    setEditRecord(null);
    form.resetFields();
    if (workflowCode) form.setFieldValue('workflowCode', workflowCode);
    setModalOpen(true);
  };

  const openEdit = (record: NodeItem) => {
    setEditRecord(record);
    form.setFieldsValue({ workflowCode: record.workflowCode, code: record.code, name: record.name });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await systemApi.deleteSystemWorkflowNode({ id });
      message.success('删除成功');
      fetchList(pagination.current);
    } catch {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: NodeItem) => {
    try {
      if (editRecord?.id) {
        await systemApi.updateSystemWorkflowNode({ id: editRecord.id, systemWorkflowNodeDto: values });
        message.success('修改成功');
      } else {
        await systemApi.createSystemWorkflowNode({ systemWorkflowNodeDto: values });
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchList(pagination.current);
    } catch {
      message.error(editRecord ? '修改失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '序号',
      width: 60,
      render: (_: unknown, __: unknown, i: number) =>
        (pagination.current - 1) * PAGE_SIZE + i + 1,
    },
    { title: '工作流代码', dataIndex: 'workflowCode', key: 'workflowCode' },
    { title: '节点代码', dataIndex: 'code', key: 'code' },
    { title: '节点名称', dataIndex: 'name', key: 'name' },
    {
      title: '操作',
      width: 150,
      render: (_: unknown, record: NodeItem) => (
        <>
          <a style={{ marginRight: 16 }} onClick={() => openEdit(record)}>编辑</a>
          <Popconfirm
            title="确认删除该节点？"
            onConfirm={() => handleDelete(record.id!)}
            okText="确认"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Select
          placeholder="筛选工作流"
          allowClear
          style={{ width: 240 }}
          options={workflowOptions.map((w) => ({ value: w.code, label: `${w.name}（${w.code}）` }))}
          onChange={(v) => setWorkflowCode(v)}
        />
        <Button type="primary" onClick={openCreate}>+ 新增节点</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" bordered pagination={false} />
      <Pagination
        style={{ marginTop: 16 }}
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        showTotal={(t) => `共 ${t} 条`}
        onChange={(page) => fetchList(page)}
      />
      <Modal
        title={editRecord ? '编辑节点' : '新增节点'}
        open={modalOpen}
        footer={null}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={handleSubmit}>
          <Form.Item label="所属工作流" name="workflowCode" rules={[{ required: true, message: '请选择工作流' }]}>
            <Select
              placeholder="请选择工作流"
              options={workflowOptions.map((w) => ({ value: w.code, label: `${w.name}（${w.code}）` }))}
            />
          </Form.Item>
          <Form.Item label="节点代码" name="code" rules={[{ required: true, message: '请输入节点代码' }]}>
            <Input placeholder="例如：DEPT_REVIEW" />
          </Form.Item>
          <Form.Item label="节点名称" name="name" rules={[{ required: true, message: '请输入节点名称' }]}>
            <Input placeholder="例如：部门审核" />
          </Form.Item>
          <Form.Item label={null}>
            <div style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 8 }} onClick={() => setModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">提交</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// ─────────────────────────────────────────────
// 转换规则 Tab
// ─────────────────────────────────────────────
const TransitionTab = ({ workflowOptions }: { workflowOptions: WorkflowItem[] }) => {
  const [workflowCode, setWorkflowCode] = useState<string | undefined>();
  const [data, setData] = useState<TransitionItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<TransitionItem | null>(null);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [nodeOptions, setNodeOptions] = useState<NodeItem[]>([]);
  const [form] = Form.useForm();

  const fetchList = async (page = 1, wCode = workflowCode) => {
    try {
      const res = await systemApi.listSystemWorkflowTransition({ workflowCode: wCode, page, size: PAGE_SIZE });
      setData(res.records ?? []);
      setPagination((p) => ({ ...p, current: res.page ?? 1, total: res.total ?? 0 }));
    } catch {
      message.error('获取转换规则列表失败');
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await systemApi.listRole({ page: 1, size: 999 });
      setRoles(res.records ?? []);
    } catch {
      // ignore
    }
  };

  const fetchNodes = async (wCode?: string) => {
    if (!wCode) { setNodeOptions([]); return; }
    try {
      const res = await systemApi.listSystemWorkflowNode({ workflowCode: wCode, page: 1, size: 999 });
      setNodeOptions(res.records ?? []);
    } catch {
      setNodeOptions([]);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchList(1, workflowCode);
    fetchNodes(workflowCode);
  }, [workflowCode]);

  const openCreate = () => {
    setEditRecord(null);
    form.resetFields();
    if (workflowCode) {
      form.setFieldValue('workflowCode', workflowCode);
      fetchNodes(workflowCode);
    }
    setModalOpen(true);
  };

  const openEdit = (record: TransitionItem) => {
    setEditRecord(record);
    form.setFieldsValue(record);
    fetchNodes(record.workflowCode);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await systemApi.deleteSystemWorkflowTransition({ id });
      message.success('删除成功');
      fetchList(pagination.current);
    } catch {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: TransitionItem) => {
    try {
      if (editRecord?.id) {
        await systemApi.updateSystemWorkflowTransition({ id: editRecord.id, systemWorkflowTransitionDto: values });
        message.success('修改成功');
      } else {
        await systemApi.createSystemWorkflowTransition({ systemWorkflowTransitionDto: values });
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchList(pagination.current);
    } catch {
      message.error(editRecord ? '修改失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '序号',
      width: 60,
      render: (_: unknown, __: unknown, i: number) =>
        (pagination.current - 1) * PAGE_SIZE + i + 1,
    },
    { title: '工作流代码', dataIndex: 'workflowCode', key: 'workflowCode' },
    { title: '当前节点', dataIndex: 'currentNode', key: 'currentNode' },
    { title: '通过节点', dataIndex: 'resolvedNode', key: 'resolvedNode' },
    { title: '驳回节点', dataIndex: 'rejectNode', key: 'rejectNode' },
    {
      title: '审批角色',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (roleId: string) => {
        const role = roles.find((r) => r.id === roleId);
        return role ? <Tag>{role.name}</Tag> : roleId;
      },
    },
    {
      title: '操作',
      width: 150,
      render: (_: unknown, record: TransitionItem) => (
        <>
          <a style={{ marginRight: 16 }} onClick={() => openEdit(record)}>编辑</a>
          <Popconfirm
            title="确认删除该转换规则？"
            onConfirm={() => handleDelete(record.id!)}
            okText="确认"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Select
          placeholder="筛选工作流"
          allowClear
          style={{ width: 240 }}
          options={workflowOptions.map((w) => ({ value: w.code, label: `${w.name}（${w.code}）` }))}
          onChange={(v) => setWorkflowCode(v)}
        />
        <Button type="primary" onClick={openCreate}>+ 新增转换规则</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" bordered pagination={false} />
      <Pagination
        style={{ marginTop: 16 }}
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        showTotal={(t) => `共 ${t} 条`}
        onChange={(page) => fetchList(page)}
      />
      <Modal
        title={editRecord ? '编辑转换规则' : '新增转换规则'}
        open={modalOpen}
        footer={null}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} onFinish={handleSubmit}>
          <Form.Item label="所属工作流" name="workflowCode" rules={[{ required: true, message: '请选择工作流' }]}>
            <Select
              placeholder="请选择工作流"
              options={workflowOptions.map((w) => ({ value: w.code, label: `${w.name}（${w.code}）` }))}
              onChange={(v) => fetchNodes(v)}
            />
          </Form.Item>
          <Form.Item label="当前节点" name="currentNode" rules={[{ required: true, message: '请选择当前节点' }]}>
            <Select
              placeholder="请选择当前节点"
              options={nodeOptions.map((n) => ({ value: n.code, label: `${n.name}（${n.code}）` }))}
            />
          </Form.Item>
          <Form.Item label="通过后跳转节点" name="resolvedNode">
            <Select
              placeholder="审批通过后的下一节点"
              allowClear
              options={nodeOptions.map((n) => ({ value: n.code, label: `${n.name}（${n.code}）` }))}
            />
          </Form.Item>
          <Form.Item label="驳回后跳转节点" name="rejectNode">
            <Select
              placeholder="审批驳回后的跳转节点"
              allowClear
              options={nodeOptions.map((n) => ({ value: n.code, label: `${n.name}（${n.code}）` }))}
            />
          </Form.Item>
          <Form.Item label="审批角色" name="roleId">
            <Select
              placeholder="请选择审批角色"
              allowClear
              options={roles.map((r) => ({ value: r.id, label: r.name }))}
            />
          </Form.Item>
          <Form.Item label={null}>
            <div style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 8 }} onClick={() => setModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">提交</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// ─────────────────────────────────────────────
// 审批日志 Tab
// ─────────────────────────────────────────────
const LogTab = ({ workflowOptions }: { workflowOptions: WorkflowItem[] }) => {
  const [workflowCode, setWorkflowCode] = useState<string | undefined>();
  const [recordId, setRecordId] = useState<string | undefined>();
  const [data, setData] = useState<LogItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE, total: 0 });

  const fetchList = async (page = 1) => {
    try {
      const res = await systemApi.listSystemWorkflowLog({
        workflowCode,
        recordId: recordId || undefined,
        page,
        size: PAGE_SIZE,
      });
      setData(res.records ?? []);
      setPagination((p) => ({ ...p, current: res.page ?? 1, total: res.total ?? 0 }));
    } catch {
      message.error('获取日志列表失败');
    }
  };

  useEffect(() => {
    fetchList(1);
  }, [workflowCode, recordId]);

  const columns = [
    {
      title: '序号',
      width: 60,
      render: (_: unknown, __: unknown, i: number) =>
        (pagination.current - 1) * PAGE_SIZE + i + 1,
    },
    { title: '工作流代码', dataIndex: 'workflowCode', key: 'workflowCode' },
    { title: '记录ID', dataIndex: 'recordId', key: 'recordId' },
    { title: '节点代码', dataIndex: 'nodeCode', key: 'nodeCode' },
    { title: '审批人', dataIndex: 'userName', key: 'userName' },
    {
      title: '审批结果',
      dataIndex: 'result',
      key: 'result',
      render: (v: boolean) =>
        v ? <Tag color="green">通过</Tag> : <Tag color="red">驳回</Tag>,
    },
    { title: '审批意见', dataIndex: 'content', key: 'content', ellipsis: true },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Select
          placeholder="筛选工作流"
          allowClear
          style={{ width: 240 }}
          options={workflowOptions.map((w) => ({ value: w.code, label: `${w.name}（${w.code}）` }))}
          onChange={(v) => setWorkflowCode(v)}
        />
        <Input
          placeholder="按记录ID筛选"
          allowClear
          style={{ width: 200 }}
          onPressEnter={(e) => setRecordId((e.target as HTMLInputElement).value || undefined)}
          onChange={(e) => { if (!e.target.value) setRecordId(undefined); }}
        />
        <Button onClick={() => fetchList(1)}>查询</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" bordered pagination={false} />
      <Pagination
        style={{ marginTop: 16 }}
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        showTotal={(t) => `共 ${t} 条`}
        onChange={(page) => fetchList(page)}
      />
    </>
  );
};

// ─────────────────────────────────────────────
// 主页面
// ─────────────────────────────────────────────
const WorkflowManage = () => {
  const [workflowOptions, setWorkflowOptions] = useState<WorkflowItem[]>([]);

  const tabItems = [
    {
      key: 'workflow',
      label: '工作流管理',
      children: <WorkflowTab onWorkflowListChange={setWorkflowOptions} />,
    },
    {
      key: 'node',
      label: '节点管理',
      children: <NodeTab workflowOptions={workflowOptions} />,
    },
    {
      key: 'transition',
      label: '转换规则',
      children: <TransitionTab workflowOptions={workflowOptions} />,
    },
    {
      key: 'log',
      label: '审批日志',
      children: <LogTab workflowOptions={workflowOptions} />,
    },
  ];

  return (
    <PageContainer
      style={{ height: '90vh', overflow: 'scroll' }}
      content="管理系统中的工作流定义、审批节点、转换规则及审批日志"
    >
      <Tabs defaultActiveKey="workflow" items={tabItems} />
    </PageContainer>
  );
};

export default WorkflowManage;
