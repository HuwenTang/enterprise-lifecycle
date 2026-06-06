import {useEffect, useState} from "react";
import {Table} from "antd";
import './main.css'
import {primeApi} from "../../../api.ts";
import {QyxmJzTjxx} from "../../../apis";

export default function ProjectNeed(e:{year:string}) {
    const {year} = e
    const [data, setData] = useState([])
    const getQyxmJzTjxxViews =async ()=>{
        const data = await primeApi.getQyxmJzTjxxCountyViews({year:+year})
        setData([
            {name:'已签约',value:data.yqysl,value2:data.yqyje},
            {name:'已注册',value:data.yzcsl,value2:data.yzcje},
            {name:'已报备',value:data.ybasl,value2:data.ybaje},
            {name:'完成报批',value:data.wcbpsl,value2:data.wcbpje},
            {name:'已开工',value:data.ykgsl,value2:data.ykgje},
            {name:'已竣工',value:data.yjgsl,value2:data.yjgje}
        ])
        console.log('getQyxmJzTjxxViews',data,

            )
    }
    // const [year, setYear] = useState('项目进展情况')
    const dataSource1 = [{
        name:'总计',
        b1:'1975.26',
        c1:'451',
        b2:'176.92',
        c2:'31',
        b3:'17.01',
        c3:'4',
        b4:'1.48',
        c4:'1',
        b5:'0',
        c5:'0',
        b6:'0',
        c6:'0'
    }]
    const columns = [
        {
            title: '板块',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            fixed: 'left',
            className:'thColor',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: '项目数',
            dataIndex: 'value',
            width: 150,
            key: 'value',
            className:'thColor'
        },
        {
            title: (
                <div>
                    <div>投资总额</div>
                    <div>（亿元）</div>
                </div>
            ),
            dataIndex: 'value2',
            key: 'value2',
            width: 150,
            className:'thColor'
        },

    ];

    useEffect(() => {
        getQyxmJzTjxxViews()
    }, [year]);
    return (
        <div className="project-process">
            <div style={{
                marginBottom: '0.2rem',
                display: 'flex',
                // justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{
                    fontSize: '0.16rem',
                    fontWeight: 'bold',
                }}>项目进展
                </div>
                {/*<ProcessPick year={year} setYear={setYear}/>*/}
            </div>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered
                size="middle"
            />
        </div>
    )
}
