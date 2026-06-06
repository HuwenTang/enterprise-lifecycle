import dayjs from "dayjs";
import ReactECharts from "echarts-for-react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionSheet, Popup } from "react-vant";
import { primeOpenApi } from "../../api.ts";
import RequestLoadingOverlay from "../../components/RequestLoadingOverlay/RequestLoadingOverlay.tsx";
import { useProjectFilterDicts } from "../../hooks/useProjectFilterDicts.ts";
import type {
  AuditStatusCountVo,
  DeptAuditStatisticsVo,
  DeptTimeoutVo,
  ProjectApprovalStatisticsVo,
  ProjectInfoStatVo,
} from "../../apis";
import "./audit-stats.css";

const C = {
  pageBg: "#fff",
  cardBorder: "rgba(247, 248, 250, 1)",
  titleNavy: "rgba(30, 41, 59, 1)",
  textMuted: "rgba(109, 114, 120, 1)",
  gridLine: "rgba(218, 222, 234, 1)",
  statBlue: "rgba(74, 123, 255, 1)",
  statValue: "#FFD66B",
  white: "#fff",
  shadowCard: "0 0.02rem 0.04rem rgba(0, 0, 0, 0.05)",
  sheetDivider: "#f0f2f5",
  sheetCancel: "#9ca3af",
  crumbParent: "rgba(1, 145, 255, 1)",
};

type Slug = "pre-evaluation" | "signing-approval" | "project-start" | "project-completion";

type YearFilter = "all" | number;

/** 部门多序列（通过/不通过/未审）→ 签约/开工多柱图用；竣工单柱勿用（见下）。 */
function mapMockMultiToDeptBarRows(mock: readonly { name: string; pass: number; fail: number; pending: number }[]): DeptBarRow[] {
  return mock.map((d) => {
    const t = d.pass + d.fail + d.pending;
    const ratioPercent = t > 0 ? Math.round(((100 * d.pass) / t) * 10) / 10 : 0;
    return { name: d.name, count: d.pass, ratioPercent };
  });
}

/**
 * 竣工「相关部门认定情况」单柱图：接口里常出现「尚未有通过、但有退回/待审」。
 * 若仍用「通过占比」则全为 0、柱不可见。改为按各部门总件数相对全局最大件数归一化柱长，tooltip 展示件数与占比。
 */
function mapDeptMultiToCompletionBarRows(multi: readonly DeptMultiRow[]): DeptBarRow[] {
  const totals = multi.map((d) => d.pass + d.fail + d.pending);
  const maxT = Math.max(1, ...totals);
  return multi.map((d, i) => {
    const t = totals[i] ?? 0;
    const ratioPercent = t > 0 ? Math.round(((100 * t) / maxT) * 10) / 10 : 0;
    return { name: d.name, count: t, ratioPercent };
  });
}

function countByAuditCode(list: AuditStatusCountVo[] | undefined, code: number): number {
  if (!list?.length) return 0;
  const row = list.find((x) => x.auditStatus === code);
  const c = row?.count;
  if (c == null || Number.isNaN(Number(c))) return 0;
  return Math.max(0, Math.floor(Number(c)));
}

/** 列表筛选用：与接口 auditStatusName 一致，便于 review_progress 字典转码 */
function auditStatusNameByCode(list: AuditStatusCountVo[] | undefined, code: number): string | undefined {
  const row = list?.find((x) => x.auditStatus === code);
  const name = row?.auditStatusName?.trim();
  return name || undefined;
}

/** 开工认定等：优先占位列（按状态名匹配），不足 3 列则用接口其余项（按数量降序）补全 */
function findAuditRowByPriority(
  list: AuditStatusCountVo[] | undefined,
  priority: string,
  used: Set<number>
): AuditStatusCountVo | undefined {
  if (!list?.length) return undefined;
  const candidates = list.filter(
    (r) => r.auditStatus != null && !used.has(r.auditStatus) && !!r.auditStatusName?.trim()
  );
  const exact = candidates.find((r) => r.auditStatusName!.trim() === priority);
  if (exact) return exact;
  if (priority === "部门审核退回") {
    const byReturn = candidates.find((r) => {
      const n = r.auditStatusName!.trim();
      return n === "部门审核退回" || (n.includes("退回") && !n.includes("不通过"));
    });
    if (byReturn) return byReturn;
  }
  if (priority === "审核未完成") {
    const byPending = candidates.find((r) => {
      const n = r.auditStatusName!.trim();
      return n === "审核未完成" || n === "未审核" || n.includes("未完成");
    });
    if (byPending) return byPending;
  }
  return candidates.find((r) => {
    const n = r.auditStatusName!.trim();
    return n.includes(priority) || priority.includes(n);
  });
}

function buildTripleFromAuditList(
  list: AuditStatusCountVo[] | undefined,
  priorities: readonly string[]
): { n1: number; n2: number; n3: number; total: number; l1: string; l2: string; l3: string } {
  const total = sumAllAuditCounts(list);
  const used = new Set<number>();
  const cols: { label: string; count: number }[] = [];

  for (const p of priorities) {
    const row = findAuditRowByPriority(list, p, used);
    if (row?.auditStatus != null) {
      used.add(row.auditStatus);
      cols.push({
        label: row.auditStatusName!.trim(),
        count: countByAuditCode(list, row.auditStatus),
      });
    }
  }

  const rest = (list ?? [])
    .filter((r) => r.auditStatus != null && !used.has(r.auditStatus) && r.auditStatusName?.trim())
    .sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0));

  for (const row of rest) {
    if (cols.length >= 3) break;
    used.add(row.auditStatus!);
    cols.push({
      label: row.auditStatusName!.trim(),
      count: countByAuditCode(list, row.auditStatus!),
    });
  }

  while (cols.length < 3) {
    const fallback = priorities[cols.length] ?? "—";
    cols.push({ label: fallback, count: 0 });
  }

  const [c0, c1, c2] = cols;
  return {
    n1: c0.count,
    n2: c1.count,
    n3: c2.count,
    l1: c0.label,
    l2: c1.label,
    l3: c2.label,
    total,
  };
}

