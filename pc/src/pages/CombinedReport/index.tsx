import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Checkbox, Col, DatePicker, Form, Input, message, Row, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import { request } from '@umijs/max';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface ProjectDataType {
  _id: string;
  _name: string;
  _code: string;
  invest_money: number;
  district: string;
  zone_name: string;
  town_name?: string;
  p_type: number;
  typename?: string;
  industry_first_name?: string;
  industry_name?: string;
  b_industry?: number;
  investor: string;
  investor_type?: number;
  investor_place?: number;
  _desc?: string;
  signed_stat_date?: string;
  signed_date?: string;
  progress: number;
  check_status: number;
  finish_check_date?: string;
  check_stat_date?: string;
  start_commit_date?: string;
  complete_date?: string;
  is_sixpro?: number;
  sixpro_code?: number;
}

// 搜索条件配置
const searchFieldsConfig = [
  { value: 'name', label: '项目名称' },
  { value: 'code', label: '项目代码' },
  { value: 'invest_money', label: '项目总投资' },
  { value: 'district_code', label: '市区' },
  { value: 'zone_code', label: '园区' },
  { value: 'p_type', label: '项目类别' },
  { value: 'proj_type', label: '项目类型' },
  { value: 'industry_first_code', label: '产业大类' },
  { value: 'industry_code', label: '行业编码' },
  { value: 'b_industry', label: '所属行业' },
  { value: 'investor', label: '投资方名称' },
  { value: 'investor_type', label: '投资方性质' },
  { value: 'investor_place', label: '投资方注册地' },
  { value: 'signed_stat_date', label: '签约统计日期' },
  { value: 'signed_date', label: '签约日期' },
  { value: 'progress', label: '项目进度' },
  { value: 'town_code', label: '镇街名称' },
  { value: 'check_status', label: '审核状态' },
  { value: 'finish_check_date', label: '完成报批时间' },
  { value: 'check_stat_date', label: '备案（核准）统计日期' },
  { value: 'start_commit_date', label: '开工认定日期' },
  { value: 'complete_date', label: '竣工认定日期' },
  { value: 'is_sixpro', label: '是否为六大产业' },
  { value: 'sixpro_code', label: '六大产业名称' },
];

// 显示项配置
const displayFieldsConfig = [
  { value: 'name', label: '项目名称' },
  { value: 'code', label: '项目代码' },
  { value: 'investMoney', label: '项目总投资' },
  { value: 'districtCode', label: '市区代码' },
  { value: 'district', label: '市区' },
  { value: 'zoneCode', label: '园区代码' },
  { value: 'zoneName', label: '园区' },
  { value: 'townCode', label: '街镇代码' },
  { value: 'townName', label: '街镇名称' },
  { value: 'ptype', label: '项目类别' },
  { value: 'projType', label: '项目类型' },
  { value: 'industryFirstCode', label: '产业大类代码' },
  { value: 'industryFirstName', label: '产业大类' },
  { value: 'industryCode', label: '行业代码' },
  { value: 'industryName', label: '行业名称' },
  { value: 'bindustry', label: '所属行业' },
  { value: 'investor', label: '投资方名称' },
  { value: 'investorType', label: '投资方性质' },
  { value: 'investorPlace', label: '投资方注册地' },
  { value: 'desc', label: '项目简介' },
  { value: 'signedStatDate', label: '签约统计日期' },
  { value: 'signedDate', label: '签约日期' },
  { value: 'progress', label: '项目进度' },
  { value: 'checkStatus', label: '审核状态' },
  { value: 'finishCheckDate', label: '完成报批日期' },
  { value: 'checkStatDate', label: '备案（核准）统计日期' },
  { value: 'startDateCommit', label: '开工日期' },
  { value: 'completeDate', label: '竣工日期' },
  { value: 'isSixpro', label: '是否为六大产业' },
  { value: 'sixproCode', label: '六大产业代码' },
  { value: 'companyName', label: '注册公司名称' },
  { value: 'regMoney', label: '注册资金' },
  { value: 'regDate', label: '注册日期' },
  { value: 'regStatDate', label: '注册统计日期' },
  { value: 'actualInvest', label: '实际投入资金规模' },
  { value: 'sumActualInvest', label: '累计实际投入资金规模' },
  { value: 'checkName', label: '备案（核准）项目名称' },
  { value: 'checkMoney', label: '备案（核准）投资总额' },
  { value: 'checkDate', label: '备案（核准）日期' },
  { value: 'creatorName', label: '创建人' },
  { value: 'foreignMoney', label: '协议利用外资' },
  { value: 'placeInfo', label: '投资方地址' },
  { value: 'linker', label: '投资方联系人' },
  { value: 'linkerTel', label: '投资方联系电话' },
  { value: 'linkerTz', label: '招商人员' },
  { value: 'linkerTzTel', label: '招商人员电话' },
  { value: 'qyje', label: '签约金额' },
  { value: 'investLevel', label: '投资强度' },
  { value: 'planStartDate', label: '计划开工时间' },
  { value: 'planEndDate', label: '计划竣工时间' },
  { value: 'projectAddress', label: '项目选址位置' },
  { value: 'sqLandArea', label: '申请用地面积' },
  { value: 'isGxjs', label: '是否高新技术企业' },
  { value: 'isSwzjtr', label: '是否有市外资金投入' },
  { value: 'gqbl', label: '股权比例' },
  { value: 'cityProject', label: '是否市级重点项目' },
  { value: 'provincialProject', label: '是否省级重点项目' },
];

