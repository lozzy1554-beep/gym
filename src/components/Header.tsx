import React, { useState } from 'react';
import { Locale } from '../types';
import { uiTranslations } from '../data/translations';
import { Globe, Shield, User, Menu, X } from 'lucide-react';
import FxButton from './motion/FxButton';

interface HeaderProps {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  onOpenTrial: () => void;
  onOpenAdmin: () => void;
  onOpenMember: () => void;
  inquiryCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  locale,
  setLocale,
  onOpenTrial,
  onOpenAdmin,
  onOpenMember,
  inquiryCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = uiTranslations[locale];

  const handleLocaleToggle = () => {
    const nextLocale: Locale = locale === 'en' ? 'ur' : 'en';
    setLocale(nextLocale);
    document.documentElement.lang = nextLocale;
    document.documentElement.dir = nextLocale === 'ur' ? 'rtl' : 'ltr';
  };

  const navLinks = [
    { href: '#about', label: t.nav.about },
    { href: '#services', label: t.nav.services },
    { href: '#plans', label: t.nav.plans },
    { href: '#trainers', label: t.nav.trainers },
    { href: '#schedule', label: t.nav.schedule },
    { href: '#faq', label: t.nav.faq },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0F1115]/95 backdrop-blur-md border-b border-[#2C313B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="flex items-center gap-3 text-white font-display text-2xl font-bold tracking-wider hover:text-[#B6F500] transition-colors whitespace-nowrap shrink-0 group"
        >
          <img
            src="/assets/titan-gym-logo.svg"
            alt="Titan Gym logo"
            className="w-11 h-11 rounded-full object-cover border border-[#D6A12A] shadow-sm group-hover:scale-105 transition-transform"
          />
          <span className="tracking-widest uppercase">{t.nav.brand}</span>
        </a>

        {/* Zone 2: Navigation Links using FxButton ghost with energy underline */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#A3A9B5]">
          {navLinks.map((link) => (
            <FxButton
              key={link.href}
              kind="ghost"
              href={link.href}
              className="text-[#A3A9B5] hover:text-white text-sm font-medium whitespace-nowrap shrink-0"
            >
              {link.label}
            </FxButton>
          ))}
        </nav>

        {/* Zone 3: Actions (Language switcher, Admin, Member, Primary CTA) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={handleLocaleToggle}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181B21] border border-[#2C313B] text-xs font-semibold text-[#F5F7FA] hover:border-[#B6F500] hover:text-[#B6F500] transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#B6F500] cursor-pointer"
            title={locale === 'en' ? 'اردو میں تبدیل کریں' : 'Switch to English'}
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#B6F500]" />
            <span>{locale === 'en' ? 'اردو' : 'English'}</span>
          </button>

          {/* Member Portal Button */}
          <button
            onClick={onOpenMember}
            type="button"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181B21] border border-[#2C313B] text-xs font-medium text-[#A3A9B5] hover:text-white hover:border-slate-500 transition-colors whitespace-nowrap cursor-pointer"
            title="Member Pass & Bookings"
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.nav.memberPortal}</span>
          </button>

          {/* Admin CMS Button */}
          <button
            onClick={onOpenAdmin}
            type="button"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181B21] border border-[#2C313B] text-xs font-medium text-[#A3A9B5] hover:text-[#B6F500] hover:border-[#B6F500]/50 transition-colors whitespace-nowrap cursor-pointer"
            title="Admin Lead Management"
          >
            <Shield className="w-3.5 h-3.5 text-[#B6F500]" />
            <span>{t.nav.adminPortal}</span>
            {inquiryCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#B6F500]" />
            )}
          </button>

          {/* Primary CTA using FxButton primary with shimmer sweep & glow pulse */}
          <FxButton
            kind="primary"
            onClick={onOpenTrial}
            className="!px-4 !py-2 text-xs sm:text-sm font-bold uppercase tracking-wider !rounded-lg"
          >
            {t.nav.bookTrial}
          </FxButton>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="lg:hidden p-2 rounded-lg bg-[#181B21] border border-[#2C313B] text-[#A3A9B5] hover:text-white cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#181B21] border-b border-[#2C313B] px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#F5F7FA] hover:text-[#B6F500] transition-colors py-1 border-b border-[#2C313B]/40"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMember();
              }}
              className="flex-1 py-2 text-xs font-semibold rounded-lg bg-[#222630] border border-[#2C313B] text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-[#B6F500]" />
              {t.nav.memberPortal}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex-1 py-2 text-xs font-semibold rounded-lg bg-[#222630] border border-[#2C313B] text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#B6F500]" />
              {t.nav.adminPortal}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
