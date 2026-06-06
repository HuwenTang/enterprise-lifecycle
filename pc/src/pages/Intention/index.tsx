import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Table, Drawer, TreeSelect } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import { request } from '@umijs/max';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface IntentionDataType {
  id?: string;
  _id?: string;
  companyName?: string;
  zoneName?: string;
  industryName?: string;
  linker?: string;
  linkerTel?: string;
  ct?: string;
  feebackIs?: number;
  ly?: number;
  zoneTel?: string;
  investDesc?: string;
}

interface FeedbackRecordType {
  id?: string;
  _id?: string;
  investId: string;
  zoneLinker?: string;
  zoneLinkerTel?: string;
  companyLinker?: string;
  companyTel?: string;
  feedback?: string;
  fbDate?: string;
  creatorName?: string;
}

const Intention = () => {
  const [searchForm] = Form.useForm();
  const [detailForm] = Form.useForm();
  const [feedbackForm] = Form.useForm();
  const [tableData, setTableData] = useState<IntentionDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<IntentionDataType | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [zoneOptions, setZoneOptions] = useState<{ label: string; value: string }[]>([]);
  const [industryTreeData, setIndustryTreeData] = useState<any[]>([]);
  const [feedbackRecords, setFeedbackRecords] = useState<FeedbackRecordType[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackPagination, setFeedbackPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);

  useEffect(() => {
    handleSearch();
  }, []);


  useEffect(() => {
    fetchZoneList();
    fetchIndustryTreeData();
  }, []);

  const fetchZoneList = async () => {
    try {
      const buildDeptTree = async (item: any): Promise<any> => {
        const treeItem: any = {
          label: item.deptName,
          value: item.deptCode,
        };
        
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

      const response = await request('/zsxt-api/tCommonDept/getDeptByPidForTreeSelect', {
        method: 'POST',
        data: { pid: '001' },
      });
      
      if (response && Array.isArray(response)) {
        const options = await Promise.all(response.map(item => buildDeptTree(item)));
        setZoneOptions(options);
      }
    } catch (error) {
      console.error('获取园区列表失败:', error);
    }
  };

  const fetchIndustryTreeData = async () => {
    const normalizeIndustryNode = (item: any) => {
      const id = item?.id ?? item?.value ?? item?.code ?? item?._code;
      const codeText = String(item?.code ?? item?._code ?? item?.value ?? '').trim();
      const nameText = String(item?.name ?? item?.label ?? item?.text ?? item?.title ?? item?._name ?? '').trim();
      const titleText = codeText && nameText && !nameText.startsWith(codeText)
        ? `${codeText}-${nameText}`
        : (nameText || codeText);
      const nodeValue = codeText || String(id ?? '');
      return {
        raw: item,
        title: titleText,
        value: nodeValue,
        key: nodeValue || String(id ?? ''),
        industryName: nameText,
      };
    };

    const buildTreeData = (nodes: any[]): any[] =>
      (nodes || []).map((item) => {
        const normalized = normalizeIndustryNode(item);
        const hasChildren = Array.isArray(item?.children) && item.children.length > 0;
        return {
          ...normalized,
          children: hasChildren ? buildTreeData(item.children) : undefined,
        };
      }).filter((item) => item.value !== '');

    try {
      const response = await request('/zsxt-api/tProjType/getProjType', {
        method: 'POST',
        data: {},
      });
      const treeData = Array.isArray(response)
        ? response
        : (Array.isArray(response?.data) ? response.data : []);
      setIndustryTreeData(buildTreeData(treeData));
    } catch (error) {
      console.error('获取行业编码树失败:', error);
      setIndustryTreeData([]);
    }
  };

  const handleSearch = async (page = 1) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const data: any = {};
      
      if (values.companyName) {
        data.companyName = values.companyName;
      }
      if (values.zoneCode) {
        data.zoneCode = values.zoneCode;
      }
      if (values.industryId) {
        data.industryId = values.industryId;
      }
      if (values.isFeedback !== undefined && values.isFeedback !== '') {
        data.isFeedback = values.isFeedback;
      }
      
      const response = await request(`/zsxt-api/tBizInvest/list?page=${page}&size=${pagination.pageSize}`, {
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

  const handleDetail = async (record: IntentionDataType) => {
    try {
      const response = await request(`/zsxt-api/tBizInvest/getInfo/${record.id || record._id}`, {
        method: 'GET',
      });
      if (response) {
        setCurrentRecord(response);
        detailForm.setFieldsValue(response);
        setDetailDrawerVisible(true);
        
        const investId = record.id || record._id;
        if (investId) {
          fetchFeedbackRecords(investId);
        }
      }
    } catch (error) {
      console.error('获取详情失败:', error);
    }
  };

  const fetchFeedbackRecords = async (investId: string, page = 1) => {
    setFeedbackLoading(true);
    try {
      const response = await request(`/zsxt-api/tBizInvestFeedback/list?page=${page}&size=${feedbackPagination.pageSize}`, {
        method: 'POST',
        data: { investId },
      });
      if (response) {
        setFeedbackRecords(response.records || response.data || []);
        setFeedbackPagination({
          current: page,
          pageSize: feedbackPagination.pageSize,
          total: response.total || 0,
        });
      }
    } catch (error) {
      console.error('获取反馈记录失败:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleFeedback = (record: IntentionDataType) => {
    setCurrentRecord(record);
    feedbackForm.resetFields();
    setEditingFeedbackId(null);
    setFeedbackModalVisible(true);
    
    // 加载反馈记录列表
    const investId = record.id || record._id;
    if (investId) {
      fetchFeedbackRecords(investId, 1);
    }
  };

  const handleEditFeedback = (record: FeedbackRecordType) => {
    const feedbackId = record.id || record._id;
    setEditingFeedbackId(feedbackId || null);
    feedbackForm.setFieldsValue({
      zoneLinker: record.zoneLinker,
      zoneLinkerTel: record.zoneLinkerTel,
      companyLinker: record.companyLinker,
      companyTel: record.companyTel,
      feedback: record.feedback,
    });
  };

  const handleFeedbackSave = async () => {
    try {
      const values = await feedbackForm.validateFields();
      const investId = currentRecord?.id || currentRecord?._id;
      
      console.log('editingFeedbackId:', editingFeedbackId);
      
      if (editingFeedbackId) {
        // 更新反馈记录
        await request(`/zsxt-api/tBizInvestFeedback/${editingFeedbackId}`, {
          method: 'PUT',
          data: {
            zoneLinker: values.zoneLinker,
            zoneLinkerTel: values.zoneLinkerTel,
            companyLinker: values.companyLinker,
            companyTel: values.companyTel,
            feedback: values.feedback,
          },
        });
        message.success('更新成功');
      } else {
        // 新增反馈记录
        await request('/zsxt-api/tBizInvestFeedback', {
          method: 'POST',
          data: {
            investId,
            zoneLinker: values.zoneLinker,
            zoneLinkerTel: values.zoneLinkerTel,
            companyLinker: values.companyLinker,
            companyTel: values.companyTel,
            feedback: values.feedback,
          },
        });
        message.success('反馈成功');
      }
      
      // 刷新反馈记录列表
      if (investId) {
        fetchFeedbackRecords(investId, feedbackPagination.current);
      }
      
      // 重置表单和编辑状态
      feedbackForm.resetFields();
      setEditingFeedbackId(null);
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const columns: ColumnsType<IntentionDataType> = [
    {
      title: 'ID',
      key: 'index',
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: '公司名称', dataIndex: 'companyName', key: 'companyName', width: 150 },
    { title: '园区名称', dataIndex: 'zoneName', key: 'zoneName', width: 120 },
    { title: '行业名称', dataIndex: 'industryName', key: 'industryName', width: 120 },
    { title: '联系人', dataIndex: 'linker', key: 'linker', width: 100 },
    { title: '联系电话', dataIndex: 'linkerTel', key: 'linkerTel', width: 120 },
    { title: '发布时间', dataIndex: 'ct', key: 'ct', width: 150 },
    {
      title: '是否反馈',
      dataIndex: 'feebackIs',
      key: 'feebackIs',
      width: 100,
      render: (feebackIs: number) => {
        const statusMap: { [key: number]: { text: string; color: string } } = {
          1: { text: '已反馈', color: 'green' },
          2: { text: '未反馈', color: 'red' },
          3: { text: '已反馈', color: 'green' },
        };
        const status = statusMap[feebackIs] || { text: '未知', color: 'gray' };
        return <span style={{ color: status.color }}>{status.text}</span>;
      },
    },
    {
      title: '意向来源',
      dataIndex: 'ly',
      key: 'ly',
      width: 100,
      render: (ly: number) => {
        const sourceMap: { [key: number]: string } = {
          1: '小程序',
          2: 'PC端',
          3: 'APP端',
        };
        return sourceMap[ly] || '未知';
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '70px',
              height: '28px',
              background: '#13c2c2',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#fff',
            }}
            onClick={() => handleFeedback(record)}
          >
            <div>反馈记录</div>
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
              background: '#ff9800',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#fff',
            }}
            onClick={() => handleDetail(record)}
          >
            <div>查看详情</div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
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
                <Form.Item label="企业名称" name="companyName">
                  <Input placeholder="请输入企业名称" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="园区名称" name="zoneCode">
                  <TreeSelect
                    placeholder="请选择园区"
                    treeData={zoneOptions}
                    treeDefaultExpandAll
                    treeLine
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="行业名称" name="industryId">
                  <TreeSelect
                    placeholder="请选择行业"
                    treeData={industryTreeData}
                    treeDefaultExpandAll
                    treeNodeFilterProp="title"
                    treeLine
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="状态" name="isFeedback">
                  <Select placeholder="请选择" allowClear>
                    <Select.Option value={2}>未反馈</Select.Option>
                    <Select.Option value={1}>已反馈</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={18}>
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
            scroll={{ x: 1300 }}
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
        title={`投资意向详情 - ${currentRecord?.companyName || ''}`}
        placement="right"
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
        width={700}
      >
        <Form form={detailForm} layout="vertical">
          <Form.Item label="投资公司">
            <Input value={currentRecord?.companyName} disabled />
          </Form.Item>
          <Form.Item label="园区名称">
            <Input value={currentRecord?.zoneName} disabled />
          </Form.Item>
          <Form.Item label="行业名称">
            <Input value={currentRecord?.industryName} disabled />
          </Form.Item>
          <Form.Item label="联系人">
            <Input value={currentRecord?.linker} disabled />
          </Form.Item>
          <Form.Item label="联系电话">
            <Input value={currentRecord?.linkerTel} disabled />
          </Form.Item>
          <Form.Item label="填表时间">
            <Input value={currentRecord?.ct} disabled />
          </Form.Item>
          <Form.Item label="园区电话">
            <Input value={currentRecord?.zoneTel} disabled />
          </Form.Item>
          <Form.Item label="投资说明">
            <Input.TextArea value={currentRecord?.investDesc} disabled rows={6} />
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title={`反馈投资意向 - ${currentRecord?.companyName || ''}`}
        open={feedbackModalVisible}
        onCancel={() => setFeedbackModalVisible(false)}
        width={900}
        footer={null}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* 反馈信息表单 */}
          <div style={{ 
            border: '1px solid rgba(192,192,192,0.5)',
            backgroundColor: '#FCFCFC',
            padding: '16px',
            marginBottom: '20px',
            borderRadius: '4px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>反馈信息</div>
            <Form form={feedbackForm} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="园区联系人"
                    name="zoneLinker"
                    rules={[{ required: true, message: '请输入园区联系人' }]}
                  >
                    <Input placeholder="请输入园区联系人" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="园区联系人电话"
                    name="zoneLinkerTel"
                    rules={[{ required: true, message: '请输入园区联系人电话' }]}
                  >
                    <Input placeholder="请输入园区联系人电话" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="企业联系人"
                    name="companyLinker"
                    rules={[{ required: true, message: '请输入企业联系人' }]}
                  >
                    <Input placeholder="请输入企业联系人" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="企业联系人电话"
                    name="companyTel"
                    rules={[{ required: true, message: '请输入企业联系人电话' }]}
                  >
                    <Input placeholder="请输入企业联系人电话" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="反馈内容"
                name="feedback"
                rules={[{ required: true, message: '请输入反馈内容' }]}
              >
                <TextArea placeholder="请输入反馈内容" rows={4} />
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button onClick={() => setFeedbackModalVisible(false)}>取消</Button>
                  <Button type="primary" onClick={handleFeedbackSave}>保存</Button>
                </Space>
              </div>
            </Form>
          </div>

          {/* 反馈记录列表 */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '12px',
              color: '#d98a8a'
            }}>
              提示：以下是反馈记录列表，您可以点击操作栏的"编辑"按钮查看/编辑详情。
            </div>
            <Table
              columns={[
                {
                  title: '园区联系人',
                  dataIndex: 'zoneLinker',
                  key: 'zoneLinker',
                  width: 100,
                },
                {
                  title: '园区电话',
                  dataIndex: 'zoneLinkerTel',
                  key: 'zoneLinkerTel',
                  width: 100,
                },
                {
                  title: '企业联系人',
                  dataIndex: 'companyLinker',
                  key: 'companyLinker',
                  width: 100,
                },
                {
                  title: '企业电话',
                  dataIndex: 'companyTel',
                  key: 'companyTel',
                  width: 100,
                },
                {
                  title: '反馈时间',
                  dataIndex: 'fbDate',
                  key: 'fbDate',
                  width: 150,
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 80,
                  align: 'center' as const,
                  render: (_, record: FeedbackRecordType) => (
                    <Button
                      type="primary"
                      size="small"
                      style={{ background: '#ff9800', borderColor: '#ff9800' }}
                      onClick={() => handleEditFeedback(record)}
                    >
                      编辑
                    </Button>
                  ),
                },
              ]}
              dataSource={feedbackRecords}
              loading={feedbackLoading}
              rowKey="_id"
              pagination={{
                current: feedbackPagination.current,
                pageSize: feedbackPagination.pageSize,
                total: feedbackPagination.total,
                onChange: (page) => {
                  const investId = currentRecord?.id || currentRecord?._id;
                  if (investId) {
                    fetchFeedbackRecords(investId, page);
                  }
                },
              }}
              size="small"
              bordered
              scroll={{ x: 600 }}
            />
          </div>
        </div>
      </Modal>

    </PageContainer>
  );
};

export default Intention;
