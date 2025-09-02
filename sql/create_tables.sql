-- 투어 테이블 생성
CREATE TABLE IF NOT EXISTS tours (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL COMMENT '상품명',
  description TEXT NOT NULL COMMENT '상세 설명',
  images JSON COMMENT '이미지 URL 배열',
  mainImage VARCHAR(500) NOT NULL COMMENT '대표 이미지 URL',
  departureDate DATE NOT NULL COMMENT '출발일',
  maxParticipants INT NOT NULL COMMENT '최대 인원',
  currentParticipants INT DEFAULT 0 COMMENT '현재 예약 인원',
  price INT NOT NULL COMMENT '가격',
  included JSON COMMENT '포함사항 배열',
  excluded JSON COMMENT '불포함사항 배열',
  region ENUM('asia', 'europe', 'americas', 'oceania', 'africa', 'domestic') NOT NULL COMMENT '지역',
  status ENUM('published', 'unpublished', 'draft') DEFAULT 'unpublished' COMMENT '게시 상태',
  rating DECIMAL(2,1) DEFAULT 0 COMMENT '평균 평점',
  reviewCount INT DEFAULT 0 COMMENT '리뷰 수',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_region (region),
  INDEX idx_status (status),
  INDEX idx_departureDate (departureDate),
  INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='여행상품 테이블';

-- 사용자 테이블 생성 (인증 관련)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(500),
  isApproved BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 테이블';

-- 예약 테이블 생성
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(255) PRIMARY KEY,
  tourId VARCHAR(255) NOT NULL,
  userId VARCHAR(255) NOT NULL,
  participants INT NOT NULL,
  totalAmount INT NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  customerName VARCHAR(100) NOT NULL,
  customerEmail VARCHAR(255) NOT NULL,
  customerPhone VARCHAR(20) NOT NULL,
  specialRequests TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tourId) REFERENCES tours(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_tourId (tourId),
  INDEX idx_userId (userId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='예약 테이블'; 