'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Bell, 
  MessageCircle, 
  CreditCard, 
  Calendar, 
  AlertCircle,
  Eye,
  EyeOff,
  Filter,
  Search,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  type: 'review' | 'application' | 'booking' | 'inquiry' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  referenceId?: string;
}

export default function AdminAlertsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { toast } = useToast();

  // 알림 소리 재생 함수
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('알림 소리 재생 실패:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const newAlerts = data.data.alerts || [];
          
          console.log('알림 페이지 - 데이터 새로고침:', {
            totalAlerts: newAlerts.length,
            unreadAlerts: newAlerts.filter((alert: Alert) => !alert.isRead).length,
            alerts: newAlerts
          });
          
          // 새로운 알림이 있는지 확인하고 소리 재생
          const previousUnreadCount = alerts.filter((alert: Alert) => !alert.isRead).length;
          const currentUnreadCount = newAlerts.filter((alert: Alert) => !alert.isRead).length;
          
          if (soundEnabled && currentUnreadCount > previousUnreadCount) {
            playNotificationSound();
          }
          
          setAlerts(newAlerts);
        }
      }
    } catch (error) {
      console.error('알림 데이터 가져오기 오류:', error);
      toast({
        title: "오류",
        description: "알림 데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter((alert: Alert) =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 타입 필터링
    if (filterType !== 'all') {
      filtered = filtered.filter((alert: Alert) => alert.type === filterType);
    }

    // 상태 필터링
    if (filterStatus !== 'all') {
      const isRead = filterStatus === 'read';
      filtered = filtered.filter((alert: Alert) => alert.isRead === isRead);
    }

    setFilteredAlerts(filtered);
  };

  // 권한 체크
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAlerts();
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      filterAlerts();
    }
  }, [alerts, searchTerm, filterType, filterStatus, user]);

  // 권한 체크 - 조건부 렌더링
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

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
      case 'inquiry':
        router.push('/admin/inquiries');
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
      console.log('=== 알림 클릭 시작 ===');
      console.log('클릭된 알림:', alert);
      console.log('현재 전체 알림 수:', alerts.length);
      console.log('현재 미확인 알림 수:', alerts.filter(a => !a.isRead).length);
      console.log('AdminLayout 현재 카운트:', (window as any).getCurrentAlertCount ? (window as any).getCurrentAlertCount() : 'not available');
      
      // 알림 읽음 처리 API 호출
      console.log('API 호출 시작:', `/api/admin/alerts/${alert.id}/read`);
      const response = await fetch(`/api/admin/alerts/${alert.id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('API 응답 상태:', response.status, response.ok);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('API 응답 데이터:', responseData);
      } catch (parseError) {
        console.error('응답 파싱 오류:', parseError);
        responseData = null;
      }

      if (response.ok && responseData?.success) {
        console.log('✅ API 호출 성공, UI 업데이트 시작');
        
        // 1. 즉시 로컬 상태 업데이트
        console.log('1단계: 로컬 상태 업데이트');
        setAlerts(prevAlerts => {
          const updatedAlerts = prevAlerts.map(a => 
            a.id === alert.id ? { ...a, isRead: true } : a
          );
          console.log('로컬 알림 상태 업데이트:', {
            alertId: alert.id,
            before: prevAlerts.filter(a => !a.isRead).length,
            after: updatedAlerts.filter(a => !a.isRead).length,
            updatedAlert: updatedAlerts.find(a => a.id === alert.id)
          });
          return updatedAlerts;
        });
        
        // 2. AdminLayout 상태 강제 업데이트 (먼저)
        console.log('2단계: AdminLayout 카운트 직접 업데이트');
        const currentUnreadCount = alerts.filter(a => !a.isRead && a.id !== alert.id).length;
        console.log('계산된 새 미확인 개수:', currentUnreadCount);
        
        if ((window as any).updateAdminAlertCount) {
          console.log('updateAdminAlertCount 호출:', currentUnreadCount);
          (window as any).updateAdminAlertCount(currentUnreadCount);
          
          // 즉시 확인
          setTimeout(() => {
            if ((window as any).getCurrentAlertCount) {
              const verifyCount = (window as any).getCurrentAlertCount();
              console.log('업데이트 확인 - 현재 카운트:', verifyCount);
            }
          }, 50);
        }
        
        // 3. 백업용 - decreaseAlertCount도 호출
        console.log('3단계: 백업용 decreaseAlertCount 호출');
        if ((window as any).decreaseAlertCount) {
          (window as any).decreaseAlertCount();
        }
        
        // 4. 서버 데이터 동기화 (데이터베이스 업데이트 대기)
        console.log('4단계: 서버 동기화 예약 (1초 후)');
        setTimeout(async () => {
          console.log('서버 데이터 동기화 시작');
          await fetchAlerts();
          if ((window as any).refreshAdminAlerts) {
            console.log('AdminLayout refreshAdminAlerts 호출');
            (window as any).refreshAdminAlerts();
          }
          console.log('=== 알림 처리 완료 ===');
        }, 1000);
        
        // 해당 페이지로 이동
        navigateToAlertPage(alert);
        
        toast({
          title: "알림 확인됨",
          description: "알림이 읽음 처리되었습니다.",
        });
      } else {
        console.error('❌ API 호출 실패:', {
          status: response.status,
          statusText: response.statusText,
          responseData: responseData
        });
        
        // API 실패 시에도 UI는 업데이트하고, 나중에 서버와 동기화
        console.log('API 실패했지만 UI는 업데이트');
        setAlerts(prevAlerts => 
          prevAlerts.map(a => a.id === alert.id ? { ...a, isRead: true } : a)
        );
        
        if ((window as any).updateAdminAlertCount) {
          const newCount = alerts.filter(a => !a.isRead && a.id !== alert.id).length;
          (window as any).updateAdminAlertCount(newCount);
        }
        
        throw new Error(`알림 읽음 처리 실패: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ 알림 읽음 처리 전체 오류:', error);
      toast({
        title: "오류",
        description: `알림 읽음 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadAlerts = alerts.filter(alert => !alert.isRead);
      
      if (unreadAlerts.length === 0) {
        toast({
          title: "알림",
          description: "읽지 않은 알림이 없습니다.",
        });
        return;
      }

      // 모든 미확인 알림을 읽음 처리
      const promises = unreadAlerts.map(alert => 
        fetch(`/api/admin/alerts/${alert.id}/read`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
      );

      const results = await Promise.allSettled(promises);
      const successCount = results.filter(result => result.status === 'fulfilled').length;
      
      if (successCount > 0) {
        console.log('모든 알림 읽음 처리 성공 - UI 업데이트 시작');
        
        // 1. 즉시 로컬 상태 업데이트
        setAlerts(prevAlerts => {
          const updatedAlerts = prevAlerts.map(a => ({ ...a, isRead: true }));
          console.log('로컬 알림 상태 업데이트 (모두 읽음):', {
            before: prevAlerts.filter(a => !a.isRead).length,
            after: 0
          });
          return updatedAlerts;
        });
        
        // 2. AdminLayout의 알림 카운트 즉시 0으로 설정
        if ((window as any).updateAdminAlertCount) {
          console.log('알림 페이지 - 모든 알림 읽음 처리, 카운트를 0으로 설정');
          (window as any).updateAdminAlertCount(0);
        }
        
        // 3. 서버 데이터 동기화 (지연)
        setTimeout(async () => {
          console.log('서버 데이터 동기화 시작 (모든 알림)');
          await fetchAlerts();
          if ((window as any).refreshAdminAlerts) {
            (window as any).refreshAdminAlerts();
          }
        }, 500);
        
        toast({
          title: "모든 알림 확인됨",
          description: `${successCount}개의 알림이 읽음 처리되었습니다.`,
        });
      }
    } catch (error) {
      console.error('모든 알림 읽음 처리 오류:', error);
      toast({
        title: "오류",
        description: "알림 읽음 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <MessageCircle className="w-4 h-4 text-yellow-600" />;
      case 'application':
        return <CreditCard className="w-4 h-4 text-red-600" />;
      case 'booking':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'inquiry':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'review':
        return '리뷰';
      case 'application':
        return '입출금';
      case 'booking':
        return '예약';
      case 'inquiry':
        return '1:1 문의';
      default:
        return '시스템';
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'application':
        return 'bg-red-100 text-red-800';
      case 'booking':
        return 'bg-blue-100 text-blue-800';
      case 'inquiry':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">알림 관리</h1>
          <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 sm:p-6">
                <div className="h-16 sm:h-20 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const setupAlertsTable = async () => {
    try {
      const response = await fetch('/api/admin/setup-alerts-table', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast({
          title: "성공",
          description: "알림 테이블이 생성되었습니다. 이제 알림 읽음 처리가 정상적으로 작동합니다.",
        });
      } else {
        throw new Error('테이블 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('알림 테이블 생성 오류:', error);
      toast({
        title: "오류",
        description: "알림 테이블 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const fixAlertsTable = async () => {
    try {
      const response = await fetch('/api/admin/fix-alerts-table', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast({
          title: "성공",
          description: "알림 테이블이 수정되었습니다. 이제 UUID 형식의 관리자 ID가 정상적으로 저장됩니다.",
        });
      } else {
        throw new Error('테이블 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('알림 테이블 수정 오류:', error);
      toast({
        title: "오류",
        description: "알림 테이블 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">알림 관리</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">시스템 알림 및 승인 대기 항목 관리</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={fixAlertsTable}
            className="flex items-center space-x-2 text-xs sm:text-sm h-9 sm:h-10"
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">테이블 수정</span>
            <span className="sm:hidden">수정</span>
          </Button>
          <Button
            variant="outline"
            onClick={setupAlertsTable}
            className="flex items-center space-x-2 text-xs sm:text-sm h-9 sm:h-10"
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">알림 테이블 설정</span>
            <span className="sm:hidden">설정</span>
          </Button>
          <Button
            variant="outline"
            onClick={fetchAlerts}
            className="flex items-center space-x-2 text-xs sm:text-sm h-9 sm:h-10"
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">새로고침</span>
            <span className="sm:hidden">새로고침</span>
          </Button>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 text-xs sm:text-sm h-9 sm:h-10"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">모두 읽음 처리</span>
              <span className="sm:hidden">모두 읽음</span>
            </Button>
          )}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">전체 알림</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-gray-100">
                <Bell className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">미확인 알림</p>
                <p className="text-lg sm:text-2xl font-bold text-orange-600">{unreadCount}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-orange-100">
                <EyeOff className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">리뷰 알림</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                  {alerts.filter(a => a.type === 'review').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-yellow-100">
                <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">입출금 알림</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.type === 'application').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-red-100">
                <CreditCard className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">예약 알림</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">
                  {alerts.filter(a => a.type === 'booking').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-blue-100">
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">1:1 문의 알림</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-600">
                  {alerts.filter(a => a.type === 'inquiry').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-purple-100">
                <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">시스템 알림</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-600">
                  {alerts.filter(a => a.type === 'system').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-gray-100">
                <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">필터 및 검색</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="알림 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-11"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-10 sm:h-11">
                <SelectValue placeholder="알림 타입" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 타입</SelectItem>
                <SelectItem value="review">리뷰</SelectItem>
                <SelectItem value="application">입출금</SelectItem>
                <SelectItem value="booking">예약</SelectItem>
                <SelectItem value="inquiry">1:1 문의</SelectItem>
                <SelectItem value="system">시스템</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-10 sm:h-11">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="unread">미확인</SelectItem>
                <SelectItem value="read">확인됨</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
              }}
              className="h-10 sm:h-11"
            >
              필터 초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 알림 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">
            알림 목록 ({filteredAlerts.length}개)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg border cursor-pointer transition-colors ${
                    alert.isRead 
                      ? 'bg-gray-50 hover:bg-gray-100' 
                      : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                  }`}
                  onClick={() => handleAlertClick(alert)}
                >
                  <div className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                    alert.type === 'review' ? 'bg-yellow-100' :
                    alert.type === 'application' ? 'bg-red-100' :
                    alert.type === 'booking' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <h3 className={`font-medium text-sm sm:text-base ${
                        alert.isRead ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {alert.title}
                      </h3>
                      <Badge className={`${getAlertTypeColor(alert.type)} text-xs`}>
                        {getAlertTypeLabel(alert.type)}
                      </Badge>
                      {!alert.isRead && (
                        <Badge variant="destructive" className="text-xs">
                          새 알림
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{alert.message}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(alert.timestamp).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    {!alert.isRead && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAlertClick(alert);
                      }}
                      className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                    >
                      {alert.isRead ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Bell className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">알림이 없습니다</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                  ? '검색 조건에 맞는 알림이 없습니다.' 
                  : '현재 새로운 알림이 없습니다.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
}
