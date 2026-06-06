import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
    BuildOutlined,
    DownOutlined,
    StarOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { DRAGON_TIGER_CITY_TOTAL_NAME, DRAGON_TIGER_DISTRICT_ORDER, mustGetDragonTigerRawRow } from "./static-1-7";
import { REMARKS } from "./beizhu";

type ProjectTypeFilter = "shengKey" | "shiKey";

type KeyProjectDistrict = {
    name: string;
    pro_num_1e: number;
    jihua_le: number;
    year_1e: number;
    lietong_1e: number;
    ruku_1e: number;
    wanchenglv_1e: string;
    xinkaigong_1e: number;
    yikaigong_1e: number;
    kaigonglv_1e: string;
    /** 仅省重大表格口径有该列（已开工未列统项目数） */
    yikaigongWeilietong_1e?: number;
};

function keep2IfTooLong(n: number | string): string {
    const s = String(n);
    const dot = s.indexOf(".");
    if (dot === -1) return s;
    const decimals = s.length - dot - 1;
    if (decimals <= 2) return s;
    const num = Number(n);
    if (!Number.isFinite(num)) return "0";
    return num.toFixed(2);
}

function fmt1(n: number | string) {
    const num = Number(n);
    if (!Number.isFinite(num)) return "0.0";
    return num.toFixed(1);
}

const SHENG_DISTRICTS: KeyProjectDistrict[] = [
    buildKeyProjectDistrict(DRAGON_TIGER_CITY_TOTAL_NAME, "省重大项目情况"),
    ...DRAGON_TIGER_DISTRICT_ORDER.map((r) => buildKeyProjectDistrict(r, "省重大项目情况")),
];

// 市重点项目情况（按截图顺序）
const SHI_KEY_DISTRICTS: KeyProjectDistrict[] = [
    buildKeyProjectDistrict(DRAGON_TIGER_CITY_TOTAL_NAME, "市重点项目情况"),
    ...DRAGON_TIGER_DISTRICT_ORDER.map((r) => buildKeyProjectDistrict(r, "市重点项目情况")),
];

function n0(v: unknown): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function buildKeyProjectDistrict(region: string, key: "省重大项目情况" | "市重点项目情况"): KeyProjectDistrict {
    const raw = mustGetDragonTigerRawRow(region);
    const obj = (raw[key] as Record<string, unknown> | undefined) ?? {};
    const yearInvest = (obj["年度投资完成情况"] as Record<string, unknown> | undefined) ?? {};
    const start = (obj["项目开工情况"] as Record<string, unknown> | undefined) ?? {};
    return {
        name: region === DRAGON_TIGER_CITY_TOTAL_NAME ? "全市" : region,
        pro_num_1e: n0(obj["项目数量"]),
        jihua_le: n0(obj["计划总投资"]),
        year_1e: n0(obj["年度投资"]),
        lietong_1e: n0(yearInvest["已列统项目数"]),
        ruku_1e: n0(yearInvest["实际入库投资"]),
        wanchenglv_1e: String(yearInvest["投资完成率"] ?? "0.0%"),
        xinkaigong_1e: n0(start["新开工项目数"]),
        yikaigong_1e: n0(start["已开工项目数"]),
        kaigonglv_1e: String(start["开工率"] ?? "0.0%"),
        yikaigongWeilietong_1e: n0(obj["已开工未列统项目数"]),
    };
}

 

function medalFor(idx: number) {
    return `${idx + 1}`;
}

function parsePct(s: string): number {
    const n = parseFloat(String(s).replace("%", "").trim());
    return Number.isFinite(n) ? n : 0;
}

type RankRow = { name: string; value: string };

