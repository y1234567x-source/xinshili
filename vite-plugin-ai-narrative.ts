import { GoogleGenAI } from '@google/genai';
import type { IncomingMessage, ServerResponse } from 'http';

interface AnalyzeRequest {
  customerName?: string;
  customerMood: string;
  customWish?: string;
  topScentName: string;
  soulScentName: string;
  baseScentName: string;
  youthName: string;
}

export function aiAnalyzeNarrativePlugin() {
  return {
    name: 'vite-plugin-ai-narrative',
    configureServer(server: any) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url === '/api/ai-analyze-narrative' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const data: AnalyzeRequest = JSON.parse(body || '{}');
              const {
                customerName = '特邀创作者',
                customerMood = '松弛解压',
                customWish = '',
                topScentName = '甜橙 · 佛手柑',
                soulScentName = '心选主香',
                baseScentName = '雪松 · 檀木',
                youthName = '阳阳',
              } = data;

              const wish = (customWish || '').trim();

              const prompt = `你是一位温暖、富有同理心且专业的芳疗调香师。
在“心适力·闻见彼此”调香共创展会中，特邀心青年【${youthName}】与顾客【${customerName}】共同调制专属香水。

【共创信息】：
- 顾客选定的香味风格底色：【${customerMood}】
- 顾客填写的此刻心境或心愿期待：【${wish || '（未输入，持全然开放期待）'}】
- 心青年【${youthName}】凭纯粹直觉为顾客挑选的灵魂主香：【${soulScentName}】
- 前调基底：【${topScentName}】（8滴）
- 中调灵魂：【${soulScentName}】（16滴）
- 后调基底：【${baseScentName}】（16滴）

【深度理解要求（极其重要）】：
1. 顾客的期待输入聚焦在“心境、愿望与生活场景”。如果顾客输入的是随性、开放式词汇（例如“都可以”、“随便”、“看心情”、“都行”、“看缘分”、“你定”、“无所谓”等）：
   - 这绝对不是冰冷无趣的字眼，而是代表顾客放下执念与控制、全然放松、将一切交给当下相逢的极高信任与松弛！
   - 千万不要机械地直接引用“顾客心中寄托着‘都可以’”，而是要以调香师的敏锐洞察，解读出这份“随遇而安”、“不设限的自由与信任”，以及“允许一切美好自然发生”的心境！
2. 如果顾客输入的是生活场景、情绪或具体心愿（如“考完试犒赏自己”、“想要彻底放空”、“送好朋友生日”、“想要多点阳光”等）：
   - 请精准捕捉其情感内核，将之与【${customerMood}】的心境底色和心青年挑选的【${soulScentName}】深度相融，写出触动人心的共创共鸣。
3. 若顾客偶有提及具象事物（如“大海”、“雨天”等），请将其升华为心境上的意象（如将大海升华为“辽阔宁静与包容的心境”，将雨天升华为“洗净尘嚣与清透”，切勿承诺虚构原料配方），自然引申至本次选定的风格底色与心选主香。
4. 请以富有温度、文学感、芳疗专业度且兼具人情味的笔触撰写。

请严格以合法 JSON 格式输出，字段如下：
{
  "coCreationStory": "不超过130字。生动叙述顾客的心境期盼、心青年挑选的主香以及双人共创的美好相逢过程。",
  "harmonyAnalysis": "不超过110字。专业且诗意地解读前调【${topScentName}】、中调灵魂【${soulScentName}】、后调【${baseScentName}】的香气交融、层次递进与意境共鸣。"
}`;

              const ai = new GoogleGenAI();
              let resultText = '';
              try {
                const response = await ai.models.generateContent({
                  model: 'gemini-3.1-flash-lite',
                  contents: prompt,
                  config: {
                    responseMimeType: 'application/json',
                  },
                });
                resultText = response.text || '{}';
              } catch (primaryErr) {
                console.warn('[AI Narrative] Primary model busy, trying fallback gemini-3.6-flash...', primaryErr);
                const response = await ai.models.generateContent({
                  model: 'gemini-3.6-flash',
                  contents: prompt,
                  config: {
                    responseMimeType: 'application/json',
                  },
                });
                resultText = response.text || '{}';
              }

              const parsed = JSON.parse(resultText);

              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({
                success: true,
                coCreationStory: parsed.coCreationStory,
                harmonyAnalysis: parsed.harmonyAnalysis,
              }));
            } catch (err: any) {
              console.error('[AI Narrative Server Error]', err);
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.statusCode = 500;
              res.end(JSON.stringify({
                success: false,
                error: err.message || 'AI 分析失败',
              }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}
