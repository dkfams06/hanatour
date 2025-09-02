-- ====================================================================
-- 데이터베이스 설정 검증 쿼리
-- ====================================================================

-- 1. 테이블 구조 확인
DESCRIBE bookings;
DESCRIBE payments;

-- 2. 예약 상태별 통계
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM bookings), 2) as percentage
FROM bookings 
GROUP BY status 
ORDER BY count DESC;

-- 3. 입금 기한이 지난 예약 확인
SELECT 
  bookingNumber,
  customerName,
  tourTitle,
  status,
  paymentDueDate,
  TIMESTAMPDIFF(HOUR, paymentDueDate, NOW()) as hours_overdue
FROM bookings 
WHERE status = 'payment_pending' 
  AND paymentDueDate < NOW()
ORDER BY paymentDueDate;

-- 4. 오늘 생성된 예약 확인
SELECT 
  bookingNumber,
  customerName,
  tourTitle,
  totalAmount,
  status,
  paymentDueDate
FROM bookings 
WHERE DATE(createdAt) = CURDATE()
ORDER BY createdAt DESC;

-- 5. 결제 완료된 예약과 결제 정보 조인
SELECT 
  b.bookingNumber,
  b.customerName,
  b.tourTitle,
  b.totalAmount,
  p.paymentMethod,
  p.paidAt,
  p.bankName,
  p.accountHolder
FROM bookings b
JOIN payments p ON b.id = p.bookingId
WHERE b.status = 'payment_completed'
ORDER BY p.paidAt DESC
LIMIT 10;

-- 6. 컬럼별 NULL 값 체크
SELECT 
  COUNT(*) as total_bookings,
  SUM(CASE WHEN bookingNumber IS NULL THEN 1 ELSE 0 END) as missing_booking_number,
  SUM(CASE WHEN tourTitle IS NULL THEN 1 ELSE 0 END) as missing_tour_title,
  SUM(CASE WHEN departureDate IS NULL THEN 1 ELSE 0 END) as missing_departure_date,
  SUM(CASE WHEN paymentDueDate IS NULL THEN 1 ELSE 0 END) as missing_payment_due_date
FROM bookings;

-- 7. 인덱스 확인
SHOW INDEX FROM bookings;
SHOW INDEX FROM payments;

-- 8. 외래키 제약조건 확인
SELECT 
  CONSTRAINT_NAME,
  TABLE_NAME,
  COLUMN_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- 9. 테이블 크기 확인
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) as size_mb,
  table_rows
FROM information_schema.tables
WHERE table_schema = DATABASE()
  AND table_name IN ('bookings', 'payments', 'tours');

-- 10. 최근 1주일 예약 트렌드
SELECT 
  DATE(createdAt) as booking_date,
  COUNT(*) as bookings_count,
  SUM(totalAmount) as total_revenue,
  COUNT(CASE WHEN status = 'payment_completed' THEN 1 END) as completed_payments
FROM bookings 
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(createdAt)
ORDER BY booking_date DESC;