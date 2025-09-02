const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// 환경 변수 확인
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ 누락된 환경 변수:', missingVars.join(', '));
  console.error('환경 변수를 설정해주세요.');
  process.exit(1);
}

async function runSQLFile() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('데이터베이스에 연결되었습니다.');
    
    // SQL 파일 읽기
    const sqlFilePath = path.join(__dirname, '../sql/add_review_edit_history.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('SQL 파일 내용:');
    console.log(sqlContent);
    console.log('---');
    
    // SQL 문장들을 세미콜론으로 분리 (더 정확한 파싱)
    const statements = sqlContent
      .replace(/\r\n/g, '\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        const cleanStmt = stmt.replace(/\n/g, ' ').trim();
        const isValid = cleanStmt.length > 0 && 
               !cleanStmt.startsWith('--') && 
               !cleanStmt.startsWith('/*') &&
               cleanStmt.length > 5;
        if (isValid) {
          console.log('유효한 SQL 문장:', cleanStmt.substring(0, 50) + '...');
        }
        return isValid;
      });
    
    console.log(`총 ${statements.length}개의 SQL 문장을 실행합니다.`);
    
    // 각 SQL 문장 실행
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`실행 중... (${i + 1}/${statements.length})`);
          console.log(statement.substring(0, 100) + '...');
          
          await connection.execute(statement);
          console.log('✅ 성공');
        } catch (error) {
          console.log('❌ 실패:', error.message);
          // 에러가 발생해도 계속 진행
        }
      }
    }
    
    console.log('SQL 파일 실행이 완료되었습니다.');
    
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await connection.end();
    console.log('데이터베이스 연결이 종료되었습니다.');
  }
}

runSQLFile();
