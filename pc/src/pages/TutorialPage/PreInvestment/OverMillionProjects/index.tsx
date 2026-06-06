import { primeApi, systemApi } from '@/services/api';
import { StatisticsSignedProjectInfoRequest } from '@/services/apis';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  DatePicker,
  Form,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Table
} from 'antd';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './index.module.css';

import zhCN from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;

const TopEconomyChart = (e: { data1: any }) => {
  const { data1 } = e;
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const colors = ['#5470c6', '#91cc75', '#fed85e', '#957afd', '#01C892', '#36C2FD'];
    const option = {
      color: colors,
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
          name: '项目数量及占比',
          center: ['60%', '50%'],
          radius: '50%',
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
          data:
            data1.length > 0
              ? data1.map((item: any) => {
                  return {
                    name:
                      item.district === '医药高新区(高港区)'
                        ? '医药高新区\n(高港区)'
                        : item.district,
                    value: item.projNums,
                  };
                })
              : [],
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
  const data2 = data1.map((item: any) => {
    return {
      district: item.district === '医药高新区(高港区)' ? '医药高新区\n(高港区)' : item.district,
    };
  });
  const chartRef = useRef(null);
  useEffect(() => {
    const colors = ['#5470c6', '#8A7AF7'];
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
        bottom: '20%',
      },
      legend: {
        data: ['累计新增内资', '累计新增外资'],
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
          data: data2.length > 0 ? data2.map((item: any) => item.district) : [],
          //  ['靖江', '泰兴', '兴化', '海陵', '姜堰', '高新'],
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
      series: [
        {
          name: '累计新增内资',
          type: 'bar',
          data: data1.length > 0 ? data1.map((item: any) => item.nzProjNum) : [],
        },
        {
          name: '累计新增外资',
          type: 'bar',
          data: data1.length > 0 ? data1.map((item: any) => item.wzProjNum) : [],
        },
      ],
    };
    chart.setOption(option);
    return () => chart.dispose();
  }, [JSON.stringify(e)]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%', marginTop: '0.2rem' }}></div>;
}

function GlobalProjectChart1(e: { data1: any; data5: any; data10: any }) {
  const { data1, data5, data10 } = e;
  const chartRef = useRef(null);
  useEffect(() => {
    const colors = ['#427efc', '#957afd', '#01C892'];
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
        bottom: '20%',
        // left: '18%',
      },
      legend: {
        data: ['1亿元以上', '5亿元以上', '10亿元以上'],
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
          data: ['靖江市', '泰兴市', '兴化市', '海陵区', '姜堰区', '医药高新区\n(高港区)'],
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
          },
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      series: [
        {
          name: '1亿元以上',
          type: 'line',
          data: data1, // [191, 176, 146, 164, 136, 155],
        },
        {
          name: '5亿元以上',
          type: 'line',
          data: data5, // [73, 72, 48, 59, 56, 63],
        },
        {
          name: '10亿元以上',
          type: 'line',
          data: data10, // [8, 21, 11, 15, 16, 13],
        },
      ],
    };
    chart.setOption(option);
    return () => chart.dispose();
  }, [JSON.stringify(e)]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%', marginTop: '0.2rem' }}></div>;
}

