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
    const { applicantName, withdrawalName, bankName, accountNumber, amount } = body;

    // 입력값 검증
    if (!withdrawalName || !withdrawalName.trim()) {
      return NextResponse.json(
        { success: false, error: '출금자명을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!bankName || !bankName.trim()) {
      return NextResponse.json(
        { success: false, error: '출금 은행을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!accountNumber || !accountNumber.trim()) {
      return NextResponse.json(
        { success: false, error: '출금 계좌를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!amount || amount < 1000) {
      return NextResponse.json(
        { success: false, error: '출금 금액은 1,000원 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 마일리지 잔액 확인
    const [userRows] = await pool.query<any[]>(
      'SELECT mileage FROM users WHERE id = ?',
      [user.id]
    );

    const currentMileage = userRows[0]?.mileage || 0;
    if (amount > currentMileage) {
      return NextResponse.json(
        { success: false, error: '보유 마일리지보다 많은 금액을 출금할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 출금 신청 ID 생성
    const applicationId = `with_${uuidv4().replace(/-/g, '').substring(0, 12)}`;

    // 출금 신청 데이터 삽입
    await pool.query(
      `INSERT INTO withdrawal_applications 
       (id, userId, username, applicantName, applicationType, amount, bankName, accountNumber, accountHolder, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        applicationId,
        user.id,
        user.username,
        applicantName || user.name || user.nickname,
        'withdrawal',
        amount,
        bankName.trim(),
        accountNumber.trim(),
        withdrawalName.trim(),
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
          '새로운 출금 신청이 들어왔습니다',
          `새로운 출금 신청이 들어왔습니다. 신청자: ${user.name || user.nickname}, 금액: ${amount.toLocaleString()}원, 은행: ${bankName}`
        ]
      );
      console.log(`관리자 알림 생성: 출금 신청 ${applicationId}`);
    } catch (alertError) {
      console.error(`관리자 알림 생성 실패 (${applicationId}):`, alertError);
      // 알림 생성 실패는 전체 프로세스를 중단하지 않음
    }

    return NextResponse.json({
      success: true,
      message: '출금 신청이 완료되었습니다.',
      applicationId
    });

  } catch (error) {
    console.error('출금 신청 에러:', error);
    return NextResponse.json(
      { success: false, error: '출금 신청 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
