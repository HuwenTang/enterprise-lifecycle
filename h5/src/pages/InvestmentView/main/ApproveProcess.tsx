import TopBar from "../../../components/TopBar/TopBar.tsx";
import './style/ApproveProcess.css'
import { Steps } from 'react-vant';
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {primeApi} from "../../../api.ts";
import {ProjectOnlineApprovalInfoDetailVo} from "../../../apis";
import dayjs from "dayjs";

export default function ApproveProcess(){
     const [searchParams] = useSearchParams();
    const [count] = useState(searchParams.get('count'))
    const [total] = useState(searchParams.get('total'))
    const [id] = useState(searchParams.get('id'))
    const [pid] = useState(searchParams.get('pid'))
    const [list, setList] = useState([])
    const listProjectOnlineApprovalInfoDetail =async ()=>{
        const data = await primeApi.listProjectOnlineApprovalInfoDetail({onlineApprovalId:id?id:'',onlineApprovalInfoId:pid?pid:'',onlineApprovalInfoDetailId:''})
        console.log('listProjectOnlineApprovalInfoDetail',data)
        setList(data.records)
    }
    useEffect(()=>{
        listProjectOnlineApprovalInfoDetail()
    },[])
    return (
        <div style={{
            height: '100vh',
            fontSize: '0.16rem',
            backgroundColor: '#f5f5f5',
            overflow:'scroll',
            scrollbarWidth:'none'
        }}>
            <TopBar title={'办件过程'} time={false}/>
            <div style={{
                height: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.2rem',
                backgroundColor: '#eaeef6',
            }}>
                <img src="/img/InvestmentView/time.png" alt=""/>
                <div style={{
                    fontWeight: 'bolder',
                    color: '#337CFD'
                }}>审批进度：{count}/{total}
                </div>
            </div>
            <div style={{
                padding: '0.15rem'
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    // padding: '0.15rem',
                }}>
                    <Steps direction="vertical" active={-1}>
                        {
                            list.map((item, index) => (
                                <Steps.Item key={index}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <div style={{fontWeight: 'bolder',color: '#333'}}>{item.handlingProcess}</div>
                                        <div>{dayjs(item.handlingDate).format('YYYY-MM-DD')}</div>
                                    </div>

                                    <div style={{margin:"0.1rem", padding: '0.15rem', fontSize: '0.14rem', color: '333',backgroundColor: '#f3f7ff'}}>
                                        <div style={{marginBottom:' 0.05rem'}}>办理部门：{item.handlingDepartment}</div>
                                        <div style={{marginBottom:' 0.05rem'}}>内部办理科室：{item.internalHandlingDepartment}</div>
                                        <div style={{marginBottom:' 0.05rem'}}>备注：{item.remark}</div>
                                    </div>
                                </Steps.Item>
                            ))
                        }
                    </Steps>

                </div>
            </div>
        </div>
    )
}
