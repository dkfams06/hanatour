import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterSidebarProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  priceRange: string;
  setPriceRange: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  clearFilters: () => void;
  handleSearch: (e: React.FormEvent) => void;
}

export default function FilterSidebar({
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  clearFilters,
  handleSearch,
}: FilterSidebarProps) {
  const { language } = useLanguage();
  return (
    <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 lg:p-6 lg:sticky lg:top-8">
      <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          {language === 'ko' ? '필터' : 'Filters'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden h-8 sm:h-9 text-xs sm:text-sm"
        >
          <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          {showFilters ? (language === 'ko' ? '숨기기' : 'Hide') : (language === 'ko' ? '보기' : 'Show')}
        </Button>
      </div>
      <div className={`space-y-3 sm:space-y-4 lg:space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        {/* 검색 필터 */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            {language === 'ko' ? '검색' : 'Search'}
          </label>
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder={language === 'ko' ? "상품명 검색..." : "Search tours..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8 sm:pr-10 h-9 sm:h-10 text-sm"
            />
            <Button 
              type="submit" 
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-7 sm:w-7 p-0"
            >
              <Search className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </form>
        </div>
        
        {/* 모바일에서는 가격대와 정렬을 한 줄에 배치 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
          {/* 가격대 필터 */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              {language === 'ko' ? '가격대' : 'Price Range'}
            </label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="h-9 sm:h-10 text-sm">
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
          {/* 정렬 옵션 */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              {language === 'ko' ? '정렬' : 'Sort By'}
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 sm:h-10 text-sm">
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
        
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full h-9 sm:h-10 text-sm"
        >
          {language === 'ko' ? '필터 초기화' : 'Reset Filters'}
        </Button>
      </div>
    </div>
  );
} 