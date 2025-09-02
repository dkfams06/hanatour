import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

// 접속 통계 조회
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // 기본 30일

    // 기본 통계
    const basicStatsQuery = `
      SELECT 
        COUNT(CASE WHEN action = 'login' THEN 1 END) as total_logins,
        COUNT(CASE WHEN action = 'logout' THEN 1 END) as total_logouts,
        COUNT(CASE WHEN action = 'failed_login' THEN 1 END) as failed_logins,
        COUNT(DISTINCT user_id) as unique_users
      FROM access_logs 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${period} DAY)
    `;

    const [basicStatsResult] = await pool.query(basicStatsQuery) as any;
    const basicStats = basicStatsResult[0];

    // 활성 세션 수
    const activeSessionsQuery = `
      SELECT COUNT(*) as active_sessions
      FROM active_sessions 
      WHERE is_active = 1
    `;

    const [activeSessionsResult] = await pool.query(activeSessionsQuery) as any;
    const activeSessions = activeSessionsResult[0];

    // 지역별 접속 통계
    const locationStatsQuery = `
      SELECT 
        location,
        COUNT(*) as count
      FROM access_logs 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${period} DAY)
        AND location IS NOT NULL 
        AND location != ''
      GROUP BY location 
      ORDER BY count DESC 
      LIMIT 10
    `;

    const [locationStats] = await pool.query(locationStatsQuery) as any;

    // 디바이스별 접속 통계
    const deviceStatsQuery = `
      SELECT 
        device,
        COUNT(*) as count
      FROM access_logs 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${period} DAY)
        AND device IS NOT NULL 
        AND device != ''
      GROUP BY device 
      ORDER BY count DESC
    `;

    const [deviceStats] = await pool.query(deviceStatsQuery) as any;

    // 시간대별 접속 통계 (최근 7일)
    const hourlyStatsQuery = `
      SELECT 
        HOUR(created_at) as hour,
        COUNT(*) as count
      FROM access_logs 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY HOUR(created_at)
      ORDER BY hour
    `;

    const [hourlyStats] = await pool.query(hourlyStatsQuery) as any;

    // 일별 접속 통계
    const dailyStatsQuery = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM access_logs 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${period} DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `;

    const [dailyStats] = await pool.query(dailyStatsQuery) as any;

    // 평균 세션 시간 (활성 세션 기준)
    const avgSessionTimeQuery = `
      SELECT 
        AVG(
          TIMESTAMPDIFF(MINUTE, login_time, NOW())
        ) as avg_session_minutes
      FROM active_sessions 
      WHERE is_active = 1
    `;

    const [avgSessionTimeResult] = await pool.query(avgSessionTimeQuery) as any;
    const avgSessionTime = avgSessionTimeResult[0];

    const stats = {
      totalLogins: basicStats?.total_logins || 0,
      totalLogouts: basicStats?.total_logouts || 0,
      failedLogins: basicStats?.failed_logins || 0,
      activeSessions: activeSessions?.active_sessions || 0,
      uniqueUsers: basicStats?.unique_users || 0,
      avgSessionMinutes: Math.round(avgSessionTime?.avg_session_minutes || 0),
      topLocations: locationStats,
      deviceStats: deviceStats,
      hourlyStats: hourlyStats,
      dailyStats: dailyStats
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('접속 통계 조회 오류:', error);
    return NextResponse.json({ error: '접속 통계 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
