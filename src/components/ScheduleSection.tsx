import React, { useState } from 'react';
import { Locale, ClassSession } from '../types';
import { uiTranslations } from '../data/translations';
import { initialClasses } from '../data/gymData';
import { Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import Reveal from './motion/Reveal';
import FxButton from './motion/FxButton';

interface ScheduleSectionProps {
  locale: Locale;
  onBookingConfirmed: (className: string) => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ locale, onBookingConfirmed }) => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [classesList, setClassesList] = useState<ClassSession[]>(initialClasses);
  const [bookingToast, setBookingToast] = useState<string | null>(null);

  const t = uiTranslations[locale];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const categoryFilters = [
    { id: 'all', label: t.schedule.allCategories },
    { id: 'strength', label: locale === 'en' ? 'Strength' : 'سٹرینتھ' },
    { id: 'hiit', label: 'HIIT' },
    { id: 'boxing', label: locale === 'en' ? 'Boxing' : 'باکسنگ' },
    { id: 'yoga', label: locale === 'en' ? 'Mobility & Yoga' : 'یوگا' },
    { id: 'crossfit', label: locale === 'en' ? 'CrossFit' : 'کراس فٹ' },
  ];

  const filteredSessions = classesList.filter((session) => {
    const matchDay = selectedDay === 'all' || session.day === selectedDay;
    const matchCat = selectedCategory === 'all' || session.category === selectedCategory;
    return matchDay && matchCat;
  });

  const handleBookSession = (session: ClassSession) => {
    if (session.bookedCount >= session.capacity) return;

    // Update seat count locally
    setClassesList((prev) =>
      prev.map((s) =>
        s.id === session.id ? { ...s, bookedCount: s.bookedCount + 1 } : s
      )
    );

    const title = session[locale].title;
    setBookingToast(`${title} — ${t.schedule.bookedSuccess}`);
    onBookingConfirmed(title);

    setTimeout(() => {
      setBookingToast(null);
    }, 4500);
  };

  return (
    <section id="schedule" className="py-20 bg-[#0F1115] border-b border-[#2C313B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal kind="fade" delay={0.05} className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#B6F500] uppercase mb-3">
            <span className="w-2 h-0.5 bg-[#B6F500]" />
            <span>{t.schedule.tag}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight [text-wrap:balance]">
            {t.schedule.title}
          </h2>
          <p className="mt-4 text-base text-[#A3A9B5] leading-relaxed">
            {t.schedule.subtitle}
          </p>
        </Reveal>

        {/* Day Selectors & Category Filters */}
        <Reveal kind="side" delay={0.1} className="space-y-4 mb-8">
          {/* Day Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                type="button"
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedDay === d
                    ? 'bg-[#B6F500] text-[#0F1115] shadow-md'
                    : 'bg-[#181B21] text-[#A3A9B5] hover:text-white border border-[#2C313B]'
                }`}
              >
                {locale === 'en'
                  ? d
                  : d === 'Monday'
                  ? 'پیر'
                  : d === 'Tuesday'
                  ? 'منگل'
                  : d === 'Wednesday'
                  ? 'بدھ'
                  : d === 'Thursday'
                  ? 'جمعرات'
                  : d === 'Friday'
                  ? 'جمعہ'
                  : 'ہفتہ'}
              </button>
            ))}
          </div>

          {/* Discipline Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {categoryFilters.map((cf) => (
              <button
                key={cf.id}
                onClick={() => setSelectedCategory(cf.id)}
                type="button"
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === cf.id
                    ? 'bg-[#222630] text-[#B6F500] border border-[#B6F500]'
                    : 'bg-[#181B21] text-[#A3A9B5] hover:text-white border border-[#2C313B]'
                }`}
              >
                {cf.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Toast confirmation */}
        {bookingToast && (
          <div className="mb-6 p-4 rounded-xl bg-[#181B21] border border-[#B6F500] text-[#F5F7FA] text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#B6F500] shrink-0" />
              <span>{bookingToast}</span>
            </div>
            <button
              onClick={() => setBookingToast(null)}
              className="text-[#A3A9B5] hover:text-white cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Sessions Timetable Cards */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#181B21] border border-[#2C313B] text-[#A3A9B5] text-sm">
              {locale === 'en'
                ? 'No classes scheduled for the selected filters. Please choose another day or category.'
                : 'منتخب کردہ فلٹرز کے تحت کوئی کلاس موجود نہیں۔ براہ کرم کوئی اور دن منتخب کریں۔'}
            </div>
          ) : (
            filteredSessions.map((session, idx) => {
              const content = session[locale];
              const isFull = session.bookedCount >= session.capacity;
              const remaining = session.capacity - session.bookedCount;

              return (
                <Reveal key={session.id} kind="up" delay={0.08 * idx}>
                  <div className="bg-[#181B21] border border-[#2C313B] hover:border-[#2C313B]/80 rounded-2xl p-6 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 md:max-w-2xl">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5 text-[#B6F500] font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="tabular-nums">
                            {session.startTime} – {session.endTime}
                          </span>
                        </div>
                        <span className="text-[#2C313B]">·</span>
                        <div className="flex items-center gap-1 text-[#A3A9B5]">
                          <MapPin className="w-3.5 h-3.5 text-[#A3A9B5]" />
                          <span>{session.room}</span>
                        </div>
                        <span className="text-[#2C313B]">·</span>
                        <span className="text-xs text-[#A3A9B5]">
                          {t.schedule.intensity}: <strong className="text-white">{content.intensity}</strong>
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight">
                        {content.title}
                      </h3>
                      <p className="text-xs text-[#A3A9B5] leading-relaxed">
                        {content.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                      {/* Capacity Indicator */}
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="w-4 h-4 text-[#A3A9B5]" />
                        <span className="text-[#F5F7FA] font-medium tabular-nums">
                          {session.bookedCount} / {session.capacity}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            isFull
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {isFull ? t.schedule.full : `${remaining} ${t.schedule.seatsLeft}`}
                        </span>
                      </div>

                      {/* Book Spot CTA with FxButton */}
                      <FxButton
                        kind={isFull ? "outline" : "primary"}
                        onClick={() => handleBookSession(session)}
                        className={`!px-5 !py-2.5 text-xs font-bold uppercase tracking-wider !rounded-xl ${
                          isFull ? 'opacity-40 pointer-events-none' : ''
                        }`}
                      >
                        {isFull ? t.schedule.full : t.schedule.bookNow}
                      </FxButton>
                    </div>
                  </div>
                </Reveal>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
