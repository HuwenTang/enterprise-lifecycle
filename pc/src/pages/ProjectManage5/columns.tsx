import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

type BuildColumnsOptions = {
  pagination: { current: number; pageSize: number };
  onDetail: (record: any) => void;
  onStartApproval: (record: any) => void;
};

export function buildColumns({
  pagination,
  onDetail,
  onStartApproval,
}: BuildColumnsOptions): ColumnsType<any> {
  return [
    {
      title: '序号',
      width: 80,
      align: 'center',
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
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
    },
    {
      title: '所属板块',
      dataIndex: 'parkName',
      align: 'center',
      ellipsis: true,
      width: 120,
    },
    {
      title: '项目来源',
      dataIndex: 'source',
      align: 'center',
      ellipsis: true,
      width: 120,
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatusKaigongLabel',
      align: 'center',
      ellipsis: true,
      width: 120,
    },
    {
      title: '申请时间',
      dataIndex: 'startApplyTime',
      align: 'center',
      ellipsis: true,
      width: 120,
      render: (text: string) => (text ? dayjs(text).format('YYYY-MM-DD') : '-'),
    },
    {
      title: '操作',
      align: 'center',
      width: 180,
      fixed: 'right',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <ActionBtn label="详情" onClick={() => onDetail(record)} />
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
