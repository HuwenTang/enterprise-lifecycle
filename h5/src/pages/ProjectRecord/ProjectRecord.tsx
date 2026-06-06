import { ActionSheet, List, Search } from "react-vant";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import ListPageEmpty from "../../components/ListPageEmpty/ListPageEmpty.tsx";
import RequestLoadingOverlay from "../../components/RequestLoadingOverlay/RequestLoadingOverlay.tsx";
import { primeOpenApi } from "../../api.ts";
import type { ProjectPreEvaluationVo } from "../../apis";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";

type SheetKind = "year" | "industry" | "status" | null;

const pillBtn: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.04rem",
    background: "#f3f4f6",
    borderRadius: "999px",
    border: "none",
    padding: "0.1rem 0.08rem",
    fontSize: "0.13rem",
    color: "#374151",
    cursor: "pointer",
    minWidth: 0,
};

export default function ProjectRecord() {
    const [value, setValue] = useState("");
    const [page, setPage] = useState(0);
    const [searchParams] = useSearchParams();
    /** 筛选或搜索变更后递增；用于丢弃仍在飞行中的旧列表请求，避免串数据 */
    const listFetchTokenRef = useRef(0);
    const nextPageRef = useRef(1);

    const [filterYear, setFilterYear] = useState<number | undefined>(undefined);
    const [filterIndustry, setFilterIndustry] = useState<string>("");
    const [evalStatus, setEvalStatus] = useState<"all" | "incomplete" | "complete">("all");
    const [sheet, setSheet] = useState<SheetKind>(null);
    const [list, setList] = useState<ProjectPreEvaluationVo[]>([]);
    const [finished, setFinished] = useState<boolean>(false);
    const [listRequestBlocking, setListRequestBlocking] = useState(false);
    const navigate = useNavigate();

    const evaluationStatusParam =
        evalStatus === "all" ? undefined : evalStatus === "complete" ? "已完成" : "未完成";

    const fetchPage = async (pageNum: number) => {
        const res = await primeOpenApi.getPreEvaluationList({
            page: pageNum,
            size: 10,
            projectName: value || undefined,
            year: filterYear,
            projectType: filterIndustry || undefined,
            evaluationStatus: evaluationStatusParam,
        });
        const data = res.data;
        const cur = data?.page ?? pageNum;
        const totalPage = data?.totalPage ?? 1;
        const records = (data?.records ?? []) as ProjectPreEvaluationVo[];
        return { cur, totalPage, records };
    };

    const resetList = () => {
        listFetchTokenRef.current += 1;
        nextPageRef.current = 1;
        setPage(0);
        setList([]);
        setFinished(false);
    };

    useEffect(() => {
        const y = searchParams.get("year");
        setFilterYear(y && !Number.isNaN(Number(y)) ? Number(y) : undefined);
        const ind = searchParams.get("industry");
        setFilterIndustry(ind ?? "");
        const st = searchParams.get("status");
        if (st === "incomplete" || st === "complete" || st === "all") setEvalStatus(st);
        const pn = searchParams.get("projectName");
        setValue(pn ?? "");
    }, [searchParams]);

    /**
     * URL 或筛选项变化时必须清空列表。
     * 原先只给 List 换 key，父组件 list 仍保留旧数据，onLoad 又会 append，看起来像「接口串了」或条数不对。
     * 不把搜索框 value 放进依赖，避免输入过程中每条 keystroke 都整表重置。
     */
    useEffect(() => {
        resetList();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- 由 URL + 三项筛选驱动重置；搜索关键词用 onSearch / 清空 单独 reset
    }, [searchParams, filterYear, filterIndustry, evalStatus]);

    const listResetKey = `${filterYear ?? ""}-${filterIndustry}-${evalStatus}-${value}`;

    const onLoad = async () => {
        const token = listFetchTokenRef.current;
        const pageNum = nextPageRef.current;
        const isFirstPage = pageNum === 1;
        if (isFirstPage) setListRequestBlocking(true);
        try {
            const { cur, totalPage, records } = await fetchPage(pageNum);
            if (token !== listFetchTokenRef.current) return;
            nextPageRef.current = cur + 1;
            setPage(cur);
            if (cur >= totalPage) setFinished(true);
            setList((v) => [...v, ...records]);
        } catch {
            if (token === listFetchTokenRef.current) setFinished(true);
        } finally {
            if (isFirstPage) setListRequestBlocking(false);
        }
    };

    const yearLabels = useMemo(() => {
        const cur = dayjs().year();
        const opts: string[] = ["全部"];
        for (let i = 0; i <= 10; i++) opts.push(String(cur - i));
        return opts;
    }, []);

    const statusLabel = evalStatus === "incomplete" ? "评估未完成" : evalStatus === "complete" ? "已全部评估" : "全部";

    const yearPillText = filterYear == null ? "全部年份" : `${filterYear}年`;
    const industryPillText = filterIndustry === "" ? "全部" : filterIndustry;

    const sheetActions = useMemo(() => {
        if (sheet === "year") return yearLabels.map((n) => ({ name: n === "全部" ? "全部年份" : `${n}年` }));
        if (sheet === "industry") return [{ name: "全部" }, { name: "工业" }, { name: "服务业" }];
        if (sheet === "status") return [{ name: "全部" }, { name: "评估未完成" }, { name: "已全部评估" }];
        return [];
    }, [sheet, yearLabels]);

    const onSheetSelect = (item: { name?: string }) => {
        const name = item.name ?? "";
        if (sheet === "year") {
            if (name === "全部年份") setFilterYear(undefined);
            else setFilterYear(Number(name.replace("年", "")));
        } else if (sheet === "industry") {
            setFilterIndustry(name === "全部" ? "" : name);
        } else if (sheet === "status") {
            if (name === "全部") setEvalStatus("all");
            else if (name === "评估未完成") setEvalStatus("incomplete");
            else if (name === "已全部评估") setEvalStatus("complete");
        }
        setSheet(null);
    };

    return (
        <div
            style={{
                fontSize: "0.14rem",
                minHeight: "100vh",
                backgroundColor: "var(--color-gray-50, #fafafa)",
                overflow: "scroll",
                scrollbarWidth: "none",
            }}
        >
            <div style={{ background: "#fff", padding: "0.12rem 0.2rem 0.1rem" }}>
                <div className="list-page-subtitle">部门预评估</div>
                <div className="list-page-search-wrap" style={{ marginTop: "0.12rem" }}>
                    <Search
                        className="list-page-search-full"
                        shape="round"
                        value={value}
                        onSearch={(val) => {
                            setValue(val);
                            resetList();
                        }}
                        onChange={(val) => {
                            setValue(val);
                            if (val === "") resetList();
                        }}
                        placeholder="请输入项目名称进行搜索"
                        style={
                            {
                                width: "100%",
                                maxWidth: "100%",
                                background: "transparent",
                                "--rv-search-content-background": "transparent",
                            } as CSSProperties
                        }
                    />
                </div>

                <div
                    style={{
                        marginTop: "0.12rem",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "0.08rem",
                    }}
                >
                    <button type="button" style={pillBtn} onClick={() => setSheet("year")}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{yearPillText}</span>
                        <DownOutlined style={{ fontSize: "0.1rem", opacity: 0.7, flexShrink: 0 }} />
                    </button>
                    <button type="button" style={pillBtn} onClick={() => setSheet("industry")}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{industryPillText}</span>
                        <DownOutlined style={{ fontSize: "0.1rem", opacity: 0.7, flexShrink: 0 }} />
                    </button>
                    <button type="button" style={pillBtn} onClick={() => setSheet("status")}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{statusLabel}</span>
                        <DownOutlined style={{ fontSize: "0.1rem", opacity: 0.7, flexShrink: 0 }} />
                    </button>
                </div>
            </div>

            <ActionSheet
                visible={sheet != null}
                actions={sheetActions}
                cancelText="取消"
                onCancel={() => setSheet(null)}
                onClose={() => setSheet(null)}
                onSelect={onSheetSelect}
            />

            <List key={listResetKey} style={{ height: "calc(100vh - 2.25rem)" }} finished={finished} onLoad={onLoad}>
                {finished && list.length === 0 ? (
                    <ListPageEmpty />
                ) : (
                    list.map((item, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                fontSize: "0.14rem",
                                marginTop: "0.15rem",
                                marginBottom: "15px",
                                marginLeft: "0.2rem",
                                marginRight: "0.2rem",
                                backgroundColor: "#fff",
                                padding: "0.15rem 0.18rem",
                                borderRadius: "0.05rem",
                                boxShadow: "0 0.01rem 0.02rem rgba(0,0,0,0.1)",
                            }}
                            onClick={() => {
                                const zsid = (item as ProjectPreEvaluationVo & { projectCode?: string }).projectCode ?? item.id ?? "";
                                navigate(`/qualitative-state?id=${item.id}&isCom=0&zsid=${encodeURIComponent(zsid)}`);
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "bold",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                项目名称：{item.projectName}
                            </div>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    marginTop: "0.2rem",
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    所属板块：<span style={{ color: "#48a2ff" }}>{item.park ?? "—"}</span>
                                </div>
                            </div>
                            <div
                                style={{
                                    width: "100%",
                                    marginTop: "0.1rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                国民经济分类：<span style={{ color: "#8587fa" }}>{item.industryClassification ?? "—"}</span>
                            </div>
                            <div
                                style={{
                                    width: "100%",
                                    marginTop: "0.1rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                投资方：<span style={{ color: "#8587fa" }}>{item.investor}</span>
                            </div>
                            <div
                                style={{
                                    width: "100%",
                                    marginTop: "0.1rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                投资总额：
                                <span style={{ color: "#ffad22" }}>
                                    {item.totalInvestmentCny != null ? `${item.totalInvestmentCny}亿元` : "—"}
                                </span>
                            </div>
                        </div>
                    );
                })
                )}
            </List>
            <RequestLoadingOverlay visible={listRequestBlocking} />
        </div>
    );
}