function sumAllAuditCounts(list: AuditStatusCountVo[] | undefined): number {
  if (!list?.length) return 0;
  return list.reduce((s, x) => {
    const c = x.count;
    if (c == null || Number.isNaN(Number(c))) return s;
    return s + Math.max(0, Math.floor(Number(c)));
  }, 0);
}

/** 预评估流程图：最多展示条数（约 7～8 个部门） */
const PRE_EVAL_CHART_MAX_BARS = 8;

/** 项目认定统计「相关部门审核情况」：固定顺序占位，无数据也展示 Y 轴标签；接口多出的部门排在后面 */
const PROJECT_APPROVAL_DEPT_DEFAULT_ORDER = [
  "发改委",
  "科技局",
  "工信局",
  "生态环境局",
  "应急局",
  "商务局",
  "税务局",
  "专班办公室",
] as const;

type DeptMultiRow = { name: string; pass: number; fail: number; pending: number };

function normalizeDeptMatchKey(name: string): string {
  return name.trim().replace(/^市/, "");
}

function deptApiNameMatchesDefault(apiName: string, defaultLabel: string): boolean {
  const a = normalizeDeptMatchKey(apiName);
  const d = normalizeDeptMatchKey(defaultLabel);
  if (!a || !d) return false;
  if (a === d) return true;
  if (a.includes(d) || d.includes(a)) return true;
  return false;
}

/** 先按固定 8 局占位（可全 0），再叠接口数据；未归入默认项的部门追加在后 */
function mergeProjectApprovalDeptMulti(apiList: DeptAuditStatisticsVo[] | undefined): DeptMultiRow[] {
  const parsed: DeptMultiRow[] = (apiList ?? [])
    .map((d) => ({
      name: (d.deptName ?? "").trim(),
      pass: Math.max(0, Math.floor(Number(d.passedCount ?? 0))),
      fail: Math.max(0, Math.floor(Number(d.rejectedCount ?? 0))),
      pending: Math.max(0, Math.floor(Number(d.pendingCount ?? 0))),
    }))
    .filter((r) => r.name);

  const used = new Set<number>();
  const base: DeptMultiRow[] = PROJECT_APPROVAL_DEPT_DEFAULT_ORDER.map((label) => {
    const idx = parsed.findIndex((r, i) => !used.has(i) && deptApiNameMatchesDefault(r.name, label));
    if (idx >= 0) {
      used.add(idx);
      const r = parsed[idx]!;
      return { name: label, pass: r.pass, fail: r.fail, pending: r.pending };
    }
    return { name: label, pass: 0, fail: 0, pending: 0 };
  });

  const extras = parsed.filter((_, i) => !used.has(i));
  return [...base, ...extras];
}

function formatInt(n: number | undefined) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  const v = Math.max(0, Math.round(Number(n)));
  return v.toLocaleString("zh-CN");
}

/** 统计卡片数字：非负整数展示，避免接口脏数据或减法误差出现前导负号 */
function safeStatInt(n: number | undefined): number | undefined {
  if (n == null || Number.isNaN(Number(n))) return undefined;
  return Math.max(0, Math.round(Number(n)));
}

/** 预评估蓝卡数字：从 0 缓动到目标值；animEpoch 仅在接口成功返回后 +1，避免筛选与数据两次改 key 导致连播两遍 */
function AnimatedStatInt({ value, animEpoch }: { value: number | undefined; animEpoch: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(0);
  const runTokenRef = useRef(0);
  useEffect(() => {
    if (value == null || Number.isNaN(Number(value))) {
      runTokenRef.current += 1;
      cancelAnimationFrame(rafRef.current);
      setDisplay(0);
      return;
    }
    const end = Math.max(0, Math.floor(Number(value)));
    const token = ++runTokenRef.current;
    setDisplay(0);
    const duration = 260;
    const t0 = performance.now();
    const ease = (u: number) => 1 - (1 - u) ** 2.2;
    const tick = (now: number) => {
      if (token !== runTokenRef.current) return;
      const u = Math.min(1, (now - t0) / duration);
      const next = u >= 1 ? end : Math.round(end * ease(u));
      setDisplay(next);
      if (u < 1 && token === runTokenRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      runTokenRef.current += 1;
      cancelAnimationFrame(rafRef.current);
    };
  }, [value, animEpoch]);
  if (value == null || Number.isNaN(Number(value))) return <>{formatInt(undefined)}</>;
  return <>{formatInt(display)}</>;
}

/** tooltip 用 HTML 时避免部门名中的字符破坏结构 */
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 与单柱渐变主色一致，用于 tooltip 标题 */
const BAR_TOOLTIP_TITLE = "#1677FF";

/** 多柱图各系列色（与 itemStyle 一致，作 tooltip 色块） */
const MULTI_BAR_SERIES_COLOR: Record<string, string> = {
  审核通过: "rgba(82, 196, 26, 0.92)",
  审核不通过: "rgba(54, 197, 255, 0.95)",
  未审核: "rgba(250, 200, 88, 0.95)",
};

function sheetRowStyle(active: boolean): CSSProperties {
  return {
    textAlign: "center",
    padding: "0.15rem 0.2rem",
    fontSize: "0.16rem",
    fontWeight: active ? 700 : 400,
    color: active ? C.titleNavy : C.sheetCancel,
    borderBottom: `1px solid ${C.sheetDivider}`,
    cursor: "pointer",
    background: C.pageBg,
  };
}

function EllipsisFilterIcon() {
  const box = "clamp(0.27rem, 6.8vw, 0.32rem)";
  const dot = "clamp(0.022rem, 0.58vw, 0.028rem)";
  return (
    <span
      style={{
        width: box,
        height: box,
        borderRadius: "clamp(0.065rem, 1.75vw, 0.085rem)",
        background: "rgba(255, 255, 255, 0.26)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(0.024rem, 0.65vw, 0.032rem)",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: dot,
            height: dot,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.95)",
            flexShrink: 0,
          }}
        />
      ))}
    </span>
  );
}

