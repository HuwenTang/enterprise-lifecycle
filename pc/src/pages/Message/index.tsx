import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Table, Drawer, TreeSelect } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import { request } from '@umijs/max';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface MessageDataType {
  id?: string;
  _id?: string;
  comName: string;
  name: string;
  phone: string;
  ct: string;
  clIs: number;
  descContent: string;
  clEr?: string;
  clTime?: string;
  clDesc?: string;
  deptCode?: string;
  lyType?: number;
}

interface ProcessHistoryType {
  id?: string;
  _id?: string;
  lyId: string;
  descContent: string;
  ct: string;
  clEr: string;
}

const Message = () => {
  const [searchForm] = Form.useForm();
  const [detailForm] = Form.useForm();
  const [processForm] = Form.useForm();
  const [tableData, setTableData] = useState<MessageDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [allocateModalVisible, setAllocateModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<MessageDataType | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [deptOptions, setDeptOptions] = useState<{ label: string; value: string }[]>([]);
  const [processHistory, setProcessHistory] = useState<ProcessHistoryType[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPagination, setHistoryPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [allocateForm] = Form.useForm();
  const [selectedDeptCode, setSelectedDeptCode] = useState<string>('');

  useEffect(() => {
    handleSearch();
  }, []);


  const handleSearch = async (page = 1) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const data: any = {};
      
      if (values.comName) {
        data.comName = values.comName;
      }
      if (values.clIs !== undefined && values.clIs !== '') {
        data.clIs = values.clIs;
      }
      if (values.dateRange && values.dateRange.length === 2) {
        data.beginTime = values.dateRange[0].format('YYYY-MM-DD');
        data.endTime = values.dateRange[1].format('YYYY-MM-DD');
      }
      
      const response = await request(`/zsxt-api/tLy/list?page=${page}&size=${pagination.pageSize}`, {
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

  const handleDetail = async (record: MessageDataType) => {
    try {
      const response = await request(`/zsxt-api/tLy/${record.id || record._id}`, {
        method: 'GET',
      });
      if (response) {
        setCurrentRecord(response);
        detailForm.setFieldsValue(response);
        setDetailDrawerVisible(true);
        
        // 获取处理历史
        const lyId = record.id || record._id;
        if (lyId) {
          fetchProcessHistory(lyId);
        }
      }
    } catch (error) {
      console.error('获取详情失败:', error);
    }
  };

  const fetchProcessHistory = async (lyId: string, page = 1) => {
    setHistoryLoading(true);
    try {
      const response = await request(`/zsxt-api/tLyDesc/list?page=${page}&size=${historyPagination.pageSize}`, {
        method: 'POST',
        data: { lyId },
      });
      if (response) {
        setProcessHistory(response.records || response.data || []);
        setHistoryPagination({
          current: page,
          pageSize: historyPagination.pageSize,
          total: response.total || 0,
        });
      }
    } catch (error) {
      console.error('获取处理历史失败:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleProcess = (record: MessageDataType) => {
    setCurrentRecord(record);
    processForm.resetFields();
    setProcessModalVisible(true);
  };

  const handleProcessSave = async () => {
    try {
      const values = await processForm.validateFields();
      const recordId = currentRecord?.id || currentRecord?._id;
      
      // 先添加处理记录到 tLyDesc
      await request('/zsxt-api/tLyDesc', {
        method: 'POST',
        data: {
          lyId: recordId,
          descContent: values.clDesc,
        },
      });
      
      message.success('处理成功');
      setProcessModalVisible(false);
      handleSearch(pagination.current);
    } catch (error) {
      console.error('处理失败:', error);
    }
  };

  const buildDeptTree = async (item: any): Promise<any> => {
    const treeItem: any = {
      label: item.deptName,
      value: item.deptCode,
    };
    
    // 递归获取下级部门
    try {
      const childResponse = await request('/zsxt-api/tCommonDept/getDeptByPidForTreeSelect', {
        method: 'POST',
        data: { pid: item.deptCode },
      });
      
      if (childResponse && Array.isArray(childResponse) && childResponse.length > 0) {
        treeItem.children = await Promise.all(childResponse.map(child => buildDeptTree(child)));
      }
    } catch (error) {
      console.error(`获取 ${item.deptCode} 的下级部门失败:`, error);
    }
    
    return treeItem;
  };

  const fetchDeptList = async (pid: string = '001') => {
    try {
      const response = await request('/zsxt-api/tCommonDept/getDeptByPidForTreeSelect', {
        method: 'POST',
        data: { pid },
      });
      
      if (response && Array.isArray(response)) {
        const options = await Promise.all(response.map(item => buildDeptTree(item)));
        setDeptOptions(options);
      }
    } catch (error) {
      console.error('获取部门列表失败:', error);
      message.error('获取部门列表失败');
    }
  };

  const handleAllocate = (record: MessageDataType) => {
    setCurrentRecord(record);
    setSelectedDeptCode('');
    allocateForm.resetFields();
    fetchDeptList();
    setAllocateModalVisible(true);
  };

  const handleAllocateSave = async () => {
    try {
      if (!selectedDeptCode) {
        message.error('请选择部门');
        return;
      }
      
      const recordId = currentRecord?.id || currentRecord?._id;
      await request(`/zsxt-api/tLy/${recordId}`, {
        method: 'PUT',
        data: {
          deptCode: selectedDeptCode,
        },
      });
      message.success('分配成功');
      setAllocateModalVisible(false);
      setSelectedDeptCode('');
      handleSearch(pagination.current);
    } catch (error) {
      console.error('分配失败:', error);
      message.error('分配失败');
    }
  };

  const handleDelete = (record: MessageDataType) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条留言吗？',
      onOk: async () => {
        try {
          const recordId = record.id || record._id;
          await request(`/zsxt-api/tLy/${recordId}`, {
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

  const columns: ColumnsType<MessageDataType> = [
    {
      title: 'ID',
      key: 'index',
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: '企业名称', dataIndex: 'comName', key: 'comName', width: 150 },
    { title: '联系人', dataIndex: 'name', key: 'name', width: 100 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: '留言时间', dataIndex: 'ct', key: 'ct', width: 150 },
    {
      title: '是否分配',
      dataIndex: 'deptCode',
      key: 'deptCode',
      width: 100,
      render: (deptCode: string) => (
        <span style={{ color: deptCode ? 'green' : 'red' }}>
          {deptCode ? '已分配' : '未分配'}
        </span>
      ),
    },
    {
      title: '是否处理',
      dataIndex: 'clIs',
      key: 'clIs',
      width: 100,
      render: (clIs: number) => (
        <span style={{ color: clIs === 1 ? 'green' : 'red' }}>
          {clIs === 1 ? '已处理' : '未处理'}
        </span>
      ),
    },
    {
      title: '留言来源',
      dataIndex: 'lyType',
      key: 'lyType',
      width: 100,
      render: (lyType: number) => {
        const typeMap: { [key: number]: string } = {
          1: '小程序',
          2: 'PC端',
          3: 'APP端',
        };
        return typeMap[lyType] || '未知';
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 360,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', paddingLeft: '10px', paddingRight: '10px' }}>
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '60px',
              height: '28px',
              background: '#13c2c2',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#fff',
            }}
            onClick={() => handleAllocate(record)}
          >
            <div>分配</div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
          </div>
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '60px',
              height: '28px',
              background: '#ff9800',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#fff',
            }}
            onClick={() => handleDetail(record)}
          >
            <div>详情</div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
          </div>
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '60px',
              height: '28px',
              background: '#1890ff',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#fff',
            }}
            onClick={() => handleProcess(record)}
          >
            <div>处理</div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
          </div>
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '60px',
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
                <Form.Item label="企业名称" name="comName">
                  <Input placeholder="请输入企业名称" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="留言时间" name="dateRange">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="是否处理" name="clIs">
                  <Select placeholder="请选择" allowClear>
                    <Select.Option value={0}>未处理</Select.Option>
                    <Select.Option value={1}>已处理</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Space>
                  <Button type="primary" onClick={() => handleSearch(1)}>
                    查询
                  </Button>
                  <Button onClick={() => {
                    searchForm.resetFields();
                    handleSearch(1);
                  }}>
                    重置
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </div>

        <div style={{ padding: '20px' }}>
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

      <Drawer
        title="留言详情"
        placement="right"
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
        width={700}
      >
        <Form form={detailForm} layout="vertical">
          <Form.Item label="企业名称">
            <Input value={currentRecord?.comName} disabled />
          </Form.Item>
          <Form.Item label="联系人">
            <Input value={currentRecord?.name} disabled />
          </Form.Item>
          <Form.Item label="联系电话">
            <Input value={currentRecord?.phone} disabled />
          </Form.Item>
          <Form.Item label="留言内容">
            <TextArea value={currentRecord?.descContent} disabled rows={4} />
          </Form.Item>
          <Form.Item label="最后处理人">
            <Input value={currentRecord?.clEr} disabled />
          </Form.Item>
          <Form.Item label="最后处理时间">
            <Input value={currentRecord?.clTime} disabled />
          </Form.Item>
          <Form.Item label="处理结果">
            <TextArea value={currentRecord?.clDesc} disabled rows={4} />
          </Form.Item>
        </Form>

        <div style={{ marginTop: '30px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
            历史处理记录
          </div>
          <Table
            columns={[
              {
                title: '处理人',
                dataIndex: 'clEr',
                key: 'clEr',
                width: 100,
              },
              {
                title: '处理时间',
                dataIndex: 'ct',
                key: 'ct',
                width: 150,
              },
              {
                title: '处理内容',
                dataIndex: 'descContent',
                key: 'descContent',
                render: (text: string) => (
                  <div style={{ maxHeight: '100px', overflow: 'auto' }}>
                    {text}
                  </div>
                ),
              },
            ]}
            dataSource={processHistory}
            loading={historyLoading}
            rowKey="_id"
            pagination={{
              current: historyPagination.current,
              pageSize: historyPagination.pageSize,
              total: historyPagination.total,
              onChange: (page) => {
                const lyId = currentRecord?.id || currentRecord?._id;
                if (lyId) {
                  fetchProcessHistory(lyId, page);
                }
              },
            }}
            size="small"
            bordered
          />
        </div>
      </Drawer>

      <Modal
        title="处理留言"
        open={processModalVisible}
        onOk={handleProcessSave}
        onCancel={() => setProcessModalVisible(false)}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={processForm} layout="vertical">
          <Form.Item
            label="处理结果"
            name="clDesc"
            rules={[{ required: true, message: '请输入处理结果' }]}
          >
            <TextArea placeholder="请输入处理结果" rows={6} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="分配留言"
        open={allocateModalVisible}
        onOk={handleAllocateSave}
        onCancel={() => {
          setAllocateModalVisible(false);
          setSelectedDeptCode('');
        }}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={allocateForm} layout="vertical">
          <Form.Item label="选择部门" required>
            <TreeSelect
              placeholder="请选择要分配的部门"
              value={selectedDeptCode || undefined}
              onChange={(value) => setSelectedDeptCode(value as string)}
              treeDefaultExpandAll
              treeNodeFilterProp="label"
              treeData={deptOptions}
              treeLine
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Message;
