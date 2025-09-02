-- regions 테이블에 메뉴 관리용 컬럼 추가

ALTER TABLE regions 
ADD COLUMN show_in_menu BOOLEAN DEFAULT FALSE COMMENT '메뉴에 표시 여부',
ADD COLUMN menu_order INT DEFAULT 0 COMMENT '메뉴 표시 순서',
ADD COLUMN menu_group VARCHAR(50) DEFAULT NULL COMMENT '메뉴 그룹 (예: main, sub)',
ADD COLUMN menu_icon VARCHAR(100) DEFAULT NULL COMMENT '메뉴 아이콘 클래스',
ADD COLUMN menu_color VARCHAR(20) DEFAULT NULL COMMENT '메뉴 컬러';

-- 기본 메뉴 설정 (주요 지역들을 메뉴에 표시)
UPDATE regions SET 
  show_in_menu = TRUE, 
  menu_order = 1, 
  menu_group = 'main',
  menu_color = '#3B82F6'
WHERE id = 'americas' AND level = 'continent';

UPDATE regions SET 
  show_in_menu = TRUE, 
  menu_order = 2, 
  menu_group = 'main',
  menu_color = '#10B981'
WHERE id = 'europe' AND level = 'continent';

UPDATE regions SET 
  show_in_menu = TRUE, 
  menu_order = 3, 
  menu_group = 'main',
  menu_color = '#F59E0B'
WHERE id = 'asia' AND level = 'continent';

UPDATE regions SET 
  show_in_menu = TRUE, 
  menu_order = 4, 
  menu_group = 'main',
  menu_color = '#EF4444'
WHERE id = 'oceania' AND level = 'continent';

UPDATE regions SET 
  show_in_menu = TRUE, 
  menu_order = 5, 
  menu_group = 'main',
  menu_color = '#8B5CF6'
WHERE id = 'africa' AND level = 'continent';

UPDATE regions SET 
  show_in_menu = TRUE, 
  menu_order = 6, 
  menu_group = 'main',
  menu_color = '#06B6D4'
WHERE id = 'domestic' AND level = 'continent';

-- 주요 국가들도 서브메뉴로 표시
UPDATE regions SET 
  show_in_menu = TRUE, 
  menu_order = 1, 
  menu_group = 'sub'
WHERE id IN ('usa', 'canada', 'mexico') AND level = 'country';

UPDATE regions SET 
  show_in_menu = TRUE, 
  menu_order = 1, 
  menu_group = 'sub'
WHERE id IN ('france', 'italy', 'spain', 'germany', 'uk') AND level = 'country';

UPDATE regions SET 
  show_in_menu = TRUE, 
  menu_order = 1, 
  menu_group = 'sub'
WHERE id IN ('japan', 'china', 'thailand', 'vietnam', 'singapore') AND level = 'country';

UPDATE regions SET 
  show_in_menu = TRUE, 
  menu_order = 1, 
  menu_group = 'sub'
WHERE id IN ('australia', 'new-zealand') AND level = 'country';

UPDATE regions SET 
  show_in_menu = TRUE, 
  menu_order = 1, 
  menu_group = 'sub'
WHERE id IN ('south-africa', 'egypt', 'morocco') AND level = 'country';

-- 확인 쿼리
-- SELECT * FROM regions WHERE show_in_menu = TRUE ORDER BY level, menu_order, display_order; 