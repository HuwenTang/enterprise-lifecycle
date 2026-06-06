import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Modal, Pagination,
  Row,
  Select,
  Space,
  Switch,
  Upload,
  Table, Tag, UploadProps,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { SelectProps } from 'antd/es/select';
import {primeApi, systemApi2} from '@/services/api';
import {InboxOutlined} from '@ant-design/icons';
import {useNavigate} from "@umijs/max";
import dayjs from "dayjs";

type FieldType = {
  projectCode?: string;
  projectName?: string;
  status?: string;
  content?: string;
  amount?: string;
  grantForTaizhengtong?: boolean;
  roles?: string[];
};
const DataImport = () => {
  const [orgId, setOrgId] = useState('0');
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [user, setUser] = useState<any>({});
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [grantForTaizhengtong, setGrantForTaizhengtong] = useState<any>()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10,total:0 });

  const { Dragger } = Upload;

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/prime-api/project-online-approval/import.xlsx',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination); // 更新 pagination 状态，触发数据重新获取
  };

  const editRole = async (id: string, arr: string[]) => {
    await systemApi2.updateUserRole(id, arr);
  };
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 10,
  //   total: 0,
  //   simple: true,
  //   showTotal: (total) => {
  //     return `共 ${total} 条`;
  //   },
  // });

  const [dataSource, setDataSource] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    fetchData({projectCode:values.projectCode,projectName:values.projectName,page:pagination.current, size:pagination.pageSize})

  };

  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    editRole(user.id, values.roles);
    setIsModalOpen(false);
    message.success('修改成功');
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

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

  const columns = [
    {
      title: <TitleCom text={'序号'} icon={'/mg/icon1.png'} />,
      dataIndex: 'index',
      width: 80,
      fixed: 'left' as const,
      render: (_, record, index) => {
        return index + 1;
      },
    },
    {
      title: <TitleCom text={'项目审批类型'} icon={'/mg/icon4.png'} />,
      dataIndex: 'approvalType',
      fixed: 'left' as const,
      key: 'approvalType',
      width: 150,
    },
    {
      title: <TitleCom text={'备案目录'} icon={'/mg/icon2.png'} />,
      dataIndex: 'filingCatalog',
      key: 'filingCatalog',
      ellipsis:true,
      width: 200,
    },
    {
      title: <TitleCom text={'项目名称'} icon={'/mg/icon6.png'} />,
      dataIndex: 'projectName',
      key: 'projectName',
      ellipsis:true,
      width: 200,
    },
    {
      title: <TitleCom text={'是否补办项目'} icon={'/mg/icon5.png'} />,
      dataIndex: 'isSupplementaryProject',
      key: 'isSupplementaryProject',
      width: 150,
    },
    {
      title: <TitleCom text={'项目代码'} icon={'/mg/icon7.png'} />,
      dataIndex: 'projectCode',
      key: 'projectCode',
      ellipsis:true,
      width: 250,
    },
    {
      title: <TitleCom text={'申报时间'} icon={'/mg/icon2.png'} />,
      dataIndex: 'applicationTime',
      key: 'applicationTime',
      width: 200,
      render: (text) => {
        return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: <TitleCom text={'审核备类型'} icon={'/mg/icon4.png'} />,
      dataIndex: 'reviewFilingType',
      key: 'reviewFilingType',
      width: 200,
    },
    {
      title: <TitleCom text={'备案目录分类'} icon={'/mg/icon2.png'} />,
      dataIndex: 'filingCatalogCategory',
      key: 'filingCatalogCategory',
      width: 200,
    },
    {
      title: <TitleCom text={'项目类型'} icon={'/mg/icon4.png'} />,
      dataIndex: 'projectType',
      key: 'projectType',
      width: 200,
    },
    {
      title: <TitleCom text={'建设性质'} icon={'/mg/icon4.png'} />,
      dataIndex: 'constructionNature',
      key: 'constructionNature',
      width: 200,
    },
    {
      title: <TitleCom text={'项目属性'} icon={'/mg/icon4.png'} />,
      dataIndex: 'projectAttributes',
      key: 'projectAttributes',
      width: 200,
    },
    {
      title: <TitleCom text={'拟开工时间（年）'} icon={'/mg/icon2.png'} />,
      dataIndex: 'plannedStartYear',
      key: 'plannedStartYear',
      width: 200,
    },
    {
      title: <TitleCom text={'拟建成时间（年）'} icon={'/mg/icon2.png'} />,
      dataIndex: 'plannedEndYear',
      key: 'plannedEndYear',
      width: 200,
    },
    {
      title: <TitleCom text={'建设地点'} icon={'/mg/icon2.png'} />,
      dataIndex: 'constructionLocation',
      key: 'constructionLocation',
      ellipsis:true,
      width: 200,
    },
    {
      title: <TitleCom text={'国标行业'} icon={'/mg/icon4.png'} />,
      dataIndex: 'nationalIndustryStandard',
      key: 'nationalIndustryStandard',
      ellipsis:true,
      width: 200,
    },
    {
      title: <TitleCom text={'国标行业代码'} icon={'/mg/icon3.png'} />,
      dataIndex: 'nationalIndustryCode',
      key: 'nationalIndustryCode',
      width: 200,
    },
    {
      title: <TitleCom text={'管理行业'} icon={'/mg/icon4.png'} />,
      dataIndex: 'managementIndustry',
      key: 'managementIndustry',
      width: 200,
    },
    {
      title: <TitleCom text={'建设规模及内容'} icon={'/mg/icon7.png'} />,
      dataIndex: 'constructionScaleAndContent',
      key: 'constructionScaleAndContent',
      ellipsis:true,
      width: 500,
    },
    {
      title: <TitleCom text={'总投资（万元）'} icon={'/mg/icon2.png'} />,
      dataIndex: 'totalInvestment',
      key: 'totalInvestment',
      width: 200,
    },
    {
      title: <TitleCom text={'用地面积（公顷）'} icon={'/mg/icon2.png'} />,
      dataIndex: 'landArea',
      key: 'landArea',
      width: 200,
    },
    {
      title: <TitleCom text={'新增用地面积（公顷）'} icon={'/mg/icon2.png'} />,
      dataIndex: 'newLandArea',
      key: 'newLandArea',
      width: 200,
    },
    {
      title: <TitleCom text={'农用地面积（公顷）'} icon={'/mg/icon2.png'} />,
      dataIndex: 'agriculturalLandArea',
      key: 'agriculturalLandArea',
      width: 200,
    },
    {
      title: <TitleCom text={'项目资本金（万元）'} icon={'/mg/icon2.png'} />,
      dataIndex: 'projectCapital',
      key: 'projectCapital',
      width: 200,
    },
    {
      title: <TitleCom text={'资金来源'} icon={'/mg/icon2.png'} />,
      dataIndex: 'fundingSource',
      key: 'fundingSource',
      width: 200,
    },
    {
      title: <TitleCom text={'是否技改项目'} icon={'/mg/icon5.png'} />,
      dataIndex: 'isTechnicalReformProject',
      key: 'isTechnicalReformProject',
      width: 200,
      render: (_, record) => {
        if (record.isTechnicalReformProject){
          return '是';
        }else {
          return '否';
        }
      },
    },

    {
      title: <TitleCom text={'产业政策类型'} icon={'/mg/icon4.png'} />,
      dataIndex: 'industrialPolicyType',
      key: 'industrialPolicyType',
      width: 200,
    },
    {
      title: <TitleCom text={'产业结构调整指导目录'} icon={'/mg/icon2.png'} />,
      dataIndex: 'industryAdjustmentGuidanceCatalog',
      key: 'industryAdjustmentGuidanceCatalog',
      ellipsis:true,
      width: 300,
    },
    {
      title: <TitleCom text={'是否属于房屋市政工程'} icon={'/mg/icon5.png'} />,
      dataIndex: 'isInfrastructureEngineering',
      key: 'isInfrastructureEngineering',
      width: 200,
      render: (_, record) => {
        if (record.isInfrastructureEngineering){
          return '是';
        }else {
          return '否';
        }
      },
    },
    {
      title: <TitleCom text={'是否同意投资平台为项目单位提供融资对接服务'} icon={'/mg/icon5.png'} />,
      dataIndex: 'agreeToProvideFinancingServices',
      key: 'agreeToProvideFinancingServices',
      width: 300,
      render: (_, record) => {
        if (record.agreeToProvideFinancingServices){
          return '是';
        }else {
          return '否';
        }
      },
    },
    {
      title: <TitleCom text={'项目（法人）单位'} icon={'/mg/icon2.png'} />,
      dataIndex: 'legalCompany',
      key: 'legalCompany',
      ellipsis:true,
      width: 200,
    },
    {
      title: <TitleCom text={'项目单位登记注册类型'} icon={'/mg/icon4.png'} />,
      dataIndex: 'legalCompanyRegistrationType',
      key: 'legalCompanyRegistrationType',
      width: 200,
    },
    {
      title: <TitleCom text={'项目单位控股情况'} icon={'/mg/icon2.png'} />,
      dataIndex: 'legalCompanyHoldingSituation',
      key: 'legalCompanyHoldingSituation',
      width: 200,
    },{
      title: <TitleCom text={'是否为该项目的控股单位'} icon={'/mg/icon5.png'} />,
      dataIndex: 'isLegalCompanyControllingForProject',
      key: 'isLegalCompanyControllingForProject',
      width: 200,
      render: (_, record) => {
        if (record.isLegalCompanyControllingForProject){
          return '是';
        }else {
          return '否';
        }
      },
    },{
      title: <TitleCom text={'项目法人证照类型'} icon={'/mg/icon4.png'} />,
      dataIndex: 'legalCompanyDocumentType',
      key: 'legalCompanyDocumentType',
      width: 200,
      ellipsis:true,
    },
    {
      title: <TitleCom text={'项目法人证照类型'} icon={'/mg/icon4.png'} />,
      dataIndex: 'legalCompanyDocumentType',
      key: 'legalCompanyDocumentType',
      ellipsis:true,
      width: 200,
    },
    {
      title: <TitleCom text={'项目法人证照号码'} icon={'/mg/icon3.png'} />,
      dataIndex: 'legalCompanyDocumentNumber',
      key: 'legalCompanyDocumentNumber',
      width: 200,
    },
    {
      title: <TitleCom text={'法人代表姓名'} icon={'/mg/icon6.png'} />,
      dataIndex: 'legalCompanyLegalRepresentative',
      key: 'legalCompanyLegalRepresentative',
      width: 200,
    },
    {
      title: <TitleCom text={'法人单位联系人'} icon={'/mg/icon6.png'} />,
      dataIndex: 'legalCompanyContactName',
      key: 'legalCompanyContactName',
      width: 200,
    },
    {
      title: <TitleCom text={'手机号码'} icon={'/mg/icon2.png'} />,
      dataIndex: 'legalCompanyContactPhone',
      key: 'legalCompanyContactPhone',
      width: 200,
    },
    {
      title: <TitleCom text={'电子邮箱'} icon={'/mg/icon2.png'} />,
      dataIndex: 'legalCompanyContactEmail',
      key: 'legalCompanyContactEmail',
      width: 200,
    },
    {
      title: <TitleCom text={'项目（申报）单位'} icon={'/mg/icon2.png'} />,
      dataIndex: 'applicationCompany',
      key: 'applicationCompany',
      ellipsis:true,
      width: 200,
    },
    // {
    //   title: '操作',
    //   valueType: 'option',
    //   width: 200,
    //   fixed: 'right',
    //   render: (text, record) => [
    //     <a
    //       style={{
    //         color: 'red',
    //       }}
    //       key="delete"
    //     >
    //       删除
    //     </a>,
    //   ],
    // },
  ];

  const getSys = () => {
    lx.device.getSystemInfo({
      success: function (res) {
        if (res.systemType === 'iOS' || res.systemType === 'Android') {
          setCollapsed(!collapsed);
        }
      },
      fail: function (err) {
        console.log(err);
      },
    });
  };

  const fetchData = async (params: any) => {
    console.log(params);
    const data = await primeApi.listProjectOnlineApproval (
      {
        projectCode:params.projectCode,
        projectName:params.projectName,
        page:params.page,
        size: params.size,
      }
    );
    console.log(data);
    setPagination({
      ...pagination,
      total: data.total,
      current: data.page,
      pageSize: data.size,
    });
    console.log('data', data.records);
    setDataSource(data.records);
  };

  useEffect(() => {
    getSys();
  }, []);

  useEffect(()=>{
    fetchData({projectCode:form.getFieldsValue().projectCode,projectName:form.getFieldsValue().projectName, page:pagination.current, size:pagination.pageSize})
  },[pagination.current,pagination.pageSize])


  useEffect(() => {
    fetchData({name:name , mobile:mobile, orgId:orgId,grantForTaizhengtong:grantForTaizhengtong, page:pagination.current, size:pagination.pageSize})
    console.log(orgId);
  }, [orgId]);
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content="欢迎使用在线审批模块"
        extra={[
          // <Button  key="0" onClick={() => {
          //   downBlob()
          // }}>
          //   下载模版
          // </Button>,
          // <Button type={'primary'} key="1" onClick={() => {
          //   setIsModalOpen(true)
          // }}>
          //   导入数据
          // </Button>,
          // <Button type={'primary'} key="2" onClick={() => {
          //   setIsModalOpen(true)
          // }}>
          //   导出数据
          // </Button>,
        ]}
      >
        <div style={{ padding: '10px', backgroundColor: 'white' }}>
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
                  label="项目代码"
                  name="projectCode"
                >
                  <Input />
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    style={{ marginLeft: '20px' }}
                    htmlType="button"
                    onClick={() => {
                      fetchData({
                        projectCode: '',
                        projectName: '',
                        page: 1,
                        size: pagination.pageSize,
                      });
                      form.resetFields();
                    }}
                  >
                    重置
                  </Button>
                </Form.Item>
              </Row>
            </Form>
          </div>
          {/*</Form>*/}
          <Table
            style={{ marginTop: 20 }}
            columns={columns}
            scroll={{ x: 1000 }}
            bordered={true}
            dataSource={dataSource}
            pagination={false}
            onChange={handleTableChange}
          />
          <Pagination
            current={pagination.current}
            // pageSize={pagination.pageSize}
            showTotal={(total) => `共 ${total} 条`}
            total={pagination.total}
            onChange={(page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize: pageSize });
            }} // 直接在 Pagination 中更新页码状态以触发数据获取
            style={{ marginTop: '16px' }} // 可选：添加一些样式间距以改善布局
          />
        </div>
        <Modal title="文件导入" open={isModalOpen} footer={false} onCancel={handleCancel}>
          <div style={{
            width: '100%',
          }}>
            <Form
              form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              style={{ width: '100%' }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item<FieldType>
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                label=""
                name="roles"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Dragger style={{  width: '400px'}} {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">上传文件</p>
                  <p className="ant-upload-hint">

                  </p>
                </Dragger>
              </Form.Item>
            </Form>
          </div>
            {/*<Form.Item label={null}>*/}
            {/*  <div*/}
            {/*    style={{*/}
            {/*      display: 'flex',*/}
            {/*      justifyContent: 'right',*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <Button type="primary" htmlType="submit">*/}
            {/*      提交*/}
            {/*    </Button>*/}
            {/*  </div>*/}
            {/*</Form.Item>*/}
        </Modal>
      </PageContainer>
    </div>
  );
};

export default DataImport;
