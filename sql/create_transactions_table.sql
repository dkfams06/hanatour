-- 입출금 거래 내역 테이블 생성
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36),
  type ENUM('deposit', 'withdrawal') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
  bankName VARCHAR(50),
  accountNumber VARCHAR(50),
  accountHolder VARCHAR(100),
  requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  processedDate DATETIME NULL,
  adminNotes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_userId (userId),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_requestDate (requestDate),
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 샘플 데이터 삽입 (테스트용)
INSERT INTO transactions (id, userId, type, amount, status, bankName, accountNumber, accountHolder, requestDate) VALUES
('txn_001', 'user_123', 'deposit', 1000000, 'completed', NULL, NULL, NULL, '2025-06-24 11:47:00'),
('txn_002', 'user_456', 'deposit', 470000, 'completed', NULL, NULL, NULL, '2025-06-20 15:05:00'),
('txn_003', 'user_456', 'deposit', 350000, 'completed', NULL, NULL, NULL, '2025-06-20 14:59:00'),
('txn_004', 'user_456', 'deposit', 170000, 'completed', NULL, NULL, NULL, '2025-06-20 14:51:00'),
('txn_005', 'user_456', 'deposit', 95000, 'completed', NULL, NULL, NULL, '2025-06-19 13:27:00'),
('txn_006', 'user_789', 'withdrawal', 104500, 'pending', '신한은행', '110-123-456789', '김정유', '2025-08-18 15:37:00'),
('txn_007', 'user_101', 'withdrawal', 54500, 'pending', '기업은행', '123-456-789012', '박지혜', '2025-08-18 14:32:00'),
('txn_008', 'user_102', 'withdrawal', 78800, 'pending', '카카오뱅크', '333-123-456789', '남도연', '2025-08-18 14:30:00'),
('txn_009', 'user_103', 'withdrawal', 40000, 'pending', '우리은행', '1002-123-456789', '변금식', '2025-08-18 14:25:00'),
('txn_010', 'user_104', 'withdrawal', 121000, 'pending', '국민은행', '123-456-789', '이진주', '2025-08-18 14:20:00');
