import { primeApi } from '@/services/api';
import { ListKeySciTechProjectsRequest } from '@/services/apis';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import {Breadcrumb, Button, DatePicker, Form, message, Row, Select, Space, Table} from 'antd';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import scienceProjectData from './data.json';

const TopEconomyChart = (e: { data1: any }) => {
  const { data1 } = e;
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const option = {
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      series: [
        {
          type: 'pie',
          name: '市区新签约项目金额',
          center: ['60%', '50%'],
          radius: '70%',
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10, // 圆角大小
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            label: {
              show: true,
              fontWeight: 'bold',
            },
          },
          data: data1.map((item: any) => {
            return {
              name: item.district,
              value: item.newAmount,
            };
          }),
        },
      ],
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [JSON.stringify(e)]);
  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

function GlobalProjectChart2(e: { data1: any }) {
  const { data1 } = e;
  let list1: any[] = [];
  let list2: any[] = [];

  if (data1 && data1.length > 0) {
    data1.forEach((item: any) => {
      list1.push(item.total);
      list2.push(item.amount);
    });
  }
  const chartRef = useRef(null);
  useEffect(() => {
    const colors = ['#407DFC', '#8A7AF7', '#01C892', '#fed85e', '#36C2FD'];
    const chart = echarts.init(chartRef.current);
    const option = {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      grid: {
        top: '9%',
        bottom: '12%',
      },
      legend: {
        data: ['注册', '备案', '完成报批', '开工', '竣工'],
        top: 'top',
        left: 'right',
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0, // 强制显示所有标签
            // rotate: 30, // 标签旋转防重叠
            fontSize: 10, // 调小字体
          },
          data: data1.map((item: any) => item.district),
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '项目数量',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: false,
            lineStyle: {},
          },
          axisLabel: {
            formatter: function (value: any) {
              return value;
            },
          },
        },
      ],
      // 1 注册  5备案 4 报批 2开工 3 竣工
      series: [
        {
          name: '注册',
          type: 'bar',
          data: data1.map((item: any) => item.registerNum),
        },
        {
          name: '备案',
          type: 'bar',
          data: data1.map((item: any) => item.fillNum),
        },
        {
          name: '完成报批',
          type: 'bar',
          data: data1.map((item: any) => item.completeApprovaNum),
        },
        {
          name: '开工',
          type: 'bar',
          data: data1.map((item: any) => item.startNum),
        },
        {
          name: '竣工',
          type: 'bar',
          data: data1.map((item: any) => item.endNum),
        },
      ],
    };
    chart.setOption(option);
    return () => chart.dispose();
  }, [JSON.stringify(e)]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%', marginTop: '0.2rem' }}></div>;
}

