-- reviews 테이블에서 phone 컬럼 제거
-- 이 스크립트는 기존 reviews 테이블에 phone 컬럼이 있는 경우에만 실행하세요

-- 1. phone 컬럼이 존재하는지 확인
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'reviews' 
AND COLUMN_NAME = 'phone';

-- 2. phone 컬럼이 존재하면 제거
ALTER TABLE reviews DROP COLUMN phone;

-- 3. 변경사항 확인
DESCRIBE reviews;
