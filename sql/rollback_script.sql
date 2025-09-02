-- ====================================================================
-- 롤백 스크립트 (문제 발생시 복원용)
-- ====================================================================

-- 경고: 이 스크립트는 변경사항을 되돌립니다!
-- 실행 전 현재 데이터를 백업하세요!

-- 1. payments 테이블 삭제
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bank_accounts;
DROP TABLE IF EXISTS booking_status_history;

-- 2. bookings 테이블에 추가된 컬럼 제거
ALTER TABLE bookings DROP COLUMN IF EXISTS paymentDueDate;
-- ALTER TABLE bookings DROP COLUMN IF EXISTS bookingNumber; -- 주의: 예약번호는 유지하는 것을 권장
-- ALTER TABLE bookings DROP COLUMN IF EXISTS tourTitle; -- 주의: 제목은 유지하는 것을 권장
-- ALTER TABLE bookings DROP COLUMN IF EXISTS departureDate; -- 주의: 출발일은 유지하는 것을 권장

-- 3. status 컬럼을 원래대로 복원 (필요한 경우만)
-- ALTER TABLE bookings MODIFY COLUMN status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending';

-- 4. 백업 테이블에서 데이터 복원 (백업이 있는 경우)
-- TRUNCATE bookings;
-- INSERT INTO bookings SELECT * FROM bookings_backup;

-- 5. 인덱스 제거
DROP INDEX IF EXISTS idx_bookings_paymentDueDate ON bookings;
DROP INDEX IF EXISTS idx_bookings_bookingNumber ON bookings;

-- 6. 트리거 제거
DROP TRIGGER IF EXISTS booking_status_log;

SELECT 'Rollback completed!' as message;