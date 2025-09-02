'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send, User, Phone, Mail, FileText, AlertCircle } from 'lucide-react';
import { InquiryCategory } from '@/lib/types';

export default function InquiryPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    category: '' as InquiryCategory,
    subject: '',
    content: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 전화번호 자동 포맷팅
  const formatPhoneNumber = (phone: string) => {
    const numbers = phone.replace(/[^\d]/g, '');
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // 전화번호 자동 포맷팅
    if (field === 'customerPhone') {
      value = formatPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 실시간 에러 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = '이름을 입력해주세요.';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = '전화번호를 입력해주세요.';
    } else if (!/^01[0-9]-\d{4}-\d{4}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = '전화번호는 010-1234-5678 형식으로 입력해주세요.';
    }

    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = '이메일 형식이 올바르지 않습니다.';
    }

    if (!formData.category) {
      newErrors.category = '문의 카테고리를 선택해주세요.';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = '제목을 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '문의 내용을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "문의 접수 완료",
          description: `문의가 성공적으로 접수되었습니다. 문의번호: ${data.data.inquiryNumber}`,
        });

        // 폼 초기화
        setFormData({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          category: '' as InquiryCategory,
          subject: '',
          content: ''
        });
      } else {
        toast({
          title: "문의 접수 실패",
          description: data.error || '문의 접수 중 오류가 발생했습니다.',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: '문의 접수 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: 'general', label: '일반 문의' },
    { value: 'booking', label: '예약 문의' },
    { value: 'payment', label: '결제 문의' },
    { value: 'refund', label: '환불 문의' },
    { value: 'tour', label: '여행상품 문의' },
    { value: 'technical', label: '기술지원' },
    { value: 'other', label: '기타' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">1:1 문의</h1>
          <p className="text-lg text-gray-600">
            궁금한 점이나 문의사항이 있으시면 언제든 연락주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 문의 양식 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  문의 작성
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 고객 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">이름 *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="홍길동"
                        disabled={isSubmitting}
                        className={errors.customerName ? 'border-red-500' : ''}
                      />
                      {errors.customerName && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="customerPhone">전화번호 *</Label>
                      <Input
                        id="customerPhone"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="010-1234-5678"
                        disabled={isSubmitting}
                        className={errors.customerPhone ? 'border-red-500' : ''}
                      />
                      {errors.customerPhone && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customerEmail">이메일 (선택)</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      placeholder="example@email.com"
                      disabled={isSubmitting}
                      className={errors.customerEmail ? 'border-red-500' : ''}
                    />
                    {errors.customerEmail && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
                    )}
                  </div>

                  {/* 문의 정보 */}
                  <div>
                    <Label htmlFor="category">문의 카테고리 *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleInputChange('category', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="카테고리를 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="subject">제목 *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="문의 제목을 입력해주세요"
                      disabled={isSubmitting}
                      className={errors.subject ? 'border-red-500' : ''}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="content">문의 내용 *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="문의 내용을 자세히 입력해주세요..."
                      rows={8}
                      disabled={isSubmitting}
                      className={errors.content ? 'border-red-500' : ''}
                    />
                    {errors.content && (
                      <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                    )}
                  </div>

                  {/* 제출 버튼 */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Send className="w-4 h-4 mr-2 animate-spin" />
                        접수 중...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        문의 접수
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* 안내 정보 */}
          <div className="space-y-6">
            {/* 문의 안내 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  문의 안내
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• 문의 접수 후 영업일 기준 1-2일 내에 답변드립니다.</p>
                  <p>• 긴급한 문의는 고객센터(1588-1234)로 연락주세요.</p>
                  <p>• 개인정보는 안전하게 보호됩니다.</p>
                </div>
              </CardContent>
            </Card>

            {/* 연락처 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  연락처 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">1588-1234</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">dkfams06@naver.com</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">평일 09:00 - 18:00</span>
                </div>
              </CardContent>
            </Card>

            {/* 자주 묻는 질문 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  자주 묻는 질문
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <details className="group">
                    <summary className="cursor-pointer font-medium hover:text-blue-600">
                      예약 변경은 어떻게 하나요?
                    </summary>
                    <p className="mt-2 text-gray-600">
                      예약 확인 페이지에서 "예약 취소 요청" 버튼을 클릭하거나 고객센터로 연락주세요.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="cursor-pointer font-medium hover:text-blue-600">
                      환불은 언제 처리되나요?
                    </summary>
                    <p className="mt-2 text-gray-600">
                      환불은 영업일 기준 3-5일 내에 처리됩니다.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="cursor-pointer font-medium hover:text-blue-600">
                      결제 방법은 어떤 것이 있나요?
                    </summary>
                    <p className="mt-2 text-gray-600">
                      신용카드, 계좌이체, 무통장입금 등 다양한 결제 방법을 제공합니다.
                    </p>
                  </details>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 