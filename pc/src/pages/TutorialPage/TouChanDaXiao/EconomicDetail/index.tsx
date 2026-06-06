import React, {useEffect, useState} from 'react';
import { Button, Table, Breadcrumb, Form, Row, Select, Space } from 'antd';
import { ArrowLeftOutlined,HomeOutlined, DownloadOutlined, FilterOutlined, BuildOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import {primeApi} from "@/services/api";
import {ProjectDcdxEconomicPerformanceStatsVo} from "@/services/apis";
import type { SorterResult } from 'antd/es/table/interface';

// 表单字段类型定义
interface FieldType {
  year?: number;
}

const EconomicDetail: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/tutorial/tou-chan-da-xiao');
  };

  const goBackHome = () => {
    navigate('/tutorial');
  };

  // 当前选择的视图类型，默认选择市区
  const [currentView, setCurrentView] = useState<string>('city');
  const [dataSource, setDataSource] = useState<ProjectDcdxEconomicPerformanceStatsVo[]>([])
  const [industryGroupList, setIndustryGroupList] = useState<{key: string, value: string}[]>([])
  // 表格加载状态
  const [loading, setLoading] = useState<boolean>(false)
  // 排序状态
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | undefined>(undefined);
  // 查询条件状态
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const [form] = Form.useForm();

  // 表单提交处理
  const onFinish = (values: FieldType) => {
    console.log('查询条件:', values);
    const year = values.year || 2024;
    setSelectedYear(year);
    // 重新加载数据
    listProjectDcdxEconomicPerformanceStats();
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
    const defaultYear = 2024;
    setSelectedYear(defaultYear);
    form.setFieldsValue({ year: defaultYear });
    // 重新加载数据
    listProjectDcdxEconomicPerformanceStats();
  };

  const listProjectDcdxEconomicPerformanceStats = async () => {
    try {
      // 设置加载状态为true
      setLoading(true);
      // 根据当前视图类型设置不同的查询参数
      const params = {
        year: selectedYear,
        district: currentView === 'industry' ? []:['兴化市', '姜堰区', '新高区', '泰兴市', '海陵区', '靖江市','泰州市'],
        // district: currentView === 'industry' ? []:['兴化市', '姜堰区', '新高区', '泰兴市', '海陵区', '靖江市'],
        park: currentView === 'park' ? [] : ['合计'],
        industryGroup: currentView === 'industry' ? industryGroupList.map(item => item.value) : [],
        page: 1,
        size: 100,
      };
      console.log('调用API参数:', params);
      // const data = await primeApi.listProjectDcdxEconomicPerformanceStats(params);
      const data = await primeApi.listProjectDcdxEconomicPerformanceStats(params);

      let records = data.records || [];

      // 客户端排序
      if (sortField && sortOrder) {
        records = [...records].sort((a: any, b: any) => {
          const aValue = a[sortField] || 0;
          const bValue = b[sortField] || 0;

          // 处理数字类型的排序
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'ascend' ? aValue - bValue : bValue - aValue;
          }

          // 处理字符串类型的排序
          return sortOrder === 'ascend'
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        });
      }

      setDataSource(records);
    }catch (e){
      console.error('获取产出效益数据失败:', e);
    } finally {
      // 无论成功失败，都设置加载状态为false
      setLoading(false);
    }
  };

  const listIndustryGroup = async () => {
    try {
      // 使用primeApi的listIndustryGroup方法获取产业链列表
      const data = await primeApi.listIndustryGroup();

      // 提取返回数组中的key和value，添加类型安全检查
      let groupList: {key: string, value: string}[] = [];
      if (Array.isArray(data)) {
        groupList = data.map((item: any) => {
          return {
            key: typeof item.key === 'string' ? item.key : String(item.key || item.value),
            value: typeof item.value === 'string' ? item.value : String(item.value)
          };
        });
      }
      setIndustryGroupList(groupList);

      // 如果当前是产业链视图，使用获取到的产业链列表重新获取数据
      if (currentView === 'industry') {
        listProjectDcdxEconomicPerformanceStats();
      }
    } catch (e) {
      console.error('获取产业链列表失败:', e);
      // 出错时使用默认的产业链列表
      setIndustryGroupList([
        {key: '电子信息', value: '电子信息'},
        {key: '高端装备', value: '高端装备'},
        {key: '生物医药', value: '生物医药'},
        {key: '新能源', value: '新能源'}
      ]);
      if (currentView === 'industry') {
        listProjectDcdxEconomicPerformanceStats();
      }
    }
  };



  // 处理表格排序
  const handleTableChange = (_pagination: any, _filters: any, sorter: SorterResult<any>) => {
    setSortField(sorter.field as string);
    setSortOrder(sorter.order);
    listProjectDcdxEconomicPerformanceStats();
  };

  // 定义表格列配置，根据当前视图类型动态显示或隐藏列
  const dataSource2 = [
    {
      district: '泰州市',endNum:128,invoiceNum:947.99,taxNum:44.70,outputNum:1076.03,revenueNum:1005.62,profitNum:98.64,projectCount2024:139,
    },
    {
      district: '靖江市',endNum:22,invoiceNum:69.02,taxNum:2.14,outputNum:167.92,revenueNum:143.98,profitNum:7.64,projectCount2024:23,
    },
    {
      district: '泰兴市',endNum:34,invoiceNum:303.16,taxNum:14.07,outputNum:307.33,revenueNum:308.43,profitNum:51.41,projectCount2024:37,
    },
    {
      district: '兴化市',endNum:12,invoiceNum:115.24,taxNum:6.11,outputNum:121.06,revenueNum:120.35,profitNum:6.27,projectCount2024:12,
    },
    {
      district: '海陵区',endNum:14,invoiceNum:117.38,taxNum:4.09,outputNum:109.64,revenueNum:100.84,profitNum:5.36,projectCount2024:17,
    },
    {
      district: '姜堰区',endNum:19,invoiceNum:83.84,taxNum:4.16,outputNum:87.19,revenueNum:85.20,profitNum:6.75,projectCount2024:21,
    },
    {
      district: '医药高新区（高港区）',endNum:27,invoiceNum:259.35,taxNum:14.13,outputNum:282.89,revenueNum:246.82,profitNum:21.22,projectCount2024:29,
    },
  ]


  const getYearColumns = () => [
    {
      title: '所属市区',
      dataIndex: 'district',
      key: 'district',
      width: 180,
      ellipsis: true,
      // 排除市区列排序
    },
    {
      title: <>{selectedYear}年竣工<br />项目数（个）</>,
      dataIndex: 'projectCount2024',
      key: 'projectCount2024',
      width: 120,
      sorter: (a: any, b: any) => (a.projectCount2024 || 0) - (b.projectCount2024 || 0),
      render: (text: number | undefined ) => {
        return text ? text.toLocaleString() : '0';
      },
    },
    {
      title: <>{selectedYear}年竣工<br />企业数（个）</>,
      dataIndex: 'endNum',
      key: 'endNum',
      width: 100,
      sorter: (a: any, b: any) => (a.endNum || 0) - (b.endNum || 0),
      render: (text: number | undefined) => {
        return text ? text.toLocaleString() : '0';
      },
    },
    {
      title: <>{selectedYear}年开票<br />（亿元）</>,
      dataIndex: 'invoiceNum',
      key: 'invoiceNum',
      width: 100,
      sorter: (a: any, b: any) => (a.invoiceNum || 0) - (b.invoiceNum || 0),
      render: (text: number | undefined) => {
        return text ? Math.round(text).toLocaleString() : '0';
      },
    },
    {
      title: <>{selectedYear}年税收<br />（亿元）</>,
      dataIndex: 'taxNum',
      key: 'taxNum',
      width: 100,
      sorter: (a: any, b: any) => (a.taxNum || 0) - (b.taxNum || 0),
      render: (text: number | undefined) => {
        return text ? Math.round(text).toLocaleString() : '0';
      },
    },
    {
      title: <>{selectedYear}年产值<br />（亿元）</>,
      dataIndex: 'outputNum',
      key: 'outputNum',
      width: 100,
      sorter: (a: any, b: any) => (a.outputNum || 0) - (b.outputNum || 0),
      render: (text: number | undefined) => {
        return text ? Math.round(text).toLocaleString() : '0';
      },
    },
    {
      title: <>{selectedYear}年营收<br />（亿元）</>,
      dataIndex: 'revenueNum',
      key: 'revenueNum',
      width: 100,
      sorter: (a: any, b: any) => (a.revenueNum || 0) - (b.revenueNum || 0),
      render: (text: number | undefined) => {
        return text ? Math.round(text).toLocaleString() : '0';
      },
    },
    {
      title: <>{selectedYear}年利润<br />（亿元）</>,
      dataIndex: 'profitNum',
      key: 'profitNum',
      width: 100,
      sorter: (a: any, b: any) => (a.profitNum || 0) - (b.profitNum || 0),
      render: (text: number | undefined) => {
        return text ? Math.round(text).toLocaleString() : '0';
      },
    },
  ]

  // 定义表格数据源

  useEffect(() => {
    listIndustryGroup()
    listProjectDcdxEconomicPerformanceStats()
  }, []);

  // 切换视图或年份时重新获取数据
  useEffect(() => {
    if (currentView === 'city') {
      listProjectDcdxEconomicPerformanceStats();
    } else if (currentView === 'park') {
      listProjectDcdxEconomicPerformanceStats();
    } else if (currentView === 'industry') {
      // 产业链视图，先获取产业链列表
      listIndustryGroup();
    }
  }, [currentView, selectedYear]);
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
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-2)}><HomeOutlined style={{ fontSize: '20px',marginRight: '10px' }} /> 首页</a></Breadcrumb.Item>
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-1)}>投产达效</a></Breadcrumb.Item>
          <Breadcrumb.Item>产出效益</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>{selectedYear}年产出效益表</h1>
        {/* <p className={styles.pageSubtitle}>展示产出效益情况</p> */}

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
            >
              <Row>
                <Form.Item
                  style={{
                    width: '25%',
                    marginLeft: '20px',
                  }}
                  label="年份"
                  name="year"
                  initialValue={2024}
                >
                  <Select
                    placeholder="请选择年份"
                    style={{ width: '100%' }}
                    options={[
                      {
                        value: 2024,
                        label: '2024',
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
                    <Button style={{backgroundColor: '#1a237e'}} type="primary" htmlType="submit">
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
          <div className={styles.tableTitle}>{selectedYear}年产出效益统计</div>
            {/* <div className={styles.tableActions}>
              <div className={styles.filterControls}>
                <Button
                  className={[styles.chartBtn, currentView === 'city' ? styles.active : ''].join(' ')}
                  data-view="city"
                  onClick={() => handleViewChange('city')}
                >
                  按市(区)
                </Button>
                <Button
                  className={[styles.chartBtn, currentView === 'park' ? styles.active : ''].join(' ')}
                  data-view="park"
                  onClick={() => handleViewChange('park')}
                >
                  按园区
                </Button>
                <Button
                  className={[styles.chartBtn, currentView === 'industry' ? styles.active : ''].join(' ')}
                  data-view="industry"
                  onClick={() => handleViewChange('industry')}
                >
                  按产业链
                </Button>
              </div>
            </div> */}
          </div>
            {/* columns={getColumns()} */}
          <Table
            className={styles.table}
            dataSource={dataSource2}
            columns={getYearColumns()}
            pagination={false}
            size="middle"
            loading={loading}
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
            rowClassName={(record) => {
              // 如果产业链名称包含任一关键词，则高亮
              if (record.isLq) {
                console.log('highlighted');
                return 'table-row-highlighted'; // 返回全局类名（不要加 styles.）
              }
              return '';
            }}
            locale={{
              emptyText: '暂无数据',
            }}
          />        </div>

        {/* <div className={styles.footer}>
          <p>企业全生命周期管理服务平台 © 2025 版权所有</p>
        </div> */}
      </div>
    </div>
  );
};

export default EconomicDetail;
