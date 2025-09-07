'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, MapPin, Calendar, Users, Star, Search } from 'lucide-react';
import TourCard from '@/components/TourCard';
import { regionInfo } from '@/lib/mockData';
import { Region, Tour } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

interface RegionTourListProps {
  region: Region;
  searchQuery: string;
  priceRange: string;
  sortBy: string;
  currentPage: number;
  setCurrentPage: (v: number) => void;
}

export default function RegionTourList({ 
  region, 
  searchQuery, 
  priceRange, 
  sortBy, 
  currentPage, 
  setCurrentPage 
}: RegionTourListProps) {
  const { t, language } = useLanguage();
  const router = useRouter();

  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 8;

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // 오늘, 내일 체크
      if (date.toDateString() === today.toDateString()) {
        return '오늘';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return '내일';
      }
      
      // 일반 날짜 포맷팅
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short'
      });
    } catch (error) {
      console.error('날짜 포맷팅 에러:', error);
      return dateString;
    }
  };

  // 투어 데이터 가져오기
  const fetchTours = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        region: region, // country를 region으로 변경
        ...(searchQuery && { search: searchQuery }),
        sortBy,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      // priceRange 파싱하여 minPrice, maxPrice로 변환
      if (priceRange && priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        if (min) queryParams.append('minPrice', min.toString());
        if (max) queryParams.append('maxPrice', max.toString());
      }

      const apiUrl = `/api/tours?${queryParams}`;
      console.log('API 호출 URL:', apiUrl);
      console.log('검색 파라미터:', {
        region,
        searchQuery,
        priceRange,
        sortBy,
        currentPage,
        itemsPerPage
      });

      const response = await fetch(apiUrl);
      const data = await response.json();
      
      console.log('API 응답:', data);
      
      if (data.success && data.data) {
        // 새로운 API 응답 구조에 맞게 수정
        const toursData = Array.isArray(data.data) ? data.data : [];
        console.log('투어 데이터:', toursData);
        setTours(toursData);
        setTotalCount(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        console.log('API 응답 실패 또는 데이터 없음');
        setTours([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to fetch tours:', error);
      setTours([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [region, searchQuery, priceRange, sortBy, currentPage]);

  // 페이지네이션
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-6 sm:mt-8">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 rotate-90" />
        </button>
        <div className="flex space-x-1 sm:space-x-2">
          {pages}
        </div>
        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 -rotate-90" />
        </button>
      </div>
    );
  };

  const info = regionInfo[region];

  return (
    <div className="bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* 지역 정보 헤더 */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="relative h-32 sm:h-48 lg:h-64 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="relative h-full flex items-center justify-center text-center px-4">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
                    {info?.name || region}
                  </h1>
                  <p className="text-sm sm:text-lg lg:text-xl text-white">
                    {language === 'ko' 
                      ? `${info?.name || region} 여행 상품을 확인하세요` 
                      : `Explore ${info?.name || region} tours`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 투어 목록 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 lg:p-6">
          {/* 결과 헤더 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2 sm:mb-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {language === 'ko' ? '투어 목록' : 'Tour List'}
              </h2>
              {!isLoading && (
                <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                  {language === 'ko' 
                    ? `총 ${totalCount}개의 상품` 
                    : `${totalCount} tours found`}
                </span>
              )}
            </div>
          </div>

          {/* 투어 그리드 */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2 sm:space-y-3">
                  <Skeleton className="h-32 sm:h-40 lg:h-48 w-full rounded-lg" />
                  <Skeleton className="h-3 sm:h-4 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-1/2" />
                  <Skeleton className="h-4 sm:h-6 w-1/4" />
                </div>
              ))}
            </div>
          ) : tours && tours.length > 0 ? (
            <>
              <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                {tours.map((tour) => (
                  <div key={tour.id} className="flex flex-col sm:flex-row bg-white rounded-xl shadow-sm border p-3 sm:p-4 hover:shadow-md transition-shadow">
                    {/* 투어 이미지 */}
                    <div className="sm:flex-shrink-0 mb-3 sm:mb-0 sm:mr-4 lg:mr-6">
                      <img 
                        src={tour.mainImage} 
                        alt={tour.title}
                        className="w-full sm:w-32 md:w-40 lg:w-48 h-32 sm:h-24 md:h-28 lg:h-36 rounded-lg object-cover" 
                      />
                    </div>
                    
                    {/* 투어 정보 */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 overflow-hidden" 
                          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {tour.title}
                      </h2>
                      <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 overflow-hidden" 
                           style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {tour.description?.slice(0, 80)}...
                      </div>
                      
                      {/* 투어 세부 정보 */}
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2 sm:mb-3 text-xs sm:text-sm">
                        <span className="text-blue-600 font-semibold">{tour.region}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">{formatDate(tour.departureDate)}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">
                          잔여 {tour.maxParticipants - tour.currentParticipants}명
                        </span>
                      </div>
                      
                      {/* 가격 및 버튼 */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">
                          {tour.price.toLocaleString()}원
                        </span>
                        <button
                          onClick={() => router.push(`/tours/${tour.id}`)}
                          className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base hover:bg-blue-700 transition-colors"
                        >
                          상세히 보기
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && renderPagination()}
            </>
          ) : (
            <div className="text-center py-8 sm:py-12 lg:py-16">
              <div className="text-gray-400 mb-3 sm:mb-4">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
                {language === 'ko' ? '검색 결과가 없습니다' : 'No tours found'}
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                {language === 'ko' 
                  ? '다른 검색 조건을 시도해보세요' 
                  : 'Try adjusting your search criteria'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 