import {Button, Form, FormProps, Input, message, Modal, Pagination, Table} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import {systemApi, systemApi2} from '@/services/api';
import dayjs from 'dayjs';
import AddRole from '@/pages/RoleManage/components/AddRole';

type FieldType = {
  username?: string;
  roles?: string[];
};
const RoleManage = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    simple: true,
  });

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [roleData, setRoleData] = useState({});

  const [form] = Form.useForm();
  const handleCancel = () => {
    setIsModalOpen1(false);
  };

  const fetchRole = async () => {
    const dataList = await systemApi.listRole(
      {
        page: pagination.current,
        size: pagination.pageSize
      }
    );
    setDataSource(dataList.records);
    if(dataList.page!==0){
      setPagination({
        ...pagination,
        total: dataList.total,
        current: dataList.page,
        pageSize: dataList.size,
      });
  }};
  const delRole = async (id: string, name: string) => {
    Modal.confirm({
      title: '确认删除该角色？',
      content: (
        <div>
          您正在删除角色：{name}。此操作不可恢复，请谨慎操作。
        </div>
      ),
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      icon: <span style={{ color: 'red' }}>&#9888;</span>, // 可选：显示警告图标
      onOk: async () => {
        try {
          await systemApi.deleteRole({ id });
          message.success('删除成功');
          fetchRole(); // 刷新列表
        } catch (error) {
          // 可根据实际 API 返回处理错误
          message.error('删除失败，请重试');
        }
      },
      onCancel() {
        console.log('取消删除');
      },
    });
  };
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    systemApi
      .updateRole({
        id:roleData.id,
        roleDto:{
          name: values.username!,
        }
      })
      .then(() => {
        setIsModalOpen1(false);
        message.success('修改成功');
        fetchRole();
      })
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_, record, index) => {
        return index + 1;
      },
    },
    {
      title: '角色',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '是否系统角色',
      dataIndex: 'systemRole',
      render: (text:boolean) => {
        return <div>{text ? '是' : '否'}</div>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (time) => {
        return <div>{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</div>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record) => [
        <a
          style={{
            marginRight: '20px',
          }}
          key="down"
          onClick={() => {
            console.log(record);
            setRoleData(record);
            form.setFieldsValue({
              username: record.name,
            });
            setIsModalOpen1(true);
          }}
        >
          编辑
        </a>,
        <a
          style={{
            color: 'red',
          }}
          key="delete"
          onClick={() => delRole(record.id,record.name)}
        >
          删除
        </a>,
      ],
    },
  ];

  useEffect(() => {
    fetchRole();
  }, []);
  useEffect(() => {
    if (isModalOpen||isModalOpen1){
      return
    }
    fetchRole();
  }, [isModalOpen,isModalOpen1]);

  useEffect(() => {
    fetchRole();
  }, [pagination.current, pagination.pageSize]);

  return (
    <PageContainer
      style={{
        height: '90vh',
        overflow: 'scroll',
      }}
      content="欢迎使用角色管理模块"
      extra={[
        <Button type={'primary'} key="1" onClick={() => setIsModalOpen(true)}>
          +新增角色
        </Button>,
      ]}
    >
      <Table columns={columns} bordered={true}  dataSource={dataSource} pagination={false} />
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
      <AddRole isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} fetchRole={fetchRole}/>
      <Modal title="修改角色" open={isModalOpen1} footer={false} onCancel={handleCancel}>
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
            label="角色名称"
            name="username"
            rules={[{ required: true, message: '数据权限' }]}
          >
            <Input />
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
    </PageContainer>
  );
};

export default RoleManage;
