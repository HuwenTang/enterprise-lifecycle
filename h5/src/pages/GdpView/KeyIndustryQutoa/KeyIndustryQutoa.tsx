import {useState} from "react";
import TopBar1 from "../../../components/TopBar/TopBar1.tsx";
import YearPick1 from "../../../components/YearPick/YearPick1.tsx";
import {Table} from "antd";

export default function KeyIndustryQutoa() {
    const [year, setYear] = useState('2025')
    const msg = '全部'
    const setMsg = (msg: string) => {
        console.log(msg)
    }
    const columns = [
        {
            title: '指标名称',
            dataIndex: 'title1',
            key: 'title1',
            width: '2.2rem',
            align: 'center',
            render: (text,record) => {
                return <a href={record.path}>{text}</a>
            }
        },
        {
            title: '样本单位（家）',
            dataIndex: 'title3',
            key: 'title3',
            align: 'center',
            width: '2rem',
        },
        {
            title: '营收（亿元）',
            dataIndex: 'title4',
            align: 'center',
            key: 'title4',
            width: '2.5rem',
            render: (text) => {
                return text
            }
        },{
            title: '同比±%',
            dataIndex: 'title5',
            key: 'title5',
            align: 'center',
            width: '1.2rem',
        },{
            title: '占比（%)',
            dataIndex: 'title7',
            align: 'center',
            key: 'title7',
            width: '1.2rem',
        },
    ]

    const columns1 = [
        {
            title: '指标名称',
            dataIndex: 'title1',
            key: 'title1',
            width: '2.2rem',
            align: 'center',
            render: (text,record) => {
                return <a href={record.path}>{text}</a>
            }
        },
        {
            title: '样本单位（家）',
            dataIndex: 'title3',
            align: 'center',
            key: 'title3',
            width: '2rem',
        },
        {
            title: '一季度',
            children:[
                {
                    title: '营收（亿元）',
                    dataIndex: 'title4',
                    align: 'center',
                    key: 'title4',
                    width: '2.5rem',
                    render: (text) => {
                        return text
                    }
                },{
                    title: '同比±%',
                    align: 'center',
                    dataIndex: 'title5',
                    key: 'title5',
                    width: '1.2rem',
                },{
                    title: '占比（%)',
                    align: 'center',
                    dataIndex: 'title6',
                    key: 'title6',
                    width: '1.2rem',
                },
            ]
        }
    ]
    const items25 = [
        {
            title1: "规上工业总产值",
            title2: "亿元",
            title3: "4015",
            title4: "",
            title5: "",
            title6: "",
            path:'/GdpView/TotalIndustryValue'
        }
    ]

    const items24 = [
        {
            title1: "规上工业总产值",
            title2: "亿元",
            title3: "4015",
            title4: "8086.92",
            title5: "1.13%",
            title6: "/GdpView/TotalIndustryValue",
        }
    ]
    const items23 = [
        {
            title1: "规上工业总产值",
            title2: "亿元",
            title3: "4015",
            title4: "7996.49",
            title5: "",
            title6: "/GdpView/TotalIndustryValue",
        }
    ]
    return (
        <div style={{
            height: '100vh',
            fontSize: '0.18rem',
        }}>
            <TopBar1 year={year} setYear={setYear} title={'基础指标行业（按行业）'} time={true}/>
            <div style={{
                padding: '0.2rem 0.05rem',
                overflowY: 'scroll',
            }}>
                <div style={{
                    position: 'absolute',
                    right: '0.05rem',
                }}>
                    <YearPick1 year={msg} setYear={setMsg}/>
                </div>
                <div style={{
                    width:'880px'
                }}>
                    <Table style={{width:'880px'}} dataSource={year==='2025'?items25:year==='2024'?items24:items23} columns={year==='2025'?columns1:columns} pagination={false}
                           components={{
                               header: {
                                   cell: ({ children, ...restProps }) => (
                                       <th {...restProps} style={{
                                           backgroundColor: '#5070ed',
                                           color: '#fff',
                                           textAlign: 'center',
                                           // border: '1px solid #fff',
                                       }}>
                                           {children}
                                       </th>
                                   )
                               }
                           }}
                    />
                </div>
                {/*<table style={{*/}
                {/*    marginTop: '0.3rem',*/}
                {/*    color: '#fff',*/}
                {/*    width: "680px",*/}
                {/*}}>*/}
                {/*    <tr style={{*/}
                {/*        backgroundColor: "#5070ed",*/}
                {/*        height: "0.6rem",*/}
                {/*    }}>*/}
                {/*        <td style={{*/}
                {/*            textAlign: "center",*/}
                {/*            width: "1.5rem",*/}
                {/*        }}>指标名称*/}
                {/*        </td>*/}
                {/*        <td style={{*/}
                {/*            textAlign: "center",*/}
                {/*            width: "0.8rem",*/}
                {/*        }}>单位*/}
                {/*        </td>*/}
                {/*        <td style={{*/}
                {/*            textAlign: "center",*/}
                {/*            width: "1.4rem",*/}
                {/*        }}>样本单位（家）*/}
                {/*        </td>*/}
                {/*        <td style={{*/}
                {/*            textAlign: "center",*/}
                {/*            width: "1rem",*/}
                {/*        }}>营收*/}
                {/*        </td>*/}
                {/*        <td style={{*/}
                {/*            textAlign: "center",*/}
                {/*            width: "1rem",*/}
                {/*        }}>同比±%*/}
                {/*        </td>*/}
                {/*        <td style={{*/}
                {/*            textAlign: "center",*/}
                {/*            width: "1rem",*/}
                {/*        }}>占比*/}
                {/*        </td>*/}
                {/*    </tr>*/}
                {/*    {*/}
                {/*        year === "2025" && items25.map((item, index) => {*/}
                {/*            return (*/}
                {/*                <tr key={index} style={{*/}
                {/*                    backgroundColor: "#fff",*/}
                {/*                    height: "0.6rem",*/}
                {/*                    color: "#000",*/}
                {/*                    fontSize: "0.14rem"*/}
                {/*                }}>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1.5rem",*/}
                {/*                    }}>*/}
                {/*                        <a href="/GdpView/TotalIndustryValue">{item.title1}</a>*/}
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
                {/*        year === "2024" && items24.map((item, index) => {*/}
                {/*            return (*/}
                {/*                <tr key={index} style={{*/}
                {/*                    backgroundColor: "#fff",*/}
                {/*                    height: "0.6rem",*/}
                {/*                    color: "#000",*/}
                {/*                    fontSize: "0.14rem"*/}
                {/*                }}>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1.5rem",*/}
                {/*                    }}><a href="/GdpView/TotalIndustryValue">{item.title1}</a>*/}
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
                {/*        year === "2023" && items23.map((item, index) => {*/}
                {/*            return (*/}
                {/*                <tr key={index} style={{*/}
                {/*                    backgroundColor: "#fff",*/}
                {/*                    height: "0.6rem",*/}
                {/*                    color: "#000",*/}
                {/*                    fontSize: "0.14rem"*/}
                {/*                }}>*/}
                {/*                    <td style={{*/}
                {/*                        textAlign: "center",*/}
                {/*                        width: "1.5rem",*/}
                {/*                    }}><a href="/GdpView/TotalIndustryValue">{item.title1}</a>*/}
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
