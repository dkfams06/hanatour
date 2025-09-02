import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '@/lib/jwt';

// 후기 작성 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, tourId, bookingId, userId, rating, content, images } = body;

    // 로그인한 사용자 정보 가져오기
    let loggedInUserId = userId;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (token) {
      try {
        const decoded = await verifyToken(token);
        if (decoded && decoded.id) {
          loggedInUserId = decoded.id;
          console.log('로그인한 사용자 ID:', loggedInUserId);
        }
      } catch (error) {
        console.error('토큰 검증 실패:', error);
      }
    }

    // 필수 필드 검증
    if (!customerName || !rating || !content) {
      return NextResponse.json(
        { success: false, error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // tourId 검증 (투어 상세 페이지에서 후기 작성 시 필수)
    if (!tourId) {
      return NextResponse.json(
        { success: false, error: '투어 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    // 별점 범위 검증
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: '별점은 1점부터 5점까지 입력 가능합니다.' },
        { status: 400 }
      );
    }

    // 이미지 개수 검증
    if (images && images.length > 5) {
      return NextResponse.json(
        { success: false, error: '이미지는 최대 5장까지 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    // 투어 존재 여부 확인
    const [tourRows] = await pool.query<any[]>(
      'SELECT id FROM tours WHERE id = ?',
      [tourId]
    );

    if (tourRows.length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 투어입니다.' },
        { status: 400 }
      );
    }

    // bookingId가 없으면 더미 bookingId 생성 (테이블 제약조건 만족)
    const finalBookingId = bookingId || `dummy_${Date.now()}`;

    // 후기 저장
    const reviewId = uuidv4();
    await pool.query(
      `INSERT INTO reviews (id, tourId, bookingId, userId, customerName, rating, content, images, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        reviewId,
        tourId,
        finalBookingId,
        loggedInUserId || null,
        customerName,
        rating,
        content,
        images ? JSON.stringify(images) : null
      ]
    );

    // 관리자 알림 생성
    try {
      await pool.query(
        `INSERT INTO admin_alerts (alert_type, reference_id, title, message, is_read, created_at) 
         VALUES (?, ?, ?, ?, FALSE, NOW())`,
        [
          'review',
          reviewId,
          '새로운 후기가 등록되었습니다',
          `새로운 후기가 등록되었습니다. 작성자: ${customerName}, 별점: ${rating}점, 투어: ${tourId}`
        ]
      );
      console.log(`관리자 알림 생성: 후기 ${reviewId}`);
    } catch (alertError) {
      console.error(`관리자 알림 생성 실패 (${reviewId}):`, alertError);
      // 알림 생성 실패는 전체 프로세스를 중단하지 않음
    }

    return NextResponse.json({
      success: true,
      message: '후기가 등록되었습니다. 관리자 승인 후 게시됩니다.',
      review: {
        id: reviewId,
        tourId,
        bookingId: finalBookingId,
        userId: loggedInUserId,
        customerName,
        rating,
        content,
        status: 'pending'
      }
    });

  } catch (error: any) {
    console.error('후기 작성 에러:', error);
    
    return NextResponse.json(
      { success: false, error: '후기 등록 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 후기 목록 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tourId');
    const status = searchParams.get('status') || 'approved';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let where = 'status = ?';
    const params: any[] = [status];

    if (tourId) {
      where += ' AND tourId = ?';
      params.push(tourId);
    }

    // 후기 목록 조회
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM reviews WHERE ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // JSON 필드 파싱
    const reviews = rows.map(review => ({
      ...review,
      images: review.images ? JSON.parse(review.images) : [],
    }));

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('후기 목록 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '후기 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}