import raw from "./beizhu.json";

type BeizhuItem = {
    备注?: string[];
};

const LIST: BeizhuItem[] = Array.isArray(raw) ? (raw as BeizhuItem[]) : [];

function pick(idx: number): string[] {
    const item = LIST[idx];
    const lines = item?.备注;
    return Array.isArray(lines) ? lines.filter((x) => typeof x === "string") : [];
}

// beizhu.json 索引约定（从 0 开始）
export const REMARKS = {
    // l1 固定资产投资情况
    l1_fixedInvestment: pick(1),

    // l2 重点项目情况
    l2_shengKey: pick(2),
    l2_shiKey: pick(3),

    // l3 各阶段项目情况
    l3_sign: pick(4),
    l3_record: pick(5),
    l3_start: pick(6),
    l3_startInvest: pick(7),
    l3_complete: pick(8),

    // l4 “四上”企业新增数情况
    l4_fourUp: pick(9),
} as const;

