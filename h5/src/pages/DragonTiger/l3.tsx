import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import dayjs from "dayjs";
import { DatePicker, Spin } from "antd";
import zhCN from "antd/es/date-picker/locale/zh_CN";
import ReactECharts from "echarts-for-react";
import type { LhbForeignInvestmentProjectsVo } from "../../apis/models/LhbForeignInvestmentProjectsVo";
import type { FiledProjects } from "../../apis/models/FiledProjects";
import type { SignedProjects } from "../../apis/models/SignedProjects";
import type { StatisticLhbvo } from "../../apis/models/StatisticLhbvo";
import { primeApi } from "../../api.ts";
import {
    AppstoreOutlined,
    CheckCircleOutlined,
    DownOutlined,
    FileDoneOutlined,
    FundProjectionScreenOutlined,
    PieChartOutlined,
    PlayCircleOutlined,
    ProfileOutlined,
} from "@ant-design/icons";
import { DRAGON_TIGER_CITY_TOTAL_NAME, DRAGON_TIGER_DISTRICT_ORDER, mustGetDragonTigerRawRow } from "./static-1-7";
import { REMARKS } from "./beizhu";
import {
    findForeignInvestmentRowForDistrict,
    findStatisticRowForDistrict,
    getDefaultLhbEndDate,
    lhbEndDayjsToApiDate,
} from "./longHuBangRegion";

type PageKey = "home" | "sign" | "record" | "start" | "complete";
type AmountFilter = "all" | "below" | "above" | "five_above" | "year_one_above";
type TypeFilter = "total" | "add_month";
type RecordInvestFilter = "expand" | "reinvest" | null;

type CoreDistrict = {
    name: string;
    sign_1e: number;
    sign_addMonth: number;
    record_1e: number;
    record_addMonth: number;
    start_1e: number;
    start_addMonth: number;
    complete_1e: number;
    complete_addMonth: number;
};

type SimpleSignDistrict = { name: string; sign_1e: number; sign_addMonth: number };
type RecordExpandDistrict = { name: string; record_expand_1e: number; record_expand_addMonth: number };
type ReinvestDistrict = { name: string; reinvest_1e: number; reinvest_addMonth: number };
type BelowInvestDistrict = {
    name: string;
    plan_invest_1e: number;
    plan_invest_year: number;
    finished_invest_1e: number;
    finished_invest_addMonth: number;
    /** 年度计划投资完成率（累计），如 "1.28%" */
    completion_rate: string;
    /** 年度计划投资完成率（当月新增） */
    completion_rate_addMonth: string;
};

function formatPlanCompletionRate(finished: number, planYear: number): string {
    if (planYear <= 0) return "0.00%";
    return `${((finished / planYear) * 100).toFixed(2)}%`;
}

function parseCompletionRatePercent(rate: string): number {
    if (!rate || typeof rate !== "string") return 0;
    const n = parseFloat(rate.replace(/%/g, "").trim());
    return Number.isFinite(n) ? n : 0;
}

type ProjectCountInfo = { total?: number | null; monthNew?: number | null };

type CoreBundles = {
    all: CoreDistrict[];
    below: CoreDistrict[];
    above: CoreDistrict[];
    fiveAbove: CoreDistrict[];
    yearOneAbove: SimpleSignDistrict[];
    recordExpand: RecordExpandDistrict[];
    reinvest: ReinvestDistrict[];
};

type ReinvestTableRow = { name: string; total: number; amountUsd: number; addMonth: number };

function n0(n: unknown): number {
    const x = Number(n);
    return Number.isFinite(x) ? x : 0;
}

type Dict = Record<string, unknown>;
function asDict(v: unknown): Dict {
    return v && typeof v === "object" ? (v as Dict) : {};
}

function readCountPair(obj: unknown): ProjectCountInfo {
    const d = asDict(obj);
    return {
        total: n0(d["总数"]),
        monthNew: n0(d["当月新增"]),
    };
}

function readCountTotal(x: ProjectCountInfo | undefined): number {
    return n0(x?.total ?? 0);
}
function readCountMonth(x: ProjectCountInfo | undefined): number {
    return n0(x?.monthNew ?? 0);
}

function readApiCountPair(info: { total?: number | null; monthNew?: number | null } | undefined): ProjectCountInfo {
    return { total: n0(info?.total), monthNew: n0(info?.monthNew) };
}

function readRecordDerivativesFromFiledProjects(name: string, filed: FiledProjects | undefined) {
    const recordBelow = readApiCountPair(filed?.range50mTo100m);
    const recordAbove = readApiCountPair(filed?.range100mPlus);
    const recordFiveAbove = readApiCountPair(filed?.range30mUsdPlus);
    const reinvestBlock = readApiCountPair(filed?.reinvestmentProjects);
    return {
        recordBelowTotal: readCountTotal(recordBelow),
        recordBelowAdd: readCountMonth(recordBelow),
        recordAboveTotal: readCountTotal(recordAbove),
        recordAboveAdd: readCountMonth(recordAbove),
        recordFiveAboveTotal: readCountTotal(recordFiveAbove),
        recordFiveAboveAdd: readCountMonth(recordFiveAbove),
        reinvest: {
            name,
            reinvest_1e: readCountTotal(reinvestBlock),
            reinvest_addMonth: readCountMonth(reinvestBlock),
        } satisfies ReinvestDistrict,
    };
}

/** 备案「增资扩产」静态兜底（接口无 expansionProjects 时使用 static-1-7） */
function readStaticRecordExpandForDistrict(name: string): RecordExpandDistrict {
    return readStaticRecordDerivativesForDistrict(name).recordExpand;
}

/** 备案「增资扩产」优先读 filedProjects.expansionProjects */
function readRecordExpandForDistrict(name: string, filed: FiledProjects | undefined): RecordExpandDistrict {
    if (filed?.expansionProjects) {
        const pair = readApiCountPair(filed.expansionProjects);
        return {
            name,
            record_expand_1e: readCountTotal(pair),
            record_expand_addMonth: readCountMonth(pair),
        };
    }
    return readStaticRecordExpandForDistrict(name);
}

function readStaticReinvestRow(name: string): ReinvestTableRow {
    const raw = mustGetDragonTigerRawRow(name);
    const record = asDict(raw["备案项目情况"]);
    const block = asDict(record["其中：外资利润再投资项目"]);
    return {
        name,
        total: n0(block["总数"]),
        amountUsd: n0(block["投资额(万美元)"]),
        addMonth: n0(block["当月新增"]),
    };
}

function fmtAmountUsd(n: number): string {
    return Number.isFinite(n) ? n.toFixed(1) : "0.0";
}

/** 备案项目情况静态兜底（接口无数据时使用 static-1-7） */
function readStaticRecordDerivativesForDistrict(name: string) {
    const raw = mustGetDragonTigerRawRow(name);
    const record = asDict(raw["备案项目情况"]);
    const recordBelow = readCountPair(record["500万元-1亿元项目"]);
    const recordAboveBlock = asDict(record["1亿元以上项目"]);
    const recordAbove = readCountPair(recordAboveBlock);
    const recordFiveAbove = readCountPair(recordAboveBlock["协议投资5亿元以上项目"]);
    const recordExpandBlock = readCountPair(record["其中：增资扩产项目"]);
    const reinvestBlock = readCountPair(record["其中：外资利润再投资项目"]);
    return {
        recordBelowTotal: readCountTotal(recordBelow),
        recordBelowAdd: readCountMonth(recordBelow),
        recordAboveTotal: readCountTotal(recordAbove),
        recordAboveAdd: readCountMonth(recordAbove),
        recordFiveAboveTotal: readCountTotal(recordFiveAbove),
        recordFiveAboveAdd: readCountMonth(recordFiveAbove),
        recordExpand: {
            name,
            record_expand_1e: readCountTotal(recordExpandBlock),
            record_expand_addMonth: readCountMonth(recordExpandBlock),
        } satisfies RecordExpandDistrict,
        reinvest: {
            name,
            reinvest_1e: readCountTotal(reinvestBlock),
            reinvest_addMonth: readCountMonth(reinvestBlock),
        } satisfies ReinvestDistrict,
    };
}

function buildCityTotalRecordFromStatic(): Pick<CoreDistrict, "record_1e" | "record_addMonth"> {
    const r = readStaticRecordDerivativesForDistrict(DRAGON_TIGER_CITY_TOTAL_NAME);
    return {
        record_1e: r.recordBelowTotal + r.recordAboveTotal,
        record_addMonth: r.recordBelowAdd + r.recordAboveAdd,
    };
}

