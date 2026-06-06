import {useEffect, useState} from "react";
import TopBar1 from "../../../components/TopBar/TopBar1.tsx";
import {useNavigate} from "react-router-dom";
import {Table} from "antd";
import {primeApi} from "../../../api.ts";

export default function KeyQutoa1(){
    const [year, setYear] = useState('2025')
    const navigator = useNavigate()
    const items25 = [
        {
            title1:"规模以上工业企业",
            title2:"亿元",
            title3:"4018",
            title4:"1700.00",
            title5:"",
            title6:"",
            path:"/GdpView/TotalIndustryValue2?title=规模以上工业企业&&innovativeCluster=isTopIndustry",
        }, {
            title1:"资质等级建筑业企业",
            title2:"亿元",
            title3:"1114",
            title4:"560.38",
            title6:"",
            path:"/GdpView/TotalIndustryValue2?title=资质等级建筑业企业&&innovativeCluster=isTopConstruction",

        }, {
            title1:"限额以上批零住餐企业",
            title2:"亿元",
            title3:"4531",
            title4:"1549.33",
            title5:"",
            title6:"",
            path:"/GdpView/TotalIndustryValue2?title=限额以上批零住餐企业&&innovativeCluster=isTopTrade",

        }, {
            title1:"规模以上服务业企业",
            title2:"亿元",
            title3:"1270",
            title4:"167.38",
            title5:"",
            title6:"",
            path:"/GdpView/TotalIndustryValue2?title=规模以上服务业企业&&innovativeCluster=isTopService",
        }
    ]

    const columns = [
        {
            title: '指标名称',
            dataIndex: 'index',
            key: 'index',
            width: '2.6rem',
            align: 'center',
            render: (text,record) => {
                return <a  onClick={()=>{
                    console.log(record.index)
                    if(record.index==='规模以上工业企业'){
                        navigator("/GdpView/TotalIndustryValue2?title=规模以上工业企业&&innovativeCluster=isTopIndustry")
                    }else if(record.index==='资质等级建筑业企业'){
                        navigator("/GdpView/TotalIndustryValue2?title=资质等级建筑业企业&&innovativeCluster=isTopConstruction")
                    }else if(record.index==='限额以上批零住餐企业'){
                        navigator("/GdpView/TotalIndustryValue2?title=限额以上批零住餐企业&&innovativeCluster=isTopTrade")
                    }else if(record.index==='规模以上服务业企业'){
                        navigator("/GdpView/TotalIndustryValue2?title=规模以上服务业企业&&innovativeCluster=isTopService")
                    }
                }}>{text}</a>
            }
        },

        {
            title: (
                <div>
                    <div>样本单位</div>
                    <div>（家）</div>
                </div>
            ),
            dataIndex: 'count4',
            align: 'center',
            key: 'count4',
            width: '1.4rem',
        },
        {
            title: (
                <div>
                    <div>营收</div>
                    <div>（亿元）</div>
                </div>
            ),
            dataIndex: 'revenue3',
            align: 'center',
            key: 'revenue3',
            width: '1.4rem',
            render: (text) => {
                return text?parseFloat(text).toFixed(2):'-'

            }
        },
        {
            title: (
                <div>
                    <div>同比</div>
                    <div>±%</div>
                </div>
            ),
            dataIndex: 'tb3',
            key: 'tb3',
            align: 'center',
            width: '1.4rem',
            render: (text) => {
                return text?parseFloat(text).toFixed(2):'-'

            }
        }
    ]

    const columns1 = [
        {
            title: '指标名称',
            dataIndex: 'index',
            key: 'index',
            width: '3.5rem',
            align: 'center',
            render: (text,record) => {
                return <a  onClick={()=>{
                    console.log(record.index)
                    if(record.index==='规模以上工业企业'){
                        navigator("/GdpView/TotalIndustryValue2?title=规模以上工业企业&&innovativeCluster=isTopIndustry")
                    }else if(record.index==='资质等级建筑业企业'){
                        navigator("/GdpView/TotalIndustryValue2?title=资质等级建筑业企业&&innovativeCluster=isTopConstruction")
                    }else if(record.index==='限额以上批零住餐企业'){
                        navigator("/GdpView/TotalIndustryValue2?title=限额以上批零住餐企业&&innovativeCluster=isTopTrade")
                    }else if(record.index==='规模以上服务业企业'){
                        navigator("/GdpView/TotalIndustryValue2?title=规模以上服务业企业&&innovativeCluster=isTopService")
                    }
                }}>{text}</a>
            }
        },
        {
            title: (
                <div>
                    <div>样本单位</div>
                    <div>（家）</div>
                </div>
            ),
            dataIndex: 'count2',
            key: 'count2',
            align: 'center',
            width: '1.8rem',
        },
        {
            title: '上半年',
            align: 'center',
            children:[
                {
                    title: (
                        <div>
                            <div>营收</div>
                            <div>（亿元）</div>
                        </div>
                    ),
                    dataIndex: 'revenue',
                    key: 'revenue',
                    align: 'center',
                    width: '1.4rem',

                    render: (text) => {
                        return text?parseFloat(text).toFixed(2):'-'

                    }
                },
                {
                    title: (
                        <div>
                            <div>同比</div>
                            <div>±%</div>
                        </div>
                    ),
                    dataIndex: 'tb',
                    align: 'center',
                    key: 'tb',
                    width: '1.4rem',
                    render: (text) => {
                        return text?parseFloat(text).toFixed(2):'-'

                    }
                }
            ]
        }
    ]

    const items24 = [
        {
            title1:"规模以上工业企业",
            title2:"亿元",
            title3:"4178",
            title4:"7491.74",
            title5:"2.27%",
            title6:"",
            path:"/GdpView/TotalIndustryValue2?title=规模以上工业企业&industrialSystem=大健康",
        }, {
            title1:"资质等级建筑业企业",
            title2:"亿元",
            title3:"1172",
            title4:"3319.45",
            title5:"3.37%",
            path:"/GdpView/TotalIndustryValue2?title=资质等级建筑业企业&industrialSystem=海工装备和高技术船舶",

        }, {
            title1:"限额以上批零住餐企业",
            title2:"亿元",
            title3:"4452",
            title4:"5338.58",
            title5:"-33.90%",
            title6:"",
            path:"/GdpView/TotalIndustryValue2?title=限额以上批零住餐企业&industrialSystem=新兴产业（新智造、新材料、新能源）",

        }, {
            title1:"规模以上服务业企业",
            title2:"亿元",
            title3:"1327",
            title4:"672.84",
            title5:"0.37%",
            title6:"",
            path:"/GdpView/TotalIndustryValue2?title=规模以上服务业企业&industrialSystem=晨光力量（未来产业）",
        }
    ]
    const items23 = [
        {
            title1:"规模以上工业企业",
            title2:"亿元",
            title3:"3769",
            title4:"7325.30",
            title5:"",
            title6:"",
            path:"/GdpView/TotalIndustryValue2?title=规模以上工业企业&industrialSystem=大健康",
        }, {
            title1:"资质等级建筑业企业",
            title2:"亿元",
            title3:"1137",
            title4:"3211.31",
            title5:"",
            path:"/GdpView/TotalIndustryValue2?title=资质等级建筑业企业&industrialSystem=海工装备和高技术船舶",

        }, {
            title1:"限额以上批零住餐企业",
            title2:"亿元",
            title3:"3767",
            title4:"8076.57",
            title5:"",
            title6:"",
            path:"/GdpView/TotalIndustryValue2?title=限额以上批零住餐企业&industrialSystem=新兴产业（新智造、新材料、新能源）",

        }, {
            title1:"规模以上服务业企业",
            title2:"亿元",
            title3:"1131",
            title4:"670.37",
            title5:"",
            title6:"",
            path:"/GdpView/TotalIndustryValue2?title=规模以上服务业企业&industrialSystem=晨光力量（未来产业）",
        }
    ]
    const [table1, setTable1] = useState([])

    const getUpEnterprise = async () => {
        const data = await primeApi.getUpEnterprise({year:+year});
        // 按 quarter 区分，只使用 quarter 为 4 的数据
        const dataQ4 = (data || []).filter((item) => item.quarter === 4);
        const list = []
        const list2 = []
        const list3 = []
        const list4 = []
        let listAll = []
        for (let i = 0; i < dataQ4.length; i++) {
            if(dataQ4[i].index==="规模以上工业企业"){
                list.push(dataQ4[i])
            }else if(dataQ4[i].index==="资质等级建筑业企业"){
                list2.push(dataQ4[i])
            }else if(dataQ4[i].index==="限额以上批零住餐企业"){
                list3.push(dataQ4[i])
            }else if(dataQ4[i].index==="规模以上服务业企业"){
                list4.push(dataQ4[i])
            }
        }
        listAll = [
            {
                index: "规模以上工业企业",
                count4: list[0]?.count,
                revenue3: list[0]?.revenue,
                tb3: list[0]?.tb,
            },
            {
                index: "资质等级建筑业企业",
                count4: list2[0]?.count,
                revenue3: list2[0]?.revenue,
                tb3: list2[0]?.tb,
            },
            {
                index: "限额以上批零住餐企业",
                count4: list3[0]?.count,
                revenue3: list3[0]?.revenue,
                tb3: list3[0]?.tb,
            },
            {
                index: "规模以上服务业企业",
                count4: list4[0]?.count,
                revenue3: list4[0]?.revenue,
                tb3: list4[0]?.tb,
            }
        ]

        console.log('getUpEnterprise',listAll,data)
        setTable1(listAll)
    };

    useEffect(() => {
        getUpEnterprise()
    },[year])

    return (
        <div style={{
            height: '100vh',
            fontSize: '0.18rem',
        }}>
                <TopBar1 year={year} setYear={setYear} title={'四上企业情况'} time={true}/>
            <div style={{
                padding: '0.2rem 0.05rem',
                overflowY: 'scroll',
            }}>
                <div style={{
                    backgroundColor: '#5070ed',
                }}>
                    <Table style={{width:'680px'}} dataSource={table1} columns={columns} pagination={false}
                           components={{
                               header: {
                                   cell: ({ children, ...restProps }) => (
                                       <th {...restProps} style={{
                                           backgroundColor: '#5070ed',
                                           color: '#fff',
                                           // border: '1px solid #fff',
                                           textAlign: 'center',
                                       }}>
                                           {children}
                                       </th>
                                   )
                               }
                           }}
                    />
                </div>
                {/*<table style={{*/}
                {/*    color:'#fff',*/}
                {/*    width:"680px",*/}
                {/*}}>*/}
                {/*    <tr style={{*/}
                {/*        backgroundColor:"#5070ed",*/}
                {/*        height:"0.6rem",*/}
                {/*    }}>*/}
                {/*        <td style={{*/}
                {/*            textAlign:"center",*/}
                {/*            width:"1.5rem",*/}
                {/*        }}>指标名称 </td>*/}
                {/*        <td style={{*/}
                {/*            textAlign:"center",*/}
                {/*            width:"0.8rem",*/}
                {/*        }}>单位</td>*/}
                {/*        <td style={{*/}
                {/*            textAlign:"center",*/}
                {/*            width:"1.4rem",*/}
                {/*        }}>样本单位（家）</td>*/}
                {/*        <td  style={{*/}
                {/*            textAlign:"center",*/}
                {/*            width:"1rem",*/}
                {/*        }}>营收</td>*/}
                {/*        <td style={{*/}
                {/*            textAlign:"center",*/}
                {/*            width:"1rem",*/}
                {/*        }}>同比±%</td>*/}
                {/*        <td style={{*/}
                {/*            textAlign:"center",*/}
                {/*            width:"1rem",*/}
                {/*        }}>占比</td>*/}
                {/*    </tr>*/}
                {/*    {*/}
                {/*       year==="2025"&&items25.map((item,index)=>{*/}
                {/*            return (*/}
                {/*                <tr key={index} style={{*/}
                {/*                    backgroundColor: "#fff",*/}
                {/*                    height: "0.6rem",*/}
                {/*                    color: "#000",*/}
                {/*                    fontSize:"0.14rem"*/}
                {/*                }}>*/}
                {/*                    <td  style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1.5rem",*/}
                {/*                    }}><a href={item.path}>{item.title1}</a>*/}

                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "0.8rem",*/}
                {/*                    }}>{item.title2}*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1.4rem",*/}
                {/*                    }}>{item.title3}*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1rem",*/}
                {/*                    }}>{item.title4}*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1rem",*/}
                {/*                    }}>{item.title5}*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1rem",*/}
                {/*                    }}>{item.title6}*/}
                {/*                    </td>*/}
                {/*                </tr>*/}
                {/*            )*/}
                {/*        })*/}
                {/*    }*/}

                {/*    {*/}
                {/*        year==="2024"&&items24.map((item,index)=>{*/}
                {/*            return (*/}
                {/*                <tr key={index} style={{*/}
                {/*                    backgroundColor: "#fff",*/}
                {/*                    height: "0.6rem",*/}
                {/*                    color: "#000",*/}
                {/*                    fontSize:"0.14rem"*/}
                {/*                }}>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1.5rem",*/}
                {/*                    }}><a href={item.path}>{item.title1}</a>*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "0.8rem",*/}
                {/*                    }}>{item.title2}*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1.4rem",*/}
                {/*                    }}>{item.title3}*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1rem",*/}
                {/*                    }}>{item.title4}*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1rem",*/}
                {/*                    }}>{item.title5}*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1rem",*/}
                {/*                    }}>{item.title6}*/}
                {/*                    </td>*/}
                {/*                </tr>*/}
                {/*            )*/}
                {/*        })*/}
                {/*    }*/}
                {/*    {*/}
                {/*        year==="2023"&&items23.map((item,index)=>{*/}
                {/*            return (*/}
                {/*                <tr key={index} style={{*/}
                {/*                    backgroundColor: "#fff",*/}
                {/*                    height: "0.6rem",*/}
                {/*                    color: "#000",*/}
                {/*                    fontSize:"0.14rem"*/}
                {/*                }}>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1.5rem",*/}
                {/*                    }}><a href={item.path}>{item.title1}</a>*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "0.8rem",*/}
                {/*                    }}>{item.title2}*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1.4rem",*/}
                {/*                    }}>{item.title3}*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1rem",*/}
                {/*                    }}>{item.title4}*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1rem",*/}
                {/*                    }}>{item.title5}*/}
                {/*                    </td>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1rem",*/}
                {/*                    }}>{item.title6}*/}
                {/*                    </td>*/}
                {/*                </tr>*/}
                {/*            )*/}
                {/*        })*/}
                {/*    }*/}
                {/*</table>*/}
            </div>
        </div>
    )
}
