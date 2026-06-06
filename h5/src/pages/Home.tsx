import TabBar from "../components/tabbar";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import AssistantDecision from "../components/Home/AssistantDecision.tsx";
import {systemApi} from "../api.ts";
import {GetMenuEndpointEnum, MenuVo} from "../apis";

/** 鸿蒙/双折叠屏：需新开窗口；普通屏：应用内跳转 */
const isHarmony = typeof navigator !== "undefined" && navigator.userAgent.includes("Harmony");

declare const lx: {
    config: (opts: { appId: string; timestamp: number; nonceStr: string; signature: string }) => void;
    ready: (cb: () => void) => void;
    ui?: { openView: (opts: { mode: string; url: string; navigationBarBackgroundColor?: string; navigationBarFrontStyle?: string; useSplitScreen?: boolean }) => void };
} | undefined;

/** 与 list.vue 一致：必须先 lx.config 成功，lx.ready 回调 / openView 才会生效 */
let lxConfigDone = false;

/** 从 /user/jsapiSign 获取 lx.config 参数并初始化（仅鸿蒙双折叠屏需要，与 list.vue getlxinit 一致） */
async function initLxConfig(): Promise<void> {
    if (!isHarmony) return;
    if (typeof lx === "undefined" || !lx.config) return;
    try {
        const href = window.location.href.split("#")[0];
        const apiUrl = `/system-api/user/jsapiSign?url=${encodeURIComponent(href)}`;
        console.log("[Home] initLxConfig: 请求", apiUrl);
        const res = await fetch(apiUrl);
        const data = await res.json();
        console.log("[Home] initLxConfig: 响应 status", res.status, "data", data);
        const payload = data?.data ?? data;
        const nonceStr = payload?.nonceStr ?? payload?.nonce;
        if (payload?.timestamp != null && nonceStr && payload?.signature) {
            lx.config({
                appId: "1572864-14778368",
                timestamp: Number(payload.timestamp),
                nonceStr: String(nonceStr),
                signature: payload.signature,
            });
            lxConfigDone = true;
            console.log("[Home] initLxConfig: lx.config 已调用，lxConfigDone=true");
        } else {
            console.warn("[Home] initLxConfig: 响应缺少 timestamp/nonceStr/signature", payload);
        }
    } catch (e) {
        console.error("[Home] initLxConfig: 初始化失败", e);
    }
}

/** 菜单项带前端计算的展示颜色 */
type MenuItemWithColor = MenuVo & { color: string };

/**
 * 用 lx 打开新页面（与 list.vue getlx 一致：先 config 再 ready+openView 才有效）
 * 未执行过 lx.config 或 lx 不可用时返回 false，由调用方用 window.open
 */
function openInNewView(url: string): boolean {
    console.log("[Home] openInNewView: url=", url, "lx 存在?", typeof lx !== "undefined", "lx.ui?.openView 存在?", !!lx?.ui?.openView, "lxConfigDone?", lxConfigDone);
    if (typeof lx === "undefined" || !lx?.ui?.openView) {
        console.log("[Home] openInNewView: 无法使用 lx，将走 window.open");
        return false;
    }
    if (!lxConfigDone) {
        console.warn("[Home] openInNewView: lx.config 尚未完成，无法使用 openView，将走 window.open");
        return false;
    }
    try {
        lx.ready(() => {
            console.log("[Home] openInNewView: lx.ready 回调执行，调用 openView", url);
            lx.ui!.openView({
                mode: "webview",
                navigationBarBackgroundColor: "#4E74BB",
                navigationBarFrontStyle: "white",
                url,
                useSplitScreen: false,
            });
        });
        console.log("[Home] openInNewView: 已调用 lx.ready，返回 true");
        return true;
    } catch (e) {
        console.error("[Home] openInNewView: lx.ui.openView 失败", e);
        return false;
    }
}

/** 获取当前站点下某路径的完整 URL（用 origin 作 base，避免 /home/xxx 导致新窗口 404） */
function getFullUrl(path: string) {
    const full = path.startsWith("http") ? path : `${window.location.origin}${path.startsWith("/") ? path : "/" + path}`;
    console.log("[Home] getFullUrl:", path, "->", full);
    return full;
}

