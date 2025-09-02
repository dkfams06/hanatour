'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  applicationMethod?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  requestDate: string;
  processedDate?: string;
  adminNotes?: string;
}

const TransactionHistory = React.memo(function TransactionHistory() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadTransactionData();
  }, [user?.id]);

  const loadTransactionData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/my-applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setApplications(data.applications || []);
        }
      }
    } catch (error) {
      console.error('입출금 내역 로드 오류:', error);
      toast({
        title: "오류",
        description: "입출금 내역을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (amount: number) => {
    return `₩${new Intl.NumberFormat('ko-KR').format(amount)}`;
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: '승인대기', variant: 'secondary' as const };
      case 'processing':
        return { label: '처리중', variant: 'default' as const };
      case 'completed':
        return { label: '완료', variant: 'default' as const };
      case 'rejected':
        return { label: '거절', variant: 'destructive' as const };
      default:
        return { label: status, variant: 'outline' as const };
    }
  };

  const handleRefresh = async () => {
    await refreshUser();
    await loadTransactionData();
    toast({
      title: "새로고침 완료",
      description: "입출금 내역이 업데이트되었습니다.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <Link href="/login">
            <Button>로그인하기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 overflow-hidden">
      {/* 헤더 */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">입출금 내역</h1>
            <p className="text-sm sm:text-base text-gray-600">마일리지 입출금 신청 내역을 확인하세요</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button 
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-10 sm:h-9 text-sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
            <div className="flex gap-2 sm:gap-3">
              <Link href="/deposit" className="flex-1 sm:flex-none">
                <Button className="bg-green-600 hover:bg-green-700 h-10 sm:h-9 text-sm w-full sm:w-auto">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  입금 신청
                </Button>
              </Link>
              <Link href="/withdrawal" className="flex-1 sm:flex-none">
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 h-10 sm:h-9 text-sm w-full sm:w-auto">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  출금 신청
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 마일리지 정보 카드 */}
      <Card className="mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">현재 마일리지</h2>
              <p className="text-xs sm:text-sm text-gray-600">보유 금액</p>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                ₩{user.mileage?.toLocaleString() || '0'}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">원</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 입출금 내역 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <DollarSign className="w-5 h-5" />
            입출금 신청 내역
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-600">총 {applications.length}건의 신청이 있습니다.</p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 overflow-y-auto max-h-[70vh] sm:max-h-none">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 sm:h-24 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => {
                const statusBadge = getApplicationStatusBadge(application.status);
                return (
                  <div key={application.id} className="border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow touch-manipulation">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {application.type === 'deposit' ? (
                          <div className="p-1.5 sm:p-2 bg-green-100 rounded-full">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          </div>
                        ) : (
                          <div className="p-1.5 sm:p-2 bg-red-100 rounded-full">
                            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-base sm:text-lg">
                            {application.type === 'deposit' ? '입금 신청' : '출금 신청'}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">신청번호: {application.id}</p>
                        </div>
                      </div>
                      <Badge variant={statusBadge.variant} className="text-xs sm:text-sm">
                        {statusBadge.label}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm mb-3 sm:mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-600" />
                        <span className="font-bold text-base sm:text-lg text-blue-600">
                          {formatPrice(application.amount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span>신청일: {formatDate(application.requestDate)}</span>
                      </div>
                      {application.processedDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span>처리일: {formatDate(application.processedDate)}</span>
                        </div>
                      )}
                      {application.type === 'withdrawal' && application.bankName && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">은행:</span>
                          <span className="font-medium">{application.bankName}</span>
                        </div>
                      )}
                    </div>

                    {application.type === 'withdrawal' && (
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
                        <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">출금 계좌 정보</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                          <div>
                            <span className="text-gray-600">계좌번호:</span>
                            <span className="ml-2 font-medium break-all">{application.accountNumber}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">예금주:</span>
                            <span className="ml-2 font-medium">{application.accountHolder}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {application.adminNotes && (
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">관리자 메모</h4>
                        <p className="text-xs sm:text-sm text-blue-800">{application.adminNotes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <DollarSign className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">입출금 내역이 없습니다</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">아직 입출금 신청을 하지 않으셨습니다.</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <Link href="/deposit" className="w-full sm:w-auto">
                  <Button className="bg-green-600 hover:bg-green-700 h-10 sm:h-9 text-sm w-full sm:w-auto">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    입금 신청하기
                  </Button>
                </Link>
                <Link href="/withdrawal" className="w-full sm:w-auto">
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 h-10 sm:h-9 text-sm w-full sm:w-auto">
                    <TrendingDown className="w-4 h-4 mr-2" />
                    출금 신청하기
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

export default TransactionHistory;
