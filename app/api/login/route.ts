import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

// 디바이스 타입 감지 함수
function detectDevice(userAgent: string): string {
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
    if (/iPad/.test(userAgent)) {
      return 'tablet';
    }
    return 'mobile';
  }
  return 'desktop';
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // 클라이언트 정보 추출
    const userAgent = request.headers.get('user-agent') || '';
    
    // IP 주소 추출 (더 정확한 방법)
    let ipAddress = 'unknown';
    
    // 다양한 헤더에서 IP 주소 추출
    const headers = [
      'cf-connecting-ip',      // Cloudflare
      'x-real-ip',            // Nginx
      'x-forwarded-for',      // 일반적인 프록시
      'x-client-ip',          // 일부 프록시
      'x-forwarded',          // 일부 프록시
      'forwarded-for',        // 일부 프록시
      'forwarded'             // RFC 7239
    ];
    
    for (const header of headers) {
      const value = request.headers.get(header);
      if (value) {
        // 쉼표로 구분된 IP 목록에서 첫 번째 IP 사용
        const firstIp = value.split(',')[0].trim();
        if (firstIp && firstIp !== 'unknown' && firstIp !== '::1') {
          ipAddress = firstIp;
          break;
        }
      }
    }
    
    // localhost IP 처리
    if (ipAddress === '::1' || ipAddress === '127.0.0.1' || ipAddress === 'localhost') {
      ipAddress = '127.0.0.1 (로컬)';
    }
    
    const device = detectDevice(userAgent);
    
    // 위치 정보 추출 (IP 기반)
    let location = '';
    if (ipAddress && ipAddress !== 'unknown' && !ipAddress.includes('127.0.0.1')) {
      try {
        // IP 기반 위치 정보 조회 (무료 API 사용)
        const geoResponse = await fetch(`http://ip-api.com/json/${ipAddress}?fields=country,regionName,city`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.status === 'success') {
            location = `${geoData.country}, ${geoData.regionName}, ${geoData.city}`;
          } else {
            location = '위치 정보 조회 실패';
          }
        } else {
          location = '위치 정보 조회 실패';
        }
      } catch (error) {
        console.log('위치 정보 조회 실패:', error);
        location = '위치 정보 없음';
      }
    } else {
      location = '로컬 접속';
    }

    // 사용자 조회
    const [rows] = await pool.query<any[]>(
      'SELECT id, username, nickname, email, password, name, role, status, mileage FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '등록되지 않은 아이디입니다.' 
      }, { status: 401 });
    }

    const user = rows[0];

    // 승인된 사용자만 로그인 허용
    if (user.status === 'pending') {
      return NextResponse.json({ 
        success: false, 
        error: '승인대기중입니다. 관리자 승인 후 로그인하실 수 있습니다.' 
      }, { status: 403 });
    }
    
    if (user.status === 'suspended' || user.status === 'banned') {
      return NextResponse.json({ 
        success: false, 
        error: '계정이 정지되었습니다. 관리자에게 문의하세요.' 
      }, { status: 403 });
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // 로그인 실패 로그 기록 (위치 정보 포함)
      await pool.query(
        'INSERT INTO access_logs (user_id, action, ip_address, user_agent, device, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user.id, 'failed_login', ipAddress, userAgent, device, location, 'failed']
      );
      
      return NextResponse.json({ 
        success: false, 
        error: '비밀번호가 올바르지 않습니다.' 
      }, { status: 401 });
    }

    // 마지막 로그인 시간 업데이트
    await pool.query(
      'UPDATE users SET lastLogin = NOW() WHERE id = ?',
      [user.id]
    );

    // 로그인 성공 로그 기록 (위치 정보 포함)
    console.log('로그인 IP 정보:', {
      ipAddress,
      location,
      userAgent: userAgent.substring(0, 100) + '...'
    });
    
    await pool.query(
      'INSERT INTO access_logs (user_id, action, ip_address, user_agent, device, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user.id, 'login', ipAddress, userAgent, device, location, 'success']
    );

    // 활성 세션 생성 (위치 정보 포함)
    const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    await pool.query(
      'INSERT INTO active_sessions (user_id, session_token, ip_address, user_agent, device, location, login_time, last_activity) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [user.id, sessionToken, ipAddress, userAgent, device, location]
    );

    // JWT 토큰 생성
    const token = await generateToken({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      name: user.name,
      role: user.role,
      mileage: user.mileage,
    });

    // 비밀번호 제외하고 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword,
      token,
      message: '로그인 성공' 
    });
  } catch (error) {
    console.error('로그인 에러:', error);
    return NextResponse.json({ 
      success: false, 
      error: '로그인 처리 중 오류가 발생했습니다.' 
    }, { status: 500 });
  }
} 