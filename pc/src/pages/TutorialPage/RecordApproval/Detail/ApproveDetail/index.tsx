import { primeApi, systemApi } from '@/services/api';
import { FilingProjectStateTreeVo } from '@/services/apis';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, message, Table, Breadcrumb, Form, Row, Select, Space, ConfigProvider, DatePicker, InputNumber } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './index.module.css';
import zhCN from 'antd/locale/zh_CN';
import dayjs, { Dayjs } from 'dayjs';
import * as echarts from 'echarts';

const { RangePicker } = DatePicker;

// 表单字段类型定义
interface FieldType {
  rangeDate?: [Dayjs, Dayjs];
  money?: number;
  industry?: string;
  startMoney?: number;
  endMoney?: number;
  keyProjectType?: string;
}

// 树形数据接口类型
interface TreeNodeData {
  district?: string;
  park?: string;
  children?: TreeNodeData[];
  // 本月新增
  monthlyNewCount?: number;
  monthlyNewInvestment?: number;
  // 本年累计
  yearlyAccumulatedCount?: number;
  yearlyAccumulatedInvestment?: number;
  // 内资项目
  domesticProjectCount?: number;
  domesticInvestment?: number;
  // 外资项目
  foreignProjectCount?: number;
  foreignInvestment?: number;
  districtName?: string;
  parkName?: string;
  key: React.Key;
  isSummary?: boolean;
}

// 从 URL 或默认 2025年10月 解析查询月份范围（同月即单月）
const getDefaultRangeFromUrl = (searchParams: URLSearchParams): [Dayjs, Dayjs] => {
  const y = searchParams.get('year');
  const m = searchParams.get('month');
  if (y && m) {
    const year = parseInt(y, 10);
    const month = parseInt(m, 10);
    if (!isNaN(year) && !isNaN(month)) {
      const d = dayjs(`${year}-${String(month).padStart(2, '0')}-01`);
      return [d, d];
    }
  }
  const d = dayjs('2025-10-01');
  return [d, d];
};

// 饼图组件 - 项目数量及占比
const ProjectCountPieChart = (e: { data1: any }) => {
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
                value: item.yearlyAccumulatedCount || 0,
              }))
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

// 柱状图组件 - 内外资项目对比
const DomesticForeignChart = (e: { data1: any }) => {
  const { data1 } = e;
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const colors = ['#5470c6', '#8A7AF7'];
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
        data: ['内资项目', '外资项目'],
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
            interval: 0,
            fontSize: 10,
          },
          data: data1.length > 0
            ? data1.map((item: any) => {
                const district = item.districtName || item.district || '未知';
                return district === '医药高新区（高港区）' ? '医药高新区' : district;
              })
            : [],
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
            formatter: function (value: any) {
              return value;
            },
          },
        },
      ],
      series: [
        {
          name: '内资项目',
          type: 'bar',
          data: data1.length > 0
            ? data1.map((item: any) => item.domesticProjectCount || 0)
            : [],
        },
        {
          name: '外资项目',
          type: 'bar',
          data: data1.length > 0
            ? data1.map((item: any) => item.foreignProjectCount || 0)
            : [],
        },
      ],
    };
    chart.setOption(option);
    return () => chart.dispose();
  }, [JSON.stringify(e)]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%', marginTop: '0.2rem' }}></div>;
};

