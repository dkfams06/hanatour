'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import MileageManagementModal from '@/components/admin/MileageManagementModal';
import { Star, Eye, CheckCircle, XCircle, Clock, RotateCcw, User, Coins, Edit } from 'lucide-react';
import ReviewEditModal from '@/components/admin/ReviewEditModal';

interface Review {
  id: string;
  tourId?: string;
  userId?: string;
  username?: string;
  userName?: string;
  nickname?: string;
  customerName: string;
  phone: string;
  rating: number;
  content: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  tourTitle?: string;
  editedBy?: string;
  editCount?: number;
  editReason?: string;
}

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

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showMileageModal, setShowMileageModal] = useState(false);
  const [selectedUserForMileage, setSelectedUserForMileage] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/reviews?status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('후기 목록 조회 오류:', error);
      toast({
        title: "오류",
        description: "후기 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject' | 'revert') => {
    let actionText = '';
    let confirmMessage = '';
    
    switch (action) {
      case 'approve':
        actionText = '승인';
        confirmMessage = '이 후기를 승인하시겠습니까?';
        break;
      case 'reject':
        actionText = '거부';
        confirmMessage = '이 후기를 거부하시겠습니까?';
        break;
      case 'revert':
        actionText = '대기 상태로 되돌리기';
        confirmMessage = '이 후기를 대기 상태로 되돌리시겠습니까?';
        break;
    }
    
    if (!confirm(confirmMessage)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/reviews/${reviewId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: `${actionText} 완료`,
          description: data.message || `후기가 ${actionText}되었습니다.`,
        });
        fetchReviews();
        setSelectedReview(null);
      } else {
        toast({
          title: `${actionText} 실패`,
          description: data.error || `후기 ${actionText}에 실패했습니다.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: `후기 ${actionText} 중 오류가 발생했습니다.`,
        variant: "destructive",
      });
    }
  };

  // 사용자명으로 직접 사용자 조회
  const handleUsernameClick = async (username: string) => {
    if (!username) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(username)}&limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (data.success && data.users.length > 0) {
        const user = data.users[0];
        setSelectedUserForMileage(user); // 마일리지 관리용 사용자 설정
        setShowMileageModal(true);
      } else {
        toast({
          title: "사용자 찾기 실패",
          description: "해당 사용자를 찾을 수 없습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('사용자 조회 오류:', error);
      toast({
        title: "오류",
        description: "사용자 조회 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 사용자 검색 (검색창용)
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (data.success) {
        setSearchResults(data.users);
      }
    } catch (error) {
      console.error('사용자 검색 오류:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // 후기 수정 모달 열기
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowEditModal(true);
  };

  // 후기 수정 완료 후 처리
  const handleEditSuccess = () => {
    fetchReviews();
    setEditingReview(null);
    setShowEditModal(false);
  };

  // 마일리지 적용
  const handleMileageManagement = (user: User) => {
    setSelectedUserForMileage(user);
    setShowMileageModal(true);
  };

  // 사용자 정보 업데이트 콜백
  const handleUserUpdate = (updatedUser: User) => {
    // 사용자 목록에서 업데이트 (필요한 경우)
    console.log('리뷰 페이지 - 사용자 정보 업데이트:', updatedUser);
  };

  // 사용자 선택
  const handleUserSelect = (user: User) => {
    handleMileageManagement(user);
    setSearchQuery('');
    setSearchResults([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />대기중</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />승인</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />거부</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
        <span className="ml-1 text-sm text-gray-600">{rating}점</span>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">후기 관리</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>후기 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pending">승인대기</SelectItem>
                  <SelectItem value="approved">승인완료</SelectItem>
                  <SelectItem value="rejected">거부</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="사용자 이름, 이메일로 검색..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim()) {
                      searchUsers(e.target.value);
                    } else {
                      setSearchResults([]);
                    }
                  }}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-gray-500">로딩 중...</div>
            ) : reviews.length === 0 ? (
              <div className="py-12 text-center text-gray-500">후기가 없습니다.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                                    <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">작성자</th>
                      <th className="p-2 border">사용자명</th>
                      <th className="p-2 border">별점</th>
                      <th className="p-2 border">내용</th>
                      <th className="p-2 border">이미지</th>
                      <th className="p-2 border">상태</th>
                      <th className="p-2 border">작성일</th>
                      <th className="p-2 border">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(review => (
                      <tr key={review.id} className="text-center">
                        <td className="p-2 border">{review.customerName}</td>
                        <td className="p-2 border">
                          {review.username ? (
                            <button
                              onClick={() => handleUsernameClick(review.username!)}
                              className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                              title="클릭하여 마일리지 변경"
                            >
                              {review.username}
                              {review.nickname && (
                                <span className="text-gray-500 ml-1">({review.nickname})</span>
                              )}
                            </button>
                          ) : (
                            <span className="text-gray-400">없음</span>
                          )}
                        </td>
                        <td className="p-2 border">
                          {renderStars(review.rating)}
                        </td>
                        <td className="p-2 border max-w-xs">
                          <div className="truncate" title={review.content}>
                            {review.content.length > 50 
                              ? `${review.content.slice(0, 50)}...` 
                              : review.content}
                          </div>
                        </td>
                        <td className="p-2 border">
                          {review.images.length > 0 ? (
                            <span className="text-blue-600">{review.images.length}장</span>
                          ) : (
                            <span className="text-gray-400">없음</span>
                          )}
                        </td>
                        <td className="p-2 border">
                          {getStatusBadge(review.status)}
                        </td>
                        <td className="p-2 border">
                          <div className="text-xs">
                            {new Date(review.createdAt).toLocaleDateString()}
                            {review.editCount && review.editCount > 0 && (
                              <div className="text-blue-600 mt-1">
                                수정됨 ({review.editCount}회)
                                {review.editedBy && (
                                  <div className="text-gray-500">by {review.editedBy}</div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-2 border">
                          <div className="flex gap-2 justify-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedReview(review)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                {selectedReview && (
                                  <>
                                    <DialogHeader>
                                      <DialogTitle>후기 상세보기</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                                                          <div>
                                      <label className="font-semibold">작성자:</label>
                                      <p>{selectedReview.customerName}</p>
                                    </div>
                                      
                                      <div>
                                        <label className="font-semibold">별점:</label>
                                        <div className="mt-1">
                                          {renderStars(selectedReview.rating)}
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <label className="font-semibold">후기 내용:</label>
                                        <p className="mt-1 p-3 bg-gray-50 rounded border">
                                          {selectedReview.content}
                                        </p>
                                      </div>
                                      
                                      {selectedReview.images.length > 0 && (
                                        <div>
                                          <label className="font-semibold">첨부 이미지:</label>
                                          <div className="mt-2 grid grid-cols-3 gap-2">
                                            {selectedReview.images.map((image, index) => (
                                              <img
                                                key={index}
                                                src={image}
                                                alt={`후기 이미지 ${index + 1}`}
                                                className="w-full h-24 object-cover rounded border"
                                                onError={(e) => {
                                                  (e.target as HTMLImageElement).src = '/placeholder-image.png';
                                                }}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      <div className="flex justify-between items-center pt-4 border-t">
                                        <div className="space-y-1">
                                          <span className="text-sm text-gray-500">
                                            작성일: {new Date(selectedReview.createdAt).toLocaleString()}
                                          </span>
                                          {selectedReview.editCount && selectedReview.editCount > 0 && (
                                            <div className="text-sm text-blue-600">
                                              수정됨 ({selectedReview.editCount}회)
                                              {selectedReview.editedBy && (
                                                <span className="text-gray-500 ml-2">by {selectedReview.editedBy}</span>
                                              )}
                                            </div>
                                          )}
                                          {selectedReview.editReason && (
                                            <div className="text-sm text-gray-600">
                                              수정 사유: {selectedReview.editReason}
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex gap-2">
                                          {/* 후기 수정 버튼 */}
                                          <Button
                                            variant="outline"
                                            onClick={() => handleEditReview(selectedReview)}
                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                          >
                                            <Edit className="w-4 h-4 mr-2" />
                                            수정
                                          </Button>
                                          
                                          {selectedReview.status === 'pending' && (
                                            <>
                                              <Button
                                                variant="outline"
                                                onClick={() => handleReviewAction(selectedReview.id, 'reject')}
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                              >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                거부
                                              </Button>
                                              <Button
                                                onClick={() => handleReviewAction(selectedReview.id, 'approve')}
                                                className="bg-green-600 hover:bg-green-700"
                                              >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                승인
                                              </Button>
                                            </>
                                          )}
                                          {(selectedReview.status === 'approved' || selectedReview.status === 'rejected') && (
                                            <Button
                                              variant="outline"
                                              onClick={() => handleReviewAction(selectedReview.id, 'revert')}
                                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                            >
                                              <RotateCcw className="w-4 h-4 mr-2" />
                                              대기 상태로 되돌리기
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            {/* 후기 수정 버튼 */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditReview(review)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              수정
                            </Button>
                            
                            {review.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReviewAction(review.id, 'reject')}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  거부
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleReviewAction(review.id, 'approve')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  승인
                                </Button>
                              </>
                            )}
                            {(review.status === 'approved' || review.status === 'rejected') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReviewAction(review.id, 'revert')}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <RotateCcw className="w-3 h-3 mr-1" />
                                되돌리기
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

        {/* 사용자 검색 결과 */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>사용자 검색 결과</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {searchResults.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {user.name}
                        {user.username && (
                          <span className="text-gray-500 ml-2">({user.username})</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-sm text-gray-500">현재 마일리지: {user.mileage.toLocaleString()}원</div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleMileageManagement(user)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      마일리지 관리
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

        {/* 후기 수정 모달 */}
        <ReviewEditModal
          review={editingReview}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingReview(null);
          }}
          onSuccess={handleEditSuccess}
        />
      </div>
    </AdminLayout>
  );
}