const OverMillionProjects: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/tutorial/preinvestment`);
  };

  const goBackHome = () => {
    navigate(`/tutorial`);
  };

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
  const [currentView, setCurrentView] = useState<string>('table');
  const [money, setMoney] = useState(initialMoney);
  const [showMoneyInput, setShowMoneyInput] = useState(false);
  const [startMoney, setStartMoney] = useState(0);
  const [endMoney, setEndMoney] = useState(1);
  const [, setMonth] = useState(9);
  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month'));

  const [loading, setLoading] = useState(false);
  const [industry, setBIndustry] = useState('');
  const [isKcProj, setIsKcProj] = useState('');
  const [keyProjectType, setKeyProjectType] = useState<string>(initialKeyProjectType);
  const [form] = Form.useForm();

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
    keyProjectType?: string;
  };

  interface ProjectData {
    district: string;
    districtCode: string;
    parkCode?: string;
    city: string;
    children?: ProjectData[];
    monthNum: string;
    monthQyje: string;
    projNums: string;
    ztz: string;
    ndmbwcl: string;
    nzProjNum: string;
    nzTz: string;
    wzProjNum: string;
    wzTz: string;
    monthFiveNum: string;
    monthFiveQyje: string;
    fiveNum: string;
    fiveQyje: string;
    fndmbwcl: string;
  }
  const [dataSource, setDataSource] = useState<ProjectData[]>([]);
  const [dataSource1, setDataSource1] = useState<any>([]);
  const [dataSource5, setDataSource5] = useState<any>([]);
  const [dataSource10, setDataSource10] = useState<any>([]);
  const [rangeDate, setRangeDate] = useState([dayjs().startOf('year'), dayjs().endOf('month')]);
  const [rangeDate2, setRangeDate2] = useState([dayjs().startOf('year'), dayjs().endOf('month')]);

  // 权限相关 state
  const [allowedZsDepts, setAllowedZsDepts] = useState<string[]>([]);
  const [permissionLevel, setPermissionLevel] = useState<number | null>(null); // 2, 3, 4 或 null
  const [allowChildrenClick, setAllowChildrenClick] = useState<boolean>(false); // 是否允许展开行点击

  // 获取用户权限
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
        setAllowChildrenClick(true);
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
        setAllowChildrenClick(true); // level=3 允许展开行点击
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
        setAllowChildrenClick(false); // level=4 不允许展开行点击
        return;
      }

      // 所有级别都没有权限
      setAllowedZsDepts([]);
      setPermissionLevel(null);
      setAllowChildrenClick(false);
    } catch (error) {
      console.error('获取用户权限失败:', error);
      setAllowedZsDepts([]);
      setPermissionLevel(null);
      setAllowChildrenClick(false);
    }
  };

  // 判断是否可以访问记录
  const canAccessRecord = (record: ProjectData) => {
    if (!record) return false;

    // level=2 权限，全部可点击
    if (permissionLevel === 2) return true;

    // 如果没有权限列表，则不能访问
    if (!allowedZsDepts || allowedZsDepts.length === 0) return false;

    // 检查当前记录的 districtCode 是否在权限列表中
    const districtCode = String(record.districtCode || ''); // 确保转换为字符串

    // 如果是展开行（district === '-'），需要额外检查 allowChildrenClick
    if (record.district === '-') {
      // 展开行应该使用接口返回的原始 districtCode（保存在 parkCode 中），而不是拼接后的值
      const originalDistrictCode = String(record.parkCode || record.districtCode || '');

      // 从展开行的 districtCode 中提取主行的 districtCode（去掉最后2位数字）
      // 展开行的 districtCode 格式：主行 districtCode + 2位数字（如 '00100100'）
      const parentDistrictCode = districtCode.length >= 2
        ? districtCode.substring(0, districtCode.length - 2)
        : '';

      // 检查 parkCode 是否在权限列表中
      const canAccessByParkCode = allowedZsDepts.includes(originalDistrictCode);

      // 检查主行的 districtCode 是否在权限列表中
      const canAccessByParent = parentDistrictCode && allowedZsDepts.includes(parentDistrictCode);

      // 如果主行可以点击，展开行也应该可以点击
      if (canAccessByParent) {
        return true;
      }

      // 如果 allowChildrenClick 为 false（level=4），但 parkCode 在权限列表中，也允许点击
      if (!allowChildrenClick && !canAccessByParkCode) {
        return false;
      }

      // level=3 允许展开行点击，或者 level=4 但 parkCode 在权限列表中
      return canAccessByParkCode;
    }

    // 主行：检查 districtCode 是否在权限列表中
    // 主行的 districtCode 是原始值（如 '001001'），直接对比
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

  const handleToList = (record: any, type: number) => {
    // 检查权限
    if (!canAccessRecord(record)) {
      message.warning('当前账户无权限查看该区域数据');
      return;
    }
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
    if (type === 1) {
      queryParams.set('currStartDate', currStartDate);
    } else if (type === 2) {
      queryParams.set('currStartDate', currStartDate2);
    } else if (type === 3) {
      queryParams.set('currStartDate', currStartDate2);
      queryParams.set('projectRating', '内资');
    } else if (type === 4) {
      queryParams.set('currStartDate', currStartDate2);
      queryParams.set('projectRating', '外资');
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
    if (money !== 0 && money !== -1 && money !== -2 && money !== -3) {
      queryParams.set('investmentAmount', money.toString());
    } else if (money === -1) {
      queryParams.set('rmb1', startMoney.toString());
      queryParams.set('rmb2', endMoney.toString());
      queryParams.set('doller1', Number(((startMoney * 10000) / 7.2).toFixed(0)).toString());
      queryParams.set('doller2', Number(((endMoney * 10000) / 7.2).toFixed(0)).toString());
    } else if (money === -2) {
      // 5千万以下
      queryParams.set('rmb1', '0');
      queryParams.set('rmb2', '0.5');
      queryParams.set('doller1', Number(((0 * 10000) / 7.2).toFixed(0)).toString());
      queryParams.set('doller2', Number(((0.5 * 10000) / 7.2).toFixed(0)).toString());
    } else if (money === -3) {
      // 5千万-1亿元
      queryParams.set('rmb1', '0.5');
      queryParams.set('rmb2', '1');
      queryParams.set('doller1', Number(((0.5 * 10000) / 7.2).toFixed(0)).toString());
      queryParams.set('doller2', Number(((1 * 10000) / 7.2).toFixed(0)).toString());
    }
    // queryParams.set('currentProjectProgress', '2');
    queryParams.set('fromPage', '/tutorial/preinvestment/over-million-projects');
    // 跳转到项目管理页面
    // navigate(`/tutorial/project-manage?${queryParams.toString()}`);
    window.open(`/tutorial/project-manage?${queryParams.toString()}`, '_blank');
  };

  const columns = [
    {
      title: <TitleCom text="市（区）/ 园区" />,
      dataIndex: 'district',
      key: 'district',
      minWidth: 120,
      align: 'center' as const,
      render: (text: any, record: any) => {
        return record.district === '-' ? record.city : record.district ? record.district : '-';
      },
    },
    {
      title: <TitleCom text={dayjs(rangeDate2[1]).format('YYYY.MM') + '月新增'} />,
      children: [
        {
          title: <TitleCom text="个数" />,
          dataIndex: 'monthNum',
          key: 'monthNum',
          width: 110,
          align: 'center' as const,
          sorter: (a: any, b: any) => a.monthNum - b.monthNum,
          showSorterTooltip: false,
          onCell: (record: any) => ({
            onClick: () => handleToList(record, 1),
            style: getCellStyle(record),
          }),
        },
        {
          title: <>投资额<br/>（亿元）</>,// <TitleCom text="投资额（亿元）" />,
          dataIndex: 'monthQyje',
          key: 'monthQyje',
          width: 110,
          align: 'center' as const,
          sorter: (a: any, b: any) => a.monthQyje - b.monthQyje,
          showSorterTooltip: false,
          render: (text: number | undefined) => {
            return text ? text : 0;
          },
        },
      ],
    },
    {
      title: (
        <TitleCom
          text={
            dayjs(rangeDate2[0]).format('YYYY.MM') +
            '-' +
            dayjs(rangeDate2[1]).format('YYYY.MM') +
            '累计'
          }
        />
      ),
      children: [
        {
          title: <TitleCom text="个数" />,
          dataIndex: 'projNums',
          key: 'projNums',
          width: 110,
          align: 'center' as const,
          // defaultSortOrder: 'descend',
          sorter: (a: any, b: any) => a.projNums - b.projNums,
          showSorterTooltip: false,
          onCell: (record: any) => ({
            onClick: () => handleToList(record, 2),
            style: getCellStyle(record),
          }),
        },
        {
          title: <>投资额<br/>（亿元）</>,
          dataIndex: 'ztz',
          key: 'ztz',
          width: 110,
          align: 'center' as const,
          sorter: (a: any, b: any) => a.ztz - b.ztz,
          showSorterTooltip: false,
          render: (text: number | undefined) => {
            return text ? text : 0;
          },
        },
      ],
    },
    {
      title: <TitleCom text="年度目标任务完成率" />,
      dataIndex: 'ndmbwcl',
      key: 'ndmbwcl',
      width: 180,
      align: 'center' as const,
      // defaultSortOrder: 'descend',
      sorter: (a: any, b: any) => a.ndmbwcl - b.ndmbwcl,
      showSorterTooltip: false,
      render: (text: any) => {
        // return money === 1 || money === 5? text ? text !== '-'? text + '%' :text : '0%':'-';
        return text ? (text !== '-' ? text + '%' : text) : '0%';
      },
    },
    {
      title: <TitleCom text="累计新增内资" />,
      children: [
        {
          title: <TitleCom text="个数" />,
          dataIndex: 'nzProjNum',
          key: 'nzProjNum',
          width: 110,
          align: 'center' as const,
          // defaultSortOrder: 'descend',
          sorter: (a: any, b: any) => a.nzProjNum - b.nzProjNum,
          showSorterTooltip: false,
          onCell: (record: any) => ({
            onClick: () => handleToList(record, 3),
            style: getCellStyle(record),
          }),
        },
        {
          title: <>投资额<br/>（亿元）</>,// <TitleCom text="投资额（亿元）" />,
          dataIndex: 'nzTz',
          key: 'nzTz',
          width: 110,
          align: 'center' as const,
          sorter: (a: any, b: any) => a.nzTz - b.nzTz,
          showSorterTooltip: false,
          render: (text: number | undefined) => {
            return text ? text : 0;
          },
        },
      ],
    },
    {
      title: <TitleCom text="累计新增外资" />,
      children: [
        {
          title: <TitleCom text="个数" />,
          dataIndex: 'wzProjNum',
          key: 'wzProjNum',
          width: 110,
          align: 'center' as const,
          // defaultSortOrder: 'descend',
          sorter: (a: any, b: any) => a.wzProjNum - b.wzProjNum,
          showSorterTooltip: false,
          onCell: (record: any) => ({
            onClick: () => handleToList(record, 4),
            style: getCellStyle(record),
          }),
        },
        {
          title: <>投资额<br/>（亿美元）</>,// <TitleCom text={"投资额（亿美元）"} />,
          dataIndex: 'wzTz',
          key: 'wzTz',
          width: 110,
          align: 'center' as const,
          sorter: (a: any, b: any) => a.wzTz - b.wzTz,
          showSorterTooltip: false,
          render: (text: number | undefined) => {
            return text ? text : 0;
          },
        },
      ],
    },
  ];

  const onChangeDate3 = (newValue: any) => {
    setStartDate(dayjs(newValue[0]));
    setEndDate(dayjs(newValue[1]).endOf('month'));
    setRangeDate([dayjs(newValue[0]), dayjs(newValue[1]).endOf('month')]);
  };

  const handleChangeSelect = (newValue: any) => {
    setMoney(newValue);
    if (newValue === -1) {
      setShowMoneyInput(true);
      setStartMoney(0);
      setEndMoney(1);
      form.setFieldsValue({
        startMoney: 0,
        endMoney: 1,
        money: -1,
        endDate: endDate,
        startDate: startDate,
        rangeDate: rangeDate,
        industry: industry,
        isKcProj: isKcProj,
      });
    } else {
      setShowMoneyInput(false);
    }
  };

  const handleChangeSelect2 = (newValue: any) => {
    setBIndustry(newValue);
  };

  const handleChangeSelect3 = (newValue: any) => {
    setIsKcProj(newValue);
  };

  const handleChangeKeyProjectType = (newValue: string) => {
    setKeyProjectType(newValue);
  };

  const changeStart = (newValue: any) => {
    setStartMoney(newValue);
  };
  const changeEnd = (newValue: any) => {
    setEndMoney(newValue);
  };

  // 处理视图切换
  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const loadData1 = async () => {
    const res = await primeApi.statisticsSignedProjectInfo({
      rmb: 1,
      currStartDate: dayjs(startDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      industry: industry === '1'? '服务业' : industry === '2'? '工业': '',
      isKcProj: isKcProj,
      // year: dayjs(endDate).year().toString(),
    });
    const data = res ? res : [];
    const tableData = data
      .map((item: any) => item.projNums);
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
      // year: dayjs(endDate).year().toString(),
    });
    const data = res ? res : [];
    const tableData = data
      .map((item: any) => item.projNums);
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
      // year: dayjs(endDate).year().toString(),
    });
    const data = res ? res : [];
    const tableData = data
      .map((item: any) => item.projNums);
    setDataSource10(tableData);
  };

  type LoadDataParams = StatisticsSignedProjectInfoRequest & { doller1?: number; doller2?: number };
  const loadData = async (params: LoadDataParams, keyProjectOverride?: string) => {
    const keyType = keyProjectOverride ?? keyProjectType;
    const isMainProj = keyType === '市重点' || keyType === '省重大' ? keyType : undefined;
    const baseParams = { ...params, ...(isMainProj ? { isMainProj } : {}) };
    setLoading(false);
    const res = await primeApi.statisticsSignedProjectInfo(baseParams);
    const data = (res ? res : []) as unknown as ProjectData[];

    const tableData = data;

    for (let idx = 0; idx < data.length; idx++) {
      const item = data[idx];
      const res2 = await primeApi.statisticsSignedProjectZoneInfo({
        rmb: params.rmb,
        rmb1: params.rmb1,
        rmb2: params.rmb2,
        currStartDate: params.currStartDate,
        currEndDate: params.currEndDate,
        currDate: params.currDate,
        industry: params.industry,
        isKcProj: params.isKcProj,
        zoneCode: String(item.districtCode ?? ''),
        ...(isMainProj ? { isMainProj } : {}),
      });
      const data2 = res2 ? res2 : [];
      data2.forEach((ele: any, idx: number) => {
        ele.parkCode = ele.districtCode;
        // idx 为 1 位数时前面加一个 0（如 0 -> '00', 1 -> '01', 10 -> '10'），直接拼接，不加 '-'
        const formattedIdx = idx.toString().padStart(2, '0');
        ele.districtCode = item.districtCode + formattedIdx;
        ele.city = ele.district;
        ele.district = '-';
      });
      const row = data[idx] as unknown;
      (row as Record<string, unknown>).children = data2;
      data[idx].city = '-';
    }
    setDataSource(data);

    if (money === 0 || money === -1 || money === -2 || money === -3) {
      loadData1();
      loadData5();
      loadData10();
    } else if (money === 1) {
      setDataSource1(
        tableData.map((item: any) => item.projNums),
      );
      loadData5();
      loadData10();
    } else if (money === 5) {
      setDataSource5(
        tableData.map((item: any) => item.projNums),
      );
      loadData1();
      loadData10();
    } else {
      setDataSource10(
        tableData.map((item: any) => item.projNums),
      );
      loadData1();
      loadData5();
    }
  };

  // 表单提交处理
  const onFinish = (values: FieldType) => {
    console.log('查询条件:', values);
    setMonth(dayjs(endDate).month() + 1);
    setRangeDate2([dayjs(rangeDate[0]), dayjs(rangeDate[1]).endOf('month')]);
    setKeyProjectType(values.keyProjectType ?? '全部');
    loadData({
      rmb: money === 0 || money === -1 || money === -2 || money === -3 ? undefined : money,
      currStartDate: dayjs(startDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      industry: industry === '1'? '服务业' : industry === '2'? '工业': '',
      isKcProj: isKcProj,
      rmb1: money === -1 ? startMoney : money === -2 ? 0 : money === -3 ? 0.5 : undefined,
      rmb2: money === -1 ? endMoney : money === -2 ? 0.5 : money === -3 ? 1 : undefined,
      doller1: money === -1 ? Number(((startMoney * 10000) / 7.2).toFixed(0)) : money === -2 ? Number(((0 * 10000) / 7.2).toFixed(0)) : money === -3 ? Number(((0.5 * 10000) / 7.2).toFixed(0)) : undefined,
      doller2: money === -1 ? Number(((endMoney * 10000) / 7.2).toFixed(0)) : money === -2 ? Number(((0.5 * 10000) / 7.2).toFixed(0)) : money === -3 ? Number(((1 * 10000) / 7.2).toFixed(0)) : undefined,
    }, values.keyProjectType);
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
    setMoney(initialMoney);
    setEndDate(dayjs().endOf('month'));
    setStartDate(dayjs().startOf('year'));
    setMonth(dayjs(endDate).month() + 1);
    setBIndustry('');
    setIsKcProj('');
    setKeyProjectType('全部');
    setRangeDate([dayjs().startOf('year'), dayjs().endOf('month')]);
    setRangeDate2([dayjs().startOf('year'), dayjs().endOf('month')]);
    setStartMoney(0);
    setEndMoney(1);
    setShowMoneyInput(false);
    form.setFieldsValue({
      endDate: dayjs().endOf('month'),
      rangeDate: [dayjs().startOf('year'), dayjs().endOf('month')] as any,
      money: initialMoney === 0 ? 0 : initialMoney,
      industry: '',
      isKcProj: '',
      keyProjectType: '全部',
      startMoney: 0,
      endMoney: 1,
    });
    const endTime = dayjs().endOf('month');
    // 重置时传入 '全部' 确保恢复数据
    loadData({
      rmb: initialMoney === 0 || initialMoney === -1 || initialMoney === -2 || initialMoney === -3 ? undefined : initialMoney,
      industry: '',
      isKcProj: '',
      currStartDate: dayjs(endTime).startOf('year').startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endTime).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endTime).startOf('month').format('YYYY-MM-DD'),
      rmb1: initialMoney === -1 ? 0 : initialMoney === -2 ? 0 : initialMoney === -3 ? 0.5 : undefined,
      rmb2: initialMoney === -1 ? 1 : initialMoney === -2 ? 0.5 : initialMoney === -3 ? 1 : undefined,
      doller1: initialMoney === -1 ? Number(((0 * 10000) / 7.2).toFixed(0)) : initialMoney === -2 ? Number(((0 * 10000) / 7.2).toFixed(0)) : initialMoney === -3 ? Number(((0.5 * 10000) / 7.2).toFixed(0)) : undefined,
      doller2: initialMoney === -1 ? Number(((1 * 10000) / 7.2).toFixed(0)) : initialMoney === -2 ? Number(((0.5 * 10000) / 7.2).toFixed(0)) : initialMoney === -3 ? Number(((1 * 10000) / 7.2).toFixed(0)) : undefined,
    }, '全部');
  };

  // 获取用户权限
  useEffect(() => {
    fetchUserAreaPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setEndDate(dayjs().endOf('month'));
    setMonth(dayjs(endDate).month() + 1);
    loadData({
      industry: '',
      isKcProj: '',
      rmb: money === 0 || money === -1 || money === -2 || money === -3 ? undefined : money,
      currStartDate: dayjs(endDate).startOf('year').startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      rmb1: money === -1 ? startMoney : money === -2 ? 0 : money === -3 ? 0.5 : undefined,
      rmb2: money === -1 ? endMoney : money === -2 ? 0.5 : money === -3 ? 1 : undefined,
      doller1: money === -1 ? Number(((startMoney * 10000) / 7.2).toFixed(0)) : money === -2 ? Number(((0 * 10000) / 7.2).toFixed(0)) : money === -3 ? Number(((0.5 * 10000) / 7.2).toFixed(0)) : undefined,
      doller2: money === -1 ? Number(((endMoney * 10000) / 7.2).toFixed(0)) : money === -2 ? Number(((0.5 * 10000) / 7.2).toFixed(0)) : money === -3 ? Number(((1 * 10000) / 7.2).toFixed(0)) : undefined,
      // year: dayjs(endDate).year().toString(),
    });
  }, []);

  // 获取合计行样式（根据权限）
  const getSummaryCellStyle = () => {
    return {
      cursor: 'pointer',
      fontWeight: 700,
      color: '#1a237e',
      transition: 'color 0.3s ease',
    };
  };

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
        <Breadcrumb className={styles.mb15} style={{ fontSize: '20px' }}>
          <Breadcrumb.Item>
            <a style={{ height: 'auto' }} onClick={() => navigate(-2)}>
              <HomeOutlined style={{ marginRight: '10px', fontSize: '20px' }} />
              首页
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a style={{ height: 'auto' }} onClick={() => navigate(-1)}>
              前期招商
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>新签约项目</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>新签约项目情况表</h1>

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
                industry: industry,
                isKcProj: isKcProj,
                keyProjectType: keyProjectType,
                startMoney: startMoney,
                endMoney: endMoney,
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
                  <RangePicker
                    picker="month"
                    format="YYYY-MM"
                    placeholder={['开始月份', '结束月份']}
                    style={{ marginRight: '20px' }}
                    onChange={onChangeDate3}
                    locale={zhCN}
                  />
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
                      { value: -2, label: '5千万以下' },
                      { value: -3, label: '5千万-1亿元' },
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
                ) : (
                  ''
                )}
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
                      { value: '2', label: '制造业' },
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
                      { value: '否', label: '否' },
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
              <div className={styles.tableTitle}>项目情况表</div>
            </div>

            <Table
              columns={columns}
              dataSource={dataSource}
              loading={loading}
              rowKey={(record) => record.districtCode}
              pagination={false}
              bordered
              size="middle"
              className={styles.benchtable}
              summary={() => {
              let totalMonthNum = 0,
                totalMonthQyje = 0,
                totalProjNums = 0,
                totalZtz = 0,
                totalNzProjNum = 0,
                totalNzTz = 0,
                totalWzProjNum = 0,
                totalWzTz = 0;
              dataSource.forEach((item: any) => {
                totalMonthNum += item.monthNum;
                totalMonthQyje += item.monthQyje;
                totalProjNums += item.projNums;
                totalZtz += item.ztz;
                totalNzProjNum += item.nzProjNum;
                totalNzTz += item.nzTz;
                totalWzProjNum += item.wzProjNum;
                totalWzTz += item.wzTz;
              });
              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} align="center">合计</Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="center">
                      <span style={getSummaryCellStyle()} onClick={() => handleToList({}, 1)}>
                        {totalMonthNum}
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} align="center">
                      {totalMonthQyje.toFixed(2)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} align="center">
                      <span style={getSummaryCellStyle()} onClick={() => handleToList({}, 2)}>
                        {totalProjNums}
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} align="center">
                      {totalZtz.toFixed(2)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5} align="center">
                      <span>-</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6} align="center">
                      <span style={getSummaryCellStyle()} onClick={() => handleToList({}, 3)}>
                        {totalNzProjNum}
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6} align="center">
                      {totalNzTz.toFixed(2)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6} align="center">
                      <span style={getSummaryCellStyle()} onClick={() => handleToList({}, 4)}>
                        {totalWzProjNum}
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6} align="center">
                      {totalWzTz.toFixed(2)}
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
                  <h3 className={styles.chartCardTitle}>项目数量及占比</h3>
                </div>
                <div className={styles.chartCardBody}>
                  <TopEconomyChart
                    data1={dataSource.filter((item: any) => item.district !== '全市')}
                  />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartCardHeader}>
                  <h3 className={styles.chartCardTitle}>各市区内外资项目</h3>
                </div>
                <div className={styles.chartCardBody}>
                  <GlobalProjectChart2
                    data1={dataSource.filter((item) => item.district !== '全市')}
                  />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartCardHeader}>
                  <h3 className={styles.chartCardTitle}>各市区项目规模</h3>
                </div>
                <div className={styles.chartCardBody}>
                  <GlobalProjectChart1
                    data1={dataSource1}
                    data5={dataSource5}
                    data10={dataSource10}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverMillionProjects;
