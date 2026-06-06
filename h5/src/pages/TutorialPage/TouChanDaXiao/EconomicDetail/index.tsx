import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { Button, message, Breadcrumb, Row, Table, Radio } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import styles from "./index.module.css";

import { useSearchParams } from "react-router-dom";
// import { DatetimePicker } from "react-vant";
import { primeApi } from "../../../../api.ts";
import dayjs from "dayjs";


let __scrollLockCount = 0;

function LockBodyScroll() {
  useEffect(() => {
    __scrollLockCount += 1;
    if (__scrollLockCount === 1) {
      const scrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      // 记录当前滚动位置并锁定
      document.body.dataset.lockScrollY = String(scrollY);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    }

    return () => {
      __scrollLockCount -= 1;
      if (__scrollLockCount === 0) {
        const y = parseInt(document.body.dataset.lockScrollY || '0', 10) || 0;

        // 解除锁定并恢复滚动位置
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        delete document.body.dataset.lockScrollY;

        window.scrollTo(0, y);
      }
    };
  }, []);

  return null;
}

const PortfolioInvestment: React.FC = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialArea = searchParams.get("area");
  const initialTitle = searchParams.get("title");
  const [year, setYear] = useState<number>(2024);
  const [chartType, setChartType] = useState<"bar" | "table">("bar");
  const [chartType2, setChartType2] = useState<"bar" | "table">("bar");
  const [chartType3, setChartType3] = useState<"bar" | "table">("bar");
  const hasAnyTable =
    chartType === "table" ||
    chartType2 === "table" ||
    chartType3 === "table";
  const [expandedSection, setExpandedSection] = useState<null | 'comp' | 'invoice' | 'value' | 'all'>('comp');

  const [currentDate, setCurrentDate] = useState(dayjs("2024-09-01"));



  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 存储展开的节点key
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 模拟数据 - 根据区域图片优化
  const chartDataBase = [
    {
      name: "全市",
      value: 0,
      highlight: true,
    },
    { name: "靖江", value: 0 },
    { name: "泰兴", value: 0 },
    { name: "兴化", value: 0 },
    { name: "海陵", value: 0 },
    { name: "姜堰", value: 0 },
    { name: "医药", value: 0 },
  ];
  const [chartData, setChartData] = useState<any[]>([]);
  const [completionData, setCompletionData] = useState<any[]>([]);

  const toShortDistrict = (d?: string): string => {
    const txt = String(d || "");
    if (txt === "医药高新区（高港区）") return "医药";
    return txt.replace(/\s+/g, "").slice(0, 2);
  };


  const getChartOption = () => {
    const root = Array.isArray(completionData) ? completionData : [];
    const list = root.length
      ? (Array.isArray(root[0]?.children) ? root[0].children : root.slice(1))
      : [];
    const xData = list.map((n: any) => toShortDistrict(n?.district));
    const projectBar = list.map((n: any) => Number(n?.projectCount2024 ?? n?.projectCount ?? 0));
    const enterpriseBar = list.map((n: any) => Number(n?.endNum ?? 0));

    return {
      color: ["#5596FF", "#24CA6D"],
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: {
        data: ["竣工项目数", "竣工企业数"],
        bottom: 0,
        x: "center",
        itemWidth: 12,
        itemHeight: 12,
        icon: 'circle',
        textStyle: { fontSize: 12, color: "#16151A",lineHeight: 12 },
      },
      grid: { left: "6%", right: "6%", bottom: "12%", top: "12%", containLabel: true },
      xAxis: { type: "category", data: xData, axisLabel: { fontSize: 12, color: "#16151A" }, axisLine: { lineStyle: { color: "#16151A" } }, axisTick: { show: false } },
      yAxis: { type: "value", name: "项目数量(个)", nameTextStyle: { color: "#16151A" }, axisLabel: { fontSize: 12, color: "#16151A" }, axisLine: { show: false }, splitLine: { lineStyle: { color: "#9A9FB5" } } },
      series: [
        { name: "竣工项目数", type: "bar", data: projectBar, barWidth: "40%", emphasis: { itemStyle: { color: "#5596FF" } } },
        { name: "竣工企业数", type: "bar", data: enterpriseBar, barWidth: "40%", emphasis: { itemStyle: { color: "#24CA6D" } } },
        // { name: "竣工项目数", type: "line", data: projectBar, barWidth: "40%", emphasis: { itemStyle: { color: "#5596FF" } } },
        // { name: "竣工企业数", type: "line", data: enterpriseBar, barWidth: "40%", emphasis: { itemStyle: { color: "#24CA6D" } } },
      ],
    };
  };

  const columns = [
    {
      title: "区域",
      dataIndex: 'name',
      key: 'name',
      align: 'center' as const,
      render: (_: any, record: any) => {
        const hasChildren = Array.isArray(record?.children) && record.children.length > 0;
        return hasChildren ? (record?.district ?? record?.name ?? '-') : (record?.name ?? record?.district ?? '-');
      }
    },
    {
      title: <>2024年竣工项目数<br />(个)</>,
      dataIndex: 'projectCount2024',
      key: 'projectCount2024',
      align: 'center' as const,
      render: (_: number, record: any) => Number(record?.projectCount2024 ?? record?.projectCount ?? 0)
    },
    {
      title: <>2024年竣工企业数<br />(个)</>,
      dataIndex: "endNum",
      key: 'endNum',
      align: 'center' as const,
      render: (text: number) => Number(text ?? 0)
    },
  ]
  const getChartOption2 = () => {
    const root = Array.isArray(completionData) ? completionData : [];
    const list = root.length
      ? (Array.isArray(root[0]?.children) ? root[0].children : root.slice(1))
      : [];
    const xData = list.map((n: any) => toShortDistrict(n?.district));
    const invoiceLine = list.map((n: any) => Number(n?.invoiceNum ?? 0));
    const taxLine = list.map((n: any) => Number(n?.taxNum ?? 0));

    return {
      color: ["#5596FF", "#9D55FF"],
      tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
      legend: {
        data: ["2024年开票", "2024年税收"],
        bottom: 0,
        x: "center",
        itemWidth: 12,
        itemHeight: 1,
        textStyle: { fontSize: 12, color: "rgba(154,159,181,1)",lineHeight: 12 },
      },
      grid: { left: "6%", right: "8%", bottom: "12%", top: "15%", containLabel: true },
      xAxis: { type: "category", data: xData, axisLabel: { fontSize: 12, color: "#16151A" }, axisLine: { lineStyle: { color: "#16151A" } }, axisTick: { show: false } },
      yAxis: [
        { type: "value", name: "开票金额(亿)", position: "left", nameTextStyle: { color: "#16151A" }, axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" }, axisLine: { show: false }, splitLine: { lineStyle: { color: "#9A9FB5" } } },
        { type: "value", name: "税收金额(亿)", position: "right", nameTextStyle: { color: "#16151A" }, axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" }, axisLine: { show: false }, splitLine: { show: false } },
      ],
      series: [
        { name: "2024年开票", type: "line", smooth: false, symbol: "circle", symbolSize: 6, data: invoiceLine, lineStyle: { width: 2 } },
        { name: "2024年税收", type: "line", yAxisIndex: 1, smooth: false, symbol: "circle", symbolSize: 6, data: taxLine, lineStyle: { width: 2 } },
      ],
    };
  };
  const columns2 = [
    {
      title: '区域',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      // render: (text: string) =>
      // text?text === '医药高新区（高港区）' ?'医药':text.substring(0, 2):''
      render: (_: any, record: any) => {
        const hasChildren = Array.isArray(record?.children) && record.children.length > 0;
        return hasChildren ? (record?.district ?? record?.name ?? '-') : (record?.name ?? record?.district ?? '-');
      }
    },
    {
      title: <>2024年开票<br />(亿元)</>,
      dataIndex: 'invoiceNum',
      key: 'invoiceNum',
      align: 'center',
      render: (text: number) => Number(text ?? 0)
    },
    {
      title: <>2024年税收<br />(亿元)</>,
      dataIndex: 'taxNum',
      key: 'taxNum',
      align: 'center',
      render: (text: number) => Number(text ?? 0)
    }
  ];

  const getChartOption3 = () => {
    const root = Array.isArray(completionData) ? completionData : [];
    const list = root.length
      ? (Array.isArray(root[0]?.children) ? root[0].children : root.slice(1))
      : [];
    const xData = list.map((n: any) => toShortDistrict(n?.district));
    const outBar = list.map((n: any) => Number(n?.outputNum ?? 0));
    const revBar = list.map((n: any) => Number(n?.revenueNum ?? 0));
    const proBar = list.map((n: any) => Number(n?.profitNum ?? 0));

    return {
      color: ["#5596FF", "#24CA6D", "#E8E025"],
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: {
        data: ["2024年产值", "2024年营收", "2024年利润"],
        bottom: 0,
        x: "center",
        itemWidth: 12,
        itemHeight: 12,
        textStyle: { fontSize: 12, color: "#16151A",verticalAlign: 'middle' },
        icon: 'circle'
      },
      grid: { left: "6%", right: "6%", bottom: "12%", top: "12%", containLabel: true },
      xAxis: { type: "category", data: xData, axisLabel: { fontSize: 12, color: "#16151A" }, axisLine: { lineStyle: { color: "#16151A" } }, axisTick: { show: false } },
      yAxis: { type: "value", name: "金额(亿)", nameTextStyle: { color: "#16151A" }, axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" }, axisLine: { show: false }, splitLine: { lineStyle: { color: "#9A9FB5" } } },
      series: [
        { name: "2024年产值", type: "bar", data: outBar, barWidth: "30%", emphasis: { itemStyle: { color: "#5596FF" } } },
        { name: "2024年营收", type: "bar", data: revBar, barWidth: "30%", emphasis: { itemStyle: { color: "#24CA6D" } } },
        { name: "2024年利润", type: "bar", data: proBar, barWidth: "30%", emphasis: { itemStyle: { color: "#E8E025" } } },
      ],
    };
  };

  const columns3 = [
    {
      title: '区域',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (_: any, record: any) => {
        const hasChildren = Array.isArray(record?.children) && record.children.length > 0;
        return hasChildren ? (record?.district ?? record?.name ?? '-') : (record?.name ?? record?.district ?? '-');
      }
    },
    {
      title: <>产值<br />(亿)</>,
      dataIndex: 'outputNum',
      key: 'outputNum',
      align: 'center',
      render: (text: number) => Number(text ?? 0)
    },
    {
      title: <>营收<br />(亿)</>,
      dataIndex: 'revenueNum',
      key: 'revenueNum',
      align: 'center',
      render: (text: number) => Number(text ?? 0)
    },
    {
      title: <>利润<br />(亿)</>,
      dataIndex: 'profitNum',
      key: 'profitNum',
      align: 'center',
      render: (text: number) => Number(text ?? 0)
    }
  ];




  const loadData = async (params: any) => {
    try {
      const districts: Array<string> = [
        '兴化市',
        '姜堰区',
        '新高区',
        '泰兴市',
        '海陵区',
        '靖江市',
        '泰州市',
      ];
      const res = await primeApi.listProjectDcdxEconomicPerformanceStats({
        year: params?.year ?? year ?? 2024,
        district: districts,
        park: ['合计'],
        industryGroup: [],
        page: 1,
        size: 100,
      });

      const records = Array.isArray((res as any)?.records) ? (res as any).records : [];
      const fallback = [
        { district: '泰州市', endNum: 128, invoiceNum: 947.99, taxNum: 44.70, outputNum: 1076.03, revenueNum: 1005.62, profitNum: 98.64, projectCount2024: 139 },
        { district: '靖江市', endNum: 22, invoiceNum: 69.02, taxNum: 2.14, outputNum: 167.92, revenueNum: 143.98, profitNum: 7.64, projectCount2024: 23 },
        { district: '泰兴市', endNum: 34, invoiceNum: 303.16, taxNum: 14.07, outputNum: 307.33, revenueNum: 308.43, profitNum: 51.41, projectCount2024: 37 },
        { district: '兴化市', endNum: 12, invoiceNum: 115.24, taxNum: 6.11, outputNum: 121.06, revenueNum: 120.35, profitNum: 6.27, projectCount2024: 12 },
        { district: '海陵区', endNum: 14, invoiceNum: 117.38, taxNum: 4.09, outputNum: 109.64, revenueNum: 100.84, profitNum: 5.36, projectCount2024: 17 },
        { district: '姜堰区', endNum: 19, invoiceNum: 83.84, taxNum: 4.16, outputNum: 87.19, revenueNum: 85.20, profitNum: 6.75, projectCount2024: 21 },
        { district: '医药高新区（高港区）', endNum: 27, invoiceNum: 259.35, taxNum: 14.13, outputNum: 282.89, revenueNum: 246.82, profitNum: 21.22, projectCount2024: 29 },
      ];
      // const list = records.length > 0 ? records : fallback;
      // 使用默认数据
      const list = fallback;
      const mapped = list.map((it: any, idx: number) => ({
        key: `item-${idx}`,
        district: it?.district,
        name: toShortDistrict(it?.district),
        endNum: Number(it?.endNum ?? 0),
        projectCount2024: Number(it?.projectCount2024 ?? it?.projectCount ?? 0),
        invoiceNum: Number(it?.invoiceNum ?? 0),
        taxNum: Number(it?.taxNum ?? 0),
        outputNum: Number(it?.outputNum ?? 0),
        revenueNum: Number(it?.revenueNum ?? 0),
        profitNum: Number(it?.profitNum ?? 0),
      }));
      const tree = mapped.length > 0 ? [{ ...mapped[0], children: mapped.slice(1) }] : [];
      setCompletionData(tree);

      const addKeysToChildren = (item: any, parentKey: string = '', index: number = 0): any => {
        const key = parentKey ? `${parentKey}-${index}` : `item-${index}`;
        return {
          ...item,
          name: item.districtName ? item.districtName === '医药高新区（高港区）' ? '医药' : item.districtName.substring(0, 2) : '-',
          key,
          children: item.children && item.children.length > 0
            ? item.children.map((child: any, childIndex: number) =>
              addKeysToChildren(child, key, childIndex)
            )
            : undefined
        };
      };

      // 处理响应数据
      let processedData: React.SetStateAction<any[]> = [];
      if (Array.isArray(res)) {
        processedData = res.map((item, index) => addKeysToChildren(item, '', index));
      } else if (res) {
        processedData = [addKeysToChildren(res, '', 0)];
      }

      setDataSource(processedData);

      // 自动展开第一级
      const firstLevelKeys: React.Key[] = processedData.map(item => item.key);
      setExpandedKeys(firstLevelKeys);
      if (processedData && processedData.length > 0) {
        setChartData(processedData[0].children || []);
      }

    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滚动
    });
  };


  useEffect(() => {
    scrollToTop();
    const defaultDate = dayjs("2024-09-01");
    setCurrentDate(defaultDate);
    loadData({
      year: dayjs(defaultDate).year(),
    });
  }, []);

  return (
    <div className={styles.container}>
      {/* 顶部标签切换 */}
      <div className={styles.tabContainer}>
        <Row className={styles.backCon} onClick={() => navigate(-1)}>
          <img
            className={styles.backImg}
            src="/img/tutorial/backBtn.png"
            alt=""
          />
          <div className={styles.backText}>返回</div>
        </Row>
        <Breadcrumb>
          <Breadcrumb.Item>
            <span style={{ color: "#666666" }}>投产达效</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span style={{ color: "#1A237E", fontWeight: 600 }}>产出效益</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.filterContainer}>
        <div className={styles.filterRow}>
          <Radio.Group
            value={year}
            onChange={(e) => {
              const y = Number(e.target.value);
              setYear(y);
              setCurrentDate(dayjs(currentDate).year(y));
              loadData({
                month: dayjs(currentDate).month() + 1,
                year: y,
              });
            }}
            className={styles.radioGroup}
          >
            <Radio value={2023} disabled>2023年</Radio>
            <Radio value={2024}>2024年</Radio>
            <Radio value={2025} disabled>2025年</Radio>
          </Radio.Group>

        </div>
      </div>

      {/* 年竣工情况 */}
      {(!hasAnyTable || chartType === 'table') && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
          <div className={styles.chartLeft} onClick={() => setExpandedSection(expandedSection === 'comp' ? null : 'comp')}>
            <span style={{ marginRight: 8, cursor: "pointer" }}>
              {expandedSection === 'comp' || expandedSection === 'all' ? <UpOutlined /> : <DownOutlined />}
            </span>
            <h3 className={styles.chartTitle}>{year}年竣工情况</h3>
          </div>

            <div className={styles.chartToggle}>
              <Button
                type={chartType === "bar" ? "primary" : "default"}
                size="small"
                onClick={() => {
                  setChartType("bar");
                }}
              >
                图形
              </Button>
              <Button
                type={chartType === "table" ? "primary" : "default"}
                size="small"
                onClick={() => { setChartType("table");setExpandedSection('comp'); setChartType2("bar"); setChartType3("bar"); }}
              >
                表格
              </Button>
            </div>
          </div>

          {/* 图表区域 */}
          <div className={styles.divider}></div>
          {(expandedSection === 'comp' || expandedSection === 'all') && (
          <div className={styles.chartContainer}>
            {chartType === "bar" ? (
              <>
                <ReactECharts
                  ref={chartRef}
                  option={getChartOption()}
                  style={{ height: "340px", width: "100%" }}
                />
              </>
            ) : (
              <div className={styles.tableContainer}>
                <Table
                  columns={columns}
                  dataSource={completionData}
                  loading={false}
                  rowKey={record => record.district}
                  pagination={false}
                  bordered={false}
                  size="middle"
                  className={styles.benchtable}
                  childrenColumnName="children"
                  expandable={{
                    defaultExpandAllRows: true,
                    rowExpandable: (record: any) => Array.isArray(record?.children) && record.children.length > 0,
                  }}
                />
              </div>
            )}
          </div>
          )}
        </div>
      )}


      {/* 年开票及税收情况 */}
      {(!hasAnyTable || chartType2 === 'table') && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartLeft} onClick={() => setExpandedSection(expandedSection === 'invoice' ? null : 'invoice')}>
              <span style={{ marginRight: 8, cursor: "pointer" }}>
                {expandedSection === 'invoice' || expandedSection === 'all' ? <UpOutlined /> : <DownOutlined />}
              </span>
              <h3 className={styles.chartTitle}>{year}年开票及税收情况</h3>
            </div>

            <div className={styles.chartToggle}>
              <Button
                type={chartType2 === "bar" ? "primary" : "default"}
                size="small"
                onClick={() => setChartType2("bar")}
              >
                图形
              </Button>
              <Button
                type={chartType2 === "table" ? "primary" : "default"}
                size="small"
                onClick={() => { setChartType2("table");setExpandedSection('invoice'); setChartType("bar"); setChartType3("bar"); }}
              >
                表格
              </Button>
            </div>
          </div>

          {/* 图表区域 */}
          <div className={styles.divider}></div>
          {(expandedSection === 'invoice' || expandedSection === 'all') && (
          <div className={styles.chartContainer}>
            {chartType2 === "bar" ? (
              <>
                <ReactECharts
                  ref={chartRef2}
                  option={getChartOption2()}
                  style={{ height: "360px", width: "100%" }}
                />
              </>
            ) : (
              <div className={styles.tableContainer}>
                <Table
                  columns={columns2}
                  dataSource={completionData}
                  loading={false}
                  rowKey={record => record.district}
                  pagination={false}
                  bordered={false}
                  size="middle"
                  className={styles.benchtable}
                  childrenColumnName="children"
                  expandable={{
                    defaultExpandAllRows: true,
                    rowExpandable: (record: any) => Array.isArray(record?.children) && record.children.length > 0,
                  }}
                />
              </div>
            )}
          </div>
          )}
        </div>
      )}

      {/* 年产值、营收及利润 */}
      {(!hasAnyTable || chartType3 === 'table') && (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft} onClick={() => setExpandedSection(expandedSection === 'value' ? null : 'value')}>
            <span style={{ marginRight: 8, cursor: "pointer" }}>
              {expandedSection === 'value' || expandedSection === 'all' ? <UpOutlined /> : <DownOutlined />}
            </span>
            <h3 className={styles.chartTitle}>{year}年产值、营收及利润</h3>
          </div>

          <div className={styles.chartToggle}>
            <Button
              type={chartType3 === "bar" ? "primary" : "default"}
              size="small"
              onClick={() => setChartType3("bar")}
            >
              图形
            </Button>
            <Button
              type={chartType3 === "table" ? "primary" : "default"}
              size="small"
              onClick={() => { setChartType3("table");setExpandedSection('value'); setChartType("bar"); setChartType2("bar"); }}
            >
              表格
            </Button>
          </div>
        </div>

        <div className={styles.divider}></div>
        {(expandedSection === 'value' || expandedSection === 'all') && (
        <div className={styles.chartContainer}>
          {chartType3 === "bar" ? (
            <>
              <ReactECharts
                ref={chartRef3}
                option={getChartOption3()}
                style={{ height: "360px", width: "100%" }}
              />
            </>
          ) : (
            <div className={styles.tableContainer}>
              <Table
                columns={columns3}
                dataSource={completionData}
                loading={false}
                rowKey={record => record.district}
                pagination={false}
                bordered={false}
                size="middle"
                className={styles.benchtable}
                childrenColumnName="children"
                expandable={{
                  defaultExpandAllRows: true,
                  rowExpandable: (record: any) => Array.isArray(record?.children) && record.children.length > 0,
                }}
              />
            </div>
          )}
        </div>
        )}
      </div>
      )}

    </div>
  );
};

export default PortfolioInvestment;
