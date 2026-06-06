import { primeApi } from '@/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Button, DatePicker, message, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { history } from '@umijs/max';
import * as XLSX from 'xlsx';

import titleTemplateArr from './title.json';
import data1 from './1.json';
import data2 from './2.json';
import data3 from './3.json';
import data4 from './4.json';
import data5 from './5.json';
import data6 from './6.json';
import data7 from './7.json';
import beizhuArr from './beizhu.json';
import foreignInvestmentProgressArr from './foreignInvestmentProgress.json';
import {
  mergeLongHuBangFlatDataSource,
  isLongHuBangMergeCell,
  getMunicipalKeyProjectFgNavMode,
} from './projectAttractionLhbMerge';
import { resolveAdCodeFromRegionLabel } from './reportCenterRegionCodes';

import styles from './ProjectAttraction.module.css';

type RowType = Record<string, any> & { key: string };

type TemplateNode = Record<string, any>;

const titleTemplate = (Array.isArray(titleTemplateArr) ? titleTemplateArr[0] : null) as TemplateNode | null;

type RemarkItem = { 备注?: string[]; 标题?: string; 内容?: string[] };
const REMARKS: RemarkItem[] = Array.isArray(beizhuArr) ? (beizhuArr as any[]) : [];

function remarkLines(item?: RemarkItem): string[] {
  if (!item) return [];
  if (Array.isArray(item.备注)) return item.备注;
  if (Array.isArray(item.内容)) return item.内容;
  return [];
}

function remarkToCellText(lines: string[]): string {
  const body = lines.join('\n');
  return body ? `备注：\n${body}` : '备注：';
}

const REMARK_ROW_KEY = '__REMARK_ROW__';

const PATH_SEP_NAV = '::';

/** 统计截止时间默认：当前时刻所在小时的上一整点 59:59（如 16:46:10 → 15:59:59） */
function defaultStatEndDate(): Dayjs {
  return dayjs().startOf('hour').subtract(1, 'second');
}

/** 接口 endDate 格式：YYYY-MM-DDTHH:mm:ss（不带 .000Z） */
function formatEndDateParam(d: Dayjs): string {
  return d.format('YYYY-MM-DDTHH:mm:ss');
}

/** primeApi 会对 endDate 调 toISOString，自定义返回值以避开 UTC 后缀 */
function toEndDateApiParam(d: Dayjs): Date {
  const s = formatEndDateParam(d);
  return { toISOString: () => s } as unknown as Date;
}

/** 报表「龙虎榜」接口列穿透落地页，与 `config/routes` 中 `/report-center/project-digital-list` 一致 */
const REPORT_CENTER_PROJECT_DIGITAL_LIST = '/report-center/project-digital-list';

/** 与 `/statistic/long-hu-bang-auth` 返回的 code、`resolveAdCodeFromRegionLabel` 对齐，用于权限比较 */
function canonicalizeRegionAdCodeForAuth(code: string): string {
  const d = String(code ?? '').replace(/\D/g, '');
  if (d.length >= 12) return d.slice(0, 12);
  if (d.length >= 6) return d.slice(0, 6).padEnd(12, '0');
  return d;
}

function buildAllowedRegionCodeSet(raw: string[] | null | undefined): Set<string> {
  const set = new Set<string>();
  if (!Array.isArray(raw)) return set;
  for (const x of raw) {
    const c = canonicalizeRegionAdCodeForAuth(String(x));
    if (c) set.add(c);
  }
  return set;
}

/** 权限接口返回泰州市/全市级 code 时，所有可解析地区行均可穿透跳转 */
const LONG_HU_BANG_AUTH_CITY_WIDE_CODE_CANON = canonicalizeRegionAdCodeForAuth('321200000000');

function buildLeafColumnIndexMap(columns: ColumnsType<RowType>): Map<string, number> {
  const m = new Map<string, number>();
  let n = 0;
  const walk = (nodes: any[]) => {
    for (const col of nodes) {
      if (!col) continue;
      if (Array.isArray(col.children) && col.children.length) walk(col.children);
      else if (col.dataIndex != null && String(col.dataIndex)) {
        n += 1;
        m.set(String(col.dataIndex), n);
      }
    }
  };
  walk(columns as any[]);
  return m;
}

