-- 푸터 설정 기본 데이터 삽입
-- 기존 데이터가 있으면 업데이트, 없으면 삽입 (ON DUPLICATE KEY UPDATE)

INSERT INTO footer_settings (setting_key, setting_value, setting_type, display_name, description, sort_order) VALUES
-- 회사 정보
('company_name', '(주)하나투어', 'text', '회사명', '회사 이름을 입력하세요', 1),
('ceo_name', '김대표', 'text', '대표이사', '대표이사 이름을 입력하세요', 2),
('company_address', '서울특별시 강남구 테헤란로 123', 'text', '회사 주소', '회사 주소를 입력하세요', 3),
('business_number', '123-45-67890', 'text', '사업자등록번호', '사업자등록번호를 입력하세요', 4),
('travel_agency_number', '제2023-서울강남-0123호', 'text', '통신판매업신고번호', '통신판매업신고번호를 입력하세요', 5),
('privacy_officer', '김개인정보', 'text', '개인정보관리책임자', '개인정보관리책임자를 입력하세요', 6),
('contact_email', 'info@hanatour.com', 'email', '대표 이메일', '대표 이메일을 입력하세요', 7),
('contact_phone', '02-1234-5678', 'phone', '대표 전화번호', '대표 전화번호를 입력하세요', 8),

-- 링크
('link_terms', '/terms', 'link', '이용약관', '이용약관 페이지 URL', 10),
('link_privacy', '/privacy', 'link', '개인정보처리방침', '개인정보처리방침 페이지 URL', 11),
('link_travel_terms', '/overseas-travel-terms', 'link', '해외여행약관', '해외여행약관 페이지 URL', 12),
('link_company', '/company', 'link', '회사소개', '회사소개 페이지 URL', 13),

-- 면책조항
('disclaimer_1', '하나투어는 개별 항공권, 호텔, 현지투어 상품에 대하여 통신판매중개자의 지위를 가지며, 해당상품, 상품정보, 거래에 관한 의무와 책임은 판매자에게 있습니다.', 'textarea', '면책조항 1', '첫 번째 면책조항', 20),
('disclaimer_2', '하나투어는 상품정보, 상품가격, 예약가능 여부 등에 대하여 실시간으로 업데이트하고 있으나, 경우에 따라 실제 정보와 차이가 발생할 수 있습니다.', 'textarea', '면책조항 2', '두 번째 면책조항', 21),

-- 저작권
('copyright_text', 'Copyright © 2024 하나투어. All rights reserved.', 'text', '저작권 텍스트', '저작권 정보를 입력하세요', 30),

-- 소셜 미디어
('social_facebook', 'https://www.facebook.com/hanatour', 'link', '페이스북', '페이스북 페이지 URL', 40),
('social_instagram', 'https://www.instagram.com/hanatour', 'link', '인스타그램', '인스타그램 페이지 URL', 41),
('social_youtube', 'https://www.youtube.com/hanatour', 'link', '유튜브', '유튜브 채널 URL', 42)

ON DUPLICATE KEY UPDATE
setting_value = VALUES(setting_value),
display_name = VALUES(display_name),
description = VALUES(description),
sort_order = VALUES(sort_order),
updated_at = CURRENT_TIMESTAMP;
