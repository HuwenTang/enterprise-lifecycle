import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, DatePicker, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Table, TreeSelect, Upload, UploadFile, UploadProps, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import dayjs from 'dayjs';
import { UploadOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import fileConfig from '../../../config/fileConfig';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

type SearchFieldType = {
  code?: string;
  zone_code?: string;
  town_code?: string;
  activity_address?: string;
  start_time?: string;
  end_time?: string;
};

type FormFieldType = {
  id?: string;
  code?: string;
  name?: string;
  zone_code?: string;
  zone_name?: string;
  town_code?: string;
  town_name?: string;
  start_time?: string;
  end_time?: string;
  activity_address?: string;
  activity_content?: string;
  lxrxm?: string;
  zw?: string;
  lxdh?: string;
  leaders?: string;
  industryCode?: string;
  industry_name?: string;
  files?: UploadFile[];
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
  activityAddress: string;
  activityContent: string;
  lxrxm?: string;
  zw?: string;
  lxdh?: string;
  leaders: string;
  industryCode: string;
  industryName: string;
  images: string;
  auditStatus: number; // 0 待审核 1 审核通过 2 审核不通过
  auditRemark?: string; // 审核意见
  auditId?: number;
  auditTime?: string;
  townCode?: string;
  townName?: string;
  zjbAddress?: string;
  zjbCode?: string;
  createTime?: string;
  updateTime?: string;
}

// 市区选项（将改为动态获取）
// const districtOptions = [
//   { label: '靖江市', value: '001001' },
//   { label: '泰兴市', value: '001002' },
//   { label: '兴化市', value: '001003' },
//   { label: '海陵区', value: '001004' },
//   { label: '姜堰区', value: '001006' },
//   { label: '医药高新区(高港区)', value: '001007' },
// ];

// 园区选项（已改为动态获取）
// const zoneOptionsMap: Record<string, { label: string; value: string }[]> = {
//   '001001': [
//     { label: '靖江经济开发区', value: '001001001' },
//     { label: '靖江高新技术产业开发区', value: '001001002' },
//   ],
//   '001002': [
//     { label: '泰兴经济开发区', value: '001002001' },
//     { label: '泰兴高新技术产业开发区', value: '001002002' },
//   ],
//   '001003': [
//     { label: '兴化经济开发区', value: '001003001' },
//   ],
//   '001004': [
//     { label: '海陵工业园区', value: '001004001' },
//   ],
//   '001006': [
//     { label: '姜堰经济开发区', value: '001006001' },
//   ],
//   '001007': [
//     { label: '医药高新区', value: '001007001' },
//     { label: '高港区永安洲镇', value: '001007002' },
//   ],
// };

// 活动地址选项（已改为动态获取）
// const activityAddressOptions = [
//   { label: '北京（京津冀区域）', value: '北京（京津冀区域）' },
//   { label: '上海（长三角区域）', value: '上海（长三角区域）' },
//   { label: '深圳（珠三角地区）', value: '深圳（珠三角地区）' },
//   { label: '南京（南京、合肥区域）', value: '南京（南京、合肥区域）' },
//   { label: '其他地区', value: '其他地区' },
// ];

const InvestmentActivityRegister = () => {
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

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('添加活动');
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);

  // 产业链树形数据
  const [industryTreeData, setIndustryTreeData] = useState<any[]>([]);
  
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
  
  // 活动地址选项（动态获取）
  const [activityAddressOptions, setActivityAddressOptions] = useState<{ label: string; value: string }[]>([]);
  
  // 文件上传
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<UploadFile[]>([]); // 待回显的文件列表
  
  // 审核不通过原因弹窗
  const [rejectReasonVisible, setRejectReasonVisible] = useState(false);
  const [currentRejectReason, setCurrentRejectReason] = useState('');
  
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
  
  // 文件上传处理函数
  const handleUploadChange = ({ file, fileList: newFileList }: any) => {
    setIsUploading(true);
    setFileList(newFileList);
    if (file.status !== 'uploading') {
      setIsUploading(false);
    }
    if (file.status === 'done') {
      message.success(`${file.name} 上传成功`);
      setIsUploading(false);
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`);
      setIsUploading(false);
    }
  };

  const handleRemove = (file: UploadFile) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

  const handlePreview = async (file: UploadFile) => {
    // 预览文件
    let filePath = '';
    
    if (file.url) {
      // 已有文件（编辑时回显），使用 url 字段
      filePath = file.url;
    } else if (file.response && Array.isArray(file.response) && file.response.length > 0) {
      // 新上传的文件，使用 response 中的 path
      filePath = file.response[0].path;
    }
    
    if (filePath) {
      // 直接使用返回的路径（同域，不需要拼接）
      window.open(filePath, '_blank');
    }
  };
  
  // 处理文件上传表单值
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // 处理产业链数据：添加 title 属性，父节点禁用
  const addAttr = (data: any[]): any[] => {
    return data.map(item => {
      const newItem = {
        ...item,
        title: item.name,
        value: item.id,
      };
      
      // 处理 children：null 或空数组都表示叶子节点
      if (item.children && item.children.length > 0) {
        newItem.disabled = true; // 父节点禁用，只能选择叶子节点
        newItem.children = addAttr(item.children);
      } else {
        // 叶子节点，删除 children 属性
        delete newItem.children;
      }
      
      return newItem;
    });
  };

  // 获取所有叶子节点
  const getAllChildren = (data: any[]): any[] => {
    const result: any[] = [];
    const fn = (items: any[]) => {
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          fn(item.children);
        } else {
          result.push(item);
        }
      });
    };
    fn(data);
    return result;
  };

  // 获取产业链数据
  const fetchIndustryTree = async () => {
    try {
      const response = await request('/zsxt-api/tProjType/getProjType', {
        method: 'POST',
        data: {},
      });
      
      if (response && Array.isArray(response)) {
        const processedData = addAttr(response);
        setIndustryTreeData(processedData);
      }
    } catch (error) {
      console.error('获取产业链数据失败:', error);
      message.error('获取产业链数据失败');
    }
  };

  // 获取数据
  const fetchData = async (page: number = pagination.current, pageSize: number = pagination.pageSize) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const response = await request(`/zsxt-api/tProjInvestActivities/list?page=${page}&size=${pageSize}`, {
        method: 'POST',
        data: {
          code: values.code,
          zoneCode: values.zone_code,
          townCode: values.town_code,
          zjbCode: values.activity_address, // 活动地址字段改为 zjbCode
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
      
      // 加载其他数据
      fetchData();
      fetchIndustryTree();
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
    setSearchZoneOptions([]); // 清空搜索表单的园区选项
    setSearchTownOptions([]);
    setSearchZoneSelected(false);
    fetchData(1, 10);
  };

  // 新增
  const handleAdd = () => {
    setModalTitle('添加活动');
    setEditingRecord(null);
    editForm.resetFields();
    setFileList([]);
    setPendingFiles([]);
    
    // 如果是 level=4 用户，设置默认值和园区/镇街选项
    if (level4User) {
      console.log('handleAdd - level4User:', level4User);
      
      setZoneOptions([{
        label: level4User.zoneName,
        value: level4User.zoneCode,
      }]);
      
      // 如果是镇街级别，设置镇街选项
      if (level4User.isTownLevel && level4User.townCode && level4User.townName) {
        console.log('设置镇街选项:', { townCode: level4User.townCode, townName: level4User.townName });
        setTownOptions([{
          label: level4User.townName,
          value: level4User.townCode,
        }]);
      } else {
        console.log('不设置镇街选项 - isTownLevel:', level4User.isTownLevel, 'townCode:', level4User.townCode, 'townName:', level4User.townName);
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
    setModalTitle('编辑活动');
    setEditingRecord(record);
    
    try {
      // 调用详情接口获取完整数据
      const response = await request(`/zsxt-api/tProjInvestActivities/getById/${record.id}`, {
        method: 'GET',
      });
      
      const info = response || record;
      
      // 处理产业链：treeCheckStrictly 模式下需要转换为 { value, label } 格式
      let industryCode = undefined;
      if (info.industryCode) {
        // 查找节点信息（返回完整的节点对象）
        const findNode = (treeData: any[], targetValue: string): any => {
          for (const node of treeData) {
            // 尝试匹配 value 或 id（都去除空格后比较）
            const nodeValue = (node.value || '').toString().trim();
            const nodeId = (node.id || '').toString().trim();
            const target = targetValue.trim();
            
            if (nodeValue === target || nodeId === target) {
              return node;
            }
            if (node.children && node.children.length > 0) {
              const found = findNode(node.children, target);
              if (found) return found;
            }
          }
          return null;
        };
        
        // 支持多个产业链，用逗号分隔
        const codes = info.industryCode.split(',').filter((c: string) => c.trim());
        const names = info.industryName ? info.industryName.split(',') : [];
        
        industryCode = codes.map((code: string, index: number) => {
          const trimmedCode = code.trim();
          
          // 从树中查找节点，获取实际的 value
          const node = findNode(industryTreeData, trimmedCode);
          
          let actualValue = trimmedCode;
          let label = '';
          
          if (node) {
            // 使用树节点中的实际 value（这样才能正确勾选）
            actualValue = node.value;
            label = node.title || node.name;
          } else if (names[index]) {
            // 如果树中找不到，使用后端返回的名称
            label = names[index].trim();
          }
          
          console.log('产业链回显:', trimmedCode, '->', actualValue, label); // 调试日志
          return {
            value: actualValue,
            label: label || actualValue
          };
        }).filter(item => item.value); // 过滤掉空值
      }
      
      // 设置园区选项
      if (info.code) {
        await fetchZoneList(info.code);
      }
      
      // 处理文件列表：images 字段存储的是 path，用逗号分隔
      const files: UploadFile[] = info.images ? info.images.split(',').map((path: string, index: number) => {
        // 从 path 中提取文件名（# 后面的部分是原始文件名）
        const trimmedPath = path.trim();
        const hashIndex = trimmedPath.indexOf('#');
        const fileName = hashIndex > -1 ? decodeURIComponent(trimmedPath.substring(hashIndex + 1)) : trimmedPath.split('/').pop() || `文件${index + 1}`;
        let actualPath = hashIndex > -1 ? trimmedPath.substring(0, hashIndex) : trimmedPath;
        
        // 判断创建时间是否在2026年4月13日之前
        const createTime = info.createTime || info.create_time || info.createdAt || info.created_at;
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
        
        // 模拟上传成功后的文件结构
        return {
          uid: `-${index}`,
          name: fileName,
          status: 'done' as const,
          url: actualPath,
          thumbUrl: actualPath, // 添加缩略图 URL
          response: [{ // 模拟 response 结构，用于保存时提取 path
            name: fileName,
            path: actualPath,
            url: actualPath
          }]
        };
      }) : [];
      
      console.log('回显文件列表:', files);
      
      // 设置表单值
      editForm.setFieldsValue({
        code: info.code,
        zone_code: info.zoneCode,
        start_time: info.startTime ? dayjs(info.startTime) : undefined,
        end_time: info.endTime ? dayjs(info.endTime) : undefined,
        activity_address: info.zjbCode || info.zjbAddress, // 使用 zjbCode（value），如果没有则用 zjbAddress
        activity_content: info.activityContent,
        leaders: info.leaders,
        industryCode: industryCode,
      });
      
      // 存储待回显的文件列表
      setPendingFiles(files);
      
      // 打开弹窗
      setIsModalOpen(true);
    } catch (error) {
      console.error('获取详情失败:', error);
      message.error('获取详情失败');
    }
  };

  // 删除
  const handleDelete = async (record: DataType) => {
    try {
      await request(`/zsxt-api/tProjInvestActivities/delete/${record.id}`, {
        method: 'DELETE',
      });
      
      message.success('删除成功');
      fetchData();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
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
  
  // 保存
  const handleSave = async () => {
    try {
      if (isUploading) {
        message.info('文件正在上传中，请稍候');
        return;
      }
      
      const values = await editForm.validateFields();
      
      // 处理产业链：treeCheckStrictly 模式下返回的是 [{ value, label }] 数组
      let industryCode = '';
      let industryName = '';
      
      if (values.industryCode && Array.isArray(values.industryCode) && values.industryCode.length > 0) {
        // 取所有选中的值，用逗号分隔
        const codes = values.industryCode.map((item: any) => item.value);
        const names = values.industryCode.map((item: any) => item.label);
        industryCode = codes.join(',');
        industryName = names.join(',');
      }
      
      // 处理文件列表：从 response 中取 path 字段
      const uploadedFiles = fileList
        .filter(file => file.status === 'done')
        .map(file => {
          // 如果是新上传的文件，从 response 中取 path
          if (file.response && Array.isArray(file.response) && file.response.length > 0) {
            return file.response[0].path;
          }
          // 如果是已有的文件（编辑时回显），直接使用 url
          return file.url;
        })
        .filter(Boolean)
        .join(',');
      
      // 构建请求数据（对应后端实体字段）
      // zjbAddress 对应 label，zjbCode 对应 value
      const activityAddressItem = activityAddressOptions.find(item => item.value === values.activity_address);
      
      const requestData = {
        code: values.code || '',
        name: values.code ? districtOptions.find(d => d.value === values.code)?.label || '' : '',
        zoneCode: values.zone_code || '',
        zoneName: values.zone_code ? zoneOptions.find(z => z.value === values.zone_code)?.label || '' : '',
        townCode: values.town_code || '', // 街镇编码
        townName: values.town_code ? townOptions.find(t => t.value === values.town_code)?.label || '' : '', // 街镇名称
        zjbAddress: activityAddressItem?.label || '', // 驻京办地址（活动地址的 label）
        zjbCode: activityAddressItem?.value || '', // 驻京办编码（活动地址的 value）
        images: uploadedFiles, // 附件信息
        startTime: values.start_time ? dayjs(values.start_time).format('YYYY-MM-DD') : '', // 开始时间
        endTime: values.end_time ? dayjs(values.end_time).format('YYYY-MM-DD') : '', // 结束时间
        activityContent: values.activity_content || '', // 活动内容
        leaders: values.leaders || '', // 主要领导
        industryCode: industryCode, // 产业链代码
        industryName: industryName, // 产业链名称
      };

      // 区分新增和编辑
      if (editingRecord) {
        // 编辑：调用更新接口
        await request('/zsxt-api/tProjInvestActivities/update', {
          method: 'POST',
          data: {
            ...requestData,
            id: editingRecord.id, // 添加 id 字段
          },
        });
      } else {
        // 新增：调用新增接口
        await request('/zsxt-api/tProjInvestActivities', {
          method: 'POST',
          data: requestData,
        });
      }
      
      message.success(editingRecord ? '修改成功' : '新增成功');
      setIsModalOpen(false);
      setFileList([]);
      setPendingFiles([]);
      fetchData();
    } catch (error: any) {
      // 如果是表单校验错误，不显示提示（表单会自动显示错误信息）
      if (error?.errorFields) {
        console.log('表单校验失败:', error);
        return;
      }
      // 其他错误才显示提示
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  // 导出Excel
  const handleExport = async () => {
    try {
      const values = searchForm.getFieldsValue();
      
      const response = await request('/zsxt-api/tProjInvestActivities/export', {
        method: 'POST',
        data: {
          code: values.code,
          zoneCode: values.zone_code,
          zjbCode: values.activity_address, // 与查询接口保持一致，使用 zjbCode
          startTime: values.start_time ? dayjs(values.start_time).format('YYYY-MM-DD') : undefined,
          endTime: values.end_time ? dayjs(values.end_time).format('YYYY-MM-DD') : undefined,
        },
      });
      
      if (response && response.path) {
        // 直接使用返回的 path（同域，不需要额外处理）
        const link = document.createElement('a');
        link.href = response.path;
        link.download = response.name || `招商活动开展登记_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
        message.success('导出成功');
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
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 110,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 110,
    },
    {
      title: '活动内容',
      dataIndex: 'activityContent',
      key: 'activityContent',
      ellipsis: true,
      width: 200,
    },
    {
      title: '联络人姓名',
      dataIndex: 'lxrxm',
      key: 'lxrxm',
      width: 120,
    },
    {
      title: '职务',
      dataIndex: 'zw',
      key: 'zw',
      width: 120,
    },
    {
      title: '电话',
      dataIndex: 'lxdh',
      key: 'lxdh',
      width: 130,
    },
    {
      title: '活动地址',
      dataIndex: 'zjbAddress',
      key: 'zjbAddress',
      width: 180,
      render: (address: string) => {
        const option = activityAddressOptions.find(opt => opt.value === address);
        return option ? option.label : address;
      },
    },
    {
      title: '主要领导',
      dataIndex: 'leaders',
      key: 'leaders',
      width: 150,
    },
    {
      title: '所属产业链',
      dataIndex: 'industryName',
      key: 'industryName',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (industryName: string) => (
        <Tooltip placement="topLeft" title={industryName}>
          {industryName}
        </Tooltip>
      ),
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      width: 180,
      render: (status: number, record: DataType) => {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag icon={icon} color={color} style={{ margin: 0 }}>
              {statusText}
            </Tag>
            {status === 2 && (
              <Button 
                type="link" 
                size="small"
                style={{ padding: 0, height: 'auto' }}
                onClick={() => {
                  setCurrentRejectReason(record.auditRemark || '');
                  setRejectReasonVisible(true);
                }}
              >
                查看原因
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      align: 'center',
      render: (_, record) => {
        const isApproved = record.auditStatus === 1;
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                cursor: isApproved ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '70px',
                height: '28px',
                background: isApproved ? '#ccc' : '#1890FF',
                borderRadius: '14px',
                fontSize: '12px',
                color: '#fff',
                opacity: isApproved ? 0.6 : 1,
              }}
              onClick={() => {
                if (!isApproved) {
                  handleEdit(record);
                } else {
                  message.warning('审核通过的记录无法编辑');
                }
              }}
            >
              <div>编辑</div>
              <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
            </div>
            <div
              style={{
                marginLeft: '10px',
                cursor: isApproved ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '70px',
                height: '28px',
                background: isApproved ? '#ccc' : 'red',
                borderRadius: '14px',
                fontSize: '12px',
                color: '#fff',
                opacity: isApproved ? 0.6 : 1,
              }}
              onClick={() => {
                if (!isApproved) {
                  Modal.confirm({
                    title: '确定要删除吗？',
                    onOk: () => handleDelete(record),
                    okText: '确定',
                    cancelText: '取消',
                  });
                } else {
                  message.warning('审核通过的记录无法删除');
                }
              }}
            >
              <div>删除</div>
              <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/del.png" alt="" />
            </div>
          </div>
        );
      },
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
          scroll={{ x: 1600 }}
        />
      </div>

      {/* 编辑弹窗 */}
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          setFileList([]);
          setPendingFiles([]);
        }}
        afterOpenChange={(open) => {
          if (open) {
            // 弹窗完全打开后，设置文件列表
            if (pendingFiles.length > 0) {
              console.log('设置文件列表:', pendingFiles);
              setFileList(pendingFiles);
              setPendingFiles([]);
            }
          } else {
            // 弹窗关闭后，清空文件列表
            setFileList([]);
            setPendingFiles([]);
          }
        }}
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
            label="市(区)"
            name="code"
          >
            <Select placeholder="请选择" allowClear onChange={handleDistrictChange} disabled={level4User?.isLevel4}>
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
            label="开始日期"
            name="start_time"
            rules={[{ required: true, message: '请选择开始日期' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="请选择开始日期" 
              onChange={() => {
                // 开始日期变化时，清空结束日期的验证错误
                editForm.validateFields(['end_time']);
              }}
            />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="结束日期"
            name="end_time"
            rules={[
              { required: true, message: '请选择结束日期' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startTime = getFieldValue('start_time');
                  if (!value || !startTime) {
                    return Promise.resolve();
                  }
                  if (dayjs(value).isBefore(dayjs(startTime))) {
                    return Promise.reject(new Error('结束日期不能在开始日期之前'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="请选择结束日期"
              disabledDate={(current) => {
                const startTime = editForm.getFieldValue('start_time');
                if (!startTime) {
                  return false;
                }
                // 禁用开始日期之前的所有日期
                return current && current.isBefore(dayjs(startTime), 'day');
              }}
            />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="所属产业链"
            name="industryCode"
            rules={[{ required: true, message: '请选择所属产业链' }]}
          >
            <TreeSelect
              treeData={industryTreeData}
              placeholder="请选择所属产业链（可多选）"
              style={{ width: '100%' }}
              treeDefaultExpandAll={false}
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              treeCheckable
              treeCheckStrictly
              maxTagCount="responsive"
            />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="活动地址"
            name="activity_address"
            rules={[{ required: true, message: '请选择活动地址' }]}
          >
            <Select placeholder="请选择活动地址">
              {activityAddressOptions.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<FormFieldType>
            label="活动内容"
            name="activity_content"
            rules={[{ required: true, message: '请输入活动内容' }]}
          >
            <TextArea rows={3} placeholder="请输入活动内容" />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="联络人姓名"
            name="lxrxm"
            rules={[{ required: true, message: '请输入联络人姓名' }]}
          >
            <Input placeholder="请输入联络人姓名" />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="职务"
            name="zw"
            rules={[{ required: true, message: '请输入职务' }]}
          >
            <Input placeholder="请输入职务" />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="电话"
            name="lxdh"
            rules={[{ required: true, message: '请输入电话' }]}
          >
            <Input placeholder="请输入电话" />
          </Form.Item>

          <Form.Item<FormFieldType>
            label="市(区)主要参加领导"
            name="leaders"
          >
            <Input placeholder="请输入主要参加领导" />
          </Form.Item>

          <Form.Item
            label="佐证材料"
            name="support_files"
          >
            <Upload
              action="/system-api/file"
              name="file"
              multiple
              fileList={fileList}
              onChange={handleUploadChange}
              onRemove={handleRemove}
              onPreview={handlePreview}
            >
              <Button icon={<UploadOutlined />} disabled={isUploading}>
                {isUploading ? '上传中...' : '选择文件'}
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 审核不通过原因弹窗 */}
      <Modal
        title="审核不通过原因"
        open={rejectReasonVisible}
        onCancel={() => setRejectReasonVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setRejectReasonVisible(false)}>
            关闭
          </Button>
        ]}
      >
        <p style={{ padding: '20px 0', lineHeight: '1.8' }}>{currentRejectReason}</p>
      </Modal>
    </PageContainer>
  );
};

export default InvestmentActivityRegister;