const ScienceProject: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    window.history.go(-1);
  };

  const TitleCom: React.FC<{ text: string }> = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ marginRight: 8 }}>{text}</span>
    </div>
  );

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [money, setMoney] = useState(1);
  const [tabNum, setTabNum] = useState(1);
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(8);
  const [currDate, setCurrDate] = useState(dayjs('2025-10-01'));
  const [startDate, setStartDate] = useState(dayjs('2025-01-01'));
  const [endDate, setEndDate] = useState(dayjs('2025-10-31'));

  type FieldType = {
    startDate?: string;
    money?: number;
    endDate?: string;
  };

  interface ProjectData {
    districtCode: string;
    district: string;
    park?: string; // 园区/镇街
    newNum: string; // 知识产权类
    newNum2: string; // 高层次人才类
    newNum3: string; // 科技计划或大赛类
    newNum4: string; // 风险投资类
    newNum5: string; // 省市产研院类
    newNum6: string; // 重大创新平台类
    newNum7: string; // 工业、服务业项目转科创项目
    newAmount: string; // 1-6月累计
    newAmount2: string; // 目标数
    newAmount3: string; // 完成率
    registerNum: string;
    registerAmount: string;
    fillNum: string;
    fillAmount: string;
    completeApprovaNum: string;
    completeApprovaAmount: string;
    startNum: string;
    startAmount: string;
    endNum: string;
    endAmount: string;
  }
  const [dataSource, setDataSource] = useState<ProjectData[]>([]);

  const handleToList = (record: any, applicationCondition: string) => {
    const queryParams = new URLSearchParams();

    // 添加 district 参数 - 当 district 为"全市"时传空
    if (record?.district && record.district !== '全市') {
      queryParams.set('district', record.district);
    }

    // 添加 park 参数
    if (record?.park) {
      queryParams.set('park', record.park);
    }

    // 添加 applicationCondition 参数（列名）
    if (applicationCondition) {
      queryParams.set('applicationCondition', applicationCondition);
    }

    // 跳转到项目管理页面
    window.open(`/tutorial/ke-chuang-xiang-mu/project-manage?${queryParams.toString()}`, '_blank');
  };

  const columns = [
    {
      title: <TitleCom text="市（区）" />,
      dataIndex: 'district',
      key: 'district',
      width: 150,
      align: 'center' as const,
      onCell: (record: any, index: number) => {
        // 计算相同市（区）的行数
        const sameDistrictRows = dataSource.filter((item: any) => item.district === record.district);
        const firstIndex = dataSource.findIndex((item: any) => item.district === record.district);
        const isFirstRow = index === firstIndex;

        return {
          rowSpan: isFirstRow ? sameDistrictRows.length : 0,
        };
      },
    },
    {
      title: <TitleCom text="园区/镇街" />,
      dataIndex: 'park',
      key: 'park',
      width: 200,
      align: 'center' as const,
      render: (text: string, record: any) => {
        // 如果是汇总行（全市、靖江市等），显示空字符串
        if (record.districtCode === 'all' ||
            record.districtCode === 'jingjiang' ||
            record.districtCode === 'taixing' ||
            record.districtCode === 'xinghua' ||
            record.districtCode === 'hailing' ||
            record.districtCode === 'jiangyan' ||
            record.districtCode === 'medical_high') {
          return '';
        }
        // 其他情况显示园区/镇街名称
        return text || '';
      },
    },
    {
      title: <TitleCom text="知识产权类" />,
      dataIndex: 'newNum',
      key: 'newNum',
      width: 150,
      align: 'center' as const,
      sorter: (a: any, b: any) => a.newNum - b.newNum,
      onCell: (record: any) => ({
        onClick: () => handleToList(record, '知识产权类'),
        style: {
          cursor: 'pointer',
          fontWeight: 700,
          color: '#1a237e',
          transition: 'color 0.3s ease'
        },
      }),
    },
    {
      title: <TitleCom text="高层次人才类" />,
      dataIndex: 'newNum2',
      key: 'newNum2',
      width: 150,
      align: 'center' as const,
      sorter: (a: any, b: any) => a.newNum2 - b.newNum2,
      onCell: (record: any) => ({
        onClick: () => handleToList(record, '高层次人才类'),
        style: {
          cursor: 'pointer',
          fontWeight: 700,
          color: '#1a237e',
          transition: 'color 0.3s ease'
        },
      }),
    },
    {
      title: <TitleCom text="科技计划或大赛类" />,
      dataIndex: 'newNum3',
      key: 'newNum3',
      width: 150,
      align: 'center' as const,
      sorter: (a: any, b: any) => a.newNum3 - b.newNum3,
      onCell: (record: any) => ({
        onClick: () => handleToList(record, '科技计划或大赛类'),
        style: {
          cursor: 'pointer',
          fontWeight: 700,
          color: '#1a237e',
          transition: 'color 0.3s ease'
        },
      }),
    },
    {
      title: <TitleCom text="风险投资类" />,
      dataIndex: 'newNum4',
      key: 'newNum4',
      width: 150,
      align: 'center' as const,
      sorter: (a: any, b: any) => a.newNum4 - b.newNum4,
      onCell: (record: any) => ({
        onClick: () => handleToList(record, '风险投资类'),
        style: {
          cursor: 'pointer',
          fontWeight: 700,
          color: '#1a237e',
          transition: 'color 0.3s ease'
        },
      }),
    },
    {
      title: <TitleCom text="省市产研院类" />,
      dataIndex: 'newNum5',
      key: 'newNum5',
      width: 150,
      align: 'center' as const,
      sorter: (a: any, b: any) => a.newNum5 - b.newNum5,
      onCell: (record: any) => ({
        onClick: () => handleToList(record, '省市产研院类'),
        style: {
          cursor: 'pointer',
          fontWeight: 700,
          color: '#1a237e',
          transition: 'color 0.3s ease'
        },
      }),
    },
    {
      title: <TitleCom text="重大创新平台类" />,
      dataIndex: 'newNum6',
      key: 'newNum6',
      width: 150,
      align: 'center' as const,
      sorter: (a: any, b: any) => a.newNum6 - b.newNum6,
      onCell: (record: any) => ({
        onClick: () => handleToList(record, '重大创新平台类'),
        style: {
          cursor: 'pointer',
          fontWeight: 700,
          color: '#1a237e',
          transition: 'color 0.3s ease'
        },
      }),
    },
    {
      title: <TitleCom text="工业、服务业项目转科创项目" />,
      dataIndex: 'newNum7',
      key: 'newNum7',
      width: 150,
      align: 'center' as const,
      sorter: (a: any, b: any) => a.newNum7 - b.newNum7,
      onCell: (record: any) => ({
        onClick: () => handleToList(record, '工业、服务业项目转科创项目'),
        style: {
          cursor: 'pointer',
          fontWeight: 700,
          color: '#1a237e',
          transition: 'color 0.3s ease'
        },
      }),
    },
    {
      title: <TitleCom text="1-6月累计" />,
      dataIndex: 'newAmount',
      key: 'newAmount',
      width: 100,
      align: 'center' as const,
      sorter: (a: any, b: any) => a.newAmount - b.newAmount,
    },
    {
      title: <TitleCom text="目标数" />,
      dataIndex: 'newAmount2',
      key: 'newAmount2',
      width: 100,
      align: 'center' as const,
      sorter: (a: any, b: any) => a.newAmount2 - b.newAmount2,
    },
    {
      title: <TitleCom text="完成率" />,
      dataIndex: 'newAmount3',
      key: 'newAmount3',
      width: 100,
      align: 'center' as const,
      sorter: (a: any, b: any) => a.newAmount3 - b.newAmount3,
    },
  ];

  const onChangeDate2 = (newValue: string) => {
    setEndDate(dayjs(newValue));
  };

  const handleChangeSelect = (newValue: any) => {
    setMoney(newValue);
  };

  /**
   * 获取静态数据 - 从 JSON 文件读取科创项目统计数据
   */
  const getStaticData = (): ProjectData[] => {
    return scienceProjectData.scienceProjectData;
  };

  const loadData = async (params: ListKeySciTechProjectsRequest) => {
    try {
      setLoading(false);
      // 使用静态数据替代API调用
      const data = getStaticData();
      setDataSource(data);
    } catch (e) {
      message.error('数据加载失败');
      setLoading(false);
    }
  };

  // 表单提交处理
  const onFinish = (values: FieldType) => {
    console.log('查询条件:', values);
    loadData({
      page: 1,
      size: 1000
    });
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
    setEndDate(dayjs().endOf('month'));
    setMoney(1);
    form.setFieldsValue({
      endDate: dayjs().endOf('month'),
      money: 1,
    });
    loadData({
      page: 1,
      size: 1000
    });
  };

  useEffect(() => {
    setEndDate(dayjs().endOf('month'));
    loadData({
      page: 1,
      size: 1000
    });
  }, []);

  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <Button className={styles.backBtn} onClick={() => goBack()} icon={<ArrowLeftOutlined />}>
          返回
        </Button>

        <Breadcrumb className={styles.mb15}>
          <Breadcrumb.Item>
            <a style={{ height: 'auto' }} onClick={() => navigate('/tutorial')}>
              <HomeOutlined style={{ marginRight: '10px', fontSize: '20px' }} />
            </a>
          </Breadcrumb.Item>

          <Breadcrumb.Item>科创项目</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className={styles.pageTitle}>科创项目情况表</h1>

        {/* 查询条件表单 */}
        <div style={{ marginBottom: '20px',display: 'none' }}>
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
                endDate: endDate,
              }}
            >
              <Row>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px',
                  }}
                  label="所属月份"
                  name="endDate"
                >
                  <DatePicker
                    style={{ marginRight: '20px' }}
                    placeholder="所属月份"
                    picker="month"
                    onChange={onChangeDate2}
                  />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
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
                      { value: 1, label: '1亿元' },
                      { value: 5, label: '5亿元' },
                      { value: 10, label: '10亿元' },
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
            <div className={styles.tableTitle}>科创项目表</div>
            <div className={styles.tableActions}></div>
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.districtCode}
            bordered
            size="middle"
            className={styles.benchtable}
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
          />
        </div>
      </div>
    </div>
  );
};

export default ScienceProject;
