import type { UploadFile } from 'antd/es/upload/interface';
import type { FileDownloadVo } from '@/services/apis/models/FileDownloadVo';

/**
 * 下载报 SignatureDoesNotMatch：MinIO/S3 预签名的 X-Amz-Signature 与「完整 URL 含 query」绑定。
 * 若生成链接时在 response-content-disposition 中错误拼接中文文件名（双重编码、多出 ]" 等），
 * 或存库/JSON 传输导致 query 被截断、改写，都会验签失败——需后端修正预签名生成，或提供经网关的统一下载接口。
 */

/** 佐证存储：URL + 可选原始文件名（与上传一致，避免仅 URL 时列表显示哈希名） */
export interface ZzclFileItem {
  /** 由于后端要求上传提交时不再提供 url，而是提供 path（且 path 已含签名参数），这里统一使用 path */
  path: string;
  name?: string;
  /** 上传接口可能同时返回 url（可选，仅用于回显/展示，不参与业务提交） */
  url?: string;
}

/**
 * 接口返回的 fileName/name 常为 encodeURIComponent 后的 ASCII；展示前解码为中文。
 * 兼容偶然的双重编码（如 %25E6...）。
 */
export function decodeDisplayFileName(raw: string | undefined | null): string {
  if (raw === null || raw === undefined) return '';
  let s = String(raw).trim();
  if (!s) return '';
  for (let i = 0; i < 2; i += 1) {
    try {
      const next = decodeURIComponent(s);
      if (next === s) break;
      s = next;
    } catch {
      break;
    }
  }
  return s;
}

export function fileLabelFromUrl(url: string): string {
  const seg = url.split('/').pop()?.split('?')[0] || '';
  if (!seg) return '附件';
  try {
    return decodeURIComponent(seg) || '附件';
  } catch {
    return seg || '附件';
  }
}

function normalizeOneZzclEntry(x: unknown): ZzclFileItem | null {
  if (x === null || x === undefined) return null;
  if (typeof x === 'string') {
    const s = x.trim();
    if (!s) return null;
    // 后端/前端约定：Array<string> 里的每个 string 可能是 JSON 对象串 {path,url,name}
    if (s.startsWith('{')) {
      try {
        const obj = JSON.parse(s) as Record<string, unknown>;
        const path = (obj.path ?? obj.url ?? obj.fileUrl) as string | undefined;
        if (!path || !String(path).trim()) return null;
        const url = (obj.url ?? obj.fileUrl ?? obj.accessUrl ?? obj.previewUrl) as string | undefined;
        const name = (obj.name ?? obj.fileName ?? obj.originalFilename) as string | undefined;
        return {
          path: String(path).trim(),
          // url 可能不存在，按 path 回退
          url: url ? String(url).trim() : String(path).trim(),
          name: name && String(name).trim() ? decodeDisplayFileName(String(name).trim()) : undefined,
        };
      } catch {
        /* ignore */
      }
    }
    return { path: s, url: s };
  }
  if (typeof x === 'object') {
    const o = x as Record<string, unknown>;
    // 兼容老数据：可能是 { url, name }，也可能是 { path, name }，这里统一映射到 path
    const path = (o.path ?? o.url ?? o.fileUrl) as string | undefined;
    if (!path || !String(path).trim()) return null;
    const url = (o.url ?? o.fileUrl ?? o.accessUrl ?? o.previewUrl) as string | undefined;
    const name = (o.name ?? o.fileName ?? o.originalFilename) as string | undefined;
    const nameStr =
      name !== undefined && name !== null && String(name).trim()
        ? decodeDisplayFileName(String(name).trim())
        : undefined;
    return {
      path: String(path).trim(),
      // 后端要求 url/path/name 三字段都在数组项里：缺 url 就用 path 回退（通常两者含同一签名信息）
      url: url !== undefined && url !== null && String(url).trim() ? String(url).trim() : String(path).trim(),
      name: nameStr || undefined,
    };
  }
  return null;
}

/**
 * 解析后端佐证字段：string[]、JSON 字符串数组、JSON 对象数组 `[{url,name}]`、逗号分隔 URL
 */
