import {
  SCENTS,
  FEELING_POOL,
  EMOTION_MAP,
  SCENE_MAP,
  AVOID_MAP,
  AVOID_RULES,
  type Scent,
} from './perfume-data';
import { formatCardAnalysisNarrative } from './ai-perfume-engine';

export interface ParsedIntent {
  rawText: string;
  emotionKeywords: string[];
  sceneKeywords: string[];
  preferenceKeywords: string[];
  avoidKeywords: string[];
  targetFeelings: string[];
  intensity: string;
  sweetness: string;
  freshness: string;
  warmth: string;
}

export interface FormulaItem {
  scentId: string;
  name: string;
  drops: number;
  note: string;
}

export interface Formula {
  top: FormulaItem[];
  middle: FormulaItem[];
  base: FormulaItem[];
}

export interface Direction {
  name: string;
  simpleFeelings: string[];
  recommendedScents: { scentId: string; name: string; note: string; noteLabel: string }[];
}

export interface StoryCard {
  title: string;
  coCreators: string;
  customerName: string;
  heartYouthName: string;
  customerMood: string;
  customWish?: string;
  topScentName: string;
  soulScentName: string;
  baseScentName: string;
  youthArtworkImage?: string;
  youthArtworkTitle?: string;
  serialNumber: string;
  createdDate: string;
  keywords: string[];
  formulaByNote: { top: string[]; middle: string[]; base: string[] };
  totalDrops: number;
  diluentText: string;
  story: string;
  understandingLine: string;
  coCreationStory: string;
  harmonyAnalysis: string;
  constantQuote: string;
}

export interface SoulScentCandidate {
  scent: Scent;
  recommendReason: string;
  speechLine: string;
}

export function getCandidateSoulScents(customerWish: string): SoulScentCandidate[] {
  const parsed = parseCustomerWish(customerWish);
  const feelings = mapIntentToFeelings(parsed);
  const scored = scoreScents(SCENTS, parsed, feelings);

  // Focus primarily on expressive middle & top notes that heart youths can easily recognize and love
  const preferredPool = scored.filter(
    (item) => item.scent.note === 'middle' || item.scent.category === 'citrus' || item.scent.category === 'woody'
  );
  const sorted = (preferredPool.length >= 3 ? preferredPool : scored).sort((a, b) => b.score - a.score);

  const selectedScents: Scent[] = [];
  for (const item of sorted) {
    if (!selectedScents.some((s) => s.id === item.scent.id || s.category === item.scent.category)) {
      selectedScents.push(item.scent);
    }
    if (selectedScents.length >= 3) break;
  }

  // Fallback if needed
  if (selectedScents.length < 3) {
    for (const item of sorted) {
      if (!selectedScents.some((s) => s.id === item.scent.id)) {
        selectedScents.push(item.scent);
      }
      if (selectedScents.length >= 3) break;
    }
  }

  return selectedScents.map((scent) => {
    const speechMap: Record<string, string> = {
      lemon: `“我为你选了【柠檬】，酸酸清清的，像阳光一样有活力！”`,
      green_orange: `“我为你选了【绿柑橘】，像一颗新鲜的小橘子，清爽又可爱！”`,
      peach: `“我为你选了【水蜜桃】，甜甜多汁的，希望你每天都甜甜的！”`,
      jasmine: `“我为你选了【茉莉】，像夜晚盛开的小白花，香香软软的！”`,
      white_tea: `“我为你选了【白茶】，很安静很干净，适合放松的时候闻一闻！”`,
      osmanthus: `“我为你选了【金桂】，像秋天落下的金色桂花，特别温暖！”`,
      rose: `“我为你选了【玫瑰】，经典的温柔花香，是一份心意满满的礼物！”`,
      lily_of_the_valley: `“我为你选了【铃兰】，像白色的小铃铛，纯洁又温柔！”`,
      green_tea: `“我为你选了【绿茶】，淡淡的茶香，闻着很舒服不心烦！”`,
      sandalwood: `“我为你选了【檀香】，很安心很沉稳的木头香，能安抚心情！”`,
      cedar: `“我为你选了【雪松】，像冬天松树林里的清风，自然又有力量！”`,
      synthetic_musk: `“我为你选了【白麝香】，像晒过太阳的干净衣服，暖洋洋的！”`,
      coconut: `“我为你选了【椰子】，像去海边吃甜甜的椰子糖，很放松！”`,
      mimosa: `“我为你选了【含羞草】，软绵绵的嫩黄色小花，特别治愈！”`,
    };

    const speechLine = speechMap[scent.id] || `“我为你选了【${scent.name}】，${scent.childFriendlyDescription} 希望你喜欢！”`;
    const reasonMap: Record<string, string> = {
      peach: '甜美抚平，带来温暖陪伴感',
      white_tea: '安静澄澈，释放压力与纷扰',
      lemon: '明朗清新，唤醒一整天的精神',
      green_orange: '草木甘橘，自然清爽不黏腻',
      jasmine: '优雅纯白，抚平心头的褶皱',
      osmanthus: '金秋桂雨，给生活加一点甜',
      cedar: '沉静雪松，如身处大自然的安宁',
      sandalwood: '温润檀木，深层定心与宁静',
      green_tea: '清雅绿茶，给心情透透气',
      synthetic_musk: '温柔体香，如拥抱般的安全感',
    };
    const recommendReason = reasonMap[scent.id] || scent.customerDescription;

    return {
      scent,
      recommendReason,
      speechLine,
    };
  });
}

