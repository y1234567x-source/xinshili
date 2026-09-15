import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import type { CreateFormulaRequest, FormulaListResponse } from '@shared/api.interface';

export async function saveFormula(data: CreateFormulaRequest): Promise<void> {
  try {
    await axiosForBackend.post('/api/formulas', data);
  } catch (error) {
    logger.error('保存配方记录失败', error);
  }
}

export async function listFormulas(page: number = 1, pageSize: number = 20): Promise<FormulaListResponse> {
  const response = await axiosForBackend.get('/api/formulas', {
    params: { page, pageSize },
  });
  return response.data;
}
