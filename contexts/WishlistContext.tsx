'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: string;
  tourId: string;
  tourTitle: string;
  mainImage: string;
  price: number;
  departureDate: string;
  region: string;
  createdAt: string;
  addedAt: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => Promise<boolean>;
  removeFromWishlist: (tourId: string) => Promise<void>;
  isInWishlist: (tourId: string) => boolean;
  clearWishlist: () => Promise<void>;
  wishlistCount: number;
  isLoading: boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

interface WishlistProviderProps {
  children: React.ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // 사용자 로그인 상태에 따라 wishlist 로드
  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      // 로그아웃 시 wishlist 초기화
      setWishlist([]);
    }
  }, [user]);

  // 데이터베이스에서 wishlist 로드
  const loadWishlist = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const formattedWishlist = data.wishlist.map((item: any) => ({
            ...item,
            addedAt: item.createdAt
          }));
          setWishlist(formattedWishlist);
        }
      }
    } catch (error) {
      console.error('Wishlist 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 찜하기 추가
  const addToWishlist = async (item: Omit<WishlistItem, 'id' | 'addedAt'>): Promise<boolean> => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "찜하기 기능을 사용하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return false;
    }

    // 이미 찜한 상품인지 확인
    if (wishlist.some(w => w.tourId === item.tourId)) {
      toast({
        title: "이미 찜한 상품",
        description: "이미 찜한 상품입니다.",
        variant: "destructive",
      });
      return false;
    }

    // 찜하기 개수 제한 (30개)
    if (wishlist.length >= 30) {
      toast({
        title: "찜하기 제한",
        description: "찜하기는 최대 30개까지 가능합니다.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tourId: item.tourId }),
      });

      const data = await response.json();
      
      if (data.success) {
        const newItem: WishlistItem = {
          ...item,
          id: data.wishlistId,
          addedAt: new Date().toISOString()
        };
        setWishlist(prev => [...prev, newItem]);
        
        toast({
          title: "찜하기 추가",
          description: "찜하기가 추가되었습니다.",
        });
        return true;
      } else {
        toast({
          title: "찜하기 실패",
          description: data.error || "찜하기 추가에 실패했습니다.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('찜하기 추가 오류:', error);
      toast({
        title: "오류",
        description: "찜하기 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return false;
    }
  };

  // 찜하기 삭제
  const removeFromWishlist = async (tourId: string) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/wishlist?tourId=${tourId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWishlist(prev => prev.filter(item => item.tourId !== tourId));
        toast({
          title: "찜하기 삭제",
          description: "찜하기가 삭제되었습니다.",
        });
      }
    } catch (error) {
      console.error('찜하기 삭제 오류:', error);
      toast({
        title: "오류",
        description: "찜하기 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 찜하기 여부 확인
  const isInWishlist = (tourId: string): boolean => {
    return wishlist.some(item => item.tourId === tourId);
  };

  // 찜하기 전체 삭제
  const clearWishlist = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // 각 찜하기 항목을 개별적으로 삭제
      const deletePromises = wishlist.map(item => 
        fetch(`/api/wishlist?tourId=${item.tourId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      );

      await Promise.all(deletePromises);
      setWishlist([]);
      
      toast({
        title: "찜하기 전체 삭제",
        description: "모든 찜하기가 삭제되었습니다.",
      });
    } catch (error) {
      console.error('찜하기 전체 삭제 오류:', error);
      toast({
        title: "오류",
        description: "찜하기 전체 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // wishlist 새로고침
  const refreshWishlist = async () => {
    await loadWishlist();
  };

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlist.length,
    isLoading,
    refreshWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist는 WishlistProvider 내부에서 사용해야 합니다');
  }
  return context;
} 