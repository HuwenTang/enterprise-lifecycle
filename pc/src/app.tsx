import { Footer, Question, AvatarDropdown, AvatarName } from '@/components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import React, {useEffect} from 'react';
import {primeApi, systemApi, systemApi2} from "@/services/api";
import fixMenuItemIcon from "@/utils/fixMenuItemIcon";
import { fetchUserFeedbackPendingCount } from '@/utils/refreshUserFeedbackBadge';
import {LoginDto, MenuVo} from "@/services/apis";
import {isLanxin} from "@/utils/uaUtil";
import {Badge, message} from "antd";

// 声明外部变量lx
declare const lx: any;
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';
const isLocalPreview = () =>
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const localPreviewState = (
  fetchUserInfo: () => Promise<API.CurrentUser | undefined>,
  badgeCount: number,
  badgeCount1: number,
  badgeCount2: number,
  badgeCount3: number,
  badgeCount4: number,
) => ({
  fetchUserInfo,
  currentUser: { name: '本地预览', access: 'admin', roleIds: ['00'] } as API.CurrentUser,
  badgeCount,
  badgeCount1,
  badgeCount2,
  badgeCount3,
  badgeCount4,
  routes: localPreviewMenu(),
  settings: defaultSettings as Partial<LayoutSettings>,
});

const localPreviewMenu = (): MenuVo[] => ([
  { path: '/home', name: '首页', icon: 'home' },
  { path: '/enterprise/search', name: '企查查', icon: 'audit' },
  { path: '/enterprise/enterpriseSearch', name: '企业查询', icon: 'shop' },
  { path: '/enterprise/tags', name: '标签管理', icon: 'tag' },
  { path: '/investment-activity-register', name: '招商管理', icon: 'shop' },
  { path: '/intention', name: '增资扩产', icon: 'project' },
  {
    path: '/xmgl',
    name: '项目管理',
    icon: 'project',
    children: [
      { path: '/xmgl', name: '项目管理', icon: 'project' },
      { path: '/project-share', name: '项目台账', icon: 'table' },
      { path: '/xmgl2', name: '质态评估', icon: 'barChart' },
      { path: '/xmgl5', name: '开工认定', icon: 'checkCircle' },
      { path: '/xmgl6', name: '竣工认定', icon: 'checkCircle' },
      { path: '/xmgl4', name: '我的项目', icon: 'profile' },
      { path: '/project-recomand', name: '项目推荐', icon: 'star' },
      { path: '/service-track', name: '跟踪服务', icon: 'sync' },
      { path: '/combined-report', name: '项目统计', icon: 'barChart' },
    ],
  },
  { path: '/key-project', name: '重点项目', icon: 'star' },
  { path: '/statistical-report-district', name: '三个大抓', icon: 'barChart' },
  { path: '/combined-report', name: '报表中心', icon: 'barChart' },
  { path: '/gdp/basic-data', name: 'GDP', icon: 'table' },
  { path: '/dataAcquisition/dataImport', name: '材料报送', icon: 'table' },
  { path: '/dataAcquisition/fullChain', name: '数据采集', icon: 'database' },
  { path: '/enterprise-platform', name: '规上工业企业研发平台', icon: 'audit' },
  { path: '/industrial-smart-body', name: '工信智能体', icon: 'audit' },
  { path: '/qa-manage', name: '平台问题反馈', icon: 'infoCircle' },
  { path: '/user/user', name: '用户管理', icon: 'user' },
  {
    path: '/system',
    name: '系统管理',
    icon: 'setting',
    children: [
      { path: '/system/menu', name: '菜单管理', icon: 'table' },
      { path: '/system/settings', name: '系统配置', icon: 'setting' },
    ],
  },
] as MenuVo[]);

const filterPcMenus = (menus: MenuVo[] = []): MenuVo[] =>
  menus
    .filter((item) => item.endpoint === 'PC')
    .map((item) => ({
      ...item,
      children: filterPcMenus(item.children ?? []),
    }));

