import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

// 푸터 설정 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    // 푸터 설정 조회 (모든 설정 조회)
    const [settings] = await pool.query<any[]>(
      'SELECT * FROM footer_settings ORDER BY sort_order ASC, id ASC'
    );

    return NextResponse.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('푸터 설정 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '푸터 설정 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 푸터 설정 업데이트 (PUT)
export async function PUT(request: NextRequest) {
  try {
    // 인증 확인
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json(
        { success: false, error: '잘못된 요청 데이터입니다.' },
        { status: 400 }
      );
    }

    // 트랜잭션 시작
    await pool.query('START TRANSACTION');

    try {
      // 각 설정 업데이트
      for (const setting of settings) {
        const { id, setting_value, is_active } = setting;
        
        await pool.query(
          'UPDATE footer_settings SET setting_value = ?, is_active = ?, updated_at = NOW() WHERE id = ?',
          [setting_value, is_active, id]
        );
      }

      // 트랜잭션 커밋
      await pool.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: '푸터 설정이 성공적으로 업데이트되었습니다.'
      });

    } catch (error) {
      // 트랜잭션 롤백
      await pool.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('푸터 설정 업데이트 오류:', error);
    return NextResponse.json(
      { success: false, error: '푸터 설정 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}
