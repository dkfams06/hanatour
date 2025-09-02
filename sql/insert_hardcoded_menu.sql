-- Header에서 하드코딩된 메뉴 정보를 regions 테이블에 삽입하는 쿼리
-- 기존 regions 테이블 데이터와 연동하여 메뉴 설정을 추가합니다.

-- 먼저 기존 메뉴 설정 초기화 (필요시)
UPDATE regions SET show_in_menu = FALSE, menu_order = 0, menu_group = NULL, menu_color = NULL;

-- 1. 주요 대륙/지역을 메인 메뉴로 설정
-- 미주 (미국여행)
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 1,
  menu_group = 'main',
  menu_color = '#3B82F6'
WHERE id = 'americas' AND level = 'continent';

-- 미주 하위 국가들 (서브메뉴)
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 1,
  menu_group = 'sub'
WHERE id IN ('usa', 'canada', 'mexico', 'cuba', 'brazil') AND level = 'country';

-- 미국 하위 지역들 추가 (동부, 서부, 하와이, 알래스카)
INSERT INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group) VALUES
('usa-east', '동부', 'usa', 'city', 1, TRUE, TRUE, 1, 'sub'),
('usa-west', '서부', 'usa', 'city', 2, TRUE, TRUE, 2, 'sub'),
('hawaii', '하와이', 'usa', 'city', 3, TRUE, TRUE, 3, 'sub'),
('alaska', '알래스카', 'usa', 'city', 4, TRUE, TRUE, 4, 'sub')
ON DUPLICATE KEY UPDATE 
  show_in_menu = TRUE, menu_order = VALUES(menu_order), menu_group = VALUES(menu_group);

-- 2. 유럽/아프리카 (캐나다/중남미로 표시됨 - 실제로는 유럽)
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 2,
  menu_group = 'main',
  menu_color = '#10B981'
WHERE id = 'europe' AND level = 'continent';

-- 유럽 하위 지역들 추가
INSERT INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group) VALUES
('europe-west', '서유럽', 'europe', 'city', 1, TRUE, TRUE, 1, 'sub'),
('europe-east', '동유럽', 'europe', 'city', 2, TRUE, TRUE, 2, 'sub'),
('europe-north', '북유럽', 'europe', 'city', 3, TRUE, TRUE, 3, 'sub'),
('europe-south', '남유럽', 'europe', 'city', 4, TRUE, TRUE, 4, 'sub')
ON DUPLICATE KEY UPDATE 
  show_in_menu = TRUE, menu_order = VALUES(menu_order), menu_group = VALUES(menu_group);

-- 아프리카도 유럽 하위로 추가
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 5,
  menu_group = 'sub'
WHERE id = 'africa' AND level = 'continent';

-- 3. 국내여행
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 3,
  menu_group = 'main',
  menu_color = '#F59E0B'
WHERE id = 'domestic' AND level = 'continent';

-- 국내 하위 지역들 추가
INSERT INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group) VALUES
('seoul', '서울/수도권', 'korea', 'city', 1, TRUE, TRUE, 1, 'sub'),
('gangwon', '강원도', 'korea', 'city', 2, TRUE, TRUE, 2, 'sub'),
('chungcheong', '충청도', 'korea', 'city', 3, TRUE, TRUE, 3, 'sub'),
('jeolla', '전라도', 'korea', 'city', 4, TRUE, TRUE, 4, 'sub'),
('gyeongsang', '경상도', 'korea', 'city', 5, TRUE, TRUE, 5, 'sub')
ON DUPLICATE KEY UPDATE 
  show_in_menu = TRUE, menu_order = VALUES(menu_order), menu_group = VALUES(menu_group);

-- 제주는 이미 있으니 메뉴 설정만 업데이트
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 6,
  menu_group = 'sub'
WHERE id = 'jeju' AND level = 'city';

-- 4. 아시아/동남아
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 4,
  menu_group = 'main',
  menu_color = '#EF4444'
WHERE id = 'asia' AND level = 'continent';

-- 아시아 주요 국가들 (서브메뉴) - 이미 있는 국가들
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 1,
  menu_group = 'sub'
WHERE id IN ('japan', 'china', 'taiwan', 'hongkong-macau', 'thailand', 'vietnam', 'singapore') AND level = 'country';

-- 5. 호캠스 (가상의 지역으로 추가)
INSERT INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group, menu_color) VALUES
('staycation', '호캠스', NULL, 'continent', 100, TRUE, TRUE, 5, 'main', '#8B5CF6')
ON DUPLICATE KEY UPDATE 
  show_in_menu = TRUE, menu_order = 5, menu_group = 'main', menu_color = '#8B5CF6';

-- 호캠스 하위 카테고리
INSERT INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group) VALUES
('staycation-hotels', '호텔', 'staycation', 'country', 1, TRUE, TRUE, 1, 'sub'),
('staycation-resorts', '리조트', 'staycation', 'country', 2, TRUE, TRUE, 2, 'sub'),
('staycation-pool-villas', '풀빌라', 'staycation', 'country', 3, TRUE, TRUE, 3, 'sub')
ON DUPLICATE KEY UPDATE 
  show_in_menu = TRUE, menu_order = VALUES(menu_order), menu_group = VALUES(menu_group);

-- 6. 특가할인상품 (가상의 지역으로 추가)
INSERT INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group, menu_color) VALUES
('deals', '특가할인상품', NULL, 'continent', 101, TRUE, TRUE, 6, 'main', '#06B6D4')
ON DUPLICATE KEY UPDATE 
  show_in_menu = TRUE, menu_order = 6, menu_group = 'main', menu_color = '#06B6D4';

-- 특가할인상품 하위 카테고리
INSERT INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group) VALUES
('deals-early-bird', '얼리버드', 'deals', 'country', 1, TRUE, TRUE, 1, 'sub'),
('deals-exclusive', '독점상품', 'deals', 'country', 2, TRUE, TRUE, 2, 'sub'),
('deals-last-minute', '막판특가', 'deals', 'country', 3, TRUE, TRUE, 3, 'sub')
ON DUPLICATE KEY UPDATE 
  show_in_menu = TRUE, menu_order = VALUES(menu_order), menu_group = VALUES(menu_group);

-- 확인 쿼리들
-- 메뉴에 표시되는 항목들 확인
SELECT 
  r.id,
  r.name,
  r.level,
  r.menu_order,
  r.menu_group,
  r.menu_color,
  r.show_in_menu,
  parent.name as parent_name
FROM regions r
LEFT JOIN regions parent ON r.parent_id = parent.id
WHERE r.show_in_menu = TRUE
ORDER BY r.menu_group DESC, r.menu_order ASC, r.display_order ASC;

-- 계층 구조로 확인
SELECT 
  CASE 
    WHEN r.level = 'continent' THEN r.name
    WHEN r.level = 'country' THEN CONCAT('  └ ', r.name)
    WHEN r.level = 'city' THEN CONCAT('    └ ', r.name)
  END as menu_structure,
  r.menu_group,
  r.menu_order,
  r.menu_color
FROM regions r
WHERE r.show_in_menu = TRUE
ORDER BY 
  CASE WHEN r.parent_id IS NULL THEN r.id ELSE r.parent_id END,
  r.menu_order ASC; 