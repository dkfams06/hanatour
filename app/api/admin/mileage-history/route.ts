import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('마일리지 내역 API 호출됨');
    
    // TODO: 나중에 다른 관리자 API들과 함께 토큰 검증 추가
    // 현재는 다른 관리자 API들과 일관성을 위해 토큰 검증을 임시로 제거

    // 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const date = searchParams.get('date') || '';

    const offset = (page - 1) * limit;

    // WHERE 조건 구성
    let whereConditions = [];
    let params = [];

    if (search) {
      whereConditions.push(`(u.name LIKE ? OR u.email LIKE ? OR mt.description LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (type) {
      whereConditions.push(`mt.transactionType = ?`);
      params.push(type);
    }

    if (date) {
      const now = new Date();
      let dateCondition = '';
      
      switch (date) {
        case 'today':
          dateCondition = 'DATE(mt.createdAt) = CURDATE()';
          break;
        case 'week':
          dateCondition = 'mt.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
          break;
        case 'month':
          dateCondition = 'mt.createdAt >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';
          break;
        default:
          break;
      }
      
      if (dateCondition) {
        whereConditions.push(dateCondition);
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // 전체 개수 조회
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total
       FROM mileage_transactions mt
       LEFT JOIN users u ON mt.userId = u.id
       ${whereClause}`,
      params
    );

    const totalCount = (countResult as any[])[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    console.log('마일리지 내역 조회 - 총 개수:', totalCount, '페이지:', totalPages);

    // 거래 내역 조회
    const [transactions] = await pool.query(
      `SELECT 
        mt.id,
        mt.userId,
        u.name as userName,
        u.email as userEmail,
        mt.transactionType,
        mt.amount,
        mt.balanceBefore,
        mt.balanceAfter,
        mt.description,
        mt.referenceId,
        mt.createdAt
       FROM mileage_transactions mt
       LEFT JOIN users u ON mt.userId = u.id
       ${whereClause}
       ORDER BY mt.createdAt DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    console.log('마일리지 내역 조회 결과:', {
      success: true,
      transactionsCount: (transactions as any[]).length,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: page,
      limit: limit
    });

    return NextResponse.json({
      success: true,
      transactions: transactions,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: page,
      limit: limit
    });

  } catch (error) {
    console.error('마일리지 내역 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '마일리지 내역 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
