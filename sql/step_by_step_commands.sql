-- ====================================================================
-- 단계별 실행 명령어 (문제 발생시 개별 실행)
-- ====================================================================

-- STEP 1: 테이블 백업
CREATE TABLE bookings_backup AS SELECT * FROM bookings;

-- STEP 2: 컬럼 추가
ALTER TABLE bookings ADD COLUMN paymentDueDate DATETIME NULL AFTER totalAmount;
ALTER TABLE bookings ADD COLUMN bookingNumber VARCHAR(50) UNIQUE NULL AFTER id;
ALTER TABLE bookings ADD COLUMN tourTitle VARCHAR(500) NULL AFTER tourId;
ALTER TABLE bookings ADD COLUMN departureDate DATE NULL AFTER specialRequests;

-- STEP 3: 상태 컬럼 업데이트
ALTER TABLE bookings MODIFY COLUMN status ENUM(
  'pending', 'payment_pending', 'payment_completed', 'payment_expired',
  'confirmed', 'cancel_requested', 'cancelled', 'refund_completed'
) DEFAULT 'payment_pending';

-- STEP 4: payments 테이블 생성
CREATE TABLE payments (
  id VARCHAR(255) PRIMARY KEY,
  bookingId VARCHAR(255) NOT NULL,
  amount INT NOT NULL,
  paymentMethod ENUM('bank_transfer', 'card', 'cash') DEFAULT 'bank_transfer',
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  paidAt DATETIME NULL,
  bankName VARCHAR(100) NULL,
  accountHolder VARCHAR(100) NULL,
  adminMemo TEXT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE
);

-- STEP 5: 인덱스 추가
CREATE INDEX idx_bookings_paymentDueDate ON bookings(paymentDueDate);
CREATE INDEX idx_bookings_bookingNumber ON bookings(bookingNumber);
CREATE INDEX idx_payments_bookingId ON payments(bookingId);

-- STEP 6: 기존 데이터 마이그레이션
UPDATE bookings SET bookingNumber = CONCAT('HT', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(FLOOR(RAND() * 9000) + 1000, 4, '0')) WHERE bookingNumber IS NULL;
UPDATE bookings SET status = 'payment_pending' WHERE status = 'pending';
UPDATE bookings SET status = 'payment_completed' WHERE status = 'confirmed';