/** 签约「年度投资亿元以上」静态兜底（接口无数据时使用 static-1-7） */
function readStaticYearOneAboveSignForDistrict(name: string): SimpleSignDistrict {
    const raw = mustGetDragonTigerRawRow(name);
    const sign = asDict(raw["签约项目情况"]);
    const signAboveBlock = asDict(sign["1亿元以上项目"]);
    const pair = readCountPair(signAboveBlock["年度投资1亿元以上项目"]);
    return {
        name,
        sign_1e: readCountTotal(pair),
        sign_addMonth: readCountMonth(pair),
    };
}

function readYearOneAboveSignForDistrict(name: string, sign: SignedProjects | undefined): SimpleSignDistrict {
    if (sign?.annualInv100mPlus) {
        const pair = readApiCountPair(sign.annualInv100mPlus);
        return {
            name,
            sign_1e: readCountTotal(pair),
            sign_addMonth: readCountMonth(pair),
        };
    }
    return readStaticYearOneAboveSignForDistrict(name);
}

function buildCoreDistrictsFromLhbList(list: StatisticLhbvo[]): CoreBundles {
    const all: CoreDistrict[] = [];
    const below: CoreDistrict[] = [];
    const above: CoreDistrict[] = [];
    const fiveAbove: CoreDistrict[] = [];
    const yearOneAbove: SimpleSignDistrict[] = [];
    const recordExpand: RecordExpandDistrict[] = [];
    const reinvest: ReinvestDistrict[] = [];

    for (const name of DRAGON_TIGER_DISTRICT_ORDER) {
        const row = findStatisticRowForDistrict(list, name);
        const rec = row?.filedProjects
            ? readRecordDerivativesFromFiledProjects(name, row.filedProjects)
            : readStaticRecordDerivativesForDistrict(name);
        recordExpand.push(row ? readRecordExpandForDistrict(name, row.filedProjects) : rec.recordExpand);
        reinvest.push(rec.reinvest);

        if (!row) {
            below.push({
                name,
                sign_1e: 0,
                sign_addMonth: 0,
                record_1e: rec.recordBelowTotal,
                record_addMonth: rec.recordBelowAdd,
                start_1e: 0,
                start_addMonth: 0,
                complete_1e: 0,
                complete_addMonth: 0,
            });
            above.push({
                name,
                sign_1e: 0,
                sign_addMonth: 0,
                record_1e: rec.recordAboveTotal,
                record_addMonth: rec.recordAboveAdd,
                start_1e: 0,
                start_addMonth: 0,
                complete_1e: 0,
                complete_addMonth: 0,
            });
            all.push({
                name,
                sign_1e: 0,
                sign_addMonth: 0,
                record_1e: rec.recordBelowTotal + rec.recordAboveTotal,
                record_addMonth: rec.recordBelowAdd + rec.recordAboveAdd,
                start_1e: 0,
                start_addMonth: 0,
                complete_1e: 0,
                complete_addMonth: 0,
            });
            fiveAbove.push({
                name,
                sign_1e: 0,
                sign_addMonth: 0,
                record_1e: rec.recordFiveAboveTotal,
                record_addMonth: rec.recordFiveAboveAdd,
                start_1e: 0,
                start_addMonth: 0,
                complete_1e: 0,
                complete_addMonth: 0,
            });
            yearOneAbove.push(readStaticYearOneAboveSignForDistrict(name));
            continue;
        }

        const sign = row.signedProjects;
        const start = row.constructionStartProjects;
        const complete = row.completedProjects;

        const signBelow = readApiCountPair(sign?.range50mTo100m);
        const signAbove = readApiCountPair(sign?.range100mPlus);
        const signFiveAbove = readApiCountPair(sign?.range30mUsdPlus);

        const startBelow = readApiCountPair(start?.range50mTo100m);
        const startAbove = readApiCountPair(start?.range100mPlus);
        const startFiveAbove = readApiCountPair(start?.range30mUsdPlus);

        const completeBelow = readApiCountPair(complete?.range50mTo100m);
        const completeAbove = readApiCountPair(complete?.range100mPlus);

        const signBelowTotal = readCountTotal(signBelow);
        const signBelowAdd = readCountMonth(signBelow);
        const signAboveTotal = readCountTotal(signAbove);
        const signAboveAdd = readCountMonth(signAbove);

        const recordBelowTotal = rec.recordBelowTotal;
        const recordBelowAdd = rec.recordBelowAdd;
        const recordAboveTotal = rec.recordAboveTotal;
        const recordAboveAdd = rec.recordAboveAdd;

        const startBelowTotal = readCountTotal(startBelow);
        const startBelowAdd = readCountMonth(startBelow);
        const startAboveTotal = readCountTotal(startAbove);
        const startAboveAdd = readCountMonth(startAbove);
        const startFiveAboveTotal = readCountTotal(startFiveAbove);
        const startFiveAboveAdd = readCountMonth(startFiveAbove);

        const completeBelowTotal = readCountTotal(completeBelow);
        const completeBelowAdd = readCountMonth(completeBelow);
        const completeAboveTotal = readCountTotal(completeAbove);
        const completeAboveAdd = readCountMonth(completeAbove);

        below.push({
            name,
            sign_1e: signBelowTotal,
            sign_addMonth: signBelowAdd,
            record_1e: recordBelowTotal,
            record_addMonth: recordBelowAdd,
            start_1e: startBelowTotal,
            start_addMonth: startBelowAdd,
            complete_1e: completeBelowTotal,
            complete_addMonth: completeBelowAdd,
        });

        above.push({
            name,
            sign_1e: signAboveTotal,
            sign_addMonth: signAboveAdd,
            record_1e: recordAboveTotal,
            record_addMonth: recordAboveAdd,
            start_1e: startAboveTotal,
            start_addMonth: startAboveAdd,
            complete_1e: completeAboveTotal,
            complete_addMonth: completeAboveAdd,
        });

        all.push({
            name,
            sign_1e: signBelowTotal + signAboveTotal,
            sign_addMonth: signBelowAdd + signAboveAdd,
            record_1e: recordBelowTotal + recordAboveTotal,
            record_addMonth: recordBelowAdd + recordAboveAdd,
            start_1e: startBelowTotal + startAboveTotal,
            start_addMonth: startBelowAdd + startAboveAdd,
            complete_1e: completeBelowTotal + completeAboveTotal,
            complete_addMonth: completeBelowAdd + completeAboveAdd,
        });

        fiveAbove.push({
            name,
            sign_1e: readCountTotal(signFiveAbove),
            sign_addMonth: readCountMonth(signFiveAbove),
            record_1e: rec.recordFiveAboveTotal,
            record_addMonth: rec.recordFiveAboveAdd,
            start_1e: startFiveAboveTotal,
            start_addMonth: startFiveAboveAdd,
            complete_1e: 0,
            complete_addMonth: 0,
        });

        yearOneAbove.push(readYearOneAboveSignForDistrict(name, sign));
    }

    return { all, below, above, fiveAbove, yearOneAbove, recordExpand, reinvest };
}

function buildCityTotalFromLhbRow(row: StatisticLhbvo) {
    const sign = row.signedProjects;
    const record = row.filedProjects;
    const start = row.constructionStartProjects;
    const complete = row.completedProjects;

    const signBelow = readApiCountPair(sign?.range50mTo100m);
    const signAbove = readApiCountPair(sign?.range100mPlus);
    const recordBelow = readApiCountPair(record?.range50mTo100m);
    const recordAbove = readApiCountPair(record?.range100mPlus);
    const startBelow = readApiCountPair(start?.range50mTo100m);
    const startAbove = readApiCountPair(start?.range100mPlus);
    const completeBelow = readApiCountPair(complete?.range50mTo100m);
    const completeAbove = readApiCountPair(complete?.range100mPlus);

    return {
        sign_addMonth: readCountMonth(signBelow) + readCountMonth(signAbove),
        sign_1e: readCountTotal(signBelow) + readCountTotal(signAbove),
        record_addMonth: readCountMonth(recordBelow) + readCountMonth(recordAbove),
        record_1e: readCountTotal(recordBelow) + readCountTotal(recordAbove),
        start_addMonth: readCountMonth(startBelow) + readCountMonth(startAbove),
        start_1e: readCountTotal(startBelow) + readCountTotal(startAbove),
        complete_addMonth: readCountMonth(completeBelow) + readCountMonth(completeAbove),
        complete_1e: readCountTotal(completeBelow) + readCountTotal(completeAbove),
    };
}

