import TopBarColor from "../../../components/TopBar/TopBarColor.tsx";
import {useEffect, useState,} from "react";
import {useLocation, useSearchParams} from "react-router-dom";
import {Button, Checkbox, Input, message, Steps, Tag} from "antd";
import {primeApi} from "../../../api.ts";
import dayjs from "dayjs";
import {ExtZsProjProjectSignedVo} from "../../../apis";

export default function QualitativeState() {
    const plainOptions = ['优秀', '良好', '一般'];
    const plainOptions1 = ['强相关', '一般', '不相关'];
    const plainOptions2 = ['高', '中', '低'];
    const plainOptions7 = ['是', '否'];
    const plainOptions8 = ['有', '无'];
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const zsid = searchParams.get('zsid')
    const isCom = searchParams.get('isCom')
    const [value, setValue] = useState<string>()
    const [list, setList] = useState([])
    const [msg, setMsg] = useState<ExtZsProjProjectSignedVo>()
    const [ishow, setIshow] = useState(false)
    const check = async () => {
        const data = await primeApi.check({zsId: id || ''})
        setIshow(data.value)
    }

    const getExtZsProjProjectSigned = async () => {
        const data = await primeApi.getExtZsProjProjectSigned({zsid: id!})
        console.log(data)
        setMsg(data)
    }

    const getlistProjectDigitalQualityEvaluation = async () => {
        const data = await primeApi.listProjectDigitalProjectReviewAll({zsId: id!, step: '1'})
        const l = data.records.map(item => {
            return {
                title: item.cobName,
                description: (
                    <div style={{fontSize: '12px'}}>
                        <div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}} className={'title'}>
                                {item.name}{item.deptName}
                            </div>
                            <div
                                style={{
                                    padding: '5px',
                                    backgroundColor: '#f0f6ff',
                                }}
                            >
                                <div><Tag
                                    color={item.status === '未完成' ? 'red' : item.status === '已完成' ? 'success' : 'processing'}>{item.status}</Tag>{item.comment}
                                </div>
                            </div>
                        </div>
                        <div>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                    </div>
                ),
            }
        })
        setList(l)
    }

    const commnent = async () => {
        try {
            await primeApi.updateProjectDigitalQualityEvaluation({
                projectDigitalProjectReviewAllDto: {
                    digitalInvestmentId: id ? id : '',
                    // result: '已完成',
                    comment: value
                }
            })
            message.success('操作成功')
            getlistProjectDigitalQualityEvaluation()
            setIshow(false)
        } catch (e) {
            message.error('操作失败')
        }
    }

    const handleChange = (e) => {
        setValue(e.target.value); // 更新 state
    };
    const [responsive, setResponsive] = useState(false);
    const location = useLocation();
    useEffect(() => {
        check()
        getlistProjectDigitalQualityEvaluation()
        getExtZsProjProjectSigned()

        lx.device.getSystemInfo({
            success: function (res) {
                console.info('SystemInfo', res)
                if (res.systemType === 'iOS' || res.systemType === 'Android') {
                    setResponsive(true)
                }
            },
            fail: function (err) {
                console.error(err);
            },
        });

    }, [])
    return (
        <div style={{
            height: '100vh',
            fontSize: '0.16rem',
            overflow: 'scroll',
            scrollbarWidth: 'none',
            backgroundColor: '#f6f8f9'
        }}>
            <TopBarColor color={'#60a9ff'} title={'评价表单'} time={false}/>
            <div style={{
                padding: '0 0.2rem',
            }}>
                <div style={{
                    padding: '0.2rem 0',
                    fontSize: '0.2rem',
                    fontWeight: 'bolder',
                    textAlign: 'center',
                }}>
                    项目质态评估表
                </div>
                {/*<div>*/}
                {/*    {location.search}*/}
                {/*    <div>isCom {isCom}</div>*/}
                {/*</div>*/}
                <div style={{backgroundColor: '#fff', padding: '0.2rem'}}>
                    {/* 项目名称 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">项目名称</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.name || '-'}
                        </div>
                    </div>

                    {/* 填报单位 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">填报单位</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.zoneName || '-'}
                        </div>
                    </div>

                    {/* 项目选址 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">项目选址</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.projectAddress || '-'}
                        </div>
                    </div>

                    {/* 主要产品、产能及建设内容 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}}
                             className="title">主要产品、产能及建设内容
                        </div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.desc || '-'}
                        </div>
                    </div>

                    {/* 预计开工时间 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">预计开工时间</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.planStartDate ? dayjs(msg.planStartDate).format('YYYY年MM月DD日') : '-'}
                        </div>
                    </div>

                    {/* 预计竣工时间 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">预计竣工时间</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.planEndDate ? dayjs(msg.planEndDate).format('YYYY年MM月DD日') : '-'}
                        </div>
                    </div>

                    {/* 投资方名称 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">投资方名称</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.investor || '-'}
                        </div>
                    </div>

                    {/* 注册资本 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}}
                             className="title">注册资本（{msg?.ptype===1?'万元':'万美元'}）
                        </div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.zhuceMoney || '-'}
                        </div>
                    </div>

                    {/* 项目类型 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">项目类型</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.bindustry === 1 ? '服务业' : msg?.bindustry === 2 ? '工业' : '-'}
                        </div>
                    </div>

                    {/* 行业代码 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">行业代码</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.industryName || '-'}
                        </div>
                    </div>

                    {/* 外资项目 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">外资项目</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.ptype === 1 ? '否' : msg?.ptype === 2 ? '是' : '-'}
                        </div>
                    </div>

                    {/* 科创项目 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">科创项目</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.isKcProj || '-'}
                        </div>
                    </div>

                    {/* 上市企业 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">上市企业</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.isListed === 1 ? '是' : msg?.isListed === 2 ? '否' : '-'}
                        </div>
                    </div>

                    {/* 高新技术企业 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">高新技术企业</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.isGxjs || '-'}
                        </div>
                    </div>

                    {/* 产业方向 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">产业方向</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.projTypeLabel || '-'}
                        </div>
                    </div>

                    {/* 产业关联度 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">产业关联度</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            <Checkbox.Group options={plainOptions1} disabled value={[msg?.cyGl]}/>
                        </div>
                    </div>

                    {/* 特殊行业 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">特殊行业</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            <Checkbox.Group options={plainOptions7} disabled value={[msg?.tshy]}/>
                        </div>
                    </div>

                    {/* 准入限制 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">准入限制</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            <Checkbox.Group options={plainOptions8} disabled value={[msg?.zrxz]}/>
                        </div>
                    </div>

                    {/* 两高项目 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">两高项目</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            <Checkbox.Group options={plainOptions7} disabled value={[msg?.lgxm]}/>
                        </div>
                    </div>

                    {/* 重金属排放 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">重金属排放</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            <Checkbox.Group options={plainOptions8} disabled value={[msg?.zjspf]}/>
                        </div>
                    </div>

                    {/* 预计年耗能情况 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}}
                             className="title">预计年耗能情况(吨标煤)
                        </div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.totalUse || '-'}
                        </div>
                    </div>

                    {/* 预计年排污情况 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}}
                             className="title">预计年排污情况（废水、废气等）
                        </div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.isWuran || '-'}
                        </div>
                    </div>

                    {/* 计划总投资 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}}
                             className="title">计划总投资（{msg?.ptype===1?'万元':'万美元'}）
                        </div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.planTotal1 || '-'}
                        </div>
                    </div>

                    {/* 申请用地 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">申请用地（亩）</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.sqLandArea || '-'}
                        </div>
                    </div>

                    {/* 租赁厂房面积 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">租赁厂房面积（平方米）
                        </div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.zlLandArea || '-'}
                        </div>
                    </div>

                    {/* 折算用地 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">折算用地（亩）</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.zlLandAreaZs || '-'}
                        </div>
                    </div>

                    {/* 计划投资强度 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}}
                             className="title">计划投资强度（万元/亩，万美元/亩）
                        </div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.investLevel || '-'}
                        </div>
                    </div>

                    {/* 固定资产投资 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">固定资产投资（万元）
                        </div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.fixedInvest || '-'}
                        </div>
                    </div>

                    {/* 预期年均产值 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">预期年均产值（万元）
                        </div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.yqCz1 || '-'}
                        </div>
                    </div>

                    {/* 预期年均开票销售 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}}
                             className="title">预期年均开票销售（万元）
                        </div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.yqKpxs1 || '-'}
                        </div>
                    </div>

                    {/* 预期年均税收 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">预期年均税收（万元）
                        </div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.yqSs1 || '-'}
                        </div>
                    </div>

                    {/* 预期年均亩均税收 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}}
                             className="title">预期年均亩均税收（万元）
                        </div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.yqMjtax1 || '-'}
                        </div>
                    </div>

                    {/* 各市（区）评估结论 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">各市（区）评估结论</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            <Checkbox.Group options={plainOptions} disabled value={[msg?.zhpg]}/>
                        </div>
                    </div>

                    {/* 佐证材料 */}
                    <div>
                        <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className="title">项目情况分析和评审结果</div>
                        <div style={{color: '#333', marginBottom: '0.15rem', }} className="content">
                            {msg?.ztpgzzcl && msg.ztpgzzcl.length > 0 ? (
                                <div>
                                    {msg.ztpgzzcl.map((url: string, index: number) => {
                                        if (!url || !url.trim()) return null;
                                        const fileName = url.split('/').pop()?.split('?')[0] || `下载附件${msg.ztpgzzcl!.length > 1 ? `(${index + 1})` : ''}`;
                                        return (
                                            <a
                                                key={index}
                                                href={url.trim()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ marginRight: index > 0 ? 16 : 0 }}
                                            >
                                                {fileName}
                                            </a>
                                        );
                                    })}
                                </div>
                            ) : (
                                <span>无材料</span>
                            )}
                        </div>
                    </div>
                </div>
                <div style={{padding: '0.2rem 0', color: '#8e8e8e'}}>
                    备注：1. 此表由项目招引主体填报，市级部门仅做风险提示，不做一票否决。
                    <br/>
                    2. 项目正式签约后，该表经修改转为项目签约信息表。
                    <br/>
                    3. 5亿元以上项目自动推送给市发改、工信、环保、应急、税务等部门做风险提示。
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

                <div style={{backgroundColor: '#fff', padding: '0.2rem', marginBottom: '0.2rem'}}>
                    <Steps
                        direction="vertical"
                        progressDot
                        current={11}
                        style={{fontSize: '12px'}}
                        items={list}
                    />
                </div>
            </div>
        </div>
    );
}
