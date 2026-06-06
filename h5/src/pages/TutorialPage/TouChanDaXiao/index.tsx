import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Row } from "antd";
import { primeApi } from "../../../api.ts";
import styles from "./index.module.css";

export default function TutorialPage() {
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("全市");
  const itemArr1 = [
    {
      title: "全市规上工业企业数",
      unit: "家",
      totalNum: 4047,
    },
    {
      title: "25年进规企业数",
      unit: "家",
      totalNum: 455,
    },
    // {
    //   title: "可能进规工业企业",
    //   minText: true,
    //   unit: "家",
    //   totalNum: 903,
    // },
  ];

  const itemArr2 = [
    {
      title: "产值",
      unit: "亿元",
      totalNum: 1076,
    },
    {
      title: "开票",
      unit: "亿元",
      totalNum: 948,
    },
    {
      title: "营收",
      unit: "亿元",
      totalNum: 1006,
    },
    {
      title: "利润",
      unit: "亿元",
      totalNum: 99,
    },
    {
      title: "税收",
      unit: "亿元",
      totalNum: 45,
    },
  ];

  const itemArr3 = [
    {
      title: "全市规上工业产值",
      smallText: true,
      unit: "个",
      totalNum: 6173,
    },
    {
      title: "产业链群合计产值",
      smallText: true,
      unit: "亿元",
      totalNum: 5437,
    },
    {
      title: "占全市比重",
      smallText: true,
      unit: "%",
      totalNum: 88,
    },
  ];

  const handleToDetail = (record: any, type: string) => {
    const queryParams = new URLSearchParams({
      area: currentTab,
      title: record.type ? record.type + record.title:record.title,
      monthNum: record.monthNum,
      totalNum: record.totalNum,
      yearNum: record.yearNum,
    })
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
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        {/* <div className={styles.testText}>测试版，数据以PC端为准</div> */}
        {/* <div className={styles.topCon}>
          {areas.map((item, index) => {
            if (currentTab == item.title) {
              return (
                <div
                  onClick={() => {
                    setCurrentTab(item.title);
                    loadData1(item.title);
                    loadData2(item.title);
                    loadData3(item.title);
                    loadData4(item.title);
                  }}
                  key={index}
                  className={styles.tabActiveItem}
                >
                  {item.title}
                </div>
              );
            } else {
              return (
                <div
                  onClick={() => {
                    setCurrentTab(item.title);
                    loadData1(item.title);
                    loadData2(item.title);
                    loadData3(item.title);
                    loadData4(item.title);
                  }}
                  key={index}
                  className={styles.tabItem}
                >
                  {item.title}
                </div>
              );
            }
          })}
        </div> */}
      </div>

      <div className={styles.mainCon}>
        <div className={styles.titleCon}>
          <div className={styles.titleLeftCon}>
            <img className={styles.titleImg} src="/img/tutorial/titleIcon1.png" alt="" />
            <div className={styles.titleText}>投产达效</div>
          </div>
          <div className={styles.titleRightCon}>
            <div className={styles.spanActive1}>本月</div>
            <div className={styles.span}>/</div>
            <div className={styles.span1}>累计</div>
          </div>
        </div>

        {/* 进规纳统 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>进规纳统</div>
            <div className={styles.subtitleText}>2025年进规纳统情况</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr1.map((item, index) => {
              return (
                <div onClick={() => { handleToDetail(item, '/tutorial/compliance-detail') }} key={index} className={styles.item}>
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
        {/* 进规纳统 */}

        {/* 产出效益 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>产出效益</div>
            <div className={styles.subtitleText}>2024年产出效益</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr2.map((item, index) => {
              return (
                <div onClick={() => { handleToDetail(item, '/tutorial/economic-detail') }} key={index} className={styles.item}>
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
        {/* 产出效益 */}

        {/* 链群体系 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>链群体系</div>
            <div className={styles.subtitleText}>2025年全市规上工业链群分布情况</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr3.map((item, index) => {
              return (
                <div onClick={() => { handleToDetail(item, '/tutorial/chain-cluster-detail') }} key={index} className={styles.item}>
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
