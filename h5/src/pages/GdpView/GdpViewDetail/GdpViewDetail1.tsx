import TopBar from "../../../components/TopBar/TopBar.tsx";
import {useEffect, useState} from "react";
import AreaPick1 from "../../../components/YearPick/economy/AreaPick1.tsx";
import MonthPick2 from "../../../components/YearPick/MonthPick2.tsx";

type DataRow = { subTitle: string; value: string; value1: number; value2: string; value3: number };
type ListGroup = { name?: string; data: DataRow[] };

export default function GdpViewDetail1() {
    const list = [
        {
            name: '规上工业企业实时开票情况',
            data: [
                { subTitle: "全市", value: "454.87", value1: 1.36, value2: "1089.97", value3: 2.96 },
                { subTitle: "海陵区", value: "39.83", value1: 9.95, value2: "86.46", value3: 10.93 },
                { subTitle: "医药高新区（高港区）", value: "116.37", value1: -1.29, value2: "267.82", value3: -2.27 },
                { subTitle: "姜堰区", value: "45.19", value1: 3.39, value2: "102.73", value3: 4.53 },
                { subTitle: "兴化市", value: "55.34", value1: 2.63, value2: "140.93", value3: 10.69 },
                { subTitle: "靖江市", value: "99.60", value1: 25.38, value2: "243.98", value3: 7.08 },
                { subTitle: "泰兴市", value: "98.54", value1: -16.19, value2: "248.05", value3: -2.05 },
            ]
        },
    ]

    const [year, setYear] = useState('2026')
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
            <TopBar title={'规上工业企业实时开票情况'} time={false}/>
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
