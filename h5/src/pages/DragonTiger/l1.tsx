import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
    DownOutlined,
    GoldOutlined,
    RiseOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { DRAGON_TIGER_CITY_TOTAL_NAME, DRAGON_TIGER_DISTRICT_ORDER, mustGetDragonTigerRawRow } from "./static-1-7";
import { REMARKS } from "./beizhu";

type AmountFilter = "year" | "first_quarter";

type DistrictRow = {
    name: string;
    finished_1e: number;
    predict_quarter_1e: number;
    predict_progress_quarter_1e: string;
    predict_year_1e: number;
    predict_progress_year_1e: string;
};

function n0(v: unknown): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function pctTextToNumberString(v: unknown): string {
    const s = String(v ?? "");
    return s.replace(/%/g, "").trim();
}

function readFixedInvestmentRow(region: string): DistrictRow {
    const raw = mustGetDragonTigerRawRow(region);
    const fi = (raw["固定资产投资情况"] as Record<string, unknown> | undefined) ?? {};
    return {
        name: region,
        finished_1e: n0(fi["1-4月完成数"]),
        predict_quarter_1e: n0(fi["上半年预测数"]),
        predict_progress_quarter_1e: pctTextToNumberString(fi["上半年完成进度"]),
        predict_year_1e: n0(fi["全年预测数"]),
        predict_progress_year_1e: pctTextToNumberString(fi["全年完成进度"]),
    };
}

const ALL_DISTRICTS: DistrictRow[] = [
    readFixedInvestmentRow(DRAGON_TIGER_CITY_TOTAL_NAME),
    ...DRAGON_TIGER_DISTRICT_ORDER.map(readFixedInvestmentRow),
];

const FILTER_OPTIONS: { key: AmountFilter; label: string }[] = [
    { key: "year", label: "全年" },
    { key: "first_quarter", label: "上半年" },
];

function medalFor(idx: number) {
    return `${idx + 1}`;
}

function numSort(a: DistrictRow, b: DistrictRow, key: keyof DistrictRow, desc = true) {
    const av = parseFloat(String(a[key]));
    const bv = parseFloat(String(b[key]));
    return desc ? bv - av : av - bv;
}

function fmt1(n: number) {
    return n.toFixed(1);
}

