import TopBar from "../../../components/TopBar/TopBar.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export default function KeyEnterprisesSituation() {
    const time = false
    const navigator = useNavigate()
    const list = [
        {
            name:'生物医药',
            path:'/img/chanyelian/b1.png',
            color:'#012d82',
            bgcolor:'#d6e6fe',
            tag:0,
            children:[
                {
                    name:'生物医药',
                    path:'/img/chanyelian/sw1.png',
                    color:'#012d82',
                    bgcolor:'#d6e6fe',
                }, {
                    name:'医疗器械',
                    path:'/img/chanyelian/sw2.png',
                    color:'#012d82',
                    bgcolor:'#d6e6fe',
                },
            ]
        },
        {
            name:'健康食品',
            path:'/img/chanyelian/g1.png',
            color:'#268b69',
            bgcolor:'#d0f2e9',
            tag:1,
            children:[
                {
                    name:'特医及功能性食品',
                    path:'/img/chanyelian/jk1.png',
                    color:'#268b69',
                    bgcolor:'#d0f2e9',
                }, {
                    name:'农副食品深加工及预制菜',
                    path:'/img/chanyelian/jk2.png',
                    color:'#268b69',
                    bgcolor:'#d0f2e9',
                },
            ]
        },
        {
            name:'海工装备和高技术船舶',
            path:'/img/chanyelian/o1.png',
            color:'#6c5236',
            tag:2,
            bgcolor:'#fce8cf',
            children:[
                {
                    name:'海洋工程装备',
                    path:'/img/chanyelian/hg1.png',
                    color:'#6c5236',
                    bgcolor:'#fce8cf',
                }, {
                    name:'高技术船舶',
                    path:'/img/chanyelian/hg2.png',
                    color:'#6c5236',
                    bgcolor:'#fce8cf',
                },
            ]
        },
        {
            name:'汽车及零部件',
            path:'/img/chanyelian/r1.png',
            color:'#653737',
            bgcolor:'#fee0dc',
            tag:3,
            children:[
                {
                    name:'汽车及零部件',
                    path:'/img/chanyelian/qc.png',
                    color:'#653737',
                    bgcolor:'#fee0dc',
                }
            ]
        },{
            name:'新一代信息技术和智能装备',
            path:'/img/chanyelian/b2.png',
            color:'#002d83',
            bgcolor:'#d5e4ff',
            tag:4,
            children:[
                {
                    name:'电子信息',
                    path:'/img/chanyelian/xx1.png',
                    color:'#002d83',
                    bgcolor:'#d5e4ff',
                },{
                    name:'智能装备',
                    path:'/img/chanyelian/xx2.png',
                    color:'#002d83',
                    bgcolor:'#d5e4ff',
                },{
                    name:'节能环保',
                    path:'/img/chanyelian/xx3.png',
                    color:'#002d83',
                    bgcolor:'#d5e4ff',
                },
            ]
        },{
            name:'化工及新材料',
            path:'/img/chanyelian/g2.png',
            color:'#248b69',
            tag:5,
            bgcolor:'#d0f1e9',
            children:[
                {
                    name:'化工及新材料',
                    path:'/img/chanyelian/hg.png',
                    color:'#248b69',
                    bgcolor:'#d0f1e9',
                }
            ]
        },{
            name:'金属新材料及制品',
            path:'/img/chanyelian/o1.png',
            color:'#6c5338',
            bgcolor:'#fceccf',
            tag:6,
            children:[
                {
                    name:'金属新材料及制品',
                    path:'/img/chanyelian/js.png',
                    color:'#6c5338',
                    bgcolor:'#fceccf',
                }
            ]
        },{
            name:'新能源',
            path:'/img/chanyelian/r1.png',
            color:'#653737',
            bgcolor:'#fde2dd',
            tag:7,
            children:[
                {
                    name:'金属新材料及制品',
                    path:'/img/chanyelian/xny.png',
                    color:'#653737',
                    bgcolor:'#fde2dd',
                }
            ]
        },{
            name:'未来产业',
            path:'/img/chanyelian/b1.png',
            color:'#002d84',
            bgcolor:'#d5e4ff',
            tag:8,
            children:[
                {
                    name:'合成生物细胞和基因技术',
                    path:'/img/chanyelian/wl1.png',
                    color:'#002d84',
                    bgcolor:'#d5e4ff',
                },{
                    name:'新型储能氢能',
                    path:'/img/chanyelian/wl2.png',
                    color:'#002d84',
                    bgcolor:'#d5e4ff',
                },{
                    name:'深海深地空天装备人工智能',
                    path:'/img/chanyelian/wl3.png',
                    color:'#002d84',
                    bgcolor:'#d5e4ff',
                },
            ]
        },
    ]
    useEffect(() => {

    }, []);
      return (
        <div style={{
            width: '100%',
            height:'100vh',
            fontSize:'0.18rem',
            overflow:'scroll',
            scrollbarWidth:'none',
        }}>
          <TopBar title={'产业链群主要指标完成情况'} time={time}/>
            <div style={{
                width:'100%',
                height:'100vh-50px',
            }}>

                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <img onClick={()=>{
                        navigator(`/Kesdetail?name=9`)
                    }} style={{
                        width: '34%',
                        height: '8vh',
                    }} src="/img/chanyelian/01.png" alt=""/>
                    <img style={{
                        width: '65%',
                        height: '8vh',
                    }} src="/img/chanyelian/02.png"/>
                </div>
                <div style={{
                    height:'85vh',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'space-between',
                }}>
                    {
                        list.map((item,index)=>{
                            return (
                                <div style={{
                                    flexGrow: 1,
                                    // height:'8vh',
                                    display: 'flex',
                                    justifyContent:'space-between',
                                    marginBottom:  '0.05rem',
                                }}>
                                    <div onClick={()=>{
                                        navigator(`/Kesdetail?name=${item.tag}`)
                                    }} style={{
                                        display:'flex',
                                        alignItems:'center',
                                        justifyContent:'center',
                                        width: '34%',
                                        // height: '1rem',
                                        textAlign:'center',
                                        color: item.color,
                                        fontSize: '0.14rem',
                                        backgroundImage: `url(${item.path})`,
                                    }}>
                                        <div>{item.name}</div>
                                    </div>
                                    <div style={{
                                        padding: '0 0.1rem',
                                        boxSizing:  'border-box',
                                        width: '65%',
                                        // height: '1rem',
                                        backgroundImage: `url(${item.path})`,
                                        display: 'flex',
                                        alignItems:'center',
                                    }}>
                                        {
                                            item.children.map((item,index)=>{
                                                return(
                                                    <div style={{

                                                        display:'flex',
                                                        flexDirection:'column',
                                                        alignItems:'center',
                                                        justifyContent:'center',
                                                        width:'33%',
                                                        // height:'0.8rem',
                                                    }}>
                                                        <img style={{width:'0.3rem'}} src={item.path} alt=""/>
                                                        <div style={{
                                                            marginTop:  '0.05rem',
                                                            color: item.color,
                                                            fontSize:'0.12rem',
                                                            overflow:'hidden',
                                                            textOverflow:'ellipsis',
                                                            whiteSpace:'nowrap',
                                                            width:'100%',
                                                            textAlign:'center',
                                                        }}>{item.name}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
      );
}
