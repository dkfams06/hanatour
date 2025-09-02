-- bookings 테이블에 입금기한 컬럼 추가
ALTER TABLE bookings 
ADD COLUMN paymentDueDate DATETIME NULL COMMENT '입금기한' 
AFTER totalAmount;

-- 기존 bookings의 status 타입 업데이트 (새로운 결제 관련 상태 추가)
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
) DEFAULT 'pending' COMMENT '예약 상태';

-- bookings 테이블에 예약번호 컬럼 추가 (없는 경우)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS bookingNumber VARCHAR(50) UNIQUE NULL COMMENT '예약번호' 
AFTER id;

-- bookings 테이블에 여행상품 제목 컬럼 추가 (없는 경우)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS tourTitle VARCHAR(500) NULL COMMENT '여행상품 제목' 
AFTER tourId;

-- bookings 테이블에 출발일 컬럼 추가 (없는 경우)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS departureDate DATE NULL COMMENT '출발일' 
AFTER specialRequests;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_bookings_paymentDueDate ON bookings(paymentDueDate);
CREATE INDEX IF NOT EXISTS idx_bookings_bookingNumber ON bookings(bookingNumber);
CREATE INDEX IF NOT EXISTS idx_bookings_departureDate ON bookings(departureDate);

-- 결제 관리를 위한 payments 테이블 생성 (선택사항)
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(255) PRIMARY KEY,
  bookingId VARCHAR(255) NOT NULL,
  amount INT NOT NULL COMMENT '결제 금액',
  paymentMethod ENUM('bank_transfer', 'card', 'cash') DEFAULT 'bank_transfer' COMMENT '결제 방식',
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending' COMMENT '결제 상태',
  paidAt DATETIME NULL COMMENT '결제 완료일',
  bankName VARCHAR(100) NULL COMMENT '입금 은행명',
  accountHolder VARCHAR(100) NULL COMMENT '입금자명',
  adminMemo TEXT NULL COMMENT '관리자 메모',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_payments_bookingId (bookingId),
  INDEX idx_payments_status (status),
  INDEX idx_payments_paidAt (paidAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='결제 관리 테이블';