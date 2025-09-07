'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MapPin, Users, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { Tour } from '@/lib/types';

interface ToursByDate {
  [key: string]: Tour[]; // YYYY-MM-DD 형식의 날짜를 키로 사용
}

export default function TourCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [toursByDate, setToursByDate] = useState<ToursByDate>({});
  const [selectedDateTours, setSelectedDateTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 투어 데이터 로드
  useEffect(() => {
    fetchToursForMonth(currentMonth);
  }, [currentMonth]);

  // 선택된 날짜의 투어 업데이트
  useEffect(() => {
    const dateKey = formatDateKey(selectedDate);
    setSelectedDateTours(toursByDate[dateKey] || []);
  }, [selectedDate, toursByDate]);

  const fetchToursForMonth = async (month: Date) => {
    try {
      setIsLoading(true);
      const year = month.getFullYear();
      const monthNum = month.getMonth() + 1;
      
      const response = await fetch(`/api/tours?status=published&departureMonth=${monthNum}&limit=100`);
      const data = await response.json();

      if (data.success) {
        const toursGroupedByDate: ToursByDate = {};
        
        data.tours.forEach((tour: Tour) => {
          const departureDate = new Date(tour.departureDate);
          // 해당 월의 투어만 필터링
          if (departureDate.getFullYear() === year && departureDate.getMonth() === month.getMonth()) {
            const dateKey = formatDateKey(departureDate);
            if (!toursGroupedByDate[dateKey]) {
              toursGroupedByDate[dateKey] = [];
            }
            toursGroupedByDate[dateKey].push(tour);
          }
        });

        setToursByDate(toursGroupedByDate);
      }
    } catch (error) {
      console.error('투어 데이터 로드 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  };

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const getDayContent = (day: Date) => {
    const dateKey = formatDateKey(day);
    const dayTours = toursByDate[dateKey] || [];
    
    if (dayTours.length === 0) return null;

    return (
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex justify-center">
          <div className="bg-blue-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
            {dayTours.length}
          </div>
        </div>
      </div>
    );
  };

  // 이전 날짜 선택 불가 처리
  const disablePastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">여행 캘린더</h1>
          <p className="text-gray-600">출발일 기준으로 여행 상품을 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 캘린더 */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CalendarIcon className="w-5 h-5" />
                    {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevMonth}
                      disabled={isLoading}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextMonth}
                      disabled={isLoading}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="relative flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    disabled={disablePastDates}
                    className="w-full flex justify-center"
                    classNames={{
                      months: "flex flex-col space-y-4",
                      month: "space-y-2 mx-auto",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      table: "w-auto border-collapse space-y-1 mx-auto",
                      head_row: "flex justify-center",
                      head_cell: "text-muted-foreground rounded-md w-12 font-normal text-[0.8rem] text-center",
                      row: "flex justify-center mt-2",
                      cell: "h-12 w-12 text-center text-sm p-0 relative flex items-center justify-center",
                      day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground flex items-center justify-center",
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                    }}
                    components={{
                      Day: ({ date, ...props }) => {
                        const dayContent = getDayContent(date);
                        return (
                          <div className="relative w-full h-full">
                            <button {...props} className={(props as any).className}>
                              {date.getDate()}
                              {dayContent}
                            </button>
                          </div>
                        );
                      }
                    }}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 선택된 날짜의 투어 목록 */}
          <div className="lg:col-span-1">
            <Card className="h-fit sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">
                  {selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {selectedDateTours.length > 0 
                    ? `${selectedDateTours.length}개 상품` 
                    : '상품 없음'}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {selectedDateTours.length > 0 ? (
                    selectedDateTours.map((tour) => (
                      <Link key={tour.id} href={`/tours/${tour.id}`}>
                        <div className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                          {/* 투어 이미지 */}
                          {tour.mainImage && (
                            <div className="mb-2">
                              <img
                                src={tour.mainImage}
                                alt={tour.title}
                                className="w-full h-20 object-cover rounded-md"
                              />
                            </div>
                          )}
                          
                          {/* 투어 정보 */}
                          <h3 className="font-semibold text-xs mb-1 line-clamp-2 leading-tight">
                            {tour.title}
                          </h3>
                          
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{tour.continent} · {tour.country}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 flex-shrink-0" />
                              <span>잔여 {tour.maxParticipants - tour.currentParticipants}명</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              {tour.status === 'published' ? '예약가능' : '마감'}
                            </Badge>
                            <span className="font-bold text-blue-600 text-xs">
                              {formatPrice(tour.price)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs">출발 상품이<br />없습니다</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 캘린더 범례 - 컴팩트 버전 */}
        <div className="mt-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">N</span>
                  </div>
                  <span>N개 상품</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span>이전 날짜</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-blue-500 rounded"></div>
                  <span>선택됨</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}