'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, CheckCircle, XCircle, CreditCard, Clock, Calendar } from 'lucide-react';
import { bookingStatusInfo } from '@/lib/mockData';

interface BookingDetailModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (bookingId: string, status: string) => void;
  onDelete: (bookingId: string) => void;
  onEdit: () => void;
}

export default function BookingDetailModal({
  booking,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
  onEdit,
}: BookingDetailModalProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: 'bank_transfer',
    bankName: '',
    accountHolder: '',
    adminMemo: ''
  });

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 금액 포맷팅
  const formatPrice = (price: number) => {
    return price?.toLocaleString() + '원';
  };

  // 결제 확인 처리
  const handlePaymentConfirm = async () => {
    setIsProcessingPayment(true);
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentForm),
      });

      const result = await response.json();

      if (result.success) {
        alert('결제가 확인되었습니다!');
        setShowPaymentForm(false);
        onStatusChange(booking.id, 'payment_completed');
        onClose();
      } else {
        alert('결제 확인에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('결제 확인 오류:', error);
      alert('결제 확인 중 오류가 발생했습니다.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // 입금 기한 연장
  const handleExtendDueDate = async (hours: number = 24) => {
    try {
      const response = await fetch('/api/payment-expire-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          extensionHours: hours
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`입금 기한이 ${hours}시간 연장되었습니다!`);
        // 부모 컴포넌트에서 데이터 새로고침 필요
        onClose();
      } else {
        alert('입금 기한 연장에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('입금 기한 연장 오류:', error);
      alert('입금 기한 연장 중 오류가 발생했습니다.');
    }
  };

  // 입금 기한까지 남은 시간 계산
  const getRemainingTime = (paymentDueDate: string) => {
    if (!paymentDueDate) return null;
    
    const now = new Date();
    const dueDate = new Date(paymentDueDate);
    const diffMs = dueDate.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return { expired: true, text: '기한 만료' };
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      return { expired: false, text: `${diffDays}일 ${diffHours % 24}시간 남음` };
    } else if (diffHours > 0) {
      return { expired: false, text: `${diffHours}시간 ${diffMinutes}분 남음` };
    } else {
      return { expired: false, text: `${diffMinutes}분 남음`, urgent: true };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">예약 상세 정보</DialogTitle>
        </DialogHeader>

        {booking && (
          <div className="space-y-6">
            {/* 예약 기본 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">예약번호</p>
                <p className="font-medium">{booking.bookingNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">예약상태</p>
                <Badge
                  className="mt-1"
                  style={{
                    backgroundColor: bookingStatusInfo[booking.status as keyof typeof bookingStatusInfo]?.color,
                    color: 'white',
                  }}
                >
                  {bookingStatusInfo[booking.status as keyof typeof bookingStatusInfo]?.name || booking.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">예약일시</p>
                <p>{formatDate(booking.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">마지막 수정</p>
                <p>{formatDate(booking.updatedAt)}</p>
              </div>
            </div>

            <Separator />

            {/* 투어 정보 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">투어 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">상품명</p>
                  <p className="font-medium">{booking.tourTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">출발일</p>
                  <p>{formatDate(booking.departureDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">참가인원</p>
                  <p>{booking.participants}명</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">총 금액</p>
                  <p className="font-bold text-blue-600">{formatPrice(booking.totalAmount)}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* 고객 정보 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">고객 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">이름</p>
                  <p>{booking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">전화번호</p>
                  <p>{booking.customerPhone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">이메일</p>
                  <p>{booking.customerEmail}</p>
                </div>
              </div>
            </div>

            {/* 결제 정보 섹션 */}
            <Separator />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  결제 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">예약 상태</Label>
                    <div className="mt-1">
                      <Badge 
                        style={{ 
                          backgroundColor: bookingStatusInfo[booking.status as keyof typeof bookingStatusInfo]?.color,
                          color: 'white'
                        }}
                      >
                        {bookingStatusInfo[booking.status as keyof typeof bookingStatusInfo]?.name || booking.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">총 결제 금액</Label>
                    <p className="text-lg font-bold text-blue-600 mt-1">{formatPrice(booking.totalAmount)}</p>
                  </div>
                </div>

                {/* 입금 기한 정보 (payment_pending 상태일 때만) */}
                {booking.status === 'payment_pending' && booking.paymentDueDate && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-yellow-800 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          입금 기한
                        </Label>
                        <p className="text-sm text-yellow-700 mt-1">
                          {formatDate(booking.paymentDueDate)}
                        </p>
                        {(() => {
                          const timeInfo = getRemainingTime(booking.paymentDueDate);
                          return timeInfo ? (
                            <p className={`text-sm font-medium mt-1 ${
                              timeInfo.expired ? 'text-red-600' : 
                              timeInfo.urgent ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {timeInfo.text}
                            </p>
                          ) : null;
                        })()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExtendDueDate(24)}
                        >
                          +24시간
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExtendDueDate(72)}
                        >
                          +3일
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 결제 완료 정보 (payment_completed 상태일 때) */}
                {booking.status === 'payment_completed' && booking.paymentInfo && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <Label className="text-sm font-medium text-green-800">결제 완료 정보</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-xs text-green-600">결제 방식</p>
                        <p className="text-sm font-medium">{booking.paymentInfo.method === 'bank_transfer' ? '계좌이체' : booking.paymentInfo.method}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600">결제 완료일</p>
                        <p className="text-sm font-medium">{formatDate(booking.paymentInfo.paidAt)}</p>
                      </div>
                      {booking.paymentInfo.bankName && (
                        <div>
                          <p className="text-xs text-green-600">입금 은행</p>
                          <p className="text-sm font-medium">{booking.paymentInfo.bankName}</p>
                        </div>
                      )}
                      {booking.paymentInfo.accountHolder && (
                        <div>
                          <p className="text-xs text-green-600">입금자명</p>
                          <p className="text-sm font-medium">{booking.paymentInfo.accountHolder}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 결제 확인 버튼 (payment_pending 상태일 때만) */}
                {booking.status === 'payment_pending' && !showPaymentForm && (
                  <Button
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    입금 확인하기
                  </Button>
                )}

                {/* 결제 확인 폼 */}
                {showPaymentForm && (
                  <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                    <h4 className="font-medium">결제 확인 정보 입력</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bankName">입금 은행</Label>
                        <Input
                          id="bankName"
                          value={paymentForm.bankName}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, bankName: e.target.value }))}
                          placeholder="예: 국민은행"
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountHolder">입금자명</Label>
                        <Input
                          id="accountHolder"
                          value={paymentForm.accountHolder}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, accountHolder: e.target.value }))}
                          placeholder="실제 입금한 분의 이름"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="adminMemo">관리자 메모</Label>
                      <Textarea
                        id="adminMemo"
                        value={paymentForm.adminMemo}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, adminMemo: e.target.value }))}
                        placeholder="입금 확인 관련 메모를 입력하세요"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={handlePaymentConfirm}
                        disabled={isProcessingPayment}
                        className="flex-1"
                      >
                        {isProcessingPayment ? '처리 중...' : '결제 확인 완료'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowPaymentForm(false)}
                        disabled={isProcessingPayment}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 요청사항 */}
            {booking.specialRequests && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">요청사항</h3>
                  <p className="text-gray-700 whitespace-pre-line">{booking.specialRequests}</p>
                </div>
              </>
            )}

            {/* 관리자 메모 */}
            {booking.adminNotes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">관리자 메모</h3>
                  <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded-md">
                    {booking.adminNotes}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* 상태 변경 버튼 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">상태 관리</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => onStatusChange(booking.id, 'payment_pending')}
                  disabled={booking.status === 'payment_pending'}
                  className="border-yellow-600 text-yellow-700"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  결제대기
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onStatusChange(booking.id, 'payment_completed')}
                  disabled={booking.status === 'payment_completed'}
                  className="border-green-600 text-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  결제완료
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onStatusChange(booking.id, 'payment_expired')}
                  disabled={booking.status === 'payment_expired'}
                  className="border-red-600 text-red-700"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  입금만료
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onStatusChange(booking.id, 'cancelled')}
                  disabled={booking.status === 'cancelled'}
                  className="border-red-600 text-red-700"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  예약취소
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onStatusChange(booking.id, 'refund_completed')}
                  disabled={booking.status === 'refund_completed'}
                  className="border-purple-600 text-purple-700"
                >
                  환불완료
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {isConfirmingDelete ? (
            <>
              <div className="mr-auto text-sm text-red-600">정말 삭제하시겠습니까?</div>
              <Button
                variant="outline"
                onClick={() => setIsConfirmingDelete(false)}
              >
                취소
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(booking.id);
                  onClose();
                }}
              >
                삭제 확인
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="mr-auto"
                onClick={() => setIsConfirmingDelete(true)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                삭제
              </Button>
              <Button variant="outline" onClick={onClose}>
                닫기
              </Button>
              <Button onClick={onEdit}>
                <Pencil className="w-4 h-4 mr-1" />
                수정
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 