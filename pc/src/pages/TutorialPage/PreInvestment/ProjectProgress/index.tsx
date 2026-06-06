import { primeApi, systemApi } from '@/services/api';
import { StatisticsProjectStatusInfoRequest } from '@/services/apis';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, DatePicker, Form, Row, Select, Space, Table,message,InputNumber } from 'antd';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';
import styles from './index.module.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;

const TopEconomyChart = (e: { data1: any }) => {
  const { data1 } = e;
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const option = {
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      series: [
        {
          type: 'pie',
          name: '市区新签约项目数量',
          center: ['60%', '50%'],
          radius: '70%',
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10, // 圆角大小
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            label: {
              show: true,
              fontWeight: 'bold',
            },
          },
          data: data1.length>0? data1.map((item: any) => {
            return {
              name: item.district,
              value: item.newNum,
            };
          }):[],
        },
      ],
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [JSON.stringify(e)]);
  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

function GlobalProjectChart2(e: { data1: any }) {
  const { data1 } = e;
  let list1: any[] = [];
  let list2: any[] = [];

  if (data1 && data1.length > 0) {
    data1.forEach((item: any) => {
      list1.push(item.total);
      list2.push(item.amount);
    });
  }
  const chartRef = useRef(null);
  useEffect(() => {
    const colors = ['#407DFC', '#8A7AF7', '#01C892', '#fed85e', '#36C2FD'];
    const chart = echarts.init(chartRef.current);
    const option = {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      grid: {
        top: '9%',
        bottom: '12%',
      },
      legend: {
        // data: ['注册', '备案', '完成报批', '开工', '竣工'],
        data: ['未开工', '已开工'],
        top: 'top',
        left: 'right',
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0, // 强制显示所有标签
            // rotate: 30, // 标签旋转防重叠
            fontSize: 10, // 调小字体
          },
          data: data1.length > 0? data1.map((item: any) => item.district):[],
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '项目数量',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: false,
            lineStyle: {},
          },
          axisLabel: {
            formatter: function (value: any) {
              return value;
            },
          },
        },
      ],
      // 1 注册  5备案 4 报批 2开工 3 竣工
      series: [
        {
          // 与列表字段一致：registerNum = 未开工
          name: '未开工',
          type: 'bar',
          data: data1.length > 0 ? data1.map((item: any) => Number(item.registerNum ?? 0)) : [],
        },
        {
          // 与列表字段一致：fillNum = 已开工
          name: '已开工',
          type: 'bar',
          data: data1.length > 0 ? data1.map((item: any) => Number(item.fillNum ?? 0)) : [],
        },
        // {
        //   name: '完成报批',
        //   type: 'bar',
        //   data: data1.length > 0? data1.map((item: any) => item.completeApprovaNum):[],
        // },
        // {
        //   name: '开工',
        //   type: 'bar',
        //   data: data1.length > 0? data1.map((item: any) => item.startNum):[],
        // },
        // {
        //   name: '竣工',
        //   type: 'bar',
        //   data: data1.length > 0? data1.map((item: any) => item.endNum):[],
        // },
      ],
    };
    chart.setOption(option);
    return () => chart.dispose();
  }, [JSON.stringify(e)]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%', marginTop: '0.2rem' }}></div>;
}