export function parseZzclFieldFromVo(raw: unknown): ZzclFileItem[] {
  if (raw === null || raw === undefined) return [];
  if (Array.isArray(raw)) {
    // VO 里：Array<string>
    // 可能出现两种形式：
    // - 每个元素都是 JSON 字符串：`{"path":"...","url":"...","name":"..."}`
    // - 每个元素是 path/url 字符串
    // 另外兼容：偶发出现把整个数组再 JSON.stringify 成一个字符串：`"[{...},{...}]"`
    const out: ZzclFileItem[] = [];
    for (const item of raw) {
      if (typeof item === 'string') {
        const s = item.trim();
        if (s.startsWith('[')) {
          try {
            const parsed = JSON.parse(s);
            if (Array.isArray(parsed)) {
              out.push(
                ...parsed.map(normalizeOneZzclEntry).filter((x): x is ZzclFileItem => x !== null),
              );
              continue;
            }
          } catch {
            /* ignore */
          }
        }
      }
      const norm = normalizeOneZzclEntry(item);
      if (norm) out.push(norm);
    }
    // 去重（以 path 为 key）
    const seen = new Set<string>();
    return out.filter((it) => {
      if (!it.path) return false;
      if (seen.has(it.path)) return false;
      seen.add(it.path);
      return true;
    });
  }
  const s = String(raw).trim();
  if (!s) return [];
  if (s.startsWith('[')) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeOneZzclEntry).filter((x): x is ZzclFileItem => x !== null);
      }
    } catch {
      /* ignore */
    }
  }
  if (s.includes(',')) {
    const parts = s.split(',').map((x) => x.trim()).filter(Boolean);
    if (parts.length > 1) return parts.map((path) => ({ path }));
  }
  return [{ path: s }];
}

/** 仅 path 列表（详情链接、旧字段拼接） */
export function normalizeAttachmentUrls(raw: unknown): string[] {
  return parseZzclFieldFromVo(raw).map((x) => x.path);
}

/**
 * 系统上传接口 `/system-api/file` 常见响应形态（兼容 data 包裹、数组、FileVo）
 */
export function parseFileUploadResponse(raw: unknown): { name?: string; path?: string; url?: string } | null {
  if (raw === null || raw === undefined) return null;
  // 兼容后端返回为 JSON 字符串的情况（antd 可能不会自动转对象）
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return parseFileUploadResponse(parsed);
    } catch {
      // ignore
    }
  }
  const r = Array.isArray(raw) ? raw[0] : raw;
  if (r === null || r === undefined || typeof r !== 'object') return null;
  const anyR = r as Record<string, unknown>;
  const inner =
    anyR.data !== null && anyR.data !== undefined && typeof anyR.data === 'object'
      ? Array.isArray(anyR.data)
        ? (anyR.data as unknown[])[0]
        : anyR.data
      : anyR;
  if (inner === null || inner === undefined || typeof inner !== 'object') return null;
  const o = inner as Record<string, unknown>;
  const url = (o.url ?? o.fileUrl ?? o.accessUrl ?? o.previewUrl) as string | undefined;
  const path = (o.path ?? o.filePath ?? o.objectKey ?? o.key) as string | undefined;
  const name = (o.name ?? o.fileName ?? o.originalFilename) as string | undefined;
  const pathStr = path !== null && path !== undefined ? String(path) : '';
  const urlStr = url !== null && url !== undefined ? String(url) : '';
  if (!pathStr && !urlStr) return null;
  const dispName =
    name !== null && name !== undefined && String(name).trim()
      ? decodeDisplayFileName(String(name).trim())
      : undefined;
  return {
    name: dispName,
    // 关键：业务提交需要“真实 path”，不能用 url 兜底覆盖，否则会把签名 url 误存为 path
    path: pathStr || undefined,
    url: urlStr || undefined,
  };
}

export function extractUrlFromUploadFile(file: UploadFile): string | null {
  const parsed = parseFileUploadResponse(file.response);
  // 历史命名保留：这里优先取 url，其次 path，最后取 UploadFile.url
  //（提交时请优先用 parseFileUploadResponse().path）
  if (parsed?.url) return String(parsed.url);
  if (parsed?.path) return String(parsed.path);
  const u = (file as unknown as { url?: string }).url;
  return u ? String(u) : null;
}

