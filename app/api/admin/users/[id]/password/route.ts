import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 토큰 검증
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, error: '인증 토큰이 필요합니다.' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }

    // 관리자 권한 확인
    const [currentUser] = await pool.query<any[]>(
      'SELECT role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!currentUser || currentUser.length === 0 || currentUser[0].role !== 'admin') {
      return NextResponse.json({ success: false, error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const userId = params.id;
    
    // 사용자 존재 확인
    const [userResult] = await pool.query<any[]>(
      'SELECT id, username, email, name FROM users WHERE id = ?',
      [userId]
    );

    if (!userResult || userResult.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '사용자를 찾을 수 없습니다.' 
      }, { status: 404 });
    }

    const user = userResult[0];

    // 원본 비밀번호 조회
    const [passwordResult] = await pool.query<any[]>(
      'SELECT original_password, created_at FROM user_passwords_backup WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (!passwordResult || passwordResult.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '원본 비밀번호 정보를 찾을 수 없습니다.' 
      }, { status: 404 });
    }

    const passwordInfo = passwordResult[0];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
      password: {
        original: passwordInfo.original_password,
        createdAt: passwordInfo.created_at
      }
    });

  } catch (error) {
    console.error('원본 비밀번호 조회 오류:', error);
    return NextResponse.json({ 
      success: false, 
      error: '서버 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 토큰 검증
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, error: '인증 토큰이 필요합니다.' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }

    // 관리자 권한 확인
    const [currentUser] = await pool.query<any[]>(
      'SELECT role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!currentUser || currentUser.length === 0 || currentUser[0].role !== 'admin') {
      return NextResponse.json({ success: false, error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const userId = params.id;
    const { newPassword } = await request.json();

    // 새 비밀번호 검증
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: '비밀번호는 최소 6자 이상이어야 합니다.' 
      }, { status: 400 });
    }

    // 사용자 존재 확인
    const [userResult] = await pool.query<any[]>(
      'SELECT id, username, email, name FROM users WHERE id = ?',
      [userId]
    );

    if (!userResult || userResult.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '사용자를 찾을 수 없습니다.' 
      }, { status: 404 });
    }

    const user = userResult[0];

    // 새 비밀번호 해시
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 사용자 비밀번호 업데이트
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    // 새 비밀번호 백업 저장
    const backupId = crypto.randomUUID();
    await pool.query(
      'INSERT INTO user_passwords_backup (id, user_id, original_password) VALUES (?, ?, ?)',
      [backupId, userId, newPassword]
    );

    return NextResponse.json({
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      }
    });

  } catch (error) {
    console.error('비밀번호 수정 오류:', error);
    return NextResponse.json({ 
      success: false, 
      error: '비밀번호 수정 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
