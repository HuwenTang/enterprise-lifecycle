import { systemApi } from "../api.ts";
import type { SystemDictVo } from "../apis";

const inflight = new Map<string, Promise<SystemDictVo[]>>();
const settled = new Map<string, SystemDictVo[]>();

/** 与 PC 端一致：按 catalog 拉取字典项，启用项按 sort 升序；成功结果进程内缓存。 */
export async function loadDictItems(catalog: string): Promise<SystemDictVo[]> {
  const cached = settled.get(catalog);
  if (cached) return cached;
  let p = inflight.get(catalog);
  if (!p) {
    p = (async () => {
      try {
        const rows = await systemApi.getDictItems({ catalog });
        const sorted = [...rows].filter((x) => x.enabled).sort((a, b) => a.sort - b.sort);
        settled.set(catalog, sorted);
        return sorted;
      } catch {
        return [];
      } finally {
        inflight.delete(catalog);
      }
    })();
    inflight.set(catalog, p);
  }
  return p;
}
