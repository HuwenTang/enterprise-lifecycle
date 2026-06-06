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
  FormMonitorIndicatorFieldDto,
  ListFormMonitorIndicatorRequest,
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

type Option ={
  value?:string
  label?:string
}
const MonitorKpi = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [, setIsUpdata] = useState(false);
  const [id, setId] = useState('');
  const [depart, setDepart] = useState<Option[]>()
  const [type, setType] = useState<Option[]>()
  const [supportList, setSupportList] = useState<Option[]>()
  const [collectionFrequencyList, setCollectionFrequencyList] = useState<Option[]>()
  const handleTableChange = (pagination: any) => {
    setPagination(pagination); // 更新 pagination 状态，触发数据重新获取
  };
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const handleCancel1 = () => {
    setIsModalOpen1(false);
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


  //获取字段表
  const getFormMonitorIndicatorFields = async (id:string) => {
    const data = await primeApi.getFormMonitorIndicatorFields({id:id});
    form2.setFieldsValue({
      dynamicInputs: data,
    })
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

  // 查询监测指标信息列表
  const fetchData = async (params: ListFormMonitorIndicatorRequest) => {
    console.log(params);
    const data = await primeApi.listFormMonitorIndicator(params);
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

  //获取支撑列表
  const listFormSupportIndicator = async () => {
    const data = await primeApi.listFormSupportIndicator({
      page: pagination.current,
      size: pagination.pageSize,
    });
    const list = data.records.map((item: any) => ({
      value: item.id,
      label: item.indicatorName,
    }));
    setSupportList(list)
    console.log('listFormSupportIndicator',data);
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


  //删除监测指标信息
  const deleteFormSupportIndicator = async (id: string) => {
    const data = await primeApi.deleteFormMonitorIndicator({ id: id });
    console.log('deleteFormSupportIndicator', data);
  };


  //查询监测指标信息
  const getFormMonitorIndicator = async (id: string) => {
    const data = await primeApi.getFormMonitorIndicator({ id: id });
    console.log('getFormSupportIndicator', data);
    form.setFieldsValue({
      indicatorName: data.indicatorName,
      collectionFrequency: data.collectionFrequency,
      department: data.department,
      description: data.description,
    });
    form2.setFieldsValue({
      supportIndicatorId: data.supportIndicatorId,
      collectionFrequency: data.collectionFrequency,
      indicatorName: data.indicatorName,
      department: data.department,
      description: data.description,
    });
  };


  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
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
      title: '支撑指标',
      dataIndex: 'supportIndicatorName',
      key: 'supportIndicatorName',
      width: 120,
      align: 'center',
    },
    {
      title: '牵头部门',
      dataIndex: 'supportIndicatorDepartmentName',
      align: 'center',
      width: 120,
      ellipsis: true,
      key: 'supportIndicatorDepartmentName',
    },
    {
      title: '监测指标',
      dataIndex: 'indicatorName',
      key: 'indicatorName',
      width: 120,
      align: 'center',
    },
    {
      title: '责任部门',
      dataIndex: 'departmentName',
      align: 'center',
      width: 120,
      ellipsis: true,
      key: 'departmentName',
    },
    {
      title: '需求频次',
      dataIndex: 'collectionFrequencyLabel',
      align: 'center',
      width: 120,
      ellipsis: true,
      key: 'collectionFrequencyLabel',
    },
    {
      title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      valueType: 'option',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (text: any, record: any) => [
        <div key="operate" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
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
              setIsUpdata(true);
              setId(record.id);
              setIsModalOpen1(true)
              getFormMonitorIndicatorFields(record.id)
              getFormMonitorIndicator(record.id);
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
                    supportIndicatorId: form1.getFieldsValue().supportIndicatorId,
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
    for (let i = 0; i < values.dynamicInputs.length; i++){
      values.dynamicInputs[i].sort = i+1
    }
    await primeApi.updateFormMonitorIndicator({id:id,
      formMonitorIndicatorDto:{
        supportIndicatorId:values.supportIndicatorId,
        collectionFrequency:values.collectionFrequency,
        indicatorName:values.indicatorName,
        department:values.department,
        description:values.description,
        fields:values.dynamicInputs
    }
    });
  };

  const onFinish2: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    createFormMonitorIndicator(values).then(res => {
      console.log(res)
      message.success('保存成功');
      setIsModalOpen1(false)
      fetchData({
        supportIndicatorId: form1.getFieldsValue().supportIndicatorId,
        department: form1.getFieldsValue().department,
        page: pagination.current,
        size: pagination.pageSize,
      });
    });
  };

  useEffect(() => {
    fetchDict();
    listFormSupportIndicator()
    getDictItems2()
    getDictItems1()
    getDictItems()
  }, []);

  useEffect(() => {
    console.log(form1.getFieldValue('indicatorName'))
    fetchData({
      supportIndicatorId: form1.getFieldValue('supportIndicatorId'),
      department: form1.getFieldValue('department'),
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
        content="欢迎使用监测指标模块"
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
                  name="supportIndicatorId"
                >
                  <Select options={supportList}>

                  </Select>
                </Form.Item>
                <Form.Item<FieldType>
                  style={{
                    marginLeft: '20px',
                    width: '25%',
                  }}
                  label="责任部门"
                  name="department"
                >
                  <Select options={depart} optionFilterProp="label" showSearch/>

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
            // rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            columns={columns}
            // scroll={{x: 2000}}
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
        <Modal
          width={800}
          title="修改监测指标"
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
              label="支撑指标名称"
              name="supportIndicatorId"
            >
              <Select options={supportList} />
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
              rules={[{ required: true, message: '请输入指标简介' }]}
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
                        labelCol={10}
                        style={{ width: '24%' }}
                        {...restField}
                        name={[name, 'fieldName']}
                        label={'字段名称'}
                        rules={[{ required: true, message: '请填写字段名称' }]}
                      >
                        <Input placeholder="例：亩均税收" />
                      </Form.Item>
                      <Form.Item
                        labelCol={10}
                        {...restField}
                        style={{ width: '24%' }}
                        name={[name, 'fieldType']}
                        label={'类型'}
                        rules={[{ required: true, message: '请选择类型' }]}
                      >
                        <Select  options={type}/>
                      </Form.Item>
                      <Form.Item
                        labelCol={10}
                        {...restField}
                        style={{ width: '24%' }}
                        name={[name, 'fieldUnit']}
                        label={'单位'}
                        rules={[{ required: true, message: '请选择单位' }]}
                      >
                        <Input placeholder="单位" />
                      </Form.Item>

                      <Form.Item
                        labelCol={10}
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

export default MonitorKpi;
