-- 현재 regions 테이블 구조 개선
-- 지역과 상품 카테고리를 구분하여 관리

-- 1. 카테고리 타입 컬럼 추가
ALTER TABLE regions 
ADD COLUMN category_type ENUM('destination', 'product_type', 'theme') DEFAULT 'destination' 
COMMENT '카테고리 유형: destination(지역), product_type(상품타입), theme(테마)';

-- 2. 현재 데이터 분류
-- 지역 기반 메뉴들
UPDATE regions SET category_type = 'destination' 
WHERE id IN (
  'usa-menu', 'canada-americas-menu', 'europe-africa-menu', 
  'domestic', 'asia-menu',
  'usa', 'canada', 'mexico', 'cuba', 'brazil',
  'france', 'italy', 'spain', 'germany', 'uk',
  'japan', 'china', 'thailand', 'vietnam', 'singapore', 'taiwan', 'hongkong-macau',
  'korea', 'usa-east', 'usa-west', 'usa-hawaii', 'usa-alaska'
);

-- 상품 타입 메뉴들
UPDATE regions SET category_type = 'product_type' 
WHERE id IN (
  'staycation', 'deals',
  'staycation-hotels', 'staycation-resorts', 'staycation-pool-villas',
  'deals-early-bird', 'deals-exclusive', 'deals-last-minute'
);

-- 3. tours 테이블에 카테고리 관계 컬럼 추가
ALTER TABLE tours 
ADD COLUMN destination_id VARCHAR(255) COMMENT '실제 여행 목적지',
ADD COLUMN product_category_ids JSON COMMENT '상품 카테고리 ID 배열',
ADD COLUMN theme_category_ids JSON COMMENT '테마 카테고리 ID 배열';

-- 기존 컬럼과의 매핑을 위한 인덱스
ALTER TABLE tours ADD INDEX idx_destination (destination_id);
ALTER TABLE tours ADD INDEX idx_product_categories ((CAST(product_category_ids AS CHAR(255)) ARRAY));

-- 4. 확인 쿼리
SELECT 
  category_type,
  COUNT(*) as count,
  GROUP_CONCAT(name) as examples
FROM regions 
WHERE show_in_menu = TRUE
GROUP BY category_type;

-- 5. 메뉴 구조 확인
SELECT 
  r.name,
  r.level,
  r.category_type,
  r.menu_group,
  r.menu_order,
  parent.name as parent_name
FROM regions r
LEFT JOIN regions parent ON r.parent_id = parent.id
WHERE r.show_in_menu = TRUE
ORDER BY r.category_type, r.menu_order ASC; 