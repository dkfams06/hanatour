import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';

// 접속 로그 조회
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const action = searchParams.get('action') || '';
    const device = searchParams.get('device') || '';
    const status = searchParams.get('status') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    const offset = (page - 1) * limit;

    // 기본 쿼리
    let query = `
      SELECT 
        al.id,
        al.user_id,
        u.username,
        u.email,
        u.name,
        u.nickname,
        u.role,
        al.action,
        al.ip_address,
        al.user_agent,
        al.device,
        al.location,
        al.status,
        al.created_at as timestamp
      FROM access_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;

    const params: any[] = [];

    // 검색 조건 추가
    if (search) {
      query += ` AND (u.username LIKE ? OR u.email LIKE ? OR al.ip_address LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (action) {
      query += ` AND al.action = ?`;
      params.push(action);
    }

    if (device) {
      query += ` AND al.device = ?`;
      params.push(device);
    }

    if (status) {
      query += ` AND al.status = ?`;
      params.push(status);
    }

    if (startDate) {
      query += ` AND DATE(al.created_at) >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND DATE(al.created_at) <= ?`;
      params.push(endDate);
    }

    // 정렬 및 페이징
    query += ` ORDER BY al.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [logs] = await pool.query(query, params) as any;

    // 전체 개수 조회
    let countQuery = `
      SELECT COUNT(*) as total
      FROM access_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;

    const countParams = params.slice(0, -2); // LIMIT, OFFSET 제외
    if (search) {
      countQuery += ` AND (u.username LIKE ? OR u.email LIKE ? OR al.ip_address LIKE ?)`;
    }
    if (action) {
      countQuery += ` AND al.action = ?`;
    }
    if (device) {
      countQuery += ` AND al.device = ?`;
    }
    if (status) {
      countQuery += ` AND al.status = ?`;
    }
    if (startDate) {
      countQuery += ` AND DATE(al.created_at) >= ?`;
    }
    if (endDate) {
      countQuery += ` AND DATE(al.created_at) <= ?`;
    }

    const [totalResult] = await pool.query(countQuery, countParams) as any;
    const total = totalResult[0]?.total || 0;

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('접속 로그 조회 오류:', error);
    return NextResponse.json({ error: '접속 로그 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 접속 로그 생성 (로그인/로그아웃 시 호출)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, ipAddress, userAgent, device, location, status } = body;

    if (!userId || !action || !ipAddress) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    const query = `
      INSERT INTO access_logs (
        user_id, action, ip_address, user_agent, device, location, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `;

    await pool.query(query, [userId, action, ipAddress, userAgent || '', device || 'unknown', location || '', status || 'success']);

    return NextResponse.json({ message: '접속 로그가 기록되었습니다.' });

  } catch (error) {
    console.error('접속 로그 생성 오류:', error);
    return NextResponse.json({ error: '접속 로그 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
