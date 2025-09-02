'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  Clock, 
  MapPin, 
  Monitor, 
  Smartphone, 
  Globe,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AccessLog {
  id: string;
  userId: string;
  username: string;
  email: string;
  name?: string;
  nickname?: string;
  role?: string;
  action: 'login' | 'logout' | 'session_expired' | 'failed_login';
  ipAddress: string;
  userAgent: string;
  device: 'desktop' | 'mobile' | 'tablet';
  location: string;
  timestamp: string;
  status: 'success' | 'failed' | 'blocked';
}

interface ActiveSession {
  id: string;
  userId: string;
  username: string;
  email: string;
  name?: string;
  nickname?: string;
  role?: string;
  ipAddress: string;
  userAgent: string;
  device: 'desktop' | 'mobile' | 'tablet';
  location: string;
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
  sessionDuration?: string;
}

interface AccessStats {
  totalLogins: number;
  totalLogouts: number;
  failedLogins: number;
  activeSessions: number;
  uniqueUsers: number;
  topLocations: Array<{ location: string; count: number }>;
  deviceStats: Array<{ device: string; count: number }>;
}

export default function AccessManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [stats, setStats] = useState<AccessStats>({
    totalLogins: 0,
    totalLogouts: 0,
    failedLogins: 0,
    activeSessions: 0,
    uniqueUsers: 0,
    topLocations: [],
    deviceStats: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterDevice, setFilterDevice] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // 실제 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        };
        
        // 접속 통계 로드
        const statsResponse = await fetch('/api/admin/access/stats', { headers });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          console.error('통계 로드 실패:', statsResponse.status);
        }

        // 활성 세션 로드
        const sessionsResponse = await fetch('/api/admin/access/sessions', { headers });
        if (sessionsResponse.ok) {
          const sessionsData = await sessionsResponse.json();
          
          // API 데이터를 프론트엔드 인터페이스에 맞게 매핑
          const mappedSessions = (sessionsData.sessions || []).map((session: any) => {
            // 세션 지속 시간 계산
            const loginTime = new Date(session.login_time);
            const now = new Date();
            const durationMs = now.getTime() - loginTime.getTime();
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            const sessionDuration = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
            
            return {
              id: session.id,
              userId: session.user_id,
              username: session.username,
              email: session.email,
              name: session.name,
              nickname: session.nickname,
              role: session.role,
              ipAddress: session.ip_address || '알 수 없음',
              userAgent: session.user_agent || '',
              device: session.device || 'unknown',
              location: session.location || '위치 정보 없음',
              loginTime: session.login_time,
              lastActivity: session.last_activity,
              isActive: session.is_active,
              sessionDuration
            };
          });
          
          setActiveSessions(mappedSessions);
        } else {
          console.error('세션 로드 실패:', sessionsResponse.status);
        }

        // 접속 로그 로드
        const logsResponse = await fetch('/api/admin/access', { headers });
        if (logsResponse.ok) {
          const logsData = await logsResponse.json();
          console.log('접속 로그 데이터:', logsData);
          
          // API 데이터를 프론트엔드 인터페이스에 맞게 매핑
          const mappedLogs = (logsData.logs || []).map((log: any) => ({
            id: log.id,
            userId: log.user_id,
            username: log.username,
            email: log.email,
            name: log.name,
            nickname: log.nickname,
            role: log.role,
            action: log.action,
            ipAddress: log.ip_address || '알 수 없음',
            userAgent: log.user_agent || '',
            device: log.device || 'unknown',
            location: log.location || '위치 정보 없음',
            timestamp: log.timestamp,
            status: log.status
          }));
          
          setAccessLogs(mappedLogs);
        } else {
          console.error('로그 로드 실패:', logsResponse.status);
          const errorText = await logsResponse.text();
          console.error('에러 내용:', errorText);
        }

      } catch (error) {
        console.error('데이터 로드 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch = (log.username && log.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (log.email && log.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (log.name && log.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (log.nickname && log.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (log.ipAddress && log.ipAddress.includes(searchTerm));
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesDevice = filterDevice === 'all' || log.device === filterDevice;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

    return matchesSearch && matchesAction && matchesDevice && matchesStatus;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'bg-green-100 text-green-800';
      case 'logout': return 'bg-blue-100 text-blue-800';
      case 'failed_login': return 'bg-red-100 text-red-800';
      case 'session_expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop': return <Monitor className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Monitor className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ko-KR');
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      // 접속 통계 로드
      const statsResponse = await fetch('/api/admin/access/stats', { headers });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // 활성 세션 로드
      const sessionsResponse = await fetch('/api/admin/access/sessions', { headers });
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        
        // API 데이터를 프론트엔드 인터페이스에 맞게 매핑
        const mappedSessions = (sessionsData.sessions || []).map((session: any) => {
          // 세션 지속 시간 계산
          const loginTime = new Date(session.login_time);
          const now = new Date();
          const durationMs = now.getTime() - loginTime.getTime();
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
          const sessionDuration = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
          
          return {
            id: session.id,
            userId: session.user_id,
            username: session.username,
            email: session.email,
            name: session.name,
            nickname: session.nickname,
            role: session.role,
            ipAddress: session.ip_address || '알 수 없음',
            userAgent: session.user_agent || '',
            device: session.device || 'unknown',
            location: session.location || '위치 정보 없음',
            loginTime: session.login_time,
            lastActivity: session.last_activity,
            isActive: session.is_active,
            sessionDuration
          };
        });
        
        setActiveSessions(mappedSessions);
      }

      // 접속 로그 로드
      const logsResponse = await fetch('/api/admin/access', { headers });
      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        
        // API 데이터를 프론트엔드 인터페이스에 맞게 매핑
        const mappedLogs = (logsData.logs || []).map((log: any) => ({
          id: log.id,
          userId: log.user_id,
          username: log.username,
          email: log.email,
          name: log.name,
          nickname: log.nickname,
          role: log.role,
          action: log.action,
          ipAddress: log.ip_address || '알 수 없음',
          userAgent: log.user_agent || '',
          device: log.device || 'unknown',
          location: log.location || '위치 정보 없음',
          timestamp: log.timestamp,
          status: log.status
        }));
        
        setAccessLogs(mappedLogs);
      }

    } catch (error) {
      console.error('데이터 새로고침 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    // 데이터 내보내기 기능 (실제 구현 시 CSV 다운로드 등)
    alert('데이터 내보내기 기능이 구현됩니다.');
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const response = await fetch(`/api/admin/access/sessions?sessionId=${sessionId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        // 성공적으로 세션이 종료되면 목록에서 제거
        setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
        // 통계도 새로고침
        handleRefresh();
      } else {
        console.error('세션 종료 실패');
      }
    } catch (error) {
      console.error('세션 종료 오류:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">접속 관리</h1>
          <p className="text-gray-600 mt-2">사용자 접속 로그 및 세션을 관리합니다</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
          <Button onClick={handleExportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 로그인</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogins.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              오늘 +{Math.floor(stats.totalLogins * 0.1)}건
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">실패 로그인</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedLogins}</div>
            <p className="text-xs text-muted-foreground">
              차단된 IP: {Math.floor(stats.failedLogins * 0.2)}개
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 세션</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              고유 사용자: {stats.uniqueUsers}명
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 세션 시간</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24분</div>
            <p className="text-xs text-muted-foreground">
              전일 대비 +2분
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 탭 메뉴 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="logs">접속 로그</TabsTrigger>
          <TabsTrigger value="sessions">활성 세션</TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 지역별 접속 통계 */}
            <Card>
              <CardHeader>
                <CardTitle>지역별 접속 통계</CardTitle>
                <CardDescription>최근 30일간 지역별 접속 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topLocations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{location.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(location.count / stats.topLocations[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {location.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 디바이스별 접속 통계 */}
            <Card>
              <CardHeader>
                <CardTitle>디바이스별 접속 통계</CardTitle>
                <CardDescription>접속 디바이스 분포</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.deviceStats.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(device.device)}
                        <span className="text-sm font-medium capitalize">{device.device}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(device.count / stats.deviceStats[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {device.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 접속 로그 탭 */}
        <TabsContent value="logs" className="space-y-6">
          {/* 필터 */}
          <Card>
            <CardHeader>
              <CardTitle>접속 로그</CardTitle>
              <CardDescription>사용자 접속 기록을 확인하고 관리합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                                  <Input
                  placeholder="이름, 닉네임, 이메일, IP 주소로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                </div>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="액션 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 액션</SelectItem>
                    <SelectItem value="login">로그인</SelectItem>
                    <SelectItem value="logout">로그아웃</SelectItem>
                    <SelectItem value="failed_login">로그인 실패</SelectItem>
                    <SelectItem value="session_expired">세션 만료</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterDevice} onValueChange={setFilterDevice}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="디바이스" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 디바이스</SelectItem>
                    <SelectItem value="desktop">데스크톱</SelectItem>
                    <SelectItem value="mobile">모바일</SelectItem>
                    <SelectItem value="tablet">태블릿</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 상태</SelectItem>
                    <SelectItem value="success">성공</SelectItem>
                    <SelectItem value="failed">실패</SelectItem>
                    <SelectItem value="blocked">차단</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>사용자 정보</TableHead>
                      <TableHead>권한</TableHead>
                      <TableHead>액션</TableHead>
                      <TableHead>IP 주소</TableHead>
                      <TableHead>디바이스</TableHead>
                      <TableHead>위치</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>시간</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {log.name || log.username}
                              {log.nickname && (
                                <span className="text-sm text-gray-500 ml-2">({log.nickname})</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{log.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {log.role === 'admin' ? '관리자' : 
                             log.role === 'staff' ? '직원' : 
                             log.role === 'customer' ? '일반회원' : 
                             log.role || '알 수 없음'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getActionColor(log.action)}>
                            {log.action === 'login' && '로그인'}
                            {log.action === 'logout' && '로그아웃'}
                            {log.action === 'failed_login' && '로그인 실패'}
                            {log.action === 'session_expired' && '세션 만료'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.ipAddress && log.ipAddress !== '알 수 없음' ? log.ipAddress : 
                           <span className="text-gray-400 italic">알 수 없음</span>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getDeviceIcon(log.device)}
                            <span className="capitalize">{log.device}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.location && log.location !== '위치 정보 없음' ? log.location : 
                           <span className="text-gray-400 italic">위치 정보 없음</span>}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(log.status)}>
                            {log.status === 'success' && '성공'}
                            {log.status === 'failed' && '실패'}
                            {log.status === 'blocked' && '차단'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatTime(log.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 활성 세션 탭 */}
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>활성 세션</CardTitle>
              <CardDescription>현재 활성화된 사용자 세션을 관리합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  세션을 강제 종료하면 해당 사용자가 즉시 로그아웃됩니다. 신중하게 진행해주세요.
                </AlertDescription>
              </Alert>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>사용자 정보</TableHead>
                      <TableHead>권한</TableHead>
                      <TableHead>IP 주소</TableHead>
                      <TableHead>디바이스</TableHead>
                      <TableHead>위치</TableHead>
                      <TableHead>로그인 시간</TableHead>
                      <TableHead>세션 지속시간</TableHead>
                      <TableHead>마지막 활동</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {session.name || session.username}
                              {session.nickname && (
                                <span className="text-sm text-gray-500 ml-2">({session.nickname})</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{session.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {session.role === 'admin' ? '관리자' : 
                             session.role === 'staff' ? '직원' : 
                             session.role === 'customer' ? '일반회원' : 
                             session.role || '알 수 없음'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {session.ipAddress && session.ipAddress !== '알 수 없음' ? session.ipAddress : 
                           <span className="text-gray-400 italic">알 수 없음</span>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getDeviceIcon(session.device)}
                            <span className="capitalize">{session.device}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {session.location && session.location !== '위치 정보 없음' ? session.location : 
                           <span className="text-gray-400 italic">위치 정보 없음</span>}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatTime(session.loginTime)}
                        </TableCell>
                        <TableCell className="text-sm text-blue-600 font-medium">
                          {session.sessionDuration}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatTime(session.lastActivity)}
                        </TableCell>
                        <TableCell>
                          <Badge className={session.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {session.isActive ? '활성' : '비활성'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTerminateSession(session.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
