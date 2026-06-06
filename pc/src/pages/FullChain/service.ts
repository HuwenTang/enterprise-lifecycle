/**
 * 规上工业企业研发平台全链条模块 - 数据接口
 * 接口：GET /enterprise-innovative-clusters 查询企业创新平台统计表列表
 */

import { primeApi, systemApi } from '@/services/api';
import type { StatisticCenterVo, StatisticInnovativeClusterVo } from '@/services/apis';
import { request } from '@umijs/max';
import type { CenterDashboardCenter, ClusterDashboardCard } from './mock';

/** 字典项选项，用于下拉 */
export type DictOption = { label: string; value: string };

/** 全链条页使用的字典 catalog */
export const FULL_CHAIN_DICT_CATALOGS = {
  /** 市(区) */
  cityDistrict: 'full_chain_city_district',
  /** 产业集群 + 产业链 + 未来产业链 共用一个字典（解析 code 做联动） */
  industry8_13_X: '8_13_X',
} as const;

/** 8_13_X 字典项：code 如 1.1.1.0 为大类（产业集群），1.1.1.1 为对应产业链 */
export interface DictItem8_13_X {
  code: string;
  label: string;
  value?: string;
  enabled?: boolean;
}

/** 判断是否为大类（产业集群）：code 末段为 0 如 1.1.1.0 */
function isClusterCode(code: string): boolean {
  const segments = String(code).trim().split('.');
  return segments.length >= 1 && segments[segments.length - 1] === '0';
}

/** 根据子项 code 得到所属大类 code，如 1.1.1.1 -> 1.1.1.0 */
function getParentClusterCode(code: string): string {
  const segments = String(code).trim().split('.');
  if (segments.length <= 1) return code;
  return [...segments.slice(0, -1), '0'].join('.');
}

/** 产业集群 label 为「未来产业」时，第二列展示为「未来产业链」 */
export const FUTURE_INDUSTRY_CLUSTER_LABEL = '未来产业';

/**
 * 拉取 8_13_X 字典并解析为：产业集群列表 + 每个产业集群下的产业链/未来产业链
 * 约定：code 末段为 0（如 1.1.1.0）为大类-产业集群；同前缀末段非 0（如 1.1.1.1）为对应产业链
 */
export async function fetch8_13_XParsed(): Promise<{
  industryClusterOptions: DictOption[];
  clusterLabelToCode: Record<string, string>;
  clusterCodeToChains: Record<string, DictOption[]>;
}> {
  const data = await systemApi.getDictItems({
    catalog: FULL_CHAIN_DICT_CATALOGS.industry8_13_X,
  });
  const list: DictItem8_13_X[] = Array.isArray(data) ? data : [];
  const enabled = list.filter((item) => item.enabled !== false);

  const clusters: DictOption[] = [];
  const clusterLabelToCode: Record<string, string> = {};
  const clusterCodeToChains: Record<string, DictOption[]> = {};

  for (const item of enabled) {
    const code = item.code ?? item.value ?? '';
    const label = item.label ?? code;
    const opt = { label, value: label };

    if (isClusterCode(code)) {
      clusters.push(opt);
      clusterLabelToCode[label] = code;
      if (!clusterCodeToChains[code]) clusterCodeToChains[code] = [];
    } else {
      const parentCode = getParentClusterCode(code);
      if (!clusterCodeToChains[parentCode]) clusterCodeToChains[parentCode] = [];
      clusterCodeToChains[parentCode].push(opt);
    }
  }

  return {
    industryClusterOptions: clusters,
    clusterLabelToCode,
    clusterCodeToChains,
  };
}

/** 与后端 GET /enterprise-innovative-clusters 的 Query 参数一致 */
export interface FullChainQueryParams {
  /** 产业集群 */
  industryChain?: string;
  /** 产业链 */
  chain?: string;
  /** 未来产业链 */
  futureChain?: string;
  /** 企业名称 */
  enterpriseName?: string;
  /** 市(区) */
  cityDistrict?: string;
  /** 分页页号 */
  page?: number;
  /** 分页大小 */
  size?: number;
  /** 资质筛选：勾选时传 true，仅展示具备该资质的企业 */
  fgProvincialLevel?: boolean;
  fgMunicipalLevel?: boolean;
  fgNationalLevel?: boolean;
  gxProvincialLevel?: boolean;
  gxMunicipalLevel?: boolean;
  swProvincialLevel?: boolean;
  swMunicipalLevel?: boolean;
  kjEngProvincialLevel?: boolean;
  kjEngMunicipalLevel?: boolean;
  kjEngNationalLevel?: boolean;
  kjLabNationalLevel?: boolean;
  kjLabProvincialLevel?: boolean;
  kjLabMunicipalLevel?: boolean;
  kjAcademicianProvincialLevel?: boolean;
  kjAcademicianMunicipalLevel?: boolean;
}

