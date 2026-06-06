import TopBar1 from "../../components/TopBar/TopBar1.tsx";
import {useCallback, useEffect, useState} from "react";
import {primeApi} from "../../api.ts";
import {CheckRankBo} from "../../apis";
import {useSearchParams} from "react-router-dom";

export default function TopRateDept() {
    const [list, setList] = useState<CheckRankBo[]>()
    const [yingshou] = useState(false)
    const [searshParams] = useSearchParams()
    const name = searshParams.get('name')
    const yearParam = searshParams.get('year') || '2026'
    const [year, setYear] = useState(yearParam)
    const num = searshParams.get('num')

    const getDeptCompanyRanking = useCallback(async () => {
        const data = await primeApi.getDeptCompanyRanking({year: +year, dept: name!})
        console.log(data)
        setList(data)
    }, [year, name])
    useEffect(() => {
        getDeptCompanyRanking()
    }, [getDeptCompanyRanking, yingshou]);
    return (
        <div style={{
            width:'100%',
            height:'100vh',
            overflow:'scroll',
            scrollbarWidth:'none',
            fontSize:'0.16rem',
            backgroundColor:'#f0f2f6'
        }}>
            <TopBar1 title={'涉企检查分布'} time={false} year={year} setYear={setYear} />
            <div style={{
                width: '100%',
                height: '2.05rem',
                paddingTop: '0.45rem',
                paddingLeft: '0.3rem',
                paddingRight: '0.3rem',
                boxSizing: 'border-box',
                backgroundImage: 'url(/img/toprate/bc2.png)',
                backgroundSize: '100% 100%',
                fontSize: '0.20rem',
                fontWeight: 'bolder',
                color: '#fff'
            }}>
                <div>
                    {name}
                </div>
                <div style={{
                    marginTop: '0.2rem',
                    fontSize: '0.3rem',
                    fontWeight: 'bolder',
                }}>
                    {num}次
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
                                <div style={{
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
