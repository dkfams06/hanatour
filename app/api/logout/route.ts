import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

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

export async function POST(request: NextRequest) {
  try {
    // 토큰 검증
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '인증 토큰이 필요합니다.' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }

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

    // 로그아웃 로그 기록 (위치 정보 포함)
    await pool.query(
      'INSERT INTO access_logs (user_id, action, ip_address, user_agent, device, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [decoded.id, 'logout', ipAddress, userAgent, device, location, 'success']
    );

    // 활성 세션 비활성화
    await pool.query(
      'UPDATE active_sessions SET is_active = 0 WHERE user_id = ? AND is_active = 1',
      [decoded.id]
    );

    return NextResponse.json({ 
      success: true, 
      message: '로그아웃이 완료되었습니다.' 
    });

  } catch (error) {
    console.error('로그아웃 에러:', error);
    return NextResponse.json({ 
      success: false, 
      error: '로그아웃 처리 중 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}
