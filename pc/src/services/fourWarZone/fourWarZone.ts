import { request } from '@umijs/max';

export interface DashboardStatsResponse {
  success: boolean;
  data: {
    regionCards: Array<{
      regionName: string;
      projectCount: number;
      projectAmount: number;
    }>;
    regionDetails?: Array<{
      investmentActivityCount: number;
      talkingCount: number;
      regionName: string;
      signedCount: number;
      signedInvestmentAmount: number;
      monthNewCount: number;
      monthInvestmentAmount: number;
      startProjectCount: number;
      startMonthNewCount: number;
      startRate: number;
      cityKeyCount: number;
      provinceKeyCount: number;
    }>;
  };
  errorCode: string | null;
  errorMessage: string | null;
}

export interface DashboardStatsParams {
  year?: number;
  amountRange?: 'all' | 'above' | 'below';
}

export interface ZoneInvestmentListParams {
  projectName?: string;
  investorName?: string;
  projectCategory?: string;
  dataStatus?: string;
  districtCode?: string;
  district?: string;
  zoneCode?: string;
  zoneName?: string;
  townCode?: string;
  townName?: string;
  countryRegionStandard?: string;
  countryRegionOriginal?: string;
  page?: number;
  size?: number;
}

export interface ZoneInvestmentItem {
  id: string;
  investor: string;
  projectName: string;
  projectCategory: string;
  investmentAmount: number;
  projectContent: string;
  districtCode: string;
  district: string;
  zoneCode: string;
  zoneName: string;
  townCode: string | null;
  townName: string | null;
  entryTime: string;
  finishCheckDate: string | null;
  dataStatus: string;
  dataStatusName: string;
  countryRegionOriginal: string;
  countryRegionStandard: string;
}

export interface ZoneInvestmentListResponse {
  success: boolean;
  data: {
    page: number;
    size: number;
    totalPage: number;
    total: number;
    records: ZoneInvestmentItem[];
  };
  errorCode: string | null;
  errorMessage: string | null;
}

export const fourWarZoneApi = {
  getStats: (params: { countryRegionStandard?: string; dataStatus?: string }) => {
    return request('/prime-api/public/zone-investment/statistics', {
      method: 'GET',
      params,
      timeout: 30000,
    });
  },

  getDashboardStats: (params?: DashboardStatsParams): Promise<DashboardStatsResponse> => {
    return request('/prime-api/public/zone-investment/home-statistics', {
      method: 'GET',
      params,
      timeout: 30000,
    });
  },

  getZoneInvestmentList: (params: ZoneInvestmentListParams): Promise<ZoneInvestmentListResponse> => {
    return request('/prime-api/public/zone-investment/list', {
      method: 'GET',
      params,
      timeout: 30000,
    });
  },

  getActivityList: (params?: {
    page?: number;
    size?: number;
    countryRegionStandard?: string;
    districtCode?: string;
    zoneCode?: string;
    townCode?: string;
    industryName?: string;
    auditStatus?: string;
  }) => {
    return request('/prime-api/public/investment-activities/activities/list', {
      method: 'GET',
      params,
      timeout: 30000,
    });
  },

  getPersonList: (params?: {
    page?: number;
    size?: number;
    countryRegionStandard?: string;
    name?: string;
    districtCode?: string;
    zoneCode?: string;
    townCode?: string;
    investPlace?: string;
    xl?: string;
  }) => {
    return request('/prime-api/public/investment-activities/team/list', {
      method: 'GET',
      params,
      timeout: 30000,
    });
  },


  getBusinessTripList: (params?: {
    page?: number;
    size?: number;
    visitDestination?: string;
    groupName?: string;
    mainMembers?: string;
    districtCode?: string;
    zoneCode?: string;
  }) => {
    return request('/prime-api/public/overseas-business-trip/list', {
      method: 'GET',
      params,
      timeout: 30000,
    });
  },

  getRequirementList: (params?: {
    page?: number;
    size?: number;
    countryRegionStandard?: string;
    demandTitle?: string;
    districtCode?: string;
    zoneCode?: string;
    townCode?: string;
  }) => {
    return request('/prime-api/public/investment-activities/demand/list', {
      method: 'GET',
      params,
      timeout: 30000,
    });
  },
};

export interface RequirementItem {
  id: string;
  createTime: string;
  updateTime: string;
  districtCode: string;
  districtName: string | null;
  zoneCode: string;
  zoneName: string;
  townCode: string | null;
  townName: string | null;
  place: string;
  title: string;
  content: string;
  expectTime: string;
  linkerName: string;
  linkerTel: string;
  filePath: string;
  status: number;
  auditId: string | null;
  auditName: string | null;
  auditTime: string | null;
  auditRemark: string;
  replyId: string | null;
  replyName: string | null;
  replyTime: string | null;
  replyContent: string;
  creatorId: string;
  creatorName: string | null;
}

export default fourWarZoneApi;