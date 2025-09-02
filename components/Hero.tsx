'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    title: '일본 벚꽃 시즌 특가',
    subtitle: '오사카와 도쿄의 아름다운 벚꽃을 만나보세요',
    cta: '지금 예약하기',
    discount: '얼리버드 20% 할인',
    link: '/packages?continent=asia'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    title: '유럽 낭만 여행',
    subtitle: '파리와 런던의 문화와 예술을 경험하세요',
    cta: '상품 보기',
    discount: '단독 특가',
    link: '/packages?continent=europe'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0',
    title: '제주도 힐링 여행',
    subtitle: '아름다운 제주의 자연과 함께하는 휴식',
    cta: '여행 일정 보기',
    discount: '국내 여행 특가',
    link: '/packages?country=korea'
  }
];

export default function Hero() {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Hero 컴포넌트 주석 처리
  return null;

  /*
  return (
    <section className="relative h-[600px] overflow-hidden">
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center text-white max-w-4xl mx-auto px-4">
                  <div className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    {slide.discount}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-gray-200">
                    {slide.subtitle}
                  </p>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold rounded-full"
                    onClick={() => router.push(slide.link)}
                  >
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
  */
}