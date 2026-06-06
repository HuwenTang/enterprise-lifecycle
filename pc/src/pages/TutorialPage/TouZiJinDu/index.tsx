import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { primeApi } from '@/services/api';
import { InvestmentOverview } from '@/services/apis';
import styles from './index.module.css';

const TouZiJinDu: React.FC = () => {
  const navigate = useNavigate();

  // 本页固定展示 2025 年 9 月数据
  const TARGET_YEAR = 2025;
  const TARGET_MONTH = 9;

  // 视图状态：'all' | '1' | '5' | '10'
  const [currentView1, setCurrentView1] = useState<string>('all'); // 默认为全部
  const [currentView2, setCurrentView2] = useState<string>('all'); // 默认为全部
  const [currentView3, setCurrentView3] = useState<string>('all'); // 默认为全部
  const [currentView4, setCurrentView4] = useState<string>('all'); // 默认为全部

  // 市重点/省重大 独立切换，与主视图不冲突，再次点击取消
  const [keyFilter1, setKeyFilter1] = useState<string | null>(null);
  const [keyFilter2, setKeyFilter2] = useState<string | null>(null);
  const [keyFilter3, setKeyFilter3] = useState<string | null>(null);
  const [keyFilter4, setKeyFilter4] = useState<string | null>(null);

  // 存储各个卡片的数据
  const [data1, setData1] = useState<InvestmentOverview | null>(null);
  const [data2, setData2] = useState<InvestmentOverview | null>(null);
  const [data3, setData3] = useState<InvestmentOverview | null>(null);
  const [data4, setData4] = useState<InvestmentOverview | null>(null);

  const handleBack = () => {
    navigate('/tutorial');
  };

  const applyMoneyParams = (params: URLSearchParams, view: string) => {
    if (view === '1') {
      params.set('minAmount', '10000');
      params.set('maxAmount', '50000');
    } else if (view === '5') {
      params.set('minAmount', '50000');
      params.set('maxAmount', '100000');
    } else if (view === '10') {
      params.set('minAmount', '100000');
      params.delete('maxAmount');
    } else {
      params.delete('minAmount');
      params.delete('maxAmount');
    }
  };

  const applyKeyProjectTypeParams = (params: URLSearchParams, view: string | null) => {
    if (view === '市重点' || view === '省重大') {
      params.set('keyProjectType', view);
    } else {
      params.delete('keyProjectType');
    }
  };

  const openProgressDetailAdvance = (params: URLSearchParams) => {
    params.set('newTab', '1');
    const url = `/tutorial/tou-zi-jin-du/progress-detail-adavance?${params.toString()}`;
    window.open(`${window.location.origin}${url}`, '_blank');
  };

  // 市重点、省重大返回全零数据
  const ZERO_INVESTMENT_DATA: InvestmentOverview = {
    underConstruction: { monthIncreasement: 0, yearIncreasement: 0, plannedTotalInvestment: 0 },
    statisticalInvestment: { monthCount: 0, monthAmount: 0, yearCount: 0, yearAmount: 0 },
    investmentCompletion: { monthCompletion: 0, yearCompletion: 0, plannedTotalInvestment: 0, actualTotalInvestment: 0 },
    industrialChainDistribution: {
      industryProjectCount: 0,
      industryProjectPlannedTotalInvestment: 0,
      industrialChainProjectCount: 0,
      industrialChainPlannedTotalInvestment: 0,
    },
  };

  // 加载投资概览数据
  const loadInvestmentOverview = async (view: string, cardIndex: number) => {
    if (view === '市重点' || view === '省重大') {
      const zeroData = ZERO_INVESTMENT_DATA;
      if (cardIndex === 1) setData1(zeroData);
      else if (cardIndex === 2) setData2(zeroData);
      else if (cardIndex === 3) setData3(zeroData);
      else if (cardIndex === 4) setData4(zeroData);
      return;
    }
    // view: 'all' = 全部, '1' = 1亿元, '5' = 5亿元, '10' = 10亿元
    const isMunicipalKey = false;
    const isOverOneBillion = view === '1';
    const isOverTenBillion = view === '10';
    // 单位：万元（all 时不传；10亿元不传 maxAmount）
    const minAmount = view === '1' ? 10000 : view === '5' ? 50000 : view === '10' ? 100000 : undefined;
    const maxAmount = view === '1' ? 50000 : view === '5' ? 100000 : undefined;
    try {
      const response: any = await primeApi.getInvestmentOverview({
        isMunicipalKey,
        isOverOneBillion,
        isOverTenBillion,
        minAmount,
        maxAmount,
      } as any);

      // 根据卡片索引设置对应的数据
      if (cardIndex === 1) {
        setData1(response);
      } else if (cardIndex === 2) {
        setData2(response);
      } else if (cardIndex === 3) {
        setData3(response);
      } else if (cardIndex === 4) {
        setData4(response);
      }
    } catch (error) {
      console.error('获取投资概览数据失败:', error);
      message.error('获取投资概览数据失败');
    }
  };

  // 市重点/省重大 独立切换：再次点击取消
  const handleKeyFilterToggle = (cardIndex: number, keyType: '市重点' | '省重大') => {
    const getters = [() => keyFilter1, () => keyFilter2, () => keyFilter3, () => keyFilter4];
    const setters = [setKeyFilter1, setKeyFilter2, setKeyFilter3, setKeyFilter4];
    const currentViews = [currentView1, currentView2, currentView3, currentView4];
    const current = getters[cardIndex - 1]();
    const setKeyFilter = setters[cardIndex - 1];
    const baseView = currentViews[cardIndex - 1];
    const newFilter = current === keyType ? null : keyType;
    setKeyFilter(newFilter);
    loadInvestmentOverview(newFilter ?? baseView, cardIndex);
  };

  // 处理在建项目视图切换
  const handleViewChange1 = (view: string) => {
    setCurrentView1(view);
    setKeyFilter1(null);
    loadInvestmentOverview(view, 1);
  };

  // 处理入库投资视图切换
  const handleViewChange2 = (view: string) => {
    setCurrentView2(view);
    setKeyFilter2(null);
    loadInvestmentOverview(view, 2);
  };

  // 处理投资完成率视图切换
  const handleViewChange3 = (view: string) => {
    setCurrentView3(view);
    setKeyFilter3(null);
    loadInvestmentOverview(view, 3);
  };

  // 处理链群体系视图切换
  const handleViewChange4 = (view: string) => {
    setCurrentView4(view);
    setKeyFilter4(null);
    loadInvestmentOverview(view, 4);
  };

  // 初始加载所有卡片数据 - 默认为全部
  useEffect(() => {
    loadInvestmentOverview('all', 1);
    loadInvestmentOverview('all', 2);
    loadInvestmentOverview('all', 3);
    loadInvestmentOverview('all', 4);
  }, []);

  const goBackHome = () => {
    navigate(`/tutorial`);
  };

  return (
    <div className={styles.touChanDaXiaoPage}>
      <div className={styles.container}>
        <div className={styles.flexBetWeen}>
          <Button className={styles.backButton} onClick={() => handleBack()} icon={<ArrowLeftOutlined />}>
            返回
          </Button>
          <Button className={styles.backButton} onClick={() => goBackHome()}>
            返回首页
          </Button>
        </div>

        <h1 className={styles.pageTitle}>投资进度</h1>
        <p className={styles.pageSubtitle}>
          跟踪推进项目建设进展、统计入库和投资完成率，加快形成更多有效投资
        </p>

        <div className={styles.stageDashboard}>
          {/* 在建项目 */}
          <div
            className={styles.stageCard}
            data-target="subIndustry"
            onClick={() => navigate('/tutorial/tou-zi-jin-du/progress-detail')}
          >
            <div className={styles.topCon}>
              <div className={styles.leftCon}>
                <div className={styles.stageHeader}>
                  <div
                    className={styles.stageIcon}
                    style={{ background: 'linear-gradient(135deg, #3498db, #2c80ff)' }}
                  >
                    <GlobalOutlined />
                  </div>
                </div>
              </div>
              <div className={styles.rightActions}>
                <Button
                  className={[styles.chartBtn, currentView1 === 'all' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange1('all');
                  }}
                >
                  全部
                </Button>
                <Button
                  className={[styles.chartBtn, currentView1 === '1' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange1('1');
                  }}
                >
                  1亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView1 === '5' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange1('5');
                  }}
                >
                  5亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView1 === '10' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange1('10');
                  }}
                >
                  10亿元
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol1, keyFilter1 === '市重点' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(1, '市重点');
                  }}
                >
                  市重点
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol2, keyFilter1 === '省重大' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(1, '省重大');
                  }}
                >
                  省重大
                </Button>
              </div>
            </div>
            <h3>在建项目</h3>
            <p>当前在建项目基本信息</p>
            <div className={styles.departmentStages}>
              <div
                className={styles.stageTag}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  const params = new URLSearchParams();
                  params.set('from', 'progress');
                  params.set('year', String(TARGET_YEAR));
                  params.set('month', String(TARGET_MONTH));
                  params.set('status', '3'); // 在建
                  applyKeyProjectTypeParams(params, keyFilter1);
                  applyMoneyParams(params, currentView1);
                  openProgressDetailAdvance(params);
                }}
              >
                9月新增
                <br />
                <div className={styles.stageTagNum}>
                  {data1?.underConstruction?.monthIncreasement || 0}个
                </div>
              </div>
              <div
                className={styles.stageTag}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  const params = new URLSearchParams();
                  params.set('from', 'progress');
                  params.set('year', String(TARGET_YEAR));
                  params.set('status', '3'); // 在建
                  // 年累计不传 month
                  applyKeyProjectTypeParams(params, keyFilter1);
                  applyMoneyParams(params, currentView1);
                  openProgressDetailAdvance(params);
                }}
              >
                当年累计新增
                <br />
                <div className={styles.stageTagNum}>
                  {data1?.underConstruction?.yearIncreasement || 0}个
                </div>
              </div>
              <div className={styles.stageTag}>
                计划总投资
                <br />
                <div className={styles.stageTagNum}>
                  {data1?.underConstruction?.plannedTotalInvestment
                    ? (data1.underConstruction.plannedTotalInvestment / 10000).toFixed(0)
                    : 0}亿元
                </div>
              </div>

            </div>
          </div>

          {/* 入库投资 */}
          <div
            className={styles.stageCard}
            data-target="subIndustry"
            onClick={() => navigate('/tutorial/tou-zi-jin-du/progress-detail1')}
          >
            <div className={styles.topCon}>
              <div className={styles.leftCon}>
                <div className={styles.stageHeader}>
                  <div
                    className={styles.stageIcon}
                    style={{ background: 'linear-gradient(135deg, #3498db, #2c80ff)' }}
                  >
                    <GlobalOutlined />
                  </div>
                </div>
              </div>
              <div className={styles.rightActions}>
                <Button
                  className={[styles.chartBtn, currentView2 === 'all' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange2('all');
                  }}
                >
                  全部
                </Button>
                <Button
                  className={[styles.chartBtn, currentView2 === '1' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange2('1');
                  }}
                >
                  1亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView2 === '5' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange2('5');
                  }}
                >
                  5亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView2 === '10' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange2('10');
                  }}
                >
                  10亿元
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol1, keyFilter2 === '市重点' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(2, '市重点');
                  }}
                >
                  市重点
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol2, keyFilter2 === '省重大' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(2, '省重大');
                  }}
                >
                  省重大
                </Button>
              </div>
            </div>
            <h3>入库投资</h3>
            <p>项目入库投资情况</p>
            <div className={styles.departmentStages}>
              <div className={styles.stageTag}>
                9月入库投资
                <br />
                <div className={styles.stageTagNum}>
                  {data2?.statisticalInvestment?.monthAmount
                    ? (data2.statisticalInvestment.monthAmount / 10000).toFixed(0)
                    : 0}亿元
                </div>
              </div>
              <div className={styles.stageTag}>
                当年累计入库投资
                <br />
                <div className={styles.stageTagNum}>
                  {data2?.statisticalInvestment?.yearAmount
                    ? (data2.statisticalInvestment.yearAmount / 10000).toFixed(0)
                    : 0}亿元
                </div>
              </div>
              {/*
                <div
                  className={styles.stageTag}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const params = new URLSearchParams();
                    params.set('from', 'progress1');
                    params.set('year', String(TARGET_YEAR));
                    params.set('month', String(TARGET_MONTH));
                    applyKeyProjectTypeParams(params, keyFilter2);
                    applyMoneyParams(params, currentView2);
                    openProgressDetailAdvance(params);
                  }}
                >
                  9月新增入库
                  <br />
                  <div className={styles.stageTagNum}>
                    {data2?.statisticalInvestment?.monthCount || 0}个
                  </div>
                </div>
                <div
                  className={styles.stageTag}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const params = new URLSearchParams();
                    params.set('from', 'progress1');
                    params.set('year', String(TARGET_YEAR));
                    params.set('month', String(TARGET_MONTH));
                    applyKeyProjectTypeParams(params, keyFilter2);
                    applyMoneyParams(params, currentView2);
                    openProgressDetailAdvance(params);
                  }}
                >
                  当年累计新增入库
                  <br />
                  <div className={styles.stageTagNum}>
                    {data2?.statisticalInvestment?.yearCount || 0}个
                  </div>
                </div>
              */}
            </div>
          </div>

          {/* 投资完成率 */}
          <div
            className={styles.stageCard}
            data-target="subIndustry"
            onClick={() => navigate('/tutorial/tou-zi-jin-du/progress-detail2')}
          >
            <div className={styles.topCon}>
              <div className={styles.leftCon}>
                <div className={styles.stageHeader}>
                  <div
                    className={styles.stageIcon}
                    style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}
                  >
                    <FileTextOutlined />
                  </div>
                </div>
              </div>
              <div className={styles.rightActions}>
                <Button
                  className={[styles.chartBtn, currentView3 === 'all' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange3('all');
                  }}
                >
                  全部
                </Button>
                <Button
                  className={[styles.chartBtn, currentView3 === '1' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange3('1');
                  }}
                >
                  1亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView3 === '5' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange3('5');
                  }}
                >
                  5亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView3 === '10' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange3('10');
                  }}
                >
                  10亿元
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol1, keyFilter3 === '市重点' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(3, '市重点');
                  }}
                >
                  市重点
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol2, keyFilter3 === '省重大' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(3, '省重大');
                  }}
                >
                  省重大
                </Button>
              </div>
            </div>
            <h3>投资完成率</h3>
            <p>竣工项目实际完成投资与计划总投资的比例</p>
            <div className={styles.departmentStages}>
              <div
                className={styles.stageTag}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  const params = new URLSearchParams();
                  params.set('from', 'progress2');
                  params.set('year', String(TARGET_YEAR));
                  params.set('month', String(TARGET_MONTH));
                  params.set('status', '2'); // 竣工
                  applyKeyProjectTypeParams(params, keyFilter3);
                  applyMoneyParams(params, currentView3);
                  openProgressDetailAdvance(params);
                }}
              >
                9月竣工
                <br />
                <div className={styles.stageTagNum}>
                  {data3?.investmentCompletion?.monthCompletion || 0}个
                </div>
              </div>
              <div
                className={styles.stageTag}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  const params = new URLSearchParams();
                  params.set('from', 'progress2');
                  params.set('year', String(TARGET_YEAR));
                  params.set('status', '2'); // 竣工
                  // 年累计不传 month
                  applyKeyProjectTypeParams(params, keyFilter3);
                  applyMoneyParams(params, currentView3);
                  openProgressDetailAdvance(params);
                }}
              >
                当年累计竣工
                <br />
                <div className={styles.stageTagNum}>
                  {data3?.investmentCompletion?.yearCompletion || 0}个
                </div>
              </div>
              <div className={styles.stageTag}>
                计划总投资
                <br />
                <div className={styles.stageTagNum}>
                  {data3?.investmentCompletion?.plannedTotalInvestment
                    ? (data3.investmentCompletion.plannedTotalInvestment / 10000).toFixed(0)
                    : 0}亿元
                </div>
              </div>
              <div className={styles.stageTag}>
                实际完成投资
                <br />
                <div className={styles.stageTagNum}>
                  {data3?.investmentCompletion?.actualTotalInvestment
                    ? (data3.investmentCompletion.actualTotalInvestment / 10000).toFixed(0)
                    : 0}亿元
                </div>
              </div>
            </div>
          </div>

          {/* 链群体系 */}
          <div
            className={styles.stageCard}
            data-target="subIndustry"
            onClick={() => navigate('/tutorial/tou-zi-jin-du/progress-detail3')}
          >
            <div className={styles.topCon}>
              <div className={styles.leftCon}>
                <div className={styles.stageHeader}>
                  <div
                    className={styles.stageIcon}
                    style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}
                  >
                    <FileTextOutlined />
                  </div>
                </div>
              </div>
              <div className={styles.rightActions}>
                <Button
                  className={[styles.chartBtn, currentView4 === 'all' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange4('all');
                  }}
                >
                  全部
                </Button>
                <Button
                  className={[styles.chartBtn, currentView4 === '1' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange4('1');
                  }}
                >
                  1亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView4 === '5' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange4('5');
                  }}
                >
                  5亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView4 === '10' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange4('10');
                  }}
                >
                  10亿元
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol1, keyFilter4 === '市重点' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(4, '市重点');
                  }}
                >
                  市重点
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol2, keyFilter4 === '省重大' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(4, '省重大');
                  }}
                >
                  省重大
                </Button>
              </div>
            </div>
            <h3>链群体系</h3>
            <p>在建项目的重点链群体系分布情况</p>
            <div className={styles.departmentStages}>
              <div
                className={styles.stageTag}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  const params = new URLSearchParams();
                  params.set('from', 'progress3');
                  params.set('status', '3'); // 在建
                  applyKeyProjectTypeParams(params, keyFilter4);
                  applyMoneyParams(params, currentView4);
                  openProgressDetailAdvance(params);
                }}
              >
                工业项目
                <br />
                <div className={styles.stageTagNum}>
                  {data4?.industrialChainDistribution?.industryProjectCount || 0}个
                </div>
              </div>
              <div className={styles.stageTag}>
                计划总投资
                <br />
                <div className={styles.stageTagNum}>
                  {data4?.industrialChainDistribution?.industryProjectPlannedTotalInvestment
                    ? (data4.industrialChainDistribution.industryProjectPlannedTotalInvestment / 10000).toFixed(0)
                    : 0}亿元
                </div>
              </div>
              <div
                className={styles.stageTag}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  const params = new URLSearchParams();
                  params.set('from', 'progress3');
                  params.set('status', '3'); // 在建
                  params.set('industrialChainNotNull', 'true');
                  applyKeyProjectTypeParams(params, keyFilter4);
                  applyMoneyParams(params, currentView4);
                  openProgressDetailAdvance(params);
                }}
              >
                重点链群项目
                <br />
                <div className={styles.stageTagNum}>
                  {data4?.industrialChainDistribution?.industrialChainProjectCount || 0}个
                </div>
              </div>
              <div className={styles.stageTag}>
                计划总投资
                <br />
                <div className={styles.stageTagNum}>
                  {data4?.industrialChainDistribution?.industrialChainPlannedTotalInvestment
                    ? (data4.industrialChainDistribution.industrialChainPlannedTotalInvestment / 10000).toFixed(0)
                    : 0}亿元
                </div>
              </div>
              {/* <div className={styles.stageTag}>
                对规上工业增长的贡献率
                <br /> 0%
              </div> */}
            </div>
          </div>
        </div>

        {/* <div className={styles.footer}>
          <p>企业全生命周期管理服务平台 © 2025 版权所有</p>
        </div> */}
      </div>
    </div>
  );
};

export default TouZiJinDu;
