/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useRef, useState } from 'react';
import { systemApi, systemApi2 } from '@/services/api';
import type { KvPairVoString, MenuVo } from '@/services/apis';
import { MenuDtoEndpointEnum } from '@/services/apis';
import {
  Button,
  Form,
  FormProps,
  Input, message,
  Modal, Popconfirm, Select,
  Table,
  TreeSelect, TreeSelectProps
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import * as Icons from '@ant-design/icons';

type FieldType = {
  name?: string;
  path?: string;
  icon?: string;
  sort?: number;
  parentId?: string;
  endpoint?: string;
};

type MenuRoleFormType = {
  name: string[];
};

const MenuManage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [rowId, setRowId] = useState('')

  const [treeData, setTreeData] = useState<MenuVo[]>([])
  const [treeData1, setTreeData1] = useState<TreeSelectProps['treeData']>([])
  const [option, setOption] = useState<KvPairVoString[]>([])
  const [isCustomIcon, setIsCustomIcon] = useState(false)
  const [isCustomIcon1, setIsCustomIcon1] = useState(false)
  const [customIconPath, setCustomIconPath] = useState('')
  const [customIconPath1, setCustomIconPath1] = useState('')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [loading, setLoading] = useState(false)
  const hasInitialized = useRef(false)
  const endpointOptions = [
    { label: 'PC', value: 'PC' },
    { label: 'H5', value: 'H5' },
  ];

  // 页面路径不做特殊字符限制（仅保留必填/业务校验）

  // 常用图标列表
  const getIconOptions = () => {
    const iconList = [
      { label: '首页', value: 'HomeOutlined', icon: 'HomeOutlined' },
      { label: '用户', value: 'UserOutlined', icon: 'UserOutlined' },
      { label: '设置', value: 'SettingOutlined', icon: 'SettingOutlined' },
      { label: '菜单', value: 'MenuOutlined', icon: 'MenuOutlined' },
      { label: '文件', value: 'FileOutlined', icon: 'FileOutlined' },
      { label: '文件夹', value: 'FolderOutlined', icon: 'FolderOutlined' },
      { label: '表格', value: 'TableOutlined', icon: 'TableOutlined' },
      { label: '表单', value: 'FormOutlined', icon: 'FormOutlined' },
      { label: '图表', value: 'BarChartOutlined', icon: 'BarChartOutlined' },
      { label: '项目', value: 'ProjectOutlined', icon: 'ProjectOutlined' },
      { label: '团队', value: 'TeamOutlined', icon: 'TeamOutlined' },
      { label: '通知', value: 'BellOutlined', icon: 'BellOutlined' },
      { label: '消息', value: 'MessageOutlined', icon: 'MessageOutlined' },
      { label: '搜索', value: 'SearchOutlined', icon: 'SearchOutlined' },
      { label: '编辑', value: 'EditOutlined', icon: 'EditOutlined' },
      { label: '删除', value: 'DeleteOutlined', icon: 'DeleteOutlined' },
      { label: '添加', value: 'PlusOutlined', icon: 'PlusOutlined' },
      { label: '保存', value: 'SaveOutlined', icon: 'SaveOutlined' },
      { label: '上传', value: 'UploadOutlined', icon: 'UploadOutlined' },
      { label: '下载', value: 'DownloadOutlined', icon: 'DownloadOutlined' },
      { label: '打印', value: 'PrinterOutlined', icon: 'PrinterOutlined' },
      { label: '刷新', value: 'ReloadOutlined', icon: 'ReloadOutlined' },
      { label: '关闭', value: 'CloseOutlined', icon: 'CloseOutlined' },
      { label: '检查', value: 'CheckOutlined', icon: 'CheckOutlined' },
      { label: '警告', value: 'WarningOutlined', icon: 'WarningOutlined' },
      { label: '信息', value: 'InfoCircleOutlined', icon: 'InfoCircleOutlined' },
      { label: '问号', value: 'QuestionCircleOutlined', icon: 'QuestionCircleOutlined' },
      { label: '星标', value: 'StarOutlined', icon: 'StarOutlined' },
      { label: '心形', value: 'HeartOutlined', icon: 'HeartOutlined' },
      { label: '皇冠', value: 'CrownOutlined', icon: 'CrownOutlined' },
    ];
    const options = iconList.map(item => {
      const IconComponent = (Icons as any)[item.icon];
      return {
        ...item,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {IconComponent ? React.createElement(IconComponent) : null}
            <span>{item.label}</span>
          </div>
        ),
      };
    });
    // 添加自定义路径选项
    options.push({
      value: '__CUSTOM__',
      icon: '',
      label: <span>自定义路径</span>,
    });
    return options;
  };
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'id',
      width: '20%',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'id',
    },
    {
      title: '环境',
      dataIndex: 'endpoint',
      key: 'endpoint',
      width: '10%',
    },
    {
      title: 'icon',
      dataIndex: 'icon',
      key: 'id',
      // render: (text, record) => {
      //   return <Icon  icon={text}/>;
      // },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      // render: (text, record) => {
      //   return <Icon  icon={text}/>;
      // },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_text: unknown, record: MenuVo) => [
        <a
          key="edit"
          style={{
            marginRight: '20px',
          }}
          onClick={() => {
            const id = record.id;
            if (!id) {
              message.error('无法修改：缺少菜单 id');
              return;
            }
            setRowId(id);
            console.log(record);
            // 判断是否是自定义路径（不是预设的图标名称）
            const isCustom = record.icon && !getIconOptions().some(opt => opt.value === record.icon && opt.value !== '__CUSTOM__');
            if (isCustom) {
              setIsCustomIcon1(true);
              setCustomIconPath1(record.icon);
              form1.setFieldsValue({ ...record, icon: '__CUSTOM__' });
            } else {
              setIsCustomIcon1(false);
              setCustomIconPath1('');
              form1.setFieldsValue(record);
            }
            setIsModalOpen1(true)
          }}
        >
          修改
        </a>,
        <a
          key="auth"
          style={{
            marginRight: '20px',
          }}
          onClick={() => {
            const id = record.id;
            if (!id) {
              message.error('无法授权：缺少菜单 id');
              return;
            }
            console.log(record);
            setRowId(id);
            getMenuRole(id);
            setIsModalOpen2(true)
          }}
        >
          授权
        </a>,

        <Popconfirm
          key="delete"
          title="删除菜单"
          description="是否删除当前菜单?"
          onConfirm={async () => {
            const id = record.id;
            if (!id) {
              message.error('无法删除：缺少菜单 id');
              return;
            }
            try {
              await systemApi2.deleteMenu({ id });
              message.success('删除成功');
              await getMenuList();
            } catch (error: any) {
              console.error('删除菜单失败:', error);
              message.error(error?.message || '删除菜单失败，请稍后重试');
            }
          }}
          onCancel={() => {
            // 取消删除不需要提示错误
          }}
          okText="是"
          cancelText="否"
        >
        <a
          style={{
            color: 'red',
          }}
        >
          删除
        </a></Popconfirm>,
      ],
    },
  ];

  const getMenuList = async () => {
    if (loading) return; // 防止重复请求
    setLoading(true);
    try {
      const data = await systemApi.getMenuList();
      setTreeData(data);
      setPagination(prev => ({
        ...prev,
        total: data.length,
      }));
      console.log('data', data);
      const data2: TreeSelectProps['treeData'] = [{
        value: '',
        title: '/',
        children: data as TreeSelectProps['treeData'],
      }];
      setTreeData1(data2);
      console.log('data2', data2);
    } catch (error: any) {
      console.error('获取菜单列表失败:', error);
      message.error(error?.message || '获取菜单列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }

  const handleTableChange = (page: number, pageSize: number) => {
    setPagination(prev => {
      // 如果 pageSize 改变，重置到第一页
      const newCurrent = prev.pageSize !== pageSize ? 1 : page;
      return {
        ...prev,
        current: newCurrent,
        pageSize: pageSize,
      };
    });
  };
  const createMenu = async (value: FieldType) => {
    try {
      // 如果选择了自定义路径，使用自定义路径；否则使用选择的图标值
      const iconValue = isCustomIcon ? customIconPath : (value.icon || 'Crown');
      await systemApi.createMenu({
        menuDto: {
          name: value.name ?? '',
          path: value.path,
          icon: iconValue,
          sort: value.sort ?? 0,
          parentId: value.parentId || undefined,
          endpoint: value.endpoint as MenuDtoEndpointEnum,
        }
      });
      setIsModalOpen(false);
      setIsCustomIcon(false);
      setCustomIconPath('');
      form.resetFields();
      await getMenuList();
      message.success('创建成功');
    } catch (error: any) {
      console.error('创建菜单失败:', error);
      message.error(error?.message || '创建菜单失败，请稍后重试');
    }
  }


  const getMenuRole = async (rowId: string) => {
    try {
      const data = await systemApi.getMenuRole({ id: rowId });
      form2.setFieldsValue({
        name: Array.isArray(data) ? data : [],
      });
    } catch (error: any) {
      console.error('获取菜单角色失败:', error);
      message.error(error?.message || '获取菜单角色失败，请稍后重试');
    }
  }

  const fetchRole = async () => {
    try {
      const dataList = await systemApi.allRole({});
      console.log(dataList);
      setOption(dataList);
    } catch (error: any) {
      console.error('获取角色列表失败:', error);
      message.error(error?.message || '获取角色列表失败，请稍后重试');
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsCustomIcon(false);
    setCustomIconPath('');
    form.resetFields();
  };


  const handleCancel1 = () => {
    setIsModalOpen1(false);
    setIsCustomIcon1(false);
    setCustomIconPath1('');
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    createMenu(values)

  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish1: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      console.log('Success:', values);
      // 如果选择了自定义路径，使用自定义路径；否则使用选择的图标值
      const iconValue = isCustomIcon1 ? customIconPath1 : (values.icon || 'Crown');
      await systemApi.updateMenu({
        id: rowId,
        menuDto: {
          name: values.name ?? '',
          path: values.path,
          icon: iconValue,
          sort: values.sort ?? 0,
          parentId: values.parentId || undefined,
          endpoint: values.endpoint as MenuDtoEndpointEnum,
        }
      });
      setIsModalOpen1(false);
      setIsCustomIcon1(false);
      setCustomIconPath1('');
      await getMenuList();
      message.success('修改成功');
    } catch (error: any) {
      console.error('修改菜单失败:', error);
      message.error(error?.message || '修改菜单失败，请稍后重试');
    }
  };

  const onFinishFailed1: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  const onFinish2: FormProps<MenuRoleFormType>['onFinish'] = async (values) => {
    try {
      console.log('Success:', values);
      /** 接口 body 经 JSON.stringify：Set 会变成 {}，后端需数组，故传数组并满足 OpenAPI 的 Set 类型断言 */
      const roleIds = (values.name ?? []).filter((id) => id !== undefined && id !== null && String(id).trim() !== '');
      if (!rowId) {
        message.error('缺少菜单 id');
        return;
      }
      await systemApi.setMenuRole({
        id: rowId,
        requestBody: roleIds as unknown as Set<string>,
      });
      setIsModalOpen2(false);
      message.success('修改成功');
    } catch (error: any) {
      console.error('设置菜单角色失败:', error);
      message.error(error?.message || '设置菜单角色失败，请稍后重试');
    }
  };

  const onFinishFailed2: FormProps<MenuRoleFormType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  const [value, setValue] = useState<string>();

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  const onPopupScroll: TreeSelectProps['onPopupScroll'] = (e) => {
    console.log('onPopupScroll', e);
  };
  useEffect(() => {
    if (hasInitialized.current) return; // 防止重复初始化
    hasInitialized.current = true;
    fetchRole()
    getMenuList()
  }, []);
  return (
    <div>
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'scroll',
        }}
        content="欢迎使用菜单管理模块"
        extra={[
          <Button type={'primary'} key="1" onClick={() => {
            setIsModalOpen(true)
          }}>
            +新增菜单
          </Button>,
        ]}
      >
        <Table
          columns={columns}
          rowKey={'id'}
          loading={loading}
          dataSource={treeData.slice((pagination.current - 1) * pagination.pageSize, pagination.current * pagination.pageSize)}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
            showQuickJumper: true,
          }}
        />
      </PageContainer>
      <Modal title="新增菜单" open={isModalOpen} footer={false} onCancel={handleCancel}>
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
            label="父级菜单"
            name="parentId"
          >
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择父级菜单"
              allowClear
              treeDefaultExpandAll={false}
              onChange={onChange}
              treeData={treeData1}
              onPopupScroll={onPopupScroll}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="目录名称"
            name="name"
            rules={[{ required: true, message: '目录名称' }]}
          >
            <Input placeholder="请输入目录名称"/>
          </Form.Item>
          <Form.Item<FieldType>
            label="图标"
            name="icon"
          >
            <Select
              placeholder="请选择图标或自定义路径"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                const q = String(input ?? '').toLowerCase();
                const val = String(option?.value ?? '').toLowerCase();
                if (val.includes(q)) return true;
                const lab = option?.label;
                if (typeof lab === 'string' || typeof lab === 'number') {
                  return String(lab).toLowerCase().includes(q);
                }
                return false;
              }}
              onChange={(value) => {
                if (value === '__CUSTOM__') {
                  setIsCustomIcon(true);
                  form.setFieldsValue({ icon: customIconPath });
                } else {
                  setIsCustomIcon(false);
                  form.setFieldsValue({ icon: value });
                }
              }}
            >
              {getIconOptions().map(item => (
                <Select.Option key={item.value} value={item.value} label={item.label}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {isCustomIcon && (
            <Form.Item<FieldType>
              label="图标路径"
              name="icon"
              rules={[{ required: true, message: '请输入图标路径' }]}
            >
              <Input
                placeholder="请输入图标路径"
                value={customIconPath}
                onChange={(e) => {
                  setCustomIconPath(e.target.value);
                  form.setFieldsValue({ icon: e.target.value });
                }}
              />
            </Form.Item>
          )}
          <Form.Item<FieldType>
            label="客户端"
            name="endpoint"
            rules={[{ required: true, message: '请选择客户端' }]}
          >
            <Select options={endpointOptions} placeholder="请选择客户端" />
          </Form.Item>
          <Form.Item<FieldType>
            label="页面路径"
            name="path"
            rules={[]}
          >
            <Input placeholder="请输入页面路径" />
          </Form.Item>
          <Form.Item<FieldType>
            label="排序"
            name="sort"
            rules={[{ required: true, message: '排序' }]}
          >

            <Input type="number" placeholder="请输入排序"/>
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

      <Modal title="修改菜单" open={isModalOpen1} footer={false} onCancel={handleCancel1}>
        <Form
          form={form1}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish1}
          onFinishFailed={onFinishFailed1}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="父级菜单"
            name="parentId"
          >
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择父级菜单"
              allowClear
              treeDefaultExpandAll={false}
              onChange={onChange}
              treeData={treeData1}
              onPopupScroll={onPopupScroll}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="目录名称"
            name="name"
            rules={[{ required: true, message: '目录名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="图标"
            name="icon"
          >
            <Select
              placeholder="请选择图标或自定义路径"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                const q = String(input ?? '').toLowerCase();
                const val = String(option?.value ?? '').toLowerCase();
                if (val.includes(q)) return true;
                const lab = option?.label;
                if (typeof lab === 'string' || typeof lab === 'number') {
                  return String(lab).toLowerCase().includes(q);
                }
                return false;
              }}
              onChange={(value) => {
                if (value === '__CUSTOM__') {
                  setIsCustomIcon1(true);
                  form1.setFieldsValue({ icon: customIconPath1 });
                } else {
                  setIsCustomIcon1(false);
                  form1.setFieldsValue({ icon: value });
                }
              }}
            >
              {getIconOptions().map(item => (
                <Select.Option key={item.value} value={item.value} label={item.label}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {isCustomIcon1 && (
            <Form.Item<FieldType>
              label="图标路径"
              name="icon"
              rules={[{ required: true, message: '请输入图标路径' }]}
            >
              <Input
                placeholder="请输入图标路径"
                value={customIconPath1}
                onChange={(e) => {
                  setCustomIconPath1(e.target.value);
                  form1.setFieldsValue({ icon: e.target.value });
                }}
              />
            </Form.Item>
          )}
          <Form.Item<FieldType>
            label="客户端"
            name="endpoint"
            rules={[{ required: true, message: '请选择客户端' }]}
          >
            <Select options={endpointOptions} placeholder="请选择客户端" />
          </Form.Item>
          <Form.Item<FieldType>
            label="页面路径"
            name="path"
            rules={[]}
          >
            <Input placeholder="请输入页面路径" />
          </Form.Item>
          <Form.Item<FieldType>
            label="排序"
            name="sort"
            rules={[{ required: true, message: '排序' }]}
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

      <Modal title="菜单授权" open={isModalOpen2} footer={false} onCancel={handleCancel2}>
        <Form<MenuRoleFormType>
          form={form2}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ name: [] }}
          onFinish={onFinish2}
          onFinishFailed={onFinishFailed2}
          autoComplete="off"
        >
          <Form.Item<MenuRoleFormType>
            label="选择角色"
            name="name"
          >
            <Select
              mode="multiple"
              // disabled
              style={{ width: '100%' }}
              placeholder="Please select"
              // defaultValue={['a10', 'c12']}
              // onChange={handleChange}
              options={option}
            />
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
    </div>
  );
};

export default MenuManage;
