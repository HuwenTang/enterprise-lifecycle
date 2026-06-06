import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Modal, Pagination,
  Select,
  Switch,
  Table,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import OrgStruct from '@/pages/DictManage/components/OrgStruct';
import { systemApi, systemApi2 } from '@/services/api';

type FieldType = {
  label?: string;
  code?: string;
  sort?: number;
  enabled?: boolean;
};
const DictManage = () => {
  const [orgId, setOrgId] = useState('0');
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [parentId, setParentId] = useState('');
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getDictList = async () => {
    try {
      const data = await systemApi.getDictItems({
        catalog: parentId,
        all: true,
      });
      setDataSource(data);
      setPagination((prev) => ({ ...prev, current: 1, total: data.length }));
    } catch {
      // 获取字典列表失败时静默处理
    }
  };

  useEffect(() => {
    const lx = (window as any).lx;
    if (lx?.device?.getSystemInfo) {
      lx.device.getSystemInfo({
        success: (res: { systemType?: string }) => {
          if (res.systemType === 'iOS' || res.systemType === 'Android') {
            setCollapsed((c) => !c);
          }
        },
        fail: () => {},
      });
    }
  }, []);

  useEffect(() => {
    getDictList();
  }, [parentId]);

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    systemApi2.createOrUpdateDictItem({
      systemDictDto: {
        catalog: parentId,
        label: values.label ?? '',
        enabled: values.enabled ?? false,
        sort: Number(values.sort) || 0,
        code: values.code ?? '',
      },
    }).then(() => {
      form.resetFields();
      getDictList()
      setIsModalOpen(false);
    }).catch(() => {
      message.error('创建失败')
    })
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_: unknown, _record: unknown, index: number) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: '字典代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '字典名称',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      render: (_text: unknown, record: { label?: string; enabled?: boolean; sort?: number; code?: string }) => {
        return (
          <div>
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              checked={record.enabled}
              onChange={async (value) => {
                try {
                  await systemApi2.createOrUpdateDictItem({
                    systemDictDto: {
                      catalog: parentId,
                      label: record.label ?? '',
                      enabled: Boolean(value),
                      sort: Number(record.sort) || 0,
                      code: record.code ?? '',
                    },
                  });
                  getDictList();
                } catch (e) {
                  const response = e as Response;
                  const resp = await response.json();
                  message.error(resp.message);
                }
              }}
            />
          </div>
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_text: unknown, record: { label?: string; enabled?: boolean; sort?: number; code?: string }) => [
        <a
          style={{
            marginRight: '20px',
          }}
          key="down"
          onClick={() => {
            showModal();
            // getUserRole(record.id);
            console.log(record);
            // getRoleList();
            // setUser(record);
            form.setFieldsValue({
              label:record.label,
              code: record.code,
              enabled: record.enabled,
              sort:record.sort
            });
          }}
        >
          修改
        </a>,
        <a
          style={{
            color: 'red',
          }}
          key="delete"
          onClick={() => {
            console.log(record)
           if(record.enabled){
             systemApi2.createOrUpdateDictItem({
               systemDictDto: {
                 catalog: parentId,
                 label: record.label ?? '',
                 enabled: false,
                 sort: Number(record.sort) || 0,
                 code: record.code ?? '',
               },
             }).then(() => {
               getDictList()
               message.success('禁用成功')
             })
           }else {
             message.info('当前字典已禁用')
           }
          }}
        >
          禁用
        </a>,
      ],
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <OrgStruct setParentId={setParentId} setOrgId={setOrgId} setCatalog={setParentId} responsive={collapsed} />
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'scroll',
        }}
        content={`${parentId}`}
        extra={[
          <Button type={'primary'} key="1" onClick={() => setIsModalOpen(true)}>
            +新增字典
          </Button>,
        ]}
      >
        <Table
          columns={columns}
          bordered={true}
          dataSource={dataSource.slice(
            (pagination.current - 1) * pagination.pageSize,
            pagination.current * pagination.pageSize,
          )}
          pagination={false}
        />
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          showTotal={(total) => `共 ${total} 条`}
          total={pagination.total}
          onChange={(page, pageSize) => {
            setPagination((prev) => ({ ...prev, current: page, pageSize: pageSize ?? prev.pageSize }))
          }} // 直接在 Pagination 中更新页码状态以触发数据获取
          style={{ marginTop: '16px' }} // 可选：添加一些样式间距以改善布局
        />
        <Modal title="字典修改" open={isModalOpen} footer={false} onCancel={handleCancel}>
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
            <Form.Item<FieldType> label="字典名称" name="label">
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="字典编码" name="code">
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="字典排序" name="sort">
              <Input type="number"/>
            </Form.Item>

            <Form.Item<FieldType> label="是否启用" name="enabled">
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
    </div>
  );
};

export default DictManage;
