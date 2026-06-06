import { primeApi } from '@/services/api';
import { ProjectDcdxEnterpriseCompletionStatsVo } from '@/services/apis';
import { ArrowLeftOutlined,HomeOutlined, BuildOutlined } from '@ant-design/icons';
import { Button, Table, Breadcrumb, Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './index.module.css';

const ComplianceDetail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleBack = () => {
    navigate(-1);
  };

  const [dataSource, setDataSource] = useState<ProjectDcdxEnterpriseCompletionStatsVo[]>([]);
  // 排序状态
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);
  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // URL参数
  const district = searchParams.get('district') || '';
  const isJG = searchParams.get('isJG') === 'true';
  const isYGJG = searchParams.get('isYGJG') === 'true';


  const listProjectDcdxEnterpriseCompletion = async (page = pagination.current, pageSize = pagination.pageSize) => {
    try {
      // 根据URL参数构建请求参数
      const params: any = {
        page: page,
        size: pageSize,
      };

      // 如果有district参数且不为空，则添加到请求参数中
      if (district && district.trim() !== '') {
        params.district = [district];
      }

      // 根据isJG和isYGJG参数设置其他筛选条件
      if (isJG && !isYGJG) {
        // 已进规企业
        params.isJG = true;
      } else if (!isJG && isYGJG) {
        // 预估进规企业
        params.isYGJG = true;
      } else if (!isJG && !isYGJG) {
        // 两项合计 - 显示所有数据
        // 不添加额外筛选条件
      }

      console.log('请求参数:', params);
      const data = await primeApi.listProjectDcdxEnterpriseCompletion(params);
      setDataSource(data.records || []);

      // 更新分页信息
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: data.total || 0,
      }));
    } catch (e) {
      console.log('获取企业列表失败:', e);
      setDataSource([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
      }));
    }
  };

  // 处理排序
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field && sorter.order) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);

      // 创建一个新的数据数组进行排序
      const sortedData = [...dataSource].sort((a, b) => {
        const valueA = a[sorter.field as keyof ProjectDcdxEnterpriseCompletionStatsVo] as number || 0;
        const valueB = b[sorter.field as keyof ProjectDcdxEnterpriseCompletionStatsVo] as number || 0;
        return sorter.order === 'ascend' ? valueA - valueB : valueB - valueA;
      });

      setDataSource(sortedData);
    } else if (!sorter.field) {
      // 清除排序，重新获取数据
      setSortField(null);
      setSortOrder(null);
      listProjectDcdxEnterpriseCompletion();
    }
  };

  // 静态数据 - 根据图片中的数据


  // 定义表格列配置
  const getColumns = () => {
    const baseColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        sorter: (a: any, b: any) => (a.id || 0) - (b.id || 0),
        render: (text: any, record: any, index: number) => {
          // 从1开始显示序号，基于当前页和每页条数计算
          const currentPage = pagination.current;
          const pageSize = pagination.pageSize;
          return (currentPage - 1) * pageSize + index + 1;
        },
      },
      {
        title: '企业名称',
        dataIndex: 'name',
        key: 'name',
        width: 250,
        ellipsis: true,
        sorter: (a: any, b: any) => {
          const nameA = a.name || '';
          const nameB = b.name || '';
          return nameA.localeCompare(nameB);
        },
      },
    ];

    return baseColumns;
  };

  // 定义表格数据源

  useEffect(() => {
    // 参数变化时重置分页到第一页
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));
    listProjectDcdxEnterpriseCompletion(1, pagination.pageSize);
  }, [district, isJG, isYGJG]);

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
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate('/tutorial/tou-chan-da-xiao')}><HomeOutlined style={{ marginRight: '10px', fontSize: '20px' }} /> 首页</a></Breadcrumb.Item>
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-2)}>投产达效</a></Breadcrumb.Item>
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-1)}>进规企业统计表</a></Breadcrumb.Item>
          <Breadcrumb.Item>企业列表</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>进规企业列表</h1>
        <p className={styles.pageSubtitle}>
          {district ? `筛选条件: ${district}` : '全部数据'} |
          {isJG && !isYGJG ? '已进规企业' : !isJG && isYGJG ? '预估进规企业' : '全部企业'}
        </p>

        <div className={styles.projectsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>企业列表</div>
            <div className={styles.tableActions}>
              <div className={styles.filterControls}>
                {/*<Button*/}
                {/*  className={[styles.chartBtn, styles.active].join(' ')}*/}
                {/*  data-view="city"*/}
                {/*  disabled*/}
                {/*>*/}
                {/*  按市(区)*/}
                {/*</Button>*/}
              </div>
              {/*<Button className={styles.tableBtn} icon={<DownloadOutlined />}>导出</Button>*/}
              {/*<Button className={styles.tableBtn} icon={<FilterOutlined />}>筛选</Button>*/}
            </div>
          </div>
          <Table
            className={styles.table}
            columns={getColumns()}
            dataSource={dataSource}
            pagination={false}
            size="middle"
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
            sortField={sortField}
            sortOrder={sortOrder}
          />

          <Pagination
            showSizeChanger={false}
            current={pagination.current}
            pageSize={pagination.pageSize}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            onChange={(page, pageSize) => {
              listProjectDcdxEnterpriseCompletion(page, pageSize);
            }}
            style={{ marginTop: 16, textAlign: 'center' }}
          />
        </div>

        {/* <div className={styles.footer}>
          <p>企业全生命周期管理服务平台 © 2025 版权所有</p>
        </div> */}
      </div>
    </div>
  );
};

export default ComplianceDetail;