function attachLongHuBangCellNavigate(
  columnsIn: ColumnsType<RowType>,
  leafColIndex: Map<string, number>,
  ctx: { statPeriod: Dayjs; regionField: string; allowedRegionCodes: Set<string> },
): ColumnsType<RowType> {
  const wrap = (col: any): any => {
    if (col.children?.length) return { ...col, children: col.children.map(wrap) };
    const di = col.dataIndex;
    const diStr = di == null ? '' : String(di);
    if (!diStr || !isLongHuBangMergeCell(diStr)) return col;
    const origRender = col.render;
    return {
      ...col,
      render(v: any, record: RowType, index: number) {
        const node = origRender ? origRender(v, record, index) : v;
        if (record?.key === REMARK_ROW_KEY) return node;
        const rf = record[ctx.regionField] ?? record.key;
        const regionLabel = String(rf ?? '');
        const code = resolveAdCodeFromRegionLabel(regionLabel);
        if (!code) return node;
        const codeCanon = canonicalizeRegionAdCodeForAuth(code);
        const hasCityWideAuth = ctx.allowedRegionCodes.has(LONG_HU_BANG_AUTH_CITY_WIDE_CODE_CANON);
        if (!hasCityWideAuth && !ctx.allowedRegionCodes.has(codeCanon)) return node;
        const columnTitle = diStr.split(PATH_SEP_NAV).filter(Boolean).join(' / ');
        const fgMode = getMunicipalKeyProjectFgNavMode(diStr);
        if (!fgMode) {
          const colNum = leafColIndex.get(diStr);
          if (!colNum) return node;
          // 第 49、50 列不打开项目明细穿透页
          if (colNum === 49 || colNum === 50) return node;
        }
        const go = () => {
          const q = new URLSearchParams();
          if (fgMode) {
            q.set('listMode', 'project-info-fg');
            q.set('city', code);
            // 「☆项目数量」穿透不传 isNewStart；仅「新开工项目数」按新开工筛选
            if (fgMode === 'newStartCount') q.set('isNewStart', '是');
            q.set('columnTitle', columnTitle);
            q.set('fromPage', '/report-center/project-attraction');
            q.set('page', '1');
            q.set('pageSize', '10');
          } else {
            const colNum = leafColIndex.get(diStr);
            if (!colNum) return;
            q.set('code', code);
            q.set('columns', String(colNum));
            q.set('columnTitle', columnTitle);
            q.set('endDate', formatEndDateParam(ctx.statPeriod));
            q.set('showAll', 'true');
            q.set('fromPage', '/report-center/project-attraction');
            q.set('page', '1');
            q.set('pageSize', '10');
          }
          const search = q.toString();
          const href = history.createHref({
            pathname: REPORT_CENTER_PROJECT_DIGITAL_LIST,
            search: search ? `?${search}` : '',
          });
          window.open(href, '_blank', 'noopener,noreferrer');
        };
        return (
          <span
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer', color: '#1677ff' }}
            onClick={go}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                go();
              }
            }}
          >
            {node}
          </span>
        );
      },
    };
  };
  return (columnsIn as any[]).map(wrap) as ColumnsType<RowType>;
}

function buildRemarkMap(template: TemplateNode): Record<string, string> {
  const regionKey = Object.prototype.hasOwnProperty.call(template, '市（区）') ? '市（区）' : '区域';
  const topKeys = Object.keys(template).filter((k) => k !== regionKey);
  const moduleRemarkIndex: Record<string, number> = {
    排名: 0,
    固定资产投资情况: 1,
    省重大项目情况: 2,
    市重点项目情况: 3,
    签约项目情况: 4,
    备案项目情况: 5,
    开工项目情况: 6,
    开工项目投资情况: 7,
    竣工项目情况: 8,
    '“四上”企业新增数情况': 9,
    外资项目推进情况: 10,
  };
  const map: Record<string, string> = {};
  for (const k of topKeys) {
    const idx = moduleRemarkIndex[k];
    map[k] = idx === undefined ? '备注：' : remarkToCellText(remarkLines(REMARKS[idx]));
  }
  return map;
}

const ALL_STATIC_ROWS: TemplateNode[] = [
  ...(Array.isArray(data1) ? (data1 as any[]) : []),
  ...(Array.isArray(data2) ? (data2 as any[]) : []),
  ...(Array.isArray(data3) ? (data3 as any[]) : []),
  ...(Array.isArray(data4) ? (data4 as any[]) : []),
  ...(Array.isArray(data5) ? (data5 as any[]) : []),
  ...(Array.isArray(data6) ? (data6 as any[]) : []),
  ...(Array.isArray(data7) ? (data7 as any[]) : []),
];

const PATH_SEP = '::';
const makePathKey = (path: string[]) => path.join(PATH_SEP);

function getByPath(obj: any, path: string[]) {
  let cur = obj;
  for (const k of path) {
    if (cur === null || cur === undefined) return undefined;
    // 兼容 title.json 将“区域”改为“市（区）”，数据源仍可能用“区域”
    if (k === '市（区）' && cur?.[k] === undefined && cur?.['区域'] !== undefined) {
      cur = cur['区域'];
    } else if (k === '区域' && cur?.[k] === undefined && cur?.['市（区）'] !== undefined) {
      cur = cur['市（区）'];
    } else {
      cur = cur[k];
    }
  }
  return cur;
}

