'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  CreditCard, 
  Star, 
  AlertCircle, 
  MessageCircle,
  Clock,
  Bell,
  Eye,
  UserPlus,
  Coins,
  Monitor,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface KPIData {
  newUsers: number;
  totalUsers: number;
  totalMileage: number;
  pendingReviews: number;
  averageRating: number;
  pendingApplications: number;
  currentUsers: number;
}

interface Alert {
  id: string;
  type: 'review' | 'application' | 'booking' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        const result = await response.json();
        
        if (result.success) {
          setKpiData(result.data.kpi);
          setRecentBookings(result.data.recentBookings || []);
          setAlerts(result.data.alerts || []);
        } else {
          console.error('Dashboard data fetch failed:', result.error);
          // 기본값으로 설정
          setKpiData({
            newUsers: 0,
            totalUsers: 0,
            totalMileage: 0,
            pendingReviews: 0,
            averageRating: 0,
            pendingApplications: 0,
            currentUsers: 0
          });
          setRecentBookings([]);
          setAlerts([]);
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        // 기본값으로 설정
        setKpiData({
          newUsers: 0,
          totalUsers: 0,
          totalMileage: 0,
          pendingReviews: 0,
          averageRating: 0,
          pendingApplications: 0,
          currentUsers: 0
        });
        setRecentBookings([]);
        setAlerts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    
    // 실시간 알림 업데이트 (5분마다)
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()}원`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // 알림 타입별 페이지 이동 함수
  const navigateToAlertPage = (alert: Alert): void => {
    switch (alert.type) {
      case 'review':
        router.push('/admin/reviews');
        break;
      case 'application':
        router.push('/admin/transactions');
        break;
      case 'booking':
        router.push('/admin/bookings');
        break;
      case 'system':
        // 시스템 알림은 페이지 이동 없이 토스트만 표시
        toast({
          title: alert.title,
          description: alert.message,
        });
        break;
      default:
        break;
    }
  };

  const handleAlertClick = async (alert: Alert) => {
    try {
      // 알림 읽음 처리
      const response = await fetch(`/api/admin/alerts/${alert.id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        // 로컬 상태 업데이트
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, isRead: true } : a
        ));
        
        // 대시보드 데이터 즉시 새로고침
        const dashboardResponse = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          if (dashboardData.success) {
            setAlerts(dashboardData.data.alerts || []);
            const newUnreadCount = dashboardData.data.alerts?.filter((a: any) => !a.isRead).length || 0;
            
            console.log('AdminDashboard - 알림 읽음 처리 후:', {
              newUnreadCount,
              totalAlerts: dashboardData.data.alerts?.length || 0,
              alerts: dashboardData.data.alerts
            });
            
                    // AdminLayout의 알림 카운트 즉시 업데이트
        if ((window as any).updateAdminAlertCount) {
          console.log('AdminDashboard - updateAdminAlertCount 호출:', newUnreadCount);
          (window as any).updateAdminAlertCount(newUnreadCount);
        }
        
        // 추가로 decreaseAlertCount도 호출하여 확실하게 업데이트
        if ((window as any).decreaseAlertCount) {
          console.log('AdminDashboard - decreaseAlertCount 호출');
          (window as any).decreaseAlertCount();
        }
          }
        }
        
        // 해당 페이지로 이동
        navigateToAlertPage(alert);
        
        toast({
          title: "알림 확인됨",
          description: "알림이 읽음 처리되었습니다.",
        });
      } else {
        throw new Error('알림 읽음 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('알림 읽음 처리 오류:', error);
      toast({
        title: "오류",
        description: "알림 읽음 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 요청된 5개 카테고리만 표시
  const kpiCards = [
    {
      title: '회원관리',
      value: `${formatNumber(kpiData?.newUsers || 0)}/${formatNumber(kpiData?.totalUsers || 0)}`,
      icon: UserPlus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+5명',
      changeColor: 'text-green-600',
      subtitle: '신규회원/총회원',
      link: '/admin/users'
    },
    {
      title: '마일리지관리',
      value: formatCurrency(kpiData?.totalMileage || 0),
      icon: Coins,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+12%',
      changeColor: 'text-green-600',
      subtitle: '전체 회원 마일리지 총액',
      link: '/admin/users'
    },
    {
      title: '여행후기',
      value: `${kpiData?.pendingReviews || 0}건 대기`,
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: `${kpiData?.averageRating || 0}/5`,
      changeColor: 'text-blue-600',
      subtitle: '승인 대기 / 평균 평점',
      link: '/admin/reviews'
    },
    {
      title: '입출금관리',
      value: `${kpiData?.pendingApplications || 0}건 대기`,
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '처리 필요',
      changeColor: 'text-orange-600',
      subtitle: '입출금 신청 대기',
      link: '/admin/transactions'
    },
    {
      title: '현재접속자',
      value: `${formatNumber(kpiData?.currentUsers || 0)}명`,
      icon: Monitor,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '실시간',
      changeColor: 'text-green-600',
      subtitle: '현재 접속 중인 사용자',
      link: '/admin/access'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards - 요청된 5개 카테고리만 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpiCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => window.location.href = card.link}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {card.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>최근 예약</span>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/bookings'}>
                전체보기
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold text-gray-900">#{booking.id}</p>
                        <p className="text-sm text-gray-600">{booking.customer}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{booking.tour}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.date).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(booking.amount)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status === 'confirmed' ? '확정' : '대기중'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>최근 예약이 없습니다.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>최근 알림</span>
              <Badge variant="outline" className="text-xs">
                {alerts.filter((a: Alert) => !a.isRead).length}개 미확인
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.slice(0, 5).map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      alert.isRead ? 'bg-gray-50' : 'bg-orange-50 border border-orange-200'
                    }`}
                    onClick={() => handleAlertClick(alert)}
                  >
                    <div className={`p-2 rounded-full ${
                      alert.type === 'review' ? 'bg-yellow-100' :
                      alert.type === 'application' ? 'bg-red-100' :
                      alert.type === 'booking' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {alert.type === 'review' && <MessageCircle className="w-4 h-4 text-yellow-600" />}
                      {alert.type === 'application' && <CreditCard className="w-4 h-4 text-red-600" />}
                      {alert.type === 'booking' && <Clock className="w-4 h-4 text-blue-600" />}
                      {alert.type === 'system' && <AlertCircle className="w-4 h-4 text-gray-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        alert.isRead ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(alert.timestamp).toLocaleString('ko-KR')}
                      </p>
                    </div>
                    {!alert.isRead && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>새로운 알림이 없습니다.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 작업</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button className="h-20 flex-col space-y-2" onClick={() => window.location.href = '/admin/users'}>
              <Users className="w-6 h-6" />
              <span>회원 관리</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => window.location.href = '/admin/mileage-history'}>
              <DollarSign className="w-6 h-6" />
              <span>마일리지 내역</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => window.location.href = '/admin/reviews'}>
              <MessageCircle className="w-6 h-6" />
              <span>여행후기 관리</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => window.location.href = '/admin/transactions'}>
              <CreditCard className="w-6 h-6" />
              <span>입출금 관리</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => window.location.href = '/admin/access'}>
              <Monitor className="w-6 h-6" />
              <span>접속자 관리</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}