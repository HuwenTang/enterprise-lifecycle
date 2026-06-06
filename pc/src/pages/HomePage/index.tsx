import React, { useEffect, useRef } from 'react';
import { useNavigate } from '@umijs/max';
import * as echarts from 'echarts';
import {
  AlertOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  FileAddOutlined,
  FolderOpenOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ProjectOutlined,
  StarOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';

type StageCard = {
  no: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
};

type MetricCard = {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  delta: string;
};

type QuickEntry = {
  label: string;
  icon: React.ReactNode;
  color: string;
  path: string;
};

const stages: StageCard[] = [
  {
    no: '01',
    title: '项目招引',
    desc: '瞄准产业链精准招引，注入发展新动能',
    color: '#17b98f',
    bg: 'linear-gradient(135deg, #effdf8 0%, #ffffff 100%)',
    icon: <FileAddOutlined />,
  },
  {
    no: '02',
    title: '在线审批',
    desc: '一网通办并联审批，企业办事零跑腿',
    color: '#2478ff',
    bg: 'linear-gradient(135deg, #f1f7ff 0%, #ffffff 100%)',
    icon: <CheckCircleOutlined />,
  },
  {
    no: '03',
    title: '工程建设',
    desc: '倒排工期挂图作战，确保早日竣工',
    color: '#f59a23',
    bg: 'linear-gradient(135deg, #fff7eb 0%, #ffffff 100%)',
    icon: <ProjectOutlined />,
  },
  {
    no: '04',
    title: '竣工达产',
    desc: '提升生产效率，优化生产流程',
    color: '#7d61f2',
    bg: 'linear-gradient(135deg, #f6f2ff 0%, #ffffff 100%)',
    icon: <BarChartOutlined />,
  },
];

const metrics: MetricCard[] = [
  { icon: <FolderOpenOutlined />, label: '企业档案', value: '2,856', unit: '家', delta: '+128' },
  { icon: <ProjectOutlined />, label: '在建项目', value: '1,428', unit: '个', delta: '+86' },
  { icon: <BarChartOutlined />, label: '竣工项目', value: '986', unit: '个', delta: '+62' },
  { icon: <UserOutlined />, label: '重点跟进', value: '325', unit: '个', delta: '+15' },
];

const quickEntries: QuickEntry[] = [
  { label: '项目申报', icon: <FileAddOutlined />, color: '#1f78ff', path: '/xmgl' },
  { label: '审批办理', icon: <UserOutlined />, color: '#20b889', path: '/project-audit' },
  { label: '数据报送', icon: <UploadOutlined />, color: '#7d61f2', path: '/dataAcquisition/dataImport' },
  { label: '重点项目', icon: <StarOutlined />, color: '#f5a623', path: '/key-project' },
  { label: '项目跟踪', icon: <BarChartOutlined />, color: '#2f80ed', path: '/service-track' },
  { label: '预警监控', icon: <AlertOutlined />, color: '#ff6048', path: '/task-manage' },
  { label: '统计分析', icon: <PieChartOutlined />, color: '#7958f5', path: '/statistical-report' },
  { label: '更多应用', icon: <AppstoreOutlined />, color: '#9aa9bd', path: '/home' },
];

const scaleData = [
  { name: '10亿以上', value: 286, percent: '20.03%', color: '#3478ff' },
  { name: '3亿-10亿', value: 428, percent: '29.97%', color: '#83c95b' },
  { name: '1亿-3亿', value: 368, percent: '25.77%', color: '#ffc33f' },
  { name: '5000万-1亿', value: 196, percent: '13.73%', color: '#8a6df1' },
  { name: '5000万以下', value: 150, percent: '10.50%', color: '#2fc7c2' },
];

const panelStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(214, 225, 241, 0.78)',
  borderRadius: 8,
  boxShadow: '0 12px 28px rgba(25, 62, 118, 0.08)',
};

