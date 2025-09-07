'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import TourCard from '@/components/TourCard';
import { Tour } from '@/lib/types';
import { regionInfo } from '@/lib/mockData';

export default function BestSellers() {
  const { t } = useLanguage();
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await fetch('/api/tours?sortBy=rating&limit=4');
        const data = await response.json();
        
        if (data.success && data.data) {
          // 새로운 API 응답 구조에 맞게 수정
          setTours(Array.isArray(data.data) ? data.data : []);
        } else {
          setTours([]);
        }
      } catch (error) {
        console.error('Failed to fetch best sellers:', error);
        setTours([]); // 에러 시 빈 배열로 설정
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('section.bestsellers')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            평점이 높고 인기가 많은 여행 상품들을 만나보세요. 검증된 여행 경험을 제공합니다.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : tours && tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">현재 표시할 인기 상품이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}