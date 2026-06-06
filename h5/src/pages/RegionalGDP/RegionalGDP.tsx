import {useNavigate} from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar.tsx";

export default function RegionalGDP() {
    const time = false
    const items = [
        {
            img:'/img/RegionalGDP/1.png',
            title:'地区生产总值',
            path:'/RegionalGDPDetail'
        },{
            img:'/img/RegionalGDP/2.png',
            title:'工业',
            path:'/GdpView/TotalIndustryValue'
        },{
            img:'/img/RegionalGDP/3.png',
            title:'投资',
            path:'/GdpView/TotalIndustryValue'
        },{
            img:'/img/RegionalGDP/4.png',
            title:'房地产',
            path:'/GdpView/TotalIndustryValue'
        },{
            img:'/img/RegionalGDP/5.png',
            title:'交通运输',
            path:'/GdpView/TotalIndustryValue'
        },{
            img:'/img/RegionalGDP/6.png',
            title:'贸易',
            path:'/GdpView/TotalIndustryValue'
        },{
            img:'/img/RegionalGDP/7.png',
            title:'对外经济',
            path:'/GdpView/TotalIndustryValue'
        },{
            img:'/img/RegionalGDP/8.png',
            title:'金融',
            path:'/GdpView/TotalIndustryValue'
        }
    ]
    const navigator = useNavigate()
    return (
        <div style={{
            width: '100%',
            height:'100vh',
            fontSize:'0.18rem',
            backgroundColor:'#f0f2f6'
        }}>
            <TopBar title={'数据泰州'} time={time}/>
                <div style={{
                    padding: '0.2rem',width:'100%',
                    boxSizing: 'border-box',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '10px'
                }}>
                    {
                        items.map((item, index) => {
                            return (
                                <div key={index} style={{
                                    padding: '0.2rem 0',
                                    fontSize: '0.14rem',
                                    backgroundColor: '#fff',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }} onClick={() => {
                                    navigator(`/RegionalGDPDetail?title=${item.title}`)
                                }}>
                                    <div style={{
                                        width: '0.45rem',
                                        height: '0.45rem',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <img src={item.img} alt=""/>
                                    </div>
                                    <div style={{
                                        marginTop: '0.1rem'
                                    }}>{item.title}</div>
                                </div>
                            )
                        })
                    }
                </div>
        </div>
    );
}
