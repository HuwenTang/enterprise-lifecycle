import { Button, Form, Input, message, Modal, Pagination, Radio, Space, Table, Tooltip, Select, TreeSelect, Row, Col, Card, Tabs, Descriptions, Timeline, Upload, Divider, DatePicker } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useState, useRef, CSSProperties, useMemo } from 'react';
import { useNavigate, useSearchParams, request, useModel } from '@umijs/max';
import dayjs from 'dayjs';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined, FileTextOutlined, HistoryOutlined, CheckCircleOutlined, DollarOutlined, LinkOutlined } from '@ant-design/icons';
import { ModalForm, ProFormGroup, ProFormText, ProFormSelect, ProFormRadio, ProFormDigit, ProFormDatePicker, ProFormTextArea, ProFormDependency, ProFormTreeSelect } from '@ant-design/pro-components';
import { usePersistedMoreSearch } from '@/hooks/usePersistedMoreSearch';
import { systemApi } from '@/services/api';
import fileConfig from '../../../config/fileConfig';

const { RangePicker } = DatePicker;

// 模拟旧系统 API 路径
const API_PREFIX = '/prime-api/prime';

const defaultReceivedMoneyRows = [{ key: '1', date: '', money: '' }];

const kcProjectTypeOptions = [
  '知识产权类',
  '高层次人才类',
  '科技计划或大赛类',
  '风险投资类',
  '省市产研院类',
  '重大创新平台类',
];

const getKcProofMessage = (kcProjectType?: string) => {
  if (kcProjectType === '知识产权类') return '请上传投资企业专利证书或受理通知书等证明材料';
  if (kcProjectType === '高层次人才类') return '请上传人才学历、职称、获奖等证明材料';
  if (kcProjectType === '科技计划或大赛类') return '请上传计划项目立项或大赛获奖文件等证明材料';
  if (kcProjectType === '风险投资类') return '请上传投资协议等证明材料';
  if (kcProjectType === '省市产研院类') return '请上传签约协议';
  if (kcProjectType === '重大创新平台类') return '请上传合作共建协议等证明材料';
  return '';
};

const createEmptyProgressUploads = () => ({
  register: [] as string[],
  beian: [] as string[],
  approval: [] as string[],
  beginning: [] as string[],
  end: [] as string[],
});

const investorTypeOptions = [
  { label: '央企', value: '10' },
  { label: '民营巨头', value: '20' },
  { label: '世界500强或跨国公司', value: '30' },
  { label: '其它', value: '40' },
];

const defaultFzItems = [
  '本协议与国家法律、法规相悖的，按国家法律、法规执行。',
  '如因履行本协议发生纠纷而引起诉讼的，由甲方所在地人民法院管辖。',
  '本协议书一式四份，甲方执存两份，乙方执存两份，本协议自双方签字盖章之日起生效。',
];

const defaultSignedProjectFormValues = {};

