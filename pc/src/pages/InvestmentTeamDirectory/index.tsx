import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { request } from '@umijs/max';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  specialization: string | string[];
  contact: string;
  district?: string;
  zone?: string;
  park?: string;
  town?: string;
  phone?: string;
  districtCode?: string;
  zoneCode?: string;
  townCode?: string;
  csrq?: string;
  investPlace?: string | string[];
  remark?: string;
  zc?: string;
  xl?: string;
}

interface SearchFieldType {
  name?: string;
  position?: string;
  specialization?: string;
  contact?: string;
  district?: string;
  park?: string;
  town?: string;
  investPlace?: string[];
}

interface FormFieldType {
  name: string;
  position: string;
  specialization: string[];
  contact: string;
  district?: string;
  park?: string;
  town?: string;
  csrq?: Dayjs;
  investPlace?: string[];
  remark?: string;
  zc?: string;
  xl?: string;
}

const InvestmentTeamDirectory: React.FC = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm<FormFieldType>();
  const [searchForm] = Form.useForm<SearchFieldType>();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<TeamMember[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TeamMember | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 市区选项（动态获取）
  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>([]);

  // 园区选项（根据市区动态变化）
  const [parkOptions, setParkOptions] = useState<{ label: string; value: string }[]>([]);
  
  // 搜索表单的园区选项
  const [searchParkOptions, setSearchParkOptions] = useState<{ label: string; value: string }[]>([]);
  
  // 镇街选项（根据园区动态变化）
  const [townOptions, setTownOptions] = useState<{ label: string; value: string }[]>([]);
  
  // 搜索表单的镇街选项
  const [searchTownOptions, setSearchTownOptions] = useState<{ label: string; value: string }[]>([]);
  
  // 标记搜索表单的园区是否已选择
  const [searchParkSelected, setSearchParkSelected] = useState(false);
  
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
  
  // 主要招商方向选项（字典获取）
  const [specializationOptions, setSpecializationOptions] = useState<{ label: string; value: string }[]>([]);

  // 招商区域选项（字典获取）
  const [investPlaceOptions, setInvestPlaceOptions] = useState<{ label: string; value: string }[]>([]);

  // 学历选项（字典获取）
  const [xlOptions, setXlOptions] = useState<{ label: string; value: string }[]>([]);

  // 获取主要招商方向列表
  const fetchSpecializationList = async () => {
    try {
      const response = await request('/system-api/dict/zgfx/items', {
        method: 'GET',
        params: { all: true },
      });

      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.label || item.name,
          value: item.value || item.id,
        }));
        setSpecializationOptions(options);
      }
    } catch (error) {
      console.error('获取主要招商方向列表失败:', error);
      message.error('获取主要招商方向列表失败');
    }
  };

  // 获取招商区域列表
  const fetchInvestPlaceList = async () => {
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
        setInvestPlaceOptions(options);
      }
    } catch (error) {
      console.error('获取招商区域列表失败:', error);
      message.error('获取招商区域列表失败');
    }
  };

  // 获取学历列表
  const fetchXlList = async () => {
    try {
      const response = await request('/system-api/dict/xl/items', {
        method: 'GET',
        params: { all: true },
      });

      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.label || item.name,
          value: item.value || item.id,
        }));
        setXlOptions(options);
      }
    } catch (error) {
      console.error('获取学历列表失败:', error);
      message.error('获取学历列表失败');
    }
  };

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
          setSearchParkOptions([{
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

  // 获取园区列表
  const fetchParkList = async (pid: string, isSearch: boolean = false) => {
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
        
        if (isSearch) {
          setSearchParkOptions(options);
        } else {
          setParkOptions(options);
        }
      }
    } catch (error) {
      console.error('获取园区列表失败:', error);
      message.error('获取园区列表失败');
    }
  };

  // 获取镇街列表
  const fetchTownList = async (pid: string, isSearch: boolean = false) => {
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
        
        if (isSearch) {
          setSearchTownOptions(options);
        } else {
          setTownOptions(options);
        }
      }
    } catch (error) {
      console.error('获取镇街列表失败:', error);
      message.error('获取镇街列表失败');
    }
  };

  // 监听市区变化，更新园区选项
  const handleDistrictChange = (value: string, isSearch: boolean = false) => {
    if (value) {
      fetchParkList(value, isSearch);
    } else {
      if (isSearch) {
        setSearchParkOptions([]);
      } else {
        setParkOptions([]);
      }
    }

    // 清空园区和镇街选择
    if (isSearch) {
      setSearchTownOptions([]);
      setSearchParkSelected(false);
      searchForm.setFieldsValue({ park: undefined, town: undefined });
    } else {
      setTownOptions([]);
      modalForm.setFieldsValue({ park: undefined, town: undefined });
    }
  };
  
  // 监听园区变化，更新镇街选项
  const handleParkChange = (value: string, isSearch: boolean = false) => {
    if (value) {
      if (isSearch) {
        setSearchParkSelected(true);
      }
      fetchTownList(value, isSearch);
    } else {
      if (isSearch) {
        setSearchParkSelected(false);
        setSearchTownOptions([]);
      } else {
        setTownOptions([]);
      }
    }

    // 清空镇街选择
    if (isSearch) {
      searchForm.setFieldsValue({ town: undefined });
    } else {
      modalForm.setFieldsValue({ town: undefined });
    }
  };

  // 获取数据
  const fetchData = async (page: number = 1, pageSize: number = 10) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();

      const response = await request(`/zsxt-api/tProjTzTeam/list?page=${page}&size=${pageSize}`, {
        method: 'POST',
        data: {
          name: values.name,
          position: values.position,
          specialization: values.specialization || '',
          districtCode: values.district,
          zoneCode: values.park,
          townCode: values.town,
          investPlace: Array.isArray(values.investPlace)
            ? values.investPlace.join(',')
            : values.investPlace || '',
          phone: values.contact,
        },
      });

      if (response && response.records) {
        setDataSource(response.records);
        setPagination({
          current: response.page || page,
          pageSize: response.size || pageSize,
          total: response.total || 0,
        });
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

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
            setSearchParkOptions([{
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
            district: level4Info.districtCode,
            park: level4Info.zoneCode,
          };
          
          // 如果是镇街级别，设置镇街默认值
          if (level4Info.isTownLevel && level4Info.townCode) {
            searchFormValues.town = level4Info.townCode;
          }
          
          searchForm.setFieldsValue(searchFormValues);
          
          // 标记园区已选择
          setSearchParkSelected(true);
        } catch (error) {
          console.error('获取市区/园区名称失败:', error);
        }
      } else {
        // 非 level=4 用户，加载市区列表
        fetchDistrictList();
      }
      
      fetchData();
      fetchSpecializationList();
      fetchInvestPlaceList();
      fetchXlList();
    };
    
    init();
  }, []);

  // 新增
  const handleAdd = () => {
    setEditingRecord(null);
    modalForm.resetFields();
    
    // 如果是 level=4 用户，设置默认值和园区/镇街选项
    if (level4User) {
      setParkOptions([{
        label: level4User.zoneName,
        value: level4User.zoneCode,
      }]);
      
      // 如果是镇街级别，设置镇街选项
      if (level4User.isTownLevel && level4User.townCode && level4User.townName) {
        setTownOptions([{
          label: level4User.townName,
          value: level4User.townCode,
        }]);
      } else {
        setTownOptions([]);
      }
      
      setTimeout(() => {
        const formValues: any = {
          district: level4User.districtCode,
          park: level4User.zoneCode,
        };
        
        // 如果是镇街级别，设置镇街默认值
        if (level4User.isTownLevel && level4User.townCode) {
          formValues.town = level4User.townCode;
        }
        
        modalForm.setFieldsValue(formValues);
      }, 100);
    } else {
      setParkOptions([]);
      setTownOptions([]);
    }
    
    setModalVisible(true);
  };

  // 编辑
  const handleEdit = async (record: TeamMember) => {
    try {
      setEditingRecord(record);
      
      // 获取详情
      const response = await request(`/zsxt-api/tProjTzTeam/getById/${record.id}`, {
        method: 'GET',
      });
      
      if (response) {
        console.log('编辑数据:', response);
        console.log('学历选项:', xlOptions);
        console.log('招商区域选项:', investPlaceOptions);

        // 设置表单值
        modalForm.setFieldsValue({
          name: response.name,
          position: response.position,
          specialization: response.specialization
            ? (typeof response.specialization === 'string'
                ? response.specialization.split(',')
                : response.specialization)
            : [],
          contact: response.phone,
          district: response.districtCode,
          park: response.zoneCode,
          csrq: response.csrq ? dayjs(response.csrq) : undefined,
          investPlace: response.investPlace
            ? (typeof response.investPlace === 'string'
                ? response.investPlace.split(',')
                : response.investPlace)
            : [],
          zc: response.zc,
          xl: response.xl,
          remark: response.remark,
        });
        
        // 设置园区选项
        if (response.districtCode) {
          await fetchParkList(response.districtCode, false);
        }
      }
      
      setModalVisible(true);
    } catch (error) {
      console.error('获取详情失败:', error);
      message.error('获取详情失败');
    }
  };

  // 删除
  const handleDelete = async (id: string) => {
    try {
      await request(`/zsxt-api/tProjTzTeam/delete/${id}`, {
        method: 'DELETE',
      });
      
      message.success('删除成功');
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 保存
  const handleSave = async () => {
    try {
      const values = await modalForm.validateFields();
      
      // 获取市区、园区的名称
      const districtItem = districtOptions.find(item => item.value === values.district);
      const parkItem = parkOptions.find(item => item.value === values.park);
      
      // 构建请求数据
      const requestData = {
        name: values.name,
        position: values.position,
        specialization: Array.isArray(values.specialization)
          ? values.specialization.join(',')
          : values.specialization || '',
        phone: values.contact,
        district: districtItem?.label || '',
        districtCode: values.district || '',
        zone: parkItem?.label || '',
        zoneCode: values.park || '',
        town: '', // 镇街名称（暂无）
        townCode: '', // 镇街编码（暂无）
        csrq: values.csrq ? dayjs(values.csrq).format('YYYY-MM-DD') : '', // 出生年月
        investPlace: Array.isArray(values.investPlace)
          ? values.investPlace.join(',')
          : values.investPlace || '', // 招商区域
        zc: values.zc || '', // 专业或职称
        xl: values.xl || '', // 学历
        remark: values.remark || '', // 备注
      };
      
      if (editingRecord) {
        // 编辑：调用更新接口
        await request('/zsxt-api/tProjTzTeam/update', {
          method: 'POST',
          data: {
            ...requestData,
            id: editingRecord.id,
          },
        });
        message.success('修改成功');
      } else {
        // 新增：调用新增接口
        await request('/zsxt-api/tProjTzTeam/create', {
          method: 'POST',
          data: requestData,
        });
        message.success('新增成功');
      }
      
      setModalVisible(false);
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  // 查询
  const onSearch = () => {
    fetchData(1, pagination.pageSize);
  };

  // 重置
  const onReset = () => {
    searchForm.resetFields();
    setSearchParkOptions([]);
    setSearchTownOptions([]);
    setSearchParkSelected(false);
    fetchData(1, pagination.pageSize);
  };

  // 分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    setPagination({ ...pagination, current: page, pageSize });
    fetchData(page, pageSize);
  };

  // 表格列配置
  const columns: ColumnsType<TeamMember> = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      align: 'center',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: '所在市（区）',
      dataIndex: 'district',
      key: 'district',
      width: 120,
      align: 'center',
    },
    {
      title: '所在园（区）',
      dataIndex: 'zone',
      key: 'zone',
      width: 150,
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      align: 'center',
    },
    {
      title: '职务',
      dataIndex: 'position',
      key: 'position',
      width: 120,
      align: 'center',
    },

    {
      title: '主要招商方向',
      dataIndex: 'specialization',
      key: 'specialization',
      width: 150,
      align: 'center',
      render: (specialization: string | string[]) => {
        if (Array.isArray(specialization)) {
          return specialization.join(', ')
        }
        return specialization || '-'
      },
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      align: 'center',
    },
    {
      title: '出生年月',
      dataIndex: 'csrq',
      key: 'csrq',
      width: 120,
      align: 'center',
    },
    {
      title: '招商区域',
      dataIndex: 'investPlace',
      key: 'investPlace',
      width: 120,
      align: 'center',
      render: (investPlace: string | string[]) => {
        if (Array.isArray(investPlace)) {
          return investPlace.map(code => {
            const option = investPlaceOptions.find(opt => opt.value === code)
            return option ? option.label : code
          }).join(', ')
        }
        const option = investPlaceOptions.find(opt => opt.value === investPlace)
        return option ? option.label : investPlace
      }
    },
    {
      title: '专业或职称',
      dataIndex: 'zc',
      key: 'zc',
      width: 120,
      align: 'center',
    },
    {
      title: '学历',
      dataIndex: 'xl',
      key: 'xl',
      width: 100,
      align: 'center',
      render: (xl: string) => {
        const option = xlOptions.find(opt => opt.value === xl)
        return option ? option.label : xl
      }
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
                onOk: () => handleDelete(record.id),
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
          {/* 查询表单 */}
          <Form form={searchForm} name="searchForm">
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item<SearchFieldType> label="姓名" name="name">
                  <Input placeholder="请输入姓名" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item<SearchFieldType> label="职务" name="position">
                  <Input placeholder="请输入职务" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item<SearchFieldType> label="主要招商方向" name="specialization">
                  <Select
                    placeholder="请选择主要招商方向"
                    options={specializationOptions}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item<SearchFieldType> label="所在市（区）" name="district">
                  <Select
                    placeholder="请选择所在市"
                    options={districtOptions}
                    onChange={(value) => handleDistrictChange(value, true)}
                    disabled={level4User?.isLevel4}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item<SearchFieldType> label="所在园（区）" name="park">
                  <Select 
                    placeholder="请先选择市区" 
                    options={searchParkOptions} 
                    onChange={(value) => handleParkChange(value, true)}
                    disabled={level4User?.isLevel4 || searchParkOptions.length === 0}
                    allowClear 
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item<SearchFieldType> label="镇街" name="town">
                  <Select 
                    placeholder={!searchParkSelected ? "请先选择园区" : (searchTownOptions.length === 0 ? "暂无镇街" : "请选择镇街")} 
                    options={searchTownOptions} 
                    disabled={level4User?.isTownLevel || searchTownOptions.length === 0}
                    allowClear 
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item<SearchFieldType> label="联系方式" name="contact">
                  <Input placeholder="请输入联系方式" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Space>
                    <Button type="primary" onClick={handleAdd}>
                      新增
                    </Button>
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
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: handleTableChange,
          }}
        />

        {/* 新增/编辑弹窗 */}
        <Modal
          title={editingRecord ? '编辑团队成员' : '新增团队成员'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={() => setModalVisible(false)}
          width={600}
          okText="确定"
          cancelText="取消"
        >
          <Form form={modalForm} layout="vertical">
            <Form.Item<FormFieldType>
              label="姓名"
              name="name"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item<FormFieldType>
              label="职务"
              name="position"
              rules={[{ required: true, message: '请输入职务' }]}
            >
              <Input placeholder="请输入职务" />
            </Form.Item>
            <Form.Item<FormFieldType>
              label="主要招商方向"
              name="specialization"
              rules={[{ required: true, message: '请选择主要招商方向' }]}
            >
              <Select 
                mode="multiple"
                placeholder="请选择主要招商方向" 
                options={specializationOptions}
                allowClear
              />
            </Form.Item>
            <Form.Item<FormFieldType>
              label="联系方式"
              name="contact"
              rules={[
                { required: true, message: '请输入联系方式' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
              ]}
            >
              <Input placeholder="请输入联系方式" />
            </Form.Item>
            <Form.Item<FormFieldType> label="所在市（区）" name="district">
              <Select
                placeholder="请选择所在市（区）"
                options={districtOptions}
                onChange={(value) => handleDistrictChange(value, false)}
                disabled={level4User?.isLevel4}
                allowClear
              />
            </Form.Item>
            <Form.Item<FormFieldType> label="所在园（区）" name="park">
              <Select 
                placeholder="请选择所在园（区）" 
                options={parkOptions} 
                onChange={(value) => handleParkChange(value, false)}
                disabled={level4User?.isLevel4 || parkOptions.length === 0}
                allowClear 
              />
            </Form.Item>
            <Form.Item<FormFieldType> label="镇街" name="town">
              <Select
                placeholder="请选择镇街"
                options={townOptions}
                disabled={level4User?.isTownLevel || townOptions.length === 0}
                allowClear
              />
            </Form.Item>
            <Form.Item<FormFieldType> label="出生年月" name="csrq">
              <DatePicker style={{ width: '100%' }} placeholder="请选择出生年月" />
            </Form.Item>
            <Form.Item<FormFieldType> label="招商区域" name="investPlace">
              <Select
                mode="multiple"
                placeholder="请选择招商区域"
                options={investPlaceOptions}
                allowClear
              />
            </Form.Item>
            <Form.Item<FormFieldType> label="专业或职称" name="zc">
              <Input placeholder="请输入专业或职称" />
            </Form.Item>
            <Form.Item<FormFieldType> label="学历" name="xl">
              <Select
                placeholder="请选择学历"
                options={xlOptions}
                allowClear
              />
            </Form.Item>
            <Form.Item<FormFieldType> label="备注" name="remark">
              <Input.TextArea placeholder="请输入备注" rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default InvestmentTeamDirectory;