export default function Home() {
    const isHome = true;
    const navigate = useNavigate();
    const initialKey = localStorage.getItem('key') ? Number(localStorage.getItem('key')) : 0
    const [key, setKey] = useState(initialKey)
    localStorage.removeItem('currentType')
    const [menuList, setMenuList] = useState<MenuVo[]>()
    const colorPalette = ['#55b516', '#16b1b5', '#f27573', '#627df4', '#ffbc5e', '#52aeb3', '#a7a5a5', '#677cec', '#c58bf2', '#5bd2f5'];
    const getMenu = async () => {
            const data = await systemApi.getMenu({
                endpoint: GetMenuEndpointEnum.H5,
            })
            setMenuList(data)
            console.log(data)
     }

    const tab = [
        {
            name: '前期招商',
            icon: '/img/hometab/key1.png',
            key:0,
            activeIcon: '/img/hometab/key11.png'
        },
        {
            name: '中期推进',
            key:1,
            icon: '/img/hometab/key2.png',
            activeIcon: '/img/hometab/key22.png'
        },
        {
            name: '后期服务',
            key:2,
            icon: '/img/hometab/key3.png',
            activeIcon: '/img/hometab/key33.png'
        }
    ]
    const findMenuByName = (list: MenuVo[] | undefined, menuName: string): MenuVo | undefined => {
        if (!list) return undefined;
        for (const item of list) {
            if (item.name === menuName) return item;
            const childHit = findMenuByName(item.children, menuName);
            if (childHit) return childHit;
        }
        return undefined;
    }

    /** 菜单名称命中时进入「审核统计」中间页，再进列表；其余仍走菜单配置的 path */
    const getAuditStatsPath = (menuName: string, defaultPath: string) => {
        const map: Record<string, string> = {
            部门预评估: "/audit-stats/pre-evaluation",
            签约核定: "/audit-stats/signing-approval",
            开工认定: "/audit-stats/project-start",
            竣工认定: "/audit-stats/project-completion",
        };
        return map[menuName] ?? defaultPath;
    };

    const pickColor = (name: string, index: number) => {
        if (!name) return colorPalette[index % colorPalette.length];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i);
            hash |= 0;
        }
        return colorPalette[Math.abs(hash + index) % colorPalette.length];
    }

    const buildItems = (menuName: string): MenuItemWithColor[] => {
        const menu = findMenuByName(menuList, menuName);
        return menu?.children?.map((child, index) => ({
            ...child,
            color: pickColor(child.name, index)
        })) ?? [];
    };

    const items1 = buildItems('前期招商');
    const items2 = buildItems('中期推进');
    const items3 = buildItems('后期服务');

    /** 鸿蒙双折叠屏：新开窗口（lx 或 window.open）；普通屏：应用内路由跳转 */
    const handleNavigate = (path: string) => {
        if (!path) return;
        if (isHarmony) {
            const url = getFullUrl(path);
            if (!openInNewView(url)) window.open(url, "_blank");
        } else {
            navigate(path);
        }
    };

    /** 鸿蒙双折叠屏：新开窗口；普通屏：当前页跳转或新标签 */
    const handleOpenUrl = (url: string, openInNewTab = false) => {
        if (isHarmony) {
            if (!openInNewView(url)) window.open(url, "_blank");
        } else {
            if (openInNewTab) window.open(url, "_blank");
            else window.location.href = url;
        }
    };

    useEffect(() => {
        initLxConfig();
        getMenu();
    }, []);
  return (
      <div style={{
          minHeight: '100vh',
          fontSize: '0.14rem',
          backgroundColor: '#f0f2f6'
      }}>
          <div style={{
              width: '100%',
              height: '2.0rem',
              backgroundImage: 'url(/img/banner.png)',
              backgroundSize: 'cover',
              padding: '0.2rem',
              boxSizing: 'border-box',
          }}>
              <div style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  marginRight: '0.2rem',
                  fontWeight: 'bolder',
                  fontSize: '0.20rem',
                  marginTop: '0.5rem',
                  color: '#fff'
              }}>
                  <div>
                      企业全生命周期管理服务平台
                  </div>
              </div>
          </div>
              <div className={'tab-bar-container'} style={{width: '100%', padding: '0.2rem', boxSizing: 'border-box',}}>
                  <div style={{
                      padding: '0.2rem',
                      borderRadius: '0.1rem',
                      backgroundColor: '#fff',
                  }}>
                      <div style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                      }}>
                          {
                              tab.map((item, index) => {
                                  return <div style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                  }} onClick={() => {
                                      setKey(index);
                                      localStorage.setItem('key',index.toString())
                                  }} key={index}>
                                      {
                                          key === index && <img src={item.icon} alt="" style={{
                                              width: '0.45rem',
                                              height: '0.45rem',
                                          }}/>
                                      }
                                      {
                                          key != index && <img src={item.activeIcon} alt="" style={{
                                              width: '0.45rem',
                                              height: '0.45rem',
                                          }}/>
                                      }
                                      <div style={{
                                          marginTop: '0.05rem',
                                          marginBottom: '0.1rem',
                                      }}>
                                          {item.name}
                                      </div>
                                  </div>
                              })
                          }
                      </div>
                      {
                          key === 0 && <div style={{
                              borderTop: '1px solid #edeef1',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'left',
                              flexWrap: 'wrap',
                          }}>
                              {
                                  items1.map((item, index) => {
                                      return <div onClick={() => {
                                          handleNavigate(getAuditStatsPath(item.name, item.path ?? ""))
                                      }} style={{
                                          display: 'flex',
                                          width: '25%',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          marginTop: '0.2rem',
                                      }} key={index}>
                                          <div style={{
                                              width: '0.4rem',
                                              height: '0.4rem',
                                              borderRadius: '0.2rem',
                                              backgroundColor: item.color,
                                              display: 'flex',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                          }}>
                                              <img src={item.icon} alt=""/>
                                          </div>
                                          <div style={{
                                              marginTop: '0.15rem',
                                              textAlign: 'center',
                                              fontSize: '0.12rem',
                                          }}>
                                              {item.name}
                                          </div>

                                      </div>
                                  })
                              }
                          </div>
                      }
                      {
                          key === 1 && <div style={{
                              borderTop: '1px solid #edeef1',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'left',
                              flexWrap: 'wrap',
                          }}>
                              {
                                  items2.map((item, index) => {
                                      return <div onClick={() => {
                                          handleNavigate(getAuditStatsPath(item.name, item.path ?? ""))
                                      }} style={{
                                          display: 'flex',
                                          width: '25%',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          marginTop: '0.2rem',
                                      }} key={index}>
                                          <div style={{
                                              width: '0.4rem',
                                              height: '0.4rem',
                                              borderRadius: '0.2rem',
                                              backgroundColor: item.color,
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

                                      </div>
                                  })
                              }
                          </div>
                      }
                      {
                          key === 2 && <div style={{
                              borderTop: '1px solid #edeef1',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'left',
                              flexWrap: 'wrap',
                          }}>
                              {
                                  items3.map((item, index) => {
                                      return <div onClick={() => {
                                          handleNavigate(getAuditStatsPath(item.name, item.path ?? ""))
                                      }} style={{
                                          display: 'flex',
                                          width: '25%',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          marginTop: '0.2rem',
                                      }} key={index}>
                                          <div style={{
                                              width: '0.4rem',
                                              height: '0.4rem',
                                              borderRadius: '0.2rem',
                                              backgroundColor: item.color,
                                              display: 'flex',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                          }}>
                                              <img style={{width: '0.20rem',}} src={item.icon} alt=""/>
                                          </div>
                                          <div style={{
                                              marginTop: '0.15rem',
                                              textAlign: 'center',
                                              fontSize: '0.12rem',
                                          }}>
                                              {item.name}
                                          </div>

                                      </div>
                                  })
                              }
                          </div>
                      }
                  </div>
              </div>

          <div style={{
              padding: '0 0.2rem'
          }}>
              <div style={{
                  marginTop: '0.2rem',
                  color: '#fff',
                  borderRadius: '0.1rem',
                  padding: '0.1rem 0.25rem',
                  background: 'linear-gradient(to bottom, #82b3ed 13%, #617bf4)',
                  position: 'relative',
              }}>
                  <div onClick={() => {
                      handleOpenUrl('https://pztz.scjgj.taizhou.gov.cn/h6/#/pages/search/index?key=&out=1')
                  }}>
                      <div style={{
                          fontSize: '0.18rem',
                          marginBottom: '0.1rem',
                      }}>一企一档
                      </div>
                      <div>企业相关信息</div>
                  </div>
                  <div style={{
                      position: 'absolute',
                      right: '.23333rem',
                      width: '1rem',
                      top: '-.4rem',
                      height: '1.2rem',
                  }}>
                      <img style={{
                          width: '100%',
                          height: '100%'
                      }} src="/img/comp.png" alt=""/>
                  </div>
              </div>
          </div>

          <div onClick={() => {
              handleOpenUrl(getFullUrl('/prime-api/qichacha/qichacha-h5?returnUrl=/?hideNavFlag=Y'), true)
          }} style={{
              boxShadow: '0 0.05rem 0.1rem rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f6f6f6',
              borderRadius: '0.4rem',
              color: '#333',
              width: '0.6rem',
              height: '0.6rem',
              position: 'fixed',
              bottom: '3rem',
              right: '0.2rem',
              display: 'flex',
              flexDirection: 'column',
              fontSize: '0.10rem',
              justifyContent: 'center',
              alignItems: 'center',
          }}>
              <img src="/img/hometab/fuzhuItem/4.jpg" style={{width: '0.25rem',}} alt=""/>
              <div>企查查</div>
          </div>

          <div style={{
              marginTop: '0.2rem',
              padding: '0 0.2rem 0.8rem 0.2rem '
          }}>
              <AssistantDecision menuList={menuList} onNavigate={handleNavigate} onOpenUrl={handleOpenUrl}/>
          </div>

          <TabBar isHome={isHome}/>
      </div>
  );
}
