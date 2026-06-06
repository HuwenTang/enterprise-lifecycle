import { ResponseError } from '@/services/apis/runtime';
import { message } from 'antd';

function pickServerMessage(json: Record<string, unknown> | null): string | undefined {
  if (!json || typeof json !== 'object') return undefined;
  const candidates = [
    json.message,
    json.msg,
    json.errorMessage,
    typeof json.error === 'string' ? json.error : undefined,
  ];
  for (const c of candidates) {
    if (c !== undefined && c !== null && String(c).trim() !== '') {
      return String(c).trim();
    }
  }
  return undefined;
}

/**
 * 统一解析 OpenAPI fetch 抛出的 ResponseError（body 常为 { code|status, message }），
 * 避免把 Error.message「Response returned an error code」直接提示给用户。
 */
export const handleApiError = async (ex: unknown): Promise<void> => {
  if (ex instanceof ResponseError && ex.response) {
    try {
      const text = await ex.response.clone().text();
      let json: Record<string, unknown> | null = null;
      if (text) {
        try {
          json = JSON.parse(text) as Record<string, unknown>;
        } catch {
          json = null;
        }
      }
      const serverMsg = pickServerMessage(json);
      if (serverMsg) {
        message.error(serverMsg);
        return;
      }
    } catch (parseError) {
      console.error('handleApiError: 解析响应体失败', parseError);
    }
    message.error('请求失败，请稍后重试');
    return;
  }

  if (ex instanceof Error && ex.message && ex.name !== 'ResponseError') {
    message.error(ex.message);
    return;
  }

  message.error('请求失败，请稍后重试');
};
