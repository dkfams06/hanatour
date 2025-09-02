-- 마일리지 컬럼 추가
ALTER TABLE users ADD COLUMN mileage INT DEFAULT 0;

-- 기존 사용자들에게 기본 마일리지 지급 (테스트용)
UPDATE users SET mileage = 5000 WHERE role = 'customer';
UPDATE users SET mileage = 150000 WHERE email IN ('jeesu282@example.com', 'eunwoo1972@example.com');
