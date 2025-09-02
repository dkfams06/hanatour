-- 입금/출금 신청 관리 시스템 테이블 생성

-- 1. 입금 신청 테이블
CREATE TABLE IF NOT EXISTS deposit_applications (
  id VARCHAR(36) PRIMARY KEY COMMENT '입금 신청 ID',
  userId VARCHAR(36) NOT NULL COMMENT '사용자 ID',
  username VARCHAR(100) NOT NULL COMMENT '사용자 아이디',
  applicantName VARCHAR(100) NOT NULL COMMENT '신청자명',
  applicationType ENUM('deposit', 'withdrawal') NOT NULL DEFAULT 'deposit' COMMENT '신청 종류',
  amount INT NOT NULL COMMENT '신청 금액',
  applicationMethod VARCHAR(50) DEFAULT '직접충전' COMMENT '신청 방식',
  status ENUM('pending', 'processing', 'completed', 'rejected') NOT NULL DEFAULT 'pending' COMMENT '처리 상태',
  adminNotes TEXT NULL COMMENT '관리자 메모',
  processedAt DATETIME NULL COMMENT '처리 완료 시간',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '신청 시간',
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt),
  INDEX idx_applicationType (applicationType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='입금 신청 테이블';

-- 2. 출금 신청 테이블
CREATE TABLE IF NOT EXISTS withdrawal_applications (
  id VARCHAR(36) PRIMARY KEY COMMENT '출금 신청 ID',
  userId VARCHAR(36) NOT NULL COMMENT '사용자 ID',
  username VARCHAR(100) NOT NULL COMMENT '사용자 아이디',
  applicantName VARCHAR(100) NOT NULL COMMENT '신청자명',
  applicationType ENUM('deposit', 'withdrawal') NOT NULL DEFAULT 'withdrawal' COMMENT '신청 종류',
  amount INT NOT NULL COMMENT '신청 금액',
  bankName VARCHAR(50) NOT NULL COMMENT '출금 은행',
  accountNumber VARCHAR(50) NOT NULL COMMENT '출금 계좌',
  accountHolder VARCHAR(100) NOT NULL COMMENT '예금주',
  status ENUM('pending', 'processing', 'completed', 'rejected') NOT NULL DEFAULT 'pending' COMMENT '처리 상태',
  adminNotes TEXT NULL COMMENT '관리자 메모',
  transferCompletedAt DATETIME NULL COMMENT '송금 완료 시간',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '신청 시간',
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt),
  INDEX idx_applicationType (applicationType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='출금 신청 테이블';

-- 3. 마일리지 거래 내역 테이블
CREATE TABLE IF NOT EXISTS mileage_transactions (
  id VARCHAR(36) PRIMARY KEY COMMENT '거래 ID',
  userId VARCHAR(36) NOT NULL COMMENT '사용자 ID',
  transactionType ENUM('deposit', 'withdrawal', 'reward', 'usage') NOT NULL COMMENT '거래 유형',
  amount INT NOT NULL COMMENT '거래 금액',
  balanceBefore INT NOT NULL COMMENT '거래 전 잔액',
  balanceAfter INT NOT NULL COMMENT '거래 후 잔액',
  description VARCHAR(200) NOT NULL COMMENT '거래 설명',
  referenceId VARCHAR(36) NULL COMMENT '참조 ID (입금/출금 신청 ID)',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '거래 시간',
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_transactionType (transactionType),
  INDEX idx_createdAt (createdAt),
  INDEX idx_referenceId (referenceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='마일리지 거래 내역 테이블';

-- 4. 샘플 데이터 삽입 (테스트용)
INSERT INTO deposit_applications (id, userId, username, applicantName, applicationType, amount, applicationMethod, status, createdAt) VALUES
('dep_001', 'user_001', 'john_doe', '권영순', 'deposit', 1000000, '직접충전', 'completed', '2025-06-24 11:47:00'),
('dep_002', 'user_002', 'jane_smith', '남혜진', 'deposit', 470000, '직접충전', 'completed', '2025-06-20 15:05:00'),
('dep_003', 'user_002', 'jane_smith', '남혜진', 'deposit', 350000, '직접충전', 'completed', '2025-06-20 14:59:00'),
('dep_004', 'user_002', 'jane_smith', '남혜진', 'deposit', 170000, '직접충전', 'completed', '2025-06-20 14:51:00'),
('dep_005', 'user_002', 'jane_smith', '남혜진', 'deposit', 95000, '직접충전', 'completed', '2025-06-19 13:27:00');

INSERT INTO withdrawal_applications (id, userId, username, applicantName, applicationType, amount, bankName, accountNumber, accountHolder, status, createdAt) VALUES
('with_001', 'user_001', 'john_doe', '권영순', 'withdrawal', 500000, '신한은행', '110-123-456789', '권영순', 'pending', '2025-06-25 10:00:00'),
('with_002', 'user_002', 'jane_smith', '남혜진', 'withdrawal', 300000, '우리은행', '1002-123-456789', '남혜진', 'pending', '2025-06-25 09:30:00');
