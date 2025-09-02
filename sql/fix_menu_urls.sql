-- 메뉴 카테고리 URL을 기존 페이지 구조에 맞게 수정
-- /tours/destination/... → /tours/region/... 로 변경

UPDATE menu_categories 
SET href_path = REPLACE(href_path, '/tours/destination/', '/tours/region/')
WHERE href_path LIKE '/tours/destination/%';

-- 개별 수정이 필요한 항목들 (기존 페이지 구조에 맞게)

-- 미국 관련
UPDATE menu_categories SET href_path = '/tours/region/usa' WHERE id = 'usa-travel';
UPDATE menu_categories SET href_path = '/tours/region/usa/east' WHERE id = 'usa-east';
UPDATE menu_categories SET href_path = '/tours/region/usa/west' WHERE id = 'usa-west';
UPDATE menu_categories SET href_path = '/tours/region/usa/hawaii' WHERE id = 'hawaii';
UPDATE menu_categories SET href_path = '/tours/region/usa/alaska' WHERE id = 'alaska';

-- 유럽 관련  
UPDATE menu_categories SET href_path = '/tours/region/europe' WHERE id = 'europe-africa';
UPDATE menu_categories SET href_path = '/tours/region/europe/east' WHERE id = 'europe-east';
UPDATE menu_categories SET href_path = '/tours/region/europe/west' WHERE id = 'europe-west';
UPDATE menu_categories SET href_path = '/tours/region/europe/north' WHERE id = 'europe-north';
UPDATE menu_categories SET href_path = '/tours/region/europe/south' WHERE id = 'europe-south';

-- 아시아 관련
UPDATE menu_categories SET href_path = '/tours/region/japan' WHERE id = 'japan';
UPDATE menu_categories SET href_path = '/tours/region/china' WHERE id = 'china';
UPDATE menu_categories SET href_path = '/tours/region/taiwan' WHERE id = 'taiwan';
UPDATE menu_categories SET href_path = '/tours/region/thailand' WHERE id = 'thailand';
UPDATE menu_categories SET href_path = '/tours/region/vietnam' WHERE id = 'vietnam';
UPDATE menu_categories SET href_path = '/tours/region/singapore' WHERE id = 'singapore';
UPDATE menu_categories SET href_path = '/tours/region/hongkong-macau' WHERE id = 'hongkong-macau';

-- 아메리카 관련
UPDATE menu_categories SET href_path = '/tours/region/canada' WHERE id = 'canada';
UPDATE menu_categories SET href_path = '/tours/region/mexico' WHERE id = 'mexico';
UPDATE menu_categories SET href_path = '/tours/region/cuba' WHERE id = 'cuba';
UPDATE menu_categories SET href_path = '/tours/region/brazil' WHERE id = 'brazil';

-- 스테이케이션 관련
UPDATE menu_categories SET href_path = '/tours/region/staycation' WHERE id = 'staycation';
UPDATE menu_categories SET href_path = '/tours/region/staycation/hotels' WHERE id = 'staycation-hotels';
UPDATE menu_categories SET href_path = '/tours/region/staycation/resorts' WHERE id = 'staycation-resorts';
UPDATE menu_categories SET href_path = '/tours/region/staycation/pool-villas' WHERE id = 'staycation-pool-villas';

-- 확인용 쿼리
SELECT id, name, href_path 
FROM menu_categories 
WHERE href_path IS NOT NULL 
ORDER BY menu_level, menu_order; 