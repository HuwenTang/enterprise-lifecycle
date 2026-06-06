import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Button, Input, message } from "antd";
import { useEffect, useState } from "react";
import { primeApi } from "../../../../api.ts";

export default function ProBasicInfo({ zsid, project, isCom, setIsCom, id }) {
    const data = {
        title: '商务局协同推进+转签约测试（移动端）',
        id: 'XM2412050002',
        park: '高新区（东南街道',
        econmic: '制造业/金属制品、机械和设备修理业/电气设备修理/电气设备修理',
        code: '',
        companyName: '大众交通',
        uscc: '',
        projectCatagory: '',
        projectSub: '招商项目',
        projectStatus: '转签约'
    }
    const tabList = [
        {
            key: '1',
            tab: '质态评估',
            url: `/qualitative-state?id=${project.id}&isCom=${isCom}&zsid=${zsid}`
        },
        {
            key: '2',
            tab: '签约核定',
            url: `/qualitative-signing?id=${project.id}&isCom=${isCom}&zsid=${zsid}`
        },
        {
            key: '3',
            tab: '开工认定',
            url: `/pro-start/pro-start-detail?id=${project.id}&isCom=${isCom}&zsid=${zsid}`
        },
        {
            key: '4',
            tab: '竣工认定',
            url: `/pro-end/pro-end-detail?id=${project.id}&isCom=${isCom}&zsid=${zsid}`
        }
        // {
        //     key: '2',
        //     tab: '质效评价',
        //     url:'/qualitative-effect'
        // },
    ]
    const navigate = useNavigate();
    const [value, setValue] = useState<string>()
    const handleChange = (e) => {
        setValue(e.target.value); // 更新 state
    };
    const [ishow, setIshow] = useState(false)
    const check = async () => {
        const data = await primeApi.check({ zsId: id })
        setIshow(data.value)
    }
    const commnent = async () => {
        try {
            const data = await primeApi.updateProjectDigitalQualityEvaluation({
                projectDigitalProjectReviewAllDto: {
                    digitalInvestmentId: project.id,
                    comment: value
                }
            })
            setIsCom('0')
            message.success('操作成功')
        } catch (e) {
            message.error('操作失败')
        }
    }
    useEffect(() => {
        check()
    }, []);
    return (
        <div style={{marginTop: '0.2rem', fontSize: '0.12rem',}}>
            <div style={{
                padding: '0.1rem 0',
                color: '#666',
                width: '100%',
                textAlign: 'center',
                marginBottom: '0.2rem',
            }}>
                更新日期：{dayjs().format('YYYY-MM-DD')}
            </div>

            <div style={{
                margin: '0.1rem 0',
                display: 'flex',
                justifyContent: 'left',
            }}>
                {
                    tabList.map((item, index) => {
                        return (
                            <div key={index} style={{
                                fontSize: '0.12rem',
                                marginRight: '0.2rem',
                                width: '23%',
                                height: '0.32rem',
                                borderRadius: '0.05rem',
                                color: '#666',
                                backgroundColor: '#eff4fd',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }} onClick={() => {
                                navigate(item.url);
                            }}>
                                {item.tab}
                            </div>
                        )
                    })
                }
            </div>
            <div></div>
            <div style={{
                marginBottom: '0.2rem',
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <div style={{width: '30%', color: '#86909c'}}>
                    项目名称
                </div>
                <div style={{width: '70%', textAlign: 'right'}}>
                    {project.projectName}
                </div>
            </div>
            <div style={{
                marginBottom: '0.2rem',
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <div style={{width: '30%', color: '#86909c'}}>
                    市(区)
                </div>
                <div style={{width: '70%', textAlign: 'right'}}>
                    {project.districtName}
                </div>
            </div>
            <div style={{
                marginBottom: '0.2rem',
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <div style={{width: '30%', color: '#86909c'}}>
                    园区
                </div>
                <div style={{width: '70%', textAlign: 'right'}}>
                    {project.parkName}
                </div>
            </div>
            <div style={{
                marginBottom: '0.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{width: '30%', color: '#86909c'}}>
                    行业编码
                </div>
                <div style={{width: '70%', textAlign: 'right'}}>
                    {project.nationalEconomicClassification}
                </div>
            </div>
            <div style={{
                marginBottom: '0.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{width: '30%', color: '#86909c'}}>
                    项目类别
                </div>
                <div style={{width: '70%', textAlign: 'right'}}>
                    {project.investmentFlagLabel}
                </div>
            </div>

            <div style={{
                marginBottom: '0.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{width: '30%', color: '#86909c'}}>
                    {project?.investmentFlagLabel === "内资" ? '项目总投资（亿元）' : '项目总投资（亿美元）'}
                </div>
                <div style={{width: '70%', textAlign: 'right'}}>
                    {project?.investmentFlagLabel === '内资'
                        ? project?.totalInvestmentCny
                        : project?.totalInvestmentUsd}
                </div>
            </div>
            <div style={{
                marginBottom: '0.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{width: '30%', color: '#86909c'}}>
                    协议利用外资（万美元）
                </div>
                <div style={{width: '70%', textAlign: 'right'}}>
                    {project.agreementForeignDirectInvestment}
                </div>
            </div>
            <div style={{
                marginBottom: '0.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{width: '30%', color: '#86909c'}}>
                    项目内容
                </div>
                <div style={{width: '70%', textAlign: 'right'}}>
                    {project.projectContent}
                </div>
            </div>
            {
                (ishow) && <div style={{
                    marginBottom: '0.2rem',
                }}>
                    <div style={{color: '#86909c'}}>
                        部门评价
                    </div>
                    <div style={{marginTop: '0.1rem'}}>
                        <Input.TextArea value={value} onChange={handleChange} placeholder="请输入部门评价"/>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'right', marginTop: '0.1rem'}}>
                        <Button onClick={() => {
                            commnent()
                        }} type={'primary'}>提交</Button>
                    </div>
                </div>
            }
        </div>
    )
}
