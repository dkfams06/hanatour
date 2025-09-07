const mysql = require('mysql2/promise');

// 환경 변수 설정
process.env.DB_HOST = '138.2.113.186';
process.env.DB_PORT = '3306';
process.env.DB_USER = 'admin';
process.env.DB_PASSWORD = 'dev123';
process.env.DB_NAME = 'hanatour_dev';

async function checkAllDashboardKPIs() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('🔍 대시보드 모든 KPI 점검 시작\n');

    // 1. 매출 관련 KPI 점검
    console.log('💰 매출 관련 KPI');
    console.log('─'.repeat(50));
    
    // 일일 매출
    const [dailyRevenue] = await connection.execute(`
      SELECT COALESCE(SUM(totalAmount), 0) as revenue 
      FROM bookings 
      WHERE DATE(createdAt) = CURRENT_DATE()
      AND status IN ('confirmed', 'completed')
    `);
    console.log('📊 일일 매출 (confirmed, completed):', dailyRevenue[0].revenue);
    
    // 모든 상태의 일일 예약 확인
    const [dailyAllStatus] = await connection.execute(`
      SELECT status, COUNT(*) as count, SUM(totalAmount) as revenue
      FROM bookings 
      WHERE DATE(createdAt) = CURRENT_DATE()
      GROUP BY status
    `);
    console.log('📊 오늘 예약 상태별:', dailyAllStatus);
    
    // 월간 매출
    const [monthlyRevenue] = await connection.execute(`
      SELECT COALESCE(SUM(totalAmount), 0) as revenue 
      FROM bookings 
      WHERE MONTH(createdAt) = MONTH(CURRENT_DATE()) 
      AND YEAR(createdAt) = YEAR(CURRENT_DATE())
      AND status IN ('confirmed', 'completed')
    `);
    console.log('📊 월간 매출 (confirmed, completed):', monthlyRevenue[0].revenue);
    
    // 총 매출
    const [totalRevenue] = await connection.execute(`
      SELECT COALESCE(SUM(totalAmount), 0) as revenue 
      FROM bookings 
      WHERE status IN ('confirmed', 'completed')
    `);
    console.log('📊 총 매출 (confirmed, completed):', totalRevenue[0].revenue);
    
    // 2. 사용자 관련 KPI 점검
    console.log('\n👥 사용자 관련 KPI');
    console.log('─'.repeat(50));
    
    // 신규 회원 (이미 수정됨)
    const [newUsers] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE MONTH(createdAt) = MONTH(CURRENT_DATE()) 
      AND YEAR(createdAt) = YEAR(CURRENT_DATE())
      AND role = 'customer'
    `);
    console.log('📊 신규 회원 (이번 달):', newUsers[0].count);
    
    // 총 회원 수 (이미 수정됨)
    const [totalUsers] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE role = 'customer'
    `);
    console.log('📊 총 회원 수:', totalUsers[0].count);
    
    // 3. 리뷰 관련 KPI 점검
    console.log('\n⭐ 리뷰 관련 KPI');
    console.log('─'.repeat(50));
    
    // 승인 대기 리뷰
    const [pendingReviews] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM reviews 
      WHERE status = 'pending'
    `);
    console.log('📊 승인 대기 리뷰 (pending):', pendingReviews[0].count);
    
    // 모든 리뷰 상태 확인
    const [allReviewStatus] = await connection.execute(`
      SELECT status, COUNT(*) as count
      FROM reviews 
      GROUP BY status
    `);
    console.log('📊 리뷰 상태별:', allReviewStatus);
    
    // 평균 평점
    const [averageRating] = await connection.execute(`
      SELECT AVG(rating) as avgRating 
      FROM reviews 
      WHERE status = 'approved'
    `);
    console.log('📊 평균 평점 (approved):', averageRating[0].avgRating);
    
    // 4. 입출금 신청 관련 KPI 점검
    console.log('\n💳 입출금 신청 관련 KPI');
    console.log('─'.repeat(50));
    
    // 입금 신청 대기
    const [pendingDeposits] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM deposit_applications 
      WHERE status = 'pending'
    `);
    console.log('📊 입금 신청 대기 (pending):', pendingDeposits[0].count);
    
    // 출금 신청 대기
    const [pendingWithdrawals] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM withdrawal_applications 
      WHERE status = 'pending'
    `);
    console.log('📊 출금 신청 대기 (pending):', pendingWithdrawals[0].count);
    
    // 입금 신청 상태별
    const [depositStatus] = await connection.execute(`
      SELECT status, COUNT(*) as count
      FROM deposit_applications 
      GROUP BY status
    `);
    console.log('📊 입금 신청 상태별:', depositStatus);
    
    // 출금 신청 상태별
    const [withdrawalStatus] = await connection.execute(`
      SELECT status, COUNT(*) as count
      FROM withdrawal_applications 
      GROUP BY status
    `);
    console.log('📊 출금 신청 상태별:', withdrawalStatus);
    
    // 5. 예약 관련 KPI 점검
    console.log('\n📅 예약 관련 KPI');
    console.log('─'.repeat(50));
    
    // 총 예약 건수
    const [totalBookings] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM bookings
    `);
    console.log('📊 총 예약 건수:', totalBookings[0].count);
    
    // 예약 상태별
    const [bookingStatus] = await connection.execute(`
      SELECT status, COUNT(*) as count, SUM(totalAmount) as revenue
      FROM bookings 
      GROUP BY status
    `);
    console.log('📊 예약 상태별:', bookingStatus);
    
    // 6. 테이블별 전체 데이터 수 확인
    console.log('\n📋 테이블별 전체 데이터 수');
    console.log('─'.repeat(50));
    
    const tables = ['bookings', 'users', 'reviews', 'deposit_applications', 'withdrawal_applications', 'tours'];
    
    for (const table of tables) {
      try {
        const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`📊 ${table}: ${count[0].count}건`);
      } catch (error) {
        console.log(`❌ ${table}: 테이블 없음 (${error.message})`);
      }
    }
    
    console.log('\n✅ 모든 KPI 점검 완료');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await connection.end();
  }
}

checkAllDashboardKPIs();
