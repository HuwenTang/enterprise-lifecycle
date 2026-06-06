/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Button, Breadcrumb, Row, Table, Form, InputNumber, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import { CaretUpOutlined, CaretDownOutlined,UpOutlined,DownOutlined } from "@ant-design/icons";
import { DatetimePicker } from 'react-vant'
import { useSearchParams } from "react-router-dom";
import { primeApi } from "../../../../api.ts";
import dayjs from 'dayjs';
import { IndustrialChainDistributionTreeVo } from '../../../../apis/index.ts';
import { useRef } from "react";
import ReactECharts from 'echarts-for-react';
import * as echarts from "echarts";

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

const ChainDetail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [timeType, setTimeType] = useState<'start' | 'end'>('start');
  const [chartType, setChartType] = useState<'bar' | 'table'>('bar');
  const [chartType2, setChartType2] = useState<'bar' | 'table'>('bar');
  const [showCumulativeModal, setShowCumulativeModal] = useState(false); // 金额筛选弹窗状态
  const [showMonthModal, setShowMonthModal] = useState(false); // 月份筛选弹窗状态

  
  const [loading,setLoading] = useState(false);
  
  const [money, setMoney] = useState(0); // 选中的投资选项
  const [, setMoney2] = useState(Number(searchParams.get('money')));
  const [showMoneyInput, setShowMoneyInput] = useState(false);
  const [startMoney, setStartMoney] = useState(0);
  const [endMoney, setEndMoney] = useState(1);
  const initialRange = getStartEndFromUrlOrMonth(searchParams);
  const [startDate, setStartDate] = useState(dayjs(initialRange.start));
  const [endDate, setEndDate] = useState(dayjs(initialRange.end));

  const [form] = Form.useForm();
  const [, setDataSource] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartData2, setChartData2] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const columns = [
    {
      title: "创新集群",
      dataIndex: 'innovativeClusterLabel',
      key: 'innovativeClusterLabel',
      align: 'left' as const,
      onHeaderCell:()=>({
        style:{
          paddingLeft: '30px'
        }
      }),
      render: (text: number,record:any) => text ? text : record.industrialChainLabel
    },
    {
      title: "项目数量",
      dataIndex: 'projectCount',
      key: 'projectCount',
      align: 'center' as const,
      minWidth: 90,
      render: (text: number) => text || 0
    },
    {
      title: "比重",
      dataIndex: 'projectProportion',
      key: 'projectProportion',
      align: 'center' as const,
      minWidth: 90,
      render: (text: number) =>text ? text.toFixed(2) + '%' : '0.00%'
    }
  ]

  const columns2 = [
    {
      title: "创新集群",
      dataIndex: 'innovativeClusterLabel',
      key: 'innovativeClusterLabel',
      align: 'left' as const,
      onHeaderCell:()=>({
        style:{
          paddingLeft: '30px'
        }
      }),
      render: (text: number,record:any) => text ? text : record.industrialChainLabel
    },
    {
      title: "备案投资额",
      dataIndex: 'investmentAmount',
      key: 'investmentAmount',
      align: 'center' as const,
      minWidth: 90,
      render: (text: number) => text ? (text / 10000).toFixed(2) : '0.00'
    },
    {
      title: "比重",
      dataIndex: 'investmentProportion',
      key: 'investmentProportion',
      align: 'center' as const,
      minWidth: 90,
      render: (text: number) =>text ? text.toFixed(2) + '%' : '0.00%'
    },
  ]

  
  const chartRef = useRef(null);
  const chartRef11 = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef22 = useRef(null);

  const getChartOption = (type:string,obj:any) => {
     return {
      xAxis: {
        show: false,
        type: "value",
      },
      grid: {
        left: '25%',
        right: '31%',
      },
      yAxis: [
        {
          type: "category",
          inverse: true,
          axisLabel: {
            show: true,
            textStyle: {
              color: "#1A237E",
              fontSize: '12',
            },
            formatter: function (value:any) {
              let str = ''
              if(value.length>6){
                str = '{a|'+value.substr(0,6)+'}\n{b|'+value.substr(6)+'}'
              }else{
                str = '{a|'+value+'}'
              }
              return str
            },
            rich:{
              a: {
                color: "#1A237E",
                fontSize: '12',
              },
              b:{
                color: "#1A237E",
                fontSize: '12',
                padding: [5,0,0,0]
              }
            }
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          data: type === 'a' || type === 'c' ? [obj.innovativeClusterLabel]:[obj.industrialChainLabel]
        },
        // {
        //   type: "category",
        //   inverse: true,
        //   axisTick: "none",
        //   axisLine: "none",
        //   show: true,
        //   axisLabel: {
        //     textStyle: {
        //       color: "#9A9FB5",
        //       fontSize: "12",
        //       // align: "right",
        //     },
        //     formatter: function (value:any) {
        //       let str = ''
        //       if(type === 'a' || type === 'b'){
        //         const per = obj.projectProportion ? obj.projectProportion.toFixed(2) + '%' : '0.00%'
        //         const num = obj.projectCount ||0
        //         str = per + '  |  ' + num + '个'
        //       }else{
        //         const per = obj.investmentProportion ? obj.investmentProportion.toFixed(2) + '%' : '0.00%'
        //         const num = obj.investmentAmount ?(obj.investmentAmount/10000).toFixed(2) : 0
        //         str = per + '  |  ' + num
        //       }
        //       return str // value + '%'
        //     },
        //   },
        //   data: type === 'a' || type === 'b' ? [obj.projectProportion ? obj.projectProportion.toFixed(2) : 0] : [obj.investmentProportion ? obj.investmentProportion.toFixed(2)  : 0],
        // },
      ],
      series: [
        {
          name: "背景",
          type: "bar",
          barWidth: 13,
          barGap: "-100%",
          data: [100],
          label: {
            normal: {
              show: true,
              position: "right",
              inside: false,
              color: "#9A9FB5",
              fontSize: "12",
              // align: "right",
              formatter: function () {
                let str = ''
                if(type === 'a' || type === 'b'){
                  const per = obj.projectProportion ? obj.projectProportion.toFixed(2) + '%' : '0.00%'
                  const num = obj.projectCount ||0
                  str = per + '  |  ' + num + '个'
                }else{
                  const per = obj.investmentProportion ? obj.investmentProportion.toFixed(2) + '%' : '0.00%'
                  const num = obj.investmentAmount ?(obj.investmentAmount/10000).toFixed(2) : 0
                  str = per + '  |  ' + num
                }
                return str // value + '%'
              },
            }
          },
          itemStyle: {
            normal: {
              color: type === 'a' || type === 'c' ? "#fff" : "#F5F5F5",
              barBorderRadius: 34,
            },
          },
        },
        
        {
          name: "金额",
          type: "bar",
          zlevel: 1,
          itemStyle: {
            normal: {
              barBorderRadius: 30,
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(32, 201, 112, 1)",
                },
                {
                  offset: 1,
                  color: "rgba(109, 212, 1, 0.74)",
                },
              ]),
            },
          },
          barWidth: 13,
          data: type === 'a' || type === 'b' ? [obj.projectProportion.toFixed(2)] : [obj.investmentProportion.toFixed(2)],
        },
      ],
     }
  }


  const changeStart = (newValue: any) => {
    setStartMoney(newValue);
  };
  const changeEnd = (newValue: any) => {
    setEndMoney(newValue);
  };

  const onChangeStart = (e: any) => setStartDate(dayjs(e));
  const onChangeEnd = (e: any) => setEndDate(dayjs(e));

  // 表单提交处理：开始时间 = 当月1号，结束时间 = 结束月最后一天（与 project-progress 一致）
  const onFinish = () => {
    setMoney2(money);
    const start = new Date(Date.UTC(dayjs(startDate).year(), dayjs(startDate).month(), 1));
    const end = new Date(Date.UTC(dayjs(endDate).year(), dayjs(endDate).month() + 1, 0));
    loadData({
      start,
      end,
      minAmount: money === 0 ? undefined : money === -1 ? startMoney * 10000 : money === 1 ? 10000 : money === 5 ? 50000 : 100000,
      maxAmount: money === 0 ? undefined : money === -1 ? endMoney * 10000 : money === 1 ? 50000 : money === 5 ? 100000 : undefined,
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
    setStartMoney(0);
    setEndMoney(1);
    setShowMoneyInput(false);
    form.setFieldsValue({
      money: 0,
      startMoney: 0,
      endMoney: 1,
    });
    loadData({ start, end });
  };

  const loadData = async (params: { start: Date; end: Date; minAmount?: number; maxAmount?: number }) => {
    setLoading(true);
    try {
    const res = await primeApi.getIndustrialChainDistribution1(params);
    // 转换响应数据格式到TreeNodeData
      const transformData = (item: IndustrialChainDistributionTreeVo, parentKey: string = '', index: number = 0): any => {
        const key = parentKey ? `${parentKey}-${index}` : 'root';
        return {
          isShow:false,
          key,
          innovativeCluster: item.innovativeCluster,
          industrialChain: item.industrialChain,
          innovativeClusterLabel: item.innovativeClusterLabel,
          industrialChainLabel: item.industrialChainLabel,
          projectCount: item.projectCount,
          investmentAmount: item.investmentAmount,
          projectProportion: item.projectProportion,
          investmentProportion: item.investmentProportion,
          children: item.children&&item.children.length>0 ? item.children.map((child: IndustrialChainDistributionTreeVo, childIndex: number) =>
            transformData(child, key, childIndex)
          ) : undefined
        };
      };

      const responseWithKeys = transformData(res);
      setDataSource([responseWithKeys]);
      const arr = responseWithKeys?.children||[]
      setChartData(arr)
      const arr2 = JSON.parse(JSON.stringify(arr))
      arr2.forEach((ele:any) => ele.key += '0');
      setChartData2(arr2)
      
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
      console.error('获取产业链分布数据失败:', error);
      message.error('获取产业链分布数据失败');
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
      minAmount: money === 0 ? undefined : money === -1 ? startMoney * 10000 : money === 1 ? 10000 : money === 5 ? 50000 : 100000,
      maxAmount: money === 0 ? undefined : money === -1 ? endMoney * 10000 : money === 1 ? 50000 : money === 5 ? 100000 : undefined,
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

  const changeShow = (obj:any,idx:number,type:string) => {
    const data = type === '1' ? [...chartData] : [...chartData2]
    if(obj.isShow === true){
      data[idx].isShow = false
    }else{
      data.forEach(item=>item.isShow = false)
      data[idx].isShow = true
    }
    if( type === '1' ){
      setChartData(data)
    }else{
      setChartData2(data)
    }
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
          <Breadcrumb.Item><span style={{ color: '#1A237E', fontWeight: 600 }}>链群分布</span></Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.filterContainer}>
        <div className={styles.filterRow}>

          <Button
            className={styles.filterButton}
            onClick={() => { setShowMonthModal(!showMonthModal); setTimeType('start'); setShowCumulativeModal(false); }}
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
            onClick={() => { setShowCumulativeModal(!showCumulativeModal); setTimeType('start'); setShowMonthModal(false) }}
          >
            金额筛选
            {showCumulativeModal ? (
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
        
      </div>

      {/* 创新集群项目数量及占比 */}
      {chartType2 === 'bar' && (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft}>
            <h3 className={styles.chartTitle}>创新集群项目数量及占比</h3>
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
                  {chartData.map((item,index) => (
                    <>
                      <div className={`${styles.chartFlexCon} ${item.isShow === true?styles.chartFlexActiveCon:''}`} onClick={()=>changeShow(item,index,'1')}>
                        {item.isShow === true &&(
                          <UpOutlined className={styles.chartIcon} />
                        )}
                        {item.isShow === false &&(
                          <DownOutlined className={styles.chartIcon} />
                        )}
                        <ReactECharts
                          ref={chartRef}
                          option={getChartOption('a',item)}
                          style={{ height: '40px', width: 'calc(100% - 54px)',marginTop: '8px' }}
                        />
                      </div>
                      {item.children.length>0&& item.isShow === true &&(
                        <div className={styles.childChartCon} style={{backgroundColor:'#fff'}}>
                          {item.children.map((item2:any) => (
                            <div className={styles.chartFlexCon} style={{backgroundColor:'#fff'}}>
                              <div className={styles.zhanDiv}></div>
                              <ReactECharts
                                ref={chartRef11}
                                option={getChartOption('b',item2)}
                                style={{ height: '40px', width: 'calc(100% - 54px)',marginTop: '8px' }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ))}
                </>
              )}
              {chartType === 'table' && (
                <div className={styles.tableContainer}>
                  <Table
                    columns={columns}
                    dataSource={chartData}
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
      {/* 创新集群项目数量及占比 */}

      {/* 创新集群项目备案投资额 */}
      {chartType === 'bar' && (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft}>
            <h3 className={styles.chartTitle}>创新集群项目备案投资额</h3>
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
            <div className={styles.divider}></div>
            <div className={styles.chartContainer}>
              {chartType2 === 'bar' ? (
                <>
                  {chartData2.map((item,index) => (
                    <>
                      <div className={`${styles.chartFlexCon} ${item.isShow === true?styles.chartFlexActiveCon:''}`} onClick={()=>changeShow(item,index,'2')}>
                        {item.isShow === true &&(
                          <UpOutlined className={styles.chartIcon} />
                        )}
                        {item.isShow === false &&(
                          <DownOutlined className={styles.chartIcon} />
                        )}
                        <ReactECharts
                          ref={chartRef2}
                          option={getChartOption('c',item)}
                          style={{ height: '40px', width: 'calc(100% - 54px)',marginTop: '8px' }}
                        />
                      </div>
                      {item.children.length>0&& item.isShow === true &&(
                        <div className={styles.childChartCon} style={{backgroundColor:'#fff'}}>
                          {item.children.map((item2:any) => (
                            <div className={styles.chartFlexCon} style={{backgroundColor:'#fff'}}>
                              <div className={styles.zhanDiv}></div>
                              <ReactECharts
                                ref={chartRef22}
                                option={getChartOption('d',item2)}
                                style={{ height: '40px', width: 'calc(100% - 54px)',marginTop: '8px' }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ))}
                </>
              ) : (
                <div className={styles.tableContainer}>
                  <Table
                    columns={columns2}
                    dataSource={chartData2}
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
      {/* 创新集群项目备案投资额 */}

      
    </div >
  );
};

export default ChainDetail;