import React, { useState, useEffect } from 'react';
import { Locale, Inquiry, InquiryStatus, MembershipPlan, Trainer, ServiceItem } from './types';
import { initialInquiries, initialPlans } from './data/gymData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutFacilities } from './components/AboutFacilities';
import { ServicesSection } from './components/ServicesSection';
import { PlansPricing } from './components/PlansPricing';
import { TrainersSection } from './components/TrainersSection';
import { ScheduleSection } from './components/ScheduleSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { GallerySection } from './components/GallerySection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TrialBookingModal } from './components/TrialBookingModal';
import { AdminAccess } from './components/AdminAccess';
import { MemberDashboardModal } from './components/MemberDashboardModal';
import { CoachAiDrawer } from './components/CoachAiDrawer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CustomCursor } from './components/CustomCursor';
import PageTransition from './components/motion/PageTransition';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('TITAN_LOCALE');
    return saved === 'ur' || saved === 'en' ? saved : 'en';
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('TITAN_INQUIRIES');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialInquiries;
      }
    }
    return initialInquiries;
  });

  const [plans, setPlans] = useState<MembershipPlan[]>(initialPlans);
  const [bookedClasses, setBookedClasses] = useState<string[]>([
    'Barbell Foundations & Deadlift Mechanics',
    'Titan Functional WOD',
  ]);

  const [isTrialOpen, setIsTrialOpen] = useState(false);
  const [preselectedPlan, setPreselectedPlan] = useState<MembershipPlan | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(() => window.location.pathname.replace(/\\/+$/, '') === '/admin');
  const [isMemberOpen, setIsMemberOpen] = useState(false);
  const [isCoachAiOpen, setIsCoachAiOpen] = useState(false);

  // Keep the dedicated /admin route in sync with browser navigation
  useEffect(() => {
    const syncAdminRoute = () => setIsAdminOpen(window.location.pathname.replace(/\/+$/, '') === '/admin');
    window.addEventListener('popstate', syncAdminRoute);
    return () => window.removeEventListener('popstate', syncAdminRoute);
  }, []);

  const openAdminRoute = () => {
    if (window.location.pathname !== '/admin') window.history.pushState({}, '', '/admin');
    setIsAdminOpen(true);
    window.scrollTo(0, 0);
  };

  const closeAdminRoute = () => {
    if (window.location.pathname === '/admin') window.history.pushState({}, '', '/');
    setIsAdminOpen(false);
  };

  // Sync html attributes on locale change
  useEffect(() => {
    localStorage.setItem('TITAN_LOCALE', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ur' ? 'rtl' : 'ltr';
  }, [locale]);

  // Persist inquiries
  useEffect(() => {
    localStorage.setItem('TITAN_INQUIRIES', JSON.stringify(inquiries));
  }, [inquiries]);

  const handleInquirySubmitted = (newInq: Inquiry) => {
    setInquiries((prev) => [newInq, ...prev]);
  };

  const handleUpdateInquiryStatus = (id: string, status: InquiryStatus, note?: string) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id ? { ...inq, status, ...(note !== undefined ? { internalNote: note } : {}) } : inq
      )
    );
  };

  const handleTogglePlanPublish = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, isPublished: !p.isPublished } : p))
    );
  };

  const handleSelectPlan = (plan: MembershipPlan) => {
    setPreselectedPlan(plan);
    setIsTrialOpen(true);
  };

  const handleBookTrainer = (trainer: Trainer) => {
    setPreselectedPlan(null);
    setIsTrialOpen(true);
  };

  const handleSelectService = (service: ServiceItem) => {
    setIsTrialOpen(true);
  };

  const handleBookingConfirmed = (className: string) => {
    if (!bookedClasses.includes(className)) {
      setBookedClasses((prev) => [className, ...prev]);
    }
  };

  const handleCancelClass = (className: string) => {
    setBookedClasses((prev) => prev.filter((c) => c !== className));
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#F5F7FA] selection:bg-[#B6F500] selection:text-[#0F1115]">
      {/* Premium Red Custom Animated Cursor (Desktop only) */}
      <CustomCursor />

      {/* Top Header */}
      <Header
        locale={locale}
        setLocale={setLocale}
        onOpenTrial={() => {
          setPreselectedPlan(null);
          setIsTrialOpen(true);
        }}
        onOpenAdmin={openAdminRoute}
        onOpenMember={() => setIsMemberOpen(true)}
        inquiryCount={inquiries.filter((i) => i.status === 'new').length}
      />

      <PageTransition pageKey={locale} dir={locale === 'ur' ? -1 : 1}>
        <main>
          {/* Hero Section with fx-grid and fx-scan */}
          <Hero
            locale={locale}
            onOpenTrial={() => {
              setPreselectedPlan(null);
              setIsTrialOpen(true);
            }}
          />

          {/* Facilities & Philosophy */}
          <AboutFacilities locale={locale} />

          {/* Specialized Services */}
          <ServicesSection locale={locale} onSelectService={handleSelectService} />

          {/* Membership Plans & Pricing */}
          <PlansPricing locale={locale} onSelectPlan={handleSelectPlan} />

          {/* Certified Trainers */}
          <TrainersSection locale={locale} onBookTrainer={handleBookTrainer} />

          {/* Interactive Timetable */}
          <ScheduleSection locale={locale} onBookingConfirmed={handleBookingConfirmed} />

          {/* Member Testimonials & Real Milestones */}
          <TestimonialsSection locale={locale} />

          {/* Gym Gallery with Lightbox */}
          <GallerySection locale={locale} />

          {/* Searchable FAQ Accordion */}
          <FaqSection locale={locale} />

          {/* Location, Hours & Direct Contact Form */}
          <ContactSection locale={locale} onInquirySubmitted={handleInquirySubmitted} />
        </main>
      </PageTransition>

      {/* Footer */}
      <Footer
        locale={locale}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenMember={() => setIsMemberOpen(true)}
      />

      {/* Floating WhatsApp Action Button with pulse rings */}
      <WhatsAppButton locale={locale} />

      {/* Floating AI Coach Trigger */}
      <button
        onClick={() => setIsCoachAiOpen(true)}
        type="button"
        className="fixed bottom-6 start-6 z-40 flex items-center gap-2.5 bg-[#181B21] hover:bg-[#222630] border border-[#B6F500]/60 text-white px-4 py-3 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.6)] active:scale-95 transition-all group focus-visible:outline-2 focus-visible:outline-[#B6F500] cursor-pointer"
        aria-label="Ask Titan AI Coach"
        title="Ask Coach AI about lifting technique, splits, or diet"
      >
        <div className="w-6 h-6 rounded-full bg-[#B6F500]/20 text-[#B6F500] flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </div>
        <div className="text-start">
          <div className="text-xs font-bold text-white flex items-center gap-1 leading-none">
            <span>{locale === 'en' ? 'Ask Coach AI' : 'اے آئی کوچ سے پوچھیں'}</span>
            <Sparkles className="w-3 h-3 text-[#B6F500]" />
          </div>
          <span className="text-[10px] text-[#A3A9B5] leading-none">
            {locale === 'en' ? 'Workout & Diet' : 'ورزش و غذا'}
          </span>
        </div>
      </button>

      {/* Modals */}
      <TrialBookingModal
        isOpen={isTrialOpen}
        onClose={() => setIsTrialOpen(false)}
        locale={locale}
        preselectedPlan={preselectedPlan}
        onInquirySubmitted={handleInquirySubmitted}
      />

      {isAdminOpen && (
        <AdminAccess
          locale={locale}
          inquiries={inquiries}
          onUpdateInquiryStatus={handleUpdateInquiryStatus}
          plans={plans}
          onTogglePlanPublish={handleTogglePlanPublish}
          onClose={closeAdminRoute}
        />
      )}

      <MemberDashboardModal
        isOpen={isMemberOpen}
        onClose={() => setIsMemberOpen(false)}
        locale={locale}
        bookedClasses={bookedClasses}
        onCancelClass={handleCancelClass}
      />

      <CoachAiDrawer
        isOpen={isCoachAiOpen}
        onClose={() => setIsCoachAiOpen(false)}
        locale={locale}
      />
    </div>
  );
}
