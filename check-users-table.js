const mysql = require('mysql2/promise');

async function checkUsersTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hanatour',
  });

  try {
    console.log('🔍 users 테이블 구조 확인 중...');
    
    // 테이블 구조 확인
    const [columns] = await connection.execute('DESCRIBE users');
    console.log('\n📋 users 테이블 컬럼 정보:');
    console.table(columns);
    
    // 샘플 데이터 확인 (최대 5개)
    const [rows] = await connection.execute('SELECT * FROM users LIMIT 5');
    console.log('\n👥 users 테이블 샘플 데이터 (최대 5개):');
    console.table(rows);
    
    // 테이블 통계
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM users');
    console.log(`\n📊 총 사용자 수: ${countResult[0].total}명`);
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  } finally {
    await connection.end();
  }
}

checkUsersTable();
