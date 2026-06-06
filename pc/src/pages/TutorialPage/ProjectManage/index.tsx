import type { ColumnsType } from 'antd/es/table';
import { Form, FormProps, message, Pagination, Table, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { primeApi, systemApi } from '@/services/api';
import { useNavigate } from "@umijs/max";
import { DataDashboardListProjectDigitalInvestmentAttractingRequest } from "@/services/apis";
import { useSearchParams } from "react-router-dom";

type FieldType = {
  projectCode?: string;
  projectName?: string;
  currentProjectProgress?: string[]; // 修改为字符串数组
  rProgress?: ''; // 修改为字符串数组
  projectContent?: string;
  investmentAmount?: string;
  year?: string;
  attractorUnit?: string;
  content?: string;
  amount?: string;
  grantForTaizhengtong?: boolean;
  roles?: string[];
};

const ProjectManage = () => {
  const [form] = Form.useForm();

  // 分页和筛选状态
  const [searchParams, setSearchParams] = useSearchParams();

  // 参数初始化状态
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const initialProjectCode = searchParams.get('projectCode') || '';
  const initialProjectName = searchParams.get('projectName') || '';
  const initialCurrentProjectProgress = searchParams.get('currentProjectProgress')
    ? searchParams.get('currentProjectProgress')!.split(',')
    : [];
  const initialRProgressStr = searchParams.get('rProgress') || '';
  // 解析 rProgress：URL 中为逗号分隔字符串，如 '0,1,5,4' 或 '2,3'
  const initialRProgressArray = initialRProgressStr
    ? initialRProgressStr.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const initialProjectContent = searchParams.get('projectContent') || '';
  const initialYear = searchParams.get('year') || undefined;
  const initialAttractorUnit = searchParams.get('attractorUnit') || '';

  // 新增参数
  const initialCurrStartDate = searchParams.get('currStartDate') || '';
  const initialCurrEndDate = searchParams.get('currEndDate') || '';
  const initialCurrDate = searchParams.get('currDate') || '';
  const initialDistrict = searchParams.get('district') || '';
  const initialPark = searchParams.get('park') || '';
  const initialProjectType = searchParams.get('projectType') || '';
  const initialIsKcProj = searchParams.get('isKcProj') || '';
  const initialIsIndustryChainProject = searchParams.get('isIndustryChainProject') === 'true';
  const initialProjectRating = searchParams.get('projectRating') || '';
  const initialSignedProject = searchParams.get('signedProject') === 'true' ? true : undefined;
  const initialInvestmentFlag = searchParams.get('investmentFlag') || '';
  const initialInvestmentAmount = searchParams.get('investmentAmount') ? parseFloat(searchParams.get('investmentAmount')!) : undefined;
  const initialProjectCategory = searchParams.get('projectCategory') || '';
  const initialShowAll = searchParams.get('showAll') === 'true' ? true : undefined;
  const initialIsCityKey = searchParams.get('isCityKey') || '';

  // 自定义金额范围参数
  const initialRmb1 = searchParams.get('rmb1') ? parseFloat(searchParams.get('rmb1')!) : undefined;
  const initialRmb2 = searchParams.get('rmb2') ? parseFloat(searchParams.get('rmb2')!) : undefined;
  const initialDoller1 = searchParams.get('doller1') ? parseFloat(searchParams.get('doller1')!) : undefined;
  const initialDoller2 = searchParams.get('doller2') ? parseFloat(searchParams.get('doller2')!) : undefined;

  // 记录来源页面
  const initialFromPage = searchParams.get('fromPage') || '';

  const navigate = useNavigate();

  // 分页状态管理，与 URL 参数同步
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialPageSize,
    total: 0
  });

  // 数据源
  const [dataSource, setDataSource] = useState<any[]>([]);

  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);

  // 项目状态字典（表单取消注释后使用）
  const [, setProgressDict] = useState<{ code: string, label: string, enabled: boolean, sort: number, value: string }[]>([]);

  // 获取字典数据
  const fetchDict = async () => {
    try {
      const res = await systemApi.getDictItems({ catalog: 'project_progress' });
      if (res && Array.isArray(res)) {
        setProgressDict(res.filter(item => item.enabled));
      }
    } catch (error) {
      console.error('获取字典数据失败:', error);
      message.error('获取字典数据失败');
    }
  };

  // 更新 URL 参数
  const updateUrlParams = (params: {
    page?: number;
    pageSize?: number;
    projectCode?: string;
    projectName?: string;
    currentProjectProgress?: string[];
    rProgress?: string | string[];
    projectContent?: string;
    year?: string;
    attractorUnit?: string;
  }) => {
    const newParams = new URLSearchParams(searchParams);

    if (params.page !== undefined) newParams.set('page', params.page.toString());
    if (params.pageSize !== undefined) newParams.set('pageSize', params.pageSize.toString());
    if (params.projectCode !== undefined) newParams.set('projectCode', params.projectCode);
    if (params.projectName !== undefined) newParams.set('projectName', params.projectName);
    if (params.currentProjectProgress !== undefined) {
      newParams.set('currentProjectProgress', params.currentProjectProgress.join(','));
    }
    if (params.rProgress !== undefined) {
      const rProgressStr = Array.isArray(params.rProgress) ? params.rProgress.join(',') : params.rProgress;
      newParams.set('rProgress', rProgressStr);
    }
    if (params.projectContent !== undefined) newParams.set('projectContent', params.projectContent);
    if (params.year !== undefined) newParams.set('year', params.year);
    if (params.attractorUnit !== undefined) newParams.set('attractorUnit', params.attractorUnit);
    setSearchParams(newParams);
  };

  // 表格列定义
  const TitleCom = ({ text, icon }: { text: string; icon: string }) => {
    return (
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img style={{ width: '10px', marginRight: '5px' }} src={icon} alt="" />
        <div>{text}</div>
      </div>
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: <TitleCom text={'序号'} icon={'/mg/icon1.png'} />,
      dataIndex: 'index',
      width: 80,
      render: (_: any, record: any, index: any) => {
        return index + 1;
      },
      align: 'center' as const,
    },
    {
      title: <TitleCom text={'项目名称'} icon={'/mg/icon6.png'} />,
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'left' as const,
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text={'项目内容'} icon={'/mg/icon7.png'} />,
      dataIndex: 'projectContent',
      align: 'left' as const,
      key: 'projectContent',
      width: 200,
      ellipsis: true,
      render: (text: any) => (
        <span style={{ textAlign: 'left' }} title={text}>
          {text}
        </span>
      ),
    },
    {
      title: <TitleCom text={'所属板块'} icon={'/mg/icon2.png'} />,
      dataIndex: 'parkName',
      align: 'left' as const,
      ellipsis: true,
      key: 'parkName',
      width: 120,
    },
    {
      title: <TitleCom text={'项目状态'} icon={'/mg/icon5.png'} />,
      dataIndex: 'currentProjectProgressLabel',
      key: 'currentProjectProgressLabel',
      align: 'center' as const,
      width: 100,
      render: (text: any) => {
        if (text) {
          if (text.includes('在谈')) {
            return <Tag color="#FF7F50">{text}</Tag>;
          } else if (text.includes('签约')) {
            return <Tag color="#3CB371">{text}</Tag>;
          } else if (text.includes('注册')) {
            return <Tag color="#4169E1">{text}</Tag>;
          } else if (text.includes('备案')) {
            return <Tag color="#9370DB">{text}</Tag>;
          } else if (text.includes('开工')) {
            return <Tag color="#FF4500">{text}</Tag>;
          } else if (text.includes('报批')) {
            return <Tag color="#FF4500">{text}</Tag>;
          } else if (text.includes('竣工')) {
            return <Tag color="#708090">{text}</Tag>;
          } else {
            return <Tag color="blue">-</Tag>;
          }
        } else {
          return <Tag color="blue">-</Tag>;
        }
      },
    },
    {
      title: <TitleCom text={'投资额'} icon={'/mg/icon2.png'} />,
      dataIndex: 'investmentAmount',
      key: 'investmentAmount',
      align: 'center' as const,
      width: 150,
      render: (text: any, record: any) => {
        const investmentFlagLabel = record.investmentFlagLabel;
        let value: number | null = null;
        let unit: string = '';

        if (investmentFlagLabel === '内资') {
          value = record.totalInvestmentCny;
          unit = '亿元';
        } else if (investmentFlagLabel === '外资') {
          value = record.totalInvestmentUsd;
          unit = '亿美元';
        }

        if (value !== null && value !== undefined) {
          // 格式化数字，保留2位小数
          const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
          return `${formattedValue}${unit}`;
        }
        return '-';
      },
    },
    // {
    //   title: <TitleCom text={'项目动态'} icon={'/mg/icon7.png'} />,
    //   key: 'projectDynamics',
    //   dataIndex: 'projectDynamics',
    //   width: 120,
    //   align: 'center' as const,
    // },
    {
      title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      align: 'center' as const,
      width: 150,
      minWidth: 100,
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '85px',
                  height: '28px',
                  background: '#1890FF',
                  borderRadius: '14px',
                  fontSize: '14px',
                  color: '#fff',
                }}
                key="down"
                onClick={() => {
                  if (record.currentProjectProgress) {
                    // 传递当前页码到详情页，以便返回时使用
                    navigate(`/tutorial/project-advance?id=${record.id}&fromPage=${pagination.current}`);
                  } else {
                    message.info('当前项目暂无进度');
                  }
                }}
              >
                <div>详情</div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  // 获取数据（params 可包含 API 未声明的扩展参数，如 projectCode、projectName 等）
  const fetchData = async (params: DataDashboardListProjectDigitalInvestmentAttractingRequest & Record<string, unknown>) => {
    console.log('params---', params);
    setLoading(true); // 设置加载状态为true
    try {
      const data = await primeApi.dataDashboardListProjectDigitalInvestmentAttracting(params as DataDashboardListProjectDigitalInvestmentAttractingRequest);
      console.log(data);

      setPagination({
        ...pagination,
        total: data.total,
        current: data.page,
        pageSize: data.size,
      });

      console.log('data', data.records);
      setDataSource(data.records);
    } catch (error) {
      console.error('获取项目数据失败:', error);
      message.error('获取项目数据失败');
    } finally {
      setLoading(false); // 设置加载状态为false
    }
  };

  // 初始化表单值
  useEffect(() => {
    // 更新分页状态
    setPagination({
      ...pagination,
      current: 1,
    });
    form.setFieldsValue({
      projectCode: initialProjectCode,
      projectName: initialProjectName,
      currentProjectProgress: initialCurrentProjectProgress,
      rProgress: initialRProgressStr,
      projectContent: initialProjectContent,
      year: initialYear,
      attractorUnit: initialAttractorUnit,
    });
  }, []);

  // 初始数据加载
  useEffect(() => {
    fetchData({
      showAll: initialShowAll !== undefined ? initialShowAll : true,
      projectCode: initialProjectCode,
      projectName: initialProjectName,
      // openapi 生成的接口将 currentProjectProgress 标记为必传数组
      currentProjectProgress: initialCurrentProjectProgress,
      rprogress: initialRProgressArray,
      rProgress: initialRProgressArray.length > 0 ? initialRProgressArray : undefined,
      projectContent: initialProjectContent,
      year: initialYear ? parseInt(initialYear) : undefined,
      attractorUnit: initialAttractorUnit,
      currStartDate: initialCurrStartDate || undefined,
      currEndDate: initialCurrEndDate || undefined,
      currDate: initialCurrDate || undefined,
      district: initialDistrict || undefined,
      park: initialPark || undefined,
      projectRating: initialProjectRating || undefined,
      projectType: initialProjectType || undefined,
      isKcProj: initialIsKcProj || undefined,
      isIndustryChainProject: initialIsIndustryChainProject ? true : undefined,
      signedProject: initialSignedProject,
      investmentFlag: initialInvestmentFlag || undefined,
      investmentAmount: initialInvestmentAmount,
      projectCategory: initialProjectCategory,
      isCityKey: initialIsCityKey || undefined,
      // 自定义金额范围参数
      rmb1: initialRmb1,
      rmb2: initialRmb2,
      dollar1: initialDoller1,
      dollar2: initialDoller2,
      page: initialPage,
      size: initialPageSize,
    });
  }, []);

  // 表单提交（表单取消注释后使用）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);

    // 重置到第一页并更新URL参数
    const newPageParams = {
      page: 1,
      pageSize: pagination.pageSize,
      projectCode: values.projectCode || '',
      projectName: values.projectName || '',
      currentProjectProgress: values.currentProjectProgress || [], // 保持为数组
      rProgress: values.rProgress || '', // 保持为数组
      projectContent: values.projectContent || '',
      year: values.year?.toString() || '',
      attractorUnit: values.attractorUnit || '',
    };

    updateUrlParams(newPageParams);

    // 更新分页状态
    setPagination({
      ...pagination,
      current: 1,
    });

    // 解析 rProgress：支持字符串（逗号分隔）或数组
    const rProgressVal = values.rProgress;
    const rProgressArr = rProgressVal
      ? (Array.isArray(rProgressVal) ? rProgressVal : String(rProgressVal).split(',').map((s) => s.trim()).filter(Boolean))
      : [];

    fetchData({
      showAll: true,
      projectCode: values.projectCode,
      projectName: values.projectName,
      // openapi 生成的接口将 currentProjectProgress 标记为必传数组
      currentProjectProgress: values.currentProjectProgress ?? [],
      rprogress: rProgressArr,
      rProgress: rProgressArr.length > 0 ? rProgressArr : undefined,
      projectContent: values.projectContent,
      year: values.year ? parseInt(values.year) : undefined,
      attractorUnit: values.attractorUnit,
      page: 1,
      size: pagination.pageSize,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = () => {};

  // 表格分页变化处理
  const handleTableChange = (newPagination: any) => {
    const { current, pageSize } = newPagination;

    // 更新URL参数
    updateUrlParams({
      page: current,
      pageSize: pageSize,
    });

    // 更新分页状态
    setPagination({
      ...pagination,
      current: current,
      pageSize: pageSize,
    });

    // 重新获取数据 - 确保传入的currentProjectProgress是数组或undefined
    const currentProgress = form.getFieldValue('currentProjectProgress');
    // openapi 生成的接口将 currentProjectProgress 标记为必传数组
    const progressParam = Array.isArray(currentProgress) ? currentProgress : [];

    fetchData({
      showAll: true,
      projectCode: form.getFieldValue('projectCode'),
      projectName: form.getFieldValue('projectName'),
      currentProjectProgress: progressParam,
      rprogress: initialRProgressArray,
      rProgress: initialRProgressArray.length > 0 ? initialRProgressArray : undefined,
      projectContent: form.getFieldValue('projectContent'),
      year: form.getFieldValue('year'),
      attractorUnit: form.getFieldValue('attractorUnit'),
      currStartDate: initialCurrStartDate || undefined,
      currEndDate: initialCurrEndDate || undefined,
      currDate: initialCurrDate || undefined,
      district: initialDistrict || undefined,
      park: initialPark || undefined,
      projectRating: initialProjectRating || undefined,
      projectType: initialProjectType || undefined,
      isKcProj: initialIsKcProj || undefined,
      isIndustryChainProject: initialIsIndustryChainProject ? true : undefined,
      signedProject: initialSignedProject,
      investmentFlag: initialInvestmentFlag || undefined,
      investmentAmount: initialInvestmentAmount,
      projectCategory: initialProjectCategory || undefined,
      isCityKey: initialIsCityKey || undefined,
      // 自定义金额范围参数（翻页时也要保持一致）
      rmb1: initialRmb1,
      rmb2: initialRmb2,
      dollar1: initialDoller1,
      dollar2: initialDoller2,
      page: current,
      size: pageSize,
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const goBack = () => {
    // 如果有来源页面参数，直接返回到指定页面
    if (initialFromPage) {
      navigate(initialFromPage);
    } else {
      // 否则返回到上一个路由页面（不是分页历史）
      window.history.go(-1);
    }
  };
  // 重置表单（表单取消注释后使用）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReset = () => {
    form.resetFields();

    // 重置URL参数
    updateUrlParams({
      page: 1,
      pageSize: 10,
      projectCode: '',
      projectName: '',
      currentProjectProgress: [], // 重置为数组
      rProgress: '', // 重置为数组
      projectContent: '',
      year: '',
      attractorUnit: '',
    });

    // 重置分页状态
    setPagination({
      ...pagination,
      current: 1,
      pageSize: 10,
    });

    // 重新获取数据
    fetchData({
      showAll: true,
      projectCode: '',
      projectName: '',
      // openapi 生成的接口将 currentProjectProgress 标记为必传数组
      currentProjectProgress: [],
      rprogress: [],
      rProgress: undefined,
      projectContent: '',
      year: undefined,
      attractorUnit: '',
      page: 1,
      size: 10,
    });
  };

  // 页面加载时获取系统信息
  useEffect(() => {
    fetchDict();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        maxWidth: '1400px',
        margin: '0 auto'
      }}
    >
      <PageContainer
        style={{
          width: '100%',
          height: '100vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content="欢迎使用项目管理模块"
      >
        {/* <Button className={styles.backBtn} onClick={goBack} icon={<ArrowLeftOutlined />}>
          返回
        </Button> */}
        <div style={{ backgroundColor: 'white' }}>
          {/* <div style={{ padding: '20px', backgroundImage: 'url(/pm-bg1.png)', backgroundSize: '100% 100%' }}>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <div style={{
                marginRight: '10px',
                width: '5px',
                height: '16px',
                background: '#005BF5',
                borderRadius: '2.5px',
              }}></div>
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>查询</div>
            </div>
            <Form
              form={form}
              layout={'horizontal'}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish1}
              onFinishFailed={onFinishFailed1}
              autoComplete="off"
            >
              <Row>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                  }}
                  label="项目名称"
                  name="projectName"
                >
                  <Input />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                    width: '25%',
                  }}
                  label="项目编号"
                  name="projectCode"
                >
                  <Input />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px'
                  }}
                  label="项目状态"
                  name="currentProjectProgress"
                >
                  <Select
                    mode="multiple"
                    placeholder="请选择项目状态"
                    options={progressDict.map(item => ({
                      value: item.value,
                      label: item.label
                    }))}
                  />
                </Form.Item>
              </Row>
              <Row>
                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                  }}
                  label="项目内容"
                  name="projectContent"
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  style={{
                    width: '25%',
                    marginLeft: '20px'
                  }}
                  label="招引单位"
                  name="attractorUnit"
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  style={{
                    width: '25%', marginLeft: '20px'
                  }}
                  label="所属年份"
                  name="year"
                >
                  <Select options={[
                    {
                      value: 2023,
                      label: '2023',
                    },
                    {
                      value: 2024,
                      label: '2024',
                    },
                    {
                      value: 2025,
                      label: '2025',
                    }
                  ]}></Select>
                </Form.Item>

                <Form.Item style={{
                  marginLeft: '20px',
                }}>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button
                      htmlType="button"
                      onClick={handleReset}
                    >
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Row>
            </Form>
          </div> */}

          <Table
            style={{ marginTop: 20 }}
            rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            rowKey={(record) => record.id}
            columns={columns}
            bordered={true}
            dataSource={dataSource}
            pagination={false}
            onChange={handleTableChange}
            loading={loading} // 添加loading属性
          />

          <Pagination
            showSizeChanger={false}
            current={pagination.current}
            pageSize={pagination.pageSize}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            onChange={(page, pageSize) => {
              // 更新URL参数
              updateUrlParams({
                page: page,
                pageSize: pageSize,
              });

              // 更新分页状态
              setPagination({
                ...pagination,
                current: page,
                pageSize: pageSize,
              });

              // 重新获取数据 - 确保传入的currentProjectProgress是数组或undefined
              const currentProgress = form.getFieldValue('currentProjectProgress');
              // openapi 里 currentProjectProgress 是必传 Array<string>；未选择时也必须传空数组 []
              const progressParam = Array.isArray(currentProgress) ? currentProgress : [];

              fetchData({
                showAll: true,
                projectCode: form.getFieldValue('projectCode'),
                projectName: form.getFieldValue('projectName'),
                currentProjectProgress: progressParam,
                rprogress: initialRProgressArray,
                rProgress: initialRProgressArray.length > 0 ? initialRProgressArray : undefined,
                projectContent: form.getFieldValue('projectContent'),
                year: form.getFieldValue('year'),
                attractorUnit: form.getFieldValue('attractorUnit'),
                currStartDate: initialCurrStartDate || undefined,
                currEndDate: initialCurrEndDate || undefined,
                currDate: initialCurrDate || undefined,
                district: initialDistrict || undefined,
                park: initialPark || undefined,
                projectRating: initialProjectRating || undefined,
                projectType: initialProjectType || undefined,
                isKcProj: initialIsKcProj || undefined,
                isIndustryChainProject: initialIsIndustryChainProject ? true : undefined,
                signedProject: initialSignedProject,
                investmentFlag: initialInvestmentFlag || undefined,
                investmentAmount: initialInvestmentAmount,
                projectCategory: initialProjectCategory || undefined,
                isCityKey: initialIsCityKey || undefined,
                // 自定义金额范围参数（翻页时也要保持一致）
                rmb1: initialRmb1,
                rmb2: initialRmb2,
                dollar1: initialDoller1,
                dollar2: initialDoller2,
                page: page,
                size: pageSize,
              });
            }}
            style={{ marginTop: '16px' }}
          />
        </div>
      </PageContainer>
    </div>
  );
};

export default ProjectManage;



