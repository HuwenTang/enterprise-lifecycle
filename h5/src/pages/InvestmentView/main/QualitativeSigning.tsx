import TopBarColor from "../../../components/TopBar/TopBarColor.tsx";
import { useEffect, useState, } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Button, Input, message, Steps, Tag } from "antd";
import { primeApi } from "../../../api.ts";
import dayjs from "dayjs";
import { ExtZsProjProjectSignedVo } from "../../../apis";

// 声明lx对象的类型
declare const lx: any;

interface StepItem {
  title: string | undefined;
  description: React.ReactElement;
}

export default function QualitativeState() {
  const plainOptions = ['优秀', '良好', '一般'];
  const plainOptions1 = ['强相关', '一般', '不相关'];
  const plainOptions2 = ['高', '中', '低'];
  const plainOptions7 = ['是', '否'];
  const plainOptions8 = ['有', '无'];
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id')
  const zsid = searchParams.get('zsid')
  const isCom = searchParams.get('isCom')
  const [value, setValue] = useState<string>()
  const [list, setList] = useState<StepItem[]>([])
  const [list1, setList1] = useState<StepItem[]>([])
  const [msg, setMsg] = useState<ExtZsProjProjectSignedVo>()
  const [ishow, setIshow] = useState(false)
  const check = async () => {
    const data = await primeApi.check2({ zsId: id || '' })
    setIshow(data.value)
  }

  const getExtZsProjProjectSigned = async () => {
    const data = await primeApi.getExtZsProjProjectSigned({ zsid: id! })
    console.log(data)
    setMsg(data)
  }

  const getlistProjectDigitalQualityEvaluation = async () => {
    const data = await primeApi.listProjectDigitalProjectReviewAll({ zsId: id!, step: '2' })
    const l = data.records.map(item => {
      return {
        title: item.cobName,
        description: (
          <div style={{ fontSize: '12px' }}>
            <div>
              <div style={{ color: '#333', marginBottom: '0.1rem' }} className={'title'}>
                {item.name}-{item.deptName}
              </div>
              <div
                style={{
                  padding: '5px',
                  backgroundColor: '#f0f6ff',
                }}
              >
                <div> <Tag color={item.status === '未完成' ? 'red' : item.status === '已完成' ? 'success' : 'processing'}>{item.status}</Tag>{item.comment}</div>
              </div>
            </div>
            <div>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>
        ),
      }
    })
    setList(l)
  }
  const getlistProjectDigitalQualityEvaluationZb = async () => {
    const data = await primeApi.listProjectDigitalProjectReviewAll({ zsId: id!, step: '3' })
    const l = data.records.map(item => {
      return {
        title: item.name,
        description: (
          <div style={{ fontSize: '12px' }}>
            <div>
              <div
                style={{
                  padding: '5px',
                  backgroundColor: '#f0f6ff',
                }}
              >
                <div> <Tag color={item.status === '未完成' ? 'red' : item.status === '已完成' ? 'success' : 'processing'}>{item.status}</Tag>{item.comment}</div>
              </div>
            </div>
            <div>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>
        ),
      }
    })
    setList1(l)
  }
  const commnent = async () => {
    try {
      await primeApi.updateProjectDigitalProjectReviewZb({
        projectDigitalProjectReviewAllDto: {
          digitalInvestmentId: id ? id : '',
          result: '1',
          comment: value,
        },
      })
      message.success('操作成功')
      getlistProjectDigitalQualityEvaluation()
      getlistProjectDigitalQualityEvaluationZb()
      setIshow(false)
    } catch (e) {
      message.error('操作失败')
    }
  }
  const handleCancel = async () => {
    if (!value || value.trim() === "") {
      message.warning("请填写退回意见");
      return;
    }
    try {
      await primeApi.updateProjectDigitalProjectReviewZb({
        projectDigitalProjectReviewAllDto: {
          result: '0',
          digitalInvestmentId: id ? id : "",
          comment: value,
        },
      });
      message.success("审核已退回");
      getlistProjectDigitalQualityEvaluation();
      getlistProjectDigitalQualityEvaluationZb();
      setIshow(false);
    } catch (e) {
      message.error("操作失败");
    }
  };
  const handleNotPass = async () => {
    try {
      await primeApi.updateProjectDigitalProjectReviewZb({
        projectDigitalProjectReviewAllDto: {
          digitalInvestmentId: id ? id : '',
          result: '2',
          comment: value,
        },
      })
      message.success('操作成功')
      getlistProjectDigitalQualityEvaluation()
      getlistProjectDigitalQualityEvaluationZb()
      setIshow(false)
    } catch (e) {
      message.error('操作失败')
    }
  }
  const handleNoScore = async () => {
    try {
      await primeApi.updateProjectDigitalProjectReviewZb({
        projectDigitalProjectReviewAllDto: {
          digitalInvestmentId: id ? id : '',
          result: '3',
          comment: value,
        },
      })
      message.success('操作成功')
      getlistProjectDigitalQualityEvaluation()
      getlistProjectDigitalQualityEvaluationZb()
      setIshow(false)
    } catch (e) {
      message.error('操作失败')
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value); // 更新 state
  };
  const [responsive, setResponsive] = useState(false);
  const location = useLocation();
  useEffect(() => {
    check()
    getlistProjectDigitalQualityEvaluation()
    getlistProjectDigitalQualityEvaluationZb()
    getExtZsProjProjectSigned()

    if (typeof lx !== 'undefined' && lx.device && lx.device.getSystemInfo) {
      lx.device.getSystemInfo({
        success: function (res: any) {
          if (res.systemType === 'iOS' || res.systemType === 'Android') {
            setResponsive(true)
          }
        },
        fail: function (err: any) {
          console.log(err);
        },
      });
    }

  }, [])
  return (
    <div style={{
      height: '100vh',
      fontSize: '0.16rem',
      overflow: 'scroll',
      scrollbarWidth: 'none',
      backgroundColor: '#f6f8f9'
    }}>
      <TopBarColor color={'#60a9ff'} title={'评价表单'} time={false} />
      <div style={{
        padding: '0 0.2rem',
      }}>
        <div style={{
          padding: '0.2rem 0',
          fontSize: '0.2rem',
          fontWeight: 'bolder',
          textAlign: 'center',
        }}>
          项目签约核定表
        </div>
        {/*<div>*/}
        {/*    {location.search}*/}
        {/*    <div>isCom {isCom}</div>*/}
        {/*</div>*/}
        <div style={{ backgroundColor: '#fff', padding: '0.2rem' }}>
          {/* 招引单位 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">招引单位</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.sjjgName || '-'}
            </div>
          </div>
          {/* 项目名称 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">项目名称</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.name || '-'}
            </div>
          </div>
          {/* 投资方名称 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">投资方名称</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.investor || '-'}
            </div>
          </div>
          {/* 项目地址 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">项目地址</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.projectAddress || '-'}
            </div>
          </div>

          {/* 签约日期 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">签约日期</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.signedDate ? dayjs(msg.signedDate).format('YYYY年MM月DD日') : '-'}
            </div>
          </div>

          {/* 项目类型（1：服务业；2：工业；否则为空）*/}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">项目类型</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.bindustry === 1 ? '服务业' : msg?.bindustry === 2 ? '工业' : ''}
            </div>
          </div>

          {/* 科创项目 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">科创项目</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.isKcProj || '-'}
            </div>
          </div>

          {/* QFLP外资项目 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">QFLP外资项目</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.isQflp || '-'}
            </div>
          </div>
          {/* 主要产品、产能及主要建设内容 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">主要产品、产能及主要建设内容</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.desc || '-'}
            </div>
          </div>
          {/* 行业分类及代码 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">行业分类及代码</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.industryName || '-'}
            </div>
          </div>

          {/* 产业方向 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">产业方向</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.projTypeLabel || '-'}
            </div>
          </div>
          {/* 计划总投资 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">{msg?.ptype === 1 ? '计划总投资（亿元）' : '计划总投资（万美元）'}</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.investMoney || '-'}
            </div>
          </div>
          {/* 固定资产投资（万元） */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">固定资产投资（万元）</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.fixedInvest || '-'}
            </div>
          </div>
          {/* 符合科创项目认定条件 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">符合科创项目认定条件</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.kcProjTj || '-'}
            </div>
          </div>
          {/* 外资投资额（万美元） */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">外资投资额（万美元）</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.ptype === 2 ? msg.investMoney : '-'}
            </div>
          </div>
          {/* 外资投资证明材料 */}
          {msg?.ztpgzzcl && typeof msg.ztpgzzcl === 'string' && (
            <div>
              <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">材料预览</div>
              <div
                   onClick={() => {
                     const url = msg.ztpgzzcl;
                     if (url && typeof url === 'string') {
                       const fileName = url.substring(url.lastIndexOf('/') + 1);
                       const fileType = fileName.split('.').pop() || '';
                       if (typeof lx !== 'undefined' && lx.utils && lx.utils.previewFile) {
                         lx.utils.previewFile({
                           url: url,
                           name: fileName,
                           size: 1000,
                           type: fileType,
                           moreHidden: false,
                         });
                       }
                     }
                   }}
                   style={{
                     color: '#2d71fd',
                     cursor: 'pointer',
                     textDecoration: 'underline',
                     marginBottom: '0.15rem'
                   }}>
                {msg.ztpgzzcl && typeof msg.ztpgzzcl === 'string' ? msg.ztpgzzcl.substring(msg.ztpgzzcl.lastIndexOf('/') + 1) : ''}
              </div>
            </div>
          )}
          {/* 对照成效评估办法，其他需要说明的情况 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">对照成效评估办法，其他需要说明的情况</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              {msg?.cgRemark || '-'}
            </div>
          </div>
          {/* 项目所在地园区（镇街）承诺 */}
          <div>
            <div style={{ color: '#8e8e8e', marginBottom: '0.1rem' }} className="title">项目所在地园区（镇街）承诺</div>
            <div style={{ color: '#333', marginBottom: '0.15rem',  }} className="content">
              该项目已与我园区（镇街）签订正式合同，以上信息确切无误，附件资料真实、有效。我园区（镇街）已知悉计入市级机关部门（单位）的签约项目，不再纳入市（区）、园区签约项目总数考核。
              <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                园区（镇街）：{msg?.zoneName}
              </div>
            </div>
          </div>
        </div>
        {/* <div style={{ padding: '0.2rem 0', color: '#8e8e8e' }}>
          备注：1. 此表由项目招引主体填报，市级部门仅做风险提示，不做一票否决。
          <br />
          2. 项目正式签约后，该表经修改转为项目签约信息表。
          <br />
          3. 5亿元以上项目自动推送给市发改、工信、环保、应急、税务等部门做风险提示。
        </div> */}
          {
            (ishow) && <div style={{
              marginBottom: '0.2rem',
            }}>
              <div style={{ color: '#86909c' }}>
                专班办公室意见
              </div>
              <div style={{ marginTop: '0.1rem' }}>
                <Input.TextArea value={value} onChange={handleChange} placeholder="请输入审核意见" autoSize={{ minRows: 3, maxRows: 5 }}
                  style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'right', marginTop: '0.1rem' }}>
                <Button style={{ marginRight: '0.1rem' }} onClick={() => {
                  handleCancel()
                }} type={'default'}>退回</Button>
                <Button style={{ marginRight: '0.1rem' }} onClick={() => {
                  handleNotPass()
                }} type={'default'}>不通过</Button>
                <Button style={{ marginRight: '0.1rem' }} onClick={() => {
                  handleNoScore()
                }} type={'default'}>不计分</Button>
                <Button onClick={() => {
                  commnent()
                }} type={'primary'}>通过</Button>
              </div>
            </div>
          }

        <div style={{ backgroundColor: '#fff', padding: '0.2rem', marginBottom: '0.2rem' }}>
          <div style={{ color: '#86909c', fontSize: '0.16rem' }}>相关市级部门审核意见</div>
          <Steps
            direction="vertical"
            progressDot
            current={11}
            style={{ fontSize: '12px' }}
            items={list}
          />
          <div style={{ color: '#86909c', fontSize: '0.16rem' }}>专班办公室意见</div>
          <Steps
            direction="vertical"
            progressDot
            current={11}
            style={{ fontSize: '12px' }}
            items={list1}
          />
        </div>
      </div>
    </div>
  );
}
