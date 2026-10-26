// AI 调香师智能分析与共创引擎
// 负责心境香气底色解析、多维动态香水命名、故事卡深度共创分析与定制寄语

export interface MoodBaseScentAnalysis {
  topScentName: string;
  topScentDesc: string;
  baseScentName: string;
  baseScentDesc: string;
  aiFeedbackText: string;
}

// 6 大情绪对应的前调轻音与后调定香基底
export const MOOD_BASE_SCENTS: Record<string, MoodBaseScentAnalysis> = {
  '松弛解压': {
    topScentName: '甜橙 · 佛手柑',
    topScentDesc: '明快微甘的柑橘清风，瞬间卸下肩头沉重紧绷',
    baseScentName: '雪松 · 檀木',
    baseScentDesc: '沉稳草木定香，如漫步雨后森林般深长安心',
    aiFeedbackText:
      '您已成功确立了【甜橙·佛手柑】的前调开篇与【雪松·檀木】的后调底蕴！前调为你拂去紧绷，后调守护安宁。整款香水的基石已由您奠定——现在请将屏幕转交心青年，由他为您注入点睛的中调灵魂！',
  },
  '元气明朗': {
    topScentName: '柠檬 · 葡萄柚',
    topScentDesc: '多汁透亮的阳光果香，瞬间点燃元气好状态',
    baseScentName: '白麝香 · 琥珀',
    baseScentDesc: '洁净温暖体香，如晒透太阳的棉麻衬衫',
    aiFeedbackText:
      '您已选定了【柠檬·葡萄柚】的明朗开篇与【白麝香】的温暖余韵！阳光感已经就位。香气的前后底色已由您亲手搭建——接下来交给心青年，看看他会为您挑选怎样的奇妙主香！',
  },
  '宁静放空': {
    topScentName: '绿茶 · 薄荷青柠',
    topScentDesc: '澄澈微凉的水感茶气，抚平思绪浮躁',
    baseScentName: '岩兰草 · 冷杉',
    baseScentDesc: '幽静清远的大地木质，让心跳悄然慢下来',
    aiFeedbackText:
      '您已为调香锁定了【绿茶】的清冽前调与【岩兰草·冷杉】的悠远基石！这抹静谧的底色属于您的此刻心境。接下来由心青年来为您挑选最动人的中调，一起织就宁静！',
  },
  '温柔治愈': {
    topScentName: '粉红胡椒 · 蜜橘',
    topScentDesc: '轻柔不抢眼的微甜微辛，像初春的第一缕微风',
    baseScentName: '安息香 · 暖檀',
    baseScentDesc: '温润香草木质，如柔软毛毯环抱身躯',
    aiFeedbackText:
      '您已选定了【粉红胡椒·蜜橘】与【安息香·暖檀】作为温柔的底色铺垫！整瓶香氛已被注入了温暖从容的气息。现在请交给心青年，由他凭着直觉为你添上最治愈的一笔！',
  },
  '自然笃定': {
    topScentName: '迷迭香 · 罗勒草叶',
    topScentDesc: '破土而出的苍翠草木清香，唤醒清晰专注',
    baseScentName: '广藿香 · 柏木',
    baseScentDesc: '深邃沉静的根茎泥土气息，扎根笃定',
    aiFeedbackText:
      '您已选定了【迷迭香草叶】与【广藿柏木】的大自然基调！草木的大地骨骼已经筑牢，接下来交由心青年为您挑选绽放于其上的灵魂花果与木心！',
  },
  '心意相赠': {
    topScentName: '佛手柑 · 甜桃',
    topScentDesc: '一见倾心的鲜活甜美，传递真挚祝福与喜悦',
    baseScentName: '白麝香 · 沉香木',
    baseScentDesc: '长久停留的雅致底香，成为历久弥新的友情信件',
    aiFeedbackText:
      '您已定下了【佛手柑·甜桃】与【白麝香·沉木】作为祝福的坚实承托！这份心意的骨架已然丰满。接下来让心青年以他的直觉，共同补全这份心意！',
  },
};

// 获取心境分析反馈（若有自定义内容，AI 会进行个性化融合反馈）
export function getMoodBaseAnalysis(
  moodTitle: string,
  customWish?: string,
): MoodBaseScentAnalysis {
  const base = MOOD_BASE_SCENTS[moodTitle] || MOOD_BASE_SCENTS['松弛解压'];
  if (!customWish || !customWish.trim()) {
    return base;
  }

  const trimmed = customWish.trim();
  const enhancedFeedback = `您在选定【${moodTitle}】的同时，写下了心愿：“${trimmed}”。AI调香师特为您保留了【${base.topScentName}】作为轻盈前奏，并以【${base.baseScentName}】作为心愿沉淀。您已完成了前后调的定制——现在将屏幕交给心青年，由他为您注入核心中调！`;

  return {
    ...base,
    aiFeedbackText: enhancedFeedback,
  };
}

