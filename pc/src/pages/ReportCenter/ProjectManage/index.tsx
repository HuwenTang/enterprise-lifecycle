import type { ColumnsType } from 'antd/es/table';
import { Button, message, Pagination, Table, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { history, request } from '@umijs/max';
import { primeApi } from '@/services/api';
import type { LhbProjectInfoVo } from '@/services/apis/models/LhbProjectInfoVo';
import type { ProjectInfoFgVo } from '@/services/apis/models/ProjectInfoFgVo';
import { useSearchParams } from 'react-router-dom';

/** 与 `ProjectAttraction` 穿透 URL 中 `listMode` 一致，列表走 GET `/project-info-fg` */
const LIST_MODE_PROJECT_INFO_FG = 'project-info-fg';

/** 龙虎榜项目列表 LhbProjectInfoVo 列（与 OpenAPI 模型及业务注释一致） */
const LHB_COLUMN_DEFS: Array<{
  dataIndex: keyof LhbProjectInfoVo;
  title: string;
  width: number;
  /** 日期列 */
  date?: boolean;
  /** 金额/数字列 */
  numeric?: boolean;
  /** 进度标签样式 */
  progress?: boolean;
}> = [
  { dataIndex: 'projectCode', title: '项目编号', width: 130 },
  { dataIndex: 'projectName', title: '项目名称', width: 180 },
  { dataIndex: 'districtName', title: '市（区）名称', width: 120 },
  { dataIndex: 'parkName', title: '园区名称', width: 120 },
  { dataIndex: 'projectProgressLabel', title: '当前项目进度', width: 130, progress: true },
  { dataIndex: 'projectType', title: '所属行业', width: 100 },
  { dataIndex: 'investor', title: '投资方', width: 140 },
  { dataIndex: 'investmentAmount', title: '投资金额（亿元）', width: 110, numeric: true },
  { dataIndex: 'ifForeignCapital', title: '是否外资', width: 90 },
  { dataIndex: 'fixedAssetInvestment', title: '固定资产投资（万元）', width: 130, numeric: true },
  { dataIndex: 'industryDirection', title: '项目类型', width: 120 },
  { dataIndex: 'industryClassification', title: '产业大类名称', width: 120 },
  { dataIndex: 'mainProducts', title: '项目简介', width: 200 },
  { dataIndex: 'unifiedSocialCreditCode', title: '统一社会信用代码', width: 170 },
  { dataIndex: 'ifIncludedInDatabase', title: '是否列统', width: 90 },
  { dataIndex: 'ltCode', title: '列统代码', width: 100 },
  { dataIndex: 'commencementDate', title: '开工时间', width: 110, date: true },
  { dataIndex: 'endDate', title: '竣工时间', width: 110, date: true },
];

const TitleCom = ({ text, icon }: { text: string; icon: string }) => (
  <div
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <img style={{ width: '10px', marginRight: '5px' }} src={icon} alt="" />
    <div>{text}</div>
  </div>
);

function formatDateCell(v: unknown) {
  if (v === undefined || v === null) return '—';
  const d = dayjs(v as string | Date);
  return d.isValid() ? d.format('YYYY-MM-DD') : '—';
}

function formatNumberCell(v: unknown) {
  if (v === undefined || v === null || Number.isNaN(Number(v))) return '—';
  return Number(v).toLocaleString('zh-CN', { useGrouping: false, maximumFractionDigits: 2 });
}

function progressTagRender(text: unknown) {
  const t = text === undefined || text === null ? '' : String(text);
  if (!t) return <Tag color="blue">—</Tag>;
  if (t.includes('在谈')) return <Tag color="#FF7F50">{t}</Tag>;
  if (t.includes('签约')) return <Tag color="#3CB371">{t}</Tag>;
  if (t.includes('注册')) return <Tag color="#4169E1">{t}</Tag>;
  if (t.includes('备案')) return <Tag color="#9370DB">{t}</Tag>;
  if (t.includes('开工') || t.includes('报批')) return <Tag color="#FF4500">{t}</Tag>;
  if (t.includes('竣工')) return <Tag color="#708090">{t}</Tag>;
  return <Tag>{t}</Tag>;
}

/** 长文本列：固定列宽并省略，悬停 title 查看全文 */
function renderClampText(value: unknown, maxWidth: number) {
  if (value === undefined || value === null || value === '') return '—';
  const text = String(value);
  return (
    <span
      style={{
        display: 'block',
        maxWidth,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      title={text}
    >
      {text}
    </span>
  );
}

/** 统计截止时间默认：当前时刻所在小时的上一整点 59:59（与 ProjectAttraction 一致） */
function defaultStatEndDate() {
  return dayjs().startOf('hour').subtract(1, 'second');
}

/** primeApi 会对 endDate 调 toISOString，自定义返回值以避开 UTC 后缀 */
function toEndDateApiParam(d: dayjs.Dayjs): Date {
  const s = d.format('YYYY-MM-DDTHH:mm:ss');
  return { toISOString: () => s } as unknown as Date;
}

function parseEndDateFromSearch(sp: URLSearchParams): dayjs.Dayjs | null {
  const raw = (sp.get('endDate') || '').trim();
  if (!raw) return null;
  const d = dayjs(raw);
  return d.isValid() ? d : null;
}

/** 与列表、导出接口 `/statistic/long-hu-bang-list*` 共用查询参数 */
function parseLongHuBangListParams(sp: URLSearchParams): {
  endDate: Date;
  code: string;
  columns: number;
} | null {
  const code = (sp.get('code') || '').trim();
  const columnsStr = (sp.get('columns') || '').trim();
  const columnsNum = parseInt(columnsStr, 10);
  if (!code) return null;
  if (!columnsStr || Number.isNaN(columnsNum) || columnsNum < 1) return null;
  const endDateDayjs = parseEndDateFromSearch(sp) ?? defaultStatEndDate();
  return { endDate: toEndDateApiParam(endDateDayjs), code, columns: columnsNum };
}

/** 与列表、导出 GET `/project-info-fg`、`/project-info-fg/export.xlsx` 共用查询参数（`city` 区县编码；`isNewStart` 传「是」「否」） */
function parseProjectInfoFgListParams(sp: URLSearchParams): {
  city: string;
  isNewStart?: string;
  page: number;
  size: number;
} | null {
  const city = (sp.get('city') || '').trim();
  if (!city) return null;
  const page = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1);
  const size = Math.max(1, parseInt(sp.get('pageSize') || '10', 10) || 10);
  const raw = (sp.get('isNewStart') || '').trim();
  let isNewStart: string | undefined;
  if (raw === '是' || raw === '否') {
    isNewStart = raw;
  } else if (raw === 'true' || raw === '1') {
    isNewStart = '是';
  } else if (raw === 'false' || raw === '0') {
    isNewStart = '否';
  }
  return { city, isNewStart, page, size };
}

/** 发改 GET `/project-info-fg` 列表列：`dataIndex` 与 `ProjectInfoFgVo` / 接口 JSON 字段名一致 */
const FG_COLUMN_DEFS: Array<{
  dataIndex: keyof ProjectInfoFgVo;
  title: string;
  width: number;
  date?: boolean;
  numeric?: boolean;
  /** 长文本：严格限制列宽并省略显示 */
  clamp?: boolean;
}> = [
  { dataIndex: 'fgProjectName', title: '发改项目名称', width: 200 },
  { dataIndex: 'fullLifecycleProjectName', title: '全生命项目名称', width: 200 },
  { dataIndex: 'projectSource', title: '项目来源', width: 100 },
  { dataIndex: 'projectCode', title: '项目代码', width: 140 },
  { dataIndex: 'filingProjectCode', title: '备案证项目代码', width: 150 },
  { dataIndex: 'filingApplicationTime', title: '申请备案时间', width: 120, date: true },
  { dataIndex: 'constructionScale', title: '建设规模', width: 340, clamp: true },
  { dataIndex: 'constructionStartEndYears', title: '建设起止年限', width: 120 },
  { dataIndex: 'plannedTotalInvestment', title: '计划总投资(含单位)', width: 140 },
  { dataIndex: 'plannedTotalInvestmentValue', title: '计划总投资(数值)', width: 130, numeric: true },
  {
    dataIndex: 'expectedCompletedInvestmentTo2025',
    title: '从开工到2025年底预计完成投资',
    width: 200,
    numeric: true,
  },
  { dataIndex: 'plannedInvestment2026', title: '2026年计划投资(含单位)', width: 150 },
  { dataIndex: 'plannedInvestment2026Value', title: '2026年计划投资(数值)', width: 150, numeric: true },
  {
    dataIndex: 'progressToEnd2025',
    title: '截至2025年底建设进度或前期工作进展情况',
    width: 220,
  },
  { dataIndex: 'constructionProgress2026', title: '2026年建设进度', width: 140 },
  { dataIndex: 'isNewStart', title: '是否新开工', width: 100 },
  { dataIndex: 'expectedStartTime', title: '(预计)开工时间', width: 130, date: true },
  { dataIndex: 'expectedFirstProductionTime', title: '(预计)首次达产时间', width: 150, date: true },
  { dataIndex: 'investmentEntityName', title: '投资主体名称', width: 160 },
  { dataIndex: 'responsibleUnit', title: '服务推进责任单位', width: 160 },
  { dataIndex: 'projectLocation', title: '项目所在园区、乡镇/街道', width: 200 },
  { dataIndex: 'investmentNature', title: '投资性质', width: 100 },
  { dataIndex: 'id', title: '主键', width: 200 },
];

/** 导出接口返回的 `FileDownloadVo`：支持绝对地址或站内 path + blob 下载 */
async function downloadFileFromExportVo(fileName: string, filePath: string) {
  let fileUrl = filePath;
  const hashIndex = fileUrl.indexOf('#');
  if (hashIndex > -1) fileUrl = fileUrl.substring(0, hashIndex);

  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 100);
    return;
  }

  const normalized = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
  const blob = (await request(normalized, {
    method: 'GET',
    responseType: 'blob',
  })) as unknown as Blob;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'export.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

const ProjectManage = () => {
  const [searchParams] = useSearchParams();
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const columnTitleFromUrl = (searchParams.get('columnTitle') || '').trim();
  const fromPage = (searchParams.get('fromPage') || '').trim();

  const initialPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const initialPageSize = Math.max(1, parseInt(searchParams.get('pageSize') || '10', 10) || 10);

  const isProjectInfoFgList = (searchParams.get('listMode') || '') === LIST_MODE_PROJECT_INFO_FG;

  /** 龙虎榜：仅当 code / columns / 统计期变化时重新请求；发改表：city（区县编码）/ isNewStart / 分页变化时请求 */
  const listLoadKey = useMemo(() => {
    const mode = searchParams.get('listMode');
    if (mode === LIST_MODE_PROJECT_INFO_FG) {
      return [
        'fg',
        searchParams.get('city') ?? '',
        searchParams.get('isNewStart') ?? '',
        searchParams.get('page') ?? '1',
        searchParams.get('pageSize') ?? '10',
      ].join('\0');
    }
    return [
      'lhb',
      searchParams.get('code') ?? '',
      searchParams.get('columns') ?? '',
      searchParams.get('endDate') ?? '',
    ].join('\0');
  }, [searchParams]);

  const [fullList, setFullList] = useState<LhbProjectInfoVo[]>([]);
  const [fgRows, setFgRows] = useState<ProjectInfoFgVo[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialPageSize,
    total: 0,
  });

  const loadList = useCallback(async () => {
    const sp = searchParamsRef.current;
    const pageFromUrl = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1);
    const pageSizeFromUrl = Math.max(1, parseInt(sp.get('pageSize') || '10', 10) || 10);

    if ((sp.get('listMode') || '') === LIST_MODE_PROJECT_INFO_FG) {
      const parsed = parseProjectInfoFgListParams(sp);
      if (!parsed) {
        message.warning('缺少参数 city（区县编码）');
        setFgRows([]);
        setFullList([]);
        setPagination((p) => ({ ...p, total: 0 }));
        return;
      }

      setLoading(true);
      try {
        const res = await primeApi.listProjectInfoFg({
          city: parsed.city,
          isNewStart: parsed.isNewStart,
          page: parsed.page,
          size: parsed.size,
        });
        setFgRows(Array.isArray(res?.records) ? res.records : []);
        setFullList([]);
        setPagination({
          total: typeof res?.total === 'number' ? res.total : 0,
          pageSize: typeof res?.size === 'number' ? res.size : parsed.size,
          current: typeof res?.page === 'number' ? res.page : parsed.page,
        });
      } catch (e) {
        console.error(e);
        message.error('获取发改项目管理表列表失败');
        setFgRows([]);
        setPagination((p) => ({ ...p, total: 0 }));
      } finally {
        setLoading(false);
      }
      return;
    }

    const parsed = parseLongHuBangListParams(sp);
    if (!parsed) {
      const code = (sp.get('code') || '').trim();
      if (!code) message.warning('缺少参数 code（区县编码）');
      else message.warning('缺少或无效参数 columns（列序号）');
      setFullList([]);
      setFgRows([]);
      setPagination((p) => ({ ...p, total: 0 }));
      return;
    }

    setLoading(true);
    try {
      const list = await primeApi.getLongHuBangProjectInfo(parsed);
      const rows = Array.isArray(list) ? list : [];
      setFullList(rows);
      setFgRows([]);
      const total = rows.length;
      const maxPage = Math.max(1, Math.ceil(total / pageSizeFromUrl) || 1);
      setPagination({
        total,
        pageSize: pageSizeFromUrl,
        current: Math.min(pageFromUrl, maxPage),
      });
    } catch (e) {
      console.error(e);
      message.error('获取龙虎榜项目列表失败');
      setFullList([]);
      setPagination((p) => ({ ...p, total: 0 }));
    } finally {
      setLoading(false);
    }
  }, [listLoadKey]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const pageFromSearch = searchParams.get('page');
  const pageSizeFromSearch = searchParams.get('pageSize');

  /** 龙虎榜：URL 仅翻页 / 改每页条数时同步分页状态，不重复请求列表 */
  useEffect(() => {
    if (isProjectInfoFgList) return;
    const page = Math.max(1, parseInt(pageFromSearch || '1', 10) || 1);
    const pageSize = Math.max(1, parseInt(pageSizeFromSearch || '10', 10) || 10);
    setPagination((prev) => {
      if (prev.current === page && prev.pageSize === pageSize) return prev;
      const maxPage = Math.max(1, Math.ceil(prev.total / pageSize) || 1);
      return { ...prev, current: Math.min(page, maxPage), pageSize };
    });
  }, [pageFromSearch, pageSizeFromSearch, fullList.length, isProjectInfoFgList]);

  const pagedData = useMemo(() => {
    if (isProjectInfoFgList) return fgRows;
    const { current, pageSize } = pagination;
    const start = (current - 1) * pageSize;
    return fullList.slice(start, start + pageSize);
  }, [isProjectInfoFgList, fgRows, fullList, pagination.current, pagination.pageSize]);

  const lhbColumns = useMemo<ColumnsType<LhbProjectInfoVo>>(() => {
    const indexCol: ColumnsType<LhbProjectInfoVo>[number] = {
      title: <TitleCom text="序号" icon="/mg/icon1.png" />,
      key: '__index',
      width: 64,
      align: 'center',
      fixed: 'left',
      render: (_: unknown, __: LhbProjectInfoVo, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    };

    const rest: ColumnsType<LhbProjectInfoVo> = LHB_COLUMN_DEFS.map((def) => {
      const base: ColumnsType<LhbProjectInfoVo>[number] = {
        title: <TitleCom text={def.title} icon="/mg/icon7.png" />,
        dataIndex: def.dataIndex,
        key: String(def.dataIndex),
        width: def.width,
        ellipsis: !def.progress,
        align: def.progress || def.numeric ? 'center' : 'left',
      };
      if (def.date) {
        return {
          ...base,
          render: (v: unknown) => formatDateCell(v),
        };
      }
      if (def.numeric) {
        return {
          ...base,
          render: (v: unknown) => formatNumberCell(v),
        };
      }
      if (def.progress) {
        return {
          ...base,
          render: (v: unknown) => progressTagRender(v),
        };
      }
      return {
        ...base,
        render: (v: unknown) => {
          if (v === undefined || v === null || v === '') return '—';
          return String(v);
        },
      };
    });

    return [indexCol, ...rest];
  }, [pagination.current, pagination.pageSize]);

  const fgColumns = useMemo<ColumnsType<ProjectInfoFgVo>>(() => {
    const indexCol: ColumnsType<ProjectInfoFgVo>[number] = {
      title: <TitleCom text="序号" icon="/mg/icon1.png" />,
      key: '__index',
      width: 64,
      align: 'center',
      fixed: 'left',
      render: (_: unknown, __: ProjectInfoFgVo, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    };

    const rest: ColumnsType<ProjectInfoFgVo> = FG_COLUMN_DEFS.map((def) => {
      const base: ColumnsType<ProjectInfoFgVo>[number] = {
        title: <TitleCom text={def.title} icon="/mg/icon7.png" />,
        dataIndex: def.dataIndex,
        key: String(def.dataIndex),
        width: def.width,
        ellipsis: true,
        align: def.numeric ? 'center' : 'left',
      };
      if (def.date) {
        return { ...base, render: (v: unknown) => formatDateCell(v) };
      }
      if (def.numeric) {
        return { ...base, render: (v: unknown) => formatNumberCell(v) };
      }
      if (def.clamp) {
        return {
          ...base,
          ellipsis: { showTitle: false },
          render: (v: unknown) => renderClampText(v, def.width),
        };
      }
      return {
        ...base,
        render: (v: unknown) => {
          if (v === undefined || v === null || v === '') return '—';
          return String(v);
        },
      };
    });

    return [indexCol, ...rest];
  }, [pagination.current, pagination.pageSize]);

  const columns = isProjectInfoFgList ? fgColumns : lhbColumns;

  const handleBack = () => {
    if (fromPage) {
      window.location.assign(fromPage.startsWith('http') ? fromPage : `${window.location.origin}${fromPage}`);
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  };

  const pageHint = isProjectInfoFgList
    ? columnTitleFromUrl !== ''
      ? `穿透指标：${columnTitleFromUrl}`
      : '发改项目管理表（按区县编码筛选）'
    : columnTitleFromUrl !== ''
      ? `穿透指标：${columnTitleFromUrl}`
      : '欢迎使用项目管理模块';

  const handleExport = async () => {
    const sp = searchParamsRef.current;
    if ((sp.get('listMode') || '') === LIST_MODE_PROJECT_INFO_FG) {
      const parsed = parseProjectInfoFgListParams(sp);
      if (!parsed) {
        message.warning('缺少参数 city（区县编码），无法导出');
        return;
      }
      setExporting(true);
      try {
        const res = await primeApi.exportProjectInfoFg({
          city: parsed.city,
          isNewStart: parsed.isNewStart,
        });
        if (!res?.path) {
          message.error('导出失败：未返回文件路径');
          return;
        }
        await downloadFileFromExportVo(res.name || '发改项目管理表.xlsx', res.path);
        message.success('导出成功');
      } catch (e) {
        console.error(e);
        message.error('导出失败');
      } finally {
        setExporting(false);
      }
      return;
    }

    const parsed = parseLongHuBangListParams(sp);
    if (!parsed) {
      const code = (sp.get('code') || '').trim();
      if (!code) message.warning('缺少参数 code（区县编码），无法导出');
      else message.warning('缺少或无效参数 columns（列序号），无法导出');
      return;
    }
    setExporting(true);
    try {
      /** OpenAPI 方法名：对应 GET `/statistic/long-hu-bang-list-export.xlsx` */
      const res = await primeApi.exportProjectJG(parsed);
      if (!res?.path) {
        message.error('导出失败：未返回文件路径');
        return;
      }
      await downloadFileFromExportVo(res.name || '龙虎榜项目列表.xlsx', res.path);
      message.success('导出成功');
    } catch (e) {
      console.error(e);
      message.error('导出失败');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <PageContainer
        style={{
          width: '100%',
          height: '100vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
        }}
        content={pageHint}
      >
        <div style={{ backgroundColor: 'white' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
              paddingTop: 12,
            }}
          >
            <div>
              {fromPage ? (
                <Button type="link" onClick={handleBack} style={{ padding: 0 }}>
                  返回来源页
                </Button>
              ) : null}
            </div>
            <Button type="primary" loading={exporting} onClick={() => void handleExport()}>
              导出 Excel
            </Button>
          </div>
          <Table<LhbProjectInfoVo | ProjectInfoFgVo>
            style={{ marginTop: 12 }}
            rowKey={(r, i) =>
              isProjectInfoFgList
                ? `${(r as ProjectInfoFgVo).id ?? ''}-${(r as ProjectInfoFgVo).projectCode ?? ''}-${i}`
                : `${(r as LhbProjectInfoVo).projectCode ?? ''}-${(r as LhbProjectInfoVo).ltCode ?? ''}-${i}`
            }
            rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
            loading={loading}
            bordered
            size="small"
            columns={columns as ColumnsType<LhbProjectInfoVo | ProjectInfoFgVo>}
            dataSource={pagedData as (LhbProjectInfoVo | ProjectInfoFgVo)[]}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
          <div style={{ marginTop: 16, textAlign: 'right', paddingBottom: 24 }}>
            <Pagination
              showSizeChanger
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showTotal={(t) => `共 ${t} 条`}
              onChange={(page, pageSize) => {
                const nextPs = pageSize ?? pagination.pageSize;
                const q = new URLSearchParams(searchParams);
                q.set('page', String(page));
                q.set('pageSize', String(nextPs));
                history.replace(`/report-center/project-digital-list?${q.toString()}`);
                if (!isProjectInfoFgList) {
                  setPagination((prev) => ({ ...prev, current: page, pageSize: nextPs }));
                }
              }}
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default ProjectManage;
