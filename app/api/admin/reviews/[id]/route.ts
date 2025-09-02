import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';

// 후기 수정 (PUT)
export async function PUT(
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

    const { content, rating, images, editReason } = await request.json();

    // 유효성 검사
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { success: false, error: '후기 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: '별점은 1~5 사이의 값이어야 합니다.' },
        { status: 400 }
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

    // 첫 번째 수정인 경우 원본 내용 백업
    const isFirstEdit = !review.originalContent;
    const originalContent = isFirstEdit ? review.content : review.originalContent;
    const originalRating = isFirstEdit ? review.rating : review.originalRating;

    // 후기 수정
    const updateData = {
      content: content.trim(),
      rating,
      images: images ? JSON.stringify(images) : null,
      updatedAt: new Date(),
      editedBy: user.username || user.id,
      editReason: editReason || null,
      originalContent: originalContent,
      originalRating: originalRating,
      editCount: (review.editCount || 0) + 1
    };

    await pool.query(
      `UPDATE reviews 
       SET content = ?, rating = ?, images = ?, updatedAt = ?, 
           editedBy = ?, editReason = ?, originalContent = ?, originalRating = ?, editCount = ?
       WHERE id = ?`,
      [
        updateData.content, updateData.rating, updateData.images, updateData.updatedAt,
        updateData.editedBy, updateData.editReason, updateData.originalContent, 
        updateData.originalRating, updateData.editCount, reviewId
      ]
    );

    // 수정 이력 테이블에 기록 (선택사항)
    try {
      await pool.query(
        `INSERT INTO review_edit_history 
         (reviewId, editedBy, editReason, oldContent, newContent, oldRating, newRating)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          reviewId, updateData.editedBy, updateData.editReason,
          review.content, updateData.content, review.rating, updateData.rating
        ]
      );
    } catch (error) {
      // 이력 테이블이 없거나 오류가 발생해도 후기 수정은 계속 진행
      console.warn('후기 수정 이력 기록 실패:', error);
    }

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
      message: '후기가 수정되었습니다.'
    });

  } catch (error) {
    console.error('후기 수정 에러:', error);
    return NextResponse.json(
      { success: false, error: '후기 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
