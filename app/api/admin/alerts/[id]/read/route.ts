import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: alertId } = await params;

    // 인증 확인
    const user = await authenticateToken(request);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    // alertId에서 타입과 참조 ID 추출
    const underscoreIndex = alertId.indexOf('_');
    if (underscoreIndex === -1) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 알림 ID 형식입니다.' },
        { status: 400 }
      );
    }
    
    const type = alertId.substring(0, underscoreIndex);
    const referenceId = alertId.substring(underscoreIndex + 1);
    
    console.log('알림 읽음 처리 요청:', {
      alertId,
      type,
      referenceId,
      userId: user.id
    });
    
    if (!type || !referenceId) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 알림 ID입니다.' },
        { status: 400 }
      );
    }

    // admin_alerts 테이블에서 해당 알림을 읽음 처리 (트랜잭션 시작)
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const [updateResult] = await connection.query(
        `UPDATE admin_alerts 
         SET is_read = TRUE, read_by = ?, read_at = NOW() 
         WHERE alert_type = ? AND reference_id = ?`,
        [user.id, type, referenceId]
      );
      
      console.log('알림 읽음 처리 결과:', {
        affectedRows: (updateResult as any).affectedRows,
        type,
        referenceId,
        updateResult: updateResult
      });
      
      // 업데이트 후 확인 쿼리
      const [verifyResult] = await connection.query(
        `SELECT * FROM admin_alerts WHERE alert_type = ? AND reference_id = ?`,
        [type, referenceId]
      );
      console.log('업데이트 후 확인:', verifyResult);

      // 업데이트된 행이 없으면 새로 생성
      if ((updateResult as any).affectedRows === 0) {
        console.log('기존 알림이 없어서 새로 생성');
        // 기존 알림이 없으면 새로 생성 (읽음 상태로)
        let title = '';
        let message = '';
        
        switch (type) {
          case 'review':
            title = '새로운 리뷰가 작성되었습니다';
            message = '새로운 리뷰가 작성되었습니다. 승인을 기다리고 있습니다.';
            break;
          case 'application':
            title = '새로운 입출금 신청이 있습니다';
            message = '새로운 입출금 신청이 있습니다. 처리해주세요.';
            break;
          case 'booking':
            title = '새로운 예약이 들어왔습니다';
            message = '새로운 예약이 들어왔습니다. 확인해주세요.';
            break;
          default:
            title = '새로운 알림이 있습니다';
            message = '새로운 알림이 있습니다. 확인해주세요.';
        }
        
        await connection.query(
          `INSERT INTO admin_alerts (alert_type, reference_id, title, message, is_read, read_by, read_at) 
           VALUES (?, ?, ?, ?, TRUE, ?, NOW())`,
          [type, referenceId, title, message, user.id]
        );
      }
      
      await connection.commit();
      connection.release();
    } catch (transactionError) {
      await connection.rollback();
      connection.release();
      console.error('트랜잭션 실행 중 오류:', transactionError);
      throw transactionError;
    }

    return NextResponse.json({
      success: true,
      message: '알림이 읽음 처리되었습니다.'
    });

  } catch (error) {
    console.error('알림 읽음 처리 에러:', error);
    return NextResponse.json(
      { success: false, error: '알림 읽음 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
