'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { bookingStatusInfo } from '@/lib/mockData';
import { Loader2 } from 'lucide-react';

interface BookingFormModalProps {
  booking?: any; // 수정 시 예약 정보, 신규 등록 시 null
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function BookingFormModal({
  booking,
  isOpen,
  onClose,
  onSubmitSuccess,
}: BookingFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tours, setTours] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    tourId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    participants: 1,
    specialRequests: '',
    adminNotes: '',
    status: 'confirmed',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTour, setSelectedTour] = useState<any>(null);

  // 투어 목록 가져오기
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/tours?status=published');
        const result = await response.json();
        
        if (result.success && result.data) {
          // 새로운 API 응답 구조에 맞게 수정
          const toursData = Array.isArray(result.data) ? result.data : [];
          setTours(toursData);
        } else {
          console.error('투어 목록을 가져오는데 실패했습니다:', result.error);
          setTours([]);
        }
      } catch (error) {
        console.error('투어 목록을 가져오는데 실패했습니다:', error);
      }
    };
    
    fetchTours();
  }, []);

  // 수정 시 기존 정보 설정
  useEffect(() => {
    if (booking) {
      setFormData({
        tourId: booking.tourId || '',
        customerName: booking.customerName || '',
        customerPhone: booking.customerPhone || '',
        customerEmail: booking.customerEmail || '',
        participants: booking.participants || 1,
        specialRequests: booking.specialRequests || '',
        adminNotes: booking.adminNotes || '',
        status: booking.status || 'confirmed',
      });
      
      // 선택된 투어 정보 가져오기
      const fetchTourDetails = async () => {
        try {
          const response = await fetch(`/api/tours/${booking.tourId}`);
          const result = await response.json();
          
          if (result.success) {
            setSelectedTour(result.data);
          }
        } catch (error) {
          console.error('투어 정보를 가져오는데 실패했습니다:', error);
        }
      };
      
      if (booking.tourId) {
        fetchTourDetails();
      }
    } else {
      // 신규 등록 시 초기화
      setFormData({
        tourId: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        participants: 1,
        specialRequests: '',
        adminNotes: '',
        status: 'confirmed',
      });
      setSelectedTour(null);
    }
  }, [booking, isOpen]);

  // 투어 선택 시 정보 가져오기
  const handleTourChange = async (tourId: string) => {
    setFormData({ ...formData, tourId });
    
    if (!tourId) {
      setSelectedTour(null);
      return;
    }
    
    try {
      const response = await fetch(`/api/tours/${tourId}`);
      const result = await response.json();
      
      if (result.success) {
        setSelectedTour(result.data);
      }
    } catch (error) {
      console.error('투어 정보를 가져오는데 실패했습니다:', error);
    }
  };

  // 입력값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // 셀렉트 변경 처리
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // 참가자 수 변경 처리
  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setFormData({ ...formData, participants: value });
    
    // 에러 메시지 초기화
    if (errors.participants) {
      setErrors({ ...errors, participants: '' });
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.tourId) {
      newErrors.tourId = '투어를 선택해주세요.';
    }
    
    if (!formData.customerName) {
      newErrors.customerName = '고객 이름을 입력해주세요.';
    }
    
    if (!formData.customerPhone) {
      newErrors.customerPhone = '전화번호를 입력해주세요.';
    } else if (!/^\d{2,3}-?\d{3,4}-?\d{4}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = '올바른 전화번호 형식이 아닙니다.';
    }
    
    if (!formData.customerEmail) {
      newErrors.customerEmail = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = '올바른 이메일 형식이 아닙니다.';
    }
    
    if (formData.participants < 1) {
      newErrors.participants = '참가자 수는 최소 1명 이상이어야 합니다.';
    }
    
    if (selectedTour && formData.participants > (selectedTour.maxParticipants - selectedTour.currentParticipants)) {
      newErrors.participants = `예약 가능한 인원을 초과했습니다. 최대 ${selectedTour.maxParticipants - selectedTour.currentParticipants}명까지 예약 가능합니다.`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const url = booking ? `/api/admin/bookings/${booking.id}` : '/api/admin/bookings';
      const method = booking ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        onSubmitSuccess();
      } else {
        console.error('예약 처리에 실패했습니다:', result.error);
        alert(`예약 처리에 실패했습니다: ${result.error}`);
      }
    } catch (error) {
      console.error('예약 처리 중 오류 발생:', error);
      alert('예약 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {booking ? '예약 정보 수정' : '새 예약 등록'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 투어 선택 */}
          <div className="space-y-2">
            <Label htmlFor="tourId">
              투어 선택 <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.tourId}
              onValueChange={(value) => handleTourChange(value)}
              disabled={isLoading || (booking !== null && booking !== undefined)}
            >
              <SelectTrigger id="tourId">
                <SelectValue placeholder="투어를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {tours.map((tour) => (
                  <SelectItem key={tour.id} value={tour.id}>
                    {tour.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tourId && (
              <p className="text-sm text-red-500">{errors.tourId}</p>
            )}
            
            {selectedTour && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                <p><strong>출발일:</strong> {new Date(selectedTour.departureDate).toLocaleDateString()}</p>
                <p><strong>가격:</strong> {selectedTour.price.toLocaleString()}원/인</p>
                <p><strong>예약 가능 인원:</strong> {selectedTour.maxParticipants - selectedTour.currentParticipants}명</p>
              </div>
            )}
          </div>

          {/* 고객 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">고객 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.customerName && (
                  <p className="text-sm text-red-500">{errors.customerName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerPhone">
                  전화번호 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                  disabled={isLoading}
                />
                {errors.customerPhone && (
                  <p className="text-sm text-red-500">{errors.customerPhone}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerEmail">
                이메일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.customerEmail && (
                <p className="text-sm text-red-500">{errors.customerEmail}</p>
              )}
            </div>
          </div>

          {/* 예약 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">예약 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participants">
                  참가 인원 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="participants"
                  name="participants"
                  type="number"
                  min="1"
                  value={formData.participants}
                  onChange={handleParticipantsChange}
                  disabled={isLoading}
                />
                {errors.participants && (
                  <p className="text-sm text-red-500">{errors.participants}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">예약 상태</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(bookingStatusInfo).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialRequests">요청사항</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="고객의 요청사항을 입력해주세요"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminNotes">관리자 메모</Label>
              <Textarea
                id="adminNotes"
                name="adminNotes"
                value={formData.adminNotes}
                onChange={handleChange}
                placeholder="내부 관리용 메모를 입력해주세요"
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {booking ? '수정 완료' : '예약 등록'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 