import {useNavigate} from "react-router-dom";

interface Props{
    isHome:boolean
}
export default function TabBar(evt:Props){
    const {isHome} = evt
    const navigate = useNavigate()
    const tabBarItem = {
        width:'0.25rem',
        height:'0.25rem',
    }

    return(
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 50,
            zIndex: 999,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderTopRightRadius: '0.2rem',
            borderTopLeftRadius: '0.2rem',
        }}>
            {
                isHome ? (
                    <img onClick={() => {
                        localStorage.removeItem('key')
                        navigate('/home')
                    }} style={tabBarItem} src="/img/tab/homeC.png" alt=""/>
                ) : (
                    <img onClick={() => {
                        localStorage.removeItem('key')
                        navigate('/home')
                    }}  style={tabBarItem} src="/img/tab/home.png" alt=""/>
                )
            }
            {
                !isHome ? (
                    <img onClick={() => {
                        navigate('/my')
                    }} style={tabBarItem} src="/img/tab/myC.png" alt=""/>
                ) : (
                    <img onClick={() => {
                        navigate('/my')
                    }}  style={tabBarItem}  src="/img/tab/my.png" alt=""/>
                )
            }
        </div>
    )
}
