'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  ArrowLeft,
  FileText,
  Bell,
  Calendar,
  User
} from 'lucide-react';
import Link from 'next/link';
import { Notice, NoticeStatus } from '@/lib/types';

interface NoticeForm {
  title: string;
  content: string;
  isImportant: boolean;
  status: NoticeStatus;
}

interface AdminNoticeEditPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminNoticeEditPage({ params }: AdminNoticeEditPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  
  const [noticeId, setNoticeId] = useState<string>('');
  const [notice, setNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState<NoticeForm>({
    title: '',
    content: '',
    isImportant: false,
    status: 'draft'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setNoticeId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (noticeId) {
      fetchNotice();
    }
  }, [noticeId]);

  const fetchNotice = async () => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/notices/${noticeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const noticeData = data.data;
        setNotice(noticeData);
        setFormData({
          title: noticeData.title,
          content: noticeData.content,
          isImportant: noticeData.isImportant,
          status: noticeData.status
        });
      } else {
        alert('공지사항을 불러올 수 없습니다.');
        router.push('/admin/notices');
      }
    } catch (error) {
      alert('공지사항을 불러오는 중 오류가 발생했습니다.');
      router.push('/admin/notices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleUpdate();
  };

  const handleUpdate = async (statusOverride?: NoticeStatus) => {
    const updateData = statusOverride ? { ...formData, status: statusOverride } : formData;
    
    if (!updateData.title.trim() || !updateData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/notices/${noticeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        const message = statusOverride === 'published' ? '공지사항이 게시되었습니다.' : '공지사항이 수정되었습니다.';
        alert(message);
        router.push('/admin/notices');
      } else {
        alert(data.error || '수정에 실패했습니다.');
      }
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    handleUpdate('draft');
  };

  const handlePublish = () => {
    handleUpdate('published');
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

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-spinner" />
        </div>
      </AdminLayout>
    );
  }

  if (!notice) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p>공지사항을 찾을 수 없습니다.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center gap-4">
          <Link href="/admin/notices">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">공지사항 수정</h1>
            <p className="text-gray-600">공지사항 정보를 수정합니다.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    기본 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">제목 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="공지사항 제목을 입력하세요"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">내용 *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="공지사항 내용을 입력하세요"
                      rows={15}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    게시 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">게시 상태</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: NoticeStatus) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">임시저장</SelectItem>
                        <SelectItem value="published">게시됨</SelectItem>
                        <SelectItem value="archived">보관됨</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isImportant"
                      checked={formData.isImportant}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isImportant: checked }))}
                    />
                    <Label htmlFor="isImportant">중요 공지사항</Label>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    중요 공지사항은 목록 상단에 우선 표시됩니다.
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Button
                      type="button"
                      onClick={handleSaveDraft}
                      variant="outline"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      임시저장
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={handlePublish}
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      {isSubmitting ? '저장 중...' : '게시하기'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">공지사항 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>작성자: {notice.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>작성일: {formatDate(notice.createdAt)}</span>
                  </div>
                  {notice.updatedAt !== notice.createdAt && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>수정일: {formatDate(notice.updatedAt)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Bell className="w-4 h-4" />
                    <span>조회수: {notice.viewCount}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}