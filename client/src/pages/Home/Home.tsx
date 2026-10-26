import React, { useState, useCallback, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import {
  Sparkles,
  Download,
  Check,
  RotateCcw,
  Droplets,
  ArrowRight,
  ArrowLeft,
  Heart,
  Volume2,
  Users,
  Camera,
  X,
  UserPlus,
  Palette,
  Upload,
  Loader2,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import {
  getCandidateSoulScents,
  generateDirectionWithSoul,
  generateStoryCard,
  INITIAL_APP_STATE,
  type AppState,
  type SoulScentCandidate,
} from './perfume-algorithm';
import {
  generateCuratedPerfumeNames,
  fetchAINarrativeAnalysis,
} from './ai-perfume-engine';
import { DEFAULT_YOUTH_ARTWORKS } from './youth-artworks';
import { generateNoteSVG } from './svg-generator';
import '@/styles/perfume.css';
import { toast } from 'sonner';
import { getScentImage } from '@/assets/scents';
import { saveFormula } from '@/api/formula';
import logoWide from '@/assets/adaptive/logo1.png';
import bgSrc from '@/assets/story-bg.jpg';

// 导入心适力 6 大香味风格情境画底图 (由用户上传至 /assets/pics in mood/)
import moodRelaxingImg from '@/assets/pics in mood/Relaxing Forest Mist.jpg';
import moodVitalityImg from '@/assets/pics in mood/Energetic Citrus Sun.jpg';
import moodSereneImg from '@/assets/pics in mood/Silent Clear Water Tea.jpg';
import moodHealingImg from '@/assets/pics in mood/Gentle Soft Hug.jpg';
import moodNatureImg from '@/assets/pics in mood/Natural Grass Rooted.jpg';
import moodGiftImg from '@/assets/pics in mood/Gift Fresh Sweetness.jpg';

// 心青年档案接口
export interface HeartYouthProfile {
  id: string;
  name: string;
  avatar: string; // 表情符号头像 或 图片 Base64 / URL
  personality: string; // 性格与爱好
  favoriteScent: string; // 擅长/喜爱的香气
  greeting: string; // 亲切迎客寄语
  artworkImage?: string; // 心青年手绘画作
  artworkTitle?: string; // 画作名称
}

// 预设心青年调香团队（包含真实艺术画作与丰富爱好）
const DEFAULT_YOUTH_PROFILES: HeartYouthProfile[] = [
  {
    id: 'youth_1',
    name: '阳阳',
    avatar: '☀️',
    personality: '专注沉静 · 喜欢手绘画画与大自然',
    favoriteScent: '佛手柑 · 甜橙 · 草木香',
    greeting: '你好呀！我是阳阳，今天由我为你挑选灵魂主香，希望香气带给你好心情！',
    artworkImage: DEFAULT_YOUTH_ARTWORKS.youth_1.imageUrl,
    artworkTitle: DEFAULT_YOUTH_ARTWORKS.youth_1.title,
  },
  {
    id: 'youth_2',
    name: '晨晨',
    avatar: '🌱',
    personality: '细腻温柔 · 喜爱茶艺与安静阅读',
    favoriteScent: '白茶 · 小苍兰 · 绿竹',
    greeting: '你好，我是晨晨。很高兴能和你一起调香，让我们用香味记录下美好的一天。',
    artworkImage: DEFAULT_YOUTH_ARTWORKS.youth_2.imageUrl,
    artworkTitle: DEFAULT_YOUTH_ARTWORKS.youth_2.title,
  },
  {
    id: 'youth_3',
    name: '乐乐',
    avatar: '🎨',
    personality: '活泼开朗 · 喜欢缤纷色彩与交朋友',
    favoriteScent: '水蜜桃 · 檀木 · 葡萄柚',
    greeting: '欢迎来到调香工坊！我叫乐乐，今天为你调配专属于你的快乐味道！',
    artworkImage: DEFAULT_YOUTH_ARTWORKS.youth_3.imageUrl,
    artworkTitle: DEFAULT_YOUTH_ARTWORKS.youth_3.title,
  },
];

const PRESET_MOODS = [
  {
    id: 'relax',
    serial: '01',
    enName: 'FOREST MIST',
    tag: '雨后林草',
    title: '松弛解压',
    desc: '卸下疲惫，自由深呼吸',
    notes: '冷杉 · 苔藓 · 雨后青草',
    wish: '想要一瓶松弛解压、清爽不腻的香气，像雨后森林般放松',
    image: moodRelaxingImg,
    scenicSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
  <defs>
    <linearGradient id="g_relax_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F3F9F4"/>
      <stop offset="60%" stop-color="#E5F3E7"/>
      <stop offset="100%" stop-color="#D2E8D6"/>
    </linearGradient>
    <linearGradient id="g_relax_beam" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF2" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="#FFFDF2" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="300" height="240" fill="url(#g_relax_bg)"/>
  <polygon points="0,0 90,0 190,240 60,240" fill="url(#g_relax_beam)"/>
  <path d="M-20,110 Q60,70 160,95 T320,75 L320,240 L-20,240 Z" fill="#C2E2C9" opacity="0.65"/>
  <ellipse cx="140" cy="95" rx="140" ry="30" fill="#E8F7EC" opacity="0.8"/>
  <path d="M-10,140 Q80,110 190,130 T320,115 L320,240 L-10,240 Z" fill="#A8D4B2" opacity="0.55"/>
  <path d="M225,55 L233,105 L217,105 Z M225,75 L238,125 L212,125 Z" fill="#78B385" opacity="0.65"/>
  <path d="M255,75 L262,115 L248,115 Z M255,90 L266,135 L244,135 Z" fill="#65A373" opacity="0.6"/>
  <circle cx="85" cy="80" r="3.5" fill="#83A94A" opacity="0.55"/>
  <circle cx="150" cy="60" r="2.5" fill="#83A94A" opacity="0.45"/>
</svg>`,
  },
  {
    id: 'vitality',
    serial: '02',
    enName: 'GOLDEN CITRUS',
    tag: '日光柑橘',
    title: '元气明朗',
    desc: '唤醒活力，拥抱阳光好状态',
    notes: '甜橙 · 佛手柑 · 暖阳橙花',
    wish: '想要一瓶充满阳光、明亮清新的柑橘草木香水，元气满满',
    image: moodVitalityImg,
    scenicSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
  <defs>
    <linearGradient id="g_vital_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF5"/>
      <stop offset="50%" stop-color="#FEF5DF"/>
      <stop offset="100%" stop-color="#FDE8B8"/>
    </linearGradient>
    <radialGradient id="g_vital_sun" cx="75%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#FDE047" stop-opacity="0.65"/>
      <stop offset="50%" stop-color="#FBBF24" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="300" height="240" fill="url(#g_vital_bg)"/>
  <circle cx="225" cy="65" r="70" fill="url(#g_vital_sun)"/>
  <circle cx="225" cy="65" r="22" fill="#FEF08A" opacity="0.95"/>
  <path d="M225,65 L130,240 L90,240 Z" fill="#FEF9C3" opacity="0.5"/>
  <path d="M-20,115 Q70,85 170,110 T320,95 L320,240 L-20,240 Z" fill="#FCD385" opacity="0.55"/>
  <path d="M-10,145 Q80,120 190,135 T310,125 L310,240 L-10,240 Z" fill="#FBBF24" opacity="0.4"/>
  <circle cx="65" cy="95" r="14" fill="#F59E0B" opacity="0.45"/>
  <circle cx="95" cy="110" r="11" fill="#EA580C" opacity="0.35"/>
  <ellipse cx="56" cy="84" rx="7" ry="3.5" transform="rotate(-25 56 84)" fill="#84CC16" opacity="0.6"/>
  <circle cx="160" cy="50" r="3" fill="#F59E0B" opacity="0.45"/>
</svg>`,
  },
  {
    id: 'serene',
    serial: '03',
    enName: 'STILL WATER',
    tag: '清澄水感',
    title: '宁静放空',
    desc: '抚平浮躁，让思绪慢下来',
    notes: '龙井冷萃 · 睡莲 · 雪松',
    wish: '想要一瓶安静澄澈的茶香或水感香水，像独处时的微风',
    image: moodSereneImg,
    scenicSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
  <defs>
    <linearGradient id="g_serene_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F4FAFD"/>
      <stop offset="55%" stop-color="#E1EFF8"/>
      <stop offset="100%" stop-color="#CCE3F4"/>
    </linearGradient>
    <radialGradient id="g_serene_glow" cx="30%" cy="28%" r="45%">
      <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="#BAE6FD" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#7DD3FC" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="300" height="240" fill="url(#g_serene_bg)"/>
  <circle cx="90" cy="60" r="42" fill="url(#g_serene_glow)"/>
  <circle cx="90" cy="60" r="16" fill="#FFFFFF" opacity="0.9"/>
  <path d="M-20,95 Q50,65 140,85 T320,70 L320,240 L-20,240 Z" fill="#BAE6FD" opacity="0.55"/>
  <path d="M-10,125 Q90,95 200,115 T320,105 L320,240 L-10,240 Z" fill="#93C5FD" opacity="0.45"/>
  <ellipse cx="90" cy="140" rx="45" ry="3.5" fill="#38BDF8" opacity="0.4"/>
  <ellipse cx="115" cy="155" rx="65" ry="4" fill="#0284C7" opacity="0.28"/>
  <ellipse cx="80" cy="170" rx="35" ry="3" fill="#38BDF8" opacity="0.28"/>
  <circle cx="210" cy="55" r="2.5" fill="#0284C7" opacity="0.4"/>
</svg>`,
  },
  {
    id: 'healing',
    serial: '04',
    enName: 'VELVET ROSE',
    tag: '柔粉甜香',
    title: '温柔治愈',
    desc: '温暖怀抱，甜美舒心',
    notes: '晚香玉 · 白桃 · 羊绒麝香',
    wish: '想要一瓶温柔治愈、甜而不齁的香气，像柔软的怀抱',
    image: moodHealingImg,
    scenicSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
  <defs>
    <linearGradient id="g_heal_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDF4F7"/>
      <stop offset="50%" stop-color="#FBE6ED"/>
      <stop offset="100%" stop-color="#F8D3E0"/>
    </linearGradient>
    <radialGradient id="g_heal_glow" cx="80%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#FCE7F3" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#F472B6" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#DB2777" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="300" height="240" fill="url(#g_heal_bg)"/>
  <circle cx="225" cy="65" r="65" fill="url(#g_heal_glow)"/>
  <circle cx="225" cy="65" r="20" fill="#FFF1F2" opacity="0.95"/>
  <path d="M-20,90 Q80,55 180,85 T320,65 L320,240 L-20,240 Z" fill="#FBCFE8" opacity="0.6"/>
  <path d="M-10,125 Q100,95 200,120 T320,105 L320,240 L-10,240 Z" fill="#F472B6" opacity="0.38"/>
  <path d="M70,68 C82,54 96,68 87,85 C73,85 64,76 70,68 Z" fill="#EC4899" opacity="0.35"/>
  <path d="M120,95 C129,86 139,96 133,107 C122,107 115,102 120,95 Z" fill="#DB2777" opacity="0.28"/>
  <circle cx="160" cy="50" r="2.5" fill="#DB2777" opacity="0.4"/>
  <circle cx="265" cy="115" r="3" fill="#F472B6" opacity="0.35"/>
</svg>`,
  },
  {
    id: 'nature',
    serial: '05',
    enName: 'NOBLE CEDAR',
    tag: '沉静木质',
    title: '自然笃定',
    desc: '草木沉静，安心从容',
    notes: '愈创木 · 檀香 · 大地雪松',
    wish: '想要一瓶沉稳安宁的木质香气，让人心静笃定',
    image: moodNatureImg,
    scenicSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
  <defs>
    <linearGradient id="g_nature_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF7F2"/>
      <stop offset="55%" stop-color="#EFE8DD"/>
      <stop offset="100%" stop-color="#E2D7C7"/>
    </linearGradient>
    <radialGradient id="g_nature_amber" cx="25%" cy="32%" r="45%">
      <stop offset="0%" stop-color="#FEF3C7" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#B45309" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="300" height="240" fill="url(#g_nature_bg)"/>
  <circle cx="75" cy="65" r="50" fill="url(#g_nature_amber)"/>
  <circle cx="75" cy="65" r="18" fill="#FFFBEB" opacity="0.95"/>
  <path d="M-20,95 Q70,70 170,90 T320,75 L320,240 L-20,240 Z" fill="#D7C9B8" opacity="0.6"/>
  <path d="M-10,125 Q90,105 190,120 T320,110 L320,240 L-10,240 Z" fill="#BFAF9B" opacity="0.45"/>
  <ellipse cx="240" cy="170" rx="150" ry="100" fill="none" stroke="#A89279" stroke-width="1.6" stroke-dasharray="6 4" opacity="0.38"/>
  <ellipse cx="240" cy="170" rx="100" ry="68" fill="none" stroke="#8C7358" stroke-width="1.6" opacity="0.35"/>
  <circle cx="240" cy="170" r="14" fill="#B45309" opacity="0.38"/>
  <circle cx="130" cy="45" r="2.5" fill="#78350F" opacity="0.35"/>
</svg>`,
  },
  {
    id: 'gift',
    serial: '06',
    enName: 'CELEBRATION',
    tag: '特别纪念',
    title: '心意相赠',
    desc: '传递祝福，特别纪念',
    notes: '红浆果 · 肉桂 · 温暖琥珀',
    wish: '想要调配一瓶送给重要朋友的香氛礼物，有记忆点又温暖',
    image: moodGiftImg,
    scenicSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
  <defs>
    <linearGradient id="g_gift_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF8F4"/>
      <stop offset="50%" stop-color="#FEEAE0"/>
      <stop offset="100%" stop-color="#FCDAC8"/>
    </linearGradient>
    <radialGradient id="g_gift_glow" cx="70%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.9"/>
      <stop offset="45%" stop-color="#FDBA74" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#F97316" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="300" height="240" fill="url(#g_gift_bg)"/>
  <circle cx="210" cy="65" r="60" fill="url(#g_gift_glow)"/>
  <path d="M210,46 L213,62 L229,65 L213,68 L210,84 L207,68 L191,65 L207,62 Z" fill="#F59E0B" opacity="0.85"/>
  <path d="M-20,85 C60,130 140,50 240,105 C290,130 310,120 320,110 L320,240 L-20,240 Z" fill="#FCA5A5" opacity="0.45"/>
  <path d="M-20,125 C50,165 160,100 260,145 T320,135 L320,240 L-20,240 Z" fill="#F87171" opacity="0.3"/>
  <path d="M-20,105 Q80,155 180,85 T320,115" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.55"/>
  <circle cx="70" cy="65" r="2.5" fill="#F59E0B" opacity="0.5"/>
  <circle cx="140" cy="115" r="2" fill="#EF4444" opacity="0.4"/>
</svg>`,
  },
];

// 预设专属顾问头像库（真实视觉图像，非表情，支持一键选取）
const PRESET_ADVISOR_AVATARS = [
  {
    id: 'art_yang',
    name: '阳阳款',
    desc: '暖阳与林木手绘',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <rect width="100" height="100" fill="#FFF3E0"/>
  <circle cx="50" cy="50" r="46" fill="#FFE0B2"/>
  <circle cx="50" cy="38" r="18" fill="#F28C52"/>
  <path d="M22 84 C26 62, 74 62, 78 84 Z" fill="#83A94A"/>
  <circle cx="50" cy="34" r="14" fill="#FFCC80"/>
  <path d="M38 30 Q50 20 62 30" stroke="#E65100" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`)}`,
  },
  {
    id: 'art_chen',
    name: '晨晨款',
    desc: '清雅绿意与茶香',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <rect width="100" height="100" fill="#E8F5E9"/>
  <circle cx="50" cy="50" r="46" fill="#C8E6C9"/>
  <circle cx="50" cy="38" r="18" fill="#43A047"/>
  <path d="M22 84 C26 62, 74 62, 78 84 Z" fill="#2E7D32"/>
  <circle cx="50" cy="34" r="14" fill="#A5D6A7"/>
  <path d="M38 28 C45 22, 55 22, 62 28" stroke="#1B5E20" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`)}`,
  },
  {
    id: 'art_lele',
    name: '乐乐款',
    desc: '跳跃色彩与活力',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <rect width="100" height="100" fill="#FCE4EC"/>
  <circle cx="50" cy="50" r="46" fill="#F8BBD0"/>
  <circle cx="50" cy="38" r="18" fill="#EC407A"/>
  <path d="M22 84 C26 62, 74 62, 78 84 Z" fill="#5C6BC0"/>
  <circle cx="50" cy="34" r="14" fill="#FF80AB"/>
  <path d="M40 26 Q50 18 60 26" stroke="#C2185B" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`)}`,
  },
  {
    id: 'art_tian',
    name: '天天款',
    desc: '纯真专注草木风',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <rect width="100" height="100" fill="#E0F2F1"/>
  <circle cx="50" cy="50" r="46" fill="#B2DFDB"/>
  <circle cx="50" cy="38" r="18" fill="#00897B"/>
  <path d="M22 84 C26 62, 74 62, 78 84 Z" fill="#FFB74D"/>
  <circle cx="50" cy="34" r="14" fill="#80CBC4"/>
  <path d="M38 30 Q50 22 62 30" stroke="#004D40" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`)}`,
  },
];

// 头像渲染组件（支持图片与表情）
function YouthAvatarDisplay({ avatar, size = 52 }: { avatar: string; size?: number }) {
  const isImage = avatar?.startsWith('data:') || avatar?.startsWith('http') || avatar?.startsWith('/');
  if (isImage) {
    return (
      <div className="youth-avatar-circle" style={{ width: size, height: size }}>
        <img src={avatar} alt="心青年头像" className="youth-avatar-img" />
      </div>
    );
  }
  return (
    <div
      className="youth-avatar-circle"
      style={{ width: size, height: size, fontSize: Math.floor(size * 0.52) }}
    >
      {avatar || '☀️'}
    </div>
  );
}

export default function Home() {
  // 0: 首页与认识心青年 | 1: 顾客选心境与底香 | 2: 心青年荐主香 | 3: 实物配香与署名 | 4: 成果调香卡
  const [step, setStep] = useState(0);
  const [state, setState] = useState<AppState>({ ...INITIAL_APP_STATE });

  // 心青年团队与当班设置 (支持后台录入与持久化)
  const [youthList, setYouthList] = useState<HeartYouthProfile[]>(() => {
    try {
      const saved = localStorage.getItem('heart_youth_profiles');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_YOUTH_PROFILES;
  });
  const [activeYouthId, setActiveYouthId] = useState<string>(() => {
    try {
      return localStorage.getItem('active_youth_id') || DEFAULT_YOUTH_PROFILES[0].id;
    } catch {
      return DEFAULT_YOUTH_PROFILES[0].id;
    }
  });

  // 获取当前当班心青年
  const currentYouth = youthList.find((y) => y.id === activeYouthId) || youthList[0];

  // 心青年管理状态
  const [showYouthAdmin, setShowYouthAdmin] = useState(false); // 换班选择当班青年
  const [showAddYouthModal, setShowAddYouthModal] = useState(false); // 独立录入新青年弹窗
  const [newYouthName, setNewYouthName] = useState('');
  const [newYouthPersonality, setNewYouthPersonality] = useState('');
  const [newYouthAvatar, setNewYouthAvatar] = useState<string>(PRESET_ADVISOR_AVATARS[0].url);
  const [newYouthArtwork, setNewYouthArtwork] = useState<string>('');
  const [newYouthArtworkTitle, setNewYouthArtworkTitle] = useState<string>('');

  // 摄像头自拍控制
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const artworkFileInputRef = useRef<HTMLInputElement>(null);

  // 步骤 1: 顾客心境与自定义输入 (未选定时为 null，保持画面纯粹清爽)
  const [selectedMoodIdx, setSelectedMoodIdx] = useState<number | null>(null);
  const [customerCustomWish, setCustomerCustomWish] = useState('');
  const moodDetailRef = useRef<HTMLDivElement>(null);

  // 步骤 2: 心青年灵魂香候选与选定
  const [candidateSouls, setCandidateSouls] = useState<SoulScentCandidate[]>([]);
  const [selectedSoulId, setSelectedSoulId] = useState<string>('');

  // 步骤 3: 顾客署名与香水名称自定义
  const [customerName, setCustomerName] = useState('特邀创作者');
  const [nameCandidates, setNameCandidates] = useState<string[]>([]);
  const [nameCandidateIdx, setNameCandidateIdx] = useState(0);

  // 结果与图片生成
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [aiNarrativeLoading, setAiNarrativeLoading] = useState(false);

  // 持久化保存心青年档案
  useEffect(() => {
    try {
      localStorage.setItem('heart_youth_profiles', JSON.stringify(youthList));
      localStorage.setItem('active_youth_id', activeYouthId);
    } catch {}
  }, [youthList, activeYouthId]);

  const updateState = useCallback((u: Partial<AppState>) => {
    setState((p) => ({ ...p, ...u }));
  }, []);

  const goToStart = useCallback(() => {
    setStep(0);
    setState({ ...INITIAL_APP_STATE });
    setSelectedMoodIdx(null);
    setCustomerCustomWish('');
    setCandidateSouls([]);
    setSelectedSoulId('');
    setPreviewImage(null);
  }, []);

  // 切换当班心青年
  const handleSelectYouth = (id: string) => {
    setActiveYouthId(id);
    setShowYouthAdmin(false);
    toast.success('已切换当班特邀调香师！');
  };

  // 启动摄像头拍照
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 400 }, height: { ideal: 400 } },
        audio: false,
      });
      setCameraStream(stream);
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      toast.error('无法启动摄像头，请检查权限或使用本地相册上传照片');
    }
  };

  // 关闭摄像头
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  };

  // 拍摄自拍截帧
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth || 300, video.videoHeight || 300);
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const sx = ((video.videoWidth || 300) - size) / 2;
      const sy = ((video.videoHeight || 300) - size) / 2;
      ctx.drawImage(video, sx, sy, size, size, 0, 0, 160, 160);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setNewYouthAvatar(dataUrl);
      toast.success('自拍头像拍摄成功！');
    }
    stopCamera();
  };

  // 上传头像图片文件
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setNewYouthAvatar(result);
      toast.success('头像照片已上传！');
    };
    reader.readAsDataURL(file);
  };

  // 上传画作图片文件
  const handleArtworkFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setNewYouthArtwork(result);
      toast.success('心青年画作已载入！');
    };
    reader.readAsDataURL(file);
  };

  // 添加新心青年
  const handleAddYouth = () => {
    if (!newYouthName.trim()) {
      toast.error('请输入心青年的名字');
      return;
    }
    const finalGreeting = `你好呀！我是${newYouthName.trim()}，今天由我为你挑选灵魂主香，希望带给你好心情！`;

    const newProfile: HeartYouthProfile = {
      id: `youth_${Date.now()}`,
      name: newYouthName.trim(),
      avatar: newYouthAvatar || '🌟',
      personality: newYouthPersonality.trim() || '专注沉静 · 喜欢画画与大自然',
      favoriteScent: '清新柑橘 · 草木香',
      greeting: finalGreeting,
      artworkImage: newYouthArtwork || DEFAULT_YOUTH_ARTWORKS.youth_1.imageUrl,
      artworkTitle: newYouthArtworkTitle.trim() || `《${newYouthName.trim()}的手绘日记》`,
    };

    const updated = [...youthList, newProfile];
    setYouthList(updated);
    setActiveYouthId(newProfile.id);
    setNewYouthName('');
    setNewYouthPersonality('');
    setNewYouthAvatar(PRESET_ADVISOR_AVATARS[0].url);
    setNewYouthArtwork('');
    setNewYouthArtworkTitle('');
    setShowAddYouthModal(false);
    toast.success(`已登记并切换为当班调香顾问：${newProfile.name}`);
  };

  // 步骤 1: 确认心境并进入主香推荐
  const handleConfirmMood = () => {
    if (selectedMoodIdx === null) {
      toast.error('请先在上方挑选一款香味风格');
      return;
    }
    const presetWish = PRESET_MOODS[selectedMoodIdx].wish;
    const fullWish = customerCustomWish.trim()
      ? `${presetWish}。特别心愿：${customerCustomWish.trim()}`
      : presetWish;

    updateState({ customerWish: fullWish });

    // 计算心青年可选的 3 款直观灵魂香
    const candidates = getCandidateSoulScents(fullWish);
    setCandidateSouls(candidates);
    if (candidates.length > 0) {
      setSelectedSoulId(candidates[0].scent.id);
    }
    setStep(2);
  };

  // 步骤 2: 选定主香并生成配比与 AI 命名
  const handleConfirmSoul = () => {
    const chosenSoulId = selectedSoulId || candidateSouls[0]?.scent.id || 'peach';
    const chosenSoul = candidateSouls.find((c) => c.scent.id === chosenSoulId);
    const soulName = chosenSoul?.scent.name || '心选主香';
    const moodItem = PRESET_MOODS[selectedMoodIdx ?? 0];

    const res = generateDirectionWithSoul(
      state.customerWish || moodItem.wish,
      chosenSoulId
    );

    // AI 生成多个定制香水名称候选
    const generatedNames = generateCuratedPerfumeNames({
      moodTitle: moodItem.title,
      customWish: customerCustomWish,
      soulScentName: soulName,
      topScentName: res.finalFormula.formula.top[0]?.name || '柑橘清风',
      baseScentName: res.finalFormula.formula.base[0]?.name || '雪松木质',
      youthName: currentYouth.name,
    });

    setNameCandidates(generatedNames);
    setNameCandidateIdx(0);

    const initialPerfumeName = generatedNames[0] || res.perfumeName;

    updateState({
      direction: res.direction,
      finalFormula: res.finalFormula,
      perfumeName: initialPerfumeName,
      simplifiedFeelings: res.simpleFeelings,
    });
    setStep(3);
  };

  // 切换下一个 AI 香水命名
  const handleRerollPerfumeName = () => {
    if (nameCandidates.length === 0) return;
    const nextIdx = (nameCandidateIdx + 1) % nameCandidates.length;
    setNameCandidateIdx(nextIdx);
    const newName = nameCandidates[nextIdx];
    updateState({ perfumeName: newName });
    toast.success(`AI 已切换香气命名为「${newName}」 ✨`);
  };

  // 步骤 3 -> 步骤 4: 生成调香卡
  const handleCompleteCrafting = () => {
    const chosenSoul = candidateSouls.find((c) => c.scent.id === selectedSoulId);
    const soulName = chosenSoul?.scent.name || '心选香气';
    const finalCustName = customerName.trim() || '特邀创作者';
    const finalTopScent = state.finalFormula?.formula.top[0]?.name || '柑橘微风';
    const finalBaseScent = state.finalFormula?.formula.base[0]?.name || '雪松木质';
    const moodItem = PRESET_MOODS[selectedMoodIdx ?? 0];
    const currentMoodTitle = moodItem.title;

    const card = generateStoryCard({
      customerWish: state.customerWish || moodItem.wish,
      customerMood: currentMoodTitle,
      customWish: customerCustomWish,
      simplifiedFeelings: state.simplifiedFeelings,
      finalFormula: state.finalFormula,
      perfumeName: state.perfumeName || '无名香气',
      customerName: finalCustName,
      heartYouthName: `调香顾问 ${currentYouth.name}`,
      soulScentName: soulName,
      topScentName: finalTopScent,
      baseScentName: finalBaseScent,
      youthArtworkImage: currentYouth.artworkImage,
      youthArtworkTitle: currentYouth.artworkTitle,
    });

    updateState({ storyCard: card });

    if (state.direction && state.finalFormula) {
      saveFormula({
        customerWish: state.customerWish || moodItem.wish,
        perfumeName: state.perfumeName,
        directionName: state.direction.name,
        feelings: state.simplifiedFeelings,
        formula: {
          top: state.finalFormula.formula.top.map((i) => ({ name: i.name, drops: `${i.drops}` })),
          middle: state.finalFormula.formula.middle.map((i) => ({ name: i.name, drops: `${i.drops}` })),
          base: state.finalFormula.formula.base.map((i) => ({ name: i.name, drops: `${i.drops}` })),
        },
        storyCard: card,
      });
    }

    setStep(4);
    toast.success('调制完成，专属共创调香卡已就绪！');

    // 触发 AI 深度解读：若有自定义输入或需要AI定制分析，异步生成更有温度的共创纪事
    if (customerCustomWish && customerCustomWish.trim()) {
      setAiNarrativeLoading(true);
      fetchAINarrativeAnalysis({
        customerName: finalCustName,
        customerMood: currentMoodTitle,
        customWish: customerCustomWish,
        topScentName: finalTopScent,
        soulScentName: soulName,
        baseScentName: finalBaseScent,
        youthName: currentYouth.name,
      })
        .then((aiRes) => {
          if (aiRes) {
            updateState({
              storyCard: {
                ...card,
                coCreationStory: aiRes.coCreationStory,
                harmonyAnalysis: aiRes.harmonyAnalysis,
              },
            });
            toast.success('AI 已完成气味心境深度解读与共创纪事！ ✨');
          }
        })
        .finally(() => {
          setAiNarrativeLoading(false);
        });
    }
  };

  // 生成大图供保存
  const handleGenerateImage = () => {
    const el = storyCardRef.current;
    if (!el || generating) return;
    setGenerating(true);
    html2canvas(el, { scale: 2, backgroundColor: '#F6F0E6', useCORS: true })
      .then((c) => {
        setPreviewImage(c.toDataURL('image/png'));
        toast.success('已生成高清卡片，可在弹窗中长按保存或下载！');
      })
      .catch(() => {
        toast.error('生成图片失败，请重试');
      })
      .finally(() => {
        setGenerating(false);
      });
  };

  // 顶部极简指示进度
  const renderMinimalNav = () => {
    if (step === 0 || step === 4) return null;
    return (
      <div className="minimal-nav-bar">
        <div className="minimal-steps-dots">
          <div
            className={`minimal-step-dot ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}
            onClick={() => setStep(1)}
            style={{ cursor: step > 1 ? 'pointer' : 'default' }}
          >
            <span className="minimal-dot-circle">{step > 1 ? '✓' : '1'}</span>
            <span>香味风格</span>
          </div>
          <div className="minimal-dot-sep" />
          <div
            className={`minimal-step-dot ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}
            onClick={() => { if (step > 2) setStep(2); }}
            style={{ cursor: step > 2 ? 'pointer' : 'default' }}
          >
            <span className="minimal-dot-circle">{step > 2 ? '✓' : '2'}</span>
            <span>选主香</span>
          </div>
          <div className="minimal-dot-sep" />
          <div className={`minimal-step-dot ${step === 3 ? 'active' : ''}`}>
            <span className="minimal-dot-circle">3</span>
            <span>配香封瓶</span>
          </div>
        </div>

        {/* 当班心青年身份标识 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--brand-navy)', fontWeight: 700 }}>
          <YouthAvatarDisplay avatar={currentYouth.avatar} size={24} />
          <span>调香顾问 {currentYouth.name}</span>
        </div>
      </div>
    );
  };

  // ================= 步骤 0：首页 (温度高定·直入调香流程) =================
  const renderWelcome = () => (
    <div className="perfume-page perfume-welcome-page">
      <div className="perfume-welcome-logo-wrap">
        <img src={logoWide} alt="心适力" />
      </div>
      <div className="perfume-welcome-brand-badge">心适力 · 情绪与香气相遇</div>
      <div className="perfume-welcome-title">闻见彼此</div>
      <div className="perfume-welcome-en">CONNECT &middot; RESTORE &middot; EMPOWER</div>

      {/* 精致的高定当班心青年名片 (展示性格与爱好、亲切迎客话术) */}
      <div className="youth-duty-card">
        <div className="youth-duty-top">
          <div className="youth-duty-badge">
            <Sparkles size={13} />
            心适力 · 特邀调香顾问
          </div>
          <button
            className="youth-switch-trigger"
            onClick={() => setShowYouthAdmin(true)}
            title="选择切换当班特邀心青年"
          >
            <Users size={13} />
            切换在岗顾问
          </button>
        </div>

        <div className="youth-duty-profile">
          <YouthAvatarDisplay avatar={currentYouth.avatar} size={58} />
          <div>
            <div className="youth-duty-name-row">
              <span className="youth-duty-name">{currentYouth.name}</span>
              <span className="youth-duty-role">今日在岗</span>
            </div>
            <div className="youth-duty-personality">
              性格与爱好：{currentYouth.personality}
            </div>
          </div>
        </div>

        <div className="youth-duty-quote">
          “{currentYouth.greeting}”
        </div>
      </div>

      {/* 取消冗余认识弹窗，直接进入调香流程 */}
      <button
        className="perfume-btn perfume-btn-coral perfume-btn-large"
        onClick={() => setStep(1)}
        style={{ maxWidth: '340px', gap: 8 }}
      >
        <Sparkles size={19} />
        和 {currentYouth.name} 开启双人共创调香
      </button>

      <p className="perfume-welcome-footer">
        心适力特邀心青年共创调香工坊<br />
        让身心在气味中自然相遇
      </p>

      {/* 弹窗一：已在岗心青年快速换班 (纯粹专注切换在岗顾问) */}
      {showYouthAdmin && (
        <div className="youth-admin-modal-overlay" onClick={() => setShowYouthAdmin(false)}>
          <div className="youth-admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="youth-admin-header">
              <div className="youth-admin-title">
                <Users size={18} color="var(--brand-coral)" />
                选择今日在岗调香顾问
              </div>
              <button
                className="companion-sheet-close"
                onClick={() => setShowYouthAdmin(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
              点击即可快速切换今日当班特邀心青年：
            </div>

            {/* 心青年列表 */}
            <div className="youth-list-grid">
              {youthList.map((y) => {
                const isCurrent = y.id === activeYouthId;
                return (
                  <div
                    key={y.id}
                    className={`youth-list-item ${isCurrent ? 'selected' : ''}`}
                    onClick={() => handleSelectYouth(y.id)}
                  >
                    <div className="youth-list-item-left">
                      <YouthAvatarDisplay avatar={y.avatar} size={42} />
                      <div>
                        <div className="youth-list-name">{y.name}</div>
                        <div className="youth-list-desc">特点：{y.personality}</div>
                      </div>
                    </div>
                    {isCurrent ? (
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-coral)', background: '#FFFFFF', padding: '4px 10px', borderRadius: 8 }}>
                        今日在岗
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--brand-green)', fontWeight: 600, background: 'var(--brand-green-soft)', padding: '4px 10px', borderRadius: 8 }}>
                        设为在岗
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 底部独立按钮：转到新青年录入页面 */}
            <button
              type="button"
              className="youth-add-entry-btn"
              onClick={() => {
                setShowYouthAdmin(false);
                setShowAddYouthModal(true);
              }}
            >
              <UserPlus size={15} />
              录入新心青年档案
            </button>
          </div>
        </div>
      )}

      {/* 弹窗二：独立且极简的新青年录入界面 (已与在岗列表彻底解耦) */}
      {showAddYouthModal && (
        <div className="youth-admin-modal-overlay" onClick={() => { stopCamera(); setShowAddYouthModal(false); }}>
          <div className="youth-admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="youth-admin-header">
              <div className="youth-admin-title">
                <UserPlus size={18} color="var(--brand-coral)" />
                录入新心青年顾问
              </div>
              <button
                className="companion-sheet-close"
                onClick={() => { stopCamera(); setShowAddYouthModal(false); }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="youth-clean-form">
              {/* 1. 姓名 */}
              <div className="youth-form-group">
                <label className="youth-form-label">心青年顾问姓名 *</label>
                <input
                  type="text"
                  placeholder="例如：天天、小雅"
                  value={newYouthName}
                  onChange={(e) => setNewYouthName(e.target.value)}
                  className="youth-form-input"
                  autoFocus
                />
              </div>

              {/* 2. 头像 (自拍 / 相册 / 精选顾问头像，排版优化) */}
              <div className="youth-form-group">
                <label className="youth-form-label">
                  心青年形象头像
                  <span className="youth-form-label-desc">（拍照/上传或选设定头像）</span>
                </label>
                
                <div className="youth-avatar-section">
                  <div className="youth-avatar-main-row">
                    <div className="youth-avatar-preview-wrap">
                      <div className="youth-avatar-current">
                        <YouthAvatarDisplay avatar={newYouthAvatar} size={58} />
                      </div>
                      <span className="youth-avatar-preview-badge">当前已选</span>
                    </div>

                    <div className="youth-avatar-action-col">
                      <div className="youth-avatar-btn-row">
                        <button
                          type="button"
                          onClick={cameraActive ? stopCamera : startCamera}
                          className={`youth-action-small-btn ${cameraActive ? 'active' : ''}`}
                        >
                          <Camera size={14} color={cameraActive ? '#FFFFFF' : 'var(--brand-coral)'} />
                          {cameraActive ? '关闭相机' : '现场拍照'}
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="youth-action-small-btn"
                        >
                          <Upload size={14} color="var(--brand-green)" />
                          相册上传
                        </button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarFileUpload}
                      />
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                        支持用手机现场自拍、上传照片，或在下方选择设定头像
                      </div>
                    </div>
                  </div>

                  {/* 摄像头实时预览取景框 */}
                  {cameraActive && (
                    <div className="youth-camera-overlay">
                      <video ref={videoRef} autoPlay playsInline className="youth-camera-video" />
                      <div className="youth-camera-controls">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="perfume-btn perfume-btn-coral"
                          style={{ padding: '7px 16px', fontSize: 13 }}
                        >
                          <Camera size={14} style={{ marginRight: 4 }} />
                          截取定格头像
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="perfume-btn perfume-btn-outline"
                          style={{ padding: '7px 12px', fontSize: 13, color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 预设专属顾问头像推荐（真实精美视觉头像，非简单表情） */}
                  <div className="youth-preset-section">
                    <div className="youth-preset-label">
                      <span>🎨 推荐设定顾问头像（点击即选）：</span>
                      {newYouthAvatar?.startsWith('data:') && (
                        <span style={{ color: 'var(--brand-coral)', fontWeight: 700 }}>已选图像头像</span>
                      )}
                    </div>
                    <div className="youth-preset-grid">
                      {PRESET_ADVISOR_AVATARS.map((preset) => {
                        const isSelected = newYouthAvatar === preset.url;
                        return (
                          <div
                            key={preset.id}
                            className={`youth-preset-item ${isSelected ? 'selected' : ''}`}
                            title={preset.name}
                            onClick={() => {
                              stopCamera();
                              setNewYouthAvatar(preset.url);
                            }}
                          >
                            <div className="youth-preset-avatar-circle">
                              <img src={preset.url} alt={preset.name} className="youth-preset-avatar-img" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. 特点与爱好 (手动录入，无选择标签) */}
              <div className="youth-form-group">
                <label className="youth-form-label">
                  性格与爱好特点 (选填)
                  <span className="youth-form-label-desc">（手动录入，印于调香名片与故事中）</span>
                </label>
                <input
                  type="text"
                  placeholder="手动录入，例如：专注沉静、喜欢画画与大自然、热爱柑橘香"
                  value={newYouthPersonality}
                  onChange={(e) => setNewYouthPersonality(e.target.value)}
                  className="youth-form-input"
                />
              </div>

              {/* 4. 手绘画作 (修复上传画作按钮与输入框并排Bug) */}
              <div className="youth-form-group">
                <label className="youth-form-label">
                  <Palette size={14} color="var(--brand-coral)" />
                  心青年艺术手绘 (选填，印制于成果调香卡)
                </label>
                
                <div className="youth-artwork-upload-card">
                  <div className="youth-artwork-actions-row">
                    <button
                      type="button"
                      onClick={() => artworkFileInputRef.current?.click()}
                      className={`youth-artwork-upload-btn ${newYouthArtwork ? 'has-art' : ''}`}
                    >
                      <ImageIcon size={15} color="var(--brand-coral)" />
                      {newYouthArtwork ? '更替画作' : '上传画作'}
                    </button>
                    <input
                      ref={artworkFileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleArtworkFileUpload}
                    />
                    <div className="youth-artwork-input-wrap">
                      <input
                        type="text"
                        placeholder="画作名称，如《夏日微风》"
                        value={newYouthArtworkTitle}
                        onChange={(e) => setNewYouthArtworkTitle(e.target.value)}
                        className="youth-form-input"
                        style={{ height: '100%', minHeight: 40 }}
                      />
                    </div>
                  </div>

                  {newYouthArtwork && (
                    <div className="youth-artwork-preview-box">
                      <img src={newYouthArtwork} alt="心青年画作预览" className="youth-artwork-preview-img" />
                      <div className="youth-artwork-preview-bar">
                        <span className="youth-artwork-preview-title">
                          {newYouthArtworkTitle || '已载入艺术手绘'}
                        </span>
                        <button
                          type="button"
                          className="youth-artwork-remove-btn"
                          onClick={() => {
                            setNewYouthArtwork('');
                            setNewYouthArtworkTitle('');
                          }}
                        >
                          <Trash2 size={11} style={{ display: 'inline', marginRight: 2 }} />
                          移除
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 保存按钮 */}
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  className="perfume-btn perfume-btn-outline"
                  style={{ flex: 1, minHeight: 44, fontSize: 14 }}
                  onClick={() => {
                    stopCamera();
                    setShowAddYouthModal(false);
                  }}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="perfume-btn perfume-btn-coral"
                  style={{ flex: 2, minHeight: 44, fontSize: 14 }}
                  onClick={handleAddYouth}
                >
                  保存并立即上岗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ================= 步骤 1：顾客选香味风格 (奠定香水前后调底色 + 选填个性期待) =================
  const currentMood = selectedMoodIdx !== null ? PRESET_MOODS[selectedMoodIdx] : null;

  const handleSelectMoodCard = (idx: number) => {
    const isFirstSelect = selectedMoodIdx === null;
    setSelectedMoodIdx(idx);
    if (isFirstSelect) {
      setTimeout(() => {
        moodDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  const renderStep1Mood = () => (
    <div className="perfume-page perfume-step-page">
      <div style={{ textAlign: 'left', marginBottom: 12 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--brand-navy)', letterSpacing: 0.5 }}>
          选择今天要定制的香味风格
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          选定您钟意的风格，奠定整瓶香水的前后调底色；随后心青年将为您挑选专属的灵魂主香
        </p>
      </div>

      {/* 6 大画报式香氛情境画卡 (Editorial Atmospheric Fragrance Vignettes) */}
      <div className="clean-mood-grid">
        {PRESET_MOODS.map((m, idx) => {
          const isSelected = selectedMoodIdx === idx;
          const moodImg = (m as any).image;
          return (
            <div
              key={m.title}
              className={`clean-mood-card mood-${m.id} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectMoodCard(idx)}
            >
              {/* 全幅情境意境画底 (支持用户自主生成的风格图，未提供时呈现水彩意境图) */}
              {moodImg ? (
                <img src={moodImg} alt={m.title} className="clean-mood-scenic-image" />
              ) : (
                <div
                  className="clean-mood-scenic-canvas"
                  dangerouslySetInnerHTML={{ __html: m.scenicSvg }}
                />
              )}

              {/* 优雅画报叠层：去除非必要英文标签，仅保留右上角纯净状态指示点，下部呈现高辨识度标题与香调 */}
              <div className="clean-mood-overlay">
                <div className="clean-mood-header">
                  <div className={`clean-mood-badge ${isSelected ? 'active' : ''}`}>
                    {isSelected ? (
                      <>
                        <Check size={11} strokeWidth={3.5} />
                        <span>已选</span>
                      </>
                    ) : (
                      <span className="clean-mood-unselected-ring" />
                    )}
                  </div>
                </div>

                <div className="clean-mood-footer">
                  <div className="clean-mood-title-row">
                    <h3 className="clean-mood-title">{m.title}</h3>
                    <span className="clean-mood-tag-badge">{m.tag}</span>
                  </div>
                  <p className="clean-mood-desc">{m.desc}</p>
                  <div className="clean-mood-notes-pill">
                    <span className="clean-mood-notes-icon">✦</span>
                    <span className="clean-mood-notes-text">{m.notes}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 选定卡片后，优雅弹出补充填写框、底色提示条与下一步操作按钮 */}
      {selectedMoodIdx !== null && currentMood ? (
        <div ref={moodDetailRef} className="selected-mood-reveal-panel">
          {/* 补充此刻的心情或心愿期待 (引导心境层面的描述，避免具体味道诉求) */}
          <div className="custom-scent-wish-box">
            <label className="custom-scent-wish-label">
              补充你此刻的心情或心愿期待（选填）
            </label>
            <textarea
              rows={2}
              value={customerCustomWish}
              onChange={(e) => setCustomerCustomWish(e.target.value)}
              placeholder="例如：想要彻底放空、随遇而安、考完试犒赏自己、送给朋友一份温暖祝福..."
              className="custom-scent-wish-input"
            />
            <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>
              💡 记录此刻心境与美好心愿，将由 AI 融入专属调香纪事
            </div>
          </div>

          {/* 简洁自然的底色提示条，让顾客清晰意识到选择构成了底色 */}
          <div className="base-tone-note-bar">
            <Sparkles size={15} color="var(--brand-green)" style={{ flexShrink: 0 }} />
            <span>
              已选定<strong>「{currentMood.title}」</strong>作为香气底色（构成前调与后调共 24 滴基底），身心随香气自然舒展。
            </span>
          </div>

          {/* 步骤操作栏：支持返回首页或推进至心青年选主香 */}
          <div className="perfume-step-actions">
            <button
              type="button"
              className="perfume-btn perfume-btn-step-back"
              onClick={() => setStep(0)}
              title="返回首页"
            >
              <ArrowLeft size={16} style={{ marginRight: 4 }} />
              返回首页
            </button>
            <button
              type="button"
              className="perfume-btn perfume-btn-coral perfume-btn-step-next"
              onClick={handleConfirmMood}
            >
              定下底色，交给 {currentYouth.name} 选主香
              <ArrowRight size={18} style={{ marginLeft: 6 }} />
            </button>
          </div>
        </div>
      ) : (
        /* 未选定卡片时保持画面极度纯粹清爽，仅保留返回按钮与轻量引导贴士 */
        <div className="perfume-step-actions unselected-actions">
          <button
            type="button"
            className="perfume-btn perfume-btn-step-back"
            onClick={() => setStep(0)}
            title="返回首页"
          >
            <ArrowLeft size={16} style={{ marginRight: 4 }} />
            返回首页
          </button>
          <div className="perfume-step-select-hint">
            <span>👆 请点击上方卡片选择一种香味风格</span>
          </div>
        </div>
      )}
    </div>
  );

  // ================= 步骤 2：心青年选主香 (文案视线层级清晰 + 自然融入默契提示) =================
  const currentSoul = candidateSouls.find((c) => c.scent.id === selectedSoulId) || candidateSouls[0];

  const renderStep2Soul = () => (
    <div className="perfume-page perfume-step-page">
      {/* 顾客视角的明确大动作提示 */}
      <div style={{ textAlign: 'left', marginBottom: 12 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--brand-navy)', lineHeight: 1.35 }}>
          请将屏幕转交给心青年调香助理
        </h2>
        <p style={{ fontSize: 14, color: 'var(--brand-coral-hover)', fontWeight: 700, marginTop: 4 }}>
          让 {currentYouth.name} 选一个他喜欢的味道送给你，并让他为你介绍这个香气吧~
        </p>
      </div>

      {/* 融入页面的顾客默契提示 */}
      <div className="inline-companion-tip">
        <span className="inline-companion-icon">💡</span>
        <div className="inline-companion-body">
          <div className="inline-companion-title">默契互动提醒</div>
          <div className="inline-companion-text">
            若心青年有些腼腆，您可以微笑着对他说：“{currentYouth.name}，你能给我讲讲为什么选这个味道吗？”
          </div>
        </div>
      </div>

      {/* 3 张给心青年点选的直观大卡 */}
      <div className="youth-cards-container">
        {candidateSouls.map((item) => {
          const isSelected = selectedSoulId === item.scent.id;
          return (
            <div
              key={item.scent.id}
              className={`youth-scent-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedSoulId(item.scent.id)}
            >
              <img
                src={getScentImage(item.scent.id) || ''}
                alt={item.scent.name}
                className="youth-scent-img"
              />
              <div className="youth-scent-details">
                <div className="youth-scent-name">
                  <span>{item.scent.name}</span>
                  <span className="youth-scent-note-tag">{item.scent.noteLabel}</span>
                </div>
                <div className="youth-scent-feeling">
                  {item.scent.childFriendlyDescription}
                </div>
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: '2px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSelected ? 'var(--brand-coral)' : 'transparent',
                  borderColor: isSelected ? 'var(--brand-coral)' : 'var(--border-color)',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {isSelected && <Check size={18} strokeWidth={3} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* 心青年口播念读条 */}
      <div className="youth-speech-bubble">
        <div className="youth-speech-label">
          <Volume2 size={15} />
          <span>{currentYouth.name} 可以这样介绍给客人听：</span>
        </div>
        <div className="youth-speech-line">
          {currentSoul?.speechLine || `“我为你挑选了${currentSoul?.scent.name || '这个香气'}，希望你今天很舒心！”`}
        </div>
      </div>

      {/* 步骤操作栏：支持返回上一步或误触反悔 */}
      <div className="perfume-step-actions">
        <button
          type="button"
          className="perfume-btn perfume-btn-step-back"
          onClick={() => setStep(1)}
          title="返回修改香味风格"
        >
          <ArrowLeft size={16} style={{ marginRight: 4 }} />
          上一步
        </button>
        <button
          type="button"
          className="perfume-btn perfume-btn-coral perfume-btn-step-next"
          onClick={handleConfirmSoul}
        >
          选定主香，开始现场配香
          <ArrowRight size={18} style={{ marginLeft: 6 }} />
        </button>
      </div>
    </div>
  );

  // ================= 步骤 3：现场滴配与署名 =================
  const renderStep3Crafting = () => {
    const f = state.finalFormula?.formula;

    return (
      <div className="perfume-page perfume-step-page">
        <div style={{ textAlign: 'left', marginBottom: 14 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--brand-navy)' }}>
            现场调香配比单
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            使用滴管按滴数滴入调香瓶（共 40 滴精油）
          </p>
        </div>

        {/* 纯净滴配清单 */}
        <div className="clean-recipe-card">
          <div style={{ marginBottom: 14 }}>
            <div className="recipe-section-title">
              <Droplets size={16} color="var(--brand-green)" />
              前调（顾客定调 · 轻快挥发）· 8 滴
            </div>
            {f?.top.map((item) => (
              <div key={item.name} className="recipe-item-row">
                <span className="recipe-item-name">
                  <img src={getScentImage(item.scentId) || ''} alt="" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover' }} />
                  {item.name}
                </span>
                <span className="recipe-item-drops">{item.drops} 滴</span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div className="recipe-section-title">
              <Sparkles size={16} color="var(--brand-coral)" />
              中调（{currentYouth.name}心选 · 灵魂主香）· 16 滴
            </div>
            {f?.middle.map((item) => {
              const isSoul = item.scentId === selectedSoulId;
              return (
                <div key={item.name} className={`recipe-item-row ${isSoul ? 'is-soul' : ''}`}>
                  <span className="recipe-item-name">
                    <img src={getScentImage(item.scentId) || ''} alt="" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover' }} />
                    {item.name}
                    {isSoul && <span style={{ fontSize: 11, background: 'var(--brand-coral)', color: '#fff', padding: '1px 6px', borderRadius: 4 }}>{currentYouth.name} 心选主香</span>}
                  </span>
                  <span className="recipe-item-drops">{item.drops} 滴</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div className="recipe-section-title">
              <Droplets size={16} color="var(--brand-navy)" />
              后调（顾客定调 · 安定定香）· 16 滴
            </div>
            {f?.base.map((item) => (
              <div key={item.name} className="recipe-item-row">
                <span className="recipe-item-name">
                  <img src={getScentImage(item.scentId) || ''} alt="" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover' }} />
                  {item.name}
                </span>
                <span className="recipe-item-drops">{item.drops} 滴</span>
              </div>
            ))}
          </div>

          <div className="recipe-diluent-box">
            🧪 <strong>稀释与封瓶：</strong>滴入 40 滴精油后，注入<strong>专用调香稀释液至瓶颈刻度线</strong>，盖上喷头轻轻摇匀 10 秒。
          </div>
        </div>

        {/* 极简双人署名 */}
        <div className="clean-sign-box">
          <div className="clean-sign-title">
            <Heart size={16} color="var(--brand-coral)" style={{ display: 'inline', marginRight: 6 }} />
            共创者署名
          </div>

          <div className="clean-sign-row" style={{ background: '#FAF8F4', padding: '8px 12px', borderRadius: 10 }}>
            <span className="clean-sign-label" style={{ color: 'var(--brand-coral)' }}>调香顾问</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--brand-navy)' }}>
              <YouthAvatarDisplay avatar={currentYouth.avatar} size={28} />
              <span>{currentYouth.name}</span>
              <span style={{ fontSize: 11, background: 'var(--brand-green-soft)', color: 'var(--brand-green)', padding: '1px 6px', borderRadius: 6 }}>已认证</span>
            </div>
          </div>

          <div className="clean-sign-row" style={{ marginTop: 10 }}>
            <span className="clean-sign-label">顾客昵称</span>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="例如：林小夏"
              className="clean-sign-input"
            />
          </div>
        </div>

        {/* 步骤操作栏：支持返回上一步或误触反悔 */}
        <div className="perfume-step-actions">
          <button
            type="button"
            className="perfume-btn perfume-btn-step-back"
            onClick={() => setStep(2)}
            title="返回重新挑选灵魂主香"
          >
            <ArrowLeft size={16} style={{ marginRight: 4 }} />
            上一步
          </button>
          <button
            type="button"
            className="perfume-btn perfume-btn-coral perfume-btn-step-next"
            onClick={handleCompleteCrafting}
          >
            完成封瓶 · 生成调香卡 ✨
            <ArrowRight size={18} style={{ marginLeft: 6 }} />
          </button>
        </div>
      </div>
    );
  };

  // ================= 步骤 4：成果专属调香卡 (心青年真实画作 + 换名字 + 固化 Prompt 叙事与金句) =================
  const renderStep4Result = () => {
    const s = state.storyCard;
    if (!s) return null;

    const allScentNames = [
      ...(s.formulaByNote?.top || []),
      ...(s.formulaByNote?.middle || []),
      ...(s.formulaByNote?.base || []),
    ];

    return (
      <div className="perfume-page perfume-result-page">
        <div style={{ padding: '16px 20px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--brand-green)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Check size={16} />
            调香完成 · 展会双人共创限定
          </div>
          <button
            onClick={goToStart}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
          >
            <RotateCcw size={14} />
            再为下一位客人调香
          </button>
        </div>

        {/* 现场拍照提示 */}
        <div style={{
          background: '#FFFDF9',
          border: '1px solid #F0DFCC',
          borderRadius: 12,
          padding: '10px 16px',
          margin: '8px 16px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textAlign: 'left'
        }}>
          <Camera size={20} color="var(--brand-coral)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: '#6A4F35', lineHeight: 1.45 }}>
            <strong>专属调香卡已就绪！</strong>欢迎顾客使用手机<strong>拍照留念</strong>，记录与 {currentYouth.name} 共同创造的气味故事。
          </div>
        </div>

        {/* 名字微调快捷栏 */}
        <div style={{ padding: '0 16px', marginBottom: 6 }}>
          <div className="perfume-name-action-bar" style={{ margin: 0 }}>
            <div className="perfume-name-info">
              <div className="perfume-name-label">当前香气命名：</div>
              <div className="perfume-name-value">{s.title}</div>
            </div>
            <button
              type="button"
              className="perfume-name-switch-btn"
              onClick={() => {
                handleRerollPerfumeName();
                // 同步更新调香卡标题
                const nextIdx = (nameCandidateIdx + 1) % nameCandidates.length;
                const newTitle = nameCandidates[nextIdx] || s.title;
                updateState({
                  storyCard: { ...s, title: newTitle },
                });
              }}
              title="切换其他香气名称"
            >
              <Sparkles size={14} />
              换一个名字
            </button>
          </div>
        </div>

        {/* 调香故事卡主体 */}
        <div style={{ padding: '4px 16px' }}>
          <div className="perfume-story-card" ref={storyCardRef} id="perfume-story-card">
            <div className="perfume-story-card-bg" style={{ backgroundImage: `url(${bgSrc})` }}></div>
            <div className="perfume-story-card-overlay"></div>
            <div className="perfume-story-card-content">
              {/* 心适力 Logo 视觉居中 */}
              <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
                <img src={logoWide} alt="心适力" style={{ height: 26, display: 'block', margin: '0 auto', objectFit: 'contain' }} />
              </div>
              <div className="perfume-story-card-seal">心适力 · 和心青年一起闻见彼此</div>
              <div className="perfume-story-card-title">{s.title}</div>

              <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 12, letterSpacing: 0.5 }}>
                编号：{s.serialNumber} · 日期：{s.createdDate}
              </div>

              {/* 灵魂香气标识 (已精简移除冗余#标签) */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <span className="perfume-tag" style={{ background: 'var(--brand-coral-soft)', color: '#D35E20', padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
                  ★ 灵魂主香：{s.soulScentName}
                </span>
              </div>

              {/* 心青年真实艺术画作展框 (若有画作，优先结合画作；非纯AI生图) */}
              {s.youthArtworkImage && (
                <div className="story-card-artwork-frame">
                  <img src={s.youthArtworkImage} alt="心青年手绘原作" className="story-card-artwork-img" />
                  <div className="story-card-artwork-meta">
                    <div className="story-card-artwork-title">
                      <Palette size={13} color="var(--brand-coral)" />
                      <span>特邀心青年手绘 · {s.youthArtworkTitle || '《气味相逢》'}</span>
                    </div>
                    <span className="story-card-artwork-tag">真实原作印记</span>
                  </div>
                </div>
              )}

              {/* 水彩艺术流淌纹理 */}
              <div
                dangerouslySetInnerHTML={{
                  __html: generateNoteSVG('card', allScentNames),
                }}
              />

              {/* 详细香水配比 */}
              <div className="perfume-story-formula">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div className="perfume-formula-note-label">前调 · Top</div>
                  <span style={{ fontSize: 11, color: 'var(--text-light)' }}>顾客锁定 · 明亮初遇</span>
                </div>
                {s.formulaByNote.top.map((item) => (
                  <div key={item} style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>{item}</div>
                ))}

                <div className="perfume-formula-divider"></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div className="perfume-formula-note-label">中调 · Middle</div>
                  <span style={{ fontSize: 11, color: 'var(--text-light)' }}>{currentYouth.name}心选 · 饱满灵魂</span>
                </div>
                {s.formulaByNote.middle.map((item) => (
                  <div key={item} style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>{item}</div>
                ))}

                <div className="perfume-formula-divider"></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div className="perfume-formula-note-label">后调 · Base</div>
                  <span style={{ fontSize: 11, color: 'var(--text-light)' }}>顾客锁定 · 安定留痕</span>
                </div>
                {s.formulaByNote.base.map((item) => (
                  <div key={item} style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>{item}</div>
                ))}
              </div>

              <div className="perfume-story-drops-total">
                天然单方精油总计 <strong>{s.totalDrops}</strong> 滴
              </div>
              <div className="perfume-story-diluent">{s.diluentText}</div>

              {/* 共创双人署名印记 */}
              <div className="card-signature-box">
                <div className="card-sign-col">
                  <div className="card-sign-role">气味共创者</div>
                  <div className="card-sign-name">{s.customerName}</div>
                </div>
                <div className="card-stamp-mark">
                  <span>心适力</span>
                  <span>特调</span>
                  <span>认证</span>
                </div>
                <div className="card-sign-col" style={{ textAlign: 'right' }}>
                  <div className="card-sign-role">特邀调香顾问</div>
                  <div className="card-sign-name">调香顾问 {currentYouth.name}</div>
                </div>
              </div>

              {/* 调香卡底部的固定 Prompt 结构分析 + 恒定金句表达 */}
              <div className="card-narrative-container">
                <div className="card-narrative-title">
                  <div className="card-narrative-title-left">
                    <Sparkles size={13} />
                    <span>AI 气味共创纪事</span>
                  </div>
                  {aiNarrativeLoading ? (
                    <span className="card-narrative-ai-badge" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Loader2 size={11} className="animate-spin" />
                      AI 深度解读中...
                    </span>
                  ) : (
                    <span className="card-narrative-ai-badge">Gemini 灵感解读</span>
                  )}
                </div>
                <div className="card-narrative-story">
                  {aiNarrativeLoading ? (
                    <div className="card-narrative-story-loading">
                      <Loader2 size={13} className="animate-spin" />
                      <span>正在结合您的心愿与心青年的直觉，谱写气味相遇纪事...</span>
                    </div>
                  ) : (
                    s.coCreationStory || s.story
                  )}
                </div>
                <div className="card-narrative-harmony">
                  {s.harmonyAnalysis || '香气各得其所，彼此成全，让这段时光有了具象的气息。'}
                </div>
                <div className="card-constant-quote-box">
                  <div className="card-constant-quote-text">
                    “香气没有标准答案，只有你们一起选择的温柔。”
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作工具栏 */}
        <div className="co-result-actions">
          <button
            className="perfume-btn perfume-btn-coral perfume-btn-large"
            onClick={handleGenerateImage}
            disabled={generating}
          >
            <Download size={18} style={{ marginRight: 8 }} />
            保存专属调香卡到相册
          </button>

          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              className="perfume-btn perfume-btn-outline"
              onClick={() => setStep(3)}
              style={{ flex: 1, minHeight: 48, fontSize: 14 }}
              title="返回微调配比与昵称"
            >
              <ArrowLeft size={16} style={{ marginRight: 4 }} />
              返回修改配比
            </button>
            <button
              type="button"
              className="perfume-btn perfume-btn-outline"
              onClick={goToStart}
              style={{ flex: 1, minHeight: 48, fontSize: 14 }}
              title="为下一位客人开启共创"
            >
              <RotateCcw size={16} style={{ marginRight: 4 }} />
              为下一位客人调香
            </button>
          </div>
        </div>

        {/* 预览保存模态弹窗 */}
        {previewImage && (
          <div className="perfume-preview-overlay" onClick={() => setPreviewImage(null)}>
            <div className="perfume-preview-body" onClick={(e) => e.stopPropagation()}>
              <img src={previewImage} alt="调香卡" className="perfume-preview-img" />
              <p className="perfume-preview-hint">
                已生成高清调香卡 · 手机/平板长按可存入相册
              </p>
              <div className="perfume-preview-actions">
                <a
                  href={previewImage}
                  download={`${s.title}-心适力调香卡.png`}
                  className="perfume-btn perfume-btn-coral"
                  style={{ textDecoration: 'none', minHeight: 44, padding: '10px 20px', fontSize: 14 }}
                >
                  <Download size={15} style={{ marginRight: 6 }} />
                  确认下载卡片
                </a>
                <button
                  className="perfume-btn perfume-btn-outline"
                  onClick={() => setPreviewImage(null)}
                  style={{ minHeight: 44, padding: '10px 20px', fontSize: 14, color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="perfume-app">
      {renderMinimalNav()}
      {step === 0 && renderWelcome()}
      {step === 1 && renderStep1Mood()}
      {step === 2 && renderStep2Soul()}
      {step === 3 && renderStep3Crafting()}
      {step === 4 && renderStep4Result()}
    </div>
  );
}
