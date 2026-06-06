import {MenuVo} from "@/services/apis";

/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser ,routes: MenuVo[]} | undefined) {
  const { currentUser, routes } = initialState ?? {};
  const getPathname = (str?: string) => (str ? new URL(str, location.href).pathname : '');

  /** 超级管理员（roleIds 包含 00）或系统管理员（access=admin） */
  const canSuperAdmin = (() => {
    if (currentUser && (currentUser as any).access === 'admin') return true;
    const superAdminRoleId = '00';
    const roleIds: string[] = Array.isArray((currentUser as any)?.roleIds)
      ? ((currentUser as any).roleIds as any[]).map((x) => String(x))
      : [];
    return roleIds.includes(superAdminRoleId);
  })();

  /** 是否拥有「重点项目-推送」按钮权限（来自角色管理分配的 routes） */
  const canKeyProjectPush = (() => {
    // 管理员始终放行
    if (currentUser && (currentUser as any).access === 'admin') return true;

    // 角色管理接口 /system-api/role/all?organizationIds=0 返回的 value
    // value = 88811258718000188 => 重点项目权限（推送按钮可见）
    // value = 00 => 超级管理员
    const keyProjectRoleId = '88811258718000188';
    const superAdminRoleId = '00';
    const roleIds: string[] = Array.isArray((currentUser as any)?.roleIds)
      ? ((currentUser as any).roleIds as any[]).map((x) => String(x))
      : [];
    if (roleIds.includes(superAdminRoleId)) return true;
    if (roleIds.includes(keyProjectRoleId)) return true;
    return false;
  })();

  /** 增资扩产入库审核（项目管理7「更多」）：仅角色 00 或 98091462643000183 可见 */
  const canWarehouseReview = (() => {
    const allowedRoleIds = ['00', '98091462643000183'];
    const roleIds: string[] = Array.isArray((currentUser as any)?.roleIds)
      ? ((currentUser as any).roleIds as any[]).map((x) => String(x))
      : [];
    return allowedRoleIds.some((id) => roleIds.includes(id));
  })();

  /** 动态路由如 /foo/detail/:id 不在菜单里单独配置时，若用户已有父级 /foo 权限则放行 */
  const normalRouteFilter = (route: { path: string | undefined }) => {
    if (!route.path) return false;
    if (['localhost', '127.0.0.1'].includes(window.location.hostname)) return true;
    if (canSuperAdmin) return true;
    const inMenu = routes?.some((item) => getPathname(item.path) === route.path);
    if (inMenu) return true;
    const pathNoParams = route.path.replace(/\/:[^/]+/g, '');
    return (
      routes?.some((item) => {
        const p = getPathname(item.path);
        if (!p) return false;
        return pathNoParams === p || pathNoParams.startsWith(p + '/');
      }) ?? false
    );
  };
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    canAccess: true,
    canSuperAdmin,
    canKeyProjectPush,
    canWarehouseReview,
    normalRouteFilter,
  };
}