function buildCoreDistrictsFromStatic(): CoreBundles {
    const all: CoreDistrict[] = [];
    const below: CoreDistrict[] = [];
    const above: CoreDistrict[] = [];
    const fiveAbove: CoreDistrict[] = [];
    const yearOneAbove: SimpleSignDistrict[] = [];
    const recordExpand: RecordExpandDistrict[] = [];
    const reinvest: ReinvestDistrict[] = [];

    for (const name of DRAGON_TIGER_DISTRICT_ORDER) {
        const raw = mustGetDragonTigerRawRow(name);
        const sign = asDict(raw["签约项目情况"]);
        const signBelow = readCountPair(sign["500万元-1亿元项目"]);
        const signAboveBlock = asDict(sign["1亿元以上项目"]);
        const signAbove = readCountPair(signAboveBlock);
        const signFiveAbove = readCountPair(signAboveBlock["协议投资5亿元以上项目"]);

        const rec = readStaticRecordDerivativesForDistrict(name);

        const start = asDict(raw["开工项目情况"]);
        const startBelow = readCountPair(start["500万元-1亿元项目"]);
        const startAboveBlock = asDict(start["1亿元以上项目"]);
        const startAbove = readCountPair(startAboveBlock);
        const startFiveAbove = readCountPair(startAboveBlock["协议投资5亿元以上项目"]);

        const complete = asDict(raw["竣工项目情况"]);
        const completeBelow = readCountPair(complete["500万元-1亿元项目"]);
        const completeAbove = readCountPair(complete["1亿元以上项目"]);

        const signBelowTotal = readCountTotal(signBelow);
        const signBelowAdd = readCountMonth(signBelow);
        const signAboveTotal = readCountTotal(signAbove);
        const signAboveAdd = readCountMonth(signAbove);

        const recordBelowTotal = rec.recordBelowTotal;
        const recordBelowAdd = rec.recordBelowAdd;
        const recordAboveTotal = rec.recordAboveTotal;
        const recordAboveAdd = rec.recordAboveAdd;

        const startBelowTotal = readCountTotal(startBelow);
        const startBelowAdd = readCountMonth(startBelow);
        const startAboveTotal = readCountTotal(startAbove);
        const startAboveAdd = readCountMonth(startAbove);
        const startFiveAboveTotal = readCountTotal(startFiveAbove);
        const startFiveAboveAdd = readCountMonth(startFiveAbove);

        const completeBelowTotal = readCountTotal(completeBelow);
        const completeBelowAdd = readCountMonth(completeBelow);
        const completeAboveTotal = readCountTotal(completeAbove);
        const completeAboveAdd = readCountMonth(completeAbove);

        below.push({
            name,
            sign_1e: signBelowTotal,
            sign_addMonth: signBelowAdd,
            record_1e: recordBelowTotal,
            record_addMonth: recordBelowAdd,
            start_1e: startBelowTotal,
            start_addMonth: startBelowAdd,
            complete_1e: completeBelowTotal,
            complete_addMonth: completeBelowAdd,
        });

        above.push({
            name,
            sign_1e: signAboveTotal,
            sign_addMonth: signAboveAdd,
            record_1e: recordAboveTotal,
            record_addMonth: recordAboveAdd,
            start_1e: startAboveTotal,
            start_addMonth: startAboveAdd,
            complete_1e: completeAboveTotal,
            complete_addMonth: completeAboveAdd,
        });

        all.push({
            name,
            sign_1e: signBelowTotal + signAboveTotal,
            sign_addMonth: signBelowAdd + signAboveAdd,
            record_1e: recordBelowTotal + recordAboveTotal,
            record_addMonth: recordBelowAdd + recordAboveAdd,
            start_1e: startBelowTotal + startAboveTotal,
            start_addMonth: startBelowAdd + startAboveAdd,
            complete_1e: completeBelowTotal + completeAboveTotal,
            complete_addMonth: completeBelowAdd + completeAboveAdd,
        });

        fiveAbove.push({
            name,
            sign_1e: readCountTotal(signFiveAbove),
            sign_addMonth: readCountMonth(signFiveAbove),
            record_1e: rec.recordFiveAboveTotal,
            record_addMonth: rec.recordFiveAboveAdd,
            start_1e: startFiveAboveTotal,
            start_addMonth: startFiveAboveAdd,
            complete_1e: 0,
            complete_addMonth: 0,
        });

        yearOneAbove.push(readStaticYearOneAboveSignForDistrict(name));

        recordExpand.push(rec.recordExpand);
        reinvest.push(rec.reinvest);
    }

    return { all, below, above, fiveAbove, yearOneAbove, recordExpand, reinvest };
}

function readInvestCompletionRate(block: Dict, finished: number, planTotal: number): string {
    const raw = block["投资完成率"];
    if (typeof raw === "string" && raw.trim()) return raw.trim();
    return formatPlanCompletionRate(finished, planTotal);
}

function buildStartInvestDistrict(region: string, key: "500万元-1亿元项目" | "1亿元以上项目"): BelowInvestDistrict {
    const raw = mustGetDragonTigerRawRow(region);
    const inv = asDict(raw["开工项目投资情况"]);
    const block = asDict(inv[key]);
    const finished = asDict(block["已完成投资"]);
    const planTotal = n0(block["计划总投资"]);
    const finishedTotal = n0(finished["总数"]);
    const finishedAdd = n0(finished["当月新增"]);
    return {
        name: region,
        plan_invest_1e: planTotal,
        plan_invest_year: planTotal,
        finished_invest_1e: finishedTotal,
        finished_invest_addMonth: finishedAdd,
        completion_rate: readInvestCompletionRate(block, finishedTotal, planTotal),
        completion_rate_addMonth: formatPlanCompletionRate(finishedAdd, planTotal),
    };
}

const BELOW_INVEST_DISTRICTS: BelowInvestDistrict[] = DRAGON_TIGER_DISTRICT_ORDER.map((r) =>
    buildStartInvestDistrict(r, "500万元-1亿元项目"),
);

const ABOVE_INVEST_DISTRICTS: BelowInvestDistrict[] = DRAGON_TIGER_DISTRICT_ORDER.map((r) =>
    buildStartInvestDistrict(r, "1亿元以上项目"),
);

function mergeInvestByDistrict(below: BelowInvestDistrict[], above: BelowInvestDistrict[]): BelowInvestDistrict[] {
    return below.map((b) => {
        const a = above.find((x) => x.name === b.name);
        if (!a) return { ...b };
        const planTotal = b.plan_invest_1e + a.plan_invest_1e;
        const finishedTotal = b.finished_invest_1e + a.finished_invest_1e;
        const finishedAdd = b.finished_invest_addMonth + a.finished_invest_addMonth;
        return {
            name: b.name,
            plan_invest_1e: planTotal,
            plan_invest_year: planTotal,
            finished_invest_1e: finishedTotal,
            finished_invest_addMonth: finishedAdd,
            completion_rate: formatPlanCompletionRate(finishedTotal, planTotal),
            completion_rate_addMonth: formatPlanCompletionRate(finishedAdd, planTotal),
        };
    });
}

/** 全部口径 = 亿元以下 + 亿元以上合并 */
const ALL_INVEST_DISTRICTS = mergeInvestByDistrict(BELOW_INVEST_DISTRICTS, ABOVE_INVEST_DISTRICTS);

function buildReinvestTableRows(
    foreignList: LhbForeignInvestmentProjectsVo[] | null,
    useForeignApi: boolean,
): ReinvestTableRow[] {
    const names = [DRAGON_TIGER_CITY_TOTAL_NAME, ...DRAGON_TIGER_DISTRICT_ORDER];
    return names.map((name) => {
        if (useForeignApi && foreignList) {
            const row = findForeignInvestmentRowForDistrict(foreignList, name);
            if (row) {
                return {
                    name,
                    total: n0(row.totalCount),
                    amountUsd: n0(row.reinvestmentAmountUsd),
                    addMonth: n0(row.reinvestmentNewMonthly),
                };
            }
        }
        return readStaticReinvestRow(name);
    });
}

function medalFor(idx: number) {
    return `${idx + 1}`;
}

type RankEntry = { name: string; value: string };

function rowsFromNumbers<T extends { name: string }>(data: T[], getNum: (d: T) => number, suffix: string): RankEntry[] {
    return [...data]
        .sort((a, b) => getNum(b) - getNum(a))
        .map((d) => ({ name: d.name, value: `${getNum(d)}${suffix}` }));
}

