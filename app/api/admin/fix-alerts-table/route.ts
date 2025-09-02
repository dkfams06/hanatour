import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const user = await authenticateToken(request);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    // admin_alerts 테이블의 read_by 컬럼 타입 수정
    const alterTableSQL = `
      ALTER TABLE admin_alerts 
      MODIFY COLUMN read_by VARCHAR(255) NULL COMMENT '읽은 관리자 ID (UUID)'
    `;

    await pool.query(alterTableSQL);

    // 변경사항 확인
    const [describeResult] = await pool.query('DESCRIBE admin_alerts');

    return NextResponse.json({
      success: true,
      message: 'admin_alerts 테이블이 성공적으로 수정되었습니다.',
      tableStructure: describeResult
    });

  } catch (error) {
    console.error('admin_alerts 테이블 수정 에러:', error);
    return NextResponse.json(
      { success: false, error: '테이블 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
