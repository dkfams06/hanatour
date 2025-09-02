'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import MileageManagementModal from '@/components/admin/MileageManagementModal';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  nickname?: string;
  phone: string;
  birthDate: string;
  role: string;
  status: string;
  mileage: number;
  createdAt: string;
  lastLogin: string;
  isOnline?: boolean;
  lastActivity?: string;
  sessionDuration?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'suspended' | 'banned'>('all');
  const [onlineFilter, setOnlineFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editForm, setEditForm] = useState<{
    name: string;
    nickname: string;
    email: string;
    phone: string;
    birthDate: string;
    role: string;
    status: string;
  }>({
    name: '',
    nickname: '',
    email: '',
    phone: '',
    birthDate: '',
    role: '',
    status: ''
  });
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [showMileageModal, setShowMileageModal] = useState(false);
  const [selectedUserForMileage, setSelectedUserForMileage] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    checkCurrentUserRole();
  }, [statusFilter, searchTerm, onlineFilter]);

  // 접속 상태 실시간 업데이트 (30초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers();
    }, 30000); // 30초마다 업데이트

    return () => clearInterval(interval);
  }, [statusFilter, searchTerm, onlineFilter]);

  const checkCurrentUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/debug/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUserRole(data.user.role);
        console.log('현재 사용자 권한:', data.user.role);
      }
    } catch (error) {
      console.error('사용자 권한 확인 오류:', error);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (statusFilter !== 'all') {
      params.append('status', statusFilter);
    }
    if (onlineFilter !== 'all') {
      params.append('online', onlineFilter);
    }
    if (searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }
    
    const res = await fetch(`/api/admin/users?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.success) {
      setUsers(data.users);
    }
    setIsLoading(false);
  };

  const handleApprove = async (id: string) => {
    if (!confirm('이 회원을 승인하시겠습니까?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/users/${id}/approve`, { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.success) {
      toast({
        title: "승인 완료",
        description: "회원이 승인되었습니다.",
      });
      fetchUsers();
    } else {
      toast({
        title: "승인 실패",
        description: "승인에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`권한을 ${newRole}으로 변경하시겠습니까?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: "권한 변경 완료",
          description: `권한이 ${newRole}으로 변경되었습니다.`,
        });
        fetchUsers();
      } else {
        toast({
          title: "권한 변경 실패",
          description: data.error || "권한 변경에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "권한 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleBanToggle = async (userId: string, currentStatus: string) => {
    const isBanned = currentStatus === 'banned';
    const action = isBanned ? '해제' : '차단';
    const newStatus = isBanned ? 'approved' : 'banned';
    
    if (!confirm(`이 회원을 ${action}하시겠습니까?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: `${action} 완료`,
          description: `회원이 ${action}되었습니다.`,
        });
        fetchUsers();
      } else {
        toast({
          title: `${action} 실패`,
          description: data.error || `${action}에 실패했습니다.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: `${action} 처리 중 오류가 발생했습니다.`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    // 관리자 권한 확인
    if (currentUserRole !== 'admin') {
      toast({
        title: "권한 부족",
        description: "관리자만 회원을 삭제할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    // 최종 확인
    if (!confirm(`정말로 회원 "${userName}"을(를) 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다!`)) {
      return;
    }

    // 모달이 열려있다면 닫기
    if (showUserModal) {
      setShowUserModal(false);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: "삭제 완료",
          description: data.message || "회원이 삭제되었습니다.",
        });
        fetchUsers();
      } else {
        toast({
          title: "삭제 실패",
          description: data.error || "회원 삭제에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('회원 삭제 오류:', error);
      toast({
        title: "오류",
        description: "회원 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      nickname: user.nickname || '',
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate,
      role: user.role,
      status: user.status
    });
    setShowUserModal(true);
  };

  const handleMileageManagement = (user: User) => {
    setSelectedUserForMileage(user);
    setShowMileageModal(true);
  };

  const handleUserUpdate = (updatedUser: User) => {
    console.log('handleUserUpdate 호출됨:', updatedUser);
    
    // 선택된 사용자가 업데이트된 사용자와 같다면 업데이트
    if (selectedUser && selectedUser.id === updatedUser.id) {
      console.log('선택된 사용자 업데이트:', selectedUser.mileage, '→', updatedUser.mileage);
      setSelectedUser(updatedUser);
    }
    
    // 사용자 목록에서도 업데이트
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    // 필수 필드 검증
    if (!editForm.name || !editForm.email || !editForm.nickname) {
      toast({
        title: "필수 정보 누락",
        description: "이름, 이메일, 닉네임은 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }
    
    // 관리자 권한 확인
    if (currentUserRole !== 'admin') {
      toast({
        title: "권한 부족",
        description: "관리자만 회원 정보를 수정할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('토큰:', token ? '존재함' : '없음');
      console.log('수정할 데이터:', editForm);
      console.log('현재 사용자 권한:', currentUserRole);
      
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      
      const data = await res.json();
      console.log('API 응답:', data);
      
      if (data.success) {
        toast({
          title: "수정 완료",
          description: "회원 정보가 수정되었습니다.",
        });
        
        // 선택된 사용자 정보 새로고침 (마일리지 포함)
        if (selectedUser) {
          const userResponse = await fetch(`/api/admin/users/search?q=${selectedUser.username}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData.success && userData.users.length > 0) {
              setSelectedUser(userData.users[0]);
            }
          }
        }
        
        fetchUsers(); // 목록 새로고침
        setShowUserModal(false); // 모달 자동 닫기
      } else {
        toast({
          title: "수정 실패",
          description: data.error || "회원 정보 수정에 실패했습니다.",
          variant: "destructive",
        });
        console.error('수정 실패 상세:', data);
      }
    } catch (error) {
      console.error('수정 중 오류:', error);
      toast({
        title: "오류",
        description: "회원 정보 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };





  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
            {currentUserRole && (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-500">
                  현재 권한: {currentUserRole === 'admin' ? '관리자' : 
                             currentUserRole === 'staff' ? '직원' : 
                             currentUserRole === 'customer' ? '일반회원' : currentUserRole}
                </p>
                {currentUserRole === 'admin' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    모든 권한
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>회원 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="이름 또는 닉네임으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pending">승인대기</SelectItem>
                  <SelectItem value="approved">승인완료</SelectItem>
                  <SelectItem value="suspended">정지</SelectItem>
                  <SelectItem value="banned">차단</SelectItem>
                </SelectContent>
              </Select>
              <Select value={onlineFilter} onValueChange={v => setOnlineFilter(v as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="online">접속중</SelectItem>
                  <SelectItem value="offline">오프라인</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isLoading ? (
              <div className="py-12 text-center text-gray-500">로딩 중...</div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center text-gray-500">회원이 없습니다.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">아이디</th>
                      <th className="p-2 border">이름/닉네임</th>
                      <th className="p-2 border">전화번호</th>
                      <th className="p-2 border">생년월일</th>
                      <th className="p-2 border">권한</th>
                      <th className="p-2 border">상태</th>
                      <th className="p-2 border">접속상태</th>
                      <th className="p-2 border">마일리지</th>
                      <th className="p-2 border">가입일</th>
                      <th className="p-2 border">최근 로그인</th>
                      <th className="p-2 border">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="text-center">
                        <td className="p-2 border">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">👤</span>
                            <span className="font-medium">{user.email.split('@')[0]}</span>
                          </div>
                        </td>
                        <td className="p-2 border">
                          <div className="text-left">
                            <div 
                              className="font-medium cursor-pointer hover:text-blue-600 hover:underline"
                              onClick={() => handleViewUser(user)}
                            >
                              {user.name}
                            </div>
                            {user.nickname && (
                              <div 
                                className="text-sm text-gray-500 cursor-pointer hover:text-blue-600 hover:underline"
                                onClick={() => handleViewUser(user)}
                              >
                                ({user.nickname})
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-2 border">{user.phone}</td>
                        <td className="p-2 border">
                          {user.birthDate ? 
                            new Date(user.birthDate).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            }) : '-'
                          }
                        </td>
                        <td className="p-2 border">
                          <Select value={user.role} onValueChange={(newRole) => handleRoleChange(user.id, newRole)}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">일반회원</SelectItem>
                              <SelectItem value="admin">관리자</SelectItem>
                              <SelectItem value="staff">직원</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2 border">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            user.status === 'approved' ? 'bg-green-100 text-green-800' :
                            user.status === 'suspended' ? 'bg-gray-100 text-gray-800' :
                            user.status === 'banned' ? 'bg-red-100 text-red-800' : ''
                          }`}>
                            {user.status === 'pending' ? '승인대기' : 
                             user.status === 'approved' ? '승인완료' : 
                             user.status === 'suspended' ? '정지' : 
                             user.status === 'banned' ? '차단' : user.status}
                          </span>
                        </td>
                        <td className="p-2 border">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {user.isOnline ? '🟢 접속중' : '⚫ 오프라인'}
                            </span>
                            {user.isOnline && user.sessionDuration && (
                              <span className="text-xs text-blue-600">
                                {user.sessionDuration}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-2 border">
                          <span className="font-medium">
                            {user.mileage?.toLocaleString() || '0'}
                          </span>
                        </td>
                        <td className="p-2 border">{user.createdAt?.slice(0,10)}</td>
                        <td className="p-2 border">{user.lastLogin?.slice(0,10) || '-'}</td>
                        <td className="p-2 border">
                          <div className="flex gap-2">
                            {user.status === 'pending' && (
                              <Button size="sm" onClick={() => handleApprove(user.id)}>
                                승인
                              </Button>
                            )}
                            {user.status !== 'pending' && (
                              <Button 
                                size="sm" 
                                variant={user.status === 'banned' ? 'outline' : 'destructive'}
                                onClick={() => handleBanToggle(user.id, user.status)}
                              >
                                {user.status === 'banned' ? '차단해제' : '차단'}
                              </Button>
                            )}
                            {currentUserRole === 'admin' && (
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                삭제
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 회원 상세보기 모달 */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">회원 정보 수정</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* 이름 */}
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  이름 *
                </Label>
                <Input
                  id="name"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  placeholder="이름을 입력하세요"
                />
              </div>
              
              {/* 닉네임 */}
              <div>
                <Label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                  닉네임 *
                </Label>
                <Input
                  id="nickname"
                  value={editForm.nickname || ''}
                  onChange={(e) => setEditForm({...editForm, nickname: e.target.value})}
                  placeholder="닉네임을 입력하세요"
                  required
                />
              </div>
              
              {/* 이메일 */}
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일 *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  placeholder="이메일을 입력하세요"
                />
              </div>
              
              {/* 전화번호 */}
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  전화번호 *
                </Label>
                <Input
                  id="phone"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  placeholder="전화번호를 입력하세요"
                />
              </div>
              
              {/* 생년월일 */}
              <div>
                <Label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                  생년월일
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={editForm.birthDate || ''}
                  onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})}
                />
              </div>
              
              {/* 권한 */}
              <div>
                <Label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  권한
                </Label>
                <Select value={editForm.role || ''} onValueChange={(value) => setEditForm({...editForm, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="권한을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">일반회원</SelectItem>
                    <SelectItem value="staff">직원</SelectItem>
                    <SelectItem value="admin">관리자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* 상태 */}
              <div>
                <Label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  상태
                </Label>
                <Select value={editForm.status || ''} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="상태를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">승인대기</SelectItem>
                    <SelectItem value="approved">승인완료</SelectItem>
                    <SelectItem value="suspended">정지</SelectItem>
                    <SelectItem value="banned">차단</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* 마일리지 정보 표시 */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  현재 마일리지
                </Label>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    {selectedUser.mileage?.toLocaleString() || 0}원
                  </span>
                  {currentUserRole === 'admin' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMileageManagement(selectedUser)}
                    >
                      마일리지 관리
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">가입일</Label>
                <p className="text-gray-900">{selectedUser.createdAt?.slice(0,10)}</p>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">최근 로그인</Label>
                <p className="text-gray-900">{selectedUser.lastLogin?.slice(0,10) || '-'}</p>
              </div>
              
              {/* 접속 상태 */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">접속 상태</Label>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    selectedUser.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedUser.isOnline ? '🟢 접속중' : '⚫ 오프라인'}
                  </span>
                  {selectedUser.isOnline && selectedUser.sessionDuration && (
                    <span className="text-xs text-blue-600">
                      (접속시간: {selectedUser.sessionDuration})
                    </span>
                  )}
                </div>
                {selectedUser.isOnline && selectedUser.lastActivity && (
                  <p className="text-xs text-gray-500 mt-1">
                    마지막 활동: {new Date(selectedUser.lastActivity).toLocaleString('ko-KR')}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              {currentUserRole === 'admin' && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowUserModal(false);
                    // 약간의 지연 후 삭제 실행 (모달이 완전히 닫힌 후)
                    setTimeout(() => {
                      handleDeleteUser(selectedUser.id, selectedUser.name);
                    }, 100);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  삭제
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setShowUserModal(false)}
              >
                취소
              </Button>
              <Button
                onClick={handleEditUser}
                disabled={isSaving}
              >
                {isSaving ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 마일리지 관리 모달 */}
              <MileageManagementModal
          isOpen={showMileageModal}
          onClose={() => {
            setShowMileageModal(false);
            setSelectedUserForMileage(null);
          }}
          selectedUser={selectedUserForMileage}
          onUserUpdate={handleUserUpdate}
        />
    </AdminLayout>
  );
} 