function fmt2(n: number | null | undefined): string {
    const x = Number(n);
    return Number.isFinite(x) ? x.toFixed(2) : "0.00";
}

function getSignRows(amount: AmountFilter, type: TypeFilter, b: CoreBundles): RankEntry[] {
    const {
        all: ALL_DISTRICTS,
        below: BELOW_DISTRICTS,
        above: ABOVE_DISTRICTS,
        fiveAbove: FIVE_ABOVE_DISTRICTS,
        yearOneAbove: YEAR_ONE_ABOVE_DISTRICTS,
    } = b;
    if (amount === "all" && type === "total") return rowsFromNumbers(ALL_DISTRICTS, (d) => d.sign_1e, "个");
    if (amount === "all" && type === "add_month") return rowsFromNumbers(ALL_DISTRICTS, (d) => d.sign_addMonth, "个");
    if (amount === "below" && type === "total") return rowsFromNumbers(BELOW_DISTRICTS, (d) => d.sign_1e, "个");
    if (amount === "below" && type === "add_month") return rowsFromNumbers(BELOW_DISTRICTS, (d) => d.sign_addMonth, "个");
    if (amount === "above" && type === "total") return rowsFromNumbers(ABOVE_DISTRICTS, (d) => d.sign_1e, "个");
    if (amount === "above" && type === "add_month") return rowsFromNumbers(ABOVE_DISTRICTS, (d) => d.sign_addMonth, "个");
    if (amount === "five_above" && type === "total") return rowsFromNumbers(FIVE_ABOVE_DISTRICTS, (d) => d.sign_1e, "个");
    if (amount === "five_above" && type === "add_month") return rowsFromNumbers(FIVE_ABOVE_DISTRICTS, (d) => d.sign_addMonth, "个");
    if (amount === "year_one_above" && type === "total")
        return rowsFromNumbers(YEAR_ONE_ABOVE_DISTRICTS, (d) => d.sign_1e, "个");
    if (amount === "year_one_above" && type === "add_month")
        return rowsFromNumbers(YEAR_ONE_ABOVE_DISTRICTS, (d) => d.sign_addMonth, "个");
    return [];
}

function getRecordRows(amount: AmountFilter, type: TypeFilter, invest: RecordInvestFilter, b: CoreBundles): RankEntry[] {
    const {
        all: ALL_DISTRICTS,
        below: BELOW_DISTRICTS,
        above: ABOVE_DISTRICTS,
        fiveAbove: FIVE_ABOVE_DISTRICTS,
        recordExpand: RECORD_EXPAND_DISTRICTS,
        reinvest: REINVEST_DISTRICTS,
    } = b;
    if (invest === "expand") {
        return rowsFromNumbers(RECORD_EXPAND_DISTRICTS, (d) => d.record_expand_1e, "个");
    }
    if (invest === "reinvest") {
        const reinvestKey = type === "add_month" ? "reinvest_addMonth" : "reinvest_1e";
        return rowsFromNumbers(REINVEST_DISTRICTS, (d) => d[reinvestKey], "个");
    }
    if (amount === "all" && type === "total") return rowsFromNumbers(ALL_DISTRICTS, (d) => d.record_1e, "个");
    if (amount === "all" && type === "add_month") return rowsFromNumbers(ALL_DISTRICTS, (d) => d.record_addMonth, "个");
    if (amount === "below" && type === "total") return rowsFromNumbers(BELOW_DISTRICTS, (d) => d.record_1e, "个");
    if (amount === "below" && type === "add_month") return rowsFromNumbers(BELOW_DISTRICTS, (d) => d.record_addMonth, "个");
    if (amount === "above" && type === "total") return rowsFromNumbers(ABOVE_DISTRICTS, (d) => d.record_1e, "个");
    if (amount === "above" && type === "add_month") return rowsFromNumbers(ABOVE_DISTRICTS, (d) => d.record_addMonth, "个");
    if (amount === "five_above" && type === "total") return rowsFromNumbers(FIVE_ABOVE_DISTRICTS, (d) => d.record_1e, "个");
    if (amount === "five_above" && type === "add_month") return rowsFromNumbers(FIVE_ABOVE_DISTRICTS, (d) => d.record_addMonth, "个");
    return [];
}

function getStartRows(amount: AmountFilter, type: TypeFilter, b: CoreBundles): RankEntry[] {
    const { all: ALL_DISTRICTS, below: BELOW_DISTRICTS, above: ABOVE_DISTRICTS, fiveAbove: FIVE_ABOVE_DISTRICTS } = b;
    if (amount === "all" && type === "total") return rowsFromNumbers(ALL_DISTRICTS, (d) => d.start_1e, "个");
    if (amount === "all" && type === "add_month") return rowsFromNumbers(ALL_DISTRICTS, (d) => d.start_addMonth, "个");
    if (amount === "below" && type === "total") return rowsFromNumbers(BELOW_DISTRICTS, (d) => d.start_1e, "个");
    if (amount === "below" && type === "add_month") return rowsFromNumbers(BELOW_DISTRICTS, (d) => d.start_addMonth, "个");
    if (amount === "above" && type === "total") return rowsFromNumbers(ABOVE_DISTRICTS, (d) => d.start_1e, "个");
    if (amount === "above" && type === "add_month") return rowsFromNumbers(ABOVE_DISTRICTS, (d) => d.start_addMonth, "个");
    if (amount === "five_above" && type === "total") return rowsFromNumbers(FIVE_ABOVE_DISTRICTS, (d) => d.start_1e, "个");
    if (amount === "five_above" && type === "add_month") return rowsFromNumbers(FIVE_ABOVE_DISTRICTS, (d) => d.start_addMonth, "个");
    return [];
}

function getCompleteRows(amount: AmountFilter, type: TypeFilter, b: CoreBundles): RankEntry[] {
    const { all: ALL_DISTRICTS, below: BELOW_DISTRICTS, above: ABOVE_DISTRICTS } = b;
    if (amount === "all" && type === "total") return rowsFromNumbers(ALL_DISTRICTS, (d) => d.complete_1e, "个");
    if (amount === "all" && type === "add_month") return rowsFromNumbers(ALL_DISTRICTS, (d) => d.complete_addMonth, "个");
    if (amount === "below" && type === "total") return rowsFromNumbers(BELOW_DISTRICTS, (d) => d.complete_1e, "个");
    if (amount === "below" && type === "add_month") return rowsFromNumbers(BELOW_DISTRICTS, (d) => d.complete_addMonth, "个");
    if (amount === "above" && type === "total") return rowsFromNumbers(ABOVE_DISTRICTS, (d) => d.complete_1e, "个");
    if (amount === "above" && type === "add_month") return rowsFromNumbers(ABOVE_DISTRICTS, (d) => d.complete_addMonth, "个");
    return [];
}

function homeRankRows(data: CoreDistrict[], key: keyof CoreDistrict): RankEntry[] {
    return rowsFromNumbers<CoreDistrict>(data, (d) => d[key] as number, "个");
}

function getStartInvestDistricts(amount: Exclude<AmountFilter, "five_above" | "year_one_above">): BelowInvestDistrict[] {
    if (amount === "all") return ALL_INVEST_DISTRICTS;
    if (amount === "below") return BELOW_INVEST_DISTRICTS;
    return ABOVE_INVEST_DISTRICTS;
}

function investPieOption(
    data: BelowInvestDistrict[],
    valueKey: "finished_invest_1e" | "finished_invest_addMonth",
    valueLabel: string,
) {
    const pieData = data.map((d) => ({ name: d.name, value: d[valueKey] }));
    const total = fmt2(data.reduce((s, d) => s + (d[valueKey] || 0), 0));
    return {
        color: ["#2c7a4d", "#4e9e6b", "#3b82f6", "#f97316", "#a855f7", "#ec4899"],
        tooltip: {
            trigger: "item",
            formatter: (params: { name: string; value: number; percent: number }) =>
                `${params.name}<br/>${valueLabel}：${fmt2(params.value)} 亿元<br/>占比：${fmt2(params.percent)}%`,
        },
        legend: {
            orient: "horizontal" as const,
            bottom: 4,
            left: "center" as const,
            textStyle: { fontSize: 10 },
            itemWidth: 10,
            itemHeight: 10,
        },
        graphic: [
            {
                type: "text",
                left: "center",
                top: "36%",
                style: { text: "合计", textAlign: "center", fill: "#5b6e8c", fontSize: 11 },
            },
            {
                type: "text",
                left: "center",
                top: "43%",
                style: {
                    text: `${total}亿`,
                    textAlign: "center",
                    fill: "#0f2b3d",
                    fontSize: 15,
                    fontWeight: "bold",
                },
            },
        ],
        series: [
            {
                type: "pie",
                radius: ["32%", "60%"],
                center: ["50%", "44%"],
                data: pieData,
                label: {
                    show: true,
                    fontSize: 10,
                    formatter: (p: { name: string; value: number }) => `${p.name}\n${fmt2(p.value)}亿`,
                },
                emphasis: {
                    itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.4)" },
                },
            },
        ],
    };
}

