import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { db } from '@/lib/db';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 토큰 검증
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, error: '인증 토큰이 필요합니다.' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }

    // 관리자 권한 확인
    const [currentUser] = await pool.query<any[]>(
      'SELECT role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!currentUser || currentUser.length === 0 || currentUser[0].role !== 'admin') {
      return NextResponse.json({ success: false, error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const userId = params.id;
    
    // 사용자 상세 정보 조회
    const [userResult] = await pool.query(
      `SELECT id, username, email, name, nickname, phone, birthDate, role, status, mileage, createdAt, lastLogin
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (!userResult || (userResult as any[]).length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '사용자를 찾을 수 없습니다.' 
      }, { status: 404 });
    }

    const user = (userResult as any[])[0];

    return NextResponse.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('사용자 조회 오류:', error);
    return NextResponse.json({ 
      success: false, 
      error: '서버 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 토큰 검증
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, error: '인증 토큰이 필요합니다.' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }

    // 관리자 권한 확인
    const [currentUser] = await pool.query<any[]>(
      'SELECT role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!currentUser || currentUser.length === 0 || currentUser[0].role !== 'admin') {
      return NextResponse.json({ success: false, error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { id } = params;
    const { name, nickname, email, phone, birthDate, mileage } = await request.json();

    // 필수 필드 검증
    if (!name || !nickname || !email) {
      return NextResponse.json({ 
        success: false, 
        error: '이름, 닉네임, 이메일은 필수 입력 항목입니다.' 
      }, { status: 400 });
    }

    // 날짜 형식 처리
    let formattedBirthDate = null;
    if (birthDate) {
      // ISO 문자열이나 날짜 객체를 YYYY-MM-DD 형식으로 변환
      const date = new Date(birthDate);
      if (!isNaN(date.getTime())) {
        formattedBirthDate = date.toISOString().split('T')[0];
      }
    }

    // 이메일 중복 체크 (본인 제외)
    const [existingEmail] = await pool.query<any[]>(
      'SELECT id FROM users WHERE email = ? AND id != ?', 
      [email, id]
    );
    if (existingEmail.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: '이미 사용 중인 이메일입니다.' 
      }, { status: 409 });
    }

    // 닉네임 중복 체크 (본인 제외)
    const [existingNickname] = await pool.query<any[]>(
      'SELECT id FROM users WHERE nickname = ? AND id != ?', 
      [nickname, id]
    );
    if (existingNickname.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: '이미 사용 중인 닉네임입니다.' 
      }, { status: 409 });
    }

    // 사용자 정보 업데이트
    await pool.query(
      `UPDATE users 
       SET name = ?, nickname = ?, email = ?, phone = ?, birthDate = ?, mileage = ?
       WHERE id = ?`,
      [name, nickname, email, phone, formattedBirthDate, mileage, id]
    );

    return NextResponse.json({ 
      success: true, 
      message: '사용자 정보가 성공적으로 수정되었습니다.' 
    });

  } catch (error) {
    console.error('사용자 정보 수정 오류:', error);
    return NextResponse.json({ 
      success: false, 
      error: '사용자 정보 수정 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// 회원 삭제 (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 토큰 검증
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, error: '인증 토큰이 필요합니다.' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }

    // 현재 사용자의 권한 확인
    const [currentUser] = await pool.query(
      'SELECT id, role, name FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!currentUser || (currentUser as any[]).length === 0) {
      return NextResponse.json({ success: false, error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 관리자 권한 확인
    if ((currentUser as any[])[0].role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: '관리자 권한이 필요합니다.' 
      }, { status: 403 });
    }

    const userId = params.id;

    // 삭제할 회원이 존재하는지 확인
    const [existingUser] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [userId]
    );

    if (!existingUser || (existingUser as any[]).length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '삭제할 회원을 찾을 수 없습니다.' 
      }, { status: 404 });
    }

    const userToDelete = (existingUser as any[])[0];

    // 자기 자신을 삭제하려는 경우 방지
    if (userToDelete.id === decoded.id) {
      return NextResponse.json({ 
        success: false, 
        error: '자기 자신을 삭제할 수 없습니다.' 
      }, { status: 400 });
    }

    // 다른 관리자를 삭제하려는 경우 추가 확인
    if (userToDelete.role === 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: '다른 관리자 계정은 삭제할 수 없습니다.' 
      }, { status: 400 });
    }

    // 연관된 데이터 확인 (예약, 리뷰 등)
    const [bookings] = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE userId = ?',
      [userId]
    );

    const [reviews] = await pool.query(
      'SELECT COUNT(*) as count FROM reviews WHERE userId = ?',
      [userId]
    );

    const [cartItems] = await pool.query(
      'SELECT COUNT(*) as count FROM cart WHERE userId = ?',
      [userId]
    );

    const bookingCount = (bookings as any[])[0]?.count || 0;
    const reviewCount = (reviews as any[])[0]?.count || 0;
    const cartCount = (cartItems as any[])[0]?.count || 0;

    // 연관 데이터가 있는 경우 경고
    if (bookingCount > 0 || reviewCount > 0 || cartCount > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `이 회원은 연관된 데이터가 있어 삭제할 수 없습니다. (예약: ${bookingCount}개, 리뷰: ${reviewCount}개, 장바구니: ${cartCount}개)` 
      }, { status: 400 });
    }

    // 회원 삭제
    const [deleteResult] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );

    if ((deleteResult as any).affectedRows === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '회원 삭제에 실패했습니다.' 
      }, { status: 500 });
    }

    console.log(`회원 삭제 완료: ${userToDelete.name} (${userToDelete.email})`);

    return NextResponse.json({ 
      success: true, 
      message: `회원 "${userToDelete.name}"이(가) 성공적으로 삭제되었습니다.` 
    });

  } catch (error) {
    console.error('회원 삭제 오류:', error);
    return NextResponse.json({ 
      success: false, 
      error: '서버 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}