function fmtIntOr1(n: number) {
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function fmtPct1(v: string) {
    const n = Number.parseFloat(v);
    if (!Number.isFinite(n)) return v;
    return n.toFixed(1);
}

export default function DragonTigerFixedInvestment() {
    const [amountFilter, setAmountFilter] = useState<AmountFilter>("year");
    const [openFinished, setOpenFinished] = useState(true);
    const [openPredict, setOpenPredict] = useState(true);
    const [openProgress, setOpenProgress] = useState(false);

    const finishedRows = useMemo(
        () => [...ALL_DISTRICTS].sort((a, b) => numSort(a, b, "finished_1e")),
        [],
    );

    const predictRows = useMemo(() => {
        if (amountFilter === "year") {
            return [...ALL_DISTRICTS].sort((a, b) => numSort(a, b, "predict_year_1e"));
        }
        return [...ALL_DISTRICTS].sort((a, b) => numSort(a, b, "predict_quarter_1e"));
    }, [amountFilter]);

    const progressRows = useMemo(() => {
        if (amountFilter === "year") {
            return [...ALL_DISTRICTS].sort((a, b) =>
                numSort(a, b, "predict_progress_year_1e"),
            );
        }
        return [...ALL_DISTRICTS].sort((a, b) =>
            numSort(a, b, "predict_progress_quarter_1e"),
        );
    }, [amountFilter]);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fc",
                fontFamily: "'Segoe UI', 'Roboto', system-ui, -apple-system, 'Helvetica Neue', sans-serif",
                color: "#1e293b",
                WebkitTapHighlightColor: "transparent",
                paddingBottom: "0.2rem",
            }}
        >
            <div
                style={{
                    /* 全局 html{font-size:100px}，1rem=100px，版心 5rem=500px */
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
                            <GoldOutlined />
                        </span>
                        固定资产投资情况
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
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "0.1rem",
                                width: "100%",
                            }}
                        >
                            <span style={{ fontSize: "0.13rem", color: "#666", minWidth: "0.7rem", flexShrink: 0 }}>
                            时间范围：
                            </span>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "0.1rem",
                                    flex: 1,
                                }}
                            >
                                {FILTER_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.key}
                                        type="button"
                                        onClick={() => setAmountFilter(opt.key)}
                                        style={{
                                            padding: "0.02rem 0.12rem",
                                            border: "1px solid #4e73df",
                                            background: amountFilter === opt.key ? "#4e73df" : "#fff",
                                            color: amountFilter === opt.key ? "#fff" : "#4e73df",
                                            borderRadius: "0.2rem",
                                            cursor: "pointer",
                                            fontSize: "0.13rem",
                                            transition: "all 0.3s",
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
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
                        <SectionHeader
                            icon={<TeamOutlined />}
                            label="当前完成数"
                            collapsed={!openFinished}
                            onToggle={() => setOpenFinished((v) => !v)}
                        />
                        {openFinished && (
                            <div style={{ marginTop: "0.08rem" }}>
                                {finishedRows.map((d, idx) => (
                                    <RankRow
                                        key={d.name}
                                        medal={medalFor(idx)}
                                        name={d.name}
                                        value={`${fmt1(d.finished_1e)}亿元`}
                                    />
                                ))}
                            </div>
                        )}

                        <SectionHeader
                            icon={<TeamOutlined />}
                            label="固投预测数"
                            collapsed={!openPredict}
                            onToggle={() => setOpenPredict((v) => !v)}
                            style={{ marginTop: "0.16rem" }}
                        />
                        {openPredict && (
                            <div style={{ marginTop: "0.08rem" }}>
                                {predictRows.map((d, idx) => (
                                    <RankRow
                                        key={d.name}
                                        medal={medalFor(idx)}
                                        name={d.name}
                                        value={
                                            amountFilter === "year"
                                                ? `${fmtIntOr1(d.predict_year_1e)}亿元`
                                                : `${fmt1(d.predict_quarter_1e)}亿元`
                                        }
                                    />
                                ))}
                            </div>
                        )}

                        <SectionHeader
                            icon={<RiseOutlined />}
                            label="固投完成进度"
                            collapsed={!openProgress}
                            onToggle={() => setOpenProgress((v) => !v)}
                            style={{ marginTop: "0.16rem" }}
                        />
                        {openProgress && (
                            <div style={{ marginTop: "0.08rem" }}>
                                {progressRows.map((d, idx) => (
                                    <RankRow
                                        key={d.name}
                                        medal={medalFor(idx)}
                                        name={d.name}
                                        value={
                                            amountFilter === "year"
                                                ? `${fmtPct1(d.predict_progress_year_1e)}%`
                                                : `${fmtPct1(d.predict_progress_quarter_1e)}%`
                                        }
                                    />
                                ))}
                            </div>
                        )}

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
                            备注：
                            {REMARKS.l1_fixedInvestment.map((line, idx) => (
                                <div key={idx} style={{ marginTop: idx === 0 ? "0.04rem" : 0 }}>
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function SectionHeader(props: {
    icon: ReactNode;
    label: string;
    collapsed: boolean;
    onToggle: () => void;
    style?: CSSProperties;
}) {
    const { icon, label, collapsed, onToggle, style } = props;
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onToggle}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggle();
                }
            }}
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
                cursor: "pointer",
                userSelect: "none",
                transition: "all 0.2s",
                ...style,
            }}
        >
            <span style={{ display: "flex", alignItems: "center", gap: "0.08rem", fontSize: "0.15rem" }}>
                {icon} {label}
            </span>
            <DownOutlined
                style={{
                    fontSize: "0.12rem",
                    color: "#5b6e8c",
                    transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    marginLeft: "auto",
                }}
            />
        </div>
    );
}

function RankRow(props: { medal: string; name: string; value: string }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.1rem 0",
                borderBottom: "1px solid #edf2f7",
                fontSize: "0.14rem",
            }}
        >
            <div
                style={{
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.08rem",
                    minWidth: 0,
                }}
            >
                <span
                    style={{
                        width: "0.24rem",
                        textAlign: "center",
                        fontWeight: "bold",
                        flexShrink: 0,
                    }}
                >
                    {props.medal}
                </span>
                <span style={{ overflowWrap: "break-word" }}>{props.name}</span>
            </div>
            <div style={{ fontWeight: 700, color: "#1f4f3a", flexShrink: 0, marginLeft: "0.08rem" }}>
                {props.value}
            </div>
        </div>
    );
}
