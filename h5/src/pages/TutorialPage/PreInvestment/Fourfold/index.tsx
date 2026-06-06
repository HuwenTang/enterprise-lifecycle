import React, { useState, useEffect } from 'react';
import { useRef } from "react";
import { Button, Radio, Table, Breadcrumb, Row, Form, DatePicker, InputNumber, ConfigProvider } from 'antd';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import styles from './index.module.css';
import { CaretUpOutlined, CaretDownOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { primeApi } from "../../../../api.ts";
import zhCN from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;

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


const FourfoldProjects: React.FC = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialArea = searchParams.get('area');
  const hasNew = true //  searchParams.get('monthNum') && searchParams.get('monthNum') !== 'undefined' ? true : false;
  const hasTotal = true //  searchParams.get('totalNum') && searchParams.get('totalNum') !== 'undefined' ? true : false;
  // 按钮始终显示，但根据地区控制禁用状态
  const shouldShowNew = true; // 始终显示"本月新增"按钮
  const shouldShowTotal = true; // 始终显示"累计新增"按钮
  // 当地区是"全市"且有对应数据时，优先选择"本月新增"，否则选择"累计新增"
  const [filterType, setFilterType] = useState<'newThisMonth' | 'cumulative'>(
    (initialArea === '全市' && hasNew) ? 'newThisMonth' : 'cumulative'
  );
  const [chainChartType, setChainChartType] = useState<'bar' | 'table'>('bar');
  const [areaChartType, setAreaChartType] = useState<'bar' | 'table'>('bar');
  const [chartType, setChartType] = useState<'bar' | 'table'>('bar');
  const [selectAreaText, setSelectAreaText] = useState(initialArea); // 园区tab状态
  const [showCumulativeModal, setShowCumulativeModal] = useState(false); // 金额筛选弹窗状态
  const [showMoreModal, setShowMoreModal] = useState(false); // 全部筛选弹窗状态

  const [money, setMoney] = useState(0); // 选中的投资选项
  const [money2, setMoney2] = useState(Number(searchParams.get('money')));
  const [showMoneyInput, setShowMoneyInput] = useState(false);

  const [startMoney, setStartMoney] = useState(0);
  const [endMoney, setEndMoney] = useState(1);
  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month'));
  const [rangeDate, setRangeDate] = useState([dayjs().startOf('year'), dayjs().endOf('month')]);
  const [rangeDate2, setRangeDate2] = useState([dayjs().startOf('year'), dayjs().endOf('month')]);

  type FieldType = {
    currDate?: string;
    startDate?: string;
    year?: string;
    money?: number;
    endDate?: string;
    rangeDate?: any;
    startMoney?: number;
    endMoney?: number;
  };

  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 图表数据状态 - 初始化为空数组，确保数据完全来自接口
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartData2, setChartData2] = useState<any[]>([]);

  const normalizeRecords = (resp: any): any[] => {
    if (Array.isArray(resp)) return resp;
    try {
      const parsed = typeof resp === 'string' ? JSON.parse(resp) : resp;
      if (Array.isArray(parsed?.records)) return parsed.records;
      if (Array.isArray(parsed)) return parsed;
    } catch (e) { }
    return [];
  };

  // 图表配置
  const getChartOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        // formatter: function (params: any) {
        //   const dataIndex = params[0].dataIndex;
        //   const name = chartData[dataIndex].name;
        //   const value = filterType === 'newThisMonth' ? chartData[dataIndex].value : chartData[dataIndex].value2;
        //   const trend = filterType === 'newThisMonth' ? chartData[dataIndex].trend : chartData[dataIndex].trend2;

        //   return `${name}<br/>项目个数: ${value}个<br/>项目投资额: ${trend}亿元`;
        // }
      },
      legend: {
        data: ['项目个数', '项目投资额'],
        bottom: 0,
        textStyle: {
          fontSize: 12,
          color: '#9A9FB5'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.map(item => item.name),
        axisLabel: {
          fontSize: 12,
          color: '#16151A',
          rotate: 45,
          interval: 0,
          formatter: function (value: string) {
            if (value.length > 6) {
              return value.substring(0, 6) + '\n' + value.substring(6);
            }
            return value;
          },
          lineHeight: 14,
          margin: 10
        },
        axisLine: {
          lineStyle: {
            color: '#16151A'
          },
        },
        axisTick: {
          show: false
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '个数',
          nameTextStyle: {
            color: '#16151A'
          },
          position: 'left',
          axisLabel: {
            formatter: '{value}',
            fontSize: 12,
            color: '#16151A'
          },
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#9A9FB5'
            }
          }
        },
        {
          type: 'value',
          name: '投资额(亿元)',
          nameTextStyle: {
            color: '#16151A'
          },
          position: 'right',
          axisLabel: {
            formatter: '{value}',
            fontSize: 12,
            color: '#16151A'
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '项目个数',
          type: 'bar',
          data: chartData.map((item, index) => ({
            value: filterType === 'newThisMonth' ? item.value : item.value2,
            itemStyle: { color: 'rgba(85, 150, 255, 1)' }
          })),
          barWidth: '40%',
          emphasis: { itemStyle: { color: 'rgba(85, 150, 255, 1)' } },
          itemStyle: { color: 'rgba(85, 150, 255, 1)' },
        },
        {
          name: '项目投资额',
          type: 'line',
          yAxisIndex: 1,
          data: filterType === 'newThisMonth' ? chartData.map(item => item.trend) : chartData.map(item => item.trend2),
          itemStyle: {
            color: '#ff9500'
          },
          lineStyle: {
            color: '#ff9500',
            width: 2
          },
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            itemStyle: {
              color: '#ff9500',
              borderColor: '#fff',
              borderWidth: 2
            }
          }
        }
      ],
    };
  };


  const onChangeDate3 = (newValue: any) => {
    setStartDate(dayjs(newValue[0]));
    setEndDate(dayjs(newValue[1]).endOf('month'));
    setRangeDate([dayjs(newValue[0]), dayjs(newValue[1]).endOf('month')]);
  };

  const changeStart = (newValue: any) => {
    setStartMoney(newValue);
  };
  const changeEnd = (newValue: any) => {
    setEndMoney(newValue);
  };

  const onFinish = () => {
    setMoney2(money);
    setRangeDate2([dayjs(rangeDate[0]), dayjs(rangeDate[1]).endOf('month')]);
    // 数据获取由 useEffect 监听 rangeDate2 和 money2 变化自动触发
    fetchIndustryChainData({
      currStartDate: rangeDate[0].format('YYYY-MM-DD'),
      currEndDate: rangeDate[1].format('YYYY-MM-DD'),
      currDate: dayjs(rangeDate[1]).startOf('month').format('YYYY-MM-DD'),
      rmb: money === 0 || money === -1 ? undefined : money,
      rmb1: money === -1 ? startMoney : undefined,
      rmb2: money === -1 ? endMoney : undefined,
      doller1: money === -1 ? Math.floor((Number(startMoney) * 10000) / 7.2) : undefined,
      doller2: money === -1 ? Math.floor((Number(endMoney) * 10000) / 7.2) : undefined,
    });
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
    setMoney(0);
    setMoney2(0);
    setEndDate(dayjs().endOf('month'));
    setStartDate(dayjs().startOf('year'));
    setRangeDate([dayjs().startOf('year'), dayjs().endOf('month')]);
    setRangeDate2([dayjs().startOf('year'), dayjs().endOf('month')]);
    setStartMoney(0);
    setEndMoney(1);
    setShowMoneyInput(false);
    form.setFieldsValue({
      money: 0,
      endDate: dayjs().endOf('month'),
      rangeDate: [dayjs().startOf('year'), dayjs().endOf('month')],
      startMoney: 0,
      endMoney: 1,
    });
    fetchIndustryChainData({
      currStartDate: dayjs().startOf('year').format('YYYY-MM-DD'),
      currEndDate: dayjs().endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    });
  };

  // 获取产业链项目数据
  const fetchIndustryChainData = async (params: any) => {
    try {
      setLoading(true);
      // const currStartDate = rangeDate2[0].format('YYYY-MM-DD');
      // const currEndDate = rangeDate2[1].format('YYYY-MM-DD');
      // const currDate = dayjs(rangeDate2[1]).startOf('month').format('YYYY-MM-DD');

      // const params = {
      //   currStartDate:currStartDate,
      //   currEndDate:currEndDate,
      //   currDate:currDate,
      //   rmb: money2 === 0 ||money2 === -1 ?undefined:money2,
      //   rmb1: money2 === -1 ?startMoney:undefined,
      //   rmb2: money2 === -1 ?endMoney:undefined,
      //   doller1: money2 === -1 ?Math.floor((Number(startMoney) * 10000) / 7.2):undefined,
      //   doller2: money2 === -1 ?Math.floor((Number(endMoney) * 10000) / 7.2):undefined,
      // }

      const response = await primeApi.countSignedProjTypeByLevel({
        ...params,
        level: 2
      })
      const data = normalizeRecords(response);
      setDataSource(data);
      let processedData = data.map((ele: any) => ({
        isShow: false,
        name: ele.name,
        value: ele.monthNum,
        trend: ele.monthQyje,
        value2: ele.total,
        trend2: ele.totalQyje,
        code: ele.code // 保留 code 字段用于点击事件
      }))
      setChartData(processedData);
      for (let idx = 0; idx < processedData.length; idx++) {
        const item = processedData[idx];
        const res2 = await primeApi.countSignedProjTypeByLevel({
          ...params,
          level: 3,
          code: item.code,
        });
        const data2 = normalizeRecords(res2);
        const children = data2.map((ele: any) => ({
          name: ele.name,
          value: ele.monthNum,
          trend: ele.monthQyje,
          value2: ele.total,
          trend2: ele.totalQyje,
          code: ele.code // 保留 code 字段用于点击事件
        }));
        processedData[idx].children = children;
      }
      // console.log('processedData=====',processedData);
      setChartData2(processedData);
    } catch (error) {
      console.error('获取产业链数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeCollopse = (idx: number) => {
    const arr = [...chartData]
    if (arr[idx].isShow === true) {
      arr[idx].isShow = false
    } else {
      arr.forEach(item => item.isShow = false)
      arr[idx].isShow = true
    }
    setChartData2(arr)
  }

  const getAreaInvestmentOption = () => {
    const arr = Array.isArray(dataSource) ? dataSource : [];

    const sum = (key: string) => arr.reduce((acc, cur) => acc + (Number(cur[key]) || 0), 0);
    const totalQyjeSum = sum('totalQyje') || 0;

    const areas = [
      { name: '靖江市', qyjeKey: 'jjsQyje', numKey: 'jjsNum', color: '#F5A623' },
      { name: '泰兴市', qyjeKey: 'txsQyje', numKey: 'txsNum', color: '#FF6B6B' },
      { name: '兴化市', qyjeKey: 'xhsQyje', numKey: 'xhsNum', color: '#4F7CF2' },
      { name: '海陵区', qyjeKey: 'hlqQyje', numKey: 'hlqNum', color: '#FFD54F' },
      { name: '姜堰区', qyjeKey: 'jyqQyje', numKey: 'jyqNum', color: '#43C589' },
      { name: '医药高新区(高港区)', qyjeKey: 'yygxqQyje', numKey: 'yygxqNum', color: '#8E6EF2' },
    ];

    const pieData = areas.map(a => {
      const investSum = sum(a.qyjeKey);
      const numSum = sum(a.numKey);
      const percent = totalQyjeSum > 0 ? Number(((investSum / totalQyjeSum) * 100).toFixed(2)) : 0;
      return {
        name: a.name,
        value: Number(investSum.toFixed(2)),
        num: numSum,
        percent,
        itemStyle: { color: a.color },
      };
    });

    return {
      tooltip: { trigger: 'item', formatter: (p: any) => `${p.data.name}<br/>数量: ${p.data.num}<br/>占比: ${p.data.percent}%` },
      legend: {
        bottom: 0,
        x: 'center',
        left: '15%',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: { fontSize: 12, color: '#666' },
      },
      graphic: [
        { type: 'text', left: 'center', top: '40%', style: { text: '项目数量', fill: '#999', fontSize: 14, fontWeight: 500, textAlign: 'center' } },
        { type: 'text', left: 'center', top: '48%', style: { text: '100%', fill: '#1a237e', fontSize: 18, fontWeight: 700, textAlign: 'center' } }
      ],
      series: [
        {
          name: '区域投资占比',
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          startAngle: 100,
          label: {
            show: true,
            // formatter: (p: any) => `${p.data.name}\n数量:${p.data.num}  占比:${p.data.percent}%`,
            formatter: function (params: any) {
              let str = ''
              switch (params.name) {
                case '靖江市':
                  str = '{a|' + params.name + '}'
                  break;
                case '泰兴市':
                  str = '{b|' + params.name + '}'
                  break;
                case '兴化市':
                  str = '{c|' + params.name + '}'
                  break;
                case '海陵区':
                  str = '{d|' + params.name + '}'
                  break;
                case '姜堰区':
                  str = '{e|' + params.name + '}'
                  break;
                case '医药高新区(高港区)':
                  str = '{f|医药高新区(高港区)}'
                  break;
                default:
                  break;
              }
              return (
                str +
                "\n{t|数量:" +
                params.data.num +
                "}\n{t|占比:" +
                params.percent +
                "}%"
              );
            },
            color: '{color}',
            fontSize: 12,
            lineHeight: 18,
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
          labelLine: { length: 14, length2: 10 },
          data: pieData
        },
        // 边框的设置
        {
          radius: ["40%", "45%"],
          center: ['50%', '45%'],
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
      title: "地区",
      dataIndex: 'name',
      key: 'name',
      align: 'center' as const,
    },
    {
      title: "项目个数",
      dataIndex: 'num',
      key: 'num',
      align: 'center' as const,
      // render: (text: number, record: any) => {
      //   const districtCodeMap: Record<string, string> = {
      //     '海陵区': '321202000000',
      //     '医药高新区(高港区)': '321203000000',
      //     '姜堰区': '321204000000',
      //     '兴化市': '321281000000',
      //     '靖江市': '321282000000',
      //     '泰兴市': '321283000000',
      //   };
      //   return (
      //     <span
      //       style={{ cursor: 'pointer', fontWeight: 700, color: 'rgb(26, 35, 126)', transition: 'color 0.3s' }}
      //       onClick={() => {
      //         const code = districtCodeMap[record?.name];
      //         if (code) {
      //           const startMonth = filterType === 'newThisMonth'
      //             ? dayjs().startOf('month')
      //             : (rangeDate && rangeDate[0] ? dayjs(rangeDate[0]).startOf('month') : dayjs('2025-01-01'));
      //           const endMonth = filterType === 'newThisMonth'
      //             ? dayjs().endOf('month')
      //             : (rangeDate && rangeDate[1] ? dayjs(rangeDate[1]).endOf('month') : dayjs('2025-11-30'));
      //           const params: Record<string, string> = {
      //             district: code,
      //             showAll: 'true',
      //             currStartDate: startMonth.format('YYYY-MM-DD'),
      //             currEndDate: endMonth.format('YYYY-MM-DD'),
      //             currDate: endMonth.startOf('month').format('YYYY-MM-DD'),
      //           };
      //           if (money === 1 || money === 5 || money === 10) {
      //             params.investmentAmount = String(money);
      //           } else if (money === -1) {
      //             const r1 = Number(startMoney) || 0;
      //             const r2 = Number(endMoney) || 0;
      //             const d1 = Math.floor((r1 * 10000) / 7.2);
      //             const d2 = Math.floor((r2 * 10000) / 7.2);
      //             params.rmb1 = String(r1);
      //             params.rmb2 = String(r2);
      //             params.doller1 = String(d1);
      //             params.doller2 = String(d2);
      //           }
      //           const qs = new URLSearchParams(params).toString();
      //           navigate(`/tutorial/preinvestment/InvestProjectList?${qs}`);
      //         }
      //       }}
      //     >
      //       {text}
      //     </span>
      //   );
      // }
    },
    {
      title: "投资额(亿元)",
      dataIndex: 'invest',
      key: 'invest',
      align: 'center' as const,
    },
  ]

  // 新增：区域投资占比模块的表格数据，和图使用同一汇总口径
  const getAreaTableRows = () => {
    const arr = Array.isArray(dataSource) ? dataSource : [];
    const sum = (key: string) => arr.reduce((acc, cur) => acc + (Number(cur[key]) || 0), 0);
    const areas = [
      { name: '靖江市', qyjeKey: 'jjsQyje', numKey: 'jjsNum' },
      { name: '泰兴市', qyjeKey: 'txsQyje', numKey: 'txsNum' },
      { name: '兴化市', qyjeKey: 'xhsQyje', numKey: 'xhsNum' },
      { name: '海陵区', qyjeKey: 'hlqQyje', numKey: 'hlqNum' },
      { name: '姜堰区', qyjeKey: 'jyqQyje', numKey: 'jyqNum' },
      { name: '医药高新区(高港区)', qyjeKey: 'yygxqQyje', numKey: 'yygxqNum' },
    ];
    return areas.map((a, i) => ({
      index: i,
      name: a.name,
      num: sum(a.numKey),
      invest: Number(sum(a.qyjeKey).toFixed(2)),
    }));
  };

  // 项目数量趋势（固定数据）
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'];
  const projectCounts = [40, 88, 120, 93, 97, 76, 55, 64, 120];

  const getProjectTrendOption = () => {
    return {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '5%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: { color: '#16151A', fontSize: 12 },
        axisLine: { lineStyle: { color: '#16151A' } },
        axisTick: {
          show: false
        },
      },
      yAxis: {
        type: 'value',
        name: '项目数量',
        nameTextStyle: {
          color: '#16151A'
        },
        axisLabel: { color: '#16151A', fontSize: 12 },
        splitLine: { lineStyle: { color: '#9A9FB5' } }
      },
      series: [
        {
          name: '项目数量',
          type: 'line',
          data: projectCounts,
          smooth: false,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color: '#43C589' },
          lineStyle: { color: '#43C589', width: 2 },
          areaStyle: { color: 'rgba(67, 197, 137, 0.15)' },
          emphasis: { itemStyle: { borderColor: '#fff', borderWidth: 2 } }
        }
      ]
    };
  };

  const columns2 = [
    {
      title: "月份",
      dataIndex: 'month',
      key: 'month',
      align: 'center' as const,
    },
    {
      title: "项目个数",
      dataIndex: 'count',
      key: 'count',
      align: 'center' as const,
    },
  ]
  const getProjectTrendRows = () => months.map((m, i) => ({ month: m, count: projectCounts[i], index: i }));
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滚动
    });
  };
  useEffect(() => {
    scrollToTop();
    setEndDate(dayjs().endOf('month'));
    setIsInitialized(true);
    const currStartDate = rangeDate2[0].format('YYYY-MM-DD');
    const currEndDate = rangeDate2[1].format('YYYY-MM-DD');
    const currDate = dayjs(rangeDate2[1]).startOf('month').format('YYYY-MM-DD');

    // 初始化时获取数据
    fetchIndustryChainData({
      currStartDate: currStartDate,
      currEndDate: currEndDate,
      currDate: currDate,
      rmb: money2 === 0 || money2 === -1 ? undefined : money2,
      rmb1: money2 === -1 ? startMoney : undefined,
      rmb2: money2 === -1 ? endMoney : undefined,
      doller1: money2 === -1 ? Math.floor((Number(startMoney) * 10000) / 7.2) : undefined,
      doller2: money2 === -1 ? Math.floor((Number(endMoney) * 10000) / 7.2) : undefined,
    });
  }, []);

  // 当筛选条件改变时重新获取数据（跳过初始化阶段）
  // useEffect(() => {
  //   if (isInitialized) {
  //     fetchIndustryChainData();
  //   }
  // }, [rangeDate2, filterType, money2]);

  // 新增：判断各模块是否为“表格”模式
  const isChainTable = chainChartType === 'table';
  const isAreaTable = areaChartType === 'table';
  const isTrendTable = chartType === 'table';

  return (
    // <ConfigProvider locale={zhCN}>
    <div className={styles.container}>

      {/* 顶部标签切换 */}
      <div className={styles.tabContainer}>
        <Row className={styles.backCon} onClick={() => navigate(-1)}>
          <img className={styles.backImg} src="/img/tutorial/backBtn.png" alt="" />
          <div className={styles.backText}>返回</div>
        </Row>
        <Breadcrumb>
          <Breadcrumb.Item>
            <span style={{ color: '#666666' }}>前期招商</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item><span style={{ color: '#1A237E', fontWeight: 600 }}>重点产业链项目</span></Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.filterContainer}>
        <div className={styles.filterRow}>
          <Radio.Group
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={styles.radioGroup}
          >
            {shouldShowNew && (
              <Radio value="newThisMonth" disabled={selectAreaText !== '全市'}>本月新增</Radio>
            )}
            {shouldShowTotal && (
              <Radio value="cumulative" disabled={selectAreaText !== '全市'}>累计新增</Radio>
            )}
          </Radio.Group>
          <div className={styles.shuxian}></div>
          <Button
            className={styles.filterButton}
            onClick={() => { setShowCumulativeModal(!showCumulativeModal); setShowMoreModal(false) }}
          >
            金额筛选
            {showCumulativeModal ? (
              <CaretUpOutlined />
            ) : (
              <CaretDownOutlined />
            )}
          </Button>
          {/* <div className={styles.shuxian}></div> */}
          <Button className={styles.filterButton} onClick={() => { setShowMoreModal(!showMoreModal); setShowCumulativeModal(false) }}>更多筛选
            {showMoreModal ? (
              <CaretUpOutlined />
            ) : (
              <CaretDownOutlined />
            )}
          </Button>
        </div>

        {/* 金额筛选弹窗 */}
        {showCumulativeModal && (
          <div className={styles.modalOverlay} onClick={() => setShowCumulativeModal(false)}>
            <LockBodyScroll />
            <div className={styles.cumulativeModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalContent}>
                <div className={styles.investmentOptions}>
                  <div
                    className={`${styles.investmentOption} ${money === 0 ? styles.selected : ''}`}
                    onClick={() => { setMoney(0); setShowMoneyInput(false) }}
                  >
                    <span>全部</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${money === 1 ? styles.selected : ''}`}
                    onClick={() => { setMoney(1); setShowMoneyInput(false) }}
                  >
                    <span>一亿元</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${money === 5 ? styles.selected : ''}`}
                    onClick={() => { setMoney(5); setShowMoneyInput(false) }}
                  >
                    <span>五亿元</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${money === 10 ? styles.selected : ''}`}
                    onClick={() => { setMoney(10); setShowMoneyInput(false) }}
                  >
                    <span>十亿元</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${money === -1 ? styles.selected : ''}`}
                    onClick={() => { setMoney(-1); setShowMoneyInput(true) }}
                  >
                    <span>自定义金额</span>
                  </div>
                </div>
                {showMoneyInput && (
                  <div className={styles.moneyCon}>
                    <InputNumber addonAfter="亿元" value={startMoney} onChange={changeStart} />
                    <div className={styles.middleText}>至</div>
                    <InputNumber addonAfter="亿元" value={endMoney} onChange={changeEnd} />
                  </div>
                )}
                <div className={styles.modalActions}>
                  <Button
                    className={styles.resetButton}
                    onClick={() => { setShowCumulativeModal(false); onReset(); setShowMoreModal(false) }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => { setShowCumulativeModal(false); onFinish(); setShowMoreModal(false) }}
                  >
                    确定选定金额
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 全部筛选弹窗 */}
        {showMoreModal && (
          <div className={styles.modalOverlay} onClick={() => setShowMoreModal(false)}>
            <LockBodyScroll />
            <div className={styles.cumulativeModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalContent}>
                <div className={styles.formCon}>
                  <Form form={form}
                    layout="horizontal"
                    name="queryForm"
                    autoComplete="off"
                    initialValues={{
                      money: money,
                      rangeDate: rangeDate,
                      startMoney: startMoney,
                      endMoney: endMoney,
                    }}>
                    <Form.Item<FieldType>
                      style={{
                        marginTop: '20px',
                      }}
                      label="所属月份"
                      name="rangeDate"
                    >
                      <RangePicker
                        picker="month"
                        format="YYYY-MM"
                        placeholder={['开始月份', '结束月份']}
                        onChange={onChangeDate3}
                        popupStyle={{
                          zIndex: 9999
                        }}
                        locale={zhCN}
                        getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
                        dropdownClassName="mobile-date-picker"
                        panelRender={(panelNode) => (
                          <div style={{
                            maxWidth: '100vw',
                            maxHeight: '70vh',
                            overflow: 'auto',
                            padding: '8px'
                          }}>
                            {panelNode}
                          </div>
                        )}
                      />

                    </Form.Item>
                  </Form>
                </div>
                <div className={styles.modalActions}>
                  <Button
                    className={styles.resetButton}
                    onClick={() => { setShowMoreModal(false); onReset(); setShowCumulativeModal(false); }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => { setShowMoreModal(false); onFinish(); setShowCumulativeModal(false); }}
                  >
                    确定
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.container}>
        {/* 产业链项目 */}
        {(isChainTable || (!isAreaTable && !isTrendTable)) && (
          <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <div className={styles.chartLeft}>
                <h3 className={styles.chartTitle}>产业链项目</h3>
              </div>
              <div className={styles.chartToggle}>
                <Button
                  type={chainChartType === 'bar' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setChainChartType('bar')}
                >
                  图形
                </Button>
                <Button
                  type={chainChartType === 'table' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setChainChartType('table')}
                >
                  表格
                </Button>
              </div>
            </div>
            <div className={styles.divider}></div>
            {/* 图表区域 */}
            <div className={styles.chartContainer}>
              {chainChartType === 'bar' ? (
                <>
                  <ReactECharts
                    ref={chartRef}
                    option={getChartOption()}
                    style={{ height: '340px', width: '100%' }}
                  />
                </>
              ) : (
                <div className={styles.collapseContainer} style={{ marginTop: '20px' }}>

                  {chartData2.map((item, index) => (
                    <div className={`${styles.collapseItem} ${item.isShow === true ? styles.activeItem : ''}`} key={index}>
                      <div
                        className={`${styles.collapseTitleCon} ${item.isShow === true ? styles.activeCon : ''}`}
                        onClick={(e) => { e.stopPropagation(); changeCollopse(index); }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={styles.collapseTitle}>{item.name}</div>
                        {item.isShow === true && (
                          <UpOutlined className={styles.expandIcon} />
                        )}
                        {item.isShow === false && (
                          <DownOutlined className={styles.expandIcon} />
                        )}
                      </div>
                      {item.isShow === true && (
                        <div className={styles.miniTableContainer}>
                          <table className={styles.miniTableCon}>
                            <thead>
                              <tr>
                                <th>重点集群</th>
                                <th>项目数量</th>
                                <th>金额(亿)</th>
                              </tr>
                            </thead>
                            {item.children && item.children.length > 0 && (
                              <tbody>
                                {item.children.map((item2: any) => (
                                  <tr>
                                    <td
                                      style={{ cursor: 'pointer', color: 'rgba(26, 35, 126, 1)', fontWeight: 700 }}
                                      onClick={() => {
                                        const startMonth = filterType === 'newThisMonth'
                                          ? dayjs().startOf('month')
                                          : (rangeDate && rangeDate[0] ? dayjs(rangeDate[0]).startOf('month') : dayjs('2025-01-01'));
                                        const endMonth = filterType === 'newThisMonth'
                                          ? dayjs().endOf('month')
                                          : (rangeDate && rangeDate[1] ? dayjs(rangeDate[1]).endOf('month') : dayjs('2025-11-30'));
                                        const params: Record<string, string> = {
                                          showAll: 'true',
                                          currStartDate: startMonth.format('YYYY-MM-DD'),
                                          currEndDate: endMonth.format('YYYY-MM-DD'),
                                          year: '2025',
                                          projectCategory: String(item2.name || ''),
                                        };
                                        if (money === 1 || money === 5 || money === 10) {
                                          params.investmentAmount = String(money);
                                        } else if (money === -1) {
                                          const r1 = Number(startMoney) || 0;
                                          const r2 = Number(endMoney) || 0;
                                          const d1 = Math.floor((r1 * 10000) / 7.2);
                                          const d2 = Math.floor((r2 * 10000) / 7.2);
                                          params.rmb1 = String(r1);
                                          params.rmb2 = String(r2);
                                          params.doller1 = String(d1);
                                          params.doller2 = String(d2);
                                        }
                                        const qs = new URLSearchParams(params).toString();
                                        navigate(`/tutorial/preinvestment/InvestProjectList?${qs}`);
                                      }}
                                    >
                                      {item2.name}
                                    </td>
                                    <td
                                      style={{ cursor: 'pointer', color: 'rgba(26, 35, 126, 1)', fontWeight: 700 }}
                                      onClick={() => {
                                        const startMonth = filterType === 'newThisMonth'
                                          ? dayjs().startOf('month')
                                          : (rangeDate && rangeDate[0] ? dayjs(rangeDate[0]).startOf('month') : dayjs('2025-01-01'));
                                        const endMonth = filterType === 'newThisMonth'
                                          ? dayjs().endOf('month')
                                          : (rangeDate && rangeDate[1] ? dayjs(rangeDate[1]).endOf('month') : dayjs('2025-11-30'));
                                        const params: Record<string, string> = {
                                          showAll: 'true',
                                          currStartDate: startMonth.format('YYYY-MM-DD'),
                                          currEndDate: endMonth.format('YYYY-MM-DD'),
                                          projectCategory: String(item2.name || ''),
                                        };
                                        if (money === 1 || money === 5 || money === 10) {
                                          params.investmentAmount = String(money);
                                        } else if (money === -1) {
                                          const r1 = Number(startMoney) || 0;
                                          const r2 = Number(endMoney) || 0;
                                          const d1 = Math.floor((r1 * 10000) / 7.2);
                                          const d2 = Math.floor((r2 * 10000) / 7.2);
                                          params.rmb1 = String(r1);
                                          params.rmb2 = String(r2);
                                          params.doller1 = String(d1);
                                          params.doller2 = String(d2);
                                        }
                                        const qs = new URLSearchParams(params).toString();
                                        navigate(`/tutorial/preinvestment/InvestProjectList?${qs}`);
                                      }}
                                    >
                                      {filterType === 'newThisMonth' ? item2.value : item2.value2}
                                    </td>
                                    <td
                                      style={{ cursor: 'pointer', color: 'rgba(26, 35, 126, 1)', fontWeight: 700 }}
                                      onClick={() => {
                                        const startMonth = rangeDate && rangeDate[0] ? dayjs(rangeDate[0]).startOf('month') : dayjs('2025-01-01');
                                        const endMonth = rangeDate && rangeDate[1] ? dayjs(rangeDate[1]).endOf('month') : dayjs('2025-11-30');
                                        const params: Record<string, string> = {
                                          showAll: 'true',
                                          currStartDate: startMonth.format('YYYY-MM-DD'),
                                          currEndDate: endMonth.format('YYYY-MM-DD'),
                                          year: '2025',
                                          projectCategory: String(item2.name || ''),
                                        };
                                        if (money === 1 || money === 5 || money === 10) {
                                          params.investmentAmount = String(money);
                                        } else if (money === -1) {
                                          const r1 = Number(startMoney) || 0;
                                          const r2 = Number(endMoney) || 0;
                                          const d1 = Math.floor((r1 * 10000) / 7.2);
                                          const d2 = Math.floor((r2 * 10000) / 7.2);
                                          params.rmb1 = String(r1);
                                          params.rmb2 = String(r2);
                                          params.doller1 = String(d1);
                                          params.doller2 = String(d2);
                                        }
                                        const qs = new URLSearchParams(params).toString();
                                        navigate(`/tutorial/preinvestment/InvestProjectList?${qs}`);
                                      }}
                                    >
                                      {filterType === 'newThisMonth' ? item2.trend : item2.trend2}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            )}
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* 区域投资占比 */}
        {(isAreaTable || (!isChainTable && !isTrendTable)) && (
          <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <div className={styles.chartLeft}>
                <h3 className={styles.chartTitle}>区域投资占比</h3>
              </div>
              <div className={styles.chartToggle}>
                <Button
                  type={areaChartType === 'bar' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setAreaChartType('bar')}
                >
                  图形
                </Button>
                <Button
                  type={areaChartType === 'table' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setAreaChartType('table')}
                >
                  表格
                </Button>
              </div>
            </div>
            <div className={styles.divider}></div>
            {/* 图表区域 */}
            <div className={styles.chartContainer}>
              {areaChartType === 'bar' ? (
                <>
                  <ReactECharts
                    ref={chartRef}
                    option={getAreaInvestmentOption()}
                    style={{ height: '340px', width: '100%' }}
                  />
                </>
              ) : (
                <div className={styles.tableContainer}>
                  <Table
                    columns={columns}
                    dataSource={getAreaTableRows()}
                    loading={false}
                    rowKey={(record) => record.index}
                    pagination={false}
                    bordered={false}
                    size="middle"
                    className={styles.benchtable}
                  />
                </div>
              )}
            </div>
          </div>)}
        {/* 项目数量趋势 */}
        {(isTrendTable || (!isChainTable && !isAreaTable)) && (
          <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <div className={styles.chartLeft}>
                <h3 className={styles.chartTitle}>项目数量趋势</h3>
              </div>
              <div className={styles.chartToggle}>
                <Button
                  type={chartType === 'bar' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setChartType('bar')}
                >
                  图形
                </Button>
                <Button
                  type={chartType === 'table' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setChartType('table')}
                >
                  表格
                </Button>
              </div>
            </div>
            <div className={styles.divider}></div>
            {/* 图表区域 */}
            <div className={styles.chartContainer}>
              {chartType === 'bar' ? (
                <>
                  <ReactECharts
                    ref={chartRef}
                    option={getProjectTrendOption()}
                    style={{ height: '340px', width: '100%' }}
                  />
                </>
              ) : (
                <div className={styles.tableContainer}>
                  <Table
                    columns={columns2}
                    dataSource={getProjectTrendRows()}
                    loading={false}
                    rowKey={(record) => record.index}
                    pagination={false}
                    bordered={false}
                    size="middle"
                    className={styles.benchtable}
                  />
                </div>
              )}
            </div>
          </div>)}
      </div>


    </div >
    // </ConfigProvider>
  );
};

export default FourfoldProjects;

