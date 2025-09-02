'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users, CreditCard, Phone, Mail, User, Search } from 'lucide-react';
import BookingCancelModal from '@/components/BookingCancelModal';

interface BookingInfo {
  id: string;
  bookingNumber: string;
  tourTitle: string;
  customerName: string;
  phone: string;
  email: string;
  participants: number;
  departureDate: string;
  totalAmount: number;
  status: string;
  specialRequests?: string;
  createdAt: string;
}

export default function BookingLookupPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    bookingNumber: '',
    customerName: '',
    phone: ''
  });
  
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bookingNumber.trim()) {
      newErrors.bookingNumber = '예약번호를 입력해주세요.';
    }

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

    setIsLoading(true);

    try {
      const response = await fetch('/api/booking-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingNumber: formData.bookingNumber,
          customerName: formData.customerName,
          phone: formData.phone
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBooking(data.booking);
        toast({
          title: "예약 조회 완료",
          description: "예약 정보를 찾았습니다.",
        });
      } else {
        setBooking(null);
        toast({
          title: "예약 조회 실패",
          description: data.error || '예약 정보를 찾을 수 없습니다.',
          variant: "destructive",
        });
      }
    } catch (error) {
      setBooking(null);
      toast({
        title: "오류 발생",
        description: '예약 조회 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}원`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { name: '대기', color: 'bg-yellow-500' },
      confirmed: { name: '확정', color: 'bg-green-500' },
      cancel_requested: { name: '취소요청', color: 'bg-red-500' },
      cancelled: { name: '취소완료', color: 'bg-gray-500' },
      refund_completed: { name: '환불완료', color: 'bg-purple-500' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { name: status, color: 'bg-gray-500' };
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.name}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">예약 확인</h1>
            <p className="text-gray-600">예약번호와 예약자 정보로 예약 내역을 조회하세요</p>
          </div>

          {/* 조회 폼 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                예약 조회
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="bookingNumber">예약번호 *</Label>
                  <Input
                    id="bookingNumber"
                    value={formData.bookingNumber}
                    onChange={(e) => handleInputChange('bookingNumber', e.target.value)}
                    placeholder="HT20241215XXXX"
                    disabled={isLoading}
                    className={errors.bookingNumber ? 'border-red-500' : ''}
                  />
                  {errors.bookingNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.bookingNumber}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customerName">예약자 이름 *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="예약자 이름을 입력하세요"
                    disabled={isLoading}
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
                    disabled={isLoading}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? '조회 중...' : '예약 조회'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 예약 정보 표시 */}
          {booking && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>예약 정보</CardTitle>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 여행 상품 정보 */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">{booking.tourTitle}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>출발일: {formatDate(booking.departureDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>참가 인원: {booking.participants}명</span>
                    </div>
                  </div>
                </div>

                {/* 예약자 정보 */}
                <div>
                  <h4 className="font-medium mb-3">예약자 정보</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{booking.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{booking.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{booking.email}</span>
                    </div>
                  </div>
                </div>

                {/* 결제 정보 */}
                <div>
                  <h4 className="font-medium mb-3">결제 정보</h4>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="text-lg font-semibold text-blue-600">
                      {formatPrice(booking.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* 특별 요청사항 */}
                {booking.specialRequests && (
                  <div>
                    <h4 className="font-medium mb-3">특별 요청사항</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}

                {/* 예약 정보 */}
                <div className="border-t pt-4">
                  <div className="text-sm text-gray-600">
                    <div>예약번호: <span className="font-medium">{booking.bookingNumber}</span></div>
                    <div>예약일시: {formatDate(booking.createdAt)}</div>
                  </div>
                </div>

                {/* 취소 버튼 */}
                {booking.status === 'pending' || booking.status === 'confirmed' ? (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-start">
                      <Alert className="flex-1 mr-4">
                        <AlertDescription>
                          예약 취소를 원하시면 아래 버튼을 클릭하거나 고객센터(1588-1234)로 연락주세요.
                        </AlertDescription>
                      </Alert>
                      <BookingCancelModal
                        booking={{
                          id: booking.id,
                          customerName: booking.customerName,
                          phone: booking.phone,
                          tourTitle: booking.tourTitle,
                          departureDate: booking.departureDate
                        }}
                        onCancelSuccess={() => {
                          // 예약 정보 새로고침
                          setRefreshKey(prev => prev + 1);
                          // 다시 조회하여 상태 업데이트
                          handleSubmit(new Event('submit') as any);
                        }}
                      >
                        <Button variant="destructive">
                          예약 취소 요청
                        </Button>
                      </BookingCancelModal>
                    </div>
                  </div>
                ) : booking.status === 'cancel_requested' ? (
                  <div className="border-t pt-4">
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertDescription className="text-orange-700">
                        취소 요청이 접수되었습니다. 관리자 검토 후 처리됩니다. 
                        문의사항이 있으시면 고객센터(1588-1234)로 연락주세요.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 