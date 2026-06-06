import TopBarColor from "../../../components/TopBar/TopBarColor.tsx";
import {useEffect, useState} from "react";
import {primeApi} from "../../../api.ts";
import {useSearchParams} from "react-router-dom";
import dayjs from "dayjs";

export default function ProjectDetail3() {
    const [project, setProject] = useState<any>({})

    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const getAdvance = async () => {
        const data = await primeApi.getProjectCompletedInfo({ id: id! })
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
                            <div style={{width: '30%', color: '#86909c'}}>
                                统一信用代码

                            </div>
                            <div style={{width: '70%', textAlign: 'right'}}>
                                {project.unifiedCreditCode}
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
                        }}>
                            <div style={{width: '35%', color: '#86909c'}}>
                                建设规模及主要内容
                            </div>
                            <div style={{width: '65%', textAlign: 'right'}}>
                                {project.constructionScaleAndMainContent}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{width: '30%', color: '#86909c'}}>
                                建设性质
                            </div>
                            <div style={{width: '70%', textAlign: 'right'}}>
                                {project.constructionNature}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{width: '30%', color: '#86909c'}}>
                                开工时间

                            </div>
                            <div style={{width: '70%', textAlign: 'right'}}>
                                {project.commencementTime?dayjs(project.commencementTime).format('YYYY月MM日DD'):''}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{width: '30%', color: '#86909c'}}>
                                竣工时间
                            </div>
                            <div style={{width: '70%', textAlign: 'right'}}>
                                {project.completionTime?dayjs(project.completionTime).format('YYYY月MM日DD'):''}
                            </div>
                        </div>


                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                计划总投资内资（万元）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.plannedTotalInvestmentDomestic}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                计划总投资外资（万元）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.plannedTotalInvestmentForeign}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                实际完成投资内资（万元）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.actualCompletionInvestmentDomestic}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                实际完成投资外资（万元）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.actualCompletionInvestmentForeign}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                行业分类
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.industryClassification}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                计划固定资产投资（万元）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.plannedFixedAssetInvestment}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                固定资产投资占比
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.fixedAssetInvestmentRatio}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                实际固定资产投资（万元）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.actualFixedAssetInvestment}
                            </div>
                        </div>


                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                拟用地面积（亩）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.proposedLandArea}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                实际用地面积（亩）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.actualLandArea}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                拟租厂房面积（平方米）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.proposedRentalFactoryArea}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                实际租厂房面积（平方米）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.actualRentalFactoryArea}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                拟购厂房面积（平方米）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.proposedPurchaseFactoryArea}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                实际购厂房面积（平方米）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.actualPurchaseFactoryArea}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                预期用工人数（人）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.expectedEmploymentNumbers}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                实际用工人数（人）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.actualEmploymentNumbers}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                预计新增经济效益-销售（万元）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.expectedNewEconomicBenefitsSales}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                实际新增经济效益-销售（万元）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.actualNewEconomicBenefitsSales}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                预计新增经济效益-利润（万元）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.expectedNewEconomicBenefitsProfit}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                实际新增经济效益-利润（万元）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.actualNewEconomicBenefitsProfit}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                预计新增经济效益-税金（万元）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.expectedNewEconomicBenefitsTax}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                实际新增经济效益-税金（万元）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.actualNewEconomicBenefitsTax}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                亩均税收（万元/千平方米）
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.taxPerMu}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                计划进归时间
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.plannedEntryTime?dayjs(project.plannedEntryTime).format('YYYY月MM日DD'):''}
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                实际进归时间

                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.actualEntryTime?dayjs(project.actualEntryTime).format('YYYY月MM日DD'):''}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
