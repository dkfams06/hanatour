-- 접속 관리 테이블 생성

-- 1. 접속 로그 테이블
CREATE TABLE IF NOT EXISTS access_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL, -- 'login', 'logout', 'failed_login', 'session_expired'
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    device TEXT, -- 'desktop', 'mobile', 'tablet', 'unknown'
    location TEXT, -- IP 기반 위치 정보
    status TEXT DEFAULT 'success', -- 'success', 'failed', 'blocked'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 2. 활성 세션 테이블
CREATE TABLE IF NOT EXISTS active_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    device TEXT, -- 'desktop', 'mobile', 'tablet', 'unknown'
    location TEXT, -- IP 기반 위치 정보
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. IP 차단 테이블
CREATE TABLE IF NOT EXISTS blocked_ips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT UNIQUE NOT NULL,
    reason TEXT,
    blocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME, -- NULL이면 영구 차단
    is_active BOOLEAN DEFAULT 1
);

-- 4. 접속 시도 제한 테이블 (브루트 포스 공격 방지)
CREATE TABLE IF NOT EXISTS login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    email TEXT,
    attempt_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT 0
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_action ON access_logs(action);
CREATE INDEX IF NOT EXISTS idx_access_logs_created_at ON access_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_access_logs_ip_address ON access_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_access_logs_device ON access_logs(device);

CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_token ON active_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_active_sessions_is_active ON active_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_active_sessions_last_activity ON active_sessions(last_activity);

CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip_address ON blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_is_active ON blocked_ips(is_active);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_address ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_time ON login_attempts(attempt_time);

-- 뷰 생성 (자주 사용되는 쿼리를 위한 뷰)
CREATE VIEW IF NOT EXISTS v_recent_access_logs AS
SELECT 
    al.id,
    al.user_id,
    u.username,
    u.email,
    al.action,
    al.ip_address,
    al.device,
    al.location,
    al.status,
    al.created_at
FROM access_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.created_at >= datetime('now', '-7 days')
ORDER BY al.created_at DESC;

CREATE VIEW IF NOT EXISTS v_active_sessions_summary AS
SELECT 
    s.id,
    s.user_id,
    u.username,
    u.email,
    s.ip_address,
    s.device,
    s.location,
    s.login_time,
    s.last_activity,
    s.is_active,
    ROUND((julianday('now') - julianday(s.login_time)) * 24 * 60, 2) as session_minutes
FROM active_sessions s
LEFT JOIN users u ON s.user_id = u.id
WHERE s.is_active = 1
ORDER BY s.last_activity DESC;

-- 트리거 생성 (자동 정리)
-- 30일 이상 된 접속 로그 자동 삭제 (선택사항)
CREATE TRIGGER IF NOT EXISTS cleanup_old_access_logs
    AFTER INSERT ON access_logs
    BEGIN
        DELETE FROM access_logs 
        WHERE created_at < datetime('now', '-30 days');
    END;

-- 만료된 세션 자동 비활성화
CREATE TRIGGER IF NOT EXISTS deactivate_expired_sessions
    AFTER INSERT ON active_sessions
    BEGIN
        UPDATE active_sessions 
        SET is_active = 0 
        WHERE expires_at IS NOT NULL 
          AND expires_at < datetime('now');
    END;

-- 만료된 IP 차단 해제
CREATE TRIGGER IF NOT EXISTS unblock_expired_ips
    AFTER INSERT ON blocked_ips
    BEGIN
        UPDATE blocked_ips 
        SET is_active = 0 
        WHERE expires_at IS NOT NULL 
          AND expires_at < datetime('now');
    END;

-- 샘플 데이터 삽입 (테스트용)
INSERT OR IGNORE INTO access_logs (user_id, action, ip_address, user_agent, device, location, status) VALUES
(1, 'login', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'desktop', '서울시 강남구', 'success'),
(2, 'login', '192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', 'mobile', '부산시 해운대구', 'success'),
(3, 'failed_login', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'desktop', '대구시 수성구', 'failed'),
(4, 'logout', '192.168.1.103', 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)', 'tablet', '인천시 연수구', 'success');

INSERT OR IGNORE INTO active_sessions (user_id, session_token, ip_address, user_agent, device, location, login_time, last_activity) VALUES
(1, 'session_token_1', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'desktop', '서울시 강남구', datetime('now', '-30 minutes'), datetime('now', '-5 minutes')),
(2, 'session_token_2', '192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', 'mobile', '부산시 해운대구', datetime('now', '-60 minutes'), datetime('now', '-2 minutes'));

-- 접속 관리 테이블 생성 완료 메시지
SELECT 'Access management tables created successfully!' as message;
