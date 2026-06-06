import { PageContainer } from '@ant-design/pro-components';
import {FC, useEffect, useState} from 'react';
import React from 'react';
import useStyles from './style.style';
import "./DescriptionsStyle.css"
import { useNavigate } from '@@/exports';
import {Button, Descriptions, message, Modal, Steps, Tag, Tooltip, Upload, UploadFile, UploadProps} from 'antd';
import {ExtZsProjProjectSignedVo1} from "@/services/apis";
import {primeApi} from "@/services/api";
import {UploadOutlined} from "@ant-design/icons";
import {useSearchParams} from "react-router-dom";
import dayjs from "dayjs";

const QaState: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const breadcrumbList = [
    { path: '/xmgl', breadcrumbName: '项目管理' },
    { path: '/xmgl/pro-sign', breadcrumbName: '项目签约' },
  ];
  const [list, setList] = useState<{title: string | undefined; description: React.ReactNode}[]>([]);
  const [list1, setList1] = useState<{title: string | undefined; description: React.ReactNode}[]>([]);
  const [searchParams] = useSearchParams();

  const id = searchParams.get('id');
  const [data, setData] = useState<ExtZsProjProjectSignedVo1>();
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
    const data = await primeApi.getExtZsProjProjectSigned({ zsid: id! });
    console.log(data);
    setData(data);
  };

  // 获取字段变更记录
  const getChangelog = async () => {
    if (!data?.id) return;

    try {
      const result = await primeApi.listProjectDigitalDataChangelog({
        id: data.id,
        table: '签约',
        page: 1,
        size: 1000, // 获取所有变更记录
      } as any);

      // 将变更记录转换为 Map，key 为 fieldName，value 为 oldValue
      const map = new Map<string, string>();
      if (result.records && result.records.length > 0) {
        console.log('变更记录列表:', result.records);
        console.log('data 对象的所有字段:', Object.keys(data));

        result.records.forEach((record) => {
          // 根据接口返回的 fieldName 匹配字段
          if (record.fieldName && record.oldValue !== undefined && record.oldValue !== null) {
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


  const listProjectDigitalProjectReview = async () => {
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
  };

  const listProjectDigitalProjectReviewZb = async () => {
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
  };

  const [canUploadFile, setCanUploadFile] = useState(true); // 是否可以上传文件
  const [requestValue, setRequestValue] = useState<string>('');
  const checkRequest = async () => {
    try {
      const data = await primeApi.checkRequest({ zsId: id || '' });
      setRequestValue(data.value);
      console.log('checkRequest value:', data.value);
    } catch (e) {
      console.error('checkRequest error', e);
    }
  };

  // 检查是否可以上传文件
  const checkFilePermission = async () => {
    try {
      const data = await primeApi.checkFile({ zsId: id || '' });
      setCanUploadFile(data.value);
      console.log('checkFile value:', data.value);
    } catch (e) {
      console.error('checkFile error', e);
      // 如果接口调用失败，默认允许上传
      setCanUploadFile(true);
    }
  };
  const handleApplyZb = async () => {
    try {
      if (requestValue === '部门审核申请') {
        await primeApi.applyZb({ id: id || '' });
        message.success('申请成功');
        await checkRequest(); // 重新获取状态
      } else if (requestValue === '专班审核申请') {
        await primeApi.applyZb1({ id: id || '' });
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
        if (file.status !== 'done') return;

        const respAny: any = (file as any).response;
        const r0 = Array.isArray(respAny) ? respAny[0] : respAny;
        const path =
          (typeof r0 === 'string' ? r0 : r0?.path ?? r0?.url) ??
          (typeof (file as any).url === 'string' ? (file as any).url : undefined);

        if (path && String(path).trim()) uploadedPaths.push(String(path).trim());
      });

      if (uploadedPaths.length === 0) {
        message.error('未获取到上传文件的路径');
        return;
      }

      // 获取原有的 xyzzcl 值
      let existingXyzzcl = '';
      if (data?.xyzzcl) {
        // 如果是数组，转换为分号分隔的字符串
        if (Array.isArray(data.xyzzcl)) {
          existingXyzzcl = data.xyzzcl.filter((url: string) => url && url.trim()).join(';');
        } else {
          // 如果是字符串，直接使用
          existingXyzzcl = data.xyzzcl;
        }
      }

      // 拼接新的路径：原有值 + 分号 + 新路径（多个路径也用分号分隔）
      const newPaths = uploadedPaths.join(';');
      const updatedXyzzcl = existingXyzzcl
        ? `${existingXyzzcl};${newPaths}`
        : newPaths;

      // 调用更新接口
      await primeApi.updateExtZsProjProjectSigned({
        id: data?.id || '',
        extZsProjProjectSignedDto1: {
          id: data?.id || '',
          xyzzcl: updatedXyzzcl,
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
    checkFilePermission();
    getExtZsProjProjectSigned();
    listProjectDigitalProjectReview();
    listProjectDigitalProjectReviewZb();
  }, []);

  // 当 data 更新后，获取变更记录
  useEffect(() => {
    if (data?.id) {
      getChangelog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id]);
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
             <Button
                onClick={() => {
                  setShowModal(true);
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
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="招引单位" span={1}>
                  {renderFieldWithChange(data?.sjjgName || '', 'sjjgName')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="项目名称" span={1}>
                  {renderFieldWithChange(data?.name || '', 'name')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="投资方名称" span={1}>
                  {renderFieldWithChange(data?.investor || '', 'investor')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="项目地址" span={1}>
                  {renderFieldWithChange(data?.projectAddress || '', 'projectAddress')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="签约日期" span={1}>
                  {renderFieldWithChange(data?.signedDate ? dayjs(data.signedDate).format('YYYY-MM-DD') : '', 'signedDate')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="项目类型" span={1}>
                  {renderFieldWithChange(data?.bindustry === 1 ? '服务业' : data?.bindustry === 2 ? '工业' : '', 'bindustry')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="科创项目" span={1}>
                  {renderFieldWithChange(data?.isKcProj || '', 'isKcProj')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="QFLP外资项目" span={1}>
                  {renderFieldWithChange(data?.isQflp || '', 'isQflp')}
                </Descriptions.Item>

                {/* 从QaState添加的字段 */}
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="外资项目" span={1}>
                  {renderFieldWithChange(data?.ptype === 1 ? '否' : data?.ptype === 2 ? '是' : '-', 'ptype')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="上市企业" span={1}>
                  {renderFieldWithChange(data?.isListed === 1 ? '是' : data?.isListed === 2 ? '否' : '-', 'isListed')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="高新技术企业" span={1}>
                  {renderFieldWithChange(data?.isGxjs || '-', 'isGxjs')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="产业关联度" span={1}>
                  {renderFieldWithChange(data?.cyGl || '-', 'cyGl')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="特殊行业" span={1}>
                  {renderFieldWithChange(data?.tshy || '-', 'tshy')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="准入限制" span={1}>
                  {renderFieldWithChange(data?.zrxz || '-', 'zrxz')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="两高项目" span={1}>
                  {renderFieldWithChange(data?.lgxm || '-', 'lgxm')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="重金属排放" span={1}>
                  {renderFieldWithChange(data?.zjspf || '-', 'zjspf')}
                </Descriptions.Item>

                {/* 单独占一行的字段：使用 span={2} 在2列布局下占满，xs下自动占满 */}
                <Descriptions.Item
                  labelStyle={{ minWidth: '120px', maxWidth: '180px' }}
                  label="主要产品、产能及主要建设内容"
                  span={2}
                  className="full-row"
                >
                  {renderFieldWithChange(data?.desc || '', 'desc', true)}
                </Descriptions.Item>

                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="行业分类及代码" span={1}>
                  {renderFieldWithChange(data?.industryName || '-', 'industryName')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="产业方向" span={1}>
                  {renderFieldWithChange(data?.projTypeLabel || '-', 'projTypeLabel')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label={data?.ptype === 1 ? '计划总投资（亿元）' : '计划总投资（万美元）'} span={1}>
                  {data?.investMoney || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="固定资产投资（万元）" span={1}>
                  {data?.fixedInvest || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="固定投资比" span={1}>
                  {data?.fixedPercent +"%"|| '-'}
                </Descriptions.Item>
                {/* 从QaState添加的投资相关字段 */}
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label={`注册资本(${data?.ptype===1?'万元':'万美元'})`} span={1}>
                  {data?.zhuceMoney || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="申请用地（亩）" span={1}>
                  {data?.sqLandArea || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="租赁厂房面积（平方米）" span={1}>
                  {data?.zlLandArea || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="折算用地（亩）" span={1}>
                  {data?.zlLandAreaZs || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="计划投资强度（万元/亩，万美元/亩）" span={1}>
                  {data?.investLevel || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="预计年耗能情况(吨标煤)" span={1}>
                  {data?.totalUse || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="预计年排污情况（废水、废气等）" span={1}>
                  {data?.isWuran || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="预期年均产值（万元）" span={1}>
                  {data?.yqCz1 || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="预期年均开票销售（万元）" span={1}>
                  {data?.yqKpxs1 || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="预期年均税收（万元）" span={1}>
                  {data?.yqSs1 || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="预期年均亩均税收（万元）" span={1}>
                  {data?.yqMjtax1 || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="预计开工时间" span={1}>
                  {data?.planStartDate ? dayjs(data?.planStartDate).format('YYYY年MM月DD日') : '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="预计竣工时间" span={1}>
                  {data?.planEndDate ? dayjs(data?.planEndDate).format('YYYY年MM月DD日') : '-'}
                </Descriptions.Item>

                <Descriptions.Item
                  labelStyle={{ minWidth: '120px', maxWidth: '180px' }}
                  label="符合科创项目认定条件"
                  span={1}
                  className="full-row"
                >
                  {renderFieldWithChange(data?.kcProjTj || '-', 'kcProjTj', true)}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="科创项目分类" span={2}>
                  {data?.kcProjType || '-'}
                </Descriptions.Item>

                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="科创佐证材料" span={2}>
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

                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="外资投资额（万美元）" span={2}>
                  {data?.ptype === 2 ? data.investMoney : '-'}
                </Descriptions.Item>

                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="是否有融资需求" span={2}>
                  {data?.isRzxq || '-'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="融资金额" span={2}>
                  {data?.rzMoney || '-'}
                </Descriptions.Item>

                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="项目情况分析和评审结果" span={2}>
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

                <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="佐证材料" span={2}>
                  {(() => {
                    const oldValue = getFieldOldValue('xyzzcl');
                    const hasChange = oldValue !== undefined && oldValue !== null;
                    const content = data?.xyzzcl && data.xyzzcl.length > 0 ? (
                      <div style={hasChange ? {
                        backgroundColor: '#fffbe6',
                        padding: '4px 8px',
                        borderRadius: '4px',
                      } : {}}>
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
                    ) : '-';

                    return hasChange ? (
                      <Tooltip title={`变更前：${oldValue}`} placement="topLeft" mouseEnterDelay={0.3}>
                        {content}
                      </Tooltip>
                    ) : content;
                  })()}
                </Descriptions.Item>

                <Descriptions.Item
                  labelStyle={{ minWidth: '120px', maxWidth: '180px' }}
                  label="对照成效评估办法，其他需要说明的情况"
                  span={2}
                  className="full-row"
                >
                  {renderFieldWithChange(data?.cgRemark || '', 'cgRemark', true)}
                </Descriptions.Item>
                <Descriptions.Item
                  labelStyle={{ minWidth: '120px', maxWidth: '180px' }}
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

      {/* 文件上传 Modal */}
      <Modal
        title="上传补正材料"
        open={showModal}
        onCancel={() => {
          setShowModal(false);
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
