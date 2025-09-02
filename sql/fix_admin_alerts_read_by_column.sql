-- admin_alerts 테이블의 read_by 컬럼 타입 수정
-- INT에서 VARCHAR(255)로 변경하여 UUID 저장 가능하도록 수정

ALTER TABLE admin_alerts 
MODIFY COLUMN read_by VARCHAR(255) NULL COMMENT '읽은 관리자 ID (UUID)';

-- 변경사항 확인
DESCRIBE admin_alerts;