const ProjectManage10 = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [progressForm] = Form.useForm();
  const [onlineApprovalSearchForm] = Form.useForm();
  const [engineeringApprovalSearchForm] = Form.useForm();
  const [abnormalBindForm] = Form.useForm();
  const navigate = useNavigate();
  const { initialState } = useModel('@@initialState');
  const [searchParams, setSearchParams] = useSearchParams();
  const detailRequestSeqRef = useRef(0);
  const userDeptScope = useMemo(() => {
    const currentUser = (initialState as any)?.currentUser || {};
    try {
      const raw = localStorage.getItem('USER_INFO');
      const parsed = raw ? JSON.parse(raw) : {};
      const userInfo = Object.keys(currentUser).length ? currentUser : parsed;
      return {
        districtCode: userInfo?.district_code ? String(userInfo.district_code) : (userInfo?.districtCode ? String(userInfo.districtCode) : undefined),
        zoneCode: userInfo?.zone_code ? String(userInfo.zone_code) : (userInfo?.zoneCode ? String(userInfo.zoneCode) : undefined),
        townCode: userInfo?.town_code ? String(userInfo.town_code) : (userInfo?.townCode ? String(userInfo.townCode) : undefined),
      };
    } catch (error) {
      return {
        districtCode: undefined,
        zoneCode: undefined,
        townCode: undefined,
      };
    }
  }, [initialState]);

  const initialCurrent = parseInt(searchParams.get('page') || '1', 10);
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  const [pagination, setPagination] = useState({
    current: initialCurrent,
    pageSize: initialPageSize,
    total: 0,
  });

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [showMoreSearch, setShowMoreSearchPersist] = usePersistedMoreSearch();

  // 弹窗状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [onlineApprovalModalVisible, setOnlineApprovalModalVisible] = useState(false);
  const [onlineApprovalDetailVisible, setOnlineApprovalDetailVisible] = useState(false);
  const [engineeringApprovalModalVisible, setEngineeringApprovalModalVisible] = useState(false);
  const [engineeringApprovalDetailVisible, setEngineeringApprovalDetailVisible] = useState(false);
  const [abnormalBindModalVisible, setAbnormalBindModalVisible] = useState(false);
  const [abnormalBindType, setAbnormalBindType] = useState<'online' | 'engineering'>('online');
  const [moneyModalVisible, setMoneyModalVisible] = useState(false);
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [assessmentModalVisible, setAssessmentModalVisible] = useState(false);
  const [assessmentData, setAssessmentData] = useState<any[]>([]);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [onlineApprovalDetailRecord, setOnlineApprovalDetailRecord] = useState<any>(null);
  const [engineeringApprovalDetailRecord, setEngineeringApprovalDetailRecord] = useState<any>(null);
  const [progressTabKey, setProgressTabKey] = useState('1');
  const [receivedMoneyRows, setReceivedMoneyRows] = useState<Array<{ key: string; date?: string; money?: string }>>([
    { key: '1', date: '', money: '' },
  ]);
  const [progressDraftMap, setProgressDraftMap] = useState<Record<string, any>>({});
  const [progressUploadsMap, setProgressUploadsMap] = useState<Record<string, ReturnType<typeof createEmptyProgressUploads>>>({});
  const [registerUploadFileList, setRegisterUploadFileList] = useState<UploadFile[]>([]);
  const [beianUploadFileList, setBeianUploadFileList] = useState<UploadFile[]>([]);
  const [approvalUploadFileList, setApprovalUploadFileList] = useState<UploadFile[]>([]);
  const [beginningUploadFileList, setBeginningUploadFileList] = useState<UploadFile[]>([]);
  const [beginningRcUploadFileList, setBeginningRcUploadFileList] = useState<UploadFile[]>([]);
  const [beginningKcUploadFileList, setBeginningKcUploadFileList] = useState<UploadFile[]>([]);
  const [endUploadFileList, setEndUploadFileList] = useState<UploadFile[]>([]);
  const [onlineApprovalMap, setOnlineApprovalMap] = useState<Record<string, any[]>>({});
  const [engineeringApprovalMap, setEngineeringApprovalMap] = useState<Record<string, any[]>>({});
  const [onlineApprovalList, setOnlineApprovalList] = useState<any[]>([]);
  const [onlineApprovalLoading, setOnlineApprovalLoading] = useState(false);
  const [onlineApprovalPagination, setOnlineApprovalPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [engineeringApprovalList, setEngineeringApprovalList] = useState<any[]>([]);
  const [engineeringApprovalLoading, setEngineeringApprovalLoading] = useState(false);
  const [engineeringApprovalPagination, setEngineeringApprovalPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [receivedMoneyMap, setReceivedMoneyMap] = useState<Record<string, Array<{ key: string; date?: string; money?: string }>>>({});
  const [reviewUploadFileList, setReviewUploadFileList] = useState<UploadFile[]>([]);
  const [supportUploadFileList, setSupportUploadFileList] = useState<UploadFile[]>([]);
  const [kcUploadFileList, setKcUploadFileList] = useState<UploadFile[]>([]);

  // 字典数据状态 (模拟)
  const [districts, setDistricts] = useState<{label: string, value: string}[]>([]);
  const [zones, setZones] = useState<{label: string, value: string}[]>([]); // 搜索表单园区（根据市区联动）
  const [towns, setTowns] = useState<{label: string, value: string}[]>([]); // 搜索表单镇街（根据园区联动）
  const [searchZoneSelected, setSearchZoneSelected] = useState(false); // 标记搜索表单的园区是否已选择
  const [editZones, setEditZones] = useState<{label: string, value: string}[]>([]); // 编辑弹窗园区
  const [editTowns, setEditTowns] = useState<{label: string, value: string}[]>([]); // 编辑弹窗镇街
  
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
  
  const [projTypeTreeData, setProjTypeTreeData] = useState<any[]>([]);
  const [industryFirstOptions, setIndustryFirstOptions] = useState<{ label: string; value: string }[]>([]);
  const [industryTreeData, setIndustryTreeData] = useState<any[]>([]);
  const [projSourceOptions, setProjSourceOptions] = useState<{ label: string; value: string }[]>([]);
  const [projSourceLoading, setProjSourceLoading] = useState(false);
  
  // 投资方注册地选项（根据项目类别动态获取）
  const [investorPlaceOptions, setInvestorPlaceOptions] = useState<{ label: string; value: string }[]>([]);
  const [foreignInvestorPlaceOptions, setForeignInvestorPlaceOptions] = useState<{ label: string; value: string }[]>([]);

  // 附则列表
  const [fzList, setFzList] = useState<string[]>([
      ...defaultFzItems,
  ]);
  const [fzInput, setFzInput] = useState('');
  
  // 权限控制状态
  const [userPermissionLevel, setUserPermissionLevel] = useState<number | null>(null);
  const [isReadOnlyUser, setIsReadOnlyUser] = useState<boolean>(false); // 是否为只读用户（只能查看项目进度）
  
  // 驻外机构角色相关状态
  const [isExternalOffice, setIsExternalOffice] = useState(false); // 是否为驻外机构角色
  const [externalOfficeInvestorPlace, setExternalOfficeInvestorPlace] = useState<string | undefined>(undefined); // 驻外机构对应的投资方注册地code
  const isEditMode = Boolean(currentRecord?._id || currentRecord?.id);
  const addLocationLocked = {
    district: Boolean(userDeptScope.districtCode && userDeptScope.districtCode !== '*'),
    zone: Boolean(userDeptScope.zoneCode && userDeptScope.zoneCode !== '*'),
    town: Boolean(userDeptScope.townCode && userDeptScope.townCode !== '*'),
  };

  // 统一定义网格表单的样式
  const gridStyles = {
      container: { border: '1px solid #f0f0f0', borderBottom: 'none', marginBottom: 24 },
      row: { borderBottom: '1px solid #f0f0f0', display: 'flex' as const },
      label: {
          width: '160px',
          backgroundColor: '#fafafa',
          padding: '16px',
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          textAlign: 'right' as const,
          fontWeight: 500
      },
      content: { flex: 1, padding: '16px', borderRight: '1px solid #f0f0f0' },
      contentLast: { flex: 1, padding: '16px' }
  };

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

  const addReceivedMoneyRow = () => {
    setReceivedMoneyRows((prev) => [...prev, { key: `${Date.now()}`, date: '', money: '' }]);
  };

  const removeReceivedMoneyRow = () => {
    setReceivedMoneyRows((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const updateReceivedMoneyRow = (key: string, field: 'date' | 'money', value: string) => {
    setReceivedMoneyRows((prev) =>
      prev.map((item) => (item.key === key ? { ...item, [field]: value } : item)),
    );
  };

  const totalReceivedMoney = receivedMoneyRows.reduce((sum, item) => sum + Number(item.money || 0), 0);

  const toDayjsValue = (value?: string) => {
    if (!value) {
      return undefined;
    }
    return dayjs.isDayjs(value) ? value : dayjs(value);
  };

  const formatDateValue = (value: any) => {
    if (!value) {
      return '';
    }
    return dayjs.isDayjs(value) ? value.format('YYYY-MM-DD') : dayjs(value).format('YYYY-MM-DD');
  };

  const buildPaginationParams = (page = 1, pageSize = 10) => ({
    page,
    size: pageSize,
    current: page,
    pageSize,
    pageNum: page,
    limit: pageSize,
  });

  const parsePaginationResult = (
    response: any,
    fallbackPage = 1,
    fallbackPageSize = 10,
  ) => {
    const root = response || {};
    const data = root?.data || {};
    const current =
      root?.page
      ?? root?.current
      ?? root?.pageNum
      ?? data?.page
      ?? data?.current
      ?? data?.pageNum
      ?? fallbackPage;
    const pageSize =
      root?.size
      ?? root?.pageSize
      ?? root?.limit
      ?? data?.size
      ?? data?.pageSize
      ?? data?.limit
      ?? fallbackPageSize;
    const total =
      root?.total
      ?? root?.count
      ?? root?.totalCount
      ?? data?.total
      ?? data?.count
      ?? data?.totalCount
      ?? 0;

    return {
      current: Number(current) || fallbackPage,
      pageSize: Number(pageSize) || fallbackPageSize,
      total: Number(total) || 0,
    };
  };

  const buildOpenapiSearchParams = (params?: Record<string, any>) => {
    const source = params || {};
    const cleaned = Object.entries(source).reduce<Record<string, any>>((result, [key, value]) => {
      if (value === undefined || value === null || value === '') {
        return result;
      }
      result[key] = value;
      return result;
    }, {});

    if (cleaned.project_code && !cleaned.projectCode) {
      cleaned.projectCode = cleaned.project_code;
    }
    if (cleaned.project_name && !cleaned.projectName) {
      cleaned.projectName = cleaned.project_name;
    }
    if (cleaned.total_investment && !cleaned.totalInvestment) {
      cleaned.totalInvestment = cleaned.total_investment;
    }
    if (cleaned.legal_company_contact_name && !cleaned.legalCompanyContactName) {
      cleaned.legalCompanyContactName = cleaned.legal_company_contact_name;
    }
    if (cleaned.legal_company_contact_phone && !cleaned.legalCompanyContactPhone) {
      cleaned.legalCompanyContactPhone = cleaned.legal_company_contact_phone;
    }

    delete cleaned.project_code;
    delete cleaned.project_name;
    delete cleaned.total_investment;
    delete cleaned.legal_company_contact_name;
    delete cleaned.legal_company_contact_phone;

    return cleaned;
  };

  const flattenTreeNodes = (nodes: any[] = []): any[] =>
    (nodes || []).reduce<any[]>((result, node) => {
      result.push(node);
      if (Array.isArray(node?.children) && node.children.length) {
        result.push(...flattenTreeNodes(node.children));
      }
      return result;
    }, []);

  const normalizeProjTypeText = (value: any) => String(value ?? '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/^[0-9]+(?:\.[0-9]+)*-?/, '');

  const resolveProjTypeTreeValue = (rawValue: any, treeData: any[] = []) => {
    if (rawValue === undefined || rawValue === null || rawValue === '') {
      return undefined;
    }
    const raw = String(rawValue);
    const allNodes = flattenTreeNodes(treeData);
    const leafNodes = allNodes.filter((item) => !item?.children || item.children.length === 0);
    const valueMatched = leafNodes.find((item) => String(item?.value ?? '') === raw);
    if (valueMatched) {
      return String(valueMatched.value);
    }
    const normalizedRaw = normalizeProjTypeText(raw);
    const titleMatched = leafNodes.find((item) => {
      const title = String(item?.title ?? '');
      return title === raw || normalizeProjTypeText(title) === normalizedRaw;
    });
    return titleMatched ? String(titleMatched.value) : undefined;
  };

  const resolveIndustryFirstName = (industryFirstCode?: string) => {
    if (!industryFirstCode) {
      return '';
    }
    const code = String(industryFirstCode);
    return industryFirstOptions.find((item) => String(item.value) === code)?.label || '';
  };

  const normalizeIndustryText = (value: any) => String(value ?? '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/^[A-Z][0-9]*(?:\.[0-9]+)*-?/, '');

  const resolveIndustryTreeValue = (rawValue: any, treeData: any[] = []) => {
    if (rawValue === undefined || rawValue === null || rawValue === '') {
      return undefined;
    }
    const raw = String(rawValue).trim();
    const allNodes = flattenTreeNodes(treeData);
    const leafNodes = allNodes.filter((item) => !item?.children || item.children.length === 0);
    const valueMatched = leafNodes.find((item) => String(item?.value ?? '') === raw);
    if (valueMatched) {
      return String(valueMatched.value);
    }
    const normalizedRaw = normalizeIndustryText(raw);
    const titleMatched = leafNodes.find((item) => {
      const title = String(item?.title ?? '').trim();
      const name = String(item?.industryName ?? '').trim();
      return title === raw || name === raw || normalizeIndustryText(title) === normalizedRaw || normalizeIndustryText(name) === normalizedRaw;
    });
    return titleMatched ? String(titleMatched.value) : undefined;
  };

  const resolveIndustryName = (industryCode?: string) => {
    if (!industryCode) {
      return '';
    }
    const code = String(industryCode);
    const allNodes = flattenTreeNodes(industryTreeData);
    const target = allNodes.find((item) => String(item?.value ?? '') === code);
    if (!target) {
      return code;
    }
    const titleText = String(target?.title ?? '').trim();
    return titleText || code;
  };

  const resolveProjTypeName = (projTypeCode?: string) => {
    if (!projTypeCode) {
      return '';
    }
    const code = String(projTypeCode);
    const allNodes = flattenTreeNodes(projTypeTreeData);
    const target = allNodes.find((item) => String(item?.value ?? '') === code);
    if (!target) {
      return code;
    }
    const titleText = String(target?.title ?? '').trim();
    return titleText || code;
  };

  const getImageCateCode = (item: any) => String(item?.cateCode ?? item?.cate_code ?? '');

  const buildFileDownloadUrl = (rawPath?: string) => {
    const path = String(rawPath || '').trim();
    if (!path) {
      return '';
    }
    // 直接返回路径（已经是完整URL或同域路径）
    return path;
  };

  const buildUploadFileListByCateCodes = (images: any[] = [], cateCodes: string[]) =>
    images
      .filter((item) => cateCodes.includes(getImageCateCode(item)))
      .map((item, index) => {
        let filePath = item?.filePath || item?.filepath || item?.path || item?.file_path || item?.url || '';
        
        // 判断创建时间是否在2026年4月13日之前
        const createTime = item?.createTime || item?.create_time || item?.createdAt || item?.created_at;
        if (createTime) {
          const createDate = new Date(createTime);
          const cutoffDate = new Date('2026-04-13');
          if (createDate < cutoffDate) {
            // 2026年4月13日之前的附件使用旧地址
            // 从 uploadDetail 开始截取到 ? 之前的路径
            const match = filePath.match(/uploadDetail\/[^?]+/);
            if (match) {
              filePath = fileConfig.LEGACY_FILE_BASE_URL + match[0];
            }
          }
        }
        
        const name = item?.name || item?._name || filePath.split('/').pop()?.split('?')[0] || `文件${index + 1}`;
        return {
          uid: `${getImageCateCode(item)}-${item?.id || item?._id || index}`,
          name,
          status: 'done' as const,
          url: filePath,
          response: [{ name, filePath, cateCode: getImageCateCode(item), cate_code: getImageCateCode(item) }],
        };
      });

  const buildUploadFileList = (files: any[] = []) =>
    files.map((item, index) => {
      let filePath = item?.filePath || item?.filepath || item?.path || item?.file_path || item?.url || '';
      
      // 判断创建时间是否在2026年4月13日之前
      const createTime = item?.createTime || item?.create_time || item?.createdAt || item?.created_at;
      if (createTime) {
        const createDate = new Date(createTime);
        const cutoffDate = new Date('2026-04-13');
        if (createDate < cutoffDate) {
          // 2026年4月13日之前的附件使用旧地址
          // 从 uploadDetail 开始截取到 ? 之前的路径
          const match = filePath.match(/uploadDetail\/[^?]+/);
          if (match) {
            filePath = fileConfig.LEGACY_FILE_BASE_URL + match[0];
          }
        }
      }
      
      const name = item?.name || item?._name || filePath.split('/').pop()?.split('?')[0] || `文件${index + 1}`;
      return {
        uid: `${item?.id || item?._id || index}`,
        name,
        status: 'done' as const,
        url: filePath,
        response: [{ name, filePath, cateCode: getImageCateCode(item), cate_code: getImageCateCode(item) }],
      };
    });

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

  const normalizeSignedRecord = (record: any) => ({
    ...record,
    _id: record?._id || record?.id,
    _name: record?._name || record?.name,
    _code: record?._code || record?.code,
    p_type: record?.p_type ?? record?.ptype,
    proj_type: record?.proj_type ?? record?.projType ?? record?.projtype,
    invest_money: record?.invest_money ?? record?.investMoney,
    foreign_money: record?.foreign_money ?? record?.foreignMoney,
    district_code: record?.district_code ?? record?.districtCode,
    zone_code: record?.zone_code ?? record?.zoneCode,
    zone_name: record?.zone_name ?? record?.zoneName,
    town_code: record?.town_code ?? record?.townCode,
    town_name: record?.town_name ?? record?.townName,
    industry_first_code: record?.industry_first_code ?? record?.industryFirstCode,
    industry_name: record?.industry_name ?? record?.industryName,
    industry_code: record?.industry_code ?? record?.industryCode,
    b_industry: record?.b_industry ?? record?.bIndustry ?? record?.bindustry,
    investor_type: record?.investor_type ?? record?.investorType,
    investor_place: record?.investor_place ?? record?.investorPlace,
    is_listed: record?.is_listed ?? record?.isListed,
    is_gxjs: record?.is_gxjs ?? record?.isGxjs ?? record?.is_gx ?? record?.isGx,
    has_municipal_capital: record?.has_municipal_capital ?? record?.hasMunicipalCapital ?? record?.isSwzjtr ?? record?.is_swzjtr,
    equity_ratio: record?.equity_ratio ?? record?.equityRatio ?? record?.gqbl ?? record?.fixed_percent ?? record?.fixedPercent,
    is_rzxq: record?.is_rzxq ?? record?.isRzxq,
    rz_money: record?.rz_money ?? record?.rzMoney,
    is_kc_proj: record?.is_kc_proj ?? record?.isKcProj,
    kc_proj_tj: record?.kc_proj_tj ?? record?.kcProjTj,
    kc_proj_type: record?.kc_proj_type ?? record?.kcProjType,
    is_qflp: record?.is_qflp ?? record?.isQflp,
    signed_date: record?.signed_date ?? record?.signedDate,
    signed_stat_date: record?.signed_stat_date ?? record?.signedStatDate,
    plan_start_date: record?.plan_start_date ?? record?.planStartDate,
    plan_end_date: record?.plan_end_date ?? record?.planEndDate,
    zhuce_money: record?.zhuce_money ?? record?.zhuceMoney ?? record?.reg_money ?? record?.regMoney,
    _desc: record?._desc ?? record?.desc,
    cg_remark: record?.cg_remark ?? record?.cgRemark ?? record?.cxqk,
    cy_gl: record?.cy_gl ?? record?.cyGl,
    check_stat_date: record?.check_stat_date ?? record?.checkStatDate,
    u_code: record?.u_code ?? record?.ucode,
    company_name: record?.company_name ?? record?.companyName,
    reg_money: record?.reg_money ?? record?.regMoney,
    reg_date: record?.reg_date ?? record?.regDate,
    reg_stat_date: record?.reg_stat_date ?? record?.regStatDate,
    check_status: record?.check_status ?? record?.checkStatus,
    start_date_commit: record?.start_date_commit ?? record?.startDateCommit,
    complete_date: record?.complete_date ?? record?.completeDate,
    proj_level: record?.proj_level ?? record?.projLevel,
    mujun_tax: record?.mujun_tax ?? record?.mujunTax,
    main_customer: record?.main_customer ?? record?.mainCustomer,
    project_material: record?.project_material ?? record?.projectMaterial,
    main_process: record?.main_process ?? record?.mainProcess,
    project_address: record?.project_address ?? record?.projectAddress,
    sq_land_area: record?.sq_land_area ?? record?.sqLandArea,
    zl_land_area: record?.zl_land_area ?? record?.zlLandArea,
    zs_land_area: record?.zs_land_area ?? record?.zsLandArea ?? record?.zl_land_area_zs ?? record?.zlLandAreaZs,
    plan_total1: record?.plan_total1 ?? record?.planTotal1 ?? record?.plan_total ?? record?.planTotal,
    plan_invest_strong: record?.plan_invest_strong ?? record?.planInvestStrong ?? record?.plan_intensity ?? record?.planIntensity ?? record?.invest_level ?? record?.investLevel,
    is_gx: record?.is_gx ?? record?.isGx,
    is_gjs: record?.is_gjs ?? record?.isGjs,
    is_gyzl: record?.is_gyzl ?? record?.isGyzl,
    yq_kpxs: record?.yq_kpxs ?? record?.yqKpxs,
    yq_cz1: record?.yq_cz1 ?? record?.yqCz1 ?? record?.yq_cz ?? record?.yqCz,
    yq_ss: record?.yq_ss ?? record?.yqSs,
    yq_worker: record?.yq_worker ?? record?.yqWorker,
    fixed_percent: record?.fixed_percent ?? record?.fixedPercent,
    invest_level: record?.invest_level ?? record?.investLevel,
    yq_mjtax: record?.yq_mjtax ?? record?.yqMjtax,
    is_waterpf: record?.is_waterpf ?? record?.isWaterpf,
    total_use: record?.total_use ?? record?.totalUse,
    is_wuran: record?.is_wuran ?? record?.isWuran,
    is_yanfa: record?.is_yanfa ?? record?.isYanfa,
    is_zhuanli: record?.is_zhuanli ?? record?.isZhuanli,
    is_important: record?.is_important ?? record?.isImportant,
    is_zsh: record?.is_zsh ?? record?.isZsh,
    zsh_name: record?.zsh_name ?? record?.zshName,
    yj_year: record?.yj_year ?? record?.yjYear,
    fixed_invest: record?.fixed_invest ?? record?.fixedInvest,
    b_resource: record?.b_resource ?? record?.bResource ?? record?.bresource,
    sjjg_name: record?.sjjg_name ?? record?.sjjgName,
    qy_linker: record?.qy_linker ?? record?.qyLinker,
    qy_phone: record?.qy_phone ?? record?.qyPhone,
    import_proj_type: record?.import_proj_type ?? record?.importProjType,
    is_import_proj: record?.is_import_proj ?? record?.isImportProj,
    yq_kpxs1: record?.yq_kpxs1 ?? record?.yqKpxs1,
    yq_kpxs2: record?.yq_kpxs2 ?? record?.yqKpxs2,
    yq_kpxs3: record?.yq_kpxs3 ?? record?.yqKpxs3,
    yq_ss1: record?.yq_ss1 ?? record?.yqSs1,
    yq_ss2: record?.yq_ss2 ?? record?.yqSs2,
    yq_ss3: record?.yq_ss3 ?? record?.yqSs3,
    yq_mjtax1: record?.yq_mjtax1 ?? record?.yqMjtax1,
    yq_mjtax2: record?.yq_mjtax2 ?? record?.yqMjtax2,
    yq_mjtax3: record?.yq_mjtax3 ?? record?.yqMjtax3,
    pgStatus: record?.pgStatus ?? record?.pg_status,
  });

  const getRecordValue = (record: any, keys: string[]) => {
    for (const key of keys) {
      const value = record?.[key];
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }
    return undefined;
  };

  const hasValue = (value: any) => {
    if (value === undefined || value === null) {
      return false;
    }
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    if (dayjs.isDayjs(value)) {
      return value.isValid();
    }
    return true;
  };

  const normalizeBooleanLikeValue = (value: any) => {
    if (value === undefined || value === null || value === '') {
      return '-';
    }
    if (typeof value === 'boolean') {
      return value ? '是' : '否';
    }
    if (['1', 1, 'true', 'TRUE', 'True', '是', 'Y', 'y', 'yes', 'YES'].includes(value)) {
      return '是';
    }
    if (['0', 0, 'false', 'FALSE', 'False', '否', 'N', 'n', 'no', 'NO'].includes(value)) {
      return '否';
    }
    return String(value);
  };

  const toStringEnumValue = (value: any) => {
    if (value === undefined || value === null || value === '') {
      return value;
    }
    return String(value);
  };

  const toYesNoValue = (value: any) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (['1', 1, true, 'true', 'TRUE', '是'].includes(value)) {
      return '是';
    }
    if (['0', 0, '2', 2, false, 'false', 'FALSE', '否'].includes(value)) {
      return '否';
    }
    return String(value);
  };

  const normalizeSignedFormValues = (values: any = {}) => {
    const next = { ...values };

    const enumFields = [
      'p_type',
      'proj_type',
      'b_industry',
      'investor_type',
      'investor_place',
      'is_listed',
      'b_resource',
      'sjjg_name',
      'district_code',
      'zone_code',
      'town_code',
      'industry_first_code',
    ];
    enumFields.forEach((field) => {
      next[field] = toStringEnumValue(next[field]);
    });

    // 文本值兜底映射，避免接口直接返回中文导致 Radio/Select 无法命中
    if (next.b_industry === '服务业') next.b_industry = '1';
    if (next.b_industry === '工业') next.b_industry = '2';
    if (next.b_resource === '自行接洽') next.b_resource = '1';
    if (next.b_resource === '市级机关推荐') next.b_resource = '2';
    if (next.is_listed === '是' || next.is_listed === 1 || next.is_listed === '1') next.is_listed = '1';
    if (next.is_listed === '否' || next.is_listed === 0 || next.is_listed === '0' || next.is_listed === '2') next.is_listed = '2';

    const yesNoFields = [
      'is_gxjs',
      'has_municipal_capital',
      'is_rzxq',
      'is_kc_proj',
      'is_qflp',
      'kg_is_zkc',
      'jg_is_zkc',
      'kg_is_qflp',
    ];
    yesNoFields.forEach((field) => {
      const v = toYesNoValue(next[field]);
      if (v !== undefined) {
        next[field] = v;
      }
    });

    return next;
  };

  const normalizeOnlineApprovalRecord = (record: any) => ({
    ...record,
    project_code: getRecordValue(record, ['project_code', 'projectCode', 'code']),
    project_name: getRecordValue(record, ['project_name', 'projectName', 'name']),
    approval_type_label: getRecordValue(record, ['approval_type_label', 'approvalTypeLabel']),
    project_type_label: getRecordValue(record, ['project_type_label', 'projectTypeLabel', 'approval_type_label', 'approvalTypeLabel']),
    construction_scale_and_content: getRecordValue(record, ['construction_scale_and_content', 'constructionScaleAndContent', 'construction_content', 'constructionContent']),
    total_investment: getRecordValue(record, ['total_investment', 'totalInvestment']),
    legal_company_contact_name: getRecordValue(record, ['legal_company_contact_name', 'legalCompanyContactName', 'legal_company_contactName']),
    legal_company_contact_phone: getRecordValue(record, ['legal_company_contact_phone', 'legalCompanyContactPhone']),
    application_company_contact_name: getRecordValue(record, ['application_company_contact_name', 'applicationCompanyContactName', 'application_company_linker', 'applicationCompanyLinker']),
    application_company_contact_phone: getRecordValue(record, ['application_company_contact_phone', 'applicationCompanyContactPhone', 'application_company_phone', 'applicationCompanyPhone']),
    filing_catalog: getRecordValue(record, ['filing_catalog', 'filingCatalog']),
    is_supplementary_project: normalizeBooleanLikeValue(getRecordValue(record, ['is_supplementary_project', 'isSupplementaryProject'])),
    application_time: getRecordValue(record, ['application_time', 'applicationTime', 'createTime']),
    parent_project_name: getRecordValue(record, ['parent_project_name', 'parentProjectName', 'main_project_name', 'mainProjectName']),
    filing_catalog_category: getRecordValue(record, ['filing_catalog_category', 'filingCatalogCategory']),
    planned_start_year: getRecordValue(record, ['planned_start_year', 'plannedStartYear']),
    project_attributes: getRecordValue(record, ['project_attributes', 'projectAttributes']),
    national_industry_standard: getRecordValue(record, ['national_industry_standard', 'nationalIndustryStandard']),
    planned_end_year: getRecordValue(record, ['planned_end_year', 'plannedEndYear']),
    management_industry: getRecordValue(record, ['management_industry', 'managementIndustry']),
    national_industry_code: getRecordValue(record, ['national_industry_code', 'nationalIndustryCode']),
    construction_location: getRecordValue(record, ['construction_location', 'constructionLocation', 'project_address', 'projectAddress']),
    total_investment_desc: getRecordValue(record, ['total_investment_desc', 'totalInvestmentDesc']),
    land_area: getRecordValue(record, ['land_area', 'landArea']),
    new_land_area: getRecordValue(record, ['new_land_area', 'newLandArea']),
    agricultural_land_area: getRecordValue(record, ['agricultural_land_area', 'agriculturalLandArea']),
    project_capital: getRecordValue(record, ['project_capital', 'projectCapital']),
    funding_source: getRecordValue(record, ['funding_source', 'fundingSource']),
    fiscal_funding_source: getRecordValue(record, ['fiscal_funding_source', 'fiscalFundingSource']),
    is_technical_reform_project: normalizeBooleanLikeValue(getRecordValue(record, ['is_technical_reform_project', 'isTechnicalReformProject'])),
    industrial_policy_type: getRecordValue(record, ['industrial_policy_type', 'industrialPolicyType']),
    industry_adjustment_guidance_catalog: getRecordValue(record, ['industry_adjustment_guidance_catalog', 'industryAdjustmentGuidanceCatalog']),
    is_infrastructure_engineering: normalizeBooleanLikeValue(getRecordValue(record, ['is_infrastructure_engineering', 'isInfrastructureEngineering'])),
    agree_to_provide_financing_services: normalizeBooleanLikeValue(getRecordValue(record, ['agree_to_provide_financing_services', 'agreeToProvideFinancingServices'])),
    legal_company: getRecordValue(record, ['legal_company', 'legalCompany']),
    legal_company_registration_type: getRecordValue(record, ['legal_company_registration_type', 'legalCompanyRegistrationType']),
    legal_company_holding_situation: getRecordValue(record, ['legal_company_holding_situation', 'legalCompanyHoldingSituation']),
    is_legal_company_controlling_for_project: normalizeBooleanLikeValue(getRecordValue(record, ['is_legal_company_controlling_for_project', 'isLegalCompanyControllingForProject'])),
    legal_company_document_type: getRecordValue(record, ['legal_company_document_type', 'legalCompanyDocumentType']),
    legal_company_document_number: getRecordValue(record, ['legal_company_document_number', 'legalCompanyDocumentNumber']),
    legal_company_legal_representative: getRecordValue(record, ['legal_company_legal_representative', 'legalCompanyLegalRepresentative']),
    legal_company_contact_email: getRecordValue(record, ['legal_company_contact_email', 'legalCompanyContactEmail']),
    application_company: getRecordValue(record, ['application_company', 'applicationCompany']),
    application_company_registration_type: getRecordValue(record, ['application_company_registration_type', 'applicationCompanyRegistrationType']),
    application_company_holding_situation: getRecordValue(record, ['application_company_holding_situation', 'applicationCompanyHoldingSituation']),
    application_company_document_type: getRecordValue(record, ['application_company_document_type', 'applicationCompanyDocumentType']),
    application_company_document_number: getRecordValue(record, ['application_company_document_number', 'applicationCompanyDocumentNumber']),
  });

  const toCamelCaseKey = (key: string) => key.replace(/_([a-zA-Z])/g, (_, letter) => letter.toUpperCase());

  const camelizeRecord = (record: Record<string, any>) =>
    Object.entries(record || {}).reduce<Record<string, any>>((result, [key, value]) => {
      result[toCamelCaseKey(key)] = value;
      return result;
    }, {});

  const getBoundOnlineApprovalList = (record: any) => {
    if (!record?._id) {
      return [];
    }
    const cached = onlineApprovalMap[record._id];
    if (Array.isArray(cached) && cached.length) {
      return cached.map(normalizeOnlineApprovalRecord);
    }
    const source =
      record?.onlineApprovalList
      || record?.onlineApprovals
      || record?.projectSignedOnlineList
      || record?.tProjectSignedOnlineList
      || record?.onlineList
      || record?.online
      || [];
    return Array.isArray(source) ? source.map(normalizeOnlineApprovalRecord) : [];
  };

  const getBoundEngineeringApprovalList = (record: any) => {
    if (!record?._id) {
      return [];
    }
    const cached = engineeringApprovalMap[record._id];
    if (Array.isArray(cached) && cached.length) {
      return cached.map(normalizeEngineeringApprovalRecord);
    }
    const source =
      record?.engineeringApprovalList
      || record?.engineeringApprovals
      || record?.projectSignedGgList
      || record?.tProjectSignedGgList
      || record?.constructionApprovalList
      || record?.constructionApprovals
      || [];
    return Array.isArray(source) ? source.map(normalizeEngineeringApprovalRecord) : [];
  };

  const normalizeEngineeringApprovalRecord = (record: any) => ({
    ...record,
    project_code: getRecordValue(record, ['project_code', 'projectCode', 'code']),
    project_name: getRecordValue(record, ['project_name', 'projectName', 'name']),
    project_type_label: getRecordValue(record, ['project_type_label', 'projectTypeLabel']),
    construction_content: getRecordValue(record, ['construction_content', 'constructionContent', 'project_content', 'projectContent']),
    total_investment: getRecordValue(record, ['total_investment', 'totalInvestment']),
    legal_company_contact_name: getRecordValue(record, ['legal_company_contact_name', 'legalCompanyContactName', 'legal_company_contactName']),
    legal_company_contact_phone: getRecordValue(record, ['legal_company_contact_phone', 'legalCompanyContactPhone']),
    administrative_division: getRecordValue(record, ['administrative_division', 'administrativeDivision']),
    detailed_address: getRecordValue(record, ['detailed_address', 'detailedAddress']),
    engineering_code: getRecordValue(record, ['engineering_code', 'engineeringCode']),
    approval_department: getRecordValue(record, ['approval_department', 'approvalDepartment']),
    industry_category_label: getRecordValue(record, ['industry_category_label', 'industryCategoryLabel']),
    investment_source_label: getRecordValue(record, ['investment_source_label', 'investmentSourceLabel']),
    approval_type_label: getRecordValue(record, ['approval_type_label', 'approvalTypeLabel']),
    fund_attribute_label: getRecordValue(record, ['fund_attribute_label', 'fundAttributeLabel']),
    construction_nature_label: getRecordValue(record, ['construction_nature_label', 'constructionNatureLabel']),
    project_region_code: getRecordValue(record, ['project_region_code', 'projectRegionCode']),
    project_region: getRecordValue(record, ['project_region', 'projectRegion']),
    build_unit: getRecordValue(record, ['build_unit', 'buildUnit']),
    construction_unit: getRecordValue(record, ['construction_unit', 'constructionUnit']),
    contract_start_date: getRecordValue(record, ['contract_start_date', 'contractStartDate']),
    contract_end_date: getRecordValue(record, ['contract_end_date', 'contractEndDate']),
    project_capital: getRecordValue(record, ['project_capital', 'projectCapital']),
    is_over_one_billion_industrial_project: normalizeBooleanLikeValue(getRecordValue(record, ['is_over_one_billion_industrial_project', 'isOverOneBillionIndustrialProject'])),
    is_concentrated_building_project: normalizeBooleanLikeValue(getRecordValue(record, ['is_concentrated_building_project', 'isConcentratedBuildingProject'])),
    concentrated_builder_name: getRecordValue(record, ['concentrated_builder_name', 'concentratedBuilderName']),
    concentrated_builder_uscc: getRecordValue(record, ['concentrated_builder_uscc', 'concentratedBuilderUscc']),
    concentrated_builder_legal_representative: getRecordValue(record, ['concentrated_builder_legal_representative', 'concentratedBuilderLegalRepresentative']),
    company_type_label: getRecordValue(record, ['company_type_label', 'companyTypeLabel']),
    company_name: getRecordValue(record, ['company_name', 'companyName']),
    uscc: getRecordValue(record, ['uscc']),
    legal_representative: getRecordValue(record, ['legal_representative', 'legalRepresentative']),
    contact_phone: getRecordValue(record, ['contact_phone', 'contactPhone']),
    is_design: normalizeBooleanLikeValue(getRecordValue(record, ['is_design', 'isDesign'])),
    is_completed_evaluation: normalizeBooleanLikeValue(getRecordValue(record, ['is_completed_evaluation', 'isCompletedEvaluation'])),
    land_area_m2: getRecordValue(record, ['land_area_m2', 'landAreaM2', 'land_area']),
    new_land_area_m2: getRecordValue(record, ['new_land_area_m2', 'newLandAreaM2', 'new_land_area']),
    land_obtain_mode: getRecordValue(record, ['land_obtain_mode', 'landObtainMode']),
    construction_nature: getRecordValue(record, ['construction_nature', 'constructionNature']),
    construction_type: getRecordValue(record, ['construction_type', 'constructionType']),
    total_construction_area: getRecordValue(record, ['total_construction_area', 'totalConstructionArea']),
    planned_start_time: getRecordValue(record, ['planned_start_time', 'plannedStartTime']),
    planned_completion_time: getRecordValue(record, ['planned_completion_time', 'plannedCompletionTime']),
    longitude: getRecordValue(record, ['longitude']),
    latitude: getRecordValue(record, ['latitude']),
  });

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
    if (fieldName === 'r_progress') {
      return 'rprogress';
    }
    if (fieldName === 'b_resource') {
      return 'bresource';
    }
    return fieldName.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
  };

  const buildSignedProjectSavePayload = (values: any) => {
    const payload = Object.entries(values).reduce<Record<string, any>>((acc, [key, value]) => {
      if (key === '_isDraft') {
        return acc;
      }
      acc[toSignedFieldName(key)] = dayjs.isDayjs(value) ? value.format('YYYY-MM-DD') : value;
      return acc;
    }, {});

    payload.id = currentRecord?._id || currentRecord?.id || undefined;
    payload.checkStatus = values._isDraft ? 4 : 0;
    payload.progress = values.progress ?? 0;
    // 编辑模式：保留原值（包括null）；新增模式：使用默认值1
    const isEditMode = Boolean(payload.id);
    payload.pgStatus = values.pgStatus !== undefined ? values.pgStatus : (isEditMode ? currentRecord?.pgStatus : 1);
    payload.cateCode = '0';
    payload.cateCode1 = '99';
    payload.district = districts.find((item) => item.value === values.district_code)?.label || currentRecord?.district || '';
    payload.zoneName = editZones.find((item) => item.value === values.zone_code)?.label || currentRecord?.zone_name || currentRecord?.zoneName || '';
    payload.townName = editTowns.find((item) => item.value === values.town_code)?.label || currentRecord?.town_name || currentRecord?.townName || '';
    // 兼容旧字段命名
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
    const projTypeName = resolveProjTypeName(values.proj_type) || currentRecord?.proj_type_name || currentRecord?.projTypeName || '';
    if (projTypeName) {
      payload.projTypeName = projTypeName;
      payload.proj_type_name = projTypeName;
    }
    const industryFirstName = resolveIndustryFirstName(values.industry_first_code) || currentRecord?.industry_first_name || currentRecord?.industryFirstName || '';
    if (industryFirstName) {
      payload.industryFirstName = industryFirstName;
      payload.industry_first_name = industryFirstName;
    }
    const industryName = resolveIndustryName(values.industry_code) || currentRecord?.industry_name || currentRecord?.industryName || '';
    if (industryName) {
      payload.industryName = industryName;
      payload.industry_name = industryName;
    }
    const currentQrKey = currentRecord?.qrKey || currentRecord?.qr_key;
    if (currentQrKey) {
      payload.qrKey = currentQrKey;
      payload.qr_key = currentQrKey;
    }
    payload.signedStatDate = payload.signedStatDate || dayjs().format('YYYY-MM-DD');
    const reviewFiles = buildFilesPayload(reviewUploadFileList, '99');
    const supportFiles = buildFilesPayload(supportUploadFileList, '0');
    const kcFiles = buildFilesPayload(kcUploadFileList, '66');
    payload.files = [...reviewFiles, ...supportFiles, ...kcFiles];
    payload.kcFileArr = kcFiles;
    return payload;
  };

  const getSignedProjectInitialValues = () => {
    const isEdit = Boolean(currentRecord?._id || currentRecord?.id);
    const normalized = normalizeSignedFormValues({
      ...defaultSignedProjectFormValues,
      ...currentRecord,
    });
    return {
      ...normalized,
      proj_type: resolveProjTypeTreeValue(normalized?.proj_type, projTypeTreeData),
      industry_code: resolveIndustryTreeValue(normalized?.industry_code, industryTreeData),
      signed_stat_date: currentRecord?.signed_stat_date
        ? dayjs(currentRecord.signed_stat_date)
        : (isEdit ? undefined : dayjs()),
      signed_date: currentRecord?.signed_date ? dayjs(currentRecord.signed_date) : undefined,
      plan_start_date: currentRecord?.plan_start_date ? dayjs(currentRecord.plan_start_date) : undefined,
      plan_end_date: currentRecord?.plan_end_date ? dayjs(currentRecord.plan_end_date) : undefined,
    };
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

  const registerUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    showUploadList: false,
    fileList: registerUploadFileList,
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
          setRegisterUploadFileList(updatedFileList);
          return;
        }
      }
      setRegisterUploadFileList(fileList);
    },
  };

  const beianUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    showUploadList: false,
    fileList: beianUploadFileList,
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
          setBeianUploadFileList(updatedFileList);
          return;
        }
      }
      setBeianUploadFileList(fileList);
    },
  };

  const approvalUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    showUploadList: false,
    fileList: approvalUploadFileList,
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
          setApprovalUploadFileList(updatedFileList);
          return;
        }
      }
      setApprovalUploadFileList(fileList);
    },
  };

  const beginningUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    showUploadList: false,
    fileList: beginningUploadFileList,
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
          setBeginningUploadFileList(updatedFileList);
          return;
        }
      }
      setBeginningUploadFileList(fileList);
    },
  };

  const beginningKcUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    showUploadList: false,
    fileList: beginningKcUploadFileList,
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
          setBeginningKcUploadFileList(updatedFileList);
          return;
        }
      }
      setBeginningKcUploadFileList(fileList);
    },
  };

  const beginningRcUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    showUploadList: false,
    fileList: beginningRcUploadFileList,
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
          setBeginningRcUploadFileList(updatedFileList);
          return;
        }
      }
      setBeginningRcUploadFileList(fileList);
    },
  };

  const endUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    multiple: true,
    showUploadList: false,
    fileList: endUploadFileList,
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
          setEndUploadFileList(updatedFileList);
          return;
        }
      }
      setEndUploadFileList(fileList);
    },
  };

  const getProgressUploads = (record: any) => {
    if (!record?._id) {
      return createEmptyProgressUploads();
    }
    const cached = progressUploadsMap[record._id];
    if (cached) {
      return cached;
    }
    return {
      register: record?.file_register ? [record.file_register] : [],
      beian: record?.file_beian ? [record.file_beian] : [],
      approval: record?.file_approval ? [record.file_approval] : [],
      beginning: record?.file_start ? [record.file_start] : [],
      end: record?.file_end ? [record.file_end] : [],
    };
  };

  const updateSignedProjectRecord = (recordId: string, patch: Record<string, any>) => {
    setDataSource((prev) => prev.map((item) => (item._id === recordId ? { ...item, ...patch } : item)));
    setCurrentRecord((prev: any) => (prev?._id === recordId ? { ...prev, ...patch } : prev));
  };

  const buildDemoUploadName = (prefix: string) => `${prefix}-${dayjs().format('YYYYMMDDHHmmss')}.pdf`;

  const handleProgressUpload = (
    stage: keyof ReturnType<typeof createEmptyProgressUploads>,
    prefix: string,
  ) => {
    if (!currentRecord?._id) {
      return;
    }
    const fileName = buildDemoUploadName(prefix);
    setProgressUploadsMap((prev) => {
      const currentUploads = prev[currentRecord._id] || getProgressUploads(currentRecord);
      return {
        ...prev,
        [currentRecord._id]: {
          ...currentUploads,
          [stage]: [...currentUploads[stage], fileName],
        },
      };
    });
    message.success('上传成功（演示）');
  };

  const handleProgressBind = (type: 'online' | 'engineering') => {
    if (!currentRecord?._id) {
      return;
    }
    if (type === 'online') {
      setOnlineApprovalModalVisible(true);
      return;
    }
    setEngineeringApprovalModalVisible(true);
  };

  const openAbnormalBindModal = (type: 'online' | 'engineering') => {
    if (!currentRecord?._id) {
      message.warning('请先保存签约项目信息');
      return;
    }
    setAbnormalBindType(type);
    abnormalBindForm.setFieldsValue({
      application_time: dayjs(),
    });
    setAbnormalBindModalVisible(true);
  };

  const handleAbnormalBindSubmit = async () => {
    try {
      if (!currentRecord?._id) {
        message.warning('未获取签约项目ID，无法绑定');
        return;
      }
      const values = await abnormalBindForm.validateFields();
      const formattedApplicationTime = values?.application_time
        ? (dayjs.isDayjs(values.application_time)
          ? values.application_time.format('YYYY-MM-DD HH:mm:ss')
          : dayjs(values.application_time).format('YYYY-MM-DD HH:mm:ss'))
        : undefined;
      const listType = abnormalBindType === 'online' ? 1 : 2;

      const payload = {
        signedId: currentRecord._id,
        listType,
        applicationCompanyContactName: values.application_company_contact_name,
        applicationCompanyContactPhone: values.application_company_contact_phone,
        projectCode: values.project_code,
        projectName: values.project_name,
        totalInvestment: values.total_investment,
        applicationTime: formattedApplicationTime,
      };

      const requestUrl = abnormalBindType === 'online'
        ? '/zsxt-api/tProjectSignedOnline/save'
        : '/zsxt-api/tProjectSignedGg/save';

      await request(requestUrl, {
        method: 'POST',
        data: payload,
      });

      if (abnormalBindType === 'online') {
        await fetchBoundOnlineApprovalList(currentRecord._id);
      } else {
        try {
          await fetchBoundEngineeringApprovalList(currentRecord._id);
        } catch (refreshError) {
          appendBoundEngineeringApprovalLocal(currentRecord._id, {
            id: `abnormal-${Date.now()}`,
            project_code: values.project_code,
            project_name: values.project_name,
            total_investment: values.total_investment,
            application_time: formattedApplicationTime,
          });
        }
      }

      setAbnormalBindModalVisible(false);
      abnormalBindForm.resetFields();
      message.success('绑定成功');
    } catch (error: any) {
      message.error(error?.message || '绑定失败');
    }
  };

  const fetchOnlineApprovalList = async (params?: Record<string, any>, page = 1, pageSize = onlineApprovalPagination.pageSize) => {
    try {
      setOnlineApprovalLoading(true);
      const queryParams = buildOpenapiSearchParams(params);
      const response = await request('/openapi/v1/project/online-approval', {
        method: 'GET',
        params: {
          page,
          size: pageSize,
          ...queryParams,
        },
      });
      const records = response?.records || response?.data?.records || response?.data?.datalist || response?.data?.list || [];
      setOnlineApprovalList(Array.isArray(records) ? records.map(normalizeOnlineApprovalRecord) : []);
      setOnlineApprovalPagination(parsePaginationResult(response, page, pageSize));
    } catch (error) {
      message.error('获取在线审批项目列表失败');
    } finally {
      setOnlineApprovalLoading(false);
    }
  };

  const fetchBoundOnlineApprovalList = async (signedId?: string) => {
    if (!signedId) {
      return [];
    }
    const response = await request('/zsxt-api/tProjectSignedOnline/findAllBySignedId', {
      method: 'POST',
      data: { signedId },
    });
    const records =
      response?.data?.datalist
      || response?.data?.records
      || response?.data?.list
      || response?.data
      || response?.records
      || response?.list
      || response
      || [];
    const normalizedList = Array.isArray(records) ? records.map(normalizeOnlineApprovalRecord) : [];
    setOnlineApprovalMap((prev) => ({
      ...prev,
      [signedId]: normalizedList,
    }));
    updateSignedProjectRecord(signedId, {
      onlineApprovalList: normalizedList,
    });
    return normalizedList;
  };

  const fetchBoundEngineeringApprovalList = async (signedId?: string) => {
    if (!signedId) {
      return [];
    }
    const response = await request('/zsxt-api/tProjectSignedGg/findAllBySignedId', {
      method: 'POST',
      data: { signedId },
    });
    const records =
      response?.data?.datalist
      || response?.data?.records
      || response?.data?.list
      || response?.data
      || response?.records
      || response?.list
      || response
      || [];
    const normalizedList = Array.isArray(records) ? records.map(normalizeEngineeringApprovalRecord) : [];
    setEngineeringApprovalMap((prev) => ({
      ...prev,
      [signedId]: normalizedList,
    }));
    updateSignedProjectRecord(signedId, {
      engineeringApprovalList: normalizedList,
    });
    return normalizedList;
  };

  const appendBoundEngineeringApprovalLocal = (signedId?: string, record?: any) => {
    if (!signedId || !record) {
      return;
    }
    const normalized = normalizeEngineeringApprovalRecord(record);
    setEngineeringApprovalMap((prev) => {
      const current = Array.isArray(prev[signedId]) ? prev[signedId] : [];
      const existed = current.some((item: any) => {
        const itemId = item?.id || item?._id || item?.constructionApprovalId || item?.construction_approval_id;
        const targetId = normalized?.id || normalized?._id || normalized?.constructionApprovalId || normalized?.construction_approval_id;
        return String(itemId || '') === String(targetId || '') || String(item?.project_code || '') === String(normalized?.project_code || '');
      });
      if (existed) {
        return prev;
      }
      return {
        ...prev,
        [signedId]: [...current, normalized],
      };
    });
    setCurrentRecord((prev: any) => {
      if (!prev || (prev?._id !== signedId && prev?.id !== signedId)) {
        return prev;
      }
      const source = Array.isArray(prev?.engineeringApprovalList) ? prev.engineeringApprovalList : [];
      const existed = source.some((item: any) => {
        const itemId = item?.id || item?._id || item?.constructionApprovalId || item?.construction_approval_id;
        const targetId = normalized?.id || normalized?._id || normalized?.constructionApprovalId || normalized?.construction_approval_id;
        return String(itemId || '') === String(targetId || '') || String(item?.project_code || '') === String(normalized?.project_code || '');
      });
      if (existed) {
        return prev;
      }
      return {
        ...prev,
        engineeringApprovalList: [...source, normalized],
      };
    });
  };

  const fetchEngineeringApprovalList = async (params?: Record<string, any>, page = 1, pageSize = engineeringApprovalPagination.pageSize) => {
    try {
      setEngineeringApprovalLoading(true);
      const queryParams = buildOpenapiSearchParams(params);
      const response = await request('/openapi/v1/project/construction-approval', {
        method: 'GET',
        params: {
          page,
          size: pageSize,
          ...queryParams,
        },
      });
      const records = response?.records || response?.data?.records || response?.data?.datalist || response?.data?.list || [];
      setEngineeringApprovalList(Array.isArray(records) ? records.map(normalizeEngineeringApprovalRecord) : []);
      setEngineeringApprovalPagination(parsePaginationResult(response, page, pageSize));
    } catch (error) {
      message.error('获取工程审批项目列表失败');
    } finally {
      setEngineeringApprovalLoading(false);
    }
  };

  const normalizeProjMoneyRows = (list: any[] = []) =>
    list.map((item, index) => ({
      key: `${item?.id || item?._id || index + 1}`,
      date: item?.bDate || item?.bdate || item?.b_date || '',
      money: item?.receivedMoney ?? item?.received_money ?? '',
    }));

  const fetchProjMoneyList = async (projId?: string) => {
    if (!projId) {
      return;
    }
    try {
      const response = await request('/zsxt-api/tProjMoney/list', {
        method: 'POST',
        data: { projId },
      });
      const records = response?.data || response?.records || response?.list || response || [];
      const rows = normalizeProjMoneyRows(Array.isArray(records) ? records : []);
      const nextRows = rows.length ? rows : defaultReceivedMoneyRows;
      setReceivedMoneyRows(nextRows);
      setReceivedMoneyMap((prev) => ({
        ...prev,
        [projId]: nextRows,
      }));
      updateSignedProjectRecord(projId, {
        receivedMoneyRows: nextRows,
      });
    } catch (error) {
      message.error('获取到账资金历史数据失败');
    }
  };

  // 获取评估详情
  const fetchAssessmentDetail = async (signedId: string) => {
    try {
      const response = await request(`/zsxt-api/tProjPgyj/listBySignedId/${signedId}`, {
        method: 'GET',
      });
      const data = Array.isArray(response) ? response : (response?.data || response?.records || response?.list || []);
      setAssessmentData(data);
      setAssessmentModalVisible(true);
    } catch (error) {
      console.error('获取评估详情失败:', error);
      message.error('获取评估详情失败');
    }
  };

  const handleUnbindOnlineApproval = (record: any) => {
    if (!currentRecord?._id) {
      return;
    }
    Modal.confirm({
      title: '是否确认解绑该项目?',
      onOk: async () => {
        await request(`/zsxt-api/tProjectSignedOnline/${record?.id}`, {
          method: 'DELETE',
        });
        await fetchBoundOnlineApprovalList(currentRecord._id);
        message.success('解绑成功');
      },
    });
  };

  const handleBindOnlineApproval = (record: any) => {
    if (!currentRecord?._id) {
      return;
    }
    Modal.confirm({
      title: '是否确认绑定该项目?',
      onOk: async () => {
        const existed = getBoundOnlineApprovalList(currentRecord).some((item: any) => {
          const itemId = item?.id || item?._id || item?.online_approval_id || item?.onlineApprovalId;
          const targetId = record?.id || record?._id || record?.online_approval_id || record?.onlineApprovalId;
          return String(itemId || '') === String(targetId || '') || String(item?.project_code || '') === String(record?.project_code || '');
        });
        if (existed) {
          message.warning('该在线审批项目已绑定');
          return;
        }
        const payload = {
          ...camelizeRecord(record),
          signedId: currentRecord._id,
          onlineApprovalId: record?.id,
          listType: 1,
        };
        await request('/zsxt-api/tProjectSignedOnline/save', {
          method: 'POST',
          data: payload,
        });
        await fetchBoundOnlineApprovalList(currentRecord._id);
        setOnlineApprovalModalVisible(false);
        message.success('绑定成功');
      },
    });
  };

  const handleUnbindEngineeringApproval = (record: any) => {
    if (!currentRecord?._id) {
      return;
    }
    Modal.confirm({
      title: '是否确认解绑该项目?',
      onOk: async () => {
        await request(`/zsxt-api/tProjectSignedGg/${record?.id}`, {
          method: 'DELETE',
        });
        await fetchBoundEngineeringApprovalList(currentRecord._id);
        message.success('解绑成功');
      },
    });
  };

  const onlineApprovalColumns = [
    { title: '项目编码', dataIndex: 'project_code', key: 'project_code', width: 140, render: (value: any) => value || '-' },
    { title: '项目名称', dataIndex: 'project_name', key: 'project_name', width: 160, render: (value: any) => value || '-' },
    { title: '项目审批类型', dataIndex: 'project_type_label', key: 'project_type_label', width: 140, align: 'center' as const, render: (value: any) => value || '-' },
    { title: '项目内容', dataIndex: 'construction_scale_and_content', key: 'construction_scale_and_content', ellipsis: true, render: (value: any) => value || '-' },
    { title: '总投资(万元)', dataIndex: 'total_investment', key: 'total_investment', width: 120, align: 'center' as const, render: (value: any) => value || '-' },
    { title: '申报公司联系人', dataIndex: 'legal_company_contact_name', key: 'legal_company_contact_name', width: 140, align: 'center' as const, render: (value: any) => value || '-' },
    { title: '申报人手机号', dataIndex: 'legal_company_contact_phone', key: 'legal_company_contact_phone', width: 140, align: 'center' as const, render: (value: any) => value || '-' },
    {
      title: '操作',
      key: 'action',
      width: 110,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, minHeight: 32 }}>
          <Button
            size="small"
            type="primary"
            style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }}
            onClick={() => {
              setOnlineApprovalDetailRecord(record);
              setOnlineApprovalDetailVisible(true);
            }}
          >
            详情
          </Button>
          <Button
            size="small"
            type="primary"
            style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }}
            onClick={() => handleBindOnlineApproval(record)}
          >
            绑定
          </Button>
        </div>
      ),
    },
  ];

  const engineeringApprovalColumns = [
    { title: '项目编码', dataIndex: 'project_code', key: 'project_code', width: 140, render: (value: any) => value || '-' },
    { title: '项目名称', dataIndex: 'project_name', key: 'project_name', width: 160, render: (value: any) => value || '-' },
    { title: '项目审批类型', dataIndex: 'project_type_label', key: 'project_type_label', width: 140, align: 'center' as const, render: (value: any) => value || '-' },
    { title: '建设内容', dataIndex: 'construction_content', key: 'construction_content', ellipsis: true, render: (value: any) => value || '-' },
    { title: '总投资(万元)', dataIndex: 'total_investment', key: 'total_investment', width: 120, align: 'center' as const, render: (value: any) => value || '-' },
    { title: '申报公司联系人', dataIndex: 'legal_company_contact_name', key: 'legal_company_contact_name', width: 140, align: 'center' as const, render: (value: any) => value || '-' },
    { title: '申报人手机号', dataIndex: 'legal_company_contact_phone', key: 'legal_company_contact_phone', width: 140, align: 'center' as const, render: (value: any) => value || '-' },
    {
      title: '操作',
      key: 'action',
      width: 110,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, minHeight: 32 }}>
          <Button
            size="small"
            type="primary"
            style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }}
            onClick={() => {
              setEngineeringApprovalDetailRecord(record);
              setEngineeringApprovalDetailVisible(true);
            }}
          >
            详情
          </Button>
          <Button
            size="small"
            type="primary"
            style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }}
            onClick={() => {
              if (!currentRecord?._id) {
                return;
              }
              Modal.confirm({
                title: '是否确认绑定该项目?',
                  onOk: async () => {
                  const existed = getBoundEngineeringApprovalList(currentRecord).some((item: any) => {
                    const itemId = item?.id || item?._id || item?.construction_approval_id || item?.constructionApprovalId;
                    const targetId = record?.id || record?._id || record?.construction_approval_id || record?.constructionApprovalId;
                    return String(itemId || '') === String(targetId || '') || String(item?.project_code || '') === String(record?.project_code || '');
                  });
                  if (existed) {
                    message.warning('该工程审批项目已绑定');
                    return;
                  }
                  const payload = {
                    ...camelizeRecord(record),
                    signedId: currentRecord?._id,
                    constructionApprovalId: record?.id,
                    listType: 2,
                  };
                  await request('/zsxt-api/tProjectSignedGg/save', {
                    method: 'POST',
                    data: payload,
                  });
                  try {
                    await fetchBoundEngineeringApprovalList(currentRecord?._id);
                  } catch (refreshError) {
                    appendBoundEngineeringApprovalLocal(currentRecord?._id, record);
                  }
                  setEngineeringApprovalModalVisible(false);
                  message.success('绑定成功');
                },
              });
            }}
          >
            绑定
          </Button>
        </div>
      ),
    },
  ];

  const onlineApprovalDetailRows = onlineApprovalDetailRecord ? [
    ['项目审批类型', onlineApprovalDetailRecord.approval_type_label || onlineApprovalDetailRecord.project_type_label || '-', '项目名称', onlineApprovalDetailRecord.project_name || '-'],
    ['备案目录', onlineApprovalDetailRecord.filing_catalog || '-', '是否补办项目', onlineApprovalDetailRecord.is_supplementary_project || '-'],
    ['主项目名称', onlineApprovalDetailRecord.parent_project_name || '-', '申报时间', onlineApprovalDetailRecord.application_time || '-'],
    ['项目代码', onlineApprovalDetailRecord.project_code || '-', '备案目录分类', onlineApprovalDetailRecord.filing_catalog_category || '-'],
    ['项目类型', onlineApprovalDetailRecord.project_type_label || '-', '拟开工时间（年）', onlineApprovalDetailRecord.planned_start_year || '-'],
    ['项目属性', onlineApprovalDetailRecord.project_attributes || '-', '国标行业', onlineApprovalDetailRecord.national_industry_standard || '-'],
    ['拟建成时间（年）', onlineApprovalDetailRecord.planned_end_year || '-', '管理行业', onlineApprovalDetailRecord.management_industry || '-'],
    ['国标行业代码', onlineApprovalDetailRecord.national_industry_code || '-'],
    ['建设地点', onlineApprovalDetailRecord.construction_location || '-'],
    ['建设规模及内容', onlineApprovalDetailRecord.construction_scale_and_content || '-'],
    ['总投资（万元）', onlineApprovalDetailRecord.total_investment || '-', '总投资说明', onlineApprovalDetailRecord.total_investment_desc || '-'],
    ['用地面积（公顷）', onlineApprovalDetailRecord.land_area || '-', '新增用地面积（公顷）', onlineApprovalDetailRecord.new_land_area || '-'],
    ['农用地面积（公顷）', onlineApprovalDetailRecord.agricultural_land_area || '-', '项目资本金（万元）', onlineApprovalDetailRecord.project_capital || '-'],
    ['资金来源', onlineApprovalDetailRecord.funding_source || '-', '财政资金来源', onlineApprovalDetailRecord.fiscal_funding_source || '-'],
    ['是否技改项目', onlineApprovalDetailRecord.is_technical_reform_project || '-', '产业政策类型', onlineApprovalDetailRecord.industrial_policy_type || '-'],
    ['产业结构调整指导目录', onlineApprovalDetailRecord.industry_adjustment_guidance_catalog || '-', '是否属于房屋市政工程', onlineApprovalDetailRecord.is_infrastructure_engineering || '-'],
    ['是否同意投资平台为项目单位提供融资对接服务', onlineApprovalDetailRecord.agree_to_provide_financing_services || '-', '项目（法人）单位', onlineApprovalDetailRecord.legal_company || '-'],
    ['项目单位登记注册类型', onlineApprovalDetailRecord.legal_company_registration_type || '-', '项目单位控股情况', onlineApprovalDetailRecord.legal_company_holding_situation || '-'],
    ['是否为该项目的控股单位', onlineApprovalDetailRecord.is_legal_company_controlling_for_project || '-', '项目法人证照类型', onlineApprovalDetailRecord.legal_company_document_type || '-'],
    ['项目法人证照号码', onlineApprovalDetailRecord.legal_company_document_number || '-', '法人代表姓名', onlineApprovalDetailRecord.legal_company_legal_representative || '-'],
    ['法人单位联系人', onlineApprovalDetailRecord.legal_company_contact_name || '-', '手机号码', onlineApprovalDetailRecord.legal_company_contact_phone || '-'],
    ['电子邮箱', onlineApprovalDetailRecord.legal_company_contact_email || '-', '项目（申报）单位', onlineApprovalDetailRecord.application_company || '-'],
    ['项目单位登记注册类型', onlineApprovalDetailRecord.application_company_registration_type || '-', '项目单位控股情况', onlineApprovalDetailRecord.application_company_holding_situation || '-'],
    ['项目证照类型', onlineApprovalDetailRecord.application_company_document_type || '-', '项目证照号码', onlineApprovalDetailRecord.application_company_document_number || '-'],
    ['申报单位联系人', onlineApprovalDetailRecord.application_company_contact_name || '-', '手机号码', onlineApprovalDetailRecord.application_company_contact_phone || '-'],
  ] : [];

  const engineeringApprovalDetailRows = engineeringApprovalDetailRecord ? [
    ['项目代码', engineeringApprovalDetailRecord.project_code || '-', '项目名称', engineeringApprovalDetailRecord.project_name || '-'],
    ['项目地址-行政区划', engineeringApprovalDetailRecord.administrative_division || '-', '项目详细地址', engineeringApprovalDetailRecord.detailed_address || '-'],
    ['工程代码', engineeringApprovalDetailRecord.engineering_code || '-', '立项部门', engineeringApprovalDetailRecord.approval_department || '-'],
    ['行业类别（国标行业）', engineeringApprovalDetailRecord.industry_category_label || '-', '项目类型', engineeringApprovalDetailRecord.project_type_label || '-'],
    ['项目投资来源', engineeringApprovalDetailRecord.investment_source_label || '-', '立项类型', engineeringApprovalDetailRecord.approval_type_label || '-'],
    ['项目资金属性', engineeringApprovalDetailRecord.fund_attribute_label || '-', '总投资额（万元）', engineeringApprovalDetailRecord.total_investment || '-'],
    ['项目资本金（万元）', engineeringApprovalDetailRecord.project_capital || '-', '是否是亿元以上产业项目', engineeringApprovalDetailRecord.is_over_one_billion_industrial_project || '-'],
    ['是否是集中建设项目', engineeringApprovalDetailRecord.is_concentrated_building_project || '-'],
    ['集中建设单位名称', engineeringApprovalDetailRecord.concentrated_builder_name || '-'],
    ['集中建设单位统一社会信用代码', engineeringApprovalDetailRecord.concentrated_builder_uscc || '-'],
    ['集中建设单位法定代表人姓名', engineeringApprovalDetailRecord.concentrated_builder_legal_representative || '-', '单位类型', engineeringApprovalDetailRecord.company_type_label || '-'],
    ['企业名称', engineeringApprovalDetailRecord.company_name || '-', '统一社会信用代码', engineeringApprovalDetailRecord.uscc || '-'],
    ['法定代表人姓名', engineeringApprovalDetailRecord.legal_representative || '-', '联系电话', engineeringApprovalDetailRecord.contact_phone || '-'],
    ['土地是否带设计方案', engineeringApprovalDetailRecord.is_design || '-', '是否完成区域评估', engineeringApprovalDetailRecord.is_completed_evaluation || '-'],
    ['用地面积（㎡）', engineeringApprovalDetailRecord.land_area_m2 || '-', '新增用地面积（㎡）', engineeringApprovalDetailRecord.new_land_area_m2 || '-'],
    ['土地获取方式', engineeringApprovalDetailRecord.land_obtain_mode || '-', '建设性质', engineeringApprovalDetailRecord.construction_nature || engineeringApprovalDetailRecord.construction_nature_label || '-'],
    ['建设类型', engineeringApprovalDetailRecord.construction_type || '-', '总建筑面积（㎡）', engineeringApprovalDetailRecord.total_construction_area || '-'],
    ['拟开工时间', engineeringApprovalDetailRecord.planned_start_time || engineeringApprovalDetailRecord.contract_start_date || '-', '拟建成时间', engineeringApprovalDetailRecord.planned_completion_time || engineeringApprovalDetailRecord.contract_end_date || '-'],
    ['经度', engineeringApprovalDetailRecord.longitude || '-', '纬度', engineeringApprovalDetailRecord.latitude || '-'],
    ['建设内容', engineeringApprovalDetailRecord.construction_content || '-'],
  ] : [];

  const handleProgressStageSubmit = async (
    stage: 'register' | 'beian' | 'approval' | 'beginning' | 'end',
  ) => {
    if (!currentRecord?._id) {
      return;
    }
    if (stage === 'register') {
      try {
        const values = await progressForm.validateFields(['u_code', 'company_name', 'reg_money', 'reg_date', 'reg_stat_date']);
        const registerFiles = buildFilesPayload(registerUploadFileList, '1');
        if (!registerFiles.length) {
          message.warning('请先上传营业执照');
          return;
        }
        const payload = {
          id: currentRecord._id,
          ucode: values.u_code,
          companyName: values.company_name,
          regMoney: values.reg_money || 0,
          regDate: formatDateValue(values.reg_date),
          regStatDate: formatDateValue(values.reg_stat_date),
          progress: 1,
          checkStatus: 0,
          cateCode: 1,
          files: registerFiles,
        };
        await request('/zsxt-api/tProjProjectSigned/updateOrSaveRegister', {
          method: 'POST',
          data: payload,
        });
        updateSignedProjectRecord(currentRecord._id, {
          u_code: payload.ucode,
          company_name: payload.companyName,
          reg_money: payload.regMoney,
          reg_date: payload.regDate,
          reg_stat_date: payload.regStatDate,
          progress: '1',
          check_status: '0',
          files: [
            ...(Array.isArray(currentRecord?.files) ? currentRecord.files.filter((item: any) => String(item?.cateCode ?? item?.cate_code ?? '') !== '1') : []),
            ...registerFiles,
          ],
        });
        message.success('公司注册信息已提交');
        return;
      } catch (error) {
        message.warning('请先完善公司注册必填信息');
        return;
      }
    }
    if (stage === 'beian') {
      try {
        const values = await progressForm.validateFields(['check_stat_date']);
        const beianFiles = buildFilesPayload(beianUploadFileList, '2');
        if (!beianFiles.length) {
          message.warning('请先上传备案文件');
          return;
        }
        const onlineApprovalList = getBoundOnlineApprovalList(currentRecord);
        if (!onlineApprovalList.length) {
          message.warning('请先绑定在线审批项目');
          return;
        }
        const payload = {
          id: currentRecord._id,
          checkStatDate: formatDateValue(values.check_stat_date),
          progress: 5,
          checkStatus: 0,
          cateCode: 2,
          files: beianFiles,
        };
        const response = await request('/zsxt-api/tProjProjectSigned/updateOrSaveBA', {
          method: 'POST',
          data: payload,
        });
        const responseRecord = normalizeSignedRecord(response?.data || response || {});
        const nextProgress = responseRecord?.progress ?? '4';
        const nextCheckStatus = responseRecord?.check_status ?? '0';
        updateSignedProjectRecord(currentRecord._id, {
          check_stat_date: payload.checkStatDate,
          progress: nextProgress,
          check_status: nextCheckStatus,
          files: [
            ...(Array.isArray(currentRecord?.files) ? currentRecord.files.filter((item: any) => String(item?.cateCode ?? item?.cate_code ?? '') !== '2') : []),
            ...beianFiles,
          ],
        });
        setCurrentRecord((prev: any) => prev?._id === currentRecord._id ? {
          ...prev,
          check_stat_date: payload.checkStatDate,
          progress: nextProgress,
          check_status: nextCheckStatus,
          files: [
            ...(Array.isArray(prev?.files) ? prev.files.filter((item: any) => String(item?.cateCode ?? item?.cate_code ?? '') !== '2') : []),
            ...beianFiles,
          ],
        } : prev);
        message.success('备案信息已提交');
        return;
      } catch (error) {
        message.warning('请先完善备案信息必填项');
        return;
      }
    }
    if (stage === 'approval') {
      try {
        const values = await progressForm.validateFields(['finish_check_date']);
        const approvalFiles = buildFilesPayload(approvalUploadFileList, '3');
        if (!approvalFiles.length) {
          message.warning('请先上传报批材料');
          return;
        }
        const engineeringApprovalList = getBoundEngineeringApprovalList(currentRecord);
        if (!engineeringApprovalList.length) {
          message.warning('请先绑定工程审批项目');
          return;
        }
        const payload = {
          id: currentRecord._id,
          finishCheckDate: formatDateValue(values.finish_check_date),
          progress: 4,
          checkStatus: 0,
          cateCode: 3,
          files: approvalFiles,
        };
        const response = await request('/zsxt-api/tProjProjectSigned/updateOrSaveApprove', {
          method: 'POST',
          data: payload,
        });
        const responseRecord = normalizeSignedRecord(response?.data || response || {});
        const nextProgress = responseRecord?.progress ?? '4';
        const nextCheckStatus = responseRecord?.check_status ?? '0';
        updateSignedProjectRecord(currentRecord._id, {
          finish_check_date: payload.finishCheckDate,
          progress: nextProgress,
          check_status: nextCheckStatus,
          files: [
            ...(Array.isArray(currentRecord?.files) ? currentRecord.files.filter((item: any) => String(item?.cateCode ?? item?.cate_code ?? '') !== '3') : []),
            ...approvalFiles,
          ],
        });
        setCurrentRecord((prev: any) => prev?._id === currentRecord._id ? {
          ...prev,
          finish_check_date: payload.finishCheckDate,
          progress: nextProgress,
          check_status: nextCheckStatus,
          files: [
            ...(Array.isArray(prev?.files) ? prev.files.filter((item: any) => String(item?.cateCode ?? item?.cate_code ?? '') !== '3') : []),
            ...approvalFiles,
          ],
        } : prev);
        message.success('报批信息已提交');
        return;
      } catch (error) {
        message.warning('请先完善报批信息必填项');
        return;
      }
    }
    if (stage === 'beginning') {
      try {
        const validatedValues = await progressForm.validateFields([
          'kg_is_zkc',
          'kg_zone_name',
          'kg_name',
          'kg_investor',
          'kg_project_address',
          'kg_signed_date',
          'kg_b_industry',
          'kg_is_qflp',
          'kg_u_code',
          'kg_desc',
          'kg_industry_code',
          'kg_proj_type',
          'kg_invest_money',
          'kg_fixed_invest',
          'pzwh',
          'pzrq',
          'cxqk',
          'start_date_commit',
        ]);
        const values = {
          ...progressForm.getFieldsValue(true),
          ...validatedValues,
        };
        const requiredFields = [
          'kg_is_zkc',
          'kg_zone_name',
          'kg_name',
          'kg_investor',
          'kg_project_address',
          'kg_signed_date',
          'kg_b_industry',
          'kg_is_qflp',
          'kg_u_code',
          'kg_desc',
          'kg_industry_code',
          'kg_proj_type',
          'kg_invest_money',
          'kg_fixed_invest',
          'pzwh',
          'pzrq',
          'cxqk',
          'start_date_commit',
        ];
        const missingRequired = requiredFields.some((field) => !hasValue(values[field]));
        if (missingRequired) {
          message.warning('请先完善开工信息必填项');
          return;
        }
        const beginningFiles = buildFilesPayload(beginningUploadFileList, '98');
        if (!beginningFiles.length) {
          message.warning('请先上传开工佐证材料');
          return;
        }
        const beginningKcFiles = values.kg_is_zkc === '是' ? buildFilesPayload(beginningKcUploadFileList, '88') : [];
        const beginningRcFiles =
          values.is_kc_proj === '是' && values.kc_proj_type === '高层次人才类'
            ? buildFilesPayload(beginningRcUploadFileList, '77')
            : [];
        if (values.kg_is_zkc === '是' && !beginningKcFiles.length) {
          message.warning('请先上传符合科创项目条件的证明材料');
          return;
        }
        const mergedBeginningFiles = [...beginningFiles, ...beginningRcFiles, ...beginningKcFiles];
        const kgIndustryName = resolveIndustryName(values.kg_industry_code);
        const payload = {
          id: currentRecord._id,
          kgIsZkc: values.kg_is_zkc,
          kgZydw: values.kg_zone_name,
          kgXmmc: values.kg_name,
          kgTzfmc: values.kg_investor,
          kgXmdz: values.kg_project_address,
          kgQyrq: formatDateValue(values.kg_signed_date),
          kgXmlx: values.kg_b_industry,
          kgQflp: values.kg_is_qflp,
          kgTyxydm: values.kg_u_code,
          kgJsnr: values.kg_desc,
          kgHydm: values.kg_industry_code,
          kgHymc: kgIndustryName,
          kgCyfx: values.kg_proj_type,
          kgZtz: values.kg_invest_money,
          kgGdzctz: values.kg_fixed_invest,
          pzwh: values.pzwh,
          pzrq: formatDateValue(values.pzrq),
          cxqk: values.cxqk,
          startDateCommit: formatDateValue(values.start_date_commit),
          kgzzcl: beginningFiles.map((item) => item.filePath).join(';'),
          rczzcl: beginningRcFiles.map((item) => item.filePath).join(';'),
          kczzcl: beginningKcFiles.map((item) => item.filePath).join(';'),
          files: mergedBeginningFiles,
        };
        const response = await request('/zsxt-api/tProjProjectSigned/createKg', {
          method: 'POST',
          data: payload,
        });
        const responseRecord = normalizeSignedRecord(response?.data || response || {});
        const nextProgress = responseRecord?.progress ?? '2';
        const nextCheckStatus = responseRecord?.check_status ?? '0';
        updateSignedProjectRecord(currentRecord._id, {
          kg_is_zkc: payload.kgIsZkc,
          kg_zydw: payload.kgZydw,
          kg_xmmc: payload.kgXmmc,
          kg_tzfmc: payload.kgTzfmc,
          kg_xmdz: payload.kgXmdz,
          kg_qyrq: payload.kgQyrq,
          kg_xmlx: payload.kgXmlx,
          kg_qflp: payload.kgQflp,
          kg_tyxydm: payload.kgTyxydm,
          kg_jsnr: payload.kgJsnr,
          kg_hydm: payload.kgHydm,
          kg_hymc: payload.kgHymc,
          kg_cyfx: payload.kgCyfx,
          kg_ztz: payload.kgZtz,
          kg_gdzctz: payload.kgGdzctz,
          pzwh: payload.pzwh,
          pzrq: payload.pzrq,
          cxqk: payload.cxqk,
          start_date_commit: payload.startDateCommit,
          progress: nextProgress,
          check_status: nextCheckStatus,
          files: [
            ...(Array.isArray(currentRecord?.files)
              ? currentRecord.files.filter((item: any) => !['98', '88', '77'].includes(String(item?.cateCode ?? item?.cate_code ?? '')))
              : []),
            ...mergedBeginningFiles,
          ],
        });
        setCurrentRecord((prev: any) => prev?._id === currentRecord._id ? {
          ...prev,
          kg_is_zkc: payload.kgIsZkc,
          kg_zydw: payload.kgZydw,
          kg_xmmc: payload.kgXmmc,
          kg_tzfmc: payload.kgTzfmc,
          kg_xmdz: payload.kgXmdz,
          kg_qyrq: payload.kgQyrq,
          kg_xmlx: payload.kgXmlx,
          kg_qflp: payload.kgQflp,
          kg_tyxydm: payload.kgTyxydm,
          kg_jsnr: payload.kgJsnr,
          kg_hydm: payload.kgHydm,
          kg_hymc: payload.kgHymc,
          kg_cyfx: payload.kgCyfx,
          kg_ztz: payload.kgZtz,
          kg_gdzctz: payload.kgGdzctz,
          pzwh: payload.pzwh,
          pzrq: payload.pzrq,
          cxqk: payload.cxqk,
          start_date_commit: payload.startDateCommit,
          progress: nextProgress,
          check_status: nextCheckStatus,
          files: [
            ...(Array.isArray(prev?.files)
              ? prev.files.filter((item: any) => !['98', '88', '77'].includes(String(item?.cateCode ?? item?.cate_code ?? '')))
              : []),
            ...mergedBeginningFiles,
          ],
        } : prev);
        message.success('开工确认成功');
        return;
      } catch (error) {
        message.warning('请先完善开工信息必填项11');
        return;
      }
    }
    if (stage === 'end') {
      try {
        const validatedValues = await progressForm.validateFields(['jg_is_zkc', 'is_kc_proj', 'kg_is_zkc', 'complete_date']);
        const values = {
          ...progressForm.getFieldsValue(true),
          ...validatedValues,
        };
        const derivedJgIsZkc =
          values.is_kc_proj === '是' || values.kg_is_zkc === '是' ? '是' : values.jg_is_zkc;
        if (!hasValue(derivedJgIsZkc) || !hasValue(values.complete_date)) {
          message.warning('请先完善竣工信息必填项');
          return;
        }
        if (derivedJgIsZkc === '是') {
          const qyFields = ['qy_total_num', 'qy_sb_num', 'qy_tzyf_num', 'qy_yf_money'];
          await progressForm.validateFields(qyFields);
          const missingQyField = qyFields.some((field) => !hasValue(values[field]));
          if (missingQyField) {
            message.warning('请先完善竣工信息必填项');
            return;
          }
        }
        const endFiles = buildFilesPayload(endUploadFileList, '97');
        if (!endFiles.length) {
          message.warning('请先上传竣工佐证材料');
          return;
        }
        const payload = {
          id: currentRecord._id,
          jgIsZkc: derivedJgIsZkc,
          completeDate: formatDateValue(values.complete_date),
          qyTotalNum: values.qy_total_num,
          qySbNum: values.qy_sb_num,
          qyTzyfNum: values.qy_tzyf_num,
          qyYfMoney: values.qy_yf_money,
          files: endFiles,
        };
        const response = await request('/zsxt-api/tProjProjectSigned/createJg', {
          method: 'POST',
          data: payload,
        });
        const responseRecord = normalizeSignedRecord(response?.data || response || {});
        const nextProgress = responseRecord?.progress ?? '3';
        const nextCheckStatus = responseRecord?.check_status ?? '0';
        updateSignedProjectRecord(currentRecord._id, {
          jg_is_zkc: payload.jgIsZkc,
          complete_date: payload.completeDate,
          qy_total_num: payload.qyTotalNum,
          qy_sb_num: payload.qySbNum,
          qy_tzyf_num: payload.qyTzyfNum,
          qy_yf_money: payload.qyYfMoney,
          progress: nextProgress,
          check_status: nextCheckStatus,
          files: [
            ...(Array.isArray(currentRecord?.files)
              ? currentRecord.files.filter((item: any) => String(item?.cateCode ?? item?.cate_code ?? '') !== '97')
              : []),
            ...endFiles,
          ],
        });
        setCurrentRecord((prev: any) => prev?._id === currentRecord._id ? {
          ...prev,
          jg_is_zkc: payload.jgIsZkc,
          complete_date: payload.completeDate,
          qy_total_num: payload.qyTotalNum,
          qy_sb_num: payload.qySbNum,
          qy_tzyf_num: payload.qyTzyfNum,
          qy_yf_money: payload.qyYfMoney,
          progress: nextProgress,
          check_status: nextCheckStatus,
          files: [
            ...(Array.isArray(prev?.files)
              ? prev.files.filter((item: any) => String(item?.cateCode ?? item?.cate_code ?? '') !== '97')
              : []),
            ...endFiles,
          ],
        } : prev);
        message.success('竣工确认成功');
        return;
      } catch (error) {
        message.warning('请先完善竣工信息必填项');
        return;
      }
    }
    const stageConfigs = {
      register: {
        fields: ['u_code', 'company_name', 'reg_money', 'reg_date', 'reg_stat_date'],
        uploadKey: 'register' as const,
        uploadLabel: '营业执照',
        successText: '公司注册信息已提交（演示）',
        nextTab: '1',
        patchBuilder: (values: any, uploads: ReturnType<typeof createEmptyProgressUploads>) => ({
          u_code: values.u_code,
          company_name: values.company_name,
          reg_money: values.reg_money,
          reg_date: formatDateValue(values.reg_date),
          reg_stat_date: formatDateValue(values.reg_stat_date),
          file_register: uploads.register[uploads.register.length - 1] || '',
          progress: '1',
          check_status: '0',
        }),
      },
      beian: {
        fields: ['check_stat_date'],
        uploadKey: 'beian' as const,
        uploadLabel: '备案文件',
        successText: '备案信息已提交（演示）',
        nextTab: '1',
        patchBuilder: (values: any, uploads: ReturnType<typeof createEmptyProgressUploads>) => ({
          check_stat_date: formatDateValue(values.check_stat_date),
          file_beian: uploads.beian[uploads.beian.length - 1] || '',
          progress: '5',
          check_status: '0',
        }),
      },
      approval: {
        fields: ['finish_check_date'],
        uploadKey: 'approval' as const,
        uploadLabel: '报批材料',
        successText: '报批信息已提交（演示）',
        nextTab: '2',
        patchBuilder: (values: any, uploads: ReturnType<typeof createEmptyProgressUploads>) => ({
          finish_check_date: formatDateValue(values.finish_check_date),
          file_approval: uploads.approval[uploads.approval.length - 1] || '',
          progress: '4',
          check_status: '0',
        }),
      },
      beginning: {
        fields: [
          'kg_is_zkc',
          'kg_zone_name',
          'kg_name',
          'kg_investor',
          'kg_project_address',
          'kg_signed_date',
          'kg_b_industry',
          'kg_is_qflp',
          'kg_u_code',
          'kg_desc',
          'kg_industry_code',
          'kg_proj_type',
          'kg_invest_money',
          'kg_fixed_invest',
          'pzwh',
          'pzrq',
          'cxqk',
          'start_date_commit',
        ],
        uploadKey: 'beginning' as const,
        uploadLabel: '开工佐证材料',
        successText: '开工信息已确认（演示）',
        nextTab: '3',
        patchBuilder: (values: any, uploads: ReturnType<typeof createEmptyProgressUploads>) => ({
          kg_is_zkc: values.kg_is_zkc,
          kg_zydw: values.kg_zone_name,
          kg_xmmc: values.kg_name,
          kg_tzfmc: values.kg_investor,
          kg_xmdz: values.kg_project_address,
          kg_qyrq: formatDateValue(values.kg_signed_date),
          kg_xmlx: values.kg_b_industry,
          kg_qflp: values.kg_is_qflp,
          kg_tyxydm: values.kg_u_code,
          kg_jsnr: values.kg_desc,
          kg_hydm: values.kg_industry_code,
          kg_hymc: resolveIndustryName(values.kg_industry_code),
          kg_cyfx: values.kg_proj_type,
          kg_ztz: values.kg_invest_money,
          kg_gdzctz: values.kg_fixed_invest,
          pzwh: values.pzwh,
          pzrq: formatDateValue(values.pzrq),
          cxqk: values.cxqk,
          start_date_commit: formatDateValue(values.start_date_commit),
          file_start: uploads.beginning[uploads.beginning.length - 1] || '',
          progress: '2',
          check_status: '0',
        }),
      },
      end: {
        fields: ['jg_is_zkc', 'complete_date'],
        uploadKey: 'end' as const,
        uploadLabel: '竣工佐证材料',
        successText: '竣工信息已确认（演示）',
        nextTab: '3',
        patchBuilder: (values: any, uploads: ReturnType<typeof createEmptyProgressUploads>) => ({
          jg_is_zkc: values.jg_is_zkc,
          complete_date: formatDateValue(values.complete_date),
          file_end: uploads.end[uploads.end.length - 1] || '',
          progress: '3',
          check_status: '0',
        }),
      },
    };

    const config = stageConfigs[stage];
    try {
      const values = await progressForm.validateFields(config.fields);
      const currentUploads = getProgressUploads(currentRecord);
      if (!currentUploads[config.uploadKey].length) {
        message.warning(`请先上传${config.uploadLabel}`);
        return;
      }
      const patch = config.patchBuilder(progressForm.getFieldsValue(true), currentUploads);
      const recordId = currentRecord._id;
      setProgressDraftMap((prev) => ({
        ...prev,
        [recordId]: {
          ...(prev[recordId] || {}),
          ...values,
          ...patch,
        },
      }));
      updateSignedProjectRecord(recordId, patch);
      setProgressTabKey(config.nextTab);
      message.success(config.successText);
    } catch (error) {
      message.warning('请先完善当前阶段必填信息');
    }
  };

  // 生成协议
  const handleGenerateAgreement = async () => {
      try {
          const values = editForm.getFieldsValue(true);
          const payload = buildSignedProjectSavePayload({
              ...values,
              _isDraft: false,
              fzList: fzList.map((item, index) => `${index + 1}、${item}`),
          });
          // 兼容旧系统逻辑：已有则复用；首次生成协议时创建一个新的 qrKey（时间戳）
          const currentQrKey = currentRecord?.qrKey || currentRecord?.qr_key;
          const nextQrKey = currentQrKey || String(Date.now());
          payload.qrKey = nextQrKey;
          payload.qr_key = nextQrKey;

          // 让后续保存/再次生成继续复用同一个 qrKey
          setCurrentRecord((prev: any) => (prev ? { ...prev, qrKey: nextQrKey, qr_key: nextQrKey } : prev));
          if (currentRecord?._id) {
            updateSignedProjectRecord(currentRecord._id, { qrKey: nextQrKey, qr_key: nextQrKey });
          }

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
          
          // 直接使用返回的完整路径（已包含签名参数）
          const a = document.createElement('a');
          a.href = filePath;
          a.download = fileName;
          a.target = '_blank';
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
              document.body.removeChild(a);
          }, 100);
          message.success('协议生成成功');
      } catch (e: any) {
          message.error(e?.message || '生成协议失败');
      }
  };

  // 存入草稿箱
  const handleSaveDraft = async () => {
      try {
          const values = editForm.getFieldsValue(true);
          const payload = buildSignedProjectSavePayload({
              ...values,
              _isDraft: true,
              fzList: fzList.map((item, index) => `${index + 1}、${item}`),
          });
          await request('/zsxt-api/tProjProjectSigned/saveTemp', {
              method: 'POST',
              data: payload,
          });
          message.success('已存入草稿箱');
          setEditModalVisible(false);
          onSearch(form.getFieldsValue());
      } catch (e: any) {
          message.error(e?.message || '存入草稿箱失败');
      }
  };

  // 获取数据列表
  const fetchData = async (params: any) => {
    try {
      setLoading(true);
      const page = Number(params?.page) || 1;
      const pageSize = Number(params?.pageSize) || 10;
      
      // 构建分页参数
      const paginationParams = buildPaginationParams(page, pageSize);
      
      // 从 params 中移除 page 和 pageSize，避免重复
      const { page: _, pageSize: __, ...restParams } = params;
      
      // 将分页参数转换为字符串并拼接到 URL 后面
      const queryParams: Record<string, string> = {};
      Object.keys(paginationParams).forEach(key => {
        queryParams[key] = String(paginationParams[key as keyof typeof paginationParams]);
      });
      const queryString = new URLSearchParams(queryParams).toString();
      
      // 调用旧系统的 searchProjProjectSigned.do 接口
      const response = await request(`/zsxt-api/tProjProjectSigned/searchProjProjectSigned?${queryString}`, {
          method: 'POST',
          data: restParams
      });

      if (response) {
          const records = response.records || response.data?.records || response.data?.datalist || response.list || response.data?.list || [];
          const nextPagination = parsePaginationResult(response, page, pageSize);
          setPagination((prev) => ({
            ...prev,
            ...nextPagination,
          }));
          setDataSource(records.map(normalizeSignedRecord));
      } else {
          setPagination((prev) => ({
            ...prev,
            total: 0,
            current: page,
            pageSize,
          }));
          setDataSource([]);
      }
    } catch (e: unknown) {
      console.warn('接口请求失败，使用空数据代替', e);
      const page = Number(params?.page) || 1;
      const pageSize = Number(params?.pageSize) || 10;
      setPagination((prev) => ({
        ...prev,
        total: 0,
        current: page,
        pageSize,
      }));
      setDataSource([]);
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
          } else {
            // 其他位数 = 园区级别
            isTownLevel = false;
            zoneCode = firstArea.zsDept;
            zoneName = firstArea.name;
          }
          
          // 注意：这里不设置 zones，因为镇街级别用户的 zoneName 需要后面拼接
          // 搜索表单的园区选项会在后面的 useEffect 中设置
          
          // 如果是镇街级别，设置镇街选项
          if (isTownLevel) {
            setTowns([{
              label: townName,
              value: townCode,
            }]);
          }
          // 注意：园区级别用户的 zones 选项不在这里设置，而是在外部通过 fetchZoneList 获取翻译后的名称
          
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
        setDistricts(options);
        return options;
      }
      return [];
    } catch (error) {
      console.error('获取市（区）列表失败:', error);
      message.error('获取市（区）列表失败');
      return [];
    }
  };

  const fetchZoneList = async (pid: string, scene: 'search' | 'edit') => {
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
        if (scene === 'search') {
          setZones(options);
        } else {
          setEditZones(options);
        }
        return options;
      }
      return [];
    } catch (error) {
      console.error('获取园区列表失败:', error);
      message.error('获取园区列表失败');
      return [];
    }
  };

  const fetchTownList = async (pid: string, scene: 'search' | 'edit') => {
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
        if (scene === 'search') {
          setTowns(options);
        } else {
          setEditTowns(options);
        }
        return options;
      }
      return [];
    } catch (error) {
      console.error('获取镇街列表失败:', error);
      message.error('获取镇街列表失败');
      return [];
    }
  };

  const fetchProjTypeOptions = async () => {
    const buildTreeData = (nodes: any[]): any[] => {
      return (nodes || []).map((item) => {
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
    };

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
    const parseIndustryFirstOptions = (response: any) => {
      const rawList = Array.isArray(response)
        ? response
        : (Array.isArray(response?.records)
          ? response.records
          : (Array.isArray(response?.data?.records)
            ? response.data.records
            : (Array.isArray(response?.data?.datalist)
              ? response.data.datalist
              : (Array.isArray(response?.data)
                ? response.data
                : []))));

      return rawList
        .map((item: any) => ({
          value: String(item?._code ?? item?.code ?? item?.id ?? item?.value ?? ''),
          label: String(item?._name ?? item?.name ?? item?.text ?? item?.label ?? ''),
        }))
        .filter((item: { value: string; label: string }) => item.value && item.label);
    };

    try {
      const response = await request('/zsxt-api/tProjIndustryFirst/list?page=1&size=9999', {
        method: 'POST',
        data: {},
      });
      const options = parseIndustryFirstOptions(response);

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
        industryCodeText: codeText,
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

    const buildTreeDataFromFlat = (nodes: any[]): any[] => {
      const normalizedNodes = (nodes || [])
        .map(normalizeIndustryNode)
        .filter((item) => item.value !== '');
      const nodeMap = new Map<string, any>();
      normalizedNodes.forEach((item) => {
        nodeMap.set(String(item.value), { ...item, children: [] as any[] });
      });

      const roots: any[] = [];
      normalizedNodes.forEach((item) => {
        const current = nodeMap.get(String(item.value));
        const raw = item.raw || {};
        const explicitParent =
          raw?.parentCode
          ?? raw?.parent_code
          ?? raw?.pcode
          ?? raw?.p_code
          ?? raw?.pid
          ?? raw?.pId
          ?? raw?.parentId;
        let parentKey = explicitParent ? String(explicitParent).trim() : '';

        // 旧系统行业树通常是字母大类下挂编码子项，例如 C -> C22。
        if (!parentKey && /^[A-Z][0-9]/.test(current.value)) {
          parentKey = current.value.charAt(0);
        }

        if (parentKey && parentKey !== current.value && nodeMap.has(parentKey)) {
          const parent = nodeMap.get(parentKey);
          parent.children.push(current);
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
              : (Array.isArray(response?.data)
                ? response.data
                : []))));

      const hasNestedChildren = rawList.some((item: any) => Array.isArray(item?.children) && item.children.length > 0);
      setIndustryTreeData(hasNestedChildren ? buildTreeData(rawList) : buildTreeDataFromFlat(rawList));
    } catch (error) {
      console.error('获取行业编码树失败:', error);
      setIndustryTreeData([]);
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
              : (Array.isArray(response?.data)
                ? response.data
                : []))));

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

      // 强制按关键字过滤，避免接口未按关键字过滤时仍展示无关选项
      const trimmedKeyword = String(keyword || '').trim();
      if (trimmedKeyword) {
        options = options.filter((item: { label: string; value: string }) =>
          item.label.includes(trimmedKeyword),
        );
      }

      setProjSourceOptions(options);
    } catch (error) {
      console.error('获取市级机关推荐列表失败:', error);
      setProjSourceOptions([]);
    } finally {
      setProjSourceLoading(false);
    }
  };

  const handleSearchDistrictChange = (value?: string) => {
    if (value) {
      fetchZoneList(value, 'search');
    } else {
      setZones([]);
    }
    setTowns([]);
    form.setFieldsValue({ zoneCode: undefined, townCode: undefined });
  };

  const handleSearchZoneChange = (value?: string) => {
    if (value) {
      setSearchZoneSelected(true);
      fetchTownList(value, 'search');
    } else {
      setSearchZoneSelected(false);
      setTowns([]);
    }
    form.setFieldsValue({ townCode: undefined });
  };

  const handleEditDistrictChange = (value?: string) => {
    if (value) {
      fetchZoneList(value, 'edit');
    } else {
      setEditZones([]);
    }
    setEditTowns([]);
    editForm.setFieldsValue({ zone_code: undefined, town_code: undefined });
  };

  const handleEditZoneChange = (value?: string) => {
    if (value) {
      fetchTownList(value, 'edit');
    } else {
      setEditTowns([]);
    }
    editForm.setFieldsValue({ town_code: undefined });
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
            // 更新搜索表单和编辑表单的园区选项
            setZones([{
              label: zoneName,
              value: level4Info.zoneCode,
            }]);
            setEditZones([{
              label: zoneName,
              value: level4Info.zoneCode,
            }]);
          } else {
            // 园区级别用户，调用接口获取园区名称
            try {
              const zoneResponse = await request('/zsxt-api/tCommonDept/list', {
                method: 'POST',
                data: { deptCode: level4Info.zoneCode },
              });
              
              if (zoneResponse && zoneResponse.records && zoneResponse.records.length > 0) {
                zoneName = zoneResponse.records[0].deptName;
              }
            } catch (error) {
              console.error('获取园区名称失败:', error);
            }
            
            // 设置搜索表单和编辑表单的园区选项
            setZones([{
              label: zoneName,
              value: level4Info.zoneCode,
            }]);
            setEditZones([{
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
            setDistricts([{
              label: districtName,
              value: level4Info.districtCode,
            }]);
          }
          
          // 如果是镇街级别，设置编辑表单的镇街选项
          if (level4Info.isTownLevel && level4Info.townCode && level4Info.townName) {
            setEditTowns([{
              label: level4Info.townName,
              value: level4Info.townCode,
            }]);
          }
          
          // 设置搜索表单默认值
          const searchFormValues: any = {
            districtCode: level4Info.districtCode,
            zoneCode: level4Info.zoneCode,
          };
          
          // 如果是镇街级别，设置镇街默认值
          if (level4Info.isTownLevel && level4Info.townCode) {
            searchFormValues.townCode = level4Info.townCode;
          }
          
          form.setFieldsValue(searchFormValues);
          
          // 标记园区已选择
          setSearchZoneSelected(true);
        } catch (error) {
          console.error('获取市区/园区名称失败:', error);
        }
      } else {
        // 非 level=4 用户，加载市区列表
        fetchDistrictList();
      }
      
      // 检查是否为驻外机构角色
      const investorPlaceCode = await checkExternalOfficeRole();
      
      const params: any = {
        page: initialCurrent,
        pageSize: initialPageSize,
      };
      
      // 如果是驻外机构，添加投资方注册地筛选条件
      if (investorPlaceCode) {
        params.investorPlace = investorPlaceCode;
      }
      
      fetchData(params);
      fetchProjTypeOptions();
      fetchIndustryFirstOptions();
      fetchIndustryTreeData();
      fetchProjSourceOptions();
      fetchUserPermission();
      checkReadOnlyPermission();
    };
    
    init();
  }, []);

  // 获取用户权限级别
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

  // 获取用户权限级别
  const fetchUserPermission = async () => {
    try {
      const [level2Data, level3Data, level4Data] = await Promise.all([
        systemApi.getActiveAreaGrants({ level: [2] }),
        systemApi.getActiveAreaGrants({ level: [3] }),
        systemApi.getActiveAreaGrants({ level: [4] })
      ]);

      const level2Areas = level2Data?.areas || [];
      const level3Areas = level3Data?.areas || [];
      const level4Areas = level4Data?.areas || [];

      // 判断用户权限级别：优先级 2 > 3 > 4
      if (level2Areas.length > 0) {
        setUserPermissionLevel(2);
      } else if (level3Areas.length > 0) {
        setUserPermissionLevel(3);
      } else if (level4Areas.length > 0) {
        setUserPermissionLevel(4);
      } else {
        setUserPermissionLevel(null);
      }
    } catch (error) {
      console.error('获取用户权限失败:', error);
      setUserPermissionLevel(null);
    }
  };

  // 检查是否为只读用户（organization id 匹配活动地址字典）
  const checkReadOnlyPermission = async () => {
    try {
      // 获取用户 session 信息
      const sessionResponse = await request('/system-api/sso/session', {
        method: 'GET',
      });

      const organizations = sessionResponse?.organizations || [];
      if (organizations.length === 0) {
        setIsReadOnlyUser(false);
        return;
      }

      // 获取活动地址字典
      const dictResponse = await request('/system-api/dict/activityAddress/items?all=true', {
        method: 'GET',
      });

      const dictItems = dictResponse || [];
      const dictCodes = dictItems.map((item: any) => item.code);

      // 检查用户的 organization id 是否匹配字典中的 code
      const hasMatch = organizations.some((org: any) => dictCodes.includes(org.id));
      setIsReadOnlyUser(hasMatch);
    } catch (error) {
      console.error('检查只读权限失败:', error);
      setIsReadOnlyUser(false);
    }
  };

  // 判断是否有编辑删除权限
  const hasEditDeletePermission = (record: any): boolean => {
    // 如果是只读用户，没有编辑删除权限
    if (isReadOnlyUser) {
      return false;
    }

    // level 为 2（市级）时不做控制，始终有权限
    if (userPermissionLevel === 2) {
      return true;
    }

    // level 为 3 或 4 时需要判断
    if (userPermissionLevel === 3 || userPermissionLevel === 4) {
      // 如果 progress 字段没有值（null、undefined 或空字符串），可以编辑删除
      if (!record.progress && record.progress !== 0) {
        return true;
      }

      // 如果 progress 为 0，需要判断 check_status
      if (record.progress === 0) {
        // check_status 为 0 或 3 时可以编辑删除
        if (record.check_status === 0 || record.check_status === 3) {
          return true;
        }
      }

      // 其他情况无权限
      return false;
    }

    // 没有权限级别或其他情况，默认有权限
    return true;
  };

  const buildSignedSearchParams = (values: Record<string, any> = {}) => {
    const params: Record<string, any> = {};
    const dateFieldNames = [
      'signedStatDate',
      'regStatDate',
      'checkStatDate',
      'finishCheckDate',
      'startDateCommit',
      'completeDate',
    ];
    const queryFieldNameMap: Record<string, string> = {
      pType: 'ptype',
      hProgress: 'hprogress',
      bIndustry: 'bindustry',
    };

    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }
      const requestKey = queryFieldNameMap[key] || key;
      if (dateFieldNames.includes(key)) {
        if (Array.isArray(value) && value.length === 2 && value[0] && value[1]) {
          params[requestKey] = `${dayjs(value[0]).format('YYYY-MM-DD')} ~ ${dayjs(value[1]).format('YYYY-MM-DD')}`;
        }
        return;
      }
      params[requestKey] = value;
    });

    return params;
  };

  const hasUploadedFiles = (fileList: UploadFile[] = []) =>
    buildFilesPayload(fileList).length > 0;

  const onSearch = (values: any, page = 1, pageSize = pagination.pageSize) => {
    const newPageParams: any = {
      ...buildSignedSearchParams(values),
      page,
      pageSize,
    };
    
    // 如果是驻外机构，强制添加投资方注册地筛选条件
    if (isExternalOffice && externalOfficeInvestorPlace) {
      newPageParams.investorPlace = externalOfficeInvestorPlace;
    }
    
    setPagination({ ...pagination, current: page, pageSize });
    fetchData(newPageParams);
  };

  const handleExport = async () => {
      try {
        setExporting(true);
        const values = form.getFieldsValue();
        const exportParams = buildSignedSearchParams(values);

        const res = await request('/zsxt-api/tProjProjectSigned/exportExcel', {
          method: 'POST',
          data: exportParams,
        });

        if (!res || !res.path) {
          message.error('导出失败：未获取到文件路径');
          return;
        }

        // 直接使用返回的 path（同域，不需要拼接）
        const a = document.createElement('a');
        a.href = res.path;
        a.download = res.name || '签约项目导出.xlsx';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
        }, 100);

        message.success('导出成功');
      } catch (error: any) {
        message.error(error?.message || '导出失败');
      } finally {
        setExporting(false);
      }
  };

  const onReset = () => {
      form.resetFields();
      setZones([]);
      setTowns([]);
      setSearchZoneSelected(false);
      onSearch({});
  };

  const searchFieldLabelStyle: CSSProperties = {
    width: 120,
    paddingRight: 12,
    minHeight: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontWeight: 500,
    fontSize: '16px',
    color: '#1f1f1f',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  };

  const searchFieldControlStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
  };

  const signedProgressOptions = [
    { label: '已签约', value: '0' },
    { label: '在批', value: '10' },
    { label: '已注册', value: '1' },
    { label: '已备案', value: '5' },
    { label: '完成报批', value: '4' },
    { label: '在建（已开工）', value: '2' },
    { label: '已竣工', value: '3' },
  ];

  const getUserLevel = () => {
    try {
      const raw = localStorage.getItem('USER_INFO');
      const parsed = raw ? JSON.parse(raw) : null;
      return Number(parsed?.user_level || 0);
    } catch (error) {
      return 0;
    }
  };

  const getProgressModalState = (record: any) => {
    const progress = Number(record?.progress ?? 0);
    const checkStatus = Number(record?.check_status ?? 0);
    const userLevel = getUserLevel();

    let editableRegister = false;
    let editableBeian = false;
    let editableApproval = false;
    let editableBeginning = false;
    let editableEnd = false;
    let activeKey = '1';

    // 如果是只读用户，所有编辑功能都禁用
    if (isReadOnlyUser) {
      return {
        editableRegister: false,
        editableBeian: false,
        editableApproval: false,
        editableBeginning: false,
        editableEnd: false,
        activeKey: '1',
      };
    }

    if ((progress === 0 && checkStatus === 1) || (progress === 1 && checkStatus === 3)) {
      editableRegister = true;
      activeKey = '1';
    } else if ((progress === 1 && (checkStatus === 0 || checkStatus === 1 || checkStatus === 3)) || (progress === 5 && checkStatus === 3)) {
      editableBeian = true;
      activeKey = '1';
    } else if ((progress === 5 && checkStatus === 1) || (progress === 4 && checkStatus === 3)) {
      editableApproval = true;
      activeKey = '1';
    } else if ((progress === 4 && (checkStatus === 0 || checkStatus === 1 || checkStatus === 3)) || (progress === 2 && (checkStatus === 0 || checkStatus === 3))) {
      editableBeginning = true;
      activeKey = '2';
    } else if ((progress === 2 && checkStatus === 1) || (progress === 3 && (checkStatus === 0 || checkStatus === 3))) {
      editableEnd = true;
      activeKey = '3';
    }

    if (userLevel === 1 || userLevel === 2) {
      editableRegister = true;
      if (progress !== 0 && progress !== 1) {
        editableBeian = true;
      }
      if (progress !== 0 && progress !== 1 && progress !== 5) {
        editableApproval = true;
      }
    }

    return {
      editableRegister,
      editableBeian,
      editableApproval,
      editableBeginning,
      editableEnd,
      activeKey,
    };
  };

  const buildProgressInitialValues = (record: any) => {
    const today = dayjs().format('YYYY-MM-DD');
    const mergedRecord = record?._id ? { ...record, ...(progressDraftMap[record._id] || {}) } : record;
    return {
      ...mergedRecord,
      reg_stat_date: toDayjsValue(today), // 始终使用当前日期
      check_stat_date: toDayjsValue(mergedRecord?.check_stat_date || today),
      finish_check_date: toDayjsValue(mergedRecord?.finish_check_date || today),
      reg_date: toDayjsValue(mergedRecord?.reg_date),
      kg_zone_name: mergedRecord?.kgZydw || mergedRecord?.townName || mergedRecord?.zoneName || '',
      kg_name: mergedRecord?.kgXmmc || mergedRecord?.name || '',
      kg_investor: mergedRecord?.kgTzfmc || mergedRecord?.investor || '',
      kg_project_address: mergedRecord?.kgXmdz || mergedRecord?.projectAddress || `${mergedRecord?.district || ''}${mergedRecord?.zoneName || ''}`,
      kg_signed_date: toDayjsValue(mergedRecord?.kgQyrq || mergedRecord?.signedStatDate || mergedRecord?.signedDate),
      kg_b_industry: toStringEnumValue(mergedRecord?.kgXmlx || mergedRecord?.bindustry || '2'),
      kg_is_qflp: toYesNoValue(mergedRecord?.kgQflp || mergedRecord?.isQflp) || '否',
      kg_u_code: mergedRecord?.kgTyxydm || mergedRecord?.ucode || '',
      kg_desc: mergedRecord?.kgJsnr || mergedRecord?.desc || '',
      kg_industry_code: resolveIndustryTreeValue(
        mergedRecord?.kgHydm || mergedRecord?.industryCode,
        industryTreeData,
      ),
      kg_proj_type: resolveProjTypeTreeValue(
        mergedRecord?.kgCyfx || mergedRecord?.projType,
        projTypeTreeData,
      ),
      kg_invest_money: mergedRecord?.kgZtz || mergedRecord?.investMoney || undefined,
      kg_fixed_invest: mergedRecord?.kgGdzctz || mergedRecord?.fixedInvest || undefined,
      pzwh: mergedRecord?.pzwh || '',
      pzrq: toDayjsValue(mergedRecord?.pzrq),
      cxqk: mergedRecord?.cxqk || '',
      start_date_commit: toDayjsValue(mergedRecord?.start_date_commit),
      complete_date: toDayjsValue(mergedRecord?.complete_date),
      jg_is_zkc:
        toYesNoValue(mergedRecord?.jgIsZkc) ||
        (toYesNoValue(mergedRecord?.isKcProj) === '是' || toYesNoValue(mergedRecord?.kgIsZkc) === '是' ? '是' : '否'),
      kg_is_zkc: toYesNoValue(mergedRecord?.kgIsZkc) || '否',
      company_name: mergedRecord?.company_name || mergedRecord?._name || '',
      qy_total_num: mergedRecord?.qy_total_num || mergedRecord?.qyTotalNum || '',
      qy_sb_num: mergedRecord?.qy_sb_num || mergedRecord?.qySbNum || '',
      qy_tzyf_num: mergedRecord?.qy_tzyf_num || mergedRecord?.qyTzyfNum || '',
      qy_yf_money: mergedRecord?.qy_yf_money || mergedRecord?.qyYfMoney || '',
    };
  };

  useEffect(() => {
    if (!progressModalVisible) {
      return;
    }
    const modalState = getProgressModalState(currentRecord);
    setProgressTabKey(modalState.activeKey);
    progressForm.setFieldsValue(buildProgressInitialValues(currentRecord));
    const registerFiles = buildUploadFileListByCateCodes(currentRecord?.files || currentRecord?.imgs || [], ['1']);
    const beianFiles = buildUploadFileListByCateCodes(currentRecord?.files || currentRecord?.imgs || [], ['2']);
    const approvalFiles = buildUploadFileListByCateCodes(currentRecord?.files || currentRecord?.imgs || [], ['3']);
    const beginningFiles = buildUploadFileListByCateCodes(currentRecord?.files || currentRecord?.imgs || [], ['98']);
    const beginningRcFiles = buildUploadFileListByCateCodes(currentRecord?.files || currentRecord?.imgs || [], ['77']);
    const beginningKcFiles = buildUploadFileListByCateCodes(currentRecord?.files || currentRecord?.imgs || [], ['88']);
    const endFiles = buildUploadFileListByCateCodes(currentRecord?.files || currentRecord?.imgs || [], ['97']);
    setRegisterUploadFileList(registerFiles);
    setBeianUploadFileList(beianFiles);
    setApprovalUploadFileList(approvalFiles);
    setBeginningUploadFileList(beginningFiles);
    setBeginningRcUploadFileList(beginningRcFiles);
    setBeginningKcUploadFileList(beginningKcFiles);
    setEndUploadFileList(endFiles);
  }, [currentRecord, progressDraftMap, progressForm, progressModalVisible, projTypeTreeData]);

  useEffect(() => {
    if (!moneyModalVisible || !currentRecord?._id) {
      return;
    }
    const cachedRows = receivedMoneyMap[currentRecord._id] || currentRecord?.receivedMoneyRows || defaultReceivedMoneyRows;
    setReceivedMoneyRows(cachedRows);
    fetchProjMoneyList(currentRecord._id);
  }, [currentRecord?._id, moneyModalVisible]);

  useEffect(() => {
    if (!onlineApprovalModalVisible) {
      return;
    }
    onlineApprovalSearchForm.resetFields();
    fetchOnlineApprovalList({}, 1, onlineApprovalPagination.pageSize);
  }, [onlineApprovalModalVisible]);

  useEffect(() => {
    if (!engineeringApprovalModalVisible) {
      return;
    }
    engineeringApprovalSearchForm.resetFields();
    fetchEngineeringApprovalList({}, 1, engineeringApprovalPagination.pageSize);
  }, [engineeringApprovalModalVisible]);

  useEffect(() => {
    if (!editModalVisible) {
      return;
    }
    const allImages = [
      ...(currentRecord?.files || []),
      ...(currentRecord?.imgs || []),
      ...(currentRecord?.imgsList || []),
      ...(currentRecord?.imgArr || []),
    ];
    const reviewImages = currentRecord?.reviewFileArr || currentRecord?.review_file_arr || buildUploadFileListByCateCodes(allImages, ['99']);
    const supportImages = currentRecord?.imgArr || currentRecord?.supportFileArr || currentRecord?.support_file_arr || buildUploadFileListByCateCodes(allImages, ['0']);
    const kcImages = currentRecord?.kcFileArr || currentRecord?.kc_file_arr || buildUploadFileListByCateCodes(allImages, ['66']);
    setReviewUploadFileList(
      Array.isArray(reviewImages) && reviewImages.length && reviewImages[0]?.status
        ? reviewImages
        : buildUploadFileList(reviewImages),
    );
    setSupportUploadFileList(
      Array.isArray(supportImages) && supportImages.length && supportImages[0]?.status
        ? supportImages
        : buildUploadFileList(supportImages),
    );
    setKcUploadFileList(
      Array.isArray(kcImages) && kcImages.length && kcImages[0]?.status
        ? kcImages
        : buildUploadFileList(kcImages),
    );
  }, [currentRecord, editModalVisible]);

  useEffect(() => {
    if (!editModalVisible) {
      return;
    }
    // 显式覆盖表单值，避免 form 实例复用导致切换编辑对象时残留上一条数据
    editForm.setFieldsValue(getSignedProjectInitialValues());
  }, [editModalVisible, currentRecord, editForm, projTypeTreeData, industryTreeData]);

  useEffect(() => {
    if (!editModalVisible || currentRecord?._id || currentRecord?.id) {
      return;
    }

    let canceled = false;

    const fillDefaultLocationForAdd = async () => {
      let districtCode: string | undefined;
      let zoneCode: string | undefined;
      let townCode: string | undefined;

      // 如果是 level=4 用户，使用 level4User 的数据
      if (level4User) {
        districtCode = level4User.districtCode;
        zoneCode = level4User.zoneCode;
        townCode = level4User.townCode;
        
        // 重新设置 editZones 和 editTowns（因为关闭弹窗时会被清空）
        if (level4User.zoneName) {
          setEditZones([{
            label: level4User.zoneName,
            value: level4User.zoneCode,
          }]);
          console.log('重新设置editZones:', [{ label: level4User.zoneName, value: level4User.zoneCode }]);
        }
        
        if (level4User.isTownLevel && level4User.townCode && level4User.townName) {
          setEditTowns([{
            label: level4User.townName,
            value: level4User.townCode,
          }]);
        } else {
          setEditTowns([]);
        }
      } else {
        // 原有逻辑：使用 addLocationLocked 和 userDeptScope
        if (addLocationLocked.district && userDeptScope.districtCode) {
          const districtOptions = districts.length ? districts : await fetchDistrictList();
          if (canceled) return;
          districtCode = districtOptions.find((item) => item.value === userDeptScope.districtCode)?.value;
        }

        if (districtCode) {
          const zoneOptions = await fetchZoneList(districtCode, 'edit');
          if (canceled) return;
          if (addLocationLocked.zone && userDeptScope.zoneCode) {
            zoneCode = zoneOptions.find((item) => item.value === userDeptScope.zoneCode)?.value;
          }
        } else {
          setEditZones([]);
          setEditTowns([]);
        }

        if (zoneCode) {
          const townOptions = await fetchTownList(zoneCode, 'edit');
          if (canceled) return;
          if (addLocationLocked.town && userDeptScope.townCode) {
            townCode = townOptions.find((item) => item.value === userDeptScope.townCode)?.value;
          }
        } else {
          setEditTowns([]);
        }
      }

      // 使用 setTimeout 确保 editZones 和 editTowns 的状态更新已经生效
      setTimeout(() => {
        editForm.setFieldsValue({ district_code: districtCode, zone_code: zoneCode, town_code: townCode });
      }, 0);
    };

    fillDefaultLocationForAdd();
    return () => {
      canceled = true;
    };
  }, [editModalVisible, currentRecord, districts, editForm, addLocationLocked.district, addLocationLocked.zone, addLocationLocked.town, userDeptScope.districtCode, userDeptScope.zoneCode, userDeptScope.townCode, level4User]);

  // 监听项目类别变化，动态加载投资方注册地选项
  useEffect(() => {
    if (!editModalVisible) {
      return;
    }
    const pType = editForm.getFieldValue('p_type');
    if (pType === '1') {
      fetchInvestorPlaceOptions();
    } else if (pType === '2') {
      fetchForeignInvestorPlaceOptions();
    }
  }, [editModalVisible, editForm]);

  useEffect(() => {
    if (!editModalVisible) {
      return;
    }
    const districtCode = currentRecord?.district_code || currentRecord?.districtCode;
    const zoneCode = currentRecord?.zone_code || currentRecord?.zoneCode;
    
    // level=4 用户的园区选项已经在初始化时设置好了，不需要重新获取
    if (!level4User?.isLevel4) {
      if (districtCode) {
        fetchZoneList(districtCode, 'edit');
      } else {
        setEditZones([]);
      }
      if (zoneCode) {
        fetchTownList(zoneCode, 'edit');
      } else {
        setEditTowns([]);
      }
    }
  }, [currentRecord, editModalVisible]);

  // 单独处理镇街列表加载（包括 level4 用户）
  useEffect(() => {
    if (!editModalVisible || !currentRecord) {
      return;
    }
    const zoneCode = currentRecord?.zone_code || currentRecord?.zoneCode;
    const townCode = currentRecord?.town_code || currentRecord?.townCode;
    
    // 如果项目有园区code，就加载对应的镇街列表（无论是否为level4用户）
    if (zoneCode && townCode) {
      fetchTownList(zoneCode, 'edit');
    }
  }, [currentRecord, editModalVisible]);

  const searchRows = [
    [
      { label: '项目名称', name: 'name', node: <Input placeholder="" /> },
      { label: '项目类别', name: 'pType', node: <Select placeholder="请选择" allowClear options={[{ label: '内资', value: '1' }, { label: '外资', value: '2' }]} /> },
      { label: '当前进度', name: 'progress', node: <Select placeholder="请选择" allowClear options={signedProgressOptions} /> },
      { label: '历史进度', name: 'hProgress', node: <Select placeholder="请选择" allowClear options={signedProgressOptions} /> },
    ],
    [
      { label: '投资额', name: 'investMoney', node: <Select placeholder="全部" allowClear options={[{ label: '1亿(1000万美元)以上', value: '0' }, { label: '5亿(3000万美元)以上', value: '1' }, { label: '10亿(1亿美元)以上', value: '2' }]} /> },
      { label: '市区', name: 'districtCode', node: <Select placeholder="请选择" allowClear options={districts} onChange={handleSearchDistrictChange} disabled={level4User?.isLevel4} /> },
      { label: '园区', name: 'zoneCode', node: <Select placeholder="请先选择市区" allowClear options={zones} onChange={handleSearchZoneChange} disabled={level4User?.isLevel4 || zones.length === 0} /> },
      { label: '街镇', name: 'townCode', node: <Select placeholder={!searchZoneSelected ? "请先选择园区" : (towns.length === 0 ? "暂无镇街" : "请选择镇街")} allowClear options={towns} disabled={level4User?.isTownLevel || towns.length === 0} /> },
    ],
    [
      {
        label: '项目类型',
        name: 'projType',
        node: (
          <TreeSelect
            placeholder="项目类型"
            allowClear
            treeData={projTypeTreeData}
            showSearch
            treeNodeFilterProp="title"
            treeDefaultExpandAll
            treeLine
          />
        ),
      },
      { label: '项目编码', name: 'code', node: <Input placeholder="" /> },
      { label: '投资方名称', name: 'investor', node: <Input placeholder="" /> },
      { label: '投资方性质', name: 'investorType', node: <Select placeholder="请选择" allowClear options={investorTypeOptions} /> },
    ],
    [
      { label: '签约信息统计日期', name: 'signedStatDate', node: <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear placeholder={['开始日期', '结束日期']} /> },
      { label: '注册统计日期', name: 'regStatDate', node: <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear placeholder={['开始日期', '结束日期']} /> },
      { label: '备案统计日期', name: 'checkStatDate', node: <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear placeholder={['开始日期', '结束日期']} /> },
      {
        label: '行业编码',
        name: 'industryCode',
        node: (
          <TreeSelect
            placeholder="行业编码"
            allowClear
            treeData={industryTreeData}
            showSearch
            treeNodeFilterProp="title"
            treeDefaultExpandAll
            treeLine
          />
        ),
      },
    ],
    [
      { label: '完成报批统计日期', name: 'finishCheckDate', node: <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear placeholder={['开始日期', '结束日期']} /> },
      { label: '开工日期', name: 'startDateCommit', node: <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear placeholder={['开始日期', '结束日期']} /> },
      { label: '竣工日期', name: 'completeDate', node: <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear placeholder={['开始日期', '结束日期']} /> },
      { label: '所属行业', name: 'bIndustry', node: <Select placeholder="请选择" allowClear options={[{ label: '服务业', value: '1' }, { label: '工业', value: '2' }]} /> },
    ],
    [
      { label: '备注信息查询', name: 'remark', node: <Input placeholder="" /> },
      { label: '审核状态', name: 'checkStatus', node: <Select placeholder="请选择" allowClear options={[{ label: '待审核', value: '0' }, { label: '市级审核通过', value: '1' }, { label: '市区审核通过', value: '2' }, { label: '审核不通过', value: '3' }, { label: '保存未提交', value: '4' }]} /> },
      { label: '认定进度', name: 'rprogress', node: <Select placeholder="请选择" allowClear options={signedProgressOptions} /> },
      null,
    ],
  ];

  // 删除
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该签约项目吗？',
      onOk: async () => {
        try {
          await request('/zsxt-api/tProjProjectSigned/deleteById', {
            method: 'POST',
            data: { id: record._id || record.id },
          });
          message.success('删除成功');
          onSearch(form.getFieldsValue());
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 保存备注
  const handleSaveRemark = async (values: any) => {
      try {
          await request('/zsxt-api/tProjProjectSigned/saveRemarks', {
            method: 'POST',
            data: { ...values, id: currentRecord._id },
          });
          message.success('备注保存成功');
          setRemarkModalVisible(false);
          onSearch(form.getFieldsValue());
      } catch (error) {
          message.error('保存失败');
      }
  };

  const fetchSignedProjectDetail = async (record: any) => {
    const recordId = record?._id || record?.id;
    if (!recordId) {
      return normalizeSignedRecord(record);
    }
    const response = await request('/zsxt-api/tProjProjectSigned/findById', {
      method: 'POST',
      data: { id: recordId },
    });
    return normalizeSignedRecord(response?.data || response || record);
  };

  const openSignedProjectDetailModal = async (record: any, detailView: boolean) => {
    const requestSeq = ++detailRequestSeqRef.current;
    try {
      const detailRecord = await fetchSignedProjectDetail(record);
      if (requestSeq !== detailRequestSeqRef.current) {
        return;
      }
      setCurrentRecord(detailRecord);
      setIsDetailView(detailView);
      setEditModalVisible(true);
    } catch (error) {
      message.error('获取项目详情失败');
    }
  };

  const openSignedProjectProgressModal = async (record: any) => {
    const requestSeq = ++detailRequestSeqRef.current;
    try {
      const detailRecord = await fetchSignedProjectDetail(record);
      if (requestSeq !== detailRequestSeqRef.current) {
        return;
      }
      setCurrentRecord(detailRecord);
      try {
        await fetchBoundOnlineApprovalList(detailRecord?._id || detailRecord?.id);
      } catch (error) {
        setOnlineApprovalMap((prev) => ({
          ...prev,
          [detailRecord?._id || detailRecord?.id]: [],
        }));
      }
      try {
        await fetchBoundEngineeringApprovalList(detailRecord?._id || detailRecord?.id);
      } catch (error) {
        setEngineeringApprovalMap((prev) => ({
          ...prev,
          [detailRecord?._id || detailRecord?.id]: [],
        }));
      }
      setProgressModalVisible(true);
    } catch (error) {
      message.error('获取项目详情失败');
    }
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

  const columns = [
    {
      title: <TitleCom text={'序号'} icon={''} />,
      dataIndex: 'index',
      width: 80,
      align: 'center' as const,
      render: (_: unknown, _record: unknown, index: number) => index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: <TitleCom text={'市区'} icon={''} />,
      dataIndex: 'district',
      key: 'district',
      align: 'center' as const,
      width: 120,
    },
    {
      title: <TitleCom text={'园区名称'} icon={''} />,
      dataIndex: 'zone_name',
      key: 'zone_name',
      align: 'center' as const,
      width: 150,
    },
    {
      title: <TitleCom text={'镇街名称'} icon={''} />,
      dataIndex: 'town_name',
      key: 'town_name',
      align: 'center' as const,
      width: 120,
    },
    {
      title: <TitleCom text={'项目编码'} icon={''} />,
      dataIndex: '_code',
      key: '_code',
      align: 'center' as const,
      width: 120,
    },
    {
      title: <TitleCom text={'项目名称'} icon={''} />,
      dataIndex: '_name',
      key: '_name',
      align: 'left' as const,
      width: 200,
      render: (text: string, record: any) => (
          <a onClick={() => {
              openSignedProjectDetailModal(record, true);
          }}>{text}</a>
      )
    },
    {
      title: <TitleCom text={'投资额'} icon={''} />,
      dataIndex: 'invest_money',
      key: 'invest_money',
      align: 'center' as const,
      width: 120,
      render: (text: any, record: any) => {
          if (record.p_type == 1) return `${text || 0} 亿元`;
          if (record.p_type == 2) return <span style={{color: '#08aeef'}}>{text || 0} 万美元</span>;
          return text;
      }
    },
    {
      title: <TitleCom text={'类别'} icon={''} />,
      dataIndex: 'p_type',
      key: 'p_type',
      align: 'center' as const,
      width: 80,
      render: (text: any) => text == 1 ? '内资' : text == 2 ? <span style={{color: '#08aeef'}}>外资</span> : text,
    },
    {
      title: <TitleCom text={'评估状态'} icon={''} />,
      dataIndex: 'pgStatus',
      key: 'pgStatus',
      align: 'center' as const,
      width: 120,
      render: (text: any, record: any) => {
          if (text == 1) return '未评估';
          if (text == 2) return (
            <span 
              style={{color: '#52c41a', cursor: 'pointer', textDecoration: 'underline'}}
              onClick={() => fetchAssessmentDetail(record._id || record.id)}
            >
              已评估
            </span>
          );
          if (text == 3) return '无需评估';
          return '暂无';
      }
    },
    {
      title: <TitleCom text={'项目进度'} icon={''} />,
      dataIndex: 'progress',
      key: 'progress',
      align: 'center' as const,
      width: 120,
      render: (text: any) => {
          const map: Record<string, string> = {
              '0': '已签约', '10': '在批', '1': '已注册', '5': '已备案',
              '4': '完成报批', '2': '在建（已开工）', '3': '已竣工'
          };
          return map[text] || text;
      }
    },
    {
      title: <TitleCom text={'认定进度'} icon={''} />,
      dataIndex: 'rprogress',
      key: 'rprogress',
      align: 'center' as const,
      width: 120,
      render: (text: any) => {
          const map: Record<string, string> = {
              '0': '已签约', '10': '在批', '1': '已注册', '5': '已备案',
              '4': '完成报批', '2': '在建（已开工）', '3': '已竣工'
          };
          return map[text] || text;
      }
    },
    {
      title: <TitleCom text={'审核状态'} icon={''} />,
      dataIndex: 'check_status',
      key: 'check_status',
      align: 'center' as const,
      width: 120,
      render: (text: any, record: any) => {
          if (text == 3 || text === '3') {
            return (
              <span
                style={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() =>
                  Modal.info({
                    title: '审核驳回原因',
                    content: record.lastCheckDesc || record.last_check_desc || '无',
                    width: 560,
                  })
                }
              >
                审核不通过
              </span>
            );
          }
          const map: Record<string, any> = {
              '0': '待审核', '1': '市级审核通过', '2': '市区审核通过',
              '4': '保存未提交'
          };
          return map[text] || text;
      }
    },
    {
      title: <TitleCom text={'操作'} icon={''} />,
      valueType: 'option',
      align: 'center' as const,
      width: 380,
      fixed: 'right' as const,
      render: (_: any, record: any) => {
        // 如果是驻外机构角色，不显示任何操作按钮
        if (isExternalOffice) {
          return null;
        }
        
        const hasPermission = hasEditDeletePermission(record);
        
        // 如果是只读用户，只显示项目进度按钮
        if (isReadOnlyUser) {
          return (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {((record.progress === 0 && record.check_status == 1) || record.progress > 0) && (
                <div
                  style={{
                    cursor: 'not-allowed',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '85px',
                    height: '28px',
                    background: '#d9d9d9',
                    borderRadius: '14px',
                    fontSize: '12px',
                    color: '#fff',
                    opacity: 0.6,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    message.warning('您没有操作权限，只能查看');
                  }}
                >
                  <div>项目进度</div>
                  <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
                </div>
              )}
            </div>
          );
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
                background: '#52c41a',
                borderRadius: '14px',
                fontSize: '12px',
                color: '#fff',
              }}
              onClick={() => {
                setCurrentRecord(record);
                setRemarkModalVisible(true);
              }}
            >
              <div>备注</div>
              <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
            </div>
            {((record.progress === 0 && record.check_status == 1) || record.progress > 0) && (
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
                  openSignedProjectProgressModal(record);
                }}
              >
                <div>项目进度</div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
              </div>
            )}
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '85px',
                height: '28px',
                background: '#1890FF',
                borderRadius: '14px',
                fontSize: '12px',
                color: '#fff',
              }}
              onClick={() => {
                setCurrentRecord(record);
                setMoneyModalVisible(true);
              }}
            >
              <div>到账资金</div>
              <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
            </div>
            {hasPermission && (
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
                onClick={() => {
                  openSignedProjectDetailModal(record, false);
                }}
              >
                <div>编辑</div>
                <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
              </div>
            )}
            {hasPermission && (
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
            )}
          </div>
        );
      },
    },
  ];

  const progressUploads = getProgressUploads(currentRecord);
  const boundOnlineApprovalList = getBoundOnlineApprovalList(currentRecord);
  const boundEngineeringApprovalList = getBoundEngineeringApprovalList(currentRecord);

  return (
    <div style={{ display: 'flex' }}>
      <style>{`
        .signed-project-modal .ant-select,
        .signed-project-modal .ant-picker,
        .signed-project-modal .ant-input-number,
        .signed-project-modal .ant-input,
        .signed-project-modal .ant-input-affix-wrapper,
        .signed-project-modal textarea.ant-input {
          width: 100%;
        }

        .signed-project-modal .ant-input-number {
          min-width: 0;
        }

        .signed-project-modal .ant-modal {
          top: 16px;
          padding-bottom: 16px;
        }

        .signed-project-modal .ant-modal-content {
          height: calc(90vh - 32px);
          max-height: calc(90vh - 32px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .signed-project-modal .ant-modal-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
        }

        .online-approval-search-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px 28px;
          margin-bottom: 16px;
        }

        .online-approval-search-grid .ant-form-item {
          margin-bottom: 0;
        }

        .online-approval-search-grid .ant-form-item-label {
          min-width: 108px;
          padding-right: 8px;
        }

        .online-approval-search-grid .ant-form-item-label > label {
          white-space: normal;
          height: auto;
          line-height: 1.4;
          text-align: right;
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
        }

        .online-approval-detail-table {
          border-top: 1px solid #e9e9e9;
          border-left: 1px solid #e9e9e9;
        }

        .online-approval-detail-row {
          display: grid;
          grid-template-columns: 120px 1fr 120px 1fr;
        }

        .online-approval-detail-row.single {
          grid-template-columns: 120px 1fr;
        }

        .online-approval-detail-cell {
          min-height: 54px;
          padding: 12px 14px;
          border-right: 1px solid #e9e9e9;
          border-bottom: 1px solid #e9e9e9;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .online-approval-detail-label {
          background: #fafafa;
          color: #666;
          text-align: center;
        }

        @media (max-width: 1400px) {
          .online-approval-search-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 1100px) {
          .online-approval-search-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <PageContainer
        style={{
          width: '100%',
          height: '90vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content="欢迎使用签约项目模块"
      >
        <div style={{ padding: '20px', backgroundColor: 'white' }}>
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
            <Form form={form} onFinish={(values) => onSearch(values, 1, pagination.pageSize)} autoComplete="off">
              <div>
                {searchRows.slice(0, showMoreSearch ? searchRows.length : 2).map((row, rowIndex) => (
                  <Row key={rowIndex} gutter={16}>
                    {row.map((field, fieldIndex) => (
                      field ? (
                        <Col span={6} key={field.name}>
                          <Form.Item label={field.label} name={field.name}>
                            {field.node}
                          </Form.Item>
                        </Col>
                      ) : (
                        <Col span={6} key={`empty-${fieldIndex}`} />
                      )
                    ))}
                  </Row>
                ))}
              </div>

              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Form.Item style={{ marginTop: '22px', marginBottom: 0 }}>
                    <Space>
                      {!isExternalOffice && (
                        <Button
                          type="primary"
                          size="middle"
                          onClick={() => {
                              setCurrentRecord({});
                              setIsDetailView(false);
                              setEditModalVisible(true);
                          }}
                        >
                          新增项目
                        </Button>
                      )}
                      <Button type="primary" size="middle" loading={exporting} onClick={handleExport}>
                        导出
                      </Button>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button htmlType="button" onClick={() => setShowMoreSearchPersist((prev) => !prev)}>
                        {showMoreSearch ? '收起查询' : '更多查询'}
                      </Button>
                      <Button htmlType="button" onClick={onReset}>
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
            rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            rowKey="_id"
            columns={columns}
            bordered={true}
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
        </div>
      </PageContainer>

        {/* 编辑/新增 弹窗 */}
        <ModalForm
            title={currentRecord?._id ? (isDetailView ? '签约项目详情' : '编辑签约项目') : '添加签约项目'}
            open={editModalVisible}
            onOpenChange={(open) => {
                setEditModalVisible(open);
                if (!open) {
                    setIsDetailView(false);
                    setCurrentRecord(null);
                    editForm.resetFields();
                    // 不清空 editZones 和 editTowns，避免再次打开时出现显示 code 的问题
                    // setEditZones([]);
                    // setEditTowns([]);
                    setReviewUploadFileList([]);
                    setSupportUploadFileList([]);
                    setKcUploadFileList([]);
                }
            }}
            onFinish={async (values) => {
                const isEdit = Boolean(currentRecord?._id || currentRecord?.id);
                const isDraft = Boolean(values._isDraft);
                if (!isEdit && !isDraft) {
                    try {
                        await editForm.validateFields();
                    } catch (error) {
                        message.warning('请先完善新增信息必填项');
                        return false;
                    }
                }
                if (!isDraft) {
                    if (!hasUploadedFiles(reviewUploadFileList)) {
                        message.warning('请先上传项目情况分析和评审结果');
                        return false;
                    }
                    if (!hasUploadedFiles(supportUploadFileList)) {
                        message.warning('请先上传佐证材料');
                        return false;
                    }
                    if (values.is_kc_proj === '是' && !hasUploadedFiles(kcUploadFileList)) {
                        message.warning('请先上传科创证明材料');
                        return false;
                    }
                }
                const payload = buildSignedProjectSavePayload({
                    ...values,
                    fzList: fzList.map((item, index) => `${index + 1}、${item}`),
                });
                const requestUrl = isDraft
                  ? '/zsxt-api/tProjProjectSigned/saveTemp'
                  : isEdit
                    ? '/zsxt-api/tProjProjectSigned/update'
                    : '/zsxt-api/tProjProjectSigned/save';
                await request(requestUrl, {
                    method: 'POST',
                    data: payload,
                });
                message.success(isDraft ? '已存入草稿箱' : isEdit ? '编辑成功' : '提交成功');
                setEditModalVisible(false);
                onSearch(form.getFieldsValue());
                return true;
            }}
            initialValues={getSignedProjectInitialValues()}
            form={editForm}
            width={1000}
            disabled={isDetailView}
            modalProps={{ destroyOnClose: true, maskClosable: false, className: 'signed-project-modal signed-project-edit-modal' }}
            layout="horizontal"
            submitter={isDetailView ? false : {
                render: (props, dom) => {
                    const p = props as any;
                    return (
                        <Space>
                            <Button
                                onClick={() => {
                                    p.form?.resetFields();
                                    setEditModalVisible(false);
                                }}
                            >
                                取消
                            </Button>
                            {((currentRecord?.checkStatus ?? currentRecord?.check_status) === undefined || (currentRecord?.checkStatus ?? currentRecord?.check_status) === null || Number(currentRecord?.checkStatus ?? currentRecord?.check_status) >= 4) && (
                              <Button
                                  onClick={() => {
                                      handleSaveDraft();
                                  }}
                                  style={{ backgroundColor: '#00bfa5', color: 'white', borderColor: '#00bfa5' }}
                              >
                                  存入草稿箱
                              </Button>
                            )}
                              <Button type="primary" onClick={() => {
                                  if (p.form) {
                                      p.form.setFieldsValue({ _isDraft: false });
                                      if (p.submit) {
                                        p.submit();
                                      }
                                  }
                              }}>
                                  提交
                              </Button>
                        </Space>
                    );
                }
            }}
        >
                    <div style={{ color: 'red', marginBottom: 16, lineHeight: '1.8' }}>
                        <div>1、签约在5亿以上的项目，需走质态评估（市级部门预警）流程；金额在5亿以下的项目，无需走质态评估（市级部门预警）流程。</div>
                        <div>2、本次补录重点为亿元以上或涉及今年新签约、新开工、新竣工的项目，补录的项目无需重新生成协议。</div>
                        <div>3、项目开工、竣工认定，由项目专班进行审核。</div>
                    </div>

                    <div style={gridStyles.container}>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>市区
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormSelect
                                  name="district_code"
                                  options={districts}
                                  rules={[{ required: true }]}
                                  fieldProps={{
                                    onChange: handleEditDistrictChange,
                                    disabled: isDetailView || (!isEditMode && addLocationLocked.district) || level4User?.isLevel4,
                                  }}
                                  noStyle
                                />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>园区
                            </div>
                            <div style={gridStyles.contentLast}>
                                <Space>
                                    <ProFormSelect
                                      name="zone_code"
                                      placeholder="请选择园区"
                                      options={(() => {
                                        console.log('ProFormSelect渲染时的editZones:', editZones);
                                        return editZones;
                                      })()}
                                      rules={[{ required: true }]}
                                      fieldProps={{
                                        style: { width: 220 },
                                        onChange: handleEditZoneChange,
                                        disabled: isDetailView || (!isEditMode && addLocationLocked.zone) || level4User?.isLevel4 || editZones.length === 0,
                                      }}
                                      noStyle
                                    />
                                    <ProFormSelect
                                      name="town_code"
                                      placeholder="请选择街镇"
                                      options={editTowns}
                                      fieldProps={{
                                        style: { width: 160 },
                                        disabled: isDetailView || (!isEditMode && addLocationLocked.town) || level4User?.isTownLevel || editTowns.length === 0,
                                      }}
                                      noStyle
                                    />
                                </Space>
                            </div>
                        </div>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目名称
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormText name="_name" rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目类别
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormRadio.Group
                                    name="p_type"
                                    options={[{label: '内资', value: '1'}, {label: '外资', value: '2'}]}
                                    rules={[{ required: true }]}
                                    fieldProps={{
                                        onChange: (e) => {
                                            const nextValue = e?.target?.value;
                                            if (nextValue === '1') {
                                                editForm.setFieldsValue({ foreign_money: undefined });
                                                fetchInvestorPlaceOptions();
                                            } else if (nextValue === '2') {
                                                fetchForeignInvestorPlaceOptions();
                                            }
                                            // 清空投资方注册地的值
                                            editForm.setFieldsValue({ investor_place: undefined });
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
                                        <div style={gridStyles.label}>
                                            <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目总投资
                                        </div>
                                        <div style={gridStyles.content}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                                                <div style={{ flex: 1 }}>
                                                    <ProFormDigit name="invest_money" rules={[{ required: true }]} noStyle />
                                                </div>
                                                <span style={{ flexShrink: 0 }}>{isForeign ? '万美元' : '亿元'}</span>
                                            </div>
                                        </div>
                                        <div style={gridStyles.label}>
                                            <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>协议利用外资
                                        </div>
                                        <div style={gridStyles.contentLast}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                                                <div style={{ flex: 1 }}>
                                                    <ProFormDigit
                                                        name="foreign_money"
                                                        rules={isForeign ? [{ required: true }] : []}
                                                        fieldProps={{ disabled: !isForeign }}
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
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目类型
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormTreeSelect
                                  name="proj_type"
                                  placeholder="请选择项目类型"
                                  rules={[{ required: true }]}
                                  fieldProps={{
                                    treeData: projTypeTreeData,
                                    showSearch: true,
                                    treeNodeFilterProp: 'title',
                                    treeDefaultExpandAll: true,
                                    treeLine: true,
                                  }}
                                  noStyle
                                />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>产业大类名称
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect
                                  name="industry_first_code"
                                  options={industryFirstOptions}
                                  rules={[{ required: true, message: '请选择产业大类名称' }]}
                                  fieldProps={{ showSearch: true, optionFilterProp: 'label' }}
                                  noStyle
                                />
                            </div>
                        </div>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>行业编码
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormTreeSelect
                                  name="industry_code"
                                  placeholder="请选择行业编码"
                                  rules={[{ required: true, message: '请选择行业编码' }]}
                                  fieldProps={{
                                    treeData: industryTreeData,
                                    showSearch: true,
                                    treeNodeFilterProp: 'title',
                                    treeDefaultExpandAll: true,
                                    treeLine: true,
                                  }}
                                  noStyle
                                />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>所属行业
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormRadio.Group name="b_industry" options={[{label: '服务业', value: '1'}, {label: '工业', value: '2'}]} rules={[{ required: true }]} noStyle />
                            </div>
                        </div>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>投资方名称
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormText name="investor" rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>投资方性质
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect
                                  name="investor_type"
                                  options={investorTypeOptions}
                                  rules={[{ required: true }]}
                                  noStyle
                                />
                            </div>
                        </div>

                        <ProFormDependency name={['p_type']}>
                            {({ p_type }) => {
                                // 内资(1)时城市名称必填，外资(2)时非必填
                                const isForeign = p_type === '2';
                                return (
                                    <div style={gridStyles.row}>
                                        <div style={gridStyles.label}>
                                            <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>投资方注册地
                                        </div>
                                        <div style={gridStyles.content}>
                                            <ProFormSelect
                                                name="investor_place"
                                                options={p_type === '2' ? foreignInvestorPlaceOptions : investorPlaceOptions}
                                                rules={[{ required: true }]}
                                                noStyle
                                                placeholder={!p_type ? '请先选择项目类别' : '请选择'}
                                            />
                                        </div>
                                        <div style={gridStyles.label}>
                                            {!isForeign && <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>}城市名称
                                        </div>
                                        <div style={gridStyles.contentLast}>
                                            <ProFormText 
                                                name="placeInfo" 
                                                rules={isForeign ? [] : [{ required: true, message: '请输入城市名称' }]} 
                                                noStyle 
                                            />
                                        </div>
                                    </div>
                                );
                            }}
                        </ProFormDependency>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>是否属于上市企业
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormSelect name="is_listed" options={[{label: '是', value: '1'}, {label: '否', value: '2'}]} rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}></div>
                            <div style={gridStyles.contentLast}></div>
                        </div>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>是否高新技术企业
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormSelect name="is_gxjs" options={[{label: '是', value: '是'}, {label: '否', value: '否'}]} rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>是否有市外资金投入
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect name="has_municipal_capital" options={[{label: '是', value: '是'}, {label: '否', value: '否'}]} rules={[{ required: true }]} noStyle />
                            </div>
                        </div>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>股权比例
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormText name="equity_ratio" noStyle />
                            </div>
                            <div style={gridStyles.label}></div>
                            <div style={gridStyles.contentLast}></div>
                        </div>

                        <ProFormDependency name={['is_rzxq']}>
                            {({ is_rzxq }) => (
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}>
                                        <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>是否有融资需求
                                    </div>
                                    <div style={gridStyles.content}>
                                        <ProFormRadio.Group name="is_rzxq" options={[{label: '是', value: '是'}, {label: '否', value: '否'}]} rules={[{ required: true }]} noStyle />
                                    </div>
                                    {is_rzxq === '是' ? (
                                        <>
                                            <div style={gridStyles.label}>
                                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>融资金额
                                            </div>
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
                                        <div style={gridStyles.label}>
                                            <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>是否科创项目
                                        </div>
                                        <div style={gridStyles.content}>
                                            <ProFormRadio.Group
                                                name="is_kc_proj"
                                                options={[{label: '是', value: '是'}, {label: '否', value: '否'}]}
                                                rules={[{ required: true }]}
                                                fieldProps={{
                                                    onChange: (e) => {
                                                        if (e?.target?.value !== '是') {
                                                            editForm.setFieldsValue({ kc_proj_tj: '', kc_proj_type: undefined });
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
                                                    <ProFormText name="kc_proj_tj" placeholder="请输入" rules={[{ required: true }]} noStyle />
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
                                                        noStyle
                                                    />
                                                    <div style={{ color: 'red', fontSize: 12 }}>{getKcProofMessage(kc_proj_type)}</div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                          {renderUploadLinks(
                                                            kcUploadFileList,
                                                            (file) => setKcUploadFileList((prev) => prev.filter((item) => item.uid !== file.uid)),
                                                            !isDetailView,
                                                          )}
                                                        </div>
                                                        {!isDetailView && (
                                                            <Upload {...kcUploadProps}>
                                                                <Button type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#00bfa5', borderColor: '#00bfa5' }}>上传文件</Button>
                                                            </Upload>
                                                        )}
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
                                    <div style={gridStyles.label}>
                                        <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>QFLP外资项目
                                    </div>
                                    <div style={gridStyles.content}>
                                        <ProFormSelect name="is_qflp" options={[{label: '是', value: '是'}, {label: '否', value: '否'}]} rules={[{ required: true }]} noStyle />
                                    </div>
                                    <div style={gridStyles.label}>
                                        <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目信息来源
                                    </div>
                                    <div style={{ ...gridStyles.contentLast, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <ProFormRadio.Group
                                            name="b_resource"
                                            options={[{label: '自行接洽', value: '1'}, {label: '市级机关推荐', value: '2'}]}
                                            rules={[{ required: true }]}
                                            fieldProps={{
                                                onChange: (e) => {
                                                    if (e?.target?.value !== '2') {
                                                        editForm.setFieldsValue({ sjjg_name: undefined });
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
                                                  showSearch: true,
                                                  filterOption: false,
                                                  loading: projSourceLoading,
                                                  disabled: isDetailView,
                                                  onSearch: (value) => {
                                                    fetchProjSourceOptions(value);
                                                  },
                                                  onClear: () => {
                                                    fetchProjSourceOptions();
                                                  },
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
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目简介
                            </div>
                            <div style={{ ...gridStyles.contentLast, display: 'flex', flexDirection: 'column' }}>
                                <ProFormTextArea name="_desc" rules={[{ required: true }]} noStyle fieldProps={{ rows: 4 }} />
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>
                                    (填写包括：占地、建筑面积、设备、原料、工艺、产品、产能。参考格式：项目占地**亩，新建建筑面积**平方米（土建必填），计容面积**平方米，包括****，总投资***万，设备投资***万，购置***等设备多少台（套），主要原料有***，主要工艺有***，形成年产****。)
                                </div>
                            </div>
                        </div>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目选址位置
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormText name="project_address" rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预计开工时间
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDatePicker name="plan_start_date" rules={[{ required: true }]} noStyle fieldProps={{ style: { width: '100%' } }} />
                            </div>
                        </div>

                        <ProFormDependency name={['p_type']}>
                            {({ p_type }) => (
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}>
                                        <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预计竣工时间
                                    </div>
                                    <div style={gridStyles.content}>
                                        <ProFormDatePicker name="plan_end_date" rules={[{ required: true }]} noStyle fieldProps={{ style: { width: '100%' } }} />
                                    </div>
                                    <div style={gridStyles.label}>
                                        <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>注册资本（{p_type === '2' ? '万美元' : '万元'}）
                                    </div>
                                    <div style={gridStyles.contentLast}>
                                        <ProFormDigit name="zhuce_money" rules={[{ required: true }]} noStyle />
                                    </div>
                                </div>
                            )}
                        </ProFormDependency>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>签约日期
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormDatePicker name="signed_date" rules={[{ required: true }]} noStyle fieldProps={{ style: { width: '100%' } }} />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>签约信息统计日期
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDatePicker name="signed_stat_date" disabled noStyle fieldProps={{ style: { width: '100%' } }} initialValue={dayjs().format('YYYY-MM-DD')} />
                            </div>
                        </div>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>成效情况说明
                            </div>
                            <div style={{ ...gridStyles.contentLast, display: 'flex', flexDirection: 'column' }}>
                                <ProFormTextArea name="cg_remark" rules={[{ required: true }]} noStyle fieldProps={{ rows: 3 }} />
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>
                                    (请对照成效评估办法，补充其他需要说明的情况)
                                </div>
                            </div>
                        </div>

                         <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>产业关联度
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormSelect name="cy_gl" options={['强相关', '一般', '不相关']} noStyle />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>是否增资扩产项目
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect name="zjkc" options={['是', '否']} noStyle />
                            </div>
                        </div>
                    </div>

                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>准入条件</div>
                    <div style={gridStyles.container}>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>特殊行业
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormSelect name="tshy" options={[{label: '是', value: '是'}, {label: '否', value: '否'}]} rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>准入限制
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect name="zrxz" options={[{label: '有', value: '有'}, {label: '无', value: '无'}]} rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>两高项目
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormSelect name="lgxm" options={[{label: '是', value: '是'}, {label: '否', value: '否'}]} rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>重金属排放
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect name="zjspf" options={[{label: '有', value: '有'}, {label: '无', value: '无'}]} rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预计年耗能情况(吨标煤)
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormText name="total_use" rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预计年排污情况（废水、废气等）
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormText name="is_wuran" rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
                    </div>

                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>投资规模</div>
                    <div style={gridStyles.container}>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>申请用地面积（亩）
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormDigit name="sq_land_area" rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>已供面积（亩）
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDigit name="ygmj" rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>盘活面积（亩）
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormDigit name="phmj" rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>租赁厂房面积（平方米）
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDigit name="zl_land_area" rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
                        <ProFormDependency name={['p_type']}>
                            {({ p_type }) => (
                                <>
                                    <div style={gridStyles.row}>
                                        <div style={gridStyles.label}>
                                            <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>折算用地（亩）
                                        </div>
                                        <div style={gridStyles.content}>
                                            <ProFormDigit name="zs_land_area" rules={[{ required: true }]} noStyle />
                                        </div>
                                        <div style={gridStyles.label}>
                                            <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>计划总投资（{p_type === '2' ? '万美元' : '万元'}）
                                        </div>
                                        <div style={gridStyles.contentLast}>
                                            <ProFormDigit name="plan_total1" rules={[{ required: true }]} noStyle />
                                        </div>
                                    </div>
                                    <div style={gridStyles.row}>
                                        <div style={gridStyles.label}>
                                            <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>计划投资强度（{p_type === '2' ? '万美元' : '万元'}/亩）
                                        </div>
                                        <div style={gridStyles.content}>
                                            <ProFormDigit name="plan_invest_strong" rules={[{ required: true }]} noStyle />
                                        </div>
                                        <div style={gridStyles.label}>
                                            <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>固定资产投资（万元）
                                        </div>
                                        <div style={gridStyles.contentLast}>
                                            <ProFormDigit name="fixed_invest" rules={[{ required: true }]} noStyle />
                                        </div>
                                    </div>
                                    <div style={gridStyles.row}>
                                        <div style={gridStyles.label}>
                                            <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预计签约当年年度投资额（万元）
                                        </div>
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
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预期年均产值（万元）
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormDigit name="yq_cz1" rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预期年均开票销售（万元）
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDigit name="yq_kpxs1" rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预期年均税收（万元）
                            </div>
                            <div style={gridStyles.content}>
                                <ProFormDigit name="yq_ss1" rules={[{ required: true }]} noStyle />
                            </div>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>预期年均亩均税收（万元）
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDigit name="yq_mjtax1" rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
                    </div>

                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>市（区）联合评审结论</div>
                    <div style={gridStyles.container}>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>各市（区）联合评审结论
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormSelect name="zhpg" options={['优秀', '良好', '一般']} rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目情况分析和评审结果
                            </div>
                            <div style={{ ...gridStyles.contentLast, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  {renderUploadLinks(
                                    reviewUploadFileList,
                                    (file) => setReviewUploadFileList((prev) => prev.filter((item) => item.uid !== file.uid)),
                                    !isDetailView,
                                  )}
                                </div>
                                {!isDetailView && (
                                    <Upload {...reviewUploadProps}>
                                        <Button type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#00bfa5', borderColor: '#00bfa5' }}>上传文件</Button>
                                    </Upload>
                                )}
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>市级部门风险提示</div>
                            <div style={gridStyles.contentLast}>
                                <ProFormTextArea
                                  name="tzfFx"
                                  placeholder="自动同步，无需填写"
                                  fieldProps={{ rows: 4, disabled: true }}
                                  noStyle
                                />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目签约协议招商方
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormText name="zsf" rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目签约协议投资方
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormText name="tzf" rules={[{ required: true }]} noStyle />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>项目签约协议投资地址
                            </div>
                            <div style={gridStyles.contentLast}>
                                <ProFormText name="tzdz" rules={[{ required: true }]} noStyle />
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
                                            disabled: isDetailView,
                                        }}
                                        noStyle
                                    />
                                    {!isDetailView && (
                                        <Button type="primary" onClick={addFz} style={{ marginTop: 8, backgroundColor: '#00bfa5', borderColor: '#00bfa5' }}>
                                            添加附则
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>
                                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>佐证材料
                            </div>
                            <div style={{ ...gridStyles.contentLast, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  {renderUploadLinks(
                                    supportUploadFileList,
                                    (file) => setSupportUploadFileList((prev) => prev.filter((item) => item.uid !== file.uid)),
                                    !isDetailView,
                                  )}
                                </div>
                                {!isDetailView && (
                                    <Space>
                                        <Button type="primary" onClick={handleGenerateAgreement} style={{ backgroundColor: '#00bfa5', borderColor: '#00bfa5' }}>生成协议</Button>
                                        <Upload {...supportUploadProps}>
                                            <Button type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#00bfa5', borderColor: '#00bfa5' }}>上传文件</Button>
                                        </Upload>
                                    </Space>
                                )}
                            </div>
                        </div>
                    </div>
        </ModalForm>

        {/* 报批/开工/竣工 弹窗 */}
        <ModalForm
            title="项目进度管理"
            form={progressForm}
            open={progressModalVisible}
            onOpenChange={(open) => {
                setProgressModalVisible(open);
                if (!open) {
                    progressForm.resetFields();
                    setProgressTabKey('1');
                    setRegisterUploadFileList([]);
                    setBeianUploadFileList([]);
                    setApprovalUploadFileList([]);
                    setBeginningUploadFileList([]);
                    setBeginningRcUploadFileList([]);
                    setBeginningKcUploadFileList([]);
                    setEndUploadFileList([]);
                }
            }}
            onFinish={async () => {
                 message.success('保存成功 (演示)');
                 setProgressModalVisible(false);
            }}
            initialValues={buildProgressInitialValues(currentRecord)}
            width={760}
            modalProps={{ destroyOnClose: true, maskClosable: false, className: 'signed-project-modal', zIndex: 1000 }}
            submitter={false}
        >
            <Tabs activeKey={progressTabKey} onChange={setProgressTabKey}>
                <Tabs.TabPane tab="报批信息" key="1">
                    <ProFormDependency name={[]}>
                        {() => {
                            const state = getProgressModalState(currentRecord);
                            return (
                    <div style={{ borderLeft: '1px solid #e5e7eb', marginLeft: 8, paddingLeft: 14 }}>
                        <div style={{ position: 'relative', marginBottom: 18 }}>
                            <div style={{ position: 'absolute', left: -20, top: 6, width: 10, height: 10, borderRadius: '50%', border: '1px solid #52c41a', background: '#fff' }} />
                            <div style={{ fontWeight: 600, marginBottom: 10 }}>公司注册</div>
                            <div style={{ ...gridStyles.container, opacity: state.editableRegister ? 1 : 0.72 }}>
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}>统一社会信用代码<span style={{ color: '#ff4d4f' }}>*</span></div>
                                    <div style={gridStyles.content}>
                                        <ProFormText name="u_code" fieldProps={{ disabled: !state.editableRegister }} noStyle />
                                    </div>
                                    <div style={gridStyles.label}>注册公司名称<span style={{ color: '#ff4d4f' }}>*</span></div>
                                    <div style={gridStyles.contentLast}>
                                        <ProFormText name="company_name" fieldProps={{ disabled: !state.editableRegister }} noStyle />
                                    </div>
                                </div>
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}>注册资金(亿元)<span style={{ color: '#ff4d4f' }}>*</span></div>
                                    <div style={gridStyles.contentLast}>
                                        <div style={{ width: 150 }}>
                                            <ProFormDigit name="reg_money" fieldProps={{ disabled: !state.editableRegister, style: { width: '100%' } }} noStyle />
                                        </div>
                                    </div>
                                </div>
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}>注册日期<span style={{ color: '#ff4d4f' }}>*</span></div>
                                    <div style={gridStyles.content}>
                                        <ProFormDatePicker name="reg_date" noStyle fieldProps={{ style: { width: '100%' }, disabled: !state.editableRegister }} />
                                    </div>
                                    <div style={gridStyles.label}>注册信息统计日期<span style={{ color: '#ff4d4f' }}>*</span></div>
                                    <div style={gridStyles.contentLast}>
                                        <ProFormDatePicker name="reg_stat_date" noStyle fieldProps={{ style: { width: '100%' }, disabled: true }} />
                                    </div>
                                </div>
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}>佐证资料（营业执照）<span style={{ color: '#ff4d4f' }}>*</span></div>
                                    <div style={gridStyles.contentLast}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                              {renderUploadLinks(
                                                registerUploadFileList,
                                                (file) => setRegisterUploadFileList((prev) => prev.filter((item) => item.uid !== file.uid)),
                                                state.editableRegister,
                                              )}
                                            </div>
                                            <Upload {...registerUploadProps} disabled={!state.editableRegister}>
                                                <Button disabled={!state.editableRegister} type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }}>上传文件</Button>
                                            </Upload>
                                        </div>
                                    </div>
                                </div>
                                <div style={gridStyles.row}>
                                    <div style={{ ...gridStyles.contentLast, display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                                        <Button disabled={!state.editableRegister} type="primary" onClick={() => handleProgressStageSubmit('register')}>提交</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ position: 'relative', marginBottom: 18 }}>
                            <div style={{ position: 'absolute', left: -20, top: 6, width: 10, height: 10, borderRadius: '50%', border: '1px solid #52c41a', background: '#fff' }} />
                            <div style={{ fontWeight: 600, marginBottom: 10 }}>备案信息</div>
                            <div style={{ ...gridStyles.container, opacity: state.editableBeian ? 1 : 0.72 }}>
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}>备案信息统计日期<span style={{ color: '#ff4d4f' }}>*</span></div>
                                    <div style={gridStyles.contentLast}>
                                        <ProFormDatePicker name="check_stat_date" noStyle fieldProps={{ style: { width: '100%' }, disabled: !state.editableBeian }} />
                                    </div>
                                </div>
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}>佐证资料（项目备案（核准）文件）<span style={{ color: '#ff4d4f' }}>*</span></div>
                                    <div style={gridStyles.contentLast}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                              {renderUploadLinks(
                                                beianUploadFileList,
                                                (file) => setBeianUploadFileList((prev) => prev.filter((item) => item.uid !== file.uid)),
                                                state.editableBeian,
                                              )}
                                            </div>
                                            <Upload {...beianUploadProps} disabled={!state.editableBeian}>
                                                <Button disabled={!state.editableBeian} type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }}>上传文件</Button>
                                            </Upload>
                                        </div>
                                    </div>
                                </div>
                                <div style={gridStyles.row}>
                                    <div style={{ ...gridStyles.contentLast, display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                                        <Button disabled={!state.editableBeian} type="primary" style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }} onClick={() => handleProgressBind('online')}>绑定在线审批项目</Button>
                                        <Button disabled={!state.editableBeian || !boundOnlineApprovalList.length} type="primary" onClick={() => handleProgressStageSubmit('beian')}>提交</Button>
                                    </div>
                                </div>
                                {boundOnlineApprovalList.map((item: any, index: number) => (
                                  <div key={item.id || index} style={{ ...gridStyles.row, display: 'block' }}>
                                      <div style={{ borderBottom: '1px solid #f0f0f0' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
                                              <div style={{ color: '#666', fontWeight: 600 }}>备案证</div>
                                              <div style={{ display: 'flex', gap: 8 }}>
                                                  <Button
                                                    type="primary"
                                                    size="small"
                                                    onClick={() => {
                                                      setOnlineApprovalDetailRecord(item);
                                                      setOnlineApprovalDetailVisible(true);
                                                    }}
                                                  >
                                                    详情
                                                  </Button>
                                                  <Button
                                                    type="primary"
                                                    size="small"
                                                    disabled={[2, 3, 4, 5].includes(Number(currentRecord?.progress))}
                                                    onClick={() => handleUnbindOnlineApproval(item)}
                                                  >
                                                    解绑
                                                  </Button>
                                              </div>
                                          </div>
                                          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 180px 1fr', borderTop: '1px solid #f0f0f0' }}>
                                              <div style={{ ...gridStyles.label, width: '100%', flex: 'none', borderBottom: 'none', borderLeft: 'none' }}>备案（核准）项目代码</div>
                                              <div style={{ ...gridStyles.content, width: '100%', flex: 'none', borderLeft: 'none' }}>
                                                  <Input value={item.project_code || ''} disabled />
                                              </div>
                                              <div style={{ ...gridStyles.label, width: '100%', flex: 'none', borderBottom: 'none' }}>备案（核准）项目名称</div>
                                              <div style={{ ...gridStyles.contentLast, width: '100%', flex: 'none' }}>
                                                  <Input value={item.project_name || ''} disabled />
                                              </div>
                                              <div style={{ ...gridStyles.label, width: '100%', flex: 'none', borderLeft: 'none' }}>备案（核准）投资总额（万元）</div>
                                              <div style={{ ...gridStyles.content, width: '100%', flex: 'none', borderLeft: 'none' }}>
                                                  <Input value={item.total_investment || ''} disabled />
                                              </div>
                                              <div style={{ ...gridStyles.label, width: '100%', flex: 'none' }}>备案（核准）日期</div>
                                              <div style={{ ...gridStyles.contentLast, width: '100%', flex: 'none' }}>
                                                  <Input value={item.application_time || ''} disabled />
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: -20, top: 6, width: 10, height: 10, borderRadius: '50%', border: '1px solid #52c41a', background: '#fff' }} />
                            <div style={{ fontWeight: 600, marginBottom: 10 }}>报批</div>
                            <div style={{ ...gridStyles.container, opacity: state.editableApproval ? 1 : 0.72 }}>
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}>完成报批统计日期<span style={{ color: '#ff4d4f' }}>*</span></div>
                                    <div style={gridStyles.contentLast}>
                                        <ProFormDatePicker name="finish_check_date" noStyle fieldProps={{ style: { width: '100%' }, disabled: !state.editableApproval }} />
                                    </div>
                                </div>
                                <div style={gridStyles.row}>
                                    <div style={gridStyles.label}>佐证资料<span style={{ color: '#ff4d4f' }}>*</span></div>
                                    <div style={gridStyles.contentLast}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                              {renderUploadLinks(
                                                approvalUploadFileList,
                                                (file) => setApprovalUploadFileList((prev) => prev.filter((item) => item.uid !== file.uid)),
                                                state.editableApproval,
                                              )}
                                            </div>
                                            <Upload {...approvalUploadProps} disabled={!state.editableApproval}>
                                                <Button disabled={!state.editableApproval} type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }}>上传文件</Button>
                                            </Upload>
                                        </div>
                                    </div>
                                </div>
                                <div style={gridStyles.row}>
                                    <div style={{ ...gridStyles.contentLast, display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                                        <Button disabled={!state.editableApproval} type="primary" style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }} onClick={() => handleProgressBind('engineering')}>绑定工程审批项目</Button>
                                        <Button disabled={!state.editableApproval || !boundEngineeringApprovalList.length} type="primary" onClick={() => handleProgressStageSubmit('approval')}>提交</Button>
                                    </div>
                                </div>
                                {boundEngineeringApprovalList.map((item: any, index: number) => (
                                  <div key={item.id || index} style={{ ...gridStyles.row, display: 'block' }}>
                                      <div style={{ borderBottom: '1px solid #f0f0f0' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
                                              <div style={{ color: '#666', fontWeight: 600 }}>报批证</div>
                                              <div style={{ display: 'flex', gap: 8 }}>
                                                  <Button
                                                    type="primary"
                                                    size="small"
                                                    onClick={() => {
                                                      setEngineeringApprovalDetailRecord(item);
                                                      setEngineeringApprovalDetailVisible(true);
                                                    }}
                                                  >
                                                    详情
                                                  </Button>
                                                  <Button
                                                    type="primary"
                                                    size="small"
                                                    disabled={[2, 3, 4].includes(Number(currentRecord?.progress))}
                                                    onClick={() => handleUnbindEngineeringApproval(item)}
                                                  >
                                                    解绑
                                                  </Button>
                                              </div>
                                          </div>
                                          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 180px 1fr', borderTop: '1px solid #f0f0f0' }}>
                                              <div style={{ ...gridStyles.label, width: '100%', flex: 'none', borderBottom: 'none', borderLeft: 'none' }}>项目代码</div>
                                              <div style={{ ...gridStyles.content, width: '100%', flex: 'none', borderLeft: 'none' }}>
                                                  <Input value={item.project_code || ''} disabled />
                                              </div>
                                              <div style={{ ...gridStyles.label, width: '100%', flex: 'none', borderBottom: 'none' }}>项目名称</div>
                                              <div style={{ ...gridStyles.contentLast, width: '100%', flex: 'none' }}>
                                                  <Input value={item.project_name || ''} disabled />
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                ))}
                            </div>
                        </div>
                    </div>
                            );
                        }}
                    </ProFormDependency>
                </Tabs.TabPane>

                <Tabs.TabPane tab="开工信息" key="2">
                    <ProFormDependency name={['kg_is_zkc', 'is_kc_proj', 'kc_proj_type']}>
                        {({ kg_is_zkc, is_kc_proj, kc_proj_type }) => {
                            const state = getProgressModalState(currentRecord);
                            const showRcProof = is_kc_proj === '是' && kc_proj_type === '高层次人才类';
                            return (
                    <div style={{ ...gridStyles.container, opacity: state.editableBeginning ? 1 : 0.72 }}>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>是否为签约工业、服务业项目转科创项目<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.contentLast}>
                                <ProFormRadio.Group name="kg_is_zkc" options={['是', '否']} fieldProps={{ disabled: !state.editableBeginning }} noStyle />
                            </div>
                        </div>
                        {showRcProof && (
                          <div style={gridStyles.row}>
                              <div style={gridStyles.label}>人才实际出资证明材料<span style={{ color: '#ff4d4f' }}>*</span></div>
                              <div style={gridStyles.contentLast}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        {renderUploadLinks(
                                          beginningRcUploadFileList,
                                          (file) => setBeginningRcUploadFileList((prev) => prev.filter((item) => item.uid !== file.uid)),
                                          state.editableBeginning,
                                        )}
                                      </div>
                                      <Upload {...beginningRcUploadProps} disabled={!state.editableBeginning}>
                                        <Button disabled={!state.editableBeginning} type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }}>
                                          上传文件
                                        </Button>
                                      </Upload>
                                  </div>
                              </div>
                          </div>
                        )}
                        {kg_is_zkc === '是' && (
                          <div style={gridStyles.row}>
                              <div style={gridStyles.label}>符合科创项目条件的证明材料<span style={{ color: '#ff4d4f' }}>*</span></div>
                              <div style={gridStyles.contentLast}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        {renderUploadLinks(
                                          beginningKcUploadFileList,
                                          (file) => setBeginningKcUploadFileList((prev) => prev.filter((item) => item.uid !== file.uid)),
                                          state.editableBeginning,
                                        )}
                                      </div>
                                      <Upload {...beginningKcUploadProps} disabled={!state.editableBeginning}>
                                        <Button disabled={!state.editableBeginning} type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }}>
                                          上传文件
                                        </Button>
                                      </Upload>
                                  </div>
                              </div>
                          </div>
                        )}
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>招引单位<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.content}><ProFormText name="kg_zone_name" fieldProps={{ disabled: true }} noStyle /></div>
                            <div style={gridStyles.label}>项目名称<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.contentLast}><ProFormText name="kg_name" fieldProps={{ disabled: !state.editableBeginning }} noStyle /></div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>投资方名称<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.content}><ProFormText name="kg_investor" fieldProps={{ disabled: !state.editableBeginning }} noStyle /></div>
                            <div style={gridStyles.label}>项目地址<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.contentLast}><ProFormText name="kg_project_address" fieldProps={{ disabled: !state.editableBeginning }} noStyle /></div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>签约日期<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.content}><ProFormDatePicker name="kg_signed_date" noStyle fieldProps={{ style: { width: '100%' }, disabled: !state.editableBeginning }} /></div>
                            <div style={gridStyles.label}>项目类型<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.contentLast}><ProFormRadio.Group name="kg_b_industry" options={[{ label: '服务业', value: '1' }, { label: '工业', value: '2' }]} fieldProps={{ disabled: true }} noStyle /></div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>QFLP外资项目<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.content}><ProFormSelect name="kg_is_qflp" options={['是', '否']} fieldProps={{ disabled: !state.editableBeginning }} noStyle /></div>
                            <div style={gridStyles.label}>统一社会信用代码<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.contentLast}><ProFormText name="kg_u_code" fieldProps={{ disabled: !state.editableBeginning }} noStyle /></div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>主要产品、产能及主要建设内容<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.content}><ProFormText name="kg_desc" fieldProps={{ disabled: !state.editableBeginning }} noStyle /></div>
                            <div style={gridStyles.label}>行业分类及代码<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.contentLast}>
                                <ProFormTreeSelect
                                  name="kg_industry_code"
                                  noStyle
                                  fieldProps={{
                                    disabled: !state.editableBeginning,
                                    treeData: industryTreeData,
                                    showSearch: true,
                                    treeNodeFilterProp: 'title',
                                    treeDefaultExpandAll: true,
                                    treeLine: true,
                                    popupMatchSelectWidth: false,
                                    dropdownStyle: { minWidth: 560, maxWidth: 760, maxHeight: 420, overflow: 'auto' },
                                    placeholder: '请选择行业编码',
                                    allowClear: true,
                                    style: { width: '100%' },
                                  }}
                                />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>产业方向<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.content}>
                                <ProFormTreeSelect
                                  name="kg_proj_type"
                                  noStyle
                                  fieldProps={{
                                    disabled: !state.editableBeginning,
                                    treeData: projTypeTreeData,
                                    showSearch: true,
                                    treeNodeFilterProp: 'title',
                                    treeDefaultExpandAll: true,
                                    treeLine: true,
                                    placeholder: '请选择项目类型',
                                    allowClear: true,
                                    popupMatchSelectWidth: false,
                                    dropdownStyle: { minWidth: 560, maxWidth: 760, maxHeight: 420, overflow: 'auto' },
                                    style: { width: '100%' },
                                  }}
                                />
                            </div>
                            <div style={gridStyles.label}>总投资（亿元）<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.contentLast}><ProFormDigit name="kg_invest_money" fieldProps={{ disabled: !state.editableBeginning }} noStyle /></div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>固定资产投资（万元）<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.content}><ProFormDigit name="kg_fixed_invest" fieldProps={{ disabled: !state.editableBeginning }} noStyle /></div>
                            <div style={gridStyles.label}>批准部门及文号<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.contentLast}><ProFormText name="pzwh" fieldProps={{ disabled: !state.editableBeginning }} noStyle /></div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>批准日期<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.content}><ProFormDatePicker name="pzrq" noStyle fieldProps={{ style: { width: '100%' }, disabled: !state.editableBeginning }} /></div>
                            <div style={gridStyles.label}>成效情况说明<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.contentLast}><ProFormText name="cxqk" fieldProps={{ disabled: !state.editableBeginning }} noStyle /></div>
                        </div>
                        <div style={gridStyles.row}>
                                    <div style={gridStyles.label}>佐证材料<span style={{ color: '#ff4d4f' }}>*</span></div>
                                    <div style={gridStyles.contentLast}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                              {renderUploadLinks(
                                                beginningUploadFileList,
                                                (file) => setBeginningUploadFileList((prev) => prev.filter((item) => item.uid !== file.uid)),
                                                state.editableBeginning,
                                              )}
                                            </div>
                                            <Upload {...beginningUploadProps} disabled={!state.editableBeginning}>
                                                <Button disabled={!state.editableBeginning} type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }}>上传文件</Button>
                                            </Upload>
                                        </div>
                                    </div>
                                </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>开工日期<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDatePicker name="start_date_commit" noStyle fieldProps={{ style: { width: '100%' }, disabled: !state.editableBeginning }} />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={{ ...gridStyles.contentLast, display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                                <Button disabled={!state.editableBeginning} type="primary" onClick={() => handleProgressStageSubmit('beginning')}>开工确认</Button>
                            </div>
                        </div>
                    </div>
                            );
                        }}
                    </ProFormDependency>
                </Tabs.TabPane>

                <Tabs.TabPane tab="竣工信息" key="3">
                    <ProFormDependency name={['jg_is_zkc', 'is_kc_proj', 'kg_is_zkc']}>
                        {({ jg_is_zkc, is_kc_proj, kg_is_zkc }) => {
                            const state = getProgressModalState(currentRecord);
                            const autoShowQyInfo = is_kc_proj === '是' || kg_is_zkc === '是';
                            const showJgSelector = !autoShowQyInfo;
                            const showQyInfo = autoShowQyInfo || jg_is_zkc === '是';
                            return (
                    <div style={{ ...gridStyles.container, opacity: state.editableEnd ? 1 : 0.72 }}>
                        {showJgSelector && (
                          <div style={gridStyles.row}>
                              <div style={gridStyles.label}>是否为签约工业、服务业项目转科创项目<span style={{ color: '#ff4d4f' }}>*</span></div>
                              <div style={gridStyles.contentLast}>
                                  <ProFormRadio.Group name="jg_is_zkc" options={['是', '否']} fieldProps={{ disabled: !state.editableEnd }} noStyle />
                              </div>
                          </div>
                        )}
                        {showQyInfo && (
                          <>
                            <div style={gridStyles.row}>
                                <div style={gridStyles.label}>企业总人数<span style={{ color: '#ff4d4f' }}>*</span></div>
                                <div style={gridStyles.content}>
                                    <ProFormText name="qy_total_num" fieldProps={{ disabled: !state.editableEnd }} noStyle />
                                </div>
                                <div style={gridStyles.label}>缴纳社保2个月以上人数<span style={{ color: '#ff4d4f' }}>*</span></div>
                                <div style={gridStyles.contentLast}>
                                    <ProFormText name="qy_sb_num" fieldProps={{ disabled: !state.editableEnd }} noStyle />
                                </div>
                            </div>
                            <div style={gridStyles.row}>
                                <div style={gridStyles.label}>企业在泰研发人数<span style={{ color: '#ff4d4f' }}>*</span></div>
                                <div style={gridStyles.content}>
                                    <ProFormText name="qy_tzyf_num" fieldProps={{ disabled: !state.editableEnd }} noStyle />
                                </div>
                                <div style={gridStyles.label}>企业当年度研发投入（万元）<span style={{ color: '#ff4d4f' }}>*</span></div>
                                <div style={gridStyles.contentLast}>
                                    <ProFormText name="qy_yf_money" fieldProps={{ disabled: !state.editableEnd }} noStyle />
                                </div>
                            </div>
                          </>
                        )}
                        <div style={gridStyles.row}>
                                    <div style={gridStyles.label}>佐证材料<span style={{ color: '#ff4d4f' }}>*</span></div>
                                    <div style={gridStyles.contentLast}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                {showQyInfo && (
                                                  <div style={{ color: 'red', marginBottom: 8 }}>除上传竣工所需佐证材料外，还需上传如下证明材料：企业缴纳社保参保单、专利证书或受理通知书证明材料</div>
                                                )}
                                                {renderUploadLinks(
                                                  endUploadFileList,
                                                  (file) => setEndUploadFileList((prev) => prev.filter((item) => item.uid !== file.uid)),
                                                  state.editableEnd,
                                                )}
                                            </div>
                                            <Upload {...endUploadProps} disabled={!state.editableEnd}>
                                                <Button disabled={!state.editableEnd} type="primary" icon={<UploadOutlined />} style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }}>上传文件</Button>
                                            </Upload>
                                        </div>
                                    </div>
                                </div>
                        <div style={gridStyles.row}>
                            <div style={gridStyles.label}>竣工日期<span style={{ color: '#ff4d4f' }}>*</span></div>
                            <div style={gridStyles.contentLast}>
                                <ProFormDatePicker name="complete_date" noStyle fieldProps={{ style: { width: '100%' }, disabled: !state.editableEnd }} />
                            </div>
                        </div>
                        <div style={gridStyles.row}>
                            <div style={{ ...gridStyles.contentLast, display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                                <Button disabled={!state.editableEnd} type="primary" onClick={() => handleProgressStageSubmit('end')}>竣工确认</Button>
                            </div>
                        </div>
                    </div>
                            );
                        }}
                    </ProFormDependency>
                </Tabs.TabPane>
            </Tabs>
        </ModalForm>

        {/* 备注弹窗 */}
        <ModalForm
            title="备注信息"
            open={remarkModalVisible}
            onOpenChange={setRemarkModalVisible}
            onFinish={handleSaveRemark}
            initialValues={currentRecord}
            width={500}
            modalProps={{ destroyOnClose: true, maskClosable: false }}
        >
            <ProFormTextArea
              name="remarks"
              label="备注"
              rules={[{ required: true }]}
              fieldProps={{ autoSize: { minRows: 4, maxRows: 8 }, showCount: true, maxLength: 500 }}
            />
        </ModalForm>

        {/* 评估详情弹窗 */}
        <Modal
            title="评估详情"
            open={assessmentModalVisible}
            onCancel={() => setAssessmentModalVisible(false)}
            footer={null}
            width={800}
            destroyOnClose
        >
            <Table
              dataSource={assessmentData}
              pagination={false}
              rowKey={(record) => record.id || record._id}
              columns={[
                {
                  title: '部门',
                  dataIndex: 'pgbm',
                  key: 'pgbm',
                  align: 'center',
                  width: 200,
                  render: (text: string) => {
                    if (!text) return '-';
                    // 移除 /<系统> 部分
                    return text.replace('/<系统>', '');
                  },
                },
                {
                  title: '评估意见',
                  dataIndex: 'pgyj',
                  key: 'pgyj',
                  align: 'center',
                  render: (text: string) => text || '-',
                },
              ]}
            />
        </Modal>

        {/* 到账资金弹窗 */}
        <Modal
            title="添加到账资金"
            open={moneyModalVisible}
            maskClosable={false}
            onCancel={() => setMoneyModalVisible(false)}
            onOk={async () => {
                if (!currentRecord?._id) {
                    setMoneyModalVisible(false);
                    return;
                }
                const invalidDateRow = receivedMoneyRows.find((item) => !item.date);
                if (invalidDateRow) {
                  message.warning('请选择日期');
                  return;
                }
                const invalidMoneyRow = receivedMoneyRows.find(
                  (item) => hasValue(item.money) && Number.isNaN(Number(item.money)),
                );
                if (invalidMoneyRow) {
                  message.warning('到账金额请填写数字');
                  return;
                }

                const bDateAndReceivedMoneysArrays = receivedMoneyRows.map((item) => ({
                  bdate: item.date || '',
                  receivedMoney: hasValue(item.money) ? String(item.money) : '0',
                }));

                try {
                  await request('/zsxt-api/tProjMoney/updateOrSaveBDateAndreceivedMoneys', {
                    method: 'POST',
                    data: {
                      projId: currentRecord._id,
                      bdateAndReceivedMoneysArrays:bDateAndReceivedMoneysArrays,
                    },
                  });

                  setReceivedMoneyMap((prev) => ({
                    ...prev,
                    [currentRecord._id]: receivedMoneyRows,
                  }));
                  updateSignedProjectRecord(currentRecord._id, {
                    receivedMoneyRows,
                    totalReceivedMoney,
                    total_received_money: totalReceivedMoney,
                  });
                  message.success('到账资金已保存');
                  setMoneyModalVisible(false);
                } catch (error) {
                  message.error('到账资金保存失败');
                }
            }}
            okText="保存"
            cancelText="取消"
            width={580}
            styles={{ body: { maxHeight: '56vh', overflowY: 'auto', paddingTop: 12 } }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, gap: 8 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                    onClick={addReceivedMoneyRow}
                />
                <Button
                    type="primary"
                    style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                    onClick={removeReceivedMoneyRow}
                >
                    -
                </Button>
                <span>到账资金总计： {totalReceivedMoney} (亿元)</span>
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 18 }}>
                {receivedMoneyRows.map((item) => (
                    <div key={item.key} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ width: 88, textAlign: 'right', marginRight: 12 }}>日期</div>
                            <DatePicker
                                style={{ width: 150 }}
                                value={item.date ? dayjs(item.date) : null}
                                format="YYYY-MM-DD"
                                onChange={(_, dateString) => updateReceivedMoneyRow(item.key, 'date', dateString)}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: 88, textAlign: 'right', marginRight: 12 }}>到账金额</div>
                            <Input
                                style={{ width: 150 }}
                                value={item.money}
                                onChange={(e) => updateReceivedMoneyRow(item.key, 'money', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Modal>

        <Modal
            title="在线审批项目查询绑定"
            open={onlineApprovalModalVisible}
            className="signed-project-modal"
            zIndex={1100}
            maskClosable={false}
            onCancel={() => {
              setOnlineApprovalModalVisible(false);
              onlineApprovalSearchForm.resetFields();
            }}
            footer={null}
            width={1100}
        >
            <Form
                form={onlineApprovalSearchForm}
                layout="horizontal"
                onFinish={(values) => fetchOnlineApprovalList(values, 1, onlineApprovalPagination.pageSize)}
                className="online-approval-search-grid"
                labelCol={{ flex: '108px' }}
                wrapperCol={{ flex: '1 1 0' }}
            >
                <Form.Item label="项目编码" name="projectCode" style={{ marginBottom: 0 }}>
                    <Input allowClear />
                </Form.Item>
                <Form.Item label="项目名称" name="projectName" style={{ marginBottom: 0 }}>
                    <Input allowClear />
                </Form.Item>
                <Form.Item label="总投资" name="totalInvestment" style={{ marginBottom: 0 }}>
                    <Input allowClear />
                </Form.Item>
                <Form.Item label="申报单位联系人" name="legalCompanyContactName" style={{ marginBottom: 0 }}>
                    <Input allowClear />
                </Form.Item>
                <Form.Item label="联系人手机号" name="legalCompanyContactPhone" style={{ marginBottom: 0 }}>
                    <Input allowClear />
                </Form.Item>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, minHeight: 32, gridColumn: '1 / span 3', justifyContent: 'center' }}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button
                        htmlType="button"
                        onClick={() => {
                          onlineApprovalSearchForm.resetFields();
                          fetchOnlineApprovalList({}, 1, onlineApprovalPagination.pageSize);
                        }}
                    >
                        重置
                    </Button>
                </div>
            </Form>
            <div style={{ marginBottom: 12, color: '#666' }}>
              查询无结果，可
              <a
                style={{ marginLeft: 4, color: '#0D8BBD', textDecoration: 'underline' }}
                onClick={() => openAbnormalBindModal('online')}
              >
                点击此处
              </a>
              进行异常绑定
            </div>
            <Table
                rowKey={(record: any) => record.id || record.project_code}
                columns={onlineApprovalColumns}
                dataSource={onlineApprovalList}
                loading={onlineApprovalLoading}
                pagination={false}
                scroll={{ x: 1000 }}
                size="small"
            />
            <Pagination
                current={onlineApprovalPagination.current}
                pageSize={onlineApprovalPagination.pageSize}
                total={onlineApprovalPagination.total}
                showSizeChanger
                showTotal={(total) => `共 ${total} 条`}
                style={{ marginTop: 16, textAlign: 'right' }}
                onChange={(page, pageSize) => fetchOnlineApprovalList(onlineApprovalSearchForm.getFieldsValue(), page, pageSize)}
            />
        </Modal>

        <Modal
            title="在线审批项目详情"
            open={onlineApprovalDetailVisible}
            className="signed-project-modal"
            zIndex={1200}
            maskClosable={false}
            onCancel={() => {
              setOnlineApprovalDetailVisible(false);
              setOnlineApprovalDetailRecord(null);
            }}
            footer={[
              <Button
                key="close"
                type="primary"
                style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }}
                onClick={() => {
                  setOnlineApprovalDetailVisible(false);
                  setOnlineApprovalDetailRecord(null);
                }}
              >
                关闭
              </Button>,
            ]}
            width={980}
        >
            <div className="online-approval-detail-table">
                {onlineApprovalDetailRows.map((row, index) => {
                  if (row.length === 2) {
                    return (
                      <div key={index} className="online-approval-detail-row single">
                          <div className="online-approval-detail-cell online-approval-detail-label">{row[0]}</div>
                          <div className="online-approval-detail-cell">{row[1]}</div>
                      </div>
                    );
                  }
                  return (
                    <div key={index} className="online-approval-detail-row">
                        <div className="online-approval-detail-cell online-approval-detail-label">{row[0]}</div>
                        <div className="online-approval-detail-cell">{row[1]}</div>
                        <div className="online-approval-detail-cell online-approval-detail-label">{row[2]}</div>
                        <div className="online-approval-detail-cell">{row[3]}</div>
                    </div>
                  );
                })}
            </div>
        </Modal>

        <Modal
            title="工程审批项目查询绑定"
            open={engineeringApprovalModalVisible}
            className="signed-project-modal"
            zIndex={1100}
            maskClosable={false}
            onCancel={() => {
              setEngineeringApprovalModalVisible(false);
              engineeringApprovalSearchForm.resetFields();
            }}
            footer={null}
            width={1100}
        >
            <Form
                form={engineeringApprovalSearchForm}
                layout="horizontal"
                onFinish={(values) => fetchEngineeringApprovalList(values, 1, engineeringApprovalPagination.pageSize)}
                className="online-approval-search-grid"
                labelCol={{ flex: '108px' }}
                wrapperCol={{ flex: '1 1 0' }}
            >
                <Form.Item label="项目编码" name="projectCode" style={{ marginBottom: 0 }}>
                    <Input allowClear />
                </Form.Item>
                <Form.Item label="项目名称" name="projectName" style={{ marginBottom: 0 }}>
                    <Input allowClear />
                </Form.Item>
                <Form.Item label="总投资" name="totalInvestment" style={{ marginBottom: 0 }}>
                    <Input allowClear />
                </Form.Item>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, minHeight: 32, gridColumn: '1 / span 3', justifyContent: 'flex-start' }}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button
                        htmlType="button"
                        onClick={() => {
                          engineeringApprovalSearchForm.resetFields();
                          fetchEngineeringApprovalList({}, 1, engineeringApprovalPagination.pageSize);
                        }}
                    >
                        重置
                    </Button>
                </div>
            </Form>
            <div style={{ marginBottom: 12, color: '#666' }}>
              查询无结果，可
              <a
                style={{ marginLeft: 4, color: '#0D8BBD', textDecoration: 'underline' }}
                onClick={() => openAbnormalBindModal('engineering')}
              >
                点击此处
              </a>
              进行异常绑定
            </div>
            <Table
                rowKey={(record: any) => record.id || record.project_code}
                columns={engineeringApprovalColumns}
                dataSource={engineeringApprovalList}
                loading={engineeringApprovalLoading}
                pagination={false}
                scroll={{ x: 1000 }}
                size="small"
            />
            <Pagination
                current={engineeringApprovalPagination.current}
                pageSize={engineeringApprovalPagination.pageSize}
                total={engineeringApprovalPagination.total}
                showSizeChanger
                showTotal={(total) => `共 ${total} 条`}
                style={{ marginTop: 16, textAlign: 'right' }}
                onChange={(page, pageSize) => fetchEngineeringApprovalList(engineeringApprovalSearchForm.getFieldsValue(), page, pageSize)}
            />
        </Modal>

        <Modal
            title="工程审批项目详情"
            open={engineeringApprovalDetailVisible}
            className="signed-project-modal"
            zIndex={1200}
            maskClosable={false}
            onCancel={() => {
              setEngineeringApprovalDetailVisible(false);
              setEngineeringApprovalDetailRecord(null);
            }}
            footer={[
              <Button
                key="close"
                type="primary"
                style={{ backgroundColor: '#11a88c', borderColor: '#11a88c' }}
                onClick={() => {
                  setEngineeringApprovalDetailVisible(false);
                  setEngineeringApprovalDetailRecord(null);
                }}
              >
                关闭
              </Button>,
            ]}
            width={980}
        >
            <div className="online-approval-detail-table">
                {engineeringApprovalDetailRows.map((row, index) => {
                  if (row.length === 2) {
                    return (
                      <div key={index} className="online-approval-detail-row single">
                          <div className="online-approval-detail-cell online-approval-detail-label">{row[0]}</div>
                          <div className="online-approval-detail-cell">{row[1]}</div>
                      </div>
                    );
                  }
                  return (
                    <div key={index} className="online-approval-detail-row">
                        <div className="online-approval-detail-cell online-approval-detail-label">{row[0]}</div>
                        <div className="online-approval-detail-cell">{row[1]}</div>
                        <div className="online-approval-detail-cell online-approval-detail-label">{row[2]}</div>
                        <div className="online-approval-detail-cell">{row[3]}</div>
                    </div>
                  );
                })}
            </div>
        </Modal>

        <Modal
          title="异常绑定"
          open={abnormalBindModalVisible}
          zIndex={1300}
          maskClosable={false}
          onCancel={() => {
            setAbnormalBindModalVisible(false);
            abnormalBindForm.resetFields();
          }}
          onOk={handleAbnormalBindSubmit}
          width={760}
          okText="绑定"
          cancelText="关闭"
        >
          <Form form={abnormalBindForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="申报单位联系人" name="application_company_contact_name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="手机号码" name="application_company_contact_phone">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="项目代码" name="project_code">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="项目名称" name="project_name">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="总投资（万元）" name="total_investment">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="申报时间" name="application_time">
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
    </div>
  );
};

export default ProjectManage10;
