import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Table, Tag, Descriptions, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import { FILE_SERVER_URL } from '@/constants/config';
import fileConfig from '../../../config/fileConfig';

const { TextArea } = Input;

type SearchFieldType = {
  code?: string;
  zone_code?: string;
  town_code?: string;
  activity_address?: string;
  start_time?: string;
  end_time?: string;
};

interface DataType {
  id: string;
  name: string;
  code: string;
  districtCode?: string;
  districtName?: string;
  zoneCode: string;
  zoneName: string;
  startTime: string;
  endTime: string;
  zjbAddress: string; // 活动地址（label）
  zjbCode: string; // 活动地址编码（value）
  activityContent: string;
  leaders: string;
  industryCode: string;
  industryName: string;
  images: string; // 附件路径，逗号分隔
  auditStatus: number; // 0 待审核 1 审核通过 2 审核不通过
  auditRemark?: string; // 审核意见
  auditId?: number;
  auditTime?: string;
  townCode?: string;
  townName?: string;
  createTime?: string;
  updateTime?: string;
}

const InvestmentActivityAudit = () => {
  const [searchForm] = Form.useForm();

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

  // 市区选项（动态获取）
  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>([]);
  
  // 搜索表单的园区选项
  const [searchZoneOptions, setSearchZoneOptions] = useState<{ label: string; value: string }[]>([]);
  // 搜索表单的镇街选项
  const [searchTownOptions, setSearchTownOptions] = useState<{ label: string; value: string }[]>([]);
  
  // 标记搜索表单的园区是否已选择
  const [searchZoneSelected, setSearchZoneSelected] = useState(false);
  
  // 用户权限区域信息 - level=4用户的默认值
  const [level4User, setLevel4User] = useState<{
    isLevel4: boolean;
    districtCode: string;
    districtName: string;
    zoneCode: string;
    zoneName: string;
    townCode?: string;
    townName?: string;
    isTownLevel: boolean;
  } | null>(null);
  
  // 活动地址选项（动态获取）
  const [activityAddressOptions, setActivityAddressOptions] = useState<{ label: string; value: string }[]>([]);

  // 详情弹窗
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentDetail, setCurrentDetail] = useState<DataType | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 审核弹窗
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [auditResult, setAuditResult] = useState<'pass' | 'reject'>('pass');
  const [rejectReason, setRejectReason] = useState('');

  // 获取用户权限区域
  const fetchAreaGrants = async () => {
    try {
      const response = await request('/system-api/user/area-grants', {
        method: 'GET',
      });
      
      if (response && response.areas && response.areas.length > 0) {
        const firstArea = response.areas[0];
        
        // 判断是否是 level = 4 的用户
        if (firstArea.level === 4) {
          const districtCode = firstArea.zsDept.substring(0, 6);
          let zoneCode = '';
          let zoneName = '';
          let townCode = '';
          let townName = '';
          let isTownLevel = false;
          
          // 判断 zsDept 长度
          if (firstArea.zsDept && firstArea.zsDept.length === 12) {
            // 12位 = 镇街级别
            isTownLevel = true;
            zoneCode = firstArea.zsDept.substring(0, 9); // 园区code = 前9位
            townCode = firstArea.zsDept; // 镇街code = 完整12位
            townName = firstArea.name; // 镇街名称
          } else {
            // 其他位数 = 园区级别
            isTownLevel = false;
            zoneCode = firstArea.zsDept;
            zoneName = firstArea.name;
          }
          
          // 设置搜索表单的园区选项
          setSearchZoneOptions([{
            label: zoneName || '',
            value: zoneCode,
          }]);
          
          // 如果是镇街级别，设置镇街选项
          if (isTownLevel) {
            setSearchTownOptions([{
              label: townName,
              value: townCode,
            }]);
          }
          
          // 返回 level4 信息
          return { districtCode, zoneCode, zoneName, townCode, townName, isTownLevel };
        }
      }
      return null;
    } catch (error) {
      console.error('获取用户权限区域失败:', error);
      return null;
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

  // 获取活动地址列表
  const fetchActivityAddressList = async () => {
    try {
      const response = await request('/system-api/dict/activityAddress/items', {
        method: 'GET',
        params: { all: true },
      });
      
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.label || item.name,
          value: item.value || item.id,
        }));
        setActivityAddressOptions(options);
      }
    } catch (error) {
      console.error('获取活动地址列表失败:', error);
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

  // 获取数据
  const fetchData = async (page: number = pagination.current, pageSize: number = pagination.pageSize) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const response = await request(`/zsxt-api/tProjInvestActivities/auditList?page=${page}&size=${pageSize}`, {
        method: 'POST',
        data: {
          code: values.code,
          zoneCode: values.zone_code,
          townCode: values.town_code,
          zjbCode: values.activity_address,
          startTime: values.start_time ? dayjs(values.start_time).format('YYYY-MM-DD') : undefined,
          endTime: values.end_time ? dayjs(values.end_time).format('YYYY-MM-DD') : undefined,
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
    const init = async () => {
      // 先获取用户权限区域
      const level4Info = await fetchAreaGrants();
      
      // 如果是 level=4 用户，获取市区名称和园区名称（如果是镇街级别）
      if (level4Info) {
        try {
          // 调用市区接口获取市区名称
          const districtResponse = await request('/zsxt-api/tCommonDept/list', {
            method: 'POST',
            data: { deptCode: level4Info.districtCode },
          });
          
          let districtName = '';
          if (districtResponse && districtResponse.records && districtResponse.records.length > 0) {
            districtName = districtResponse.records[0].deptName;
          }
          
          let zoneName = level4Info.zoneName;
          
          // 如果是镇街级别，园区名称 = 市区名称 + "其他"
          if (level4Info.isTownLevel) {
            zoneName = districtName + '其他';
            // 更新搜索表单的园区选项
            setSearchZoneOptions([{
              label: zoneName,
              value: level4Info.zoneCode,
            }]);
          }
          
          const level4Data = {
            isLevel4: true,
            districtCode: level4Info.districtCode,
            districtName: districtName,
            zoneCode: level4Info.zoneCode,
            zoneName: zoneName,
            townCode: level4Info.townCode,
            townName: level4Info.townName,
            isTownLevel: level4Info.isTownLevel,
          };
          setLevel4User(level4Data);
          
          // 设置市区选项（只有一个）
          if (districtName) {
            setDistrictOptions([{
              label: districtName,
              value: level4Info.districtCode,
            }]);
          }
          
          // 设置搜索表单默认值
          const searchFormValues: any = {
            code: level4Info.districtCode,
            zone_code: level4Info.zoneCode,
          };
          
          // 如果是镇街级别，设置镇街默认值
          if (level4Info.isTownLevel && level4Info.townCode) {
            searchFormValues.town_code = level4Info.townCode;
          }
          
          searchForm.setFieldsValue(searchFormValues);
          
          // 标记园区已选择
          setSearchZoneSelected(true);
        } catch (error) {
          console.error('获取市区/园区名称失败:', error);
        }
      } else {
        // 非 level=4 用户，加载市区列表
        fetchDistrictList();
      }
      
      fetchData();
      fetchActivityAddressList();
    };
    
    init();
  }, []);

  // 搜索
  const onSearch = () => {
    fetchData(1);
  };

  // 重置
  const onReset = () => {
    searchForm.resetFields();
    setSearchZoneOptions([]);
    setSearchTownOptions([]);
    setSearchZoneSelected(false);
    fetchData(1, 10);
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
    searchForm.setFieldsValue({ zone_code: undefined, town_code: undefined });
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
    searchForm.setFieldsValue({ town_code: undefined });
  };

  // 查看详情
  const handleViewDetail = async (record: DataType) => {
    setDetailLoading(true);
    setDetailModalVisible(true);
    try {
      const response = await request(`/zsxt-api/tProjInvestActivities/getById/${record.id}`, {
        method: 'GET',
      });
      
      setCurrentDetail(response || record);
    } catch (error) {
      console.error('获取详情失败:', error);
      message.error('获取详情失败');
    } finally {
      setDetailLoading(false);
    }
  };

  // 关闭详情弹窗
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setCurrentDetail(null);
  };

  // 打开审核弹窗
  const handleOpenAuditModal = (result: 'pass' | 'reject') => {
    setAuditResult(result);
    setRejectReason('');
    setAuditModalVisible(true);
  };

  // 提交审核
  const handleSubmitAudit = async () => {
    if (auditResult === 'reject' && !rejectReason.trim()) {
      message.warning('请填写不通过原因');
      return;
    }

    if (!currentDetail?.id) {
      message.error('缺少活动ID');
      return;
    }

    try {
      const requestData: any = {
        id: currentDetail.id,
        auditStatus: auditResult === 'pass' ? 1 : 2, // 1 审核通过 2 审核不通过
      };

      // 审核不通过时传备注
      if (auditResult === 'reject') {
        requestData.auditRemark = rejectReason.trim();
      }

      await request('/zsxt-api/tProjInvestActivities/audit', {
        method: 'POST',
        data: requestData,
      });

      message.success(auditResult === 'pass' ? '审核通过' : '审核不通过');
      setAuditModalVisible(false);
      setDetailModalVisible(false);
      
      // 刷新列表
      fetchData();
    } catch (error) {
      console.error('提交审核失败:', error);
      message.error('提交审核失败');
    }
  };

  // 渲染审核状态标签
  const renderAuditStatus = (status: number) => {
    let color = '';
    let icon = null;
    let statusText = '';

    if (status === 0) {
      color = 'orange';
      icon = <ClockCircleOutlined />;
      statusText = '待审核';
    } else if (status === 1) {
      color = 'green';
      icon = <CheckCircleOutlined />;
      statusText = '审核通过';
    } else if (status === 2) {
      color = 'red';
      icon = <CloseCircleOutlined />;
      statusText = '审核不通过';
    }

    return (
      <Tag icon={icon} color={color} style={{ fontSize: '14px', padding: '4px 12px' }}>
        {statusText}
      </Tag>
    );
  };

  // 渲染附件列表
  const renderFiles = (files: string, createTime?: string) => {
    if (!files) {
      return <span style={{ color: '#999' }}>暂无附件</span>;
    }

    const fileList = files.split(',').filter(f => f.trim());
    return (
      <Space direction="vertical" size="small">
        {fileList.map((filePath, index) => {
          // 从 path 中提取文件名（# 后面的部分是原始文件名）
          const trimmedPath = filePath.trim();
          const hashIndex = trimmedPath.indexOf('#');
          const fileName = hashIndex > -1 ? decodeURIComponent(trimmedPath.substring(hashIndex + 1)) : trimmedPath.split('/').pop() || `附件${index + 1}`;
          let actualPath = hashIndex > -1 ? trimmedPath.substring(0, hashIndex) : trimmedPath;
          
          // 判断创建时间是否在2026年4月13日之前
          if (createTime) {
            const createDate = new Date(createTime);
            const cutoffDate = new Date('2026-04-13');
            if (createDate < cutoffDate) {
              // 2026年4月13日之前的附件使用旧地址
              // 从 uploadDetail 开始截取到 ? 之前的路径
              const match = actualPath.match(/uploadDetail\/[^?]+/);
              if (match) {
                actualPath = fileConfig.LEGACY_FILE_BASE_URL + match[0];
              }
            }
          }
          
          return (
            <Button
              key={index}
              type="link"
              size="small"
              style={{ padding: 0, height: 'auto' }}
              onClick={() => {
                // 直接使用返回的路径（已经是完整URL或同域路径）
                window.open(actualPath, '_blank');
              }}
            >
              {fileName}
            </Button>
          );
        })}
      </Space>
    );
  };

  // 分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ ...pagination, current: page, pageSize });
    fetchData(page, pageSize);
  };

  // 表格列定义
  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: '市区',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      align: 'center',
    },
    {
      title: '园区',
      dataIndex: 'zoneName',
      key: 'zoneName',
      width: 150,
      align: 'center',
    },
    {
      title: '镇街',
      dataIndex: 'townName',
      key: 'townName',
      width: 120,
      align: 'center',
    },
    {
      title: '开始日期',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 110,
      align: 'center',
    },
    {
      title: '结束日期',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 110,
      align: 'center',
    },
    {
      title: '活动内容',
      dataIndex: 'activityContent',
      key: 'activityContent',
      ellipsis: true,
      width: 200,
      align: 'center',
    },
    {
      title: '活动地址',
      dataIndex: 'zjbAddress',
      key: 'zjbAddress',
      width: 180,
      align: 'center',
      render: (address: string) => {
        const option = activityAddressOptions.find(opt => opt.label === address);
        return option ? option.label : address;
      },
    },
    {
      title: '主要领导',
      dataIndex: 'leaders',
      key: 'leaders',
      width: 150,
      align: 'center',
    },
    {
      title: '所属产业链',
      dataIndex: 'industryName',
      key: 'industryName',
      width: 150,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
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
            onClick={() => handleViewDetail(record)}
          >
            <div>详情</div>
            <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
          </div>
        </div>
      ),
    },
  ];

  const isPending = currentDetail?.auditStatus === 0;

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
                <Form.Item<SearchFieldType> label="市区" name="code">
                  <Select placeholder="请选择" allowClear onChange={handleSearchDistrictChange} disabled={level4User?.isLevel4}>
                    {districtOptions.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item<SearchFieldType> label="园区" name="zone_code">
                  <Select placeholder="请先选择市区" allowClear onChange={handleSearchZoneChange} disabled={level4User?.isLevel4 || searchZoneOptions.length === 0}>
                    {searchZoneOptions.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item<SearchFieldType> label="镇街" name="town_code">
                  <Select placeholder={!searchZoneSelected ? "请先选择园区" : (searchTownOptions.length === 0 ? "暂无镇街" : "请选择镇街")} allowClear disabled={level4User?.isTownLevel || searchTownOptions.length === 0}>
                    {searchTownOptions.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item<SearchFieldType> label="开始日期" name="start_time">
                  <DatePicker placeholder="请选择开始日期" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item<SearchFieldType> label="结束日期" name="end_time">
                  <DatePicker placeholder="请选择结束日期" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item<SearchFieldType> label="活动地址" name="activity_address">
                  <Select placeholder="请选择" allowClear>
                    {activityAddressOptions.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Space>
                    <Button type="primary" onClick={onSearch}>
                      查询
                    </Button>
                    <Button onClick={onReset}>重置</Button>
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
          scroll={{ x: 1400 }}
        />
      </div>

      {/* 详情弹窗 */}
      <Modal
        title="招商活动开展审核详情"
        open={detailModalVisible}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={700}
        bodyStyle={{
          maxHeight: 'calc(90vh - 200px)',
          overflow: 'auto',
        }}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>加载中...</div>
        ) : currentDetail ? (
          <div style={{ marginTop: 24 }}>
            <Descriptions column={1} bordered labelStyle={{ width: '150px', fontWeight: 'bold' }}>
              <Descriptions.Item label="市区">{currentDetail.name}</Descriptions.Item>
              <Descriptions.Item label="园区">{currentDetail.zoneName || '-'}</Descriptions.Item>
              <Descriptions.Item label="开始时间">{currentDetail.startTime}</Descriptions.Item>
              <Descriptions.Item label="结束时间">{currentDetail.endTime}</Descriptions.Item>
              <Descriptions.Item label="活动地址">{currentDetail.zjbAddress}</Descriptions.Item>
              <Descriptions.Item label="活动内容">{currentDetail.activityContent}</Descriptions.Item>
              <Descriptions.Item label="主要领导">{currentDetail.leaders}</Descriptions.Item>
              <Descriptions.Item label="所属产业链">{currentDetail.industryName}</Descriptions.Item>
              <Descriptions.Item label="佐证材料">{renderFiles(currentDetail.images, currentDetail.createTime)}</Descriptions.Item>
              <Descriptions.Item label="审核结果">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>{renderAuditStatus(currentDetail.auditStatus)}</div>
                  {currentDetail.auditStatus === 2 && currentDetail.auditRemark && (
                    <div>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#ff4d4f' }}>不通过原因：</div>
                      <div style={{ padding: '8px', background: '#fff5f5', borderRadius: '4px', border: '1px solid #ffccc7' }}>
                        {currentDetail.auditRemark}
                      </div>
                    </div>
                  )}
                  {isPending && (
                    <div style={{ marginTop: '8px' }}>
                      <Space>
                        <Button
                          type="primary"
                          style={{
                            background: '#52c41a',
                            borderColor: '#52c41a',
                          }}
                          onClick={() => handleOpenAuditModal('pass')}
                        >
                          通过
                        </Button>
                        <Button
                          danger
                          onClick={() => handleOpenAuditModal('reject')}
                        >
                          不通过
                        </Button>
                      </Space>
                    </div>
                  )}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>未找到数据</div>
        )}
      </Modal>

      {/* 审核弹窗 */}
      <Modal
        title={auditResult === 'pass' ? '审核通过' : '审核不通过'}
        open={auditModalVisible}
        onOk={handleSubmitAudit}
        onCancel={() => setAuditModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={500}
      >
        {auditResult === 'pass' ? (
          <div style={{ padding: '20px 0' }}>
            <p>确定要通过该活动的审核吗？</p>
          </div>
        ) : (
          <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '12px', color: '#ff4d4f' }}>
              <span style={{ color: '#ff4d4f' }}>* </span>
              请填写不通过原因：
            </div>
            <TextArea
              rows={4}
              placeholder="请输入不通过原因"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              maxLength={500}
              showCount
            />
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default InvestmentActivityAudit;
