const mysql = require('mysql2/promise');

async function runSQLStatements() {
  const connection = await mysql.createConnection({
    host: '138.2.113.186',
    port: 3306,
    user: 'admin',
    password: 'dev123',
    database: 'hanatour_dev',
  });

  try {
    console.log('데이터베이스에 연결되었습니다.');
    
    // 1. reviews 테이블에 컬럼 추가
    console.log('1. reviews 테이블에 컬럼 추가 중...');
    try {
      await connection.execute(`
        ALTER TABLE reviews 
        ADD COLUMN editedBy VARCHAR(255) NULL COMMENT '수정한 관리자 ID',
        ADD COLUMN editReason TEXT NULL COMMENT '수정 사유',
        ADD COLUMN originalContent TEXT NULL COMMENT '원본 내용 (수정 시 백업)',
        ADD COLUMN originalRating INT NULL COMMENT '원본 별점 (수정 시 백업)',
        ADD COLUMN editCount INT DEFAULT 0 COMMENT '수정 횟수'
      `);
      console.log('✅ reviews 테이블 컬럼 추가 성공');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️ 일부 컬럼이 이미 존재합니다. 계속 진행합니다.');
      } else {
        console.log('❌ reviews 테이블 컬럼 추가 실패:', error.message);
      }
    }

    // 2. review_edit_history 테이블 생성
    console.log('2. review_edit_history 테이블 생성 중...');
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS review_edit_history (
          id INT AUTO_INCREMENT PRIMARY KEY,
          reviewId INT NOT NULL,
          editedBy VARCHAR(255) NOT NULL COMMENT '수정한 관리자 ID',
          editReason TEXT NULL COMMENT '수정 사유',
          oldContent TEXT NULL COMMENT '수정 전 내용',
          newContent TEXT NOT NULL COMMENT '수정 후 내용',
          oldRating INT NULL COMMENT '수정 전 별점',
          newRating INT NOT NULL COMMENT '수정 후 별점',
          editedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_review_id (reviewId),
          INDEX idx_edited_at (editedAt),
          FOREIGN KEY (reviewId) REFERENCES reviews(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='후기 수정 이력'
      `);
      console.log('✅ review_edit_history 테이블 생성 성공');
    } catch (error) {
      console.log('❌ review_edit_history 테이블 생성 실패:', error.message);
    }

    // 3. 기존 후기들의 수정 횟수 초기화
    console.log('3. 기존 후기들의 수정 횟수 초기화 중...');
    try {
      await connection.execute(`
        UPDATE reviews SET editCount = 0 WHERE editCount IS NULL
      `);
      console.log('✅ 수정 횟수 초기화 성공');
    } catch (error) {
      console.log('❌ 수정 횟수 초기화 실패:', error.message);
    }

    console.log('모든 SQL 문장 실행이 완료되었습니다.');
    
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await connection.end();
    console.log('데이터베이스 연결이 종료되었습니다.');
  }
}

runSQLStatements();
