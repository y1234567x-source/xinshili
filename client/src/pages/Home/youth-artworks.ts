// 心青年艺术画作库与生成器
// 提供心青年真实艺术共创画作，支持画作展示、自定义录入与拍摄

export interface YouthArtwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
}

// 阳阳的画作：《向阳小森林》
const YANG_YANG_ART = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_yang" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF8E7"/>
      <stop offset="50%" stop-color="#FCEFD5"/>
      <stop offset="100%" stop-color="#EBF4D8"/>
    </linearGradient>
    <radialGradient id="sun" cx="25%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#F28C52" stop-opacity="0.8"/>
      <stop offset="40%" stop-color="#F7BA65" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#FFF" stop-opacity="0"/>
    </radialGradient>
    <filter id="brush" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  
  <rect width="400" height="240" fill="url(#bg_yang)"/>
  <circle cx="90" cy="70" r="85" fill="url(#sun)"/>
  
  <!-- 自由洒脱的手绘草木笔触 -->
  <g filter="url(#brush)">
    <!-- 远景山丘 -->
    <path d="M-10 180 Q 80 140, 200 160 T 410 140 L 410 240 L -10 240 Z" fill="#9CB86E" opacity="0.5"/>
    <path d="M-10 200 Q 120 160, 280 180 T 410 170 L 410 240 L -10 240 Z" fill="#83A94A" opacity="0.65"/>
    
    <!-- 树木手绘笔触 -->
    <path d="M60 170 Q 55 120, 60 85 Q 75 120, 60 170" fill="#E37C42" opacity="0.85"/>
    <circle cx="60" cy="85" r="28" fill="#F28C52" opacity="0.75"/>
    <circle cx="75" cy="75" r="22" fill="#F7BA65" opacity="0.8"/>
    
    <path d="M140 190 Q 135 130, 140 95" stroke="#4A6332" stroke-width="5" stroke-linecap="round"/>
    <path d="M110 120 C 120 80, 160 80, 170 120 C 160 145, 120 145, 110 120 Z" fill="#6A8D3B" opacity="0.85"/>
    <circle cx="140" cy="92" r="18" fill="#83A94A" opacity="0.9"/>
    
    <path d="M220 200 Q 225 140, 220 110" stroke="#7A5230" stroke-width="4"/>
    <ellipse cx="225" cy="115" rx="35" ry="25" fill="#F4A261" opacity="0.7"/>
    <ellipse cx="215" cy="105" rx="26" ry="20" fill="#E76F51" opacity="0.6"/>

    <path d="M310 185 Q 305 135, 310 100" stroke="#3D5028" stroke-width="4.5"/>
    <circle cx="310" cy="100" r="32" fill="#83A94A" opacity="0.8"/>
    <circle cx="325" cy="90" r="20" fill="#ADC972" opacity="0.85"/>
    
    <!-- 随风飘落的黄色与橙色阳光斑点 -->
    <circle cx="100" cy="130" r="6" fill="#F7BA65" opacity="0.9"/>
    <circle cx="180" cy="110" r="5" fill="#F28C52" opacity="0.8"/>
    <circle cx="260" cy="140" r="7" fill="#83A94A" opacity="0.75"/>
    <circle cx="350" cy="125" r="5.5" fill="#F7BA65" opacity="0.85"/>
    <circle cx="45" cy="145" r="4.5" fill="#E76F51" opacity="0.7"/>
    <circle cx="280" cy="85" r="4" fill="#F28C52" opacity="0.8"/>
  </g>
  
  <!-- 右下角心青年亲笔落款印迹 -->
  <rect x="325" y="195" width="60" height="26" rx="4" fill="#FFFFFF" opacity="0.85"/>
  <text x="355" y="212" font-family="'Noto Serif SC', serif" font-size="11" font-weight="bold" fill="#E37C42" text-anchor="middle">阳阳 绘</text>
</svg>
`)}`;