// 市区选项
const districtOptions = [
  { label: '靖江市', value: '001001' },
  { label: '泰兴市', value: '001002' },
  { label: '兴化市', value: '001003' },
  { label: '海陵区', value: '001004' },
  { label: '姜堰区', value: '001006' },
  { label: '医药高新区(高港区)', value: '001007' },
];

const CombinedReport = () => {
  const [searchForm] = Form.useForm();
  const [searchFields, setSearchFields] = useState<string[]>(['name']); // 默认选中项目名称
  const [displayFields, setDisplayFields] = useState<string[]>(['name']); // 默认显示项目名称
  const [tableData, setTableData] = useState<ProjectDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 100, total: 0 });
  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>([]);
  const [zoneOptions, setZoneOptions] = useState<{ label: string; value: string }[]>([]);
  const [townOptions, setTownOptions] = useState<{ label: string; value: string }[]>([]);
  const [zoneSelected, setZoneSelected] = useState(false);
  const [investorPlaceOptions, setInvestorPlaceOptions] = useState<{ label: string; value: string }[]>([]);
  const [foreignInvestorPlaceOptions, setForeignInvestorPlaceOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedPType, setSelectedPType] = useState<string | undefined>(undefined);

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
  const fetchZoneList = async (pid: string) => {
    if (!pid) {
      setZoneOptions([]);
      setTownOptions([]);
      return;
    }
    
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

  // 获取街镇列表
  const fetchTownList = async (pid: string) => {
    if (!pid) {
      setTownOptions([]);
      return;
    }
    
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
      console.error('获取街镇列表失败:', error);
      message.error('获取街镇列表失败');
    }
  };

  // 市区变化时，更新园区选项
  const handleDistrictChange = (value: string) => {
    if (value) {
      fetchZoneList(value);
    } else {
      setZoneOptions([]);
    }
    // 清空园区和镇街选择
    setTownOptions([]);
    searchForm.setFieldsValue({ zone_code: undefined, town_code: undefined });
  };
  
  // 园区变化时，更新镇街选项
  const handleZoneChange = (value: string) => {
    if (value) {
      setZoneSelected(true);
      fetchTownList(value);
    } else {
      setZoneSelected(false);
      setTownOptions([]);
    }
    // 清空镇街选择
    searchForm.setFieldsValue({ town_code: undefined });
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

  const handleSearchFieldsChange = (checkedValues: any[]) => {
    setSearchFields(checkedValues);
    // 如果选中园区，自动选中市区
    if (checkedValues.includes('zone_code') && !checkedValues.includes('district_code')) {
      setSearchFields([...checkedValues, 'district_code']);
    }
    // 如果选中街镇，自动选中市区和园区
    if (checkedValues.includes('town_code')) {
      const newFields = [...checkedValues];
      if (!newFields.includes('district_code')) newFields.push('district_code');
      if (!newFields.includes('zone_code')) newFields.push('zone_code');
      setSearchFields(newFields);
    }
  };

  const handleDisplayFieldsChange = (checkedValues: any[]) => {
    setDisplayFields(checkedValues);
  };

  // 初始化时加载所有投资方注册地选项（用于表格显示）和市区列表
  useEffect(() => {
    fetchDistrictList();
    fetchInvestorPlaceOptions();
    fetchForeignInvestorPlaceOptions();
  }, []);

  // 根据项目类别加载投资方注册地选项（用于搜索表单）
  useEffect(() => {
    if (selectedPType === '1') {
      fetchInvestorPlaceOptions();
    } else if (selectedPType === '2') {
      fetchForeignInvestorPlaceOptions();
    }
  }, [selectedPType]);

  const handleSearch = async (page = 1, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      console.log('表单值:', values);
      
      // 构建查询参数，只包含有值的字段
      const queryParams: any = {};
      if (values.s_name) queryParams.name = values.s_name;
      if (values.s_code) queryParams.code = values.s_code;
      if (values.s_p_type) queryParams.ptype = values.s_p_type;
      if (values.s_progress !== undefined && values.s_progress !== null) queryParams.progress = values.s_progress;
      if (values.s_invest_money) queryParams.investMoney = values.s_invest_money;
      if (values.s_district_code) queryParams.districtCode = values.s_district_code;
      if (values.s_zone_code) queryParams.zoneCode = values.s_zone_code;
      if (values.s_town_code) queryParams.townCode = values.s_town_code;
      if (values.s_proj_type) queryParams.projType = values.s_proj_type;
      if (values.s_industry_first_code) queryParams.industryFirstCode = values.s_industry_first_code;
      if (values.s_industry_code) queryParams.industryCode = values.s_industry_code;
      if (values.s_b_industry) queryParams.bindustry = values.s_b_industry;
      if (values.s_investor) queryParams.investor = values.s_investor;
      if (values.s_investor_type) queryParams.investorType = values.s_investor_type;
      if (values.s_investor_place) queryParams.investorPlace = values.s_investor_place;
      if (values.s_check_status !== undefined && values.s_check_status !== null) queryParams.checkStatus = values.s_check_status;
      
      console.log('查询参数:', queryParams);
      
      const response = await request('/zsxt-api/tProjProjectSigned/searchProjProjectSignedBy', {
        method: 'POST',
        data: {
          ...queryParams,
          page,
          pageSize,
        },
      });
      
      console.log('查询响应:', response);
      
      if (response && response.records) {
        setTableData(response.records);
        setPagination({
          current: response.page || page,
          pageSize: response.size || pageSize,
          total: response.total || 0
        });
      } else {
        setTableData([]);
        setPagination({ ...pagination, total: 0 });
      }
    } catch (error) {
      console.error('查询失败:', error);
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    searchForm.resetFields();
    setZoneOptions([]);
    setTownOptions([]);
    setZoneSelected(false);
  };

  // displayFields 中的字段已经都是驼峰命名，直接返回
  const toCamelCase = (str: string): string => {
    return str;
  };

  const handleExport = async () => {
    if (displayFields.length === 0) {
      message.warning('请至少选择一列进行导出');
      return;
    }

    setExporting(true);
    try {
      const values = searchForm.getFieldsValue();
      
      // 构建导出参数，包含查询条件和显示字段
      const exportParams: any = {};
      
      // 添加查询条件参数
      if (values.s_name) exportParams.name = values.s_name;
      if (values.s_code) exportParams.code = values.s_code;
      if (values.s_p_type) exportParams.ptype = values.s_p_type;
      if (values.s_progress !== undefined && values.s_progress !== null) exportParams.progress = values.s_progress;
      if (values.s_invest_money) exportParams.investMoney = values.s_invest_money;
      if (values.s_district_code) exportParams.districtCode = values.s_district_code;
      if (values.s_zone_code) exportParams.zoneCode = values.s_zone_code;
      if (values.s_town_code) exportParams.townCode = values.s_town_code;
      if (values.s_proj_type) exportParams.projType = values.s_proj_type;
      if (values.s_industry_first_code) exportParams.industryFirstCode = values.s_industry_first_code;
      if (values.s_industry_code) exportParams.industryCode = values.s_industry_code;
      if (values.s_b_industry) exportParams.bindustry = values.s_b_industry;
      if (values.s_investor) exportParams.investor = values.s_investor;
      if (values.s_investor_type) exportParams.investorType = values.s_investor_type;
      if (values.s_investor_place) exportParams.investorPlace = values.s_investor_place;
      if (values.s_check_status !== undefined && values.s_check_status !== null) exportParams.checkStatus = values.s_check_status;
      
      // 添加 displayFields 参数（数组格式）
      exportParams.displayFields = displayFields;
      
      console.log('导出参数:', exportParams);
      
      const response = await request('/zsxt-api/tProjProjectSigned/exportProjProjectSignedBy', {
        method: 'POST',
        data: exportParams,
      });

      console.log('导出响应:', response);

      if (!response || !response.path) {
        message.error('导出失败：未获取到文件路径');
        return;
      }

      // 后端返回的路径可能带有 hash，需要去掉
      let fileUrl = String(response.path).trim().replace(/#.*$/, '');
      if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
        fileUrl = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
      }

      // 使用 a 标签下载
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = response.name || `签约项目_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
      link.target = '_blank';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);

      message.success('导出成功');
    } catch (error: any) {
      console.error('导出失败:', error);
      console.error('错误详情:', error?.response?.data || error?.message);
      message.error(error?.message || '导出失败');
    } finally {
      setExporting(false);
    }
  };

  // 动态生成表格列
  const generateColumns = (): ColumnsType<ProjectDataType> => {
    const columnMap: Record<string, any> = {
      name: { title: '项目名称', dataIndex: 'name', key: 'name', width: 200, ellipsis: true },
      code: { title: '项目代码', dataIndex: 'code', key: 'code', width: 150 },
      investMoney: { title: '项目总投资', dataIndex: 'investMoney', key: 'investMoney', width: 120, sorter: true, render: (val: number) => val ? `${val}亿` : '-' },
      districtCode: { title: '市区代码', dataIndex: 'districtCode', key: 'districtCode', width: 120 },
      district: { title: '市区', dataIndex: 'district', key: 'district', width: 120 },
      zoneCode: { title: '园区代码', dataIndex: 'zoneCode', key: 'zoneCode', width: 120 },
      zoneName: { title: '园区', dataIndex: 'zoneName', key: 'zoneName', width: 150 },
      townCode: { title: '街镇代码', dataIndex: 'townCode', key: 'townCode', width: 120 },
      townName: { title: '街镇名称', dataIndex: 'townName', key: 'townName', width: 120 },
      ptype: { 
        title: '项目类别', 
        dataIndex: 'ptype', 
        key: 'ptype', 
        width: 100, 
        render: (type: number) => type === 1 ? '内资' : type === 2 ? '外资' : '-' 
      },
      projType: { title: '项目类型', dataIndex: 'projType', key: 'projType', width: 120 },
      industryFirstCode: { title: '产业大类代码', dataIndex: 'industryFirstCode', key: 'industryFirstCode', width: 120 },
      industryFirstName: { title: '产业大类', dataIndex: 'industryFirstName', key: 'industryFirstName', width: 120 },
      industryCode: { title: '行业代码', dataIndex: 'industryCode', key: 'industryCode', width: 120 },
      industryName: { title: '行业名称', dataIndex: 'industryName', key: 'industryName', width: 150 },
      bindustry: { 
        title: '所属行业', 
        dataIndex: 'bindustry', 
        key: 'bindustry', 
        width: 100,
        render: (type: number) => type === 1 ? '服务业' : type === 2 ? '制造业' : '-'
      },
      investor: { title: '投资方名称', dataIndex: 'investor', key: 'investor', width: 200 },
      investorType: { 
        title: '投资方性质', 
        dataIndex: 'investorType', 
        key: 'investorType', 
        width: 120,
        render: (type: number) => {
          const map: Record<number, string> = { 10: '央企', 20: '民营巨头', 30: '世界500强或跨国公司', 40: '其它' };
          return map[type] || '-';
        }
      },
      investorPlace: { 
        title: '投资方注册地', 
        dataIndex: 'investorPlace', 
        key: 'investorPlace', 
        width: 120,
        render: (place: string) => {
          const allOptions = [...investorPlaceOptions, ...foreignInvestorPlaceOptions];
          const option = allOptions.find(opt => opt.value === place);
          return option ? option.label : place || '-';
        }
      },
      desc: { title: '项目简介', dataIndex: 'desc', key: 'desc', width: 300, ellipsis: true },
      signedStatDate: { title: '签约统计日期', dataIndex: 'signedStatDate', key: 'signedStatDate', width: 120 },
      signedDate: { title: '签约日期', dataIndex: 'signedDate', key: 'signedDate', width: 120 },
      progress: { 
        title: '项目进度', 
        dataIndex: 'progress', 
        key: 'progress', 
        width: 100,
        render: (progress: number) => {
          const map: Record<number, string> = {
            0: '已签约', 1: '已注册', 2: '已开工', 3: '已竣工', 4: '完成报批', 5: '已备案'
          };
          return map[progress] || '-';
        }
      },
      checkStatus: { 
        title: '审核状态', 
        dataIndex: 'checkStatus', 
        key: 'checkStatus', 
        width: 120,
        render: (status: number) => {
          const map: Record<number, string> = {
            0: '待审核', 1: '市级审核通过', 2: '市区审核通过', 3: '审核不通过', 4: '保存未提交'
          };
          return map[status] || '-';
        }
      },
      finishCheckDate: { title: '完成报批日期', dataIndex: 'finishCheckDate', key: 'finishCheckDate', width: 150 },
      checkStatDate: { title: '备案（核准）统计日期', dataIndex: 'checkStatDate', key: 'checkStatDate', width: 160 },
      startDateCommit: { title: '开工日期', dataIndex: 'startDateCommit', key: 'startDateCommit', width: 120 },
      completeDate: { title: '竣工日期', dataIndex: 'completeDate', key: 'completeDate', width: 120 },
      isSixpro: { 
        title: '是否为六大产业', 
        dataIndex: 'isSixpro', 
        key: 'isSixpro', 
        width: 120,
        render: (val: number) => val === 1 ? '是' : val === 2 ? '否' : '-'
      },
      sixproCode: { 
        title: '六大产业代码', 
        dataIndex: 'sixproCode', 
        key: 'sixproCode', 
        width: 120,
        render: (code: string) => {
          const map: Record<string, string> = {
            '1': '高技术船舶', '2': '汽车及零部件', '3': '精细化工',
            '4': '石油化工', '5': '生物医药', '6': '新能源'
          };
          return map[code] || '-';
        }
      },
      companyName: { title: '注册公司名称', dataIndex: 'companyName', key: 'companyName', width: 200 },
      regMoney: { title: '注册资金', dataIndex: 'regMoney', key: 'regMoney', width: 120 },
      regDate: { title: '注册日期', dataIndex: 'regDate', key: 'regDate', width: 120 },
      regStatDate: { title: '注册统计日期', dataIndex: 'regStatDate', key: 'regStatDate', width: 120 },
      actualInvest: { title: '实际投入资金规模', dataIndex: 'actualInvest', key: 'actualInvest', width: 150 },
      sumActualInvest: { title: '累计实际投入资金规模', dataIndex: 'sumActualInvest', key: 'sumActualInvest', width: 150 },
      checkName: { title: '备案（核准）项目名称', dataIndex: 'checkName', key: 'checkName', width: 200 },
      checkMoney: { title: '备案（核准）投资总额', dataIndex: 'checkMoney', key: 'checkMoney', width: 150 },
      checkDate: { title: '备案（核准）日期', dataIndex: 'checkDate', key: 'checkDate', width: 120 },
      creatorName: { title: '创建人', dataIndex: 'creatorName', key: 'creatorName', width: 120 },
      foreignMoney: { title: '协议利用外资', dataIndex: 'foreignMoney', key: 'foreignMoney', width: 120 },
      placeInfo: { title: '投资方地址', dataIndex: 'placeInfo', key: 'placeInfo', width: 200 },
      linker: { title: '投资方联系人', dataIndex: 'linker', key: 'linker', width: 120 },
      linkerTel: { title: '投资方联系电话', dataIndex: 'linkerTel', key: 'linkerTel', width: 120 },
      linkerTz: { title: '招商人员', dataIndex: 'linkerTz', key: 'linkerTz', width: 120 },
      linkerTzTel: { title: '招商人员电话', dataIndex: 'linkerTzTel', key: 'linkerTzTel', width: 120 },
      qyje: { title: '签约金额', dataIndex: 'qyje', key: 'qyje', width: 120 },
      investLevel: { title: '投资强度', dataIndex: 'investLevel', key: 'investLevel', width: 120 },
      planStartDate: { title: '计划开工时间', dataIndex: 'planStartDate', key: 'planStartDate', width: 120 },
      planEndDate: { title: '计划竣工时间', dataIndex: 'planEndDate', key: 'planEndDate', width: 120 },
      projectAddress: { title: '项目选址位置', dataIndex: 'projectAddress', key: 'projectAddress', width: 200 },
      sqLandArea: { title: '申请用地面积', dataIndex: 'sqLandArea', key: 'sqLandArea', width: 120 },
      isGxjs: { title: '是否高新技术企业', dataIndex: 'isGxjs', key: 'isGxjs', width: 120 },
      isSwzjtr: { title: '是否有市外资金投入', dataIndex: 'isSwzjtr', key: 'isSwzjtr', width: 120 },
      gqbl: { title: '股权比例', dataIndex: 'gqbl', key: 'gqbl', width: 120 },
      cityProject: { title: '是否市级重点项目', dataIndex: 'cityProject', key: 'cityProject', width: 120 },
      provincialProject: { title: '是否省级重点项目', dataIndex: 'provincialProject', key: 'provincialProject', width: 120 },
    };

    return displayFields.map(field => columnMap[field]).filter(Boolean);
  };

  return (
    <PageContainer>
      <div style={{ background: '#fff' }}>
        {/* 字段选择区域 */}
        <Card title={<span style={{ color: '#0D8BBD', fontSize: '14px' }}>搜索条件项</span>} style={{ marginBottom: '16px' }}>
          <Checkbox.Group value={searchFields} onChange={handleSearchFieldsChange}>
            <Row>
              {searchFieldsConfig.map(field => (
                <Col span={6} key={field.value} style={{ marginBottom: '8px' }}>
                  <Checkbox value={field.value}>{field.label}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Card>

        <Card title={<span style={{ color: '#0D8BBD', fontSize: '14px' }}>显示项</span>} style={{ marginBottom: '16px' }}>
          <Checkbox.Group value={displayFields} onChange={handleDisplayFieldsChange}>
            <Row>
              {displayFieldsConfig.map(field => (
                <Col span={6} key={field.value} style={{ marginBottom: '8px' }}>
                  <Checkbox value={field.value}>{field.label}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Card>

        {/* 搜索条件区域 */}
        <div
          style={{
            padding: '20px',
            backgroundImage: 'url(/pm-bg1.png)',
            backgroundSize: '100% 100%',
          }}
        >
          <Form form={searchForm} name="searchForm">
            <Row gutter={16}>
              {searchFields.includes('name') && (
                <Col span={6}>
                  <Form.Item label="项目名称" name="s_name">
                    <Input placeholder="请输入项目名称" />
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('code') && (
                <Col span={6}>
                  <Form.Item label="项目代码" name="s_code">
                    <Input placeholder="请输入项目代码" />
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('p_type') && (
                <Col span={6}>
                  <Form.Item label="项目类别" name="s_p_type">
                    <Select 
                      placeholder="请选择" 
                      allowClear
                      onChange={(value) => {
                        setSelectedPType(value);
                        // 清空投资方注册地的值
                        searchForm.setFieldsValue({ s_investor_place: undefined });
                      }}
                    >
                      <Select.Option value="1">内资</Select.Option>
                      <Select.Option value="2">外资</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('progress') && (
                <Col span={6}>
                  <Form.Item label="项目进度" name="s_progress">
                    <Select placeholder="请选择" allowClear>
                      <Select.Option value="0">已签约</Select.Option>
                      <Select.Option value="1">已注册</Select.Option>
                      <Select.Option value="5">已备案</Select.Option>
                      <Select.Option value="2">已开工</Select.Option>
                      <Select.Option value="3">已竣工</Select.Option>
                      <Select.Option value="4">完成报批</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('invest_money') && (
                <Col span={6}>
                  <Form.Item label="项目总投资" name="s_invest_money">
                    <Select placeholder="全部" allowClear>
                      <Select.Option value="1">5亿(3000万美元)以上</Select.Option>
                      <Select.Option value="2">5亿(3000万美元)以下</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('district_code') && (
                <Col span={6}>
                  <Form.Item label="市区" name="s_district_code">
                    <Select placeholder="请选择" allowClear onChange={handleDistrictChange}>
                      {districtOptions.map(item => (
                        <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('zone_code') && (
                <Col span={6}>
                  <Form.Item label="园区" name="s_zone_code">
                    <Select placeholder="请先选择市区" allowClear onChange={handleZoneChange} disabled={zoneOptions.length === 0}>
                      {zoneOptions.map(item => (
                        <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('town_code') && (
                <Col span={6}>
                  <Form.Item label="街镇" name="s_town_code">
                    <Select placeholder={!zoneSelected ? "请先选择园区" : (townOptions.length === 0 ? "暂无镇街" : "请选择镇街")} allowClear disabled={townOptions.length === 0}>
                      {townOptions.map(item => (
                        <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('proj_type') && (
                <Col span={6}>
                  <Form.Item label="项目类型" name="s_proj_type">
                    <Input placeholder="请输入项目类型" />
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('industry_first_code') && (
                <Col span={6}>
                  <Form.Item label="产业大类" name="s_industry_first_code">
                    <Select placeholder="请选择" allowClear>
                      <Select.Option value="">请选择</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('industry_code') && (
                <Col span={6}>
                  <Form.Item label="行业编码" name="s_industry_code">
                    <Input placeholder="请输入行业编码" />
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('b_industry') && (
                <Col span={6}>
                  <Form.Item label="所属行业" name="s_b_industry">
                    <Select placeholder="请选择" allowClear>
                      <Select.Option value="1">服务业</Select.Option>
                      <Select.Option value="2">制造业</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('investor') && (
                <Col span={6}>
                  <Form.Item label="投资方名称" name="s_investor">
                    <Input placeholder="请输入投资方名称" />
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('investor_type') && (
                <Col span={6}>
                  <Form.Item label="投资方性质" name="s_investor_type">
                    <Select placeholder="请选择" allowClear>
                      <Select.Option value="10">央企</Select.Option>
                      <Select.Option value="20">民营巨头</Select.Option>
                      <Select.Option value="30">世界500强或跨国公司</Select.Option>
                      <Select.Option value="40">其它</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('investor_place') && (
                <Col span={6}>
                  <Form.Item label="投资方注册地" name="s_investor_place">
                    <Select 
                      placeholder={!selectedPType ? '请先选择项目类别' : '请选择'} 
                      allowClear
                      disabled={!selectedPType}
                    >
                      {selectedPType === '1' && investorPlaceOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                      {selectedPType === '2' && foreignInvestorPlaceOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('check_status') && (
                <Col span={6}>
                  <Form.Item label="审核状态" name="s_check_status">
                    <Select placeholder="请选择" allowClear>
                      <Select.Option value="0">待审核</Select.Option>
                      <Select.Option value="1">市级审核通过</Select.Option>
                      <Select.Option value="2">市区审核通过</Select.Option>
                      <Select.Option value="3">审核不通过</Select.Option>
                      <Select.Option value="4">保存未提交</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('is_sixpro') && (
                <Col span={6}>
                  <Form.Item label="是否为六大产业" name="s_is_sixpro">
                    <Select placeholder="请选择" allowClear>
                      <Select.Option value="1">是</Select.Option>
                      <Select.Option value="2">否</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('sixpro_code') && (
                <Col span={6}>
                  <Form.Item label="六大产业名称" name="s_sixpro_code">
                    <Select placeholder="请选择" allowClear>
                      <Select.Option value="1">高技术船舶</Select.Option>
                      <Select.Option value="2">汽车及零部件</Select.Option>
                      <Select.Option value="3">精细化工</Select.Option>
                      <Select.Option value="4">石油化工</Select.Option>
                      <Select.Option value="5">生物医药</Select.Option>
                      <Select.Option value="6">新能源</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('signed_stat_date') && (
                <Col span={6}>
                  <Form.Item label="签约统计日期" name="s_signed_stat_date">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('signed_date') && (
                <Col span={6}>
                  <Form.Item label="签约日期" name="s_signed_date">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('check_stat_date') && (
                <Col span={6}>
                  <Form.Item label="备案统计日期" name="s_check_stat_date">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('finish_check_date') && (
                <Col span={6}>
                  <Form.Item label="完成报批统计日期" name="s_finish_check_date">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('start_commit_date') && (
                <Col span={6}>
                  <Form.Item label="开工认定日期" name="s_startdate">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              )}
              {searchFields.includes('complete_date') && (
                <Col span={6}>
                  <Form.Item label="竣工认定日期" name="s_enddate">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              )}
            </Row>
            
            {searchFields.length > 0 && (
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" onClick={() => handleSearch(1)}>
                      查询
                    </Button>
                    <Button onClick={handleReset}>重置</Button>
                    <Button onClick={handleExport} loading={exporting}>导出</Button>
                  </Space>
                </Col>
              </Row>
            )}
          </Form>
        </div>

        {/* 表格区域 */}
        <div style={{ padding: '20px' }}>
          <Table
            columns={generateColumns()}
            dataSource={tableData}
            loading={loading}
            rowKey="id"
            bordered
            scroll={{ x: 'max-content' }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (page, pageSize) => {
                handleSearch(page, pageSize || 100);
              },
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default CombinedReport;
