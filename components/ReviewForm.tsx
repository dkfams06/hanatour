'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Star, Camera, Plus, Trash2, User, MessageSquare } from 'lucide-react';

interface ReviewFormProps {
  tourId?: string; // 투어 ID (선택사항)
  bookingId?: string; // 예약 ID (선택사항)
  userId?: string; // 사용자 ID (선택사항)
  onReviewSubmitted?: () => void;
}

interface ReviewData {
  customerName: string;
  tourId?: string; // 투어 ID 추가
  bookingId?: string; // 예약 ID 추가
  userId?: string; // 사용자 ID 추가
  rating: number;
  content: string;
  images: string[];
}

export default function ReviewForm({ tourId, bookingId, userId, onReviewSubmitted }: ReviewFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ReviewData>({
    customerName: '',
    tourId: tourId, // 초기값 설정
    bookingId: bookingId, // 초기값 설정
    userId: userId, // 초기값 설정
    rating: 0,
    content: '',
    images: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hoveredStar, setHoveredStar] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('/api/debug/user', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.success && data.user) {
            setCurrentUser(data.user);
            // 로그인한 사용자의 ID를 자동으로 설정
            setFormData(prev => ({
              ...prev,
              userId: data.user.id,
              customerName: data.user.name || data.user.nickname || ''
            }));
          }
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = '이름을 입력해주세요.';
    }

    if (formData.rating === 0) {
      newErrors.rating = '별점을 선택해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '후기 내용을 입력해주세요.';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = '후기는 최소 10글자 이상 작성해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ReviewData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 실시간 에러 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleStarClick = (rating: number) => {
    handleInputChange('rating', rating);
  };

  const handleImageAdd = () => {
    if (formData.images.length >= 5) {
      toast({
        title: "이미지 제한",
        description: "이미지는 최대 5장까지 업로드 가능합니다.",
        variant: "destructive",
      });
      return;
    }
    
    const imageUrl = prompt('이미지 URL을 입력하세요:');
    if (imageUrl) {
      handleInputChange('images', [...formData.images, imageUrl]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    handleInputChange('images', newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // tourId가 없으면 에러
    if (!formData.tourId) {
      toast({
        title: "투어 정보 누락",
        description: "투어 정보가 필요합니다. 투어 상세 페이지에서 후기를 작성해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 디버깅용 로그
    console.log('후기 작성 데이터:', formData);

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "후기 등록 완료!",
          description: data.message,
        });

        // 폼 초기화
        setFormData({
          customerName: '',
          tourId: tourId, // tourId 유지
          bookingId: bookingId, // bookingId 유지
          userId: userId, // userId 유지
          rating: 0,
          content: '',
          images: []
        });

        // 부모 컴포넌트에 알림
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        toast({
          title: "후기 등록 실패",
          description: data.error || '후기 등록 중 오류가 발생했습니다.',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: '후기 등록 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredStar || formData.rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {formData.rating > 0 ? `${formData.rating}점` : '별점을 선택해주세요'}
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          여행 후기 작성
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertDescription>
            <strong>후기 작성 안내</strong><br />
            • 실제 여행을 완료하신 고객님들의 소중한 후기를 기다립니다<br />
            • 로그인한 사용자 정보가 자동으로 입력됩니다<br />
            • 작성된 후기는 관리자 승인 후 게시됩니다
            {currentUser && (
              <div className="mt-2 p-2 bg-blue-50 rounded border">
                <strong>로그인 정보:</strong> {currentUser.name || currentUser.nickname} ({currentUser.email})
              </div>
            )}
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div>
            <Label htmlFor="customerName" className="flex items-center gap-1">
              <User className="w-4 h-4" />
              이름 *
            </Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              placeholder={currentUser ? `${currentUser.name || currentUser.nickname}님의 이름` : "이름을 입력해주세요"}
              disabled={isSubmitting}
              className={errors.customerName ? 'border-red-500' : ''}
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>

          {/* 별점 */}
          <div>
            <Label>별점 평가 *</Label>
            <div className="mt-2">
              {renderStars()}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          {/* 후기 내용 */}
          <div>
            <Label htmlFor="content">후기 내용 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="여행 경험을 자세히 공유해주세요. (최소 10글자)"
              rows={6}
              disabled={isSubmitting}
              className={errors.content ? 'border-red-500' : ''}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.content.length}글자
              </p>
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center gap-1">
                <Camera className="w-4 h-4" />
                사진 첨부 (선택, 최대 5장)
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImageAdd}
                disabled={formData.images.length >= 5 || isSubmitting}
              >
                <Plus className="w-4 h-4 mr-2" />
                사진 추가
              </Button>
            </div>
            
            {formData.images.length > 0 && (
              <div className="space-y-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <img
                      src={image}
                      alt={`후기 이미지 ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.png';
                      }}
                    />
                    <Input
                      value={image}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[index] = e.target.value;
                        handleInputChange('images', newImages);
                      }}
                      placeholder={`이미지 ${index + 1} URL`}
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage(index)}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? '후기 등록 중...' : '후기 등록'}
          </Button>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          * 후기는 관리자 승인 후 게시되며, 허위 또는 부적절한 내용은 삭제될 수 있습니다.
        </div>
      </CardContent>
    </Card>
  );
} 