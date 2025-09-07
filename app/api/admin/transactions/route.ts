import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const user = await authenticateToken(request);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'deposit';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query: string;
    let countQuery: string;
    const params: any[] = [];

    if (type === 'deposit') {
      // 입금 신청 조회
      query = `
        SELECT 
          da.id,
          da.userId,
          da.username,
          da.applicantName as userName,
          da.applicantName as nickname,
          da.applicationType as type,
          da.amount,
          da.applicationMethod,
          da.status,
          da.adminNotes,
          da.processedAt as processedDate,
          da.createdAt as requestDate,
          da.updatedAt
        FROM deposit_applications da
        WHERE da.applicationType = ?
      `;
      countQuery = `SELECT COUNT(*) as total FROM deposit_applications da WHERE da.applicationType = ?`;
      params.push(type);
    } else {
      // 출금 신청 조회
      query = `
        SELECT 
          wa.id,
          wa.userId,
          wa.username,
          wa.applicantName as userName,
          wa.applicantName as nickname,
          wa.applicationType as type,
          wa.amount,
          wa.bankName,
          wa.accountNumber,
          wa.accountHolder,
          wa.status,
          wa.adminNotes,
          wa.transferCompletedAt as processedDate,
          wa.createdAt as requestDate,
          wa.updatedAt
        FROM withdrawal_applications wa
        WHERE wa.applicationType = ?
      `;
      countQuery = `SELECT COUNT(*) as total FROM withdrawal_applications wa WHERE wa.applicationType = ?`;
      params.push(type);
    }

    // 상태 필터 추가
    if (status !== 'all') {
      query += ' AND status = ?';
      countQuery += ' AND status = ?';
      params.push(status);
    }

    // 정렬 및 페이징
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    // 데이터 조회
    const [rows] = await pool.query<any[]>(query, params);

    // 전체 개수 조회
    const [countRows] = await pool.query<any[]>(countQuery, params.slice(0, -2));
    const total = countRows[0]?.total || 0;

    return NextResponse.json({
      success: true,
      transactions: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('입출금 신청 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '입출금 신청 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
