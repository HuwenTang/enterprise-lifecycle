import { Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useMemo } from 'react';
import type { CenterDashboardCenter } from './mock';

const PRIMARY = '#005BF5';
const HEADER_BG = '#E8F4FF';
const TRACK_BG = '#E8E8E8';
const SUBTEXT = '#666';

export type CenterDataDashboardProps = {
  centers: CenterDashboardCenter[];
  loading?: boolean;
};

type SummaryRow = {
  key: string;
  category: string;
  categoryRowSpan: number;
  level: string;
  count: number;
  ratio: number | null;
};

const CenterStatCard: React.FC<{ center: CenterDashboardCenter }> = ({ center }) => {
  const national = center.national ?? 0;
  const hasNational = center.national !== undefined && center.national !== null;
  const total = center.provincial + center.municipal + (hasNational ? national : 0);
  const items = [
    { name: '省级', count: center.provincial },
    { name: '市级', count: center.municipal },
    ...(hasNational ? [{ name: '国家级', count: national }] : []),
  ];
  const maxInCard = Math.max(total, ...items.map((i) => i.count), 1);

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: '#f6f8fe',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: PRIMARY, flex: 1, minWidth: 0, lineHeight: 1.4 }}>
          {center.name}
        </span>
        <span
          style={{
            flexShrink: 0,
            padding: '4px 14px',
            borderRadius: 999,
            background: PRIMARY,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {total}家
        </span>
      </div>
      <div style={{ padding: '12px 16px 16px' }}>
        {items.map((row) => {
          const pct = maxInCard > 0 ? Math.min(100, (row.count / maxInCard) * 100) : 0;
          return (
            <div
              key={`${center.name}-${row.name}`}
              style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <span
                style={{
                  width: 44,
                  flexShrink: 0,
                  fontSize: 13,
                  color: SUBTEXT,
                }}
              >
                {row.name}
              </span>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    borderRadius: 4,
                    background: TRACK_BG,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      borderRadius: 4,
                      background: PRIMARY,
                      transition: 'width 0.35s ease',
                    }}
                  />
                </div>
                <span
                  style={{
                    flexShrink: 0,
                    width: 52,
                    textAlign: 'right',
                    fontSize: 13,
                    color: SUBTEXT,
                  }}
                >
                  {row.count}家
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const formatRatio = (count: number, denominator: number): number | null => {
  if (denominator <= 0) return null;
  return (count / denominator) * 100;
};

const CenterDataDashboard: React.FC<CenterDataDashboardProps> = ({
  centers,
  loading = false,
}) => {
  /** 大中心情况统计 count1–count13 映射后的各栏合计，用作汇总说明与汇总表占比分母 */
  const statsTableTotal = useMemo(
    () =>
      centers.reduce(
        (s, c) => s + c.provincial + c.municipal + (c.national ?? 0),
        0
      ),
    [centers]
  );

  const tableData: SummaryRow[] = useMemo(() => {
    return centers.flatMap((c, idx) => {
      const baseKey = `c-${idx}`;
      const hasNational = c.national !== undefined && c.national !== null;
      const rowSpan = hasNational ? 3 : 2;
      const pRatio = formatRatio(c.provincial, statsTableTotal);
      const mRatio = formatRatio(c.municipal, statsTableTotal);
      const nRatio = hasNational ? formatRatio(c.national ?? 0, statsTableTotal) : null;
      const rows: SummaryRow[] = [
        {
          key: `${baseKey}-p`,
          category: c.name,
          categoryRowSpan: rowSpan,
          level: '省级',
          count: c.provincial,
          ratio: pRatio,
        },
        {
          key: `${baseKey}-m`,
          category: c.name,
          categoryRowSpan: 0,
          level: '市级',
          count: c.municipal,
          ratio: mRatio,
        },
      ];
      if (hasNational) {
        rows.push({
          key: `${baseKey}-n`,
          category: c.name,
          categoryRowSpan: 0,
          level: '国家级',
          count: c.national ?? 0,
          ratio: nRatio,
        });
      }
      return rows;
    });
  }, [centers, statsTableTotal]);

  const columns: ColumnsType<SummaryRow> = useMemo(
    () => [
      {
        title: '中心类别',
        dataIndex: 'category',
        width: '38%',
        align: 'center',
        render: (text: string, record) => ({
          children: text,
          props: { rowSpan: record.categoryRowSpan },
        }),
      },
      {
        title: '级别',
        dataIndex: 'level',
        align: 'center',
        width: '14%',
      },
      {
        title: '企业数量',
        dataIndex: 'count',
        align: 'center',
        width: '18%',
      },
      {
        title: '占比',
        dataIndex: 'ratio',
        align: 'center',
        width: '18%',
        render: (v: number | null) =>
          v == null ? '-' : `${Number(v.toFixed(1))}%`,
      },
    ],
    []
  );

  return (
    <div style={{ marginTop: 20 }}>
      <Spin spinning={loading}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#262626' }}>6大中心情况统计</div>
        <div style={{ marginTop: 16, marginBottom: 16, fontSize: 14, color: SUBTEXT }}>
          根据大中心情况统计，合计共 {statsTableTotal} 家企业
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 16,
        }}
        className="fullchain-center-dashboard-cards"
      >
        <style>{`
          @media (max-width: 900px) {
            .fullchain-center-dashboard-cards {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
        {centers.map((c) => (
          <CenterStatCard key={c.name} center={c} />
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#262626', marginBottom: 12 }}>汇总表</div>
        <Table<SummaryRow>
          className="fullchain-center-summary-table"
          columns={columns}
          dataSource={tableData}
          pagination={false}
          bordered
          size="middle"
          rowKey="key"
          components={{
            header: {
              cell: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
                <th
                  {...props}
                  style={{
                    ...props.style,
                    background: HEADER_BG,
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                />
              ),
            },
          }}
        />
        <style>{`
          .fullchain-center-summary-table .ant-table-tbody > tr > td {
            text-align: center;
          }
        `}</style>
      </div>
      </Spin>
    </div>
  );
};

export default CenterDataDashboard;
