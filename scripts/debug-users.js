const mysql = require('mysql2/promise');

// 환경 변수 확인
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ 누락된 환경 변수:', missingVars.join(', '));
  console.error('환경 변수를 설정해주세요.');
  process.exit(1);
}

async function debugUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('🔍 데이터베이스 연결 성공');
    
    // 1. 테이블 목록 확인
    console.log('\n📋 테이블 목록:');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(tables.map(t => Object.values(t)[0]));
    
    // 2. users 테이블 구조 확인
    console.log('\n🏗️ users 테이블 구조:');
    try {
      const [columns] = await connection.execute('DESCRIBE users');
      console.log(columns);
    } catch (error) {
      console.log('❌ users 테이블이 존재하지 않습니다:', error.message);
    }
    
    // 3. user 테이블 구조 확인 (노세노세 스타일)
    console.log('\n🏗️ user 테이블 구조:');
    try {
      const [columns] = await connection.execute('DESCRIBE user');
      console.log(columns);
    } catch (error) {
      console.log('❌ user 테이블이 존재하지 않습니다:', error.message);
    }
    
    // 4. users 테이블 데이터 확인
    console.log('\n👥 users 테이블 데이터:');
    try {
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
      console.log('총 사용자 수:', users[0].count);
      
      const [userData] = await connection.execute('SELECT id, email, name, role, createdAt FROM users LIMIT 5');
      console.log('사용자 샘플:', userData);
    } catch (error) {
      console.log('❌ users 테이블 조회 실패:', error.message);
    }
    
    // 5. user 테이블 데이터 확인
    console.log('\n👥 user 테이블 데이터:');
    try {
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM user');
      console.log('총 사용자 수:', users[0].count);
      
      const [userData] = await connection.execute('SELECT id, email, company_name, role, createdAt FROM user LIMIT 5');
      console.log('사용자 샘플:', userData);
    } catch (error) {
      console.log('❌ user 테이블 조회 실패:', error.message);
    }
    
    // 6. 현재 월 신규 사용자 확인
    console.log('\n📅 이번 달 신규 사용자:');
    try {
      const [newUsers] = await connection.execute(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE MONTH(createdAt) = MONTH(CURRENT_DATE()) 
        AND YEAR(createdAt) = YEAR(CURRENT_DATE())
        AND role = 'user'
      `);
      console.log('users 테이블 이번 달 신규:', newUsers[0].count);
    } catch (error) {
      console.log('❌ users 테이블 신규 사용자 조회 실패:', error.message);
    }
    
    try {
      const [newUsers] = await connection.execute(`
        SELECT COUNT(*) as count 
        FROM user 
        WHERE MONTH(createdAt) = MONTH(CURRENT_DATE()) 
        AND YEAR(createdAt) = YEAR(CURRENT_DATE())
        AND role = 'USER'
      `);
      console.log('user 테이블 이번 달 신규:', newUsers[0].count);
    } catch (error) {
      console.log('❌ user 테이블 신규 사용자 조회 실패:', error.message);
    }
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await connection.end();
    console.log('\n✅ 데이터베이스 연결 종료');
  }
}

debugUsers();
