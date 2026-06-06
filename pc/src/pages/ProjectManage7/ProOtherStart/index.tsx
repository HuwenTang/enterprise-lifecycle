import { GridContent, PageContainer } from '@ant-design/pro-components';
import { Card, Collapse, CollapseProps, Descriptions, List } from 'antd';
import { FC, useEffect } from 'react';
import React, { useState } from 'react';
import useStyles from './style.style';
import { useNavigate } from '@@/exports';
import { primeApi } from '@/services/api';
import { useSearchParams } from 'react-router-dom';

import dayjs from 'dayjs';
import {
  ProjectConstructionApprovalVo,
  ProjectDigitalInvestmentAttractingVo,
  ProjectNonInvestmentConfirmationVo,
} from '@/services/apis';

type AdvancedState = {
  operationKey: 'tab1' | 'tab2' | 'tab3';
  tabActiveKey: string;
};
const ProjectAdvance7: FC = () => {
  const { styles } = useStyles();
  const [statusNum, setStatusNum] = useState(11);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  // console.log(searchParams)
  const breadcrumbList = [
    // { path: '/', breadcrumbName: '首页' },
    { path: '/xmgl', breadcrumbName: '项目管理' },
    { path: '/xmgl/xmjd', breadcrumbName: '项目详情' },
  ];
  const [active, setActive] = useState(3);

  const [data1, setData1] = useState<ProjectDigitalInvestmentAttractingVo>();
  const [data3, setData3] = useState<ProjectConstructionApprovalVo[]>([]);
  const [tabIcon, setTabIcon] = useState([
    {
      index: 0,
      key: 'detail',
      tab: '在谈',
      status: 'use',
      icon: '/mg/i1.png',
      icon1: '/mg/i1u.png',
      icon2: '/mg/i11.png',
    },
    {
      index: 1,
      key: 'rule',
      tab: '签约',
      status: 'use',
      icon: '/mg/i2.png',
      icon1: '/mg/i2u.png',
      icon2: '/mg/i22.png',
    },
    {
      index: 2,
      key: 'rule1',
      tab: '注册',
      status: 'use',
      icon: '/mg/i3.png',
      icon1: '/mg/i3u.png',
      icon2: '/mg/i33.png',
    },
    {
      index: 3,
      key: 'rule13',
      tab: '备案',
      status: 'use',
      icon: '/mg/i4.png',
      icon1: '/mg/i4u.png',
      icon2: '/mg/i44.png',
    },
    {
      index: 4,
      key: 'rule14',
      tab: '报批',
      status: 'use',
      icon: '/mg/i5.png',
      icon1: '/mg/i5u.png',
      icon2: '/mg/i55.png',
    },
    {
      index: 5,
      key: 'start',
      tab: '开工',
      status: 'use',
      icon: '/mg/i6.png',
      icon1: '/mg/i6u.png',
      icon2: '/mg/i66.png',
    },
    {
      index: 6,
      key: 'end',
      tab: '竣工',
      status: 'use',
      icon: '/mg/i7.png',
      icon1: '/mg/i7u.png',
      icon2: '/mg/i77.png',
    },
  ]);

  const [tabStatus, seTabStatus] = useState<AdvancedState>({
    operationKey: 'tab1',
    tabActiveKey: 'rule13',
  });

  const [items, setItems] = useState([
    {
      key: '1',
      label: '在谈',
      children: <p>{1}</p>,
    },
    {
      key: '2',
      label: '签约',
      children: <p>{2}</p>,
    },
    {
      key: '3',
      label: '注册',
      children: <p>{3}</p>,
    },
    {
      key: '4',
      label: '备案',
      children: <p>{3}</p>,
    },
    {
      key: '5',
      label: '报批',
      children: <p>{3}</p>,
    },
    {
      key: '6',
      label: '开工',
      children: <p>{3}</p>,
    },
    {
      key: '7',
      label: '竣工',
      children: <p>{3}</p>,
    },
  ]);
  const getProjectTimeFlow = async () => {
    try {
      const res = await primeApi.getProjectTimeFlow({ id: id! });
      const phaseMap: Record<string, string> = {
        在谈: '1',
        签约: '2',
        注册: '3',
        备案: '4',
        报批: '5',
        开工: '6',
        竣工: '7',
      };
      // 初始化 items
      const newItems = [
        { key: '1', label: '在谈', children: <p>暂无</p> },
        { key: '2', label: '签约', children: <p>暂无</p> },
        { key: '3', label: '注册', children: <p>暂无</p> },
        { key: '4', label: '备案', children: <p>暂无</p> },
        { key: '5', label: '报批', children: <p>暂无</p> },
        { key: '6', label: '开工', children: <p>暂无</p> },
        { key: '7', label: '竣工', children: <p>暂无</p> },
      ];

      // 用于按阶段收集所有记录
      const phaseRecords: Record<string, any[]> = {
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
      };

      // 遍历所有返回的数据，按阶段分组
      res.forEach((record: any) => {
        const { progress, time, result, comment, title } = record;
        const key = phaseMap[progress];
        if (key) {
          phaseRecords[key].push({
            title: title || '暂无',
            result: result || '暂无',
            comment: comment || '暂无',
            time: time ? dayjs(time).format('YYYY-MM-DD') : '暂无',
            isPrimary: record.isPrimary,
          });
        }
      });

      // 关键词映射：title 包含关键词 → 对应跳转路径
      const linkMap: Record<string, string> = {
        质态评估: `/xmgl/qa-state?id=${id}`,
        签约核定: `/xmgl/pro-sign?id=${id}`,
        开工认定: `/xmgl/pro-start?id=${id}`,
        竣工认定: `/xmgl/pro-end?id=${id}`,
      };

      // 更新每个阶段的 children，显示所有记录
      Object.keys(phaseRecords).forEach((key) => {
        const records = phaseRecords[key];
        if (records.length > 0) {
          newItems[parseInt(key) - 1].children = (
            <div>
              {records.map((record, index) => {
                // 检查 title 是否包含任一关键词
                let matchedLink = '';
                const matchedKeyword = Object.keys(linkMap).find((keyword) =>
                  record.title.includes(keyword),
                );
                if (matchedKeyword) {
                  matchedLink = linkMap[matchedKeyword];
                }
                // 标题渲染：如果是关键词，则可点击蓝色链接
                const titleElement = matchedLink ? (
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(matchedLink);
                    }}
                    style={{ color: '#4c9df8', cursor: 'pointer' }}
                  >
                    <strong>{record.title}</strong>
                  </a>
                ) : (
                  <strong>{record.title}</strong>
                );

                return (
                  <div
                    key={index}
                    style={{
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '1px dashed #ccc',
                    }}
                  >
                    <p style={{ color: record.isPrimary ? 'black' : 'gray' }}>{titleElement}</p>

                    {record.result !== '暂无' && (
                      <p style={{ color: record.isPrimary ? 'black' : 'gray' }}>
                        <strong>结果：</strong> {record.result}
                      </p>
                    )}

                    {record.comment !== '暂无' && (
                      <p style={{ color: record.isPrimary ? 'black' : 'gray' }}>
                        <strong>评论：</strong> {record.comment}
                      </p>
                    )}

                    {record.time !== '暂无' && (
                      <p style={{ color: record.isPrimary ? 'black' : 'gray', fontSize: '12px' }}>
                        时间：{record.time}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }
      });

      setItems(newItems);
    } catch (e) {
      console.log(e);
    }
  };

  const onTabChange = (tabActiveKey: string) => {
    seTabStatus({
      ...tabStatus,
      tabActiveKey,
    });
    console.log(tabActiveKey);
  };
  const [otherData, setOtherData] = useState<ProjectNonInvestmentConfirmationVo>();
  const getOtherData = async () => {
    const res = await primeApi.getProjectNonInvestmentConfirmation({ id: id! });
    setOtherData(res);

    // 获取报批信息
    if (res?.projectCode) {
      try {
        const approvalData = await primeApi.getProjectConstructionApprovalByCode({ code: res.projectCode });
        // 接口返回单个对象，转换为数组
        if (approvalData) {
          setData3([approvalData]);
        } else {
          setData3([]);
        }
      } catch (error) {
        console.error('获取报批信息失败:', error);
        setData3([]);
      }
    } else {
      setData3([]);
    }
  };
  useEffect(() => {
    getOtherData();
  }, []);
  const formatDateLabel = (value?: Date | string) => (value ? dayjs(value).format('YYYY-MM-DD') : '-');
  const formatBooleanLabel = (value?: boolean) => {
    if (value === true) {
      return '是';
    }
    if (value === false) {
      return '否';
    }
    return '-';
  };
  const formatForeignCapitalTypeLabel = (value?: boolean) => {
    if (value === true) {
      return '外资';
    }
    if (value === false) {
      return '内资';
    }
    return '-';
  };
  const formatProjectTypeLabel = (value?: string) => {
    if (value === '2') {
      return '工业';
    }
    if (value === '1') {
      return '服务业';
    }
    return value ?? '-';
  };

  return (
    <PageContainer
      style={{
        height: '90vh',
        overflow: 'auto',
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
      <div style={{ backgroundColor: '#fff' }}>
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '16px',
            padding: '45px 0',
            fontWeight: 'bolder',
          }}
        >{`项目名称：${otherData?.projectName || '暂无'}`}</div>
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {tabIcon.map((item, index) => {
            const isBeforeFiling = index < 3; // 在备案之前的阶段
            const renderStatus = isBeforeFiling ? 'disabled' : item.status;
            return (
              <div
                style={{
                  display: 'flex',
                  // alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  key={index}
                  onClick={() => {
                    if (isBeforeFiling) {
                      return;
                    }
                    setActive(index);
                    seTabStatus({
                      ...tabStatus,
                      tabActiveKey: item.key,
                    });
                  }}
                  style={{
                    cursor: renderStatus === 'no' || renderStatus === 'disabled' ? '' : 'pointer',
                    marginRight: '-20px',
                    width: '144px',
                  }}
                >
                  <div>
                    {renderStatus === 'use' && (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              background: active === index ? '#005BF5' : '#fff',
                              border: '3px solid #5792F6',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <img src={active === index ? item.icon1 : item.icon2} alt="" />
                          </div>
                          <div
                            style={{
                              marginTop: '12px',
                              fontSize: '12px',
                              color: active === index ? '#005BF5' : '#333333',
                            }}
                          >
                            {item.tab}
                          </div>
                        </div>
                        {index !== 6 ? (
                          <div
                            style={{
                              marginTop: '25px',
                              width: '100%',
                              height: '4px',
                              background: statusNum <= index ? '#dbdbdb' : '#5792F6',
                            }}
                          ></div>
                        ) : (
                          <div
                            style={{
                              marginTop: '25px',
                              width: '100%',
                              height: '4px',
                              background: 'transparent',
                            }}
                          ></div>
                        )}
                      </div>
                    )}
                    {renderStatus !== 'use' && (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                            background: '#fff',
                            border: '3px solid #dbdbdb',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <img src={item.icon} alt="" />
                          </div>
                          <div
                            style={{
                              marginTop: '12px',
                              fontSize: '12px',
                            color: '#DBDBDB',
                            }}
                          >
                            {item.tab}
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: '25px',
                            width: '100%',
                            height: '4px',
                            background: index === 6 ? 'transparent' : '#dbdbdb',
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '100%' }}>
            {tabStatus.tabActiveKey === 'detail' && (
              <div className={styles.main}>
                <GridContent>
                  <Card
                    title="在谈信息"
                    style={{
                      marginBottom: 24,
                    }}
                    bordered={false}
                  >
                    <Descriptions
                      bordered
                      column={2}
                      style={{
                        marginBottom: 24,
                      }}
                    >
                      <Descriptions.Item
                        style={{ width: '50%' }}
                        contentStyle={{ width: '25%' }}
                        labelStyle={{ width: '25%' }}
                        label="投资方"
                      >
                        {data1?.investor}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="项目总投资额（亿元）">
                        {data1?.totalInvestmentCny}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="项目来源">
                        {data1?.projectCategory}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="洽谈进度">
                        {data1?.negotiationProgress}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="项目内容" span={2}>
                        {data1?.projectContent}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="初次对接时间">
                        -
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="市(区)">
                        {data1?.districtName}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="园区">
                        {data1?.parkName}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="厂房类型">
                        {data1?.buildingType}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="拟用地面积（平方米）">
                        {data1?.useArea}
                      </Descriptions.Item>
                      <Descriptions.Item
                        labelStyle={{ width: '25%' }}
                        label="拟租厂房面积（平方米）"
                      >
                        {data1?.rentArea}
                      </Descriptions.Item>
                      <Descriptions.Item
                        labelStyle={{ width: '25%' }}
                        label="拟购厂房面积（平方米）"
                      >
                        {data1?.buyArea}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="预计年销量（万元）">
                        {data1?.yearXl}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="预计年税收（万元）">
                        {data1?.yearSs}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </GridContent>
              </div>
            )}
            {tabStatus.tabActiveKey === 'rule' && (
              <div className={styles.main}>
                <GridContent>
                  <Card
                    title="签约信息"
                    style={{
                      marginBottom: 24,
                    }}
                    bordered={false}
                  >
                    <Descriptions
                      bordered
                      column={2}
                      style={{
                        marginBottom: 24,
                      }}
                    >
                      <Descriptions.Item
                        contentStyle={{ width: '25%' }}
                        labelStyle={{ width: '25%' }}
                        label="市(区)"
                      >
                        {data1?.districtName}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="园区">
                        {data1?.parkName}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="项目名称">
                        {data1?.projectName}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="项目类别">
                        {data1?.investmentFlagLabel}
                      </Descriptions.Item>
                      <Descriptions.Item
                        labelStyle={{ width: '25%' }}
                        label={
                          data1?.investmentFlag === '内资' ? '项目总投资（亿元）' : '项目总投资（亿美元）'
                        }
                      >
                        {data1?.investmentFlag === '内资'
                          ? data1?.totalInvestmentCny
                          : data1?.totalInvestmentUsd}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="协议利用外资">
                        {data1?.agreementForeignDirectInvestment}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="项目类型">
                        {data1?.projectType}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="产业大类名称">
                        {data1?.projectCategory}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="行业编码">
                        {data1?.industryMajorClassName}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="所属行业">
                        {data1?.belongingIndustry}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="投资方名称">
                        {data1?.investor}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="投资方性质">
                        {data1?.investorNature}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="投资方注册地">
                        {data1?.countryRegion}
                      </Descriptions.Item>

                      <Descriptions.Item labelStyle={{ width: '25%' }} label="是否属于上市企业">
                        {data1?.isPubliclyTradedOrPreIPOCompany}
                      </Descriptions.Item>

                      <Descriptions.Item labelStyle={{ width: '25%' }} label="是否高新技术企业">
                        {data1?.ifGxjs}
                      </Descriptions.Item>

                      <Descriptions.Item labelStyle={{ width: '25%' }} label="QFLP外资项目">
                        {data1?.isQflp}
                      </Descriptions.Item>

                      <Descriptions.Item labelStyle={{ width: '25%' }} label="项目信息来源">
                        {data1?.source}
                      </Descriptions.Item>

                      <Descriptions.Item labelStyle={{ width: '25%' }}  span={2} label="项目简介">
                        {data1?.isPubliclyTradedOrPreIPOCompany? '是': '否'}
                      </Descriptions.Item>

                      <Descriptions.Item labelStyle={{ width: '25%' }} label="部门名称">
                        {data1?.sourceDepartmentName}
                      </Descriptions.Item>

                      <Descriptions.Item labelStyle={{ width: '25%' }} label="项目选址位置">
                        {data1?.projectLocation}
                      </Descriptions.Item>

                        <Descriptions.Item labelStyle={{ width: '25%' }} label="预计开工时间">
                          {data1?.plannedStartTime ? dayjs(data1?.plannedStartTime).format('YYYY-MM-DD') : ''}
                        </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="预计竣工时间">
                          {data1?.plannedEndTime ? dayjs(data1?.plannedEndTime).format('YYYY-MM-DD') : ''}
                        </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="注册资本（万元）">
                        {data1?.companyRegistrationFunds}
                      </Descriptions.Item>

                      <Descriptions.Item labelStyle={{ width: '25%' }} label="签约日期">
                        {data1?.signingTime ? dayjs(data1?.signingTime).format('YYYY-MM-DD') : '-'}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="签约信息统计日期">
                        {data1?.signingTime ? dayjs(data1?.signingTime).format('YYYY-MM-DD') : ''}
                      </Descriptions.Item>

                      <Descriptions.Item labelStyle={{ width: '25%' }} label="成效情况说明">
                        {data1?.cgRemark}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="产业关联度">
                        -
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="特殊行业">
                        {data1?.tshy}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="准入限制">
                        {data1?.zrxz}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="两高项目">
                        {data1?.lgxm}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="重金属排放">
                        {data1?.zjspf}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="预计年耗能情况(吨标煤)">
                        {data1?.totalEnergyConsumption}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="预计年排污情况（废水、废气等）">
                        {data1?.wastewaterBy1}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="申请用地面积（亩）">
                        {data1?.appliedLandArea}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="租赁厂房面积（平方米）">
                        {data1?.rentArea}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="折算用地（亩）">
                        {data1?.useArea}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="计划总投资（万元）">
                        {data1?.plannedTotalInvestment}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="计划投资强度（万元/亩）">
                        {data1?.investmentIntensity}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="固定资产投资（万元）">
                        {data1?.fixedAssetInvestment}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="预期年均产值（万元）">
                        {data1?.yqCz}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="预期年均开票销售（万元）">
                        {data1?.yqKpxs}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="预期年均税收（万元）">
                        {data1?.yqSs}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="预期年均亩均税收（万元）">
                        {data1?.yqMjtax}
                      </Descriptions.Item>
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="项目内容" span={2}>*/}
                        {/*  {data1?.projectContent}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="是否为新引进企业">*/}
                        {/*  {data1?.isNewIntroducedEnterpriseLabel}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="是否为世界500强或全球专业领域行业龙头企业"*/}
                        {/*>*/}
                        {/*  {data1?.isDomesticTop500OrTop100Company === true*/}
                        {/*    ? '是'*/}
                        {/*    : data1?.isDomesticTop500OrTop100Company === false*/}
                        {/*    ? '否'*/}
                        {/*    : ''}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="是否为国内100强或国内行业排名前100企业"*/}
                        {/*>*/}
                        {/*  {data1?.isDomesticTop500OrTop100Company === true*/}
                        {/*    ? '是'*/}
                        {/*    : data1?.isDomesticTop500OrTop100Company === false*/}
                        {/*    ? '否'*/}
                        {/*    : ''}*/}
                        {/*</Descriptions.Item>*/}

                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="是否为上市公司或上市辅导期企业"*/}
                        {/*>*/}
                        {/*  {data1?.isPubliclyTradedOrPreIPOCompany === true*/}
                        {/*    ? '是'*/}
                        {/*    : data1?.isPubliclyTradedOrPreIPOCompany === false*/}
                        {/*    ? '否'*/}
                        {/*    : ''}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="是否为瞪羚、专精特新、独角兽企业"*/}
                        {/*>*/}
                        {/*  {data1?.isUnicornStartup === true*/}
                        {/*    ? '是'*/}
                        {/*    : data1?.isUnicornStartup === false*/}
                        {/*    ? '否'*/}
                        {/*    : ''}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="已投资项目对属地政府亩均税收（万元）"*/}
                        {/*>*/}
                        {/*  {data1?.averageTaxPerMuOfExistingInvestment}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="主要客户">*/}
                        {/*  {data1?.majorCustomers}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="计划总投资（亿元）">*/}
                        {/*  {data1?.plannedTotalInvestment}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="固定资产投资（万元）">*/}
                        {/*  {data1?.isFixedAssetInvestment}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="设备投资（万元）">*/}
                        {/*  {data1?.equipmentInvestment}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="注册资本">*/}
                        {/*  {data1?.registeredCapital}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="计划开工时间">*/}
                        {/*  {data1?.plannedStartTime &&*/}
                        {/*    dayjs(data1?.plannedStartTime).format('YYYY-MM-DD')}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="项目使用主要原、辅材料"*/}
                        {/*>*/}
                        {/*  {data1?.mainRawMaterialsUsed}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="主要流程工艺">*/}
                        {/*  {data1?.mainProcessTechnology}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="是否为新供地项目">*/}
                        {/*  {data1?.isNewSupplyLandProject === true*/}
                        {/*    ? '是'*/}
                        {/*    : data1?.isNewSupplyLandProject === false*/}
                        {/*    ? '否'*/}
                        {/*    : ''}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="项目选址位置">*/}
                        {/*  {data1?.projectLocation}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="申请用地面积（亩）">*/}
                        {/*  {data1?.appliedLandArea}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="行业是否属于高新技术产业分类目录"*/}
                        {/*>*/}
                        {/*  {data1?.isHighTechIndustry ? '是' : '否'}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="是否为高技术项目">*/}
                        {/*  {data1?.isHighTechProject === true*/}
                        {/*    ? '是'*/}
                        {/*    : data1?.isHighTechProject === false*/}
                        {/*    ? '否'*/}
                        {/*    : ''}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="是否为国家工业战略性新兴产业"*/}
                        {/*>*/}
                        {/*  {data1?.isNationalStrategicEmergingIndustry === true*/}
                        {/*    ? '是'*/}
                        {/*    : data1?.isNationalStrategicEmergingIndustry === false*/}
                        {/*    ? '否'*/}
                        {/*    : ''}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="容积率（%）">*/}
                        {/*  {data1?.plotRatioPercent}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="预期开票销售（万元）">*/}
                        {/*  {data1?.expectedInvoiceSales}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="预期税收（万元）">*/}
                        {/*  {data1?.expectedTax}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="预期用工人数（人）">*/}
                        {/*  {data1?.expectedEmployeeCount}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="固定资产投资占比（%）"*/}
                        {/*>*/}
                        {/*  {data1?.fixedAssetInvestmentPercentage}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="投资强度（万元/千平方米）"*/}
                        {/*>*/}
                        {/*  {data1?.investmentIntensity}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="预期亩均税收（万元/千平方米）"*/}
                        {/*>*/}
                        {/*  {data1?.expectedAverageTax}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item label="是否有产生废水和挥发性有机废水排放">*/}
                        {/*  {data1?.wastewaterBy1 === true*/}
                        {/*    ? '是'*/}
                        {/*    : data1?.wastewaterBy1 === false*/}
                        {/*    ? '否'*/}
                        {/*    : ''}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂"*/}
                        {/*>*/}
                        {/*  {data1?.wastewaterBy2 === true*/}
                        {/*    ? '是'*/}
                        {/*    : data1?.wastewaterBy2 === false*/}
                        {/*    ? '否'*/}
                        {/*    : ''}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item label="总能耗">*/}
                        {/*  {data1?.totalEnergyConsumption}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="项目是否含有研发团队、产学研合作及研发机构建设内容"*/}
                        {/*>*/}
                        {/*  {data1?.hasRndTeamAndCooperation === true*/}
                        {/*    ? '是'*/}
                        {/*    : data1?.hasRndTeamAndCooperation === false*/}
                        {/*    ? '否'*/}
                        {/*    : ''}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="项目是否拥有相关有效发明专利"*/}
                        {/*>*/}
                        {/*  {data1?.hasValidPatents === true*/}
                        {/*    ? '是'*/}
                        {/*    : data1?.hasValidPatents === false*/}
                        {/*    ? '否'*/}
                        {/*    : ''}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item*/}
                        {/*  labelStyle={{ width: '25%' }}*/}
                        {/*  label="是否拟列入重点活动签约项目库"*/}
                        {/*>*/}
                        {/*  {data1?.isListedAsKeyActivitySigningProject === true*/}
                        {/*    ? '是'*/}
                        {/*    : data1?.isListedAsKeyActivitySigningProject === false*/}
                        {/*    ? '否'*/}
                        {/*    : ''}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="是否为招商会项目">*/}
                        {/*  {data1?.isRecruitmentFairProject === true*/}
                        {/*    ? '是'*/}
                        {/*    : data1?.isRecruitmentFairProject === false*/}
                        {/*    ? '否'*/}
                        {/*    : ''}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item labelStyle={{ width: '25%' }} label="招商会名称">*/}
                        {/*  {data1?.recruitmentFairName}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item span={2} label="预计年销售（万元）">*/}
                        {/*  {data1?.expectedAnnualSalesAmount}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item span={2} label="备注">*/}
                        {/*  {data1?.remarks}*/}
                        {/*</Descriptions.Item>*/}
                      {/*<Descriptions.Item labelStyle={{width: '25%'}} label="立项时间">{data2?.approvalTime}</Descriptions.Item>*/}
                    </Descriptions>
                  </Card>
                </GridContent>
              </div>
            )}
            {tabStatus.tabActiveKey === 'rule1' && (
              <div className={styles.main}>
                <GridContent>
                  <Card
                    title="注册信息"
                    style={{
                      marginBottom: 24,
                    }}
                    bordered={false}
                  >
                    <Descriptions
                      bordered
                      column={2}
                      style={{
                        marginBottom: 24,
                      }}
                    >
                      <Descriptions.Item
                        contentStyle={{ width: '25%' }}
                        labelStyle={{ width: '25%' }}
                        label="统一社会信用代码"
                      >
                        {data1?.uscc}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="注册公司名称">
                        {data1?.companyName}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="注册资金（亿元）">
                        {data1?.companyRegistrationFunds}
                      </Descriptions.Item>
                      <Descriptions.Item labelStyle={{ width: '25%' }} label="注册日期">
                        {data1?.companyRegistrationDate
                          ? dayjs(data1?.companyRegistrationDate).format('YYYY-MM-DD')
                          : ''}
                      </Descriptions.Item>
                      {/*<Descriptions.Item labelStyle={{width: '25%'}} label="项目代码">{data3?.projectCode}</Descriptions.Item>*/}
                    </Descriptions>
                  </Card>
                </GridContent>
              </div>
            )}

            {tabStatus.tabActiveKey === 'rule13' && (
              <div className={styles.main}>
                <GridContent>
                  <Card title="备案信息" style={{ marginBottom: 24 }} bordered={false}>
                    {!otherData ? (
                      <p>暂无备案信息</p>
                    ) : (
                      <Descriptions bordered column={2} size="small" style={{ marginTop: 12 }}>
                        <Descriptions.Item
                          contentStyle={{ width: '25%' }}
                          labelStyle={{ width: '25%' }}
                          label="项目代码"
                        >
                          {otherData.projectCode ?? '-'}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="项目名称"
                        >
                          {otherData.projectName ?? '-'}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="市（区）"
                        >
                          {otherData.districtName ?? '-'}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="园区（镇街）"
                        >
                          {otherData.parkName ?? '-'}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="项目地址"
                        >
                          {otherData.projectAddress ?? '-'}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="法人单位社会统一信用代码"
                        >
                          {otherData.unifiedSocialCreditCode ?? '-'}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="批准部门"
                        >
                          {otherData.approvalDepartment ?? '-'}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="备案投资类型"
                        >
                          {otherData.investmentType ?? '-'}
                        </Descriptions.Item>


                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="批准日期"
                        >
                          {formatDateLabel(otherData.approvalDate)}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="申请备案时间"
                        >
                          {formatDateLabel(otherData.applicationTime)}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="投资方名称"
                        >
                          {otherData.investor ?? '-'}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="计划总投资（万元）"
                        >
                          {otherData.investmentAmount ?? '-'}
                        </Descriptions.Item>


                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="投资类型"
                        >
                          {formatForeignCapitalTypeLabel(otherData.ifForeignCapital)}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="申报单位"
                        >
                          {otherData.department ?? '-'}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="项目类型"
                        >
                          {formatProjectTypeLabel(otherData.projectType)}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="产业方向"
                        >
                          {otherData.industryDirectionLabel ?? '-'}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="行业分类"
                        >
                          {otherData.industryClassification ?? '-'}
                        </Descriptions.Item>

                        <Descriptions.Item
                          labelStyle={{ width: '25%' }}
                          label="主要产品、产能及主要建设内容"
                          span={2}
                        >
                          {otherData.mainProducts ?? '-'}
                        </Descriptions.Item>
                      </Descriptions>
                    )}
                  </Card>
                </GridContent>
              </div>
            )}

            {tabStatus.tabActiveKey === 'rule14' && (
              <div className={styles.main}>
                <GridContent>
                  <Card title="报批信息" style={{ marginBottom: 24 }} bordered={false}>
                    {data3.length === 0 ? (
                      <p>暂无报批信息</p>
                    ) : (
                      <Collapse
                        bordered={false}
                        defaultActiveKey={['0']}
                        expandIcon={({ isActive }) => (
                          <span style={{ color: '#005BF5' }}>{isActive ? '▼' : '▶'}</span>
                        )}
                        style={{ background: '#f8f9fa' }}
                        items={data3.map((item, index) => ({
                          key: String(index),
                          label: `报批记录 ${index + 1} - ${item.projectName || '未命名项目'}`,
                          children: (
                            <Descriptions
                              bordered
                              column={2}
                              size="small"
                              style={{ marginTop: 12 }}
                            >
                              <Descriptions.Item
                                contentStyle={{ width: '25%' }}
                                labelStyle={{ width: '25%' }}
                                label="是否涉及固定资产投资项目"
                              >
                                {data1?.isFixedAssetInvestmentLabel}
                              </Descriptions.Item>

                              <Descriptions.Item span={2} label="是否涉及建设用地">
                                {data1?.isConstructionLandLabel}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="建设用地规划许可证编号"
                              >
                                {data1?.constructionLandPlanningPermitNumber}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="取得许可证日期"
                              >
                                {data1?.permitObtainDate
                                  ? dayjs(data1?.permitObtainDate).format('YYYY-MM-DD')
                                  : ''}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="项目名称">
                                {data1?.projectName}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="项目代码">
                                <a
                                  onClick={() => {
                                    if (data1?.constructionApprovalIds?.[index]) {
                                      navigate(
                                        `/xmgl-gg/detail?id=${data1?.constructionApprovalIds?.[index]}`,
                                      );
                                    }
                                  }}
                                >
                                  {item?.projectCode}
                                </a>
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="项目详细地址">
                                {item?.detailedAddress}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="项目地址-行政区划"
                              >
                                {item?.areaName}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="工程代码">
                                {item?.engineeringCode}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="立项部门">
                                {item?.approvalDepartment}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="行业类别（国标行业）"
                              >
                                {item?.industryCategoryLabel}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="项目类型">
                                {item?.projectTypeLabel}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="项目投资来源">
                                {item?.investmentSourceLabel}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="立项类型">
                                {item?.approvalTypeLabel}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="项目资金属性">
                                {item?.fundAttributeLabel}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="总投资额（万元）"
                              >
                                {item?.totalInvestment}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="项目资本金（万元）"
                              >
                                {item?.projectCapital}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="是否是亿元以上产业项目"
                              >
                                {item?.isOverOneBillionIndustrialProject}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="是否是集中建设项目"
                              >
                                {item?.isConcentratedBuildingProject}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="集中建设单位名称"
                              >
                                {item?.concentratedBuilderName}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="集中建设单位统一社会信用代码"
                              >
                                {item?.concentratedBuilderUscc}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="集中建设单位法定代表人姓名"
                              >
                                {item?.concentratedBuilderLegalRepresentative}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="单位类型">
                                {item?.companyTypeLabel}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="企业名称">
                                {item?.companyName}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="统一社会信用代码"
                              >
                                {item?.uscc}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="法定代表人姓名"
                              >
                                {item?.legalRepresentative}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="联系电话">
                                {item?.contactPhone}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="土地是否带设计方案"
                              >
                                {item?.hasDesignPlan}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="是否完成区域评估"
                              >
                                {item?.regionalAssessmentCompleted}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="用地面积（㎡）"
                              >
                                {item?.landAreaSqm}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="新增用地面积（㎡）"
                              >
                                {item?.newLandAreaSqm}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="土地获取方式">
                                {item?.landAcquisitionMethodLabel}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="建设性质">
                                {item?.constructionNatureLabel}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="建设类型">
                                {item?.constructionTypeLabel}
                              </Descriptions.Item>

                              <Descriptions.Item
                                labelStyle={{ width: '25%' }}
                                label="总建筑面积（㎡）"
                              >
                                {item?.totalFloorAreaSqm}
                              </Descriptions.Item>

                              <Descriptions.Item labelStyle={{ width: '25%' }} label="拟开工时间">
                                {item?.plannedStartDate &&
                                  dayjs(item?.plannedStartDate).format('YYYY-MM-DD')}
                              </Descriptions.Item>

                              <Descriptions.Item span={2} label="拟建成时间">
                                {item?.plannedCompletionDate &&
                                  dayjs(item?.plannedCompletionDate).format('YYYY-MM-DD')}
                              </Descriptions.Item>

                              <Descriptions.Item span={2} label="经度">
                                {item?.longitude}
                              </Descriptions.Item>

                              <Descriptions.Item span={2} label="纬度">
                                {item?.latitude}
                              </Descriptions.Item>

                              <Descriptions.Item span={2} label="建设内容（包括必要性）">
                                {item?.constructionContent}
                              </Descriptions.Item>
                            </Descriptions>
                          ),
                        }))}
                      />
                    )}
                  </Card>
                </GridContent>
              </div>
            )}
            {tabStatus.tabActiveKey === 'start' && (
              <div className={styles.main}>
                <GridContent>
                  <Card
                    title="开工信息"
                    style={{
                      marginBottom: 24,
                    }}
                    bordered={false}
                  >
                    <Descriptions
                      bordered
                      column={2}
                      style={{
                        marginBottom: 24,
                      }}
                    >
                      <Descriptions.Item
                        labelStyle={{ width: '25%' }}
                        span={1}
                        label="开工日期"
                      >
                        {otherData?.commencementDate
                          ? dayjs(otherData.commencementDate).format('YYYY-MM-DD')
                          : '-'}
                      </Descriptions.Item>
                      <Descriptions.Item
                        labelStyle={{ width: '25%' }}
                        span={1}
                        label="是否列统项目"
                      >
                        {formatBooleanLabel(otherData?.ifIncludedInDatabase)}
                      </Descriptions.Item>
                      <Descriptions.Item
                        labelStyle={{ width: '25%' }}
                        span={2}
                        label="佐证资料"
                      >
                        {otherData?.kgzzcl && Array.isArray(otherData.kgzzcl) && otherData.kgzzcl.length > 0 ? (
                          <List
                            size="small"
                            dataSource={otherData.kgzzcl}
                            renderItem={(item: any) => {
                              // 如果是字符串，直接使用；如果是对象，使用 path 属性
                              const path = typeof item === 'string' ? item : (item.path || '');
                              const name = typeof item === 'string'
                                ? path.split('/').pop()?.split('?')[0] || '文件'
                                : (item.name || path.split('/').pop()?.split('?')[0] || '文件');
                              return (
                                <List.Item>
                                  <a href={path} target="_blank" download={name}>
                                    {name}
                                  </a>
                                </List.Item>
                              );
                            }}
                          />
                        ) : (
                          <span>无材料</span>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item
                        labelStyle={{ width: '25%' }}
                        span={2}
                        label="项目进展图片"
                      >
                        {otherData?.progressImages && Array.isArray(otherData.progressImages) && otherData.progressImages.length > 0 ? (
                          <List
                            size="small"
                            dataSource={otherData.progressImages}
                            renderItem={(item: any) => {
                              // 如果是字符串，直接使用；如果是对象，使用 path 属性
                              const path = typeof item === 'string' ? item : (item.path || '');
                              const name = typeof item === 'string'
                                ? path.split('/').pop()?.split('?')[0] || '图片'
                                : (item.name || path.split('/').pop()?.split('?')[0] || '图片');
                              return (
                                <List.Item>
                                  <a href={path} target="_blank" download={name}>
                                    {name}
                                  </a>
                                </List.Item>
                              );
                            }}
                          />
                        ) : (
                          <span>无图片</span>
                        )}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </GridContent>
              </div>
            )}
            {tabStatus.tabActiveKey === 'end' && (
              <div className={styles.main}>
                <GridContent>
                  <Card
                    title="竣工信息"
                    style={{
                      marginBottom: 24,
                    }}
                    bordered={false}
                  >
                    <Descriptions
                      bordered
                      column={2}
                      style={{
                        marginBottom: 24,
                      }}
                    >
                      <Descriptions.Item
                        labelStyle={{ width: '25%' }}
                        span={1}
                        label="竣工日期"
                      >
                        {otherData?.endDate
                          ? dayjs(otherData.endDate).format('YYYY-MM-DD')
                          : '-'}
                      </Descriptions.Item>
                      <Descriptions.Item
                        labelStyle={{ width: '25%' }}
                        span={2}
                        label="佐证资料"
                      >
                        {otherData?.jgzzcl && Array.isArray(otherData.jgzzcl) && otherData.jgzzcl.length > 0 ? (
                          <List
                            size="small"
                            dataSource={otherData.jgzzcl}
                            renderItem={(item: any) => {
                              // 如果是字符串，直接使用；如果是对象，使用 path 属性
                              const path = typeof item === 'string' ? item : (item.path || '');
                              const name = typeof item === 'string'
                                ? path.split('/').pop()?.split('?')[0] || '文件'
                                : (item.name || path.split('/').pop()?.split('?')[0] || '文件');
                              return (
                                <List.Item>
                                  <a href={path} target="_blank" download={name}>
                                    {name}
                                  </a>
                                </List.Item>
                              );
                            }}
                          />
                        ) : (
                          <span>无材料</span>
                        )}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </GridContent>
              </div>
            )}
          </div>

        </div>
      </div>
    </PageContainer>
  );
};
export default ProjectAdvance7;
