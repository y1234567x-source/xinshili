import { useState, useCallback, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { SCENTS } from './perfume-data';
import {
  generateDirectionFull,
  generateFormula,
  generatePerfumeName,
  generateStoryCard,
  INITIAL_APP_STATE,
  type AppState,
} from './perfume-algorithm';
import { generateNoteSVG } from './svg-generator';
import '@/styles/perfume.css';
import { toast } from 'sonner';
import { getScentImage } from '@/assets/scents';
import { saveFormula } from '@/api/formula';
import logoSrc from '@/assets/sparrow-logo.png';
import bgSrc from '@/assets/story-bg.jpg';

const STEPS = ['welcome', 'input', 'loading', 'result'] as const;

function getScentId(name: string): string {
  const s = SCENTS.find((x) => x.name === name);
  return s ? s.id : name;
}

const Home = () => {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<AppState>({ ...INITIAL_APP_STATE });
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const updateState = useCallback((u: Partial<AppState>) => {
    setState((p) => ({ ...p, ...u }));
  }, []);

  const goNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, []);

  const goToStart = useCallback(() => {
    setStep(0);
    setState({ ...INITIAL_APP_STATE });
    setInputValue('');
    setInputError(false);
  }, []);

  const prevRef = useRef(-1);
  useEffect(() => {
    if (step === 2 && prevRef.current !== 2 && state.customerWish) {
      const timer = setTimeout(() => {
        const res = generateDirectionFull(state.customerWish);
        const formula = generateFormula(res.direction);
        const name = generatePerfumeName(res.simpleFeelings, res.direction);
        const storyCard = generateStoryCard({
          customerWish: state.customerWish,
          simplifiedFeelings: res.simpleFeelings,
          finalFormula: formula,
          perfumeName: name,
        });
        updateState({
          simplifiedFeelings: res.simpleFeelings,
          direction: res.direction,
          finalFormula: formula,
          perfumeName: name,
          storyCard,
        });
        saveFormula({
          customerWish: state.customerWish,
          perfumeName: name,
          directionName: res.direction.name,
          feelings: res.simpleFeelings,
          formula: {
            top: formula.formula.top.map((item) => ({ name: item.name, drops: `${item.drops}` })),
            middle: formula.formula.middle.map((item) => ({ name: item.name, drops: `${item.drops}` })),
            base: formula.formula.base.map((item) => ({ name: item.name, drops: `${item.drops}` })),
          },
          storyCard,
        });
        goNext();
      }, 1200);
      prevRef.current = step;
      return () => clearTimeout(timer);
    }
    prevRef.current = step;
    return undefined;
  }, [step, state.customerWish, updateState, goNext]);

  const handleSubmitInput = () => {
    if (!inputValue.trim()) {
      setInputError(true);
      return;
    }
    setInputError(false);
    updateState({ customerWish: inputValue.trim() });
    goNext();
  };

  const handleCopy = () => {
    const s = state.storyCard;
    if (!s) return;
    const t = `${s.title}\n${s.coCreators}\n\n${s.keywords.join('、')}\n\n前调：\n${s.formulaByNote.top.join('\n')}\n\n中调：\n${s.formulaByNote.middle.join('\n')}\n\n后调：\n${s.formulaByNote.base.join('\n')}\n\n${s.diluentText}\n\n${s.story}\n\n${s.understandingLine}`.trim();
    navigator.clipboard?.writeText(t).then(() => {
      toast('已复制调香方案');
    });
  };

  const handleGenerateImage = () => {
    const el = storyCardRef.current;
    if (!el || generating) return;
    setGenerating(true);
    html2canvas(el, { scale: 2, backgroundColor: '#F5F0E1', useCORS: true })
      .then((c) => {
        setPreviewImage(c.toDataURL('image/png'));
      })
      .catch(() => {
        toast('图片生成失败，请尝试截屏');
      })
      .finally(() => {
        setGenerating(false);
      });
  };

  const handleDesktopDownload = () => {
    if (!previewImage) return;
    const a = document.createElement('a');
    a.download = `${state.storyCard?.title || '调香方案'}.png`;
    a.href = previewImage;
    a.click();
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const renderWelcome = () => (
    <div className="perfume-page perfume-welcome-page">
      <div className="perfume-welcome-logo-wrap">
        <img src={logoSrc} alt="小雀" />
      </div>
      <div className="perfume-welcome-title">闻见彼此</div>
      <div className="perfume-welcome-en">Smell &middot; Understand &middot; Create</div>
      <p className="perfume-welcome-desc">
        用一句话描述你的心情<br />
        AI 为你生成独一无二的调香方案<br />
        前调 · 中调 · 后调<br />
        完整配方，一目了然
      </p>
      <button
        className="perfume-btn perfume-btn-primary perfume-btn-large"
        onClick={goNext}
        style={{ maxWidth: '320px' }}
      >
        开始调香
      </button>
      <p className="perfume-welcome-footer">
        AI 调香 × 雀亦锵锵<br />
        雀亦虽小，齐鸣如凤
      </p>
    </div>
  );

  const renderInput = () => (
    <div className="perfume-page perfume-input-page">
      <div className="perfume-page-header" style={{ marginBottom: 24 }}>
        <h2 className="perfume-page-title">你想要一瓶<br />什么样的香水？</h2>
        <p className="perfume-page-subtitle">用一句话描述心情、场景或感觉</p>
      </div>
      <div className="perfume-input-area" style={{ marginBottom: 16 }}>
        <textarea
          className="perfume-input"
          rows={4}
          placeholder="例如：我想要一瓶送给刚毕业朋友的香水，希望它有新的开始的感觉，但不要太甜。"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (e.target.value.trim()) setInputError(false);
          }}
        />
        {inputError && (
          <p style={{ color: '#C0392B', fontSize: 13, marginTop: 6 }}>
            请先写下你的香气愿望
          </p>
        )}
      </div>
      <div className="perfume-hint-card">
        <p className="perfume-hint-card-title">可以这样描述</p>
        <ul style={{ paddingLeft: 18, listStyle: 'disc' }}>
          <li>心情：&quot;最近压力很大，想要放松安静的&quot;</li>
          <li>场景：&quot;夏天海边度假的感觉，清新自然&quot;</li>
          <li>对象：&quot;送给女朋友的生日礼物，浪漫温柔&quot;</li>
          <li>风格：&quot;不要甜，要干净极简的木质香&quot;</li>
        </ul>
      </div>
      <div className="perfume-page-footer">
        <button className="perfume-btn perfume-btn-yellow perfume-btn-large" onClick={handleSubmitInput}>
          生成我的调香方案
        </button>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="perfume-page perfume-loading-page">
      <div className="perfume-loading-bird">
        <img src={logoSrc} alt="" />
      </div>
      <p className="perfume-loading-text">AI 正在为你调香</p>
      <p className="perfume-loading-sub">解析愿望 · 匹配香气 · 生成配方</p>
      <div className="perfume-loading-spinner-bar"></div>
    </div>
  );

  const renderResult = () => {
    const s = state.storyCard;
    if (!s) return null;

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const scentName = img.alt;
      const scent = SCENTS.find(s => s.name === scentName);
      if (scent) {
        img.style.background = scent.color;
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
      }
      img.src = '';
    };

    const renderFormulaSection = (label: string, items: string[]) => (
      <>
        <div className="perfume-formula-note-label">{label}</div>
        {items.map((item, i) => {
          const n = item.split('：')[0];
          const drops = item.split('：')[1];
          const scentId = getScentId(n);
          const scent = SCENTS.find(s => s.id === scentId);
          return (
            <div key={i} className="perfume-formula-row">
              <img
                className="perfume-formula-row-icon"
                src={getScentImage(scentId) || ''}
                alt={n}
                style={{ backgroundColor: scent?.color || '#F5F0E1' }}
                onError={handleImageError}
              />
              <span className="perfume-formula-row-name">{n}</span>
              <span className="perfume-formula-row-drops">{drops}</span>
            </div>
          );
        })}
      </>
    );

    return (
      <div className="perfume-page perfume-result-page">
        <button className="perfume-result-back-btn" onClick={goToStart}>
          ← 再调一瓶
        </button>
        <div className="perfume-page-header" style={{ marginBottom: 20, textAlign: 'left' }}>
          <h2 className="perfume-page-title" style={{ fontSize: 22 }}>你的专属调香方案</h2>
        </div>

        <div ref={storyCardRef} className="perfume-story-card">
          <div className="perfume-story-card-bg" style={{ backgroundImage: `url(${bgSrc})` }}></div>
          <div className="perfume-story-card-overlay"></div>
          <div className="perfume-story-card-content">
            <div className="perfume-story-card-seal">和心青年一起闻见彼此</div>
            <div className="perfume-story-card-title">{s.title}</div>
            <div className="perfume-story-card-creators">{s.coCreators}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 4 }}>
              {s.keywords.map((f) => (
                <span key={f} className="perfume-tag">{f}</span>
              ))}
            </div>

            <div className="perfume-story-formula">
              {renderFormulaSection('前 调', s.formulaByNote.top)}
              <div style={{ marginTop: 12 }}></div>
              {renderFormulaSection('中 调', s.formulaByNote.middle)}
              <div style={{ marginTop: 12 }}></div>
              {renderFormulaSection('后 调', s.formulaByNote.base)}
            </div>

            <div className="perfume-formula-divider"></div>
            <p className="perfume-story-drops-total">
              香精总量 <strong>{s.totalDrops}</strong> 滴
            </p>
            <p className="perfume-story-diluent">最后请心青年加入稀释液完成制作</p>

            <div className="perfume-story-text-block">
              <p className="perfume-story-text">{s.story}</p>
              <p className="perfume-story-underline">{s.understandingLine}</p>
            </div>
          </div>
        </div>

        <div className="perfume-result-footer">
          <button
            className="perfume-btn perfume-btn-primary perfume-btn-large"
            onClick={handleGenerateImage}
            disabled={generating}
            style={{ marginBottom: 10 }}
          >
            {generating ? '生成中...' : '保存为图片'}
          </button>
          <button className="perfume-btn perfume-btn-outline" onClick={handleCopy}>
            复制方案文字
          </button>
        </div>
      </div>
    );
  };

  const renderers: Record<string, () => React.ReactNode> = {
    welcome: renderWelcome,
    input: renderInput,
    loading: renderLoading,
    result: renderResult,
  };

  const currentStep = STEPS[step];
  const renderer = renderers[currentStep];

  return (
    <div className="perfume-app">
      {renderer ? renderer() : null}
      {previewImage && (
        <div className="perfume-preview-overlay" onClick={handleClosePreview}>
          <div className="perfume-preview-body" onClick={(e) => e.stopPropagation()}>
            <img
              className="perfume-preview-img"
              src={previewImage}
              alt="调香方案"
            />
            <p className="perfume-preview-hint">长按图片保存到相册</p>
            <div className="perfume-preview-actions">
              <button className="perfume-btn perfume-btn-outline perfume-preview-download" onClick={handleDesktopDownload}>
                下载图片
              </button>
              <button className="perfume-btn perfume-btn-outline perfume-preview-close" onClick={handleClosePreview}>
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
