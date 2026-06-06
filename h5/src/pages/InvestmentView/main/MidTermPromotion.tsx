import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {primeApi} from "../../../api.ts";

export default function MidTermPromotion({project,project1,project2}: { project: any ,project1:any,project2:any}) {
    const [active, setActive] = useState('1')
    const [active3, setActive3] = useState('1')
    const tabList = [
        {
            key: '1',
            tab: '基本信息',
        },
        {
            key: '2',
            tab: '详细信息',
        }
    ]
    const tabList1 = [
        {
            key: '1',
            tab: '项目信息',
        },
        {
            key: '2',
            tab: '其他信息',
        }
    ]
    const [active2, setActive2] = useState('1')
    const navigator = useNavigate()
    const [total, setTotal] = useState(0)
    const [count, setCount] = useState(0)
    const gonggaiList = [
        '立项审批','工程建设','施工许可','竣工验收'
    ]
    const [gonggai, setGonggai] = useState('-')
    const [process, setProcess] = useState(0)
    const progressCount =async ()=>{
        const data = await primeApi.progressCount({onlineApprovalId: project.onlineApprovalId})
        console.log(data)
        setTotal(data.total)
        setCount(data.completed)
    }
    const getStage =async ()=>{
        const data =await primeApi.getStage({code: project.onlineApprovalId})
        console.log('getStage',data.value)
        setProcess(data.value)
        setGonggai(gonggaiList[data.value-1])
    }

    useEffect(() => {
        progressCount()
        getStage()
    }, []);
    return (
        <div style={{
            marginTop: '0.2rem',
            fontSize: '0.12rem',
            overflow: 'auto',
            // height: '50vh',
        }}>
            <div style={{
                padding: '0.1rem 0',
                color: '#666',
                width: '100%',
                textAlign: 'center',
                marginBottom: '0.2rem',
            }}>
                更新日期：{dayjs().format('YYYY-MM-DD')}
            </div>
            <div style={{}}>
                <div style={{
                    margin: '0.1rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div onClick={() => setActive2('1')} style={{
                        fontSize: '0.12rem',
                        width: '30%',
                        height: '0.32rem',
                        borderRadius: '0.05rem',
                        color: active2 === '1' ? '#fff' : '#666',
                        backgroundColor: active2 === '1' ? '#337cfd' : '#eff4fd',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>注册
                    </div>
                    <div onClick={() => setActive2('2')} style={{
                        fontSize: '0.12rem',
                        width: '30%',
                        height: '0.32rem',
                        borderRadius: '0.05rem',
                        color: active2 === '2' ? '#fff' : '#666',
                        backgroundColor: active2 === '2' ? '#337cfd' : '#eff4fd',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>备案
                    </div>
                    <div onClick={() => setActive2('3')} style={{
                        fontSize: '0.12rem',
                        width: '30%',
                        height: '0.32rem',
                        borderRadius: '0.05rem',
                        color: active2 === '3' ? '#fff' : '#666',
                        backgroundColor: active2 === '3' ? '#337cfd' : '#eff4fd',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>报批
                    </div>
                </div>
                {
                    active2 === '1' && <div>
                        <div style={{
                            padding: '0 0.2rem',
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                统一社会信用代码证 ：
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.uscc}
                            </div>
                        </div>
                        <div style={{
                            padding: '0 0.2rem',
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                注册公司名称 ：
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.companyName}
                            </div>
                        </div>
                        <div style={{
                            padding: '0 0.2rem',
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                注册资金（亿元） ：
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.companyRegistrationFunds}
                            </div>
                        </div>

                        <div style={{
                            padding: '0 0.2rem',
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                注册日期 ：
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project.companyRegistrationDate?dayjs(project.companyRegistrationDate).format('YYYY-MM-DD'):''}
                            </div>
                        </div>
                    </div>
                }

                {
                    active2 === '2' && <div>
                        <div onClick={() => {
                            navigator(`/ApproveDetail?count=${count}&total=${total}&id=${project.onlineApprovalId}`)
                            }
                        } style={{
                            backgroundImage:  `url(/img/InvestmentView/beian.png)`,
                            backgroundSize: '100% 100%',
                            height: '0.4rem',
                            lineHeight: '0.4rem',
                            paddingLeft: '0.5rem',
                            fontWeight: 'bold',
                            color:'#1f337c',
                            fontSize: '0.14 rem',
                        }}>
                            在线审批进度：{count}/{total}
                        </div>

                        <div style={{
                            margin: '0.1rem 0',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            {
                                tabList.map((item, index) => {
                                    return (
                                        <div key={index} style={{
                                            fontSize: '0.12rem',
                                            width: '49%',
                                            height: '0.32rem',
                                            borderRadius: '0.05rem',
                                            color: active === item.key ? '#fff' : '#666',
                                            backgroundColor: active === item.key ? '#337cfd' : '#eff4fd',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }} onClick={() => {
                                            setActive(item.key)
                                        }}>
                                            {item.tab}
                                        </div>
                                    )
                                })
                            }
                        </div>

                        {
                            active === '1' && <>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        备案（核准）项目名称：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project.filingApprovalProjectName}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '65%', color: '#86909c'}}>
                                        备案（核准）投资总额（亿元）：
                                    </div>
                                    <div style={{width: '35%', textAlign: 'right'}}>
                                        {project.filingApprovalInvestmentTotal}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        备案（核准）日期：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project?.filingApprovalDate && dayjs(project?.filingApprovalDate).format('YYYY-MM-DD')}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        项目审批类型：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.approvalType}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '40%', color: '#86909c'}}>
                                        备案目录 ：
                                    </div>
                                    <div style={{width: '60%', textAlign: 'right'}}>
                                        {project1.filingCatalog}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        项目名称 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project.projectName}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        主项目名称 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project.mainProjectName}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        是否补办项目 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.isSupplementaryProject}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        项目代码 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.projectCode}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        申报时间 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.applicationTime ? dayjs(project1.applicationTime).format('YYYY-MM-DD HH:mm:ss') : ''}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        审核备类型 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.reviewFilingType}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        备案目录分类 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.filingCatalogCategory}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        项目类型 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.projectType}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        建设性质 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.constructionNature}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        项目属性 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.projectAttributes}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        拟开工时间（年） ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.plannedStartYear}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        拟建成时间（年） ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.plannedEndYear}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        国标行业 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.nationalIndustryStandard}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        国标行业代码 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.nationalIndustryCode}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        管理行业 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.managementIndustry}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        建设地点 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.constructionLocation}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '45%', color: '#86909c'}}>
                                        建设规模及内容 ：
                                    </div>
                                    <div style={{width: '55%', textAlign: 'right'}}>
                                        {project1.constructionScaleAndContent}
                                    </div>
                                </div>
                            </>
                        }
                        {
                            active === '2' && <>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        总投资（万元）：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.totalInvestment}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        总投资说明：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.totalInvestmentDesc}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        用地面积（公顷）：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.landArea}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        新增用地面积（公顷）：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.newLandAreaSqm}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        农用地面积（公顷）：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.agriculturalLandArea}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        项目资本金（万元）：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.projectCapital}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        资金来源：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.fundingSource}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        财政资金来源：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.financialFundingSource}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        是否技改项目：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.isTechnicalReformProject}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        产业政策类型：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.industrialPolicyType}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        产业结构调整指导目录：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.industryAdjustmentGuidanceCatalog}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        是否属于房屋市政工程：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.isInfrastructureEngineering}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        是否同意投资平台为项目单位提供融资对接服务：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.agreeToProvideFinancingServices}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        法人单位：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.legalCompany}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        法人单位登记注册类型：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.legalCompanyRegistrationType}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        法人单位证照类型：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.legalCompanyDocumentType}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        法人单位证照号码：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.legalCompanyDocumentNumber}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        法人单位控股情况：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.legalCompanyHoldingSituation}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        法人单位联系人：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.legalCompanyContactName}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        法人单位手机号码：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.legalCompanyContactPhone}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        法人单位电子邮箱：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.legalCompanyContactEmail}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        法人单位法人代表姓名：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.legalCompanyLegalRepresentative}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        法人单位是否为该项目的控股单位：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.isLegalCompanyControllingForProject}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        申报单位：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.applicationCompany}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        申报单位登记注册类型：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.applicationCompanyRegistrationType}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        申报单位证照类型：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.applicationCompanyDocumentType}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        申报单位证照号码：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.applicationCompanyDocumentNumber}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        申报单位控股情况：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.applicationCompanyHoldingSituation}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        申报单位联系人：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.applicationCompanyContactName}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        申报单位手机号码：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project1.applicationCompanyContactPhone}
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                }
                {
                active2 === '3' && <>
                        <div onClick={() => {
                            if(project.onlineApprovalId){
                                navigator(`/ApproveDetail2?count=${process}&id=${project.onlineApprovalId}`)
                            }
                        }
                        } style={{
                            marginBottom: '0.1rem',
                            backgroundImage: `url(/img/InvestmentView/beian.png)`,
                            backgroundSize: '100% 100%',
                            height: '0.4rem',
                            lineHeight: '0.4rem',
                            paddingLeft: '0.5rem',
                            fontWeight: 'bold',
                            color: '#1f337c',
                            fontSize: '0.14 rem',
                        }}>
                            当前审批阶段：{gonggai}
                        </div>
                        <div style={{
                            padding: '0 0.2rem',
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            {
                                tabList1.map((item, index) => {
                                    return (
                                        <div key={index} style={{
                                            fontSize: '0.12rem',
                                            width: '49%',
                                            height: '0.32rem',
                                            borderRadius: '0.05rem',
                                            color: active3 === item.key ? '#fff' : '#666',
                                            backgroundColor: active3 === item.key ? '#337cfd' : '#eff4fd',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }} onClick={() => {
                                            setActive3(item.key)
                                        }}>
                                            {item.tab}
                                        </div>
                                    )
                                })
                            }

                        </div>
                        {
                            active3 === '1' && <>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        是否涉及固定资产投资项目：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project.isFixedAssetInvestmentLabel === true ? '是' : project.isFixedAssetInvestmentLabel === false ? '否' : ''}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        是否涉及建设用地：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project.isConstructionLandLabel === true ? '是' : project.isConstructionLandLabel === false ? '否' : ''}

                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        是否涉及建设用地：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project.isConstructionLandLabel === true ? '是' : project.isConstructionLandLabel === false ? '否' : ''}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        建设用地规划许可证编号：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project.constructionLandPlanningPermitNumber}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        取得许可证日期：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project.permitObtainDate ? dayjs(project.permitObtainDate).format('YYYY-MM-DD') : ''}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        项目名称：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project.projectName}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '35%', color: '#86909c'}}>
                                        项目代码：
                                    </div>
                                    <div style={{width: '65%', textAlign: 'right'}}>
                                        {project2.projectCode}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        项目详细地址：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.detailedAddress}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        项目地址-行政区划：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.areaName}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '35%', color: '#86909c'}}>
                                        工程代码：
                                    </div>
                                    <div style={{width: '65%', textAlign: 'right'}}>
                                        {project2.engineeringCode}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        立项部门：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.approvalDepartment}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        行业类别（国标行业）：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.industryCategoryLabel}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        项目类型：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.projectTypeLabel}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        项目投资来源：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.investmentSourceLabel}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        立项类型：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.approvalTypeLabel}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        项目资金属性：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.fundAttributeLabel}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        总投资额（万元）：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project.totalInvestment}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        项目资本金（万元）：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.projectCapital}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        是否是亿元以上产业项目：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.isOverOneBillionIndustrialProject ? '是' : project2.isOverOneBillionIndustrialProject ? '否' : ''}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        是否是集中建设项目：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.isConcentratedBuildingProject ? '是' : project2.isConcentratedBuildingProject ? '否' : ''}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        集中建设单位名称：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.concentratedBuilderName}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        集中建设单位统一社会信用代码：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.concentratedBuilderUscc}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        集中建设单位法定代表人姓名：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.concentratedBuilderLegalRepresentative}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        单位类型：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.companyTypeLabel}
                                    </div>
                                </div>
                            </>}
                        {
                            active3 === '2' && <>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        企业名称：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.companyName}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        统一社会信用代码：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.uscc}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        法定代表人姓名：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.legalRepresentative}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        联系电话：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.contactPhone}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        土地是否带设计方案：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.hasDesignPlan}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        是否完成区域评估：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.regionalAssessmentCompleted ? '是' : project2.regionalAssessmentCompleted ? '否' : ''}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        用地面积（㎡）：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.landAreaSqm}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        新增用地面积（㎡）：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.newLandAreaSqm}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        土地获取方式：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.landAcquisitionMethodLabel}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        建设性质：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.constructionNatureLabel}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        建设类型：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.constructionTypeLabel}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        总建筑面积（㎡）：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.totalFloorAreaSqm}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        拟开工时间：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2?.plannedStartDate && dayjs(project2?.plannedStartDate).format('YYYY-MM-DD')}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        拟建成时间：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2?.plannedCompletionDate && dayjs(project2?.plannedCompletionDate).format('YYYY-MM-DD')}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        经度：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.longitude}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        纬度：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.latitude}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0 0.2rem',
                                    marginBottom: '0.2rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{width: '55%', color: '#86909c'}}>
                                        建设内容（包括必要性）：
                                    </div>
                                    <div style={{width: '45%', textAlign: 'right'}}>
                                        {project2.constructionContent}
                                    </div>
                                </div>
                            </>
                        }
                    </>
                }
            </div>
        </div>
    );
}