function TrendChart() {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return undefined;
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      color: ['#176cff'],
      grid: { left: 44, right: 18, top: 34, bottom: 30 },
      tooltip: {
        trigger: 'axis',
        formatter: '6月<br />● 28.6 亿元',
        backgroundColor: '#fff',
        borderColor: '#d9e5f8',
        borderWidth: 1,
        textStyle: { color: '#1f2a44' },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisLine: { lineStyle: { color: '#e2e9f4' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        min: 10,
        max: 35,
        interval: 5,
        axisLabel: { formatter: '{value}亿' },
        splitLine: { lineStyle: { color: '#edf2f8' } },
      },
      series: [
        {
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 7,
          data: [12.6, 17.8, 15.4, 24.9, 19.1, 22.3, 24.6, 23.5, 17.7, 21.1, 25.8, 30.8],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(23,108,255,0.24)' },
              { offset: 1, color: 'rgba(23,108,255,0.02)' },
            ]),
          },
          lineStyle: { width: 3 },
        },
      ],
    });
    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ height: 230, width: '100%' }} />;
}

function ScaleChart() {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return undefined;
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      color: scaleData.map((item) => item.color),
      series: [
        {
          type: 'pie',
          radius: ['58%', '82%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          label: { show: false },
          itemStyle: { borderColor: '#fff', borderWidth: 4, borderRadius: 8 },
          data: scaleData.map((item) => ({ name: item.name, value: item.value })),
        },
      ],
    });
    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ height: 220, width: 220 }} />;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f5f8fc', margin: -24 }}>
      <style>
        {`
          .home-stage-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 26px; }
          .home-card-grid { display: grid; grid-template-columns: 1.05fr 1fr 0.94fr; gap: 18px; }
          .home-stage-card { min-height: 154px; padding: 25px 26px; }
          .home-stage-card + .home-stage-card::before {
            content: '›';
            position: absolute;
            left: -21px;
            top: 57px;
            color: #2478ff;
            font-size: 44px;
            font-weight: 300;
          }
          .home-stage-icon {
            width: 90px;
            height: 76px;
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 44px;
            filter: drop-shadow(0 12px 14px rgba(31, 103, 218, 0.14));
          }
          .home-quick-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
          .home-quick-item { height: 102px; }
          @media (max-width: 1280px) {
            .home-stage-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .home-card-grid { grid-template-columns: 1fr; }
          }
          @media (max-width: 760px) {
            .home-stage-grid { grid-template-columns: 1fr; }
            .home-quick-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
        `}
      </style>

      <main style={{ padding: '36px 34px 0' }}>
        <section className="home-stage-grid">
          {stages.map((item) => (
            <div
              key={item.no}
              className="home-stage-card"
              style={{
                ...panelStyle,
                background: item.bg,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 18,
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      background: item.color,
                      color: '#fff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 800,
                    }}
                  >
                    {item.no}
                  </span>
                  <strong style={{ color: item.color, fontSize: 24 }}>{item.title}</strong>
                </div>
                <p style={{ margin: 0, color: '#4f5f75', fontSize: 17, lineHeight: 1.7, maxWidth: 220 }}>{item.desc}</p>
              </div>
              <div className="home-stage-icon" style={{ color: item.color, background: '#fff' }}>
                {item.icon}
              </div>
            </div>
          ))}
        </section>

        <section
          style={{
            marginTop: 26,
            minHeight: 250,
            borderRadius: 10,
            background: 'linear-gradient(120deg, #0864f7 0%, #0a79ff 48%, #238eff 100%)',
            color: '#fff',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1.1fr 2fr 0.8fr',
            alignItems: 'center',
            boxShadow: '0 16px 32px rgba(15, 104, 245, 0.24)',
          }}
        >
          <div style={{ padding: '38px 36px 38px 40px', position: 'relative' }}>
            <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 18 }}>一企一档</div>
            <div style={{ fontSize: 17, opacity: 0.92, marginBottom: 28 }}>一企一档全记录，数据赋能有服务，精准施策促共赢</div>
            <button
              type="button"
              onClick={() => navigate('/enterprise/enterpriseSearch')}
              style={{
                height: 46,
                padding: '0 26px',
                border: 0,
                borderRadius: 24,
                background: '#fff',
                color: '#096bff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              进入企业档案 →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', height: 160 }}>
            {metrics.map((item, index) => (
              <div
                key={item.label}
                style={{
                  borderLeft: index === 0 ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 66,
                    height: 66,
                    borderRadius: 33,
                    border: '1px solid rgba(255,255,255,0.45)',
                    background: 'rgba(255,255,255,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 30,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>
                  {item.value}
                  <span style={{ fontSize: 16, marginLeft: 6 }}>{item.unit}</span>
                </div>
                <div style={{ fontSize: 15 }}>
                  较上月 <span style={{ marginLeft: 8 }}>{item.delta} ↑</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', fontSize: 118, opacity: 0.86 }}>
            <FolderOpenOutlined />
          </div>
        </section>

        <section className="home-card-grid" style={{ marginTop: 22 }}>
          <div style={{ ...panelStyle, padding: '24px 22px 18px' }}>
            <PanelHeader title="项目趋势变化" filters={['2026', '在谈']} />
            <div style={{ color: '#657386', margin: '16px 0 0' }}>项目投资总额（亿元）</div>
            <TrendChart />
          </div>

          <div style={{ ...panelStyle, padding: '24px 22px 18px' }}>
            <PanelHeader title="项目规模分布" filters={['2026', '在谈', '内资']} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 250 }}>
              <div style={{ position: 'relative', width: 230, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ScaleChart />
                <div style={{ position: 'absolute', textAlign: 'center', color: '#1d2433' }}>
                  <div style={{ fontSize: 14 }}>项目总数</div>
                  <strong style={{ display: 'block', fontSize: 26 }}>1,428</strong>
                  <span>个</span>
                </div>
              </div>
              <div style={{ flex: 1, paddingLeft: 20 }}>
                {scaleData.map((item) => (
                  <div
                    key={item.name}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '14px 1fr 68px 64px',
                      gap: 10,
                      alignItems: 'center',
                      height: 34,
                      color: '#354052',
                    }}
                  >
                    <span style={{ width: 10, height: 10, borderRadius: 5, background: item.color }} />
                    <span>{item.name}</span>
                    <strong>{item.value} 个</strong>
                    <span style={{ color: '#748195' }}>{item.percent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ ...panelStyle, padding: '24px 22px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <AppstoreOutlined style={{ color: '#1f78ff', fontSize: 24 }} />
              <strong style={{ fontSize: 22 }}>快捷入口</strong>
            </div>
            <div className="home-quick-grid">
              {quickEntries.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="home-quick-item"
                  style={{
                    border: '1px solid #e4ebf5',
                    borderRadius: 8,
                    background: '#f9fbff',
                    cursor: 'pointer',
                    color: '#27364b',
                    fontWeight: 700,
                  }}
                >
                  <div style={{ color: item.color, fontSize: 34, marginBottom: 12 }}>{item.icon}</div>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer
        style={{
          marginTop: 34,
          height: 64,
          background: '#005bf5',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          whiteSpace: 'normal',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        主办单位：泰州市数据局　技术支持：泰州市数据产业集团有限公司　企业全生命周期平台督导开通及操作咨询：周志（19952951525）；周一凡（15996060181）　数字化招商模块操作咨询：钱忠伟（17351649583）
      </footer>
    </div>
  );
};

function PanelHeader({ title, filters }: { title: string; filters: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <LineChartOutlined style={{ color: '#1f78ff', fontSize: 24 }} />
        <strong style={{ fontSize: 22 }}>{title}</strong>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {filters.map((filter, index) => (
          <span
            key={`${filter}-${index}`}
            style={{
              height: 32,
              minWidth: index === 0 ? 86 : 76,
              border: '1px solid #dfe7f2',
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: '#3d4b5d',
              background: '#fff',
            }}
          >
            {index === 0 ? <CalendarOutlined /> : null}
            {filter}
          </span>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
