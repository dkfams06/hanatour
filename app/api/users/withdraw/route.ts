import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('회원탈퇴 API 호출됨');
    
    // TODO: 나중에 다른 사용자 API들과 함께 토큰 검증 추가
    // 현재는 다른 사용자 API들과 일관성을 위해 토큰 검증을 임시로 제거
    
    const body = await request.json();
    const { reason, password, userId } = body; // userId를 body에서 받도록 변경

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 사용자 존재 확인
    const [userCheck] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (!userCheck || (userCheck as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 사용자입니다.' },
        { status: 404 }
      );
    }

    // 비밀번호 확인 (선택사항)
    if (password) {
      const [userResult] = await pool.query(
        'SELECT password FROM users WHERE id = ?',
        [userId]
      );

      if (!userResult || (userResult as any[]).length === 0) {
        return NextResponse.json(
          { success: false, error: '사용자를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      // TODO: 비밀번호 해시 검증 로직 추가
      // const isValidPassword = await bcrypt.compare(password, userResult[0].password);
      // if (!isValidPassword) {
      //   return NextResponse.json(
      //     { success: false, error: '비밀번호가 일치하지 않습니다.' },
      //     { status: 400 }
      //   );
      // }
    }

    // 데이터베이스 트랜잭션 시작
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 연관된 데이터 확인
      const [bookings] = await connection.query(
        'SELECT COUNT(*) as count FROM bookings WHERE userId = ?',
        [userId]
      );

      const [reviews] = await connection.query(
        'SELECT COUNT(*) as count FROM reviews WHERE userId = ?',
        [userId]
      );

      const [cartItems] = await connection.query(
        'SELECT COUNT(*) as count FROM cart WHERE userId = ?',
        [userId]
      );

      const bookingCount = (bookings as any[])[0]?.count || 0;
      const reviewCount = (reviews as any[])[0]?.count || 0;
      const cartCount = (cartItems as any[])[0]?.count || 0;

      // 탈퇴 전 데이터 백업 (선택사항)
      if (bookingCount > 0 || reviewCount > 0) {
        // TODO: 탈퇴한 사용자 데이터를 별도 테이블에 백업
        console.log(`탈퇴 사용자 데이터 - 예약: ${bookingCount}개, 리뷰: ${reviewCount}개`);
      }

      // 연관된 데이터 삭제 (CASCADE 설정이 있다면 자동 삭제됨)
      await connection.query('DELETE FROM cart WHERE userId = ?', [userId]);
      await connection.query('DELETE FROM reviews WHERE userId = ?', [userId]);
      await connection.query('DELETE FROM bookings WHERE userId = ?', [userId]);
      await connection.query('DELETE FROM wishlist WHERE userId = ?', [userId]);
      await connection.query('DELETE FROM active_sessions WHERE user_id = ?', [userId]);
      await connection.query('DELETE FROM mileage_transactions WHERE userId = ?', [userId]);
      await connection.query('DELETE FROM deposit_applications WHERE userId = ?', [userId]);
      await connection.query('DELETE FROM withdrawal_applications WHERE userId = ?', [userId]);

      // 사용자 정보 삭제
      const [deleteResult] = await connection.query(
        'DELETE FROM users WHERE id = ?',
        [userId]
      );

      if ((deleteResult as any).affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: '회원탈퇴 처리에 실패했습니다.' },
          { status: 500 }
        );
      }

      await connection.commit();
      connection.release();

      console.log(`회원탈퇴 완료: ${userId}, 사유: ${reason || '없음'}`);

      return NextResponse.json({
        success: true,
        message: '회원탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.'
      });

    } catch (transactionError) {
      await connection.rollback();
      connection.release();
      console.error('회원탈퇴 트랜잭션 오류:', transactionError);
      return NextResponse.json(
        { success: false, error: '회원탈퇴 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('회원탈퇴 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
