import type { ProjectCountInfo } from '@/services/apis/models/ProjectCountInfo';
import type { StatisticLhbvo } from '@/services/apis/models/StatisticLhbvo';

export type LhbLeafCol = {
  c: number;
  dataIndex: string;
  title: string;
  isPercentCol?: boolean;
  /** Excel 第 4 行一级分组原始标题（合并格左上角） */
  topGroupTitle?: string;
};

type ApiSlot = { kind: 'signed' | 'filed' | 'csp' | 'completed'; index: number };

function pushPair(out: unknown[], p?: ProjectCountInfo) {
  out.push(p?.total ?? null, p?.monthNew ?? null);
}

/** 与 loadExcelTableFromXlsx 中 stripLeadingIndex 一致，再压成单行用于匹配 */
function normalizeTopGroup(raw: string): string {
  const s = String(raw ?? '')
    .replace(/^\s*[\u24EA\u2460-\u2473]+(?:[.、)）]?\s*)?/, '')
    .replace(/^\s*\(?\s*\d+\s*\)?\s*[.、)-]\s*/, '')
    .replace(/^\s*（\s*\d+\s*）\s*/, '')
    .trim();
  return s.replace(/\s+/g, '').replace(/\r?\n/g, '');
}

function normalizeLeafTitle(raw: string): string {
  return String(raw ?? '')
    .replace(/\r?\n/g, '')
    .replace(/\s+/g, '')
    .trim();
}

/** 签约 / 备案 / 开工项目（不含开工项目投资）/ 竣工 四类用接口；其余列保持 Excel 静态 */
function apiGroupKind(topGroupTitle: string): 'signed' | 'filed' | 'csp' | 'completed' | null {
  const n = normalizeTopGroup(topGroupTitle);
  if (n.includes('签约项目情况')) return 'signed';
  if (n.includes('备案项目情况')) return 'filed';
  if (n.includes('开工项目投资')) return null;
  if (n.includes('开工项目情况')) return 'csp';
  if (n.includes('竣工项目情况')) return 'completed';
  return null;
}

function signedValues(vo: StatisticLhbvo): unknown[] {
  const out: unknown[] = [];
  const sp = vo.signedProjects;
  pushPair(out, sp?.range50mTo100m);
  pushPair(out, sp?.range100mPlus);
  pushPair(out, sp?.range30mUsdPlus);
  pushPair(out, sp?.annualInv100mPlus);
  return out;
}

function filedValues(vo: StatisticLhbvo): unknown[] {
  const out: unknown[] = [];
  const fp = vo.filedProjects;
  pushPair(out, fp?.range50mTo100m);
  pushPair(out, fp?.range100mPlus);
  pushPair(out, fp?.range30mUsdPlus);
  pushPair(out, fp?.expansionProjects);
  pushPair(out, fp?.reinvestmentProjects);
  return out;
}

/** 仅「开工项目情况」项目数区块，不含开工项目投资 */
function constructionStartProjectValues(vo: StatisticLhbvo): unknown[] {
  const out: unknown[] = [];
  const csp = vo.constructionStartProjects;
  pushPair(out, csp?.range50mTo100m);
  pushPair(out, csp?.range100mPlus);
  pushPair(out, csp?.range30mUsdPlus);
  return out;
}

function completedValues(vo: StatisticLhbvo): unknown[] {
  const out: unknown[] = [];
  const cp = vo.completedProjects;
  pushPair(out, cp?.range50mTo100m);
  pushPair(out, cp?.range100mPlus);
  return out;
}

function attachApiSlots(leafCols: LhbLeafCol[]): Array<LhbLeafCol & { apiSlot?: ApiSlot }> {
  let signedI = 0;
  let filedI = 0;
  let cspI = 0;
  let completedI = 0;
  return leafCols.map((lc) => {
    if (lc.c <= 1) return { ...lc };
    const kind = apiGroupKind(lc.topGroupTitle ?? '');
    if (!kind) return { ...lc };
    if (kind === 'signed') return { ...lc, apiSlot: { kind, index: signedI++ } };
    if (kind === 'filed') return { ...lc, apiSlot: { kind, index: filedI++ } };
    if (kind === 'csp') return { ...lc, apiSlot: { kind, index: cspI++ } };
    return { ...lc, apiSlot: { kind: 'completed', index: completedI++ } };
  });
}

function valuesForSlotKind(
  kind: ApiSlot['kind'],
  vo: StatisticLhbvo,
): unknown[] {
  if (kind === 'signed') return signedValues(vo);
  if (kind === 'filed') return filedValues(vo);
  if (kind === 'csp') return constructionStartProjectValues(vo);
  return completedValues(vo);
}

