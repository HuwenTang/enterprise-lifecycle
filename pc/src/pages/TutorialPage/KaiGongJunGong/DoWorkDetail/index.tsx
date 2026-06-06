/**
 * 开工竣工详情页面 - 在建详情
 * 功能：展示在建项目的统计数据，包括表格和图表
 * 特性：支持项目类型筛选、日期筛选、数据可视化
 */
import { primeApi } from '@/services/api';
import { ProjectFagaiKeyProjectsStatsVo } from '@/services/apis';
import { ProjectFagaiKeyProjectsStatsMergedVo } from '@/services/apis/models/ProjectFagaiKeyProjectsStatsMergedVo';
import { ArrowLeftOutlined,HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, ConfigProvider, DatePicker, Form, Row, Select, Space, Table } from 'antd';
import dayjs from 'dayjs';
import zhCN from 'antd/locale/zh_CN';
import * as echarts from 'echarts';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

// 表单字段类型定义
type FieldType = {
  type: number; // 项目类型：4-全部，1-重点，2-1亿元，3-10亿元
  date?: string; // 日期筛选
  industryChain?: string; // 产业链筛选
};

// 项目数据接口
interface ProjectData {
  city?: string; // 城市名称
  projectCountDomesticInvestment?: number; // 内资项目数量
  projectCountForeignInvestment?: number; // 外资项目数量
  plannedInvestmentDomestic?: number; // 内资计划投资
  plannedInvestmentForeign?: number; // 外资计划投资
}

function GlobalProjectChart2({ data1 }: { data1: ProjectData[] }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data1 || data1.length === 0) return;

    const colors = ['#407DFC', '#8A7AF7'];
    const chart = echarts.init(chartRef.current);

    // 准备数据
    const cities = data1.map((item) => item.city ?? '未知');
    const domesticProjects = data1.map((item) => item.projectCountDomesticInvestment || 0);
    const foreignProjects = data1.map((item) => item.projectCountForeignInvestment || 0);

    const option = {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      grid: {
        top: '10%',
        bottom: '30%',
      },
      legend: {
        data: ['内资项目', '外资项目'],
        bottom: 'bottom',
        left: 'center',
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0, // 强制显示所有标签
            fontSize: 10, // 调小字体
          },
          data: cities,
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
          name: '内资项目',
          type: 'bar',
          stack: 'project', // 设置堆叠名称
          z: 1, // 设置较低的z值
          data: domesticProjects,
        },
        {
          name: '外资项目',
          type: 'bar',
          stack: 'project', // 设置相同的堆叠名称，实现堆叠效果
          z: 2, // 设置较高的z值，确保显示在内资柱体上方
          data: foreignProjects,
        },
      ],
    };
    chart.setOption(option);
    return () => chart.dispose();
  }, [JSON.stringify(data1)]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%', marginTop: '0.2rem' }}></div>;
}

function GlobalProjectChart3({ data1 }: { data1: ProjectData[] }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data1 || data1.length === 0) return;

    const colors = ['#407DFC', '#8A7AF7'];
    const chart = echarts.init(chartRef.current);

    // 准备数据
    const cities = data1.map((item) => item.city ?? '未知');
    const domesticProjects = data1.map((item) => item.projectCountDomesticInvestment || 0);
    const foreignProjects = data1.map((item) => item.projectCountForeignInvestment || 0);

    const option = {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      grid: {
        top: '10%',
        bottom: '30%',
      },
      legend: {
        data: ['内资项目', '外资项目'],
        bottom: 'bottom',
        left: 'center',
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0, // 强制显示所有标签
            fontSize: 10, // 调小字体
          },
          data: cities,
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
          name: '内资项目',
          type: 'bar',
          stack: 'project', // 设置堆叠名称
          z: 1, // 设置较低的z值
          data: domesticProjects,
        },
        {
          name: '外资项目',
          type: 'bar',
          stack: 'project', // 设置相同的堆叠名称，实现堆叠效果
          z: 2, // 设置较高的z值，确保显示在内资柱体上方
          data: foreignProjects,
        },
      ],
    };
    chart.setOption(option);
    return () => chart.dispose();
  }, [JSON.stringify(data1)]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%', marginTop: '0.2rem' }}></div>;
}

