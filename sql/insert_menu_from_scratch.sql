-- 빈 regions 테이블에 하드코딩된 메뉴 구조 삽입
-- 외래키 제약조건을 고려하여 부모 -> 자식 순서로 삽입

-- 1. 대륙 레벨 (최상위) 먼저 삽입
INSERT INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group, menu_color) VALUES
-- 실제 대륙들
('americas', '미주', NULL, 'continent', 1, TRUE, FALSE, 0, NULL, NULL),
('europe', '유럽', NULL, 'continent', 2, TRUE, FALSE, 0, NULL, NULL),
('asia', '아시아', NULL, 'continent', 3, TRUE, FALSE, 0, NULL, NULL),
('oceania', '오세아니아', NULL, 'continent', 4, TRUE, FALSE, 0, NULL, NULL),
('africa', '아프리카', NULL, 'continent', 5, TRUE, FALSE, 0, NULL, NULL),
('domestic', '국내', NULL, 'continent', 6, TRUE, TRUE, 4, 'main', '#F59E0B'),

-- 메뉴용 가상 대륙들
('usa-menu', '미국여행', NULL, 'continent', 10, TRUE, TRUE, 1, 'main', '#3B82F6'),
('canada-americas-menu', '캐나다/중남미', NULL, 'continent', 11, TRUE, TRUE, 2, 'main', '#10B981'),
('europe-africa-menu', '유럽/아프리카', NULL, 'continent', 12, TRUE, TRUE, 3, 'main', '#10B981'),
('asia-menu', '아시아/동남아', NULL, 'continent', 13, TRUE, TRUE, 5, 'main', '#EF4444'),
('staycation', '호캠스', NULL, 'continent', 14, TRUE, TRUE, 6, 'main', '#8B5CF6'),
('deals', '특가할인상품', NULL, 'continent', 15, TRUE, TRUE, 7, 'main', '#06B6D4');

-- 2. 국가 레벨 삽입
INSERT INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group) VALUES
-- 미주 국가들
('usa', '미국', 'americas', 'country', 1, TRUE, FALSE, 0, NULL),
('canada', '캐나다', 'americas', 'country', 2, TRUE, TRUE, 1, 'sub'),
('mexico', '멕시코', 'americas', 'country', 3, TRUE, TRUE, 2, 'sub'),
('brazil', '브라질', 'americas', 'country', 4, TRUE, TRUE, 3, 'sub'),
('cuba', '쿠바', 'americas', 'country', 5, TRUE, TRUE, 4, 'sub'),

-- 유럽 국가들
('france', '프랑스', 'europe', 'country', 1, TRUE, TRUE, 1, 'sub'),
('italy', '이탈리아', 'europe', 'country', 2, TRUE, TRUE, 2, 'sub'),
('spain', '스페인', 'europe', 'country', 3, TRUE, TRUE, 3, 'sub'),
('germany', '독일', 'europe', 'country', 4, TRUE, TRUE, 4, 'sub'),
('uk', '영국', 'europe', 'country', 5, TRUE, TRUE, 5, 'sub'),

-- 아시아 국가들
('japan', '일본', 'asia', 'country', 1, TRUE, TRUE, 1, 'sub'),
('china', '중국', 'asia', 'country', 2, TRUE, TRUE, 2, 'sub'),
('thailand', '태국', 'asia', 'country', 3, TRUE, TRUE, 3, 'sub'),
('vietnam', '베트남', 'asia', 'country', 4, TRUE, TRUE, 4, 'sub'),
('singapore', '싱가포르', 'asia', 'country', 5, TRUE, TRUE, 5, 'sub'),
('taiwan', '대만', 'asia', 'country', 6, TRUE, TRUE, 6, 'sub'),
('hongkong-macau', '홍콩/마카오', 'asia', 'country', 7, TRUE, TRUE, 7, 'sub'),

-- 국내
('korea', '대한민국', 'domestic', 'country', 1, TRUE, FALSE, 0, NULL),

-- 호캠스 카테고리
('staycation-hotels', '호텔', 'staycation', 'country', 1, TRUE, TRUE, 1, 'sub'),
('staycation-resorts', '리조트', 'staycation', 'country', 2, TRUE, TRUE, 2, 'sub'),
('staycation-pool-villas', '풀빌라', 'staycation', 'country', 3, TRUE, TRUE, 3, 'sub'),

-- 특가할인상품 카테고리
('deals-early-bird', '얼리버드', 'deals', 'country', 1, TRUE, TRUE, 1, 'sub'),
('deals-exclusive', '독점상품', 'deals', 'country', 2, TRUE, TRUE, 2, 'sub'),
('deals-last-minute', '막판특가', 'deals', 'country', 3, TRUE, TRUE, 3, 'sub');

