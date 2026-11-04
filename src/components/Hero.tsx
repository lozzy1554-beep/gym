import React from 'react';
import { Locale } from '../types';
import { uiTranslations } from '../data/translations';
import { ArrowRight, Flame, ShieldCheck, Zap } from 'lucide-react';
import FxButton from './motion/FxButton';
import Reveal from './motion/Reveal';

interface HeroProps {
  locale: Locale;
  onOpenTrial: () => void;
}

export const Hero: React.FC<HeroProps> = ({ locale, onOpenTrial }) => {
  const t = uiTranslations[locale];

  return (
    <section className="relative overflow-hidden bg-[#0F1115] pt-12 pb-20 border-b border-[#2C313B] fx-grid fx-scan">
      {/* Athletic ambient glow background */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-80" />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#B6F500]/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean kicker text */}
            <Reveal kind="fade" delay={0.05}>
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#B6F500] uppercase">
                <span className="w-2 h-0.5 bg-[#B6F500]" />
                <span>{t.hero.badge}</span>
              </div>
            </Reveal>

            {/* Headline */}
            <Reveal kind="blur" delay={0.1}>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] [text-wrap:balance]">
                <span>{t.hero.headlineStart} </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B6F500] via-[#cbf83b] to-white">
                  {t.hero.headlineEnd}
                </span>
              </h1>
            </Reveal>

            {/* Subtext */}
            <Reveal kind="up" delay={0.15}>
              <p className="text-base sm:text-lg text-[#A3A9B5] leading-relaxed max-w-2xl">
                {t.hero.subtext}
              </p>
            </Reveal>

            {/* Action Buttons using FxButton kind="primary" and kind="outline" */}
            <Reveal kind="up" delay={0.2}>
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <FxButton
                  kind="primary"
                  onClick={onOpenTrial}
                  className="!px-7 !py-4 text-sm sm:text-base font-bold uppercase tracking-wider"
                >
                  <span>{t.hero.ctaTrial}</span>
                  <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                </FxButton>

                <FxButton
                  kind="outline"
                  href="#plans"
                  className="!px-7 !py-4 text-sm sm:text-base font-semibold"
                >
                  {t.hero.ctaJoin}
                </FxButton>
              </div>
            </Reveal>

            {/* Trust Badges Bar */}
            <Reveal kind="fade" delay={0.25}>
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#A3A9B5] border-t border-[#2C313B]/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B6F500]" />
                  <span>NSCA &amp; ACE Certified Staff</span>
                </div>
                <span className="hidden sm:inline text-[#2C313B]">·</span>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#B6F500]" />
                  <span>Finnish Infrared Sauna Included</span>
                </div>
                <span className="hidden sm:inline text-[#2C313B]">·</span>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#B6F500]" />
                  <span>Zero Lock-In Contracts</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Athletic Visual Card / Marquee Feature */}
          <div className="lg:col-span-5 relative">
            <Reveal kind="side" delay={0.15}>
              <div className="group fx-surface relative rounded-2xl overflow-hidden bg-[#181B21] border border-[#2C313B] shadow-2xl">
                {/* Premium gym photography with layered contrast for readable text */}
                <div className="relative h-96 sm:h-[460px] w-full overflow-hidden bg-[#11151b] flex flex-col justify-end p-6 sm:p-8">
                  <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=85"
                    alt={locale === 'en' ? 'Modern premium gym with strength training equipment' : 'جدید اور پریمیم جم کا اندرونی منظر'}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/65 to-[#0F1115]/10" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
                  <div className="absolute inset-0 opacity-15 bg-grid-pattern pointer-events-none" />
                  
                  {/* SVG Athletic Silhouette & Weights Graphic */}
                  <div className="absolute top-8 end-8 text-[#B6F500]/20 pointer-events-none">
                    <svg width="180" height="180" viewBox="0 0 100 100" fill="currentColor">
                      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
                      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                      <path d="M20 50 L80 50 M35 35 L65 65 M35 65 L65 35" stroke="currentColor" strokeWidth="3" />
                    </svg>
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B6F500] bg-[#0F1115]/80 px-3 py-1 rounded-md border border-[#2C313B]">
                      <span>ELEIKO CERTIFIED PLATFORMS</span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                      {locale === 'en' ? 'SADIQABAD CHAMPIONSHIP HUB' : 'صادق آباد چیمپئن شپ حب'}
                    </h3>

                    <p className="text-sm text-[#A3A9B5] leading-relaxed">
                      {locale === 'en'
                        ? 'Calibrated Eleiko competition bars, cast iron plates, dual functional trainers, and private recovery ice plunge suites.'
                        : 'کیلیبریٹڈ ایلیکو باربیلز، کاسٹ آئرن پلیٹس اور پرائیویٹ ریکوری آئس پلنج رومز۔'}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-[#F5F7FA] border-t border-[#2C313B] pt-4">
                      <div>
                        <span className="text-[#A3A9B5] block">Location</span>
                        <span className="font-semibold">Sadiqabad, Mahrabad</span>
                      </div>
                      <div>
                        <span className="text-[#A3A9B5] block">Hours</span>
                        <span className="font-semibold">06:00 AM – 11:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* 4-Column Proof Metrics Strip (Claim-to-Proof Adjacency) */}
        <div className="mt-16 pt-10 border-t border-[#2C313B] grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <Reveal kind="scale" delay={0.1}>
            <div className="bg-[#181B21]/80 border border-[#2C313B] hover:border-[#B6F500]/40 transition-colors rounded-xl p-5">
              <div className="font-display text-3xl sm:text-4xl font-bold text-[#B6F500] tabular-nums">
                1,850+
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#A3A9B5] mt-1">
                {t.hero.stats.members}
              </div>
            </div>
          </Reveal>

          <Reveal kind="scale" delay={0.15}>
            <div className="bg-[#181B21]/80 border border-[#2C313B] hover:border-[#B6F500]/40 transition-colors rounded-xl p-5">
              <div className="font-display text-3xl sm:text-4xl font-bold text-white tabular-nums">
                16
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#A3A9B5] mt-1">
                {t.hero.stats.coaches}
              </div>
            </div>
          </Reveal>

          <Reveal kind="scale" delay={0.2}>
            <div className="bg-[#181B21]/80 border border-[#2C313B] hover:border-[#B6F500]/40 transition-colors rounded-xl p-5">
              <div className="font-display text-3xl sm:text-4xl font-bold text-[#B6F500] tabular-nums">
                45+
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#A3A9B5] mt-1">
                {t.hero.stats.classes}
              </div>
            </div>
          </Reveal>

          <Reveal kind="scale" delay={0.25}>
            <div className="bg-[#181B21]/80 border border-[#2C313B] hover:border-[#B6F500]/40 transition-colors rounded-xl p-5">
              <div className="font-display text-3xl sm:text-4xl font-bold text-white tabular-nums">
                12,000
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#A3A9B5] mt-1">
                {t.hero.stats.facility}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