function rowsFromKeyData(
    data: KeyProjectDistrict[],
    getValue: (d: KeyProjectDistrict) => number | string,
    format: (v: number | string, d: KeyProjectDistrict) => string,
    opts?: { keepOrder?: boolean },
): RankRow[] {
    const enriched = data.map((d) => {
        const raw = getValue(d);
        const num = typeof raw === "number" ? raw : parsePct(String(raw));
        return { d, raw, num };
    });
    if (!opts?.keepOrder) {
        enriched.sort((a, b) => b.num - a.num);
    }
    return enriched.map((x) => ({ name: x.d.name, value: format(x.raw, x.d) }));
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

function RankBlock(props: { title: string; icon: ReactNode; rows: RankRow[] }) {
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "0.04rem",
                }}
            >
                <span style={{ fontSize: "0.13rem", display: "flex", alignItems: "center", gap: "0.06rem" }}>
                    {props.icon}
                    {props.title}
                </span>
            </div>
            <div style={{ marginTop: "0.08rem" }}>
                {props.rows.map((r, idx) => (
                    <div
                        key={`${r.name}-${idx}`}
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
            </div>
        </div>
    );
}

function CollapsibleCard(props: {
    icon: ReactNode;
    title: string;
    open: boolean;
    onToggle: () => void;
    children: ReactNode;
    showInsight?: ReactNode;
}) {
    return (
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
                    marginBottom: props.open ? "0.14rem" : 0,
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
                    {props.icon} {props.title}
                </span>
                <DownOutlined
                    style={{
                        fontSize: "0.12rem",
                        color: "#5b6e8c",
                        transform: props.open ? "rotate(0deg)" : "rotate(-90deg)",
                        transition: "transform 0.3s ease",
                    }}
                />
            </div>
            {props.open && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.16rem" }}>
                    {props.children}
                    {props.showInsight}
                </div>
            )}
        </div>
    );
}

