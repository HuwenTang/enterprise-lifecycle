import {useNavigate} from "react-router-dom";
import {useMemo} from "react";
import {MenuVo} from "../../apis";

interface Props {
    menuList?: MenuVo[];
    /** 鸿蒙双折叠屏时由 Home 传入，走新开窗口/lx 全屏 */
    onNavigate?: (path: string) => void;
    onOpenUrl?: (url: string, openInNewTab?: boolean) => void;
}

export default function AssistantDecision({menuList, onNavigate, onOpenUrl}: Props){
    const navigate = useNavigate()

    const findMenuByName = (list: MenuVo[] | undefined, menuName: string): MenuVo | undefined => {
        if (!list) return undefined;
        for (const item of list) {
            if (item.name === menuName) return item;
            const childHit = findMenuByName(item.children, menuName);
            if (childHit) return childHit;
        }
        return undefined;
    }

    const colorPalette = ['#55b516', '#16b1b5', '#f27573', '#627df4', '#ffbc5e', '#52aeb3', '#a7a5a5', '#677cec', '#c58bf2', '#5bd2f5'];
    const pickColor = (name: string, index: number) => {
        if (!name) return colorPalette[index % colorPalette.length];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i);
            hash |= 0;
        }
        return colorPalette[Math.abs(hash + index) % colorPalette.length];
    }

    const assistItems = useMemo(() => {
        const menu = findMenuByName(menuList, '辅助决策');
        if (!menu || !menu.children?.length) return [];
        return menu.children.map((child: any, index: number) => ({
            name: child.name,
            subTitle: child.subTitle || '',
            icon: child.icon,
            path: child.path || '',
            color: (child as any).color || pickColor(child.name, index),
            show: true
        }));
    }, [menuList]);
    return(
        <div>
            <div style={{
                fontSize: '0.18rem',
                color: '#333',
                fontWeight: 'bold',
            }}>
                辅助决策
            </div>
            <div style={{
                borderTop: '1px solid #edeef1',
                width: '100%',
                display: 'flex',
                justifyContent: 'left',
                flexWrap: 'wrap',
            }}>
                {
                    assistItems.map((item, index) => {
                        return(
                            <div onClick={() => {
                                if ((item as any).url) {
                                    if (onOpenUrl) onOpenUrl((item as any).url, true);
                                    else window.open((item as any).url, '_blank');
                                } else {
                                    if (onNavigate) onNavigate(item.path);
                                    else navigate(item.path);
                                }
                            }} style={{
                                display: 'flex',
                                width: '25%',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginTop: '0.2rem',
                            }} key={index}>
                                <div style={{
                                    width: '0.5rem',
                                    height: '0.5rem',
                                    borderRadius: '0.2rem',
                                    backgroundColor: item.name === '问题反馈' ? 'red' : '#dbe0f8',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <img style={{
                                        width: '0.25rem',
                                        height: '0.25rem',
                                    }} src={item.icon} alt=""/>
                                </div>
                                <div style={{
                                    marginTop: '0.15rem',
                                    textAlign: 'center',
                                    fontSize: '0.12rem',
                                }}>
                                    {item.name}
                                </div>
                                <div style={{
                                    // marginTop: '0.15rem',
                                    textAlign: 'center',
                                    fontSize: '0.12rem',
                                }}>
                                    {item.subTitle}
                                </div>
                            </div>
                        )
                    })
                }
                {
                    <div onClick={() => {
                        if (onNavigate) onNavigate('/qa-report');
                        else navigate('/qa-report');
                    }} style={{
                        display: 'flex',
                        width: '25%',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '0.2rem',
                    }}>
                        <div style={{
                            width: '0.5rem',
                            height: '0.5rem',
                            borderRadius: '0.2rem',
                            backgroundColor: 'red',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <img style={{
                                width: '0.25rem',
                                height: '0.25rem',
                            }} src="/img/qa.png" alt=""/>
                        </div>
                        <div style={{
                            marginTop: '0.15rem',
                            textAlign: 'center',
                            fontSize: '0.12rem',
                        }}>
                            平台问题反馈
                        </div>
                        <div style={{
                            textAlign: 'center',
                            fontSize: '0.12rem',
                        }}>
                        </div>
                    </div>
                }
                {/*{*/}
                {/*    isDataQuery&&GdpList.map((item, index) => {*/}
                {/*        return(*/}
                {/*            <div onClick={() => {*/}
                {/*                navigate(item.path)*/}
                {/*            }} style={{*/}
                {/*                display: 'flex',*/}
                {/*                width: '25%',*/}
                {/*                flexDirection: 'column',*/}
                {/*                alignItems: 'center',*/}
                {/*                marginTop: '0.2rem',*/}
                {/*            }} key={index}>*/}
                {/*                <div style={{*/}
                {/*                    width: '0.5rem',*/}
                {/*                    height: '0.5rem',*/}
                {/*                    borderRadius: '0.2rem',*/}
                {/*                    backgroundColor: '#dbe0f8',*/}
                {/*                    display: 'flex',*/}
                {/*                    justifyContent: 'center',*/}
                {/*                    alignItems: 'center',*/}
                {/*                }}>*/}
                {/*                    <img style={{*/}
                {/*                        width: '0.25rem',*/}
                {/*                        height: '0.25rem',*/}
                {/*                    }} src={item.icon} alt=""/>*/}
                {/*                </div>*/}
                {/*                <div style={{*/}
                {/*                    marginTop: '0.15rem',*/}
                {/*                    textAlign: 'center',*/}
                {/*                    fontSize: '0.12rem',*/}
                {/*                }}>*/}
                {/*                    {item.name}*/}
                {/*                </div>*/}
                {/*                <div style={{*/}
                {/*                    // marginTop: '0.15rem',*/}
                {/*                    textAlign: 'center',*/}
                {/*                    fontSize: '0.12rem',*/}
                {/*                }}>*/}
                {/*                    {item.subTitle}*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        )*/}
                {/*    })*/}
                {/*}*/}
            </div>
        </div>
    )
}
