'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'addedAt' | 'totalAmount'>) => Promise<boolean>;
  removeFromCart: (cartId: string) => Promise<void>;
  updateCartItem: (cartId: string, updates: Partial<CartItem>) => Promise<void>;
  isInCart: (tourId: string) => boolean;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);



  // 장바구니 데이터 새로고침
  const refreshCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // API 응답을 CartItem 형태로 변환
          const cartItems: CartItem[] = data.data.map((item: any) => ({
            id: item.id,
            tourId: item.tourId,
            title: item.tourTitle,
            mainImage: item.mainImage,
            price: item.price,
            departureDate: item.departureDate,
            participants: item.participants,
            customerName: item.customerName,
            customerPhone: item.customerPhone,
            customerEmail: item.customerEmail,
            specialRequests: item.specialRequests,
            totalAmount: item.totalAmount,
            addedAt: item.createdAt
          }));
          setCart(cartItems);
        }
      }
    } catch (error) {
      console.error('장바구니 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 및 사용자 변경 시 장바구니 로드
  useEffect(() => {
    const initializeCart = async () => {
      await refreshCart();
      
      // 로그인 사용자이고 로컬스토리지에 기존 장바구니가 있는 경우 마이그레이션
      if (user && localStorage.getItem('cart')) {
        await migrateLocalStorageCart();
        await refreshCart(); // 마이그레이션 후 다시 새로고침
      }
    };
    
    initializeCart();
  }, [user]);

  const addToCart = async (item: Omit<CartItem, 'id' | 'addedAt' | 'totalAmount'>): Promise<boolean> => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          tourId: item.tourId,
          title: item.title,
          mainImage: item.mainImage,
          price: item.price,
          departureDate: item.departureDate,
          participants: item.participants,
          customerName: item.customerName,
          customerPhone: item.customerPhone,
          customerEmail: item.customerEmail,
          specialRequests: item.specialRequests
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await refreshCart(); // 장바구니 새로고침
        return true;
      } else {
        console.error('장바구니 추가 실패:', data.error);
        return false;
      }
    } catch (error) {
      console.error('장바구니 추가 에러:', error);
      return false;
    }
  };

  // 로컬스토리지에서 DB로 마이그레이션
  const migrateLocalStorageCart = async () => {
    try {
      const localCart = localStorage.getItem('cart');
      if (!localCart) return;

      const parsedCart = JSON.parse(localCart);
      if (!Array.isArray(parsedCart) || parsedCart.length === 0) return;

      console.log('로컬스토리지 장바구니 마이그레이션 시작:', parsedCart.length, '개 아이템');

      // 각 아이템을 DB에 추가
      for (const item of parsedCart) {
        await addToCart({
          tourId: item.tourId,
          title: item.title,
          mainImage: item.mainImage,
          price: item.price,
          departureDate: item.departureDate,
          participants: item.participants,
          customerName: item.customerName,
          customerPhone: item.customerPhone,
          customerEmail: item.customerEmail,
          specialRequests: item.specialRequests
        });
      }

      // 마이그레이션 완료 후 로컬스토리지 정리
      localStorage.removeItem('cart');
      console.log('로컬스토리지 장바구니 마이그레이션 완료');

    } catch (error) {
      console.error('장바구니 마이그레이션 실패:', error);
    }
  };

  const removeFromCart = async (cartId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/cart/${cartId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await refreshCart(); // 장바구니 새로고침
      }
    } catch (error) {
      console.error('장바구니 삭제 에러:', error);
    }
  };

  const updateCartItem = async (cartId: string, updates: Partial<CartItem>): Promise<void> => {
    try {
      const response = await fetch(`/api/cart/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await refreshCart(); // 장바구니 새로고침
      }
    } catch (error) {
      console.error('장바구니 수정 에러:', error);
    }
  };

  const isInCart = (tourId: string): boolean => {
    return cart.some(item => item.tourId === tourId);
  };

  const clearCart = async (): Promise<void> => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setCart([]);
      }
    } catch (error) {
      console.error('장바구니 비우기 에러:', error);
    }
  };

  // 총 금액 계산
  const cartTotal = cart.reduce((total, item) => total + item.totalAmount, 0);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    isInCart,
    clearCart,
    refreshCart,
    cartCount: cart.length,
    cartTotal,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}