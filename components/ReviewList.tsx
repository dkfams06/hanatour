'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, Calendar, User } from 'lucide-react';
import Link from 'next/link';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  content: string;
  images: string[];
  createdAt: string;
}

interface ReviewListProps {
  tourId: string;
  showWriteButton?: boolean;
}

export default function ReviewList({ tourId, showWriteButton = true }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [tourId, currentPage]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/reviews?tourId=${tourId}&status=approved&page=${currentPage}&limit=5`);
      const data = await response.json();

      if (data.success) {
        if (currentPage === 1) {
          setReviews(data.reviews);
        } else {
          setReviews(prev => [...prev, ...data.reviews]);
        }
        setHasMore(data.reviews.length === 5);
      }
    } catch (error) {
      console.error('후기 조회 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
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
        <span className="ml-1 text-sm text-gray-600">({rating}점)</span>
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const maskName = (name: string) => {
    if (name.length <= 2) return name;
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  };

  if (isLoading && currentPage === 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            여행 후기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            여행 후기 ({reviews.length})
          </CardTitle>
          {showWriteButton && (
            <Link href={`/review/write?tourId=${tourId}`}>
              <Button variant="outline" size="sm">
                후기 작성
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">아직 등록된 후기가 없습니다.</p>
            {showWriteButton && (
              <Link href={`/review/write?tourId=${tourId}`}>
                <Button>첫 번째 후기 작성하기</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                {/* 후기 헤더 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {getInitials(review.customerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{maskName(review.customerName)}</span>
                        <Badge variant="secondary" className="text-xs">
                          인증된 구매자
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 후기 내용 */}
                <div className="ml-13">
                  <p className="text-gray-700 leading-relaxed mb-3">{review.content}</p>

                  {/* 후기 이미지 */}
                  {review.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`후기 이미지 ${index + 1}`}
                          className="w-full h-20 object-cover rounded border hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => {
                            // 이미지 확대 모달 (추후 구현 가능)
                            window.open(image, '_blank');
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 더보기 버튼 */}
            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoading}
                >
                  {isLoading ? '로딩 중...' : '더보기'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 