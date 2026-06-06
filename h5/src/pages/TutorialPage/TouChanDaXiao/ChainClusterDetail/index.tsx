import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { Button,message, Breadcrumb, Row,Table,  Radio } from "antd";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import { primeApi } from "../../../../api.ts";
import dayjs from "dayjs";


const ChainClusterDetail: React.FC = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);

  const [filterType, setFilterType] = useState<'first' | 'second' | 'third' | 'fourth'>('third');
  const [chartType, setChartType] = useState<"bar" | "table">("bar");
  const [chartType2, setChartType2] = useState<"bar" | "table">("bar");

  const [currentDate, setCurrentDate] = useState(dayjs("2025-09-01"));

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 存储展开的节点key
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [expandedSection, setExpandedSection] = useState<null | 'env' | 'security'>('env');
  const [chartData, setChartData] = useState<any[]>([]);

  const getChartOption = () => {
    const colors = ["#5596FF", "#24CA6D"]; // 柱：蓝色；线：橙色
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
        left: "0%",
        right: "0%",
        bottom: "0%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData&&chartData.length>0? chartData.map(d => d.name):[],
        axisLabel: {
          fontSize: 12, color: "#16151A" ,rotate: 45,
          lineHeight: 16,
          margin: 10,
          formatter: function (value: string) {
            if (value.length > 8) {
              return value.substring(0, 8) + '\n' + value.substring(8);
            }
            return value;
          },
        },
        axisLine: { lineStyle: { color: "#16151A" } },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: "value",
          name: "金额(亿)",
          nameTextStyle: { color: "#16151A" },
          axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "#9A9FB5" } },
        },
      ],
      series: [
        {
          name:  "本期产值情况",
          type: "bar",
          data: chartData.map(d => d.current),
          barWidth: "30%",
          emphasis: { itemStyle: { color: "#5596FF" } },
        }
      ],
    };
  };

  const columns = [
    {
      title: "指标名称",
      dataIndex: 'indicator',
      key: 'indicator',
      align: 'center' as const,
    },
    {
      title: <>本期(亿)</>,
      dataIndex: 'current',
      key: 'current',
      align: 'center' as const,
      minWidth: 100
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
        show: false
      },
      grid: {
        left: "0%",
        right: "0%",
        bottom: "0%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData&&chartData.length>0? chartData.map(d => d.name):[],
        axisLabel: {
          fontSize: 12, color: "#16151A" ,rotate: 45,
          lineHeight: 16,
          margin: 10,
          formatter: function (value: string) {
            if (value.length > 8) {
              return value.substring(0, 8) + '\n' + value.substring(8);
            }
            return value;
          },
        },
        axisLine: { lineStyle: { color: "#16151A" } },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: "value",
          name: "金额(亿)",
          nameTextStyle: { color: "#16151A" },
          axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "#9A9FB5" } },
        },
      ],
      series: [
        {
          name:  "同期产值情况",
          type: "bar",
          data: chartData.map(d => d.last),
          barWidth: "30%",
          emphasis: { itemStyle: { color: "#5596FF" } },
        }
      ],
    };
  };
  const columns2 = [
    {
      title: '指标名称',
      dataIndex: 'indicator',
      key: 'indicator',
      align: 'center',
    },
    {
      title: <>同期(亿)</>,
      dataIndex: 'last',
      key: 'last',
      align: 'center',
      minWidth: 100
    },
  ];

  const loadData = async (params: any) => {
    try {
      const res = await primeApi.getStatIndustryOutputTree(params);

      // 递归为所有子项添加key属性
      const addKeysToChildren = (item: any, parentKey: string = '', index: number = 0): any => {
        const key = parentKey ? `${parentKey}-${index}` : `item-${index}`;

        // 处理children：需要将对象或数组转换为数组格式
        let children = undefined;

        if (item.children) {
          // 如果children是数组
          if (Array.isArray(item.children) && item.children.length > 0) {
            children = item.children.map((child: any, childIndex: number) =>
              addKeysToChildren(child, key, childIndex)
            );
          }
          // 如果children是对象（非数组），转换为数组
          else if (typeof item.children === 'object' && !Array.isArray(item.children) && Object.keys(item.children).length > 0) {
            const childrenArray = Object.values(item.children);
            children = childrenArray.map((child: any, childIndex: number) =>
              addKeysToChildren(child, key, childIndex)
            );
          }
        }
        const name = item.indicator.trim().replace('产业集群','')
        const str = name.substring(0,2)
        return {
          ...item,
          name: !isNaN(str)? name.substring(2) : name,
          key,
          children
        };
      };

      // 处理响应数据
      let processedData = [];
      if (Array.isArray(res)) {
        // 如果返回的是数组
        processedData = res.map((item, index) => addKeysToChildren(item, '', index));
      } else if (res) {
        const rootNode = addKeysToChildren(res, '', 0);
        processedData = [rootNode];
      }
      setDataSource(processedData);

      // 自动展开第一级
      const firstLevelKeys: React.Key[] = processedData.map(item => item.key);
      setExpandedKeys(firstLevelKeys);
      if(processedData.length > 0){
        const arr = processedData[0].children || []
        const arr2 = arr&&arr.length>0?arr[0].children: []
        setChartData(arr2)
        const firstLevelKeys2: React.Key[] = arr.map(item => item.key);
        setExpandedKeys(firstLevelKeys.concat(firstLevelKeys2));
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
      setDataSource([]);
      setChartData([]);
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
    const defaultDate = dayjs("2025-09-01");
    setCurrentDate(defaultDate);
    loadData({
      month: dayjs(currentDate).month()+1,
      year: dayjs(currentDate).year(),
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
            <span style={{ color: "#1A237E", fontWeight: 600 }}>链群体系</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.filterContainer}>
        <div className={styles.filterRow}>
          <Radio.Group
            value={filterType}
            onChange={() => {setFilterType('third');}}
            className={styles.radioGroup}
          >
            <Radio value="first">第一季度</Radio>
            <Radio value="second">第二季度</Radio>
            <Radio value="third">第三季度</Radio>
            <Radio value="fourth">第四季度</Radio>
          </Radio.Group>
        </div>
      </div>

      {/* 本期产值情况 */}
      {chartType2 === 'bar' && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartLeft} onClick={() => setExpandedSection(expandedSection === 'env' ? null : 'env')}>
              <span style={{ marginRight: 8, cursor: "pointer" }}>
                {expandedSection ? <UpOutlined /> : <DownOutlined />}
              </span>
              <h3 className={styles.chartTitle}>25年9月本期产值情况</h3>
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
                onClick={() => {setChartType("table");setExpandedSection('env')}}
              >
                表格
              </Button>
            </div>
          </div>

          {/* 图表区域 */}
          {expandedSection === 'env' && (
            <>
              <div className={styles.divider}></div>
              <div className={`${styles.chartContainer} ${styles.treeTable}`}>
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
                      rowKey={record => record.key}
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
            </>
          )}
        </div>
      )}
      {/*本期产值情况 */}


      {/* 同期产值情况 */}
      {chartType === 'bar' && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartLeft} onClick={() => setExpandedSection(expandedSection === 'security' ? null : 'security')}>
              <span style={{ marginRight: 8, cursor: "pointer" }}>
                {expandedSection ? <UpOutlined /> : <DownOutlined />}
              </span>
              <h3 className={styles.chartTitle}>25年9月同期产值情况</h3>
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
                onClick={() => {setChartType2("table");setExpandedSection('security')}}
              >
                表格
              </Button>
            </div>
          </div>

          {/* 图表区域 */}
          {expandedSection === 'security' && (
            <>
            <div className={styles.divider}></div>
            <div className={`${styles.chartContainer} ${styles.treeTable}`}>
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
                    rowKey={record => record.key}
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
            </>
          )}
        </div>
      )}
      {/* 2025年同期产值情 */}


    </div>
  );
};

export default ChainClusterDetail;
