import {useEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import {Button, Modal, Progress} from "antd";

const TopEconomyChart1 = () => {
    const chartRef = useRef(null);
    const invlist = [32,21,9,31,31,22,32,37,27,30]
    const invlist1 = [243.5, 114.1, 68.8, 183.8,182.6, 127.5, 280.2, 248.3, 233.3, 223.3]
    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {type: 'shadow'}
            },
            legend: {
                data: ['项目数量（个）', '投资金额（亿元）']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['生物医药', '健康食品', '海工装备和高技术船舶', '智能装备', '汽车及零部件', '节能环保', '石化', '金属材料及制品', '新能源', '电子信息'],
                axisLabel: {
                    rotate: 30, // 旋转45度
                    interval: 0 // 强制显示所有标签
                }
            },
            yAxis: {
                type: 'value',

            },
            series: [
                {
                    name: '项目数量（个）',
                    type: 'bar',
                    data: invlist,
                    barWidth: '20%',
                    itemStyle: {
                        color: "#29d76c"
                    }
                }, {
                    name: '投资金额（亿元）',
                    type: 'bar',
                    barWidth: '20%',
                    barGap: 0,
                    data: invlist1,
                    itemStyle: {
                        color: "#406efc"
                    }
                },
            ]
        };
        chart.setOption(option);
        return () => chart.dispose();
    }, [])
    return <div ref={chartRef} style={{width: '100%', height: '300px', marginTop: '20px'}}/>;
};

const HorizontalBarChart = () => {
    useEffect(() => {
        const chartDom = document.getElementById('chart');
        const myChart = echarts.init(chartDom);

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['新建', '存量']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}' // 轴标签显示为百分比
                    }
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    data: ['项目数量（个）', '竣工认定完成投资(亿元)'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            series: [
                {
                    name: '新建',
                    type: 'bar',
                    stack: '总量', // 使用相同的stack值来堆叠
                    data: [94, 665.3], // 实际值的百分比
                    barWidth: '20%',
                    itemStyle: {
                        color: '#29d76c'
                    }
                },
                {
                    name: '存量',
                    type: 'bar',
                    stack: '总量', // 使用与上面相同的stack值
                    data: [210, 1401], // 计划值的百分比，确保每组数据总和为100%
                    barWidth: '20%',
                    itemStyle: {
                        color: '#406efc'
                    }
                }
            ]
        };
        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    }, []);
    return <div id="chart" style={{width: '100%', height: '200px'}}></div>;
};

const DonutChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        // 初始化图表
        const myChart = echarts.init(chartRef.current);

        const option = {
            // 提示框
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
            },
            // 图例
            legend: {
                orient: 'vertical',
                left: 'center',
                bottom: '0%',
                data: ['规上企业数量196家'],
            },
            series: [
                {
                    name: '完成情况',
                    type: 'pie',
                    radius: ['60%', '70%'], // 内外半径，形成环形
                    avoidLabelOverlap: false,
                    // 中心位置
                    center: ['50%', '50%'],
                    // 强调标签
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{b}\n{c} ({d}%)',
                    },
                    // 标签线
                    labelLine: {
                        show: true,
                        length: 10,
                        length2: 10,
                    },
                    // 数据
                    data: [
                        { value: 85, name: '规上企业数量196家', itemStyle: { color: '#5470C6' } },
                    ],
                    // 高亮样式
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0,0,0,0.5)',
                        },
                    },
                },
            ],
        };

        option.series[0].label = {
            show: true,
            position: 'center',
            formatter: function () {
                return '283家';
            },
            rich: {
                value: {
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#5470C6',
                    lineHeight: 40,
                },
            },
            fontSize: 16,
            color: '#666',
        };

        myChart.setOption(option);

        // 清理
        return () => {
            myChart.dispose();
        };
    }, []);

    return (
        <div
            ref={chartRef}
            style={{ width: '50%', height: '200px', margin: '0 auto' }}
        ></div>
    );
};

const PieChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        // 初始化图表实例
        const myChart = echarts.init(chartRef.current);

        // 图表配置项
        const option = {
            legend: {
                orient: 'vertical',
                left: 'center',
                bottom:'0%'
            },
            series: [
                {
                    type: 'pie',
                    radius: '70%',
                    data: [
                        { value: 58, name: '新建项目“新开投产”进规\n的企业' },
                        { value: 138, name: '通过存量企业再投资带动\n“规下转规上”的企业' },

                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        position: 'inside',
                        show: true,
                        formatter: '{c}', // 显示名称、值和百分比
                        fontSize: 12,
                        color:'#fff'
                    },
                    labelLine: {
                        show:false
                    }
                }
            ]
        };
        // 使用配置项生成图表
        myChart.setOption(option);
        // 当组件卸载时销毁图表实例
        return () => {
            myChart.dispose();
        };
    }, []);

    return (
        <div ref={chartRef} style={{ width: '50%', height: '280px' }}></div>
    );
};

const DonutChart1 = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        // 初始化图表
        const myChart = echarts.init(chartRef.current);

        const option = {
            // 提示框
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
            },
            // 图例
            legend: {
                orient: 'vertical',
                left: 'center',
                bottom: '0%',
                data: ['196家规上企业2024年\n实现产值2397.8亿元\n占全市规上企业产值\n比重29.2%'],
            },
            series: [
                {
                    name: '完成情况',
                    type: 'pie',
                    radius: ['60%', '70%'], // 内外半径，形成环形
                    avoidLabelOverlap: false,
                    // 中心位置
                    center: ['50%', '50%'],
                    // 强调标签
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{b}\n{c} ({d}%)',
                    },
                    // 标签线
                    labelLine: {
                        show: true,
                        length: 10,
                        length2: 10,
                    },
                    // 数据
                    data: [
                        { value: 85, name: '196家规上企业2024年\n实现产值2397.8亿元\n占全市规上企业产值\n比重29.2%', itemStyle: { color: '#1fc6c4' } },
                    ],
                    // 高亮样式
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0,0,0,0.5)',
                        },
                    },
                },
            ],
        };

        option.series[0].label = {
            show: true,
            position: 'center',
            formatter: function () {
                return '产值 \n 2397.8亿元';
            },
            rich: {
                value: {
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#5470C6',
                    lineHeight: 40,
                },
            },
            fontSize: 16,
            color: '#666',
        };

        myChart.setOption(option);

        // 清理
        return () => {
            myChart.dispose();
        };
    }, []);

    return (
        <div
            ref={chartRef}
            style={{ width: '50%', height: '250px', margin: '0 auto' }}
        ></div>
    );
};
const DonutChart2 = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        // 初始化图表
        const myChart = echarts.init(chartRef.current);
        const option = {
            // 提示框
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
            },
            // 图例
            legend: {
                orient: 'vertical',
                left: 'center',
                bottom: '0%',
                data: ['产值增量拉动全市规上企业产值\n约2.7个百分点'],
            },
            series: [
                {
                    name: '完成情况',
                    type: 'pie',
                    radius: ['60%', '70%'], // 内外半径，形成环形
                    avoidLabelOverlap: false,
                    // 中心位置
                    center: ['50%', '50%'],
                    // 强调标签
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{b}\n{c} ({d}%)',
                    },
                    // 标签线
                    labelLine: {
                        show: true,
                        length: 10,
                        length2: 10,
                    },
                    // 数据
                    data: [
                        { value: 85, name: '产值增量拉动全市规上企业产值\n约2.7个百分点', itemStyle: { color: '#2575ff' } },
                    ],
                    // 高亮样式
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0,0,0,0.5)',
                        },
                    },
                },
            ],
        };

        option.series[0].label = {
            show: true,
            position: 'center',
            formatter: function () {
                return '2.7%';
            },
            rich: {
                value: {
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#5470C6',
                    lineHeight: 40,
                },
            },
            fontSize: 16,
            color: '#666',
        };

        myChart.setOption(option);

        // 清理
        return () => {
            myChart.dispose();
        };
    }, []);

    return (
        <div
            ref={chartRef}
            style={{ width: '50%', height: '250px', margin: '0 auto' }}
        ></div>
    );
};


