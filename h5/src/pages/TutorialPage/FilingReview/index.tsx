import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Row } from "antd";
import dayjs from "dayjs";
import styles from "./index.module.css";
import { primeApi } from "../../../api.ts";

type OverviewCardItem = {
  title: string;
  unit: string;
  monthNum?: number;
  totalNum?: number;
  /** 为 true 时不跳转详情 */
  noNavigate?: boolean;
};

/** 固定使用上月，用于查询与详情页传参 */
function getLastMonthRange(): { start: string; end: string } {
  const lastMonth = dayjs().subtract(1, "month");
  const start = lastMonth.startOf("month").format("YYYY-MM-DD");
  const end = lastMonth.endOf("month").format("YYYY-MM-DD");
  return { start, end };
}

export default function TutorialPage() {
  const navigate = useNavigate();

  const [currentTab] = useState("全市");

  const [count11, setCount11] = useState(0);
  const [count12, setCount12] = useState(0);
  const [count15, setCount15] = useState(0);
  const [count16, setCount16] = useState(0);
  const [count18, setCount18] = useState(0);
  const [count19, setCount19] = useState(0);
  const [count21, setCount21] = useState(0);
  const [count23, setCount23] = useState(0);
  const [count25, setCount25] = useState(0);
  const [count26, setCount26] = useState(0);
  const [count27, setCount27] = useState(0);
  const [count28, setCount28] = useState(0);

  // 新增：链群分布独立状态，避免与审批服务中的 count28 冲突
  const [chainTotal2, setChainTotal2] = useState(0);
  const [chainKeyIndustryCount, setChainKeyIndustryCount] = useState(0);
  const [chainTotal3, setChainTotal3] = useState(0);

  // 新备案项目（第二项仅展示“年累计”，不再显示斜杠）
  const itemArr1: OverviewCardItem[] = [
    { title: "本月新增", unit: "个", monthNum: 55, noNavigate: true },
    { title: "本年新增", unit: "个", totalNum: 144, noNavigate: true },
    { title: "累计备案总投资", unit: "亿元", totalNum: count15 },
  ];
  // 用地保障
  const itemArr2: OverviewCardItem[] = [
    { title: "需新增用地项目", unit: "个", monthNum: count16 },
    { title: "已取得土地", unit: "个", totalNum: count18 },
    { title: "无需新增用地项目", unit: "个", monthNum: count19 },
  ];
  // 审批服务
  const itemArr3: OverviewCardItem[] = [
    { title: "环评已完成", unit: "个", monthNum: count21 },
    { title: "能评已完成", unit: "个", monthNum: count23 },
    { title: "安评已完成", unit: "个", totalNum: count25 },
    { title: "施工图审完成", unit: "个", totalNum: count26 },
    { title: "施工许可完成", unit: "个", totalNum: count28 },
  ];
  // 链群分布（采用新增状态显示投资额）
  const itemArr4: OverviewCardItem[] = [
    { title: "工业项目", unit: "个", totalNum: count27 },
    { title: "备案总投资", unit: "亿元", totalNum: chainTotal2 },
    { title: "重点链群项目", unit: "个", totalNum: chainKeyIndustryCount },
    { title: "备案总投资", unit: "亿元", totalNum: chainTotal3 },
  ];

  const loadData1 = async () => {
    try {
      const lastMonth = dayjs().subtract(1, "month");
      const year = lastMonth.year();
      const month = lastMonth.month() + 1;

      const res = await primeApi.getFilingOverview({
        year: year,
        month: month,
        isOverOneBillion: false,
        isOverFiveBillion: false
      });

      // 新备案项目
      setCount11(res.month || 0);
      setCount12(res.year || 0);
      setCount15(res.total ? Number((res.total / 10000).toFixed(0)) : 0);

      // 用地保障
      setCount16(res.needAddLand || 0);
      setCount18(res.land || 0);
      setCount19(res.noNeedAddLand || 0);

      // 审批服务
      setCount21(res.environment || 0);
      setCount23(res.energy || 0);
      setCount25(res.security || 0);
      setCount26(res.map || 0);
      setCount28(res.construction || 0);

      // 链群分布
      setCount27(res.industry || 0);
      setChainTotal2(res.total2 ? Number((res.total2 / 10000).toFixed(0)) : 0);
      setChainKeyIndustryCount(res.keyIndustry || 0);
      setChainTotal3(res.total3 ? Number((res.total3 / 10000).toFixed(0)) : 0);
    } catch (error) {
      console.error('获取备案审批总览失败:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滚动
    });
  };

  useEffect(() => {
    scrollToTop();
    loadData1();
  }, []);

  const handleToDetail = (record: OverviewCardItem, type: string) => {
    const { start, end } = getLastMonthRange();
    const queryParams = new URLSearchParams({
      area: currentTab,
      title: record.title,
      monthNum: String(record.monthNum ?? ''),
      totalNum: String(record.totalNum ?? ''),
      start,
      end,
    });
    navigate(`${type}?${queryParams.toString()}`);
  }


  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        {/* 顶部区域 */}
      </div>

      <div className={styles.mainCon}>
        <div className={styles.titleCon}>
          <div className={styles.titleLeftCon}>
            <img className={styles.titleImg} src="/img/tutorial/titleIcon1.png" alt="" />
            <div className={styles.titleText}>备案审批</div>
          </div>
          <div className={styles.titleRightCon}>
            <div className={styles.spanActive1}>本月</div>
            <div className={styles.span}>/</div>
            <div className={styles.span1}>累计</div>
          </div>
        </div>

        {/* 新备案项目 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>新备案项目</div>
            <div className={styles.subtitleText}>新备案亿元以上产业项目</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr1.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${styles.item}${item.noNavigate ? ` ${styles.itemNoNavigate}` : ""}`}
                  onClick={item.noNavigate ? undefined : () => handleToDetail(item, "/tutorial/approve-project")}
                  role={item.noNavigate ? undefined : "button"}
                  tabIndex={item.noNavigate ? undefined : 0}
                  onKeyDown={
                    item.noNavigate
                      ? undefined
                      : (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleToDetail(item, "/tutorial/approve-project");
                          }
                        }
                  }
                >
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemTextCon}>
                    {item.monthNum !== undefined ? (
                      <Row className={styles.itemTextCon}>
                        <div className={styles.text1}>
                          {item.monthNum}
                          {item.unit}
                        </div>
                        {/*<div className={styles.text2}>/</div>*/}
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
        {/* 用地保障 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>用地保障</div>
            <div className={styles.subtitleText}>新备案亿元以上产业项目用地情况</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr2.map((item, index) => {
              return (
                <div onClick={() => { handleToDetail(item, '/tutorial/land-detail') }} key={index} className={styles.item}>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemTextCon}>
                    {item.monthNum !== undefined ? (
                      <Row className={styles.itemTextCon}>
                        <div className={styles.text1}>
                          {item.monthNum}
                          {item.unit}
                        </div>
                        {/* <div className={styles.text2}>/</div> */}
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
        {/* 审批服务 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>审批服务</div>
            <div className={styles.subtitleText}>新备案亿元以上产业项目审批情况</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr3.map((item, index) => {
              return (
                <div onClick={() => { handleToDetail(item, '/tutorial/audit-project') }} key={index} className={styles.item}>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemTextCon}>
                    {item.monthNum !== undefined ? (
                      <Row className={styles.itemTextCon}>
                        <div className={styles.text3}>
                          {item.monthNum}
                          {item.unit}
                        </div>
                        {/* <div className={styles.text2}>/</div> */}
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
        {/* 链群分布 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>链群分布</div>
            <div className={styles.subtitleText}>新备案亿元以上产业项目链群分布情况</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr4.map((item, index) => {
              return (
                <div onClick={() => { handleToDetail(item, '/tutorial/chain-detail') }} key={index} className={styles.item}>
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

      </div>
    </div>
  );
}
