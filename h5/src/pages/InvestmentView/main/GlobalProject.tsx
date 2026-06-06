import {useEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import MonthPick from "../../../components/YearPick/MonthPick.tsx";
import {primeApi} from "../../../api.ts";
import {ResultBo, TotalMoneyBo} from "../../../apis";
import dayjs from "dayjs";


function GlobalProjectChart1(e:{data:ResultBo[]}) {
    const {data} = e
    console.log('GlobalProjectChart1',data)
    const list1 = data.map(item => item.projectCount)
    const list2 = data.map(item => item.projectTotal)
    const chartRef = useRef(null);
    useEffect(() => {
        const colors = ['#d3dffc', '#d7f3f4'];
        const chart = echarts.init(chartRef.current);
        const option = {
            color: colors,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
                right: '12%',
                left: '12%'
            },
            toolbox: {
                feature: {
                    // dataView: { show: true, readOnly: false },
                    // restore: { show: true },
                    // saveAsImage: { show: true }
                }
            },
            legend: {
                data: ['项目投资总额', '项目数']
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        interval: 0,  // 强制显示所有标签
                        rotate: 30,   // 标签旋转防重叠
                        fontSize: 10  // 调小字体
                    },
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '项目投资总额',
                    position: 'left',
                    alignTicks: true,
                    axisLine: {
                        show: false,
                        lineStyle: {
                        }
                    },
                    axisLabel: {
                        formatter: function (value){
                            return value+'亿'
                        }
                    }
                },
                {
                    type: 'value',
                    name: '项目数',
                    position: 'right',
                    alignTicks: true,
                    axisLine: {
                        show: false,
                        lineStyle: {
                            // color: colors[0]
                        }
                    },
                    axisLabel: {
                        formatter: '{value} 个'
                    }
                }
            ],
            series: [
                {
                    name: '项目数',
                    type: 'bar',
                    data: list2
                },
                {
                    name: '项目投资总额',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: list1
                },
            ]
        };
        chart.setOption(option);
        return () => chart.dispose();
    }, [data]);

    return (
        <div ref={chartRef} style={{width: '100%', height: '3rem', marginTop: '0.2rem'}}>

        </div>
    );
}
function GlobalProjectChart(e:{data:ResultBo[]}) {
    const {data} = e
    const list1 = data.map(item => item.projectCountTrend)
    const list2 = data.map(item => item.projectTotalTrend)
    const chartRef1 = useRef(null);
    useEffect(() => {
        const colors = ['#d3dffc', '#d7f3f4'];
        const chart = echarts.init(chartRef1.current);
        const option = {
            color: colors,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                formatter: function(params) {
                    let result = params[0].name + '<br>';
                    params.forEach(item => {
                        result += `${item.marker}${item.seriesName}: ${item.value}%<br>`;
                    });
                    return result;
                }
            },
            grid: {
                right: '0',
                left: '12%'
            },
            toolbox: {
                feature: {
                    // dataView: { show: true, readOnly: false },
                    // restore: { show: true },
                    // saveAsImage: { show: true }
                }
            },
            legend: {
                data: ['项目投资总额同比','项目数同比']
            },
            xAxis: [
                {
                    axisLabel: {
                        interval: 0,  // 强制显示所有标签
                        rotate: 30,   // 标签旋转防重叠
                        fontSize: 10  // 调小字体
                    },
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    boundaryGap: false,
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                }
            ],
            yAxis:{
                        type: 'value',
                        // name: '项目投资总额同比(%)',
                        position: 'left',
                        alignTicks: true,
                        axisLine: {
                            show: false,
                            lineStyle: {
                            }
                        },
                        axisLabel: {
                            // width: 100,
                            // overflow: 'truncate',
                            formatter: function(value) {
                                return value < 0 ? `-${Math.abs(value)}%` : `${value}%`; // 手动添加负号
                            }
                        }
            },
            // yAxis: [
            //     {
            //         type: 'value',
            //         // name: '项目投资总额同比(%)',
            //         position: 'left',
            //         alignTicks: true,
            //         axisLine: {
            //             show: false,
            //             lineStyle: {
            //             }
            //         },
            //         axisLabel: {
            //             formatter: '{value} %'
            //         }
            //     },
            //     {
            //         type: 'value',
            //         // name: '项目数同比',
            //         position: false,
            //         alignTicks: true,
            //         axisLine: {
            //             show: false,
            //             lineStyle: {
            //                 // color: colors[0]
            //             }
            //         },
            //         // axisLabel: {
            //         //     formatter: '{value} 个'
            //         // }
            //     }
            // ],
            series: [
                {
                    name: '项目投资总额同比',
                    type: 'line',
                    data: list2
                },
                {
                    name: '项目数同比',
                    type: 'line',
                    data: list1
                },
            ]
        };
        chart.setOption(option);
        return () => chart.dispose();
    }, [data]);
    return (
        <div ref={chartRef1} style={{width: '100%', height: '3rem', marginTop: '0'}}>

        </div>
    );
}

