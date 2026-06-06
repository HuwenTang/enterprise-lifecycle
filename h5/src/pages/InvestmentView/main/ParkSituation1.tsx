import {useEffect, useState} from "react";
import {primeApi} from "../../../api.ts";
import {InvestOnlineBo} from "../../../apis";

function Table1(e:{year:string}) {
    const {year} = e
    const getQyxmZjNzViews = async ()=>{
        const data = await primeApi.getQyxmZjNzViews({year:+year})
        setData(data)
    }
    const [data, setData] = useState<InvestOnlineBo[]>()
    useEffect(() => {
        getQyxmZjNzViews()
    }, [year]);
    return (
        <div>
            <div style={{
                marginTop: '0.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                height: '0.4rem',
                alignItems: 'center',
                fontSize: '0.12rem',
                backgroundColor: '#3e61f1',
                color: '#fff',
                width: '100%',
            }}>
                <div style={{
                    width: '12%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>序号
                </div>
                <div style={{
                    width: '20%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>板块名称
                </div>
                <div style={{
                    width: '20%',
                    borderRight: '1px solid #eee',
                    textAlign: 'center'
                }}>
                    总额
                </div>
                <div style={{
                    width: '20%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>
                    10亿以上
                </div>
                <div style={{
                    width: '20%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>
                    5亿以上
                </div>
                <div style={{
                    width: '20%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>
                    1亿以上
                </div>
            </div>
            {
                (data || []).map((item, index) => {
                    return (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: '0.4rem',
                            alignItems: 'center',
                            fontSize: '0.14rem',
                            color: '#666',
                            width: '100%',
                        }}>
                            <div style={{
                                width: '12%',
                                textAlign: 'center',
                                borderRight: '1px solid #eee'
                            }}>{index+1}
                            </div>
                            <div className={'ellipsis-container'} style={{
                                width: '20%',
                                borderRight: '1px solid #eee',
                            }}>{item.name}
                            </div>
                            <div style={{
                                width: '20%',
                                borderRight: '1px solid #eee',
                                textAlign: 'center'
                            }}>
                                {item.total}
                            </div>
                            <div style={{
                                width: '20%',
                                textAlign: 'center',
                                borderRight: '1px solid #eee'
                            }}>
                                {item.syys}
                            </div>
                            <div style={{
                                width: '20%',
                                textAlign: 'center',
                                borderRight: '1px solid #eee'
                            }}>
                                {item.wyys}
                            </div>
                            <div style={{
                                width: '20%',
                                textAlign: 'center',
                                borderRight: '1px solid #eee'
                            }}>
                                {item.yyys}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

function Table2(e:{year:string}) {
    const waizi = [
        {id: 1, name: '靖江市', key: 0, value: 0, value1: 0},
        {id: 2, name: '泰兴市', key: 1, value: 0, value1: 0},
        {id: 3, name: '兴化市', key: 1, value: 0, value1: 0},
        {id: 4, name: '海陵区', key: 1, value: 0, value1: 0},
        {id: 5, name: '姜堰区', key: 1, value: 0, value1: 0},
        {id: 6, name: '新高区', key: 1, value: 0, value1: 0},
    ]
    const {year} = e
    const getQyxmZjWzViews = async ()=>{
        const data = await primeApi.getQyxmZjWzViews({year:+year})
        setData(data)
    }
    const [data, setData] = useState<InvestOnlineBo[]>()
    useEffect(() => {
        getQyxmZjWzViews()
    }, [year]);
    return (
        <div>
            <div style={{
                marginTop: '0.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                height: '0.4rem',
                alignItems: 'center',
                fontSize: '0.12rem',
                backgroundColor: '#3e61f1',
                color: '#fff',
                width: '100%',
            }}>
                <div style={{
                    width: '12%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>序号
                </div>
                <div style={{
                    width: '20%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>板块名称
                </div>
                <div style={{
                    width: '20%',
                    borderRight: '1px solid #eee',
                    textAlign: 'center'
                }}>
                    总额
                </div>
                <div style={{
                    width: '20%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>
                    1亿美元及以上
                </div>
                <div style={{
                    width: '20%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>
                    3000万美元及以上
                </div>
                <div style={{
                    width: '20%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>
                    1000万美元及以上
                </div>
            </div>
            {
                (data || []).map((item, index) => {
                    return (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: '0.4rem',
                            alignItems: 'center',
                            fontSize: '0.14rem',
                            color: '#666',
                            width: '100%',
                        }}>
                            <div style={{
                                width: '12%',
                                textAlign: 'center',
                                borderRight: '1px solid #eee'
                            }}>{index+1}
                            </div>
                            <div className={'ellipsis-container'} style={{
                                width: '20%',
                                borderRight: '1px solid #eee',
                            }}>{item.name}
                            </div>
                            <div style={{
                                width: '20%',
                                borderRight: '1px solid #eee',
                                textAlign: 'center'
                            }}>
                                {item.total}
                            </div>
                            <div style={{
                                width: '20%',
                                textAlign: 'center',
                                borderRight: '1px solid #eee'
                            }}>
                                {item.syys}
                            </div>
                            <div style={{
                                width: '20%',
                                textAlign: 'center',
                                borderRight: '1px solid #eee'
                            }}>
                                {item.wyys}
                            </div>
                            <div style={{
                                width: '20%',
                                textAlign: 'center',
                                borderRight: '1px solid #eee'
                            }}>
                                {item.yyys}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

function Table3(e:{year:string}) {
    const {year} = e
    const getQyxmZjTotalViews = async ()=>{
        const data = await primeApi.getQyxmZjTotalViews({year:+year})
        setData(data)
    }
    const [data, setData] = useState<InvestOnlineBo[]>()
    const waizi = [
        {id: 1, name: '瞪羚', key: 0, value: 0, value1: 0},
        {id: 2, name: '国家专精特新', key: 1, value: 0, value1: 0},
    ]
    useEffect(() => {
        getQyxmZjTotalViews()
    }, [year]);
    return (
        <div >
            {/*<div style={{*/}
            {/*    marginTop: '0.2rem',*/}
            {/*    fontSize: '0.16rem',*/}
            {/*    fontWeight: 'bold',*/}
            {/*}}>重点板块项目情况*/}
            {/*</div>*/}
            <div style={{
                marginTop: '0.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                height: '0.4rem',
                alignItems: 'center',
                fontSize: '0.12rem',
                backgroundColor: '#3e61f1',
                color: '#fff',
                width: '100%',
            }}>
                <div style={{
                    width: '20%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>重点板块
                </div>
                <div style={{
                    width: '20%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>项目总数
                </div>
                <div style={{
                    width: '20%',
                    borderRight: '1px solid #eee',
                    textAlign: 'center'
                }}>
                    百分比
                </div>
                <div style={{
                    width: '20%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>
                    投资总额（亿元）
                </div>
                <div style={{
                    width: '20%',
                    textAlign: 'center',
                    borderRight: '1px solid #eee'
                }}>
                    百分比
                </div>

            </div>
            {
                (data||[]).map((item, index) => {
                    return (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: '0.4rem',
                            alignItems: 'center',
                            fontSize: '0.14rem',
                            color: '#666',
                            width: '100%',
                        }}>
                            <div className={'ellipsis-container'} style={{
                                width: '20%',
                                borderRight: '1px solid #eee',
                            }}>{item.name}
                            </div>
                            <div style={{
                                width: '20%',
                                textAlign: 'center',
                                borderRight: '1px solid #eee'
                            }}>{item.total}
                            </div>
                            <div style={{
                                width: '20%',
                                borderRight: '1px solid #eee',
                                textAlign: 'center'
                            }}>
                                {item.zb}%
                            </div>
                            <div style={{
                                width: '20%',
                                textAlign: 'center',
                                borderRight: '1px solid #eee'
                            }}>
                                {item.totalMoney || 0}
                            </div>
                            <div style={{
                                width: '20%',
                                textAlign: 'center',
                                borderRight: '1px solid #eee'
                            }}>
                                {item.zbMoney || 0}%
                            </div>

                        </div>
                    )
                })
            }
        </div>
    )
}

export default function ParkSituation1(e:{year:string}) {
    const {year} = e
    const [active2, setActive2] = useState(0)
    return (
        <div>
            <div style={{
                fontSize: '0.16rem',
                fontWeight: 'bold',
            }}>重点板块项目情况
            </div>
            <div>
                <div style={{
                    padding: '0 0.01rem ',
                    width: '100%',
                    height: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '0.155rem',
                    backgroundColor: '#eeeff5'
                }}>
                    <div onClick={() => {
                        setActive2(0)
                    }} style={{
                        width: '33%',
                        textAlign: 'center',
                        color: active2 === 0 ? '#264099' : '#333',
                        height: '0.32rem',
                        borderRadius: '0.12rem',
                        lineHeight: '0.3rem',
                        backgroundColor: active2 === 0 ? '#fff' : ''
                    }}>全部
                    </div>
                    <div onClick={() => {
                        setActive2(1)
                    }} style={{
                        width: '33%',
                        textAlign: 'center',
                        color: active2 === 1 ? '#264099' : '#333',
                        height: '0.32rem',
                        borderRadius: '0.12rem',
                        lineHeight: '0.3rem',
                        backgroundColor: active2 === 1 ? '#fff' : ''
                    }}>内资项目
                    </div>
                    <div onClick={() => {
                        setActive2(2)
                    }} style={{
                        width: '33%',
                        textAlign: 'center',
                        color: active2 === 2 ? '#264099' : '#333',
                        backgroundColor: active2 === 2 ? '#fff' : '',
                        height: '0.32rem',
                        borderRadius: '0.12rem',
                        lineHeight: '0.3rem',
                    }}>外资项目
                    </div>
                </div>
            </div>
            {
                active2 === 0 && <Table3 year={year}/>
            }
            {
                active2 === 1 && <Table1 year={year}/>
            }
            {
                active2 === 2 && <Table2  year={year}/>
            }
            {/*<Table3/>*/}
        </div>
    )
}
