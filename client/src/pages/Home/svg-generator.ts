import { SCENTS, type Scent } from './perfume-data';

const WATERCOLOR_PALETTE: Record<
  string,
  { wash1: string; wash2: string; main: string; detail: string; leaf: string }
> = {
  citrus: { wash1: '#FFF8E0', wash2: '#FDECC8', main: '#F0A020', detail: '#C88010', leaf: '#7CA050' },
  fruity: { wash1: '#FFF0F0', wash2: '#FFE0E8', main: '#F08090', detail: '#C06070', leaf: '#70A060' },
  floral: { wash1: '#FFF5F8', wash2: '#FFE8F0', main: '#E090B0', detail: '#B07090', leaf: '#80A870' },
  herbal: { wash1: '#F0F8F0', wash2: '#E0F0E8', main: '#60B090', detail: '#408060', leaf: '#508848' },
  woody: { wash1: '#F5F0E5', wash2: '#E8DDD0', main: '#907050', detail: '#604830', leaf: '#6A8858' },
  spicy: { wash1: '#FFF0E0', wash2: '#FFE0C0', main: '#D08030', detail: '#A06020', leaf: '#809048' },
  sweet: { wash1: '#FFFAF0', wash2: '#FFF0E0', main: '#D8B880', detail: '#B09060', leaf: '#88A870' },
  tea: { wash1: '#F5F8F0', wash2: '#E8F0E0', main: '#90B878', detail: '#608850', leaf: '#708840' },
  green: { wash1: '#F0F8F0', wash2: '#E0F0E0', main: '#68A868', detail: '#408040', leaf: '#508840' },
  aquatic: { wash1: '#F0F8FF', wash2: '#E0F0F8', main: '#60A8C8', detail: '#4080A0', leaf: '#78A888' },
  musk: { wash1: '#F8F4F0', wash2: '#F0E8E0', main: '#C0B098', detail: '#988870', leaf: '#90A880' },
  amber: { wash1: '#FFF5E8', wash2: '#FFE8D0', main: '#C89848', detail: '#A07028', leaf: '#889858' },
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function _wcBlob(
  rng: () => number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  pts?: number,
): string {
  pts = pts || 10;
  let d = '';
  for (let i = 0; i <= pts; i++) {
    const a = (Math.PI * 2 / pts) * i;
    const jitterX = (rng() - 0.5) * rx * 0.6;
    const jitterY = (rng() - 0.5) * ry * 0.6;
    const x = cx + Math.cos(a) * (rx + jitterX);
    const y = cy + Math.sin(a) * (ry + jitterY);
    d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }
  return d + 'Z';
}

function _leafPath(rx: number, ry: number, curve?: number): string {
  curve = curve || 0.5;
  return `M0,${-ry} Q${rx * curve},${-ry * 0.4} 0,${ry} Q${-rx * curve},${-ry * 0.4} 0,${-ry}Z`;
}

function _petalPath(rx: number, ry: number): string {
  return `M0,0 Q${rx * 0.8},${-ry * 0.6} 0,${-ry} Q${-rx * 0.8},${-ry * 0.6} 0,0Z`;
}

type RngFn = () => number;
type CatColors = (typeof WATERCOLOR_PALETTE)[string];

function drawFlower(
  cx: number,
  cy: number,
  size: number,
  petalCount: number,
  style: string,
  rng: RngFn,
  cat: CatColors,
  fid: string,
): string {
  let svg = '';
  const stemEndY = cy + size * 2.5 + rng() * 20;
  const stemCurveX = cx + (rng() - 0.5) * 30;
  svg += `<path d="M${cx},${cy + size * 0.3} Q${stemCurveX},${(cy + stemEndY) / 2} ${cx - 5},${stemEndY}" fill="none" stroke="${cat.leaf}" stroke-width="1.5" opacity="0.35" stroke-linecap="round" filter="url(#wcSoft${fid})"/>`;
  const leafY = cy + size * 1.2 + rng() * 10;
  const leafX = cx + 5 + rng() * 10;
  const leafSize = size * (0.5 + rng() * 0.3);
  const leafRot = 25 + rng() * 30;
  svg += `<path d="${_leafPath(leafSize * 0.5, leafSize, 0.55)}" fill="${cat.leaf}" opacity="0.3" transform="translate(${leafX},${leafY}) rotate(${leafRot})" filter="url(#wcEdge${fid})"/>`;
  if (rng() > 0.4) {
    const leaf2Y = leafY + 8 + rng() * 10;
    const leaf2X = cx - 8 - rng() * 8;
    const leaf2Rot = -20 - rng() * 25;
    svg += `<path d="${_leafPath(leafSize * 0.4, leafSize * 0.8, 0.5)}" fill="${cat.leaf}" opacity="0.22" transform="translate(${leaf2X},${leaf2Y}) rotate(${leaf2Rot})" filter="url(#wcEdge${fid})"/>`;
  }
  if (style === 'rose') {
    const layers = 3 + Math.floor(rng() * 2);
    for (let layer = layers - 1; layer >= 0; layer--) {
      const layerSize = size * (0.4 + layer * 0.25);
      const petals = 4 + layer;
      const layerOpacity = (0.15 + layer * 0.06).toFixed(2);
      const layerColor = layer < 1 ? cat.detail : cat.main;
      let petalsSvg = '';
      for (let p = 0; p < petals; p++) {
        const angle = (360 / petals) * p + layer * 15;
        const prx = layerSize * 0.35;
        const pry = layerSize * 0.55;
        petalsSvg += `<ellipse cx="${cx + Math.cos((angle * Math.PI) / 180) * layerSize * 0.2}" cy="${cy + Math.sin((angle * Math.PI) / 180) * layerSize * 0.2}" rx="${prx}" ry="${pry}" fill="${layerColor}" opacity="${layerOpacity}" transform="rotate(${angle},${cx},${cy})" filter="url(#wcEdge${fid})"/>`;
      }
      svg += petalsSvg;
    }
    svg += `<circle cx="${cx}" cy="${cy}" r="${size * 0.1}" fill="${cat.detail}" opacity="0.3"/>`;
  } else if (style === 'jasmine') {
    for (let p = 0; p < 5; p++) {
      const angle = 72 * p - 90;
      svg += `<path d="${_petalPath(size * 0.25, size * 0.55)}" fill="${cat.main}" opacity="0.3" transform="translate(${cx},${cy}) rotate(${angle})" filter="url(#wcEdge${fid})"/>`;
    }
    svg += `<circle cx="${cx}" cy="${cy}" r="${size * 0.12}" fill="#E8D060" opacity="0.4" filter="url(#wcSoft${fid})"/>`;
  } else {
    const petals = petalCount || 5 + Math.floor(rng() * 2);
    for (let p = 0; p < petals; p++) {
      const angle = (360 / petals) * p + rng() * 10;
      svg += `<ellipse cx="${cx}" cy="${cy}" rx="${size * 0.35}" ry="${size * 0.55}" fill="${cat.wash2}" opacity="0.2" transform="translate(${Math.cos((angle * Math.PI) / 180) * size * 0.25},${Math.sin((angle * Math.PI) / 180) * size * 0.25}) rotate(${angle},${cx},${cy})" filter="url(#wcEdge${fid})"/>`;
    }
    for (let p = 0; p < petals; p++) {
      const angle = (360 / petals) * p + rng() * 8;
      const px = cx + Math.cos((angle * Math.PI) / 180) * size * 0.22;
      const py = cy + Math.sin((angle * Math.PI) / 180) * size * 0.22;
      svg += `<ellipse cx="${px}" cy="${py}" rx="${size * 0.28}" ry="${size * 0.48}" fill="${cat.main}" opacity="0.28" transform="rotate(${angle},${px},${py})" filter="url(#wcEdge${fid})"/>`;
    }
    svg += `<circle cx="${cx}" cy="${cy}" r="${size * 0.1}" fill="${cat.detail}" opacity="0.35" filter="url(#wcSoft${fid})"/>`;
  }
  return svg;
}

function drawCitrusFruit(
  cx: number, cy: number, size: number, rng: RngFn, cat: CatColors, fid: string,
): string {
  let svg = '';
  const outerR = size;
  svg += `<circle cx="${cx}" cy="${cy}" r="${outerR}" fill="${cat.main}" opacity="0.3" filter="url(#wcEdge${fid})"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="${outerR * 0.85}" fill="#FFF8E0" opacity="0.4" filter="url(#wcSoft${fid})"/>`;
  const segs = 8;
  for (let i = 0; i < segs; i++) {
    const a = (360 / segs) * i;
    const rad = (a * Math.PI) / 180;
    svg += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(rad) * outerR * 0.8}" y2="${cy + Math.sin(rad) * outerR * 0.8}" stroke="${cat.main}" stroke-width="0.8" opacity="0.18" filter="url(#wcSoft${fid})"/>`;
  }
  svg += `<circle cx="${cx}" cy="${cy}" r="${outerR * 0.1}" fill="${cat.detail}" opacity="0.25"/>`;
  svg += `<path d="${_leafPath(size * 0.4, size * 0.9, 0.55)}" fill="${cat.leaf}" opacity="0.28" transform="translate(${cx + size + 5},${cy - size * 0.3}) rotate(${35 + rng() * 15})" filter="url(#wcEdge${fid})"/>`;
  return svg;
}

function drawPeach(
  cx: number, cy: number, size: number, rng: RngFn, cat: CatColors, fid: string,
): string {
  let svg = '';
  svg += `<path d="M${cx},${cy - size * 0.8} Q${cx + size * 0.9},${cy - size * 0.6} ${cx + size * 0.7},${cy + size * 0.1} Q${cx + size * 0.4},${cy + size * 0.8} ${cx},${cy + size * 0.7} Q${cx - size * 0.4},${cy + size * 0.8} ${cx - size * 0.7},${cy + size * 0.1} Q${cx - size * 0.9},${cy - size * 0.6} ${cx},${cy - size * 0.8}Z" fill="${cat.main}" opacity="0.28" filter="url(#wcEdge${fid})"/>`;
  svg += `<path d="M${cx},${cy - size * 0.6} Q${cx + 2},${cy} ${cx},${cy + size * 0.5}" fill="none" stroke="${cat.detail}" stroke-width="0.8" opacity="0.18" filter="url(#wcSoft${fid})"/>`;
  svg += `<ellipse cx="${cx - size * 0.2}" cy="${cy - size * 0.2}" rx="${size * 0.2}" ry="${size * 0.15}" fill="white" opacity="0.15" filter="url(#wcSoft${fid})"/>`;
  svg += `<path d="${_leafPath(size * 0.25, size * 0.5, 0.5)}" fill="${cat.leaf}" opacity="0.25" transform="translate(${cx + 3},${cy - size * 0.9}) rotate(${10 + rng() * 20})" filter="url(#wcEdge${fid})"/>`;
  return svg;
}

function drawGrassLeaves(
  cx: number, cy: number, size: number, rng: RngFn, cat: CatColors, fid: string,
): string {
  let svg = '';
  const count = 4 + Math.floor(rng() * 4);
  for (let i = 0; i < count; i++) {
    const baseX = cx - size + rng() * size * 2;
    const tipX = baseX + (rng() - 0.5) * 20;
    const tipY = cy - size * (1.5 + rng() * 1.5);
    const cpX = (baseX + tipX) / 2 + (rng() - 0.5) * 15;
    const cpY = (cy + tipY) / 2;
    svg += `<path d="M${baseX},${cy} Q${cpX},${cpY} ${tipX},${tipY}" fill="none" stroke="${cat.main}" stroke-width="${1 + rng() * 1.5}" opacity="${(0.2 + rng() * 0.15).toFixed(2)}" stroke-linecap="round" filter="url(#wcSoft${fid})"/>`;
  }
  return svg;
}

function drawWaves(
  cx: number, cy: number, size: number, rng: RngFn, cat: CatColors, fid: string,
): string {
  let svg = '';
  for (let w = 0; w < 3; w++) {
    const y = cy - size + w * size * 0.8;
    const amp = size * (0.15 + rng() * 0.15);
    let d = `M${cx - size * 1.5},${y}`;
    for (let x = 0; x <= 3; x++) {
      d += ` Q${cx - size * 1.5 + size * (x + 0.5)},${y + amp * (x % 2 === 0 ? 1 : -1)} ${cx - size * 1.5 + size * (x + 1)},${y}`;
    }
    svg += `<path d="${d}" fill="none" stroke="${cat.main}" stroke-width="${1.5 - w * 0.3}" opacity="${(0.2 - w * 0.04).toFixed(2)}" stroke-linecap="round" filter="url(#wcSoft${fid})"/>`;
  }
  for (let i = 0; i < 3; i++) {
    const bx = cx + (rng() - 0.5) * size * 2;
    const by = cy + (rng() - 0.5) * size;
    const br = 2 + rng() * 5;
    svg += `<circle cx="${bx}" cy="${by}" r="${br}" fill="none" stroke="${cat.main}" stroke-width="0.8" opacity="0.15"/>`;
    svg += `<circle cx="${bx - br * 0.25}" cy="${by - br * 0.25}" r="${br * 0.2}" fill="white" opacity="0.2"/>`;
  }
  return svg;
}

function drawBranch(
  cx: number, cy: number, size: number, rng: RngFn, cat: CatColors, fid: string,
): string {
  let svg = '';
  const endX = cx + size * 1.5 + rng() * size;
  const endY = cy - size * 0.3 + rng() * size * 0.6;
  const cpX = (cx + endX) / 2 + (rng() - 0.5) * 20;
  const cpY = cy - 15 - rng() * 25;
  svg += `<path d="M${cx},${cy} Q${cpX},${cpY} ${endX},${endY}" fill="none" stroke="${cat.detail}" stroke-width="1.8" opacity="0.25" stroke-linecap="round" filter="url(#wcSoft${fid})"/>`;
  const branchPt = 0.4 + rng() * 0.3;
  const bpx = cx + (endX - cx) * branchPt;
  const bpy = cy + (endY - cy) * branchPt;
  svg += `<path d="M${bpx},${bpy} Q${bpx + 12},${bpy - 18} ${bpx + 8 + rng() * 10},${bpy - 25 - rng() * 10}" fill="none" stroke="${cat.detail}" stroke-width="1" opacity="0.18" stroke-linecap="round"/>`;
  for (let i = 0; i < 2 + Math.floor(rng() * 2); i++) {
    const lx = cx + (endX - cx) * (0.3 + rng() * 0.5);
    const ly = cy + (endY - cy) * (0.3 + rng() * 0.5);
    const lSize = size * (0.25 + rng() * 0.2);
    const lRot = -30 + rng() * 60;
    svg += `<path d="${_leafPath(lSize * 0.4, lSize, 0.5)}" fill="${cat.leaf}" opacity="0.25" transform="translate(${lx},${ly}) rotate(${lRot})" filter="url(#wcEdge${fid})"/>`;
  }
  if (rng() > 0.4) {
    const budX = endX;
    const budY = endY;
    svg += `<ellipse cx="${budX}" cy="${budY}" rx="${size * 0.08}" ry="${size * 0.15}" fill="${cat.main}" opacity="0.25" filter="url(#wcEdge${fid})"/>`;
  }
  return svg;
}

function drawBottle(
  cx: number, cy: number, size: number, rng: RngFn, cat: CatColors, fid: string,
): string {
  let svg = '';
  const bw = size * 0.7;
  const bh = size * 1.2;
  const neckW = size * 0.2;
  const neckH = size * 0.35;
  svg += `<path d="M${cx - bw / 2},${cy - bh / 2 + neckH} Q${cx - bw / 2 - 3},${cy} ${cx - bw / 2},${cy + bh / 2} L${cx + bw / 2},${cy + bh / 2} Q${cx + bw / 2 + 3},${cy} ${cx + bw / 2},${cy - bh / 2 + neckH} Z" fill="${cat.main}" opacity="0.15" filter="url(#wcEdge${fid})"/>`;
  svg += `<rect x="${cx - neckW / 2}" y="${cy - bh / 2}" width="${neckW}" height="${neckH}" rx="2" fill="${cat.main}" opacity="0.18" filter="url(#wcEdge${fid})"/>`;
  svg += `<line x1="${cx - bw * 0.15}" y1="${cy - bh * 0.1}" x2="${cx - bw * 0.15}" y2="${cy + bh * 0.25}" stroke="white" stroke-width="1.5" opacity="0.12" stroke-linecap="round"/>`;
  svg += `<path d="${_leafPath(size * 0.2, size * 0.35, 0.45)}" fill="${cat.leaf}" opacity="0.2" transform="translate(${cx + bw * 0.4},${cy - bh * 0.2}) rotate(${20 + rng() * 15})" filter="url(#wcEdge${fid})"/>`;
  return svg;
}

export function generateNoteSVG(noteType: string, scentNames: string[]): string {
  const W = 440;
  const H = 140;
  const rng = seededRandom(hashStr(scentNames.join(',') + noteType + Date.now()));
  const scents = scentNames.map((n) => SCENTS.find((s) => s.name === n)).filter(Boolean) as Scent[];
  const primary = scents[0];
  const cat = primary
    ? WATERCOLOR_PALETTE[primary.category] || WATERCOLOR_PALETTE.floral
    : WATERCOLOR_PALETTE.floral;
  const category = primary ? primary.category : 'floral';
  const fid = noteType + (hashStr(scentNames.join(',')) % 9999);

  const filterDef = `
    <defs>
      <filter id="wcEdge${fid}" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" seed="${Math.floor(rng() * 9999)}" result="turb"/>
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="6" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="wcSoft${fid}" x="-5%" y="-5%" width="110%" height="110%">
        <feGaussianBlur stdDeviation="1.2"/>
      </filter>
      <filter id="wcTex${fid}" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" seed="${Math.floor(rng() * 9999)}" result="noise"/>
        <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
        <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="textured"/>
      </filter>
    </defs>`;

  let bgElements = '';
  bgElements += `<rect width="${W}" height="${H}" rx="10" fill="#F5F0E1"/>`;
  const washColors = [cat.wash1, cat.wash2, cat.main, cat.wash1];
  const washCount = 3 + Math.floor(rng() * 2);
  for (let i = 0; i < washCount; i++) {
    const cx = 40 + rng() * (W - 80);
    const cy = 20 + rng() * (H - 40);
    const rx = 80 + rng() * 120;
    const ry = 40 + rng() * 60;
    const opacity = (0.12 + rng() * 0.14).toFixed(2);
    const blob = _wcBlob(rng, cx, cy, rx, ry, 10 + Math.floor(rng() * 5));
    bgElements += `<path d="${blob}" fill="${washColors[i % washColors.length]}" opacity="${opacity}" filter="url(#wcEdge${fid})"/>`;
  }
  for (let i = 0; i < 4 + Math.floor(rng() * 4); i++) {
    const sx = 10 + rng() * (W - 20);
    const sy = 5 + rng() * (H - 10);
    const sr = 2 + rng() * 5;
    const blob = _wcBlob(rng, sx, sy, sr, sr * (0.6 + rng() * 0.8), 6);
    bgElements += `<path d="${blob}" fill="${cat.main}" opacity="${(0.08 + rng() * 0.1).toFixed(2)}" filter="url(#wcEdge${fid})"/>`;
  }

  let mainArt = '';
  const isFloral = ['floral', 'tea'].includes(category);
  const isLeafy = ['herbal', 'green'].includes(category);
  const isFruity = ['citrus', 'fruity'].includes(category);
  const isWoody = ['woody', 'spicy', 'amber', 'musk', 'sweet'].includes(category);
  const isAquatic = category === 'aquatic';

  if (isFloral) {
    const scentId = primary ? primary.id : '';
    const style = scentId === 'rose' ? 'rose' : scentId === 'jasmine' ? 'jasmine' : 'generic';
    const fcx = 60 + rng() * 80;
    const fcy = 30 + rng() * 30;
    const fsize = 18 + rng() * 14;
    mainArt += drawFlower(fcx, fcy, fsize, 0, style, rng, cat, fid);
    if (rng() > 0.5) {
      const fcx2 = fcx + 60 + rng() * 80;
      const fcy2 = fcy + 15 + rng() * 25;
      const fsize2 = 10 + rng() * 8;
      mainArt += drawFlower(fcx2, fcy2, fsize2, 0, 'generic', rng, cat, fid);
    }
  } else if (category === 'citrus') {
    const fcx = 70 + rng() * 60;
    const fcy = H * 0.45 + (rng() - 0.5) * 20;
    const fsize = 22 + rng() * 12;
    mainArt += drawCitrusFruit(fcx, fcy, fsize, rng, cat, fid);
  } else if (category === 'fruity') {
    const fcx = 70 + rng() * 60;
    const fcy = H * 0.45 + (rng() - 0.5) * 15;
    const fsize = 22 + rng() * 10;
    mainArt += drawPeach(fcx, fcy, fsize, rng, cat, fid);
  } else if (isLeafy) {
    const fcx = 80 + rng() * 60;
    const fcy = H * 0.55;
    const fsize = 30 + rng() * 15;
    mainArt += drawGrassLeaves(fcx, fcy, fsize, rng, cat, fid);
  } else if (isAquatic) {
    const fcx = W * 0.4;
    const fcy = H * 0.5;
    const fsize = 30 + rng() * 10;
    mainArt += drawWaves(fcx, fcy, fsize, rng, cat, fid);
  } else if (isWoody) {
    if (rng() > 0.45) {
      const fcx = 40 + rng() * 60;
      const fcy = H * 0.45 + (rng() - 0.5) * 20;
      const fsize = 20 + rng() * 12;
      mainArt += drawBranch(fcx, fcy, fsize, rng, cat, fid);
    } else {
      const fcx = 80 + rng() * 60;
      const fcy = H * 0.48;
      const fsize = 22 + rng() * 10;
      mainArt += drawBottle(fcx, fcy, fsize, rng, cat, fid);
    }
    const lc = 1 + Math.floor(rng() * 3);
    for (let i = 0; i < lc; i++) {
      const lx = 250 + rng() * 120;
      const ly = 20 + rng() * (H - 40);
      const ls = 8 + rng() * 10;
      mainArt += `<path d="${_leafPath(ls * 0.4, ls, 0.5)}" fill="${cat.leaf}" opacity="${(0.12 + rng() * 0.1).toFixed(2)}" transform="translate(${lx},${ly}) rotate(${-40 + rng() * 80})" filter="url(#wcEdge${fid})"/>`;
    }
  }

  let accentArt = '';
  const accentCount = 2 + Math.floor(rng() * 3);
  for (let i = 0; i < accentCount; i++) {
    const ax = 200 + rng() * (W - 220);
    const ay = 15 + rng() * (H - 30);
    const aType = rng();
    if (aType < 0.4) {
      const ls = 5 + rng() * 8;
      accentArt += `<path d="${_leafPath(ls * 0.4, ls, 0.5)}" fill="${cat.leaf}" opacity="${(0.15 + rng() * 0.12).toFixed(2)}" transform="translate(${ax},${ay}) rotate(${-30 + rng() * 60})" filter="url(#wcEdge${fid})"/>`;
    } else if (aType < 0.7) {
      const bs = 3 + rng() * 5;
      accentArt += `<ellipse cx="${ax}" cy="${ay}" rx="${bs * 0.5}" ry="${bs}" fill="${cat.main}" opacity="${(0.12 + rng() * 0.1).toFixed(2)}" filter="url(#wcEdge${fid})"/>`;
    } else {
      const ds = 2 + rng() * 4;
      accentArt += `<circle cx="${ax}" cy="${ay}" r="${ds}" fill="${cat.main}" opacity="${(0.1 + rng() * 0.12).toFixed(2)}" filter="url(#wcSoft${fid})"/>`;
    }
  }
  const bfx = 250 + rng() * 120;
  const bfy = 20 + rng() * 40;
  const bfRot = -20 + rng() * 40;
  accentArt += `<g transform="translate(${bfx},${bfy}) rotate(${bfRot}) scale(${0.5 + rng() * 0.4})" opacity="0.10" filter="url(#wcSoft${fid})">
      <path d="M0,0 C-3,-6 -10,-10 -14,-6 C-12,-3 -6,-1 -2,1 C-4,3 -10,8 -12,12 C-8,9 -3,5 0,3 C3,5 8,9 12,12 C10,8 4,3 2,1 C6,-1 12,-3 14,-6 C10,-10 3,-6 0,0Z" fill="${cat.detail}"/>
    </g>`;
  for (let i = 0; i < 2 + Math.floor(rng() * 2); i++) {
    const px = 180 + rng() * (W - 200);
    const py = 10 + rng() * (H - 20);
    const ps = 4 + rng() * 6;
    const pRot = rng() * 360;
    accentArt += `<ellipse cx="${px}" cy="${py}" rx="${ps * 0.4}" ry="${ps}" fill="${cat.main}" opacity="${(0.08 + rng() * 0.08).toFixed(2)}" transform="rotate(${pRot},${px},${py})" filter="url(#wcSoft${fid})"/>`;
  }

  const spx = W * 0.8 + rng() * W * 0.12;
  const spy = 10 + rng() * 22;
  const sps = 0.28 + rng() * 0.2;
  const sparrowArt = `<g transform="translate(${spx},${spy}) scale(${sps})" opacity="0.08" filter="url(#wcSoft${fid})">
      <path d="M0,0 C-4,-8 -16,-10 -22,-6 C-18,-4 -10,-2 -4,2 C-8,4 -16,8 -20,14 C-14,10 -6,6 0,4 C2,6 6,10 10,8 C8,6 4,4 2,2 C6,0 10,-2 12,-6 C8,-4 4,-2 0,0Z" fill="${cat.detail}"/>
    </g>`;

  let watermarkArt = '';
  scents.forEach((s, i) => {
    const wx = W - 12;
    const wy = H - 12 - i * 14;
    const wOpacity = (0.06 + rng() * 0.02).toFixed(2);
    watermarkArt += `<text x="${wx}" y="${wy}" text-anchor="end" font-family="'Noto Serif SC','Georgia',serif" font-size="11" fill="${cat.detail}" opacity="${wOpacity}" font-style="italic">${s.englishName}</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="140" style="display:block;border-radius:10px;border:1px solid #E0D8C8;margin-bottom:10px;">
    ${filterDef}
    ${bgElements}
    ${mainArt}
    ${accentArt}
    ${sparrowArt}
    ${watermarkArt}
  </svg>`;
}
