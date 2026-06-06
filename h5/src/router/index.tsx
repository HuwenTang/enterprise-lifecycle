import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "../pages/Home.tsx";
import My from "../pages/My.tsx";
import SectorDetail from "../pages/SectorDetail.tsx";
import SectorMain from "../pages/Sector/SectorMain.tsx";
import Login from "../pages/Login.tsx";
import GdpView from "../pages/GdpView/GdpView.tsx";
import KeyEnterprisesSituation from "../pages/GdpView/KeyEnterprisesSituation/KeyEnterprisesSituation.tsx";
import KeyQutoa from "../pages/GdpView/KeyQutoa/KeyQutoa.tsx";
import KeyIndustryQutoa from "../pages/GdpView/KeyIndustryQutoa/KeyIndustryQutoa.tsx";
import KeyParkQutoa from "../pages/GdpView/KeyParkQutoa/KeyParkQutoa.tsx";
import TotalIndustryValue from "../pages/GdpView/TotalIndustryValue/TotalIndustryValue.tsx";
import TotalParkValue from "../pages/GdpView/TotalParkValue/TotalParkValue.tsx";
import TotalIndustryValue1 from "../pages/GdpView/TotalIndustryValue/TotalIndustryValue1.tsx";
import InvestmentView from "../pages/InvestmentView/InvestmentView.tsx";
import InvestProjectList from "../pages/InvestmentView/main/InvestProjectList.tsx";
import PushProjectList from "../pages/PushProjectList/PushProjectList.tsx";
import KeyQutoa1 from "../pages/GdpView/KeyQutoa/KeyQutoa1.tsx";
import TotalIndustryValue2 from "../pages/GdpView/TotalIndustryValue/TotalIndustryValue2.tsx";
import ProjectDetail from "../pages/InvestmentView/main/ProjectDetail.tsx";
import TopEconomy from "../pages/TopEconomy/TopEconomy.tsx";
import TopRate from "../pages/TopRate/TopRate.tsx";
import Electric from "../pages/Electric/Electric.tsx";
import RegionalGDP from "../pages/RegionalGDP/RegionalGDP.tsx";
import RegionalGDPDetail from "../pages/RegionalGDP/RegionalGDPDetail.tsx";
import Kesdetail from "../pages/GdpView/KeyEnterprisesSituation/kesdetail.tsx";
import ApproveDetail from "../pages/InvestmentView/main/ApproveDetail.tsx";
import ApproveProcess from "../pages/InvestmentView/main/ApproveProcess.tsx";
import ApproveDetail2 from "../pages/InvestmentView/main/ApproveDetail2.tsx";
import ApproveDetail3 from "../pages/InvestmentView/main/ApproveDetail3.tsx";
import ApproveProcess2 from "../pages/InvestmentView/main/ApproveProcess2.tsx";
import PushProjectList2 from "../pages/PushProjectList/PushProjectList2.tsx";
import ApproveDetail4 from "../pages/InvestmentView/main/ApproveDetail4.tsx";
import TopRateCom from "../pages/TopRate/TopRateCom.tsx";
import TopRateDept from "../pages/TopRate/TopRateDept.tsx";
import MainProject from "../pages/MainProject";
import InvestProject2 from "../pages/MainProject/InvestProject2";
import ProjectDetail2 from "../pages/InvestmentView/main/ProjectDetail2.tsx";
import MainProject2 from "../pages/MainProject/MainProject2.tsx";
import InvestProject3 from "../pages/MainProject/InvestProject3";
import ProjectDetail3 from "../pages/InvestmentView/main/ProjectDetail3.tsx";
import QualitativeState from "../pages/InvestmentView/main/QualitativeState.tsx";
import QualitativeEffect from "../pages/InvestmentView/main/QualitativeEffect.tsx";
import QaReport from "../pages/QaReport.tsx";
import SecondGdp from "../pages/SecondGdp";
import SecondGdpDetail from "../pages/SecondGdp/SecondGdpDetail.tsx";
import SecondGdpDetail1 from "../pages/SecondGdp/SecondGdpDetail1.tsx";
import GdpViewDetail from "../pages/GdpView/GdpViewDetail/GdpViewDetail.tsx";
import GdpViewDetail1 from "../pages/GdpView/GdpViewDetail/GdpViewDetail1.tsx";
import GdpViewDetail2 from "../pages/GdpView/GdpViewDetail/GdpViewDetail2.tsx";
import GdpViewDetail3 from "../pages/GdpView/GdpViewDetail/GdpViewDetail3.tsx";
import GdpViewDetail4 from "../pages/GdpView/GdpViewDetail/GdpViewDetail4.tsx";
import GdpViewDetail5 from "../pages/GdpView/GdpViewDetail/GdpViewDetail5.tsx";
import NewProInfo from "../pages/NewProInfo/NewProInfo.tsx";
import ProjectRecord from "../pages/ProjectRecord/ProjectRecord.tsx";
const ProjectAuditStatsPage = lazy(() => import("../pages/ProjectAuditStats/ProjectAuditStatsPage.tsx"));

function AuditStatsSuspenseFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        fontSize: "0.14rem",
        color: "#9ca3af",
      }}
    >
      页面加载中…
    </div>
  );
}
import ProjectStart from "../pages/ProjectStart/ProjectStart.tsx";
import ProjectStartDetail from "../pages/ProjectStart/ProjectStartDetail.tsx";
import ProjectEnd from "../pages/ProjectEnd/ProjectEnd.tsx";
import ProjectEndDetail from "../pages/ProjectEnd/ProjectEndDetail.tsx";
import Invoice from "../pages/TopEconomy/Invoice.tsx";
import SigningApproval from "../pages/SigningApproval/SigningApproval.tsx";
import QualitativeSigning from "../pages/InvestmentView/main/QualitativeSigning.tsx";
import TutorialPage from "../pages/TutorialPage";
import TouChanDaXiao from "../pages/TutorialPage/TouChanDaXiao";
import Preinvestment from "../pages/TutorialPage/PreInvestment";
import OverMillionProjects from "../pages/TutorialPage/PreInvestment/OverMillionProjects/index.tsx";
import ProjectProgress from "../pages/TutorialPage/PreInvestment/ProjectProgress/index.tsx";
import Fourfold from "../pages/TutorialPage/PreInvestment/Fourfold/index.tsx";
import ForeignInvestment from "../pages/TutorialPage/PreInvestment/ForeignInvestment/index.tsx";
import KeChuangXiangMu from "../pages/TutorialPage/KeChuangXiangMu/ScienceProject/index.tsx";
import KCXMProjectManage from "../pages/TutorialPage/KeChuangXiangMu/ProjectManage/InvestProjectList.tsx";
import QQZSProjectManage from "../pages/TutorialPage/PreInvestment/ProjectManage/InvestProjectList.tsx";
import GdpViewDetail6 from "../pages/GdpView/GdpViewDetail/GdpViewDetail6.tsx";
import ApproveProject from "../pages/TutorialPage/FilingReview/ApproveProject/index.tsx";
import AuditProject from "../pages/TutorialPage/FilingReview/AuditProject/index.tsx";
import ChainDetail from "../pages/TutorialPage/FilingReview/ChainDetail/index.tsx";
import LandDetail from "../pages/TutorialPage/FilingReview/LandDetail/index.tsx";
import ProjectUnderConstruction from "../pages/TutorialPage/TouZiJinDu/ProjectUnderConstruction/index.tsx";
import PortfolioInvestment from "../pages/TutorialPage/TouZiJinDu/PortfolioInvestment/index.tsx";
import InvestmentCompletionRate from "../pages/TutorialPage/TouZiJinDu/InvestmentCompletionRate/index.tsx";
import ChainClusterSystem from "../pages/TutorialPage/TouZiJinDu/ChainClusterSystem/index.tsx";
import ChainClusterDetail from "../pages/TutorialPage/TouChanDaXiao/ChainClusterDetail/index.tsx";
import ComplianceDetail from "../pages/TutorialPage/TouChanDaXiao/ComplianceDetail/index.tsx";
import EconomicDetail from "../pages/TutorialPage/TouChanDaXiao/EconomicDetail/index.tsx";
import MyProject from "../pages/MyProject/index.tsx";
import DragonTigerIndex from "../pages/DragonTiger/index.tsx";
import DragonTigerFixedInvestment from "../pages/DragonTiger/l1.tsx";
import DragonTigerProjectPhases from "../pages/DragonTiger/l3.tsx";
import DragonTigerFourNewEnterprises from "../pages/DragonTiger/l4.tsx";
import DragonTigerKeyProjects from "../pages/DragonTiger/l2.tsx";