/** 列表项与后端返回的 records 元素一致 */
export interface FullChainRecord {
  id: string;
  enterpriseName: string;
  /** 市(区) */
  cityDistrict: string;
  /** 8个创新型集群 */
  innovativeClusters8: string | null;
  /** 13条产业链 */
  industrialChains13: string | null;
  /** 未来产业链 */
  futureChainsX: string | null;
  /** 发改-工程研究中心 省级 */
  fgProvincialLevel?: boolean | null;
  /** 发改-工程研究中心 市级 */
  fgMunicipalLevel?: boolean | null;
  /** 工信-企业技术中心 省级 */
  gxProvincialLevel?: boolean | null;
  /** 工信-企业技术中心 市级 */
  gxMunicipalLevel?: boolean | null;
  /** 商务-外资研发中心 省级 */
  swProvincialLevel?: boolean | null;
  /** 商务-外资研发中心 市级 */
  swMunicipalLevel?: boolean | null;
  /** 科技-工程技术研究中心 省级 */
  kjEngProvincialLevel?: boolean | null;
  /** 科技-工程技术研究中心 市级 */
  kjEngMunicipalLevel?: boolean | null;
  /** 科技-重点实验室 国家级 */
  kjLabNationalLevel?: boolean | null;
  /** 科技-重点实验室 省级 */
  kjLabProvincialLevel?: boolean | null;
  /** 科技-重点实验室 市级 */
  kjLabMunicipalLevel?: boolean | null;
  /** 科技-院士工作站 省级 */
  kjAcademicianProvincialLevel?: boolean | null;
  /** 科技-院士工作站 市级 */
  kjAcademicianMunicipalLevel?: boolean | null;
}

/** 列表接口返回结构 */
export interface FullChainListResult {
  records: FullChainRecord[];
  total: number;
  totalPage?: number;
  page: number;
  size: number;
}

/**
 * 查询企业创新平台统计表列表
 * GET /enterprise-innovative-clusters
 */
export async function fetchFullChainList(
  params: FullChainQueryParams
): Promise<FullChainListResult> {
  const {
    page = 1,
    size = 10,
    enterpriseName,
    cityDistrict,
    industryChain,
    chain,
    futureChain,
    fgProvincialLevel,
    fgMunicipalLevel,
    fgNationalLevel,
    gxProvincialLevel,
    gxMunicipalLevel,
    swProvincialLevel,
    swMunicipalLevel,
    kjEngProvincialLevel,
    kjEngMunicipalLevel,
    kjEngNationalLevel,
    kjLabNationalLevel,
    kjLabProvincialLevel,
    kjLabMunicipalLevel,
    kjAcademicianProvincialLevel,
    kjAcademicianMunicipalLevel,
  } = params;

  const queryParams: Record<string, string | number | boolean | undefined> = {
    industryChain,
    chain,
    futureChain,
    enterpriseName,
    cityDistrict,
    page,
    size,
  };
  if (fgProvincialLevel === true) queryParams.fgProvincialLevel = true;
  if (fgMunicipalLevel === true) queryParams.fgMunicipalLevel = true;
  if (fgNationalLevel === true) queryParams.fgNationalLevel = true;
  if (gxProvincialLevel === true) queryParams.gxProvincialLevel = true;
  if (gxMunicipalLevel === true) queryParams.gxMunicipalLevel = true;
  if (swProvincialLevel === true) queryParams.swProvincialLevel = true;
  if (swMunicipalLevel === true) queryParams.swMunicipalLevel = true;
  if (kjEngProvincialLevel === true) queryParams.kjEngProvincialLevel = true;
  if (kjEngMunicipalLevel === true) queryParams.kjEngMunicipalLevel = true;
  if (kjEngNationalLevel === true) queryParams.kjEngNationalLevel = true;
  if (kjLabNationalLevel === true) queryParams.kjLabNationalLevel = true;
  if (kjLabProvincialLevel === true) queryParams.kjLabProvincialLevel = true;
  if (kjLabMunicipalLevel === true) queryParams.kjLabMunicipalLevel = true;
  if (kjAcademicianProvincialLevel === true) queryParams.kjAcademicianProvincialLevel = true;
  if (kjAcademicianMunicipalLevel === true) queryParams.kjAcademicianMunicipalLevel = true;

  const res = await request<FullChainListResult | { data: FullChainListResult }>(
    '/prime-api/enterprise-innovative-clusters',
    {
      method: 'GET',
      params: queryParams,
    }
  );
  // 兼容后端直接返回列表 或 包装在 data 中 { data: { records, total, page, size } }
  if (res && typeof (res as { data?: FullChainListResult }).data !== 'undefined') {
    return (res as { data: FullChainListResult }).data;
  }
  return res as FullChainListResult;
}

