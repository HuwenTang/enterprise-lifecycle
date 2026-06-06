// 定义接口
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import YearPick from "../YearPick/YearPick.tsx";

interface TopBarProps {
    title: string;
    time: boolean;
    /** 为 true 时左侧显示返回，默认返回上一页 */
    showBack?: boolean;
}

export default function TopBar({ title, time, showBack }: TopBarProps) {
    const navigate = useNavigate();

    return (
        <div className="topbar">
            <div
                className="topbarWrapper"
                style={{
                    padding: "0 0.2rem",
                    display: "flex",
                    justifyContent: "center",
                    height: "0.5rem",
                    backgroundColor: "#fff",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                {showBack ? (
                    <div
                        style={{
                            position: "absolute",
                            left: "0.12rem",
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                            fontSize: "0.2rem",
                            color: "#1f2937",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate(-1)}
                        role="button"
                        aria-label="返回"
                    >
                        <LeftOutlined />
                    </div>
                ) : null}
                <div className="topCenter">{title}</div>
                <div
                    style={{
                        position: "absolute",
                        right: "0.1rem",
                        width: time ? "" : "0.20rem",
                    }}
                    className="topRight"
                >
                    {time ? <YearPick /> : ""}
                </div>
            </div>
        </div>
    );
}
