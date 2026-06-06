import TopBar from "../../../components/TopBar/TopBar.tsx";
import {useEffect, useState} from "react";
import AreaPick1 from "../../../components/YearPick/economy/AreaPick1.tsx";
import MonthPick2 from "../../../components/YearPick/MonthPick2.tsx";

type DataRow = { subTitle: string; value: string; value1: number; value2: string; value3: number };
type ListGroup = { name?: string; data: DataRow[] };

export default function GdpViewDetail2() {
    const list = [
        {
            name: '限额以上批零住餐业企业开票情况',
            data: [
                { subTitle: "限上批发业", value: "210.38", value1: -8.91, value2: "524.64", value3: 3.27 },
                { subTitle: "限上零售业", value: "24.13", value1: -3.17, value2: "55.13", value3: -9.13 },
                { subTitle: "限上住宿业", value: "0.48", value1: 10.61, value2: "0.92", value3: -2.48 },
                { subTitle: "限上餐饮业", value: "1.59", value1: 58.42, value2: "3.11", value3: 4.62 },
            ]
        },
    ]

    const [year, setYear] = useState('2025')
    const [season, setSeason] = useState('2月')
    const [type] = useState('全部')
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
            <TopBar title={'限额以上批零住餐业企业开票情况'} time={false}/>
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
                        (type==='全部'||type==='规上工业企业实时开票情况')&& list.map((item: ListGroup, index: number) => {
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
                                            item.data.map((item1: DataRow) => {
                                                return (
                                                    <div>
                                                        <div style={{
                                                            marginTop: '0.1rem',
                                                            marginLeft: '0.1rem'
                                                        }}>{item1.subTitle}</div>
                                                        <div style={{
                                                            padding: '0.2rem 0',
                                                            display: 'grid',
                                                            gridTemplateColumns: '1fr 1fr 1fr 1fr'
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
                                                                <div style={{marginBottom: '0.05rem'}}>2月当月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#aabb53',
                                                                }}>{item1.value}</div>
                                                            </div>
                                                            <div style={{
                                                                fontSize: '0.12rem',
                                                                color: '#6f6f6f',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                borderRight: '1px solid #eaeaea',
                                                                alignItems: 'center'
                                                            }}>
                                                                {
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
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>2月当月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#aabb53',
                                                                }}>{item1.value1}</div>
                                                            </div>
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
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#aabb53',
                                                                }}>{item1.value2}</div>
                                                            </div>
                                                            <div style={{
                                                                fontSize: '0.12rem',
                                                                color: '#6f6f6f',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                borderRight: '1px solid #eaeaea',
                                                                alignItems: 'center'
                                                            }}>


                                                                {
                                                                    item1.value3 > 0 ? <img style={{
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
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)
                                                                </div>
                                                                <div style={{
                                                                    color: '#aabb53',
                                                                }}>{item1.value3}</div>
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
                    {/*<Table style={{width: '880px'}} dataSource={list[name[0]]} columns={name[0]!='9'?columns1:columns2} pagination={false}*/}
                    {/*       components={{*/}
                    {/*           header: {*/}
                    {/*               cell: ({children, ...restProps}) => (*/}
                    {/*                   <th {...restProps} style={{*/}
                    {/*                       backgroundColor: '#5070ed',*/}
                    {/*                       color: '#fff',*/}
                    {/*                       // border: '1px solid #fff',*/}
                    {/*                       textAlign: 'center',*/}
                    {/*                   }}>*/}
                    {/*                       {children}*/}
                    {/*                   </th>*/}
                    {/*               )*/}
                    {/*           }*/}
                    {/*       }}*/}
                    {/*/>*/}
                </div>

            </div>
        </div>
    )
}
