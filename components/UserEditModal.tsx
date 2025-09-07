'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

interface UserData {
  id: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  birthDate: string;
  mileage: number;
  role: string;
  status: string;
}

export default function UserEditModal({ isOpen, onClose, userId, onSuccess }: UserEditModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: '',
    nickname: '',
    email: '',
    phone: '',
    birthDate: '',
    mileage: 0,
    role: '',
    status: ''
  });

  // 사용자 정보 로드
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserData();
    }
  }, [isOpen, userId]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "인증 오류",
          description: "로그인이 필요합니다.",
          variant: "destructive",
        });
        return;
      }

      console.log('토큰 확인:', token.substring(0, 20) + '...');

      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('응답 상태:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API 오류:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
      }

      const data = await response.json();
      console.log('응답 데이터:', data);
      
      if (data.success) {
        setUserData(data.user);
      } else {
        toast({
          title: "조회 실패",
          description: data.error || "사용자 정보를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "사용자 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "인증 오류",
          description: "로그인이 필요합니다.",
          variant: "destructive",
        });
        return;
      }

      console.log('수정 요청 데이터:', {
        name: userData.name,
        nickname: userData.nickname,
        email: userData.email,
        phone: userData.phone,
        birthDate: userData.birthDate,
        mileage: userData.mileage,
      });

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userData.name,
          nickname: userData.nickname,
          email: userData.email,
          phone: userData.phone,
          birthDate: userData.birthDate ? userData.birthDate.split('T')[0] : null,
          mileage: userData.mileage,
        }),
      });

      console.log('수정 응답 상태:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('수정 API 오류:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
      }

      const data = await response.json();
      console.log('수정 응답 데이터:', data);

      if (data.success) {
        toast({
          title: "수정 완료",
          description: "사용자 정보가 성공적으로 수정되었습니다.",
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "수정 실패",
          description: data.error || "사용자 정보 수정에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('사용자 정보 수정 오류:', error);
      toast({
        title: "오류",
        description: "사용자 정보 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string | number) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">사용자 정보 수정</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                type="text"
                required
                value={userData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임 *</Label>
              <Input
                id="nickname"
                type="text"
                required
                value={userData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                placeholder="닉네임을 입력하세요"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일 *</Label>
            <Input
              id="email"
              type="email"
              required
              value={userData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              type="tel"
              value={userData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="010-1234-5678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">생년월일</Label>
            <Input
              id="birthDate"
              type="date"
              value={userData.birthDate ? userData.birthDate.split('T')[0] : ''}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mileage">마일리지</Label>
            <Input
              id="mileage"
              type="number"
              min="0"
              value={userData.mileage}
              onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
              placeholder="마일리지를 입력하세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">권한</Label>
              <Input
                id="role"
                type="text"
                value={userData.role}
                disabled
                className="bg-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">상태</Label>
              <Input
                id="status"
                type="text"
                value={userData.status}
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "수정 중..." : "수정"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
