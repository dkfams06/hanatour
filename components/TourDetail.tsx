'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { formatPhoneNumber } from '@/lib/utils';
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Calendar, 
  Heart, 
  Share2, 
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BookingForm from '@/components/BookingForm';
import ReviewList from '@/components/ReviewList';

interface TourDetailProps {
  tour: any; // In a real app, this would be properly typed
}

export default function TourDetail({ tour }: TourDetailProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [cartGuestCount, setCartGuestCount] = useState(2);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const formatPrice = (price: number) => {
    if (language === 'ko') {
      return `${price.toLocaleString()}원`;
    }
    return `$${(price / 1000).toFixed(0)}`;
  };

  const nextImage = () => {
    if (tour.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % tour.images.length);
    }
  };

  const prevImage = () => {
    if (tour.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length);
    }
  };

  const handleBooking = () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    setShowBookingModal(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: tour.title,
        text: tour.description,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleAddToCart = async () => {
    if (!tour.departureDate) {
      toast({
        title: "출발일이 설정되지 않았습니다",
        description: "출발일이 있는 상품만 장바구니에 추가할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    if (!customerName.trim()) {
      toast({
        title: "예약자명을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    if (!customerPhone.trim()) {
      toast({
        title: "연락처를 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    if (!customerEmail.trim()) {
      toast({
        title: "이메일을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    const success = await addToCart({
      tourId: tour.id,
      title: tour.title,
      mainImage: tour.mainImage,
      price: tour.price,
      departureDate: tour.departureDate,
      participants: cartGuestCount,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      specialRequests: specialRequests.trim() || undefined
    });

    if (success) {
      toast({
        title: "장바구니에 추가되었습니다!",
        description: "장바구니에서 예약을 진행하실 수 있습니다.",
        variant: "default",
      });
      
      // 입력 필드 초기화
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setSpecialRequests('');
      setCartGuestCount(2);
    } else {
      toast({
        title: "장바구니 추가 실패",
        description: "이미 장바구니에 있는 상품이거나 장바구니가 가득찼습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* 모바일 gap-4, 데스크탑 gap-8 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
                <MapPin className="w-4 h-4" />
                <span>{tour.location}</span>
                <span>•</span>
                <span>{tour.category}</span>
              </div>
              {/* 폰트 크기 반응형 */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                {tour.title}
              </h1>
              <div className="flex flex-wrap items-center space-x-4 sm:space-x-6 mb-4 sm:mb-6 text-xs sm:text-base">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{tour.rating}</span>
                  <span className="text-gray-600 ml-1">({tour.reviews} reviews)</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-1" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-1" />
                  <span>Max {tour.maxGuests} guests</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center space-x-2 mb-4 sm:mb-6">
                {tour.tags?.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center space-x-2 sm:space-x-4">
                <Button
                  variant="outline"
                  onClick={async () => {
                    const isCurrentlyWishlisted = isInWishlist(tour.id);
                    if (isCurrentlyWishlisted) {
                      await removeFromWishlist(tour.id);
                    } else {
                      const success = await addToWishlist({
                        tourId: tour.id,
                        tourTitle: tour.title,
                        mainImage: tour.mainImage || tour.images?.[0],
                        price: tour.price,
                        departureDate: tour.departureDate,
                        region: tour.region,
                        createdAt: new Date().toISOString()
                      });
                      if (!success) {
                        return;
                      }
                    }
                  }}
                  className="flex items-center space-x-2 w-full sm:w-auto text-xs sm:text-sm"
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(tour.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{isInWishlist(tour.id) ? '찜 해제' : '찜하기'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center space-x-2 w-full sm:w-auto text-xs sm:text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>

            {/* Image Gallery */}
            {tour.images?.length > 0 && (
              <div className="relative">
                {/* 모바일 h-56, 태블릿 h-80, 데스크탑 h-96 */}
                <div className="relative h-56 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                  <img
                    src={tour.images[currentImageIndex]}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  {tour.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-opacity"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-opacity"
                      >
                        <ChevronRight className="w-6 h-6 text-white" />
                      </button>
                    </>
                  )}
                </div>
                {/* 썸네일 가로 스크롤 */}
                {tour.images.length > 1 && (
                  <div className="flex space-x-2 mt-2 sm:mt-4 overflow-x-auto">
                    {tour.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 ${index === currentImageIndex ? 'border-primary' : 'border-transparent'}`}
                      >
                        <img
                          src={image}
                          alt={`${tour.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tour Details */}
            <Tabs defaultValue="overview" className="w-full">
              {/* 모바일 2열, 데스크탑 4열 */}
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="overview">개요</TabsTrigger>
                <TabsTrigger value="itinerary">일정</TabsTrigger>
                <TabsTrigger value="included">포함사항</TabsTrigger>
                <TabsTrigger value="reviews">후기</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">투어 소개</h3>
                  <p className="text-gray-700 leading-relaxed">{tour.description}</p>
                </div>
                
                {tour.highlights?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">투어 하이라이트</h3>
                    <ul className="space-y-2">
                      {tour.highlights.map((highlight: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="itinerary" className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">일일 일정</h3>
                {tour.itinerary?.map((day: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                          {day.day}
                        </div>
                        {day.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {day.activities?.map((activity: string, activityIndex: number) => (
                          <li key={activityIndex} className="flex items-start">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                            <span className="text-gray-700">{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="included" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">✓ 포함사항</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tour.included?.map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">✗ 미포함사항</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tour.notIncluded?.map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <X className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* 여행시 유의사항 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">⚠️ 여행시 유의사항</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p>ㅇ 비행기 출발 3시간 전까지는 나가셔서 체크인 하시기 바랍니다.</p>
                      <p>ㅇ 모든 티켓은 전자티켓(Eletronic Ticket)으로 발권됩니다. E-Ticket은 공항에서 체크인 하실 때 여권과 여권번호, 또는 티켓번호를 제시하시면 카운트에서 직접 받습니다.</p>
                      <p>ㅇ 유럽은 EURO(€)를 사용하는 지역이므로, 현지에서 사용하실 (옵션경비,공동경비,개인비용) EURO(€)를 준비하시기 바랍니다.</p>
                      <p>ㅇ 여행 시 간혹 분실 및 도난 사고가 발생하오니 귀중품은 되도록이면 지참 하지 마시고, 쇼핑 하실 때는 가급적 신용카드를 사용하세요. 식당에서 소지품을 테이블 위에 놓고 이동하지 않기를 바랍니다. 여권과 지갑은 잘 보관하십시오.</p>
                      <p>ㅇ 유럽의 날씨는 기온변화와 일교차가 심합니다. 방수잠바와 보온잠바는 꼭 준비하십시오.</p>
                      <p>ㅇ 수하물은 일인당 기내가방 1개(20lbs) 와 부치는 가방 1개(50lbs) 미만 입니다. 중요한 물품은 반드시 기내가방에 넣어서 탑승하시기를 바랍니다. (수화물 규정은 항공사에 따라 다를 수 있습니다.)</p>
                    </div>
                  </CardContent>
                </Card>

                {/* 기타사항 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-orange-600">ℹ️ 기타사항</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p>ㅇ 개인부담으로 여행자 보험에 가입할 수 있습니다. 여행 중 지병이나 사고, 분실 등 만일에 대비하여 필요하신 분은 직원에게 문의해주세요.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* 상품취소규정 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">📋 상품취소규정</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <p className="font-semibold">※ 항공권, 기차표, 유람선 티켓 등은 100% 환불이 안됩니다.</p>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">&lt; 버스투어를 포함한 투어부분 규정 - 항공별도 &gt;</h4>
                        
                        <div className="mb-4">
                          <h5 className="font-semibold mb-2">&lt;여행 예약 취소 규정&gt;</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold mb-2">취소 규정</p>
                              <ul className="space-y-1">
                                <li>ㅇ 출발 14일 전 : 여행 경비 20% 취소 수수료 발생</li>
                                <li>ㅇ 출발 13일 - 7일 전 : 여행 경비 50% 취소 수수료 발생</li>
                                <li>ㅇ 출발 6일 - 3일 전 : 여행 경비 80% 취소 수수료 발생</li>
                                <li>ㅇ 출발 2일 - 당일 : 여행 경비 100% 취소 수수료 발생</li>
                              </ul>
                              <p className="text-xs mt-2">(단, 항공료는 전액 환불 불가합니다.)</p>
                            </div>
                            <div>
                              <p className="font-semibold mb-2">예외 규정</p>
                              <ul className="space-y-1 text-xs">
                                <li>1) 여행자가 예약 및 여행요금을 결제(지급)한 때로부터 24시간 이내에 여행계약을 철회(취소)하는 경우와 여행요금을 전액 환불합니다.</li>
                                <li>2) 상품의 특성에 따라 현지 예약금으로 지불되어야 하는 금액이 있는 경우 해당 예약금의 환불에 대하여는 별도로 고지한 취소환불 약관을 적용합니다.</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <p>※ 카드로 환불을 원하실 경우에는 7% 카드 수수료가 적용됩니다.</p>
                          <p>※ 여행하신 지점과 다른 지점(본사 / 지사 각각) 취소 요청을 하신 경우 정확한 취소가 안되는 경우가 발생할 수 있습니다.</p>
                          <p>※ 항공권 포함 상품은 위 규정외에 별도의 항공권 취소수수료 규정에 따라 위약금이 부과됩니다.</p>
                          <p>▣ 상기 여행 취소수수료외에 항공권 구매완료후 100 % 취소수수료 별도 부과됩니다.</p>
                          <p>* 항공권은 한번 발권후 change, Cancel, Refund 이 되지 않습니다.</p>
                          <p>* 일정을 받으시면 탑승자 영문이름과 항공 스케줄과 날짜등 재확인 부탁드립니다.</p>
                          <p>* 저희 회사의 고의 또는 과실이 아닌 항공기 변경, 연 발착은 저희 책임이 없음을 알려 드립니다.</p>
                          <p>* 천재 지변, 불가항력으로 인한 일정의 변경과 일부 취소에 따는 손해에 대해서는 본사는 면책됨을 알려드립니다.</p>
                          <p>* 본인의 부주의로 인한 귀중품 분실은 저희 본사 책임이 없습니다.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                <ReviewList tourId={tour.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold price-highlight">
                        {formatPrice(tour.price)}
                      </span>
                      {tour.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(tour.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">per person</p>
                  </div>
                  <Badge variant="secondary">
                    {Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
              </CardContent>
            </Card>

            {/* 장바구니 추가 섹션 */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  장바구니에 담기
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 인원수 선택 */}
                <div>
                  <Label className="text-sm font-medium">인원수</Label>
                  <div className="flex items-center mt-2">
                    <Button
                      onClick={() => setCartGuestCount(Math.max(1, cartGuestCount - 1))}
                      variant="outline"
                      size="sm"
                      disabled={cartGuestCount <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="mx-4 text-lg font-medium">{cartGuestCount}명</span>
                    <Button
                      onClick={() => setCartGuestCount(cartGuestCount + 1)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* 예약자 정보 입력 */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="cart-name" className="text-sm font-medium">
                      예약자명 *
                    </Label>
                    <Input
                      id="cart-name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="이름을 입력하세요"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cart-phone" className="text-sm font-medium">
                      연락처 *
                    </Label>
                    <Input
                      id="cart-phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(formatPhoneNumber(e.target.value))}
                      placeholder="010-1234-5678"
                      className="mt-1"
                      maxLength={13}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cart-email" className="text-sm font-medium">
                      이메일 *
                    </Label>
                    <Input
                      id="cart-email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* 총 금액 표시 */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">총 금액</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(tour.price * cartGuestCount)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatPrice(tour.price)} × {cartGuestCount}명
                  </p>
                </div>

                {/* 장바구니 추가 버튼 */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full"
                  variant="outline"
                  disabled={isInCart(tour.id)}
                >
                  {isInCart(tour.id) ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      장바구니에 담김
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      장바구니에 담기
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  * 장바구니에서 여러 상품을 함께 예약할 수 있습니다
                </div>
              </CardContent>
            </Card>

            {/* 예약 폼 */}
            <div className="lg:sticky lg:top-4 mt-6">
              <BookingForm 
                tour={tour} 
                onBookingComplete={(bookingId) => {
                  // 예약 완료 후 처리 (예: 페이지 리다이렉트)
                  console.log('예약 완료:', bookingId);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}