// 第三个图表：展示投资数据的堆叠柱状图
function GlobalProjectChart4({ zdData, yyData }: { zdData: ProjectData[]; yyData: ProjectData[] }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!zdData || !yyData || zdData.length === 0 || yyData.length === 0) return;

    const colors = ['#407DFC', '#8A7AF7', '#FF6B6B', '#4ECDC4'];
    const chart = echarts.init(chartRef.current);

    // 准备数据 - 确保城市数据一致
    const cities = zdData.map((item) => item.city ?? '未知');

    // 重点项目投资数据（转换为亿元）
    const zdDomesticInvestment = zdData.map((item) => (item.plannedInvestmentDomestic || 0) / 10000);
    const zdForeignInvestment = zdData.map((item) => (item.plannedInvestmentForeign || 0) / 10000);

    // 亿元项目投资数据（转换为亿元）
    // 假设yyData与zdData有相同的城市顺序，直接映射；如果顺序不同，需要根据城市名匹配
    const yyDomesticInvestment = yyData.map((item) => (item.plannedInvestmentDomestic || 0) / 10000);
    const yyForeignInvestment = yyData.map((item) => (item.plannedInvestmentForeign || 0) / 10000);

    const option = {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: function (params: any) {
          let result = params[0].name + '<br/>';
          params.forEach((item: any) => {
            result += item.marker + item.seriesName + ': ' + item.value.toFixed(2) + ' 亿元<br/>';
          });
          return result;
        },
      },
      grid: {
        top: '10%',
        bottom: '30%',
        left: '10%',
        right: '5%',
      },
      legend: {
        data: ['重点项目-内资投资', '重点项目-外资投资', '亿元项目-内资投资', '亿元项目-外资投资'],
        bottom: 'bottom',
        left: 'center',
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0, // 强制显示所有标签
            fontSize: 10, // 调小字体
          },
          data: cities,
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '计划总投资（亿元）',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: false,
            lineStyle: {},
          },
          axisLabel: {
            formatter: function (value: any) {
              return value.toFixed(0);
            },
          },
        },
      ],
      series: [
        // 重点项目-内资投资（下方）
        {
          name: '重点项目-内资投资',
          type: 'bar',
          stack: 'zdProject', // 重点项目堆叠组
          z: 1,
          data: zdDomesticInvestment,
        },
        // 重点项目-外资投资（上方）
        {
          name: '重点项目-外资投资',
          type: 'bar',
          stack: 'zdProject',
          z: 2,
          data: zdForeignInvestment,
        },
        // 亿元项目-内资投资（下方）
        {
          name: '亿元项目-内资投资',
          type: 'bar',
          stack: 'yyProject', // 亿元项目堆叠组
          z: 3,
          data: yyDomesticInvestment,
        },
        // 亿元项目-外资投资（上方）
        {
          name: '亿元项目-外资投资',
          type: 'bar',
          stack: 'yyProject',
          z: 4,
          data: yyForeignInvestment,
        },
      ],
    };
    chart.setOption(option);
    return () => chart.dispose();
  }, [JSON.stringify(zdData), JSON.stringify(yyData)]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%', marginTop: '0.2rem' }}></div>;
}

