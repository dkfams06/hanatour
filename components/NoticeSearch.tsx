'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

export default function NoticeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (filter !== 'all') params.set('filter', filter);
    params.set('page', '1'); // 검색 시 첫 페이지로 이동
    
    router.push(`/notice?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (value !== 'all') params.set('filter', value);
    params.set('page', '1');
    
    router.push(`/notice?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('filter', filter);
    params.set('page', '1');
    router.push(`/notice?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* 검색 */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="공지사항 제목이나 내용을 검색하세요..."
          className="pl-10 pr-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* 필터 */}
      <div className="flex gap-2">
        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-40 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 공지사항</SelectItem>
            <SelectItem value="important">중요 공지만</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 transition-colors"
          onClick={handleSearch}
        >
          검색
        </Button>
      </div>
    </div>
  );
} 