import { InfoCircleOutlined } from '@ant-design/icons';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-components';
import { Card, Descriptions, Tooltip } from 'antd';
import { FC, useEffect } from 'react';
import React, { useState } from 'react';
import useStyles from './style.style';
import { useNavigate } from '@@/exports';
import { primeApi } from '@/services/api';
import dayjs from 'dayjs';

type AdvancedState = {
  operationKey: 'tab1' | 'tab2' | 'tab3';
  tabActiveKey: string;
};
const ProjectAdvance: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const breadcrumbList = [
    // { path: '/', breadcrumbName: '首页' },
    { path: '/xmgl', breadcrumbName: '项目管理' },
    { path: '/xmgl/xmjd', breadcrumbName: '项目详情' },
  ];
  const [active, setActive] = useState(5);

  const [data1, setData1] = useState({});
  const [data2, setData2] = useState();
  const [data3, setData3] = useState();
  const tabIcon = [
    {
      key: 'detail',
      tab: '在谈',
      status: 'use',
    },
    {
      key: 'rule',
      tab: '签约',
      status: 'use',
    },
    {
      key: 'rule1',
      tab: '注册',
      status: 'use',
    },
    {
      key: 'rule13',
      tab: '备案',
      status: 'use',
    },
    {
      key: 'rule14',
      tab: '报批',
      status: 'use',
    },
    {
      key: 'start',
      tab: '开工',
      status: 'use',
    },
    {
      key: 'end',
      tab: '竣工',
      status: 'no',
    },
  ];

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
    primeApi.getProjectDigitalInvestmentAttracting({id:'0'}).then((res) => {
      console.log(res);
      setData1(res);
    });
    primeApi.getProjectOnlineApproval({id:'0'}).then((res) => {
      setData2(res);
    });
    primeApi.getProjectConstructionApproval({id:'0'}).then((res) => {
      setData3(res);
    });
  }, []);
  return (
    <PageContainer
      style={{
        height: '90vh',
        overflow: 'auto',
        scrollbarWidth: 'none',
      }}
      breadcrumb={{
        routes: breadcrumbList,
        itemRender: (route, params, routes, paths) => {
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
      title={`项目名称：${data1?.projectName}`}
      // subTitle={`项目编码：${data1?.projectStatus}`}
      // extra={action}
      className={styles.pageHeader}
      // content={description}
      // extraContent={extra}
      tabActiveKey={tabStatus.tabActiveKey}
      // onTabChange={onTabChange}
      // tabList={[
      //   {
      //     key: 'detail',
      //     tab: '招商信息',
      //   },
      //   {
      //     key: 'rule',
      //     tab: '投资项目在线审批',
      //   },
      //   {
      //     key: 'rule1',
      //     tab: '工程建设审批',
      //   },{
      //     key: 'start',
      //     tab: '开工',
      //   },{
      //     key: 'end',
      //     tab: '竣工',
      //   },
      // ]}
    >
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {tabIcon.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                if (index === 6) {
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
                height: '44px',
              }}
            >
              {index === 0 ? (
                <div
                  style={{
                    backgroundImage:
                      active === index ? `url('/u10_selected.svg')` : `url('/u10.svg')`,
                    width: '144px',
                    height: '44px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: active === index ? '#fff' : '#666',
                    fontSize: '14px',
                    borderRadius: '4px',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {item.tab}
                </div>
              ) : (
                <div>
                  {item.status === 'use' && (
                    <div
                      style={{
                        backgroundImage:
                          active === index ? `url('/u11_selected.svg')` : `url('/u11.svg')`,
                        width: '144px',
                        height: '44px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: active === index ? '#fff' : '#666',
                        fontSize: '14px',
                        borderRadius: '4px',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {item.tab}
                    </div>
                  )}
                  {item.status === 'no' && (
                    <div
                      style={{
                        backgroundImage: `url('/u11_disabled.svg')`,
                        width: '144px',
                        height: '44px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff',
                        fontSize: '14px',
                        borderRadius: '4px',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {item.tab}
                    </div>
                  )}
                </div>
              )}
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
                <Descriptions.Item label="投资方">{data1?.investor}</Descriptions.Item>
                <Descriptions.Item label="项目总投资额（亿元）">
                  {data1?.totalInvestmentCny}
                </Descriptions.Item>
                <Descriptions.Item label="项目来源">{data1?.projectCategory}</Descriptions.Item>
                <Descriptions.Item label="洽谈进度">{data1?.negotiationProgress}</Descriptions.Item>
                <Descriptions.Item label="项目内容" span={2}>
                  {data1?.projectContent}
                </Descriptions.Item>
                <Descriptions.Item label="初次对接时间">2022年12月16日</Descriptions.Item>
                <Descriptions.Item label="市(区)">{data1?.districtName}</Descriptions.Item>
                <Descriptions.Item label="园区">{data1?.parkName}</Descriptions.Item>
                <Descriptions.Item label="厂房类型">{data1?.factoryType}</Descriptions.Item>
                <Descriptions.Item label="拟用地面积（平方米）">{data1?.plannedLandArea}</Descriptions.Item>
                <Descriptions.Item label="拟租厂房面积（平方米）">{data1?.plannedRentalFactoryArea}</Descriptions.Item>
                <Descriptions.Item label="拟购厂房面积（平方米）">{data1?.plannedPurchaseFactoryArea}</Descriptions.Item>
                <Descriptions.Item label="预计年销量（万元）">{data1?.expectedAnnualSales}</Descriptions.Item>
                <Descriptions.Item label="预计年税收（万元）">{data1?.expectedAnnualTax}</Descriptions.Item>

                {/*<Descriptions.Item label="投资金额（亿美元/亿元）">*/}
                {/*  {data1?.investmentAmount}*/}
                {/*</Descriptions.Item>*/}
                {/*  {data1?.registeredCapital}*/}
                {/*</Descriptions.Item>*/}
                {/*<Descriptions.Item label="入库时间">{data1?.entryTime&&dayjs(data1?.entryTime).format('YYYY-MM-DD')}</Descriptions.Item>*/}

                {/*<Descriptions.Item label="落地进度（签约、注册、备案等）">{data1?.landingProgress}</Descriptions.Item>*/}
                {/*<Descriptions.Item label="签约时间">{data1?.signingTime&&dayjs(data1?.signingTime).format('YYYY-MM-DD')}</Descriptions.Item>*/}
                {/*<Descriptions.Item label="签约合同">{data1?.signingContract}</Descriptions.Item>*/}
                {/*<Descriptions.Item label="项目总投资额（亿美元）">{data1?.projectLocation}</Descriptions.Item>*/}
                {/*<Descriptions.Item label="项目选址位置">{data1?.totalInvestmentUsd}</Descriptions.Item>*/}
              </Descriptions>
            </Card>

            {/*<Card*/}
            {/*  title="签约信息"*/}
            {/*  style={{*/}
            {/*    marginBottom: 24,*/}
            {/*  }}*/}
            {/*  bordered={false}*/}
            {/*>*/}
            {/*  <Descriptions*/}
            {/*    bordered*/}

            {/*    style={{*/}
            {/*      marginBottom: 24,*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <Descriptions.Item label="项目名称">{data1?.projectName}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="项目编号">{data1?.projectCode}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="市(区)">{data1?.district}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="所属板块">{data1?.park}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="国民经济行业分类">*/}
            {/*      {data1?.industryClassification}*/}
            {/*    </Descriptions.Item>*/}
            {/*    <Descriptions.Item label="国民经济分类">*/}
            {/*      {data1?.nationalEconomicClassification}*/}
            {/*    </Descriptions.Item>*/}
            {/*    <Descriptions.Item label="投资标识">{data1?.investmentFlag}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="当前项目进度">*/}
            {/*      {data1?.currentProjectProgress}*/}
            {/*    </Descriptions.Item>*/}
            {/*    <Descriptions.Item label="签约时间">{data1?.signingTime&&dayjs(data1?.signingTime).format('YYYY-MM-DD')}</Descriptions.Item>*/}
            {/*    /!*<Descriptions.Item label="签约合同">{data1?.signingContract}</Descriptions.Item>*!/*/}
            {/*    <Descriptions.Item label="主要投资方名称">{data1?.mainInvestorName}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="项目总投资额（亿元）">{data1?.totalInvestmentCny}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="项目总投资额（亿美元）">{data1?.projectLocation}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="国别/地区">{data1?.countryRegion}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="具体国别/地区">*/}
            {/*      {data1?.specificCountryRegion}*/}
            {/*    </Descriptions.Item>*/}
            {/*    <Descriptions.Item label="落地进度（签约、注册、备案等）">{data1?.landingProgress}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="是否为新引进企业">{data1?.isNewIntroducedEnterprise}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="项目评级（内资、外资；金额分级）">{data1?.projectRating}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="计划总投资（亿元）">{data1?.plannedTotalInvestment}</Descriptions.Item>*/}
            {/*  </Descriptions>*/}
            {/*</Card>*/}
            {/*<Card*/}
            {/*  title="公司注册"*/}
            {/*  style={{*/}
            {/*    marginBottom: 24,*/}
            {/*  }}*/}
            {/*  bordered={false}*/}
            {/*>*/}
            {/*  <Descriptions*/}
            {/*    bordered*/}

            {/*    style={{*/}
            {/*      marginBottom: 24,*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <Descriptions.Item label="注册公司名称">{data1?.companyName}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="统一社会信用代码">{data1?.uscc}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="注册资金（元）">{data1?.companyRegistrationFunds}</Descriptions.Item>*/}
            {/*    <Descriptions.Item label="注册信息统计日期">*/}
            {/*      {data1?.registrationInfoStatisticsDate&&dayjs(data1?.registrationInfoStatisticsDate).format('YYYY-MM-DD')}*/}
            {/*    </Descriptions.Item>*/}
            {/*    /!*<Descriptions.Item label="佐证资料（营业执照）">*!/*/}
            {/*    /!*  {data1?.certificateDataBusinessLicense}*!/*/}
            {/*    /!*</Descriptions.Item>*!/*/}

            {/*    /!*<Descriptions.Item label="佐证资料（项目备案（核准）文件）">*!/*/}
            {/*    /!*  {data1?.certificateDataProjectFilingApprovalFile}*!/*/}
            {/*    /!*</Descriptions.Item>*!/*/}

            {/*  </Descriptions>*/}
            {/*</Card>*/}
            {/*<Card*/}
            {/*  title="备案信息"*/}
            {/*  style={{*/}
            {/*    marginBottom: 24,*/}
            {/*  }}*/}
            {/*  bordered={false}*/}
            {/*>*/}
            {/*  <Descriptions*/}
            {/*    bordered*/}

            {/*    style={{*/}
            {/*      marginBottom: 24,*/}
            {/*    }}*/}
            {/*  >*/}

            {/*    <Descriptions.Item label="备案信息统计日期">*/}
            {/*      {data1?.filingInfoStatisticsDate&&dayjs(data1?.filingInfoStatisticsDate).format('YYYY-MM-DD')}*/}
            {/*    </Descriptions.Item>*/}
            {/*  </Descriptions>*/}
            {/*</Card>*/}

            {/*<Card*/}
            {/*  title="报批信息"*/}
            {/*  style={{*/}
            {/*    marginBottom: 24,*/}
            {/*  }}*/}
            {/*  bordered={false}*/}
            {/*>*/}
            {/*  <Descriptions*/}
            {/*    bordered*/}

            {/*    style={{*/}
            {/*      marginBottom: 24,*/}
            {/*    }}*/}
            {/*  >*/}

            {/*    <Descriptions.Item  label="完成报批统计日期">*/}
            {/*      {data1?.completionReportStatisticsDate&&dayjs(data1?.completionReportStatisticsDate).format('YYYY-MM-DD')}*/}
            {/*    </Descriptions.Item>*/}
            {/*    /!*<Descriptions.Item label="佐证资料">{data1?.certificateData}</Descriptions.Item>*!/*/}
            {/*  </Descriptions>*/}
            {/*</Card>*/}

            {/*<Card*/}
            {/*  title="开工信息"*/}
            {/*  style={{*/}
            {/*    marginBottom: 24,*/}
            {/*  }}*/}
            {/*  bordered={false}*/}
            {/*>*/}
            {/*  <Descriptions*/}
            {/*    bordered*/}

            {/*    style={{*/}
            {/*      marginBottom: 24,*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <Descriptions.Item label="开工确认日期">*/}
            {/*      {data1?.startConfirmDate&&dayjs(data1?.startConfirmDate).format('YYYY-MM-DD')}*/}
            {/*    </Descriptions.Item>*/}

            {/*  </Descriptions>*/}
            {/*</Card>*/}

            {/*<Card*/}
            {/*  title="竣工信息"*/}
            {/*  style={{*/}
            {/*    marginBottom: 24,*/}
            {/*  }}*/}
            {/*  bordered={false}*/}
            {/*>*/}
            {/*  <Descriptions*/}
            {/*    bordered*/}

            {/*    style={{*/}
            {/*      marginBottom: 24,*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <Descriptions.Item label="竣工确认日期">*/}
            {/*      {data1?.endConfirmDate&&dayjs(data1?.endConfirmDate).format('YYYY-MM-DD')}*/}
            {/*    </Descriptions.Item>*/}
            {/*  </Descriptions>*/}
            {/*</Card>*/}
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
                <Descriptions.Item label="市(区)">{data1?.districtName}</Descriptions.Item>
                <Descriptions.Item label="园区">{data1?.parkName}</Descriptions.Item>
                <Descriptions.Item label="项目名称"> {data2?.projectName}</Descriptions.Item>
                <Descriptions.Item label="项目类别">
                  {data2?.filingCatalogCategory}
                </Descriptions.Item>
                <Descriptions.Item label="总投资（万元）">
                  {data2?.totalInvestment}
                </Descriptions.Item>
                <Descriptions.Item label="协议利用外资">{data1?.agreementForeignDirectInvestment}</Descriptions.Item>
                <Descriptions.Item label="项目类型">{data2?.projectType}</Descriptions.Item>
                <Descriptions.Item label="产业大类名称">{data1?.industryMajorClassName}</Descriptions.Item>
                <Descriptions.Item label="行业编码"> </Descriptions.Item>
                <Descriptions.Item label="所属行业">{data1?.belongingIndustry}</Descriptions.Item>
                <Descriptions.Item label="投资方名称">{data1?.mainInvestorName}</Descriptions.Item>
                <Descriptions.Item label="投资方性质">{data1?.investorNature}</Descriptions.Item>
                <Descriptions.Item label="投资方注册地"> </Descriptions.Item>
                <Descriptions.Item label="签约日期"> </Descriptions.Item>
                <Descriptions.Item label="项目内容" span={2}>
                  {data1?.projectContent}
                </Descriptions.Item>
                <Descriptions.Item label="是否为新引进企业">
                  {data1?.isNewIntroducedEnterprise}
                </Descriptions.Item>
                <Descriptions.Item label="是否为世界500强或全球专业领域行业龙头企业">
                  {data1?.isWorldTop500OrLeadingGlobalCompany?"是":"否"}
                </Descriptions.Item>
                <Descriptions.Item label="是否为国内100强或国内行业排名前100企业">
                  {data1.isDomesticTop500OrTop100Company===true?'是1':data1.isDomesticTop500OrTop100Company===false?'否1':''}
                </Descriptions.Item>
                <Descriptions.Item label="是否为上市公司或上市辅导期企业">{data1?.isPubliclyTradedOrPreIPOCompany?"是":"否"}</Descriptions.Item>
                <Descriptions.Item label="是否为瞪羚、专精特新、独角兽企业">{data1?.isUnicornStartup?"是":"否"}</Descriptions.Item>
                <Descriptions.Item label="已投资项目对属地政府亩均税收（万元）">
                  {data1?.averageTaxPerMuOfExistingInvestment}
                </Descriptions.Item>
                <Descriptions.Item label="主要客户">{data1?.majorCustomers}</Descriptions.Item>
                <Descriptions.Item label="计划总投资（亿元）">
                  {data1?.plannedTotalInvestment}
                </Descriptions.Item>
                <Descriptions.Item label="固定资产投资（万元）">{data1?.isFixedAssetInvestment}</Descriptions.Item>
                <Descriptions.Item label="设备投资（万元）">{data1?.equipmentInvestment}</Descriptions.Item>
                <Descriptions.Item label="注册资本">{data1?.registeredCapital}</Descriptions.Item>
                <Descriptions.Item label="计划开工时间">{data1?.plannedStartTime&&dayjs(data1?.plannedStartTime).format('YYYY-MM-DD')}</Descriptions.Item>
                <Descriptions.Item label="项目使用主要原、辅材料">{data1?.mainRawMaterialsUsed}</Descriptions.Item>
                <Descriptions.Item label="主要流程工艺">{data1?.mainProcessTechnology}</Descriptions.Item>
                <Descriptions.Item label="是否为新供地项目">
                  {data1?.isNewSupplyLandProject===true&&'是'}
                  {data1?.isNewSupplyLandProject===false&&'否'}
                  {data1?.isNewSupplyLandProject===null&&''}
                </Descriptions.Item>
                <Descriptions.Item label="项目选址位置">{data1?.projectLocation}</Descriptions.Item>
                <Descriptions.Item label="申请用地面积（亩）">{data1?.appliedLandArea}</Descriptions.Item>
                <Descriptions.Item label="行业是否属于高新技术产业分类目录">{data1?.isHighTechIndustry?"是":"否"}</Descriptions.Item>
                <Descriptions.Item label="是否为高技术项目">{data1?.isHighTechProject?"是":"否"}</Descriptions.Item>
                <Descriptions.Item label="是否为国家工业战略性新兴产业">{data1?.isNationalStrategicEmergingIndustry?"是":"否"}</Descriptions.Item>
                <Descriptions.Item label="容积率（%）">{data1?.plotRatioPercent}</Descriptions.Item>
                <Descriptions.Item label="预期开票销售（万元）">{data1?.expectedInvoiceSales}</Descriptions.Item>
                <Descriptions.Item label="预期税收（万元）">{data1?.expectedTax}</Descriptions.Item>
                <Descriptions.Item label="预期用工人数（人）">{data1?.expectedEmployeeCount}</Descriptions.Item>
                <Descriptions.Item label="固定资产投资占比（%）">{data1?.fixedAssetInvestmentPercentage}</Descriptions.Item>
                <Descriptions.Item label="投资强度（万元/千平方米）">{data1?.investmentIntensity}</Descriptions.Item>
                <Descriptions.Item label="预期亩均税收（万元/千平方米）">{data1?.expectedAverageTax}</Descriptions.Item>
                <Descriptions.Item
                  label="是否有产生废水和挥发性有机废水排放">{data1?.wastewaterBy1?"是":"否"}</Descriptions.Item>
                <Descriptions.Item label="产生废水是否含氮、磷或使用高挥发性有机化合物含量涂料、油墨、胶粘剂">{data1?.wastewaterBy2?"是":"否"}</Descriptions.Item>
                <Descriptions.Item label="总能耗">{data1?.totalEnergyConsumption}</Descriptions.Item>
                <Descriptions.Item label="项目是否含有研发团队、产学研合作及研发机构建设内容">{data1?.hasRndTeamAndCooperation?"是":"否"}</Descriptions.Item>
                <Descriptions.Item label="项目是否拥有相关有效发明专利">{data1?.hasValidPatents?"是":"否"}</Descriptions.Item>
                <Descriptions.Item label="是否拟列入重点活动签约项目库">{data1?.isListedAsKeyActivitySigningProject?"是":"否"}</Descriptions.Item>
                <Descriptions.Item label="是否为招商会项目">{data1?.isRecruitmentFairProject}</Descriptions.Item>
                <Descriptions.Item label="招商会名称">{data1?.recruitmentFairName}</Descriptions.Item>
                <Descriptions.Item span={2} label="预计年销售（万元）">{data1?.expectedAnnualSalesAmount}</Descriptions.Item>
                <Descriptions.Item span={2} label="备注">{data1?.remarks}</Descriptions.Item>
                {/*<Descriptions.Item label="立项时间">{data2?.approvalTime}</Descriptions.Item>*/}
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
                    <Descriptions.Item label="统一社会信用代码">{data1?.uscc}</Descriptions.Item>
                    <Descriptions.Item label="注册公司名称">{data1?.companyName}</Descriptions.Item>
                    <Descriptions.Item label="注册资金（亿元）">{data1?.companyRegistrationFunds}</Descriptions.Item>
                    <Descriptions.Item label="注册日期">{data1?.companyRegistrationDate&&dayjs(data1?.companyRegistrationDate).format('YYYY-MM-DD')}</Descriptions.Item>
                {/*<Descriptions.Item label="项目代码">{data3?.projectCode}</Descriptions.Item>*/}
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
                      <Descriptions.Item label="备案（核准）项目名称">
                        {data1?.filingApprovalProjectName}
                      </Descriptions.Item>
                      <Descriptions.Item label="备案（核准）投资总额（亿元）">
                        {data1?.filingApprovalInvestmentTotal}
                      </Descriptions.Item>
                      <Descriptions.Item label="备案（核准）日期">
                        {data1?.filingApprovalDate&&dayjs(data1?.filingApprovalDate).format('YYYY-MM-DD')}
                      </Descriptions.Item>
                    <Descriptions.Item label="项目审批类型">{data2?.approvalType}</Descriptions.Item>
                    <Descriptions.Item label="备案目录">{data2?.filingCatalog}</Descriptions.Item>
                    <Descriptions.Item label="项目名称">{data1?.projectName}</Descriptions.Item>
                <Descriptions.Item label="主项目名称">{data2?.mainProjectName}</Descriptions.Item>
                <Descriptions.Item label="是否补办项目"> </Descriptions.Item>
                <Descriptions.Item label="项目代码">{data2?.projectCode}</Descriptions.Item>
                <Descriptions.Item label="申报时间">
                  {data2?.isSupplementaryProject}
                </Descriptions.Item>
                <Descriptions.Item label="审核备类型">{data2?.reviewFilingType}</Descriptions.Item>
                <Descriptions.Item label="备案目录分类">
                  {data2?.filingCatalogCategory}
                </Descriptions.Item>
                <Descriptions.Item label="项目类型">{data2?.projectType}</Descriptions.Item>
                <Descriptions.Item label="建设性质">{data2?.constructionNature}</Descriptions.Item>
                <Descriptions.Item label="项目属性">{data2?.projectAttributes}</Descriptions.Item>
                <Descriptions.Item label="拟开工时间（年）">
                  {data2?.plannedStartYear}
                </Descriptions.Item>
                <Descriptions.Item label="拟建成时间（年）">
                  {data2?.plannedEndYear}
                </Descriptions.Item>
                <Descriptions.Item label="国标行业">
                  {data2?.nationalIndustryStandard}
                </Descriptions.Item>
                <Descriptions.Item label="国标行业代码">
                  {data2?.nationalIndustryCode}
                </Descriptions.Item>
                <Descriptions.Item label="管理行业">
                  {data2?.managementIndustry}
                </Descriptions.Item>
                <Descriptions.Item label="建设地点" span={2}>
                  {data2?.constructionLocation}
                </Descriptions.Item>
                <Descriptions.Item label="建设规模及内容" span={2}>
                  {data2?.constructionScaleAndContent}
                </Descriptions.Item>

                <Descriptions.Item label="总投资（万元）">
                  {data2?.totalInvestment}
                </Descriptions.Item>
                <Descriptions.Item label="总投资说明">
                  {data2?.totalInvestmentDesc}
                </Descriptions.Item>
                <Descriptions.Item label="用地面积（公顷）">{data2?.landArea}</Descriptions.Item>
                <Descriptions.Item label="新增用地面积（公顷）">
                  {data2?.newLandAreaSqm}
                </Descriptions.Item>
                <Descriptions.Item label="农用地面积（公顷）">
                  {data2?.agriculturalLandArea}
                </Descriptions.Item>
                <Descriptions.Item label="项目资本金（万元）">
                  {data2?.projectCapital}
                </Descriptions.Item>
                <Descriptions.Item label="资金来源">{data2?.fundingSource}</Descriptions.Item>
                <Descriptions.Item label="财政资金来源">
                  {data2?.financialFundingSource}
                </Descriptions.Item>
                <Descriptions.Item label="是否技改项目">
                  {data2?.isTechnicalReformProject}
                </Descriptions.Item>
                <Descriptions.Item label="产业政策类型">
                  {data2?.industrialPolicyType}
                </Descriptions.Item>
                <Descriptions.Item label="产业结构调整指导目录">
                  {data2?.industryAdjustmentGuidanceCatalog}
                </Descriptions.Item>
                <Descriptions.Item label="是否属于房屋市政工程">
                  {data2?.isInfrastructureEngineering}
                </Descriptions.Item>
                <Descriptions.Item label="是否同意投资平台为项目单位提供融资对接服务">
                  {data2?.agreeToProvideFinancingServices}
                </Descriptions.Item>
                <Descriptions.Item label="法人单位">{data2?.legalCompany}</Descriptions.Item>
                <Descriptions.Item label="法人单位登记注册类型">
                  {data2?.legalCompanyRegistrationType}
                </Descriptions.Item>
                <Descriptions.Item label="法人单位证照类型">
                  {data2?.legalCompanyDocumentType}
                </Descriptions.Item>
                <Descriptions.Item label="法人单位证照号码">
                  {data2?.legalCompanyDocumentNumber}
                </Descriptions.Item>
                <Descriptions.Item label="法人单位控股情况">
                  {data2?.legalCompanyHoldingSituation}
                </Descriptions.Item>
                <Descriptions.Item label="法人单位联系人">
                  {data2?.legalCompanyContactName}
                </Descriptions.Item>
                <Descriptions.Item label="法人单位手机号码">
                  {data2?.legalCompanyContactPhone}
                </Descriptions.Item>
                <Descriptions.Item label="法人单位电子邮箱">
                  {data2?.legalCompanyContactEmail}
                </Descriptions.Item>
                <Descriptions.Item label="法人单位法人代表姓名">
                  {data2?.legalCompanyLegalRepresentative}
                </Descriptions.Item>
                <Descriptions.Item label="法人单位是否为该项目的控股单位">
                  {data2?.isLegalCompanyControllingForProject}
                </Descriptions.Item>
                <Descriptions.Item label="申报单位">{data2?.applicationCompany}</Descriptions.Item>
                <Descriptions.Item label="申报单位登记注册类型">
                  {data2?.applicationCompanyRegistrationType}
                </Descriptions.Item>
                <Descriptions.Item label="申报单位证照类型">
                  {data2?.applicationCompanyDocumentType}
                </Descriptions.Item>
                <Descriptions.Item label="申报单位证照号码">
                  {data2?.applicationCompanyDocumentNumber}
                </Descriptions.Item>
                <Descriptions.Item label="申报单位控股情况">
                  {data2?.applicationCompanyHoldingSituation}
                </Descriptions.Item>
                <Descriptions.Item label="申报单位联系人">
                  {data2?.applicationCompanyContactName}
                </Descriptions.Item>
                <Descriptions.Item label="申报单位手机号码">
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
                    <Descriptions.Item label="是否涉及固定资产投资项目">
                      {data1?.isFixedAssetInvestment}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="是否涉及建设用地">
                      {data1?.isConstructionLand}
                    </Descriptions.Item>
                    <Descriptions.Item label="建设用地规划许可证编号">
                      {data1?.constructionLandPlanningPermitNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="取得许可证日期">
                      {data1?.permitObtainDate?dayjs(data1?.permitObtainDate).format('YYYY-MM-DD'):''}
                    </Descriptions.Item>
                    <Descriptions.Item label="项目名称">{data1?.projectName}</Descriptions.Item>
                    <Descriptions.Item label="项目代码">{data3?.projectCode}</Descriptions.Item>
                    <Descriptions.Item label="项目详细地址">{data3?.detailedAddress}</Descriptions.Item>
                    <Descriptions.Item label="项目地址-行政区划">
                      {data3?.administrativeDivision}
                    </Descriptions.Item>
                <Descriptions.Item label="工程代码">{data3?.engineeringCode}</Descriptions.Item>
                <Descriptions.Item label="立项部门">{data3?.approvalDepartment}</Descriptions.Item>
                <Descriptions.Item label="行业类别（国标行业）">
                  {data3?.industryCategoryLabel}
                </Descriptions.Item>
                <Descriptions.Item label="项目类型">{data3?.projectType}</Descriptions.Item>
                <Descriptions.Item label="项目投资来源">
                  {data3?.investmentSourceLabel}
                </Descriptions.Item>
                <Descriptions.Item label="立项类型">{data3?.approvalTypeLabel}</Descriptions.Item>
                <Descriptions.Item label="项目资金属性">{data3?.fundAttributeLabel}</Descriptions.Item>
                <Descriptions.Item label="总投资额（万元）">
                  {data3?.totalInvestment}
                </Descriptions.Item>
                <Descriptions.Item label="项目资本金（万元）">
                  {data3?.projectCapital}
                </Descriptions.Item>
                <Descriptions.Item label="是否是亿元以上产业项目">
                  {data3?.isOverOneBillionIndustrialProject}
                </Descriptions.Item>
                <Descriptions.Item label="是否是集中建设项目">
                  {data3?.isConcentratedBuildingProject}
                </Descriptions.Item>
                <Descriptions.Item label="集中建设单位名称">
                  {data3?.concentratedBuilderName}
                </Descriptions.Item>
                <Descriptions.Item label="集中建设单位统一社会信用代码">
                  {data3?.concentratedBuilderUscc}
                </Descriptions.Item>
                <Descriptions.Item label="集中建设单位法定代表人姓名">
                  {data3?.concentratedBuilderLegalRepresentative}
                </Descriptions.Item>
                <Descriptions.Item label="单位类型">{data3?.companyTypeLabel}</Descriptions.Item>
                <Descriptions.Item label="企业名称">{data3?.companyName}</Descriptions.Item>
                <Descriptions.Item label="统一社会信用代码">{data3?.uscc}</Descriptions.Item>
                <Descriptions.Item label="法定代表人姓名">
                  {data3?.legalRepresentative}
                </Descriptions.Item>
                <Descriptions.Item label="联系电话">{data3?.contactPhone}</Descriptions.Item>
                <Descriptions.Item label="土地是否带设计方案">
                  {data3?.hasDesignPlan}
                </Descriptions.Item>
                <Descriptions.Item label="是否完成区域评估">
                  {data3?.regionalAssessmentCompleted}
                </Descriptions.Item>
                <Descriptions.Item label="用地面积（㎡）">{data3?.landAreaSqm}</Descriptions.Item>
                <Descriptions.Item label="新增用地面积（㎡）">
                  {data3?.newLandAreaSqm}
                </Descriptions.Item>
                <Descriptions.Item label="土地获取方式">
                  {data3?.landAcquisitionMethodLabel}
                </Descriptions.Item>
                <Descriptions.Item label="建设性质">{data3?.constructionNatureLabel}</Descriptions.Item>
                <Descriptions.Item label="建设类型">{data3?.constructionTypeLabel}</Descriptions.Item>
                <Descriptions.Item label="总建筑面积（㎡）">
                  {data3?.totalFloorAreaSqm}
                </Descriptions.Item>
                <Descriptions.Item label="拟开工时间">
                  {data3?.plannedStartDate && dayjs(data3?.plannedStartDate).format('YYYY-MM-DD')}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="拟建成时间">
                  {data3?.plannedCompletionDate &&
                    dayjs(data3?.plannedCompletionDate).format('YYYY-MM-DD')}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="经度">{data3?.longitude}</Descriptions.Item>
                <Descriptions.Item span={2} label="纬度">{data3?.latitude}</Descriptions.Item>
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
                <Descriptions.Item span={1} label="开工确认日期">
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
                <Descriptions.Item span={1} label="竣工确认日期">
                  {data1?.endConfirmDate
                    ? dayjs(data1?.endConfirmDate).format('YYYY-MM-DD')
                    : '暂无数据'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </GridContent>
        </div>
      )}
    </PageContainer>
  );
};
export default ProjectAdvance;
