'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Quote, ArrowRight, User, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Review {
  id: string;
  tourId: string;
  customerName: string;
  rating: number;
  content: string; // comment 대신 content 사용
  createdAt: string;
  status: string;
  images?: string[];
}

export default function CustomerReviews() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        // 승인된 리뷰만 가져오기
        console.log('고객 후기 데이터 가져오기 시작...');
        const response = await fetch('/api/reviews?status=approved&limit=6');
        const data = await response.json();
        
        console.log('API 응답:', data);
        
        if (data.success && data.reviews) {
          console.log('후기 개수:', data.reviews.length);
          setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        } else {
          console.log('후기 데이터가 없습니다');
          setReviews([]);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const maskName = (name: string) => {
    if (name.length <= 2) {
      return name;
    }
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Quote className="h-8 w-8 text-blue-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              고객 후기
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            하나투어와 함께한 특별한 여행 경험을 고객님들이 직접 들려드립니다.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <Card 
                key={review.id} 
                className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => router.push(`/tours/${review.tourId}`)}
              >
                <CardContent className="p-6">
                  {/* 평점 */}
                  <div className="flex items-center space-x-1 mb-3">
                    {renderStars(review.rating)}
                    <Badge variant="secondary" className="ml-2">
                      {review.rating ? review.rating.toFixed(1) : '0.0'}
                    </Badge>
                  </div>

                  {/* 후기 내용 */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    "{review.content}"
                  </p>

                  {/* 작성자 정보 */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-blue-100 rounded-full">
                        <User className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="font-medium">{maskName(review.customerName)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Quote className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 등록된 후기가 없습니다
            </h3>
            <p className="text-gray-600">
              첫 번째 후기를 남겨주세요!
            </p>
          </div>
        )}

        {/* 통계 섹션 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-gray-600">고객 만족도</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">4.8</div>
            <div className="text-gray-600">평균 평점</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">10,000+</div>
            <div className="text-gray-600">누적 여행객</div>
          </div>
        </div>

        {/* 후기 작성 안내 */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            여행 후기를 남겨주세요!
          </h3>
          <p className="text-lg mb-6 opacity-90">
            소중한 경험을 다른 여행객들과 공유해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => router.push('/review/write')}
            >
              후기 작성하기
            </Button>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => router.push('/packages')}
            >
              여행 상품 보기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}