export default function DragonTigerKeyProjects() {
    const [projectType, setProjectType] = useState<ProjectTypeFilter>("shengKey");
    const [openBasic, setOpenBasic] = useState(true);
    const [openYearInvest, setOpenYearInvest] = useState(false);
    const [openStart, setOpenStart] = useState(false);

    const districts = projectType === "shengKey" ? SHENG_DISTRICTS : SHI_KEY_DISTRICTS;

    // 省重大/市重点模块均按“截图/通报表”顺序展示（不做数值排序）
    const keepOrder = true;

    const basicBlocks = useMemo(
        () => ({
            proNum: rowsFromKeyData(districts, (d) => d.pro_num_1e, (v) => `${v}个`, { keepOrder }),
            jihua: rowsFromKeyData(districts, (d) => d.jihua_le, (v) =>
                projectType === "shiKey" ? `${keep2IfTooLong(v)}亿元` : `${v}亿元`,
                { keepOrder },
            ),
            year: rowsFromKeyData(districts, (d) => d.year_1e, (v) =>
                projectType === "shiKey" ? `${keep2IfTooLong(v)}亿元` : `${v}亿元`,
                { keepOrder },
            ),
        }),
        [districts, projectType, keepOrder],
    );

    const yearInvestBlocks = useMemo(
        () => ({
            lietong: rowsFromKeyData(districts, (d) => d.lietong_1e, (v) => `${v}个`, { keepOrder }),
            ruku: rowsFromKeyData(
                districts,
                (d) => d.ruku_1e,
                (v) => (projectType === "shengKey" ? `${fmt1(v)}亿元` : `${fmt1(v)}亿元`),
                { keepOrder },
            ),
            wanchenglv: rowsFromKeyData(
                districts,
                (d) => parsePct(d.wanchenglv_1e),
                (_v, d) => d.wanchenglv_1e,
                { keepOrder },
            ),
        }),
        [districts, keepOrder, projectType],
    );

    const startBlocks = useMemo(
        () => ({
            xinkai: rowsFromKeyData(districts, (d) => d.xinkaigong_1e, (v) => `${v}个`, { keepOrder }),
            yikai: rowsFromKeyData(districts, (d) => d.yikaigong_1e, (v) => `${v}个`, { keepOrder }),
            kaigonglv: rowsFromKeyData(
                districts,
                (d) => parsePct(d.kaigonglv_1e),
                (_v, d) => d.kaigonglv_1e,
                { keepOrder },
            ),
        }),
        [districts, keepOrder],
    );

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fc",
                fontFamily: "'Segoe UI', 'Roboto', system-ui, -apple-system, 'Helvetica Neue', sans-serif",
                color: "#1e293b",
                WebkitTapHighlightColor: "transparent",
                paddingBottom: "0.24rem",
            }}
        >
            <div
                style={{
                    maxWidth: "5rem",
                    margin: "0 auto",
                    minHeight: "100vh",
                    boxShadow: "0 0 20px rgba(0,0,0,0.05)",
                }}
            >
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
                    {/*<button*/}
                    {/*    type="button"*/}
                    {/*    aria-label="返回"*/}
                    {/*    onClick={() => navigate("/dragon-tiger")}*/}
                    {/*    style={{*/}
                    {/*        position: "absolute",*/}
                    {/*        top: "0.2rem",*/}
                    {/*        left: "0.18rem",*/}
                    {/*        background: "rgba(255,255,255,0.2)",*/}
                    {/*        border: "none",*/}
                    {/*        color: "#fff",*/}
                    {/*        width: "0.36rem",*/}
                    {/*        height: "0.36rem",*/}
                    {/*        borderRadius: "50%",*/}
                    {/*        display: "flex",*/}
                    {/*        alignItems: "center",*/}
                    {/*        justifyContent: "center",*/}
                    {/*        cursor: "pointer",*/}
                    {/*        transition: "all 0.2s",*/}
                    {/*        fontSize: "0.14rem",*/}
                    {/*        zIndex: 10,*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <ArrowLeftOutlined />*/}
                    {/*</button>*/}
                    <h1
                        style={{
                            fontSize: "0.18rem",
                            fontWeight: 600,
                            letterSpacing: -0.3,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.08rem",
                            margin: 0,
                            // paddingLeft: "0.42rem",
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
                                alignItems: "center",
                            }}
                        >
                            <StarOutlined />
                        </span>
                        重点项目情况
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
                            gap: "0.08rem",
                        }}
                    >
                       
                    </div>
                </div>

                <div style={{ padding: "0.18rem 0.16rem 0.2rem" }}>
                    <div style={{ margin: "0.15rem 0" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.1rem", width: "100%" }}>
                            <span style={{ fontSize: "0.13rem", color: "#666", minWidth: "0.7rem", flexShrink: 0 }}>项目类型：</span>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.1rem", flex: 1 }}>
                                <button
                                    type="button"
                                    style={filterBtnStyle(projectType === "shengKey")}
                                    onClick={() => setProjectType("shengKey")}
                                >
                                    省重大
                                </button>
                                <button
                                    type="button"
                                    style={filterBtnStyle(projectType === "shiKey")}
                                    onClick={() => setProjectType("shiKey")}
                                >
                                    市重点
                                </button>
                            </div>
                        </div>
                    </div>

                    <>
                        <CollapsibleCard
                            icon={<TrophyOutlined />}
                            title="项目基本情况"
                            open={openBasic}
                            onToggle={() => setOpenBasic((v) => !v)}
                        >
                            <RankBlock title="项目数量" icon={<StarOutlined style={{ fontSize: "0.14rem" }} />} rows={basicBlocks.proNum} />
                            <RankBlock title="计划总投资" icon={<BuildOutlined style={{ fontSize: "0.14rem" }} />} rows={basicBlocks.jihua} />
                            <RankBlock title="年度投资" icon={<StarOutlined style={{ fontSize: "0.14rem" }} />} rows={basicBlocks.year} />
                        </CollapsibleCard>

                        <CollapsibleCard
                            icon={<TrophyOutlined />}
                            title="年度投资完成情况"
                            open={openYearInvest}
                            onToggle={() => setOpenYearInvest((v) => !v)}
                        >
                            <RankBlock title="列统项目数" icon={<StarOutlined style={{ fontSize: "0.14rem" }} />} rows={yearInvestBlocks.lietong} />
                            <RankBlock title="实际入库投资" icon={<BuildOutlined style={{ fontSize: "0.14rem" }} />} rows={yearInvestBlocks.ruku} />
                            <RankBlock title="投资完成率" icon={<StarOutlined style={{ fontSize: "0.14rem" }} />} rows={yearInvestBlocks.wanchenglv} />
                        </CollapsibleCard>

                        <CollapsibleCard
                            icon={<TrophyOutlined />}
                            title="项目开工情况"
                            open={openStart}
                            onToggle={() => setOpenStart((v) => !v)}
                            showInsight={
                                projectType === "shengKey" ? (
                                    <InsightNote>
                                        备注：
                                        {REMARKS.l2_shengKey.map((line, idx) => (
                                            <div key={idx} style={{ marginTop: idx === 0 ? "0.04rem" : 0 }}>
                                                {line}
                                            </div>
                                        ))}
                                    </InsightNote>
                                ) : (
                                    <InsightNote>
                                        备注：
                                        {REMARKS.l2_shiKey.map((line, idx) => (
                                            <div key={idx} style={{ marginTop: idx === 0 ? "0.04rem" : 0 }}>
                                                {line}
                                            </div>
                                        ))}
                                    </InsightNote>
                                )
                            }
                        >
                            <RankBlock title="新开工项目数" icon={<StarOutlined style={{ fontSize: "0.14rem" }} />} rows={startBlocks.xinkai} />
                            <RankBlock title="已开工项目数" icon={<BuildOutlined style={{ fontSize: "0.14rem" }} />} rows={startBlocks.yikai} />
                            <RankBlock title="开工率" icon={<StarOutlined style={{ fontSize: "0.14rem" }} />} rows={startBlocks.kaigonglv} />
                        </CollapsibleCard>
                    </>
                </div>
            </div>
        </div>
    );
}
