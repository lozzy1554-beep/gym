import React, { useState } from 'react';
import { Locale, Inquiry, MembershipPlan } from '../types';
import { uiTranslations } from '../data/translations';
import { CheckCircle, X, ShieldAlert, Sparkles, QrCode } from 'lucide-react';
import FxButton from './motion/FxButton';

interface TrialBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  preselectedPlan?: MembershipPlan | null;
  onInquirySubmitted: (inquiry: Inquiry) => void;
}

export const TrialBookingModal: React.FC<TrialBookingModalProps> = ({
  isOpen,
  onClose,
  locale,
  preselectedPlan,
  onInquirySubmitted,
}) => {
  const t = uiTranslations[locale];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [timeWindow, setTimeWindow] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [goal, setGoal] = useState<string>('Build Muscle & Hypertrophy');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState<{
    code: string;
    athleteName: string;
    time: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent discard bot submission

    const errs: { [key: string]: string } = {};

    if (!fullName.trim()) {
      errs.fullName = locale === 'en' ? 'Full name is required.' : 'پورا نام درج کرنا لازمی ہے۔';
    }

    if (!phone.trim() || phone.trim().length < 8) {
      errs.phone =
        locale === 'en'
          ? 'Valid phone number is required (at least 8 digits).'
          : 'درست فون نمبر درج کرنا لازمی ہے۔';
    }

    if (!consent) {
      errs.consent =
        locale === 'en'
          ? 'Consent is required to send your pass confirmation.'
          : 'پاس حاصل کرنے کے لیے تصدیق پر متفق ہونا ضروری ہے۔';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    setTimeout(() => {
      const passCode = `TITAN-${Math.floor(1000 + Math.random() * 9000)}-ISB`;
      const newInquiry: Inquiry = {
        id: passCode,
        type: preselectedPlan ? 'contact' : 'trial',
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        preferredTime: timeWindow,
        planId: preselectedPlan ? preselectedPlan.id : undefined,
        goal,
        message: notes.trim() || undefined,
        locale,
        consentGiven: true,
        status: 'new',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };

      onInquirySubmitted(newInquiry);
      setConfirmedPass({
        code: passCode,
        athleteName: fullName.trim(),
        time: timeWindow,
      });
      setIsSubmitting(false);
    }, 750);
  };

  const handleResetAndClose = () => {
    setConfirmedPass(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setErrors({});
    onClose();
  };

  const getWhatsAppLink = () => {
    if (!confirmedPass) return '#';
    const message =
      locale === 'en'
        ? `Hello Titan Gym! I have reserved a 1-day pass (${confirmedPass.code}) for ${confirmedPass.athleteName}. Please confirm my orientation.`
        : `السلام علیکم ٹائٹن جم، میں نے ٹرائل پاس (${confirmedPass.code}) برائے ${confirmedPass.athleteName} بک کیا ہے۔ براہ کرم وقت کی تصدیق فرمائیں۔`;
    return `https://wa.me/923277072542?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181B21] border border-[#2C313B] rounded-2xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-150 my-8">
        <button
          onClick={handleResetAndClose}
          type="button"
          className="absolute top-5 end-5 p-2 rounded-lg bg-[#222630] text-[#A3A9B5] hover:text-white transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedPass ? (
          /* Confirmation State */
          <div className="text-center py-4 space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-[#B6F500]/10 border border-[#B6F500] text-[#B6F500] mx-auto flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                {t.trial.successTitle}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#A3A9B5] max-w-md mx-auto">
                {t.trial.successSubtitle}
              </p>
            </div>

            {/* Pass Badge Card */}
            <div className="bg-[#0F1115] border-2 border-dashed border-[#B6F500]/70 rounded-2xl p-6 text-start max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-[#2C313B] pb-3">
                <span className="text-xs uppercase font-bold text-[#B6F500]">
                  TITAN ATHLETIC PASS
                </span>
                <span className="text-xs text-[#A3A9B5]">Sadiqabad, Mahrabad</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#A3A9B5] uppercase font-semibold">
                    Athlete Name
                  </div>
                  <div className="text-base font-bold text-white">
                    {confirmedPass.athleteName}
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-[11px] text-[#A3A9B5] uppercase font-semibold">
                    {t.trial.referenceCode}
                  </div>
                  <div className="text-base font-mono font-bold text-[#B6F500]">
                    {confirmedPass.code}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#2C313B] text-[11px] text-[#A3A9B5]">
                <QrCode className="w-4 h-4 text-[#B6F500] shrink-0" />
                <span>{t.trial.validHours}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.15 1.6 5.96L.05 24l6.27-1.64a11.9 11.9 0 0 0 5.75 1.47h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.19-3.49-8.42ZM12.08 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.24-.37a9.88 9.88 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.44 9.9-9.9 9.9Zm5.43-7.41c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.81.38-.28.3-1.06 1.04-1.06 2.52s1.09 2.92 1.24 3.12c.15.2 2.14 3.27 5.18 4.59.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z"/></svg>
                <span>{t.trial.sendWhatsApp}</span>
              </a>

              <button
                onClick={handleResetAndClose}
                type="button"
                className="py-3.5 px-5 rounded-xl bg-[#222630] hover:bg-[#2c3240] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                {t.trial.close}
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#B6F500] uppercase mb-2">
                <span className="w-2 h-0.5 bg-[#B6F500]" />
                <span>{preselectedPlan ? preselectedPlan[locale].name : t.trial.badge}</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                {preselectedPlan ? 'ENROLL IN MEMBERSHIP' : t.trial.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#A3A9B5]">
                {preselectedPlan
                  ? `Selected plan: PKR ${preselectedPlan.pricePKR.toLocaleString()} / month. Fill your details to reserve membership slot.`
                  : t.trial.description}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hidden honeypot for spam bots */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                  {t.trial.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={locale === 'en' ? 'e.g. Ali Raza' : 'مثلاً: علی رضا'}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1115] border border-[#2C313B] text-white text-xs sm:text-sm focus:border-[#B6F500] focus:outline-none transition-colors"
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Phone (WhatsApp) & Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                    {t.trial.phoneLabel} *
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F1115] border border-[#2C313B] text-white text-xs sm:text-sm focus:border-[#B6F500] focus:outline-none transition-colors"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                    {t.trial.emailLabel}
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F1115] border border-[#2C313B] text-white text-xs sm:text-sm focus:border-[#B6F500] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Preferred Time Window */}
              <div>
                <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                  {t.trial.timeLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'morning', label: t.trial.morning },
                    { id: 'afternoon', label: t.trial.afternoon },
                    { id: 'evening', label: t.trial.evening },
                  ].map((tw) => (
                    <button
                      key={tw.id}
                      type="button"
                      onClick={() => setTimeWindow(tw.id as any)}
                      className={`py-2 px-2 text-[11px] font-semibold rounded-lg border transition-all text-center cursor-pointer ${
                        timeWindow === tw.id
                          ? 'bg-[#B6F500] text-[#0F1115] border-[#B6F500]'
                          : 'bg-[#0F1115] text-[#A3A9B5] border-[#2C313B] hover:text-white'
                      }`}
                    >
                      {tw.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                  {t.trial.goalLabel}
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1115] border border-[#2C313B] text-white text-xs sm:text-sm focus:border-[#B6F500] focus:outline-none"
                >
                  <option value="Build Muscle & Hypertrophy">{t.trial.goalMuscle}</option>
                  <option value="Fat Loss & Conditioning">{t.trial.goalFatLoss}</option>
                  <option value="Olympic Lifting & Pure Strength">{t.trial.goalStrength}</option>
                  <option value="General Health & Mobility">{t.trial.goalHealth}</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                  {t.trial.notesLabel}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    locale === 'en'
                      ? 'e.g. Any previous injuries, preference for ladies floor...'
                      : 'کوئی چوٹ یا مخصوص معلومات...'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F1115] border border-[#2C313B] text-white text-xs sm:text-sm focus:border-[#B6F500] focus:outline-none resize-none"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-[#2C313B] bg-[#0F1115] text-[#B6F500] focus:ring-[#B6F500]"
                  />
                  <span className="text-[11px] text-[#A3A9B5] leading-snug">
                    {t.trial.consentText}
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{errors.consent}</span>
                  </p>
                )}
              </div>

              {/* Submit CTA using FxButton kind="submit" */}
              <div className="pt-2">
                <FxButton
                  kind="submit"
                  type="submit"
                  loading={isSubmitting}
                  className="w-full !py-3.5 text-xs font-bold uppercase tracking-wider !rounded-xl"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSubmitting ? t.trial.submitting : t.trial.submitButton}</span>
                </FxButton>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
