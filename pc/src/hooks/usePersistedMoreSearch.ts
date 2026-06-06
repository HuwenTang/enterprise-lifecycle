import { useLocation } from '@umijs/max';
import { useCallback, useEffect, useState } from 'react';

/** 项目管理（xmgl～xmgl7）列表页共用，切换路由后「更多查询」展开状态保持一致 */
const XMGL_SUITE_STORAGE_KEY = 'pm_more_query_expanded:xmgl_suite';

/** 仅 /xmgl、/xmgl2 … /xmgl7；不含 xmgl8/9/10、子路由（如 /xmgl/xmjd） */
function isProjectManageListSuiteRoute(pathname: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  if (p === '/xmgl') return true;
  return /^\/xmgl[2-7]$/.test(p);
}

const LEGACY_SUITE_PATHS = ['/xmgl', '/xmgl2', '/xmgl3', '/xmgl4', '/xmgl5', '/xmgl6', '/xmgl7'] as const;

function storageKeyForPath(pathname: string): string {
  return isProjectManageListSuiteRoute(pathname) ? XMGL_SUITE_STORAGE_KEY : `pm_more_query_expanded:${pathname}`;
}

function readExpanded(pathname: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const key = storageKeyForPath(pathname);
    const direct = window.sessionStorage.getItem(key);
    if (direct !== null) return direct === '1';
    if (key === XMGL_SUITE_STORAGE_KEY) {
      for (const p of LEGACY_SUITE_PATHS) {
        if (window.sessionStorage.getItem(`pm_more_query_expanded:${p}`) === '1') return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * 「更多查询」展开状态持久化：同一会话内更新 URL 重挂载不折叠；
 * 在 ProjectManage～ProjectManage7 各列表页之间切换时保持同一展开状态。
 */
export function usePersistedMoreSearch() {
  const { pathname } = useLocation();
  const [showMoreSearch, setShowMoreSearch] = useState(() => readExpanded(pathname));

  useEffect(() => {
    setShowMoreSearch(readExpanded(pathname));
  }, [pathname]);

  const setShowMoreSearchPersist = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setShowMoreSearch((prev) => {
        const next = typeof value === 'function' ? (value as (p: boolean) => boolean)(prev) : value;
        try {
          window.sessionStorage.setItem(storageKeyForPath(pathname), next ? '1' : '0');
        } catch {
          /* ignore quota / private mode */
        }
        return next;
      });
    },
    [pathname],
  );

  return [showMoreSearch, setShowMoreSearchPersist] as const;
}
