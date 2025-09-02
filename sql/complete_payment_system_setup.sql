-- ====================================================================
-- 하나투어 결제 시스템 데이터베이스 완전 설정 스크립트
-- ====================================================================

-- 1. 기존 bookings 테이블 백업 (안전을 위해)
CREATE TABLE IF NOT EXISTS bookings_backup AS SELECT * FROM bookings;

-- 2. bookings 테이블 구조 업데이트
-- 2-1. paymentDueDate 컬럼 추가
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS paymentDueDate DATETIME NULL COMMENT '입금기한' 
AFTER totalAmount;

-- 2-2. bookingNumber 컬럼 추가 (없는 경우)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS bookingNumber VARCHAR(50) UNIQUE NULL COMMENT '예약번호' 
AFTER id;

-- 2-3. tourTitle 컬럼 추가 (없는 경우)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS tourTitle VARCHAR(500) NULL COMMENT '여행상품 제목' 
AFTER tourId;

-- 2-4. departureDate 컬럼 추가 (없는 경우)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS departureDate DATE NULL COMMENT '출발일' 
AFTER specialRequests;

-- 3. bookings 테이블 status 컬럼 업데이트 (새로운 결제 상태 지원)
ALTER TABLE bookings 
MODIFY COLUMN status ENUM(
  'pending', 
  'payment_pending', 
  'payment_completed', 
  'payment_expired', 
  'confirmed', 
  'cancel_requested', 
  'cancelled', 
  'refund_completed'
) DEFAULT 'payment_pending' COMMENT '예약 상태';

-- 4. 결제 관리를 위한 payments 테이블 생성
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(255) PRIMARY KEY COMMENT '결제 ID',
  bookingId VARCHAR(255) NOT NULL COMMENT '예약 ID',
  amount INT NOT NULL COMMENT '결제 금액',
  paymentMethod ENUM('bank_transfer', 'card', 'cash') DEFAULT 'bank_transfer' COMMENT '결제 방식',
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending' COMMENT '결제 상태',
  paidAt DATETIME NULL COMMENT '결제 완료일',
  bankName VARCHAR(100) NULL COMMENT '입금 은행명',
  accountHolder VARCHAR(100) NULL COMMENT '입금자명',
  adminMemo TEXT NULL COMMENT '관리자 메모',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  
  FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_payments_bookingId (bookingId),
  INDEX idx_payments_status (status),
  INDEX idx_payments_paidAt (paidAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='결제 관리 테이블';

-- 5. 필요한 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_bookings_paymentDueDate ON bookings(paymentDueDate);
CREATE INDEX IF NOT EXISTS idx_bookings_bookingNumber ON bookings(bookingNumber);
CREATE INDEX IF NOT EXISTS idx_bookings_departureDate ON bookings(departureDate);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- 6. 기존 데이터 마이그레이션 (기존 예약이 있는 경우)
-- 6-1. 예약번호가 없는 기존 예약에 예약번호 생성
UPDATE bookings 
SET bookingNumber = CONCAT('HT', DATE_FORMAT(createdAt, '%Y%m%d'), LPAD(FLOOR(RAND() * 9000) + 1000, 4, '0'))
WHERE bookingNumber IS NULL OR bookingNumber = '';

-- 6-2. tourTitle이 없는 경우 tours 테이블에서 가져오기
UPDATE bookings b
JOIN tours t ON b.tourId = t.id
SET b.tourTitle = t.title
WHERE b.tourTitle IS NULL OR b.tourTitle = '';

-- 6-3. departureDate가 없는 경우 tours 테이블에서 가져오기
UPDATE bookings b
JOIN tours t ON b.tourId = t.id
SET b.departureDate = t.departureDate
WHERE b.departureDate IS NULL;

-- 6-4. 기존 'pending' 상태를 'payment_pending'으로 변경
UPDATE bookings 
SET status = 'payment_pending' 
WHERE status = 'pending';

-- 6-5. 기존 'confirmed' 상태를 'payment_completed'로 변경
UPDATE bookings 
SET status = 'payment_completed' 
WHERE status = 'confirmed';

-- 7. 입금 기한이 없는 기존 예약에 입금 기한 설정
UPDATE bookings 
SET paymentDueDate = DATE_ADD(createdAt, INTERVAL 24 HOUR)
WHERE paymentDueDate IS NULL 
  AND status = 'payment_pending'
  AND departureDate > CURDATE();

-- 8. 은행 계좌 정보 테이블 생성 (입금 안내용)
CREATE TABLE IF NOT EXISTS bank_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bankName VARCHAR(100) NOT NULL COMMENT '은행명',
  accountNumber VARCHAR(50) NOT NULL COMMENT '계좌번호',
  accountHolder VARCHAR(100) NOT NULL COMMENT '예금주',
  isActive BOOLEAN DEFAULT TRUE COMMENT '사용여부',
  displayOrder INT DEFAULT 0 COMMENT '표시순서',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_bank_accounts_active (isActive),
  INDEX idx_bank_accounts_order (displayOrder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='은행 계좌 정보';

-- 9. 기본 은행 계좌 정보 입력 (예시)
INSERT INTO bank_accounts (bankName, accountNumber, accountHolder, displayOrder) VALUES
('국민은행', '123456-12-123456', '(주)하나투어', 1),
('신한은행', '654321-21-654321', '(주)하나투어', 2),
('우리은행', '111222-33-444555', '(주)하나투어', 3)
ON DUPLICATE KEY UPDATE accountNumber = VALUES(accountNumber);

-- 10. 데이터 검증 쿼리들
-- 10-1. 업데이트된 bookings 테이블 구조 확인
DESCRIBE bookings;

-- 10-2. payments 테이블 구조 확인
DESCRIBE payments;

-- 10-3. 예약 상태별 개수 확인
SELECT status, COUNT(*) as count FROM bookings GROUP BY status;

-- 10-4. 입금 기한이 지난 예약 확인
SELECT bookingNumber, customerName, status, paymentDueDate 
FROM bookings 
WHERE status = 'payment_pending' 
  AND paymentDueDate < NOW()
LIMIT 10;

-- 11. 권한 설정 (필요한 경우)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON payments TO 'your_app_user'@'%';
-- GRANT SELECT ON bank_accounts TO 'your_app_user'@'%';

-- 12. 트리거 생성 (선택사항) - 예약 상태 변경 시 로그 기록
DELIMITER //

CREATE TRIGGER IF NOT EXISTS booking_status_log 
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO booking_status_history (bookingId, oldStatus, newStatus, changedAt)
    VALUES (NEW.id, OLD.status, NEW.status, NOW());
  END IF;
END//

DELIMITER ;

-- 13. 상태 변경 히스토리 테이블 (선택사항)
CREATE TABLE IF NOT EXISTS booking_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bookingId VARCHAR(255) NOT NULL,
  oldStatus VARCHAR(50),
  newStatus VARCHAR(50),
  changedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_status_history_booking (bookingId),
  INDEX idx_status_history_date (changedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='예약 상태 변경 히스토리';

-- ====================================================================
-- 스크립트 실행 완료
-- ====================================================================

SELECT 'Database setup completed successfully!' as message;
SELECT 'Total bookings:' as info, COUNT(*) as count FROM bookings;
SELECT 'Payment pending:' as info, COUNT(*) as count FROM bookings WHERE status = 'payment_pending';
SELECT 'Payment completed:' as info, COUNT(*) as count FROM bookings WHERE status = 'payment_completed';