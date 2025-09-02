'use client';

import { useState } from 'react';
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
  Bell
} from 'lucide-react';
import Link from 'next/link';
import { NoticeStatus } from '@/lib/types';

interface NoticeForm {
  title: string;
  content: string;
  isImportant: boolean;
  status: NoticeStatus;
}

export default function AdminNoticeNewPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<NoticeForm>({
    title: '',
    content: '',
    isImportant: false,
    status: 'draft'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('공지사항이 성공적으로 저장되었습니다.');
        router.push('/admin/notices');
      } else {
        alert(data.error || '저장에 실패했습니다.');
      }
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    const draftData = { ...formData, status: 'draft' as NoticeStatus };
    setFormData(draftData);
    
    // 임시저장 로직을 여기에 구현할 수 있습니다
    await handleSubmitWithData(draftData);
  };

  const handlePublish = async () => {
    const publishData = { ...formData, status: 'published' as NoticeStatus };
    setFormData(publishData);
    
    await handleSubmitWithData(publishData);
  };

  const handleSubmitWithData = async (data: NoticeForm) => {
    if (!data.title.trim() || !data.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        const message = data.status === 'published' ? '공지사항이 게시되었습니다.' : '공지사항이 임시저장되었습니다.';
        alert(message);
        router.push('/admin/notices');
      } else {
        alert(result.error || '저장에 실패했습니다.');
      }
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
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
            <h1 className="text-2xl font-bold text-gray-900">새 공지사항 작성</h1>
            <p className="text-gray-600">고객센터에 게시할 공지사항을 작성합니다.</p>
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
                  <CardTitle className="text-sm">작성자 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    <p>작성자: {user.name || user.username}</p>
                    <p>작성일: {new Date().toLocaleDateString('ko-KR')}</p>
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