export type Locale = 'en' | 'ur';

export type InquiryStatus = 'new' | 'contacted' | 'converted' | 'closed';

export interface Inquiry {
  id: string;
  type: 'contact' | 'trial';
  fullName: string;
  phone: string;
  email?: string;
  preferredTime?: 'morning' | 'afternoon' | 'evening';
  planId?: string;
  goal?: string;
  message?: string;
  locale: Locale;
  consentGiven: boolean;
  status: InquiryStatus;
  internalNote?: string;
  createdAt: string;
}

export interface MembershipPlan {
  id: string;
  slug: string;
  pricePKR: number;
  durationDays: number;
  isPopular?: boolean;
  isPublished: boolean;
  sortOrder: number;
  en: {
    name: string;
    description: string;
    features: string[];
    badge?: string;
  };
  ur: {
    name: string;
    description: string;
    features: string[];
    badge?: string;
  };
}

export interface Trainer {
  id: string;
  slug: string;
  phone: string;
  isPublished: boolean;
  photoUrl: string;
  experienceYears: number;
  en: {
    name: string;
    role: string;
    bio: string;
    specialties: string[];
    certifications: string[];
    schedule: string;
  };
  ur: {
    name: string;
    role: string;
    bio: string;
    specialties: string[];
    certifications: string[];
    schedule: string;
  };
}

export interface ClassSession {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  category: 'strength' | 'hiit' | 'boxing' | 'yoga' | 'crossfit';
  startTime: string;
  endTime: string;
  trainerId: string;
  room: string;
  capacity: number;
  bookedCount: number;
  isActive: boolean;
  en: {
    title: string;
    description: string;
    intensity: 'High' | 'Medium' | 'Extreme';
  };
  ur: {
    title: string;
    description: string;
    intensity: 'ہائی' | 'درمیانی' | 'انتہائی';
  };
}

export interface Testimonial {
  id: string;
  memberName: string;
  achievement: {
    en: string;
    ur: string;
  };
  quote: {
    en: string;
    ur: string;
  };
  rating: number;
  duration: string;
  isPublished: boolean;
}

export interface FAQItem {
  id: string;
  category: 'membership' | 'facilities' | 'training' | 'timings';
  en: {
    question: string;
    answer: string;
  };
  ur: {
    question: string;
    answer: string;
  };
}

export interface ServiceItem {
  id: string;
  category: 'strength' | 'cardio' | 'coaching' | 'wellness';
  icon: string;
  en: {
    title: string;
    shortDesc: string;
    details: string[];
  };
  ur: {
    title: string;
    shortDesc: string;
    details: string[];
  };
}
