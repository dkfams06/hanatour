'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Search, User, Heart, ShoppingBag, ShoppingCart, Menu, X, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthModal from '@/components/AuthModal';

interface MenuCategory {
  id: string;
  name: string;
  parent_id: string | null;
  menu_order: number;
  menu_level: 'main' | 'sub';
  menu_color: string;
  menu_icon: string;
  menu_type: 'destination' | 'product' | 'theme';
  href_path: string;
  description: string;
  tour_count: number;
  children?: MenuCategory[];
}

interface NavigationItem {
  id: string;
  name: string;
  href: string;
  color?: string;
  subItems: {
    name: string;
    href: string;
  }[];
}

export default function Header() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const { settings, isLoading } = useSiteSettings();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 동적 메뉴 상태
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  // 메뉴 데이터 로딩
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        console.log('메뉴 데이터 로딩 시작...');
        const response = await fetch('/api/menu');
        console.log('API 응답 상태:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('메뉴 데이터:', data);
        
        if (data.success && data.data) {
          setMenuCategories(data.data);
          const navItems = transformMenuToNavigation(data.data);
          console.log('변환된 네비게이션 아이템:', navItems);
          setNavigationItems(navItems);
          
          // 만약 변환된 아이템이 없다면 임시 메뉴 설정
          if (navItems.length === 0) {
            console.warn('변환된 메뉴가 없어 임시 메뉴를 설정합니다.');
            setNavigationItems([
              {
                id: 'temp-1',
                name: '미국여행',
                href: '/tours/region/usa-menu',
                color: '#3B82F6',
                subItems: [
                  { name: '동부', href: '/tours/region/usa-east' },
                  { name: '서부', href: '/tours/region/usa-west' }
                ]
              },
              {
                id: 'temp-2',
                name: '아시아/동남아',
                href: '/tours/region/asia-menu',
                color: '#EF4444',
                subItems: [
                  { name: '일본', href: '/tours/region/japan' },
                  { name: '중국', href: '/tours/region/china' }
                ]
              }
            ]);
          }
        } else {
          console.warn('메뉴 데이터가 비어있거나 잘못된 형식입니다:', data);
          setNavigationItems([]);
        }
      } catch (error) {
        console.error('메뉴 데이터 로딩 실패:', error);
        // 에러 시 기본 네비게이션 유지
        setNavigationItems([]);
      } finally {
        setIsLoadingMenu(false);
        console.log('메뉴 로딩 완료');
      }
    };

    fetchMenuData();
  }, []);

    // 메뉴 데이터를 네비게이션 구조로 변환
  const transformMenuToNavigation = (menuCategories: MenuCategory[]): NavigationItem[] => {
    console.log('변환할 menuCategories 데이터:', menuCategories);
    const navigation: NavigationItem[] = [];
    
    menuCategories.forEach(menu => {
      console.log(`메뉴 처리 중: ${menu.name}, menu_level: ${menu.menu_level}, menu_type: ${menu.menu_type}`);
      
      // 메인 메뉴만 처리
      if (menu.menu_level === 'main' || menu.parent_id === null) {
        console.log(`메인 메뉴 항목 발견: ${menu.name}`);
        
        const navigationItem: NavigationItem = {
          id: menu.id,
          name: menu.name,
          href: menu.href_path || `/tours/${menu.menu_type}/${menu.id}`,
          color: menu.menu_color,
          subItems: []
        };

        // 하위 메뉴들을 서브 아이템으로 추가
        if (menu.children && menu.children.length > 0) {
          console.log(`${menu.name}의 하위 항목 ${menu.children.length}개 처리 중`);
          navigationItem.subItems = menu.children
            .filter((child: MenuCategory) => child.menu_level === 'sub') // 서브 메뉴만
            .map((child: MenuCategory) => {
              console.log(`하위 항목: ${child.name}`);
              return {
                name: child.name,
                href: child.href_path || `/tours/${child.menu_type}/${child.id}`
              };
            });
        }

        navigation.push(navigationItem);
        console.log(`네비게이션 항목 추가됨: ${navigationItem.name}`);
      }
    });

    // menu_order로 정렬
    navigation.sort((a, b) => {
      const menuA = menuCategories.find(m => m.id === a.id);
      const menuB = menuCategories.find(m => m.id === b.id);
      return (menuA?.menu_order || 0) - (menuB?.menu_order || 0);
    });

    console.log('최종 네비게이션 배열:', navigation);
    return navigation;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  // 서브메뉴 호버 이벤트 핸들러
  const handleMenuEnter = (menuId: string) => {
    // 이전 타이머가 있다면 취소
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveSubmenu(menuId);
  };

  const handleMenuLeave = () => {
    // 300ms 후에 메뉴를 숨김
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 300);
  };

  const handleSubmenuEnter = () => {
    // 서브메뉴에 마우스가 들어오면 타이머 취소
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleSubmenuLeave = () => {
    // 서브메뉴에서 마우스가 나가면 즉시 숨김
    setActiveSubmenu(null);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar: 모바일에서는 숨김 */}
      <div className="bg-white border-b border-gray-100 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div></div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Link href="/customer" className="hover:text-blue-600 transition-colors">고객센터</Link>
              <Link href="/notice" className="hover:text-blue-600 transition-colors">공지사항</Link>
              <Link href="/calendar" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                캘린더
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    안녕하세요, <span className="font-semibold text-blue-600">{user.nickname || user.name}</span>님
                  </span>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="hover:text-blue-600 transition-colors">관리자패널</Link>
                  )}
                  <button onClick={logout} className="hover:text-blue-600 transition-colors">로그아웃</button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-blue-600 transition-colors">{t('nav.login')}</button>
                  <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-blue-600 transition-colors">{t('nav.signup')}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          {/* 모바일: flex-col, 데스크탑: flex-row */}
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-20 py-2 sm:py-0 gap-2 sm:gap-0 w-full">
            {/* Logo: 동적 로고 사용 */}
            <Link href="/" className="flex items-center mb-2 sm:mb-0 flex-shrink-0">
              <div className="flex items-center">
                {!isLoading && settings.site_logo ? (
                  <img 
                    src={settings.site_logo} 
                    alt={settings.site_title || 'Hana-Tour'} 
                    style={{ height: `${parseInt(settings.logo_size || '40')}px` }}
                    className="w-auto object-contain"
                  />
                ) : (
                  !isLoading && (
                    <img 
                      src={settings.site_logo || '/images/default-logo.svg'} 
                      alt={settings.site_title || 'Hana-Tour'} 
                      style={{ height: `${parseInt(settings.logo_size || '40')}px` }}
                      className="w-auto object-contain"
                    />
                  )
                )}
              </div>
            </Link>

            {/* 데스크탑: 검색창 */}
            <div className="hidden sm:block flex-1 w-full max-w-md mx-0 sm:mx-8 order-3 sm:order-none">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="그랜드캐년"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-4 pr-12 py-3 w-full text-base border border-gray-300 rounded-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
                  />
                  <Button 
                    type="submit"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-600 hover:bg-gray-700 rounded-full w-8 h-8 p-0"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>

            {/* 모바일: 검색, 캘린더, 하트 아이콘을 한 줄에 정렬 */}
            <div className={`flex ${user ? 'justify-between' : 'justify-center'} w-full sm:w-auto sm:flex sm:items-center sm:space-x-6 order-2 sm:order-none px-2 sm:px-0`}>
              {/* 모바일 검색 아이콘 */}
              <button 
                className="block sm:hidden flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors justify-center py-2 min-w-0 flex-1"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs hidden sm:block">검색</span>
              </button>
              {user && (
                <Link href="/mypage" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors justify-center py-2 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs hidden sm:block">마이메뉴</span>
                </Link>
              )}
              {user && (
                <Link href="/transactions" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors justify-center py-2 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                    <span className="text-base sm:text-lg font-bold leading-none">₩</span>
                  </div>
                  <span className="text-xs hidden sm:block">입출금</span>
                </Link>
              )}
              <Link href="/booking-lookup" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors justify-center py-2 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs hidden sm:block">예약확인</span>
              </Link>
              <Link href="/wishlist" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors relative justify-center py-2 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs hidden sm:block">찜목록</span>
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 sm:-top-1 sm:-right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>
              {user && (
                <Link href="/cart" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors relative justify-center py-2 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs hidden sm:block">장바구니</span>
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 sm:-top-1 sm:-right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              )}
            </div>
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <nav className="hidden lg:flex items-center justify-center h-16">
            {isLoadingMenu ? (
              // 로딩 중 스켈레톤
              <ul className="flex space-x-8">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <li key={i} className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="flex space-x-8">
                {navigationItems.map((item: NavigationItem) => (
                <li 
                  key={item.id} 
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(item.id)}
                  onMouseLeave={handleMenuLeave}
                >
                  <Link
                    href={item.href}
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-base px-2 py-2"
                  >
                    {item.name}
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${activeSubmenu === item.id ? 'rotate-180' : ''}`} />
                  </Link>
                  {/* 서브메뉴 */}
                  <div 
                    className={`absolute left-0 top-full z-10 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                      activeSubmenu === item.id 
                        ? 'opacity-100 visible translate-y-0' 
                        : 'opacity-0 invisible -translate-y-2'
                    }`}
                    onMouseEnter={handleSubmenuEnter}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <div className="py-1">
                      {item.subItems.map((subItem: { name: string; href: string }) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-150"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
              </ul>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4">
            {/* Top Bar 메뉴: 모바일에서 햄버거 메뉴 안에 노출 */}
            <div className="flex flex-col space-y-2 mb-4">
              <Link href="/customer" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-md hover:bg-gray-50">고객센터</Link>
              <Link href="/notice" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-md hover:bg-gray-50">공지사항</Link>
              {user ? (
                <>
                  <span className="text-gray-700 font-medium py-2 px-2">안녕하세요, <span className="font-semibold text-blue-600">{user.nickname || user.name}</span>님</span>
                  <Link href="/mypage" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-md hover:bg-gray-50">마이페이지</Link>
                  <Link href="/transactions" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-md hover:bg-gray-50">입출금 내역</Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-md hover:bg-gray-50">관리자패널</Link>
                  )}
                  <button onClick={logout} className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-md hover:bg-gray-50 text-left">로그아웃</button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsAuthModalOpen(true)} className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-md hover:bg-gray-50 text-left">{t('nav.login')}</button>
                  <button onClick={() => setIsAuthModalOpen(true)} className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-md hover:bg-gray-50 text-left">{t('nav.signup')}</button>
                </>
              )}
            </div>

            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="그랜드캐년"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </form>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              {isLoadingMenu ? (
                // 모바일 로딩 스켈레톤
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-32"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {navigationItems.map((item: NavigationItem) => (
                <div key={item.id} className="space-y-1">
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2 px-2 rounded-md hover:bg-gray-50 flex justify-between items-center"
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4" />
                  </Link>
                  <div className="pl-4 space-y-1">
                    {item.subItems.map((subItem: { name: string; href: string }) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 py-1 px-2 rounded-md hover:bg-gray-50 block text-sm"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
                </>
              )}
            </nav>

            {/* Mobile Auth Actions */}
            {!user && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-4">
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    {t('nav.login')}
                  </Button>
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {t('nav.signup')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}