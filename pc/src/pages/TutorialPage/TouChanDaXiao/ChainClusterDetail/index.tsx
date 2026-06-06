import React, { useEffect, useState } from 'react';
import { Button, Table, Breadcrumb, message, Form, DatePicker, Row, Space } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import { primeApi } from "@/services/api";
import dayjs, { Dayjs } from 'dayjs';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

// 默认年份和月份
const DEFAULT_YEAR = 2026;
const DEFAULT_MONTH = 3;

const ChainClusterDetail: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleBack = () => {
    navigate('/tutorial/tou-chan-da-xiao');
  };

  const [dataSource, setDataSource] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [queryMonth, setQueryMonth] = useState<Dayjs>(
    dayjs(`${DEFAULT_YEAR}-${String(DEFAULT_MONTH).padStart(2, '0')}-01`),
  );

  // 获取链群体系数据
  const loadChainClusterData = async (year: number, month: number) => {
    setLoading(true);
    try {
      console.log('调用API参数:', { year, month });

      // 使用getStatIndustryOutputTree接口获取链群体系数据
      const response: any = await primeApi.getStatIndustryOutputTree({
        year,
        month
      });

      console.log('=== API返回的原始数据 ===');
      console.log('response类型:', typeof response);
      console.log('response是否为数组:', Array.isArray(response));
      console.log('response内容:', response);

      // 递归为所有子项添加key属性
      const addKeysToChildren = (item: any, parentKey: string = '', index: number = 0): any => {
        const key = parentKey ? `${parentKey}-${index}` : `item-${index}`;

        console.log(`处理节点: ${item.indicator}, key: ${key}`);
        console.log(`  - children类型:`, typeof item.children);
        console.log(`  - children是数组:`, Array.isArray(item.children));
        console.log(`  - children内容:`, item.children);

        // 处理children：需要将对象或数组转换为数组格式
        let children = undefined;

        if (item.children) {
          // 如果children是数组
          if (Array.isArray(item.children) && item.children.length > 0) {
            console.log(`  - 该节点有${item.children.length}个子节点（数组），递归处理`);
            children = item.children.map((child: any, childIndex: number) =>
              addKeysToChildren(child, key, childIndex)
            );
          }
          // 如果children是对象（非数组），转换为数组
          else if (typeof item.children === 'object' && !Array.isArray(item.children) && Object.keys(item.children).length > 0) {
            console.log(`  - 该节点的children是对象，转换为数组`);
            const childrenArray = Object.values(item.children);
            children = childrenArray.map((child: any, childIndex: number) =>
              addKeysToChildren(child, key, childIndex)
            );
          } else {
            console.log(`  - 该节点没有子节点或children为空`);
          }
        } else {
          console.log(`  - 该节点没有children属性`);
        }

        return {
          ...item,
          key,
          children
        };
      };

      // 处理响应数据 - 树级结构，直接使用根节点的children作为dataSource
      let processedData: any[] = [];

      if (Array.isArray(response)) {
        // 如果返回的是数组
        console.log('response是数组，遍历处理每一项');
        processedData = response.map((item, index) => addKeysToChildren(item, '', index));
      } else if (response) {
        // 如果返回的是单个树形对象，处理根节点并展开其children
        console.log('response是单个对象（树根节点）');
        const rootNode = addKeysToChildren(response, '', 0);
        console.log('处理后的根节点:', rootNode);

        // 使用根节点及其children作为数据源
        // 如果想显示根节点，使用 [rootNode]
        // 如果只想显示子节点，使用 rootNode.children 或 [rootNode]
        processedData = [rootNode];
      }

      console.log('=== 处理后的数据 ===');
      console.log('processedData长度:', processedData.length);
      console.log('processedData内容:', processedData);

      // 打印第一个节点的详细信息
      if (processedData.length > 0) {
        console.log('第一个节点详情:');
        console.log('  - indicator:', processedData[0].indicator);
        console.log('  - key:', processedData[0].key);
        console.log('  - children类型:', typeof processedData[0].children);
        console.log('  - children是否为数组:', Array.isArray(processedData[0].children));
        console.log('  - children长度:', processedData[0].children?.length);
        console.log('  - children内容:', processedData[0].children);
      }

      setDataSource(processedData);

      // 自动展开到第二级
      const getAllExpandableKeys = (data: any[], maxLevel: number = 2): React.Key[] => {
        const keys: React.Key[] = [];
        const traverse = (items: any[], level: number = 0) => {
          items.forEach(item => {
            console.log(`  ${'  '.repeat(level)}检查节点: ${item.indicator}, key: ${item.key}, level: ${level}, children存在: ${!!item.children}, children长度: ${item.children?.length || 0}`);
            if (item.children && item.children.length > 0) {
              // 只展开到maxLevel级（level < maxLevel）
              if (level < maxLevel) {
                console.log(`  ${'  '.repeat(level)}✓ 添加到展开列表: ${item.key}`);
                keys.push(item.key);
                traverse(item.children, level + 1);
              } else {
                console.log(`  ${'  '.repeat(level)}✗ 超过最大层级，不展开: ${item.key}`);
              }
            }
          });
        };
        traverse(data, 0);
        return keys;
      };

      const allKeys = getAllExpandableKeys(processedData, 2);
      console.log('=== 展开的keys ===');
      console.log('展开的keys数量:', allKeys.length);
      console.log('展开的keys:', allKeys);

      setExpandedRowKeys(allKeys);
    } catch (error) {
      console.error('获取链群体系数据失败:', error);
      message.error('获取链群体系数据失败');
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };


  // 定义表格列配置
  const getColumns = () => {
    const baseColumns = [
      {
        title: '指标名称',
        dataIndex: 'indicator',
        key: 'indicator',
        width: 300,
        ellipsis: true,
        render: (text: string | undefined) => {
          return text || '--';
        },
      },
      {
        title: '产值',
        children: [
          {
            title: '本期（亿元）',
            dataIndex: 'current',
            key: 'current',
            width: 120,
            render: (text: number | undefined) => {
              return text !== undefined ? text : '0';
            },
          },
          {
            title: '同期（亿元）',
            dataIndex: 'last',
            key: 'last',
            width: 120,
            render: (text: number | undefined) => {
              return text !== undefined ? text : '0';
            },
          },
          {
            title: '增长（%）',
            dataIndex: 'growth',
            key: 'growth',
            width: 120,
            render: (text: number | undefined) => {
              const value = text || 0;
              const color = value < 0 ? 'red' : 'inherit';
              return <span style={{ color }}>{text !== undefined ? text : '0'}</span>;
            },
          },
        ],
      },
    ];

    return baseColumns;
  };

  const goBackHome = () => {
    navigate(`/tutorial`);
  };

  // 组件加载时获取数据
  useEffect(() => {
    loadChainClusterData(DEFAULT_YEAR, DEFAULT_MONTH);
    form.setFieldsValue({
      month: dayjs(`${DEFAULT_YEAR}-${String(DEFAULT_MONTH).padStart(2, '0')}-01`),
    });
  }, []);

  const onQueryFinish = (values: { month?: Dayjs }) => {
    const m = values?.month ?? dayjs(`${DEFAULT_YEAR}-${String(DEFAULT_MONTH).padStart(2, '0')}-01`);
    setQueryMonth(m);
    loadChainClusterData(m.year(), m.month() + 1);
  };

  const onQueryReset = () => {
    const m = dayjs(`${DEFAULT_YEAR}-${String(DEFAULT_MONTH).padStart(2, '0')}-01`);
    form.setFieldsValue({ month: m });
    setQueryMonth(m);
    loadChainClusterData(DEFAULT_YEAR, DEFAULT_MONTH);
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
          <Breadcrumb.Item>链群体系</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>链群体系个性化数据统计表</h1>
        <p className={styles.pageSubtitle}>{queryMonth.format('YYYY年MM月')}8+13+X链群产业体系</p>

        {/* 查询条件表单 - 年月选择 */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
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
              name="chainClusterQueryForm"
              onFinish={onQueryFinish}
              autoComplete="off"
              initialValues={{ month: queryMonth }}
            >
              <Row>
                <Form.Item
                  style={{ width: '25%', marginLeft: '20px' }}
                  label="所属月份"
                  name="month"
                >
                  <DatePicker
                    picker="month"
                    format="YYYY-MM"
                    locale={zhCN}
                    allowClear={false}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item style={{ marginLeft: '20px' }}>
                  <Space>
                    <Button style={{ backgroundColor: '#1a237e' }} type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button htmlType="button" onClick={onQueryReset}>
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
            <div className={styles.tableTitle}>8+13+X链群产业体系</div>
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
            }}
            rowKey={(record) => record.key}
            expandable={{
              childrenColumnName: 'children',
              expandedRowKeys: expandedRowKeys,
              onExpandedRowsChange: (keys: readonly React.Key[]) => setExpandedRowKeys([...keys]),
              rowExpandable: (record: any) => {
                return record.children && record.children.length > 0;
              },
            }}
          />
        </div>

        {/* <div className={styles.footer}>
          <p>企业全生命周期管理服务平台 © 2025 版权所有</p>
        </div> */}
      </div>
    </div>
  );
};

export default ChainClusterDetail;
