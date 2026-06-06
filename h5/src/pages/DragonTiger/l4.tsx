import { useMemo, useState } from "react";
import { BankOutlined, DownOutlined, TeamOutlined } from "@ant-design/icons";
import type { CSSProperties } from "react";
import { DRAGON_TIGER_CITY_TOTAL_NAME, DRAGON_TIGER_DISTRICT_ORDER, mustGetDragonTigerRawRow } from "./static-1-7";
import { REMARKS } from "./beizhu";

type SectorFilter =
    | "all"
    | "industry"
    | "construction"
    | "piling"
    | "zhucan"
    | "realty"
    | "service";

type DistrictRow = {
    name: string;
    all_1e: number;
    industry_1e: number;
    construction_1e: number;
    piling_1e: number;
    zhucan_1e: number;
    realty_le: number;
    service_1e: number;
};

type DistrictNumberKey = Exclude<keyof DistrictRow, "name">;

// 「四上」企业新增数情况 — 静态数据（按通报表截图）
function n0(v: unknown): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function readFourUpRow(region: string): DistrictRow {
    const raw = mustGetDragonTigerRawRow(region);
    const obj = (raw["“四上”企业新增数情况"] as Record<string, unknown> | undefined) ?? {};
    return {
        name: region === DRAGON_TIGER_CITY_TOTAL_NAME ? "全市" : region,
        all_1e: n0(obj["总数"]),
        industry_1e: n0(obj["工业"]),
        construction_1e: n0(obj["建筑业"]),
        piling_1e: n0(obj["批零业"]),
        zhucan_1e: n0(obj["住餐业"]),
        realty_le: n0(obj["房地产业"]),
        service_1e: n0(obj["服务业"]),
    };
}

const CITY_TOTAL: DistrictRow = readFourUpRow(DRAGON_TIGER_CITY_TOTAL_NAME);
const ALL_DISTRICTS: DistrictRow[] = DRAGON_TIGER_DISTRICT_ORDER.map(readFourUpRow);

const SECTOR_OPTIONS: { key: SectorFilter; label: string }[] = [
    { key: "all", label: "全部" },
    { key: "industry", label: "工业" },
    { key: "construction", label: "建筑业" },
    { key: "piling", label: "批零业" },
    { key: "zhucan", label: "住餐业" },
    { key: "realty", label: "房地产业" },
    { key: "service", label: "服务业" },
];

const RANK_TITLE: Record<SectorFilter, string> = {
    all: "全部四上企业数量",
    industry: "四上工业企业数量",
    construction: "四上建筑业企业数量",
    piling: "四上批零业企业数量",
    zhucan: "四上住餐业企业数量",
    realty: "四上房地产业企业数量",
    service: "四上服务业企业数量",
};

const SORT_KEY: Record<SectorFilter, DistrictNumberKey> = {
    all: "all_1e",
    industry: "industry_1e",
    construction: "construction_1e",
    piling: "piling_1e",
    zhucan: "zhucan_1e",
    realty: "realty_le",
    service: "service_1e",
};

function medalFor(idx: number) {
    return `${idx + 1}`;
}

const filterBtn = (active: boolean): CSSProperties => ({
    padding: "0.02rem 0.12rem",
    border: "1px solid #4e73df",
    background: active ? "#4e73df" : "#fff",
    color: active ? "#fff" : "#4e73df",
    borderRadius: "0.2rem",
    cursor: "pointer",
    fontSize: "0.13rem",
    transition: "all 0.3s",
});

export default function DragonTigerFourNewEnterprises() {
    const [sector, setSector] = useState<SectorFilter>("all");
    const [openRank, setOpenRank] = useState(true);

    const rankRows = useMemo(() => {
        const key = SORT_KEY[sector];
        return [...ALL_DISTRICTS]
            .sort((a, b) => b[key] - a[key])
            .map((d) => ({
                name: d.name,
                value: `${d[key]}个`,
            }));
    }, [sector]);

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
                            <BankOutlined />
                        </span>
                        四上企业新增数情况
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

                <div style={{ padding: "0.18rem 0.16rem 0.1rem" }}>
                    {/* <div
                        style={{
                            background: "#fff",
                            borderRadius: "0.24rem",
                            padding: "0.14rem 0.16rem",
                            marginBottom: "0.14rem",
                            border: "1px solid #eef2f8",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "0.12rem",
                        }}
                    >
                        <div style={{ fontSize: "0.13rem", color: "#475569", display: "flex", alignItems: "center", gap: "0.08rem" }}>
                            <TeamOutlined />
                            全市新增
                        </div>
                        <div style={{ fontSize: "0.2rem", fontWeight: 700, color: "#0f2b3d" }}>{CITY_TOTAL.all_1e}个</div>
                    </div> */}
                    <div style={{ margin: "0.15rem 0" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.1rem", width: "100%" }}>
                            <span style={{ fontSize: "0.13rem", color: "#666", minWidth: "0.7rem", flexShrink: 0 }}>行业分类：</span>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.1rem", flex: 1 }}>
                                {SECTOR_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.key}
                                        type="button"
                                        style={filterBtn(sector === opt.key)}
                                        onClick={() => setSector(opt.key)}
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
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setOpenRank((v) => !v)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setOpenRank((v) => !v);
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
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center", gap: "0.08rem", minWidth: 0 }}>
                                <TeamOutlined />
                                <span style={{ overflowWrap: "break-word" }}>{RANK_TITLE[sector]}</span>
                            </span>
                            <DownOutlined
                                style={{
                                    fontSize: "0.12rem",
                                    color: "#5b6e8c",
                                    transform: openRank ? "rotate(0deg)" : "rotate(-90deg)",
                                    transition: "transform 0.3s ease",
                                    flexShrink: 0,
                                    marginLeft: "auto",
                                }}
                            />
                        </div>

                        {openRank && (
                            <div style={{ marginTop: "0.08rem" }}>
                                {rankRows.map((r, idx) => (
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
                                                {medalFor(idx)}
                                            </span>
                                            <span style={{ overflowWrap: "break-word" }}>{r.name}</span>
                                        </div>
                                        <div
                                            style={{
                                                fontWeight: 700,
                                                color: "#1f4f3a",
                                                flexShrink: 0,
                                                marginLeft: "0.08rem",
                                            }}
                                        >
                                            {r.value}
                                        </div>
                                    </div>
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
                            {REMARKS.l4_fourUp.map((line, idx) => (
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
