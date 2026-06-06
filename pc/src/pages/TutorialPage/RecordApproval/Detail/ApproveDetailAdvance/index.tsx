import { primeApi } from '@/services/api';
import { ProjectFilingInfoVo } from '@/services/apis';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Table, Breadcrumb, Form, Row, Select, Space, ConfigProvider, DatePicker, InputNumber, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './index.module.css';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// 表单字段类型定义
interface FieldType {
  month?: any;
  money?: number;
  industry?: string;
  startMoney?: number;
  endMoney?: number;
}

// 树形数据接口类型（基于API返回的ProjectFilingInfoVo）
interface TreeNodeData extends ProjectFilingInfoVo {
  key: React.Key;
  isSummary?: boolean;
}

// 获取当前年份
const getCurrentYear = () => {
  return new Date().getFullYear();
};

// 获取当前季度（返回1-4的数字）
const getCurrentQuarter = () => {
  const month = new Date().getMonth();
  if (month < 3) return 1;
  if (month < 6) return 2;
  if (month < 9) return 3;
  return 4;
};


// 渲染带样式的状态标签
const renderStatusTag = (text: string, backgroundColor?: string) => {
  // 使用提供的背景颜色，如果没有提供则使用默认颜色 #9e9e9e
  const bgColor = backgroundColor || '#9e9e9e';

  // 如果文本为空，显示 '--'
  let displayText = text || '--';

  // 去掉前面的序号（如 "1."、"2." 等）
  displayText = displayText.replace(/^\d+\./, '');

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        backgroundColor: bgColor,
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: 'normal',
        whiteSpace: 'nowrap',
      }}
    >
      {displayText}
    </span>
  );
};

const InvestmentDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 季度状态改为数字类型（1-4）
  const [currentQuarter, setCurrentQuarter] = useState<number>(getCurrentQuarter());
  const [dataSource, setDataSource] = useState<TreeNodeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 存储展开的节点key
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 查询条件状态
  const [industry, setIndustry] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<any>(dayjs());
  const [money, setMoney] = useState<number>(1);
  const [startMoney, setStartMoney] = useState<number>(0);
  const [endMoney, setEndMoney] = useState<number>(1);
  const [showMoneyInput, setShowMoneyInput] = useState<boolean>(false);

  const [form] = Form.useForm();

  const handleBack = () => {
    // 新开标签页时可能没有 history，navigate(-1) 会失效
    const params = new URLSearchParams(location.search);
    const newTab = params.get('newTab') === '1';
    const hasHistory = !newTab && typeof window !== 'undefined' && window.history.length > 1;
    if (hasHistory) {
      navigate(-1);
      return;
    }
    navigate('/tutorial/record-approval/detail/audit-datail', { replace: true });
  };

  // 获取来源页面
  const getSourcePage = () => {
    const params = new URLSearchParams(location.search);
    return params.get('from') || 'audit';
  };

  const sourcePage = getSourcePage();

  // 从URL获取参数
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      keyProjectType: params.get('keyProjectType') || undefined,
      district: params.get('district') || undefined,
      park: params.get('park') || undefined,
      year: params.get('year') ? parseInt(params.get('year')!) : getCurrentYear(),
      month: params.get('month') ? parseInt(params.get('month')!) : undefined,
      start: params.get('start') || undefined,
      end: params.get('end') || undefined,
      isEnvironment: params.get('isEnvironment') ? params.get('isEnvironment') === 'true' : undefined,
      isEnergy: params.get('isEnergy') ? params.get('isEnergy') === 'true' : undefined,
      isSecurity: params.get('isSecurity') ? params.get('isSecurity') === 'true' : undefined,
      isMap: params.get('isMap') ? params.get('isMap') === 'true' : undefined,
      isConstruction: params.get('isConstruction') ? params.get('isConstruction') === 'true' : undefined,
      isPlan: params.get('isPlan') ? params.get('isPlan') === 'true' : undefined,
      minAmount: params.get('minAmount') ? parseInt(params.get('minAmount')!) : undefined,
      maxAmount: params.get('maxAmount') ? parseInt(params.get('maxAmount')!) : undefined,
      projectType: params.get('projectType') || undefined,
    };
  };

  // 季度选择变化时重新加载数据并收起所有展开项
  const handleQuarterChange = (quarter: number) => {
    setCurrentQuarter(quarter);
    loadDivisionData(getCurrentYear(), quarter);
    // 收起所有展开项
    setExpandedKeys([]);
  };

  // 处理金额范围选择变化
  const handleChangeSelect = (value: number) => {
    setMoney(value);
    setShowMoneyInput(value === -1);
  };

  // 处理月份变化
  const onChangeMonth = (date: any) => {
    if (date) {
      setSelectedMonth(date);
    }
  };

  // 表单提交处理
  const onFinish = (values: FieldType) => {
    console.log('查询条件:', values);
    setIndustry(values.industry || '');
    setMoney(values.money || 1);
    if (values.month) {
      setSelectedMonth(values.month);
    }
    // 重新加载当前季度的数据（这里需要根据实际API支持的参数来调整）
    loadDivisionData(getCurrentYear(), currentQuarter);
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
    setIndustry('');
    setMoney(1);
    setSelectedMonth(dayjs());
    setStartMoney(0);
    setEndMoney(1);
    setShowMoneyInput(false);
    form.setFieldsValue({
      month: dayjs(),
      money: 1,
      industry: '',
      startMoney: 0,
      endMoney: 1
    });
    loadDivisionData(getCurrentYear(), currentQuarter);
  };

  // 获取项目备案信息列表
  const fetchProjectFilingInfo = async (page: number = 1, size: number = 10) => {
    setLoading(true);
    try {
      const queryParams = getQueryParams();
      if (queryParams.keyProjectType === '市重点' || queryParams.keyProjectType === '省重大') {
        setDataSource([]);
        setPagination((prev) => ({ ...prev, current: 1, total: 0 }));
        return;
      }

      // 构建API请求参数，过滤掉undefined的值；start/end 用于 project-filing-info 列表查询
      const apiParams: Record<string, unknown> = {
        page,
        size,
      };

      if (queryParams.start) apiParams.start = new Date(queryParams.start + 'T00:00:00.000Z');
      if (queryParams.end) apiParams.end = new Date(queryParams.end + 'T00:00:00.000Z');
      if (queryParams.district) apiParams.district = queryParams.district;
      if (queryParams.park) apiParams.park = queryParams.park;
      if (queryParams.month !== undefined) apiParams.month = queryParams.month;
      if (queryParams.isEnvironment !== undefined) apiParams.isEnvironment = queryParams.isEnvironment;
      if (queryParams.isEnergy !== undefined) apiParams.isEnergy = queryParams.isEnergy;
      if (queryParams.isSecurity !== undefined) apiParams.isSecurity = queryParams.isSecurity;
      if (queryParams.isMap !== undefined) apiParams.isMap = queryParams.isMap;
      if (queryParams.isConstruction !== undefined) apiParams.isConstruction = queryParams.isConstruction;
      if (queryParams.isPlan !== undefined) apiParams.isPlan = queryParams.isPlan;
      if (queryParams.minAmount !== undefined) apiParams.minAmount = queryParams.minAmount;
      if (queryParams.maxAmount !== undefined) apiParams.maxAmount = queryParams.maxAmount;
      if (queryParams.projectType) apiParams.projectType = queryParams.projectType;

      console.log('API请求参数:', apiParams);

      const response = await primeApi.listProjectFilingInfo(apiParams);

      console.log('API响应:', response);

      // 转换数据格式，添加key
      const dataWithKeys: TreeNodeData[] = (response.records || []).map((item: ProjectFilingInfoVo, index: number) => ({
        ...item,
        key: item.id || `item-${index}`,
      }));

      setDataSource(dataWithKeys);
      setPagination({
        current: response.page,
        pageSize: response.size,
        total: response.total,
      });
    } catch (error) {
      console.error('获取项目备案信息失败:', error);
      console.error('错误详情:', error);
      message.error(`获取项目备案信息失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理分页变化
  const handleTableChange = (paginationConfig: any) => {
    fetchProjectFilingInfo(paginationConfig.current, paginationConfig.pageSize);
  };

  // 请求审批数据
  const loadDivisionData = async (year: number, quarter: number) => {
    await fetchProjectFilingInfo(1, 10);
  };

  // 表格列配置
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 250,
      fixed: 'left' as const,
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
    {
      title: '环评进展',
      dataIndex: 'environmentalAssessmentStatus',
      key: 'environmentalAssessmentStatus',
      width: 150,
      render: (text: string, record: TreeNodeData) => {
        if (record.isSummary) {
          return <strong>{text || '--'}</strong>;
        }
        return renderStatusTag(text || '--', record.environmentalAssessmentStatusColor);
      },
    },
    {
      title: '安评情况',
      dataIndex: 'safetyAssessmentStatus',
      key: 'safetyAssessmentStatus',
      width: 150,
      render: (text: string, record: TreeNodeData) => {
        if (record.isSummary) {
          return <strong>{text || '--'}</strong>;
        }
        return renderStatusTag(text || '--', record.safetyAssessmentStatusColor);
      },
    },
    {
      title: '能评情况',
      dataIndex: 'energyAssessmentStatus',
      key: 'energyAssessmentStatus',
      width: 150,
      render: (text: string, record: TreeNodeData) => {
        if (record.isSummary) {
          return <strong>{text || '--'}</strong>;
        }
        return renderStatusTag(text || '--', record.energyAssessmentStatusColor);
      },
    },
    {
      title: '施工图审情况',
      dataIndex: 'constructionDrawingReviewStatus',
      key: 'constructionDrawingReviewStatus',
      width: 180,
      render: (text: string, record: TreeNodeData) => {
        if (record.isSummary) {
          return <strong>{text || '--'}</strong>;
        }
        return renderStatusTag(text || '--', record.constructionDrawingReviewStatusColor);
      },
    },
    {
      title: '施工许可情况',
      dataIndex: 'constructionPermitStatus',
      key: 'constructionPermitStatus',
      width: 160,
      render: (text: string, record: TreeNodeData) => {
        if (record.isSummary) {
          return <strong>{text || '--'}</strong>;
        }
        return renderStatusTag(text || '--', record.constructionPermitStatusColor);
      },
    },
  ];

  // URL参数变化时重新加载数据
  useEffect(() => {
    fetchProjectFilingInfo(1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const tableData = dataSource;
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
          <Breadcrumb.Item>
            <a style={{ height: 'auto' }} onClick={() => navigate('/tutorial')}>
              <HomeOutlined style={{ marginRight: '10px', fontSize: '20px' }} /> 首页
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a style={{ height: 'auto' }} onClick={() => navigate('/tutorial/record-approval')}>备案审批</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a style={{ height: 'auto' }} onClick={() => navigate('/tutorial/record-approval/detail/audit-datail')}>
              审批服务
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>项目信息</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>项目审批进度表</h1>
        {/* <p className={styles.pageSubtitle}>{getCurrentYear()}年审批服务情况</p> */}

        {/* 查询条件表单 */}

        <div className={styles.projectsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>项目审批进度表</div>
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
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            size="middle"
            loading={loading}
            locale={{
              emptyText: '暂无数据',
              triggerDesc: '点击降序',
              triggerAsc: '点击升序',
              cancelSort: '取消排序',
            }}
            scroll={{ x: '100%' }}
            rowKey={(record) => record.key || 'default'}
            onChange={handleTableChange}
          />
        </div>

        {/* <div className={styles.footer}>
          <p>企业全生命周期管理系统 © {getCurrentYear()} 版权所有</p>
        </div> */}
      </div>
    </div>
  );
};

export default InvestmentDetail;
