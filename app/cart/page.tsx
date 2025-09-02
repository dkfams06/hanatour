'use client';

import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingCart, Trash2, Plus, Minus, Calendar, Users, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { formatPhoneNumber } from '@/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, updateCartItem, clearCart, cartCount, cartTotal } = useCart();
  const { language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    if (language === 'ko') {
      return `${price.toLocaleString()}원`;
    }
    return `$${(price / 1000).toFixed(0)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRemoveItem = async (cartId: string) => {
    await removeFromCart(cartId);
    toast({
      title: "상품이 장바구니에서 제거되었습니다",
      variant: "default",
    });
  };

  const handleClearAll = async () => {
    if (confirm('모든 장바구니 항목을 삭제하시겠습니까?')) {
      await clearCart();
      toast({
        title: "장바구니가 비워졌습니다",
        variant: "default",
      });
    }
  };

  const handleParticipantsChange = async (cartId: string, newParticipants: number) => {
    if (newParticipants < 1) return;
    await updateCartItem(cartId, { participants: newParticipants });
  };

  const handleCustomerInfoChange = async (cartId: string, field: string, value: string) => {
    await updateCartItem(cartId, { [field]: value });
  };

  const handleProceedToBooking = async () => {
    setIsProcessing(true);
    
    try {
      const bookingResults = [];

      // 각 장바구니 아이템에 대해 개별 예약 생성
      for (const item of cart) {
        const bookingData = {
          tourId: item.tourId,
          customerName: item.customerName,
          phone: item.customerPhone,
          email: item.customerEmail,
          participants: item.participants,
          specialRequests: item.specialRequests
        };

        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '예약 처리 중 오류가 발생했습니다');
        }

        const result = await response.json();
        bookingResults.push(result.booking);
      }

      // 성공시 장바구니 비우기
      await clearCart();
      
      // 예약번호들을 포함한 성공 메시지
      const bookingNumbers = bookingResults.map(booking => booking.bookingNumber).join(', ');
      
      toast({
        title: "예약 신청이 완료되었습니다!",
        description: `예약번호: ${bookingNumbers}\n입금 기한 내에 입금을 완료해주세요.`,
        variant: "default",
      });

      // 예약 확인 페이지로 이동
      router.push('/booking-lookup');
      
    } catch (error) {
      console.error('예약 처리 오류:', error);
      toast({
        title: "예약 처리 실패",
        description: error instanceof Error ? error.message : "예약 처리 중 오류가 발생했습니다",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // 모든 아이템의 필수 정보가 입력되었는지 확인
  const isReadyToBook = cart.every(item => 
    (item.customerName || '').trim() && 
    (item.customerPhone || '').trim() && 
    (item.customerEmail || '').trim() &&
    item.participants > 0
  );

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">장바구니가 비어있습니다</h1>
            <p className="text-gray-600 mb-8">
              원하는 여행 상품을 장바구니에 담아보세요!
            </p>
            <Link href="/packages">
              <Button className="bg-blue-600 hover:bg-blue-700">
                여행 상품 둘러보기
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              장바구니 ({cartCount}개)
            </h1>
          </div>
          <Button
            onClick={handleClearAll}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            전체 삭제
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 장바구니 아이템 목록 */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <Card key={item.id || item.tourId} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* 상품 이미지 */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.mainImage}
                        alt={item.title}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* 상품 정보 */}
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            출발일: {formatDate(item.departureDate)}
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatPrice(item.price)} / 인
                          </div>
                        </div>
                        <Button
                          onClick={() => handleRemoveItem(item.id!)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* 인원수 조절 */}
                      <div className="flex items-center space-x-3">
                        <Label className="text-sm font-medium">인원수:</Label>
                        <div className="flex items-center border rounded-lg">
                          <Button
                            onClick={() => handleParticipantsChange(item.id!, item.participants - 1)}
                            variant="ghost"
                            size="sm"
                            disabled={item.participants <= 1}
                            className="px-2"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="px-4 py-2 text-center min-w-[3rem]">
                            {item.participants}
                          </span>
                          <Button
                            onClick={() => handleParticipantsChange(item.id!, item.participants + 1)}
                            variant="ghost"
                            size="sm"
                            className="px-2"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Users className="w-4 h-4 text-gray-400" />
                      </div>

                      {/* 예약자 정보 입력 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`name-${item.id}`} className="text-sm font-medium">
                            예약자명 *
                          </Label>
                          <Input
                            id={`name-${item.id}`}
                            value={item.customerName || ''}
                            onChange={(e) => handleCustomerInfoChange(item.id!, 'customerName', e.target.value)}
                            placeholder="예약자 이름을 입력하세요"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`phone-${item.id}`} className="text-sm font-medium">
                            연락처 *
                          </Label>
                          <Input
                            id={`phone-${item.id}`}
                            value={item.customerPhone || ''}
                            onChange={(e) => handleCustomerInfoChange(item.id!, 'customerPhone', formatPhoneNumber(e.target.value))}
                            placeholder="010-1234-5678"
                            className="mt-1"
                            maxLength={13}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor={`email-${item.id}`} className="text-sm font-medium">
                            이메일 *
                          </Label>
                          <Input
                            id={`email-${item.id}`}
                            type="email"
                            value={item.customerEmail || ''}
                            onChange={(e) => handleCustomerInfoChange(item.id!, 'customerEmail', e.target.value)}
                            placeholder="example@email.com"
                            className="mt-1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor={`requests-${item.id}`} className="text-sm font-medium">
                            요청사항
                          </Label>
                          <Textarea
                            id={`requests-${item.id}`}
                            value={item.specialRequests || ''}
                            onChange={(e) => handleCustomerInfoChange(item.id!, 'specialRequests', e.target.value)}
                            placeholder="특별한 요청사항이 있으시면 입력해주세요"
                            className="mt-1"
                            rows={2}
                          />
                        </div>
                      </div>

                      {/* 소계 */}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">소계</span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(item.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  주문 요약
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.tourId} className="flex justify-between text-sm">
                      <span className="truncate pr-2">{item.title}</span>
                      <span>{formatPrice(item.totalAmount)}</span>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>총 결제 금액</span>
                  <span className="text-blue-600">{formatPrice(cartTotal)}</span>
                </div>

                <Button
                  onClick={handleProceedToBooking}
                  className="w-full"
                  disabled={!isReadyToBook || isProcessing}
                  size="lg"
                >
                  {isProcessing ? '예약 처리 중...' : '예약 신청하기'}
                </Button>

                {!isReadyToBook && (
                  <p className="text-xs text-red-600 text-center">
                    * 모든 상품의 예약자 정보를 입력해주세요
                  </p>
                )}

                <div className="text-xs text-gray-500 text-center">
                  * 예약 신청 후 입금 안내를 받으실 수 있습니다<br />
                  * 입금 확인 후 예약이 확정됩니다
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}