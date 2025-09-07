import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    console.log('카카오 인증 API 호출 시작');
    const { accessToken } = await request.json();
    console.log('받은 액세스 토큰:', accessToken ? '존재함' : '없음');

    if (!accessToken) {
      console.log('액세스 토큰이 없어서 400 응답');
      return NextResponse.json({ 
        success: false, 
        error: '카카오 액세스 토큰이 필요합니다.' 
      }, { status: 400 });
    }

    // 카카오 API를 통해 사용자 정보 가져오기
    console.log('카카오 API 호출 시작');
    const kakaoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    console.log('카카오 API 응답 상태:', kakaoResponse.status);
    
    if (!kakaoResponse.ok) {
      console.log('카카오 API 호출 실패:', kakaoResponse.status, kakaoResponse.statusText);
      return NextResponse.json({ 
        success: false, 
        error: '카카오 사용자 정보를 가져올 수 없습니다.' 
      }, { status: 400 });
    }

    const kakaoUserData = await kakaoResponse.json();
    console.log('카카오 사용자 정보:', kakaoUserData);

    const kakaoId = kakaoUserData.id;
    const kakaoAccount = kakaoUserData.kakao_account;
    const profile = kakaoAccount?.profile;

    console.log('카카오 계정 정보:', {
      kakaoId,
      hasEmail: !!kakaoAccount?.email,
      email: kakaoAccount?.email,
      hasProfile: !!profile,
      nickname: profile?.nickname
    });

    // 이메일이 없을 경우 기본 이메일 생성
    const email = kakaoAccount?.email || `kakao_${kakaoId}@kakao.local`;
    const nickname = profile?.nickname || `카카오사용자${kakaoId}`;
    const name = profile?.nickname || nickname;

    console.log('처리된 사용자 정보:', { email, nickname, name });

    // 기존 카카오 계정으로 가입된 사용자 확인
    const [existingKakaoUser] = await pool.query<any[]>(
      'SELECT * FROM users WHERE kakao_id = ?',
      [kakaoId.toString()]
    );

    if (existingKakaoUser.length > 0) {
      // 기존 카카오 사용자 - 로그인 처리
      const user = existingKakaoUser[0];
      
      // 로그인 토큰 생성
      const tokenPayload = {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        name: user.name,
        role: user.role,
        mileage: user.mileage || 0
      };
      console.log('기존 사용자 토큰 생성 페이로드:', tokenPayload);
      const token = await generateToken(tokenPayload);
      console.log('기존 사용자 생성된 토큰:', token ? '토큰 생성됨' : '토큰 생성 실패');

      return NextResponse.json({
        success: true,
        message: '카카오 로그인 성공',
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          mileage: user.mileage || 0
        },
        token
      });
    }

    // 실제 이메일이 있는 경우에만 이메일로 기존 계정 확인
    if (kakaoAccount?.email) {
      const [existingEmailUser] = await pool.query<any[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (existingEmailUser.length > 0) {
        // 기존 이메일 계정에 카카오 ID 연결
        const user = existingEmailUser[0];
        
        await pool.query(
          'UPDATE users SET kakao_id = ? WHERE id = ?',
          [kakaoId.toString(), user.id]
        );

        // 로그인 토큰 생성
        const tokenPayload = {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          name: user.name,
          role: user.role,
          mileage: user.mileage || 0
        };
        console.log('기존 계정 연결 토큰 생성 페이로드:', tokenPayload);
        const token = await generateToken(tokenPayload);
        console.log('기존 계정 연결 생성된 토큰:', token ? '토큰 생성됨' : '토큰 생성 실패');

        return NextResponse.json({
          success: true,
          message: '기존 계정에 카카오 연결 및 로그인 성공',
          user: {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            mileage: user.mileage || 0
          },
          token
        });
      }
    }

    // 새 사용자 생성
    const userId = randomUUID();
    const username = `kakao_${kakaoId}`;
    
    // 기본 비밀번호 (카카오 로그인이므로 실제로는 사용되지 않음)
    const defaultPassword = randomUUID();
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // 닉네임 중복 확인 및 처리
    let finalNickname = nickname;
    const [nicknameCheck] = await pool.query<any[]>(
      'SELECT COUNT(*) as count FROM users WHERE nickname = ?',
      [nickname]
    );

    if (nicknameCheck[0].count > 0) {
      finalNickname = `${nickname}_${Date.now()}`;
    }

    // 새 사용자 등록
    await pool.query(
      'INSERT INTO users (id, username, nickname, email, password, name, role, status, kakao_id, mileage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, username, finalNickname, email, hashedPassword, name, 'customer', 'approved', kakaoId.toString(), 0]
    );

    // 비밀번호 백업 저장 (카카오 로그인용)
    const backupId = randomUUID();
    await pool.query(
      'INSERT INTO user_passwords_backup (id, user_id, original_password) VALUES (?, ?, ?)',
      [backupId, userId, `kakao_login_${kakaoId}`]
    );

    // 로그인 토큰 생성
    const tokenPayload = {
      id: userId,
      username: username,
      nickname: finalNickname,
      email: email,
      name: name,
      role: 'customer',
      mileage: 0
    };
    console.log('토큰 생성 페이로드:', tokenPayload);
    const token = await generateToken(tokenPayload);
    console.log('생성된 토큰:', token ? '토큰 생성됨' : '토큰 생성 실패');

    return NextResponse.json({
      success: true,
      message: '카카오 회원가입 및 로그인 성공',
      user: {
        id: userId,
        username: username,
        nickname: finalNickname,
        email: email,
        name: name,
        role: 'customer',
        status: 'approved',
        mileage: 0
      },
      token
    });

  } catch (error) {
    console.error('카카오 로그인 오류:', error);
    console.error('오류 스택:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({
      success: false,
      error: '카카오 로그인 처리 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