// 晨晨的画作：《春日微风与白茶》
const CHEN_CHEN_ART = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_chen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F2F7F4"/>
      <stop offset="60%" stop-color="#E5EFEA"/>
      <stop offset="100%" stop-color="#D8E8E0"/>
    </linearGradient>
    <filter id="watercolor">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4"/>
    </filter>
  </defs>
  <rect width="400" height="240" fill="url(#bg_chen)"/>
  
  <g filter="url(#watercolor)">
    <!-- 柔美舒卷的茶烟与微风波纹 -->
    <path d="M-20 120 C 60 70, 120 160, 200 110 C 280 60, 340 140, 420 90" stroke="#7BA893" stroke-width="18" fill="none" opacity="0.35" stroke-linecap="round"/>
    <path d="M-10 160 C 80 120, 160 190, 240 140 C 320 90, 360 170, 420 130" stroke="#9BBFA8" stroke-width="22" fill="none" opacity="0.4" stroke-linecap="round"/>
    <path d="M20 90 C 100 40, 180 120, 260 80 C 320 50, 380 110, 420 70" stroke="#C5DED0" stroke-width="14" fill="none" opacity="0.5" stroke-linecap="round"/>

    <!-- 茶叶与花瓣落痕 -->
    <path d="M120 100 C 135 85, 155 95, 145 110 C 135 125, 115 115, 120 100 Z" fill="#5F8B75" opacity="0.75"/>
    <path d="M180 145 C 195 130, 215 140, 205 155 C 195 170, 175 160, 180 145 Z" fill="#78A08C" opacity="0.8"/>
    <path d="M260 95 C 275 80, 295 90, 285 105 C 275 120, 255 110, 260 95 Z" fill="#6A9781" opacity="0.75"/>
    
    <!-- 白色小花点缀 -->
    <circle cx="80" cy="130" r="8" fill="#FFFFFF" opacity="0.85"/>
    <circle cx="80" cy="130" r="3" fill="#F7BA65" opacity="0.9"/>
    
    <circle cx="220" cy="100" r="10" fill="#FFFFFF" opacity="0.9"/>
    <circle cx="220" cy="100" r="3.5" fill="#F7BA65" opacity="0.95"/>
    
    <circle cx="330" cy="140" r="8.5" fill="#FFFFFF" opacity="0.85"/>
    <circle cx="330" cy="140" r="3" fill="#F7BA65" opacity="0.9"/>
  </g>
  
  <rect x="325" y="195" width="60" height="26" rx="4" fill="#FFFFFF" opacity="0.85"/>
  <text x="355" y="212" font-family="'Noto Serif SC', serif" font-size="11" font-weight="bold" fill="#5F8B75" text-anchor="middle">晨晨 绘</text>
</svg>
`)}`;

// 乐乐的画作：《快乐调色盘》
const LE_LE_ART = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_le" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF6EE"/>
      <stop offset="50%" stop-color="#FEEDE2"/>
      <stop offset="100%" stop-color="#FDF4EA"/>
    </linearGradient>
  </defs>
  <rect width="400" height="240" fill="url(#bg_le)"/>
  
  <!-- 鲜活的大胆色块拼贴 -->
  <circle cx="90" cy="100" r="60" fill="#F28C52" opacity="0.85"/>
  <circle cx="160" cy="130" r="48" fill="#F7BA65" opacity="0.8"/>
  <rect x="180" y="50" width="85" height="85" rx="20" fill="#83A94A" opacity="0.8" transform="rotate(15 220 90)"/>
  <circle cx="290" cy="120" r="55" fill="#5A8BB5" opacity="0.75"/>
  
  <ellipse cx="210" cy="160" rx="70" ry="35" fill="#E87A5D" opacity="0.75"/>
  <circle cx="120" cy="65" r="25" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="280" cy="70" r="18" fill="#F7BA65" opacity="0.85"/>
  <circle cx="340" cy="160" r="22" fill="#83A94A" opacity="0.85"/>
  
  <!-- 快乐笔触与星星 -->
  <path d="M50 160 Q 90 190, 140 170" stroke="#28384A" stroke-width="4" stroke-linecap="round" fill="none"/>
  <path d="M260 175 Q 300 150, 330 180" stroke="#28384A" stroke-width="4" stroke-linecap="round" fill="none"/>
  
  <polygon points="70,40 73,48 81,49 75,54 77,62 70,57 63,62 65,54 59,49 67,48" fill="#F28C52"/>
  <polygon points="320,45 322,51 329,52 324,56 325,62 320,58 315,62 316,56 311,52 318,51" fill="#F7BA65"/>

  <rect x="325" y="195" width="60" height="26" rx="4" fill="#FFFFFF" opacity="0.85"/>
  <text x="355" y="212" font-family="'Noto Serif SC', serif" font-size="11" font-weight="bold" fill="#28384A" text-anchor="middle">乐乐 绘</text>
</svg>
`)}`;

export const DEFAULT_YOUTH_ARTWORKS: Record<string, { title: string; imageUrl: string; desc: string }> = {
  youth_1: {
    title: '《向阳小森林》',
    imageUrl: YANG_YANG_ART,
    desc: '阳光穿过树梢，每一片树叶都散发着柑橘与暖阳的味道。',
  },
  youth_2: {
    title: '《春日微风与白茶》',
    imageUrl: CHEN_CHEN_ART,
    desc: '温柔清澈的草木波纹，如白茶在清晨微风中舒展开来。',
  },
  youth_3: {
    title: '《快乐调色盘》',
    imageUrl: LE_LE_ART,
    desc: '缤纷跳跃的色彩，记录下今天所有热烈纯粹的开心。',
  },
};
