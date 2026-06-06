import { primeApi } from '@/services/api';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, message, Table, Breadcrumb, Form, Row, Select, Space, ConfigProvider, DatePicker, InputNumber } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import zhCN from 'antd/locale/zh_CN';
import dayjs, { Dayjs } from 'dayjs';
import * as echarts from 'echarts';

const { RangePicker } = DatePicker;

// 表单字段类型定义
interface FieldType {
  rangeDate?: [Dayjs, Dayjs];
  month?: any;
  money?: number;
  industry?: string;
  startMoney?: number;
  endMoney?: number;
  keyProjectType?: string;
}

// 树形数据接口类型
interface TreeNodeData {
  district?: string;
  districtName?: string;
  park?: string;
  parkName?: string;
  children?: TreeNodeData[];
  totalCount?: number;
  totalInvestment?: number;
  monthStatisticalInvestment?: number;
  yearStatisticalInvestment?: number;
  totalStatisticalInvestment?: number;
  monthIncreasement?: number;
  yearIncreasement?: number;
  yearInvestment?: number;
  key: React.Key;
  isSummary?: boolean;
}

// 获取当前年份
const getCurrentYear = () => {
  return new Date().getFullYear();
};

// 饼图组件 - 项目数量及占比
const Progress1PieChart = (e: { data1: any }) => {
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
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            label: {
              show: true,
              fontWeight: 'bold',
            },
          },
          data: data1.length > 0
            ? data1.map((item: any) => ({
                name: item.districtName || item.district || '未知',
                value: item.totalCount || 0,
              }))
            : [],
        },
      ],
    };

    chart.setOption(option);
    return () => chart.dispose();
  }, [JSON.stringify(e)]);
  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

// 柱状图组件 - 投资额对比
const Progress1InvestmentBarChart = (e: { data1: any }) => {
  const { data1 } = e;
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const colors = ['#5470c6', '#8A7AF7', '#91cc75'];
    const option = {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      grid: { top: '9%', bottom: '20%' },
      legend: {
        data: ['当月投资额', '本年累计投资', '统计投资'],
        top: 'top',
        left: 'right',
      },
      xAxis: [{
        type: 'category',
        axisTick: { alignWithLabel: true },
        axisLabel: { interval: 0, fontSize: 10 },
        data: data1.length > 0
          ? data1.map((item: any) => {
              const district = item.districtName || item.district || '未知';
              return district === '医药高新区（高港区）' ? '医药高新区' : district;
            })
          : [],
      }],
      yAxis: [{
        type: 'value',
        name: '投资额（亿元）',
        position: 'left',
        alignTicks: true,
        axisLine: { show: false },
        axisLabel: { formatter: '{value}' },
      }],
      series: [
        {
          name: '当月投资额',
          type: 'bar',
          data: data1.map((item: any) => ((item.monthStatisticalInvestment || 0) / 10000).toFixed(2)),
        },
        {
          name: '本年累计投资',
          type: 'bar',
          data: data1.map((item: any) => ((item.yearStatisticalInvestment || 0) / 10000).toFixed(2)),
        },
        {
          name: '统计投资',
          type: 'bar',
          data: data1.map((item: any) => ((item.totalStatisticalInvestment || 0) / 10000).toFixed(2)),
        },
      ],
    };
    chart.setOption(option);
    return () => chart.dispose();
  }, [JSON.stringify(e)]);
  return <div ref={chartRef} style={{ width: '100%', height: '100%', marginTop: '0.2rem' }} />;
};

