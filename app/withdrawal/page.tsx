'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, DollarSign, AlertTriangle, CheckCircle, User, Building, CreditCard } from 'lucide-react';

export default function WithdrawalPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    applicantName: '',
    withdrawalName: '',
    bankName: '',
    accountNumber: '',
    amount: ''
  });

  // 사용자 정보가 로드되면 폼 데이터 업데이트
  useEffect(() => {
    if (user) {
      const userName = user.name || user.nickname || '';
      setFormData(prev => ({
        ...prev,
        nickname: userName,
        applicantName: userName,
        withdrawalName: userName
      }));
    }
  }, [user?.name, user?.nickname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWithdrawAll = () => {
    if (user?.mileage && user.mileage > 0) {
      setFormData(prev => ({
        ...prev,
        amount: user.mileage!.toString()
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "출금 신청을 위해 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    // 필수 필드 검증
    if (!formData.withdrawalName.trim()) {
      toast({
        title: "입력 오류",
        description: "출금자명을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.bankName.trim()) {
      toast({
        title: "입력 오류",
        description: "출금 은행을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.accountNumber.trim()) {
      toast({
        title: "입력 오류",
        description: "출금 계좌를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.amount || parseInt(formData.amount) <= 0) {
      toast({
        title: "입력 오류",
        description: "올바른 출금 금액을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    const withdrawalAmount = parseInt(formData.amount);
    if (withdrawalAmount > (user.mileage || 0)) {
      toast({
        title: "잔액 부족",
        description: "보유 마일리지보다 많은 금액을 출금할 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          applicantName: formData.applicantName,
          withdrawalName: formData.withdrawalName,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          amount: withdrawalAmount
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // 사용자 정보 새로고침 (마일리지 업데이트)
        await refreshUser();
        
        toast({
          title: "신청 완료",
          description: "출금 신청이 완료되었습니다. 관리자 승인 후 출금이 처리됩니다.",
        });
        router.push('/mypage');
      } else {
        toast({
          title: "신청 실패",
          description: data.error || "출금 신청에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "출금 신청 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">출금신청</h1>
        </div>

        {/* 안내사항 */}
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-red-600">24시간 자유롭게 출금이 가능하며 최장 5분소요!</p>
              <p>• 은행점검시간은 이체불가하며 출금은 완료 즉시 아이디에서 보유머니가 차감됩니다.</p>
              <p>• ※10분이상 출금이 지연될시 회원님 계좌정보를 잘못 기입한 경우가 많습니다.</p>
              <p>• 계좌정보를 잘못 기입할 경우 상담원한테 계좌정보를 정확히 보내주세요.</p>
              <p>• ※출금 받으실 계좌가 우리은행/신한은행/농협은행/기업은행/하나은행 시 출금처리는 3분이내로 완료됩니다.</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* 출금 신청 양식 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-red-600" />
              출금 신청 양식
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 닉네임 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임
                </label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="닉네임"
                    className="w-full"
                  />
                </div>
              </div>

              {/* 신청자명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신청자명
                </label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleInputChange}
                    placeholder="신청자명"
                    className="w-full"
                  />
                </div>
              </div>

              {/* 출금자명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  출금자명 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    name="withdrawalName"
                    value={formData.withdrawalName}
                    onChange={handleInputChange}
                    placeholder="출금자명을 입력하세요"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              {/* 출금 은행 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  출금 은행 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="예: 신한은행, 우리은행, 농협은행"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              {/* 출금 계좌 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  출금 계좌 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="계좌번호를 입력하세요"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              {/* 출금 금액 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  출금 금액 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="출금할 금액을 입력하세요"
                      min="1000"
                      required
                      className="flex-1"
                    />
                  </div>
                  <span className="text-sm text-gray-500 self-center">₩</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    보유마일리지: ₩{user?.mileage?.toLocaleString() || 0}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleWithdrawAll}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    전체 출금
                  </Button>
                </div>
              </div>

              {/* 사용자 정보 표시 */}
              {user && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">신청자 정보</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>아이디: {user.username}</p>
                    <p>닉네임: {user.nickname || user.name}</p>
                    <p>현재 마일리지: ₩{user.mileage?.toLocaleString() || 0}</p>
                  </div>
                </div>
              )}

              {/* 버튼 */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-black hover:bg-gray-800"
                >
                  {isLoading ? "신청 중..." : "신청하기"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/mypage')}
                  className="flex-1"
                >
                  출금 목록
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 추가 안내사항 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">출금 신청 안내</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>출금 신청 후 관리자 승인을 받으면 지정된 계좌로 송금됩니다.</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>처리 상태는 마이페이지에서 확인할 수 있습니다.</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>계좌 정보를 정확히 입력해주세요. 잘못된 정보로 인한 손실은 책임지지 않습니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
