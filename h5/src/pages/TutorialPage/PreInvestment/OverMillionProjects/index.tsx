import React, { useState, useEffect } from 'react';
import { useRef } from "react";
import { Button, Radio, Select, Breadcrumb, Row,Table, Form, DatePicker, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import styles from './index.module.css';
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { primeApi } from "../../../../api.ts";
import dayjs from 'dayjs';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
const { Option } = Select;
const { RangePicker } = DatePicker;

const OverMillionProjects: React.FC = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRefCity = useRef(null);
  const chartRefAmont = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const areas = [
    {
      label: "全市",
      value: 'all'
    },
    {
      label: "靖江市",
      value: 'jjs'
    },
    {
      label: "泰兴市",
      value: 'txs'
    },
    {
      label: "兴化市",
      value: 'xhs'
    },
    {
      label: "海陵区",
      value: 'hlq'
    },
    {
      label: "姜堰区",
      value: 'jyq'
    },
    {
      label: "医药高新区(高港区)",
      value: 'yygxq'
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const initialArea = searchParams.get('area');
  const initialAreaKey = areas.filter(item => item.label === initialArea)[0].value;
  const initialTitle = searchParams.get('title');
  const hasNew = true // searchParams.get('monthNum') && searchParams.get('monthNum') !== 'undefined' ? true : false;
  const hasTotal = true // searchParams.get('totalNum') && searchParams.get('totalNum') !== 'undefined' ? true : false;
  const [filterType, setFilterType] = useState<'newThisMonth' | 'cumulative'>(hasNew ? 'newThisMonth' : 'cumulative');
  const [chartType, setChartType] = useState<'bar' | 'table'>('bar');
  const [chartType2, setChartType2] = useState<'bar' | 'table'>('bar');
  const [chartType3, setChartType3] = useState<'bar' | 'table'>('bar');
  const [selectAreaText, setSelectAreaText] = useState(initialArea); // 园区tab状态
  const [selectAreaText2, setSelectAreaText2] = useState(initialArea); // 园区tab状态
  const [showCumulativeModal, setShowCumulativeModal] = useState(false); // 金额筛选弹窗状态
  const [showMoreModal, setShowMoreModal] = useState(false); // 全部筛选弹窗状态

  
  const [loading,setLoading] = useState(false);
  const [currentData,setCurrentData] = useState({nzProjNum:0,nzTz:0,wzProjNum:0,wzTz:0});

  const [money, setMoney] = useState(0); // 选中的投资选项
  const [money2, setMoney2] = useState(Number(searchParams.get('money')));
  const [showMoneyInput, setShowMoneyInput] = useState(false);
  const [startMoney, setStartMoney] = useState(0);
  const [endMoney, setEndMoney] = useState(1);
  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month'));
  const [industry, setBIndustry] = useState('');
  const [isKcProj, setIsKcProj] = useState('');
  const [rangeDate, setRangeDate] = useState([dayjs().startOf('year'), dayjs().endOf('month')]);
  const [rangeDate2, setRangeDate2] = useState([dayjs().startOf('year'), dayjs().endOf('month')]);

  type FieldType = {
    currDate?: string;
    startDate?: string;
    year?: string;
    money?: number;
    endDate?: string;
    industry?: string;
    isKcProj?: string;
    rangeDate?: any;
    startMoney?: number;
    endMoney?: number;
  };

  const [form] = Form.useForm();
  const [dataSourceTotal, setDataSourceTotal] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [dataSource2, setDataSource2] = useState<any[]>([]);
  const [dataSource1, setDataSource1] = useState<any[]>([]);
  const [dataSource5, setDataSource5] = useState<any[]>([]);
  const [dataSource10, setDataSource10] = useState<any[]>([]);

  const [chartData, setChartData] = useState<any[]>([]);

  // 获取单元格样式（根据权限）
  const getCellStyle = (record:any) => {
    return {
      cursor: 'pointer',
      fontWeight: 700,
      color: '#1a237e',
      transition: 'color 0.3s ease',
    };
  };

  const columns = [
    {
      title: "区域",
      dataIndex: 'district',
      key: 'district',
      align: 'center' as const,
      render: (text: any, record: any) => {
        return record.district === '-' ? record.city : record.district ? record.district : '-';
      },
    },
    {
      title: "项目个数",
      dataIndex: 'monthNum',
      key: 'monthNum',
      align: 'center' as const,
      render: (text: any, record: any) => {
        return filterType==='newThisMonth' ? record.monthNum : record.projNums;
      },
      onCell: (record: any) => ({
        onClick: () => handleToList(record,'1'),
        style: getCellStyle(record),
      }),
    },
    {
      title: "投资额(亿)",
      dataIndex: 'monthQyje',
      key: 'monthQyje',
      align: 'center' as const,
      render: (text: any, record: any) => {
        return filterType==='newThisMonth' ? record.monthQyje : record.ztz;
      },
    }
  ]

  const columns2 = [
    {
      title: "区域",
      dataIndex: 'district',
      key: 'district',
      align: 'center' as const,
      render: (text: any, record: any) => {
        return record.district === '-' ? record.city : record.district ? record.district : '-';
      },
    },
    {
      title: "1亿",
      dataIndex: 'oneMonthNum',
      key: 'oneMonthNum',
      align: 'center' as const,
      render: (text: any, record: any) => {
        return filterType==='newThisMonth' ? record.oneMonthNum : record.oneTotalNum;
      },
      onCell: (record: any) => ({
        onClick: () => handleToList(record,'4'),
        style: getCellStyle(record),
      }),
    },
    {
      title: "5亿",
      dataIndex: 'fiveMonthNum',
      key: 'fiveMonthNum',
      align: 'center' as const,
      render: (text: any, record: any) => {
        return filterType==='newThisMonth' ? record.fiveMonthNum : record.fiveTotalNum;
      },
      onCell: (record: any) => ({
        onClick: () => handleToList(record,'5'),
        style: getCellStyle(record),
      }),
    },
    {
      title: "10亿",
      dataIndex: 'tenMonthNum',
      key: 'tenMonthNum',
      align: 'center' as const,
      render: (text: any, record: any) => {
        return filterType==='newThisMonth' ? record.tenMonthNum : record.tenTotalNum;
      },
      onCell: (record: any) => ({
        onClick: () => handleToList(record,'6'),
        style: getCellStyle(record),
      }),
    }
  ]

  const columns3 = [
    {
      title: "区域",
      dataIndex: 'district',
      key: 'district',
      align: 'center' as const,
      render: (text: any, record: any) => {
        return record.district === '-' ? record.city : record.district ? record.district : '-';
      },
    },
    {
      title: "内资数量",
      dataIndex: 'nzProjNum',
      key: 'nzProjNum',
      align: 'center' as const,
      onCell: (record: any) => ({
        onClick: () => handleToList(record,'2'),
        style: getCellStyle(record),
      }),
    },
    {
      title: "投资额(亿)",
      dataIndex: 'nzTz',
      key: 'nzTz',
      align: 'center' as const
    },
    {
      title: "外资数量",
      dataIndex: 'wzProjNum',
      key: 'wzProjNum',
      align: 'center' as const,
      onCell: (record: any) => ({
        onClick: () => handleToList(record,'3'),
        style: getCellStyle(record),
      }),
    },
    {
      title: "投资额(亿)",
      dataIndex: 'wzTz',
      key: 'wzTz'
    }
  ]

  // 图表配置
  const getChartOption = () => {
    const colors = ['#ED8E08','#FF5555','#5596FF','#E8E025','#24BD6C','#9D55FF'];
    const monthData = dataSource.map(item=>{
      return {
        value:item.monthNum || 0,
        name: item.district // === '医药高新区(高港区)' ? '医药' : item.district.substring(0, 2)
      }
    })
    const totalData = dataSource.map(item=>{
      return{
        value:item.projNums || 0,
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
        // right: '20%',
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
          avoidLabelOverlap: true,
          startAngle: 10,
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
          data:filterType==='newThisMonth'?monthData:totalData,
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

  // 图表配置---各市区项目规模
  const getChartOptionCity = () => {
    const colors = ['#5596FF', '#9D55FF', '#FF5555'];
    
    const month1 = dataSource1.map(item=>{
      return {
        value:item.monthNum || 0,
        name: item.district === '医药高新区(高港区)' ? '医药' : item.district.substring(0, 2)
      }
    })
    const month5 = dataSource5.map(item=>{
      return {
        value:item.monthNum || 0,
        name: item.district === '医药高新区(高港区)' ? '医药' : item.district.substring(0, 2)
      }
    })
    const month10 = dataSource10.map(item=>{
      return {
        value:item.monthNum || 0,
        name: item.district === '医药高新区(高港区)' ? '医药' : item.district.substring(0, 2)
      }
    })
    const total1 = dataSource1.map(item=>{
      return{
        value:item.projNums || 0,
        name: item.district === '医药高新区(高港区)' ? '医药' : item.district.substring(0, 2)
      }
    })
    const total5 = dataSource5.map(item=>{
      return{
        value:item.projNums || 0,
        name: item.district === '医药高新区(高港区)' ? '医药' : item.district.substring(0, 2)
      }
    })
    const total10 = dataSource10.map(item=>{
      return{
        value:item.projNums || 0,
        name: item.district === '医药高新区(高港区)' ? '医药' : item.district.substring(0, 2)
      }
    })
    return {
      color:colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      grid: {
        // top: '9%',
        bottom: '20%',
        // left: '18%',
      },
      legend: {
        data: ['1亿以上', '5亿以上', '10亿以上'],
        bottom: 0,
        x: "center",
        left: 'center',
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
          data: month1.map(item=>item.name),
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
          name: '1亿以上',
          type: 'line',
          data: filterType==='newThisMonth' ?month1:total1
        },
        {
          name: '5亿以上',
          type: 'line',
          data: filterType==='newThisMonth'? month5:total5
        },
        {
          name: '10亿以上',
          type: 'line',
          data: filterType==='newThisMonth' ?month10:total10
        },
      ],
    };
  };

  // 图表配置---全市内外资项目数及投资额
  const getChartOptionAmont = () => {
    const color = ['#5596FF','#24BD6C','#ED8E08','#FF5555']
    const color2 = ['#ED8E08','#FF5555']
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        // formatter: function (params: any) {
        //   const dataIndex = params[0].dataIndex;
        //   const name = dataSource[dataIndex].district
        //   const value = dataSource[dataIndex].nzProjNum
        //   const value2 = dataSource[dataIndex].nzTz
        //   const value3 = dataSource[dataIndex].wzProjNum
        //   const value4 = dataSource[dataIndex].wzTz
        //  return `${name}<br/>内资项目数量: ${value}个<br/>内资投资额: ${value2}亿<br/>外资项目数量: ${value3}个<br/>外资投资额: ${value4}万`;
        // }
      },
      color:color,
      legend: {
        data: ['内资项目数量', '内资投资额','外资项目数量', '外资投资额'],
        bottom: 0,
        left: '20%',
        right: '20%',
        // x: "center",
        textStyle: {
          fontSize: 12,
          color: 'rgba(154, 159, 181, 1)'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '20%',
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
            color: '#16151A'
          }
        },
        axisTick: {
          show:false
        },
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
              color: '#9A9FB5'
            }
          }
        },
        {
          type: 'value',
          name: '金额(万美元)',
          position: 'right',
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
            show: false
          }
        }
      ],
      series: [
        {
          name: '内资项目数量',
          type: 'bar',
          yAxisIndex: 0,
          legend: {
            icon: 'circle'
          },
          data: dataSource.map((item, index) => ({
            value: item.nzProjNum,
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
          name: '内资投资额',
          type: 'line',
          yAxisIndex: 1,
          data: dataSource.map(item => item.nzTz),
          itemStyle: {
            color: '#ED8E08'
          },
          lineStyle: {
            color: '#ED8E08',
            width: 2
          },
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            itemStyle: {
              color: '#ED8E08',
              borderColor: '#fff',
              borderWidth: 2
            }
          }
        },
        {
          name: '外资项目数量',
          type: 'bar',
          legend: {
            icon: 'circle'
          },
          yAxisIndex: 0,
          data: dataSource.map((item, index) => ({
            value: item.wzProjNum,
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
        },
        {
          name: '外资投资额',
          type: 'line',
          yAxisIndex: 1,
          data: dataSource.map(item => item.wzTz),
          itemStyle: {
            color: '#FF5555'
          },
          lineStyle: {
            color: '#FF5555',
            width: 2
          },
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            itemStyle: {
              color: '#FF5555',
              borderColor: '#fff',
              borderWidth: 2
            }
          }
        }
      ]
    };
  };

  const onChangeDate3 = (newValue: any) => {
    setStartDate(dayjs(newValue[0]));
    setEndDate(dayjs(newValue[1]).endOf('month'));
    setRangeDate([dayjs(newValue[0]), dayjs(newValue[1]).endOf('month')]);
  };

  const onEvents = {
    click: (params) => {
      setSelectedIndex(params.dataIndex);

      let text = params.name
      switch (params.name) {
        case '全市':
          text = '全市'
          break;
        case '靖江':
        case '泰兴':
        case '兴化':
          text = params.name + '市'
          break;
        case '海陵':
        case '姜堰':
          text = params.name + '区'
          break;
        case '医药':
          text = '医药高新区(高港区)'
          break;
        default:
          break;
      }
      setSelectAreaText(text)
      setSelectAreaText2(text)
      const index = dataSource.findIndex(item => item.district === text);
      setCurrentData(dataSource[index])
    },
  }

  const handleChangeSelect2 = (e: any) => {
    setBIndustry(e.target.value);
  };

  const handleChangeSelect3 = (e: any) => {
    setIsKcProj(e.target.value);
  };

  const changeStart = (newValue: any) => {
    setStartMoney(newValue);
  };
  const changeEnd = (newValue: any) => {
    setEndMoney(newValue);
  };

  const handleToList = (record: any,type:string) => {
    console.log('record--any----',record);
    
    const currStartDate = dayjs(endDate).startOf('month').format('YYYY-MM-DD');
    const currStartDate2 = dayjs(startDate).startOf('month').format('YYYY-MM-DD');
    const queryParams = new URLSearchParams({
      // year: dayjs(endDate).year().toString(),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      showAll: 'true',
      page: '1',
      pageSize: '10',
      isKcProj: isKcProj,
    });
     if (type === '2') {
      queryParams.set('currStartDate', currStartDate2);
      queryParams.set('projectRating', '内资');
    } else if (type === '3') {
      queryParams.set('currStartDate', currStartDate2);
      queryParams.set('projectRating', '外资');
    }else {
      if(filterType === 'newThisMonth'){
       queryParams.set('currStartDate', currStartDate);
      }else{
        queryParams.set('currStartDate', currStartDate2);
      }
    }
    if (record?.district !== '-' && record?.district !== '全市') {
      if (record?.districtCode) {
        queryParams.set('district', record?.districtCode);
      }
    }
    if (record?.parkCode) {
      queryParams.set('park', record?.parkCode);
    }
    if (industry === '1') {
      queryParams.set('projectType', '服务业');
    } else if (industry === '2') {
      queryParams.set('projectType', '工业');
    }
    if(type === '4'){
      queryParams.set('investmentAmount', '1');
    }else if(type === '5'){
      queryParams.set('investmentAmount', '5');
    }else if(type === '6'){
      queryParams.set('investmentAmount', '10');
    }else if (money !== 0 && money !== -1) {
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

  // 表单提交处理
  const onFinish = () => {
    setMoney2(money);
    setRangeDate2([dayjs(rangeDate[0]), dayjs(rangeDate[1]).endOf('month')]);
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
    setBIndustry('');
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
      currDate: dayjs(endTime).startOf('month').format('YYYY-MM-DD'),
    });
  };

  const loadData = async (params: any) => {
    console.log('loadData----');
    const res = await primeApi.statisticsSignedProjectInfo(params);
    const data = res ? res : [];
    setDataSource(data);

    for (let idx = 0; idx < data.length; idx++) {
      const item = data[idx];
      const res2 = await primeApi.statisticsSignedProjectZoneInfo({
        ...params,
        zoneCode: item.districtCode,
      });
      const data2 = res2 ? res2 : [];
      data2.forEach((ele: any, idx: number) => {
        ele.parkCode = ele.districtCode;
        const formattedIdx = idx.toString().padStart(2, '0');
        ele.districtCode = item.districtCode + formattedIdx;
        ele.city = ele.district;
        ele.district = '-';
      });
      data[idx].children = data2;
      data[idx].city = '-';
    }
    const tableData = data;
    setDataSource(tableData);
    setDataSource2(tableData);

    if (money === 0 || money === -1) {
      loadData1();
      loadData5();
      loadData10();
    } else if (money === 1) {
      setDataSource1(
        tableData
      );
      loadData5();
      loadData10();
    } else if (money === 5) {
      setDataSource5(
        tableData
      );
      loadData1();
      loadData10();
    } else {
      setDataSource10(
        tableData
      );
      loadData1();
      loadData5();
    }
  }

  const loadData1 = async () => {
    const res = await primeApi.statisticsSignedProjectInfo({
      rmb: 1,
      currStartDate: dayjs(startDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      industry: industry === '1'? '服务业' : industry === '2'? '工业': '',
      isKcProj: isKcProj,
    });
    const data = res ? res : [];
    const tableData = data;
    setDataSource1(tableData);
  };
  const loadData5 = async () => {
    const res = await primeApi.statisticsSignedProjectInfo({
      rmb: 5,
      currStartDate: dayjs(startDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      industry: industry === '1'? '服务业' : industry === '2'? '工业': '',
      isKcProj: isKcProj,
    });
    const data = res ? res : [];
    const tableData = data;
    setDataSource5(tableData);
  };
  const loadData10 = async () => {
    const res = await primeApi.statisticsSignedProjectInfo({
      rmb: 10,
      currStartDate: dayjs(startDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      industry: industry === '1'? '服务业' : industry === '2'? '工业': '',
      isKcProj: isKcProj,
    });
    const data = res ? res : [];
    const tableData = data;
    setDataSource10(tableData);
  };

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
      rmb: money === 0 || money === -1 ? undefined : money,
      currStartDate: dayjs(endDate).startOf('year').startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      rmb1: money === -1 ? startMoney : undefined,
      rmb2: money === -1 ? endMoney : undefined,
      doller1: money === -1 ? Number(((startMoney * 10000) / 7.2).toFixed(0)) : undefined,
      doller2: money === -1 ? Number(((endMoney * 10000) / 7.2).toFixed(0)) : undefined,
    });
  }, []);


  useEffect(() => {
    if(dataSource1.length === 0||dataSource5.length===0||dataSource10.length===0){
      return
    }else{
      const arr = dataSource.map(item=>{
        const oneObj = dataSource1.filter(item2=>item2.districtCode === item.districtCode)
        const fiveObj = dataSource5.filter(item2=>item2.districtCode === item.districtCode)
        const tenObj = dataSource10.filter(item2=>item2.districtCode === item.districtCode)
        return {
          district: item.district,
          districtCode:item.districtCode,
          oneMonthNum: oneObj[0].monthNum || 0,
          oneTotalNum: oneObj[0].projNums || 0,
          fiveMonthNum: fiveObj[0].monthNum || 0,
          fiveTotalNum: fiveObj[0].projNums || 0,
          tenMonthNum: tenObj[0].monthNum || 0,
          tenTotalNum: tenObj[0].projNums || 0
        }
      })
      setChartData(arr)
    }
    
  }, [dataSource,dataSource1,dataSource5,dataSource10]);


  useEffect(() => {
    if(dataSource.length>0&&initialArea){
      const index = dataSource.findIndex(item => item.district === initialArea);
      if (index !== -1) {
        setSelectedIndex(index);
        setCurrentData(dataSource[index])
      }else{
        setCurrentData(dataSource[0])
      }
    }
  },[dataSource,initialArea])
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
          <Breadcrumb.Item><span style={{ color: '#1A237E', fontWeight: 600 }}>新签约项目</span></Breadcrumb.Item>
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
            {hasNew && (
              <Radio value="newThisMonth">本月新增</Radio>
            )}
            {hasTotal && (
              <Radio value="cumulative">累计新增</Radio>
            )}
          </Radio.Group>
          <div className={styles.shuxian}></div>

          <div className={styles.selectGroup}>
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
            <Button className={styles.filterButton} onClick={() => { setShowMoreModal(!showMoreModal); setShowCumulativeModal(false) }}>更多筛选
              {showMoreModal ? (
                <CaretUpOutlined />
              ) : (
                <CaretDownOutlined />
              )}
            </Button>
          </div>
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

        {/* 全部筛选弹窗 */}
        {showMoreModal && (
          <div className={styles.modalOverlay} onClick={() => setShowMoreModal(false)}>
            <LockBodyScroll />
            <div className={styles.cumulativeModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalContent}>
                <div className={styles.formCon} style={{ marginTop: '-20px' }}>
                  <Form form={form}
                    layout="horizontal"
                    name="queryForm"
                    autoComplete="off"
                    initialValues={{
                      money: money,
                      rangeDate: rangeDate,
                      industry: industry,
                      isKcProj: isKcProj,
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
                    <Form.Item<FieldType>
                      style={{
                        marginTop: '20px',
                      }}
                      label="所属行业"
                      name="industry"
                    >
                      {/* 1-服务业 2-制造业 */}
                      <Radio.Group options={[
                        { value: '', label: '全部' },
                        { value: '1', label: '服务业' },
                        { value: '2', label: '制造业' },
                      ]} onChange={(e)=>setBIndustry(e.target.value)} />
                    </Form.Item>
                    <Form.Item<FieldType>
                      style={{
                        marginTop: '20px',
                      }}
                      label="是否科创项目"
                      name="isKcProj"
                    >
                      {/* 1-服务业 2-制造业 */}
                      <Radio.Group options={[
                        { value: '', label: '全部' },
                        { value: '是', label: '是' },
                        { value: '否', label: '否' },
                      ]} onChange={(e)=>setIsKcProj(e.target.value)} />
                    </Form.Item>
                  </Form>
                </div>
                <div className={styles.modalActions}>
                  <Button
                    className={styles.resetButton}
                    onClick={() => { setShowMoreModal(false); onReset() }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className={styles.confirmButton}
                    onClick={() => { setShowMoreModal(false); onFinish() }}
                  >
                    确定
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 全市项目数量及占比 */}
      {chartType2 === 'bar' && chartType3 === 'bar' && (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft}>
            <h3 className={styles.chartTitle}>全市项目数量及占比</h3>
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
      {/* 全市项目数量及占比 */}



      {/* 各市区项目规模 */}
      {chartType === 'bar' && chartType3 === 'bar' && (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft}>
            <h3 className={styles.chartTitle}>各市区项目规模</h3>
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
                  <ReactECharts
                    ref={chartRefCity}
                    option={getChartOptionCity()}
                    style={{ height: '340px', width: '100%' }}
                  />
                </>
              ) : (
                <div className={styles.tableContainer}>
                  <Table
                    columns={columns2}
                    dataSource={chartData}
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
      {/* 各市区项目规模 */}


      {/* 全市内外资项目数及投资额 */}
      {chartType === 'bar' && chartType2 === 'bar' && (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLeft}>
            <h3 className={styles.chartTitle}>全市内外资项目数及投资额</h3>
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
        {chartType3 === 'bar' && (
        <div className={styles.chartContent}>
          <div className={styles.chartItem}>
            <div className={styles.itemTitle}>内资</div>
            <div className={styles.itemCon}>
              <div className={styles.itemText}>数量(个)</div>
              <div className={styles.itemNum1}>{currentData.nzProjNum}</div>
            </div>
            <div className={styles.itemCon}>
              <div className={styles.itemText}>金额(亿元)</div>
              <div className={styles.itemNum2}>{currentData.nzTz}</div>
            </div>
          </div>
          <div className={styles.chartItem}>
            <div className={styles.itemTitle}>外资</div>
            <div className={styles.itemCon}>
              <div className={styles.itemText}>数量(个)</div>
              <div className={styles.itemNum3}>{currentData.wzProjNum}</div>
            </div>
            <div className={styles.itemCon}>
              <div className={styles.itemText}>金额(亿美元)</div>
              <div className={styles.itemNum4}>{currentData.wzTz}</div>
            </div>
          </div>
        </div>
        )}

        {/* 图表区域 */}
          <div>
            {/* <div className={styles.divider}></div> */}
            <div className={styles.chartContainer}>
              {chartType3 === 'bar' ? (
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
                    columns={columns3}
                    dataSource={dataSource2}
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
      {/* 全市内外资项目数及投资额 */}

      
    </div >
  );
};

export default OverMillionProjects;