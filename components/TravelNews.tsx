'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ArrowRight, Bell, BookOpen, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  viewCount: number;
  isImportant: boolean;
}

export default function TravelNews() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      setIsLoading(true);
      try {
        // 최신 공지사항 가져오기
        const response = await fetch('/api/notices?limit=4&sortBy=createdAt');
        const data = await response.json();
        
        if (data.success && data.data) {
          setNotices(Array.isArray(data.data) ? data.data : []);
        } else {
          setNotices([]);
        }
      } catch (error) {
        console.error('Failed to fetch notices:', error);
        setNotices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '오늘';
    } else if (diffDays === 2) {
      return '어제';
    } else if (diffDays <= 7) {
      return `${diffDays - 1}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="h-8 w-8 text-blue-500" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                여행 소식
              </h2>
            </div>
            <p className="text-lg text-gray-600">
              최신 여행 정보와 공지사항을 확인하세요.
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => router.push('/notice')}
            className="hidden sm:flex items-center space-x-2"
          >
            <span>전체보기</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notices.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {notices.map((notice, index) => (
              <Card 
                key={notice.id} 
                className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  index === 0 ? 'lg:col-span-2' : ''
                } ${notice.isImportant ? 'border-red-200 bg-red-50/30' : ''}`}
                onClick={() => router.push(`/notice/${notice.id}`)}
              >
                <CardContent className={`p-6 ${index === 0 ? 'lg:flex lg:space-x-6' : ''}`}>
                  {/* 첫 번째 공지사항은 큰 카드로 표시 */}
                  {index === 0 && (
                    <div className="lg:w-1/3 mb-4 lg:mb-0">
                      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className={index === 0 ? 'lg:w-2/3' : ''}>
                    {/* 배지와 날짜 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {notice.isImportant && (
                          <Badge variant="destructive" className="text-xs">
                            중요
                          </Badge>
                        )}
                        {formatDate(notice.createdAt) === '오늘' && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            NEW
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(notice.createdAt)}</span>
                      </div>
                    </div>

                    {/* 제목 */}
                    <h3 className={`font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors ${
                      index === 0 ? 'text-xl' : 'text-lg'
                    }`}>
                      {notice.title}
                    </h3>

                    {/* 내용 미리보기 */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {truncateText(notice.content, index === 0 ? 200 : 100)}
                    </p>

                    {/* 하단 정보 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{notice.viewCount?.toLocaleString() || '0'}</span>
                        </div>
                      </div>
                      <div className="text-blue-600 text-sm font-medium flex items-center space-x-1">
                        <span>자세히보기</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              등록된 공지사항이 없습니다
            </h3>
            <p className="text-gray-600">
              새로운 소식이 등록되면 알려드리겠습니다.
            </p>
          </div>
        )}

        {/* 모바일 전체보기 버튼 */}
        <div className="sm:hidden mt-8 text-center">
          <Button 
            variant="outline"
            onClick={() => router.push('/notice')}
            className="w-full flex items-center justify-center space-x-2"
          >
            <span>공지사항 전체보기</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* 구독 안내 */}
        <div className="mt-12 bg-gray-100 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            여행 소식을 놓치지 마세요!
          </h3>
          <p className="text-gray-600 mb-6">
            최신 여행 정보와 특가 소식을 이메일로 받아보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="이메일 주소를 입력하세요"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              구독하기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}