import {useEffect, useState} from "react";
import {Pagination, Table} from "antd";
import {useNavigate, useSearchParams} from "react-router-dom";
import TopBar1 from "../../components/TopBar/TopBar1.tsx";
import {primeApi} from "../../api.ts";

export default function SecondGdpDetail() {

    const [searchParams] = useSearchParams();
    const title = searchParams.get('title') || ''
    const [year, setYear] = useState('2025')
    const futureIndustry = searchParams.get('futureIndustry') || ''
    console.log('futureIndustry', futureIndustry)
    const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
    const [items25, setItems25] = useState([])
    const [total, setTotal] = useState(0)
    const navigate = useNavigate()

    const handleTableChange = (pagination) => {
        setPagination(pagination); // 更新 pagination 状态，触发数据重新获取
    };
    const columns1 = [
        {
            title: '监测指标名称',
            dataIndex: 'indicatorName',
            key: 'indicatorName',
            width: '2.2rem',
            align: 'center',
            render: (text, record) => {
                return <a
                    onClick={() => {
                        navigate(`/second-gdp-detail1?id=${record.id}`);
                    }}
                    // href={`https://pztz.scjgj.taizhou.gov.cn/h6/#/pages/company/index?id=${record.uscc}`}
                >{text||'-'}</a>
            }
        },
        {
            title: '支撑指标',
            dataIndex: 'supportIndicatorName',
            key: 'supportIndicatorName',
            align: 'center',
            width: '1.6rem',
        }, {
            title: '频次',
            dataIndex: 'collectionFrequencyLabel',
            key: 'collectionFrequencyLabel',
            align: 'center',
            width: '1.4rem',
        },
    ]
    const listFormMonitorIndicator = async () => {
        const data = await primeApi.listFormMonitorIndicator({
            department: title,
            page: pagination.current,
            size: pagination.pageSize
        })
        setItems25(data.records)
        setTotal(data.total)
        setPagination({...pagination, total: data.total});
    }
    useEffect(() => {
        // fetchData(pagination.current,pagination.pageSize)
        listFormMonitorIndicator()
    }, [pagination.current, pagination.pageSize, year])
    useEffect(() => {
    }, [])
    return (
        <div style={{
            height: '100vh',
            overflow: 'scroll',
            scrollbarWidth: 'none',
            fontSize: '0.18rem',
        }}>
            <TopBar1 year={year} setYear={setYear} title={"监测指标总览"} time={false}/>
            <div style={{
                padding: '0.2rem 0.05rem',
                overflowY: 'scroll',
            }}>

                <div style={{}}>
                    <Table onChange={handleTableChange} dataSource={items25} columns={columns1} pagination={false}
                           components={{
                               header: {
                                   cell: ({children, ...restProps}) => (
                                       <th {...restProps} style={{
                                           backgroundColor: '#5070ed',
                                           color: '#fff',
                                           textAlign: 'center',
                                       }}>
                                           {children}
                                       </th>
                                   )
                               }
                           }}
                    />
                    <div style={{
                        marginLeft: '0.2rem',
                    }}>
                        <Pagination
                            current={pagination.current}
                            pageSize={pagination.pageSize}
                            showTotal={(total) => `共 ${total} 条`}
                            simple
                            total={total}
                            onChange={(page) => setPagination({
                                ...pagination,
                                current: page
                            })} // 直接在 Pagination 中更新页码状态以触发数据获取
                            style={{marginTop: '16px'}} // 可选：添加一些样式间距以改善布局
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
