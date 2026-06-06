import TopBar1 from "../../components/TopBar/TopBar1.tsx";
import {useEffect, useRef, useState} from "react";
import SeasonPick from "../../components/YearPick/economy/SeasonPick.tsx";
import {primeApi} from "../../api.ts";
import {ElectricIndustryRevenueVo} from "../../apis";
import * as echarts from "echarts";

const TopEconomyChart = (e:{eleList:ElectricIndustryRevenueVo[]}) => {
    const {eleList} = e
    // console.log(eleList)
    const chartRef = useRef(null);

    useEffect(() => {
        const datalist = (eleList ?? []).map((item) => ({
            name: item.city ?? '',
            value: item.realRevenues ?? 0,
            totalOperatingIncome: item.totalOperatingIncome ?? 0
        }))
        console.log('datalist', datalist)
        if (!chartRef.current) return
        const chart = echarts.init(chartRef.current);
        const option = {
            series: [{
                silent: true,
                type: 'pie',
                radius: ['60%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,  // 圆角大小
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'center',
                    formatter: `{title|${datalist[0]?.totalOperatingIncome}}\n营业收入总数\n{title1|（亿元）}`,
                    rich: {
                        title: {
                            fontSize: 18,
                            color: '#333',
                            fontWeight:'bolder',
                            padding: [5, 0]
                        },
                        title1:{
                            padding: [5, 0]

                        }
                    }
                },
                emphasis: {
                    scale:false,
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: datalist
            }]
        };

        chart.setOption(option);
        // chart.on('click',()=>false)
        return () => {
            chart.dispose();
        };
    }, [eleList]);
    return (
        <div
            ref={chartRef}
            style={{width: '100%', height: '200px'}}
        />
    );
};
const TopEconomyChart1 = (e:{eleList:ElectricIndustryRevenueVo[]}) => {
    const chartRef = useRef(null);
    const {eleList} = e;
    // console.log('eleList',eleList)
    useEffect(() => {
        const list: string[] = eleList ? eleList.map((item) => item.city ?? '') : []
        const dataList: number[] = eleList ? eleList.map((item) => item.reachability ?? 0) : []
        if (!chartRef.current) return
        const chart = echarts.init(chartRef.current);
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {type: 'shadow'}
            },
            label: {
                show: true,
                position: 'top',
                formatter: function (params: { value: number }) {
                    return params.value + '%'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true,

            },
            xAxis: {
                type: 'category',
                data: list,
                axisLabel: {
                    rotate: 30,
                    fontSize: 10
                }
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name: '达产率',
                    type: 'bar',
                    barWidth: '40%',
                    data: dataList,
                    itemStyle: {
                        color: "#407DFC"
                    }
                }
            ]
        };

        chart.setOption(option);

        return () => chart.dispose();
    }, [eleList]);

    return <div ref={chartRef} style={{width: '100%', height: '300px'}}/>;
};
export default function Electric() {
    const [year, setYear] = useState('2025')
    const [season, setSeason] = useState('上半年')
    const [quarter, setQuarter] = useState(2)
    const [eleList, setEleList] = useState<ElectricIndustryRevenueVo[]>([])

    const getDefaultSettings = () => {
        // 本页仅支持上半年
        setQuarter(2)
        setSeason('上半年')
    }

    const getElectricInformationIndustry = async () => {
        const data = await primeApi.getElectricInformationIndustry({year: +year, quarter: quarter})
        console.log('getElectricInformationIndustry', data)
        setEleList(data ?? [])
    }
    useEffect(() => {
        getElectricInformationIndustry()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year, season, quarter]);
    useEffect(() => {
        getDefaultSettings()
    }, []);
    return (
        <div style={{
            height: '100vh',
            fontSize: '0.16rem',
            backgroundColor: '#F0F2F6',
            overflow: 'scroll',
            scrollbarWidth: 'none',
        }}>
            <TopBar1 year={year} setYear={setYear} time={true} title={'电子信息产业链'} fixedYear="2025"/>
            <div style={{padding: '0.15rem'}}>
                <div style={{display: 'flex'}}>
                    <SeasonPick year={season} setQuarter={setQuarter} setYear={setSeason} allowedQuarters={[2]}/>
                </div>
                <div>
                    <div style={{
                        marginTop: '0.15rem',
                        padding: '0.15rem',
                        background: 'linear-gradient(180deg,#e7f3ff, #ffffff 17%)'
                    }}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <img src="/img/TopEconomy/left.png" alt=""/>
                            <div style={{
                                fontWeight: 'bold',
                                fontSize: '0.18rem',
                                color: '#333333',
                                marginLeft: '0.1rem'
                            }}>营收情况
                            </div>
                        </div>
                        <div style={{display: 'flex', marginTop: '0.15rem', flexWrap: 'wrap'}}>
                            <div style={{
                                padding: '0.10rem',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                background: '#f6f6f6'
                            }}>
                                <div style={{width: '30%', textAlign: 'center'}}>市区</div>
                                <div style={{width: '35%', textAlign: 'center'}}>
                                    <div>预期营业</div>
                                    <div>收入(亿元)</div>
                                </div>
                                <div style={{width: '35%', textAlign: 'center'}}>
                                    <div>实际营业</div>
                                    <div>收入(亿元)</div>
                                </div>
                            </div>
                            {eleList?.map((item, index) => {
                                return <div key={index} style={{
                                    padding: '0.10rem',
                                    width: '100%',
                                    height: '0.4rem',
                                    // lineHeight: '0.4rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: ((item.expectRevenues ?? 0) <= (item.realRevenues ?? 0)) ? '#e5f9f4' : '#feecec'
                                }}>
                                    <div style={{width: '30%', textAlign: 'center'}}>{item.city}</div>
                                    <div style={{width: '35%', textAlign: 'center'}}>
                                        {item.expectRevenues}
                                    </div>
                                    <div style={{width: '35%', textAlign: 'center'}}>
                                        {item.realRevenues}
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>

                    <div style={{
                        marginTop: '0.15rem',
                        padding: '0.15rem',
                        background: 'linear-gradient(180deg,#e7f3ff, #ffffff 17%)'
                    }}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <img src="/img/TopEconomy/left.png" alt=""/>
                            <div style={{
                                fontWeight: 'bold',
                                fontSize: '0.18rem',
                                color: '#333333',
                                marginLeft: '0.1rem'
                            }}>达产率
                            </div>
                        </div>
                        <TopEconomyChart1 eleList={eleList}/>

                    </div>

                    <div style={{
                        marginTop: '0.15rem',
                        padding: '0.15rem',
                        background: 'linear-gradient(180deg,#e7f3ff, #ffffff 17%)'
                    }}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <img src="/img/TopEconomy/left.png" alt=""/>
                            <div style={{
                                fontWeight: 'bold',
                                fontSize: '0.18rem',
                                color: '#333333',
                                marginLeft: '0.1rem'
                            }}>营收占比
                            </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{width: '50%', height: '2rem'}}>
                                <TopEconomyChart eleList={eleList}/>
                            </div>
                            <div style={{width: '50%'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <div style={{
                                            width: '0.1rem',
                                            height: '0.1rem',
                                            backgroundColor: '#5c7bd9',
                                            marginRight: '0.1rem'
                                        }}>
                                        </div>
                                        <div>{eleList?.[0]?.city ?? ''}</div>
                                    </div>
                                    <div>{eleList?.[0]?.ratio ?? ''}%</div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '0.15rem'
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <div style={{
                                            width: '0.1rem',
                                            height: '0.1rem',
                                            backgroundColor: '#9fe080',
                                            marginRight: '0.1rem'
                                        }}>
                                        </div>
                                        <div>{eleList?.[1]?.city ?? ''}</div>
                                    </div>
                                    <div>{eleList?.[1]?.ratio ?? ''}%</div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '0.15rem'
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <div style={{
                                            width: '0.1rem',
                                            height: '0.1rem',
                                            backgroundColor: '#ffdc60',
                                            marginRight: '0.1rem'
                                        }}>
                                        </div>
                                        <div>{eleList?.[2]?.city ?? ''}</div>
                                    </div>
                                    <div>{eleList?.[2]?.ratio ?? ''}%</div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '0.15rem'
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <div style={{
                                            width: '0.1rem',
                                            height: '0.1rem',
                                            backgroundColor: '#ee6666',
                                            marginRight: '0.1rem'
                                        }}>
                                        </div>
                                        <div>{eleList?.[3]?.city ?? ''}</div>
                                    </div>
                                    <div>{eleList?.[3]?.ratio ?? ''}%</div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '0.15rem'
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <div style={{
                                            width: '0.1rem',
                                            height: '0.1rem',
                                            backgroundColor: '#7ed3f4',
                                            marginRight: '0.1rem'
                                        }}>
                                        </div>
                                        <div>{eleList?.[4]?.city ?? ''}</div>
                                    </div>
                                    <div>{eleList?.[4]?.ratio ?? ''}%</div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '0.15rem'
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <div style={{
                                            width: '0.1rem',
                                            height: '0.1rem',
                                            backgroundColor: '#40b27d',
                                            marginRight: '0.1rem'
                                        }}>
                                        </div>
                                        <div>{eleList?.[5]?.city ?? ''}</div>
                                    </div>
                                    <div>{eleList?.[5]?.ratio ?? ''}%</div>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

            </div>


        </div>
    )
}
