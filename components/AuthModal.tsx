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

// 타입스크립트 전역 선언 (파일 상단 또는 컴포넌트 상단)
declare global {
  interface Window {
    daum: any;
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
    birthDate: '',
    address: ''
  });

  // 컴포넌트 내부 useEffect로 다음 주소 API 스크립트 동적 로드
  useEffect(() => {
    if (!window.daum) {
      const script = document.createElement('script');
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      document.body.appendChild(script);
    }
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
      registerData.birthDate,
      registerData.address
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
        birthDate: '',
        address: ''
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

  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function(data: any) {
          setRegisterData(prev => ({
            ...prev,
            address: data.address
          }));
        }
      }).open();
    } else {
      alert('주소 검색 스크립트가 아직 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.');
    }
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
                <Input
                  id="register-nickname"
                  type="text"
                  required
                  value={registerData.nickname}
                  onChange={(e) => setRegisterData({ ...registerData, nickname: e.target.value })}
                  placeholder="닉네임을 입력하세요"
                />
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
              <div className="space-y-2">
                <Label htmlFor="register-address">주소 *</Label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Input
                    id="register-address"
                    type="text"
                    required
                    value={registerData.address}
                    readOnly
                    placeholder="주소를 선택하세요"
                  />
                  <Button type="button" onClick={handleAddressSearch}>
                    주소 찾기
                  </Button>
                </div>
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