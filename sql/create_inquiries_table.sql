-- ====================================================================
-- 1:1 문의 시스템 데이터베이스 설정 스크립트
-- ====================================================================

-- 1. 문의 테이블 생성
CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(36) PRIMARY KEY COMMENT '문의 ID',
  inquiryNumber VARCHAR(50) UNIQUE NOT NULL COMMENT '문의번호',
  customerName VARCHAR(100) NOT NULL COMMENT '고객명',
  customerPhone VARCHAR(20) NOT NULL COMMENT '고객 전화번호',
  customerEmail VARCHAR(100) NULL COMMENT '고객 이메일',
  category ENUM('general', 'booking', 'payment', 'refund', 'tour', 'technical', 'other') NOT NULL DEFAULT 'general' COMMENT '문의 카테고리',
  subject VARCHAR(200) NOT NULL COMMENT '문의 제목',
  content TEXT NOT NULL COMMENT '문의 내용',
  status ENUM('pending', 'in_progress', 'completed', 'closed') NOT NULL DEFAULT 'pending' COMMENT '처리 상태',
  priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium' COMMENT '우선순위',
  assignedTo VARCHAR(100) NULL COMMENT '담당자',
  adminNotes TEXT NULL COMMENT '관리자 메모',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  completedAt DATETIME NULL COMMENT '완료일시',
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_priority (priority),
  INDEX idx_createdAt (createdAt),
  INDEX idx_customerPhone (customerPhone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='1:1 문의 테이블';

-- 2. 문의 답변 테이블 생성
CREATE TABLE IF NOT EXISTS inquiry_responses (
  id VARCHAR(36) PRIMARY KEY COMMENT '답변 ID',
  inquiryId VARCHAR(36) NOT NULL COMMENT '문의 ID',
  responseType ENUM('admin_response', 'customer_followup') NOT NULL DEFAULT 'admin_response' COMMENT '답변 유형',
  content TEXT NOT NULL COMMENT '답변 내용',
  adminName VARCHAR(100) NULL COMMENT '답변 관리자명',
  isInternal BOOLEAN NOT NULL DEFAULT FALSE COMMENT '내부 메모 여부',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '답변일시',
  FOREIGN KEY (inquiryId) REFERENCES inquiries(id) ON DELETE CASCADE,
  INDEX idx_inquiryId (inquiryId),
  INDEX idx_responseType (responseType),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='문의 답변 테이블';

-- 3. 문의 첨부파일 테이블 생성 (향후 확장용)
CREATE TABLE IF NOT EXISTS inquiry_attachments (
  id VARCHAR(36) PRIMARY KEY COMMENT '첨부파일 ID',
  inquiryId VARCHAR(36) NOT NULL COMMENT '문의 ID',
  fileName VARCHAR(255) NOT NULL COMMENT '파일명',
  filePath VARCHAR(500) NOT NULL COMMENT '파일 경로',
  fileSize INT NOT NULL COMMENT '파일 크기 (bytes)',
  mimeType VARCHAR(100) NOT NULL COMMENT 'MIME 타입',
  uploadedBy VARCHAR(100) NOT NULL COMMENT '업로드한 사용자',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '업로드일시',
  FOREIGN KEY (inquiryId) REFERENCES inquiries(id) ON DELETE CASCADE,
  INDEX idx_inquiryId (inquiryId),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='문의 첨부파일 테이블';

-- 4. 샘플 데이터 삽입
INSERT INTO inquiries (id, inquiryNumber, customerName, customerPhone, customerEmail, category, subject, content, status, priority) VALUES
('inq_001', 'INQ-2024-001', '김철수', '010-1234-5678', 'kim@example.com', 'booking', '예약 변경 문의', '3월 15일 출발 일본 여행 예약을 변경하고 싶습니다. 가능한가요?', 'pending', 'medium'),
('inq_002', 'INQ-2024-002', '이영희', '010-2345-6789', 'lee@example.com', 'payment', '결제 취소 요청', '신용카드 결제를 취소하고 싶습니다. 어떻게 해야 하나요?', 'in_progress', 'high'),
('inq_003', 'INQ-2024-003', '박민수', '010-3456-7890', 'park@example.com', 'refund', '환불 처리 문의', '지난주에 취소한 예약의 환불이 아직 처리되지 않았습니다.', 'completed', 'urgent'),
('inq_004', 'INQ-2024-004', '최지영', '010-4567-8901', 'choi@example.com', 'tour', '여행 상품 문의', '4월에 가족 여행을 계획 중인데 추천 상품이 있나요?', 'pending', 'low'),
('inq_005', 'INQ-2024-005', '정수민', '010-5678-9012', 'jung@example.com', 'technical', '웹사이트 오류 문의', '예약 페이지에서 오류가 발생합니다. 확인 부탁드립니다.', 'in_progress', 'high');

-- 5. 샘플 답변 데이터 삽입
INSERT INTO inquiry_responses (id, inquiryId, responseType, content, adminName, isInternal) VALUES
('resp_001', 'inq_002', 'admin_response', '안녕하세요. 결제 취소 관련하여 안내드립니다.\n\n결제 취소는 예약 취소와 동일한 절차로 진행됩니다. 예약 확인 페이지에서 "예약 취소 요청" 버튼을 클릭하시거나 고객센터로 연락주시면 도움드리겠습니다.\n\n추가 문의사항이 있으시면 언제든 연락주세요.', '관리자', FALSE),
('resp_002', 'inq_003', 'admin_response', '환불 처리 관련하여 안내드립니다.\n\n환불은 영업일 기준 3-5일 내에 처리됩니다. 현재 처리 중이며, 완료 시 SMS로 안내드리겠습니다.\n\n불편을 끼쳐 죄송합니다.', '관리자', FALSE),
('resp_003', 'inq_005', 'admin_response', '웹사이트 오류 관련하여 확인해보겠습니다.\n\n현재 기술팀에서 점검 중이며, 빠른 시일 내에 해결하겠습니다.\n\n임시로 모바일 앱을 이용해주시기 바랍니다.', '관리자', FALSE),
('resp_004', 'inq_002', 'admin_response', '내부 메모: 고객이 매우 불만족스러워함. 우선순위 높게 처리 필요.', '관리자', TRUE);

-- 6. 인덱스 최적화
ANALYZE TABLE inquiries;
ANALYZE TABLE inquiry_responses;
ANALYZE TABLE inquiry_attachments;

-- 7. 권한 설정 (필요시)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON inquiries TO 'hanatour_user'@'%';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON inquiry_responses TO 'hanatour_user'@'%';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON inquiry_attachments TO 'hanatour_user'@'%';

-- 8. 완료 메시지
SELECT '1:1 문의 시스템 데이터베이스 설정이 완료되었습니다.' AS message; 