function decimalsForPath(path: string[] | undefined): number | null {
  if (!Array.isArray(path) || path.length === 0) return null;
  const top = path[0];
  const leaf = path[path.length - 1];
  const key = path.slice(1).join('/');

  // 固定资产投资情况：完成数/预测数需要 1 位小数（如 370.0）
  if (top === '固定资产投资情况') {
    if (leaf === '1-4月完成数' || leaf === '半年预测数') return 1;
    if (key.startsWith('其他/') && leaf === '完成数') return 1;
    return null;
  }

  // 省重大/市重点：计划总投资、年度投资 1 位小数；市重点实际入库投资 2 位小数
  if (top === '省重大项目情况' || top === '市重点项目情况') {
    if (leaf === '计划总投资' || leaf === '年度投资') return 1;
    if (key.endsWith('实际入库投资')) {
      return top === '市重点项目情况' ? 2 : 1;
    }
    return null;
  }

  // 开工项目投资情况：投资金额按 2 位小数（如 18.60 / 0.00）
  if (top === '开工项目投资情况') {
    if (leaf === '计划总投资') return 2;
    if (key.endsWith('已完成投资/总数') || key.endsWith('已完成投资/当月新增')) return 2;
    return null;
  }

  if (top === '外资项目推进情况') {
    if (leaf === '实际到账外资' || leaf === '未到账外资金额') return 2;
    return null;
  }

  // 兜底：带“投资”字样的金额类字段，默认 1 位小数（避免 0.0 变 0）
  const leafText = String(leaf || '');
  if (leafText.includes('投资') && !leafText.includes('投资完成率')) return 1;

  return null;
}

function formatCell(v: any, path?: string[]) {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'number' && Number.isFinite(v)) {
    const d = decimalsForPath(path);
    if (typeof d === 'number') return v.toFixed(d);
    return String(v);
  }
  const s = String(v).trim();
  if (s === '' || s === 's' || s === 'S') return '—';
  return s;
}

function flattenRecordByTemplate(template: TemplateNode, record: TemplateNode): RowType {
  const out: RowType = { key: String(record?.['区域'] ?? record?.['市（区）'] ?? Math.random()) };
  const walk = (node: any, path: string[]) => {
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      for (const k of Object.keys(node)) walk(node[k], [...path, k]);
      return;
    }
    const key = makePathKey(path);
    out[key] = getByPath(record, path);
  };
  walk(template, []);
  return out;
}

