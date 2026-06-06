import { primeApi } from '@/services/api';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select, Space, Table, Breadcrumb } from 'antd';
import * as echarts from 'echarts';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import {
  ListForeignCapitalUtilizationRequest
} from '@/services/apis';

type FieldType = {
  year?: number;
  month?: number;
};

const ForeignInvestment: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(12);

  // 数据源
  const [dataSource, setDataSource] = useState<any[]>([]);

  const goBack = () => {
    navigate(-1);
  };
  const goHome = () => {
    navigate('/');
  };
  const changeYear = (newValue: number) => {
    setYear(newValue);
  };
  const changeMonth = (newValue: number) => {
    setMonth(newValue);
  };

  // 定义表格列
  const columns = [
    {
      title: '市（区）',
      dataIndex: 'area',
      key: 'area',
      className: styles.headerMain,
      width: 150,
      align: 'center' as const,
    },
    {
      title: '新设企业数',
      children: [
        {
          title: '当期',
          dataIndex: 'newEnterpriseCountCurrent',
          key: 'newEnterpriseCountCurrent',
          className: styles.headerCount,
          width: 80,
          align: 'center' as const,
          sorter: (a: any, b: any) => {
            if (a.id === '80115007797000194' || b.area === '80115007797000194') return 0;
            return (parseInt(a.newEnterpriseCountCurrent) || 0) - (parseInt(b.newEnterpriseCountCurrent) || 0);
          },
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
        {
          title: '去年同期',
          dataIndex: 'newEnterpriseCountLastYear',
          key: 'newEnterpriseCountLastYear',
          className: styles.headerCount,
          width: 100,
          align: 'center' as const,
          sorter: (a: any, b: any) => {
            if (a.id === '80115007797000194' || b.area === '80115007797000194') return 0;
            return (parseInt(a.newEnterpriseCountLastYear) || 0) - (parseInt(b.newEnterpriseCountLastYear) || 0);
          },
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
      ],
    },
    {
      title: '合同外资金额',
      children: [
        {
          title: (<span>累计金额<br />(万美元)</span>),
          dataIndex: 'contractedForeignCapitalAmount',
          key: 'contractedForeignCapitalAmount',
          className: styles.headerAmount,
          width: 100,
          align: 'center' as const,
          sorter: (a: any, b: any) => {
            if (a.id === '80115007797000194' || b.area === '80115007797000194') return 0;
            return (parseFloat(a.contractedForeignCapitalAmount) || 0) - (parseFloat(b.contractedForeignCapitalAmount) || 0);
          },
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
        {
          title: '同比',
          dataIndex: 'contractedForeignCapitalAmountYoY',
          key: 'contractedForeignCapitalAmountYoY',
          className: styles.headerAmount,
          width: 80,
          align: 'center' as const,
          sorter: (a: any, b: any) => {
            if (a.id === '80115007797000194' || b.id === '80115007797000194') return 0;
            return (parseFloat(a.contractedForeignCapitalAmountYoY?.replace('%', '')) || 0) - (parseFloat(b.contractedForeignCapitalAmountYoY?.replace('%', '')) || 0);
          },
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
        {
          title: '占全市比重',
          dataIndex: 'contractedShareInCityTotal',
          key: 'contractedShareInCityTotal',
          className: styles.headerAmount,
          width: 120,
          align: 'center' as const,
          sorter: (a: any, b: any) => {
            if (a.id === '80115007797000194' || b.area === '80115007797000194') return 0;
            return (parseFloat(a.contractedShareInCityTotal?.replace('%', '')) || 0) - (parseFloat(b.contractedShareInCityTotal?.replace('%', '')) || 0);
          },
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
      ],
    },
    {
      title: '实际使用外资金额',
      children: [
        {
          title: (<span>累计金额<br />(万美元)</span>),
          dataIndex: 'actuallyUtilizedForeignCapitalAmount',
          key: 'actuallyUtilizedForeignCapitalAmount',
          className: styles.headerAmount,
          width: 100,
          align: 'center' as const,
          sorter: (a: any, b: any) => {
            if (a.id === '80115007797000194' || b.area === '80115007797000194') return 0;
            return (parseFloat(a.actuallyUtilizedForeignCapitalAmount) || 0) - (parseFloat(b.actuallyUtilizedForeignCapitalAmount) || 0);
          },
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
        {
          title: '同比',
          dataIndex: 'actuallyUtilizedForeignCapitalAmountYoY',
          key: 'actuallyUtilizedForeignCapitalAmountYoY',
          className: styles.headerAmount,
          width: 80,
          align: 'center' as const,
          sorter: (a: any, b: any) => {
            if (a.id === '80115007797000194' || b.area === '80115007797000194') return 0;
            return (parseFloat(a.actuallyUtilizedForeignCapitalAmountYoY?.replace('%', '')) || 0) - (parseFloat(b.actuallyUtilizedForeignCapitalAmountYoY?.replace('%', '')) || 0);
          },
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
        {
          title: '占全市比重',
          dataIndex: 'auShareInCityTotal',
          key: 'auShareInCityTotal',
          className: styles.headerAmount,
          width: 120,
          align: 'center' as const,
          sorter: (a: any, b: any) => {
            if (a.id === '80115007797000194' || b.area === '80115007797000194') return 0;
            return (parseFloat(a.auShareInCityTotal?.replace('%', '')) || 0) - (parseFloat(b.auShareInCityTotal?.replace('%', '')) || 0);
          },
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
        {
          title: '占年度计划',
          dataIndex: 'auShareInAnnualPlan',
          key: 'auShareInAnnualPlan',
          className: styles.headerAmount,
          width: 120,
          align: 'center' as const,
          sorter: (a: any, b: any) => {
            if (a.id === '80115007797000194' || b.area === '80115007797000194') return 0;
            return (parseFloat(a.auShareInAnnualPlan?.replace('%', '')) || 0) - (parseFloat(b.auShareInAnnualPlan?.replace('%', '')) || 0);
          },
          sortDirections: ['ascend', 'descend'] as const,
          showSorterTooltip: false,
        },
      ],
    },
  ];

  const loadData = async (params: ListForeignCapitalUtilizationRequest) => {
    setLoading(true);
    const res = await primeApi.listForeignCapitalUtilization(params);
    const data = res?.records || [];

    // 将"全市"数据排在第一行
    const sortedData = data.sort((a: any, b: any) => {
      if (a.area === '全   市') return -1;
      if (b.area === '全   市') return 1;
      return 0;
    });

    setDataSource(sortedData);
    setLoading(false);
  };

  // 表单提交处理
  const onFinish = (values: FieldType) => {
    console.log('查询条件:', values);
    loadData({
      year: year,
      month: month,
      page: 1,
      size: 500,
    });
  };

  // 重置表单（默认 2025 年 12 月）
  const onReset = () => {
    form.resetFields();
    setYear(2025);
    setMonth(12);
    form.setFieldsValue({
      year: 2025,
      month: 12,
    });
    loadData({
      year: 2025,
      month: 12,
      page: 1,
      size: 500,
    });
  };

  // 图表引用
  const barChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const lineChartRef = useRef<HTMLDivElement>(null);
  const regionPieChartRef = useRef<HTMLDivElement>(null);

  // 视图切换状态
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  // 初始化柱状图
  const initBarChart = () => {
    if (!barChartRef.current || !dataSource.length) return;

    const chart = echarts.init(barChartRef.current);

    const areas = dataSource.filter((item) => item.area !== '全   市').map((item) => item.area);
    const actualData = dataSource
      .filter((item) => item.area !== '全   市')
      .map((item) => parseFloat(item.actuallyUtilizedForeignCapitalAmount) || 0);
    const contractData = dataSource
      .filter((item) => item.area !== '全   市')
      .map((item) => parseFloat(item.contractedForeignCapitalAmount) || 0);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['实际使用外资', '合同外资'],
        // top: 30,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '0%',
        // top: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: areas,
        axisLabel: {
          rotate: 45,
          formatter: function (value: any) {
            return value === '医药高新区（高港区）' ? '医药高新区' : value;
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '金额(万美元)',
        min: -9000,
        max: 21000,
        interval: 3000,
      },
      series: [
        {
          name: '实际使用外资',
          type: 'bar',
          data: actualData,
          itemStyle: {
            color: '#5470c6',
          },
        },
        {
          name: '合同外资',
          type: 'bar',
          data: contractData,
          itemStyle: {
            color: '#91cc75',
          },
        },
      ],
    };

    chart.setOption(option);

    // 响应式处理
    const resizeChart = () => chart.resize();
    window.addEventListener('resize', resizeChart);
  };

  // 初始化饼图
  const initPieChart = () => {
    if (!pieChartRef.current || !dataSource.length) return;

    const chart = echarts.init(pieChartRef.current);

    // 排除"全市"数据，获取各区域的合同外资金额
    const filteredData = dataSource.filter((item) => item.area !== '全   市');

    // 计算总的合同外资金额
    // const totalAmount = filteredData.reduce((sum, item) => {
    //   return sum + (parseFloat(item.contractedForeignCapitalAmount) || 0);
    // }, 0);

    // 计算各区域数据
    const pieData = filteredData
      .map((item) => {
        const amount = parseFloat(item.actuallyUtilizedForeignCapitalAmount) || 0;
        return {
          name: item.area,
          value: amount,
        };
      })
      .filter((item) => item.value > 0);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: function (params: any) {
          const { name, value, percent } = params;
          return `占比<br/>${name}: ${value}万美元 (${percent}%)`;
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        // top: 'middle',
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

  // 初始化地区分布扇形图
  const initRegionPieChart = () => {
    if (!regionPieChartRef.current) return;

    const chart = echarts.init(regionPieChartRef.current);

    // 地区分布数据
    const regionData = [
      { name: '香港', value: 329 },
      { name: '台湾', value: 74 },
      { name: '美国', value: 71 },
      { name: '新加坡', value: 42 },
      { name: '日本', value: 41 },
      { name: '韩国', value: 39 },
      { name: '英国', value: 17 },
      { name: '德国', value: 16 },
      { name: '加拿大', value: 16 },
      { name: '澳大利亚', value: 11 },
      { name: '萨摩亚', value: 11 },
      { name: '英属维尔京群岛', value: 23 },
      { name: '其他', value: 104 },

    ];

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}个 ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '地区分布',
          type: 'pie',
          radius: '50%',
          center: ['60%', '51%'],
          data: regionData,
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

  // 初始化折线图
  const initLineChart = () => {
    if (!lineChartRef.current || !dataSource.length) return;

    const chart = echarts.init(lineChartRef.current);

    const areas = dataSource.filter((item) => item.area !== '全   市').map((item) => item.area);
    const enterpriseCountData = dataSource
      .filter((item) => item.area !== '全   市')
      .map((item) => parseInt(item.newEnterpriseCountCurrent) || 0);

    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{a} <br/>{b}: {c}个',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: areas,
        axisLabel: {
          rotate: 45,
          formatter: function (value: any) {
            return value === '医药高新区（高港区）' ? '医药高新区' : value;
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '企业数量(个)',
        min: 0,
        max: 80,
        interval: 20,
      },
      series: [
        {
          name: '新设外资企业数',
          type: 'bar',
          data: enterpriseCountData,
          itemStyle: {
            color: '#5470c6'
          },
        },
      ],
    };

    chart.setOption(option);

    // 响应式处理
    const resizeChart = () => chart.resize();
    window.addEventListener('resize', resizeChart);
  };

  useEffect(() => {
    loadData({
      year: 2025,
      month: 12,
      page: 1,
      size: 500,
    });
  }, []);

  // 当数据更新时初始化图表
  useEffect(() => {
    if (dataSource.length > 0) {
      // 清理之前的图表实例
      if (barChartRef.current) {
        const existingChart = echarts.getInstanceByDom(barChartRef.current);
        if (existingChart) {
          existingChart.dispose();
        }
      }
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
      if (regionPieChartRef.current) {
        const existingChart = echarts.getInstanceByDom(regionPieChartRef.current);
        if (existingChart) {
          existingChart.dispose();
        }
      }

      // 延迟初始化新图表
      const timer = setTimeout(() => {
        initBarChart();
        initPieChart();
        initLineChart();
        initRegionPieChart();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [dataSource]);

  // 监听视图模式变化，重新初始化图表
  useEffect(() => {
    if (viewMode === 'chart' && dataSource.length > 0) {
      // 延迟初始化图表，确保DOM已渲染
      const timer = setTimeout(() => {
        initBarChart();
        initPieChart();
        initLineChart();
        initRegionPieChart();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [viewMode, dataSource]);

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


        <Breadcrumb className={`${styles.mb15} ${styles.breadcrumbLarge}`}>
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-2)}><HomeOutlined className={styles.breadcrumbLarge} /></a> 首页</Breadcrumb.Item>
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-1)}>前期招商</a></Breadcrumb.Item>
          <Breadcrumb.Item >利用外资</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>泰州市利用外资情况</h1>
        {/* <p className={styles.pageSubtitle}>展示各市(区)利用外资情况</p> */}

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
                year: year,
                month: month,
              }}
            >
              <Row>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px',
                  }}
                  label="所属年份"
                  name="year"
                >
                  <Select
                    onChange={changeYear}
                    options={[
                      {
                        value: 2023,
                        label: '2023',
                      },
                      {
                        value: 2024,
                        label: '2024',
                      },
                      {
                        value: 2025,
                        label: '2025',
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px',
                  }}
                  label="所属月份"
                  name="month"
                >
                  <Select
                    onChange={changeMonth}
                    options={[
                      {
                        value: 1,
                        label: '1',
                      },
                      {
                        value: 2,
                        label: '2',
                      },
                      {
                        value: 3,
                        label: '3',
                      },
                      {
                        value: 4,
                        label: '4',
                      },
                      {
                        value: 5,
                        label: '5',
                      },
                      {
                        value: 6,
                        label: '6',
                      },
                      {
                        value: 7,
                        label: '7',
                      },
                      {
                        value: 8,
                        label: '8',
                      },
                      {
                        value: 9,
                        label: '9',
                      },
                      {
                        value: 10,
                        label: '10',
                      },
                      {
                        value: 11,
                        label: '11',
                      },
                      {
                        value: 12,
                        label: '12',
                      },
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
              className={[styles.chartBtn, viewMode === 'chart' ? styles.active : ''].join(' ')}
              data-view="chart"
              onClick={() => setViewMode('chart')}
              style={{ marginRight: '10px' }}
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
        {viewMode === 'table' && (
          <div className={styles.projectsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>泰州市利用外资情况</div>
            </div>
            <Table
              className={styles.table}
              columns={columns}
              dataSource={dataSource}
              rowKey="area"
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
        {viewMode === 'chart' && (
          <div className={styles.projectsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>利用外资数据分析</div>
            </div>
            <Row gutter={[24, 24]} style={{ padding: '20px 0' }}>
              <Col span={8}>
                <div className={styles.chartCard}>
                  <div className={styles.chartCardHeader}>
                    <h3 className={styles.chartCardTitle}>外资使用情况</h3>
                  </div>
                  <div ref={barChartRef} style={{ width: '100%', height: '300px' }}></div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.chartCard}>
                  <div className={styles.chartCardHeader}>
                    <h3 className={styles.chartCardTitle}>外资占比分布</h3>
                  </div>
                  <div ref={pieChartRef} style={{ width: '100%', height: '300px' }}></div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.chartCard}>
                  <div className={styles.chartCardHeader}>
                    <h3 className={styles.chartCardTitle}>新设外资企业数</h3>
                  </div>
                  <div ref={lineChartRef} style={{ width: '100%', height: '300px' }}></div>
                </div>
              </Col>
            </Row>
            <Row gutter={[24, 24]} style={{ padding: '20px 0' }}>
              <Col span={8}>
                <div className={styles.chartCard}>
                  <div className={styles.chartCardHeader}>
                    <h3 className={styles.chartCardTitle}>外资项目来源地</h3>
                  </div>
                  <div ref={regionPieChartRef} style={{ width: '100%', height: '300px' }}></div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForeignInvestment;
