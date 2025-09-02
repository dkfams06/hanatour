import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const user = await authenticateToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { applicantName, amount, applicationMethod } = body;

    // 입력값 검증
    if (!applicantName || !applicantName.trim()) {
      return NextResponse.json(
        { success: false, error: '신청자명을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!amount || amount < 1000) {
      return NextResponse.json(
        { success: false, error: '입금 금액은 1,000원 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 입금 신청 ID 생성
    const applicationId = `dep_${uuidv4().replace(/-/g, '').substring(0, 12)}`;

    // 입금 신청 데이터 삽입
    await pool.query(
      `INSERT INTO deposit_applications 
       (id, userId, username, applicantName, applicationType, amount, applicationMethod, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        applicationId,
        user.id,
        user.username,
        applicantName.trim(),
        'deposit',
        amount,
        applicationMethod || '직접충전',
        'pending'
      ]
    );

    // 관리자 알림 생성
    try {
      await pool.query(
        `INSERT INTO admin_alerts (alert_type, reference_id, title, message, is_read, created_at) 
         VALUES (?, ?, ?, ?, FALSE, NOW())`,
        [
          'application',
          applicationId,
          '새로운 입금 신청이 들어왔습니다',
          `새로운 입금 신청이 들어왔습니다. 신청자: ${user.name || user.nickname}, 금액: ${amount.toLocaleString()}원, 방법: ${applicationMethod || '직접충전'}`
        ]
      );
      console.log(`관리자 알림 생성: 입금 신청 ${applicationId}`);
    } catch (alertError) {
      console.error(`관리자 알림 생성 실패 (${applicationId}):`, alertError);
      // 알림 생성 실패는 전체 프로세스를 중단하지 않음
    }

    return NextResponse.json({
      success: true,
      message: '입금 신청이 완료되었습니다.',
      applicationId
    });

  } catch (error) {
    console.error('입금 신청 에러:', error);
    return NextResponse.json(
      { success: false, error: '입금 신청 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
