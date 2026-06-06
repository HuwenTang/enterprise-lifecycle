import React, { useState, useEffect } from "react";
import { useRef } from "react";
import {
  Button,
  Breadcrumb,
  Row,
  Form,
  Table,
  InputNumber,
  Radio,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import styles from "./index.module.css";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { DatetimePicker } from "react-vant";
import { primeApi } from "../../../../api.ts";
import dayjs from "dayjs";

const FIXED_YEAR = 2025;
const FIXED_MONTH = 9;

function getMonthRangeUTC(y: number, m: number) {
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 0));
  return { start, end };
}

function getStartEndFromUrlOrMonth(searchParams: URLSearchParams, month?: dayjs.Dayjs): { start: Date; end: Date } {
  const startStr = searchParams.get("start");
  const endStr = searchParams.get("end");
  if (startStr && endStr) {
    return {
      start: new Date(startStr + "T00:00:00.000Z"),
      end: new Date(endStr + "T00:00:00.000Z"),
    };
  }
  if (month) {
    const y = month.year();
    const m = month.month();
    const lastDay = dayjs(month).endOf("month").date();
    return {
      start: new Date(Date.UTC(y, m, 1)),
      end: new Date(Date.UTC(y, m, lastDay)),
    };
  }
  return getMonthRangeUTC(FIXED_YEAR, FIXED_MONTH);
}

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
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    }

    return () => {
      __scrollLockCount -= 1;
      if (__scrollLockCount === 0) {
        const y = parseInt(document.body.dataset.lockScrollY || "0", 10) || 0;

        // 解除锁定并恢复滚动位置
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        delete document.body.dataset.lockScrollY;

        window.scrollTo(0, y);
      }
    };
  }, []);

  return null;
}

const industryCategoryOptions: Array<{ label: string; value: string }> = [
  { value: "", label: "全部" },
  { value: "1.1.1.0", label: "生物医药" },
  { value: "1.1.1.1", label: "医药" },
  { value: "1.1.1.2", label: "医疗器械" },
  { value: "1.1.2.0", label: "健康食品" },
  { value: "1.1.2.1", label: "特医及功能性食品" },
  { value: "1.1.2.2", label: "农副食品深加工及预制菜" },
  { value: "1.2.1.0", label: "海工装备和高技术船舶" },
  { value: "1.2.1.1", label: "海洋工程装备" },
  { value: "1.2.1.2", label: "高技术船舶" },
  { value: "1.3.1.0", label: "汽车及零部件" },
  { value: "1.3.1.1", label: "汽车及零部件" },
  { value: "1.3.2.0", label: "新一代信息技术和智能装备" },
  { value: "1.3.2.1", label: "电子信息" },
  { value: "1.3.2.2", label: "智能装备" },
  { value: "1.3.2.3", label: "节能环保" },
  { value: "1.3.3.0", label: "化工及新材料" },
  { value: "1.3.3.1", label: "化工及新材料" },
  { value: "1.3.4.0", label: "金属新材料及制品" },
  { value: "1.3.4.1", label: "金属新材料及制品" },
  { value: "1.3.5.0", label: "新能源" },
  { value: "1.3.5.1", label: "新能源" },
  { value: "1.4.1.0", label: "未来产业" },
  { value: "1.4.1.1", label: "合成生物" },
  { value: "1.4.1.2", label: "细胞和基因技术" },
  { value: "1.4.1.3", label: "前沿新材料" },
  { value: "1.4.1.4", label: "新型储能" },
  { value: "1.4.1.5", label: "深海深地空天装备" },
  { value: "1.4.1.6", label: "人工智能" },
  { value: "1.4.1.7", label: "氢能" },
];

