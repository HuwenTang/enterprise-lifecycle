import { useCallback, useEffect, useMemo, useState } from "react";
import type { SystemDictVo } from "../apis";
import { PUBLIC_AUDIT_STATUS_LABELS, publicAuditStatusLabelToCode } from "../constants/publicAuditStatus.ts";
import { loadDictItems } from "../utils/systemDictCache.ts";

export const DICT_CATALOG_REVIEW_PROGRESS = "review_progress";

/**
 * 签约/开工/竣工列表与统计：审核状态来自字典 review_progress。
 * 产业维度（工业/服务业）仍用固定选项，勿用 project_type 字典（该字典为在线审批等项目分类，与公开统计不一致）。
 */
export function useProjectFilterDicts() {
  const [reviewRows, setReviewRows] = useState<SystemDictVo[]>([]);

  useEffect(() => {
    let cancelled = false;
    void loadDictItems(DICT_CATALOG_REVIEW_PROGRESS).then((rv) => {
      if (cancelled) return;
      setReviewRows(rv);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const auditFilterLabels = useMemo(() => {
    if (!reviewRows.length) return [...PUBLIC_AUDIT_STATUS_LABELS];
    return ["全部", ...reviewRows.map((x) => x.label)];
  }, [reviewRows]);

  const auditLabelToCode = useCallback(
    (label: string) => {
      if (!label || label === "全部") return undefined;
      const hit = reviewRows.find((x) => x.label === label);
      if (hit) {
        const n = Number(hit.code);
        if (Number.isFinite(n)) return n;
      }
      return publicAuditStatusLabelToCode(label);
    },
    [reviewRows]
  );

  return {
    auditFilterLabels,
    auditLabelToCode,
  };
}
