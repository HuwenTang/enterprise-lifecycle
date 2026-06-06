/* eslint-disable no-use-before-define, @typescript-eslint/no-use-before-define */
import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tree,
  TreeDataNode,
  TreeProps,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useModel } from '@umijs/max';
import JsSha from 'jssha/dist/sha1';
import OrgStruct from '@/pages/RoleManage/components/OrgStruct';
import { SelectProps } from 'antd/es/select';
import dayjs from 'dayjs';
import { systemApi, systemApi2 } from '@/services/api';
import { RightOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';

type FieldType = {
  realName?: string;
  mobile?: string;
  username?: string;
  grantForTaizhengtong?: boolean;
  roles1?: string;
  roles?: string[];
};

type ChangePasswordFieldType = {
  password?: string;
  confirmPassword?: string;
};

/** 8-20 位，须含大小写字母、数字、特殊字符 */
const PASSWORD_COMPLEXITY_REGEXP =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,20}$/;

const PASSWORD_COMPLEXITY_MESSAGE =
  '密码须为 8-20 位，且包含大小写字母、数字和特殊字符';

const hashPassword = (plain: string) =>
  new JsSha('SHA-1', 'TEXT').update(plain).getHash('B64');

const UserManage = () => {
  const { initialState } = useModel('@@initialState');
  const roleIds: string[] = Array.isArray((initialState?.currentUser as { roleIds?: unknown[] })?.roleIds)
    ? ((initialState?.currentUser as { roleIds?: unknown[] }).roleIds ?? []).map((id) => String(id))
    : [];
  const canChangePassword = roleIds.includes('00');
  const [orgId, setOrgId] = useState('0');
  const [collapsed, setCollapsed] = useState(false);
  const [option, setOption] = useState<SelectProps[]>([]);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm<ChangePasswordFieldType>();
  const [roleList, setRoleList] = useState<{ value: string; label: string }[]>([]);
  const [user, setUser] = useState<any>({});
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [grantForTaizhengtong, setGrantForTaizhengtong] = useState<any>()
  const [roles1, setRoles1] = useState<any>();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const handleTableChange = (p: { current?: number; pageSize?: number; total?: number }) => {
    if (p) setPagination((prev) => ({ ...prev, ...p }));
  };
  const getRoleList = async () => {
    const res = await systemApi2.allRole({ organizationIds: new Set([orgId]) });
    setRoleList((res || []).map((item: { value?: string; label?: string }) => ({ value: item.value ?? '', label: item.label ?? '' })));
  };
  const getUserRole = async (id: string) => {
    const res = await systemApi2.getUserRole({ userid: id });
    const rolesVal: string[] = Array.isArray(res) ? res : (res ? [res] : []);
    form.setFieldsValue({ roles: rolesVal });
  };

  const editRole = async (id: string, arr: string[]) => {
    await systemApi2.updateUserRole({
      userid: id,
      requestBody: arr as any, // 传数组，Set 序列化为 JSON 会丢失
    });
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
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  const handleChangePasswordCancel = () => {
    setIsChangePasswordModalOpen(false);
    passwordForm.resetFields();
  };

  const handleChangePassword: FormProps<ChangePasswordFieldType>['onFinish'] = async (values) => {
    if (!user?.id || !values.password) return;
    try {
      await systemApi.resetPassword({
        id: user.id,
        resetPasswordDto: {
          password: hashPassword(values.password),
        },
      });
      message.success('修改密码成功');
      handleChangePasswordCancel();
    } catch (e: any) {
      message.error(e?.message || '修改密码失败');
    }
  };

  // 重置密码
  const handleResetPassword = async (userId: string): Promise<void> => {
    const resetPasswordPlain = '123456';
    try {
      await systemApi.resetPassword({
        id: userId,
        resetPasswordDto: {
          password: 'lufssDYsgIgYvjIA+yf/7Mh8EiU=',
        },
      });
      try {
        await navigator.clipboard.writeText(resetPasswordPlain);
        message.success(`重置密码成功`);
      } catch (err) {
        console.error(err);
        message.success(`重置密码成功`);
      }
    } catch (e: any) {
      message.error(e?.message || '重置密码失败');
    }
  };



  const onFinish1: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    setName(values.realName ?? '');
    setMobile(values.mobile ?? '');
    setGrantForTaizhengtong(values.grantForTaizhengtong);
    setRoles1(values.roles1 ?? '');
    const data = {
      name: values.realName,
      mobile: values.mobile,
      grantForTaizhengtong: values.grantForTaizhengtong,
      organizationId: orgId,
      roles1: values.roles1,
      current: 1,
      pageSize: 10,
    };
    console.log(data)
    fetchData(data);
  };

  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);
    if (!values.roles || !user?.id) return;
    try {
      await editRole(user.id, values.roles);
      setIsModalOpen(false);
      message.success('修改成功');
      fetchData({ name, mobile, roles1, organizationId: orgId, grantForTaizhengtong, page: pagination.current, size: pagination.pageSize });
    } catch (e: any) {
      message.error(e?.message || '修改失败');
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_: any, record: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: '用户',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },

    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      render: (lastLoginTime: string) => {
        return <div>{lastLoginTime?dayjs(lastLoginTime).format('YYYY-MM-DD HH:mm:ss'):"-"}</div>;
      },
    },
    {
      title: '泰政通授权',
      dataIndex: 'grantForTaizhengtong',
      render: (text: any, record: any) => {
        return (
          <div>
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              onChange={async (value) => {
                try {
                  await systemApi
                    .grantForTaizhengtong( {
                      userid: record.id,
                      simpleValueDtoBoolean: {
                        value: value,
                      },
                    })
                    .then(() => {
                      message.success('修改成功');
                      fetchData({name:name , mobile:mobile,roles1:roles1, organizationId:orgId,grantForTaizhengtong:grantForTaizhengtong, page:pagination.current, size:pagination.pageSize})
                    });
                } catch (e) {
                  const response = e as Response;
                  const resp = await response.json();
                  message.error(resp.message);
                }
              }}
              value={record.grantForTaizhengtong}
            />
          </div>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: canChangePassword ? 320 : 250,
      render: (text: any, record: any) => [
        <a
          key="edit"
          style={{
            marginRight: '20px',
          }}
          onClick={() => {
            showModal();
            getUserRole(record.id);
            console.log(record);
            getRoleList();
            setUser(record);
            form.setFieldsValue({
              username: record.realName,
              roles: record.roles,
            });
          }}
        >
          修改角色
        </a>,
        <a
          key="dataAuth"
          style={{
            marginRight: '20px',
          }}
          onClick={() => {
            setIsModalOpen1(true)
            setUser(record);
            getDataGrants(record.id)
          }}
        >
          数据授权
        </a>,
        ...(canChangePassword
          ? [
              <a
                key="changePassword"
                style={{
                  marginRight: '20px',
                }}
                onClick={() => {
                  setUser(record);
                  passwordForm.resetFields();
                  setIsChangePasswordModalOpen(true);
                }}
              >
                修改密码
              </a>,
            ]
          : []),
        <Popconfirm
          key="resetPassword"
          title="重置密码"
          description="确定要重置该用户的密码吗？"
          onConfirm={() => handleResetPassword(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <a
            style={{
              color: 'red',
            }}
          >
            重置密码
          </a>
        </Popconfirm>,
      ],
    },
  ];

  const getSys = () => {
    const lx = typeof window !== 'undefined' ? (window as any).lx : undefined;
    if (lx?.device?.getSystemInfo) {
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
    }
  };

  const fetchData = async (params: any) => {
    console.log(params);
    const data = await systemApi.listUser(
      {
        name: params.name,
        mobile: params.mobile,
        organizationId: params.organizationId,
        roleId: params.roles1,
        grantForTaizhengtong: params.grantForTaizhengtong,
        page: params.page,
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
    console.log('data', data);
    setDataSource(data.records);
  };

  const [userList, setUserList] = useState<string[]>([])

  function transformTreeData(data: any[]): TreeDataNode[] {
    return data.map((node: any) => ({
      ...node,
      title: node.label, // 将 title 改为 name
      key: node.value, // 可选，如果你不再需要 name 属性
      children: node.children ? transformTreeData(node.children) : []
    }));
  }
  const getAdministrativeDivisionTree = async () => {
    const  data =  await systemApi.getAdministrativeDivisionTree()

    console.log('transformedData',transformTreeData(data))
    setTreeData(transformTreeData(data))
  }
  const grantData = async () => {
    try {
      console.log('userList', userList);
      const data = await systemApi.updateAreaGrants({ userid: user.id, requestBody: userList });
   console.log('grantData',data)
   message.success('授权成功');
   setUserList([])
   setCheckedKeys( [])
   setIsModalOpen1(false)
 }catch (e){
   message.error('授权失败');
 }
}
  const getDataGrants = async (id: string) => {
    const data = await systemApi.getAreaGrants({ userid: id });
    const list: string[] = [];
    data.areas.forEach((item: { id: string }) => {
      list.push(item.id);
    });
    setUserList(list);
    setCheckedKeys(list);
  };

  const [treeData, setTreeData] = useState<TreeDataNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    const keys = Array.isArray(checkedKeysValue) ? checkedKeysValue : (checkedKeysValue as { checked: React.Key[] }).checked;
    setUserList(keys.map((k) => String(k)));
    setCheckedKeys(keys);
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };
  useEffect(() => {
    getRoleList()
    getSys();
    getAdministrativeDivisionTree()
  }, []);

  useEffect(() => {
    console.log(userList)
  }, [userList]);

  useEffect(()=>{
    fetchData({name:name , mobile:mobile,roles1:roles1, organizationId:orgId,grantForTaizhengtong:grantForTaizhengtong, page:pagination.current, size:pagination.pageSize})
  },[pagination.current,pagination.pageSize])


  useEffect(() => {
    fetchData({name:name , mobile:mobile,roles1:roles1, organizationId:orgId,grantForTaizhengtong:grantForTaizhengtong, page:pagination.current, size:pagination.pageSize})
    console.log(orgId);
  }, [orgId]);
  return (
    // <div  style={
    //   // collapsed
    //   //   ? {
    //   //     height: '90vh',
    //   //     overflowY: 'scroll',
    //   //   }
    //   //   : { display: 'flex' }
    // }>
    <div
      style={{
        display: 'flex',
      }}
    >
      <OrgStruct setOrgId={setOrgId} setOption={setOption} option={option} responsive={collapsed} />
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'scroll',
        }}
        content="欢迎使用用户管理模块"
      >
        <ProCard
          extra={
            <RightOutlined
              rotate={!collapsed ? 90 : undefined}
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            />
          }
          title="查询"
          collapsed={collapsed}
        >
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
                label="姓名"
                name="realName"
              >
                <Input />
              </Form.Item>
              <Form.Item<FieldType>
                style={{
                  marginLeft: '20px',
                  width: '25%',
                }}
                label="手机号"
                name="mobile"
              >
                <Input />
              </Form.Item>
              <Form.Item<FieldType>
                style={{
                  marginLeft: '20px',
                  width: '25%',
                }}
                label="角色"
                name="roles1"
              >
                <Select  options={roleList} />
              </Form.Item>
            </Row>
            <Row>
              <Form.Item<FieldType>
                style={{
                  width: '25%',
                }}
                label="是否泰政通授权"
                name="grantForTaizhengtong"
              >
                <Select
                  defaultValue=""
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
                />
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
                    onClick={() => {
                      setName('')
                      setMobile('')
                      setRoles1('')
                      setGrantForTaizhengtong(undefined)
                      fetchData({
                        name: '',
                        mobile: '',
                        roles1: '',
                        organizationId: '0',
                        grantForTaizhengtong: undefined,
                        page: 1,
                        size: 10,
                      });
                      form.resetFields();
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Row>

            <div
              style={{
                display: 'flex',
                // justifyContent: 'flex-end',
              }}
            >

            </div>
          </Form>
        </ProCard>
        {/*</Form>*/}
        <Table
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
          onChange={(page,pageSize) => {
            setPagination({ ...pagination, current: page,pageSize: pageSize })
          }} // 直接在 Pagination 中更新页码状态以触发数据获取
          style={{ marginTop: '16px' }} // 可选：添加一些样式间距以改善布局
        />
        <Modal title="角色修改" open={isModalOpen} footer={false} onCancel={handleCancel}>
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
            <Form.Item<FieldType> label="用户" name="username">
              <Input disabled={true} />
            </Form.Item>

            <Form.Item<FieldType>
              label="角色权限"
              name="roles"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select mode="multiple" placeholder="请选择角色权限" options={roleList} />
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

        <Modal title="数据授权" open={isModalOpen1} footer={false} onCancel={handleCancel1}>
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
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
            <Form.Item label={null}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'right',
                }}
              >
                <Button  onClick={()=>{
                  if (userList && userList.length > 0) {
                    grantData()
                  }else {
                    message.error('请选择数据权限')
                  }
                }}>
                  提交
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="修改密码"
          open={isChangePasswordModalOpen}
          footer={false}
          onCancel={handleChangePasswordCancel}
          destroyOnClose
        >
          <Form
            form={passwordForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleChangePassword}
            autoComplete="off"
          >
            <Form.Item label="用户">
              <Input disabled value={user?.realName ?? ''} />
            </Form.Item>
            <Form.Item<ChangePasswordFieldType>
              label="新密码"
              name="password"
              extra={PASSWORD_COMPLEXITY_MESSAGE}
              rules={[
                { required: true, message: '请输入新密码' },
                {
                  pattern: PASSWORD_COMPLEXITY_REGEXP,
                  message: PASSWORD_COMPLEXITY_MESSAGE,
                },
              ]}
            >
              <Input.Password placeholder="请输入新密码" />
            </Form.Item>
            <Form.Item<ChangePasswordFieldType>
              label="确认密码"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请再次输入新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="请再次输入新密码" />
            </Form.Item>
            <Form.Item label={null}>
              <div style={{ display: 'flex', justifyContent: 'right' }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </PageContainer>
    </div>
  );
};

export default UserManage;
