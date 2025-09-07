'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Heart, 
  Calendar, 
  MessageCircle, 
  Settings,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Star,
  Clock,
  Users,
  Eye,
  Gift,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Tour } from '@/lib/types';

interface Booking {
  id: string;
  bookingNumber: string;
  tourTitle: string;
  tourId: string;
  departureDate: string;
  participants: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

interface Review {
  id: string;
  tourId: string;
  tourTitle: string;
  rating: number;
  content: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Application {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  applicationMethod?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  requestDate: string;
  processedDate?: string;
  adminNotes?: string;
}

interface Inquiry {
  id: string;
  inquiryNumber: string;
  subject: string;
  content: string;
  category: string;
  status: 'pending' | 'in_progress' | 'completed' | 'closed';
  createdAt: string;
  responseCount: number;
  lastResponseAt?: string;
}

const MyPage = React.memo(function MyPage() {
  const { user, logout, refreshUser } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || ''
  });
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [inquiryResponses, setInquiryResponses] = useState<any[]>([]);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // 디버깅: 현재 사용자 정보 출력
    console.log('현재 사용자 정보:', user);
    console.log('마일리지 정보:', user.mileage);
    
    // 사용자 데이터 로드 (refreshUser 제거하여 무한 루프 방지)
    loadUserDataWithoutRefresh();
  }, [user?.id]); // user.id만 의존성으로 설정

  const loadUserDataWithoutRefresh = async () => {
    try {
      setIsLoading(true);
      
      // 예약 내역 조회 (실제 구현 시 API 호출)
      // const bookingsResponse = await fetch('/api/user/bookings');
      // const bookingsData = await bookingsResponse.json();
      
      // 후기 내역 조회 (실제 구현 시 API 호출)
      // const reviewsResponse = await fetch('/api/user/reviews');
      // const reviewsData = await reviewsResponse.json();
      

      
      // 임시 데이터
      setBookings([
        {
          id: '1',
          bookingNumber: 'HT20250731001',
          tourTitle: '제주도 3박 4일 힐링 여행',
          tourId: 'tour_1',
          departureDate: '2025-08-15',
          participants: 2,
          totalAmount: 480000,
          status: 'confirmed',
          createdAt: '2025-07-30T10:00:00Z'
        },
        {
          id: '2',
          bookingNumber: 'HT20250720002',
          tourTitle: '부산 2박 3일 맛집 투어',
          tourId: 'tour_2',
          departureDate: '2025-07-25',
          participants: 1,
          totalAmount: 180000,
          status: 'completed',
          createdAt: '2025-07-18T14:30:00Z'
        }
      ]);
      
      setReviews([
        {
          id: '1',
          tourId: 'tour_2',
          tourTitle: '부산 2박 3일 맛집 투어',
          rating: 5,
          content: '정말 좋았습니다! 맛집들이 모두 맛있었고 가이드분도 친절하셨어요.',
          images: [],
          status: 'approved',
          createdAt: '2025-07-26T09:00:00Z'
        }
      ]);

      // 1:1 문의 내역 조회
      try {
        const token = localStorage.getItem('token');
        console.log('토큰 확인:', token ? '토큰 있음' : '토큰 없음');
        
        const inquiriesResponse = await fetch('/api/my-inquiries', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        console.log('API 응답 상태:', inquiriesResponse.status);
        
        if (inquiriesResponse.ok) {
          const inquiriesData = await inquiriesResponse.json();
          console.log('API 응답 데이터:', inquiriesData);
          
          if (inquiriesData.success) {
            console.log('문의 데이터 설정:', inquiriesData.data);
            setInquiries(inquiriesData.data);
          } else {
            console.error('API 응답 실패:', inquiriesData.error);
          }
        } else {
          console.error('API 요청 실패:', inquiriesResponse.status, inquiriesResponse.statusText);
        }
      } catch (error) {
        console.error('1:1 문의 내역 조회 오류:', error);
      }
      
    } catch (error) {
      console.error('사용자 데이터 로드 오류:', error);
      toast({
        title: "데이터 로드 실패",
        description: "사용자 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // 사용자 정보 새로고침 (마일리지 최신값 가져오기)
      await refreshUser();
      
      // 예약 내역 조회 (실제 구현 시 API 호출)
      // const bookingsResponse = await fetch('/api/user/bookings');
      // const bookingsData = await bookingsResponse.json();
      
      // 후기 내역 조회 (실제 구현 시 API 호출)
      // const reviewsResponse = await fetch('/api/user/reviews');
      // const reviewsData = await reviewsResponse.json();
      

      
      // 임시 데이터
      setBookings([
        {
          id: '1',
          bookingNumber: 'HT20250731001',
          tourTitle: '제주도 3박 4일 힐링 여행',
          tourId: 'tour_1',
          departureDate: '2025-08-15',
          participants: 2,
          totalAmount: 480000,
          status: 'confirmed',
          createdAt: '2025-07-30T10:00:00Z'
        },
        {
          id: '2',
          bookingNumber: 'HT20250720002',
          tourTitle: '부산 2박 3일 맛집 투어',
          tourId: 'tour_2',
          departureDate: '2025-07-25',
          participants: 1,
          totalAmount: 180000,
          status: 'completed',
          createdAt: '2025-07-18T14:30:00Z'
        }
      ]);
      
      setReviews([
        {
          id: '1',
          tourId: 'tour_2',
          tourTitle: '부산 2박 3일 맛집 투어',
          rating: 5,
          content: '정말 좋았습니다! 맛집들이 모두 맛있었고 가이드분도 친절하셨어요.',
          images: [],
          status: 'approved',
          createdAt: '2025-07-26T09:00:00Z'
        }
      ]);
      
    } catch (error) {
      console.error('사용자 데이터 로드 오류:', error);
      toast({
        title: "데이터 로드 실패",
        description: "사용자 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // 실제 구현 시 API 호출
      // await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(userInfo) });
      
      toast({
        title: "프로필 수정 완료",
        description: "회원 정보가 성공적으로 수정되었습니다.",
      });
      setEditMode(false);
    } catch (error) {
      toast({
        title: "수정 실패",
        description: "프로필 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: '예약대기', variant: 'secondary' as const },
      confirmed: { label: '예약확정', variant: 'default' as const },
      cancelled: { label: '취소됨', variant: 'destructive' as const },
      completed: { label: '여행완료', variant: 'outline' as const }
    };
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
  };

  const getReviewStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: '승인대기', variant: 'secondary' as const },
      approved: { label: '승인완료', variant: 'default' as const },
      rejected: { label: '승인거부', variant: 'destructive' as const }
    };
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
  };

  const getInquiryStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: '대기중', variant: 'secondary' as const },
      in_progress: { label: '처리중', variant: 'default' as const },
      completed: { label: '완료', variant: 'default' as const },
      closed: { label: '종료', variant: 'outline' as const }
    };
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
  };



  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // 답변보기 함수
  const handleViewResponses = async (inquiry: Inquiry) => {
    try {
      setIsLoadingResponses(true);
      setSelectedInquiry(inquiry);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/inquiries/${inquiry.id}/responses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setInquiryResponses(data.data);
          setShowResponseModal(true);
        } else {
          toast({
            title: "오류",
            description: data.error || '답변을 불러오는데 실패했습니다.',
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "오류",
          description: '답변을 불러오는데 실패했습니다.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('답변 조회 오류:', error);
      toast({
        title: "오류",
        description: '답변 조회 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user) {
      toast({
        title: "오류",
        description: "사용자 정보를 찾을 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm('정말로 회원탈퇴를 하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.')) {
      return;
    }

    setIsWithdrawing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: withdrawReason,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "회원탈퇴 완료",
          description: data.message,
        });
        
        // 로그아웃 처리
        logout();
        
        // 모달 닫기
        setShowWithdrawModal(false);
        setWithdrawReason('');
      } else {
        toast({
          title: "회원탈퇴 실패",
          description: data.error || "회원탈퇴 처리에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('회원탈퇴 오류:', error);
      toast({
        title: "오류",
        description: "회원탈퇴 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold mb-2">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-4">마이페이지를 이용하려면 로그인해주세요.</p>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              홈으로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">마이페이지</h1>
          <p className="text-gray-600">안녕하세요, <span className="font-semibold text-blue-600">{user.username}</span>님!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 사이드바 - 사용자 정보 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  회원 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">이름</label>
                      <Input
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        placeholder="이름"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">전화번호</label>
                      <Input
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                        placeholder="010-1234-5678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">이메일</label>
                      <Input
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        placeholder="이메일"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile} size="sm" className="flex-1">
                        저장
                      </Button>
                      <Button onClick={() => setEditMode(false)} variant="outline" size="sm" className="flex-1">
                        취소
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">{user.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">{user.phone || '등록된 전화번호 없음'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-blue-600">
                        ₩{user.mileage?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <Button 
                      onClick={() => setEditMode(true)} 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      정보 수정
                    </Button>
                  </div>
                )}
                
                <hr />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>가입일</span>
                    <span className="text-gray-600">{formatDate(user.createdAt || new Date().toISOString())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>회원등급</span>
                    <Badge variant="outline">{user.role === 'admin' ? '관리자' : '일반회원'}</Badge>
                  </div>
                </div>
                
                <Button onClick={logout} variant="outline" className="w-full">
                  로그아웃
                </Button>
              </CardContent>
            </Card>

            {/* 회원탈퇴 카드 */}
            <Card className="mt-4 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  회원탈퇴
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-4">
                  회원탈퇴 시 모든 개인정보와 데이터가 영구적으로 삭제되며, 복구할 수 없습니다.
                </p>
                <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      회원탈퇴
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-red-600">회원탈퇴 확인</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <span className="font-semibold text-red-800">주의사항</span>
                        </div>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• 모든 개인정보가 영구적으로 삭제됩니다</li>
                          <li>• 예약 내역, 리뷰, 마일리지 등 모든 데이터가 삭제됩니다</li>
                          <li>• 탈퇴 후에는 복구할 수 없습니다</li>
                        </ul>
                      </div>
                      
                      <div>
                        <Label htmlFor="withdrawReason" className="text-sm font-medium">
                          탈퇴 사유 (선택사항)
                        </Label>
                        <Textarea
                          id="withdrawReason"
                          placeholder="탈퇴 사유를 입력해주세요..."
                          value={withdrawReason}
                          onChange={(e) => setWithdrawReason(e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowWithdrawModal(false)}
                          className="flex-1"
                        >
                          취소
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleWithdraw}
                          disabled={isWithdrawing}
                          className="flex-1"
                        >
                          {isWithdrawing ? '처리중...' : '탈퇴하기'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            
            {/* 마일리지 카드 */}
            <Card className="mt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-blue-600" />
                    마일리지
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        await refreshUser();
                        toast({
                          title: "새로고침 완료",
                          description: "마일리지 정보가 업데이트되었습니다.",
                        });
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </Button>
                    <Link href="/transactions">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs"
                      >
                        입출금 내역
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    ₩{user.mileage?.toLocaleString() || '0'}
                    {/* 디버깅 정보 */}
                    <div className="text-xs text-gray-500 mt-1">
                      Raw: {JSON.stringify(user.mileage)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">원</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <p>• 여행 상품 구매 시 사용 가능</p>
                    <p>• ₩1,000 = ₩1,000 할인</p>
                    <p>• 구매 금액의 1% 적립</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="bookings" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bookings" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  예약 내역
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  찜목록
                </TabsTrigger>
                <TabsTrigger value="inquiries" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  1:1 문의
                </TabsTrigger>
              </TabsList>

              {/* 예약 내역 */}
              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>예약 내역</CardTitle>
                    <p className="text-sm text-gray-600">총 {bookings.length}건의 예약이 있습니다.</p>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-20 bg-gray-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => {
                          const statusBadge = getStatusBadge(booking.status);
                          return (
                            <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold mb-1">{booking.tourTitle}</h3>
                                  <p className="text-sm text-gray-600">예약번호: {booking.bookingNumber}</p>
                                </div>
                                <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-600" />
                                  <span>{formatDate(booking.departureDate)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-gray-600" />
                                  <span>{booking.participants}명</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-600" />
                                  <span>{formatDate(booking.createdAt)}</span>
                                </div>
                                <div className="font-bold text-blue-600">
                                  {formatPrice(booking.totalAmount)}
                                </div>
                              </div>
                              
                              <div className="flex gap-2 mt-3">
                                <Link href={`/tours/${booking.tourId}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    상품보기
                                  </Button>
                                </Link>
                                {booking.status === 'completed' && (
                                  <Link href={`/review/write?tourId=${booking.tourId}&bookingId=${booking.id}&userId=${user?.id || ''}`}>
                                    <Button size="sm">
                                      <MessageCircle className="w-4 h-4 mr-2" />
                                      후기작성
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>예약 내역이 없습니다.</p>
                        <Link href="/packages">
                          <Button className="mt-4">여행 상품 보러가기</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>



              {/* 찜목록 */}
              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>찜목록</CardTitle>
                    <p className="text-sm text-gray-600">총 {wishlist.length}개의 상품을 찜하셨습니다.</p>
                  </CardHeader>
                  <CardContent>
                    {wishlist.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wishlist.map((item) => (
                          <div key={item.tourId} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <img 
                              src={item.mainImage} 
                              alt={item.tourTitle}
                              className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                              <h3 className="font-semibold mb-2 line-clamp-2">{item.tourTitle}</h3>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-blue-600">
                                  {formatPrice(item.price)}
                                </span>
                                <div className="flex gap-2">
                                  <Link href={`/tours/${item.tourId}`}>
                                    <Button variant="outline" size="sm">
                                      보기
                                    </Button>
                                  </Link>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => removeFromWishlist(item.tourId)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>찜한 상품이 없습니다.</p>
                        <Link href="/packages">
                          <Button className="mt-4">여행 상품 보러가기</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 1:1 문의 */}
              <TabsContent value="inquiries">
                <Card>
                  <CardHeader>
                    <CardTitle>1:1 문의</CardTitle>
                    <p className="text-sm text-gray-600">총 {inquiries.length}건의 문의를 하셨습니다.</p>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-20 bg-gray-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : inquiries.length > 0 ? (
                      <div className="space-y-4">
                        {inquiries.map((inquiry) => {
                          const statusBadge = getInquiryStatusBadge(inquiry.status);
                          return (
                            <div key={inquiry.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold mb-1">{inquiry.subject}</h3>
                                  <p className="text-sm text-gray-600">문의번호: {inquiry.inquiryNumber}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                                  {inquiry.responseCount > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      답변 {inquiry.responseCount}개
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                                <div className="flex items-center gap-2">
                                  <MessageCircle className="w-4 h-4 text-gray-600" />
                                  <span>{inquiry.category}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-600" />
                                  <span>{formatDate(inquiry.createdAt)}</span>
                                </div>
                                {inquiry.lastResponseAt && (
                                  <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                                    <span>답변완료</span>
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-gray-700 mb-3 line-clamp-2">{inquiry.content}</p>
                              
                              <div className="flex gap-2">
                                <Link href={`/customer?inquiry=${inquiry.id}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    상세보기
                                  </Button>
                                </Link>
                                {inquiry.responseCount > 0 && (
                                  <Button 
                                    size="sm"
                                    onClick={() => handleViewResponses(inquiry)}
                                    disabled={isLoadingResponses}
                                  >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    {isLoadingResponses ? '로딩중...' : '답변보기'}
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>문의 내역이 없습니다.</p>
                        <Link href="/customer">
                          <Button className="mt-4">1:1 문의하기</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* 답변보기 모달 */}
      <Dialog open={showResponseModal} onOpenChange={setShowResponseModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>답변 내역</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-6">
              {/* 문의 정보 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{selectedInquiry.subject}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">문의번호:</span> {selectedInquiry.inquiryNumber}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">등록일:</span> {formatDate(selectedInquiry.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">카테고리:</span> {selectedInquiry.category}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">상태:</span> 
                    <Badge variant="outline" className="ml-2">
                      {getInquiryStatusBadge(selectedInquiry.status).label}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-medium text-gray-600">문의 내용:</span>
                  <div className="mt-2 p-3 bg-white rounded border whitespace-pre-line">
                    {selectedInquiry.content}
                  </div>
                </div>
              </div>

              {/* 답변 목록 */}
              <div>
                <h4 className="font-semibold mb-4">답변 내역 ({inquiryResponses.length}개)</h4>
                {inquiryResponses.length > 0 ? (
                  <div className="space-y-4">
                    {inquiryResponses.map((response, index) => (
                      <div key={response.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{response.adminName || '관리자'}</span>
                            {response.isInternal && (
                              <Badge variant="outline" className="text-xs">내부 메모</Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(response.createdAt)}
                          </span>
                        </div>
                        <div className="bg-blue-50 p-3 rounded whitespace-pre-line">
                          {response.content}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>아직 답변이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default MyPage;