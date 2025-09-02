'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, Plane, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TourCard from '@/components/TourCard';
import { Tour } from '@/lib/types';

const regions = [
  {
    id: 'domestic',
    name: '국내여행',
    description: '아름다운 우리나라 구석구석',
    image: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0',
    color: 'from-blue-500 to-blue-600',
    icon: <MapPin className="h-6 w-6" />,
    continent: 'domestic',
    countries: ['korea']
  },
  {
    id: 'asia',
    name: '아시아',
    description: '가까운 아시아 여행의 매력',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    color: 'from-green-500 to-green-600',
    icon: <Plane className="h-6 w-6" />,
    continent: 'asia',
    countries: ['japan', 'china', 'thailand', 'vietnam']
  },
  {
    id: 'europe',
    name: '유럽',
    description: '로맨틱한 유럽의 문화와 역사',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    color: 'from-purple-500 to-purple-600',
    icon: <Camera className="h-6 w-6" />,
    continent: 'europe',
    countries: ['france', 'spain']
  },
  {
    id: 'america',
    name: '미주',
    description: '광활한 아메리카 대륙 탐험',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    color: 'from-orange-500 to-red-500',
    icon: <Plane className="h-6 w-6" />,
    continent: 'americas',
    countries: ['usa']
  }
];

export default function RegionPopular() {
  const router = useRouter();
  const [regionTours, setRegionTours] = useState<{ [key: string]: Tour[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegionTours = async () => {
      setIsLoading(true);
      const toursData: { [key: string]: Tour[] } = {};

      try {
        // 각 지역별로 인기 상품 2개씩 가져오기
        for (const region of regions) {
          try {
            let endpoint = '/api/tours?status=published&limit=4&sortBy=createdAt';
            
            // continent 기반으로 필터링
            if (region.continent !== 'domestic') {
              endpoint += `&continent=${region.continent}`;
            } else {
              // 국내여행의 경우 country=korea 또는 continent=domestic 조건
              endpoint = '/api/tours?status=published&limit=4&sortBy=createdAt&country=korea';
            }

            const response = await fetch(endpoint);
            const data = await response.json();
            
            if (data.success && data.data) {
              // 실제 데이터가 있는 투어만 가져오고 최대 2개로 제한
              const tours = Array.isArray(data.data) ? data.data : [];
              toursData[region.id] = tours.slice(0, 2);
            } else {
              toursData[region.id] = [];
            }
          } catch (error) {
            console.error(`Failed to fetch tours for ${region.id}:`, error);
            toursData[region.id] = [];
          }
        }

        setRegionTours(toursData);
      } catch (error) {
        console.error('Failed to fetch region tours:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegionTours();
  }, []);

  const handleViewMore = (regionId: string) => {
    const regionMap: { [key: string]: string } = {
      'domestic': '/packages?region=south-korea',
      'asia': '/packages?region=asia',
      'europe': '/packages?region=europe',
      'america': '/packages?region=america'
    };
    
    router.push(regionMap[regionId] || '/packages');
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            지역별 인기 여행
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            전 세계 각 지역의 인기 여행 상품을 만나보세요. 다양한 문화와 경험이 기다립니다.
          </p>
        </div>

        <div className="space-y-16">
          {regions.map((region) => (
            <div key={region.id}>
              {/* 지역 헤더 */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${region.color} text-white`}>
                    {region.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{region.name}</h3>
                    <p className="text-gray-600">{region.description}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleViewMore(region.id)}
                  className="hidden sm:flex items-center space-x-2 hover:bg-gray-50"
                >
                  <span>더보기</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* 상품 목록 */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(2)].map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regionTours[region.id]?.length > 0 ? (
                    regionTours[region.id].map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      이 지역의 상품이 준비 중입니다.
                    </div>
                  )}
                </div>
              )}

              {/* 모바일 더보기 버튼 */}
              <div className="sm:hidden mt-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => handleViewMore(region.id)}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <span>{region.name} 더보기</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* 전체 상품 보기 */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            onClick={() => router.push('/packages')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
          >
            모든 여행 상품 보기
          </Button>
        </div>
      </div>
    </section>
  );
}