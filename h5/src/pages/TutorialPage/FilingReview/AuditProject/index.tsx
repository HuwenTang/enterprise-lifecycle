/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { Button, Breadcrumb, Row, Form, Table, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import styles from "./index.module.css";
import { CaretUpOutlined, CaretDownOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { DatetimePicker } from "react-vant";
import { primeApi } from "../../../../api.ts";
import dayjs from "dayjs";

/** 与 project-progress 详情页一致：固定默认月份 */
const FIXED_YEAR = 2025;
const FIXED_MONTH = 9;

function getMonthRangeUTC(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));
  return { start, end };
}

/** 从 URL 或指定月份得到 start/end，与 project-progress 一致（默认 2025 年 9 月） */
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

const AuditProject: React.FC = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);
  const chartRef4 = useRef(null);
  const chartRef5 = useRef(null);
  const chartRef6 = useRef(null);

  // 展开/收起：同一时间只展开一个板块。默认展开环评。
  const [expandedSection, setExpandedSection] = useState<null | 'env' | 'energy' | 'security' | 'map' | 'construction'>('env');

  const [searchParams] = useSearchParams();
  const [chartType, setChartType] = useState<"bar" | "table">("bar");
  const [chartType2, setChartType2] = useState<"bar" | "table">("bar");
  const [chartType3, setChartType3] = useState<"bar" | "table">("bar");
  const [chartType4, setChartType4] = useState<"bar" | "table">("bar");
  const [chartType5, setChartType5] = useState<"bar" | "table">("bar");
  const [chartType6, setChartType6] = useState<"bar" | "table">("bar");

  const initialRange = getStartEndFromUrlOrMonth(searchParams);
  const [timeType, setTimeType] = useState<'start' | 'end'>('start');
  const [startDate, setStartDate] = useState(dayjs(initialRange.start));
  const [endDate, setEndDate] = useState(dayjs(initialRange.end));
  const [showMonthModal, setShowMonthModal] = useState(false); // 月份筛选弹窗状态
  const [showCumulativeModal, setShowCumulativeModal] = useState(false); // 金额筛选弹窗状态
  const [showIndustryModal, setShowIndustryModal] = useState(false); // 所属行业弹窗状态
  const [industry, setIndustry] = useState<string>(''); // ''=全部, '1'=服务业, '2'=制造业

  const handleIndustryChange = (e: any) => {
    setIndustry(e?.target?.value ?? '');
  };
  const [money, setMoney] = useState<number>(0); // 金额筛选：0=全部 | 1 | 5 | 10 | -1=自定义
  const [, setShowMoneyInput] = useState(false); // 自定义金额输入框显隐（当前 UI 已注释）
  const [startMoney, setStartMoney] = useState<number | undefined>(undefined); // 起始金额
  const [endMoney, setEndMoney] = useState<number | undefined>(undefined); // 截止金额

  const [form] = Form.useForm();
  const [, setDataSource] = useState<any[]>([]);
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
  const [, setChartData] = useState<any[]>(chartDataBase);
  // 用于“内资项目数及备案投资额”的数据（X轴、柱形、折线）
  const [, setDomesticData] = useState<Array<{ name: string; district: string; count: number; amount: number }>>([]);
  const [, setForeignData] = useState<Array<{ district: string; count: number; amount: number }>>([]);
  // 环形图数据：来自接口 children（district + accumulation.count）
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [reviewTableData, setReviewTableData] = useState<any[]>([]);
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
    return {
      color: colors,
      title: {
        x: "center",
        y: "40%",
        text: "{a|备案数量}\n{b|100%}",
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
        },
      },
      tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}<br/>数量: ${p.value}<br/>占比: ${p.percent}%` },

      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      series: [{
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
        data: pieData,
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
      ]
    };
  };

  const columns = [
    {
      title: "区域",
      dataIndex: 'district',
      key: 'district',
      align: 'center' as const,
    },
    {
      title: "备案项目总数",
      key: 'countTotal',
      align: 'center' as const,
      render: (_: any, record: any) => record?.count?.total ?? 0,
    },
  ]
  const getChartOption2 = () => {
    const colors = ["#5596FF", "#24BD6C"];
    const categories = reviewTableData.map(d => toShortDistrict(d.district));
    const finished = reviewTableData.map(d => (d?.environment?.total ?? 0));
    const unfinished = reviewTableData.map(d => (d?.nonEnvironment?.total ?? 0));
    return {
      color: colors,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any[]) => {
          const name = params?.[0]?.axisValueLabel ?? "";
          const lines = [name];
          params.forEach(p => {
            const valNum = Number(p.value) || 0;
            lines.push(`${p.marker}${p.seriesName}：${valNum}个`);
          });
          return lines.join("<br/>");
        },
      },
      legend: {
        data: ["环评已完成个数", "环评未完成个数"],
        bottom: 0,
        x: "center",
        icon: 'circle',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: { fontSize: 12, color: "rgba(154,159,181,1)",lineHeight: 12 },
      },
      grid: {
        left: "3%",
        right: "8%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: { fontSize: 12, color: "#16151A", interval: 0 },
        axisLine: { lineStyle: { color: "#16151A" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "数量(个)",
        position: "left",
        nameTextStyle: { color: "#16151A" },
        axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "#9A9FB5" } },
      },
      series: [
        {
          name: "环评已完成个数",
          type: "bar",
          data: finished,
          barWidth: "30%",
          itemStyle: { color: "#5596FF" },
        },
        {
          name: "环评未完成个数",
          type: "bar",
          data: unfinished,
          barWidth: "30%",
          itemStyle: { color: "#24BD6C" },
        },
      ],
    };
  };
  const columns2 = [
    { title: '区域', dataIndex: 'district', key: 'district', align: 'center' as const },
    { title: '环评已完成个数', key: 'environmentTotal', align: 'center' as const, render: (_: any, record: any) => record?.environment?.total ?? 0 },
    { title: '环评未完成个数', key: 'nonEnvironmentTotal', align: 'center' as const, render: (_: any, record: any) => record?.nonEnvironment?.total ?? 0 },
  ];
  const getChartOption3 = () => {
    const colors = ["#5596FF", "#24BD6C"];
    const categories = reviewTableData.map(d => toShortDistrict(d.district));
    const finished = reviewTableData.map(d => (d?.energy?.total ?? 0));
    const unfinished = reviewTableData.map(d => (d?.nonEnergy?.total ?? 0));
    return {
      color: colors,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any[]) => {
          const name = params?.[0]?.axisValueLabel ?? "";
          const lines = [name];
          params.forEach(p => {
            const valNum = Number(p.value) || 0;
            lines.push(`${p.marker}${p.seriesName}：${valNum}个`);
          });
          return lines.join("<br/>");
        },
      },
      legend: {
        data: ["能评已完成个数", "能评未完成个数"],
        bottom: 0,
        x: "center",
        itemWidth: 12,
        itemHeight: 12,
        icon: 'circle',
        textStyle: { fontSize: 12, color: "rgba(154,159,181,1)",lineHeight: 12 },
      },
      grid: {
        left: "3%",
        right: "8%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: { fontSize: 12, color: "#16151A", interval: 0 },
        axisLine: { lineStyle: { color: "#16151A" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "数量(个)",
        position: "left",
        nameTextStyle: { color: "#16151A" },
        axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "#9A9FB5" } },
      },
      series: [
        {
          name: "能评已完成个数",
          type: "bar",
          data: finished,
          barWidth: "30%",
          itemStyle: { color: "#5596FF" },
        },
        {
          name: "能评未完成个数",
          type: "bar",
          data: unfinished,
          barWidth: "30%",
          itemStyle: { color: "#24BD6C" },
        },
      ],
    };
  };
  const columns3 = [
    { title: '区域', dataIndex: 'district', key: 'district', align: 'center' as const },
    { title: '能评已完成个数', key: 'energyTotal', align: 'center' as const, render: (_: any, record: any) => record?.energy?.total ?? 0 },
    { title: '能评未完成个数', key: 'nonEnergyTotal', align: 'center' as const, render: (_: any, record: any) => record?.nonEnergy?.total ?? 0 },
  ]

  // 审批安评项目完成情况
  const getChartOption4 = () => {
    const colors = ["#5596FF", "#24BD6C"];
    const categories = reviewTableData.map(d => toShortDistrict(d.district));
    const finished = reviewTableData.map(d => (d?.security?.total ?? 0));
    const unfinished = reviewTableData.map(d => (d?.nonSecurity?.total ?? 0));
    return {
      color: colors,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any[]) => {
          const name = params?.[0]?.axisValueLabel ?? "";
          const lines = [name];
          params.forEach(p => {
            const valNum = Number(p.value) || 0;
            lines.push(`${p.marker}${p.seriesName}：${valNum}个`);
          });
          return lines.join("<br/>");
        },
      },
      legend: {
        data: ["安评已完成个数", "安评未完成个数"],
        bottom: 0,
        x: "center",
        itemWidth: 12,
        itemHeight: 12,
        icon: 'circle',
        textStyle: { fontSize: 12, color: "rgba(154,159,181,1)",lineHeight: 12 },
      },
      grid: {
        left: "3%",
        right: "8%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: { fontSize: 12, color: "#16151A", interval: 0 },
        axisLine: { lineStyle: { color: "#16151A" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "数量(个)",
        position: "left",
        nameTextStyle: { color: "#16151A" },
        axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "#9A9FB5" } },
      },
      series: [
        { name: "安评已完成个数", type: "bar", data: finished, barWidth: "30%", itemStyle: { color: "#5596FF" } },
        { name: "安评未完成个数", type: "bar", data: unfinished, barWidth: "30%", itemStyle: { color: "#24BD6C" } },
      ],
    };
  };
  const columns4 = [
    { title: '区域', dataIndex: 'district', key: 'district', align: 'center' as const },
    { title: '安评已完成个数', key: 'securityTotal', align: 'center' as const, render: (_: any, record: any) => record?.security?.total ?? 0 },
    { title: '安评未完成个数', key: 'nonSecurityTotal', align: 'center' as const, render: (_: any, record: any) => record?.nonSecurity?.total ?? 0 },
  ];

  // 审批施工图审查完成情况
  const getChartOption5 = () => {
    const colors = ["#5596FF", "#24BD6C"];
    const categories = reviewTableData.map(d => toShortDistrict(d.district));
    const finished = reviewTableData.map(d => (d?.map?.total ?? 0));
    const unfinished = reviewTableData.map(d => (d?.nonMap?.total ?? 0));
    return {
      color: colors,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any[]) => {
          const name = params?.[0]?.axisValueLabel ?? "";
          const lines = [name];
          params.forEach(p => {
            const valNum = Number(p.value) || 0;
            lines.push(`${p.marker}${p.seriesName}：${valNum}个`);
          });
          return lines.join("<br/>");
        },
      },
      legend: {
        data: ["施工图审查已完成个数", "施工图审查未完成个数"],
        bottom: 0,
        x: "center",
        itemWidth: 12,
        itemHeight: 12,
        icon: 'circle',
        textStyle: { fontSize: 12, color: "rgba(154,159,181,1)",lineHeight: 12 },
      },
      grid: {
        left: "3%",
        right: "8%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: { fontSize: 12, color: "#16151A", interval: 0 },
        axisLine: { lineStyle: { color: "#16151A" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "数量(个)",
        position: "left",
        nameTextStyle: { color: "#16151A" },
        axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "#9A9FB5" } },
      },
      series: [
        { name: "施工图审查已完成个数", type: "bar", data: finished, barWidth: "30%", itemStyle: { color: "#5596FF" } },
        { name: "施工图审查未完成个数", type: "bar", data: unfinished, barWidth: "30%", itemStyle: { color: "#24BD6C" } },
      ],
    };
  };
  const columns5 = [
    { title: '区域', dataIndex: 'district', key: 'district', align: 'center' as const },
    { title: '施工图审查已完成个数', key: 'mapTotal', align: 'center' as const, render: (_: any, record: any) => record?.map?.total ?? 0 },
    { title: '施工图审查未完成个数', key: 'nonMapTotal', align: 'center' as const, render: (_: any, record: any) => record?.nonMap?.total ?? 0 },
  ];

  // 审批施工许可证完成情况
  const getChartOption6 = () => {
    const colors = ["#5596FF", "#24BD6C"];
    const categories = reviewTableData.map(d => toShortDistrict(d.district));
    const finished = reviewTableData.map(d => (d?.construction?.total ?? 0));
    const unfinished = reviewTableData.map(d => (d?.nonConstruction?.total ?? 0));
    return {
      color: colors,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any[]) => {
          const name = params?.[0]?.axisValueLabel ?? "";
          const lines = [name];
          params.forEach(p => {
            const valNum = Number(p.value) || 0;
            lines.push(`${p.marker}${p.seriesName}：${valNum}个`);
          });
          return lines.join("<br/>");
        },
      },
      legend: {
        data: ["施工许可证已完成个数", "施工许可证未完成个数"],
        bottom: 0,
        x: "center",
        itemWidth: 12,
        itemHeight: 12,
        icon: 'circle',
        textStyle: { fontSize: 12, color: "rgba(154,159,181,1)",lineHeight: 12 },
      },
      grid: {
        left: "3%",
        right: "8%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: { fontSize: 12, color: "#16151A", interval: 0 },
        axisLine: { lineStyle: { color: "#16151A" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "数量(个)",
        position: "left",
        nameTextStyle: { color: "#16151A" },
        axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "#9A9FB5" } },
      },
      series: [
        { name: "施工许可证已完成个数", type: "bar", data: finished, barWidth: "30%", itemStyle: { color: "#5596FF" } },
        { name: "施工许可证未完成个数", type: "bar", data: unfinished, barWidth: "30%", itemStyle: { color: "#24BD6C" } },
      ],
    };
  };
  const columns6 = [
    { title: '区域', dataIndex: 'district', key: 'district', align: 'center' as const },
    { title: '施工许可证已完成个数', key: 'constructionTotal', align: 'center' as const, render: (_: any, record: any) => record?.construction?.total ?? 0 },
    { title: '施工许可证未完成个数', key: 'nonConstructionTotal', align: 'center' as const, render: (_: any, record: any) => record?.nonConstruction?.total ?? 0 },
  ];


  // 表单提交处理：开始时间 = 当月1号，结束时间 = 结束月最后一天（与 project-progress 一致）
  const onFinish = () => {
    const start = new Date(Date.UTC(dayjs(startDate).year(), dayjs(startDate).month(), 1));
    const end = new Date(Date.UTC(dayjs(endDate).year(), dayjs(endDate).month() + 1, 0));
    const payload: { start: Date; end: Date; projectType?: string; minAmount?: number; maxAmount?: number } = { start, end };
    if (industry === '1') payload.projectType = '1';
    else if (industry === '2') payload.projectType = '2';
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
        if (typeof startMoney === 'number') payload.minAmount = startMoney * 10000;
        if (typeof endMoney === 'number') payload.maxAmount = endMoney * 10000;
        break;
      default:
        break;
    }
    loadData(payload);
  };

  // 重置表单：与 project-progress 详情页一致，使用固定默认月份（含 start/end）
  const onReset = () => {
    form.resetFields();
    const { start, end } = getMonthRangeUTC(FIXED_YEAR, FIXED_MONTH);
    setStartDate(dayjs(start));
    setEndDate(dayjs(end));
    form.setFieldsValue({});
    loadData({ start, end });
  };

  const loadData = async (params: { start: Date; end: Date; projectType?: string; minAmount?: number; maxAmount?: number }) => {
    const tree: any = await primeApi.getReviewService({
      start: params.start,
      end: params.end,
      ...(params.projectType !== undefined ? { projectType: params.projectType } : {}),
      ...(params.minAmount !== undefined ? { minAmount: params.minAmount } : {}),
      ...(params.maxAmount !== undefined ? { maxAmount: params.maxAmount } : {}),
    });

    const root = tree || {};
    const children = Array.isArray(root.children) ? root.children : [];

    // 环形图数据：children 的 district + count.total
    setPieData(
      children.map((n: any) => ({
        name: n?.district ?? "",
        value: n?.count?.total ?? 0,
      }))
    );

    // 表格数据：直接使用 children
    setReviewTableData(children);

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
      behavior: 'smooth' // 平滑滚动
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
            <span style={{ color: "#666666" }}>备案审批</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span style={{ color: "#1A237E", fontWeight: 600 }}>审批服务</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.filterContainer}>
        <div className={styles.filterRow}>
          <Button
            className={styles.filterButton}
            onClick={() => {
              setShowMonthModal(!showMonthModal);
              setTimeType('start');
              setShowCumulativeModal(false);
              setShowIndustryModal(false);
            }}
          >
            所属月份
            {showMonthModal ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Button>
          <Button
            className={styles.filterButton}
            onClick={() => {
              setShowCumulativeModal(!showCumulativeModal);
              setShowMonthModal(false);
              setShowIndustryModal(false);
            }}
          >
            金额筛选
            {showCumulativeModal ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Button>
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
          </Button>
        </div>

        {/* 所属月份弹窗 - 与 project-progress 一致，单弹窗内切换开始/结束时间 */}
        {showMonthModal && (
          <div className={styles.modalOverlay} onClick={() => setShowMonthModal(false)}>
            <LockBodyScroll />
            <div className={styles.cumulativeModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalContent}>
                <div className={styles.monthContent}>
                  <div className={styles.monthCon}>
                    {timeType === 'start' && (
                      <>
                        <div className={styles.monthSpan}></div>
                        <div className={styles.monthText}>选择开始时间</div>
                        <div className={styles.monthSpan} onClick={() => setTimeType('end')}>{'结束时间>>'}</div>
                      </>
                    )}
                    {timeType === 'end' && (
                      <>
                        <div className={styles.monthSpan}></div>
                        <div className={styles.monthText}>选择结束时间</div>
                        <div className={styles.monthSpan} onClick={() => setTimeType('start')}>{'开始时间>>'}</div>
                      </>
                    )}
                  </div>
                  {timeType === 'start' && (
                    <DatetimePicker
                      type="year-month"
                      minDate={new Date(2020, 0, 1)}
                      maxDate={new Date(dayjs().year(), dayjs().month(), 1)}
                      value={new Date(dayjs(startDate).year(), dayjs(startDate).month(), 1)}
                      showToolbar={false}
                      onChange={onChangeStart}
                      formatter={(type: string, val: string) => {
                        if (type === "year") return `${val}年`;
                        if (type === "month") return `${val}月`;
                        return val;
                      }}
                    />
                  )}
                  {timeType === 'end' && (
                    <DatetimePicker
                      type="year-month"
                      minDate={new Date(dayjs(startDate).year(), dayjs(startDate).month(), 1)}
                      maxDate={new Date(dayjs().year(), dayjs().month(), 1)}
                      value={new Date(dayjs(endDate).year(), dayjs(endDate).month(), 1)}
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
                  <Button className={styles.resetButton} onClick={() => { setShowMonthModal(false); onReset(); }}>重置</Button>
                  <Button type="primary" className={styles.confirmButton} onClick={() => { setShowMonthModal(false); onFinish(); }}>确定</Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 金额筛选弹窗 */}
        {showCumulativeModal && (
          <div className={styles.modalOverlay} onClick={() => setShowCumulativeModal(false)}>
            <LockBodyScroll />
            <div className={styles.cumulativeModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalContent}>
                <div className={styles.investmentOptions}>
                  <div
                    className={`${styles.investmentOption} ${money === 0 ? styles.selected : ''}`}
                    onClick={() => { setMoney(0); setShowMoneyInput(false); }}
                  >
                    <span>全部</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${money === 1 ? styles.selected : ''}`}
                    onClick={() => { setMoney(1); setShowMoneyInput(false); }}
                  >
                    <span>一亿元</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${money === 5 ? styles.selected : ''}`}
                    onClick={() => { setMoney(5); setShowMoneyInput(false); }}
                  >
                    <span>五亿元</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${money === 10 ? styles.selected : ''}`}
                    onClick={() => { setMoney(10); setShowMoneyInput(false); }}
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
                      onReset();
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => { setShowCumulativeModal(false); onFinish(); }}
                  >
                    确定选定金额
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 所属行业弹窗（新增） */}
        {showIndustryModal && (
          <div className={styles.modalOverlay} onClick={() => setShowIndustryModal(false)}>
            <LockBodyScroll />
            <div className={styles.cumulativeModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalBody}>
                  <Radio.Group value={industry} onChange={handleIndustryChange}>
                    <Radio value=''>全部</Radio>
                    <Radio value='1'>服务业</Radio>
                    <Radio value='2'>制造业</Radio>
                  </Radio.Group>
                </div>

                <div className={styles.modalActions}>
                  <Button
                    className={styles.resetButton}
                    onClick={() => {
                      setIndustry('');
                      setShowIndustryModal(false);
                      onReset();
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => { setShowIndustryModal(false); onFinish(); }}
                  >
                    确 认
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 备案项目数量及占比 */}
      {chartType2 === 'bar' && chartType3 === 'bar' && chartType4 === 'bar' && chartType5 === 'bar' && chartType6 === 'bar' && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartLeft}>
              <h3 className={styles.chartTitle}>备案项目数量及占比</h3>
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
                onClick={() => setChartType("table")}
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
                  rowKey={record => record.district}
                  pagination={false}
                  bordered={false}
                  size="middle"
                  className={styles.benchtable}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 审批项目环评完成情况 */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft} onClick={() => setExpandedSection(expandedSection === 'env' ? null : 'env')}>
            <span style={{ marginRight: 8, cursor: "pointer" }}>
              {expandedSection ? <UpOutlined /> : <DownOutlined />}
            </span>
            <h3 className={styles.chartTitle}>审批项目环评完成情况</h3>
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
              onClick={() => setChartType2("table")}
            >
              表格
            </Button>
          </div>
        </div>
        {/* 图表区域 */}
        {expandedSection === 'env' && (
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
                    rowKey={record => record.district}
                    pagination={false}
                    bordered={false}
                    size="middle"
                    className={styles.benchtable}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 审批项目能评完成情况 */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft} onClick={() => setExpandedSection(expandedSection === 'energy' ? null : 'energy')}>
            <span style={{ marginRight: 8, cursor: "pointer" }}>
              {expandedSection ? <UpOutlined /> : <DownOutlined />}
            </span>
            <h3 className={styles.chartTitle}>审批项目能评完成情况</h3>
          </div>

          <div className={styles.chartToggle}>
            <Button
              type={chartType3 === "bar" ? "primary" : "default"}
              size="small"
              onClick={() => {
                setChartType3("bar");
              }}
            >
              图形
            </Button>
            <Button
              type={chartType3 === "table" ? "primary" : "default"}
              size="small"
              onClick={() => setChartType3("table")}
            >
              表格
            </Button>
          </div>
        </div>

        {/* 图表区域 */}
        {expandedSection === 'energy' && (
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
                    rowKey={record => record.district}
                    pagination={false}
                    bordered={false}
                    size="middle"
                    className={styles.benchtable}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 审批安评项目完成情况 */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft} onClick={() => setExpandedSection(expandedSection === 'security' ? null : 'security')}>
            <span style={{ marginRight: 8, cursor: "pointer" }}>
              {expandedSection ? <UpOutlined /> : <DownOutlined />}
            </span>
            <h3 className={styles.chartTitle}>审批安评项目完成情况</h3>
          </div>
          <div className={styles.chartToggle}>
            <Button type={chartType4 === "bar" ? "primary" : "default"} size="small" onClick={() => setChartType4("bar")}>图形</Button>
            <Button type={chartType4 === "table" ? "primary" : "default"} size="small" onClick={() => setChartType4("table")}>表格</Button>
          </div>
        </div>
        {expandedSection === 'security' && (
          <>
            <div className={styles.divider}></div>
            <div className={styles.chartContainer}>
              {chartType4 === "bar" ? (
                <>
                  <ReactECharts ref={chartRef4} option={getChartOption4()} style={{ height: "360px", width: "100%" }} />
                </>
              ) : (
                <div className={styles.tableContainer}>
                  <Table
                    columns={columns4}
                    dataSource={reviewTableData}
                    loading={false}
                    rowKey={record => record.district}
                    pagination={false}
                    bordered={false}
                    size="middle"
                    className={styles.benchtable}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 审批施工图审查完成情况 */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft} onClick={() => setExpandedSection(expandedSection === 'map' ? null : 'map')}>
            <span style={{ marginRight: 8, cursor: "pointer" }}>
              {expandedSection ? <UpOutlined /> : <DownOutlined />}
            </span>
            <h3 className={styles.chartTitle}>审批施工图审查完成情况</h3>
          </div>
          <div className={styles.chartToggle}>
            <Button type={chartType5 === "bar" ? "primary" : "default"} size="small" onClick={() => setChartType5("bar")}>图形</Button>
            <Button type={chartType5 === "table" ? "primary" : "default"} size="small" onClick={() => setChartType5("table")}>表格</Button>
          </div>
        </div>
        {expandedSection === 'map' && (
          <>
            <div className={styles.divider}></div>
            <div className={styles.chartContainer}>
              {chartType5 === "bar" ? (
                <>
                  <ReactECharts ref={chartRef5} option={getChartOption5()} style={{ height: "360px", width: "100%" }} />
                </>
              ) : (
                <div className={styles.tableContainer}>
                  <Table
                    columns={columns5}
                    dataSource={reviewTableData}
                    loading={false}
                    rowKey={record => record.district}
                    pagination={false}
                    bordered={false}
                    size="middle"
                    className={styles.benchtable}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 审批施工许可证完成情况 */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft} onClick={() => setExpandedSection(expandedSection === 'construction' ? null : 'construction')}>
            <span style={{ marginRight: 8, cursor: "pointer" }}>
              {expandedSection ? <UpOutlined /> : <DownOutlined />}
            </span>
            <h3 className={styles.chartTitle}>审批施工许可证完成情况</h3>
          </div>
          <div className={styles.chartToggle}>
            <Button type={chartType6 === "bar" ? "primary" : "default"} size="small" onClick={() => setChartType6("bar")}>图形</Button>
            <Button type={chartType6 === "table" ? "primary" : "default"} size="small" onClick={() => setChartType6("table")}>表格</Button>
          </div>
        </div>
        {expandedSection === 'construction' && (
          <>
            <div className={styles.divider}></div>
            <div className={styles.chartContainer}>
              {chartType6 === "bar" ? (
                <>
                  <ReactECharts ref={chartRef6} option={getChartOption6()} style={{ height: "360px", width: "100%" }} />
                </>
              ) : (
                <div className={styles.tableContainer}>
                  <Table
                    columns={columns6}
                    dataSource={reviewTableData}
                    loading={false}
                    rowKey={record => record.district}
                    pagination={false}
                    bordered={false}
                    size="middle"
                    className={styles.benchtable}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default AuditProject;
