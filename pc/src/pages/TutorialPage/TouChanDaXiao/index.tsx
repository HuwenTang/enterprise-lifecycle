import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, FileTextOutlined, BarChartOutlined, BellOutlined, BuildOutlined, UserOutlined, LineChartOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const TouChanDaXiao: React.FC = () => {
  const navigate = useNavigate();

  const [currentView1, setCurrentView1] = React.useState<string>('2025');
  const [currentView2, setCurrentView2] = React.useState<string>('2025');
  const [currentView3, setCurrentView3] = React.useState<string>('2025');

  const handleBack = () => {
    navigate('/tutorial');
  };

  // 处理完成投资视图切换
  const handleViewChange1 = (view: string) => {
    setCurrentView1(view);
    // 这里可以添加数据加载逻辑
  };

  // 处理产出效益视图切换
  const handleViewChange2 = (view: string) => {
    setCurrentView2(view);
    // 这里可以添加数据加载逻辑
  };

  // 处理链群体系视图切换
  const handleViewChange3 = (view: string) => {
    setCurrentView3(view);
    // 这里可以添加数据加载逻辑
  };
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

        <h1 className={styles.pageTitle}>投产达效</h1>
        <p className={styles.pageSubtitle}>负责竣工项目的进规纳统、产出效益和链群体系建没</p>

        <div className={styles.stageDashboard}>
          <div
            className={styles.stageCard}
            data-target="subIndustry"
            onClick={() => navigate('/tutorial/tou-chan-da-xiao/compliance-detail')}
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
              <div className={styles.rightActions}>
                <Button
                  className={[styles.chartBtn, currentView2 === '2025' ? styles.active : ''].join(
                    ' ',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange2('2025');
                  }}
                >
                  2025
                </Button>
              </div>
              </div>
            </div>
            <h3>进规纳统</h3>
            <p>成长为规模以上企业</p>
            <div className={styles.departmentStages}>
              <div className={styles.stageTag}>
              2025年全市规上工业企业数
                <br />
                <div className={styles.stageTagNum}>4047家</div>
              </div>
              <div className={styles.stageTag}>
              2025年进规企业数
                <br />
                <div className={styles.stageTagNum}>455家</div>
              </div>
            </div>
          </div>

          {/* 产出效益 */}
          <div
            className={styles.stageCard}
            data-target="subIndustry"
            onClick={() => navigate('/tutorial/tou-chan-da-xiao/economic-detail')}
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
                  className={[styles.chartBtn, currentView2 === '2025' ? styles.active : ''].join(
                    ' ',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange2('2025');
                  }}
                >
                  2024
                </Button>
              </div>
            </div>
            <h3>产出效益</h3>
            <p>已竣工达产企业效益产出情况</p>
            <div className={styles.departmentStages}>
              <div className={styles.stageTag}>
                产值
                <br />
                <div className={styles.stageTagNum}>1076亿元</div>
              </div>
              <div className={styles.stageTag}>
                开票
                <br />
                <div className={styles.stageTagNum}>948亿元</div>
              </div>
              <div className={styles.stageTag}>
                营收
                <br />
                <div className={styles.stageTagNum}>1006亿元</div>
              </div>
              <div className={styles.stageTag}>
                利润
                <br />
                <div className={styles.stageTagNum}>99亿元</div>
              </div>
              <div className={styles.stageTag}>
                税收
                <br />
                <div className={styles.stageTagNum}>45亿元</div>
              </div>
            </div>
          </div>

          {/* 链群体系 */}
          <div
            className={styles.stageCard}
            data-target="subIndustry"
            onClick={() => navigate('/tutorial/tou-chan-da-xiao/chain-cluster-detail')}
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
                  className={[styles.chartBtn, currentView3 === '2025' ? styles.active : ''].join(
                    ' ',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange3('2025');
                  }}
                >
                  2025
                </Button>
              </div>
            </div>
            <h3>链群体系</h3>
            <p>"8+13+X"链群体系个性数据</p>
            <div className={styles.departmentStages}>
              <div className={styles.stageTag}>
                全市规上工业产值
                <br />
                <div className={styles.stageTagNum}>6173亿元</div>
              </div>
              <div className={styles.stageTag}>
                产业链群合计产值
                <br />
                <div className={styles.stageTagNum}> 5437亿元</div>
              </div>
              <div className={styles.stageTag}>
                占全市规上工业比重
                <br />
                <div className={styles.stageTagNum}>88%</div>
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

export default TouChanDaXiao;
