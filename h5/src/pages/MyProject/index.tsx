
import { List,Search } from "react-vant";
import { useEffect, useState } from "react";
import { primeApi } from "../../api.ts";
import TopBar from "../../components/TopBar/TopBar.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function MyProject() {
    const [page, setPage] = useState(0)
    const [value, setValue] = useState("");
    const [finished, setFinished] = useState<boolean>(false)
    const [searchParams] = useSearchParams();
    const getData = async (params) => {
        const data = await primeApi.listProjectDigitalInvestmentAttracting({
            ...params
        });
        setPage(data.page)
        if (data.page > data.totalPage) {
            setFinished(true)
        }
        return data.records
    }

    const [list, setList] = useState<any[]>([])

    const onLoad = async (params:any) => {
        const data = await getData(params)
        console.log('bottom',page)
        if(params.page === 0 || params.page === 1){
            setList(data)
        }else{
            setList(v => [...v, ...data])
        }
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
            <TopBar title={'我的项目'} time={false} />
            <Search
                shape="round"
                value={value}
                onChange={(val) => {
                    setValue(val);
                    setPage(0);
                    setFinished(false);
                    onLoad({
                        projectName: val || undefined,
                        page: 1,
                        size: 10,
                        showAll:false
                    })
                }}
                placeholder="请输入项目名称进行搜索"
            />
            <List style={{
                height: 'calc(100vh - 1.5rem)',
            }} finished={finished} onLoad={()=>onLoad({
                projectName: value,
                page: page+1,
                size: 10,
                showAll:false
            })}>
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
                            style={{ color: '#8587fa' }}>{item.nationalEconomicClassification}</span>
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
                        <div style={{
                            width: '100%',
                            marginTop: '0.1rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>项目得分：<span
                            style={{ color: '#8587fa' }}>{item.projectScore}</span>
                        </div>
                    </div>
                ))}
            </List>
        </div>
    )
}