// 动态 AI 命名池生成器（结合香味风格、用户心境、心青年挑选、自定义内容）
export function generateCuratedPerfumeNames(params: {
  moodTitle: string;
  customWish?: string;
  soulScentName: string;
  topScentName: string;
  baseScentName: string;
  youthName: string;
}): string[] {
  const { moodTitle, customWish = '', soulScentName, youthName } = params;
  const wish = customWish.trim();

  // 根据不同灵魂香与心境构建核心诗意意象
  const moodThemeNames: Record<string, string[]> = {
    '松弛解压': [
      `雨后微风与${soulScentName}`,
      `落入橙花里的松弛信`,
      `山岚放晴时`,
      `${soulScentName}的午后小憩`,
      `云深处的呼吸`,
      `草木呼吸与浅溪`,
      `在松林深处慢下来`,
      `风止于林梢`,
    ],
    '元气明朗': [
      `阳光打翻了${soulScentName}`,
      `橘子汽水与晴空`,
      `元气晨曦的秘密`,
      `向阳而生的${soulScentName}`,
      `夏日柠檬汽水`,
      `奔向光芒的时刻`,
      `明亮如初的少年游`,
      `金色阳光切片`,
    ],
    '宁静放空': [
      `静谧${soulScentName}之约`,
      `微风吹拂的湖面`,
      `晨雾留白`,
      `山月随人归`,
      `浅浅一缕茶烟`,
      `青竹影落清池`,
      `独处的安歇之所`,
      `白水鉴心`,
    ],
    '温柔治愈': [
      `拥抱${soulScentName}的温度`,
      `人间温柔小春日`,
      `微甜治愈信笺`,
      `月光揉碎了花瓣`,
      `被春风吹软的梦`,
      `给生活一个柔软拥抱`,
      `棉花糖色的黄昏`,
      `心尖上的小确幸`,
    ],
    '自然笃定': [
      `扎根于大地的${soulScentName}`,
      `草木深处自悠然`,
      `雪松与远山的对白`,
      `泥土初醒的清晨`,
      `沉静有力的回响`,
      `心有丘壑`,
      `绿意无尽藏`,
    ],
    '心意相赠': [
      `写给时光与${soulScentName}的信`,
      `并肩走过的晨光`,
      `七月的赠礼`,
      `藏在香水里的祝福`,
      `千里同风`,
      `温柔的回音`,
      `相见甚欢`,
    ],
  };

  const pool = moodThemeNames[moodTitle] || moodThemeNames['松弛解压'];
  const candidates: string[] = [...pool];

  // 若用户有自定义输入，AI 智能提取关键词并融合命名
  if (wish) {
    if (wish.includes('雨') || wish.includes('水') || wish.includes('海')) {
      candidates.unshift(`雨打${soulScentName}轻`, `水汽氤氲时的漫步`, `晴雨之间的微甜`);
    }
    if (wish.includes('考') || wish.includes('奖励') || wish.includes('累') || wish.includes('歇')) {
      candidates.unshift(`犒赏今日的松弛`, `卸下铠甲的温柔`, `给自己的一瓣橙花`);
    }
    if (wish.includes('友') || wish.includes('闺蜜') || wish.includes('生') || wish.includes('爱') || wish.includes('送')) {
      candidates.unshift(`赠与岁月的香气信件`, `星河共赴`, `好朋友的专属配方`);
    }
    if (wish.includes('风') || wish.includes('旅行') || wish.includes('走') || wish.includes('山')) {
      candidates.unshift(`吹向远方的${soulScentName}`, `长风与旷野`, `装在瓶子里的旅程`);
    }
  }

  // 增加心青年与顾客的共创印记命名
  candidates.push(
    `${youthName}的心选之诗`,
    `我们一起调配的晴天`,
    `双人共创：第40滴温柔`,
    `闻见彼此的清晨`
  );

  // 去重返回
  return Array.from(new Set(candidates));
}

