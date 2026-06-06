import {primeApi, systemApi} from '@/services/api';
import {
  CascadeVoString,
  CreateProjectNonInvestmentConfirmationRequest,
  ListProjectNonInvestmentConfirmationRequest,
  UpdateProjectNonInvestmentConfirmationRequest,
} from '@/services/apis';
import { UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate, useSearchParams } from '@umijs/max';
import {
  Button,
  DatePicker,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

type FieldType = {
  name?: string;
  code?: string;
  investor?: string; // 投资方名称
  district?: string; // 市（区）
  park?: string; // 园区（镇街）
  projectAddress?: string; // 项目地址
  bindustry?: string; // 项目类型
  bIndustry?: string; // 项目类型
  pzwh?: string; // 批准部门及文号
  pzrq?: string; // 批准日期
  startDateCommit?: string; // 批准日期
  uCode?: string; // 统一社会信用代码
  ucode?: string; // 统一社会信用代码
  desc?: string; // 主要产品、产能及主要建设内容
  industryName?: string; // 行业分类
  industryCode?: string; // 行业代码
  projType?: string; // 产业方向
  investMoney?: string; // 计划总投资
  fixedInvest?: string; // 固定资产投资
  databaseInclusionStatus?: boolean; // 是否已入库纳统
  statisticalProjectCode?: string; // 统计库项目编码
  statisticalProjectName?: string; // 统计库项目名称
  kgzzcl?: string; // kgzzcl  开工作证材料
  statisticalProjectPic?: string; // statisticalProjectPic  项目进度图片
};

const ProjectManage7 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const handleCancel1 = () => {
    setIsModalOpen1(false);
    setFileList([]);
    setFileList2([]);
    form2.resetFields();
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };
  const navigate = useNavigate();

  // 从URL参数中获取分页信息
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialPageSize = parseInt(searchParams.get('size') || '10', 10);
  const initialName = searchParams.get('name') || '';

  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialPageSize,
    total: 0
  });

  // 更新URL参数
  const updateUrlParams = (params: { page?: number; size?: number; name?: string }) => {
    const newParams = { ...params };
    if (params.page === 1) delete newParams.page; // 默认页码不显示在URL中
    if (params.size === 10) delete newParams.size; // 默认页大小不显示在URL中
    if (!params.name) delete newParams.name; // 空名称不显示在URL中

    setSearchParams(newParams);
  };

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setPagination(pagination);
    // 更新URL参数并触发数据获取
    updateUrlParams({ page: current, size: pageSize, name: form.getFieldValue('name') || '' });
  };

  const [dataSource, setDataSource] = useState<any[]>([]);

  const fetchData = async (params: ListProjectNonInvestmentConfirmationRequest) => {
    const data = await primeApi.listProjectNonInvestmentConfirmation(params);
    setPagination({
      ...pagination,
      total: data.total,
      current: data.page,
      pageSize: data.size,
    });
    setDataSource(data.records);
  };

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    const data = {
      name: values.name || '',
      page: 1, // 搜索时重置到第一页
      size: pagination.pageSize,
    };
    updateUrlParams({ page: 1, size: pagination.pageSize, name: values.name || '' });
    fetchData(data);
  };

  const [isShowEnter, setIsShowEnter] = useState(false);
  const [isUpdata, setIsUpdata] = useState(false);
  const [id, setId] = useState('');

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileList2, setFileList2] = useState<UploadFile[]>([]);
  const [parkName, setParkName] = useState('');
  const [pzrq, setPzrq] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [isUploading2, setIsUploading2] = useState(false);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const normFile2 = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const props: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    // maxCount: 1,
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

  const props2: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    accept: '.jpg,.png,.jpeg,.webp',
    // maxCount: 1,
    fileList: fileList2,
    onChange({ file, fileList }) {
      setIsUploading2(true);
      setFileList2(fileList);
      if (file.status !== 'uploading') {
        console.log(file, fileList);
        setIsUploading2(false);
      }
    },
  };

  const TitleCom = ({ text, icon }: { text: string; icon: string }) => {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img style={{ width: '10px', marginRight: '5px' }} src={icon} alt="" />
        <div>{text}</div>
      </div>
    );
  };

  const getSys = () => {
    lx.device.getSystemInfo({
      success: function (res: any) {
        if (res.systemType === 'iOS' || res.systemType === 'Android') {
          setCollapsed(!collapsed);
        }
      },
      fail: function (err: any) {
        console.log(err);
      },
    });
  };

  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFinishFailed2: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  //创建非招商项目
  const createProjectNonInvestmentConfirmation = async (
    values: CreateProjectNonInvestmentConfirmationRequest,
  ) => {
    try {
      const data = await primeApi.createProjectNonInvestmentConfirmation(values);
      console.log('response---', data);
    } catch (error) {
      console.error(`创建非招商项目失败:`, error);
    }
  };

  //编辑非招商项目
  const updateProjectNonInvestmentConfirmation = async (
    values: UpdateProjectNonInvestmentConfirmationRequest,
  ) => {
    try {
      const data = await primeApi.updateProjectNonInvestmentConfirmation(values);
      console.log('response---', data);
    } catch (error) {
      console.error(`编辑非招商项目失败:`, error);
    }
  };

  //删除非招商项目
  const deleteProjectNonInvestmentConfirmation = async (id: string) => {
    const data = await primeApi.deleteProjectNonInvestmentConfirmation({ id: id });
    console.log('deleteProjectNonInvestmentConfirmation', data);
  };

  //查询非招商项目详情
  // 查询非招商项目详情
  const getProjectNonInvestmentConfirmation = async (id: string) => {
    setFileList([]);
    setFileList2([]);
    const data = await primeApi.getProjectNonInvestmentConfirmation({ id: id });

    // 处理 kgzzcl
    if (data?.kgzzcl && Array.isArray(data.kgzzcl)) {
      const list = data.kgzzcl.map((item) => {
        const name = item.name || item.path.split('/').pop()?.split('?')[0] || '文件';
        return {
          uid: `${Math.random().toString(36).substr(2, 9)}}`,
          name,
          status: 'done',
          url: item.path,
          response: [{ url: item.path, path: item.path, name }],
        };
      });
      setFileList(list);
    } else {
      setFileList([]);
    }

    // 处理 statisticalProjectPic
    if (data?.statisticalProjectPic && Array.isArray(data.statisticalProjectPic)) {
      const list2 = data.statisticalProjectPic.map((item) => {
        const name = item.name || item.path.split('/').pop()?.split('?')[0] || '图片';
        return {
          uid: item.path,
          name,
          status: 'done',
          url: item.path,
          response: [{ url: item.path, path: item.path, name }],
        };
      });
      setFileList2(list2);
    } else {
      setFileList2([]);
    }

    // 设置表单值
    form2.setFieldsValue({
      ...data,
      uCode: data.uscc,
      bindustry: data.bindustry?.toString(),
      pzrq: dayjs(data.pzrq),
      startDateCommit: dayjs(data.startDateCommit),
    });

    // ✅ 关键：手动触发 changeEnter，更新 isShowEnter 状态
    changeEnter();

    // 同步处理 district -> parkOptions
    if (data.district !== undefined) {
      handleDistrictChange(data.district);
    }
  };

  // 根据 parkId 查找园区名称
  const getParkNameById = (parkId: string): string => {
    if (!parkId || !areaData || areaData.length === 0) return '未知园区';

    // 遍历市（区）-> 园区（镇街）
    for (const district of areaData[0]?.children || []) {
      const found = district.children?.find(park => park.value === parkId);
      if (found) {
        return found.label; // 返回汉字名称
      }
    }
    return '未知园区';
  };

  const onFinish2: FormProps<FieldType>['onFinish'] = () => {
    if (fileList.length === 0) {
      message.error('请上传项目相关佐证资料');
      return;
    }
    if (fileList2.length < 2) {
      message.error('请上传两张以上项目进展图片');
      return;
    }

    const values = form2.getFieldsValue();

    // ✅ 正确获取园区汉字名称
    setParkName(getParkNameById(values.park));

    setPzrq(values.startDateCommit);
    setIsModalOpen2(true);
  };

  // 点击"确认"按钮的处理函数
  const handleOk = () => {
    let values = form2.getFieldsValue();
    // console.log('values', fileList);
    // console.log('values2', fileList2);
    // 构造 kgzzcl 数组
    const kgzzcl = fileList.map((item) => {
      const path = item?.response?.[0]?.url || item.url;
      const name = item?.response?.[0]?.name || item.name || path.split('/').pop()?.split('?')[0] || '文件';
      return { name, path };
    });

    // 构造 jgzzcl 数组
    const jgzzcl = fileList2.map((item) => {
      const path = item?.response?.[0]?.url || item.url;
      const name = item?.response?.[0]?.name || item.name || path.split('/').pop()?.split('?')[0] || '图片';
      return { name, path };
    });

    values.ucode = values.uCode;
    values.bIndustry = values.bindustry;
    values.kgzzcl = kgzzcl; // 替换为数组对象
    values.statisticalProjectPic = jgzzcl; // 替换为数组对象

    if (isUpdata) {
      console.log('submit', values)
      values.jgzzcl = jgzzcl;
      values.uscc = values.uCode;
      // ✅ 关键：确保日期字段是字符串，而不是 dayjs 对象
      values.pzrq = dayjs(values.pzrq).toDate();
      values.startDateCommit = dayjs(values.startDateCommit).toDate();// 转为字符串

      updateProjectNonInvestmentConfirmation({
        id: id,
        projectNonInvestmentConfirmationDto: values,
      }).then((res) => {
        message.success('保存成功');
        setIsModalOpen1(false);
        setIsModalOpen2(false);
        form2.resetFields();
        fetchData({
          name: form.getFieldsValue().name || '',
          page: pagination.current,
          size: pagination.pageSize,
        });
      });
    } else {
      console.log('submit', values)
      values.jgzzcl = jgzzcl;
      values.uscc = values.uCode;
      // ✅ 关键：确保日期字段是字符串，而不是 dayjs 对象
      values.pzrq = dayjs(values.pzrq).toDate();
      values.startDateCommit = dayjs(values.startDateCommit).toDate();// 转为字符串
      createProjectNonInvestmentConfirmation({ projectNonInvestmentConfirmationDto: values }).then(
        (res) => {
          message.success('保存成功');
          setIsModalOpen1(false);
          setIsModalOpen2(false);
          form2.resetFields();
          fetchData({
            name: form.getFieldsValue().name || '',
            page: pagination.current,
            size: pagination.pageSize,
          });
        },
      );
    }
  };

  const changeEnter: FormProps<FieldType>['onChange'] = () => {
    if (form2.getFieldsValue().databaseInclusionStatus === true) {
      setIsShowEnter(true);
    } else {
      setIsShowEnter(false);
    }
  };

  const columns = [
    {
      title: <TitleCom text={'序号'} icon={'/mg/icon1.png'} />,
      dataIndex: 'index',
      width: 80,
      render: (_: any, record: any, index: any) => {
        return index + 1;
      },
      align: 'center',
    },
    {
      title: <TitleCom text={'项目名称'} icon={'/mg/icon6.png'} />,
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text={'投资方名称'} icon={'/mg/icon6.png'} />,
      dataIndex: 'investor',
      key: 'investor',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: <TitleCom text={'项目类型'} icon={'/mg/icon2.png'} />,
      dataIndex: 'bindustry',
      align: 'center',
      ellipsis: true,
      key: 'bindustry',
      width: 120,
      render: (text: string) => (
        <span style={{ textAlign: 'center' }}>
          {text === '1' ? '服务业' : text === '2' ? '工业' : text ? text : '-'}
        </span>
      ),
    },
    {
      title: <TitleCom text={'主要产品、产能及主要建设内容'} icon={'/mg/icon7.png'} />,
      dataIndex: 'desc',
      align: 'left',
      key: 'desc',
      width: 200,
      ellipsis: true,
      render: (text: any) => (
        <span style={{ textAlign: 'left' }} title={text}>
          {text}
        </span>
      ), // 内容居右
    },

    {
      title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      valueType: 'option',
      align: 'center',
      width: 240,
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
                  background: ' #1890FF',
                  borderRadius: '14px',
                  fontSize: '14px',
                  color: '#fff',
                }}
                key="down"
                onClick={() => {
                  setIsModalOpen1(true);
                  // setParkOptions([])
                  form2.resetFields();
                  setIsUpdata(true);
                  setFileList([]);
                  setFileList2([]);

                  setId(record.id);
                  getProjectNonInvestmentConfirmation(record.id);
                }}
              >
                <div>编辑</div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
              </div>
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  marginLeft: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '70px',
                  height: '28px',
                  background: ' red',
                  borderRadius: '14px',
                  fontSize: '12px',
                  color: '#fff',
                }}
                key="down"
                onClick={() => {
                  console.log('删除', record.id);
                  deleteProjectNonInvestmentConfirmation(record.id)
                    .then(() => {
                      message.success('删除成功');
                      fetchData({
                        name: form.getFieldsValue().name || '',
                        page: pagination.current,
                        size: pagination.pageSize,
                      });
                    })
                    .catch((e) => {
                      message.error(e.message);
                    });
                }}
              >
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  删除
                </div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/del.png" alt="" />
              </div>
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  padding: '0 5px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: ' #1890FF',
                  borderRadius: '14px',
                  fontSize: '14px',
                  color: '#fff',
                }}
                key="down"
                onClick={() => {
                  navigate(`/xmgl/pro-other-start?id=${record.id}`);
                }}
              >
                <div>开工认定</div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const [areaData, setAreaData] = useState<CascadeVoString[]>([])
  const [districtOptions, setDistrictOptions] = useState([])
  const [parkOptions, setParkOptions] = useState<{ value: string; label: string }[]>([]);
  const getAdministrativeDivisionTree = async () => {
    const res = await systemApi.getAdministrativeDivisionTree();
    setAreaData(res)
    const list =  res[0]?.children?.map((item) => ({
      value: item.value,
      label: item.label,
    })) || [];
    setDistrictOptions(list)
  };

  // 监听"市（区）"变化
  const handleDistrictChange = (value: string) => {
    const selectedDistrict = areaData[0]?.children?.find((d) => d.value === value);
    const parks = selectedDistrict?.children?.map((p) => ({
      value: p.value!,
      label: p.label,
    })) || [];
    setParkOptions(parks);
    // 清空已选园区
    form.setFieldValue('park', undefined);
  };

  const [projTypeOption, setProjTypeOption] = useState()
  const getDictItems = async () => {
    const res = await systemApi.getDictItems({
      catalog: '8_13_X',
    });
    const list = res?.map((p) => ({
      value: p.value!,
      label: p.label,
    })) || [];
    setProjTypeOption(list)
  };

  useEffect(() => {
    getDictItems()
    getSys();
    getAdministrativeDivisionTree()
  }, []);

  // 初始化时根据URL参数获取数据
  useEffect(() => {
    fetchData({
      name: initialName,
      page: initialPage,
      size: initialPageSize,
    });
  }, []);

  // 监听分页变化获取数据
  useEffect(() => {
    fetchData({
      name: form.getFieldsValue().name || '',
      page: pagination.current,
      size: pagination.pageSize,
    });
  }, [pagination.current, pagination.pageSize]);

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      {/*<OrgStruct setOrgId={setOrgId} setOption={setOption} option={option} responsive={collapsed} />*/}
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content="欢迎使用非招商项目开工认定模块"
      >
        <div style={{ padding: '20px', backgroundColor: 'white' }}>
          <div
            style={{
              padding: '20px',
              backgroundImage: 'url(/pm-bg1.png)',
              backgroundSize: '100% 100%',
            }}
          >
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <div
                style={{
                  marginRight: '10px',
                  width: ' 5px',
                  height: '16px',
                  background: '#005BF5',
                  borderRadius: '2.5px',
                }}
              ></div>
              <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>查询</div>
            </div>
            <Form
              form={form}
              layout={'horizontal'}
              name="basic"
              initialValues={{ remember: true, name: initialName }}
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
                  name="name"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{
                    marginLeft: '20px',
                  }}
                >
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => {
                        form2.resetFields();
                        setIsUpdata(false);
                        setIsModalOpen1(true);
                        setParkOptions([])
                        setFileList([]);
                        setFileList2([]);
                      }}
                    >
                      新增非招商项目
                    </Button>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button
                      htmlType="button"
                      onClick={() => {
                        fetchData({
                          name: '',
                          page: 1,
                          size: pagination.pageSize,
                        });
                        form.resetFields();
                        updateUrlParams({ page: 1, size: pagination.pageSize, name: '' });
                      }}
                    >
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Row>
            </Form>
          </div>
          {/*</Form>*/}
          <Table
            style={{ marginTop: 20 }}
            rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            rowKey={(record) => record.id}
            columns={columns}
            bordered={true}
            dataSource={dataSource}
            pagination={false}
            onChange={handleTableChange}
          />
          <Pagination
            showSizeChanger={false}
            current={pagination.current}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            onChange={(page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize: pageSize });
              updateUrlParams({ page, size: pageSize, name: form.getFieldValue('name') || '' });
            }} // 直接在 Pagination 中更新页码状态以触发数据获取
            style={{ marginTop: '16px' }} // 可选：添加一些样式间距以改善布局
          />
        </div>

        <Modal
          width={1000}
          title={isUpdata ? '编辑非招商项目' : '新增非招商项目'}
          open={isModalOpen1}
          footer={false}
          onCancel={handleCancel1}
        >
          <Form
            form={form2}
            layout={'vertical'}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 20 }}
            style={{ maxWidth: 1000, paddingBottom: '20px', marginTop: '20px' }}
            initialValues={{ remember: true }}
            onFinish={onFinish2}
            onFinishFailed={onFinishFailed2}
            autoComplete="off"
          >
            <Row>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入项目名称' }]}
                label="项目名称"
                name="name"
                style={{
                  width: '50%',
                }}
              >
                <Input />
              </Form.Item>
              <Form.Item<FieldType>
                style={{
                  width: '50%',
                }}
                rules={[{ required: true, message: '请输入投资方名称' }]}
                label="投资方名称"
                name="investor"
              >
                <Input />
              </Form.Item>
            </Row>
            <Row>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入市（区）' }]}
                label="市（区）"
                name="district"
                style={{
                  width: '50%',
                }}
              >
                <Select
                  placeholder="请选择市（区）"
                  onChange={handleDistrictChange}
                  options={districtOptions}
                />
              </Form.Item>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入园区（镇街）' }]}
                label="园区（镇街）"
                name="park"
                style={{
                  width: '50%',
                }}
              >
                <Select
                  placeholder="请先选择市（区）"
                  // disabled={!form.getFieldValue('district')}
                  options={parkOptions}
                />
              </Form.Item>
            </Row>
            <Row>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入项目地址' }]}
                label="项目地址"
                name="projectAddress"
                style={{
                  width: '50%',
                }}
              >
                <Input />
              </Form.Item>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请选择项目类型' }]}
                label="项目类型"
                name="bindustry"
                style={{
                  width: '50%',
                }}
              >
                <Select
                  options={[
                    {
                      value: '2',
                      label: '工业',
                    },
                    {
                      value: '1',
                      label: '服务业',
                    },
                  ]}
                ></Select>
              </Form.Item>
            </Row>
            <Row>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入批准部门及文号' }]}
                label="批准部门及文号"
                name="pzwh"
                style={{
                  width: '50%',
                }}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入批准日期' }]}
                label="批准日期"
                name="pzrq"
                style={{
                  width: '50%',
                }}
              >
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
            </Row>
            <Row>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入项目代码' }]}
                label="项目代码"
                name="code"
                style={{
                  width: '50%',
                }}
              >
                <Input />
              </Form.Item>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入统一社会信用代码' }]}
                label="统一社会信用代码"
                name="uCode"
                style={{
                  width: '50%',
                }}
              >
                <Input />
              </Form.Item>
            </Row>
            <Row>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入主要产品、产能及主要建设内容' }]}
                label="主要产品、产能及主要建设内容"
                wrapperCol={{ span: 22 }}
                name="desc"
                style={{
                  width: '100%',
                }}
              >
                <Input.TextArea />
              </Form.Item>
            </Row>
            <Row>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入行业代码' }]}
                label="行业代码"
                name="industryCode"
                style={{
                  width: '50%',
                }}
              >
                <Input />
              </Form.Item>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入行业分类' }]}
                label="行业分类"
                name="industryName"
                style={{
                  width: '50%',
                }}
              >
                <Input />
              </Form.Item>

            </Row>
            <Row>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入计划总投资' }]}
                label="计划总投资（亿元/万美元）"
                name="investMoney"
                style={{
                  width: '50%',
                }}
              >
                <Input type={'number'}/>
              </Form.Item>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入固定资产投资' }]}
                label="固定资产投资（万元）"
                name="fixedInvest"
                style={{
                  width: '50%',
                }}
              >
                <Input type={'number'}/>
              </Form.Item>
            </Row>
            <Row>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入产业方向' }]}
                label="产业方向"
                name="projType"
                style={{
                  width: '50%',
                }}
              >
                <Select
                  placeholder="请选择产业方向"
                  options={projTypeOption}
                />
              </Form.Item>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请选择是否已入库纳统' }]}
                label="是否已入库纳统"
                name="databaseInclusionStatus"
                style={{
                  width: '50%',
                }}
              >
                <Select
                  onChange={changeEnter}
                  options={[
                    {
                      value: true,
                      label: '是',
                    },
                    {
                      value: false,
                      label: '否',
                    },
                  ]}
                ></Select>
              </Form.Item>
            </Row>

            {isShowEnter && (
              <Row>
                <Form.Item<FieldType>
                  rules={[{ required: true, message: '请输入统计库项目编码' }]}
                  label="统计库项目编码"
                  name="statisticalProjectCode"
                  style={{
                    width: '50%',
                  }}
                >
                  <Input />
                </Form.Item>
                <Form.Item<FieldType>
                  rules={[{ required: true, message: '请输入统计库项目名称' }]}
                  label="统计库项目名称"
                  name="statisticalProjectName"
                  style={{
                    width: '50%',
                  }}
                >
                  <Input />
                </Form.Item>
              </Row>
            )}
            <Row>
              <Form.Item<FieldType>
                rules={[{ required: true, message: '请输入开工日期' }]}
                label="开工日期"
                name="startDateCommit"
                style={{
                  width: '50%',
                }}
              >
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
            </Row>

            <Form.Item
              label="项目相关佐证资料"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: '请上传项目相关佐证资料' }]}
            >
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>文件上传</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="项目进展图片"
              valuePropName="fileList2"
              getValueFromEvent={normFile2}
              rules={[{ required: true, message: '请上传项目进展图片' }]}
            >
              <Upload {...props2}>
                <Button icon={<UploadOutlined />}>文件上传</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button style={{ marginTop: '20px' }} type="primary" htmlType={'submit'}>
                确定
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          width={600}
          height={500}
          title="项目所在地园区（镇街）承诺"
          open={isModalOpen2}
          footer={false}
          onCancel={handleCancel2}
        >
          <div style={{ margin: '40px' }}>
            <div style={{ textIndent: '36px', fontSize: '18px' }}>
              该项目于{pzrq ? dayjs(pzrq).format('YYYY年MM月DD') : '20XX年XX月XX日'}
              完成备案手续正式开工，以上信息确切无误，附件资料真实、有效。
            </div>
            <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '16px' }}>
              园区（镇街）：{parkName}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
            <Button style={{ marginRight: '10px' }} onClick={handleCancel2}>
              返回
            </Button>
            <Button type={'primary'} onClick={handleOk}>
              确定
            </Button>
          </div>
        </Modal>
      </PageContainer>
    </div>
  );
};

export default ProjectManage7;



