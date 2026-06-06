import TopBar1 from "../../components/TopBar/TopBar1.tsx";
import {useEffect, useRef, useState} from "react";
import { Popup, Search, Tabs} from "react-vant";
import { Arrow } from '@react-vant/icons';
import { useNavigate } from "react-router-dom";
import * as echarts from "echarts";
import ProjectScale from "./main/ProjectScale.tsx";
import GlobalProject from "./main/GlobalProject.tsx";
import ParkSituation from "./main/ParkSituation.tsx";
import ProjectNeed from "./main/ProjectNeed.tsx";
import ProcessProcess from "./main/ProjectProcess.tsx";
import ProjectScale1 from "./main/ProjectScale1.tsx";
import GlobalProject1 from "./main/GlobalProject1.tsx";
import ParkSituation1 from "./main/ParkSituation1.tsx";
import { primeApi } from "../../api.ts";
import type { QyxmCyflTjxxVo } from "../../apis/models/QyxmCyflTjxxVo";

type StatGridItem = { name: string; value: string };
type IndustrySummary = {
    name: string;
    total: number;
    percent: number;
    amount: number;
    color: string;
};

/** 环形图图例行：接口字段 + 展示用颜色 */
type QyxmRingRow = QyxmCyflTjxxVo & { color: string };

