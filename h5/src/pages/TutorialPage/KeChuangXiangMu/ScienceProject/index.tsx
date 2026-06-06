import { primeApi } from '../../../../api';
import { StatisticsProjectStatusInfoRequest } from '../../../../apis';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import {Breadcrumb, Button, DatePicker, Form, message, Row, Select, Space, Table} from 'antd';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const ScienceProject = (e: { data1: any }) => {
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

const KeChuangXiangMu: React.FC = () => {
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
    newNum: string;
    newAmount: string;
    registerNum: string;
    registerAmount: string;
    fillNum: string;
    fillAmount: string;
    completeApprovaNum: string;
    completeApprovaAmount: string;
    startNum: string;
    startAmount: string;
  }
  const [dataSource, setDataSource] = useState<ProjectData[]>([]);

  const handleToList = (record: any, type: string) => {
    const queryParams = new URLSearchParams({
      year: dayjs(endDate).year().toString(),
      currStartDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
      currDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      showAll: 'true',
      page: '1',
      pageSize: '10',
    });
    if (record?.district !== '-') {
      if (record?.districtCode) {
        queryParams.set('district', record?.districtCode);
      }
    }
    if (money !== 0) {
      queryParams.set('investmentAmount', money.toString());
    }
    queryParams.set('fromPage', '/tutorial/ke-chuang-xiang-mu');
    // 跳转到项目管理页面
    // navigate(`/tutorial/project-manage?${queryParams.toString()}`);
    window.open(`/tutorial/ke-chuang-xiang-mu/project-manage?${queryParams.toString()}`, '_blank');
  };

  const columns = [
    {
      title: <TitleCom text="市（区）" />,
      dataIndex: 'district',
      key: 'district',
      width: 150,
      align: 'center' as const,
    },
    {
      title: <TitleCom text="园区/镇街" />,
      dataIndex: 'district',
      key: 'district',
      width: 150,
      align: 'center' as const,
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

  const loadData = async (params: StatisticsProjectStatusInfoRequest) => {
   try {
     setLoading(false);
     const res = await primeApi.statisticsProjectStatusInfo(params);
     const data = res ? JSON.parse(res).records : [];
     const tableData: ProjectData[] = data.map((item: any) => {
       // (1 注册  5备案 4 报批 2开工 3 竣工)
       const obj1 = item.children.filter((item: any) => item.code === item.districtCode + '_1');
       const obj2 = item.children.filter((item: any) => item.code === item.districtCode + '_5');
       const obj3 = item.children.filter((item: any) => item.code === item.districtCode + '_4');
       const obj4 = item.children.filter((item: any) => item.code === item.districtCode + '_2');
       const obj5 = item.children.filter((item: any) => item.code === item.districtCode + '_3');

       return {
         districtCode: item.districtCode,
         district: item.district,
         newNum: item.projNums || 0,
         newAmount: item.qyje || 0,
         registerNum: obj1?.[0]?.projNums || 0,
         registerAmount: obj1?.[0]?.qyje || 0,
         fillNum: obj2?.[0]?.projNums || 0,
         fillAmount: obj2?.[0]?.qyje || 0,
         completeApprovaNum: obj3?.[0]?.projNums || 0,
         completeApprovaAmount: obj3?.[0]?.qyje || 0,
         startNum: obj4?.[0]?.projNums || 0,
         startAmount: obj4?.[0]?.qyje || 0,
         endNum: obj5?.[0]?.projNums || 0,
         endAmount: obj5?.[0]?.qyje || 0,
       };
     });
     setDataSource(tableData);
   }catch (e){
     message.error('数据加载失败');
     setLoading(false);
   }
  };

  // 表单提交处理
  const onFinish = (values: FieldType) => {
    console.log('查询条件:', values);
    loadData({
      rmb: money === 0 ? undefined : money,
      currStartDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).format('YYYY-MM-DD'),
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
    const endTime = dayjs().endOf('month');
    loadData({
      rmb: 1,
      currStartDate: dayjs(endTime).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endTime).format('YYYY-MM-DD'),
    });
  };

  useEffect(() => {
    setEndDate(dayjs().endOf('month'));
    loadData({
      rmb: 1,
      currStartDate: dayjs(endDate).startOf('month').format('YYYY-MM-DD'),
      currEndDate: dayjs(endDate).format('YYYY-MM-DD'),
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
            <a onClick={() => navigate(-1)}>
              <HomeOutlined />
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
                      { value: 1, label: '一亿元' },
                      { value: 5, label: '五亿元' },
                      { value: 10, label: '十亿元' },
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
          />
        </div>

        {/*<div className={styles.chartsSection}>*/}
        {/*  <div className={styles.chartsHeader}>*/}
        {/*    <h2 className={styles.chartsTitle}>数据可视化分析</h2>*/}
        {/*  </div>*/}

        {/*  <div className={styles.chartsContainer}>*/}
        {/*    <div className={styles.chartCard}>*/}
        {/*      <div className={styles.chartCardHeader}>*/}
        {/*        <h3 className={styles.chartCardTitle}>市区新签约项目金额饼状图</h3>*/}
        {/*      </div>*/}
        {/*      <div className={styles.chartCardBody}>*/}
        {/*        <TopEconomyChart data1={dataSource} />*/}
        {/*      </div>*/}
        {/*    </div>*/}

        {/*    <div className={styles.chartCard}>*/}
        {/*      <div className={styles.chartCardHeader}>*/}
        {/*        <h3 className={styles.chartCardTitle}>四阶段项目数量</h3>*/}
        {/*      </div>*/}
        {/*      <div className={styles.chartCardBody}>*/}
        {/*        <GlobalProjectChart2 data1={dataSource} />*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default KeChuangXiangMu;
