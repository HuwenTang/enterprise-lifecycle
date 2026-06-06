#!/usr/bin/env ts-node
// 用法: npx ts-node scripts/gen-page.ts <config.json>
// 示例: npx ts-node scripts/gen-page.ts scripts/gen-page.example.json

import * as fs from 'fs';
import * as path from 'path';

// ─── 配置类型 ────────────────────────────────────────────────────────────────

type FieldInputType =
  | 'input'       // Input 文本框
  | 'select'      // 单选 Select
  | 'boolSelect'  // 是/否 Select
  | 'multiSelect' // 多选 Select
  | 'dateRange'   // DatePicker.RangePicker
  | 'number'      // InputNumber
  | 'district'    // 所属市（区）— 自动联动 park
  | 'park';       // 所属板块 — 需与 district 配合

interface SelectOption {
  value: string | boolean | number;
  label: string;
}

interface SearchField {
  name: string;
  label: string;
  type: FieldInputType;
  options?: SelectOption[];
  apiParam?: string;   // API 参数名（默认与 name 相同）
}

interface ColumnConfig {
  title: string;
  dataIndex: string;
  width?: number;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
}

interface PageConfig {
  pageName: string;           // 组件名，如 "ProjectManage11"
  pageTitle: string;          // 页面标题
  outputDir?: string;         // 输出目录（默认 src/pages/{pageName}）
  apiModule?: string;         // API 模块（默认 "primeApi"）
  listApiFunc: string;        // 列表接口函数名
  listRequestType: string;    // 列表请求 TypeScript 类型名
  exportApiFunc?: string;     // 导出接口函数名（有值则自动加导出按钮）
  exportFileName?: string;    // 默认导出文件名
  searchFields: SearchField[];
  moreSearchFields?: SearchField[];
  tableColumns: ColumnConfig[];
}

// ─── 工具函数 ────────────────────────────────────────────────────────────────

function allFields(config: PageConfig): SearchField[] {
  return [...config.searchFields, ...(config.moreSearchFields ?? [])];
}

function hasType(fields: SearchField[], ...types: FieldInputType[]): boolean {
  return fields.some((f) => types.includes(f.type));
}

function optionsLiteral(options: SelectOption[]): string {
  return options
    .map((o) => {
      const v = typeof o.value === 'string' ? `'${o.value}'` : o.value;
      return `{ value: ${v}, label: '${o.label}' }`;
    })
    .join(', ');
}

function groupIntoRows<T>(items: T[], perRow = 4): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += perRow) {
    rows.push(items.slice(i, i + perRow));
  }
  return rows;
}

// ─── 片段生成 ────────────────────────────────────────────────────────────────

function genFieldType(fields: SearchField[]): string {
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const f of fields) {
    const key = f.type === 'district' ? 'district' : f.type === 'park' ? 'park' : f.name;
    if (seen.has(key)) continue;
    seen.add(key);
    switch (f.type) {
      case 'input':
      case 'select':
        lines.push(`  ${f.name}?: string;`);
        break;
      case 'boolSelect':
        lines.push(`  ${f.name}?: boolean;`);
        break;
      case 'multiSelect':
        lines.push(`  ${f.name}?: string[];`);
        break;
      case 'dateRange':
        lines.push(`  ${f.name}?: [dayjs.Dayjs, dayjs.Dayjs];`);
        break;
      case 'number':
        lines.push(`  ${f.name}?: number;`);
        break;
      case 'district':
        lines.push(`  district?: string;`);
        break;
      case 'park':
        lines.push(`  park?: string;`);
        break;
    }
  }
  return `type FieldType = {\n${lines.join('\n')}\n};`;
}

