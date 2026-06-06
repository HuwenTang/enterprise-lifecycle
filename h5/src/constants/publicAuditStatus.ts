/** 与统计页筛选、公开列表接口 auditStatus 编码一致（0–8） */
export const PUBLIC_AUDIT_STATUS_LABELS = [
  "全部",
  "无审核",
  "部门审核中",
  "部门审核通过",
  "部门审核退回",
  "专班审核中",
  "专班审核通过",
  "专班审核退回",
  "审核不通过",
  "通过不计分",
] as const;

const LABEL_TO_CODE: Record<string, number> = {
  无审核: 0,
  部门审核中: 1,
  部门审核通过: 2,
  部门审核退回: 3,
  专班审核中: 4,
  专班审核通过: 5,
  专班审核退回: 6,
  审核不通过: 7,
  通过不计分: 8,
};

export function publicAuditStatusLabelToCode(label: string): number | undefined {
  if (!label || label === "全部") return undefined;
  return LABEL_TO_CODE[label];
}
