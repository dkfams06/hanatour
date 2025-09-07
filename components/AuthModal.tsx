'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import TermsAgreementModal from './TermsAgreementModal';
import RegistrationSuccessModal from './RegistrationSuccessModal';

// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}



interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  
  // 아이디 저장/자동로그인 상태 추가
  const [rememberId, setRememberId] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  
  // 1. 닉네임 입력란 추가 (상태)
  const [registerData, setRegisterData] = useState({
    username: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    birthDate: ''
  });

  // 닉네임 중복 확인 상태 추가
  const [nicknameCheck, setNicknameCheck] = useState({
    checked: false,
    available: false,
    message: ''
  });



  // 카카오 SDK 로드 및 초기화
  useEffect(() => {
    const loadKakaoSDK = () => {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init('e47ec4337a712bc26566dc7ebfc4ee60');
          console.log('카카오 SDK 초기화 완료');
        }
      } else {
        const script = document.createElement('script');
        script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
        script.async = true;
        script.onload = () => {
          if (window.Kakao) {
            window.Kakao.init('e47ec4337a712bc26566dc7ebfc4ee60');
            console.log('카카오 SDK 로드 및 초기화 완료');
          }
        };
        document.head.appendChild(script);
      }
    };

    loadKakaoSDK();
  }, []);

  // 컴포넌트 마운트 시 저장된 로그인 정보 불러오기
  useEffect(() => {
    if (isOpen) {
      const savedId = localStorage.getItem('rememberedId');
      const savedAutoLogin = localStorage.getItem('autoLogin') === 'true';
      
      if (savedId) {
        setLoginData(prev => ({ ...prev, username: savedId }));
        setRememberId(true);
      }
      
      if (savedAutoLogin) {
        setAutoLogin(true);
        // 자동로그인이 활성화되어 있으면 자동으로 로그인 시도
        const savedPassword = localStorage.getItem('autoLoginPassword');
        if (savedPassword && savedId) {
          try {
            const decryptedPassword = decryptPassword(savedPassword);
            setLoginData(prev => ({ ...prev, password: decryptedPassword }));
            // 자동로그인 시도
            handleAutoLogin(savedId, decryptedPassword);
          } catch (error) {
            // 암호화된 비밀번호 복호화 실패 시 저장된 정보 삭제
            localStorage.removeItem('autoLogin');
            localStorage.removeItem('autoLoginPassword');
            setAutoLogin(false);
          }
        }
      }
    }
  }, [isOpen]);

  // 자동로그인 처리 함수
  const handleAutoLogin = async (username: string, password: string) => {
    setIsLoading(true);
    
    const result = await login(username, password);
    if (result.success) {
      toast({
        title: "자동 로그인 성공",
        description: "환영합니다!",
      });
      onClose();
    } else {
      // 자동로그인 실패 시 저장된 정보 삭제
      localStorage.removeItem('autoLogin');
      localStorage.removeItem('autoLoginPassword');
      setAutoLogin(false);
      setLoginData(prev => ({ ...prev, password: '' }));
      
      toast({
        title: "자동 로그인 실패",
        description: "저장된 로그인 정보가 만료되었습니다. 다시 로그인해주세요.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  // 자동로그인 체크박스 변경 시 아이디 저장도 자동으로 활성화
  const handleAutoLoginChange = (checked: boolean) => {
    setAutoLogin(checked);
    if (checked) {
      setRememberId(true); // 자동로그인 활성화 시 아이디 저장도 자동으로 활성화
    }
  };

  // 간단한 암호화/복호화 함수 (실제 프로덕션에서는 더 강력한 암호화 사용 권장)
  const encryptPassword = (password: string): string => {
    return btoa(password); // Base64 인코딩 (간단한 예시)
  };

  const decryptPassword = (encryptedPassword: string): string => {
    return atob(encryptedPassword); // Base64 디코딩
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(loginData.username, loginData.password);
    if (result.success) {
      // 아이디 저장 처리
      if (rememberId) {
        localStorage.setItem('rememberedId', loginData.username);
      } else {
        localStorage.removeItem('rememberedId');
      }
      
      // 자동로그인 처리
      if (autoLogin) {
        localStorage.setItem('autoLogin', 'true');
        const encryptedPassword = encryptPassword(loginData.password);
        localStorage.setItem('autoLoginPassword', encryptedPassword);
      } else {
        localStorage.removeItem('autoLogin');
        localStorage.removeItem('autoLoginPassword');
      }
      
      toast({
        title: "로그인 성공",
        description: result.message || "환영합니다!",
      });
      onClose();
    } else {
      toast({
        title: "로그인 실패",
        description: result.message || "아이디 또는 비밀번호를 확인해주세요.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    // 닉네임 중복 확인 체크
    if (!nicknameCheck.checked || !nicknameCheck.available) {
      toast({
        title: "닉네임 확인 필요",
        description: "닉네임 중복 확인을 완료해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    // 약관 동의 모달 표시
    setShowTermsModal(true);
  };

  const handleTermsAgree = async () => {
    setIsLoading(true);
    
    const result = await register(
      registerData.username,
      registerData.nickname,
      registerData.email,
      registerData.password,
      registerData.name,
      registerData.phone,
      registerData.birthDate
    );
    
    if (result.success) {
      // 성공 모달 표시
      setShowSuccessModal(true);
      // 폼 데이터 초기화
      setRegisterData({
        username: '',
        nickname: '',
        email: '', 
        password: '', 
        confirmPassword: '', 
        name: '',
        phone: '',
        birthDate: ''
      });
      // 닉네임 중복 확인 상태도 초기화
      setNicknameCheck({
        checked: false,
        available: false,
        message: ''
      });
    } else {
      toast({
        title: "회원가입 실패",
        description: result.message || "회원가입 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };



  // 전화번호 자동 포맷팅 함수 추가
  const formatPhoneNumber = (phone: string) => {
    // 숫자만 추출
    const numbers = phone.replace(/[^0-9]/g, '');
    
    // 길이에 따라 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setRegisterData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  // 닉네임 중복 확인 함수
  const checkNickname = async () => {
    if (!registerData.nickname.trim()) {
      toast({
        title: "닉네임 입력 필요",
        description: "닉네임을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/check-nickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: registerData.nickname.trim() }),
      });

      const data = await response.json();
      console.log('닉네임 확인 응답:', data);

      if (response.ok) {
        setNicknameCheck({
          checked: true,
          available: data.available,
          message: data.message
        });

        toast({
          title: data.available ? "✅ 사용 가능" : "❌ 사용 불가",
          description: data.available 
            ? `"${registerData.nickname.trim()}" ${data.message}` 
            : `"${registerData.nickname.trim()}" ${data.message}`,
          variant: data.available ? "default" : "destructive",
        });
      } else {
        toast({
          title: "확인 실패",
          description: data.error || "닉네임 확인 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('닉네임 확인 오류:', error);
      toast({
        title: "확인 실패",
        description: "서버 연결 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 카카오 로그인 처리 함수
  const handleKakaoLogin = async () => {
    try {
      console.log('카카오 로그인 시작');
      
      if (!window.Kakao) {
        console.error('Kakao SDK가 로드되지 않았습니다.');
        toast({
          title: "카카오 SDK 오류",
          description: "카카오 SDK가 로드되지 않았습니다. 페이지를 새로고침해주세요.",
          variant: "destructive",
        });
        return;
      }

      if (!window.Kakao.isInitialized()) {
        console.error('Kakao SDK가 초기화되지 않았습니다.');
        toast({
          title: "카카오 SDK 오류", 
          description: "카카오 SDK가 초기화되지 않았습니다. 페이지를 새로고침해주세요.",
          variant: "destructive",
        });
        return;
      }

      console.log('카카오 SDK 준비 완료, 로그인 요청 시작');

      // 기존 카카오 세션이 있다면 로그아웃 후 새로 로그인
      try {
        if (window.Kakao.Auth.getAccessToken()) {
          console.log('기존 카카오 세션 발견, 로그아웃 후 재로그인');
          await new Promise<void>((resolve) => {
            window.Kakao.Auth.logout(() => {
              console.log('기존 카카오 세션 로그아웃 완료');
              resolve();
            });
          });
        }
      } catch (error) {
        console.log('기존 카카오 세션 정리 중 오류 (무시됨):', error);
      }

      // 카카오 로그인 요청 (이메일 스코프 제거)
      window.Kakao.Auth.login({
        scope: 'profile_nickname', // 이메일 제외, 닉네임만 요청
        success: async (response: any) => {
          console.log('카카오 로그인 성공:', response);
          console.log('액세스 토큰:', response.access_token);
          
          try {
            console.log('백엔드 API 호출 시작');
            
            // 백엔드 API 호출
            const apiResponse = await fetch('/api/auth/kakao', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                accessToken: response.access_token,
              }),
            });

            console.log('API 응답 상태:', apiResponse.status);
            console.log('API 응답 상태 텍스트:', apiResponse.statusText);

            const data = await apiResponse.json();
            console.log('API 응답 데이터:', data);

            if (data.success) {
              console.log('로그인 성공, 토큰 저장 중');
              
              // 로그인 성공 처리
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              
              toast({
                title: "카카오 로그인 성공",
                description: data.message || "환영합니다!",
              });
              
              console.log('로그인 완료, 모달 닫기');
              onClose();
              
              // 페이지 새로고침 대신 상태 업데이트
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              console.error('로그인 실패:', data.error);
              toast({
                title: "로그인 실패",
                description: data.error || "카카오 로그인에 실패했습니다.",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error('카카오 로그인 API 오류:', error);
            toast({
              title: "로그인 실패",
              description: "서버 연결 오류가 발생했습니다.",
              variant: "destructive",
            });
          }
        },
        fail: (error: any) => {
          console.error('카카오 로그인 실패:', error);
          toast({
            title: "카카오 로그인 실패",
            description: "카카오 로그인을 취소하거나 오류가 발생했습니다.",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error('카카오 로그인 처리 오류:', error);
      toast({
        title: "로그인 오류",
        description: "카카오 로그인 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 닉네임 변경 시 중복 확인 상태 초기화
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData(prev => ({ ...prev, nickname: e.target.value }));
    // 닉네임이 변경되면 중복 확인 상태 초기화
    setNicknameCheck({
      checked: false,
      available: false,
      message: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Welcome to Hana-Tour</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t('nav.login')}</TabsTrigger>
            <TabsTrigger value="register">{t('nav.signup')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  placeholder="아이디를 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              
              {/* 아이디 저장/자동로그인 체크박스 */}
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-id"
                    checked={rememberId}
                    onCheckedChange={(checked) => setRememberId(!!checked)}
                  />
                  <Label htmlFor="remember-id" className="text-sm font-normal cursor-pointer">
                    아이디 저장
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto-login"
                    checked={autoLogin}
                    onCheckedChange={(checked) => handleAutoLoginChange(!!checked)}
                  />
                  <Label htmlFor="auto-login" className="text-sm font-normal cursor-pointer">
                    자동 로그인
                  </Label>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <div className="loading-spinner" /> : t('nav.login')}
              </Button>
            </form>
            
            {/* 구분선 */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-sm text-gray-500">또는</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            
            {/* 카카오 로그인 버튼 */}
            <Button 
              type="button" 
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
              onClick={handleKakaoLogin}
            >
              <svg 
                className="w-5 h-5 mr-2" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 5.58 2 10c0 2.89 1.95 5.41 4.82 6.7l-.97 3.58a.5.5 0 0 0 .8.6L10.8 17c.39.05.79.08 1.2.08 5.52 0 10-3.58 10-8S17.52 2 12 2z"/>
              </svg>
              카카오로 로그인
            </Button>
            
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-username">아이디 *</Label>
                <Input
                  id="register-username"
                  type="text"
                  required
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  placeholder="아이디를 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-nickname">닉네임 *</Label>
                <div className="flex gap-2">
                  <Input
                    id="register-nickname"
                    type="text"
                    required
                    value={registerData.nickname}
                    onChange={handleNicknameChange}
                    placeholder="닉네임을 입력하세요"
                    className={`flex-1 ${
                      nicknameCheck.checked 
                        ? nicknameCheck.available 
                          ? 'border-green-500 focus:border-green-500' 
                          : 'border-red-500 focus:border-red-500'
                        : ''
                    }`}
                  />
                  <Button 
                    type="button" 
                    onClick={checkNickname}
                    variant="outline"
                    className="whitespace-nowrap"
                    disabled={!registerData.nickname.trim()}
                  >
                    중복확인
                  </Button>
                </div>
                {nicknameCheck.checked && (
                  <div className={`text-xs p-2 rounded ${
                    nicknameCheck.available 
                      ? 'bg-green-50 text-green-600 border border-green-200' 
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-1">
                      <span>{nicknameCheck.available ? '✅' : '❌'}</span>
                      <span className="font-medium">"{registerData.nickname.trim()}"</span>
                      <span>{nicknameCheck.message}</span>
                    </div>
                  </div>
                )}
                {!nicknameCheck.checked && registerData.nickname.trim() && (
                  <p className="text-xs text-gray-500">
                    닉네임 중복 확인을 해주세요.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-name">이름 *</Label>
                <Input
                  id="register-name"
                  type="text"
                  required
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">이메일 *</Label>
                <Input
                  id="register-email"
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  placeholder="이메일을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호 *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={registerData.phone}
                  onChange={handlePhoneChange}
                  placeholder="010-1234-5678"
                  maxLength={13}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">생년월일 *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  required
                  value={registerData.birthDate}
                  onChange={(e) => setRegisterData({ ...registerData, birthDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">비밀번호 *</Label>
                <Input
                  id="register-password"
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">비밀번호 확인 *</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <div className="loading-spinner" /> : "다음 (약관 동의)"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
      
      {/* 약관 동의 모달 */}
      <TermsAgreementModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAgree={handleTermsAgree}
        isLoading={isLoading}
      />
      
      {/* 회원가입 성공 모달 */}
      <RegistrationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
        userEmail={registerData.email}
      />
    </Dialog>
  );
}