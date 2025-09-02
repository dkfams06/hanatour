-- admin_alerts 테이블 데이터 확인
-- ====================================================================

-- 1. 전체 알림 데이터 확인
SELECT 
  id,
  alert_type,
  reference_id,
  title,
  message,
  is_read,
  created_at
FROM admin_alerts 
ORDER BY created_at DESC 
LIMIT 10;

-- 2. alert_type별 개수 확인
SELECT 
  alert_type,
  COUNT(*) as count
FROM admin_alerts 
GROUP BY alert_type;

-- 3. 최근 1:1 문의 알림 확인
SELECT 
  id,
  alert_type,
  reference_id,
  title,
  message,
  created_at
FROM admin_alerts 
WHERE alert_type = 'inquiry'
ORDER BY created_at DESC 
LIMIT 5;

-- 4. 시스템 타입 알림 확인
SELECT 
  id,
  alert_type,
  reference_id,
  title,
  message,
  created_at
FROM admin_alerts 
WHERE alert_type = 'system'
ORDER BY created_at DESC 
LIMIT 5;
