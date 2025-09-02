'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  DollarSign,
  User,
  Calendar,
  Trash2,
  ArrowRight,
  Search
} from 'lucide-react';

interface Transaction {
  id: string;
  userId?: string;
  username?: string;
  userName?: string;
  nickname?: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  applicationMethod?: string;
  requestDate: string;
  processedDate?: string;
  adminNotes?: string;
}

export default function AdminTransactionsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('deposit');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchTransactions();
    }
  }, [user, selectedTab]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/transactions?type=${selectedTab}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('거래 내역 조회 오류:', error);
      toast({
        title: "오류",
        description: "거래 내역을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (transactionId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/transactions/${transactionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast({
          title: "상태 변경 완료",
          description: `거래 상태가 ${getStatusText(newStatus)}로 변경되었습니다.`,
        });
        fetchTransactions();
      } else {
        toast({
          title: "상태 변경 실패",
          description: data.error || "상태 변경에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "상태 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">처리대기</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">처리중</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">완료</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">거부</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '처리대기';
      case 'processing': return '처리중';
      case 'completed': return '완료';
      case 'rejected': return '거부';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    return type === 'deposit' ? '입금신청' : '출금신청';
  };

  const getTypeIcon = (type: string) => {
    return type === 'deposit' ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const handleSelectAll = () => {
    if (selectedItems.length === transactions.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(transactions.map(t => t.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "선택된 항목 없음",
        description: "삭제할 항목을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`선택된 ${selectedItems.length}개 항목을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/transactions/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedItems }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "삭제 완료",
          description: `${selectedItems.length}개 항목이 삭제되었습니다.`,
        });
        setSelectedItems([]);
        fetchTransactions();
      } else {
        toast({
          title: "삭제 실패",
          description: data.error || "삭제에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">로딩 중...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 영역 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">무통장 신청기록</h1>
              <p className="text-gray-600 mt-1">입금 및 출금 신청 내역을 관리합니다</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Search className="w-4 h-4" />
                <input
                  type="text"
                  placeholder="검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                />
              </div>
              {selectedItems.length > 0 && (
                <Button
                  onClick={handleDeleteSelected}
                  variant="destructive"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  선택삭제 ({selectedItems.length})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 탭 버튼 */}
        <div className="flex gap-2">
          <Button
            variant={selectedTab === 'deposit' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('deposit')}
            className={selectedTab === 'deposit' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            입금신청
          </Button>
          <Button
            variant={selectedTab === 'withdrawal' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('withdrawal')}
            className={selectedTab === 'withdrawal' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            출금신청
          </Button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* 요약 정보 */}
          <div className="p-4 bg-blue-50 border-b">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">
                전체 {transactions.length}건 중 {transactions.length}건 목록
              </span>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                신청기록 전체보기 <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-12 text-center text-gray-500">로딩 중...</div>
            ) : transactions.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                {selectedTab === 'deposit' ? '입금 신청이 없습니다.' : '출금 신청이 없습니다.'}
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === transactions.length && transactions.length > 0}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="p-3 text-left">번호</th>
                    <th className="p-3 text-left">회원아이디</th>
                    <th className="p-3 text-left">신청인</th>
                    <th className="p-3 text-left">신청자명</th>
                    <th className="p-3 text-left">신청종류</th>
                    {selectedTab === 'withdrawal' && (
                      <>
                        <th className="p-3 text-left">예금주</th>
                        <th className="p-3 text-left">계좌번호</th>
                      </>
                    )}
                    <th className="p-3 text-left">신청금액</th>
                    <th className="p-3 text-left">신청방식</th>
                    <th className="p-3 text-left">신청시간</th>
                    <th className="p-3 text-left">상태</th>
                    <th className="p-3 text-left">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(transaction.id)}
                          onChange={() => handleSelectItem(transaction.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-3">{transactions.length - index}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-gray-400" />
                          {transaction.username || '-'}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-gray-400" />
                          {transaction.userName || transaction.nickname || '-'}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-blue-600 font-medium">
                          [{getTypeText(transaction.type)}] {transaction.amount >= 1000000 ? `${Math.floor(transaction.amount / 10000)}만원` : '직접입력'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          {getTypeIcon(transaction.type)}
                          {getTypeText(transaction.type)}
                        </div>
                      </td>
                      {selectedTab === 'withdrawal' && (
                        <>
                          <td className="p-3">{transaction.accountHolder || '-'}</td>
                          <td className="p-3">
                            {transaction.accountNumber ? (
                              <span>
                                {transaction.accountNumber}
                                {transaction.bankName && <span className="text-gray-500 ml-1">[{transaction.bankName}]</span>}
                              </span>
                            ) : '-'}
                          </td>
                        </>
                      )}
                      <td className="p-3">
                        <span className="font-medium text-red-600">
                          {transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3">직접충전</td>
                      <td className="p-3">
                        {new Date(transaction.requestDate).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="p-3">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {transaction.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(transaction.id, 'rejected')}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                거부
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(transaction.id, 'processing')}
                                className="bg-yellow-600 hover:bg-yellow-700"
                              >
                                처리중
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(transaction.id, 'completed')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                완료
                              </Button>
                            </>
                          )}
                          {transaction.status === 'processing' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(transaction.id, 'rejected')}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                거부
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(transaction.id, 'completed')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                완료
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 상세 모달 */}
        {showDetailModal && selectedTransaction && (
          <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>거래 상세정보</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold">사용자 정보:</label>
                    <p>{selectedTransaction.userName || selectedTransaction.nickname || '알 수 없음'}</p>
                    {selectedTransaction.username && (
                      <p className="text-sm text-gray-500">({selectedTransaction.username})</p>
                    )}
                  </div>
                  <div>
                    <label className="font-semibold">거래 종류:</label>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(selectedTransaction.type)}
                      {getTypeText(selectedTransaction.type)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="font-semibold">신청 금액:</label>
                  <p className="text-lg font-bold text-blue-600">
                    {selectedTransaction.amount.toLocaleString()}원
                  </p>
                </div>

                {selectedTransaction.type === 'withdrawal' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold">출금 은행:</label>
                      <p>{selectedTransaction.bankName || '미입력'}</p>
                    </div>
                    <div>
                      <label className="font-semibold">출금 계좌:</label>
                      <p>{selectedTransaction.accountNumber || '미입력'}</p>
                    </div>
                    <div>
                      <label className="font-semibold">예금주:</label>
                      <p>{selectedTransaction.accountHolder || '미입력'}</p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold">신청 시간:</label>
                    <p>{new Date(selectedTransaction.requestDate).toLocaleString('ko-KR')}</p>
                  </div>
                  <div>
                    <label className="font-semibold">처리 시간:</label>
                    <p>{selectedTransaction.processedDate ? new Date(selectedTransaction.processedDate).toLocaleString('ko-KR') : '미처리'}</p>
                  </div>
                </div>

                <div>
                  <label className="font-semibold">상태:</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                </div>

                {selectedTransaction.adminNotes && (
                  <div>
                    <label className="font-semibold">관리자 메모:</label>
                    <p className="mt-1 p-3 bg-gray-50 rounded border">
                      {selectedTransaction.adminNotes}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetailModal(false)}
                  >
                    닫기
                  </Button>
                  {selectedTransaction.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleStatusChange(selectedTransaction.id, 'rejected');
                          setShowDetailModal(false);
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        거부
                      </Button>
                      <Button
                        onClick={() => {
                          handleStatusChange(selectedTransaction.id, 'processing');
                          setShowDetailModal(false);
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        처리중
                      </Button>
                      <Button
                        onClick={() => {
                          handleStatusChange(selectedTransaction.id, 'completed');
                          setShowDetailModal(false);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        완료
                      </Button>
                    </>
                  )}
                  {selectedTransaction.status === 'processing' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleStatusChange(selectedTransaction.id, 'rejected');
                          setShowDetailModal(false);
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        거부
                      </Button>
                      <Button
                        onClick={() => {
                          handleStatusChange(selectedTransaction.id, 'completed');
                          setShowDetailModal(false);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        완료
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}
