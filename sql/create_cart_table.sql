-- 장바구니 테이블 생성
CREATE TABLE IF NOT EXISTS `cart` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) DEFAULT NULL,
  `sessionId` varchar(255) DEFAULT NULL,
  `tourId` varchar(36) NOT NULL,
  `tourTitle` varchar(255) NOT NULL,
  `mainImage` varchar(255) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `departureDate` date NOT NULL,
  `participants` int(11) NOT NULL DEFAULT 1,
  `customerName` varchar(100) DEFAULT NULL,
  `customerPhone` varchar(20) DEFAULT NULL,
  `customerEmail` varchar(100) DEFAULT NULL,
  `specialRequests` text DEFAULT NULL,
  `totalAmount` int(11) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_sessionId` (`sessionId`),
  KEY `idx_tourId` (`tourId`),
  KEY `idx_createdAt` (`createdAt`),
  FOREIGN KEY (`tourId`) REFERENCES `tours`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- 인덱스 추가 (성능 최적화)
CREATE INDEX `idx_cart_user_session` ON `cart` (`userId`, `sessionId`);
CREATE INDEX `idx_cart_tour_user` ON `cart` (`tourId`, `userId`);

-- 장바구니 정리 이벤트 (30일 이상 된 비로그인 사용자 장바구니 삭제)
-- 실제 운영시에는 스케줄러나 크론잡으로 실행
-- DELETE FROM cart WHERE userId IS NULL AND createdAt < DATE_SUB(NOW(), INTERVAL 30 DAY);