import TopBar from "../../../components/TopBar/TopBar.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {primeApi} from "../../../api.ts";
import {List} from "react-vant";
export default function ApproveDetail(){
    const navigator = useNavigate()
    const [searchParams] = useSearchParams();
    const [count] = useState(searchParams.get('count'))
    const [total] = useState(searchParams.get('total'))
    const [id] = useState(searchParams.get('id'))
    const [list, setList] = useState([])
    const [page, setPage] = useState(0)
    const [finished, setFinished] = useState<boolean>(false)
    const listProjectOnlineApprovalInfo =async ()=>{
        const data =await primeApi.listProjectOnlineApprovalInfo( {onlineApprovalId: id?id:'0',page:page+1})
        console.log('listProjectOnlineApprovalInfo',data)
        setList(data.records)
        setPage(data.page)
        if (data.page > data.totalPage){
            setFinished(true)
        }
    }
    const onLoad = async () => {
        const data = await primeApi.listProjectOnlineApprovalInfo( {onlineApprovalId: id?id:'0',page:page+1})
        console.log('bottom')
        setPage(data.page)
        if (data.page > data.totalPage){
            setFinished(true)
        }
        setList(v => [...v, ...data.records])
    }

    useEffect(()=>{
        // listProjectOnlineApprovalInfo()
    },[])
    return (
        <div style={{
            height:'100vh',
            fontSize:'0.16rem',
            backgroundColor:'#f5f5f5',
            overflow:'scroll',
            scrollbarWidth:'none'
        }}>
            <TopBar title={'审批过程'} time={false}/>
            <div style={{
                height:'0.4rem',
                display:'flex',
                alignItems:'center',
                padding:'0 0.2rem',
                backgroundColor:'#eaeef6',
            }}>
                <img src="/img/InvestmentView/time.png" alt=""/>
                <div style={{
                    fontWeight:'bolder',
                    color:'#337CFD'
                }}>审批进度：{count}/{total}</div>
            </div>
            <div style={{
                padding :'0 0.2rem 0.2rem 0.2rem',
            }}>
                <List style={{
                    height: 'calc(100vh - 2.5rem)',
                }} finished={finished} onLoad={onLoad}>
                {
                    list?.map((item, index)=>{
                        return (
                            <div key={index} onClick={()=>{
                                if(item.approvalStatus.includes('已办结')){
                                    navigator(`/ApproveProcess?count=${count}&total=${total}&id=${id}&pid=${item.id}`)}
                            }} style={{backgroundColor:'#fff',padding:'0.1rem',marginTop:'0.1rem',borderRadius:'0.07rem'}}>
                                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                    <div style={{
                                        width:'70%',
                                        color:'#010101',
                                        fontWeight:'bolder',
                                        fontSize:'0.14rem',
                                        overflow:'hidden',
                                        textOverflow:'ellipsis',
                                        whiteSpace:'nowrap'
                                    }}>事项名称：{item.approvalItem}</div>
                                    <div style={{
                                        width:'20%',
                                        height:'0.2rem',
                                        textAlign:'center',
                                        borderRadius:'0.05rem',
                                        lineHeight:'0.2rem',
                                        color:item.approvalStatus==='待收件'? '#337CFD' : item.status==='审批中' ? '#ffa962' : '#5fdba6',
                                        backgroundColor:item.approvalStatus==='待收件' ? '#eaf1fe' : item.status==='审批中' ? '#fff3e9' : '#eafaf3',
                                        fontSize:'0.12rem',
                                        overflow:'hidden',
                                        textOverflow:'ellipsis',
                                        whiteSpace:'nowrap'
                                    }}>{item.approvalStatus}</div>
                                </div>
                                <div style={{marginTop:'0.1rem',color:'#333',fontSize:'0.12rem'}}>实施主体：{item.implementingSubject}</div>
                                <div style={{marginTop:'0.1rem',color:'#333',fontSize:'0.12rem'}}>承办部门：{item.undertakingDepartment}</div>
                            </div>
                        )
                    })
                }
                </List>
            </div>
        </div>
    )
}
