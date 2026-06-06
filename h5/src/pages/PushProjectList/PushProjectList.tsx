
import {List, Picker, Popup, Search,Field} from "react-vant";
import {useEffect, useState} from "react";
import TopBar from "../../components/TopBar/TopBar.tsx";
import {primeApi, systemApi} from "../../api.ts";
import {ProjectOnlineApprovalVo, SystemDictVo} from "../../apis";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {Form} from "react-vant";
import {Button} from "antd";

export default function PushProjectList() {
    const [value, setValue] = useState<string>();
    const [approvalType, setApprovalType] = useState<string>()
    const [constructionNature, setConstructionNature] = useState<string>()
    const [isTechnicalReformProject, setIsTechnicalReformProject] = useState<string>()
    const [projectType, setProjectType] = useState<string>()
    const [industrialPolicyType, setIndustrialPolicyType] = useState<string>()
    const [isLegalCompanyControllingForProject, setIsLegalCompanyControllingForProject] = useState<string>()

    const resetValue = () => {
        console.log('reset')
        setApprovalType('')
        setConstructionNature('')
        setIsTechnicalReformProject('')
        setProjectType('')
        setIndustrialPolicyType('')
        setIsLegalCompanyControllingForProject('')
    }
    const [page, setPage] = useState(0)
    const [showCloseIcon, setShowCloseIcon] = useState(false)
    const navigator = useNavigate()
    const [form] = Form.useForm()

    const onFinish = values => {
        console.log(values)
    }
    const getData = async () => {
      const data =  await primeApi.listProjectOnlineApproval({
          projectName:value,
          approvalType: approvalType,
          constructionNature: constructionNature,
          projectType: projectType,
          isTechnicalReformProject: isTechnicalReformProject,
          industrialPolicyType: industrialPolicyType,
          isLegalCompanyControllingForProject: isLegalCompanyControllingForProject,
          page:page+1});
      setPage(data.page)
      if (data.page > data.totalPage){
          setFinished(true)
      }
      return data.records
    }

    const getList =(data:SystemDictVo[]) => {
        const list = []
        for (let i = 0; i < data.length; i++){
            list.push(data[i].value)
        }
        return list
    }
    const [optionList, setOptionList] = useState<string[]>()
    const [optionList1, setOptionList1] = useState<string[]>()
    const [optionList2, setOptionList2] = useState<string[]>()
    const [optionList3, setOptionList3] = useState<string[]>()
    const [yes, setYes] =  useState<string[]>()
    const getAllDict = async () => {
        const data = await systemApi.getDictItems({catalog: 'approval_type'})
        setOptionList(getList(data))
        console.log(getList(data))
        const data1 = await systemApi.getDictItems({catalog: 'construction_nature'})
        setOptionList1(getList(data1))
        const data2 = await systemApi.getDictItems({catalog: 'project_type'})
        setOptionList2(getList(data2))
        const data3 = await systemApi.getDictItems({catalog: 'industrial_policy_type'})
        setOptionList3(getList(data3))
        const data4 = await systemApi.getDictItems({catalog: '是否'})
        setYes(getList(data4))
    }
    const listProjectOnlineApproval1 = async () => {
        const data = await primeApi.listProjectOnlineApproval({
            projectName: value,
            approvalType: approvalType,
            constructionNature: constructionNature,
            projectType: projectType,
            isTechnicalReformProject: isTechnicalReformProject,
            industrialPolicyType: industrialPolicyType,
            isLegalCompanyControllingForProject: isLegalCompanyControllingForProject,
            page:page+1
        })
        setList(data.records)
    }
    const [list, setList] = useState<ProjectOnlineApprovalVo[]>([])
    const [finished, setFinished] = useState<boolean>(false)

    const onLoad = async () => {
        const data = await getData()
        console.log('bottom')
        setList(v => [...v, ...data])
    }
    useEffect(() => {
        getAllDict()
    }, [])
    useEffect(() => {
        listProjectOnlineApproval1()
    }, [value]);
  return (
    <div style={{
        fontSize: '0.18rem',
        height: '100vh',
        backgroundColor:'#f0f2f6',
        overflow: 'scroll',
        scrollbarWidth: 'none',
    }}>
        <TopBar title={'协同推进'} time={false}/>
        <div style={{display: 'flex',alignItems:'center',backgroundColor:'#fff',}}>
            <Search
                style={{width: '80%'}}
                shape="round"
                value={value}
                onSearch={(val) => {
                    setValue(val)
                    console.log(val)
                    setPage(1)
                }}
                placeholder="请输入项目名称进行搜索"
            />

            <div style={{width:'20%',textAlign:'center',color:'#333',backgroundColor:'#fff',}}  onClick={() => {
                setPage(0)
                setShowCloseIcon(true)
            }}>筛选</div>
        </div>
        <List style={{
            height: 'calc(100vh - 2.5rem)',
        }} finished={finished} onLoad={onLoad}>
            {list.map((item, index) => (
                <div onClick={() => {
                    navigator(`/ApproveDetail3?id=${item.id}`)}
                } key={index} style={{
                    fontSize: '0.14rem',
                    marginTop: '0.15rem',
                    marginBottom: '15px',
                    backgroundColor: '#fff',
                    padding: '0.15rem 0.18rem',
                    borderRadius: '0.05rem',
                    boxShadow: '0 0.01rem 0.02rem rgba(0,0,0,0.1)'
                }} >
                    <div style={{
                        fontWeight: 'bold'
                    }}>项目名称：{item.projectName}</div>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        // justifyContent:'space-between',
                        marginTop: '0.2rem'
                    }}>
                        <div style={{
                            width: '50%'
                        }}>项目审批类型：<span style={{color: '#48a2ff'}}>
                            {item.approvalType?.includes('备案通过') && '备案通过'}
                            {item.approvalType?.includes('审批') && '审批'}

                        </span></div>
                        <div style={{
                            width: '50%'
                        }}>总投资（万元）：<span style={{color: ' #eb53c5'}}>{item.totalInvestment}</span></div>
                    </div>

                    <div style={{
                        width: '100%',
                        display: 'flex',
                        // justifyContent:'space-between',
                        marginTop: '0.1rem'
                    }}>
                        <div style={{
                            width: '50%'
                        }}>申报时间：<span
                            style={{color: '#8587fa'}}>{dayjs(item.applicationTime).format('YYYY-MM-DD')}</span></div>

                    </div>
                    <div style={{
                        width: '100%',
                        marginTop: '0.1rem'
                    }}>项目代码：<span style={{color: '#ffad22'}}>{item.projectCode}</span></div>
                    <div style={{
                        width: '100%',
                        marginTop: '0.1rem'
                    }}>项目（法人）单位：<span style={{color: '#ffad22'}}>{item.legalCompany}</span></div>
                </div>
            ))}
        </List>
        <Popup
            zIndex={50}
            visible={showCloseIcon}
            closeable
            title='筛选条件'
            style={{ height: '70%' }}
            position='bottom'
            onClose={() => setShowCloseIcon(false)}
        >
            <div>
                <Picker
                    popup={{
                        round: true,
                    }}
                    value={approvalType}
                    title='请选择项目审批类型'
                    columns={optionList}
                    onConfirm={setApprovalType}
                >
                    {(val: string| string[], _:any, actions) => {
                        return (
                            <Field
                                readOnly
                                clickable
                                label='项目审批类型'
                                value={val as string || ''}
                                placeholder='请选择项目审批类型'
                                onClick={() => actions.open()}
                            />
                        )
                    }}
                </Picker>

                <Picker
                    popup={{
                        round: true,
                    }}
                    value={constructionNature}
                    title='请选择建设性质'
                    columns={optionList1}
                    onConfirm={setConstructionNature}
                >
                    {(val: string| string[], _:any, actions) => {
                        return (
                            <Field
                                readOnly
                                clickable
                                label='建设性质'
                                value={val as string || ''}
                                placeholder='请选择建设性质'
                                onClick={() => actions.open()}
                            />
                        )
                    }}
                </Picker>

                <Picker
                    popup={{
                        round: true,
                    }}
                    value={projectType}
                    title='请选择项目类型'
                    columns={optionList2}
                    onConfirm={setProjectType}
                >
                    {(val: string| string[], _, actions) => {
                        return (
                            <Field
                                readOnly
                                clickable
                                label='项目类型'
                                value={val as string || ''}
                                placeholder='请选择项目类型'
                                onClick={() => actions.open()}
                            />
                        )
                    }}
                </Picker>

                <Picker
                    popup={{
                        round: true,
                    }}
                    value={isTechnicalReformProject}
                    title='是否技改项目'
                    columns={yes}
                    onConfirm={setIsTechnicalReformProject}
                >
                    {(val: string | string[], _, actions) => {
                        return (
                            <Field
                                readOnly
                                clickable
                                label='是否技改项目'
                                value={val as string || ''}
                                placeholder='是否技改项目'
                                onClick={() => actions.open()}
                            />
                        )
                    }}
                </Picker>

                <Picker
                    popup={{
                        round: true,
                    }}
                    value={industrialPolicyType}
                    title='请选择产业政策类型'
                    columns={optionList3}
                    onConfirm={setIndustrialPolicyType}
                >
                    {(val: string| string[], _, actions) => {
                        return (
                            <Field
                                readOnly
                                clickable
                                label='产业政策类型'
                                value={industrialPolicyType}
                                placeholder='请选择产业政策类型'
                                onClick={() => actions.open()}
                            />
                        )
                    }}
                </Picker>

                <Picker
                    popup={{
                        round: true,
                    }}
                    value={isLegalCompanyControllingForProject}
                    title='法人单位是否为该项目的控股单位'
                    columns={yes}
                    onConfirm={setIsLegalCompanyControllingForProject}
                >
                    {(val: string | string[], _, actions) => {
                        return (
                            <Field
                                readOnly
                                clickable
                                labelWidth={'220px'}
                                label='法人单位是否为该项目的控股单位'
                                value={val as string || ''}
                                placeholder='是否'
                                onClick={() => actions.open()}
                            />
                        )
                    }}
                </Picker>

                <div style={{padding: '10px',display: 'flex',justifyContent:'right'}}>
                    <Button
                        type={'primary'}
                        onClick={() => {
                            listProjectOnlineApproval1().then((res) => {
                                setShowCloseIcon(false)
                                console.log(res)
                                // resetValue()
                            })
                        }}
                    >
                        查询
                    </Button>

                    <Button
                        style={{marginLeft: '10px'}}
                        onClick={() => {
                            resetValue()
                            // setShowCloseIcon(false)
                        }}
                    >
                        重置
                    </Button>
                </div>
            </div>
        </Popup>
    </div>
  )
}
