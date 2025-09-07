import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'pending', 'approved', 'all'
    const online = searchParams.get('online'); // 'online', 'offline', 'all'
    const search = searchParams.get('search'); // 검색어
    
    let sql = `
      SELECT 
        u.id, 
        u.email, 
        u.name, 
        u.nickname, 
        u.phone, 
        u.birthDate, 
        u.role, 
        u.status, 
        u.mileage, 
        u.createdAt, 
        u.lastLogin,
        0 as isOnline,
        NULL as lastActivity,
        NULL as sessionDuration
      FROM users u
    `;
    
    const params: any[] = [];
    const conditions: string[] = [];
    
    // 상태 필터
    if (status && status !== 'all') {
      conditions.push('u.status = ?');
      params.push(status);
    }
    
    // 검색 필터 (이름 또는 닉네임)
    if (search && search.trim()) {
      conditions.push('(u.name LIKE ? OR u.nickname LIKE ?)');
      params.push(`%${search.trim()}%`);
      params.push(`%${search.trim()}%`);
    }
    
    // WHERE 절 추가
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    // 접속 상태 필터는 임시로 비활성화
    // 온라인 상태 기능은 추후 구현
    
    sql += ' ORDER BY u.createdAt DESC';
    
    const [rows] = await pool.query<any[]>(sql, params);
    
    return NextResponse.json({ 
      success: true, 
      users: rows 
    });
    
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    return NextResponse.json({ 
      success: false, 
      error: '사용자 목록을 불러오는 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 