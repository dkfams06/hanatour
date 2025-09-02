-- 투어 테이블 인덱스 추가 (성능 향상)
ALTER TABLE tours ADD INDEX idx_region (region);
ALTER TABLE tours ADD INDEX idx_status (status);
ALTER TABLE tours ADD INDEX idx_departureDate (departureDate);
ALTER TABLE tours ADD INDEX idx_price (price);

-- 복합 인덱스 (자주 함께 검색되는 필드)
ALTER TABLE tours ADD INDEX idx_status_region (status, region); 