/** 年度计划投资完成率柱状图：数据来自 static-1-7 开工项目投资情况（completion_rate 口径） */
function investCompletionRateBarOption(data: BelowInvestDistrict[], type: TypeFilter) {
    const names = data.map((d) => d.name);
    const values = data.map((d) =>
        parseCompletionRatePercent(type === "total" ? d.completion_rate : d.completion_rate_addMonth),
    );
    return {
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: (params: { name: string; value: number }[]) => {
                const p = params[0];
                return `${p.name}<br/>年度计划投资完成率：${p.value}%`;
            },
        },
        grid: { top: 36, left: 12, right: 12, bottom: 48, containLabel: true },
        xAxis: {
            type: "category",
            data: names,
            axisLabel: { rotate: 30, fontSize: 10, interval: 0 },
        },
        yAxis: {
            type: "value",
            name: "完成率(%)",
            nameTextStyle: { fontSize: 10 },
        },
        series: [
            {
                data: values,
                type: "bar",
                barWidth: "40%",
                itemStyle: { borderRadius: [6, 6, 0, 0], color: "#2c7a4d" },
                label: {
                    show: true,
                    position: "top",
                    fontSize: 10,
                    formatter: (p: { value: number }) => `${p.value}%`,
                },
            },
        ],
    };
}

const filterBtnStyle = (active: boolean): CSSProperties => ({
    padding: "0.02rem 0.12rem",
    border: "1px solid #4e73df",
    background: active ? "#4e73df" : "#fff",
    color: active ? "#fff" : "#4e73df",
    borderRadius: "0.2rem",
    cursor: "pointer",
    fontSize: "0.13rem",
    transition: "all 0.3s",
});

function FilterRow(props: { label: string; children: ReactNode }) {
    return (
        <div style={{ margin: "0.15rem 0" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.1rem", width: "100%" }}>
                <span style={{ fontSize: "0.13rem", color: "#666", minWidth: "0.7rem", flexShrink: 0 }}>{props.label}</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.1rem", flex: 1 }}>{props.children}</div>
            </div>
        </div>
    );
}

function CollapsibleHomeSection(props: {
    icon: ReactNode;
    label: string;
    open: boolean;
    onToggle: () => void;
    marginTop?: string;
    children: ReactNode;
}) {
    return (
        <>
            <div
                role="button"
                tabIndex={0}
                onClick={props.onToggle}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        props.onToggle();
                    }
                }}
                style={{
                    fontWeight: 600,
                    fontSize: "0.15rem",
                    marginBottom: "0.14rem",
                    marginTop: props.marginTop ?? 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.08rem",
                    borderLeft: "0.04rem solid #1e6f3f",
                    paddingLeft: "0.12rem",
                    color: "#0f2b3d",
                    cursor: "pointer",
                    userSelect: "none",
                }}
            >
                <span style={{ display: "flex", alignItems: "center", gap: "0.08rem" }}>
                    {props.icon} {props.label}
                </span>
                <DownOutlined
                    style={{
                        fontSize: "0.12rem",
                        color: "#5b6e8c",
                        transform: props.open ? "rotate(0deg)" : "rotate(-90deg)",
                        transition: "transform 0.3s ease",
                        marginLeft: "auto",
                    }}
                />
            </div>
            {props.open && <div style={{ marginTop: "0.08rem" }}>{props.children}</div>}
        </>
    );
}

function RankList(props: { rows: RankEntry[] }) {
    return (
        <>
            {props.rows.map((r, idx) => (
                <div
                    key={r.name}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.1rem 0",
                        borderBottom: "1px solid #edf2f7",
                        fontSize: "0.14rem",
                    }}
                >
                    <div style={{ fontWeight: 500, display: "flex", alignItems: "center", gap: "0.08rem", minWidth: 0 }}>
                        <span style={{ width: "0.24rem", textAlign: "center", fontWeight: "bold", flexShrink: 0 }}>
                            {medalFor(idx)}
                        </span>
                        <span style={{ overflowWrap: "break-word" }}>{r.name}</span>
                    </div>
                    <div style={{ fontWeight: 700, color: "#1f4f3a", flexShrink: 0, marginLeft: "0.08rem" }}>{r.value}</div>
                </div>
            ))}
        </>
    );
}

function ReinvestTable(props: { rows: ReinvestTableRow[] }) {
    return (
        <div style={{ border: "1px solid #edf2f7", borderRadius: "0.16rem", overflow: "hidden" }}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1.1fr 0.7fr 1fr 0.8fr",
                    background: "#f8fafc",
                    borderBottom: "1px solid #edf2f7",
                    fontSize: "0.12rem",
                    fontWeight: 600,
                    color: "#0f2b3d",
                }}
            >
                <div style={{ padding: "0.1rem 0.12rem" }}>市（区）</div>
                <div style={{ padding: "0.1rem 0.12rem", textAlign: "center" }}>总数</div>
                <div style={{ padding: "0.1rem 0.12rem", textAlign: "center" }}>
                    投资额
                    <br />
                    (万美元)
                </div>
                <div style={{ padding: "0.1rem 0.12rem", textAlign: "center" }}>当月新增</div>
            </div>
            {props.rows.map((r) => (
                <div
                    key={r.name}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.1fr 0.7fr 1fr 0.8fr",
                        borderBottom: "1px solid #edf2f7",
                        background: "#fff",
                        fontSize: "0.13rem",
                    }}
                >
                    <div style={{ padding: "0.1rem 0.12rem", fontWeight: 500 }}>{r.name}</div>
                    <div style={{ padding: "0.1rem 0.12rem", textAlign: "center", fontWeight: 700, color: "#1f4f3a" }}>{r.total}</div>
                    <div style={{ padding: "0.1rem 0.12rem", textAlign: "center", fontWeight: 700, color: "#1f4f3a" }}>
                        {fmtAmountUsd(r.amountUsd)}
                    </div>
                    <div style={{ padding: "0.1rem 0.12rem", textAlign: "center", fontWeight: 700, color: "#1f4f3a" }}>{r.addMonth}</div>
                </div>
            ))}
        </div>
    );
}

function InsightNote(props: { children: ReactNode }) {
    return (
        <div
            style={{
                fontSize: "0.11rem",
                color: "#6c86a3",
                background: "#f1f5f9",
                padding: "0.1rem 0.12rem",
                borderRadius: "0.18rem",
                marginTop: "0.12rem",
                lineHeight: 1.5,
            }}
        >
            {props.children}
        </div>
    );
}

/** 月份面板可选年份：相对「当前日历年」前后各 6 年 */
const LHB_YEAR_HALF_SPAN = 6;

