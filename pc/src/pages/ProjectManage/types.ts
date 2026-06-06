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
  investmentAmount?: string;
  recordName?: string;
  recordNumber?: string;
  isListedProject?: boolean;
  park?: string;
  year?: string | number;
  investor?: string;
  attractorUnit?: string;
  investmentFlag?: string;
  industryOrService?: string;
  district?: string;
  projectSource?: string;
  investmentAmountRange?: InvestmentAmountRange;
  signingDateRange?: [dayjs.Dayjs, dayjs.Dayjs];
  signingStatRange?: [dayjs.Dayjs, dayjs.Dayjs];
  recordTimeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  startTimeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  endTimeRange?: [dayjs.Dayjs, dayjs.Dayjs];
};
