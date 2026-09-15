export interface Scent {
  id: string;
  name: string;
  englishName: string;
  note: string;
  noteLabel: string;
  category: string;
  feelingWords: string[];
  color: string;
  suitableFor: string[];
  avoidFor: string[];
  childFriendlyDescription: string;
  customerDescription: string;
}

export const SCENTS: Scent[] = [
  { id: "lemon", name: "柠檬", englishName: "Lemon", note: "top", noteLabel: "前调", category: "citrus", feelingWords: ["清新","明亮","干净","清醒"], color: "#F5E663", suitableFor: ["夏天","早晨","工作","清新","明亮","干净"], avoidFor: ["安静","沉稳","睡前"], childFriendlyDescription: "像切开的新鲜柠檬，酸酸甜甜的。", customerDescription: "清爽明亮的柑橘香气，带来清新活力。" },
  { id: "green_orange", name: "绿柑橘", englishName: "Green Mandarin", note: "top", noteLabel: "前调", category: "citrus", feelingWords: ["清新","自然","明亮","活泼"], color: "#90C978", suitableFor: ["春天","夏天","清新","自然","明亮","新开始"], avoidFor: ["沉稳","浓郁"], childFriendlyDescription: "像绿色的小橘子，清新又酸甜。", customerDescription: "比柠檬更柔和的柑橘香，清新中带点绿意。" },
  { id: "peach", name: "水蜜桃", englishName: "Peach", note: "middle", noteLabel: "中调", category: "fruity", feelingWords: ["甜美","温柔","浪漫","温暖"], color: "#FFB5A7", suitableFor: ["约会","礼物","甜美","温柔","浪漫"], avoidFor: ["清爽","干净","工作"], childFriendlyDescription: "像咬一口甜甜的桃子。", customerDescription: "甜美多汁的桃子香气，温柔可爱。" },
  { id: "jasmine", name: "茉莉", englishName: "Jasmine", note: "middle", noteLabel: "中调", category: "floral", feelingWords: ["浪漫","温柔","甜美","优雅"], color: "#F8F4E6", suitableFor: ["约会","浪漫","温柔","夜晚","优雅"], avoidFor: ["清爽","干净","男生"], childFriendlyDescription: "像晚上开的白色小花，香香的。", customerDescription: "经典花香，浪漫温柔，优雅迷人。" },
  { id: "mimosa", name: "含羞草", englishName: "Mimosa", note: "middle", noteLabel: "中调", category: "floral", feelingWords: ["温柔","安静","自然","甜美"], color: "#F0D878", suitableFor: ["春天","温柔","安静","自然"], avoidFor: ["浓郁","刺激"], childFriendlyDescription: "像一碰就会闭起来的小黄花，软软的。", customerDescription: "柔和温暖的花香，像春日阳光。" },
  { id: "violet", name: "紫罗兰", englishName: "Violet", note: "middle", noteLabel: "中调", category: "floral", feelingWords: ["温柔","浪漫","优雅","复古"], color: "#B8A9C9", suitableFor: ["浪漫","优雅","温柔","复古"], avoidFor: ["清新","清爽"], childFriendlyDescription: "像紫色的小花朵，粉粉的香。", customerDescription: "优雅复古的花香，带一丝粉质感。" },
  { id: "coconut", name: "椰子", englishName: "Coconut", note: "middle", noteLabel: "中调", category: "fruity", feelingWords: ["温暖","甜美","放松","度假"], color: "#F5F0E1", suitableFor: ["夏天","度假","温暖","放松","甜美"], avoidFor: ["清爽","干净","工作"], childFriendlyDescription: "像甜甜的椰子糖，暖暖的。", customerDescription: "温暖甜美的椰香，像海边度假。" },
  { id: "white_tea", name: "白茶", englishName: "White Tea", note: "middle", noteLabel: "中调", category: "tea", feelingWords: ["安静","干净","清新","温柔"], color: "#E8E4DC", suitableFor: ["安静","工作","干净","清新","温柔","日常"], avoidFor: ["浓郁","甜美","浪漫"], childFriendlyDescription: "像一杯安静的茶，淡淡的香。", customerDescription: "清淡雅致的茶香，安静舒适。" },
  { id: "cardamom", name: "小豆蔻", englishName: "Cardamom", note: "base", noteLabel: "后调", category: "spicy", feelingWords: ["温暖","有记忆点","自然","独特"], color: "#C4A882", suitableFor: ["温暖","有记忆点","独特","自然","礼物"], avoidFor: ["清新","清爽","夏天"], childFriendlyDescription: "像温暖的香料，有点甜甜的。", customerDescription: "温暖的辛香，独特有记忆点。" },
  { id: "osmanthus", name: "金桂", englishName: "Osmanthus", note: "middle", noteLabel: "中调", category: "floral", feelingWords: ["甜美","温柔","浪漫","祝福"], color: "#F0C674", suitableFor: ["秋天","浪漫","甜美","温柔","祝福","礼物"], avoidFor: ["清爽","干净","工作"], childFriendlyDescription: "像秋天树上的小黄花，甜甜的。", customerDescription: "甜美温柔的桂花香，浪漫祝福。" },
  { id: "rose", name: "玫瑰", englishName: "Rose", note: "top", noteLabel: "前调", category: "floral", feelingWords: ["浪漫","温柔","优雅","甜美"], color: "#D4739C", suitableFor: ["约会","浪漫","温柔","优雅","礼物"], avoidFor: ["清爽","干净","男生"], childFriendlyDescription: "像红红的玫瑰花，香香的。", customerDescription: "经典浪漫玫瑰香，温柔优雅。" },
  { id: "lily_of_the_valley", name: "铃兰", englishName: "Lily of the Valley", note: "middle", noteLabel: "中调", category: "floral", feelingWords: ["清新","温柔","纯洁","浪漫"], color: "#E8F0D8", suitableFor: ["春天","浪漫","清新","温柔","纯洁"], avoidFor: ["浓郁","温暖"], childFriendlyDescription: "像一串串白色小铃铛花。", customerDescription: "清新纯洁的铃兰香，温柔浪漫。" },
  { id: "green_tea", name: "绿茶", englishName: "Green Tea", note: "middle", noteLabel: "中调", category: "tea", feelingWords: ["清新","干净","自然","安静"], color: "#B8D4A0", suitableFor: ["夏天","清新","干净","自然","安静","工作"], avoidFor: ["甜美","浓郁","浪漫"], childFriendlyDescription: "像一杯淡淡的绿茶，清清的。", customerDescription: "清新淡雅的绿茶香，干净自然。" },
  { id: "clove", name: "丁香", englishName: "Clove", note: "base", noteLabel: "后调", category: "spicy", feelingWords: ["温暖","有记忆点","浓郁","独特"], color: "#8B4513", suitableFor: ["冬天","温暖","有记忆点","独特"], avoidFor: ["清新","清爽","夏天","淡雅"], childFriendlyDescription: "像一种棕色的小香料，有点辣辣的。", customerDescription: "温暖浓郁的辛香，独特有记忆点。" },
  { id: "sandalwood", name: "檀香", englishName: "Sandalwood", note: "base", noteLabel: "后调", category: "woody", feelingWords: ["沉稳","安静","温暖","有记忆点"], color: "#C4A57C", suitableFor: ["安静","沉稳","温暖","有记忆点","冥想"], avoidFor: ["清新","清爽","活泼"], childFriendlyDescription: "像木头做的佛珠，安静的香。", customerDescription: "沉稳温暖的木质香，安静有深度。" },
  { id: "cedar", name: "雪松", englishName: "Cedarwood", note: "base", noteLabel: "后调", category: "woody", feelingWords: ["沉稳","干净","自然","有记忆点"], color: "#9E8B6E", suitableFor: ["森林","沉稳","干净","自然","有记忆点","工作"], avoidFor: ["甜美","浪漫","活泼"], childFriendlyDescription: "像下雪的松树，干净的木头味。", customerDescription: "干净沉稳的雪松木香，自然有质感。" },
  { id: "synthetic_musk", name: "白麝香", englishName: "White Musk", note: "base", noteLabel: "后调", category: "musk", feelingWords: ["干净","温柔","有记忆点","舒适"], color: "#F0ECE4", suitableFor: ["日常","干净","温柔","有记忆点","舒适","工作"], avoidFor: ["浓郁","独特","刺激"], childFriendlyDescription: "像干净的衣服，软软的香。", customerDescription: "干净温柔的白麝香，舒适亲肤。" },
  { id: "ambergris", name: "龙涎香", englishName: "Ambergris", note: "base", noteLabel: "后调", category: "amber", feelingWords: ["温暖","有记忆点","独特","神秘"], color: "#D4A574", suitableFor: ["温暖","有记忆点","独特","神秘","个性"], avoidFor: ["清新","清爽","淡雅"], childFriendlyDescription: "像海边捡到的宝贝，暖暖的。", customerDescription: "温暖独特的琥珀香，神秘有记忆点。" },
];