function genApiFilters(fields: SearchField[], requestType: string): string {
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const f of fields) {
    const api = f.apiParam ?? f.name;
    const key = f.type === 'district' ? 'district' : f.type === 'park' ? 'park' : api;
    if (seen.has(key)) continue;
    seen.add(key);
    switch (f.type) {
      case 'input':
      case 'select':
        lines.push(`    ${api}: values.${f.name} || undefined,`);
        break;
      case 'boolSelect':
        lines.push(`    ${api}: values.${f.name},`);
        break;
      case 'multiSelect':
        lines.push(`    ${api}: values.${f.name}?.length ? values.${f.name} : undefined,`);
        break;
      case 'dateRange':
        lines.push(`    ${api}Start: values.${f.name}?.[0]?.format('YYYY-MM-DD'),`);
        lines.push(`    ${api}End: values.${f.name}?.[1]?.format('YYYY-MM-DD'),`);
        break;
      case 'number':
        lines.push(`    ${api}: values.${f.name},`);
        break;
      case 'district':
        lines.push(`    district: values.district || undefined,`);
        break;
      case 'park':
        lines.push(`    park: values.park || undefined,`);
        break;
    }
  }
  return (
    `function buildListApiFilters(values: FieldType): Omit<${requestType}, 'page' | 'size'> {\n` +
    `  return {\n${lines.join('\n')}\n  } as Omit<${requestType}, 'page' | 'size'>;\n}`
  );
}

function genUrlParams(fields: SearchField[]): string {
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const f of fields) {
    const key = f.type === 'district' ? 'district' : f.type === 'park' ? 'park' : f.name;
    if (seen.has(key)) continue;
    seen.add(key);
    switch (f.type) {
      case 'input':
        lines.push(`    ${f.name}: p.get('${f.name}') || '',`);
        break;
      case 'select':
        lines.push(`    ${f.name}: p.get('${f.name}') || undefined,`);
        break;
      case 'boolSelect':
        lines.push(
          `    ${f.name}: p.get('${f.name}') === null ? undefined : p.get('${f.name}') === 'true',`,
        );
        break;
      case 'multiSelect':
        lines.push(`    ${f.name}: p.get('${f.name}')?.split(',') ?? [],`);
        break;
      case 'dateRange':
        lines.push(`    ${f.name}Start: p.get('${f.name}Start') || undefined,`);
        lines.push(`    ${f.name}End: p.get('${f.name}End') || undefined,`);
        break;
      case 'number':
        lines.push(
          `    ${f.name}: p.get('${f.name}') ? Number(p.get('${f.name}')) : undefined,`,
        );
        break;
      case 'district':
        lines.push(`    district: p.get('district') || undefined,`);
        break;
      case 'park':
        lines.push(`    park: p.get('park') || undefined,`);
        break;
    }
  }
  return (
    `  const urlParams = useMemo(() => {\n` +
    `    const p = searchParams;\n` +
    `    return {\n${lines.join('\n')}\n` +
    `      page: parseInt(p.get('page') || '1', 10),\n` +
    `      pageSize: parseInt(p.get('pageSize') || '10', 10),\n` +
    `    };\n  }, []);`
  );
}

function genSetFieldValues(fields: SearchField[]): string {
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const f of fields) {
    const key = f.type === 'district' ? 'district' : f.type === 'park' ? 'park' : f.name;
    if (seen.has(key)) continue;
    seen.add(key);
    if (f.type === 'dateRange') {
      lines.push(
        `      ${f.name}: urlParams.${f.name}Start && urlParams.${f.name}End\n` +
        `        ? [dayjs(urlParams.${f.name}Start), dayjs(urlParams.${f.name}End)] as [dayjs.Dayjs, dayjs.Dayjs] : undefined,`,
      );
    } else {
      lines.push(`      ${key}: urlParams.${key},`);
    }
  }
  return `    form.setFieldsValue({\n${lines.join('\n')}\n    });`;
}

function genUpdateUrl(fields: SearchField[]): string {
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const f of fields) {
    const key = f.type === 'district' ? 'district' : f.type === 'park' ? 'park' : f.name;
    if (seen.has(key)) continue;
    seen.add(key);
    switch (f.type) {
      case 'input':
        lines.push(`      ${f.name}: values.${f.name} || '',`);
        break;
      case 'select':
        lines.push(`      ${f.name}: values.${f.name} || '',`);
        break;
      case 'boolSelect':
        lines.push(
          `      ${f.name}: values.${f.name} === true || values.${f.name} === false ? values.${f.name} : null,`,
        );
        break;
      case 'multiSelect':
        lines.push(`      ${f.name}: values.${f.name} ?? [],`);
        break;
      case 'dateRange':
        lines.push(
          `      ${f.name}Start: values.${f.name}?.[0]?.format('YYYY-MM-DD') ?? '',`,
        );
        lines.push(
          `      ${f.name}End: values.${f.name}?.[1]?.format('YYYY-MM-DD') ?? '',`,
        );
        break;
      case 'number':
        lines.push(
          `      ${f.name}: values.${f.name} != null ? String(values.${f.name}) : '',`,
        );
        break;
      case 'district':
        lines.push(`      district: values.district || '',`);
        break;
      case 'park':
        lines.push(`      park: values.park || '',`);
        break;
    }
  }
  return lines.join('\n');
}

