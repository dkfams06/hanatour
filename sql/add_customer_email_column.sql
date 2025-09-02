-- bookings 테이블에 customerEmail 컬럼 추가
-- 기존 email 컬럼을 customerEmail로 별칭 사용하거나 새 컬럼 추가

-- 1. 현재 테이블 구조 확인
DESCRIBE bookings;

-- 2. email 컬럼이 customerEmail 역할을 하는지 확인
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'bookings' 
    AND TABLE_SCHEMA = DATABASE()
    AND COLUMN_NAME IN ('email', 'customerEmail');

-- 3. email 컬럼을 customerEmail로 변경 (더 명확한 이름으로)
-- 만약 email 컬럼이 있다면 이름을 변경
ALTER TABLE bookings 
CHANGE COLUMN email customerEmail VARCHAR(100) NOT NULL;

-- 4. 변경 후 테이블 구조 확인
DESCRIBE bookings;