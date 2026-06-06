import TopBarColor from "../../../components/TopBar/TopBarColor.tsx";
import {useEffect, useState} from "react";
import ProBasicInfo from "./Components/ProBasicInfo.tsx";
import PreInvestment from "./Components/PreInvestment.tsx";
import {primeApi, systemApi} from "../../../api.ts";
import {useSearchParams} from "react-router-dom";
import MidTermPromotion from "./MidTermPromotion.tsx";
import EndTermService from "./EndTermService.tsx";
import {Modal, Input, DatePicker, Upload, UploadFile, UploadProps, Button, message} from "antd";
import dayjs, {Dayjs} from "dayjs";
import {PlusOutlined} from "@ant-design/icons";
import {FileDownloadVo} from "../../../apis";

export default function ProjectDetail() {
    const [project, setProject] = useState<any>({})
    const [project1, setProject1] = useState<any>({})
    const [project2, setProject2] = useState<any>({})
    const [active, setActive] = useState('1')
    const [modalVisible, setModalVisible] = useState(false)
    const [session, setSession] = useState<any>(null)
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [description, setDescription] = useState('')
    const [appealDate, setAppealDate] = useState<Dayjs>(dayjs())
    const tabList = [
        {
            key: '1',
            tab: '基本信息',
        },
        {
            key: '2',
            tab: '前期招商',
        },
        {
            key: '3',
            tab: '中期推进',
        },
        {
            key: '4',
            tab: '后期服务',
        }
    ]
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const zsid = searchParams.get('zsid')
    const [isCom, setIsCom] = useState(searchParams.get('isCom'))
    const getAdvance = async () => {
        const data = await primeApi.getProjectDigitalInvestmentAttracting({ id: id! })
        // console.log(data)
        // setProject(data)
    }

    const getSession = async () => {
        try {
            const data = await systemApi.getSession()
            setSession(data)
        } catch (e) {
            console.error(e)
        }
    }

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const handleSubmit = async () => {
        if (!description || description.trim() === '') {
            message.warning('请输入问题描述')
            return
        }
        if (fileList.length === 0) {
            message.warning('请上传文件')
            return
        }

        const images: FileDownloadVo[] = []
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i]
            if (file.response && file.response[0]) {
                images.push({
                    name: file.name || '',
                    path: file.response[0].path
                })
            } else if (file.url) {
                images.push({
                    name: file.name || '',
                    path: file.url
                })
            }
        }

        if (images.length === 0) {
            message.warning('请等待文件上传完成')
            return
        }

        try {
            await primeApi.createProjectAppeal({
                projectAppealDto: {
                    investmentId: id || '',
                    description: description,
                    images: images
                }
            })
            message.success('提交成功')
            setModalVisible(false)
            setDescription('')
            setFileList([])
            setAppealDate(dayjs())
        } catch (e) {
            message.error('提交失败')
            console.error(e)
        }
    }

    useEffect(()=>{
        console.log(id)
        getSession()
        // getAdvance()
        primeApi.getProjectDigitalInvestmentAttracting({ id: id! }).then((res) => {

            setProject(res)
            if(res.onlineApprovalId){
                primeApi.getProjectOnlineApproval({ id :res.onlineApprovalId!}).then((res) => {
                    setProject1(res);
                });
            }
            if(res.constructionApprovalId){
                primeApi.getProjectConstructionApproval({ id :res.constructionApprovalId!}).then((res) => {
                    setProject2(res);
                });
            }
        });
    },[])
  return (
    <div style={{
        height: '100vh',
        fontSize: '0.16rem',
        overflow: 'scroll',
        scrollbarWidth: 'none',
        backgroundColor: '#fff'
    }}>
        <TopBarColor color={'#60a9ff'} title={'项目详情'} time={false} />
        <div style={{
            padding: '0 0.2rem',
        }}>
            <div style={{
                backgroundColor: '#fff',
            }}>
                <div style={{
                    padding: '0.1rem 0',
                    fontSize: '0.2rem',
                    fontWeight: 'bolder',
                    textAlign: 'center',
                }}>
                    {project.projectName}
                </div>
                <div style={{
                    margin: '0.1rem 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    {
                        tabList.map((item,index) => {
                            return (
                                <div key={index} style={{
                                    fontSize: '0.12rem',
                                    width:'23%',
                                    height: '0.32rem',
                                    borderRadius:'0.05rem',
                                    color:  active === item.key ? '#fff' : '#666',
                                    backgroundColor: active === item.key ? '#337cfd' : '#eff4fd',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }} onClick={() => {
                                    setActive(item.key)
                                }}>
                                    {item.tab}
                                </div>
                            )
                        })
                    }
                </div>
                {
                    active==='1'&&<ProBasicInfo id={id} zsid={zsid} project={project} isCom={isCom} setIsCom={setIsCom}/>
                }
                {
                    active==='2'&&<PreInvestment project={project}/>
                }
                {
                    active==='3'&&<MidTermPromotion project={project} project1={project1} project2={project2}/>
                }
                {
                    active==='4'&&<EndTermService project={project}/>
                }
            </div>
        </div>
        {/* 浮动申诉按钮 */}
        <div
            onClick={() => setModalVisible(true)}
            style={{
                position: 'fixed',
                right: '0.2rem',
                bottom: '100px',
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '50%',
                backgroundColor: '#60a9ff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
        >
            <span style={{ color: '#fff', fontSize: '0.24rem' }}>申</span>
        </div>

        {/* 申诉 Modal */}
        <Modal
            title="项目申诉"
            open={modalVisible}
            onCancel={() => {
                setModalVisible(false)
                setDescription('')
                setFileList([])
            }}
            footer={null}
            width="90%"
            style={{ top: '5%' }}
        >
            <div style={{ padding: '0.2rem 0' }}>
                {/* 申诉人 */}
                <div style={{ marginBottom: '0.2rem' }}>
                    <div style={{ color: '#86909c', marginBottom: '0.1rem', fontSize: '0.14rem' }}>申诉人</div>
                    <Input
                        value={session?.realName || ''}
                        disabled
                        style={{ width: '100%' }}
                    />
                </div>

                {/* 所属单位 */}
                <div style={{ marginBottom: '0.2rem' }}>
                    <div style={{ color: '#86909c', marginBottom: '0.1rem', fontSize: '0.14rem' }}>所属单位</div>
                    <Input
                        value={session?.organizations?.[0]?.cobName || ''}
                        disabled
                        placeholder="自动获取所属单位"
                        style={{ width: '100%' }}
                    />
                </div>

                {/* 申诉时间 */}
                <div style={{ marginBottom: '0.2rem' }}>
                    <div style={{ color: '#86909c', marginBottom: '0.1rem', fontSize: '0.14rem' }}>申诉时间</div>
                    <DatePicker
                        value={appealDate}
                        onChange={(date) => setAppealDate(date || dayjs())}
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                    />
                </div>

                {/* 申诉项目 */}
                <div style={{ marginBottom: '0.2rem' }}>
                    <div style={{ color: '#86909c', marginBottom: '0.1rem', fontSize: '0.14rem' }}>申诉项目</div>
                    <Input
                        value={project.projectName || ''}
                        disabled
                        style={{ width: '100%' }}
                    />
                </div>

                {/* 问题描述 */}
                <div style={{ marginBottom: '0.2rem' }}>
                    <div style={{ color: '#86909c', marginBottom: '0.1rem', fontSize: '0.14rem' }}>
                        问题描述 <span style={{ color: '#ff4d4f' }}>*</span>
                    </div>
                    <Input.TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="请输入"
                        maxLength={200}
                        autoSize={{ minRows: 4, maxRows: 6 }}
                        style={{ width: '100%' }}
                        showCount
                    />
                </div>

                {/* 文件上传 */}
                <div style={{ marginBottom: '0.2rem' }}>
                    <div style={{ color: '#86909c', marginBottom: '0.1rem', fontSize: '0.14rem' }}>
                        文件上传 <span style={{ color: '#ff4d4f' }}>*</span>
                    </div>
                    <Upload
                        action="/system-api/file"
                        listType="text"
                        fileList={fileList}
                        onChange={handleChange}
                    >
                        <Button icon={<PlusOutlined />}>上传文件</Button>
                    </Upload>
                </div>

                {/* 按钮 */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.3rem', gap: '0.1rem' }}>
                    <Button onClick={() => {
                        setModalVisible(false)
                        setDescription('')
                        setFileList([])
                    }}>
                        取消
                    </Button>
                    <Button type="primary" onClick={handleSubmit}>
                        提交
                    </Button>
                </div>
            </div>
        </Modal>
    </div>
  );
}
