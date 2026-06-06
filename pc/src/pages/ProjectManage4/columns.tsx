import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const progressTagColor: Record<string, string> = {
  在谈: '#FF7F50',
  签约: '#3CB371',
  注册: '#4169E1',
  备案: '#9370DB',
  开工: '#FF4500',
  报批: '#FF4500',
  竣工: '#708090',
};

type BuildColumnsOptions = {
  onDetail: (record: any) => void;
  onSignApproval: (record: any) => void;
  onStartApproval: (record: any) => void;
  onShowScore: (record: any) => void;
};

export function buildColumns({
  onDetail,
  onSignApproval,
  onStartApproval,
  onShowScore,
}: BuildColumnsOptions): ColumnsType<any> {
  return [
    {
      title: '序号',
      width: 80,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '项目内容',
      dataIndex: 'projectContent',
      align: 'left',
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <span style={{ textAlign: 'left' }} title={text}>
          {text}
        </span>
      ),
    },
    {
      title: '所属板块',
      dataIndex: 'parkName',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: '项目状态',
      dataIndex: 'currentProjectProgressLabel',
      align: 'center',
      width: 100,
      render: (text: string) => {
        if (!text) return <Tag color="blue">-</Tag>;
        const color =
          Object.entries(progressTagColor).find(([k]) => text.includes(k))?.[1] ?? 'blue';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '项目得分',
      align: 'center',
      width: 100,
      render: (_: any, record: any) => {
        const score = record.projectScore ?? 0;
        return (
          <span
            style={{ color: '#1890FF', cursor: 'pointer' }}
            onClick={() => onShowScore(record)}
          >
            {score.toFixed(2)}
          </span>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 300,
      fixed: 'right',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <ActionBtn label="详情" onClick={() => onDetail(record)} />
          <ActionBtn label="签约核定" onClick={() => onSignApproval(record)} />
          <ActionBtn label="开工认定" onClick={() => onStartApproval(record)} />
        </div>
      ),
    },
  ];
}

function ActionBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        height: 28,
        background: '#1890FF',
        borderRadius: 14,
        fontSize: 14,
        color: '#fff',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      <img style={{ width: 15, marginLeft: 3 }} src="/mg/more.png" alt="" />
    </div>
  );
}
