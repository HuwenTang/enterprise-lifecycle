import {useEffect, useState,} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import TopBarColor from "../components/TopBar/TopBarColor.tsx";
import {DatePicker, Form, Input, message, Select, Upload, UploadFile, UploadProps} from "antd";
import dayjs from "dayjs";
import { PlusOutlined} from "@ant-design/icons";
import {primeApi, systemApi} from "../api.ts";
import {UserFeedbackDto} from "../apis";
const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

export default function QaReport() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('id')
    const org = JSON.parse(localStorage.getItem('dept')||'')
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const now = new Date();
    const [orgList, setOrgList] = useState([])
    const name = localStorage.getItem('name')
    const [form] = Form.useForm()

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);
        console.log(fileList)
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
        </button>
    );

    const createUserFeedback = async (values:UserFeedbackDto) => {
        const data = await primeApi.createUserFeedback({userFeedbackDto:values})
        console.log(data)
    }

    const onFinish = (values:any) => {
        if(fileList.length===0){
            message.error('请上传文件')
            return
        }
        console.log(values)
        const list:string[] = []
        for(let i=0;i<fileList.length;i++){
            list.push(
                fileList[i].response[0].path,
            )
        }
        const orgId = typeof values.org === 'object' && values.org != null
            ? values.org.value
            : values.org
        createUserFeedback({
            orgId,
            content: values.content,
            images: list,
            images2: [],
            operator: '平台运营组',
        }).then(res => {
            console.log(res)
            message.success('提交成功')
            localStorage.removeItem('key')
            navigate("/home")
        })

    }

    const getMyOrganization = async () => {
        const data = await systemApi.getMyOrganization()
        const list = data.map(item=>{
            return {
                label: item.cobName,
                value: item.cobId
            }
        })
        form.setFieldsValue({
            org: list[0],
        })
        console.log(list)
        setOrgList(list)
    }
    useEffect(()=>{
        console.log(org)
        getMyOrganization()
        form.setFieldsValue({
            useName: name,
            org: orgList[0],
        })
    },[])
    return (
        <div style={{
            height: '100vh',
            fontSize: '0.16rem',
            overflow: 'scroll',
            scrollbarWidth: 'none',
            backgroundColor: '#f6f8f9'
        }}>
            <TopBarColor color={'#60a9ff'} title={'平台问题反馈'} time={false} />
            <div style={{
                padding: '0.2rem',
            }}>

                <div style={{backgroundColor: '#fff', padding: '0.2rem'}}>
                    <Form
                        form={form}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            rules={[{ required: true, message: '请输入姓名' }]}
                            name='useName'
                            label='反馈人'
                        >
                            <Input disabled placeholder='请输入姓名' />
                        </Form.Item>

                        <Form.Item
                            rules={[{ required: true, message: '请选择所属单位' }]}
                            name='org'
                            label='所属单位'
                        >
                           <Select disabled={orgList.length===1} placeholder='请选择所属单位' options={orgList}/>
                        </Form.Item>

                        <Form.Item
                            name='date'
                            label='反馈时间'
                        >
                            <DatePicker style={{width:'100%'}} disabled defaultValue={dayjs(now)} />
                        </Form.Item>

                        <Form.Item
                            rules={[{ required: true, message: '请输入问题描述' }]}
                            name='content'
                            label='问题描述'
                        >
                            <Input.TextArea maxLength={200}  placeholder='请输入问题描述' />
                        </Form.Item>
                        <Form.Item label="上传图片" valuePropName="fileList" getValueFromEvent={normFile}  rules={[{ required: true, message: '请上传文件模版' }]}>
                            <Upload
                                action="/system-api/file"
                                listType="picture-card"
                                accept="image/*"
                                fileList={fileList}
                                // onPreview={handlePreview}
                                onChange={handleChange}
                            >
                                {fileList.length >= 8 ? null : uploadButton}
                            </Upload>

                        </Form.Item>

                        <Form.Item>
                            <button style={{
                                backgroundColor: '#60a9ff',
                                color: '#fff',
                                border: 'none',
                                padding: '0.2rem',
                                borderRadius: '0.1rem',
                                cursor: 'pointer',
                                width: '100%'
                            }} type="submit">提交</button>
                        </Form.Item>
                    </Form>
                </div>

            </div>
        </div>
    );
}