export function generateDirectionWithSoul(
  customerWish: string,
  soulScentId: string,
): {
  parsedIntent: ParsedIntent;
  simpleFeelings: string[];
  direction: Direction;
  finalFormula: { formula: Formula; totalDrops: number };
  perfumeName: string;
} {
  const soulScent = SCENTS.find((s) => s.id === soulScentId) || SCENTS[0];
  const parsedIntent = parseCustomerWish(customerWish);
  const simpleFeelings = mapIntentToFeelings(parsedIntent);
  const scored = scoreScents(SCENTS, parsedIntent, simpleFeelings);

  // Complementary scents based on soul scent note
  let topScent: Scent;
  let mid1: Scent;
  let mid2: Scent;
  let base1: Scent;
  let base2: Scent;

  const topPool = scored.filter((i) => i.scent.note === 'top' && i.scent.id !== soulScent.id);
  const midPool = scored.filter((i) => i.scent.note === 'middle' && i.scent.id !== soulScent.id);
  const basePool = scored.filter((i) => i.scent.note === 'base' && i.scent.id !== soulScent.id);

  if (soulScent.note === 'top') {
    topScent = soulScent;
    mid1 = midPool[0]?.scent || SCENTS.find((s) => s.id === 'white_tea')!;
    mid2 = midPool[1]?.scent || SCENTS.find((s) => s.id === 'jasmine')!;
    base1 = basePool[0]?.scent || SCENTS.find((s) => s.id === 'cedar')!;
    base2 = basePool[1]?.scent || SCENTS.find((s) => s.id === 'synthetic_musk')!;
  } else if (soulScent.note === 'base') {
    topScent = topPool[0]?.scent || SCENTS.find((s) => s.id === 'lemon')!;
    mid1 = midPool[0]?.scent || SCENTS.find((s) => s.id === 'white_tea')!;
    mid2 = midPool[1]?.scent || SCENTS.find((s) => s.id === 'peach')!;
    base1 = soulScent;
    base2 = basePool[0]?.scent || SCENTS.find((s) => s.id === 'cedar')!;
  } else {
    // Soul scent is middle note (most common)
    topScent = topPool[0]?.scent || SCENTS.find((s) => s.id === 'green_orange')!;
    mid1 = soulScent;
    mid2 = midPool[0]?.scent || SCENTS.find((s) => s.id === 'white_tea')!;
    base1 = basePool[0]?.scent || SCENTS.find((s) => s.id === 'cedar')!;
    base2 = basePool[1]?.scent || SCENTS.find((s) => s.id === 'synthetic_musk')!;
  }

  const allScents = [topScent, mid1, mid2, base1, base2];
  const direction: Direction = {
    name: `${soulScent.name}之适`,
    simpleFeelings: simpleFeelings.slice(0, 3),
    recommendedScents: allScents.map((s) => ({
      scentId: s.id,
      name: s.name,
      note: s.note,
      noteLabel: s.noteLabel,
    })),
  };

  // 40 drops total: Top 8, Middle 16, Base 16
  const formula: Formula = {
    top: [{ scentId: topScent.id, name: topScent.name, drops: 8, note: 'top' }],
    middle:
      soulScent.note === 'middle'
        ? [
            { scentId: mid1.id, name: mid1.name, drops: 10, note: 'middle' },
            { scentId: mid2.id, name: mid2.name, drops: 6, note: 'middle' },
          ]
        : [
            { scentId: mid1.id, name: mid1.name, drops: 8, note: 'middle' },
            { scentId: mid2.id, name: mid2.name, drops: 8, note: 'middle' },
          ],
    base:
      soulScent.note === 'base'
        ? [
            { scentId: base1.id, name: base1.name, drops: 10, note: 'base' },
            { scentId: base2.id, name: base2.name, drops: 6, note: 'base' },
          ]
        : [
            { scentId: base1.id, name: base1.name, drops: 8, note: 'base' },
            { scentId: base2.id, name: base2.name, drops: 8, note: 'base' },
          ],
  };

  const perfumeName = generatePerfumeName(simpleFeelings, direction);

  return {
    parsedIntent,
    simpleFeelings,
    direction,
    finalFormula: { formula, totalDrops: 40 },
    perfumeName,
  };
}

