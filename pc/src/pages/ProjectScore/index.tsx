import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import { request } from '@umijs/max';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { TextArea } = Input;

interface ScoreDataType {
  id?: number;
  zoneName: string;
  district: string;
  districtCode: string;
  zoneCode: string;
  year: number;
  month: number;
  score: number;
  remark?: string;
  createTime?: string;
}

// 月份选项
const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}月`,
  value: String(i + 1),
}));

const ProjectScore = () => {
  const [searchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [tableData, setTableData] = useState<ScoreDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ScoreDataType | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>([]);
  const [zoneOptions, setZoneOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    fetchDistrictList();
    handleSearch();
  }, []);

  // 获取市（区）列表
  const fetchDistrictList = async () => {
    try {
      const response = await request('/zsxt-api/tCommonDept/getDeptListByPid', {
        method: 'POST',
        data: { pid: '001' },
      });
      
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.text,
          value: item.id,
        }));
        setDistrictOptions(options);
      }
    } catch (error) {
      console.error('获取市（区）列表失败:', error);
    }
  };

  // 获取园区列表
  const fetchZoneList = async (districtCode: string) => {
    if (!districtCode) {
      setZoneOptions([]);
      return;
    }
    
    try {
      const response = await request('/zsxt-api/tCommonDept/getDeptByPidForTreeSelect', {
        method: 'POST',
        data: { pid: districtCode },
      });
      
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.deptName,
          value: item.deptCode,
        }));
        setZoneOptions(options);
      }
    } catch (error) {
      console.error('获取园区列表失败:', error);
    }
  };

  const handleSearch = async (page = 1) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const data: any = {};
      
      if (values.year) {
        data.year = values.year.format('YYYY');
      }
      
      const response = await request(`/zsxt-api/tProjScore/list?page=${page}&size=${pagination.pageSize}`, {
        method: 'POST',
        data,
      });
      
      if (response && response.records) {
        setTableData(response.records);
        setPagination({ ...pagination, current: page, total: response.total || 0 });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentRecord(null);
    editForm.resetFields();
    setZoneOptions([]);
    setEditModalVisible(true);
  };

  const handleEdit = (record: ScoreDataType) => {
    setCurrentRecord(record);
    editForm.setFieldsValue({
      districtCode: record.districtCode,
      zoneCode: record.zoneCode,
      year: record.year ? dayjs(String(record.year)) : null,
      month: String(record.month),
      score: record.score,
      remark: record.remark,
    });
    
    // 加载园区选项
    if (record.districtCode) {
      fetchZoneList(record.districtCode);
    }
    
    setEditModalVisible(true);
  };

  const handleDelete = (record: ScoreDataType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条加分记录吗？',
      onOk: async () => {
        try {
          await request(`/zsxt-api/tProjScore/${record.id}`, {
            method: 'DELETE',
          });
          message.success('删除成功');
          handleSearch(pagination.current);
        } catch (error) {
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await editForm.validateFields();
      
      // 获取选中的文本
      const districtText = districtOptions.find(d => d.value === values.districtCode)?.label || '';
      const zoneText = zoneOptions.find(z => z.value === values.zoneCode)?.label || '';
      
      const data = {
        districtCode: values.districtCode,
        district: districtText,
        zoneCode: values.zoneCode,
        zoneName: zoneText,
        year: values.year ? parseInt(values.year.format('YYYY')) : null,
        month: parseInt(values.month),
        score: values.score,
        remark: values.remark || '',
      };
      
      if (currentRecord?.id) {
        // 编辑
        await request(`/zsxt-api/tProjScore/${currentRecord.id}`, {
          method: 'PUT',
          data,
        });
        message.success('修改成功');
      } else {
        // 新增
        await request('/zsxt-api/tProjScore', {
          method: 'POST',
          data,
        });
        message.success('新增成功');
      }
      
      setEditModalVisible(false);
      handleSearch(pagination.current);
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const columns: ColumnsType<ScoreDataType> = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: '园区名称', dataIndex: 'zoneName', key: 'zoneName', width: 200 },
    { title: '年份', dataIndex: 'year', key: 'year', width: 100 },
    { title: '月份', dataIndex: 'month', key: 'month', width: 80, render: (month: number) => `${month}月` },
    { title: '加分分值', dataIndex: 'score', key: 'score', width: 100 },
    { title: '备注信息', dataIndex: 'remark', key: 'remark', width: 300, ellipsis: true },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '85px',
              height: '28px',
              background: '#ff9800',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#fff',
            }}
            onClick={() => handleEdit(record)}
          >
            <div>查看修改</div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
          </div>
          <div
            style={{
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
            onClick={() => handleDelete(record)}
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

          <Form form={searchForm} name="searchForm">
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="年份" name="year">
                  <DatePicker picker="year" placeholder="请选择年份" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Space>
                  <Button type="primary" onClick={() => handleSearch(1)}>
                    查询
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Button type="primary" onClick={handleAdd}>
              新增
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={tableData}
            loading={loading}
            rowKey="id"
            bordered
            scroll={{ x: 1000 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (page, pageSize) => {
                setPagination({ ...pagination, current: page, pageSize: pageSize || 10 });
                handleSearch(page);
              },
            }}
          />
        </div>
      </div>

      <Modal
        title={currentRecord ? '修改项目加分' : '添加项目加分'}
        open={editModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
        }}
        width={700}
        okText="保存"
        cancelText="取消"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="市区"
            name="districtCode"
            rules={[{ required: true, message: '请选择市区' }]}
          >
            <Select
              placeholder="请选择市区"
              onChange={(value) => {
                fetchZoneList(value as string);
                editForm.setFieldsValue({ zoneCode: undefined });
              }}
            >
              {districtOptions.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="园区"
            name="zoneCode"
            rules={[{ required: true, message: '请选择园区' }]}
          >
            <Select
              placeholder="请先选择市区"
            >
              {zoneOptions.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="年份"
            name="year"
            rules={[{ required: true, message: '请选择年份' }]}
          >
            <DatePicker picker="year" placeholder="请选择年份" style={{ width: '100%' }} format="YYYY" />
          </Form.Item>

          <Form.Item
            label="月份"
            name="month"
            rules={[{ required: true, message: '请选择月份' }]}
          >
            <Select placeholder="请选择月份">
              {monthOptions.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="分值"
            name="score"
            rules={[{ required: true, message: '请填写加分分值' }]}
          >
            <Input placeholder="请填写加分分值" type="number" step="0.1" />
          </Form.Item>

          <Form.Item label="备注信息" name="remark">
            <TextArea rows={5} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ProjectScore;
