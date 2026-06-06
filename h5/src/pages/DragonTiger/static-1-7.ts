import d1 from "./1.json";
import d2 from "./2.json";
import d3 from "./3.json";
import d4 from "./4.json";
import d5 from "./5.json";
import d6 from "./6.json";
import d7 from "./7.json";

export type DragonTigerRawRow = Record<string, unknown>;

const RAW_LIST = [
    ...(Array.isArray(d1) ? (d1 as DragonTigerRawRow[]) : []),
    ...(Array.isArray(d2) ? (d2 as DragonTigerRawRow[]) : []),
    ...(Array.isArray(d3) ? (d3 as DragonTigerRawRow[]) : []),
    ...(Array.isArray(d4) ? (d4 as DragonTigerRawRow[]) : []),
    ...(Array.isArray(d5) ? (d5 as DragonTigerRawRow[]) : []),
    ...(Array.isArray(d6) ? (d6 as DragonTigerRawRow[]) : []),
    ...(Array.isArray(d7) ? (d7 as DragonTigerRawRow[]) : []),
];

export const DRAGON_TIGER_DISTRICT_ORDER = [
    "靖江市",
    "泰兴市",
    "兴化市",
    "海陵区",
    "姜堰区",
    "医药高新区（高港区）",
] as const;

export const DRAGON_TIGER_CITY_TOTAL_NAME = "全市合计" as const;

export function getDragonTigerRawRow(region: string): DragonTigerRawRow | undefined {
    return RAW_LIST.find((x) => x && typeof x === "object" && (x as any)["区域"] === region);
}

export function mustGetDragonTigerRawRow(region: string): DragonTigerRawRow {
    const r = getDragonTigerRawRow(region);
    if (!r) throw new Error(`DragonTiger static row not found for region: ${region}`);
    return r;
}

