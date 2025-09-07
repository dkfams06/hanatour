import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';

// 관리자 예약 목록 조회
export async function GET(request: Request) {
  try {
    // 관리자 권한 확인
    // 실제 구현에서는 세션 체크 필요
    // 현재는 모의 데이터로 진행

    const { searchParams } = new URL(request.url);
    
    // 필터 파라미터 추출
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const tourId = searchParams.get('tourId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 쿼리 구성 - 중복 컬럼명 문제 해결을 위해 별칭 사용
    let query = `
      SELECT 
        b.*,
        t.title AS tourTitle,
        t.departureDate AS tourDepartureDate,
        p.paymentMethod,
        p.paidAt,
        p.bankName,
        p.accountHolder,
        p.adminMemo
      FROM bookings b
      LEFT JOIN tours t ON b.tourId = t.id
      LEFT JOIN payments p ON b.id = p.bookingId
      WHERE 1=1
    `;
    const queryParams: any[] = [];

    // 필터 적용
    if (status) {
      query += ` AND b.status = ?`;
      queryParams.push(status);
    }

    if (search) {
      query += ` AND (b.bookingNumber LIKE ? OR b.customerName LIKE ? OR b.customerPhone LIKE ? OR b.customerEmail LIKE ?)`;
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (tourId) {
      query += ` AND b.tourId = ?`;
      queryParams.push(tourId);
    }

    if (startDate) {
      query += ` AND t.departureDate >= ?`;
      queryParams.push(startDate);
    }

    if (endDate) {
      query += ` AND t.departureDate <= ?`;
      queryParams.push(endDate);
    }

    // 총 개수 쿼리 - 중복 컬럼명 문제 해결
    const countQuery = `SELECT COUNT(*) AS total FROM (
      SELECT 
        b.id,
        t.title AS tourTitle,
        t.departureDate AS tourDepartureDate
      FROM bookings b
      LEFT JOIN tours t ON b.tourId = t.id
      WHERE 1=1
      ${status ? ' AND b.status = ?' : ''}
      ${search ? ' AND (b.bookingNumber LIKE ? OR b.customerName LIKE ? OR b.customerPhone LIKE ? OR b.customerEmail LIKE ?)' : ''}
      ${tourId ? ' AND b.tourId = ?' : ''}
      ${startDate ? ' AND t.departureDate >= ?' : ''}
      ${endDate ? ' AND t.departureDate <= ?' : ''}
    ) AS countTable`;
    
    const [countResult] = await db.query<any[]>(countQuery, queryParams);
    const total = countResult[0].total;

    // 정렬 및 페이지네이션
    query += ` ORDER BY b.${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    // 예약 목록 조회
    const [bookings] = await db.query<any[]>(query, queryParams);

    return NextResponse.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('관리자 예약 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '예약 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 관리자 예약 생성
export async function POST(request: Request) {
  try {
    // 관리자 권한 확인
    // 실제 구현에서는 세션 체크 필요
    // 현재는 모의 데이터로 진행

    const body = await request.json();
    
    // 필수 필드 검증
    const requiredFields = ['tourId', 'customerName', 'customerPhone', 'customerEmail', 'participants'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} 필드는 필수입니다.` },
          { status: 400 }
        );
      }
    }

    // 투어 정보 확인
    const tourQuery = 'SELECT * FROM tours WHERE id = ?';
    const [tourResult] = await db.query<any[]>(tourQuery, [body.tourId]);
    
    if (tourResult.length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 투어입니다.' },
        { status: 400 }
      );
    }
    
    const tour = tourResult[0];
    
    // 참가자 수 검증
    if (body.participants <= 0) {
      return NextResponse.json(
        { success: false, error: '참가자 수는 1명 이상이어야 합니다.' },
        { status: 400 }
      );
    }
    
    const availableSlots = tour.maxParticipants - tour.currentParticipants;
    if (body.participants > availableSlots) {
      return NextResponse.json(
        { success: false, error: `예약 가능한 인원을 초과했습니다. 현재 가능한 인원: ${availableSlots}명` },
        { status: 400 }
      );
    }

    // 예약번호 생성 (HT + 날짜 + 랜덤 4자리)
    const today = new Date();
    const dateStr = today.getFullYear().toString() +
                   (today.getMonth() + 1).toString().padStart(2, '0') +
                   today.getDate().toString().padStart(2, '0');
    const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingNumber = `HT${dateStr}${randomStr}`;
    
    // 총 금액 계산
    const totalAmount = tour.price * body.participants;

    // 예약 생성
    const bookingId = uuidv4();
    const insertQuery = `
      INSERT INTO bookings (
        id, bookingNumber, tourId, customerName, customerPhone, 
        customerEmail, participants, totalAmount, specialRequests, 
        status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    await db.query(insertQuery, [
      bookingId,
      bookingNumber,
      body.tourId,
      body.customerName,
      body.customerPhone,
      body.customerEmail,
      body.participants,
      totalAmount,
      body.specialRequests || '',
      body.status || 'confirmed'
    ]);
    
    // 투어 현재 참가자 수 업데이트
    await db.query(
      'UPDATE tours SET currentParticipants = currentParticipants + ? WHERE id = ?',
      [body.participants, body.tourId]
    );
    
    // 생성된 예약 정보 조회
    const bookingQuery = `
      SELECT 
        b.*,
        t.title AS tourTitle,
        t.departureDate AS tourDepartureDate
      FROM bookings b
      LEFT JOIN tours t ON b.tourId = t.id
      WHERE b.id = ?
    `;
    const [booking] = await db.query<any[]>(bookingQuery, [bookingId]);
    
    return NextResponse.json({
      success: true,
      data: booking[0],
      message: '예약이 성공적으로 생성되었습니다.'
    }, { status: 201 });
  } catch (error) {
    console.error('관리자 예약 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '예약 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 