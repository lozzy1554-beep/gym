import React, { useState } from 'react';
import { Locale, ServiceItem } from '../types';
import { uiTranslations } from '../data/translations';
import { initialServices } from '../data/gymData';
import { Dumbbell, Zap, Award, Flame, Check } from 'lucide-react';
import Reveal from './motion/Reveal';
import FxButton from './motion/FxButton';

interface ServicesSectionProps {
  locale: Locale;
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ locale, onSelectService }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const t = uiTranslations[locale];

  const filterTabs = [
    { id: 'all', label: t.services.all },
    { id: 'strength', label: t.services.strength },
    { id: 'cardio', label: t.services.cardio },
    { id: 'coaching', label: t.services.coaching },
    { id: 'wellness', label: t.services.wellness },
  ];

  const filteredServices =
    activeCategory === 'all'
      ? initialServices
      : initialServices.filter((s) => s.category === activeCategory);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5 text-[#B6F500]" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#B6F500]" />;
      case 'Award':
        return <Award className="w-5 h-5 text-[#B6F500]" />;
      case 'Flame':
      default:
        return <Flame className="w-5 h-5 text-[#B6F500]" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-[#0F1115] border-b border-[#2C313B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Filter Controls */}
        <Reveal kind="fade" delay={0.05}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#B6F500] uppercase mb-3">
                <span className="w-2 h-0.5 bg-[#B6F500]" />
                <span>{t.services.tag}</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight [text-wrap:balance]">
                {t.services.title}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#A3A9B5]">
                {t.services.subtitle}
              </p>
            </div>

            {/* Interactive Filter Control Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#181B21] border border-[#2C313B] rounded-xl self-start md:self-auto">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  type="button"
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-[#B6F500] text-[#0F1115] shadow-sm'
                      : 'text-[#A3A9B5] hover:text-white hover:bg-[#222630]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredServices.map((service, idx) => {
            const content = service[locale];
            return (
              <Reveal key={service.id} kind="side" delay={0.1 * idx}>
                <div className="bg-[#181B21] border border-[#2C313B] rounded-2xl p-7 hover:border-[#B6F500]/50 transition-all flex flex-col justify-between h-full group">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#222630] border border-[#2C313B] flex items-center justify-center group-hover:scale-105 transition-transform">
                        {getServiceIcon(service.icon)}
                      </div>
                      <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight group-hover:text-[#B6F500] transition-colors">
                        {content.title}
                      </h3>
                    </div>

                    <p className="text-sm text-[#A3A9B5] leading-relaxed mb-6">
                      {content.shortDesc}
                    </p>

                    <div className="space-y-2.5">
                      {content.details.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-[#F5F7FA]">
                          <Check className="w-4 h-4 text-[#B6F500] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-[#2C313B] flex items-center justify-between">
                    <span className="text-xs text-[#A3A9B5]">
                      {locale === 'en' ? 'Included in Pro & VIP Plans' : 'گولڈ اور پلاٹینم پیکج میں شامل'}
                    </span>
                    <FxButton
                      kind="ghost"
                      onClick={() => onSelectService(service)}
                      className="!p-0 text-xs font-bold uppercase tracking-wider text-[#B6F500]"
                    >
                      <span>{t.services.learnMore} →</span>
                    </FxButton>
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
