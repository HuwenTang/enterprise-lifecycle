
// 定义接口
import {useNavigate} from "react-router-dom";
import YearPick from "../YearPick/YearPick.tsx";

interface TopBarProps {
    title: string;
    time:boolean;
    color: string;
}

export default function TopBarColor({title,time,color}:TopBarProps) {
    const navigate = useNavigate()

  return (
    <div className="topbar">
        <div className="topbarWrapper" style={{
            padding: '0 0.2rem',
            display: 'flex',
            justifyContent: 'center',
            height: '0.5rem',
            backgroundColor: color,
            alignItems: 'center',
            color: 'white',
            position: 'relative',
        }}>
            {/*<div  className="topLeft" style={{width: '0.2rem',}}>*/}
            {/*    <img onClick={() => {*/}
            {/*        navigate(-1)*/}
            {/*    }} style={{*/}
            {/*        width: '0.20rem',*/}
            {/*    }} src="/img/left.png" alt=""/>*/}
            {/*</div>*/}
            <div className="topCenter">
                {title}
            </div>
            <div style={{
                position: 'absolute',
                right: '0.1rem',
                width:time?"": '0.20rem',
            }} className="topRight">
                {
                    time?<YearPick  />:""
                }
            </div>
        </div>
    </div>
  )
}
