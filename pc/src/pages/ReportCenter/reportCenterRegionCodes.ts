import { normalizeRegionName } from './longHuBangFill';

/**
 * 泰州市及下辖区县行政区划代码（与报表「市（区）」行穿透查询一致）
 */
const AD_CODE_BY_NORMALIZED_LABEL: Record<string, string> = {
  泰州市: '321200000000',
  全市合计: '321200000000',
  全市: '321200000000',
  海陵区: '321202000000',
  /** 与表格展示「医药高新区（高港区）」一致，normalize 后可能仍带括号 */
  '医药高新区（高港区）': '321203000000',
  医药高新区高港区: '321203000000',
  医药高新区: '321203000000',
  高港区: '321203000000',
  姜堰区: '321204000000',
  兴化市: '321281000000',
  靖江市: '321282000000',
  泰兴市: '321283000000',
};

/** 将「市（区）」展示名规范成与 normalizeRegionName 一致的无空白键 */
function compactRegionKey(raw: string): string {
  return String(raw ?? '')
    .replace(/\r?\n/g, '')
    .replace(/\s+/g, '')
    .replace(/[（）()]/g, '')
    .trim();
}

/**
 * 根据报表行「市（区）/区域」解析行政区划 code，供数字化招商列表穿透（query: code）
 */
export function resolveAdCodeFromRegionLabel(regionLabel: string): string | undefined {
  const n = normalizeRegionName(regionLabel);
  const direct = AD_CODE_BY_NORMALIZED_LABEL[n];
  if (direct) return direct;
  const compact = compactRegionKey(regionLabel);
  return AD_CODE_BY_NORMALIZED_LABEL[compact];
}
