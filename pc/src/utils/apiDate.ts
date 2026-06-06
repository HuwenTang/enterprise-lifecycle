import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

/**
 * OpenAPI 对 Date 多用 toISOString().substring(0,10)，按 UTC 取日。
 * 本地 00:00 转 ISO 会落到前一日 UTC，接口会少一天；用 UTC 同日中午避免偏移。
 */
export function dayjsToApiDatePreservingCalendarDay(value?: Dayjs | null): Date | undefined {
  if (value === undefined || value === null || !dayjs(value).isValid()) return undefined;
  const d = dayjs(value);
  return new Date(Date.UTC(d.year(), d.month(), d.date(), 12, 0, 0, 0));
}
