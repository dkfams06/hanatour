'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Camera, Mountain, Waves, Utensils, Palette, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const themes = [
  {
    id: 'honeymoon',
    name: '허니문',
    description: '로맨틱한 신혼여행',
    icon: <Heart className="h-8 w-8" />,
    image: 'https://images.pexels.com/photos/1024866/pexels-photo-1024866.jpeg?auto=compress&cs=tinysrgb&w=500',
    color: 'from-pink-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'
  },
  {
    id: 'photo',
    name: '포토투어',
    description: '인생샷 남기는 여행',
    icon: <Camera className="h-8 w-8" />,
    image: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=500',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
  },
  {
    id: 'adventure',
    name: '어드벤처',
    description: '스릴 넘치는 모험여행',
    icon: <Mountain className="h-8 w-8" />,
    image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=500',
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
  },
  {
    id: 'beach',
    name: '휴양지',
    description: '편안한 바다 휴가',
    icon: <Waves className="h-8 w-8" />,
    image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=500',
    color: 'from-cyan-500 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20'
  },
  {
    id: 'food',
    name: '미식여행',
    description: '맛있는 음식 탐방',
    icon: <Utensils className="h-8 w-8" />,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
    color: 'from-orange-500 to-red-500',
    gradient: 'bg-gradient-to-br from-orange-500/20 to-red-500/20'
  },
  {
    id: 'culture',
    name: '문화여행',
    description: '역사와 예술 탐방',
    icon: <Palette className="h-8 w-8" />,
    image: 'https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=500',
    color: 'from-purple-500 to-indigo-500',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20'
  }
];

export default function ThemeTravel() {
  const router = useRouter();
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const handleThemeClick = (themeId: string) => {
    router.push(`/tours/theme/${themeId}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            테마별 여행
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            나만의 스타일에 맞는 테마 여행을 찾아보세요. 특별한 경험이 기다립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {themes.map((theme) => (
            <Card 
              key={theme.id}
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                hoveredTheme === theme.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onMouseEnter={() => setHoveredTheme(theme.id)}
              onMouseLeave={() => setHoveredTheme(null)}
              onClick={() => handleThemeClick(theme.id)}
            >
              {/* 배경 이미지 */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={theme.image} 
                  alt={theme.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className={`absolute inset-0 ${theme.gradient}`}></div>
                
                {/* 아이콘 오버레이 */}
                <div className={`absolute top-4 right-4 p-3 rounded-full bg-gradient-to-r ${theme.color} text-white shadow-lg`}>
                  {theme.icon}
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {theme.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {theme.description}
                </p>
                
                <div className="flex items-center text-blue-600 font-medium">
                  <span>자세히 보기</span>
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </CardContent>

              {/* 호버 효과 */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
                hoveredTheme === theme.id ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center space-x-2">
                    {theme.icon}
                    <span className="text-lg font-semibold">{theme.name}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 커스텀 여행 문의 섹션 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            원하는 테마가 없으신가요?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            고객님만을 위한 맞춤형 여행을 계획해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => router.push('/customer')}
            >
              맞춤 여행 문의
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => router.push('/packages')}
            >
              전체 상품 보기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}