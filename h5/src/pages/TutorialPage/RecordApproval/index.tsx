import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, FileTextOutlined, BarChartOutlined, BellOutlined, BuildOutlined, UserOutlined, LineChartOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const TouChanDaXiao: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/tutorial');
  };

  return (
    <div className={styles.touChanDaXiaoPage}>
      <div className={styles.container}>
        {/*<header className={styles.header}>*/}

        {/*  <div className={styles.userInfo}>*/}
        {/*    <div className={styles.notification}>*/}
        {/*    </div>*/}

        {/*  </div>*/}
        {/*</header>*/}

        {/*<Button onClick={handleBack} className={styles.backButton}>*/}
        {/*  <ArrowLeftOutlined />*/}
        {/*  返回*/}
        {/*</Button>*/}

        <h1 className={styles.pageTitle}>投产达效</h1>
        <p className={styles.pageSubtitle}>
          负责企业开工建设、竣工投产和运行监管，促进工业经济高质量发展
        </p>

        <div className={styles.stageDashboard}>
          {/* 完成投资 */}
          <div
            className={styles.stageCard}
            data-target="subIndustry"
            onClick={() => navigate('/tutorial/tou-chan-da-xiao/investment-detail-mobile')}
          >
            <div className={styles.stageHeader}>
              <div
                className={styles.stageIcon}
                style={{ background: 'linear-gradient(135deg, #3498db, #2c80ff)' }}
              >
                <GlobalOutlined />
              </div>
              <div className={styles.stageCount}>
                {/*580*/}
                {/*<br /> <span className={styles.progressText}>亿元</span>*/}
              </div>
            </div>
            <h3>完成投资</h3>
            <p>已竣工项目完成投资情况</p>
          </div>

          {/* 进规纳统 */}
          <div
            className={styles.stageCard}
            data-target="subIndustry"
            onClick={() => navigate('/tutorial/tou-chan-da-xiao/compliance-detail')}
          >
            <div className={styles.stageHeader}>
              <div
                className={styles.stageIcon}
                style={{ background: 'linear-gradient(135deg, #3498db, #2c80ff)' }}
              >
                <GlobalOutlined />
              </div>
              {/*<div className={styles.stageCount}>2</div>*/}
            </div>
            <h3>进规纳统</h3>
            <p>成长为规模以上企业</p>
          </div>

          {/* 产出效益 */}
          <div
            className={styles.stageCard}
            data-target="subIndustry"
            onClick={() => navigate('/tutorial/tou-chan-da-xiao/economic-detail')}
          >
            <div className={styles.stageHeader}>
              <div
                className={styles.stageIcon}
                style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}
              >
                <FileTextOutlined />
              </div>
              <div className={styles.stageCount}>
                {/*10000*/}
                {/*<br /> <span className={styles.progressText}>亿元</span>*/}
              </div>
            </div>
            <h3>产出效益</h3>
            <p>已竣工达产企业效益产出情况</p>
          </div>

          {/* 链群体系 */}
          <div
            className={styles.stageCard}
            data-target="subIndustry"
            onClick={() => navigate('/tutorial/tou-chan-da-xiao/chain-cluster-detail')}
          >
            <div className={styles.stageHeader}>
              <div
                className={styles.stageIcon}
                style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}
              >
                <FileTextOutlined />
              </div>
              <div className={styles.stageCount}>
                {/*100000*/}
                {/*<br /> <span className={styles.progressText}>亿元</span>*/}
              </div>
            </div>
            <h3>链群体系</h3>
            <p>"8+13+X"链群体系个性数据</p>
          </div>
        </div>

        <div className={styles.footer}>
          <p>企业全生命周期管理服务平台 © 2025 版权所有</p>
        </div>
      </div>
    </div>
  );
};

export default TouChanDaXiao;
