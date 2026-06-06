import React, { useEffect, useState } from "react";

import Preinvestment from "./PreInvestment/index.tsx";
import TouChanDaXiao from "./TouChanDaXiao/index.tsx";
import TouZiJinDu from "./TouZiJinDu/index.tsx";
import FilingReview from "./FilingReview/index.tsx";

import styles from "./index.module.css";
import { useNavigate,useSearchParams } from "react-router-dom";

export default function TutorialPage() {
  const items = [
    {
      img: "/img/tutorial/icon1_a.svg",
      imgGray: "/img/tutorial/icon1_d.svg",
      title: "前期招商",
      path: "/tutorial/preinvestment",
      clickable: true,
    },
    {
      img: "/img/tutorial/icon2_a.svg",
      imgGray: "/img/tutorial/icon2_d.svg",
      title: "备案审批",
      path: "/tutorial/record-approval",
      clickable: false,
    },
    {
      img: "/img/tutorial/icon3_a.svg",
      imgGray: "/img/tutorial/icon3_d.svg",
      title: "投资进度",
      path: "/tutorial/kaigong-jungong",
      clickable: false,
    },
    {
      img: "/img/tutorial/icon4_a.svg",
      imgGray: "/img/tutorial/icon4_d.svg",
      title: "投产达效",
      path: "/tutorial/tou-chan-da-xiao",
      clickable: false,
    },
    // {
    //     img:'/img/GDP/basic1.png',
    //     title:'科创项目',
    //     path:"/tutorial/ke-chuang-xiang-mu"
    // }
  ];
  const navigate = useNavigate();

  const initialType = localStorage.getItem('currentType') || '前期招商'
  
  const [currentView, setCurrentView] = useState(initialType);

  return (
    <div>
      {/* <div className={styles.TopBarContainer}>
        <LeftOutlined className={styles.TopBarLeftIcon} onClick={()=> navigate(-1)} />
        <div className={styles.TopBarTitle}>项目全生命周期管理看板</div>
        <div></div>
      </div> */}

      <div className={styles.mainContainer}>
        {currentView === "前期招商" ? (
          <Preinvestment />
        ) : currentView === "备案审批" ? (
          <FilingReview />
        ) : currentView === "投资进度" ? (
          <TouZiJinDu />
        ) : (
          <TouChanDaXiao />
        )}
      </div>

      <div className={styles.tabBarContainer}>
        {items.map((item, index) => {
          if (currentView == item.title) {
            return (
              <div
                onClick={() => {
                  setCurrentView(item.title);
                  localStorage.setItem('currentType',item.title)
                }}
                key={index}
                className={styles.tabBarItem}
              >
                <img className={styles.tabBarActiveIcon} src={item.img} alt="" />
                <div className={styles.tabBarActiveTitle}>{item.title}</div>
              </div>
            );
          } else {
            return (
              <div
                onClick={() => {
                  setCurrentView(item.title);
                  localStorage.setItem('currentType',item.title);
                }}
                key={index}
                className={styles.tabBarItem}
              >
                <img className={styles.tabBarIcon} src={item.imgGray} alt="" />
                <div className={styles.tabBarTitle}>{item.title}</div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
