import dayjs, { type Dayjs } from "dayjs";

/** 龙虎榜 `endDate` 查询参数格式（本地时间，无 Z） */
export const LHB_END_DATE_API_FORMAT = "YYYY-MM-DDTHH:mm:ss" as const;

/** 默认截止时刻：当前时刻上一小时的 59 分 59 秒（如 11:11 → 当日 10:59:59） */
export function getDefaultLhbEndDate(): Dayjs {
    return dayjs().subtract(1, "hour").minute(59).second(59).millisecond(0);
}

/** 转为接口 `endDate`（序列化为 `2026-05-25T23:59:59` 而非 UTC ISO） */
export function lhbEndDayjsToApiDate(d: Dayjs): Date {
    const localIso = d.format(LHB_END_DATE_API_FORMAT);
    const date = new Date(localIso);
    date.toISOString = () => localIso;
    return date;
}

/** 与 `longHuBangFill.normalizeRegionName` 一致：接口区县名与页面/Excel 对齐 */
export function normalizeRegionName(raw: string): string {
    const s = String(raw ?? "")
        .replace(/\r?\n/g, "")
        .replace(/\s+/g, "")
        .trim();
    if (s === "全市") return "全市合计";
    return s;
}

/** 按 `regionName` 查找接口行，兼容「医药高新区」等与展示名不完全一致的情况 */
export function findStatisticRowForDistrict<T extends { regionName?: string }>(
    list: T[],
    displayName: string,
): T | undefined {
    const target = normalizeRegionName(displayName);
    const direct = list.find((r) => normalizeRegionName(r.regionName ?? "") === target);
    if (direct) return direct;
    if (target.includes("医药") || target.includes("高港")) {
        return list.find((r) => {
            const rn = normalizeRegionName(r.regionName ?? "");
            return rn.includes("医药") || rn.includes("高港");
        });
    }
    return undefined;
}

/** 按 `cityDistrict` 查找外资利润再投资接口行 */
export function findForeignInvestmentRowForDistrict<T extends { cityDistrict?: string }>(
    list: T[],
    displayName: string,
): T | undefined {
    const target = normalizeRegionName(displayName);
    const direct = list.find((r) => normalizeRegionName(r.cityDistrict ?? "") === target);
    if (direct) return direct;
    if (target.includes("医药") || target.includes("高港")) {
        return list.find((r) => {
            const rn = normalizeRegionName(r.cityDistrict ?? "");
            return rn.includes("医药") || rn.includes("高港");
        });
    }
    return undefined;
}
