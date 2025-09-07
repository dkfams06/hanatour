import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

// ISO 8601 날짜 문자열을 MySQL DATETIME 형식으로 변환하는 함수
function formatDateForMySQL(dateString: string): string {
  try {
    const date = new Date(dateString);
    // MySQL DATETIME 형식: YYYY-MM-DD HH:MM:SS
    return date.toISOString().slice(0, 19).replace('T', ' ');
  } catch (error) {
    console.error('날짜 형식 변환 오류:', error);
    throw new Error('잘못된 날짜 형식입니다.');
  }
}

// JWT에서 사용자 정보 추출
function getUserFromToken(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// 세션 ID 생성 또는 가져오기 (비로그인 사용자용)
function getSessionId(request: NextRequest): string {
  const sessionId = request.cookies.get('cart_session')?.value;
  return sessionId || uuidv4();
}

// 장바구니 목록 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    const sessionId = getSessionId(request);

    let query = `
      SELECT c.*, t.status as tourStatus, t.maxParticipants, t.currentParticipants
      FROM cart c
      LEFT JOIN tours t ON c.tourId = t.id
      WHERE 
    `;
    let params: any[] = [];

    if (user) {
      // 로그인 사용자: userId 기준으로 조회
      query += 'c.userId = ?';
      params.push(user.id);
    } else {
      // 비로그인 사용자: sessionId 기준으로 조회  
      query += 'c.sessionId = ? AND c.userId IS NULL';
      params.push(sessionId);
    }

    query += ' ORDER BY c.createdAt DESC';

    const [cartItems] = await pool.query<any[]>(query, params);

    // 응답에 sessionId 포함 (비로그인 사용자용)
    const response = NextResponse.json({
      success: true,
      data: cartItems,
      sessionId: user ? undefined : sessionId
    });

    // 비로그인 사용자인 경우 세션 쿠키 설정
    if (!user) {
      response.cookies.set('cart_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30일
      });
    }

    return response;

  } catch (error) {
    console.error('장바구니 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '장바구니 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 장바구니에 상품 추가 (POST)
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    const sessionId = getSessionId(request);
    const body = await request.json();

    const {
      tourId,
      title,
      mainImage,
      price,
      departureDate,
      participants = 1,
      customerName,
      customerPhone,
      customerEmail,
      specialRequests
    } = body;

    // 필수 필드 검증
    if (!tourId || !title || !price || !departureDate || !participants) {
      return NextResponse.json(
        { success: false, error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 여행상품 존재 확인
    const [tours] = await pool.query<any[]>(
      'SELECT id, status, maxParticipants, currentParticipants FROM tours WHERE id = ?',
      [tourId]
    );

    if (tours.length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 여행상품입니다.' },
        { status: 404 }
      );
    }

    const tour = tours[0];
    if (tour.status !== 'published') {
      return NextResponse.json(
        { success: false, error: '예약할 수 없는 상품입니다.' },
        { status: 400 }
      );
    }

    // 중복 확인
    let duplicateQuery = 'SELECT id FROM cart WHERE tourId = ?';
    let duplicateParams = [tourId];

    if (user) {
      duplicateQuery += ' AND userId = ?';
      duplicateParams.push(user.id);
    } else {
      duplicateQuery += ' AND sessionId = ? AND userId IS NULL';
      duplicateParams.push(sessionId);
    }

    const [existingItems] = await pool.query<any[]>(duplicateQuery, duplicateParams);
    
    if (existingItems.length > 0) {
      return NextResponse.json(
        { success: false, error: '이미 장바구니에 있는 상품입니다.' },
        { status: 400 }
      );
    }

    // 장바구니 개수 제한 확인 (사용자/세션당 최대 10개)
    let countQuery = 'SELECT COUNT(*) as count FROM cart WHERE ';
    let countParams: any[] = [];

    if (user) {
      countQuery += 'userId = ?';
      countParams.push(user.id);
    } else {
      countQuery += 'sessionId = ? AND userId IS NULL';
      countParams.push(sessionId);
    }

    const [countResult] = await pool.query<any[]>(countQuery, countParams);
    if (countResult[0].count >= 10) {
      return NextResponse.json(
        { success: false, error: '장바구니는 최대 10개까지만 담을 수 있습니다.' },
        { status: 400 }
      );
    }

    // 총 금액 계산
    const totalAmount = price * participants;

    // 날짜 형식을 MySQL DATE 형식으로 변환
    const formattedDepartureDate = formatDateForMySQL(departureDate);

    // 장바구니에 추가
    const cartId = uuidv4();
    await pool.query(
      `INSERT INTO cart (
        id, userId, sessionId, tourId, tourTitle, mainImage, price, 
        departureDate, participants, customerName, customerPhone, 
        customerEmail, specialRequests, totalAmount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cartId,
        user?.id || null,
        user ? null : sessionId,
        tourId,
        title,
        mainImage,
        price,
        formattedDepartureDate,
        participants,
        customerName || null,
        customerPhone || null,
        customerEmail || null,
        specialRequests || null,
        totalAmount
      ]
    );

    // 응답에 sessionId 포함
    const response = NextResponse.json({
      success: true,
      message: '장바구니에 추가되었습니다.',
      data: {
        id: cartId,
        tourId,
        sessionId: user ? undefined : sessionId
      }
    });

    // 비로그인 사용자인 경우 세션 쿠키 설정
    if (!user) {
      response.cookies.set('cart_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30일
      });
    }

    return response;

  } catch (error) {
    console.error('장바구니 추가 에러:', error);
    return NextResponse.json(
      { success: false, error: '장바구니 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 장바구니 전체 삭제 (DELETE)
export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    const sessionId = getSessionId(request);

    let query = 'DELETE FROM cart WHERE ';
    let params: any[] = [];

    if (user) {
      query += 'userId = ?';
      params.push(user.id);
    } else {
      query += 'sessionId = ? AND userId IS NULL';
      params.push(sessionId);
    }

    await pool.query(query, params);

    return NextResponse.json({
      success: true,
      message: '장바구니가 비워졌습니다.'
    });

  } catch (error) {
    console.error('장바구니 삭제 에러:', error);
    return NextResponse.json(
      { success: false, error: '장바구니 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}