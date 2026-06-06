import { primeApi } from '@/services/api';
import { ProjectNotStartRequest } from '@/services/apis';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  DatePicker,
  Form,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;

const BuKaiGong: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goBackHome = () => {
    navigate(`/tutorial`);
  };

  const TitleCom: React.FC<{ text: string }> = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ marginRight: 8 }}>{text}</span>
    </div>
  );

  const [rangeDate, setRangeDate] = useState([dayjs().startOf('year'), dayjs().endOf('month')]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [currentView, setCurrentView] = useState<string>('table');

  const [money, setMoney] = useState<number | string>(0);
  const [showMoneyInput, setShowMoneyInput] = useState(false);
  const [startMoney, setStartMoney] = useState(0);
  const [endMoney, setEndMoney] = useState(1);
  const [industry, setBIndustry] = useState('');
  const [isKcProj, setIsKcProj] = useState('');

  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month'));

  type FieldType = {
    startDate?: string;
    money?: number;
    endDate?: string;
    rangeDate?: any;
    industry?: string;
    isKcProj?: string;
    startMoney?: number;
    endMoney?: number;
  };

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 递归为树形数据添加唯一 key，确保子行正确渲染
  const addKeysToNestedData = (items: any[], prefix = '0'): any[] => {
    return items.map((item, i) => {
      const key = `${prefix}-${i}`;
      const newItem = { ...item, key };
      if (Array.isArray(newItem.children) && newItem.children.length > 0) {
        newItem.children = addKeysToNestedData(newItem.children, key);
      }
      return newItem;
    });
  };

  const loadData = async (params: ProjectNotStartRequest) => {
    setLoading(true);
    try {
      const res = await primeApi.projectNotStart(params);
      const list = res?.children ? [res] : res ? [res] : [];
      const listWithKeys = addKeysToNestedData(list);
      setDataSource(listWithKeys);
      // 只展开第一层（到第二层），不展开更深层级
      const getFirstLevelKeys = (items: any[]): React.Key[] => {
        const keys: React.Key[] = [];
        items.forEach((item) => {
          if (item.key && Array.isArray(item.children) && item.children.length > 0) {
            keys.push(item.key);
          }
        });
        return keys;
      };
      setExpandedKeys(getFirstLevelKeys(listWithKeys));
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  const buildParams = (): ProjectNotStartRequest => {
    // 开始月份传当月1号，结束月份传当月最后一天
    const params: ProjectNotStartRequest = {
      start: new Date(startDate.format('YYYY-MM-DD')),
      end: new Date(endDate.format('YYYY-MM-DD')),
      isKcProj: isKcProj === '是' ? true : isKcProj === '否' ? false : undefined,
    };
    if (industry === '1') {
      params.industry = '服务业';
    } else if (industry === '2') {
      params.industry = '工业';
    }
    if (money === -1) {
      params.rmb1 = startMoney;
      params.rmb2 = endMoney;
    } else if (money === 'below_0.5') {
      params.rmb1 = 0;
      params.rmb2 = 0.5;
    } else if (money === '0.5_to_1') {
      params.rmb1 = 0.5;
      params.rmb2 = 1;
    } else if (money !== 0) {
      params.rmb = Number(money);
    }
    return params;
  };

  const columns = [
    {
      title: <TitleCom text="市（区）/ 园区" />,
      dataIndex: 'district',
      key: 'district',
      width: 200,
      align: 'center' as const,
      render: (_: any, record: any) => record.parkName || record.districtName || '-',
    },
    {
      title: <TitleCom text="签约" />,
      children: [
        {
          title: <TitleCom text="个数" />,
          dataIndex: ['sign', 'count'],
          key: 'signCount',
          width: 100,
          align: 'center' as const,
        },
        {
          title: <TitleCom text="金额（亿元）" />,
          dataIndex: ['sign', 'amount'],
          key: 'signAmount',
          width: 120,
          align: 'center' as const,
          render: (val: number) => (val !== undefined && val !== null ? val.toFixed(2) : '-'),
        },
      ],
    },
    {
      title: <TitleCom text="注册" />,
      children: [
        {
          title: <TitleCom text="个数" />,
          dataIndex: ['register', 'count'],
          key: 'registerCount',
          width: 100,
          align: 'center' as const,
        },
        {
          title: <TitleCom text="金额（亿元）" />,
          dataIndex: ['register', 'amount'],
          key: 'registerAmount',
          width: 120,
          align: 'center' as const,
          render: (val: number) => (val !== undefined && val !== null ? val.toFixed(2) : '-'),
        },
      ],
    },
    {
      title: <TitleCom text="备案" />,
      children: [
        {
          title: <TitleCom text="个数" />,
          dataIndex: ['record', 'count'],
          key: 'recordCount',
          width: 100,
          align: 'center' as const,
        },
        {
          title: <TitleCom text="金额（亿元）" />,
          dataIndex: ['record', 'amount'],
          key: 'recordAmount',
          width: 120,
          align: 'center' as const,
          render: (val: number) => (val !== undefined && val !== null ? val.toFixed(2) : '-'),
        },
      ],
    },
    {
      title: <TitleCom text="报批" />,
      children: [
        {
          title: <TitleCom text="个数" />,
          dataIndex: ['approval', 'count'],
          key: 'approvalCount',
          width: 100,
          align: 'center' as const,
        },
        {
          title: <TitleCom text="金额（亿元）" />,
          dataIndex: ['approval', 'amount'],
          key: 'approvalAmount',
          width: 120,
          align: 'center' as const,
          render: (val: number) => (val !== undefined && val !== null ? val.toFixed(2) : '-'),
        },
      ],
    },
  ];

  const onChangeDate3 = (newValue: any) => {
    if (!newValue || !newValue[0] || !newValue[1]) return;

    const start = dayjs(newValue[0]).startOf('month');
    const end = dayjs(newValue[1]).endOf('month');

    // 月份不能跨年
    if (start.year() !== end.year()) {
      message.warning('月份选择不能跨年，请重新选择');
      form.setFieldsValue({ rangeDate });
      return;
    }

    setStartDate(start);
    setEndDate(end);
    setRangeDate([start, end]);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const handleChangeSelect = (newValue: any) => {
    setMoney(newValue);
    if (newValue === -1) {
      setShowMoneyInput(true);
      setStartMoney(0);
      setEndMoney(1);
      form.setFieldsValue({
        startMoney: 0,
        endMoney: 1,
        money: -1,
        rangeDate,
        industry,
        isKcProj,
      });
    } else {
      setShowMoneyInput(false);
    }
  };

  const changeStart = (newValue: any) => setStartMoney(newValue);
  const changeEnd = (newValue: any) => setEndMoney(newValue);
  const handleChangeSelect2 = (newValue: any) => setBIndustry(newValue);
  const handleChangeSelect3 = (newValue: any) => setIsKcProj(newValue);

  const onFinish = () => {
    loadData(buildParams());
  };

  const onReset = () => {
    form.resetFields();
    setStartDate(dayjs().startOf('year'));
    setEndDate(dayjs().endOf('month'));
    setRangeDate([dayjs().startOf('year'), dayjs().endOf('month')]);
    setMoney(0);
    setBIndustry('');
    setIsKcProj('');
    setStartMoney(0);
    setEndMoney(1);
    setShowMoneyInput(false);
    form.setFieldsValue({
      startDate: dayjs().startOf('year'),
      endDate: dayjs().endOf('month'),
      rangeDate: [dayjs().startOf('year'), dayjs().endOf('month')],
      money: 0,
      industry: '',
      isKcProj: '',
      startMoney: 0,
      endMoney: 1,
    });
    loadData({
      start: new Date(dayjs().startOf('year').format('YYYY-MM-DD')),
      end: new Date(dayjs().endOf('month').format('YYYY-MM-DD')),
    });
  };

  useEffect(() => {
    const start = dayjs().startOf('year');
    const end = dayjs().endOf('month');
    setStartDate(start);
    setEndDate(end);
    setRangeDate([start, end]);
    loadData({
      start: new Date(start.format('YYYY-MM-DD')),
      end: new Date(end.format('YYYY-MM-DD')),
    });
  }, []);

  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <div className={styles.flexBetWeen}>
          <Button className={styles.backBtn} onClick={goBack} icon={<ArrowLeftOutlined />}>
            返回
          </Button>
          <Button className={styles.backBtn} onClick={goBackHome}>
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
            <a style={{ height: 'auto' }} onClick={() => navigate('/tutorial/preinvestment')}>
              前期招商
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a style={{ height: 'auto' }} onClick={() => navigate('/tutorial/preinvestment/project-progress')}>
              项目进度情况
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>未开工项目进度</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>全市未开工项目进度情况表</h1>

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
                money,
                rangeDate,
                industry,
                isKcProj,
                startMoney,
                endMoney,
              }}
            >
              <Row>
                <Form.Item<FieldType> style={{ marginLeft: '20px' }} label="所属月份" name="rangeDate">
                  <RangePicker
                    locale={zhCN}
                    picker="month"
                    format="YYYY-MM"
                    placeholder={['开始月份', '结束月份']}
                    style={{ marginRight: '20px' }}
                    onChange={onChangeDate3}
                  />
                </Form.Item>
                <Form.Item<FieldType> style={{ marginLeft: '20px' }} label="金额范围" name="money">
                  <Select
                    style={{ width: 120 }}
                    onChange={handleChangeSelect}
                    options={[
                      { value: 0, label: '全部' },
                      { value: -1, label: '自定义' },
                      { value: 'below_0.5', label: '5千万元以下' },
                      { value: '0.5_to_1', label: '5千万元-1亿元' },
                      { value: 1, label: '1亿元' },
                      { value: 5, label: '5亿元' },
                      { value: 10, label: '10亿元' },
                    ]}
                  />
                </Form.Item>
                {showMoneyInput && (
                  <Row>
                    <Form.Item<FieldType>
                      style={{ width: '110px', marginLeft: '20px' }}
                      label=""
                      name="startMoney"
                    >
                      <InputNumber addonAfter="亿元" defaultValue={0} onChange={changeStart} />
                    </Form.Item>
                    <div className={styles.middleText}>至</div>
                    <Form.Item<FieldType> style={{ width: '110px' }} label="" name="endMoney">
                      <InputNumber addonAfter="亿元" defaultValue={1} onChange={changeEnd} />
                    </Form.Item>
                  </Row>
                )}
                <Form.Item<FieldType> style={{ marginLeft: '20px' }} label="所属行业" name="industry">
                  <Select
                    style={{ width: 120 }}
                    onChange={handleChangeSelect2}
                    options={[
                      { value: '', label: '全部' },
                      { value: '1', label: '服务业' },
                      { value: '2', label: '制造业' },
                    ]}
                  />
                </Form.Item>
                <Form.Item<FieldType> style={{ marginLeft: '20px' }} label="是否科创项目" name="isKcProj">
                  <Select
                    style={{ width: 120 }}
                    onChange={handleChangeSelect3}
                    options={[
                      { value: '', label: '全部' },
                      { value: '是', label: '是' },
                      { value: '否', label: '否' },
                    ]}
                  />
                </Form.Item>
                <Form.Item style={{ marginLeft: '20px' }}>
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

        <div className={styles.actionContainer}>
          <div className={styles.tableActions}>
            <div className={styles.filterControls}>
              <Button
                className={[styles.chartBtn, currentView === 'table' ? styles.active : ''].join(' ')}
                data-view="table"
                onClick={() => handleViewChange('table')}
              >
                表
              </Button>
            </div>
          </div>
        </div>

        {currentView === 'table' && (
          <div className={styles.projectsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>未开工项目进度表</div>
              <div className={styles.tableActions} />
            </div>
            <Table
              columns={columns}
              dataSource={dataSource}
              loading={loading}
              pagination={false}
              rowKey={(record) => record.key}
              bordered
              size="middle"
              className={styles.benchtable}
              expandable={{
                childrenColumnName: 'children',
                expandedRowKeys: expandedKeys,
                onExpandedRowsChange: (keys) => setExpandedKeys([...keys]),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BuKaiGong;
