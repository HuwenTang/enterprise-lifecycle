import React, {useEffect, useState} from 'react';
import { Button, Table, Breadcrumb, Form, Row, Select, DatePicker, ConfigProvider, Space } from 'antd';
import { ArrowLeftOutlined, BuildOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import {primeApi} from "@/services/api";
import {ProjectDcdxCompletionInvestmentVo} from "@/services/apis";
import { ProjectFagaiKeyProjectsStatsMergedVo } from '@/services/apis/models/ProjectFagaiKeyProjectsStatsMergedVo';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';

// 表单字段类型定义
interface FieldType {
  type?: number;
  date?: any;
  industryChain?: string;
}

const InvestmentDetail: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/tutorial/tou-chan-da-xiao');
  };

  // 当前选择的视图类型，默认选择市区
  const [currentView, setCurrentView] = useState<string>('city');
  const [dataSource, setDataSource] = useState<any[]>([]) // 支持多种数据类型
  const [industryGroupList, setIndustryGroupList] = useState<Array<{key: string, value: string}>>([]);
  // 表格加载状态
  const [loading, setLoading] = useState<boolean>(false)
  // 排序状态
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);
  // 展开状态
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 查询条件状态
  const [selectedProjectType, setSelectedProjectType] = useState<number>(4);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedIndustryChain, setSelectedIndustryChain] = useState<string>('');

  const [form] = Form.useForm();

  // 使用与EndWorkDetail一致的数据查询函数
  const getMergedProjectFagaiKeyProjectsStats = async (selectedType?: number, date?: string, industryChain?: string) => {
    try {
      setLoading(true);
      // 使用primeApi的getMergedProjectFagaiKeyProjectsStats接口获取竣工项目数据
      const params: any = {
        status: 2, // 竣工项目状态
        type: selectedType || 4, // 使用传入的类型或默认为4
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

      // 将数据包装成数组并设置展开
      if (data) {
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
      } else {
        setDataSource([]);
      }
    } catch (e) {
      console.error('获取投资完成数据失败:', e);
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  // 表单提交处理
  const onFinish = (values: FieldType) => {
    console.log('查询条件:', values);
    // 更新选中的项目类型
    setSelectedProjectType(values.type || 4);
    // 处理日期，将月份转换为yyyy-MM-01格式
    let dateStr = '';
    if (values.date) {
      dateStr = dayjs(values.date).format('YYYY-MM') + '-01';
      setSelectedDate(dateStr);
    }
    // 使用与EndWorkDetail一致的数据查询方法
    getMergedProjectFagaiKeyProjectsStats(values.type, dateStr, values.industryChain);
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
    setSelectedDate('');
    setSelectedIndustryChain('');
    // 重置后使用默认类型重新获取数据（全部）
    const defaultType = 4;
    setSelectedProjectType(defaultType);
    // 设置表单默认值
    form.setFieldsValue({ type: defaultType });
    // 使用与EndWorkDetail一致的数据查询方法
    getMergedProjectFagaiKeyProjectsStats(defaultType);
  };

  // 处理排序
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field && sorter.order) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);

      // 创建一个新的数据数组进行排序
      const sortedData = [...dataSource].sort((a, b) => {
        const valueA = a[sorter.field as keyof ProjectDcdxCompletionInvestmentVo] as number || 0;
        const valueB = b[sorter.field as keyof ProjectDcdxCompletionInvestmentVo] as number || 0;
        return sorter.order === 'ascend' ? valueA - valueB : valueB - valueA;
      });

      setDataSource(sortedData);
    } else if (!sorter.field) {
      // 清除排序，重新获取数据
      setSortField(null);
      setSortOrder(null);
      if (currentView === 'city') {
        getMergedProjectFagaiKeyProjectsStats(selectedProjectType, selectedDate, selectedIndustryChain);
      } else if (currentView === 'park') {
        listProjectDcdxCompletionInvestment([], []);
      } else if (currentView === 'industry') {
        getProjectDcdxCompletionInvestmentTreeByIndustrialChain();
      }
    }
  };
  const getProjectDcdxCompletionInvestmentTreeByIndustrialChain = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await primeApi.getProjectDcdxCompletionInvestmentTreeByIndustrialChain();

      // 处理数据，添加key属性用于展开功能，并确保children有正确的key
      const processedData = (data || []).map((item: any, index: number) => {
        const processedItem = {
          ...item,
          key: item.id || `industry-${index}`,
        };

        // 如果有children，为每个child添加key
        if (item.children && Array.isArray(item.children)) {
          processedItem.children = item.children.map((child: any, childIndex: number) => ({
            ...child,
            key: child.id || `${processedItem.key}-child-${childIndex}`,
          }));
        }

        return processedItem;
      });

      console.log('处理后的数据:', processedData);
      console.log('第一项数据:', processedData[0]);
      console.log('第一项是否有children:', processedData[0]?.children);
      console.log('第一项children长度:', processedData[0]?.children?.length);

      setDataSource(processedData);

      // 设置展开第一级
      const getFirstLevelKeys = (data: any[]): React.Key[] => {
        const keys: React.Key[] = [];
        data.forEach(item => {
          if (item.key) {
            keys.push(item.key);
          }
        });
        return keys;
      };

      setExpandedKeys(getFirstLevelKeys(processedData));
    } catch (e) {
      console.error('获取产业链投资数据失败:', e);
    } finally {
      setLoading(false);
    }
  };

  const listProjectDcdxCompletionInvestment = async (district?: string[], park?: string[], industryGroup?: string[]): Promise<void> => {
    try {
      // 设置加载状态为true
      setLoading(true);
      // 当按产业链查询时，使用industryGroupList作为industryGroup参数
      const params = {
        district: currentView === 'industry' ? []:['兴化市', '姜堰区', '新高区', '泰兴市', '海陵区', '靖江市','泰州市'],
        park: currentView === 'park' ? [] : ['合计'],
        industryGroup: currentView === 'industry' ? industryGroupList.map(item => item.value) : [],
        page: 1,
        size: 100,
      };
      const data = await primeApi.listProjectDcdxCompletionInvestment(params);
      setDataSource(data.records || [])
    }catch (e){
      console.error('获取投资完成数据失败:', e);
    } finally {
      // 无论成功失败，都设置加载状态为false
      setLoading(false);
    }
  };

  const listIndustryGroup = async (): Promise<void> => {
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
        listProjectDcdxCompletionInvestment();
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
        listProjectDcdxCompletionInvestment();
      }
    }
  };
  // 处理视图切换
  const handleViewChange = (view: string) => {
    setCurrentView(view);
    // 不再立即调用listProjectDcdxCompletionInvestment，由useEffect处理视图变化后的重新获取数据
  };

  // 定义表格列配置，根据当前视图类型动态显示或隐藏列
  const getColumns = (): any[] => {
    // 市区视图使用EndWorkDetail的列配置
    if (currentView === 'city') {
      const baseColumns: any[] = [
        {
          title: '市（区）',
          dataIndex: 'city',
          key: 'city',
          width: 200,
          fixed: 'left' as const,
          ellipsis: true,
          render: (text: string | undefined) => {
            return text || '--';
          },
        },
        {
          title: '园区',
          dataIndex: 'park',
          key: 'park',
          width: 150,
          fixed: 'left' as const,
          ellipsis: true,
          render: (text: string | undefined) => {
            return text || '--';
          },
        },
        {
          title: '所属产业链群',
          dataIndex: 'industrialChainCluster',
          key: 'industrialChainCluster',
          width: 150,
          fixed: 'left' as const,
          ellipsis: true,
          render: (text: string | undefined) => {
            return text || '--';
          },
        },
      ];

      // 根据选择的项目类型决定显示哪些列
      if (selectedProjectType === 4) {
        // 全部：显示全部列
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
              title: '实际完成投资（亿元）',
              dataIndex: 'plannedInvestmentTotal2',
              key: 'plannedInvestmentTotal2',
              width: 150,
              sorter: (a: any, b: any) => (a.plannedInvestmentTotal2 || 0) - (b.plannedInvestmentTotal2 || 0),
              render: (text: number | undefined) => {
                return text ? (text / 10000).toFixed(2) : '0.00';
              },
            },
            {
              title: '入库投资额（亿元）',
              dataIndex: 'inInvest2',
              key: 'inInvest2',
              width: 180,
              sorter: (a: any, b: any) => (a.inInvest2 || 0) - (b.inInvest2 || 0),
              render: (text: number | undefined) => {
                return text ? (text / 10000).toFixed(2) : '0.00';
              },
            },
            {
              title: '投资完成率',
              dataIndex: 'ratio2',
              key: 'ratio2',
              width: 180,
              sorter: (a: any, b: any) => (a.ratio2 || 0) - (b.ratio2 || 0),
              render: (text: number | undefined) => {
                return text ? (text * 100).toFixed(2) + '%' : '0.00%';
              },
            },
          ],
        });
      } else if (selectedProjectType === 1) {
        // 重点项目
        baseColumns.push({
          title: '重点项目',
          key: 'keyProjects',
          children: [
            {
              title: '数量',
              dataIndex: 'projectCountTotal1',
              key: 'projectCountTotal1',
              width: 120,
              sorter: (a: any, b: any) => (a.projectCountTotal1 || 0) - (b.projectCountTotal1 || 0),
              render: (text: number | undefined) => {
                return text || 0;
              },
            },
            {
              title: '实际完成投资（亿元）',
              dataIndex: 'plannedInvestmentTotal1',
              key: 'plannedInvestmentTotal1',
              width: 150,
              sorter: (a: any, b: any) => (a.plannedInvestmentTotal1 || 0) - (b.plannedInvestmentTotal1 || 0),
              render: (text: number | undefined) => {
                return text ? (text / 10000).toFixed(2) : '0.00';
              },
            },
            {
              title: '入库投资额（亿元）',
              dataIndex: 'inInvest1',
              key: 'inInvest1',
              width: 180,
              sorter: (a: any, b: any) => (a.inInvest1 || 0) - (b.inInvest1 || 0),
              render: (text: number | undefined) => {
                return text ? (text / 10000).toFixed(2) : '0.00';
              },
            },
            {
              title: '投资完成率',
              dataIndex: 'ratio1',
              key: 'ratio1',
              width: 180,
              sorter: (a: any, b: any) => (a.ratio1 || 0) - (b.ratio1 || 0),
              render: (text: number | undefined) => {
                return text ? (text * 100).toFixed(2) + '%' : '0.00%';
              },
            },
          ],
        });
      } else if (selectedProjectType === 2) {
        // 1亿元项目
        baseColumns.push({
          title: '1亿元项目',
          key: 'billionYuanProjects',
          children: [
            {
              title: '数量',
              dataIndex: 'projectCountTotal2',
              key: 'projectCountTotal2',
              width: 120,
              sorter: (a: any, b: any) => (a.projectCountTotal2 || 0) - (b.projectCountTotal2 || 0),
              render: (text: number | undefined) => {
                return text || 0;
              },
            },
            {
              title: '实际完成投资（亿元）',
              dataIndex: 'plannedInvestmentTotal2',
              key: 'plannedInvestmentTotal2',
              width: 150,
              sorter: (a: any, b: any) => (a.plannedInvestmentTotal2 || 0) - (b.plannedInvestmentTotal2 || 0),
              render: (text: number | undefined) => {
                return text ? (text / 10000).toFixed(2) : '0.00';
              },
            },
            {
              title: '入库投资额（亿元）',
              dataIndex: 'inInvest2',
              key: 'inInvest2',
              width: 180,
              sorter: (a: any, b: any) => (a.inInvest2 || 0) - (b.inInvest2 || 0),
              render: (text: number | undefined) => {
                return text ? (text / 10000).toFixed(2) : '0.00';
              },
            },
            {
              title: '投资完成率',
              dataIndex: 'ratio2',
              key: 'ratio2',
              width: 180,
              sorter: (a: any, b: any) => (a.ratio2 || 0) - (b.ratio2 || 0),
              render: (text: number | undefined) => {
                return text ? (text * 100).toFixed(2) + '%' : '0.00%';
              },
            },
          ],
        });
      } else if (selectedProjectType === 3) {
        // 10亿元项目
        baseColumns.push({
          title: '10亿元项目',
          key: 'tenBillionYuanProjects',
          children: [
            {
              title: '数量',
              dataIndex: 'projectCountTotal2',
              key: 'projectCountTotal2',
              width: 120,
              sorter: (a: any, b: any) => (a.projectCountTotal2 || 0) - (b.projectCountTotal2 || 0),
              render: (text: number | undefined) => {
                return text || 0;
              },
            },
            {
              title: '实际完成投资（亿元）',
              dataIndex: 'plannedInvestmentTotal2',
              key: 'plannedInvestmentTotal2',
              width: 150,
              sorter: (a: any, b: any) => (a.plannedInvestmentTotal2 || 0) - (b.plannedInvestmentTotal2 || 0),
              render: (text: number | undefined) => {
                return text ? (text / 10000).toFixed(2) : '0.00';
              },
            },
            {
              title: '入库投资额（亿元）',
              dataIndex: 'inInvest2',
              key: 'inInvest2',
              width: 180,
              sorter: (a: any, b: any) => (a.inInvest2 || 0) - (b.inInvest2 || 0),
              render: (text: number | undefined) => {
                return text ? (text / 10000).toFixed(2) : '0.00';
              },
            },
            {
              title: '投资完成率',
              dataIndex: 'ratio2',
              key: 'ratio2',
              width: 180,
              sorter: (a: any, b: any) => (a.ratio2 || 0) - (b.ratio2 || 0),
              render: (text: number | undefined) => {
                return text ? (text * 100).toFixed(2) + '%' : '0.00%';
              },
            },
          ],
        });
      }

      return baseColumns;
    }

    // 其他视图保留原有的列配置
    const baseColumns = [
      {
        title: '竣工项目数',
        dataIndex: 'completedProjectCount',
        key: 'completedProjectCount',
        width: 100,
        sorter: (a: any, b: any) => (a.completedProjectCount || 0) - (b.completedProjectCount || 0),
      },
      {
        title: '竣工项目投资情况',
        key: 'investment',
        children: [
          {
            title: '签约投资额',
            key: 'signedInvestment',
            children: [
              {
                title: '金额（亿元）',
                dataIndex: 'signedInvestment',
                key: 'signedInvestment',
                width: 120,
                sorter: (a: any, b: any) => (a.signedInvestment || 0) - (b.signedInvestment || 0),
                render: (text: number | undefined) => {
                  return text ? (text / 10000).toFixed(2) : '0.00';
                },
              },
            ],
          },
          {
            title: '完成投资额',
            key: 'completedInvestment',
            children: [
              {
                title: '竣工认定完成投资（亿元）',
                dataIndex: 'completedInvestment',
                key: 'completedInvestment',
                width: 150,
                sorter: (a: any, b: any) => (a.completedInvestment || 0) - (b.completedInvestment || 0),
                render: (text: number | undefined) => {
                  return text ? (text / 10000).toFixed(2) : '0.00';
                },
              },
              {
                title: '其中固定资产投资（亿元）',
                dataIndex: 'fixedAssetInvestment',
                key: 'fixedAssetInvestment',
                width: 150,
                sorter: (a: any, b: any) => (a.fixedAssetInvestment || 0) - (b.fixedAssetInvestment || 0),
                render: (text: number | undefined) => {
                  return text ? (text / 10000).toFixed(2) : '0.00';
                },
              },
            ],
          },
        ],
      },
      {
          title: '投资完成比重',
          dataIndex: 'investmentCompletionRatio',
          key: 'investmentCompletionRatio',
          width: 120,
          sorter: (a: any, b: any) => (a.investmentCompletionRatio || 0) - (b.investmentCompletionRatio || 0),
          render: (text: number | undefined) => {
            return text ? (text * 100).toFixed(2) + '%' : '0%';
          },
        },
    ];

    // 根据视图类型动态添加列
    if (currentView === 'park') {
      // 园区视图添加市区和园区列
      baseColumns.splice(0, 0, {
        title: '19个园区',
        dataIndex: 'park',
        key: 'park',
        width: 180,
        ellipsis: true,
        sorter: (a: any, b: any) => {
          const parkA = a.park || '';
          const parkB = b.park || '';
          return parkA.localeCompare(parkB);
        },
      });
      baseColumns.splice(0, 0, {
        title: '市（区）',
        dataIndex: 'district',
        key: 'district',
        width: 180,
        ellipsis: true,
      });
    } else if (currentView === 'industry') {
      // 产业链视图仅添加所属产业链群列，不显示市区和园区列
      baseColumns.splice(0, 0, {
        title: '所属产业链群',
        dataIndex: 'industrialChainCluster',
        key: 'industrialChainCluster',
        width: 200,
        ellipsis: true,
        render: (_: string | undefined, record: any, index: number): React.ReactNode => {
            // 使用record中的industrialChainCluster值查找对应的key
            const industrialChainClusterValue = record.industrialChainCluster;
            if (!industrialChainClusterValue) return '';

            // 根据value查找对应的key
            const industryItem = industryGroupList.find(item => item.value === industrialChainClusterValue);
            return industryItem ? industryItem.key : industrialChainClusterValue;
          }
      });
    }

    return baseColumns;
  };

  // 定义表格数据源

  useEffect(() => {
    listIndustryGroup()
    // 初始加载时，如果是市区视图，使用与EndWorkDetail一致的数据查询方法
    if (currentView === 'city') {
      getMergedProjectFagaiKeyProjectsStats(4);
    } else {
      listProjectDcdxCompletionInvestment()
    }
  }, []);
  // 切换视图时重新获取数据
  useEffect(() => {
    if (currentView === 'city') {
      // 市区视图使用与EndWorkDetail一致的数据查询方法
      getMergedProjectFagaiKeyProjectsStats(4); // 默认使用全部类型
    } else if (currentView === 'park') {
      listProjectDcdxCompletionInvestment([], []);
    } else if (currentView === 'industry') {
      // 产业链视图，使用专门的产业链数据获取函数
      getProjectDcdxCompletionInvestmentTreeByIndustrialChain();
    }
  }, [currentView]);

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
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-2)}><HomeOutlined style={{ marginRight: '10px', fontSize: '20px' }} /> 首页</a></Breadcrumb.Item>
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-1)}>投产达效</a></Breadcrumb.Item>
          <Breadcrumb.Item>完成投资</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>完成投资表</h1>
        {/* <p className={styles.pageSubtitle}>展示各市(区)、园区和产业链群的竣工项目投资情况</p> */}

        {/* 查询条件表单 - 仅在市区视图时显示 */}
        {currentView === 'city' && (
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
                          label: '市级重点',
                        },
                        // {
                        //   value: 2,
                        //   label: '1亿元',
                        // },
                        // {
                        //   value: 3,
                        //   label: '10亿元',
                        // },
                      ]}
                    />
                  </Form.Item>

                  {/*<Form.Item*/}
                  {/*  style={{*/}
                  {/*    width: '25%',*/}
                  {/*    marginLeft: '20px',*/}
                  {/*  }}*/}
                  {/*  label="产业链"*/}
                  {/*  name="industryChain"*/}
                  {/*>*/}
                  {/*  <Select*/}
                  {/*    placeholder="请选择产业链"*/}
                  {/*    style={{ width: '100%' }}*/}
                  {/*    allowClear*/}
                  {/*    options={[*/}
                  {/*      { value: '医药', label: '医药' },*/}
                  {/*      { value: '医疗器械', label: '医疗器械' },*/}
                  {/*      { value: '特医及功能性食品', label: '特医及功能性食品' },*/}
                  {/*      { value: '农副食品深加工及预制菜', label: '农副食品深加工及预制菜' },*/}
                  {/*      { value: '海洋工程装备', label: '海洋工程装备' },*/}
                  {/*      { value: '高技术船舶', label: '高技术船舶' },*/}
                  {/*      { value: '汽车及零部件', label: '汽车及零部件' },*/}
                  {/*      { value: '电子信息', label: '电子信息' },*/}
                  {/*      { value: '智能装备', label: '智能装备' },*/}
                  {/*      { value: '节能环保', label: '节能环保' },*/}
                  {/*      { value: '化工及新材料', label: '化工及新材料' },*/}
                  {/*      { value: '金属新材料及制品', label: '金属新材料及制品' },*/}
                  {/*      { value: '新能源', label: '新能源' },*/}
                  {/*      { value: '合成生物', label: '合成生物' },*/}
                  {/*      { value: '细胞和基因技术', label: '细胞和基因技术' },*/}
                  {/*      { value: '前沿新材料', label: '前沿新材料' },*/}
                  {/*      { value: '新型储能', label: '新型储能' },*/}
                  {/*      { value: '深海深地空天装备', label: '深海深地空天装备' },*/}
                  {/*      { value: '人工智能', label: '人工智能' },*/}
                  {/*      { value: '氢能', label: '氢能' },*/}
                  {/*    ]}*/}
                  {/*  />*/}
                  {/*</Form.Item>*/}
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
        )}

        <div className={styles.projectsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>完成投资统计</div>
            <div className={styles.tableActions}>
              <div className={styles.filterControls}>
                <Button
                  className={[styles.chartBtn, currentView === 'city' ? styles.active : ''].join(' ')}
                  data-view="city"
                  onClick={() => handleViewChange('city')}
                >
                  按市(区)
                </Button>
                <Button
                  className={[styles.chartBtn, currentView === 'industry' ? styles.active : ''].join(' ')}
                  data-view="industry"
                  onClick={() => handleViewChange('industry')}
                >
                  按产业链
                </Button>
              </div>
            </div>
          </div>
          <Table
            className={styles.table}
            columns={getColumns()}
            dataSource={dataSource}
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
            rowClassName={(record) => {
              // 如果产业链名称包含任一关键词，则高亮
              if (record.isLq) {
                return 'table-row-highlighted'; // 返回全局类名（不要加 styles.）
              }
              return '';
            }}
            onChange={handleTableChange}
            sortField={sortField}
            sortOrder={sortOrder}
            expandable={(currentView === 'industry' || currentView === 'city') ? {
              childrenColumnName: 'children',
              rowExpandable: (record: any) => {
                console.log('检查行是否可展开:', record.key, record.children?.length);
                return record.children && Array.isArray(record.children) && record.children.length > 0;
              },
              expandedRowKeys: expandedKeys,
              onExpandedRowsChange: (keys: readonly React.Key[]) => {
                console.log('展开状态变化:', keys);
                setExpandedKeys([...keys]);
              },
            } : undefined}
            rowKey={(record) => record.key || record.id || `row-${Math.random()}`}
          />
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetail;
