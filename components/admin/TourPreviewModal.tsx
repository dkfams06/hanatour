'use client';

import { useState } from 'react';
import { Tour } from '@/lib/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Calendar, 
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface TourPreviewModalProps {
  tour: Tour | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TourPreviewModal({ tour, isOpen, onClose }: TourPreviewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!tour) return null;

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}원`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{tour.title}</DialogTitle>
              <DialogDescription className="flex items-center space-x-2 mt-2">
                <MapPin className="w-4 h-4" />
                <span>{tour.region}</span>
                <Badge variant="outline">미리보기</Badge>
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/tours/${tour.id}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              실제 페이지 보기
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 이미지 갤러리 */}
          {tour.images?.length > 0 && (
            <div className="relative">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img
                  src={tour.images[currentImageIndex]}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                {tour.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-opacity"
                    >
                      <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                  </>
                )}
              </div>
              
              {/* 썸네일 네비게이션 */}
              {tour.images.length > 1 && (
                <div className="flex space-x-2 mt-3 overflow-x-auto">
                  {tour.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
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

          {/* 기본 정보 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>{formatDate(tour.departureDate)}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-gray-500" />
              <span>{tour.currentParticipants}/{tour.maxParticipants}명</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              <span>{tour.rating ? tour.rating.toFixed(1) : '0.0'} ({tour.reviewCount || 0}개)</span>
            </div>
            <div className="font-semibold text-blue-600 text-lg">
              {formatPrice(tour.price)}
            </div>
          </div>

          {/* 상세 정보 탭 */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="included">포함사항</TabsTrigger>
              <TabsTrigger value="details">상세정보</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">상품 설명</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{tour.description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="included" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.included?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">✓ 포함사항</h4>
                    <ul className="space-y-1">
                      {tour.included.map((item: string, index: number) => (
                        <li key={index} className="flex items-start text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {tour.excluded?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">✗ 불포함사항</h4>
                    <ul className="space-y-1">
                      {tour.excluded.map((item: string, index: number) => (
                        <li key={index} className="flex items-start text-sm">
                          <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">상품 ID:</span>
                  <span className="ml-2">{tour.id}</span>
                </div>
                <div>
                  <span className="font-medium">상태:</span>
                  <span className="ml-2">{tour.status}</span>
                </div>
                <div>
                  <span className="font-medium">등록일:</span>
                  <span className="ml-2">{formatDate(tour.createdAt)}</span>
                </div>
                <div>
                  <span className="font-medium">수정일:</span>
                  <span className="ml-2">{formatDate(tour.updatedAt)}</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
} 