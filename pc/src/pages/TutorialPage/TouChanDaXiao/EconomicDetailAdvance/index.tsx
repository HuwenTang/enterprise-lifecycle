import React, {useEffect, useState} from 'react';
import { Button, Table, Breadcrumb, message } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './index.module.css';
import {primeApi} from "@/services/api";
import {ProjectCompletedInfoVo} from "@/services/apis";
import dayjs from 'dayjs';

const EconomicDetailAdvance: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const handleBack = () => {
    navigate(-1);
  };

  const [dataSource, setDataSource] = useState<ProjectCompletedInfoVo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 从URL获取参数
  const year = searchParams.get('year');
  const district = searchParams.get('district');

  // 动态生成表格列
  const generateColumns = () => {
    const baseColumns: any[] = [
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
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 200,
        ellipsis: true,
      },
      {
        title: '所属园区',
        dataIndex: 'park',
        key: 'park',
        width: 150,
        ellipsis: true,
      },
      {
        title: '所属板块',
        dataIndex: 'sector',
        key: 'sector',
        width: 150,
        ellipsis: true,
      },
      {
        title: '13条产业链',
        dataIndex: 'industry',
        key: 'industry',
        width: 150,
        ellipsis: true,
      },
      {
        title: '8个创新型集群',
        dataIndex: 'cluster',
        key: 'cluster',
        width: 150,
        ellipsis: true,
      },
      {
        title: '竣工时间',
        dataIndex: 'completionTime',
        key: 'completionTime',
        width: 120,
        render: (text: Date) => text ? dayjs(text).format('YYYY-MM-DD') : '--',
      },
      {
        title: '计划固定资产投资（万元）',
        dataIndex: 'plannedFixedAssetInvestment',
        key: 'plannedFixedAssetInvestment',
        width: 180,
        render: (text: number) => text ? text.toLocaleString() : '0',
      },
      {
        title: '实际固定资产投资（万元）',
        dataIndex: 'actualFixedAssetInvestment',
        key: 'actualFixedAssetInvestment',
        width: 180,
        render: (text: number) => text ? text.toLocaleString() : '0',
      },
      {
        title: '实际用地面积（亩）',
        dataIndex: 'actualLandArea',
        key: 'actualLandArea',
        width: 150,
        render: (text: number) => text ? text.toFixed(2) : '0.00',
      },
      {
        title: '实际用工人数（人）',
        dataIndex: 'actualEmploymentNumbers',
        key: 'actualEmploymentNumbers',
        width: 150,
        render: (text: number) => text ? text.toLocaleString() : '0',
      },
      {
        title: '实际新增经济效益-销售（万元）',
        dataIndex: 'actualNewEconomicBenefitsSales',
        key: 'actualNewEconomicBenefitsSales',
        width: 200,
        render: (text: number) => text ? text.toLocaleString() : '0',
      },
      {
        title: '实际新增经济效益-税金（万元）',
        dataIndex: 'actualNewEconomicBenefitsTax',
        key: 'actualNewEconomicBenefitsTax',
        width: 200,
        render: (text: number) => text ? text.toLocaleString() : '0',
      },
      {
        title: '实际新增经济效益-利润（万元）',
        dataIndex: 'actualNewEconomicBenefitsProfit',
        key: 'actualNewEconomicBenefitsProfit',
        width: 200,
        render: (text: number) => text ? text.toLocaleString() : '0',
      },
      {
        title: '亩均税收（万元/亩）',
        dataIndex: 'taxPerMu',
        key: 'taxPerMu',
        width: 150,
        render: (text: number) => text ? text.toFixed(2) : '0.00',
      },
    ];

    return baseColumns;
  };

  // 获取项目列表
  const fetchProjectList = async (page: number = 1, size: number = 10) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        size,
      };

      if (year) {
        params.year = year;
      }
      if (district && district !== '泰州市') {
        params.area = district;
      }

      console.log('调用listDCDXInfo参数:', params);

      const response = await primeApi.listDCDXInfo(params);

      console.log('API响应:', response);

      setDataSource(response.records || []);
      setPagination({
        current: response.page || 1,
        pageSize: response.size || 10,
        total: response.total || 0,
      });
    } catch (error) {
      console.error('获取项目列表失败:', error);
      message.error('获取项目列表失败');
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理分页变化
  const handleTableChange = (paginationConfig: any, filters: any, sorter: any) => {
    fetchProjectList(paginationConfig.current, paginationConfig.pageSize);
  };

  // 获取当前年份
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  // 页面加载时调用fetchProjectList
  useEffect(() => {
    fetchProjectList(1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <a style={{ height: 'auto' }} onClick={() => navigate('/tutorial/tou-chan-da-xiao')}>投产达效</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a style={{ height: 'auto' }} onClick={() => navigate('/tutorial/tou-chan-da-xiao/economic-detail')}>产出效益</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>项目信息</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>项目信息列表</h1>

        <div className={styles.projectsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>项目列表 {district ? `- ${district}` : ''}</div>
          </div>
          <Table
            className={styles.table}
            columns={generateColumns()}
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
            scroll={{ x: 'max-content' }}
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

export default EconomicDetailAdvance;
