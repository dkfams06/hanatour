-- admin_alerts 테이블에 inquiry 타입 추가
-- ====================================================================

-- 1. 기존 ENUM 타입 확인
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'admin_alerts' 
  AND COLUMN_NAME = 'alert_type';

-- 2. alert_type 컬럼에 'inquiry' 타입 추가
ALTER TABLE admin_alerts 
MODIFY COLUMN alert_type ENUM('review','application','booking','inquiry','system') NOT NULL;

-- 3. 수정된 ENUM 타입 확인
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'admin_alerts' 
  AND COLUMN_NAME = 'alert_type';

-- 4. 완료 메시지
SELECT 'admin_alerts 테이블에 inquiry 타입이 성공적으로 추가되었습니다.' AS message;
