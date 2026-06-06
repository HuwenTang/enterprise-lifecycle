import TopBar from "../../../components/TopBar/TopBar.tsx";
import {useEffect, useState} from "react";
import AreaPick1 from "../../../components/YearPick/economy/AreaPick1.tsx";
import MonthPick2 from "../../../components/YearPick/MonthPick2.tsx";

export default function GdpViewDetail5() {
    const list = [
        {
            name: '海陵区、医药高新区（高港区）',
            data: [
                {
                    subTitle: '制造业', 
                    value: '48146.93',
                    value1: -0.76,
                    value2: '27.81',
                    value3: -4.08
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '医药制造业',
                    value: '6163.91',
                    value1: -4.12,
                    value2: '2.89',
                    value3: -3.63
                },
                {
                    subTitle: ' #中成药生产',
                    value: '981.65',
                    value1: -33.26,
                    value2: '0.45',
                    value3: -28.85
                },
                {
                    subTitle: '#生物药品制品制造',
                    value: '2837.49',
                    value1: 6.50,
                    value2: '1.31',
                    value3: 8.37
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '医疗仪器设备及器械制造业',
                    value: '99.12',
                    value1: -18.26,
                    value2: '0.04',
                    value3: -23.35
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '农副食品加工业',
                    value: '3266.98',
                    value1: 16.68,
                    value2: '1.84',
                    value3: 8.58
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '食品制造业',
                    value: '497.35',
                    value1: 2.76,
                    value2: '0.24',
                    value3: 10.83
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '石油、煤炭及其他燃料加工业',
                    value: '4431.35',
                    value1: -1.75,
                    value2: '2.73',
                    value3: 0.07
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '金属制品业',
                    value: '9860.43',
                    value1: 3.85,
                    value2: '5.30',
                    value3: -4.35
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '汽车制造业',
                    value: '9860.43',
                    value1: 3.85,
                    value2: '5.30',
                    value3: -4.35
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '通用设备制造业',
                    value: '5649.41',
                    value1: -2.40,
                    value2: '3.56',
                    value3: 0.25
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '铁路、船舶、航空航天和其他运输设备制造业',
                    value: '1784.57',
                    value1: 6.48,
                    value2: '1.03',
                    value3: 2.04
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '计算机、通信和其他电子设备制造业',
                    value: '2066.08',
                    value1: 17.78,
                    value2: '1.02',
                    value3: 6.57
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '电气机械和器材制造业',
                    value: '2066.08',
                    value1: 17.78,
                    value2: '1.02',
                    value3: 6.57
                },{
                    subTitle: '#光伏设备及元器件制造业',
                    value: '86.39',
                    value1: -57.06,
                    value2: '0.06',
                    value3:-92.28
                },
            ]
        },
        {
            name:'姜堰区',
            data: [
                {
                    subTitle: '制造业',
                    value: '20408.38',
                    value1: -2.35,
                    value2: '13.10',
                    value3: -4.81
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '医药制造业',
                    value: '310.93',
                    value1: 9.39,
                    value2: '0.17',
                    value3: 0.12
                },{
                    subTitle: ' #中成药生产',
                    value: '198.15',
                    value1:16.52,
                    value2: '0.11',
                    value3:6.78
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '医疗仪器设备及器械制造业',
                    value: '229.78',
                    value1: 4.66,
                    value2: '0.14',
                    value3:-0.52
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '橡胶和塑料制品业',
                    value: '1075.59',
                    value1: -24.58,
                    value2: '0.85',
                    value3:-11.53
                },{
                    subTitle: '#塑料制品业',
                    value: '768.89',
                    value1: -27.67,
                    value2: '0.64',
                    value3:-12.02
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '有色金属冶炼和压延加工业',
                    value: '661.32',
                    value1: -27.62,
                    value2: '0.61',
                    value3:-11.59
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '金属制品业',
                    value: '3058.08',
                    value1: 0.45,
                    value2: '2.00',
                    value3:1.56
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '汽车制造业',
                    value: '335.04',
                    value1: -5.48,
                    value2: '0.19',
                    value3:-13.68
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '计算机、通信和其他电子设备制造业',
                    value: '1337.36',
                    value1: 58.93,
                    value2: '0.66',
                    value3:25.07
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '通用设备制造业',
                    value: '4025.38',
                    value1:-6.30,
                    value2: '2.61',
                    value3:2.61
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '电气机械和器材制造业',
                    value: '2078.32',
                    value1:-14.32,
                    value2: '1.42',
                    value3:-2.11
                },
                {
                    subTitle: '#光伏设备及元器件制造业',
                    value: '2.63',
                    value1:-97.00,
                    value2: '0.002',
                    value3:-98.09
                }
            ]
        },
        {
            name: '兴化市',
            data: [
                {
                    subTitle: '制造业',
                    value: '52361.03',
                    value1:3.10,
                    value2: '34.28',
                    value3:3.16
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '农副食品加工业',
                    value: '3962.04',
                    value1:8.34,
                    value2: '4.20',
                    value3:79.84
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '食品制造业',
                    value: '1519.47',
                    value1:-4.75,
                    value2: '0.82',
                    value3:-3.64
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '金属制品业',
                    value: '33331.99',
                    value1:10.70,
                    value2: '20.04',
                    value3:0.62
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '橡胶和塑料制品业',
                    value: '1789.99',
                    value1:-3.65,
                    value2: '1.19',
                    value3:-2.59
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '通用设备制造业',
                    value: '4726.78',
                    value1:-3.41,
                    value2: '3.12',
                    value3:-5.28
                }
            ]
        },
        {
            name:'靖江市',
            data: [
                {
                    subTitle: '制造业',
                    value: '27291.02',
                    value1:-1.15,
                    value2: '17.60',
                    value3:4.24
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '医药制造业',
                    value: '27291.02',
                    value1:-92.82,
                    value2: '0.44',
                    value3:43.10
                },
                {
                    subTitle: '##生物药品制品制造业',
                    value: '51.76',
                    value1:-95.98,
                    value2: '0.41',
                    value3:47.23
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '黑色金属冶炼和压延加工业',
                    value: '3865.70',
                    value1:-1.61,
                    value2: '2.69',
                    value3:-5.49
                },
                {
                    subTitle: '#钢铁',
                    value: '3865.69',
                    value1:-1.54,
                    value2: '2.69',
                    value3:-5.44
                }
            ]
        },
        {
            data: [
                {
                    subTitle: '金属制品业',
                    value: '4815.98',
                    value1:-2.63,
                    value2: '3.28',
                    value3:2.51
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '通用设备制造业',
                    value: '5393.75',
                    value1:15.29,
                    value2: '3.45',
                    value3:11.81
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '铁路、船舶、航空航天和其他运输设备制造业',
                    value: '5762.28',
                    value1:3.07,
                    value2: '3.00',
                    value3:-1.07
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '电气机械和器材制造业',
                    value: '1354.27',
                    value1:-10.02,
                    value2: '1.02',
                    value3:-3.93
                },
            ]
        },
        {
            name: '泰兴市',
            data: [
                {
                    subTitle: '制造业',
                    value: '66403.77',
                    value1:0.91,
                    value2: '42.57',
                    value3:4.45
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '医药制造业',
                    value: '2813.77',
                    value1:13.01,
                    value2: '1.30',
                    value3:5.06
                },

            ]
        },
        {
            data: [
                {
                    subTitle: '医疗仪器设备及器械制造',
                    value: '186.52',
                    value1:22.57,
                    value2: '0.11',
                    value3:14.75
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '农副食品加工业',
                    value: '1743.81',
                    value1:-0.87,
                    value2: '0.94',
                    value3:-0.91
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '食品制造业',
                    value: '1119.24',
                    value1:24.87,
                    value2: '0.60',
                    value3:11.74
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '金属制品业',
                    value: '4547.59',
                    value1:13.30,
                    value2: '2.83',
                    value3:14.77
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '化学原料和化学制品制造业',
                    value: '35096.97',
                    value1:-1.01,
                    value2: '23.83',
                    value3:4.01
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '通用设备制造业',
                    value: '3958.26',
                    value1:9.46,
                    value2: '2.59',
                    value3:12.78
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '铁路、船舶、航空航天和其他运输设备制造业',
                    value: '1605.52',
                    value1:13.07,
                    value2: '0.87',
                    value3:7.88
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '汽车制造业',
                    value: '451.51',
                    value1:-19.66,
                    value2: '0.30',
                    value3:-11.87
                },
            ]
        },
        {
            data: [
                {
                    subTitle: '电气机械和器材制造业',
                    value: '1238.50',
                    value1:-2.55,
                    value2: '0.72',
                    value3:6.32
                },
                {
                    subTitle: '#光伏设备及元器件制造',
                    value: '38.29',
                    value1:57.49,
                    value2: '0.02',
                    value3:52.11
                },
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
            <TopBar title={'各市（区）制造业重点行业用电量情况表'} time={false}/>
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
                                                                <div style={{marginBottom: '0.05rem'}}>9月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>用电量</div>
                                                                <div style={{marginBottom: '0.05rem'}}>万千瓦时</div>
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
                                                                <div style={{marginBottom: '0.05rem'}}>9月</div>
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
                                                                <div style={{marginBottom: '0.05rem'}}>1-7月</div>
                                                                <div
                                                                    style={{marginBottom: '0.05rem'}}>用电量
                                                                </div>
                                                                <div style={{marginBottom: '0.05rem'}}>万千瓦时</div>
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
                                                                    item1.value2 > 0 ? < img style={{
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
                                                                <div style={{marginBottom: '0.05rem'}}>1-7月</div>
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