function buildColumnsFromTemplate(template: TemplateNode): ColumnsType<RowType> {
  const regionKey = Object.prototype.hasOwnProperty.call(template, '市（区）') ? '市（区）' : '区域';
  const groupStyleCycle = [
    { h: styles.hYellow, hs: styles.hYellowSub, c: styles.cYellow },
    { h: styles.hGreen, hs: styles.hGreenSub, c: styles.cGreen },
    { h: styles.hOrange, hs: styles.hOrangeSub, c: styles.cOrange },
    { h: styles.hBlue, hs: styles.hBlueSub, c: styles.cBlue },
    { h: styles.hRed, hs: styles.hRedSub, c: styles.cRed },
    { h: styles.hGray, hs: styles.hGraySub, c: styles.cGray },
  ];

  const topKeys = Object.keys(template).filter((k) => k !== regionKey);
  const topStyleMap = new Map<string, (typeof groupStyleCycle)[number]>();
  let styleIdx = 0;
  for (const k of topKeys) {
    if (k.includes('排名')) continue;
    topStyleMap.set(k, groupStyleCycle[styleIdx % groupStyleCycle.length]);
    styleIdx += 1;
  }

  const baseSty = { h: styles.hBase, hs: styles.hBase, c: styles.cBase };

  const foreignSty = { h: styles.hYellow, hs: styles.hYellowSub, c: styles.cYellow };

  const styForPath = (path: string[]) => {
    const top = path[0] || '';
    if (!top) return baseSty;
    if (top.includes('排名')) return baseSty;
    if (top === '外资项目推进情况') return foreignSty;
    return topStyleMap.get(top) ?? baseSty;
  };

  const remarkMap = buildRemarkMap(template);

  // 统计每个一级模块的叶子列数量，用于“备注行”横向合并
  const topLeafCount: Record<string, number> = {};
  const countLeaves = (node: any, path: string[]) => {
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      for (const k of Object.keys(node)) countLeaves(node[k], [...path, k]);
      return;
    }
    const top = path[0];
    if (!top) return;
    if (top === regionKey) return;
    topLeafCount[top] = (topLeafCount[top] ?? 0) + 1;
  };
  countLeaves(template, []);

  // 标记每个一级模块的第一列（在构建 columns 时确定，避免 render 顺序不稳定）
  const firstLeafBuilt: Record<string, boolean> = {};

  const displayLabelForPath = (path: string[]) => {
    const top = path[0] || '';
    if (top === '固定资产投资情况') {
      const p = path.slice(1);
      const key = p.join('/');
      if (path.length === 1) return '①固定资产投资情况';
      if (key === '1-4月完成数') return '☆1-4月\n完成数';
      if (key === '半年预测数') return '预测数';
      if (key === '半年完成进度') return '②\n☆完成进度';
      if (key === '全年预测数') return '预测数';
      if (key === '全年完成进度') return '③\n完成进度';
      if (p.length === 3 && p[0] === '其他') {
        if (p[2] === '完成数') return '完成数';
        if (p[2] === '增幅') return '增幅';
      }
    }
    if (top === '省重大项目情况') {
      const p = path.slice(1);
      const key = p.join('/');
      if (key === '项目数量') return '①\n项目数量';
      if (key === '年度投资完成情况/实际入库投资') return '②\n实际入库\n投资';
      if (key === '年度投资完成情况/投资完成率') return '③\n☆投资\n完成率';
      if (key === '项目开工情况/新开工项目数') return '④\n新开工\n项目数';
      if (key === '项目开工情况/已开工项目数') return '⑤\n已开工\n项目数';
      if (key === '项目开工情况/开工率') return '⑥\n开工率';
      if (key === '已开工未列统项目数') return '已开工\n未列统\n项目数';
    }
    if (top === '市重点项目情况') {
      const p = path.slice(1);
      const key = p.join('/');
      if (key === '项目数量') return '☆项目数量';
      if (key === '年度投资完成情况/实际入库投资') return '①\n实际入库投资';
      if (key === '年度投资完成情况/投资完成率') return '②\n☆投资\n完成率';
      if (key === '项目开工情况/新开工项目数') return '③\n新开工\n项目数';
      if (key === '项目开工情况/已开工项目数') return '④\n已开工\n项目数';
      if (key === '项目开工情况/开工率') return '☆开工率';
      if (key === '已开工未列统项目数') return '已开工\n未列统\n项目数';
    }
    if (top === '签约项目情况') {
      const p = path.slice(1);
      const key = p.join('/');
      if (p.length === 1 && p[0] === '500万元-1亿元项目') return '500万元-1亿元\n（1000万美元）\n项目';
      if (p.length === 1 && p[0] === '1亿元以上项目') return '1亿元（1000万美元）\n以上项目';
      if (key === '1亿元以上项目/总数') return '☆总数';
      if (p.length === 2 && p[1] === '协议投资5亿元以上项目') return '其中：协议投资5亿元（3000万美元）\n以上项目';
      if (p.length === 2 && p[1] === '年度投资1亿元以上项目') return '其中：年度投资\n1亿元以上项目';
    }
    if (top === '备案项目情况') {
      const p = path.slice(1);
      const key = p.join('/');
      if (path.length === 1) return '①\n备案项目情况';
      if (p.length === 1 && p[0] === '500万元-1亿元项目') return '500万元-1亿元\n（1000万美元）\n项目';
      if (p.length === 1 && p[0] === '1亿元以上项目') return '1亿元（1000万美元）\n以上项目';
      if (key === '1亿元以上项目/总数') return '☆总数';
      if (p.length === 2 && p[1] === '协议投资5亿元以上项目') return '其中：协议投资5亿元（3000万美元）\n以上项目';
      if (p.length === 1 && p[0] === '其中：增资扩产项目') return '其中：增资扩产\n项目';
      if (key === '其中：增资扩产项目/总数') return '☆总数';
      if (p.length === 1 && p[0] === '其中：外资利润再投资项目') return '其中：外资利润\n再投资项目';
      if (key === '其中：外资利润再投资项目/投资额(万美元)') return '投资额\n(万美元)';
    }
    if (top === '开工项目情况') {
      const p = path.slice(1);
      const key = p.join('/');
      if (path.length === 1) return '①\n开工项目情况';
      if (p.length === 1 && p[0] === '500万元-1亿元项目') return '500万元-1亿元\n（1000万美元）\n项目';
      if (p.length === 1 && p[0] === '1亿元以上项目') return '1亿元（1000万美元）\n以上项目';
      if (key === '1亿元以上项目/总数') return '☆总数';
      if (p.length === 2 && p[1] === '协议投资5亿元以上项目') return '其中：协议投资5亿元（3000万美元）\n以上项目';
    }
    if (top === '开工项目投资情况') {
      const p = path.slice(1);
      const key = p.join('/');
      if (path.length === 1) return '①\n开工项目投资情况';
      if (p.length === 1 && p[0] === '500万元-1亿元项目') return '500万元-1亿元\n（1000万美元）\n项目';
      if (p.length === 1 && p[0] === '1亿元以上项目') return '1亿元（1000万美元）\n以上项目';
      if (p.length === 2 && p[1] === '已完成投资') return '☆已完成投资';
      if (key.endsWith('已完成投资/当月新增')) return '当月\n新增';
      if (key.endsWith('投资完成率')) {
        // 仅“1亿元以上项目”的投资完成率需要带☆
        if (key.startsWith('1亿元以上项目/')) return '☆投资\n完成率';
        return '投资\n完成率';
      }
      if (key.endsWith('已完成投资/总数')) return '';
    }
    if (top === '竣工项目情况') {
      const p = path.slice(1);
      const key = p.join('/');
      if (path.length === 1) return '①\n竣工项目情况';
      if (p.length === 1 && p[0] === '500万元-1亿元项目') return '500万元-1亿元\n（1000万美元）\n项目';
      if (p.length === 1 && p[0] === '1亿元以上项目') return '1亿元（1000万美元）\n以上项目';
      if (key === '1亿元以上项目/总数') return '☆总数';
    }
    if (top === '“四上”企业新增数情况') {
      const p = path.slice(1);
      const key = p.join('/');
      if (path.length === 1) return '①\n“四上”企业新增数情况';
      if (key === '总数') return '☆新增规上';
    }
    if (top === '外资项目推进情况') {
      const p = path.slice(1);
      if (path.length === 1) return '外资项目推进情况';
      if (p[0] === '实际到账外资') return '①☆ 实际到账外资';
      if (p[0] === '新签约总投资1000万美元以上项目' && path.length === 2) {
        return '② 新签约总投资1000万美元以上项目';
      }
      if (p[0] === '新注册项目' && path.length === 2) return '③ 新注册项目';
    }
    return path[path.length - 1] || '';
  };

  const build = (node: any, path: string[]): any => {
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      // 固定资产投资情况：按截图做二级分组（不改 title.json 数据结构）
      if (path.length === 1 && path[0] === '固定资产投资情况') {
        const sty = styForPath(path);
        const leaf = (leafKey: string) => build((node as any)?.[leafKey], [...path, leafKey]);
        const mkGroup = (titleText: string, groupKey: string, groupChildren: any[]) => ({
          title: <div style={{ whiteSpace: 'pre-line', lineHeight: 1.2 }}>{titleText}</div>,
          key: makePathKey([...path, groupKey]),
          align: 'center' as const,
          onHeaderCell: () => ({ className: sty.hs }),
          children: groupChildren,
        });

        const otherNode = (node as any)?.['其他'] ?? {};
        const otherCategories = ['工业投资', '服务业投资', '房地产开发投资', '基础设施投资'];
        const otherLeaf = (category: string, field: string) =>
          build(otherNode?.[category]?.[field], [...path, '其他', category, field]);
        const otherGroup = mkGroup('其中：', '其他', otherCategories.map((cat) =>
          mkGroup(cat, cat, [otherLeaf(cat, '完成数'), otherLeaf(cat, '增幅')]),
        ));

        const children = [
          leaf('1-4月完成数'),
          mkGroup('上半年', '半年', [leaf('半年预测数'), leaf('半年完成进度')]),
          mkGroup('全年', '全年', [leaf('全年预测数'), leaf('全年完成进度')]),
          otherGroup,
        ];

        const title = displayLabelForPath(path);
        return {
          title: <div style={{ whiteSpace: 'pre-line', lineHeight: 1.2 }}>{title}</div>,
          key: makePathKey(path),
          align: 'center' as const,
          onHeaderCell: () => ({ className: sty.h }),
          children,
        };
      }

      const children = Object.keys(node).map((k) => build(node[k], [...path, k]));
      if (path.length === 0) return children;
      const title = displayLabelForPath(path);
      const sty = styForPath(path);
      return {
        title: <div style={{ whiteSpace: 'pre-line', lineHeight: 1.2 }}>{title}</div>,
        key: makePathKey(path),
        align: 'center' as const,
        onHeaderCell: () => ({ className: path.length === 1 ? sty.h : sty.hs }),
        children,
      };
    }
    const rawLeafTitle = path[path.length - 1];
    const leafTitle = displayLabelForPath(path);
    const dataIndex = makePathKey(path);
    const isRegion = path.length === 1 && rawLeafTitle === regionKey;
    const sty = styForPath(path);
    const top = path[0] || '';
    const isFirstLeafInTop = !isRegion && !!top && top !== regionKey && !firstLeafBuilt[top];
    if (isFirstLeafInTop) firstLeafBuilt[top] = true;
    return {
      title: <div style={{ whiteSpace: 'pre-line', lineHeight: 1.2 }}>{leafTitle}</div>,
      dataIndex,
      key: dataIndex,
      width: isRegion ? 160 : 110,
      fixed: isRegion ? ('left' as const) : undefined,
      align: 'center' as const,
      onHeaderCell: () => ({ className: isRegion ? styles.hBase : sty.hs }),
      onCell: () => ({ className: isRegion ? styles.cBase : sty.c }),
      render: (v: any, record: any) => {
        // “备注”行：每个一级模块用 1 个合并单元格承载文本，其余列隐藏
        if (record?.key === REMARK_ROW_KEY) {
          if (isRegion) return '';
          if (!top || top === '区域') return { children: null, props: { colSpan: 0 } };
          const span = topLeafCount[top] ?? 1;
          if (!isFirstLeafInTop) return { children: null, props: { colSpan: 0 } };
          const text = remarkMap[top] ?? '';
          return {
            children: (
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', textAlign: 'left', lineHeight: 1.6 }}>
                {text || '备注：'}
              </div>
            ),
            props: { colSpan: span, style: { textAlign: 'left' } },
          };
        }
        return formatCell(v, path);
      },
    };
  };
  const top = build(template, []);
  return Array.isArray(top) ? (top as any) : [top];
}

