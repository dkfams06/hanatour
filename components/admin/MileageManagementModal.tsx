'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Search, User, DollarSign, Plus, Minus } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  nickname?: string;
  phone: string;
  birthDate: string;
  role: string;
  status: string;
  mileage: number;
  createdAt: string;
  lastLogin: string;
  isOnline?: boolean;
  lastActivity?: string;
  sessionDuration?: string;
}

interface MileageTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'reward' | 'usage';
  reason: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

interface MileageManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser?: User | null;
  onUserUpdate?: (updatedUser: User) => void; // 사용자 정보 업데이트 콜백
}

const MileageManagementModal: React.FC<MileageManagementModalProps> = ({
  isOpen,
  onClose,
  selectedUser,
  onUserUpdate
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(selectedUser || null);
  const [mileageAmount, setMileageAmount] = useState(0);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<MileageTransaction[]>([]);
  const [showTransactions, setShowTransactions] = useState(false);

  // 미리 정의된 마일리지 내용 태그들
  const predefinedReasons = [
    '*HANBIT★화이팅! 일 하실때 항상웃으면서하기!',
    '고객 알바시킬때→→N잡러 클릭→→',
    '[N잡러 주문 포인트 지급]',
    '[N잡러 주문 포인트+수익금 지급]',
    '[발권금액+수익금]',
    '[HOTEL] 체험 포인트 지급',
    '[EVENT] 후기작성 포인트 지급',
    '텔레진행입금시→→캠페인 클릭→→',
    '[캠페인 주문 포인트 수익금 지급]',
    '[캠페인 주문 포인트 수익금 차감]'
  ];

  useEffect(() => {
    if (selectedUser) {
      console.log('selectedUser 변경됨:', selectedUser);
      setCurrentUser(selectedUser);
      loadUserTransactions(selectedUser.id);
    }
  }, [selectedUser]);

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/search?q=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSearchResults(data.users || []);
        }
      }
    } catch (error) {
      console.error('사용자 검색 오류:', error);
      toast({
        title: "검색 실패",
        description: "사용자 검색 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const selectUser = (user: User) => {
    setCurrentUser(user);
    setSearchResults([]);
    setSearchTerm('');
    loadUserTransactions(user.id);
  };

  const loadUserTransactions = async (userId: string) => {
    console.log('마일리지 내역 로드 시작:', userId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/mileage-transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('마일리지 내역 API 응답 상태:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('마일리지 내역 API 응답:', data);
        if (data.success) {
          console.log('설정된 마일리지 내역:', data.transactions);
          setTransactions(data.transactions || []);
        } else {
          console.error('마일리지 내역 API 실패:', data.error);
        }
      } else {
        console.error('마일리지 내역 API 요청 실패:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('마일리지 내역 로드 오류:', error);
    }
  };

  const handleMileageApply = async () => {
    if (!currentUser) return;
    
    const finalReason = selectedReason || customReason;
    if (!finalReason.trim()) {
      toast({
        title: "사유 입력 필요",
        description: "마일리지 증감 사유를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (mileageAmount === 0) {
      toast({
        title: "금액 입력 필요",
        description: "마일리지 증감 금액을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${currentUser.id}/mileage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: mileageAmount,
          reason: finalReason,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "마일리지 적용 완료",
          description: `${currentUser.name}님의 마일리지가 ${mileageAmount > 0 ? '+' : ''}${mileageAmount.toLocaleString()}원 ${mileageAmount > 0 ? '추가' : '차감'}되었습니다.`,
        });
        
        // 사용자 정보 새로고침 (직접 사용자 ID로 조회, 캐시 방지)
        const userResponse = await fetch(`/api/admin/users/${currentUser.id}?t=${Date.now()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.success && userData.user) {
            const updatedUser = userData.user;
            setCurrentUser(updatedUser);
            
            // 부모 컴포넌트에 업데이트된 사용자 정보 전달
            if (onUserUpdate) {
              console.log('onUserUpdate 콜백 호출:', updatedUser);
              onUserUpdate(updatedUser);
            }
          }
        } else {
          // 대안: 검색 API 사용 (캐시 방지)
          const searchResponse = await fetch(`/api/admin/users/search?q=${currentUser.username}&t=${Date.now()}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData.success && searchData.users.length > 0) {
              const updatedUser = searchData.users[0];
              setCurrentUser(updatedUser);
              
              // 부모 컴포넌트에 업데이트된 사용자 정보 전달
              if (onUserUpdate) {
                console.log('onUserUpdate 콜백 호출 (검색 API):', updatedUser);
                onUserUpdate(updatedUser);
              }
            }
          }
        }
        
        // 마일리지 내역 새로고침
        await loadUserTransactions(currentUser.id);
        
        // 폼 초기화
        setMileageAmount(0);
        setSelectedReason('');
        setCustomReason('');
        
        // 모달 자동 닫기
        onClose();
      } else {
        toast({
          title: "마일리지 적용 실패",
          description: data.error || "마일리지 적용에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('마일리지 적용 오류:', error);
      toast({
        title: "오류",
        description: "마일리지 적용 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            개별회원 마일리지 증감 설정
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 받는사람 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-gray-700 min-w-[80px]">
                받는사람
              </Label>
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{currentUser.name}</span>
                    <span className="text-gray-500">({currentUser.username})</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCurrentUser(null);
                      setSearchResults([]);
                      setSearchTerm('');
                    }}
                  >
                    회원관리
                  </Button>
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex gap-2">
                    <Input
                      placeholder="사용자명 또는 이메일로 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                      className="flex-1"
                    />
                    <Button onClick={searchUsers} disabled={isSearching}>
                      {isSearching ? '검색중...' : '검색'}
                    </Button>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="mt-2 border rounded-lg p-2 max-h-40 overflow-y-auto">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => selectUser(user)}
                        >
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                          <div className="text-sm text-blue-600">
                            {user.mileage?.toLocaleString()}원
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {currentUser && (
            <>
              {/* 마일리지 내용 섹션 */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 min-w-[80px]">
                    마일리지 내용
                  </Label>
                  <Button size="sm" variant="outline">
                    마일리지내용설정
                  </Button>
                </div>
                
                <div className="ml-[80px] space-y-3">
                  {/* 미리 정의된 사유 태그들 */}
                  <div className="flex flex-wrap gap-2">
                    {predefinedReasons.map((reason, index) => (
                      <Badge
                        key={index}
                        variant={selectedReason === reason ? "default" : "outline"}
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={() => {
                          setSelectedReason(reason);
                          setCustomReason('');
                        }}
                      >
                        {reason}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* 사용자 정의 사유 입력 */}
                  <div>
                    <Input
                      placeholder="직접 입력하거나 위의 태그를 선택하세요"
                      value={customReason}
                      onChange={(e) => {
                        setCustomReason(e.target.value);
                        setSelectedReason('');
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 지급 마일리지 섹션 */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 min-w-[80px]">
                    지급마일리지
                  </Label>
                </div>
                
                <div className="ml-[80px] space-y-3">
                  <p className="text-sm text-gray-600">
                    지급마일리지를 0이하로 설정시 마일리지가 차감됩니다.
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={mileageAmount}
                      onChange={(e) => setMileageAmount(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-32"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setMileageAmount(prev => prev - 1000)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setMileageAmount(prev => prev + 1000)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {mileageAmount !== 0 && (
                    <div className={`p-3 rounded-lg ${
                      mileageAmount > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <DollarSign className={`w-4 h-4 ${mileageAmount > 0 ? 'text-green-600' : 'text-red-600'}`} />
                        <span className="font-medium">
                          {mileageAmount > 0 ? '추가' : '차감'} 금액: {Math.abs(mileageAmount).toLocaleString()}원
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        적용 후 마일리지: {(currentUser.mileage + mileageAmount).toLocaleString()}원
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 마일리지 내역 보기 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setShowTransactions(!showTransactions)}
                  >
                    {showTransactions ? '내역 숨기기' : '마일리지 내역 보기'}
                  </Button>
                  
                  <Button
                    onClick={handleMileageApply}
                    disabled={isProcessing || mileageAmount === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? '처리중...' : '지급하기'}
                  </Button>
                </div>

                {showTransactions && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">마일리지 내역 (총 {transactions.length}건)</h3>
                      {transactions.length > 0 ? (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {transactions.map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex items-center justify-between p-2 border rounded"
                            >
                                                             <div className="flex items-center gap-3">
                                 <Badge variant={
                                   transaction.type === 'deposit' || transaction.type === 'reward' 
                                     ? 'default' 
                                     : 'destructive'
                                 }>
                                   {transaction.type === 'deposit' ? '입금' : 
                                    transaction.type === 'withdrawal' ? '출금' :
                                    transaction.type === 'reward' ? '적립' : '사용'}
                                 </Badge>
                                 <span className="font-medium">
                                   {transaction.amount.toLocaleString()}원
                                 </span>
                                 <span className="text-sm text-gray-600">
                                   {transaction.reason}
                                 </span>
                               </div>
                              <span className="text-sm text-gray-500">
                                {formatDate(transaction.createdAt)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">마일리지 내역이 없습니다.</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MileageManagementModal;
