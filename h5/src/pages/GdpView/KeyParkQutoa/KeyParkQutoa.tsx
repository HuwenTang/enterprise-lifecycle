import TopBar from "../../../components/TopBar/TopBar.tsx";
import {useNavigate} from "react-router-dom";

export default function KeyParkQutoa() {
    const items = [
        {
            img:'/img/GDP/kesimg1.png',
            title:'规上工业',
            path:'/GdpView/TotalParkValue',
        }
    ]
    const navigator = useNavigate()
  return (
    <div style={{
        width: '100%',
        height:'100vh',
        fontSize:'0.18rem'
    }}>
      <TopBar title={'GDP核算分行业表'} />
        <div style={{
            width:'100%',
            padding:'0.2rem 0'
        }}>
            {
                items.map((item,index)=>{
                    return(
                        <div key={index} style={{
                            width:'25%',
                            fontSize:'0.14rem',
                            backgroundColor:'#fff',
                            display:'flex',
                            flexDirection:'column',
                            alignItems:'center',
                            justifyContent:'center',
                            height:'0.8rem'
                        }} onClick={()=>{
                            navigator(item.path)
                        }}>
                            <img src={item.img} alt="" />
                            <div style={{
                                marginTop:'0.1rem'
                            }}>{item.title}</div>
                        </div>
                    )
                })
            }
        </div>
    </div>
  );
}
