import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
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
      CASE WHEN MAX(s.id) IS NOT NULL THEN 1 ELSE 0 END as isOnline,
      MAX(s.last_activity) as lastActivity,
      CASE 
        WHEN MAX(s.id) IS NOT NULL THEN 
          CONCAT(
            FLOOR((NOW() - MAX(s.login_time)) / 3600), '시간 ',
            FLOOR(((NOW() - MAX(s.login_time)) % 3600) / 60), '분'
          )
        ELSE NULL 
      END as sessionDuration
    FROM users u
    LEFT JOIN active_sessions s ON u.id = s.user_id AND s.is_active = 1
    GROUP BY u.id, u.email, u.name, u.nickname, u.phone, u.birthDate, u.role, u.status, u.mileage, u.createdAt, u.lastLogin
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
  
  // 접속 상태 필터 (HAVING 절 사용)
  if (online === 'online') {
    sql += ' HAVING MAX(s.id) IS NOT NULL';
  } else if (online === 'offline') {
    sql += ' HAVING MAX(s.id) IS NULL';
  }
  
  sql += ' ORDER BY u.createdAt DESC';
  const [rows] = await pool.query<any[]>(sql, params);
  return NextResponse.json({ success: true, users: rows });
} 