export interface AppState {
  customerWish: string;
  simplifiedFeelings: string[];
  direction: Direction | null;
  finalFormula: { formula: Formula; totalDrops: number } | null;
  perfumeName: string;
  storyCard: StoryCard | null;
}

export const INITIAL_APP_STATE: AppState = {
  customerWish: '',
  simplifiedFeelings: [],
  direction: null,
  finalFormula: null,
  perfumeName: '',
  storyCard: null,
};

function getDefaultParsedIntent(): ParsedIntent {
  return {
    rawText: '',
    emotionKeywords: [],
    sceneKeywords: [],
    preferenceKeywords: [],
    avoidKeywords: [],
    targetFeelings: ['清新', '温柔'],
    intensity: 'medium',
    sweetness: 'unknown',
    freshness: 'unknown',
    warmth: 'unknown',
  };
}

export function parseCustomerWish(customerWish: string): ParsedIntent {
  if (!customerWish || typeof customerWish !== 'string') return getDefaultParsedIntent();
  const text = customerWish.toLowerCase();
  const emotionKeywords: string[] = [];
  const sceneKeywords: string[] = [];
  const preferenceKeywords: string[] = [];
  const avoidKeywords: string[] = [];
  const targetFeelings: string[] = [];
  let intensity = 'medium';
  let sweetness = 'unknown';
  let freshness = 'unknown';
  let warmth = 'unknown';

  EMOTION_MAP.forEach((rule) => {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      emotionKeywords.push(...rule.keywords.filter((kw) => text.includes(kw)));
      targetFeelings.push(...rule.feelings);
      if (rule.intensity) intensity = rule.intensity;
    }
  });

  SCENE_MAP.forEach((rule) => {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      sceneKeywords.push(...rule.keywords.filter((kw) => text.includes(kw)));
      targetFeelings.push(...rule.feelings);
    }
  });

  const prefMap = [
    { keywords: ['甜', '甜蜜', '糖'], pref: 'sweet', sweetness: 'high' },
    { keywords: ['不甜', '不要太甜', '少甜', '微甜'], pref: 'low-sweet', sweetness: 'low' },
    { keywords: ['清新', '清爽', '干净'], pref: 'fresh', freshness: 'high' },
    { keywords: ['温暖', '暖', '温馨'], pref: 'warm', warmth: 'high' },
    { keywords: ['浓', '浓郁', '厚重', '强烈'], pref: 'rich', intensity: 'rich' },
    { keywords: ['淡', '淡雅', '清淡', '轻'], pref: 'light', intensity: 'light' },
    { keywords: ['花', '花香', '花朵'], pref: 'floral', category: 'floral' },
    { keywords: ['木', '木质', '木头', '檀香', '雪松'], pref: 'woody', category: 'woody' },
    { keywords: ['果', '果香', '水果', '柑橘'], pref: 'fruity', category: 'fruity' },
    { keywords: ['茶', '茶香', '绿茶', '白茶'], pref: 'tea', category: 'tea' },
  ];

  prefMap.forEach((rule) => {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      preferenceKeywords.push(rule.pref);
      if ('sweetness' in rule && rule.sweetness) sweetness = rule.sweetness;
      if ('freshness' in rule && rule.freshness) freshness = rule.freshness;
      if ('warmth' in rule && rule.warmth) warmth = rule.warmth;
      if ('intensity' in rule && rule.intensity) intensity = rule.intensity;
    }
  });

  AVOID_MAP.forEach((rule) => {
    if (rule.keywords.some((kw) => text.includes(kw))) avoidKeywords.push(rule.avoid);
  });

  return {
    rawText: customerWish,
    emotionKeywords: [...new Set(emotionKeywords)],
    sceneKeywords: [...new Set(sceneKeywords)],
    preferenceKeywords: [...new Set(preferenceKeywords)],
    avoidKeywords: [...new Set(avoidKeywords)],
    targetFeelings: [...new Set(targetFeelings)].slice(0, 5),
    intensity,
    sweetness,
    freshness,
    warmth,
  };
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mapIntentToFeelings(parsedIntent: ParsedIntent): string[] {
  const feelings = [...parsedIntent.targetFeelings];
  if (parsedIntent.sceneKeywords.length > 0) {
    const m: Record<string, string[]> = {
      '夏天': ['清新', '明亮', '干净', '活泼', '自由', '舒适'],
      '海边': ['清新', '开阔', '自由', '明亮', '放松', '活泼'],
      '春天': ['温柔', '自然', '明亮', '甜美', '浪漫', '活泼'],
      '雨后': ['清新', '安静', '干净', '自然', '放松', '舒适'],
      '森林': ['自然', '安静', '沉稳', '干净', '放松', '自由'],
      '早晨': ['明亮', '清新', '清醒', '干净', '活泼', '温柔'],
      '夜晚': ['安静', '温暖', '浪漫', '优雅', '放松', '神秘'],
      '工作': ['清醒', '干净', '沉稳', '自然', '专注', '舒适'],
      '约会': ['温柔', '明亮', '浪漫', '甜美', '优雅', '温暖'],
      '礼物': ['祝福', '温暖', '浪漫', '明亮', '温柔', '有记忆点'],
      '毕业': ['明亮', '祝福', '温暖', '勇敢', '自由', '有记忆点'],
    };
    parsedIntent.sceneKeywords.forEach((sk) => {
      Object.entries(m).forEach(([key, vals]) => {
        if (sk.includes(key)) feelings.push(...vals);
      });
    });
  }
  const unique = shuffleArray([...new Set(feelings)].filter((f) => FEELING_POOL.includes(f)));
  if (unique.length < 2) {
    const defaults = shuffleArray(['清新', '温柔', '明亮', '安静', '温暖', '自然', '干净', '放松', '祝福', '浪漫']);
    for (const f of defaults) {
      if (!unique.find((u) => u === f)) unique.push(f);
      if (unique.length >= 3) break;
    }
  }
  return unique.slice(0, 3);
}