function genResetParams(fields: SearchField[]): string {
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const f of fields) {
    const key = f.type === 'district' ? 'district' : f.type === 'park' ? 'park' : f.name;
    if (seen.has(key)) continue;
    seen.add(key);
    switch (f.type) {
      case 'multiSelect':
        lines.push(`      ${f.name}: [],`);
        break;
      case 'dateRange':
        lines.push(`      ${f.name}Start: '', ${f.name}End: '',`);
        break;
      case 'boolSelect':
        lines.push(`      ${f.name}: null,`);
        break;
      default:
        lines.push(`      ${key}: '',`);
    }
  }
  return lines.join('\n');
}

function genFormItem(f: SearchField): string {
  const label = f.label;
  const name = f.name;
  switch (f.type) {
    case 'input':
      return [
        `                <Col span={6}>`,
        `                  <Form.Item<FieldType> label="${label}" name="${name}">`,
        `                    <Input allowClear />`,
        `                  </Form.Item>`,
        `                </Col>`,
      ].join('\n');
    case 'select': {
      const opts = f.options ? optionsLiteral(f.options) : '';
      return [
        `                <Col span={6}>`,
        `                  <Form.Item<FieldType> label="${label}" name="${name}">`,
        `                    <Select allowClear placeholder="全部" options={[${opts}]} />`,
        `                  </Form.Item>`,
        `                </Col>`,
      ].join('\n');
    }
    case 'boolSelect':
      return [
        `                <Col span={6}>`,
        `                  <Form.Item<FieldType> label="${label}" name="${name}">`,
        `                    <Select allowClear placeholder="全部" options={[{ value: true, label: '是' }, { value: false, label: '否' }]} />`,
        `                  </Form.Item>`,
        `                </Col>`,
      ].join('\n');
    case 'multiSelect': {
      const opts = f.options ? optionsLiteral(f.options) : '';
      return [
        `                <Col span={6}>`,
        `                  <Form.Item<FieldType> label="${label}" name="${name}">`,
        `                    <Select mode="multiple" options={[${opts}]} maxTagCount="responsive" />`,
        `                  </Form.Item>`,
        `                </Col>`,
      ].join('\n');
    }
    case 'dateRange':
      return [
        `                <Col span={6}>`,
        `                  <Form.Item<FieldType> label="${label}" name="${name}">`,
        `                    <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear />`,
        `                  </Form.Item>`,
        `                </Col>`,
      ].join('\n');
    case 'number':
      return [
        `                <Col span={6}>`,
        `                  <Form.Item<FieldType> label="${label}" name="${name}">`,
        `                    <InputNumber style={{ width: '100%' }} />`,
        `                  </Form.Item>`,
        `                </Col>`,
      ].join('\n');
    case 'district':
      return [
        `                <Col span={6}>`,
        `                  <Form.Item<FieldType> label="所属市（区）" name="district">`,
        `                    <Select allowClear showSearch placeholder="全部" optionFilterProp="label" options={districtOptions}`,
        `                      onChange={(v) => { updateParkByDistrict(v); form.setFieldValue('park', undefined); }} />`,
        `                  </Form.Item>`,
        `                </Col>`,
      ].join('\n');
    case 'park':
      return [
        `                <Col span={6}>`,
        `                  <Form.Item<FieldType> label="所属板块" name="park">`,
        `                    <Select allowClear showSearch optionFilterProp="label"`,
        `                      placeholder={searchParkOptions.length ? '请选择所属板块' : '请先选择所属市'}`,
        `                      options={searchParkOptions} />`,
        `                  </Form.Item>`,
        `                </Col>`,
      ].join('\n');
  }
}

function genSearchSection(fields: SearchField[]): string {
  const items = fields.map(genFormItem);
  const rows = groupIntoRows(items, 4);
  return rows
    .map((row) => `              <Row gutter={16}>\n${row.join('\n')}\n              </Row>`)
    .join('\n');
}

// ─── 主生成函数 ──────────────────────────────────────────────────────────────