const UnderConstructionProject: React.FC = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);

  // 展开/收起：同一时间只展开一个板块。默认展开环评。
  const [expandedSection, setExpandedSection] = useState<
    null | "env" | "energy" | "all"
  >("all");

  const [searchParams, setSearchParams] = useSearchParams();
  const initialArea = searchParams.get("area");
  const initialTitle = searchParams.get("title");
  const [chartType, setChartType] = useState<"bar" | "table">("bar");
  const [chartType2, setChartType2] = useState<"bar" | "table">("bar");
  const [chartType3, setChartType3] = useState<"bar" | "table">("bar");
  // 是否有任一板块处于表格模式
  const hasAnyTable =
    chartType === "table" || chartType2 === "table" || chartType3 === "table";

  // 本月新增 / 累计新增 切换（用于 Radio.Group）
  const [filterType, setFilterType] = useState<"newThisMonth" | "cumulative">(
    "newThisMonth"
  );

  const [selectAreaText, setSelectAreaText] = useState(initialArea);
  const [selectAreaText2, setSelectAreaText2] = useState(initialArea);
  const initialRange = getStartEndFromUrlOrMonth(searchParams);
  const [timeType, setTimeType] = useState<"start" | "end">("start");
  const [startDate, setStartDate] = useState(dayjs(initialRange.start));
  const [endDate, setEndDate] = useState(dayjs(initialRange.end));
  const [showMonthModal, setShowMonthModal] = useState(false); // 月份筛选弹窗状态
  const [showCumulativeModal, setShowCumulativeModal] = useState(false); // 金额筛选弹窗状态
  const [showIndustryModal, setShowIndustryModal] = useState(false); // 所属行业弹窗状态
  const [industry, setIndustry] = useState<string>(""); // ''=全部, '1'=服务业, '2'=制造业
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [sector, setSector] = useState<string>("");
  const [innovativeClusters, setInnovativeClusters] = useState<string>(""); // 所属产业（细分行业编码）

  const handleIndustryChange = (e: any) => {
    setIndustry(e?.target?.value ?? "");
  };
  const [money, setMoney] = useState<number>(0); // 金额筛选：0=全部 | 1 | 5 | 10 | -1=自定义
  const [showMoneyInput, setShowMoneyInput] = useState(false); // 是否展示金额区间输入
  const [startMoney, setStartMoney] = useState<number | undefined>(undefined); // 起始金额
  const [endMoney, setEndMoney] = useState<number | undefined>(undefined); // 截止金额

  // 金额区间输入处理函数
  const changeStart = (val: number | null) => {
    setStartMoney(typeof val === "number" ? val : undefined);
  };
  const changeEnd = (val: number | null) => {
    setEndMoney(typeof val === "number" ? val : undefined);
  };

  type FieldType = {
    currentDate?: string;
  };

  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 地区短名称转换：靖江市→靖江，海陵区→海陵，医药高新区（高港区）→医药
  const toShortDistrict = (d?: string): string => {
    if (!d) return "";
    if (d === "医药高新区（高港区）") return "医药";
    return d.replace(/\s+/g, "").slice(0, 2);
  };

  // 模拟数据 - 根据区域图片优化
  const chartDataBase = [
    {
      name: "全市",
      value: 0,
      value2: 0,
      value3: 0,
      value4: 0,
      value5: 0,
      highlight: true,
    },
    { name: "靖江", value: 0, value2: 0, value3: 0, value4: 0, value5: 0 },
    { name: "泰兴", value: 0, value2: 0, value3: 0, value4: 0, value5: 0 },
    { name: "兴化", value: 0, value2: 0, value3: 0, value4: 0, value5: 0 },
    { name: "海陵", value: 0, value2: 0, value3: 0, value4: 0, value5: 0 },
    { name: "姜堰", value: 0, value2: 0, value3: 0, value4: 0, value5: 0 },
    { name: "医药", value: 0, value2: 0, value3: 0, value4: 0, value5: 0 },
  ];
  const [chartData, setChartData] = useState<any[]>(chartDataBase);
  // 用于“内资项目数及备案投资额”的数据（X轴、柱形、折线）
  const [domesticData, setDomesticData] = useState<
    Array<{ name: string; district: string; count: number; amount: number }>
  >([]);
  const [foreignData, setForeignData] = useState<
    Array<{ district: string; count: number; amount: number }>
  >([]);
  // 环形图数据：来自接口 children（district + accumulation.count）

  const [reviewTableData, setReviewTableData] = useState<any[]>([]);
  // 饼图数据状态：名称用 districtName，值根据筛选项切换
  const [pieData, setPieData] = useState<
    Array<{ name: string; value: number }>
  >([]);
  useEffect(() => {
    // 根据当前筛选类型和表格数据，生成饼图数据
    setPieData(
      reviewTableData.map((n: any) => ({
        name: n?.districtName ?? "",
        value:
          filterType === "newThisMonth"
            ? n?.increasement?.count ?? 0
            : n?.accumulation?.count ?? 0,
      }))
    );
  }, [filterType, reviewTableData]);
  const onChangeStart = (e: any) => setStartDate(dayjs(e));
  const onChangeEnd = (e: any) => setEndDate(dayjs(e));

  const getChartOption = () => {
    const colors = [
      "#ED8E08",
      "#FF5555",
      "#5596FF",
      "#E8E025",
      "#24BD6C",
      "#9D55FF",
    ];
    // 使用预先计算的饼图数据
    const pieDataLocal = pieData;
    return {
      color: colors,
      title: {
        x: "center",
        y: "40%",
        text: "{a|在建项目数量}\n{b|100%}",
        textStyle: {
          rich: {
            a: {
              fontSize: 16,
              color: "rgba(154, 159, 181, .56)",
            },
            b: {
              fontSize: 16,
              color: "rgba(154, 159, 181, .56)",
              padding: [10, 0, 0, 0],
            },
          },
        },
      },
      legend: {
        x: "center",
        left: "15%",
        bottom: 0,
        itemWidth: 12, // 设置图例标记的宽度
        itemHeight: 12, // 设置图例标记的高度
        // itemGrap: 10,
        textStyle: {
          fontSize: 12,
          color: "#16151A",
          lineHeight: 12,
        },
      },
      tooltip: {
        trigger: "item",
        formatter: (p: any) =>
          `${p.name}<br/>数量: ${p.value}<br/>占比: ${p.percent}%`,
      },

      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      series: [
        {
          type: "pie",
          name: "项目数量及占比",
          radius: ["37%", "57%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: true,
          startAngle: 40,
          label: {
            normal: {
              formatter: function (params: any) {
                let str = "";
                switch (params.name) {
                  case "靖江市":
                    str = "{a|" + params.name + "}";
                    break;
                  case "泰兴市":
                    str = "{b|" + params.name + "}";
                    break;
                  case "兴化市":
                    str = "{c|" + params.name + "}";
                    break;
                  case "海陵区":
                    str = "{d|" + params.name + "}";
                    break;
                  case "姜堰区":
                    str = "{e|" + params.name + "}";
                    break;
                  case "医药高新区（高港区）":
                    str = "{f|医药高新区(高港区)}";
                    break;
                  default:
                    break;
                }
                return (
                  str +
                  "\n{t|数量:" +
                  params.value +
                  "}\n{t|占比:" +
                  params.percent +
                  "}%"
                );
              },
              rich: {
                a: {
                  color: "#ED8E08",
                  lineHeight: 20,
                  fontSize: 12,
                },
                b: {
                  color: "#FF5555",
                  lineHeight: 20,
                  fontSize: 12,
                },
                c: {
                  color: "#5596FF",
                  lineHeight: 20,
                  fontSize: 12,
                },
                d: {
                  color: "#E8E025",
                  lineHeight: 20,
                  fontSize: 12,
                },
                e: {
                  color: "#24BD6C",
                  lineHeight: 20,
                  fontSize: 12,
                },
                f: {
                  color: "#9D55FF",
                  lineHeight: 20,
                  fontSize: 12,
                },
                t: {
                  color: "rgba(26, 35, 126, 1)",
                  lineHeight: 20,
                  fontSize: 12,
                },
              },
            },
          },
          data: pieDataLocal,
        },
        // 边框的设置
        {
          radius: ["37%", "41%"],
          center: ["50%", "45%"],
          type: "pie",
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          animation: false,
          tooltip: {
            show: false,
          },
          itemStyle: {
            normal: {
              color: "rgba(250,250,250,0.5)",
            },
          },
          data: [
            {
              value: 1,
            },
          ],
        },
      ],
    };
  };
  const columns = [
    {
      title: "区域",
      key: "region",
      dataIndex: "districtName",
      align: "center" as const,
      render: (_: any, record: any) => {
        const hasChildren =
          Array.isArray(record?.children) && record.children.length > 0;
        return hasChildren
          ? record?.districtName ?? ""
          : record?.parkName ?? record?.districtName ?? "";
      },
    },
    {
      title: "备案项目个数(个)",
      key: "recordCount",
      align: "center" as const,
      render: (_: any, record: any) =>
        filterType === "newThisMonth"
          ? record?.increasement?.count ?? 0
          : record?.accumulation?.count ?? 0,
    },
    {
      title: "计划总投资(亿)",
      key: "plannedInvestment",
      align: "center" as const,
      render: (_: any, record: any) => {
        const amountRaw =
          filterType === "newThisMonth"
            ? record?.increasement?.amount ?? 0
            : record?.accumulation?.amount ?? 0;
        const billion = Math.round((amountRaw / 10000) * 100) / 100;
        return billion;
      },
    },
  ];
  const getChartOption2 = () => {
    const colors = ["#5596FF", "#ED8E08"];
    const list = Array.isArray(reviewTableData) ? reviewTableData : [];
    const xData = list.map((n: any) => toShortDistrict(n?.districtName ?? ""));
    const barData = list.map((n: any) => Number(n?.accumulation?.count ?? 0));
    const lineData = list.map((n: any) =>
      Number((((n?.accumulation?.amount ?? 0) as number) / 10000).toFixed(2))
    );

    return {
      color: colors,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        formatter: (params: any[]) => {
          const name = params?.[0]?.axisValueLabel ?? "";
          const lines = [name];
          params.forEach((p) => {
            const isAmount = String(p.seriesName).includes("投资额");
            const label = isAmount ? "投资额" : "数量";
            const valNum = Number(p.value) || 0;
            const formattedVal = isAmount ? valNum.toFixed(2) : valNum;
            const unit = isAmount ? "亿元" : "个";
            lines.push(`${p.marker}${label}：${formattedVal}${unit}`);
          });
          return lines.join("<br/>");
        },
      },
      legend: {
        data: [{name: "内资项目数量",icon: "circle"},{name: "内资计划投资额", icon: "rect"}],
        bottom: 0,
        // left: "30%",
        // right: "20%",
        x: "center",
        itemWidth: 12,
        itemHeight: 12,
        textStyle: { fontSize: 12, color: "rgba(154,159,181,1)" },
      },
      grid: {
        left: "3%",
        right: "8%",
        bottom: "10%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: xData,
        axisLabel: { fontSize: 12, color: "#16151A" },
        axisLine: { lineStyle: { color: "#16151A" } },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: "value",
          name: "数量(个)",
          position: "left",
          nameTextStyle: { color: "#16151A" },
          axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "#9A9FB5" } },
        },
        {
          type: "value",
          name: "计划投资额(亿元)",
          position: "right",
          nameTextStyle: { color: "#16151A" },
          axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
          axisLine: { show: false },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "内资项目数量",
          type: "bar",
          data: barData,
          barWidth: "40%",
          emphasis: { itemStyle: { color: "#5596FF" } },
        },
        {
          name: "内资计划投资额",
          type: "line",
          yAxisIndex: 1,
          smooth: false,
          symbol: "circle",
          symbolSize: 6,
          data: lineData,
          lineStyle: { width: 2 },
        },
      ],
    };
  };
  const columns2 = [
    {
      title: "区域",
      key: "region",
      dataIndex: "districtName",
      align: "center" as const,
      render: (_: any, record: any) => {
        const hasChildren =
          Array.isArray(record?.children) && record.children.length > 0;
        return hasChildren
          ? record?.districtName ?? ""
          : record?.parkName ?? record?.districtName ?? "";
      },
    },
    {
      title: "内资项目数(个)",
      key: "domesticCount",
      align: "center" as const,
      render: (_: any, record: any) => Number(record?.domestic?.count ?? 0),
    },
    {
      title: "计划总投资(亿)",
      key: "domesticAmount",
      align: "center" as const,
      render: (_: any, record: any) => {
        const amount = Number(record?.domestic?.amount ?? 0);
        return Math.round((amount / 10000) * 100) / 100;
      },
    },
  ];

  const getChartOption3 = () => {
    const colors = ["#5596FF", "#ED8E08"];
    const list = Array.isArray(reviewTableData) ? reviewTableData : [];
    const xData = list.map((n: any) => toShortDistrict(n?.districtName ?? ""));
    const barData = list.map((n: any) => Number(n?.foreign?.count ?? 0));
    const lineData = list.map((n: any) =>
      Number((((n?.foreign?.amount ?? 0) as number) / 10000).toFixed(2))
    );

    return {
      color: colors,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        formatter: (params: any[]) => {
          const name = params?.[0]?.axisValueLabel ?? "";
          const lines = [name];
          params.forEach((p) => {
            const isAmount = String(p.seriesName).includes("投资额");
            const label = isAmount ? "投资额" : "数量";
            const valNum = Number(p.value) || 0;
            const formattedVal = isAmount ? valNum.toFixed(2) : valNum;
            const unit = isAmount ? "亿元" : "个";
            lines.push(`${p.marker}${label}：${formattedVal}${unit}`);
          });
          return lines.join("<br/>");
        },
      },
      legend: {
        data: [{name: "外资项目数量",icon: "circle"},{name: "外资计划投资额", icon: "rect"}],
        bottom: 0,
        // left: "20%",
        // right: "20%",
        x: "center",
        itemWidth: 12,
        itemHeight: 12,
        textStyle: { fontSize: 12, color: "rgba(154,159,181,1)" },
      },
      grid: {
        left: "3%",
        right: "8%",
        bottom: "10%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: xData,
        axisLabel: { fontSize: 12, color: "#16151A" },
        axisLine: { lineStyle: { color: "#16151A" } },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: "value",
          name: "数量(个)",
          position: "left",
          nameTextStyle: { color: "#16151A" },
          axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "#9A9FB5" } },
        },
        {
          type: "value",
          name: "计划投资额(亿元)",
          position: "right",
          nameTextStyle: { color: "#16151A" },
          axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
          axisLine: { show: false },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "外资项目数量",
          type: "bar",
          data: barData,
          barWidth: "40%",
          emphasis: { itemStyle: { color: "#5596FF" } },
        },
        {
          name: "外资计划投资额",
          type: "line",
          yAxisIndex: 1,
          smooth: false,
          symbol: "circle",
          symbolSize: 6,
          data: lineData,
          lineStyle: { width: 2 },
        },
      ],
    };
  };
  const columns3 = [
    {
      title: "区域",
      key: "region",
      dataIndex: "districtName",
      align: "center" as const,
      render: (_: any, record: any) => {
        const hasChildren =
          Array.isArray(record?.children) && record.children.length > 0;
        return hasChildren
          ? record?.districtName ?? ""
          : record?.parkName ?? record?.districtName ?? "";
      },
    },
    {
      title: "外资项目数(个)",
      key: "foreignCount",
      align: "center" as const,
      render: (_: any, record: any) => Number(record?.foreign?.count ?? 0),
    },
    {
      title: "计划总投资(亿)",
      key: "foreignAmount",
      align: "center" as const,
      render: (_: any, record: any) => {
        const amount = Number(record?.foreign?.amount ?? 0);
        return Math.round((amount / 10000) * 100) / 100;
      },
    },
  ];

  // 表单提交处理
  const onFinish = () => {
    const start = new Date(Date.UTC(startDate.year(), startDate.month(), 1));
    const end = new Date(Date.UTC(endDate.year(), endDate.month() + 1, 0));
    const payload: any = { start, end };
    if (industry === "1") payload.projectType = 1;
    else if (industry === "2") payload.projectType = 2;
    switch (money) {
      case 1:
        payload.minAmount = 10000;
        payload.maxAmount = 50000;
        break;
      case 5:
        payload.minAmount = 50000;
        payload.maxAmount = 100000;
        break;
      case 10:
        payload.minAmount = 100000;
        break;
      case -1:
        if (typeof startMoney === "number") payload.minAmount = startMoney * 10000;
        if (typeof endMoney === "number") payload.maxAmount = endMoney * 10000;
        break;
      default:
        break;
    }
    if (innovativeClusters !== "") payload.innovativeClusters = innovativeClusters;
    loadData(payload);
  };

  // 重置表单：与投资进度列表页一致（2025年9月）
  const onReset = () => {
    form.resetFields();
    const { start, end } = getMonthRangeUTC(FIXED_YEAR, FIXED_MONTH);
    setStartDate(dayjs(start));
    setEndDate(dayjs(end));
    form.setFieldsValue({});
    setIndustry("");
    setInnovativeClusters("");
    setMoney(0);
    setShowMoneyInput(false);
    setStartMoney(undefined);
    setEndMoney(undefined);
    setShowCumulativeModal(false);
    loadData({ start, end });
  };

  const loadData = async (params: { start: Date; end: Date; projectType?: number; innovativeClusters?: string; minAmount?: number; maxAmount?: number }) => {
    const tree: any = await primeApi.getUnderConstructionProjects({
      start: params.start,
      end: params.end,
      ...(params.projectType !== undefined
        ? { projectType: params.projectType }
        : {}),
      ...(params.innovativeClusters !== undefined &&
      params.innovativeClusters !== ""
        ? { innovativeClusters: params.innovativeClusters }
        : {}),
      ...(params.minAmount !== undefined
        ? { minAmount: params.minAmount }
        : {}),
      ...(params.maxAmount !== undefined
        ? { maxAmount: params.maxAmount }
        : {}),
    });

    const root = tree || {};
    const children = Array.isArray(root.children) ? root.children : [];

    const prune = (list: any[]): any[] =>
      list.map((n: any) => {
        const next: any = { ...n };
        const sub = Array.isArray(next.children) ? prune(next.children) : [];
        if (sub.length > 0) {
          next.children = sub;
        } else {
          delete next.children;
        }
        return next;
      });

    const prunedChildren = prune(children);
    setReviewTableData(prunedChildren);

    // 饼图数据：名称用 districtName，值按单选项切换
    setPieData(
      children.map((n: any) => ({
        name: n?.districtName ?? "",
        value:
          filterType === "newThisMonth"
            ? n?.increasement?.count ?? 0
            : n?.accumulation?.count ?? 0,
      }))
    );

    const mapNode = (n: any) => ({
      area: n?.district ?? "",
      district: n?.district ?? "",
      actuallyUtilizedForeignCapitalAmount: n?.accumulation?.amount ?? 0,
      contractedForeignCapitalAmount:
        (n?.domestic?.amount ?? 0) + (n?.foreign?.amount ?? 0),
      newEnterpriseCountCurrent: n?.accumulation?.count ?? 0,
      newEnterpriseCountLastYear: 0,
      id: n?.district ?? Math.random().toString(36).slice(2),
    });

    const total = {
      area: "全   市",
      district: "全   市",
      actuallyUtilizedForeignCapitalAmount: root?.accumulation?.amount ?? 0,
      contractedForeignCapitalAmount:
        (root?.domestic?.amount ?? 0) + (root?.foreign?.amount ?? 0),
      newEnterpriseCountCurrent: root?.accumulation?.count ?? 0,
      newEnterpriseCountLastYear: 0,
      id: "total",
    };

    const data = [total, ...children.map(mapNode)];

    const obj = data.filter((item: any) => item.district === "全   市");
    const tableData2 = data.filter((item: any) => item.district !== "全   市");
    const tableData3 = [...obj, ...tableData2];
    setDataSource(tableData3);

    const arr = tableData3.map((item) => {
      return {
        name:
          item.area === "全   市"
            ? "全市"
            : item.area === "医药高新区（高港区）"
            ? "医药"
            : item.area
            ? item.area.substring(0, 2)
            : "",
        district:
          item.area === "全   市"
            ? "全市"
            : item.area === "医药高新区（高港区）"
            ? "医药高新区(高港区)"
            : item.area,
        ...item,
      };
    });
    const obj2 = arr.filter((item: any) => item.district === "全市");
    const arr2 = arr.filter((item: any) => item.district !== "全市");
    const arr3 = [...obj2, ...arr2];
    setChartData(arr3);

    // 构造“内资项目数及备案投资额”所需数据（亿元）
    const toShort = (d: string) => {
      if (!d) return "";
      if (d === "医药高新区（高港区）") return "医药";
      return d.slice(0, 2);
    };
    setDomesticData(
      children.map((c: any) => ({
        name: toShort(c?.district ?? ""),
        district: c?.district ?? "",
        count: c?.domestic?.count ?? 0,
        amount: (c?.domestic?.amount ?? 0) / 10000,
      }))
    );

    // 外资数据（亿元）
    setForeignData(
      children.map((c: any) => ({
        district: c?.district ?? "",
        count: c?.foreign?.count ?? 0,
        amount: (c?.foreign?.amount ?? 0) / 10000,
      }))
    );
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 平滑滚动
    });
  };

  useEffect(() => {
    scrollToTop();
    const { start, end } = getStartEndFromUrlOrMonth(searchParams);
    setStartDate(dayjs(start));
    setEndDate(dayjs(end));
    loadData({ start, end });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <span style={{ color: "#666666" }}>投资进度</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span style={{ color: "#1A237E", fontWeight: 600 }}>在建项目</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.filterContainer}>
        <div className={styles.filterRow}>
          <Radio.Group
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as "newThisMonth" | "cumulative");
            }}
            className={styles.radioGroup}
          >
            <Radio value="newThisMonth">本月新增</Radio>
            <Radio value="cumulative">累计新增</Radio>
          </Radio.Group>
          <div className={styles.shuxian}></div>
          <Button
            className={styles.filterButton}
            onClick={() => {
              setShowMonthModal(!showMonthModal);
              setShowCumulativeModal(false);
              setShowIndustryModal(false);
            }}
          >
            所属月份
            {showMonthModal ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Button>
          <div className={styles.shuxian}></div>
          <Button
            className={styles.filterButton}
            onClick={() => {
              setShowCumulativeModal(!showCumulativeModal);
              setShowMonthModal(false);
              setShowIndustryModal(false);
            }}
          >
            更多筛选
            {showCumulativeModal ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Button>
          {/* <div className={styles.shuxian}></div>
          <Button
            className={styles.filterButton}
            onClick={() => {
              setShowIndustryModal(!showIndustryModal);
              setShowMonthModal(false);
              setShowCumulativeModal(false);
            }}
          >
            所属行业
            {showIndustryModal ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Button> */}
        </div>

        {/* 所属月份弹窗 */}
        {showMonthModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowMonthModal(false)}
          >
            <LockBodyScroll />
            <div
              className={styles.cumulativeModal}
              onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalContent}>
                  <div className={styles.monthContent}>
                    <div className={styles.monthCon}>
                      {timeType === "start" && (
                        <>
                          <div className={styles.monthSpan} />
                          <div className={styles.monthText}>选择开始时间</div>
                          <div className={styles.monthSpan} onClick={() => setTimeType("end")}>
                            结束时间&gt;&gt;
                          </div>
                        </>
                      )}
                      {timeType === "end" && (
                        <>
                          <div className={styles.monthSpan} />
                          <div className={styles.monthText}>选择结束时间</div>
                          <div className={styles.monthSpan} onClick={() => setTimeType("start")}>
                            开始时间&gt;&gt;
                          </div>
                        </>
                      )}
                    </div>
                    {timeType === "start" && (
                      <DatetimePicker
                        type="year-month"
                        minDate={new Date(2020, 0, 1)}
                        maxDate={new Date(dayjs().year(), dayjs().month(), 1)}
                        value={new Date(startDate.year(), startDate.month(), 1)}
                        showToolbar={false}
                        onChange={onChangeStart}
                        formatter={(type: string, val: string) => {
                          if (type === "year") return `${val}年`;
                          if (type === "month") return `${val}月`;
                          return val;
                        }}
                      />
                    )}
                    {timeType === "end" && (
                      <DatetimePicker
                        type="year-month"
                        minDate={new Date(startDate.year(), startDate.month(), 1)}
                        maxDate={new Date(dayjs().year(), dayjs().month(), 1)}
                        value={new Date(endDate.year(), endDate.month(), 1)}
                        showToolbar={false}
                        onChange={onChangeEnd}
                        formatter={(type: string, val: string) => {
                          if (type === "year") return `${val}年`;
                          if (type === "month") return `${val}月`;
                          return val;
                        }}
                      />
                    )}
                  </div>

                <div className={styles.modalActions}>
                  <Button
                    className={styles.resetButton}
                    onClick={() => {
                      setShowMonthModal(false);
                      onReset();
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => {
                      setShowMonthModal(false);
                      onFinish();
                    }}
                  >
                    确定
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 金额筛选弹窗 */}
        {showCumulativeModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowCumulativeModal(false)}
          >
            <LockBodyScroll />
            <div
              className={styles.cumulativeModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalContent}>
                <div
                  style={{ marginRight: 8, color: "#16151A", marginBottom: 12 }}
                >
                  金额筛选：
                </div>
                <div className={styles.investmentOptions}>
                  <div
                    className={`${styles.investmentOption} ${
                      money === 0 ? styles.selected : ""
                    }`}
                    onClick={() => {
                      setMoney(0);
                      setShowMoneyInput(false);
                    }}
                  >
                    <span>全部</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${
                      money === 1 ? styles.selected : ""
                    }`}
                    onClick={() => {
                      setMoney(1);
                      setShowMoneyInput(false);
                    }}
                  >
                    <span>一亿元</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${
                      money === 5 ? styles.selected : ""
                    }`}
                    onClick={() => {
                      setMoney(5);
                      setShowMoneyInput(false);
                    }}
                  >
                    <span>五亿元</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${
                      money === 10 ? styles.selected : ""
                    }`}
                    onClick={() => {
                      setMoney(10);
                      setShowMoneyInput(false);
                    }}
                  >
                    <span>十亿元</span>
                  </div>
                  {/* <div
                    className={`${styles.investmentOption} ${money === -1 ? styles.selected : ''}`}
                    onClick={() => { setMoney(-1); setShowMoneyInput(true); }}
                  >
                    <span>自定义金额</span>
                  </div> */}
                </div>

                <div style={{ paddingTop: 12, paddingBottom: 24 }}>
                  <span style={{ marginRight: 8, color: "#16151A" }}>
                    所属产业：
                  </span>
                  <Select
                    options={industryCategoryOptions}
                    value={innovativeClusters}
                    onChange={(v) => setInnovativeClusters(v ?? "")}
                    placeholder="请选择所属产业"
                    style={{ width: "100%", marginTop: 12 }}
                    allowClear
                  />
                </div>

                {/* {showMoneyInput && (
                  <div className={styles.moneyCon}>
                    <InputNumber addonAfter="亿元" value={startMoney} onChange={changeStart} />
                    <div className={styles.middleText}>至</div>
                    <InputNumber addonAfter="亿元" value={endMoney} onChange={changeEnd} />
                  </div>
                )} */}

                <div className={styles.modalActions}>
                  <Button
                    className={styles.resetButton}
                    onClick={() => {
                      setMoney(0);
                      setShowMoneyInput(false);
                      setStartMoney(undefined);
                      setEndMoney(undefined);
                      setShowCumulativeModal(false);
                      setInnovativeClusters("");
                      setIndustry(""); // 同步清空所属产业
                      onReset();
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => {
                      setShowCumulativeModal(false);
                      onFinish();
                    }}
                  >
                    确定
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 所属行业弹窗（新增） */}
        {showIndustryModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowIndustryModal(false)}
          >
            <LockBodyScroll />
            <div
              className={styles.cumulativeModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalBody}>
                  <Radio.Group value={industry} onChange={handleIndustryChange}>
                    <Radio value="">全部</Radio>
                    <Radio value="1">服务业</Radio>
                    <Radio value="2">制造业</Radio>
                  </Radio.Group>
                </div>

                <div className={styles.modalActions}>
                  <Button
                    className={styles.resetButton}
                    onClick={() => {
                      // 清空所属产业与金额筛选，并关闭弹窗
                      setIndustry("");
                      setInnovativeClusters("");
                      setMoney(0);
                      setShowMoneyInput(false);
                      setStartMoney(undefined);
                      setEndMoney(undefined);
                      setShowIndustryModal(false);
                      // 重新获取数据（仅传年/月，不传 innovativeClusters/minAmount/maxAmount）
                      onReset();
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => {
                      setShowIndustryModal(false);
                      onFinish();
                    }}
                  >
                    确 认
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 本年新增在建项目情况 */}
      {(!hasAnyTable || chartType === "table") && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartLeft}>
              <h3 className={styles.chartTitle}>本年新增在建项目情况</h3>
            </div>

            <div className={styles.chartToggle}>
              <Button
                type={chartType === "bar" ? "primary" : "default"}
                size="small"
                onClick={() => setChartType("bar")}
              >
                图形
              </Button>
              <Button
                type={chartType === "table" ? "primary" : "default"}
                size="small"
                onClick={() => {
                  setChartType("table");
                  setChartType2("bar");
                  setChartType3("bar");
                }}
              >
                表格
              </Button>
            </div>
          </div>

          {/* 图表区域 */}
          <div className={styles.divider}></div>
          <div className={styles.chartContainer}>
            {chartType === "bar" ? (
              <>
                <ReactECharts
                  ref={chartRef}
                  option={getChartOption()}
                  style={{ height: "350px", width: "100%" }}
                />
              </>
            ) : (
              <div className={styles.tableContainer}>
                <Table
                  columns={columns}
                  dataSource={reviewTableData}
                  loading={false}
                  rowKey={(record: any) =>
                    record?.parkName
                      ? `park:${record?.districtName}:${record?.parkName}`
                      : `district:${record?.districtName}`
                  }
                  pagination={false}
                  bordered={false}
                  size="middle"
                  className={styles.benchtable}
                  childrenColumnName="children"
                  expandable={{
                    rowExpandable: (record: any) =>
                      Array.isArray(record?.children) &&
                      record.children.length > 0,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 内资项目数及计划投资额 */}
      {(!hasAnyTable || chartType2 === "table") && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div
              className={styles.chartLeft}
              onClick={() =>
                setExpandedSection(expandedSection === "env" ? null : "env")
              }
            >
              <span style={{ marginRight: 8, cursor: "pointer" }}>
                {expandedSection === "env" || expandedSection === "all" ? (
                  <UpOutlined />
                ) : (
                  <DownOutlined />
                )}
              </span>
              <h3 className={styles.chartTitle}>内资项目数及计划投资额</h3>
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
                onClick={() => {
                  setChartType2("table");
                  setChartType("bar");
                  setChartType3("bar");
                }}
              >
                表格
              </Button>
            </div>
          </div>
          {/* 图表区域 */}
          {(expandedSection === "env" || expandedSection === "all") && (
            <>
              <div className={styles.divider}></div>
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
                      dataSource={reviewTableData}
                      loading={false}
                      rowKey={(record: any) =>
                        record?.parkName
                          ? `park:${record?.districtName}:${record?.parkName}`
                          : `district:${record?.districtName}`
                      }
                      pagination={false}
                      bordered={false}
                      size="middle"
                      className={styles.benchtable}
                      childrenColumnName="children"
                      expandable={{
                        rowExpandable: (record: any) =>
                          Array.isArray(record?.children) &&
                          record.children.length > 0,
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* 外资项目数及计划投资额 */}
      {(!hasAnyTable || chartType3 === "table") && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div
              className={styles.chartLeft}
              onClick={() =>
                setExpandedSection(
                  expandedSection === "energy" ? null : "energy"
                )
              }
            >
              <span style={{ marginRight: 8, cursor: "pointer" }}>
                {expandedSection === "energy" || expandedSection === "all" ? (
                  <UpOutlined />
                ) : (
                  <DownOutlined />
                )}
              </span>
              <h3 className={styles.chartTitle}>外资项目数及计划投资额</h3>
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
                onClick={() => {
                  setChartType3("table");
                  setChartType("bar");
                  setChartType2("bar");
                }}
              >
                表格
              </Button>
            </div>
          </div>

          {/* 图表区域 */}
          {(expandedSection === "energy" || expandedSection === "all") && (
            <>
              <div className={styles.divider}></div>
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
                      dataSource={reviewTableData}
                      loading={false}
                      rowKey={(record: any) =>
                        record?.parkName
                          ? `park:${record?.districtName}:${record?.parkName}`
                          : `district:${record?.districtName}`
                      }
                      pagination={false}
                      bordered={false}
                      size="middle"
                      className={styles.benchtable}
                      childrenColumnName="children"
                      expandable={{
                        rowExpandable: (record: any) =>
                          Array.isArray(record?.children) &&
                          record.children.length > 0,
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UnderConstructionProject;
