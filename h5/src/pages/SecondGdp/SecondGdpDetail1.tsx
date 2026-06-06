import {List} from "react-vant";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {ListFormIndicatorRequest, ProjectOnlineApprovalVo} from "../../apis";
import TopBar from "../../components/TopBar/TopBar.tsx";
import {primeApi} from "../../api.ts";
import {Input, Table, Tag} from "antd";
import dayjs from "dayjs";

export default function SecondGdpDetail1() {
    const [page, setPage] = useState(0)
    const [finished, setFinished] = useState<boolean>(false)
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id') || ''
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [dataSource1, setDataSource1] = useState<any[]>([]);
    const [isShow, setIsShow] = useState(-1)
    const [cardOpen, setCardOpen] = useState(false)
    const getData = async () => {
        const data = await primeApi.listFormIndicator({
            monitorIndicatorId: id,
            page: page + 1
        });
        setPage(data.page)
        if (data.page > data.totalPage || data.totalPage === 0) {
            setFinished(true)
        }
        return data.records
    }
    const [obj, setObj] = useState([])
    //查询监测指标填报记录
    const getFormIndicator = async (id:string) => {
        const data = await primeApi.getFormIndicator({id:id});
        console.log('getFormIndicator',data)
        setObj(data.data)
        // if(data.data.file!==''){
        //     const list =[
        //         {
        //             uid: data.data.file,
        //             name:data.data.file,
        //             status: 'done',
        //             url: data.data.file,
        //         }
        //     ]
        //     setFileList(list)
        // }
    };

    //获取字段表
    const getFormMonitorIndicatorFields = async (id:string) => {
        const data = await primeApi.getFormMonitorIndicatorFields({id:id});
        console.log('getFormMonitorIndicatorFields',data)
        setDataSource1(data)
    };

    const columns1 = [
        {
            title: '字段名称',
            ellipsis:true,
            dataIndex: 'fieldName',
            key: 'fieldName',
            width: 120,
            align: 'center',
        },
        {
            title: ' 填报值',
            dataIndex: 'fieldUnit',
            key: 'fieldUnit',
            align: 'center',
            render: (_: any,record:any) => (
                <Input value={obj[record.fieldName]} disabled type={record.fieldType} />
            ),
        },
        {
            title: ' 单位',
            ellipsis:true,
            dataIndex: 'fieldUnit',
            key: 'fieldUnit',
            width: 120,
            align: 'center',
        },
    ];

    const [list, setList] = useState<ProjectOnlineApprovalVo[]>([])

    const onLoad = async () => {
        const data = await getData()
        console.log('bottom')
        setList(v => [...v, ...data])
    }
    const navigate = useNavigate()

    return (
        <div style={{
            fontSize: '0.18rem',
            height: '100vh',
            backgroundColor: '#f0f2f6',
            overflow: 'scroll',
            scrollbarWidth: 'none',
        }}>
            <TopBar title={'数据填报详情'} time={false}/>
            {
                list.length === 0 && <div style={{textAlign: 'center', marginTop: '20px', color: '#333'}}>暂无数据</div>
            }
            <List style={{
                height: 'calc(100vh - 2.5rem)',
            }} finished={finished} onLoad={onLoad}>
                {list.map((item, index) => (
                    <div>
                        <div key={index} style={{
                            fontSize: '0.16rem',
                            marginTop: '0.15rem',
                            marginBottom: '15px',
                            backgroundColor: '#fff',
                            padding: '0.15rem 0.18rem',
                            borderRadius: '0.05rem',
                            boxShadow: '0 0.01rem 0.02rem rgba(0,0,0,0.1)'
                        }} onClick={() => {
                            setIsShow(index)
                            setCardOpen(!cardOpen)
                            getFormIndicator(item.id || '')
                            getFormMonitorIndicatorFields(item.monitorIndicatorId || '')
                            // navigate(`/InvestmentView/ProjectDetail?id=${item.id}`)
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <div style={{
                                    fontWeight: 'bold',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>监测指标名称：{item.monitorIndicatorName}</div>
                                <Tag style={{fontSize: '0.16rem'}} color={item.submitted ? "success" : "error"}>
                                    {item.submitted ? '已填报' : '未填报'}
                                </Tag>
                            </div>
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '0.3rem'
                            }}>
                                <div style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}><span
                                    style={{color: '#48a2ff'}}>{item.collectionFrequencyLabel}</span>
                                </div>

                                <div style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                <span
                                    style={{color: '#48a2ff'}}>{dayjs(item.startDate).format('YYYY-MM-DD')}</span>&nbsp;至&nbsp;
                                    <span
                                        style={{color: '#48a2ff'}}>{dayjs(item.endDate).format('YYYY-MM-DD')}</span>
                                </div>
                            </div>
                        </div>
                        {
                            (isShow===index&&item.submitted)&&
                            <Table
                                style={{marginTop: 20}}
                                // rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
                                columns={columns1}
                                // scroll={{x: 1200}}
                                bordered={true}
                                dataSource={dataSource1}
                                pagination={false}
                            />

                        }
                    </div>
                ))}
            </List>


        </div>
    )
}
