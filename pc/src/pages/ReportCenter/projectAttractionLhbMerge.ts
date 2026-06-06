import type { StatisticLhbvo } from '@/services/apis/models/StatisticLhbvo';
import type { ProjectCountInfo } from '@/services/apis/models/ProjectCountInfo';
import { normalizeRegionName } from './longHuBangFill';

/** 与 ProjectAttraction.tsx 中 makePathKey 一致 */
const PATH_SEP = '::';

const pk = (...parts: string[]) => parts.join(PATH_SEP);

/** 龙虎榜 mergeLongHuBangFlatDataSource 写入的叶子列 dataIndex（与 title.json 路径一致） */
export const LONGHU_BANG_MERGE_DATA_INDEX_SET = new Set<string>([
  pk('签约项目情况', '500万元-1亿元项目', '总数'),
  pk('签约项目情况', '500万元-1亿元项目', '当月新增'),
  pk('签约项目情况', '1亿元以上项目', '总数'),
  pk('签约项目情况', '1亿元以上项目', '当月新增'),
  pk('签约项目情况', '1亿元以上项目', '协议投资5亿元以上项目', '总数'),
  pk('签约项目情况', '1亿元以上项目', '协议投资5亿元以上项目', '当月新增'),
  pk('签约项目情况', '1亿元以上项目', '年度投资1亿元以上项目', '总数'),
  pk('签约项目情况', '1亿元以上项目', '年度投资1亿元以上项目', '当月新增'),
  pk('备案项目情况', '500万元-1亿元项目', '总数'),
  pk('备案项目情况', '500万元-1亿元项目', '当月新增'),
  pk('备案项目情况', '1亿元以上项目', '总数'),
  pk('备案项目情况', '1亿元以上项目', '当月新增'),
  pk('备案项目情况', '1亿元以上项目', '协议投资5亿元以上项目', '总数'),
  pk('备案项目情况', '1亿元以上项目', '协议投资5亿元以上项目', '当月新增'),
  pk('开工项目情况', '500万元-1亿元项目', '总数'),
  pk('开工项目情况', '500万元-1亿元项目', '当月新增'),
  pk('开工项目情况', '1亿元以上项目', '总数'),
  pk('开工项目情况', '1亿元以上项目', '当月新增'),
  pk('开工项目情况', '1亿元以上项目', '协议投资5亿元以上项目', '总数'),
  pk('开工项目情况', '1亿元以上项目', '协议投资5亿元以上项目', '当月新增'),
  pk('竣工项目情况', '500万元-1亿元项目', '总数'),
  pk('竣工项目情况', '500万元-1亿元项目', '当月新增'),
  pk('竣工项目情况', '1亿元以上项目', '总数'),
  pk('竣工项目情况', '1亿元以上项目', '当月新增'),
]);

/** 非龙虎榜覆盖列，但与报表列序一致，需打开项目明细穿透页（与 attachLongHuBangCellNavigate 一致） */
const LONGHU_BANG_NAV_DATA_INDEX_SET = new Set<string>([
  pk('市重点项目情况', '项目数量'),
  pk('市重点项目情况', '项目开工情况', '新开工项目数'),
]);

export function isLongHuBangMergeCell(dataIndex: unknown): boolean {
  if (typeof dataIndex !== 'string') return false;
  return LONGHU_BANG_MERGE_DATA_INDEX_SET.has(dataIndex) || LONGHU_BANG_NAV_DATA_INDEX_SET.has(dataIndex);
}

/** 市重点穿透：走 `/project-info-fg` 列表（query: city；「新开工项目数」另传 isNewStart=是），与 `listMode=project-info-fg` 落地页一致 */
export type MunicipalKeyProjectFgNavMode = 'projectCount' | 'newStartCount';

export function getMunicipalKeyProjectFgNavMode(dataIndex: string): MunicipalKeyProjectFgNavMode | null {
  if (dataIndex === pk('市重点项目情况', '项目数量')) return 'projectCount';
  if (dataIndex === pk('市重点项目情况', '项目开工情况', '新开工项目数')) return 'newStartCount';
  return null;
}

function setPair(row: Record<string, unknown>, base: string[], p: ProjectCountInfo | undefined) {
  row[pk(...base, '总数')] = p?.total ?? null;
  row[pk(...base, '当月新增')] = p?.monthNew ?? null;
}

/**
 * 将 `/statistic/long-hu-bang` 返回的数据写入 ProjectAttraction 扁平行（列 key 与 title.json 路径一致）。
 */
export function mergeLongHuBangFlatDataSource(
  rows: Array<Record<string, any> & { key: string }>,
  list: StatisticLhbvo[],
  regionField: '市（区）' | '区域',
  remarkRowKey: string,
): Array<Record<string, any> & { key: string }> {
  const byRegion = new Map<string, StatisticLhbvo>();
  for (const item of list) {
    const k = normalizeRegionName(item.regionName ?? '');
    if (k) byRegion.set(k, item);
  }

  return rows.map((row) => {
    if (row.key === remarkRowKey) return row;
    const rawName = String(row[regionField] ?? '');
    const name = normalizeRegionName(rawName);
    if (!name) return row;
    const vo = byRegion.get(name);
    if (!vo) return row;

    const next: Record<string, unknown> = { ...row };
    const sp = vo.signedProjects;
    const fp = vo.filedProjects;
    const csp = vo.constructionStartProjects;
    const cp = vo.completedProjects;

    if (sp) {
      setPair(next, ['签约项目情况', '500万元-1亿元项目'], sp.range50mTo100m);
      setPair(next, ['签约项目情况', '1亿元以上项目'], sp.range100mPlus);
      setPair(next, ['签约项目情况', '1亿元以上项目', '协议投资5亿元以上项目'], sp.range30mUsdPlus);
      setPair(next, ['签约项目情况', '1亿元以上项目', '年度投资1亿元以上项目'], sp.annualInv100mPlus);
    }

    if (fp) {
      setPair(next, ['备案项目情况', '500万元-1亿元项目'], fp.range50mTo100m);
      setPair(next, ['备案项目情况', '1亿元以上项目'], fp.range100mPlus);
      setPair(next, ['备案项目情况', '1亿元以上项目', '协议投资5亿元以上项目'], fp.range30mUsdPlus);
      // 「其中：增资扩产项目」两列：使用龙虎榜 filedProjects.expansionProjects，但不加入 LONGHU_BANG_MERGE_DATA_INDEX_SET（不可穿透跳转）
      setPair(next, ['备案项目情况', '其中：增资扩产项目'], fp.expansionProjects);
      // 「其中：外资利润再投资项目」三列（总数、投资额(万美元)、当月新增）统一使用本地静态 JSON，不用龙虎榜接口覆盖
    }

    if (csp) {
      setPair(next, ['开工项目情况', '500万元-1亿元项目'], csp.range50mTo100m);
      setPair(next, ['开工项目情况', '1亿元以上项目'], csp.range100mPlus);
      setPair(next, ['开工项目情况', '1亿元以上项目', '协议投资5亿元以上项目'], csp.range30mUsdPlus);
    }

    // 「开工项目投资情况」统一使用本地静态 JSON（data1–data7），不再用龙虎榜 constructionStartInvestment 覆盖

    if (cp) {
      setPair(next, ['竣工项目情况', '500万元-1亿元项目'], cp.range50mTo100m);
      setPair(next, ['竣工项目情况', '1亿元以上项目'], cp.range100mPlus);
    }

    return next as Record<string, any> & { key: string };
  });
}
