import { primeApi } from '@/services/api';
import { IndustrialChainDistributionTreeVo } from '@/services/apis';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, message, Table, Breadcrumb, Form, Row, Select, Space, ConfigProvider, DatePicker, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './index.module.css';
import zhCN from 'antd/locale/zh_CN';
import dayjs, { Dayjs } from 'dayjs';

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
  innovativeCluster?: string;
  industrialChain?: string;
  innovativeClusterLabel?: string;
  industrialChainLabel?: string;
  projectCount?: number;
  investmentAmount?: number;
  projectProportion?: number;
  investmentProportion?: number;
  district?: string;
  park?: string;
  children?: TreeNodeData[];
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

const ChainDetail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dataSource, setDataSource] = useState<TreeNodeData[]>([]);
  const [summaryData, setSummaryData] = useState<TreeNodeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 存储展开的节点key
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 查询条件状态：月份范围（不能跨年），从 URL 或默认 2025年10月
  const [rangeDate, setRangeDate] = useState<[Dayjs, Dayjs]>(() => getDefaultRangeFromUrl(searchParams));
  const [money, setMoney] = useState<number>(0); // 默认为0（全部）
  const [startMoney, setStartMoney] = useState<number>(0);
  const [endMoney, setEndMoney] = useState<number>(1);
  const [showMoneyInput, setShowMoneyInput] = useState<boolean>(false);
  const [keyProjectType, setKeyProjectType] = useState<string>('全部'); // 重点项目选择：全部、市重点、省重大，不参与传参

  const [form] = Form.useForm();

  const handleBack = () => {
    navigate('/tutorial/record-approval');
  };

  // 处理数量字段点击事件
  const handleNumberClick = (record: TreeNodeData) => {
    const params = new URLSearchParams();

    // 添加基础参数
    // 当district为"泰州市"时不传递district参数
    if (record.district && record.district !== '泰州市') {
      params.set('district', record.district);
    }
    if (record.park) {
      params.set('park', record.park);
    }

    const endDay = rangeDate[1];
    const year = endDay.year();
    params.set('year', year.toString());
    const month = endDay.month() + 1;
    params.set('month', month.toString());
    params.set('start', rangeDate[0].format('YYYY-MM-DD'));
    params.set('end', endDay.endOf('month').format('YYYY-MM-DD'));

    // 创新集群参数：当创新集群不是"项目总数"时才传递
    // 检查 innovativeCluster 或 innovativeClusterLabel 是否包含"项目总数"
    const isProjectTotal = record.innovativeCluster === '项目总数' ||
                          record.innovativeClusterLabel === '项目总数' ||
                          (record.innovativeClusterLabel && record.innovativeClusterLabel.includes('项目总数'));

    if (record.innovativeCluster && !isProjectTotal) {
      params.set('innovativeCluster', record.innovativeCluster);
    } else if (isProjectTotal) {
      // 当点击"项目总数"时，添加 isALLCluster 参数
      params.set('isALLCluster', 'true');
    }

    // 传递查询模块的参数（金额范围）
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

    // 添加来源标识
    params.set('from', 'chain');

    // 跳转到ApproveDetailAdvance2页面
    navigate(`/tutorial/record-approval/detail/approve-detail-advance2?${params.toString()}`);
  };

  const fetchApprovalData = async (startDate: Dayjs, endDate: Dayjs, minAmount?: number, maxAmount?: number) => {
    setLoading(true);
    try {
      const startUtc = new Date(Date.UTC(startDate.year(), startDate.month(), startDate.date()));
      const endOfMonth = endDate.endOf('month');
      const endUtc = new Date(Date.UTC(endOfMonth.year(), endOfMonth.month(), endOfMonth.date()));
      const response = await primeApi.getIndustrialChainDistribution1({
        start: startUtc,
        end: endUtc,
        minAmount,
        maxAmount
      });

      const transformData = (item: IndustrialChainDistributionTreeVo, parentKey: string = '', index: number = 0): TreeNodeData => {
        const key = parentKey ? `${parentKey}-${index}` : 'root';
        return {
          key,
          innovativeCluster: item.innovativeCluster,
          industrialChain: item.industrialChain,
          innovativeClusterLabel: item.innovativeClusterLabel,
          industrialChainLabel: item.industrialChainLabel,
          projectCount: item.projectCount,
          investmentAmount: item.investmentAmount,
          projectProportion: item.projectProportion,
          investmentProportion: item.investmentProportion,
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
      console.error('获取产业链分布数据失败:', error);
      message.error('获取产业链分布数据失败');
      setDataSource([]);
      setSummaryData(null);
    } finally {
      setLoading(false);
    }
  };

  const loadDivisionData = async () => {
    const [startDate, endDate] = rangeDate;
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
    await fetchApprovalData(startDate, endDate, minAmount, maxAmount);
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

    const newMoney = values.money !== undefined ? values.money : 0;
    const newRange = values.rangeDate && values.rangeDate[0] && values.rangeDate[1]
      ? (values.rangeDate as [Dayjs, Dayjs])
      : rangeDate;
    const newStartMoney = values.startMoney !== undefined ? values.startMoney : 0;
    const newEndMoney = values.endMoney !== undefined ? values.endMoney : 1;

    if (newRange[0].year() !== newRange[1].year()) {
      message.warning('不能跨越年份选择');
      return;
    }

    setMoney(newMoney);
    setRangeDate(newRange);
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

    fetchApprovalData(newRange[0], newRange[1], minAmount, maxAmount);
  };

  const onReset = () => {
    const resetRange = getDefaultRangeFromUrl(searchParams);

    setMoney(0);
    setRangeDate(resetRange);
    setStartMoney(0);
    setEndMoney(1);
    setShowMoneyInput(false);
    setKeyProjectType('全部');

    form.setFieldsValue({
      rangeDate: resetRange,
      money: 0,
      keyProjectType: '全部',
      startMoney: 0,
      endMoney: 1
    });

    fetchApprovalData(resetRange[0], resetRange[1], undefined, undefined);
  };

  // 表格列配置 - 链群体系分布相关列
  const columns = [
    {
      title: '创新集群',
      dataIndex: 'innovativeCluster',
      key: 'innovativeCluster',
      width: 200,
      fixed: 'left' as const,
      render: (text: string, record: TreeNodeData) => {
        // 集群值为空时显示产业链
        const displayText = (record.innovativeClusterLabel || '') + (record.industrialChainLabel || '') || '--';
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
      title: '项目数量',
      key: 'projectQuantity',
      children: [
        {
          title: '个数',
          dataIndex: 'projectCount',
          key: 'projectCount',
          width: 100,
          sorter: (a: TreeNodeData, b: TreeNodeData) => (a.projectCount || 0) - (b.projectCount || 0),
          render: (text: number, record: TreeNodeData) =>
            record.isSummary ? (
              <strong>{text || 0}</strong>
            ) : (
              <span
                className={styles.highlightNumber}
                onClick={() => handleNumberClick(record)}
              >
                {text || 0}
              </span>
            ),
        },
        {
          title: '比重',
          dataIndex: 'projectProportion',
          key: 'projectProportion',
          width: 100,
          sorter: (a: TreeNodeData, b: TreeNodeData) => (a.projectProportion || 0) - (b.projectProportion || 0),
          render: (text: number, record: TreeNodeData) =>
            record.isSummary ? (
              <strong>{text ? text.toFixed(2) + '%' : '0.00%'}</strong>
            ) : (
              text ? text.toFixed(2) + '%' : '0.00%'
            ),
        },
      ],
    },
    {
      title: '备案投资额',
      key: 'filedInvestment',
      children: [
        {
          title: '投资额',
          dataIndex: 'investmentAmount',
          key: 'investmentAmount',
          width: 130,
          sorter: (a: TreeNodeData, b: TreeNodeData) => (a.investmentAmount || 0) - (b.investmentAmount || 0),
          render: (text: number, record: TreeNodeData) =>
            record.isSummary ? (
              <strong>{text ? (text / 10000).toFixed(2) : '0.00'}</strong>
            ) : (
              text ? (text / 10000).toFixed(2) : '0.00'
            ),
        },
        {
          title: '比重',
          dataIndex: 'investmentProportion',
          key: 'investmentProportion',
          width: 100,
          sorter: (a: TreeNodeData, b: TreeNodeData) => (a.investmentProportion || 0) - (b.investmentProportion || 0),
          render: (text: number, record: TreeNodeData) =>
            record.isSummary ? (
              <strong>{text ? text.toFixed(2) + '%' : '0.00%'}</strong>
            ) : (
              text ? text.toFixed(2) + '%' : '0.00%'
            ),
        },
      ],
    },
  ];

  // 树形结构通过expandable配置实现，不需要额外的treeConfig配置
  useEffect(() => {
    // 加载当前月份的数据
    loadDivisionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const goBackHome = () => {
    navigate(`/tutorial`);
  };

  // 合并数据和合计行
  const tableData = summaryData ? [...dataSource, summaryData] : dataSource;

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
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-1)}>备案审批</a></Breadcrumb.Item>
          <Breadcrumb.Item>链群分布</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>“8+13+X”链群体系分布情况</h1>
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
                keyProjectType: '全部',
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

        <div className={styles.projectsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>备案项目产业分布</div>
            <div className={styles.filterControls}>
              {/* 季度查询按钮组 - 增加了按钮间的间距 */}
              <div className={styles.quarterSelector}>
                {/*<Button*/}
                {/*  className={[styles.chartBtn, currentQuarter === 1 ? styles.active : ''].join(' ')}*/}
                {/*  onClick={() => handleQuarterChange(1)}*/}
                {/*  style={{ marginRight: '8px' }}  // 增加右侧间距*/}
                {/*>*/}
                {/*  第一季度*/}
                {/*</Button>*/}
                {/*<Button*/}
                {/*  className={[styles.chartBtn, currentQuarter === 2 ? styles.active : ''].join(' ')}*/}
                {/*  onClick={() => handleQuarterChange(2)}*/}
                {/*  style={{ marginRight: '8px' }}  // 增加右侧间距*/}
                {/*>*/}
                {/*  第二季度*/}
                {/*</Button>*/}
                {/*<Button*/}
                {/*  className={[styles.chartBtn, currentQuarter === 3 ? styles.active : ''].join(' ')}*/}
                {/*  onClick={() => handleQuarterChange(3)}*/}
                {/*  style={{ marginRight: '8px' }}  // 增加右侧间距*/}
                {/*>*/}
                {/*  第三季度*/}
                {/*</Button>*/}
                {/*<Button*/}
                {/*  className={[styles.chartBtn, currentQuarter === 4 ? styles.active : ''].join(' ')}*/}
                {/*  onClick={() => handleQuarterChange(4)}*/}
                {/*>*/}
                {/*  第四季度*/}
                {/*</Button>*/}
              </div>
            </div>
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
            rowKey={(record) => record.key || record.innovativeCluster || 'default'}
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

        {/* <div className={styles.footer}>
          <p>企业全生命周期管理系统 © {getCurrentYear()} 版权所有</p>
        </div> */}
      </div>
    </div>
  );
};

export default ChainDetail;
