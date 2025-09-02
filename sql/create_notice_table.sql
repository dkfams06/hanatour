-- 공지사항 테이블 생성
CREATE TABLE IF NOT EXISTS notices (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL COMMENT '공지사항 제목',
  content TEXT NOT NULL COMMENT '공지사항 내용',
  author VARCHAR(100) NOT NULL COMMENT '작성자',
  isImportant BOOLEAN DEFAULT FALSE COMMENT '중요 공지 여부',
  viewCount INT DEFAULT 0 COMMENT '조회수',
  status ENUM('published', 'draft', 'archived') DEFAULT 'published' COMMENT '게시 상태',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_isImportant (isImportant),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='공지사항 테이블';

-- 샘플 공지사항 데이터 삽입
INSERT INTO notices (id, title, content, author, isImportant, status) VALUES
('notice_001', '여름 휴가 시즌 배송 안내', '안녕하세요, 한아투어입니다.\n\n여름 휴가 시즌을 맞이하여 배송 일정에 대한 안내드립니다.\n\n- 7월 1일 ~ 8월 31일: 배송 지연 가능성 있음\n- 주문 후 3-5일 내 배송 완료\n- 긴급 배송은 별도 문의\n\n고객님의 양해를 부탁드립니다.', '관리자', TRUE, 'published'),
('notice_002', '시스템 점검 안내 (7/10)', '안녕하세요, 한아투어입니다.\n\n더 나은 서비스를 위해 시스템 점검을 실시합니다.\n\n■ 점검 일시: 2024년 7월 10일 (수) 오전 2시 ~ 6시\n■ 점검 내용: 서버 업그레이드 및 보안 강화\n■ 영향 범위: 웹사이트 일시 접속 불가\n\n점검 시간 동안 불편을 드려 죄송합니다.', '시스템관리자', TRUE, 'published'),
('notice_003', '신규 투어 상품 출시', '안녕하세요, 한아투어입니다.\n\n새로운 여행 상품이 출시되었습니다!\n\n■ 신규 상품\n- 유럽 발칸 반도 10일\n- 동남아시아 크루즈 7일\n- 국내 제주도 프리미엄 4일\n\n자세한 내용은 상품 페이지에서 확인하실 수 있습니다.', '마케팅팀', FALSE, 'published'),
('notice_004', '개인정보처리방침 개정 안내', '안녕하세요, 한아투어입니다.\n\n개인정보보호법 개정에 따라 개인정보처리방침을 개정하였습니다.\n\n■ 개정 일시: 2024년 6월 15일\n■ 주요 변경사항\n- 개인정보 수집·이용 목적 명시\n- 제3자 제공 시 사전 동의 절차 강화\n- 개인정보 보유기간 명확화\n\n새로운 개인정보처리방침은 웹사이트 하단에서 확인하실 수 있습니다.', '법무팀', FALSE, 'published'),
('notice_005', '2024년 설 연휴 휴무 안내', '안녕하세요, 한아투어입니다.\n\n2024년 설 연휴 기간 중 휴무 안내드립니다.\n\n■ 휴무 기간: 2024년 2월 9일 (금) ~ 2월 12일 (월)\n■ 정상 업무: 2024년 2월 13일 (화)부터\n\n휴무 기간 중 문의사항은 이메일로 남겨주시면 연휴 후 빠른 시일 내에 답변드리겠습니다.\n\n고객님의 이해와 협조를 부탁드립니다.', '고객센터', FALSE, 'published'); 