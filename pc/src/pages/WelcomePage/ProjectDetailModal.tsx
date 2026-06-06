import fourWarZoneApi, {
  type RequirementItem,
  type ZoneInvestmentItem,
  type ZoneInvestmentListParams,
} from '@/services/fourWarZone/fourWarZone';
import {
  PROJECT_TYPE_DATA,
  REQUIREMENT_DATA,
  STATS_DATA,
  type ActivityItem,
  type BusinessTripItem,
  type PersonItem,
  type ProjectTypeItem,
  type StatItem,
} from '@/services/fourWarZone/fourWarZoneMockData';
import { CloseOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import { Button, Input, Modal, Pagination, Select, Spin, Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './ProjectDetailModal.module.css';

interface ProjectDetailModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
}

const PROJECT_TABLE_PAGE_SIZE = 10;

/** 表格序号列：从 1 起按当前页连续递增 */
const createSerialNumberColumn = <T,>(page: number, pageSize: number): ColumnsType<T>[number] => ({
  title: '序号',
  key: 'serialNumber',
  width: 60,
  align: 'center',
  render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
});

const PROJECT_DATA_COLUMNS: ColumnsType<ZoneInvestmentItem> = [
  { title: '投资方', dataIndex: 'investor', key: 'investor', width: 150, ellipsis: true },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', width: 180, ellipsis: true },
  {
    title: '项目类别',
    dataIndex: 'projectCategory',
    key: 'projectCategory',
    width: 80,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '投资额(亿元)',
    dataIndex: 'investmentAmount',
    key: 'investmentAmount',
    width: 100,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '项目内容',
    dataIndex: 'projectContent',
    key: 'projectContent',
    width: 150,
    ellipsis: true,
  },
  { title: '市区', dataIndex: 'district', key: 'district', width: 100 },
  { title: '园区', dataIndex: 'zoneName', key: 'zoneName', width: 120, ellipsis: true },
  { title: '镇街', dataIndex: 'townName', key: 'townName', width: 100, ellipsis: true },
  { title: '录入时间', dataIndex: 'entryTime', key: 'entryTime', width: 140, ellipsis: true },
  {
    title: '洽谈进度',
    dataIndex: 'negotiationProgressName',
    key: 'negotiationProgressName',
    width: 80,
    align: 'center',
    ellipsis: true,
  },
];

const PERSON_DATA_COLUMNS: ColumnsType<PersonItem> = [
  { title: '姓名', dataIndex: 'name', key: 'name', width: 80, ellipsis: true },
  {
    title: '专攻方向',
    dataIndex: 'specialization',
    key: 'specialization',
    width: 100,
    ellipsis: true,
  },
  { title: '职务', dataIndex: 'position', key: 'position', width: 80, ellipsis: true },
  { title: '招商区域', dataIndex: 'investPlace', key: 'investPlace', width: 100, ellipsis: true },
  { title: '市区', dataIndex: 'district', key: 'district', width: 100, ellipsis: true },
  { title: '园区', dataIndex: 'zone', key: 'zone', width: 100, ellipsis: true },
  { title: '街镇', dataIndex: 'town', key: 'town', width: 80, ellipsis: true },
  { title: '学历', dataIndex: 'xl', key: 'xl', width: 70, align: 'center', ellipsis: true },
  { title: '联系方式', dataIndex: 'phone', key: 'phone', width: 120, ellipsis: true },
];

const BUSINESS_TRIP_DATA_COLUMNS: ColumnsType<BusinessTripItem> = [
  { title: '市区', dataIndex: 'name', key: 'name', width: 120, ellipsis: true },
  { title: '园区', dataIndex: 'zoneName', key: 'zoneName', width: 120, ellipsis: true },
  { title: '街镇', dataIndex: 'townName', key: 'townName', width: 100, ellipsis: true },
  { title: '团组名称', dataIndex: 'groupName', key: 'groupName', width: 100, ellipsis: true },
  { title: '主要成员', dataIndex: 'mainMembers', key: 'mainMembers', width: 100, ellipsis: true },
  {
    title: '出访地/国家、地区',
    dataIndex: 'visitDestination',
    key: 'visitDestination',
    width: 100,
    ellipsis: true,
  },
  {
    title: '主要开展活动和拜访企业',
    dataIndex: 'activitiesAndVisits',
    key: 'activitiesAndVisits',
    width: 180,
    ellipsis: true,
  },
  { title: '取得成果', dataIndex: 'achievements', key: 'achievements', width: 180, ellipsis: true },
  { title: '下一步打算', dataIndex: 'nextPlan', key: 'nextPlan', width: 120, ellipsis: true },
];

const REQUIREMENT_TABLE_PAGE_SIZE = 10;

const REQUIREMENT_DATA_COLUMNS = (page: number, pageSize: number): ColumnsType<RequirementItem> => [
  createSerialNumberColumn<RequirementItem>(page, pageSize),
  {
    title: '市区',
    dataIndex: 'districtName',
    key: 'districtName',
    width: 80,
    ellipsis: true,
  },
  {
    title: '园区',
    dataIndex: 'zoneName',
    key: 'zoneName',
    width: 160,
    ellipsis: true,
  },
  {
    title: '镇街',
    dataIndex: 'townName',
    key: 'townName',
    width: 80,
    ellipsis: true,
  },
  {
    title: '需求标题',
    dataIndex: 'title',
    key: 'title',
    width: 180,
    ellipsis: true,
  },
  {
    title: '需求内容',
    dataIndex: 'content',
    key: 'content',
    width: 200,
    ellipsis: true,
  },
  {
    title: '联系人',
    dataIndex: 'linkerName',
    key: 'linkerName',
    width: 80,
    ellipsis: true,
  },
  {
    title: '联系方式',
    dataIndex: 'linkerTel',
    key: 'linkerTel',
    width: 120,
    ellipsis: true,
  },
  {
    title: '期望解决时间',
    dataIndex: 'expectTime',
    key: 'expectTime',
    width: 100,
    ellipsis: true,
  },
  {
    title: '审核状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    align: 'center',
    ellipsis: true,
    render: (status: number) => {
      const statusMap: Record<number, string> = {
        0: '待审核',
        1: '已审核',
        2: '已答复',
      };
      return statusMap[status] ?? '未知';
    },
  },
  {
    title: '审核意见',
    dataIndex: 'auditRemark',
    key: 'auditRemark',
    width: 150,
    ellipsis: true,
  },
  {
    title: '答复意见',
    dataIndex: 'replyContent',
    key: 'replyContent',
    width: 150,
    ellipsis: true,
  },
];

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ visible, onClose, title }) => {
  const [activeTab, setActiveTab] = useState('project');
  const [projectSearchKeyword, setProjectSearchKeyword] = useState('');
  const [activitySearchKeyword, setActivitySearchKeyword] = useState('');
  const [projectCurrentPage, setProjectCurrentPage] = useState(1);
  const [activityCurrentPage, setActivityCurrentPage] = useState(1);
  const [personCurrentPage, setPersonCurrentPage] = useState(1);
  const [personCardView, setPersonCardView] = useState(false);
  const activityPageSize = 9;
  const personCardPageSize = 8;

  const [projectList, setProjectList] = useState<ZoneInvestmentItem[]>([]);
  const [projectListTotal, setProjectListTotal] = useState(0);
  const [activityList, setActivityList] = useState<ActivityItem[]>([]);
  const [activityListTotal, setActivityListTotal] = useState(0);
  const [personList, setPersonList] = useState<PersonItem[]>([]);
  const [personListTotal, setPersonListTotal] = useState(0);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [projectType, setProjectType] = useState<ProjectTypeItem[]>(PROJECT_TYPE_DATA);
  const [businessTripList, setBusinessTripList] = useState<BusinessTripItem[]>([]);
  const [businessTripListTotal, setBusinessTripListTotal] = useState(0);
  const [businessTripCurrentPage, setBusinessTripCurrentPage] = useState(1);
  const [businessTripSearchKeyword, setBusinessTripSearchKeyword] = useState('');
  const [filterBusinessTripGroupName, setFilterBusinessTripGroupName] = useState<string>('');
  const [filterBusinessTripMainMembers, setFilterBusinessTripMainMembers] = useState<string>('');
  const [filterBusinessTripDistrictCode, setFilterBusinessTripDistrictCode] = useState<string>('');
  const [filterBusinessTripZoneCode, setFilterBusinessTripZoneCode] = useState<string>('');
  const [businessTripDistrictOptions, setBusinessTripDistrictOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [businessTripZoneOptions, setBusinessTripZoneOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [modalLoading, setModalLoading] = useState(false);
  const overseasTitle = '境外';

  const [filterProjectCategory, setFilterProjectCategory] = useState<string>('');
  const [filterDataStatus, setFilterDataStatus] = useState<string>('');
  const [filterDistrictCode, setFilterDistrictCode] = useState<string>('');
  const [filterZoneCode, setFilterZoneCode] = useState<string>('');
  const [filterTownCode, setFilterTownCode] = useState<string>('');
  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>([]);
  const [zoneOptions, setZoneOptions] = useState<{ label: string; value: string }[]>([]);
  const [townOptions, setTownOptions] = useState<{ label: string; value: string }[]>([]);

  const [filterActivityDistrictCode, setFilterActivityDistrictCode] = useState<string>('');
  const [filterActivityZoneCode, setFilterActivityZoneCode] = useState<string>('');
  const [filterActivityTownCode, setFilterActivityTownCode] = useState<string>('');
  const [filterActivityIndustry, setFilterActivityIndustry] = useState<string>('');
  const [filterActivityAuditStatus, setFilterActivityAuditStatus] = useState<string>('');
  const [activityDistrictOptions, setActivityDistrictOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [activityZoneOptions, setActivityZoneOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [activityTownOptions, setActivityTownOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [filterPersonDistrictCode, setFilterPersonDistrictCode] = useState<string>('');
  const [filterPersonZoneCode, setFilterPersonZoneCode] = useState<string>('');
  const [filterPersonTownCode, setFilterPersonTownCode] = useState<string>('');
  const [filterPersonName, setFilterPersonName] = useState<string>('');
  const [filterPersonInvestPlace, setFilterPersonInvestPlace] = useState<string>('');
  const [filterPersonEducation, setFilterPersonEducation] = useState<string>('');
  const [personDistrictOptions, setPersonDistrictOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [personZoneOptions, setPersonZoneOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [personTownOptions, setPersonTownOptions] = useState<{ label: string; value: string }[]>(
    [],
  );

  const personEducationOptions = [
    { label: '小学', value: '01' },
    { label: '初中', value: '02' },
    { label: '高中', value: '03' },
    { label: '大专', value: '04' },
    { label: '本科', value: '05' },
    { label: '硕士研究生', value: '06' },
    { label: '博士研究生', value: '07' },
  ];

  const [requirementList, setRequirementList] = useState<RequirementItem[]>([]);
  const [requirementListTotal, setRequirementListTotal] = useState(0);
  const [requirementCurrentPage, setRequirementCurrentPage] = useState(1);
  const [requirementSearchKeyword, setRequirementSearchKeyword] = useState('');
  const [requirementDistrictOptions, setRequirementDistrictOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [requirementZoneOptions, setRequirementZoneOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [requirementTownOptions, setRequirementTownOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [requirementContact, setRequirementContact] = useState<string>('');
  const [requirementDistrictCode, setRequirementDistrictCode] = useState<string>('');
  const [requirementZoneCode, setRequirementZoneCode] = useState<string>('');
  const [requirementTownCode, setRequirementTownCode] = useState<string>('');

  useEffect(() => {
    loadProjectList();
    loadRequirementList();
    loadActivityList();
    loadPersonList();
    loadBusinessTripList();
  }, []);

  useEffect(() => {
    if (visible) {
      setActiveTab('project');

      // 重置筛选条件

      // 重置在谈项目筛选条件
      setProjectSearchKeyword('');
      setActivitySearchKeyword('');
      setFilterProjectCategory('');
      setFilterDataStatus('');
      setFilterDistrictCode('');
      setFilterZoneCode('');
      setFilterTownCode('');
      setZoneOptions([]);
      setTownOptions([]);

      // 重置招商需求筛选条件
      setRequirementSearchKeyword('');
      setRequirementDistrictCode('');
      setRequirementZoneCode('');
      setRequirementTownCode('');
      setRequirementDistrictOptions([]);
      setRequirementZoneOptions([]);
      setRequirementTownOptions([]);

      // 重置招商活动筛选条件
      setFilterActivityDistrictCode('');
      setFilterActivityZoneCode('');
      setFilterActivityTownCode('');
      setFilterActivityIndustry('');
      setFilterActivityAuditStatus('');
      setActivityDistrictOptions([]);
      setActivityZoneOptions([]);
      setActivityTownOptions([]);

      // 重置招商人员筛选条件
      setFilterPersonDistrictCode('');
      setFilterPersonZoneCode('');
      setFilterPersonTownCode('');
      setFilterPersonName('');
      setFilterPersonInvestPlace('');
      setFilterPersonEducation('');
      setPersonDistrictOptions([]);
      setPersonZoneOptions([]);
      setPersonTownOptions([]);

      // 重置分页条件
      setProjectCurrentPage(1);
      setActivityCurrentPage(1);
      setPersonCurrentPage(1);
      setBusinessTripCurrentPage(1);
      setRequirementCurrentPage(1);

      setPersonCardView(false);

      loadStats();
      loadRequirementList();
      loadProjectList();
      loadActivityList();
      loadBusinessTripList();
      loadPersonList();

      // 加载市区列表
      fetchDistrictList();
    }
  }, [visible, title]);

  // 在谈项目市区筛选
  useEffect(() => {
    setFilterZoneCode('');
    setFilterTownCode('');
    setZoneOptions([]);
    setTownOptions([]);
    if (filterDistrictCode) {
      fetchZoneList(filterDistrictCode);
    }
  }, [filterDistrictCode]);

  // 在谈项目园区筛选
  useEffect(() => {
    setFilterTownCode('');
    if (filterZoneCode) {
      fetchTownList(filterZoneCode);
    } else {
      setTownOptions([]);
    }
  }, [filterZoneCode]);

  // 招商需求市区筛选
  useEffect(() => {
    setRequirementZoneCode('');
    setRequirementTownCode('');
    setRequirementZoneOptions([]);
    setRequirementTownOptions([]);
    if (requirementDistrictCode) {
      fetchRequirementZoneList(requirementDistrictCode);
    }
  }, [requirementDistrictCode]);

  // 招商需求园区筛选
  useEffect(() => {
    setRequirementTownCode('');
    if (requirementZoneCode) {
      fetchRequirementTownList(requirementZoneCode);
    } else {
      setRequirementTownOptions([]);
    }
  }, [requirementZoneCode]);

  // 加载在谈项目列表
  useEffect(() => {
    loadProjectList();
  }, [
    visible,
    projectSearchKeyword,
    projectCurrentPage,
    filterProjectCategory,
    filterDataStatus,
    filterDistrictCode,
    filterZoneCode,
    filterTownCode,
  ]);

  // 加载招商活动列表
  useEffect(() => {
    if (visible) {
      loadActivityList();
    }
  }, [
    visible,
    activitySearchKeyword,
    activityCurrentPage,
    filterActivityDistrictCode,
    filterActivityZoneCode,
    filterActivityTownCode,
    filterActivityAuditStatus,
  ]);

  // 加载因公出访列表
  useEffect(() => {
    if (visible) {
      loadBusinessTripList();
    }
  }, [
    visible,
    businessTripSearchKeyword,
    businessTripCurrentPage,
    filterBusinessTripGroupName,
    filterBusinessTripMainMembers,
    filterBusinessTripDistrictCode,
    filterBusinessTripZoneCode,
  ]);

  const fetchBusinessTripZoneList = async (pid: string) => {
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
        setBusinessTripZoneOptions(options);
      }
    } catch (error) {
      console.error('获取因公出访园区列表失败:', error);
    }
  };

  useEffect(() => {
    setFilterBusinessTripZoneCode('');
    setBusinessTripZoneOptions([]);
    if (filterBusinessTripDistrictCode) {
      fetchBusinessTripZoneList(filterBusinessTripDistrictCode);
    }
  }, [filterBusinessTripDistrictCode]);

  // 加载招商人员列表
  useEffect(() => {
    if (visible) {
      loadPersonList();
    }
  }, [
    visible,
    personCurrentPage,
    filterPersonName,
    filterPersonDistrictCode,
    filterPersonZoneCode,
    filterPersonTownCode,
    filterPersonEducation,
  ]);

  useEffect(() => {
    if (visible) {
      loadRequirementList();
      console.log("🚀 ~ ProjectDetailModal ~ loadRequirementList:")
    }
  }, [
    visible,
    requirementSearchKeyword,
    requirementCurrentPage,
    requirementDistrictCode,
    requirementZoneCode,
    requirementTownCode,
  ]);

  const loadRequirementList = async () => {
    try {
      setModalLoading(true);
      const res = await fourWarZoneApi.getRequirementList({
        countryRegionStandard: title,
        page: requirementCurrentPage,
        size: REQUIREMENT_TABLE_PAGE_SIZE,
        demandTitle: requirementSearchKeyword || undefined,
        districtCode: requirementDistrictCode || undefined,
        zoneCode: requirementZoneCode || undefined,
        townCode: requirementTownCode || undefined,
      });
      setRequirementList(res.data.records);
      setRequirementListTotal(res.data.total);
    } catch (error) {
      console.error('Failed to load requirement list:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const loadProjectList = async () => {
    try {
      setModalLoading(true);
      const params: ZoneInvestmentListParams = {
        countryRegionStandard: title,
        page: projectCurrentPage,
        size: PROJECT_TABLE_PAGE_SIZE,
        investorName: projectSearchKeyword || undefined,
        projectCategory: filterProjectCategory || undefined,
        dataStatus: filterDataStatus || undefined,
        districtCode: filterDistrictCode || undefined,
        zoneCode: filterZoneCode || undefined,
        townCode: filterTownCode || undefined,
      };
      const res = await fourWarZoneApi.getZoneInvestmentList(params);
      setProjectListTotal(res.data.total);
      setProjectList(res.data.records);
    } catch (error) {
      console.error('Failed to load project list:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const loadActivityList = async () => {
    try {
      const res = await fourWarZoneApi.getActivityList({
        countryRegionStandard: title,
        districtCode: filterActivityDistrictCode || undefined,
        zoneCode: filterActivityZoneCode || undefined,
        townCode: filterActivityTownCode || undefined,
        industryName: filterActivityIndustry || undefined,
        auditStatus: filterActivityAuditStatus || undefined,
        page: activityCurrentPage,
        size: 9,
      });
      setActivityList(res.data.records);
      setActivityListTotal(res.data.total);
    } catch (error) {
      console.error('Failed to load activity list:', error);
    }
  };

  const loadPersonList = async () => {
    try {
      const res = await fourWarZoneApi.getPersonList({
        countryRegionStandard: title,
        page: personCurrentPage,
        size: 10,
        name: filterPersonName || undefined,
        districtCode: filterPersonDistrictCode || undefined,
        zoneCode: filterPersonZoneCode || undefined,
        townCode: filterPersonTownCode || undefined,
        investPlace: filterPersonInvestPlace || undefined,
        xl: filterPersonEducation || undefined,
      });
      setPersonList(
        res.data.records.map((item: any) => ({
          ...item,
          xl: personEducationOptions.find((opt) => opt.value === item.xl)?.label || '',
        })),
      );
      setPersonListTotal(res.data.total);
    } catch (error) {
      console.error('Failed to load person list:', error);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fourWarZoneApi.getStats({ countryRegionStandard: title });

      const statsData = STATS_DATA.map((stat: StatItem) => {
        const rawValue = res.data[stat.dataIndex];
        let displayValue: string;
        if (stat.dataIndex === 'totalInvestmentAmount') {
          displayValue = `${Number(rawValue || 0).toFixed(2)}亿`;
        } else {
          displayValue = String(rawValue || 0);
        }
        return { ...stat, value: displayValue };
      });

      // 根据战区类型过滤显示的统计项
      const filteredStats = statsData.filter((stat: StatItem) => {
        if (title === overseasTitle) {
          return stat.label !== '招商活动';
        } else {
          return stat.label !== '因公出访';
        }
      });
      setStats(filteredStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadBusinessTripList = async () => {
    try {
      const res = await fourWarZoneApi.getBusinessTripList({
        page: businessTripCurrentPage,
        size: PROJECT_TABLE_PAGE_SIZE,
        visitDestination: businessTripSearchKeyword || undefined,
        groupName: filterBusinessTripGroupName || undefined,
        mainMembers: filterBusinessTripMainMembers || undefined,
        districtCode: filterBusinessTripDistrictCode || undefined,
        zoneCode: filterBusinessTripZoneCode || undefined,
      });
      setBusinessTripList(res.data.records);
      setBusinessTripListTotal(res.data.total);
    } catch (error) {
      console.error('Failed to load business trip list:', error);
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
        setRequirementDistrictOptions(options);
        setDistrictOptions(options);
        setActivityDistrictOptions(options);
        setPersonDistrictOptions(options);
        setBusinessTripDistrictOptions(options);
      }
    } catch (error) {
      console.error('获取市（区）列表失败:', error);
    }
  };

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
    }
  };

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
    }
  };

  const fetchRequirementZoneList = async (pid: string) => {
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
        setRequirementZoneOptions(options);
      }
    } catch (error) {
      console.error('获取园区列表失败:', error);
    }
  };

  const fetchRequirementTownList = async (pid: string) => {
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
        setRequirementTownOptions(options);
      }
    } catch (error) {
      console.error('获取镇街列表失败:', error);
    }
  };

  const fetchActivityZoneList = async (pid: string) => {
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
        setActivityZoneOptions(options);
      }
    } catch (error) {
      console.error('获取招商活动园区列表失败:', error);
    }
  };

  const fetchActivityTownList = async (pid: string) => {
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
        setActivityTownOptions(options);
      }
    } catch (error) {
      console.error('获取招商活动镇街列表失败:', error);
    }
  };

  const fetchPersonZoneList = async (pid: string) => {
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
        setPersonZoneOptions(options);
      }
    } catch (error) {
      console.error('获取招商人员园区列表失败:', error);
    }
  };

  const fetchPersonTownList = async (pid: string) => {
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
        setPersonTownOptions(options);
      }
    } catch (error) {
      console.error('获取招商人员镇街列表失败:', error);
    }
  };

  const handleActivityDistrictChange = (value: string) => {
    setFilterActivityDistrictCode(value);
    setFilterActivityZoneCode('');
    setFilterActivityTownCode('');
    if (!value) {
      setActivityZoneOptions([]);
      setActivityTownOptions([]);
    } else {
      fetchActivityZoneList(value);
    }
    setActivityCurrentPage(1);
  };

  const handlePersonDistrictChange = (value: string) => {
    setFilterPersonDistrictCode(value);
    setFilterPersonZoneCode('');
    setFilterPersonTownCode('');
    if (!value) {
      setPersonZoneOptions([]);
      setPersonTownOptions([]);
    } else {
      fetchPersonZoneList(value);
    }
    setPersonCurrentPage(1);
  };

  const handleActivityZoneChange = (value: string) => {
    setFilterActivityZoneCode(value);
    setFilterActivityTownCode('');
    if (!value) {
      setActivityTownOptions([]);
    } else {
      fetchActivityTownList(value);
    }
    setActivityCurrentPage(1);
    loadActivityList();
  };

  const handleActivityTownChange = (value: string) => {
    setFilterActivityTownCode(value);
    setActivityCurrentPage(1);
    loadActivityList();
  };

  const handlePersonZoneChange = (value: string) => {
    setFilterPersonZoneCode(value);
    setFilterPersonTownCode('');
    if (!value) {
      setPersonTownOptions([]);
    } else {
      fetchPersonTownList(value);
    }
    setPersonCurrentPage(1);
  };

  const handlePersonTownChange = (value: string) => {
    setFilterPersonTownCode(value);
    setPersonCurrentPage(1);
  };

  const handleRequirementSearch = () => {
    setRequirementCurrentPage(1);
    loadRequirementList();
  };

  const handleRequirementPageChange = (page: number) => {
    setRequirementCurrentPage(page);
  };

  const handleProjectSearch = () => {
    setProjectCurrentPage(1);
    loadProjectList();
  };

  const handleActivitySearch = () => {
    setActivityCurrentPage(1);
    loadActivityList();
  };

  const handleBusinessTripSearch = () => {
    setBusinessTripCurrentPage(1);
    loadBusinessTripList();
  };

  const handlePersonSearch = () => {
    setPersonCurrentPage(1);
    loadPersonList();
  };

  const handleBusinessTripPageChange = (page: number, pageSize: number) => {
    setBusinessTripCurrentPage(page);
  };

  const handleProjectPageChange = (page: number) => {
    setProjectCurrentPage(page);
  };

  const handlePersonPageChange = (page: number) => {
    setPersonCurrentPage(page);
  };

  const handleActivityPageChange = (page: number) => {
    setActivityCurrentPage(page);
  };

  const projectTableColumns = useMemo(
    () => [
      createSerialNumberColumn<ZoneInvestmentItem>(projectCurrentPage, PROJECT_TABLE_PAGE_SIZE),
      ...PROJECT_DATA_COLUMNS,
    ],
    [projectCurrentPage],
  );

  const personTableColumns = useMemo(
    () => [
      createSerialNumberColumn<PersonItem>(personCurrentPage, PROJECT_TABLE_PAGE_SIZE),
      ...PERSON_DATA_COLUMNS,
    ],
    [personCurrentPage],
  );

  const businessTripTableColumns = useMemo(
    () => [
      createSerialNumberColumn<BusinessTripItem>(businessTripCurrentPage, PROJECT_TABLE_PAGE_SIZE),
      ...BUSINESS_TRIP_DATA_COLUMNS,
    ],
    [businessTripCurrentPage],
  );

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1200}
      closable={false}
      className={styles.projectDetailModal}
    >
      <Spin spinning={modalLoading}>
        <div className={styles.modalHeaderTop}>
          <div className={styles.modalTitle}>
            <span className={styles.modalTitleText}>{title}</span>
            <span className={styles.modalTitleSub}>
              共 {projectListTotal} 个在谈项目 · {activityListTotal} 场
              {title === overseasTitle ? '因公出访' : '招商活动'}
            </span>
          </div>
          <button type="button" aria-label="关闭" className={styles.modalClose} onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>

        <div className={styles.modalStats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.modalStatItem}>
              <div className={styles.modalStatValue} style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className={styles.modalStatLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className={styles.modalTabs}
          items={[
            { key: 'requirement', label: `招商需求 (${requirementListTotal})` },
            { key: 'project', label: `在谈项目 (${projectListTotal})` },
            {
              key: 'activity',
              label:
                title === overseasTitle
                  ? `因公出访 (${businessTripListTotal})`
                  : `招商活动 (${activityListTotal})`,
            },
            // { key: 'person', label: `招商人员 (${personListTotal})` },
          ]}
        />

        <div className={styles.modalContent}>
          {activeTab === 'requirement' && (
            <>
              <div className={styles.modalSearch}>
                <Input
                  placeholder="搜索招商需求..."
                  value={requirementSearchKeyword}
                  onChange={(e) => {
                    setRequirementSearchKeyword(e.target.value);
                    setRequirementCurrentPage(1);
                  }}
                  className={styles.modalSearchInput}
                  allowClear
                />

                <Button type="primary" onClick={handleRequirementSearch}>
                  确认
                </Button>
                <Select
                  placeholder="市区"
                  allowClear
                  options={requirementDistrictOptions}
                  value={requirementDistrictCode || undefined}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(val: string) => {
                    setRequirementDistrictCode(val);
                    setRequirementCurrentPage(1);
                  }}
                />
                <Select
                  disabled={!requirementDistrictCode}
                  placeholder="园区"
                  allowClear
                  options={requirementZoneOptions}
                  value={requirementZoneCode || undefined}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(val: string) => {
                    setRequirementZoneCode(val);
                    setRequirementCurrentPage(1);
                  }}
                />
                <Select
                  disabled={!requirementZoneCode || requirementTownOptions.length === 0}
                  placeholder="镇街"
                  allowClear
                  options={requirementTownOptions}
                  value={requirementTownCode || undefined}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(val: string) => {
                    setRequirementTownCode(val);
                    setRequirementCurrentPage(1);
                  }}
                />
                <Input
                  placeholder="联系人"
                  value={requirementContact}
                  onChange={(e) => setRequirementContact(e.target.value)}
                  style={{ width: 200 }}
                  allowClear
                />
              </div>
              <Table<RequirementItem>
                columns={REQUIREMENT_DATA_COLUMNS(requirementCurrentPage, REQUIREMENT_TABLE_PAGE_SIZE)}
                dataSource={requirementList}
                rowKey="id"
                pagination={{
                  pageSize: REQUIREMENT_TABLE_PAGE_SIZE,
                  total: requirementListTotal,
                  current: requirementCurrentPage,
                  showTotal: (total) => `共 ${total} 条记录`,
                  onChange: handleRequirementPageChange,
                  showSizeChanger: false,
                }}
                bordered
                className={styles.modalTable}
              />
            </>
          )}

          {activeTab === 'project' && (
            <>
              <div className={styles.modalSearch}>
                <Input
                  placeholder="按投资方名称查询..."
                  value={projectSearchKeyword}
                  onChange={(e) => {
                    setProjectSearchKeyword(e.target.value);
                    setProjectCurrentPage(1);
                  }}
                  className={styles.modalSearchInput}
                  allowClear
                />

                <Button type="primary" onClick={handleProjectSearch}>
                  确认
                </Button>

                {/* <Select
                  placeholder="洽谈进度"
                  allowClear
                  options={projectStatus}
                  value={filterDataStatus || undefined}
                  onChange={(val: string) => {
                    setFilterDataStatus(val);
                    setProjectCurrentPage(1);
                  }}
                /> */}
                <Select
                  placeholder="市区"
                  allowClear
                  options={districtOptions}
                  value={filterDistrictCode || undefined}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(val: string) => {
                    setFilterDistrictCode(val);
                    setProjectCurrentPage(1);
                  }}
                />
                <Select
                  disabled={!filterDistrictCode}
                  placeholder="园区"
                  allowClear
                  options={zoneOptions}
                  value={filterZoneCode || undefined}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(val: string) => {
                    setFilterZoneCode(val);
                    setProjectCurrentPage(1);
                  }}
                />
                <Select
                  disabled={!filterZoneCode || townOptions.length === 0}
                  placeholder="镇街"
                  allowClear
                  options={townOptions}
                  value={filterTownCode || undefined}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(val: string) => {
                    setFilterTownCode(val);
                    setProjectCurrentPage(1);
                  }}
                />
                <Select
                  placeholder="项目类别"
                  allowClear
                  options={projectType}
                  value={filterProjectCategory || undefined}
                  onChange={(val: string) => {
                    setFilterProjectCategory(val);
                    setProjectCurrentPage(1);
                  }}
                />
              </div>
              <Table<ZoneInvestmentItem>
                columns={projectTableColumns}
                dataSource={projectList}
                rowKey="id"
                pagination={{
                  pageSize: PROJECT_TABLE_PAGE_SIZE,
                  total: projectListTotal,
                  current: projectCurrentPage,
                  showTotal: (total) => `共 ${total} 条记录`,
                  onChange: handleProjectPageChange,
                  showSizeChanger: false,
                }}
                bordered
                className={styles.modalTable}
              />
            </>
          )}

          {activeTab === 'activity' &&
            (title === overseasTitle ? (
              <>
                <div className={styles.modalSearch}>
                  <Input
                    placeholder="搜索因公出访地名称..."
                    value={businessTripSearchKeyword}
                    onChange={(e) => {
                      setBusinessTripSearchKeyword(e.target.value);
                      setBusinessTripCurrentPage(1);
                    }}
                    className={styles.modalSearchInput}
                    allowClear
                  />
                  <Button type="primary" onClick={handleBusinessTripSearch}>
                    确认
                  </Button>
                  <Input
                    placeholder="团组名称"
                    allowClear
                    value={filterBusinessTripGroupName || undefined}
                    onChange={(e) => {
                      setFilterBusinessTripGroupName(e.target.value);
                      setBusinessTripCurrentPage(1);
                    }}
                    className={styles.modalSearchInput}
                  />
                  <Input
                    placeholder="主要成员"
                    allowClear
                    value={filterBusinessTripMainMembers || undefined}
                    onChange={(e) => {
                      setFilterBusinessTripMainMembers(e.target.value);
                      setBusinessTripCurrentPage(1);
                    }}
                    className={styles.modalSearchInput}
                  />
                  <Select
                    placeholder="市区"
                    allowClear
                    options={businessTripDistrictOptions}
                    value={filterBusinessTripDistrictCode || undefined}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(val: string) => {
                      setFilterBusinessTripDistrictCode(val);
                      setBusinessTripCurrentPage(1);
                      loadBusinessTripList();
                    }}
                  />
                  <Select
                    placeholder="园区"
                    allowClear
                    options={businessTripZoneOptions}
                    value={filterBusinessTripZoneCode || undefined}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(val: string) => {
                      setFilterBusinessTripZoneCode(val);
                      setBusinessTripCurrentPage(1);
                      loadBusinessTripList();
                    }}
                  />
                </div>
                <Table<BusinessTripItem>
                  columns={businessTripTableColumns}
                  dataSource={businessTripList}
                  rowKey="id"
                  pagination={{
                    pageSize: PROJECT_TABLE_PAGE_SIZE,
                    total: businessTripListTotal,
                    current: businessTripCurrentPage,
                    showTotal: (total) => `共 ${total} 条记录`,
                    onChange: handleBusinessTripPageChange,
                  }}
                  bordered
                  className={styles.modalTable}
                />
              </>
            ) : (
              <>
                <div className={styles.modalSearch}>
                  <Input
                    placeholder="搜索招商活动..."
                    value={activitySearchKeyword}
                    onChange={(e) => {
                      setActivitySearchKeyword(e.target.value);
                      setActivityCurrentPage(1);
                    }}
                    className={styles.modalSearchInput}
                  />
                  <Button type="primary" onClick={handleActivitySearch}>
                    确认
                  </Button>
                  <Select
                    placeholder="市区"
                    allowClear
                    options={activityDistrictOptions}
                    value={filterActivityDistrictCode || undefined}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={handleActivityDistrictChange}
                  />
                  <Select
                    disabled={!filterActivityDistrictCode}
                    placeholder="园区"
                    allowClear
                    options={activityZoneOptions}
                    value={filterActivityZoneCode || undefined}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={handleActivityZoneChange}
                  />
                  <Select
                    disabled={!filterActivityZoneCode || activityTownOptions.length === 0}
                    placeholder="镇街"
                    allowClear
                    options={activityTownOptions}
                    value={filterActivityTownCode || undefined}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={handleActivityTownChange}
                  />
                  {/* <Select
                    placeholder="审核状态"
                    allowClear
                    options={[
                      { label: '待审核', value: '0' },
                      { label: '审核通过', value: '1' },
                      { label: '审核不通过', value: '2' },
                    ]}
                    value={filterActivityAuditStatus || undefined}
                    onChange={(val: string) => {
                      setFilterActivityAuditStatus(val);
                      setActivityCurrentPage(1);
                      loadActivityList();
                    }}
                  /> */}
                </div>
                <div className={styles.activityGrid}>
                  {activityList.map((item) => (
                    <div
                      key={item.id}
                      className={`${styles.activityCard} ${
                        styles[`activityCard_${item.auditStatus}`]
                      }`}
                    >
                      <div className={styles.activityCardHeader}>
                        <span className={styles.activityTime}>
                          {item.startTime} ~ {item.endTime}
                        </span>
                        <div className={styles.activityTags}>
                          <span className={styles.activityIndustryTag}>{item.industryName}</span>
                          {/* <span
                            className={`${styles.activityAuditTag} ${
                              styles[`audit_${item.auditStatus}`]
                            }`}
                          >
                            {item.auditStatus === 0
                              ? '待审核'
                              : item.auditStatus === 1
                              ? '审核通过'
                              : '审核不通过'}
                          </span> */}
                        </div>
                      </div>
                      <div className={styles.activityCardBody}>
                        <p className={styles.activityContent}>{item.activityContent}</p>
                      </div>
                      <div className={styles.activityCardFooter}>
                        <span className={styles.activityLeader}>参加人员：{item.leaders}</span>
                        <span className={styles.activityLocationText}>
                          {item.zoneName}·{item.townName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.activityPagination}>
                  <Pagination
                    current={activityCurrentPage}
                    pageSize={activityPageSize}
                    total={activityListTotal}
                    onChange={handleActivityPageChange}
                    className={styles.activityPaginationRight}
                    showTotal={(total) => `共 ${total} 条记录`}
                    showSizeChanger={false}
                    showQuickJumper={false}
                  />
                </div>
              </>
            ))}

          {activeTab === 'person' && (
            <>
              <div className={styles.modalSearch}>
                <Input
                  placeholder="搜索招商人员..."
                  value={filterPersonName || undefined}
                  onChange={(e) => {
                    setFilterPersonName(e.target.value);
                    setPersonCurrentPage(1);
                  }}
                  onPressEnter={handlePersonSearch}
                  className={styles.modalSearchInput}
                />
                <Button type="primary" onClick={handlePersonSearch}>
                  确认
                </Button>
                <Select
                  placeholder="市区"
                  allowClear
                  options={personDistrictOptions}
                  value={filterPersonDistrictCode || undefined}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={handlePersonDistrictChange}
                />
                <Select
                  disabled={!filterPersonDistrictCode}
                  placeholder="园区"
                  allowClear
                  options={personZoneOptions}
                  value={filterPersonZoneCode || undefined}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={handlePersonZoneChange}
                />
                <Select
                  disabled={!filterPersonZoneCode || personTownOptions.length === 0}
                  placeholder="镇街"
                  allowClear
                  options={personTownOptions}
                  value={filterPersonTownCode || undefined}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={handlePersonTownChange}
                />
                <Select
                  style={{ width: 200 }}
                  placeholder="学历"
                  allowClear
                  value={filterPersonEducation || undefined}
                  options={personEducationOptions}
                  onChange={(val) => {
                    setFilterPersonEducation(val);
                    setPersonCurrentPage(1);
                  }}
                />
                <div className={styles.personViewToggle}>
                  <span className={styles.personTotal}>共 {personListTotal} 人</span>
                  {/* <button
                    className={`${styles.viewBtn} ${!personCardView ? styles.viewActive : ''}`}
                    onClick={() => setPersonCardView(false)}
                  >
                    <UnorderedListOutlined style={{ fontSize: 16 }} />
                  </button>
                  <button
                    className={`${styles.viewBtn} ${personCardView ? styles.viewActive : ''}`}
                    onClick={() => setPersonCardView(true)}
                  >
                    <AppstoreOutlined style={{ fontSize: 16 }} />
                  </button> */}
                </div>
              </div>

              {personCardView ? (
                <>
                  {/* <div className={styles.personCardGrid}>
                    {personList.map((item) => (
                      <div key={item.id} className={styles.personCard}>
                        <div className={styles.personCardHeader}>
                          <span className={styles.personName}>{item.name}</span>
                          <span className={styles.personRegion}>
                            {item.region}/{item.district}
                          </span>
                        </div>
                        <div className={styles.personCardBody}>
                          <div className={styles.personInfoRow}>
                            <BuildOutlined className={styles.personIcon} />
                            <span className={styles.personLabel}>职务</span>
                            <span className={styles.personValue}>{item.position}</span>
                          </div>
                          <div className={styles.personInfoFlex}>
                            <div className={styles.personInfoRow}>
                              <FileTextOutlined className={styles.personIcon} />
                              <span className={styles.personLabel}>学历</span>
                              <span className={styles.personValue}>{item.education}</span>
                            </div>
                            <div className={styles.personInfoRow}>
                              <FileTextOutlined className={styles.personIcon} />
                              <span className={styles.personLabel}>专业</span>
                              <span className={styles.personValue}>{item.major}</span>
                            </div>
                          </div>
                          <div className={styles.personInfoFlex}>
                            <div className={styles.personInfoRow}>
                              <ClockCircleOutlined className={styles.personIcon} />
                              <span className={styles.personLabel}>出生</span>
                              <span className={styles.personValue}>1966.04</span>
                            </div>
                            <div className={styles.personInfoRow}>
                              <PhoneOutlined className={styles.personIcon} />
                              <span className={styles.personLabel}>电话</span>
                              <span className={styles.personValue}>{item.phone}</span>
                            </div>
                          </div>

                          <div className={styles.personInfoRow}>
                            <TeamOutlined className={styles.personIcon} />
                            <span className={styles.personLabel}>招商方向</span>
                            <span className={styles.personValue}>{item.company}</span>
                          </div>
                        </div>
                        <div className={styles.personCardFooter}>
                          <div className={styles.personDivider}></div>
                          <span className={styles.personRemark}>备注</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.personCardPagination}>
                    <Pagination
                      current={personCurrentPage}
                      pageSize={personCardPageSize}
                      total={personListTotal}
                      onChange={(page) => setPersonCurrentPage(page)}
                      className={styles.personCardPaginationRight}
                      showTotal={(total) => `共 ${total} 条记录`}
                      showSizeChanger={false}
                      showQuickJumper={false}
                    />
                  </div> */}
                </>
              ) : (
                <Table<PersonItem>
                  columns={personTableColumns}
                  dataSource={personList}
                  rowKey="id"
                  pagination={{
                    pageSize: PROJECT_TABLE_PAGE_SIZE,
                    total: personListTotal,
                    current: personCurrentPage,
                    showTotal: (total) => `共 ${total} 条记录`,
                    onChange: handlePersonPageChange,
                  }}
                  bordered
                  className={styles.modalTable}
                />
              )}
            </>
          )}
        </div>
      </Spin>
    </Modal>
  );
};

export default ProjectDetailModal;
