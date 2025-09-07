import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { nickname } = await request.json();

    if (!nickname || nickname.trim() === '') {
      return NextResponse.json(
        { error: '닉네임을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 닉네임 길이 검증 (2-20자)
    if (nickname.length < 2 || nickname.length > 20) {
      return NextResponse.json(
        { error: '닉네임은 2자 이상 20자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 특수문자 제한 (한글, 영문, 숫자만 허용)
    const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
    if (!nicknameRegex.test(nickname)) {
      return NextResponse.json(
        { error: '닉네임은 한글, 영문, 숫자만 사용 가능합니다.' },
        { status: 400 }
      );
    }

    // 데이터베이스에서 닉네임 중복 확인
    const trimmedNickname = nickname.trim();
    
    const [existingUsers] = await pool.query<any[]>(
      'SELECT id FROM users WHERE nickname = ?',
      [trimmedNickname]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { 
          available: false,
          message: '이미 사용 중인 닉네임입니다.'
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        available: true,
        message: '사용 가능한 닉네임입니다.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('닉네임 중복 확인 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
