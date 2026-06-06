import { primeApi } from '@/services/api';
import { StageDivisionOverviewRequest, StageparkOverviewRequest } from '@/services/apis';
import { ArrowLeftOutlined, BuildOutlined,HomeOutlined } from '@ant-design/icons';
import { message, Table,Breadcrumb, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

interface BackendResponseData {
  district: string;
  park: string;
  stageApprovalCount: number;
  stageECCount: number;
  stagePermitStageCount: number;
  stageCompleted: number;
  children: BackendResponseData[];
  districtName?: string;
  parkName?: string;
  key?: string;
}

// 园区数据接口类型
interface ParkData {
  park: string;
  parkTxt: string;
  stageApprovalCount: number;
  stageECCount: number;
  stagePermitStageCount: number;
  stageCompleted: number;
  key?: string;
}

const InvestmentDetail: React.FC = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<BackendResponseData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const handleBack = () => {
    navigate('/tutorial');
  };

  const fetchData = async (params: StageDivisionOverviewRequest) => {
    try {
      setLoading(true);
      // 调用真实的stageDivisionOverview接口
      const response = await primeApi.stageDivisionOverview(params);
      console.log('后端返回数据:', response);

      // 确保数据是数组格式
      let dataArray: any[] = [];
      if (Array.isArray(response)) {
        dataArray = response;
      } else if (response) {
        // 如果返回的是单个对象，将其包装成数组
        dataArray = [response];
      }

      // 检查数组是否为空或数据格式是否正确
      if (dataArray.length === 0) {
        setDataSource([]);
        return;
      }

      // 根据接口返回的嵌套结构，直接使用返回的数据并添加key属性
      const addKeysToNestedData = (items: any[]): BackendResponseData[] => {
        return items.map(item => ({
          ...item,
          // 添加key属性，如果没有则生成一个
          key: item.key || `${item.district || 'unknown'}-${item.park || 'unknown'}`,
          // 递归处理子节点
          children: Array.isArray(item.children) && item.children.length > 0
            ? addKeysToNestedData(item.children)
            : []
        }));
      };

      // 处理数据并设置key
      const treeData = addKeysToNestedData(dataArray);
      setDataSource(treeData);

      // 只展开第一级
      const getFirstLevelKeys = (data: any[]): React.Key[] => {
        const keys: React.Key[] = [];
        data.forEach(item => {
          if (item.key) {
            keys.push(item.key);
          }
        });
        return keys;
      };

      setExpandedKeys(getFirstLevelKeys(treeData));
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  // 请求数据（固定传递all作为月份参数）
  const loadData = async () => {
    const params: StageDivisionOverviewRequest = {
      month: '',  // 固定传递all
    };
    await fetchData(params);
  };

  // 表格列配置
  const columns = [
    {
      title: '市（区）/园区',
      dataIndex: 'districtName',
      key: 'districtName',
      width: 220,
      ellipsis: true,
      render: (_: any, record: BackendResponseData) => {
        return record.districtName || record.parkName;
      },
    },
    {
      title: '立项用地规划阶段项目数量',
      dataIndex: 'stageApprovalCount',
      key: 'stageApprovalCount',
      width: 180,
      render: (text: number, record: BackendResponseData) =>
        <span style={{
          color: '#1890ff',
          fontWeight: 'bold',
          cursor: 'pointer'
        }} onClick={() => navigate('/tutorial/record-approval/detail/approve-datail')}>
          {text}
        </span>,
    },
    {
      title: '工程建设许可阶段项目数量',
      dataIndex: 'stageECCount',
      key: 'stageECCount',
      width: 180,
      render: (text: number, record: BackendResponseData) =>
        <span style={{
          color: '#1890ff',
          fontWeight: 'bold',
          cursor: 'pointer'
        }} onClick={() => navigate('/tutorial/record-approval/detail/approve-datail')}>
          {text}
        </span>,
    },
    {
      title: '施工许可阶段项目数量',
      dataIndex: 'stagePermitStageCount',
      key: 'stagePermitStageCount',
      width: 180,
      render: (text: number, record: BackendResponseData) =>
        <span style={{
          color: '#1890ff',
          fontWeight: 'bold',
          cursor: 'pointer'
        }} onClick={() => navigate('/tutorial/record-approval/detail/approve-datail')}>
          {text}
        </span>,
    },
    {
      title: '竣工验收阶段项目数量',
      dataIndex: 'stageCompleted',
      key: 'stageCompleted',
      width: 180,
      render: (text: number, record: BackendResponseData) =>
        <span style={{
          color: '#1890ff',
          fontWeight: 'bold',
          cursor: 'pointer'
        }} onClick={() => navigate('/tutorial/record-approval/detail/approve-datail')}>
          {text}
        </span>,
    },
  ];

  // 不需要单独的园区列配置，将直接使用主列配置

  // 展开配置 - 使用children字段实现嵌套表格
  const expandable = {
    // 自动使用children作为展开数据
    childrenColumnName: 'children',
    // 展开行的渲染配置
    rowExpandable: (record: BackendResponseData) => {
      // 只有当children数组不为空时才允许展开
      return record.children && record.children.length > 0;
    },
    // 点击行即可展开
    expandRowByClick: true,
    // 使用状态控制展开
    expandedRowKeys: expandedKeys,
    onExpandedRowsChange: (keys: readonly React.Key[]) => setExpandedKeys([...keys]),
    // 不使用expandedRowRender，避免嵌套表格显示
  };
  const goBackHome = () => {
    navigate(`/tutorial`);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 直接使用处理后的数据源

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
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-1)}><HomeOutlined style={{ marginRight: '10px', fontSize: '20px' }} /> 首页</a></Breadcrumb.Item>
          <Breadcrumb.Item>备案审批</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>项目备案表</h1>
        {/* <p className={styles.pageSubtitle}>项目备案情况</p> */}

        <div className={styles.projectsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>项目备案表</div>
            <div className={styles.tableActions}>
              <Button
                type="primary"
                onClick={() => navigate('/tutorial/record-approval/detail/remark-datail-advance')}
                style={{
                  backgroundColor: '#1a237e',
                  borderColor: '#1a237e',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}
              >
                按部门
              </Button>
            </div>
          </div>
          <Table
            className={styles.table}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            size="middle"
            loading={loading}
            locale={{
              emptyText: '暂无数据',
              triggerDesc: '点击降序',
              triggerAsc: '点击升序',
              cancelSort: '取消排序',
            }}
            expandable={expandable}
            rowKey={(record) => record.key || `${record.district}-${record.park}`}
          />
        </div>

        {/* <div className={styles.footer}>
          <p>企业全生命周期管理服务平台 © 2025 版权所有</p>
        </div> */}
      </div>
    </div>
  );
};

export default InvestmentDetail;
