import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';

export async function DELETE(request: NextRequest) {
  try {
    // 인증 확인
    const user = await authenticateToken(request);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: '삭제할 항목을 선택해주세요.' },
        { status: 400 }
      );
    }

    // 삭제 전 신청 정보 조회 (완료된 신청은 삭제 불가)
    const [depositRows] = await pool.query<any[]>(
      'SELECT * FROM deposit_applications WHERE id IN (?) AND status IN ("completed")',
      [ids]
    );

    const [withdrawalRows] = await pool.query<any[]>(
      'SELECT * FROM withdrawal_applications WHERE id IN (?) AND status IN ("completed")',
      [ids]
    );

    if (depositRows.length > 0 || withdrawalRows.length > 0) {
      return NextResponse.json(
        { success: false, error: '완료된 신청은 삭제할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 입금 신청 삭제
    await pool.query(
      'DELETE FROM deposit_applications WHERE id IN (?)',
      [ids]
    );

    // 출금 신청 삭제
    await pool.query(
      'DELETE FROM withdrawal_applications WHERE id IN (?)',
      [ids]
    );

    return NextResponse.json({
      success: true,
      message: `${ids.length}개 항목이 삭제되었습니다.`
    });

  } catch (error) {
    console.error('입출금 신청 일괄 삭제 에러:', error);
    return NextResponse.json(
      { success: false, error: '삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
