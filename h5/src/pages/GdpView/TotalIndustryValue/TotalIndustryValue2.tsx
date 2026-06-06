import {useEffect, useState} from "react";
import TopBar1 from "../../../components/TopBar/TopBar1.tsx";
import {Pagination, Table} from "antd";
import {useSearchParams} from "react-router-dom";

export default function TotalIndustryValue2(){

    const [searchParams] = useSearchParams();
    const  title = searchParams.get('title')
    const innovativeCluster = searchParams.get('innovativeCluster')
    const [year, setYear] = useState('2025')
    const [activeCode, setActiveCode] = useState(2)
    const color = {
        color:'#000',
        marginRight: '0.1rem',
        padding:'0.05rem',
    }
    const activeColor={
        backgroundColor:'#fff',
        borderRadius:'0.05rem',
        color:'#377cfd',
        marginRight: '0.1rem',
        padding:'0.05rem',
    }

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10,total:0 });
    const [items25, setItems25] = useState([])
    const [total, setTotal] = useState(0)

    const fetchData =(page,pageSize)=>{

        fetch(`/prime-api/revenue/${year}?page=${page}&size=${pageSize}&${innovativeCluster}=true`).then(res=>res.json())
            .then(data=>{
                console.log(data)
                setItems25(data.records)
                setTotal(data.total)
                setPagination({ ...pagination, total: data.total }); // 设置总条目数
            })
    }
    const handleTableChange = (pagination) => {
        setPagination(pagination); // 更新 pagination 状态，触发数据重新获取
    };


    const columns = [
        {
            title: '序号',
            dataIndex: '',
            key: 'index',
            width: '0.75rem',
            align: 'center',
            render: (_, record, index) => {
                return index + 1
            },
        },
        {
            title: '重点企业',
            dataIndex: 'name',
            key: 'name',
            width: '2.2rem',
            align: 'center',
            render: (text,record) => {
                return <a href={`https://pztz.scjgj.taizhou.gov.cn/h6/#/pages/company/index?id=${record.uscc}`}>{text}</a>
            }
        },
        // {
        //     title: '板块',
        //     dataIndex: 'parkLabel',
        //     key: 'parkLabel',
        //     width: '1.4rem',
        // },
        {
            title: (
                <div>
                    <div>营收</div>
                    <div>（万元）</div>
                </div>
            ),
            dataIndex: 'actualValue',
            key: 'actualValue',
            align: 'center',
            width: '1.4rem',
            render: (text) => {
                return text?.toFixed(2)
            }
        },{
            title: (
                <div>
                    <div>同比</div>
                    <div>±%</div>
                </div>
            ),
            dataIndex: 'tb',
            key: 'tb',
            align: 'center',
            width: '1.2rem',
            render: (text) => {
                return text?text:"-"
            }
        },
        // {
        //     title: '占比（%)',
        //     dataIndex: 'actualValue2',
        //     key: 'actualValue2',
        //     width: '1.4rem',
        // },
    ]
    const columns1 = [
        {
            title: '序号',
            dataIndex: '',
            key: 'index',
            width: '0.75rem',
            align: 'center',
            render: (_, record, index) => {
                return index + 1
            },
        },
        {
            title: '重点企业',
            dataIndex: 'name',
            key: 'name',
            width: '2.2rem',
            align: 'center',
            render: (text,record) => {
                return <a href={`https://pztz.scjgj.taizhou.gov.cn/h6/#/pages/company/index?id=${record.uscc}`}>{text}</a>
            }
        },
        // {
        //     title: '板块',
        //     dataIndex: 'parkLabel',
        //     key: 'parkLabel',
        //     width: '1.4rem',
        // },
        {
            title: '上半年',
            children:[
                {
                    title: (
                        <div>
                            <div>营收</div>
                            <div>（万元）</div>
                        </div>
                    ),
                    dataIndex: 'actualValue',
                    key: 'actualValue',
                    align: 'center',
                    width: '1.4rem',
                    render: (text) => {
                        return text?.toFixed(2)
                    }
                },{
                    title: (
                        <div>
                            <div>同比</div>
                            <div>±%</div>
                        </div>
                    ),
                    dataIndex: 'tb',
                    key: 'tb',
                    align: 'center',
                    width: '1.2rem',
                    render: (text) => {
                        return text?text:"-"
                    }
                },
            ]
        }
    ]
    const [pageShow, setPageShow] = useState(true)
    const catalist = [
        {
            title : '前30',
            key:0,
            show:false,
            pagination:{
                current: 1,
                pageSize: 30,
                total:30,
            }
        },{
            title : '前50',
            key:1,
            show:false,
            pagination:{
                current: 1,
                pageSize: 50,
                total:50,
            }
        },{
            title : '全部',
            key:2,
            show:true,
            pagination:{
                current: 1,
                pageSize: 10,
                total:0,
            }
        },
    ]
    useEffect(()=>{
        fetchData(pagination.current,pagination.pageSize)
    },[pagination.current,pagination.pageSize,year])
    useEffect(()=>{
    },[])
    return (
        <div style={{
            height: '100vh',
            overflow:'scroll',
            scrollbarWidth: 'none',
            fontSize: '0.18rem',
        }}>
            <TopBar1 year={year} setYear={setYear} title={title} time={true}/>
            <div style={{
                padding: '0.2rem 0.05rem',
                overflowY: 'scroll',
            }}>
                <div style={{
                    display:'flex',
                    alignItems:'center',
                }}>
                    {
                        catalist.map((item,index)=>{
                            return(
                                <div key={index} onClick={()=>{
                                    setActiveCode(index)
                                    setPagination(item.pagination)
                                    setPageShow(item.show)
                                }} style={activeCode === item.key?activeColor:color}>{item.title}</div>
                            )
                        })
                    }
                </div>
                <div style={{
                    marginTop: '0.1rem',
                    // width: '780px',
                }}>
                    <Table onChange={handleTableChange} dataSource={items25} columns={columns} pagination={false}
                           components={{
                               header: {
                                   cell: ({ children, ...restProps }) => (
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
                        {
                            pageShow &&<Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                simple={true}
                                showTotal={(total) => `共 ${total} 条`}
                                total={total}
                                onChange={(page) => setPagination({ ...pagination, current: page })} // 直接在 Pagination 中更新页码状态以触发数据获取
                                style={{ marginTop: '16px' }} // 可选：添加一些样式间距以改善布局
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
