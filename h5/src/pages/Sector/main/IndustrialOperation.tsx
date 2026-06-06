import {Popup, PopupPosition} from "react-vant";
import {useState} from "react";

export default function IndustrialOperation() {
    const [state, setState] = useState<PopupPosition>('')
    const onClose = () => setState('')
    const [active, setActive] = useState(true)
    const [active1, setActive1] = useState(true)
    const gdpData = [
        {
            name: '线上工业',
            value: '0',
            value1: '0',
            value2: '0',
            value3: '0',
            value4: '0',
        },  {
            name: '线上批发业',
            value: '0',
            value1: '0',
            value2: '0',
            value4: '0',
            value3: '0',
        }, {
            name: '线上零售业',
            value: '0',
            value1: '0',
            value2: '0',
            value4: '0',
            value3: '0',
        },
    ]
    return (
        <div style={{
            width: "100%",
            fontSize: "0.14rem",
            padding: "0.2rem",
            boxSizing: "border-box",
        }}>
            <div style={{
                fontWeight: "bolder",
                marginBottom: "0.5rem",
            }}>
                整体情况
            </div>
            <div style={{
                fontWeight: "bolder",
                marginBottom: "0.2rem",
            }}>
                产业运行情况
            </div>

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <div style={{
                    fontWeight: "bolder",
                    fontSize: "0.12rem",
                }}>
                    GDP基础指标分析
                </div>
                <img style={{
                    width: "0.12rem",
                }} onClick={() => setState('bottom')} src="/img/sectorMain/date.png" alt=""/>
                <Popup
                    visible={state === 'bottom'}
                    style={{height: '30%'}}
                    position='bottom'
                    onClose={onClose}
                />
            </div>

            <div style={{
                fontSize: "0.12rem",
                marginTop: "0.2rem",
            }}>
                <div style={{
                    margin: '0 -0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#3e61f1',
                    color: '#fff'
                }}>
                    <div style={{
                        padding: '0.1rem',
                        width: '25%',
                        textAlign: 'center',
                        backgroundColor: '#3e61f1',
                        borderRight: '1px solid #fff',
                    }}>分类名称
                    </div>
                    <div style={{
                        padding: '0.1rem',
                        width: '15%',
                        textAlign: 'center',
                        borderRight: '1px solid #fff',
                        backgroundColor: '#3e61f1',
                    }}>样本单位（家）
                    </div>
                    <div style={{
                        width: '12.5%',
                        padding: '0.1rem',
                        textAlign: 'center',
                        borderRight: '1px solid #fff',
                        backgroundColor: '#3e61f1',
                    }}>营收
                    </div>
                    <div style={{
                        width: '12.5%',
                        padding: '0.1rem',
                        borderRight: '1px solid #fff',
                        textAlign: 'center',
                        backgroundColor: '#3e61f1',
                    }}>同比（%）
                    </div>
                    <div style={{
                        padding: '0.1rem',
                        width: '25%',
                        textAlign: 'center',
                        backgroundColor: '#3e61f1',
                    }}>占（比重（%）
                    </div>
                </div>
                {
                    gdpData.map((item, index) => {
                        return <div key={index} style={{
                            margin: '0 -0.2rem',

                            display: 'flex',
                            backgroundColor: '#f2f7ff',
                            color: '#fff'
                        }}>
                            <div style={{
                                width: '25%',
                                padding: '0.1rem',
                                boxSizing: 'border-box',
                                borderTopLeftRadius: '0.1rem',
                                borderBottomLeftRadius: '0.1rem',
                                textAlign: 'center',
                                color: '#666',
                                borderRight: '1px solid #fff',
                            }}>{item.name}
                            </div>
                            <div style={{
                                width: '15%',
                                textAlign: 'center',
                                borderRight: '1px solid #fff',
                                lineHeight: '0.4rem',
                                color: '#4b75ee',
                            }}>{item.value}
                            </div>
                            <div style={{
                                width: '12.5%',
                                textAlign: 'center',
                                borderRight: '1px solid #fff',
                                lineHeight: '0.4rem',
                                color: '#4b75ee',
                            }}>{item.value1}
                            </div>
                            <div style={{
                                width: '12.5%',
                                textAlign: 'center',
                                borderRight: '1px solid #fff',
                                lineHeight: '0.4rem',
                                color: '#4b75ee',
                            }}>{item.value2}

                            </div>
                            <div style={{
                                width: '12.5%',
                                textAlign: 'center',
                                borderRight: '1px solid #fff',
                                lineHeight: '0.4rem',
                                color: '#4b75ee',
                            }}>{item.value3}

                            </div>
                            <div style={{
                                borderRadius: '0.1rem',
                                width: '25%',
                                textAlign: 'center',
                                lineHeight: '0.4rem',
                                color: '#4b75ee',
                            }}>{item.value3}
                            </div>
                        </div>
                    })
                }
            </div>

            <div style={{
                fontWeight: "bolder",
            }}>
                重点企业产值（规上企业）
            </div>

            <div style={{
                marginTop: "0.2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
            <div style={{
                    fontWeight: "bolder",
                    fontSize: "0.12rem",
                }}>
                    更新时间：2025-04-11
                </div>
                <img style={{
                    width: "0.12rem",
                }} onClick={() => setState('bottom')} src="/img/sectorMain/date.png" alt=""/>
                <Popup
                    visible={state === 'bottom'}
                    style={{height: '30%'}}
                    position='bottom'
                    onClose={onClose}
                />
            </div>

            <div style={{
                marginTop: "0.2rem",
                display: "flex",
                justifyContent: "center",
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
                        setActive1(true)
                    }} style={{
                        width: '50%',
                        textAlign: 'center',
                        color: active ? '#264099' : '#333',
                        height: '0.24rem',
                        borderRadius: '0.12rem',
                        lineHeight: '0.24rem',
                        backgroundColor: active1 ? '#fff' : ''
                    }}>累计
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
                    }}>当月
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: "0.2rem",
                display: "flex",
                height: '0.4rem',
                backgroundColor: '#3e61f1',
                alignItems: "center",
                borderRadius: "0.05rem",
                color: '#fff',
            }}>
                <div style={{
                    width: "50%",
                    textAlign: "center",
                    borderRight: "1px solid #fff",
                }}>统计类型
                </div>
                <div style={{
                    width: "50%",
                    textAlign: "center",
                }}>统计数据
                </div>
            </div>
        </div>
    );
}