export function normalizeRegionName(raw: string): string {
  const s = String(raw ?? '')
    .replace(/\r?\n/g, '')
    .replace(/\s+/g, '')
    .trim();
  // 模板行名为「全市合计」，接口可能返回「全市」
  if (s === '全市') return '全市合计';
  return s;
}

/** 「四上」企业新增数情况：不使用接口，固定静态表（全市合计行对应泰州市汇总） */
type FourAboveStaticRow = {
  total: number;
  industry: number;
  construction: number;
  wholesaleRetail: number;
  hospitality: number;
  realEstate: number;
  service: number;
};

const FOUR_ABOVE_STATIC: Record<string, FourAboveStaticRow> = {
  /** 与报表截图静态表一致（不走接口） */
  全市合计: { total: 247, industry: 92, construction: 5, wholesaleRetail: 99, hospitality: 18, realEstate: 1, service: 32 },
  靖江市: { total: 32, industry: 16, construction: 3, wholesaleRetail: 12, hospitality: 0, realEstate: 0, service: 1 },
  泰兴市: { total: 30, industry: 15, construction: 2, wholesaleRetail: 5, hospitality: 3, realEstate: 0, service: 5 },
  兴化市: { total: 30, industry: 14, construction: 0, wholesaleRetail: 13, hospitality: 0, realEstate: 0, service: 3 },
  海陵区: { total: 42, industry: 11, construction: 0, wholesaleRetail: 21, hospitality: 5, realEstate: 0, service: 5 },
  姜堰区: { total: 56, industry: 23, construction: 0, wholesaleRetail: 17, hospitality: 7, realEstate: 0, service: 9 },
  医药高新区: { total: 57, industry: 13, construction: 0, wholesaleRetail: 31, hospitality: 3, realEstate: 1, service: 9 },
};

function fourAboveStaticKey(regionName: string): string | null {
  const n = regionName;
  if (n === '全市合计') return '全市合计';
  if (n.includes('海陵')) return '海陵区';
  if (n.includes('姜堰')) return '姜堰区';
  if (n.includes('兴化')) return '兴化市';
  if (n.includes('靖江')) return '靖江市';
  if (n.includes('泰兴')) return '泰兴市';
  if (n.includes('医药') || n.includes('高港')) return '医药高新区';
  return null;
}

/** 「① 开工项目投资情况」：不走接口，按截图固定静态表（列 BE–BN，对应 Excel 第 8–14 行） */
const KAI_GONG_TOU_ZI_DATA_INDEXES = [
  'c_BE',
  'c_BF',
  'c_BG',
  'c_BH',
  'c_BI',
  'c_BJ',
  'c_BK',
  'c_BL',
  'c_BM',
  'c_BN',
] as const;

/** 百分比列存小数（展示时 ×100）；与 formatPercentTwoDecimals 一致 */
const KAI_GONG_TOU_ZI_ROWS: Array<
  readonly [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ]
> = [
  [55.75, 38.48, 5.74, 3.34, 0.1491, 655.77, 208.75, 20.5, 14.59, 0.0982],
  [10.19, 9.31, 0.3, 0.18, 0.0326, 88.85, 34.43, 0.67, 0.38, 0.0194],
  [17.3, 7.0, 0.78, 0.39, 0.112, 140.1, 18.75, 0.75, 0.45, 0.0397],
  [3.78, 3.18, 1.9, 1.0, 0.5966, 83.13, 36.78, 2.24, 1.67, 0.0608],
  [9.66, 5.98, 0.43, 0.3, 0.0726, 121.8, 31.5, 3.61, 3.61, 0.1147],
  [6.55, 5.35, 0.75, 0.42, 0.1406, 154.4, 54.5, 5.19, 4.23, 0.0953],
  [8.28, 7.66, 1.57, 1.04, 0.2044, 67.49, 32.79, 8.05, 4.25, 0.2456],
];

const KAI_GONG_TOU_ZI_EXCEL_ROWS = [8, 9, 10, 11, 12, 13, 14] as const;

function applyKaiGongTouZiInvestmentStatics(next: Record<string, any>, excelRow: number | undefined) {
  if (excelRow === undefined) return;
  const idx = KAI_GONG_TOU_ZI_EXCEL_ROWS.indexOf(excelRow as (typeof KAI_GONG_TOU_ZI_EXCEL_ROWS)[number]);
  if (idx < 0) return;
  const vals = KAI_GONG_TOU_ZI_ROWS[idx];
  if (!vals) return;
  KAI_GONG_TOU_ZI_DATA_INDEXES.forEach((key, i) => {
    next[key] = vals[i];
  });
}

