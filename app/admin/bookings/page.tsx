'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Filter, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCcw
} from 'lucide-react';
import { bookingStatusInfo } from '@/lib/mockData';
import BookingDetailModal from '@/components/admin/BookingDetailModal';
import BookingFormModal from '@/components/admin/BookingFormModal';

export default function AdminBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL에서 필터 상태 가져오기
  const initialStatus = searchParams.get('status') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page') || '1');
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  
  const limit = 10;
  
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

  // 예약 데이터 가져오기
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // API 쿼리 파라미터 구성
      const params = new URLSearchParams();
      
      if (status && status !== 'all') {
        params.append('status', status);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      params.append('page', currentPage.toString());
      params.append('limit', limit.toString());
      params.append('sortBy', 'createdAt');
      params.append('sortOrder', 'desc');
      
      // API 호출
      const response = await fetch(`/api/admin/bookings?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setBookings(result.data.bookings);
        setTotalPages(result.data.pagination.totalPages);
        setTotalCount(result.data.pagination.total);
      } else {
        console.error('예약 데이터를 가져오는데 실패했습니다:', result.error);
      }
    } catch (error) {
      console.error('예약 데이터를 가져오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경 시 URL 업데이트 및 데이터 가져오기
  useEffect(() => {
    updateUrlParams({
      status,
      search: searchQuery,
      page: currentPage.toString()
    });
    
    fetchBookings();
  }, [status, currentPage]);

  // 검색 제출 시 데이터 가져오기
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBookings();
  };
  
  // 예약 상태 변경
  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 예약 목록 새로고침
        fetchBookings();
      } else {
        console.error('예약 상태 변경에 실패했습니다:', result.error);
        alert('예약 상태 변경에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('예약 상태 변경 중 오류 발생:', error);
      alert('예약 상태 변경 중 오류가 발생했습니다.');
    }
  };
  
  // 예약 삭제
  const handleDelete = async (bookingId: string) => {
    if (!confirm('정말 이 예약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 예약 목록 새로고침
        fetchBookings();
      } else {
        console.error('예약 삭제에 실패했습니다:', result.error);
        alert('예약 삭제에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('예약 삭제 중 오류 발생:', error);
      alert('예약 삭제 중 오류가 발생했습니다.');
    }
  };
  
  // 예약 상세 보기
  const handleViewDetails = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`);
      const result = await response.json();
      
      if (result.success) {
        setSelectedBooking(result.data);
        setIsDetailModalOpen(true);
      } else {
        console.error('예약 상세 정보를 가져오는데 실패했습니다:', result.error);
        alert('예약 상세 정보를 가져오는데 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('예약 상세 정보를 가져오는 중 오류 발생:', error);
      alert('예약 상세 정보를 가져오는 중 오류가 발생했습니다.');
    }
  };
  
  // 예약 수정
  const handleEdit = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`);
      const result = await response.json();
      
      if (result.success) {
        setEditingBooking(result.data);
        setIsFormModalOpen(true);
      } else {
        console.error('예약 정보를 가져오는데 실패했습니다:', result.error);
        alert('예약 정보를 가져오는데 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('예약 정보를 가져오는 중 오류 발생:', error);
      alert('예약 정보를 가져오는 중 오류가 발생했습니다.');
    }
  };
  
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // 금액 포맷팅
  const formatPrice = (price: number) => {
    return price.toLocaleString() + '원';
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">예약 관리</h1>
          <Button onClick={() => {
            setEditingBooking(null);
            setIsFormModalOpen(true);
          }} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            새 예약 등록
          </Button>
        </div>
        
        {/* 필터 및 검색 */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="예약번호, 이름, 전화번호, 이메일로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">검색</Button>
            </form>
          </div>
          
          <div className="flex gap-2 items-center">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="payment_pending">결제대기</SelectItem>
                <SelectItem value="payment_completed">결제완료</SelectItem>
                <SelectItem value="payment_expired">입금만료</SelectItem>
                <SelectItem value="confirmed">확정</SelectItem>
                <SelectItem value="cancel_requested">취소요청</SelectItem>
                <SelectItem value="cancelled">취소완료</SelectItem>
                <SelectItem value="refund_completed">환불완료</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => {
              setStatus('all');
              setSearchQuery('');
              setCurrentPage(1);
            }}>
              필터 초기화
            </Button>
          </div>
        </div>
        
        {/* 예약 목록 테이블 */}
        <div className="border rounded-md overflow-x-auto"> {/* 모바일 가로 스크롤 */}
          <Table className="min-w-[800px] md:min-w-full"> {/* 모바일에서 테이블 최소 너비 */}
            <TableHeader>
              <TableRow>
                <TableHead>예약번호</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead>고객명</TableHead>
                <TableHead className="hidden sm:table-cell">인원</TableHead> {/* 모바일에서 숨김 */}
                <TableHead>금액</TableHead>
                <TableHead className="hidden md:table-cell">출발일</TableHead> {/* 모바일/태블릿에서 숨김 */}
                <TableHead>상태</TableHead>
                <TableHead className="hidden md:table-cell">예약일</TableHead> {/* 모바일/태블릿에서 숨김 */}
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // 로딩 스켈레톤
                Array.from({ length: limit }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 9 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-500 mb-2">예약 내역이 없습니다</p>
                      <Button variant="outline" onClick={fetchBookings} className="flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4" />
                        새로고침
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                    <TableCell>{booking.tourTitle}</TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell className="hidden sm:table-cell">{booking.participants}명</TableCell>
                    <TableCell>{formatPrice(booking.totalAmount)}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(booking.departureDate)}</TableCell>
                    <TableCell>
                      <Badge 
                        className="whitespace-nowrap text-xs sm:text-sm"
                        style={{ 
                          backgroundColor: bookingStatusInfo[booking.status as keyof typeof bookingStatusInfo]?.color,
                          color: 'white'
                        }}
                      >
                        {bookingStatusInfo[booking.status as keyof typeof bookingStatusInfo]?.name || booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(booking.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(booking.id)}
                          className="h-8 w-8 p-0"
                          title="상세보기"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(booking.id)}
                          className="h-8 w-8 p-0"
                          title="수정"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(booking.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex justify-end gap-2 mt-2 flex-wrap">
                        {booking.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="h-8 px-2 text-xs text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            확정
                          </Button>
                        )}
                        {booking.status === 'cancel_requested' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="h-8 px-2 text-xs text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              취소
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(booking.id, 'refund_completed')}
                              className="h-8 px-2 text-xs text-purple-600 border-purple-600 hover:bg-purple-50"
                            >
                              환불
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              총 {totalCount}개 중 {(currentPage - 1) * limit + 1}-
              {Math.min(currentPage * limit, totalCount)}개 표시
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // 현재 페이지 주변 페이지만 표시
                  return page === 1 || 
                         page === totalPages || 
                         Math.abs(page - currentPage) <= 2;
                })
                .map((page, i, arr) => {
                  // 건너뛰는 페이지가 있으면 ... 표시
                  if (i > 0 && page > arr[i-1] + 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="px-2">...</span>
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* 예약 상세 모달 */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onEdit={() => {
            setIsDetailModalOpen(false);
            setEditingBooking(selectedBooking);
            setIsFormModalOpen(true);
          }}
        />
      )}
      
      {/* 예약 등록/수정 모달 */}
      <BookingFormModal
        booking={editingBooking}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitSuccess={() => {
          setIsFormModalOpen(false);
          fetchBookings();
        }}
      />
    </AdminLayout>
  );
} 