const ProjectProgress: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/tutorial/preinvestment`);
  };

  const goBackHome = () =>{
    navigate(`/tutorial`);
  }

  const TitleCom: React.FC<{ text: string }> = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ marginRight: 8 }}>{text}</span>
    </div>
  );

  const [searchParams] = useSearchParams();
  const initialMoney = searchParams.get('money') ? Number(searchParams.get('money')): 0;
  const initialKeyProjectType = (() => {
    const v = searchParams.get('keyProjectType') || searchParams.get('isMainProj');
    return v === '市重点' || v === '省重大' ? v : '全部';
  })();
  const [rangeDate,setRangeDate] = useState([dayjs().startOf('year'),dayjs().endOf('month')]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [currentView, setCurrentView] = useState<string>('table');

  const [money, setMoney] = useState<number | string>(initialMoney);
  const [showMoneyInput, setShowMoneyInput] = useState(false);
  const [startMoney, setStartMoney] = useState(0);
  const [endMoney, setEndMoney] = useState(1);
  const [industry, setBIndustry] = useState('');
  const [isKcProj, setIsKcProj] = useState('');
  const [keyProjectType, setKeyProjectType] = useState<string>(initialKeyProjectType);

  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month'));

  type FieldType = {
    startDate?: string;
    money?: number;
    endDate?: string;
    rangeDate?:any;
    industry?: string;
    isKcProj?: string;
    startMoney?:number;
    endMoney?:number;
    keyProjectType?: string;
  };

  interface ProjectData {
    districtCode: string;
    district: string;
    parkCode?: string;
    newNum: string;
    newAmount: string;
    registerNum: string;
    registerAmount: string;
    fillNum: string;
    fillAmount: string;
    completeApprovaNum: string;
    completeApprovaAmount: string;
    startNum: string;
    startAmount: string;
  }
  const [dataSource, setDataSource] = useState<ProjectData[]>([]);

  // 权限相关 state（和 OverMillionProjects 一样）
  const [allowedZsDepts, setAllowedZsDepts] = useState<string[]>([]);
  const [permissionLevel, setPermissionLevel] = useState<number | null>(null); // 2, 3, 4 或 null

  // 获取用户权限（和 OverMillionProjects 一样的逻辑）
  const fetchUserAreaPermissions = async () => {
    try {
      // 首先查询 level=2
      const level2Response = await systemApi.getActiveAreaGrantsRaw({ level: [2] });
      const level2Data = await level2Response.value();
      const level2Areas = level2Data?.areas || [];

      if (level2Areas.length > 0) {
        // level=2 有权限，全部数字可点击跳转
        setAllowedZsDepts([]);
        setPermissionLevel(2);
        return;
      }

      // level=2 为空，查询 level=3
      const level3Response = await systemApi.getActiveAreaGrantsRaw({ level: [3] });
      const level3Data = await level3Response.value();
      const level3Areas = level3Data?.areas || [];

      if (level3Areas.length > 0) {
        // level=3 有权限，使用 zsDept 对比 districtCode
        const zsDepts = level3Areas
          .map((area) => area?.zsDept)
          .filter((zsDept): zsDept is string => !!zsDept)
          .map((zsDept) => String(zsDept)); // 确保转换为字符串
        console.log('level=3 权限数据:', { level3Areas, zsDepts });
        setAllowedZsDepts(zsDepts);
        setPermissionLevel(3);
 // level=3 允许展开行点击
        return;
      }

      // level=3 为空，查询 level=4
      const level4Response = await systemApi.getActiveAreaGrantsRaw({ level: [4] });
      const level4Data = await level4Response.value();
      const level4Areas = level4Data?.areas || [];

      if (level4Areas.length > 0) {
        // level=4 有权限，使用 zsDept 对比 districtCode
        const zsDepts = level4Areas
          .map((area) => area?.zsDept)
          .filter((zsDept): zsDept is string => !!zsDept)
          .map((zsDept) => String(zsDept)); // 确保转换为字符串
        console.log('level=4 权限数据:', { level4Areas, zsDepts });
        setAllowedZsDepts(zsDepts);
        setPermissionLevel(4);
 // level=4 不允许展开行点击
        return;
      }

      // 所有级别都没有权限
      setAllowedZsDepts([]);
      setPermissionLevel(null);
    } catch (error) {
      console.error('获取用户权限失败:', error);
      setAllowedZsDepts([]);
      setPermissionLevel(null);
    }
  };

  // 判断是否可以访问记录（和 OverMillionProjects 一样的逻辑）
  const canAccessRecord = (record: ProjectData) => {
    if (!record) return false;

    // level=2 权限，全部可点击
    if (permissionLevel === 2) return true;

    // 如果没有权限列表，则不能访问
    if (!allowedZsDepts || allowedZsDepts.length === 0) return false;

    // 检查当前记录的 districtCode 是否在权限列表中
    const districtCode = String(record.districtCode || ''); // 确保转换为字符串

    // 主行：检查 districtCode 是否在权限列表中
    const canAccess = allowedZsDepts.includes(districtCode);
    return canAccess;
  };

  // 获取单元格样式（根据权限）
  const getCellStyle = (record: ProjectData) => {
    const canAccess = canAccessRecord(record);
    return {
      cursor: canAccess ? 'pointer' : 'not-allowed',
      fontWeight: 700,
      color: canAccess ? '#1a237e' : '#999',
      transition: 'color 0.3s ease',
    };
  };

  // 获取合计行样式（根据权限）
  const getSummaryCellStyle = () => {
    const canAccess = permissionLevel === 2;
    return {
      cursor: canAccess ? 'pointer' : 'not-allowed',
      fontWeight: 700,
      color: canAccess ? '#1a237e' : '#999',
      transition: 'color 0.3s ease',
    };
  };

  const handleToList = (record: any, type: number) => {
    // 检查权限
    // 如果是合计行（空对象或没有 districtCode），需要检查 level=2 权限
    if (!record || !record.districtCode) {
      // 合计行：只有 level=2 权限时才能点击
      if (permissionLevel !== 2) {
        message.warning('当前账户无权限查看合计数据');
        return;
      }
    } else if (!canAccessRecord(record)) {
      // 普通行：检查记录权限
      message.warning('当前账户无权限查看该区域数据');
      return;
    }
    const queryParams = new URLSearchParams({
      // year: dayjs(endDate).year().toString(),
      currStartDate: dayjs(startDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      showAll: 'true',
      page: '1',
      pageSize: '10',
      isKcProj: isKcProj,
    });
    if (type === 1) {
      // queryParams.set('currentProjectProgress', '2');
    } else if (type === 2) {
      // 未开工：rProgress 为 [0,1,5,4]
      queryParams.set('rProgress', '0,1,5,4');
    } else if (type === 3) {
      // 已开工：rProgress 为 [2,3]
      queryParams.set('rProgress', '2,3');
    }
    if (record?.district !== '-') {
      if (record?.districtCode) {
        queryParams.set('district', record?.districtCode);
      }
    }
    if(industry === '1'){
      queryParams.set("projectType", '服务业');
    }else if(industry === '2'){
      queryParams.set("projectType", '工业');
    }
    if (money === -1) {
      // 自定义金额范围
      queryParams.set('rmb1', startMoney.toString());
      queryParams.set('rmb2', endMoney.toString());
      queryParams.set('doller1', Number((startMoney*10000/7.2).toFixed(0)).toString());
      queryParams.set('doller2', Number((endMoney*10000/7.2).toFixed(0)).toString());
    } else if (money === 'below_0.5') {
      // 5千万元以下：rmb1: 0, rmb2: 0.5
      queryParams.set('rmb1', '0');
      queryParams.set('rmb2', '0.5');
      queryParams.set('doller1', '0');
      queryParams.set('doller2', Number((0.5*10000/7.2).toFixed(0)).toString());
    } else if (money === '0.5_to_1') {
      // 5千万元-1亿元：rmb1: 0.5, rmb2: 1
      queryParams.set('rmb1', '0.5');
      queryParams.set('rmb2', '1');
      queryParams.set('doller1', Number((0.5*10000/7.2).toFixed(0)).toString());
      queryParams.set('doller2', Number((1*10000/7.2).toFixed(0)).toString());
    } else if (money !== 0) {
      // 其他固定金额范围
      queryParams.set('investmentAmount', money.toString());
    }
    queryParams.set('fromPage', '/tutorial/preinvestment/project-progress');
    // 跳转到项目管理页面
    // navigate(`/tutorial/project-manage?${queryParams.toString()}`);
    window.open(`/tutorial/project-manage?${queryParams.toString()}`, '_blank');
  };

  const columns = [
    {
      title: <TitleCom text="市（区）" />,
      dataIndex: 'district',
      key: 'district',
      width: 150,
      align: 'center' as const,
    },
    {
      title: <TitleCom text="新签约项目" />,
      children: [
        {
          title: <TitleCom text="个数" />,
          dataIndex: 'newNum',
          key: 'newNum',
          width: 150,
          align: 'center' as const,
          sorter: (a: any, b: any) => a.newNum - b.newNum,
          showSorterTooltip: false,
          onCell: (record: any) => ({
            onClick: () => handleToList(record, 1),
            style: getCellStyle(record),
          }),
        },
        {
          title: <TitleCom text="金额（亿元）" />,
          dataIndex: 'newAmount',
          key: 'newAmount',
          width: 150,
          align: 'center' as const,
          sorter: (a: any, b: any) => a.newAmount - b.newAmount,
          showSorterTooltip: false,
        },
      ],
    },
    {
      title: <TitleCom text="其中" />,
      children: [
        {
          title: <TitleCom text="未开工" />,
          children: [
            {
              title: <TitleCom text="个数" />,
              dataIndex: 'registerNum',
              key: 'registerNum',
              width: 150,
              align: 'center' as const,
              // defaultSortOrder: 'descend',
              sorter: (a: any, b: any) => a.registerNum - b.registerNum,
              showSorterTooltip: false,
              onCell: (record: any) => ({
                onClick: () => handleToList(record, 2),
                style: getCellStyle(record),
              }),
            },
            {
              title: <TitleCom text="投资额（亿元）" />,
              dataIndex: 'registerAmount',
              key: 'registerAmount',
              width: 150,
              align: 'center' as const,
              sorter: (a: any, b: any) => a.registerAmount - b.registerAmount,
              showSorterTooltip: false,
            },
          ],
        },
        {
          title: <TitleCom text="已开工" />,
          children: [
            {
              title: <TitleCom text="个数" />,
              dataIndex: 'fillNum',
              key: 'fillNum',
              width: 150,
              align: 'center' as const,
              sorter: (a: any, b: any) => a.fillNum - b.fillNum,
              showSorterTooltip: false,
              onCell: (record: any) => ({
                onClick: () => handleToList(record, 3),
                style: getCellStyle(record),
              }),
            },
            {
              title: <TitleCom text="投资额（亿元）" />,
              dataIndex: 'fillAmount',
              key: 'fillAmount',
              width: 150,
              align: 'center' as const,
              sorter: (a: any, b: any) => a.fillAmount - b.fillAmount,
              showSorterTooltip: false,
            },
          ],
        },
        // {
        //   title: <TitleCom text="完成报批" />,
        //   children: [
        //     {
        //       title: <TitleCom text="个数" />,
        //       dataIndex: 'completeApprovaNum',
        //       key: 'completeApprovaNum',
        //       width: 150,
        //       align: 'center' as const,
        //       sorter: (a: any, b: any) => a.completeApprovaNum - b.completeApprovaNum,
        //       showSorterTooltip: false,
        //       onCell: (record: any) => ({
        //         onClick: () => handleToList(record, 4),
        //         style: {
        //           cursor: 'pointer',
        //           fontWeight: 700,
        //           color: '#1a237e',
        //           transition: 'color 0.3s ease'
        //         },
        //       }),
        //     },
        //     {
        //       title: <TitleCom text="投资额（亿元）" />,
        //       dataIndex: 'completeApprovaAmount',
        //       key: 'completeApprovaAmount',
        //       width: 150,
        //       align: 'center' as const,
        //       sorter: (a: any, b: any) => a.completeApprovaAmount - b.completeApprovaAmount,
        //       showSorterTooltip: false,
        //     },
        //   ],
        // },
        // {
        //   title: <TitleCom text="开工" />,
        //   children: [
        //     {
        //       title: <TitleCom text="个数" />,
        //       dataIndex: 'startNum',
        //       key: 'startNum',
        //       width: 150,
        //       align: 'center' as const,
        //       sorter: (a: any, b: any) => a.startNum - b.startNum,
        //       showSorterTooltip: false,
        //       onCell: (record: any) => ({
        //         onClick: () => handleToList(record, 5),
        //         style: {
        //           cursor: 'pointer',
        //           fontWeight: 700,
        //           color: '#1a237e',
        //           transition: 'color 0.3s ease'
        //         },
        //       }),
        //     },
        //     {
        //       title: <TitleCom text="投资额（亿元）" />,
        //       dataIndex: 'startAmount',
        //       key: 'startAmount',
        //       width: 150,
        //       align: 'center' as const,
        //       sorter: (a: any, b: any) => a.startAmount - b.startAmount,
        //       showSorterTooltip: false,
        //     },
        //   ],
        // },
        // {
        //   title: <TitleCom text="竣工" />,
        //   children: [
        //     {
        //       title: <TitleCom text="个数" />,
        //       dataIndex: 'endNum',
        //       key: 'endNum',
        //       width: 150,
        //       align: 'center' as const,
        //       sorter: (a: any, b: any) => a.endNum - b.endNum,
        //       showSorterTooltip: false,
        //       onCell: (record: any) => ({
        //         onClick: () => handleToList(record, 6),
        //         style: {
        //           cursor: 'pointer',
        //           fontWeight: 700,
        //           color: '#1a237e',
        //           transition: 'color 0.3s ease'
        //         },
        //       }),
        //     },
        //     {
        //       title: <TitleCom text="投资额（亿元）" />,
        //       dataIndex: 'endAmount',
        //       key: 'endAmount',
        //       width: 150,
        //       align: 'center' as const,
        //       sorter: (a: any, b: any) => a.endAmount - b.endAmount,
        //       showSorterTooltip: false,
        //     },
        //   ],
        // },
      ],
    },
  ];

  const onChangeDate3 = (newValue: any) => {
    // console.log('newValue---date---',newValue);
    setStartDate(dayjs(newValue[0]));
    setEndDate(dayjs(newValue[1]).endOf('month'));
    setRangeDate([dayjs(newValue[0]),dayjs(newValue[1]).endOf('month')])
  };

   // 处理视图切换
  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const handleChangeSelect = (newValue: any) => {
    setMoney(newValue);
    if(newValue === -1){
      setShowMoneyInput(true)
      setStartMoney(0)
      setEndMoney(1)
      form.setFieldsValue({
        startMoney: 0,
        endMoney: 1,
        money: -1,
        endDate:endDate,
        startDate:startDate,
        rangeDate:rangeDate,
        industry:industry,
        isKcProj:isKcProj,
      });
    }else{
      setShowMoneyInput(false)
    }
  };

  const changeStart = (newValue: any) => {
    setStartMoney(newValue)
  }
  const changeEnd = (newValue: any) => {
    setEndMoney(newValue)
  }

  const handleChangeSelect2 = (newValue: any) => {
    setBIndustry(newValue);
  };

  const handleChangeSelect3 = (newValue: any) => {
    setIsKcProj(newValue);
  };

  const handleChangeKeyProjectType = (newValue: string) => {
    setKeyProjectType(newValue);
  };

  const loadData = async (params: StatisticsProjectStatusInfoRequest, keyProjectOverride?: string) => {
    const keyType = keyProjectOverride ?? keyProjectType;
    const isMainProj = keyType === '市重点' || keyType === '省重大' ? keyType : undefined;
    const req = { ...params, ...(isMainProj ? { isMainProj } : {}) };
    setLoading(false);
    try {
      const res = await primeApi.statisticsProjectStatusInfo(req);
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
          completeApprovaNum: item.completeApprovaNum || '0',
          completeApprovaAmount: item.completeApprovaAmount || '0',
          startNum: item.startNum || '0',
          startAmount: item.startAmount || '0',
        };
      });
      setDataSource(tableData);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  // 表单提交处理
  const onFinish = (values: FieldType) => {
    console.log('查询条件:', values);
    setKeyProjectType(values.keyProjectType ?? '全部');
    const params: any = {
      currStartDate: dayjs(startDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      industry: industry === '1'? '服务业' : industry === '2'? '工业': '',
      isKcProj: isKcProj,
    };

    // 处理金额范围参数
    if (money === -1) {
      // 自定义金额范围
      params.rmb1 = startMoney;
      params.rmb2 = endMoney;
      params.doller1 = Number((startMoney*10000/7.2).toFixed(0));
      params.doller2 = Number((endMoney*10000/7.2).toFixed(0));
    } else if (money === 'below_0.5') {
      // 5千万元以下：rmb1: 0, rmb2: 0.5
      params.rmb1 = 0;
      params.rmb2 = 0.5;
      params.doller1 = 0;
      params.doller2 = Number((0.5*10000/7.2).toFixed(0));
    } else if (money === '0.5_to_1') {
      // 5千万元-1亿元：rmb1: 0.5, rmb2: 1
      params.rmb1 = 0.5;
      params.rmb2 = 1;
      params.doller1 = Number((0.5*10000/7.2).toFixed(0));
      params.doller2 = Number((1*10000/7.2).toFixed(0));
    } else if (money !== 0) {
      // 其他固定金额范围
      params.rmb = money;
    }

    loadData(params, values.keyProjectType);
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
    setStartDate(dayjs().startOf('year'))
    setEndDate(dayjs().endOf('month'));
    setRangeDate([dayjs().startOf('year'),dayjs().endOf('month')])
    setMoney(initialMoney);
    setBIndustry('');
    setIsKcProj('');
    setKeyProjectType('全部');
    setStartMoney(0)
    setEndMoney(1)
    setShowMoneyInput(false)
    form.setFieldsValue({
      startDate: dayjs().startOf('year'),
      endDate: dayjs().endOf('month'),
      rangeDate: [dayjs().startOf('year'),dayjs().endOf('month')],
      money: initialMoney === 0 ? 0 : initialMoney,
      industry: '',
      isKcProj: '',
      keyProjectType: '全部',
      startMoney: 0,
      endMoney: 1
    });
    const endTime = dayjs().endOf('month');
    loadData({
      rmb: initialMoney === 0 ? undefined : initialMoney,
      currStartDate: dayjs(endTime).startOf('year').startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endTime).endOf('month').format('YYYY-MM-DD'),
      industry: '',
      isKcProj: '',
    }, '全部');
  };

  useEffect(() => {
    setStartDate(dayjs().startOf('year'))
    setEndDate(dayjs().endOf('month'));
    setRangeDate([dayjs().startOf('year'),dayjs().endOf('month')])

    const params: any = {
      currStartDate: dayjs(startDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      industry: '',
      isKcProj: '',
    };

    // 处理金额范围参数
    if (money === -1) {
      params.rmb1 = startMoney;
      params.rmb2 = endMoney;
      params.doller1 = Number(((startMoney * 10000) / 7.2).toFixed(0));
      params.doller2 = Number(((endMoney * 10000) / 7.2).toFixed(0));
    } else if (money === 'below_0.5') {
      params.rmb1 = 0;
      params.rmb2 = 0.5;
      params.doller1 = 0;
      params.doller2 = Number((0.5*10000/7.2).toFixed(0));
    } else if (money === '0.5_to_1') {
      params.rmb1 = 0.5;
      params.rmb2 = 1;
      params.doller1 = Number((0.5*10000/7.2).toFixed(0));
      params.doller2 = Number((1*10000/7.2).toFixed(0));
    } else if (money !== 0) {
      params.rmb = money;
    }

    loadData(params, initialKeyProjectType);
  }, []);

  // 获取用户权限
  useEffect(() => {
    fetchUserAreaPermissions();
  }, []);

  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <div className={styles.flexBetWeen}>
          <Button className={styles.backBtn} onClick={() => goBack()} icon={<ArrowLeftOutlined />}>
            返回
          </Button>
          <Button className={styles.backBtn} onClick={() => goBackHome()}>
            返回首页
          </Button>
        </div>
        <Breadcrumb className={styles.mb15} style={{fontSize: '20px'}}>
          <Breadcrumb.Item>
            <a style={{height:'auto'}} onClick={() => navigate(-2)}>
              <HomeOutlined style={{marginRight: '10px',fontSize: '20px'}} />首页
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a style={{height:'auto'}} onClick={() => navigate(-1)}>前期招商</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>项目进度情况</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>全市新签约项目进度情况表</h1>
        {/* <p className={styles.pageSubtitle}>展示各市(区)新签约项目进度情况表</p> */}

        {/* 查询条件表单 */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              backgroundSize: '100% 100%',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 'bolder',
                  paddingLeft: '16px',
                  paddingTop: '16px',
                  color: '#1a237e',
                }}
              >
                查询条件
              </div>
            </div>
            <Form
              form={form}
              layout="horizontal"
              name="queryForm"
              onFinish={onFinish}
              autoComplete="off"
              initialValues={{
                money: money,
                rangeDate: rangeDate,
                industry:industry,
                isKcProj:isKcProj,
                keyProjectType: keyProjectType,
                startMoney: startMoney,
                endMoney:endMoney
              }}
            >
              <Row>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                  }}
                  label="所属月份"
                  name="rangeDate"
                >
                  <RangePicker locale={zhCN} picker="month" format="YYYY-MM" placeholder={["开始月份",'结束月份']} style={{ marginRight: '20px' }} onChange={onChangeDate3} />

                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                  }}
                  label="金额范围"
                  name="money"
                >
                  <Select
                    style={{ width: 120 }}
                    onChange={handleChangeSelect}
                    options={[
                      { value: 0, label: '全部' },
                      { value: -1, label: '自定义' },
                      { value: 'below_0.5', label: '5千万元以下' },
                      { value: '0.5_to_1', label: '5千万元-1亿元' },
                      { value: 1, label: '1亿元' },
                      { value: 5, label: '5亿元' },
                      { value: 10, label: '10亿元' },
                    ]}
                  />
                </Form.Item>
                {showMoneyInput ? (
                  <Row>
                    <Form.Item<FieldType>
                    style={{
                      width: '110px',
                      marginLeft: '20px',
                    }}
                    label=""
                    name="startMoney"
                  >
                    <InputNumber addonAfter="亿元" defaultValue={0} onChange={changeStart} />
                  </Form.Item>
                  <div className={styles.middleText}>至</div>
                  <Form.Item<FieldType>
                    style={{
                      width: '110px',
                    }}
                    label=""
                    name="endMoney"
                  >
                    <InputNumber addonAfter="亿元" defaultValue={1} onChange={changeEnd} />
                  </Form.Item>
                </Row>
                ):''}
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                  }}
                  label="所属行业"
                  name="industry"
                >
                  {/* 1-服务业 2-制造业 */}
                  <Select
                    style={{ width: 120 }}
                    onChange={handleChangeSelect2}
                    options={[
                      { value: '', label: '全部' },
                      { value: '1', label: '服务业' },
                      { value: '2', label: '制造业' }
                    ]}
                  />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                  }}
                  label="是否科创项目"
                  name="isKcProj"
                >
                  {/* 1-服务业 2-制造业 */}
                  <Select
                    style={{ width: 120 }}
                    onChange={handleChangeSelect3}
                    options={[
                      { value: '', label: '全部' },
                      { value: '是', label: '是' },
                      { value: '否', label: '否' }
                    ]}
                  />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                  }}
                  label="重点项目选择"
                  name="keyProjectType"
                  initialValue="全部"
                >
                  <Select
                    style={{ width: 120 }}
                    onChange={handleChangeKeyProjectType}
                    options={[
                      { value: '全部', label: '全部' },
                      { value: '市重点', label: '市重点' },
                      { value: '省重大', label: '省重大' },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  style={{
                    marginLeft: '20px',
                  }}
                >
                  <Space>
                    <Button style={{ backgroundColor: '#1a237e' }} type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button htmlType="button" onClick={onReset}>
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Row>
            </Form>
          </div>
        </div>

        <div className={styles.actionContainer}>
          <div className={styles.tableActions}>
            <div className={styles.filterControls}>
              <Button
                className={[styles.chartBtn, currentView === 'echarts' ? styles.active : ''].join(
                  ' ',
                )}
                data-view="echarts"
                onClick={() => handleViewChange('echarts')}
                style={{marginRight: '10px'}}
              >
                图
              </Button>
              <Button
                className={[styles.chartBtn, currentView === 'table' ? styles.active : ''].join(
                  ' ',
                )}
                data-view="table"
                onClick={() => handleViewChange('table')}
              >
                表
              </Button>
            </div>
          </div>
        </div>

        {currentView === 'table' && (
        <div className={styles.projectsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>进度情况表</div>
            <div className={styles.tableActions}>
              <Button
                style={{ backgroundColor: '#1a237e' }}
                type="primary"
                onClick={() => navigate('/tutorial/preinvestment/project-not-start')}
              >
                未开工项目进度
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.districtCode}
            bordered
            size="middle"
            className={styles.benchtable}
            summary={() => {
              let totalNewNum = 0,
                totalNewAmount = 0,
                totalRegisterNum = 0,
                totalRegisterAmount = 0,
                totalFillNum = 0,
                totalFillAmount = 0;
              dataSource.forEach((item: any) => {
                totalNewNum += item.newNum;
                totalNewAmount += item.newAmount;
                totalRegisterNum += item.registerNum;
                totalRegisterAmount += item.registerAmount;
                totalFillNum += item.fillNum;
                totalFillAmount += item.fillAmount;
              });
              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} align="center">合计</Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="center">
                      <span style={getSummaryCellStyle()} onClick={() => handleToList({}, 1)}>
                        {totalNewNum}
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} align="center">
                      {totalNewAmount.toFixed(2)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} align="center">
                      <span style={getSummaryCellStyle()} onClick={() => handleToList({}, 2)}>
                        {totalRegisterNum}
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} align="center">
                      {totalRegisterAmount.toFixed(2)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5} align="center">
                      <span style={getSummaryCellStyle()} onClick={() => handleToList({}, 3)}>
                        {totalFillNum}
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6} align="center">
                      {totalFillAmount.toFixed(2)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
          />
        </div>
        )}
        {currentView === 'echarts' && (
        <div className={styles.chartsSection}>
          <div className={styles.chartsHeader}>
            <h2 className={styles.chartsTitle}>数据可视化分析</h2>
          </div>

          <div className={styles.chartsContainer}>
            <div className={styles.chartCard}>
              <div className={styles.chartCardHeader}>
                <h3 className={styles.chartCardTitle}>市区新签约项目数量</h3>
              </div>
              <div className={styles.chartCardBody}>
                <TopEconomyChart data1={dataSource} />
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartCardHeader}>
                <h3 className={styles.chartCardTitle}>项目数量</h3>
              </div>
              <div className={styles.chartCardBody}>
                <GlobalProjectChart2 data1={dataSource} />
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ProjectProgress;
