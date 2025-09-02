'use client';

import { useWishlist } from '@/contexts/WishlistContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Star, MapPin, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { language } = useLanguage();

  const formatPrice = (price: number) => {
    if (language === 'ko') {
      return `${price.toLocaleString()}원`;
    }
    return `$${(price / 1000).toFixed(0)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRemoveItem = async (tourId: string) => {
    await removeFromWishlist(tourId);
  };

  const handleClearAll = async () => {
    if (confirm('모든 찜 목록을 삭제하시겠습니까?')) {
      await clearWishlist();
    }
  };

  if (wishlistCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">찜한 상품이 없습니다</h1>
            <p className="text-gray-600 mb-8">
              마음에 드는 여행 상품을 찜해보세요!
            </p>
            <Link href="/packages">
              <Button className="bg-blue-600 hover:bg-blue-700">
                여행 상품 둘러보기
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">찜한 상품</h1>
            <p className="text-gray-600">총 {wishlistCount}개의 상품을 찜했습니다</p>
          </div>
          {wishlistCount > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearAll}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              전체 삭제
            </Button>
          )}
        </div>

        {/* 찜한 상품 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <Card key={item.tourId} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={item.mainImage}
                  alt={item.tourTitle}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleRemoveItem(item.tourId)}
                  className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
                >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </button>
              </div>
              
              <CardContent className="p-4">
                {/* 지역 */}
                {item.region && (
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.region}
                  </div>
                )}

                {/* 제목 */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {item.tourTitle}
                </h3>

                {/* 출발일 */}
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <span>출발일: {formatDate(item.departureDate)}</span>
                </div>

                {/* 가격 */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatPrice(item.price)}
                    </div>
                    <div className="text-sm text-gray-600">1인 기준</div>
                  </div>
                </div>

                {/* 찜한 날짜 */}
                <div className="text-xs text-gray-500 mb-4">
                  {formatDate(item.addedAt)}에 찜함
                </div>

                {/* 버튼들 */}
                <div className="flex gap-2">
                  <Link href={`/tours/${item.tourId}`} className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      자세히 보기
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveItem(item.tourId)}
                    className="px-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 추가 안내 */}
        <div className="text-center mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">더 많은 여행상품을 찾아보세요!</h3>
          <p className="text-gray-600 mb-4">
            다양한 지역의 특색있는 여행상품들이 기다리고 있습니다.
          </p>
          <Link href="/packages">
            <Button className="bg-blue-600 hover:bg-blue-700">
              여행상품 둘러보기
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
} 