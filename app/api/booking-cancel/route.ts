import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 예약 취소 요청 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, customerName, phone, reason } = body;

    // 필수 필드 검증
    if (!bookingId || !customerName || !phone) {
      return NextResponse.json(
        { success: false, error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 예약 정보 조회 및 소유권 확인
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM bookings WHERE id = ? AND customerName = ? AND phone = ?',
      [bookingId, customerName, phone]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: '예약 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const booking = rows[0];

    // 취소 가능 상태 확인
    if (booking.status === 'cancelled' || booking.status === 'cancel_requested') {
      return NextResponse.json(
        { success: false, error: '이미 취소되었거나 취소 요청된 예약입니다.' },
        { status: 400 }
      );
    }

    if (booking.status === 'refund_completed') {
      return NextResponse.json(
        { success: false, error: '이미 환불 완료된 예약입니다.' },
        { status: 400 }
      );
    }

    // 출발일 확인 (출발일 당일 또는 이후에는 취소 불가)
    const departureDate = new Date(booking.departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (departureDate <= today) {
      return NextResponse.json(
        { success: false, error: '출발일 당일 이후에는 취소할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 예약 상태를 '취소 요청'으로 변경
    await pool.query(
      'UPDATE bookings SET status = ?, specialRequests = CONCAT(COALESCE(specialRequests, ""), "\n\n[취소 요청 사유] ", ?) WHERE id = ?',
      ['cancel_requested', reason || '사유 없음', bookingId]
    );

    // 여행상품의 현재 참가자 수 차감
    await pool.query(
      'UPDATE tours SET currentParticipants = currentParticipants - ? WHERE id = ?',
      [booking.participants, booking.tourId]
    );

    return NextResponse.json({
      success: true,
      message: '취소 요청이 완료되었습니다. 관리자 검토 후 처리됩니다.',
      booking: {
        id: booking.id,
        status: 'cancel_requested',
        message: '취소 요청이 접수되었습니다. 영업일 기준 1-2일 내에 연락드리겠습니다.'
      }
    });

  } catch (error) {
    console.error('예약 취소 요청 에러:', error);
    return NextResponse.json(
      { success: false, error: '취소 요청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 