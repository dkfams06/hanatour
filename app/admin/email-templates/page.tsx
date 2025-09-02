'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Edit, 
  Eye, 
  Trash2, 
  Plus, 
  Mail, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  html_content: string;
  text_content?: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const templateTypeLabels = {
  booking_confirmation: { label: '예약 확인', icon: CheckCircle, color: 'bg-blue-100 text-blue-800' },
  payment_completed: { label: '결제 완료', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  payment_expired: { label: '입금 만료', icon: XCircle, color: 'bg-red-100 text-red-800' },
  payment_reminder: { label: '입금 알림', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  registration_completed: { label: '회원가입 완료', icon: CheckCircle, color: 'bg-purple-100 text-purple-800' }
};

export default function EmailTemplatesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchTemplates();
    }
  }, [user]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/email-templates');
      const result = await response.json();
      
      if (result.success) {
        setTemplates(result.data.map((template: any) => ({
          ...template,
          variables: template.variables ? JSON.parse(template.variables) : []
        })));
      } else {
        toast.error('템플릿 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('템플릿 조회 에러:', error);
      toast.error('템플릿 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setIsEditDialogOpen(true);
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  const handleSaveTemplate = async (templateData: Partial<EmailTemplate>) => {
    try {
      const isNewTemplate = !templateData.id;
      const method = isNewTemplate ? 'POST' : 'PUT';
      
      const response = await fetch('/api/admin/email-templates', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(isNewTemplate ? '템플릿이 생성되었습니다.' : '템플릿이 수정되었습니다.');
        setIsEditDialogOpen(false);
        setEditingTemplate(null);
        fetchTemplates();
      } else {
        toast.error(result.error || (isNewTemplate ? '템플릿 생성에 실패했습니다.' : '템플릿 수정에 실패했습니다.'));
      }
    } catch (error) {
      console.error('템플릿 저장 에러:', error);
      toast.error('템플릿 저장에 실패했습니다.');
    }
  };

  const handleToggleActive = async (templateId: string, isActive: boolean) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      const response = await fetch('/api/admin/email-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...template,
          is_active: isActive
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`템플릿이 ${isActive ? '활성화' : '비활성화'}되었습니다.`);
        fetchTemplates();
      } else {
        toast.error(result.error || '템플릿 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('템플릿 상태 변경 에러:', error);
      toast.error('템플릿 상태 변경에 실패했습니다.');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('정말로 이 템플릿을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/email-templates/${templateId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('템플릿이 삭제되었습니다.');
        fetchTemplates();
      } else {
        toast.error(result.error || '템플릿 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('템플릿 삭제 에러:', error);
      toast.error('템플릿 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">이메일 템플릿 관리</h1>
            <p className="text-gray-600 mt-2">자동 발송되는 이메일의 내용을 관리합니다.</p>
          </div>
          <Button onClick={() => {
            setEditingTemplate(null);
            setIsEditDialogOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            새 템플릿
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>템플릿 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>템플릿명</TableHead>
                    <TableHead>타입</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>수정일</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => {
                    const typeInfo = templateTypeLabels[template.type as keyof typeof templateTypeLabels];
                    const IconComponent = typeInfo?.icon || Mail;
                    
                    return (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>
                          <Badge className={typeInfo?.color}>
                            <IconComponent className="w-3 h-3 mr-1" />
                            {typeInfo?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{template.subject}</TableCell>
                        <TableCell>
                          <Switch
                            checked={template.is_active}
                            onCheckedChange={(checked) => handleToggleActive(template.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(template.updated_at).toLocaleDateString('ko-KR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreviewTemplate(template)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTemplate(template)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTemplate(template.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* 편집 다이얼로그 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? '템플릿 편집' : '새 템플릿 생성'}
              </DialogTitle>
            </DialogHeader>
            <EmailTemplateForm
              template={editingTemplate || {
                id: '',
                name: '',
                type: 'registration_completed',
                subject: '',
                html_content: '',
                text_content: '',
                variables: [],
                is_active: true,
                created_at: '',
                updated_at: ''
              }}
              onSave={handleSaveTemplate}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingTemplate(null);
              }}
              isNew={!editingTemplate}
            />
          </DialogContent>
        </Dialog>

        {/* 미리보기 다이얼로그 */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>이메일 미리보기</DialogTitle>
            </DialogHeader>
            {previewTemplate && (
              <div className="mt-4">
                <div className="mb-4">
                  <Label>제목</Label>
                  <Input value={previewTemplate.subject} readOnly />
                </div>
                <div>
                  <Label>내용</Label>
                  <div 
                    className="border rounded-md p-4 mt-2 bg-white"
                    dangerouslySetInnerHTML={{ __html: previewTemplate.html_content }}
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

// 이메일 템플릿 편집 폼 컴포넌트
interface EmailTemplateFormProps {
  template: EmailTemplate;
  onSave: (data: Partial<EmailTemplate>) => void;
  onCancel: () => void;
  isNew?: boolean;
}

function EmailTemplateForm({ template, onSave, onCancel, isNew = false }: EmailTemplateFormProps) {
  const [formData, setFormData] = useState({
    name: template.name,
    type: template.type,
    subject: template.subject,
    html_content: template.html_content,
    text_content: template.text_content || '',
    is_active: template.is_active
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: template.id,
      ...formData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">템플릿명</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="type">템플릿 타입</Label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
          disabled={!isNew} // 기존 템플릿은 타입 변경 불가
        >
          <option value="booking_confirmation">예약 확인</option>
          <option value="payment_completed">결제 완료</option>
          <option value="payment_expired">입금 만료</option>
          <option value="payment_reminder">입금 알림</option>
          <option value="registration_completed">회원가입 완료</option>
        </select>
        {!isNew && (
          <p className="text-sm text-gray-500 mt-1">기존 템플릿의 타입은 변경할 수 없습니다.</p>
        )}
      </div>

      <div>
        <Label htmlFor="subject">이메일 제목</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="html_content">HTML 내용</Label>
        <Textarea
          id="html_content"
          value={formData.html_content}
          onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
          rows={20}
          required
        />
      </div>

      <div>
        <Label htmlFor="text_content">텍스트 내용 (선택사항)</Label>
        <Textarea
          id="text_content"
          value={formData.text_content}
          onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
          rows={10}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">활성화</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">
          저장
        </Button>
      </div>
    </form>
  );
} 