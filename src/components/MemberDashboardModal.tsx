import React, { useState } from 'react';
import { Locale } from '../types';
import { uiTranslations } from '../data/translations';
import { X, QrCode, CheckCircle2, Calendar, CreditCard, ShieldCheck } from 'lucide-react';

interface MemberDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  bookedClasses: string[];
  onCancelClass: (className: string) => void;
}

export const MemberDashboardModal: React.FC<MemberDashboardModalProps> = ({
  isOpen,
  onClose,
  locale,
  bookedClasses,
  onCancelClass,
}) => {
  const t = uiTranslations[locale];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181B21] border border-[#2C313B] rounded-2xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-150 my-8">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 end-5 p-2 rounded-lg bg-[#222630] text-[#A3A9B5] hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#B6F500] uppercase mb-2">
            <span className="w-2 h-0.5 bg-[#B6F500]" />
            <span>{locale === 'en' ? 'MEMBER PASS DEMO' : 'ممبر پورٹل ڈیمو'}</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
            {t.member.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#A3A9B5]">
            {t.member.subtitle}
          </p>
        </div>

        {/* Digital Membership Pass Card */}
        <div className="bg-gradient-to-br from-[#0F1115] to-[#1e232d] border border-[#B6F500]/50 rounded-2xl p-6 relative overflow-hidden shadow-xl mb-6">
          <div className="flex items-center justify-between border-b border-[#2C313B] pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#B6F500] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#B6F500]">
                {t.member.statusActive}
              </span>
            </div>
            <span className="text-xs font-semibold text-white">TITAN CLUB ISLAMABAD</span>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center mb-5">
            <div>
              <div className="text-[11px] text-[#A3A9B5] uppercase">Member Name</div>
              <div className="text-base font-bold text-white">Ali Hasan Khan</div>
              <div className="font-mono text-xs text-[#B6F500] mt-1">{t.member.memberId}</div>
            </div>

            <div className="text-end">
              <div className="text-[11px] text-[#A3A9B5] uppercase">Plan Tier</div>
              <div className="text-sm font-bold text-white">{t.member.planName}</div>
              <div className="text-xs text-emerald-400 mt-1 font-semibold">
                {t.member.daysLeft}
              </div>
            </div>
          </div>

          {/* Simulated Barcode / Entry scanner */}
          <div className="pt-3 border-t border-[#2C313B] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#A3A9B5]">
              <QrCode className="w-6 h-6 text-[#B6F500]" />
              <span>{t.member.qrPrompt}</span>
            </div>
            {/* Visual Barcode bars */}
            <div className="flex gap-1 items-center h-7 opacity-80">
              {[4, 2, 5, 1, 3, 6, 2, 4, 3, 5, 2, 4, 6, 3, 2].map((h, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xs"
                  style={{ width: `${(h % 2) + 2}px`, height: `${h * 4 + 6}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Reserved Classes */}
        <div className="space-y-3 mb-6">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#B6F500]" />
            <span>{t.member.myBookings}</span>
          </h4>

          {bookedClasses.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#0F1115] border border-[#2C313B] text-center text-xs text-[#A3A9B5]">
              {t.member.noBookings}
            </div>
          ) : (
            <div className="space-y-2">
              {bookedClasses.map((className, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#0F1115] border border-[#2C313B] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#B6F500]" />
                    <span className="font-semibold text-white">{className}</span>
                  </div>
                  <button
                    onClick={() => onCancelClass(className)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    {t.member.cancelBooking}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#B6F500]" />
            <span>{t.member.recentPayments}</span>
          </h4>

          <div className="p-3.5 rounded-xl bg-[#0F1115] border border-[#2C313B] flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-white">Gold Pro Annual Membership</div>
              <div className="text-[11px] text-[#A3A9B5]">Invoice #INV-2026-904 · Bank Alfalah</div>
            </div>
            <div className="text-end">
              <div className="font-mono font-bold text-white">PKR 105,000</div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {t.member.paid}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#2C313B] text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#222630] text-xs font-semibold text-white hover:bg-[#2b303d]"
          >
            Close Member Pass
          </button>
        </div>
      </div>
    </div>
  );
};
