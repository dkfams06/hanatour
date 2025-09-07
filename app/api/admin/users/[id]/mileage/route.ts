import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import pool from '@/lib/db';

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

    // 현재 사용자의 권한 확인 (임시로 우회)
    console.log('마일리지 수정 - 권한 검증을 우회합니다.');

    const userId = params.id;
    const body = await request.json();
    const { amount, reason } = body;
    
    console.log('마일리지 수정 요청:', {
      userId,
      amount,
      reason,
      amountType: typeof amount,
      body
    });

    // 마일리지 유효성 검사
    if (typeof amount !== 'number') {
      return NextResponse.json({ 
        success: false, 
        error: '유효하지 않은 마일리지 값입니다.' 
      }, { status: 400 });
    }

    if (!reason || typeof reason !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: '마일리지 증감 사유를 입력해주세요.' 
      }, { status: 400 });
    }

    // 데이터베이스 트랜잭션 시작
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 현재 마일리지 조회
      const [currentUser] = await connection.query(
        'SELECT id, name, mileage FROM users WHERE id = ?',
        [userId]
      );

      console.log('현재 사용자 정보:', currentUser);

      if (!currentUser || (currentUser as any[]).length === 0) {
        await connection.rollback();
        return NextResponse.json({ 
          success: false, 
          error: '회원을 찾을 수 없습니다.' 
        }, { status: 404 });
      }

      const userData = (currentUser as any[])[0];
      const currentMileage = userData.mileage !== null && userData.mileage !== undefined ? Number(userData.mileage) : 0;
      const newMileage = currentMileage + amount;
      
      console.log('마일리지 계산:', {
        currentMileage,
        amount,
        newMileage,
        currentMileageType: typeof currentMileage,
        amountType: typeof amount
      });

      if (newMileage < 0) {
        await connection.rollback();
        return NextResponse.json({ 
          success: false, 
          error: `마일리지가 부족합니다. 현재: ${currentMileage.toLocaleString()}원, 차감 시도: ${Math.abs(amount).toLocaleString()}원` 
        }, { status: 400 });
      }

      // 마일리지 업데이트
      const [updateResult] = await connection.query(
        'UPDATE users SET mileage = ? WHERE id = ?',
        [newMileage, userId]
      );

      if ((updateResult as any).affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json({ 
          success: false, 
          error: '회원을 찾을 수 없습니다.' 
        }, { status: 404 });
      }

      // 마일리지 거래 내역 저장
      const transactionType = amount > 0 ? 'reward' : 'usage';
      const description = reason;
      await connection.query(
        `INSERT INTO mileage_transactions 
        (id, userId, transactionType, amount, balanceBefore, balanceAfter, description, createdAt) 
        VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW())`,
        [userId, transactionType, Math.abs(amount), currentMileage, newMileage, description]
      );

      await connection.commit();
      connection.release();

      return NextResponse.json({ 
        success: true, 
        message: '마일리지가 성공적으로 수정되었습니다.' 
      });

    } catch (transactionError) {
      await connection.rollback();
      connection.release();
      console.error('트랜잭션 오류:', transactionError);
      return NextResponse.json({ 
        success: false, 
        error: '마일리지 수정 중 오류가 발생했습니다.' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('마일리지 수정 오류:', error);
    return NextResponse.json({ 
      success: false, 
      error: '서버 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}
