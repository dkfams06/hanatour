'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Heart, Star, MapPin, Clock, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tour } from '@/lib/types';
import { regionInfo } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const { t, language } = useLanguage();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    if (language === 'ko') {
      return `${price.toLocaleString()}원`;
    }
    return `$${(price / 1000).toFixed(0)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRegionName = (region: string) => {
    return regionInfo[region as keyof typeof regionInfo]?.name || region;
  };

  const getAvailableSlots = () => {
    return tour.maxParticipants - tour.currentParticipants;
  };

  const isAlmostFull = () => {
    const availableSlots = getAvailableSlots();
    return availableSlots <= 5 && availableSlots > 0;
  };

  const isFull = () => {
    return getAvailableSlots() <= 0;
  };

  const handleWishlist = async () => {
    const isCurrentlyWishlisted = isInWishlist(tour.id);
    
    if (isCurrentlyWishlisted) {
      // 찜 해제
      await removeFromWishlist(tour.id);
    } else {
      // 찜 추가
      const success = await addToWishlist({
        tourId: tour.id,
        tourTitle: tour.title,
        mainImage: tour.mainImage,
        price: tour.price,
        departureDate: tour.departureDate,
        region: tour.region,
        createdAt: new Date().toISOString()
      });

      if (!success) {
        // addToWishlist에서 이미 toast를 표시하므로 여기서는 추가 처리 불필요
        return;
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group">
      <div className="relative">
        <img
          src={tour.mainImage}
          alt={tour.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* 상태 배지 */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {tour.rating && tour.rating >= 4.5 && (
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              인기
            </div>
          )}
          {isAlmostFull() && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              마감임박
            </div>
          )}
          {isFull() && (
            <div className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              마감
            </div>
          )}
        </div>
        
        {/* 찜하기 버튼 */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
        >
          <Heart
            className={`w-5 h-5 ${
              isInWishlist(tour.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      <div className="p-6">
        {/* 지역 */}
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {getRegionName(tour.region)}
        </div>

        {/* 제목 */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
          {tour.title}
        </h3>

        {/* 평점과 출발일 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {tour.rating ? tour.rating.toFixed(1) : '0.0'} ({tour.reviewCount || 0}개 후기)
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(tour.departureDate)}
          </div>
        </div>

        {/* 인원 정보 */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Users className="w-4 h-4 mr-1" />
          <span>
            {tour.currentParticipants}/{tour.maxParticipants}명 
            {getAvailableSlots() > 0 && (
              <span className="text-green-600 ml-1">
                (잔여 {getAvailableSlots()}명)
              </span>
            )}
          </span>
        </div>

        {/* 가격 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold price-highlight">
                {formatPrice(tour.price)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              1인 기준
            </div>
          </div>
        </div>

        {/* 예약 버튼 */}
        <Link href={`/tours/${tour.id}`}>
          <Button 
            className={`w-full font-semibold py-3 ${
              isFull() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isFull()}
          >
            {isFull() ? '마감되었습니다' : '자세히 보기'}
          </Button>
        </Link>
      </div>
    </div>
  );
}