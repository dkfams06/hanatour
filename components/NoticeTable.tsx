'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Notice } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface NoticeTableProps {
  notices: Notice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function NoticeTable({ notices, pagination }: NoticeTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNoticeNumber = (index: number) => {
    const currentYear = new Date().getFullYear();
    const noticeNumber = pagination.total - (pagination.page - 1) * pagination.limit - index;
    return `${currentYear}-${String(noticeNumber).padStart(3, '0')}`;
  };

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `/notice?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* 테이블 */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-24 text-center font-medium text-gray-700">번호</TableHead>
              <TableHead className="font-medium text-gray-700">제목</TableHead>
              <TableHead className="w-32 text-center font-medium text-gray-700">등록일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.map((notice, index) => (
              <TableRow key={notice.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="text-center text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <span>{formatNoticeNumber(index)}</span>
                    {notice.isImportant && (
                      <Badge variant="destructive" className="text-xs px-1 py-0">
                        중요
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Link 
                    href={`/notice/${notice.id}`}
                    className="text-gray-900 hover:text-blue-600 transition-colors font-medium"
                  >
                    {notice.title}
                  </Link>
                </TableCell>
                <TableCell className="text-center text-sm text-gray-600">
                  {formatDate(notice.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
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
        </div>
      )}
    </div>
  );
} 