/** 从 antd Table 列配置（含多级表头）提取导出用叶子列 */
function extractTextFromTitle(node: unknown): string {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromTitle).join('');
  if (React.isValidElement(node)) {
    const props = node.props as { children?: unknown };
    return extractTextFromTitle(props?.children);
  }
  return '';
}

type ExportLeafPath = { path: string[]; dataIndex: string };

/** 将路径压成三行表头：一级 / 二级 / 三级（叶子）；仅两级时第三行留空，导出时与第二行纵向合并 */
function padPathToThreeLevels(path: string[]): [string, string, string] {
  const p = path.filter((s) => Boolean(s && String(s).trim()));
  if (p.length === 0) return ['', '', ''];
  if (p.length === 1) return ['', '', String(p[0])];
  if (p.length === 2) return [String(p[0]), String(p[1]), ''];
  if (p.length === 3) return [String(p[0]), String(p[1]), String(p[2])];
  return [String(p[0]), String(p[1]), p.slice(2).join(' / ')];
}

function collectLeafPathsForExport(cols: any[], prefix: string[] = []): ExportLeafPath[] {
  const out: ExportLeafPath[] = [];
  for (const col of cols) {
    if (!col) continue;
    const piece = extractTextFromTitle(col.title).replace(/\s+/g, ' ').trim();
    const nextPrefix = piece ? [...prefix, piece] : [...prefix];
    if (Array.isArray(col.children) && col.children.length > 0) {
      out.push(...collectLeafPathsForExport(col.children, nextPrefix));
    } else if (col.dataIndex !== undefined && col.dataIndex !== null) {
      const di = Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : String(col.dataIndex);
      out.push({ path: nextPrefix, dataIndex: di });
    }
  }
  return out;
}