function scoreScents(
  scents: Scent[],
  parsedIntent: ParsedIntent,
  simpleFeelings: string[],
): { scent: Scent; score: number }[] {
  return scents.map((scent) => {
    let score = 0;
    if (scent.feelingWords.filter((fw) => simpleFeelings.includes(fw)).length > 0) score += 5;
    if (scent.suitableFor.filter((sf) => simpleFeelings.includes(sf)).length > 0) score += 4;
    if (
      scent.suitableFor.filter((sf) =>
        parsedIntent.sceneKeywords.some((sk) => sf.includes(sk) || sk.includes(sf)),
      ).length > 0
    )
      score += 4;
    if (parsedIntent.preferenceKeywords.includes(scent.category)) score += 3;
    const dw = simpleFeelings.concat(parsedIntent.sceneKeywords);
    if (dw.some((w) => scent.customerDescription.includes(w))) score += 2;
    if (scent.note === 'top' && ['清新', '明亮', '清醒'].some((f) => simpleFeelings.includes(f)))
      score += 1;
    if (
      scent.note === 'middle' &&
      ['温柔', '浪漫', '甜美'].some((f) => simpleFeelings.includes(f))
    )
      score += 1;
    if (
      scent.note === 'base' &&
      ['沉稳', '有记忆点', '温暖'].some((f) => simpleFeelings.includes(f))
    )
      score += 1;
    parsedIntent.avoidKeywords.forEach((ak) => {
      const r = AVOID_RULES[ak];
      if (r && r.scents.includes(scent.id)) score += r.penalty;
    });
    if (
      parsedIntent.sweetness === 'low' &&
      ['peach', 'coconut', 'osmanthus'].includes(scent.id)
    )
      score -= 3;
    if (
      parsedIntent.sweetness === 'high' &&
      ['peach', 'coconut', 'osmanthus'].includes(scent.id)
    )
      score += 2;
    if (
      parsedIntent.intensity === 'light' &&
      ['rose', 'clove', 'ambergris'].includes(scent.id)
    )
      score -= 2;
    if (
      parsedIntent.intensity === 'rich' &&
      ['rose', 'clove', 'ambergris'].includes(scent.id)
    )
      score += 2;
    return { scent, score };
  });
}

