import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TourDetail from '@/components/TourDetail';
import pool from '@/lib/db';
import { Tour } from '@/lib/types';

// 서버에서 여행상품 데이터 가져오기
async function getTourData(id: string): Promise<Tour | null> {
  try {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM tours WHERE id = ? AND status = "published"',
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const tour = rows[0];
    // JSON 필드 파싱
    return {
      ...tour,
      images: tour.images ? JSON.parse(tour.images) : [],
      included: tour.included ? JSON.parse(tour.included) : [],
      excluded: tour.excluded ? JSON.parse(tour.excluded) : [],
    };
  } catch (error) {
    console.error('여행상품 조회 에러:', error);
    return null;
  }
}

export default async function TourDetailPage({ params }: { params: { id: string } }) {
  const tour = await getTourData(params.id);
  
  if (!tour) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <TourDetail tour={tour} />
      </main>
      <Footer />
    </div>
  );
}