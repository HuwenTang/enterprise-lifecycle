import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const TAG_COLORS = [
  '#1890FF', '#52C41A', '#722ED1', '#FA8C16', '#EB2F96',
  '#13C2C2', '#FAAD14', '#2F54EB', '#FF7A45', '#73D13D',
];

const progressTagColor: Record<string, string> = {
  在谈: '#FF7F50',
  签约: '#3CB371',
  注册: '#4169E1',
  备案: '#9370DB',
  开工: '#FF4500',
  报批: '#FF4500',
  竣工: '#708090',
};

function TitleCom({ text, icon }: { text: string; icon?: string }) {
  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon?.trim() ? <img style={{ width: 10, marginRight: 5 }} src={icon} alt="" /> : null}
      <div>{text}</div>
    </div>
  );
}

function isZzkcProjectSource(record: any): boolean {
  const source = String(record?.projectSource ?? record?.source ?? '').trim();
  return source === '增资扩产';
}

type BuildColumnsOptions = {
  pagination: { current: number };
  onDetail: (record: any) => void;
  /** 项目来源为「增资扩产」时的详情跳转（ProjectManage7 / pro-other-start） */
  onDetailZzkc?: (record: any) => void;
  onApply: (record: any) => void;
  onEditLt: (record: any) => void;
};

export function buildColumns({
  pagination,
  onDetail,
  onDetailZzkc,
  onApply,
  onEditLt,
}: BuildColumnsOptions): ColumnsType<any> {
  return [
    {
      title: <TitleCom text="序号" />,
      width: 80,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: <TitleCom text="项目名称" />,
      dataIndex: 'projectName',
      align: 'left',
      width: 150,
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <span
          style={{ display: 'block', width: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={text}
        >
          {text}
        </span>
      ),
    },
    {
      title: <TitleCom text="项目属性" />,
      dataIndex: 'projectAttributeList',
      align: 'center',
      width: 120,
      render: (_: unknown, record: any) => {
        const list: string[] = (Array.isArray(record?.projectAttributeList) ? record.projectAttributeList : [])
          .filter((x: unknown) => x !== null && x !== undefined && String(x).trim() !== '');
        if (!list.length) return '-';
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {list.map((txt, idx) => (
              <Tag
                key={`${txt}-${idx}`}
                color={String(txt).trim() === '市重点' ? 'red' : TAG_COLORS[idx % TAG_COLORS.length]}
              >
                {String(txt)}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: <TitleCom text="所属板块" />,
      dataIndex: 'parkName',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text="项目来源" />,
      dataIndex: 'projectSource',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (_: unknown, record: any) => record?.projectSource ?? record?.source ?? '-',
    },
    {
      title: <TitleCom text="项目状态" />,
      dataIndex: 'currentProjectProgressLabel',
      align: 'center',
      width: 150,
      render: (text: string) => {
        if (!text) return <Tag color="blue">-</Tag>;
        const color = Object.entries(progressTagColor).find(([k]) => text.includes(k))?.[1] ?? 'blue';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: <TitleCom text="投资额" />,
      dataIndex: 'investmentAmount',
      align: 'center',
      width: 150,
      render: (_: any, record: any) => {
        const isForeign = record.investmentFlagLabel === '外资';
        const value = isForeign ? record.totalInvestmentUsd : record.totalInvestmentCny;
        const unit = isForeign ? '亿美元' : '亿元';
        return value != null ? `${Number(value).toFixed(2)}${unit}` : '-';
      },
    },
    {
      title: <TitleCom text="项目简介" />,
      dataIndex: 'projectContent',
      align: 'left',
      width: 300,
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <span
          style={{ display: 'block', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={text}
        >
          {text}
        </span>
      ),
    },
    {
      title: <TitleCom text="是否列统" />,
      dataIndex: 'isLt',
      align: 'center',
      width: 100,
      render: (val: any) => (val === true ? '是' : val === false ? '否' : '-'),
    },
    {
      title: <TitleCom text="操作" />,
      align: 'center',
      width: 380,
      minWidth: 280,
      fixed: 'right',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <ActionBtn
            label="详情"
            onClick={() => {
              if (isZzkcProjectSource(record) && onDetailZzkc) {
                onDetailZzkc(record);
              } else {
                onDetail(record);
              }
            }}
          />
          {record?.isFilled !== true && (
            <ActionBtn label="申报重点项目" onClick={() => onApply(record)} />
          )}
          <ActionBtn label="编辑列统" onClick={() => onEditLt(record)} />
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
