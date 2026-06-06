import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Radio, Space, Table, Tooltip, DatePicker, Select, InputNumber, Row, Col, Descriptions, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PageContainer, ModalForm, ProFormDatePicker, ProFormDigit, ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea, ProFormDependency, ProFormTreeSelect } from '@ant-design/pro-components';
import { useNavigate, useSearchParams, request } from '@umijs/max';
import dayjs from 'dayjs';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SettingOutlined, DownloadOutlined, PrinterOutlined, SwapOutlined, ShareAltOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';

type FieldType = {
  investor?: string;
  investmentFlag?: string;
  districtName?: string;
  parkName?: string;
  townName?: string;
  requestCityCoordination?: string;
};

const factoryTypeMap: Record<string, string> = {
  '1': '租赁',
  '2': '购买',
  '自建': '自建',
  '租赁': '租赁',
  '购买': '购买',
};

const investorTypeOptions = [
  { label: '央企', value: '10' },
  { label: '民营巨头', value: '20' },
  { label: '世界500强或跨国公司', value: '30' },
  { label: '其它', value: '40' },
];

const kcProjectTypeOptions = [
  '知识产权类',
  '高层次人才类',
  '科技计划或大赛类',
  '风险投资类',
  '省市产研院类',
  '重大创新平台类',
];

const defaultFzItems = [
  '本协议与国家法律、法规相悖的，按国家法律、法规执行。',
  '如因履行本协议发生纠纷而引起诉讼的，由甲方所在地人民法院管辖。',
  '本协议书一式四份，甲方执存两份，乙方执存两份，本协议自双方签字盖章之日起生效。',
];

