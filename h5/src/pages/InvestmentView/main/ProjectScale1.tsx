import {useEffect, useState} from "react";
import {primeApi} from "../../../api.ts";

export default function ProjectScale1(e:{year:string}) {
    const {year} = e
    const [active2, setActive2] = useState(true)
    const [neizi,setNeizi] =  useState([[
        {name: '总计', key: 0, value: 89, value1: 614},
        {name: '10亿以上', key: 1, value: 21, value1: 402},
        {name: '5亿以上', key: 1, value: 32, value1: 167},
        {name: '1亿以上', key: 1, value: 36, value1: 45},
    ]])
    const [waizi,setWaizi] =  useState([
        {name: '总计', key: 0, value: 2, value1: 0.9},
        {name: '1亿美元及以上', key: 1, value: 0, value1: 0},
        {name: '3000万美元以上', key: 3, value: 2, value1: 0.9},
        {name: '1000万美元以上', key: 3, value: 0, value1: 0},
    ])

    const getZtxmGmTjxxViewsExcel = async () => {
        const data = await primeApi.getQyxmGmTjxxAreaViews({year:parseInt(year)})
        console.log('getZtxmGmTjxxViewsExcel',data)
        setNeizi([
            {name: '总计', key: 0, value: data.nzzsl, value1: data.nzzje},
            {name: '10亿以上', key: 1, value: data.nzsl4, value1: data.nzje4},
            {name: '5亿以上', key: 2, value: data.nzsl3, value1: data.nzje3},
            {name: '1亿以上', key: 3, value: data.nzsl2, value1: data.nzje2},
        ])
        setWaizi([
            {name: '总计', key: 0, value: data.wzzsl, value1: data.wzzje},
            {name: '1亿美元及以上', key: 1, value: data.wzsl4, value1: data.wzje4},
            {name: '3000万美元以上', key: 2, value: data.wzsl3, value1: data.wzje3},
            {name: '1000万美元以上', key: 3, value: data.wzsl2, value1: data.wzje2},
        ])
    }
    useEffect(() => {
        getZtxmGmTjxxViewsExcel()
    }, [year]);
    return (
        <div>
            <div style={{
                // marginTop: '0.2rem',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div style={{
                        fontSize: '0.16rem',
                        fontWeight: 'bold',
                    }}>项目规模</div>
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
                        }}>投资总额
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
                        }}><div>
                            投资总额小计
                        </div>
                            <div>
                                {active2?'（亿元）':'（亿美元）'}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {active2 && neizi.map((item, index) => {
                        return (
                            <div key={index} style={{
                                marginTop: '0.05rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                height: '0.4rem',
                                alignItems: 'center',
                                fontSize: '0.12rem',

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
                    {!active2 && waizi.map((item, index) => {
                        return (
                            <div key={index} style={{
                                marginTop: '0.05rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                height: '0.4rem',
                                alignItems: 'center',
                                fontSize: '0.12rem',

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
        </div>
    )
}
