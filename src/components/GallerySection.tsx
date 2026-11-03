import React, { useState } from 'react';
import { Locale } from '../types';
import { uiTranslations } from '../data/translations';
import { Maximize2, X } from 'lucide-react';
import Reveal from './motion/Reveal';

interface GallerySectionProps {
  locale: Locale;
}

interface GalleryImage {
  id: string;
  url: string;
  category: string;
  en: { title: string; desc: string };
  ur: { title: string; desc: string };
}

const galleryItems: GalleryImage[] = [
  {
    id: 'g-1',
    url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    category: 'STRENGTH ZONE',
    en: {
      title: 'Olympic Weightlifting Platforms',
      desc: 'Eleiko competition barbells and shock-absorbent solid drop platforms.',
    },
    ur: {
      title: 'اولمپک ویٹ لفٹنگ پلیٹ فارمز',
      desc: 'ایلیکو باربیلز اور جھٹکا جذب کرنے والے مخصوص ربڑ پلیٹ فارمز۔',
    },
  },
  {
    id: 'g-2',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    category: 'TURF & SLED',
    en: {
      title: '30m Sled & Sprint Arena',
      desc: 'Indoor high-friction turf lane with prowler sleds and battle ropes.',
    },
    ur: {
      title: '30 میٹر سلیڈ اور اسپرنٹ ٹریک',
      desc: 'پراولر سلیڈز اور ہائی انٹینسٹی روپس کے لیے مخصوص انڈور ٹرف۔',
    },
  },
  {
    id: 'g-3',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    category: 'IRON VAULT',
    en: {
      title: 'Dumbbell & Free Weight Rack',
      desc: 'Solid urethane dumbbells ranging from 2.5 kg up to 60 kg pairs.',
    },
    ur: {
      title: 'ڈمبل اور فری ویٹس ریکس',
      desc: '2.5 کلو گرام سے لے کر 60 کلو گرام کے وزنی ڈمبلز کے مکمل سیٹ۔',
    },
  },
  {
    id: 'g-4',
    url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80',
    category: 'BOXING & COMBAT',
    en: {
      title: 'Combat Studio & Heavy Bags',
      desc: 'Full-size canvas ring with leather teardrop and heavy angle bags.',
    },
    ur: {
      title: 'کامبیٹ اسٹوڈیو اور باکسنگ رنگ',
      desc: 'مکمل باکسنگ رنگ اور جدید لیدر ہیوی بیگز برائے مارشل آرٹس۔',
    },
  },
  {
    id: 'g-5',
    url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    category: 'MOBILITY SUITE',
    en: {
      title: 'Spinal Decompression & Yoga Bay',
      desc: 'Acoustic-treated serene studio for guided posture restoration.',
    },
    ur: {
      title: 'موبلٹی اور اسٹریچنگ بے',
      desc: 'پرسکون ماحول جس میں جوڑوں اور کمر کی لچک بڑھانے والی کلاسز ہوتی ہیں۔',
    },
  },
  {
    id: 'g-6',
    url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    category: 'RECOVERY SUITE',
    en: {
      title: 'Finnish Sauna & Cold Plunge',
      desc: 'Contrast therapy temperature-controlled tubs and cedar dry heat.',
    },
    ur: {
      title: 'فنلینڈ سونا اور کولڈ پلنج لاؤنج',
      desc: 'ورزش کے بعد فوری ریکوری اور پٹھوں کی بحالی کے لیے برفانی ٹبس اور سونا۔',
    },
  },
];

export const GallerySection: React.FC<GallerySectionProps> = ({ locale }) => {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const t = uiTranslations[locale];

  return (
    <section className="py-20 bg-[#0F1115] border-b border-[#2C313B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal kind="fade" delay={0.05} className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#B6F500] uppercase mb-3">
            <span className="w-2 h-0.5 bg-[#B6F500]" />
            <span>{t.gallery.tag}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight [text-wrap:balance]">
            {t.gallery.title}
          </h2>
          <p className="mt-4 text-base text-[#A3A9B5] leading-relaxed">
            {t.gallery.subtitle}
          </p>
        </Reveal>

        {/* Gallery Grid with Reveal scale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => {
            const content = item[locale];

            return (
              <Reveal key={item.id} kind="scale" delay={0.08 * idx}>
                <div
                  onClick={() => setActiveImage(item)}
                  className="group relative rounded-2xl overflow-hidden bg-[#181B21] border border-[#2C313B] hover:border-[#B6F500]/60 transition-all cursor-pointer h-72"
                >
                  <img
                    src={item.url}
                    alt={content.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                  <div className="absolute top-4 start-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B6F500] bg-[#0F1115]/90 px-2.5 py-1 rounded border border-[#2C313B]">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute top-4 end-4 w-8 h-8 rounded-lg bg-[#0F1115]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-[#B6F500]" />
                  </div>

                  <div className="absolute bottom-4 inset-x-4">
                    <h3 className="font-display text-lg font-bold text-white uppercase tracking-tight">
                      {content.title}
                    </h3>
                    <p className="text-xs text-[#A3A9B5] mt-1 line-clamp-2">
                      {content.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#181B21] border border-[#2C313B] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 end-4 z-10 p-2 rounded-lg bg-[#0F1115]/80 text-white hover:text-[#B6F500] transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="h-96 sm:h-[480px] w-full bg-[#0F1115]">
              <img
                src={activeImage.url}
                alt={activeImage[locale].title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 bg-[#181B21] border-t border-[#2C313B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#B6F500] tracking-widest">
                  {activeImage.category}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white uppercase mt-0.5">
                  {activeImage[locale].title}
                </h3>
                <p className="text-xs text-[#A3A9B5] mt-1">
                  {activeImage[locale].desc}
                </p>
              </div>

              <button
                onClick={() => setActiveImage(null)}
                className="px-5 py-2.5 rounded-xl bg-[#222630] text-xs font-semibold text-white hover:bg-[#2b313f] self-start sm:self-auto cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
