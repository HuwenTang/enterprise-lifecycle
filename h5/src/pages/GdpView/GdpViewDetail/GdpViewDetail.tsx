import TopBar from "../../../components/TopBar/TopBar.tsx";
import {useEffect, useState} from "react";
import AreaPick1 from "../../../components/YearPick/economy/AreaPick1.tsx";
import MonthPick2 from "../../../components/YearPick/MonthPick2.tsx";
import GdpPicker2 from "../../../components/YearPick/GdpPicker2.tsx";

type DataRow = { subTitle: string; value: string; value1: number; value2: string; value3: number };
type ListGroup = { name?: string; data: DataRow[] };

export default function GdpViewDetail() {
    const list = [
        {
            name: '全部工业企业实时开票',
            data: [
                { subTitle: '全市', value: '611.60', value1: 5.66, value2: '1463.00', value3: 7.11 },
            ]
        },
        { data: [{ subTitle: '海陵区', value: '50.29', value1: 9.65, value2: '111.18', value3: 10.03 }] },
        { data: [{ subTitle: "医药高新区（高港区）", value: "131.72", value1: 1.33, value2: "301.41", value3: -1.38 }] },
        { data: [{ subTitle: "姜堰区", value: "67.18", value1: -14.40, value2: "167.70", value3: 7.76 }] },
        { data: [{ subTitle: "兴化市", value: "79.55", value1: 17.86, value2: "202.12", value3: 20.55 }] },
        { data: [{ subTitle: "靖江市", value: "142.07", value1: 35.29, value2: "338.39", value3: 11.22 }] },
        { data: [{ subTitle: '泰兴市', value: '140.78', value1: -7.38, value2: '342.18', value3: 3.19 }] },
    ]
    const list1 = [
        {
            name: '建筑业开票',
            data: [
                { subTitle: '全市', value: '168.16', value1: 390.72, value2: '295.18', value3: -1.27 },
            ]
        },
        { data: [{ subTitle: '海陵区', value: '25.66', value1: 294.08, value2: '45.24', value3: 12.83 }] },
        { data: [{ subTitle: "医药高新区（高港区）", value: "19.06", value1: 373.38, value2: "32.18", value3: -1.87 }] },
        { data: [{ subTitle: "姜堰区", value: "29.55", value1: 756.04, value2: "48.69", value3: -6.82 }] },
        { data: [{ subTitle: "兴化市", value: "18.54", value1: 783.19, value2: "31.55", value3: 20.61 }] },
        { data: [{ subTitle: "靖江市", value: "34.64", value1: 510.77, value2: "66.27", value3: -1.18 }] },
        { data: [{ subTitle: '泰兴市', value: '40.70', value1: 227.15, value2: '71.20', value3: -11.52 }] },
    ]
    const list2 = [
        {
            name: '服务业开票',
            data: [
                { subTitle: '全市', value: '421.42', value1: 4.20, value2: '989.51', value3: -4.39 },
            ]
        },
        { data: [{ subTitle: '海陵区', value: '73.47', value1: 14.56, value2: '167.68', value3: 0.58 }] },
        { data: [{ subTitle: "医药高新区（高港区）", value: "102.26", value1: -13.03, value2: "243.39", value3: -14.73 }] },
        { data: [{ subTitle: "姜堰区", value: "42.28", value1: 5.61, value2: "98.98", value3: 14.16 }] },
        { data: [{ subTitle: "兴化市", value: "52.29", value1: 9.44, value2: "126.54", value3: 1.95 }] },
        { data: [{ subTitle: "靖江市", value: "92.53", value1: 22.05, value2: "213.05", value3: 0.65 }] },
        { data: [{ subTitle: '泰兴市', value: '55.12', value1: 1.05, value2: '132.21', value3: -11.52 }] },
    ]
    const list3 = [
        {
            name: '房地产业开票',
            data: [
                { subTitle: '全市', value: '23.07', value1: 0.83, value2: '51.10', value3: -21.99 },
            ]
        },
        { data: [{ subTitle: '海陵区', value: '6.47', value1: 13.60, value2: '12.88', value3: -16.32 }] },
        { data: [{ subTitle: "医药高新区（高港区）", value: "3.89", value1: 15.58, value2: "8.04", value3: -8.86 }] },
        { data: [{ subTitle: "姜堰区", value: "1.56", value1: 21.59, value2: "4.64", value3: 102.86 }] },
        { data: [{ subTitle: "兴化市", value: "1.68", value1: -52.90, value2: "4.29", value3: -41.82 }] },
        { data: [{ subTitle: "靖江市", value: "5.38", value1: 518.16, value2: "11.19", value3: 61.08 }] },
        { data: [{ subTitle: '泰兴市', value: '4.08', value1: -49.56, value2: '10.04', value3: -59.29 }] },
    ]
    const list4 = [
        {
            name: '批发业开票',
            data: [
                { subTitle: '全市', value: '179.36', value1: -0.05, value2: '432.06', value3: 0.05 },
            ]
        },
        { data: [{ subTitle: '海陵区', value: '27.88', value1: 25.25, value2: '69.79', value3: 23.22 }] },
        { data: [{ subTitle: "医药高新区（高港区）", value: "26.59", value1: -28.62, value2: "62.60", value3: -24.55 }] },
        { data: [{ subTitle: "姜堰区", value: "22.20", value1: 1.98, value2: "51.08", value3: 11.48 }] },
        { data: [{ subTitle: "兴化市", value: "26.17", value1: 9.32, value2: "66.62", value3: 5.76 }] },
        { data: [{ subTitle: "靖江市", value: "57.17", value1: 7.30, value2: "132.65", value3: 1.68 }] },
        { data: [{ subTitle: '泰兴市', value: '19.33', value1: -7.74, value2: '49.23', value3: -6.96 }] },
    ]
    const list5 = [
        {
            name: '零售业开票',
            data: [
                { subTitle: '全市', value: '90.33', value1: -6.49, value2: '220.63', value3: -8.76 },
            ]
        },
        { data: [{ subTitle: '海陵区', value: '12.65', value1: 35.15, value2: '27.53', value3: 18.81 }] },
        { data: [{ subTitle: "医药高新区（高港区）", value: "45.94", value1: -19.33, value2: "114.75", value3: -17.17 }] },
        { data: [{ subTitle: "姜堰区", value: "5.87", value1: -19.21, value2: "13.90", value3: -7.47 }] },
        { data: [{ subTitle: "兴化市", value: "7.66", value1: 29.06, value2: "18.99", value3: 20.68 }] },
        { data: [{ subTitle: "靖江市", value: "6.87", value1: 16.63, value2: "15.74", value3: -6.08 }] },
        { data: [{ subTitle: '泰兴市', value: '11.33', value1: 1.72, value2: '29.59', value3: -8.85 }] },
    ]
    const list6 = [
        {
            name: '制造业重点行业开票',
            data: [
                { subTitle: "医药制造业", value: "33.94", value1: 28.13, value2: "86.30", value3: 8.23 },
            ]
        },
        { data: [{ subTitle: "农副食品加工业", value: "34.47", value1: -6.85, value2: "86.01", value3: 3.75 }] },
        { data: [{ subTitle: "食品制造业", value: "14.87", value1: 23.64, value2: "34.33", value3: 20.18 }] },
        { data: [{ subTitle: "化学原料和化学制品制造业", value: "57.27", value1: -22.84, value2: "134.37", value3: -8.54 }] },
        { data: [{ subTitle: "金属制品业", value: "60.70", value1: 13.75, value2: "141.05", value3: 6.87 }] },
        { data: [{ subTitle: "汽车制造业", value: "30.08", value1: -2.80, value2: "72.46", value3: 1.93 }] },
        { data: [{ subTitle: "橡胶和塑料制品业", value: "15.43", value1: 12.72, value2: "36.55", value3: 7.67 }] },
        { data: [{ subTitle: '通用设备制造业', value: '53.67', value1: 21.22, value2: '131.32', value3: 12.52 }] },
        {
            data: [
                { subTitle: "铁路、船舶、航空航天和其他运输设备制造业", value: "45.21", value1: 89.84, value2: "101.21", value3: 1.71 },
                { subTitle: "#船舶及相关装置制造业", value: "42.53", value1: 97.04, value2: "95.24", value3: 0.71 },
            ]
        },
        {
            data: [
                { subTitle: "电气机械和器材制造业", value: "45.92", value1: 12.38, value2: "102.92", value3: 13.51 },
                { subTitle: "#光伏设备及元器件制造业", value: "6.07", value1: 3.92, value2: "14.25", value3: 8.80 },
            ]
        },
        {
            data: [
                { subTitle: "计算机、通信和其他电子设备制造业", value: "14.63", value1: 2.40, value2: "31.38", value3: 8.12 },
                { subTitle: "#锂离子电池制造业", value: "6.59", value1: 45.57, value2: "15.83", value3: 54.09 },
            ]
        },
    ]
    const list7 = [
        {
            name: '服务业重点行业开票',
            data: [
                { subTitle: "批发和零售业", value: "269.69", value1: -2.30, value2: "652.69", value3: -3.11 },
                { subTitle: "#批发业", value: "179.36", value1: -0.05, value2: "432.06", value3: 0.05 },
                { subTitle: "#零售业", value: "90.33", value1: -6.49, value2: "220.63", value3: -8.76 },
            ]
        },
        {
            data: [
                { subTitle: "住宿和餐饮业", value: "4.15", value1: 18.58, value2: "8.39", value3: -7.15 },
                { subTitle: "#住宿业", value: "0.60", value1: 10.32, value2: "1.28", value3: -5.55 },
                { subTitle: "#餐饮业", value: "3.55", value1: 20.09, value2: "7.11", value3: -7.44 },
            ]
        },
        { data: [{ subTitle: "金融业", value: "10.78", value1: -29.74, value2: "28.55", value3: -28.11 }] },
        { data: [{ subTitle: "房地产业", value: "23.07", value1: 0.83, value2: "51.10", value3: -21.99 }] },
        {
            data: [
                { subTitle: "交通运输、仓储和邮政业", value: "21.64", value1: 25.36, value2: "49.50", value3: 8.06 },
                { subTitle: "#装卸搬运和仓储业", value: "3.53", value1: 14.62, value2: "8.75", value3: 11.65 },
            ]
        },
        { data: [{ subTitle: "水利、环境和公共设施管理业", value: "3.60", value1: 234.98, value2: "6.04", value3: 5.19 }] },
        { data: [{ subTitle: "文化、体育和娱乐业", value: "1.96", value1: 381.32, value2: "4.40", value3: 194.00 }] },
        { data: [{ subTitle: "居民服务、修理和其他服务业", value: "5.61", value1: 81.77, value2: "12.22", value3: 15.37 }] },
        { data: [{ subTitle: "租赁和商务服务业", value: "30.43", value1: 37.31, value2: "63.27", value3: -8.08 }] },
        { data: [{ subTitle: "信息传输、软件和信息技术服务业", value: "4.96", value1: 14.20, value2: "12.55", value3: 0.49 }] },
        { data: [{ subTitle: "互联网和相关服务业", value: "0.23", value1: 4.94, value2: "0.55", value3: -21.41 }] },
        { data: [{ subTitle: "科学研究和技术服务业", value: "32.48", value1: 83.75, value2: "69.01", value3: 24.71 }] },
    ]
    const [year, setYear] = useState('2025')
    const [season, setSeason] = useState('12月')
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
            <TopBar title={'重点行业全口径开票情况'} time={false}/>
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
                        <div style={{width: '40%'}}><GdpPicker2 year={type} setYear={setType}/></div>
                    </div>
                    {
                        (type === '全部' || type === '全部工业企业实时开票') && list.map((item: ListGroup, index: number) => {
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
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
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
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
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
                                                                    Number(item1.value2) > 0 ? <img style={{
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

                    {
                        (type === '全部' || type === '建筑业开票') && list1.map((item: ListGroup, index: number) => {
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
                                                background: 'linear-gradient(to right, #375fed, #7996f2)',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                                            src="/img/GDP/up02.png"
                                                                                            alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                            src="/img/GDP/down02.png"
                                                                                                            alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                    Number(item1.value2) > 0 ? <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                             src="/img/GDP/up02.png"
                                                                                             alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                             src="/img/GDP/down02.png"
                                                                                                             alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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

                    {
                        (type === '全部' || type === '服务业开票') && list2.map((item: ListGroup, index: number) => {
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
                                                background: 'linear-gradient(to right, #375fed, #7996f2)',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                                            src="/img/GDP/up02.png"
                                                                                            alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                            src="/img/GDP/down02.png"
                                                                                                            alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                    Number(item1.value2) > 0 ? <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                             src="/img/GDP/up02.png"
                                                                                             alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                             src="/img/GDP/down02.png"
                                                                                                             alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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

                    {
                        (type === '全部' || type === '房地产业开票') && list3.map((item: ListGroup, index: number) => {
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
                                                background: 'linear-gradient(to right, #375fed, #7996f2)',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                                            src="/img/GDP/up02.png"
                                                                                            alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                            src="/img/GDP/down02.png"
                                                                                                            alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                    Number(item1.value2) > 0 ? <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                             src="/img/GDP/up02.png"
                                                                                             alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                             src="/img/GDP/down02.png"
                                                                                                             alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                    {
                        (type === '全部' || type === '批发业开票') && list4.map((item: ListGroup, index: number) => {
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
                                                background: 'linear-gradient(to right, #375fed, #7996f2)',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                                            src="/img/GDP/up02.png"
                                                                                            alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                            src="/img/GDP/down02.png"
                                                                                                            alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                    Number(item1.value2) > 0 ? <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                             src="/img/GDP/up02.png"
                                                                                             alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                             src="/img/GDP/down02.png"
                                                                                                             alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                    {
                        (type === '全部' || type === '零售业开票') && list5.map((item: ListGroup, index: number) => {
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
                                                background: 'linear-gradient(to right, #375fed, #7996f2)',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                                            src="/img/GDP/up02.png"
                                                                                            alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                            src="/img/GDP/down02.png"
                                                                                                            alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                    Number(item1.value2) > 0 ? <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                             src="/img/GDP/up02.png"
                                                                                             alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                             src="/img/GDP/down02.png"
                                                                                                             alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                    {
                        (type === '全部' || type === '制造业重点行业开票') && list6.map((item: ListGroup, index: number) => {
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
                                                background: 'linear-gradient(to right, #375fed, #7996f2)',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                                            src="/img/GDP/up02.png"
                                                                                            alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                            src="/img/GDP/down02.png"
                                                                                                            alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                    Number(item1.value2) > 0 ? <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                             src="/img/GDP/up02.png"
                                                                                             alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                             src="/img/GDP/down02.png"
                                                                                                             alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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

                    {
                        (type === '全部' || type === '服务业重点行业开票') && list7.map((item: ListGroup, index: number) => {
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
                                                background: 'linear-gradient(to right, #375fed, #7996f2)',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                                            src="/img/GDP/up02.png"
                                                                                            alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                            src="/img/GDP/down02.png"
                                                                                                            alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                     src="/img/GDP/y.png" alt=""/>
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>总量(亿元)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
                                                                    Number(item1.value2) > 0 ? <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                             src="/img/GDP/up02.png"
                                                                                             alt=""/> : <img style={{
                                                                        width: '0.3rem',
                                                                        marginBottom: '0.05rem'
                                                                    }}
                                                                                                             src="/img/GDP/down02.png"
                                                                                                             alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>同比增速(%)</div>
                                                                <div style={{
                                                                    color: '#6e8ce5',
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