type DeptBarRow = { name: string; count: number; ratioPercent: number };

/** 统计接口 `deptTimeoutList` → 单柱图数据 */
function mapDeptTimeoutToChartRows(list: DeptTimeoutVo[] | undefined): DeptBarRow[] {
  if (!list?.length) return [];
  return list
    .map((d) => {
      const name = (d.deptName ?? "").trim();
      if (!name) return null;
      const count = Math.max(0, Math.floor(Number(d.timeoutCount ?? 0)));
      let p = Number(d.percentage ?? 0);
      if (Number.isNaN(p)) p = 0;
      if (p > 0 && p <= 1) p *= 100;
      p = Math.max(0, Math.min(100, p));
      return { name, count, ratioPercent: p };
    })
    .filter(Boolean) as DeptBarRow[];
}

function extractDeptRows(raw: unknown): DeptBarRow[] {
  if (!raw || typeof raw !== "object") return [];
  const o = raw as Record<string, unknown>;
  const arrays = [
    o.deptTimeoutList,
    o.deptOverdueProportionList,
    o.departmentProportionList,
    o.departmentList,
    o.deptList,
    o.items,
    o.list,
  ].find((v) => Array.isArray(v)) as unknown[] | undefined;
  if (!arrays?.length) return [];
  return arrays
    .map((row: unknown) => {
      if (!row || typeof row !== "object") return null;
      const r = row as Record<string, unknown>;
      const name = String(r.deptName ?? r.name ?? r.departmentName ?? r.label ?? r.dept ?? "");
      if (!name) return null;
      const count = Number(r.count ?? r.num ?? r.quantity ?? r.timeoutCount ?? 0);
      let ratio = Number(r.ratio ?? r.proportion ?? r.percent ?? r.rate ?? r.percentage ?? 0);
      if (ratio > 0 && ratio <= 1) ratio *= 100;
      return { name, count, ratioPercent: ratio };
    })
    .filter(Boolean) as DeptBarRow[];
}

function isSlug(s: string | undefined): s is Slug {
  return (
    s === "pre-evaluation" ||
    s === "signing-approval" ||
    s === "project-start" ||
    s === "project-completion"
  );
}

/** 统计蓝卡背景（纯色；若需层次可再改为同色系浅→深渐变） */
const STAT_CARD_BG = "rgba(54, 137, 255, 1)";

function PreStatMiniBars() {
  return (
    <svg width={56} height={42} viewBox="0 0 64 48" fill="none" style={{ flexShrink: 0, opacity: 0.95 }}>
      <rect x="2" y="30" width="10" height="16" rx="2" fill="rgba(255,255,255,0.5)" />
      <rect x="18" y="20" width="10" height="26" rx="2" fill="rgba(255,255,255,0.7)" />
      <rect x="34" y="10" width="10" height="36" rx="2" fill="rgba(255,255,255,0.5)" />
      <rect x="50" y="2" width="10" height="44" rx="2" fill="#ffffff" />
    </svg>
  );
}

