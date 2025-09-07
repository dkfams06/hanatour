import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { role } = await request.json();
    const { id } = params;

    // 유효한 role 값 검증
    const validRoles = ['customer', 'admin', 'staff'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({
        success: false,
        error: '유효하지 않은 권한입니다.'
      }, { status: 400 });
    }

    // 사용자 권한 업데이트
    const [result] = await pool.query<any>(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      }, { status: 404 });
    }

    // 업데이트된 사용자 정보 조회
    const [rows] = await pool.query<any[]>(
      'SELECT id, email, name, phone, birthDate, role, status, createdAt, lastLogin FROM users WHERE id = ?',
      [id]
    );

    const updatedUser = rows[0];

    return NextResponse.json({
      success: true,
      message: '권한이 변경되었습니다.',
      user: updatedUser
    });
  } catch (error) {
    console.error('권한 변경 에러:', error);
    return NextResponse.json({
      success: false,
      error: '권한 변경 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
} 