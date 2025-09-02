'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Filter, Search, ChevronDown, MapPin, Calendar, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import TourCard from '@/components/TourCard';
import { regionInfo } from '@/lib/mockData';
import { Region, Tour } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function PackageListings() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL에서 필터 상태 가져오기
  const initialRegion = searchParams.get('region') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'popularity';
  const initialPriceRange = searchParams.get('price') || 'all';
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [sortBy, setSortBy] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 8;

  // URL 쿼리 파라미터 업데이트
  const updateUrlParams = (params: Record<string, string>) => {
    const url = new URL(window.location.href);
    
    // 현재 파라미터 유지
    searchParams.forEach((value, key) => {
      if (!params.hasOwnProperty(key)) {
        url.searchParams.set(key, value);
      }
    });
    
    // 새 파라미터 설정
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    
    router.push(url.pathname + url.search);
  };

  // 투어 데이터 가져오기
  const fetchTours = async () => {
    setIsLoading(true);
    try {
      // API 쿼리 파라미터 구성
      const params = new URLSearchParams();
      
      if (selectedRegion && selectedRegion !== 'all') {
        params.append('region', selectedRegion);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        if (min) params.append('minPrice', min.toString());
        if (max) params.append('maxPrice', max.toString());
      }
      
      // 정렬 설정
      let sortField = 'createdAt';
      let sortOrder = 'desc';
      
      switch (sortBy) {
        case 'price-low':
          sortField = 'price';
          sortOrder = 'asc';
          break;
        case 'price-high':
          sortField = 'price';
          sortOrder = 'desc';
          break;
        case 'rating':
          sortField = 'rating';
          sortOrder = 'desc';
          break;
        case 'newest':
          sortField = 'departureDate';
          sortOrder = 'asc';
          break;
        default:
          sortField = 'reviewCount';
          sortOrder = 'desc';
      }
      
      params.append('sortBy', sortField);
      params.append('sortOrder', sortOrder);
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      
      // API 호출
      const response = await fetch(`/api/tours?${params.toString()}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        // 새로운 API 응답 구조에 맞게 수정
        const toursData = Array.isArray(result.data) ? result.data : [];
        setTours(toursData);
        setFilteredTours(toursData);
        setTotalCount(result.pagination?.total || 0);
        setTotalPages(result.pagination?.totalPages || 1);
      } else {
        console.error('투어 데이터를 가져오는데 실패했습니다:', result.error);
        setTours([]);
        setFilteredTours([]);
      }
    } catch (error) {
      console.error('투어 데이터를 가져오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경 시 URL 업데이트 및 데이터 가져오기
  useEffect(() => {
    updateUrlParams({
      region: selectedRegion,
      search: searchQuery,
      sort: sortBy,
      price: priceRange,
      page: currentPage.toString()
    });
    
    fetchTours();
  }, [selectedRegion, sortBy, priceRange, currentPage]);

  // 검색 제출 시 데이터 가져오기
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTours();
  };

  // 필터 초기화
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setPriceRange('all');
    setSortBy('popularity');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'ko' ? '여행 패키지' : 'Travel Packages'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'ko' 
                ? '엄선된 여행 패키지로 특별한 여행을 계획해보세요' 
                : 'Discover amazing destinations with our carefully curated travel packages'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={language === 'ko' ? "목적지, 도시, 또는 투어 이름으로 검색..." : "Search destinations, cities, or tour names..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {language === 'ko' ? '검색' : 'Search'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ko' ? '필터' : 'Filters'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? (language === 'ko' ? '숨기기' : 'Hide') : (language === 'ko' ? '보기' : 'Show')}
                </Button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ko' ? '지역' : 'Region'}
                  </label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ko' ? "지역 선택" : "Select region"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'ko' ? '모든 지역' : 'All Regions'}</SelectItem>
                      {Object.entries(regionInfo).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: value.color }}></span>
                            {value.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ko' ? '가격대' : 'Price Range'}
                  </label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ko' ? "가격대 선택" : "Select price range"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'ko' ? '모든 가격' : 'All Prices'}</SelectItem>
                      <SelectItem value="0-300000">{language === 'ko' ? '30만원 이하' : 'Under 300,000₩'}</SelectItem>
                      <SelectItem value="300000-500000">300,000₩ - 500,000₩</SelectItem>
                      <SelectItem value="500000-1000000">500,000₩ - 1,000,000₩</SelectItem>
                      <SelectItem value="1000000-2000000">1,000,000₩ - 2,000,000₩</SelectItem>
                      <SelectItem value="2000000-">{language === 'ko' ? '200만원 이상' : 'Over 2,000,000₩'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  {language === 'ko' ? '필터 초기화' : 'Clear Filters'}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {language === 'ko' 
                  ? `${totalCount}개의 여행 상품 발견` 
                  : `${totalCount} tours found`}
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{language === 'ko' ? '정렬:' : 'Sort by:'}</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">{language === 'ko' ? '인기순' : 'Popularity'}</SelectItem>
                    <SelectItem value="price-low">{language === 'ko' ? '가격 낮은순' : 'Price: Low to High'}</SelectItem>
                    <SelectItem value="price-high">{language === 'ko' ? '가격 높은순' : 'Price: High to Low'}</SelectItem>
                    <SelectItem value="rating">{language === 'ko' ? '평점순' : 'Rating'}</SelectItem>
                    <SelectItem value="newest">{language === 'ko' ? '출발일 빠른순' : 'Departure Date'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 선택된 필터 표시 */}
            {(selectedRegion !== 'all' || priceRange !== 'all' || searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedRegion !== 'all' && (
                  <Badge className="px-3 py-1 flex items-center gap-1">
                    <span>{regionInfo[selectedRegion as Region]?.name || selectedRegion}</span>
                    <button 
                      onClick={() => setSelectedRegion('all')}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {priceRange !== 'all' && (
                  <Badge className="px-3 py-1 flex items-center gap-1">
                    <span>
                      {priceRange === '0-300000' && (language === 'ko' ? '30만원 이하' : 'Under 300,000₩')}
                      {priceRange === '300000-500000' && '300,000₩ - 500,000₩'}
                      {priceRange === '500000-1000000' && '500,000₩ - 1,000,000₩'}
                      {priceRange === '1000000-2000000' && '1,000,000₩ - 2,000,000₩'}
                      {priceRange === '2000000-' && (language === 'ko' ? '200만원 이상' : 'Over 2,000,000₩')}
                    </span>
                    <button 
                      onClick={() => setPriceRange('all')}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge className="px-3 py-1 flex items-center gap-1">
                    <span>"{searchQuery}"</span>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {(selectedRegion !== 'all' || priceRange !== 'all' || searchQuery) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    {language === 'ko' ? '모두 지우기' : 'Clear all'}
                  </Button>
                )}
              </div>
            )}

            {/* Tours Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {Array.from({ length: itemsPerPage }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTours.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {language === 'ko' ? '검색 결과가 없습니다' : 'No tours found'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'ko' 
                    ? '다른 검색어나 필터를 사용해보세요' 
                    : 'Try different search terms or filters'}
                </p>
                <Button onClick={clearFilters}>
                  {language === 'ko' ? '필터 초기화' : 'Clear filters'}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredTours.map((tour) => (
                  <div key={tour.id} className="flex flex-row items-center bg-white rounded-xl shadow p-4">
                    <img src={tour.mainImage} className="w-48 h-36 rounded-lg object-cover mr-6" />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-2">{tour.title}</h2>
                      <div className="text-gray-500 mb-2">{tour.description?.slice(0, 60)}...</div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-blue-600 font-semibold">{tour.region}</span>
                        <span className="text-gray-400">|</span>
                        <span>{tour.departureDate}</span>
                        <span className="text-gray-400">|</span>
                        <span>잔여 {tour.maxParticipants - tour.currentParticipants}명</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-orange-600">{tour.price.toLocaleString()}원</span>
                        <button
                          onClick={() => router.push(`/tours/${tour.id}`)}
                          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                          상세히 보기
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    {language === 'ko' ? '이전' : 'Previous'}
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {language === 'ko' ? '다음' : 'Next'}
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}