export const FEELING_POOL = ["清新","温柔","明亮","安静","温暖","自然","甜美","干净","沉稳","浪漫","祝福","清醒","放松","有记忆点","活泼","优雅","纯洁","独特","自由","舒适"];

export const EMOTION_MAP = [
  { keywords: ['累','疲惫','压力','焦虑','紧张','烦','郁闷'], feelings: ['放松'], intensity: 'medium' },
  { keywords: ['清醒','精神','工作','专注','学习','提神'], feelings: ['清醒'], intensity: 'medium' },
  { keywords: ['安慰','陪伴','治愈','安全感','安心','温馨'], feelings: ['温暖'], intensity: 'medium' },
  { keywords: ['毕业','新开始','出发','勇敢','新阶段','启程'], feelings: ['明亮','祝福'], intensity: 'medium' },
  { keywords: ['安静','一个人','睡前','独处','宁静','静谧'], feelings: ['安静'], intensity: 'light' },
  { keywords: ['开心','轻快','活泼','欢乐','愉快','高兴'], feelings: ['明亮','甜美'], intensity: 'medium' },
  { keywords: ['自然','森林','户外','草地','树木','山野'], feelings: ['自然'], intensity: 'medium' },
  { keywords: ['高级','克制','不甜','干净','简约','极简'], feelings: ['干净','沉稳'], intensity: 'light' },
  { keywords: ['浪漫','爱情','甜蜜','心动','约会'], feelings: ['浪漫','甜美'], intensity: 'medium' },
  { keywords: ['礼物','朋友','送人','祝福','纪念'], feelings: ['祝福','温暖'], intensity: 'medium' },
  { keywords: ['温柔','柔软','细腻','体贴','呵护'], feelings: ['温柔'], intensity: 'medium' },
  { keywords: ['夏天','清爽','凉快','冰凉','清凉'], feelings: ['清新'], intensity: 'light' },
  { keywords: ['有记忆点','特别','独特','难忘','个性'], feelings: ['有记忆点','独特'], intensity: 'rich' }
];

