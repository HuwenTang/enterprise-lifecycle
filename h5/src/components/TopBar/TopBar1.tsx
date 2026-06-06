
// 定义接口
import {useNavigate} from "react-router-dom";
import YearPick from "../YearPick/YearPick.tsx";
import YearPick1 from "../YearPick/YearPick1.tsx";

interface TopBarProps {
    title: string;
    time:boolean;
    year:string;
    setYear:any;
    /** 固定年份，设置后仅显示该年份不可选择 */
    fixedYear?: string;
}

export default function TopBar1({title,time,year,setYear,fixedYear}:TopBarProps) {
    const navigate = useNavigate()

  return (
    <div className="topbar">
        <div className="topbarWrapper" style={{
            padding: '0 0.2rem',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            height: '0.5rem',
            backgroundColor: '#fff',
            alignItems: 'center',
        }}>
            <div className="topCenter">
                {title}
            </div>
            <div style={{
                position:'absolute',
                right:'0.1rem'
            }} className="topRight">
                {
                    time ? (fixedYear ? <div style={{display: 'flex', alignItems: 'center'}}>{fixedYear}</div> : <YearPick1 year={year} setYear={setYear} />) : ""
                }
            </div>
        </div>
    </div>
  )
}