/**
 * 第三行以下为数据区。
 * 第 1 行：连续相同则横向合并。
 * 第 2 / 3 行：第三行有字时仅在第 2 行横向合并；第三行为空时与第 2 行做纵向合并（可多列整块合并）。
 */
function buildThreeRowHeaderMerges(h0: string[], h1: string[], h2: string[]): XLSX.Range[] {
  const merges: XLSX.Range[] = [];
  const N = h0.length;
  let j = 0;
  while (j < N) {
    const v = h0[j];
    if (!v) {
      j++;
      continue;
    }
    let k = j + 1;
    while (k < N && h0[k] === v) k++;
    if (k - j > 1) merges.push({ s: { r: 0, c: j }, e: { r: 0, c: k - 1 } });
    j = k;
  }
  j = 0;
  while (j < N) {
    const u = h0[j];
    const v = h1[j];
    const w = h2[j];
    if (!v && !w) {
      j++;
      continue;
    }
    if (w !== '') {
      let k = j + 1;
      while (k < N && h0[k] === u && h1[k] === v && h2[k] !== '') k++;
      if (k - j > 1) merges.push({ s: { r: 1, c: j }, e: { r: 1, c: k - 1 } });
      j = k;
    } else {
      let k = j + 1;
      while (k < N && h0[k] === u && h1[k] === v && h2[k] === '') k++;
      merges.push({ s: { r: 1, c: j }, e: { r: 2, c: k - 1 } });
      j = k;
    }
  }
  return merges;
}

function sanitizeFileName(name: string): string {
  return String(name || 'export').replace(/[/\\?*[\]:]/g, '_').slice(0, 120);
}

const FOREIGN_INVESTMENT_TOP = '外资项目推进情况';

function normalizeRegionLabel(label: string): string {
  return String(label || '')
    .trim()
    .replace(/[（(]/g, '(')
    .replace(/[）)]/g, ')');
}

function foreignInvestmentRecordFromJson(row: Record<string, unknown>): TemplateNode {
  return {
    实际到账外资: row['实际到账外资'],
    新签约总投资1000万美元以上项目: {
      签约项目总数: row['签约项目总数'],
      未注册项目数: row['未注册项目数'],
      注册但未到资项目数: row['注册但未到资项目数'],
      未到账外资金额: row['新签约未到账外资金额'],
    },
    新注册项目: {
      注册项目总数: row['注册项目总数'],
      未到资项目数: row['未到资项目数'],
      未到账外资金额: row['新注册未到账外资金额'],
    },
  };
}

