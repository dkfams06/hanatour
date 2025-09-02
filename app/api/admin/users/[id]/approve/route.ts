import { NextResponse } from 'next/server';
import pool from '@/lib/db';
 
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await pool.query('UPDATE users SET status = ? WHERE id = ?', ['approved', id]);
  return NextResponse.json({ success: true, message: '회원이 승인되었습니다.' });
} 