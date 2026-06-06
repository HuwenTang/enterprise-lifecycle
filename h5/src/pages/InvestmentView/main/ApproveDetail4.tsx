import TopBar from "../../../components/TopBar/TopBar.tsx";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {primeApi} from "../../../api.ts";
import {Loading} from "react-vant";
import {ProjectConstructionApprovalItemVo} from "../../../apis";
import dayjs from "dayjs";

export default function ApproveDetail4() {
    // const navigator = useNavigate()
    const [searchParams] = useSearchParams();
    const [count, setCount] = useState(0)
    // const [total] = useState(searchParams.get('total'))
    const [id] = useState(searchParams.get('id'))
    const [list, setList] = useState<ProjectConstructionApprovalItemVo[]>([])
    // const [page, setPage] = useState(0)
    // const [finished, setFinished] = useState<boolean>(false)
    // const onLoad = async () => {
    //     const data = await primeApi.getItem( {code: id?id:'0',page:page+1})
    //     console.log('bottom')
    //     console.log(data)
    //     // setPage(data.page)
    //     // setList(v => [...v, ...data.records])
    //     // if (data.page > data.totalPage){
    //     //     setFinished(true)
    //     // }
    // }
    const [show, setShow] = useState(true)
    const getStage = async () => {
        const data = await primeApi.getStage({code: id})
        console.log('getStage', data.value)
        setCount(data.value)
    }


    const getItem = async () => {
        const data = await primeApi.getItem({code: id ? id : '0'})
        setList(data)
        setShow(false)
    }

    useEffect(() => {
        getStage()
        getItem()
    }, [])
    return (
        <div style={{
            height: '100vh',
            fontSize: '0.16rem',
            backgroundColor: '#f5f5f5',
            overflow: 'scroll',
            scrollbarWidth: 'none'
        }}>
            <TopBar title={'审批过程'} time={false}/>

            <div style={{
                marginTop: '0.1rem',
                marginBottom: '0.1rem',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.2rem',
            }}>
                <div onClick={() => {
                    setCount(1)
                }} style={{
                    width: '25%',
                    height: '0.35rem',
                    lineHeight: '0.35rem',
                    fontSize: '0.12rem',
                    backgroundImage: count > 0 ? 'url(/img/InvestmentView/bg0.png)' : 'url(/img/InvestmentView/bg0.png)',
                    backgroundSize: '100% 100%',
                    color: count > 0 ? 'white' : '#999',
                    textAlign: 'center',
                }}>立项用地
                </div>
                <div onClick={() => {
                    setCount(2)
                }} style={{
                    width: '25%',
                    height: '0.35rem',
                    lineHeight: '0.35rem',
                    fontSize: '0.12rem',
                    backgroundImage: count > 1 ? 'url(/img/InvestmentView/bg1.png)' : 'url(/img/InvestmentView/bg2.png)',
                    backgroundSize: '100% 100%',
                    color: count > 1 ? 'white' : '#999',
                    textAlign: 'center',
                }}>工程建设
                </div>
                <div onClick={() => {
                    setCount(3)
                }} style={{
                    width: '25%',
                    height: '0.35rem',
                    lineHeight: '0.35rem',
                    fontSize: '0.12rem',
                    backgroundImage: count > 2 ? 'url(/img/InvestmentView/bg1.png)' : 'url(/img/InvestmentView/bg2.png)',
                    backgroundSize: '100% 100%',
                    color: count > 2 ? 'white' : '#999',
                    textAlign: 'center',
                }}>施工许可
                </div>
                <div onClick={() => {
                    setCount(4)
                }} style={{
                    width: '25%',
                    height: '0.35rem',
                    lineHeight: '0.35rem',
                    fontSize: '0.12rem',
                    backgroundImage: count > 3 ? 'url(/img/InvestmentView/bg1.png)' : 'url(/img/InvestmentView/bg2.png)',
                    backgroundSize: '100% 100%',
                    color: count > 3 ? 'white' : '#999',
                    textAlign: 'center',
                }}>竣工验收
                </div>
            </div>

            {/*<div style={{*/}
            {/*    height:'0.4rem',*/}
            {/*    display:'flex',*/}
            {/*    alignItems:'center',*/}
            {/*    padding:'0 0.2rem',*/}
            {/*    backgroundColor:'#eaeef6',*/}
            {/*}}>*/}
            {/*    <img src="/img/InvestmentView/time.png" alt=""/>*/}
            {/*    <div style={{*/}
            {/*        fontWeight:'bolder',*/}
            {/*        color:'#337CFD'*/}
            {/*    }}>审批进度：{count}/{total}</div>*/}
            {/*</div>*/}
            <div style={{
                padding: '0 0.2rem 0.2rem 0.2rem',
            }}>
                {/*<List style={{*/}
                {/*    height: 'calc(100vh - 2.5rem)',*/}
                {/*}} finished={finished} onLoad={onLoad}>*/}
                {/*{*/}
                {/*    list?.map((item, index)=>{*/}
                {/*        return (*/}
                {/*            <div key={index} onClick={()=>{*/}
                {/*                if(item.approvalStatus.includes('已办结')){*/}
                {/*                    navigator(`/ApproveProcess?count=${count}&total=${total}&id=${id}&pid=${item.id}`)}*/}
                {/*            }} style={{backgroundColor:'#fff',padding:'0.1rem',marginTop:'0.1rem',borderRadius:'0.07rem'}}>*/}
                {/*                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>*/}
                {/*                    <div style={{*/}
                {/*                        width:'70%',*/}
                {/*                        color:'#010101',*/}
                {/*                        fontWeight:'bolder',*/}
                {/*                        fontSize:'0.14rem',*/}
                {/*                        overflow:'hidden',*/}
                {/*                        textOverflow:'ellipsis',*/}
                {/*                        whiteSpace:'nowrap'*/}
                {/*                    }}>事项名称：{item.approvalItem}</div>*/}
                {/*                    <div style={{*/}
                {/*                        width:'20%',*/}
                {/*                        height:'0.2rem',*/}
                {/*                        textAlign:'center',*/}
                {/*                        borderRadius:'0.05rem',*/}
                {/*                        lineHeight:'0.2rem',*/}
                {/*                        color:item.approvalStatus==='待收件'? '#337CFD' : item.status==='审批中' ? '#ffa962' : '#5fdba6',*/}
                {/*                        backgroundColor:item.approvalStatus==='待收件' ? '#eaf1fe' : item.status==='审批中' ? '#fff3e9' : '#eafaf3',*/}
                {/*                        fontSize:'0.12rem',*/}
                {/*                        overflow:'hidden',*/}
                {/*                        textOverflow:'ellipsis',*/}
                {/*                        whiteSpace:'nowrap'*/}
                {/*                    }}>{item.approvalStatus}</div>*/}
                {/*                </div>*/}
                {/*                <div style={{marginTop:'0.1rem',color:'#333',fontSize:'0.12rem'}}>实施主体：{item.implementingSubject}</div>*/}
                {/*                <div style={{marginTop:'0.1rem',color:'#333',fontSize:'0.12rem'}}>承办部门：{item.undertakingDepartment}</div>*/}
                {/*            </div>*/}
                {/*        )*/}
                {/*    })*/}
                {/*}*/}
                {/*</List>*/}

                {
                    show && <div style={{
                        // height:'50vh',
                        // lineHeight:'50vh',
                        textAlign: 'center'
                    }}>
                        <Loading size="24px">加载中...</Loading>
                    </div>
                }
                {
                    !show && list?.map((item, index) => {
                        return (
                            <div>

                                {
                                    (item?.stage && +item?.stage) === count &&

                                    <div key={index}
                                         style={{
                                             backgroundColor: '#fff',
                                             padding: '0.1rem',
                                             marginTop: '0.1rem',
                                             borderRadius: '0.07rem'
                                         }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div style={{
                                                width: '70%',
                                                color: '#010101',
                                                fontWeight: 'bolder',
                                                fontSize: '0.14rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>事项名称：{item.name}</div>
                                            <div style={{
                                                width: '20%',
                                                height: '0.2rem',
                                                textAlign: 'center',
                                                borderRadius: '0.05rem',
                                                lineHeight: '0.2rem',
                                                color: item.result === '办结' ? '#337CFD' : item.result === '审批' ? '#ffa962' : '#5fdba6',
                                                backgroundColor: item.result === '办结' ? '#eaf1fe' : item.result === '审批' ? '#fff3e9' : '#eafaf3',
                                                fontSize: '0.12rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>{item.result}</div>
                                        </div>
                                        <div style={{
                                            marginTop: '0.1rem',
                                            color: '#333',
                                            fontSize: '0.12rem'
                                        }}>{item.result === '审批' ? '承办' : '审批'}部门：{item.department}</div>
                                        <div style={{
                                            marginTop: '0.1rem',
                                            color: '#333',
                                            fontSize: '0.12rem'
                                        }}>{item.result === '审批' ? '承办' : '审批'}时间：{dayjs(item.time).format('YYYY-MM-DD')}</div>
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
