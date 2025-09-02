'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  MessageCircle, 
  HelpCircle,
  FileText,
  Shield,
  CreditCard,
  Calendar,
  Users,
  ChevronRight,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  isPopular?: boolean;
}

const faqs: FAQ[] = [
  {
    id: 1,
    category: '예약/결제',
    question: '예약은 어떻게 하나요?',
    answer: '상품 상세 페이지에서 날짜와 인원을 선택한 후 예약 신청을 하시면 됩니다. 비회원도 예약 가능하며, 예약 완료 후 예약번호가 발급됩니다.',
    isPopular: true
  },
  {
    id: 2,
    category: '예약/결제',
    question: '결제는 어떻게 이루어지나요?',
    answer: '현재는 무통장입금으로 결제를 진행하고 있습니다. 예약 완료 후 안내받은 계좌로 입금해주시면 됩니다.',
    isPopular: true
  },
  {
    id: 3,
    category: '취소/환불',
    question: '예약 취소는 어떻게 하나요?',
    answer: '예약 확인 페이지에서 "예약 취소 요청" 버튼을 클릭하시거나 고객센터로 연락주시면 됩니다. 취소 수수료는 출발일 기준으로 차등 적용됩니다.',
    isPopular: true
  },
  {
    id: 4,
    category: '취소/환불',
    question: '환불은 언제 받을 수 있나요?',
    answer: '취소 신청 승인 후 영업일 기준 3-5일 내에 환불이 완료됩니다. 환불 완료 시 별도 안내를 드립니다.'
  },
  {
    id: 5,
    category: '회원/계정',
    question: '회원가입을 꼭 해야 하나요?',
    answer: '회원가입 없이도 예약이 가능합니다. 다만 회원가입 시 예약 내역 관리, 찜하기, 후기 작성 등의 추가 서비스를 이용하실 수 있습니다.'
  },
  {
    id: 6,
    category: '상품/일정',
    question: '최소 출발 인원이 있나요?',
    answer: '상품에 따라 최소 출발 인원이 다릅니다. 상품 상세 페이지에서 확인하시거나 고객센터로 문의해주세요.'
  },
  {
    id: 7,
    category: '상품/일정',
    question: '일정 변경이 가능한가요?',
    answer: '확정된 일정의 변경은 어려우나, 출발 전 상황에 따라 부분적인 조정이 가능할 수 있습니다. 고객센터로 문의해주세요.'
  },
  {
    id: 8,
    category: '기타',
    question: '여행자 보험은 포함되어 있나요?',
    answer: '기본 여행자 보험이 포함되어 있습니다. 추가 보험 가입을 원하시는 경우 별도 문의해주세요.'
  }
];

const categories = ['전체', '예약/결제', '취소/환불', '회원/계정', '상품/일정', '기타'];

export default function CustomerService() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'general',
    subject: '',
    message: ''
  });

  // 전화번호 자동 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    
    // 길이에 따라 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // 전화번호 입력 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setInquiryForm({...inquiryForm, phone: formatted});
  };
  const { toast } = useToast();

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === '전체' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularFAQs = faqs.filter(faq => faq.isPopular);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // API 호출을 위한 데이터 준비
      const inquiryData = {
        customerName: inquiryForm.name,
        customerPhone: inquiryForm.phone,
        customerEmail: inquiryForm.email,
        category: inquiryForm.category,
        subject: inquiryForm.subject,
        content: inquiryForm.message
      };

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "문의가 접수되었습니다",
          description: "빠른 시일 내에 답변드리겠습니다.",
        });

        // 폼 초기화
        setInquiryForm({
          name: '',
          email: '',
          phone: '',
          category: 'general',
          subject: '',
          message: ''
        });
      } else {
        toast({
          title: "문의 접수 실패",
          description: result.error || "문의 접수에 실패했습니다. 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('문의 제출 오류:', error);
      toast({
        title: "문의 접수 실패",
        description: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">고객센터</h1>
          <p className="text-lg text-gray-600">궁금한 점이 있으시면 언제든지 문의해주세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 연락처 정보 */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  연락처 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="font-semibold">이메일</p>
                    <p className="text-blue-600">help@hanatour.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="font-semibold">운영시간</p>
                    <p className="text-sm text-gray-600">평일 09:00 - 18:00</p>
                    <p className="text-sm text-gray-600">주말/공휴일 휴무</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="font-semibold">주소</p>
                    <p className="text-sm text-gray-600">서울시 강남구 테헤란로 123<br />한아빌딩 10층</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 빠른 링크 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  빠른 서비스
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/booking-lookup" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">예약 확인</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
                
                <a href="/review/write" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">후기 작성</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
                
                <a href="/notice" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">공지사항</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
              </CardContent>
            </Card>
          </div>

          {/* FAQ & 문의 */}
          <div className="lg:col-span-2">
            {/* 인기 FAQ */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  자주 묻는 질문
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularFAQs.map((faq) => (
                    <div
                      key={faq.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm mb-2">{faq.question}</h3>
                      {expandedFAQ === faq.id && (
                        <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 전체 FAQ */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>전체 FAQ</CardTitle>
                <div className="space-y-4">
                  {/* 검색 */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="FAQ 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* 카테고리 필터 */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredFAQs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                          <h3 className="font-semibold">{faq.question}</h3>
                          {faq.isPopular && (
                            <Badge className="text-xs bg-red-500">인기</Badge>
                          )}
                        </div>
                        <ChevronRight 
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            expandedFAQ === faq.id ? 'rotate-90' : ''
                          }`} 
                        />
                      </div>
                      {expandedFAQ === faq.id && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {filteredFAQs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>검색 결과가 없습니다.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 1:1 문의 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  1:1 문의
                </CardTitle>
                <p className="text-sm text-gray-600">FAQ에서 답을 찾지 못하셨나요? 직접 문의해주세요.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이름 *
                      </label>
                      <Input
                        type="text"
                        required
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})}
                        placeholder="이름을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이메일 *
                      </label>
                      <Input
                        type="email"
                        required
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                        placeholder="이메일을 입력하세요"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        연락처 *
                      </label>
                      <Input
                        type="tel"
                        required
                        value={inquiryForm.phone}
                        onChange={handlePhoneChange}
                        placeholder="010-1234-5678"
                        maxLength={13}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        문의 유형 *
                      </label>
                      <Select 
                        value={inquiryForm.category} 
                        onValueChange={(value) => setInquiryForm({...inquiryForm, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="문의 유형을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">일반 문의</SelectItem>
                          <SelectItem value="booking">예약 문의</SelectItem>
                          <SelectItem value="payment">결제 문의</SelectItem>
                          <SelectItem value="refund">환불 문의</SelectItem>
                          <SelectItem value="tour">여행 상품 문의</SelectItem>
                          <SelectItem value="technical">기술 지원</SelectItem>
                          <SelectItem value="other">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      문의 제목 *
                    </label>
                    <Input
                      type="text"
                      required
                      value={inquiryForm.subject}
                      onChange={(e) => setInquiryForm({...inquiryForm, subject: e.target.value})}
                      placeholder="문의 제목을 입력하세요"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      문의 내용 *
                    </label>
                    <Textarea
                      required
                      rows={6}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                      placeholder="궁금한 점을 자세히 적어주세요"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    문의하기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}