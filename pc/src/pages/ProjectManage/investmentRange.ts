import type { InvestmentAmountRange } from './types';

const MID_MIN = 0.05;
const MID_MAX = 1;
const BELOW_CAP = 0.05;

export function investmentRangeToApiAmounts(
  range: InvestmentAmountRange | undefined,
): { investmentAmount1?: number; investmentAmount2?: number } {
  switch (range) {
    case 'above100000': return { investmentAmount1: 10 };
    case 'above50000':  return { investmentAmount1: 5 };
    case 'above10000':  return { investmentAmount1: 1 };
    case 'mid500to10000': return { investmentAmount1: MID_MIN, investmentAmount2: MID_MAX };
    case 'below500':    return { investmentAmount2: BELOW_CAP };
    default:            return {};
  }
}

export function parseUrlInvestmentAmount(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function inferInvestmentRangeFromUrlAmounts(
  a1?: number,
  a2?: number,
): InvestmentAmountRange | undefined {
  if (a1 === undefined && a2 === undefined) return 'all';
  const near = (x: number, y: number) => Math.abs(x - y) < 1e-6;
  if (a1 === 10 && a2 === undefined) return 'above100000';
  if (a1 === 5  && a2 === undefined) return 'above50000';
  if (a1 === 1  && a2 === undefined) return 'above10000';
  if (a1 !== undefined && a2 !== undefined && near(a1, MID_MIN) && near(a2, MID_MAX)) return 'mid500to10000';
  if (a1 === undefined && a2 !== undefined && near(a2, BELOW_CAP)) return 'below500';
  // 兼容旧 URL 万元值
  if (a1 === 100000 && a2 === undefined) return 'above100000';
  if (a1 === 50000  && a2 === undefined) return 'above50000';
  if (a1 === 10000  && a2 === undefined) return 'above10000';
  if (a1 === 500 && a2 === 10000) return 'mid500to10000';
  if (a1 === undefined && a2 === 500) return 'below500';
  return undefined;
}
