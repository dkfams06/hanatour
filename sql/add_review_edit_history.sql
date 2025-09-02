-- 후기 수정 이력 추적을 위한 컬럼 추가
ALTER TABLE reviews 
ADD COLUMN editedBy VARCHAR(255) NULL COMMENT '수정한 관리자 ID',
ADD COLUMN editReason TEXT NULL COMMENT '수정 사유',
ADD COLUMN originalContent TEXT NULL COMMENT '원본 내용 (수정 시 백업)',
ADD COLUMN originalRating INT NULL COMMENT '원본 별점 (수정 시 백업)',
ADD COLUMN editCount INT DEFAULT 0 COMMENT '수정 횟수';

-- 후기 수정 이력 테이블 생성 (선택사항 - 상세 이력이 필요한 경우)
CREATE TABLE IF NOT EXISTS review_edit_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reviewId INT NOT NULL,
  editedBy VARCHAR(255) NOT NULL COMMENT '수정한 관리자 ID',
  editReason TEXT NULL COMMENT '수정 사유',
  oldContent TEXT NULL COMMENT '수정 전 내용',
  newContent TEXT NOT NULL COMMENT '수정 후 내용',
  oldRating INT NULL COMMENT '수정 전 별점',
  newRating INT NOT NULL COMMENT '수정 후 별점',
  editedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_review_id (reviewId),
  INDEX idx_edited_at (editedAt),
  FOREIGN KEY (reviewId) REFERENCES reviews(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='후기 수정 이력';

-- 기존 후기들의 수정 횟수를 0으로 초기화
UPDATE reviews SET editCount = 0 WHERE editCount IS NULL;
