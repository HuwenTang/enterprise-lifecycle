import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Row } from "antd";
import { primeApi } from "../../../api.ts";
import styles from "./index.module.css";

const FIXED_YEAR = 2025;
const FIXED_MONTH = 9; // 1-12

const getMonthRangeUTC = (year: number, month: number) => {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));
  return { start, end };
};

type DetailRecord = {
  title: string;
  type?: string;
  unit?: string;
  monthNum?: number;
  totalNum?: number;
  yearNum?: number;
};

export default function TutorialPage() {
  const navigate = useNavigate();
  const [currentTab] = useState("全市");

  const [count11, setCount11] = useState(0);
  const [count12, setCount12] = useState(0);
  const [count13, setCount13] = useState(0);
  const [count14, setCount14] = useState(0);
  const [count15, setCount15] = useState(0);
  const [count16, setCount16] = useState(0);
  const [count17, setCount17] = useState(0);
  const [count18, setCount18] = useState(0);
  const [, setDataSource] = useState<unknown>(null);
  const [count21, setCount21] = useState(0);
  const [count22, setCount22] = useState(0);
  const [count23, setCount23] = useState(0);
  const [count24, setCount24] = useState(0);
  const [count25, setCount25] = useState(0);
  const [count26, setCount26] = useState(0);
  const [count27, setCount27] = useState(0);
  const [count28, setCount28] = useState(0);
  const [, setDataSource2] = useState<unknown>(null);
  const [count31, setCount31] = useState(0);
  const [count32, setCount32] = useState(0);
  const [count33, setCount33] = useState(0);
  const [count34, setCount34] = useState(0);
  const [count35, setCount35] = useState(0);
  const [count36, setCount36] = useState(0);
  const [count41, setCount41] = useState(0);
  const [count42, setCount42] = useState(0);
  const [count43, setCount43] = useState(0);
  const [count44, setCount44] = useState(0);
  const [, setDataSource4] = useState<unknown>(null);

  const itemArr1 = [
    {
      title: "新增在建项目",
      unit: "个",
      monthNum: count11,
      totalNum: count12,
    },
    {
      title: "计划总投资",
      type: '在建项目',
      unit: "亿元",
      monthNum: count13,
      totalNum: count14,
    },
    {
      title: "内资项目",
      unit: "个",
      totalNum: count15,
    },
    {
      title: "计划总投资",
      type: '内资项目',
      unit: "亿元",
      totalNum: count16,
    },
    {
      title: "外资项目",
      unit: "个",
      totalNum: count17,
    },
    {
      title: "计划总投资",
      type: '外资项目',
      unit: "亿元",
      totalNum: count18,
    },
  ];

  const itemArr2 = [
    {
      title: "新增入库项目",
      unit: "个",
      monthNum: count21,
      yearNum: count22,
      totalNum: count23,
    },
    {
      title: "计划总投资",
      type: '入库项目',
      unit: "亿元",
      yearNum: count24,
      totalNum: count25,
    },

    {
      title: "新增列统投资",
      unit: "亿元",
      monthNum: count26,
      yearNum: count27,
      totalNum: count28,
    },
  ];

  const itemArr3 = [
    {
      title: "竣工项目数",
      unit: "个",
      monthNum: count31,
      totalNum: count32,
    },
    {
      title: "计划总投资",
      type: '竣工项目',
      unit: "亿元",
      monthNum: count33,
      totalNum: count34,
    },
    {
      title: "入库投资情况",
      unit: "个",
      totalNum: count35,
    },
    {
      title: "实际完成投资",
      unit: "亿元",
      totalNum: count36,
    },
  ];

  const itemArr4 = [
    {
      title: "工业项目",
      unit: "个",
      totalNum: count41,
    },
    {
      title: "计划总投资",
      type: '工业项目',
      unit: "亿元",
      totalNum: count42,
    },
    {
      title: "重点链群项目",
      unit: "个",
      totalNum: count43,
    },
    {
      title: "计划总投资",
      type: '重点链群项目',
      unit: "亿元",
      totalNum: count44,
    },
  ]

  const loadData1 = async (tabName: string) => {
    try {
      const { start, end } = getMonthRangeUTC(FIXED_YEAR, FIXED_MONTH);
      const res = await primeApi.getUnderConstructionProjects({
        start,
        end,
      });
      setDataSource(res);
      const obj = res.children.filter(item=>item.districtName === '医药高新区（高港区）')
      const obj2 = res.children.filter(item=>item.districtName === tabName)
      const data1 = tabName === '医药高新区(高港区)'? obj[0]: tabName === '全市'? res: obj2[0]
      setCount11(data1?.increasement?.count || 0);
      setCount12(data1?.accumulation?.count || 0);
      setCount13(data1?.increasement?.amount/10000 ? Number((data1?.increasement?.amount/10000).toFixed(0)) : 0);
      setCount14(data1?.accumulation?.amount/10000 ? Number((data1?.accumulation?.amount/10000).toFixed(0)) : 0);
      setCount15(data1?.domestic?.count || 0);
      setCount16(data1?.domestic?.amount/10000 ? Number((data1?.domestic?.amount/10000).toFixed(0)) : 0);
      setCount17(data1?.foreign?.count || 0);
      setCount18(data1?.foreign?.amount/10000 ? Number((data1?.foreign?.amount/10000).toFixed(0)) : 0);


    } catch (error) {
      console.error('获取投资概览数据失败:', error);
    }
  };

  const loadData2 = async (tabName: string) => {
    try {
      const { start, end } = getMonthRangeUTC(FIXED_YEAR, FIXED_MONTH);
      const res = await primeApi.getStatisticalInvestment({
        start,
        end,
      });
      setDataSource2(res);
      const obj = res.children.filter(item=>item.districtName === '医药高新区（高港区）')
      const obj2 = res.children.filter(item=>item.districtName === tabName)

      const data2 = tabName === '医药高新区(高港区)'? obj[0]: tabName === '全市'? res: obj2[0]

      setCount21(data2?.monthIncreasement || 0);
      setCount22(data2?.yearIncreasement || 0);
      setCount23(data2?.totalCount || 0);
      setCount24(data2?.yearInvestment/10000 ? Number((data2?.yearInvestment/10000).toFixed(0)) : 0);
      setCount25(data2?.totalInvestment/10000 ? Number((data2?.totalInvestment/10000).toFixed(0)) : 0);
      setCount26(data2?.monthStatisticalInvestment/10000 ? Number((data2?.monthStatisticalInvestment/10000).toFixed(0)) : 0);
      setCount27(data2?.yearStatisticalInvestment/10000 ? Number((data2?.yearStatisticalInvestment/10000).toFixed(0)) : 0);
      setCount28(data2?.totalStatisticalInvestment/10000 ? Number((data2?.totalStatisticalInvestment/10000).toFixed(0)) : 0);

    } catch (error) {
      console.error('获取投资概览数据失败:', error);
    }
  };

  const loadData3 = async (tabName: string) => {
    try {
      const { start, end } = getMonthRangeUTC(FIXED_YEAR, FIXED_MONTH);
      const res = await primeApi.getInvestmentCompletionRate({
        start,
        end,
      });
      setDataSource2(res);
      const obj = res.children.filter(item=>item.districtName === '医药高新区（高港区）')
      const obj2 = res.children.filter(item=>item.districtName === tabName)

      const data3 = tabName === '医药高新区(高港区)'? obj[0]: tabName === '全市'? res: obj2[0]

      setCount31(data3?.month.count || 0);
      setCount33(data3?.month.amount/10000 ? Number((data3?.month.amount/10000).toFixed(0)) : 0);
      setCount32(data3?.year.count|| 0);
      setCount34(data3?.year.amount/10000 ? Number((data3?.year.amount/10000).toFixed(0)) : 0);
      setCount35(data3?.statisticalInvestment.count|| 0);
      setCount36(data3?.statisticalInvestment.amount/10000 ? Number((data3?.statisticalInvestment.amount/10000).toFixed(0)) : 0);

    } catch (error) {
      console.error('获取投资概览数据失败:', error);
    }
  }

  const loadData4 = async () => {
    try {
      const res = await primeApi.getInvestmentOverview({
        isMunicipalKey: false,
        isOverOneBillion: true
      });
      setDataSource4(res);
      const data4 = res;
      setCount41(data4?.industrialChainDistribution?.industryProjectCount || 0);
      setCount42(data4?.industrialChainDistribution?.industryProjectPlannedTotalInvestment
                    ? Number((data4.industrialChainDistribution.industryProjectPlannedTotalInvestment / 10000).toFixed(0))
                    : 0);
      setCount43(data4?.industrialChainDistribution?.industrialChainProjectCount || 0);
      setCount44(data4?.industrialChainDistribution?.industrialChainPlannedTotalInvestment
                    ? Number((data4.industrialChainDistribution.industrialChainPlannedTotalInvestment / 10000).toFixed(0))
                    : 0);

    } catch (error) {
      console.error('获取投资概览数据失败:', error);
    }
  }

  const handleToDetail = (record: DetailRecord, type: string) => {
    const { start, end } = getMonthRangeUTC(FIXED_YEAR, FIXED_MONTH);
    const startStr = start.toISOString().substring(0, 10);
    const endStr = end.toISOString().substring(0, 10);
    const queryParams = new URLSearchParams({
      area: currentTab,
      title: record.type ? record.type + record.title : record.title,
      monthNum: String(record.monthNum ?? ''),
      totalNum: String(record.totalNum ?? ''),
      yearNum: String(record.yearNum ?? ''),
      start: startStr,
      end: endStr,
    });
    navigate(`${type}?${queryParams.toString()}`);
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滚动
    });
  };

  useEffect(() => {
    scrollToTop();
    loadData1('全市');
    loadData2('全市');
    loadData3('全市');
    loadData4();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
      </div>

      <div className={styles.mainCon}>
        <div className={styles.titleCon}>
          <div className={styles.titleLeftCon}>
            <img className={styles.titleImg} src="/img/tutorial/titleIcon1.png" alt="" />
            <div className={styles.titleText}>投资进度</div>
          </div>
          <div className={styles.titleRightCon}>
            <div className={styles.spanActive1}>本月</div>
            <div className={styles.span}>/</div>
            <div className={styles.span1}>累计</div>
          </div>
        </div>

        {/* 在建项目 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>在建项目</div>
            <div className={styles.subtitleText}>2025年计划总投资500万元及以上的固定资产投资在建项目情况</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr1.map((item, index) => {
              return (
                <div onClick={() => { handleToDetail(item, '/tutorial/project-under-construction') }} key={index} className={styles.item}>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemTextCon}>
                    {item.monthNum !== undefined ? (
                      <Row className={styles.itemTextCon}>
                        <div className={styles.text1}>
                          {item.monthNum}
                          {item.unit}
                        </div>
                        <div className={styles.text2}>/</div>
                      </Row>
                    ) : (
                      ""
                    )}
                    {item.totalNum !== undefined ? (
                      <div className={styles.text3}>
                        {item.totalNum}
                        {item.unit}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* 在建项目 */}

        {/* 入库投资 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>入库投资</div>
            <div className={styles.subtitleText}>2025年统计局统计库里的项目</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr2.map((item, index) => {
              return (
                <div onClick={() => { handleToDetail(item, '/tutorial/portfolio-investment') }} key={index} className={styles.item}>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemTextCon}>
                    {item.monthNum !== undefined ? (
                      <Row className={styles.itemTextCon}>
                        <div className={styles.text1}>
                          {item.monthNum}
                          {item.unit}
                        </div>
                        <div className={styles.text2}>/</div>
                      </Row>
                    ) : (
                      ""
                    )}
                    {item.totalNum !== undefined ? (
                      <div className={styles.text3}>
                        {item.totalNum}
                        {item.unit}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* 入库投资 */}

        {/* 投资完成率 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>投资完成率</div>
            <div className={styles.subtitleText}>2025年竣工项目投资情况</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr3.map((item, index) => {
              return (
                <div onClick={() => { handleToDetail(item, '/tutorial/investment-completion-rate') }} key={index} className={styles.item}>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemTextCon}>
                    {item.monthNum !== undefined ? (
                      <Row className={styles.itemTextCon}>
                        <div className={styles.text1}>
                          {item.monthNum}
                          {item.unit}
                        </div>
                        <div className={styles.text2}>/</div>
                      </Row>
                    ) : (
                      ""
                    )}
                    {item.totalNum !== undefined ? (
                      <div className={styles.text3}>
                        {item.totalNum}
                        {item.unit}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* 投资完成率 */}

        {/* 链群体系 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>链群体系</div>
            <div className={styles.subtitleText}>2025年开工及在建的工业项目情况</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr4.map((item, index) => {
              return (
                <div onClick={() => { handleToDetail(item, '/tutorial/chain-cluster-system') }} key={index} className={styles.item}>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemTextCon}>
                    {item.totalNum !== undefined ? (
                      <div className={styles.text3}>
                        {item.totalNum}
                        {item.unit}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* 链群体系 */}

      </div>
    </div>
  );
}
