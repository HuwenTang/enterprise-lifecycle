import { primeApi, systemApi } from '@/services/api';
import { ArrowLeftOutlined, DiffFilled, SafetyCertificateFilled } from '@ant-design/icons';
import { Button, message, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

// 定义项目备案概览接口返回数据的类型
interface FilingOverviewData {
  construction: number; // 施工许可证
  energy: number; // 能评
  environment: number; // 环评
  industry: number; // 工业项目
  keyIndustry: number; // 重点链群项目数
  land: number; // 已取得土地
  map: number; // 施工图审查
  month: number; // 新备案项目本月
  needAddLand: number; // 需新增用地项目
  noNeedAddLand: number; // 无需新增用地项目
  security: number; // 安评
  total: number; // 累计备案总投资
  total2: number; // 工业项目备案总投资
  total3: number; // 链群项目备案总投资
  year: number; // 新备案项目本年
}

const TutorialPage: React.FC = () => {
  const navigate = useNavigate();
  // 为每个卡片定义独立的数据状态
  const [filingData1, setFilingData1] = useState<FilingOverviewData | null>(null);
  const [filingData2, setFilingData2] = useState<FilingOverviewData | null>(null);
  const [filingData3, setFilingData3] = useState<FilingOverviewData | null>(null);
  const [filingData4, setFilingData4] = useState<FilingOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  // 视图状态：'all' | '1' | '5' | '10'
  const [currentView1, setCurrentView1] = React.useState<string>('all');
  const [currentView2, setCurrentView2] = React.useState<string>('all');
  const [currentView3, setCurrentView3] = React.useState<string>('all');
  const [currentView4, setCurrentView4] = React.useState<string>('all');

  // 市重点/省重大 独立切换，与主视图不冲突，再次点击取消
  const [keyFilter1, setKeyFilter1] = React.useState<string | null>(null);
  const [keyFilter2, setKeyFilter2] = React.useState<string | null>(null);
  const [keyFilter3, setKeyFilter3] = React.useState<string | null>(null);
  const [keyFilter4, setKeyFilter4] = React.useState<string | null>(null);

  // 权限相关 state：控制链群分布模块是否显示
  const [showChainDistribution, setShowChainDistribution] = useState<boolean>(false);

  const goBack = () => {
    navigate(`/tutorial`);
  };

  // 查询使用的年份和月份（固定 2025 年 10 月）
  const TARGET_YEAR = 2025;
  const TARGET_MONTH = 10;

  const getCurrentYearAndLastMonth = () => {
    return { year: TARGET_YEAR, month: TARGET_MONTH };
  };

  const formatYmd = (year: number, month: number, day: number) => {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const getEndOfMonthDay = (year: number, month: number) => {
    // month: 1-12
    return new Date(year, month, 0).getDate();
  };

  const applyMoneyParams = (params: URLSearchParams, view: string) => {
    if (view === '1') {
      // 1亿元：1-5亿之间（单位：万元）
      params.set('minAmount', '10000');
      params.set('maxAmount', '50000');
    } else if (view === '5') {
      // 5亿元：5亿-10亿（单位：万元）
      params.set('minAmount', '50000');
      params.set('maxAmount', '100000');
    } else if (view === '10') {
      // 10亿元：10亿以上（只传 minAmount）
      params.set('minAmount', '100000');
      params.delete('maxAmount');
    } else {
      params.delete('minAmount');
      params.delete('maxAmount');
    }
  };

  const applyKeyProjectTypeParams = (params: URLSearchParams, keyFilter: string | null) => {
    if (keyFilter === '市重点' || keyFilter === '省重大') {
      params.set('keyProjectType', keyFilter);
    } else {
      params.delete('keyProjectType');
    }
  };

  const openApproveDetailAdvance2 = (params: URLSearchParams) => {
    params.set('newTab', '1');
    const url = `/tutorial/record-approval/detail/approve-detail-advance2?${params.toString()}`;
    window.open(`${window.location.origin}${url}`, '_blank');
  };

  const openApproveDetailAdvance = (params: URLSearchParams) => {
    params.set('newTab', '1');
    const url = `/tutorial/record-approval/detail/approve-detail-advance?${params.toString()}`;
    window.open(`${window.location.origin}${url}`, '_blank');
  };

  // 市重点、省重大返回全零数据
  const ZERO_FILING_DATA: FilingOverviewData = {
    construction: 0,
    energy: 0,
    environment: 0,
    industry: 0,
    keyIndustry: 0,
    land: 0,
    map: 0,
    month: 0,
    needAddLand: 0,
    noNeedAddLand: 0,
    security: 0,
    total: 0,
    total2: 0,
    total3: 0,
    year: 0,
  };

  // 通用数据获取函数
  const fetchDataByView = async (view: string = 'all') => {
    if (view === '市重点' || view === '省重大') {
      return ZERO_FILING_DATA;
    }
    const { year, month } = getCurrentYearAndLastMonth();

    // 根据 view 确定参数（互斥档位）
    let isOverOneBillion = false;
    let isOverFiveBillion = false;
    let isOverTenBillion = false;

    if (view === '1') {
      isOverOneBillion = true;
    } else if (view === '5') {
      isOverFiveBillion = true;
    } else if (view === '10') {
      isOverTenBillion = true;
    }
    // view === 'all' 时三者均为 false

    const response = await primeApi.getFilingOverview({
      year,
      month,
      isOverOneBillion,
      isOverFiveBillion,
      isOverTenBillion,
    });

    return response;
  };

  // 市重点/省重大 独立切换：再次点击取消
  const handleKeyFilterToggle = async (cardIndex: number, keyType: '市重点' | '省重大') => {
    const getters = [() => keyFilter1, () => keyFilter2, () => keyFilter3, () => keyFilter4];
    const setters = [setKeyFilter1, setKeyFilter2, setKeyFilter3, setKeyFilter4];
    const currentViews = [currentView1, currentView2, currentView3, currentView4];
    const current = getters[cardIndex - 1]();
    const setKeyFilter = setters[cardIndex - 1];
    const baseView = currentViews[cardIndex - 1];
    const newFilter = current === keyType ? null : keyType;
    setKeyFilter(newFilter);
    const effectiveView = newFilter ?? baseView;
    try {
      const data = await fetchDataByView(effectiveView);
      if (cardIndex === 1) setFilingData1(data);
      else if (cardIndex === 2) setFilingData2(data);
      else if (cardIndex === 3) setFilingData3(data);
      else setFilingData4(data);
    } catch (error) {
      console.error('获取数据错误:', error);
      message.error('当月暂无数据');
    }
  };

  // 处理新备案项目视图切换
  const handleViewChange1 = async (view: string) => {
    setCurrentView1(view);
    setKeyFilter1(null);
    try {
      const data = await fetchDataByView(view);
      setFilingData1(data);
    } catch (error) {
      console.error('获取数据错误:', error);
      message.error('当月暂无数据');
    }
  };

  // 处理用地保障视图切换
  const handleViewChange2 = async (view: string) => {
    setCurrentView2(view);
    setKeyFilter2(null);
    try {
      const data = await fetchDataByView(view);
      setFilingData2(data);
    } catch (error) {
      console.error('获取数据错误:', error);
      message.error('当月暂无数据');
    }
  };

  // 处理审批服务视图切换
  const handleViewChange3 = async (view: string) => {
    setCurrentView3(view);
    setKeyFilter3(null);
    try {
      const data = await fetchDataByView(view);
      setFilingData3(data);
    } catch (error) {
      console.error('获取数据错误:', error);
      message.error('当月暂无数据');
    }
  };

  // 处理链群分布视图切换
  const handleViewChange4 = async (view: string) => {
    setCurrentView4(view);
    setKeyFilter4(null);
    try {
      const data = await fetchDataByView(view);
      setFilingData4(data);
    } catch (error) {
      console.error('获取数据错误:', error);
      message.error('当月暂无数据');
    }
  };

  // 获取用户权限 - 查询 level=2 和 level=3
  const fetchUserAreaPermissions = async () => {
    try {
      // 同时查询 level=2 和 level=3
      const [level2Data, level3Data] = await Promise.all([
        systemApi.getActiveAreaGrants({ level: [2] }),
        systemApi.getActiveAreaGrants({ level: [3] })
      ]);

      const level2Areas = level2Data?.areas || [];
      const level3Areas = level3Data?.areas || [];

      // 如果 level=2 或 level=3 的 areas 中有数据，则显示链群分布模块
      if (level2Areas.length > 0 || level3Areas.length > 0) {
        setShowChainDistribution(true);
      } else {
        setShowChainDistribution(false);
      }
    } catch (error) {
      // 权限查询失败时，不显示链群分布模块
      setShowChainDistribution(false);
    }
  };

  // 初始化所有卡片数据
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await fetchDataByView('all');
      setFilingData1(data);
      setFilingData2(data);
      setFilingData3(data);
      setFilingData4(data);
    } catch (error) {
      console.error('获取数据错误:', error);
      message.error('当月暂无数据');
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时调用fetchAllData和权限查询
  useEffect(() => {
    fetchUserAreaPermissions();
    fetchAllData();
  }, []);

  const goBackHome = () => {
    navigate(`/tutorial`);
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <div className={styles.flexBetWeen}>
          <Button className={styles.backBtn} onClick={() => goBack()} icon={<ArrowLeftOutlined />}>
            返回
          </Button>
          <Button className={styles.backBtn} onClick={() => goBackHome()}>
            返回首页
          </Button>
        </div>
        <h1 className={styles.pageTitle}>备案审批</h1>
        <p className={styles.pageSubtitle}>
          跟踪服务项目备案、手续办理和审批进展情况，全力打造一流营商环境
        </p>
        <div className={styles.stageDashboard}>
          {loading ? (
            // 加载状态显示骨架屏
            <div className={styles.loadingSkeleton}>
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          ) : (
            <>
              {/* 新备案项目 */}
              <div
                className={`${styles.stageCard}`}
                onClick={() => navigate('/tutorial/record-approval/detail/approve-datail?year=2025&month=10')}
              >
                <div className={styles.topCon}>
                  <div className={styles.leftCon}>
                    <div className={styles.stageHeader}>
                      <div
                        className={styles.stageIcon}
                        style={{background: 'linear-gradient(135deg, #3498db, #2c80ff)'}}
                      >
                        <SafetyCertificateFilled/>
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
                      className={[styles.chartBtn, styles.chartBtnCol2, keyFilter1 === '市重点' ? styles.active : ''].join(' ')}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKeyFilterToggle(1, '市重点');
                      }}
                    >
                      市重点
                    </Button>
                    <Button
                      className={[styles.chartBtn, styles.chartBtnCol3, keyFilter1 === '省重大' ? styles.active : ''].join(' ')}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKeyFilterToggle(1, '省重大');
                      }}
                    >
                      省重大
                    </Button>
                  </div>
                </div>
                <h3>新备案项目</h3>
                <p>新备案项目基本信息</p>
                <div className={styles.departmentStages}>
                  <div
                    className={styles.stageTag}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const { year, month } = getCurrentYearAndLastMonth();
                      const params = new URLSearchParams();
                      params.set('from', 'approve');
                      params.set('year', String(year));
                      params.set('month', String(month));
                      params.set('start', formatYmd(year, month, 1));
                      params.set('end', formatYmd(year, month, getEndOfMonthDay(year, month)));
                      applyKeyProjectTypeParams(params, keyFilter1);
                      applyMoneyParams(params, currentView1);
                      openApproveDetailAdvance2(params);
                    }}
                  >
                    本月新增
                    <br/>
                    <div className={styles.stageTagNum}>
                      {filingData1?.month || 0}个
                    </div>
                  </div>
                  <div
                    className={styles.stageTag}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const { year, month } = getCurrentYearAndLastMonth();
                      const params = new URLSearchParams();
                      params.set('from', 'approve');
                      params.set('year', String(year));
                      // 年累计：不传 month，按年初到当前月末
                      params.set('start', formatYmd(year, 1, 1));
                      params.set('end', formatYmd(year, month, getEndOfMonthDay(year, month)));
                      applyKeyProjectTypeParams(params, keyFilter1);
                      applyMoneyParams(params, currentView1);
                      openApproveDetailAdvance2(params);
                    }}
                  >
                    本年新增
                    <br/>
                    <div className={styles.stageTagNum}>
                      {filingData1?.year || 0}个
                    </div>
                  </div>
                  <div className={styles.stageTag}>
                    累计备案总投资
                    <br/>
                    <div className={styles.stageTagNum}>
                      {filingData1?.total ? (filingData1.total / 10000).toFixed(2) : '0.00'}亿元
                    </div>
                  </div>
                </div>
              </div>

              {/* 用地保障 */}
              <div
                className={`${styles.stageCard}`}
                onClick={() => navigate('/tutorial/record-approval/detail/land-datail?year=2025&month=10')}
              >
                <div className={styles.topCon}>
                  <div className={styles.leftCon}>
                    <div className={styles.stageHeader}>
                      <div
                        className={styles.stageIcon}
                        style={{background: 'linear-gradient(135deg, #2ecc71, #27ae60)'}}
                      >
                        <DiffFilled/>
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
                      className={[styles.chartBtn, styles.chartBtnCol2, keyFilter2 === '市重点' ? styles.active : ''].join(' ')}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKeyFilterToggle(2, '市重点');
                      }}
                    >
                      市重点
                    </Button>
                    <Button
                      className={[styles.chartBtn, styles.chartBtnCol3, keyFilter2 === '省重大' ? styles.active : ''].join(' ')}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKeyFilterToggle(2, '省重大');
                      }}
                    >
                      省重大
                    </Button>
                  </div>
                </div>
                <h3>用地保障</h3>
                <p>备案项目用地需求及供给情况</p>
                <div className={styles.departmentStages}>
                  <div
                    className={styles.stageTag}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const { year, month } = getCurrentYearAndLastMonth();
                      const params = new URLSearchParams();
                      params.set('from', 'land');
                      params.set('year', String(year));
                      // 用地保障下钻：按年初到当前月末（参考接口示例）
                      params.set('start', formatYmd(year, 1, 1));
                      params.set('end', formatYmd(year, month, getEndOfMonthDay(year, month)));
                      params.set('isAddLand', 'true');
                      applyKeyProjectTypeParams(params, keyFilter2);
                      applyMoneyParams(params, currentView2);
                      openApproveDetailAdvance2(params);
                    }}
                  >
                    需新增用地项目
                    <br/>
                    <div className={styles.stageTagNum}>
                      {filingData2?.needAddLand || 0}个
                    </div>
                  </div>
                  <div
                    className={styles.stageTag}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const { year, month } = getCurrentYearAndLastMonth();
                      const params = new URLSearchParams();
                      params.set('from', 'land');
                      params.set('year', String(year));
                      // 用地保障下钻：按年初到当前月末（参考接口示例）
                      params.set('start', formatYmd(year, 1, 1));
                      params.set('end', formatYmd(year, month, getEndOfMonthDay(year, month)));
                      params.set('isLand', 'true');
                      applyKeyProjectTypeParams(params, keyFilter2);
                      applyMoneyParams(params, currentView2);
                      openApproveDetailAdvance2(params);
                    }}
                  >
                    已取得土地
                    <br/>
                    <div className={styles.stageTagNum}>
                      {filingData2?.land || 0}个
                    </div>
                  </div>
                  <div
                    className={styles.stageTag}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const { year, month } = getCurrentYearAndLastMonth();
                      const params = new URLSearchParams();
                      params.set('from', 'land');
                      params.set('year', String(year));
                      // 用地保障下钻：按年初到当前月末（参考接口示例）
                      params.set('start', formatYmd(year, 1, 1));
                      params.set('end', formatYmd(year, month, getEndOfMonthDay(year, month)));
                      params.set('isAddLand', 'false');
                      applyKeyProjectTypeParams(params, keyFilter2);
                      applyMoneyParams(params, currentView2);
                      openApproveDetailAdvance2(params);
                    }}
                  >
                    无需新增用地项目
                    <br/>
                    <div className={styles.stageTagNum}>
                      {filingData2?.noNeedAddLand || 0}个
                    </div>
                  </div>
                </div>
              </div>

              {/* 审批服务 */}
              <div
                className={`${styles.stageCard}`}
                onClick={() => navigate('/tutorial/record-approval/detail/audit-datail?year=2025&month=10')}
              >
                <div className={styles.topCon}>
                  <div className={styles.leftCon}>
                    <div className={styles.stageHeader}>
                      <div
                        className={styles.stageIcon}
                        style={{background: 'linear-gradient(135deg, #3498db, #2c80ff)'}}
                      >
                        <SafetyCertificateFilled/>
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
                      className={[styles.chartBtn, styles.chartBtnCol2, keyFilter3 === '市重点' ? styles.active : ''].join(' ')}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKeyFilterToggle(3, '市重点');
                      }}
                    >
                      市重点
                    </Button>
                    <Button
                      className={[styles.chartBtn, styles.chartBtnCol3, keyFilter3 === '省重大' ? styles.active : ''].join(' ')}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKeyFilterToggle(3, '省重大');
                      }}
                    >
                      省重大
                    </Button>
                  </div>
                </div>
                <h3>审批服务</h3>
                <p>备案项目前期工作情况</p>
                <div className={styles.departmentStages}>
                  <div
                    className={styles.stageTag}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const { year, month } = getCurrentYearAndLastMonth();
                      const params = new URLSearchParams();
                      params.set('from', 'audit');
                      params.set('year', String(year));
                      // 审批服务下钻：固定按年初到当前月末（2025-01-01 ~ 2025-10-31）
                      params.set('start', formatYmd(year, 1, 1));
                      params.set('end', formatYmd(year, month, getEndOfMonthDay(year, month)));
                      params.set('isEnvironment', 'true');
                      applyKeyProjectTypeParams(params, keyFilter3);
                      applyMoneyParams(params, currentView3);
                      openApproveDetailAdvance(params);
                    }}
                  >
                    环评已完成
                    <br/>
                    <div className={styles.stageTagNum}>
                      {filingData3?.environment || 0}个
                    </div>
                  </div>
                  <div
                    className={styles.stageTag}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const { year, month } = getCurrentYearAndLastMonth();
                      const params = new URLSearchParams();
                      params.set('from', 'audit');
                      params.set('year', String(year));
                      // 审批服务下钻：固定按年初到当前月末（2025-01-01 ~ 2025-10-31）
                      params.set('start', formatYmd(year, 1, 1));
                      params.set('end', formatYmd(year, month, getEndOfMonthDay(year, month)));
                      params.set('isEnergy', 'true');
                      applyKeyProjectTypeParams(params, keyFilter3);
                      applyMoneyParams(params, currentView3);
                      openApproveDetailAdvance(params);
                    }}
                  >
                    能评已完成
                    <br/>
                    <div className={styles.stageTagNum}>
                      {filingData3?.energy || 0}个
                    </div>
                  </div>
                  <div
                    className={styles.stageTag}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const { year, month } = getCurrentYearAndLastMonth();
                      const params = new URLSearchParams();
                      params.set('from', 'audit');
                      params.set('year', String(year));
                      // 审批服务下钻：固定按年初到当前月末（2025-01-01 ~ 2025-10-31）
                      params.set('start', formatYmd(year, 1, 1));
                      params.set('end', formatYmd(year, month, getEndOfMonthDay(year, month)));
                      params.set('isSecurity', 'true');
                      applyKeyProjectTypeParams(params, keyFilter3);
                      applyMoneyParams(params, currentView3);
                      openApproveDetailAdvance(params);
                    }}
                  >
                    安评已完成
                    <br/>
                    <div className={styles.stageTagNum}>
                      {filingData3?.security || 0}个
                    </div>
                  </div>
                  <div
                    className={styles.stageTag}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const { year, month } = getCurrentYearAndLastMonth();
                      const params = new URLSearchParams();
                      params.set('from', 'audit');
                      params.set('year', String(year));
                      // 审批服务下钻：固定按年初到当前月末（2025-01-01 ~ 2025-10-31）
                      params.set('start', formatYmd(year, 1, 1));
                      params.set('end', formatYmd(year, month, getEndOfMonthDay(year, month)));
                      params.set('isMap', 'true');
                      applyKeyProjectTypeParams(params, keyFilter3);
                      applyMoneyParams(params, currentView3);
                      openApproveDetailAdvance(params);
                    }}
                  >
                    施工图审完成
                    <br/>
                    <div className={styles.stageTagNum}>
                      {filingData3?.map || 0}个
                    </div>
                  </div>
                  <div
                    className={styles.stageTag}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const { year, month } = getCurrentYearAndLastMonth();
                      const params = new URLSearchParams();
                      params.set('from', 'audit');
                      params.set('year', String(year));
                      // 审批服务下钻：固定按年初到当前月末（2025-01-01 ~ 2025-10-31）
                      params.set('start', formatYmd(year, 1, 1));
                      params.set('end', formatYmd(year, month, getEndOfMonthDay(year, month)));
                      params.set('isConstruction', 'true');
                      applyKeyProjectTypeParams(params, keyFilter3);
                      applyMoneyParams(params, currentView3);
                      openApproveDetailAdvance(params);
                    }}
                  >
                    施工许可完成
                    <br/>
                    <div className={styles.stageTagNum}>
                      {filingData3?.construction || 0}个
                    </div>
                  </div>
                </div>
              </div>

              {/* 链群分布 - 根据权限控制显示 */}
              {showChainDistribution && (
                <div
                  className={`${styles.stageCard}`}
                  onClick={() => navigate('/tutorial/record-approval/detail/chain-datail?year=2025&month=10')}
                >
                  <div className={styles.topCon}>
                    <div className={styles.leftCon}>
                      <div className={styles.stageHeader}>
                        <div
                          className={styles.stageIcon}
                          style={{background: 'linear-gradient(135deg, #2ecc71, #27ae60)'}}
                        >
                          <DiffFilled/>
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
                        className={[styles.chartBtn, styles.chartBtnCol2, keyFilter4 === '市重点' ? styles.active : ''].join(' ')}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleKeyFilterToggle(4, '市重点');
                        }}
                      >
                        市重点
                      </Button>
                      <Button
                        className={[styles.chartBtn, styles.chartBtnCol3, keyFilter4 === '省重大' ? styles.active : ''].join(' ')}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleKeyFilterToggle(4, '省重大');
                        }}
                      >
                        省重大
                      </Button>
                    </div>
                  </div>
                  <h3>链群分布</h3>
                  <p>新备案项目情况</p>
                  <div className={styles.departmentStages}>
                    <div
                      className={styles.stageTag}
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const { year, month } = getCurrentYearAndLastMonth();
                        const params = new URLSearchParams();
                        params.set('from', 'chain');
                        params.set('year', String(year));
                        // 链群分布下钻：固定按年初到当前月末（2025-01-01 ~ 2025-10-31）
                        params.set('start', formatYmd(year, 1, 1));
                        params.set('end', formatYmd(year, month, getEndOfMonthDay(year, month)));
                        // 工业项目：需额外传 projectType=1
                        params.set('projectType', '1');
                        applyKeyProjectTypeParams(params, keyFilter4);
                        applyMoneyParams(params, currentView4);
                        openApproveDetailAdvance2(params);
                      }}
                    >
                      工业项目
                      <br/>
                      <div className={styles.stageTagNum}>
                        {filingData4?.industry || 0}个
                      </div>
                    </div>
                    <div className={styles.stageTag}>
                      备案总投资
                      <br/>
                      <div className={styles.stageTagNum}>
                        {filingData4?.total2 ? (filingData4.total2 / 10000).toFixed(2) : '0.00'}亿元
                      </div>
                    </div>
                    <div
                      className={styles.stageTag}
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const { year, month } = getCurrentYearAndLastMonth();
                        const params = new URLSearchParams();
                        params.set('from', 'chain');
                        params.set('year', String(year));
                        // 链群分布下钻：固定按年初到当前月末（2025-01-01 ~ 2025-10-31）
                        params.set('start', formatYmd(year, 1, 1));
                        params.set('end', formatYmd(year, month, getEndOfMonthDay(year, month)));
                        params.set('isALLCluster', 'true');
                        applyKeyProjectTypeParams(params, keyFilter4);
                        applyMoneyParams(params, currentView4);
                        openApproveDetailAdvance2(params);
                      }}
                    >
                      重点链群项目
                      <br/>
                      <div className={styles.stageTagNum}>
                        {filingData4?.keyIndustry || 0}个
                      </div>
                    </div>
                    <div className={styles.stageTag}>
                      备案总投资
                      <br/>
                      <div className={styles.stageTagNum}>
                        {filingData4?.total3 ? (filingData4.total3 / 10000).toFixed(2) : '0.00'}亿元
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;
