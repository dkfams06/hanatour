'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Inquiry, InquiryStatus, InquiryPriority, InquiryCategory } from '@/lib/types';

export default function AdminInquiriesPage() {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isResponseOpen, setIsResponseOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 필터 상태
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    search: '',
    assignedTo: '',
    startDate: '',
    endDate: ''
  });

  // 페이지네이션
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // 답변 폼
  const [responseForm, setResponseForm] = useState({
    content: '',
    adminName: '관리자',
    isInternal: false
  });

  // 문의 목록 조회
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // 필터 파라미터 추가
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value);
      });
      
      // 페이지네이션 파라미터 추가
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(`/api/inquiries?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setInquiries(result.data);
        setPagination(prev => ({
          ...prev,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages
        }));
      } else {
        toast({
          title: "오류",
          description: result.error || '문의 목록 조회에 실패했습니다.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('문의 목록 조회 오류:', error);
      toast({
        title: "오류",
        description: '문의 목록 조회 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 문의 상세 조회
  const fetchInquiryDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`);
      const result = await response.json();

      if (result.success) {
        setSelectedInquiry(result.data.inquiry);
        setIsDetailOpen(true);
      } else {
        toast({
          title: "오류",
          description: result.error || '문의 상세 조회에 실패했습니다.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('문의 상세 조회 오류:', error);
      toast({
        title: "오류",
        description: '문의 상세 조회 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    }
  };

  // 상태 변경
  const handleStatusChange = async (inquiryId: string, newStatus: InquiryStatus) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "성공",
          description: '문의 상태가 변경되었습니다.',
        });
        fetchInquiries();
      } else {
        toast({
          title: "오류",
          description: result.error || '상태 변경에 실패했습니다.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('상태 변경 오류:', error);
      toast({
        title: "오류",
        description: '상태 변경 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    }
  };

  // 답변 등록
  const handleSubmitResponse = async () => {
    if (!selectedInquiry || !responseForm.content.trim()) {
      toast({
        title: "오류",
        description: '답변 내용을 입력해주세요.',
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/inquiries/${selectedInquiry.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseForm),
      });

      const result = await response.json();

      if (result.success) {
        const message = responseForm.isInternal 
          ? '내부 메모가 등록되었습니다.'
          : '답변이 등록되었습니다. 문의 상태가 완료로 변경되었습니다.';
        
        toast({
          title: "성공",
          description: message,
        });
        setIsResponseOpen(false);
        setResponseForm({ content: '', adminName: '관리자', isInternal: false });
        
        // 문의 목록 새로고침
        await fetchInquiries();
        
        // 상세 모달이 열려있다면 상세 정보도 업데이트 (내부 메모가 아닌 경우에만)
        if (isDetailOpen && selectedInquiry && !responseForm.isInternal) {
          await fetchInquiryDetail(selectedInquiry.id);
        }
      } else {
        toast({
          title: "오류",
          description: result.error || '답변 등록에 실패했습니다.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('답변 등록 오류:', error);
      toast({
        title: "오류",
        description: '답변 등록 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 문의 삭제
  const handleDeleteInquiry = async (inquiryId: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "성공",
          description: '문의가 삭제되었습니다.',
        });
        setIsDeleteOpen(false);
        fetchInquiries();
      } else {
        toast({
          title: "오류",
          description: result.error || '문의 삭제에 실패했습니다.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('문의 삭제 오류:', error);
      toast({
        title: "오류",
        description: '문의 삭제 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    }
  };

  // 상태별 배지 색상
  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">대기</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">처리중</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-700">완료</Badge>;
      case 'closed':
        return <Badge variant="outline" className="border-gray-500 text-gray-700">종료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 우선순위별 배지 색상
  const getPriorityBadge = (priority: InquiryPriority) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="border-gray-500 text-gray-700">낮음</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">보통</Badge>;
      case 'high':
        return <Badge variant="outline" className="border-orange-500 text-orange-700">높음</Badge>;
      case 'urgent':
        return <Badge variant="outline" className="border-red-500 text-red-700">긴급</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // 카테고리별 라벨
  const getCategoryLabel = (category: InquiryCategory) => {
    const labels = {
      general: '일반',
      booking: '예약',
      payment: '결제',
      refund: '환불',
      tour: '여행상품',
      technical: '기술지원',
      other: '기타'
    };
    return labels[category] || category;
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    fetchInquiries();
  }, [filters, pagination.page]);

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">1:1 문의 관리</h1>
          <Button onClick={() => window.open('/inquiry', '_blank')}>
            <Plus className="w-4 h-4 mr-2" />
            새 문의 보기
          </Button>
        </div>

        {/* 필터 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              필터
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>검색</Label>
                <Input
                  placeholder="문의번호, 고객명, 제목..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <div>
                <Label>상태</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="pending">대기</SelectItem>
                    <SelectItem value="in_progress">처리중</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                    <SelectItem value="closed">종료</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>카테고리</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="general">일반</SelectItem>
                    <SelectItem value="booking">예약</SelectItem>
                    <SelectItem value="payment">결제</SelectItem>
                    <SelectItem value="refund">환불</SelectItem>
                    <SelectItem value="tour">여행상품</SelectItem>
                    <SelectItem value="technical">기술지원</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>우선순위</Label>
                <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="low">낮음</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="high">높음</SelectItem>
                    <SelectItem value="urgent">긴급</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 문의 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>문의 목록 ({pagination.total}건)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">로딩 중...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>문의번호</TableHead>
                    <TableHead>고객명</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>우선순위</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead>답변수</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="font-medium">{inquiry.inquiryNumber}</TableCell>
                      <TableCell>{inquiry.customerName}</TableCell>
                      <TableCell className="max-w-xs truncate">{inquiry.subject}</TableCell>
                      <TableCell>{getCategoryLabel(inquiry.category)}</TableCell>
                      <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                      <TableCell>{getPriorityBadge(inquiry.priority)}</TableCell>
                      <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{inquiry.responseCount || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fetchInquiryDetail(inquiry.id)}
                            title="상세보기"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setIsResponseOpen(true);
                            }}
                            title="답변"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setIsDeleteOpen(true);
                            }}
                            title="삭제"
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page }))}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 문의 상세 모달 */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>문의 상세</DialogTitle>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-6">
                {/* 문의 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">문의번호</Label>
                    <p className="text-lg font-semibold">{selectedInquiry.inquiryNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">등록일</Label>
                    <p>{formatDate(selectedInquiry.createdAt)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">고객명</Label>
                    <p>{selectedInquiry.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">전화번호</Label>
                    <p>{selectedInquiry.customerPhone}</p>
                  </div>
                  {selectedInquiry.customerEmail && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">이메일</Label>
                      <p>{selectedInquiry.customerEmail}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-gray-500">카테고리</Label>
                    <p>{getCategoryLabel(selectedInquiry.category)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">상태</Label>
                    <div className="mt-1">{getStatusBadge(selectedInquiry.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">우선순위</Label>
                    <div className="mt-1">{getPriorityBadge(selectedInquiry.priority)}</div>
                  </div>
                  {selectedInquiry.assignedTo && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">담당자</Label>
                      <p>{selectedInquiry.assignedTo}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* 문의 내용 */}
                <div>
                  <Label className="text-sm font-medium text-gray-500">제목</Label>
                  <p className="text-lg font-semibold mt-1">{selectedInquiry.subject}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">내용</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-line">
                    {selectedInquiry.content}
                  </div>
                </div>

                {selectedInquiry.adminNotes && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium text-gray-500">관리자 메모</Label>
                      <div className="mt-2 p-4 bg-yellow-50 rounded-lg whitespace-pre-line">
                        {selectedInquiry.adminNotes}
                      </div>
                    </div>
                  </>
                )}

                {/* 상태 변경 버튼 */}
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-gray-500 mb-2 block">상태 변경</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(selectedInquiry.id, 'pending')}
                      disabled={selectedInquiry.status === 'pending'}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      대기
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(selectedInquiry.id, 'in_progress')}
                      disabled={selectedInquiry.status === 'in_progress'}
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      처리중
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(selectedInquiry.id, 'completed')}
                      disabled={selectedInquiry.status === 'completed'}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      완료
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(selectedInquiry.id, 'closed')}
                      disabled={selectedInquiry.status === 'closed'}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      종료
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 답변 등록 모달 */}
        <Dialog open={isResponseOpen} onOpenChange={setIsResponseOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>답변 등록</DialogTitle>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">문의 제목</Label>
                  <p className="text-lg font-semibold">{selectedInquiry.subject}</p>
                </div>
                <div>
                  <Label htmlFor="response-content">답변 내용 *</Label>
                  <Textarea
                    id="response-content"
                    value={responseForm.content}
                    onChange={(e) => setResponseForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="답변 내용을 입력하세요..."
                    rows={6}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="admin-name">답변자</Label>
                    <Input
                      id="admin-name"
                      value={responseForm.adminName}
                      onChange={(e) => setResponseForm(prev => ({ ...prev, adminName: e.target.value }))}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={responseForm.isInternal}
                        onChange={(e) => setResponseForm(prev => ({ ...prev, isInternal: e.target.checked }))}
                        disabled={isSubmitting}
                      />
                      <span className="text-sm">내부 메모</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsResponseOpen(false)}
                    disabled={isSubmitting}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleSubmitResponse}
                    disabled={isSubmitting || !responseForm.content.trim()}
                  >
                    {isSubmitting ? '등록 중...' : '답변 등록'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 삭제 확인 모달 */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>문의 삭제</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>정말 이 문의를 삭제하시겠습니까?</p>
              {selectedInquiry && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="font-medium">{selectedInquiry.inquiryNumber}</p>
                  <p className="text-sm text-gray-600">{selectedInquiry.subject}</p>
                </div>
              )}
              <p className="text-sm text-red-600">이 작업은 되돌릴 수 없습니다.</p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  취소
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => selectedInquiry && handleDeleteInquiry(selectedInquiry.id)}
                >
                  삭제
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
} 