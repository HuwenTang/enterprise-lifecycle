import TopBarColor from "../../../components/TopBar/TopBarColor.tsx";
import {useEffect, } from "react";
import {useSearchParams} from "react-router-dom";
import {Checkbox, TabsProps} from "antd";
import {Tabs} from "react-vant";


export default function QualitativeEffect() {
    const plainOptions = ['优秀', '良好', '一般','需整改'];
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')

    const items = ['第一年','第二年','第三年']
    const data1 = [
        {
            value:'1100',
            title:'协议总投资',
            sub:'（万元/万美元）'
        },
        {
            value:'1100',
            title:'实际总投资',
            sub:'（万元/万美元）'
        },
        {
            value:'23',
            title:'协议投资强度',
            sub:'(万元/亩,万美元/亩)'
        },{
            value:'23',
            title:'实际投资强度',
            sub:'(万元/亩,万美元/亩)'
        },
        {
            value:'33',
            title:'协议固定资产投资',
            sub:'（万元/万美元）'
        },

        {
            value:'22',
            title:'实际固定资产投资',
            sub:'（万元/万美元）'
        },
        {
            value:'221',
            title:'协议设备投资',
            sub:'（万元/万美元）'
        },
        {
            value:'245',
            title:'实际设备投资',
            sub:'（万元/万美元）'
        },
        {
            value:'33',
            title:'协议年耗能情况',
            sub:'(吨、等价值)'
        },
        {
            value:'33',
            title:'实际年耗能情况',
            sub:'(吨、等价值)'
        },
        {
            value:'22',
            title:'协议年排污情况',
            sub:'（废水、废气等)'
        },{
            value:'22',
            title:'实际年排污情况',
            sub:'（废水、废气等)'
        },
    ]
    const data2 = [
        {
            value:'1100',
            title:'协议开票销售',
            sub:'（万元）'
        },
        {
            value:'1100',
            title:'实际开票销售',
            sub:'（万元）'
        },
        {
            value:'100',
            title:'完成率',
            sub:'%'
        },
        {
            value:'1100',
            title:'预期税收',
            sub:'（万元）'
        },
        {
            value:'1000',
            title:'实际税收',
            sub:'（万元）'
        },
        {
            value:'100',
            title:'完成率',
            sub:'%'
        },
        {
            value:'1000',
            title:'预期亩均税收',
            sub:'（万元）'
        },
        {
            value:'1000',
            title:'实际亩均税收',
            sub:'（万元）'
        },
        {
            value:'100',
            title:'完成率',
            sub:'%'
        },
    ]

    useEffect(()=>{
        console.log(id)

    },[])
    return (
        <div style={{
            height: '100vh',
            fontSize: '0.16rem',
            overflow: 'scroll',
            scrollbarWidth: 'none',
            backgroundColor: '#f6f8f9'
        }}>
            <TopBarColor color={'#60a9ff'} title={'评价表单'} time={false} />
            <div style={{
                padding: '0 0.2rem',
            }}>
                <div style={{
                    padding: '0.2rem 0',
                    fontSize: '0.2rem',
                    fontWeight: 'bolder',
                    textAlign: 'center',
                }}>
                    新增制造业项目质效评价表
                </div>
                <div style={{backgroundColor: '#fff', borderRadius: '0.1rem'}}>
                    <div style={{
                        backgroundImage: 'linear-gradient(90deg, #26b653, #e7fdef)',
                        height: '0.4rem',
                        lineHeight: '0.4rem',
                        color: '#fff',
                        fontSize: '0.2rem',
                        paddingLeft: '0.2rem',
                        borderTopLeftRadius: '0.1rem',
                        borderTopRightRadius: '0.1rem'
                    }}>基本情况
                    </div>
                    <div style={{padding: '0.2rem'}}>
                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>投资方名称
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>项目在泰实施主体内容
                            </div>
                        </div>
                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>是否属于上市企业
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>是
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>项目名称
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>生物医药产业
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>重点项目
                            </div>
                            <div style={{color: '#333', marginBottom: '0.15rem', fontSize: '0.18rem'}}
                                 className={'content'}>
                                <Checkbox.Group options={['省级重点项目', '市级重点项目']}
                                                defaultValue={['省级重点项目']} disabled/>
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>企业联系人
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>周丽莉
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>联系电话
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>15987622891
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>主要产品、产能及主要建设内容
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>主要建设内容
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>行业分类及代码
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>203917230971207120MM
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>产业方向
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>医药
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>项目地址
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>浙江省xx市xx区xx街109号2栋
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>协议开工时间
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>2024年2月23日
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>实际开工时间
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>2024年2月23日
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>协议竣工时间
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>2024年2月23日
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>实际竣工时间
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>2024年2月23日
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>申请用地面积（亩）
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>323亩
                            </div>
                        </div>
                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>实际用地面积（亩）
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>323亩
                            </div>
                        </div>

                    </div>


                </div>

                <div style={{backgroundColor: '#fff', borderRadius: '0.1rem', marginTop: '0.2rem',}}>
                    <div style={{
                        backgroundImage: 'linear-gradient(90deg, #11a0f7, #e2f2fd)',
                        height: '0.4rem',
                        lineHeight: '0.4rem',
                        color: '#fff',
                        fontSize: '0.2rem',
                        paddingLeft: '0.2rem',
                        borderTopLeftRadius: '0.1rem',
                        borderTopRightRadius: '0.1rem'
                    }}>
                    </div>
                    <div style={{padding: '0.2rem', display: 'grid', gridTemplateColumns: '1fr 1fr',}}>
                        {
                            data1.map((item, index) => {
                                return <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }} key={index}>
                                    <div style={{
                                        fontWeight: 'bold',
                                        color: '#10a0f8',
                                        marginBottom: '0.05rem',
                                    }}>{item.value}</div>
                                    <div style={{
                                        fontSize: '0.12rem',
                                        color: '#333',
                                        marginBottom: '0.05rem',
                                    }}>{item.title}</div>
                                    <div style={{
                                        fontSize: '0.12rem',
                                        color: '#333',
                                        marginBottom: '0.1rem',
                                    }}>{item.sub}</div>
                                </div>
                            })
                        }

                    </div>
                    <div style={{width: '100%'}}>
                        <Tabs color='#10a0f8' defaultActive={0}>
                            {items.map(item => (
                                <Tabs.TabPane key={item} title={item}>
                                    <div style={{
                                        padding: '0.1rem',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr 1fr',
                                    }}>
                                        {
                                            data2.map((item, index) => {
                                                return <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }} key={index}>
                                                    <div style={{
                                                        fontWeight: 'bold',
                                                        color: '#10a0f8',
                                                        marginBottom: '0.05rem',
                                                    }}>{item.value}</div>
                                                    <div style={{
                                                        fontSize: '0.12rem',
                                                        color: '#333',
                                                        marginBottom: '0.05rem',
                                                    }}>{item.title}</div>
                                                    <div style={{
                                                        fontSize: '0.12rem',
                                                        color: '#333',
                                                        marginBottom: '0.1rem',
                                                    }}>{item.sub}</div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </Tabs.TabPane>
                            ))}
                        </Tabs>
                    </div>

                </div>


                <div style={{backgroundColor: '#fff', borderRadius: '0.1rem', marginTop: '0.2rem'}}>
                    <div style={{
                        backgroundImage: 'linear-gradient(90deg, #7158ff, #f2e8fe)',
                        height: '0.4rem',
                        lineHeight: '0.4rem',
                        color: '#fff',
                        fontSize: '0.2rem',
                        paddingLeft: '0.2rem',
                        borderTopLeftRadius: '0.1rem',
                        borderTopRightRadius: '0.1rem'
                    }}>
                    </div>
                    <div style={{padding: '0.2rem'}}>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>落户后获专利数
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>22
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}}
                                 className={'title'}>落户后获省级以上科技或人才等项目支持
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>填写具体名称
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>落户后获风险投资（万元/万美元）
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>1000
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>落户后参赛获奖情况
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>20
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{backgroundColor: '#fff', borderRadius: '0.1rem', marginTop: '0.2rem'}}>
                    <div style={{
                        backgroundImage: 'linear-gradient(90deg, #00b7b6, #e3fbfb)',
                        height: '0.4rem',
                        lineHeight: '0.4rem',
                        color: '#fff',
                        fontSize: '0.2rem',
                        paddingLeft: '0.2rem',
                        borderTopLeftRadius: '0.1rem',
                        borderTopRightRadius: '0.1rem'
                    }}>
                    </div>
                    <div style={{padding: '0.2rem'}}>
                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>综合评价等级
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>

                                <Checkbox.Group options={plainOptions} defaultValue={['优秀']} disabled/>
                            </div>
                        </div>

                        <div>
                            <div style={{color: '#8e8e8e', marginBottom: '0.1rem'}} className={'title'}>部门风险提示
                            </div>
                            <div style={{color: '#333', marginBottom: '0.1rem'}}
                                 className={'content'}>XXX部门XXX建议，XXX提示。
                            </div>
                        </div>
                    </div>

                </div>


                <div style={{padding: '0.2rem 0', color: '#8e8e8e'}}>
                    注：租赁厂房项目，按2000平米：1亩折算用地面积。
                </div>
            </div>
        </div>
    );
}
