import React, { useState } from 'react';
import { Locale, Inquiry, MembershipPlan } from '../types';
import { uiTranslations } from '../data/translations';
import { CheckCircle, X, ShieldAlert, Phone, Sparkles, QrCode } from 'lucide-react';
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
    return `https://wa.me/923008594411?text=${encodeURIComponent(message)}`;
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
                <span className="text-xs text-[#A3A9B5]">F-7/2 Islamabad</span>
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
                <Phone className="w-4 h-4" />
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
