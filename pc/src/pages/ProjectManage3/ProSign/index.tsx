import { PageContainer } from '@ant-design/pro-components';
import {FC, useEffect, useState} from 'react';
import React from 'react';
import useStyles from './style.style';
import "./DescriptionsStyle.css"
import { useNavigate } from '@@/exports';
import {Button, Checkbox, Descriptions, GetProp, Input, message, Modal, Steps, Tag, Tooltip} from 'antd';
import {ExtZsProjProjectSignedVo} from "@/services/apis";
import {primeApi} from "@/services/api";
import {useSearchParams} from "react-router-dom";
import dayjs from "dayjs";
import {CloseOutlined} from "@ant-design/icons";
import {handleApiError} from "@/utils/errorHandler";

const CountdownModal = (e: { showModal: boolean; setShowModal: (show: boolean) => void; id: string | null; setIshow: (value: boolean) => void; listProjectDigitalProjectReview: () => void; refreshData?: () => void }) => {
  // 控制弹窗是否显示
  const { showModal, setShowModal, id, setIshow,listProjectDigitalProjectReview, refreshData } = e;
  // 倒计时秒数，初始为5
  const [countdown, setCountdown] = useState(5);
  // 确认按钮是否可点击
  const [confirmDisabled, setConfirmDisabled] = useState(true);
  const [cob, setCob] = useState('');

  const [value, setValue] = useState('')
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  const createProjectDigitalProjectReview = async (result: string,comment: string) => {
    try {
      const data = await primeApi.updateProjectDigitalProjectReview({
        id: id || '',
        projectDigitalProjectReviewAllDto: {
          result: result,
          digitalInvestmentId: id || '',
          comment: comment,
        },
      });
      setValue( '')
    }catch (e){
      await handleApiError(e);
      throw e; // 重新抛出错误，让调用者知道操作失败
    }
  };
  const getProjectDigitalProjectReviewCob = async () => {
    try {
    const data = await primeApi.getProjectDigitalProjectReviewCob();
    console.log(data);
    setCob(data);
    } catch (e) {
      await handleApiError(e);
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


  // 点击“确认”按钮的处理函数
  const handleOk = async () => {
    if(value===''){
      message.info('请填写通过意见');
      return
    }
    console.log('用户点击了确认');
    try {
      await createProjectDigitalProjectReview('1', value);
    message.success('审核通过');
      await listProjectDigitalProjectReview();
      if (refreshData) {
        await refreshData();
      }
    setIshow(false);
    setShowModal(false); // 关闭弹窗
    } catch (e) {
      // 错误已在 createProjectDigitalProjectReview 中处理
    }
    // 这里可以添加其他业务逻辑，比如提交表单、跳转页面等
  };

  // 点击“取消”按钮的处理函数
  const handleCancel = async () => {
    if(value===''){
      message.info('请填写退回意见');
      return
    }
    console.log('用户点击了取消');
    try {
      await createProjectDigitalProjectReview('0', value);
      message.success('审核已退回');
      await listProjectDigitalProjectReview();
      if (refreshData) {
        await refreshData();
      }
    setIshow(false);
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
      // closeIcon={<CloseOutlined onClick={setShowModal(false)} />}
      onCancel={()=>setShowModal(false)}
      okText={confirmDisabled ? `确认 (${countdown}s)` : '确认'}
      cancelText="退回"
      okButtonProps={{ disabled: confirmDisabled }}
      footer={null}
    >
      <p>
        经审核，符合《市级机关部门（单位）服务“大抓经济、大抓产业、大抓项目”成效评估办法》规定的考核范围及认定要求，同意签约备案。
      </p>
      <p>审核部门：{cob}</p>

      <div style={{marginBottom: '10px'}}>
        <Input.TextArea
          placeholder="请输入审核意见"
          value={value}
          onChange={handleChange}
          autoSize={{ minRows: 3, maxRows: 5 }}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {/* <Button style={{ marginRight: '10px' }} onClick={handleCancel}>
          退回
        </Button> */}
        <Button type={'primary'} onClick={handleOk}>
          提交
        </Button>
      </div>
    </Modal>
  );
};

const CountdownModal1 = (e: { showModal: boolean; setShowModal: (show: boolean) => void; id: string | null; setIshow1: (value: boolean) => void; listProjectDigitalProjectReviewZb: () => void; refreshData?: () => void }) => {
  // 控制弹窗是否显示
  const [value, setValue] = useState('');
  const { showModal, setShowModal, id, setIshow1,listProjectDigitalProjectReviewZb, refreshData } = e;
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  // 倒计时秒数，初始为5
  const createProjectDigitalProjectReview = async (result: string, comment: string) => {
    try {
    const data = await primeApi.updateProjectDigitalProjectReviewZb({
      projectDigitalProjectReviewAllDto: {
        result: result,
        digitalInvestmentId: id || '',
        comment: comment,
      },
    });
    } catch (e) {
      await handleApiError(e);
      throw e; // 重新抛出错误，让调用者知道操作失败
    }
  };

  // 点击“确认”按钮的处理函数
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
      if (refreshData) {
        await refreshData();
      }
    setIshow1(false);
    setShowModal(false); // 关闭弹窗
    } catch (e) {
      // 错误已在 createProjectDigitalProjectReview 中处理
    }
    // 这里可以添加其他业务逻辑，比如提交表单、跳转页面等
  };

  // 点击“取消”按钮的处理函数
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
      if (refreshData) {
        await refreshData();
      }
    setIshow1(false);
    setShowModal(false);
    } catch (e) {
      // 错误已在 createProjectDigitalProjectReview 中处理
    }
    // 可以选择是否在这里清除定时器，但 useEffect 的清理函数通常已处理
  };

  // 点击“未通过”按钮的处理函数
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
      if (refreshData) {
        await refreshData();
      }
    setIshow1(false);
    setShowModal(false);
    } catch (e) {
      // 错误已在 createProjectDigitalProjectReview 中处理
    }
  };

  // 点击“不计分”按钮的处理函数
  const handleNoScore = async () => {
    if(value===''){
      message.info('请填写不计分意见');
      return
    }
    console.log('用户点击了不计分');
    try {
      await createProjectDigitalProjectReview('3', value);
    message.success('不计分');
      await listProjectDigitalProjectReviewZb();
      if (refreshData) {
        await refreshData();
      }
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
      // closeIcon={<CloseOutlined onClick={setShowModal(false)} />}
      onCancel={() => setShowModal(false)}
      okText={'通过'}
      footer={null}
    >
      <div style={{ marginBottom: '10px' }}>
        <Input.TextArea
          placeholder="请输入审核意见"
          value={value}
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

// 辅助函数：为内容添加 Tooltip 支持，支持自动换行
const renderWithTooltip = (content: React.ReactNode, multiline: boolean = false) => {
  if (content === null || content === undefined || content === '') {
    return content || '-';
  }

  // 如果内容已经是 React 元素（如 Button），直接返回
  if (React.isValidElement(content)) {
    return content;
  }

  const contentStr = String(content);
  const style: React.CSSProperties = {
    cursor: 'default',
    display: 'block',
    width: '100%',
    minWidth: 0, // 允许收缩
    wordBreak: 'break-word', // 允许单词内换行
    wordWrap: 'break-word', // 旧版浏览器兼容
    overflowWrap: 'break-word', // 标准属性
  };

  if (multiline) {
    style.whiteSpace = 'pre-wrap'; // 保留换行符和空格
    style.maxHeight = 'none';
    style.overflow = 'visible'; // 多行内容允许完整显示
  } else {
    style.whiteSpace = 'normal'; // 改为 normal 允许自动换行
    style.overflow = 'visible'; // 允许内容完整显示，不截断
  }

  return (
    <Tooltip title={contentStr} placement="topLeft" mouseEnterDelay={0.3}>
      <div style={style}>
        {content}
      </div>
    </Tooltip>
  );
};

/** 双列 Descriptions：标签不设固定像素宽度，表格左右两组（各：标签+内容）各占 50% */
const DESC_LABEL_STYLE: React.CSSProperties = { minWidth: 0, maxWidth: 'none' };

const QaState: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const breadcrumbList = [
    { path: '/xmgl', breadcrumbName: '项目管理' },
    { path: '/xmgl/pro-sign', breadcrumbName: '项目签约' },
  ];
  const [list, setList] = useState<{title: string | undefined; description: React.ReactNode}[]>([]);
  const [list1, setList1] = useState<{title: string | undefined; description: React.ReactNode}[]>([]);
  const [searchParams] = useSearchParams();

  const id = searchParams.get('id');
  const [data, setData] = useState<ExtZsProjProjectSignedVo>();
  const getExtZsProjProjectSigned = async () => {
    try {
    const data = await primeApi.getExtZsProjProjectSigned({ zsid: id! });
    console.log(data);
    setData(data);
    } catch (e) {
      await handleApiError(e);
    }
  };


  const listProjectDigitalProjectReview = async () => {
    try {
    const data = await primeApi.listProjectDigitalProjectReviewAll({ zsId: id!,step:'2' });
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
    const data = await primeApi.listProjectDigitalProjectReviewAll({ zsId: id!, step: '3' });
    const l = data.records.map((item) => {
      return {
        title: item.name,
        description: (
          <div style={{ fontSize: '12px' }}>
            <div>
              {/*<div style={{ color: '#333', marginBottom: '0.1rem' }} className={'title'}>*/}
                {/*{item.name}*/}
                {/*{item.deptName ? `-${item.deptName}` : ''}*/}
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
    const data = await primeApi.check1({ zsId: id || '' });
    setIshow(data.value);
    } catch (e) {
      await handleApiError(e);
    }
  };
  const [ishow1, setIshow1] = useState(false);
  const check2 = async () => {
    try {
    const data = await primeApi.check2({ zsId: id || '' });
    setIshow1(data.value);
    } catch (e) {
      await handleApiError(e);
    }
  };
  // 刷新所有数据的函数
  const refreshAllData = async () => {
    await getExtZsProjProjectSigned();
    await listProjectDigitalProjectReview();
    await listProjectDigitalProjectReviewZb();
    await check();
    await check2();
  };

  useEffect(() => {
    check();
    check2();
    getExtZsProjProjectSigned();
    listProjectDigitalProjectReview();
    listProjectDigitalProjectReviewZb();
  }, []);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', flex: '1 1 70%', minWidth: '600px' }}>
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: '16px',
              padding: '45px 0 20px 0',
              fontWeight: 'bolder',
            }}
          >
            {`市级机关部门（单位）签约项目备案表`}
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
                部门审核
              </Button>
            )}
            {ishow1 && (
              <Button
                onClick={() => {
                  setShowModal1(true);
                }}
                type={'primary'}
              >
                专班审核
              </Button>
            )}
          </div>
          <div style={{ padding: '0 50px 20px 50px' }}>
            <div>
              <Descriptions
                bordered
                size="middle"
                column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} // 响应式列数
                className="custom-descriptions"
              >
                {/* 普通字段：占1列 */}
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="招引单位" span={1}>
                  {renderWithTooltip(data?.sjjgName || '')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="项目名称" span={1}>
                  {renderWithTooltip(data?.name || '')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="投资方名称" span={1}>
                  {renderWithTooltip(data?.investor || '')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="项目地址" span={1}>
                  {renderWithTooltip(data?.projectAddress || '')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="签约日期" span={1}>
                  {data?.signedDate ? dayjs(data.signedDate).format('YYYY-MM-DD') : ''}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="项目类型" span={1}>
                  {data?.bindustry === 1 ? '服务业' : data?.bindustry === 2 ? '工业' : ''}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="科创项目" span={1}>
                  {data?.isKcProj }
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="QFLP外资项目" span={1}>
                  {data?.isQflp || ''}
                </Descriptions.Item>

                {/* 从QaState添加的字段 */}
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="外资项目" span={1}>
                  {data?.ptype === 1 ? '否' : data?.ptype === 2 ? '是' : '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="上市企业" span={1}>
                  {data?.isListed === 1 ? '是' : data?.isListed === 2 ? '否' : '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="高新技术企业" span={1}>
                  {renderWithTooltip(data?.isGxjs||'-')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="产业关联度" span={1}>
                  {renderWithTooltip(data?.cyGl || '-')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="特殊行业" span={1}>
                  {renderWithTooltip(data?.tshy || '-')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="准入限制" span={1}>
                  {renderWithTooltip(data?.zrxz || '-')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="两高项目" span={1}>
                  {renderWithTooltip(data?.lgxm || '-')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="重金属排放" span={1}>
                  {renderWithTooltip(data?.zjspf || '-')}
                </Descriptions.Item>

                {/* 单独占一行的字段：使用 span={2} 在2列布局下占满，xs下自动占满 */}
                <Descriptions.Item
                  labelStyle={DESC_LABEL_STYLE}
                  label="主要产品、产能及主要建设内容"
                  span={2}
                  className="full-row"
                >
                  {renderWithTooltip(data?.desc || '', true)}
                </Descriptions.Item>

                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="行业分类及代码" span={1}>
                  {renderWithTooltip(data?.industryName || '-')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="产业方向" span={1}>
                  {renderWithTooltip(data?.projTypeLabel || '-')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label={data?.ptype === 1 ? '计划总投资（亿元）' : '计划总投资（万美元）'} span={1}>
                  {data?.investMoney || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="固定资产投资（万元）" span={1}>
                  {data?.fixedInvest || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="固定投资比" span={1}>
                  {(data?.fixedPercent|| '-' )+"%"}
                </Descriptions.Item>
                {/* 从QaState添加的投资相关字段 */}
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label={`注册资本(${data?.ptype===1?'万元':'万美元'})`} span={1}>
                  {data?.zhuceMoney || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="申请用地（亩）" span={1}>
                  {data?.sqLandArea || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="租赁厂房面积（平方米）" span={1}>
                  {data?.zlLandArea || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="折算用地（亩）" span={1}>
                  {data?.zlLandAreaZs || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="计划投资强度（万元/亩，万美元/亩）" span={1}>
                  {data?.investLevel || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="预计年耗能情况(吨标煤)" span={1}>
                  {data?.totalUse || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="预计年排污情况（废水、废气等）" span={1}>
                  {data?.isWuran || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="预期年均产值（万元）" span={1}>
                  {data?.yqCz1 || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="预期年均开票销售（万元）" span={1}>
                  {data?.yqKpxs1 || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="预期年均税收（万元）" span={1}>
                  {data?.yqSs1 || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="预期年均亩均税收（万元）" span={1}>
                  {data?.yqMjtax1 || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="预计开工时间" span={1}>
                  {data?.planStartDate ? dayjs(data?.planStartDate).format('YYYY年MM月DD日') : '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="预计竣工时间" span={1}>
                  {data?.planEndDate ? dayjs(data?.planEndDate).format('YYYY年MM月DD日') : '-'}
                </Descriptions.Item>

                <Descriptions.Item
                  labelStyle={DESC_LABEL_STYLE}
                  label="符合科创项目认定条件"
                  span={1}
                  className="full-row"
                >
                  {renderWithTooltip(data?.kcProjTj || '-', true)}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="科创项目分类" span={2}>
                  {data?.kcProjType || '-'}
                </Descriptions.Item>

                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="科创佐证材料" span={2}>
                  {data?.kccl && data.kccl.length > 0 ? (
                    <div>
                      {data.kccl.map((url: string, index: number) => {
                        if (!url || !url.trim()) return null;
                        const fileName = url.split('/').pop()?.split('?')[0] || `文件${index + 1}`;
                        return (
                          <Button
                            key={index}
                            type="link"
                            onClick={() => window.open(url.trim())}
                            style={{ marginRight: index > 0 ? 16 : 0 }}
                          >
                            {fileName}
                          </Button>
                        );
                      })}
                    </div>
                  ) : '-'}
                </Descriptions.Item>

                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="外资投资额（万美元）" span={2}>
                  {data?.ptype === 2 ? data.investMoney : '-'}
                </Descriptions.Item>

                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="是否有融资需求" span={2}>
                  {data?.isRzxq || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="融资金额" span={2}>
                  {data?.rzMoney || '-'}
                </Descriptions.Item>

                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="项目情况分析和评审结果" span={2}>
                  {data?.ztpgzzcl && data.ztpgzzcl.length > 0 ? (
                    <div>
                      {data.ztpgzzcl.map((url: string, index: number) => {
                        if (!url || !url.trim()) return null;
                        const fileName = url.split('/').pop()?.split('?')[0] || `下载附件${data.ztpgzzcl!.length > 1 ? `(${index + 1})` : ''}`;
                        return (
                    <Button
                            key={index}
                      type="link"
                            onClick={() => window.open(url.trim())}
                            style={{ marginRight: index > 0 ? 16 : 0 }}
                          >
                            {fileName}
                    </Button>
                        );
                      })}
                    </div>
                  ) : '-'}
                </Descriptions.Item>

                <Descriptions.Item labelStyle={DESC_LABEL_STYLE} label="佐证材料" span={2}>
                  {data?.xyzzcl && data.xyzzcl.length > 0 ? (
                    <div>
                      {data.xyzzcl.map((url: string, index: number) => {
                        if (!url || !url.trim()) return null;
                        const fileName = url.split('/').pop()?.split('?')[0] || `下载附件${data.xyzzcl!.length > 1 ? `(${index + 1})` : ''}`;
                        return (
                          <Button
                            key={index}
                            type="link"
                            onClick={() => window.open(url.trim())}
                            style={{ marginRight: index > 0 ? 16 : 0 }}
                          >
                            {fileName}
                          </Button>
                        );
                      })}
                    </div>
                  ) : '-'}
                </Descriptions.Item>

                <Descriptions.Item
                  labelStyle={DESC_LABEL_STYLE}
                  label="对照成效评估办法，其他需要说明的情况"
                  span={2}
                  className="full-row"
                >
                  {renderWithTooltip(data?.cgRemark, true)}
                </Descriptions.Item>
                <Descriptions.Item
                  labelStyle={DESC_LABEL_STYLE}
                  label="项目所在地园区（镇街）承诺"
                  span={2}
                  className="full-row"
                >
                  该项目已与我园区（镇街）签订正式合同，以上信息确切无误，附件资料真实、有效。我园区（镇街）已知悉计入市级机关部门（单位）的签约项目，不再纳入市（区）、园区签约项目总数考核。
                  <div style={{display:'flex',justifyContent:'end',marginTop:'10px'}}>
                    园区（镇街）：{data?.zoneName}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', backgroundColor: '#fff', flex: '0 0 22%', minWidth: '280px', padding: '20px' }}>
          <div style={{ fontSize: '12px' }}>相关市级部门审核意见</div>
          <Steps
            direction="vertical"
            progressDot
            current={5}
            style={{ fontSize: '12px' }}
            items={list}
          />
          <div style={{ fontSize: '12px' }}>专班办公室意见</div>
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
        listProjectDigitalProjectReview={listProjectDigitalProjectReview}
        refreshData={refreshAllData}
      ></CountdownModal>
      <CountdownModal1
        id={id}
        setShowModal={setShowModal1}
        setIshow1={setIshow1}
        showModal={showModal1}
        listProjectDigitalProjectReviewZb={listProjectDigitalProjectReviewZb}
        refreshData={refreshAllData}
      ></CountdownModal1>
    </PageContainer>
  );
};
export default QaState;
