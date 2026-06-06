import type { ColumnsType } from 'antd/es/table';

function TitleCom({ text, icon }: { text: string; icon?: string }) {
  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon?.trim() ? <img style={{ width: 10, marginRight: 5 }} src={icon} alt="" /> : null}
      <div>{text}</div>
    </div>
  );
}

type BuildColumnsOptions = {
  onDetail: (record: any) => void;
  onQualityEval: (record: any) => void;
};

export function buildColumns({ onDetail, onQualityEval }: BuildColumnsOptions): ColumnsType<any> {
  return [
    {
      title: <TitleCom text="序号" icon="/mg/icon1.png" />,
      width: 80,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: <TitleCom text="项目名称" icon="/mg/icon6.png" />,
      dataIndex: 'projectName',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text="项目内容" icon="/mg/icon7.png" />,
      dataIndex: 'projectContent',
      align: 'left',
      width: 200,
      ellipsis: true,
      render: (text: any) => (
        <span style={{ textAlign: 'left' }} title={text}>{text}</span>
      ),
    },
    {
      title: <TitleCom text="所属板块" icon="/mg/icon2.png" />,
      dataIndex: 'parkName',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text="评估状态" icon="/mg/icon2.png" />,
      dataIndex: 'auditStatus',
      align: 'center',
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text="操作" icon="/mg/icon2.png" />,
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <ActionBtn label="详情" onClick={() => onDetail(record)} />
          <ActionBtn label="质态评估" onClick={() => onQualityEval(record)} />
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 8px',
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