const router = createBrowserRouter([
    {
        path: "/home",
        element: <Home />
    }, {
        path: "/my",
        element: <My />
    }, {
        path: "/sectordetail",
        element: <SectorDetail />
    }, {
        path: "/sectorMain",
        element: <SectorMain />
    }, {
        path: "/",
        element: <Login />
    },
    {
        path: "/gdp-view",
        element: <GdpView />,
    },
    {
        path: "/gdp-view-detail",
        element: <GdpViewDetail />,
    },
    {
        path: "/gdp-view-detail1",
        element: <GdpViewDetail1 />,
    }, {
        path: "/gdp-view-detail2",
        element: <GdpViewDetail2 />,
    }, {
        path: "/gdp-view-detail3",
        element: <GdpViewDetail3 />,
    }, {
        path: "/gdp-view-detail4",
        element: <GdpViewDetail4 />,
    }, {
        path: "/gdp-view-detail5",
        element: <GdpViewDetail5 />,
    }, {
        path: "/gdp-view-detail6",
        element: <GdpViewDetail6 />,
    },
    {
        path: "/GdpView/KeyEnterprisesSituation",
        element: <KeyEnterprisesSituation />
    }, {
        path: "/GdpView/KeyQutoa",
        element: <KeyQutoa />
    }, {
        path: "/GdpView/KeyQutoa1",
        element: <KeyQutoa1 />
    },
    {
        path: "/GdpView/KeyIndustryQutoa",
        element: <KeyIndustryQutoa />
    }, {
        path: "/GdpView/KeyParkQutoa",
        element: <KeyParkQutoa />
    }, {
        path: "/GdpView/TotalIndustryValue",
        element: <TotalIndustryValue />
    }, {
        path: "/GdpView/TotalIndustryValue1",
        element: <TotalIndustryValue1 />
    }, {
        path: "/GdpView/TotalIndustryValue2",
        element: <TotalIndustryValue2 />
    },
    {
        path: "/GdpView/TotalParkValue",
        element: <TotalParkValue />
    }, {
        path: "/InvestmentView/InvestmentView",
        element: <InvestmentView />
    }, {
        path: "/InvestmentView/InvestProjectList",
        element: <InvestProjectList />
    }, {
        path: "/invest-project2",
        element: <InvestProject2 />
    }, {
        path: "/invest-project3",
        element: <InvestProject3 />
    },

    {
        path: "/PushProjectList",
        element: <PushProjectList />
    }, {
        path: "/PushProjectList2",
        element: <PushProjectList2 />
    },
    {
        path: "/InvestmentView/ProjectDetail",
        element: <ProjectDetail />
    }, {
        path: "/project-detail2",
        element: <ProjectDetail2 />
    }, {
        path: "/project-detail3",
        element: <ProjectDetail3 />
    },
    {
        path: "/TopEconomy",
        element: <TopEconomy />
    },
    {
        path: "/main-project",
        element: <MainProject />
    }, {
        path: "/main-project2",
        element: <MainProject2 />
    },
    {
        path: "/TopRate",
        element: <TopRate />
    }, {
        path: "/TopRateCom",
        element: <TopRateCom />
    }, {
        path: "/TopRateDept",
        element: <TopRateDept />
    },

    {
        path: "/Electric",
        element: <Electric />
    }, {
        path: "/RegionalGDP",
        element: <RegionalGDP />
    }, {
        path: "/RegionalGDPDetail",
        element: <RegionalGDPDetail />
    }, {
        path: "/kesdetail",
        element: <Kesdetail />
    }, {
        path: "/ApproveDetail",
        element: <ApproveDetail />
    },
    {
        path: "/ApproveProcess",
        element: <ApproveProcess />
    }, {
        path: "/ApproveProcess2",
        element: <ApproveProcess2 />
    },
    {
        path: "/ApproveDetail2",
        element: <ApproveDetail2 />
    }, {
        path: "/ApproveDetail3",
        element: <ApproveDetail3 />
    }, {
        path: "/ApproveDetail4",
        element: <ApproveDetail4 />
    }, {
        path: "/qualitative-state",
        element: <QualitativeState />
    }, {
        path: "/qualitative-effect",
        element: <QualitativeEffect />
    }, {
        path: "/qa-report",
        element: <QaReport />
    },
    {
        path: "/home",
        element: <Home />
    }, {
        path: "/my",
        element: <My />
    }, {
        path: "/sectordetail",
        element: <SectorDetail />
    }, {
        path: "/sectorMain",
        element: <SectorMain />
    }, {
        path: "/",
        element: <Login />
    }, {
        path: "/gdp-view",
        element: <GdpView />,
    }, {
        path: "/GdpView/KeyEnterprisesSituation",
        element: <KeyEnterprisesSituation />
    }, {
        path: "/GdpView/KeyQutoa",
        element: <KeyQutoa />
    }, {
        path: "/GdpView/KeyQutoa1",
        element: <KeyQutoa1 />
    },
    {
        path: "/GdpView/KeyIndustryQutoa",
        element: <KeyIndustryQutoa />
    }, {
        path: "/GdpView/KeyParkQutoa",
        element: <KeyParkQutoa />
    }, {
        path: "/GdpView/TotalIndustryValue",
        element: <TotalIndustryValue />
    }, {
        path: "/GdpView/TotalIndustryValue1",
        element: <TotalIndustryValue1 />
    }, {
        path: "/GdpView/TotalIndustryValue2",
        element: <TotalIndustryValue2 />
    },
    {
        path: "/GdpView/TotalParkValue",
        element: <TotalParkValue />
    }, {
        path: "/InvestmentView/InvestmentView",
        element: <InvestmentView />
    }, {
        path: "/InvestmentView/InvestProjectList",
        element: <InvestProjectList />
    }, {
        path: "/invest-project2",
        element: <InvestProject2 />
    }, {
        path: "/invest-project3",
        element: <InvestProject3 />
    },

    {
        path: "/PushProjectList",
        element: <PushProjectList />
    }, {
        path: "/PushProjectList2",
        element: <PushProjectList2 />
    },
    {
        path: "/InvestmentView/ProjectDetail",
        element: <ProjectDetail />
    }, {
        path: "/project-detail2",
        element: <ProjectDetail2 />
    }, {
        path: "/project-detail3",
        element: <ProjectDetail3 />
    },
    {
        path: "/TopEconomy",
        element: <TopEconomy />
    },
    {
        path: "/invoice",
        element: <Invoice />
    },
    {
        path: "/signing-approval",
        element: <SigningApproval />
    },
    {
        path: "/qualitative-signing",
        element: <QualitativeSigning />
    },
    {
        path: "/main-project",
        element: <MainProject />
    }, {
        path: "/main-project2",
        element: <MainProject2 />
    },
    {
        path: "/TopRate",
        element: <TopRate />
    }, {
        path: "/TopRateCom",
        element: <TopRateCom />
    }, {
        path: "/TopRateDept",
        element: <TopRateDept />
    },
    {
        path: "/Electric",
        element: <Electric />
    }, {
        path: "/RegionalGDP",
        element: <RegionalGDP />
    }, {
        path: "/RegionalGDPDetail",
        element: <RegionalGDPDetail />
    }, {
        path: "/kesdetail",
        element: <Kesdetail />
    }, {
        path: "/ApproveDetail",
        element: <ApproveDetail />
    },
    {
        path: "/ApproveProcess",
        element: <ApproveProcess />
    }, {
        path: "/ApproveProcess2",
        element: <ApproveProcess2 />
    },
    {
        path: "/ApproveDetail2",
        element: <ApproveDetail2 />
    }, {
        path: "/ApproveDetail3",
        element: <ApproveDetail3 />
    }, {
        path: "/ApproveDetail4",
        element: <ApproveDetail4 />
    }, {
        path: "/qualitative-state",
        element: <QualitativeState />
    }, {
        path: "/qualitative-effect",
        element: <QualitativeEffect />
    }, {
        path: "/qa-report",
        element: <QaReport />
    }, {
        path: '/second-gdp',
        element: <SecondGdp />
    }, {
        path: '/second-gdp-detail',
        element: <SecondGdpDetail />
    }, {
        path: '/second-gdp-detail1',
        element: <SecondGdpDetail1 />
    }, {
        path: '/new-pro-info',
        element: <NewProInfo />
    }, {
        path: "/audit-stats/:slug",
        element: (
            <Suspense fallback={<AuditStatsSuspenseFallback />}>
                <ProjectAuditStatsPage />
            </Suspense>
        ),
    }, {
        path: '/pro-record',
        element: <ProjectRecord />
    }, {
        path: "/pro-start",
        element: <ProjectStart />
    }, {
        path: "/pro-start/pro-start-detail",
        element: <ProjectStartDetail />
    }, {
        path: "/pro-end",
        element: <ProjectEnd />
    }, {
        path: "/pro-end/pro-end-detail",
        element: <ProjectEndDetail />
    }
    , { path: '/tutorial', element: <TutorialPage /> }
    , { path: '/tutorial/preinvestment', element: <Preinvestment /> }
    , { path: '/tutorial/preinvestment/InvestProjectList', element: <QQZSProjectManage /> }
    , { path: '/tutorial/over-million-projects', element: <OverMillionProjects /> }
    , { path: '/tutorial/project-progress', element: <ProjectProgress /> }
    , { path: '/tutorial/fourfold', element: <Fourfold /> }
    , { path: '/tutorial/foreign-investment', element: <ForeignInvestment /> }
    , { path: '/tutorial/tou-chan-da-xiao', element: <TouChanDaXiao /> }
    , { path: '/tutorial/ke-chuang-xiang-mu', element: <KeChuangXiangMu /> }
    , { path: '/tutorial/ke-chuang-xiang-mu/project-manage', element: <KCXMProjectManage /> }
    , { path: '/tutorial/approve-project', element: <ApproveProject /> }
    , { path: '/tutorial/audit-project', element: <AuditProject /> }
    , { path: '/tutorial/chain-detail', element: <ChainDetail /> }
    , { path: '/tutorial/land-detail', element: <LandDetail /> }
    , { path: '/tutorial/project-under-construction', element: <ProjectUnderConstruction /> }
    , { path: '/tutorial/portfolio-investment', element: <PortfolioInvestment /> }
    , { path: '/tutorial/investment-completion-rate', element: <InvestmentCompletionRate /> }
    , { path: '/tutorial/chain-cluster-system', element: <ChainClusterSystem /> }
    , { path: '/tutorial/chain-cluster-detail', element: <ChainClusterDetail /> }
    , { path: '/tutorial/compliance-detail', element: <ComplianceDetail /> }
    , { path: '/tutorial/economic-detail', element: <EconomicDetail /> }
    , { path: '/my-project', element: <MyProject />}
    , { path: '/dragon-tiger', element: <DragonTigerIndex /> }
    , { path: '/dragon-tiger/fixed-investment', element: <DragonTigerFixedInvestment /> }
    , { path: '/dragon-tiger/key-projects', element: <DragonTigerKeyProjects /> }
    , { path: '/dragon-tiger/project-phases', element: <DragonTigerProjectPhases /> }
    , { path: '/dragon-tiger/four-new-enterprises', element: <DragonTigerFourNewEnterprises /> }
])

export default router;
