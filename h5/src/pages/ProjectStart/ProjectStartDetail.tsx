import TopBarColor from "../../components/TopBar/TopBarColor.tsx";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Button, Input, message, Steps, Tag, List, Modal } from "antd";
import { primeApi } from "../../api.ts";
import dayjs from "dayjs";
import { ExtZsProjectOperationVo, ExtZsProjProjectSignedVo } from "../../apis/index.ts";

export default function ProjectStart() {
  const plainOptions = ["优秀", "良好", "一般"];
  const plainOptions1 = ["强相关", "一般", "不相关"];
  const plainOptions2 = ["高", "中", "低"];
  const plainOptions7 = ["是", "否"];
  const plainOptions8 = ["有", "无"];
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const zsid = searchParams.get("zsid");
  const isCom = searchParams.get("isCom");
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState<ExtZsProjProjectSignedVo>();
  const [ishow, setIshow] = useState(false);
  const [ishowZb, setIshowZb] = useState(false);

  // 倒计时秒数，初始为5
  const [countdown, setCountdown] = useState(5);
  // 确认按钮是否可点击
  const [confirmDisabled, setConfirmDisabled] = useState(true);
  const check = async () => {
    const data = await primeApi.checkStart({ zsId: id || "" });
    setIshow(data.value);
    if (data.value) {
      getProjectDigitalProjectReviewCob();
    }
  };
  const checkZb = async () => {
    const data = await primeApi.checkStartZb({ zsId: id || "" });
    setIshowZb(data.value);
  };
  const [cob, setCob] = useState("");

  const [value, setValue] = useState("");
  const [valueZb, setValueZb] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  const handleChangeZb = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValueZb(e.target.value);
  };
  const createProjectDigitalProjectReview = async (
    result: string,
    comment: string
  ) => {
    try {
      const data = await primeApi.updateProjectDigitalStartApproval({
        projectDigitalProjectReviewAllDto: {
          result: result,
          digitalInvestmentId: id,
          comment: comment,
        },
      });
      setValue("");
      getlistProjectDigitalQualityEvaluation();
    } catch (e) {
      console.debug(e);
    }
  };
  const getProjectDigitalProjectReviewCob = async () => {
    const data = await primeApi.getProjectDigitalProjectReviewCob();
    console.log(data);
    setCob(data);
  };

  // 点击“确认”按钮的处理函数
  const handleOk = () => {
    console.log("用户点击了确认");
    message.success("审核通过");
    createProjectDigitalProjectReview("1", value);
    setIshow(false);
    // 这里可以添加其他业务逻辑，比如提交表单、跳转页面等
  };

  // 点击"取消"按钮的处理函数
  const handleCancel = () => {
    if (value === "") {
      message.info("请填写退回意见");
      return;
    }
    console.log("用户点击了取消");
    setIshow(false);
    message.success("审核已退回");
    createProjectDigitalProjectReview("0", value);
    // 可以选择是否在这里清除定时器，但 useEffect 的清理函数通常已处理
  };

  // 专班办公室意见处理函数
  const handleZbNotPass = async () => {
    try {
      await primeApi.updateProjectDigitalProjectReviewZb({
        projectDigitalProjectReviewAllDto: {
          digitalInvestmentId: id || '',
          result: '2',
          comment: valueZb,
        },
      })
      message.success('操作成功')
      getlistProjectDigitalQualityEvaluation()
      setIshowZb(false)
      setValueZb('')
    } catch (e) {
      message.error('操作失败')
    }
  }

  const handleZbNoScore = async () => {
    try {
      await primeApi.updateProjectDigitalProjectReviewZb({
        projectDigitalProjectReviewAllDto: {
          digitalInvestmentId: id || '',
          result: '3',
          comment: valueZb,
        },
      })
      message.success('操作成功')
      getlistProjectDigitalQualityEvaluation()
      setIshowZb(false)
      setValueZb('')
    } catch (e) {
      message.error('操作失败')
    }
  }

  const handleZbPass = async () => {
    try {
      await primeApi.updateProjectDigitalProjectReviewZb({
        projectDigitalProjectReviewAllDto: {
          digitalInvestmentId: id || '',
          result: '1',
          comment: valueZb,
        },
      })
      message.success('操作成功')
      getlistProjectDigitalQualityEvaluation()
      setIshowZb(false)
      setValueZb('')
    } catch (e) {
      message.error('操作失败')
    }
  }

  const handleZbCancel = async () => {
    if (!valueZb || valueZb.trim() === "") {
      message.warning("请填写退回意见");
      return;
    }
    try {
      await primeApi.updateProjectDigitalProjectReviewZb({
        projectDigitalProjectReviewAllDto: {
          result: '0',
          digitalInvestmentId: id ? id : "",
          comment: valueZb,
        },
      });
      message.success("审核已退回");
      getlistProjectDigitalQualityEvaluation();
      setIshowZb(false);
      setValueZb('');
    } catch (e) {
      message.error("操作失败");
    }
  };

  const getExtZsProjectOperation = async () => {
    try {
      const data = await primeApi.getExtZsProjectOperation({ zsid: id! });
      console.log(data);
      setMsg(data);
    } catch (e) {
      console.debug(e);
    }
  };

  const getlistProjectDigitalQualityEvaluation = async () => {
    const data = await primeApi.listProjectDigitalProjectReviewAll({
      zsId: id!,
      step: "4",
    });
    const l = data.records.map((item) => {
      return {
        title: item.cobName,
        description: (
          <div style={{ fontSize: "12px" }}>
            <div>
              <div
                style={{ color: "#333", marginBottom: "0.1rem" }}
                className={"title"}
              >
                {item.name}
                {item.deptName}
              </div>
              <div
                style={{
                  padding: "5px",
                  backgroundColor: "#f0f6ff",
                }}
              >
                <div>
                  {" "}
                  <Tag
                    color={
                      item.status === "未完成"
                        ? "red"
                        : item.status === "已完成"
                        ? "success"
                        : "processing"
                    }
                  >
                    {item.status}
                  </Tag>
                  {item.comment}
                </div>
              </div>
            </div>
            <div>{dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")}</div>
          </div>
        ),
      };
    });
    setList(l);
  };
  const [responsive, setResponsive] = useState(false);
  const location = useLocation();
  useEffect(() => {
    check();
    checkZb();
    getlistProjectDigitalQualityEvaluation();
    getExtZsProjectOperation();

    lx.device.getSystemInfo({
      success: function (res) {
        if (res.systemType === "iOS" || res.systemType === "Android") {
          setResponsive(true);
        }
      },
      fail: function (err) {
        console.log(err);
      },
    });
  }, []);

  // 当组件挂载或 countdown 变化时执行
  useEffect(() => {
    let timer = null;

    // 只有在倒计时大于0时才启动定时器
    if (countdown > 0) {
      // 每隔1000毫秒（1秒）执行一次
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1); // 秒数减1
      }, 1000);
    } else {
      // 倒计时结束，启用确认按钮
      setConfirmDisabled(false);
    }

    // 清理函数：在组件卸载或 countdown 变化前清除定时器，防止内存泄漏
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [countdown]); // 依赖数组：仅当 countdown 变化时重新运行此 effect

  return (
    <div
      style={{
        height: "100vh",
        fontSize: "0.16rem",
        overflow: "scroll",
        scrollbarWidth: "none",
        backgroundColor: "#f6f8f9",
      }}
    >
      <TopBarColor color={"#60a9ff"} title={"评价表单"} time={false} />
      <div
        style={{
          padding: "0 0.2rem",
        }}
      >
        <div
          style={{
            padding: "0.2rem 0",
            fontSize: "0.2rem",
            fontWeight: "bolder",
            textAlign: "center",
          }}
        >
          项目开工认定表
        </div>
        {/*<div>*/}
        {/*    {location.search}*/}
        {/*    <div>isCom {isCom}</div>*/}
        {/*</div>*/}
        <div style={{ backgroundColor: "#fff", padding: "0.2rem" }}>
          {/* 招引单位 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              招引单位
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.department  || "-"}
            </div>
          </div>

          {/* 项目名称 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              项目名称
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.name || "-"}
            </div>
          </div>

          {/* 投资方名称 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              投资方名称
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.investor || "-"}
            </div>
          </div>

          {/* 项目地址 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              项目地址
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.projectAddress || "-"}
            </div>
          </div>

          {/* 签约日期 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              签约日期
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.signedStatDate
                ? dayjs(msg.signedStatDate).format("YYYY年MM月DD日")
                : "-"}
            </div>
          </div>

          {/* 项目类型 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              项目类型
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.bindustry === "1"
                ? "服务业"
                : msg?.bindustry === "2"
                ? "工业"
                : "-"}
            </div>
          </div>

          {/* 科创项目 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              科创项目
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.isKcProj || "-"}
            </div>
          </div>

          {/* QFLP外资项目 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              QFLP外资项目
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.isQflp || "-"}
            </div>
          </div>

          {/* 批准部门及文号 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              批准部门及文号
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.pzwh || "-"}
            </div>
          </div>

          {/* 批准日期 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              批准日期
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.pzrq ? dayjs(msg.pzrq).format("YYYY年MM月DD日") : "-"}
            </div>
          </div>

          {/* 统一社会信用代码 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              统一社会信用代码
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.ucode || "-"}
            </div>
          </div>

          {/* 注册日期 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              注册日期
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.regDate ? dayjs(msg.regDate).format("YYYY年MM月DD日") : "-"}
            </div>
          </div>

          {/* 主要产品、产能及建设内容 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              主要产品、产能及建设内容
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.desc || "-"}
            </div>
          </div>

          {/* 行业分类及代码 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              行业分类及代码
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.industryName || "-"}
            </div>
          </div>

          {/* 产业方向 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              产业方向
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.projTypeLabel || "-"}
            </div>
          </div>

          {/* 计划总投资（亿元/万美元） */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              计划总投资（{msg?.ptype==='1'?'亿元':'万美元'}）
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.investMoney || "-"}
            </div>
          </div>

          {/* 固定资产投资 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              固定资产投资（万元）
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.fixedInvest || "-"}
            </div>
          </div>

          {/* 符合科创项目认定条件 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              符合科创项目认定条件
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.kcProjTj || "-"}
            </div>
          </div>

          {/* 外资投资额（万美元） */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              外资投资额（万美元）
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.ptype === '2' ? msg.investMoney : "-"}
            </div>
          </div>

          {/* 对照成效评估办法，其他需要说明的情况 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              对照成效评估办法，其他需要说明的情况
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.cxqk || "-"}
            </div>
          </div>

          {/* 佐证材料 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              佐证材料
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              {msg?.kgzzcl && msg.kgzzcl.length > 0 ? (
                <List
                  size="small"
                  dataSource={msg.kgzzcl}
                  renderItem={(url, index) => {
                    const fileName =
                      url.split("/").pop()?.split("?")[0] || `文件${index + 1}`;
                    return (
                      <List.Item
                        style={{
                          paddingLeft: "0",
                        }}
                      >
                        {/* <a href={url} target="_blank" download={fileName}>
                          {fileName}
                        </a> */}
                        <a
                          onClick={async () => {
                            const sp = url!.split(".");
                            const param = {
                              url: url,
                              size: -1,
                              type: sp[sp.length - 1],
                            };
                            if (responsive) {
                              lx.utils.previewFile(param);
                            } else {
                              message.error("请下载文件后预览");
                            }
                          }}
                        >
                          {fileName}
                        </a>
                      </List.Item>
                    );
                  }}
                />
              ) : (
                <span>无材料</span>
              )}
            </div>
          </div>

          {/* 项目所在地园区（镇街）承诺 */}
          <div>
            <div
              style={{ color: "#8e8e8e", marginBottom: "0.1rem" }}
              className="title"
            >
              项目所在地园区（镇街）承诺
            </div>
            <div
              style={{
                color: "#333",
                marginBottom: "0.15rem",
                // fontSize: "0.18rem",
              }}
              className="content"
            >
              该项目已与我园区（镇街）签订正式合同，于
              {msg?.startDate
                ? dayjs(msg?.startDate).format("YYYY年MM月DD")
                : "20XX年XX月XX日"}
              完成备案手续正式开工，以上信息确切无误，附件资料真实、有效。
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "10px",
                }}
              >
                园区（镇街）：{msg?.zoneName}
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: "0.2rem 0", color: "#8e8e8e" }}>
          备注：该表由企业全生命周期管理服务平台自动生成
        </div>
        {/* {ishow && (
          <div
            style={{
              marginBottom: "0.2rem",
            }}
          >
            <div style={{ color: "#86909c" }}>部门评价</div>
            <div style={{ marginTop: "0.1rem" }}>
              <Input.TextArea
                value={value}
                onChange={handleChange}
                placeholder="请输入部门评价"
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "right",
                marginTop: "0.1rem",
              }}
            >
              <Button
                onClick={() => {
                  commnent();
                }}
                type={"primary"}
              >
                提交
              </Button>
            </div>
          </div>
        )} */}

        {ishow && (
          <div
            style={{
              margin: "0 0 0.2rem",
              backgroundColor: "#fff",
              padding: "0.2rem",
            }}
          >
            <div style={{ color: "#86909c" }}>市级部门审核意见</div>
            <p>经审核，符合认定要求，同意开工备案。</p>
            <p>审核部门：{cob}</p>

            <div style={{ marginBottom: "10px" }}>
              <Input.TextArea
                placeholder="请输入审核意见"
                value={value}
                onChange={handleChange}
                autoSize={{ minRows: 3, maxRows: 5 }}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button style={{ marginRight: "10px" }} onClick={handleCancel}>
                退回
              </Button>
              <Button
                type={"primary"}
                onClick={handleOk}
                disabled={confirmDisabled}
              >
                {confirmDisabled ? `确认 (${countdown}s)` : "确认"}
              </Button>
            </div>
          </div>
        )}

        {ishowZb && (
          <div
            style={{
              margin: "0 0 0.2rem",
              backgroundColor: "#fff",
              padding: "0.2rem",
            }}
          >
            <div style={{ color: "#86909c" }}>专班办公室意见</div>
            <div style={{ marginTop: "0.1rem", marginBottom: "10px" }}>
              <Input.TextArea
                placeholder="请输入审核意见"
                value={valueZb}
                onChange={handleChangeZb}
                autoSize={{ minRows: 3, maxRows: 5 }}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button style={{ marginRight: "10px" }} onClick={handleZbCancel}>
                退回
              </Button>
              <Button
                style={{ marginRight: "10px" }}
                onClick={handleZbNotPass}
              >
                不通过
              </Button>
              <Button
                style={{ marginRight: "10px" }}
                onClick={handleZbNoScore}
              >
                不计分
              </Button>
              <Button type={"primary"} onClick={handleZbPass}>
                通过
              </Button>
            </div>
          </div>
        )}

        <div
          style={{
            backgroundColor: "#fff",
            padding: "0.2rem",
            marginBottom: "0.2rem",
          }}
        >
          <div
            style={{
              fontSize: "0.16rem",
              marginBottom: "0.2rem",
              color: "#86909c",
            }}
          >
            相关市级部门审核意见
          </div>
          <Steps
            direction="vertical"
            progressDot
            current={11}
            style={{ fontSize: "12px" }}
            items={list}
          />
        </div>
      </div>
    </div>
  );
}