export default function GlobalProject(e:{year:string}) {
    const {year} = e
    const [year1, setYear1] = useState(dayjs().month()+ '月')
    const [active, setActive] = useState(true)
    const [data1, setData1] = useState<ResultBo[]>()
    const data = [
        {
            id:1,
            name: '靖江市',
            value: 0,
        },
        {
            id:2,
            name: '泰兴市',
            value: 0,
        },{
            id:3,
            name: '兴化市',
            value: 0,
        },{
            id:4,
            name: '海陵区',
            value: 0,
        },{
            id:5,
            name: '姜堰区',
            value: 0,
        },{
            id:6,
            name: '新高区）',
            value: 0,
        },
    ]
    const [tableList, setTableList] = useState([])

    const getZtxmTotalViews = async () => {
        const data = await primeApi.getZtxmTotalViews({year:+year,month:+year1.split('月')[0]})
        console.log('getZtxmTotalViews',data)
    }
    const getQyxmYdqsTjxxViews = async () => {
        const data = await primeApi.getZtxmYdqsTjxxViews({year:+year})
        console.log('getQyxmYdqsTjxxViews',data)
        setData1(data)
    }
    useEffect(() => {
        getQyxmYdqsTjxxViews()
    }, [year]);
    useEffect(() => {
        let data:TotalMoneyBo[] = []
        let data1:TotalMoneyBo[] = []
         primeApi.getZtxmTotalViews({year:+year,month:+year1.split('月')[0]}).then(res => {
             data = res
         }).then(() => {
             primeApi.getZtxmTotalViews({year:+year-1,month:+year1.split('月')[0]}).then(res => {
                 data1 = res
                 console.log('data',data)
                 console.log('data1',data1)
                 const tlist = data.map((item,index) => {
                        if(item.name === data1[index].name){
                            return {
                                ...item,
                                total1:data1[index].total,
                                totalMoney1:data1[index].totalMoney
                            }
                        }

                 }).filter(o=>o !== undefined)
                 console.log('tlist',tlist)
                 setTableList(tlist)
             })
         })
    }, [year,year1]);
  return (
      <div>
          <div>
              <div style={{
                  fontSize: '0.16rem',
                  fontWeight: 'bold',
              }}>项目趋势变化
              </div>
              <div style={{
                  fontSize: '0.12rem',
                  color: '#666',
                  marginTop: '0.1rem',
              }}>
                  具体数值可点击对应立柱查看
              </div>
          </div>
          <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
          }}>
              <GlobalProjectChart1 data={data1 || []} />
          </div>
          <div style={{
              display: 'flex',
              justifyContent:active?'right': 'space-between',
              alignItems: 'center',
          }}>
              {!active&&<MonthPick year={year1}  setYear={setYear1}/>}
              <div style={{
                  padding: '0 0.01rem ',
                  width: '1.4rem',
                  height: '0.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '0.155rem',
                  backgroundColor: '#eeeff5'
              }}>
                  <div onClick={() => {
                      setActive(true)
                  }} style={{
                      width: '50%',
                      textAlign: 'center',
                      color: active ? '#264099' : '#333',
                      height: '0.24rem',
                      borderRadius: '0.12rem',
                      lineHeight: '0.24rem',
                      backgroundColor: active ? '#fff' : ''
                  }}>折线图
                  </div>
                  <div onClick={() => {
                      setActive(false)
                  }} style={{
                      width: '50%',
                      textAlign: 'center',
                      color: active ? '#333' : '#264099',
                      backgroundColor: active ? '' : '#fff',
                      height: '0.24rem',
                      borderRadius: '0.12rem',
                      lineHeight: '0.24rem',
                  }}>统计表
                  </div>
              </div>
          </div>
          {
              active &&<GlobalProjectChart data={data1 || []}/>
          }
          {
              !active && <div  style={{width: '100%', height: '3rem', marginTop: '0.2rem'}}>
                  <table style={{
                      width: '100%',
                  }}>
                          <tr style={{
                              width: '100%',
                              backgroundColor: '#467df0',
                              color: '#fff',
                          }}>
                              <td rowSpan={2} style={{width: '8%',height: '0.2rem',textAlign: 'center',lineHeight: '0.2rem'}}>序号</td>
                              <td rowSpan={2} style={{width: '15%',height: '0.2rem',textAlign: 'center',lineHeight: '0.2rem'}}>板块名称</td>
                              <td colSpan={2} style={{width: '30%',height: '0.2rem',textAlign: 'center',lineHeight: '0.2rem'}}>项目总数（个）</td>
                              <td colSpan={2} style={{width: '30%',height: '0.2rem',textAlign: 'center',lineHeight: '0.2rem'}}>投资总额（亿元）</td>
                          </tr>
                          <tr style={{
                              width: '100%',
                              backgroundColor: '#467df0',
                              color: '#fff',
                          }}>
                              <td  style={{width: '8%',height: '0.2rem',textAlign: 'center',lineHeight: '0.2rem'}}>{year}</td>
                              <td  style={{width: '15%',height: '0.2rem',textAlign: 'center',lineHeight: '0.2rem'}}>去年同期</td>
                              <td  style={{width: '8%',height: '0.2rem',textAlign: 'center',lineHeight: '0.2rem'}}>{year}</td>
                              <td  style={{width: '15%',height: '0.2rem',textAlign: 'center',lineHeight: '0.2rem'}}>去年同期</td>
                          </tr>
                      {
                          tableList.map((item, index) => {
                              return (
                                  <tr key={index}>
                                      <td style={{width: '8%', height: '0.2rem',}}>{index+1}</td>
                                      <td style={{
                                          width: '15%',
                                          height: '0.2rem',
                                          textAlign: 'center',
                                          lineHeight: '0.2rem'
                                      }}>{item.name}
                                      </td>
                                      <td style={{
                                          width: '8%',
                                          height: '0.2rem',
                                          textAlign: 'center',
                                          lineHeight: '0.2rem'
                                      }}>{item.total}
                                      </td>
                                      <td style={{
                                          width: '15%',
                                          height: '0.2rem',
                                          textAlign: 'center',
                                          lineHeight: '0.2rem'
                                      }}>{item.total1}
                                      </td>
                                      <td style={{
                                          width: '8%',
                                          height: '0.2rem',
                                          textAlign: 'center',
                                          lineHeight: '0.2rem'
                                      }}>{item.totalMoney}
                                      </td>
                                      <td style={{
                                          width: '15%',
                                          height: '0.2rem',
                                          textAlign: 'center',
                                          lineHeight: '0.2rem'
                                      }}>{item.totalMoney1}
                                      </td>
                                  </tr>
                              )
                          })
                      }
                  </table>
              </div>
          }
      </div>
  );
}
