-- 외래키 제약 조건 문제 해결을 위한 수정된 쿼리
-- 먼저 기존 regions 테이블 데이터 확인

-- 현재 regions 테이블 확인
SELECT id, name, level, parent_id FROM regions ORDER BY level, name;

-- 기존 메뉴 설정 초기화
UPDATE regions SET show_in_menu = FALSE, menu_order = 0, menu_group = NULL, menu_color = NULL WHERE show_in_menu IS NOT NULL;

-- 1. 미주 대륙 설정 (americas 대신 실제 존재하는 대륙 사용)
-- 만약 americas가 없다면 미주 관련 국가들을 직접 메인 메뉴로 설정

-- 미국 메인 메뉴로 설정
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 1,
  menu_group = 'main',
  menu_color = '#3B82F6'
WHERE id = 'usa' AND level = 'country';

-- 미국이 없다면 생성
INSERT IGNORE INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group, menu_color) VALUES
('usa', '미국', 'americas', 'country', 1, TRUE, TRUE, 1, 'main', '#3B82F6');

-- 미국 하위 지역들 (parent_id를 usa로)
INSERT IGNORE INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group) VALUES
('usa-east', '동부', 'usa', 'city', 1, TRUE, TRUE, 1, 'sub'),
('usa-west', '서부', 'usa', 'city', 2, TRUE, TRUE, 2, 'sub'),
('usa-hawaii', '하와이', 'usa', 'city', 3, TRUE, TRUE, 3, 'sub'),
('usa-alaska', '알래스카', 'usa', 'city', 4, TRUE, TRUE, 4, 'sub');

-- 캐나다/중남미 묶음 (실제로는 개별 국가들을 서브메뉴로)
INSERT IGNORE INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group, menu_color) VALUES
('canada-americas', '캐나다/중남미', NULL, 'continent', 2, TRUE, TRUE, 2, 'main', '#10B981');

-- 캐나다/중남미 하위 국가들
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 1,
  menu_group = 'sub',
  parent_id = 'canada-americas'
WHERE id IN ('canada', 'mexico', 'cuba', 'brazil') AND level = 'country';

-- 2. 유럽/아프리카 설정
-- 유럽을 메인 메뉴로 설정하고 이름 변경
UPDATE regions SET 
  name = '유럽/아프리카',
  show_in_menu = TRUE,
  menu_order = 3,
  menu_group = 'main',
  menu_color = '#10B981'
WHERE id = 'europe' AND level = 'continent';

-- 유럽 하위 지역들 추가 (실제 europe에 연결)
INSERT IGNORE INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group) VALUES
('europe-west', '서유럽', 'europe', 'city', 1, TRUE, TRUE, 1, 'sub'),
('europe-east', '동유럽', 'europe', 'city', 2, TRUE, TRUE, 2, 'sub'),
('europe-north', '북유럽', 'europe', 'city', 3, TRUE, TRUE, 3, 'sub'),
('europe-south', '남유럽', 'europe', 'city', 4, TRUE, TRUE, 4, 'sub');

-- 아프리카를 유럽 하위로 설정
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 5,
  menu_group = 'sub',
  parent_id = 'europe'
WHERE id = 'africa' AND level = 'continent';

-- 3. 국내여행 설정
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 4,
  menu_group = 'main',
  menu_color = '#F59E0B'
WHERE id = 'domestic' AND level = 'continent';

-- 한국이 있는지 확인하고 국내 하위 지역들 추가
INSERT IGNORE INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group) VALUES
('korea-seoul', '서울/수도권', 'korea', 'city', 1, TRUE, TRUE, 1, 'sub'),
('korea-gangwon', '강원도', 'korea', 'city', 2, TRUE, TRUE, 2, 'sub'),
('korea-chungcheong', '충청도', 'korea', 'city', 3, TRUE, TRUE, 3, 'sub'),
('korea-jeolla', '전라도', 'korea', 'city', 4, TRUE, TRUE, 4, 'sub'),
('korea-gyeongsang', '경상도', 'korea', 'city', 5, TRUE, TRUE, 5, 'sub');

-- 제주는 이미 있을 수 있으니 업데이트
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 6,
  menu_group = 'sub'
WHERE id = 'jeju' AND level = 'city' AND parent_id = 'korea';

-- 4. 아시아/동남아 설정
UPDATE regions SET 
  name = '아시아/동남아',
  show_in_menu = TRUE,
  menu_order = 5,
  menu_group = 'main',
  menu_color = '#EF4444'
WHERE id = 'asia' AND level = 'continent';

-- 아시아 주요 국가들 서브메뉴로 설정
UPDATE regions SET 
  show_in_menu = TRUE,
  menu_order = 1,
  menu_group = 'sub'
WHERE id IN ('japan', 'china', 'taiwan', 'hongkong-macau', 'thailand', 'vietnam', 'singapore') 
  AND level = 'country' 
  AND parent_id = 'asia';

-- 5. 호캠스 추가 (독립적인 카테고리)
INSERT IGNORE INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group, menu_color) VALUES
('staycation', '호캠스', NULL, 'continent', 100, TRUE, TRUE, 6, 'main', '#8B5CF6');

-- 호캠스 하위 카테고리
INSERT IGNORE INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group) VALUES
('staycation-hotels', '호텔', 'staycation', 'country', 1, TRUE, TRUE, 1, 'sub'),
('staycation-resorts', '리조트', 'staycation', 'country', 2, TRUE, TRUE, 2, 'sub'),
('staycation-pool-villas', '풀빌라', 'staycation', 'country', 3, TRUE, TRUE, 3, 'sub');

-- 6. 특가할인상품 추가
INSERT IGNORE INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group, menu_color) VALUES
('deals', '특가할인상품', NULL, 'continent', 101, TRUE, TRUE, 7, 'main', '#06B6D4');

-- 특가할인상품 하위 카테고리
INSERT IGNORE INTO regions (id, name, parent_id, level, display_order, is_active, show_in_menu, menu_order, menu_group) VALUES
('deals-early-bird', '얼리버드', 'deals', 'country', 1, TRUE, TRUE, 1, 'sub'),
('deals-exclusive', '독점상품', 'deals', 'country', 2, TRUE, TRUE, 2, 'sub'),
('deals-last-minute', '막판특가', 'deals', 'country', 3, TRUE, TRUE, 3, 'sub');

-- 확인 쿼리 - 메뉴 구조 확인
SELECT 
  CASE 
    WHEN r.level = 'continent' THEN CONCAT('📁 ', r.name)
    WHEN r.level = 'country' THEN CONCAT('  📂 ', r.name)
    WHEN r.level = 'city' THEN CONCAT('    📄 ', r.name)
  END as menu_structure,
  r.menu_group,
  r.menu_order,
  r.menu_color,
  r.show_in_menu
FROM regions r
WHERE r.show_in_menu = TRUE
ORDER BY 
  r.menu_group DESC,
  CASE WHEN r.parent_id IS NULL THEN r.menu_order ELSE 999 END,
  r.parent_id,
  r.menu_order ASC;

-- 간단한 확인
SELECT 
  r.id,
  r.name,
  r.level,
  r.menu_group,
  r.menu_order,
  r.show_in_menu,
  parent.name as parent_name
FROM regions r
LEFT JOIN regions parent ON r.parent_id = parent.id
WHERE r.show_in_menu = TRUE
ORDER BY r.menu_group DESC, r.menu_order ASC; 