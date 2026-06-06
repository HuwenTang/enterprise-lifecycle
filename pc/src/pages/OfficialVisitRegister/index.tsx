import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, DatePicker, Form, Input, message, Modal, Pagination, Popconfirm, Row, Select, Space, Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import dayjs from 'dayjs';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';

const { TextArea } = Input;

type SearchFieldType = {
  year?: string;
  code?: string;
  zone_code?: string;
  town_code?: string;
  groupName?: string;
};

type FormFieldType = {
  id?: string;
  year?: string;
  code?: string;
  name?: string;
  zone_code?: string;
  zone_name?: string;
  town_code?: string;
  town_name?: string;
  groupName?: string;
  mainMembers?: string;
  visitDestination?: string;
  activitiesAndVisits?: string;
  achievements?: string;
  nextPlan?: string;
};

interface DataType {
  id: string;
  year: string;
  code: string;
  name: string;
  districtCode?: string;
  districtName?: string;
  zoneCode?: string;
  zoneName?: string;
  townCode?: string;
  townName?: string;
  groupName: string;
  mainMembers: string;
  visitDestination: string;
  activitiesAndVisits: string;
  achievements: string;
  nextPlan: string;
}


const OfficialVisitRegister = () => {
  const [searchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();

  // 从 URL 参数初始化状态
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  // 分页状态管理
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialPageSize,
    total: 0
  });

  // 数据源
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);

  // 市区选项（动态获取）
  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>([]);
  
  // 园区选项（根据选择的市区动态变化）
  const [zoneOptions, setZoneOptions] = useState<{ label: string; value: string }[]>([]);
  
  // 搜索表单的园区选项
  const [searchZoneOptions, setSearchZoneOptions] = useState<{ label: string; value: string }[]>([]);
  
  // 镇街选项（根据选择的园区动态变化）
  const [townOptions, setTownOptions] = useState<{ label: string; value: string }[]>([]);
  
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
    isTownLevel: boolean; // 是否是镇街级别（zsDept是12位）
  } | null>(null);

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('添加项目情况');
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);

  // 更新动态弹窗状态
  const [updateDynamicModalVisible, setUpdateDynamicModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<DataType | null>(null);
  const [activeTab, setActiveTab] = useState('progress');
  
  // 进展动态列表
  const [progressList, setProgressList] = useState<Array<{
    id: string;
    tripId: string;
    content: string;
    fillTime: string;
  }>>([]);
  const [progressPagination, setProgressPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [progressForm] = Form.useForm();
  const [editingProgressId, setEditingProgressId] = useState<string | null>(null);
  const [showProgressForm, setShowProgressForm] = useState(false);
  
  // 关联项目列表
  const [relatedProjects, setRelatedProjects] = useState<Array<{
    id: string;
    district: string;
    zoneName: string;
    townName: string;
    code: string;
    name: string;
    investMoney: number;
    ptype: number;
  }>>([]);
  const [relateProjectModalVisible, setRelateProjectModalVisible] = useState(false);
  const [relateProjectForm] = Form.useForm();
  const [projectSearchKeyword, setProjectSearchKeyword] = useState('');
  const [searchedProjects, setSearchedProjects] = useState<Array<{
    id: string;
    district: string;
    zoneName: string;
    townName: string;
    code: string;
    name: string;
    investMoney: number;
    ptype: number;
  }>>([]);
  const [projectSearchPagination, setProjectSearchPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [projectSearchLoading, setProjectSearchLoading] = useState(false);
  
  // 已关联项目列表分页
  const [relatedProjectsPagination, setRelatedProjectsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [relatedProjectsLoading, setRelatedProjectsLoading] = useState(false);

  // 获取数据
  const fetchData = async (page: number = pagination.current, pageSize: number = pagination.pageSize) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const response = await request(`/zsxt-api/tProjBusinessTrip/list?page=${page}&size=${pageSize}`, {
        method: 'POST',
        data: {
          code: values.code,
          zoneCode: values.zone_code,
          townCode: values.town_code,
          groupName: values.groupName,
          year: values.year ? dayjs(values.year).format('YYYY') : undefined,
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
            // 园区名称暂时为空，后面从接口获取
          } else {
            // 其他位数 = 园区级别
            isTownLevel = false;
            zoneCode = firstArea.zsDept;
            zoneName = firstArea.name;
          }
          
          // 设置搜索表单的园区选项
          setSearchZoneOptions([{
            label: zoneName || '', // 如果是镇街级别，园区名称暂时为空
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
  
  // 获取园区列表（编辑表单）
  const fetchZoneList = async (pid: string) => {
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
        setZoneOptions(options);
      }
    } catch (error) {
      console.error('获取园区列表失败:', error);
      message.error('获取园区列表失败');
    }
  };

  // 获取镇街列表（编辑表单）
  const fetchTownList = async (pid: string) => {
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
        setTownOptions(options);
      }
    } catch (error) {
      console.error('获取镇街列表失败:', error);
      message.error('获取镇街列表失败');
    }
  };

  // 市区变化时，更新园区选项（编辑表单）
  const handleDistrictChange = (value: string) => {
    if (value) {
      fetchZoneList(value);
    } else {
      setZoneOptions([]);
    }
    // 清空园区和镇街选择
    setTownOptions([]);
    editForm.setFieldsValue({ zone_code: undefined, town_code: undefined });
  };
  
  // 园区变化时，更新镇街选项（编辑表单）
  const handleZoneChange = (value: string) => {
    if (value) {
      fetchTownList(value);
    } else {
      setTownOptions([]);
    }
    // 清空镇街选择
    editForm.setFieldsValue({ town_code: undefined });
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
          // 即使获取失败，也要设置默认值
          const level4Data = {
            isLevel4: true,
            districtCode: level4Info.districtCode,
            districtName: '',
            zoneCode: level4Info.zoneCode,
            zoneName: level4Info.zoneName,
            townCode: level4Info.townCode,
            townName: level4Info.townName,
            isTownLevel: level4Info.isTownLevel,
          };
          setLevel4User(level4Data);
          
          const searchFormValues: any = {
            code: level4Info.districtCode,
            zone_code: level4Info.zoneCode,
          };
          
          if (level4Info.isTownLevel && level4Info.townCode) {
            searchFormValues.town_code = level4Info.townCode;
          }
          
          searchForm.setFieldsValue(searchFormValues);
        }
      } else {
        // 非 level=4 用户，加载市区列表
        fetchDistrictList();
      }
      
      // 加载数据
      fetchData();
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

  // 新增
  const handleAdd = () => {
    setModalTitle('添加项目情况');
    setEditingRecord(null);
    editForm.resetFields();
    
    // 如果是 level=4 用户，设置默认值和园区/镇街选项
    if (level4User) {
      setZoneOptions([{
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
          code: level4User.districtCode,
          zone_code: level4User.zoneCode,
        };
        
        // 如果是镇街级别，设置镇街默认值
        if (level4User.isTownLevel && level4User.townCode) {
          formValues.town_code = level4User.townCode;
        }
        
        editForm.setFieldsValue(formValues);
      }, 100);
    } else {
      setZoneOptions([]);
      setTownOptions([]);
    }
    
    setIsModalOpen(true);
  };

  // 编辑
  const handleEdit = async (record: DataType) => {
    setModalTitle('编辑项目情况');
    setEditingRecord(record);
    
    try {
      // 调用详情接口获取完整数据
      const response = await request(`/zsxt-api/tProjBusinessTrip/getById/${record.id}`, {
        method: 'GET',
      });
      
      const info = response || record;
      
      // 如果是 level=4 用户，设置园区/镇街选项
      if (level4User) {
        setZoneOptions([{
          label: level4User.zoneName,
          value: level4User.zoneCode,
        }]);
        if (level4User.isTownLevel && level4User.townCode && level4User.townName) {
          setTownOptions([{
            label: level4User.townName,
            value: level4User.townCode,
          }]);
        } else {
          setTownOptions([]);
        }
      } else {
        // 非 level4 用户，根据详情数据加载园区和镇街选项
        if (info.code) {
          await fetchZoneList(info.code);
          if (info.zoneCode) {
            await fetchTownList(info.zoneCode);
          } else {
            setTownOptions([]);
          }
        } else {
          setZoneOptions([]);
          setTownOptions([]);
        }
      }
      
      editForm.setFieldsValue({
        code: info.code,
        zone_code: info.zoneCode || undefined,
        town_code: info.townCode || undefined,
        year: info.year ? dayjs(info.year, 'YYYY') : undefined,
        groupName: info.groupName,
        mainMembers: info.mainMembers,
        visitDestination: info.visitDestination,
        activitiesAndVisits: info.activitiesAndVisits,
        achievements: info.achievements,
        nextPlan: info.nextPlan,
      });
      
      setIsModalOpen(true);
    } catch (error) {
      console.error('获取详情失败:', error);
      message.error('获取详情失败');
    }
  };

  // 删除
  const handleDelete = async (record: DataType) => {
    try {
      await request(`/zsxt-api/tProjBusinessTrip/delete/${record.id}`, {
        method: 'DELETE',
      });
      
      message.success('删除成功');
      fetchData();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 获取进展动态列表
  const fetchProgressList = async (tripId: string, page: number = 1, pageSize: number = 10) => {
    try {
      const response = await request(`/zsxt-api/tProjBusinessTripDynamic/list?page=${page}&size=${pageSize}`, {
        method: 'POST',
        data: {
          tripId,
        },
      });
      
      if (response && response.records) {
        setProgressList(response.records);
        setProgressPagination({
          current: response.page || page,
          pageSize: response.size || pageSize,
          total: response.total || 0
        });
      }
    } catch (error) {
      console.error('获取进展动态失败:', error);
      message.error('获取进展动态失败');
    }
  };

  // 获取已关联项目列表
  const fetchRelatedProjects = async (tripId: string, page: number = 1, pageSize: number = 10) => {
    setRelatedProjectsLoading(true);
    try {
      const response = await request(`/zsxt-api/tProjBusinessTripProject/listProjectDetails?page=${page}&size=${pageSize}`, {
        method: 'POST',
        data: {
          tripId,
        },
      });
      
      if (response && response.records) {
        setRelatedProjects(response.records);
        setRelatedProjectsPagination({
          current: response.page || page,
          pageSize: response.size || pageSize,
          total: response.total || 0
        });
      }
    } catch (error) {
      console.error('获取已关联项目失败:', error);
      message.error('获取已关联项目失败');
    } finally {
      setRelatedProjectsLoading(false);
    }
  };

  // 已关联项目分页切换
  const handleRelatedProjectsPageChange = (page: number, pageSize: number) => {
    if (currentRecord?.id) {
      fetchRelatedProjects(currentRecord.id, page, pageSize);
    }
  };

  // 打开更新动态弹窗
  const handleOpenUpdateDynamic = async (record: DataType) => {
    setCurrentRecord(record);
    setActiveTab('progress');
    
    try {
      // 获取进展动态列表
      await fetchProgressList(record.id);
      
      // 获取已关联项目列表
      await fetchRelatedProjects(record.id);
      
      setUpdateDynamicModalVisible(true);
    } catch (error) {
      console.error('获取动态失败:', error);
      message.error('获取动态失败');
    }
  };

  // 添加进展动态
  const handleAddProgress = async () => {
    try {
      const values = await progressForm.validateFields();
      
      if (!currentRecord?.id) {
        message.error('缺少出访记录ID');
        return;
      }
      
      if (editingProgressId) {
        // 编辑 - 调用更新接口
        await request('/zsxt-api/tProjBusinessTripDynamic/update', {
          method: 'POST',
          data: {
            id: editingProgressId,
            tripId: currentRecord.id,
            content: values.content,
          },
        });
        
        message.success('编辑成功');
        
        // 刷新进展动态列表
        await fetchProgressList(currentRecord.id, progressPagination.current, progressPagination.pageSize);
      } else {
        // 新增 - 调用新增接口
        await request('/zsxt-api/tProjBusinessTripDynamic/create', {
          method: 'POST',
          data: {
            tripId: currentRecord.id,
            content: values.content,
          },
        });
        
        message.success('添加成功');
        
        // 刷新进展动态列表（回到第一页）
        await fetchProgressList(currentRecord.id);
      }
      
      progressForm.resetFields();
      setEditingProgressId(null);
      setShowProgressForm(false);
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败');
    }
  };

  // 编辑进展动态
  const handleEditProgress = async (item: {id: string; tripId: string; fillTime: string; content: string}) => {
    try {
      // 调用详情接口获取最新数据
      const response = await request(`/zsxt-api/tProjBusinessTripDynamic/getById/${item.id}`, {
        method: 'GET',
      });
      
      const detail = response || item;
      
      setEditingProgressId(item.id);
      setShowProgressForm(true);
      progressForm.setFieldsValue({
        content: detail.content,
      });
      
      // 滚动到表单位置
      setTimeout(() => {
        const formElement = document.querySelector('.progress-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } catch (error) {
      console.error('获取详情失败:', error);
      message.error('获取详情失败');
    }
  };

  // 删除进展动态
  const handleDeleteProgress = async (id: string) => {
    try {
      await request(`/zsxt-api/tProjBusinessTripDynamic/delete/${id}`, {
        method: 'DELETE',
      });
      
      message.success('删除成功');
      
      // 刷新进展动态列表
      if (currentRecord?.id) {
        await fetchProgressList(currentRecord.id);
      }
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 进展动态分页切换
  const handleProgressPageChange = (page: number, pageSize: number) => {
    if (currentRecord?.id) {
      fetchProgressList(currentRecord.id, page, pageSize);
    }
  };

  // 打开关联项目弹窗
  const handleOpenRelateProject = () => {
    relateProjectForm.resetFields();
    setProjectSearchKeyword('');
    setSearchedProjects([]);
    setRelateProjectModalVisible(true);
    // 打开弹窗时自动加载第一页数据
    handleSearchProject(1, 10);
  };

  // 查询项目
  const handleSearchProject = async (page: number = 1, pageSize: number = 10) => {
    const keyword = relateProjectForm.getFieldValue('projectName');
    setProjectSearchKeyword(keyword || '');
    
    if (!currentRecord?.id) {
      message.warning('请先选择出访记录');
      return;
    }
    
    setProjectSearchLoading(true);
    try {
      const response = await request(`/zsxt-api/tProjBusinessTripProject/listUnboundProjects?page=${page}&size=${pageSize}`, {
        method: 'POST',
        data: {
          tripId: currentRecord.id,
          projectName: keyword || '',
        },
      });
      
      if (response && response.records) {
        setSearchedProjects(response.records);
        setProjectSearchPagination({
          current: response.page || page,
          pageSize: response.size || pageSize,
          total: response.total || 0
        });
      }
    } catch (error) {
      console.error('查询项目失败:', error);
      message.error('查询项目失败');
    } finally {
      setProjectSearchLoading(false);
    }
  };

  // 项目搜索分页切换
  const handleProjectSearchPageChange = (page: number, pageSize: number) => {
    handleSearchProject(page, pageSize);
  };

  // 重置项目搜索
  const handleResetProjectSearch = () => {
    relateProjectForm.resetFields();
    setProjectSearchKeyword('');
    handleSearchProject(1, 10);
  };

  // 旧的模拟代码注释
  /*
  const handleSearchProject_old = () => {
    const keyword = relateProjectForm.getFieldValue('projectName');
    setProjectSearchKeyword(keyword || '');
    
    // 模拟数据
    const mockProjects = [
      {
        id: '101',
        district: '靖江市',
        park: '靖江经济开发区',
        street: '新桥镇',
        projectCode: 'JJ2024001',
        projectName: '高端装备制造产业园项目',
        investment: '12000',
        category: '制造业',
      },
      {
        id: '102',
        district: '泰兴市',
        park: '泰兴经济开发区',
        street: '黄桥镇',
        projectCode: 'TX2024002',
        projectName: '新能源汽车零部件生产基地',
        investment: '8500',
        category: '制造业',
      },
      {
        id: '103',
        district: '兴化市',
        park: '兴化经济开发区',
        street: '戴南镇',
        projectCode: 'XH2024003',
        projectName: '智能家居产业园',
        investment: '6000',
        category: '制造业',
      },
      {
        id: '104',
        district: '海陵区',
        park: '海陵工业园区',
        street: '城东街道',
        projectCode: 'HL2024004',
        projectName: '生物医药研发中心',
        investment: '15000',
        category: '医药',
      },
      {
        id: '105',
        district: '姜堰区',
        park: '姜堰经济开发区',
        street: '溱潼镇',
        projectCode: 'JY2024005',
        projectName: '现代物流园区',
        investment: '9500',
        category: '物流',
      },
    ];
    
    // 根据关键词过滤
    if (keyword) {
      const filtered = mockProjects.filter(p => 
        p.projectName.includes(keyword) || 
        p.projectCode.includes(keyword) ||
        p.district.includes(keyword)
      );
      setSearchedProjects(filtered);
      message.success(`查询到 ${filtered.length} 个项目`);
    } else {
      setSearchedProjects(mockProjects);
      message.success(`查询到 ${mockProjects.length} 个项目`);
    }
  };
  */

  // 绑定项目
  const handleBindProject = async (project: any) => {
    if (!currentRecord?.id) {
      message.warning('请先选择出访记录');
      return;
    }
    
    try {
      await request('/zsxt-api/tProjBusinessTripProject/create', {
        method: 'POST',
        data: {
          tripId: currentRecord.id,
          projSignedId: project.id,
        },
      });
      
      message.success('绑定成功');
      
      // 关闭关联项目弹窗
      setRelateProjectModalVisible(false);
      
      // 刷新已关联项目列表
      await fetchRelatedProjects(currentRecord.id);
      
      // 刷新未绑定项目列表（重新查询第一页）
      await handleSearchProject(1, projectSearchPagination.pageSize);
    } catch (error) {
      console.error('绑定项目失败:', error);
      message.error('绑定项目失败');
    }
  };

  // 解绑项目
  const handleUnbindProject = async (projSignedId: string) => {
    if (!currentRecord?.id) {
      message.warning('请先选择出访记录');
      return;
    }
    
    try {
      await request(`/zsxt-api/tProjBusinessTripProject/delete/${currentRecord.id}/${projSignedId}`, {
        method: 'DELETE',
      });
      
      message.success('解绑成功');
      
      // 刷新已关联项目列表
      await fetchRelatedProjects(currentRecord.id, relatedProjectsPagination.current, relatedProjectsPagination.pageSize);
    } catch (error) {
      console.error('解绑项目失败:', error);
      message.error('解绑项目失败');
    }
  };

  // 保存
  const handleSave = async () => {
    try {
      const values = await editForm.validateFields();
      
      // 构建请求数据（对应后端实体字段）
      const requestData = {
        code: values.code || '',
        name: values.code ? districtOptions.find(d => d.value === values.code)?.label || '' : '',
        zoneCode: values.zone_code || '',
        zoneName: values.zone_code ? zoneOptions.find(z => z.value === values.zone_code)?.label || '' : '',
        townCode: values.town_code || '',
        townName: values.town_code ? townOptions.find(t => t.value === values.town_code)?.label || '' : '',
        year: values.year ? dayjs(values.year).format('YYYY') : '',
        groupName: values.groupName || '',
        mainMembers: values.mainMembers || '',
        visitDestination: values.visitDestination || '',
        activitiesAndVisits: values.activitiesAndVisits || '',
        achievements: values.achievements || '',
        nextPlan: values.nextPlan || '',
      };

      // 区分新增和编辑
      if (editingRecord?.id) {
        // 编辑：需要带上 id
        await request('/zsxt-api/tProjBusinessTrip/update', {
          method: 'POST',
          data: {
            id: editingRecord.id,
            ...requestData,
          },
        });
        message.success('编辑成功');
      } else {
        // 新增
        await request('/zsxt-api/tProjBusinessTrip/create', {
          method: 'POST',
          data: requestData,
        });
        message.success('新增成功');
      }
      
      setIsModalOpen(false);
      editForm.resetFields();
      fetchData();
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  // 导出Excel
  const handleExport = async () => {
    try {
      const values = searchForm.getFieldsValue();
      
      const response = await request('/zsxt-api/tProjBusinessTrip/export', {
        method: 'POST',
        data: {
          code: values.code,
          groupName: values.groupName,
          year: values.year ? dayjs(values.year).format('YYYY') : undefined,
        },
      });
      
      if (response && response.path) {
        // 从 path 中提取文件路径（去掉 # 后面的部分）
        const hashIndex = response.path.indexOf('#');
        const filePath = hashIndex > -1 ? response.path.substring(0, hashIndex) : response.path;
        
        console.log('文件路径:', filePath);
        console.log('文件名:', response.name);
        
        // 使用 request 通过代理下载文件
        request(filePath, {
          method: 'GET',
          responseType: 'blob',
        }).then((blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = response.name || `出访情况登记表_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          message.success('导出成功');
        }).catch((error: any) => {
          console.error('下载失败:', error);
          message.error('下载失败');
        });
      } else {
        message.error('导出失败：未返回文件路径');
      }
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
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
      title: '序号',
      key: 'index',
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: '市区',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '园区',
      dataIndex: 'zoneName',
      key: 'zoneName',
      width: 150,
    },
    {
      title: '镇街',
      dataIndex: 'townName',
      key: 'townName',
      width: 120,
    },
    {
      title: '团组名称',
      dataIndex: 'groupName',
      key: 'groupName',
      width: 200,
    },
    {
      title: '主要成员',
      dataIndex: 'mainMembers',
      key: 'mainMembers',
      width: 150,
    },
    {
      title: '出访地(国家、地区)',
      dataIndex: 'visitDestination',
      key: 'visitDestination',
      width: 180,
    },
    {
      title: '主要开展活动和拜访企业',
      dataIndex: 'activitiesAndVisits',
      key: 'activitiesAndVisits',
      ellipsis: true,
    },
    {
      title: '取得成果',
      dataIndex: 'achievements',
      key: 'achievements',
      ellipsis: true,
    },
    {
      title: '下一步打算',
      dataIndex: 'nextPlan',
      key: 'nextPlan',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      fixed: 'right',
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
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '90px',
              height: '28px',
              background: '#52c41a',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#fff',
            }}
            onClick={() => handleOpenUpdateDynamic(record)}
          >
            <div>更新动态</div>
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
              <Form.Item<SearchFieldType> label="年份" name="year">
                <DatePicker picker="year" placeholder="请选择年份" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<SearchFieldType> label="市(区)" name="code">
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
                <Select placeholder="请先选择市(区)" allowClear onChange={handleSearchZoneChange} disabled={level4User?.isLevel4 || searchZoneOptions.length === 0}>
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
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item<SearchFieldType> label="团组名称" name="groupName">
                <Input placeholder="请输入团组名称" />
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
                  <Button onClick={handleExport}>
                    导出
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
          scroll={{ x: 1500 }}
        />
      </div>

      {/* 编辑弹窗 */}
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        width={700}
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
            name="year"
            rules={[{ required: true, message: '请选择年份' }]}
          >
            <DatePicker picker="year" placeholder="请选择年份" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="市(区)"
            name="code"
            rules={[{ required: true, message: '请选择市(区)' }]}
          >
            <Select placeholder="请选择" onChange={handleDistrictChange} disabled={level4User?.isLevel4}>
              {districtOptions.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<FormFieldType>
            label="园区"
            name="zone_code"
          >
            <Select placeholder="请先选择市(区)" allowClear onChange={handleZoneChange} disabled={level4User?.isLevel4 || zoneOptions.length === 0}>
              {zoneOptions.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<FormFieldType>
            label="镇街"
            name="town_code"
          >
            <Select placeholder="请先选择园区" allowClear disabled={level4User?.isTownLevel || townOptions.length === 0}>
              {townOptions.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<FormFieldType>
            label="团组名称"
            name="groupName"
            rules={[{ required: true, message: '请输入团组名称' }]}
          >
            <Input placeholder="请输入团组名称" maxLength={100} showCount />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="主要成员"
            name="mainMembers"
            rules={[{ required: true, message: '请输入主要成员' }]}
          >
            <Input placeholder="请输入主要成员" maxLength={200} showCount />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="出访地(国家、地区)"
            name="visitDestination"
            rules={[{ required: true, message: '请输入出访地' }]}
          >
            <Input placeholder="请输入出访地(国家、地区)" maxLength={100} showCount />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="主要开展活动和拜访企业"
            name="activitiesAndVisits"
            rules={[{ required: true, message: '请输入主要开展活动和拜访企业' }]}
          >
            <TextArea rows={3} placeholder="请输入主要开展活动和拜访企业" maxLength={500} showCount />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="取得成果"
            name="achievements"
            rules={[{ required: true, message: '请输入取得成果' }]}
          >
            <TextArea rows={3} placeholder="请输入取得成果" maxLength={500} showCount />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="下一步打算"
            name="nextPlan"
            rules={[{ required: true, message: '请输入下一步打算' }]}
          >
            <TextArea rows={3} placeholder="请输入下一步打算" maxLength={500} showCount />
          </Form.Item>
        </Form>
      </Modal>

      {/* 更新动态弹窗 */}
      <Modal
        title="更新动态"
        open={updateDynamicModalVisible}
        onCancel={() => setUpdateDynamicModalVisible(false)}
        footer={null}
        width={900}
        bodyStyle={{
          maxHeight: 'calc(90vh - 200px)',
          overflow: 'auto',
        }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 进展动态 Tab */}
          <Tabs.TabPane tab="进展动态" key="progress">
            <div style={{ padding: '20px 0' }}>
              {/* 进展动态列表 */}
              {progressList.map((item) => (
                <div
                  key={item.id}
                  style={{
                    marginBottom: '16px',
                    padding: '16px',
                    background: '#fafafa',
                    border: '1px solid #e8e8e8',
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '8px', color: '#666' }}>
                        <span style={{ fontWeight: 500 }}>填写时间：</span>
                        <span>{item.fillTime}</span>
                      </div>
                      <div style={{ color: '#333' }}>
                        <span style={{ fontWeight: 500 }}>进展动态：</span>
                        <span>{item.content}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => handleEditProgress(item)}
                      >
                        编辑
                      </Button>
                      <Button
                        type="link"
                        danger
                        size="small"
                        onClick={() => handleDeleteProgress(item.id)}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* 分页组件 */}
              {progressList.length > 0 && (
                <div style={{ marginTop: '16px', marginBottom: '16px', textAlign: 'center' }}>
                  <Pagination
                    current={progressPagination.current}
                    pageSize={progressPagination.pageSize}
                    total={progressPagination.total}
                    onChange={handleProgressPageChange}
                    onShowSizeChange={handleProgressPageChange}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `共 ${total} 条`}
                    pageSizeOptions={['5', '10', '20', '50']}
                  />
                </div>
              )}

              {/* 添加动态按钮 */}
              {!showProgressForm && (
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  style={{
                    marginBottom: '20px',
                    width: '100%',
                  }}
                  onClick={() => {
                    progressForm.resetFields();
                    setEditingProgressId(null);
                    setShowProgressForm(true);
                  }}
                >
                  添加动态
                </Button>
              )}

              {/* 添加/编辑动态表单 */}
              {showProgressForm && (
                <Form form={progressForm} layout="vertical" className="progress-form">
                  <Form.Item
                    label="进展动态"
                    name="content"
                    rules={[{ required: true, message: '请输入进展动态' }]}
                  >
                    <TextArea
                      rows={6}
                      placeholder="请输入进展动态"
                      maxLength={500}
                      showCount
                    />
                  </Form.Item>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="primary" onClick={handleAddProgress}>
                      {editingProgressId ? '保存' : '添加'}
                    </Button>
                    <Button
                      onClick={() => {
                        progressForm.resetFields();
                        setEditingProgressId(null);
                        setShowProgressForm(false);
                      }}
                    >
                      取消
                    </Button>
                  </div>
                </Form>
              )}
            </div>
          </Tabs.TabPane>

          {/* 关联项目 Tab */}
          <Tabs.TabPane tab="关联项目" key="related">
            <div style={{ padding: '20px 0' }}>
              {/* 关联新项目按钮 */}
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                style={{
                  marginBottom: '20px',
                  width: '100%',
                }}
                onClick={handleOpenRelateProject}
              >
                关联新项目
              </Button>

              {/* 关联项目列表 */}
              <div style={{ marginBottom: '20px' }}>
                {relatedProjects.length > 0 && (
                  <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
                    关联项目列表
                  </div>
                )}
                {relatedProjectsLoading ? (
                  <div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                    加载中...
                  </div>
                ) : (
                  <>
                    {relatedProjects.map((project, index) => (
                      <div
                        key={project.id}
                        style={{
                          marginBottom: '16px',
                          padding: '16px',
                          background: '#fafafa',
                          border: '1px solid #e8e8e8',
                          borderRadius: '4px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px',
                          }}
                        >
                          <span style={{ fontWeight: 500, fontSize: '14px' }}>
                            项目 {(relatedProjectsPagination.current - 1) * relatedProjectsPagination.pageSize + index + 1}
                          </span>
                          <Button
                            danger
                            size="small"
                            onClick={() => handleUnbindProject(project.id)}
                          >
                            解绑
                          </Button>
                        </div>
                        <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#666' }}>
                          <div><span style={{ fontWeight: 500 }}>市区：</span>{project.district}</div>
                          <div><span style={{ fontWeight: 500 }}>园区：</span>{project.zoneName}</div>
                          <div><span style={{ fontWeight: 500 }}>镇街：</span>{project.townName}</div>
                          <div><span style={{ fontWeight: 500 }}>项目编码：</span>{project.code}</div>
                          <div><span style={{ fontWeight: 500 }}>项目名称：</span>{project.name}</div>
                          <div><span style={{ fontWeight: 500 }}>投资额：</span>{project.investMoney} {project.ptype === 1 ? '亿元' : '亿美元'}</div>
                        </div>
                      </div>
                    ))}
                    {relatedProjects.length === 0 && (
                      <div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                        暂无关联项目
                      </div>
                    )}
                    
                    {/* 分页组件 */}
                    {relatedProjects.length > 0 && (
                      <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <Pagination
                          current={relatedProjectsPagination.current}
                          pageSize={relatedProjectsPagination.pageSize}
                          total={relatedProjectsPagination.total}
                          onChange={handleRelatedProjectsPageChange}
                          onShowSizeChange={handleRelatedProjectsPageChange}
                          showSizeChanger
                          showQuickJumper
                          showTotal={(total) => `共 ${total} 条`}
                          pageSizeOptions={['5', '10', '20', '50']}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Modal>

      {/* 关联项目弹窗 */}
      <Modal
        title="关联新项目"
        open={relateProjectModalVisible}
        onCancel={() => setRelateProjectModalVisible(false)}
        footer={null}
        width={900}
      >
        <div style={{ padding: '20px 0' }}>
          <Form form={relateProjectForm} layout="inline" style={{ marginBottom: '20px' }}>
            <Form.Item label="项目名称" name="projectName" style={{ width: '300px' }}>
              <Input placeholder="请输入项目名称" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => handleSearchProject()}>
                查询
              </Button>
              <Button onClick={handleResetProjectSearch} style={{ marginLeft: '8px' }}>
                重置
              </Button>
            </Form.Item>
          </Form>

          {/* 项目列表 */}
          <div>
            <Table
              columns={[
                { title: '市区', dataIndex: 'district', width: 120, align: 'center' },
                { title: '园区', dataIndex: 'zoneName', width: 150, align: 'center' },
                { title: '镇街', dataIndex: 'townName', width: 100, align: 'center' },
                { title: '项目编码', dataIndex: 'code', width: 130, align: 'center' },
                { title: '项目名称', dataIndex: 'name', width: 250, ellipsis: true },
                { 
                  title: '投资额', 
                  dataIndex: 'investMoney', 
                  width: 130, 
                  align: 'center',
                  render: (value: number, record: any) => `${value} ${record.ptype === 1 ? '亿元' : '亿美元'}`
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 80,
                  fixed: 'right',
                  align: 'center',
                  render: (_, record) => (
                    <Button
                      type="link"
                      size="small"
                      onClick={() => handleBindProject(record)}
                    >
                      绑定
                    </Button>
                  ),
                },
              ]}
              dataSource={searchedProjects}
              pagination={{
                current: projectSearchPagination.current,
                pageSize: projectSearchPagination.pageSize,
                total: projectSearchPagination.total,
                onChange: handleProjectSearchPageChange,
                onShowSizeChange: handleProjectSearchPageChange,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
                pageSizeOptions: ['5', '10', '20', '50'],
              }}
              loading={projectSearchLoading}
              locale={{
                emptyText: '暂无数据',
              }}
              size="small"
              rowKey="id"
              scroll={{ x: 1000 }}
              bordered
            />
          </div>
        </div>
      </Modal>
    </div>
  </PageContainer>
  );
};

export default OfficialVisitRegister;
