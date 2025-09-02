'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  content: string;
  rating: number;
  images: string[];
  status: string;
  userName?: string;
  tourTitle?: string;
}

interface ReviewEditModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewEditModal({ review, isOpen, onClose, onSuccess }: ReviewEditModalProps) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [editReason, setEditReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // 후기 데이터가 변경될 때마다 폼 초기화
  useEffect(() => {
    if (review) {
      setContent(review.content);
      setRating(review.rating);
    }
  }, [review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!review) return;

    if (!content.trim()) {
      toast({
        title: "오류",
        description: "후기 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          rating,
          images: review.images || [],
          editReason: editReason.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "수정 완료",
          description: "후기가 성공적으로 수정되었습니다.",
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "수정 실패",
          description: data.error || "후기 수정에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "후기 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // 원래 데이터로 되돌리기
    if (review) {
      setContent(review.content);
      setRating(review.rating);
    }
    onClose();
  };

  if (!review) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>후기 수정</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 후기 정보 표시 */}
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <p><strong>작성자:</strong> {review.userName || '알 수 없음'}</p>
              <p><strong>투어:</strong> {review.tourTitle || '알 수 없음'}</p>
              <p><strong>상태:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  review.status === 'approved' ? 'bg-green-100 text-green-800' :
                  review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {review.status === 'approved' ? '승인됨' :
                   review.status === 'rejected' ? '거부됨' : '대기중'}
                </span>
              </p>
            </div>
          </div>

          {/* 별점 수정 */}
          <div className="space-y-2">
            <Label htmlFor="rating">별점</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star 
                    className={`w-6 h-6 ${
                      star <= rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
            </div>
          </div>

          {/* 후기 내용 수정 */}
          <div className="space-y-2">
            <Label htmlFor="content">후기 내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="후기 내용을 입력하세요..."
              className="min-h-[120px] resize-none"
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 text-right">
              {content.length}/1000
            </div>
          </div>

          {/* 수정 사유 입력 */}
          <div className="space-y-2">
            <Label htmlFor="editReason">수정 사유 (선택사항)</Label>
            <Textarea
              id="editReason"
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              placeholder="후기 수정 사유를 입력하세요..."
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">
              {editReason.length}/500
            </div>
          </div>

          {/* 이미지 표시 (읽기 전용) */}
          {review.images && review.images.length > 0 && (
            <div className="space-y-2">
              <Label>첨부된 이미지</Label>
              <div className="grid grid-cols-3 gap-2">
                {review.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`후기 이미지 ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                이미지는 수정할 수 없습니다. (기존 이미지 유지)
              </p>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? '수정 중...' : '수정 완료'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
