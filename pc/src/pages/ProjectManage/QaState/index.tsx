import { PageContainer } from '@ant-design/pro-components';
import {FC, useEffect, useState} from 'react';
import React from 'react';
import useStyles from './style.style';
import { useNavigate } from '@@/exports';
import {Button, Checkbox, Descriptions, GetProp, Input, List, message, Modal, Steps, Tag} from 'antd';
import {useSearchParams} from "react-router-dom";
import dayjs from "dayjs";
import {primeApi} from "@/services/api";
import {ExtZsProjProjectSignedVo} from "@/services/apis";

const QaState: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const breadcrumbList = [
    { path: '/xmgl', breadcrumbName: '项目管理' },
    { path: '/xmgl/qa-state', breadcrumbName: '项目质态' },
  ];
  const plainOptions = ['优秀', '良好', '一般'];
  const plainOptions1 = ['正常', '异常'];
  const plainOptions2 = ["强相关", '一般', '不相关'];
  const plainOptions3 = ['高', '中', '低'];
  const plainOptions4 = ['核心管理人才', '核心技术人才', '财务、市场、运营等岗位人才'];
  const plainOptions5 = ['单一依赖接待或短期融资', '自有资金占比高，且融资渠道多元'];
  const plainOptions6 = ['先进', '良好','一般'];
  const plainOptions7 = ['是', '否'];
  const plainOptions8 = [ '有','无'];
  const [searchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false)
  const id = searchParams.get('id');
  const zsid = searchParams.get('zsid');
  const [list, setList] = useState([])

  const [ishow, setIshow] = useState(false)
  const check = async () => {
    const data = await primeApi.check({ zsId:id||'' })
    setIshow(data.value)
  }

  const [value, setValue] = useState<string>()
  const handleChange = (e) => {
    setValue(e.target.value); // 更新 state
  };


  const [msg, setMsg] = useState<ExtZsProjProjectSignedVo>()
  const getExtZsProjProjectSigned = async () => {
   try {
     const data = await primeApi.getExtZsProjProjectSigned({ zsid: id! })
     setMsg(data)
   }catch ( e){
     console.debug('e',e)
     message.error('招商平台签约项目表不存在')
   }
  }
  const getlistProjectDigitalQualityEvaluation = async () => {
    const data = await primeApi.listProjectDigitalProjectReviewAll({ zsId: id!,step:'1' })
    const l =  data.records.map(item => {
      return{
        title: item.cobName,
        description: (
          <div style={{ fontSize: '12px' }}>
            <div>
              <div style={{ color: '#333', marginBottom: '0.1rem' }} className={'title'}>
                {item.name}{item.deptName?`-${item.deptName}`:''}
              </div>
              <div
                style={{
                  padding: '5px',
                  backgroundColor: '#f0f6ff',
                }}
              >
                <div> <Tag color={item.status==='未完成'?'red':item.status==='已完成'?'success':'processing'}>{item.status}</Tag>{item.comment}</div>
              </div>
            </div>
            <div>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>
        ),
      }
    })
    setList(l)
  }

  const commnent = async () => {
    try{
      const data = await primeApi.updateProjectDigitalQualityEvaluation({
        projectDigitalProjectReviewAllDto: {
          digitalInvestmentId: id?id:'',
          comment: value
        }
      })
      message.success('操作成功')
      setShowModal( false)
      getlistProjectDigitalQualityEvaluation()
    }catch (e){
      message.error('操作失败')
    }
  }
  useEffect(()=>{
    check()
    console.log(id)
    getlistProjectDigitalQualityEvaluation()
    getExtZsProjProjectSigned()
  },[])
  const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };
  return (
    <PageContainer
      style={{
        minWidth: '1200px',
        height: '90vh',
        overflow: 'scroll',
        scrollbarWidth: 'none',
        backgroundImage: 'url(/mg/bg.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        padding: '0 120px 0',
      }}
      breadcrumb={{
        routes: breadcrumbList,
        itemRender: (route, params, routes) => {
          // Handle breadcrumb click
          const last = routes.indexOf(route) === routes.length - 1;
          return last ? (
            <span>{route.title}</span>
          ) : (
            <a
              onClick={() => {
                navigate(-1);
              }}
            >
              {route.title}
            </a>
          );
        },
      }}
      title={false}
      className={styles.pageHeader}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ backgroundColor: '#fff', width: '70%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '20px 50px 20px 50px',
            }}
          >
            <div>项目代码：{id}</div>
          </div>
          <div
            style={{
              padding: '0 50px 20px 50px',
              width: '100%',
              display: 'flex',
              justifyContent: 'right',
            }}
          >
            {ishow && (
              <Button
                onClick={() => {
                  setShowModal(true);
                }}
                type={'primary'}
              >
                评估
              </Button>
            )}
            <Modal
              title={'项目质态评估'}
              open={showModal}
              onCancel={() => setShowModal(false)}
              footer={null}
            >
              <div
                style={{
                  marginBottom: '0.2rem',
                }}
              >
                <div style={{ color: '#86909c' }}>部门评价</div>
                <div style={{ marginTop: '10px' }}>
                  <Input.TextArea
                    value={value}
                    onChange={handleChange}
                    placeholder="请输入部门评价"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '10px' }}>
                  <Button
                    onClick={() => {
                      commnent();
                    }}
                    type={'primary'}
                  >
                    提交
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
          <div style={{ padding: '0 50px 20px 50px' }}>
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: '16px',
                padding: '0 0 40px 0',
                fontWeight: 'bolder',
              }}
            >
              {`项目质态评估表`}
            </div>
            <Descriptions bordered size="middle" column={2} className="custom-descriptions">
              <Descriptions.Item labelStyle={{ width: '25%' }} label="项目名称" span={1}>
                {msg?.name || ''}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="填报单位" span={1}>
                {msg?.zoneName || ''}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="项目选址" span={2}>
                {msg?.projectAddress || ''}
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ width: '25%' }}
                label="主要产品、产能及建设内容"
                span={2}
              >
                {msg?.desc || ''}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="预计开工时间" span={1}>
                {msg?.planStartDate ? dayjs(msg?.planStartDate).format('YYYY年MM月DD日') : '-'}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="预计竣工时间" span={1}>
                {msg?.planEndDate ? dayjs(msg?.planEndDate).format('YYYY年MM月DD日') : '-'}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="投资方名称" span={1}>
                {msg?.investor || ''}
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ width: '25%' }}
                label={`注册资本(${msg?.ptype===1?'万元':'万美元'})`}
                span={1}
              >
                {msg?.zhuceMoney || '-'}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="项目类型" span={1}>
                {msg?.bindustry===1?'服务业':msg?.bindustry===2?"工业":''}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="行业代码" span={1}>
                {msg?.industryName || ''}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="外资项目" span={1}>
                {msg?.ptype === 1 ? '否' : msg?.ptype === 2 ? '是' : '-'}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="科创项目" span={1}>
                {msg?.isKcProj}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="上市企业" span={1}>
                {msg?.isListed === 1 ? '是' : msg?.isListed === 2 ? '否' : '-'}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="高新技术企业" span={1}>
                {msg?.isGxjs||'-'}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="产业方向" span={1}>
                {msg?.projTypeLabel || ''}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="产业关联度" span={1}>
                <Checkbox.Group
                  options={plainOptions2}
                  disabled
                  value={[msg?.cyGl]}
                  onChange={onChange}
                />
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="特殊行业" span={1}>
                <Checkbox.Group
                  options={plainOptions7}
                  disabled
                  value={[msg?.tshy]}
                  onChange={onChange}
                />
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="准入限制" span={1}>
                <Checkbox.Group
                  options={plainOptions8}
                  disabled
                  value={[msg?.zrxz]}
                  onChange={onChange}
                />
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="两高项目" span={1}>
                <Checkbox.Group
                  options={plainOptions7}
                  disabled
                  value={[msg?.lgxm]}
                  onChange={onChange}
                />
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="重金属排放" span={1}>
                <Checkbox.Group
                  options={plainOptions8}
                  disabled
                  value={[msg?.zjspf]}
                  onChange={onChange}
                />
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ width: '25%' }}
                label="预计年耗能情况(吨标煤)"
                span={1}
              >
                {msg?.totalUse || ''}
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ width: '25%' }}
                label="预计年排污情况（废水、废气等）"
                span={1}
              >
                {msg?.isWuran || ''}
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ width: '25%' }}
                label={`计划总投资（${msg?.ptype===1?'万元':'万美元'}）`}
                span={1}
              >
                {msg?.planTotal1 || ''}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="申请用地（亩）" span={1}>
                {msg?.sqLandArea || ''}
              </Descriptions.Item>

              <Descriptions.Item
                labelStyle={{ width: '25%' }}
                label="租赁厂房面积（平方米）"
                span={1}
              >
                {msg?.zlLandArea || ''}
              </Descriptions.Item>
              <Descriptions.Item labelStyle={{ width: '25%' }} label="折算用地（亩）" span={1}>
                {msg?.zlLandAreaZs || ''}
              </Descriptions.Item>

              <Descriptions.Item
                labelStyle={{ width: '25%' }}
                label="计划投资强度（万元/亩，万美元/亩）"
                span={1}
              >
                {msg?.investLevel || ''}
              </Descriptions.Item>

              <Descriptions.Item
                labelStyle={{ width: '25%' }}
                label="固定资产投资（万元）"
                span={1}
              >
                {msg?.fixedInvest || ''}
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ width: '25%' }}
                label="预期年均产值（万元）"
                span={1}
              >
                {msg?.yqCz1 || ''}
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ width: '25%' }}
                label="预期年均开票销售（万元）"
                span={1}
              >
                {msg?.yqKpxs1 || ''}
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ width: '25%' }}
                label="预期年均税收（万元）"
                span={1}
              >
                {msg?.yqSs1 || ''}
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ width: '25%' }}
                label="预期年均亩均税收（万元）"
                span={1}
              >
                {msg?.yqMjtax1 || ''}
              </Descriptions.Item>

              <Descriptions.Item labelStyle={{ width: '25%' }} label="各市（区）评估结论" span={1}>
                <Checkbox.Group
                  options={plainOptions}
                  disabled
                  value={[msg?.zhpg]}
                  onChange={onChange}
                />
              </Descriptions.Item>
              <Descriptions.Item
                  labelStyle={{ width: '25%' }}
                  label="项目情况分析和评审结果"
                  span={2}
                  className="full-row"
              >
                {msg?.ztpgzzcl && msg.ztpgzzcl.length > 0 ? (
                  <div>
                    {msg.ztpgzzcl.map((url: string, index: number) => {
                      if (!url || !url.trim()) return null;
                      const fileName = url.split('/').pop()?.split('?')[0] || `下载附件${msg.ztpgzzcl!.length > 1 ? `(${index + 1})` : ''}`;
                      return (
                          <a
                          key={index}
                          href={url.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                          style={{ marginRight: index > 0 ? 16 : 0 }}
                          >
                            {fileName}
                          </a>
                      );
                    })}
                  </div>
                ) : (
                    <span>无材料</span>
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div style={{ paddingBottom: '20px', color: '#aaa', fontSize: '12px' }}>
            <div style={{ marginLeft: '50px', marginBottom: '10px', fontSize: '12px' }}>
              备注：1. 此表由项目招引主体填报，市级部门仅做风险提示，不做一票否决。
              <br />
              2. 项目正式签约后，该表经修改转为项目签约信息表。
              <br />
              3. 5亿元以上项目自动推送给市发改、工信、环保、应急、税务等部门做风险提示。
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', backgroundColor: '#fff', width: '22%', padding: '20px' }}>
        <div style={{ fontSize: '12px' }}>相关市级部门评估意见</div>

          <Steps
            direction="vertical"
            progressDot
            current={10}
            style={{ fontSize: '12px' }}
            items={list}
          />
        </div>
      </div>
    </PageContainer>
  );
};
export default QaState;