function weightedPick(
  candidates: { scent: Scent; score: number }[],
  options: { excludeIds?: string[] } = {},
): Scent | null {
  const { excludeIds = [] } = options;
  const filtered = candidates.filter((item) => !excludeIds.includes(item.scent.id));
  if (filtered.length === 0) return null;
  const sorted = filtered.sort((a, b) => b.score - a.score);
  const pool = sorted.slice(0, 8);
  const total = pool.reduce((sum, item) => sum + Math.max(item.score, 1), 0);
  let r = Math.random() * total;
  for (const item of pool) {
    r -= Math.max(item.score, 1);
    if (r <= 0) return item.scent;
  }
  return pool[0].scent;
}

function generateDirectionName(scents: Scent[], simpleFeelings: string[]): string {
  const topName = scents.find((s) => s.note === 'top')?.name || '';
  const middleName = scents.find((s) => s.note === 'middle')?.name || '';
  const baseName = scents.find((s) => s.note === 'base')?.name || '';
  const pairs = [
    [topName, middleName],
    [middleName, baseName],
    [topName, baseName],
  ].filter((p) => p[0] && p[1] && p[0] !== p[1]);
  if (pairs.length > 0 && Math.random() < 0.7) {
    const p = pairs[Math.floor(Math.random() * pairs.length)];
    return p[0] + ['与', '和', '·'][Math.floor(Math.random() * 3)] + p[1];
  }
  const feeling = simpleFeelings[Math.floor(Math.random() * simpleFeelings.length)] || '';
  const main = middleName || topName || baseName;
  return feeling && main ? feeling + '·' + main : main + '之诗';
}

