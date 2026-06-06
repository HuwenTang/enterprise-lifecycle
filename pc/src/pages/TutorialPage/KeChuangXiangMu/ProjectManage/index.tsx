import { Button, Form, FormProps, Input, message, Pagination, Row, Select, Space, Table, Tag, ColumnsType } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { primeApi, systemApi } from '@/services/api';
import { useNavigate } from "@umijs/max";
import { ListKeySciTechProjectsRequest } from "@/services/apis";
import { useSearchParams } from "react-router-dom";
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './pm.module.css';
import dayjs from 'dayjs';

type FieldType = {
  projectCode?: string;
  projectName?: string;
  currentProjectProgress?: string[]; // 修改为字符串数组
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
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [user, setUser] = useState<any>({});

  // 分页和筛选状态
  const [searchParams, setSearchParams] = useSearchParams();

  // 参数初始化状态
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const initialCurrentProjectProgress = searchParams.get('currentProjectProgress')
    ? searchParams.get('currentProjectProgress')!.split(',')
    : [];

  // 新增参数
  const initialCurrStartDate = searchParams.get('currStartDate') || '';
  const initialInvestmentAmount = searchParams.get('investmentAmount') ? parseFloat(searchParams.get('investmentAmount')!) : undefined;
  const initialShowAll = searchParams.get('showAll') === 'true' ? true : undefined;

  // 记录来源页面
  const initialFromPage = searchParams.get('fromPage') || '';

  // 新增参数：district、park、applicationCondition
  const initialDistrict = searchParams.get('district') || '';
  const initialPark = searchParams.get('park') || '';
  const initialApplicationCondition = searchParams.get('applicationCondition') || '';

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

  // 项目状态字典
  const [progressDict, setProgressDict] = useState<{ code: string, label: string, enabled: boolean, sort: number, value: string }[]>([]);

  // 获取字典数据
  const fetchDict = async () => {
    try {
      const res = await systemApi.getDictItems({ catalog: 'project_progress' });
      console.log('resdict', res);
      if (res && Array.isArray(res)) {
        setProgressDict(res.filter(item => item.enabled)); // 只显示启用的选项
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
    currentProjectProgress?: string[]; // 修改为字符串数组
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
      title: <TitleCom text={'申报类别'} icon={'/mg/icon7.png'} />,
      dataIndex: 'applicationCategory',
      align: 'center' as const,
      key: 'applicationCategory',
      width: 120,
      ellipsis: true,
    },
    {
      title: <TitleCom text={'项目类型'} icon={'/mg/icon2.png'} />,
      dataIndex: 'projectType',
      align: 'center' as const,
      ellipsis: true,
      key: 'projectType',
      width: 120,
    },
    {
      title: <TitleCom text={'成立时间'} icon={'/mg/icon7.png'} />,
      key: 'establishmentDate',
      dataIndex: 'establishmentDate',
      width: 120,
      align: 'center' as const,
      render: (text: any) => {
        return text ? dayjs(text).format('YYYY-MM-DD') :''
      }
    },
    {
      title: <TitleCom text={'企业名称'} icon={'/mg/icon7.png'} />,
      key: 'companyName',
      dataIndex: 'companyName',
      width: 120,
      align: 'center' as const,
    },
    {
      title: <TitleCom text={'8+13+X产业领域'} icon={'/mg/icon7.png'} />,
      key: 'industryField',
      dataIndex: 'industryField',
      width: 150,
      align: 'center' as const,
    },
    {
      title: <TitleCom text={'申报条件'} icon={'/mg/icon7.png'} />,
      key: 'applicationConditions',
      dataIndex: 'applicationConditions',
      width: 120,
      align: 'center' as const,
    },
    {
      title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      valueType: 'option',
      align: 'center' as const,
      width: 150,
      minWidth: 100,
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {record.isInvestmentProject === '是' ? (
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
                  navigate(`/tutorial/project-advance?id=${record.investmentProjectId}&fromPage=${pagination.current}`);
                }}
              >
                <div>详情</div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
              </div>
              ) : ''}
            </div>
          </div>
        );
      },
    },
  ];

  // 获取数据
  const fetchData = async (params: ListKeySciTechProjectsRequest) => {
    console.log('请求参数:', params);
    setLoading(true); // 设置加载状态为true
    try {
      // 构建请求参数，包含从URL获取的筛选条件
      const requestParams: any = {
        ...params,
      };

      // 添加从URL参数获取的筛选条件
      if (initialDistrict) {
        requestParams.district = initialDistrict;
      }
      if (initialPark) {
        requestParams.park = initialPark;
      }
      if (initialApplicationCondition) {
        requestParams.applicationCondition = initialApplicationCondition;
      }

      console.log('最终请求参数:', requestParams);

      const data = await primeApi.listKeySciTechProjects(requestParams);
      console.log('接口返回数据:', data);

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
    // form.setFieldsValue({
    //   projectCode: initialProjectCode,
    //   projectName: initialProjectName,
    //   currentProjectProgress: initialCurrentProjectProgress,
    //   projectContent: initialProjectContent,
    //   year: initialYear,
    //   attractorUnit: initialAttractorUnit,
    // });
  }, []);

  // 初始数据加载
  useEffect(() => {
    fetchData({
      page: initialPage,
      size: initialPageSize,
    });
  }, []);

  // 表单提交
  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);

    // 重置到第一页并更新URL参数
    const newPageParams = {
      page: 1,
      pageSize: pagination.pageSize,
      projectCode: values.projectCode || '',
      projectName: values.projectName || '',
      currentProjectProgress: values.currentProjectProgress || [], // 保持为数组
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

    // 重新获取数据 - 确保传入的currentProjectProgress是数组或undefined
    const currentProgress = values.currentProjectProgress && values.currentProjectProgress.length > 0 ? values.currentProjectProgress : undefined;
    fetchData({
      page: 1,
      size: pagination.pageSize,
    });
  };

  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

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
    const progressParam = currentProgress && currentProgress.length > 0 ? currentProgress : undefined;

    fetchData({
      page: current,
      size: pageSize,
    });
  };
  const goBack = () => {
    // 如果有来源页面参数，直接返回到指定页面
    if (initialFromPage) {
      navigate(initialFromPage);
    } else {
      // 否则返回到上一个路由页面（不是分页历史）
      window.history.go(-1);
    }
  };
  // 重置表单
  const handleReset = () => {
    form.resetFields();

    // 重置URL参数
    updateUrlParams({
      page: 1,
      pageSize: 10,
      projectCode: '',
      projectName: '',
      currentProjectProgress: [], // 重置为数组
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

    // 重新获取数据 - 确保传入的currentProjectProgress是undefined
    fetchData({
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
        content="欢迎使用科创项目管理模块"
      >
        {/*<Button className={styles.backBtn} onClick={goBack} icon={<ArrowLeftOutlined />}>*/}
        {/*  返回*/}
        {/*</Button>*/}

        <h1 className={styles.pageTitle}>科创项目管理</h1>
        <p className={styles.pageSubtitle}>
          {initialDistrict ? `筛选条件: ${initialDistrict}` : '全部数据'} |
          {initialPark && `园区: ${initialPark}`} |
          {initialApplicationCondition ? `申报条件: ${initialApplicationCondition}` : '全部申报条件'}
        </p>

        <div style={{ backgroundColor: 'white' }}>
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
            locale={{
              emptyText: '暂无数据',
              filterTitle: '',
              filterConfirm: '确定',
              filterReset: '重置',
              filterEmptyText: '无筛选项',
              filterCheckall: '全选',
              filterSearchPlaceholder: '在筛选项中搜索',
              selectAll: '全选所有',
              selectInvert: '反选当页',
              selectNone: '清空所有',
              selectionAll: '全选所有',
              sortTitle: '',
              expand: '展开行',
              collapse: '收起行',
              triggerDesc: '点击降序',
              triggerAsc: '点击升序',
              cancelSort: '取消排序',
            }}
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
              const progressParam = currentProgress && currentProgress.length > 0 ? currentProgress : undefined;

              fetchData({
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



