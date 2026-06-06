import TopBar from "../../components/TopBar/TopBar.tsx";
import {useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {primeApi} from "../../api.ts";
import {Circle, Picker, Popup, PopupPosition} from "react-vant";
import {Progress} from "antd";
import * as echarts from "echarts";

function GlobalProjectChart1(e:{data1}) {
    const {data1} = e
    const dataList = data1.reverse();
    // console.log('GlobalProjectChart1',data)
    const list1 = dataList?.map(item => item.cumulativeAbsoluteAmount)
    const list2 = dataList?.map(item => item.cumulativeGrowthRate)
    const list3 = dataList?.map(item => item.year+(item.quarter?'-':'')+(item.quarter?item.quarter:''))
    const list4 = dataList?.map(item => item.endOfPeriodValue)
    // const list1 = [1,2,3,4,5,6,7,8,9,10,11,12]
    // const list2 = [1,2,3,4,5,6,7,8,9,10,11,12]
    const chartRef = useRef(null);
    useEffect(() => {
        const colors = ['#d3dffc', '#427efc'];
        const chart = echarts.init(chartRef.current);
        const option = {
            color: colors,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
                right: '12%',
                left: '12%'
            },
            toolbox: {
                feature: {
                    // dataView: { show: true, readOnly: false },
                    // restore: { show: true },
                    // saveAsImage: { show: true }
                }
            },
            // legend: {
            //   data: ['项目投资总额']
            // },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        interval: 0,  // 强制显示所有标签
                        rotate: 30,   // 标签旋转防重叠
                        fontSize: 10  // 调小字体
                    },
                    data: list3
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '累计增幅(%)',
                    position: 'left',
                    alignTicks: true,
                    axisLine: {
                        show: false,
                        lineStyle: {
                        }
                    },
                    axisLabel: {
                        formatter: function (value){
                            return value
                        }
                    }
                },
                {
                    type: 'value',
                    name: data1[0]?.cumulativeAbsoluteAmount!=null?`累计绝对额`:data1[0]?.endOfPeriodValue?'期末':'累计绝对额',
                    position: 'none',
                    alignTicks: true,
                    axisLine: {
                        show: false,
                        lineStyle: {
                            // color: colors[0]
                        }
                    },
                    axisLabel: {
                        formatter: '{value} '
                    }
                }
            ],
            series: [
                {
                    name: '累计增幅(%)',
                    type: 'bar',
                    data: list2
                },
                {
                    name:data1[0]?.cumulativeAbsoluteAmount!=null?`累计绝对额${data1[0]?.unit}`:data1[0]?.endOfPeriodValue !=null?`期末${data1[0]?.unit}`:`累计绝对额`,
                    type: 'line',
                    yAxisIndex: 1,
                    data: data1[0]?.cumulativeAbsoluteAmount?list1:list4
                },
            ]
        };
        chart.setOption(option);
        return () => chart.dispose();
    }, [JSON.stringify(e)]);

    return (
        <div ref={chartRef} style={{padding: '0.01rem',boxSizing:'border-box',width: '100%', height: '280px',backgroundColor:'#fff',borderRadius:'0.07rem', marginTop: '0.2rem'}}>

        </div>
    );
}

