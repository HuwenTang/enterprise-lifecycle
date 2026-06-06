import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, Form, Input, message, Modal, Row, Select, Space, Table, Tag, TreeSelect } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { request } from '@umijs/max';
import { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import SignedProjectDetailModal from '@/components/SignedProjectDetailModal';

const { TextArea } = Input;

let lastSearchCheckListRequestKey = '';
let lastSearchCheckListRequestAt = 0;

type SearchFieldType = {
  name?: string;
  pType?: string;
  progress?: string;
  hProgress?: string;
  investMoney?: string;
  districtCode?: string;
  zoneCode?: string;
  townCode?: string;
  projType?: string;
  code?: string;
  investor?: string;
  investorType?: string;
  signedStatDate?: any;
  regStatDate?: any;
  checkStatDate?: any;
  industryCode?: string;
  finishCheckDate?: any;
  startDateCommit?: any;
  completeDate?: any;
  bIndustry?: string;
  remark?: string;
  checkStatus?: string;
  rprogress?: string;
};

interface DataType {
  _id: string;
  _name?: string;
  district?: string;
  zone_name?: string;
  town_name?: string;
  invest_money?: number;
  p_type?: string | number;
  check_status?: number;
  progress?: number;
  fail_content?: string;
  userlevel?: number;
  [key: string]: any;
}

const fallbackDistrictOptions = [
  { label: '靖江市', value: '001001' },
  { label: '泰兴市', value: '001002' },
  { label: '兴化市', value: '001003' },
  { label: '海陵区', value: '001004' },
  { label: '姜堰区', value: '001006' },
  { label: '医药高新区(高港区)', value: '001007' },
];

const investMoneyOptions = [
  { label: '全部', value: '' },
  { label: '1亿(1000万美元)以上', value: '0' },
  { label: '5亿(3000万美元)以上', value: '1' },
  { label: '10亿(1亿美元)以上', value: '2' },
];

const investorTypeOptions = [
  { label: '央企', value: '10' },
  { label: '民营巨头', value: '20' },
  { label: '世界500强或跨国公司', value: '30' },
  { label: '其它', value: '40' },
];

const signedProgressOptions = [
  { label: '已签约', value: '0' },
  { label: '在批', value: '10' },
  { label: '已注册', value: '1' },
  { label: '已备案', value: '5' },
  { label: '完成报批', value: '4' },
  { label: '在建（已开工）', value: '2' },
  { label: '已竣工', value: '3' },
];

const ProjectAudit = () => {
  const [searchForm] = Form.useForm<SearchFieldType>();
  const fetchSeqRef = useRef(0);
  const initializedRef = useRef(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>(fallbackDistrictOptions);
  const [searchZoneOptions, setSearchZoneOptions] = useState<{ label: string; value: string }[]>([]);
  const [searchTownOptions, setSearchTownOptions] = useState<{ label: string; value: string }[]>([]);
  const [searchZoneSelected, setSearchZoneSelected] = useState(false);
  const [projTypeTreeData, setProjTypeTreeData] = useState<any[]>([]);
  const [industryTreeData, setIndustryTreeData] = useState<any[]>([]);
  const [industryFirstOptions, setIndustryFirstOptions] = useState<any[]>([]);
  
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

  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [currentRecord, setCurrentRecord] = useState<DataType | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState<DataType | null>(null);
  const [detailZoneOptions, setDetailZoneOptions] = useState<{ label: string; value: string }[]>([]);
  const [detailTownOptions, setDetailTownOptions] = useState<{ label: string; value: string }[]>([]);

  const userLevel = useMemo(() => {
    try {
      const raw = localStorage.getItem('USER_INFO');
      if (!raw) return undefined;
      const parsed = JSON.parse(raw);
      return Number(parsed?.user_level);
    } catch (_e) {
      return undefined;
    }
  }, []);

  const normalizeRecord = (record: any): DataType => ({
    ...record,
    _id: record?._id || record?.id,
    _name: record?._name || record?.name,
    _code: record?._code || record?.code,
    p_type: record?.p_type ? String(record.p_type) : (record?.ptype ? String(record.ptype) : undefined),
    proj_type: record?.proj_type ?? record?.projType ?? record?.projtype,
    invest_money: Number(record?.invest_money ?? record?.investMoney ?? 0),
    foreign_money: record?.foreign_money ?? record?.foreignMoney,
    district_code: record?.district_code ?? record?.districtCode ?? record?.district ?? record?.districtName,
    zone_code: record?.zone_code ?? record?.zoneCode ?? record?.zone_name ?? record?.zoneName,
    zone_name: record?.zone_name ?? record?.zoneName,
    town_code: record?.town_code ?? record?.townCode ?? record?.town_name ?? record?.townName,
    town_name: record?.town_name ?? record?.townName,
    industry_first_code: record?.industry_first_code ?? record?.industryFirstCode,
    industry_name: record?.industry_name ?? record?.industryName,
    industry_code: record?.industry_code ?? record?.industryCode,
    b_industry: record?.b_industry ? String(record.b_industry) : (record?.bIndustry ? String(record.bIndustry) : (record?.bindustry ? String(record.bindustry) : undefined)),
    investor: record?.investor,
    investor_type: record?.investor_type ? String(record.investor_type) : (record?.investorType ? String(record.investorType) : undefined),
    investor_place: record?.investor_place ? String(record.investor_place) : (record?.investorPlace ? String(record.investorPlace) : undefined),
    is_listed: record?.is_listed ? String(record.is_listed) : (record?.isListed ? String(record.isListed) : undefined),
    is_gxjs: record?.is_gxjs ?? record?.isGxjs ?? record?.is_gx ?? record?.isGx,
    has_municipal_capital: record?.has_municipal_capital ?? record?.hasMunicipalCapital ?? record?.isSwzjtr ?? record?.is_swzjtr,
    equity_ratio: record?.equity_ratio ?? record?.equityRatio ?? record?.gqbl ?? record?.fixed_percent ?? record?.fixedPercent,
    is_rzxq: record?.is_rzxq ?? record?.isRzxq,
    rz_money: record?.rz_money ?? record?.rzMoney,
    is_kc_proj: record?.is_kc_proj ?? record?.isKcProj,
    kc_proj_type: record?.kc_proj_type ?? record?.kcProjType,
    is_qflp: record?.is_qflp ?? record?.isQflp,
    b_resource: record?.b_resource ?? record?.bResource ?? record?.bresource ?? record?.proj_source ?? record?.projSource,
    sjjg_name: record?.sjjg_name ?? record?.sjjgName,
    signed_date: record?.signed_date ?? record?.signedDate,
    signed_stat_date: record?.signed_stat_date ?? record?.signedStatDate,
    plan_start_date: record?.plan_start_date ?? record?.planStartDate,
    plan_end_date: record?.plan_end_date ?? record?.planEndDate,
    zhuce_money: record?.zhuce_money ?? record?.zhuceMoney ?? record?.reg_money ?? record?.regMoney,
    _desc: record?._desc ?? record?.desc,
    project_address: record?.project_address ?? record?.projectAddress,
    cg_remark: record?.cg_remark ?? record?.cgRemark,
    cy_gl: record?.cy_gl ?? record?.cyGl,
    u_code: record?.u_code ?? record?.ucode,
    company_name: record?.company_name ?? record?.companyName,
    reg_money: record?.reg_money ?? record?.regMoney,
    reg_date: record?.reg_date ?? record?.regDate,
    reg_stat_date: record?.reg_stat_date ?? record?.regStatDate,
    check_stat_date: record?.check_stat_date ?? record?.checkStatDate,
    finish_check_date: record?.finish_check_date ?? record?.finishCheckDate,
    progress: Number(record?.progress ?? 0),
    tshy: record?.tshy,
    zrxz: record?.zrxz,
    lgxm: record?.lgxm,
    zjspf: record?.zjspf,
    total_use: record?.total_use ?? record?.totalUse,
    is_wuran: record?.is_wuran ?? record?.isWuran,
    sq_land_area: record?.sq_land_area ?? record?.sqLandArea,
    zl_land_area: record?.zl_land_area ?? record?.zlLandArea,
    zs_land_area: record?.zs_land_area ?? record?.zsLandArea ?? record?.zl_land_area_zs ?? record?.zlLandAreaZs,
    plan_total1: record?.plan_total1 ?? record?.planTotal1 ?? record?.plan_total ?? record?.planTotal,
    plan_invest_strong: record?.plan_invest_strong ?? record?.planInvestStrong ?? record?.plan_intensity ?? record?.planIntensity ?? record?.invest_level ?? record?.investLevel,
    fixed_invest: record?.fixed_invest ?? record?.fixedInvest,
    device_invest: record?.device_invest ?? record?.deviceInvest,
    civil_invest: record?.civil_invest ?? record?.civilInvest,
    land_invest_strength: record?.land_invest_strength ?? record?.landInvestStrength,
    land_tax: record?.land_tax ?? record?.landTax,
    year_income: record?.year_income ?? record?.yearIncome,
    year_tax: record?.year_tax ?? record?.yearTax,
    job_num: record?.job_num ?? record?.jobNum,
    yq_cz1: record?.yq_cz1 ?? record?.yqCz1,
    yq_kpxs1: record?.yq_kpxs1 ?? record?.yqKpxs1,
    yq_ss1: record?.yq_ss1 ?? record?.yqSs1,
    yq_mjtax1: record?.yq_mjtax1 ?? record?.yqMjtax1,
    zhpg: record?.zhpg,
    jf: record?.jf,
    yf: record?.yf,
    bf: record?.bf,
    df: record?.df,
    zsf: record?.zsf,
    tzf: record?.tzf,
    tzdz: record?.tzdz,
    fz: record?.fz,
    remark: record?.remark,
    check_status: Number(record?.check_status ?? record?.checkStatus ?? 0),
    fail_content: record?.fail_content || record?.failContent || '',
    userlevel: Number(record?.userlevel ?? userLevel ?? 0),
  });

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

  const fetchDistrictList = async () => {
    try {
      const response = await request('/zsxt-api/tCommonDept/getDeptListByPid', {
        method: 'POST',
        data: { pid: '001' },
      });
      if (Array.isArray(response) && response.length) {
        const options = response.map((item: any) => ({ label: item.text, value: item.id }));
        setDistrictOptions(options);
      }
    } catch (_error) {
      setDistrictOptions(fallbackDistrictOptions);
    }
  };

  const fetchZoneList = async (districtCode: string) => {
    try {
      const response = await request('/zsxt-api/tCommonDept/getDeptByPidForTreeSelect', {
        method: 'POST',
        data: { pid: districtCode },
      });
      const options = Array.isArray(response)
        ? response.map((item: any) => ({ label: item.deptName, value: item.deptCode }))
        : [];
      setSearchZoneOptions(options);
      return options;
    } catch (_error) {
      setSearchZoneOptions([]);
      return [];
    }
  };

  const fetchTownList = async (zoneCode: string) => {
    try {
      const response = await request('/zsxt-api/tCommonDept/getDeptByPidForTreeSelect', {
        method: 'POST',
        data: { pid: zoneCode },
      });
      const options = Array.isArray(response)
        ? response.map((item: any) => ({ label: item.deptName, value: item.deptCode }))
        : [];
      setSearchTownOptions(options);
      return options;
    } catch (_error) {
      setSearchTownOptions([]);
      return [];
    }
  };

  const handleSearchDistrictChange = (value?: string) => {
    if (value) {
      fetchZoneList(value);
    } else {
      setSearchZoneOptions([]);
    }
    setSearchTownOptions([]);
    searchForm.setFieldsValue({ zoneCode: undefined, townCode: undefined });
  };

  const handleSearchZoneChange = (value?: string) => {
    if (value) {
      setSearchZoneSelected(true);
      fetchTownList(value);
    } else {
      setSearchZoneSelected(false);
      setSearchTownOptions([]);
    }
    searchForm.setFieldsValue({ townCode: undefined });
  };

  const buildSearchParams = (values: SearchFieldType = {}) => {
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

  const fetchProjTypeOptions = async () => {
    const buildTreeData = (nodes: any[]): any[] =>
      (nodes || [])
        .map((item) => {
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
        })
        .filter((item) => item.value !== '');

    try {
      const response = await request('/zsxt-api/tProjType/getProjType', {
        method: 'POST',
        data: {},
      });
      const treeData = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
      setProjTypeTreeData(buildTreeData(treeData));
    } catch (error) {
      console.error('获取项目类型失败:', error);
      setProjTypeTreeData([]);
    }
  };

  const fetchIndustryTreeData = async () => {
    const normalizeIndustryNode = (item: any) => {
      const id = item?.id ?? item?.value ?? item?.code ?? item?._code;
      const codeText = String(item?.code ?? item?._code ?? item?.value ?? '').trim();
      const nameText = String(item?.name ?? item?.label ?? item?.text ?? item?.title ?? item?._name ?? '').trim();
      const titleText = codeText && nameText && !nameText.startsWith(codeText) ? `${codeText}-${nameText}` : (nameText || codeText);
      const nodeValue = codeText || String(id ?? '');
      return {
        raw: item,
        title: titleText,
        value: nodeValue,
        key: nodeValue || String(id ?? ''),
      };
    };

    const buildTreeData = (nodes: any[]): any[] =>
      (nodes || [])
        .map((item) => {
          const normalized = normalizeIndustryNode(item);
          const hasChildren = Array.isArray(item?.children) && item.children.length > 0;
          return {
            ...normalized,
            disabled: hasChildren,
            children: hasChildren ? buildTreeData(item.children) : undefined,
          };
        })
        .filter((item) => item.value !== '');

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
        const explicitParent = raw?.parentCode ?? raw?.parent_code ?? raw?.pcode ?? raw?.p_code ?? raw?.pid ?? raw?.pId ?? raw?.parentId;
        let parentKey = explicitParent ? String(explicitParent).trim() : '';

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
        : Array.isArray(response?.records)
          ? response.records
          : Array.isArray(response?.data?.records)
            ? response.data.records
            : Array.isArray(response?.data?.datalist)
              ? response.data.datalist
              : Array.isArray(response?.data)
                ? response.data
                : [];

      const hasNestedChildren = rawList.some((item: any) => Array.isArray(item?.children) && item.children.length > 0);
      setIndustryTreeData(hasNestedChildren ? buildTreeData(rawList) : buildTreeDataFromFlat(rawList));
    } catch (error) {
      console.error('获取行业编码树失败:', error);
      setIndustryTreeData([]);
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
              : (Array.isArray(response?.data)
                ? response.data
                : []))));

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

  const fetchData = async (
    page: number = pagination.current,
    pageSize: number = pagination.pageSize,
    passedValues?: SearchFieldType,
  ) => {
    const values = passedValues || searchForm.getFieldsValue();
    const requestData = {
      ...buildSearchParams(values),
      page,
      size: pageSize,
    };
    const requestKey = JSON.stringify(requestData);
    const now = Date.now();

    if (lastSearchCheckListRequestKey === requestKey && now - lastSearchCheckListRequestAt < 1000) {
      return;
    }

    lastSearchCheckListRequestKey = requestKey;
    lastSearchCheckListRequestAt = now;
    const seq = ++fetchSeqRef.current;
    setLoading(true);
    try {
      const response = await request(`/zsxt-api/tProjProjectSigned/searchCheckList?page=${page}&size=${pageSize}`, {
        method: 'POST',
        data: buildSearchParams(values),
      });

      const records = response?.records || response?.data?.records || response?.data?.datalist || response?.data?.list || [];
      const total = response?.total || response?.data?.total || response?.data?.count || 0;
      const current = response?.page || response?.data?.page || page;
      const size = response?.size || response?.data?.size || pageSize;

      if (seq !== fetchSeqRef.current) {
        return;
      }
      setDataSource(Array.isArray(records) ? records.map(normalizeRecord) : []);
      setPagination({ current, pageSize: size, total });
    } catch (error) {
      if (seq !== fetchSeqRef.current) {
        return;
      }
      console.error('获取审核列表失败:', error);
      message.error('获取审核列表失败');
      setDataSource([]);
      setPagination((prev) => ({ ...prev, current: page, pageSize, total: 0 }));
    } finally {
      if (seq === fetchSeqRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;
    
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
            districtCode: level4Info.districtCode,
            zoneCode: level4Info.zoneCode,
          };
          
          // 如果是镇街级别，设置镇街默认值
          if (level4Info.isTownLevel && level4Info.townCode) {
            searchFormValues.townCode = level4Info.townCode;
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
            districtCode: level4Info.districtCode,
            zoneCode: level4Info.zoneCode,
          };
          
          if (level4Info.isTownLevel && level4Info.townCode) {
            searchFormValues.townCode = level4Info.townCode;
          }
          
          searchForm.setFieldsValue(searchFormValues);
        }
      } else {
        // 非 level=4 用户，加载市区列表
        fetchDistrictList();
      }
      
      // 加载其他数据
      fetchProjTypeOptions();
      fetchIndustryTreeData();
      fetchIndustryFirstOptions();
      fetchData(1, 20);
    };
    
    init();
  }, []);

  const onSearch = async (values?: SearchFieldType) => {
    const nextValues = values || searchForm.getFieldsValue();
    await fetchData(1, pagination.pageSize, nextValues);
  };

  const onReset = async () => {
    searchForm.resetFields();
    setSearchZoneOptions([]);
    setSearchTownOptions([]);
    setSearchZoneSelected(false);
    await fetchData(1, 20, {});
  };

  const checkProject = async (record: DataType, check: 0 | 1, failContent?: string) => {
    await request('/zsxt-api/tProjProjectSigned/checkProject', {
      method: 'POST',
      data: {
        _id: record._id,
        id: record._id,
        check,
        fail_content: failContent,
        failContent,
      },
    });
  };

  const handlePass = async (record: DataType) => {
    if (Number(record.userlevel || userLevel) === 2 && Number(record.check_status) === 2) {
      return;
    }
    try {
      await checkProject(record, 1);
      message.success('审核通过');
      await fetchData();
    } catch (error) {
      console.error('审核通过失败:', error);
      message.error('审核通过失败');
    }
  };

  const handleReject = (record: DataType) => {
    if (Number(record.userlevel || userLevel) === 2 && Number(record.check_status) === 2) {
      return;
    }
    setCurrentRecord(record);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!currentRecord?._id) {
      message.error('项目信息无效');
      return;
    }
    if (!rejectReason.trim()) {
      message.error('请输入驳回原因');
      return;
    }

    try {
      await checkProject(currentRecord, 0, rejectReason.trim());
      message.success('已驳回');
      setIsRejectModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error('驳回失败:', error);
      message.error('驳回失败');
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    fetchData(page, pageSize);
  };

  const handleOpenDetail = async (record: DataType) => {
    try {
      const response = await request('/zsxt-api/tProjProjectSigned/findById', {
        method: 'POST',
        data: { id: record._id },
      });
      const next = normalizeRecord(response?.data || response || record);
      
      // 加载对应的园区和街镇选项
      const districtCode = next?.district_code;
      const zoneCode = next?.zone_code;
      
      if (districtCode) {
        const zoneList = await fetchZoneList(districtCode);
        setDetailZoneOptions(zoneList);
        
        if (zoneCode) {
          const townList = await fetchTownList(zoneCode);
          setDetailTownOptions(townList);
        } else {
          setDetailTownOptions([]);
        }
      } else {
        setDetailZoneOptions([]);
        setDetailTownOptions([]);
      }
      
      setDetailRecord(next);
      setDetailVisible(true);
    } catch (_error) {
      setDetailRecord(record);
      setDetailZoneOptions([]);
      setDetailTownOptions([]);
      setDetailVisible(true);
    }
  };

  const renderCheckStatus = (_status: number, record: DataType) => {
    const status = Number(record.check_status);
    if (status === 0) return <Tag color="orange">待审核</Tag>;
    if (status === 1) return <Tag color="green">市级审核通过</Tag>;
    if (status === 2) return <Tag color="green">市区审核通过</Tag>;
    if (status === 3) {
      return (
        <span
          style={{ color: 'red', cursor: 'pointer' }}
          onClick={() =>
            Modal.info({
              title: '审核驳回原因',
              content: record.fail_content || '无',
              width: 560,
            })
          }
        >
          审核不通过
        </span>
      );
    }
    if (status === 4) return <Tag>保存未提交</Tag>;
    return <Tag>未知</Tag>;
  };

  const renderProgress = (progress: number) => {
    const progressMap: Record<number, string> = {
      0: '已签约',
      10: '在批',
      1: '已注册',
      5: '已备案',
      2: '已开工',
      3: '已竣工',
      4: '完成报批',
    };
    return progressMap[Number(progress)] || '-';
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      key: 'index',
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: '项目名称',
      dataIndex: '_name',
      key: '_name',
      width: 260,
      ellipsis: true,
      render: (value: string, record: DataType) => (
        <a onClick={() => handleOpenDetail(record)}>{value || '-'}</a>
      ),
    },
    {
      title: '市区',
      dataIndex: 'district',
      key: 'district',
      width: 120,
    },
    {
      title: '园区名称',
      dataIndex: 'zone_name',
      key: 'zone_name',
      width: 150,
    },
    {
      title: '镇街',
      dataIndex: 'town_name',
      key: 'town_name',
      width: 120,
    },
    {
      title: '总投资额',
      dataIndex: 'invest_money',
      key: 'invest_money',
      width: 120,
    },
    {
      title: '货币单位',
      dataIndex: 'p_type',
      key: 'p_type',
      width: 100,
      align: 'center',
      render: (type: string | number) => (String(type) === '1' ? '亿元' : String(type) === '2' ? '万美元' : '-'),
    },
    {
      title: '审核状态',
      dataIndex: 'check_status',
      key: 'check_status',
      width: 130,
      align: 'center',
      render: renderCheckStatus,
    },
    {
      title: '当前进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 100,
      align: 'center',
      render: renderProgress,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      render: (_, record) => {
        const disabled = Number(record.userlevel || userLevel) === 2 && Number(record.check_status) === 2;
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.45 : 1,
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
                if (!disabled) handlePass(record);
              }}
            >
              <div>通过</div>
              <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
            </div>
            <div
              style={{
                marginLeft: '10px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.45 : 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '85px',
                height: '28px',
                background: 'red',
                borderRadius: '14px',
                fontSize: '12px',
                color: '#fff',
              }}
              onClick={() => {
                if (!disabled) handleReject(record);
              }}
            >
              <div>不通过</div>
              <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/del.png" alt="" />
            </div>
          </div>
        );
      },
    },
  ];

  const searchRows = [
    [
      { label: '项目名称', name: 'name', node: <Input placeholder="" /> },
      { label: '项目类别', name: 'pType', node: <Select placeholder="请选择" allowClear options={[{ label: '内资', value: '1' }, { label: '外资', value: '2' }]} /> },
      { label: '项目进度', name: 'progress', node: <Select placeholder="请选择" allowClear options={signedProgressOptions} /> },
      { label: '投资额', name: 'investMoney', node: <Select placeholder="全部" allowClear options={investMoneyOptions} /> },
    ],
    [
      { label: '项目编码', name: 'code', node: <Input placeholder="" /> },
      { label: '市区', name: 'districtCode', node: <Select placeholder="请选择" allowClear options={districtOptions} onChange={handleSearchDistrictChange} disabled={level4User?.isLevel4} /> },
      { label: '园区名称', name: 'zoneCode', node: <Select placeholder="请先选择市区" allowClear options={searchZoneOptions} onChange={handleSearchZoneChange} disabled={level4User?.isLevel4 || searchZoneOptions.length === 0} /> },
      { label: '街镇', name: 'townCode', node: <Select placeholder={!searchZoneSelected ? "请先选择园区" : (searchTownOptions.length === 0 ? "暂无镇街" : "请选择镇街")} allowClear options={searchTownOptions} disabled={level4User?.isTownLevel || searchTownOptions.length === 0} /> },
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
      { label: '投资方名称', name: 'investor', node: <Input placeholder="" /> },
      { label: '投资类型', name: 'investorType', node: <Select placeholder="请选择" allowClear options={investorTypeOptions} /> },
    ],
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
                width: '5px',
                height: '16px',
                background: '#005BF5',
                borderRadius: '2.5px',
              }}
            />
            <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>查询</div>
          </div>

          <Form form={searchForm} name="searchForm" onFinish={onSearch}>
            {searchRows.map((row, rowIndex) => (
              <Row gutter={16} key={rowIndex}>
                {row.map((field, fieldIndex) =>
                  field ? (
                    <Col span={6} key={field.name}>
                      <Form.Item<SearchFieldType> label={field.label} name={field.name as keyof SearchFieldType}>
                        {field.node}
                      </Form.Item>
                    </Col>
                  ) : (
                    <Col span={6} key={`empty-${fieldIndex}`} />
                  ),
                )}
              </Row>
            ))}

            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Space>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button htmlType="button" onClick={onReset}>重置</Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>

        <Table
          style={{ marginTop: 20, padding: '0 20px 20px' }}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="_id"
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

      <Modal
        title="驳回原因"
        open={isRejectModalOpen}
        onOk={handleRejectSubmit}
        onCancel={() => setIsRejectModalOpen(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item label="驳回原因" required>
            <TextArea
              rows={10}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请输入驳回原因"
            />
          </Form.Item>
        </Form>
      </Modal>

      <SignedProjectDetailModal
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        record={detailRecord}
        projTypeTreeData={projTypeTreeData}
        industryTreeData={industryTreeData}
        industryFirstOptions={industryFirstOptions}
        districtOptions={districtOptions}
        zoneOptions={detailZoneOptions}
        townOptions={detailTownOptions}
      />
    </PageContainer>
  );
};

export default ProjectAudit;
