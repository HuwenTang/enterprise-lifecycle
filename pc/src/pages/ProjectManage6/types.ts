import type dayjs from 'dayjs';

export type InvestmentAmountRange =
  | 'all'
  | 'above100000'
  | 'above50000'
  | 'above10000'
  | 'mid500to10000'
  | 'below500';

export type FieldType = {
  projectName?: string;
  currentProjectProgress?: string[];
  projectContent?: string;
  investmentFlag?: string;
  industryOrService?: string;
  attractorUnit?: string;
  investor?: string;
  endApprovalStatus?: string;
  applyTimeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  endTimeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  endApprovalTimeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  projectSource?: string;
  district?: string;
  park?: string;
  investmentAmountRange?: InvestmentAmountRange;
};
