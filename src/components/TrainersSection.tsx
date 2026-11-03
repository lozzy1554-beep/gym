import React, { useState } from 'react';
import { Locale, Trainer } from '../types';
import { uiTranslations } from '../data/translations';
import { initialTrainers } from '../data/gymData';
import { Award, Clock, Phone, X, Check } from 'lucide-react';
import Reveal from './motion/Reveal';
import FxButton from './motion/FxButton';

interface TrainersSectionProps {
  locale: Locale;
  onBookTrainer: (trainer: Trainer) => void;
}

export const TrainersSection: React.FC<TrainersSectionProps> = ({ locale, onBookTrainer }) => {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const t = uiTranslations[locale];

  return (
    <section id="trainers" className="py-20 bg-[#0F1115] border-b border-[#2C313B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal kind="fade" delay={0.05} className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#B6F500] uppercase mb-3">
            <span className="w-2 h-0.5 bg-[#B6F500]" />
            <span>{t.trainers.tag}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight [text-wrap:balance]">
            {t.trainers.title}
          </h2>
          <p className="mt-4 text-base text-[#A3A9B5] leading-relaxed">
            {t.trainers.subtitle}
          </p>
        </Reveal>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialTrainers.map((trainer, idx) => {
            const content = trainer[locale];

            return (
              <Reveal key={trainer.id} kind="scale" delay={0.1 * idx}>
                <div className="bg-[#181B21] border border-[#2C313B] rounded-2xl overflow-hidden hover:border-[#B6F500]/60 transition-all flex flex-col justify-between group h-full">
                  <div>
                    {/* Photo with Overlay */}
                    <div className="relative h-64 w-full bg-[#222630] overflow-hidden">
                      <img
                        src={trainer.photoUrl}
                        alt={content.name}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#181B21] via-transparent to-transparent" />

                      <div className="absolute top-3 end-3 bg-[#0F1115]/90 border border-[#2C313B] px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#B6F500] tabular-nums">
                        {trainer.experienceYears}+ {t.trainers.experience}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight group-hover:text-[#B6F500] transition-colors">
                        {content.name}
                      </h3>
                      <div className="text-xs font-medium text-[#B6F500] mt-1 mb-3">
                        {content.role}
                      </div>
                      <p className="text-xs text-[#A3A9B5] line-clamp-3 leading-relaxed mb-4">
                        {content.bio}
                      </p>

                      {/* Specialties */}
                      <div className="space-y-1.5 mb-2">
                        {content.specialties.slice(0, 3).map((spec, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#F5F7FA]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B6F500]" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-2.5">
                    <FxButton
                      kind="outline"
                      onClick={() => setSelectedTrainer(trainer)}
                      className="w-full !py-2.5 text-xs font-semibold !rounded-lg"
                    >
                      {t.trainers.viewSchedule}
                    </FxButton>
                    <FxButton
                      kind="primary"
                      onClick={() => onBookTrainer(trainer)}
                      className="w-full !py-2.5 text-xs font-bold uppercase tracking-wider !rounded-lg"
                    >
                      {t.trainers.bookSession}
                    </FxButton>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Trainer Detail Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181B21] border border-[#2C313B] rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedTrainer(null)}
              className="absolute top-5 end-5 p-2 rounded-lg bg-[#222630] text-[#A3A9B5] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#222630] shrink-0 border border-[#2C313B]">
                <img
                  src={selectedTrainer.photoUrl}
                  alt={selectedTrainer[locale].name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-white uppercase">
                  {selectedTrainer[locale].name}
                </h3>
                <div className="text-xs text-[#B6F500] font-medium">
                  {selectedTrainer[locale].role}
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs text-[#A3A9B5] leading-relaxed">
              <p>{selectedTrainer[locale].bio}</p>

              <div>
                <div className="font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#B6F500]" />
                  <span>Verified Certifications</span>
                </div>
                <div className="space-y-1.5 ps-1">
                  {selectedTrainer[locale].certifications.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-[#F5F7FA]">
                      <Check className="w-3.5 h-3.5 text-[#B6F500]" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#222630] border border-[#2C313B] flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#B6F500]" />
                  <span>{selectedTrainer[locale].schedule}</span>
                </div>
                <span className="text-[11px] text-[#B6F500] font-bold uppercase">Floor Hours</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#2C313B] flex gap-3">
              <FxButton
                kind="primary"
                onClick={() => {
                  const tr = selectedTrainer;
                  setSelectedTrainer(null);
                  onBookTrainer(tr);
                }}
                className="flex-1 !py-3 text-xs font-bold uppercase tracking-wider !rounded-xl"
              >
                Book 1-on-1 Session
              </FxButton>
              <FxButton
                kind="outline"
                href={`https://wa.me/923008594411?text=Hello%20Titan%20Gym,%20I%20want%20to%20train%20with%20${encodeURIComponent(selectedTrainer[locale].name)}`}
                target="_blank"
                rel="noreferrer"
                className="!py-3 !px-4 text-xs font-semibold !rounded-xl"
              >
                <Phone className="w-4 h-4 text-[#B6F500]" />
                <span>WhatsApp</span>
              </FxButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
