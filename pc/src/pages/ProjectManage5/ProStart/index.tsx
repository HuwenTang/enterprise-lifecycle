import { PageContainer } from '@ant-design/pro-components';
import {FC, useEffect, useState} from 'react';
import React from 'react';
import useStyles from './style.style';
import "./DescriptionsStyle.css"
import { useNavigate } from '@@/exports';
import {Button, Descriptions, Input, List, message, Modal, Steps, Tag} from 'antd';
import {ExtZsProjectOperationVo} from "@/services/apis";
import {primeApi} from "@/services/api";
import {useSearchParams} from "react-router-dom";
import dayjs from "dayjs";
import {handleApiError} from "@/utils/errorHandler";

const CountdownModal = (e: { showModal: boolean; setShowModal: (show: boolean) => void; id: string | null; setIshow: (value: boolean) => void }) => {
  // 控制弹窗是否显示
  const { showModal, setShowModal, id, setIshow } = e;
  // 倒计时秒数，初始为5
  const [countdown, setCountdown] = useState(5);
  // 确认按钮是否可点击
  const [confirmDisabled, setConfirmDisabled] = useState(true);
  const [cob, setCob] = useState('');

  const [value, setValue] = useState<string>('')
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value || '');
  };
  const createProjectDigitalProjectReview = async (result: string,comment: string) => {
    try {
      await primeApi.updateProjectDigitalStartApproval({
        projectDigitalProjectReviewAllDto: {
          result: result,
          digitalInvestmentId: id || '',
          comment: comment,
        },
      });
      setValue( '')
    }catch (e){
      await handleApiError(e);
      throw e;
    }
  };
  const getProjectDigitalProjectReviewCob = async () => {
    try {
      const data = await primeApi.getProjectDigitalProjectReviewCob();
      console.log(data);
      // 确保 cob 始终是字符串
      if (typeof data === 'string') {
        setCob(data);
      } else if (data && typeof data === 'object') {
        // 如果是对象，尝试提取字符串值或转换为字符串
        const cobValue = (data as any)?.name || (data as any)?.value || JSON.stringify(data);
        setCob(typeof cobValue === 'string' ? cobValue : '');
      } else {
        setCob(String(data || ''));
      }
    } catch (e) {
      await handleApiError(e);
      setCob('');
    }
  };
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

  useEffect(() => {
    getProjectDigitalProjectReviewCob();
  }, []);
  // 点击"确认"按钮的处理函数
  const handleOk = async () => {
    console.log('用户点击了确认');
    try {
      await createProjectDigitalProjectReview('1', value);
      message.success('审核通过');
      setIshow(false);
      setShowModal(false); // 关闭弹窗
    } catch (e) {
      // 错误已在 createProjectDigitalProjectReview 中处理
    }
    // 这里可以添加其他业务逻辑，比如提交表单、跳转页面等
  };

  // 点击"取消"按钮的处理函数
  const handleCancel = async () => {
    if(value===''){
      message.info('请填写退回意见');
      return
    }
    console.log('用户点击了取消');
    try {
      await createProjectDigitalProjectReview('0', value);
      setIshow(false);
      message.success('审核已退回');
      setShowModal(false);
    } catch (e) {
      // 错误已在 createProjectDigitalProjectReview 中处理
    }
    // 可以选择是否在这里清除定时器，但 useEffect 的清理函数通常已处理
  };


  return (
    <Modal
      title="市级部门审核意见"
      open={showModal} // 控制弹窗显示
      onOk={handleOk}
      onCancel={()=>setShowModal(false)}
      okText={confirmDisabled ? `确认 (${countdown}s)` : '确认'}
      cancelText="退回"
      okButtonProps={{ disabled: confirmDisabled }}
      footer={null}
    >
      <p>
        经审核，符合认定要求，同意开工备案。
      </p>
      <p>审核部门：{typeof cob === 'string' ? cob : (cob ? String(cob) : '')}</p>

      <div style={{marginBottom: '10px'}}>
        <Input.TextArea
          placeholder="请输入审核意见"
          value={String(value || '')}
          onChange={handleChange}
          autoSize={{ minRows: 3, maxRows: 5 }}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button style={{ marginRight: '10px' }} onClick={handleCancel}>
          退回
        </Button>
        <Button type={'primary'} onClick={handleOk}>
          通过
        </Button>
      </div>
    </Modal>
  );
};