/** 字典项转 Select options（value 使用 label，与列表接口返回值一致） */
function dictToOptions(items: { code?: string; label?: string }[]): DictOption[] {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    label: item.label ?? item.code ?? '',
    value: item.label ?? item.code ?? '',
  }));
}

/** 获取市(区)选项 - 从字典拉取 */
export async function fetchDistrictOptions(): Promise<DictOption[]> {
  const data = await systemApi.getDictItems({
    catalog: FULL_CHAIN_DICT_CATALOGS.cityDistrict,
  });
  return dictToOptions(data ?? []);
}

/** 企业创新平台统计表统计 GET /enterprise-innovative-clusters/statistics → 创新集群看板卡片 */
export function mapClusterStatisticsToCards(
  voList: StatisticInnovativeClusterVo[],
): ClusterDashboardCard[] {
  if (!Array.isArray(voList)) return [];
  return voList.map((node) => {
    const children = node.children ?? [];
    const itemsFromChildren = children.map((ch) => ({
      name: (ch.name ?? '-').trim() || '-',
      count: ch.count ?? 0,
    }));
    const items =
      itemsFromChildren.length > 0
        ? itemsFromChildren
        : (node.count ?? 0) > 0
          ? [{ name: '—', count: node.count ?? 0 }]
          : [];
    const sumChildren = itemsFromChildren.reduce((s, i) => s + i.count, 0);
    const total =
      node.count !== undefined && node.count !== null ? node.count : sumChildren;
    return {
      clusterName: (node.name ?? '-').trim() || '-',
      total,
      items,
    };
  });
}

/** 大中心情况统计 GET /enterprise-innovative-clusters/statistics-center */
export function mapCenterStatisticsToCenters(vo: StatisticCenterVo): CenterDashboardCenter[] {
  if (!vo || typeof vo !== 'object') return [];
  return [
    {
      name: '发改-工程研究中心(产业技术创新中心)',
      provincial: vo.count1 ?? 0,
      municipal: vo.count2 ?? 0,
    },
    {
      name: '工信-企业技术中心',
      provincial: vo.count8 ?? 0,
      municipal: vo.count9 ?? 0,
    },
    {
      name: '商务-外资研发中心',
      provincial: vo.count3 ?? 0,
      municipal: vo.count4 ?? 0,
    },
    {
      name: '科技-工程技术研究中心',
      provincial: vo.count10 ?? 0,
      municipal: vo.count11 ?? 0,
    },
    {
      name: '科技-重点实验室',
      provincial: vo.count5 ?? 0,
      municipal: vo.count6 ?? 0,
      national: vo.count7 ?? 0,
    },
    {
      name: '科技-院士工作站',
      provincial: vo.count12 ?? 0,
      municipal: vo.count13 ?? 0,
    },
  ];
}

/** 企业创新平台统计表统计（创新集群数据看板） */
export async function fetchClusterDashboardStatistics(): Promise<ClusterDashboardCard[]> {
  const list = await primeApi.statisticsEnterpriseInnovativeClusters();
  return mapClusterStatisticsToCards(list);
}

/** 大中心情况统计（中心统计数据看板） */
export async function fetchCenterDashboardStatistics(): Promise<CenterDashboardCenter[]> {
  const vo = await primeApi.statisticsCenter();
  return mapCenterStatisticsToCenters(vo);
}
