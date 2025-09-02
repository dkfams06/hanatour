import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params;

    // 인증 확인
    const user = await authenticateToken(request);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // 상태 유효성 검사
    const validStatuses = ['pending', 'processing', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 상태입니다.' },
        { status: 400 }
      );
    }

    // 먼저 입금 신청에서 조회
    let [depositRows] = await pool.query<any[]>(
      'SELECT * FROM deposit_applications WHERE id = ?',
      [applicationId]
    );

    let application: any = null;
    let tableName = '';

    if (depositRows.length > 0) {
      application = depositRows[0];
      tableName = 'deposit_applications';
    } else {
      // 출금 신청에서 조회
      const [withdrawalRows] = await pool.query<any[]>(
        'SELECT * FROM withdrawal_applications WHERE id = ?',
        [applicationId]
      );

      if (withdrawalRows.length > 0) {
        application = withdrawalRows[0];
        tableName = 'withdrawal_applications';
      }
    }

    if (!application) {
      return NextResponse.json(
        { success: false, error: '신청을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 상태 업데이트
    const updateField = tableName === 'deposit_applications' ? 'processedAt' : 'transferCompletedAt';
    await pool.query(
      `UPDATE ${tableName} SET status = ?, ${updateField} = NOW() WHERE id = ?`,
      [status, applicationId]
    );

    // 마일리지 거래 내역 추가
    if (status === 'completed') {
      // 현재 마일리지 잔액 조회
      const [userRows] = await pool.query<any[]>(
        'SELECT mileage FROM users WHERE id = ?',
        [application.userId]
      );
      
      const currentBalance = userRows[0]?.mileage || 0;
      let newBalance = currentBalance;
      let transactionType = '';
      let description = '';

      if (tableName === 'deposit_applications') {
        // 입금 완료 시 마일리지 증가
        newBalance = currentBalance + application.amount;
        transactionType = 'deposit';
        description = `입금 신청 완료: ${application.amount.toLocaleString()}원`;
        
        await pool.query(
          'UPDATE users SET mileage = ? WHERE id = ?',
          [newBalance, application.userId]
        );
      } else {
        // 출금 완료 시 마일리지 감소
        newBalance = Math.max(0, currentBalance - application.amount);
        transactionType = 'withdrawal';
        description = `출금 신청 완료: ${application.amount.toLocaleString()}원`;
        
        await pool.query(
          'UPDATE users SET mileage = ? WHERE id = ?',
          [newBalance, application.userId]
        );
      }

      // 마일리지 거래 내역 추가
      await pool.query(
        `INSERT INTO mileage_transactions 
         (id, userId, transactionType, amount, balanceBefore, balanceAfter, description, referenceId, createdAt)
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [application.userId, transactionType, application.amount, currentBalance, newBalance, description, applicationId]
      );
    }

    return NextResponse.json({
      success: true,
      message: '신청 상태가 변경되었습니다.'
    });

  } catch (error) {
    console.error('신청 상태 변경 에러:', error);
    return NextResponse.json(
      { success: false, error: '신청 상태 변경 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