const DoWorkDetail: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const [dataSource, setDataSource] = useState<ProjectFagaiKeyProjectsStatsMergedVo[]>([]);
  // 当前选择的项目类型，默认为4（全部）
  const [selectedProjectType, setSelectedProjectType] = useState<number>(4);
  // 排序状态
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);
  // 展开状态
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const [form] = Form.useForm();
  // 月份选择状态
  const [selectedDate, setSelectedDate] = useState<string>('');

  // 处理排序
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field && sorter.order) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);

      // 创建一个新的数据数组进行排序
      const sortedData = [...dataSource].sort((a, b) => {
        const valueA = a[sorter.field as keyof ProjectFagaiKeyProjectsStatsMergedVo] as number || 0;
        const valueB = b[sorter.field as keyof ProjectFagaiKeyProjectsStatsMergedVo] as number || 0;
        return sorter.order === 'ascend' ? valueA - valueB : valueB - valueA;
      });

      setDataSource(sortedData);
    } else if (!sorter.field) {
      // 清除排序，重新获取数据
      setSortField(null);
      setSortOrder(null);
      getMergedProjectFagaiKeyProjectsStats(selectedProjectType);
    }
  };
  // 表单提交处理
  const onFinish = (values: FieldType) => {
    console.log('查询条件:', values);
    // 更新选中的项目类型
    setSelectedProjectType(values.type);
    // 处理日期，将月份转换为yyyy-MM-01格式
    let dateStr = '';
    if (values.date) {
      dateStr = dayjs(values.date).format('YYYY-MM') + '-01';
      setSelectedDate(dateStr);
    }
    // 调用数据获取方法，并传入表单中选择的type值、日期和产业链
    getMergedProjectFagaiKeyProjectsStats(values.type, dateStr, values.industryChain);
    // 图表数据始终使用重置时的接口数据，不随项目类型改变
    const defaultType = 2;
    listProjectFagaiKeyProjectsStats1(defaultType, dateStr);
    listProjectFagaiKeyProjectsStats(dateStr);
  };
  // 重置表单
  const onReset = () => {
    form.resetFields();
    setSelectedDate('');
    // 重置后使用默认类型重新获取数据（全部）
    const defaultType1 = 4; // 全部
    const defaultType = 2;
    setSelectedProjectType(defaultType1);
    // 设置表单默认值
    form.setFieldsValue({ type: defaultType1 });
    getMergedProjectFagaiKeyProjectsStats(defaultType1);
    listProjectFagaiKeyProjectsStats1(defaultType);
    listProjectFagaiKeyProjectsStats();
  };

  //重点项目数据
  const [zdData, setZdData] = useState<ProjectFagaiKeyProjectsStatsVo[]>([]);
  const listProjectFagaiKeyProjectsStats = async (date?: string) => {
    try {
      // 使用primeApi的listProjectFagaiKeyProjectsStats接口获取在建项目数据
      const params: any = {
        status: 3, // 在建项目状态
        type: 1, // 使用传入的类型
        isDistrict: true,
      };
      // 只有当date存在时才添加到参数中
      if (date) {
        params.date = date;
      }
      const data = await primeApi.listProjectFagaiKeyProjectsStats(params);
      setZdData(data.records);
    } catch (e) {
      console.error('获取在建项目数据失败:', e);
      // 出错时使用模拟数据
    }
  };

  //亿元项目数据
  const [yyData, setYyData] = useState<ProjectFagaiKeyProjectsStatsVo[]>([]);

  const listProjectFagaiKeyProjectsStats1 = async (type: number, date?: string) => {
    try {
      // 使用primeApi的listProjectFagaiKeyProjectsStats接口获取在建项目数据
      const params: any = {
        status: 3, // 在建项目状态
        type: type, // 使用传入的类型
        isDistrict: true,
      };
      // 只有当date存在时才添加到参数中
      if (date) {
        params.date = date;
      }
      const data = await primeApi.listProjectFagaiKeyProjectsStats(params);
      setYyData(data.records);
    } catch (e) {
      console.error('获取开工项目数据失败:', e);
      // 出错时使用模拟数据
    }
  };

  const getMergedProjectFagaiKeyProjectsStats = async (selectedType?: number, date?: string, industryChain?: string) => {
    try {
      // 使用primeApi的getMergedProjectFagaiKeyProjectsStats接口获取在建项目数据
      const params: any = {
        status: 3, // 在建项目状态
        type: selectedType || 2, // 使用传入的类型或默认为1
      };
      // 只有当date存在时才添加到参数中
      if (date) {
        params.date = date;
      }
      // 只有当产业链存在时才添加到参数中
      if (industryChain) {
        params.industry = industryChain;
      }
      const data = await primeApi.getMergedProjectFagaiKeyProjectsStats(params);
      setDataSource([data]);

      // 设置展开第一级
      const getFirstLevelKeys = (data: any): React.Key[] => {
        const keys: React.Key[] = [];
        if (data.id) {
          keys.push(data.id);
        }
        return keys;
      };

      setExpandedKeys(getFirstLevelKeys(data));
    } catch (e) {
      console.error('获取开工项目数据失败:', e);
      // 出错时使用模拟数据
      setDataSource([]);
    }
  };

  // 定义表格列配置
  // 根据选择的项目类型获取对应的标题文本
  const getProjectTypeTitle = () => {
    switch (selectedProjectType) {
      case 4:
        return '全部';
      case 1:
        return '重点';
      case 2:
        return '1亿元';
      case 3:
        return '10亿元';
      default:
        return '全部';
    }
  };

  const getColumns = () => {
    const baseColumns: any[] = [
      {
        title: '市（区）',
        dataIndex: 'city',
        key: 'city',
        width: 250,
        render: (text: string | undefined) => {
          return text || '--';
        },
      },
      {
        title: '园区',
        dataIndex: 'park',
        key: 'park',
        width: 150,
        render: (text: string | undefined) => {
          return text || '--';
        },
      },
      {
        title: '所属产业链群',
        dataIndex: 'industrialChainCluster',
        key: 'industrialChainCluster',
        width: 150,
        render: (text: string | undefined) => {
          return text || '--';
        },
      },
    ];

    // 根据选择的项目类型添加不同的列
    if (selectedProjectType === 4) {
      // 全部：显示全部列，数据为后缀为2的字段，不需要相加
      baseColumns.push({
        title: '全部',
        key: 'allProjects',
        children: [
          {
            title: '项目总数',
            dataIndex: 'projectCountTotal2',
            key: 'projectCountTotal2',
            width: 120,
            sorter: (a: any, b: any) => (a.projectCountTotal2 || 0) - (b.projectCountTotal2 || 0),
            render: (text: number | undefined) => {
              return text || 0;
            },
          },
          {
            title: '外资项目数量',
            dataIndex: 'projectCountForeignInvestment2',
            key: 'projectCountForeignInvestment2',
            width: 150,
            sorter: (a: any, b: any) => (a.projectCountForeignInvestment2 || 0) - (b.projectCountForeignInvestment2 || 0),
            render: (text: number | undefined) => {
              return text || 0;
            },
          },
          {
            title: '内资项目数量',
            dataIndex: 'projectCountDomesticInvestment2',
            key: 'projectCountDomesticInvestment2',
            width: 150,
            sorter: (a: any, b: any) => (a.projectCountDomesticInvestment2 || 0) - (b.projectCountDomesticInvestment2 || 0),
            render: (text: number | undefined) => {
              return text || 0;
            },
          },
          {
            title: '计划总投资总额（亿元）',
            dataIndex: 'plannedInvestmentTotal2',
            key: 'plannedInvestmentTotal2',
            width: 150,
            sorter: (a: any, b: any) => (a.plannedInvestmentTotal2 || 0) - (b.plannedInvestmentTotal2 || 0),
            render: (text: number | undefined) => {
              return text ? (text / 10000).toFixed(2) : '0.00';
            },
          },
          {
            title: '外资项目计划总投资（亿元）',
            dataIndex: 'plannedInvestmentForeign2',
            key: 'plannedInvestmentForeign2',
            width: 180,
            sorter: (a: any, b: any) => (a.plannedInvestmentForeign2 || 0) - (b.plannedInvestmentForeign2 || 0),
            render: (text: number | undefined) => {
              return text ? (text / 10000).toFixed(2) : '0.00';
            },
          },
          {
            title: '内资项目计划总投资（亿元）',
            dataIndex: 'plannedInvestmentDomestic2',
            key: 'plannedInvestmentDomestic2',
            width: 180,
            sorter: (a: any, b: any) => (a.plannedInvestmentDomestic2 || 0) - (b.plannedInvestmentDomestic2 || 0),
            render: (text: number | undefined) => {
              return text ? (text / 10000).toFixed(2) : '0.00';
            },
          },
        ],
      });
    } else if (selectedProjectType === 1) {
      // 重点项目：只显示重点项目
      baseColumns.push({
        title: '重点项目',
        key: 'keyProjects',
        children: [
          {
            title: '市级重点项目总数',
            dataIndex: 'projectCountTotal1',
            key: 'projectCountTotal1',
            width: 120,
            sorter: (a: any, b: any) => (a.projectCountTotal1 || 0) - (b.projectCountTotal1 || 0),
            render: (text: number | undefined) => {
              return text || 0;
            },
          },
          {
            title: '外资项目数量',
            dataIndex: 'projectCountForeignInvestment1',
            key: 'projectCountForeignInvestment1',
            width: 150,
            sorter: (a: any, b: any) => (a.projectCountForeignInvestment1 || 0) - (b.projectCountForeignInvestment1 || 0),
            render: (text: number | undefined) => {
              return text || 0;
            },
          },
          {
            title: '内资项目数量',
            dataIndex: 'projectCountDomesticInvestment1',
            key: 'projectCountDomesticInvestment1',
            width: 150,
            sorter: (a: any, b: any) => (a.projectCountDomesticInvestment1 || 0) - (b.projectCountDomesticInvestment1 || 0),
            render: (text: number | undefined) => {
              return text || 0;
            },
          },
          {
            title: '计划总投资总额（亿元）',
            dataIndex: 'plannedInvestmentTotal1',
            key: 'plannedInvestmentTotal1',
            width: 150,
            sorter: (a: any, b: any) => (a.plannedInvestmentTotal1 || 0) - (b.plannedInvestmentTotal1 || 0),
            render: (text: number | undefined) => {
              return text ? (text / 10000).toFixed(2) : '0.00';
            },
          },
          {
            title: '外资项目计划总投资（亿元）',
            dataIndex: 'plannedInvestmentForeign1',
            key: 'plannedInvestmentForeign1',
            width: 180,
            sorter: (a: any, b: any) => (a.plannedInvestmentForeign1 || 0) - (b.plannedInvestmentForeign1 || 0),
            render: (text: number | undefined) => {
              return text ? (text / 10000).toFixed(2) : '0.00';
            },
          },
          {
            title: '内资项目计划总投资（亿元）',
            dataIndex: 'plannedInvestmentDomestic1',
            key: 'plannedInvestmentDomestic1',
            width: 180,
            sorter: (a: any, b: any) => (a.plannedInvestmentDomestic1 || 0) - (b.plannedInvestmentDomestic1 || 0),
            render: (text: number | undefined) => {
              return text ? (text / 10000).toFixed(2) : '0.00';
            },
          },
        ],
      });
    } else if (selectedProjectType === 2) {
      // 亿元项目：只显示亿元项目
      baseColumns.push({
        title: '亿元项目',
        key: 'billionProjects',
        children: [
          {
            title: '项目总数',
            dataIndex: 'projectCountTotal2',
            key: 'projectCountTotal2',
            width: 120,
            sorter: (a: any, b: any) => (a.projectCountTotal2 || 0) - (b.projectCountTotal2 || 0),
            render: (text: number | undefined) => {
              return text || 0;
            },
          },
          {
            title: '外资项目数量',
            dataIndex: 'projectCountForeignInvestment2',
            key: 'projectCountForeignInvestment2',
            width: 150,
            sorter: (a: any, b: any) => (a.projectCountForeignInvestment2 || 0) - (b.projectCountForeignInvestment2 || 0),
            render: (text: number | undefined) => {
              return text || 0;
            },
          },
          {
            title: '内资项目数量',
            dataIndex: 'projectCountDomesticInvestment2',
            key: 'projectCountDomesticInvestment2',
            width: 150,
            sorter: (a: any, b: any) => (a.projectCountDomesticInvestment2 || 0) - (b.projectCountDomesticInvestment2 || 0),
            render: (text: number | undefined) => {
              return text || 0;
            },
          },
          {
            title: '计划总投资总额（亿元）',
            dataIndex: 'plannedInvestmentTotal2',
            key: 'plannedInvestmentTotal2',
            width: 150,
            sorter: (a: any, b: any) => (a.plannedInvestmentTotal2 || 0) - (b.plannedInvestmentTotal2 || 0),
            render: (text: number | undefined) => {
              return text ? (text / 10000).toFixed(2) : '0.00';
            },
          },
          {
            title: '外资项目计划总投资（亿元）',
            dataIndex: 'plannedInvestmentForeign2',
            key: 'plannedInvestmentForeign2',
            width: 180,
            sorter: (a: any, b: any) => (a.plannedInvestmentForeign2 || 0) - (b.plannedInvestmentForeign2 || 0),
            render: (text: number | undefined) => {
              return text ? (text / 10000).toFixed(2) : '0.00';
            },
          },
          {
            title: '内资项目计划总投资（亿元）',
            dataIndex: 'plannedInvestmentDomestic2',
            key: 'plannedInvestmentDomestic2',
            width: 180,
            sorter: (a: any, b: any) => (a.plannedInvestmentDomestic2 || 0) - (b.plannedInvestmentDomestic2 || 0),
            render: (text: number | undefined) => {
              return text ? (text / 10000).toFixed(2) : '0.00';
            },
          },
        ],
      });
    } else if (selectedProjectType === 3) {
      // 10亿元项目：只显示10亿元项目
      baseColumns.push({
        title: '10亿元项目',
        key: 'tenBillionProjects',
        children: [
          {
            title: '项目总数',
            dataIndex: 'projectCountTotal2',
            key: 'projectCountTotal2',
            width: 120,
            sorter: (a: any, b: any) => (a.projectCountTotal2 || 0) - (b.projectCountTotal2 || 0),
            render: (text: number | undefined) => {
              return text || 0;
            },
          },
          {
            title: '外资项目数量',
            dataIndex: 'projectCountForeignInvestment2',
            key: 'projectCountForeignInvestment2',
            width: 150,
            sorter: (a: any, b: any) => (a.projectCountForeignInvestment2 || 0) - (b.projectCountForeignInvestment2 || 0),
            render: (text: number | undefined) => {
              return text || 0;
            },
          },
          {
            title: '内资项目数量',
            dataIndex: 'projectCountDomesticInvestment2',
            key: 'projectCountDomesticInvestment2',
            width: 150,
            sorter: (a: any, b: any) => (a.projectCountDomesticInvestment2 || 0) - (b.projectCountDomesticInvestment2 || 0),
            render: (text: number | undefined) => {
              return text || 0;
            },
          },
          {
            title: '计划总投资总额（亿元）',
            dataIndex: 'plannedInvestmentTotal2',
            key: 'plannedInvestmentTotal2',
            width: 150,
            sorter: (a: any, b: any) => (a.plannedInvestmentTotal2 || 0) - (b.plannedInvestmentTotal2 || 0),
            render: (text: number | undefined) => {
              return text ? (text / 10000).toFixed(2) : '0.00';
            },
          },
          {
            title: '外资项目计划总投资（亿元）',
            dataIndex: 'plannedInvestmentForeign2',
            key: 'plannedInvestmentForeign2',
            width: 180,
            sorter: (a: any, b: any) => (a.plannedInvestmentForeign2 || 0) - (b.plannedInvestmentForeign2 || 0),
            render: (text: number | undefined) => {
              return text ? (text / 10000).toFixed(2) : '0.00';
            },
          },
          {
            title: '内资项目计划总投资（亿元）',
            dataIndex: 'plannedInvestmentDomestic2',
            key: 'plannedInvestmentDomestic2',
            width: 180,
            sorter: (a: any, b: any) => (a.plannedInvestmentDomestic2 || 0) - (b.plannedInvestmentDomestic2 || 0),
            render: (text: number | undefined) => {
              return text ? (text / 10000).toFixed(2) : '0.00';
            },
          },
        ],

      });
    }

    return baseColumns;
  };

  useEffect(() => {
    // 使用与重置方法相同的数据加载方式，但项目类型默认为全部
    const defaultType1 = 4; // 全部
    const defaultType = 2;
    setSelectedProjectType(defaultType1);
    setSelectedDate('');
    // 设置表单默认值
    form.setFieldsValue({ type: defaultType1 });
    getMergedProjectFagaiKeyProjectsStats(defaultType1);
    listProjectFagaiKeyProjectsStats1(defaultType);
    listProjectFagaiKeyProjectsStats();
  }, []);
  return (
    <div className={styles.investmentDetailPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          {/* <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <BuildOutlined/>
            </div>
            <div className={styles.logoText}>
              <h1>企业全生命周期管理系统</h1>
              <p>Enterprise Full Lifecycle Management System</p>
            </div>
          </div> */}
          {/*<div className={styles.userInfo}>*/}
          {/*  <div className={styles.notification}>*/}
          {/*    <BellOutlined />*/}
          {/*    <div className={styles.notificationBadge}>3</div>*/}
          {/*  </div>*/}
          {/*  <div className={styles.userAvatar}>张</div>*/}
          {/*  <div className={styles.userDetails}>*/}
          {/*    <div className={styles.userName}>张国荣</div>*/}
          {/*    <div className={styles.userRole}>系统管理员</div>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </header>

        <Button onClick={handleBack} className={styles.backButton}>
          <ArrowLeftOutlined /> 返回
        </Button>

        <Breadcrumb className={styles.mb15} style={{ fontSize: '20px' }}>
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-2)}><HomeOutlined style={{ marginRight: '10px', fontSize: '20px' }} /> 首页</a></Breadcrumb.Item>
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-1)}>开工竣工</a></Breadcrumb.Item>
          <Breadcrumb.Item>在建项目</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>项目在建情况</h1>
        {/* <p className={styles.pageSubtitle}>展示项目在建数据统计情况</p> */}

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
            >
              <Row>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px',
                  }}
                  label="项目类型"
                  name="type"
                  initialValue={4}
                >
                  <Select
                    placeholder="请选择项目类型"
                    style={{ width: '100%' }}
                    options={[
                      {
                        value: 4,
                        label: '全部',
                      },
                      {
                        value: 1,
                        label: '重点',
                      },
                      {
                        value: 2,
                        label: '1亿元',
                      },
                      {
                        value: 3,
                        label: '10亿元',
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px',
                  }}
                  label="选择月份"
                  name="date"
                >
                  <ConfigProvider locale={zhCN}>
                    <DatePicker
                      placeholder="请选择月份"
                      style={{ width: '100%' }}
                      picker="month"
                      inputReadOnly
                    />
                  </ConfigProvider>
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px',
                  }}
                  label="产业链"
                  name="industryChain"
                >
                  <Select
                    placeholder="请选择产业链"
                    style={{ width: '100%' }}
                    allowClear
                    options={[
                      { value: '医药', label: '医药' },
                      { value: '医疗器械', label: '医疗器械' },
                      { value: '特医及功能性食品', label: '特医及功能性食品' },
                      { value: '农副食品深加工及预制菜', label: '农副食品深加工及预制菜' },
                      { value: '海洋工程装备', label: '海洋工程装备' },
                      { value: '高技术船舶', label: '高技术船舶' },
                      { value: '汽车及零部件', label: '汽车及零部件' },
                      { value: '电子信息', label: '电子信息' },
                      { value: '智能装备', label: '智能装备' },
                      { value: '节能环保', label: '节能环保' },
                      { value: '化工及新材料', label: '化工及新材料' },
                      { value: '金属新材料及制品', label: '金属新材料及制品' },
                      { value: '新能源', label: '新能源' },
                      { value: '合成生物', label: '合成生物' },
                      { value: '细胞和基因技术', label: '细胞和基因技术' },
                      { value: '前沿新材料', label: '前沿新材料' },
                      { value: '新型储能', label: '新型储能' },
                      { value: '深海深地空天装备', label: '深海深地空天装备' },
                      { value: '人工智能', label: '人工智能' },
                      { value: '氢能', label: '氢能' },
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

        <div className={styles.projectsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>项目在建情况统计</div>
            <div className={styles.tableActions}>
              <div className={styles.filterControls}>
                {/*<Button*/}
                {/*  className={[styles.chartBtn, styles.active].join(' ')}*/}
                {/*  data-view="city"*/}
                {/*  disabled*/}
                {/*>*/}
                {/*  按市(区)*/}
                {/*</Button>*/}
              </div>
              {/*<Button className={styles.tableBtn} icon={<DownloadOutlined />}>导出</Button>*/}
              {/*<Button className={styles.tableBtn} icon={<FilterOutlined />}>筛选</Button>*/}
            </div>
          </div>
          <Table
            className={styles.table}
            columns={getColumns()}
            dataSource={dataSource}
            rowKey={'id'}
            pagination={false}
            size="middle"
            locale={{
              emptyText: '暂无数据',
              filterTitle: '',
              filterConfirm: '确定',
              filterReset: '重置',
              filterEmptyText: '无筛选项',
              filterCheckall: '全选',
              filterSearchPlaceholder: '在筛选项中搜索',
              selectAll: '全选所有',
              selectInvert: '反选当页',
              selectNone: '清空所有',
              selectionAll: '全选所有',
              sortTitle: '',
              expand: '展开行',
              collapse: '收起行',
              triggerDesc: '点击降序',
              triggerAsc: '点击升序',
              cancelSort: '取消排序',
            }}
            onChange={handleTableChange}
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

        <div className={styles.chartsSection}>
          <div className={styles.chartsHeader}>
            <h2 className={styles.chartsTitle}>数据可视化分析</h2>
          </div>

          <div className={styles.chartsContainer}>
            <div className={styles.chartCard}>
              <div className={styles.chartCardHeader}>
                <h3 className={styles.chartCardTitle}>各市（区）重点项目</h3>
              </div>
              <div className={styles.chartCardBody}>
                <GlobalProjectChart2 data1={zdData} />
              </div>
            </div>
            <div className={styles.chartCard}>
              <div className={styles.chartCardHeader}>
                <h3 className={styles.chartCardTitle}>各市（区）亿元项目</h3>
              </div>
              <div className={styles.chartCardBody}>
                <GlobalProjectChart3 data1={yyData} />
              </div>
            </div>
            <div className={styles.chartCard}>
              <div className={styles.chartCardHeader}>
                <h3 className={styles.chartCardTitle}>重点项目与亿元项目投资对比</h3>
              </div>
              <div className={styles.chartCardBody}>
                <GlobalProjectChart4 zdData={zdData} yyData={yyData} />
              </div>
            </div>
          </div>
        </div>

        {/* <div className={styles.footer}>
          <p>企业全生命周期管理服务平台 © 2025 版权所有</p>
        </div> */}
      </div>
    </div>
  );
};

export default DoWorkDetail;
