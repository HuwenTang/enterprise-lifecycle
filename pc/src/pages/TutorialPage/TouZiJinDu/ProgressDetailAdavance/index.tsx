import { primeApi } from '@/services/api';
import { ProjectFagaiKeyProjectsVo } from '@/services/apis';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, message, Table, Breadcrumb } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './index.module.css';
import dayjs from 'dayjs';

// 获取当前年份
const getCurrentYear = () => {
  return new Date().getFullYear();
};

const ProgressDetailAdvance: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dataSource, setDataSource] = useState<ProjectFagaiKeyProjectsVo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleBack = () => {
    // 新开标签页时可能没有 history，navigate(-1) 会失效
    const params = new URLSearchParams(location.search);
    const newTab = params.get('newTab') === '1';
    const hasHistory = !newTab && typeof window !== 'undefined' && window.history.length > 1;
    if (hasHistory) {
      navigate(-1);
      return;
    }
    const from = params.get('from') || 'progress';
    if (from === 'progress1') {
      navigate('/tutorial/tou-zi-jin-du/progress-detail1', { replace: true });
    } else if (from === 'progress2') {
      navigate('/tutorial/tou-zi-jin-du/progress-detail2', { replace: true });
    } else if (from === 'progress3') {
      navigate('/tutorial/tou-zi-jin-du/progress-detail3', { replace: true });
    } else {
      navigate('/tutorial/tou-zi-jin-du/progress-detail', { replace: true });
    }
  };

  // 获取来源页面
  const getSourcePage = () => {
    const params = new URLSearchParams(location.search);
    return params.get('from') || 'progress';
  };

  const sourcePage = getSourcePage();

  // 从URL获取参数
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      keyProjectType: params.get('keyProjectType') || undefined,
      city: params.get('city') || undefined,
      park: params.get('park') || undefined,
      year: params.get('year') ? parseInt(params.get('year')!) : undefined,
      month: params.get('month') ? parseInt(params.get('month')!) : undefined,
      status: params.get('status') ? parseInt(params.get('status')!) : undefined,
      isDomestic: params.get('isDomestic') ? params.get('isDomestic') === 'true' : undefined,
      isForeign: params.get('isForeign') ? params.get('isForeign') === 'true' : undefined,
      innovativeCluster: params.get('innovativeCluster') || undefined,
      industrialChain: params.get('industrialChain') || undefined,
      industrialChainNotNull: params.get('industrialChainNotNull') ? params.get('industrialChainNotNull') === 'true' : undefined,
      minAmount: params.get('minAmount') ? parseInt(params.get('minAmount')!) : undefined,
      maxAmount: params.get('maxAmount') ? parseInt(params.get('maxAmount')!) : undefined,
    };
  };

  // 获取项目列表
  const fetchProjectList = async (page: number = 1, size: number = 10) => {
    setLoading(true);
    try {
      const queryParams = getQueryParams();
      if (queryParams.keyProjectType === '市重点' || queryParams.keyProjectType === '省重大') {
        setDataSource([]);
        setPagination((prev) => ({ ...prev, current: 1, total: 0 }));
        return;
      }

      // 构建API请求参数，过滤掉undefined的值
      const apiParams: any = {
        page,
        size,
      };

      if (queryParams.city) apiParams.city = queryParams.city;
      if (queryParams.park) apiParams.park = queryParams.park;
      if (queryParams.year !== undefined) apiParams.year = queryParams.year;
      if (queryParams.month !== undefined) apiParams.month = queryParams.month;
      if (queryParams.status !== undefined) apiParams.status = queryParams.status;
      if (queryParams.isDomestic !== undefined) apiParams.isDomestic = queryParams.isDomestic;
      if (queryParams.isForeign !== undefined) apiParams.isForeign = queryParams.isForeign;

      // 优先使用industrialChain，如果没有则使用innovativeCluster的值作为industrialChain
      if (queryParams.industrialChain) {
        apiParams.industrialChain = queryParams.industrialChain;
      } else if (queryParams.innovativeCluster) {
        apiParams.industrialChain = queryParams.innovativeCluster;
      }

      if (queryParams.industrialChainNotNull !== undefined) apiParams.industrialChainNotNull = queryParams.industrialChainNotNull;
      if (queryParams.minAmount !== undefined) apiParams.minAmount = queryParams.minAmount;
      if (queryParams.maxAmount !== undefined) apiParams.maxAmount = queryParams.maxAmount;

      console.log('API请求参数:', apiParams);

      const response = await primeApi.listProjectFagaiKeyProjects(apiParams);

      console.log('API响应:', response);

      setDataSource(response.records || []);
      setPagination({
        current: response.page,
        pageSize: response.size,
        total: response.total,
      });
    } catch (error) {
      console.error('获取项目列表失败:', error);
      console.error('错误详情:', error);
      message.error(`获取项目列表失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理分页变化
  const handleTableChange = (paginationConfig: any, filters: any, sorter: any) => {
    fetchProjectList(paginationConfig.current, paginationConfig.pageSize);
  };

  // 表格列配置 - 根据来源页面动态调整
  const getColumns = () => {
    const baseColumns = [
      {
        title: '序号',
        key: 'index',
        width: 60,
        render: (_: any, __: any, index: number) =>
          (pagination.current - 1) * pagination.pageSize + index + 1,
      },
      {
        title: '项目名称',
        dataIndex: 'investmentEntityAndName',
        key: 'investmentEntityAndName',
        width: 200,
        ellipsis: true,
      },
      {
        title: '项目代码',
        dataIndex: 'projectRecordCode',
        key: 'projectRecordCode',
        width: 150,
        ellipsis: true,
      },
      {
        title: '市（区）',
        dataIndex: 'districtName',
        key: 'districtName',
        width: 100,
      },
      {
        title: '园区',
        dataIndex: 'parkName',
        key: 'parkName',
        width: 150,
        ellipsis: true,
      },
      {
        title: <>计划总投资<br/>（万元）</>,
        dataIndex: 'plannedTotalInvestmentAll',
        key: 'plannedTotalInvestmentAll',
        width: 120,
        render: (text: number) => text ? text.toFixed(2) : '0.00',
      },
    ];

    // 根据来源页面决定显示年度计划投资还是实际完成总投资
    const investmentColumn = sourcePage === 'progress2'
      ? {
          title: <>实际完成总投资<br/>（万元）</>,
          dataIndex: 'actualTotalInvestmentAll',
          key: 'actualTotalInvestmentAll',
          width: 120,
          render: (text: number) => text ? text.toFixed(2) : '0.00',
        }
      : {
          title: <>年度计划投资<br/>（万元）</>,
          dataIndex: 'annualPlannedInvestment',
          key: 'annualPlannedInvestment',
          width: 120,
          render: (text: number) => text ? text.toFixed(2) : '0.00',
        };

    const restColumns = [
      {
        title: '建设性质',
        dataIndex: 'constructionNature',
        key: 'constructionNature',
        width: 120,
      },
      {
        title: '投资主体',
        dataIndex: 'investmentEntityAndName',
        key: 'investmentEntityAndName',
        width: 200,
        ellipsis: true,
      },
    ];

    // 根据来源页面决定显示实际开工时间还是实际竣工时间
    const dateColumn = sourcePage === 'progress2'
      ? {
          title: '实际竣工时间',
          dataIndex: 'completionDate',
          key: 'completionDate',
          width: 120,
          render: (text: Date) => text ? dayjs(text).format('YYYY-MM') : '--',
        }
      : {
          title: '实际开工时间',
          dataIndex: 'startDate',
          key: 'startDate',
          width: 120,
          render: (text: Date) => text ? dayjs(text).format('YYYY-MM') : '--',
        };

    return [...baseColumns, investmentColumn, ...restColumns, dateColumn];
  };

  const columns = getColumns();
  const goBackHome = () => {
    navigate(`/tutorial`);
  };
  // 页面加载时调用fetchProjectList
  useEffect(() => {
    fetchProjectList(1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

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
          {/*<Button className={styles.backButton} onClick={() => goBackHome()}>*/}
          {/*  返回首页*/}
          {/*</Button>*/}
        </div>

        <Breadcrumb className={styles.mb15} style={{ fontSize: '20px' }}>
          <Breadcrumb.Item>
            <a style={{ height: 'auto' }} onClick={() => navigate('/tutorial')}>
              <HomeOutlined style={{ marginRight: '10px', fontSize: '20px' }} /> 首页
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a style={{ height: 'auto' }} onClick={() => navigate('/tutorial/tou-zi-jin-du')}>投资进度</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a style={{ height: 'auto' }} onClick={() => {
              if (sourcePage === 'progress1') {
                navigate('/tutorial/tou-zi-jin-du/progress-detail1');
              } else if (sourcePage === 'progress2') {
                navigate('/tutorial/tou-zi-jin-du/progress-detail2');
              } else if (sourcePage === 'progress3') {
                navigate('/tutorial/tou-zi-jin-du/progress-detail3');
              } else {
                navigate('/tutorial/tou-zi-jin-du/progress-detail');
              }
            }}>
              {sourcePage === 'progress1' ? '入库投资' : sourcePage === 'progress2' ? '投资完成率' : sourcePage === 'progress3' ? '链群体系' : '在建项目'}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>项目信息</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>项目信息列表</h1>

        <div className={styles.projectsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>项目列表</div>
          </div>
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
            }}
            size="middle"
            loading={loading}
            locale={{
              emptyText: '暂无数据',
              triggerDesc: '点击降序',
              triggerAsc: '点击升序',
              cancelSort: '取消排序',
            }}
            rowKey={(record) => record.id || ''}
            scroll={{ x: '100%' }}
            onChange={handleTableChange}
          />
        </div>

        <div className={styles.footer}>
          <p>企业全生命周期管理系统 © {getCurrentYear()} 版权所有</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressDetailAdvance;
