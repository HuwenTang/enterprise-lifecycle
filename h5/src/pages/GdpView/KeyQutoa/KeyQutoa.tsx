import {useEffect, useState} from "react";
import TopBar1 from "../../../components/TopBar/TopBar1.tsx";
import {useNavigate} from "react-router-dom";
import {Table} from "antd";
import {primeApi} from "../../../api.ts";
import {IndustrialSystemVo} from "../../../apis";

export default function KeyQutoa(){
    const [year, setYear] = useState('2025')
    const navigator = useNavigate()

    const items = [
        {
            title: '8+13+X',
            img: '/img/hometab/fuzhuItem/5.png',
            path:"/GdpView/TotalIndustryValue1?title=8%2B13%2BX",
        },
        {
            title: '大健康',
            img: '/img/hometab/fuzhuItem/6.png',
            path:"/GdpView/TotalIndustryValue1?title=大健康&industrialSystem=大健康",
        },{
            title: '海工装备',
            img: '/img/hometab/fuzhuItem/7.png',
            path:"/GdpView/TotalIndustryValue1?title=海工装备和高技术船舶&industrialSystem=海工装备和高技术船舶",
        },{
            title: '新兴产业',
            subTitle:'(新智造、新材料、新能源)',
            img: '/img/hometab/fuzhuItem/8.png',
            path:"/GdpView/TotalIndustryValue1?title=新兴产业&industrialSystem=新兴产业（新智造、新材料、新能源）",
        },
        {
            title: '晨光力量',
            subTitle:'(未来产业)',
            img: '/img/hometab/fuzhuItem/9.png',
            path:"/GdpView/TotalIndustryValue1?title=晨光力量(未来产业)&futureIndustry=true",
        },
    ]
    const columns = [
        {
            title: '指标名称',
            dataIndex: 'innovativeCluster',
            key: 'innovativeCluster',
            width: '2.5rem',
            align: 'center',
            render: (text,record) => {
                return <a onClick={() => {
                    if(text==='未来产业'){
                        navigator(`/GdpView/TotalIndustryValue1?title=${text}&futureIndustry=true`)
                    }else if(text==='8+13+X') {
                        navigator(`/GdpView/TotalIndustryValue1?title=${text}`)
                    }else{
                        navigator(`/GdpView/TotalIndustryValue1?title=${text}&innovativeCluster=${text}`)
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
            dataIndex: 'count',
            key: 'count',
            align: 'center',
            width: '2rem',
        },
        {
            title: (
                <div>
                    <div>实绩</div>
                    <div>（亿元）</div>
                </div>
            ),
            dataIndex: 'actualValue',
            key: 'actualValue',
            align: 'center',
            width: '2rem',
            render: (text:any) => {
                return text?parseFloat(text).toFixed(2):'-'

            }
        },{
            title:(
                <div>
                    <div>同比</div>
                    <div>±%</div>
                </div>
            ),
            align: 'center',
            dataIndex: 'tb',
            key: 'tb',
            width: '1.4rem',
            render: (text:any) => {
                return text?text:'-'
            }
        },
        // {
        //     title: '占比（%)',
        //     dataIndex: 'title6',
        //     align: 'center',
        //     key: 'title6',
        //     width: '1.4rem',
        //     render: (text:any) => {
        //         return text?text:'-'
        //     }
        // },
    ]

    const columns1 = [
        {
            title: '指标名称',
            dataIndex: 'innovativeCluster',
            key: 'innovativeCluster',
            width: '2.5rem',
            align: 'center',
            render: (text,record) => {
                return <a onClick={() => {
                    if(text==='未来产业'){
                        navigator(`/GdpView/TotalIndustryValue1?title=${text}&futureIndustry=true`)
                    }else if(text==='8+13+X') {
                        navigator(`/GdpView/TotalIndustryValue1?title=${text}`)
                    }else{
                        navigator(`/GdpView/TotalIndustryValue1?title=${text}&innovativeCluster=${text}`)
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
            dataIndex: 'count',
            key: 'count',
            align: 'center',
            width: '2.2rem',
        },
        {
            title: '上半年',
            children:[
                {
                    title: (
                        <div>
                            <div>实绩</div>
                            <div>（亿元）</div>
                        </div>
                    ),
                    dataIndex: 'actualValue',
                    align: 'center',
                    key: 'actualValue',
                    width: '2rem',
                    render: (text:any) => {
                        return text?parseFloat(text).toFixed(2):'-'
                    }
                },{
                    title:(
                        <div>
                            <div>同比</div>
                            <div>±%</div>
                        </div>
                    ),
                    dataIndex: 'tb',
                    align: 'center',
                    key: 'tb',
                    width: '1.4rem',
                    render: (text:any) => {
                        return text?text:'-'
                    }
                },
                // {
                //     title: '占比（%)',
                //     dataIndex: 'title6',
                //     align: 'center',
                //     key: 'title6',
                //     width: '1.4rem',
                //     render: (text:any) => {
                //         return text?text:'-'
                //     }
                // },
            ]
        }
    ]

    const [items25,setItem25] = useState<IndustrialSystemVo[]>([])
    const fetchIndustrialSystemActualValue =async ()=>{
        const data = await primeApi.fetchIndustrialSystemActualValue({year:+year})
        console.log('fetchIndustrialSystemActualValue',data)
        setItem25(data)
    }
    useEffect(() => {
        fetchIndustrialSystemActualValue()
    }, [year]);
    return (
        <div style={{
            height: '100vh',
            fontSize: '0.18rem',
        }}>
            <TopBar1 year={year} setYear={setYear} title={'重点企业情况'} time={true}/>
            <div style={{
                padding: '0.2rem 0.05rem',
                overflowY: 'scroll',
            }}>
                <div style={{
                    // width: '680px',
                    backgroundColor: '#5070ed',
                }}>
                    <Table  dataSource={items25} columns={year==='2025'?columns1:columns} pagination={false}
                           components={{
                               header: {
                                   cell: ({ children, ...restProps }) => (
                                       <th {...restProps} style={{
                                           backgroundColor: '#5070ed',
                                           color: '#fff',
                                           fontSize: '0.12rem',
                                           textAlign: 'center',
                                       }}>
                                           {children}
                                       </th>
                                   )
                               }
                           }}
                    />
                </div>

            </div>
        </div>
    )
}
