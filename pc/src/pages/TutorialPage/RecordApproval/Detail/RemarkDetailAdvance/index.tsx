import { primeApi } from '@/services/api';
import { StageDivisionOverviewRequest, StageparkOverviewRequest } from '@/services/apis';
import { ArrowLeftOutlined, BuildOutlined,HomeOutlined } from '@ant-design/icons';
import { message, Table, Breadcrumb, Button, ConfigProvider } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import zhCN from 'antd/locale/zh_CN';

interface BackendResponseData {
  approvalDepartment: string; // 处理部门
  documentCount: number; // 办件数量
  avgDuration: number; // 平均时长
  key?: string;
}

// 获取当前季度（返回1-4的数字）
const getCurrentQuarter = () => {
  const month = new Date().getMonth();
  if (month < 3) return 1;
  if (month < 6) return 2;
  if (month < 9) return 3;
  return 4;
};

// 获取当前年份
const getCurrentYear = () => {
  return new Date().getFullYear();
};

const RemarkDetailAdvance: React.FC = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<BackendResponseData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // 季度状态
  const [currentQuarter, setCurrentQuarter] = useState<number>(getCurrentQuarter());
  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleBack = () => {
    navigate('/tutorial');
  };

  // 季度选择变化时重新加载数据
  const handleQuarterChange = (quarter: number) => {
    setCurrentQuarter(quarter);
    loadData(quarter, getCurrentYear());
  };

  // 请求数据 - 使用stageDeptOverview接口
  const loadData = async (quarter?: number, year?: number) => {
    try {
      setLoading(true);
      // 调用stageDeptOverview接口
      const queryQuarter = quarter || currentQuarter;
      const queryYear = year || getCurrentYear();

      const response = await primeApi.stageDeptOverview({
        quarter: queryQuarter,
        year: queryYear,
      });
      console.log('部门审批数据:', response);

      // 确保数据是数组格式
      let dataArray: any[] = [];
      if (Array.isArray(response)) {
        dataArray = response;
      } else if (response) {
        // 如果返回的是单个对象，将其包装成数组
        dataArray = [response];
      }

      // 为数据添加key属性
      const processedData = dataArray.map((item: any, index: number) => ({
        ...item,
        key: item.approvalDepartment || `dept-${index}`,
      }));

      setDataSource(processedData);
      
      // 更新分页总数
      setPagination(prev => ({
        ...prev,
        total: processedData.length,
      }));
    } catch (error) {
      message.error('获取部门审批数据失败');
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '处理部门',
      dataIndex: 'approvalDepartment',
      key: 'approvalDepartment',
      width: 200,
      ellipsis: true,
      render: (text: string) => {
        return text || '--';
      },
    },
    {
      title: '办件数量',
      dataIndex: 'documentCount',
      key: 'documentCount',
      width: 150,
      sorter: (a: BackendResponseData, b: BackendResponseData) => (a.documentCount || 0) - (b.documentCount || 0),
      render: (text: number) => {
        return text || 0;
      },
    },
    {
      title: '平均时长',
      dataIndex: 'avgDuration',
      key: 'avgDuration',
      width: 150,
      sorter: (a: BackendResponseData, b: BackendResponseData) => (a.avgDuration || 0) - (b.avgDuration || 0),
      render: (text: number) => {
        return text ? `${text}小时` : '--';
      },
    },
  ];
  const goBackHome = () => {
    navigate(`/tutorial`);
  };


  useEffect(() => {
    // 加载当前年度当前季度的数据
    loadData(currentQuarter, getCurrentYear());
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
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-2)}><HomeOutlined style={{ marginRight: '10px', fontSize: '20px' }} /> 首页</a></Breadcrumb.Item>
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-1)}>备案审批</a></Breadcrumb.Item>
          <Breadcrumb.Item>部门审批</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>部门审批表</h1>
        {/* <p className={styles.pageSubtitle}>项目备案情况</p> */}

        <div className={styles.projectsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>项目备案表</div>
            <div className={styles.filterControls}>
              {/* 季度查询按钮组 */}
              <div className={styles.quarterSelector}>
                <Button
                  className={[styles.chartBtn, currentQuarter === 1 ? styles.active : ''].join(' ')}
                  onClick={() => handleQuarterChange(1)}
                  style={{ marginRight: '8px' }}
                >
                  第一季度
                </Button>
                <Button
                  className={[styles.chartBtn, currentQuarter === 2 ? styles.active : ''].join(' ')}
                  onClick={() => handleQuarterChange(2)}
                  style={{ marginRight: '8px' }}
                >
                  第二季度
                </Button>
                <Button
                  className={[styles.chartBtn, currentQuarter === 3 ? styles.active : ''].join(' ')}
                  onClick={() => handleQuarterChange(3)}
                  style={{ marginRight: '8px' }}
                >
                  第三季度
                </Button>
                <Button
                  className={[styles.chartBtn, currentQuarter === 4 ? styles.active : ''].join(' ')}
                  onClick={() => handleQuarterChange(4)}
                >
                  第四季度
                </Button>
              </div>
            </div>
          </div>
          <ConfigProvider locale={zhCN}>
            <Table
              className={styles.table}
              columns={columns}
              dataSource={dataSource}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
                onChange: (page, pageSize) => {
                  setPagination({
                    current: page,
                    pageSize: pageSize || 10,
                    total: pagination.total,
                  });
                },
              }}
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
              rowKey={(record) => record.key || record.approvalDepartment}
            />
          </ConfigProvider>
        </div>

        {/* <div className={styles.footer}>
          <p>企业全生命周期管理服务平台 © 2025 版权所有</p>
        </div> */}
      </div>
    </div>
  );
};

export default RemarkDetailAdvance;
