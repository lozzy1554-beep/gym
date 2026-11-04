import React from 'react';
import { Locale } from '../types';
import FxButton from './motion/FxButton';

interface WhatsAppButtonProps {
  locale: Locale;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ locale }) => {
  const message =
    locale === 'en'
      ? 'Hello Titan Gym! I am interested in joining or booking a free trial. Please share details.'
      : 'السلام علیکم ٹائٹن جم! میں ٹرائل سیشن اور جم ممبرشپ کی معلومات لینا چاہتا ہوں۔';

  const waUrl = `https://wa.me/923277072542?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 end-6 z-40 flex items-center gap-2">
      <FxButton
        kind="whatsapp"
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        ariaLabel={locale === 'en' ? 'Chat on WhatsApp' : 'واٹس ایپ پر رابطہ'}
        title={locale === 'en' ? 'Chat on WhatsApp' : 'واٹس ایپ پر رابطہ'}
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.15 1.6 5.96L.05 24l6.27-1.64a11.9 11.9 0 0 0 5.75 1.47h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.19-3.49-8.42ZM12.08 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.24-.37a9.88 9.88 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.44 9.9-9.9 9.9Zm5.43-7.41c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.81.38-.28.3-1.06 1.04-1.06 2.52s1.09 2.92 1.24 3.12c.15.2 2.14 3.27 5.18 4.59.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z"/>
        </svg>
      </FxButton>
    </div>
  );
};
