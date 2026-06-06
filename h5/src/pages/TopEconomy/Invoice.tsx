import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Pagination, Table} from "antd";
import {DigitalEconomicTaxLevelVo, IndustrialSystemVo} from "../../apis";
import {primeApi} from "../../api.ts";
import TopBar1 from "../../components/TopBar/TopBar1.tsx";

export default function Invoice(){
    const [year, setYear] = useState('2025')
    const navigate = useNavigate()

    const columns = [

        {
            title:'纳税人名称',
            dataIndex: 'companyName',
            key: 'companyName',
            align: 'center',
            width: '2rem',
        },
        {
            title: (
                <div>
                    <div>当月开票销售档次</div>
                    <div>2025年7月</div>
                </div>
            ),
            dataIndex: 'levelThisMonth',
            key: 'levelThisMonth',
            align: 'center',
            width: '2rem',
        },{
            title:(
                <div>
                    <div>累计开票销售档次</div>
                    <div>2025年1-7月</div>
                </div>
            ),
            align: 'center',
            dataIndex: 'levelThisYear',
            key: 'levelThisYear',
            width: '2rem',
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

    const [searchParams] = useSearchParams();
    const area = useState(searchParams.get('area'))||''
    const [items25,setItem25] = useState<DigitalEconomicTaxLevelVo[]>([])
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10,total:0 });
    const [total, setTotal] = useState(0)
    const fetchIndustrialSystemActualValue =async (page,pageSize)=>{
        const data = await primeApi.listDigitalEconomicTaxLevel({area:area[0],page:page,size:pageSize})
        console.log('fetchIndustrialSystemActualValue',data)
        setItem25(data.records)
        setTotal(data.total)
        setPagination({ ...pagination, total: data.total }); // 设置总条目数
    }
    useEffect(() => {
        console.log(area[0])
        fetchIndustrialSystemActualValue(pagination.current,pagination.pageSize)
    }, [pagination.current,pagination.pageSize,year]);
    return (
        <div style={{
            height: '100vh',
            fontSize: '0.18rem',
        }}>
            <TopBar1 year={year} setYear={setYear} title={'数字经济企业开票区间表'} time={false}/>
            <div style={{
                padding: '0.2rem 0.05rem',
                overflowY: 'scroll',
            }}>
                <div style={{
                    // width: '680px',
                    backgroundColor: '#5070ed',
                }}>
                    <Table  dataSource={items25} columns={columns} pagination={false}
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
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    showTotal={(total) => `共 ${total} 条`}
                    simple
                    total={total}
                    onChange={(page) => setPagination({ ...pagination, current: page })} // 直接在 Pagination 中更新页码状态以触发数据获取
                    style={{ marginTop: '16px' ,marginLeft: '0.2rem'}} // 可选：添加一些样式间距以改善布局
                />

            </div>
        </div>
    )
}
