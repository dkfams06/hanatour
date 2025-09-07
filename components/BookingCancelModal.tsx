'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { X, AlertTriangle } from 'lucide-react';

interface BookingCancelModalProps {
  booking: {
    id: string;
    customerName: string;
    phone: string;
    tourTitle: string;
    departureDate: string;
  };
  onCancelSuccess?: () => void;
  children: React.ReactNode;
}

export default function BookingCancelModal({ 
  booking, 
  onCancelSuccess, 
  children 
}: BookingCancelModalProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: booking.customerName,
    phone: booking.phone,
    reason: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = '예약자 이름을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^01[0-9]-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '전화번호는 010-1234-5678 형식으로 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    // 전화번호 자동 포맷팅
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 실시간 에러 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // 전화번호 자동 포맷팅 함수
  const formatPhoneNumber = (phone: string) => {
    // 숫자만 추출
    const numbers = phone.replace(/[^\d]/g, '');
    
    // 자릿수에 따라 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else {
      // 11자리 초과시 11자리까지만 포맷팅
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/booking-cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          customerName: formData.customerName,
          phone: formData.phone,
          reason: formData.reason
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "취소 요청 완료",
          description: data.message,
        });

        setIsOpen(false);
        
        // 부모 컴포넌트에 성공 알림
        if (onCancelSuccess) {
          onCancelSuccess();
        }
      } else {
        toast({
          title: "취소 요청 실패",
          description: data.error || '취소 요청 처리 중 오류가 발생했습니다.',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: '취소 요청 처리 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  // 출발일까지 남은 일수 계산
  const getDaysUntilDeparture = () => {
    const departure = new Date(booking.departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    departure.setHours(0, 0, 0, 0);
    
    const diffTime = departure.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDeparture = getDaysUntilDeparture();
  const canCancel = daysUntilDeparture > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            예약 취소 요청
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 예약 정보 요약 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">{booking.tourTitle}</h3>
            <div className="text-sm text-gray-600">
              <div>예약번호: {booking.id}</div>
              <div>출발일: {formatDate(booking.departureDate)}</div>
              {daysUntilDeparture > 0 && (
                <div className="text-blue-600 font-medium">
                  출발까지 {daysUntilDeparture}일 남음
                </div>
              )}
            </div>
          </div>

          {/* 취소 불가 경고 */}
          {!canCancel && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <AlertDescription className="text-red-700">
                출발일 당일 이후에는 취소할 수 없습니다. 자세한 사항은 고객센터(1588-1234)로 연락주세요.
              </AlertDescription>
            </Alert>
          )}

          {/* 취소 정책 안내 */}
          <Alert>
            <AlertDescription>
              <strong>취소 정책</strong><br />
              • 출발 7일 전: 100% 환불<br />
              • 출발 3-6일 전: 80% 환불<br />
              • 출발 1-2일 전: 50% 환불<br />
              • 출발 당일: 환불 불가
            </AlertDescription>
          </Alert>

          {canCancel && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 예약자 정보 확인 */}
              <div>
                <Label htmlFor="customerName">예약자 이름 *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="예약자 이름을 입력하세요"
                  disabled={isSubmitting}
                  className={errors.customerName ? 'border-red-500' : ''}
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">전화번호 *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="010-1234-5678"
                  disabled={isSubmitting}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="reason">취소 사유</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="취소 사유를 입력해주세요 (선택사항)"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              {/* 제출 버튼 */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '요청 중...' : '취소 요청'}
                </Button>
              </div>
            </form>
          )}

          {!canCancel && (
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                닫기
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 