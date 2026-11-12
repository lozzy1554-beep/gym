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


const getLocalCoachReply = (prompt: string, locale: Locale): string => {
  const q = prompt.toLowerCase();
  const ur = locale === 'ur' || /[\u0600-\u06FF]/.test(prompt);
  const has = (...terms: string[]) => terms.some((term) => q.includes(term));

  if (has('salam', 'assalam', 'hello', 'hi', 'hey', 'السلام', 'سلام', 'ہیلو')) {
    return ur
      ? 'وعلیکم السلام! ٹائٹن جم میں خوش آمدید۔ 😊 آپ ممبرشپ، فیس، ٹرینرز، کلاسز، ٹرائل بکنگ یا ورزش اور ڈائٹ کے بارے میں پوچھ سکتے ہیں۔ میں آپ کی کیا مدد کروں؟'
      : 'Hello! Welcome to Titan Gym. 😊 I can help with memberships, prices, trainers, classes, trial bookings, workouts and nutrition. What would you like to know?';
  }
  if (has('gold', 'گولڈ')) {
    return ur
      ? 'گولڈ پرفارمنس ممبرشپ PKR 2,000 فی 30 دن ہے۔ اس میں سلور کی سہولیات، ہفتہ وار HIIT، باکسنگ اور یوگا کلاسز، سونا اور کولڈ پلنج، ماہانہ 2 پرسنل ٹریننگ سیشنز، نیوٹریشن گائیڈنس اور 2 گیسٹ پاسز شامل ہیں۔ تازہ تفصیلات ادائیگی سے پہلے ٹیم سے کنفرم کر لیں۔'
      : 'Gold Performance costs PKR 2,000 for 30 days. It includes Silver benefits, weekly HIIT/Boxing/Yoga classes, sauna and cold-plunge access, 2 personal-training sessions per month, nutrition guidance and 2 monthly guest passes. Please confirm current details with the team before payment.';
  }
  if (has('silver', 'سلور')) {
    return ur
      ? 'سلور فاؤنڈیشن PKR 1,500 فی 30 دن ہے۔ اس میں جم فلور، فری ویٹس، لاکر روم، ہاٹ شاورز، ابتدائی باڈی کمپوزیشن اسکین اور موبائل ایپ ورک آؤٹ ٹریکنگ شامل ہیں۔ درج شدہ اوقات صبح 6 بجے سے رات 11 بجے تک ہیں۔'
      : 'Silver Foundation costs PKR 1,500 for 30 days. It includes gym-floor and free-weight access, locker room, hot showers, an initial body-composition scan and mobile-app workout tracking. Listed access hours are 6:00 AM–11:00 PM.';
  }
  if (has('platinum', 'پلاٹینم', 'vip')) {
    return ur
      ? 'پلاٹینم VIP ایلیٹ PKR 5,000 فی 30 دن ہے۔ ویب سائٹ کے مطابق اس میں 24/7 ترجیحی رسائی، ماہانہ 8 پرائیویٹ کوچنگ سیشنز، ہفتہ وار InBody ٹریکنگ، پرائیویٹ لاکر، لانڈری اور ریکوری سہولیات شامل ہیں۔'
      : 'Platinum VIP Elite costs PKR 5,000 for 30 days. Listed benefits include 24/7 priority access, 8 private coaching sessions per month, weekly InBody tracking, private locker, laundry and recovery-suite access.';
  }
  if (has('student', 'off-peak', 'off peak', 'اسٹوڈنٹ', 'طلبہ')) {
    return ur
      ? 'اسٹوڈنٹ اور آف پیک ممبرشپ PKR 1,000 فی 30 دن ہے۔ اوقات روزانہ صبح 10 بجے سے شام 4 بجے تک ہیں۔ اسٹوڈنٹ کارڈ کی تصدیق ضروری ہے۔'
      : 'Student & Off-Peak costs PKR 1,000 for 30 days, with access from 10:00 AM to 4:00 PM daily. Student ID verification is required.';
  }
  if (has('boxing', 'باکسنگ')) {
    return ur
      ? 'باکسنگ کنڈیشنگ کے لیے ویب سائٹ پر فرحان احمد درج ہیں۔ ان کی listed specialty باکسنگ، فٹ ورک اور agility ہے، اور listed schedule منگل تا ہفتہ 2 PM–10 PM ہے۔ آنے سے پہلے وقت کنفرم کر لیں۔'
      : 'Farhan Ahmed is listed for boxing conditioning, footwork and agility. His listed schedule is Tuesday–Saturday, 2:00 PM–10:00 PM. Please confirm availability before visiting.';
  }
  if (has('trainer', 'coach', 'ٹرینر', 'کوچ')) {
    return ur
      ? 'ٹائٹن جم کے ویب سائٹ پر درج ٹرینرز: حمزہ طارق (Strength/Weightlifting)، سارہ خان (HIIT/Women’s Strength)، فرحان احمد (Boxing) اور ڈاکٹر عائشہ ملک (Physiotherapy/Mobility)۔ ان کے اوقات تبدیل ہو سکتے ہیں، اس لیے وزٹ سے پہلے کنفرم کریں۔'
      : 'Website-listed trainers: Hamza Tariq (strength/weightlifting), Sarah Khan (HIIT/women’s strength), Farhan Ahmed (boxing) and Dr. Ayesha Malik (physiotherapy/mobility). Schedules can change, so confirm before visiting.';
  }
  if (has('price', 'fee', 'cost', 'charges', 'فیس', 'قیمت', 'کتنے')) {
    return ur
      ? 'ٹائٹن جم کی 30 دن کی ممبرشپ فیس: Student PKR 1,000، Silver PKR 1,500، Gold PKR 2,000، Platinum VIP PKR 5,000۔ کسی اضافی چارج یا رعایت کی تصدیق ٹیم سے کریں۔'
      : 'Titan Gym 30-day membership prices: Student PKR 1,000; Silver PKR 1,500; Gold PKR 2,000; Platinum VIP PKR 5,000. Please ask the team to confirm any extra fees or discounts.';
  }
  if (has('class', 'schedule', 'timetable', 'کلاس', 'شیڈول', 'ٹائمنگ')) {
    return ur
      ? 'ویب سائٹ پر Strength، HIIT، Boxing، Mobility/Yoga اور Functional/CrossFit کلاسز درج ہیں۔ کلاس کا شیڈول اور جگہ دستیاب ہونے کی تصدیق Contact/WhatsApp سے کر لیں۔'
      : 'The website lists Strength, HIIT, Boxing, Mobility/Yoga and Functional/CrossFit classes. Please check the live schedule or contact the team to confirm current timings and availability.';
  }
  if (has('book', 'booking', 'trial', 'join', 'بک', 'ٹرائل', 'داخلہ')) {
    return ur
      ? 'ٹرائل یا ممبرشپ کے لیے ویب سائٹ کے booking/contact حصے میں جائیں یا WhatsApp کے ذریعے ٹیم سے رابطہ کریں۔ چیٹ میں بکنگ خود مکمل نہیں ہوتی؛ ٹیم کی confirmation ضرور حاصل کریں۔'
      : 'To arrange a trial or join, use the website’s booking/contact section or message the team on WhatsApp. This chat cannot complete a booking; please wait for confirmation from the team.';
  }
  if (has('service', 'facility', 'equipment', 'سہولت', 'سروس', 'مشین')) {
    return ur
      ? 'ٹائٹن جم کی درج شدہ سہولیات میں Olympic weightlifting، strength area، HIIT/conditioning، personal coaching، sauna، cold plunge، percussion therapy اور mobility/foam-rolling area شامل ہیں۔'
      : 'Listed Titan Gym facilities include Olympic weightlifting, a strength area, HIIT/conditioning equipment, personal coaching, sauna, cold plunge, percussion therapy and a mobility/foam-rolling area.';
  }
  if (has('thank', 'شکریہ', 'مہربانی')) {
    return ur ? 'خوش رہیے! 😊 ٹائٹن جم کے بارے میں کوئی اور سوال ہو تو ضرور پوچھیں۔' : 'You’re welcome! 😊 Feel free to ask anything else about Titan Gym.';
  }
  return ur
    ? 'آپ کا سوال موصول ہوا۔ اس وقت AI سروس سے رابطہ نہیں ہو رہا، اس لیے میں اس سوال کا درست جواب نہیں بنا سکتا۔ براہِ کرم کچھ دیر بعد دوبارہ کوشش کریں یا ویب سائٹ کے Contact/WhatsApp سے ٹیم سے رابطہ کریں۔'
    : 'I received your question, but the AI service is temporarily unreachable, so I can’t generate a reliable answer right now. Please try again shortly or contact the team through the website’s Contact/WhatsApp section.';
};

