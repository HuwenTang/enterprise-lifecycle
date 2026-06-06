import TopBar1 from "../../components/TopBar/TopBar1.tsx";
import {useEffect, useRef, useState} from "react";
import {primeApi, systemApi} from "../../api.ts";
import {EconomyIncomeVo, ProjectAreaVo, ProjectInvestmentVo} from "../../apis";
import * as echarts from "echarts";

import {useNavigate, useSearchParams} from "react-router-dom";
import {Button} from "antd";
import CityPick from "../../components/YearPick/economy/CityPick.tsx";

const TopEconomyChart2 = (e:{list1:ProjectInvestmentVo[]}) => {
    const {list1} = e
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return
        const list = (list1 ?? []).map((item:ProjectInvestmentVo) => ({
            value: item.ratio,
            name: item.area
        }))
        const chart = echarts.init(chartRef.current);
        const option = {
            series: [{
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
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
                        fontWeight: 'bold',
                        formatter: `{b}\n {c}% `
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
    }, [list1]);
    return (
        <div
            ref={chartRef}
            style={{ width: '100%', height: '200px' }}
        />
    );
};

const TopEconomyChart1 = (e:{ invlist?:number[], invlist1?:number[],invlist2?:number[]}) => {
    const chartRef = useRef(null);
    const { invlist, invlist1} = e
    useEffect(() => {
        if (!chartRef.current) return
        const chart = echarts.init(chartRef.current);
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: {
                data: ['计划总投资','实际总投资']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['内资', '外资'],
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
                    name: '计划总投资',
                    type: 'bar',
                    data: invlist ?? [],
                    barWidth: '20%',
                    itemStyle: {
                        color: "#f70909"
                    }
                },{
                    name: '实际总投资',
                    type: 'bar',
                    barWidth: '20%',
                    barGap: 0,
                    data: invlist1 ?? [],
                    itemStyle: {
                        color: "#406efc"
                    }
                },
            ]
        };

        chart.setOption(option);

        return () => chart.dispose();
    }, [invlist, invlist1]);
    return <div ref={chartRef} style={{ width: '100%', height: '300px',marginTop:'20px' }} />;
};
export default function MainProject2() {
    const [year, setYear] = useState('2024')
    const [city, setCity] = useState<string>('泰州市')
    const [season] = useState('第一季度')
    const [area] = useState('')
    const [eco] = useState('经济收入')
    const [, setGongye] = useState<EconomyIncomeVo>()
    const [, setJianzhu] = useState<EconomyIncomeVo>()
    const [, setPiling] = useState<EconomyIncomeVo>()
    const [, setFuwu] = useState<EconomyIncomeVo>()
    const [, setList] = useState<EconomyIncomeVo[]>([])
    const [list1, setList1] = useState<ProjectInvestmentVo[]>([])
    const [list2, setList2] = useState<ProjectAreaVo[]>([])
    const [Gydata, setGydata] = useState<Record<string, unknown>>({})
    const [searchParams] = useSearchParams();
    const name  = searchParams.get('name')
    const [, setPlace] = useState('')
    const [, setIsCity] = useState<boolean>()
    void list2
    void Gydata
    void setList2
    void setGydata

    const navigate = useNavigate()
    const [invlist, setInvlist] = useState<number[]>()
    const [invlist1, setInvlist1] = useState<number[]>()
    const [invlist2, setInvlist2] = useState<number[]>()

    const getIsCity = async () => {
        const res = await systemApi.getIsCity()
        console.log('res',res.value)
        setIsCity(res.value)
    }

    const getEconomyIncome1 = async () => {
        let quarter = 0
        if (season==='第一季度'){
            quarter = 1
        }else if (season==='第二季度'){
            quarter = 2
        }else if (season==='第三季度'){
            quarter = 3
        }else if (season==='第四季度'){
            quarter = 4
        }

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
        let quarter = 0
        if (season==='第一季度'){
            quarter = 1
        }else if (season==='第二季度'){
            quarter = 2
        }else if (season==='第三季度'){
            quarter = 3
        }else if (season==='第四季度'){
            quarter = 4
        }
        const data = await primeApi.getEconomyIncomeCounty({year:parseInt(year), quarter:quarter})
        console.log('getEconomyIncomeCounty',data)

        // setList1(data)
    }

    const statics = async () => {
            const data = await primeApi.statics1({year:parseInt(year)})
            setList1(data)
    }
    const investStatics = async () => {
        try {
            const data = await primeApi.investStatics1({year:parseInt(year),area:city})
            setInvlist([data?.planDomesticInvest ?? 0, data?.planForeignInvest ?? 0])
            setInvlist1([data?.actualDomesticInvest ?? 0, data?.actualForeignInvest ?? 0])
            setInvlist2([data?.domesticInvestRatio ?? 0, data?.foreignInvestRatio ?? 0])
        } catch {
            setInvlist([])
            setInvlist1([])
            setInvlist2([])
        }
    }

    useEffect(() => {
        if(name==='市重点项目'){
           setPlace('市')
        }else if(name==='省重点项目'){
            setPlace('省')
        }
    }, [name]);
    useEffect(() => {
        getEconomyIncome1()
        getEconomyIncomeCounty()
        investStatics()
        statics()
        getIsCity()
        // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅随筛选条件重新请求
    }, [year, season, eco, area, city]);


    return (
        <div style={{
            height: '100vh',
            fontSize: '0.16rem',
            backgroundColor: '#F0F2F6',
            overflow:'scroll',
            scrollbarWidth: 'none',
        }}>
            <TopBar1 year={year} setYear={setYear} time={true} title={name?name:'重点项目'}/>
            <div style={{padding: '0.15rem'}}>
                    <div>
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
                                    }}>项目总数
                                    </div>
                                </div>
                                 <Button onClick={() => {
                                        navigate(`/invest-project3?&year=${year}`)
                                    }}>项目列表</Button>
                            </div>

                             <div style={{display: 'flex', alignItems: 'center'}}>
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
                                                        <div>{item.area}</div>
                                                    </div>
                                                    <div>{item.areaTotal?item.areaTotal:'-'}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div style={{
                            marginTop: '0.15rem',
                            padding: '0.15rem',
                            background: 'linear-gradient(180deg,#e7f3ff, #ffffff 17%)'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center',justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <img src="/img/TopEconomy/left.png" alt=""/>
                                    <div style={{
                                        fontWeight: 'bold',
                                        fontSize: '0.18rem',
                                        color: '#333333',
                                        marginLeft: '0.1rem'
                                    }}>投资情况（亿元）
                                    </div>
                                </div>
                                <CityPick year={city} setYear={setCity} />
                            </div>

                            <TopEconomyChart1 invlist={invlist} invlist1={invlist1} invlist2={invlist2}/>

                            <div style={{fontSize: '0.14rem'}}>
                            <div style={{marginLeft: '0.25rem', width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <div style={{backgroundColor: '#f70909',width: '0.2rem',height: '0.2rem'}}></div>
                                    <div>内资投资完成率</div>
                                    <div>{invlist2?invlist2[0]:0}%</div>
                                </div>
                                <div style={{
                                    marginTop: '0.1rem',
                                    marginLeft: '0.25rem',
                                    width: '80%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{backgroundColor: '#406efc', width: '0.2rem', height: '0.2rem'}}></div>
                                    <div>外资投资完成率</div>
                                    <div>{invlist2?.[1] != null ? Number(invlist2[1]).toFixed(2) : 0}%</div>
                                </div>
                            </div>
                        </div>
                    </div>

            </div>


        </div>
    )
}
