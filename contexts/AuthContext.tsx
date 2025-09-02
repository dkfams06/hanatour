'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, nickname: string, email: string, password: string, name: string, phone?: string, birthDate?: string, address?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    if (token) {
      // JWT 토큰 검증
      fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // 디버깅: 토큰 검증 응답 데이터 출력
            console.log('토큰 검증 응답 데이터:', data);
            console.log('마일리지 정보:', data.user.mileage);
            
            const userData = {
              id: data.user.id,
              username: data.user.username,
              nickname: data.user.nickname,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              mileage: data.user.mileage || 0,
              avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
            };
      setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            // 토큰이 유효하지 않으면 로그아웃
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        })
        .catch(() => {
          // 에러 발생 시 로그아웃
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
    setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        // 디버깅: 로그인 응답 데이터 출력
        console.log('로그인 응답 데이터:', data);
        console.log('마일리지 정보:', data.user.mileage);
        
        const userData = {
          id: data.user.id,
          username: data.user.username,
          nickname: data.user.nickname,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          mileage: data.user.mileage || 0,
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
        };
      
        localStorage.setItem('token', data.token); // JWT 토큰 저장
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, message: data.message };
      }
      
      return { success: false, message: data.error || '로그인에 실패했습니다.' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: '로그인 처리 중 오류가 발생했습니다.' };
    }
  };

  const register = async (username: string, nickname: string, email: string, password: string, name: string, phone?: string, birthDate?: string, address?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, nickname, email, password, name, phone, birthDate, address }),
      });

      const data = await response.json();
      
      return {
        success: data.success,
        message: data.message || data.error
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: '회원가입 처리 중 오류가 발생했습니다.'
      };
    }
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        const userData = {
          id: data.user.id,
          username: data.user.username,
          nickname: data.user.nickname,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          mileage: data.user.mileage || 0,
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
        };
        
        // 마일리지만 변경된 경우에만 상태 업데이트
        if (!user || user.mileage !== userData.mileage) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('사용자 정보 새로고침 오류:', error);
    }
  };

  const logout = async () => {
    try {
      // 로그아웃 로그 기록
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout log error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 자동로그인 정보도 함께 삭제 (보안상 로그아웃 시 자동로그인 해제)
      localStorage.removeItem('autoLogin');
      localStorage.removeItem('autoLoginPassword');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}