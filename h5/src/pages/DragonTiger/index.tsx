import {useNavigate} from "react-router-dom";
import {
    AppstoreOutlined,
    BankOutlined,
    CalendarOutlined,
    GoldOutlined,
    LineChartOutlined,
    RightOutlined,
    SafetyCertificateOutlined,
    StarOutlined,
} from "@ant-design/icons";

type MenuItem = {
    path: string;
    title: string;
    desc: string;
    icon: typeof GoldOutlined;
    iconBg: string;
};

const MENU: MenuItem[] = [
    {
        path: "/dragon-tiger/fixed-investment",
        title: "固定资产投资情况",
        desc: "固定资产投资完成率、投资进度分析",
        icon: GoldOutlined,
        iconBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
        path: "/dragon-tiger/key-projects",
        title: "重点项目情况",
        desc: "省市重大项目推进情况、建设进度",
        icon: StarOutlined,
        iconBg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
        path: "/dragon-tiger/project-phases",
        title: "项目各阶段情况",
        desc: "签约、备案、开工、竣工全周期跟踪",
        icon: AppstoreOutlined,
        iconBg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
        path: "/dragon-tiger/four-new-enterprises",
        title: '"四上"企业新增数情况',
        desc: "规模以上企业培育入库情况",
        icon: BankOutlined,
        iconBg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
];

export default function DragonTigerIndex() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                fontFamily: "system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', sans-serif",
                color: "#1e293b",
                WebkitTapHighlightColor: "transparent",
            }}
        >
            <div
                style={{
                    maxWidth: "500px",
                    margin: "0 auto",
                    minHeight: "100vh",
                    padding: "0.2rem 0.16rem",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        padding: "0.3rem 0.2rem",
                        background: "linear-gradient(135deg, #0f2b3d 0%, #1b4a6e 100%)",
                        borderRadius: "0.24rem",
                        marginBottom: "0.24rem",
                        boxShadow: "0 0.08rem 0.16rem rgba(0,0,0,0.1)",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "0.16rem",
                            fontWeight: 600,
                            color: "#fff",
                            margin: 0,
                            marginBottom: "0.08rem",
                            lineHeight: 1.35,
                        }}
                    >
                        <LineChartOutlined style={{marginRight: "0.08rem"}} />
                        各市（区）项目招引建设情况通报表
                    </h1>
                </div>

                <div style={{display: "flex", flexDirection: "column", gap: "0.16rem"}}>
                    {MENU.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.path}
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate(item.path)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        navigate(item.path);
                                    }
                                }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    background: "#fff",
                                    padding: "0.2rem 0.18rem",
                                    borderRadius: "0.2rem",
                                    boxShadow: "0 0.04rem 0.12rem rgba(0,0,0,0.05)",
                                    cursor: "pointer",
                                    border: "2px solid transparent",
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                }}
                            >
                                <div
                                    style={{
                                        width: "0.56rem",
                                        height: "0.56rem",
                                        borderRadius: "0.16rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.22rem",
                                        marginRight: "0.16rem",
                                        flexShrink: 0,
                                        background: item.iconBg,
                                        color: "#fff",
                                    }}
                                >
                                    <Icon />
                                </div>
                                <div style={{flex: 1, minWidth: 0}}>
                                    <div
                                        style={{
                                            fontSize: "0.15rem",
                                            fontWeight: 600,
                                            color: "#1e293b",
                                            marginBottom: "0.06rem",
                                        }}
                                    >
                                        {item.title}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "0.12rem",
                                            color: "#64748b",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {item.desc}
                                    </div>
                                </div>
                                <RightOutlined
                                    style={{
                                        fontSize: "0.14rem",
                                        color: "#94a3b8",
                                        marginLeft: "0.12rem",
                                        flexShrink: 0,
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
                <div></div>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "0.14rem",
                        padding: "0.12rem 0.2rem 0.22rem 0.2rem",
                        background: "rgba(255,255,255,0.9)",
                        borderRadius: "0.16rem",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    {/*<p style={{fontSize: "0.12rem", color: "#64748b"}}>*/}
                    {/*    <CalendarOutlined style={{marginRight: "0.06rem"}} />*/}
                    {/*    数据更新时间：2026 年 4 月 27 日*/}
                    {/*</p>*/}
                    <div
                        style={{
                            width: "50%",
                            marginTop: "0.3rem",
                            marginLeft: "auto",
                            marginRight: "auto",
                            background: "#eef2ff",
                            color: "#1e6f3f",
                            padding: "0.06rem 0.14rem",
                            borderRadius: "0.2rem",
                            fontSize: "0.11rem",
                            fontWeight: 500,
                        }}
                    >
                        <SafetyCertificateOutlined style={{marginRight: "0.06rem"}} />
                        内部资料 注意保密
                    </div>
                </div>
            </div>
        </div>
    );
}
