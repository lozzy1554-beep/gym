import React from 'react';
import { Locale } from '../types';
import { uiTranslations } from '../data/translations';
import { Dumbbell, ShieldCheck } from 'lucide-react';

interface FooterProps {
  locale: Locale;
  onOpenAdmin: () => void;
  onOpenMember: () => void;
}

export const Footer: React.FC<FooterProps> = ({ locale, onOpenAdmin, onOpenMember }) => {
  const t = uiTranslations[locale];

  return (
    <footer className="bg-[#0A0C0E] border-t border-[#2C313B] text-[#A3A9B5] text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#2C313B]">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3 text-white font-display text-2xl font-bold tracking-wider">
              <div className="w-9 h-9 rounded-lg bg-[#181B21] border border-[#2C313B] flex items-center justify-center text-[#B6F500]">
                <Dumbbell className="w-5 h-5 -rotate-45" />
              </div>
              <span className="uppercase">{t.nav.brand}</span>
            </div>

            <p className="text-xs text-[#A3A9B5] leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[#A3A9B5]">
              <ShieldCheck className="w-4 h-4 text-[#B6F500]" />
              <span>{t.footer.safetyDisclaimer}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footer.quickLinks}
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {t.nav.services}
                </a>
              </li>
              <li>
                <a href="#plans" className="hover:text-white transition-colors">
                  {t.nav.plans}
                </a>
              </li>
              <li>
                <a href="#trainers" className="hover:text-white transition-colors">
                  {t.nav.trainers}
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-white transition-colors">
                  {t.nav.schedule}
                </a>
              </li>
            </ul>
          </div>

          {/* Operations & Portals */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Portals &amp; Hours
            </div>
            <div className="space-y-2 text-xs">
              <p>
                <strong className="text-white">Facility:</strong> Sector F-7/2, Islamabad
              </p>
              <p>
                <strong className="text-white">Hours:</strong> Mon–Sat 06:00 – 23:00 | Sun 08:00 – 20:00
              </p>
              <p>
                <strong className="text-white">Ladies Slot:</strong> Daily 10:00 – 14:00
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={onOpenAdmin}
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-[#181B21] border border-[#2C313B] text-white hover:text-[#B6F500] text-[11px] font-semibold"
                >
                  Admin Portal
                </button>
                <button
                  onClick={onOpenMember}
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-[#181B21] border border-[#2C313B] text-white hover:text-[#B6F500] text-[11px] font-semibold"
                >
                  Member Pass
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3A9B5]">
          <div>
            &copy; {new Date().getFullYear()} {t.footer.rights}
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">{t.footer.privacy}</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">{t.footer.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