-- 3. 도시 레벨 삽입
INSERT INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group) VALUES
-- 미국 하위 지역들 (usa-menu 하위로)
('usa-east', '동부', 'usa-menu', 'city', 1, TRUE, TRUE, 1, 'sub'),
('usa-west', '서부', 'usa-menu', 'city', 2, TRUE, TRUE, 2, 'sub'),
('usa-hawaii', '하와이', 'usa-menu', 'city', 3, TRUE, TRUE, 3, 'sub'),
('usa-alaska', '알래스카', 'usa-menu', 'city', 4, TRUE, TRUE, 4, 'sub'),

-- 캐나다/중남미 하위 (canada-americas-menu 하위로 이동)
('canada-sub', '캐나다', 'canada-americas-menu', 'city', 1, TRUE, TRUE, 1, 'sub'),
('mexico-sub', '멕시코', 'canada-americas-menu', 'city', 2, TRUE, TRUE, 2, 'sub'),
('cuba-sub', '쿠바', 'canada-americas-menu', 'city', 3, TRUE, TRUE, 3, 'sub'),
('brazil-sub', '브라질', 'canada-americas-menu', 'city', 4, TRUE, TRUE, 4, 'sub'),

-- 유럽 하위 지역들 (europe-africa-menu 하위로)
('europe-west', '서유럽', 'europe-africa-menu', 'city', 1, TRUE, TRUE, 1, 'sub'),
('europe-east', '동유럽', 'europe-africa-menu', 'city', 2, TRUE, TRUE, 2, 'sub'),
('europe-north', '북유럽', 'europe-africa-menu', 'city', 3, TRUE, TRUE, 3, 'sub'),
('europe-south', '남유럽', 'europe-africa-menu', 'city', 4, TRUE, TRUE, 4, 'sub'),
('africa-sub', '아프리카', 'europe-africa-menu', 'city', 5, TRUE, TRUE, 5, 'sub'),

-- 국내 하위 지역들
('seoul', '서울/수도권', 'korea', 'city', 1, TRUE, TRUE, 1, 'sub'),
('gangwon', '강원도', 'korea', 'city', 2, TRUE, TRUE, 2, 'sub'),
('chungcheong', '충청도', 'korea', 'city', 3, TRUE, TRUE, 3, 'sub'),
('jeolla', '전라도', 'korea', 'city', 4, TRUE, TRUE, 4, 'sub'),
('gyeongsang', '경상도', 'korea', 'city', 5, TRUE, TRUE, 5, 'sub'),
('jeju', '제주도', 'korea', 'city', 6, TRUE, TRUE, 6, 'sub'),

-- 아시아 하위 도시들 (asia-menu 하위로 일본, 중국만 예시)
('tokyo', '도쿄', 'japan', 'city', 1, TRUE, FALSE, 0, NULL),
('osaka', '오사카', 'japan', 'city', 2, TRUE, FALSE, 0, NULL),
('beijing', '베이징', 'china', 'city', 1, TRUE, FALSE, 0, NULL),
('shanghai', '상하이', 'china', 'city', 2, TRUE, FALSE, 0, NULL);

-- 아시아 국가들을 asia-menu 하위로 재설정
UPDATE regions SET parent_id = 'asia-menu' WHERE id IN ('japan', 'china', 'taiwan', 'hongkong-macau', 'thailand', 'vietnam', 'singapore');

-- 국내 하위 지역들을 domestic 하위로 재설정  
UPDATE regions SET parent_id = 'domestic' WHERE id IN ('seoul', 'gangwon', 'chungcheong', 'jeolla', 'gyeongsang', 'jeju');

-- 확인 쿼리 - 메뉴 구조 시각화
SELECT 
  CASE 
    WHEN r.level = 'continent' AND r.show_in_menu = TRUE THEN CONCAT('📁 ', r.name, ' (', r.menu_order, ')')
    WHEN r.level = 'country' AND r.show_in_menu = TRUE THEN CONCAT('  📂 ', r.name)
    WHEN r.level = 'city' AND r.show_in_menu = TRUE THEN CONCAT('    📄 ', r.name)
    ELSE CONCAT('⚪ ', r.name, ' (숨김)')
  END as menu_structure,
  r.menu_group,
  r.menu_color,
  r.show_in_menu
FROM regions r
ORDER BY 
  r.show_in_menu DESC,
  r.menu_group DESC,
  r.menu_order ASC,
  r.parent_id,
  r.display_order ASC;

-- 메뉴만 간단히 확인
SELECT 
  r.name,
  r.level,
  r.menu_group,
  r.menu_order,
  r.menu_color,
  parent.name as parent_name
FROM regions r
LEFT JOIN regions parent ON r.parent_id = parent.id
WHERE r.show_in_menu = TRUE
ORDER BY r.menu_group DESC, r.menu_order ASC; 