import {List, Search} from "react-vant";
import {useEffect, useState} from "react";
import TopBar from "../../components/TopBar/TopBar.tsx";
import {primeApi} from "../../api.ts";
import {ProjectOnlineApprovalVo} from "../../apis";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";

export default function PushProjectList2() {
    const [value, setValue] = useState('');
    const [page, setPage] = useState(0)

    const [page1, setPage1] = useState(0)
    const [page2, setPage2] = useState(0)
    const [page3, setPage3] = useState(0)
    const navigator = useNavigate()
    const getData = async () => {
        const data = await primeApi.listProjectConstructionApproval({projectName: value, stage: activeNum,page: page + 1});
        setPage(data.page)
        if (data.page >= data.totalPage) {
            setFinished(true)
        }
        return data.records
    }

    const getData1 = async () => {
        const data = await primeApi.listProjectConstructionApproval({projectName: value, stage: activeNum,page: page1 + 1});
        setPage1(data.page)
        if (data.page >= data.totalPage) {
            setFinished1(true)
        }
        return data.records
    }



    const getData2 = async () => {
        const data = await primeApi.listProjectConstructionApproval({projectName: value, stage: activeNum,page: page2 + 1});
        setPage2(data.page)
        if (data.page >= data.totalPage) {
            setFinished2(true)
        }
        return data.records
    }

    const getData3 = async () => {
        const data = await primeApi.listProjectConstructionApproval({projectName: value, stage: activeNum,page: page3 + 1});
        setPage3(data.page)
        if (data.page >= data.totalPage) {
            setFinished3(true)
        }
        return data.records
    }
    const [list, setList] = useState<ProjectOnlineApprovalVo[]>([])
    const [list1, setList1] = useState<ProjectOnlineApprovalVo[]>([])
    const [list2, setList2] = useState<ProjectOnlineApprovalVo[]>([])
    const [list3, setList3] = useState<ProjectOnlineApprovalVo[]>([])
    const [finished, setFinished] = useState<boolean>(false)
    const [finished1, setFinished1] = useState<boolean>(false)
    const [finished2, setFinished2] = useState<boolean>(false)
    const [finished3, setFinished3] = useState<boolean>(false)

    const onLoad = async () => {
        const data = await getData()
        console.log('bottom')
        setList(v => [...v, ...data])
    }

    const onLoad1 = async () => {
        const data = await getData1()
        console.log('bottom')
        setList1(v => [...v, ...data])
    }
    const onLoad2 = async () => {
        const data = await getData2()
        console.log('bottom')
        setList2(v => [...v, ...data])
    }
    const onLoad3 = async () => {
        const data = await getData3()
        console.log('bottom')
        setList3(v => [...v, ...data])
    }
    const titleList = [
        {title: '立项用地', key: '1'},
        {title: '建设许可', key: '2'},
        {title: '施工许可', key: '3'},
        {title: '竣工验收', key: '4'},
    ]
    const [activeNum, setActiveNum] = useState(4)
    return (
        <div style={{
            fontSize: '0.18rem',
            height: '100vh',
            backgroundColor: '#f0f2f6',
            overflow: 'scroll',
            scrollbarWidth: 'none',
        }}>
            <TopBar title={'工程建设'} time={false}/>
            <Search
                shape="round"
                value={value}
                onSearch={(val) => {
                    setValue(val)
                    console.log(val)
                    setPage(1)
                    primeApi.listProjectConstructionApproval({projectName: val, page: 1}).then(res => {
                        console.log(res)
                        setList(res.records)
                    })
                }}
                placeholder="请输入项目名称进行搜索"
            />
            <div style={{
                paddingLeft: '0.1rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',

            }}>
                {
                    titleList.map((item, index) => (
                        <div key={index} onClick={() => {
                            setActiveNum(index + 1)
                        }} style={{
                            fontSize: '0.14rem',
                            textAlign: 'center',
                            marginRight: '0.1rem',
                            marginTop: '0.1rem',
                            padding: '0.05rem 0.1rem',
                            borderRadius: '0.05rem',
                            backgroundColor: activeNum === index + 1 ? '#477af5' : '#fff',
                            color: activeNum === index + 1 ? '#fff' : '#000'
                        }}>

                            {item.title}
                        </div>
                    ))
                }
            </div>
            {
                activeNum===4&&
                <List style={{height: 'calc(100vh - 2.5rem)',}} finished={finished} onLoad={onLoad}>
                    {list.map((item, index) => {
                        return (
                            <div onClick={() => {
                                navigator(`/ApproveDetail4?id=${item.projectCode}`)
                            }} key={index} style={{
                                fontSize: '0.14rem',
                                marginTop: '0.15rem',
                                marginBottom: '15px',
                                backgroundColor: '#fff',
                                padding: '0.15rem 0.18rem',
                                borderRadius: '0.05rem',
                                boxShadow: '0 0.01rem 0.02rem rgba(0,0,0,0.1)'
                            }}>
                                <div style={{
                                    fontWeight: 'bold'
                                }}>项目名称：{item.projectName}</div>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    // justifyContent:'space-between',
                                    marginTop: '0.1rem'
                                }}>
                                    <div style={{}}>总投资（万元）：<span
                                        style={{color: ' #eb53c5'}}>{item.totalInvestment}</span>
                                    </div>

                                </div>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    // justifyContent:'space-between',
                                    marginTop: '0.1rem'
                                }}>
                                    <div style={{}}>项目类型：<span
                                        style={{color: ' #4b53c5'}}>{item.projectTypeLabel}</span>
                                    </div>

                                </div>
                                <div style={{
                                    width: '100%',
                                    marginTop: '0.1rem'
                                }}>项目代码：<span style={{color: '#ffad22'}}>{item.projectCode}</span></div>
                                <div style={{
                                    width: '100%',
                                    marginTop: '0.1rem'
                                }}>项目（法人）单位：<span style={{color: '#ffad22'}}>{item.companyName}</span></div>
                            </div>
                        )
                    })}
                </List>
            }
            {
                activeNum===3&&
                <List style={{height: 'calc(100vh - 2.5rem)',}} finished={finished1} onLoad={onLoad1}>
                    {list1.map((item, index) => {
                        return (
                            <div onClick={() => {
                                navigator(`/ApproveDetail4?id=${item.projectCode}`)
                            }} key={index} style={{
                                fontSize: '0.14rem',
                                marginTop: '0.15rem',
                                marginBottom: '15px',
                                backgroundColor: '#fff',
                                padding: '0.15rem 0.18rem',
                                borderRadius: '0.05rem',
                                boxShadow: '0 0.01rem 0.02rem rgba(0,0,0,0.1)'
                            }}>
                                <div style={{
                                    fontWeight: 'bold'
                                }}>项目名称：{item.projectName}</div>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    // justifyContent:'space-between',
                                    marginTop: '0.1rem'
                                }}>
                                    <div style={{}}>总投资（万元）：<span
                                        style={{color: ' #eb53c5'}}>{item.totalInvestment}</span>
                                    </div>

                                </div>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    // justifyContent:'space-between',
                                    marginTop: '0.1rem'
                                }}>
                                    <div style={{}}>项目类型：<span
                                        style={{color: ' #4b53c5'}}>{item.projectTypeLabel}</span>
                                    </div>

                                </div>
                                <div style={{
                                    width: '100%',
                                    marginTop: '0.1rem'
                                }}>项目代码：<span style={{color: '#ffad22'}}>{item.projectCode}</span></div>
                                <div style={{
                                    width: '100%',
                                    marginTop: '0.1rem'
                                }}>项目（法人）单位：<span style={{color: '#ffad22'}}>{item.companyName}</span></div>
                            </div>
                        )
                    })}
                </List>
            }
            {
                activeNum===2&&
                <List style={{height: 'calc(100vh - 2.5rem)',}} finished={finished2} onLoad={onLoad2}>
                    {list2.map((item, index) => {
                        return (
                            <div onClick={() => {
                                navigator(`/ApproveDetail4?id=${item.projectCode}`)
                            }} key={index} style={{
                                fontSize: '0.14rem',
                                marginTop: '0.15rem',
                                marginBottom: '15px',
                                backgroundColor: '#fff',
                                padding: '0.15rem 0.18rem',
                                borderRadius: '0.05rem',
                                boxShadow: '0 0.01rem 0.02rem rgba(0,0,0,0.1)'
                            }}>
                                <div style={{
                                    fontWeight: 'bold'
                                }}>项目名称：{item.projectName}</div>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    // justifyContent:'space-between',
                                    marginTop: '0.1rem'
                                }}>
                                    <div style={{}}>总投资（万元）：<span
                                        style={{color: ' #eb53c5'}}>{item.totalInvestment}</span>
                                    </div>

                                </div>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    // justifyContent:'space-between',
                                    marginTop: '0.1rem'
                                }}>
                                    <div style={{}}>项目类型：<span
                                        style={{color: ' #4b53c5'}}>{item.projectTypeLabel}</span>
                                    </div>

                                </div>
                                <div style={{
                                    width: '100%',
                                    marginTop: '0.1rem'
                                }}>项目代码：<span style={{color: '#ffad22'}}>{item.projectCode}</span></div>
                                <div style={{
                                    width: '100%',
                                    marginTop: '0.1rem'
                                }}>项目（法人）单位：<span style={{color: '#ffad22'}}>{item.companyName}</span></div>
                            </div>
                        )
                    })}
                </List>
            }
            {
                activeNum===1&&
                <List style={{height: 'calc(100vh - 2.5rem)',}} finished={finished3} onLoad={onLoad3}>
                    {list3.map((item, index) => {
                        return (
                            <div onClick={() => {
                                navigator(`/ApproveDetail4?id=${item.projectCode}`)
                            }} key={index} style={{
                                fontSize: '0.14rem',
                                marginTop: '0.15rem',
                                marginBottom: '15px',
                                backgroundColor: '#fff',
                                padding: '0.15rem 0.18rem',
                                borderRadius: '0.05rem',
                                boxShadow: '0 0.01rem 0.02rem rgba(0,0,0,0.1)'
                            }}>
                                <div style={{
                                    fontWeight: 'bold'
                                }}>项目名称：{item.projectName}</div>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    // justifyContent:'space-between',
                                    marginTop: '0.1rem'
                                }}>
                                    <div style={{}}>总投资（万元）：<span
                                        style={{color: ' #eb53c5'}}>{item.totalInvestment}</span>
                                    </div>

                                </div>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    // justifyContent:'space-between',
                                    marginTop: '0.1rem'
                                }}>
                                    <div style={{}}>项目类型：<span
                                        style={{color: ' #4b53c5'}}>{item.projectTypeLabel}</span>
                                    </div>

                                </div>
                                <div style={{
                                    width: '100%',
                                    marginTop: '0.1rem'
                                }}>项目代码：<span style={{color: '#ffad22'}}>{item.projectCode}</span></div>
                                <div style={{
                                    width: '100%',
                                    marginTop: '0.1rem'
                                }}>项目（法人）单位：<span style={{color: '#ffad22'}}>{item.companyName}</span></div>
                            </div>
                        )
                    })}
                </List>
            }
        </div>
    )
}
