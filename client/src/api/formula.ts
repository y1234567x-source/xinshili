import type { CreateFormulaRequest, FormulaListResponse, FormulaRecord } from '@shared/api.interface';

const STORAGE_KEY = 'ai_perfume_saved_formulas';

export async function saveFormula(data: CreateFormulaRequest): Promise<void> {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const list: FormulaRecord[] = existing ? JSON.parse(existing) : [];
    const newRecord: FormulaRecord = {
      id: 'formula_' + Date.now(),
      customerWish: data.customerWish,
      perfumeName: data.perfumeName,
      directionName: data.directionName,
      feelings: data.feelings,
      formula: data.formula,
      storyCard: data.storyCard,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (error) {
    console.error('保存配方记录失败', error);
  }
}

export async function listFormulas(page: number = 1, pageSize: number = 20): Promise<FormulaListResponse> {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const list: FormulaRecord[] = existing ? JSON.parse(existing) : [];
    const offset = (page - 1) * pageSize;
    return {
      items: list.slice(offset, offset + pageSize),
      total: list.length,
    };
  } catch {
    return { items: [], total: 0 };
  }
}

