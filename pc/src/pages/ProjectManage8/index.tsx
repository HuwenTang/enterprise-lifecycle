import React, { useState, useEffect } from 'react';
import { Table, Card, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { primeApi } from '@/services/api';
import { ZtxmTjxx, QyxmTjxx } from '@/services/apis';
import styles from './pm.module.css';
import {useNavigate} from "@umijs/max";

interface ProjectData {
  key: string;
  stage: string;
  statisticsProject: string;
  year2026: number | string;
  year2025: number | string;
  year2024: number | string;
  year2023: number | string;
}

const TitleCom: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span style={{ marginRight: 8 }}>{text}</span>
  </div>
);

// 辅助函数：根据阶段返回对应的参数值
const getProgressValue = (stage: string) => {
  return stage === '在谈' ? '1' : '2,3,4,5,6,7';
};

/** 表格展示：仅 null/undefined 为空，0 正常显示 */
function cellDisplay(v: number | string | null | undefined): number | string {
  if (v === null || v === undefined) return '';
  return v;
}

function pickNum(row: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const k of keys) {
    const val = row[k];
    if (val === null || val === undefined || val === '') continue;
    const n = typeof val === 'number' ? val : Number(val);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

/** unwrap 嵌套 data；在谈/签约地区接口可能返回单对象、{ data } 或多区县数组 */
function unwrapAreaPayload(raw: unknown): unknown[] | Record<string, unknown> | null {
  if (raw === null || raw === undefined) return null;
  if (Array.isArray(raw)) return raw;
  const o = raw as Record<string, unknown>;
  const inner = o.data;
  if (inner !== undefined && inner !== null) {
    if (Array.isArray(inner)) return inner;
    if (typeof inner === 'object') return inner as Record<string, unknown>;
  }
  return o;
}

type AreaSixStats = Pick<ZtxmTjxx, 'xmzsl' | 'xmzje' | 'nzsl' | 'nzje' | 'wzsl' | 'wzje'>;

/** 兼容 snake_case 字段名；多行时按全市汇总（加总） */
function normalizeAreaSixStats(raw: unknown): AreaSixStats | null {
  const unwrapped = unwrapAreaPayload(raw);
  if (unwrapped === null || unwrapped === undefined) return null;
  const rows: Record<string, unknown>[] = Array.isArray(unwrapped)
    ? (unwrapped as Record<string, unknown>[])
    : [unwrapped as Record<string, unknown>];
  if (rows.length === 0) return null;

  const rowHasAnyMetric = (r: Record<string, unknown>) =>
    [
      pickNum(r, 'xmzsl', 'xm_zsl'),
      pickNum(r, 'xmzje', 'xm_zje'),
      pickNum(r, 'nzsl', 'nz_sl'),
      pickNum(r, 'nzje', 'nz_je'),
      pickNum(r, 'wzsl', 'wz_sl'),
      pickNum(r, 'wzje', 'wz_je', 'wzJe'),
    ].some((v) => v !== undefined);

  const meaningfulRows = rows.filter(rowHasAnyMetric);
  if (meaningfulRows.length === 0) return null;

  const sum = (getter: (r: Record<string, unknown>) => number | undefined) =>
    meaningfulRows.reduce((acc, r) => {
      const v = getter(r);
      return acc + (typeof v === 'number' && Number.isFinite(v) ? v : 0);
    }, 0);

  return {
    xmzsl: sum((r) => pickNum(r, 'xmzsl', 'xm_zsl')),
    xmzje: sum((r) => pickNum(r, 'xmzje', 'xm_zje')),
    nzsl: sum((r) => pickNum(r, 'nzsl', 'nz_sl')),
    nzje: sum((r) => pickNum(r, 'nzje', 'nz_je')),
    wzsl: sum((r) => pickNum(r, 'wzsl', 'wz_sl')),
    wzje: sum((r) => pickNum(r, 'wzje', 'wz_je', 'wzJe')),
  };
}

const ProjectManage8: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ProjectData[]>([]);

  // 获取在谈项目数据：使用 Raw 读原始 JSON，避免数组/snake_case 被 OpenAPI 解析丢字段
  const fetchZtxmData = async (year: number): Promise<ZtxmTjxx | null> => {
    try {
      const res = await primeApi.getZtxmTjxxAreaViewsRaw({ year });
      const json = await res.raw.json();
      return normalizeAreaSixStats(json) as ZtxmTjxx | null;
    } catch (error) {
      console.error(`获取${year}年在谈项目数据失败:`, error);
      return null;
    }
  };

  // 获取签约项目数据
  const fetchQyxmData = async (year: number): Promise<QyxmTjxx | null> => {
    try {
      const res = await primeApi.getQyxmTjxxAreaViewsRaw({ year });
      const json = await res.raw.json();
      return normalizeAreaSixStats(json) as QyxmTjxx | null;
    } catch (error) {
      console.error(`获取${year}年签约项目数据失败:`, error);
      return null;
    }
  };

  // 加载所有数据
  const loadData = async () => {
    setLoading(true);
    try {
      // 并行获取所有年份的数据
      const [
        ztxm2026,
        ztxm2025,
        ztxm2024,
        ztxm2023,
        qyxm2026,
        qyxm2025,
        qyxm2024,
        qyxm2023,
      ] = await Promise.all([
        fetchZtxmData(2026),
        fetchZtxmData(2025),
        fetchZtxmData(2024),
        fetchZtxmData(2023),
        fetchQyxmData(2026),
        fetchQyxmData(2025),
        fetchQyxmData(2024),
        fetchQyxmData(2023),
      ]);

      // 构建表格数据
      const tableData: ProjectData[] = [
        {
          key: '1',
          stage: '在谈',
          statisticsProject: '项目总数',
          year2026: cellDisplay(ztxm2026?.xmzsl),
          year2025: cellDisplay(ztxm2025?.xmzsl),
          year2024: cellDisplay(ztxm2024?.xmzsl),
          year2023: cellDisplay(ztxm2023?.xmzsl),
        },
        {
          key: '2',
          stage: '在谈',
          statisticsProject: '总投资（亿元）',
          year2026: cellDisplay(ztxm2026?.xmzje),
          year2025: cellDisplay(ztxm2025?.xmzje),
          year2024: cellDisplay(ztxm2024?.xmzje),
          year2023: cellDisplay(ztxm2023?.xmzje),
        },
        {
          key: '3',
          stage: '在谈',
          statisticsProject: '内资项目数',
          year2026: cellDisplay(ztxm2026?.nzsl),
          year2025: cellDisplay(ztxm2025?.nzsl),
          year2024: cellDisplay(ztxm2024?.nzsl),
          year2023: cellDisplay(ztxm2023?.nzsl),
        },
        {
          key: '4',
          stage: '在谈',
          statisticsProject: '内资金额（亿元）',
          year2026: cellDisplay(ztxm2026?.nzje),
          year2025: cellDisplay(ztxm2025?.nzje),
          year2024: cellDisplay(ztxm2024?.nzje),
          year2023: cellDisplay(ztxm2023?.nzje),
        },
        {
          key: '5',
          stage: '在谈',
          statisticsProject: '外资项目数',
          year2026: cellDisplay(ztxm2026?.wzsl),
          year2025: cellDisplay(ztxm2025?.wzsl),
          year2024: cellDisplay(ztxm2024?.wzsl),
          year2023: cellDisplay(ztxm2023?.wzsl),
        },
        {
          key: '6',
          stage: '在谈',
          statisticsProject: '外资金额（亿美元）',
          year2026: cellDisplay(ztxm2026?.wzje),
          year2025: cellDisplay(ztxm2025?.wzje),
          year2024: cellDisplay(ztxm2024?.wzje),
          year2023: cellDisplay(ztxm2023?.wzje),
        },
        {
          key: '7',
          stage: '签约',
          statisticsProject: '项目总数',
          year2026: cellDisplay(qyxm2026?.xmzsl),
          year2025: cellDisplay(qyxm2025?.xmzsl),
          year2024: cellDisplay(qyxm2024?.xmzsl),
          year2023: cellDisplay(qyxm2023?.xmzsl),
        },
        {
          key: '8',
          stage: '签约',
          statisticsProject: '总投资（亿元）',
          year2026: cellDisplay(qyxm2026?.xmzje),
          year2025: cellDisplay(qyxm2025?.xmzje),
          year2024: cellDisplay(qyxm2024?.xmzje),
          year2023: cellDisplay(qyxm2023?.xmzje),
        },
        {
          key: '9',
          stage: '签约',
          statisticsProject: '内资项目数',
          year2026: cellDisplay(qyxm2026?.nzsl),
          year2025: cellDisplay(qyxm2025?.nzsl),
          year2024: cellDisplay(qyxm2024?.nzsl),
          year2023: cellDisplay(qyxm2023?.nzsl),
        },
        {
          key: '10',
          stage: '签约',
          statisticsProject: '内资金额（亿元）',
          year2026: cellDisplay(qyxm2026?.nzje),
          year2025: cellDisplay(qyxm2025?.nzje),
          year2024: cellDisplay(qyxm2024?.nzje),
          year2023: cellDisplay(qyxm2023?.nzje),
        },
        {
          key: '11',
          stage: '签约',
          statisticsProject: '外资项目数',
          year2026: cellDisplay(qyxm2026?.wzsl),
          year2025: cellDisplay(qyxm2025?.wzsl),
          year2024: cellDisplay(qyxm2024?.wzsl),
          year2023: cellDisplay(qyxm2023?.wzsl),
        },
        {
          key: '12',
          stage: '签约',
          statisticsProject: '外资金额（亿美元）',
          year2026: cellDisplay(qyxm2026?.wzje),
          year2025: cellDisplay(qyxm2025?.wzje),
          year2024: cellDisplay(qyxm2024?.wzje),
          year2023: cellDisplay(qyxm2023?.wzje),
        },
      ];

      setDataSource(tableData);
    } catch (error) {
      message.error('加载数据失败');
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const navigate = useNavigate();
  // 处理单元格点击事件
  const handleCellClick = (record: ProjectData, dataIndex: string) => {
    console.log('点击了单元格:', record, dataIndex);
  };

  const columns = [
    {
      title: <TitleCom text="阶段" />,
      dataIndex: 'stage',
      key: 'stage',
      width: 120,
      className: styles.benchtable,
      align: 'center' as const,
      render: (text: string, record: any) => (
        <span
          onClick={() => {
            const progressValue = getProgressValue(record.stage);
            const encodedProgress = encodeURIComponent(progressValue);
            navigate(`/xmgl?currentProjectProgress=${encodedProgress}`);
            handleCellClick(record, 'stage');
          }}
          className={styles.stageCell}
        >
          {text}
        </span>
      ),
      onCell: (record: ProjectData, index?: number) => {
        const idx = index ?? 0;
        if (record.stage === '在谈') {
          if (idx === 0) {
            return { rowSpan: 6 };
          } else if (idx >= 1 && idx <= 5) {
            return { rowSpan: 0 };
          }
        }
        if (record.stage === '签约') {
          if (idx === 6) {
            return { rowSpan: 6 };
          } else if (idx >= 7 && idx <= 11) {
            return { rowSpan: 0 };
          }
        }
        return {};
      },
    },
    {
      title: <TitleCom text="统计项目" />,
      dataIndex: 'statisticsProject',
      key: 'statisticsProject',
      width: 150,
      className: styles.benchtable,
      align: 'center' as const,
    },
    {
      title: (
        <div
          onClick={() => {
            console.log('点击了表头: 2026');
            // 表头点击仅传递年份，不涉及阶段参数
            navigate(`/xmgl?year=2026`);
          }}
        >
          <TitleCom text="2026" />
        </div>
      ),
      dataIndex: 'year2026',
      key: 'year2026',
      width: 120,
      className: styles.benchtable,
      align: 'center' as const,
      render: (text: string, record: any) => {
        const year = 2026;
        return (
          <span
            onClick={() => {
              if (record.key === '1' || record.key === '7') {
                handleCellClick(record, 'stage');
                console.log('点击了单元格:', text, year, 'stage');
                const progressValue = getProgressValue(record.stage);
                const encodedProgress = encodeURIComponent(progressValue);
                navigate(`/xmgl?currentProjectProgress=${encodedProgress}&year=${year}`);
              }
            }}
            className={styles.stageCell}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: (
        <div
          onClick={() => {
            console.log('点击了表头: 2025');
            // 表头点击仅传递年份，不涉及阶段参数
            navigate(`/xmgl?year=2025`);
          }}
        >
          <TitleCom text="2025" />
        </div>
      ),
      dataIndex: 'year2025',
      key: 'year2025',
      width: 120,
      className: styles.benchtable,
      align: 'center' as const,
      render: (text: string, record: any) => {
        const year = 2025;
        return (
          <span
            onClick={() => {
              if (record.key === '1'|| record.key === '7') {
                handleCellClick(record, 'stage');
                console.log('点击了单元格:', text, year, 'stage');
                const progressValue = getProgressValue(record.stage);
                const encodedProgress = encodeURIComponent(progressValue);
                navigate(`/xmgl?currentProjectProgress=${encodedProgress}&year=${year}`);
              }
            }}
            className={styles.stageCell}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: (
        <div
          onClick={() => {
            console.log('点击了表头: 2024');
            navigate(`/xmgl?year=2024`);
          }}
        >
          <TitleCom text="2024" />
        </div>
      ),
      dataIndex: 'year2024',
      key: 'year2024',
      width: 120,
      className: styles.benchtable,
      align: 'center' as const,
      render: (text: string, record: any) => {
        const year = 2024;
        return (
          <span
            onClick={() => {
              if (record.key === '1'|| record.key === '7') {
                handleCellClick(record, 'stage');
                console.log('点击了单元格:', text, year, 'stage');
                const progressValue = getProgressValue(record.stage);
                const encodedProgress = encodeURIComponent(progressValue);
                navigate(`/xmgl?currentProjectProgress=${encodedProgress}&year=${year}`);
              }
            }}
            className={styles.stageCell}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: (
        <div
          onClick={() => {
            console.log('点击了表头: 2023');
            navigate(`/xmgl?year=2023`);
          }}
        >
          <TitleCom text="2023" />
        </div>
      ),
      dataIndex: 'year2023',
      key: 'year2023',
      width: 120,
      className: styles.benchtable,
      align: 'center' as const,
      render: (text: string, record: any) => {
        const year = 2023;
        return (
          <span
            onClick={() => {
              if (record.key === '1'|| record.key === '7') {
                handleCellClick(record, 'stage');
                console.log('点击了单元格:', text, year, 'stage');
                const progressValue = getProgressValue(record.stage);
                const encodedProgress = encodeURIComponent(progressValue);
                navigate(`/xmgl?currentProjectProgress=${encodedProgress}&year=${year}`);
              }
            }}
            className={styles.stageCell}
          >
            {text}
          </span>
        );
      },
    },
  ];

  return (
    <PageContainer
      content="欢迎使用项目看板模块"
    >
      <Card>
        <div style={{ marginBottom: 16 }}>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
          bordered
          size="middle"
          className={styles.benchtable}
        />
      </Card>
    </PageContainer>
  );
};

export default ProjectManage8;



