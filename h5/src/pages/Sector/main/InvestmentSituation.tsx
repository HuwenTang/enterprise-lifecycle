import {useState} from "react";

export default function InvestmentSituation() {
    const [active, setActive] = useState(true)
    const [tabActive, setTabactive] = useState(0)
    const [tabActive1, setTabactive1] = useState(0)
    const [active1, setActive1] = useState(true)
    const [active2, setActive2] = useState(true)

    const tab1 = [
        {name: '产业分类', key: 0},
        {name: '项目规模', key: 1},
        {name: '进展情况', key: 2},
        {name: '项目需求', key: 3}
    ]

    const tab3 = [
        {name: '产业分类', key: 0},
        {name: '项目规模', key: 1},
        {name: '项目需求', key: 3}
    ]
    const tab2 = [
        {name: '三大产业创新集群', key: 0, color: '#14c9c9'},
        {name: '重点产业', key: 1, color: '#376ce7'},
        {name: '其他产业', key: 2, color: '#f7ba1e'},
    ]
    const neizi =  [
        {name: '总计', key: 0, value: 0, value1: 0},
        {name: '1. 20亿以上', key: 1, value: 0, value1: 0},
        {name: '2. 10-20亿', key: 2, value: 0, value1: 0},
        {name: '3. 5-10亿', key: 3, value: 0, value1: 0},
        {name: '4. 1-5亿', key: 4, value: 0, value1: 0},
        {name: '5. 1亿元以下', key: 5, value: 0, value1: 0},
    ]
    const waizi =  [
        {name: '总计', key: 0, value: 0, value1: 0},
        {name: '1亿美元及以上', key: 1, value: 0, value1: 0},
        {name: '5000万美元～1亿美元', key: 2, value: 0, value1: 0},
        {name: '5000万美元以下', key: 3, value: 0, value1: 0},
    ]
    const jinzhan =  [
        {name: '注册中', key: 0, value: 0, value1: 0},
        {name: '已注册', key: 1, value: 0, value1: 0},
        {name: '已开工', key: 2, value: 0, value1: 0},
        {name: '已竣工', key: 3, value: 0, value1: 0},
        {name: '已投产', key: 3, value: 0, value1: 0},
    ]
    return (
        <div style={{
            fontSize: "0.14rem",
            padding: "0.2rem",
        }}>
            <div style={{
                fontWeight: "bolder",
            }}>
                整体情况
            </div>
            <div style={{
                padding: '0.1rem 0.2rem',
                backgroundColor: '#f7fafe',
                marginTop: '0.2rem'
            }}>
                <div style={{
                    display: 'flex',
                    marginBottom: '0.2rem',
                }}>
                    <div style={{color: '#264099', width: '33%'}}>在谈项目</div>
                    <div style={{width: '33%', color: '#86909c'}}>
                        <div>项目数量（个）</div>
                        <div style={{marginTop: '0.1rem'}}>0</div>
                    </div>
                    <div style={{width: '33%', color: '#86909c'}}>
                        <div>投资额（亿）</div>
                        <div style={{marginTop: '0.1rem'}}>0</div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    marginBottom: '0.2rem',
                }}>
                    <div style={{color: '#264099', width: '33%'}}>签约项目</div>
                    <div style={{width: '33%', color: '#86909c'}}>
                        <div>项目数量（个）</div>
                        <div style={{marginTop: '0.1rem'}}>0</div>
                    </div>
                    <div style={{width: '33%', color: '#86909c'}}>
                        <div>投资额（亿）</div>
                        <div style={{marginTop: '0.1rem'}}>0</div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                }}>
                    <div style={{color: '#264099', width: '33%'}}>本月新增</div>
                    <div style={{width: '33%', color: '#86909c'}}>
                        <div>在谈项目（个）</div>
                        <div style={{marginTop: '0.1rem'}}>0</div>
                    </div>
                    <div style={{width: '33%', color: '#86909c'}}>
                        <div>签约项目（个）</div>
                        <div style={{marginTop: '0.1rem'}}>0</div>
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: '0.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{
                    fontWeight: "bolder",
                }}>
                    外出招商
                </div>
                <div style={{
                    padding: '0 0.01rem ',
                    width: '1.4rem',
                    height: '0.3rem',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '0.155rem',
                    backgroundColor: '#eeeff5'
                }}>
                    <div onClick={() => {
                        setActive(true)
                    }} style={{
                        width: '50%',
                        textAlign: 'center',
                        color: active ? '#264099' : '#333',
                        height: '0.24rem',
                        borderRadius: '0.12rem',
                        lineHeight: '0.24rem',
                        backgroundColor: active ? '#fff' : ''
                    }}>境内
                    </div>
                    <div onClick={() => {
                        setActive(false)
                    }} style={{
                        width: '50%',
                        textAlign: 'center',
                        color: active ? '#333' : '#264099',
                        backgroundColor: active ? '' : '#fff',
                        height: '0.24rem',
                        borderRadius: '0.12rem',
                        lineHeight: '0.24rem',
                    }}>境外
                    </div>
                </div>
            </div>
            <div style={{
                display: 'flex',
                margin: '0.2rem  -0.2rem'
            }}>
                <div>
                    <div style={{
                        backgroundColor: '#516eec',
                        padding: '0.1rem',
                        textAlign: 'center',
                        color: '#fff'
                    }}>总计
                    </div>
                    <div style={{
                        padding: '0.1rem',
                        textAlign: 'center',
                        backgroundColor: '#eff6f5'
                    }}>0
                    </div>
                </div>
                <div>
                    <div style={{
                        backgroundColor: '#516eec',
                        padding: '0.1rem',
                        textAlign: 'center',
                        color: '#fff'
                    }}>当月新增外出招商
                    </div>
                    <div style={{
                        padding: '0.1rem',
                        textAlign: 'center',
                        backgroundColor: '#eff6f5'
                    }}>0
                    </div>
                </div>
                <div>
                    <div style={{
                        backgroundColor: '#516eec',
                        padding: '0.1rem',
                        textAlign: 'center',
                        color: '#fff'
                    }}>拜访项目
                    </div>
                    <div style={{
                        padding: '0.1rem',
                        textAlign: 'center',
                        backgroundColor: '#eff6f5'
                    }}>0
                    </div>
                </div>
                <div>
                    <div style={{
                        backgroundColor: '#516eec',
                        padding: '0.1rem',
                        textAlign: 'center',
                        color: '#fff'
                    }}>当月新增拜访项目
                    </div>
                    <div style={{
                        padding: '0.1rem',
                        textAlign: 'center',
                        backgroundColor: '#eff6f5'
                    }}>0
                    </div>
                </div>
                <div>
                    <div style={{
                        backgroundColor: '#516eec',
                        padding: '0.1rem',
                        textAlign: 'center',
                        color: '#fff'
                    }}>关联项目
                    </div>
                    <div style={{
                        padding: '0.1rem',
                        textAlign: 'center',
                        backgroundColor: '#eff6f5'
                    }}>0
                    </div>
                </div>
                <div>
                    <div style={{
                        backgroundColor: '#516eec',
                        padding: '0.1rem',
                        textAlign: 'center',
                        color: '#fff'
                    }}>最近外出招商时间
                    </div>
                    <div style={{
                        padding: '0.1rem',
                        textAlign: 'center',
                        backgroundColor: '#eff6f5'
                    }}>0
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: '0.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{
                    fontWeight: "bolder",
                }}>
                    项目情况
                </div>
                <div style={{
                    padding: '0 0.01rem ',
                    width: '1.4rem',
                    height: '0.3rem',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '0.155rem',
                    backgroundColor: '#eeeff5'
                }}>
                    <div onClick={() => {
                        setActive1(true)
                    }} style={{
                        width: '50%',
                        textAlign: 'center',
                        color: active ? '#264099' : '#333',
                        height: '0.24rem',
                        borderRadius: '0.12rem',
                        lineHeight: '0.24rem',
                        backgroundColor: active1 ? '#fff' : ''
                    }}>项目签约
                    </div>
                    <div onClick={() => {
                        setActive1(false)
                    }} style={{
                        width: '50%',
                        textAlign: 'center',
                        color: active ? '#333' : '#264099',
                        backgroundColor: active1 ? '' : '#fff',
                        height: '0.24rem',
                        borderRadius: '0.12rem',
                        lineHeight: '0.24rem',
                    }}>在谈项目
                    </div>
                </div>
            </div>

            {
                active1 && <div style={{
                    marginTop: "0.2rem",
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#666'
                }}>
                    {
                        tab1.map((item, index) => {
                            return (
                                <div onClick={() => {
                                    setTabactive(index)
                                }} style={{
                                    width: '24%',
                                    height: '0.32rem',
                                    lineHeight: '0.32rem',
                                    borderRadius: '0.08rem',
                                    textAlign: 'center',
                                    backgroundColor: tabActive === index ? '#377cfd' : '#f3f5fa',
                                    color: tabActive === index ? '#fff' : '#666',
                                }} key={index}>
                                    {item.name}
                                </div>
                            )
                        })
                    }
                </div>
            }

            {
                !active1 && <div style={{
                    marginTop: "0.2rem",
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#666'
                }}>
                    {
                        tab3.map((item, index) => {
                            return (
                                <div onClick={() => {
                                    setTabactive1(index)
                                }} style={{
                                    width: '24%',
                                    height: '0.32rem',
                                    lineHeight: '0.32rem',
                                    borderRadius: '0.08rem',
                                    textAlign: 'center',
                                    backgroundColor: tabActive1 === index ? '#377cfd' : '#f3f5fa',
                                    color: tabActive1 === index ? '#fff' : '#666',
                                }} key={index}>
                                    {item.name}
                                </div>
                            )
                        })
                    }
                </div>
            }


            <div>
                {(tabActive === 0&&active1) &&
                    tab2.map((item, index) => {
                        return (
                            <div key={index} style={{
                                padding: '0 0.1rem 0 0.2rem',
                                height: '0.5rem',
                                backgroundColor: '#f2f7ff',
                                marginBottom: '0.1rem',
                                marginTop: '0.1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <div style={{
                                    height: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                    <div style={{
                                        height: '0.1rem',
                                        width: '0.1rem',
                                        borderRadius: '0.1rem',
                                        backgroundColor: item.color
                                    }}>
                                    </div>
                                    <div style={{
                                        marginLeft: '0.1rem',
                                        width: '0.6rem'
                                    }}>
                                        {item.name}
                                    </div>
                                    <div style={{
                                        marginLeft: '0.2rem',
                                        fontSize: '0.20rem',
                                        color: item.color
                                    }}>
                                        0%
                                    </div>
                                    <div style={{
                                        marginLeft: '0.2rem',
                                        color: '#959595'
                                    }}>
                                        <div>项目数量</div>
                                        <div>0个</div>
                                    </div>
                                    <div style={{
                                        marginLeft: '0.2rem',
                                        color: '#959595'
                                    }}>
                                        <div>项目金额</div>
                                        <div>0亿元</div>
                                    </div>
                                </div>
                                <div>
                                    <img style={{
                                        width: '0.2rem'
                                    }} src="/img/rightG.png" alt=""/>
                                </div>
                            </div>
                        )
                    })
                }
                {(tabActive === 1&&active1) &&
                    <div style={{
                        marginTop: '0.2rem',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'right',
                        }}>
                            <div style={{
                                padding: '0 0.01rem ',
                                width: '1.4rem',
                                height: '0.3rem',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '0.155rem',
                                backgroundColor: '#eeeff5'
                            }}>
                                <div onClick={() => {
                                    setActive2(true)
                                }} style={{
                                    width: '50%',
                                    textAlign: 'center',
                                    color: active2 ? '#264099' : '#333',
                                    height: '0.24rem',
                                    borderRadius: '0.12rem',
                                    lineHeight: '0.24rem',
                                    backgroundColor: active2 ? '#fff' : ''
                                }}>内资项目
                                </div>
                                <div onClick={() => {
                                    setActive2(false)
                                }} style={{
                                    width: '50%',
                                    textAlign: 'center',
                                    color: active2 ? '#333' : '#264099',
                                    backgroundColor: active2 ? '' : '#fff',
                                    height: '0.24rem',
                                    borderRadius: '0.12rem',
                                    lineHeight: '0.24rem',
                                }}>外资项目
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{
                                marginTop:'0.2rem',
                                display: 'flex',
                                justifyContent:'space-between',
                                height:'0.4rem',
                                alignItems:'center',
                                fontSize:'0.14rem',
                                backgroundColor:'#3e61f1',
                                color:'#fff',
                            }}>
                                <div style={{
                                    width:'33%',
                                    textAlign:'center',
                                    borderRight:'1px solid #eee'
                                }}>投资总额</div>
                                <div style={{
                                    width:'33%',
                                    textAlign:'center',
                                    borderRight:'1px solid #eee'
                                }}>项目数量</div>
                                <div style={{
                                    width:'33%',
                                    textAlign:'center'
                                }}>
                                    <div>
                                        投资总额小计
                                </div>
                                    <div>
                                        {active2&&'（亿元）'}
                                        {!active2&&'（亿美元）'}

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            {active2&&neizi.map((item,index)=>{
                                return(
                                    <div key={index} style={{
                                        marginTop: '0.05rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        height: '0.4rem',
                                        alignItems: 'center',
                                        fontSize:'0.12rem',
                                        backgroundColor: '#f2f7ff',
                                        color: '#1d233b',
                                    }}>
                                        <div style={{
                                            width: '33%',
                                            textAlign: 'center',
                                            borderRight: '1px solid #eee'
                                        }}>{item.name}
                                        </div>
                                        <div style={{
                                            width: '33%',
                                            textAlign: 'center',
                                            borderRight: '1px solid #eee'
                                        }}>{item.value}
                                        </div>
                                        <div style={{
                                            width: '33%',
                                            textAlign: 'center'
                                        }}>{item.value1}
                                        </div>
                                    </div>
                                )
                            })
                            }
                            {!active2&&waizi.map((item,index)=>{
                                return(
                                    <div key={index} style={{
                                        marginTop: '0.05rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        height: '0.4rem',
                                        alignItems: 'center',
                                        fontSize:'0.12rem',

                                        backgroundColor: '#f2f7ff',
                                        color: '#1d233b',
                                    }}>
                                        <div style={{
                                            width: '33%',
                                            textAlign: 'center',
                                            borderRight: '1px solid #eee'
                                        }}>{item.name}
                                        </div>
                                        <div style={{
                                            width: '33%',
                                            textAlign: 'center',
                                            borderRight: '1px solid #eee'
                                        }}>{item.value}
                                        </div>
                                        <div style={{
                                            width: '33%',
                                            textAlign: 'center'
                                        }}>{item.value1}
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </div>

                    </div>
                }

                {
                    (tabActive===2&&active1)&&
                    <div>
                        <div>
                            <div style={{
                                marginTop: '0.2rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                height: '0.4rem',
                                alignItems: 'center',
                                fontSize: '0.14rem',
                                backgroundColor: '#3e61f1',
                                color: '#fff',
                            }}>
                                <div style={{
                                    width: '33%',
                                    textAlign: 'center',
                                    borderRight: '1px solid #eee'
                                }}>进展阶段
                                </div>
                                <div style={{
                                    width: '33%',
                                    textAlign: 'center',
                                    borderRight: '1px solid #eee'
                                }}>项目数量
                                </div>
                                <div style={{
                                    width: '33%',
                                    textAlign: 'center'
                                }}>投资总额（亿元）
                                </div>
                            </div>
                        </div>

                        {jinzhan.map((item,index)=>{
                            return(
                                <div key={index} style={{
                                    marginTop: '0.05rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    height: '0.4rem',
                                    alignItems: 'center',
                                    fontSize:'0.12rem',

                                    backgroundColor: '#f2f7ff',
                                    color: '#1d233b',
                                }}>
                                    <div style={{
                                        width: '33%',
                                        textAlign: 'center',
                                        borderRight: '1px solid #eee'
                                    }}>{item.name}
                                    </div>
                                    <div style={{
                                        width: '33%',
                                        textAlign: 'center',
                                        borderRight: '1px solid #eee'
                                    }}>{item.value}
                                    </div>
                                    <div style={{
                                        width: '33%',
                                        textAlign: 'center'
                                    }}>{item.value1}
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                }

                {(tabActive1 === 2&&!active1) &&
                    <div></div>
                }

                {(tabActive1 === 0&&!active1) &&
                    tab2.map((item, index) => {
                        return (
                            <div key={index} style={{
                                padding: '0 0.1rem 0 0.2rem',
                                height: '0.5rem',
                                backgroundColor: '#f2f7ff',
                                marginBottom: '0.1rem',
                                marginTop: '0.1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <div style={{
                                    height: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                    <div style={{
                                        height: '0.1rem',
                                        width: '0.1rem',
                                        borderRadius: '0.1rem',
                                        backgroundColor: item.color
                                    }}>
                                    </div>
                                    <div style={{
                                        marginLeft: '0.1rem',
                                        width: '0.6rem'
                                    }}>
                                        {item.name}
                                    </div>
                                    <div style={{
                                        marginLeft: '0.2rem',
                                        fontSize: '0.20rem',
                                        color: item.color
                                    }}>
                                        0%
                                    </div>
                                    <div style={{
                                        marginLeft: '0.2rem',
                                        color: '#959595'
                                    }}>
                                        <div>项目数量</div>
                                        <div>0个</div>
                                    </div>
                                    <div style={{
                                        marginLeft: '0.2rem',
                                        color: '#959595'
                                    }}>
                                        <div>项目金额</div>
                                        <div>0亿元</div>
                                    </div>
                                </div>
                                <div>
                                    <img style={{
                                        width: '0.2rem'
                                    }} src="/img/rightG.png" alt=""/>
                                </div>
                            </div>
                        )
                    })
                }

                {(tabActive1 === 1&&!active1) &&
                    <div style={{
                        marginTop: '0.2rem',

                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'right',
                        }}>
                            <div style={{
                                padding: '0 0.01rem ',
                                width: '1.4rem',
                                height: '0.3rem',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '0.155rem',
                                backgroundColor: '#eeeff5'
                            }}>
                                <div onClick={() => {
                                    setActive2(true)
                                }} style={{
                                    width: '50%',
                                    textAlign: 'center',
                                    color: active2 ? '#264099' : '#333',
                                    height: '0.24rem',
                                    borderRadius: '0.12rem',
                                    lineHeight: '0.24rem',
                                    backgroundColor: active2 ? '#fff' : ''
                                }}>内资项目
                                </div>
                                <div onClick={() => {
                                    setActive2(false)
                                }} style={{
                                    width: '50%',
                                    textAlign: 'center',
                                    color: active2 ? '#333' : '#264099',
                                    backgroundColor: active2 ? '' : '#fff',
                                    height: '0.24rem',
                                    borderRadius: '0.12rem',
                                    lineHeight: '0.24rem',
                                }}>外资项目
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{
                                marginTop:'0.2rem',
                                display: 'flex',
                                justifyContent:'space-between',
                                height:'0.4rem',
                                alignItems:'center',
                                fontSize:'0.14rem',
                                backgroundColor:'#3e61f1',
                                color:'#fff',
                            }}>
                                <div style={{
                                    width:'33%',
                                    textAlign:'center',
                                    borderRight:'1px solid #eee'
                                }}>投资总额</div>
                                <div style={{
                                    width:'33%',
                                    textAlign:'center',
                                    borderRight:'1px solid #eee'
                                }}>项目数量</div>
                                <div style={{
                                    width:'33%',
                                    textAlign:'center'
                                }}>投资总额小计（亿元）</div>
                            </div>
                        </div>
                        <div >
                            {active2&&neizi.map((item,index)=>{
                                return(
                                    <div key={index} style={{
                                        marginTop: '0.05rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        height: '0.4rem',
                                        alignItems: 'center',
                                        fontSize:'0.12rem',

                                        backgroundColor: '#f2f7ff',
                                        color: '#1d233b',
                                    }}>
                                        <div style={{
                                            width: '33%',
                                            textAlign: 'center',
                                            borderRight: '1px solid #eee'
                                        }}>{item.name}
                                        </div>
                                        <div style={{
                                            width: '33%',
                                            textAlign: 'center',
                                            borderRight: '1px solid #eee'
                                        }}>{item.value}
                                        </div>
                                        <div style={{
                                            width: '33%',
                                            textAlign: 'center'
                                        }}>{item.value1}
                                        </div>
                                    </div>
                                )
                            })
                            }
                            {!active2&&waizi.map((item,index)=>{
                                return(
                                    <div key={index} style={{
                                        marginTop: '0.05rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        height: '0.4rem',
                                        alignItems: 'center',
                                        fontSize:'0.12rem',

                                        backgroundColor: '#f2f7ff',
                                        color: '#1d233b',
                                    }}>
                                        <div style={{
                                            width: '33%',
                                            textAlign: 'center',
                                            borderRight: '1px solid #eee'
                                        }}>{item.name}
                                        </div>
                                        <div style={{
                                            width: '33%',
                                            textAlign: 'center',
                                            borderRight: '1px solid #eee'
                                        }}>{item.value}
                                        </div>
                                        <div style={{
                                            width: '33%',
                                            textAlign: 'center'
                                        }}>{item.value1}
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </div>

                    </div>
                }
            </div>


        </div>
    );
}