export function generateDirectionFull(customerWish: string): {
  parsedIntent: ParsedIntent;
  simpleFeelings: string[];
  direction: Direction | null;
} {
  const parsedIntent = parseCustomerWish(customerWish);
  const simpleFeelings = mapIntentToFeelings(parsedIntent);
  const scored = scoreScents(SCENTS, parsedIntent, simpleFeelings);
  const notePools = {
    top: scored.filter((i) => i.scent.note === 'top').sort((a, b) => b.score - a.score),
    middle: scored.filter((i) => i.scent.note === 'middle').sort((a, b) => b.score - a.score),
    base: scored.filter((i) => i.scent.note === 'base').sort((a, b) => b.score - a.score),
  };
  const top = weightedPick(notePools.top);
  const topIds = top ? [top.id] : [];
  const mid1 = weightedPick(notePools.middle, { excludeIds: topIds });
  const mid2 = weightedPick(notePools.middle, { excludeIds: [...topIds, ...(mid1 ? [mid1.id] : [])] });
  const midIds = [mid1, mid2].filter(Boolean).map((s) => s!.id);
  const base1 = weightedPick(notePools.base, { excludeIds: [...topIds, ...midIds] });
  const base2 = weightedPick(notePools.base, {
    excludeIds: [...topIds, ...midIds, ...(base1 ? [base1.id] : [])],
  });
  const baseIds = [base1, base2].filter(Boolean).map((s) => s!.id);
  if (!top || !mid1 || !mid2 || !base1 || !base2)
    return { parsedIntent, simpleFeelings, direction: null };
  const scents = [top, mid1, mid2, base1, base2];
  const sf = shuffleArray([
    ...new Set(scents.flatMap((s) => s.feelingWords).filter((f) => FEELING_POOL.includes(f))),
  ]);
  const df =
    sf.length >= 3
      ? sf.slice(0, 3)
      : shuffleArray([...sf, ...simpleFeelings.filter((f) => !sf.includes(f))]).slice(0, 3);
  const direction: Direction = {
    name: generateDirectionName(scents, simpleFeelings),
    simpleFeelings: df,
    recommendedScents: scents.map((s) => ({
      scentId: s.id,
      name: s.name,
      note: s.note,
      noteLabel: s.noteLabel,
    })),
  };
  return { parsedIntent, simpleFeelings, direction };
}

export function generateFormula(direction: Direction | null): {
  formula: Formula;
  totalDrops: number;
} {
  const baseDrops = { top: 8, middle: 16, base: 16 };
  const ids = direction?.recommendedScents?.map((s) => s.scentId) || [];
  const topS: Scent[] = [];
  const midS: Scent[] = [];
  const baseS: Scent[] = [];
  ids.forEach((id) => {
    const s = SCENTS.find((x) => x.id === id);
    if (!s) return;
    if (s.note === 'top' && topS.length < 1) topS.push(s);
    else if (s.note === 'middle' && midS.length < 2) midS.push(s);
    else if (s.note === 'base' && baseS.length < 2) baseS.push(s);
  });
  if (!topS.length) {
    const f = SCENTS.filter((s) => s.note === 'top').sort(() => Math.random() - 0.5)[0];
    if (f) topS.push(f);
  }
  if (!midS.length) {
    const f = SCENTS.filter((s) => s.note === 'middle').sort(() => Math.random() - 0.5)[0];
    if (f) midS.push(f);
  }
  if (!baseS.length) {
    const f = SCENTS.filter((s) => s.note === 'base').sort(() => Math.random() - 0.5)[0];
    if (f) baseS.push(f);
  }
  function dist(sc: Scent[], tot: number): FormulaItem[] {
    const d: FormulaItem[] = [];
    if (!sc.length) return d;
    let rem = tot;
    const b = Math.floor(tot / sc.length);
    sc.forEach((s, i) => {
      const dr = i === sc.length - 1 ? rem : Math.max(b, 2);
      d.push({ scentId: s.id, name: s.name, drops: dr, note: s.note });
      rem -= dr;
    });
    return d;
  }
  const formula: Formula = {
    top: dist(topS, baseDrops.top),
    middle: dist(midS, baseDrops.middle),
    base: dist(baseS, baseDrops.base),
  };
  return {
    formula,
    totalDrops: [...formula.top, ...formula.middle, ...formula.base].reduce(
      (s, i) => s + i.drops,
      0,
    ),
  };
}