// 折线图组件 - 投资额趋势
const InvestmentTrendChart = (e: { data1: any }) => {
  const { data1 } = e;
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const colors = ['#427efc', '#957afd', '#01C892'];
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
        data: ['当月新增投资', '本年累计投资', '内资投资'],
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
            interval: 0,
            fontSize: 10,
          },
          data: data1.length > 0
            ? data1.map((item: any) => {
                const district = item.districtName || item.district || '未知';
                return district === '医药高新区（高港区）' ? '医药高新区' : district;
              })
            : [],
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '投资额（亿元）',
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
          name: '当月新增投资',
          type: 'line',
          data: data1.length > 0
            ? data1.map((item: any) => ((item.monthlyNewInvestment || 0) / 10000).toFixed(2))
            : [],
        },
        {
          name: '本年累计投资',
          type: 'line',
          data: data1.length > 0
            ? data1.map((item: any) => ((item.yearlyAccumulatedInvestment || 0) / 10000).toFixed(2))
            : [],
        },
        {
          name: '内资投资',
          type: 'line',
          data: data1.length > 0
            ? data1.map((item: any) => ((item.domesticInvestment || 0) / 10000).toFixed(2))
            : [],
        },
      ],
    };
    chart.setOption(option);
    return () => chart.dispose();
  }, [JSON.stringify(e)]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%', marginTop: '0.2rem' }}></div>;
};

