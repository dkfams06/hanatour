import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params;

    // 인증 확인
    const user = await authenticateToken(request);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    // 후기 존재 확인
    const [reviewRows] = await pool.query<any[]>(
      'SELECT * FROM reviews WHERE id = ?',
      [reviewId]
    );

    if (reviewRows.length === 0) {
      return NextResponse.json(
        { success: false, error: '후기를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const review = reviewRows[0];

    // 후기 승인
    await pool.query(
      'UPDATE reviews SET status = ?, updatedAt = NOW() WHERE id = ?',
      ['approved', reviewId]
    );

    // 투어 상품의 평균 별점 및 후기 수 업데이트 (tourId가 있는 경우만)
    if (review.tourId) {
      const [ratingStats] = await pool.query<any[]>(
        'SELECT AVG(rating) as avgRating, COUNT(*) as reviewCount FROM reviews WHERE tourId = ? AND status = "approved"',
        [review.tourId]
      );

      if (ratingStats.length > 0) {
        const avgRating = parseFloat(ratingStats[0].avgRating) || 0;
        const reviewCount = ratingStats[0].reviewCount || 0;
        
        await pool.query(
          'UPDATE tours SET rating = ?, reviewCount = ? WHERE id = ?',
          [avgRating, reviewCount, review.tourId]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: '후기가 승인되었습니다.'
    });

  } catch (error) {
    console.error('후기 승인 에러:', error);
    return NextResponse.json(
      { success: false, error: '후기 승인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}