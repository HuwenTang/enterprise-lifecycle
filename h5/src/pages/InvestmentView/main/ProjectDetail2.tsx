import TopBarColor from "../../../components/TopBar/TopBarColor.tsx";
import {useEffect, useState} from "react";
import ProBasicInfo from "./Components/ProBasicInfo.tsx";
import PreInvestment from "./Components/PreInvestment.tsx";
import {primeApi} from "../../../api.ts";
import {useSearchParams} from "react-router-dom";
import MidTermPromotion from "./MidTermPromotion.tsx";
import EndTermService from "./EndTermService.tsx";
import dayjs from "dayjs";

export default function ProjectDetail2() {
    const [project, setProject] = useState<any>({})

    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const getAdvance = async () => {
        const data = await primeApi.getProjectImportantProvinceInfo({ id: id! })
        // console.log(data)
        setProject(data)
    }
    useEffect(()=>{
        console.log(id)
        getAdvance()

    },[])
    return (
        <div style={{
            height: '100vh',
            fontSize: '0.16rem',
            overflow: 'scroll',
            scrollbarWidth: 'none',
            backgroundColor: '#fff'
        }}>
            <TopBarColor color={'#60a9ff'} title={'项目详情'} time={false} />
            <div style={{padding: '0 0.2rem',}}>
                <div style={{backgroundColor: '#fff',}}>
                    <div style={{
                        padding: '0.1rem 0',
                        fontSize: '0.2rem',
                        fontWeight: 'bolder',
                        textAlign: 'center',
                    }}>
                        {project.projectName}
                    </div>
                    <div style={{
                        // margin: '0.1rem 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}>
                        {/*{*/}
                        {/*    tabList.map((item, index) => {*/}
                        {/*        return (*/}
                        {/*            <div key={index} style={{*/}
                        {/*                fontSize: '0.12rem',*/}
                        {/*                width: '23%',*/}
                        {/*                height: '0.32rem',*/}
                        {/*                borderRadius: '0.05rem',*/}
                        {/*                color: active === item.key ? '#fff' : '#666',*/}
                        {/*                backgroundColor: active === item.key ? '#337cfd' : '#eff4fd',*/}
                        {/*                display: 'flex',*/}
                        {/*                justifyContent: 'center',*/}
                        {/*                alignItems: 'center',*/}
                        {/*            }} onClick={() => {*/}
                        {/*                setActive(item.key)*/}
                        {/*            }}>*/}
                        {/*                {item.tab}*/}
                        {/*            </div>*/}
                        {/*        )*/}
                        {/*    })*/}
                        {/*}*/}
                    </div>
                    <div style={{fontSize: '0.12rem',}}>
                        <div style={{
                            padding: '0.1rem 0',
                            color: '#666',
                            width: '100%',
                            textAlign: 'center',
                            marginBottom: '0.2rem',
                        }}>
                            {/*更新日期：{dayjs().format('YYYY-MM-DD')}*/}
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{width: '30%', color: '#86909c'}}>
                                项目名称
                            </div>
                            <div style={{width: '70%', textAlign: 'right'}}>
                                {project.projectName}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{width: '30%', color: '#86909c'}}>
                                企业名称
                            </div>
                            <div style={{width: '70%', textAlign: 'right'}}>
                                {project.companyName}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{width: '35%', color: '#86909c'}}>
                                项目建设内容和规模
                            </div>
                            <div style={{width: '65%', textAlign: 'right'}}>
                                {project.constructionContentAndScale}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{width: '30%', color: '#86909c'}}>
                                所属板块
                            </div>
                            <div style={{width: '70%', textAlign: 'right'}}>
                                {project.sector}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                项目融资需求（万元）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.financingDemand}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '60%', color: '#86909c'}}>
                                到202X-1年底累计完成投资（万元）
                            </div>
                            <div style={{width: '40%', textAlign: 'right'}}>
                                {project.cumulativeInvestmentToPrevYear}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '60%', color: '#86909c'}}>
                                202X年计划投资（万元）
                            </div>
                            <div style={{width: '40%', textAlign: 'right'}}>
                                {project.plannedInvestmentCurrentYear}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '70%', color: '#86909c'}}>
                                预计新增经济效益-销售（万元）
                            </div>
                            <div style={{width: '30%', textAlign: 'right'}}>
                                {project.expectedSales}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '70%', color: '#86909c'}}>
                                预计新增经济效益-利润（万元）
                            </div>
                            <div style={{width: '30%', textAlign: 'right'}}>
                                {project.expectedProfit}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '70%', color: '#86909c'}}>
                                预计新增经济效益-税金（万元）
                            </div>
                            <div style={{width: '30%', textAlign: 'right'}}>
                                {project.expectedTax}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '70%', color: '#86909c'}}>
                                项目起止年月（起）
                            </div>
                            <div style={{width: '30%', textAlign: 'right'}}>
                                {dayjs(project.startDate).format('YYYY年MM月')}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '70%', color: '#86909c'}}>
                                项目起止年月（止）
                            </div>
                            <div style={{width: '30%', textAlign: 'right'}}>
                                {dayjs(project.endDate).format('YYYY年MM月')}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '40%', color: '#86909c'}}>
                                项目所属园区
                            </div>
                            <div style={{width: '60%', textAlign: 'right'}}>
                                {project.park}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '40%', color: '#86909c'}}>
                                项目阶段
                            </div>
                            <div style={{width: '60%', textAlign: 'right'}}>
                                {project.projectStage}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '40%', color: '#86909c'}}>
                                当年完成投资（万元）
                            </div>
                            <div style={{width: '60%', textAlign: 'right'}}>
                                {project.investmentCompletedCurrentYear}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '40%', color: '#86909c'}}>
                                项目形象进度
                            </div>
                            <div style={{width: '60%', textAlign: 'right'}}>
                                {project.projectProgress}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '40%', color: '#86909c'}}>
                                行业分类
                            </div>
                            <div style={{width: '60%', textAlign: 'right'}}>
                                {project.industryClassification}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
