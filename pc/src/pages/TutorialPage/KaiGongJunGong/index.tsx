import { ArrowLeftOutlined, FundFilled,HomeOutlined } from '@ant-design/icons';
import { Button, Table,Breadcrumb } from 'antd';
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import {primeApi} from "@/services/api";
import {ProjectFagaiKeyProjectsStatsMergedVo} from "@/services/apis";

const TutorialPage: React.FC = () => {
  const navigate = useNavigate();
  const [showSubProject, setShowSubProject] = useState(false);

  const goBack = () => {
    navigate(-1);
  };

  const handleStageClick = (stage: string) => {
    // 点击卡片时显示子项目页面
    setShowSubProject(true);
  };

  const [dataSource, setDataSource] = useState<ProjectFagaiKeyProjectsStatsMergedVo[]>()
  const getMergedProjectFagaiKeyProjectsStats = async (selectedType?: number) => {
    try {
      // 使用primeApi的getMergedProjectFagaiKeyProjectsStats接口获取开工项目数据
      const data = await primeApi.getMergedProjectFagaiKeyProjectsStats({
        status: 1, // 开工项目状态
        type: selectedType || 2, // 使用传入的类型或默认为1
      });
      setDataSource([data]);
    } catch (e) {
      console.error('获取开工项目数据失败:', e);
      // 出错时使用模拟数据
      setDataSource([]);
    }
  };


  const [dataSource1, setDataSource1] = useState<ProjectFagaiKeyProjectsStatsMergedVo[]>()
  const getMergedProjectFagaiKeyProjectsStats1 = async (selectedType?: number) => {
    try {
      // 使用primeApi的getMergedProjectFagaiKeyProjectsStats接口获取开工项目数据
      const data = await primeApi.getMergedProjectFagaiKeyProjectsStats({
        status: 3, // 开工项目状态
        type: selectedType || 2, // 使用传入的类型或默认为1
      });
      setDataSource1([data]);
    } catch (e) {
      console.error('获取开工项目数据失败:', e);
      // 出错时使用模拟数据
      setDataSource1([]);
    }
  };
  const [dataSource2, setDataSource2] = useState<ProjectFagaiKeyProjectsStatsMergedVo[]>()

  const getMergedProjectFagaiKeyProjectsStats3 = async (selectedType?: number) => {
    try {
      // 使用primeApi的getMergedProjectFagaiKeyProjectsStats接口获取开工项目数据
      const data = await primeApi.getMergedProjectFagaiKeyProjectsStats({
        status: 2, // 开工项目状态
        type: selectedType || 2, // 使用传入的类型或默认为1
      });
      setDataSource2([data]);
    } catch (e) {
      console.error('获取开工项目数据失败:', e);
      // 出错时使用模拟数据
      setDataSource2([]);
    }
  };


  // 完成投资表格数据
  const investmentData = [
    {
      key: '1',
      city: "高新区",
      park: "科技创新园",
      industrialChain: "电子信息",
      completedProjects: 8,
      contractAmount: 45200,
      contractPercentage: 22.5,
      completedInvestment: 38420,
      fixedAssets: 32150,
      completionRate: 85.0,
      total: 76620
    },
    {
      key: '2',
      city: "高新区",
      park: "科技创新园",
      industrialChain: "人工智能",
      completedProjects: 5,
      contractAmount: 28500,
      contractPercentage: 14.2,
      completedInvestment: 24225,
      fixedAssets: 20500,
      completionRate: 85.0,
      total: 52725
    },
    {
      key: '3',
      city: "高新区",
      park: "智能制造园",
      industrialChain: "高端装备",
      completedProjects: 6,
      contractAmount: 52800,
      contractPercentage: 26.3,
      completedInvestment: 48576,
      fixedAssets: 40320,
      completionRate: 92.0,
      total: 101376
    },
    {
      key: '4',
      city: "高新区",
      park: "智能制造园",
      industrialChain: "机器人",
      completedProjects: 4,
      contractAmount: 31200,
      contractPercentage: 15.5,
      completedInvestment: 28704,
      fixedAssets: 24000,
      completionRate: 92.0,
      total: 59904
    }
  ];

  // 表格列定义
  const columns = [
    {
      title: '市（区）',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '园区',
      dataIndex: 'park',
      key: 'park',
    },
    {
      title: '产业链群',
      dataIndex: 'industrialChain',
      key: 'industrialChain',
    },
    {
      title: '已完成项目数',
      dataIndex: 'completedProjects',
      key: 'completedProjects',
    },
    {
      title: '合同额（万元）',
      dataIndex: 'contractAmount',
      key: 'contractAmount',
    },
    {
      title: '占比（%）',
      dataIndex: 'contractPercentage',
      key: 'contractPercentage',
    },
    {
      title: '已完成投资（万元）',
      dataIndex: 'completedInvestment',
      key: 'completedInvestment',
    },
    {
      title: '其中：固定资产（万元）',
      dataIndex: 'fixedAssets',
      key: 'fixedAssets',
    },
    {
      title: '完成率（%）',
      dataIndex: 'completionRate',
      key: 'completionRate',
    },
    {
      title: '合计',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  useEffect(() => {
    getMergedProjectFagaiKeyProjectsStats()
    getMergedProjectFagaiKeyProjectsStats1()
    getMergedProjectFagaiKeyProjectsStats3()
  }, []);
  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <Button className={styles.backBtn} onClick={() => goBack()}>
          <ArrowLeftOutlined />
          返回
        </Button>
        
        {!showSubProject ? (
          // 主页面
          <>
            <h1 className={styles.pageTitle}>开工竣工</h1>
            <p className={styles.pageSubtitle}>负责推进项目开工、建设和竣工验收等工作</p>

            <div className={styles.stageDashboard}>
              <div
                className={`${styles.stageCard}`}
                data-target="subProject"
                onClick={() => navigate('/tutorial/tou-chan-da-xiao/start-work-detail')}
              >
                <div className={styles.stageHeader}>
                  <div
                    className={styles.stageIcon}
                    style={{ background: 'linear-gradient(135deg, #3498db, #2c80ff)' }}
                  >
                    <FundFilled />
                  </div>
                </div>
                <h3>项目开工</h3>
                <p>全市重点项目开工情况</p>
                <div className={styles.departmentStages}>
                  <div className={styles.stageTag}>
                    市级重点项目数
                    <br />

                    <div className={styles.stageTagNum}>{dataSource?.[0]?.projectCountTotal1}个</div>
                  </div>
                  <div className={styles.stageTag}>
                    亿元项目数
                    <br />
                    <div className={styles.stageTagNum}>{dataSource?.[0]?.projectCountTotal2}个</div>
                  </div>
                </div>
              </div>

              <div
                className={`${styles.stageCard}`}
                data-target="subProject"
                onClick={() => navigate('/tutorial/tou-chan-da-xiao/do-work-detail')}
              >
                <div className={styles.stageHeader}>
                  <div
                    className={styles.stageIcon}
                    style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}
                  >
                    <FundFilled />
                  </div>
                </div>
                <h3>在建项目</h3>
                <p>全市重点项目建设进度</p>
                <div className={styles.departmentStages}>
                  <div className={styles.stageTag}>
                    市级重点项目数
                    <br />
                    <div className={styles.stageTagNum}>{dataSource1?.[0]?.projectCountTotal1}个</div>
                  </div>
                  <div className={styles.stageTag}>
                    亿元项目数
                    <br />
                    <div className={styles.stageTagNum}>{dataSource1?.[0]?.projectCountTotal2}个</div>
                  </div>
                </div>
              </div>

              <div
                className={`${styles.stageCard}`}
                data-target="subProject"
                onClick={() => navigate('/tutorial/tou-chan-da-xiao/end-work-detail')}
              >
                <div className={styles.stageHeader}>
                  <div
                    className={styles.stageIcon}
                    style={{ background: 'linear-gradient(135deg, #f39c12, #e67e22)' }}
                  >
                    <FundFilled />
                  </div>
                </div>
                <h3>项目竣工</h3>
                <p>全市重点项目竣工验收情况</p>
                <div className={styles.departmentStages}>
                  <div className={styles.stageTag}>
                    市级重点项目数
                    <br />
                    <div className={styles.stageTagNum}>{dataSource2?.[0]?.projectCountTotal1}个</div>
                  </div>
                  <div className={styles.stageTag}>
                    投资完成率
                    <br />
                    <div className={styles.stageTagNum}>{dataSource2?.[0]?.ratio1?dataSource2?.[0]?.ratio1*100:0}%</div>
                  </div>
                  <div className={styles.stageTag}>
                    亿元项目数
                    <br />
                    <div className={styles.stageTagNum}>{dataSource2?.[0]?.ratio2?dataSource2?.[0]?.ratio2*100:0}个</div>
                  </div>

                  <div className={styles.stageTag}>
                    投资完成率
                    <br />
                    <div className={styles.stageTagNum}>96%</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // 子项目页面（完成投资表）
          <>
            <h1 className={styles.pageTitle}>完成投资表</h1>
            <div className={styles.tableContainer}>
              <Table
                columns={columns}
                dataSource={investmentData}
                rowKey="key"
                pagination={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TutorialPage;
