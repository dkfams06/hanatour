import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query<any[]>('SELECT NOW() as now');
    console.log('[DBTEST] MariaDB 연결 성공:', rows[0]?.now);
    return NextResponse.json({ success: true, now: rows[0]?.now });
  } catch (error) {
    console.error('[DBTEST] MariaDB 연결 실패:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
} 