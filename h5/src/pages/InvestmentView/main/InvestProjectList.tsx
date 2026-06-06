
import { List, Search} from "react-vant";
import {useEffect, useState} from "react";
import {primeApi} from "../../../api.ts";
import {ProjectOnlineApprovalVo} from "../../../apis";
import TopBar from "../../../components/TopBar/TopBar.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";

export default function InvestProjectList() {
    const [value, setValue] = useState('');
    const [page, setPage] = useState(0)
    const [finished, setFinished] = useState<boolean>(false)
    const [searchParams] = useSearchParams();
    const investmentFlag =  searchParams.get('investmentFlag')
    const year = searchParams.get('year')
    const currentProjectProgress = searchParams.get('currentProjectProgress')
    const currentMonth = searchParams.get('currentMonth')
    const signedProject = searchParams.get('signedProject')
    const getData = async () => {
        const data =  await primeApi.listProjectDigitalInvestmentAttracting ({
            currentMonth:currentMonth==='true',
            projectName: value,
            year:year?+year:undefined,
            investmentFlag:investmentFlag?investmentFlag:'',
            signedProject:signedProject==='true',
            showAll:true,
            page:page+1
        });
        setPage(data.page)
        if (data.page > data.totalPage){
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
            backgroundColor:'#f0f2f6',
            overflow: 'scroll',
            scrollbarWidth: 'none',
        }}>
            <TopBar title={'项目详情列表'} time={false}/>
            <Search
                shape="round"
                value={value}
                onSearch={(val) => {
                    setValue(val)
                    console.log(val)
                    setPage(1)
                    primeApi.listProjectOnlineApproval ({projectName: val,page: 1}).then(res => {
                        console.log(res)
                        setList(res.records)
                    })
                }}
                placeholder="请输入项目名称进行搜索"
            />
            <List style={{
                height: 'calc(100vh - 2.5rem)',
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
                                style={{color: '#48a2ff'}}>{item.parkName}</span>
                            </div>

                        </div>
                        <div style={{
                            width: '100%',
                            marginTop: '0.1rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>国民经济分类：<span
                            style={{color: '#8587fa'}}>{item.belongingIndustry}</span>
                        </div>
                        <div style={{
                            width: '100%',
                            marginTop: '0.1rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>投资方：<span
                            style={{color: '#8587fa'}}>{item.investor}</span>
                        </div>
                        <div style={{
                            width: '100%',
                            marginTop: '0.1rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>投资总额：{item.investmentFlag === '1' ?
                            <span style={{color: '#ffad22'}}>{item.totalInvestmentCny}亿元</span> :
                            <span style={{color: '#ffad22'}}>{item.totalInvestmentUsd}亿美元</span>}
                        </div>

                    </div>
                ))}
            </List>
        </div>
    )
}
