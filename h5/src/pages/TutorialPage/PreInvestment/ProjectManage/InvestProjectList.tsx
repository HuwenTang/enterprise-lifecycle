
import { List } from "react-vant";
import { useEffect, useState } from "react";
import { primeApi } from "../../../../api.ts";
import { ProjectOnlineApprovalVo } from "../../../../apis/index.ts";
import TopBar from "../../../../components/TopBar/TopBar.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function InvestProjectList() {
    const [page, setPage] = useState(0)
    const [finished, setFinished] = useState<boolean>(false)
    const [searchParams] = useSearchParams();
    // const investmentFlag = searchParams.get('investmentFlag')
    const year = searchParams.get('year')
    const currentProjectProgress = searchParams.get('currentProjectProgress')
    const currentMonth = searchParams.get('currentMonth')
    // const signedProject = searchParams.get('signedProject')
    const currStartDate = searchParams.get('currStartDate')
    const currEndDate = searchParams.get('currEndDate')
    const initialProjectRating = searchParams.get('projectRating')
    const currDate = searchParams.get('currDate')
    const initialRProgress = searchParams.get('rProgress') || ''
    const initialDistrict = searchParams.get('district')
    const initialPark = searchParams.get('park')
    const investmentAmount = searchParams.get('investmentAmount')
    const rmb1 = searchParams.get('rmb1')
    const rmb2 = searchParams.get('rmb2')
    const doller1 = searchParams.get('doller1')
    const doller2 = searchParams.get('doller2')
    const showAll = searchParams.get('showAll')
    const projectCategory = searchParams.get('projectCategory')
    const initialProjectType = searchParams.get('projectType') || '';
    const initialIsKcProj = searchParams.get('isKcProj') || '';
    const getData = async () => {
        const data = await primeApi.dataDashboardListProjectDigitalInvestmentAttracting({
            currStartDate: currStartDate || undefined,
            currEndDate: currEndDate || undefined,
            currDate: currDate || undefined,
            district: initialDistrict || undefined,
            park: initialPark || undefined,
            projectRating: initialProjectRating || undefined,
            rProgress: initialRProgress || undefined,
            investmentAmount: investmentAmount ? +investmentAmount : undefined,
            rmb1: rmb1 ? +rmb1 : undefined,
            rmb2: rmb2 ? +rmb2 : undefined,
            dollar1: doller1 ? +doller1 : undefined,
            dollar2: doller2 ? +doller2 : undefined,
            showAll: showAll === 'true',
            projectCategory: projectCategory || undefined,
            year: year ? +year : undefined,
            // investmentFlag: investmentFlag ? investmentFlag : '',
            // signedProject: signedProject === 'true',
            projectType: initialProjectType,
            isKcProj: initialIsKcProj,
            page: page + 1,
            size: 10
        });
        setPage(data.page)
        if (data.page > data.totalPage) {
            setFinished(true)
        }
        return data.records
    }

    const [list, setList] = useState<ProjectOnlineApprovalVo[]>([])

    const onLoad = async () => {
        const data = await getData()
        console.log('bottom')
        setList(v => [...v, ...data])
    }
    const navigate = useNavigate()

    useEffect(() => {
    }, []);
    return (
        <div style={{
            fontSize: '0.18rem',
            height: '100vh',
            backgroundColor: '#f0f2f6',
            overflow: 'scroll',
            scrollbarWidth: 'none',
        }}>
            <TopBar title={'项目详情列表'} time={false} />
            <List style={{
                height: 'calc(100vh - 1.5rem)',
            }} finished={finished} onLoad={onLoad}>
                {list.map((item, index) => (
                    <div key={index} style={{
                        fontSize: '0.14rem',
                        marginTop: '0.15rem',
                        marginBottom: '15px',
                        backgroundColor: '#fff',
                        padding: '0.15rem 0.18rem',
                        borderRadius: '0.05rem',
                        boxShadow: '0 0.01rem 0.02rem rgba(0,0,0,0.1)'
                    }} onClick={() => {
                        navigate(`/InvestmentView/ProjectDetail?id=${item.id}&zsid=${item.projectCode}`)
                    }}>
                        <div style={{
                            fontWeight: 'bold',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>项目名称：{item.projectName}</div>
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            // justifyContent:'space-between',
                            marginTop: '0.2rem'
                        }}>
                            <div style={{
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>所属板块：<span
                                style={{ color: '#48a2ff' }}>{item.parkName}</span>
                            </div>

                        </div>
                        <div style={{
                            width: '100%',
                            marginTop: '0.1rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>国民经济分类：<span
                            style={{ color: '#8587fa' }}>{item.natio}</span>
                        </div>
                        <div style={{
                            width: '100%',
                            marginTop: '0.1rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>投资方：<span
                            style={{ color: '#8587fa' }}>{item.investor}</span>
                        </div>
                        <div style={{
                            width: '100%',
                            marginTop: '0.1rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>投资总额：{item.investmentFlag === '1' ?
                            <span style={{ color: '#ffad22' }}>{item.totalInvestmentCny}亿元</span> :
                            <span style={{ color: '#ffad22' }}>{item.totalInvestmentUsd}亿美元</span>}
                        </div>

                    </div>
                ))}
            </List>
        </div>
    )
}
