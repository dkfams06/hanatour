'use client';

import { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.packages': 'Packages',
    'nav.flights': 'Flights',
    'nav.hotels': 'Hotels',
    'nav.cars': 'Car Rentals',
    'nav.tickets': 'Tickets',
    'nav.tours': 'Group Tours',
    'nav.deals': 'Deals',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.mypage': 'My Page',
    'nav.logout': 'Logout',
    'hero.title': 'Discover Your Next Adventure',
    'hero.subtitle': 'Book amazing travel packages, flights, and hotels with exclusive deals',
    'hero.cta': 'Explore Now',
    'section.bestsellers': 'Best Sellers',
    'section.promotions': 'Special Promotions',
    'section.categories': 'Travel Categories',
    'product.from': 'From',
    'product.person': 'per person',
    'product.bookNow': 'Book Now',
    'product.addWishlist': 'Add to Wishlist',
    'booking.selectDate': 'Select Date',
    'booking.guests': 'Guests',
    'booking.confirm': 'Confirm Booking',
    'mypage.reservations': 'My Reservations',
    'mypage.wishlist': 'Wishlist',
    'mypage.reviews': 'My Reviews',
    'admin.dashboard': 'Dashboard',
    'admin.tours': 'Tour Management',
    'admin.bookings': 'Booking Management',
    'admin.users': 'User Management',
    'admin.reviews': 'Review Management',
    'admin.financial': 'Financial Management',
    'admin.reports': 'Reports & Analytics',
    'admin.content': 'Content Management',
    'admin.support': 'Support Tickets',
    'admin.settings': 'Settings',
  },
  ko: {
    'nav.packages': '패키지',
    'nav.flights': '항공',
    'nav.hotels': '호텔',
    'nav.cars': '렌터카',
    'nav.tickets': '티켓',
    'nav.tours': '단체여행',
    'nav.deals': '특가',
    'nav.login': '로그인',
    'nav.signup': '회원가입',
    'nav.mypage': '마이페이지',
    'nav.logout': '로그아웃',
    'hero.title': '당신의 다음 모험을 찾아보세요',
    'hero.subtitle': '특별한 할인가로 놀라운 여행 패키지, 항공편, 호텔을 예약하세요',
    'hero.cta': '지금 탐험하기',
    'section.bestsellers': '베스트셀러',
    'section.promotions': '특별 프로모션',
    'section.categories': '여행 카테고리',
    'product.from': '최저가',
    'product.person': '1인',
    'product.bookNow': '지금 예약',
    'product.addWishlist': '위시리스트 추가',
    'booking.selectDate': '날짜 선택',
    'booking.guests': '인원',
    'booking.confirm': '예약 확인',
    'mypage.reservations': '내 예약',
    'mypage.wishlist': '위시리스트',
    'mypage.reviews': '내 리뷰',
    'admin.dashboard': '대시보드',
    'admin.tours': '투어 관리',
    'admin.bookings': '예약 관리',
    'admin.users': '사용자 관리',
    'admin.reviews': '리뷰 관리',
    'admin.financial': '재정 관리',
    'admin.reports': '보고서 및 분석',
    'admin.content': '콘텐츠 관리',
    'admin.support': '지원 티켓',
    'admin.settings': '설정',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}