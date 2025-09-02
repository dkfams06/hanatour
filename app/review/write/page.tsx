'use client';

import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewForm from '@/components/ReviewForm';

export default function ReviewWritePage() {
  const searchParams = useSearchParams();
  const tourId = searchParams.get('tourId');
  const bookingId = searchParams.get('bookingId');
  const userId = searchParams.get('userId');

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">여행 후기 작성</h1>
            <p className="text-gray-600">소중한 여행 경험을 다른 여행자들과 공유해주세요</p>
          </div>

          <ReviewForm 
            tourId={tourId || undefined}
            bookingId={bookingId || undefined}
            userId={userId || undefined}
            onReviewSubmitted={() => {
              // 후기 작성 완료 후 처리
              console.log('후기 작성 완료');
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
} 