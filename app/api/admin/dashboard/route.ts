import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // 병렬로 필요한 KPI 데이터만 가져오기
    const [
      newUsersResult,
      totalUsersResult,
      userMileageResult,
      pendingReviewsResult,
      averageRatingResult,
      pendingApplicationsResult,
      currentUsersResult,
      recentBookingsResult,
      alertsResult
    ] = await Promise.all([
      // 신규 회원 (현재 월)
      pool.query(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE MONTH(createdAt) = MONTH(CURRENT_DATE()) 
        AND YEAR(createdAt) = YEAR(CURRENT_DATE())
        AND role = 'customer'
      `),
      
      // 총 회원 수
      pool.query(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE role = 'customer'
      `),
      
      // 마일리지 총액 (전체 회원의 마일리지 합계)
      pool.query(`
        SELECT COALESCE(SUM(mileage), 0) as totalMileage 
        FROM users 
        WHERE role = 'customer'
      `),
      
      // 승인 대기 리뷰
      pool.query(`
        SELECT COUNT(*) as count 
        FROM reviews 
        WHERE status = 'pending'
      `),
      
      // 평균 평점
      pool.query('SELECT AVG(rating) as avgRating FROM reviews WHERE status = "approved"'),
      
      // 입출금 신청 대기
      pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM deposit_applications WHERE status = 'pending') +
          (SELECT COUNT(*) FROM withdrawal_applications WHERE status = 'pending') as count
      `),
      
      // 현재 접속자 수 (active_sessions 테이블 사용)
      pool.query(`
        SELECT COUNT(*) as count 
        FROM active_sessions 
        WHERE is_active = 1 
        AND last_activity >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
      `).catch(() => {
        console.log('active_sessions 테이블이 없습니다. 현재 접속자 수를 0으로 설정합니다.');
        return Promise.resolve([{ count: 0 }]);
      }),
      
      // 최근 예약 5건
      pool.query(`
        SELECT 
          b.id,
          b.bookingNumber,
          b.customerName,
          b.totalAmount,
          b.status,
          b.createdAt,
          t.title as tourTitle
        FROM bookings b
        LEFT JOIN tours t ON b.tourId = t.id
        ORDER BY b.createdAt DESC
        LIMIT 5
      `),
      
      // 최근 알림 (admin_alerts 테이블에서 직접 조회)
      pool.query(`
        SELECT 
          alert_type as type,
          title,
          message,
          created_at as timestamp,
          COALESCE(is_read, FALSE) as isRead,
          reference_id
        FROM admin_alerts
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ORDER BY created_at DESC
        LIMIT 10
      `)
    ]);

    // 결과 추출
    const newUsers = (newUsersResult[0] as any[])[0]?.count || 0;
    const totalUsers = (totalUsersResult[0] as any[])[0]?.count || 0;
    const totalMileage = (userMileageResult[0] as any[])[0]?.totalMileage || 0;
    const pendingReviews = (pendingReviewsResult[0] as any[])[0]?.count || 0;
    const averageRating = (averageRatingResult[0] as any[])[0]?.avgRating || 0;
    const pendingApplications = (pendingApplicationsResult[0] as any[])[0]?.count || 0;
    const currentUsers = (currentUsersResult[0] as any[])[0]?.count || 0;
    const recentBookings = (recentBookingsResult[0] as any[]) || [];
    const alerts = (alertsResult[0] as any[]) || [];

    // 응답 데이터 구성
    const dashboardData = {
      kpi: {
        newUsers,
        totalUsers,
        totalMileage: Number(totalMileage),
        pendingReviews,
        averageRating: Number(averageRating).toFixed(1),
        pendingApplications,
        currentUsers
      },
      recentBookings: recentBookings.map((booking: any) => ({
        id: booking.bookingNumber,
        customer: booking.customerName,
        tour: booking.tourTitle || '투어 정보 없음',
        amount: Number(booking.totalAmount),
        status: booking.status,
        date: booking.createdAt
      })),
      alerts: alerts.map((alert: any, index: number) => ({
        id: `${alert.type}_${alert.reference_id || index}`,
        type: alert.type,
        title: alert.title,
        message: alert.message,
        timestamp: alert.timestamp,
        isRead: alert.isRead
      }))
    };

    return NextResponse.json({ 
      success: true, 
      data: dashboardData 
    });

  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '대시보드 데이터를 불러오는 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
} 