export default function DragonTigerProjectPhases() {
    const [page, setPage] = useState<PageKey>("home");
    const [lhbEndDate, setLhbEndDate] = useState(() => getDefaultLhbEndDate());
    const [lhbList, setLhbList] = useState<StatisticLhbvo[] | null>(null);
    const [foreignInvList, setForeignInvList] = useState<LhbForeignInvestmentProjectsVo[] | null>(null);

    const [openSign, setOpenSign] = useState(true);
    const [openRecord, setOpenRecord] = useState(false);
    const [openStart, setOpenStart] = useState(false);
    const [openComplete, setOpenComplete] = useState(false);

    const [signAmount, setSignAmount] = useState<AmountFilter>("all");
    const [signType, setSignType] = useState<TypeFilter>("total");

    const [recordAmount, setRecordAmount] = useState<AmountFilter>("all");
    const [recordType, setRecordType] = useState<TypeFilter>("total");
    const [recordInvest, setRecordInvest] = useState<RecordInvestFilter>(null);

    const [startAmount, setStartAmount] = useState<AmountFilter>("all");
    const [startType, setStartType] = useState<TypeFilter>("total");

    const [completeAmount, setCompleteAmount] = useState<AmountFilter>("all");
    const [completeType, setCompleteType] = useState<TypeFilter>("total");

    useEffect(() => {
        let cancelled = false;
        setLhbList(null);
        (async () => {
            try {
                const data = await primeApi.getLongHuBang({ endDate: lhbEndDayjsToApiDate(lhbEndDate) });
                if (!cancelled) setLhbList(Array.isArray(data) ? data : []);
            } catch {
                if (!cancelled) setLhbList([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [lhbEndDate]);

    useEffect(() => {
        let cancelled = false;
        setForeignInvList(null);
        (async () => {
            try {
                const res = await primeApi.listLhbForeignInvestmentProjects({ size: 100 });
                if (!cancelled) setForeignInvList(Array.isArray(res.records) ? res.records : []);
            } catch {
                if (!cancelled) setForeignInvList([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    /** null：请求中；[]：已返回但无数据，走静态兜底 */
    const lhbLoading = lhbList === null;
    const useLhbBundles = Boolean(lhbList && lhbList.length > 0);
    const useForeignInvApi = Boolean(foreignInvList && foreignInvList.length > 0);

    const bundles = useMemo(() => {
        if (useLhbBundles && lhbList) return buildCoreDistrictsFromLhbList(lhbList);
        return buildCoreDistrictsFromStatic();
    }, [lhbList, useLhbBundles]);

    const ALL_CITY_TOTAL = useMemo(() => {
        if (useLhbBundles && lhbList) {
            const row = findStatisticRowForDistrict(lhbList, DRAGON_TIGER_CITY_TOTAL_NAME);
            if (row) return buildCityTotalFromLhbRow(row);
        }
        const recordStatic = buildCityTotalRecordFromStatic();
        const raw = mustGetDragonTigerRawRow(DRAGON_TIGER_CITY_TOTAL_NAME);
        const sign = asDict(raw["签约项目情况"]);
        const start = asDict(raw["开工项目情况"]);
        const complete = asDict(raw["竣工项目情况"]);

        const signBelow = readCountPair(sign["500万元-1亿元项目"]);
        const signAbove = readCountPair(sign["1亿元以上项目"]);
        const startBelow = readCountPair(start["500万元-1亿元项目"]);
        const startAbove = readCountPair(start["1亿元以上项目"]);
        const completeBelow = readCountPair(complete["500万元-1亿元项目"]);
        const completeAbove = readCountPair(complete["1亿元以上项目"]);

        return {
            sign_addMonth: readCountMonth(signBelow) + readCountMonth(signAbove),
            sign_1e: readCountTotal(signBelow) + readCountTotal(signAbove),
            ...recordStatic,
            start_addMonth: readCountMonth(startBelow) + readCountMonth(startAbove),
            start_1e: readCountTotal(startBelow) + readCountTotal(startAbove),
            complete_addMonth: readCountMonth(completeBelow) + readCountMonth(completeAbove),
            complete_1e: readCountTotal(completeBelow) + readCountTotal(completeAbove),
        };
    }, [lhbList, useLhbBundles]);

    const homeSignRows = useMemo(() => homeRankRows(bundles.all, "sign_1e"), [bundles]);
    const homeRecordRows = useMemo(() => homeRankRows(bundles.all, "record_1e"), [bundles]);
    const homeStartRows = useMemo(() => homeRankRows(bundles.all, "start_1e"), [bundles]);
    const homeCompleteRows = useMemo(() => homeRankRows(bundles.all, "complete_1e"), [bundles]);

    const signRows = useMemo(() => getSignRows(signAmount, signType, bundles), [signAmount, signType, bundles]);
    const recordRows = useMemo(() => getRecordRows(recordAmount, recordType, recordInvest, bundles), [recordAmount, recordType, recordInvest, bundles]);
    const reinvestTableRows = useMemo(
        () => buildReinvestTableRows(foreignInvList, useForeignInvApi),
        [foreignInvList, useForeignInvApi],
    );
    const startRows = useMemo(() => getStartRows(startAmount, startType, bundles), [startAmount, startType, bundles]);
    const completeRows = useMemo(() => getCompleteRows(completeAmount, completeType, bundles), [completeAmount, completeType, bundles]);

    const showStartInvestBlock = page === "start" && startAmount !== "five_above" && startAmount !== "year_one_above";

    const startInvestDistricts = useMemo((): BelowInvestDistrict[] | null => {
        if (page !== "start" || startAmount === "five_above" || startAmount === "year_one_above") return null;
        return getStartInvestDistricts(startAmount);
    }, [page, startAmount]);

    const investPieValueKey = startType === "total" ? "finished_invest_1e" : "finished_invest_addMonth";

    const startInvestPieOption = useMemo(() => {
        if (!startInvestDistricts) return null;
        return investPieOption(startInvestDistricts, investPieValueKey, startType === "total" ? "完成投资" : "当月新增投资");
    }, [startInvestDistricts, investPieValueKey, startType]);

    const startInvestBarOption = useMemo(() => {
        if (!startInvestDistricts) return null;
        return investCompletionRateBarOption(startInvestDistricts, startType);
    }, [startInvestDistricts, startType]);

    function goHome() {
        setPage("home");
    }
    function goSign() {
        setPage("sign");
        setSignAmount("all");
        setSignType("total");
    }
    function goRecord() {
        setPage("record");
        setRecordAmount("all");
        setRecordType("total");
        setRecordInvest(null);
    }
    function goStart() {
        setPage("start");
        setStartAmount("all");
        setStartType("total");
    }
    function goComplete() {
        setPage("complete");
        setCompleteAmount("all");
        setCompleteType("total");
    }

    function statNavigate(target: "sign" | "record" | "start" | "complete") {
        if (target === "sign") goSign();
        if (target === "record") goRecord();
        if (target === "start") goStart();
        if (target === "complete") goComplete();
    }

    const bottomNav = (
        <div
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                maxWidth: "5rem",
                margin: "0 auto",
                background: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(10px)",
                display: "flex",
                justifyContent: "space-around",
                padding: "0.08rem 0.12rem 0.16rem",
                borderTop: "1px solid #e2e8f0",
                boxShadow: "0 -4px 12px rgba(0,0,0,0.04)",
                zIndex: 20,
            }}
        >
            {(
                [
                    { key: "home" as const, icon: <FundProjectionScreenOutlined />, label: "总览", onClick: goHome },
                    { key: "sign" as const, icon: <FileDoneOutlined />, label: "签约", onClick: goSign },
                    { key: "record" as const, icon: <ProfileOutlined />, label: "备案", onClick: goRecord },
                    { key: "start" as const, icon: <PlayCircleOutlined />, label: "开工", onClick: goStart },
                    { key: "complete" as const, icon: <CheckCircleOutlined />, label: "竣工", onClick: goComplete },
                ] as const
            ).map((item) => {
                const active = page === item.key;
                return (
                    <button
                        key={item.key}
                        type="button"
                        onClick={item.onClick}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "0.04rem",
                            fontSize: "0.11rem",
                            color: active ? "#1e6f3f" : "#5b6e8c",
                            transition: "all 0.2s",
                            cursor: "pointer",
                            flex: 1,
                            padding: "0.06rem 0 0.04rem",
                            borderRadius: "0.3rem",
                            border: "none",
                            background: active ? "#e9f4ef" : "transparent",
                            fontWeight: active ? 500 : 400,
                        }}
                    >
                        <span style={{ fontSize: "0.16rem" }}>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                );
            })}
        </div>
    );

    const statBadge = (add: number, total: number, label: string, target: "sign" | "record" | "start" | "complete") => (
        <button
            type="button"
            onClick={() => statNavigate(target)}
            style={{
                background: "#f8fafc",
                borderRadius: "0.2rem",
                padding: "0.12rem",
                textAlign: "center",
                border: "none",
                cursor: "pointer",
                width: "100%",
            }}
        >
            <div style={{ fontSize: "0.17rem", fontWeight: 800, lineHeight: 1.2 }}>
                <span style={{ color: "#d46b08" }}>{add}</span>
                <span style={{ color: "#64748b" }}>/</span>
                <span style={{ color: "#1e6f3f" }}>{total}</span>
            </div>
            <div style={{ fontSize: "0.11rem", color: "#5b6e8c", marginTop: "0.04rem" }}>{label}</div>
        </button>
    );

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fc",
                fontFamily: "'Segoe UI', 'Roboto', system-ui, -apple-system, 'Helvetica Neue', sans-serif",
                color: "#1e293b",
                WebkitTapHighlightColor: "transparent",
                paddingBottom: "0.72rem",
            }}
        >
            <div style={{ maxWidth: "5rem", margin: "0 auto", minHeight: "100vh", boxShadow: "0 0 20px rgba(0,0,0,0.05)" }}>
                <div
                    style={{
                        background: "linear-gradient(135deg, #0f2b3d 0%, #1b4a6e 100%)",
                        color: "#fff",
                        padding: "0.2rem 0.18rem 0.18rem",
                        borderRadius: "0 0 0.24rem 0.24rem",
                        boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                        position: "relative",
                    }}
                >

                    <h1
                        style={{
                            fontSize: "0.18rem",
                            fontWeight: 600,
                            margin: 0,
                            // paddingLeft: "0.42rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.08rem",
                            lineHeight: 1.35,
                        }}
                    >
                        <span
                            style={{
                                fontSize: "0.15rem",
                                background: "rgba(255,255,255,0.2)",
                                padding: "0.06rem",
                                borderRadius: "50%",
                                display: "inline-flex",
                            }}
                        >
                            <AppstoreOutlined />
                        </span>
                        各阶段项目情况
                    </h1>
                    <div
                        style={{
                            fontSize: "0.12rem",
                            opacity: 0.85,
                            marginTop: "0.06rem",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "0.12rem",
                        }}
                    >
                        <span style={{ opacity: 0.9, flexShrink: 0 }}>统计截止时间</span>
                        <DatePicker
                            showTime={{ format: "HH:mm:ss" }}
                            locale={zhCN}
                            allowClear={false}
                            value={lhbEndDate}
                            onChange={(d) => {
                                if (d) setLhbEndDate(d);
                            }}
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={(current) => {
                                if (!current) return false;
                                const y = current.year();
                                const cy = dayjs().year();
                                return y < cy - LHB_YEAR_HALF_SPAN || y > cy + LHB_YEAR_HALF_SPAN;
                            }}
                            size="small"
                            placeholder="选择截止时间"
                            aria-label="选择龙虎榜统计截止时间"
                            getPopupContainer={(n) => n.parentElement ?? document.body}
                            style={{ width: "2.1rem", minWidth: "2.1rem" }}
                        />
                    </div>
                </div>

                {lhbLoading ? (
                    <div
                        role="status"
                        aria-busy="true"
                        aria-live="polite"
                        style={{
                            padding: "0.56rem 0.24rem",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "4.2rem",
                            gap: "0.16rem",
                        }}
                    >
                        <Spin size="large" />
                        <span style={{ fontSize: "0.13rem", color: "#64748b" }}>正在加载数据…</span>
                    </div>
                ) : (
                    <>
                        <div style={{ padding: "0.18rem 0.16rem 0.2rem", display: page === "home" ? "block" : "none" }}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "0.24rem",
                            padding: "0.16rem 0.18rem",
                            marginBottom: "0.18rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                            border: "1px solid #eef2f8",
                        }}
                    >
                        <div
                            style={{
                                fontWeight: 600,
                                fontSize: "0.15rem",
                                marginBottom: "0.14rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "0.08rem",
                                borderLeft: "0.04rem solid #1e6f3f",
                                paddingLeft: "0.12rem",
                                color: "#0f2b3d",
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center", gap: "0.08rem" }}>
                                <PieChartOutlined />
                                全市关键指标
                            </span>
                            <span style={{ fontSize: "0.11rem", fontWeight: 600 }}>
                                <span style={{ color: "#d46b08" }}>当月新增</span>
                                <span style={{ color: "#94a3b8" }}> / </span>
                                <span style={{ color: "#1e6f3f" }}>累计</span>
                            </span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "0.16rem",
                                marginBottom: "0.08rem",
                            }}
                        >
                            {statBadge(ALL_CITY_TOTAL.sign_addMonth, ALL_CITY_TOTAL.sign_1e, "签约项目数", "sign")}
                            {statBadge(ALL_CITY_TOTAL.record_addMonth, ALL_CITY_TOTAL.record_1e, "备案项目数", "record")}
                            {statBadge(ALL_CITY_TOTAL.start_addMonth, ALL_CITY_TOTAL.start_1e, "开工项目数", "start")}
                            {statBadge(ALL_CITY_TOTAL.complete_addMonth, ALL_CITY_TOTAL.complete_1e, "竣工项目数", "complete")}
                        </div>
                    </div>

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "0.24rem",
                            padding: "0.16rem 0.18rem",
                            marginBottom: "0.18rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                            border: "1px solid #eef2f8",
                        }}
                    >
                        <CollapsibleHomeSection
                            icon={<FileDoneOutlined />}
                            label="签约项目总数"
                            open={openSign}
                            onToggle={() => setOpenSign((v) => !v)}
                        >
                            <RankList rows={homeSignRows} />
                        </CollapsibleHomeSection>
                        <CollapsibleHomeSection
                            icon={<ProfileOutlined />}
                            label="备案项目总数"
                            open={openRecord}
                            onToggle={() => setOpenRecord((v) => !v)}
                            marginTop="0.16rem"
                        >
                            <RankList rows={homeRecordRows} />
                        </CollapsibleHomeSection>
                        <CollapsibleHomeSection
                            icon={<PlayCircleOutlined />}
                            label="开工项目总数"
                            open={openStart}
                            onToggle={() => setOpenStart((v) => !v)}
                            marginTop="0.16rem"
                        >
                            <RankList rows={homeStartRows} />
                        </CollapsibleHomeSection>
                        <CollapsibleHomeSection
                            icon={<CheckCircleOutlined />}
                            label="竣工项目总数"
                            open={openComplete}
                            onToggle={() => setOpenComplete((v) => !v)}
                            marginTop="0.16rem"
                        >
                            <RankList rows={homeCompleteRows} />
                        </CollapsibleHomeSection>
                    </div>
                </div>

                <div style={{ padding: "0.18rem 0.16rem 0.2rem", display: page === "sign" ? "block" : "none" }}>
                    <FilterRow label="金额范围：">
                        {(
                            [
                                { k: "all" as const, t: "全部" },
                                { k: "below" as const, t: "亿元以下" },
                                { k: "above" as const, t: "亿元以上" },
                                { k: "five_above" as const, t: "五亿元以上" },
                                { k: "year_one_above" as const, t: "年度投资亿元以上" },
                            ] as const
                        ).map((o) => (
                            <button key={o.k} type="button" style={filterBtnStyle(signAmount === o.k)} onClick={() => setSignAmount(o.k)}>
                                {o.t}
                            </button>
                        ))}
                    </FilterRow>
                    <FilterRow label="统计口径：">
                        <button type="button" style={filterBtnStyle(signType === "total")} onClick={() => setSignType("total")}>
                            累计
                        </button>
                        <button type="button" style={filterBtnStyle(signType === "add_month")} onClick={() => setSignType("add_month")}>
                            当月新增
                        </button>
                    </FilterRow>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "0.24rem",
                            padding: "0.16rem 0.18rem",
                            border: "1px solid #eef2f8",
                        }}
                    >
                        <div
                            style={{
                                fontWeight: 600,
                                fontSize: "0.15rem",
                                marginBottom: "0.12rem",
                                borderLeft: "0.04rem solid #1e6f3f",
                                paddingLeft: "0.12rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.08rem",
                            }}
                        >
                            <FileDoneOutlined />
                            签约项目全景
                        </div>
                        <div style={{ fontSize: "0.13rem", marginBottom: "0.08rem" }}>🏆 各市（区）签约项目数量</div>
                        <RankList rows={signRows} />
                        <InsightNote>
                            备注：
                            {REMARKS.l3_sign.map((line, idx) => (
                                <div key={idx} style={{ marginTop: idx === 0 ? "0.04rem" : 0 }}>
                                    {line}
                                </div>
                            ))}
                        </InsightNote>
                    </div>
                </div>

                <div style={{ padding: "0.18rem 0.16rem 0.2rem", display: page === "record" ? "block" : "none" }}>
                    <FilterRow label="金额范围：">
                        {(
                            [
                                { k: "all" as const, t: "全部" },
                                { k: "below" as const, t: "亿元以下" },
                                { k: "above" as const, t: "亿元以上" },
                                { k: "five_above" as const, t: "五亿元以上" },
                            ] as const
                        ).map((o) => (
                            <button
                                key={o.k}
                                type="button"
                                style={filterBtnStyle(recordInvest === null && recordAmount === o.k)}
                                onClick={() => {
                                    setRecordInvest(null);
                                    setRecordAmount(o.k);
                                }}
                            >
                                {o.t}
                            </button>
                        ))}
                    </FilterRow>
                    <FilterRow label="统计口径：">
                        <button
                            type="button"
                            style={filterBtnStyle(recordInvest === null && recordType === "total")}
                            onClick={() => {
                                setRecordInvest(null);
                                setRecordType("total");
                            }}
                        >
                            累计
                        </button>
                        <button
                            type="button"
                            style={filterBtnStyle(recordInvest === null && recordType === "add_month")}
                            onClick={() => {
                                setRecordInvest(null);
                                setRecordType("add_month");
                            }}
                        >
                            当月新增
                        </button>
                    </FilterRow>
                    <FilterRow label="投资类型：">
                        <button
                            type="button"
                            style={filterBtnStyle(recordInvest === "expand")}
                            onClick={() => setRecordInvest("expand")}
                        >
                            增资扩产
                        </button>
                        <button
                            type="button"
                            style={filterBtnStyle(recordInvest === "reinvest")}
                            onClick={() => setRecordInvest("reinvest")}
                        >
                            外资利润再投资
                        </button>
                    </FilterRow>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "0.24rem",
                            padding: "0.16rem 0.18rem",
                            border: "1px solid #eef2f8",
                        }}
                    >
                        <div
                            style={{
                                fontWeight: 600,
                                fontSize: "0.15rem",
                                marginBottom: "0.12rem",
                                borderLeft: "0.04rem solid #1e6f3f",
                                paddingLeft: "0.12rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.08rem",
                            }}
                        >
                            <ProfileOutlined />
                            备案项目情况
                        </div>
                        <div style={{ fontSize: "0.13rem", marginBottom: "0.08rem" }}>
                            {recordInvest === "reinvest" ? "其中：外资利润再投资项目" : "📋 各市（区）备案项目数量"}
                        </div>
                        {recordInvest === "reinvest" ? (
                            <ReinvestTable rows={reinvestTableRows} />
                        ) : (
                            <RankList rows={recordRows} />
                        )}
                        <InsightNote>
                            备注：
                            {REMARKS.l3_record.map((line, idx) => (
                                <div key={idx} style={{ marginTop: idx === 0 ? "0.04rem" : 0 }}>
                                    {line}
                                </div>
                            ))}
                        </InsightNote>
                    </div>
                </div>

                <div style={{ padding: "0.18rem 0.16rem 0.2rem", display: page === "start" ? "block" : "none" }}>
                    <FilterRow label="金额范围：">
                        {(
                            [
                                { k: "all" as const, t: "全部" },
                                { k: "below" as const, t: "亿元以下" },
                                { k: "above" as const, t: "亿元以上" },
                                { k: "five_above" as const, t: "五亿元以上" },
                            ] as const
                        ).map((o) => (
                            <button key={o.k} type="button" style={filterBtnStyle(startAmount === o.k)} onClick={() => setStartAmount(o.k)}>
                                {o.t}
                            </button>
                        ))}
                    </FilterRow>
                    <FilterRow label="统计口径：">
                        <button type="button" style={filterBtnStyle(startType === "total")} onClick={() => setStartType("total")}>
                            累计
                        </button>
                        <button type="button" style={filterBtnStyle(startType === "add_month")} onClick={() => setStartType("add_month")}>
                            当月新增
                        </button>
                    </FilterRow>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "0.24rem",
                            padding: "0.16rem 0.18rem",
                            marginBottom: "0.18rem",
                            border: "1px solid #eef2f8",
                        }}
                    >
                        <div
                            style={{
                                fontWeight: 600,
                                fontSize: "0.15rem",
                                marginBottom: "0.12rem",
                                borderLeft: "0.04rem solid #1e6f3f",
                                paddingLeft: "0.12rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.08rem",
                            }}
                        >
                            <PlayCircleOutlined />
                            开工项目情况
                        </div>
                        <div style={{ fontSize: "0.13rem", marginBottom: "0.08rem" }}>⚙️ 各市（区）开工项目数量</div>
                        <RankList rows={startRows} />
                        <InsightNote>
                            备注：
                            {REMARKS.l3_start.map((line, idx) => (
                                <div key={idx} style={{ marginTop: idx === 0 ? "0.04rem" : 0 }}>
                                    {line}
                                </div>
                            ))}
                        </InsightNote>
                    </div>

                    {showStartInvestBlock && (
                        <>
                            <div
                                style={{
                                    background: "#fff",
                                    borderRadius: "0.24rem",
                                    padding: "0.16rem 0.18rem",
                                    marginBottom: "0.18rem",
                                    border: "1px solid #eef2f8",
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 600,
                                        fontSize: "0.15rem",
                                        marginBottom: "0.12rem",
                                        borderLeft: "0.04rem solid #1e6f3f",
                                        paddingLeft: "0.12rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.08rem",
                                    }}
                                >
                                    <PlayCircleOutlined />
                                    {startType === "total" ? "累计完成投资" : "当月新增投资"}
                                </div>
                                {startInvestPieOption ? (
                                    <ReactECharts
                                        key={`pie-${startAmount}-${startType}`}
                                        option={startInvestPieOption}
                                        style={{ height: "2.8rem", width: "100%" }}
                                        opts={{ renderer: "canvas" }}
                                    />
                                ) : null}
                                <InsightNote>
                                    备注：
                                    {REMARKS.l3_startInvest.map((line, idx) => (
                                        <div key={idx} style={{ marginTop: idx === 0 ? "0.04rem" : 0 }}>
                                            {line}
                                        </div>
                                    ))}
                                </InsightNote>
                            </div>
                            <div
                                style={{
                                    background: "#fff",
                                    borderRadius: "0.24rem",
                                    padding: "0.16rem 0.18rem",
                                    border: "1px solid #eef2f8",
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 600,
                                        fontSize: "0.15rem",
                                        marginBottom: "0.12rem",
                                        borderLeft: "0.04rem solid #1e6f3f",
                                        paddingLeft: "0.12rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.08rem",
                                    }}
                                >
                                    <PlayCircleOutlined />
                                    年度计划投资完成率
                                </div>
                                {startInvestBarOption ? (
                                    <ReactECharts
                                        key={`bar-${startAmount}-${startType}`}
                                        option={startInvestBarOption}
                                        style={{ height: "2.8rem", width: "100%" }}
                                        opts={{ renderer: "canvas" }}
                                    />
                                ) : null}
                                <InsightNote>
                                    备注：
                                    {REMARKS.l3_startInvest.map((line, idx) => (
                                        <div key={idx} style={{ marginTop: idx === 0 ? "0.04rem" : 0 }}>
                                            {line}
                                        </div>
                                    ))}
                                </InsightNote>
                            </div>
                        </>
                    )}
                </div>

                <div style={{ padding: "0.18rem 0.16rem 0.2rem", display: page === "complete" ? "block" : "none" }}>
                    <FilterRow label="金额范围：">
                        {(
                            [
                                { k: "all" as const, t: "全部" },
                                { k: "below" as const, t: "亿元以下" },
                                { k: "above" as const, t: "亿元以上" },
                            ] as const
                        ).map((o) => (
                            <button key={o.k} type="button" style={filterBtnStyle(completeAmount === o.k)} onClick={() => setCompleteAmount(o.k)}>
                                {o.t}
                            </button>
                        ))}
                    </FilterRow>
                    <FilterRow label="统计口径：">
                        <button type="button" style={filterBtnStyle(completeType === "total")} onClick={() => setCompleteType("total")}>
                            累计
                        </button>
                        <button type="button" style={filterBtnStyle(completeType === "add_month")} onClick={() => setCompleteType("add_month")}>
                            当月新增
                        </button>
                    </FilterRow>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "0.24rem",
                            padding: "0.16rem 0.18rem",
                            border: "1px solid #eef2f8",
                        }}
                    >
                        <div
                            style={{
                                fontWeight: 600,
                                fontSize: "0.15rem",
                                marginBottom: "0.12rem",
                                borderLeft: "0.04rem solid #1e6f3f",
                                paddingLeft: "0.12rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.08rem",
                            }}
                        >
                            <CheckCircleOutlined />
                            竣工项目成果
                        </div>
                        <div style={{ fontSize: "0.13rem", marginBottom: "0.08rem" }}>🏁 各市（区）竣工项目数量</div>
                        <RankList rows={completeRows} />
                        <InsightNote>
                            备注：
                            {REMARKS.l3_complete.map((line, idx) => (
                                <div key={idx} style={{ marginTop: idx === 0 ? "0.04rem" : 0 }}>
                                    {line}
                                </div>
                            ))}
                        </InsightNote>
                    </div>
                </div>
                    </>
                )}
            </div>
            {bottomNav}
        </div>
    );
}