/** 「开工项目情况」：不使用接口，按截图固定静态值（对应 Excel 第 8–14 行） */
const CONSTRUCTION_START_DATA_INDEXES = ['c_AY', 'c_AZ', 'c_BA', 'c_BB', 'c_BC', 'c_BD'] as const;
const CONSTRUCTION_START_ROWS: Array<readonly [number, number, number, number, number, number]> = [
  [113, 19, 54, 6, 4, 0],
  [43, 9, 26, 3, 2, 0],
  [4, 1, 2, 0, 0, 0],
  [3, 1, 0, 0, 0, 0],
  [16, 4, 10, 3, 1, 0],
  [1, 0, 0, 0, 0, 0],
  [46, 4, 16, 0, 1, 0],
];

function applyConstructionStartStatics(next: Record<string, any>, excelRow: number | undefined) {
  if (excelRow === undefined) return;
  const idx = KAI_GONG_TOU_ZI_EXCEL_ROWS.indexOf(excelRow as (typeof KAI_GONG_TOU_ZI_EXCEL_ROWS)[number]);
  if (idx < 0) return;
  const vals = CONSTRUCTION_START_ROWS[idx];
  if (!vals) return;
  CONSTRUCTION_START_DATA_INDEXES.forEach((key, i) => {
    next[key] = vals[i];
  });
}

function applyFourAboveEnterpriseStatics(
  next: Record<string, any>,
  leafCols: LhbLeafCol[],
  regionName: string,
) {
  const mapKey = fourAboveStaticKey(regionName);
  if (!mapKey) return;
  const row = FOUR_ABOVE_STATIC[mapKey];
  if (!row) return;

  for (const lc of leafCols) {
    const g = normalizeTopGroup(lc.topGroupTitle ?? '');
    if (!g.includes('四上') || !g.includes('企业新增数情况')) continue;
    const t = normalizeLeafTitle(lc.title);
    if (t.includes('总数')) next[lc.dataIndex] = row.total;
    else if (t.includes('建筑业')) next[lc.dataIndex] = row.construction;
    else if (t.includes('批零业')) next[lc.dataIndex] = row.wholesaleRetail;
    else if (t.includes('住餐业')) next[lc.dataIndex] = row.hospitality;
    else if (t.includes('房地产业')) next[lc.dataIndex] = row.realEstate;
    else if (t.includes('服务业')) next[lc.dataIndex] = row.service;
    else if (t.includes('工业')) next[lc.dataIndex] = row.industry;
  }
}

export function mergeLongHuBangIntoDataSource(
  dataSource: Array<Record<string, any> & { key: string; __r?: number }>,
  leafCols: LhbLeafCol[],
  list: StatisticLhbvo[],
): Array<Record<string, any> & { key: string; __r?: number }> {
  if (!leafCols.length) return dataSource;
  const regionKey = leafCols[0].dataIndex;
  const colsWithSlots = attachApiSlots(leafCols);
  const byRegion = new Map<string, StatisticLhbvo>();
  for (const item of list) {
    const k = normalizeRegionName(item.regionName ?? '');
    if (k) byRegion.set(k, item);
  }
  return dataSource.map((row) => {
    if (row.__r === 16) return { ...row };
    const name = normalizeRegionName(String(row[regionKey] ?? ''));
    if (!name) return { ...row };
    const vo = byRegion.get(name);
    const next = { ...row };

    if (vo) {
      for (const lc of colsWithSlots) {
        if (!lc.apiSlot) continue;
        // 开工项目情况：使用截图静态数据，不用接口覆盖
        if (lc.apiSlot.kind === 'csp' && (lc.dataIndex === 'c_AY' || lc.dataIndex === 'c_AZ' || lc.dataIndex === 'c_BA' || lc.dataIndex === 'c_BB' || lc.dataIndex === 'c_BC' || lc.dataIndex === 'c_BD')) continue;
        // 备案项目情况 - 「其中：外资利润再投资项目」两列（AW/AX）暂时使用模板静态数据，不用接口覆盖
        // 注意：该模块叶子列标题通常为「总数/当月新增」，无法用标题关键字稳定命中，故按列字母固定。
        if (lc.apiSlot.kind === 'filed' && (lc.dataIndex === 'c_AW' || lc.dataIndex === 'c_AX')) continue;
        const arr = valuesForSlotKind(lc.apiSlot.kind, vo);
        next[lc.dataIndex] = arr[lc.apiSlot.index] ?? null;
      }
    }

    // 「四上」企业新增数情况：固定静态表，不依赖接口返回行
    applyFourAboveEnterpriseStatics(next, leafCols, name);

    // 「① 开工项目投资情况」：固定静态表（与截图一致）
    applyKaiGongTouZiInvestmentStatics(next, row.__r);

    // 「开工项目情况」：固定静态表（与截图一致）
    applyConstructionStartStatics(next, row.__r);

    return next;
  });
}
