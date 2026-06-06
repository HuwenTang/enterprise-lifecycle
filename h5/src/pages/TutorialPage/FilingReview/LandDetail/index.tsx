/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useRef } from "react";
import { Button, Breadcrumb, Row, Table, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import styles from './index.module.css';
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { DatetimePicker } from 'react-vant';
import { useSearchParams } from "react-router-dom";
import { primeApi } from "../../../../api.ts";
import dayjs from 'dayjs';

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

const LandDetail: React.FC = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);

  const [searchParams] = useSearchParams();
  const [timeType, setTimeType] = useState<'start' | 'end'>('start');
  const [chartType, setChartType] = useState<'bar' | 'table'>('bar');
  const [chartType2, setChartType2] = useState<'bar' | 'table'>('bar');
  const [chartType3, setChartType3] = useState<'bar' | 'table'>('bar');
  const [showCumulativeModal, setShowCumulativeModal] = useState(false); // 金额筛选弹窗状态
  const [showMonthModal, setShowMonthModal] = useState(false); // 月份筛选弹窗状态
  const [showIndustryModal, setShowIndustryModal] = useState(false); // 行业筛选弹窗状态

  
  const [loading,setLoading] = useState(false);
  
  // 存储展开的节点key
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [money, setMoney] = useState(0); // 选中的投资选项
  const [, setMoney2] = useState(Number(searchParams.get('money')));
  const initialRange = getStartEndFromUrlOrMonth(searchParams);
  const [startDate, setStartDate] = useState(dayjs(initialRange.start));
  const [endDate, setEndDate] = useState(dayjs(initialRange.end));
  const [industry, setIndustry] = useState('');

  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<any[]>([]);

  const columns = [
    {
      title: "区域",
      dataIndex: 'district',
      key: 'district',
      align: 'center' as const,
      render: (text: string) =>
        text?text === '医药高新区（高港区）' ?'医药':text.substring(0, 2):''
    },
    {
      title: "备案项目总数",
      dataIndex: 'totalFiledProjects',
      key: 'totalFiledProjects',
      align: 'center' as const,
    },
    {
      title: "投资额(亿)",
      dataIndex: 'totalInvestment',
      key: 'totalInvestment',
      align: 'center' as const,
      render: (text: number) =>
        text ? (text / 10000).toFixed(2) : '0.00'
    }
  ]

  const columns2 = [
    {
      title: "区域",
      dataIndex: 'district',
      key: 'district',
      minWidth: 90,
      align: 'center' as const,
      render: (text: string) =>
        text?text === '医药高新区（高港区）' ?'医药':text.substring(0, 2):''
    },
    {
      title: <>备案<br/>投资额(亿)</>,
      dataIndex: 'totalInvestment',
      key: 'totalInvestment',
      align: 'center' as const,
      render: (text: number) =>
        text ? (text / 10000).toFixed(2) : '0.00'
    },
    {
      title: <>无需新增用地<br/>投资额(亿)</>,
      dataIndex: 'noNewLandInvestment',
      key: 'noNewLandInvestment',
      align: 'center' as const,
      render: (text: number) =>
        text ? (text / 10000).toFixed(2) : '0.00'
    },
    {
      title: <>租用厂房<br/>投资额(亿)</>,
      dataIndex: 'leasedFactoryInvestment',
      key: 'leasedFactoryInvestment',
      align: 'center' as const,
      render: (text: number) =>
        text ? (text / 10000).toFixed(2) : '0.00'
    },
  ]

  const columns3 = [
    {
      title: "区域",
      dataIndex: 'district',
      key: 'district',
      align: 'center' as const,
      minWidth: 90,
      render: (text: string) =>
        text?text === '医药高新区（高港区）' ?'医药':text.substring(0, 2):''
    },
    {
      title: "需新增用地项目",
      dataIndex: 'newLandRequired',
      key: 'newLandRequired',
      align: 'center' as const,
      minWidth: 130,
      children: [
        {
          title: "个数",
          dataIndex: 'newLandRequiredCount',
          key: 'newLandRequiredCount',
          align: 'center' as const,
          onHeaderCell:()=>({
            style:{
              fontSize: '12px'
            }
          })
        },
        {
          title: "需求面积(亩)",
          dataIndex: 'requiredArea',
          key: 'requiredArea',
          align: 'center' as const,
          render: () => '--',
          onHeaderCell:()=>({
            style:{
              fontSize: '12px'
            }
          })
        }
      ]
    },
    {
      title: "已供土地项目",
      dataIndex: 'landSupplied',
      key: 'landSupplied',
      align: 'center' as const,
      children: [
        {
          title: "个数",
          dataIndex: 'newLandRequiredCount',
          key: 'newLandRequiredCount',
          align: 'center' as const,
          onHeaderCell:()=>({
            style:{
              fontSize: '12px'
            }
          })
        },
        {
          title: "已供面积(亩)",
          dataIndex: 'suppliedArea',
          key: 'suppliedArea',
          align: 'center' as const,
          render: () => '--',
          onHeaderCell:()=>({
            style:{
              fontSize: '12px'
            }
          })
        }
      ]
    },
  ]

  // 图表配置
  const getChartOption = () => {
    const colors = ['#ED8E08','#FF5555','#5596FF','#E8E025','#24BD6C','#9D55FF'];
    const data = dataSource&&dataSource.length>0? dataSource[0].children:[];
    const data1 = data&&data.length>0 ? data.map((item:any)=>({name: item.district,value: item.totalFiledProjects || 0})):[]
    return {
      color: colors,
      title: {
        x: "center",
        y: '40%',
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
              padding: [10, 0,0,0],
            },
          },
        },
      },
      legend: {
        x: "center",
        left: '15%',
        bottom: 0,
        itemWidth: 12,  // 设置图例标记的宽度
        itemHeight: 12, // 设置图例标记的高度
        // itemGrap: 10,
        textStyle: {
          fontSize: 12,
          color: '#16151A'
        }
      },
      tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}<br/>数量: ${p.value}<br/>占比: ${p.percent}%` },
      series: [
        {
          type: 'pie',
          name: '项目数量及占比',
          radius: ["37%", "57%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          label: {
            normal: {
              formatter: function (params:any) {
                let str = ''
                switch (params.name) {
                  case '靖江市':
                    str = '{a|'+params.name+'}'
                    break;
                  case '泰兴市':
                    str = '{b|'+params.name+'}'
                    break;
                  case '兴化市':
                    str = '{c|'+params.name+'}'
                    break;
                  case '海陵区':
                    str = '{d|'+params.name+'}'
                    break;
                  case '姜堰区':
                    str = '{e|'+params.name+'}'
                    break;
                  case '医药高新区（高港区）':
                    str = '{f|医药高新区\n(高港区)}'
                    break;
                  default:
                    break;
                }
                return str + '\n{t|数量:'+params.value+'}\n{t|占比:'+params.percent+'}%'
              },
              rich: {
                a:{
                  color: '#ED8E08',
                  lineHeight: 20,
                  fontSize: 12
                },
                b:{
                  color: '#FF5555',
                  lineHeight: 20,
                  fontSize: 12
                },
                c:{
                  color: '#5596FF',
                  lineHeight: 20,
                  fontSize: 12
                },
                d:{
                  color: '#E8E025',
                  lineHeight: 20,
                  fontSize: 12
                },
                e:{
                  color: '#24BD6C',
                  lineHeight: 20,
                  fontSize: 12
                },
                f:{
                  color: '#9D55FF',
                  lineHeight: 20,
                  fontSize: 12
                },
                t:{
                  color:'rgba(26, 35, 126, 1)',
                  lineHeight: 20,
                  fontSize: 12
                }
              }
            },
          },
          data:data1,
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

  // 图表配置---各市区投资额趋势
  const getChartOption2 = () => {
    const colors = ['#5596FF', '#9D55FF', '#FF5555'];
    const data = dataSource&&dataSource.length>0? dataSource[0].children:[];
    return {
      color:colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      grid: {
        bottom: '20%',
      },
      legend: {
        data: ['备案投资额', '无需新增用地投资', '租用厂房投资'],
        bottom: 0,
        left: 'center',
        x: 'center',
        textStyle:{
          color: 'rgba(154, 159, 181, 1)',
          fontSize: 12
        }
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            show:false
          },
          axisLabel: {
            interval: 0, // 强制显示所有标签
            // rotate: 30, // 标签旋转防重叠
            fontSize: 10, // 调小字体
            color: '#16151A',
          },
          axisLine: {
            lineStyle: {
              color: '#16151A'
            },
          },
          data: data&&data.length > 0? data.map((item:any)=>item.district):[],
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '项目数量',
          position: 'left',
          nameTextStyle: {
            color:'#16151A'
          },
          alignTicks: true,
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}',
            color:'#16151A'
          },
          splitLine: {
            lineStyle: {
              color: '#9A9FB5'
            }
          }
        },
      ],
      series: [
        {
          name: '备案投资额',
          type: 'line',
          data:  data&&data.length > 0
            ? data.map((item: any) => ((item.totalInvestment || 0) / 10000).toFixed(2))
            : [],
        },
        {
          name: '无需新增用地投资',
          type: 'line',
          data:  data&&data.length > 0
            ? data.map((item: any) => ((item.noNewLandInvestment || 0) / 10000).toFixed(2))
            : [],
        },
        {
          name: '租用厂房投资',
          type: 'line',
          data:  data&&data.length > 0
            ? data.map((item: any) => ((item.leasedFactoryInvestment || 0) / 10000).toFixed(2))
            : [],
        },
      ],
    };
  };

  
  // 图表配置---各市区用地项目对比
  const getChartOption3 = () => {
    const colors = ['#5596FF','#24BD6C']
    const data = dataSource&&dataSource.length>0? dataSource[0].children:[];
    
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
      },
      color:colors,
      legend: {
        data: ['需新增用地项目','已供土地项目'],
        bottom: 0,
        x: "center",
        // left: '20%',
        icon: 'circle',
        itemWidth: 12,  // 设置图例标记的宽度
        itemHeight: 12, // 设置图例标记的高度
        textStyle: {
          fontSize: 12,
          color: 'rgba(154, 159, 181, 1)'
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
        data: data&&data.length > 0? data.map((item:any)=>item.district === '医药高新区（高港区）' ? '医药' : item.district.substring(0, 2)):[],
        axisLabel: {
          fontSize: 12,
          color:'#16151A'
        },
        axisLine: {
          lineStyle: {
            color: '#16151A' // '#e8e8e8'
          }
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '数量(个)',
          position: 'left',
          nameTextStyle: {
            color:'#16151A'
          },
          axisLabel: {
            formatter: '{value}',
            fontSize: 12,
            // color: '#666'
            color:'#16151A'
          },
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              // color: '#f0f0f0'
              color: '#9A9FB5'
            }
          }
        }
      ],
      series: [
        {
          name: '需新增用地项目',
          type: 'bar',
          yAxisIndex: 0,
          legend: {
            icon: 'circle'
          },
          data: data&&data.length > 0
            ? data.map((item: any) => item.newLandRequiredCount || 0)
            : [],
          barWidth: '30%',
          emphasis: {
            itemStyle: {
              color: '#5596FF'
            }
          },
        },
        {
          name: '已供土地项目',
          type: 'bar',
          legend: {
            icon: 'circle'
          },
          yAxisIndex: 0,
          data: data&&data.length > 0
            ? data.map((item: any) => item.landSuppliedCount || 0)
            : [],
          barWidth: '30%',
          emphasis: {
            itemStyle: {
              color: '#24BD6C'
            }
          },
        }
      ]
    };
  };

  const onChangeStart = (e: any) => setStartDate(dayjs(e));
  const onChangeEnd = (e: any) => setEndDate(dayjs(e));

  // 表单提交处理：开始时间 = 当月1号，结束时间 = 结束月最后一天
  const onFinish = () => {
    setMoney2(money);
    const start = new Date(Date.UTC(dayjs(startDate).year(), dayjs(startDate).month(), 1));
    const end = new Date(Date.UTC(dayjs(endDate).year(), dayjs(endDate).month() + 1, 0));
    loadData({
      start,
      end,
      projectType: industry || undefined,
      minAmount: money === 0 ? undefined : money === 1 ? 10000 : money === 5 ? 50000 : 100000,
      maxAmount: money === 1 ? 50000 : money === 5 ? 100000 : undefined,
    });
  };

  // 重置表单：与 project-progress 详情页一致，使用固定默认月份（含 start/end）
  const onReset = () => {
    form.resetFields();
    setMoney(0);
    setMoney2(0);
    const { start, end } = getMonthRangeUTC(FIXED_YEAR, FIXED_MONTH);
    setStartDate(dayjs(start));
    setEndDate(dayjs(end));
    setIndustry('');
    form.setFieldsValue({
      money: 0,
      industry: '',
    });
    loadData({ start, end });
  };

  const loadData = async (params: { start: Date; end: Date; projectType?: string; minAmount?: number; maxAmount?: number }) => {
    setLoading(true);
    try {
    const res = await primeApi.getLandUse(params);
    
    // 转换响应数据格式到TreeNodeData
      const transformData = (item: any, parentKey: string = '', index: number = 0): any => {
        const key = parentKey ? `${parentKey}-${index}` : 'root';
        return {
          key,
          district: item.district,
          park: item.park,
          districtName: item.district,
          parkName: item.park,
          // 备案项目总数
          totalFiledProjects: item.total?.count,
          totalInvestment: item.total?.amount,
          // 需新增用地项目
          newLandRequiredCount: item.increasement?.count,
          requiredArea: item.increasement?.amount,
          // 已供土地
          landSuppliedCount: item.accumulation?.count,
          suppliedArea: item.accumulation?.amount,
          // 无需新增用地项目
          noNewLandRequiredCount: item.nonLandProject?.count,
          noNewLandInvestment: item.nonLandProject?.amount,
          // 其中：租用厂房项目
          leasedFactoryCount: item.factoryProject?.count,
          leasedFactoryInvestment: item.factoryProject?.amount,
          children: item.children&&item.children.length>0 ? item.children.map((child: any, childIndex: number) =>
            transformData(child, key, childIndex)
          ) : undefined
        };
      };

      const responseWithKeys = transformData(res);
      setDataSource([responseWithKeys]);
      
      // 只展开第一级
      const getFirstLevelKeys = (data: any): React.Key[] => {
        const keys: React.Key[] = [];
        if (data.key) {
          keys.push(data.key);
        }
        return keys;
      };

      setExpandedKeys(getFirstLevelKeys(responseWithKeys));
    } catch (error) {
      console.error('获取用地保障数据失败:', error);
      message.error('获取用地保障数据失败');
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  }


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
    loadData({
      start,
      end,
      projectType: industry || undefined,
      minAmount: money === 0 ? undefined : money === 1 ? 10000 : money === 5 ? 50000 : 100000,
      maxAmount: money === 1 ? 50000 : money === 5 ? 100000 : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div className={styles.container}>

      {/* 顶部标签切换 */}
      <div className={styles.tabContainer}>
        <Row className={styles.backCon} onClick={() => navigate(-1)}>
          <img className={styles.backImg} src="/img/tutorial/backBtn.png" alt="" />
          <div className={styles.backText}>返回</div>
        </Row>
        <Breadcrumb>
          <Breadcrumb.Item>
            <span style={{ color: '#666666' }}>备案审批</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item><span style={{ color: '#1A237E', fontWeight: 600 }}>用地保障</span></Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.filterContainer}>
        <div className={styles.filterRow}>

          <Button
            className={styles.filterButton}
            onClick={() => { setShowMonthModal(!showMonthModal); setTimeType('start'); setShowCumulativeModal(false);setShowIndustryModal(false) }}
          >
            所属月份
            {showMonthModal ? (
              <CaretUpOutlined />
            ) : (
              <CaretDownOutlined />
            )}
          </Button>
          <div className={styles.shuxian}></div>

          <Button
            className={styles.filterButton}
            onClick={() => { setShowCumulativeModal(!showCumulativeModal); setTimeType('start'); setShowMonthModal(false);setShowIndustryModal(false) }}
          >
            金额筛选
            {showCumulativeModal ? (
              <CaretUpOutlined />
            ) : (
              <CaretDownOutlined />
            )}
          </Button>
          <div className={styles.shuxian}></div>
          <Button
            className={styles.filterButton}
            onClick={() => { setShowIndustryModal(!showIndustryModal); setTimeType('start'); setShowCumulativeModal(false);setShowMonthModal(false) }}
          >
            所属行业
            {showIndustryModal ? (
              <CaretUpOutlined />
            ) : (
              <CaretDownOutlined />
            )}
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
                        if (type === 'year') return `${val}年`;
                        if (type === 'month') return `${val}月`;
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
                        if (type === 'year') return `${val}年`;
                        if (type === 'month') return `${val}月`;
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
                    onClick={() => { setMoney(0) }}
                  >
                    <span>全部</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${money === 1 ? styles.selected : ''}`}
                    onClick={() => { setMoney(1) }}
                  >
                    <span>一亿元</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${money === 5 ? styles.selected : ''}`}
                    onClick={() => { setMoney(5) }}
                  >
                    <span>五亿元</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${money === 10 ? styles.selected : ''}`}
                    onClick={() => { setMoney(10) }}
                  >
                    <span>十亿元</span>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <Button
                    className={styles.resetButton}
                    onClick={() => { setShowCumulativeModal(false); onReset() }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => { setShowCumulativeModal(false); onFinish() }}
                  >
                    确定选定金额
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 所属行业弹窗 */}
        {showIndustryModal && (
          <div className={styles.modalOverlay} onClick={() => setShowIndustryModal(false)}>
            <LockBodyScroll />
            <div className={styles.cumulativeModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalContent}>
                <div className={styles.investmentOptions}>
                  <div
                    className={`${styles.investmentOption} ${industry === '' ? styles.selected : ''}`}
                    onClick={() => { setIndustry(''); }}
                  >
                    <span>全部</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${industry === '1' ? styles.selected : ''}`}
                    onClick={() => { setIndustry('1'); }}
                  >
                    <span>服务业</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${industry === '2' ? styles.selected : ''}`}
                    onClick={() => { setIndustry('2'); }}
                  >
                    <span>制造业</span>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <Button
                    className={styles.resetButton}
                    onClick={() => { setShowIndustryModal(false); onReset() }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => { setShowIndustryModal(false); onFinish() }}
                  >
                    确定
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 所属行业弹窗 */}
        
      </div>

      {/* 备案项目数量及占比 */}
      {chartType2 === 'bar' &&chartType3 === 'bar' && (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft}>
            <h3 className={styles.chartTitle}>备案项目数量及占比</h3>
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

          <div>
            <div className={styles.divider}></div>
            <div className={styles.chartContainer}>
              {chartType === 'bar' && (
                <>
                  <ReactECharts
                    ref={chartRef}
                    option={getChartOption()}
                    style={{ height: '340px', width: '100%' }}
                  />
                </>
              )}
              {chartType === 'table' && (
                <div className={styles.tableContainer}>
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    rowKey={(record) => record.key}
                    pagination={false}
                    size="middle"
                    className={styles.benchtable}
                    bordered={false}
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

      </div>
      )}
      {/* 备案项目数量及占比 */}

      {/* 各市区投资额趋势 */}
      {chartType === 'bar' &&chartType3 === 'bar' && (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft}>
            <h3 className={styles.chartTitle}>各市区投资额趋势</h3>
          </div>

          
          <div className={styles.chartToggle}>
            <Button
              type={chartType2 === 'bar' ? 'primary' : 'default'}
              size="small"
              onClick={() => setChartType2('bar')}
            >
              图形
            </Button>
            <Button
              type={chartType2 === 'table' ? 'primary' : 'default'}
              size="small"
              onClick={() => setChartType2('table')}
            >
              表格
            </Button>
          </div>
        </div>

          <div>
            <div className={styles.chartContainer}>
              {chartType2 === 'bar' ? (
                <>
                  <ReactECharts
                    ref={chartRef2}
                    option={getChartOption2()}
                    style={{ height: '340px', width: '100%' }}
                  />
                </>
              ) : (
                <div className={styles.tableContainer}>
                  <Table
                    columns={columns2}
                    dataSource={dataSource}
                    loading={loading}
                    rowKey={(record) => record.key}
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
        
      </div>
      )}
      {/* 各市区投资额趋势 */}


      {/* 各市区用地项目对比 */}
      {chartType === 'bar' &&chartType2 === 'bar' && (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft}>
            <h3 className={styles.chartTitle}>各市区用地项目对比</h3>
          </div>

          
          <div className={styles.chartToggle}>
            <Button
              type={chartType3 === 'bar' ? 'primary' : 'default'}
              size="small"
              onClick={() => setChartType3('bar')}
            >
              图形
            </Button>
            <Button
              type={chartType3 === 'table' ? 'primary' : 'default'}
              size="small"
              onClick={() => setChartType3('table')}
            >
              表格
            </Button>
          </div>
        </div>

          <div>
            <div className={styles.chartContainer}>
              {chartType3 === 'bar' ? (
                <>
                  <ReactECharts
                    ref={chartRef3}
                    option={getChartOption3()}
                    style={{ height: '340px', width: '100%' }}
                  />
                </>
              ) : (
                <div className={styles.tableContainer}>
                  <Table
                    columns={columns3}
                    dataSource={dataSource}
                    loading={loading}
                    rowKey={(record) => record.key}
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
        
      </div>
      )}
      {/* 各市区用地项目对比 */}

      
    </div >
  );
};

export default LandDetail;