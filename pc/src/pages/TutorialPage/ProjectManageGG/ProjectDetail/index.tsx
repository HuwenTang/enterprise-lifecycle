import { GridContent, PageContainer } from '@ant-design/pro-components';
import {Card, Steps, Table, Tag} from 'antd';
import { FC, useEffect, useState, useMemo } from 'react';
import React from 'react';
import { useNavigate } from '@umijs/max';
import { primeApi } from '@/services/api';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { ProjectConstructionApprovalVo, SimpleValueDtoInteger, ProjectConstructionApprovalItemVo } from "@/services/apis";
import useStyles from './style.style';

type AdvancedState = {
  operationKey: 'tab1' | 'tab2' | 'tab3' | 'tab4';
  tabActiveKey: string;
};

const ProjectDetail: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [projectData, setProjectData] = useState<ProjectConstructionApprovalVo>();
  const [stageData, setStageData] = useState<SimpleValueDtoInteger>();
  const [itemData, setItemData] = useState<ProjectConstructionApprovalItemVo[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [statusNum, setStatusNum] = useState(0);
  const [list, setList] = useState([]);

  const breadcrumbList = [
    // { path: '/xmgl-gg', breadcrumbName: '工改项目' },
    // { path: '/xmgl-gg/detail', breadcrumbName: '项目详情' },
  ];

  // 阶段配置 - 参考 ProjectAdvance 的样式
  const [tabIcon, setTabIcon] = useState([
    {
      index: 0,
      key: 'stage1',
      tab: '立项用地',
      status: 'no',
      icon: '/mg/i1.png',
      icon1: '/mg/i1u.png',
      icon2: '/mg/i11.png'
    },
    {
      index: 1,
      key: 'stage2',
      tab: '工程建设',
      status: 'no',
      icon: '/mg/i2.png',
      icon1: '/mg/i2u.png',
      icon2: '/mg/i22.png'
    },
    {
      index: 2,
      key: 'stage3',
      tab: '施工许可',
      status: 'no',
      icon: '/mg/i3.png',
      icon1: '/mg/i3u.png',
      icon2: '/mg/i33.png'
    },
    {
      index: 3,
      key: 'stage4',
      tab: '竣工验收',
      status: 'no',
      icon: '/mg/i4.png',
      icon1: '/mg/i4u.png',
      icon2: '/mg/i44.png'
    },
  ]);

  const [tabStatus, setTabStatus] = useState<AdvancedState>({
    operationKey: 'tab1',
    tabActiveKey: 'stage1',
  });

  const onTabChange = (tabActiveKey: string) => {
    setTabStatus({
      ...tabStatus,
      tabActiveKey,
    });
  };

  // 根据 stage 分组数据
  const groupedItemData = useMemo(() => {
    const groups: { [key: number]: ProjectConstructionApprovalItemVo[] } = {};
    itemData.forEach(item => {
      const stage = item.stage || 0;
      if (!groups[stage]) {
        groups[stage] = [];
      }
      groups[stage].push(item);
    });
    return groups;
  }, [itemData]);

  const listProjectConstructionApprovalProcess =async (itemId:string)=>{
    const data = await primeApi.listProjectConstructionApprovalProcess({
      projectCode: projectData?.projectCode||'',
      itemCode: itemId
    });
    const l = data.records.map((item) => {
      return {
        title: item.taskName,
        description: (
          <div style={{ fontSize: '12px' }}>
            <div>
              <div style={{ color: '#333', marginBottom: '0.1rem' }} className={'title'}>
                {item.acceptor}
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
                      'processing'
                    }
                  >
                    {item.status}
                  </Tag>
                  {item.opinion}
                </div>
              </div>
            </div>
            <div>{dayjs(item.finishTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>
        ),
      };
    });
    setList(l)
  }
  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '办件名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string,record: ProjectConstructionApprovalItemVo) =>{
        return <a onClick={async () => {
          await listProjectConstructionApprovalProcess(record.itemCode||'')
        }}>{ text || '-'}</a>;
      },
    },
    {
      title: '办件时限',
      dataIndex: 'limitTime',
      key: 'limitTime',
      width: 80,
      align: 'center',
    },
    {
      title: '完成状态',
      dataIndex: 'result',
      key: 'result',
      align: 'center',
      width: 100,
      render: (text: string) => {
        if (text === '办结') {
          return <span style={{ color: '#52c41a' }}>办结</span>;
        } else if (text === '未办结') {
          return <span style={{ color: '#ff4d4f' }}>未办结</span>;
        }
        return text || '未办结';
      },
    },
    {
      title: '处理部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      render: (text: string) => text || '-',
    },
  ];


  // 获取项目详情数据
  const fetchProjectDetail = async () => {
    if (!id) return;

    try {
      setLoading(true);
      // 获取项目基本信息
      const projectRes = await primeApi.getProjectConstructionApproval({ id });
      setProjectData(projectRes);

      // 获取项目阶段信息 - 使用项目编号作为 code 参数
      const stageRes = await primeApi.getStage({ code: projectRes.projectCode });
      setStageData(stageRes);

      // 获取项目审批事项信息 - 使用项目编号作为 code 参数
      const itemRes = await primeApi.getItem({ code: projectRes.projectCode });
      setItemData(itemRes);

      // 根据阶段设置进度
      const currentStage = stageRes?.value || 0;
      setStatusNum(currentStage);

      // 根据 value 值设置 active 状态
      if (currentStage === 0) {
        setActive(-1); // value 为 0 时，没有激活状态
      } else {
        setActive(currentStage - 1); // value 对应的索引（value-1）
      }

      // 更新阶段状态 - 根据 value 值动态设置
      const updatedTabIcon = tabIcon.map((item) => {
        if (currentStage === 0) {
          // value 为 0 时，所有状态都为 'no'（置灰）
          return { ...item, status: 'no' };
        } else if (item.index < currentStage) {
          // value 不为 0 时，小于 currentStage 的为 'use'
          return { ...item, status: 'use' };
        } else {
          // 大于等于 currentStage 的为 'no'
          return { ...item, status: 'no' };
        }
      });
      setTabIcon(updatedTabIcon);

      // 设置当前激活的 tab
      if (currentStage > 0 && updatedTabIcon[currentStage - 1]) {
        setTabStatus({
          ...tabStatus,
          tabActiveKey: updatedTabIcon[currentStage - 1].key,
        });
      } else {
        // value 为 0 时，默认选中第一个 tab 但不激活
        setTabStatus({
          ...tabStatus,
          tabActiveKey: 'stage1',
        });
      }

    } catch (error) {
      console.error('获取项目详情失败:', error);
    } finally {
      setLoading(false);
    }
  };
  // 获取当前激活阶段的数据
  const getCurrentStageData = useMemo(() => {
    const currentStageIndex = active + 1; // active 是从0开始的索引，stage 是从1开始
    return groupedItemData[currentStageIndex] || [];
  }, [groupedItemData, active]);

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

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
            fontSize: '24px',
            padding: '30px 0 20px',
            fontWeight: 'bolder',
            color: '#333',
          }}
        >
          {projectData?.projectName || '加载中...'}
        </div>

        {/* 项目名称 */}
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '16px',
            padding: '10px 0 10px',
            fontWeight: 'bolder',
            color: '#666',
          }}
        >
          {`项目编码：${projectData?.projectCode || '暂无'}`}
        </div>
        {/* 进度条 */}
        <div
          style={{
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {tabIcon.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div
                  onClick={() => {
                    if (index > statusNum) {
                      return;
                    }
                    setActive(index);
                    setTabStatus({
                      ...tabStatus,
                      tabActiveKey: item.key,
                    });
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
                        {index !== 3 ? (
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
                              background: '#fff',
                            }}
                          ></div>
                        )}
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
                            background: index === 3 ? '#fff' : '#dbdbdb',
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
          <div style={{ width: '70%'}}>
            <Card
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              loading={loading}
            >
              {getCurrentStageData.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={getCurrentStageData.map((item, index) => ({
                    ...item,
                    key: `${active + 1}-${index}`,
                  }))}
                  pagination={false}
                  size="small"
                  bordered
                  style={{
                    // width: '60%',
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                  暂无审批事项数据
                </div>
              )}
            </Card>
          </div>
          <div style={{ width: '28%'}}>
            <Card
              title="办件时间轴"
              style={{
                marginBottom: 24,
              }}
              bordered={false}
            >
              <Steps
                direction="vertical"
                progressDot
                current={25}
                style={{ fontSize: '12px' }}
                items={list}
              />
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProjectDetail;