export default function ProjectAuditStatsPage() {
  const { auditFilterLabels, auditLabelToCode } = useProjectFilterDicts();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const module = isSlug(slug) ? slug : null;

  const [filterYear, setFilterYear] = useState<YearFilter>("all");
  const [filterIndustry, setFilterIndustry] = useState<string>("");
  const [filterAuditLabel, setFilterAuditLabel] = useState<string>("");

  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [yearSheetVisible, setYearSheetVisible] = useState(false);
  const [industrySheetVisible, setIndustrySheetVisible] = useState(false);
  const [auditSheetVisible, setAuditSheetVisible] = useState(false);

  const [preStats, setPreStats] = useState<ProjectInfoStatVo | null>(null);
  const [deptRows, setDeptRows] = useState<DeptBarRow[]>([]);
  const [preEvalLoading, setPreEvalLoading] = useState(false);
  const [preEvalStatsEpoch, setPreEvalStatsEpoch] = useState(0);
  const preEvalAbortRef = useRef<AbortController | null>(null);

  /** 签约 / 开工 / 竣工：`/public/project-approval/statistics` */
  const [approvalStats, setApprovalStats] = useState<ProjectApprovalStatisticsVo | null>(null);
  const [nonPreLoading, setNonPreLoading] = useState(false);
  const [nonPreStatsEpoch, setNonPreStatsEpoch] = useState(0);
  const nonPreAbortRef = useRef<AbortController | null>(null);

  const effectiveYearForApi = filterYear === "all" ? undefined : filterYear;
  const effectiveIndustryForApi = filterIndustry || undefined;

  const loadPreEval = useCallback(async () => {
    if (module !== "pre-evaluation") return;
    preEvalAbortRef.current?.abort();
    const ac = new AbortController();
    preEvalAbortRef.current = ac;
    setPreEvalLoading(true);
    try {
      /** OpenAPI 将 projectType 标为必填；传空串表示「全部」，避免客户端 RequiredError 阻断请求 */
      const res = await primeOpenApi.getPreEvaluationStatistics(
        {
          year: effectiveYearForApi,
          projectType: effectiveIndustryForApi ?? "",
        },
        { signal: ac.signal }
      );
      if (ac.signal.aborted) return;
      const inner = res.data;
      const st = inner?.statistics;
      setPreStats({
        totalCount: st?.totalCount,
        unfinishedCount: st?.unfinishedCount,
        finishedCount: st?.finishedCount,
      });
      const chartRows = mapDeptTimeoutToChartRows(inner?.deptTimeoutList);
      setDeptRows(chartRows.length > 0 ? chartRows : extractDeptRows(inner as Record<string, unknown>));
      setPreEvalStatsEpoch((n) => n + 1);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      const name = typeof e === "object" && e !== null && "name" in e ? String((e as { name?: string }).name) : "";
      if (name === "AbortError") return;
      setPreStats(null);
      setDeptRows([]);
    } finally {
      if (!ac.signal.aborted) setPreEvalLoading(false);
    }
  }, [effectiveIndustryForApi, effectiveYearForApi, module]);

  const loadNonPreStats = useCallback(async () => {
    if (
      module !== "signing-approval" &&
      module !== "project-start" &&
      module !== "project-completion"
    ) {
      return;
    }
    const projectStage =
      module === "signing-approval" ? "signed" : module === "project-start" ? "start" : "complete";
    nonPreAbortRef.current?.abort();
    const ac = new AbortController();
    nonPreAbortRef.current = ac;
    setNonPreLoading(true);
    try {
      const auditStatusParam = auditLabelToCode(filterAuditLabel);
      const res = await primeOpenApi.getProjectApprovalStatistics(
        {
          projectStage,
          year: effectiveYearForApi,
          ...(effectiveIndustryForApi ? { projectType: effectiveIndustryForApi } : {}),
          ...(auditStatusParam != null ? { auditStatus: auditStatusParam } : {}),
        },
        { signal: ac.signal }
      );
      if (ac.signal.aborted) return;
      setApprovalStats(res.data ?? null);
      setNonPreStatsEpoch((n) => n + 1);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      const name = typeof e === "object" && e !== null && "name" in e ? String((e as { name?: string }).name) : "";
      if (name === "AbortError") return;
      setApprovalStats(null);
    } finally {
      if (!ac.signal.aborted) setNonPreLoading(false);
    }
  }, [effectiveIndustryForApi, effectiveYearForApi, filterAuditLabel, module, auditLabelToCode]);

  useEffect(() => {
    if (!module) {
      navigate("/home", { replace: true });
      return;
    }
    void loadPreEval();
    void loadNonPreStats();
  }, [loadNonPreStats, loadPreEval, module, navigate]);

  useEffect(() => {
    return () => {
      preEvalAbortRef.current?.abort();
      nonPreAbortRef.current?.abort();
    };
  }, []);

  const yearOptions = useMemo(() => {
    const cur = dayjs().year();
    const opts: { label: string; value: YearFilter }[] = [{ label: "全部", value: "all" }];
    for (let i = 0; i <= 10; i++) {
      const y = cur - i;
      opts.push({ label: String(y), value: y });
    }
    return opts;
  }, []);

  /** 公开统计/列表的产业筛选（工业、服务业）；勿用 project_type 字典（该字典为另一类项目分类）。 */
  const industryOptions = useMemo(
    () => [
      { label: "全部", value: "" },
      { label: "工业", value: "工业" },
      { label: "服务业", value: "服务业" },
    ],
    []
  );

  const meta = useMemo(() => {
    if (!module) return null;
    const map: Record<
      Slug,
      {
        crumb: [string, string];
        pageSubtitle: string;
        statTitle: string;
        chartTitle: string;
        listPath: string;
        variant: "pre" | "triple";
        showAuditSheet: boolean;
      }
    > = {
      "pre-evaluation": {
        crumb: ["前期招商", "部门预评估"],
        pageSubtitle: "部门预评估",
        statTitle: "预估情况数据统计",
        chartTitle: "各部门超时默认项目占比",
        listPath: "/pro-record",
        variant: "pre",
        showAuditSheet: false,
      },
      "signing-approval": {
        crumb: ["前期招商", "签约核定"],
        pageSubtitle: "签约核定",
        statTitle: "项目审核状态",
        chartTitle: "相关部门审核情况",
        listPath: "/signing-approval",
        variant: "triple",
        showAuditSheet: true,
      },
      "project-start": {
        crumb: ["中期推进", "开工认定"],
        pageSubtitle: "开工认定",
        statTitle: "项目审核状态",
        chartTitle: "相关部门审核情况",
        listPath: "/pro-start",
        variant: "triple",
        showAuditSheet: true,
      },
      "project-completion": {
        crumb: ["后期服务", "竣工认定"],
        pageSubtitle: "竣工认定",
        statTitle: "项目审核状态",
        chartTitle: "相关部门认定情况",
        listPath: "/pro-end",
        variant: "triple",
        showAuditSheet: true,
      },
    };
    return map[module];
  }, [module]);

  type TripleStats = { n1: number; n2: number; n3: number; total: number; l1: string; l2: string; l3: string };
  type PreStats = { n1?: number; n2?: number; total?: number; l1: string; l2: string };

  const approvalDeptMulti = useMemo(
    () => mergeProjectApprovalDeptMulti(approvalStats?.deptAuditStatistics),
    [approvalStats]
  );

  const cardStats: PreStats | TripleStats = useMemo(() => {
    if (module === "pre-evaluation") {
      return {
        n1: safeStatInt(preStats?.unfinishedCount),
        n2: safeStatInt(preStats?.finishedCount),
        total: safeStatInt(preStats?.totalCount),
        l1: "评估未完成数量",
        l2: "已全部评估数量",
      };
    }
    const auditList = approvalStats?.auditStatusStatistics;
    const totalAll = sumAllAuditCounts(auditList);
    if (module === "signing-approval") {
      return {
        n1: countByAuditCode(auditList, 5),
        n2: countByAuditCode(auditList, 7),
        n3: countByAuditCode(auditList, 8),
        total: totalAll,
        l1: "专班审核通过",
        l2: "审核不通过",
        l3: "通过不计分",
      };
    }
    if (module === "project-start") {
      return buildTripleFromAuditList(auditList, ["部门审核通过", "部门审核退回"]);
    }
    /** 竣工：优先 审核未完成/审核通过/审核不通过，名称与数量均来自接口 auditStatusStatistics */
    return buildTripleFromAuditList(auditList, ["审核未完成", "审核通过", "审核不通过"]);
  }, [approvalStats, module, preStats]);

  const completionDeptBarRows = useMemo(
    () => mapDeptMultiToCompletionBarRows(approvalDeptMulti),
    [approvalDeptMulti]
  );

  const chartSourceRows = useMemo(() => {
    if (module === "pre-evaluation") return deptRows;
    if (module === "project-completion") return completionDeptBarRows;
    return [] as DeptBarRow[];
  }, [completionDeptBarRows, deptRows, module]);

  const singleBarChartRows = useMemo(() => {
    if (module === "pre-evaluation") return chartSourceRows.slice(0, PRE_EVAL_CHART_MAX_BARS);
    if (module === "project-completion") return chartSourceRows;
    return [] as DeptBarRow[];
  }, [chartSourceRows, module]);

  /** 横向柱图高度随条数（与预评估一致，各模块共用） */
  const auditBarChartHeightPx = useMemo(() => {
    const titleGrid = 128;
    const rowPx = 36;
    const bottomBreathing = 16;
    const n = Math.max(singleBarChartRows.length, 1);
    return titleGrid + n * rowPx + bottomBreathing;
  }, [singleBarChartRows.length]);

  /** 签约/开工多柱图：含图例，高度随部门条数增长（默认 8 局 + 接口追加） */
  const multiBarChartHeightPx = useMemo(() => {
    const legendTitleGrid = 152;
    const rowPx = 36;
    const bottomBreathing = 16;
    const n = Math.max(approvalDeptMulti.length, 1);
    return legendTitleGrid + n * rowPx + bottomBreathing;
  }, [approvalDeptMulti.length]);

  const singleBarOption = useMemo(() => {
    const names = singleBarChartRows.map((r) => r.name);
    const data = singleBarChartRows.map((r) => ({ value: r.ratioPercent, count: r.count, name: r.name }));
    const max = Math.max(35, ...singleBarChartRows.map((r) => r.ratioPercent), 1);
    const completionChart = module === "project-completion";
    return {
      title: {
        text: meta?.chartTitle ?? "",
        left: 12,
        top: 8,
        textStyle: { fontSize: 14, fontWeight: 700, color: C.titleNavy },
      },
      grid: { left: 72, right: 14, top: 44, bottom: 38 },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        renderMode: "html",
        backgroundColor: "#fff",
        borderWidth: 0,
        padding: 12,
        extraCssText: "box-shadow:0 2px 12px rgba(0,0,0,0.12);border-radius:8px;",
        textStyle: { color: "#333" },
        formatter: (params: unknown) => {
          const arr = params as Array<{ name?: string; data?: { value: number; count: number } }>;
          const p = arr[0];
          if (!p?.data) return "";
          const title = escapeHtml(p.name ?? "");
          const n = p.data.count;
          const pct = Number(p.data.value).toFixed(1);
          if (completionChart) {
            return `<div style="font-weight:600;color:${BAR_TOOLTIP_TITLE};margin-bottom:6px">${title}</div>经办合计：${n} 件<br/>示图比例：${pct}%（相对列表中部门最大件数）`;
          }
          return `<div style="font-weight:600;color:${BAR_TOOLTIP_TITLE};margin-bottom:6px">${title}</div>数量：${n}<br/>占比：${pct}%`;
        },
      },
      xAxis: {
        type: "value",
        max,
        axisLabel: { formatter: "{value}%", color: C.textMuted, fontSize: 11 },
        splitLine: { show: true, lineStyle: { type: "dashed", color: C.gridLine } },
      },
      yAxis: { type: "category", data: names, axisLabel: { color: C.textMuted, fontSize: 11 } },
      series: [
        {
          type: "bar",
          data,
          barWidth: 14,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: "#1677FF" },
                { offset: 1, color: "#69C0FF" },
              ],
            },
            borderRadius: [0, 5, 5, 0],
          },
        },
      ],
    };
  }, [singleBarChartRows, meta?.chartTitle, module]);

  /** 签约核定、开工认定：三色分组横向柱图（审核通过 / 审核不通过 / 未审核） */
  const multiBarOption = useMemo(() => {
    const rows = approvalDeptMulti;
    const names = rows.map((d) => d.name);
    const totals = rows.map((d) => d.pass + d.fail + d.pending);
    const max = Math.max(1, ...totals, 8);
    return {
      title: {
        text: meta?.chartTitle ?? "",
        left: 12,
        top: 6,
        textStyle: { fontSize: 14, fontWeight: 700, color: C.titleNavy },
      },
      legend: {
        data: ["审核通过", "审核不通过", "未审核"],
        top: 32,
        left: "center",
        textStyle: { fontSize: 11, color: C.textMuted },
      },
      grid: { left: 76, right: 16, top: 72, bottom: 28 },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        renderMode: "html",
        backgroundColor: "#fff",
        borderWidth: 0,
        padding: 12,
        extraCssText: "box-shadow:0 2px 12px rgba(0,0,0,0.12);border-radius:8px;",
        textStyle: { color: "#333" },
        formatter: (params: unknown) => {
          const arr = params as Array<{
            axisValue?: string;
            seriesName?: string;
            data?: number;
            color?: string;
          }>;
          if (!arr.length) return "";
          const head = escapeHtml(String(arr[0]?.axisValue ?? ""));
          const rowsHtml = arr
            .filter((it) => it.seriesName != null && it.data != null)
            .map((it, i) => {
              const name = it.seriesName as string;
              const sq =
                typeof it.color === "string" && it.color
                  ? it.color
                  : (MULTI_BAR_SERIES_COLOR[name] ?? "#999");
              const mt = i === 0 ? "0" : "4px";
              return `<div style="display:flex;align-items:center;margin-top:${mt};line-height:1.35"><span style="flex-shrink:0;width:8px;height:8px;background:${sq};margin-right:6px;border-radius:1px"></span><span>${escapeHtml(name)}：${it.data}</span></div>`;
            })
            .join("");
          return `<div style="font-weight:600;color:${BAR_TOOLTIP_TITLE};margin-bottom:6px">${head}</div>${rowsHtml}`;
        },
      },
      xAxis: {
        type: "value",
        max,
        axisLabel: { color: C.textMuted, fontSize: 11 },
        splitLine: { show: true, lineStyle: { type: "dashed", color: C.gridLine } },
      },
      yAxis: { type: "category", data: names, axisLabel: { color: C.textMuted, fontSize: 11 } },
      series: [
        {
          name: "审核通过",
          type: "bar",
          data: rows.map((d) => d.pass),
          itemStyle: { color: "rgba(82, 196, 26, 0.92)", borderRadius: [0, 5, 5, 0] },
          barMaxWidth: 12,
        },
        {
          name: "审核不通过",
          type: "bar",
          data: rows.map((d) => d.fail),
          itemStyle: { color: "rgba(54, 197, 255, 0.95)", borderRadius: [0, 5, 5, 0] },
          barMaxWidth: 12,
        },
        {
          name: "未审核",
          type: "bar",
          data: rows.map((d) => d.pending),
          itemStyle: { color: "rgba(250, 200, 88, 0.95)", borderRadius: [0, 5, 5, 0] },
          barMaxWidth: 12,
        },
      ],
    };
  }, [approvalDeptMulti, meta?.chartTitle]);

  const goList = (extra?: Record<string, string | undefined>) => {
    if (!meta) return;
    const q = new URLSearchParams();
    if (effectiveYearForApi != null) q.set("year", String(effectiveYearForApi));
    if (effectiveIndustryForApi) q.set("industry", effectiveIndustryForApi);
    const auditFromSheet =
      filterAuditLabel && filterAuditLabel !== "全部" ? filterAuditLabel : undefined;
    const audit = extra?.auditStatus ?? auditFromSheet;
    if (audit && audit !== "全部") q.set("auditStatus", audit);
    if (extra?.status) q.set("status", extra.status);
    navigate(`${meta.listPath}?${q.toString()}`);
  };

  const signingColAudit = (col: "1" | "2" | "3") => {
    const t = cardStats as TripleStats;
    if (col === "1") return t.l1;
    if (col === "2") return t.l2;
    return t.l3;
  };

  const startColAudit = (col: "1" | "2" | "3") => signingColAudit(col);

  /** 三列跳转列表：使用卡片上展示的接口 auditStatusName */
  const tripleColAuditLabel = (col: "1" | "2" | "3") => signingColAudit(col);

  if (!module || !meta) return null;

  const statsRequestBlocking =
    (module === "pre-evaluation" && preEvalLoading) ||
    ((module === "signing-approval" || module === "project-start" || module === "project-completion") &&
      nonPreLoading);

  const filtersApplied =
    filterYear !== "all" || !!filterIndustry || (!!filterAuditLabel && filterAuditLabel !== "全部");

  const openFilterRoot = () => {
    if (meta.showAuditSheet) setFilterMenuVisible(true);
    else setFilterMenuVisible(true);
  };

  const filterMenuActions = meta.showAuditSheet
    ? [{ name: "年份" }, { name: "项目类型" }, { name: "项目审核状态" }]
    : [{ name: "年份" }, { name: "项目类型" }];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.pageBg,
        fontSize: "0.14rem",
        paddingBottom: "0.28rem",
      }}
    >
      <ActionSheet
        visible={filterMenuVisible}
        round
        cancelText="取消"
        actions={filterMenuActions}
        onCancel={() => setFilterMenuVisible(false)}
        onClose={() => setFilterMenuVisible(false)}
        onSelect={(item) => {
          if (item.name === "年份") setYearSheetVisible(true);
          if (item.name === "项目类型") setIndustrySheetVisible(true);
          if (item.name === "项目审核状态") setAuditSheetVisible(true);
        }}
      />

      <Popup visible={yearSheetVisible} onClose={() => setYearSheetVisible(false)} position="bottom" round>
        <div style={{ maxHeight: "4.6rem", overflowY: "auto", paddingTop: "0.08rem" }}>
          {yearOptions.map((row) => (
            <div
              key={String(row.value)}
              style={sheetRowStyle(filterYear === row.value)}
              onClick={() => {
                setFilterYear(row.value);
                setYearSheetVisible(false);
                setFilterMenuVisible(false);
              }}
            >
              {row.label}
            </div>
          ))}
        </div>
      </Popup>

      <Popup visible={industrySheetVisible} onClose={() => setIndustrySheetVisible(false)} position="bottom" round>
        <div style={{ paddingTop: "0.08rem" }}>
          {industryOptions.map((row) => (
            <div
              key={row.value || "all"}
              style={sheetRowStyle(filterIndustry === row.value)}
              onClick={() => {
                setFilterIndustry(row.value);
                setIndustrySheetVisible(false);
                setFilterMenuVisible(false);
              }}
            >
              {row.label}
            </div>
          ))}
        </div>
      </Popup>

      <Popup visible={auditSheetVisible} onClose={() => setAuditSheetVisible(false)} position="bottom" round>
        <div style={{ padding: "0.1rem 0.14rem", fontSize: "0.13rem", color: C.crumbParent, textAlign: "center" }}>
          项目审核状态
        </div>
        <div style={{ maxHeight: "5rem", overflowY: "auto" }}>
          {auditFilterLabels.map((label) => (
            <div
              key={label}
              style={sheetRowStyle(filterAuditLabel === label || (!filterAuditLabel && label === "全部"))}
              onClick={() => {
                setFilterAuditLabel(label === "全部" ? "" : label);
                setAuditSheetVisible(false);
                setFilterMenuVisible(false);
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </Popup>

      <div style={{ background: "#fff", padding: "0.16rem 0.2rem 0.1rem" }}>
        <div className="list-page-subtitle">{meta.pageSubtitle}</div>
      </div>

      <div style={{ marginTop: "0.12rem", padding: "0 0.2rem", boxSizing: "border-box" }}>
        <div className="audit-stats__stat-card">
          <div
            className="audit-stats__stat-inner"
            style={{
              background: STAT_CARD_BG,
              color: C.white,
              padding: "0.2rem",
              boxShadow: C.shadowCard,
              transition: "opacity 0.18s ease",
              opacity:
                (module === "pre-evaluation" && preEvalLoading) ||
                ((module === "signing-approval" ||
                  module === "project-start" ||
                  module === "project-completion") &&
                  nonPreLoading)
                  ? 0.72
                  : 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.08rem",
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: "0.18rem",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  lineHeight: 1.25,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {meta.statTitle}
              </div>
              {!filtersApplied ? (
                <button
                  type="button"
                  aria-label="筛选"
                  onClick={openFilterRoot}
                  style={{
                    border: "none",
                    padding: 0,
                    flexShrink: 0,
                    background: "transparent",
                    cursor: "pointer",
                    lineHeight: 0,
                  }}
                >
                  <EllipsisFilterIcon />
                </button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: "0.05rem",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                    flexShrink: 0,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setYearSheetVisible(true)}
                    style={{
                      border: "none",
                      borderRadius: "999px",
                      padding: "0.04rem 0.08rem",
                      fontSize: "0.12rem",
                      color: C.white,
                      background: "rgba(255,255,255,0.22)",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {filterYear === "all" ? "全部年份" : `${filterYear}年`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIndustrySheetVisible(true)}
                    style={{
                      border: "none",
                      borderRadius: "999px",
                      padding: "0.04rem 0.08rem",
                      fontSize: "0.12rem",
                      color: C.white,
                      background: "rgba(255,255,255,0.22)",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {filterIndustry || "全部"}
                  </button>
                  {meta.showAuditSheet && (
                    <button
                      type="button"
                      onClick={() => setAuditSheetVisible(true)}
                      style={{
                        border: "none",
                        borderRadius: "999px",
                        padding: "0.04rem 0.08rem",
                        fontSize: "0.12rem",
                        color: C.white,
                        background: "rgba(255,255,255,0.22)",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {filterAuditLabel || "审核状态"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {meta.variant === "pre" && (
              <>
                <div
                  style={{
                    marginTop: "0.24rem",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.16rem",
                  }}
                >
                  <div role="button" onClick={() => goList({ status: "incomplete" })} style={{ textAlign: "left", cursor: "pointer" }}>
                    <div style={{ fontSize: "0.14rem", color: "rgba(255,255,255,0.9)" }}>{cardStats.l1}</div>
                    <div
                      style={{
                        marginTop: "0.04rem",
                        fontSize: "clamp(0.3rem, 8.2vw, 0.36rem)",
                        fontWeight: 700,
                        color: C.statValue,
                        lineHeight: 1,
                      }}
                    >
                      <AnimatedStatInt value={(cardStats as PreStats).n1} animEpoch={preEvalStatsEpoch} />
                    </div>
                  </div>
                  <div role="button" onClick={() => goList({ status: "complete" })} style={{ textAlign: "left", cursor: "pointer" }}>
                    <div style={{ fontSize: "0.14rem", color: "rgba(255,255,255,0.9)" }}>{cardStats.l2}</div>
                    <div
                      style={{
                        marginTop: "0.04rem",
                        fontSize: "clamp(0.3rem, 8.2vw, 0.36rem)",
                        fontWeight: 700,
                        color: C.statValue,
                        lineHeight: 1,
                      }}
                    >
                      <AnimatedStatInt value={(cardStats as PreStats).n2} animEpoch={preEvalStatsEpoch} />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    margin: "0.2rem 0",
                    borderTop: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
                <div role="button" onClick={() => goList({ status: "all" })} style={{ cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontSize: "0.14rem", color: "rgba(255,255,255,0.9)" }}>合计统计数量</div>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "0.04rem" }}>
                    <div
                      style={{
                        fontSize: "clamp(0.44rem, 12vw, 0.52rem)",
                        fontWeight: 700,
                        color: C.statValue,
                        lineHeight: 1.1,
                      }}
                    >
                      <AnimatedStatInt value={(cardStats as PreStats).total} animEpoch={preEvalStatsEpoch} />
                    </div>
                    <PreStatMiniBars />
                  </div>
                </div>
              </>
            )}

            {meta.variant === "triple" && (
              <>
                <div
                  style={{
                    marginTop: "0.24rem",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "0.12rem",
                  }}
                >
                  <div
                    role="button"
                    onClick={() => goList({ auditStatus: tripleColAuditLabel("1") })}
                    style={{ cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ fontSize: "0.14rem", color: "rgba(255,255,255,0.9)" }}>{cardStats.l1}</div>
                    <div
                      style={{
                        marginTop: "0.04rem",
                        fontSize: "clamp(0.3rem, 8.2vw, 0.36rem)",
                        fontWeight: 700,
                        color: C.statValue,
                        lineHeight: 1,
                      }}
                    >
                      <AnimatedStatInt value={(cardStats as TripleStats).n1} animEpoch={nonPreStatsEpoch} />
                    </div>
                  </div>
                  <div
                    role="button"
                    onClick={() => goList({ auditStatus: tripleColAuditLabel("2") })}
                    style={{ cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ fontSize: "0.14rem", color: "rgba(255,255,255,0.9)" }}>{cardStats.l2}</div>
                    <div
                      style={{
                        marginTop: "0.04rem",
                        fontSize: "clamp(0.3rem, 8.2vw, 0.36rem)",
                        fontWeight: 700,
                        color: C.statValue,
                        lineHeight: 1,
                      }}
                    >
                      <AnimatedStatInt value={(cardStats as TripleStats).n2} animEpoch={nonPreStatsEpoch} />
                    </div>
                  </div>
                  <div
                    role="button"
                    onClick={() => goList({ auditStatus: tripleColAuditLabel("3") })}
                    style={{ cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ fontSize: "0.14rem", color: "rgba(255,255,255,0.9)" }}>{cardStats.l3}</div>
                    <div
                      style={{
                        marginTop: "0.04rem",
                        fontSize: "clamp(0.3rem, 8.2vw, 0.36rem)",
                        fontWeight: 700,
                        color: C.statValue,
                        lineHeight: 1,
                      }}
                    >
                      <AnimatedStatInt value={(cardStats as TripleStats).n3} animEpoch={nonPreStatsEpoch} />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    margin: "0.2rem 0",
                    borderTop: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
                <div role="button" onClick={() => goList()} style={{ cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontSize: "0.14rem", color: "rgba(255,255,255,0.9)" }}>合计统计数量</div>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "0.04rem" }}>
                    <div
                      style={{
                        fontSize: "clamp(0.44rem, 12vw, 0.52rem)",
                        fontWeight: 700,
                        color: C.statValue,
                        lineHeight: 1.1,
                      }}
                    >
                      <AnimatedStatInt value={cardStats.total} animEpoch={nonPreStatsEpoch} />
                    </div>
                    <PreStatMiniBars />
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      <div style={{ marginTop: "0.2rem", padding: "0 0.2rem" }}>
        <div className="audit-stats__flow-card">
          <div className="audit-stats__flow-chart" style={{ height: "auto", minHeight: "3.4rem", position: "relative" }}>
            {module === "signing-approval" || module === "project-start" ? (
              <div
                style={
                  approvalDeptMulti.length > PROJECT_APPROVAL_DEPT_DEFAULT_ORDER.length
                    ? {
                        maxHeight: "min(70vh, 6.2rem)",
                        overflowY: "auto",
                        overflowX: "hidden",
                        WebkitOverflowScrolling: "touch",
                      }
                    : undefined
                }
              >
                <ReactECharts
                  key={`multi-${module}-${nonPreStatsEpoch}`}
                  style={{
                    height: multiBarChartHeightPx,
                    width: "100%",
                    opacity: nonPreLoading ? 0.55 : 1,
                    transition: "opacity 0.2s ease",
                  }}
                  option={multiBarOption}
                  opts={{ renderer: "canvas", lazyUpdate: true }}
                />
              </div>
            ) : (
              (() => {
                const chartEpoch = module === "pre-evaluation" ? preEvalStatsEpoch : nonPreStatsEpoch;
                const showChartSpinner =
                  module === "pre-evaluation"
                    ? preEvalLoading && deptRows.length === 0 && preStats == null
                    : nonPreLoading && singleBarChartRows.length === 0;
                const showChartEmpty =
                  module === "pre-evaluation"
                    ? !preEvalLoading && deptRows.length === 0
                    : !nonPreLoading && singleBarChartRows.length === 0;
                if (showChartSpinner) {
                  return (
                    <div style={{ padding: "0.5rem", textAlign: "center", fontSize: "0.13rem", color: C.textMuted }}>加载中…</div>
                  );
                }
                if (showChartEmpty) {
                  return (
                    <div style={{ padding: "0.5rem", textAlign: "center", fontSize: "0.13rem", color: C.textMuted }}>暂无部门统计数据</div>
                  );
                }
                const completionScroll =
                  module === "project-completion" &&
                  singleBarChartRows.length > PROJECT_APPROVAL_DEPT_DEFAULT_ORDER.length;
                return (
                  <div
                    style={
                      completionScroll
                        ? {
                            maxHeight: "min(70vh, 6.2rem)",
                            overflowY: "auto",
                            overflowX: "hidden",
                            WebkitOverflowScrolling: "touch",
                          }
                        : undefined
                    }
                  >
                    <ReactECharts
                      key={`audit-${module}-${chartEpoch}-${singleBarChartRows.length}`}
                      style={{
                        height: auditBarChartHeightPx,
                        width: "100%",
                        ...(module === "project-completion"
                          ? { opacity: nonPreLoading ? 0.55 : 1, transition: "opacity 0.2s ease" }
                          : {}),
                      }}
                      option={singleBarOption}
                      opts={{ renderer: "canvas", lazyUpdate: true }}
                    />
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </div>
      <RequestLoadingOverlay visible={statsRequestBlocking} />
    </div>
  );
}