// 判断是否属于开放、随性、无特定限制的词汇（如“都可以”、“随便”、“看心情”等）
function isCasualOpenMindedWish(wish: string): boolean {
  const normalized = wish.toLowerCase().replace(/[\s,，.。!！?？~～]/g, '');
  const casualPatterns = [
    '都可以', '都行', '随便', '看心情', '你定', '看你', '随缘', '看缘分',
    '听你的', '任选', '无所谓', '不挑', '随意', '都可以吧', '都行吧',
    '随便吧', '都可以呀', '都好', '哪个都行', '只要好闻', '好闻就行',
    '你选就好', '心青年定', '你决定', '顺其自然', '放空', '随心'
  ];
  return casualPatterns.some((pattern) => normalized.includes(pattern)) || normalized.length <= 1;
}

// 格式化调香卡底部专属解析结构（满足规范 prompt 格式）
// 优先智能解读顾客意图，如果客户输入“都可以/随便”等，解读为随遇而安与彻底松弛的心境；生活场景心愿则细腻呼应
export function formatCardAnalysisNarrative(params: {
  customerName: string;
  customerMood: string;
  customWish?: string;
  topScentName: string;
  soulScentName: string;
  baseScentName: string;
  youthName: string;
}): {
  coCreationStory: string;
  harmonyAnalysis: string;
  constantQuote: string;
} {
  const {
    customerName = '特邀创作者',
    customerMood = '松弛解压',
    customWish,
    topScentName,
    soulScentName,
    baseScentName,
    youthName = '阳阳',
  } = params;

  const rawWish = customWish ? customWish.trim() : '';

  let wishInterpretation = '';
  if (rawWish) {
    if (isCasualOpenMindedWish(rawWish)) {
      // 深度解读：开放、随遇而安、全然放松的信任
      wishInterpretation = `，带着一份“随遇而安、允许一切自然发生”的全然信任与松弛`;
    } else if (rawWish.includes('雨') || rawWish.includes('草') || rawWish.includes('风') || rawWish.includes('自然') || rawWish.includes('海') || rawWish.includes('水')) {
      wishInterpretation = `，向往着如自然微风般的澄澈心境与身心全然舒展`;
    } else if (rawWish.includes('考') || rawWish.includes('奖励') || rawWish.includes('累') || rawWish.includes('歇') || rawWish.includes('自己') || rawWish.includes('放空')) {
      wishInterpretation = `，怀揣着好好犒赏自己、卸下一身疲惫的温柔心意`;
    } else if (rawWish.includes('友') || rawWish.includes('生日') || rawWish.includes('送') || rawWish.includes('祝福') || rawWish.includes('礼物')) {
      wishInterpretation = `，寄托着为重要之人定制专属心意香气的真挚心愿`;
    } else if (rawWish.includes('阳光') || rawWish.includes('甜') || rawWish.includes('元气') || rawWish.includes('开心') || rawWish.includes('果')) {
      wishInterpretation = `，向往着明朗明快、被阳光与善意环抱的心灵状态`;
    } else {
      // 提炼情感内核，升华为心境期许
      wishInterpretation = `，寄寓着“${rawWish}”的美好心境期许`;
    }
  }

  const coCreationStory = `顾客【${customerName}】带着对「${customerMood}」的期盼${wishInterpretation}，选定了【${topScentName}】作为轻盈前调，并以【${baseScentName}】作为安心定香；心青年【${youthName}】以纯粹直觉心选【${soulScentName}】作为灵魂主香注入核心，在彼此信任中共同完成了这场气味相遇。`;

  const harmonyAnalysis = `前调【${topScentName}】的清新鲜明呼应了此刻心境，中调【${soulScentName}】在心青年的挑选下绽放饱满生机，后调【${baseScentName}】的木质安定将两颗同频的心长久定格。40滴天然精油在瓶中交融，成为一段可以闻见的记忆。`;

  // 恒定表达（用户明确要求一直作为恒定表达）
  const constantQuote = '香气没有标准答案，只有你们一起选择的温柔。';

  return {
    coCreationStory,
    harmonyAnalysis,
    constantQuote,
  };
}

// 客户端异步请求服务端 Gemini AI 深度解读顾客心境并生成专属共创纪事
export async function fetchAINarrativeAnalysis(params: {
  customerName: string;
  customerMood: string;
  customWish?: string;
  topScentName: string;
  soulScentName: string;
  baseScentName: string;
  youthName: string;
}): Promise<{ coCreationStory: string; harmonyAnalysis: string } | null> {
  try {
    const res = await fetch('/api/ai-analyze-narrative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data.success && data.coCreationStory && data.harmonyAnalysis) {
      return {
        coCreationStory: data.coCreationStory,
        harmonyAnalysis: data.harmonyAnalysis,
      };
    }
    return null;
  } catch (err) {
    console.warn('[AI Narrative Fetch] Fallback to client interpretation', err);
    return null;
  }
}

