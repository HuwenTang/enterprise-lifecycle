import TopBar from "../../../components/TopBar/TopBar.tsx";
import {useEffect, useState} from "react";
import AreaPick1 from "../../../components/YearPick/economy/AreaPick1.tsx";
import MonthPick2 from "../../../components/YearPick/MonthPick2.tsx";

export default function GdpViewDetail6() {
    const list = [
        {
            name: '居民消费',
            data: [
                {
                    subTitle: '银联消费总金额',
                    unit: '亿元',
                    value: "8.86",
                    value1: -27.06,
                },
                {
                    subTitle: '餐饮类银联消费额',
                    unit: '亿元',
                    value: "0.55",
                    value1: -18.90,
                },
                {
                    subTitle: '住宿类银联消费额',
                    unit: '亿元',
                    value: "3.97",
                    value1: -21.93,
                },
                {
                    subTitle: '零售类银联消费额',
                    unit: '亿元',
                    value: "0.54",
                    value1: -41.03,
                },
                {
                    subTitle: '娱乐类银联消费额',
                    unit: '亿元',
                    value: "0.48",
                    value1: -4.88,
                },
                {
                    subTitle: '华润万象城、万达广场、泰州一百、泰州中骏世界城四个重点商圈银联消费额',
                    unit: '亿元',
                    value: "4.92",
                    value1: 4.78,
                },
            ]
        },
        {
            name:'房地产市场交易(网签数)',
            data: [
                {
                    subTitle: '新建商品住宅销售面积',
                    unit: '万平方米',
                    value: "2.69",
                    value1: null,
                },
                {
                    subTitle: '新建商品住宅销售总价',
                    unit: '亿元',
                    value: "2.52",
                    value1: null,
                },
                {
                    subTitle: '二手商品住宅销售面积',
                    unit: '万平方米',
                    value: "9.59",
                    value1: null,
                },
                {
                    subTitle: '二手商品住宅销售总价',
                    unit: '亿元',
                    value: "6.19",
                    value1: null,
                }
            ]
        },
        {
            name:'交通物流',
            data: [
                {
                    subTitle: '普通国省干线公路货车流量',
                    unit: '辆/日',
                    value: "3685",
                    value1: 7.47,
                }
            ]
        },
        {
            name:'外贸出口',
            data: [
                {
                    subTitle: '泰州国际集装箱码头集装箱货物吞吐量',
                    unit: '标箱(TEU)',
                    value: "11999",
                    value1: 22.78,
                },
                {
                    subTitle: '泰州国际集装箱码头外贸集装箱货物吞吐量',
                    unit: '标箱(TEU)',
                    value: "5484",
                    value1: 24.02,
                }
            ]
        },
        {
            name:'市场主体',
            data: [
                {
                    subTitle: '新登记市场主体数',
                    unit: '个',
                    value: "3908",
                    value1: 0.72,
                },
                {
                    subTitle: '新登记企业数',
                    unit: '个',
                    value: "1152",
                    value1: 0.00,
                }
            ]
        },
    ]

    const [year, setYear] = useState('2025')
    const [season, setSeason] = useState('9月')
    const [type, setType] = useState('全部')
    useEffect(() => {
    }, []);
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            backgroundColor: '#f5f5f5',
            fontSize: '0.18rem',
            overflow: 'scroll',
            scrollbarWidth: 'none',
        }}>
            <TopBar title={'其他高频监测指标数据情况表'} time={false}/>
            <div style={{
                padding: '0.1rem 0.05rem',
                overflowY: 'scroll',
            }}>

                <div style={{
                    // width: '880px',
                    padding: '0.1rem 0.05rem',
                }}>
                    <div style={{
                        marginBottom: '0.1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.14rem'
                    }}>
                        <div style={{width: '30%'}}><AreaPick1 year={year} setYear={setYear} fixedValue="2026年"/></div>
                        <div style={{width: '20%'}}><MonthPick2 year={season} setYear={setSeason} fixedValue="2月"/></div>
                        {/*<div style={{width: '40%'}}><GdpPicker2 year={type} setYear={setType}/></div>*/}
                    </div>
                    {
                        (type==='全部'||type==='规上工业企业实时开票情况')&& list.map((item: any, index: number) => {
                            return (
                                <div>
                                    <div>
                                        {
                                            item.name && <div style={{
                                                paddingLeft: '0.2rem',
                                                height: '0.5rem',
                                                fontSize: '0.16rem',
                                                lineHeight: '0.5rem',
                                                borderRadius: '0.07rem',
                                                background: 'linear-gradient(to right, #6fa84a, #a4ca91)',
                                                color: '#fff',
                                            }}>
                                                {item.name}
                                            </div>
                                        }
                                    </div>
                                    <div key={index} style={{
                                        backgroundColor: '#fff',
                                        marginBottom: '0.1rem',
                                        borderRadius: '0.07rem',
                                        padding: '0.1rem 0.15rem',
                                    }}>

                                        {
                                            item.data.map((item1: any, index1: number) => {
                                                return (
                                                    <div>
                                                        <div style={{
                                                            marginTop: '0.1rem',
                                                            marginLeft: '0.1rem',
                                                            fontSize: '0.14rem',
                                                            color: '#333'
                                                        }}>{item1.subTitle}</div>
                                                        <div style={{
                                                            padding: '0.15rem 0',
                                                            display: 'grid',
                                                            gridTemplateColumns: '1fr 1fr'
                                                        }}>
                                                            <div style={{
                                                                fontSize: '0.12rem',
                                                                color: '#6f6f6f',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                borderRight: '1px solid #eaeaea',
                                                                alignItems: 'center'
                                                            }}>
                                                                <img style={{
                                                                    width: '0.3rem',
                                                                    marginBottom: '0.05rem'
                                                                }}
                                                                     src="/img/GDP/y1.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>9月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>累计总量({item1.unit})</div>
                                                                <div style={{
                                                                    color: '#aabb53',
                                                                }}>{item1.value}</div>
                                                            </div>
                                                            <div style={{
                                                                fontSize: '0.12rem',
                                                                color: '#6f6f6f',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center'
                                                            }}>
                                                                {
                                                                    item1.value1 !== null && (
                                                                        item1.value1 > 0 ? <img style={{
                                                                            width: '0.3rem',
                                                                            marginBottom: '0.05rem'
                                                                        }}
                                                                                               src="/img/GDP/up01.png"
                                                                                               alt=""/> : <img style={{
                                                                            width: '0.3rem',
                                                                            marginBottom: '0.05rem'
                                                                        }}
                                                                                                           src="/img/GDP/down01.png"
                                                                                                           alt=""/>
                                                                    )
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速</div>
                                                                <div style={{marginBottom: '0.05rem'}}>(%)</div>
                                                                <div style={{
                                                                    color: '#aabb53',
                                                                }}>
                                                                    {item1.value1 !== null ? item1.value1 : '—'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}
