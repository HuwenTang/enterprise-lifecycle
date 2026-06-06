import { InboxOutlined } from "@ant-design/icons";
import type { CSSProperties } from "react";

const wrap: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "calc(100vh - 2.85rem)",
  padding: "0.36rem 0.28rem 0.48rem",
  boxSizing: "border-box",
};

/**
 * 签约核定 / 开工认定 / 竣工认定 / 部门预评估 等列表页统一空态
 */
export default function ListPageEmpty() {
  return (
    <div style={wrap}>
      <InboxOutlined style={{ fontSize: "0.56rem", marginBottom: "0.14rem", color: "#d1d5db" }} aria-hidden />
      <div style={{ fontSize: "0.16rem", fontWeight: 600, color: "#6b7280" }}>暂无数据</div>
      <div
        style={{
          fontSize: "0.13rem",
          marginTop: "0.08rem",
          textAlign: "center",
          lineHeight: 1.55,
          color: "#9ca3af",
          maxWidth: "2.8rem",
        }}
      >
        当前筛选条件下暂无项目，可尝试调整筛选或搜索关键词
      </div>
    </div>
  );
}
