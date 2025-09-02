-- cart 테이블의 departureDate 컬럼을 DATE에서 DATETIME으로 변경
-- 이는 JavaScript의 ISO 8601 날짜 형식을 올바르게 처리하기 위함

ALTER TABLE cart 
MODIFY COLUMN departureDate DATETIME NOT NULL COMMENT '출발일시';

-- 변경사항 확인
DESCRIBE cart; 