/** 从 Upload 列表构建佐证项：优先接口返回的 name，其次本地选择的文件名 */
export function buildZzclItemsFromUploadFileList(fileList: UploadFile[] | undefined): ZzclFileItem[] {
  if (!fileList?.length) return [];
  const seen = new Set<string>();
  const out: ZzclFileItem[] = [];
  for (const f of fileList) {
    if (f.status !== 'done') continue;
    const fromResp = parseFileUploadResponse(f.response);
    // 提交用 path：必须优先取后端返回的 path（objectKey/filePath），不要用 url 覆盖
    const path = fromResp?.path ?? extractUrlFromUploadFile(f);
    if (!path) continue;
    if (seen.has(path)) continue;
    seen.add(path);
    const nameFromResp = fromResp?.name?.trim()
      ? decodeDisplayFileName(fromResp.name.trim())
      : '';
    const nameFromFile = f.name?.trim() ? decodeDisplayFileName(f.name.trim()) : '';
    const name = nameFromResp || nameFromFile || undefined;
    // url 仅用于回显/下载（若有）；最终 prime-api 提交只会序列化 path+name
    out.push({ path, url: fromResp?.url, name });
  }
  return out;
}

export function zzclItemsToUploadFileList(items: ZzclFileItem[]): UploadFile[] {
  return items.map((item, i) => {
    const raw = item.path;
    const cleanPath = raw.split('?')[0];
    const fromUrl = decodeURIComponent(cleanPath.split('/').pop() || '').trim() || '已上传文件';
    const name =
      item.name && item.name.trim()
        ? decodeDisplayFileName(item.name.trim())
        : fromUrl;
    return {
      uid: `-${i}-${encodeURIComponent(raw).slice(0, 64)}`,
      name,
      status: 'done' as const,
      // antd Upload 依赖 url 才能做某些行为；这里把含签名的 path 当作 url 使用即可
      url: raw,
    };
  });
}

/** 提交：fileList 优先；无文件时再用字符串回退（兼容纯文本 URL） */
export function mergeZzclForSubmit(fileList: UploadFile[] | undefined, legacyStr: unknown): ZzclFileItem[] {
  const fromFiles = buildZzclItemsFromUploadFileList(fileList);
  const fromLegacy = parseZzclFieldFromVo(legacyStr);
  const byPath = new Map<string, ZzclFileItem>();
  for (const it of fromFiles) {
    if (it.path) byPath.set(it.path, it);
  }
  for (const it of fromLegacy) {
    if (it.path && !byPath.has(it.path)) byPath.set(it.path, it);
  }
  return Array.from(byPath.values());
}

export function legacyUrlCsvFromItems(items: ZzclFileItem[]): string | null {
  const paths = items.map((i) => i.path).filter(Boolean);
  if (!paths.length) return null;
  return paths.length === 1 ? paths[0] : paths.join(',');
}

/**
 * 重点项目佐证：Fox 多为 String 存 JSON 文本；内容为 `{url,name}[]` 或兼容纯 URL 数组
 */
/**
 * prime-api/project-key-project：字段类型为 `Array<FileDownloadVo>`
 * 这里只返回 `{ path, name }`，不包含 url。
 */
export function serializeZzclForApi(items: ZzclFileItem[]): FileDownloadVo[] {
  // 注意：OpenAPI 生成的 ProjectKeyProjectDto 在 toJSON 中对这些字段直接做 `.map(...)`，
  // 若返回 undefined 会导致 `undefined.map` 抛错，所以这里必须返回空数组而不是 undefined。
  if (!items.length) return [];
  return items
    .filter((it) => !!it.path)
    .map((it) => {
      const path = it.path;
      const name = it.name ?? decodeDisplayFileName(fileLabelFromUrl(path));
      return { path, name };
    });
}

/** @deprecated 仅取 URL 列表，请优先用 buildZzclItemsFromUploadFileList */
export function getPathsFromUploadFileList(fileList: UploadFile[] | undefined): string[] {
  return buildZzclItemsFromUploadFileList(fileList).map((x) => x.path);
}
