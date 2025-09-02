-- 관리자 알림 상태 추적 테이블 생성
CREATE TABLE IF NOT EXISTS admin_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alert_type ENUM('review', 'application', 'booking', 'system') NOT NULL,
  reference_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_by VARCHAR(255) NULL COMMENT '읽은 관리자 ID (UUID)',
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- 인덱스 추가
  INDEX idx_alert_type (alert_type),
  INDEX idx_reference_id (reference_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at),
  
  -- 중복 알림 방지 (같은 타입과 참조 ID의 조합은 유일해야 함)
  UNIQUE KEY unique_alert (alert_type, reference_id)
);

-- 기존 알림 데이터 마이그레이션 (선택사항)
-- INSERT INTO admin_alerts (alert_type, reference_id, title, message, created_at)
-- SELECT 
--   'review' as alert_type,
--   r.id as reference_id,
--   '새로운 리뷰가 작성되었습니다' as title,
--   CONCAT('새로운 리뷰가 작성되었습니다. 승인을 기다리고 있습니다.') as message,
--   r.createdAt as created_at
-- FROM reviews r
-- WHERE r.status = 'pending'
-- AND r.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
-- ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
