import { primeApi } from '@/services/api';

/** 查询问题反馈待处理数量（/user-feedback/pending-count） */
export const fetchUserFeedbackPendingCount = async (): Promise<number> => {
  try {
    return await primeApi.getPendingCount();
  } catch {
    return 0;
  }
};
