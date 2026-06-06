import { primeApi } from '@/services/api';
import { ProjectDcdxEnterpriseCompletionStatsVo } from '@/services/apis';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Table, Breadcrumb, Form, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const DEFAULT_YEAR = 2025;
const YEAR_OPTIONS = [2025].map((y) => ({ label: `${y}年`, value: y }));

const ComplianceDetail: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleBack = () => {
    navigate(-1);
  };

  const [queryYear, setQueryYear] = useState<number>(DEFAULT_YEAR);
  const [dataSource, setDataSource] = useState<ProjectDcdxEnterpriseCompletionStatsVo[]>([]);
  // 排序状态
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);

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
      listProjectDcdxEnterpriseCompletionStats();
    }
  };

  // 静态数据 - 根据图片中的数据
  const getStaticData = () => {
    // 泰州市是合计行，其他区县是明细行
    const baseData = [
      { id: '2', district: '靖江市', progress1: 759, progressFebSep: 87 },
      { id: '6', district: '泰兴市', progress1: 889, progressFebSep: 100 },
      { id: '3', district: '兴化市', progress1: 837, progressFebSep: 106 },
      { id: '5', district: '海陵区', progress1: 339, progressFebSep: 51 },
      { id: '4', district: '姜堰区', progress1: 707, progressFebSep: 79 },
      { id: '7', district: '医药高新区（高港区）', progress1: 516, progressFebSep: 32 },
    ];

    const totalRow = {
      id: 'total',
      district: '泰州市',
      progress1: 4047,
      progressFebSep: 455,
      isTotal: true,
    };

    const dataWithTotal = [
      totalRow,
      ...baseData,

    ];

    return dataWithTotal;
  };

  const listProjectDcdxEnterpriseCompletionStats = async (year?: number) => {
    try {
      const targetYear = year ?? queryYear;
      // 使用静态数据（可按 targetYear 扩展接口查询）
      const data = getStaticData();
      setDataSource(data);
    } catch (e) {
      console.log(e);
    }
  };

  const onQueryFinish = (values: { year?: number }) => {
    const year = values.year ?? DEFAULT_YEAR;
    setQueryYear(year);
    listProjectDcdxEnterpriseCompletionStats(year);
  };

  const onQueryReset = () => {
    form.setFieldsValue({ year: DEFAULT_YEAR });
    setQueryYear(DEFAULT_YEAR);
    listProjectDcdxEnterpriseCompletionStats(DEFAULT_YEAR);
  };

  // 定义表格列配置，根据当前视图类型动态显示或隐藏列
  const getColumns = () => {
    const baseColumns = [
      {
        title: '市（区）',
        dataIndex: 'district',
        key: 'district',
        width: 180,
        ellipsis: true,
      },
      {
        title: '全市规上工业企业数（家）',
        dataIndex: 'progress1',
        key: 'progress1',
        width: 180,
        ellipsis: true,
      },
      {
        title: '25年进规企业数（家）',
        dataIndex: 'progressFebSep',
        key: 'progressFebSep',
        width: 200,
        sorter: (a: any, b: any) => {
          if (a.isTotal || b.isTotal) return 0;
          return (a.progressFebSep || 0) - (b.progressFebSep || 0);
        },
        render: (text: number | undefined, record: any) =>
          text || 0 ,
      },
    ];

    return baseColumns;
  };

  // 定义表格数据源

  useEffect(() => {
    form.setFieldsValue({ year: DEFAULT_YEAR });
    listProjectDcdxEnterpriseCompletionStats(DEFAULT_YEAR);
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
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-2)}><HomeOutlined style={{ marginRight: '10px', fontSize: '20px' }} /> 首页</a></Breadcrumb.Item>
          <Breadcrumb.Item><a style={{ height: 'auto' }} onClick={() => navigate(-1)}>投产达效</a></Breadcrumb.Item>
          <Breadcrumb.Item>进规纳统</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>进规企业统计表</h1>
        {/* <p className={styles.pageSubtitle}>展示各市(区)的进规企业情况</p> */}

        {/* 查询条件表单 - 样式与 economic-detail 一致 */}
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
              name="queryForm"
              onFinish={onQueryFinish}
              initialValues={{ year: DEFAULT_YEAR }}
              autoComplete="off"
            >
              <Row>
                <Form.Item
                  style={{ width: '25%', marginLeft: '20px' }}
                  label="年度"
                  name="year"
                >
                  <Select
                    placeholder="请选择年度"
                    style={{ width: '100%' }}
                    options={YEAR_OPTIONS}
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
            <div className={styles.tableTitle}>进规企业统计</div>
            <div className={styles.tableActions}>
              <div className={styles.filterControls}>
                <Button
                  className={[styles.chartBtn, styles.active].join(' ')}
                  data-view="city"
                  disabled
                >
                  按市(区)
                </Button>
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
            rowClassName={(record: any) => {
              // 如果是合计行，则高亮
              if (record.isTotal) {
                return 'table-row-highlighted'; // 返回全局类名（不要加 styles.）
              }
              return '';
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

export default ComplianceDetail;
