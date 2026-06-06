import { primeApi, systemApi } from '@/services/api';
import { CountSignedProjTypeByLevelRequest } from '@/services/apis';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, DatePicker, Form, Input, message, Row, Select, Space, Table,} from 'antd';
import dayjs from 'dayjs';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import 'dayjs/locale/zh-cn';

const { RangePicker } = DatePicker;
import * as echarts from 'echarts';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

dayjs.locale('zh-cn');

type FieldType = {
  startDate?: string;
  endDate?: string;
  money?: number;
  rangeDate?: any;
  rmb1?: number;
  rmb2?: number;
  doller1?: number;
  doller2?: number;
  keyProjectType?: string;
};

const FourfoldProject: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [endDate, setEndDate] = useState(dayjs());
  const [rangeDate, setRangeDate] = useState([dayjs().startOf('year'), dayjs()]);

  // 数据源
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 从路由参数获取金额范围，默认为0（全部）
  const getMoneyFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const moneyParam = urlParams.get('money');
    if (moneyParam) {
      const moneyValue = parseInt(moneyParam);
      return [1, 5, 10].includes(moneyValue) ? moneyValue : 0;
    }
    return 0; // 默认全部
  };

  const getKeyProjectTypeFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const v = urlParams.get('keyProjectType') || urlParams.get('isMainProj');
    return v === '市重点' || v === '省重大' ? v : '全部';
  };

  const [money, setMoney] = useState<number | string>(getMoneyFromUrl());
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [keyProjectType, setKeyProjectType] = useState<string>(() => getKeyProjectTypeFromUrl());

  // 图表引用
  const barChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const lineChartRef = useRef<HTMLDivElement>(null);

  // 视图切换状态
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  // 权限相关 state：控制数字是否可以点击
  const [hasLevel2Permission, setHasLevel2Permission] = useState<boolean>(false);

  // 统一规范化接口返回为数组（兼容字符串/records/数组）
  const normalizeApiRecords = (response: any): any[] => {
    let data = response;
    try {
      if (typeof response === 'string') {
        data = JSON.parse(response);
      }
    } catch (e) {
      console.error('JSON 解析失败:', e);
      return [];
    }
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.records)) return data.records;
    return [];
  };

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/');
  };

  const onChangeDate3 = (newValue: any) => {
    console.log('newValue---date---', newValue);
    setStartDate(dayjs(newValue[0]));
    setEndDate(dayjs(newValue[1]));
    setRangeDate([dayjs(newValue[0]), dayjs(newValue[1])]);
  };

  // 获取签约项目类型统计数据
  const fetchSignedProjTypeData = async (params: CountSignedProjTypeByLevelRequest) => {
    try {
      setLoading(true);
      const response = await primeApi.countSignedProjTypeByLevel(params);
      const data = normalizeApiRecords(response);
      setDataSource(data);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取柱状图数据 - 产业链投资分布 (level=2)
  const fetchBarChartData = async (params: CountSignedProjTypeByLevelRequest) => {
    try {
      const barParams = { ...params, level: 2 };
      const response = await primeApi.countSignedProjTypeByLevel(barParams);
      const data = normalizeApiRecords(response);
      setBarChartData(data);
    } catch (error) {
      console.error('获取柱状图数据失败:', error);
      message.error('获取柱状图数据失败');
    }
  };

  const handleChangeSelect = (newValue: any) => {
    setMoney(newValue);
    // 当选择"自定义"时显示输入框，否则隐藏
    setShowCustomRange(newValue === 'custom');
  };

  const handleChangeKeyProjectType = (newValue: string) => {
    setKeyProjectType(newValue);
  };

  // 表单提交处理
  const onFinish = (values: FieldType) => {
    console.log('查询条件:', values, dayjs(startDate).format('YYYY-MM-DD'), dayjs(endDate).format('YYYY-MM-DD'));
    console.log('当前 money 状态:', money);
    console.log('表单值 rmb1:', values.rmb1, '类型:', typeof values.rmb1);
    console.log('表单值 rmb2:', values.rmb2, '类型:', typeof values.rmb2);

    setMonth(dayjs(endDate).month() + 1);
    const kp = values.keyProjectType ?? '全部';
    setKeyProjectType(kp);
    const isMainProj = kp === '市重点' || kp === '省重大' ? kp : undefined;

    // 构建基础参数
    const params: any = {
      level: 3,
      currStartDate: dayjs(startDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      ...(isMainProj ? { isMainProj } : {}),
    };

    // 如果选择了自定义，则传递 rmb1、rmb2、doller1、doller2，不传递 rmb
    if (money === 'custom') {
      // 获取表单中的实际值
      const formValues = form.getFieldsValue();
      console.log('表单所有值:', formValues);

      if (formValues.rmb1 !== undefined && formValues.rmb1 !== null && formValues.rmb1 !== '') {
        params.rmb1 = Number(formValues.rmb1);
        params.doller1 = Math.floor((Number(formValues.rmb1) * 10000) / 7.2);
      }
      if (formValues.rmb2 !== undefined && formValues.rmb2 !== null && formValues.rmb2 !== '') {
        params.rmb2 = Number(formValues.rmb2);
        params.doller2 = Math.floor((Number(formValues.rmb2) * 10000) / 7.2);
      }
      console.log('自定义金额范围参数:', params);
    } else if (money === 'below_0.5') {
      // 5千万元以下：rmb1: 0, rmb2: 0.5
      params.rmb1 = 0;
      params.rmb2 = 0.5;
      params.doller1 = 0;
      params.doller2 = Math.floor((0.5 * 10000) / 7.2);
    } else if (money === '0.5_to_1') {
      // 5千万元-1亿元：rmb1: 0.5, rmb2: 1
      params.rmb1 = 0.5;
      params.rmb2 = 1;
      params.doller1 = Math.floor((0.5 * 10000) / 7.2);
      params.doller2 = Math.floor((1 * 10000) / 7.2);
    } else {
      // 非自定义选择时，传递 rmb 参数
      params.rmb = money === 0 ? undefined : money;
    }

    console.log('最终传递给接口的参数:', params);
    fetchSignedProjTypeData(params);
    fetchBarChartData(params); // 同时获取柱状图数据
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();

    const startOfYear = dayjs().startOf('year');
    const endOfCurrentMonth = dayjs().endOf('month');

    setStartDate(startOfYear);
    setEndDate(endOfCurrentMonth);
    setRangeDate([startOfYear, endOfCurrentMonth]);
    setMonth(dayjs().month() + 1);
    setMoney(0); // 选择“全部”
    setShowCustomRange(false); // 重置时隐藏自定义输入框
    setKeyProjectType('全部');

    form.setFieldsValue({
      rangeDate: [startOfYear, endOfCurrentMonth],
      money: 0, // 金额范围选择“全部”
      keyProjectType: '全部',
      rmb1: undefined,
      rmb2: undefined,
      doller1: undefined,
      doller2: undefined,
    });

    // 构造“全部”范围的查询参数（不传 rmb），重置时恢复数据
    const params = {
      level: 3,
      currStartDate: startOfYear.startOf('month').format('YYYY-MM-DD'),
      currEndDate: endOfCurrentMonth.endOf('month').format('YYYY-MM-DD'),
      currDate: endOfCurrentMonth.startOf('month').format('YYYY-MM-DD'),
    };

    fetchSignedProjTypeData(params);
    fetchBarChartData(params); // 同时获取柱状图数据
  };

  // 获取用户权限 - 查询 level=2
  const fetchUserAreaPermissions = async () => {
    try {
      const level2Data = await systemApi.getActiveAreaGrants({ level: [2] });
      const level2Areas = level2Data?.areas || [];

      // 如果 level=2 的 areas 中有数据，则数字可以点击
      if (level2Areas.length > 0) {
        setHasLevel2Permission(true);
      } else {
        setHasLevel2Permission(false);
      }
    } catch (error) {
      // 权限查询失败时，不允许点击
      setHasLevel2Permission(false);
    }
  };

  // 处理单元格点击事件
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCellClick = (record: any, columnKey: string, columnTitle?: string) => {
    // 如果没有权限，不允许点击
    if (!hasLevel2Permission) {
      message.warning('当前账户无权限查看该数据');
      return;
    }

    // 构建跳转参数（默认使用所选范围）
    let currStart = dayjs(startDate).startOf('month');
    let currEnd = dayjs(endDate).endOf('month');

    // 点击“本月新增”时，限定为当前月一号到当前月最后一天
    if (columnKey === 'monthNum') {
      currStart = dayjs(endDate).startOf('month');
      currEnd = dayjs(endDate).endOf('month');
    }

    const queryParams = new URLSearchParams({
      year: dayjs(endDate).year().toString(),
      currStartDate: currStart.format('YYYY-MM-DD'),
      currEndDate: currEnd.format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      showAll: 'true',
      page: '1',
      pageSize: '10'
    });

    // 市区参数
    if (columnKey.includes('jjs')) {
      queryParams.set('district', '321282000000');
    } else if (columnKey.includes('txs')) {
      queryParams.set('district', '321283000000');
    } else if (columnKey.includes('xhs')) {
      queryParams.set('district', '321281000000');
    } else if (columnKey.includes('hlq')) {
      queryParams.set('district', '321202000000');
    } else if (columnKey.includes('jyq')) {
      queryParams.set('district', '321204000000');
    } else if (columnKey.includes('yygxq')) {
      queryParams.set('district', '321203000000');
    }
    queryParams.set('fromPage', '/tutorial/preinvestment/fourfold');
    queryParams.set('isIndustryChainProject', 'true');
    // 重点产业链参数
    if (record.name) {
      const categoryName = record.name === '生物医药' ? '医药' : record.name;
      queryParams.set('projectCategory', categoryName);
    }
    // 金额范围参数
    if (money === 'custom') {
      // 自定义金额范围时，传递 rmb1、rmb2、doller1、doller2 参数
      const formValues = form.getFieldsValue();
      if (formValues.rmb1 !== undefined && formValues.rmb1 !== null && formValues.rmb1 !== '') {
        queryParams.set('rmb1', formValues.rmb1.toString());
        queryParams.set('doller1', Math.floor((Number(formValues.rmb1) * 10000) / 7.2).toString());
      }
      if (formValues.rmb2 !== undefined && formValues.rmb2 !== null && formValues.rmb2 !== '') {
        queryParams.set('rmb2', formValues.rmb2.toString());
        queryParams.set('doller2', Math.floor((Number(formValues.rmb2) * 10000) / 7.2).toString());
      }
    } else if (money === 'below_0.5') {
      // 5千万元以下：rmb1: 0, rmb2: 0.5
      queryParams.set('rmb1', '0');
      queryParams.set('rmb2', '0.5');
      queryParams.set('doller1', '0');
      queryParams.set('doller2', Math.floor((0.5 * 10000) / 7.2).toString());
    } else if (money === '0.5_to_1') {
      // 5千万元-1亿元：rmb1: 0.5, rmb2: 1
      queryParams.set('rmb1', '0.5');
      queryParams.set('rmb2', '1');
      queryParams.set('doller1', Math.floor((0.5 * 10000) / 7.2).toString());
      queryParams.set('doller2', Math.floor((1 * 10000) / 7.2).toString());
    } else if (money) {
      // 非自定义时传递 investmentAmount 参数
      queryParams.set('investmentAmount', Number(money).toString());
    }
    // 跳转到项目管理页面
    window.open(`/tutorial/project-manage?${queryParams.toString()}`, '_blank');
  };

  // 定义表格列
  const columns = [
    {
      title: '重点产业链',
      dataIndex: 'name',
      key: 'name',
      className: styles.headerMain,
      width: 200,
      fixed: 'left' as const,
      align: 'center' as const,
    },
    {
      title: dayjs(startDate).format('YYYY年MM月') + '-' + dayjs(endDate).format('YYYY年MM月') + '累计',
      children: [
        {
          title: '个数',
          dataIndex: 'total',
          key: 'total',
          className: styles.headerCount,
          width: 80,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseInt(a.total) || 0) - (parseInt(b.total) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
          onCell: (record: any) => ({
            onClick: () => handleCellClick(record, 'total', dayjs(startDate).format('YYYY年MM月') + '-' + dayjs(endDate).format('YYYY年MM月') + '累计 - 个数'),
            style: {
              cursor: hasLevel2Permission ? 'pointer' : 'not-allowed',
              fontWeight: 700,
              color: hasLevel2Permission ? '#1a237e' : '#999',
              transition: 'color 0.3s ease'
            },
          }),
        },
        {
          title: (<span>投资额<br />(亿元)</span>),
          dataIndex: 'totalQyje',
          key: 'totalQyje',
          className: styles.headerAmount,
          width: 120,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseFloat(a.totalQyje) || 0) - (parseFloat(b.totalQyje) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
      ],
    },
    {
      title: month + '月新增',
      children: [
        {
          title: '个数',
          dataIndex: 'monthNum',
          key: 'monthNum',
          className: styles.headerCount,
          width: 80,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseInt(a.monthNum) || 0) - (parseInt(b.monthNum) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
          onCell: (record: any) => ({
            onClick: () => handleCellClick(record, 'monthNum', month + '月新增 - 个数'),
            style: {
              cursor: hasLevel2Permission ? 'pointer' : 'not-allowed',
              fontWeight: 700,
              color: hasLevel2Permission ? '#1a237e' : '#999',
              transition: 'color 0.3s ease'
            },
          }),
        },
        {
          title: (<span>投资额<br />(亿元)</span>),
          dataIndex: 'monthQyje',
          key: 'monthQyje',
          className: styles.headerAmount,
          width: 120,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseFloat(a.monthQyje) || 0) - (parseFloat(b.monthQyje) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
      ],
    },
    {
      title: '靖江市',
      children: [
        {
          title: '个数',
          dataIndex: 'jjsNum',
          key: 'jjsNum',
          className: styles.headerCount,
          width: 80,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseInt(a.jjsNum) || 0) - (parseInt(b.jjsNum) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
          onCell: (record: any) => ({
            onClick: () => handleCellClick(record, 'jjsNum', '靖江市 - 个数'),
            style: {
              cursor: hasLevel2Permission ? 'pointer' : 'not-allowed',
              fontWeight: 700,
              color: hasLevel2Permission ? '#1a237e' : '#999',
              transition: 'color 0.3s ease'
            },
          }),
        },
        {
          title: (<span>投资额<br />(亿元)</span>),
          dataIndex: 'jjsQyje',
          key: 'jjsQyje',
          className: styles.headerAmount,
          width: 120,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseFloat(a.jjsQyje) || 0) - (parseFloat(b.jjsQyje) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
      ],
    },
    {
      title: '泰兴市',
      children: [
        {
          title: '个数',
          dataIndex: 'txsNum',
          key: 'txsNum',
          className: styles.headerCount,
          width: 80,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseInt(a.txsNum) || 0) - (parseInt(b.txsNum) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
          onCell: (record: any) => ({
            onClick: () => handleCellClick(record, 'txsNum', '泰兴市 - 个数'),
            style: {
              cursor: hasLevel2Permission ? 'pointer' : 'not-allowed',
              fontWeight: 700,
              color: hasLevel2Permission ? '#1a237e' : '#999',
              transition: 'color 0.3s ease'
            },
          }),
        },
        {
          title: (<span>投资额<br />(亿元)</span>),
          dataIndex: 'txsQyje',
          key: 'txsQyje',
          className: styles.headerAmount,
          width: 120,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseFloat(a.txsQyje) || 0) - (parseFloat(b.txsQyje) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
      ],
    },
    {
      title: '兴化市',
      children: [
        {
          title: '个数',
          dataIndex: 'xhsNum',
          key: 'xhsNum',
          className: styles.headerCount,
          width: 80,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseInt(a.xhsNum) || 0) - (parseInt(b.xhsNum) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
          onCell: (record: any) => ({
            onClick: () => handleCellClick(record, 'xhsNum', '兴化市 - 个数'),
            style: {
              cursor: hasLevel2Permission ? 'pointer' : 'not-allowed',
              fontWeight: 700,
              color: hasLevel2Permission ? '#1a237e' : '#999',
              transition: 'color 0.3s ease'
            },
          }),
        },
        {
          title: (<span>投资额<br />(亿元)</span>),
          dataIndex: 'xhsQyje',
          key: 'xhsQyje',
          className: styles.headerAmount,
          width: 120,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseFloat(a.xhsQyje) || 0) - (parseFloat(b.xhsQyje) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
      ],
    },
    {
      title: '海陵区',
      children: [
        {
          title: '个数',
          dataIndex: 'hlqNum',
          key: 'hlqNum',
          className: styles.headerCount,
          width: 80,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseInt(a.hlqNum) || 0) - (parseInt(b.hlqNum) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
          onCell: (record: any) => ({
            onClick: () => handleCellClick(record, 'hlqNum', '海陵区 - 个数'),
            style: {
              cursor: hasLevel2Permission ? 'pointer' : 'not-allowed',
              fontWeight: 700,
              color: hasLevel2Permission ? '#1a237e' : '#999',
              transition: 'color 0.3s ease'
            },
          }),
        },
        {
          title: (<span>投资额<br />(亿元)</span>),
          dataIndex: 'hlqQyje',
          key: 'hlqQyje',
          className: styles.headerAmount,
          width: 120,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseFloat(a.hlqQyje) || 0) - (parseFloat(b.hlqQyje) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
      ],
    },
    {
      title: '姜堰区',
      children: [
        {
          title: '个数',
          dataIndex: 'jyqNum',
          key: 'jyqNum',
          className: styles.headerCount,
          width: 80,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseInt(a.jyqNum) || 0) - (parseInt(b.jyqNum) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
          onCell: (record: any) => ({
            onClick: () => handleCellClick(record, 'jyqNum', '姜堰区 - 个数'),
            style: {
              cursor: hasLevel2Permission ? 'pointer' : 'not-allowed',
              fontWeight: 700,
              color: hasLevel2Permission ? '#1a237e' : '#999',
              transition: 'color 0.3s ease'
            },
          }),
        },
        {
          title: (<span>投资额<br />(亿元)</span>),
          dataIndex: 'jyqQyje',
          key: 'jyqQyje',
          className: styles.headerAmount,
          width: 120,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseFloat(a.jyqQyje) || 0) - (parseFloat(b.jyqQyje) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,

        },
      ],
    },
    {
      title: '医药高新区(高港区)',
      children: [
        {
          title: '个数',
          dataIndex: 'yygxqNum',
          key: 'yygxqNum',
          className: styles.headerCount,
          width: 80,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseInt(a.yygxqNum) || 0) - (parseInt(b.yygxqNum) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
          onCell: (record: any) => ({
            onClick: () => handleCellClick(record, 'yygxqNum', '医药高新区(高港区) - 个数'),
            style: {
              cursor: hasLevel2Permission ? 'pointer' : 'not-allowed',
              fontWeight: 700,
              color: hasLevel2Permission ? '#1a237e' : '#999',
              transition: 'color 0.3s ease'
            },
          }),
        },
        {
          title: (<span>投资额<br />(亿元)</span>),
          dataIndex: 'yygxqQyje',
          key: 'yygxqQyje',
          className: styles.headerAmount,
          width: 120,
          align: 'center' as const,
          sorter: (a: any, b: any) => (parseFloat(a.yygxqQyje) || 0) - (parseFloat(b.yygxqQyje) || 0),
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
      ],
    },
  ];

  // 初始化柱状图 - 产业链投资分布
  const initBarChart = () => {
    if (!barChartRef.current || !barChartData.length) return;

    const chart = echarts.init(barChartRef.current);

    // 从柱状图专用数据中提取重点产业链和项目个数数据
    const industries = barChartData.map((item) => item.name || '');
    const projectCountData = barChartData.map((item) => parseInt(item.total) || 0);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: '{b}: {c}个',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        // top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: industries,
        axisLabel: {
          rotate: 45,
          fontSize: 10,
        },
      },
      yAxis: {
        type: 'value',
        name: '项目个数',
        min: 0,
      },
      series: [
        {
          name: '项目个数',
          type: 'bar',
          data: projectCountData,
          itemStyle: {
            color: '#5470c6',
          },
          barWidth: '60%',
        },
      ],
    };

    chart.setOption(option);

    // 添加柱状图点击事件
    chart.on('click', (params: any) => {
      // 使用立即执行的异步函数处理异步操作
      (async () => {
        // 根据索引获取完整的数据项
        const clickedData = barChartData[params.dataIndex];
        console.log('完整的柱状图数据:', clickedData);
        console.log('产业链 code:', clickedData?.code || '未找到code');

        // 如果获取到了 code，则调用接口
        if (clickedData?.code) {
          try {
            // 获取当前表单的值
            const formValues = form.getFieldsValue();
            console.log('当前表单值:', formValues);

            // 构建接口参数，复用现有的参数构建逻辑
            const requestParams: any = {
              level: 3,
              currStartDate: dayjs(startDate).startOf('month').format('YYYY-MM-DD'),
              currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
              currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
              code: clickedData.code, // 添加点击的 code
            };

            // 如果选择了自定义金额范围，则传递 rmb1、rmb2、doller1、doller2
            if (money === 'custom') {
              if (formValues.rmb1 !== undefined && formValues.rmb1 !== null && formValues.rmb1 !== '') {
                requestParams.rmb1 = Number(formValues.rmb1);
                requestParams.doller1 = Math.floor((Number(formValues.rmb1) * 10000) / 7.2);
              }
              if (formValues.rmb2 !== undefined && formValues.rmb2 !== null && formValues.rmb2 !== '') {
                requestParams.rmb2 = Number(formValues.rmb2);
                requestParams.doller2 = Math.floor((Number(formValues.rmb2) * 10000) / 7.2);
              }
            } else if (money === 'below_0.5') {
              // 5千万元以下：rmb1: 0, rmb2: 0.5
              requestParams.rmb1 = 0;
              requestParams.rmb2 = 0.5;
              requestParams.doller1 = 0;
              requestParams.doller2 = Math.floor((0.5 * 10000) / 7.2);
            } else if (money === '0.5_to_1') {
              // 5千万元-1亿元：rmb1: 0.5, rmb2: 1
              requestParams.rmb1 = 0.5;
              requestParams.rmb2 = 1;
              requestParams.doller1 = Math.floor((0.5 * 10000) / 7.2);
              requestParams.doller2 = Math.floor((1 * 10000) / 7.2);
            } else {
              // 非自定义选择时，传递 rmb 参数
              requestParams.rmb = money === 0 ? undefined : money;
            }

            console.log('柱状图点击调用接口参数:', requestParams);

            // 调用接口
            const response = await primeApi.countSignedProjTypeByLevel(requestParams);

            // 解析返回数据
            let responseData;
            try {
              responseData = typeof response === 'string' ? JSON.parse(response) : response;
              console.log('柱状图点击接口返回数据:', responseData);
            } catch (parseError) {
              console.error('解析接口返回数据失败:', parseError);
            }

          } catch (error) {
            console.error('调用接口失败:', error);
          }
        }
      })();
    });

    // 响应式处理
    const resizeChart = () => chart.resize();
    window.addEventListener('resize', resizeChart);
  };

  // 初始化饼图 - 区域投资占比
  const initPieChart = () => {
    if (!pieChartRef.current || !dataSource.length) return;

    const chart = echarts.init(pieChartRef.current);

    // 动态计算区域投资占比数据
    const calculateRegionData = () => {
      // 计算各区域投资额总和
      const jjsTotal = parseFloat(
        // dataSource.reduce((sum, item) => sum + (parseFloat(item.jjsQyje) || 0), 0).toFixed(2),
        dataSource.reduce((sum, item) => sum + (parseFloat(item.jjsNum) || 0), 0).toFixed(2),
      );
      const txsTotal = parseFloat(
        // dataSource.reduce((sum, item) => sum + (parseFloat(item.txsQyje) || 0), 0).toFixed(2),
        dataSource.reduce((sum, item) => sum + (parseFloat(item.txsNum) || 0), 0).toFixed(2),
      );
      const xhsTotal = parseFloat(
        // dataSource.reduce((sum, item) => sum + (parseFloat(item.xhsQyje) || 0), 0).toFixed(2),
        dataSource.reduce((sum, item) => sum + (parseFloat(item.xhsNum) || 0), 0).toFixed(2),
      );
      const hlqTotal = parseFloat(
        // dataSource.reduce((sum, item) => sum + (parseFloat(item.hlqQyje) || 0), 0).toFixed(2),
        dataSource.reduce((sum, item) => sum + (parseFloat(item.hlqNum) || 0), 0).toFixed(2),
      );
      const jyqTotal = parseFloat(
        // dataSource.reduce((sum, item) => sum + (parseFloat(item.jyqQyje) || 0), 0).toFixed(2),
        dataSource.reduce((sum, item) => sum + (parseFloat(item.jyqNum) || 0), 0).toFixed(2),
      );
      const yygxqTotal = parseFloat(
        // dataSource.reduce((sum, item) => sum + (parseFloat(item.yygxqQyje) || 0), 0).toFixed(2),
        dataSource.reduce((sum, item) => sum + (parseFloat(item.yygxqNum) || 0), 0).toFixed(2),
      );

      return [
        { name: '靖江市', value: jjsTotal },
        { name: '泰兴市', value: txsTotal },
        { name: '兴化市', value: xhsTotal },
        { name: '海陵区', value: hlqTotal },
        { name: '姜堰区', value: jyqTotal },
        { name: '医药高新区', value: yygxqTotal },
      ];
    };

    const pieData = calculateRegionData();

    const option = {
      // title: {
      //   text: '区域投资占比',
      //   left: 'center',
      //   textStyle: {
      //     fontSize: 16,
      //     fontWeight: 'bold',
      //   },
      // },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}个 ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        textStyle: {
          fontSize: 10,
        },
      },
      series: [
        {
          name: '占比',
          type: 'pie',
          radius: '50%',
          center: ['60%', '50%'],
          data: pieData,
          itemStyle: {
            borderRadius: 8,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    chart.setOption(option);

    // 响应式处理
    const resizeChart = () => chart.resize();
    window.addEventListener('resize', resizeChart);
  };

  // 初始化折线图 - 项目数量趋势
  const initLineChart = () => {
    if (!lineChartRef.current) return;

    const chart = echarts.init(lineChartRef.current);

    // 写死的项目数量趋势数据
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'];
    // const projectCounts = [55, 131, 162, 116, 109, 96, 61, 71 ,142];
    const projectCounts = [40, 88, 120, 93, 97, 76, 55, 64, 120];

    const option = {
      // title: {
      //   text: '项目数量趋势',
      //   left: 'center',
      //   textStyle: {
      //     fontSize: 16,
      //     fontWeight: 'bold',
      //   },
      // },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}个项目',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        // top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: months,
      },
      yAxis: {
        type: 'value',
        name: '项目数量(个)',
        min: 0,
        max: 200,
        interval: 20,
      },
      series: [
        {
          name: '项目数量',
          type: 'line',
          data: projectCounts,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#91cc75',
          },
          lineStyle: {
            color: '#91cc75',
            width: 2,
          },
          areaStyle: {
            color: 'rgba(145, 204, 117, 0.2)',
          },
        },
      ],
    };

    chart.setOption(option);

    // 响应式处理
    const resizeChart = () => chart.resize();
    window.addEventListener('resize', resizeChart);
  };

  // 初始化数据
  useEffect(() => {
    // 获取用户权限
    fetchUserAreaPermissions();

    const currentStart = dayjs().startOf('year');
    const currentEnd = dayjs();

    setStartDate(currentStart);
    setEndDate(currentEnd);
    setRangeDate([currentStart, currentEnd]);
    setMonth(dayjs().month() + 1);

    // 根据路由参数设置金额范围、重点项目
    const urlMoney = getMoneyFromUrl();
    const urlKeyProject = getKeyProjectTypeFromUrl();
    setMoney(urlMoney);
    setKeyProjectType(urlKeyProject);
    const isMainProj =
      urlKeyProject === '市重点' || urlKeyProject === '省重大' ? urlKeyProject : undefined;

    const params = {
      level: 3,
      rmb: urlMoney === 0 ? undefined : urlMoney, // 0表示全部，不传rmb参数
      currStartDate: currentStart.startOf('month').format('YYYY-MM-DD'),
      currEndDate: currentEnd.endOf('month').format('YYYY-MM-DD'),
      currDate: currentEnd.startOf('month').format('YYYY-MM-DD'),
      ...(isMainProj ? { isMainProj } : {}),
    };

    // 设置表单初始值
    form.setFieldsValue({
      rangeDate: [currentStart, currentEnd],
      money: urlMoney,
      keyProjectType: urlKeyProject,
    });

    fetchSignedProjTypeData(params); // 初始化时获取表格数据
    fetchBarChartData(params); // 初始化时获取柱状图数据
  }, []);

  // 当数据更新时初始化图表
  useEffect(() => {
    if (dataSource.length > 0) {
      // 清理之前的图表实例
      if (pieChartRef.current) {
        const existingChart = echarts.getInstanceByDom(pieChartRef.current);
        if (existingChart) {
          existingChart.dispose();
        }
      }
      if (lineChartRef.current) {
        const existingChart = echarts.getInstanceByDom(lineChartRef.current);
        if (existingChart) {
          existingChart.dispose();
        }
      }

      // 延迟初始化新图表
      const timer = setTimeout(() => {
        initPieChart();
        initLineChart();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [dataSource]);

  // 当柱状图数据更新时初始化柱状图
  useEffect(() => {
    if (barChartData.length > 0) {
      // 清理之前的柱状图实例
      if (barChartRef.current) {
        const existingChart = echarts.getInstanceByDom(barChartRef.current);
        if (existingChart) {
          existingChart.dispose();
        }
      }

      // 延迟初始化柱状图
      const timer = setTimeout(() => {
        initBarChart();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [barChartData]);

  // 当切换到图表视图时重新初始化图表
  useEffect(() => {
    if (viewMode === 'chart') {
      // 延迟初始化，确保DOM已渲染
      const timer = setTimeout(() => {
        if (dataSource.length > 0) {
          initPieChart();
          initLineChart();
        }
        if (barChartData.length > 0) {
          initBarChart();
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [viewMode, dataSource, barChartData]);

  return (
    <div className={styles.homePage}>
      <div className={styles.container}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button className={styles.backBtn} onClick={goBack} icon={<ArrowLeftOutlined />}>
            返回
          </Button>

          <Button className={styles.backBtn} onClick={goHome}>
            返回首页
          </Button>
        </div>

        <Breadcrumb
          className={`${styles.mb15} ${styles.breadcrumbLarge}`}
          items={[
            {
              title: <a style={{ height: 'auto' }} onClick={() => navigate(-2)}><HomeOutlined className={styles.breadcrumbLarge} /> 首页</a>,
            },
            {
              title: <a style={{ height: 'auto' }} onClick={() => navigate(-1)}>前期招商</a>,
            },
            {
              title: '重点产业链项目',
            },
          ]}
        />

        <h1 className={styles.pageTitle}>产业链项目招引情况</h1>
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
                // currStartDate: dayjs('2025-01-01'),
                rangeDate: rangeDate,
                // currDate: dayjs('2025-08-01')
                money: money,
                keyProjectType: keyProjectType,
              }}
            >
              <Row>
                {/* <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px'
                  }}
                  label="开始时间"
                  name="currStartDate"
                >
                  <DatePicker placeholder="请选择开始时间" />
                </Form.Item> */}
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px',
                  }}
                  label="所属月份"
                  name="rangeDate"
                >
                  <RangePicker
                    picker="month"
                    format="YYYY-MM"
                    locale={zhCN}
                    placeholder={["开始月份", "结束月份"]}
                    style={{ marginRight: '20px' }}
                    onChange={onChangeDate3}
                  />
                </Form.Item>
                {/* <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px'
                  }}
                  label="当前时间"
                  name="currDate"
                >
                  <DatePicker placeholder="请选择当前时间" />
                </Form.Item> */}
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px',
                  }}
                  label="金额范围"
                  name="money"
                >
                  <Select
                    onChange={handleChangeSelect}
                    options={[
                      { value: 'custom', label: '自定义' },
                      { value: 0, label: '全部' },
                      { value: 'below_0.5', label: '5千万元以下' },
                      { value: '0.5_to_1', label: '5千万元-1亿元' },
                      { value: 1, label: '1亿元' },
                      { value: 5, label: '5亿元' },
                      { value: 10, label: '10亿元' },
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
                {showCustomRange && (
                  <>
                    <Form.Item<FieldType>
                      style={{
                        width: '150px',
                        marginLeft: '10px',
                      }}
                      name="rmb1"
                    >
                      <Input
                        type="number"
                        placeholder="输入金额"
                        min="0"
                        addonAfter="亿元"
                      />
                    </Form.Item>
                    <div style={{ margin: '0 8px', lineHeight: '32px', fontSize: '16px' }}>至</div>
                    <Form.Item<FieldType>
                      style={{
                        width: '150px',
                      }}
                      name="rmb2"
                    >
                      <Input
                        type="number"
                        placeholder="输入金额"
                        min="0"
                        addonAfter="亿元"
                      />
                    </Form.Item>
                  </>
                )}
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
        <div></div>
        {/* 视图切换按钮 */}
        <div style={{ marginBottom: '20px' }}>
          <div className={styles.filterControls} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              className={[styles.chartBtn, viewMode === 'chart' ? styles.active : ''].join(' ')}
              data-view="chart"
              style={{ marginRight: '10px' }}
              onClick={() => setViewMode('chart')}
            >
              图
            </Button>
            <Button
              className={[styles.chartBtn, viewMode === 'table' ? styles.active : ''].join(' ')}
              data-view="table"
              onClick={() => setViewMode('table')}
            >
              表
            </Button>

          </div>
        </div>
        {/* 表格视图 */}
        {viewMode === 'table' && (
          <div className={styles.projectsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>
                「大海新晨」产业体系重点产业链项目招引情况
              </div>
            </div>
            <Table
              className={styles.table}
              columns={columns}
              dataSource={dataSource}
              loading={loading}
              pagination={false}
              size="middle"
              scroll={{ x: 1200 }}
              locale={{
                emptyText: '暂无数据',
              }}
            />
          </div>
        )}

        {/* 图表视图 */}
        {viewMode === 'chart' && (
          <div className={styles.projectsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.chartCardHeader}>
                <div className={styles.tableTitle}>产业链项目数据分析</div>
              </div>
            </div>
            <Row gutter={[24, 24]} style={{ padding: '20px 0' }}>
              <Col span={8}>
                <div className={styles.chartCard}>
                  <div className={styles.chartCardHeader}>
                    <h3 className={styles.chartCardTitle}>产业链投资分布</h3>
                  </div>
                  <div ref={barChartRef} style={{ width: '100%', height: '300px' }}></div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.chartCard}>
                  <div className={styles.chartCardHeader}>
                    <h3 className={styles.chartCardTitle}>区域投资占比</h3>
                  </div>
                  <div ref={pieChartRef} style={{ width: '100%', height: '300px' }}></div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.chartCard}>
                  <div className={styles.chartCardHeader}>
                    <h3 className={styles.chartCardTitle}>项目数量趋势</h3>
                  </div>
                  <div ref={lineChartRef} style={{ width: '100%', height: '300px' }}></div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default FourfoldProject;
