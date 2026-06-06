import TopBar from "../../../components/TopBar/TopBar.tsx";
import {useEffect, useState} from "react";
import AreaPick1 from "../../../components/YearPick/economy/AreaPick1.tsx";
import MonthPick2 from "../../../components/YearPick/MonthPick2.tsx";

type DataRow = { subTitle?: string; value: string; value1: number; value2: string; value3: number };
type ListGroup = { name?: string; data: DataRow[]; unit1?: string; unit2?: string };

export default function GdpViewDetail4() {
    const list: ListGroup[] = [
        {
            name: '工业用电量情况',
            unit1: '亿千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: "全市", value: "16.17", value1: -15.62, value2: "43.27", value3: 9.26 },
                { subTitle: "海陵区、医药高新区（高港区）", value: "3.75", value1: -7.35, value2: "9.39", value3: 9.58 },
                { subTitle: "姜堰区", value: "1.35", value1: -22.82, value2: "3.88", value3: 6.79 },
                { subTitle: "兴化市", value: "2.75", value1: -35.99, value2: "9.41", value3: 9.04 },
                { subTitle: "靖江市", value: "2.47", value1: -10.32, value2: "6.62", value3: 17.73 },
                { subTitle: "泰兴市", value: "5.84", value1: -7.38, value2: "13.97", value3: 6.27 },
            ]
        },
        {
            name: '制造业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                {subTitle: '制造业（合作）',value: "128904.89", value1: -18.59, value2: "35.66", value3: 9.4 },
            ]
        },
        {
            name: '生物医药产业集群',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '医药制造业', value: "5637.92", value1: -3.52, value2: "1.35", value3: 11.72 },
                { subTitle: '#中成药生产', value: "578.44", value1: -16.51, value2: "0.15", value3: 18.3 },
                { subTitle: '生物药品制品制造', value: "3188.66", value1: 7.51, value2: "0.72", value3: 14.8 },
                { subTitle: '医疗仪器设备及器械制造业', value: "284.63", value1: -25.68, value2: "0.09", value3: 12.79 },
            ]
        },
        {
            name: '健康食品产业集群',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '农副食品加工业', value: "4677.15", value1: -19.27, value2: "1.38", value3: 4.38 },
                { subTitle: '食品制造业', value: "2004.43", value1: -6.75, value2: "0.57", value3: 23.63 },
            ]
        },
        {
            name: '海工装备和高技术船舶产业集群',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '铁路、船舶、航空航天和其他运输设备制造业', value: "4596.40", value1: -18.85, value2: "1.66", value3: 38.35 },
            ]
        },
        {
            name: '化工及新材料产业集群',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '化学原料和化学制品制造业', value: "30934.62", value1: -2.12, value2: "6.76", value3: 1.04 },
            ]
        },
        {
            name: '金属新材料及制品产业集群',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '金属制品业', value: "27864.69", value1: -27.71, value2: "8.97", value3: 16.79 },
            ]
        },
        {
            name: '汽车及零部件产业集群',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '汽车制造业', value: "2029.76", value1: -21.16, value2: "0.57", value3: 8.77 },
            ]
        },
        {
            name: '新一代信息技术和智能装备产业集群',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '计算机、通信和其他电子设备制造业', value: "2888.21", value1: -18.54, value2: "0.78", value3: 7.91 },
            ]
        },
        {
            name: '新能源产业集群',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '电气机械和器材制造业', value: "4071.02", value1: -26.93, value2: "1.14", value3: -1.97 },
                { subTitle: '#光伏设备及元器件制造业', value: "100.99", value1: -70.92, value2: "0.03", value3: -58.76 },
            ]
        },
        {
            name: '建筑业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle:'建筑业（合计）', value: "1212.24", value1: -24.18, value2: "0.39", value3: 13.99 },
            ]
        },
        {
            name: '房屋建筑业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '房屋建筑业', value: "485.21", value1: -17.73, value2: "0.14", value3: 4.13 },
            ]
        },
        {
            name: '土木工程建筑业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '土木工程建筑业', value: "136.37", value1: -20.16, value2: "0.05", value3: 25.48 },
            ]
        },
        {
            name: '建筑安装业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '建筑安装业', value: "83.61", value1: -14.86, value2: "0.02", value3: 20.55 },
            ]
        },
        {
            name: '建筑装饰装修和其他建筑业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '建筑装饰装修和其他建筑业', value: "507.04", value1: -31.48, value2: "0.18", value3: 18.84 },
            ]
        },
        {
            name: '服务业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                {subTitle:'服务业（合计）', value: "40097.59", value1: -6.47, value2: "9.44", value3: 4.53 },
            ]
        },
        {
            name: '批发和零售业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '批发和零售业', value: "10829.00", value1: -0.31, value2: "2.48", value3: 7.3 },
            ]
        },
        {
            name: '住宿和餐饮业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '住宿和餐饮业', value: "3689.85", value1: -2.36, value2: "0.84", value3: 4.63 },
            ]
        },
        {
            name: '金融业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '金融业', value: "701.79", value1: -11.99, value2: "0.17", value3: 1.42 },
            ]
        },
        {
            name: '房地产业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '房地产业', value: "4663.78", value1: -7.33, value2: "1.06", value3: -0.34 },
            ]
        },
        {
            name: '交通运输、仓储和邮政业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '交通运输、仓储和邮政业', value: "2698.35", value1: 5.64, value2: "0.66", value3: 19.18 },
                { subTitle: '#铁路运输业', value: "253.90", value1: 21.21, value2: "0.05", value3: 18.44 },
                { subTitle: '#道路运输业', value: "594.18", value1: 13.38, value2: "0.13", value3: 18.67 },
                { subTitle: '#水上运输业', value: "92.50", value1: -28.54, value2: "0.03", value3: -4.86 },
                { subTitle: '#装卸搬运和仓储业', value: "1498.74", value1: 7.77, value2: "0.39", value3: 24.9 },
            ]
        },
        {
            name: '水利、环境和公共设施管理业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '水利、环境和公共设施管理业', value: "2873.21", value1: -0.78, value2: "0.62", value3: 0.59 },
            ]
        },
        {
            name: '教育、文化、体育和娱乐业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '教育、文化、体育和娱乐业', value: "2120.93", value1: -33.82, value2: "0.68", value3: 5.12 },
            ]
        },
        {
            name: '居民服务、修理和其他服务业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '居民服务、修理和其他服务业', value: "1984.69", value1: -10.66, value2: "0.47", value3: 1.27 },
            ]
        },
        {
            name: '租赁和商务服务业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '租赁和商务服务业', value: "1426.01", value1: -9.33, value2: "0.34", value3: 3.94 },
            ]
        },
        {
            name: '信息传输、软件和信息技术服务业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '信息传输、软件和信息技术服务业', value: "2356.99", value1: -1.42, value2: "0.50", value3: -0.21 },
            ]
        },
        {
            name: '互联网和相关服务业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '互联网和相关服务业', value: "843.61", value1: -1.91, value2: "0.18", value3: -0.75 },
            ]
        },
        {
            name: '科学研究和技术服务业',
            unit1: '万千瓦时',
            unit2: '亿千瓦时',
            data: [
                { subTitle: '科学研究和技术服务业', value: "581.72", value1: -16.08, value2: "0.14", value3: -0.48 },
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
            <TopBar title={'重点监测行业用电量情况表'} time={false}/>
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
                            const isBlue = ['制造业', '服务业', '建筑业'].includes(item.name ?? '') || (item.name ?? '').indexOf('合计') > -1
                            return (
                                <div key={index}>
                                    <div>
                                        {
                                            item.name && <div style={{
                                                paddingLeft: '0.2rem',
                                                height: '0.5rem',
                                                fontSize: '0.16rem',
                                                lineHeight: '0.5rem',
                                                borderRadius: '0.07rem',
                                                background: isBlue ? 'linear-gradient(to right, #375fed, #7996f2)' : 'linear-gradient(to right, #6fa84a, #a4ca91)',
                                                color: '#fff',
                                            }}>
                                                {item.name}
                                            </div>
                                        }
                                    </div>
                                    <div style={{
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
                                                        }}>{item1.subTitle ?? item.name ?? ''}</div>
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


                                                                {
                                                                    isBlue ?
                                                                        <img style={{
                                                                            width: '0.3rem',
                                                                            marginBottom: '0.05rem'
                                                                        }}
                                                                             src="/img/GDP/y.png" alt=""/> :
                                                                        <img style={{
                                                                            width: '0.3rem',
                                                                            marginBottom: '0.05rem'
                                                                        }}
                                                                             src="/img/GDP/y1.png" alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>2月当月</div>
                                                                <div style={{marginBottom: '0.05rem'}}>用电量</div>
                                                                <div style={{marginBottom: '0.05rem'}}>({item?.unit1 ?? '万千瓦时'})</div>
                                                                <div style={{
                                                                    color: isBlue ? "#6e8ce5" : '#aabb53',
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
                                                                    isBlue ? item1.value1 > 0 ? <img style={{
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
                                                                        :
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
                                                                    color: isBlue ? "#6e8ce5" : '#aabb53',
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
                                                                {
                                                                    isBlue ?
                                                                        <img style={{
                                                                            width: '0.3rem',
                                                                            marginBottom: '0.05rem'
                                                                        }}
                                                                             src="/img/GDP/y.png" alt=""/> :
                                                                        <img style={{
                                                                            width: '0.3rem',
                                                                            marginBottom: '0.05rem'
                                                                        }}
                                                                             src="/img/GDP/y1.png" alt=""/>
                                                                }
                                                                <div style={{marginBottom: '0.05rem'}}>1-2月</div>
                                                                <div
                                                                    style={{marginBottom: '0.05rem'}}>用电量
                                                                </div>
                                                                <div style={{marginBottom: '0.05rem'}}>({item?.unit2 ?? '万千瓦时'})</div>
                                                                <div style={{
                                                                    color: isBlue ? "#6e8ce5" : '#aabb53',
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
                                                                    isBlue ? item1.value3 > 0 ? <img style={{
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
                                                                        :
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
                                                                    color: isBlue ? "#6e8ce5" : '#aabb53',
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
