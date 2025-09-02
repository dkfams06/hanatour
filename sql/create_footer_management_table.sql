-- ====================================================================
-- 푸터 관리 시스템 데이터베이스 설정 스크립트
-- ====================================================================

-- 1. 푸터 정보 테이블 생성
CREATE TABLE IF NOT EXISTS footer_settings (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '설정 ID',
  setting_key VARCHAR(100) UNIQUE NOT NULL COMMENT '설정 키',
  setting_value TEXT NOT NULL COMMENT '설정 값',
  setting_type ENUM('text', 'textarea', 'link', 'email', 'phone') NOT NULL DEFAULT 'text' COMMENT '설정 타입',
  display_name VARCHAR(200) NOT NULL COMMENT '표시 이름',
  description TEXT NULL COMMENT '설정 설명',
  is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '활성화 여부',
  sort_order INT NOT NULL DEFAULT 0 COMMENT '정렬 순서',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  INDEX idx_setting_key (setting_key),
  INDEX idx_is_active (is_active),
  INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='푸터 설정 테이블';

-- 2. 기본 푸터 데이터 삽입
INSERT INTO footer_settings (setting_key, setting_value, setting_type, display_name, description, sort_order) VALUES
-- 회사 정보
('company_name', '(주)하나투어', 'text', '회사명', '회사명을 입력하세요', 1),
('ceo_name', '홍승준', 'text', '대표이사', '대표이사명을 입력하세요', 2),
('company_address', '서울특별시 양천구 목동', 'textarea', '회사 주소', '회사 주소를 입력하세요', 3),
('business_number', '892-86-02037', 'text', '사업자등록번호', '사업자등록번호를 입력하세요', 4),
('travel_agency_number', '2020-서울구로-1996', 'text', '통신판매업신고번호', '통신판매업신고번호를 입력하세요', 5),
('privacy_officer', '홍승준', 'text', '개인정보관리책임자', '개인정보관리책임자명을 입력하세요', 6),
('contact_email', 'dkfams06@naver.com', 'email', '연락처 이메일', '연락처 이메일을 입력하세요', 7),
('contact_phone', '1588-1234', 'phone', '연락처 전화번호', '연락처 전화번호를 입력하세요', 8),

-- 링크 정보
('link_company', '/company', 'link', '회사소개 링크', '회사소개 페이지 링크', 10),
('link_privacy', '/privacy', 'link', '개인정보취급방침 링크', '개인정보취급방침 페이지 링크', 11),
('link_terms', '/terms', 'link', '서비스 이용약관 링크', '서비스 이용약관 페이지 링크', 12),
('link_overseas_terms', '/overseas-travel-terms', 'link', '해외여행약관 링크', '해외여행약관 페이지 링크', 13),

-- 면책조항
('disclaimer_1', '※ 부득이한 사정에 의해 확정된 여행일정이 변경되는 경우 여행자의 사전 동의를 받습니다.', 'textarea', '면책조항 1', '첫 번째 면책조항을 입력하세요', 20),
('disclaimer_2', '※ (주)하나투어는 항공사가 제공하는 개별 항공권 및 여행사가 제공하는 일부 여행상품에 대하여 통신판매중개자의 지위를 가지며, 해당 상품, 상품정보, 거래에 관한 의무와 책임은 판매자에게 있습니다.', 'textarea', '면책조항 2', '두 번째 면책조항을 입력하세요', 21),

-- 저작권
('copyright_text', 'COPYRIGHT © (주)하나투어 INC. ALL RIGHTS RESERVED.', 'text', '저작권 텍스트', '저작권 텍스트를 입력하세요', 30),

-- 소셜 미디어 링크
('social_facebook', '', 'link', 'Facebook 링크', 'Facebook 페이지 링크 (선택사항)', 40),
('social_instagram', '', 'link', 'Instagram 링크', 'Instagram 페이지 링크 (선택사항)', 41),
('social_youtube', '', 'link', 'YouTube 링크', 'YouTube 채널 링크 (선택사항)', 42),
('social_blog', '', 'link', '블로그 링크', '블로그 링크 (선택사항)', 43);

-- 3. 인덱스 최적화
ANALYZE TABLE footer_settings;

-- 4. 권한 설정 (필요시)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON footer_settings TO 'hanatour_user'@'%';

-- 5. 완료 메시지
SELECT '푸터 관리 시스템 데이터베이스 설정이 완료되었습니다.' AS message;
