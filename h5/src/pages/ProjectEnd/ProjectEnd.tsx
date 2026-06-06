import { ActionSheet, List, Search } from "react-vant";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import ListPageEmpty from "../../components/ListPageEmpty/ListPageEmpty.tsx";
import RequestLoadingOverlay from "../../components/RequestLoadingOverlay/RequestLoadingOverlay.tsx";
import { primeOpenApi } from "../../api.ts";
import type { ProjectApprovalVo } from "../../apis";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { useProjectFilterDicts } from "../../hooks/useProjectFilterDicts.ts";

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

export default function ProjectEnd() {
  const { auditFilterLabels, auditLabelToCode } = useProjectFilterDicts();
  const [value, setValue] = useState("");
  const [searchParams] = useSearchParams();
  const listFetchTokenRef = useRef(0);
  const nextPageRef = useRef(1);

  const [filterYear, setFilterYear] = useState<number | undefined>(undefined);
  const [filterIndustry, setFilterIndustry] = useState("");
  const [auditLabel, setAuditLabel] = useState("");
  const [sheet, setSheet] = useState<SheetKind>(null);

  const [list, setList] = useState<ProjectApprovalVo[]>([]);
  const [finished, setFinished] = useState<boolean>(false);
  const [listRequestBlocking, setListRequestBlocking] = useState(false);
  const navigate = useNavigate();

  const fetchPage = async (pageNum: number) => {
    const res = await primeOpenApi.getProjectApprovalList({
      projectStage: "complete",
      page: pageNum,
      size: 10,
      projectName: value || undefined,
      year: filterYear,
      projectType: filterIndustry || undefined,
      auditStatus: auditLabelToCode(auditLabel),
    });
    const data = res.data;
    const cur = data?.page ?? pageNum;
    const totalPage = data?.totalPage ?? 1;
    const records = data?.records ?? [];
    return { cur, totalPage, records };
  };

  const resetList = () => {
    listFetchTokenRef.current += 1;
    nextPageRef.current = 1;
    setList([]);
    setFinished(false);
  };

  useEffect(() => {
    const y = searchParams.get("year");
    setFilterYear(y && !Number.isNaN(Number(y)) ? Number(y) : undefined);
    const ind = searchParams.get("industry");
    setFilterIndustry(ind ?? "");
    const audit = searchParams.get("auditStatus");
    setAuditLabel(audit ? decodeURIComponent(audit) : "");
    const pn = searchParams.get("projectName");
    setValue(pn ?? "");
  }, [searchParams]);

  useEffect(() => {
    resetList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, filterYear, filterIndustry, auditLabel]);

  const listResetKey = `${filterYear ?? ""}-${filterIndustry}-${auditLabel}-${value}`;

  const onLoad = async () => {
    const token = listFetchTokenRef.current;
    const pageNum = nextPageRef.current;
    const isFirstPage = pageNum === 1;
    if (isFirstPage) setListRequestBlocking(true);
    try {
      const { cur, totalPage, records } = await fetchPage(pageNum);
      if (token !== listFetchTokenRef.current) return;
      nextPageRef.current = cur + 1;
      if (cur >= totalPage) setFinished(true);
      setList((v) => [...v, ...records]);
    } catch {
      if (token === listFetchTokenRef.current) setFinished(true);
    } finally {
      if (isFirstPage) setListRequestBlocking(false);
    }
  };

  const yearLabels = useMemo(() => {
    const cur = new Date().getFullYear();
    const opts: string[] = ["全部"];
    for (let i = 0; i <= 10; i++) opts.push(String(cur - i));
    return opts;
  }, []);

  const yearPillText = filterYear == null ? "全部年份" : `${filterYear}年`;
  const industryPillText = filterIndustry === "" ? "全部" : filterIndustry;
  const statusPillText = auditLabel === "" ? "全部" : auditLabel;

  const sheetActions = useMemo(() => {
    if (sheet === "year") return yearLabels.map((n) => ({ name: n === "全部" ? "全部年份" : `${n}年` }));
    if (sheet === "industry") return [{ name: "全部" }, { name: "工业" }, { name: "服务业" }];
    if (sheet === "status")
      return auditFilterLabels.map((label) => ({ name: label === "全部" ? "全部" : label }));
    return [];
  }, [sheet, yearLabels, auditFilterLabels]);

  const onSheetSelect = (item: { name?: string }) => {
    const name = item.name ?? "";
    if (sheet === "year") {
      if (name === "全部年份") setFilterYear(undefined);
      else setFilterYear(Number(name.replace("年", "")));
    } else if (sheet === "industry") {
      setFilterIndustry(name === "全部" ? "" : name);
    } else if (sheet === "status") {
      setAuditLabel(name === "全部" ? "" : name);
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
      <div style={{ background: "#fff", padding: "0.16rem 0.2rem 0.1rem" }}>
        <div className="list-page-subtitle">竣工认定</div>

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
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{statusPillText}</span>
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

      <List key={listResetKey} style={{ height: "calc(100vh - 2.75rem)" }} finished={finished} onLoad={onLoad}>
        {finished && list.length === 0 ? (
          <ListPageEmpty />
        ) : (
          list.map((item, index) => {
          const zsid = (item as ProjectApprovalVo & { projectCode?: string }).projectCode ?? item.id ?? "";
          return (
            <div
              key={item.id ?? String(index)}
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
                navigate(`/pro-end/pro-end-detail?id=${item.id}&isCom=0&zsid=${encodeURIComponent(zsid)}`);
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
              <div style={{ width: "100%", display: "flex", marginTop: "0.2rem" }}>
                <div
                  style={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  所属板块：<span style={{ color: "#48a2ff" }}>{item.zoneName ?? "—"}</span>
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
                投资方：<span style={{ color: "#8587fa" }}>{item.investor ?? "—"}</span>
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
                  {item.investmentAmount != null ? `${item.investmentAmount}亿元` : "—"}
                </span>
              </div>
              {item.completeDate ? (
                <div
                  style={{
                    width: "100%",
                    marginTop: "0.1rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  竣工日期：<span style={{ color: "#8587fa" }}>{item.completeDate}</span>
                </div>
              ) : null}
              {item.auditStatusName ? (
                <div
                  style={{
                    width: "100%",
                    marginTop: "0.1rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  审核状态：<span style={{ color: "#8587fa" }}>{item.auditStatusName}</span>
                </div>
              ) : null}
            </div>
          );
        })
        )}
      </List>
      <RequestLoadingOverlay visible={listRequestBlocking} />
    </div>
  );
}
