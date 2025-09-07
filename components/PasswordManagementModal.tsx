'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface PasswordManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onSuccess?: () => void;
}

interface PasswordInfo {
  original: string;
  createdAt: string;
}

interface UserInfo {
  id: string;
  username: string;
  email: string;
  name: string;
}

export default function PasswordManagementModal({ 
  isOpen, 
  onClose, 
  userId, 
  userName,
  onSuccess 
}: PasswordManagementModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // 비밀번호 정보 로드
  useEffect(() => {
    if (isOpen && userId) {
      fetchPasswordInfo();
    }
  }, [isOpen, userId]);

  const fetchPasswordInfo = async () => {
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

      const response = await fetch(`/api/admin/users/${userId}/password`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setPasswordInfo(data.password);
        setUserInfo(data.user);
      } else {
        toast({
          title: "조회 실패",
          description: data.error || "비밀번호 정보를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('비밀번호 정보 조회 오류:', error);
      toast({
        title: "오류",
        description: "비밀번호 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "입력 오류",
        description: "새 비밀번호와 확인 비밀번호를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "비밀번호 길이 오류",
        description: "비밀번호는 최소 6자 이상이어야 합니다.",
        variant: "destructive",
      });
      return;
    }

    // 최종 확인
    if (!confirm(`${userName}님의 비밀번호를 변경하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPassword: newPassword
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "비밀번호 변경 완료",
          description: "비밀번호가 성공적으로 변경되었습니다.",
        });
        
        // 폼 초기화
        setNewPassword('');
        setConfirmPassword('');
        
        // 최신 정보 다시 로드
        await fetchPasswordInfo();
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: "비밀번호 변경 실패",
          description: data.error || "비밀번호 변경에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      toast({
        title: "오류",
        description: "비밀번호 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPasswordInfo(null);
    setUserInfo(null);
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswords(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            비밀번호 관리 - {userName}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">현재 비밀번호</TabsTrigger>
            <TabsTrigger value="edit">비밀번호 변경</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="space-y-4">
            {userInfo && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">사용자 정보</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">아이디:</span> {userInfo.username}</p>
                    <p><span className="font-medium">이메일:</span> {userInfo.email}</p>
                    <p><span className="font-medium">이름:</span> {userInfo.name}</p>
                  </div>
                </div>
                
                {passwordInfo && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">현재 비밀번호</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? '숨기기' : '보기'}
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">비밀번호:</span> 
                        <span className="ml-2 font-mono bg-white px-2 py-1 rounded">
                          {showPasswords ? passwordInfo.original : '••••••••'}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">등록일:</span> 
                        {new Date(passwordInfo.createdAt).toLocaleString('ko-KR')}
                      </p>
                    </div>
                    
                    <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded text-sm">
                      <p className="text-yellow-800">
                        ⚠️ <strong>보안 주의:</strong> 이 정보는 매우 중요합니다. 절대 외부에 유출하지 마세요.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="edit" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  <strong>⚠️ 주의:</strong> 비밀번호를 변경하면 해당 사용자는 새 비밀번호로만 로그인할 수 있습니다.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">새 비밀번호 *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요 (최소 6자)"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">새 비밀번호 확인 *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  disabled={isLoading}
                />
              </div>
              
              {newPassword && confirmPassword && (
                <div className={`text-sm p-2 rounded ${
                  newPassword === confirmPassword ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {newPassword === confirmPassword ? '✓ 비밀번호가 일치합니다' : '✗ 비밀번호가 일치하지 않습니다'}
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  취소
                </Button>
                <Button
                  onClick={handlePasswordUpdate}
                  disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? '변경 중...' : '비밀번호 변경'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
