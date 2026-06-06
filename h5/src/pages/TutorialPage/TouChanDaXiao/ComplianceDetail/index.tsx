import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { Button,message, Breadcrumb, Row, Table } from "antd";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import styles from "./index.module.css";


const ComplianceDetail: React.FC = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);

  const [chartType, setChartType] = useState<"bar" | "table">("bar");
  const [chartType2, setChartType2] = useState<"bar" | "table">("bar");
  const [chartType3, setChartType3] = useState<"bar" | "table">("bar");

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);


  const [chartData, setChartData] = useState<any[]>([]);

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
        text: "{a|全市规上工业}\n{b|企业数}",
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
        // itemGrap: 20,
        textStyle: {
          fontSize: 12,
          color: "#16151A",
          lineHeight: 12
        },
      },
      tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}<br/>数量: ${p.value}` },

      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      series: [{
        type: "pie",
        name: "企业数",
        radius: ["37%", "57%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: true,
        startAngle: 80,
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
                case "医药高新区(高港区)":
                  str = "{f|医药高新区(高港区)}";
                  break;
                default:
                  break;
              }
              return (
                str +
                "\n{t|数量:" +
                params.value +
                "}"
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
        data: chartData&&chartData.length>0? chartData.map(item=>({
          name: item.district,
          value: item.progress1
        })):[],
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
      title: <>全市规上工业企业数(家)</>,
      dataIndex: 'progress1',
      key: 'progress1',
      align: 'center' as const,
    },
  ]
  const getChartOption2 = () => {
    const colors = ["#5596FF"]; // 柱：蓝色；线：橙色
    return {
      color: colors,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      legend: {
        show:false
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: "3%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData&&chartData.length>0? chartData.map(d => d.name):[],
        axisLabel: { fontSize: 12, color: "#16151A" },
        axisLine: { lineStyle: { color: "#16151A" } },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: "value",
          name: "数量(家)",
          nameTextStyle: { color: "#16151A" },
          axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "#9A9FB5" } },
        },
      ],
      series: [
        {
          name:  "企业数",
          type: "bar",
          data: chartData.map(d => d.progressFebSep),
          barWidth: "30%",
          emphasis: { itemStyle: { color: "#5596FF" } },
        },
      ],
    };
  };
  const columns2 = [
    {
      title: '区域',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: <>2025年进规企业数(家)</>,
      dataIndex: 'progressFebSep',
      key: 'progressFebSep',
      align: 'center',
    }
  ];

  const getChartOption3 = () => {
    const colors = ["#5596FF",'#24BD6C']; // 柱：蓝色；线：橙色
    return {
      color: colors,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      legend: {
        data: ["进度75%", "进度90%"],
        bottom: 0,
        x: "center",
        itemWidth: 12,
        itemHeight: 12,
        icon: 'circle',
        textStyle: { fontSize: 12, color: "rgba(154,159,181,1)",lineHeight: 12 },
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: "8%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData&&chartData.length>0? chartData.map(d => d.name):[],
        axisLabel: { fontSize: 12, color: "#16151A" },
        axisLine: { lineStyle: { color: "#16151A" } },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: "value",
          name: "数量(家)",
          nameTextStyle: { color: "#16151A" },
          axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "#9A9FB5" } },
        },
      ],
      series: [
        {
          name:  "进度75%",
          type: "bar",
          data: chartData.map(d => d.progress75),
          barWidth: "30%",
          emphasis: { itemStyle: { color: "#5596FF" } },
        },
        {
          name:  "进度90%",
          type: "bar",
          data: chartData.map(d => d.progress90),
          barWidth: "30%",
          emphasis: { itemStyle: { color: "#24BD6C" } },
        },
      ],
    };
  };

  const columns3 = [
    {
      title: '区域',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: <>进度75%(家)</>,
      dataIndex: 'progress75',
      key: 'progress75',
      align: 'center',
    },
    {
      title: <>进度90%(家)</>,
      dataIndex: 'progress90',
      key: 'progress90',
      align: 'center'
    }
  ];

  const loadData = async () => {
    const baseData = [{
      id: '1',
      district: '泰州市',
      name: '泰州市',
      progress1: 4047,
      progress75: 252,
      progress90: 651,
      progressFebSep: 455,
      children:[
      {
        id: '2',
        district: '靖江市',
        name: '靖江市',
        progress1: 759,
        progress75: 73,
        progress90: 173,
        progressFebSep: 87,
      },
        {
          id: '6',
          district: '泰兴市',
          name: '泰兴市',
          progress1: 889,
          progress75: 34,
          progress90: 131,
          progressFebSep: 100,
        }
      ,
      {
        id: '3',
        district: '兴化市',
        name: '兴化市',
        progress1: 837,
        progress75: 55,
        progress90: 117,
        progressFebSep: 106,
      },
        {
          id: '5',
          district: '海陵区',
          name: '海陵区',
          progress1: 339,
          progress75: 37,
          progress90: 74,
          progressFebSep: 51,
        },
      {
        id: '4',
        district: '姜堰区',
        name: '姜堰区',
        progress1: 707,
        progress75: 39,
        progress90: 115,
        progressFebSep: 79,
      },

      {
        id: '7',
        district: '医药高新区(高港区)',
        name: '医药高新区（高港区）',
        progress1: 516,
        progress75: 14,
        progress90: 41,
        progressFebSep: 32,
      },
      ]}
    ];
    setExpandedKeys(['1'])
    setDataSource(baseData)
    setChartData(baseData[0].children)
    setLoading(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滚动
    });
  };


  useEffect(() => {
    scrollToTop();
    loadData();
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
            <span style={{ color: "#1A237E", fontWeight: 600 }}>进规纳统</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* 上年度全市规上工业企业数 */}
      {chartType2 === 'bar'&&chartType3 === 'bar' && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartLeft}>
              <h3 className={styles.chartTitle}>2025年全市规上工业企业数</h3>
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
                  dataSource={dataSource}
                  loading={false}
                  rowKey={record => record.id}
                  pagination={false}
                  bordered={false}
                  size="middle"
                  className={styles.benchtable}
                  locale={{
                    emptyText: '暂无数据',
                  }}
                  expandable={{
                    childrenColumnName: 'children',
                    rowExpandable: (record: any) => {
                      return record.children && record.children.length > 0;
                    },
                    expandedRowKeys: expandedKeys,
                    onExpandedRowsChange: (keys: readonly React.Key[]) => setExpandedKeys([...keys]),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {/* 上年度全市规上工业企业数 */}


      {/* 2-9月份已进规企业数 */}
      {chartType === 'bar'&&chartType3 === 'bar' && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartLeft}>
              <h3 className={styles.chartTitle}>2025年进规企业数</h3>
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
                    dataSource={dataSource}
                    loading={false}
                    rowKey={record => record.id}
                    pagination={false}
                    bordered={false}
                    size="middle"
                    className={styles.benchtable}
                    locale={{
                      emptyText: '暂无数据',
                    }}
                    expandable={{
                      childrenColumnName: 'children',
                      rowExpandable: (record: any) => {
                        return record.children && record.children.length > 0;
                      },
                      expandedRowKeys: expandedKeys,
                      onExpandedRowsChange: (keys: readonly React.Key[]) => setExpandedKeys([...keys]),
                    }}
                  />
                </div>
              )}
            </div>
        </div>
      )}
      {/* 2-9月份已进规企业数 */}

      {/* 当年度可能进规工业企业数 */}
      {/*{chartType === 'bar'&&chartType2 === 'bar' && (*/}
      {/*  <div className={styles.chartSection}>*/}
      {/*    <div className={styles.chartHeader}>*/}
      {/*      <div className={styles.chartLeft}>*/}
      {/*        <h3 className={styles.chartTitle}>当年度可能进规工业企业数</h3>*/}
      {/*      </div>*/}

      {/*      <div className={styles.chartToggle}>*/}
      {/*        <Button*/}
      {/*          type={chartType3 === "bar" ? "primary" : "default"}*/}
      {/*          size="small"*/}
      {/*          onClick={() => setChartType3("bar")}*/}
      {/*        >*/}
      {/*          图形*/}
      {/*        </Button>*/}
      {/*        <Button*/}
      {/*          type={chartType3 === "table" ? "primary" : "default"}*/}
      {/*          size="small"*/}
      {/*          onClick={() => setChartType3("table")}*/}
      {/*        >*/}
      {/*          表格*/}
      {/*        </Button>*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    /!* 图表区域 *!/*/}
      {/*    <div className={styles.divider}></div>*/}
      {/*      <div className={styles.chartContainer}>*/}
      {/*        {chartType3 === "bar" ? (*/}
      {/*          <>*/}
      {/*            <ReactECharts*/}
      {/*              ref={chartRef3}*/}
      {/*              option={getChartOption3()}*/}
      {/*              style={{ height: "360px", width: "100%" }}*/}
      {/*            />*/}
      {/*          </>*/}
      {/*        ) : (*/}
      {/*          <div className={styles.tableContainer}>*/}
      {/*            <Table*/}
      {/*              columns={columns3}*/}
      {/*              dataSource={dataSource}*/}
      {/*              loading={false}*/}
      {/*              rowKey={record => record.id}*/}
      {/*              pagination={false}*/}
      {/*              bordered={false}*/}
      {/*              size="middle"*/}
      {/*              className={styles.benchtable}*/}
      {/*                locale={{*/}
      {/*                  emptyText: '暂无数据',*/}
      {/*                }}*/}
      {/*                expandable={{*/}
      {/*                  childrenColumnName: 'children',*/}
      {/*                  rowExpandable: (record: any) => {*/}
      {/*                    return record.children && record.children.length > 0;*/}
      {/*                  },*/}
      {/*                  expandedRowKeys: expandedKeys,*/}
      {/*                  onExpandedRowsChange: (keys: readonly React.Key[]) => setExpandedKeys([...keys]),*/}
      {/*                }}*/}
      {/*            />*/}
      {/*          </div>*/}
      {/*        )}*/}
      {/*      </div>*/}
      {/*  </div>*/}
      {/*)}*/}
      {/* 当年度可能进规工业企业数 */}



    </div>
  );
};

export default ComplianceDetail;