export const CoachAiDrawer: React.FC<CoachAiDrawerProps> = ({ isOpen, onClose, locale }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'coach',
      text:
        locale === 'en'
          ? "Welcome to Titan Gym! I can help with memberships, prices, classes, trainers, facilities, bookings, workout plans, nutrition, and recovery. Ask in English or Urdu."
          : 'ٹائٹن جم میں خوش آمدید! میں ممبرشپ، فیس، کلاسز، ٹرینرز، سہولیات، بکنگ، ورزش، غذا اور ریکوری کے بارے میں اردو اور انگریزی میں رہنمائی کر سکتا ہوں۔',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickQuestions =
    locale === 'en'
      ? [
          'What is included in the Gold membership?',
          'Which trainer can help me with boxing?',
          'How do I book a trial session?',
          'Create a beginner 3-day workout plan',
        ]
      : [
          'گولڈ ممبرشپ میں کیا سہولیات شامل ہیں؟',
          'باکسنگ کے لیے کون سے ٹرینر ہیں؟',
          'ٹرائل سیشن کیسے بک کر سکتا ہوں؟',
          'ابتدائی افراد کے لیے تین دن کا ورک آؤٹ پلان بنائیں',
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
      console.error('Titan Coach request failed:', err);
      const fallbackReply = getLocalCoachReply(text.trim(), locale);
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
                  ? 'Ask about plans, classes, trainers, bookings, workouts or nutrition...'
                  : 'ممبرشپ، کلاسز، ٹرینرز، بکنگ یا ورزش کے بارے میں پوچھیں...'
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
