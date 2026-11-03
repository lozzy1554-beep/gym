import React, { useState } from 'react';
import { Locale } from '../types';
import { uiTranslations } from '../data/translations';
import { initialFaqs } from '../data/gymData';
import { ChevronDown, Search } from 'lucide-react';
import Reveal from './motion/Reveal';

interface FaqSectionProps {
  locale: Locale;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ locale }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const t = uiTranslations[locale];

  const filteredFaqs = initialFaqs.filter((item) => {
    const q = item[locale].question.toLowerCase();
    const a = item[locale].answer.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    return q.includes(query) || a.includes(query);
  });

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-[#0F1115] border-b border-[#2C313B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal kind="fade" delay={0.05} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#B6F500] uppercase mb-3">
            <span className="w-2 h-0.5 bg-[#B6F500]" />
            <span>{t.faq.tag}</span>
            <span className="w-2 h-0.5 bg-[#B6F500]" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight [text-wrap:balance]">
            {t.faq.title}
          </h2>
        </Reveal>

        {/* Live Search Bar */}
        <Reveal kind="up" delay={0.1} className="relative mb-8">
          <Search className="w-5 h-5 text-[#A3A9B5] absolute start-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.faq.searchPlaceholder}
            className="w-full ps-12 pe-4 py-3.5 rounded-xl bg-[#181B21] border border-[#2C313B] text-white text-xs sm:text-sm placeholder-[#A3A9B5]/60 focus:border-[#B6F500] focus:outline-none transition-colors"
          />
        </Reveal>

        {/* Accordion List with Reveal */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8 text-[#A3A9B5] text-sm">
              {locale === 'en'
                ? 'No matching questions found. Try another search term or message us directly.'
                : 'کوئی متعلقہ سوال نہیں ملا۔ براہ کرم واٹس ایپ پر ہم سے براہ راست رابطہ کریں۔'}
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              const content = faq[locale];

              return (
                <Reveal key={faq.id} kind="blur" delay={0.06 * idx}>
                  <div className="rounded-xl bg-[#181B21] border border-[#2C313B] overflow-hidden transition-all">
                    <button
                      onClick={() => toggleItem(faq.id)}
                      type="button"
                      className="w-full px-6 py-5 flex items-center justify-between gap-4 text-start hover:text-[#B6F500] transition-colors cursor-pointer"
                    >
                      <span className="font-semibold text-sm sm:text-base text-white">
                        {content.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#B6F500] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#A3A9B5] leading-relaxed border-t border-[#2C313B]/50 animate-in fade-in">
                        {content.answer}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
