'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  Bell,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Notice, NoticeStatus } from '@/lib/types';
import Link from 'next/link';

interface NoticeListResponse {
  notices: Notice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoadingNotices, setIsLoadingNotices] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchNotices();
  }, [currentPage, statusFilter]);

  const fetchNotices = async () => {
    try {
      setIsLoadingNotices(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: statusFilter,
        search: search
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/notices?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotices(data.data.notices);
        setPagination(data.data.pagination);
      } else {
        console.error('공지사항 조회 실패:', data.error);
      }
    } catch (error) {
      console.error('공지사항 조회 오류:', error);
    } finally {
      setIsLoadingNotices(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchNotices();
  };

  const handleDelete = async (noticeId: string) => {
    if (!confirm('이 공지사항을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/notices/${noticeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('공지사항이 삭제되었습니다.');
        fetchNotices();
      } else {
        alert(data.error || '삭제에 실패했습니다.');
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const getStatusBadge = (status: NoticeStatus) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">게시됨</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">임시저장</Badge>;
      case 'archived':
        return <Badge className="bg-orange-100 text-orange-800">보관됨</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoadingNotices) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-spinner" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
            <p className="text-gray-600">고객센터 공지사항을 관리합니다.</p>
          </div>
          <Link href="/admin/notices/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              새 공지사항 작성
            </Button>
          </Link>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">전체 공지</p>
                  <p className="text-xl font-bold">{pagination.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm text-gray-600">게시됨</p>
                  <p className="text-xl font-bold">
                    {notices.filter(n => n.status === 'published').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <div>
                  <p className="text-sm text-gray-600">임시저장</p>
                  <p className="text-xl font-bold">
                    {notices.filter(n => n.status === 'draft').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div>
                  <p className="text-sm text-gray-600">중요 공지</p>
                  <p className="text-xl font-bold">
                    {notices.filter(n => n.isImportant).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 필터 및 검색 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="제목, 내용, 작성자로 검색..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="published">게시됨</SelectItem>
                  <SelectItem value="draft">임시저장</SelectItem>
                  <SelectItem value="archived">보관됨</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 공지사항 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>공지사항 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {notices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                등록된 공지사항이 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">제목</th>
                      <th className="text-left p-3">상태</th>
                      <th className="text-left p-3">작성자</th>
                      <th className="text-left p-3">조회수</th>
                      <th className="text-left p-3">작성일</th>
                      <th className="text-left p-3">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notices.map((notice) => (
                      <tr key={notice.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {notice.isImportant && (
                              <Bell className="w-4 h-4 text-red-500" />
                            )}
                            <span className="font-medium">{notice.title}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          {getStatusBadge(notice.status)}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-gray-400" />
                            {notice.author}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-gray-400" />
                            {notice.viewCount}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(notice.createdAt)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <Link href={`/admin/notices/${notice.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(notice.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  총 {pagination.total}개 중 {((pagination.page - 1) * pagination.limit) + 1}-
                  {Math.min(pagination.page * pagination.limit, pagination.total)}개 표시
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">
                    {currentPage} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentPage >= pagination.totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}