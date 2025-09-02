-- 현재 접속자 수를 추적하기 위한 user_sessions 테이블 생성
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  session_id VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  INDEX idx_last_activity (last_activity),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 세션 정리를 위한 이벤트 생성 (30분 이상 비활성 세션 삭제)
DELIMITER //
CREATE EVENT IF NOT EXISTS cleanup_inactive_sessions
ON SCHEDULE EVERY 5 MINUTE
DO
BEGIN
  DELETE FROM user_sessions 
  WHERE last_activity < DATE_SUB(NOW(), INTERVAL 30 MINUTE);
END //
DELIMITER ;

-- 현재 접속자 수를 조회하는 뷰 생성
CREATE OR REPLACE VIEW current_active_users AS
SELECT COUNT(*) as active_users
FROM user_sessions 
WHERE last_activity >= DATE_SUB(NOW(), INTERVAL 30 MINUTE);
