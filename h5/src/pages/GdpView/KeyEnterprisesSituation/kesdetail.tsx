import TopBar from "../../../components/TopBar/TopBar.tsx";
import data from "../../../assets/file.json"
import { useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AreaPick1 from "../../../components/YearPick/economy/AreaPick1.tsx";
import SeasonPick from "../../../components/YearPick/economy/SeasonPick.tsx";

export default function Kesdetail(){
    const [searchParams] = useSearchParams();
    const [name] = useState(searchParams.get('name') || '0')
    const list = [
        data.records.sw,
        data.records.jksp,
        data.records.hgzb,
        data.records.qclbj,
        data.records.xxjs,
        data.records.hgcl,
        data.records.jscl,
        data.records.xny,
        data.records.wlcy,
        data.records.all,
    ]
    const getName = (text:any) => {
        return text==="医药产业链"||text==='医疗器械产业链'||text==="特医食品及功能性食品产业链"||text==="农副食品深加工及预制菜产业链"||text==="海洋工程装备产业链"||text==="高技术船舶产业链"||text==="电子信息产业链"||text==="智能装备产业链"||text==="节能环保产业链"
    }

    const getFirstName = (text:any) => {
        return text==="生物医药产业集群"||text==="健康食品产业集群"||text==="海洋装备和高技术船舶"||text==="海工装备和高技术船舶产业集群"||text==="汽车及零部件产业集群"||text==="新一代信息技术和智能装备产业集群"||text==="化工及新材料产业集群"||text==="金属新材料及制品产业集群"||text==="新能源产业集群"||text==="未来产业"
    }

    const getBigName = (text:any) => {
        return text==="泰州市规上工业合计"||text==="“8+13+X”链群合计"
    }
    const columns1 = [
        {
            title: '指标名称',
            dataIndex: 'name',
            key: 'name',
            width: '2.5rem',
            align: 'center',
            render: (text: string) => <div style={{
                textAlign:(text==="生物医药产业集群"||text==="医药产业链"||text==='医疗器械产业链'||text==="健康食品产业集群"||text==="特医食品及功能性食品产业链"||text==="农副食品深加工及预制菜产业链"||text==="海工装备和高技术船舶"||text==="海洋工程装备产业链"||text==="高技术船舶产业链"||text==="汽车及零部件产业集群"||text==="新一代信息技术和智能装备产业集群"||text==="电子信息产业链"||text==="智能装备产业链"||text==="节能环保产业链"||text==="化工及新材料产业集群"||text==="金属新材料及制品产业集群"||text==="新能源产业集群"||text==="未来产业") ? "left":'center',
                fontWeight:(text==="生物医药产业集群"||text==="医药产业链"||text==='医疗器械产业链'||text==="健康食品产业集群"||text==="特医食品及功能性食品产业链"||text==="农副食品深加工及预制菜产业链"||text==="海工装备和高技术船舶"||text==="海洋工程装备产业链"||text==="高技术船舶产业链"||text==="汽车及零部件产业集群"||text==="新一代信息技术和智能装备产业集群"||text==="电子信息产业链"||text==="智能装备产业链"||text==="节能环保产业链"||text==="化工及新材料产业集群"||text==="金属新材料及制品产业集群"||text==="新能源产业集群"||text==="未来产业") ? "bolder":'normal',
            }}>{text}</div>,
        },
                {
                    title: '企业数',
                    dataIndex: 'count',
                    key: 'count',
                    align: 'center',
                    width: '2.2rem',
                    render: (text: string,record:any) =>
                        <div style={{
                            fontWeight:(record.name==="生物医药产业集群"||record.name==="医药产业链"||record.name==='医疗器械产业链'||record.name==="健康食品产业集群"||record.name==="特医食品及功能性食品产业链"||record.name==="农副食品深加工及预制菜产业链"||record.name==="海工装备和高技术船舶"||record.name==="海洋工程装备产业链"||record.name==="高技术船舶产业链"||record.name==="汽车及零部件产业集群"||record.name==="新一代信息技术和智能装备产业集群"||record.name==="电子信息产业链"||record.name==="智能装备产业链"||record.name==="节能环保产业链"||record.name==="化工及新材料产业集群"||record.name==="金属新材料及制品产业集群"||record.name==="新能源产业集群"||record.name==="未来产业") ? "bolder":'normal',
                        }}>
                        {text}
                    </div>,
                },
                {
            title: '产值（亿元）',
            children:[
                {
                    title: '本期',
                    dataIndex: 'czbq',
                    align: 'czbq',
                    key: 'actualValue',
                    width: '1rem',
                    render: (text: string,record:any) =>
                        <div style={{
                            fontWeight:(record.name==="生物医药产业集群"||record.name==="医药产业链"||record.name==='医疗器械产业链'||record.name==="健康食品产业集群"||record.name==="特医食品及功能性食品产业链"||record.name==="农副食品深加工及预制菜产业链"||record.name==="海工装备和高技术船舶"||record.name==="海洋工程装备产业链"||record.name==="高技术船舶产业链"||record.name==="汽车及零部件产业集群"||record.name==="新一代信息技术和智能装备产业集群"||record.name==="电子信息产业链"||record.name==="智能装备产业链"||record.name==="节能环保产业链"||record.name==="化工及新材料产业集群"||record.name==="金属新材料及制品产业集群"||record.name==="新能源产业集群"||record.name==="未来产业") ? "bolder":'normal',
                        }}>
                            {text}
                        </div>,
                },{
                    title: '增长(%)',
                    dataIndex: 'czzz',
                    align: 'center',
                    key: 'czzz',
                    width: '1.4rem',
                    render: (text: string,record:any) =>
                        <div style={{
                            fontWeight:(record.name==="生物医药产业集群"||record.name==="医药产业链"||record.name==='医疗器械产业链'||record.name==="健康食品产业集群"||record.name==="特医食品及功能性食品产业链"||record.name==="农副食品深加工及预制菜产业链"||record.name==="海工装备和高技术船舶"||record.name==="海洋工程装备产业链"||record.name==="高技术船舶产业链"||record.name==="汽车及零部件产业集群"||record.name==="新一代信息技术和智能装备产业集群"||record.name==="电子信息产业链"||record.name==="智能装备产业链"||record.name==="节能环保产业链"||record.name==="化工及新材料产业集群"||record.name==="金属新材料及制品产业集群"||record.name==="新能源产业集群"||record.name==="未来产业") ? "bolder":'normal',
                        }}>
                            {text}
                        </div>,
                }
            ]
        },
        {
            title: '营业收入（亿元）',
            children:[
                {
                    title: '本期',
                    dataIndex: 'yybq',
                    align: 'yybq',
                    key: 'actualValue',
                    width: '1rem',
                    render: (text: string,record:any) =>
                        <div style={{
                            fontWeight:(record.name==="生物医药产业集群"||record.name==="医药产业链"||record.name==='医疗器械产业链'||record.name==="健康食品产业集群"||record.name==="特医食品及功能性食品产业链"||record.name==="农副食品深加工及预制菜产业链"||record.name==="海工装备和高技术船舶"||record.name==="海洋工程装备产业链"||record.name==="高技术船舶产业链"||record.name==="汽车及零部件产业集群"||record.name==="新一代信息技术和智能装备产业集群"||record.name==="电子信息产业链"||record.name==="智能装备产业链"||record.name==="节能环保产业链"||record.name==="化工及新材料产业集群"||record.name==="金属新材料及制品产业集群"||record.name==="新能源产业集群"||record.name==="未来产业") ? "bolder":'normal',
                        }}>
                            {text}
                        </div>,
                },{
                    title: '增长(%)',
                    dataIndex: 'yyzz',
                    align: 'center',
                    key: 'yyzz',
                    width: '1.4rem',
                    render: (text: string,record:any) =>
                        <div style={{
                            fontWeight:(record.name==="生物医药产业集群"||record.name==="医药产业链"||record.name==='医疗器械产业链'||record.name==="健康食品产业集群"||record.name==="特医食品及功能性食品产业链"||record.name==="农副食品深加工及预制菜产业链"||record.name==="海工装备和高技术船舶"||record.name==="海洋工程装备产业链"||record.name==="高技术船舶产业链"||record.name==="汽车及零部件产业集群"||record.name==="新一代信息技术和智能装备产业集群"||record.name==="电子信息产业链"||record.name==="智能装备产业链"||record.name==="节能环保产业链"||record.name==="化工及新材料产业集群"||record.name==="金属新材料及制品产业集群"||record.name==="新能源产业集群"||record.name==="未来产业") ? "bolder":'normal',
                        }}>
                            {text}
                        </div>,
                }
            ]
        },
        {
            title: '利润（亿元）',
            children:[
                {
                    title: '本期',
                    dataIndex: 'lrbq',
                    align: 'czbq',
                    key: 'lrbq',
                    width: '1rem',
                    render: (text: string,record:any) =>
                        <div style={{
                            fontWeight:(record.name==="生物医药产业集群"||record.name==="医药产业链"||record.name==='医疗器械产业链'||record.name==="健康食品产业集群"||record.name==="特医食品及功能性食品产业链"||record.name==="农副食品深加工及预制菜产业链"||record.name==="海工装备和高技术船舶"||record.name==="海洋工程装备产业链"||record.name==="高技术船舶产业链"||record.name==="汽车及零部件产业集群"||record.name==="新一代信息技术和智能装备产业集群"||record.name==="电子信息产业链"||record.name==="智能装备产业链"||record.name==="节能环保产业链"||record.name==="化工及新材料产业集群"||record.name==="金属新材料及制品产业集群"||record.name==="新能源产业集群"||record.name==="未来产业") ? "bolder":'normal',
                        }}>
                            {text}
                        </div>,
                },{
                    title: '增长(%)',
                    dataIndex: 'lrzz',
                    align: 'center',
                    key: 'lrzz',
                    width: '1.4rem',
                    render: (text: string,record:any) =>
                        <div style={{
                            fontWeight:(record.name==="生物医药产业集群"||record.name==="医药产业链"||record.name==='医疗器械产业链'||record.name==="健康食品产业集群"||record.name==="特医食品及功能性食品产业链"||record.name==="农副食品深加工及预制菜产业链"||record.name==="海工装备和高技术船舶"||record.name==="海洋工程装备产业链"||record.name==="高技术船舶产业链"||record.name==="汽车及零部件产业集群"||record.name==="新一代信息技术和智能装备产业集群"||record.name==="电子信息产业链"||record.name==="智能装备产业链"||record.name==="节能环保产业链"||record.name==="化工及新材料产业集群"||record.name==="金属新材料及制品产业集群"||record.name==="新能源产业集群"||record.name==="未来产业") ? "bolder":'normal',
                        }}>
                            {text}
                        </div>,
                }
            ]
        }
    ]

    const columns2 = [
        {
            title: '指标名称',
            dataIndex: 'name',
            key: 'name',
            width: '2.5rem',
            align: 'center',
            render: (text: string) => <div style={{
                textAlign:(text!="生物医药产业集群"&&text!="医药产业链"&&text!='医疗器械产业链'&&text!="健康食品产业集群"&&text!="特医食品及功能性食品产业链"&&text!="农副食品深加工及预制菜产业链"&&text!="海工装备和高技术船舶"&&text!="海洋工程装备产业链"&&text!="高技术船舶产业链"&&text!="汽车及零部件产业集群"&&text!="新一代信息技术和智能装备产业集群"&&text!="电子信息产业链"&&text!="智能装备产业链"&&text!="节能环保产业链"&&text!="化工及新材料产业集群"&&text!="金属新材料及制品产业集群"&&text!="新能源产业集群"&&text!="未来产业") ? "left":'center',
                fontWeight:(text!="生物医药产业集群"&&text!="医药产业链"&&text!='医疗器械产业链'&&text!="健康食品产业集群"&&text!="特医食品及功能性食品产业链"&&text!="农副食品深加工及预制菜产业链"&&text!="海工装备和高技术船舶"&&text!="海洋工程装备产业链"&&text!="高技术船舶产业链"&&text!="汽车及零部件产业集群"&&text!="新一代信息技术和智能装备产业集群"&&text!="电子信息产业链"&&text!="智能装备产业链"&&text!="节能环保产业链"&&text!="化工及新材料产业集群"&&text!="金属新材料及制品产业集群"&&text!="新能源产业集群"&&text!="未来产业") ? "bolder":'normal',
            }}>{text}</div>,
        },
        {
            title: '企业数',
            dataIndex: 'count',
            key: 'count',
            align: 'center',
            width: '2.2rem',
            render: (text: string,record:any) =>
                <div style={{
                    fontWeight:(record.name!="生物医药产业集群"&&record.name!="医药产业链"&&record.name!='医疗器械产业链'&&record.name!="健康食品产业集群"&&record.name!="特医食品及功能性食品产业链"&&record.name!="农副食品深加工及预制菜产业链"&&record.name!="海工装备和高技术船舶"&&record.name!="海洋工程装备产业链"&&record.name!="高技术船舶产业链"&&record.name!="汽车及零部件产业集群"&&record.name!="新一代信息技术和智能装备产业集群"&&record.name!="电子信息产业链"&&record.name!="智能装备产业链"&&record.name!="节能环保产业链"&&record.name!="化工及新材料产业集群"&&record.name!="金属新材料及制品产业集群"&&record.name!="新能源产业集群"&&record.name!="未来产业")? "bolder":'normal',
                }}>
                    {text}
                </div>,
        },
        {
            title: '产值（亿元）',
            children:[
                {
                    title: '本期',
                    dataIndex: 'czbq',
                    align: 'czbq',
                    key: 'actualValue',
                    width: '1rem',
                    render: (text: string,record:any) =>
                        <div style={{
                            fontWeight:(record.name!="生物医药产业集群"&&record.name!="医药产业链"&&record.name!='医疗器械产业链'&&record.name!="健康食品产业集群"&&record.name!="特医食品及功能性食品产业链"&&record.name!="农副食品深加工及预制菜产业链"&&record.name!="海工装备和高技术船舶"&&record.name!="海洋工程装备产业链"&&record.name!="高技术船舶产业链"&&record.name!="汽车及零部件产业集群"&&record.name!="新一代信息技术和智能装备产业集群"&&record.name!="电子信息产业链"&&record.name!="智能装备产业链"&&record.name!="节能环保产业链"&&record.name!="化工及新材料产业集群"&&record.name!="金属新材料及制品产业集群"&&record.name!="新能源产业集群"&&record.name!="未来产业")? "bolder":'normal',
                        }}>
                            {text}
                        </div>,
                },{
                    title: '增长(%)',
                    dataIndex: 'czzz',
                    align: 'center',
                    key: 'czzz',
                    width: '1.4rem',
                    render: (text: string,record:any) =>
                        <div style={{
                            fontWeight:(record.name!="生物医药产业集群"&&record.name!="医药产业链"&&record.name!='医疗器械产业链'&&record.name!="健康食品产业集群"&&record.name!="特医食品及功能性食品产业链"&&record.name!="农副食品深加工及预制菜产业链"&&record.name!="海工装备和高技术船舶"&&record.name!="海洋工程装备产业链"&&record.name!="高技术船舶产业链"&&record.name!="汽车及零部件产业集群"&&record.name!="新一代信息技术和智能装备产业集群"&&record.name!="电子信息产业链"&&record.name!="智能装备产业链"&&record.name!="节能环保产业链"&&record.name!="化工及新材料产业集群"&&record.name!="金属新材料及制品产业集群"&&record.name!="新能源产业集群"&&record.name!="未来产业")? "bolder":'normal',
                        }}>
                            {text}
                        </div>,
                }
            ]
        },
        {
            title: '营业收入（亿元）',
            children:[
                {
                    title: '本期',
                    dataIndex: 'yybq',
                    align: 'yybq',
                    key: 'actualValue',
                    width: '1rem',
                    render: (text: string,record:any) =>
                        <div style={{
                            fontWeight:(record.name!="生物医药产业集群"&&record.name!="医药产业链"&&record.name!='医疗器械产业链'&&record.name!="健康食品产业集群"&&record.name!="特医食品及功能性食品产业链"&&record.name!="农副食品深加工及预制菜产业链"&&record.name!="海工装备和高技术船舶"&&record.name!="海洋工程装备产业链"&&record.name!="高技术船舶产业链"&&record.name!="汽车及零部件产业集群"&&record.name!="新一代信息技术和智能装备产业集群"&&record.name!="电子信息产业链"&&record.name!="智能装备产业链"&&record.name!="节能环保产业链"&&record.name!="化工及新材料产业集群"&&record.name!="金属新材料及制品产业集群"&&record.name!="新能源产业集群"&&record.name!="未来产业")? "bolder":'normal',
                        }}>
                            {text}
                        </div>,
                },{
                    title: '增长(%)',
                    dataIndex: 'yyzz',
                    align: 'center',
                    key: 'yyzz',
                    width: '1.4rem',
                    render: (text: string,record:any) =>
                        <div style={{
                            fontWeight:(record.name!="生物医药产业集群"&&record.name!="医药产业链"&&record.name!='医疗器械产业链'&&record.name!="健康食品产业集群"&&record.name!="特医食品及功能性食品产业链"&&record.name!="农副食品深加工及预制菜产业链"&&record.name!="海工装备和高技术船舶"&&record.name!="海洋工程装备产业链"&&record.name!="高技术船舶产业链"&&record.name!="汽车及零部件产业集群"&&record.name!="新一代信息技术和智能装备产业集群"&&record.name!="电子信息产业链"&&record.name!="智能装备产业链"&&record.name!="节能环保产业链"&&record.name!="化工及新材料产业集群"&&record.name!="金属新材料及制品产业集群"&&record.name!="新能源产业集群"&&record.name!="未来产业")? "bolder":'normal',
                        }}>
                            {text}
                        </div>,
                }
            ]
        },
        {
            title: '利润（亿元）',
            children:[
                {
                    title: '本期',
                    dataIndex: 'lrbq',
                    align: 'czbq',
                    key: 'lrbq',
                    width: '1rem',
                    render: (text: string,record:any) =>
                        <div style={{
                            fontWeight:(record.name!="生物医药产业集群"&&record.name!="医药产业链"&&record.name!='医疗器械产业链'&&record.name!="健康食品产业集群"&&record.name!="特医食品及功能性食品产业链"&&record.name!="农副食品深加工及预制菜产业链"&&record.name!="海工装备和高技术船舶"&&record.name!="海洋工程装备产业链"&&record.name!="高技术船舶产业链"&&record.name!="汽车及零部件产业集群"&&record.name!="新一代信息技术和智能装备产业集群"&&record.name!="电子信息产业链"&&record.name!="智能装备产业链"&&record.name!="节能环保产业链"&&record.name!="化工及新材料产业集群"&&record.name!="金属新材料及制品产业集群"&&record.name!="新能源产业集群"&&record.name!="未来产业")? "bolder":'normal',
                        }}>
                            {text}
                        </div>,
                },{
                    title: '增长(%)',
                    dataIndex: 'lrzz',
                    align: 'center',
                    key: 'lrzz',
                    width: '1.4rem',
                    render: (text: string,record:any) =>
                        <div style={{
                            fontWeight:(record.name!="生物医药产业集群"&&record.name!="医药产业链"&&record.name!='医疗器械产业链'&&record.name!="健康食品产业集群"&&record.name!="特医食品及功能性食品产业链"&&record.name!="农副食品深加工及预制菜产业链"&&record.name!="海工装备和高技术船舶"&&record.name!="海洋工程装备产业链"&&record.name!="高技术船舶产业链"&&record.name!="汽车及零部件产业集群"&&record.name!="新一代信息技术和智能装备产业集群"&&record.name!="电子信息产业链"&&record.name!="智能装备产业链"&&record.name!="节能环保产业链"&&record.name!="化工及新材料产业集群"&&record.name!="金属新材料及制品产业集群"&&record.name!="新能源产业集群"&&record.name!="未来产业")? "bolder":'normal',
                        }}>
                            {text}
                        </div>,
                }
            ]
        }
    ]

    const [year, setYear] = useState('2025')
    const [season, setSeason] = useState('第三季度')
    const [quarter, setQuarter] = useState(3)
    const nameIndex = parseInt(name) || 0
    useEffect(() => {
        console.log(name)
        console.log(list[nameIndex])
    }, []);
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            backgroundColor: '#f5f5f5',
            fontSize: '0.18rem',
            overflow: 'scroll',
            scrollbarWidth: 'none',
        }}>
            <TopBar title={'产业链群主要指标完成情况'} time={false}/>
            <div style={{
                padding: '0.1rem 0.05rem',
                overflowY: 'scroll',
            }}>

                <div style={{
                    // width: '880px',
                    padding: '0.1rem 0.05rem',
                }}>
                    <div style={{marginBottom: '0.1rem', display: 'flex', justifyContent: 'space-between',fontSize:'0.14rem'}}>
                        <div style={{width: '30%'}}><AreaPick1 year={year} setYear={setYear}/></div>
                        <div style={{width: '30%'}}><SeasonPick year={season} setYear={setSeason} setQuarter={setQuarter}/></div>
                    </div>

                    {
                        list[nameIndex].map((item: any, index: number) => {
                            return (
                                <div>
                                    {
                                        getBigName(item.name) &&
                                        <div key={index} style={{
                                            backgroundColor: '#fff',
                                            marginBottom: '0.1rem',
                                            borderRadius: '0.07rem',
                                            padding: '0.1rem 0.15rem',
                                        }}>
                                            <div style={{
                                                paddingLeft: '0.2rem',
                                                height: '0.5rem',
                                                fontSize: '0.16rem',
                                                lineHeight: '0.5rem',
                                                borderRadius: '0.07rem',
                                                background: 'linear-gradient(to right, #666, grey)',
                                                color: '#fff',
                                            }}>
                                                {item.name}
                                            </div>
                                            <div style={{
                                                padding: '0.2rem 0',
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr 1fr 1fr'
                                            }}>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    borderRight: '1px solid #eaeaea',
                                                    alignItems: 'center'
                                                }}>
                                                    <img style={{width: '0.3rem', marginBottom: '0.05rem'}}
                                                         src="/img/GDP/q3.png" alt=""/>
                                                    <div style={{marginBottom: '0.05rem'}}>企数</div>
                                                    <div style={{
                                                        color: '#666',
                                                        fontSize: '0.16rem'
                                                    }}>{item.count}</div>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#666',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderRight: '1px solid #eaeaea',
                                                }}>
                                                    <img style={{width: '0.3rem', marginBottom: '0.05rem'}}
                                                         src="/img/GDP/c3.png" alt=""/>
                                                    <div style={{marginBottom: '0.05rem'}}>产值(亿元)</div>
                                                    <div style={{
                                                        marginBottom: '0.05rem',
                                                        color: '#666',
                                                        fontSize: '0.16rem'
                                                    }}>{item.czbq}</div>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <div>同比 <span style={{color: '#666'}}>{item.czzz}</span>
                                                        </div>
                                                        {
                                                            item.czzz === "-" ? "" :
                                                                item.czzz > 0 ? (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/up3.png" alt=""/>
                                                                ) : (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/down3.png" alt=""/>
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderRight: '1px solid #eaeaea',
                                                }}>
                                                    <img style={{
                                                        width: '0.3rem',
                                                        height: '0.3rem',
                                                        marginBottom: '0.05rem'
                                                    }}
                                                         src="/img/GDP/y3.png" alt=""/>
                                                    <div style={{marginBottom: '0.05rem'}}>营收(亿元)</div>
                                                    <div style={{
                                                        marginBottom: '0.05rem',
                                                        color: '#666',
                                                        fontSize: '0.16rem'
                                                    }}>{item.yybq}</div>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <div>同比 <span style={{color: '#666'}}>{item.yyzz}</span>
                                                        </div>
                                                        {
                                                            item.yyzz === "-" ? "" :
                                                                +item.yyzz > 0 ? (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/up3.png" alt=""/>
                                                                ) : (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/down3.png" alt=""/>
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderRight: '1px solid #eaeaea',
                                                }}>
                                                    <img style={{
                                                        width: '0.3rem',
                                                        height: '0.3rem',
                                                        marginBottom: '0.05rem'
                                                    }}
                                                         src="/img/GDP/c3.png" alt=""/>
                                                    <div style={{marginBottom: '0.05rem'}}>利润(亿元)</div>
                                                    <div style={{
                                                        marginBottom: '0.05rem',
                                                        color: '#666',
                                                        fontSize: '0.16rem'
                                                    }}>{item.lrbq}</div>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <div>同比 <span style={{color: '#666'}}>{item.lrzz}</span>
                                                        </div>
                                                        {
                                                            item.lrzz === "-" ? "" :
                                                                item.lrzz > 0 ? (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/up3.png" alt=""/>
                                                                ) : (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/down3.png" alt=""/>
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {getFirstName(item.name) &&
                                        <div key={index} style={{
                                            backgroundColor: '#fff',
                                            marginBottom: '0.1rem',
                                            borderRadius: '0.07rem',
                                            padding: '0.1rem 0.15rem',
                                        }}>
                                            <div style={{
                                                paddingLeft: '0.2rem',
                                                height: '0.5rem',
                                                fontSize: '0.16rem',
                                                lineHeight: '0.5rem',
                                                borderRadius: '0.07rem',
                                                background: 'linear-gradient(to right, #7ec358, #b1db9d)',
                                                color: '#fff',
                                            }}>
                                                {item.name}
                                            </div>
                                            <div style={{
                                                padding: '0.2rem 0',
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr 1fr 1fr'
                                            }}>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    borderRight: '1px solid #eaeaea',
                                                    alignItems: 'center'
                                                }}>
                                                    <img style={{width: '0.3rem', marginBottom: '0.05rem'}}
                                                         src="/img/GDP/q1.png" alt=""/>
                                                    <div style={{marginBottom: '0.05rem'}}>企数</div>
                                                    <div style={{
                                                        color: '#7ec358',
                                                        fontSize: '0.16rem'
                                                    }}>{item.count}</div>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderRight: '1px solid #eaeaea',
                                                }}>
                                                    <img style={{width: '0.3rem', marginBottom: '0.05rem'}}
                                                         src="/img/GDP/c1.png" alt=""/>
                                                    <div style={{marginBottom: '0.05rem'}}>产值(亿元)</div>
                                                    <div style={{
                                                        marginBottom: '0.05rem',
                                                        color: '#7ec358',
                                                        fontSize: '0.16rem'
                                                    }}>{item.czbq}</div>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <div>同比 <span
                                                            style={{color: '#7ec358'}}>{item.czzz}</span>
                                                        </div>
                                                        {
                                                            item.czzz === "-" ? "" :
                                                                item.czzz > 0 ? (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/up2.png" alt=""/>
                                                                ) : (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/down2.png" alt=""/>
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderRight: '1px solid #eaeaea',
                                                }}>
                                                    <img style={{
                                                        width: '0.3rem',
                                                        height: '0.3rem',
                                                        marginBottom: '0.05rem'
                                                    }}
                                                         src="/img/GDP/y1.png" alt=""/>
                                                    <div style={{marginBottom: '0.05rem'}}>营收(亿元)</div>
                                                    <div style={{
                                                        marginBottom: '0.05rem',
                                                        color: '#7ec358',
                                                        fontSize: '0.16rem'
                                                    }}>{item.yybq}</div>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <div>同比 <span
                                                            style={{color: '#7ec358'}}>{item.yyzz}</span>
                                                        </div>
                                                        {
                                                            item.yyzz === "-" ? "" :
                                                                +item.yyzz > 0 ? (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/up2.png" alt=""/>
                                                                ) : (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/down2.png" alt=""/>
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderRight: '1px solid #eaeaea',
                                                }}>
                                                    <img style={{
                                                        width: '0.3rem',
                                                        height: '0.3rem',
                                                        marginBottom: '0.05rem'
                                                    }}
                                                         src="/img/GDP/c1.png" alt=""/>
                                                    <div style={{marginBottom: '0.05rem'}}>利润(亿元)</div>
                                                    <div style={{
                                                        marginBottom: '0.05rem',
                                                        color: '#7ec358',
                                                        fontSize: '0.16rem'
                                                    }}>{item.lrbq}</div>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <div>同比 <span
                                                            style={{color: '#7ec358'}}>{item.lrzz}</span>
                                                        </div>
                                                        {
                                                            item.lrzz === "-" ? "" :
                                                                item.lrzz > 0 ? (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/up2.png" alt=""/>
                                                                ) : (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/down2.png" alt=""/>
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {getName(item.name) &&
                                        <div key={index} style={{
                                            backgroundColor: '#fff',
                                            marginBottom: '0.1rem',
                                            borderRadius: '0.07rem',
                                            padding: '0.1rem 0.15rem',
                                        }}>
                                            <div style={{
                                                paddingLeft: '0.2rem',
                                                height: '0.5rem',
                                                fontSize: '0.16rem',
                                                lineHeight: '0.5rem',
                                                borderRadius: '0.07rem',
                                                background: 'linear-gradient(to right, #3e6af0, #85a1f4)',
                                                color: '#fff',
                                            }}>
                                                {item.name}
                                            </div>
                                            <div style={{
                                                padding: '0.2rem 0',
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr 1fr 1fr'
                                            }}>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    borderRight: '1px solid #eaeaea',
                                                    alignItems: 'center'
                                                }}>
                                                    <img style={{width: '0.3rem', marginBottom: '0.05rem'}}
                                                         src="/img/GDP/q.png" alt=""/>
                                                    <div style={{marginBottom: '0.05rem'}}>企数</div>
                                                    <div style={{
                                                        color: '#3e6af0',
                                                        fontSize: '0.16rem'
                                                    }}>{item.count}</div>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderRight: '1px solid #eaeaea',
                                                }}>
                                                    <img style={{width: '0.3rem', marginBottom: '0.05rem'}}
                                                         src="/img/GDP/c.png" alt=""/>
                                                    <div style={{marginBottom: '0.05rem'}}>产值(亿元)</div>
                                                    <div style={{
                                                        marginBottom: '0.05rem',
                                                        color: '#3e6af0',
                                                        fontSize: '0.16rem'
                                                    }}>{item.czbq}</div>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <div>同比 <span
                                                            style={{color: '#3e6af0'}}>{item.czzz}</span>
                                                        </div>
                                                        {
                                                            item.czzz === "-" ? "" :
                                                                item.czzz > 0 ? (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/up.png" alt=""/>
                                                                ) : (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/down.png" alt=""/>
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderRight: '1px solid #eaeaea',
                                                }}>
                                                    <img style={{
                                                        width: '0.3rem',
                                                        height: '0.3rem',
                                                        marginBottom: '0.05rem'
                                                    }}
                                                         src="/img/GDP/y.png" alt=""/>
                                                    <div style={{marginBottom: '0.05rem'}}>营收(亿元)</div>
                                                    <div style={{
                                                        marginBottom: '0.05rem',
                                                        color: '#3e6af0',
                                                        fontSize: '0.16rem'
                                                    }}>{item.yybq}</div>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <div>同比 <span
                                                            style={{color: '#3e6af0'}}>{item.yyzz}</span>
                                                        </div>
                                                        {
                                                            item.yyzz === "-" ? "" :
                                                                +item.yyzz > 0 ? (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/up.png" alt=""/>
                                                                ) : (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/down.png" alt=""/>
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderRight: '1px solid #eaeaea',
                                                }}>
                                                    <img style={{
                                                        width: '0.3rem',
                                                        height: '0.3rem',
                                                        marginBottom: '0.05rem'
                                                    }}
                                                         src="/img/GDP/l.png" alt=""/>
                                                    <div style={{marginBottom: '0.05rem'}}>利润(亿元)</div>
                                                    <div style={{
                                                        marginBottom: '0.05rem',
                                                        color: '#3e6af0',
                                                        fontSize: '0.16rem'
                                                    }}>{item.lrbq}</div>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <div>同比 <span
                                                            style={{color: '#3e6af0'}}>{item.lrzz}</span>
                                                        </div>
                                                        {
                                                            item.lrzz === "-" ? "" :
                                                                item.lrzz > 0 ? (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/up.png" alt=""/>
                                                                ) : (
                                                                    <img style={{width: '0.1rem'}}
                                                                         src="/img/GDP/down.png" alt=""/>
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {
                                        (!getName(item.name) && !getFirstName(item.name) && !getBigName(item.name)) &&
                                        <div key={index} style={{
                                            backgroundColor: '#fff',
                                            marginBottom: '0.1rem',
                                            borderRadius: '0.07rem',
                                            padding: '0.05rem 0.15rem',
                                        }}>
                                            <div style={{
                                                paddingLeft: '0.1rem',
                                                height: '0.5rem',
                                                fontSize: '0.16rem',
                                                lineHeight: '0.5rem',
                                                borderRadius: '0.07rem',
                                                color: '#666',
                                            }}>
                                                {item.name}
                                            </div>
                                            <div style={{
                                                padding: '0 0',
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr 1fr 1fr'
                                            }}>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center'
                                                }}>
                                                    <div style={{
                                                        color: '#a2acc3',
                                                        fontSize: '0.16rem',
                                                        marginBottom: '0.05rem'
                                                    }}>{item.count}</div>
                                                    <div>企数</div>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                }}>
                                                    <div style={{
                                                        marginBottom: '0.05rem',
                                                        color: '#a2acc3',
                                                        fontSize: '0.16rem'
                                                    }}>{item.czbq}</div>
                                                    <div style={{marginBottom: '0.05rem'}}>产值(亿元)</div>


                                                </div>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                }}>
                                                    <div style={{
                                                        marginBottom: '0.05rem',
                                                        color: '#a2acc3',
                                                        fontSize: '0.16rem'
                                                    }}>{item.yybq}</div>
                                                    <div style={{marginBottom: '0.05rem'}}>营收(亿元)</div>

                                                </div>
                                                <div style={{
                                                    fontSize: '0.12rem',
                                                    color: '#6f6f6f',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderRight: '1px solid #eaeaea',
                                                }}>
                                                    <div style={{
                                                        marginBottom: '0.05rem',
                                                        color: '#a2acc3',
                                                        fontSize: '0.16rem'
                                                    }}>{item.lrbq}</div>
                                                    <div style={{marginBottom: '0.05rem'}}>利润(亿元)</div>

                                                </div>
                                            </div>
                                        </div>
                                    }

                                </div>
                            )
                        })
                    }


                    {/*<Table style={{width: '880px'}} dataSource={list[name[0]]} columns={name[0]!='9'?columns1:columns2} pagination={false}*/}
                    {/*       components={{*/}
                    {/*           header: {*/}
                    {/*               cell: ({children, ...restProps}) => (*/}
                    {/*                   <th {...restProps} style={{*/}
                    {/*                       backgroundColor: '#5070ed',*/}
                    {/*                       color: '#fff',*/}
                    {/*                       // border: '1px solid #fff',*/}
                    {/*                       textAlign: 'center',*/}
                    {/*                   }}>*/}
                    {/*                       {children}*/}
                    {/*                   </th>*/}
                    {/*               )*/}
                    {/*           }*/}
                    {/*       }}*/}
                    {/*/>*/}
                </div>

            </div>
        </div>
    )
}