const CountdownModal1 = (e: { showModal: boolean; setShowModal: (show: boolean) => void; id: string | null; setIshow1: (value: boolean) => void; listProjectDigitalProjectReviewZb: () => void }) => {
  // 控制弹窗是否显示
  const [value, setValue] = useState('');
  const { showModal, setShowModal, id, setIshow1,listProjectDigitalProjectReviewZb } = e;
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  // 倒计时秒数，初始为5
  const createProjectDigitalProjectReview = async (result: string, comment: string) => {
    try {
      await primeApi.updateProjectDigitalProjectStartReview({
        projectDigitalProjectReviewAllDto: {
          result: result,
          digitalInvestmentId: id || '',
          comment: comment,
        },
      });
    } catch (e) {
      await handleApiError(e);
      throw e;
    }
  };

  // 点击"确认"按钮的处理函数
  const handleOk = async () => {
    console.log('用户点击了确认');
    if(value===''){
      message.info('请填写通过意见');
      return
    }
    try {
      await createProjectDigitalProjectReview('1',value);
      message.success('审核通过');
      await listProjectDigitalProjectReviewZb();
      setIshow1(false);
      setShowModal(false); // 关闭弹窗
    } catch (e) {
      // 错误已在 createProjectDigitalProjectReview 中处理
    }
    // 这里可以添加其他业务逻辑，比如提交表单、跳转页面等
  };

  // 点击"取消"按钮的处理函数
  const handleCancel = async () => {
    if(value===''){
      message.info('请填写退回意见');
      return
    }
    console.log('用户点击了取消');
    try {
      await createProjectDigitalProjectReview('0', value);
      message.info('审核退回');
      await listProjectDigitalProjectReviewZb();
      setIshow1(false);
      setShowModal(false);
    } catch (e) {
      // 错误已在 createProjectDigitalProjectReview 中处理
    }
    // 可以选择是否在这里清除定时器，但 useEffect 的清理函数通常已处理
  };

  // 点击"未通过"按钮的处理函数
  const handleNotPass = async () => {
    if(value===''){
      message.info('请填写未通过意见');
      return
    }
    console.log('用户点击了未通过');
    try {
      await createProjectDigitalProjectReview('2', value);
      message.success('审核未通过');
      await listProjectDigitalProjectReviewZb();
      setIshow1(false);
      setShowModal(false);
    } catch (e) {
      // 错误已在 createProjectDigitalProjectReview 中处理
    }
  };

  // 点击"不计分"按钮的处理函数
  const handleNoScore = async () => {
    if(value===''){
      message.info('请填写不计分意见');
      return
    }
    console.log('用户点击了不计分');
    try {
      await createProjectDigitalProjectReview('3', value);
      message.success('审核不计分');
      await listProjectDigitalProjectReviewZb();
      setIshow1(false);
      setShowModal(false);
    } catch (e) {
      // 错误已在 createProjectDigitalProjectReview 中处理
    }
  };

  return (
    <Modal
      title="专班办公室意见"
      open={showModal} // 控制弹窗显示
      onOk={handleOk}
      onCancel={() => setShowModal(false)}
      okText={'通过'}
      footer={null}
    >
      <div style={{ marginBottom: '10px' }}>
        <Input.TextArea
          placeholder="请输入审核意见"
          value={String(value || '')}
          onChange={handleChange}
          autoSize={{ minRows: 3, maxRows: 5 }}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button style={{ marginRight: '10px' }} onClick={handleCancel}>
          退回
        </Button>
        <Button style={{ marginRight: '10px' }} onClick={handleNotPass}>
          不通过
        </Button>
        <Button style={{ marginRight: '10px' }} onClick={handleNoScore}>
          不计分
        </Button>
        <Button type={'primary'} onClick={handleOk}>
          通过
        </Button>
      </div>
    </Modal>
  );
};


