import { Spin } from 'antd';
import React from 'react';
import type { ClusterDashboardCard } from './mock';

const PRIMARY = '#005BF5';
const TRACK_BG = '#E8E8E8';
const SUBTEXT = '#666';

export type ClusterDataDashboardProps = {
  cards: ClusterDashboardCard[];
  loading?: boolean;
};

const ClusterCard: React.FC<{ card: ClusterDashboardCard }> = ({ card }) => {
  const maxInCard = Math.max(card.total, ...card.items.map((i) => i.count), 1);

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
          background: "#f6f8fe",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: PRIMARY, flex: 1, minWidth: 0 }}>
          {card.clusterName}
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
          }}
        >
          {card.total} 家
        </span>
      </div>
      <div style={{ padding: '12px 16px 16px' }}>
        {card.items.map((row) => {
          const pct = maxInCard > 0 ? Math.min(100, (row.count / maxInCard) * 100) : 0;
          return (
            <div
              key={`${card.clusterName}-${row.name}`}
              style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <span
                style={{
                  width: 132,
                  flexShrink: 0,
                  fontSize: 13,
                  color: SUBTEXT,
                  lineHeight: 1.35,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={row.name}
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
                    width: 56,
                    textAlign: 'right',
                    fontSize: 13,
                    color: SUBTEXT,
                  }}
                >
                  {row.count} 家
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ClusterDataDashboard: React.FC<ClusterDataDashboardProps> = ({
  cards,
  loading = false,
}) => {
  /** 企业创新平台统计表：各集群 headline 合计（仅来自统计接口映射结果） */
  const statsTableTotal = cards.reduce((s, c) => s + c.total, 0);

  /** 两列时：先沿左列自上而下排满，再排右列（grid-auto-flow: column） */
  const rowCount = Math.max(1, Math.ceil(cards.length / 2));

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#262626' }}>
          创新集群&产业链企业数量统计
        </div>
        <div style={{ marginTop: 16, marginBottom: 16, fontSize: 14, color: SUBTEXT }}>
          根据企业创新平台统计表，合计共 {statsTableTotal} 家企业
        </div>
      </div>
      <Spin spinning={loading}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gridTemplateRows: `repeat(${rowCount}, auto)`,
            gridAutoFlow: 'column',
            gap: 16,
          }}
          className="fullchain-cluster-dashboard-grid"
        >
          <style>{`
          @media (max-width: 900px) {
            .fullchain-cluster-dashboard-grid {
              grid-template-columns: 1fr !important;
              grid-template-rows: none !important;
              grid-auto-flow: row !important;
            }
          }
        `}</style>
          {cards.map((card, index) => (
            <div key={`${card.clusterName}-${index}`}>
              <ClusterCard card={card} />
            </div>
          ))}
        </div>
      </Spin>
    </div>
  );
};

export default ClusterDataDashboard;
