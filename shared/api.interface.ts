/* 前后端共享的类型写在这里 */

export interface FormulaItem {
  name: string;
  drops: string;
}

export interface FormulaData {
  top: FormulaItem[];
  middle: FormulaItem[];
  base: FormulaItem[];
}

export interface StoryCardData {
  title: string;
  coCreators: string;
  keywords: string[];
  formulaByNote: {
    top: string[];
    middle: string[];
    base: string[];
  };
  totalDrops: number;
  diluentText: string;
  story: string;
  understandingLine: string;
}

export interface CreateFormulaRequest {
  customerWish: string;
  perfumeName: string;
  directionName: string;
  feelings: string[];
  formula: FormulaData;
  storyCard: StoryCardData;
}

export interface FormulaRecord {
  id: string;
  customerWish: string;
  perfumeName: string;
  directionName: string;
  feelings: string[];
  formula: FormulaData;
  storyCard: StoryCardData;
  createdAt: string;
}

export interface FormulaListResponse {
  items: FormulaRecord[];
  total: number;
}
