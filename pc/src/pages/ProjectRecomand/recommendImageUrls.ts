import type { UploadFile } from 'antd';

/**
 * 后端 `ProjectInvestmentRecommendVo.image` 为 string[]；
 * 兼容历史 string（分号/逗号分隔多个 URL）。
 */
export function normalizeRecommendImageUrls(image?: string | string[] | null): string[] {
  if (image == null || image === '') return [];
  if (Array.isArray(image)) {
    return image.map((u) => String(u).trim()).filter(Boolean);
  }
  return String(image)
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function recommendImageUrlsToUploadFileList(urls: string[], uidPrefix: string): UploadFile[] {
  if (urls.length === 0) return [];
  return urls.map((url, index) => ({
    uid: `${uidPrefix}-${index}`,
    name: `image-${index}.jpg`,
    status: 'done' as const,
    url,
  }));
}
