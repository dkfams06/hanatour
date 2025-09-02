// @ts-nocheck - MySQL2 타입 이슈로 인한 임시 조치
import { NextResponse } from 'next/server';
import db from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// 특정 예약 조회
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    // 예약 정보 조회
    const query = `
      SELECT 
        b.*,
        t.title AS tourTitle,
        t.departureDate,
        t.price AS tourPrice
      FROM bookings b
      LEFT JOIN tours t ON b.tourId = t.id
      WHERE b.id = ?
    `;
    
    // @ts-ignore - MySQL2 타입 이슈 임시 해결
    const [bookings] = await db.query(query, [id]);
    
    // @ts-ignore
    if (!bookings || bookings.length === 0) {
      return NextResponse.json(
        { success: false, error: '예약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bookings[0]
    });
  } catch (error) {
    console.error('예약 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '예약 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 예약 상태 업데이트
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // 기존 예약 정보 조회
    const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    
    if (!bookings || bookings.length === 0) {
      return NextResponse.json(
        { success: false, error: '예약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    const booking = bookings[0];
    
    // 상태 변경 처리
    if (body.status && body.status !== booking.status) {
      // 취소 상태로 변경 시 참가자 수 업데이트
      if (['cancelled', 'refund_completed'].includes(body.status) && 
          !['cancelled', 'refund_completed'].includes(booking.status)) {
        // 투어 참가자 수 감소
        await db.query(
          'UPDATE tours SET currentParticipants = currentParticipants - ? WHERE id = ?',
          [booking.participants, booking.tourId]
        );
      }
      // 취소에서 확정 상태로 변경 시 참가자 수 증가
      else if (body.status === 'confirmed' && 
              ['cancelled', 'refund_completed'].includes(booking.status)) {
        // 투어 참가자 수 증가
        await db.query(
          'UPDATE tours SET currentParticipants = currentParticipants + ? WHERE id = ?',
          [booking.participants, booking.tourId]
        );
      }
    }
    
    // 예약 정보 업데이트
    const updateFields = [];
    const updateValues = [];
    
    // 업데이트 가능한 필드 목록
    const updatableFields = [
      'status', 'customerName', 'customerPhone', 'customerEmail', 
      'participants', 'totalAmount', 'specialRequests', 'adminNotes'
    ];
    
    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(body[field]);
      }
    }
    
    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: '업데이트할 내용이 없습니다.' },
        { status: 400 }
      );
    }
    
    // 업데이트 시간 추가
    updateFields.push('updatedAt = NOW()');
    
    const updateQuery = `
      UPDATE bookings 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;
    
    updateValues.push(id);
    
    await db.query(updateQuery, updateValues);
    
    // 업데이트된 예약 정보 조회
    const [updatedBookings] = await db.query(`
      SELECT 
        b.*,
        t.title AS tourTitle,
        t.departureDate
      FROM bookings b
      LEFT JOIN tours t ON b.tourId = t.id
      WHERE b.id = ?
    `, [id]);
    
    return NextResponse.json({
      success: true,
      data: updatedBookings[0],
      message: '예약 정보가 성공적으로 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('예약 업데이트 오류:', error);
    return NextResponse.json(
      { success: false, error: '예약 정보 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 예약 삭제
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    
    // 기존 예약 정보 조회
    const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    
    if (!bookings || bookings.length === 0) {
      return NextResponse.json(
        { success: false, error: '예약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    const booking = bookings[0];
    
    // 예약 삭제 전에 투어 참가자 수 업데이트
    if (!['cancelled', 'refund_completed'].includes(booking.status)) {
      await db.query(
        'UPDATE tours SET currentParticipants = currentParticipants - ? WHERE id = ?',
        [booking.participants, booking.tourId]
      );
    }
    
    // 예약 삭제
    await db.query('DELETE FROM bookings WHERE id = ?', [id]);
    
    return NextResponse.json({
      success: true,
      message: '예약이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('예약 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '예약 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 