const InvestmentDetail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dataSource, setDataSource] = useState<TreeNodeData[]>([]);
  const [summaryData, setSummaryData] = useState<TreeNodeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('table');

  // 存储展开的节点key
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 查询条件状态：月份范围（不能跨年），从 URL 或默认 2025年10月
  const [industry, setIndustry] = useState<string>('');
  const [rangeDate, setRangeDate] = useState<[Dayjs, Dayjs]>(() => getDefaultRangeFromUrl(searchParams));
  // 表格标题用：仅在一次查询/重置后更新，不在选择器变化时更新
  const [displayRangeDate, setDisplayRangeDate] = useState<[Dayjs, Dayjs]>(() => getDefaultRangeFromUrl(searchParams));
  const [money, setMoney] = useState<number>(0);
  const [startMoney, setStartMoney] = useState<number>(0);
  const [endMoney, setEndMoney] = useState<number>(1);
  const [showMoneyInput, setShowMoneyInput] = useState<boolean>(false);
  const [allowedAreas, setAllowedAreas] = useState<string[]>([]);
  const [hasCityPermission, setHasCityPermission] = useState<boolean>(false);
  const [keyProjectType, setKeyProjectType] = useState<string>('全部'); // 重点项目选择：全部、市重点、省重大，不参与传参

  const [form] = Form.useForm();

  const fetchUserAreaPermissions = async () => {
    try {
      const [level3Response, level2Response] = await Promise.all([
        systemApi.getActiveAreaGrantsRaw({ level: [3] }),
        systemApi.getActiveAreaGrantsRaw({ level: [2] }),
      ]);
      const level3Data = await level3Response.value();
      const level2Data = await level2Response.value();
      const areaNames = (level3Data?.areas || [])
        .map((area) => area?.name)
        .filter((name): name is string => !!name);
      setAllowedAreas(areaNames);
      const hasTaizhou = (level2Data?.areas || []).some((area) => area?.name === '泰州市');
      setHasCityPermission(hasTaizhou);
    } catch (error) {
      console.error('获取用户权限失败:', error);
      setAllowedAreas([]);
      setHasCityPermission(false);
    }
  };

  // 获取审批数据（直接获取树形结构数据），startDate/endDate 为日期范围；end 传月尾日期
  // 使用 UTC 构造 Date，避免 toISOString() 因时区把“11-01”变成“10-31”
  const fetchApprovalData = async (startDate: Dayjs, endDate: Dayjs, projectType?: number, minAmount?: number, maxAmount?: number) => {
    setLoading(true);
    try {
      const startUtc = new Date(Date.UTC(startDate.year(), startDate.month(), startDate.date()));
      const endOfMonth = endDate.endOf('month');
      const endUtc = new Date(Date.UTC(endOfMonth.year(), endOfMonth.month(), endOfMonth.date()));
      const response = await primeApi.getFilingProjects({
        start: startUtc,
        end: endUtc,
        projectType: projectType?.toString(),
        minAmount,
        maxAmount
      });

      const transformData = (item: FilingProjectStateTreeVo, parentKey: string = '', index: number = 0): TreeNodeData => {
        const key = parentKey ? `${parentKey}-${index}` : 'root';
        return {
          key,
          district: item.district,
          park: item.park,
          districtName: item.district,
          parkName: item.park,
          monthlyNewCount: item.increasement?.count,
          monthlyNewInvestment: item.increasement?.amount,
          yearlyAccumulatedCount: item.accumulation?.count,
          yearlyAccumulatedInvestment: item.accumulation?.amount,
          domesticProjectCount: item.domestic?.count,
          domesticInvestment: item.domestic?.amount,
          foreignProjectCount: item.foreign?.count,
          foreignInvestment: item.foreign?.amount,
          children: item.children ? item.children.map((child, childIndex) =>
            transformData(child, key, childIndex)
          ) : undefined
        };
      };

      const responseWithKeys = transformData(response);
      setDataSource([responseWithKeys]);

      const getFirstLevelKeys = (data: any): React.Key[] => {
        const keys: React.Key[] = [];
        if (data.key) {
          keys.push(data.key);
        }
        return keys;
      };

      setExpandedKeys(getFirstLevelKeys(responseWithKeys));
    } catch (error) {
      console.error('获取审批数据失败:', error);
      message.error('获取审批数据失败');
      setDataSource([]);
      setSummaryData(null);
    } finally {
      setLoading(false);
    }
  };

  // 请求审批数据
  const loadDivisionData = async () => {
    const [startMonth, endMonth] = rangeDate;

    let minAmount: number | undefined;
    let maxAmount: number | undefined;

    if (money === -1) {
      minAmount = startMoney * 10000;
      maxAmount = endMoney * 10000;
    } else if (money === 1) {
      minAmount = 10000;
      maxAmount = 50000;
    } else if (money === 5) {
      minAmount = 50000;
      maxAmount = 100000;
    } else if (money === 10) {
      minAmount = 100000;
      maxAmount = undefined;
    }

    const projectType = industry ? parseInt(industry) : undefined;

    await fetchApprovalData(startMonth, endMonth, projectType, minAmount, maxAmount);
  };

  const handleBack = () => {
    navigate('/tutorial/record-approval');
  };

  // 处理视图切换
  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const canAccessRecord = (record: TreeNodeData) => {
    if (!record) return false;
    if (hasCityPermission) return true;
    if (record.isSummary) return false;
    if (!allowedAreas || allowedAreas.length === 0) return false;
    const districtName = record.districtName || record.district || '';
    const parkName = record.parkName || record.park || '';
    return allowedAreas.includes(districtName) || allowedAreas.includes(parkName);
  };

  // 处理数量字段点击事件
  const handleNumberClick = (record: TreeNodeData, fieldName: string) => {
    if (!canAccessRecord(record)) {
      message.warning('当前账户无权限查看该区域数据');
      return;
    }
    const params = new URLSearchParams();

    // 添加基础参数
    // 当district为"泰州市"时不传递district参数
    if (record.district && record.district !== '泰州市') {
      params.set('district', record.district);
    }
    if (record.park) {
      params.set('park', record.park);
    }

    // 年份、月份（用范围结束月）
    const endMonth = rangeDate[1];
    const year = endMonth.year();
    params.set('year', year.toString());
    const month = endMonth.month() + 1;
    const startForYearToDate =
      fieldName === 'yearlyAccumulatedCount' ||
      fieldName === 'domesticProjectCount' ||
      fieldName === 'foreignProjectCount';
    params.set(
      'start',
      startForYearToDate ? `${year}-01-01` : rangeDate[0].format('YYYY-MM-DD'),
    );
    params.set('end', endMonth.endOf('month').format('YYYY-MM-DD'));

    // 根据字段名确定参数
    if (fieldName === 'monthlyNewCount') {
      // 9月新增个数：传year和month
      params.set('month', month.toString());
    } else if (fieldName === 'yearlyAccumulatedCount') {
      // 本年累计：只传year
      // month参数不设置
    } else if (fieldName === 'domesticProjectCount') {
      // 内资项目：传year, isInvestment=true（不传month）
      params.set('isInvestment', 'true');
    } else if (fieldName === 'foreignProjectCount') {
      // 外资项目：传year, isInvestment=false（不传month）
      params.set('isInvestment', 'false');
    }

    // 传递查询模块的参数（金额范围和行业）
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

    // 行业类型
    if (industry) {
      params.set('projectType', industry);
    }

    // 添加来源标识
    params.set('from', 'approve');

    // 跳转到ApproveDetailAdvance2页面
    navigate(`/tutorial/record-approval/detail/approve-detail-advance2?${params.toString()}`);
  };

  // 处理金额范围选择变化
  const handleChangeSelect = (value: number) => {
    setMoney(value);
    setShowMoneyInput(value === -1);
  };

  const handleChangeKeyProjectType = (newValue: string) => {
    setKeyProjectType(newValue);
  };

  // 月份范围变化，禁止跨年，并同步到表单以便查询时能拿到最新值
  const onChangeRangeDate = (dates: null | [Dayjs | null, Dayjs | null]) => {
    if (!dates || !dates[0]) {
      return;
    }
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

  // 表单提交处理
  const onFinish = (values: FieldType) => {
    console.log('查询条件:', values);
    setKeyProjectType(values.keyProjectType ?? '全部');

    // 重点项目选择：市重点、省重大 不参与传参，数据展示为 0，需点击查询生效
    if (values.keyProjectType === '市重点' || values.keyProjectType === '省重大') {
      setDataSource([]);
      setSummaryData(null);
      return;
    }

    const newIndustry = values.industry || '';
    const newMoney = values.money !== undefined ? values.money : 0;
    const newRange = values.rangeDate && values.rangeDate[0] && values.rangeDate[1]
      ? values.rangeDate as [Dayjs, Dayjs]
      : rangeDate;
    const newStartMoney = values.startMoney !== undefined ? values.startMoney : 0;
    const newEndMoney = values.endMoney !== undefined ? values.endMoney : 1;

    if (newRange[0].year() !== newRange[1].year()) {
      message.warning('不能跨越年份选择');
      return;
    }

    setIndustry(newIndustry);
    setMoney(newMoney);
    setRangeDate(newRange);
    setDisplayRangeDate(newRange);
    setStartMoney(newStartMoney);
    setEndMoney(newEndMoney);

    let minAmount: number | undefined;
    let maxAmount: number | undefined;

    if (newMoney === -1) {
      minAmount = newStartMoney * 10000;
      maxAmount = newEndMoney * 10000;
    } else if (newMoney === 1) {
      minAmount = 10000;
      maxAmount = 50000;
    } else if (newMoney === 5) {
      minAmount = 50000;
      maxAmount = 100000;
    } else if (newMoney === 10) {
      minAmount = 100000;
      maxAmount = undefined;
    }

    const projectType = newIndustry ? parseInt(newIndustry) : undefined;

    fetchApprovalData(newRange[0], newRange[1], projectType, minAmount, maxAmount);
  };

  // 重置表单：恢复为与页面默认一致的月份范围（同 getDefaultRangeFromUrl，默认 2025-10）
  const onReset = () => {
    const resetRange = getDefaultRangeFromUrl(searchParams);

    setIndustry('');
    setMoney(0);
    setRangeDate(resetRange);
    setDisplayRangeDate(resetRange);
    setStartMoney(0);
    setEndMoney(1);
    setShowMoneyInput(false);
    setKeyProjectType('全部');

    form.setFieldsValue({
      rangeDate: resetRange,
      money: 0,
      industry: '',
      keyProjectType: '全部',
      startMoney: 0,
      endMoney: 1
    });

    fetchApprovalData(resetRange[0], resetRange[1], undefined, undefined, undefined);
  };

  // 表格列配置
  const columns = [
    {
      title: '市（区）',
      dataIndex: 'districtName',
      key: 'districtName',
      width: 220,
      ellipsis: true,
      render: (text: string, record: TreeNodeData) => {
        return (
          <span
            style={{
              color: record.isSummary ? 'inherit' : '#1890ff',
              fontWeight: record.isSummary ? 'bold' : 'normal',
            }}
          >
            {text || '--'}
          </span>
        );
      },
    },
      // {
      //   title: '园区',
      //   dataIndex: 'parkName',
      //   key: 'parkName',
      //   width: 150,
      //   ellipsis: true,
      //   render: (text: string, record: TreeNodeData) => {
      //     return (
      //       <span
      //         style={{
      //           color: record.isSummary ? 'inherit' : '#1890ff',
      //           fontWeight: record.isSummary ? 'bold' : 'normal',
      //         }}
      //       >
      //         {text || '--'}
      //       </span>
      //     );
      //   },
      // },
    {
      title: displayRangeDate[0].month() + 1 === displayRangeDate[1].month() + 1
        ? `${displayRangeDate[0].month() + 1}月新增`
        : `${displayRangeDate[0].month() + 1}月-${displayRangeDate[1].month() + 1}月新增`,
      key: 'monthlyNew',
      children: [
        {
          title: '个数',
          dataIndex: 'monthlyNewCount',
          key: 'monthlyNewCount',
          width: 100,
          sorter: (a: TreeNodeData, b: TreeNodeData) =>
            (a.monthlyNewCount || 0) - (b.monthlyNewCount || 0),
          render: (text: number, record: TreeNodeData) => {
            const value = text || 0;
            if (!canAccessRecord(record)) {
              return (
                <span
                  style={{
                    color: '#999',
                    cursor: 'not-allowed',
                    fontWeight: record.isSummary ? 'bold' : 'normal',
                  }}
                >
                  {value}
                </span>
              );
            }
            return (
              <span
                className={styles.highlightNumber}
                style={record.isSummary ? { fontWeight: 'bold' } : undefined}
                onClick={() => handleNumberClick(record, 'monthlyNewCount')}
              >
                {value}
              </span>
            );
          },
        },
        {
          title: (
            <>
              备案
              <br />
              投资额
              <br />
              （亿元）
            </>
          ),
          dataIndex: 'monthlyNewInvestment',
          key: 'monthlyNewInvestment',
          width: 150,
          sorter: (a: TreeNodeData, b: TreeNodeData) =>
            (a.monthlyNewInvestment || 0) - (b.monthlyNewInvestment || 0),
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
      title: '本年累计',
      key: 'yearlyAccumulated',
      children: [
        {
          title: '个数',
          dataIndex: 'yearlyAccumulatedCount',
          key: 'yearlyAccumulatedCount',
          width: 100,
          sorter: (a: TreeNodeData, b: TreeNodeData) =>
            (a.yearlyAccumulatedCount || 0) - (b.yearlyAccumulatedCount || 0),
          render: (text: number, record: TreeNodeData) => {
            const value = text || 0;
            if (!canAccessRecord(record)) {
              return (
                <span
                  style={{
                    color: '#999',
                    cursor: 'not-allowed',
                    fontWeight: record.isSummary ? 'bold' : 'normal',
                  }}
                >
                  {value}
                </span>
              );
            }
            return (
              <span
                className={styles.highlightNumber}
                style={record.isSummary ? { fontWeight: 'bold' } : undefined}
                onClick={() => handleNumberClick(record, 'yearlyAccumulatedCount')}
              >
                {value}
              </span>
            );
          },
        },
        {
          title: (
            <>
              备案
              <br />
              投资额
              <br />
              （亿元）
            </>
          ),
          dataIndex: 'yearlyAccumulatedInvestment',
          key: 'yearlyAccumulatedInvestment',
          width: 150,
          sorter: (a: TreeNodeData, b: TreeNodeData) =>
            (a.yearlyAccumulatedInvestment || 0) - (b.yearlyAccumulatedInvestment || 0),
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
      title: '内资项目',
      key: 'domesticProjects',
      children: [
        {
          title: '个数',
          dataIndex: 'domesticProjectCount',
          key: 'domesticProjectCount',
          width: 100,
          render: (text: number, record: TreeNodeData) => {
            const value = text || 0;
            if (!canAccessRecord(record)) {
              return (
                <span
                  style={{
                    color: '#999',
                    cursor: 'not-allowed',
                    fontWeight: record.isSummary ? 'bold' : 'normal',
                  }}
                >
                  {value}
                </span>
              );
            }
            return (
              <span
                className={styles.highlightNumber}
                style={record.isSummary ? { fontWeight: 'bold' } : undefined}
                onClick={() => handleNumberClick(record, 'domesticProjectCount')}
              >
                {value}
              </span>
            );
          },
        },
        {
          title: (
            <>
              备案
              <br />
              投资额
              <br />
              （亿元）
            </>
          ),
          dataIndex: 'domesticInvestment',
          key: 'domesticInvestment',
          width: 150,
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
      title: '外资项目',
      key: 'foreignProjects',
      children: [
        {
          title: '个数',
          dataIndex: 'foreignProjectCount',
          key: 'foreignProjectCount',
          width: 100,
          render: (text: number, record: TreeNodeData) => {
            const value = text || 0;
            if (!canAccessRecord(record)) {
              return (
                <span
                  style={{
                    color: '#999',
                    cursor: 'not-allowed',
                    fontWeight: record.isSummary ? 'bold' : 'normal',
                  }}
                >
                  {value}
                </span>
              );
            }
            return (
              <span
                className={styles.highlightNumber}
                style={record.isSummary ? { fontWeight: 'bold' } : undefined}
                onClick={() => handleNumberClick(record, 'foreignProjectCount')}
              >
                {value}
              </span>
            );
          },
        },
        {
          title: (
            <>
              备案
              <br />
              投资额
              <br />
              （亿元）
            </>
          ),
          dataIndex: 'foreignInvestment',
          key: 'foreignInvestment',
          width: 150,
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
    fetchUserAreaPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 树形结构通过expandable配置实现，不需要额外的treeConfig配置
  useEffect(() => {
    // 加载当前月份的数据
    loadDivisionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const goBackHome = () => {
    navigate(`/tutorial`);
  };

  const chartData = getChartData();

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
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-2)}><HomeOutlined style={{ marginRight: '10px', fontSize: '20px' }} /> 首页</a></Breadcrumb.Item>
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate('/tutorial/record-approval')}>备案审批</a></Breadcrumb.Item>
          <Breadcrumb.Item>新备案项目</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>新备案项目</h1>
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
                keyProjectType: '全部',
                startMoney: startMoney,
                endMoney: endMoney
              }}
            >
              <Row>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                  }}
                  label="所属月份"
                  name="rangeDate"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value || !value[0] || !value[1]) {
                          return Promise.reject(new Error('请选择月份范围'));
                        }
                        if (value[0].year() !== value[1].year()) {
                          return Promise.reject(new Error('不能跨越年份选择'));
                        }
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
                      { value: -1, label: '自定义' },
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
                  label="所属行业"
                  name="industry"
                >
                  <Select
                    style={{ width: 120 }}
                    options={[
                      { value: '', label: '全部' },
                      { value: '2', label: '服务业' },
                      { value: '1', label: '制造业' }
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
              <div className={styles.tableTitle}>新备案项目情况</div>
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
              scroll={{x: '100%' }}
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
                  <ProjectCountPieChart
                    data1={chartData}
                  />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartCardHeader}>
                  <h3 className={styles.chartCardTitle}>各市区内外资项目</h3>
                </div>
                <div className={styles.chartCardBody}>
                  <DomesticForeignChart
                    data1={chartData}
                  />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartCardHeader}>
                  <h3 className={styles.chartCardTitle}>各市区投资额趋势</h3>
                </div>
                <div className={styles.chartCardBody}>
                  <InvestmentTrendChart
                    data1={chartData}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <div className={styles.footer}>
          <p>企业全生命周期管理系统 © {getCurrentYear()} 版权所有</p>
        </div> */}
      </div>
    </div>
  );
};

export default InvestmentDetail;
