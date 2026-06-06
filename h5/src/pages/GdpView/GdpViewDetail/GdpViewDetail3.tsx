import TopBar from "../../../components/TopBar/TopBar.tsx";
import {useEffect, useState} from "react";
import AreaPick1 from "../../../components/YearPick/economy/AreaPick1.tsx";
import MonthPick2 from "../../../components/YearPick/MonthPick2.tsx";

type DataRow = { subTitle: string; value: string; value1: number; value2: string; value3: number };
type ListGroup = { name?: string; data: DataRow[] };

export default function GdpViewDetail3() {
    const list = [
        {
            name: '参与核算的规上服务业企业开票情况',
            data: [
                { subTitle: "合计", value: "25.29", value1: 36.70, value2: "55.58", value3: 8.34 },
            ]
        },
        {
            name: '分市(区)',
            data: [
                { subTitle: "海陵区", value: "3.65", value1: 26.74, value2: "7.38", value3: 0.82 },
                { subTitle: "医药高新区（高港区）", value: "7.73", value1: 29.92, value2: "16.14", value3: 4.33 },
                { subTitle: "姜堰区", value: "2.53", value1: 67.55, value2: "6.61", value3: 58.89 },
                { subTitle: "兴化市", value: "2.48", value1: 22.77, value2: "4.90", value3: -3.54 },
                { subTitle: "靖江市", value: "4.83", value1: 52.37, value2: "11.87", value3: 20.75 },
                { subTitle: "泰兴市", value: "4.07", value1: 37.04, value2: "8.68", value3: -8.05 },
            ]
        },
        {
            name: '分行业',
            data: [
                { subTitle: "其他运输业", value: "2.70", value1: -19.64, value2: "6.47", value3: -5.69 },
                { subTitle: "互联网和信息技术服务业", value: "1.57", value1: 40.18, value2: "3.57", value3: 10.53 },
                { subTitle: "其他房地产业", value: "2.81", value1: 21.12, value2: "5.02", value3: -8.56 },
                { subTitle: "租赁和商务服务业", value: "8.12", value1: 31.82, value2: "18.66", value3: 18.85 },
                { subTitle: "科研技术服务业", value: "6.63", value1: 91.07, value2: "14.38", value3: 10.45 },
                { subTitle: "水利环境和公共设施管理业", value: "2.64", value1: 98.50, value2: "5.50", value3: 10.89 },
                { subTitle: "居民服务业", value: "0.49", value1: 2.08, value2: "1.13", value3: -0.88 },
                { subTitle: "文体娱乐业", value: "0.33", value1: 32.00, value2: "0.85", value3: -4.49 },
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
            <TopBar title={'参与核算的规上服务业企业开票情况'} time={false}/>
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
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
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