function buildForeignInvestmentByRegionMap(): Map<string, TemplateNode> {
  const m = new Map<string, TemplateNode>();
  const arr = Array.isArray(foreignInvestmentProgressArr) ? foreignInvestmentProgressArr : [];
  for (const row of arr) {
    const r = row as Record<string, unknown>;
    const label = normalizeRegionLabel(String(r['市（区）'] ?? ''));
    if (!label) continue;
    m.set(label, foreignInvestmentRecordFromJson(r));
  }
  return m;
}

function mergeForeignInvestmentIntoDataSource(
  ds: RowType[],
  template: TemplateNode,
  regionKey: string,
  byRegion: Map<string, TemplateNode>,
): RowType[] {
  const fiTemplate = (template as TemplateNode)[FOREIGN_INVESTMENT_TOP];
  if (!fiTemplate || typeof fiTemplate !== 'object') return ds;
  const regionPathKey = makePathKey([regionKey]);
  const miniTemplate = { [regionKey]: '', [FOREIGN_INVESTMENT_TOP]: fiTemplate };
  return ds.map((row) => {
    if (row.key === REMARK_ROW_KEY) return row;
    const label = normalizeRegionLabel(String(row[regionPathKey] ?? row.key ?? ''));
    const fiData = byRegion.get(label);
    if (!fiData) return row;
    const partial = flattenRecordByTemplate(miniTemplate, {
      [regionKey]: label,
      [FOREIGN_INVESTMENT_TOP]: fiData,
    } as TemplateNode);
    const merged: RowType = { ...row };
    for (const [k, v] of Object.entries(partial)) {
      if (k === 'key' || k === regionPathKey) continue;
      merged[k] = v;
    }
    return merged;
  });
}

