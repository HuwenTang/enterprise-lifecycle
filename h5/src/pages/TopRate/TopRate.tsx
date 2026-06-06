import TopBar1 from "../../components/TopBar/TopBar1.tsx";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {primeApi} from "../../api.ts";
import {CheckRankBo} from "../../apis";
import {useNavigate} from "react-router-dom";

export default function TopRate() {
    const [year,setYear] = useState(dayjs().get('year'))
    const [list, setList] = useState<CheckRankBo[]>()
    const [yingshou, setYingshou] = useState(true)
    const navigate = useNavigate()
    const getRank =async ()=>{
        if(yingshou){
            const data = await primeApi.getDeptRanking({year:year})
            console.log(data)
            setList(data)
        }else {
            const data = await primeApi.getCompanyRanking({year:year})
            console.log(data)
            setList(data)
        }

    }
    useEffect(() => {
        getRank()
    }, [year,yingshou]);
    return (
        <div style={{
            width:'100%',
            height:'100vh',
            overflow:'scroll',
            scrollbarWidth:'none',
            fontSize:'0.16rem',
            backgroundColor:'#f0f2f6'
        }}>
            <TopBar1 title={'涉企检查'} time={true} year={year+''} setYear={setYear}  />
            <div style={{
                width: '100%',
                height: '2.05rem',
                paddingTop: '0.45rem',
                paddingLeft: '0.3rem',
                paddingRight: '0.3rem',
                boxSizing: 'border-box',
                backgroundImage: 'url(/img/toprate/bc.png)',
                backgroundSize: '100% 100%',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.20rem',
                fontWeight: 'bolder',
                color: '#fff'
            }}>
                <div>
                    {year}年度监管排名
                </div>
                <div style={{
                    height: '0.2rem',
                    display: 'flex',
                    fontSize: '0.12rem',
                    borderRadius: '0.05rem',
                    border: '1px solid #999',
                }}>
                    <div onClick={() => {
                        setYingshou(true)
                    }} style={{
                        padding: '0.03rem 0.1rem',
                        backgroundColor: yingshou ? '#999' : '',
                        color: yingshou ? 'white' : ''
                    }}>部门
                    </div>
                    <div onClick={() => {
                        setYingshou(false)
                    }} style={{
                        padding: '0.03rem 0.1rem',
                        backgroundColor: yingshou ? '' : '#999',
                        color: yingshou ? '' : 'white'
                    }}>企业
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: '-0.3rem',
                width: '100%',
                // padding:'0.2rem',
                boxSizing: 'border-box',
            }}>
                <div style={{
                    padding: '0.2rem 0.3rem',
                    boxSizing: 'border-box',
                    width: '100%',
                    fontSize: '0.14rem',
                    backgroundColor: '#fff',
                    borderRadius: '0.15rem',
                }}>
                    <div style={{
                        marginBottom: '0.2rem',
                        display: 'flex',
                        fontWeight: 'bolder',
                    }}>
                        <div style={{width: '20%', textAlign: 'center', color: '#666'}}>排名</div>
                        {yingshou && <div style={{width: '60%', textAlign: 'center', color: '#666'}}>部门</div>}
                        {!yingshou && <div style={{width: '60%', textAlign: 'center', color: '#666'}}>企业</div>}
                        <div style={{width: '20%', textAlign: 'center', color: '#666'}}>数量</div>
                    </div>
                    {
                        list?.map((item, index) => {
                            return (
                                <div onClick={() => {
                                    if(yingshou){
                                        navigate(`/TopRateDept?name=${item.depart}&year=${year}&num=${item.checkTimes}`)
                                    }else {
                                        navigate(`/TopRateCom?name=${item.company}&year=${year}&num=${item.checkTimes}`)
                                    }
                                }} style={{
                                    marginBottom: '0.1rem',
                                    padding: '0.2rem 0',
                                    boxSizing: 'border-box',
                                    width: '100%',
                                    fontSize: '0.14rem',
                                    background:index===0?'linear-gradient(270deg,#fff1ba, rgba(255,241,186,0.10))':index===1?'linear-gradient(90deg,rgba(217,226,236,0.10), #d9e2ec)':index===2?'linear-gradient(270deg,#f8eddd 98%, rgba(248,237,221,0.10))':'#eff5ff',
                                    backgroundColor: '#eff5ff',
                                    borderRadius: '0.05rem',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}>
                                        <div style={{width: '20%', textAlign: 'center', color: '#666'}}>{index + 1}</div>
                                        {yingshou && <div style={{
                                            width: '60%',
                                            textAlign: 'center',
                                            color: '#666'
                                        }}>{item.depart}</div>}

                                        {!yingshou && <div style={{
                                            width: '60%',
                                            textAlign: 'center',
                                            color: '#666'
                                        }}>{item.company}</div>}
                                        <div style={{
                                            width: '20%',
                                            textAlign: 'center',
                                            color: '#666'
                                        }}>{item.checkTimes}</div>
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