export function generatePerfumeName(
  simpleFeelings: string[],
  direction: Direction | null,
): string {
  const feelings = simpleFeelings || ['清新', '温柔'];
  const names = direction?.recommendedScents?.map((s) => s.name) || [];
  const adj: Record<string, string[]> = {
    '清新': ['初晴', '晓露', '青岚', '浅风', '晨光'],
    '温柔': ['暮云', '软风', '晚樱', '浮光', '浅梦'],
    '明亮': ['暖阳', '金晖', '流光', '晴空', '朝露'],
    '安静': ['静水', '幽兰', '空山', '暮色', '微澜'],
    '温暖': ['暖橘', '炉火', '余晖', '浅冬', '春泥'],
    '自然': ['山风', '野径', '苔痕', '松影', '竹露'],
    '甜美': ['蜜桃', '花蜜', '蜜语', '甜风', '糖露'],
    '浪漫': ['夜樱', '月光', '星河', '绯红', '花信'],
    '祝福': ['祈愿', '星光', '春晓', '花开', '暖阳'],
    '自由': ['长风', '旷野', '飞鸟', '远帆', '云游'],
    '独特': ['孤芳', '幽兰', '暗香', '独白', '独行'],
    '干净': ['素雪', '白露', '清风', '素月', '浅溪'],
    '沉稳': ['沉木', '深林', '暮钟', '古松', '远山'],
    '优雅': ['素兰', '清风', '雅韵', '疏影', '淡香'],
  };
  const main = feelings[0] || '清新';
  const a = (adj[main] || adj['清新'])[Math.floor(Math.random() * 5)];
  const p: string[] = [];
  if (names[0]) {
    p.push(`${a}·${names[0]}`, `${names[0]}的${a}`);
    if (names.length > 1) p.push(`${names[0]}与${names[1]}`);
  }
  p.push(`${a}之诗`);
  return p[Math.floor(Math.random() * p.length)];
}

export function generateStoryCard(data: {
  customerWish: string;
  customerMood?: string;
  customWish?: string;
  simplifiedFeelings: string[];
  finalFormula: { formula: Formula; totalDrops: number } | null;
  perfumeName: string;
  customerName?: string;
  heartYouthName?: string;
  soulScentName?: string;
  topScentName?: string;
  baseScentName?: string;
  youthArtworkImage?: string;
  youthArtworkTitle?: string;
}): StoryCard {
  const {
    customerWish,
    customerMood = '松弛解压',
    customWish,
    simplifiedFeelings,
    finalFormula,
    perfumeName,
    customerName = '特邀创作者',
    heartYouthName = '心青年调香助理',
    soulScentName = '',
    topScentName = finalFormula?.formula?.top?.[0]?.name || '柑橘清风',
    baseScentName = finalFormula?.formula?.base?.[0]?.name || '雪松木质',
    youthArtworkImage,
    youthArtworkTitle,
  } = data;

  const narrative = formatCardAnalysisNarrative({
    customerName,
    customerMood,
    customWish,
    topScentName,
    soulScentName,
    baseScentName,
    youthName: heartYouthName.replace('调香顾问 ', '').replace('心青年 ', ''),
  });

  const story = narrative.coCreationStory + '\n\n' + narrative.harmonyAnalysis;

  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const serialNumber = `XS-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}-${randomCode}`;

  return {
    title: perfumeName || '无名的香气',
    coCreators: `${customerName} × 心适力 × ${heartYouthName}`,
    customerName,
    heartYouthName,
    customerMood,
    customWish,
    topScentName,
    soulScentName: soulScentName || '适然调香',
    baseScentName,
    youthArtworkImage,
    youthArtworkTitle,
    serialNumber,
    createdDate: dateStr,
    keywords: simplifiedFeelings || ['清新', '温柔'],
    formulaByNote: {
      top: finalFormula?.formula?.top?.map((i) => `${i.name}：${i.drops}滴`) || [],
      middle: finalFormula?.formula?.middle?.map((i) => `${i.name}：${i.drops}滴`) || [],
      base: finalFormula?.formula?.base?.map((i) => `${i.name}：${i.drops}滴`) || [],
    },
    totalDrops: finalFormula?.totalDrops || 40,
    diluentText: '经专用纯净调香稀释液融合熟化',
    story,
    understandingLine: narrative.constantQuote,
    coCreationStory: narrative.coCreationStory,
    harmonyAnalysis: narrative.harmonyAnalysis,
    constantQuote: narrative.constantQuote,
  };
}