const ProjectAttraction: React.FC = () => {
  const [loading, setLoading] = useState(true);
  /** 页眉在龙虎榜接口未返回前只显示主干，不展示「（*年*月份）」统计区间 */
  const TITLE_CORE = '项目招引建设情况通报表';
  const BASE_TITLE = `${TITLE_CORE}（2026年1-4月份）`;
  const [title, setTitle] = useState(BASE_TITLE);
  const [columns, setColumns] = useState<ColumnsType<RowType>>([]);
  const [allColumns, setAllColumns] = useState<ColumnsType<RowType>>([]);
  const [dataSource, setDataSource] = useState<RowType[]>([]);
  const [filterGroups, setFilterGroups] = useState<Array<{ key: string; title: string }>>([]);
  const [selectedGroupKeys, setSelectedGroupKeys] = useState<string[]>(['__ALL__']);
  /** 报表统计截止时间（接口 endDate）；默认上一小时 59:59 */
  const [statPeriod, setStatPeriod] = useState<Dayjs>(() => defaultStatEndDate());
  const [exporting, setExporting] = useState(false);

  const monthRangeLabel = (m: number) => (m <= 1 ? '1' : `1-${m}`);

  const buildDynamicTitle = (rawTitle: string, year: number, month: number) => {
    const range = monthRangeLabel(month);
    const next = String(rawTitle || '').replace(/\d{4}年.*?月份/, `${year}年${range}月份`);
    return next || rawTitle;
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        if (!titleTemplate) throw new Error('title.json 为空或格式不正确');
        const regionKey = Object.prototype.hasOwnProperty.call(titleTemplate, '市（区）')
          ? '市（区）'
          : '区域';
        const year = statPeriod.year();
        const month = statPeriod.month() + 1;

        let allowedRegionCodes = new Set<string>();
        try {
          const authCodes = await primeApi.getLongHuBangAuth();
          allowedRegionCodes = buildAllowedRegionCodeSet(authCodes);
        } catch (authErr) {
          console.error(authErr);
        }

        const cols = buildColumnsFromTemplate(titleTemplate);
        const leafMap = buildLeafColumnIndexMap(cols);
        const colsNav = attachLongHuBangCellNavigate(cols, leafMap, {
          statPeriod,
          regionField: regionKey,
          allowedRegionCodes,
        });
        let ds = ALL_STATIC_ROWS.map((r) => flattenRecordByTemplate(titleTemplate, r));
        ds = mergeForeignInvestmentIntoDataSource(
          ds,
          titleTemplate,
          regionKey,
          buildForeignInvestmentByRegionMap(),
        );
        ds.push(flattenRecordByTemplate(titleTemplate, { [regionKey]: REMARK_ROW_KEY } as any));

        try {
          const lhb = await primeApi.getLongHuBang({ endDate: toEndDateApiParam(statPeriod) });
          if (!cancelled && Array.isArray(lhb)) {
            ds = mergeLongHuBangFlatDataSource(ds, lhb, regionKey as '市（区）' | '区域', REMARK_ROW_KEY);
          }
        } catch (apiErr) {
          console.error(apiErr);
          message.warning('龙虎榜接口（/statistic/long-hu-bang）暂不可用，表格中为本地静态数据');
        }

        if (cancelled) return;

        const groups = Object.keys(titleTemplate)
          .filter((k) => k !== regionKey)
          .map((k) => ({ key: k, title: k }));

        setAllColumns(colsNav);
        setDataSource(ds);
        setFilterGroups(groups);

        setTitle(buildDynamicTitle(BASE_TITLE, year, month));

        setSelectedGroupKeys((prev) => {
          if (!prev?.length || prev.includes('__ALL__')) return ['__ALL__'];
          const valid = prev.filter((k) => groups.some((g) => g.key === k));
          return valid.length ? valid : ['__ALL__'];
        });
      } catch (e) {
        console.error(e);
        message.error('静态报表数据加载失败');
        setAllColumns([]);
        setColumns([]);
        setDataSource([]);
        setFilterGroups([]);
        setSelectedGroupKeys(['__ALL__']);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [statPeriod]);

  useEffect(() => {
    if (!selectedGroupKeys.length || selectedGroupKeys.includes('__ALL__')) {
      setColumns(allColumns);
      return;
    }
    const fixedLeaf = allColumns.filter((c: any) => !c?.children && c?.fixed === 'left');
    const pickedGroups = allColumns.filter((c: any) => c?.children && selectedGroupKeys.includes(String(c?.key)));
    setColumns([...(fixedLeaf as any), ...(pickedGroups as any)]);
  }, [allColumns, selectedGroupKeys]);

  const handleExportExcel = () => {
    if (!dataSource.length) {
      message.warning('暂无数据可导出');
      return;
    }
    const leaves = collectLeafPathsForExport(columns as any[]);
    if (!leaves.length) {
      message.warning('无法解析表头，请稍后重试');
      return;
    }
    try {
      setExporting(true);
      const triples = leaves.map((l) => padPathToThreeLevels(l.path));
      const row0 = triples.map((t) => t[0]);
      const row1 = triples.map((t) => t[1]);
      const row2 = triples.map((t) => t[2]);
      const merges = buildThreeRowHeaderMerges(row0, row1, row2);
      const bodyRows = dataSource
        .filter((r) => r?.key !== REMARK_ROW_KEY)
        .map((record) =>
        leaves.map((l) => {
          const v = record[l.dataIndex];
          if (v === null || v === undefined) return '';
          return typeof v === 'number' && Number.isFinite(v) ? v : String(v);
        }),
      );
      const ws = XLSX.utils.aoa_to_sheet([row0, row1, row2, ...bodyRows]);
      if (merges.length) ws['!merges'] = merges;
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '报表');
      const fn = `${sanitizeFileName(title || BASE_TITLE)}_${statPeriod.format('YYYY-MM-DD_HHmmss')}.xlsx`;
      XLSX.writeFile(wb, fn);
      message.success('导出成功');
    } catch (e) {
      console.error(e);
      message.error('导出失败');
    } finally {
      setExporting(false);
    }
  };

  const pageTitle = loading ? TITLE_CORE : title || BASE_TITLE;

  return (
    <PageContainer
      title={pageTitle}
      content={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>

          <DatePicker
            showTime={{
              defaultValue: defaultStatEndDate(),
              format: 'HH:mm:ss',
            }}
            format="YYYY-MM-DD HH:mm:ss"
            value={statPeriod}
            allowClear={false}
            onChange={(d) => {
              if (d) setStatPeriod(d);
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* <Typography.Text type="secondary">第4行表头筛选</Typography.Text> */}
            <Select
              style={{ width: 260 }}
              mode="multiple"
              maxTagCount="responsive"
              value={selectedGroupKeys}
              onChange={(vals) => {
                const next = (vals || []).map(String);
                if (!next.length) {
                  setSelectedGroupKeys(['__ALL__']);
                  return;
                }
                const hasAll = next.includes('__ALL__');
                const prevHasAll = selectedGroupKeys.includes('__ALL__');
                // 从“全部”状态点击模块：去掉“全部”，保留模块
                if (hasAll && prevHasAll && next.length > 1) {
                  setSelectedGroupKeys(next.filter((k) => k !== '__ALL__'));
                  return;
                }
                // 从模块状态点击“全部”：回到全部
                if (hasAll && !prevHasAll) {
                  setSelectedGroupKeys(['__ALL__']);
                  return;
                }
                // 其它正常多选
                setSelectedGroupKeys(hasAll ? ['__ALL__'] : next);
              }}
              options={[
                { value: '__ALL__', label: '全部' },
                ...filterGroups.map((g) => ({ value: g.key, label: g.title })),
              ]}
              showSearch
              optionFilterProp="label"
              placeholder="选择要显示的模块"
              allowClear
            />
          </div>
          <Button
            type="primary"
            loading={exporting}
            disabled={loading}
            onClick={handleExportExcel}
          >
            导出 Excel
          </Button>
        </div>
      }
    >
      <div className={styles.wrap}>
        <div className={styles.tableUnit}>单位：个、亿元</div>
        <Table<RowType>
          className={styles.table}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
          size="small"
          rowKey="key"
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </PageContainer>
  );
};

export default ProjectAttraction;
