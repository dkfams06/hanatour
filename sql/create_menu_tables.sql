-- 메뉴 관리 테이블 생성
-- regions 테이블과 분리하여 메뉴는 별도 관리

-- 1. 메뉴 카테고리 테이블 (네비게이션 메뉴용)
CREATE TABLE menu_categories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL COMMENT '메뉴명',
  parent_id VARCHAR(255) DEFAULT NULL COMMENT '상위 메뉴 ID',
  menu_order INT DEFAULT 0 COMMENT '메뉴 순서',
  menu_level ENUM('main', 'sub') DEFAULT 'main' COMMENT '메뉴 레벨',
  menu_color VARCHAR(20) DEFAULT NULL COMMENT '메뉴 컬러',
  menu_icon VARCHAR(100) DEFAULT NULL COMMENT '메뉴 아이콘',
  menu_type ENUM('destination', 'product', 'theme') DEFAULT 'destination' COMMENT '메뉴 타입',
  is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
  show_in_menu BOOLEAN DEFAULT TRUE COMMENT '메뉴 표시 여부',
  href_path VARCHAR(500) DEFAULT NULL COMMENT '링크 경로',
  description TEXT DEFAULT NULL COMMENT '메뉴 설명',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (parent_id) REFERENCES menu_categories(id) ON DELETE SET NULL,
  INDEX idx_parent_id (parent_id),
  INDEX idx_menu_order (menu_order),
  INDEX idx_menu_type (menu_type),
  INDEX idx_active_menu (is_active, show_in_menu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='메뉴 카테고리 테이블';

-- 2. 투어-메뉴 연결 테이블 (다대다 관계)
CREATE TABLE tour_menu_mappings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tour_id VARCHAR(255) NOT NULL,
  menu_category_id VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE COMMENT '주 카테고리 여부',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_category_id) REFERENCES menu_categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_tour_menu (tour_id, menu_category_id),
  INDEX idx_tour_id (tour_id),
  INDEX idx_menu_category_id (menu_category_id),
  INDEX idx_primary_category (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='투어-메뉴 연결 테이블';

-- 3. 기존 메뉴 데이터를 새 테이블로 마이그레이션
INSERT INTO menu_categories (id, name, parent_id, menu_order, menu_level, menu_color, menu_type, href_path) VALUES
-- 메인 메뉴들
('usa-travel', '미국여행', NULL, 1, 'main', '#3B82F6', 'destination', '/tours/destination/usa'),
('canada-americas', '캐나다/중남미', NULL, 2, 'main', '#10B981', 'destination', '/tours/destination/americas'),
('europe-africa', '유럽/아프리카', NULL, 3, 'main', '#10B981', 'destination', '/tours/destination/europe'),
('domestic', '국내', NULL, 4, 'main', '#F59E0B', 'destination', '/tours/destination/domestic'),
('asia-southeast', '아시아/동남아', NULL, 5, 'main', '#EF4444', 'destination', '/tours/destination/asia'),
('staycation', '호캠스', NULL, 6, 'main', '#8B5CF6', 'product', '/tours/product/staycation'),
('deals', '특가할인상품', NULL, 7, 'main', '#06B6D4', 'product', '/tours/product/deals');

-- 미국여행 하위 메뉴
INSERT INTO menu_categories (id, name, parent_id, menu_order, menu_level, menu_type, href_path) VALUES
('usa-east', '동부', 'usa-travel', 1, 'sub', 'destination', '/tours/destination/usa/east'),
('usa-west', '서부', 'usa-travel', 2, 'sub', 'destination', '/tours/destination/usa/west'),
('usa-hawaii', '하와이', 'usa-travel', 3, 'sub', 'destination', '/tours/destination/usa/hawaii'),
('usa-alaska', '알래스카', 'usa-travel', 4, 'sub', 'destination', '/tours/destination/usa/alaska');

-- 캐나다/중남미 하위 메뉴
INSERT INTO menu_categories (id, name, parent_id, menu_order, menu_level, menu_type, href_path) VALUES
('canada', '캐나다', 'canada-americas', 1, 'sub', 'destination', '/tours/destination/canada'),
('mexico', '멕시코', 'canada-americas', 2, 'sub', 'destination', '/tours/destination/mexico'),
('cuba', '쿠바', 'canada-americas', 3, 'sub', 'destination', '/tours/destination/cuba'),
('brazil', '브라질', 'canada-americas', 4, 'sub', 'destination', '/tours/destination/brazil');

-- 유럽/아프리카 하위 메뉴
INSERT INTO menu_categories (id, name, parent_id, menu_order, menu_level, menu_type, href_path) VALUES
('europe-west', '서유럽', 'europe-africa', 1, 'sub', 'destination', '/tours/destination/europe/west'),
('europe-east', '동유럽', 'europe-africa', 2, 'sub', 'destination', '/tours/destination/europe/east'),
('europe-north', '북유럽', 'europe-africa', 3, 'sub', 'destination', '/tours/destination/europe/north'),
('europe-south', '남유럽', 'europe-africa', 4, 'sub', 'destination', '/tours/destination/europe/south'),
('africa', '아프리카', 'europe-africa', 5, 'sub', 'destination', '/tours/destination/africa');

-- 국내 하위 메뉴
INSERT INTO menu_categories (id, name, parent_id, menu_order, menu_level, menu_type, href_path) VALUES
('seoul-metro', '서울/수도권', 'domestic', 1, 'sub', 'destination', '/tours/destination/seoul'),
('gangwon', '강원도', 'domestic', 2, 'sub', 'destination', '/tours/destination/gangwon'),
('chungcheong', '충청도', 'domestic', 3, 'sub', 'destination', '/tours/destination/chungcheong'),
('jeolla', '전라도', 'domestic', 4, 'sub', 'destination', '/tours/destination/jeolla'),
('gyeongsang', '경상도', 'domestic', 5, 'sub', 'destination', '/tours/destination/gyeongsang'),
('jeju', '제주도', 'domestic', 6, 'sub', 'destination', '/tours/destination/jeju');

-- 아시아/동남아 하위 메뉴
INSERT INTO menu_categories (id, name, parent_id, menu_order, menu_level, menu_type, href_path) VALUES
('japan', '일본', 'asia-southeast', 1, 'sub', 'destination', '/tours/destination/japan'),
('china', '중국', 'asia-southeast', 2, 'sub', 'destination', '/tours/destination/china'),
('thailand', '태국', 'asia-southeast', 3, 'sub', 'destination', '/tours/destination/thailand'),
('vietnam', '베트남', 'asia-southeast', 4, 'sub', 'destination', '/tours/destination/vietnam'),
('singapore', '싱가포르', 'asia-southeast', 5, 'sub', 'destination', '/tours/destination/singapore'),
('taiwan', '대만', 'asia-southeast', 6, 'sub', 'destination', '/tours/destination/taiwan'),
('hongkong-macau', '홍콩/마카오', 'asia-southeast', 7, 'sub', 'destination', '/tours/destination/hongkong-macau');

-- 호캠스 하위 메뉴
INSERT INTO menu_categories (id, name, parent_id, menu_order, menu_level, menu_type, href_path) VALUES
('staycation-hotels', '호텔', 'staycation', 1, 'sub', 'product', '/tours/product/staycation/hotels'),
('staycation-resorts', '리조트', 'staycation', 2, 'sub', 'product', '/tours/product/staycation/resorts'),
('staycation-pool-villas', '풀빌라', 'staycation', 3, 'sub', 'product', '/tours/product/staycation/pool-villas');

-- 특가할인상품 하위 메뉴
INSERT INTO menu_categories (id, name, parent_id, menu_order, menu_level, menu_type, href_path) VALUES
('deals-early-bird', '얼리버드', 'deals', 1, 'sub', 'product', '/tours/product/deals/early-bird'),
('deals-exclusive', '독점상품', 'deals', 2, 'sub', 'product', '/tours/product/deals/exclusive'),
('deals-last-minute', '막판특가', 'deals', 3, 'sub', 'product', '/tours/product/deals/last-minute');

-- 4. regions 테이블 정리 (순수 지역 정보만 남김)
-- 메뉴용 가상 지역들 제거
DELETE FROM regions WHERE id IN (
  'usa-menu', 'canada-americas-menu', 'europe-africa-menu', 'asia-menu',
  'staycation', 'deals', 'usa-east', 'usa-west', 'usa-hawaii', 'usa-alaska',
  'canada-sub', 'mexico-sub', 'cuba-sub', 'brazil-sub',
  'europe-west', 'europe-east', 'europe-north', 'europe-south', 'africa-sub',
  'seoul', 'gangwon', 'chungcheong', 'jeolla', 'gyeongsang',
  'staycation-hotels', 'staycation-resorts', 'staycation-pool-villas',
  'deals-early-bird', 'deals-exclusive', 'deals-last-minute'
);

-- regions 테이블에서 메뉴 관련 컬럼 제거
ALTER TABLE regions 
DROP COLUMN IF EXISTS show_in_menu,
DROP COLUMN IF EXISTS menu_order,
DROP COLUMN IF EXISTS menu_group,
DROP COLUMN IF EXISTS menu_icon,
DROP COLUMN IF EXISTS menu_color;

-- 5. 확인 쿼리
-- 메뉴 구조 확인
SELECT 
  CASE 
    WHEN mc.menu_level = 'main' THEN CONCAT('📁 ', mc.name)
    WHEN mc.menu_level = 'sub' THEN CONCAT('  📂 ', mc.name)
  END as menu_structure,
  mc.menu_type,
  mc.menu_order,
  mc.menu_color,
  mc.href_path
FROM menu_categories mc
WHERE mc.is_active = TRUE AND mc.show_in_menu = TRUE
ORDER BY 
  mc.parent_id IS NULL DESC,
  mc.parent_id,
  mc.menu_order ASC;

-- 메뉴 통계
SELECT 
  menu_type,
  menu_level,
  COUNT(*) as count
FROM menu_categories 
WHERE is_active = TRUE AND show_in_menu = TRUE
GROUP BY menu_type, menu_level
ORDER BY menu_type, menu_level; 