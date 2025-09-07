'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  CalendarDays, 
  Users, 
  MessageSquare, 
  CreditCard, 
  BarChart3, 
  FileText, 
  Headphones, 
  Settings,
  Menu,
  X,
  LogOut,
  Globe,
  Bell,
  Mail,
  ChevronDown,
  ChevronRight,
  Activity,
  Wallet,
  DollarSign,
  Layout,
  Building2,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  icon: any;
  label: string;
  href: string;
  subItems?: MenuItem[];
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const menuItems: MenuItem[] = [
    // 상단 우선순위 메뉴
    { icon: LayoutDashboard, label: '대시보드', href: '/admin' },
    { icon: Users, label: '사용자 관리', href: '/admin/users' },
    { icon: MessageSquare, label: '리뷰 관리', href: '/admin/reviews' },
    { icon: Activity, label: '접속 관리', href: '/admin/access' },
    { 
      icon: Headphones, 
      label: '고객 지원', 
      href: '/admin/support',
      subItems: [
        { icon: MessageSquare, label: '1:1 문의 관리', href: '/admin/inquiries' },
      ]
    },
    
    // 구분선 (시각적 분리)
    { icon: Package, label: '투어 관리', href: '/admin/tours' },
    { icon: CalendarDays, label: '예약 관리', href: '/admin/bookings' },
    { icon: Bell, label: '공지사항 관리', href: '/admin/notices' },
    { icon: Settings, label: '메뉴 관리', href: '/admin/menu' },
    { icon: Mail, label: '이메일 템플릿', href: '/admin/email-templates' },
    { icon: Layout, label: '푸터 관리', href: '/admin/footer' },
    { icon: Building2, label: '회사정보 관리', href: '/admin/company-info' },
    { icon: Palette, label: '사이트 설정', href: '/admin/site-settings' },
    // { icon: CreditCard, label: '결제 관리', href: '/admin/financial' },
    { icon: Wallet, label: '입출금 관리', href: '/admin/transactions' },
    { icon: DollarSign, label: '마일리지 내역', href: '/admin/mileage-history' },
    // { icon: BarChart3, label: '리포트', href: '/admin/reports' },
    // { icon: FileText, label: '콘텐츠 관리', href: '/admin/content' },
    // { icon: Settings, label: '설정', href: '/admin/settings' },
  ];

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isMenuExpanded = (label: string) => expandedMenus.includes(label);

  const isActive = (href: string) => {
    return pathname === href || (href !== '/admin' && pathname.startsWith(href));
  };

  const playNotificationSound = () => {
    try {
      if (audioRef.current) {
        audioRef.current.play();
      } else {
        // 웹 Audio API를 사용한 비프음 생성
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch (error) {
      console.error('알림 소리 재생 실패:', error);
    }
  };

  // 알림 데이터 가져오기
  const fetchAlerts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const previousUnreadCount = unreadAlerts;
          const currentUnreadCount = data.data.alerts?.filter((alert: any) => !alert.isRead).length || 0;
          
          console.log('AdminLayout - 알림 개수 업데이트:', {
            previousUnreadCount,
            currentUnreadCount,
            totalAlerts: data.data.alerts?.length || 0,
            alerts: data.data.alerts
          });
          
          // 새로운 알림이 있는지 확인하고 소리 재생
          if (soundEnabled && currentUnreadCount > previousUnreadCount) {
            playNotificationSound();
          }
          
          setUnreadAlerts(currentUnreadCount);
        }
      }
    } catch (error) {
      console.error('알림 데이터 가져오기 오류:', error);
    }
  }, [soundEnabled]); // unreadAlerts 의존성 제거

  useEffect(() => {
    fetchAlerts();
    
    // 5분마다 알림 업데이트
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // unreadAlerts 상태 변경 감지 (디버깅용)
  useEffect(() => {
    console.log('AdminLayout - unreadAlerts 상태 변경됨:', unreadAlerts);
  }, [unreadAlerts]);

  // 알림 배너 숨기기 함수
  const hideAlertBanner = () => {
    setUnreadAlerts(0);
  };

  // 알림 읽음 처리 함수 (자식 컴포넌트에서 호출할 수 있도록)
  const handleAlertRead = (alertId: string) => {
    setUnreadAlerts(prev => Math.max(0, prev - 1));
    // 즉시 알림 데이터 새로고침
    fetchAlerts();
  };

  // 전역 이벤트 리스너로 알림 읽음 처리 감지
  useEffect(() => {
    const handleAlertReadEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.alertId) {
        handleAlertRead(event.detail.alertId);
      }
    };

    window.addEventListener('alertRead', handleAlertReadEvent as EventListener);
    
    return () => {
      window.removeEventListener('alertRead', handleAlertReadEvent as EventListener);
    };
  }, []);

  // 전역 함수로 fetchAlerts를 노출 (자식 컴포넌트에서 호출 가능)
  useEffect(() => {
    (window as any).refreshAdminAlerts = fetchAlerts;
    
    return () => {
      delete (window as any).refreshAdminAlerts;
    };
  }, [fetchAlerts]);

  // 전역 함수로 알림 카운트 감소 (자식 컴포넌트에서 호출 가능)
  useEffect(() => {
    (window as any).decreaseAlertCount = () => {
      console.log('AdminLayout - decreaseAlertCount 호출됨');
      setUnreadAlerts(prev => {
        const newCount = Math.max(0, prev - 1);
        console.log('AdminLayout - 알림 개수 감소:', prev, '→', newCount);
        return newCount;
      });
      // fetchAlerts 호출 제거 - 알림 페이지에서 직접 제어
    };
    
    // 전역 함수로 알림 카운트 직접 업데이트 (자식 컴포넌트에서 호출 가능)
    (window as any).updateAdminAlertCount = (count: number) => {
      console.log('AdminLayout - updateAdminAlertCount 호출됨:', count);
      setUnreadAlerts(count);
      console.log('AdminLayout - 알림 카운트 업데이트 완료:', count);
    };
    
    // 전역 함수로 현재 알림 카운트 확인 (디버깅용)
    (window as any).getCurrentAlertCount = () => {
      console.log('AdminLayout - 현재 알림 카운트:', unreadAlerts);
      return unreadAlerts;
    };
    
    // 강제 UI 업데이트 함수
    (window as any).forceUpdateAlertUI = () => {
      console.log('AdminLayout - 강제 UI 업데이트 호출');
      setUnreadAlerts(prev => {
        console.log('AdminLayout - 강제 UI 업데이트:', prev, '→', prev);
        return prev; // 같은 값이라도 강제로 리렌더링
      });
    };
    
    return () => {
      delete (window as any).decreaseAlertCount;
      delete (window as any).updateAdminAlertCount;
      delete (window as any).getCurrentAlertCount;
      delete (window as any).forceUpdateAlertUI;
    };
  }, [fetchAlerts]);

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const IconComponent = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = isMenuExpanded(item.label);
    const isItemActive = isActive(item.href);
    const hasActiveChild = hasSubItems && item.subItems?.some(subItem => isActive(subItem.href));

    return (
      <div key={item.label}>
        <div className="flex items-center">
          {hasSubItems ? (
            <button
              onClick={() => toggleMenu(item.label)}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isItemActive || hasActiveChild
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <IconComponent className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <Link
              href={item.href}
              prefetch={false}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isItemActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <IconComponent className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          )}
        </div>
        
        {hasSubItems && isExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.subItems?.map((subItem) => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 admin-sidebar transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">하나투어</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {/* 상단 우선순위 메뉴 */}
            {menuItems.slice(0, 5).map((item) => renderMenuItem(item))}
            
            {/* 구분선 */}
            <div className="my-4 border-t border-gray-600"></div>
            
            {/* 하단 메뉴 */}
            {menuItems.slice(5).map((item) => renderMenuItem(item))}
          </div>
        </nav>


      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">관리자 대시보드</h1>
            </div>
            <div className="flex items-center space-x-3">
              {/* 알림 소리 설정 */}
              <Button
                variant={soundEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center space-x-1"
                title={soundEnabled ? "알림 소리 끄기" : "알림 소리 켜기"}
              >
                <Bell className={`w-4 h-4 ${soundEnabled ? 'text-white' : 'text-gray-600'}`} />
                <span className="text-xs">{soundEnabled ? '소리 켜짐' : '소리 꺼짐'}</span>
              </Button>
              
              {/* 알림 배지 */}
              <Link href="/admin/alerts" className="relative p-2 text-gray-600 hover:text-gray-800 transition">
                <Bell className="w-5 h-5" />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadAlerts > 9 ? '9+' : unreadAlerts}
                  </span>
                )}
              </Link>
              <Link href="/" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
                사이트로 돌아가기
              </Link>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </header>

        {/* 알림 배너 */}
        {unreadAlerts > 0 && (
          <div className="bg-orange-50 border-b border-orange-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-800">
                    새로운 알림이 {unreadAlerts}개 있습니다
                  </h3>
                  <p className="text-sm text-orange-600">
                    승인 대기 중인 리뷰, 입출금 신청 등을 확인해주세요.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/admin/alerts'}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  모든 알림 보기
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={hideAlertBanner}
                  className="text-orange-600 hover:bg-orange-100"
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}