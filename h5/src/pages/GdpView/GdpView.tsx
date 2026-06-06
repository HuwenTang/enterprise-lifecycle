import TopBar from "../../components/TopBar/TopBar.tsx";
import {useNavigate} from "react-router-dom";

export default function GdpView() {
    const items = [
        // {
        //     img:'/img/GDP/basic.png',
        //     title:'基础指标总览',
        // },
        {
            img:'/img/GDP/basic.png',
            title:'重点行业全口径开票情况',
            path:"/gdp-view-detail"
        },
        {
            img:'/img/GDP/basic2.png',
            title:'规上工业企业实时开票情况',
            path:"/gdp-view-detail1"
        },
        {
            img:'/img/GDP/bigCom.png',
            title:'限额以上批零住餐业企业开票情况',
            path:"/gdp-view-detail2"
        },
        {
            img:'/img/GDP/basic.png',
            title:'参与核算的规上服务业企业开票情况',
            path:"/gdp-view-detail3"
        },
        {
            img:'/img/GDP/basic1.png',
            title:'重点监测行业用电量情况表',
            path:"/gdp-view-detail4"
        },
        // {
        //     img:'/img/GDP/basic2.png',
        //     title:'其他高频监测指标数据情况表',
        //     path:"/gdp-view-detail6"
        // },
    ]
    const navigate = useNavigate();
  return (
    <div style={{
        fontSize: '0.18rem',
        height: '100vh',
    }}>
        <TopBar title="GDP看板" time={false}/>

        <div style={{
            padding: '0.2rem',
        }}>
            {
                items.map((item,index)=>{
                    return (
                        <div onClick={()=>{
                            navigate(item.path)
                        }} key={index} style={{
                            padding:'0.1rem 0.15rem',
                            display:'flex',
                            fontSize:'0.14rem',
                            alignItems:'center',
                            // height:'0.75rem',
                            backgroundColor:'#fff',
                            marginBottom:'0.2rem'
                        }}>
                            <img style={{
                                width: '0.5rem',
                                marginRight: '0.2rem',
                            }} src={item.img} alt=""/>
                            <div>
                                {item.title}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    </div>
  );
}
