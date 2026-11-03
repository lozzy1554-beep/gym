import React, { useState } from 'react';
import { Locale, Inquiry } from '../types';
import { uiTranslations } from '../data/translations';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import Reveal from './motion/Reveal';
import FxButton from './motion/FxButton';

interface ContactSectionProps {
  locale: Locale;
  onInquirySubmitted: (inquiry: Inquiry) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ locale, onInquirySubmitted }) => {
  const t = uiTranslations[locale];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newInquiry: Inquiry = {
        id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'contact',
        fullName: name.trim(),
        phone: phone.trim(),
        message: message.trim() || undefined,
        locale,
        consentGiven: true,
        status: 'new',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };

      onInquirySubmitted(newInquiry);
      setIsSubmitting(false);
      setSubmitted(true);
      setName('');
      setPhone('');
      setMessage('');

      setTimeout(() => {
        setSubmitted(false);
      }, 6000);
    }, 700);
  };

  return (
    <section id="contact" className="py-20 bg-[#0F1115] border-b border-[#2C313B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal kind="fade" delay={0.05} className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#B6F500] uppercase mb-3">
            <span className="w-2 h-0.5 bg-[#B6F500]" />
            <span>{t.contact.tag}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight [text-wrap:balance]">
            {t.contact.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Hours Card */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal kind="side" delay={0.1}>
              <div className="bg-[#181B21] border border-[#2C313B] rounded-2xl p-7 space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#222630] border border-[#2C313B] flex items-center justify-center shrink-0 text-[#B6F500]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A3A9B5] block mb-1">
                      {t.contact.addressLabel}
                    </span>
                    <p className="text-sm text-white font-medium leading-relaxed">
                      {t.contact.addressVal}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#222630] border border-[#2C313B] flex items-center justify-center shrink-0 text-[#B6F500]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A3A9B5] block mb-1">
                      {t.contact.phoneLabel}
                    </span>
                    <div className="text-sm text-white font-medium space-y-1">
                      <p>
                        <bdi className="font-mono text-[#B6F500]">+92 51 2891234</bdi> (Landline)
                      </p>
                      <p>
                        <bdi className="font-mono text-[#B6F500]">+92 300 8594411</bdi> (WhatsApp Desk)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#222630] border border-[#2C313B] flex items-center justify-center shrink-0 text-[#B6F500]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A3A9B5] block mb-1">
                      {t.contact.hoursLabel}
                    </span>
                    <div className="text-xs sm:text-sm text-white space-y-1">
                      <p>{t.contact.hoursWeekday}</p>
                      <p className="text-[#A3A9B5]">{t.contact.hoursSunday}</p>
                      <div className="mt-2 text-[11px] font-semibold text-[#B6F500] bg-[#222630] px-2.5 py-1 rounded inline-block">
                        {t.contact.femaleHours}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Google Maps Embed / Interactive preview */}
            <Reveal kind="scale" delay={0.15}>
              <div className="rounded-2xl overflow-hidden bg-[#181B21] border border-[#2C313B] h-60 relative shadow-md">
                <iframe
                  title={t.contact.mapEmbedTitle}
                  src="https://www.google.com/maps?q=Sadiqabad%2C%20Mahrabad%2C%20Pakistan&output=embed"
                  className="w-full h-full border-0 filter invert contrast-125 opacity-85"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a href="https://www.google.com/maps/search/?api=1&query=Sadiqabad%2C%20Mahrabad%2C%20Pakistan" target="_blank" rel="noopener noreferrer" className="absolute bottom-3 end-3 z-10 rounded-lg bg-[#B6F500] px-4 py-2 text-xs font-bold text-[#0F1115] shadow-lg hover:bg-white transition-colors">
                  {locale === 'en' ? 'Open Live Map' : 'گوگل میپس پر کھولیں'}
                </a>
              </div>
            </Reveal>
          </div>

          {/* Quick Message Form */}
          <div className="lg:col-span-7 bg-[#181B21] border border-[#2C313B] rounded-2xl p-7 sm:p-9">
            <Reveal kind="fade" delay={0.1}>
              <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight mb-2">
                {t.contact.sendInquiry}
              </h3>
              <p className="text-xs sm:text-sm text-[#A3A9B5] mb-6">
                {locale === 'en'
                  ? 'Have a custom inquiry regarding corporate memberships, trainer availability, or VIP lockers? Leave a message and our management team will reach out within 2 hours.'
                  : 'کارپوریٹ ممبرشپ، ٹرینرز کی دستیابی یا کسی بھی معلومات کے لیے میسج بھیجیں۔ ہماری ٹیم جلد رابطہ کرے گی۔'}
              </p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-[#0F1115] border border-[#B6F500] text-center space-y-3 animate-in fade-in">
                  <CheckCircle2 className="w-8 h-8 text-[#B6F500] mx-auto" />
                  <h4 className="text-base font-bold text-white">
                    {locale === 'en' ? 'Message Sent Successfully!' : 'پیغام موصول ہو گیا ہے!'}
                  </h4>
                  <p className="text-xs text-[#A3A9B5]">
                    {locale === 'en'
                      ? 'Thank you! Our front desk manager has been notified and will message you on WhatsApp shortly.'
                      : 'شکریہ! ہماری ریسیپشن ٹیم نے آپ کا پیغام نوٹ کر لیا ہے اور جلد واٹس ایپ پر جواب دے گی۔'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                      {t.trial.nameLabel} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={locale === 'en' ? 'e.g. Bilal Ahmed' : 'مثلاً: بلال احمد'}
                      className="w-full px-4 py-3 rounded-xl bg-[#0F1115] border border-[#2C313B] text-white text-xs sm:text-sm focus:border-[#B6F500] focus:outline-none transition-colors"
                    />
                  </div>

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
                      className="w-full px-4 py-3 rounded-xl bg-[#0F1115] border border-[#2C313B] text-white text-xs sm:text-sm focus:border-[#B6F500] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F5F7FA] mb-1.5">
                      {locale === 'en' ? 'Your Message or Question' : 'آپ کا پیغام یا سوال'}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        locale === 'en'
                          ? 'Write your requirements or questions here...'
                          : 'اپنا پیغام یہاں لکھیں...'
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#0F1115] border border-[#2C313B] text-white text-xs sm:text-sm focus:border-[#B6F500] focus:outline-none resize-none transition-colors"
                    />
                  </div>

                  {/* FxButton submit with ripple and loading bar */}
                  <div className="pt-2">
                    <FxButton
                      kind="submit"
                      type="submit"
                      loading={isSubmitting}
                      className="!px-8 !py-3.5 text-xs font-bold uppercase tracking-wider !rounded-xl"
                    >
                      <Send className="w-4 h-4" />
                      <span>{locale === 'en' ? 'Send Inquiry' : 'انکوائری بھیجیں'}</span>
                    </FxButton>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
