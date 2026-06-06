import { primeApi } from '@/services/api';
import { ArrowLeftOutlined, FundFilled } from '@ant-design/icons';
import { Button, message } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

// 当年当月：用于数据查询的结束时间（当前月月末）
const getCurrentYearMonthEnd = () => dayjs().endOf('month');

const PreInvestment: React.FC = () => {
  const navigate = useNavigate();

  const [month, setMonth] = useState(dayjs().month() + 1);

  interface ProjectData1 {
    district: string;
    districtCode: string;
    monthNum: string; // 月新增
    projNums: string; // 累计新增
    nzProjNum: string; // 内资数目
    wzProjNum: string; // 外资项目
  }

  const [count11, setCount11] = useState(0);
  const [count12, setCount12] = useState(0);
  const [count13, setCount13] = useState(0);
  const [count14, setCount14] = useState(0);
  const [, setDataSource1] = useState<ProjectData1[]>([]);

  interface ProjectData2 {
    name: string;
    monthNum: string; // 月新增
    total: string; // 累计新增
    monthQyje: string; // 月新增
    totalQyje: string; // 累计新增
  }
  const [count21, setCount21] = useState(0);
  const [count22, setCount22] = useState(0);
  const [count23, setCount23] = useState(0);
  const [count24, setCount24] = useState(0);
  const [, setDataSource2] = useState<ProjectData2[]>([]);

  // interface ProjectData3 {
  //   newEnterpriseCountCurrent: any; // 新设企业数
  //   contractedForeignCapitalAmount: any; // 合同外资金额
  //   actuallyUtilizedForeignCapitalAmount: any; // 实际使用外资金额
  // }
  const [count31, setCount31] = useState(0);
  const [count32, setCount32] = useState(0);
  const [count33, setCount33] = useState(0);
  const [, setDataSource3] = useState<any[]>([]);

  interface ProjectData4 {
    district: string;
    newNum: string; // 新签约项目
    registerNum: string; // 注册
    fillNum: string; // 备案
    completeApprovaNum: string; // 完成报批
    startNum: string; // 开工
  }
  const [count41, setCount41] = useState(0);
  const [count42, setCount42] = useState(0);
  const [count43, setCount43] = useState(0);
  const [, setDataSource4] = useState<ProjectData4[]>([]);

  const goBack = () => {
    navigate(`/tutorial`);
  };

  const goBackHome = () => {
    navigate(`/tutorial`);
  };

  const [currentView1, setCurrentView1] = useState<string>('all');
  const [currentView2, setCurrentView2] = useState<string>('all');
  const [currentView3, setCurrentView3] = useState<string>('all');

  // 市重点/省重大 独立切换，与主视图不冲突，再次点击取消
  const [keyFilter1, setKeyFilter1] = useState<string | null>(null);
  const [keyFilter2, setKeyFilter2] = useState<string | null>(null);
  const [keyFilter3, setKeyFilter3] = useState<string | null>(null);

  const sumArray = (arr: any) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum;
  };

  /** 卡片跳转子页：金额档位 + 市重点/省重大 与当前选择一致 */
  const buildPreInvestmentSubPagePath = (
    basePath: string,
    investmentView: string,
    keyFilter: string | null,
  ) => {
    const q = new URLSearchParams();
    if (investmentView !== 'all') {
      q.set('money', investmentView);
    }
    if (keyFilter === '市重点' || keyFilter === '省重大') {
      q.set('keyProjectType', keyFilter);
    }
    const qs = q.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const handleDepartmentClick = (department: string) => {
    switch (department) {
      case '新签约项目':
        navigate(
          buildPreInvestmentSubPagePath(
            '/tutorial/preinvestment/over-million-projects',
            currentView1,
            keyFilter1,
          ),
        );
        break;
      case '重点产业链项目':
        navigate(
          buildPreInvestmentSubPagePath(
            '/tutorial/preinvestment/fourfold',
            currentView2,
            keyFilter2,
          ),
        );
        break;
      case '利用外资':
        navigate('/tutorial/preinvestment/foreign-investment');
        break;
      case '项目进度情况':
        navigate(
          buildPreInvestmentSubPagePath(
            '/tutorial/preinvestment/project-progress',
            currentView3,
            keyFilter3,
          ),
        );
        break;
      default:
        break;
    }
  };

  /** 跳转 /tutorial/project-manage：时间与 OverMillionProjects、ProjectProgress handleToList 一致 */
  const openTutorialProjectManageFromPreInvestment = (
    e: React.MouseEvent,
    opts: {
      range: 'currentMonth' | 'yearToCurrentMonth';
      investmentView: string;
      /** 同 ProjectProgress handleToList：1 新签约汇总 2 未开工 3 已开工 */
      progressListType?: 1 | 2 | 3;
      fromPage?: string;
      keyProjectFilter?: string | null;
      /** 与 OverMillionProjects handleToList type 3/4 一致：内资 / 外资 */
      projectRating?: '内资' | '外资';
      /** 重点产业链项目：列表页筛选产业链项目 */
      isIndustryChainProject?: boolean;
    },
  ) => {
    e.stopPropagation();
    const endRef = getCurrentYearMonthEnd();
    const query = new URLSearchParams({
      showAll: 'true',
      page: '1',
      pageSize: '10',
      currEndDate: endRef.format('YYYY-MM-DD'),
      currDate: endRef.startOf('month').format('YYYY-MM-DD'),
      fromPage: opts.fromPage ?? '/tutorial/preinvestment',
      isKcProj: '',
    });
    query.set(
      'currStartDate',
      opts.range === 'currentMonth'
        ? endRef.startOf('month').format('YYYY-MM-DD')
        : endRef.startOf('year').format('YYYY-MM-DD'),
    );
    if (opts.investmentView !== 'all') {
      query.set('investmentAmount', opts.investmentView);
    }
    if (opts.keyProjectFilter === '市重点' || opts.keyProjectFilter === '省重大') {
      query.set('keyProjectType', opts.keyProjectFilter);
      // 数据看板接口 /project-digital-investment-attracting/data-dashboard 需要该参数
      query.set('isCityKey', opts.keyProjectFilter);
    }
    if (opts.projectRating === '内资' || opts.projectRating === '外资') {
      query.set('projectRating', opts.projectRating);
    }
    if (opts.progressListType === 2) {
      query.set('rProgress', '0,1,5,4');
    } else if (opts.progressListType === 3) {
      query.set('rProgress', '2,3');
    }
    if (opts.isIndustryChainProject) {
      query.set('isIndustryChainProject', 'true');
    }
    window.open(`/tutorial/project-manage?${query.toString()}`, '_blank');
  };

  /** 新签约卡片跳转项目管理：无 projectRating；含内/外资时与 OverMillionProjects 累计列一致 */
  const navigateToProjectManageBySignedRange = (
    e: React.MouseEvent,
    range: 'currentMonth' | 'yearToCurrentMonth',
    projectRating?: '内资' | '外资',
  ) => {
    openTutorialProjectManageFromPreInvestment(e, {
      range,
      investmentView: currentView1,
      keyProjectFilter: keyFilter1,
      ...(projectRating ? { projectRating } : {}),
    });
  };

  const loadData1 = async (money: string, keyFilter?: string | null) => {
    try {
      const endTime = getCurrentYearMonthEnd();
      setMonth(endTime.month() + 1);
      const isMainProj =
        keyFilter === '市重点' || keyFilter === '省重大' ? keyFilter : undefined;
      const res = await primeApi.statisticsSignedProjectInfo({
        rmb: money === 'all' ? undefined : Number(money),
        currStartDate: endTime.startOf('year').format('YYYY-MM-DD'),
        currEndDate: endTime.format('YYYY-MM-DD'),
        currDate: endTime.startOf('month').format('YYYY-MM-DD'),
        ...(isMainProj ? { isMainProj } : {}),
      });

      const tableData = (res ? res : []) as unknown as ProjectData1[];
      setDataSource1(tableData);
      const arr1 = tableData.map((item: any) => Number(item.monthNum));
      setCount11(sumArray(arr1));
      const arr2 = tableData.map((item: any) => Number(item.projNums));
      setCount12(sumArray(arr2));
      const arr3 = tableData.map((item: any) => Number(item.nzProjNum));
      setCount13(sumArray(arr3));
      const arr4 = tableData.map((item: any) => Number(item.wzProjNum));
      setCount14(sumArray(arr4));
    } catch (e: any) {
      message.error(e?.message || '新签约项目数据加载失败，请稍后重试');
      setDataSource1([]);
      setCount11(0);
      setCount12(0);
      setCount13(0);
      setCount14(0);
    }
  };

  const loadData2 = async (money: string, keyFilter?: string | null) => {
    try {
      const endTime = getCurrentYearMonthEnd();
      const isMainProj =
        keyFilter === '市重点' || keyFilter === '省重大' ? keyFilter : undefined;
      const res = await primeApi.countSignedProjTypeByLevel({
        rmb: money === 'all' ? undefined : Number(money),
        currStartDate: endTime.startOf('year').format('YYYY-MM-DD'),
        currEndDate: endTime.format('YYYY-MM-DD'),
        currDate: endTime.startOf('month').format('YYYY-MM-DD'),
        level: 3,
        ...(isMainProj ? { isMainProj } : {}),
      });
      const tableData = (res ? res : []) as unknown as ProjectData2[];
      setDataSource2(tableData);

      const arr1 = tableData.map((item: any) => Number(item.monthNum));
      setCount21(sumArray(arr1));
      const arr2 = tableData.map((item: any) => Number(item.total));
      setCount22(sumArray(arr2));
      const arr3 = tableData.map((item: any) => Number(item.monthQyje));
      setCount23(sumArray(arr3));
      const arr4 = tableData.map((item: any) => Number(item.totalQyje));
      setCount24(sumArray(arr4));
    } catch (e: any) {
      message.error(e?.message || '重点产业链项目数据加载失败，请稍后重试');
      setDataSource2([]);
      setCount21(0);
      setCount22(0);
      setCount23(0);
      setCount24(0);
    }
  };

  const loadData3 = async () => {
    try {
      const res = await primeApi.getForeignCapitalUtilization({ year: 2025, month: 12 });
      setDataSource3(res ? [res] : []);
      setCount31(Number(res?.newEnterpriseCountCurrent) ?? 0);
      setCount32(Number((Number(res?.contractedForeignCapitalAmount ?? 0) / 10000).toFixed(2)) ?? 0);
      setCount33(Number((Number(res?.actuallyUtilizedForeignCapitalAmount ?? 0) / 10000).toFixed(2)) ?? 0);
    } catch (e: any) {
      message.error(e?.message || '利用外资数据加载失败，请稍后重试');
      setDataSource3([]);
      setCount31(0);
      setCount32(0);
      setCount33(0);
    }
  };

  const loadData4 = async (money: string, keyFilter?: string | null) => {
    try {
      const endTime = getCurrentYearMonthEnd();
      const isMainProj =
        keyFilter === '市重点' || keyFilter === '省重大' ? keyFilter : undefined;
      const res = await primeApi.statisticsProjectStatusInfo({
        rmb: money === 'all' ? undefined : Number(money),
        currStartDate: endTime.startOf('year').format('YYYY-MM-DD'),
        currEndDate: endTime.format('YYYY-MM-DD'),
        ...(isMainProj ? { isMainProj } : {}),
      });

      const tableData = (res ? res : []) as unknown as ProjectData4[];
      setDataSource4(tableData);

      const arr1 = tableData.map((item: any) => Number(item.projNums));
      setCount41(sumArray(arr1));
      const arr2 = tableData.map((item: any) => Number(item.zcProjNum));
      setCount42(sumArray(arr2));
      const arr3 = tableData.map((item: any) => Number(item.baProjNum));
      setCount43(sumArray(arr3));
    } catch (e: any) {
      message.error(e?.message || '项目进度情况数据加载失败，请稍后重试');
      setDataSource4([]);
      setCount41(0);
      setCount42(0);
      setCount43(0);
    }
  };

  // 市重点/省重大 独立切换：再次点击取消（与新签约一致，接口附带 isMainProj）
  const handleKeyFilterToggle = (cardIndex: number, keyType: '市重点' | '省重大') => {
    const getters = [() => keyFilter1, () => keyFilter2, () => keyFilter3];
    const setters = [setKeyFilter1, setKeyFilter2, setKeyFilter3];
    const currentViews = [currentView1, currentView2, currentView3];
    const current = getters[cardIndex - 1]();
    const setKeyFilter = setters[cardIndex - 1];
    const baseView = currentViews[cardIndex - 1];
    const newFilter = current === keyType ? null : keyType;
    setKeyFilter(newFilter);
    if (cardIndex === 1) {
      loadData1(baseView, newFilter);
    } else if (cardIndex === 2) {
      loadData2(baseView, newFilter);
    } else if (cardIndex === 3) {
      loadData4(baseView, newFilter);
    }
  };

  // 处理视图切换（保留当前市重点/省重大选择）
  const handleViewChange1 = (view: string) => {
    setCurrentView1(view);
    loadData1(view, keyFilter1);
  };

  const handleViewChange2 = (view: string) => {
    setCurrentView2(view);
    loadData2(view, keyFilter2);
  };

  const handleViewChange3 = (view: string) => {
    setCurrentView3(view);
    loadData4(view, keyFilter3);
  };

  useEffect(() => {
    loadData1('all');
    loadData2('all');
    loadData3();
    loadData4('all');
  }, []);

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
        <h1 className={styles.pageTitle}>前期招商</h1>
        <p className={styles.pageSubtitle}>负责企业招商引资、项目洽谈和签约管理</p>

        <div className={styles.stageDashboard}>
          <div
            className={`${styles.stageCard}`}
            onClick={() => handleDepartmentClick('新签约项目')}
          >
            <div className={styles.topCon}>
              <div className={styles.leftCon}>
                <div className={styles.stageHeader}>
                  <div
                    className={styles.stageIcon}
                    style={{ background: 'linear-gradient(135deg, #3498db, #2c80ff)' }}
                  >
                    <FundFilled />
                  </div>
                </div>
              </div>
              <div className={styles.rightActions}>
                <Button
                  className={[styles.chartBtn, currentView1 === 'all' ? styles.active : ''].join(
                    ' ',
                  )}
                  data-view="all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange1('all');
                  }}
                >
                  全部
                </Button>
                <Button
                  className={[styles.chartBtn, currentView1 === '1' ? styles.active : ''].join(' ')}
                  data-view="1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange1('1');
                  }}
                >
                  1亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView1 === '5' ? styles.active : ''].join(' ')}
                  data-view="5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange1('5');
                  }}
                >
                  5亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView1 === '10' ? styles.active : ''].join(
                    ' ',
                  )}
                  data-view="10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange1('10');
                  }}
                >
                  10亿元
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol3, keyFilter1 === '市重点' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(1, '市重点');
                  }}
                >
                  市重点
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol4, keyFilter1 === '省重大' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(1, '省重大');
                  }}
                >
                  省重大
                </Button>
              </div>
            </div>
            <h3>新签约项目</h3>
            <p>新签约项目情况</p>
            <div className={styles.departmentStages}>
              <div
                className={`${styles.stageTag} ${styles.stageTagClickable}`}
                onClick={(e) => navigateToProjectManageBySignedRange(e, 'currentMonth')}
              >
                {month}月新增数量
                <br />
                <div className={styles.stageTagNum}>{count11}个</div>
              </div>
              <div
                className={`${styles.stageTag} ${styles.stageTagClickable}`}
                onClick={(e) => navigateToProjectManageBySignedRange(e, 'yearToCurrentMonth')}
              >
                累计新增数量
                <br />
                <div className={styles.stageTagNum}>{count12}个</div>
              </div>
              <div
                className={`${styles.stageTag} ${styles.stageTagClickable}`}
                onClick={(e) => navigateToProjectManageBySignedRange(e, 'yearToCurrentMonth', '内资')}
              >
                累计新增内资
                <br />
                <div className={styles.stageTagNum}>{count13}个</div>
              </div>
              <div
                className={`${styles.stageTag} ${styles.stageTagClickable}`}
                onClick={(e) => navigateToProjectManageBySignedRange(e, 'yearToCurrentMonth', '外资')}
              >
                累计新增外资
                <br />
                <div className={styles.stageTagNum}>{count14}个</div>
              </div>
            </div>
          </div>

          <div
            className={`${styles.stageCard}`}
            onClick={() => handleDepartmentClick('重点产业链项目')}
          >
            <div className={styles.topCon}>
              <div className={styles.leftCon}>
                <div className={styles.stageHeader}>
                  <div
                    className={styles.stageIcon}
                    style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}
                  >
                    <FundFilled />
                  </div>
                </div>
              </div>
              <div className={styles.rightActions}>
                <Button
                  className={[styles.chartBtn, currentView2 === 'all' ? styles.active : ''].join(
                    ' ',
                  )}
                  data-view="all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange2('all');
                  }}
                >
                  全部
                </Button>
                <Button
                  className={[styles.chartBtn, currentView2 === '1' ? styles.active : ''].join(' ')}
                  data-view="1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange2('1');
                  }}
                >
                  1亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView2 === '5' ? styles.active : ''].join(' ')}
                  data-view="5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange2('5');
                  }}
                >
                  5亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView2 === '10' ? styles.active : ''].join(
                    ' ',
                  )}
                  data-view="10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange2('10');
                  }}
                >
                  10亿元
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol3, keyFilter2 === '市重点' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(2, '市重点');
                  }}
                >
                  市重点
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol4, keyFilter2 === '省重大' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(2, '省重大');
                  }}
                >
                  省重大
                </Button>
              </div>
            </div>
            <h3>重点产业链项目</h3>
            <p>产业链项目招引情况</p>
            <div className={styles.departmentStages}>
              <div
                className={`${styles.stageTag} ${styles.stageTagClickable}`}
                onClick={(e) =>
                  openTutorialProjectManageFromPreInvestment(e, {
                    range: 'currentMonth',
                    investmentView: currentView2,
                    fromPage: '/tutorial/preinvestment/fourfold',
                    keyProjectFilter: keyFilter2,
                    isIndustryChainProject: true,
                  })
                }
              >
                {month}月新增数量
                <br />
                <div className={styles.stageTagNum}>{count21}个</div>
              </div>
              <div
                className={`${styles.stageTag} ${styles.stageTagClickable}`}
                onClick={(e) =>
                  openTutorialProjectManageFromPreInvestment(e, {
                    range: 'yearToCurrentMonth',
                    investmentView: currentView2,
                    fromPage: '/tutorial/preinvestment/fourfold',
                    keyProjectFilter: keyFilter2,
                    isIndustryChainProject: true,
                  })
                }
              >
                累计新增数量
                <br />
                <div className={styles.stageTagNum}>{count22}个</div>
              </div>
              <div
                className={`${styles.stageTag} ${styles.stageTagClickable}`}
                onClick={(e) =>
                  openTutorialProjectManageFromPreInvestment(e, {
                    range: 'currentMonth',
                    investmentView: currentView2,
                    fromPage: '/tutorial/preinvestment/fourfold',
                    keyProjectFilter: keyFilter2,
                    isIndustryChainProject: true,
                  })
                }
              >
                {month}月新增投资额
                <br />
                <div className={styles.stageTagNum}>{count23.toFixed(2)}亿元</div>
              </div>
              <div
                className={`${styles.stageTag} ${styles.stageTagClickable}`}
                onClick={(e) =>
                  openTutorialProjectManageFromPreInvestment(e, {
                    range: 'yearToCurrentMonth',
                    investmentView: currentView2,
                    fromPage: '/tutorial/preinvestment/fourfold',
                    keyProjectFilter: keyFilter2,
                    isIndustryChainProject: true,
                  })
                }
              >
                累计新增投资额
                <br />
                <div className={styles.stageTagNum}>{count24.toFixed(2)}亿元</div>
              </div>
            </div>
          </div>

          <div className={`${styles.stageCard}`} onClick={() => handleDepartmentClick('利用外资')}>
            <div className={styles.stageHeader}>
              <div
                className={styles.stageIcon}
                style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}
              >
                <FundFilled />
              </div>
            </div>
            <h3>利用外资</h3>
            <p>2025年12月泰州市利用外资情况</p>
            <div className={styles.departmentStages}>
              <div className={styles.stageTag}>
                新设企业数
                <br />
                <div className={styles.stageTagNum}>{count31}个</div>
              </div>
              <div className={styles.stageTag}>
                合同外资金额
                <br />
                <div className={styles.stageTagNum}>{count32}亿美元</div>
              </div>
              <div className={styles.stageTag}>
                实际使用外资金额
                <br />
                <div className={styles.stageTagNum}>{count33}亿美元</div>
              </div>
            </div>
          </div>

          <div
            className={`${styles.stageCard}`}
            onClick={() => handleDepartmentClick('项目进度情况')}
          >
            <div className={styles.topCon}>
              <div className={styles.leftCon}>
                <div className={styles.stageHeader}>
                  <div
                    className={styles.stageIcon}
                    style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}
                  >
                    <FundFilled />
                  </div>
                </div>
              </div>
              <div className={styles.rightActions}>
                <Button
                  className={[styles.chartBtn, currentView3 === 'all' ? styles.active : ''].join(
                    ' ',
                  )}
                  data-view="all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange3('all');
                  }}
                >
                  全部
                </Button>
                <Button
                  className={[styles.chartBtn, currentView3 === '1' ? styles.active : ''].join(' ')}
                  data-view="1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange3('1');
                  }}
                >
                  1亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView3 === '5' ? styles.active : ''].join(' ')}
                  data-view="5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange3('5');
                  }}
                >
                  5亿元
                </Button>
                <Button
                  className={[styles.chartBtn, currentView3 === '10' ? styles.active : ''].join(
                    ' ',
                  )}
                  data-view="10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange3('10');
                  }}
                >
                  10亿元
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol3, keyFilter3 === '市重点' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(3, '市重点');
                  }}
                >
                  市重点
                </Button>
                <Button
                  className={[styles.chartBtn, styles.chartBtnCol4, keyFilter3 === '省重大' ? styles.active : ''].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyFilterToggle(3, '省重大');
                  }}
                >
                  省重大
                </Button>
              </div>
            </div>
            <h3>项目进度情况</h3>
            <p>全市新签约项目进度情况</p>
            <div className={styles.departmentStages}>
              <div
                className={`${styles.stageTag} ${styles.stageTagClickable}`}
                onClick={(e) =>
                  openTutorialProjectManageFromPreInvestment(e, {
                    range: 'yearToCurrentMonth',
                    investmentView: currentView3,
                    progressListType: 1,
                    fromPage: '/tutorial/preinvestment/project-progress',
                    keyProjectFilter: keyFilter3,
                  })
                }
              >
                新签约项目数
                <br />
                <div className={styles.stageTagNum}>{count41}个</div>
              </div>
              <div
                className={`${styles.stageTag} ${styles.stageTagClickable}`}
                onClick={(e) =>
                  openTutorialProjectManageFromPreInvestment(e, {
                    range: 'yearToCurrentMonth',
                    investmentView: currentView3,
                    progressListType: 2,
                    fromPage: '/tutorial/preinvestment/project-progress',
                    keyProjectFilter: keyFilter3,
                  })
                }
              >
                未开工项目数
                <br />
                <div className={styles.stageTagNum}>{count42}个</div>
              </div>
              <div
                className={`${styles.stageTag} ${styles.stageTagClickable}`}
                onClick={(e) =>
                  openTutorialProjectManageFromPreInvestment(e, {
                    range: 'yearToCurrentMonth',
                    investmentView: currentView3,
                    progressListType: 3,
                    fromPage: '/tutorial/preinvestment/project-progress',
                    keyProjectFilter: keyFilter3,
                  })
                }
              >
                已开工项目数
                <br />
                <div className={styles.stageTagNum}>{count43}个</div>
              </div>
              {/* <div className={styles.stageTag}>
                报批项目数
                <br />
                <div className={styles.stageTagNum}>{count44}个</div>
              </div>
              <div className={styles.stageTag}>
                开工项目数
                <br />
                <div className={styles.stageTagNum}>{count45}个</div>
              </div> */}
            </div>
          </div>
        </div>

        {/*<div className={styles.statsContainer}>*/}
        {/*  <div className={`${styles.statCard}`}>*/}
        {/*    <div className={styles.statHeader}>*/}
        {/*      <div*/}
        {/*        className={styles.statIcon}*/}
        {/*        style={{ background: 'linear-gradient(135deg, #3498db, #2c80ff)' }}*/}
        {/*      >*/}
        {/*        <ProfileFilled />*/}
        {/*      </div>*/}
        {/*      <div className={styles.statChange}>*/}
        {/*        <ArrowUpOutlined />*/}
        {/*        112.68%*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*    <div className={styles.statTitle}>9月新增项目数(亿元以上)</div>*/}
        {/*    <div className={styles.statValue}>151个</div>*/}
        {/*    <div className={styles.statDesc}>较上月增加80个项目</div>*/}
        {/*  </div>*/}

          {/*<div className={`${styles.statCard}`}>*/}
          {/*  <div className={styles.statHeader}>*/}
          {/*    <div*/}
          {/*      className={styles.statIcon}*/}
          {/*      style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}*/}
          {/*    >*/}
          {/*      <HighlightFilled />*/}
          {/*    </div>*/}
          {/*    <div className={styles.statChange}>*/}
          {/*      <ArrowUpOutlined />*/}
          {/*      111.64%*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div className={styles.statTitle}>9月新增投资额(亿元以上)</div>*/}
          {/*  <div className={styles.statValue}>424.3亿元</div>*/}
          {/*  <div className={styles.statDesc}>较上月提高223.82亿元</div>*/}
          {/*</div>*/}

          {/*<div className={`${styles.statCard}`}>*/}
          {/*  <div className={styles.statHeader}>*/}
          {/*    <div*/}
          {/*      className={styles.statIcon}*/}
          {/*      style={{ background: 'linear-gradient(135deg, #f39c12, #e67e22)' }}*/}
          {/*    >*/}
          {/*      <StrikethroughOutlined />*/}
          {/*    </div>*/}
          {/*    <div className={styles.statChange}>*/}
          {/*      <ArrowUpOutlined />*/}
          {/*      87.5%*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div className={styles.statTitle}>9月新增四重项目(亿元以上)</div>*/}
          {/*  <div className={styles.statValue}>120个</div>*/}
          {/*  <div className={styles.statDesc}>较上月新增长56个项目</div>*/}
          {/*</div>*/}

          {/*<div className={`${styles.statCard}`}>*/}
          {/*  <div className={styles.statHeader}>*/}
          {/*    <div*/}
          {/*      className={styles.statIcon}*/}
          {/*      style={{ background: 'linear-gradient(135deg, #9b59b6, #8e44ad)' }}*/}
          {/*    >*/}
          {/*      <FundFilled />*/}
          {/*    </div>*/}
          {/*    <div className={styles.statChange}>*/}
          {/*      <ArrowUpOutlined />*/}
          {/*      74.78%*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div className={styles.statTitle}>9月新增四重项目投资额(亿元以上)</div>*/}
          {/*  <div className={styles.statValue}>336.81亿元</div>*/}
          {/*  <div className={styles.statDesc}>较上月提高143.88亿元</div>*/}
          {/*</div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default PreInvestment;
