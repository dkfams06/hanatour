'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

export default function DepositPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: '',
    amount: '',
    applicationMethod: '직접충전'
  });

  // 사용자 정보가 로드되면 폼 데이터 업데이트
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        applicantName: user.name || user.nickname || ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "입금 신청을 위해 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.applicantName.trim()) {
      toast({
        title: "입력 오류",
        description: "신청자명을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.amount || parseInt(formData.amount) <= 0) {
      toast({
        title: "입력 오류",
        description: "올바른 금액을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          applicantName: formData.applicantName,
          amount: parseInt(formData.amount),
          applicationMethod: formData.applicationMethod
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // 사용자 정보 새로고침 (마일리지 업데이트)
        await refreshUser();
        
        toast({
          title: "신청 완료",
          description: "입금 신청이 완료되었습니다. 관리자 승인 후 마일리지가 적립됩니다.",
        });
        router.push('/mypage');
      } else {
        toast({
          title: "신청 실패",
          description: data.error || "입금 신청에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "입금 신청 중 오류가 발생했습니다.",
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
          <h1 className="text-3xl font-bold text-gray-900">입금신청</h1>
        </div>

        {/* 안내사항 */}
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-red-600">24시간 자유롭게 입금이 가능하며 최장 5분소요!</p>
              <p>• 입금 신청 후 관리자 승인 시 마일리지가 적립됩니다.</p>
              <p>• 신청 금액은 1,000원 이상부터 가능합니다.</p>
              <p>• 입금 처리는 영업일 기준 1-2일 소요됩니다.</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* 입금 신청 양식 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              입금 신청 양식
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 신청자명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신청자명 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  placeholder="신청자명을 입력하세요"
                  required
                  className="w-full"
                />
              </div>

              {/* 입금 금액 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  입금 금액 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="입금할 금액을 입력하세요"
                    min="1000"
                    required
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500 self-center">₩</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  최소 1,000원부터 신청 가능합니다.
                </p>
              </div>

              {/* 신청 방식 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신청 방식
                </label>
                <Input
                  type="text"
                  name="applicationMethod"
                  value={formData.applicationMethod}
                  onChange={handleInputChange}
                  className="w-full"
                  readOnly
                />
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
                  입금 목록
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 추가 안내사항 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">입금 신청 안내</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>입금 신청 후 관리자 승인을 받으면 마일리지가 적립됩니다.</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>처리 상태는 마이페이지에서 확인할 수 있습니다.</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>문의사항이 있으시면 고객센터로 연락해주세요.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
