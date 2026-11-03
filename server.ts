import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Coach AI endpoint with High Thinking
  app.post('/api/coach', async (req, res) => {
    try {
      const { prompt, locale } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.json({
          text:
            locale === 'ur'
              ? 'ٹائٹن کوچ کا مشورہ:\n\n1. ہفتہ وار پروگریسو اوور لوڈ پر توجہ دیں۔\n2. ڈیڈ لفٹ اور اسکواٹ کے دوران کمر کو محفوظ زاویے پر رکھیں۔\n3. سیشن کے بعد ہمارے انفراریڈ سونا اور کولڈ پلنج کا استعمال کریں۔\n4. روزانہ 2 تا 2.2 گرام پروٹین فی کلوگرام جسمانی وزن لیں۔'
              : 'Titan Coach recommendation:\n\n1. Focus on progressive overload across multi-joint compound movements.\n2. Maintain spinal alignment and brace intra-abdominal pressure.\n3. Utilize our 80°C Finnish sauna and 5°C cold plunge for recovery.\n4. Target 1.8g to 2.2g of protein per kg of bodyweight with adequate hydration.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          systemInstruction: `You are the Head Strength Coach & Sports Physiologist at Titan Gym in Islamabad, Pakistan.
Provide concise, practical, highly athletic and scientifically sound fitness, workout programming, and nutrition advice.
If the question is in Urdu or if the locale is 'ur', respond in clear, grammatically sound, natural Urdu.
Otherwise, respond in crisp, professional athletic English.`,
        },
      });

      return res.json({ text: response.text });
    } catch (err: any) {
      console.error('Coach API Error:', err);
      return res.json({
        text:
          'Titan Athletic Coach advice: Focus on consistent training volume, compound movements with 2-3 minutes rest between working sets, and recovery protocols.',
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Titan Gym Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
