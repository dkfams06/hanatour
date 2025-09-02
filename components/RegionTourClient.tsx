"use client";
import { useState } from 'react';
import FilterSidebar from './FilterSidebar';
import RegionTourList from './RegionTourList';
import { Region } from '@/lib/types';

interface RegionTourClientProps {
  region: Region;
}

export default function RegionTourClient({ region }: RegionTourClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange('all');
    setSortBy('popularity');
    setCurrentPage(1);
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
      {/* 모바일: 필터를 상단에 배치, 데스크톱: 사이드바 */}
      <div className="lg:grid lg:grid-cols-4 lg:gap-6 xl:gap-8">
        <div className="lg:col-span-1 mb-4 lg:mb-0">
          <FilterSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            clearFilters={clearFilters}
            handleSearch={handleSearch}
          />
        </div>
        <div className="lg:col-span-3">
          <RegionTourList
            region={region}
            searchQuery={searchQuery}
            priceRange={priceRange}
            sortBy={sortBy}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
} 