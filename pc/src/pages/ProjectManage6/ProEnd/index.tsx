import { PageContainer } from '@ant-design/pro-components';
import {FC, useEffect, useState} from 'react';
import React from 'react';
import useStyles from './style.style';
import "./DescriptionsStyle.css"
import { useNavigate } from '@@/exports';
import {Button, Checkbox, Descriptions, GetProp, Input, List, message, Modal, Steps, Tag} from 'antd';
import {ExtZsProjectOperationVo, ExtZsProjProjectSignedVo} from "@/services/apis";
import {primeApi} from "@/services/api";
import {useSearchParams} from "react-router-dom";
import dayjs from "dayjs";
import { handleApiError } from '@/utils/errorHandler';

/** 避免将对象（含空对象 {}）直接作为 React 子节点渲染 */
const safeString = (value: unknown): string => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'string') return value.trim() === '' ? '-' : value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    if (Array.isArray(value)) return value.length === 0 ? '-' : value.join(', ');
    if (Object.keys(value as object).length === 0) return '-';
    const obj = value as Record<string, unknown>;
    const extracted = obj.name ?? obj.value ?? obj.label;
    if (typeof extracted === 'string' && extracted.trim()) return extracted;
    return '-';
  }
  return String(value);
};

const normalizeCob = (data: unknown): string => {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const extracted = obj.name ?? obj.value ?? obj.label;
    if (typeof extracted === 'string') return extracted;
    return Object.keys(obj).length === 0 ? '' : safeString(data);
  }
  return String(data ?? '');
};

