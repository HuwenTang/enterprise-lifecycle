# 页面模板生成器

根据 JSON 配置一键生成符合项目规范的页面骨架，包含搜索筛选、表格列表、分页、导出等完整结构。

## 快速开始

```bash
# 1. 复制示例配置
cp scripts/gen-page.example.json scripts/my-page.json

# 2. 编辑配置文件（见下方说明）

# 3. 运行生成器
npm run gen-page scripts/my-page.json
```

生成结果：

```
src/pages/{pageName}/
  ├── index.tsx    ← 完整页面组件
  └── columns.tsx  ← 表格列定义骨架
```

---

## 配置文件说明

### 顶层字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|:---:|---|
| `pageName` | string | ✅ | 组件名，PascalCase，同时作为输出目录名。如 `"ProjectManage11"` |
| `pageTitle` | string | ✅ | 页面标题，显示在 PageContainer 的 content 属性 |
| `outputDir` | string | — | 自定义输出目录，默认 `src/pages/{pageName}` |
| `apiModule` | string | — | API 模块变量名，默认 `"primeApi"` |
| `listApiFunc` | string | ✅ | 列表接口函数名，如 `"listProjectDigitalInvestmentAttracting"` |
| `listRequestType` | string | ✅ | 列表请求的 TypeScript 类型名，如 `"ListProjectDigitalInvestmentAttractingRequest"` |
| `exportApiFunc` | string | — | 导出接口函数名，填写后自动生成导出按钮和导出逻辑 |
| `exportFileName` | string | — | 默认导出文件名，如 `"新项目管理.xlsx"` |
| `searchFields` | Field[] | ✅ | 主搜索区字段（始终可见） |
| `moreSearchFields` | Field[] | — | 「更多查询」折叠区字段（点击展开） |
| `tableColumns` | Column[] | ✅ | 表格列配置 |

---

### 搜索字段（Field）

```jsonc
{
  "name": "projectName",   // 字段名，camelCase，对应 FieldType 和 Form.Item 的 name
  "label": "项目名称",      // 表单标签文字
  "type": "input",         // 字段类型，见下方类型列表
  "options": [...],        // 仅 select / multiSelect 需要
  "apiParam": "name"       // API 参数名，默认与 name 相同
}
```

#### 支持的字段类型

| type | 渲染组件 | 说明 |
|---|---|---|
| `input` | `Input` | 普通文本输入框 |
| `select` | `Select` | 单选下拉，需配置 `options` |
| `boolSelect` | `Select` | 是/否下拉，自动生成两个选项，无需配置 `options` |
| `multiSelect` | `Select mode="multiple"` | 多选下拉，需配置 `options` |
| `dateRange` | `DatePicker.RangePicker` | 日期范围选择 |
| `number` | `InputNumber` | 数字输入框 |
| `district` | `Select`（联动） | 所属市（区），自动与 `park` 字段联动 |
| `park` | `Select`（联动） | 所属板块，依赖 `district` 字段联动 |

> `district` 和 `park` 需同时配置才能正常联动。

#### options 格式

```jsonc
"options": [
  { "value": "1",  "label": "内资" },
  { "value": "2",  "label": "外资" },
  { "value": true, "label": "是"   }   // value 也可以是 boolean 或 number
]
```

---

### 表格列（Column）

```jsonc
{
  "title": "项目名称",          // 列标题
  "dataIndex": "projectName",  // 数据字段名
  "width": 200,                // 列宽（可选）
  "fixed": "left",             // 固定列："left" | "right"（可选）
  "ellipsis": true             // 超长文字省略（可选）
}
```

---

## 完整配置示例

```json
{
  "pageName": "ProjectManage11",
  "pageTitle": "新项目管理",
  "apiModule": "primeApi",
  "listApiFunc": "listProjectDigitalInvestmentAttracting",
  "listRequestType": "ListProjectDigitalInvestmentAttractingRequest",
  "exportApiFunc": "exportProjectInfo",
  "exportFileName": "新项目管理.xlsx",

  "searchFields": [
    { "name": "projectName",    "label": "项目名称", "type": "input" },
    { "name": "projectContent", "label": "项目内容", "type": "input" },
    {
      "name": "investmentFlag",
      "label": "项目类别",
      "type": "select",
      "options": [
        { "value": "1", "label": "内资" },
        { "value": "2", "label": "外资" }
      ]
    },
    { "name": "district", "label": "所属市（区）", "type": "district" },
    { "name": "park",     "label": "所属板块",     "type": "park"     }
  ],

  "moreSearchFields": [
    { "name": "investor",         "label": "投资方名称",   "type": "input"     },
    { "name": "isListedProject",  "label": "是否列统项目", "type": "boolSelect" },
    { "name": "signingDateRange", "label": "签约时间",     "type": "dateRange"  }
  ],

  "tableColumns": [
    { "title": "序号",     "dataIndex": "index",       "width": 60,  "fixed": "left" },
    { "title": "项目名称", "dataIndex": "projectName", "width": 200, "ellipsis": true },
    { "title": "投资方",   "dataIndex": "investor",    "width": 150 },
    { "title": "项目状态", "dataIndex": "currentProjectProgress", "width": 120 }
  ]
}
```

---

## 生成后的工作

生成器只输出骨架，以下部分需要手工完善：

**columns.tsx**
- 为需要格式化展示的列添加 `render` 函数
- 序号列补充 `render: (_, __, index) => offset + index + 1`

**index.tsx**
- 在 `buildListApiFilters` 中补充实际 API 参数名（如果与字段名不同）
- 在 `useEffect` 中按需添加字典数据加载（参考现有页面的 `getDictItems` 调用）
- 将页面注册到路由配置（`config/routes.ts`）

---

## 注意事项

- 目标目录已存在 `index.tsx` 时，生成器会报错退出，不会覆盖已有文件
- `district` 和 `park` 字段共享同一个 hook，配置文件中两者顺序不影响联动效果
- `apiParam` 字段用于字段名与 API 参数名不一致的情况，例如表单字段名 `signingDateRange` 对应 API 参数 `actualSigningTime`
