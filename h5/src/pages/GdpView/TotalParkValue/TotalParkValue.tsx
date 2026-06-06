import {useEffect, useState} from "react";
import TopBar1 from "../../../components/TopBar/TopBar1.tsx";
import {Pagination, Table} from "antd";

export default function TotalParkValue(){
    const [year, setYear] = useState('2025')
    const [activeCode, setActiveCode] = useState(2)
    const [total, setTotal] = useState(0)
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

    const [pagination, setPagination] = useState({ current: 1, pageSize: 20,total:0 });
    const [items25, setItems25] = useState([])
    const fetchData =(page,pageSize)=>{
        fetch(`/prime-api/gdp/${year}/by-park?page=${page}&size=50`).then(res=>res.json())
            .then(data=>{
                console.log(data)
                setItems25(data.records)
                setTotal(data.records.length)
                setPagination({ ...pagination, total: total }); // 设置总条目数
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
            className:'thColor',
            align: 'center',
            render: (_, record, index) => {
                return index + 1
            },
        },
        {
            title: '板块',
            className:'thColor',
            dataIndex: 'parkLabel',
            key: 'parkLabel',
            width: '2.6rem',
            align: 'left',
        },

        {
            className:'thColor',
            title: '样本单位（家）',
            dataIndex: 'groupCount',
            key: 'groupCount',
            width: '1.4rem',
        },
        {
            title:'一季度' ,
            className:'thColor',
            children:[
                {
                    title: '营收（亿元）',
                    dataIndex: 'actualValue',
                    key: 'actualValue',
                    width: '1.4rem',
                    className:'thColor',
                    render: (text) => {
                        return text.toFixed(2)
                    }
                },{
                    title: '同比±%',
                    dataIndex: 'actualValue1',
                    className:'thColor',
                    key: 'actualValue1',
                    width: '1.4rem',
                },{
                    title: '占比（%)',
                    dataIndex: 'actualValue2',
                    key: 'actualValue2',
                    className:'thColor',
                    width: '1.4rem',
                },
            ]
        },
    ]

    const columns2 = [
        {
            title: '序号',
            dataIndex: '',
            key: 'index',
            width: '0.75rem',
            className:'thColor',
            align: 'center',
            render: (_, record, index) => {
                return index + 1
            },
        },
        {
            title: '板块',
            className:'thColor',
            dataIndex: 'parkLabel',
            key: 'parkLabel',
            width: '2.6rem',
            align: 'left',
        },

        {
            className:'thColor',
            title: '样本单位（家）',
            dataIndex: 'groupCount',
            key: 'groupCount',
            width: '1.4rem',
        },
        {
            title: '营收（亿元）',
            dataIndex: 'actualValue',
            key: 'actualValue',
            width: '1.4rem',
            className:'thColor',
            render: (text) => {
                return text.toFixed(2)
            }
        },{
            title: '同比±%',
            dataIndex: 'actualValue1',
            className:'thColor',
            key: 'actualValue1',
            width: '1.4rem',
        },{
            title: '占比（%)',
            dataIndex: 'actualValue2',
            key: 'actualValue2',
            className:'thColor',
            width: '1.4rem',
        },
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
            <TopBar1 year={year} setYear={setYear} title={'规上工业总产值'} time={true}/>
            <div style={{
                padding: '0.2rem 0.05rem',
                overflowY: 'scroll',
            }}>
                {/*<div style={{*/}
                {/*    display:'flex',*/}
                {/*    alignItems:'center',*/}
                {/*}}>*/}
                {/*    {*/}
                {/*        catalist.map((item,index)=>{*/}
                {/*            return(*/}
                {/*                <div key={index} onClick={()=>{*/}
                {/*                    setActiveCode(index)*/}
                {/*                    setPagination(item.pagination)*/}
                {/*                    setPageShow(item.show)*/}
                {/*                }} style={activeCode === item.key?activeColor:color}>{item.title}</div>*/}
                {/*            )*/}
                {/*        })*/}
                {/*    }*/}
                {/*</div>*/}
                <div style={{
                    marginTop: '0.1rem',
                    width: '780px',
                    fontSize:"0.14rem"
                }}>
                    <Table onChange={handleTableChange} dataSource={items25} columns={year==='2025'?columns:columns2} pagination={false} />

                    <div style={{
                        marginLeft: '0.2rem',
                    }}>
                        {
                            pageShow &&<Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
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
