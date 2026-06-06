import TopBar1 from "../../components/TopBar/TopBar1.tsx";
import {useEffect, useRef, useState} from "react";
import SeasonPick from "../../components/YearPick/economy/SeasonPick.tsx";
import EconomyPick from "../../components/YearPick/economy/EconomyPick.tsx";
import {primeApi, systemApi} from "../../api.ts";
import {EconomyIncomeVo, EconomyIncomeCountyVo, RevenueRatioVo, SampleEnterpriseVo} from "../../apis";
import * as echarts from "echarts";
import {InfoCircleOutlined} from "@ant-design/icons";
import {Alert} from "antd";
import Marquee from 'react-fast-marquee';
import {Popup, PopupPosition} from "react-vant";
import AreaPick from "../../components/YearPick/economy/AreaPick.tsx";
import {useNavigate} from "react-router-dom";

const sjrdata = '上半年，全市数字经济核心产业企业营收占比上升0.9个百分点，主要得益于限上批零和规上服务业营收增长，幅度分别高达142.49%和10.83%。但喜中有忧的是规上工业数字经济核心企业营收仍然微跌，主要原因仍是海陵区35亿元的巨大营收缺口，拉低全市水平。此外，兴化市数字经济规模小、后劲乏力，数字经济核心企业营收未能跑赢规上企业营收大盘，占比为0增长。'
const TopEconomyChart = (e:{gongye:number,jianzhu:number,piling:number,fuwu:number}) => {
    const {gongye,jianzhu,piling,fuwu} = e
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        const option = {
            series: [{
                type: 'pie',
                radius: ['45%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,  // 圆角大小
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: gongye, name: '工业' },
                    { value: jianzhu, name: '建筑业' },
                    { value: piling, name: '批零住餐业' },
                    { value: fuwu, name: '服务' },
                ]
            }]
        };

        chart.setOption(option);

        return () => {
            chart.dispose();
        };
    }, [gongye]);
    return (
        <div
            ref={chartRef}
            style={{ width: '100%', height: '200px' }}
        />
    );
};
const TopEconomyChart2 = (e:{list1:EconomyIncomeCountyVo[]}) => {
    const {list1} = e
    const list = list1.map((item:EconomyIncomeCountyVo) => {
        return {
            value: item.rank?item.rank:0,
            name: item.region
        }
    })
    const chartRef = useRef(null);

    useEffect(() => {
        console.log('TopEconomyChart2',JSON.stringify(e))
        const chart = echarts.init(chartRef.current);
        const option = {
            series: [{
                type: 'pie',
                radius: ['45%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,  // 圆角大小
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: list
            }]
        };
        chart.setOption(option);
        return () => {
            chart.dispose();
        };
    }, [JSON.stringify(e)]);
    return (
        <div
            ref={chartRef}
            style={{ width: '100%', height: '200px' }}
        />
    );
};

const TopEconomyChart1 = (e:{ gyNum?: SampleEnterpriseVo; jzNum?: SampleEnterpriseVo; plNum?: SampleEnterpriseVo; fwNum?: SampleEnterpriseVo }) => {
    const chartRef = useRef(null);
    const { gyNum, jzNum, plNum, fwNum } = e
    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        console.log('TopEconomyChart1',JSON.stringify(e))
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: {
                data: ['上季度','本季度']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['工业', '建筑业', '批零住餐业','服务业'],
                axisLabel: {
                    rotate: 30, // 旋转45度
                    interval: 0 // 强制显示所有标签
                }
            },
            yAxis: {
                type: 'value',
                // axisLine: {
                //     show: true,
                //     lineStyle: { color: '#999' }
                // }
            },
            series: [
                {
                    name: '上季度',
                    type: 'bar',
                    data:[gyNum?.lastQuarterUnitNum,  jzNum?.lastQuarterUnitNum, plNum?.lastQuarterUnitNum, fwNum?.lastQuarterUnitNum],
                    itemStyle: {
                        color: "#46D698"
                    }
                },{
                    name: '本季度',
                    type: 'bar',
                    barGap: 0,
                    data: [gyNum?.sampleUnit,  jzNum?.sampleUnit, plNum?.sampleUnit, fwNum?.sampleUnit],
                    itemStyle: {
                        color: "#678BFD"
                    }
                },
            ]
        };

        chart.setOption(option);

        return () => chart.dispose();
    }, [JSON.stringify(e)]);
    return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};
