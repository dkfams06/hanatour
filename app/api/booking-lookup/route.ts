import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 예약 조회 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingNumber, customerName, phone } = body;

    // 필수 필드 검증
    if (!bookingNumber || !customerName || !phone) {
      return NextResponse.json(
        { success: false, error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 예약 정보 조회 (예약번호, 이름, 전화번호 일치, 하이픈/공백 무시)
    const [rows] = await pool.query<any[]>(
      `SELECT 
        b.*,
        p.paymentMethod, p.paidAt, p.bankName, p.accountHolder
       FROM bookings b
       LEFT JOIN payments p ON b.id = p.bookingId
       WHERE b.bookingNumber = ?
         AND TRIM(b.customerName) = TRIM(?)
         AND REPLACE(b.phone, '-', '') = REPLACE(?, '-', '')`,
      [bookingNumber, customerName, phone]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: '예약 정보를 찾을 수 없습니다. 입력 정보를 확인해주세요.' },
        { status: 404 }
      );
    }

    const booking = rows[0];

    // 결제 상태에 따른 메시지 생성
    let statusMessage = '';
    let paymentInfo = null;

    switch (booking.status) {
      case 'payment_pending':
        const dueDate = new Date(booking.paymentDueDate);
        const now = new Date();
        const isExpired = dueDate < now;
        
        statusMessage = isExpired 
          ? '입금 기한이 만료되었습니다. 고객센터로 문의해주세요.'
          : `입금 기한: ${dueDate.toLocaleString('ko-KR')}까지 입금해주세요.`;
        break;
      case 'payment_completed':
        statusMessage = '결제가 완료되었습니다. 예약이 확정되었습니다.';
        if (booking.paymentMethod) {
          paymentInfo = {
            method: booking.paymentMethod,
            paidAt: booking.paidAt,
            bankName: booking.bankName,
            accountHolder: booking.accountHolder
          };
        }
        break;
      case 'payment_expired':
        statusMessage = '입금 기한이 만료되어 예약이 취소되었습니다.';
        break;
      case 'confirmed':
        statusMessage = '예약이 확정되었습니다.';
        break;
      case 'cancelled':
        statusMessage = '예약이 취소되었습니다.';
        break;
      default:
        statusMessage = '예약 상태를 확인 중입니다.';
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        tourTitle: booking.tourTitle,
        customerName: booking.customerName,
        phone: booking.phone,
        email: booking.email,
        participants: booking.participants,
        departureDate: booking.departureDate,
        totalAmount: booking.totalAmount,
        status: booking.status,
        statusMessage,
        paymentDueDate: booking.paymentDueDate,
        specialRequests: booking.specialRequests,
        createdAt: booking.createdAt,
        paymentInfo
      }
    });

  } catch (error) {
    console.error('예약 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '예약 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 