// 折线图组件 - 投资趋势
const Progress1TrendChart = (e: { data1: any }) => {
  const { data1 } = e;
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const colors = ['#427efc', '#957afd', '#01C892'];
    const option = {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      grid: { top: '9%', bottom: '20%' },
      legend: {
        data: ['当月投资额', '本年累计投资', '统计投资'],
        top: 'top',
        left: 'right',
      },
      xAxis: [{
        type: 'category',
        axisTick: { alignWithLabel: true },
        axisLabel: { interval: 0, fontSize: 10 },
        data: data1.length > 0
          ? data1.map((item: any) => {
              const district = item.districtName || item.district || '未知';
              return district === '医药高新区（高港区）' ? '医药高新区' : district;
            })
          : [],
      }],
      yAxis: [{
        type: 'value',
        name: '投资额（亿元）',
        position: 'left',
        alignTicks: true,
        axisLine: { show: false },
        axisLabel: { formatter: '{value}' },
      }],
      series: [
        {
          name: '当月投资额',
          type: 'line',
          data: data1.map((item: any) => ((item.monthStatisticalInvestment || 0) / 10000).toFixed(2)),
        },
        {
          name: '本年累计投资',
          type: 'line',
          data: data1.map((item: any) => ((item.yearStatisticalInvestment || 0) / 10000).toFixed(2)),
        },
        {
          name: '统计投资',
          type: 'line',
          data: data1.map((item: any) => ((item.totalStatisticalInvestment || 0) / 10000).toFixed(2)),
        },
      ],
    };
    chart.setOption(option);
    return () => chart.dispose();
  }, [JSON.stringify(e)]);
  return <div ref={chartRef} style={{ width: '100%', height: '100%', marginTop: '0.2rem' }} />;
};

