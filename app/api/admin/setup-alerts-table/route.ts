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

    // admin_alerts 테이블 생성
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS admin_alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        alert_type ENUM('review', 'application', 'booking', 'system') NOT NULL,
        reference_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        read_by VARCHAR(255) NULL COMMENT '읽은 관리자 ID (UUID)',
        read_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_alert_type (alert_type),
        INDEX idx_reference_id (reference_id),
        INDEX idx_is_read (is_read),
        INDEX idx_created_at (created_at),
        
        UNIQUE KEY unique_alert (alert_type, reference_id)
      )
    `;

    await pool.query(createTableSQL);

    return NextResponse.json({
      success: true,
      message: '알림 테이블이 성공적으로 생성되었습니다.'
    });

  } catch (error) {
    console.error('알림 테이블 생성 에러:', error);
    return NextResponse.json(
      { success: false, error: '알림 테이블 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
