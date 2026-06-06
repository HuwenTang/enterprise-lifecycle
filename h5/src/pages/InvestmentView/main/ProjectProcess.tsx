import {Progress} from "antd";
import {Arrow} from "@react-vant/icons";
import {useNavigate} from "react-router-dom";

export default function ProcessProcess() {
    const navigate = useNavigate();
    const data = [
        {
            name: '用地',
            num:0,
            percent:0
        },{
            name: '租赁厂房',
            num:0,
            percent:0
        },{
            name: '购买厂房',
            num:0,
            percent:0
        },

    ]
    return (
        <div>
            <div style={{
                fontSize: '0.16rem',
                fontWeight: 'bold',
            }}>项目需求（不区分内外资）
            </div>

            <div>
                {data.map((item, index) => (
                    <div style={{
                        fontSize: '0.14rem',
                        margin: '0.2rem 0',
                    }} key={index}>
                        <div style={{
                            display:'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{
                                display: 'flex',
                                color: '#666',
                            }}>
                                <div style={{marginRight: '0.2rem'}}>{item.name}</div>
                                <div>{item.num} {index===0?'亩':'平方米'}</div>
                            </div>
                            <div onClick={()=>navigate("/InvestmentView/InvestProjectList")} style={{display: 'flex'}}>
                                <div style={{fontWeight: 'bold',color: '#333'}}>{item.num}</div>
                                <Arrow />
                            </div>
                        </div>
                        <Progress percent={item.percent} showInfo={false} />
                    </div>
                ))}
            </div>
        </div>
    );
}