export default function RegionalGDPDetail(){
    const [searchParams] = useSearchParams();
    const [state, setState] = useState<PopupPosition>('')
    const onClose = () => setState('')
    const [title,_] = useState(searchParams.get('title')!)
    const [subTitle, setSubTitle] = useState('')
    const [subList, setSubList] = useState([])
    const [list, setList] = useState([])
    const [list1, setList1] = useState([])
    useEffect(() => {
        primeApi.listDigitalTaizhou1({
            category:title,
        }).then(res=>{
            console.log(res)
            let data = res.map((item:any)=>{
                return {
                    value:item,
                    text:item
                }
            })
            setSubTitle(res[0])
            console.log('listDigitalTaizhou1',data)
            setSubList(data)

            primeApi.listDigitalTaizhou({
                category:title,
                subcategory:res[0],
            }).then(res=>{
                setList(res)
                setList1(res.slice(0,5))
            })
        })
    }, []);

    useEffect(() => {
        if(subTitle===''){
            return
        }
        primeApi.listDigitalTaizhou1({
            category:title,
            page:1,
        }).then(res=>{
            console.log(res)
            let data = res.map((item:any)=>{
                return {
                    value:item,
                    text:item
                }
            })
            // setSubTitle(data)
            console.log('listDigitalTaizhou1',data)
            setSubList(data)

            primeApi.listDigitalTaizhou({
                category:title,
                subcategory:subTitle,
                page:1,
            }).then(res=>{
                console.log('listDigitalTaizhou',res)
                setList(res)
                setList1(res.slice(0,5))
            })
        })
    }, [subTitle]);
    return (
        <div style={{
            width: '100%',
            height:'100vh',
            fontSize:'0.18rem',
            backgroundColor:'#f0f2f6',
            overflowY:'scroll',
            scrollbarWidth:'none',
        }}>
            <TopBar title={title} time={false}/>
            <div style={{
                width: '100%',
                padding:'0.2rem',
                boxSizing:'border-box',
            }}>
                <div>
                    <div onClick={() => setState('bottom')} style={{
                        width: '50%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '0.36rem',
                        // width: '1rem',
                        borderRadius: '0.05rem',
                        color: '#666',
                        padding: '0 0.1rem',
                        backgroundColor: '#fff',
                    }}>
                        <div style={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                        }}>{subTitle}</div>
                        <img style={{
                            width: '0.15rem',
                        }} src="/img/downb.png" alt=""/>
                    </div>
                    <Popup
                        visible={state === 'bottom'}
                        style={{height: '30%'}}
                        position='bottom'
                        onClose={onClose}
                    >
                        <Picker
                            defaultIndex={0}
                            columns={subList}
                            onChange={(val: string, selectRow, index: number) => {
                                console.log('选中项: ', selectRow)
                            }}
                            onCancel={onClose}
                            onConfirm={(val: string, selectRow, index: number) => {
                                setSubTitle(selectRow.text)
                                localStorage.setItem('year', selectRow.text)
                                onClose()
                            }}
                        />
                    </Popup>
                </div>
                <div>
                    <GlobalProjectChart1 data1={list1} />

                </div>
                {
                    list?.map((item:any,index:number) => {
                        return(
                            <div style={{
                                marginTop: '0.1rem',
                            }}>
                                <div style={{
                                    padding: '0.07rem 0.16rem',
                                    fontSize:  '0.16rem',
                                    fontWeight: 'bold',
                                    color: '#337CFD',
                                    background: 'linear-gradient(90deg,rgba(51,124,253,0.20), rgba(51,124,253,0.00))'
                                }}>
                                    {item.year} {item.quarter}
                                </div>
                                <div style={{
                                    padding: '0.15rem',
                                    backgroundColor: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                    {
                                        item.cumulativeAbsoluteAmount && <div style={{width: '50%'}}>
                                            <div style={{color: '#999999'}}>累计绝对额{item.unit ? item.unit : ''}</div>
                                            <div style={{
                                                marginTop: '0.1rem',
                                                fontSize: '0.15rem',
                                                fontWeight: 'bold'
                                            }}>{item.cumulativeAbsoluteAmount ? item.cumulativeAbsoluteAmount : '无'}</div>
                                        </div>
                                    }

                                    {
                                        item.endOfPeriodValue && <div style={{width: '50%'}}>
                                            <div style={{color: '#999999'}}>期末{item.unit ? item.unit : ''}</div>
                                            <div style={{
                                                marginTop: '0.1rem',
                                                fontSize: '0.15rem',
                                                fontWeight: 'bold'
                                            }}>{item.endOfPeriodValue ? item.endOfPeriodValue : '无'}</div>
                                        </div>
                                    }

                                    {
                                       ( !item.cumulativeAbsoluteAmount&&! item.endOfPeriodValue ) && <div style={{width: '50%'}}>
                                            <div style={{color: '#999999'}}>累计绝对额{item.unit ? item.unit : ''}</div>
                                            <div style={{
                                                marginTop: '0.1rem',
                                                fontSize: '0.15rem',
                                                fontWeight: 'bold'
                                            }}>{item.cumulativeAbsoluteAmount ? item.cumulativeAbsoluteAmount : '无'}</div>
                                        </div>
                                    }
                                    <div style={{width: '30%'}}>

                                        <div style={{color: '#999999'}}>累计增幅</div>
                                        <div style={{
                                            marginTop: '0.1rem',
                                            fontSize: '0.15rem',
                                            fontWeight: 'bold'
                                        }}>{item.cumulativeGrowthRate}</div>
                                    </div>
                                    <div style={{width: '20%'}}>
                                        {
                                            item.cumulativeGrowthRate>=0&&<Progress type="circle" percent={item.cumulativeGrowthRate} size={60}/>
                                        }
                                        {
                                            item.cumulativeGrowthRate<0&&<Progress type="circle" percent={Math.abs(item.cumulativeGrowthRate)} strokeColor="red"  size={60}/>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}
