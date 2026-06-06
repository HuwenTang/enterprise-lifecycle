/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useRef } from "react";
import { Button, Breadcrumb, Row, Table, Form, InputNumber, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import styles from './index.module.css';
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { DatetimePicker } from 'react-vant';
import { useSearchParams } from "react-router-dom";
import { primeApi } from "../../../../api.ts";
import dayjs from 'dayjs';

const ProjectProgress: React.FC = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRefAmont = useRef(null);

  const [searchParams] = useSearchParams();
  const [timeType, setTimeType] = useState<'start' | 'end'>('start');
  const [chartType, setChartType] = useState<'bar' | 'table'>('bar');
  const [chartType2, setChartType2] = useState<'bar' | 'table'>('bar');
  const [showCumulativeModal, setShowCumulativeModal] = useState(false); // 金额筛选弹窗状态
  const [showMonthModal, setShowMonthModal] = useState(false); // 月份筛选弹窗状态
  const [showIndustryModal, setShowIndustryModal] = useState(false); // 行业筛选弹窗状态
  const [showIsKcProjModal, setShowIsKcProjModal] = useState(false); // 科创筛选弹窗状态

  
  const [loading] = useState(false);
  
  const [money, setMoney] = useState(0); // 选中的投资选项
  const [, setMoney2] = useState(Number(searchParams.get('money')));
  const [showMoneyInput, setShowMoneyInput] = useState(false);
  const [startMoney, setStartMoney] = useState(0);
  const [endMoney, setEndMoney] = useState(1);
  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month'));
  const [industry, setIndustry] = useState('');
  const [isKcProj, setIsKcProj] = useState('');
  const [rangeDate, setRangeDate] = useState([dayjs().startOf('year'), dayjs().endOf('month')]);
  const [, setRangeDate2] = useState([dayjs().startOf('year'), dayjs().endOf('month')]);

  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<any[]>([]);

  // 获取单元格样式（根据权限）
  const getCellStyle = () => {
    return {
      cursor: 'pointer',
      fontWeight: 700,
      color: '#1a237e',
      transition: 'color 0.3s ease',
    };
  };

  const handleToList = (record: any,type:string) => {
    console.log('record--any----',record);
    
    const queryParams = new URLSearchParams({
      currStartDate: dayjs(startDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      showAll: 'true',
      page: '1',
      pageSize: '10',
      isKcProj: isKcProj,
      projectType: industry === '1' ? '服务业': industry === '2'?'工业':''
    });
    if (type === '1') {
      // queryParams.set('currentProjectProgress', '2');
    } else if (type === '2') {
      queryParams.set('rProgress', '1');
    } else if (type === '3') {
      queryParams.set('rProgress', '5');
    }
    if (record?.districtCode) {
      queryParams.set('district', record?.districtCode);
    }
    if (money !== 0 && money !== -1) {
      queryParams.set('investmentAmount', money.toString());
    } else if (money === -1) {
      queryParams.set('rmb1', startMoney.toString());
      queryParams.set('rmb2', endMoney.toString());
      queryParams.set('doller1', Number(((startMoney * 10000) / 7.2).toFixed(0)).toString());
      queryParams.set('doller2', Number(((endMoney * 10000) / 7.2).toFixed(0)).toString());
    }
    queryParams.set('fromPage', '/tutorial/over-million-projects');
    // 跳转到项目管理页面
    navigate(`/tutorial/preinvestment/InvestProjectList?${queryParams.toString()}`);
  };

  const columns = [
    {
      title: "区域",
      dataIndex: 'district',
      key: 'district',
      align: 'center' as const,
    },
    {
      title: "项目个数",
      dataIndex: 'newNum',
      key: 'newNum',
      align: 'center' as const,
      onCell: (record: any) => ({
        onClick: () => handleToList(record,'1'),
        style: getCellStyle(),
      }),
    },
    {
      title: "投资额(亿)",
      dataIndex: 'newAmount',
      key: 'newAmount',
      align: 'center' as const,
    }
  ]

  const columns2 = [
    {
      title: "区域",
      dataIndex: 'district',
      key: 'district',
      align: 'center' as const,
    },
    {
      title: "注册项目数",
      dataIndex: 'registerNum',
      key: 'registerNum',
      align: 'center' as const,
      onCell: (record: any) => ({
        onClick: () => handleToList(record,'2'),
        style: getCellStyle(),
      }),
    },
    {
      title: "备案项目数",
      dataIndex: 'fillNum',
      key: 'fillNum',
      align: 'center' as const,
      onCell: (record: any) => ({
        onClick: () => handleToList(record,'3'),
        style: getCellStyle(),
      }),
    },
  ]

  // 图表配置
  const getChartOption = () => {
    const colors = ['#ED8E08','#FF5555','#5596FF','#E8E025','#24BD6C','#9D55FF'];
    const monthData = dataSource.map(item=>{
      return {
        value:item.newNum,
        name: item.district // === '医药高新区(高港区)' ? '医药' : item.district.substring(0, 2)
      }
    })
    
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
                    str = '{f|医药高新区(高港区)}'
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
          data:monthData,
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

  // 图表配置---全市内外资项目数及投资额
  const getChartOptionAmont = () => {
    const colors = ['#5596FF','#24BD6C']
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        // formatter: function (params: any) {
        //   const dataIndex = params[0].dataIndex;
        //   const name = dataSource[dataIndex].district;
        //   const value = dataSource[dataIndex].registerNum;
        //   const trend = dataSource[dataIndex].fillNum;
        //  return `${name}<br/>注册项目数: ${value}个<br/>备案项目数: ${trend}`;
        // }
      },
      color:colors,
      legend: {
        data: ['注册项目数','备案项目数'],
        bottom: 0,
        // left: '28%',
        x: "center",
        // right: '20%',
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
        data: dataSource.map(item =>{
          return {
            name: item.district === '医药高新区(高港区)' ? '医药' : item.district.substring(0, 2)
          }
        }).map(item=>item.name),
        axisLabel: {
          fontSize: 12,
          // color: '#666'
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
          name: '注册项目数',
          type: 'bar',
          yAxisIndex: 0,
          legend: {
            icon: 'circle'
          },
          data: dataSource.map((item) => ({
            value: item.registerNum,
            itemStyle: {
              color: '#5596FF'
            }
          })),
          barWidth: '30%',
          emphasis: {
            itemStyle: {
              color: '#5596FF'
            }
          },
        },
        {
          name: '备案项目数',
          type: 'bar',
          legend: {
            icon: 'circle'
          },
          yAxisIndex: 0,
          data: dataSource.map((item) => ({
            value: item.fillNum,
            itemStyle: {
              color: '#24BD6C'
            }
          })),
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

  const changeStart = (newValue: any) => {
    setStartMoney(newValue);
  };
  const changeEnd = (newValue: any) => {
    setEndMoney(newValue);
  };

  const onChangeStart = (e:any) =>{
    setStartDate(dayjs(e));
    setRangeDate([dayjs(e), dayjs(endDate).endOf('month')]);
  }

  const onChangeEnd = (e:any) =>{
    setEndDate(dayjs(e));
    setRangeDate([dayjs(startDate), dayjs(e).endOf('month')]);
  }

  // 表单提交处理
  const onFinish = () => {
    setMoney2(money);
    setRangeDate2([dayjs(rangeDate[0]), dayjs(rangeDate[1]).endOf('month')]);
    if(dayjs(endDate).isBefore(dayjs(startDate))){
      message.warning('结束时间不可大于开始时间');
      return false
    }
    
    loadData({
      rmb: money === 0 || money === -1 ? undefined : money,
      currStartDate: dayjs(startDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      industry: industry === '1'? '服务业' : industry === '2'? '工业': '',
      isKcProj: isKcProj,
      rmb1: money === -1 ? startMoney : undefined,
      rmb2: money === -1 ? endMoney : undefined,
      doller1: money === -1 ? Number(((startMoney * 10000) / 7.2).toFixed(0)) : undefined,
      doller2: money === -1 ? Number(((endMoney * 10000) / 7.2).toFixed(0)) : undefined,
    });
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
    setMoney(0);
    setMoney2(0);
    setEndDate(dayjs().endOf('month'));
    setStartDate(dayjs().startOf('year'));
    setIndustry('');
    setIsKcProj('');
    setRangeDate([dayjs().startOf('year'), dayjs().endOf('month')]);
    setRangeDate2([dayjs().startOf('year'), dayjs().endOf('month')]);
    setStartMoney(0);
    setEndMoney(1);
    setShowMoneyInput(false);
    form.setFieldsValue({
      money: 0,
      endDate: dayjs().endOf('month'),
      rangeDate: [dayjs().startOf('year'), dayjs().endOf('month')],
      industry: '',
      isKcProj: '',
      startMoney: 0,
      endMoney: 1,
    });
    const endTime = dayjs().endOf('month');
    loadData({
      industry: '',
      isKcProj: '',
      currStartDate: dayjs(endTime).startOf('year').startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endTime).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endTime).startOf('month').format('YYYY-MM-DD')
    });
  };

  const loadData = async (params: any) => {
    const res = await primeApi.statisticsProjectStatusInfo(params);
    const data = res ? res : [];
    
    const tableData = data.map((item: any) => {
      // (1 注册  5备案 4 报批 2开工 3 竣工)
      return {
        districtCode: item.districtCode,
        district: item.district,
        newNum: item.projNums || 0,
        newAmount: item.ztz || 0,
        registerNum: item.zcProjNum || 0,
        registerAmount: item.zcTz || 0,
        fillNum: item.baProjNum  || 0,
        fillAmount: item.baTz  || 0,
      };
    });
    setDataSource(tableData);
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滚动
    });
  };
  
  
  useEffect(() => {
    scrollToTop();
    setEndDate(dayjs().endOf('month'));
    loadData({
      industry: '',
      isKcProj: '',
      currStartDate: dayjs(endDate).startOf('year').startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当chartData更新后，根据initialArea设置selectedIndex
  // useEffect(() => {
  //   if (chartData.length > 0 && initialArea) {
  //     const index = chartData.findIndex(item => item.district === initialArea);
  //     if (index !== -1) {
  //       setSelectedIndex(index);
  //     }
  //   }
  // }, [chartData, initialArea]);

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
            <span style={{ color: '#666666' }}>前期招商</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item><span style={{ color: '#1A237E', fontWeight: 600 }}>项目进度情况</span></Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.filterContainer}>
        <div className={styles.filterRow}>

          <Button
            className={styles.filterButton}
            onClick={() => { setShowMonthModal(!showMonthModal); setTimeType('start'); setShowCumulativeModal(false);setShowIndustryModal(false);setShowIsKcProjModal(false) }}
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
            onClick={() => { setShowCumulativeModal(!showCumulativeModal); setTimeType('start'); setShowMonthModal(false);setShowIndustryModal(false);setShowIsKcProjModal(false) }}
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
            onClick={() => { setShowIndustryModal(!showIndustryModal); setTimeType('start'); setShowCumulativeModal(false);setShowMonthModal(false);setShowIsKcProjModal(false) }}
          >
            所属行业
            {showIndustryModal ? (
              <CaretUpOutlined />
            ) : (
              <CaretDownOutlined />
            )}
          </Button>
          <div className={styles.shuxian}></div>
          <Button
            className={styles.filterButton}
            onClick={() => { setShowIsKcProjModal(!showIsKcProjModal); setTimeType('start'); setShowCumulativeModal(false);setShowMonthModal(false);setShowIndustryModal(false) }}
          >
            科创项目
            {showIsKcProjModal ? (
              <CaretUpOutlined />
            ) : (
              <CaretDownOutlined />
            )}
          </Button>
        </div>

        {/* 所属月份弹窗 */}
        {showMonthModal && (
          <div className={styles.modalOverlay} onClick={() => setShowMonthModal(false)}>
            <LockBodyScroll />
            <div className={styles.cumulativeModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalContent}>

                <div className={styles.monthContent}>
                  <div className={styles.monthCon}>
                    {timeType==='start'&&(
                      <>
                        <div className={styles.monthSpan}></div>
                        <div className={styles.monthText}>选择开始时间</div>
                        <div className={styles.monthSpan} onClick={()=>setTimeType('end')}>{'结束时间>>'}</div>
                      </>
                    )}
                    {timeType==='end'&&(
                      <>
                        <div className={styles.monthSpan}></div>
                        <div className={styles.monthText}>选择结束时间</div>
                        <div className={styles.monthSpan} onClick={()=>setTimeType('start')}>{'开始时间>>'}</div>
                      </>
                    )}
                  </div>
                  {timeType==='start'&&(
                    <DatetimePicker
                      type='year-month'
                      minDate={new Date(2020,0, 1)}
                      maxDate={new Date(dayjs().year(), dayjs().month(), 1)}
                      value={new Date(dayjs(startDate).year(),dayjs(startDate).month(),1)}
                      showToolbar={false}
                      onChange={onChangeStart}
                      formatter={(type: string, val: string) => {
                        if (type === 'year') {
                          return `${val}年`
                        }
                        if (type === 'month') {
                          return `${val}月`
                        }
                        return val
                      }}
                    />
                  )}
                  {timeType==='end'&&(
                    <DatetimePicker
                      type='year-month'
                      minDate={new Date(2020,0, 1)}
                      maxDate={new Date((dayjs().year()), dayjs().month()+1, 1)}
                      value={new Date(dayjs(endDate).year(),dayjs(endDate).month(),1)}
                      showToolbar={false}
                      onChange={onChangeEnd}
                      formatter={(type: string, val: string) => {
                        if (type === 'year') {
                          return `${val}年`
                        }
                        if (type === 'month') {
                          return `${val}月`
                        }
                        return val
                      }}
                    />
                  )}
                </div>

                <div className={styles.modalActions}>
                  <Button
                    className={styles.resetButton}
                    onClick={() => { setShowMonthModal(false); onReset() }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => { setShowMonthModal(false); onFinish() }}
                  >
                    确定
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 所属月份弹窗 */}

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
                    className={`${styles.investmentOption} ${money === -1 ? styles.selected : ''}`}
                    onClick={() => { setMoney(-1); setShowMoneyInput(true) }}
                  >
                    <span>自定义金额</span>
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

        {/* 是否科创项目弹窗 */}
        {showIsKcProjModal && (
          <div className={styles.modalOverlay} onClick={() => setShowIsKcProjModal(false)}>
            <LockBodyScroll />
            <div className={styles.cumulativeModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalContent}>
                <div className={styles.investmentOptions}>
                  <div
                    className={`${styles.investmentOption} ${isKcProj === '' ? styles.selected : ''}`}
                    onClick={() => { setIsKcProj(''); }}
                  >
                    <span>全部</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${isKcProj === '是' ? styles.selected : ''}`}
                    onClick={() => { setIsKcProj('是'); }}
                  >
                    <span>是</span>
                  </div>
                  <div
                    className={`${styles.investmentOption} ${isKcProj === '否' ? styles.selected : ''}`}
                    onClick={() => { setIsKcProj('否'); }}
                  >
                    <span>否</span>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <Button
                    className={styles.resetButton}
                    onClick={() => { setShowIsKcProjModal(false); onReset() }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => { setShowIsKcProjModal(false); onFinish() }}
                  >
                    确定
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 是否科创项目弹窗 */}

        
      </div>

      {/* 全市新签约项目数量 */}
      {chartType2 === 'bar' && (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft}>
            <h3 className={styles.chartTitle}>全市新签约项目数量</h3>
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
                    rowKey={(record) => record.districtCode}
                    pagination={false}
                    size="middle"
                    className={styles.benchtable}
                    bordered={false}
                  />
                </div>
              )}
            </div>
          </div>

      </div>
      )}
      {/* 全市新签约项目数量 */}

      {/* 五阶段项目数量 */}
      {chartType === 'bar' && (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft}>
            <h3 className={styles.chartTitle}>五阶段项目数量</h3>
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
                    ref={chartRefAmont}
                    option={getChartOptionAmont()}
                    style={{ height: '340px', width: '100%' }}
                  />
                </>
              ) : (
                <div className={styles.tableContainer}>
                  <Table
                    columns={columns2}
                    dataSource={dataSource}
                    loading={loading}
                    rowKey={(record) => record.districtCode}
                    pagination={false}
                    bordered={false}
                    size="middle"
                    className={styles.benchtable}
                  />
                </div>
              )}
            </div>
          </div>
        
      </div>
      )}
      {/* 五阶段项目数量 */}

      
    </div >
  );
};

export default ProjectProgress;