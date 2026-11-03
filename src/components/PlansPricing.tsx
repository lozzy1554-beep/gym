import React, { useState } from 'react';
import { Locale, MembershipPlan } from '../types';
import { uiTranslations } from '../data/translations';
import { initialPlans } from '../data/gymData';
import { Check, ShieldCheck, Zap } from 'lucide-react';
import Reveal from './motion/Reveal';
import FxButton from './motion/FxButton';

interface PlansPricingProps {
  locale: Locale;
  onSelectPlan: (plan: MembershipPlan) => void;
}

type BillingCycle = 'monthly' | 'quarterly' | 'annual';

export const PlansPricing: React.FC<PlansPricingProps> = ({ locale, onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const t = uiTranslations[locale];

  // Price calculations based on billing cycle discounts
  const calculatePrice = (baseMonthlyPrice: number) => {
    if (billingCycle === 'quarterly') {
      // 15% discount
      return Math.round(baseMonthlyPrice * 0.85);
    }
    if (billingCycle === 'annual') {
      // 30% discount
      return Math.round(baseMonthlyPrice * 0.7);
    }
    return baseMonthlyPrice;
  };

  return (
    <section id="plans" className="py-20 bg-[#0F1115] border-b border-[#2C313B] fx-grid fx-scan relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Billing Switcher */}
        <Reveal kind="fade" delay={0.05} className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#B6F500] uppercase mb-3">
            <span className="w-2 h-0.5 bg-[#B6F500]" />
            <span>{t.plans.tag}</span>
            <span className="w-2 h-0.5 bg-[#B6F500]" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight [text-wrap:balance]">
            {t.plans.title}
          </h2>
          <p className="mt-4 text-base text-[#A3A9B5] leading-relaxed">
            {t.plans.subtitle}
          </p>

          {/* Billing Cycle Segmented Control Tabs */}
          <div className="mt-8 inline-flex items-center p-1 bg-[#181B21] border border-[#2C313B] rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              type="button"
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#B6F500] text-[#0F1115] shadow-sm font-bold'
                  : 'text-[#A3A9B5] hover:text-white'
              }`}
            >
              {t.plans.monthly}
            </button>

            <button
              onClick={() => setBillingCycle('quarterly')}
              type="button"
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                billingCycle === 'quarterly'
                  ? 'bg-[#B6F500] text-[#0F1115] shadow-sm font-bold'
                  : 'text-[#A3A9B5] hover:text-white'
              }`}
            >
              <span>{t.plans.quarterly}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                billingCycle === 'quarterly' ? 'bg-[#0F1115] text-[#B6F500]' : 'bg-[#B6F500]/20 text-[#B6F500]'
              }`}>
                {t.plans.quarterlyDiscount}
              </span>
            </button>

            <button
              onClick={() => setBillingCycle('annual')}
              type="button"
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-[#B6F500] text-[#0F1115] shadow-sm font-bold'
                  : 'text-[#A3A9B5] hover:text-white'
              }`}
            >
              <span>{t.plans.annual}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                billingCycle === 'annual' ? 'bg-[#0F1115] text-[#B6F500]' : 'bg-[#B6F500]/20 text-[#B6F500]'
              }`}>
                {t.plans.annualDiscount}
              </span>
            </button>
          </div>
        </Reveal>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {initialPlans.map((plan, idx) => {
            const planContent = plan[locale];
            const effectiveMonthly = calculatePrice(plan.pricePKR);
            const isPopular = plan.isPopular;

            return (
              <Reveal key={plan.id} kind="blur" delay={0.1 * idx}>
                <div
                  className={`relative rounded-2xl flex flex-col justify-between transition-all h-full ${
                    isPopular
                      ? 'bg-[#181B21] border-2 border-[#B6F500] shadow-[0_0_35px_rgba(182,245,0,0.18)] p-7'
                      : 'bg-[#181B21] border border-[#2C313B] hover:border-slate-500 p-6'
                  }`}
                >
                  {/* Popular Marker */}
                  {isPopular && (
                    <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                      <span className="px-3 py-1 rounded-md text-[11px] font-bold tracking-widest uppercase bg-[#B6F500] text-[#0F1115] shadow-md flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" />
                        {t.plans.popularBadge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight">
                        {planContent.name}
                      </h3>
                    </div>

                    <p className="text-xs text-[#A3A9B5] min-h-[36px] mb-6">
                      {planContent.description}
                    </p>

                    {/* Price Block */}
                    <div className="pt-2 pb-6 border-y border-[#2C313B] mb-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-semibold text-[#A3A9B5]">PKR</span>
                        <span className="font-display text-4xl font-bold text-white tabular-nums tracking-tight">
                          {effectiveMonthly.toLocaleString()}
                        </span>
                        <span className="text-xs text-[#A3A9B5]">{t.plans.perMonth}</span>
                      </div>

                      <div className="text-[11px] text-[#A3A9B5] mt-1">
                        {billingCycle === 'monthly' && 'No long-term commitment'}
                        {billingCycle === 'quarterly' && t.plans.billedQuarterly}
                        {billingCycle === 'annual' && t.plans.billedAnnually}
                      </div>
                    </div>

                    {/* Feature Checklist */}
                    <div className="space-y-3 mb-8">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#A3A9B5]">
                        {t.plans.includedTitle}
                      </div>
                      {planContent.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#F5F7FA]">
                          <Check className="w-4 h-4 text-[#B6F500] shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select CTA using FxButton kind="magnetic" */}
                  <div className="w-full">
                    <FxButton
                      kind={isPopular ? "primary" : "magnetic"}
                      onClick={() => onSelectPlan(plan)}
                      className="w-full !py-3.5 text-xs font-bold uppercase tracking-wider !rounded-xl"
                    >
                      {t.plans.joinNow}
                    </FxButton>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Guarantee footer note */}
        <Reveal kind="fade" delay={0.3}>
          <div className="mt-12 max-w-2xl mx-auto p-4 rounded-xl bg-[#181B21]/60 border border-[#2C313B] text-center text-xs text-[#A3A9B5] flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B6F500] shrink-0" />
            <span>{t.plans.guarantee}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
