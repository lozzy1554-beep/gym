import React from 'react';
import { Locale } from '../types';
import { uiTranslations } from '../data/translations';
import { CheckCircle2, Compass, Layers, Shield, Sparkles } from 'lucide-react';
import Reveal from './motion/Reveal';

interface AboutFacilitiesProps {
  locale: Locale;
}

export const AboutFacilities: React.FC<AboutFacilitiesProps> = ({ locale }) => {
  const t = uiTranslations[locale];

  const facilityCards = [
    {
      title: t.about.features[0].title,
      desc: t.about.features[0].desc,
      icon: <Layers className="w-6 h-6 text-[#B6F500]" />,
      spec: locale === 'en' ? '6 Eleiko IWF Drop Platforms' : '6 بین الاقوامی ایلیکو ڈراپ پلیٹ فارمز',
    },
    {
      title: t.about.features[1].title,
      desc: t.about.features[1].desc,
      icon: <Compass className="w-6 h-6 text-[#B6F500]" />,
      spec: locale === 'en' ? 'Custom Biomechanical Leverage' : 'کسٹم بائیومیکینیکل پوزیشنز',
    },
    {
      title: t.about.features[2].title,
      desc: t.about.features[2].desc,
      icon: <Sparkles className="w-6 h-6 text-[#B6F500]" />,
      spec: locale === 'en' ? 'AstroTurf 30m Sprint & Sled Strip' : '30 میٹر انڈور اسپرنٹ ٹریک',
    },
    {
      title: t.about.features[3].title,
      desc: t.about.features[3].desc,
      icon: <Shield className="w-6 h-6 text-[#B6F500]" />,
      spec: locale === 'en' ? 'Cedar Finnish Sauna & Cold Tubs' : 'فنلینڈ سونا اور کولڈ پلنج ٹبس',
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#0F1115] border-b border-[#2C313B] relative fx-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal kind="fade" delay={0.05} className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#B6F500] uppercase mb-3">
            <span className="w-2 h-0.5 bg-[#B6F500]" />
            <span>{t.about.tag}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight [text-wrap:balance]">
            {t.about.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#A3A9B5] leading-relaxed">
            {t.about.description}
          </p>
        </Reveal>

        {/* 4 Feature Bento Cards with Reveal blur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {facilityCards.map((card, idx) => (
            <Reveal key={idx} kind="blur" delay={0.1 * idx}>
              <div className="bg-[#181B21] border border-[#2C313B] hover:border-[#B6F500]/50 rounded-2xl p-7 transition-all hover:bg-[#1a1e26] group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#222630] border border-[#2C313B] flex items-center justify-center group-hover:scale-105 transition-transform">
                      {card.icon}
                    </div>
                    <span className="text-xs font-semibold text-[#A3A9B5] bg-[#0F1115] px-3 py-1 rounded-md border border-[#2C313B]">
                      {card.spec}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-tight group-hover:text-[#B6F500] transition-colors">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#A3A9B5] leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2C313B]/70 flex items-center gap-2 text-xs font-medium text-[#F5F7FA]">
                  <CheckCircle2 className="w-4 h-4 text-[#B6F500] shrink-0" />
                  <span>
                    {locale === 'en'
                      ? 'Sanitized hourly & maintained by equipment engineers'
                      : 'سامان کی باقاعدہ دیکھ بھال اور حفظان صحت کا اعلیٰ معیار'}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