function generatePage(config: PageConfig): { indexTsx: string; columnsTsx: string } {
  const apiModule = config.apiModule ?? 'primeApi';
  const fields = allFields(config);
  const hasDistrictField = hasType(fields, 'district', 'park');
  const hasDateRangeField = hasType(fields, 'dateRange');
  const hasInputField = hasType(fields, 'input');
  const hasNumberField = hasType(fields, 'number');
  const hasMore = (config.moreSearchFields?.length ?? 0) > 0;
  const hasExport = !!config.exportApiFunc;
  const exportFn = config.exportApiFunc ?? '';
  const exportFileName = config.exportFileName ?? `${config.pageTitle}.xlsx`;

  const antdImports = [
    'Button', 'Col', 'Form', 'FormProps', 'message', 'Pagination', 'Row', 'Select', 'Space', 'Table',
  ];
  if (hasInputField) antdImports.push('Input');
  if (hasDateRangeField) antdImports.push('DatePicker');
  if (hasNumberField) antdImports.push('InputNumber');
  antdImports.sort();

  const lines: string[] = [];

  // imports
  lines.push(`import { usePersistedMoreSearch } from '@/hooks/usePersistedMoreSearch';`);
  if (hasDistrictField) {
    lines.push(`import { useDistrictParkOptions } from '@/hooks/useDistrictParkOptions';`);
  }
  lines.push(`import { ${apiModule} } from '@/services/api';`);
  lines.push(`import type { ${config.listRequestType} } from '@/services/apis';`);
  lines.push(`import { PageContainer } from '@ant-design/pro-components';`);
  lines.push(`import {\n  ${antdImports.join(', ')},\n} from 'antd';`);
  if (hasDateRangeField) lines.push(`import dayjs from 'dayjs';`);
  lines.push(`import { useEffect, useMemo, useState } from 'react';`);
  lines.push(`import { useSearchParams } from 'react-router-dom';`);
  lines.push(`import { buildColumns } from './columns';`);
  lines.push('');
  if (hasDateRangeField) {
    lines.push(`const { RangePicker } = DatePicker;`);
    lines.push('');
  }

  // FieldType + buildListApiFilters
  lines.push(genFieldType(fields));
  lines.push('');
  lines.push(genApiFilters(fields, config.listRequestType));
  lines.push('');

  // component start
  lines.push(`const ${config.pageName} = () => {`);
  lines.push(`  const [form] = Form.useForm<FieldType>();`);
  lines.push(`  const [searchParams, setSearchParams] = useSearchParams();`);
  lines.push(`  const [showMoreSearch, setShowMoreSearchPersist] = usePersistedMoreSearch();`);

  if (hasDistrictField) {
    lines.push('');
    lines.push(`  const {`);
    lines.push(`    districtOptions,`);
    lines.push(`    parkOptions: searchParkOptions,`);
    lines.push(`    load: loadDistrictPark,`);
    lines.push(`    updateParkByDistrict,`);
    lines.push(`    inferDistrictByPark,`);
    lines.push(`    fullDistrictOpts,`);
    lines.push(`  } = useDistrictParkOptions();`);
  }

  lines.push('');
  lines.push(`  const [dataSource, setDataSource] = useState<any[]>([]);`);
  lines.push(`  const [loading, setLoading] = useState(false);`);
  if (hasExport) lines.push(`  const [exporting, setExporting] = useState(false);`);
  lines.push(`  const [pagination, setPagination] = useState({`);
  lines.push(`    current: parseInt(searchParams.get('page') || '1', 10),`);
  lines.push(`    pageSize: parseInt(searchParams.get('pageSize') || '10', 10),`);
  lines.push(`    total: 0,`);
  lines.push(`  });`);
  lines.push('');

  // urlParams
  lines.push(genUrlParams(fields));
  lines.push('');

  // updateUrlParams
  lines.push(
    `  const updateUrlParams = (params: Record<string, string | number | boolean | string[] | null | undefined>) => {`,
  );
  lines.push(`    const next = new URLSearchParams(searchParams);`);
  lines.push(`    for (const [key, value] of Object.entries(params)) {`);
  lines.push(`      if (value === undefined) continue;`);
  lines.push(
    `      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {`,
  );
  lines.push(`        next.delete(key);`);
  lines.push(`      } else if (Array.isArray(value)) {`);
  lines.push(`        next.set(key, value.join(','));`);
  lines.push(`      } else {`);
  lines.push(`        next.set(key, String(value));`);
  lines.push(`      }`);
  lines.push(`    }`);
  lines.push(`    setSearchParams(next);`);
  lines.push(`  };`);
  lines.push('');

  // fetchData
  lines.push(
    `  const fetchData = async (params: ${config.listRequestType}) => {`,
  );
  lines.push(`    setLoading(true);`);
  lines.push(`    try {`);
  lines.push(
    `      const data = await ${apiModule}.${config.listApiFunc}(params);`,
  );
  lines.push(
    `      setPagination((prev) => ({ ...prev, total: data.total, current: data.page, pageSize: data.size }));`,
  );
  lines.push(`      setDataSource(data.records ?? []);`);
  lines.push(`    } catch {`);
  lines.push(`      message.error('获取数据失败');`);
  lines.push(`    } finally {`);
  lines.push(`      setLoading(false);`);
  lines.push(`    }`);
  lines.push(`  };`);
  lines.push('');

  // getListRequestParams
  lines.push(
    `  const getListRequestParams = (page: number, size: number): ${config.listRequestType} => {`,
  );
  lines.push(`    const v = form.getFieldsValue(true) as FieldType;`);
  lines.push(
    `    return { ...buildListApiFilters(v), page, size } as ${config.listRequestType};`,
  );
  lines.push(`  };`);
  lines.push('');

  // useEffect init
  lines.push(`  useEffect(() => {`);
  if (hasDistrictField) lines.push(`    loadDistrictPark();`);
  lines.push('');
  lines.push(genSetFieldValues(fields));
  lines.push('');
  lines.push(`    fetchData(getListRequestParams(urlParams.page, urlParams.pageSize));`);
  lines.push(`  }, []); // eslint-disable-line react-hooks/exhaustive-deps`);

  // useEffect district sync
  if (hasDistrictField) {
    lines.push('');
    lines.push(`  useEffect(() => {`);
    lines.push(`    if (!fullDistrictOpts.length) return;`);
    lines.push(`    let districtVal = urlParams.district;`);
    lines.push(`    if (!districtVal && urlParams.park) {`);
    lines.push(`      districtVal = inferDistrictByPark(urlParams.park);`);
    lines.push(`      if (districtVal) form.setFieldValue('district', districtVal);`);
    lines.push(`    }`);
    lines.push(`    updateParkByDistrict(districtVal || undefined);`);
    lines.push(`  }, [fullDistrictOpts]); // eslint-disable-line react-hooks/exhaustive-deps`);
  }

  // onFinish
  lines.push('');
  lines.push(`  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {`);
  lines.push(`    updateUrlParams({`);
  lines.push(`      page: 1,`);
  lines.push(`      pageSize: pagination.pageSize,`);
  lines.push(genUpdateUrl(fields));
  lines.push(`    });`);
  lines.push(`    setPagination((prev) => ({ ...prev, current: 1 }));`);
  lines.push(`    fetchData(getListRequestParams(1, pagination.pageSize));`);
  lines.push(`  };`);

  // handleReset
  lines.push('');
  lines.push(`  const handleReset = () => {`);
  lines.push(`    form.resetFields();`);
  if (hasDistrictField) lines.push(`    updateParkByDistrict(undefined);`);
  lines.push(`    updateUrlParams({`);
  lines.push(`      page: 1, pageSize: 10,`);
  lines.push(genResetParams(fields));
  lines.push(`    });`);
  lines.push(`    setPagination((prev) => ({ ...prev, current: 1, pageSize: 10 }));`);
  lines.push(
    `    fetchData({ page: 1, size: 10 } as ${config.listRequestType});`,
  );
  lines.push(`  };`);

  // handleExport
  if (hasExport) {
    lines.push('');
    lines.push(`  const handleExport = async () => {`);
    lines.push(`    try {`);
    lines.push(`      setExporting(true);`);
    lines.push(
      `      const filters = buildListApiFilters(form.getFieldsValue(true) as FieldType);`,
    );
    lines.push(`      const res = await ${apiModule}.${exportFn}(filters as any);`);
    lines.push(
      `      if (!res?.path) { message.error('导出失败：未获取到文件路径'); return; }`,
    );
    lines.push(
      `      const fileUrl = res.path.startsWith('http') ? res.path : '/' + res.path.replace(/^\\//, '');`,
    );
    lines.push(`      const a = Object.assign(document.createElement('a'), {`);
    lines.push(
      `        href: fileUrl, download: res.name || '${exportFileName}', target: '_blank', style: { display: 'none' },`,
    );
    lines.push(`      });`);
    lines.push(`      document.body.appendChild(a);`);
    lines.push(`      a.click();`);
    lines.push(`      setTimeout(() => document.body.removeChild(a), 100);`);
    lines.push(`      message.success('导出成功');`);
    lines.push(`    } catch {`);
    lines.push(`      message.error('导出失败');`);
    lines.push(`    } finally {`);
    lines.push(`      setExporting(false);`);
    lines.push(`    }`);
    lines.push(`  };`);
  }

  // handlePageChange
  lines.push('');
  lines.push(`  const handlePageChange = (page: number, pageSize: number) => {`);
  lines.push(`    updateUrlParams({ page, pageSize });`);
  lines.push(
    `    setPagination((prev) => ({ ...prev, current: page, pageSize }));`,
  );
  lines.push(`    fetchData(getListRequestParams(page, pageSize));`);
  lines.push(`  };`);

  // columns
  lines.push('');
  lines.push(`  const columns = useMemo(`);
  lines.push(`    () => buildColumns({ pagination }),`);
  lines.push(`    [pagination.current], // eslint-disable-line react-hooks/exhaustive-deps`);
  lines.push(`  );`);

  // JSX
  lines.push('');
  lines.push(`  return (`);
  lines.push(`    <div style={{ display: 'flex', minWidth: 0, width: '100%' }}>`);
  lines.push(`      <PageContainer`);
  lines.push(
    `        style={{ width: '100%', minWidth: 0, height: '90vh', overflow: 'auto', scrollbarWidth: 'none' }}`,
  );
  lines.push(`        content="${config.pageTitle}"`);
  lines.push(`      >`);
  lines.push(
    `        <div style={{ padding: 20, backgroundColor: 'white', boxSizing: 'border-box', width: '100%' }}>`,
  );
  lines.push(
    `          <div style={{ padding: 20, backgroundImage: 'url(/pm-bg1.png)', backgroundSize: '100% 100%' }}>`,
  );
  lines.push(`            <SectionTitle>查询</SectionTitle>`);
  lines.push(`            <Form`);
  lines.push(`              form={form}`);
  lines.push(`              layout="horizontal"`);
  lines.push(`              name="basic"`);
  lines.push(`              onFinish={onFinish}`);
  lines.push(`              autoComplete="off"`);
  lines.push(`            >`);
  lines.push(genSearchSection(config.searchFields));
  if (hasMore) {
    lines.push(`              <div style={{ display: showMoreSearch ? 'block' : 'none' }}>`);
    lines.push(genSearchSection(config.moreSearchFields!));
    lines.push(`              </div>`);
  }
  lines.push(`              <Row>`);
  lines.push(`                <Col span={24} style={{ textAlign: 'center' }}>`);
  lines.push(`                  <Form.Item style={{ marginBottom: 0 }}>`);
  lines.push(`                    <Space>`);
  lines.push(`                      <Button type="primary" htmlType="submit">查询</Button>`);
  if (hasMore) {
    lines.push(
      `                      <Button onClick={() => setShowMoreSearchPersist((p) => !p)}>`,
    );
    lines.push(`                        {showMoreSearch ? '收起查询' : '更多查询'}`);
    lines.push(`                      </Button>`);
  }
  lines.push(`                      <Button onClick={handleReset}>重置</Button>`);
  if (hasExport) {
    lines.push(
      `                      <Button loading={exporting} onClick={handleExport}>导出</Button>`,
    );
  }
  lines.push(`                    </Space>`);
  lines.push(`                  </Form.Item>`);
  lines.push(`                </Col>`);
  lines.push(`              </Row>`);
  lines.push(`            </Form>`);
  lines.push(`          </div>`);
  lines.push('');
  lines.push(
    `          <div style={{ marginTop: 20, width: '100%', overflowX: 'auto' }}>`,
  );
  lines.push(`            <Table`);
  lines.push(`              tableLayout="fixed"`);
  lines.push(`              scroll={{ x: 'max-content' }}`);
  lines.push(
    `              rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}`,
  );
  lines.push(`              columns={columns}`);
  lines.push(`              bordered`);
  lines.push(`              dataSource={dataSource}`);
  lines.push(`              pagination={false}`);
  lines.push(`              loading={loading}`);
  lines.push(`            />`);
  lines.push(`          </div>`);
  lines.push('');
  lines.push(`          <Pagination`);
  lines.push(`            showSizeChanger={false}`);
  lines.push(`            current={pagination.current}`);
  lines.push(`            pageSize={pagination.pageSize}`);
  lines.push(`            showTotal={(total) => \`共 \${total} 条\`}`);
  lines.push(`            total={pagination.total}`);
  lines.push(`            onChange={handlePageChange}`);
  lines.push(`            style={{ marginTop: 16 }}`);
  lines.push(`          />`);
  lines.push(`        </div>`);
  lines.push(`      </PageContainer>`);
  lines.push(`    </div>`);
  lines.push(`  );`);
  lines.push(`};`);

  // SectionTitle
  lines.push('');
  lines.push(`function SectionTitle({ children }: { children: React.ReactNode }) {`);
  lines.push(`  return (`);
  lines.push(`    <div style={{ display: 'flex', marginBottom: 20 }}>`);
  lines.push(
    `      <div style={{ marginRight: 10, width: 5, height: 16, background: '#005BF5', borderRadius: 2.5 }} />`,
  );
  lines.push(
    `      <div style={{ fontSize: 16, fontWeight: 'bolder' }}>{children}</div>`,
  );
  lines.push(`    </div>`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push('');
  lines.push(`export default ${config.pageName};`);
  lines.push('');

  const indexTsx = lines.join('\n');

  // ─── columns.tsx ────────────────────────────────────────────────────────────

  const colLines: string[] = [];
  colLines.push(`import type { TableColumnsType } from 'antd';`);
  colLines.push('');
  colLines.push(`interface BuildColumnsOptions {`);
  colLines.push(`  pagination: { current: number };`);
  colLines.push(`}`);
  colLines.push('');
  colLines.push(
    `export function buildColumns({ pagination }: BuildColumnsOptions): TableColumnsType<any> {`,
  );
  colLines.push(`  const offset = (pagination.current - 1) * 10;`);
  colLines.push(`  void offset;`);
  colLines.push(`  return [`);
  for (const col of config.tableColumns) {
    const parts: string[] = [`title: '${col.title}'`, `dataIndex: '${col.dataIndex}'`];
    if (col.width) parts.push(`width: ${col.width}`);
    if (col.fixed) parts.push(`fixed: '${col.fixed}'`);
    if (col.ellipsis) parts.push(`ellipsis: true`);
    colLines.push(`    { ${parts.join(', ')} },`);
  }
  colLines.push(`  ];`);
  colLines.push(`}`);
  colLines.push('');

  const columnsTsx = colLines.join('\n');

  return { indexTsx, columnsTsx };
}

// ─── CLI 入口 ─────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const configPath = args[0];

  if (!configPath) {
    console.error('用法: npx ts-node scripts/gen-page.ts <config.json>');
    console.error('示例: npx ts-node scripts/gen-page.ts scripts/gen-page.example.json');
    process.exit(1);
  }

  const absConfig = path.resolve(configPath);
  if (!fs.existsSync(absConfig)) {
    console.error(`配置文件不存在: ${absConfig}`);
    process.exit(1);
  }

  const config: PageConfig = JSON.parse(fs.readFileSync(absConfig, 'utf-8'));

  if (!config.pageName || !config.listApiFunc || !config.listRequestType) {
    console.error('配置文件缺少必填字段: pageName / listApiFunc / listRequestType');
    process.exit(1);
  }

  const root = path.resolve(__dirname, '..');
  const outputDir = path.resolve(root, config.outputDir ?? `src/pages/${config.pageName}`);

  if (fs.existsSync(path.join(outputDir, 'index.tsx'))) {
    console.error(`目录已存在: ${outputDir}`);
    console.error('如需覆盖，请先手动删除目标目录。');
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const { indexTsx, columnsTsx } = generatePage(config);

  fs.writeFileSync(path.join(outputDir, 'index.tsx'), indexTsx, 'utf-8');
  fs.writeFileSync(path.join(outputDir, 'columns.tsx'), columnsTsx, 'utf-8');

  console.log(`生成完成:`);
  console.log(`  ${path.join(outputDir, 'index.tsx')}`);
  console.log(`  ${path.join(outputDir, 'columns.tsx')}`);
}

main();
