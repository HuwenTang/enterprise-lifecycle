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
  attractorUnit?: string;
  investmentFlag?: string;
  industryOrService?: string;
  startApprovalstatus?: string;
  applyTimeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  park?: string;
  district?: string;
  projectSource?: string;
  investor?: string;
  startTimeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  startApprovalTimeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  investmentAmountRange?: InvestmentAmountRange;
  isKc?: boolean;
  isQflp?: boolean;
};
