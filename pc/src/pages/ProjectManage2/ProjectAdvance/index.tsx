import { GridContent, PageContainer } from '@ant-design/pro-components';
import { Card, Descriptions } from 'antd';
import {FC, useEffect} from 'react';
import React, { useState } from 'react';
import useStyles from './style.style';
import {useNavigate} from '@@/exports';
import { primeApi } from '@/services/api';
import { useSearchParams} from 'react-router-dom';

import dayjs from 'dayjs';
import {
  ProjectConstructionApprovalVo,
  ProjectDigitalInvestmentAttractingVo,
  ProjectOnlineApprovalVo
} from "@/services/apis";
import {div} from "zrender/lib/core/vector";

type AdvancedState = {
  operationKey: 'tab1' | 'tab2' | 'tab3';
  tabActiveKey: string;
};
const ProjectAdvance: FC = () => {
  const { styles } = useStyles();
  const [statusNum, setStatusNum] = useState(11)
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  // console.log(searchParams)
  const breadcrumbList = [
    // { path: '/', breadcrumbName: '首页' },
    { path: '/xmgl2', breadcrumbName: '质态评估' },
    { path: '/xmgl/xmjd', breadcrumbName: '质态评估详情' },
  ];
  const [active, setActive] = useState(5);

  const [data1, setData1] = useState<ProjectDigitalInvestmentAttractingVo>();
  const [data2, setData2] = useState<ProjectOnlineApprovalVo>();
  const [data3, setData3] = useState<ProjectConstructionApprovalVo>();
  const [tabIcon,setTabIcon] =useState( [
    {
      index:0,
      key: 'detail',
      tab: '在谈',
      status: 'use',
      icon:'/mg/i1.png',
      icon1:'/mg/i1u.png',
      icon2:'/mg/i11.png'
    },
    {
      index:1,
      key: 'rule',
      tab: '签约',
      status: 'use',
      icon:'/mg/i2.png',
      icon1:'/mg/i2u.png',
      icon2:'/mg/i22.png'
    },
    {
      index:2,
      key: 'rule1',
      tab: '注册',
      status: 'use',
      icon:'/mg/i3.png',
      icon1:'/mg/i3u.png',
      icon2:'/mg/i33.png'

    },
    {
      index:3,
      key: 'rule13',
      tab: '备案',
      status: 'use',
      icon:'/mg/i4.png',
      icon1:'/mg/i4u.png',
      icon2:'/mg/i44.png'

    },
    {
      index:4,
      key: 'rule14',
      tab: '报批',
      status: 'use',
      icon:'/mg/i5.png',
      icon1:'/mg/i5u.png',
      icon2:'/mg/i55.png'

    },
    {
      index:5,
      key: 'start',
      tab: '开工',
      status: 'use',
      icon:'/mg/i6.png',
      icon1:'/mg/i6u.png',
      icon2:'/mg/i66.png'

    },
    {
      index:6,
      key: 'end',
      tab: '竣工',
      status: 'no',
      icon:'/mg/i7.png',
      icon1:'/mg/i7u.png',
      icon2:'/mg/i77.png'
    },
  ]);

  const [tabStatus, seTabStatus] = useState<AdvancedState>({
    operationKey: 'tab1',
    tabActiveKey: 'start',
  });

  const onTabChange = (tabActiveKey: string) => {
    seTabStatus({
      ...tabStatus,
      tabActiveKey,
    });
    console.log(tabActiveKey);
  };
  useEffect(() => {
    primeApi.getProjectDigitalInvestmentAttracting({ id: id! }).then((res) => {
      let statusNum = 0;
      if (res.currentProjectProgressLabel!.includes('在谈')) {
        statusNum = 0;
        setActive(0);
      } else if (res.currentProjectProgressLabel!.includes('签约')) {
        statusNum = 1;
        setActive(1);
      } else if (res.currentProjectProgressLabel!.includes('注册')) {
        statusNum = 2;
        setActive(2);
      } else if (res.currentProjectProgressLabel!.includes('备案')) {
        statusNum = 3;
        setActive(3);
      } else if (res.currentProjectProgressLabel!.includes('报批')) {
        statusNum = 4;
        setActive(4);
      } else if (res.currentProjectProgressLabel!.includes('开工')) {
        statusNum = 5;
        setActive(5);
      } else if (res.currentProjectProgressLabel!.includes('竣工')) {
        statusNum = 6;
        setActive(6);
      }
      setStatusNum(statusNum);
      const datalist = tabIcon.map((item) => {
        if (item.index > statusNum) {
          return {
            ...item,
            status: 'no',
          };
        } else {
          return {
            ...item,
            status: 'use',
          };
        }
      });
      console.log(datalist);
      setTabIcon(datalist);
      seTabStatus({
        ...tabStatus,
        tabActiveKey: tabIcon[statusNum].key,
      });
      setData1(res);
      if(res.onlineApprovalId){
        primeApi.getProjectOnlineApproval({ id :res.onlineApprovalId!}).then((res) => {
          setData2(res);
        });
      }
      if(res.constructionApprovalId){
        primeApi.getProjectConstructionApproval({ id :res.constructionApprovalId!}).then((res) => {
          setData3(res);
        });
      }
    });

  }, []);
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
      // title={`项目名称：${data1?.projectName}`}
      // subTitle={`项目编码：${data1?.projectStatus}`}
      // extra={action}
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
        >{`项目名称：${data1?.projectName}`}</div>
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {tabIcon.map((item, index) => {
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
                    console.log(statusNum)
                    if (index > statusNum) {
                      return;
                    }
                    setActive(index);
                    seTabStatus({
                      ...tabStatus,
                      tabActiveKey: item.key,
                    });
                    console.log(tabStatus);
                  }}
                  style={{
                    cursor: item.status === 'no' ? '' : 'pointer',
                    marginRight: '-20px',
                    width: '144px',
                  }}
                >
                  <div>
                    {item.status === 'use' && (
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
                              background: active === index ? '#005BF5' :'#fff',
                              border: '3px solid #5792F6',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <img src={active === index ? item.icon1:item.icon2} alt="" />
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
                        {index !== 6 ?(
                          <div
                            style={{
                              marginTop: '25px',
                              width: '100%',
                              height: '4px',
                              background: statusNum <= index ? '#dbdbdb' : '#5792F6',
                            }}
                          ></div>
                        ):(
                          <div
                            style={{
                              marginTop: '25px',
                              width: '100%',
                              height: '4px',
                              background:'#fff',
                            }}
                          ></div>
                        )
                        }
                      </div>
                    )}
                    {item.status === 'no' && (
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
                    2022年12月16日
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="市(区)">
                    {data1?.districtName}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="园区">
                    {data1?.parkName}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="厂房类型">
                    {data1?.factoryType}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="拟用地面积（平方米）">
                    {data1?.plannedLandArea}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="拟租厂房面积（平方米）">
                    {data1?.plannedRentalFactoryArea}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="拟购厂房面积（平方米）">
                    {data1?.plannedPurchaseFactoryArea}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="预计年销量（万元）">
                    {data1?.expectedAnnualSales}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="预计年税收（万元）">
                    {data1?.expectedAnnualTax}
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
                    {' '}
                    {data2?.projectName}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目类别">
                    {data1?.investmentFlagLabel}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label={data1?.investmentFlag === '内资' ? '总投资（亿元）' : '总投资（亿美元）'}
                  >
                    {data1?.investmentFlag === '内资'
                      ? data1?.totalInvestmentCny
                      : data1?.totalInvestmentUsd}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="协议利用外资">
                    {data1?.agreementForeignDirectInvestment}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目类型">
                    {data2?.projectTypeLabel}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="产业大类名称">
                    {data1?.industryMajorClassName}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="行业编码">
                    {data1?.industryClassification}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="所属行业">
                    {data1?.belongingIndustry}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="投资方名称">
                    {data1?.mainInvestorName}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="投资方性质">
                    {data1?.investorNature}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="投资方注册地">
                    {' '}
                    {data1?.countryRegion}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="签约日期">
                    {data1?.signingTime ? dayjs(data1?.signingTime).format('YYYY-MM-DD') : ''}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目内容" span={2}>
                    {data1?.projectContent}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="是否为新引进企业">
                    {data1?.isNewIntroducedEnterpriseLabel}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="是否为世界500强或全球专业领域行业龙头企业"
                  >
                    {data1.isDomesticTop500OrTop100Company === true
                      ? '是'
                      : data1.isDomesticTop500OrTop100Company === false
                      ? '否'
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="是否为国内100强或国内行业排名前100企业"
                  >
                    {data1.isDomesticTop500OrTop100Company === true
                      ? '是'
                      : data1.isDomesticTop500OrTop100Company === false
                      ? '否'
                      : ''}
                  </Descriptions.Item>

                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="是否为上市公司或上市辅导期企业"
                  >
                    {data1.isPubliclyTradedOrPreIPOCompany === true
                      ? '是'
                      : data1.isPubliclyTradedOrPreIPOCompany === false
                      ? '否'
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="是否为瞪羚、专精特新、独角兽企业"
                  >
                    {data1.isUnicornStartup === true
                      ? '是'
                      : data1.isUnicornStartup === false
                      ? '否'
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="已投资项目对属地政府亩均税收（万元）"
                  >
                    {data1?.averageTaxPerMuOfExistingInvestment}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="主要客户">
                    {data1?.majorCustomers}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="计划总投资（亿元）">
                    {data1?.plannedTotalInvestment}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="固定资产投资（万元）">
                    {data1?.isFixedAssetInvestment}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="设备投资（万元）">
                    {data1?.equipmentInvestment}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="注册资本">
                    {data1?.registeredCapital}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="计划开工时间">
                    {data1?.plannedStartTime && dayjs(data1?.plannedStartTime).format('YYYY-MM-DD')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目使用主要原、辅材料">
                    {data1?.mainRawMaterialsUsed}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="主要流程工艺">
                    {data1?.mainProcessTechnology}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="是否为新供地项目">
                    {data1.isNewSupplyLandProject === true
                      ? '是'
                      : data1.isNewSupplyLandProject === false
                      ? '否'
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目选址位置">
                    {data1?.projectLocation}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="申请用地面积（亩）">
                    {data1?.appliedLandArea}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="行业是否属于高新技术产业分类目录"
                  >
                    {data1?.isHighTechIndustry ? '是' : '否'}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="是否为高技术项目">
                    {data1.isHighTechProject === true
                      ? '是'
                      : data1.isHighTechProject === false
                      ? '否'
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="是否为国家工业战略性新兴产业"
                  >
                    {data1.isNationalStrategicEmergingIndustry === true
                      ? '是'
                      : data1.isNationalStrategicEmergingIndustry === false
                      ? '否'
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="容积率（%）">
                    {data1?.plotRatioPercent}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="预期开票销售（万元）">
                    {data1?.expectedInvoiceSales}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="预期税收（万元）">
                    {data1?.expectedTax}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="预期用工人数（人）">
                    {data1?.expectedEmployeeCount}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="固定资产投资占比（%）">
                    {data1?.fixedAssetInvestmentPercentage}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="投资强度（万元/千平方米）"
                  >
                    {data1?.investmentIntensity}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="预期亩均税收（万元/千平方米）"
                  >
                    {data1?.expectedAverageTax}
                  </Descriptions.Item>
                  <Descriptions.Item label="是否有产生废水和挥发性有机废水排放">
                    {data1.wastewaterBy1 === true
                      ? '是'
                      : data1.wastewaterBy1 === false
                      ? '否'
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂"
                  >
                    {data1.wastewaterBy2 === true
                      ? '是'
                      : data1.wastewaterBy2 === false
                      ? '否'
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item label="总能耗">
                    {data1?.totalEnergyConsumption}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="项目是否含有研发团队、产学研合作及研发机构建设内容"
                  >
                    {data1.hasRndTeamAndCooperation === true
                      ? '是'
                      : data1.hasRndTeamAndCooperation === false
                      ? '否'
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="项目是否拥有相关有效发明专利"
                  >
                    {data1.hasValidPatents === true
                      ? '是'
                      : data1.hasValidPatents === false
                      ? '否'
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="是否拟列入重点活动签约项目库"
                  >
                    {data1.isListedAsKeyActivitySigningProject === true
                      ? '是'
                      : data1.isListedAsKeyActivitySigningProject === false
                      ? '否'
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="是否为招商会项目">
                    {data1.isRecruitmentFairProject === true
                      ? '是'
                      : data1.isRecruitmentFairProject === false
                      ? '否'
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="招商会名称">
                    {data1?.recruitmentFairName}
                  </Descriptions.Item>
                  <Descriptions.Item span={2} label="预计年销售（万元）">
                    {data1?.expectedAnnualSalesAmount}
                  </Descriptions.Item>
                  <Descriptions.Item span={2} label="备注">
                    {data1?.remarks}
                  </Descriptions.Item>
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
                    {data1.companyRegistrationDate
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
              <Card
                title="备案信息"
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
                    label="备案（核准）项目名称"
                  >
                    {data1?.filingApprovalProjectName}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="备案（核准）投资总额（亿元）"
                  >
                    {data1?.filingApprovalInvestmentTotal}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="备案（核准）日期">
                    {data1?.filingApprovalDate &&
                      dayjs(data1?.filingApprovalDate).format('YYYY-MM-DD')}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目审批类型">
                    {data2?.approvalType}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="备案目录">
                    {data2?.filingCatalog}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目名称">
                    {data1?.projectName}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="主项目名称">
                    {data2?.mainProjectName}
                  </Descriptions.Item>

                  <Descriptions.Item labelStyle={{ width: '25%' }} label="是否补办项目">
                    {' '}
                    {data2?.isSupplementaryProject}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目代码">
                    {data2?.projectCode}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="申报时间">
                    {data2?.applicationTime
                      ? dayjs(data2?.applicationTime).format('YYYY-MM-DD')
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="审核备类型">
                    {data2?.reviewFilingType}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="备案目录分类">
                    {data2?.filingCatalogCategory}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目类型">
                    {data2?.projectType}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="建设性质">
                    {data2?.constructionNature}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目属性">
                    {data2?.projectAttribute}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="拟开工时间（年）">
                    {data2?.plannedStartYear}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="拟建成时间（年）">
                    {data2?.plannedEndYear}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="国标行业">
                    {data2?.nationalIndustryStandard}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="国标行业代码">
                    {data2?.nationalIndustryCode}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="管理行业">
                    {data2?.managementIndustry}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="建设地点" span={2}>
                    {data2?.constructionLocation}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="建设规模及内容" span={2}>
                    {data2?.constructionScaleAndContent}
                  </Descriptions.Item>

                  <Descriptions.Item labelStyle={{ width: '25%' }} label="总投资（万元）">
                    {data2?.totalInvestment}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="总投资说明">
                    {data2?.totalInvestmentDesc}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="用地面积（公顷）">
                    {data2?.landArea}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="新增用地面积（公顷）">
                    {data2?.newLandAreaSqm}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="农用地面积（公顷）">
                    {data2?.agriculturalLandArea}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目资本金（万元）">
                    {data2?.projectCapital}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="资金来源">
                    {data2?.fundingSource}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="财政资金来源">
                    {data2?.financialFundingSource}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="是否技改项目">
                    {data2?.isTechnicalReformProject}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="产业政策类型">
                    {data2?.industrialPolicyType}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="产业结构调整指导目录">
                    {data2?.industryAdjustmentGuidanceCatalog}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="是否属于房屋市政工程">
                    {data2?.isInfrastructureEngineering}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="是否同意投资平台为项目单位提供融资对接服务"
                  >
                    {data2?.agreeToProvideFinancingServices}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="法人单位">
                    {data2?.legalCompany}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="法人单位登记注册类型">
                    {data2?.legalCompanyRegistrationType}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="法人单位证照类型">
                    {data2?.legalCompanyDocumentType}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="法人单位证照号码">
                    {data2?.legalCompanyDocumentNumber}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="法人单位控股情况">
                    {data2?.legalCompanyHoldingSituation}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="法人单位联系人">
                    {data2?.legalCompanyContactName}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="法人单位手机号码">
                    {data2?.legalCompanyContactPhone}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="法人单位电子邮箱">
                    {data2?.legalCompanyContactEmail}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="法人单位法人代表姓名">
                    {data2?.legalCompanyLegalRepresentative}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="法人单位是否为该项目的控股单位"
                  >
                    {data2?.isLegalCompanyControllingForProject}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="申报单位">
                    {data2?.applicationCompany}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="申报单位登记注册类型">
                    {data2?.applicationCompanyRegistrationType}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="申报单位证照类型">
                    {data2?.applicationCompanyDocumentType}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="申报单位证照号码">
                    {data2?.applicationCompanyDocumentNumber}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="申报单位控股情况">
                    {data2?.applicationCompanyHoldingSituation}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="申报单位联系人">
                    {data2?.applicationCompanyContactName}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="申报单位手机号码">
                    {data2?.applicationCompanyContactPhone}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </GridContent>
          </div>
        )}

        {tabStatus.tabActiveKey === 'rule14' && (
          <div className={styles.main}>
            <GridContent>
              <Card
                title="报批信息"
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
                    label="是否涉及固定资产投资项目"
                  >
                    {data1?.isFixedAssetInvestmentLabel}
                  </Descriptions.Item>
                  <Descriptions.Item span={2} label="是否涉及建设用地">
                    {data1?.isConstructionLandLabel}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="建设用地规划许可证编号">
                    {data1?.constructionLandPlanningPermitNumber}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="取得许可证日期">
                    {data1?.permitObtainDate
                      ? dayjs(data1?.permitObtainDate).format('YYYY-MM-DD')
                      : ''}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目名称">
                    {data1?.projectName}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目代码">
                    {data3?.projectCode}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目详细地址">
                    {data3?.detailedAddress}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目地址-行政区划">
                    {data3?.administrativeDivision}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="工程代码">
                    {data3?.engineeringCode}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="立项部门">
                    {data3?.approvalDepartment}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="行业类别（国标行业）">
                    {data3?.industryCategoryLabel}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目类型">
                    {data3?.projectTypeLabel}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目投资来源">
                    {data3?.investmentSourceLabel}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="立项类型">
                    {data3?.approvalTypeLabel}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目资金属性">
                    {data3?.fundAttributeLabel}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="总投资额（万元）">
                    {data3?.totalInvestment}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="项目资本金（万元）">
                    {data3?.projectCapital}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="是否是亿元以上产业项目">
                    {data3?.isOverOneBillionIndustrialProject}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="是否是集中建设项目">
                    {data3?.isConcentratedBuildingProject}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="集中建设单位名称">
                    {data3?.concentratedBuilderName}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="集中建设单位统一社会信用代码"
                  >
                    {data3?.concentratedBuilderUscc}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ width: '25%' }}
                    label="集中建设单位法定代表人姓名"
                  >
                    {data3?.concentratedBuilderLegalRepresentative}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="单位类型">
                    {data3?.companyTypeLabel}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="企业名称">
                    {data3?.companyName}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="统一社会信用代码">
                    {data3?.uscc}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="法定代表人姓名">
                    {data3?.legalRepresentative}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="联系电话">
                    {data3?.contactPhone}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="土地是否带设计方案">
                    {data3?.hasDesignPlan}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="是否完成区域评估">
                    {data3?.regionalAssessmentCompleted}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="用地面积（㎡）">
                    {data3?.landAreaSqm}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="新增用地面积（㎡）">
                    {data3?.newLandAreaSqm}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="土地获取方式">
                    {data3?.landAcquisitionMethodLabel}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="建设性质">
                    {data3?.constructionNatureLabel}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="建设类型">
                    {data3?.constructionTypeLabel}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="总建筑面积（㎡）">
                    {data3?.totalFloorAreaSqm}
                  </Descriptions.Item>
                  <Descriptions.Item labelStyle={{ width: '25%' }} label="拟开工时间">
                    {data3?.plannedStartDate && dayjs(data3?.plannedStartDate).format('YYYY-MM-DD')}
                  </Descriptions.Item>
                  <Descriptions.Item span={2} label="拟建成时间">
                    {data3?.plannedCompletionDate &&
                      dayjs(data3?.plannedCompletionDate).format('YYYY-MM-DD')}
                  </Descriptions.Item>
                  <Descriptions.Item span={2} label="经度">
                    {data3?.longitude}
                  </Descriptions.Item>
                  <Descriptions.Item span={2} label="纬度">
                    {data3?.latitude}
                  </Descriptions.Item>
                  <Descriptions.Item span={2} label="建设内容（包括必要性）">
                    {data3?.constructionContent}
                  </Descriptions.Item>
                </Descriptions>
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
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <Descriptions.Item labelStyle={{ width: '25%' }} span={1} label="开工确认日期">
                    {data1?.startConfirmDate && dayjs(data1?.startConfirmDate).format('YYYY-MM-DD')}
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
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <Descriptions.Item labelStyle={{ width: '25%' }} span={1} label="竣工确认日期">
                    {data1?.endConfirmDate
                      ? dayjs(data1?.endConfirmDate).format('YYYY-MM-DD')
                      : '暂无数据'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </GridContent>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
export default ProjectAdvance;