function MultiRingChart({ list }: { list: QyxmCyflTjxxVo[] }) {
    let sum = 0;
    list.forEach((item) => {
        sum += item.xmsl ?? 0;
    });
    console.log('MultiRingChart',list)
    const chartRef = useRef(null);
    const data1: QyxmRingRow[] = [{
        ...list[0],
        color:'#165dff'
    },{
        ...list[1],
        color:'#5dc6c7'
    },]
    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        const option = {
            series: [
                // 外层圆环
                {
                    type: 'pie',
                    radius: ['65%', '70%'], // 内半径50%，外半径70%
                    label: { show: false },
                    data: [
                        { value: data1[0]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[0]!.color } },
                        { value: sum - (data1[0]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },
                // 中层圆环
                {
                    type: 'pie',
                    radius: ['60%', '65%'],
                    label: { show: false },
                    data: [
                        { value: data1[1]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[1]!.color } },
                        { value: sum - (data1[1]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },

            ]
        };
        chart.setOption(option);
        return () => chart.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- 环形图仅在挂载时绘制
    }, []);

    return <div style={{width: '100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div ref={chartRef} style={{width: '220px', height: '200px'}}/>
        <div style={{width:'100%',marginTop:'0.1rem'}}>
            {data1.map((item,index)=>{
                return <div style={{
                    marginBottom:'0.1rem'
                }} key={index}>
                    <div style={{
                        display:'flex',
                        alignItems:'center',
                        marginBottom:'0.05rem',
                        fontSize:'0.14rem'
                    }}>
                        <div style={{
                            height:'0.15rem',
                            width:'0.15rem',
                            borderRadius:'50%',
                            backgroundColor:item.color,
                            marginRight:'0.1rem',
                        }}></div>
                        <div style={{
                            display:'flex',
                            alignItems:'center',
                        }}><div>{item.cymc}</div><Arrow /></div>
                    </div>
                    <div style={{
                        // marginLeft: '0.20rem',
                        width: '100%',
                        fontSize: '0.12rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目数量</div>
                            <div>{item.xmsl}个</div>
                        </div>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目金额</div>
                             <div>{item.xmje}亿元</div>
                        </div>
                        <div style={{
                            width: '30%',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                width: '100%',
                                padding: '0.05rem 0',
                                boxSizing: 'border-box',
                                textAlign: 'center',
                                alignItems: 'center',
                                backgroundColor: '#f0f3fe',
                                borderRadius: '0.05rem',
                            }}>
                                <div>占比</div>
                                <div>{item.slzb}%</div>
                            </div>
                            {/*<div style={{*/}
                            {/*    marginLeft: '-0.09rem',*/}
                            {/*    width: '0.16rem',*/}
                            {/*    height: '0.16rem',*/}
                            {/*    display: 'flex',*/}
                            {/*    alignItems: 'center',*/}
                            {/*    justifyContent: 'center',*/}
                            {/*    backgroundColor:'#526dff',*/}
                            {/*    borderRadius: '50%',*/}
                            {/*}}>*/}
                            {/*    <Arrow color={'#fff'} />*/}
                            {/*</div>*/}
                        </div>

                    </div>
                </div>
            })}
        </div>
    </div>;
}

function MultiRingChart11({ list }: { list: QyxmCyflTjxxVo[] }) {
    let sum = 0;
    list.forEach((item) => {
        sum += item.xmsl ?? 0;
    });
    console.log('MultiRingChart',list)
    const chartRef = useRef(null);
    const data1: QyxmRingRow[] = [{
        ...list[0],
        color:'#165dff'
    },{
        ...list[1],
        color:'#5dc6c7'
    },]
    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        const option = {
            series: [
                // 外层圆环
                {
                    type: 'pie',
                    radius: ['65%', '70%'], // 内半径50%，外半径70%
                    label: { show: false },
                    data: [
                        { value: data1[0]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[0]!.color } },
                        { value: sum - (data1[0]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },
                // 中层圆环
                {
                    type: 'pie',
                    radius: ['60%', '65%'],
                    label: { show: false },
                    data: [
                        { value: data1[1]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[1]!.color } },
                        { value: sum - (data1[1]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },

            ]
        };
        chart.setOption(option);
        return () => chart.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- 环形图仅在挂载时绘制
    }, []);

    return <div style={{width: '100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div ref={chartRef} style={{width: '220px', height: '200px'}}/>
        <div style={{width:'100%',marginTop:'0.1rem'}}>
            {data1.map((item,index)=>{
                return <div style={{
                    marginBottom:'0.1rem'
                }} key={index}>
                    <div style={{
                        display:'flex',
                        alignItems:'center',
                        marginBottom:'0.05rem',
                        fontSize:'0.14rem'
                    }}>
                        <div style={{
                            height:'0.15rem',
                            width:'0.15rem',
                            borderRadius:'50%',
                            backgroundColor:item.color,
                            marginRight:'0.1rem',
                        }}></div>
                        <div style={{
                            display:'flex',
                            alignItems:'center',
                        }}><div>{item.cymc}</div><Arrow /></div>
                    </div>
                    <div style={{
                        // marginLeft: '0.20rem',
                        width: '100%',
                        fontSize: '0.12rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目数量</div>
                            <div>{item.xmsl}个</div>
                        </div>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目金额</div>
                            <div>{item.xmje}亿元</div>
                        </div>
                        <div style={{
                            width: '30%',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                width: '100%',
                                padding: '0.05rem 0',
                                boxSizing: 'border-box',
                                textAlign: 'center',
                                alignItems: 'center',
                                backgroundColor: '#f0f3fe',
                                borderRadius: '0.05rem',
                            }}>
                                <div>占比</div>
                                <div>{item.slzb}%</div>
                            </div>
                            {/*<div style={{*/}
                            {/*    marginLeft: '-0.09rem',*/}
                            {/*    width: '0.16rem',*/}
                            {/*    height: '0.16rem',*/}
                            {/*    display: 'flex',*/}
                            {/*    alignItems: 'center',*/}
                            {/*    justifyContent: 'center',*/}
                            {/*    backgroundColor:'#526dff',*/}
                            {/*    borderRadius: '50%',*/}
                            {/*}}>*/}
                            {/*    <Arrow color={'#fff'} />*/}
                            {/*</div>*/}
                        </div>

                    </div>
                </div>
            })}
        </div>
    </div>;
}

function MultiRingChart2({ list }: { list: QyxmCyflTjxxVo[] }) {
    let sum = 0;
    list.forEach((item) => {
        sum += item.xmsl ?? 0;
    });
    const chartRef = useRef(null);
    const data1: QyxmRingRow[] = [{
        ...list[0],
        color:'#165dff'
    },{
        ...list[1],
        color:'#5dc6c7'
    }]
    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        const option = {
            series: [
                // 外层圆环
                {
                    type: 'pie',
                    radius: ['65%', '70%'], // 内半径50%，外半径70%
                    label: { show: false },
                    data: [
                        { value: data1[0]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[0]!.color } },
                        { value: sum - (data1[0]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },
                // 中层圆环
                {
                    type: 'pie',
                    radius: ['60%', '65%'],
                    label: { show: false },
                    data: [
                        { value: data1[1]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[1]!.color } },
                        { value: sum - (data1[1]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                }
            ]
        };
        chart.setOption(option);
        return () => chart.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- 环形图仅在挂载时绘制
    }, []);

    return <div style={{width: '100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div ref={chartRef} style={{width: '220px', height: '200px'}}/>
        <div style={{width:'100%',marginTop:'0.1rem'}}>
            {data1.map((item,index)=>{
                return <div style={{
                    marginBottom:'0.1rem'
                }} key={index}>
                    <div style={{
                        display:'flex',
                        alignItems:'center',
                        marginBottom:'0.05rem',
                        fontSize:'0.14rem'
                    }}>
                        <div style={{
                            height:'0.15rem',
                            width:'0.15rem',
                            borderRadius:'50%',
                            backgroundColor:item.color,
                            marginRight:'0.1rem',
                        }}></div>
                        <div style={{
                            display:'flex',
                            alignItems:'center',
                        }}><div>{item.cymc}</div><Arrow /></div>
                    </div>
                    <div style={{
                        // marginLeft: '0.20rem',
                        width: '100%',
                        fontSize: '0.12rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目数量</div>
                            <div>{item.xmsl}个</div>
                        </div>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目金额</div>
                             <div>{item.xmje}亿元</div>
                        </div>
                        <div style={{
                            width: '30%',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                width: '100%',
                                padding: '0.05rem 0',
                                boxSizing: 'border-box',
                                textAlign: 'center',
                                alignItems: 'center',
                                backgroundColor: '#f0f3fe',
                                borderRadius: '0.05rem',
                            }}>
                                <div>占比</div>
                                <div>{item.slzb}%</div>
                            </div>
                            {/*<div style={{*/}
                            {/*    marginLeft: '-0.09rem',*/}
                            {/*    width: '0.16rem',*/}
                            {/*    height: '0.16rem',*/}
                            {/*    display: 'flex',*/}
                            {/*    alignItems: 'center',*/}
                            {/*    justifyContent: 'center',*/}
                            {/*    backgroundColor:'#526dff',*/}
                            {/*    borderRadius: '50%',*/}
                            {/*}}>*/}
                            {/*    <Arrow color={'#fff'} />*/}
                            {/*</div>*/}
                        </div>

                    </div>
                </div>
            })}
        </div>
    </div>;
}
function MultiRingChart3({ list }: { list: QyxmCyflTjxxVo[] }) {
    let sum = 0;
    list.forEach((item) => {
        sum += item.xmsl ?? 0;
    });
    const chartRef = useRef(null);
    const data1: QyxmRingRow[] = [{
        ...list[0],
        color:'#165dff'
    }
    ,{
            ...list[1],
            color:'#5dc6c7'
    },{
            ...list[2],
            color:'#cac6c7'
    }
    ,{
            ...list[3],
            color:'#adc6c7'
    }
    ,{
            ...list[4],
        color:'#bdc6c7'
    }
    ,{
            ...list[5],
            color:'#ddc6c7'
    },{
            ...list[6],
            color:'#5dc6c7'
    }
    ]
    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        const option = {
            series: [
                // 外层圆环
                {
                    type: 'pie',
                    radius: ['65%', '70%'], // 内半径50%，外半径70%
                    label: { show: false },
                    data: [
                        { value: data1[0]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[0]!.color } },
                        { value: sum - (data1[0]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },
                // 中层圆环
                {
                    type: 'pie',
                    radius: ['60%', '65%'],
                    label: { show: false },
                    data: [
                        { value: data1[1]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[1]!.color } },
                        { value: sum - (data1[1]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },{
                    type: 'pie',
                    radius: ['55%', '60%'],
                    label: { show: false },
                    data: [
                        { value: data1[2]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[2]!.color } },
                        { value: sum - (data1[2]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },{
                    type: 'pie',
                    radius: ['50%', '55%'],
                    label: { show: false },
                    data: [
                        { value: data1[3]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[3]!.color } },
                        { value: sum - (data1[3]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },{
                    type: 'pie',
                    radius: ['45%', '50%'],
                    label: { show: false },
                    data: [
                        { value: data1[4]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[4]!.color } },
                        { value: sum - (data1[4]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },{
                    type: 'pie',
                    radius: ['40%', '45%'],
                    label: { show: false },
                    data: [
                        { value: data1[5]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[5]!.color } },
                        { value: sum - (data1[5]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },{
                    type: 'pie',
                    radius: ['35%', '40%'],
                    label: { show: false },
                    data: [
                        { value: data1[6]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[6]!.color } },
                        { value: sum - (data1[6]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                }
            ]
        };
        chart.setOption(option);
        return () => chart.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- 环形图仅在挂载时绘制
    }, []);

    return <div style={{width: '100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div ref={chartRef} style={{width: '220px', height: '200px'}}/>
        <div style={{width:'100%',marginTop:'0.1rem'}}>
            {data1.map((item,index)=>{
                return <div style={{
                    marginBottom:'0.1rem'
                }} key={index}>
                    <div style={{
                        display:'flex',
                        alignItems:'center',
                        marginBottom:'0.05rem',
                        fontSize:'0.14rem'
                    }}>
                        <div style={{
                            height:'0.15rem',
                            width:'0.15rem',
                            borderRadius:'50%',
                            backgroundColor:item.color,
                            marginRight:'0.1rem',
                        }}></div>
                        <div style={{
                            display:'flex',
                            alignItems:'center',
                        }}><div>{item.cymc}</div><Arrow /></div>
                    </div>
                    <div style={{
                        // marginLeft: '0.20rem',
                        width: '100%',
                        fontSize: '0.12rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目数量</div>
                            <div>{item.xmsl}个</div>
                        </div>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目金额</div>
                             <div>{item.xmje}亿元</div>
                        </div>
                        <div style={{
                            width: '30%',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                width: '100%',
                                padding: '0.05rem 0',
                                boxSizing: 'border-box',
                                textAlign: 'center',
                                alignItems: 'center',
                                backgroundColor: '#f0f3fe',
                                borderRadius: '0.05rem',
                            }}>
                                <div>占比</div>
                                <div>{item.slzb}%</div>
                            </div>
                            {/*<div style={{*/}
                            {/*    marginLeft: '-0.09rem',*/}
                            {/*    width: '0.16rem',*/}
                            {/*    height: '0.16rem',*/}
                            {/*    display: 'flex',*/}
                            {/*    alignItems: 'center',*/}
                            {/*    justifyContent: 'center',*/}
                            {/*    backgroundColor:'#526dff',*/}
                            {/*    borderRadius: '50%',*/}
                            {/*}}>*/}
                            {/*    <Arrow color={'#fff'} />*/}
                            {/*</div>*/}
                        </div>

                    </div>
                </div>
            })}
        </div>
    </div>;
}
function MultiRingChart33({ list }: { list: QyxmCyflTjxxVo[] }) {
    let sum = 0;
    list.forEach((item) => {
        sum += item.xmsl ?? 0;
    });
    const chartRef = useRef(null);
    const data1: QyxmRingRow[] = [{
        ...list[0],
        color:'#165dff'
    }
    ,{
            ...list[1],
            color:'#5dc6c7'
    },{
            ...list[2],
            color:'#cac6c7'
    }

    ]
    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        const option = {
            series: [
                // 外层圆环
                {
                    type: 'pie',
                    radius: ['65%', '70%'], // 内半径50%，外半径70%
                    label: { show: false },
                    data: [
                        { value: data1[0]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[0]!.color } },
                        { value: sum - (data1[0]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },
                // 中层圆环
                {
                    type: 'pie',
                    radius: ['60%', '65%'],
                    label: { show: false },
                    data: [
                        { value: data1[1]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[1]!.color } },
                        { value: sum - (data1[1]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },{
                    type: 'pie',
                    radius: ['55%', '60%'],
                    label: { show: false },
                    data: [
                        { value: data1[2]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[2]!.color } },
                        { value: sum - (data1[2]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                }
            ]
        };
        chart.setOption(option);
        return () => chart.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- 环形图仅在挂载时绘制
    }, []);

    return <div style={{width: '100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div ref={chartRef} style={{width: '220px', height: '200px'}}/>
        <div style={{width:'100%',marginTop:'0.1rem'}}>
            {data1.map((item,index)=>{
                return <div style={{
                    marginBottom:'0.1rem'
                }} key={index}>
                    <div style={{
                        display:'flex',
                        alignItems:'center',
                        marginBottom:'0.05rem',
                        fontSize:'0.14rem'
                    }}>
                        <div style={{
                            height:'0.15rem',
                            width:'0.15rem',
                            borderRadius:'50%',
                            backgroundColor:item.color,
                            marginRight:'0.1rem',
                        }}></div>
                        <div style={{
                            display:'flex',
                            alignItems:'center',
                        }}><div>{item.cymc}</div><Arrow /></div>
                    </div>
                    <div style={{
                        // marginLeft: '0.20rem',
                        width: '100%',
                        fontSize: '0.12rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目数量</div>
                            <div>{item.xmsl}个</div>
                        </div>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目金额</div>
                             <div>{item.xmje}亿元</div>
                        </div>
                        <div style={{
                            width: '30%',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                width: '100%',
                                padding: '0.05rem 0',
                                boxSizing: 'border-box',
                                textAlign: 'center',
                                alignItems: 'center',
                                backgroundColor: '#f0f3fe',
                                borderRadius: '0.05rem',
                            }}>
                                <div>占比</div>
                                <div>{item.slzb}%</div>
                            </div>
                            {/*<div style={{*/}
                            {/*    marginLeft: '-0.09rem',*/}
                            {/*    width: '0.16rem',*/}
                            {/*    height: '0.16rem',*/}
                            {/*    display: 'flex',*/}
                            {/*    alignItems: 'center',*/}
                            {/*    justifyContent: 'center',*/}
                            {/*    backgroundColor:'#526dff',*/}
                            {/*    borderRadius: '50%',*/}
                            {/*}}>*/}
                            {/*    <Arrow color={'#fff'} />*/}
                            {/*</div>*/}
                        </div>

                    </div>
                </div>
            })}
        </div>
    </div>;
}
function MultiRingChart4({ list }: { list: QyxmCyflTjxxVo[] }) {
    let sum = 0;
    list.forEach((item) => {
        sum += item.xmsl ?? 0;
    });
    const chartRef = useRef(null);
    const data1: QyxmRingRow[] = [{
        ...list[0],
        color:'#165dff'
    }
        ,{
            ...list[1],

            color:'#5dc6c7'
        },{
            ...list[2],

            color:'#cac6c7'
        }
        ,{
            ...list[3],

            color:'#adc6c7'
        }
        ,{
            ...list[4],

            color:'#bdc6c7'
        }
        ,{
            ...list[5],

            color:'#ddc6c7'
        },{
            ...list[6],

            color:'#5dc6c7'
        }
    ]
    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        const option = {
            series: [
                // 外层圆环
                {
                    type: 'pie',
                    radius: ['65%', '70%'], // 内半径50%，外半径70%
                    label: { show: false },
                    data: [
                        { value: data1[0]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[0]!.color } },
                        { value: sum - (data1[0]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },
                // 中层圆环
                {
                    type: 'pie',
                    radius: ['60%', '65%'],
                    label: { show: false },
                    data: [
                        { value: data1[1]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[1]!.color } },
                        { value: sum - (data1[1]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },{
                    type: 'pie',
                    radius: ['55%', '60%'],
                    label: { show: false },
                    data: [
                        { value: data1[2]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[2]!.color } },
                        { value: sum - (data1[2]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },{
                    type: 'pie',
                    radius: ['50%', '55%'],
                    label: { show: false },
                    data: [
                        { value: data1[3]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[3]!.color } },
                        { value: sum - (data1[3]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },{
                    type: 'pie',
                    radius: ['45%', '50%'],
                    label: { show: false },
                    data: [
                        { value: data1[4]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[4]!.color } },
                        { value: sum - (data1[4]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },{
                    type: 'pie',
                    radius: ['40%', '45%'],
                    label: { show: false },
                    data: [
                        { value: data1[5]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[5]!.color } },
                        { value: sum - (data1[5]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },{
                    type: 'pie',
                    radius: ['35%', '40%'],
                    label: { show: false },
                    data: [
                        { value: data1[6]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[6]!.color } },
                        { value: sum - (data1[6]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                }
            ]
        };
        chart.setOption(option);
        return () => chart.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- 环形图仅在挂载时绘制
    }, []);

    return <div style={{width: '100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div ref={chartRef} style={{width: '220px', height: '200px'}}/>
        <div style={{width:'100%',marginTop:'0.1rem'}}>
            {data1.map((item,index)=>{
                return <div style={{
                    marginBottom: '0.1rem'
                }} key={index}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.05rem',
                        fontSize: '0.14rem'
                    }}>
                        <div style={{
                            height: '0.15rem',
                            width: '0.15rem',
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            marginRight: '0.1rem',
                        }}></div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <div>{item.cymc}</div>
                            <Arrow/></div>
                    </div>
                    <div style={{
                        // marginLeft: '0.20rem',
                        width: '100%',
                        fontSize: '0.12rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目数量
                            </div>
                            <div>{item.xmsl}个</div>
                        </div>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目金额
                            </div>
                             <div>{item.xmje}亿元</div>
                        </div>
                        <div style={{
                            width: '30%',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                width: '100%',
                                padding: '0.05rem 0',
                                boxSizing: 'border-box',
                                textAlign: 'center',
                                alignItems: 'center',
                                backgroundColor: '#f0f3fe',
                                borderRadius: '0.05rem',
                            }}>
                                <div>占比</div>
                                <div>{item.slzb}%</div>
                            </div>
                            {/*<div style={{*/}
                            {/*    marginLeft: '-0.09rem',*/}
                            {/*    width: '0.16rem',*/}
                            {/*    height: '0.16rem',*/}
                            {/*    display: 'flex',*/}
                            {/*    alignItems: 'center',*/}
                            {/*    justifyContent: 'center',*/}
                            {/*    backgroundColor: '#526dff',*/}
                            {/*    borderRadius: '50%',*/}
                            {/*}}>*/}
                            {/*    <Arrow color={'#fff'}/>*/}
                            {/*</div>*/}
                        </div>

                    </div>
                </div>
            })}
        </div>
    </div>;
}
function MultiRingChart5({ list }: { list: QyxmCyflTjxxVo[] }) {
    let sum = 0;
    list.forEach((item) => {
        sum += item.xmsl ?? 0;
    });
    const chartRef = useRef(null);
    const data1: QyxmRingRow[] = [{
        ...list[0],
        color:'#165dff'}
    ]
    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        const option = {
            series: [
                // 外层圆环
                {
                    type: 'pie',
                    radius: ['65%', '70%'], // 内半径50%，外半径70%
                    label: { show: false },
                    data: [
                        { value: data1[0]!.xmsl ?? 0, name: '外层进度', itemStyle: { color: data1[0]!.color } },
                        { value: sum - (data1[0]!.xmsl ?? 0), name: '剩余', itemStyle: { color: '#EEE' } }
                    ]
                },
            ]
        };
        chart.setOption(option);
        return () => chart.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- 环形图仅在挂载时绘制
    }, []);

    return <div style={{width: '100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div ref={chartRef} style={{width: '220px', height: '200px'}}/>
        <div style={{width:'100%',marginTop:'0.1rem'}}>
            {data1.map((item,index)=>{
                return <div style={{
                    marginBottom: '0.1rem'
                }} key={index}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.05rem',
                        fontSize: '0.14rem'
                    }}>
                        <div style={{
                            height: '0.15rem',
                            width: '0.15rem',
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            marginRight: '0.1rem',
                        }}></div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <div>{item.cymc}</div>
                            <Arrow/></div>
                    </div>
                    <div style={{
                        width: '100%',
                        fontSize: '0.12rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目数量
                            </div>
                            <div>{item.xmsl}个</div>
                        </div>
                        <div style={{
                            width: '30%',
                            color: '#666',
                        }}>
                            <div style={{
                                marginBottom: '0.05rem',
                            }}>项目金额
                            </div>
                            <div>{item.xmje}亿元</div>
                        </div>
                        <div style={{
                            width: '30%',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                width: '100%',
                                padding: '0.05rem 0',
                                boxSizing: 'border-box',
                                textAlign: 'center',
                                alignItems: 'center',
                                backgroundColor: '#f0f3fe',
                                borderRadius: '0.05rem',
                            }}>
                                <div>占比</div>
                                <div>{item.slzb}%</div>
                            </div>
                            {/*<div style={{*/}
                            {/*    marginLeft: '-0.09rem',*/}
                            {/*    width: '0.16rem',*/}
                            {/*    height: '0.16rem',*/}
                            {/*    display: 'flex',*/}
                            {/*    alignItems: 'center',*/}
                            {/*    justifyContent: 'center',*/}
                            {/*    backgroundColor: '#526dff',*/}
                            {/*    borderRadius: '50%',*/}
                            {/*}}>*/}
                            {/*    <Arrow color={'#fff'}/>*/}
                            {/*</div>*/}
                        </div>

                    </div>
                </div>
            })}
        </div>
    </div>;
}


export default function InvestmentView() {
    const [year, setYear] = useState('2026')
    const [value, setValue] = useState('');
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()
    const [popTitle, setPopTitle] = useState('')
    const [list, setList] = useState<StatGridItem[]>([])
    const [list2, setList2] = useState<StatGridItem[]>([])
    const tabList = [
        // {
        //     name:"产业分类",
        //     key:0
        // },
        {
            name: "项目规模",
            key: 1
        }, {
            name: "项目趋势变化",
            key: 2
        }, {
            name: "板块情况",
            key: 3
        },
        // {
        //     name: "项目需求",
        //     key: 4
        // },
    ]
    const tabList2 = [
        {
            name: "产业分类",
            key: 0
        }, {
            name: "项目规模",
            key: 1
        }, {
            name: "项目趋势变化",
            key: 2
        }, {
            name: "板块情况",
            key: 3
        }, {
            name: "进展情况",
            key: 4
        },
        // {
        //     name: "项目需求",
        //     key: 5
        // },
    ]
    const [activeColor, setActiveColor] = useState(0)
    const [activeColor1, setActiveColor1] = useState(0)
    // const tab1List1= [
    //     {
    //         name:'大健康',
    //         percent:'0',
    //         total:'0',
    //         amount:'0',
    //         color:'#376ce7'
    //     },{
    //         name:'海工装备和高技术船舶',
    //         percent:'0',
    //         total:'0',
    //         amount:'0',
    //         color:'#14c9c9'
    //     },{
    //         name:'新兴产业',
    //         percent:'0',
    //         total:'0',
    //         amount:'0',
    //         color:'#f7ba1e'
    //     },{
    //         name:'晨光力量（未来产业）',
    //         percent:'0',
    //         total:'0',
    //         amount:'0',
    //         color:'#a1ba1e'
    //     }
    // ]
    const [t1, setT1] = useState<QyxmCyflTjxxVo[]>([])
    const [t11, setT11] = useState<QyxmCyflTjxxVo[]>([])
    const [t2, setT2] = useState<QyxmCyflTjxxVo[]>([])
    const [t3, setT3] = useState<QyxmCyflTjxxVo[]>([])
    const [t33, setT33] = useState<QyxmCyflTjxxVo[]>([])
    const [t4, setT4] = useState<QyxmCyflTjxxVo[]>([])
    const [t5, setT5] = useState<QyxmCyflTjxxVo[]>([])
    const [tab1List, setTab1List] = useState<IndustrySummary[]>([])
    // const chartDom = document.getElementById('ring-chart');
    const fetchData = async () => {
        const data = await primeApi.getZtxmTjxxAreaViews({year: Number(year)})
        console.log('getZtxmTjxxAreaViews',data)
        const list = [
            {
                name: "总数",
                value: data.xmzsl ? data.xmzsl.toString() : '0',
            }, {
                name: "总投资额（亿元）",
                value: data.xmzje ? data.xmzje.toString() : '0',
            }, {
                name: "内资项目数",
                value: data.nzsl ? data.nzsl.toString() : '0',
            }, {
                name: "内资金额（亿元）",
                value: data.nzje ? data.nzje.toString() : '0',
            }, {
                name: "外资项目数",
                value: data.wzsl ? data.wzsl.toString() : '0',
            }, {
                name: "外资金额（亿美元）",
                value: data.wzje ? data.wzje.toString() : '0',
            }, {
                name: "本月在谈转签约项目",
                value: data.byzqysl ? data.byzqysl.toString():'0',
            }, {
                name:"本月新增项目数",
                value:data.byxzsl?data.byxzsl.toString():'0',
            }, {
                name:"本月新增投资额（亿元）",
                value:data.byxzsl?data.byxzsl.toString():'0',
            }
        ]
        setList(list)
    }
    const fetchData1 = async () => {
        const data = await primeApi.getQyxmTjxxAreaViews({year:(Number(year))})
        const list = [
            {
                name:"总数",
                value:data.xmzsl?data.xmzsl.toString():'0',
            }, {
                name:"总投资额（亿元）",
                value:data.xmzje?data.xmzje.toString():'0',
            }, {
                name:"内资项目数",
                value:data.nzsl?data.nzsl.toString():'0',
            }, {
                name:"内资金额（亿元）",
                value:data.nzje?data.nzje.toString():'0',
            }, {
                name:"外资项目数",
                value:data.wzsl?data.wzsl.toString():'0',
            }, {
                name:"外资金额（亿美元）",
                value:data.wzje?data.wzje.toString():'0',
            },  {
                name:"本月新增项目数",
                value:data.byxzsl?data.byxzsl.toString():'0',
            }, {
                name:"本月新增投资额（亿元）",
                value:data.byxzje?data.byxzje.toString():'0',

            }
        ]
        setList2(list)
    }

    useEffect( () => {
        fetchData()
        fetchData1()
        // getQyxmCyflTjxxViews()
        primeApi.getQyxmCyflTjxxViews({year:Number(year)}).then(res=>{
            console.log(res)
            const data1 =  res.filter((item)=>{
                return item.cybm?.split('.')[0]==='1'&&item.cybm?.split('.')[1]==='1'&&item.cybm?.split('.')[2]==='1'
            })
            const data11 =  res.filter((item)=>{
                return item.cybm?.split('.')[0]==='1'&&item.cybm?.split('.')[1]==='1'&&item.cybm?.split('.')[2]==='2'
            })
            const dajiankang = {
                name:'生物医药',
                total: 0,
                percent:0,
                amount:0,
                color:'#376ce7'
            }
            const dajiankang2 = {
                name:'健康食品',
                total: 0,
                percent:0,
                amount:0,
                color:'#3c9879'
            }
            for (let i = 0; i < data1.length; i++){
                const row = data1[i];
                dajiankang.total += Number(row?.xmsl)
                dajiankang.percent += Number(row?.slzb)
                dajiankang.amount += Number(row?.xmje)
            }
            for (let i = 0; i < data1.length; i++){
                if (data11[i]) { // 安全检查
                    dajiankang2.total += Number(data11[i].xmsl) || 0;
                    dajiankang2.percent += Number(data11[i].slzb) || 0;
                    dajiankang2.amount += Number(data11[i].xmje) || 0;
                }
            }
            setT1(data1)
            setT11(data11)

            const data2 =  res.filter((item)=>{
                return item.cybm?.split('.')[0]==='1'&&item.cybm?.split('.')[1]==='2'
            })
            const hgzbz = {
                name:'海工装备和高技术船舶',
                total: 0,
                percent:0,
                amount:0,
                color:'#fec252'
            }
            for (let i = 0; i < data2.length; i++){
                const row = data2[i];
                hgzbz.total += row?.xmsl ?? 0
                hgzbz.percent += row?.slzb ?? 0
                hgzbz.amount += row?.xmje ?? 0
            }
            setT2(data2)

            const data3 =  res.filter((item)=>{
                return item.cybm?.split('.')[0]==='1'&&item.cybm?.split('.')[1]==='3'&&item.cybm?.split('.')[2]==='1'
            })
            const xxcy = {
                name:'汽车及零部件',
                total: 0,
                percent:0,
                amount:0,
                color:'#fa7850'
            }
            for (let i = 0; i < data3.length; i++){
                const row = data3[i];
                xxcy.total += row?.xmsl ?? 0
                xxcy.percent += row?.slzb ?? 0
                xxcy.amount += row?.xmje ?? 0
            }
            setT3(data3)
            const data33 =  res.filter((item)=>{
                return item.cybm?.split('.')[0]==='1'&&item.cybm?.split('.')[1]==='3'&&item.cybm?.split('.')[2]==='2'
            })
            const xxcy1 = {
                name:'新一代信息技术和智能装备产业集群',
                total: 0,
                percent:0,
                amount:0,
                color:'#5b8efc'
            }
            for (let i = 0; i < data33.length; i++){
                const row = data33[i];
                xxcy1.total += row?.xmsl ?? 0
                xxcy1.percent += row?.slzb ?? 0
                xxcy1.amount += row?.xmje ?? 0
            }
            setT33(data33)

            const data333 =  res.filter((item)=>{
                return item.cybm?.split('.')[0]==='1'&&item.cybm?.split('.')[1]==='3'&&item.cybm?.split('.')[2]==='3'
            })
            const xxcy3= {
                name:'化工及新材料产业集群',
                total: 0,
                percent:0,
                amount:0,
                color:'#16b675'
            }
            for (let i = 0; i < data333.length; i++){
                const row = data333[i];
                xxcy3.total += row?.xmsl ?? 0
                xxcy3.percent += row?.slzb ?? 0
                xxcy3.amount += row?.xmje ?? 0
            }

            const data3333 =  res.filter((item)=>{
                return item.cybm?.split('.')[0]==='1'&&item.cybm?.split('.')[1]==='3'&&item.cybm?.split('.')[2]==='4'
            })
            const xxcy4= {
                name:'金属新材料及制品',
                total: 0,
                percent:0,
                amount:0,
                color:'#fe9d32'
            }
            for (let i = 0; i < data3333.length; i++){
                const row = data3333[i];
                xxcy4.total += row?.xmsl ?? 0
                xxcy4.percent += row?.slzb ?? 0
                xxcy4.amount += row?.xmje ?? 0
            }

            const data35 =  res.filter((item)=>{
                return item.cybm?.split('.')[0]==='1'&&item.cybm?.split('.')[1]==='3'&&item.cybm?.split('.')[2]==='5'
            })
            const xxcy5= {
                name:'新能源',
                total: 0,
                percent:0,
                amount:0,
                color:'#fb8660'
            }
            for (let i = 0; i < data35.length; i++){
                const row = data35[i];
                xxcy5.total += row?.xmsl ?? 0
                xxcy5.percent += row?.slzb ?? 0
                xxcy5.amount += row?.xmje ?? 0
            }

            const data4 =  res.filter((item)=>{
                return item.cybm?.split('.')[0]==='1'&&item.cybm?.split('.')[1]==='4'
            })
            const chenguang = {
                name:'未来产业',
                total: 0,
                percent:0,
                amount:0,
                color:'#6ca3fd'
            }
            for (let i = 0; i < data4.length; i++){
                const row = data4[i];
                chenguang.total += row?.xmsl ?? 0
                chenguang.percent += row?.slzb ?? 0
                chenguang.amount += row?.xmje ?? 0
            }
            setT4(data4)

            const data5 =  res.filter((item)=>{
                return item.cybm?.split('.')[0]==='2'
            })
            const chuantongchanye = {
                name:'传统产业',
                total: 0,
                percent:0,
                amount:0,
                color:'#11ba1e'
            }
            for (let i = 0; i < data5.length; i++){
                const row = data5[i];
                chuantongchanye.total += row?.xmsl ?? 0
                chuantongchanye.percent += row?.slzb ?? 0
                chuantongchanye.amount += row?.xmje ?? 0
            }
            setT5(data5)
            console.log('data5',data5)
            setTab1List([
                dajiankang,dajiankang2,hgzbz,xxcy,xxcy1,xxcy3,xxcy4,xxcy5,chenguang,chuantongchanye
            ])
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps -- year 变化时拉取；避免将 fetch 包装进依赖导致循环
    },[year])
    return (
        <div style={{
            height: '100vh',
            overflow:'scroll',
            scrollbarWidth: 'none',
            fontSize: '0.18rem',
            backgroundColor: '#fff',
        }}>
            <TopBar1 year={year} setYear={setYear} title={'招商项目'} time={true}/>
            <div className='content'>
                <Tabs defaultActive={0}>
                    <Tabs.TabPane key={1} title={`在谈项目情况`}>
                        <div style={{
                            marginTop: '0.2rem',
                            width: '100%',
                            padding: '0 0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.12rem',
                            flexWrap: 'wrap',
                            boxSizing: 'border-box',
                        }}>
                            {
                                list.map((item, index) => {
                                    return (
                                        <div onClick={() => {
                                            if(index===0||index===1){
                                                navigate(`/InvestmentView/InvestProjectList?&year=${year}&currentProjectProgress=1&signedProject=false`)
                                            }else if(item.name ==='内资项目数'||item.name ==="内资金额（亿元）"){
                                                navigate(`/InvestmentView/InvestProjectList?year=${year}&investmentFlag=1&currentProjectProgress=1&signedProject=false`)
                                            }else if(item.name ==='外资项目数'||item.name ==="外资金额（亿元）"){
                                                navigate(`/InvestmentView/InvestProjectList?year=${year}&investmentFlag=2&currentProjectProgress=1&signedProject=false`)
                                            }else if(index===6){
                                                // navigate(`/InvestmentView/InvestProjectList?year=${year}&currentProjectProgress=2`)
                                            }else if(index===7||index===8){
                                                navigate(`/InvestmentView/InvestProjectList?year=${year}&currentProjectProgress=1&currentMonth=true&signedProject=false`)
                                            }
                                        }} className='item' key={index} style={{
                                            width: index === 6 ? '100%' : '48%',
                                            height: index === 6 ? '0.5rem' : '',
                                            marginBottom: '0.1rem',
                                            borderRadius: '0.05rem',
                                            padding: '0.08rem 0.15rem',
                                            boxSizing: 'border-box',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: index === 7 ? 'linear-gradient(117deg, #33d8fe -3%, #369cff 126%)' : '#f3f5f9',
                                        }}>
                                            <div>
                                                {
                                                    (index === 0 || index === 1) && <div style={{
                                                        color: '#959595',
                                                    }} className='item-name'>在谈项目</div>
                                                }
                                                <div style={{
                                                    color: index === 7 ? '#fff' : '#959595'
                                                }} className='item-name'>{item.name}</div>
                                                {
                                                    index != 6 && <div style={{
                                                        color: index === 7 ? '#fff' : '959595',
                                                        marginTop: '0.05rem',
                                                    }} className='item-value'>{item.value}</div>
                                                }
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                // justifyContent: 'center',
                                            }}>
                                                {
                                                    index === 6 && <div style={{
                                                        // marginTop: '0.05rem',
                                                    }} className='item-value'>{item.value}</div>
                                                }
                                                <Arrow/>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className='tabList' style={{
                                width: '100%',
                            }}>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                }}>
                                    {
                                        tabList.map((item, index) => {
                                            return (
                                                <div style={{
                                                    width: '30%',
                                                    height: '0.3rem',
                                                    marginBottom: '0.1rem',
                                                    marginRight: '1.3%',
                                                    borderRadius: '0.05rem',
                                                    textAlign: 'center',
                                                    lineHeight: '0.3rem',

                                                    background: activeColor === index ? '#377cfd' : '#f3f5f9',
                                                    color: activeColor === index ? '#fff' : '#666',
                                                }} onClick={() => {
                                                    setActiveColor(index)
                                                }} key={index} className='tabList-item'>
                                                    <div className='tabList-item-name'>{item.name}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <div style={{
                                marginTop: '0.2rem',
                                width: '100%',
                            }}>
                                {/*{*/}
                                {/*    activeColor === 0 &&*/}
                                {/*    <div>*/}
                                {/*        <div style={{*/}
                                {/*            fontSize: '0.16rem',*/}
                                {/*            fontWeight: 'bolder',*/}
                                {/*            marginBottom: '0.2rem',*/}
                                {/*        }}>*/}
                                {/*            产业分类（不区分内外资）*/}
                                {/*        </div>*/}
                                {/*        <div style={{*/}
                                {/*            width: '100%',*/}
                                {/*        }}>*/}
                                {/*            {*/}
                                {/*                tab1List1.map((item, index) => {*/}
                                {/*                    return (*/}
                                {/*                        <div onClick={() => {*/}
                                {/*                            setVisible(true)*/}
                                {/*                            setPopTitle(item.name)*/}
                                {/*                            console.log(item.name)*/}
                                {/*                        }} key={index} style={{*/}
                                {/*                            height: '0.5rem',*/}
                                {/*                            width: '100%',*/}
                                {/*                            color: '#959595',*/}
                                {/*                            display: 'flex',*/}
                                {/*                            alignItems: 'center',*/}
                                {/*                            justifyContent: 'space-between',*/}
                                {/*                            backgroundColor: '#f3f5f9',*/}
                                {/*                            border: '0.01rem solid #dee1e9',*/}
                                {/*                            marginBottom: '0.1rem',*/}
                                {/*                            padding: '0 0.1rem',*/}
                                {/*                            boxSizing: 'border-box',*/}
                                {/*                        }}>*/}
                                {/*                            <div style={{*/}
                                {/*                                display: 'flex',*/}
                                {/*                                alignItems: 'center',*/}
                                {/*                                width: '33%',*/}
                                {/*                            }}>*/}
                                {/*                                <div style={{*/}
                                {/*                                    height: '0.1rem',*/}
                                {/*                                    width: '0.1rem',*/}
                                {/*                                    background: item.color,*/}
                                {/*                                    borderRadius: '50%',*/}
                                {/*                                    marginRight: '0.05rem',*/}
                                {/*                                }}></div>*/}
                                {/*                                <div>{item.name}</div>*/}
                                {/*                            </div>*/}


                                {/*                            <div style={{*/}
                                {/*                                color: item.color*/}
                                {/*                            }}>{item.percent}%*/}
                                {/*                            </div>*/}

                                {/*                            <div>*/}
                                {/*                                <div>项目数量</div>*/}
                                {/*                                <div>{item.total}个</div>*/}
                                {/*                            </div>*/}

                                {/*                            <div>*/}
                                {/*                                <div>项目金额</div>*/}
                                {/*                                <div>{item.amount}亿元</div>*/}
                                {/*                            </div>*/}
                                {/*                            <Arrow/>*/}

                                {/*                        </div>*/}
                                {/*                    )*/}
                                {/*                })*/}
                                {/*            }*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*}*/}
                                {
                                    activeColor  === 0 &&<ProjectScale year={year}/>
                                }
                                {
                                    activeColor  === 1&&<GlobalProject year={year} />
                                }
                                {
                                    activeColor  === 2&&<ParkSituation year={year}/>
                                }{
                                    activeColor  === 3&&<ProcessProcess />
                                }
                            </div>
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane key={2} title={`签约项目情况`}>
                        <div style={{
                            marginTop: '0.2rem',
                            width: '100%',
                            padding: '0 0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.12rem',
                            flexWrap: 'wrap',
                            boxSizing: 'border-box',
                        }}>
                            {
                                list2.map((item, index) => {
                                    return (
                                        <div className='item' key={index} onClick={() => {
                                            if(index===0||index===1){
                                                navigate(`/InvestmentView/InvestProjectList?&year=${year}&currentProjectProgress=2&signedProject=true`)
                                            }else if(index===2||index===3){
                                                navigate(`/InvestmentView/InvestProjectList?year=${year}&investmentFlag=1&currentProjectProgress=2&signedProject=true`)
                                            }else if(index===4||index===5){
                                                navigate(`/InvestmentView/InvestProjectList?year=${year}&investmentFlag=2&currentProjectProgress=2&signedProject=true`)
                                            }else if(index===6||index===7){
                                                navigate(`/InvestmentView/InvestProjectList?year=${year}&currentProjectProgress=2&currentMonth=true&signedProject=true`)
                                            }
                                        }} style={{
                                            width: '48%',
                                            marginBottom: '0.1rem',
                                            borderRadius: '0.05rem',
                                            padding: '0.08rem 0.15rem',
                                            boxSizing: 'border-box',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            // background:  '#f3f5f9',
                                            background: index === 6 ? 'linear-gradient(117deg, #33d8fe -3%, #369cff 126%)' : '#f3f5f9',
                                        }}>
                                            <div>
                                                {
                                                    (index === 0 || index === 1) && <div style={{
                                                        color: '#959595',
                                                    }} className='item-name'>签约项目</div>
                                                }
                                                <div style={{
                                                    color: index === 6 ? '#fff' : '#959595'
                                                }} className='item-name'>{item.name}</div>
                                                <div style={{
                                                    color: index === 6 ? '#fff' : '959595',
                                                    marginTop: '0.05rem',
                                                }} className='item-value'>{item.value}</div>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                // justifyContent: 'center',
                                            }}>
                                                <Arrow color={index === 6 ? '#fff' : undefined}/>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className='tabList' style={{
                                width: '100%',
                            }}>
                                <div style={{
                                    width: '100%',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gridGap: '0.1rem',
                                }}>
                                    {
                                        tabList2.map((item, index) => {
                                            return (
                                                <div style={{
                                                    height: '0.3rem',
                                                    // marginBottom: '0.1rem',
                                                    marginRight: '1.3%',
                                                    borderRadius: '0.05rem',
                                                    textAlign: 'center',
                                                    lineHeight: '0.3rem',

                                                    background: activeColor1 === index ? '#377cfd' : '#f3f5f9',
                                                    color: activeColor1 === index ? '#fff' : '#666',
                                                }} onClick={() => {
                                                    setActiveColor1(index)
                                                }} key={index} className='tabList-item'>
                                                    <div className='tabList-item-name'>{item.name}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <div style={{
                                marginTop: '0.2rem',
                                width: '100%',
                            }}>
                                {
                                    activeColor1 === 0 &&
                                    <div>
                                        <div style={{
                                            fontSize: '0.16rem',
                                            fontWeight: 'bolder',
                                            marginBottom: '0.2rem',
                                        }}>
                                            产业分类（不区分内外资）
                                        </div>
                                        <div style={{
                                            width: '100%',
                                        }}>
                                            {
                                                tab1List.map((item, index) => {
                                                    return (
                                                        <div onClick={() => {
                                                            if(index===3||index===4||index===5||index===6||index===7){
                                                                return
                                                            }
                                                            setVisible(true)
                                                            setPopTitle(item.name)
                                                            console.log(item.name)
                                                        }} key={index} style={{
                                                            height: '0.5rem',
                                                            width: '100%',
                                                            color: '#959595',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            backgroundColor: '#f3f5f9',
                                                            border: '0.01rem solid #dee1e9',
                                                            marginBottom: '0.1rem',
                                                            padding: '0 0.1rem',
                                                            boxSizing: 'border-box',
                                                        }}>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                width: '33%',
                                                            }}>
                                                                <div style={{
                                                                    height: '0.1rem',
                                                                    width: '0.1rem',
                                                                    background: item.color,
                                                                    borderRadius: '50%',
                                                                    marginRight: '0.05rem',
                                                                }}></div>
                                                                <div style={{width: '95%'}}>{item.name}</div>
                                                            </div>
                                                            <div style={{
                                                                color: item.color
                                                            }}>{item.percent? item.percent.toFixed(2)+"%":'-'}
                                                            </div>

                                                            <div>
                                                                <div>项目数量</div>
                                                                <div>{item.total}个</div>
                                                            </div>

                                                            <div>
                                                                <div>项目金额</div>
                                                                <div>{item.amount.toFixed(2)}亿元</div>
                                                            </div>
                                                            <Arrow/>

                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                }
                                {
                                    activeColor1  === 1 &&<ProjectScale1 year={year}/>
                                }
                                {
                                    activeColor1  === 2&&<GlobalProject1  year={year}/>
                                }
                                {
                                    activeColor1  === 3&&<ParkSituation1  year={year} />
                                }
                                {
                                    activeColor1 === 4&&<ProjectNeed  year={year}/>
                                }
                                {
                                    activeColor1  === 5&&<ProcessProcess />
                                }
                            </div>
                        </div>
                    </Tabs.TabPane>
                </Tabs>
            </div>
            <Popup style={{
                height: '65vh',
                width: '76vw',
                overflowY: 'auto ',
                fontSize: '0.18rem'
            }} visible={visible} closeable round onClose={() => setVisible(false)}>
                <div style={{padding: '30px 30px'}}>
                    <div style={{
                        width: '100%',
                        textAlign: 'center',
                    }}
                    >{popTitle}</div>
                    {popTitle === '生物医药' && <MultiRingChart list={t1}/>}
                    {popTitle === '健康食品' && <MultiRingChart11 list={t11}/>}
                    {popTitle === '海工装备和高技术船舶' && <MultiRingChart2 list={t2}/>}
                    {popTitle === '汽车及零部件产业集群' && <MultiRingChart3  list={t3}/>}
                    {popTitle === '新一代信息技术和智能装备产业集群' && <MultiRingChart33  list={t33}/>}
                    {popTitle === '未来产业' && <MultiRingChart4 list={t4}/>}
                    {popTitle === '传统产业' && <MultiRingChart5 list={t5}/>}
                </div>
            </Popup>
        </div>
    );

}
