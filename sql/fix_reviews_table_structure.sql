-- reviews 테이블 구조 수정
-- tourId와 bookingId를 NULL 허용으로 변경하고 외래키 제약조건을 완화

-- 1. 외래키 제약조건 제거
ALTER TABLE reviews DROP FOREIGN KEY reviews_ibfk_1;
ALTER TABLE reviews DROP FOREIGN KEY reviews_ibfk_2;
ALTER TABLE reviews DROP FOREIGN KEY reviews_ibfk_3;

-- 2. 컬럼을 NULL 허용으로 변경
ALTER TABLE reviews MODIFY COLUMN tourId varchar(36) NULL;
ALTER TABLE reviews MODIFY COLUMN bookingId varchar(36) NULL;

-- 3. 인덱스는 유지 (성능을 위해)
-- KEY `tourId` (`tourId`),
-- KEY `bookingId` (`bookingId`),
-- KEY `userId` (`userId`),

-- 4. 변경사항 확인
DESCRIBE reviews;

-- 5. 새로운 테이블 구조 확인
SHOW CREATE TABLE reviews;