const ProjectManage9 = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [toSignedForm] = Form.useForm();
  
  // 项目类别选项
  const [projectTypeOptions, setProjectTypeOptions] = useState<{ label: string; value: any }[]>([]);
  // 市区选项（动态获取）
  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>([]);
  // 搜索表单的园区选项
  const [searchZoneOptions, setSearchZoneOptions] = useState<{ label: string; value: string }[]>([]);
  // 搜索表单的镇街选项
  const [searchTownOptions, setSearchTownOptions] = useState<{ label: string; value: string }[]>([]);
  // 标记搜索表单的园区是否已选择
  const [searchZoneSelected, setSearchZoneSelected] = useState(false);
  // 编辑表单的园区选项
  const [editZoneOptions, setEditZoneOptions] = useState<{ label: string; value: string }[]>([]);
  // 编辑表单的镇街选项
  const [editTownOptions, setEditTownOptions] = useState<{ label: string; value: string }[]>([]);
  // 投资方注册地选项
  const [investorPlaceOptions, setInvestorPlaceOptions] = useState<{ label: string; value: string }[]>([]);
  const [foreignInvestorPlaceOptions, setForeignInvestorPlaceOptions] = useState<{ label: string; value: string }[]>([]);
  
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
  
  const [toShareForm] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCurrent = parseInt(searchParams.get('page') || '1', 10);
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const initialInvestor = searchParams.get('investor') || '';
  const initialInvestmentFlag = searchParams.get('investmentFlag') || '内资';
  const initialDistrictName = searchParams.get('districtName') || '';
  const initialParkName = searchParams.get('parkName') || '';
  const initialRequestCityCoordination = searchParams.get('requestCityCoordination') || '';

  const [pagination, setPagination] = useState({
    current: initialCurrent,
    pageSize: initialPageSize,
    total: 0,
  });

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // 弹窗状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [toSignedModalVisible, setToSignedModalVisible] = useState(false);
  const [toShareModalVisible, setToShareModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [isAdd, setIsAdd] = useState(false);

  // 转签约表单的园区和乡镇选项
  const [signedParkOptions, setSignedParkOptions] = useState<{label: string, value: string}[]>([]);
  const [signedTownOptions, setSignedTownOptions] = useState<{label: string, value: string}[]>([]);
  const [signedFieldDisabled, setSignedFieldDisabled] = useState({
    district: false,
    park: false,
    town: false,
  });
  const [supportUploadFileList, setSupportUploadFileList] = useState<UploadFile[]>([]);
  const [reviewUploadFileList, setReviewUploadFileList] = useState<UploadFile[]>([]);
  const [kcUploadFileList, setKcUploadFileList] = useState<UploadFile[]>([]);
  const [projTypeTreeData, setProjTypeTreeData] = useState<any[]>([]);
  const [industryFirstOptions, setIndustryFirstOptions] = useState<{ label: string; value: string }[]>([]);
  const [industryTreeData, setIndustryTreeData] = useState<any[]>([]);
  const [projSourceOptions, setProjSourceOptions] = useState<{ label: string; value: string }[]>([]);
  const [projSourceLoading, setProjSourceLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<FieldType>({
    investor: initialInvestor,
    investmentFlag: initialInvestmentFlag,
    districtName: initialDistrictName,
    parkName: initialParkName,
    requestCityCoordination: initialRequestCityCoordination,
  });
  
  // 驻外机构角色相关状态
  const [isExternalOffice, setIsExternalOffice] = useState(false); // 是否为驻外机构角色
  const [externalOfficeInvestorPlace, setExternalOfficeInvestorPlace] = useState<string | undefined>(undefined); // 驻外机构对应的投资方注册地code
  
  // 附则列表
  const [fzList, setFzList] = useState<string[]>([...defaultFzItems]);
  const [fzInput, setFzInput] = useState('');

  const gridStyles = {
    container: { border: '1px solid #f0f0f0', borderBottom: 'none', marginBottom: 24 },
    row: { borderBottom: '1px solid #f0f0f0', display: 'flex' as const },
    label: {
      width: '200px',
      minWidth: '200px',
      backgroundColor: '#fafafa',
      padding: '12px 16px',
      borderRight: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      textAlign: 'right' as const,
      fontWeight: 500,
    },
    content: { flex: 1, padding: '12px 16px', borderRight: '1px solid #f0f0f0' },
    contentLast: { flex: 1, padding: '12px 16px' },
  };

  const fullWidthFieldProps = { style: { width: '100%' } };

  // 驻外机构cobId映射表
  const externalOfficeCobIdMap: Record<string, string> = {
    'dyundHPrj88dFez3eFMMXpfwAlKP': '400', // 深圳（珠三角地区）
    'JWux2unB2nP3I5ab5IPb6qGjIL71': '200', // 上海（长三角区域）
    'pYulYfpgkRREtmkAmIaawVHKEMxg': '101', // 北京（京津冀区域）
    'rYuRCmwomzRFLxqLUDeDdEato3J': '300', // 南京（南京、合肥区域）
  };

  // 获取用户信息并判断是否为驻外机构
  const checkExternalOfficeRole = async () => {
    try {
      const response = await request('/system-api/sso/session', {
        method: 'GET',
      });
      
      if (response?.organizations && response.organizations.length > 0) {
        const cobId = response.organizations[0].cobId;
        const investorPlaceCode = externalOfficeCobIdMap[cobId];
        
        if (investorPlaceCode) {
          // 是驻外机构角色
          setIsExternalOffice(true);
          setExternalOfficeInvestorPlace(investorPlaceCode);
          return investorPlaceCode;
        }
      }
      
      setIsExternalOffice(false);
      setExternalOfficeInvestorPlace(undefined);
      return undefined;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return undefined;
    }
  };

  // 获取数据列表
  const fetchData = async (params: any) => {
    try {
      setLoading(true);
      
      const page = params.page || 1;
      const size = params.size || 10;
      
      const response = await request(`/zsxt-api/tProjProject/searchProjProject?page=${page}&size=${size}`, {
        method: 'POST',
        data: {
          investor: params.investor,
          ptype: params.ptype,
          districtCode: params.districtCode,
          zoneCode: params.zoneCode,
          townCode: params.townCode,
          requestCityCoordination: params.requestCityCoordination,
        },
      });
      
      setPagination({
        total: response.total || 0,
        current: params.page || 1,
        pageSize: params.size || 10,
      });

      const records = (response.records || []).map(record => 
        normalizeNegotiatingRecord(record, params._typeOptions)
      );
      setDataSource(records);
    } catch (e: unknown) {
      console.error('查询失败:', e);
      setDataSource([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
        current: params.page || prev.current,
        pageSize: params.size || prev.pageSize,
      }));
      message.error(e instanceof Error ? e.message : '查询失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      // 先获取用户权限区域
      const level4Info = await fetchAreaGrants();
      
      // 先获取字典数据并获取返回值
      const typeOptions = await fetchProjectTypes();
      
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
            districtName: level4Info.districtCode,
            parkName: level4Info.zoneCode,
          };
          
          // 如果是镇街级别，设置镇街默认值
          if (level4Info.isTownLevel && level4Info.townCode) {
            searchFormValues.townName = level4Info.townCode;
          }
          
          form.setFieldsValue(searchFormValues);
          
          // 标记园区已选择
          setSearchZoneSelected(true);
        } catch (error) {
          console.error('获取市区/园区名称失败:', error);
        }
      } else {
        // 非 level=4 用户，加载市区列表
        await fetchDistrictList();
      }
      
      fetchSignedProjTypeOptions();
      fetchIndustryFirstOptions();
      fetchIndustryTreeData();
      fetchProjSourceOptions();
      fetchInvestorPlaceOptions();
      fetchForeignInvestorPlaceOptions();
      
      // 检查是否为驻外机构角色
      const investorPlaceCode = await checkExternalOfficeRole();
      
      // 初始化查询，传入 typeOptions
      const params: any = {
        page: initialCurrent,
        size: initialPageSize,
        investor: initialInvestor || undefined,
        ptype: undefined, // 项目类别需要从字典中获取value
        districtCode: initialDistrictName || undefined,
        zoneCode: initialParkName || undefined,
        townCode: level4Info?.isTownLevel ? level4Info.townCode : undefined,
        requestCityCoordination: initialRequestCityCoordination ? (initialRequestCityCoordination === '是' ? 1 : 0) : undefined,
        _typeOptions: typeOptions, // 传递 typeOptions
      };
      
      // 如果是驻外机构，添加投资方注册地筛选条件
      if (investorPlaceCode) {
        params.investorPlace = investorPlaceCode;
      }
      
      fetchData(params);
    };
    
    initPage();
  }, []);


  const onSearch = (values: FieldType, page = 1, pageSize = pagination.pageSize) => {
    // 获取项目类别的value
    let ptype = undefined;
    if (values.investmentFlag) {
      const typeOption = projectTypeOptions.find(opt => opt.label === values.investmentFlag);
      ptype = typeOption ? typeOption.value : undefined;
    }
    
    // 处理是否提请市级协调："是" -> 1, "否" -> 0
    let requestCityCoordination = undefined;
    if (values.requestCityCoordination) {
      requestCityCoordination = values.requestCityCoordination === '是' ? 1 : 0;
    }
    
    // 构建查询参数
    const params: any = {
      page,
      size: pageSize,
      investor: values.investor,
      ptype,
      districtCode: values.districtName,
      zoneCode: values.parkName,
      townCode: values.townName,
      requestCityCoordination,
    };
    
    // 如果是驻外机构，强制添加投资方注册地筛选条件
    if (isExternalOffice && externalOfficeInvestorPlace) {
      params.investorPlace = externalOfficeInvestorPlace;
    }
    
    // 只调用一次接口
    fetchData(params);
  };

  // --- 业务操作 ---

  // 导出Excel
  const handleExport = async () => {
    try {
      const values = form.getFieldsValue();
      
      // 获取项目类别的value
      let ptype = undefined;
      if (values.investmentFlag) {
        const typeOption = projectTypeOptions.find(opt => opt.label === values.investmentFlag);
        ptype = typeOption ? typeOption.value : undefined;
      }
      
      // 处理是否提请市级协调："是" -> 1, "否" -> 0
      let requestCityCoordination = undefined;
      if (values.requestCityCoordination) {
        requestCityCoordination = values.requestCityCoordination === '是' ? 1 : 0;
      }
      
      const response = await request('/zsxt-api/tProjProject/export', {
        method: 'POST',
        data: {
          investor: values.investor,
          ptype,
          districtCode: values.districtName,
          zoneCode: values.parkName,
          townCode: values.townName,
          requestCityCoordination,
        },
      });
      
      if (response && response.path) {
        // 直接使用返回的 path（同域，不需要额外处理）
        const link = document.createElement('a');
        link.href = response.path;
        link.download = response.name || `在谈项目_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
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

  // 新增/编辑保存
  const handleSaveProject = async (values: any) => {
    try {
      const payload = buildNegotiatingProjectPayload(values);
      
      await request('/zsxt-api/tProjProject/updateOrSaveProjProj', {
        method: 'POST',
        data: payload,
      });
      
      message.success(isAdd ? '新增成功' : '保存成功');
      setEditModalVisible(false);
      editForm.resetFields();
      onSearch(form.getFieldsValue());
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  // 转签约保存
  const handleToSigned = async (values: any) => {
    try {
      // 校验文件上传
      if (reviewUploadFileList.length === 0) {
        message.error('请上传项目情况分析和评审结果');
        return;
      }
      if (supportUploadFileList.length === 0) {
        message.error('请上传佐证材料');
        return;
      }
      if (values.is_kc_proj === '是' && kcUploadFileList.length === 0) {
        message.error('请上传科创证明材料');
        return;
      }

      const payload = buildSignedProjectPayload(values);
      await request('/zsxt-api/tProjProjectSigned/toSigned', {
        method: 'POST',
        data: payload,
      });

      message.success('提交成功');
      setToSignedModalVisible(false);
      toSignedForm.resetFields();
      onSearch(form.getFieldsValue());
    } catch (error) {
      console.error('转签约提交失败:', error);
      message.error('提交失败');
    }
  };

  // 存入草稿箱
  const handleSaveDraft = async () => {
    try {
      const values = toSignedForm.getFieldsValue(true);
      const payload = buildSignedProjectPayload({
        ...values,
        _isDraft: true,
        fzList: fzList.map((item, index) => `${index + 1}、${item}`),
      });
      await request('/zsxt-api/tProjProjectSigned/saveTemp', {
        method: 'POST',
        data: payload,
      });
      message.success('已存入草稿箱');
      setToSignedModalVisible(false);
      toSignedForm.resetFields();
      onSearch(form.getFieldsValue());
    } catch (e: any) {
      message.error(e?.message || '存入草稿箱失败');
    }
  };

  // 转共享保存
  const handleToShare = async (values: any) => {
    try {
      await request('/zsxt-api/tProjProject/toShare', {
        method: 'POST',
        data: {
          id: currentRecord?.id,
          fqyy: values.giveUpReason, // 放弃原因
        },
      });
      
      message.success('转共享成功');
      setToShareModalVisible(false);
      toShareForm.resetFields();
      onSearch(form.getFieldsValue());
    } catch (error) {
      console.error('转共享失败:', error);
      message.error('转共享失败');
    }
  };

  // 删除
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该项目吗？',
      onOk: async () => {
        try {
          await request(`/zsxt-api/tProjProject/deleteTProjProject/${record.id}`, {
            method: 'DELETE',
          });
          message.success('删除成功');
          onSearch(form.getFieldsValue());
        } catch (error) {
          console.error('删除失败:', error);
          message.error('删除失败');
        }
      },
    });
  };

  const getKcProofMessage = (kcProjectType?: string) => {
    if (kcProjectType === '知识产权类') return '请上传投资企业专利证书或受理通知书等证明材料';
    if (kcProjectType === '高层次人才类') return '请上传人才学历、职称、获奖等证明材料';
    if (kcProjectType === '科技计划或大赛类') return '请上传计划项目立项或大赛获奖文件等证明材料';
    if (kcProjectType === '风险投资类') return '请上传投资协议等证明材料';
    if (kcProjectType === '省市产研院类') return '请上传签约协议';
    if (kcProjectType === '重大创新平台类') return '请上传合作共建协议等证明材料';
    return '';
  };

  // 附则操作
  const addFz = () => {
      if (fzInput.trim()) {
          if (fzList.length >= 10) {
              message.warning('最多添加10条附则');
              return;
          }
          const customItems = fzList.filter((item) => !defaultFzItems.includes(item));
          setFzList([...customItems, fzInput.trim(), ...defaultFzItems]);
          setFzInput('');
      } else {
          message.warning('请输入附则内容');
      }
  };
  const removeFz = (index: number) => {
      const newList = [...fzList];
      newList.splice(index, 1);
      setFzList(newList);
  };

  const buildFileDownloadUrl = (rawPath?: string) => {
    const path = String(rawPath || '').trim();
    if (!path) {
      return '';
    }
    // 直接返回路径（已经是完整URL或同域路径）
    return path;
  };

  const renderUploadLinks = (
    fileList: UploadFile[],
    onRemove?: (file: UploadFile) => void,
    removable = false,
  ) => {
    if (!fileList.length) {
      return '无';
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {fileList.map((file) => {
          const response = Array.isArray(file.response) ? file.response[0] : file.response;
          const rawUrl = response?.filePath || response?.url || response?.path || file.url || '';
          const url = buildFileDownloadUrl(rawUrl);
          return (
            <div key={file.uid} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <a
                href={url || undefined}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1677ff' }}
                onClick={(event) => {
                  if (!url) {
                    event.preventDefault();
                  }
                }}
              >
                {file.name}
              </a>
              {removable && onRemove && (
                <Button
                  type="link"
                  danger
                  size="small"
                  style={{ padding: 0, height: 'auto' }}
                  onClick={() => onRemove(file)}
                >
                  删除
                </Button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const buildFilesPayload = (fileList: UploadFile[], cateCode: string) =>
    fileList
      .filter((file) => file.status === 'done')
      .map((file) => {
        const response = Array.isArray(file.response) ? file.response[0] : file.response;
        return {
          name: response?.name || file.name,
          filePath: response?.filePath || response?.path || response?.url || file.url || '',
          cateCode,
          cate_code: cateCode,
        };
      })
      .filter((item) => item.filePath);

  const toSignedFieldName = (fieldName: string) => {
    if (fieldName === '_name') {
      return 'name';
    }
    if (fieldName === '_code') {
      return 'code';
    }
    if (fieldName === '_desc') {
      return 'desc';
    }
    if (fieldName === 'p_type') {
      return 'ptype';
    }
    if (fieldName === 'b_industry') {
      return 'bindustry';
    }
    if (fieldName === 'b_resource') {
      return 'bresource';
    }
    return fieldName.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
  };

  const getSignedUserInfo = () => {
    try {
      const raw = localStorage.getItem('USER_INFO');
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  };

  const normalizeNegotiatingRecord = (record: any, typeOptions?: { label: string; value: any }[]) => {
    if (!record) return {};

    // 从字典中根据 ptype 获取对应的 label（后端返回的是全小写 ptype）
    const options = typeOptions || projectTypeOptions;
    let projectCategory = record.projectCategory;
    if (!projectCategory && record.ptype) {
      const typeOption = options.find(opt => opt.value === String(record.ptype));
      projectCategory = typeOption ? typeOption.label : undefined;
    }

    return {
      ...record,
      id: record.id,
      investor: record.investor,
      projectName: record.name,
      investmentAmount: record.investMoney,
      projectCategory,
      negotiationProgress: record.progress,
      projectContent: record.desc, // 项目内容（在谈项目用）
      _desc: record.desc || record._desc, // 项目简介（转签约用）
      firstContactTime: record.firstTime ? dayjs(record.firstTime) : undefined, // 转换为 dayjs 对象
      districtName: record.district, // 显示市区名称
      districtCode: record.districtCode, // 保存市区编码（用于编辑）
      parkName: record.zoneName, // 显示园区名称
      parkCode: record.zoneCode, // 保存园区编码（用于编辑）
      factoryType: factoryTypeMap[String(record.buildingType ?? '')] || undefined,
      landArea: record.useArea,
      rentArea: record.rentArea,
      buyArea: record.buyArea,
      sales: record.yearXl,
      tax: record.yearSs,
      isCityKeyProject: record.cityProject === 1 ? '是' : record.cityProject === 0 ? '否' : undefined,
      isProvinceKeyProject: record.provincialProject === 1 ? '是' : record.provincialProject === 0 ? '否' : undefined,
      requestCityCoordination: record.requestCityCoordination === 1 ? '是' : record.requestCityCoordination === 0 ? '否' : undefined,
      cityCoordinationItems: record.cityDesc,
      sj_status: record.sjStatus,
      entryTime: record.createTime,
    };
  };

  const getSelectedDistrictLabel = (districtValue?: string) =>
    districtOptions.find((item) => item.value === districtValue)?.label || districtValue || '';

  const getSelectedParkLabel = (districtValue?: string, parkValue?: string) => {
    // 从编辑表单的园区选项中查找，如果没有则直接返回值
    return editZoneOptions.find((item) => item.value === parkValue)?.label || parkValue || '';
  };

  const buildNegotiatingProjectPayload = (values: any) => {
    const districtName = values.districtName || currentRecord?.districtCode || '';
    const parkName = values.parkName || currentRecord?.parkCode || '';

    return {
      id: currentRecord?.id || currentRecord?._id,
      name: values.name || values.projectName || values.investor, // 意向投资项目名称
      investor: values.investor, // 投资方名称
      ptype: isForeignProject(values.projectCategory) ? 2 : 1, // 项目类别 1-内资 2-外资
      investMoney: values.investmentAmount, // 投资金额
      district: getSelectedDistrictLabel(districtName), // 区县
      districtCode: districtName, // 市区编码
      zoneCode: parkName, // 园区code
      zoneName: getSelectedParkLabel(districtName, parkName), // 园区名称
      townCode: values.townName || currentRecord?.townCode || '', // 镇街code
      townName: currentRecord?.townName || editTownOptions.find(item => item.value === (values.townName || currentRecord?.townCode))?.label || '', // 镇街名称
      progress: values.negotiationProgress, // 洽谈进度
      desc: values.projectContent, // 项目内容
      firstTime: values.firstContactTime, // 初次对接时间
      buildingType: values.factoryType === '租赁' ? '1' : values.factoryType === '购买' ? '2' : values.factoryType, // 厂房类型
      useArea: values.landArea, // 拟用地面积（亩）
      rentArea: values.rentArea, // 拟租厂房面积（平方米）
      buyArea: values.buyArea, // 拟购厂房面积（平方米）
      yearXl: values.sales, // 预计年销量（万元）
      yearSs: values.tax, // 预计年税收（万元）
      cityProject: values.isCityKeyProject === '是' ? 1 : 0, // 是否市级重点项目
      provincialProject: values.isProvinceKeyProject === '是' ? 1 : 0, // 是否省级重点项目
      requestCityCoordination: values.requestCityCoordination === '是' ? 1 : 0, // 是否提请市级协调
      cityDesc: values.requestCityCoordination === '是' ? values.cityCoordinationItems : null, // 提请市级协调事项（选择"否"时传null）
      investorPlace: values.investorPlace, // 投资方注册地
      placeInfo: values.placeInfo, // 城市名称
      sjly: currentRecord?.sjly || 1, // 数据来源 1页面新增
    };
  };

  const buildSignedProjectPayload = (values: any) => {
    const payload = Object.entries(values).reduce<Record<string, any>>((acc, [key, value]) => {
      if (key === '_isDraft') {
        return acc;
      }
      acc[toSignedFieldName(key)] = dayjs.isDayjs(value) ? (value as any).format('YYYY-MM-DD') : value;
      return acc;
    }, {});

    payload.id = currentRecord?.id || currentRecord?._id || undefined;
    payload.progress = values.progress ?? 0;
    payload.checkStatus = values._isDraft ? 4 : 0;
    payload.pgStatus = values.pg_status ?? 1;
    payload.cateCode = '0';
    payload.cateCode1 = '99';
    payload.district = districtOptions.find((item) => item.value === values.district_code)?.label || currentRecord?.districtName || currentRecord?.district || '';
    payload.zoneName = signedParkOptions.find((item) => item.value === values.zone_code)?.label || currentRecord?.parkName || currentRecord?.zone_name || currentRecord?.zoneName || '';
    payload.townName = signedTownOptions.find((item) => item.value === values.town_code)?.label || currentRecord?.townName || currentRecord?.town_name || '';
    payload.signedStatDate = payload.signedStatDate || dayjs().format('YYYY-MM-DD');
    if (values.has_municipal_capital !== undefined) {
      payload.isSwzjtr = values.has_municipal_capital;
    }
    if (values.equity_ratio !== undefined && values.equity_ratio !== '') {
      payload.gqbl = values.equity_ratio;
    }
    if (values.zs_land_area !== undefined && values.zs_land_area !== '') {
      payload.zlLandAreaZs = values.zs_land_area;
    }
    if (values.plan_invest_strong !== undefined && values.plan_invest_strong !== '') {
      payload.investLevel = values.plan_invest_strong;
    }
    const reviewFiles = buildFilesPayload(reviewUploadFileList, '99');
    const supportFiles = buildFilesPayload(supportUploadFileList, '0');
    const kcFiles = buildFilesPayload(kcUploadFileList, '66');
    payload.files = [...reviewFiles, ...supportFiles, ...kcFiles];
    payload.kcFileArr = kcFiles;
    payload.fzList = fzList.map((item, index) => `${index + 1}、${item}`);
    return payload;
  };

  const handleGenerateAgreement = async () => {
    try {
      const values = toSignedForm.getFieldsValue(true);
      const payload = buildSignedProjectPayload(values);
      const nextQrKey = String(Date.now());
      payload.qrKey = nextQrKey;
      payload.qr_key = nextQrKey;

      const res = await request('/zsxt-api/tProjProjectSigned/exportWord', {
        method: 'POST',
        data: payload,
      });
      
      // 从返回数据的 files 数组第一项获取 filePath
      const filePath = res?.files?.[0]?.filePath || res?.filePath || res?.filepath || res?.path || res?.url;
      const fileName = res?.files?.[0]?.name || res?.name || '签约协议.docx';
      
      if (!filePath) {
        message.error('生成协议失败：未获取到文件地址');
        return;
      }
      
      const fileUrl = buildFileDownloadUrl(filePath);
      // 在新窗口打开预览，而不是下载
      window.open(fileUrl, '_blank');
      message.success('协议生成成功');
    } catch (error: any) {
      message.error(error?.message || '生成协议失败');
    }
  };

  const reviewUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    showUploadList: false,
    fileList: reviewUploadFileList,
    onChange({ file, fileList }) {
      if (file.status === 'done' && file.response) {
        const response = Array.isArray(file.response) ? file.response[0] : file.response;
        if (response) {
          const updatedFileList = fileList.map((item) =>
            item.uid === file.uid
              ? {
                  ...item,
                  response: [{ url: response.url || response.path, filePath: response.filePath || response.path || response.url, name: response.name || item.name }],
                }
              : item,
          );
          setReviewUploadFileList(updatedFileList);
          return;
        }
      }
      setReviewUploadFileList(fileList);
    },
  };

  const supportUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    showUploadList: false,
    fileList: supportUploadFileList,
    onChange({ file, fileList }) {
      if (file.status === 'done' && file.response) {
        const response = Array.isArray(file.response) ? file.response[0] : file.response;
        if (response) {
          const updatedFileList = fileList.map((item) =>
            item.uid === file.uid
              ? {
                  ...item,
                  response: [{ url: response.url || response.path, filePath: response.filePath || response.path || response.url, name: response.name || item.name }],
                }
              : item,
          );
          setSupportUploadFileList(updatedFileList);
          return;
        }
      }
      setSupportUploadFileList(fileList);
    },
  };

  const kcUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    showUploadList: false,
    fileList: kcUploadFileList,
    onChange({ file, fileList }) {
      if (file.status === 'done' && file.response) {
        const response = Array.isArray(file.response) ? file.response[0] : file.response;
        if (response) {
          const updatedFileList = fileList.map((item) =>
            item.uid === file.uid
              ? {
                  ...item,
                  response: [{ url: response.url || response.path, filePath: response.filePath || response.path || response.url, name: response.name || item.name }],
                }
              : item,
          );
          setKcUploadFileList(updatedFileList);
          return;
        }
      }
      setKcUploadFileList(fileList);
    },
  };

  const buildSharedProjectPayload = (values: any) => ({
    ...currentRecord,
    ...values,
    _id: currentRecord?.id || currentRecord?._id,
    fqyy: values.giveUpReason,
  });

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
          value: item.value || item.id,
        }));
        setProjectTypeOptions(options);
        return options; // 返回数据
      }
      return [];
    } catch (error) {
      console.error('获取项目类别失败:', error);
      return [];
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
    form.setFieldsValue({ parkName: undefined, townName: undefined });
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
    form.setFieldsValue({ townName: undefined });
  };

  // 获取园区列表（编辑表单）
  const fetchEditZoneList = async (pid: string) => {
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
        setEditZoneOptions(options);
      }
    } catch (error) {
      console.error('获取园区列表失败:', error);
      message.error('获取园区列表失败');
    }
  };

  // 获取镇街列表（编辑表单）
  const fetchEditTownList = async (pid: string) => {
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
        setEditTownOptions(options);
      }
    } catch (error) {
      console.error('获取镇街列表失败:', error);
      message.error('获取镇街列表失败');
    }
  };

  // 市区变化时，更新园区选项（编辑表单）
  const handleEditDistrictChange = (value: string) => {
    if (value) {
      fetchEditZoneList(value);
    } else {
      setEditZoneOptions([]);
    }
    // 清空园区和镇街选择
    setEditTownOptions([]);
    editForm.setFieldsValue({ parkName: undefined, townName: undefined });
  };
  
  // 园区变化时，更新镇街选项（编辑表单）
  const handleEditZoneChange = (value: string) => {
    if (value) {
      fetchEditTownList(value);
    } else {
      setEditTownOptions([]);
    }
    // 清空镇街选择
    editForm.setFieldsValue({ townName: undefined });
  };

  // 获取项目详情
  const fetchProjectDetail = async (id: string) => {
    try {
      const response = await request(`/zsxt-api/tProjProject/${id}`, {
        method: 'GET',
      });
      
      if (response) {
        const normalized = normalizeNegotiatingRecord(response);
        setCurrentRecord(normalized);
        
        // 如果有市区编码，加载对应的园区选项
        if (response.districtCode) {
          await fetchEditZoneList(response.districtCode);
          
          // 如果有园区编码，加载对应的镇街选项
          if (response.zoneCode || response.parkCode) {
            await fetchEditTownList(response.zoneCode || response.parkCode);
          } else {
            setEditTownOptions([]);
          }
        } else {
          setEditZoneOptions([]);
          setEditTownOptions([]);
        }
        
        // 设置表单初始值，用 code 覆盖市区、园区、镇街字段（避免传中文名）
        editForm.setFieldsValue({
          ...normalized,
          districtName: response.districtCode || undefined,
          parkName: response.zoneCode || undefined,
          townName: response.townCode || undefined,
        });
        setEditModalVisible(true);
      }
    } catch (error) {
      console.error('获取项目详情失败:', error);
      message.error('获取项目详情失败');
    }
  };

  // 获取园区列表（转签约表单）
  const fetchSignedZoneList = async (pid: string) => {
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
        setSignedParkOptions(options);
        return options;
      }
      return [];
    } catch (error) {
      console.error('获取园区列表失败:', error);
      message.error('获取园区列表失败');
      return [];
    }
  };

  // 获取乡镇列表（转签约表单）
  const fetchSignedTownList = async (pid: string) => {
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
        setSignedTownOptions(options);
        return options;
      }
      return [];
    } catch (error) {
      console.error('获取乡镇列表失败:', error);
      message.error('获取乡镇列表失败');
      return [];
    }
  };

  const fetchSignedProjTypeOptions = async () => {
    const buildTreeData = (nodes: any[]): any[] =>
      (nodes || []).map((item) => {
        const id = item?.id ?? item?.value;
        const name = item?.name ?? item?.label;
        const hasChildren = Array.isArray(item?.children) && item.children.length > 0;
        return {
          title: String(name ?? ''),
          value: String(id ?? ''),
          key: String(id ?? ''),
          disabled: hasChildren,
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
      setProjTypeTreeData(buildTreeData(treeData));
    } catch (error) {
      console.error('获取项目类型失败:', error);
      setProjTypeTreeData([]);
    }
  };

  const fetchIndustryFirstOptions = async () => {
    try {
      const response = await request('/zsxt-api/tProjIndustryFirst/list?page=1&size=9999', {
        method: 'POST',
        data: {},
      });
      const rawList = Array.isArray(response)
        ? response
        : (Array.isArray(response?.records)
          ? response.records
          : (Array.isArray(response?.data?.records)
            ? response.data.records
            : (Array.isArray(response?.data?.datalist)
              ? response.data.datalist
              : (Array.isArray(response?.data) ? response.data : []))));
      const options = rawList
        .map((item: any) => ({
          value: String(item?._code ?? item?.code ?? item?.id ?? item?.value ?? ''),
          label: String(item?._name ?? item?.name ?? item?.text ?? item?.label ?? ''),
        }))
        .filter((item: { value: string; label: string }) => item.value && item.label);
      setIndustryFirstOptions(options);
    } catch (error) {
      console.error('获取产业大类失败:', error);
      setIndustryFirstOptions([]);
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
          disabled: hasChildren,
          children: hasChildren ? buildTreeData(item.children) : undefined,
        };
      }).filter((item) => item.value !== '');

    const buildTreeDataFromFlat = (nodes: any[]): any[] => {
      const normalizedNodes = (nodes || []).map(normalizeIndustryNode).filter((item) => item.value !== '');
      const nodeMap = new Map<string, any>();
      normalizedNodes.forEach((item) => {
        nodeMap.set(String(item.value), { ...item, disabled: false, children: [] as any[] });
      });
      const roots: any[] = [];
      normalizedNodes.forEach((item) => {
        const current = nodeMap.get(String(item.value));
        const raw = item.raw || {};
        let parentKey = String(
          raw?.parentCode
          ?? raw?.parent_code
          ?? raw?.pcode
          ?? raw?.p_code
          ?? raw?.pid
          ?? raw?.pId
          ?? raw?.parentId
          ?? '',
        ).trim();
        if (!parentKey && /^[A-Z][0-9]/.test(current.value)) {
          parentKey = current.value.charAt(0);
        }
        if (parentKey && parentKey !== current.value && nodeMap.has(parentKey)) {
          const parent = nodeMap.get(parentKey);
          parent.children.push(current);
          parent.disabled = true;
        } else {
          roots.push(current);
        }
      });
      const sortNodes = (items: any[]): any[] =>
        items
          .sort((a, b) => String(a.value).localeCompare(String(b.value), 'zh-Hans-CN'))
          .map((item) => ({
            ...item,
            children: item.children?.length ? sortNodes(item.children) : undefined,
          }));
      return sortNodes(roots);
    };

    try {
      const response = await request('/zsxt-api/tProjIndustry/list?page=1&size=9999', {
        method: 'POST',
        data: {},
      });
      const rawList = Array.isArray(response)
        ? response
        : (Array.isArray(response?.records)
          ? response.records
          : (Array.isArray(response?.data?.records)
            ? response.data.records
            : (Array.isArray(response?.data?.datalist)
              ? response.data.datalist
              : (Array.isArray(response?.data) ? response.data : []))));
      const hasNestedChildren = rawList.some((item: any) => Array.isArray(item?.children) && item.children.length > 0);
      setIndustryTreeData(hasNestedChildren ? buildTreeData(rawList) : buildTreeDataFromFlat(rawList));
    } catch (error) {
      console.error('获取行业编码树失败:', error);
      setIndustryTreeData([]);
    }
  };

  // 获取投资方注册地选项（内资）
  const fetchInvestorPlaceOptions = async () => {
    try {
      const response = await request('/system-api/dict/activityAddress/items', {
        method: 'GET',
        params: { all: true },
      });
      
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.name || item.label,
          value: item.code || item.value,
        }));
        setInvestorPlaceOptions(options);
      }
    } catch (error) {
      console.error('获取内资投资方注册地列表失败:', error);
    }
  };

  // 获取投资方注册地选项（外资）
  const fetchForeignInvestorPlaceOptions = async () => {
    try {
      const response = await request('/system-api/dict/wzAddress/items', {
        method: 'GET',
        params: { all: true },
      });
      
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.name || item.label,
          value: item.code || item.value,
        }));
        setForeignInvestorPlaceOptions(options);
      }
    } catch (error) {
      console.error('获取外资投资方注册地列表失败:', error);
    }
  };

  const fetchProjSourceOptions = async (keyword?: string) => {
    try {
      setProjSourceLoading(true);
      const response = await request('/zsxt-api/tProjSource/list?page=1&size=50', {
        method: 'POST',
        data: {
          name: keyword || undefined,
          sourceName: keyword || undefined,
          keyword: keyword || undefined,
        },
      });
      const rawList = Array.isArray(response)
        ? response
        : (Array.isArray(response?.records)
          ? response.records
          : (Array.isArray(response?.data?.records)
            ? response.data.records
            : (Array.isArray(response?.data?.datalist)
              ? response.data.datalist
              : (Array.isArray(response?.data) ? response.data : []))));
      let options = rawList
        .map((item: any) => {
          const name = item?.name ?? item?.sourceName ?? item?.text ?? item?.label;
          return {
            label: String(name ?? ''),
            value: String(name ?? ''),
          };
        })
        .filter((item: { label: string; value: string }) => item.value)
        .filter((item: { label: string; value: string }, index: number, arr: { label: string; value: string }[]) =>
          arr.findIndex((p) => p.value === item.value) === index,
        );
      const trimmedKeyword = String(keyword || '').trim();
      if (trimmedKeyword) {
        options = options.filter((item: { label: string; value: string }) => item.label.includes(trimmedKeyword));
      }
      setProjSourceOptions(options);
    } catch (error) {
      console.error('获取市级机关推荐列表失败:', error);
      setProjSourceOptions([]);
    } finally {
      setProjSourceLoading(false);
    }
  };

  // 判断是否为外资项目（根据字典label判断）
  const isForeignProject = (projectCategory?: string) => {
    if (!projectCategory) return false;
    return projectCategory.includes('外') || projectCategory.toLowerCase().includes('foreign');
  };

  // 判断是否为内资项目
  const isDomesticProject = (projectCategory?: string) => {
    if (!projectCategory) return false;
    return projectCategory.includes('内') || projectCategory.toLowerCase().includes('domestic');
  };

  const TitleCom = ({ text, icon }: { text: string; icon: string }) => (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img style={{ width: '10px', marginRight: '5px' }} src={icon} alt="" />
      <div>{text}</div>
    </div>
  );

  const summaryLabelStyle = {
    width: '120px',
    color: '#1f1f1f',
    fontWeight: 500,
    flexShrink: 0 as const,
    lineHeight: 1.6,
  };

  const summaryValueStyle = {
    color: '#595959',
    lineHeight: 1.6,
    wordBreak: 'break-all' as const,
  };

  const summaryRowStyle = {
    display: 'flex',
    width: '100%',
    marginBottom: 2,
    alignItems: 'flex-start',
  };

  const summaryColStyle = {
    width: '50%',
    display: 'flex',
    alignItems: 'flex-start',
    paddingRight: 24,
    boxSizing: 'border-box' as const,
  };

  useEffect(() => {
    if (!toSignedModalVisible) {
      return;
    }

    const normalizedRecord = normalizeNegotiatingRecord(currentRecord);
    const userInfo = getSignedUserInfo();
    const userLevel = Number(userInfo?.user_level || 1);

    let nextDistrictCode = normalizedRecord.districtCode;
    let nextParkCode = normalizedRecord.parkCode;
    let nextTownCode = normalizedRecord.townCode;

    if (userLevel >= 2) {
      nextDistrictCode = userInfo?.district_code || nextDistrictCode;
    }
    if (userLevel >= 3) {
      nextParkCode = userInfo?.zone_code || nextParkCode;
    }
    if (userLevel >= 4) {
      nextTownCode = userInfo?.town_code || userInfo?.dept_code || nextTownCode;
    }

    // 加载园区和乡镇数据
    if (nextDistrictCode) {
      fetchSignedZoneList(nextDistrictCode);
    }
    if (nextParkCode) {
      fetchSignedTownList(nextParkCode);
    }
    setSignedFieldDisabled({
      district: userLevel >= 2,
      park: userLevel >= 3,
      town: userLevel >= 4,
    });
    setSupportUploadFileList([]);
    setReviewUploadFileList([]);
    setKcUploadFileList([]);
    setFzList([...defaultFzItems]);
    setFzInput('');

    toSignedForm.setFieldsValue({
      _name: undefined, // 项目名称不带初始值，让用户自己填写
      p_type: isForeignProject(normalizedRecord.projectCategory) ? '2' : '1',
      invest_money: normalizedRecord.investmentAmount,
      investor: normalizedRecord.investor,
      _desc: undefined, // 项目简介不带初始值，让用户重新填写
      district_code: nextDistrictCode,
      zone_code: nextParkCode,
      town_code: nextTownCode,
      signed_stat_date: dayjs(),
      signed_date: normalizedRecord.signedDate ? dayjs(normalizedRecord.signedDate) : undefined,
      plan_start_date: normalizedRecord.plan_start_date ? dayjs(normalizedRecord.plan_start_date) : undefined,
      plan_end_date: normalizedRecord.plan_end_date ? dayjs(normalizedRecord.plan_end_date) : undefined,
      cg_remark: normalizedRecord.cg_remark,
      yq_kpxs1: normalizedRecord.sales,
      yq_ss1: normalizedRecord.tax,
      sq_land_area: normalizedRecord.landArea,
      zl_land_area: normalizedRecord.rentArea,
    });
  }, [currentRecord, toSignedForm, toSignedModalVisible]);

  const columns = [
    {
      title: <TitleCom text={'序号'} icon={''} />,
      dataIndex: 'index',
      width: 80,
      align: 'center' as const,
      render: (_: unknown, _record: unknown, index: number) => index + 1,
    },
    {
      title: <TitleCom text={'投资方名称'} icon={''} />,
      dataIndex: 'investor',
      key: 'investor',
      width: 100,
      align: 'center' as const,
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: <TitleCom text={'项目名称'} icon={''} />,
      dataIndex: 'name',
      key: 'name',
      width: 120,
      align: 'center' as const,
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: <TitleCom text={'项目类别'} icon={''} />,
      dataIndex: 'projectCategory', // 对应 p_type
      key: 'projectCategory',
      align: 'center' as const,
      width: 120,
    },
    {
      title: <TitleCom text={'投资规模'} icon={''} />,
      dataIndex: 'investmentAmount', // 对应 invest_money
      key: 'investmentAmount',
      align: 'center' as const,
      width: 150,
    },
    {
      title: <TitleCom text={'洽谈进度'} icon={''} />,
      dataIndex: 'negotiationProgress', // 对应 progress
      key: 'negotiationProgress',
      align: 'center' as const,
      width: 200,
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: <TitleCom text={'项目内容'} icon={''} />,
      dataIndex: 'projectContent', // 对应 _desc
      key: 'projectContent',
      align: 'center' as const,
      width: 200,
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: <TitleCom text={'市区'} icon={''} />,
      dataIndex: 'districtName', // 对应 district
      key: 'districtName',
      align: 'center' as const,
      width: 150,
    },
    {
      title: <TitleCom text={'园区'} icon={''} />,
      dataIndex: 'parkName', // 对应 zone_name
      key: 'parkName',
      align: 'center' as const,
      width: 150,
    },
    {
      title: <TitleCom text={'镇街'} icon={''} />,
      dataIndex: 'townName',
      key: 'townName',
      align: 'center' as const,
      width: 120,
    },
    {
      title: <TitleCom text={'是否提请市级协调'} icon={''} />,
      dataIndex: 'requestCityCoordination',
      key: 'requestCityCoordination',
      align: 'center' as const,
      width: 180,
      render: (text: any) => text || '-',
    },
    {
      title: <TitleCom text={'报送日期'} icon={''} />,
      dataIndex: 'entryTime',
      key: 'entryTime',
      align: 'center' as const,
      width: 160,
      render: (text: any) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '',
    },
    {
      title: <TitleCom text={'数据状态'} icon={''} />,
      dataIndex: 'sj_status',
      key: 'sj_status',
      align: 'center' as const,
      width: 150,
      render: (text: any) => {
          if (text === 1) return <span style={{color: '#faad14'}}>流转至签约项目</span>;
          if (text === 2) return <span style={{color: '#52c41a'}}>流转至共享项目</span>;
          if (text === 0 || text === null || text === undefined) return <span style={{color: '#1890ff'}}></span>;
          return '-';
      }
    },
    {
      title: <TitleCom text={'操作'} icon={''} />,
      key: 'action',
      align: 'center' as const,
      width: 380,
      fixed: 'right' as const,
      render: (_: any, record: any) => {
        // 如果是驻外机构角色，不显示任何操作按钮
        if (isExternalOffice) {
          return null;
        }
        
        // 如果数据状态不为0 (或空)，则不显示操作按钮 (已流转)
        if (record.sj_status === 1 || record.sj_status === 2) {
            return null;
        }
        
        return (
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
              onClick={() => {
                setIsAdd(false);
                fetchProjectDetail(record.id);
              }}
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
                width: '85px',
                height: '28px',
                background: '#ff9800',
                borderRadius: '14px',
                fontSize: '12px',
                color: '#fff',
              }}
              onClick={() => {
                const normalizedRecord = normalizeNegotiatingRecord(record);
                setCurrentRecord(normalizedRecord);
                
                // 如果是 level=4 用户，设置园区和镇街选项
                if (level4User?.isLevel4) {
                  setSignedParkOptions([{
                    label: level4User.zoneName,
                    value: level4User.zoneCode,
                  }]);
                  
                  // 如果是镇街级别，设置镇街选项
                  if (level4User.isTownLevel && level4User.townCode && level4User.townName) {
                    setSignedTownOptions([{
                      label: level4User.townName,
                      value: level4User.townCode,
                    }]);
                  } else {
                    setSignedTownOptions([]);
                  }
                  
                  // 设置字段禁用状态
                  setSignedFieldDisabled({
                    district: true,
                    park: true,
                    town: level4User.isTownLevel,
                  });
                  
                  // 设置表单默认值
                  setTimeout(() => {
                    const formValues: any = {
                      district_code: level4User.districtCode,
                      zone_code: level4User.zoneCode,
                    };
                    
                    // 如果是镇街级别，设置镇街默认值
                    if (level4User.isTownLevel && level4User.townCode) {
                      formValues.town_code = level4User.townCode;
                    }
                    
                    toSignedForm.setFieldsValue(formValues);
                  }, 0);
                } else {
                  // 非 level=4 用户，如果有市区，加载对应的园区选项
                  if (normalizedRecord.districtName) {
                    fetchEditZoneList(normalizedRecord.districtName);
                  }
                }
                
                // 初始化默认附则
                setFzList([
                    '本协议与国家法律、法规相悖的，按国家法律、法规执行。',
                    '如因履行本协议发生纠纷而引起诉讼的，由甲方所在地人民法院管辖。',
                    '本协议书一式四份，甲方执存两份，乙方执存两份，本协议自双方签字盖章之日起生效。',
                ]);
                setToSignedModalVisible(true);
              }}
            >
              <div>转签约</div>
              <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
            </div>
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '85px',
                height: '28px',
                background: '#52c41a',
                borderRadius: '14px',
                fontSize: '12px',
                color: '#fff',
              }}
              onClick={() => {
                setCurrentRecord(normalizeNegotiatingRecord(record));
                setToShareModalVisible(true);
              }}
            >
              <div>转共享</div>
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
            <Form 
              form={form} 
              name="searchForm"
              onFinish={(values) => onSearch(values, 1, pagination.pageSize)}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="投资方名称" name="investor">
                    <Input placeholder="请输入投资方名称" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="项目类别" name="investmentFlag">
                    <Select placeholder="请选择" allowClear>
                      {projectTypeOptions.map(option => (
                        <Select.Option key={option.value} value={option.label}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="市区" name="districtName">
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
                  <Form.Item label="园区" name="parkName">
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
                  <Form.Item label="镇街" name="townName">
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
                  <Form.Item label="是否提请市级协调" name="requestCityCoordination">
                    <Select
                      placeholder="请选择"
                      allowClear
                      options={[
                        { label: '是', value: '是' },
                        { label: '否', value: '否' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Form.Item style={{ marginTop: '22px', marginBottom: 0 }}>
                    <Space>
                      {!isExternalOffice && (
                        <Button
                          type="primary"
                          size="middle"
                          onClick={() => {
                            setIsAdd(true);
                            setCurrentRecord({});
                            
                            // 如果是 level=4 用户，设置默认值和园区/镇街选项
                            if (level4User) {
                              setEditZoneOptions([{
                                label: level4User.zoneName,
                                value: level4User.zoneCode,
                              }]);
                              
                              // 如果是镇街级别，设置镇街选项
                              if (level4User.isTownLevel && level4User.townCode && level4User.townName) {
                                setEditTownOptions([{
                                  label: level4User.townName,
                                  value: level4User.townCode,
                                }]);
                              } else {
                                setEditTownOptions([]);
                              }
                              
                              setTimeout(() => {
                                const formValues: any = {
                                  districtName: level4User.districtCode,
                                  parkName: level4User.zoneCode,
                                };
                                
                                // 如果是镇街级别，设置镇街默认值
                                if (level4User.isTownLevel && level4User.townCode) {
                                  formValues.townName = level4User.townCode;
                                }
                                
                                editForm.setFieldsValue(formValues);
                              }, 100);
                            } else {
                              setEditZoneOptions([]);
                              setEditTownOptions([]);
                            }
                            
                            setEditModalVisible(true);
                          }}
                        >
                          新增项目
                        </Button>
                      )}
                      <Button
                        type="primary"
                        size="middle"
                        onClick={handleExport}
                      >
                        导出
                      </Button>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button
                        htmlType="button"
                        onClick={() => {
                          form.resetFields();
                          setSearchZoneOptions([]);
                          setSearchTownOptions([]);
                          setSearchZoneSelected(false);
                          setEditZoneOptions([]);
                          onSearch({
                            investor: '',
                            investmentFlag: '',
                            districtName: '',
                            parkName: '',
                            requestCityCoordination: '',
                          });
                        }}
                      >
                        重置
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <Table
            style={{ marginTop: 20, padding: '0 20px 20px' }}
            rowKey={(record: any) => record.id || record._id}
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            scroll={{ x: 1500 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (page, pageSize) => {
                onSearch(form.getFieldsValue(), page, pageSize);
              },
            }}
          />
        
        {/* Modals */}

        {/* 新增/编辑 在谈项目 Modal */}
        <Modal
          width={1200}
          title={isAdd ? '添加在谈项目' : '编辑在谈项目'}
          open={editModalVisible}
          footer={null}
          onCancel={() => setEditModalVisible(false)}
          destroyOnClose
        >
          <Form
            form={editForm}
            layout={'vertical'}
            style={{ maxWidth: 1200, padding: '20px 0' }}
            initialValues={currentRecord}
            onFinish={handleSaveProject}
            onValuesChange={(changedValues, allValues) => {
              // 市区变化已经在 handleEditDistrictChange 中处理
              if (changedValues.requestCityCoordination !== undefined) {
                if (changedValues.requestCityCoordination === '否') {
                  // 使用 setTimeout 确保在下一个事件循环中清空
                  setTimeout(() => {
                    editForm.setFieldsValue({ cityCoordinationItems: null });
                  }, 0);
                }
              }
            }}
            autoComplete="off"
          >
            <div style={{ fontWeight: 'bold', marginBottom: 16 }}>基础信息</div>
            <Descriptions column={2} bordered>
              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    投资方名称
                  </span>
                }
                span={2}
              >
                <Form.Item name="investor" rules={[{ required: true, message: '请输入投资方名称' }]} style={{ marginBottom: 0 }}>
                  <Input placeholder="请输入" maxLength={200} showCount />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    项目名称
                  </span>
                }
                span={2}
              >
                <Form.Item name="name" rules={[{ required: true, message: '请输入项目名称' }]} style={{ marginBottom: 0 }}>
                  <Input placeholder="请输入" maxLength={200} showCount />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    项目总投资
                  </span>
                }
                span={2}
              >
                <Form.Item name="investmentAmount" rules={[{ required: true, message: '请输入项目总投资' }]} style={{ marginBottom: 0 }}>
                   <InputNumber placeholder="请输入" style={{ width: '100%' }} addonAfter="亿元" />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    项目类别
                  </span>
                }
                span={2}
              >
                <Form.Item name="projectCategory" rules={[{ required: true, message: '请选择项目类别' }]} style={{ marginBottom: 0 }}>
                  <Radio.Group
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '内资') {
                        fetchInvestorPlaceOptions();
                      } else if (value === '外资') {
                        fetchForeignInvestorPlaceOptions();
                      }
                      editForm.setFieldsValue({ investorPlace: undefined, placeInfo: undefined });
                    }}
                  >
                    {projectTypeOptions.map(option => (
                      <Radio key={option.value} value={option.label}>
                        {option.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    投资方注册地
                  </span>
                }
                span={1}
              >
                <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.projectCategory !== curValues.projectCategory} noStyle>
                  {({ getFieldValue }) => {
                    const projectCategory = getFieldValue('projectCategory');
                    const options = projectCategory === '外资' ? foreignInvestorPlaceOptions : investorPlaceOptions;
                    return (
                      <Form.Item name="investorPlace" rules={[{ required: true, message: '请选择投资方注册地' }]} style={{ marginBottom: 0 }}>
                        <Select 
                          placeholder={!projectCategory ? '请先选择项目类别' : '请选择'} 
                          options={options}
                          disabled={!projectCategory}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.projectCategory !== curValues.projectCategory} noStyle>
                      {({ getFieldValue }) => {
                        const isForeign = getFieldValue('projectCategory') === '外资';
                        return !isForeign && <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>;
                      }}
                    </Form.Item>
                    城市名称
                  </span>
                }
                span={1}
              >
                <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.projectCategory !== curValues.projectCategory} noStyle>
                  {({ getFieldValue }) => {
                    const isForeign = getFieldValue('projectCategory') === '外资';
                    return (
                      <Form.Item 
                        name="placeInfo" 
                        rules={isForeign ? [] : [{ required: true, message: '请输入城市名称' }]} 
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="请输入" />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    洽谈进度
                  </span>
                }
                span={2}
              >
                <Form.Item name="negotiationProgress" rules={[{ required: true, message: '请输入洽谈进度' }]} style={{ marginBottom: 0 }}>
                  <Input placeholder="请输入" maxLength={200} showCount />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    项目内容
                  </span>
                }
                span={2}
              >
                <Form.Item name="projectContent" rules={[{ required: true, message: '请输入项目内容' }]} style={{ marginBottom: 0 }}>
                  <Input.TextArea rows={4} placeholder="请输入" maxLength={500} showCount />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="是否市级重点项目" span={1}>
                <Form.Item name="isCityKeyProject" style={{ marginBottom: 0 }}>
                  <Radio.Group options={[{ label: '是', value: '是' }, { label: '否', value: '否' }]} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="是否省级重点项目" span={1}>
                <Form.Item name="isProvinceKeyProject" style={{ marginBottom: 0 }}>
                  <Radio.Group options={[{ label: '是', value: '是' }, { label: '否', value: '否' }]} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                    是否提请市级协调
                  </span>
                }
                span={2}
              >
                <Form.Item
                  name="requestCityCoordination"
                  rules={[{ required: true, message: '请选择是否提请市级协调' }]}
                  style={{ marginBottom: 0 }}
                >
                  <Radio.Group options={[{ label: '是', value: '是' }, { label: '否', value: '否' }]} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item span={2} label="提请市级协调事项">
                <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.requestCityCoordination !== curValues.requestCityCoordination} noStyle>
                  {({ getFieldValue }) => {
                    const needCoordination = getFieldValue('requestCityCoordination') === '是';

                    return (
                      <Form.Item
                        name="cityCoordinationItems"
                        rules={[
                          {
                            validator: async (_, value) => {
                              if (!needCoordination) {
                                return;
                              }
                              if (typeof value === 'string' && value.trim()) {
                                return;
                              }
                              throw new Error('请输入提请市级协调事项');
                            },
                          },
                        ]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input.TextArea
                          rows={4}
                          disabled={!needCoordination}
                          placeholder={needCoordination ? '请输入，一行一个事项' : '选择"是"后可填写，一行一个事项'}
                          maxLength={500}
                          showCount
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 24 }}>项目详细信息</div>
            <Descriptions column={2} bordered>
               <Descriptions.Item label="初次对接时间" span={1}>
                  <Form.Item name="firstContactTime" style={{ marginBottom: 0 }}>
                      <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                  </Form.Item>
               </Descriptions.Item>
               <Descriptions.Item label="市区" span={1}>
                  <Form.Item name="districtName" style={{ marginBottom: 0 }}>
                      <Select 
                        placeholder="请选择" 
                        allowClear 
                        onChange={handleEditDistrictChange}
                        disabled={level4User?.isLevel4}
                      >
                        {districtOptions.map(item => (
                          <Select.Option key={item.value} value={item.value}>
                            {item.label}
                          </Select.Option>
                        ))}
                      </Select>
                  </Form.Item>
               </Descriptions.Item>

               <Descriptions.Item label="园区名称" span={1}>
                  <Form.Item name="parkName" style={{ marginBottom: 0 }}>
                      <Select 
                        placeholder="请先选择市区" 
                        allowClear 
                        onChange={handleEditZoneChange}
                        disabled={level4User?.isLevel4 || editZoneOptions.length === 0}
                      >
                        {editZoneOptions.map(item => (
                          <Select.Option key={item.value} value={item.value}>
                            {item.label}
                          </Select.Option>
                        ))}
                      </Select>
                  </Form.Item>
               </Descriptions.Item>

               <Descriptions.Item label="镇街" span={1}>
                  <Form.Item name="townName" style={{ marginBottom: 0 }}>
                      <Select 
                        placeholder="请先选择园区" 
                        allowClear 
                        disabled={level4User?.isTownLevel || editTownOptions.length === 0}
                      >
                        {editTownOptions.map(item => (
                          <Select.Option key={item.value} value={item.value}>
                            {item.label}
                          </Select.Option>
                        ))}
                      </Select>
                  </Form.Item>
               </Descriptions.Item>
               <Descriptions.Item label="厂房类型" span={1}>
                  <Form.Item name="factoryType" style={{ marginBottom: 0 }}>
                      <Select options={[{ label: '租赁', value: '租赁' }, { label: '购买', value: '购买' }]} placeholder="请选择" />
                  </Form.Item>
               </Descriptions.Item>

               <Descriptions.Item label="拟用地面积（亩）" span={1}>
                  <Form.Item name="landArea" style={{ marginBottom: 0 }}>
                      <InputNumber style={{ width: '100%' }} placeholder="请输入" />
                  </Form.Item>
               </Descriptions.Item>
               <Descriptions.Item label="拟租厂房面积（平方米）" span={1}>
                  <Form.Item name="rentArea" style={{ marginBottom: 0 }}>
                      <InputNumber style={{ width: '100%' }} placeholder="请输入" />
                  </Form.Item>
               </Descriptions.Item>

               <Descriptions.Item label="拟购厂房面积（平方米）" span={1}>
                  <Form.Item name="buyArea" style={{ marginBottom: 0 }}>
                      <InputNumber style={{ width: '100%' }} placeholder="请输入" />
                  </Form.Item>
               </Descriptions.Item>
               <Descriptions.Item label="预计年销量（万元）" span={1}>
                  <Form.Item name="sales" style={{ marginBottom: 0 }}>
                      <InputNumber style={{ width: '100%' }} placeholder="请输入" />
                  </Form.Item>
               </Descriptions.Item>

               <Descriptions.Item label="预计年税收（万元）" span={2}>
                  <Form.Item name="tax" style={{ marginBottom: 0 }}>
                      <InputNumber style={{ width: '100%' }} placeholder="请输入" />
                  </Form.Item>
               </Descriptions.Item>
            </Descriptions>

            <Form.Item style={{ marginTop: '20px', textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setEditModalVisible(false)}>取消</Button>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* 转签约 弹窗 */}
        <ModalForm
            title="转签约项目"
            form={toSignedForm}
            open={toSignedModalVisible}
            onOpenChange={(open) => {
                setToSignedModalVisible(open);
                if (!open) {
                    setSignedParkOptions([]);
                    setSignedTownOptions([]);
                    setSignedFieldDisabled({ district: false, park: false, town: false });
                    setSupportUploadFileList([]);
                    setReviewUploadFileList([]);
                    setKcUploadFileList([]);
                    setFzList([...defaultFzItems]);
                    setFzInput('');
                    toSignedForm.resetFields();
                }
            }}
            onFinish={handleToSigned}
            width={1200}
            modalProps={{ destroyOnClose: true }}
            submitter={{
                render: (props, _dom) => {
                    return (
                        <Space>
                            <Button onClick={() => props.onReset?.()}>取消</Button>
                            <Button
                                onClick={() => {
                                    handleSaveDraft();
                                }}
                                style={{ backgroundColor: '#00bfa5', color: 'white', borderColor: '#00bfa5' }}
                            >
                                存入草稿箱
                            </Button>
                            <ProFormDependency name={['invest_money', 'p_type']}>
                                {({ invest_money, p_type }) => {
                                    const amount = Number(invest_money || 0);
                                    let isBigProject = false;
                                    if (p_type === '1' && amount >= 5) isBigProject = true;
                                    if (p_type === '2' && amount >= 3000) isBigProject = true;
                                    
                                    return (
                                        <Button type="primary" onClick={() => props.submit()}>
                                            {isBigProject ? '提交项目质态评估' : '提交'}
                                        </Button>
                                    );
                                }}
                            </ProFormDependency>
                        </Space>
                    );
                }
            }}
        >
            <div style={{ color: 'red', marginBottom: 16, lineHeight: '1.8' }}>
                <div>1、金额在5亿以上的项目，需走质态评估（市级部门预警）流程；金额在5亿以下的项目，无需走质态评估（市级部门预警）流程。</div>
                <div>2、本次补录重点为亿元以上或涉及今年新签约、新开工、新竣工的项目，补录的项目无需重新生成协议。</div>
                <div>3、项目开工、竣工认定，由项目专班进行审核。</div>
            </div>

            <Descriptions 
                column={2} 
                bordered 
                size="small"
                labelStyle={{ 
                    backgroundColor: '#fafafa', 
                    fontWeight: 500,
                    width: '180px'
                }}
                contentStyle={{ backgroundColor: '#fff' }}
                style={{ marginBottom: 24 }}
            >
                <Descriptions.Item label="投资方名称" span={2}>
                    {currentRecord?.investor || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="项目名称" span={2}>
                    {currentRecord?.name || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="项目类别" span={1}>
                    {currentRecord?.projectCategory || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="投资规模" span={1}>
                    {currentRecord?.investmentAmount ? `${currentRecord.investmentAmount}亿` : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="项目内容" span={2}>
                    {currentRecord?.projectContent || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="洽谈进度" span={2}>
                    {currentRecord?.negotiationProgress || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="初次对接时间" span={1}>
                    {currentRecord?.firstContactTime ? dayjs(currentRecord.firstContactTime).format('YYYY-MM-DD') : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="市区" span={1}>
                    {currentRecord?.districtName || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="园区名称" span={1}>
                    {currentRecord?.parkName || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="厂房类型" span={1}>
                    {currentRecord?.factoryType || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="拟用地面积（亩）" span={1}>
                    {currentRecord?.landArea || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="拟租厂房面积（㎡）" span={1}>
                    {currentRecord?.rentArea || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="拟购厂房面积（㎡）" span={1}>
                    {currentRecord?.buyArea || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="预计年销量（万元）" span={1}>
                    {currentRecord?.sales || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="预计年税收（万元）" span={1}>
                    {currentRecord?.tax || '-'}
                </Descriptions.Item>
            </Descriptions>

            <div style={gridStyles.container}>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>市区</div>
                            <div style={gridStyles.content}>
                                <ProFormSelect
                                    name="district_code"
                                    options={districtOptions}
                                    rules={[{ required: true }]}
                                    fieldProps={{
                                        style: { width: '100%' },
                                        disabled: signedFieldDisabled.district || level4User?.isLevel4,
                                        onChange: (value) => {
                                            if (value) {
                                                fetchSignedZoneList(String(value));
                                            } else {
                                                setSignedParkOptions([]);
                                            }
                                            setSignedTownOptions([]);
                                            toSignedForm.setFieldsValue({ zone_code: undefined, town_code: undefined });
                                        },
                                    }}
                                    noStyle
                                />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>园区</div>
                            <div style={gridStyles.contentLast}>
                                <Space style={{ width: '100%' }} size={12}>
                                    <ProFormSelect
                                        name="zone_code"
                                        placeholder="请选择园区"
                                        options={signedParkOptions}
                                        rules={[{ required: true }]}
                                        fieldProps={{
                                            style: { width: 220 },
                                            disabled: signedFieldDisabled.park || level4User?.isLevel4 || signedParkOptions.length === 0,
                                            onChange: (value) => {
                                                if (value) {
                                                    fetchSignedTownList(String(value));
                                                } else {
                                                    setSignedTownOptions([]);
                                                }
                                                if (!signedFieldDisabled.town) {
                                                    toSignedForm.setFieldsValue({ town_code: undefined });
                                                }
                                            },
                                        }}
                                        noStyle
                                    />
                                    <ProFormSelect
                                        name="town_code"
                                        placeholder="请选择街镇"
                                        options={signedTownOptions}
                                        fieldProps={{ style: { width: 160 }, disabled: signedFieldDisabled.town || level4User?.isTownLevel || signedTownOptions.length === 0 }}
                                        noStyle
                                    />
                                </Space>
                            </div>
                        </div>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目名称</div>
                            <div style={gridStyles.content}>
                                <ProFormText name="_name" rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目类别</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormRadio.Group
                                    name="p_type"
                                    options={[{ label: '内资', value: '1' }, { label: '外资', value: '2' }]}
                                    rules={[{ required: true }]}
                                    fieldProps={{
                                        onChange: (e) => {
                                            const nextValue = e?.target?.value;
                                            if (nextValue === '1') {
                                                toSignedForm.setFieldsValue({ foreign_money: undefined, investor_place: undefined });
                                            } else if (nextValue === '2') {
                                                toSignedForm.setFieldsValue({ investor_place: undefined });
                                            }
                                        },
                                    }}
                                    noStyle
                                />
                            </div>
                        </div>

                        <ProFormDependency name={['p_type']}>
                            {({ p_type }) => {
                                const isForeign = p_type === '2';
                                return (
                                    <div style={gridStyles.row}>
                                        <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目总投资</div>
                                        <div style={gridStyles.content}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                                                <div style={{ flex: 1 }}>
                                                    <ProFormDigit name="invest_money" rules={[{ required: true }]} noStyle />
                                                </div>
                                                <span style={{ flexShrink: 0 }}>{isForeign ? '万美元' : '亿元'}</span>
                                            </div>
                                        </div>
                                        <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>协议利用外资</div>
                                        <div style={gridStyles.contentLast}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                                                <div style={{ flex: 1 }}>
                                                    <ProFormDigit
                                                        name="foreign_money"
                                                        rules={isForeign ? [{ required: true }] : []}
                                                        fieldProps={{ style: { width: '100%' }, disabled: !isForeign }}
                                                        noStyle
                                                    />
                                                </div>
                                                <span style={{ flexShrink: 0 }}>万美元</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        </ProFormDependency>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目类型</div>
                            <div style={gridStyles.content}>
                                <ProFormTreeSelect
                                    name="proj_type"
                                    placeholder="请选择项目类型"
                                    rules={[{ required: true }]}
                                    fieldProps={{
                                        style: { width: '100%' },
                                        treeData: projTypeTreeData,
                                        showSearch: true,
                                        treeNodeFilterProp: 'title',
                                        treeDefaultExpandAll: true,
                                        treeLine: true,
                                    }}
                                    noStyle
                                />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>产业大类名称</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect
                                    name="industry_first_code"
                                    options={industryFirstOptions}
                                    rules={[{ required: true, message: '请选择产业大类名称' }]}
                                    fieldProps={{ style: { width: '100%' }, showSearch: true, optionFilterProp: 'label' }}
                                    noStyle
                                />
                            </div>
                        </div>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>行业编码</div>
                            <div style={gridStyles.content}>
                                <ProFormTreeSelect
                                    name="industry_code"
                                    placeholder="请选择行业编码"
                                    rules={[{ required: true, message: '请选择行业编码' }]}
                                    fieldProps={{
                                        style: { width: '100%' },
                                        treeData: industryTreeData,
                                        showSearch: true,
                                        treeNodeFilterProp: 'title',
                                        treeDefaultExpandAll: true,
                                        treeLine: true,
                                    }}
                                    noStyle
                                />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>所属行业</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormRadio.Group name="b_industry" options={[{ label: '服务业', value: '1' }, { label: '工业', value: '2' }]} rules={[{ required: true }]} noStyle />
                            </div>
                        </div>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>投资方名称</div>
                            <div style={gridStyles.content}>
                                <ProFormText name="investor" rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>投资方性质</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect name="investor_type" options={investorTypeOptions} rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                        </div>

                        <ProFormDependency name={['p_type']}>
                            {({ p_type }) => (
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>投资方注册地</div>
                                    <div style={gridStyles.content}>
                                        <ProFormSelect
                                            name="investor_place"
                                            options={p_type === '2' ? foreignInvestorPlaceOptions : investorPlaceOptions}
                                            rules={[{ required: true }]}
                                            fieldProps={{ style: { width: '100%' } }}
                                            noStyle
                                            placeholder={!p_type ? '请先选择项目类别' : '请选择'}
                                        />
                                    </div>
                                    <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>是否属于上市企业</div>
                                    <div style={gridStyles.contentLast}>
                                        <ProFormSelect name="is_listed" options={[{ label: '是', value: '1' }, { label: '否', value: '2' }]} rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                                    </div>
                                </div>
                            )}
                        </ProFormDependency>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>是否高新技术企业</div>
                            <div style={gridStyles.content}>
                                <ProFormSelect name="is_gxjs" options={[{ label: '是', value: '是' }, { label: '否', value: '否' }]} rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>是否有市外资金投入</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect name="has_municipal_capital" options={[{ label: '是', value: '是' }, { label: '否', value: '否' }]} rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                        </div>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>股权比例</div>
                            <div style={gridStyles.content}>
                                <ProFormText name="equity_ratio" fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                            <div style={gridStyles.label}></div>
                            <div style={gridStyles.contentLast}></div>
                        </div>

                        <ProFormDependency name={['is_rzxq']}>
                            {({ is_rzxq }) => (
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>是否有融资需求</div>
                                    <div style={gridStyles.content}>
                                        <ProFormRadio.Group name="is_rzxq" options={[{ label: '是', value: '是' }, { label: '否', value: '否' }]} rules={[{ required: true }]} noStyle />
                                    </div>
                                    {is_rzxq === '是' ? (
                                        <>
                                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>融资金额</div>
                                            <div style={gridStyles.contentLast}>
                                                <ProFormDigit name="rz_money" rules={[{ required: true }]} noStyle />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div style={gridStyles.label}></div>
                                            <div style={gridStyles.contentLast}></div>
                                        </>
                                    )}
                                </div>
                            )}
                        </ProFormDependency>

                        <ProFormDependency name={['is_kc_proj', 'kc_proj_type']}>
                            {({ is_kc_proj, kc_proj_type }) => (
                                <>
                                    <div style={gridStyles.row}>
                                        <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>是否科创项目</div>
                                        <div style={gridStyles.content}>
                                            <ProFormRadio.Group
                                                name="is_kc_proj"
                                                options={[{ label: '是', value: '是' }, { label: '否', value: '否' }]}
                                                rules={[{ required: true }]}
                                                fieldProps={{
                                                    onChange: (e) => {
                                                        if (e?.target?.value !== '是') {
                                                            toSignedForm.setFieldsValue({ kc_proj_tj: '', kc_proj_type: undefined });
                                                            setKcUploadFileList([]);
                                                        }
                                                    },
                                                }}
                                                noStyle
                                            />
                                        </div>
                                        <div style={gridStyles.label}></div>
                                        <div style={gridStyles.contentLast}></div>
                                    </div>
                                    {is_kc_proj === '是' && (
                                        <>
                                            <div style={gridStyles.row}>
                                                <div style={gridStyles.label}>符合科创项目认定条件</div>
                                                <div style={gridStyles.contentLast}>
                                                    <ProFormText name="kc_proj_tj" placeholder="请输入" rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                                                </div>
                                            </div>
                                            <div style={gridStyles.row}>
                                                <div style={gridStyles.label}></div>
                                                <div style={{ ...gridStyles.contentLast, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                    <ProFormSelect
                                                        name="kc_proj_type"
                                                        placeholder="请选择"
                                                        options={kcProjectTypeOptions}
                                                        rules={[{ required: true }]}
                                                        fieldProps={{ style: { width: '100%' } }}
                                                        noStyle
                                                    />
                                                    <div style={{ color: 'red', fontSize: 12 }}>{getKcProofMessage(kc_proj_type)}</div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            {renderUploadLinks(
                                                                kcUploadFileList,
                                                                (file) => setKcUploadFileList((prev) => prev.filter((item) => item.uid !== file.uid)),
                                                                true,
                                                            )}
                                                        </div>
                                                        <Upload {...kcUploadProps}>
                                                            <Button type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#00bfa5', borderColor: '#00bfa5' }}>上传文件</Button>
                                                        </Upload>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </ProFormDependency>

                        <ProFormDependency name={['b_resource']}>
                            {({ b_resource }) => (
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>QFLP外资项目</div>
                                    <div style={gridStyles.content}>
                                        <ProFormSelect name="is_qflp" options={[{ label: '是', value: '是' }, { label: '否', value: '否' }]} rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                                    </div>
                                    <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目信息来源</div>
                                    <div style={{ ...gridStyles.contentLast, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <ProFormRadio.Group
                                            name="b_resource"
                                            options={[{ label: '自行接洽', value: '1' }, { label: '市级机关推荐', value: '2' }]}
                                            rules={[{ required: true }]}
                                            fieldProps={{
                                                onChange: (e) => {
                                                    if (e?.target?.value !== '2') {
                                                        toSignedForm.setFieldsValue({ sjjg_name: undefined });
                                                    }
                                                },
                                            }}
                                            noStyle
                                        />
                                        {b_resource === '2' && (
                                            <ProFormSelect
                                                name="sjjg_name"
                                                placeholder="请输入关键字搜索推荐单位"
                                                options={projSourceOptions}
                                                rules={[{ required: true, message: '请选择推荐单位' }]}
                                                fieldProps={{
                                                    style: { width: '100%' },
                                                    showSearch: true,
                                                    filterOption: false,
                                                    loading: projSourceLoading,
                                                    onSearch: (value) => fetchProjSourceOptions(value),
                                                    onClear: () => fetchProjSourceOptions(),
                                                    onDropdownVisibleChange: (open) => {
                                                        if (open && !projSourceOptions.length) {
                                                            fetchProjSourceOptions();
                                                        }
                                                    },
                                                }}
                                                noStyle
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </ProFormDependency>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目简介</div>
                            <div style={{ ...gridStyles.contentLast, display: 'flex', flexDirection: 'column' }}>
                                <ProFormTextArea name="_desc" rules={[{ required: true }]} noStyle fieldProps={{ rows: 4 }} />
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>
                                    (填写包括：占地、建筑面积、设备、原料、工艺、产品、产能。参考格式：项目占地**亩，新建建筑面积**平方米（土建必填），计容面积**平方米，包括****，总投资***万，设备投资***万，购置***等设备多少台（套），主要原料有***，主要工艺有***，形成年产****。)
                                </div>
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目选址位置</div>
                            <div style={gridStyles.content}>
                                <ProFormText name="project_address" rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预计开工时间</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDatePicker name="plan_start_date" rules={[{ required: true }]} noStyle fieldProps={{ style: { width: '100%' } }} />
                            </div>
                        </div>
                        <ProFormDependency name={['p_type']}>
                            {({ p_type }) => (
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预计竣工时间</div>
                                    <div style={gridStyles.content}>
                                        <ProFormDatePicker name="plan_end_date" rules={[{ required: true }]} noStyle fieldProps={{ style: { width: '100%' } }} />
                                    </div>
                                    <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>注册资本（{p_type === '2' ? '万美元' : '万元'}）</div>
                                    <div style={gridStyles.contentLast}>
                                        <ProFormDigit name="zhuce_money" rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                                    </div>
                                </div>
                            )}
                        </ProFormDependency>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>签约日期</div>
                            <div style={gridStyles.content}>
                                <ProFormDatePicker name="signed_date" rules={[{ required: true }]} noStyle fieldProps={{ style: { width: '100%' } }} />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>签约信息统计日期</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDatePicker name="signed_stat_date" disabled noStyle fieldProps={{ style: { width: '100%' } }} />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>成效情况说明</div>
                            <div style={{ ...gridStyles.contentLast, display: 'flex', flexDirection: 'column' }}>
                                <ProFormTextArea name="cg_remark" rules={[{ required: true }]} noStyle fieldProps={{ rows: 3 }} />
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>(请对照成效评估办法，补充其他需要说明的情况)</div>
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>产业关联度</div>
                            <div style={gridStyles.content}>
                                <ProFormSelect name="cy_gl" rules={[{ required: true, message: '请选择产业关联度' }]} options={['强相关', '一般', '不相关']} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>是否增资扩产项目</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect name="zjkc" options={['是', '否']} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                        </div>
            </div>

            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>准入条件</div>
            <div style={gridStyles.container}>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>特殊行业</div>
                            <div style={gridStyles.content}>
                                <ProFormSelect name="tshy" options={[{ label: '是', value: '是' }, { label: '否', value: '否' }]} rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>准入限制</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect name="zrxz" options={[{ label: '有', value: '有' }, { label: '无', value: '无' }]} rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>两高项目</div>
                            <div style={gridStyles.content}>
                                <ProFormSelect name="lgxm" options={[{ label: '是', value: '是' }, { label: '否', value: '否' }]} rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>重金属排放</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect name="zjspf" options={[{ label: '有', value: '有' }, { label: '无', value: '无' }]} rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预计年耗能情况(吨标煤)</div>
                            <div style={gridStyles.content}>
                                <ProFormText name="total_use" rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预计年排污情况（废水、废气等）</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormText name="is_wuran" rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                        </div>
            </div>

            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>投资规模</div>
            <div style={gridStyles.container}>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>申请用地面积（亩）</div>
                            <div style={gridStyles.content}>
                                <ProFormDigit name="sq_land_area" rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>已供面积（亩）</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDigit name="ygmj" rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>盘活面积（亩）</div>
                            <div style={gridStyles.content}>
                                <ProFormDigit name="phmj" rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>租赁厂房面积（平方米）</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDigit name="zl_land_area" rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
                        <ProFormDependency name={['p_type']}>
                            {({ p_type }) => (
                                <>
                                    <div style={gridStyles.row}>
                                        <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>折算用地（亩）</div>
                                        <div style={gridStyles.content}>
                                            <ProFormDigit name="zs_land_area" rules={[{ required: true }]} noStyle />
                                        </div>
                                        <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>计划总投资（{p_type === '2' ? '万美元' : '万元'}）</div>
                                        <div style={gridStyles.contentLast}>
                                            <ProFormDigit name="plan_total1" rules={[{ required: true }]} noStyle />
                                        </div>
                                    </div>
                                    <div style={gridStyles.row}>
                                        <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>计划投资强度（{p_type === '2' ? '万美元' : '万元'}/亩）</div>
                                        <div style={gridStyles.content}>
                                            <ProFormDigit name="plan_invest_strong" rules={[{ required: true }]} noStyle />
                                        </div>
                                        <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>固定资产投资（万元）</div>
                                        <div style={gridStyles.contentLast}>
                                            <ProFormDigit name="fixed_invest" rules={[{ required: true }]} noStyle />
                                        </div>
                                    </div>
                                    <div style={gridStyles.row}>
                                        <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预计签约当年年度投资额（万元）</div>
                                        <div style={gridStyles.contentLast}>
                                            <ProFormDigit name="tzgm" rules={[{ required: true }]} noStyle />
                                        </div>
                                    </div>
                                </>
                            )}
                        </ProFormDependency>
            </div>

            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>预期效益</div>
            <div style={gridStyles.container}>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预期年均产值（万元）</div>
                            <div style={gridStyles.content}>
                                <ProFormDigit name="yq_cz1" rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预期年均开票销售（万元）</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDigit name="yq_kpxs1" rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预期年均税收（万元）</div>
                            <div style={gridStyles.content}>
                                <ProFormDigit name="yq_ss1" rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预期年均亩均税收（万元）</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDigit name="yq_mjtax1" rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
            </div>

            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>市（区）联合评审结论</div>
            <div style={gridStyles.container}>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>各市（区）联合评审结论</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect name="zhpg" options={['优秀', '良好', '一般']} rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目情况分析和评审结果</div>
                            <div style={{ ...gridStyles.contentLast, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {renderUploadLinks(
                                        reviewUploadFileList,
                                        (file) => setReviewUploadFileList((prev) => prev.filter((item) => item.uid !== file.uid)),
                                        true,
                                    )}
                                </div>
                                <Upload {...reviewUploadProps}>
                                    <Button type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#00bfa5', borderColor: '#00bfa5' }}>上传文件</Button>
                                </Upload>
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>市级部门风险提示</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormTextArea name="tzfFx" placeholder="自动同步，无需填写" fieldProps={{ rows: 4, disabled: true }} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目签约协议招商方</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormText name="zsf" rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目签约协议投资方</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormText name="tzf" rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目签约协议投资地址</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormText name="tzdz" rules={[{ required: true }]} fieldProps={{ style: { width: '100%' } }} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>项目签约协议附则</div>
                            <div style={gridStyles.contentLast}>
                                <div style={{ border: '1px solid #d9d9d9', borderRadius: '2px', padding: '16px' }}>
                                    {fzList.map((item, index) => (
                                        <div key={index} style={{ marginBottom: 8 }}>
                                            {index + 1}、{item}
                                        </div>
                                    ))}
                                    <ProFormTextArea
                                        name="new_fz"
                                        placeholder="请输入项目签约协议附则"
                                        fieldProps={{
                                            value: fzInput,
                                            onChange: (e) => setFzInput(e.target.value),
                                            autoSize: { minRows: 3, maxRows: 6 },
                                        }}
                                        noStyle
                                    />
                                    <Button type="primary" onClick={addFz} style={{ marginTop: 8, backgroundColor: '#00bfa5', borderColor: '#00bfa5' }}>添加附则</Button>
                                </div>
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}><span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>佐证材料</div>
                            <div style={{ ...gridStyles.contentLast, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {renderUploadLinks(
                                        supportUploadFileList,
                                        (file) => setSupportUploadFileList((prev) => prev.filter((item) => item.uid !== file.uid)),
                                        true,
                                    )}
                                </div>
                                <Space>
                                    <Button type="primary" onClick={handleGenerateAgreement} style={{ backgroundColor: '#00bfa5', borderColor: '#00bfa5' }}>生成协议</Button>
                                    <Upload {...supportUploadProps}>
                                        <Button type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#00bfa5', borderColor: '#00bfa5' }}>上传文件</Button>
                                    </Upload>
                                </Space>
                            </div>
                        </div>
            </div>
        </ModalForm>

        {/* 转共享 弹窗 */}
        <ModalForm
            title="转共享项目"
            open={toShareModalVisible}
            onOpenChange={setToShareModalVisible}
            onFinish={handleToShare}
            initialValues={currentRecord}
            width={900}
            modalProps={{ destroyOnClose: true }}
        >
            <div style={{ padding: '4px 0 12px' }}>
                <div style={{ marginBottom: 8, display: 'flex' }}>
                    <div style={{ width: 120, color: 'rgba(0, 0, 0, 0.88)', fontWeight: 500 }}>投资方名称:</div>
                    <div>{currentRecord?.investor || '-'}</div>
                </div>
                <div style={{ marginBottom: 8, display: 'flex' }}>
                    <div style={{ width: 120, color: 'rgba(0, 0, 0, 0.88)', fontWeight: 500 }}>项目名称:</div>
                    <div>{currentRecord?.name || '-'}</div>
                </div>
                <div style={{ marginBottom: 8, display: 'flex' }}>
                    <div style={{ width: 120, color: 'rgba(0, 0, 0, 0.88)', fontWeight: 500 }}>项目类别:</div>
                    <div>{currentRecord?.projectCategory || '-'}</div>
                </div>
                <div style={{ marginBottom: 8, display: 'flex' }}>
                    <div style={{ width: 120, color: 'rgba(0, 0, 0, 0.88)', fontWeight: 500 }}>投资规模:</div>
                    <div>{currentRecord?.investmentAmount ? `${currentRecord.investmentAmount}亿` : '-'}</div>
                </div>
                <div style={{ marginBottom: 8, display: 'flex' }}>
                    <div style={{ width: 120, color: 'rgba(0, 0, 0, 0.88)', fontWeight: 500 }}>项目内容:</div>
                    <div style={{ flex: 1 }}>{currentRecord?.projectContent || '-'}</div>
                </div>
                <div style={{ marginBottom: 16, display: 'flex' }}>
                    <div style={{ width: 120, color: 'rgba(0, 0, 0, 0.88)', fontWeight: 500 }}>洽谈进度:</div>
                    <div>{currentRecord?.negotiationProgress || '-'}</div>
                </div>
            </div>

            <div style={gridStyles.container}>
                <div style={gridStyles.row}>
                    <div style={gridStyles.label}>
                        <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>放弃原因
                    </div>
                    <div style={gridStyles.contentLast}>
                        <ProFormTextArea
                            name="giveUpReason"
                            placeholder="请输入放弃原因"
                            rules={[{ required: true, message: '请输入放弃原因' }]}
                            fieldProps={{ 
                                rows: 5,
                                maxLength: 500,
                                showCount: true,
                            }}
                            noStyle
                        />
                    </div>
                </div>
            </div>
        </ModalForm>
      </div>
    </PageContainer>
  );
};

export default ProjectManage9;