const CountdownModal = (e: {
  showModal: any;
  setShowModal: any;
  id: any;
  setIshow: any;
  setActualInvestment: any;
  actualInvestment?: number;
}) => {
  // 控制弹窗是否显示
  const { showModal, setShowModal, id, setIshow } = e;
  // 倒计时秒数，初始为5
  const [countdown, setCountdown] = useState(5);
  // 确认按钮是否可点击
  const [confirmDisabled, setConfirmDisabled] = useState(true);
  const [cob, setCob] = useState('');

  const [value, setValue] = useState('');
  const [value1, setValue1] = useState(undefined);
  const handleChange = (e: any) => {
    setValue(e.target.value);
  };
  const handleChange1 = (e: any) => {
    setValue1(e.target.value);
  };
  const submitDigitalCompletionApproval = async (
    result: string,
    comment: string,
    actualInvestment?: number,
  ) => {
    await primeApi.updateProjectDigitalCompletionApproval({
      projectDigitalProjectReviewAllDto: {
        result,
        digitalInvestmentId: id,
        comment,
        actualInvestment,
      },
    });
  };
  const getProjectDigitalProjectReviewCob = async () => {
    try {
      const data = await primeApi.getProjectDigitalProjectReviewCob();
      setCob(normalizeCob(data));
    } catch (err) {
      await handleApiError(err);
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
  // 点击“确认”按钮：须等接口成功后再提示成功（原先先 message.success 再调接口，400 也会显示成功）
  const handleOk = async () => {
    if (value1 === undefined || value1 === '') {
      message.info('请填写实际完成投资（亿元）');
      return;
    }
    const num = typeof value1 === 'number' ? value1 : Number(String(value1).trim());
    if (!Number.isFinite(num)) {
      message.warning('请填写有效的实际完成投资数值');
      return;
    }
    try {
      await submitDigitalCompletionApproval('1', value, num);
      message.success('审核通过');
      setValue('');
      setValue1(undefined);
      setIshow(false);
      setShowModal(false);
    } catch (e) {
      await handleApiError(e);
    }
  };

  // 点击“退回”
  const handleCancel = async () => {
    if (value === '') {
      message.info('请填写退回意见');
      return;
    }
    try {
      await submitDigitalCompletionApproval('0', value);
      message.success('审核已退回');
      setIshow(false);
      setShowModal(false);
    } catch (e) {
      await handleApiError(e);
    }
  };

  return (
    <Modal
      title="市级部门审核意见"
      open={showModal} // 控制弹窗显示
      onOk={handleOk}
      // closeIcon={<CloseOutlined onClick={setShowModal(false)} />}
      onCancel={() => setShowModal(false)}
      okText={confirmDisabled ? `确认 (${countdown}s)` : '确认'}
      cancelText="退回"
      okButtonProps={{ disabled: confirmDisabled }}
      footer={null}
    >
      <p>经审核，符合认定要求，同意竣工备案。</p>
      <p>审核部门：{safeString(cob)}</p>
      <p>
        实际完成投资（亿元/万美元）：
        <Input placeholder="请输入实际完成投资（亿元/万美元）" value={value1} onChange={handleChange1} />
      </p>

      <div style={{ marginBottom: '10px' }}>
        审核意见：
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
        <Button type={'primary'} onClick={handleOk}>
          提交
        </Button>
      </div>
    </Modal>
  );
};

const QaState: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const breadcrumbList = [
    { path: '/xmgl6', breadcrumbName: '竣工管理' },
    { path: '/xmgl6/pro-end', breadcrumbName: '竣工认定' },
  ];

  const [list, setList] = useState<Array<{ title?: string; description: React.ReactNode }>>([]);

  const [searchParams] = useSearchParams();

  const id = searchParams.get('id');
  const [data, setData] = useState<ExtZsProjectOperationVo>();
  const getExtZsProjProjectSigned = async () => {
    if (!id?.trim()) return;
    try {
      const res = await primeApi.getExtZsProjectOperation({ zsid: id });
      setData(res);
    } catch (err) {
      await handleApiError(err);
    }
  };

  const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };
  const [actualInvestment, setActualInvestment] = useState<number>()

  const listProjectDigitalProjectReview = async () => {
    if (!id?.trim()) return;
    try {
      const res = await primeApi.listProjectDigitalProjectReviewAll({ zsId: id, step: '5' });
      const records = res.records ?? [];
      const last = records.length ? records[records.length - 1] : undefined;
      setActualInvestment(last?.actualInvestment);
      const l = records.map((item) => {
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
                      item.status === '未完成'
                        ? 'red'
                        : item.status === '已完成'
                        ? 'success'
                        : 'processing'
                    }
                  >
                    {safeString(item.status === '已完成' ? item.result : item.status)}
                  </Tag>
                  {typeof item.comment === 'object' ? safeString(item.comment) : item.comment}
                </div>
              </div>
            </div>
            <div>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>
        ),
      };
      });
      setList(l);
    } catch (err) {
      await handleApiError(err);
    }
  };

  const [ishow, setIshow] = useState(false);
  const check = async () => {
    if (!id?.trim()) return;
    try {
      const res = await primeApi.checkCompletion({ zsId: id });
      setIshow(!!res.value);
    } catch (err) {
      await handleApiError(err);
    }
  };
  useEffect(() => {
    if (!id?.trim()) {
      message.warning('缺少项目参数，无法加载详情');
      return;
    }
    void check();
    void getExtZsProjProjectSigned();
    void listProjectDigitalProjectReview();
  }, [id]);

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
            {`项目竣工认定表`}
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
                审核
              </Button>
            )}
          </div>
          <div style={{ padding: '0 50px 20px 50px' }}>
            <div>
              <div>
                <Descriptions bordered size="middle" column={2} className="custom-descriptions">
                  {/* 普通字段：占1列 */}
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="招引单位" span={1}>
                    {data?.department || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目名称" span={1}>
                    {data?.name || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="投资方名称" span={1}>
                    {data?.investor || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目地址" span={1}>
                    {data?.projectAddress || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="签约日期" span={1}>
                    {data?.signedStatDate ? dayjs(data.signedStatDate).format('YYYY-MM-DD') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目类型" span={1}>
                    {data?.bindustry === '1' ? '服务业' : data?.bindustry === '2' ? '工业' : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="科创项目" span={1}>
                    {safeString(data?.isKcProj)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="QFLP外资项目" span={1}>
                    {safeString(data?.isQflp)}
                  </Descriptions.Item>

                  {/* 新增字段 */}
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="批准部门及文号" span={1}>
                    {data?.pzwh || ''}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="批准日期" span={1}>
                    {data?.pzrq ? dayjs(data.pzrq).format('YYYY-MM-DD') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="统一社会信用代码"
                    span={1}
                  >
                    {data?.ucode || ''}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="注册日期" span={1}>
                    {data?.regDate ? dayjs(data.regDate).format('YYYY-MM-DD') : '-'}
                  </Descriptions.Item>
                  {/* 单独占一行的字段：使用 span={2} 在2列布局下占满，xs下自动占满 */}
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="主要产品、产能及主要建设内容"
                    span={{ xs: 1, sm: 2 }}
                    className="full-row"
                  >
                    {data?.desc || ''}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="行业分类及代码" span={1}>
                    {data?.industryName || ''}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="产业方向" span={1}>
                    {data?.projTypeLabel || ''}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label={`计划总投资（${data?.ptype==='1'?'亿元':'万美元'}）`}
                    span={1}
                  >
                    {data?.investMoney || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="固定资产投资（万元）"
                    span={1}
                  >
                    {data?.fixedInvest || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="符合科创项目认定条件"
                    span={1}
                    className="full-row"
                  >
                    {data?.kcProjTj || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="外资投资额（万美元）"
                    span={1}
                  >
                    {data?.ptype === '2' ? data.investMoney : '-'}
                  </Descriptions.Item>

                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="企业人员总数"
                    span={1}
                  >
                    {data?.qyTotalNum || '-'}
                  </Descriptions.Item>

                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="缴纳企业社保2个月以上人数"
                    span={1}
                  >
                    {data?.qySbNum || '-'}
                  </Descriptions.Item>

                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="企业在泰研发人数"
                    span={1}
                  >
                    {data?.qyTzyfNum || '-'}
                  </Descriptions.Item>

                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="企业当年度研发投入（万元）"
                    span={1}
                  >
                    {data?.qyYfMoney || '-'}
                  </Descriptions.Item>
                  {/*<Descriptions.Item*/}
                  {/*  labelStyle={{ width: '25%' }}*/}
                  {/*  label="参保佐证材料/专利证书或受理通知书证明材料"*/}
                  {/*  span={1}*/}
                  {/*>*/}
                  {/*  {data?.cbzzcl && data.cbzzcl.length > 0 ? (() => {*/}
                  {/*    // cbzzcl 已经是数组类型，直接使用*/}
                  {/*    const urls = Array.isArray(data.cbzzcl)*/}
                  {/*      ? data.cbzzcl.filter(url => url && url.trim())*/}
                  {/*      : typeof data.cbzzcl === 'string'*/}
                  {/*        ? data.cbzzcl.split(/[;,]/).filter(url => url.trim())*/}
                  {/*        : [];*/}

                  {/*    if (urls.length === 0) return '-';*/}

                  {/*    return (*/}
                  {/*      <div>*/}
                  {/*        {urls.map((url, index) => {*/}
                  {/*          if (!url || !url.trim()) return null;*/}
                  {/*          const fileName = url.split('/').pop()?.split('?')[0] || `文件${index + 1}`;*/}
                  {/*          return (*/}
                  {/*            <Button*/}
                  {/*              key={index}*/}
                  {/*              type="link"*/}
                  {/*              onClick={() => window.open(url.trim())}*/}
                  {/*              style={{ marginRight: index > 0 ? 16 : 0 }}*/}
                  {/*            >*/}
                  {/*              {fileName}*/}
                  {/*            </Button>*/}
                  {/*          );*/}
                  {/*        })}*/}
                  {/*      </div>*/}
                  {/*    );*/}
                  {/*  })() : '-'}*/}
                  {/*</Descriptions.Item>*/}


                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="对照成效评估办法，其他需要说明的情况"
                    span={{ xs: 1, sm: 2 }}
                    className="full-row"
                  >
                    {safeString(data?.cxqk)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="竣工日期"
                    span={{ xs: 1, sm: 2 }}
                    className="full-row"
                  >
                    {data?.endDate ? dayjs(data.endDate).format('YYYY-MM-DD') : '-'}
                  </Descriptions.Item>

                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label={`实际完成投资（${data?.ptype === '1' ? '亿元' : '万美元'}）`}
                    span={{ xs: 1, sm: 2 }}
                    className="full-row"
                  >
                    {actualInvestment || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="佐证材料"
                    span={{ xs: 1, sm: 2 }}
                    className="full-row"
                  >
                    {data?.jgzzcl && data.jgzzcl.length > 0 ? (
                      <List
                        size="small"
                        dataSource={data.jgzzcl}
                        renderItem={(url, index) => {
                          const fileName =
                            url.split('/').pop()?.split('?')[0] || `文件${index + 1}`;
                          return (
                            <List.Item>
                              <a href={url} target="_blank" download={fileName}>
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
                  {/*<Descriptions.Item*/}
                  {/*  labelStyle={{ width: '25%' }}*/}
                  {/*  label="项目所在地园区（镇街）承诺"*/}
                  {/*  span={{ xs: 1, sm: 2 }}*/}
                  {/*  className="full-row"*/}
                  {/*>*/}
                  {/*  该项目已与我园区（镇街）签订正式合同，于{data?.startDate?dayjs(data?.startDate).format('YYYY年MM月DD'):'20XX年XX月XX日'}完成备案手续正式开工，以上信息确切无误，附件资料真实、有效。*/}
                  {/*  <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>*/}
                  {/*    园区（镇街）：{data?.zoneName}*/}
                  {/*  </div>*/}

                  {/*</Descriptions.Item>*/}
                </Descriptions>
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
          {/*<div style={{fontSize: '12px'}}>专班办公室意见</div>*/}
          {/*<Steps*/}
          {/*  direction="vertical"*/}
          {/*  progressDot*/}
          {/*  current={5}*/}
          {/*  style={{fontSize: '12px'}}*/}
          {/*  items={[*/}
          {/*    {*/}
          {/*      title: '专班办公室意见',*/}
          {/*      description: (*/}
          {/*        <div style={{fontSize: '12px'}}>*/}
          {/*          <div style={{color: '#333', marginBottom: '0.1rem'}} className={'title'}>*/}
          {/*            XXX(XXX部门)*/}
          {/*          </div>*/}
          {/*          <div*/}
          {/*            style={{*/}
          {/*              padding: '5px',*/}
          {/*              backgroundColor: '#f0f6ff',*/}
          {/*            }}*/}
          {/*          >*/}
          {/*            专班办公室意见*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      )*/}
          {/*    }*/}
          {/*  ]}*/}
          {/*/>*/}
        </div>
      </div>
      <CountdownModal
        id={id}
        setShowModal={setShowModal}
        setIshow={setIshow}
        showModal={showModal}
        actualInvestment={actualInvestment}
        setActualInvestment={setActualInvestment}
      ></CountdownModal>
    </PageContainer>
  );
};
export default QaState;