export const SCENE_MAP = [
  { keywords: ['夏天','海边','清爽','热带'], scenes: ['夏天','清新'], feelings: ['清新','明亮'] },
  { keywords: ['春天','花园','花开','花季'], scenes: ['春天','花香'], feelings: ['温柔','自然'] },
  { keywords: ['雨后','下雨','湿润','雨滴'], scenes: ['雨后','清新'], feelings: ['清新','安静'] },
  { keywords: ['森林','树','木头','木质','木'], scenes: ['森林','木质'], feelings: ['自然','安静','沉稳'] },
  { keywords: ['早晨','阳光','晨光','日出','早上'], scenes: ['早晨','明亮'], feelings: ['明亮','清新'] },
  { keywords: ['夜晚','睡前','晚安','黑夜','夜色'], scenes: ['夜晚','安静'], feelings: ['安静','温暖'] },
  { keywords: ['工作','办公','职场','商务'], scenes: ['工作'], feelings: ['清醒','干净'] },
  { keywords: ['约会','浪漫','见面','烛光'], scenes: ['约会'], feelings: ['温柔','明亮','浪漫'] },
  { keywords: ['礼物','送人','赠送','心意'], scenes: ['礼物'], feelings: ['祝福','温暖'] },
  { keywords: ['毕业','同学','学校','离别'], scenes: ['毕业'], feelings: ['明亮','祝福','新开始'] }
];

export const AVOID_MAP = [
  { keywords: ['不要太甜','不甜','不喜欢甜','少甜'], avoid: 'sweet' },
  { keywords: ['不要太浓','不要厚重','不要太强烈','淡一点'], avoid: 'rich' },
  { keywords: ['不喜欢花香','不要花','不要花香','太花'], avoid: 'floral' },
  { keywords: ['不喜欢木质','不要木头','不要木','太木'], avoid: 'woody' },
  { keywords: ['不要刺激','不喜欢凉','不要太凉','不要薄荷'], avoid: 'stimulating' },
  { keywords: ['不要粉感','不要粉','太粉'], avoid: 'powdery' },
  { keywords: ['不要药感','不要药','太药'], avoid: 'medicinal' }
];

export const AVOID_RULES: Record<string, { scents: string[]; penalty: number }> = {
  sweet: { scents: ['peach','coconut','osmanthus'], penalty: -5 },
  rich: { scents: ['rose','clove','ambergris'], penalty: -5 },
  floral: { scents: ['rose','jasmine','lily_of_the_valley','violet','mimosa','osmanthus'], penalty: -6 },
  woody: { scents: ['sandalwood','cedar','ambergris'], penalty: -5 },
  stimulating: { scents: ['clove'], penalty: -5 },
  powdery: { scents: ['violet'], penalty: -4 },
  medicinal: { scents: ['clove'], penalty: -5 }
};