const withTimeout = async <T,>(task: Promise<T>, fallback: T, timeout = 1800): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      task,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), timeout);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  collapsed?: boolean;
  currentUser?: API.CurrentUser;
  badgeCount?: number;
  badgeCount1?: number;
  badgeCount2?: number;
  badgeCount3?: number;
  badgeCount4?: number;
  routes?:MenuVo[];
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
    // const { default: VConsole } = await import('vconsole');
    // new VConsole();
  const { location } = history;
  const  getQueryParam = (param: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  if (isLocalPreview() && location.pathname !== loginPath && !location.pathname.includes('/tztLogin')) {
    const fetchLocalUserInfo = async () =>
      ({ name: '本地预览', access: 'admin', roleIds: ['00'] } as API.CurrentUser);
    return localPreviewState(fetchLocalUserInfo, 0, 0, 0, 0, 0);
  }

  const [
    badgeCount,
    badgeCount1,
    badgeCount2,
    badgeCount3,
    badgeCount4,
  ] = await Promise.all([
    withTimeout(primeApi.countQualityEvaluation(), 0).catch(() => 0),
    withTimeout(primeApi.countProjectReview(), 0).catch(() => 0),
    withTimeout(primeApi.countProjectStart(), 0).catch(() => 0),
    withTimeout(primeApi.countProjectCompletion(), 0).catch(() => 0),
    withTimeout(fetchUserFeedbackPendingCount(), 0).catch(() => 0),
  ]);

  const fetchUserInfo = async () => {
    try {
      const userInfo = await withTimeout<API.CurrentUser | undefined>(systemApi2.getSession() as any, undefined);
      return userInfo;
    } catch (error) {
        history.push(loginPath);
    }
    return undefined;
  };

  if(location.pathname.includes('/tztLogin')){
    const redirect = getQueryParam('redirect');
    console.log('location.pathname',location.pathname);
    lx.biz.getAuthCode({
      appId: "1572864-14778368",
      success: async function (res: any) {
        // window.location.href = redirect;
        if (redirect) {
          history.push(redirect);
        }
      },
      fail: function (err: any) {
        console.log(err)
      },
    });
  }
  // 如果不是登录页面，执行
  if (location.pathname !== loginPath &&!location.pathname.includes('/tztLogin')) {
    console.log('location.pathname',location.pathname);
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if(code){
      localStorage.setItem('code1', code);
    }
    try {
      const currentUser = await withTimeout<API.CurrentUser | undefined>(systemApi2.getSession() as any, undefined);
      if (!currentUser) {
        if (isDev || isLocalPreview()) {
          return localPreviewState(fetchUserInfo, badgeCount, badgeCount1, badgeCount2, badgeCount3, badgeCount4);
        }
        history.replace(loginPath);
        return {
          fetchUserInfo,
          badgeCount,badgeCount1,badgeCount2,badgeCount3,badgeCount4,
          settings: defaultSettings as Partial<LayoutSettings>,
        };
      }
      let routes = await withTimeout<MenuVo[]>(systemApi2.getRoutes(), []);
      return {
        fetchUserInfo,
        currentUser,
        badgeCount,badgeCount1,badgeCount2,badgeCount3,badgeCount4,
        routes,
        settings: defaultSettings as Partial<LayoutSettings>,
      };
    } catch (e){
      if (isDev || isLocalPreview()) {
        return localPreviewState(fetchUserInfo, badgeCount, badgeCount1, badgeCount2, badgeCount3, badgeCount4);
      }
      history.replace(loginPath)
    }

  }
  return {
    fetchUserInfo,
    badgeCount,badgeCount1,badgeCount2,badgeCount3,badgeCount4,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// 添加路由变化监听函数
const setupRouteChangeListener = () => {
  // 直接设置监听，不需要Hook
  const unlisten = history.listen(() => {
    // 延迟触发resize事件，确保组件已经渲染完成
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  });
  return unlisten;
};

const menuBadgeStyle: React.CSSProperties = {
  marginLeft: '10px',
  width: '20px',
  height: '20px',
  backgroundColor: 'red',
  borderRadius: '50%',
  color: 'white',
  fontSize: '12px',
  textAlign: 'center',
  lineHeight: '20px',
};

/** 菜单待办角标：数量为 0 时不展示 */
const renderMenuBadge = (count?: number) => {
  const n = count ?? 0;
  if (n <= 0) return null;
  return <div style={menuBadgeStyle}>{n}</div>;
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const onCollapse = (collapsed: boolean): void => {
    setInitialState({
      ...initialState,
      collapsed,
    });
  };
  return {
    menuItemRender: (item, dom) => {
      const menuBadgeByPath: Record<string, number | undefined> = {
        '/xmgl2': initialState?.badgeCount,
        '/xmgl3': initialState?.badgeCount1,
        '/xmgl5': initialState?.badgeCount2,
        '/xmgl6': initialState?.badgeCount3,
        '/qa-manage': initialState?.badgeCount4,
      };
      return (
        <div
          onClick={() => {
            console.log(item);
            const path = item.path || '/';
            // 检查路径是否为 http 或 https 开头的 URL
            if (path.startsWith('http://') || path.startsWith('https://')) {
              // 在新标签页打开外部链接
              window.open(path, '_blank');
            } else {
              // 使用路由跳转内部路径
              history.push(path);
            }
            // ---核心逻辑：点击菜单时折叠侧边栏---
            // 仅在移动端（窄屏）或特定场景下折叠
            if (window.innerWidth < 768) {
              setInitialState({...initialState, collapsed: true});
            }
          }}
        >
          {/* 必须保留原菜单 DOM，否则路由跳转失效 */}
          <div style={{display: 'flex', alignItems: 'center'}}>
            {dom}
            {item.path ? renderMenuBadge(menuBadgeByPath[item.path]) : null}
          </div>
        </div>
      );
    },
    onMenuHeaderClick: (e) => {
      console.log(e);
    },
    collapsed: initialState?.collapsed,
    onCollapse: onCollapse,
    menu: {
      request: async () => {
        const configuredMenus = await withTimeout<MenuVo[]>(systemApi.getMenuList().catch(() => []), []);
        const pcMenus = filterPcMenus(configuredMenus);
        return fixMenuItemIcon(pcMenus.length > 0 ? pcMenus : localPreviewMenu());
      },
    },
    actionsRender: () => [<Question key="doc"/>],
    avatarProps: {
      src: '/user.png',
      title: <AvatarName/>,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },

    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        // history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      // {
      //   src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
      //   left: 85,
      //   bottom: 100,
      //   height: '303px',
      // },
      // {
      //   src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
      //   bottom: -68,
      //   right: -45,
      //   height: '303px',
      // },
      // {
      //   src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
      //   bottom: 0,
      //   left: 0,
      //   width: '331px',
      // },
    ],
    links: isDev
      ? [
          // <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          //   <LinkOutlined />
          //   <span>OpenAPI 文档</span>
          // </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // 使用React.memo包装组件来避免不必要的渲染
      const RenderWithRouteListener = React.useMemo(() => {
        // 在组件内部设置路由监听
        const ComponentWithListener = () => {
          React.useEffect(() => {
            const unlisten = setupRouteChangeListener();
            return () => unlisten();
          }, []);

          return (
            <>
              {children}
              {isDev && (
                <SettingDrawer
                  disableUrlParams
                  enableDarkTheme
                  settings={initialState?.settings}
                  onSettingChange={(settings) => {
                    setInitialState((preInitialState) => ({
                      ...preInitialState,
                      settings,
                    }));
                  }}
                />
              )}
            </>
          );
        };

        return ComponentWithListener;
      }, [children, initialState?.settings, isDev]);

      return <RenderWithRouteListener />;
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
