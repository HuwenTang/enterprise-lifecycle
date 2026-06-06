import TopBar1 from "../../components/TopBar/TopBar1.tsx";
import {useEffect, useRef, useState} from "react";
import {primeApi, systemApi} from "../../api.ts";
import {EconomyIncomeVo, ProjectAreaVo, ProjectInvestmentVo} from "../../apis";
import * as echarts from "echarts";

import {useNavigate, useSearchParams} from "react-router-dom";
import {Button} from "antd";

const TopEconomyChart2 = (e:{list1:ProjectInvestmentVo[]}) => {
    const {list1} = e
    const list = list1.map((item:ProjectInvestmentVo) => {
        return {
            value: item.ratio,
            name: item.area
        }
    })
    console.log('TopEconomyChart2',list)
    const chartRef = useRef(null);

    useEffect(() => {
        console.log('TopEconomyChart2',JSON.stringify(e))
        const chart = echarts.init(chartRef.current);
        const option = {
            series: [{
                type: 'pie',
                radius: ['50%', '70%'],
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
    }, [JSON.stringify(e)]);
    return (
        <div
            ref={chartRef}
            style={{ width: '100%', height: '200px' }}
        />
    );
};

const TopEconomyChart1 = (e:{ invlist?:number[], invlist1?:number[]}) => {
    const chartRef = useRef(null);
    const { invlist, invlist1} = e
    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        console.log('TopEconomyChart1',JSON.stringify(e))
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
                data: ['海陵区', '高新区', '靖江市','泰兴市','兴化市','姜堰区'],
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
                    data:invlist,
                    itemStyle: {
                        color: "#406efc"
                    }
                },{
                    name: '实际总投资',
                    type: 'bar',
                    barGap: 0,
                    data: invlist1,
                    itemStyle: {
                        color: "#f70909"
                    }
                },
            ]
        };

        chart.setOption(option);

        return () => chart.dispose();
    }, [JSON.stringify(e)]);
    return <div ref={chartRef} style={{ width: '100%', height: '300px',marginTop:'20px' }} />;
};
export default function MainProject() {
    const [year, setYear] = useState('2024')
    const [season, setSeason] = useState('第一季度')
    const [area, setArea] = useState('')
    const [eco, setEco] = useState('经济收入')
    const [gongye, setGongye] = useState<EconomyIncomeVo>()
    const [jianzhu, setJianzhu] = useState<EconomyIncomeVo>()
    const [piling, setPiling] = useState<EconomyIncomeVo>()
    const [fuwu, setFuwu]= useState<EconomyIncomeVo>()
    const [list, setList] = useState([])
    const [list1, setList1] = useState<ProjectInvestmentVo[]>([])
    const [list2, setList2] = useState<ProjectAreaVo[]>([])
    const [Gydata, setGydata] = useState({})
    const [searchParams] = useSearchParams();
    const name  = searchParams.get('name')
    const [place, setPlace] = useState('')
    const [isCity, setIsCity] = useState<boolean>()
    const id = localStorage.getItem('userid')
    const getIsCity = async () => {
        const res = await systemApi.getIsCity()
        console.log('res',res.value)
        setIsCity(res.value)
    }

    const navigate = useNavigate()
    const [invlist, setInvlist] = useState<number[]>()
    const [invlist1, setInvlist1] = useState<number[]>()


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
        if(name==='市重点项目'){
            const data = await primeApi.statics({year:parseInt(year), level:'市'})
            setList1(data)

        }else if(name==='省重点项目'){
            const data = await primeApi.statics({year:parseInt(year), level:'省'})
            setList1(data)

        }
    }
    const investStatics = async () => {
        if(name==='市重点项目'){
            const data = await primeApi.investStatics({year:parseInt(year), level:'市'})
            setList2(data)
            let list = []
            for (let i = 0; i < data.length; i++) {
                list.push(data[i].planDomesticInvest)
            }
            setInvlist(list)

            let list1 = []
            for (let i = 0; i < data.length; i++) {
                list1.push(data[i].actualDomesticInvest)
            }
            setInvlist1(list1)

        }else if(name==='省重点项目'){
            const data = await primeApi.investStatics({year:parseInt(year), level:'省'})
            setList2(data)
            let list = []
            for (let i = 0; i < data.length; i++) {
                list.push(data[i].planDomesticInvest)
            }
            setInvlist(list)

            let list1 = []
            for (let i = 0; i < data.length; i++) {
                list1.push(data[i].actualDomesticInvest)
            }
            setInvlist1(list1)
        }
    }

    useEffect(() => {
        if(name==='市重点项目'){
           setPlace('市')
        }else if(name==='省重点项目'){
            setPlace('省')
        }
        getIsCity()
    }, []);
    useEffect(() => {
        getEconomyIncome1()
        getEconomyIncomeCounty()
        investStatics()
        statics()
    }, [year,season,eco,area]);


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
                                    navigate(`/invest-project2?place=${place}&year=${year}`)
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

                            <TopEconomyChart1 invlist={invlist} invlist1={invlist1} />
                        </div>
                    </div>

            </div>


        </div>
    )
}
