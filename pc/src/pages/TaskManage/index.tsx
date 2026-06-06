import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import { request } from '@umijs/max';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface TaskDataType {
  id?: string;
  _id?: string;
  byear: string;
  district: string;
  districtCode: string;
  zoneName: string;
  zoneCode: string;
  townName?: string;
  townCode?: string;
  oneCount: number;
  fiveCount: number;
  tenCount: number;
  taskCount?: number;
  taskCountF?: number;
  sfqx?: boolean;
}

const TaskManage = () => {
  const [searchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [tableData, setTableData] = useState<TaskDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<TaskDataType | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>([]);
  const [zoneOptions, setZoneOptions] = useState<{ label: string; value: string }[]>([]);
  const [searchZoneOptions, setSearchZoneOptions] = useState<{ label: string; value: string }[]>([]);
  const [townOptions, setTownOptions] = useState<{ label: string; value: string }[]>([]);

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
  const fetchZoneList = async (districtCode: string, isSearch = false) => {
    if (!districtCode) {
      if (isSearch) {
        setSearchZoneOptions([]);
      } else {
        setZoneOptions([]);
      }
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
        
        if (isSearch) {
          setSearchZoneOptions(options);
        } else {
          setZoneOptions(options);
        }
      }
    } catch (error) {
      console.error('获取园区列表失败:', error);
    }
  };

  // 获取街镇列表
  const fetchTownList = async (zoneCode: string) => {
    if (!zoneCode) {
      setTownOptions([]);
      return;
    }
    
    try {
      const response = await request('/zsxt-api/tCommonDept/getDeptByPidForTreeSelect', {
        method: 'POST',
        data: { pid: zoneCode },
      });
      
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.deptName,
          value: item.deptCode,
        }));
        setTownOptions(options);
      }
    } catch (error) {
      console.error('获取街镇列表失败:', error);
    }
  };

  const handleSearch = async (page = 1) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const data: any = {};
      
      if (values.byear) {
        data.byear = values.byear.format('YYYY');
      }
      if (values.districtCode) {
        data.districtCode = values.districtCode;
      }
      if (values.zoneCode) {
        data.zoneCode = values.zoneCode;
      }
      
      const response = await request(`/zsxt-api/tProjTask/list?page=${page}&size=${pagination.pageSize}`, {
        method: 'POST',
        data,
      });
      
      if (response && response.records) {
        setTableData(response.records);
        setPagination({ ...pagination, current: page, total: response.total || 0 });
      }
    } catch (error) {
      console.error('查询失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentRecord(null);
    editForm.resetFields();
    setZoneOptions([]);
    setTownOptions([]);
    setEditModalVisible(true);
  };

  const handleEdit = (record: TaskDataType) => {
    setCurrentRecord(record);
    editForm.setFieldsValue({
      byear: record.byear ? dayjs(record.byear) : null,
      districtCode: record.districtCode,
      zoneCode: record.zoneCode,
      townCode: record.townCode,
      oneCount: record.oneCount,
      fiveCount: record.fiveCount,
      tenCount: record.tenCount,
    });
    
    // 加载园区和街镇选项
    if (record.districtCode) {
      fetchZoneList(record.districtCode);
    }
    if (record.zoneCode) {
      fetchTownList(record.zoneCode);
    }
    
    setEditModalVisible(true);
  };

  const handleDelete = (record: TaskDataType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条任务记录吗？',
      onOk: async () => {
        try {
          const recordId = record.id || record._id;
          await request(`/zsxt-api/tProjTask/${recordId}`, {
            method: 'DELETE',
          });
          message.success('删除成功');
          handleSearch(pagination.current);
        } catch (error) {
          console.error('删除失败:', error);
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
      const townText = townOptions.find(t => t.value === values.townCode)?.label || '';
      
      const data = {
        districtCode: values.districtCode,
        district: districtText,
        zoneCode: values.zoneCode,
        zoneName: zoneText,
        townCode: values.townCode,
        townName: townText,
        byear: values.byear ? values.byear.format('YYYY') : '',
        oneCount: values.oneCount,
        fiveCount: values.fiveCount,
        tenCount: values.tenCount,
      };
      
      const recordId = currentRecord?.id || currentRecord?._id;
      if (recordId) {
        // 编辑
        await request(`/zsxt-api/tProjTask/${recordId}`, {
          method: 'PUT',
          data,
        });
        message.success('修改成功');
      } else {
        // 新增
        await request('/zsxt-api/tProjTask', {
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

  const columns: ColumnsType<TaskDataType> = [
    {
      title: 'ID',
      key: 'index',
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: '所属年份', dataIndex: 'byear', key: 'byear', width: 100 },
    { title: '所属市区', dataIndex: 'district', key: 'district', width: 150 },
    { title: '园区', dataIndex: 'zoneName', key: 'zoneName', width: 200 },
    { title: '1亿任务数量', dataIndex: 'oneCount', key: 'oneCount', width: 120 },
    { title: '5亿任务数量', dataIndex: 'fiveCount', key: 'fiveCount', width: 120 },
    { title: '10亿任务数量', dataIndex: 'tenCount', key: 'tenCount', width: 120 },
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
                <Form.Item label="年份" name="byear">
                  <DatePicker picker="year" placeholder="请选择年份" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="市区" name="districtCode">
                  <Select
                    placeholder="请选择市区"
                    allowClear
                    onChange={(value) => fetchZoneList(value as string, true)}
                  >
                    {districtOptions.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="园区" name="zoneCode">
                  <Select placeholder="请先选择市区" allowClear>
                    {searchZoneOptions.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
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
              新任务
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={tableData}
            loading={loading}
            rowKey="_id"
            bordered
            scroll={{ x: 1100 }}
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
        title={currentRecord ? '修改项目任务' : '添加任务'}
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
                editForm.setFieldsValue({ zoneCode: undefined, townCode: undefined });
              }}
            >
              {districtOptions.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="园区" name="zoneCode">
                <Select
                  placeholder="请先选择市区"
                  allowClear
                  onChange={(value) => {
                    fetchTownList(value as string);
                  }}
                >
                  {zoneOptions.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="街镇" name="townCode">
                <Select placeholder="请选择街镇" allowClear>
                  {townOptions.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="年份"
            name="byear"
            rules={[{ required: true, message: '请选择年份' }]}
          >
            <DatePicker picker="year" placeholder="请选择年份" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="1亿项目任务数" name="oneCount">
            <Input placeholder="请输入1亿项目任务数" type="number" />
          </Form.Item>

          <Form.Item label="5亿项目任务数" name="fiveCount">
            <Input placeholder="请输入5亿项目任务数" type="number" />
          </Form.Item>

          <Form.Item label="10亿项目任务数" name="tenCount">
            <Input placeholder="请输入10亿项目任务数" type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default TaskManage;
