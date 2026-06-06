
import { List, Search} from "react-vant";
import {useEffect, useState} from "react";
import {primeApi} from "../../../api.ts";
import {PageableResultProjectImportantProvinceInfoVo, ProjectOnlineApprovalVo} from "../../../apis";
import TopBar from "../../../components/TopBar/TopBar.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";

export default function InvestProject2() {
    const [value, setValue] = useState('');
    const [page, setPage] = useState(0)
    const [finished, setFinished] = useState<boolean>(false)
    const [searchParams] = useSearchParams();
    const investmentFlag =  searchParams.get('investmentFlag')
    const year = searchParams.get('year')
    const place = searchParams.get('place')
    const [isLoading, setIsLoading] = useState(true)

    const getData = async () => {
        const data =  await primeApi.listProjectImportantProvinceInfo ({
            year:year?+year:undefined,
            level:place?place:'',
            page:page+1
        });
        setIsLoading(false)
        setPage(data.page)
        if (data.page > data.totalPage){
            setFinished(true)
        }
        return data.records
    }

    const [list, setList] = useState<PageableResultProjectImportantProvinceInfoVo[]>([])

    const onLoad = async () => {
        const data = await getData()
        console.log('bottom')
        setList(v => [...v, ...data])
    }
    const navigate = useNavigate()

    return (
        <div style={{
            fontSize: '0.18rem',
            height: '100vh',
            backgroundColor:'#f0f2f6',
            overflow: 'scroll',
            scrollbarWidth: 'none',
        }}>
            <TopBar title={'项目详情列表'} time={false}/>
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
                        navigate(`/project-detail2?id=${item.id}`)
                    }}>
                        <div style={{
                            fontWeight: 'bold',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>项目名称：{item.projectName}</div>
                        <div style={{
                            width: '100%',
                            marginTop: '0.1rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>公司名称：<span
                            style={{color: '#8587fa'}}>{item.companyName}</span>
                        </div>

                    </div>
                ))}
                {
                    (list.length===0&&!isLoading) && (
                        <div style={{
                            textAlign: 'center',
                            marginTop: '0.1rem',
                            color: '#999999'
                        }}>暂无数据</div>
                    )
                }
            </List>
        </div>
    )
}
