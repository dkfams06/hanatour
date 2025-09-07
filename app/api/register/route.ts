import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendTemplateEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { username, nickname, email, password, name, phone, birthDate } = await request.json();

    // 필수 필드 검증
    if (!username || !nickname || !email || !password || !name) {
      return NextResponse.json({ 
        success: false, 
        error: '필수 입력 항목을 모두 입력해주세요. (아이디, 닉네임, 이메일, 비밀번호, 이름)' 
      }, { status: 400 });
    }

    // 아이디(Username) 중복 체크
    const [userRows] = await pool.query<any[]>('SELECT id FROM users WHERE username = ?', [username]);
    if (userRows.length > 0) {
      return NextResponse.json({ success: false, error: '이미 사용 중인 아이디입니다.' }, { status: 409 });
    }

    // 이메일 중복 체크
    const [rows] = await pool.query<any[]>('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return NextResponse.json({ success: false, error: '이미 가입된 이메일입니다.' }, { status: 409 });
    }

    // 비밀번호 해시
    const hashed = await bcrypt.hash(password, 10);

    // 회원 등록 (status: approved - 바로 승인)
    const id = crypto.randomUUID();
    await pool.query(
      'INSERT INTO users (id, username, nickname, email, password, name, phone, birthDate, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, username, nickname, email, hashed, name, phone, birthDate, 'customer', 'approved']
    );

    // 원본 비밀번호 백업 저장
    const backupId = crypto.randomUUID();
    await pool.query(
      'INSERT INTO user_passwords_backup (id, user_id, original_password) VALUES (?, ?, ?)',
      [backupId, id, password]
    );

    // 회원가입 완료 이메일 발송
    try {
      const emailVariables = {
        customerName: name,
        email: email,
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      };
      
      const emailResult = await sendTemplateEmail(email, 'registration_completed', emailVariables);
      console.log(`회원가입 완료 이메일 발송: ${email}`, emailResult);
    } catch (emailError) {
      console.error(`회원가입 완료 이메일 발송 실패 (${email}):`, emailError);
      // 이메일 발송 실패는 전체 프로세스를 중단하지 않음
    }

    return NextResponse.json({ 
      success: true, 
      message: '회원가입이 완료되었습니다. 지금 바로 로그인하실 수 있습니다!' 
    });
  } catch (error) {
    console.error('회원가입 에러:', error);
    return NextResponse.json({ 
      success: false, 
      error: '회원가입 처리 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 