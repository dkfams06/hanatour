'use client';

import { useState } from 'react';
import { Tour } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { formatPhoneNumber } from '@/lib/utils';
import { Calendar, Users, CreditCard, Phone, Mail, User } from 'lucide-react';

interface BookingFormProps {
  tour: Tour;
  onBookingComplete?: (bookingId: string) => void;
}

interface BookingData {
  customerName: string;
  phone: string;
  email: string;
  participants: number;
  specialRequests: string;
}

export default function BookingForm({ tour, onBookingComplete }: BookingFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<BookingData>({
    customerName: '',
    phone: '',
    email: '',
    participants: 1,
    specialRequests: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = '이름을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^01[0-9]-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '전화번호는 010-1234-5678 형식으로 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (formData.participants < 1) {
      newErrors.participants = '참가 인원은 1명 이상이어야 합니다.';
    }

    const availableSeats = tour.maxParticipants - tour.currentParticipants;
    if (formData.participants > availableSeats) {
      newErrors.participants = `예약 가능 인원을 초과했습니다. (잔여: ${availableSeats}명)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof BookingData, value: string | number) => {
    // 전화번호 자동 포맷팅
    if (field === 'phone' && typeof value === 'string') {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId: tour.id,
          ...formData
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "예약 완료!",
          description: `예약번호: ${data.booking.id}`,
        });

        // 폼 초기화
        setFormData({
          customerName: '',
          phone: '',
          email: '',
          participants: 1,
          specialRequests: ''
        });

        // 부모 컴포넌트에 예약 완료 알림
        if (onBookingComplete) {
          onBookingComplete(data.booking.id);
        }
      } else {
        toast({
          title: "예약 실패",
          description: data.error || '예약 처리 중 오류가 발생했습니다.',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: '예약 처리 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}원`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const totalAmount = tour.price * formData.participants;
  const availableSeats = tour.maxParticipants - tour.currentParticipants;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          예약하기
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 여행 정보 요약 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">{tour.title}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(tour.departureDate)}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              잔여 {availableSeats}명
            </div>
          </div>
          <div className="mt-2 text-lg font-semibold text-blue-600">
            1인당 {formatPrice(tour.price)}
          </div>
        </div>

        {/* 예약 불가 상태 표시 */}
        {(tour.status !== 'published' || availableSeats <= 0) && (
          <Alert className="mb-4">
            <AlertDescription>
              {tour.status !== 'published' 
                ? '현재 예약할 수 없는 상품입니다.' 
                : '예약 가능한 인원이 없습니다.'}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 예약자 정보 */}
          <div>
            <Label htmlFor="customerName" className="flex items-center gap-1">
              <User className="w-4 h-4" />
              예약자 이름 *
            </Label>
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
            <Label htmlFor="phone" className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              전화번호 *
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="010-1234-5678"
              disabled={isSubmitting}
              className={errors.phone ? 'border-red-500' : ''}
              maxLength={13}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              이메일 *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="example@email.com"
              disabled={isSubmitting}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="participants" className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              참가 인원 *
            </Label>
            <Input
              id="participants"
              type="number"
              min="1"
              max={availableSeats}
              value={formData.participants}
              onChange={(e) => handleInputChange('participants', parseInt(e.target.value) || 1)}
              disabled={isSubmitting}
              className={errors.participants ? 'border-red-500' : ''}
            />
            {errors.participants && (
              <p className="text-red-500 text-sm mt-1">{errors.participants}</p>
            )}
          </div>

          <div>
            <Label htmlFor="specialRequests">특별 요청사항</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="특별한 요청사항이 있으시면 입력해주세요 (선택사항)"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* 총 금액 */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>총 결제 금액</span>
              <span className="text-blue-600">{formatPrice(totalAmount)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formatPrice(tour.price)} × {formData.participants}명
            </p>
          </div>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || tour.status !== 'published' || availableSeats <= 0}
          >
            {isSubmitting ? '예약 처리 중...' : '예약하기'}
          </Button>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          * 예약 완료 후 예약번호를 통해 예약 확인 및 취소가 가능합니다.
        </div>
      </CardContent>
    </Card>
  );
} 