export default function TopEconomy() {
    const [year, setYear] = useState('2025')
    const [season, setSeason] = useState('上半年')
    const [area, setArea] = useState('')
    const [areaList, setAreaList] = useState<string[]>([])
    const [eco, setEco] = useState('经济收入')
    const [gongye, setGongye] = useState<EconomyIncomeVo>()
    const [jianzhu, setJianzhu] = useState<EconomyIncomeVo>()
    const [piling, setPiling] = useState<EconomyIncomeVo>()
    const [fuwu, setFuwu]= useState<EconomyIncomeVo>()
    const [list, setList] = useState<EconomyIncomeVo[]>([])
    const [list1, setList1] = useState<EconomyIncomeCountyVo[]>([])
    const [target, setTarget] = useState<RevenueRatioVo[]>([])
    const [Gydata, setGydata] = useState<{ gynum?: SampleEnterpriseVo; jz?: SampleEnterpriseVo; pl?: SampleEnterpriseVo; fw?: SampleEnterpriseVo }>({})
    const [zhibiao, setZhibiao] = useState(0)
    const [yingshou, setYingshou] = useState(true)
    const [quarter, setQuarter] = useState(2)
    const navigate = useNavigate();

    const getDefaultSettings = async () => {
        // 本页仅支持上半年
        setQuarter(2)
        setSeason('上半年')
    }


    const getEconomyIncome1 = async () => {
        if(area==='全部地区'){
            const data = await primeApi.getEconomyIncome({year:parseInt(year), quarter:quarter})
            console.log(data)
            setGongye(data[0])
            setJianzhu(data[1])
            setPiling(data[2])
            setFuwu(data[3])
            setList(data)
        }else {
            const data = await primeApi.getEconomyIncome({year:parseInt(year), quarter:quarter, region:area})
            console.log(data)
            setGongye(data[0])
            setJianzhu(data[1])
            setPiling(data[2])
            setFuwu(data[3])
            setList(data)
        }

    }

    const getEconomyIncomeCounty = async ()=>{
        const data = await primeApi.getEconomyIncomeCounty({year:parseInt(year), quarter:quarter})
        console.log('getEconomyIncomeCounty',data)
        setList1(data)
    }
    const [state, setState] = useState<PopupPosition>('')
    const getAllSample = async () => {
        if(area==='全部地区') {
            const [data1,data2,data3,data4] = await  primeApi.getSampleEnterprise({year:parseInt(year), quarter:quarter})
            console.log('getAllSample',)
            setGydata({
                gynum:data1,
                jz:data2,
                pl:data3,
                fw:data4
            })
        }else {
            const [data1,data2,data3,data4] = await  primeApi.getSampleEnterprise({year:parseInt(year), quarter:quarter, region:area})
            console.log('getAllSample',)
            setGydata({
                gynum:data1,
                jz:data2,
                pl:data3,
                fw:data4
            })
        }


    }

    const getRevenueRatio  =async ()=>{
        if(area==='全部地区'){
            const data = await primeApi.getRevenueRatio({year:+year,quarter:quarter})
            setTarget(data)
            console.log('getRevenueRatio',data)
        }else {
            const data = await primeApi.getRevenueRatio({year:+year,quarter:quarter,county:area})
            setTarget(data)
            console.log('getRevenueRatio',data)
        }
    }

    const getCurrentDataGrants = async () => {
        const data = await systemApi.getActiveAreaGrants({level:[2,3]})
        console.log('getCurrentDataGrants',data.areas)
        setArea(data.areas[0].name)
        const areaNames: string[] = []
        for (let i=0;i<data.areas.length;i++){
            areaNames.push(data.areas[i].name)
        }
        setAreaList(areaNames)
    };
    useEffect(() => {
        getCurrentDataGrants()
        getDefaultSettings()
    }, []);
    useEffect(() => {
        getEconomyIncome1()
        getEconomyIncomeCounty()
        getAllSample()
        console.log('area',area)
        getRevenueRatio()
    }, [year,season,eco,area,quarter]);

    useEffect(() => {
        if(area!='全部地区'){
            setYingshou(true)
        }
    }, [area]);

    return (
        <div style={{
            height: '100vh',
            fontSize: '0.16rem',
            backgroundColor: '#F0F2F6',
            overflow:'scroll',
            scrollbarWidth: 'none',
        }}>
            <TopBar1 year={year} setYear={setYear} time={true} title={'规上数字经济核心企业'} fixedYear="2025"/>
            <div style={{padding: '0.15rem'}}>
                <div style={{display: 'flex',justifyContent: 'space-between'}}>
                    <div style={{width: '30%'}}><AreaPick area={areaList} year={area} setYear={setArea} fullWidth={true} /></div>
                    <div style={{width: '30%'}}><SeasonPick year={season} setYear={setSeason} setQuarter={setQuarter} fullWidth={true} allowedQuarters={[2]}/></div>
                    <div style={{width: '30%'}}><EconomyPick year={eco} setYear={setEco} fullWidth={true}/></div>
                </div>
                {
                    eco==='经济收入'&&
                    <div>
                        <div style={{marginTop: '0.15rem', padding: '0.15rem', background: 'linear-gradient(180deg,#e7f3ff, #ffffff 17%)'}}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <img src="/img/TopEconomy/left.png" alt=""/>
                                <div style={{
                                    fontWeight: 'bold',
                                    fontSize: '0.18rem',
                                    color: '#333333',
                                    marginLeft: '0.1rem'
                                }}>营收总览（亿元）
                                </div>
                            </div>
                            <div style={{display: 'flex', marginTop: '0.15rem', flexWrap: 'wrap'}}>
                                <div style={{
                                    display: 'flex',
                                    width: '50%',
                                    marginBottom: '0.25rem'
                                }}>
                                    <img src="/img/TopEconomy/1.png" alt=""/>
                                    <div style={{marginLeft: '0.1rem'}}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '0.18rem',
                                            color: '#333333'
                                        }}>{gongye?.revenue?gongye?.revenue:"-"}</div>
                                        <div
                                            style={{fontSize: '0.14rem', color: '#999999', marginTop: '0.05rem'}}>工业
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    width: '50%',
                                    marginBottom: '0.25rem',
                                    display: 'flex',
                                }}>
                                    <img src="/img/TopEconomy/2.png" alt=""/>
                                    <div style={{marginLeft: '0.1rem'}}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '0.18rem',
                                            color: '#333333'
                                        }}>{jianzhu?.revenue?jianzhu?.revenue:"-"}</div>
                                        <div
                                            style={{fontSize: '0.14rem', color: '#999999', marginTop: '0.05rem'}}>建筑业
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    width: '50%',
                                    display: 'flex',
                                    marginBottom: '0.25rem'
                                }}>
                                    <img src="/img/TopEconomy/3.png" alt=""/>
                                    <div style={{marginLeft: '0.1rem'}}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '0.18rem',
                                            color: '#333333'
                                        }}>{piling?.revenue?piling?.revenue:"-"}</div>
                                        <div style={{fontSize: '0.14rem', color: '#999999', marginTop: '0.05rem'}}>批零住餐业
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    width: '50%',
                                    display: 'flex',
                                    marginBottom: '0.25rem'
                                }}>
                                    <img src="/img/TopEconomy/4.png" alt=""/>
                                    <div style={{marginLeft: '0.1rem'}}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '0.18rem',
                                            color: '#333333'
                                        }}>{fuwu?.revenue?fuwu?.revenue:"-"}</div>
                                        <div
                                            style={{fontSize: '0.14rem', color: '#999999', marginTop: '0.05rem'}}>服务业
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            marginTop: '0.15rem',
                            padding: '0.15rem',
                            background: 'linear-gradient(180deg,#e7f3ff, #ffffff 17%)'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
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
                                {
                                    area === '全部地区' && <div style={{
                                        display: 'flex',
                                        fontSize: '0.12rem',
                                        borderRadius: '0.05rem',
                                        border: '1px solid #337cfd',
                                    }}>
                                        <div onClick={() => {
                                            setYingshou(true)
                                        }} style={{
                                            padding: '0.03rem 0.1rem',
                                            backgroundColor: yingshou ? '#337cfd' : '',
                                            color: yingshou ? 'white' : ''
                                        }}>行业
                                        </div>
                                        <div onClick={() => {
                                            setYingshou(false)
                                        }} style={{
                                            padding: '0.03rem 0.1rem',
                                            backgroundColor: yingshou ? '' : '#337cfd',
                                            color: yingshou ? '' : 'white'
                                        }}>市(区)
                                        </div>
                                    </div>
                                }
                            </div>

                            {yingshou && <div style={{display: 'flex', alignItems: 'center'}}>
                                <div style={{width: '50%', height: '2rem'}}>
                                    <TopEconomyChart gongye={gongye?.revenue ? +gongye.revenue : 0}
                                                     fuwu={fuwu?.revenue ? +fuwu.revenue : 0}
                                                     piling={piling?.revenue ? +piling.revenue : 0}
                                                     jianzhu={jianzhu?.revenue ? +jianzhu.revenue : 0}/>
                                </div>
                                <div style={{width: '50%'}}>
                                    {
                                        list.map((item, index) => {
                                            return (
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontSize: '0.12rem',
                                                    marginBottom: '0.1rem'
                                                }}>
                                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                                            <div style={{
                                                                width: '0.1rem',
                                                                height: '0.1rem',
                                                                backgroundColor: index === 0 ? '#5c7bd9' : index === 1 ? '#f0a70a' : index === 2 ? '#9fe080' : index === 3 ? 'red' : index === 4 ? '#ee6666' : '#ee6666',
                                                                marginRight: '0.1rem'
                                                            }}>
                                                            </div>
                                                            <div>{item.name}</div>
                                                        </div>
                                                        <div>{item.rank != null ? Number(item.rank).toFixed(2) + '%' : '-'}</div>
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                </div>}
                            {!yingshou && <div style={{display: 'flex', alignItems: 'center'}}>
                                    <div style={{width: '50%', height: '2rem'}}>
                                        <TopEconomyChart2 list1={list1}/>
                                    </div>
                                    <div style={{width: '50%'}}>
                                        {
                                            list1.map((item, index) => {
                                                return (
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '0.1rem',
                                                        fontSize: '0.12rem',

                                                    }}>
                                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                                            <div style={{
                                                                width: '0.1rem',
                                                                height: '0.1rem',
                                                                backgroundColor: index === 0 ? '#6c7bd9' : index === 1 ? '#9fe080' : index === 2 ? '#ffdc60' : index === 3 ? '#ee6666' : index === 4 ? '#7ed3f4' : index === 5 ?'green':'green',
                                                                marginRight: '0.1rem'
                                                            }}>
                                                            </div>
                                                            <div>{item.region}</div>
                                                        </div>
                                                        <div>{item.rank != null ? Number(item.rank).toFixed(2) + '%' : '-'}</div>
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                </div>}
                            <div style={{
                                marginTop: '0.15rem',
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between'
                            }}>

                                {
                                    yingshou&&list.map((item) => {
                                        return (
                                            <div style={{
                                                width: '45%',
                                                marginBottom: '0.15rem',
                                                background: '#f4f9ff',
                                                padding: '0.15rem'
                                            }}>
                                                <div
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: '0.14rem',
                                                        marginBottom: '0.15rem'
                                                    }}>{item.name}
                                                </div>
                                                <div>
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <div style={{color: '#999', fontSize: '0.14rem'}}>同比</div>
                                                        <div style={{display: 'flex'}}>
                                                            <div style={{
                                                                marginBottom: '0.05rem',
                                                                fontSize: '0.16rem',
                                                                fontWeight: 'bolder',
                                                                color: item?.tb != null ? (Number(item.tb) > 0 ? 'red' : 'green') : 'grey'
                                                            }}>
                                                                {item?.tb != null ? String(item.tb) + '%' : '-'}
                                                            </div>
                                                            {item?.tb != null ? ((Number(item.tb) > 0 ?
                                                                <img src="/img/TopEconomy/up.png" alt=""/> :
                                                                <img src="/img/TopEconomy/gup.png" alt=""/>)) : ''}
                                                        </div>
                                                    </div>
                                                    {/*<div style={{marginTop: '0.1rem', display: 'flex', justifyContent: 'space-between'}}>*/}
                                                    {/*    <div style={{color: '#999', fontSize: '0.14rem'}}>环比</div>*/}
                                                    {/*    <div style={{display: 'flex'}}>*/}
                                                    {/*        <div style={{*/}
                                                    {/*            marginBottom: '0.05rem',*/}
                                                    {/*            fontSize: '0.16rem',*/}
                                                    {/*            fontWeight: 'bolder',*/}
                                                    {/*            color: item?.hb ? (parseFloat(item?.hb) > 0 ? 'red' : 'green') : 'grey'*/}
                                                    {/*        }}>*/}
                                                    {/*            {item?.hb ? item.hb + '%' : '-'}*/}

                                                    {/*        </div>*/}

                                                    {/*        {item?.hb ? ((parseFloat(item?.hb) > 0 ?*/}
                                                    {/*            <img src="/img/TopEconomy/up.png" alt=""/> :*/}
                                                    {/*            <img src="/img/TopEconomy/gup.png" alt=""/>)) : ''}*/}

                                                    {/*    </div>*/}
                                                    {/*</div>*/}

                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    !yingshou&&list1.map((item) => {
                                        return (
                                            <div style={{
                                                width: '45%',
                                                marginBottom: '0.15rem',
                                                background: '#f4f9ff',
                                                padding: '0.15rem'
                                            }}>
                                                <div
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: '0.14rem',
                                                        marginBottom: '0.15rem'
                                                    }}>{item.region}
                                                </div>
                                                <div>
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <div style={{color: '#999', fontSize: '0.14rem'}}>同比</div>
                                                        <div style={{display: 'flex'}}>
                                                            <div style={{
                                                                marginBottom: '0.05rem',
                                                                fontSize: '0.16rem',
                                                                fontWeight: 'bolder',
                                                                color: item?.tb != null ? (Number(item.tb) > 0 ? 'red' : 'green') : 'grey'
                                                            }}>
                                                                {item?.tb != null ? String(item.tb) + '%' : '-'}
                                                            </div>
                                                            {item?.tb != null ? ((Number(item.tb) > 0 ?
                                                                <img src="/img/TopEconomy/up.png" alt=""/> :
                                                                <img src="/img/TopEconomy/gup.png" alt=""/>)) : ''}
                                                        </div>
                                                    </div>
                                                    {/*<div style={{*/}
                                                    {/*    marginTop: '0.1rem',*/}
                                                    {/*    display: 'flex',*/}
                                                    {/*    justifyContent: 'space-between'*/}
                                                    {/*}}>*/}
                                                    {/*    <div style={{color: '#999', fontSize: '0.14rem'}}>环比</div>*/}
                                                    {/*    <div style={{display: 'flex'}}>*/}
                                                    {/*        <div style={{*/}
                                                    {/*            marginBottom: '0.05rem',*/}
                                                    {/*            fontSize: '0.16rem',*/}
                                                    {/*            fontWeight: 'bolder',*/}
                                                    {/*            color: item?.hb ? (parseFloat(item?.hb) > 0 ? 'red' : 'green') : 'grey'*/}
                                                    {/*        }}>*/}
                                                    {/*            {item?.hb ? item.hb + '%' : '-'}*/}

                                                    {/*        </div>*/}

                                                    {/*        {item?.hb ? ((parseFloat(item?.hb) > 0 ?*/}
                                                    {/*            <img src="/img/TopEconomy/up.png" alt=""/> :*/}
                                                    {/*            <img src="/img/TopEconomy/gup.png" alt=""/>)) : ''}*/}

                                                    {/*    </div>*/}
                                                    {/*</div>*/}

                                                </div>
                                            </div>
                                        )
                                    })
                                }


                            </div>
                        </div>
                        <div style={{
                            marginTop: '0.15rem',
                            padding: '0.15rem',
                            background: 'linear-gradient(180deg,#e7f3ff, #ffffff 17%)'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <img src="/img/TopEconomy/left.png" alt=""/>
                                    <div style={{
                                        fontWeight: 'bold',
                                        fontSize: '0.18rem',
                                        color: '#333333',
                                        marginLeft: '0.1rem'
                                    }}>考核指标
                                    </div>

                                </div>
                                <div style={{
                                    display: 'flex',
                                    fontSize: '0.12rem',
                                    borderRadius: '0.05rem',
                                    border: '1px solid #337cfd',
                                }}>
                                    <div onClick={() => {
                                        setZhibiao(0)
                                    }} style={{
                                        padding: '0.03rem 0.1rem',
                                        backgroundColor: zhibiao===0 ? '#337cfd' : '',
                                        color: zhibiao===0 ? 'white' : ''
                                    }}>占比
                                    </div>
                                    <div onClick={() => {
                                        setZhibiao(1)
                                    }} style={{
                                        padding: '0.03rem 0.1rem',
                                        backgroundColor: zhibiao===1 ? '#337cfd' : '',
                                        color: zhibiao===1 ? 'white' : ''
                                    }}>完成率
                                    </div>
                                    <div onClick={() => {
                                        setZhibiao(2)
                                    }} style={{
                                        padding: '0.03rem 0.1rem',
                                        backgroundColor: zhibiao===2 ? '#337cfd' : '',
                                        color: zhibiao===2 ? 'white' : ''
                                    }}>开票
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                width: '100%'
                            }}>
                                {
                                    zhibiao===0&&  target?.map((item, index) => {
                                        return <div key={index} style={{
                                            // display: 'flex',
                                            // justifyContent: 'space-between',
                                            // alignItems: 'center',
                                            marginTop: '0.15rem',
                                            padding: '0.1rem 0.15rem',
                                            width: '45%'
                                        }}>
                                            <div style={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{
                                                    fontSize: '0.16rem',
                                                    fontWeight: 'bolder',
                                                    width: '75%',
                                                    color: '#333'
                                                }}>{item.area}</div>
                                                <div style={{width: '25%', height: '0.35rem', marginRight: '-0.06rem'}}>
                                                      <img src="/img/TopEconomy/tar2.png" alt=""/>
                                                </div>
                                            </div>
                                            <div style={{
                                                marginTop: '0.1rem',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{
                                                    width:  '75%',
                                                    fontSize: '0.14rem',
                                                    fontWeight: 'bold',
                                                    color: '#999'
                                                }}>营收占比
                                                </div>
                                                <div style={{
                                                    width:  '25%',
                                                    fontSize: '0.14rem',
                                                    color:'#359AFE',
                                                    fontWeight: 'bolder'
                                                }}>
                                                    {item?.ratio? item.ratio + '%' : '-'}
                                                </div>
                                            </div>
                                        </div>
                                    })
                                }
                                {
                                    zhibiao===1&&  target?.map((item, index) => {
                                        return <div key={index} style={{
                                            marginTop: '0.15rem',
                                            padding: '0.1rem 0.15rem',
                                            width: '45%'
                                        }}>
                                            <div style={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{
                                                    fontSize: '0.16rem',
                                                    width: '75%',
                                                    fontWeight: 'bolder',
                                                    color: '#333'
                                                }}>{item.area}</div>
                                                <div style={{height: '0.35rem',width: '25%', marginRight: '-0.06rem'}}>
                                                    {
                                                        ((item.revenueRatio ?? 0) < 80) && <img  src="/img/TopEconomy/tar1.png" alt=""/>
                                                    }
                                                    {
                                                        ((item.revenueRatio ?? 0) >= 80) && <img src="/img/TopEconomy/tar2.png" alt=""/>
                                                    }
                                                </div>
                                            </div>
                                            <div style={{
                                                marginTop: '0.1rem',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{
                                                    fontSize: '0.14rem',
                                                    fontWeight: 'bold',
                                                    color: '#999',
                                                    width: '75%'
                                                }}>营收额完成率
                                                </div>
                                                <div style={{
                                                    fontSize: '0.14rem',
                                                    color: (item.revenueRatio ?? 0) < 80 ? '#FF4747' : '#359AFE',
                                                    width: '25%',
                                                    fontWeight: 'bolder'
                                                }}>
                                                    {item?.revenueRatio != null ? item.revenueRatio + '%' : '-'}
                                                </div>
                                            </div>
                                        </div>
                                    })
                                }
                                {
                                    zhibiao===2&&  target?.map((item, index) => {
                                        return <div onClick={() => {
                                            navigate(`/invoice?area=${item.area}`)
                                        }} key={index} style={{
                                            marginTop: '0.15rem',
                                            padding: '0.1rem 0.15rem',
                                            width: '35%',
                                            border: '2px solid #E5E5E5',
                                            borderRadius: '0.05rem'
                                        }}>
                                            <div style={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{
                                                    fontSize: '0.16rem',
                                                    width: '100%',
                                                    fontWeight: 'bolder',
                                                    color: '#333'
                                                }}>{item.area}</div>

                                            </div>
                                            <div style={{
                                                marginTop: '0.1rem',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{
                                                    fontSize: '0.14rem',
                                                    fontWeight: 'bold',
                                                    color: '#999',
                                                    width: '100%'
                                                }}>企业开票区间表
                                                </div>

                                            </div>
                                        </div>
                                    })
                                }
                                <Alert
                                    onClick={() => {
                                        console.log('点击了')
                                        setState('top')
                                    }}
                                    banner
                                    message={
                                        <Marquee pauseOnHover gradient={false}>
                                            {sjrdata}
                                        </Marquee>
                                    }
                                />
                                <Popup visible={state === 'top'} position='top' onClose={() => setState('')}>
                                    <div style={{
                                        padding: '10px 20px',
                                        fontSize: '0.14rem',
                                        // height:'200px',
                                        // width:'200px',
                                        overflow: 'scroll',
                                        scrollbarWidth: 'none',
                                        lineHeight: '0.2rem',
                                    }}>
                                        <div style={{color: 'red'}}><InfoCircleOutlined/> 数字经济处分析：</div>
                                        <div style={{textIndent: '2em'}}>
                                            <p>{sjrdata}</p>
                                        </div>
                                    </div>
                                </Popup>
                                {
                                    zhibiao !== 2 && (
                                        !zhibiao ? <div style={{width: '100%', padding: '0.1rem 0.15rem'}}>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <InfoCircleOutlined style={{
                                                    color: '#359AFE',
                                                    marginRight: '0.1rem'
                                                }}/>
                                                <div>数字经济营收占比</div>
                                            </div>
                                            <div style={{
                                                marginTop: '0.05rem',
                                                color: '#999',
                                                fontSize: '0.12rem'
                                            }}>
                                                计算方式：规模以上数字经济核心产业企业营业收入与规模以上企业营业收入的比值。
                                            </div>
                                        </div> : <div style={{width: '100%', padding: '0.1rem 0.15rem'}}>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <InfoCircleOutlined style={{
                                                    color: '#359AFE',
                                                    marginRight: '0.1rem'
                                                }}/>
                                                <div>数字经济营收额完成率</div>
                                            </div>
                                            <div style={{
                                                marginTop: '0.05rem',
                                                color: '#999',
                                                fontSize: '0.12rem'
                                            }}>
                                                计算方式：规模以上数字经济核心产业企业实际营业收入于预期营业收入额的比值。
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                }
                {
                    eco === '样本企业' &&
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
                                }}>企业总览
                                </div>
                            </div>
                            <div style={{display: 'flex', marginTop: '0.15rem', flexWrap: 'wrap'}}>
                                <div style={{
                                    display: 'flex',
                                    width: '50%',
                                    marginBottom: '0.25rem'
                                }}>
                                    <img src="/img/TopEconomy/1.png" alt=""/>
                                    <div style={{marginLeft: '0.1rem'}}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '0.18rem',
                                            color: '#333333'
                                        }}>{Gydata.gynum?.sampleUnit}</div>
                                        <div
                                            style={{fontSize: '0.14rem', color: '#999999', marginTop: '0.05rem'}}>工业
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    width: '50%',
                                    marginBottom: '0.25rem',
                                    display: 'flex',
                                }}>
                                    <img src="/img/TopEconomy/2.png" alt=""/>
                                    <div style={{marginLeft: '0.1rem'}}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '0.18rem',
                                            color: '#333333'
                                        }}>{Gydata.jz?.sampleUnit}</div>
                                        <div
                                            style={{fontSize: '0.14rem', color: '#999999', marginTop: '0.05rem'}}>建筑业
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    width: '50%',
                                    display: 'flex',
                                    marginBottom: '0.25rem'
                                }}>
                                    <img src="/img/TopEconomy/3.png" alt=""/>
                                    <div style={{marginLeft: '0.1rem'}}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '0.18rem',
                                            color: '#333333'
                                        }}>{Gydata.pl?.sampleUnit}</div>
                                        <div style={{fontSize: '0.14rem', color: '#999999', marginTop: '0.05rem'}}>批零住餐业
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    width: '50%',
                                    display: 'flex',
                                    marginBottom: '0.25rem'
                                }}>
                                    <img src="/img/TopEconomy/4.png" alt=""/>
                                    <div style={{marginLeft: '0.1rem'}}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '0.18rem',
                                            color: '#333333'
                                        }}>{Gydata.fw?.sampleUnit}</div>
                                        <div
                                            style={{fontSize: '0.14rem', color: '#999999', marginTop: '0.05rem'}}>服务业
                                        </div>
                                    </div>
                                </div>
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
                                }}>企业情况
                                </div>
                            </div>

                            <TopEconomyChart1 gyNum={Gydata.gynum} jzNum={Gydata.jz} plNum={Gydata.pl} fwNum={Gydata.fw} />
                        </div>
                    </div>
                }

            </div>


        </div>
    )
}
