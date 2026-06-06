import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

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

const formatDateCell = (v: unknown) => {
  if (v === null || v === undefined || v === '') return '-';
  try {
    return dayjs(v as string | Date).format('YYYY-MM-DD');
  } catch {
    return String(v);
  }
};

type BuildColumnsOptions = {
  onDetail: (record: any) => void;
  onSign: (record: any) => void;
};

export function buildColumns({ onDetail, onSign }: BuildColumnsOptions): ColumnsType<any> {
  return [
    {
      title: <TitleCom text="序号" icon="/mg/icon1.png" />,
      width: 70,
      align: 'center',
      render: (_: unknown, _record: unknown, index: number) => index + 1,
    },
    {
      title: <TitleCom text="项目名称" icon="/mg/icon6.png" />,
      dataIndex: 'projectName',
      align: 'left',
      ellipsis: true,
      width: 160,
    },
    {
      title: <TitleCom text="项目内容" icon="/mg/icon7.png" />,
      dataIndex: 'projectContent',
      align: 'left',
      width: 160,
      ellipsis: true,
    },
    {
      title: <TitleCom text="项目类别" icon="/mg/icon2.png" />,
      dataIndex: 'investmentFlagLabel',
      align: 'center',
      width: 88,
    },
    {
      title: <TitleCom text="项目状态" icon="/mg/icon5.png" />,
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
      title: <TitleCom text="投资额" icon="/mg/icon2.png" />,
      dataIndex: 'investmentAmount',
      align: 'center',
      width: 120,
      render: (_: unknown, record: any) => {
        const isForeign = record.investmentFlagLabel === '外资';
        const value = isForeign ? record.totalInvestmentUsd : record.totalInvestmentCny;
        const unit = isForeign ? '亿美元' : '亿元';
        return value != null ? `${Number(value).toFixed(2)}${unit}` : '-';
      },
    },
    {
      title: <TitleCom text="所属市（区）" icon="/mg/icon2.png" />,
      dataIndex: 'districtName',
      align: 'center',
      ellipsis: true,
      width: 110,
    },
    {
      title: <TitleCom text="所属板块" icon="/mg/icon2.png" />,
      dataIndex: 'parkName',
      align: 'center',
      ellipsis: true,
      width: 110,
    },
    {
      title: <TitleCom text="签约时间" icon="/mg/icon2.png" />,
      dataIndex: 'actualSigningTime',
      align: 'center',
      width: 110,
      render: (_: unknown, r: any) => formatDateCell(r?.actualSigningTime ?? r?.signingTime),
    },
    {
      title: <TitleCom text="签约统计时间" icon="/mg/icon2.png" />,
      dataIndex: 'signingStatisticsTime',
      align: 'center',
      width: 110,
      render: (_: unknown, r: any) => formatDateCell(r?.signingStatisticsTime ?? r?.signingTime),
    },
    {
      title: <TitleCom text="申请时间" icon="/mg/icon2.png" />,
      dataIndex: 'signingApplyTime',
      align: 'center',
      ellipsis: true,
      width: 110,
      render: (text: any) => formatDateCell(text),
    },
    {
      title: <TitleCom text="审核状态" icon="/mg/icon2.png" />,
      dataIndex: 'auditStatusqyLabel',
      align: 'center',
      ellipsis: true,
      width: 100,
    },
    {
      title: <TitleCom text="操作" icon="/mg/icon2.png" />,
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (_text: any, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <ActionBtn label="详情" onClick={() => onDetail(record)} />
          <ActionBtn label="签约核定" onClick={() => onSign(record)} />
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
