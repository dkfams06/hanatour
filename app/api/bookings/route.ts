import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { sendBookingConfirmationEmail } from '@/lib/email';

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

// bookings 테이블 생성 (없는 경우)
async function createBookingsTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(36) PRIMARY KEY,
      bookingNumber VARCHAR(20) UNIQUE NOT NULL,
      tourId VARCHAR(36) NOT NULL,
      tourTitle VARCHAR(255) NOT NULL,
      customerName VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(100) NOT NULL,
      participants INT NOT NULL,
      specialRequests TEXT,
      status ENUM('pending', 'payment_pending', 'payment_completed', 'payment_expired', 'confirmed', 'cancel_requested', 'cancelled', 'refund_completed') DEFAULT 'payment_pending',
      departureDate DATE NOT NULL,
      totalAmount INT NOT NULL,
      paymentDueDate DATETIME NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (tourId) REFERENCES tours(id) ON DELETE CASCADE
    )
  `;
  
  await pool.execute(createTableSQL);
}

// 예약 등록 (POST)
export async function POST(request: NextRequest) {
  try {
    // bookings 테이블 생성 확인
    await createBookingsTable();

    const body = await request.json();
    const {
      tourId, customerName, phone, email, participants, specialRequests
    } = body;

    // 필수 필드 검증
    if (!tourId || !customerName || !phone || !email || !participants) {
      return NextResponse.json(
        { success: false, error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 참가 인원 검증
    if (participants < 1) {
      return NextResponse.json(
        { success: false, error: '참가 인원은 1명 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 전화번호 형식 검증 (간단한 한국 전화번호 형식)
    const phoneRegex = /^01[0-9]-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: '전화번호는 010-1234-5678 형식으로 입력해주세요.' },
        { status: 400 }
      );
    }

    // 여행상품 정보 조회
    const [tourRows] = await pool.query<any[]>(
      'SELECT id, title, departureDate, price, maxParticipants, currentParticipants, status FROM tours WHERE id = ?',
      [tourId]
    );

    if (tourRows.length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 여행상품입니다.' },
        { status: 404 }
      );
    }

    const tour = tourRows[0];

    // 상품 상태 확인
    if (tour.status !== 'published') {
      return NextResponse.json(
        { success: false, error: '예약할 수 없는 상품입니다.' },
        { status: 400 }
      );
    }

    // 예약 가능 인원 확인
    const availableSeats = tour.maxParticipants - tour.currentParticipants;
    if (participants > availableSeats) {
      return NextResponse.json(
        { success: false, error: `예약 가능 인원을 초과했습니다. (잔여: ${availableSeats}명)` },
        { status: 400 }
      );
    }

    // 출발일 확인 (과거 날짜 예약 불가)
    const tourDepartureDate = new Date(tour.departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (tourDepartureDate < today) {
      return NextResponse.json(
        { success: false, error: '이미 지난 여행상품은 예약할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 예약 id 생성
    const id = uuidv4();
    // 예약번호 생성 (HT + 년월일 + 랜덤 4자리)
    const today_str = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = `HT${today_str}${randomNum}`;

    // 총 금액 계산
    const totalAmount = tour.price * participants;

    // 입금 기한 계산 (예약 후 24시간 또는 출발일 3일 전 중 빠른 날짜)
    const now = new Date();
    const payment24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24시간 후
    const bookingDepartureDate = new Date(tour.departureDate);
    const threeDaysBeforeDeparture = new Date(bookingDepartureDate.getTime() - 3 * 24 * 60 * 60 * 1000); // 출발일 3일 전
    
    // 더 빠른 날짜를 입금 기한으로 설정
    const paymentDueDate = payment24Hours < threeDaysBeforeDeparture ? payment24Hours : threeDaysBeforeDeparture;
    
    // 만약 입금 기한이 현재보다 과거라면 (당일 출발 등), 2시간 후로 설정
    const finalPaymentDueDate = paymentDueDate > now ? paymentDueDate : new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // 날짜 형식을 MySQL DATE 형식으로 변환
    const formattedDepartureDate = formatDateForMySQL(tour.departureDate);

    // 예약 정보 저장
    await pool.query(
      `INSERT INTO bookings (id, bookingNumber, tourId, tourTitle, customerName, phone, email, participants, specialRequests, status, departureDate, totalAmount, paymentDueDate) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'payment_pending', ?, ?, ?)`,
      [
        id,
        bookingNumber,
        tourId,
        tour.title,
        customerName,
        phone,
        email,
        participants,
        specialRequests || null,
        formattedDepartureDate,
        totalAmount,
        finalPaymentDueDate.toISOString().slice(0, 19).replace('T', ' ') // MySQL DATETIME 형식
      ]
    );

    // 여행상품의 현재 참가자 수 업데이트
    await pool.query(
      'UPDATE tours SET currentParticipants = currentParticipants + ? WHERE id = ?',
      [participants, tourId]
    );

    // 관리자 알림 생성
    try {
      await pool.query(
        `INSERT INTO admin_alerts (alert_type, reference_id, title, message, is_read, created_at) 
         VALUES (?, ?, ?, ?, FALSE, NOW())`,
        [
          'booking',
          id,
          '새로운 예약이 들어왔습니다',
          `새로운 예약이 들어왔습니다. 예약번호: ${bookingNumber}, 고객: ${customerName}, 상품: ${tour.title}`
        ]
      );
      console.log(`관리자 알림 생성: 예약 ${bookingNumber}`);
    } catch (alertError) {
      console.error(`관리자 알림 생성 실패 (${bookingNumber}):`, alertError);
      // 알림 생성 실패는 전체 프로세스를 중단하지 않음
    }

    // 예약 확인 이메일 발송
    try {
      const bookingForEmail = {
        bookingNumber,
        tourTitle: tour.title,
        customerName,
        customerEmail: email,
        participants,
        totalAmount,
        departureDate: tour.departureDate,
        paymentDueDate: finalPaymentDueDate.toISOString()
      };
      
      const emailResult = await sendBookingConfirmationEmail(bookingForEmail);
      console.log(`예약 확인 이메일 발송: ${bookingNumber} -> ${email}`, emailResult);
    } catch (emailError) {
      console.error(`예약 확인 이메일 발송 실패 (${bookingNumber}):`, emailError);
      // 이메일 발송 실패는 전체 프로세스를 중단하지 않음
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '예약 신청이 완료되었습니다. 입금 기한 내에 입금해주세요.',
      booking: {
        id,
        bookingNumber,
        tourTitle: tour.title,
        customerName,
        phone,
        email,
        participants,
        departureDate: tour.departureDate,
        totalAmount,
        paymentDueDate: finalPaymentDueDate.toISOString(),
        status: 'payment_pending'
      }
    });

  } catch (error) {
    console.error('예약 등록 에러:', error);
    return NextResponse.json(
      { success: false, error: '예약 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 예약 목록 조회 (GET) - 관리자용
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let where = '1=1';
    const params: any[] = [];
    
    if (status) {
      where += ' AND status = ?';
      params.push(status);
    }

    const [rows] = await pool.query<any[]>(
      `SELECT * FROM bookings WHERE ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return NextResponse.json({ success: true, bookings: rows });
  } catch (error) {
    console.error('예약 목록 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '예약 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}