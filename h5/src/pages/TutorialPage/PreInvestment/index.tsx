/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Row } from "antd";
import dayjs from 'dayjs';
import { primeApi } from "../../../api.ts";
import styles from "./index.module.css";

export default function TutorialPage() {
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("全市");
  const [, setMonth] = useState(10);

  const [count11, setCount11] = useState(0);
  const [count12, setCount12] = useState(0);
  const [count13, setCount13] = useState(0);
  const [count14, setCount14] = useState(0);
  const [count15, setCount15] = useState(0);
  const [count16, setCount16] = useState(0);
  const [count17, setCount17] = useState(0);
  const [count18, setCount18] = useState(0);
  const [, setDataSource1] = useState<any[]>([]);


  const [count21, setCount21] = useState(0);
  const [count22, setCount22] = useState(0);
  const [count23, setCount23] = useState(0);
  const [count24, setCount24] = useState(0);
  const [, setDataSource2] = useState<any[]>([]);

  const [count31, setCount31] = useState(0);
  const [count32, setCount32] = useState(0);
  const [count33, setCount33] = useState(0);
  const [, setDataSource3] = useState<any[]>([]);

  const [count41, setCount41] = useState(0);
  const [count42, setCount42] = useState(0);
  const [count43, setCount43] = useState(0);
  const [, setDataSource4] = useState<any[]>([]);

  const areas = [
    {
      title: "全市",
      key: ''
    },
    {
      title: "靖江市",
      key: 'jjs'
    },
    {
      title: "泰兴市",
      key: 'txs'
    },
    {
      title: "兴化市",
      key: 'xhs'
    },
    {
      title: "海陵区",
      key: 'hlq'
    },
    {
      title: "姜堰区",
      key: 'jyq'
    },
    {
      title: "医药高新区(高港区)",
      key: 'yygxq'
    },
  ];

  const itemArr1 = [
    {
      title: "全市新增项目数",
      unit: "个",
      monthNum: count11,
      totalNum: count12,
    },
    {
      title: "全市新增投资额",
      unit: "亿元",
      monthNum: count15?.toFixed(0) || 0,
      totalNum: count16?.toFixed(0) || 0,
    },
    {
      title: "内资项目数",
      unit: "个",
      totalNum: count13,
    },
    {
      title: "内资投资额",
      unit: "亿元",
      totalNum: count17?.toFixed(0) || 0,
    },
    {
      title: "外资项目数",
      unit: "个",
      totalNum: count14,
    },
    {
      title: "外资投资额",
      unit: "亿美元",
      totalNum: count18?.toFixed(0) || 0,
    },
  ];

  const itemArr2 = [
    {
      title: "新增数量",
      unit: "个",
      monthNum: count21,
      totalNum: count22,
    },
    {
      title: "新增投资额",
      unit: "亿元",
      monthNum: count23?.toFixed(0) || 0,
      totalNum: count24?.toFixed(0) || 0,
    },
  ];

  const itemArr3 = [
    {
      title: "新设企业数",
      unit: "个",
      totalNum: count31,
      // totalNum: 6,
    },
    {
      title: "合同外资金额",
      unit: "亿美元",
      totalNum: count32?.toFixed(0) || 0,
    },
    {
      title: "实际使用外资金额",
      unit: "亿美元",
      totalNum: count33?.toFixed(0) || 0,
    },
  ];

  const itemArr4 = [
    {
      title: "新签约项目数",
      unit: "个",
      totalNum: count41,
    },
    {
      title: "注册项目数",
      unit: "个",
      totalNum: count42,
    },
    {
      title: "备案项目数",
      unit: "个",
      totalNum: count43,
    },
  ];

  const sumArray = (arr: any) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum;
  };

  const loadData1 = async (tabName: string) => {
    void tabName;
    const endTime = dayjs().endOf('month');
    setMonth(dayjs(endTime).month() + 1);
    const res = await primeApi.statisticsSignedProjectInfo({
      currStartDate: dayjs(endTime).startOf('year').format('YYYY-MM-DD'),
      currEndDate: dayjs(endTime).format('YYYY-MM-DD'),
      currDate: dayjs(endTime).startOf('month').format('YYYY-MM-DD'),
      year: dayjs(endTime).year().toString(),
    });
    const tableData = res ? res : [];
    setDataSource1(tableData);

    const arr1 = tableData.map((item: any) => Number(item.monthNum));
    const arr5 = tableData.map((item: any) => Number(item.monthQyje));
    setCount11(sumArray(arr1));
    setCount15(sumArray(arr5));
    const arr2 = tableData.map((item: any) => Number(item.projNums));
    const arr6 = tableData.map((item: any) => Number(item.ztz));
    setCount12(sumArray(arr2));
    setCount16(sumArray(arr6));
    const arr3 = tableData.map((item: any) => Number(item.nzProjNum));
    const arr7 = tableData.map((item: any) => Number(item.nzTz));
    setCount13(sumArray(arr3));
    setCount17(sumArray(arr7));
    const arr4 = tableData.map((item: any) => Number(item.wzProjNum));
    const arr8 = tableData.map((item: any) => Number(item.wzTz));
    setCount14(sumArray(arr4));
    setCount18(sumArray(arr8));
  };

  const loadData2 = async (tabName: string, key: string) => {
    void tabName;
    void key;
    const endTime = dayjs().endOf('month');
    const res = await primeApi.countSignedProjTypeByLevel({
      currStartDate: dayjs(endTime).startOf('year').format('YYYY-MM-DD'),
      currEndDate: dayjs(endTime).format('YYYY-MM-DD'),
      currDate: dayjs(endTime).startOf('month').format('YYYY-MM-DD'),
      level: 3,
    });
    const tableData = res ? res : [];
    setDataSource2(tableData);
    const arr1 = tableData.map((item: any) => Number(item.monthNum));
    setCount21(sumArray(arr1));
    const arr2 = tableData.map((item: any) => Number(item.total));
    setCount22(sumArray(arr2));
    const arr3 = tableData.map((item: any) => Number(item.monthQyje));
    setCount23(sumArray(arr3));
    const arr4 = tableData.map((item: any) => Number(item.totalQyje));
    setCount24(sumArray(arr4));
  };

  const loadData3 = async (tabName: string) => {
    const res = await primeApi.listForeignCapitalUtilization({
      // 传“当前月份的前一个月”（1 月会自动跨年到上一年 12 月）
      month: 12,
      page: 1,
      size: 500,
      year: 2025,
    });
    const tableData = res?.records || [];
    setDataSource3(tableData);
    const keyName = tabName === '全市' ? '全市' : tabName
    const obj = tableData.filter((item) => item.area === keyName)[0];
    setCount31(Number(obj?.newEnterpriseCountCurrent || 0));
    setCount32(Number((Number(obj?.contractedForeignCapitalAmount || 0) / 10000).toFixed(2)));
    setCount33(Number((Number(obj?.actuallyUtilizedForeignCapitalAmount || 0) / 10000).toFixed(2)));
  };

  const loadData4 = async (tabName: string) => {
    void tabName;
    const endTime = dayjs().endOf('month');
    const res = await primeApi.statisticsProjectStatusInfo({
      currStartDate: dayjs(endTime).startOf('year').format('YYYY-MM-DD'),
      currEndDate: dayjs(endTime).format('YYYY-MM-DD'),
    });
    const data = res ? res : [];
    const tableData = data
    setDataSource4(tableData);

    const arr1 = tableData.map((item: any) => Number(item.projNums));
    setCount41(sumArray(arr1));
    const arr2 = tableData.map((item: any) => Number(item.zcProjNum));
    setCount42(sumArray(arr2));
    const arr3 = tableData.map((item: any) => Number(item.baProjNum));
    setCount43(sumArray(arr3));
  };

  const handleToDetail = (record: any, type: string) => {
    const queryParams = new URLSearchParams({
      area: currentTab,
      title: record.title,
      monthNum: record.monthNum,
      totalNum: record.totalNum,
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
    loadData1('全市');
    loadData2('全市', '');
    loadData3('全市');
    loadData4('全市');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        {/* <div className={styles.testText}>测试版，数据以PC端为准</div> */}
        <div className={styles.topCon} style={{display:'none'}}>
          {areas.map((item, index) => {
            if (currentTab == item.title) {
              return (
                <div
                  onClick={() => {
                    setCurrentTab(item.title);
                    loadData1(item.title);
                    loadData2(item.title, item.key);
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
                    loadData2(item.title, item.key);
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
        </div>
      </div>

      <div className={styles.mainCon}>
        <div className={styles.titleCon}>
          <div className={styles.titleLeftCon}>
            <img className={styles.titleImg} src="/img/tutorial/titleIcon1.png" alt="" />
            <div className={styles.titleText}>前期招商</div>
          </div>
          <div className={styles.titleRightCon}>
            <div className={styles.spanActive1}>本月</div>
            <div className={styles.span}>/</div>
            <div className={styles.span1}>累计</div>
          </div>
        </div>

        {/* 新签约项目 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>新签约项目</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr1.map((item, index) => {
              return (
                <div onClick={() => { handleToDetail(item, '/tutorial/over-million-projects') }} key={index} className={styles.item}>
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
        {/* 新签约项目 */}

        {/* 重点产业链项目 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>重点产业链项目</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr2.map((item, index) => {
              return (
                <div onClick={() => { handleToDetail(item, '/tutorial/fourfold') }} key={index} className={styles.item}>
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
        {/* 重点产业链项目 */}

        {/* 利用外资 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>利用外资</div>
            <div className={styles.subtitleText}>2025年12月泰州市利用外资情况</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr3.map((item, index) => {
              return (
                <div onClick={() => { handleToDetail(item, '/tutorial/foreign-investment') }} key={index} className={styles.item}>
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
        {/* 利用外资 */}

        {/* 项目进度情况 */}
        <div className={styles.itemContainer}>
          <div className={styles.itemTopCon}>
            <div className={styles.itemTopConText}>项目进度情况</div>
          </div>
          <div className={styles.itemCon}>
            {itemArr4.map((item, index) => {
              return (
                <div onClick={() => {handleToDetail(item,'project-progress')}} key={index} className={styles.item}>
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
        {/* 项目进度情况 */}

      </div>
    </div>
  );
}
