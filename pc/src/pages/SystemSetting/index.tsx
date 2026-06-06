import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Table,
} from 'antd';
import type { TablePaginationConfig } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { systemApi, systemApi2 } from '@/services/api';
import type { SystemSettingDto, SystemSettingVo } from '@/services/apis';

type FieldType = {
  name?: string;
  value?: string;
  description?: string;
};

const SystemSetting: React.FC = () => {
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [dataSource, setDataSource] = useState<SystemSettingVo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);

  const fetchData = async (page = pagination.current, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const data = await systemApi2.listSystemSetting({ page, size });
      setDataSource(data.records ?? []);
      setPagination((prev) => ({
        ...prev,
        current: data.page ?? page,
        pageSize: data.size ?? size,
        total: data.total ?? 0,
      }));
    } catch (err: unknown) {
      console.error('获取系统配置列表失败:', err);
      let errMsg = '获取系统配置列表失败';
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response: Response }).response;
        if (res?.status === 401) errMsg = '未登录或登录已过期，请重新登录';
        else if (res?.status === 403) errMsg = '无权限访问系统配置';
        else if (res?.status === 404) errMsg = '系统配置接口不存在，请确认后端服务已启动';
        else if (res?.status >= 500) errMsg = '服务端错误，请稍后重试';
      } else if (err instanceof Error) {
        if (err.message?.includes('fetch') || err.message?.includes('network')) {
          errMsg = '网络连接失败，请检查后端服务是否启动及代理配置';
        }
      }
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableChange = (pag: TablePaginationConfig) => {
    if (pag?.current !== undefined && pag?.current !== null) {
      setPagination((prev) => ({ ...prev, current: pag.current ?? 1, pageSize: pag.pageSize ?? 10 }));
      fetchData(pag.current, pag.pageSize);
    }
  };

  const showAddModal = () => {
    setEditingName(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (record: SystemSettingVo) => {
    setEditingName(record.name);
    form.setFieldsValue({
      name: record.name,
      value: record.value,
      description: record.description,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const dto: SystemSettingDto = {
      name: values.name ?? '',
      value: values.value ?? '',
      description: values.description ?? '',
    };
    try {
      if (editingName) {
        await systemApi.updateSystemSetting({ name: editingName, systemSettingDto: dto });
        message.success('修改成功');
      } else {
        await systemApi2.createSystemSetting({ systemSettingDto: dto });
        message.success('新增成功');
      }
      handleCancel();
      fetchData(pagination.current, pagination.pageSize);
    } catch {
      message.error(editingName ? '修改失败' : '新增失败');
    }
  };

  const handleDelete = async (name: string) => {
    try {
      await systemApi.deleteSystemSetting({ name });
      message.success('删除成功');
      fetchData(pagination.current, pagination.pageSize);
    } catch {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '配置值',
      dataIndex: 'value',
      key: 'value',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: unknown, record: SystemSettingVo) => (
        <div>
          <Button type="link" size="small" onClick={() => showEditModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该配置？"
            onConfirm={() => handleDelete(record.name)}
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <PageContainer content="系统配置管理">
      <div style={{ padding: '10px', backgroundColor: 'white' }}>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={showAddModal}>
            新增配置
          </Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          rowKey="name"
          pagination={false}
        />
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showTotal={(total) => `共 ${total} 条`}
          onChange={(page, pageSize) => handleTableChange({ current: page, pageSize })}
          style={{ marginTop: 16 }}
        />
        <Modal
          title={editingName ? '编辑配置' : '新增配置'}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item<FieldType>
              label="配置名称"
              name="name"
              rules={[{ required: true, message: '请输入配置名称' }]}
            >
              <Input placeholder="请输入配置名称" disabled={!!editingName} />
            </Form.Item>
            <Form.Item<FieldType>
              label="配置值"
              name="value"
              rules={[{ required: true, message: '请输入配置值' }]}
            >
              <Input placeholder="请输入配置值" />
            </Form.Item>
            <Form.Item<FieldType> label="描述" name="description">
              <Input.TextArea placeholder="请输入描述" rows={3} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default SystemSetting;
