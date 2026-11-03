import React from 'react';
import { Locale } from '../types';
import { uiTranslations } from '../data/translations';
import { initialTestimonials } from '../data/gymData';
import { Star, TrendingUp } from 'lucide-react';
import Reveal from './motion/Reveal';

interface TestimonialsSectionProps {
  locale: Locale;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ locale }) => {
  const t = uiTranslations[locale];

  return (
    <section className="py-20 bg-[#0F1115] border-b border-[#2C313B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal kind="fade" delay={0.05} className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#B6F500] uppercase mb-3">
            <span className="w-2 h-0.5 bg-[#B6F500]" />
            <span>{t.testimonials.tag}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight [text-wrap:balance]">
            {t.testimonials.title}
          </h2>
          <p className="mt-4 text-base text-[#A3A9B5] leading-relaxed">
            {t.testimonials.subtitle}
          </p>
        </Reveal>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {initialTestimonials.map((item, idx) => {
            const achievement = item.achievement[locale];
            const quote = item.quote[locale];

            return (
              <Reveal key={item.id} kind="blur" delay={0.1 * idx}>
                <div className="bg-[#181B21] border border-[#2C313B] rounded-2xl p-7 flex flex-col justify-between hover:border-slate-600 transition-all h-full">
                  <div>
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#B6F500] text-[#B6F500]" />
                      ))}
                    </div>

                    {/* Concrete Milestone Stat */}
                    <div className="mb-4 p-3 rounded-xl bg-[#0F1115] border border-[#2C313B] flex items-center gap-2.5 text-xs font-semibold text-[#B6F500]">
                      <TrendingUp className="w-4 h-4 shrink-0" />
                      <span>{achievement}</span>
                    </div>

                    <p className="text-sm text-[#F5F7FA] italic leading-relaxed mb-6">
                      "{quote}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#2C313B] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{item.memberName}</span>
                      <span className="text-[#A3A9B5]">{item.duration}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#B6F500] bg-[#222630] px-2.5 py-1 rounded-md">
                      Verified Member
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
