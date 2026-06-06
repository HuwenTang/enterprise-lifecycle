import { primeApi } from '@/services/api';
import { ProjectFilingInfoVo } from '@/services/apis';
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

const ProjectFilingInfoList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dataSource, setDataSource] = useState<ProjectFilingInfoVo[]>([]);
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
    // 无 history 时回到来源页
    const from = params.get('from') || 'approve';
    if (from === 'land') {
      navigate('/tutorial/record-approval/detail/land-datail', { replace: true });
    } else if (from === 'chain') {
      navigate('/tutorial/record-approval/detail/chain-datail', { replace: true });
    } else if (from === 'audit') {
      navigate('/tutorial/record-approval/detail/audit-datail', { replace: true });
    } else {
      navigate('/tutorial/record-approval/detail/approve-datail', { replace: true });
    }
  };

  // 获取来源页面
  const getSourcePage = () => {
    const params = new URLSearchParams(location.search);
    return params.get('from') || 'approve';
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
      isInvestment: params.get('isInvestment') ? params.get('isInvestment') === 'true' : undefined,
      isAddLand: params.get('isAddLand') ? params.get('isAddLand') === 'true' : undefined,
      isLand: params.get('isLand') ? params.get('isLand') === 'true' : undefined,
      isFactory: params.get('isFactory') ? params.get('isFactory') === 'true' : undefined,
      isEnvironment: params.get('isEnvironment') ? params.get('isEnvironment') === 'true' : undefined,
      isEnergy: params.get('isEnergy') ? params.get('isEnergy') === 'true' : undefined,
      isSecurity: params.get('isSecurity') ? params.get('isSecurity') === 'true' : undefined,
      isMap: params.get('isMap') ? params.get('isMap') === 'true' : undefined,
      isConstruction: params.get('isConstruction') ? params.get('isConstruction') === 'true' : undefined,
      isPlan: params.get('isPlan') ? params.get('isPlan') === 'true' : undefined,
      innovativeCluster: params.get('innovativeCluster') || undefined,
      minAmount: params.get('minAmount') ? parseInt(params.get('minAmount')!) : undefined,
      maxAmount: params.get('maxAmount') ? parseInt(params.get('maxAmount')!) : undefined,
      projectType: params.get('projectType') || undefined,
      isALLCluster: params.get('isALLCluster') ? params.get('isALLCluster') === 'true' : undefined,
    };
  };

  // 获取项目备案信息列表
  const fetchProjectFilingInfo = async (page: number = 1, size: number = 10) => {
    setLoading(true);
    try {
      const queryParams = getQueryParams();

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
      if (queryParams.isInvestment !== undefined) apiParams.isInvestment = queryParams.isInvestment;
      if (queryParams.isAddLand !== undefined) apiParams.isAddLand = queryParams.isAddLand;
      if (queryParams.isLand !== undefined) apiParams.isLand = queryParams.isLand;
      if (queryParams.isFactory !== undefined) apiParams.isFactory = queryParams.isFactory;
      if (queryParams.isEnvironment !== undefined) apiParams.isEnvironment = queryParams.isEnvironment;
      if (queryParams.isEnergy !== undefined) apiParams.isEnergy = queryParams.isEnergy;
      if (queryParams.isSecurity !== undefined) apiParams.isSecurity = queryParams.isSecurity;
      if (queryParams.isMap !== undefined) apiParams.isMap = queryParams.isMap;
      if (queryParams.isConstruction !== undefined) apiParams.isConstruction = queryParams.isConstruction;
      if (queryParams.isPlan !== undefined) apiParams.isPlan = queryParams.isPlan;
      // URL参数为innovativeCluster，但API参数名为industrialChain
      if (queryParams.innovativeCluster) apiParams.industrialChain = queryParams.innovativeCluster;
      if (queryParams.minAmount !== undefined) apiParams.minAmount = queryParams.minAmount;
      if (queryParams.maxAmount !== undefined) apiParams.maxAmount = queryParams.maxAmount;
      if (queryParams.projectType) apiParams.projectType = queryParams.projectType;
      if (queryParams.isALLCluster !== undefined) apiParams.isALLCluster = queryParams.isALLCluster;

      console.log('API请求参数:', apiParams);

      const response = await primeApi.listProjectFilingInfo(apiParams);

      console.log('API响应:', response);

      setDataSource(response.records || []);
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

  // 表格列配置
  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '备案证号',
      dataIndex: 'filingCertificateNo',
      key: 'filingCertificateNo',
      width: 150,
      ellipsis: true,
    },
    {
      title: '市（区）',
      dataIndex: 'district',
      key: 'district',
      width: 220,
    },
    {
      title: '园区',
      dataIndex: 'park',
      key: 'park',
      width: 120,
      ellipsis: true,
    },
    {
      title: '投资额（万元）',
      dataIndex: 'investmentAmount',
      key: 'investmentAmount',
      width: 120,
      render: (text: number) => text ? text.toFixed(2) : '0.00',
    },
    {
      title: '项目类型',
      dataIndex: 'projectType',
      key: 'projectType',
      width: 100,
      render: (text: string) => {
        if (text === 'INDUSTRY') return '工业';
        if (text === 'SERVICE') return '服务业';
        return text;
      },
    },
    {
      title: '是否外资',
      dataIndex: 'isForeignInvestment',
      key: 'isForeignInvestment',
      width: 100,
      render: (text: boolean) => text ? '是' : '否',
    },
    {
      title: '产业方向',
      dataIndex: 'industryDirection',
      key: 'industryDirection',
      width: 150,
      ellipsis: true,
    },
    {
      title: '用地类型',
      dataIndex: 'landUseType',
      key: 'landUseType',
      width: 120,
      render: (text: string) => {
        if (text === 'NEW_LAND') return '新增用地';
        if (text === 'RENEW_LAND') return '存量用地';
        if (text === 'RENT_FACTORY') return '租用厂房';
        if (text === 'SELF_LAND_OR_FACTORY') return '自有土地或厂房';
        if (text === 'ELSE') return '其他';
        return text;
      },
    },
    {
      title: '申报单位',
      dataIndex: 'applicationUnit',
      key: 'applicationUnit',
      width: 200,
      ellipsis: true,
    },
    {
      title: '备案部门',
      dataIndex: 'filingDepartment',
      key: 'filingDepartment',
      ellipsis: true,
      width: 120,
    },
    {
      title: '完成备案时间',
      dataIndex: 'completeFilingTime',
      key: 'completeFilingTime',
      width: 120,
      render: (text: Date) => text ? dayjs(text).format('YYYY-MM-DD') : '--',
    },

  ];
  const goBackHome = () => {
    navigate(`/tutorial`);
  };

  // 页面加载时调用fetchProjectFilingInfo
  useEffect(() => {
    const queryParams = getQueryParams();
    if (queryParams.keyProjectType === '市重点' || queryParams.keyProjectType === '省重大') {
      setDataSource([]);
      setPagination((prev) => ({ ...prev, current: 1, total: 0 }));
      setLoading(false);
      return;
    }
    fetchProjectFilingInfo(1, 10);
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
            <a style={{ height: 'auto' }} onClick={() => {
              if (sourcePage === 'land') {
                navigate('/tutorial/record-approval/detail/land-datail');
              } else if (sourcePage === 'chain') {
                navigate('/tutorial/record-approval/detail/chain-datail');
              } else {
                navigate('/tutorial/record-approval/detail/approve-datail');
              }
            }}>
              {sourcePage === 'land' ? '用地保障' : sourcePage === 'chain' ? '链群分布' : '新备案项目'}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>项目信息</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>项目信息列表</h1>

        <div className={styles.projectsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>项目备案信息</div>
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
            scroll={{ x: 2000 }}
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

export default ProjectFilingInfoList;
