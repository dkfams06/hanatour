import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendPaymentExpiredEmail, sendPaymentReminderEmail } from '@/lib/email';

// 입금 기한 만료 체크 및 처리 (GET)
export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const currentTime = now.toISOString().slice(0, 19).replace('T', ' '); // MySQL DATETIME 형식

    // 입금 기한이 지난 payment_pending 상태의 예약들 조회 (이메일 발송을 위해 email도 포함)
    const [expiredBookings] = await pool.query<any[]>(
      `SELECT id, bookingNumber, tourId, tourTitle, customerName, email as customerEmail, participants, paymentDueDate, totalAmount, departureDate
       FROM bookings 
       WHERE status = 'payment_pending' 
       AND paymentDueDate < ?`,
      [currentTime]
    );

    if (expiredBookings.length === 0) {
      return NextResponse.json({
        success: true,
        message: '만료된 예약이 없습니다.',
        expiredCount: 0
      });
    }

    // 만료된 예약들을 payment_expired 상태로 변경
    const expiredIds = expiredBookings.map(booking => booking.id);
    const placeholders = expiredIds.map(() => '?').join(',');
    
    await pool.query(
      `UPDATE bookings 
       SET status = 'payment_expired', updatedAt = CURRENT_TIMESTAMP 
       WHERE id IN (${placeholders})`,
      expiredIds
    );

    // 만료된 예약들의 참가자 수를 여행상품에서 차감 및 이메일 발송
    const emailResults = [];
    for (const booking of expiredBookings) {
      // 참가자 수 차감
      await pool.query(
        'UPDATE tours SET currentParticipants = GREATEST(0, currentParticipants - ?) WHERE id = ?',
        [booking.participants, booking.tourId]
      );

      // 만료 이메일 발송
      try {
        const emailResult = await sendPaymentExpiredEmail(booking);
        emailResults.push({
          bookingNumber: booking.bookingNumber,
          email: booking.customerEmail,
          success: emailResult.success
        });
        console.log(`만료 이메일 발송: ${booking.bookingNumber} -> ${booking.customerEmail}`);
      } catch (emailError) {
        console.error(`이메일 발송 실패 (${booking.bookingNumber}):`, emailError);
        emailResults.push({
          bookingNumber: booking.bookingNumber,
          email: booking.customerEmail,
          success: false,
          error: emailError instanceof Error ? emailError.message : String(emailError)
        });
      }
    }

    console.log(`입금 기한 만료 처리 완료: ${expiredBookings.length}개 예약`);

    return NextResponse.json({
      success: true,
      message: `${expiredBookings.length}개의 예약이 만료 처리되었습니다.`,
      expiredCount: expiredBookings.length,
      expiredBookings: expiredBookings.map(booking => ({
        bookingNumber: booking.bookingNumber,
        tourTitle: booking.tourTitle,
        customerName: booking.customerName,
        paymentDueDate: booking.paymentDueDate
      })),
      emailResults
    });

  } catch (error) {
    console.error('입금 기한 만료 체크 에러:', error);
    return NextResponse.json(
      { success: false, error: '입금 기한 체크 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 특정 예약의 입금 기한 연장 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, extensionHours = 24 } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: '예약 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 예약 정보 조회
    const [bookings] = await pool.query<any[]>(
      'SELECT id, bookingNumber, status, paymentDueDate FROM bookings WHERE id = ?',
      [bookingId]
    );

    if (bookings.length === 0) {
      return NextResponse.json(
        { success: false, error: '예약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const booking = bookings[0];

    if (booking.status !== 'payment_pending') {
      return NextResponse.json(
        { success: false, error: '결제 대기 상태의 예약만 기한 연장이 가능합니다.' },
        { status: 400 }
      );
    }

    // 새로운 입금 기한 계산 (현재 시간 + 연장 시간)
    const now = new Date();
    const newPaymentDueDate = new Date(now.getTime() + extensionHours * 60 * 60 * 1000);

    // 입금 기한 업데이트
    await pool.query(
      'UPDATE bookings SET paymentDueDate = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [newPaymentDueDate.toISOString().slice(0, 19).replace('T', ' '), bookingId]
    );

    return NextResponse.json({
      success: true,
      message: `입금 기한이 ${extensionHours}시간 연장되었습니다.`,
      booking: {
        bookingNumber: booking.bookingNumber,
        newPaymentDueDate: newPaymentDueDate.toISOString(),
        extensionHours
      }
    });

  } catch (error) {
    console.error('입금 기한 연장 에러:', error);
    return NextResponse.json(
      { success: false, error: '입금 기한 연장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}