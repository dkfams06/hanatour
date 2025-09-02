'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

interface MileageTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  transactionType: 'deposit' | 'withdrawal' | 'reward' | 'usage';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export default function AdminMileageHistoryPage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<MileageTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'reward' | 'usage'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, typeFilter, dateFilter, searchTerm]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('현재 토큰:', token ? token.substring(0, 20) + '...' : '토큰 없음');
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (dateFilter !== 'all') params.append('date', dateFilter);

      console.log('API 요청 URL:', `/api/admin/mileage-history?${params.toString()}`);

      const response = await fetch(`/api/admin/mileage-history?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('마일리지 내역 API 응답:', data);
        if (data.success) {
          setTransactions(data.transactions);
          setTotalPages(data.totalPages);
          setTotalCount(data.totalCount);
          console.log('설정된 거래 내역:', data.transactions);
        } else {
          console.error('API 응답 실패:', data.error);
        }
      } else {
        console.error('API 요청 실패:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('마일리지 내역 조회 오류:', error);
      toast({
        title: "오류",
        description: "마일리지 내역을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchTransactions();
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setDateFilter('all');
    setCurrentPage(1);
    fetchTransactions();
  };

  const getTransactionTypeInfo = (type: string) => {
    switch (type) {
      case 'deposit':
        return { label: '입금', variant: 'default' as const, icon: TrendingUp };
      case 'withdrawal':
        return { label: '출금', variant: 'destructive' as const, icon: TrendingDown };
      case 'reward':
        return { label: '적립', variant: 'default' as const, icon: TrendingUp };
      case 'usage':
        return { label: '사용', variant: 'destructive' as const, icon: TrendingDown };
      default:
        return { label: type, variant: 'outline' as const, icon: DollarSign };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">마일리지 거래 내역</h1>
            <p className="text-gray-600 mt-1">전체 마일리지 거래 내역을 조회하고 관리합니다</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="사용자명, 이메일, 거래 설명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="거래 타입" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 타입</SelectItem>
                  <SelectItem value="deposit">입금</SelectItem>
                  <SelectItem value="withdrawal">출금</SelectItem>
                  <SelectItem value="reward">적립</SelectItem>
                  <SelectItem value="usage">사용</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="기간" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 기간</SelectItem>
                  <SelectItem value="today">오늘</SelectItem>
                  <SelectItem value="week">이번 주</SelectItem>
                  <SelectItem value="month">이번 달</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 거래 건수</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCount.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 입금/적립</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(transactions
                      .filter(t => t.transactionType === 'deposit' || t.transactionType === 'reward')
                      .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 출금/사용</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(transactions
                      .filter(t => t.transactionType === 'withdrawal' || t.transactionType === 'usage')
                      .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">순 증가</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(transactions
                      .reduce((sum, t) => {
                        if (t.transactionType === 'deposit' || t.transactionType === 'reward') {
                          return sum + t.amount;
                        } else {
                          return sum - t.amount;
                        }
                      }, 0)
                    )}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 거래 내역 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle>거래 내역</CardTitle>
            <p className="text-sm text-gray-600">
              총 {totalCount.toLocaleString()}건의 거래 내역이 있습니다.
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-gray-900">거래 ID</th>
                      <th className="text-left p-3 font-medium text-gray-900">사용자</th>
                      <th className="text-left p-3 font-medium text-gray-900">거래 타입</th>
                      <th className="text-left p-3 font-medium text-gray-900">금액</th>
                      <th className="text-left p-3 font-medium text-gray-900">거래 전</th>
                      <th className="text-left p-3 font-medium text-gray-900">거래 후</th>
                      <th className="text-left p-3 font-medium text-gray-900">설명</th>
                      <th className="text-left p-3 font-medium text-gray-900">거래일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => {
                      const typeInfo = getTransactionTypeInfo(transaction.transactionType);
                      const TypeIcon = typeInfo.icon;
                      
                      return (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-sm text-gray-600">
                            {transaction.id.slice(0, 8)}...
                          </td>
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{transaction.userName}</div>
                              <div className="text-sm text-gray-500">{transaction.userEmail}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant={typeInfo.variant} className="flex items-center gap-1 w-fit">
                              <TypeIcon className="w-3 h-3" />
                              {typeInfo.label}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <span className={`font-medium ${
                              transaction.transactionType === 'deposit' || transaction.transactionType === 'reward'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {formatCurrency(transaction.balanceBefore)}
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {formatCurrency(transaction.balanceAfter)}
                          </td>
                          <td className="p-3">
                            <div className="max-w-xs">
                              <p className="text-sm text-gray-900 truncate" title={transaction.description}>
                                {transaction.description}
                              </p>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {formatDate(transaction.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">거래 내역이 없습니다</h3>
                <p className="text-gray-600">검색 조건을 변경해보세요.</p>
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    이전
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="w-10 h-10 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    다음
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
