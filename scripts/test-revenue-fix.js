const mysql = require('mysql2/promise');

// 환경 변수 설정
process.env.DB_HOST = '138.2.113.186';
process.env.DB_PORT = '3306';
process.env.DB_USER = 'admin';
process.env.DB_PASSWORD = 'dev123';
process.env.DB_NAME = 'hanatour_dev';

async function testRevenueFix() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('🔍 매출 쿼리 수정 테스트\n');

    // 1. 기존 쿼리 (문제가 있던 쿼리)
    console.log('❌ 기존 쿼리 (confirmed, completed만):');
    const [oldDailyRevenue] = await connection.execute(`
      SELECT COALESCE(SUM(totalAmount), 0) as revenue 
      FROM bookings 
      WHERE DATE(createdAt) = CURRENT_DATE()
      AND status IN ('confirmed', 'completed')
    `);
    console.log('일일 매출:', oldDailyRevenue[0].revenue);

    const [oldMonthlyRevenue] = await connection.execute(`
      SELECT COALESCE(SUM(totalAmount), 0) as revenue 
      FROM bookings 
      WHERE MONTH(createdAt) = MONTH(CURRENT_DATE()) 
      AND YEAR(createdAt) = YEAR(CURRENT_DATE())
      AND status IN ('confirmed', 'completed')
    `);
    console.log('월간 매출:', oldMonthlyRevenue[0].revenue);

    const [oldTotalRevenue] = await connection.execute(`
      SELECT COALESCE(SUM(totalAmount), 0) as revenue 
      FROM bookings 
      WHERE status IN ('confirmed', 'completed')
    `);
    console.log('총 매출:', oldTotalRevenue[0].revenue);

    // 2. 수정된 쿼리 (payment_completed 추가)
    console.log('\n✅ 수정된 쿼리 (payment_completed 포함):');
    const [newDailyRevenue] = await connection.execute(`
      SELECT COALESCE(SUM(totalAmount), 0) as revenue 
      FROM bookings 
      WHERE DATE(createdAt) = CURRENT_DATE()
      AND status IN ('confirmed', 'completed', 'payment_completed')
    `);
    console.log('일일 매출:', newDailyRevenue[0].revenue);

    const [newMonthlyRevenue] = await connection.execute(`
      SELECT COALESCE(SUM(totalAmount), 0) as revenue 
      FROM bookings 
      WHERE MONTH(createdAt) = MONTH(CURRENT_DATE()) 
      AND YEAR(createdAt) = YEAR(CURRENT_DATE())
      AND status IN ('confirmed', 'completed', 'payment_completed')
    `);
    console.log('월간 매출:', newMonthlyRevenue[0].revenue);

    const [newTotalRevenue] = await connection.execute(`
      SELECT COALESCE(SUM(totalAmount), 0) as revenue 
      FROM bookings 
      WHERE status IN ('confirmed', 'completed', 'payment_completed')
    `);
    console.log('총 매출:', newTotalRevenue[0].revenue);

    // 3. 실제 예약 데이터 확인
    console.log('\n📊 실제 예약 데이터:');
    const [bookings] = await connection.execute(`
      SELECT id, bookingNumber, customerName, totalAmount, status, createdAt
      FROM bookings
      ORDER BY createdAt DESC
    `);
    console.log(bookings);

    console.log('\n✅ 테스트 완료');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await connection.end();
  }
}

testRevenueFix();
