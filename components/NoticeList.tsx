'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Notice } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Calendar, Eye, User, AlertTriangle, ArrowRight } from 'lucide-react';

interface NoticeListProps {
  notices: Notice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function NoticeList({ notices, pagination }: NoticeListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatContent = (content: string) => {
    // 첫 번째 줄만 표시하고 나머지는 ...으로 처리
    const firstLine = content.split('\n')[0];
    return firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
  };

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `/notice?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {notices.map((notice) => (
        <Card key={notice.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {notice.isImportant && (
                    <Badge variant="destructive" className="text-xs font-medium">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      중요
                    </Badge>
                  )}
                  <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-blue-600 transition-colors">
                    <Link href={`/notice/${notice.id}`}>
                      {notice.title}
                    </Link>
                  </CardTitle>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {formatContent(notice.content)}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="font-medium">{notice.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(notice.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{notice.viewCount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Link href={`/notice/${notice.id}`} className="flex items-center gap-1">
                      자세히 보기
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <Pagination>
                <PaginationContent>
                  {pagination.page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href={createPageUrl(pagination.page - 1)}
                        className="hover:bg-blue-50"
                      />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        href={createPageUrl(page)}
                        isActive={page === pagination.page}
                        className="hover:bg-blue-50"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {pagination.page < pagination.totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        href={createPageUrl(pagination.page + 1)}
                        className="hover:bg-blue-50"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 