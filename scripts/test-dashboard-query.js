const mysql = require('mysql2/promise');

// 환경 변수 설정
process.env.DB_HOST = '138.2.113.186';
process.env.DB_PORT = '3306';
process.env.DB_USER = 'admin';
process.env.DB_PASSWORD = 'dev123';
process.env.DB_NAME = 'hanatour_dev';

async function testDashboardQuery() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('🔍 대시보드 쿼리 테스트 시작');
    
    // 1. 수정된 신규 회원 쿼리 테스트
    console.log('\n📊 신규 회원 (이번 달) - role = customer:');
    const [newUsersResult] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE MONTH(createdAt) = MONTH(CURRENT_DATE()) 
      AND YEAR(createdAt) = YEAR(CURRENT_DATE())
      AND role = 'customer'
    `);
    console.log('결과:', newUsersResult[0].count);
    
    // 2. 수정된 총 회원 수 쿼리 테스트
    console.log('\n📊 총 회원 수 - role = customer:');
    const [totalUsersResult] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE role = 'customer'
    `);
    console.log('결과:', totalUsersResult[0].count);
    
    // 3. 기존 쿼리와 비교 (role = user)
    console.log('\n📊 비교 - role = user (기존 쿼리):');
    const [oldNewUsersResult] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE MONTH(createdAt) = MONTH(CURRENT_DATE()) 
      AND YEAR(createdAt) = YEAR(CURRENT_DATE())
      AND role = 'user'
    `);
    console.log('신규 회원 (role=user):', oldNewUsersResult[0].count);
    
    const [oldTotalUsersResult] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE role = 'user'
    `);
    console.log('총 회원 수 (role=user):', oldTotalUsersResult[0].count);
    
    // 4. 모든 역할별 사용자 수 확인
    console.log('\n📊 역할별 사용자 수:');
    const [roleStats] = await connection.execute(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);
    console.log(roleStats);
    
    // 5. 이번 달 가입한 사용자 상세 정보
    console.log('\n📊 이번 달 가입한 사용자 상세:');
    const [monthlyUsers] = await connection.execute(`
      SELECT id, email, name, role, createdAt 
      FROM users 
      WHERE MONTH(createdAt) = MONTH(CURRENT_DATE()) 
      AND YEAR(createdAt) = YEAR(CURRENT_DATE())
      ORDER BY createdAt DESC
    `);
    console.log(monthlyUsers);
    
    console.log('\n✅ 테스트 완료');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await connection.end();
  }
}

testDashboardQuery();