const InvestmentDetail: React.FC = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<TreeNodeData[]>([]);
  const [summaryData, setSummaryData] = useState<TreeNodeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('table');

  // 存储展开的节点key
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 查询条件状态：月份范围（不能跨年），默认 2025年9月
  const getDefaultRange = (): [Dayjs, Dayjs] => {
    const d = dayjs('2025-09');
    return [d, d];
  };
  const [industry, setIndustry] = useState<string>('');
  const [rangeDate, setRangeDate] = useState<[Dayjs, Dayjs]>(getDefaultRange);
  const [displayRangeDate, setDisplayRangeDate] = useState<[Dayjs, Dayjs]>(getDefaultRange);
  const [money, setMoney] = useState<number>(0); // 默认为0（全部）
  const [startMoney, setStartMoney] = useState<number>(0);
  const [endMoney, setEndMoney] = useState<number>(1);
  const [showMoneyInput, setShowMoneyInput] = useState<boolean>(false);
  const [keyProjectType, setKeyProjectType] = useState<string>('全部'); // 重点项目选择：全部、市重点、省重大，不参与传参

  const [form] = Form.useForm();

  const handleBack = () => {
    navigate('/tutorial/tou-zi-jin-du');
  };

  // 处理视图切换
  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  // 处理数量字段点击事件
  const handleNumberClick = (record: TreeNodeData, fieldName: string) => {
    const params = new URLSearchParams();

    // 添加基础参数
    // 当district为"泰州市"时不传递district参数，改用city参数
    if (record.district && record.district !== '泰州市') {
      params.set('city', record.district);
    }
    if (record.park) {
      params.set('park', record.park);
    }

    const endDay = rangeDate[1];
    const year = endDay.year();
    params.set('year', year.toString());
    const month = endDay.month() + 1;

    // 根据字段名确定参数
    if (fieldName === 'totalCount') {
      // 项目总数个数：只传district(city)
      // year已经在上面设置了
    } else if (fieldName === 'monthIncreasement' || fieldName === 'yearIncreasement') {
      // 新增入库项目个数：传year, month, district(city)
      params.set('month', month.toString());
    }

    // 传递查询模块的参数（金额范围和产业链）
    // 只有当金额筛选不为0（全部）时才传递金额参数
    if (money !== 0) {
      if (money === -1) {
        // 自定义范围
        if (startMoney) {
          params.set('minAmount', (startMoney * 10000).toString());
        }
        if (endMoney) {
          params.set('maxAmount', (endMoney * 10000).toString());
        }
      } else if (money === 1) {
        // 1亿元：1-5亿之间
        params.set('minAmount', '10000');
        params.set('maxAmount', '50000');
      } else if (money === 5) {
        // 5亿元：5-10亿之间
        params.set('minAmount', '50000');
        params.set('maxAmount', '100000');
      } else if (money === 10) {
        // 10亿元：10亿以上
        params.set('minAmount', '100000');
      }
    }

    // 产业链参数
    if (industry) {
      params.set('industrialChain', industry);
    }

    // 添加来源标识
    params.set('from', 'progress1');

    // 跳转到ProgressDetailAdavance页面
    // navigate(`/tutorial/tou-zi-jin-du/progress-detail-adavance?${params.toString()}`);
  };

  // 处理金额范围选择变化
  const handleChangeSelect = (value: number) => {
    setMoney(value);
    setShowMoneyInput(value === -1);
  };

  const handleChangeKeyProjectType = (newValue: string) => {
    setKeyProjectType(newValue);
  };

  const onChangeRangeDate = (dates: null | [Dayjs | null, Dayjs | null]) => {
    if (!dates || !dates[0]) return;
    const [start, end] = dates;
    if (!end) {
      const next = [start!, start!] as [Dayjs, Dayjs];
      setRangeDate(next);
      form.setFieldsValue({ rangeDate: next });
      return;
    }
    if (start.year() !== end.year()) {
      message.warning('不能跨越年份选择，请选择同一年内的月份范围');
      const next = [start, start] as [Dayjs, Dayjs];
      setRangeDate(next);
      form.setFieldsValue({ rangeDate: next });
      return;
    }
    const next = [start, end] as [Dayjs, Dayjs];
    setRangeDate(next);
    form.setFieldsValue({ rangeDate: next });
  };

  const onFinish = (values: FieldType) => {
    setKeyProjectType(values.keyProjectType ?? '全部');

    // 重点项目选择：市重点、省重大 不参与传参，数据展示为 0，需点击查询生效
    if (values.keyProjectType === '市重点' || values.keyProjectType === '省重大') {
      setDataSource([]);
      setSummaryData(null);
      return;
    }

    setIndustry(values.industry || '');
    setMoney(values.money ?? 0);
    const newRange = values.rangeDate && values.rangeDate[0] && values.rangeDate[1]
      ? values.rangeDate as [Dayjs, Dayjs]
      : rangeDate;
    if (newRange[0].year() !== newRange[1].year()) {
      message.warning('不能跨越年份选择');
      return;
    }
    setRangeDate(newRange);
    setDisplayRangeDate(newRange);

    let minAmount: number | null = null;
    let maxAmount: number | null = null;
    const moneyValue = values.money !== undefined ? values.money : money;
    if (moneyValue === 1) {
      minAmount = 10000;
      maxAmount = 50000;
    } else if (moneyValue === 5) {
      minAmount = 50000;
      maxAmount = 100000;
    } else if (moneyValue === 10) {
      minAmount = 100000;
      maxAmount = null;
    } else if (moneyValue === -1) {
      minAmount = values.startMoney || startMoney || null;
      maxAmount = values.endMoney || endMoney || null;
    }
    const innovativeClusters = values.industry || industry || undefined;
    fetchApprovalData(newRange[0], newRange[1], minAmount, maxAmount, innovativeClusters);
  };

  const onReset = () => {
    form.resetFields();
    setIndustry('');
    setMoney(0);
    setKeyProjectType('全部');
    const resetRange = getDefaultRange();
    setRangeDate(resetRange);
    setDisplayRangeDate(resetRange);
    setStartMoney(0);
    setEndMoney(1);
    setShowMoneyInput(false);
    form.setFieldsValue({
      rangeDate: resetRange,
      money: 0,
      industry: '',
      keyProjectType: '全部',
      startMoney: 0,
      endMoney: 1
    });
    fetchApprovalData(resetRange[0], resetRange[1], null, null, undefined);
  };

  // 树形数据处理逻辑已整合到fetchApprovalData函数中

  // 获取列统投资数据，startDate/endDate 为月份范围，end 传月尾，使用 UTC 避免时区问题
  const fetchApprovalData = async (startDate: Dayjs, endDate: Dayjs, minAmount?: number | null, maxAmount?: number | null, innovativeClusters?: string) => {
    setLoading(true);
    try {
      const startUtc = new Date(Date.UTC(startDate.year(), startDate.month(), startDate.date()));
      const endOfMonth = endDate.endOf('month');
      const endUtc = new Date(Date.UTC(endOfMonth.year(), endOfMonth.month(), endOfMonth.date()));
      const params: any = {
        start: startUtc,
        end: endUtc
      };
      if (minAmount !== undefined && minAmount !== null) {
        params.minAmount = minAmount;
      }
      if (maxAmount !== undefined && maxAmount !== null) {
        params.maxAmount = maxAmount;
      }
      if (innovativeClusters) {
        params.innovativeClusters = innovativeClusters;
      }
      const response: any = await primeApi.getStatisticalInvestment(params);

      // 递归为所有子项添加key属性
      const addKeysToChildren = (item: any, parentKey: string = '', index: number = 0): TreeNodeData => {
        const key = parentKey ? `${parentKey}-${index}` : `item-${index}`;
        return {
          ...item,
          key,
          children: item.children && item.children.length > 0
            ? item.children.map((child: any, childIndex: number) =>
                addKeysToChildren(child, key, childIndex)
              )
            : undefined
        };
      };

      // 处理响应数据
      let processedData: TreeNodeData[] = [];
      if (Array.isArray(response)) {
        processedData = response.map((item, index) => addKeysToChildren(item, '', index));
      } else if (response) {
        processedData = [addKeysToChildren(response, '', 0)];
      }

      setDataSource(processedData);

      // 自动展开第一级
      const firstLevelKeys: React.Key[] = processedData.map(item => item.key);
      setExpandedKeys(firstLevelKeys);
    } catch (error) {
      console.error('获取列统投资数据失败:', error);
      message.error('获取列统投资数据失败');
      setDataSource([]);
      setSummaryData(null);
    } finally {
      setLoading(false);
    }
  };

  const loadDivisionData = async (minAmount?: number | null, maxAmount?: number | null, innovativeClusters?: string) => {
    const [startDate, endDate] = rangeDate;
    await fetchApprovalData(startDate, endDate, minAmount ?? null, maxAmount ?? null, innovativeClusters);
  };

  // 表格列配置
  const columns = [
    {
      title: '市（区）',
      dataIndex: 'district',
      key: 'district',
      width: 220,
      render: (text: string, record: TreeNodeData) => {
        // 市区值为空时显示园区
        const displayText = record.districtName || record.parkName || '--';
        return (
          <span
            style={{
              color: record.isSummary ? 'inherit' : '#1890ff',
              fontWeight: record.isSummary ? 'bold' : 'normal',
            }}
          >
            {displayText}
          </span>
        );
      },
    },
    {
      title: '项目总数',
      key: 'projectTotal',
      children: [
        {
          title: '个数',
          dataIndex: 'totalCount',
          key: 'totalCount',
          width: 100,
          sorter: (a: TreeNodeData, b: TreeNodeData) => (a.totalCount || 0) - (b.totalCount || 0),
          render: (text: number, record: TreeNodeData) =>
            record.isSummary ? (
              <strong>{text || 0}</strong>
            ) : (
              <span onClick={() => handleNumberClick(record, 'totalCount')}>{text || 0}</span>
            ),
        },
        {
          title: (
            <>
              计划总投资
              <br />
              （亿元）
            </>
          ),
          dataIndex: 'totalInvestment',
          key: 'totalInvestment',
          width: 150,
          sorter: (a: TreeNodeData, b: TreeNodeData) =>
            (a.totalInvestment || 0) - (b.totalInvestment || 0),
          render: (text: number, record: TreeNodeData) =>
            record.isSummary ? (
              <strong>{text ? (text / 10000).toFixed(2) : '0.00'}</strong>
            ) : text ? (
              (text / 10000).toFixed(2)
            ) : (
              '0.00'
            ),
        },
      ],
    },
    {
      title: '列统投资',
      key: 'listedInvestment',
      children: [
        {
          title: (
            <>
              本月列统投资
              <br />
              （亿元）
            </>
          ),
          dataIndex: 'monthStatisticalInvestment',
          key: 'monthStatisticalInvestment',
          width: 150,
          sorter: (a: TreeNodeData, b: TreeNodeData) =>
            (a.monthStatisticalInvestment || 0) - (b.monthStatisticalInvestment || 0),
          render: (text: number, record: TreeNodeData) =>
            record.isSummary ? (
              <strong>{text ? (text / 10000).toFixed(2) : '0.00'}</strong>
            ) : text ? (
              (text / 10000).toFixed(2)
            ) : (
              '0.00'
            ),
        },
        {
          title: (
            <>
              本年列统投资
              <br />
              （亿元）
            </>
          ),
          dataIndex: 'yearStatisticalInvestment',
          key: 'yearStatisticalInvestment',
          width: 150,
          sorter: (a: TreeNodeData, b: TreeNodeData) =>
            (a.yearStatisticalInvestment || 0) - (b.yearStatisticalInvestment || 0),
          render: (text: number, record: TreeNodeData) =>
            record.isSummary ? (
              <strong>{text ? (text / 10000).toFixed(2) : '0.00'}</strong>
            ) : text ? (
              (text / 10000).toFixed(2)
            ) : (
              '0.00'
            ),
        },
        {
          title: (
            <>
              累计列统投资
              <br />
              （亿元）
            </>
          ),
          dataIndex: 'totalStatisticalInvestment',
          key: 'totalStatisticalInvestment',
          width: 150,
          sorter: (a: TreeNodeData, b: TreeNodeData) =>
            (a.totalStatisticalInvestment || 0) - (b.totalStatisticalInvestment || 0),
          render: (text: number, record: TreeNodeData) =>
            record.isSummary ? (
              <strong>{text ? (text / 10000).toFixed(2) : '0.00'}</strong>
            ) : text ? (
              (text / 10000).toFixed(2)
            ) : (
              '0.00'
            ),
        },
      ],
    },
    {
      title: '新增入库项目',
      key: 'newDatabaseProjects',
      children: [
        {
          title: '本月新增入库',
          dataIndex: 'monthIncreasement',
          key: 'monthIncreasement',
          width: 120,
          sorter: (a: TreeNodeData, b: TreeNodeData) =>
            (a.monthIncreasement || 0) - (b.monthIncreasement || 0),
          render: (text: number, record: TreeNodeData) =>
            record.isSummary ? (
              <strong>{text || 0}</strong>
            ) : (
              <span onClick={() => handleNumberClick(record, 'monthIncreasement')}>
                {text || 0}
              </span>
            ),
        },
        {
          title: <>本年新增入库</>,
          dataIndex: 'yearIncreasement',
          key: 'yearIncreasement',
          width: 150,
          sorter: (a: TreeNodeData, b: TreeNodeData) =>
            (a.yearIncreasement || 0) - (b.yearIncreasement || 0),
          render: (text: number, record: TreeNodeData) =>
            record.isSummary ? (
              <div>{text || 0}</div>
            ) : (
              <span onClick={() => handleNumberClick(record, 'yearIncreasement')}>
                <div>{text || 0}</div>
              </span>
            ),
        },
        {
          title: (
            <>
              计划总投资
              <br />
              （亿元）
            </>
          ),
          dataIndex: 'yearInvestment',
          key: 'yearInvestment',
          width: 150,
          sorter: (a: TreeNodeData, b: TreeNodeData) =>
            (a.yearInvestment || 0) - (b.yearInvestment || 0),
          render: (text: number, record: TreeNodeData) =>
            record.isSummary ? (
              <strong>{text ? (text / 10000).toFixed(2) : '0.00'}</strong>
            ) : text ? (
              (text / 10000).toFixed(2)
            ) : (
              '0.00'
            ),
        },
      ],
    },
  ];

  // 树形结构通过expandable配置实现，不需要额外的treeConfig配置
  useEffect(() => {
    loadDivisionData();
  }, []);

  // 合并数据和合计行
  const tableData = summaryData ? [...dataSource, summaryData] : dataSource;

  // 获取图表数据 - 从树形结构中提取泰州市的children
  const getChartData = () => {
    if (dataSource.length > 0 && dataSource[0].children) {
      return dataSource[0].children;
    }
    return [];
  };

  const chartData = getChartData();

  const goBackHome = () => {
    navigate(`/tutorial`);
  };

  return (
    <div className={styles.investmentDetailPage}>
      <div className={styles.container}>
        <div className={styles.flexBetWeen}>
          <Button
            onClick={handleBack}
            className={styles.backButton}
          >
            <ArrowLeftOutlined /> 返回
          </Button>
          <Button className={styles.backButton} onClick={() => goBackHome()}>
            返回首页
          </Button>
        </div>

        <Breadcrumb className={styles.mb15} style={{ fontSize: '20px' }}>
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate('/tutorial')}><HomeOutlined style={{ marginRight: '10px', fontSize: '20px' }} /> 首页</a></Breadcrumb.Item>
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate('/tutorial/tou-zi-jin-du')}>投资进度</a></Breadcrumb.Item>
          <Breadcrumb.Item>入库投资</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>入库投资</h1>
        {/* <p className={styles.pageSubtitle}>{getCurrentYear()}年审批服务情况</p> */}

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
                keyProjectType: keyProjectType,
                startMoney: startMoney,
                endMoney: endMoney
              }}
            >
              <Row>
                <Form.Item<FieldType>
                  style={{ marginLeft: '20px' }}
                  label="所属月份"
                  name="rangeDate"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value || !value[0] || !value[1]) return Promise.reject(new Error('请选择月份范围'));
                        if (value[0].year() !== value[1].year()) return Promise.reject(new Error('不能跨越年份选择'));
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <ConfigProvider locale={zhCN}>
                    <RangePicker
                      picker="month"
                      format="YYYY-MM"
                      placeholder={['开始月份', '结束月份']}
                      style={{ marginRight: '20px' }}
                      value={rangeDate}
                      onChange={onChangeRangeDate}
                    />
                  </ConfigProvider>
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
                      // { value: -1, label: '自定义' },
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
                      <InputNumber addonAfter="亿元" defaultValue={0} onChange={(value) => setStartMoney(value || 0)} />
                    </Form.Item>
                    <div className={styles.middleText}>至</div>
                    <Form.Item<FieldType>
                      style={{
                        width: '110px',
                      }}
                      label=""
                      name="endMoney"
                    >
                      <InputNumber addonAfter="亿元" defaultValue={1} onChange={(value) => setEndMoney(value || 1)} />
                    </Form.Item>
                  </Row>
                ) : ''}
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                  }}
                  label="所属产业"
                  name="industry"
                >
                  <Select
                    style={{ width: 180 }}
                    placeholder="请选择产业"
                    options={[
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

        <div style={{ marginBottom: '20px' }}>
          <div className={styles.filterControls} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              className={[styles.chartBtn, currentView === 'echarts' ? styles.active : ''].join(' ')}
              data-view="echarts"
              onClick={() => handleViewChange('echarts')}
              style={{ marginRight: '10px' }}
            >
              图
            </Button>
            <Button
              className={[styles.chartBtn, currentView === 'table' ? styles.active : ''].join(' ')}
              data-view="table"
              onClick={() => handleViewChange('table')}
            >
              表
            </Button>
          </div>
        </div>

        {currentView === 'table' && (
          <div className={styles.projectsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>入库投资情况</div>
            </div>
            <Table
              className={styles.table}
              columns={columns}
              dataSource={tableData}
              pagination={false}
              size="middle"
              loading={loading}
              locale={{
                emptyText: '暂无数据',
                triggerDesc: '点击降序',
                triggerAsc: '点击升序',
                cancelSort: '取消排序',
              }}
              rowKey={(record) => record.key || record.district || 'default'}
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
        {currentView === 'echarts' &&(
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
                  <Progress1PieChart
                    data1={chartData}
                  />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartCardHeader}>
                  <h3 className={styles.chartCardTitle}>各市区投资额对比</h3>
                </div>
                <div className={styles.chartCardBody}>
                  <Progress1InvestmentBarChart
                    data1={chartData}
                  />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartCardHeader}>
                  <h3 className={styles.chartCardTitle}>各市区投资额趋势</h3>
                </div>
                <div className={styles.chartCardBody}>
                  <Progress1TrendChart
                    data1={chartData}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <p>企业全生命周期管理系统 © {getCurrentYear()} 版权所有</p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetail;
