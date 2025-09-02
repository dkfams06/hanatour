-- 모든 테이블의 departureDate 컬럼을 DATETIME 타입으로 변경
-- 이는 JavaScript의 ISO 8601 날짜 형식을 올바르게 처리하기 위함

-- 1. cart 테이블의 departureDate 컬럼 변경 (이미 DATETIME인 경우 무시됨)
ALTER TABLE cart 
MODIFY COLUMN departureDate DATETIME NOT NULL COMMENT '출발일시';

-- 2. tours 테이블의 departureDate 컬럼 변경
ALTER TABLE tours 
MODIFY COLUMN departureDate DATETIME NOT NULL COMMENT '출발일시';

-- 3. bookings 테이블의 departureDate 컬럼 변경
ALTER TABLE bookings 
MODIFY COLUMN departureDate DATETIME NULL COMMENT '출발일시';

-- 변경사항 확인
SELECT 'cart' as table_name, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hanatour_dev' AND TABLE_NAME = 'cart' AND COLUMN_NAME = 'departureDate'

UNION ALL

SELECT 'tours' as table_name, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hanatour_dev' AND TABLE_NAME = 'tours' AND COLUMN_NAME = 'departureDate'

UNION ALL

SELECT 'bookings' as table_name, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hanatour_dev' AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'departureDate'; 