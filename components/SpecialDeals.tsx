'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Zap, Star, ArrowRight, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TourCard from '@/components/TourCard';
import { Tour } from '@/lib/types';

const dealTypes = [
  {
    id: 'early-bird',
    name: '얼리버드',
    description: '미리 예약하고 특별 할인 혜택',
    icon: <Clock className="h-6 w-6" />,
    color: 'from-yellow-500 to-orange-500',
    badge: 'EARLY',
    badgeColor: 'bg-yellow-500'
  },
  {
    id: 'last-minute',
    name: '막차특가',
    description: '출발 임박! 마지막 기회',
    icon: <Zap className="h-6 w-6" />,
    color: 'from-red-500 to-pink-500',
    badge: 'HOT',
    badgeColor: 'bg-red-500'
  },
  {
    id: 'exclusive',
    name: '단독특가',
    description: '하나투어만의 특별한 혜택',
    icon: <Star className="h-6 w-6" />,
    color: 'from-purple-500 to-indigo-500',
    badge: 'EXCLUSIVE',
    badgeColor: 'bg-purple-500'
  }
];

export default function SpecialDeals() {
  const router = useRouter();
  const [dealTours, setDealTours] = useState<{ [key: string]: Tour[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDealTours = async () => {
      setIsLoading(true);
      const toursData: { [key: string]: Tour[] } = {};

      try {
        // 각 특가 타입별로 상품 가져오기
        for (const deal of dealTypes) {
          try {
            let endpoint = '/api/tours?status=published&limit=3';
            
            switch (deal.id) {
              case 'early-bird':
                // 가격 낮은 순으로 정렬 (얼리버드 = 저렴한 가격)
                endpoint += '&sortBy=price';
                break;
              case 'last-minute':
                // 최신 등록순 (막차특가 = 최근 등록된 상품)
                endpoint += '&sortBy=createdAt';
                break;
              case 'exclusive':
                // 가격 높은 순으로 정렬 (단독특가 = 프리미엄 상품)
                endpoint += '&sortBy=price&order=desc';
                break;
            }

            const response = await fetch(endpoint);
            const data = await response.json();
            
            if (data.success && data.data) {
              toursData[deal.id] = Array.isArray(data.data) ? data.data.slice(0, 3) : [];
            } else {
              toursData[deal.id] = [];
            }
          } catch (error) {
            console.error(`Failed to fetch ${deal.id} tours:`, error);
            toursData[deal.id] = [];
          }
        }

        setDealTours(toursData);
      } catch (error) {
        console.error('Failed to fetch deal tours:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDealTours();
  }, []);

  const handleViewMore = (dealId: string) => {
    const dealMap: { [key: string]: string } = {
      'early-bird': '/deals/early-bird',
      'last-minute': '/deals/last-minute',
      'exclusive': '/deals/exclusive'
    };
    
    router.push(dealMap[dealId] || '/packages');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Percent className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              특가 여행
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            놓치면 후회할 특별한 할인 혜택! 지금 바로 예약하고 최고의 여행을 경험하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {dealTypes.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* 헤더 */}
              <div className={`bg-gradient-to-r ${deal.color} p-6 text-white relative`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      {deal.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{deal.name}</h3>
                      <p className="text-white/90 text-sm">{deal.description}</p>
                    </div>
                  </div>
                </div>
                <Badge className={`${deal.badgeColor} text-white absolute top-4 right-4`}>
                  {deal.badge}
                </Badge>
              </div>

              {/* 상품 목록 */}
              <div className="p-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="flex space-x-4">
                          <div className="h-16 w-16 bg-gray-200 rounded"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dealTours[deal.id]?.length > 0 ? (
                      dealTours[deal.id].map((tour, index) => (
                        <div 
                          key={tour.id} 
                          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => router.push(`/tours/${tour.id}`)}
                        >
                          <img 
                            src={tour.mainImage || 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=300'} 
                            alt={tour.title}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {tour.title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-lg font-bold text-red-600">
                                {tour.price?.toLocaleString()}원
                              </span>
                              {index === 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  최저가
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        준비 중인 특가 상품이 있습니다.
                      </div>
                    )}
                  </div>
                )}

                {/* 더보기 버튼 */}
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-gray-600 hover:text-gray-900"
                  onClick={() => handleViewMore(deal.id)}
                >
                  <span>{deal.name} 전체보기</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* 전체 특가 보기 */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            onClick={() => router.push('/deals')}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3"
          >
            모든 특가 상품 보기
          </Button>
        </div>
      </div>
    </section>
  );
}