export default function NewProInfo() {
    const list = [
        {
            title: '竣工项目总数',
            num: '304',
            url: '/img/newProInfo/b1.png'
        },
        {
            title: '计划总投资',
            num: '2373.8',
            url: '/img/newProInfo/b2.png'
        },
        {
            title: '竣工认定完成投资',
            num: '2066.3',
            url: '/img/newProInfo/b3.png'
        }, {
            title: '投资完成率',
            num: '87',
            url: '/img/newProInfo/b4.png'
        },
    ]
    const log1 = '2022-2024年全市“三比一提升”竣工项目中，工业项目304个，计划总投资2373.8亿元，竣工认定完成投资2066.3亿元，投资完成率为87%。从项目投资的行业分类看，石化、金属材料及制品、生物医药、新能源、电子信息领域投资能力较强，五个行业的项目投资额占投资总量的59.5%。此外，智能装备、汽车及零部件、节能环保、健康食品四个行业竣工项目投资规模超百亿。'
    const log2 = '从项目实施主体看，新招引企业投资项目共94个、竣工认定完成投资665.3亿元，分别占全部工业竣工项目的30.9%、32.2%；存量企业再投资项目共210个、竣工认定完成投资1401亿元，分别占总量的69.1%、67.8%。从投资主体性质来看，竣工项目投资主体仍然以存量企业投资为主，新招引项目的数量和投资额占比均低于项目总量的三分之一。（从项目竣工时间往前推三年，注册时间早于的为存量企业，晚于为新招引企业）'
    const log3 = '根据2025年规上工业企业名单比对情况看，304个竣工项目实施主体中，剔除重复的实施主体后，共有283家企业，规上列统企业共196家，占比69.3%，其中：通过新建项目“新开投产”进规的企业58家，通过存量企业再投资带动“规下转规上”的企业138家。全市新增工业规模企业主要依赖存量企业“规下转规上”，新招引主体实施项目在竣工投产后的产值开票等效益指标有待进一步释放。'
    const log4 = '在竣工项目实施主体中，196家规上企业2024年实现产值2397.8亿元，占全市规上企业产值比重29.2%。在196家规上企业中，14家为2025年新进规企业未匹配到产值数据。从项目整体产值与投资比重来看，截至2024年底，项目主体产值投资比低于50%、30%的分别为202家、170家，占项目总数的66.4%和55.9%。'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logIndex, setLogIndex] = useState(0)
    const showModal = () => {
        setIsModalOpen(true);
        console.log('showModal');
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div style={{fontSize: '0.14rem', background: 'linear-gradient(to bottom, #4099f6 0%, #4099f6 10%, #eff7ff 100%)', padding: '0.1rem 0.1rem 0.6rem 0.1rem', height: '200vh', overflow: 'scroll', scrollbarWidth: 'none',}}>
            <div style={{marginTop: '0.4rem', marginLeft: '0.2rem'}}>
                <img style={{height: '0.3rem'}} src="/img/newProInfo/banner.png" alt=""/>
            </div>
            <div style={{display: 'flex', justifyContent: 'right', marginTop: '-0.2rem'}}>
                <img style={{height: '1rem', marginLeft: '0.2rem'}} src="/img/newProInfo/banner1.png" alt=""/>
            </div>
            <div style={{
                marginTop: '-0.4rem',
                backgroundColor: '#fff',
                padding: '0.1rem',
                borderRadius: '0.05rem',
                position: 'relative',
                zIndex: '1',
                // top: '1.5rem',
                boxSizing: 'border-box',
                width: '100%'
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{paddingLeft: '0.1rem', borderLeft: '0.05rem #4099f6 solid ', fontWeight: 'bold'}}>
                        工业竣工项目投入情况
                    </div>
                    <div style={{fontSize: '0.12rem'}} onClick={()=>{
                        setIsModalOpen(true);
                        setLogIndex(1)
                    }}>
                        详细说明
                    </div>
                </div>
                <div style={{marginTop: '0.2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.1rem'}}>
                    {
                        list.map((item, index) => (
                            <div style={{padding: '0.1rem', boxShadow: '0 6px 20px 0 #2179cb29'}}>
                                <div style={{fontSize: '0.16rem', fontWeight: 'bold'}}>{item.num}
                                    <span
                                        style={{fontSize: '0.1rem'}}>{index === 0 ? '个' : (index === 1 || index === 2) ? '亿元' : '%'}</span>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div style={{color: '#999'}}>{item.title}</div>
                                    <img style={{marginTop: '0.2rem', marginLeft: '0.2rem', width: '0.5rem'}}
                                         src={item.url} alt=""/>
                                </div>

                            </div>
                        ))
                    }
                </div>
                <div style={{marginTop: '0.2rem', fontWeight: 'bold', textAlign: 'center'}}>
                    2022-2024年“三比一提升”竣工项目十大行业分布情况
                </div>
                <TopEconomyChart1></TopEconomyChart1>
            </div>

            <div style={{
                marginTop: '0.2rem',
                backgroundColor: '#fff',
                padding: '0.1rem',
                borderRadius: '0.05rem',
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem'}}>
                    <div style={{paddingLeft: '0.1rem', borderLeft: '0.05rem #4099f6 solid ', fontWeight: 'bold'}}>
                        新建和存量企业再投资情况
                    </div>
                    <div style={{fontSize: '0.12rem'}}  onClick={()=>{
                        setIsModalOpen(true);
                        setLogIndex(2)
                    }}>
                        详细说明
                    </div>
                </div>
                <HorizontalBarChart></HorizontalBarChart>
            </div>
            <div style={{marginTop: '0.2rem'}}>
                <img style={{height: '0.25rem'}} src="/img/newProInfo/banner2.png" alt=""/>
            </div>
            <div style={{display: 'flex', justifyContent: 'right'}}>
                <img src="/img/newProInfo/b5.png" style={{height: '1rem', marginLeft: '0.2rem'}} alt=""/>
            </div>
            <div style={{
                width: '100%',
                marginTop: '-0.4rem',
                position: 'relative',
                zIndex: '1',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                padding: '0.1rem',
                borderRadius: '0.05rem',
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between',marginBottom: '-0.4rem',position: 'relative', zIndex: 1}}>
                    <div style={{paddingLeft: '0.1rem', borderLeft: '0.05rem #4099f6 solid ', fontWeight: 'bold'}}>
                        项目实施主体进规纳统情况
                    </div>
                    <div style={{fontSize: '0.12rem'}} onClick={()=>{
                        setIsModalOpen(true);
                        setLogIndex(3)
                    }}>
                        详细说明
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{width: '50%',height: '280px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',paddingTop:'20px'}}>
                        <Progress
                            type="circle"
                            strokeColor={'#65b5f9'}
                            percent={+(196/283*100).toFixed(2)}
                            format={() =>(
                                <div>
                                    283家
                                </div>
                            )}
                        />
                        <div style={{marginTop:'10px',fontSize:'12px'}}>规上企业数量196家</div>
                    </div>
                    <PieChart></PieChart>
                </div>
            </div>

            <div style={{
                width: '100%',
                marginTop: '0.4rem',
                position: 'relative',
                zIndex: '1',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                padding: '0.1rem',
                borderRadius: '0.05rem',
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{paddingLeft: '0.1rem', borderLeft: '0.05rem #4099f6 solid ', fontWeight: 'bold'}}>
                        项目实施主体产出效益情况
                    </div>
                    <div style={{fontSize: '0.12rem'}} onClick={()=>{
                        setIsModalOpen(true);
                        setLogIndex(4)
                    }}>
                        详细说明
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    {/*<DonutChart1></DonutChart1>*/}
                    <div style={{
                        width: '45%',
                        height: '250px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: '30px'
                    }}>
                        <Progress
                            type="circle"
                            strokeColor={'#1fc6c4'}
                            percent={29.2}
                        />
                        <div
                            style={{marginTop: '40px', fontSize: '0.12rem'}}>196家规上企业2024年
                            实现产值2397.8亿元
                            占全市规上企业产值
                            比重29.2%
                        </div>
                    </div>
                    <div style={{
                        width: '45%',
                        height: '250px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: '20px'
                    }}>
                        <Progress
                            type="circle"
                            strokeColor={'#65b5f9'}
                            percent={2.7}
                        />
                        <div
                            style={{marginTop: '40px', fontSize: '0.12rem'}}>产值增量拉动全市规上企业产值约2.7个百分点
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="详细情况"
                closable={{'aria-label': 'Custom Close Button'}}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText={'取消'}
                okText={'确定'}
            >

                <div>
                    {
                        logIndex === 1 && log1
                    }
                    {
                        logIndex === 2 && log2
                    }
                    {
                        logIndex === 3 && log3
                    }
                    {
                        logIndex === 4 && log4
                    }
                </div>
            </Modal>
        </div>
    )
}
