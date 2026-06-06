import { PageContainer } from '@ant-design/pro-components';
import {FC, useEffect, useState} from 'react';
import React from 'react';
import useStyles from './style.style';
import "./DescriptionsStyle.css"
import { useNavigate } from '@@/exports';
import {Button, Checkbox, Descriptions, GetProp, Input, List, message, Modal, Steps, Tag, Tooltip, Upload, UploadFile, UploadProps} from 'antd';
import {ExtZsProjectOperationVo, ExtZsProjProjectSignedVo} from "@/services/apis";
import {primeApi} from "@/services/api";
import {useSearchParams} from "react-router-dom";
import dayjs from "dayjs";
import {UploadOutlined} from "@ant-design/icons";

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const CountdownModal = (e: { showModal; setShowModal; id; setIshow }) => {
  // 控制弹窗是否显示
  const { showModal, setShowModal, id, setIshow } = e;
  // 倒计时秒数，初始为5
  const [countdown, setCountdown] = useState(5);
  // 确认按钮是否可点击
  const [confirmDisabled, setConfirmDisabled] = useState(true);
  const [cob, setCob] = useState('');

  const [value, setValue] = useState('')
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const createProjectDigitalProjectReview = async (result: string,comment: string) => {
    try {
      const data = await primeApi.updateProjectDigitalStartApproval({
        projectDigitalProjectReviewAllDto: {
          result: result,
          digitalInvestmentId: id,
          comment: comment,
        },
      });
      setValue( '')
    }catch (e){
      console.debug(e)
    }
  };
  const getProjectDigitalProjectReviewCob = async () => {
    const data = await primeApi.getProjectDigitalProjectReviewCob();
    console.log(data);
    setCob(data);
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
  const handleOk = () => {
    console.log('用户点击了确认');
    message.success('审核通过');
    createProjectDigitalProjectReview('1', value);
    setIshow(false);
    setShowModal(false); // 关闭弹窗
    // 这里可以添加其他业务逻辑，比如提交表单、跳转页面等
  };

  // 点击“取消”按钮的处理函数
  const handleCancel = () => {
    if(value===''){
      message.info('请填写退回意见');
      return
    }
    console.log('用户点击了取消');
    setIshow(false);
    message.success('审核已退回');
    createProjectDigitalProjectReview('0', value);
    setShowModal(false);
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
  const [showModal1, setShowModal1] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const breadcrumbList = [
    { path: '/xmgl', breadcrumbName: '项目管理' },
    { path: '/xmgl/pro-start', breadcrumbName: '开工认定' },
  ];
  const plainOptions = ['优秀', '良好', '一般'];
  const plainOptions0 = ['是', '否'];
  const plainOptions1 = ['工业', '服务业'];
  const plainOptions2 = ['强相关', '一般', '不相关'];
  const plainOptions3 = ['高', '中', '低'];
  const plainOptions4 = ['核心管理人才', '核心技术人才', '财务、市场、运营等岗位人才'];
  const plainOptions5 = ['单一依赖接待或短期融资', '自有资金占比高，且融资渠道多元'];
  const plainOptions6 = ['先进', '良好', '一般'];
  const plainOptions7 = ['通过', '不通过'];
  const [msg, setMsg] = useState<ExtZsProjProjectSignedVo>();
  const [list, setList] = useState<{title: string | undefined; description: React.ReactNode}[]>([]);
  const [list1, setList1] = useState<{title: string | undefined; description: React.ReactNode}[]>([]);

  const [searchParams] = useSearchParams();

  const id = searchParams.get('id');
  const [data, setData] = useState<ExtZsProjectOperationVo>();
  // 存储字段变更记录，key 为 fieldName，value 为 oldValue
  const [changelogMap, setChangelogMap] = useState<Map<string, string>>(new Map());

  // 获取字段的变更值
  const getFieldOldValue = (fieldName: string): string | undefined => {
    const oldValue = changelogMap.get(fieldName);
    if (oldValue !== undefined) {
      console.log(`获取字段 ${fieldName} 的旧值:`, oldValue);
    }
    return oldValue;
  };

  // 渲染字段内容，如果有变更才显示 Tooltip 和黄色背景
  const renderFieldWithChange = (
    content: React.ReactNode,
    fieldName: string,
    multiline: boolean = false
  ) => {
    const oldValue = getFieldOldValue(fieldName);
    const hasChange = oldValue !== undefined && oldValue !== null;

    // 如果内容已经是 React 元素（如 Button），需要特殊处理
    if (React.isValidElement(content)) {
      if (hasChange) {
        return (
          <Tooltip title={`变更前：${oldValue}`} placement="topLeft" mouseEnterDelay={0.3}>
            <div style={{
              backgroundColor: '#fffbe6',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'inline-block',
            }}>
              {content}
            </div>
          </Tooltip>
        );
      }
      return content;
    }

    // 处理普通内容
    if (content === null || content === undefined || content === '') {
      const emptyContent = content || '-';
      if (hasChange) {
        return (
          <Tooltip title={`变更前：${oldValue}`} placement="topLeft" mouseEnterDelay={0.3}>
            <div style={{
              backgroundColor: '#fffbe6',
              padding: '4px 8px',
              borderRadius: '4px',
            }}>
              {emptyContent}
            </div>
          </Tooltip>
        );
      }
      return emptyContent;
    }

    const contentStr = String(content);
    const style: React.CSSProperties = {
      cursor: hasChange ? 'default' : 'default',
      display: 'block',
      width: '100%',
      minWidth: 0,
      wordBreak: 'break-word',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
    };

    if (hasChange) {
      style.backgroundColor = '#fffbe6';
      style.padding = '4px 8px';
      style.borderRadius = '4px';
    }

    if (multiline) {
      style.whiteSpace = 'pre-wrap';
      style.maxHeight = 'none';
      style.overflow = 'visible';
    } else {
      style.whiteSpace = 'normal';
      style.overflow = 'visible';
    }

    if (hasChange) {
      return (
        <Tooltip title={`变更前：${oldValue}`} placement="topLeft" mouseEnterDelay={0.3}>
          <div style={style}>
            {content}
          </div>
        </Tooltip>
      );
    }

    return <div style={style}>{content}</div>;
  };

  const getExtZsProjProjectSigned = async () => {
    try {
      const data = await primeApi.getExtZsProjectOperation({ zsid: id! });
      console.log(data);
      setData(data);
    }catch (e){
      console.debug(e)
    }
  };

  // 获取字段变更记录
  const getChangelog = async () => {
    if (!id) return;

    try {
      const result = await primeApi.listProjectDigitalDataChangelog({
        id: id,
        table: '开工',
        page: 1,
        size: 1000, // 获取所有变更记录
      } as any);

      // 将变更记录转换为 Map，key 为 fieldName，value 为 oldValue
      const map = new Map<string, string>();
      if (result.records && result.records.length > 0 && data) {
        console.log('变更记录列表:', result.records);
        console.log('data 对象的所有字段:', Object.keys(data));

        result.records.forEach((record) => {
          // 根据接口返回的 fieldName 匹配字段
          if (record.fieldName && record.oldValue !== undefined && record.oldValue !== null && data) {
            // 检查 fieldName 是否存在于 data 对象中（直接匹配）
            let fieldExists = record.fieldName in data;
            let matchedFieldName = record.fieldName;

            // 如果直接匹配失败，尝试下划线转驼峰命名
            if (!fieldExists) {
              // 将下划线命名转换为驼峰命名：sjjg_name -> sjjgName
              const camelCaseName = record.fieldName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
              if (camelCaseName in data) {
                fieldExists = true;
                matchedFieldName = camelCaseName;
                console.log(`字段名转换: ${record.fieldName} -> ${camelCaseName}`);
              }
            }

            // 如果还是不存在，尝试驼峰转下划线
            if (!fieldExists) {
              // 将驼峰命名转换为下划线命名：sjjgName -> sjjg_name
              const snakeCaseName = record.fieldName.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
              if (snakeCaseName in data) {
                fieldExists = true;
                matchedFieldName = snakeCaseName;
                console.log(`字段名转换: ${record.fieldName} -> ${snakeCaseName}`);
              }
            }

            console.log(`字段 ${record.fieldName} 在 data 中是否存在: ${fieldExists}, 匹配的字段名: ${matchedFieldName}`);

            if (fieldExists) {
              // 使用匹配到的字段名作为 key，oldValue 作为 value
              map.set(matchedFieldName, record.oldValue);
              console.log(`字段变更: ${matchedFieldName}, 旧值: ${record.oldValue}, 新值: ${record.newValue}, data中的值: ${(data as any)[matchedFieldName]}`);
            } else {
              console.warn(`字段 ${record.fieldName} 不存在于 data 对象中，data 的所有字段:`, Object.keys(data));
            }
          }
        });
      }
      console.log('变更记录 Map:', Array.from(map.entries()));
      setChangelogMap(map);
    } catch (e) {
      console.error('获取变更记录失败', e);
    }
  };


  const [value, setValue] = useState<string>()
  const handleChange = (e) => {
    setValue(e.target.value); // 更新 state
  };
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
      // getlistProjectDigitalQualityEvaluation()
    }catch (e){
      message.error('操作失败')
    }
  }


  const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };

  const listProjectDigitalProjectReview = async () => {
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
  };

  const listProjectDigitalProjectReviewZb = async () => {
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
  };


  const [ishow, setIshow] = useState(false);
  const check = async () => {
    const data = await primeApi.checkStart({ zsId: id || '' });
    setIshow(data.value);
  };
  const [ishow1, setIshow1] = useState(false);
  const [canUploadFile, setCanUploadFile] = useState(true); // 是否可以上传文件
  const [requestValue, setRequestValue] = useState<string>('');
  const checkRequest = async () => {
    try {
      const data = await primeApi.checkRequest1({ zsId: id || '' });
      setRequestValue(data.value);
      console.log('checkRequest value:', data.value);
    } catch (e) {
      console.error('checkRequest error', e);
    }
  };

  // 检查是否可以上传文件
  const checkFilePermission = async () => {
    try {
      const data = await primeApi.checkFile1({ zsId: id || '' });
      setCanUploadFile(data.value);
      console.log('checkFile1 value:', data.value);
    } catch (e) {
      console.error('checkFile1 error', e);
      // 如果接口调用失败，默认允许上传
      setCanUploadFile(true);
    }
  };
  const handleApplyZb = async () => {
    try {
      if (requestValue === '部门审核申请') {
        await primeApi.applyDept({ id: id || '' });
        message.success('申请成功');
        await checkRequest(); // 重新获取状态
      } else if (requestValue === '专班审核申请') {
        await primeApi.applyZbStart({ id: id || '' });
        message.success('申请成功');
        await checkRequest(); // 重新获取状态
      }
    } catch (e) {
      console.error('applyZb error', e);
      message.error('申请失败');
    }
  };

  // 上传配置，和 DepartReport 中一致
  const uploadProps: UploadProps = {
    action: '/system-api/file',
    name: "files",
    maxCount: 10,
    fileList: fileList,
    onChange({ file, fileList }) {
      setIsUploading(true);
      setFileList(fileList);
      if (file.status !== 'uploading') {
        console.log(file, fileList);
        setIsUploading(false);
      }
    },
  };

  // 处理文件上传
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请先选择要上传的文件');
      return;
    }

    if (isUploading) {
      message.error('请等待文件上传完成');
      return;
    }

    // 检查是否有上传失败的文件
    const hasError = fileList.some((file) => file.status === 'error');
    if (hasError) {
      message.error('存在上传失败的文件，请重新上传');
      return;
    }

    // 检查是否有正在上传的文件
    const hasUploading = fileList.some((file) => file.status === 'uploading');
    if (hasUploading) {
      message.warning('文件正在上传中，请稍候');
      return;
    }

    // 检查是否所有文件都已上传成功
    const allDone = fileList.every((file) => file.status === 'done');
    if (!allDone) {
      message.warning('请等待所有文件上传完成');
      return;
    }

    try {
      // 收集所有上传成功的文件路径
      const uploadedPaths: string[] = [];
      fileList.forEach((file) => {
        if (file.status === 'done' && file.response && file.response.length > 0) {
          const path = file.response[0].path;
          if (path) {
            uploadedPaths.push(path);
          }
        }
      });

      if (uploadedPaths.length === 0) {
        message.error('未获取到上传文件的路径');
        return;
      }

      // 获取原有的 kgzzcl 值
      let existingKgzzcl = '';
      if (data?.kgzzcl) {
        // 如果是数组，转换为分号分隔的字符串
        if (Array.isArray(data.kgzzcl)) {
          existingKgzzcl = data.kgzzcl.filter((url: string) => url && url.trim()).join(';');
        } else {
          // 如果是字符串，直接使用
          existingKgzzcl = data.kgzzcl;
        }
      }

      // 拼接新的路径：原有值 + 分号 + 新路径（多个路径也用分号分隔）
      const newPaths = uploadedPaths.join(';');
      const updatedKgzzcl = existingKgzzcl
        ? `${existingKgzzcl};${newPaths}`
        : newPaths;

      // 调用更新接口
      await primeApi.updateExtZsProjectOperation({
        id: id || '',
        extZsProjectOperationDto: {
          kgzzcl: updatedKgzzcl,
        },
      });

      message.success('文件上传成功');
      setFileList([]);
      setShowModal(false);

      // 刷新数据
      await getExtZsProjProjectSigned();
    } catch (e) {
      console.error('文件上传失败', e);
      message.error('文件上传失败，请重试');
    }
  };
  useEffect(() => {
    checkRequest();
    check();
    checkFilePermission();
    getExtZsProjProjectSigned();
    listProjectDigitalProjectReview();
    listProjectDigitalProjectReviewZb();
  }, []);

  // 当 data 更新后，获取变更记录
  useEffect(() => {
    if (id && data) {
      getChangelog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, data]);
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
          <div
            style={{
              padding: '0 50px 20px 50px',
              width: '100%',
              display: 'flex',
              justifyContent: 'right',
            }}
          >
            <Button
              onClick={() => {
                setShowModal1(true);
              }}
              type={'primary'}
              style={{ marginRight: '10px' }}
              disabled={!canUploadFile}
            >
              上传补正材料
            </Button>
            {(requestValue === '部门审核申请' || requestValue === '专班审核申请' || requestValue === '无需申请') && (
              <Button
                onClick={handleApplyZb}
                type={'primary'}
                disabled={requestValue === '无需申请'}
                style={{ marginRight: '10px' }}
              >
                提交
              </Button>
            )}

            {ishow && (
              <Button
                onClick={() => {
                  setShowModal(true);
                }}
                type={'primary'}
              >
                开工认定
              </Button>
            )}
            <Modal
              title={'项目开工认定'}
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
            <div>
              <div>
                <Descriptions bordered size="middle" column={2} className="custom-descriptions">
                  {/* 普通字段：占1列 */}
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="招引单位" span={1}>
                    {renderFieldWithChange(data?.department || '自行接洽', 'department')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目名称" span={1}>
                    {renderFieldWithChange(data?.name || '-', 'name')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="投资方名称" span={1}>
                    {renderFieldWithChange(data?.investor || '-', 'investor')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目地址" span={1}>
                    {renderFieldWithChange(data?.projectAddress || '-', 'projectAddress')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="签约日期" span={1}>
                    {renderFieldWithChange(data?.signedStatDate ? dayjs(data.signedStatDate).format('YYYY-MM-DD') : '-', 'signedStatDate')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目类型" span={1}>
                    {renderFieldWithChange(data?.bindustry === "1" ? '服务业' : data?.bindustry === "2" ? '工业' : '-', 'bindustry')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="科创项目" span={1}>
                    {renderFieldWithChange(data?.isKcProj || '', 'isKcProj')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="QFLP外资项目" span={1}>
                    {renderFieldWithChange(data?.isQflp || '-', 'isQflp')}
                  </Descriptions.Item>

                  {/* 新增字段 */}
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="批准部门及文号" span={1}>
                    {renderFieldWithChange(data?.pzwh || '-', 'pzwh')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="批准日期" span={1}>
                    {renderFieldWithChange(data?.pzrq ? dayjs(data.pzrq).format('YYYY-MM-DD') : '-', 'pzrq')}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="统一社会信用代码"
                    span={1}
                  >
                    {renderFieldWithChange(data?.ucode || '', 'ucode')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="注册日期" span={1}>
                    {renderFieldWithChange(data?.regDate ? dayjs(data.regDate).format('YYYY-MM-DD') : '', 'regDate')}
                  </Descriptions.Item>
                  {/* 单独占一行的字段：使用 span={2} 在2列布局下占满，xs下自动占满 */}
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="主要产品、产能及主要建设内容"
                    span={{ xs: 1, sm: 2 }}
                    className="full-row"
                  >
                    {renderFieldWithChange(data?.desc || '-', 'desc', true)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="行业分类及代码" span={1}>
                    {renderFieldWithChange(data?.industryName || '-', 'industryName')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="产业方向" span={1}>
                    {renderFieldWithChange(data?.projTypeLabel || '', 'projTypeLabel')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label={`计划总投资（${data?.ptype==='1'?'亿元':'万美元'}）`} span={1}>
                    {renderFieldWithChange(data?.investMoney || '-', 'investMoney')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="固定资产投资（万元）" span={1}>
                    {renderFieldWithChange(data?.fixedInvest || '-', 'fixedInvest')}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="符合科创项目认定条件"
                    span={1}
                    className="full-row"
                  >
                    {renderFieldWithChange(data?.kcProjTj || '-', 'kcProjTj', true)}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="外资投资额（万美元）" span={1}>
                    {renderFieldWithChange(data?.ptype === '2' ? data.investMoney : '-', 'investMoney')}
                  </Descriptions.Item>

                  {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="是否为签约工业、服务业项目转科创项目" span={1}>*/}
                  {/*  {data?.kgIsZkc || '-'}*/}
                  {/*</Descriptions.Item>*/}
                  {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="符合科创证明材料" span={1}>*/}
                  {/*  {data?.kczzcl ? (() => {*/}
                  {/*    // 将字符串转换为数组（支持分号分隔或逗号分隔）*/}
                  {/*    const urls = typeof data.kczzcl === 'string' */}
                  {/*      ? data.kczzcl.split(/[;,]/).filter(url => url.trim())*/}
                  {/*      : Array.isArray(data.kczzcl) */}
                  {/*        ? data.kczzcl.filter(url => url.trim())*/}
                  {/*        : [];*/}
                  {/*    */}
                  {/*    if (urls.length === 0) return '-';*/}
                  {/*    */}
                  {/*    return (*/}
                  {/*      <div>*/}
                  {/*        {urls.map((url, index) => {*/}
                  {/*          if (!url.trim()) return null;*/}
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
                  {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="人才佐证材料" span={{ xs: 1, sm: 2 }}>*/}
                  {/*  {data?.rczzcl ? (() => {*/}
                  {/*    // 将字符串转换为数组（支持分号分隔或逗号分隔）*/}
                  {/*    const urls = typeof data.rczzcl === 'string' */}
                  {/*      ? data.rczzcl.split(/[;,]/).filter(url => url.trim())*/}
                  {/*      : Array.isArray(data.rczzcl) */}
                  {/*        ? data.rczzcl.filter(url => url.trim())*/}
                  {/*        : [];*/}
                  {/*    */}
                  {/*    if (urls.length === 0) return '-';*/}
                  {/*    */}
                  {/*    return (*/}
                  {/*      <div>*/}
                  {/*        {urls.map((url, index) => {*/}
                  {/*          if (!url.trim()) return null;*/}
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
                    {renderFieldWithChange(data?.cxqk || '', 'cxqk', true)}
                  </Descriptions.Item>

                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="佐证材料"
                    span={{ xs: 1, sm: 2 }}
                    className="full-row"
                  >
                    {(() => {
                      const oldValue = getFieldOldValue('kgzzcl');
                      const hasChange = oldValue !== undefined && oldValue !== null;
                      const content = data?.kgzzcl && data.kgzzcl.length > 0 ? (
                        <div style={hasChange ? {
                          backgroundColor: '#fffbe6',
                          padding: '4px 8px',
                          borderRadius: '4px',
                        } : {}}>
                          <List
                            size="small"
                            dataSource={data.kgzzcl}
                            renderItem={(url, index) => {
                              const fileName = url.split('/').pop()?.split('?')[0] || `文件${index + 1}`;
                              return (
                                <List.Item>
                                  <a href={url} target="_blank" download={fileName}>
                                    {fileName}
                                  </a>
                                </List.Item>
                              );
                            }}
                          />
                        </div>
                      ) : (
                        <span>无材料</span>
                      );

                      return hasChange ? (
                        <Tooltip title={`变更前：${oldValue}`} placement="topLeft" mouseEnterDelay={0.3}>
                          {content}
                        </Tooltip>
                      ) : content;
                    })()}
                  </Descriptions.Item>
                  {/* 项目所在地园区（镇街）承诺 */}
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="项目所在地园区（镇街）承诺"
                    span={{ xs: 1, sm: 2 }}
                    className="full-row"
                  >
                    该项目已与我园区（镇街）签订正式合同，于{data?.startDate?dayjs(data?.startDate).format('YYYY年MM月DD'):'20XX年XX月XX日'}完成备案手续正式开工，以上信息确切无误，附件资料真实、有效。
                    <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                      园区（镇街）：{data?.zoneName}
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
          <div style={{ fontSize: '12px' }}>相关市级部门审核意见</div>
          <Steps
            direction="vertical"
            progressDot
            current={5}
            style={{ fontSize: '12px' }}
            items={list}
          />
          <div style={{ fontSize: '12px', marginTop: '20px' }}>专班办公室意见</div>
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

      {/* 文件上传 Modal */}
      <Modal
        title="上传补正材料"
        open={showModal1}
        onCancel={() => {
          setShowModal1(false);
          setFileList([]);
        }}
        onOk={handleUpload}
        confirmLoading={isUploading}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
        <div style={{ marginTop: 16, color: '#999', fontSize: '12px' }}>
          支持多文件上传，最多10个文件
        </div>
      </Modal>
    </PageContainer>
  );
};
export default QaState;
