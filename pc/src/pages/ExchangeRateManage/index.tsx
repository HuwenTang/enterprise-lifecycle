import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, DatePicker, Form, Input, message, Modal, Popconfirm, Row, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { request } from '@umijs/max';

type SearchFieldType = {
  s_year?: string;
};

type FormFieldType = {
  _id?: string;
  b_year?: string;
  exchange_rate?: string;
};

interface DataType {
  id: string;
  byear: string;
  exchangeRate: string;
}

const ExchangeRateManage = () => {
  const [searchForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // 分页状态管理
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 数据源
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('添加汇率信息');
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);

  // 获取数据
  const fetchData = async (page: number = pagination.current, pageSize: number = pagination.pageSize) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const response = await request(`/zsxt-api/tProjExchange/list?page=${page}&size=${pageSize}`, {
        method: 'POST',
        data: {
          byear: values.s_year ? dayjs(values.s_year).format('YYYY') : undefined,
        },
      });
      
      if (response && response.records) {
        setDataSource(response.records);
        setPagination({
          current: response.page || page,
          pageSize: response.size || pageSize,
          total: response.total || 0
        });
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchData();
  }, []);

  // 搜索
  const onSearch = () => {
    fetchData(1);
  };

  // 新增
  const handleAdd = () => {
    setModalTitle('添加汇率信息');
    setEditingRecord(null);
    editForm.resetFields();
    setIsModalOpen(true);
  };

  // 编辑
  const handleEdit = async (record: DataType) => {
    setModalTitle('编辑汇率信息');
    setEditingRecord(record);
    
    editForm.setFieldsValue({
      b_year: record.byear ? dayjs(record.byear) : undefined,
      exchange_rate: record.exchangeRate,
    });
    setIsModalOpen(true);
  };

  // 删除
  const handleDelete = async (record: DataType) => {
    try {
      await request(`/zsxt-api/tProjExchange/delete/${record.id}`, {
        method: 'DELETE',
      });
      
      message.success('删除成功');
      fetchData();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 保存
  const handleSave = async () => {
    try {
      const values = await editForm.validateFields();
      
      // 处理数据
      const data = {
        byear: values.b_year ? dayjs(values.b_year).format('YYYY') : '',
        exchangeRate: Number(values.exchange_rate),
      };

      if (editingRecord) {
        // 编辑：调用更新接口
        await request('/zsxt-api/tProjExchange/update', {
          method: 'POST',
          data: {
            id: editingRecord.id,
            ...data,
          },
        });
      } else {
        // 新增：调用创建接口
        await request('/zsxt-api/tProjExchange/create', {
          method: 'POST',
          data,
        });
      }
      
      message.success('保存成功');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  // 分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ ...pagination, current: page, pageSize });
    fetchData(page, pageSize);
  };

  // 表格列定义
  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      key: 'index',
      width: 80,
      align: 'center',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: '年份',
      dataIndex: 'byear',
      key: 'byear',
      width: 200,
      align: 'center',
    },
    {
      title: '汇率',
      dataIndex: 'exchangeRate',
      key: 'exchangeRate',
      width: 200,
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '70px',
              height: '28px',
              background: '#1890FF',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#fff',
            }}
            onClick={() => handleEdit(record)}
          >
            <div>编辑</div>
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
              background: 'red',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#fff',
            }}
            onClick={() => {
              Modal.confirm({
                title: '确定要删除吗？',
                onOk: () => handleDelete(record),
                okText: '确定',
                cancelText: '取消',
              });
            }}
          >
            <div>删除</div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/del.png" alt="" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <div style={{ background: '#fff' }}>
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
          {/* 搜索表单 */}
          <Form
            form={searchForm}
            name="searchForm"
          >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item<SearchFieldType> label="年份" name="s_year">
                <DatePicker picker="year" placeholder="请选择年份" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Form.Item style={{ marginBottom: 0 }}>
                <Space>
                  <Button type="primary" onClick={handleAdd}>
                    添加
                  </Button>
                  <Button type="primary" onClick={onSearch}>
                    查询
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        </div>

        {/* 数据表格 */}
        <Table
          style={{ marginTop: 20, padding: '0 20px 20px' }}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handlePageChange,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      {/* 编辑弹窗 */}
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        width={400}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={editForm}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Form.Item<FormFieldType>
            label="年份"
            name="b_year"
            rules={[{ required: true, message: '请选择年份' }]}
          >
            <DatePicker picker="year" placeholder="请选择年份" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="美元汇率"
            name="exchange_rate"
            rules={[
              { required: true, message: '请输入美元汇率' },
              {
                pattern: /^(([1-9][0-9]*(\.)?[0-9]*)|(0(\.)([0-9]*))|(0))$/,
                message: '请输入非负数',
              },
            ]}
          >
            <Input
              placeholder="请填写美元汇率"
              maxLength={20}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ExchangeRateManage;
