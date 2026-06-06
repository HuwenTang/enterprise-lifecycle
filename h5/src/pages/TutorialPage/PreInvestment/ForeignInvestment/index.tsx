import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { Button, Breadcrumb, Row, Form, Table, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import styles from "./index.module.css";
import {
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { DatetimePicker } from "react-vant";
import { primeApi } from "../../../../api.ts";
import dayjs from "dayjs";
import zhCN from "antd/es/date-picker/locale/zh_CN";

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

const ForeignInvestmentProjects: React.FC = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);
  const chartRef4 = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialArea = searchParams.get("area");
  const initialTitle = searchParams.get("title");
  const [chartType, setChartType] = useState<"bar" | "table">("bar");
  const [chartType2, setChartType2] = useState<"bar" | "table">("bar");
  const [chartType3, setChartType3] = useState<"bar" | "table">("bar");
  const [chartType4, setChartType4] = useState<"bar" | "table">("bar");

  const [selectAreaText, setSelectAreaText] = useState(initialArea);
  const [selectAreaText2, setSelectAreaText2] = useState(initialArea);
  const [currentDate, setCurrentDate] = useState(dayjs("2025-12-01"));
  const [showMonthModal, setShowMonthModal] = useState(false); // 月份筛选弹窗状态

  type FieldType = {
    currentDate?: string;
  };

  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<any[]>([]);

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
  const onChange = (e: any) => {
    setCurrentDate(dayjs(e));
  };
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
        text: "{a|外资占比}\n{b|100%}",
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
      tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}<br/>金额: ${p.value}<br/>占比: ${p.percent}%` },

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
                "\n{t|金额:" +
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
        data: chartData.filter(item => item.name !== '全市').map((item) => ({
          name: item.area,
          value: parseFloat(item.actuallyUtilizedForeignCapitalAmount) || 0,
        })),
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
      dataIndex: 'name',
      key: 'name',
      align: 'center' as const,
    },
    {
      title: "金额(万美元)",
      dataIndex: 'actuallyUtilizedForeignCapitalAmount',
      key: 'actuallyUtilizedForeignCapitalAmount',
      align: 'center' as const,
    },
  ]
  const getChartOption2 = () => {
    const color = ["#5596FF", "#24BD6C"];
    return {
      color: color,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: ["实际使用外资", "合同外资"],
        bottom: 0,
        x: "center",
        itemWidth: 12,  // 设置图例标记的宽度
        itemHeight: 12, // 设置图例标记的高度
        textStyle: {
          fontSize: 12,
          color: "rgba(154, 159, 181, 1)",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "10%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData.filter(item => item.name !== '全市').map((item) => item.name),
        axisLabel: {
          fontSize: 12,
          color: "#16151A",
        },
        axisLine: {
          lineStyle: {
            color: "#16151A",
          },
        },
        axisTick: {
          show: false
        },
      },
      yAxis: {
        type: "value",
        name: "金额(万美元)",
        position: "left",
        nameTextStyle: {
          color: "#16151A",
        },
        axisLabel: {
          formatter: "{value}",
          fontSize: 12,
          // color: '#666'
          color: "#16151A",
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: "#9A9FB5",
          },
        },
      },
      series: [
        {
          name: '实际使用外资',
          type: 'bar',
          legend: {
            icon: 'circle'
          },
          data: chartData.filter(item => item.name !== '全市').map((item, index) => parseFloat(item.actuallyUtilizedForeignCapitalAmount) || 0),
          barWidth: '30%',
          emphasis: {
            itemStyle: {
              color: '#5596FF'
            }
          },
        },
        {
          name: '合同外资',
          type: 'bar',
          legend: {
            icon: 'circle'
          },
          data: chartData.filter(item => item.name !== '全市').map((item, index) => parseFloat(item.contractedForeignCapitalAmount) || 0),
          barWidth: '30%',
          emphasis: {
            itemStyle: {
              color: '#24BD6C'
            }
          },
        },
      ],
    };
  };
  const columns2 = [
    {
      title: "区域",
      dataIndex: 'name',
      key: 'name',
      align: 'center' as const,
    },
    {
      title: "实际使用外资",
      dataIndex: 'actuallyUtilizedForeignCapitalAmount',
      key: 'actuallyUtilizedForeignCapitalAmount',
      align: 'center' as const,
    },
    {
      title: "合同外资",
      dataIndex: 'contractedForeignCapitalAmount',
      key: 'contractedForeignCapitalAmount',
      align: 'center' as const,
    },
  ]
  const getChartOption3 = () => {
    const color = ["#5596FF"];
    return {
      color: color,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        show: false
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData.filter(item => item.name !== '全市').map((item) => item.name),
        axisLabel: {
          fontSize: 12,
          color: "#16151A",
        },
        axisLine: {
          lineStyle: {
            color: "#16151A",
          },
        },
        axisTick: {
          show: false
        },
      },
      yAxis: {
        type: "value",
        name: "企业数量(个)",
        position: "left",
        nameTextStyle: {
          color: "#16151A",
        },
        axisLabel: {
          formatter: "{value}",
          fontSize: 12,
          // color: '#666'
          color: "#16151A",
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: "#9A9FB5",
          },
        },
      },
      series: [
        {
          name: '企业数量',
          type: 'bar',
          legend: {
            icon: 'circle'
          },
          data: chartData.filter(item => item.name !== '全市').map((item, index) => parseFloat(item.newEnterpriseCountCurrent) || 0),
          barWidth: '30%',
          emphasis: {
            itemStyle: {
              color: '#5596FF'
            }
          },
        },
      ],
    };
  };
  const columns3 = [
    {
      title: "区域",
      dataIndex: 'name',
      key: 'name',
      align: 'center' as const,
    },
    {
      title: "当期",
      dataIndex: 'newEnterpriseCountCurrent',
      key: 'newEnterpriseCountCurrent',
      align: 'center' as const,
    },
    {
      title: "去年同期",
      dataIndex: 'newEnterpriseCountLastYear',
      key: 'newEnterpriseCountLastYear',
      align: 'center' as const,
    },
  ]
  const regionData = [
    { name: '香港', value: 329, index: 0 },
    { name: '台湾', value: 74, index: 1 },
    { name: '美国', value: 71, index: 2 },
    { name: '新加坡', value: 42, index: 3 },
    { name: '日本', value: 41, index: 4 },
    { name: '韩国', value: 39, index: 5 },
    { name: '英国', value: 17, index: 6 },
    { name: '德国', value: 16, index: 7 },
    { name: '加拿大', value: 16, index: 8 },
    { name: '澳大利亚', value: 11, index: 10 },
    { name: '萨摩亚', value: 11, index: 11 },
    { name: '英属维尔京群岛', value: 23, index: 12 },
    { name: '其他', value: 104, index: 13 },
  ];

  const columns4 = [
    {
      title: "区域",
      dataIndex: 'name',
      key: 'name',
      align: 'center' as const,
    },
    {
      title: "项目数量",
      dataIndex: 'value',
      key: 'value',
      align: 'center' as const,
    },
  ]
  const getChartOption4 = () => {
    const colors = [
      "#ED8E08",
      "#FF5555",
      "#5596FF",
      "#E8E025",
      "#24BD6C",
      "#9D55FF",
      "#F0BCA7",
      "#B460A4",
      "#EA7CCC",
      "#5470C6",
      "#9FE080",
      "#30E5DF",
      "#FF8686",
    ];
    // 地区分布数据
    return {
      color: colors,
      title: {
        x: "center",
        y: "40%",
        text: "{a|项目来源地}\n{b|100%}",
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
        left: "10%",
        right: "10%",
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
        bottom: "30%",
        top: "15%",
        containLabel: false,
      },
      series: [{
        type: "pie",
        name: "项目数量及占比",
        radius: ["37%", "57%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: true,
        startAngle: 10,
        minShowLabelAngle: 8,
        label: {
          color: function (params: any) { return colors[params.dataIndex]; },
          formatter: function (params: any) {
            // console.log('params---',params);
            let str = ''
            const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm']
            str = str = "{" + arr[params.dataIndex] + "|" + params.name + "}";
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
            g: {
              color: "#F0BCA7",
              lineHeight: 20,
              fontSize: 12,
            },
            h: {
              color: "#B460A4",
              lineHeight: 20,
              fontSize: 12,
            },
            if: {
              color: "#EA7CCC",
              lineHeight: 20,
              fontSize: 12,
            },
            j: {
              color: "#5470C6",
              lineHeight: 20,
              fontSize: 12,
            },
            k: {
              color: "#9FE080",
              lineHeight: 20,
              fontSize: 12,
            },
            l: {
              color: "#30E5DF",
              lineHeight: 20,
              fontSize: 12,
            },
            m: {
              color: "#FF8686",
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
        data: regionData,
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

  // 表单提交处理
  const onFinish = () => {
    loadData({
      month: dayjs(currentDate).month() + 1,
      page: 1,
      size: 500,
      year: dayjs(currentDate).year(),
    });
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
    setCurrentDate(dayjs("2025-12-01"));
    form.setFieldsValue({
      currentDate: dayjs("2025-12-01"),
    });
    loadData({
      month: 12,
      page: 1,
      size: 500,
      year: 2025,
    });
  };

  const loadData = async (params: any) => {
    console.log("loadData----");
    const res = await primeApi.listForeignCapitalUtilization(params);
    const data = res?.records || [];

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
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滚动
    });
  };

  useEffect(() => {
    scrollToTop();
    const defaultDate = dayjs("2025-12-01");
    setCurrentDate(defaultDate);
    loadData({
      month: 12,
      page: 1,
      size: 500,
      year: 2025,
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
            <span style={{ color: "#666666" }}>前期招商</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span style={{ color: "#1A237E", fontWeight: 600 }}>利用外资</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.filterContainer}>
        <div className={styles.filterRow}>
          {/* <Radio.Group
            value={filterType}
            onChange={(e) => {setFilterType(e.target.value);}}
            className={styles.radioGroup}
          >
            <Radio value="newThisMonth">本月新增</Radio>
            <Radio value="cumulative">累计新增</Radio>
          </Radio.Group>
          <div className={styles.shuxian}></div> */}
          <Button
            className={styles.filterButton}
            onClick={() => {
              setShowMonthModal(!showMonthModal);
            }}
          >
            所属月份
            {showMonthModal ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Button>
        </div>

        {/* 所属月份弹窗 */}
        {showMonthModal && (
          <div className={styles.modalOverlay} onClick={() => setShowMonthModal(false)}>
            <LockBodyScroll />
            <div
              className={styles.cumulativeModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalContent}>
                <div className={styles.monthContent}>
                  <div className={styles.monthCon}>
                    <div className={styles.monthSpan}></div>
                    <div className={styles.monthText}>选择时间</div>
                    <div className={styles.monthSpan}></div>
                  </div>
                  <DatetimePicker
                    type="year-month"
                    minDate={new Date(2020, 0, 1)}
                    maxDate={new Date(dayjs().year(), dayjs().month(), 1)}
                    value={
                      new Date(
                        dayjs(currentDate).year(),
                        dayjs(currentDate).month(),
                        1
                      )
                    }
                    showToolbar={false}
                    onChange={onChange}
                    formatter={(type: string, val: string) => {
                      if (type === "year") {
                        return `${val}年`;
                      }
                      if (type === "month") {
                        return `${val}月`;
                      }
                      return val;
                    }}
                  />
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
        {/* 所属月份弹窗 */}
      </div>

      {/* 外资占比分布 */}
      {chartType2 === 'bar' && chartType3 === 'bar' && chartType4 === 'bar' && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartLeft}>
              <h3 className={styles.chartTitle}>外资占比分布</h3>
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
                  style={{ height: "340px", width: "100%" }}
                />
              </>
            ) : (
              <div className={styles.tableContainer}>
                <Table
                  columns={columns}
                  dataSource={chartData}
                  loading={false}
                  rowKey={record => record.id}
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
      {/* 外资占比分布 */}

      {/* 外资使用情况 */}
      {chartType === 'bar' && chartType3 === 'bar' && chartType4 === 'bar' && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartLeft}>
              <h3 className={styles.chartTitle}>外资使用情况</h3>
            </div>

            <div className={styles.chartToggle}>
              <Button
                type={chartType2 === "bar" ? "primary" : "default"}
                size="small"
                onClick={() => {
                  setChartType2("bar");
                }}
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
          <div className={styles.divider}></div>
          <div className={styles.chartContainer}>
            {chartType2 === "bar" ? (
              <>
                <ReactECharts
                  ref={chartRef2}
                  option={getChartOption2()}
                  style={{ height: "340px", width: "100%" }}
                />
              </>
            ) : (
              <div className={styles.tableContainer}>
                <Table
                  columns={columns2}
                  dataSource={chartData}
                  loading={false}
                  rowKey={record => record.id}
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
      {/* 外资使用情况 */}

      {/* 新设外资企业数 */}
      {chartType2 === 'bar' && chartType === 'bar' && chartType4 === 'bar' && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartLeft}>
              <h3 className={styles.chartTitle}>新设外资企业数</h3>
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
          <div className={styles.divider}></div>
          <div className={styles.chartContainer}>
            {chartType3 === "bar" ? (
              <>
                <ReactECharts
                  ref={chartRef3}
                  option={getChartOption3()}
                  style={{ height: "340px", width: "100%" }}
                />
              </>
            ) : (
              <div className={styles.tableContainer}>
                <Table
                  columns={columns3}
                  dataSource={chartData}
                  loading={false}
                  rowKey={record => record.id}
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
      {/* 新设外资企业数 */}

      {/* 外资项目来源地 */}
      {chartType2 === 'bar' && chartType === 'bar' && chartType3 === 'bar' && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartLeft}>
              <h3 className={styles.chartTitle}>外资项目来源地</h3>
            </div>

            <div className={styles.chartToggle}>
              <Button
                type={chartType4 === "bar" ? "primary" : "default"}
                size="small"
                onClick={() => {
                  setChartType4("bar");
                }}
              >
                图形
              </Button>
              <Button
                type={chartType4 === "table" ? "primary" : "default"}
                size="small"
                onClick={() => setChartType4("table")}
              >
                表格
              </Button>
            </div>
          </div>

          {/* 图表区域 */}
          <div className={styles.divider}></div>
          <div className={styles.chartContainer}>
            {chartType4 === "bar" ? (
              <>
                <ReactECharts
                  ref={chartRef4}
                  option={getChartOption4()}
                  style={{ height: "440px", width: "100%" }}
                />
              </>
            ) : (
              <div className={styles.tableContainer}>
                <Table
                  columns={columns4}
                  dataSource={regionData}
                  loading={false}
                  rowKey={record => record.index}
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
      {/* 外资项目来源地 */}
    </div>
  );
};

export default ForeignInvestmentProjects;
