import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, Form, Input, Select, Table, Modal, Radio, message, Row, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import { request } from '@umijs/max';

const { TextArea } = Input;

interface ProjectShareDataType {
  id: string;
  investor: string;
  ptype: number;
  investMoney: string;
  qtjd: string;
  desc: string;
  district: string;
  districtCode: string;
  zoneCode: string;
  zoneName: string;
  sjly: number;
  createTime: string;
  remark: string;
  progress: string;
  creatorId?: number;
  creatorName?: string;
  updateTime?: string;
}

const ProjectShare = () => {
  const [form] = Form.useForm();
  const [claimForm] = Form.useForm();
  const [tableData, setTableData] = useState<ProjectShareDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectShareDataType | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [projectTypeOptions, setProjectTypeOptions] = useState<{ label: string; value: any }[]>([]);
  
  // 市区选项（动态获取）
  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>([]);
  
  // 搜索表单的园区选项
  const [searchZoneOptions, setSearchZoneOptions] = useState<{ label: string; value: string }[]>([]);
  // 搜索表单的镇街选项
  const [searchTownOptions, setSearchTownOptions] = useState<{ label: string; value: string }[]>([]);
  // 标记搜索表单的园区是否已选择
  const [searchZoneSelected, setSearchZoneSelected] = useState(false);
  

  // 获取项目类别下拉数据
  const fetchProjectTypes = async () => {
    try {
      const response = await request('/system-api/dict/domestic_foreign_investment/items', {
        method: 'GET',
        params: { all: true },
      });
      
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.label || item.name,
          value: Number(item.value || item.id), // 确保转换为数字类型
        }));
        setProjectTypeOptions(options);
      }
    } catch (error) {
      console.error('获取项目类别失败:', error);
    }
  };


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
      message.error('获取市（区）列表失败');
    }
  };

  // 获取园区列表（搜索表单）
  const fetchSearchZoneList = async (pid: string) => {
    try {
      const response = await request('/zsxt-api/tCommonDept/getDeptByPidForTreeSelect', {
        method: 'POST',
        data: { pid },
      });
      
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.deptName,
          value: item.deptCode,
        }));
        setSearchZoneOptions(options);
      }
    } catch (error) {
      console.error('获取园区列表失败:', error);
      message.error('获取园区列表失败');
    }
  };

  // 获取镇街列表（搜索表单）
  const fetchSearchTownList = async (pid: string) => {
    try {
      const response = await request('/zsxt-api/tCommonDept/getDeptByPidForTreeSelect', {
        method: 'POST',
        data: { pid },
      });
      
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.deptName,
          value: item.deptCode,
        }));
        setSearchTownOptions(options);
      }
    } catch (error) {
      console.error('获取镇街列表失败:', error);
      message.error('获取镇街列表失败');
    }
  };

  // 市区变化时，更新园区选项（搜索表单）
  const handleSearchDistrictChange = (value: string) => {
    if (value) {
      fetchSearchZoneList(value);
    } else {
      setSearchZoneOptions([]);
    }
    // 清空园区和镇街选择
    setSearchTownOptions([]);
    form.setFieldsValue({ zone_name: undefined, town_code: undefined });
  };
  
  // 园区变化时，更新镇街选项（搜索表单）
  const handleSearchZoneChange = (value: string) => {
    if (value) {
      setSearchZoneSelected(true);
      fetchSearchTownList(value);
    } else {
      setSearchZoneSelected(false);
      setSearchTownOptions([]);
    }
    // 清空镇街选择
    form.setFieldsValue({ town_code: undefined });
  };

  // 获取市区名称（用于显示）
  const getDistrictName = (code: string) => {
    const district = districtOptions.find(item => item.value === code);
    return district ? district.label : code;
  };

  // 获取园区名称（用于显示）
  const getZoneName = (code: string) => {
    // 这里可以根据需要优化，目前后端已经返回 zoneName 字段
    return code;
  };

  useEffect(() => {
    const init = async () => {
      fetchDistrictList();
      fetchProjectTypes();
      handleSearch();
    };
    
    init();
  }, []);

  const handleSearch = async (page = 1, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const response = await request(`/zsxt-api/tProjShareProject/searchProjShareProject?page=${page}&size=${pageSize}`, {
        method: 'POST',
        data: {
          investor: values.investor,
          ptype: values.p_type,
          districtCode: values.district,
          zoneCode: values.zone_name,
          townCode: values.town_code,
        },
      });
      
      if (response && response.records) {
        setTableData(response.records);
        setPagination({
          current: response.page || page,
          pageSize: response.size || pageSize,
          total: response.total || 0
        });
      }
    } catch (error) {
      console.error('查询失败:', error);
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSearchZoneOptions([]); // 清空搜索表单的园区选项
    setSearchTownOptions([]); // 清空搜索表单的镇街选项
    setSearchZoneSelected(false);
    handleSearch(1);
  };

  const handleClaim = (record: ProjectShareDataType) => {
    setCurrentProject(record);
    claimForm.setFieldsValue({
      investor: record.investor,
      p_type: record.ptype,
      invest_money: record.investMoney,
      _desc: record.desc,
      qtjd: record.qtjd,
      remark: record.remark,
    });
    setClaimModalVisible(true);
  };

  const handleClaimSubmit = async () => {
    try {
      const values = await claimForm.validateFields();
      
      if (!currentProject) {
        message.error('未选择项目');
        return;
      }
      
      // 调用认领接口
      await request('/zsxt-api/tProjShareProject/claimProject', {
        method: 'POST',
        data: {
          id: currentProject.id,
          qtjd: values.rlRemark, // 认领原因
        },
      });
      
      message.success('认领成功');
      setClaimModalVisible(false);
      claimForm.resetFields();
      handleSearch(pagination.current);
    } catch (error) {
      console.error('认领失败:', error);
      message.error('认领失败');
    }
  };

  const columns: ColumnsType<ProjectShareDataType> = [
    { title: 'ID', key: 'index', width: 60, align: 'center', render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1 },
    { title: '投资方名称', dataIndex: 'investor', key: 'investor', width: 150, align: 'center' },
    {
      title: '项目类别',
      dataIndex: 'ptype',
      key: 'ptype',
      width: 100,
      align: 'center',
      render: (type: number) => {
        const option = projectTypeOptions.find(opt => opt.value === type);
        return option ? option.label : type;
      },
    },
    { title: '投资规模', dataIndex: 'investMoney', key: 'investMoney', width: 120, align: 'center' },
    { title: '洽谈进度', dataIndex: 'qtjd', key: 'qtjd', width: 120, align: 'center' },
    { title: '项目内容', dataIndex: 'desc', key: 'desc', width: 200, align: 'center', ellipsis: true },
    { title: '原属市区', dataIndex: 'district', key: 'district', width: 120, align: 'center' },
    { title: '原属园区', dataIndex: 'zoneName', key: 'zoneName', width: 150, align: 'center' },
    { title: '原属镇街', dataIndex: 'townName', key: 'townName', width: 120, align: 'center' },
    {
      title: '项目来源',
      dataIndex: 'sjly',
      key: 'sjly',
      width: 100,
      align: 'center',
      render: (type: number) => (type === 1 ? '填报归入' : '在谈归入'),
    },
    { title: '归入日期', dataIndex: 'createTime', key: 'createTime', width: 120, align: 'center' },
    { title: '归入原因', dataIndex: 'remark', key: 'remark', width: 200, align: 'center', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      align: 'center',
      render: (progress: string) => {
        const progressMap: Record<string, string> = {
          '1': '无任何状态',
          '2': '流转至再谈项目',
        };
        return progressMap[progress] || '-';
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (_, record) => (
        record.progress === '1' ? (
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
              margin: '0 auto',
            }}
            onClick={() => handleClaim(record)}
          >
            <div>认领</div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
          </div>
        ) : null
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

          <Form form={form} name="searchForm">
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="投资方名称" name="investor">
                  <Input placeholder="请输入投资方名称" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="项目类别" name="p_type">
                  <Select placeholder="请选择" allowClear>
                    {projectTypeOptions.map(option => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="原属市区" name="district">
                  <Select placeholder="请选择" allowClear onChange={handleSearchDistrictChange}>
                    {districtOptions.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="原属园区" name="zone_name">
                  <Select placeholder="请先选择市区" allowClear onChange={handleSearchZoneChange} disabled={searchZoneOptions.length === 0}>
                    {searchZoneOptions.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="原属镇街" name="town_code">
                  <Select placeholder={!searchZoneSelected ? "请先选择园区" : (searchTownOptions.length === 0 ? "暂无镇街" : "请选择镇街")} allowClear disabled={searchTownOptions.length === 0}>
                    {searchTownOptions.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Space>
                  <Button type="primary" onClick={() => handleSearch(1)}>
                    查询
                  </Button>
                  <Button onClick={handleReset}>重置</Button>
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
            rowKey="id"
            bordered
            scroll={{ x: 1800 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (page, pageSize) => {
                handleSearch(page, pageSize || 10);
              },
            }}
          />
        </div>
      </div>

      <Modal
        title={currentProject?.investor || '项目认领'}
        open={claimModalVisible}
        onOk={handleClaimSubmit}
        onCancel={() => {
          setClaimModalVisible(false);
          claimForm.resetFields();
        }}
        width={700}
        okText="确认"
        cancelText="取消"
      >
        <Form form={claimForm} layout="vertical">
          <Form.Item label="投资方名称" name="investor">
            <Input disabled />
          </Form.Item>
          <Form.Item label="项目类别" name="p_type">
            <Radio.Group disabled>
              {projectTypeOptions.map(option => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="项目规模" name="invest_money">
            <Input disabled />
          </Form.Item>
          <Form.Item label="项目内容" name="_desc">
            <TextArea rows={5} disabled />
          </Form.Item>
          <Form.Item label="洽谈进度" name="qtjd">
            <Input disabled />
          </Form.Item>
          <Form.Item label="归入原因" name="remark">
            <TextArea rows={5} disabled />
          </Form.Item>
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px', marginTop: '16px' }}>
            <div style={{ position: 'relative', paddingLeft: '10px', marginBottom: '16px', fontWeight: 'bold' }}>
              <div style={{ position: 'absolute', width: '3px', height: '10px', background: '#0a6aa1', left: 0, top: '50%', transform: 'translateY(-50%)' }}></div>
              认领
            </div>
          </div>
          <Form.Item
            label="认领原因"
            name="rlRemark"
            rules={[{ required: true, message: '请输入认领原因' }]}
          >
            <TextArea rows={5} placeholder="请输入认领原因" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ProjectShare;
