import { LoadingOutlined } from "@ant-design/icons";

/** 全屏半透明遮罩 + 居中浅色 loading，请求期间阻挡误触 */
export default function RequestLoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div
      role="progressbar"
      aria-busy="true"
      aria-label="加载中"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.38)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
      }}
    >
      <LoadingOutlined
        spin
        style={{
          fontSize: "0.38rem",
          color: "rgba(255, 255, 255, 0.88)",
        }}
      />
    </div>
  );
}
