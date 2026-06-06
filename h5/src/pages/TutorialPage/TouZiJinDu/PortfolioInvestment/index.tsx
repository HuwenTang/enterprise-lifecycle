import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { Button, message, Breadcrumb, Row, Form, Table, Radio, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import styles from "./index.module.css";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import zhCN from "antd/es/date-picker/locale/zh_CN";
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
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialArea = searchParams.get("area");
  const initialTitle = searchParams.get("title");
  const [filterType, setFilterType] = useState<'newThisMonth' | 'cumulative'>('newThisMonth');
  const [chartType, setChartType] = useState<"bar" | "table">("bar");
  const [chartType2, setChartType2] = useState<"bar" | "table">("bar");

  const initialRange = getStartEndFromUrlOrMonth(searchParams);
  const [startDate, setStartDate] = useState(dayjs(initialRange.start));
  const [endDate, setEndDate] = useState(dayjs(initialRange.end));
  const [showMoreModal, setShowMoreModal] = useState(false); // 月份筛选弹窗状态
  const [showIndustryModal, setShowIndustryModal] = useState(false); // 所属行业弹窗状态
  const [industry, setIndustry] = useState<string>(''); // ''=全部,

  const [money, setMoney] = useState<number>(0); // 金额筛选：0=全部 | 1 | 5 | 10 | -1=自定义

  type FieldType = {
    currentDate?: string;
    industry?: string;
    money?: number;
  };

  const [form] = Form.useForm();
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
    { name: "靖江", value: 0},
    { name: "泰兴", value: 0},
    { name: "兴化", value: 0},
    { name: "海陵", value: 0},
    { name: "姜堰", value: 0},
    { name: "医药", value: 0},
  ];
  const [chartData, setChartData] = useState<any[]>([]);
  const selectOptions = 
    [
    { value: '', label: '全部' },
    { value: '1.1.1.0', label: '生物医药' },
    { value: '1.1.1.1', label: '医药' },
    { value: '1.1.1.2', label: '医疗器械' },
    { value: '1.1.2.0', label: '健康食品' },
    { value: '1.1.2.1', label: '特医及功能性食品' },
    { value: '1.1.2.2', label: '农副食品深加工及预制菜' },
    { value: '1.2.1.0', label: '海工装备和高技术船舶' },
    { value: '1.2.1.1', label: '海洋工程装备' },
    { value: '1.2.1.2', label: '高技术船舶' },
    { value: '1.3.1.0', label: '汽车及零部件' },
    { value: '1.3.1.1', label: '汽车及零部件' },
    { value: '1.3.2.0', label: '新一代信息技术和智能装备' },
    { value: '1.3.2.1', label: '电子信息' },
    { value: '1.3.2.2', label: '智能装备' },
    { value: '1.3.2.3', label: '节能环保' },
    { value: '1.3.3.0', label: '化工及新材料' },
    { value: '1.3.3.1', label: '化工及新材料' },
    { value: '1.3.4.0', label: '金属新材料及制品' },
    { value: '1.3.4.1', label: '金属新材料及制品' },
    { value: '1.3.5.0', label: '新能源' },
    { value: '1.3.5.1', label: '新能源' },
    { value: '1.4.1.0', label: '未来产业' },
    { value: '1.4.1.1', label: '合成生物' },
    { value: '1.4.1.2', label: '细胞和基因技术' },
    { value: '1.4.1.3', label: '前沿新材料' },
    { value: '1.4.1.4', label: '新型储能' },
    { value: '1.4.1.5', label: '深海深地空天装备' },
    { value: '1.4.1.6', label: '人工智能' },
    { value: '1.4.1.7', label: '氢能' }
  ]
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
        text: "{a|项目数量}\n{b|100%}",
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
          lineHeight: 12,
          color: "#16151A",
        },
      },
      tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}<br/>数量: ${p.value}<br/>占比: ${p.percent}%` },

      grid: {
        left: "3%",
        right: "3%",
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
        data: chartData&&chartData.length>0? chartData.map(item=>({
          name: item.districtName,
          value: filterType === 'newThisMonth' ? item.monthIncreasement : item.totalCount
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
      // render: (text: string) =>
      //   text?text === '医药高新区（高港区）' ?'医药':text.substring(0, 2):''
    },
    {
      title: <>项目数量<br/>(个)</>,
      dataIndex: 'monthIncreasement',
      key: 'monthIncreasement',
      align: 'center' as const,
      render: (text: number,record:any) =>
        filterType === 'newThisMonth' ? record.monthIncreasement : record.totalCount
    },
    {
      title: <>计划总投资<br/>(亿)</>,
      dataIndex: "totalInvestment",
      key: 'totalInvestment',
      align: 'center' as const,
      render: (text: number) =>
        text ? (Number(text)/10000).toFixed(2) : '-'
    },
  ]
  const getChartOption2 = () => {
    const colors = ["#5596FF", "#24CA6D"]; // 柱：蓝色；线：橙色
    return {
      color: colors,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      legend: {
        data: filterType === 'newThisMonth'? ["本月列统投资", "累计列统投资"]:["本年列统投资", "累计列统投资"],
        bottom: 0,
        x: "center",
        itemWidth: 12,
        icon: 'circle',
        itemHeight: 12,
        textStyle: { fontSize: 12, color: "rgba(154,159,181,1)",lineHeight: 12 },
      },
      grid: {
        left: "8%",
        right: "8%",
        bottom: "10%",
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
          name: "投资额(亿元)",
          nameTextStyle: { color: "#16151A" },
          axisLabel: { formatter: "{value}", fontSize: 12, color: "#16151A" },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "#9A9FB5" } },
        },
      ],
      series: [
        {
          name:  filterType === 'newThisMonth'?"本月列统投资":"本年列统投资",
          type: "bar",
          data: filterType === 'newThisMonth'?chartData.map(d => ((d.monthStatisticalInvestment)/10000).toFixed(2)):chartData.map(d => ((d.yearStatisticalInvestment)/10000).toFixed(2)),
          barWidth: "30%",
          emphasis: { itemStyle: { color: "#5596FF" } },
        },
        {
          name: "累计列统投资",
          type: "bar",
          data: chartData.map(d => ((d.totalStatisticalInvestment)/10000).toFixed(2)),
          barWidth: "30%",
          emphasis: { itemStyle: { color: "#24CA6D" } },
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
      // render: (text: string) =>
      // text?text === '医药高新区（高港区）' ?'医药':text.substring(0, 2):''
    },
    { 
      title: filterType === 'newThisMonth' ?<>本月列统投资<br/>(亿)</>:<>本年列统投资<br/>(亿)</>,
      dataIndex: 'monthStatisticalInvestment',
      key: 'monthStatisticalInvestment',
      align: 'center',
      render: (text: number,record:any) =>
        filterType === 'newThisMonth' ? text?(text / 10000).toFixed(2) : '0.00':record.yearStatisticalInvestment?(record.yearStatisticalInvestment / 10000).toFixed(2) : '0.00'
    },
    {
      title: <>累计列统投资<br/>(亿)</>,
      dataIndex: 'totalStatisticalInvestment',
      key: 'totalStatisticalInvestment',
      align: 'center',
      render: (text: number) =>
        text ? (text / 10000).toFixed(2) : '0.00'
    }
  ];


  // 表单提交处理
  const onFinish = () => {
    if (endDate.isBefore(startDate, "month")) {
      message.warning("结束时间不可早于开始时间");
      return;
    }
    const start = new Date(Date.UTC(startDate.year(), startDate.month(), 1));
    const end = new Date(Date.UTC(endDate.year(), endDate.month() + 1, 0));
    const payload: any = { start, end };
    payload.innovativeClusters = industry === '' ? undefined : industry;
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
      default:
        break;
    }
    loadData(payload);
  };

  // 重置表单：与投资进度列表页一致（2025年9月）
  const onReset = () => {
    const { start, end } = getMonthRangeUTC(FIXED_YEAR, FIXED_MONTH);
    setStartDate(dayjs(start));
    setEndDate(dayjs(end));
    setMoney(0);
    setIndustry('');
    form.setFieldsValue({ money: 0 });
    loadData({ start, end });
  };

  const loadData = async (params: { start: Date; end: Date; innovativeClusters?: string; minAmount?: number; maxAmount?: number }) => {
    try {
      const res = await primeApi.getStatisticalInvestment(params);
      
      const addKeysToChildren = (item: any, parentKey: string = '', index: number = 0): any => {
        const key = parentKey ? `${parentKey}-${index}` : `item-${index}`;
        return {
          ...item,
          name: item.districtName ?item.districtName === '医药高新区（高港区）' ?'医药':item.districtName.substring(0, 2):'-',
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
      if(processedData&&processedData.length > 0){
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
    const { start, end } = getStartEndFromUrlOrMonth(searchParams);
    setStartDate(dayjs(start));
    setEndDate(dayjs(end));
    setMoney(0);
    setIndustry('');
    loadData({
      start,
      end,
      innovativeClusters: industry === '' ? undefined : industry,
      minAmount: money === 1 ? 10000 : money === 5 ? 50000 : money === 10 ? 100000 : undefined,
      maxAmount: money === 1 ? 50000 : money === 5 ? 100000 : undefined,
    });
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
            <span style={{ color: "#1A237E", fontWeight: 600 }}>入库投资</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.filterContainer}>
        <div className={styles.filterRow}>
          <Radio.Group
            value={filterType}
            onChange={(e) => {setFilterType(e.target.value);}}
            className={styles.radioGroup}
          >
            <Radio value="newThisMonth">本月新增</Radio>
            <Radio value="cumulative">累计新增</Radio>
          </Radio.Group>
          <div className={styles.shuxian}></div>
          <Button
            className={styles.filterButton}
            onClick={() => {
              setShowIndustryModal(!showIndustryModal);
              setShowMoreModal(false);
            }}
          >
            所属行业
            {showIndustryModal ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Button>
          <Button
            className={styles.filterButton}
            onClick={() => {
              setShowMoreModal(!showMoreModal);
              setShowIndustryModal(false);
            }}
          >
            更多筛选
            {showMoreModal ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Button>
        </div>


        {/* 行业筛选弹窗 */}
        {showIndustryModal && (
          <div className={styles.modalOverlay} onClick={() => setShowIndustryModal(false)}>
            <LockBodyScroll />
            <div className={styles.cumulativeModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalContent}>
                <div className={styles.investmentOptions} style={{maxHeight:'35vh',overflow:'scroll'}}>
                  {
                    selectOptions.map((item,index)=>{
                      return (
                        <div
                          className={`${styles.investmentOption} ${industry === item.value ? styles.selected : ''}`}
                          onClick={() => { setIndustry(item.value)}}
                        >
                          <span>{item.label}</span>
                        </div> 
                      )
                    })
                  }
                </div>

                <div className={styles.modalActions}>
                  <Button
                    className={styles.resetButton}
                    onClick={() => {
                      setMoney(0);
                      setShowMoreModal(false);
                      setShowIndustryModal(false);
                      onReset();
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => { setShowIndustryModal(false);setShowMoreModal(false); onFinish(); }}
                  >
                    确定
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 更多筛选 */}
        {showMoreModal && (
          <div className={styles.modalOverlay} onClick={() => setShowMoreModal(false)}>
            <LockBodyScroll />
            <div className={styles.cumulativeModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalBody} style={{ marginTop: "-20px" }}>
                  <Form form={form} layout="horizontal" name="queryForm" autoComplete="off">
                    <Form.Item label="开始时间" style={{ marginTop: "20px" }}>
                      <DatePicker
                        locale={zhCN}
                        picker="month"
                        format="YYYY-MM"
                        placeholder="选择开始时间"
                        value={startDate}
                        onChange={(v) => setStartDate(v || dayjs())}
                        allowClear={false}
                      />
                    </Form.Item>
                    <Form.Item label="结束时间" style={{ marginTop: "20px" }}>
                      <DatePicker
                        locale={zhCN}
                        picker="month"
                        format="YYYY-MM"
                        placeholder="选择结束时间"
                        value={endDate}
                        onChange={(v) => setEndDate(v || dayjs())}
                        disabledDate={(d) => d && d.isBefore(startDate, "month")}
                        allowClear={false}
                      />
                    </Form.Item>
                    <Form.Item<FieldType> label="金额筛选" name="money" style={{ marginTop: "20px" }}>
                      <Radio.Group value={money} options={[
                        { value: 0, label: '全部' },
                        { value: 1, label: '一亿元' },
                        { value: 5, label: '五亿元' },
                        { value: 10, label: '十亿元' },
                      ]} onChange={(e) => setMoney(e.target.value)} />
                    </Form.Item>
                  </Form>
                </div>

                <div className={styles.modalActions}>
                  <Button
                    className={styles.resetButton}
                    onClick={() => {
                      setShowMoreModal(false);
                      setShowIndustryModal(false);
                      onReset();
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => { setShowMoreModal(false);setShowIndustryModal(false); onFinish(); }}
                  >
                    确 认
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 入库投资项目数量及占比 */}
      {chartType2 === 'bar' && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartLeft}>
              <h3 className={styles.chartTitle}>{filterType === 'newThisMonth'?'本月':'本年'}入库投资项目情况</h3>
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
      {/* 入库投资项目数量及占比 */}


      {/* 各市区列统投资额对比 */}
      {chartType === 'bar' && (
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartLeft}>
              <h3 className={styles.chartTitle}>各市区列统投资额对比</h3>
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
                    dataSource={chartData}
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
      {/* 各市区列统投资额对比 */}


    </div>
  );
};

export default PortfolioInvestment;
