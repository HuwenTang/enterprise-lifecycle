import { Graph, Shape } from '@antv/x6';
import { Button, Form, Input, message, Modal, Select, Space, Tag, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { systemApi } from '@/services/api';

type WorkflowItem = { id?: string; code?: string; name?: string };
type NodeItem = { id?: string; workflowCode?: string; code?: string; name?: string };
type TransitionItem = {
  id?: string;
  workflowCode?: string;
  currentNode?: string;
  resolvedNode?: string;
  rejectNode?: string;
  roleId?: string;
};
type RoleItem = { id?: string; name?: string };

type Position = { x: number; y: number };
type LayoutMap = Record<string, Position>;

const layoutKey = (workflowCode: string) => `workflow-layout:${workflowCode}`;

const loadLayout = (workflowCode: string): LayoutMap => {
  try {
    const raw = localStorage.getItem(layoutKey(workflowCode));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveLayout = (workflowCode: string, layout: LayoutMap) => {
  localStorage.setItem(layoutKey(workflowCode), JSON.stringify(layout));
};

// 自动布局：左→右网格排列没有坐标的节点，跳过被占用的网格
const COL_WIDTH = 220;
const ROW_HEIGHT = 140;
const COLS = 4;
const START_X = 80;
const START_Y = 80;

const autoLayout = (nodes: NodeItem[], layout: LayoutMap): LayoutMap => {
  const next = { ...layout };
  const usedCells = new Set<string>();
  Object.values(next).forEach((pos) => {
    const col = Math.round((pos.x - START_X) / COL_WIDTH);
    const row = Math.round((pos.y - START_Y) / ROW_HEIGHT);
    usedCells.add(`${row},${col}`);
  });
  const unpositioned = nodes.filter((n) => n.code && !next[n.code]);
  let cellIndex = 0;
  unpositioned.forEach((n) => {
    let col: number;
    let row: number;
    let key: string;
    do {
      col = cellIndex % COLS;
      row = Math.floor(cellIndex / COLS);
      key = `${row},${col}`;
      cellIndex++;
    } while (usedCells.has(key));
    usedCells.add(key);
    next[n.code!] = { x: START_X + col * COL_WIDTH, y: START_Y + row * ROW_HEIGHT };
  });
  return next;
};

interface WorkflowDesignerProps {
  open: boolean;
  workflow: WorkflowItem | null;
  onClose: () => void;
}

const WorkflowDesigner = ({ open, workflow, onClose }: WorkflowDesignerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const nodeMapRef = useRef<Map<string, NodeItem>>(new Map());
  const transitionsRef = useRef<TransitionItem[]>([]);

  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [nodeFormOpen, setNodeFormOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<NodeItem | null>(null);
  const [edgeFormOpen, setEdgeFormOpen] = useState(false);
  const [pendingEdge, setPendingEdge] = useState<{
    source: string;
    target: string;
    edgeId: string;
  } | null>(null);
  const [transitionFormOpen, setTransitionFormOpen] = useState(false);
  const [editingTransition, setEditingTransition] = useState<TransitionItem | null>(null);

  const [nodeForm] = Form.useForm();
  const [edgeForm] = Form.useForm();
  const [transitionForm] = Form.useForm();

  // 点击节点右上角 ×：从画布移除并删除后端节点
  const handleRemoveNodeFromCanvas = (code: string) => {
    const item = nodeMapRef.current.get(code);
    if (!item) return;
    Modal.confirm({
      title: `确认移除节点「${item.name ?? code}」？`,
      content: '节点将从画布删除，关联连线一并移除，相关转换规则可能失效。',
      okType: 'danger',
      okText: '移除',
      onOk: async () => {
        if (!workflow?.code) return;
        try {
          if (item.id) {
            await systemApi.deleteSystemWorkflowNode({ id: item.id });
          }
          const layout = loadLayout(workflow.code);
          delete layout[code];
          saveLayout(workflow.code, layout);
          message.success('节点已移除');
          await loadAll();
        } catch {
          message.error('移除节点失败');
        }
      },
    });
  };

  // ── 初始化 X6 图（在 Modal 完全打开后调用） ──────────
  const initGraph = () => {
    if (!containerRef.current || !workflow?.code || graphRef.current) return;

    const { clientWidth, clientHeight } = containerRef.current;
    const graph = new Graph({
      container: containerRef.current,
      width: clientWidth,
      height: clientHeight,
      grid: true,
      background: { color: '#f7f8fa' },
      panning: { enabled: true, modifiers: 'shift' },
      mousewheel: { enabled: true, modifiers: 'ctrl', minScale: 0.4, maxScale: 2 },
      connecting: {
        router: 'manhattan',
        connector: { name: 'rounded', args: { radius: 8 } },
        snap: true,
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        highlight: true,
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#5F95FF',
                strokeWidth: 2,
                targetMarker: { name: 'block', width: 10, height: 8 },
              },
            },
            zIndex: 0,
          });
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: { attrs: { fill: '#fff', stroke: '#5F95FF', strokeWidth: 4 } },
        },
      },
    });

    // 节点双击 → 编辑节点
    graph.on('node:dblclick', ({ node }) => {
      const code = node.id;
      const item = nodeMapRef.current.get(code);
      if (item) {
        setEditingNode(item);
        nodeForm.setFieldsValue({ code: item.code, name: item.name });
        setNodeFormOpen(true);
      }
    });

    // 创建连线 → 弹出转换规则表单
    graph.on('edge:connected', ({ isNew, edge }) => {
      if (!isNew) return;
      const source = edge.getSourceCellId();
      const target = edge.getTargetCellId();
      if (!source || !target) {
        edge.remove();
        return;
      }
      setPendingEdge({ source, target, edgeId: edge.id });
      edgeForm.resetFields();
      edgeForm.setFieldValue('kind', 'resolved');
      setEdgeFormOpen(true);
    });

    // 双击连线 → 编辑转换规则
    graph.on('edge:dblclick', ({ edge }) => {
      const tId = edge.getData()?.transitionId as string | undefined;
      if (!tId) return;
      const t = transitionsRef.current.find((x) => x.id === tId);
      if (!t) return;
      setEditingTransition(t);
      transitionForm.setFieldsValue(t);
      setTransitionFormOpen(true);
    });

    // 拖拽节点结束 → 保存坐标
    graph.on('node:moved', ({ node }) => {
      if (!workflow.code) return;
      const layout = loadLayout(workflow.code);
      const pos = node.getPosition();
      layout[node.id] = { x: pos.x, y: pos.y };
      saveLayout(workflow.code, layout);
    });

    graphRef.current = graph;
    loadAll();
  };

  const disposeGraph = () => {
    graphRef.current?.dispose();
    graphRef.current = null;
  };

  // Modal 关闭时清理；workflow 切换时也清理旧画布
  useEffect(() => {
    return () => {
      disposeGraph();
    };
  }, [workflow?.code]);

  // ── 拉取节点、转换、角色并绘制 ────────────────────
  const loadAll = async () => {
    if (!workflow?.code || !graphRef.current) return;
    try {
      const [nodeRes, transRes, roleRes] = await Promise.all([
        systemApi.listSystemWorkflowNode({ workflowCode: workflow.code, page: 1, size: 999 }),
        systemApi.listSystemWorkflowTransition({ workflowCode: workflow.code, page: 1, size: 999 }),
        systemApi.listRole({ page: 1, size: 999 }),
      ]);
      const nodes = nodeRes.records ?? [];
      const transitions = transRes.records ?? [];
      setRoles(roleRes.records ?? []);

      nodeMapRef.current = new Map(nodes.map((n) => [n.code!, n]));
      transitionsRef.current = transitions;

      let layout = loadLayout(workflow.code);
      layout = autoLayout(nodes, layout);
      saveLayout(workflow.code, layout);

      renderGraph(nodes, transitions, layout);
    } catch {
      message.error('加载流程数据失败');
    }
  };

  const renderGraph = (nodes: NodeItem[], transitions: TransitionItem[], layout: LayoutMap) => {
    const graph = graphRef.current;
    if (!graph) return;

    // 按 code 去重，避免重复渲染
    const uniqueNodes = Array.from(
      new Map(nodes.filter((n) => !!n.code).map((n) => [n.code!, n])).values(),
    );
    // 按 id 去重 transitions
    const uniqueTransitions = Array.from(
      new Map(transitions.filter((t) => !!t.id).map((t) => [t.id!, t])).values(),
    );

    const nodeCells = uniqueNodes.map((n) => {
      const pos = layout[n.code!] ?? { x: 100, y: 100 };
      return graph.createNode({
        id: n.code,
        x: pos.x,
        y: pos.y,
        width: 160,
        height: 60,
        shape: 'rect',
        label: n.name ?? n.code,
        attrs: {
          body: {
            rx: 8,
            ry: 8,
            stroke: '#5F95FF',
            fill: '#EFF4FF',
            strokeWidth: 1.5,
          },
          label: { fontSize: 14, fill: '#262626' },
        },
        ports: {
          groups: {
            port: {
              position: 'absolute',
              attrs: {
                circle: { r: 4, magnet: true, stroke: '#5F95FF', fill: '#fff', strokeWidth: 1 },
              },
            },
          },
          items: [
            { id: 'top', group: 'port', args: { x: 80, y: 0 } },
            { id: 'right', group: 'port', args: { x: 160, y: 30 } },
            { id: 'bottom', group: 'port', args: { x: 80, y: 60 } },
            { id: 'left', group: 'port', args: { x: 0, y: 30 } },
          ],
        },
        tools: [
          {
            name: 'button-remove',
            args: {
              x: '100%',
              y: 0,
              offset: { x: -10, y: 10 },
              onClick: ({ cell }: { cell: { id: string } }) => {
                handleRemoveNodeFromCanvas(cell.id);
              },
            },
          },
        ],
      });
    });

    const edgeCells = uniqueTransitions.flatMap((t) => {
      const edges = [];
      if (t.currentNode && t.resolvedNode) {
        edges.push(
          graph.createEdge({
            source: { cell: t.currentNode },
            target: { cell: t.resolvedNode },
            attrs: {
              line: {
                stroke: '#52c41a',
                strokeWidth: 2,
                targetMarker: { name: 'block', width: 10, height: 8 },
              },
            },
            labels: [{ attrs: { label: { text: '通过', fill: '#52c41a' } } }],
            data: { transitionId: t.id, branch: 'resolved' },
            zIndex: 0,
          }),
        );
      }
      if (t.currentNode && t.rejectNode) {
        edges.push(
          graph.createEdge({
            source: { cell: t.currentNode },
            target: { cell: t.rejectNode },
            attrs: {
              line: {
                stroke: '#ff4d4f',
                strokeWidth: 2,
                strokeDasharray: '5 5',
                targetMarker: { name: 'block', width: 10, height: 8 },
              },
            },
            labels: [{ attrs: { label: { text: '驳回', fill: '#ff4d4f' } } }],
            data: { transitionId: t.id, branch: 'reject' },
            zIndex: 0,
          }),
        );
      }
      return edges;
    });

    // 原子替换画布，避免 clear + add 时旧节点残留
    graph.resetCells([...nodeCells, ...edgeCells]);

    // 渲染完成后把视口对到内容，避免节点在画布之外
    if (uniqueNodes.length > 0) {
      requestAnimationFrame(() => {
        try {
          graph.zoomToFit({ padding: 40, maxScale: 1 });
        } catch {
          graph.centerContent();
        }
      });
    }
  };

  // ── 工具栏：新增节点 ─────────────────────────────
  const handleAddNode = () => {
    setEditingNode(null);
    nodeForm.resetFields();
    setNodeFormOpen(true);
  };

  const handleNodeSubmit = async (values: { code: string; name: string }) => {
    if (!workflow?.code) return;
    try {
      if (editingNode?.id) {
        await systemApi.updateSystemWorkflowNode({
          id: editingNode.id,
          systemWorkflowNodeDto: { ...values, workflowCode: workflow.code },
        });
        message.success('节点已修改');
      } else {
        await systemApi.createSystemWorkflowNode({
          systemWorkflowNodeDto: { ...values, workflowCode: workflow.code },
        });
        message.success('节点已创建');
      }
      setNodeFormOpen(false);
      await loadAll();
    } catch {
      message.error('保存节点失败');
    }
  };

  const handleNodeDelete = async () => {
    if (!editingNode?.id) return;
    Modal.confirm({
      title: `确认删除节点 "${editingNode.name}"？`,
      content: '关联的转换规则可能失效，请谨慎操作。',
      okType: 'danger',
      onOk: async () => {
        try {
          await systemApi.deleteSystemWorkflowNode({ id: editingNode.id! });
          // 同步删除本地坐标
          if (workflow?.code && editingNode.code) {
            const layout = loadLayout(workflow.code);
            delete layout[editingNode.code];
            saveLayout(workflow.code, layout);
          }
          message.success('节点已删除');
          setNodeFormOpen(false);
          await loadAll();
        } catch {
          message.error('删除节点失败');
        }
      },
    });
  };

  // ── 连线创建 → 保存为转换规则 ─────────────────────
  const handleEdgeSubmit = async (values: { kind: 'resolved' | 'reject'; roleId?: string }) => {
    if (!pendingEdge || !workflow?.code) return;
    const { source, target } = pendingEdge;
    try {
      // 查找当前节点是否已有 transition 记录，若有则合并字段
      const existing = transitionsRef.current.find((t) => t.currentNode === source);
      const dto: TransitionItem = {
        workflowCode: workflow.code,
        currentNode: source,
        resolvedNode: values.kind === 'resolved' ? target : existing?.resolvedNode,
        rejectNode: values.kind === 'reject' ? target : existing?.rejectNode,
        roleId: values.roleId ?? existing?.roleId,
      };
      if (existing?.id) {
        await systemApi.updateSystemWorkflowTransition({
          id: existing.id,
          systemWorkflowTransitionDto: dto,
        });
      } else {
        await systemApi.createSystemWorkflowTransition({ systemWorkflowTransitionDto: dto });
      }
      message.success('转换规则已保存');
      setEdgeFormOpen(false);
      setPendingEdge(null);
      await loadAll();
    } catch {
      message.error('保存转换规则失败');
      // 移除前端临时连线
      graphRef.current?.removeCell(pendingEdge.edgeId);
      setEdgeFormOpen(false);
      setPendingEdge(null);
    }
  };

  const handleEdgeCancel = () => {
    if (pendingEdge) {
      graphRef.current?.removeCell(pendingEdge.edgeId);
    }
    setEdgeFormOpen(false);
    setPendingEdge(null);
  };

  // ── 双击连线编辑转换规则 ─────────────────────────
  const handleTransitionSubmit = async (values: TransitionItem) => {
    if (!editingTransition?.id) return;
    try {
      await systemApi.updateSystemWorkflowTransition({
        id: editingTransition.id,
        systemWorkflowTransitionDto: { ...editingTransition, ...values },
      });
      message.success('转换规则已修改');
      setTransitionFormOpen(false);
      await loadAll();
    } catch {
      message.error('保存失败');
    }
  };

  const handleTransitionDelete = async () => {
    if (!editingTransition?.id) return;
    Modal.confirm({
      title: '确认删除该转换规则？',
      okType: 'danger',
      onOk: async () => {
        try {
          await systemApi.deleteSystemWorkflowTransition({ id: editingTransition.id! });
          message.success('已删除');
          setTransitionFormOpen(false);
          await loadAll();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const handleAutoLayout = () => {
    if (!workflow?.code) return;
    // 用最新数据，并按 code 去重
    const uniqueNodes = Array.from(nodeMapRef.current.values()).filter((n) => !!n.code);
    const fresh: LayoutMap = {};
    uniqueNodes.forEach((n, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      fresh[n.code!] = { x: START_X + col * COL_WIDTH, y: START_Y + row * ROW_HEIGHT };
    });
    saveLayout(workflow.code, fresh);
    renderGraph(uniqueNodes, transitionsRef.current, fresh);
    message.success('已自动布局');
  };

  return (
    <>
      <Modal
        title={`可视化设计 — ${workflow?.name ?? ''}`}
        open={open}
        onCancel={onClose}
        footer={null}
        width={1100}
        centered
        destroyOnHidden
        styles={{ body: { height: 600, overflow: 'hidden' } }}
        afterOpenChange={(visible) => {
          if (visible) {
            // Modal 完全打开后再初始化画布，确保 container 已挂载且尺寸已计算
            initGraph();
          } else {
            disposeGraph();
          }
        }}
      >
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button type="primary" onClick={handleAddNode}>+ 新增节点</Button>
            <Button onClick={handleAutoLayout}>自动布局</Button>
            <Button onClick={loadAll}>刷新</Button>
          </Space>
          <Space size={4}>
            <Tooltip title="拖动节点 = 移动；Shift+拖动 = 平移画布；Ctrl+滚轮 = 缩放">
              <Tag color="blue">操作提示</Tag>
            </Tooltip>
            <Tag color="green">绿线 = 通过</Tag>
            <Tag color="red">红色虚线 = 驳回</Tag>
            <Tag>双击节点/连线编辑</Tag>
            <Tag>点击节点右上角 × 可移除</Tag>
          </Space>
        </div>
        <div
          ref={containerRef}
          style={{
            width: '100%',
            height: 520,
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        />
      </Modal>

      {/* 节点编辑表单 */}
      <Modal
        title={editingNode ? '编辑节点' : '新增节点'}
        open={nodeFormOpen}
        footer={null}
        onCancel={() => setNodeFormOpen(false)}
        destroyOnHidden
      >
        <Form form={nodeForm} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={handleNodeSubmit}>
          <Form.Item
            label="节点代码"
            name="code"
            rules={[{ required: true, message: '请输入节点代码' }]}
          >
            <Input disabled={!!editingNode} placeholder="例如：DEPT_REVIEW" />
          </Form.Item>
          <Form.Item
            label="节点名称"
            name="name"
            rules={[{ required: true, message: '请输入节点名称' }]}
          >
            <Input placeholder="例如：部门审核" />
          </Form.Item>
          <Form.Item label={null}>
            <div style={{ textAlign: 'right' }}>
              {editingNode && (
                <Button danger style={{ marginRight: 'auto', float: 'left' }} onClick={handleNodeDelete}>
                  删除
                </Button>
              )}
              <Button style={{ marginRight: 8 }} onClick={() => setNodeFormOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">提交</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 新建连线 → 选分支 + 角色 */}
      <Modal
        title="新增转换规则"
        open={edgeFormOpen}
        footer={null}
        onCancel={handleEdgeCancel}
        destroyOnHidden
      >
        <Form form={edgeForm} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={handleEdgeSubmit}>
          <Form.Item label="分支类型" name="kind" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'resolved', label: '审批通过 → 流转到目标节点' },
                { value: 'reject', label: '审批驳回 → 流转到目标节点' },
              ]}
            />
          </Form.Item>
          <Form.Item label="审批角色" name="roleId">
            <Select
              placeholder="可选，控制由谁审批"
              allowClear
              options={roles.map((r) => ({ value: r.id, label: r.name }))}
            />
          </Form.Item>
          <Form.Item label={null}>
            <div style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 8 }} onClick={handleEdgeCancel}>取消</Button>
              <Button type="primary" htmlType="submit">保存</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 双击连线编辑转换规则 */}
      <Modal
        title="编辑转换规则"
        open={transitionFormOpen}
        footer={null}
        onCancel={() => setTransitionFormOpen(false)}
        destroyOnHidden
      >
        <Form form={transitionForm} labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} onFinish={handleTransitionSubmit}>
          <Form.Item label="当前节点" name="currentNode">
            <Input disabled />
          </Form.Item>
          <Form.Item label="通过后跳转" name="resolvedNode">
            <Select
              allowClear
              options={Array.from(nodeMapRef.current.values()).map((n) => ({
                value: n.code,
                label: `${n.name}（${n.code}）`,
              }))}
            />
          </Form.Item>
          <Form.Item label="驳回后跳转" name="rejectNode">
            <Select
              allowClear
              options={Array.from(nodeMapRef.current.values()).map((n) => ({
                value: n.code,
                label: `${n.name}（${n.code}）`,
              }))}
            />
          </Form.Item>
          <Form.Item label="审批角色" name="roleId">
            <Select
              allowClear
              options={roles.map((r) => ({ value: r.id, label: r.name }))}
            />
          </Form.Item>
          <Form.Item label={null}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button danger onClick={handleTransitionDelete}>删除</Button>
              <div>
                <Button style={{ marginRight: 8 }} onClick={() => setTransitionFormOpen(false)}>取消</Button>
                <Button type="primary" htmlType="submit">保存</Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WorkflowDesigner;
