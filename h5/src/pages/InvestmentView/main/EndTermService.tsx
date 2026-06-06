import {useState} from "react";
import dayjs from "dayjs";

export default function EndTermService({project}: { project: any }) {
    const [active, setActive] = useState('1')
    const tabList = [
        {
            key: '1',
            tab: '开工',
        },
        {
            key: '2',
            tab: '竣工',
        }
    ]
    const [active2, setActive2] = useState('1')
    return (
        <div style={{
            marginTop: '0.2rem',
            fontSize: '0.12rem',
        }}>
            <div style={{
                padding: '0.1rem 0',
                color: '#666',
                width: '100%',
                textAlign: 'center',
                marginBottom: '0.2rem',
            }}>
                更新日期：{dayjs().format('YYYY-MM-DD')}
            </div>
            <div style={{}}>
                <div style={{
                    margin: '0.1rem 0',
                    display: 'flex',
                }}>
                    <div onClick={() => setActive2('1')} style={{
                        marginRight: '0.1rem',
                        fontSize: '0.12rem',
                        width: '49%',
                        height: '0.32rem',
                        borderRadius: '0.05rem',
                        color: active2 === '1' ? '#fff' : '#666',
                        backgroundColor: active2 === '1' ? '#337cfd' : '#eff4fd',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>开工
                    </div>
                    <div onClick={() => setActive2('2')} style={{
                        fontSize: '0.12rem',
                        width: '49%',
                        height: '0.32rem',
                        borderRadius: '0.05rem',
                        color: active2 === '2' ? '#fff' : '#666',
                        backgroundColor: active2 === '2' ? '#337cfd' : '#eff4fd',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>竣工
                    </div>
                </div>
                {
                    active2 === '1' && <div>
                        <div style={{
                            padding: '0 0.2rem',
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                开工时间 ：
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project?.startConfirmDate && dayjs(project?.startConfirmDate).format('YYYY-MM-DD')}
                            </div>
                        </div>

                    </div>
                }

                {
                    active2 === '2' && <div>
                        <div style={{
                            padding: '0 0.2rem',
                            marginBottom: '0.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{width: '50%', color: '#86909c'}}>
                                竣工时间 ：
                            </div>
                            <div style={{width: '50%', textAlign: 'right'}}>
                                {project?.endConfirmDate && dayjs(project?.endConfirmDate).format('YYYY-MM-DD')}
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
