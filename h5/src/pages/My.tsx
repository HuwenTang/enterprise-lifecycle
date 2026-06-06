import TabBar from "../components/tabbar";
import VConsole from 'vconsole';
import {useEffect, useState} from "react";

export default function My() {
    const isHome = false;
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(prevCount => prevCount + 1); // 每次点击增加计数器

        if (count === 4) { // 当计数器达到4时，弹出vConsole
            setCount(0)
            const vConsoleDisplayed =   localStorage.getItem('vConsoleDisplayed')
            if (vConsoleDisplayed === 'true') {
                localStorage.setItem('vConsoleDisplayed', 'false')
            }else {
                localStorage.setItem('vConsoleDisplayed', 'true')
                new VConsole()
            }
        }
    };


    return (
        <div style={{
            height: '100vh',
            backgroundColor: '#f0f2f6',
            fontSize: '0.16rem',
            color: '#666',
        }}>
            <div style={{
                height: '2rem',
                width: '100%',
                backgroundSize: 'cover',
                backgroundImage: 'url(/img/my/myBanner.png)',
            }}>
                {/*<img style={{*/}
                {/*    width: '100%',*/}
                {/*}} src="/img/my/myBanner.png" alt=""/>*/}
            </div>
            <div style={{
                marginTop: '-0.5rem',
                width: '100%',
                padding:'0 0.2rem',
                boxSizing: 'border-box',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.2rem',
                    backgroundColor: '#fff',
                    borderRadius: '0.1rem',
                }}>
                    <div style={{
                        height: '0.68rem',
                        width: '0.68rem',
                    }}>
                        {/*{count}*/}
                    </div>
                    <div>
                        <div onClick={handleClick}>用户名：{localStorage.getItem('name')}</div>
                        <div style={{
                            marginTop: '0.1rem',
                        }}>部&nbsp;&nbsp;&nbsp;&nbsp;门：{JSON.parse(localStorage.getItem('org')||'')?.map((item:string,index:number)=>{
                            return <span key={index}>{item} {index===0 ? '' : ','}</span>
                        })}
                        </div>
                    </div>
                </div>
            </div>

            <TabBar isHome={isHome}/>
        </div>
    );
}
