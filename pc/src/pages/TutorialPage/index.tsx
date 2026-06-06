import { Button } from 'antd';
import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const TutorialPage: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/`);
  };

  const handleDepartmentClick = (department: string) => {
    console.log(`点击了${department}部门`);

    // 根据不同部门跳转到对应页面
    switch (department) {
      case '开工竣工':
        navigate('/tutorial/tou-zi-jin-du');
        // navigate('/tutorial/kaigong-jungong');
        break;
      case '前期招商':
        navigate(`/tutorial/preinvestment`);
        break;
      case '备案审批':
        navigate(`/tutorial/record-approval`);
        // navigate(`/tutorial/record-approval/detail/remark-datail`);
        break;
      case '科创项目':
        navigate(`/tutorial/ke-chuang-xiang-mu`);
        break;
      case '投产达效':
        navigate('/tutorial/tou-chan-da-xiao');
        break;
      default:
        console.log('未知部门');
    }
  };
  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}></div>
            <div className={styles.logoText}>
              <h1>欢迎进入项目管理平台</h1>
              <p>Welcome to the full life cycle of the project</p>
            </div>
          </div>

          <Button className={styles.backBtn} onClick={() => goBack()}>
            返回上一页
          </Button>
        </header>

        <div className={styles.dashboard}>
          <div
            className={`${styles.departmentCard} ${styles.bgCommerce}`}
            onClick={() => handleDepartmentClick('前期招商')}
          >
            <div className={styles.departmentHeader}>
              <div className={styles.departmentIcon}></div>
            </div>
            <h3>前期招商</h3>
            <p>围绕招商引资、项目洽谈签约进行管理服务，推动区域发展和产业升级</p>
            <div className={styles.departmentStages}>
              <div className={styles.stageTag}>在谈项目</div>
              <div className={styles.stageTag}>签约项目</div>
            </div>
          </div>

          <div
            className={`${styles.departmentCard} ${styles.bgDevelopment}`}
            onClick={() => handleDepartmentClick('备案审批')}
          >
            <div className={styles.departmentHeader}>
              <div className={styles.departmentIcon}></div>
            </div>
            <h3>备案审批</h3>
            <p>跟踪服务项目备案、手续办理和审批进展情况，全力打造一流营商环境</p>
            <div className={styles.departmentStages}>
              <div className={styles.stageTag}>项目备案</div>
              <div className={styles.stageTag}>审批进展</div>
            </div>
          </div>

          <div
            className={`${styles.departmentCard} ${styles.bgData}`}
            onClick={() => handleDepartmentClick('开工竣工')}
          >
            <div className={styles.departmentHeader}>
              <div className={styles.departmentIcon}></div>
            </div>
            <h3>投资进度</h3>
            <p>跟踪推进项目建设进展、统计入库和投资完成率，加快形成更多有效投资</p>
            <div className={styles.departmentStages}>
              <div className={styles.stageTag}>在建项目</div>
              <div className={styles.stageTag}>列统投资</div>
            </div>
          </div>

          <div
            className={`${styles.departmentCard} ${styles.bgIndustry}`}
            onClick={() => handleDepartmentClick('投产达效')}
          >
            <div className={styles.departmentHeader}>
              <div className={styles.departmentIcon}></div>
            </div>
            <h3>投产达效</h3>
            <p>汇聚竣工项目生产、经营、效益等信息，涵盖进规纳统、产出效益、链群体系</p>
            <div className={styles.departmentStages}>
              <div className={styles.stageTag}>达产达效</div>
            </div>
          </div>

          {/*<div*/}
          {/*  className={`${styles.departmentCard} ${styles.bgScience}`}*/}
          {/*  onClick={() => handleDepartmentClick('科创项目')}*/}
          {/*>*/}
          {/*  <div className={styles.departmentHeader}>*/}
          {/*    <div className={styles.departmentIcon}></div>*/}
          {/*  </div>*/}
          {/*  <h3>科创项目</h3>*/}
          {/*  <p>负责企业开工建设、竣工投产和运行监管，促进工业经济高质量发展</p>*/}
          {/*  <div className={styles.departmentStages}>*/}
          {/*    <div className={styles.stageTag}>科创项目</div>*/}
          {/*  </div>*/}
          {/*</div>*/}

        </div>
      </div>
    </div>
  );
};

export default TutorialPage;
