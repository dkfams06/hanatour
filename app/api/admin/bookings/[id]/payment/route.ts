import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendPaymentCompletedEmail } from '@/lib/email';

interface RouteParams {
  params: {
    id: string;
  };
}

// 결제 확인 처리 (POST)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const bookingId = params.id;
    const body = await request.json();
    const { 
      paymentMethod = 'bank_transfer', 
      bankName, 
      accountHolder, 
      adminMemo 
    } = body;

    // 예약 정보 조회 (이메일 발송을 위해 더 많은 정보 포함)
    const [bookings] = await pool.query<any[]>(
      `SELECT id, bookingNumber, status, totalAmount, customerName, email as customerEmail, 
              tourTitle, participants, departureDate
       FROM bookings WHERE id = ?`,
      [bookingId]
    );

    if (bookings.length === 0) {
      return NextResponse.json(
        { success: false, error: '예약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const booking = bookings[0];

    // 결제 대기 상태인지 확인
    if (booking.status !== 'payment_pending') {
      return NextResponse.json(
        { success: false, error: '결제 대기 상태의 예약만 결제 확인이 가능합니다.' },
        { status: 400 }
      );
    }

    const now = new Date();
    const paidAt = now.toISOString().slice(0, 19).replace('T', ' '); // MySQL DATETIME 형식

    // 트랜잭션 시작
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 예약 상태를 payment_completed로 변경
      await connection.query(
        'UPDATE bookings SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        ['payment_completed', bookingId]
      );

      // payments 테이블에 결제 기록 추가
      const paymentId = `payment_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      await connection.query(
        `INSERT INTO payments (id, bookingId, amount, paymentMethod, status, paidAt, bankName, accountHolder, adminMemo) 
         VALUES (?, ?, ?, ?, 'completed', ?, ?, ?, ?)`,
        [
          paymentId,
          bookingId,
          booking.totalAmount,
          paymentMethod,
          paidAt,
          bankName || null,
          accountHolder || null,
          adminMemo || null
        ]
      );

      await connection.commit();

      // 결제 완료 이메일 발송
      try {
        const paymentInfo = {
          method: paymentMethod,
          paidAt: now.toISOString(),
          bankName,
          accountHolder
        };
        
        const emailResult = await sendPaymentCompletedEmail(booking, paymentInfo);
        console.log(`결제 완료 이메일 발송: ${booking.bookingNumber} -> ${booking.customerEmail}`, emailResult);
      } catch (emailError) {
        console.error(`결제 완료 이메일 발송 실패 (${booking.bookingNumber}):`, emailError);
        // 이메일 발송 실패는 전체 프로세스를 중단하지 않음
      }

      return NextResponse.json({
        success: true,
        message: '결제가 확인되었습니다. 예약이 확정되었습니다.',
        booking: {
          bookingNumber: booking.bookingNumber,
          customerName: booking.customerName,
          status: 'payment_completed',
          paidAt: now.toISOString(),
          paymentMethod,
          bankName,
          accountHolder
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('결제 확인 처리 에러:', error);
    return NextResponse.json(
      { success: false, error: '결제 확인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 결제 정보 조회 (GET)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const bookingId = params.id;

    // 예약과 결제 정보 조회
    const [results] = await pool.query<any[]>(
      `SELECT 
        b.id, b.bookingNumber, b.status, b.totalAmount, b.customerName, b.paymentDueDate,
        p.id as paymentId, p.paymentMethod, p.status as paymentStatus, p.paidAt, 
        p.bankName, p.accountHolder, p.adminMemo
       FROM bookings b
       LEFT JOIN payments p ON b.id = p.bookingId
       WHERE b.id = ?`,
      [bookingId]
    );

    if (results.length === 0) {
      return NextResponse.json(
        { success: false, error: '예약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const result = results[0];

    return NextResponse.json({
      success: true,
      booking: {
        id: result.id,
        bookingNumber: result.bookingNumber,
        status: result.status,
        totalAmount: result.totalAmount,
        customerName: result.customerName,
        paymentDueDate: result.paymentDueDate,
        payment: result.paymentId ? {
          id: result.paymentId,
          paymentMethod: result.paymentMethod,
          status: result.paymentStatus,
          paidAt: result.paidAt,
          bankName: result.bankName,
          accountHolder: result.accountHolder,
          adminMemo: result.adminMemo
        } : null
      }
    });

  } catch (error) {
    console.error('결제 정보 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '결제 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}