// 安全地将值转换为字符串，避免渲染对象
const safeString = (value: any): string => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'string') {
    // 空字符串也返回 '-'
    return value.trim() === '' ? '-' : value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    // 如果是对象（包括空对象 {}），返回默认值
    // 检查是否是空对象
    if (Object.keys(value).length === 0) {
      return '-';
    }
    // 如果是数组，返回数组的字符串表示
    if (Array.isArray(value)) {
      return value.length === 0 ? '-' : value.join(', ');
    }
    // 其他对象返回默认值，不尝试序列化
    return '-';
  }
  return String(value);
};

const QaState: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const breadcrumbList = [
    { path: '/xmgl', breadcrumbName: '项目管理' },
    { path: '/xmgl/pro-start', breadcrumbName: '开工认定' },
  ];
  const [list, setList] = useState<{title: string | undefined; description: React.ReactNode}[]>([]);
  const [list1, setList1] = useState<{title: string | undefined; description: React.ReactNode}[]>([]);

  const [searchParams] = useSearchParams();

  const id = searchParams.get('id');
  const [data, setData] = useState<ExtZsProjectOperationVo>();
  const getExtZsProjectOperation = async () => {
    try {
      const data = await primeApi.getExtZsProjectOperation({ zsid: id! });
      console.log(data);
      // 确保数据是有效的对象
      if (data && typeof data === 'object') {
        setData(data);
      }
    }catch (e){
      await handleApiError(e);
    }
  };



  const listProjectDigitalProjectReview = async () => {
    try {
      const data = await primeApi.listProjectDigitalProjectReviewAll({ zsId: id!,step:'4' });
      const l = data.records.map((item) => {
        return {
          title: item.cobName,
          description: (
            <div style={{ fontSize: '12px' }}>
              <div>
                <div style={{ color: '#333', marginBottom: '0.1rem' }} className={'title'}>
                  {item.name}
                  {item.deptName ? `-${item.deptName}` : ''}
                </div>
                <div
                  style={{
                    padding: '5px',
                    backgroundColor: '#f0f6ff',
                  }}
                >
                  <div>
                    {' '}
                    <Tag
                      color={
                        item.result === '退回'
                          ? 'warning'
                          : item.result === '通过'
                          ? 'success'
                          : item.result === '未通过'
                          ? 'error'
                          : item.result === '不计分'
                          ? 'default'
                          : 'processing'
                      }
                    >
                      {item.result}
                    </Tag>
                    {item.comment}
                  </div>
                </div>
              </div>
              <div>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
            </div>
          ),
        };
      });
      setList(l);
    } catch (e) {
      await handleApiError(e);
    }
  };

  const listProjectDigitalProjectReviewZb = async () => {
    try {
      const data = await primeApi.listProjectDigitalProjectReviewAll({ zsId: id!, step: '6' });
      const l = data.records.map((item) => {
        return {
          title: item.name,
          description: (
            <div style={{ fontSize: '12px' }}>
              <div>
                {/*<div style={{ color: '#333', marginBottom: '0.1rem' }} className={'title'}>*/}
                {/*</div>*/}
                <div
                  style={{
                    padding: '5px',
                    backgroundColor: '#f0f6ff',
                  }}
                >
                  <div>
                    <Tag
                      color={
                        item.result === '退回'
                          ? 'warning'
                          : item.result === '通过'
                          ? 'success'
                          : item.result === '未通过'
                          ? 'error'
                          : item.result === '不计分'
                          ? 'default'
                          : 'processing'
                      }
                    >
                      {item.result}
                    </Tag>
                    {item.comment}
                  </div>
                </div>
              </div>
              <div>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
            </div>
          ),
        };
      });
      setList1(l);
    } catch (e) {
      await handleApiError(e);
    }
  };


  const [ishow, setIshow] = useState(false);
  const check = async () => {
    try {
      const data = await primeApi.checkStart({ zsId: id || '' });
      setIshow(data.value);
    } catch (e) {
      await handleApiError(e);
    }
  };
  const [, setIshow1] = useState(false);
  // 未来可能继续使用 - checkStartZb 接口调用
  // const check2 = async () => {
  //   try {
  //     const data = await primeApi.checkStartZb({ zsId: id || '' });
  //     setIshow1(data.value);
  //   } catch (e) {
  //     await handleApiError(e);
  //   }
  // };
  // 未来可能继续使用 - startSendDept 接口调用
  // const getSendDept = async () => {
  //    try {
  //      // 从URL参数获取id并调用接口
  //      const id = searchParams.get('id');
  //      if (!id) {
  //        console.warn('getSendDept: id 参数不存在');
  //        return;
  //      }
  //      const data = await primeApi.startSendDept({ id });
  //      console.log('getSendDept 调用成功:', data);
  //      // 保存返回的数组数据
  //      if (Array.isArray(data)) {
  //        setSendDeptList(data);
  //      }
  //    } catch (error: any) {
  //      await handleApiError(error);
  //    }
  // };

  // 未来可能继续使用 - 部门列表按钮点击（相关 UI 已注释）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStartClick = async (dept: string) => {
    try {
      const id = searchParams.get('id');
      if (!id) {
        message.error('id 参数不存在');
        return;
      }
      await primeApi.start({ id, dept });
      message.success('操作成功');
      console.log('start 调用成功, id:', id, 'dept:', dept);
    } catch (error: any) {
      await handleApiError(error);
    }
  };
  useEffect(() => {
    check();
    // check2(); // 未来可能继续使用 - checkStartZb 接口
    // getSendDept(); // 未来可能继续使用 - startSendDept 接口
    getExtZsProjectOperation();
    listProjectDigitalProjectReview();
    listProjectDigitalProjectReviewZb();
  }, []);
  //
  // useEffect(() => {
  //   setInterval(() => {
  //     // listProjectDigitalProjectReview();
  //   }, 2000);
  // }, [showModal]);
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
              width: '100%',
              textAlign: 'center',
              fontSize: '16px',
              padding: '45px 0 20px 0',
              fontWeight: 'bolder',
            }}
          >
            {`项目开工认定表`}
          </div>
          {/* 未来可能继续使用 - startSendDept 接口返回的部门列表按钮 */}
          {/* {sendDeptList.length > 0 && (
            <div
              style={{
                padding: '0 50px 20px 50px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              {sendDeptList.map((item, index) => (
                <Button
                  key={index}
                  type="primary"
                  onClick={() => handleStartClick(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          )} */}
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
                部门审核
              </Button>
            )}
            {/*{ishow1 && (*/}
            {/*  <Button*/}
            {/*    onClick={() => {*/}
            {/*      setShowModal1(true);*/}
            {/*    }}*/}
            {/*    type={'primary'}*/}
            {/*    style={{ marginLeft: '10px' }}*/}
            {/*  >*/}
            {/*    专班审核*/}
            {/*  </Button>*/}
            {/*)}*/}
          </div>
          <div style={{ padding: '0 50px 20px 50px' }}>
            <div>
              <div>
                <Descriptions bordered size="middle" column={2} className="custom-descriptions">
                  {/* 普通字段：占1列 */}
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="招引单位" span={1}>
                    {safeString(data?.department || data?.zoneName ||'自行接洽')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目名称" span={1}>
                    {safeString(data?.name)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="投资方名称" span={1}>
                    {safeString(data?.investor)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目地址" span={1}>
                    {safeString(data?.projectAddress)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="签约日期" span={1}>
                    {data?.signedStatDate ? dayjs(data.signedStatDate).format('YYYY-MM-DD') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="申请时间" span={1}>
                    {data?.applyDate ? dayjs(data.applyDate).format('YYYY-MM-DD') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="开工时间" span={1}>
                    {data?.startDate ? dayjs(data.startDate).format('YYYY-MM-DD') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目类型" span={1}>
                    {data?.bindustry === "1" ? '服务业' : data?.bindustry === "2" ? '工业' : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="科创项目" span={1}>
                    {safeString(data?.isKcProj)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="QFLP外资项目" span={1}>
                    {safeString(data?.isQflp)}
                  </Descriptions.Item>

                  {/* 新增字段 */}
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="批准部门及文号" span={1}>
                    {safeString(data?.pzwh)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="批准日期" span={1}>
                    {data?.pzrq ? dayjs(data.pzrq).format('YYYY-MM-DD') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="统一社会信用代码"
                    span={1}
                  >
                    {safeString(data?.ucode)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="注册日期" span={1}>
                    {data?.regDate ? dayjs(data.regDate).format('YYYY-MM-DD') : '-'}
                  </Descriptions.Item>
                  {/* 单独占一行的字段：使用 span={2} 在2列布局下占满，xs下自动占满 */}
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="主要产品、产能及主要建设内容"
                    span={2}
                    className="full-row"
                  >
                    {safeString(data?.desc)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="行业分类及代码" span={1}>
                    {safeString(data?.industryName)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="产业方向" span={1}>
                    {safeString(data?.projTypeLabel)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label={`计划总投资（${data?.ptype==='1'?'亿元':'万美元'}）`} span={1}>
                    {safeString(data?.investMoney)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="固定资产投资（万元）" span={1}>
                    {safeString(data?.fixedInvest)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="符合科创项目认定条件"
                    span={1}
                    className="full-row"
                  >
                    {safeString(data?.kcProjTj)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="外资投资额（万美元）" span={1}>
                    {data?.ptype === '2' ? safeString(data.investMoney) : '-'}
                  </Descriptions.Item>

                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="对照成效评估办法，其他需要说明的情况"
                    span={2}
                    className="full-row"
                  >
                    {safeString(data?.cxqk)}
                  </Descriptions.Item>

                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="佐证材料"
                    span={2}
                    className="full-row"
                  >
                    {data?.kgzzcl && data.kgzzcl.length > 0 ? (
                      <List
                        size="small"
                        dataSource={data.kgzzcl}
                        renderItem={(url, index) => {
                          const fileName = url.split('/').pop()?.split('?')[0] || `文件${index + 1}`;
                          return (
                            <List.Item>
                              <a href={url} target="_blank" rel="noreferrer" download={fileName}>
                                {fileName}
                              </a>
                            </List.Item>
                          );
                        }}
                      />
                    ) : (
                      <span>无材料</span>
                    )}
                  </Descriptions.Item>
                  {/* 项目所在地园区（镇街）承诺 */}
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="项目所在地园区（镇街）承诺"
                    span={2}
                    className="full-row"
                  >
                    该项目已与我园区（镇街）签订正式合同，于{data?.startDate?dayjs(data?.startDate).format('YYYY年MM月DD'):'20XX年XX月XX日'}完成备案手续正式开工，以上信息确切无误，附件资料真实、有效。
                    <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                      园区（镇街）：{safeString(data?.zoneName)}
                    </div>

                  </Descriptions.Item>
                </Descriptions>
                <div style={{ paddingBottom: '20px', color: '#aaa', fontSize: '12px' }}>
                  <div style={{ marginLeft: '50px', marginBottom: '10px', fontSize: '12px' }}>
                    备注：该表由企业全生命周期管理服务平台自动生成
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', backgroundColor: '#fff', width: '22%', padding: '20px' }}>
          <div style={{ fontSize: '12px' }}>相关部门审核意见</div>
          <Steps
            direction="vertical"
            progressDot
            current={5}
            style={{ fontSize: '12px' }}
            items={list}
          />
          {/* <div style={{ fontSize: '12px', marginTop: '20px' }}>专班办公室意见</div> */}
          <Steps
            direction="vertical"
            progressDot
            current={5}
            style={{ fontSize: '12px' }}
            items={list1}
          />
        </div>
      </div>
      <CountdownModal
        id={id}
        setShowModal={setShowModal}
        setIshow={setIshow}
        showModal={showModal}
      ></CountdownModal>
      <CountdownModal1
        id={id}
        setShowModal={setShowModal1}
        setIshow1={setIshow1}
        showModal={showModal1}
        listProjectDigitalProjectReviewZb={listProjectDigitalProjectReviewZb}
      ></CountdownModal1>

    </PageContainer>
  );
};
export default QaState;
