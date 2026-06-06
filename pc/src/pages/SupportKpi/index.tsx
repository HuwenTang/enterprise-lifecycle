import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Table,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { primeApi, systemApi } from '@/services/api';
import {
  CreateFormSupportIndicatorRequest,
  FormMonitorIndicatorFieldDto,
  FormSupportIndicatorDto,
  ListFormSupportIndicatorRequest,
} from '@/services/apis';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

type FieldType = {
  dynamicInputs?:Array<FormMonitorIndicatorFieldDto>,
  username?: string;
  supportIndicatorId?: string;
  indicatorName?: string;
  collectionFrequency?: string;
  department?: string;
  description?: string;
  projectCode?: string;
  projectName?: string;
  currentProjectProgress?: string;
  projectContent?: string;
  investmentAmount?: string;
  content?: string;
  amount?: string;
  grantForTaizhengtong?: boolean;
  roles?: string[];
};
type KpiType = {
  supportIndicatorId?: string;
  indicatorName?: string;
  department?: string;
  description?: string;
};
type DepartOption ={
  value?:string
  label?:string
}
const SupportKpi = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isUpdata, setIsUpdata] = useState(false);
  const [, setKpiInfo] = useState<KpiType>({});
  const [id, setId] = useState('');
  const [depart, setDepart] = useState<DepartOption[]>()
  const [type, setType] = useState<DepartOption[]>()
  const [collectionFrequencyList, setCollectionFrequencyList] = useState<DepartOption[]>()

  const handleTableChange = (pagination: any) => {
    setPagination(pagination); // 更新 pagination 状态，触发数据重新获取
  };

  const [dataSource, setDataSource] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };

  // //组织架构树
  // const allCob = async ()=>{
  //   const data = await systemApi.allCob()
  //   setDepart(data)
  // }
  // 查询支撑指标信息列表
  const fetchData = async (params: ListFormSupportIndicatorRequest) => {
    console.log(params);
    const data = await primeApi.listFormSupportIndicator(params);
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

  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    const data = {
      ...values,
      current: pagination.current,
      pageSize: pagination.pageSize,
    };
    fetchData(data);
  };

  //查询频次 collection_frequency
  const getDictItems = async () => {
    const data = await systemApi.getDictItems({ catalog: 'collection_frequency'});
    console.log('getDictItems', data);
    const dataList = data.map((item: any) => ({
      label: item.label,
      value: item.code,
    }));
    setCollectionFrequencyList(dataList);
  };

  //查询部门 collection_dept
  const getDictItems1 = async () => {
    const data = await systemApi.getDictItems({ catalog: 'collection_dept'});
    console.log('getDictItems', data);
    const dataList = data.map((item: any) => ({
      label: item.label,
      value: item.code,
    }));
    setDepart(dataList);
  };

  //查询部门 field_type
  const getDictItems2 = async () => {
    const data = await systemApi.getDictItems({ catalog: 'field_type'});
    console.log('getDictItems', data);
    const dataList = data.map((item: any) => ({
      label: item.label,
      value: item.code,
    }));
    setType(dataList);
  };


  //创建支撑指标信息
  const createFormSupportIndicator = async (values: CreateFormSupportIndicatorRequest) => {
    const data = await primeApi.createFormSupportIndicator(values);
    console.log('createFormSupportIndicator', data);
  };

  //删除支撑指标信息
  const deleteFormSupportIndicator = async (id: string) => {
    const data = await primeApi.deleteFormSupportIndicator({ id: id });
    console.log('deleteFormSupportIndicator', data);
  };

  //修改支撑指标信息
  const updateFormSupportIndicator = async (id: string, values: FormSupportIndicatorDto) => {
    const data = await primeApi.updateFormSupportIndicator({
      id: id,
      formSupportIndicatorDto: values,
    });
    console.log('updateFormSupportIndicator', data);
  };

  //查询支撑指标信息
  const getFormSupportIndicator = async (id: string) => {
    const data = await primeApi.getFormSupportIndicator({ id: id });
    console.log('getFormSupportIndicator', data);
    setKpiInfo({
      supportIndicatorId: id,
      indicatorName: data.indicatorName,
      department: data.department,
      description: data.description,
    });
    form.setFieldsValue({
      indicatorName: data.indicatorName,
      collectionFrequency: (data as any).collectionFrequency,
      department: data.department,
      description: data.description,
    });
    form2.setFieldsValue({
      supportIndicatorId: data.indicatorName,
    });
  };
  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    if (isUpdata) {
      updateFormSupportIndicator(id, values as FormSupportIndicatorDto)
        .then((res) => {
          form.resetFields();
          console.log(res);
          fetchData({
            indicatorName: form1.getFieldsValue().indicatorName,
            department: form1.getFieldsValue().department,
            page: pagination.current,
            size: pagination.pageSize,
          });
          message.success('修改成功');
          setIsModalOpen(false);
        })
        .catch((err) => {
          console.log(err);
          message.error('修改失败');
          setIsModalOpen(false);
        });
    } else {
      createFormSupportIndicator({ formSupportIndicatorDto: values as FormSupportIndicatorDto })
        .then((res) => {
          form.resetFields();
          console.log(res);
          fetchData({
            indicatorName: form1.getFieldsValue().indicatorName,
            department: form1.getFieldsValue().department,
            page: pagination.current,
            size: pagination.pageSize,
          });
          message.success('修改成功');
          setIsModalOpen(false);
        })
        .catch((err) => {
          console.log(err);
          message.error('修改失败');
          setIsModalOpen(false);
        });
    }
  };

  const fetchDict = async () => {
    const res = await systemApi.getDictItems({ catalog: 'project_progress' });
    console.log('resdict', res);
  };
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
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
  const columns = [
    {
      title: '指标名称',
      dataIndex: 'indicatorName',
      key: 'indicatorName',
      width: 120,
      align: 'center' as const,
    },
    {
      title: '指标简介',
      dataIndex: 'description',
      align: 'center' as const,
      width: 120,
      ellipsis: true,
      key: 'description',
      render: (text:string) => (
        <div>
          <div>{text||'暂无'}</div>
        </div>
      ),
    },
    // {
    //   title: '需求频次',
    //   dataIndex: 'collectionFrequencyLabel',
    //   align: 'center',
    //   width: 120,
    //   ellipsis: true,
    //   key: 'collectionFrequencyLabel',
    // },
    {
      title: '牵头部门',
      dataIndex: 'departmentName',
      align: 'center' as const,
      width: 120,
      ellipsis: true,
      key: 'departmentName',
    },

    {
      title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      valueType: 'option',
      align: 'center' as const,
      width: 200,
      fixed: 'right' as const,
      render: (text: any, record: any) => [
        <div key="operate" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              padding: '0 10px',
              marginLeft: '10px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              // width: '100px',
              height: '28px',
              background: '#1890FF',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#fff',
            }}
            key="down"
            onClick={() => {
              setIsModalOpen1(true);
              setIsUpdata(true);
              setId(record.id);
              getFormSupportIndicator(record.id);
            }}
          >
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              新增监测指标
            </div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
          </div>
          <div
            style={{
              marginLeft: '10px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '70px',
              height: '28px',
              background: ' #1890FF',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#fff',
            }}
            key="down"
            onClick={() => {
              setIsModalOpen(true);
              setIsUpdata(true);
              setId(record.id);
              getFormSupportIndicator(record.id);
            }}
          >
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              编辑
            </div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
          </div>

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
              deleteFormSupportIndicator(record.id)
                .then(() => {
                  message.success('删除成功');
                  fetchData({
                    indicatorName: form1.getFieldsValue().indicatorName,
                    department: form1.getFieldsValue().department,
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
        </div>,
      ],
    },
  ];

  //创建监测指标信息
  const createFormMonitorIndicator = async (values:FieldType) => {
    await primeApi.createFormMonitorIndicator({
      formMonitorIndicatorDto:{
        supportIndicatorId: values.supportIndicatorId ?? '',
        indicatorName: values.indicatorName ?? '',
        collectionFrequency: values.collectionFrequency ?? '',
        department: values.department ?? '',
        description: values.description ?? '',
        fields: values.dynamicInputs ?? [],
    }
    });
  };

  const onFinish2: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    values.supportIndicatorId = id;
    createFormMonitorIndicator(values).then(res => {
      console.log(res)
      message.success('保存成功');
      setIsModalOpen1(false)
      form2.resetFields()
      fetchData({
        indicatorName: form1.getFieldsValue().indicatorName,
        department: form1.getFieldsValue().department,
        page: pagination.current,
        size: pagination.pageSize,
      });
    });
  };

  useEffect(() => {
    fetchDict();
    getDictItems()
    getDictItems1()
    getDictItems2()
  }, []);

  useEffect(() => {
    fetchData({
      indicatorName: form1.getFieldsValue().indicatorName,
      department: form1.getFieldsValue().department,
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
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content="欢迎使用支撑指标模块"
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
              form={form1}
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
                  label="支撑指标"
                  name="indicatorName"
                >
                  <Input />
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                    width: '25%',
                  }}
                  label="牵头部门"
                  name="department"
                >
                  <Select optionFilterProp="label" showSearch options={depart} />
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
                  <Button
                    type="primary"
                    onClick={() => {
                      setIsUpdata(false);
                      setIsModalOpen(true);
                    }}
                  >
                    新增支撑指标
                  </Button>
                  <Button style={{ marginLeft: '20px' }} type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    style={{ marginLeft: '20px' }}
                    htmlType="button"
                    onClick={() => {
                      form1.resetFields();
                      fetchData({
                        page: pagination.current,
                        size: pagination.pageSize,
                      });
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
        <Modal title="新增支撑指标" open={isModalOpen} footer={false} onCancel={handleCancel}>
          <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请输入指标名称' }]}
              label="指标名称"
              name="indicatorName"
            >
              <Input />
            </Form.Item>
            {/*<Form.Item<FieldType>*/}
            {/*  rules={[{ required: true, message: '请选择收集频次' }]}*/}
            {/*  label="收集频次"*/}
            {/*  name="collectionFrequency"*/}
            {/*>*/}
            {/*  <Select options={collectionFrequencyList} />*/}
            {/*</Form.Item>*/}
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请选择牵头部门' }]}
              label="牵头部门"
              name="department"
            >
              <Select options={depart} optionFilterProp="label" showSearch />
            </Form.Item>
            <Form.Item<FieldType>
              label="指标简介"
              name="description"
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item label={null}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'right',
                }}
              >
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          width={800}
          title="新增监测指标"
          open={isModalOpen1}
          footer={false}
          onCancel={handleCancel1}
        >
          <Form
            form={form2}
            layout={'vertical'}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 800, paddingBottom: '20px', marginTop: '20px' }}
            initialValues={{ remember: true }}
            onFinish={onFinish2}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请输入指标名称' }]}
              label="指标名称"
              name="supportIndicatorId"
            >
              <Input disabled={true} />
            </Form.Item>
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请输入监测指标名称' }]}
              label="监测指标名称"
              name="indicatorName"
            >
              <Input placeholder={'请输入监测指标名称'} />
            </Form.Item>
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请选择收集频次' }]}
              label="收集频次"
              name="collectionFrequency"
            >
              <Select options={collectionFrequencyList} />
            </Form.Item>
            <Form.Item<FieldType>
              rules={[{ required: true, message: '请选择责任部门' }]}
              label="责任部门"
              name="department"
            >
              <Select options={depart} optionFilterProp="label" showSearch/>
            </Form.Item>
            <Form.Item<FieldType>
              label="指标简介"
              name="description"
            >
              <Input.TextArea placeholder={'请输入指标简介'} />
            </Form.Item>
            <Form.List

              name="dynamicInputs"
              initialValue={[]} // 初始值可以是一个空数组
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ name, ...restField }) => (
                    <div
                      key={name}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                      }}
                    >
                      <Form.Item
                        labelCol={{ span: 10 }}
                        style={{ width: '24%' }}
                        {...restField}
                        name={[name, 'fieldName']}
                        label={'字段名称'}
                        rules={[{ required: true, message: '请填写字段名称' }]}
                      >
                        <Input placeholder="例：亩均税收" />
                      </Form.Item>
                      <Form.Item
                        labelCol={{ span: 10 }}
                        {...restField}
                        style={{ width: '24%' }}
                        name={[name, 'fieldType']}
                        label={'类型'}
                        rules={[{ required: true, message: '请选择类型' }]}
                      >
                        <Select  options={type}/>
                      </Form.Item>
                      <Form.Item
                        labelCol={{ span: 10 }}
                        {...restField}
                        style={{ width: '24%' }}
                        name={[name, 'fieldUnit']}
                        label={'单位'}
                        rules={[{ required: true, message: '请选择单位' }]}
                      >
                        <Input placeholder="单位" />
                      </Form.Item>

                      <Form.Item
                        labelCol={{ span: 10 }}
                        {...restField}
                        style={{ width: '24%' }}
                        name={[name, 'notNull']}
                        label={'是否必填'}
                        rules={[{ required: true, message: '请选择是否必填' }]}
                      >
                        <Select
                          style={{ width: 120 }}
                          options={[
                            { value: true, label: '是' },
                            { value: false, label: '否' },
                          ]}
                        />
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    新增一行
                  </Button>
                  {errors.length > 0 && (
                    <div style={{ color: 'red' }}>Please fill in all fields</div>
                  )}
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button style={{ marginTop: '20px' }} type="primary" htmlType={'submit'}>
                确定
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </PageContainer>
    </div>
  );
};

export default SupportKpi;
