import React from 'react';
import { Locale } from '../types';
import { MessageCircle } from 'lucide-react';
import FxButton from './motion/FxButton';

interface WhatsAppButtonProps {
  locale: Locale;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ locale }) => {
  const message =
    locale === 'en'
      ? 'Hello Titan Gym! I am interested in joining or booking a free trial. Please share details.'
      : 'السلام علیکم ٹائٹن جم! میں ٹرائل سیشن اور جم ممبرشپ کی معلومات لینا چاہتا ہوں۔';

  const waUrl = `https://wa.me/923008594411?text=${encodeURIComponent(message)}`;

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
        <MessageCircle className="w-6 h-6 fill-current" />
      </FxButton>
    </div>
  );
};
