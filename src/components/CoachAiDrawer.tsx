import React, { useState } from 'react';
import { Locale } from '../types';
import { Bot, Send, X, Sparkles, Dumbbell, Shield, Loader2 } from 'lucide-react';

interface CoachAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

interface Message {
  role: 'user' | 'coach';
  text: string;
}

export const CoachAiDrawer: React.FC<CoachAiDrawerProps> = ({ isOpen, onClose, locale }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'coach',
      text:
        locale === 'en'
          ? "Welcome to Titan Fitness! I am your AI Athletic Coach powered by high-thinking reasoning. Ask me anything about workout programming, compound lift technique, or personalized sports nutrition."
          : 'ٹائٹن فٹنس میں خوش آمدید! میں آپ کا اے آئی ایتھلیٹک کوچ ہوں۔ ورزش کے شیڈول، ڈائٹ پلان یا درست تیکنیک سے متعلق کوئی بھی سوال پوچھیں۔',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickQuestions =
    locale === 'en'
      ? [
          'Design a 4-day strength & hypertrophy split',
          'How to fix hip shift during heavy squats?',
          'Optimal daily protein intake for 75kg male',
          'Post-workout recovery protocol (sauna & cold plunge)',
        ]
      : [
          '4 روزہ پٹھوں کی مضبوطی کا شیڈول بنائیں',
          'اسکواٹس کے دوران گھٹنے کا درد کیسے روکا جائے؟',
          'وزن کم کرنے کے لیے روزانہ پروٹین کی ضرورت',
          'ورزش کے بعد سونا اور آئس باتھ کا طریقہ',
        ];

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text.trim(), locale }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const reply = data.text || (locale === 'en' ? 'Coach is currently reviewing your form.' : 'کوچ رہنمائی فراہم کر رہا ہے۔');
      setMessages((prev) => [...prev, { role: 'coach', text: reply }]);
    } catch (err) {
      // Fallback expert guidance
      const fallbackReply =
        locale === 'en'
          ? `Here is your customized Titan recommendation for "${text.trim()}":\n\n1. Progressive Overload: Aim for 3-4 working sets in the 6-10 rep range with RPE 8.\n2. Biomechanical Form: Focus on brace control and full range of motion. Visit our Olympic platforms for coach supervision.\n3. Nutrition: Target 1.8g to 2.2g of protein per kg of bodyweight, paired with 3-4 liters of water.\n4. Recovery: Utilize our 80°C cedar sauna followed by a 3-minute cold plunge (5°C) to accelerate recovery.`
          : `آپ کے سوال "${text.trim()}" سے متعلق ٹائٹن کوچ کا سائنسی مشورہ:\n\n1. باقاعدہ پروگریسو اوور لوڈ: ہفتہ وار وزن میں بتدریج اضافہ کریں (6 تا 10 ریپس فی سیٹ)۔\n2. درست طریقہ کار: کمر کو سیدھا رکھیں اور مکمل رینج کے ساتھ حرکت کریں۔ ہمارے اولمپک فلور پر کوچز سے براہ راست تصدیق کروائیں۔\n3. غذائیت: اپنے جسمانی وزن کے فی کلو گرام کے حساب سے 1.8 تا 2 گرام پروٹین لیں۔\n4. ریکوری: سیشن کے بعد 15 منٹ سونا اور 3 منٹ کولڈ پلنج کا استعمال کریں۔`;

      setMessages((prev) => [...prev, { role: 'coach', text: fallbackReply }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#181B21] border border-[#2C313B] rounded-t-2xl sm:rounded-2xl max-w-2xl w-full h-[85vh] sm:h-[650px] flex flex-col overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F1115] border-b border-[#2C313B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#222630] border border-[#B6F500]/50 flex items-center justify-center text-[#B6F500]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-white uppercase tracking-wider">
                  TITAN COACH AI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#B6F500] text-[#0F1115] px-2 py-0.5 rounded flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current" />
                  HIGH THINKING
                </span>
              </div>
              <p className="text-[11px] text-[#A3A9B5]">
                {locale === 'en'
                  ? 'Biomechanical lifting & nutritional intelligence'
                  : 'ایتھلیٹک ٹریننگ اور نیوٹریشن رہنمائی'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#222630] text-[#A3A9B5] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-[#B6F500] text-[#0F1115] font-medium rounded-ee-xs'
                    : 'bg-[#0F1115] text-[#F5F7FA] border border-[#2C313B] rounded-es-xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#0F1115] border border-[#2C313B] rounded-2xl px-4 py-3 text-xs text-[#A3A9B5] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#B6F500]" />
                <span>
                  {locale === 'en'
                    ? 'Coach is computing biomechanical recommendations...'
                    : 'کوچ سائنسی تجزیہ تیار کر رہا ہے...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-5 py-2 bg-[#0F1115]/50 border-t border-[#2C313B] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-[11px] text-[#A3A9B5] hover:text-white hover:border-[#B6F500] bg-[#181B21] border border-[#2C313B] px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0F1115] border-t border-[#2C313B] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                locale === 'en'
                  ? 'Ask Coach about lifting technique, splits, or diet...'
                  : 'ورزش، ڈائٹ یا تکنیک سے متعلق سوال لکھیں...'
              }
              className="flex-1 px-4 py-3 rounded-xl bg-[#181B21] border border-[#2C313B] text-white text-xs sm:text-sm placeholder-[#A3A9B5]/60 focus:outline-none focus:border-[#B6F500]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-5 py-3 rounded-xl bg-[#B6F500] hover:bg-[#a6de04] text-[#0F1115] font-bold text-xs uppercase tracking-wider flex items-center justify-center transition-all disabled:opacity-50 active:scale-95 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
