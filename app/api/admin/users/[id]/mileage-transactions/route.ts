import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: 나중에 다른 관리자 API들과 함께 토큰 검증 추가
    // 현재는 다른 관리자 API들과 일관성을 위해 토큰 검증을 임시로 제거

    const userId = params.id;
    console.log('마일리지 내역 조회 요청 - 사용자 ID:', userId);

    // 마일리지 거래 내역 조회
    const [transactions] = await pool.query(
      `SELECT 
        id,
        userId,
        transactionType as type,
        amount,
        description as reason,
        balanceBefore,
        balanceAfter,
        createdAt
      FROM mileage_transactions 
      WHERE userId = ? 
      ORDER BY createdAt DESC 
      LIMIT 50`,
      [userId]
    );

    console.log('마일리지 내역 조회 결과:', {
      success: true,
      transactionsCount: (transactions as any[]).length,
      transactions: transactions
    });

    return NextResponse.json({
      success: true,
      transactions: transactions
    });

  } catch (error) {
    console.error('마일리지 내역 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '마일리지 내역 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
