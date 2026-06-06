type ApiEnvelope<T> =
    | { code?: number | string; msg?: string; message?: string; data?: T }
    | T;

function unwrap<T>(json: ApiEnvelope<T>): T {
    if (json && typeof json === "object" && "data" in (json as any)) {
        return (json as any).data as T;
    }
    return json as T;
}

function n0(v: unknown): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function asStringArray(v: unknown): string[] {
    if (Array.isArray(v)) return v.map(String).filter(Boolean);
    return [];
}

export type GroupTaskBillResult = {
    /** 后端新增：本次分组后涉及的 taskBillId 列表 */
    taskBillIds: string[];
    /** 兼容保留：后端可能还会返回其他字段 */
    raw: unknown;
};

/**
 * GET /fin/sheet/groupTaskBill?sheetNo=...
 * 作用：按 sheetNo 分组生成任务单；并返回 taskBillIds 供后续查询详情
 */
export async function groupTaskBill(sheetNo: string): Promise<GroupTaskBillResult> {
    const url = `/prime-api/fin/sheet/groupTaskBill?sheetNo=${encodeURIComponent(sheetNo)}`;
    const res = await fetch(url, { method: "GET" });
    const json = (await res.json()) as ApiEnvelope<any>;
    const data = unwrap<any>(json);

    const taskBillIds =
        asStringArray(data?.taskBillIds) ||
        asStringArray(data?.task_bill_ids) ||
        asStringArray(data?.taskBillIdList) ||
        [];

    return { taskBillIds, raw: data };
}

export type SimpleTaskBill = Record<string, unknown>;

/**
 * POST /fin/sheet/findSimpleTaskBill
 * 作用：根据 taskBillIds 批量查询任务单简要信息
 */
export async function findSimpleTaskBill(taskBillIds: string[]): Promise<SimpleTaskBill[]> {
    const url = `/prime-api/fin/sheet/findSimpleTaskBill`;
    const body = { taskBillIds };
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const json = (await res.json()) as ApiEnvelope<any>;
    const data = unwrap<any>(json);
    return Array.isArray(data) ? (data as SimpleTaskBill[]) : [];
}

/**
 * 常见用法：先 groupTaskBill 拿 taskBillIds，再 findSimpleTaskBill 拉简表
 */
export async function groupAndFetchSimpleTaskBills(sheetNo: string) {
    const grouped = await groupTaskBill(sheetNo);
    const list = grouped.taskBillIds.length ? await findSimpleTaskBill(grouped.taskBillIds) : [];
    return { ...grouped, simpleTaskBills: list };
}

