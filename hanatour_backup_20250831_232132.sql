/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.0.2-MariaDB, for osx10.20 (arm64)
--
-- Host: localhost    Database: hanatour_db
-- ------------------------------------------------------
-- Server version	12.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `access_logs`
--

DROP TABLE IF EXISTS `access_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `access_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) DEFAULT NULL,
  `action` varchar(50) NOT NULL COMMENT 'login, logout, failed_login, session_expired',
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `device` varchar(20) DEFAULT NULL COMMENT 'desktop, mobile, tablet, unknown',
  `location` varchar(100) DEFAULT NULL COMMENT 'IP 기반 위치 정보',
  `status` varchar(20) DEFAULT 'success' COMMENT 'success, failed, blocked',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_access_logs_user_id` (`user_id`),
  KEY `idx_access_logs_action` (`action`),
  KEY `idx_access_logs_created_at` (`created_at`),
  KEY `idx_access_logs_ip_address` (`ip_address`),
  KEY `idx_access_logs_device` (`device`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_logs`
--

LOCK TABLES `access_logs` WRITE;
/*!40000 ALTER TABLE `access_logs` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `access_logs` VALUES
(5,'febda45a-9339-4401-b9f9-f2449063785b','login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop',NULL,'success','2025-08-12 07:08:36'),
(6,'febda45a-9339-4401-b9f9-f2449063785b','logout','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop',NULL,'success','2025-08-12 07:09:09'),
(7,'febda45a-9339-4401-b9f9-f2449063785b','login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop',NULL,'success','2025-08-12 07:09:18'),
(8,'febda45a-9339-4401-b9f9-f2449063785b','logout','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop',NULL,'success','2025-08-12 07:17:42'),
(9,'febda45a-9339-4401-b9f9-f2449063785b','login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop',NULL,'success','2025-08-12 07:17:50'),
(10,'febda45a-9339-4401-b9f9-f2449063785b','login','220.118.36.60','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop',NULL,'success','2025-08-12 07:32:32'),
(11,'febda45a-9339-4401-b9f9-f2449063785b','logout','220.118.36.60','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop',NULL,'success','2025-08-12 07:32:42'),
(12,'febda45a-9339-4401-b9f9-f2449063785b','login','220.118.36.60','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop',NULL,'success','2025-08-12 07:32:45'),
(13,'febda45a-9339-4401-b9f9-f2449063785b','logout','211.37.104.71','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36','desktop',NULL,'success','2025-08-12 08:34:38'),
(14,'febda45a-9339-4401-b9f9-f2449063785b','login','211.37.104.71','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36','desktop',NULL,'success','2025-08-12 08:34:42'),
(15,'febda45a-9339-4401-b9f9-f2449063785b','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-12 08:45:52'),
(16,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-12 08:46:02'),
(17,'febda45a-9339-4401-b9f9-f2449063785b','login','211.234.227.33','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1 KAKAOTALK/25.6.6 (INAPP)','mobile','위치 정보 조회 실패','success','2025-08-12 09:11:06'),
(18,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','162.216.123.83','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-12 09:29:27'),
(19,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-14 03:07:41'),
(20,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-14 09:10:50'),
(21,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-14 09:10:56'),
(22,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-14 09:11:10'),
(23,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-14 09:11:22'),
(24,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-14 09:11:28'),
(25,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-14 09:11:33'),
(26,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-14 09:11:43'),
(27,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-14 09:15:07'),
(28,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-14 09:17:38'),
(29,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-14 09:18:18'),
(30,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-14 09:18:18'),
(31,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-14 09:21:41'),
(32,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-14 09:22:09'),
(33,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','61.78.159.162','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Whale/4.33.325.17 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-18 03:20:55'),
(34,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-18 08:03:44'),
(35,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-18 08:06:47'),
(36,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-19 00:42:49'),
(37,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-19 00:45:03'),
(38,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-19 00:46:00'),
(39,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','54.180.6.80','Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/22G86 Safari/604.1','mobile','위치 정보 조회 실패','success','2025-08-19 00:47:12'),
(40,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-19 01:27:00'),
(41,'93b59fa5-d9f7-47da-9883-df6062645cd1','failed_login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','failed','2025-08-19 01:27:07'),
(42,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-19 01:27:09'),
(43,'93b59fa5-d9f7-47da-9883-df6062645cd1','logout','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-19 01:39:23'),
(44,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-19 01:39:33'),
(45,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-19 01:40:26'),
(46,'93b59fa5-d9f7-47da-9883-df6062645cd1','failed_login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','failed','2025-08-19 01:40:36'),
(47,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-19 01:40:39'),
(48,'93b59fa5-d9f7-47da-9883-df6062645cd1','logout','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-19 01:40:59'),
(49,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-19 01:41:05'),
(50,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-19 01:46:37'),
(51,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-19 01:46:49'),
(52,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-19 01:46:50'),
(53,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-19 01:46:51'),
(54,'93b59fa5-d9f7-47da-9883-df6062645cd1','logout','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-19 01:47:31'),
(55,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-19 01:47:42'),
(56,'93b59fa5-d9f7-47da-9883-df6062645cd1','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-19 01:50:46'),
(57,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-19 01:50:57'),
(58,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-19 01:56:57'),
(59,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-19 01:57:04'),
(60,'febda45a-9339-4401-b9f9-f2449063785b','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 02:49:15'),
(61,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 03:00:14'),
(62,'febda45a-9339-4401-b9f9-f2449063785b','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 03:08:36'),
(63,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 03:11:19'),
(64,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 04:35:20'),
(65,'febda45a-9339-4401-b9f9-f2449063785b','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 05:16:37'),
(66,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 05:16:49'),
(67,'febda45a-9339-4401-b9f9-f2449063785b','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 05:21:34'),
(68,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 05:21:57'),
(69,'febda45a-9339-4401-b9f9-f2449063785b','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 05:22:12'),
(70,'199272ee-5a0b-44e9-b821-ef7666728088','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 05:22:19'),
(71,'199272ee-5a0b-44e9-b821-ef7666728088','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 05:23:21'),
(72,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 05:24:30'),
(73,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-19 05:39:00'),
(74,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 00:12:22'),
(75,'93b59fa5-d9f7-47da-9883-df6062645cd1','failed_login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','failed','2025-08-20 00:12:28'),
(76,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 00:12:30'),
(77,'93b59fa5-d9f7-47da-9883-df6062645cd1','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-20 00:15:58'),
(78,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-20 00:16:44'),
(79,'93b59fa5-d9f7-47da-9883-df6062645cd1','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-20 00:18:15'),
(80,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','success','2025-08-20 00:18:24'),
(81,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','203.145.94.41','Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.7258.94 Mobile Safari/537.36','mobile','위치 정보 조회 실패','success','2025-08-20 00:23:18'),
(82,'93b59fa5-d9f7-47da-9883-df6062645cd1','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 00:26:09'),
(83,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 00:26:17'),
(84,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 00:27:16'),
(85,'93b59fa5-d9f7-47da-9883-df6062645cd1','failed_login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','failed','2025-08-20 00:27:21'),
(86,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 00:27:23'),
(87,'93b59fa5-d9f7-47da-9883-df6062645cd1','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 00:40:23'),
(88,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 00:40:33'),
(89,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 00:41:07'),
(90,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 00:41:19'),
(91,'93b59fa5-d9f7-47da-9883-df6062645cd1','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 00:43:36'),
(92,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 00:43:41'),
(93,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 01:05:19'),
(94,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 01:05:24'),
(95,'febda45a-9339-4401-b9f9-f2449063785b','login','211.37.104.71','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 01:13:14'),
(96,'93b59fa5-d9f7-47da-9883-df6062645cd1','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 01:17:22'),
(97,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 01:17:26'),
(98,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 01:23:06'),
(99,'93b59fa5-d9f7-47da-9883-df6062645cd1','failed_login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','failed','2025-08-20 01:23:13'),
(100,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 01:23:15'),
(101,'febda45a-9339-4401-b9f9-f2449063785b','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 01:34:18'),
(102,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 01:34:25'),
(103,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 02:46:27'),
(104,'febda45a-9339-4401-b9f9-f2449063785b','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 07:49:12'),
(105,'199272ee-5a0b-44e9-b821-ef7666728088','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 07:49:21'),
(106,'199272ee-5a0b-44e9-b821-ef7666728088','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 08:01:05'),
(107,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 08:01:24'),
(108,'febda45a-9339-4401-b9f9-f2449063785b','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 08:01:35'),
(109,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 08:01:44'),
(110,'febda45a-9339-4401-b9f9-f2449063785b','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 08:01:52'),
(111,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 08:02:06'),
(112,'febda45a-9339-4401-b9f9-f2449063785b','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 08:02:22'),
(113,'199272ee-5a0b-44e9-b821-ef7666728088','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 08:02:32'),
(114,'199272ee-5a0b-44e9-b821-ef7666728088','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 08:10:04'),
(115,'febda45a-9339-4401-b9f9-f2449063785b','failed_login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','failed','2025-08-20 08:11:15'),
(116,'febda45a-9339-4401-b9f9-f2449063785b','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-20 08:11:27'),
(117,'93b59fa5-d9f7-47da-9883-df6062645cd1','logout','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 08:46:58'),
(118,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-20 08:47:01'),
(119,'febda45a-9339-4401-b9f9-f2449063785b','login','211.234.188.114','Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/139.0.7258.76 Mobile/15E148 Safari/604.1','mobile','위치 정보 조회 실패','success','2025-08-21 02:57:19'),
(120,'93b59fa5-d9f7-47da-9883-df6062645cd1','logout','52.78.3.167','Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/22G86 Safari/604.1','mobile','위치 정보 조회 실패','success','2025-08-22 00:04:28'),
(121,'93b59fa5-d9f7-47da-9883-df6062645cd1','login','52.78.3.167','Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/22G86 Safari/604.1','mobile','위치 정보 조회 실패','success','2025-08-22 00:04:36'),
(122,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','logout','61.78.159.162','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Whale/4.33.325.17 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-22 07:25:39'),
(123,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','login','61.78.159.162','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Whale/4.33.325.17 Safari/537.36','desktop','위치 정보 조회 실패','success','2025-08-22 07:26:31'),
(124,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-30 17:54:30'),
(125,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-30 18:07:09'),
(126,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-30 18:07:19'),
(127,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-30 19:28:48'),
(128,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','logout','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-30 19:32:01'),
(129,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-30 19:32:06'),
(130,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-30 19:51:38'),
(131,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-30 19:54:00'),
(132,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-31 01:38:10'),
(133,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-31 01:41:08'),
(134,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-31 01:44:08'),
(135,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-31 01:50:49'),
(136,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','login','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','success','2025-08-31 14:13:49');
/*!40000 ALTER TABLE `access_logs` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `active_sessions`
--

DROP TABLE IF EXISTS `active_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `active_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `device` varchar(20) DEFAULT NULL COMMENT 'desktop, mobile, tablet, unknown',
  `location` varchar(100) DEFAULT NULL COMMENT 'IP 기반 위치 정보',
  `login_time` timestamp NULL DEFAULT current_timestamp(),
  `last_activity` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token` (`session_token`),
  KEY `idx_active_sessions_user_id` (`user_id`),
  KEY `idx_active_sessions_token` (`session_token`),
  KEY `idx_active_sessions_is_active` (`is_active`),
  KEY `idx_active_sessions_last_activity` (`last_activity`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `active_sessions`
--

LOCK TABLES `active_sessions` WRITE;
/*!40000 ALTER TABLE `active_sessions` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `active_sessions` VALUES
(3,'febda45a-9339-4401-b9f9-f2449063785b','mfhl65bi6qme87a07n','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop',NULL,'2025-08-12 07:08:36','2025-08-12 07:09:09',0,NULL),
(4,'febda45a-9339-4401-b9f9-f2449063785b','47tfiz6c4ocme87awrm','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop',NULL,'2025-08-12 07:09:18','2025-08-12 07:17:42',0,NULL),
(5,'febda45a-9339-4401-b9f9-f2449063785b','kya9z98nv5me87lw45','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop',NULL,'2025-08-12 07:17:50','2025-08-12 07:32:42',0,NULL),
(6,'febda45a-9339-4401-b9f9-f2449063785b','lebau2nu2ime884se0','220.118.36.60','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop',NULL,'2025-08-12 07:32:32','2025-08-12 07:32:42',0,NULL),
(7,'febda45a-9339-4401-b9f9-f2449063785b','t7wo3op86zme88523j','220.118.36.60','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop',NULL,'2025-08-12 07:32:45','2025-08-12 08:34:38',0,NULL),
(8,'febda45a-9339-4401-b9f9-f2449063785b','tvhcmes3mpme8acq6c','211.37.104.71','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36','desktop',NULL,'2025-08-12 08:34:42','2025-08-12 08:45:52',0,NULL),
(9,'febda45a-9339-4401-b9f9-f2449063785b','fj1rv4i1tcme8arb9p','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-12 08:46:02','2025-08-19 02:49:15',0,NULL),
(10,'febda45a-9339-4401-b9f9-f2449063785b','e1o2jbqs3wme8bnjul','211.234.227.33','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1 KAKAOTALK/25.6.6 (INAPP)','mobile','위치 정보 조회 실패','2025-08-12 09:11:06','2025-08-19 02:49:15',0,NULL),
(11,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','gnam877wordme8cb55e','162.216.123.83','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-12 09:29:27','2025-08-14 09:10:50',0,NULL),
(12,'febda45a-9339-4401-b9f9-f2449063785b','4wfgob52prmeatjvo1','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-14 03:07:41','2025-08-19 02:49:15',0,NULL),
(13,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','0ydv2kzhkxlkmeb6j0zc','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-14 09:10:56','2025-08-14 09:11:10',0,NULL),
(14,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','e2bwt2bas8hmeb6jl5w','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-14 09:11:22','2025-08-14 09:11:28',0,NULL),
(15,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','yyyixmyddj9meb6jti6','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-14 09:11:33','2025-08-14 09:17:38',0,NULL),
(16,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','29uvh840z1smeb6k1m5','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-14 09:11:43','2025-08-14 09:17:38',0,NULL),
(17,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','1y5322k2u4lmeb6oekn','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-14 09:15:07','2025-08-14 09:17:38',0,NULL),
(18,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','hm5ccd2ygw5meb6wva7','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-14 09:21:41','2025-08-19 00:42:49',0,NULL),
(19,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','thzzi1lqlwmeb6xghx','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-14 09:22:09','2025-08-19 00:42:49',0,NULL),
(20,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','mbt6xqzsz4megjsb6s','61.78.159.162','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Whale/4.33.325.17 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-18 03:20:55','2025-08-19 00:42:49',0,NULL),
(21,'febda45a-9339-4401-b9f9-f2449063785b','h16zia9bce4megtw0mj','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-18 08:03:44','2025-08-19 02:49:15',0,NULL),
(22,'febda45a-9339-4401-b9f9-f2449063785b','mb0s3s6h9kmegtzxts','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-18 08:06:47','2025-08-19 02:49:15',0,NULL),
(23,'93b59fa5-d9f7-47da-9883-df6062645cd1','0nv8e1hf7k1imehtnq96','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-19 00:45:03','2025-08-19 01:39:23',0,NULL),
(24,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','2059nll7vbcmehtoxp4','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-19 00:46:00','2025-08-19 01:27:00',0,NULL),
(25,'93b59fa5-d9f7-47da-9883-df6062645cd1','a2v4p97bl5imehtqhqq','54.180.6.80','Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/22G86 Safari/604.1','mobile','위치 정보 조회 실패','2025-08-19 00:47:12','2025-08-19 01:39:23',0,NULL),
(26,'93b59fa5-d9f7-47da-9883-df6062645cd1','a7wocyv89u4mehv5uxv','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-19 01:27:09','2025-08-19 01:39:23',0,NULL),
(27,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','c6dgfifjaqomehvltid','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-19 01:39:33','2025-08-19 01:40:26',0,NULL),
(28,'93b59fa5-d9f7-47da-9883-df6062645cd1','w02jdegyaamehvn81f','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-19 01:40:39','2025-08-19 01:40:59',0,NULL),
(29,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','re2kqyutifqmehvns1h','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-19 01:41:05','2025-08-19 01:46:37',0,NULL),
(30,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','9fndsf65urgmehvv5jv','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-19 01:46:49','2025-08-19 01:56:57',0,NULL),
(31,'93b59fa5-d9f7-47da-9883-df6062645cd1','upr33agua7amehvv65j','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-19 01:46:50','2025-08-19 01:47:31',0,NULL),
(32,'93b59fa5-d9f7-47da-9883-df6062645cd1','i30q9xpyl7omehvv7ei','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-19 01:46:51','2025-08-19 01:47:31',0,NULL),
(33,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','mxk9ogrxywmehvwac0','103.115.140.15','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-19 01:47:42','2025-08-19 01:56:57',0,NULL),
(34,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','5arbhj4v0q6mehw0h9l','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-19 01:50:57','2025-08-19 01:56:57',0,NULL),
(35,'93b59fa5-d9f7-47da-9883-df6062645cd1','h5qq3kwgjrjmehw8c0r','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-19 01:57:04','2025-08-20 00:15:58',0,NULL),
(36,'febda45a-9339-4401-b9f9-f2449063785b','2jagq7actd2mehyhk8m','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-19 03:00:14','2025-08-19 03:08:36',0,NULL),
(37,'febda45a-9339-4401-b9f9-f2449063785b','pnck9s7stmnmehyvt5a','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-19 03:11:19','2025-08-19 05:16:37',0,NULL),
(38,'febda45a-9339-4401-b9f9-f2449063785b','k7au913j68mei1vve9','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-19 04:35:20','2025-08-19 05:16:37',0,NULL),
(39,'febda45a-9339-4401-b9f9-f2449063785b','jrig2d2ogzsmei3d7sg','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-19 05:16:49','2025-08-19 05:21:34',0,NULL),
(40,'febda45a-9339-4401-b9f9-f2449063785b','271t5shv9utmei3jrjx','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-19 05:21:57','2025-08-19 05:22:12',0,NULL),
(42,'febda45a-9339-4401-b9f9-f2449063785b','zozaealnplmei3n25l','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-19 05:24:30','2025-08-20 01:34:18',0,NULL),
(43,'febda45a-9339-4401-b9f9-f2449063785b','9gl0frjy52jmei45qgw','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-19 05:39:00','2025-08-20 01:34:18',0,NULL),
(44,'93b59fa5-d9f7-47da-9883-df6062645cd1','v1t4pmbcq1mej7xpw5','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-20 00:12:30','2025-08-20 00:15:58',0,NULL),
(45,'93b59fa5-d9f7-47da-9883-df6062645cd1','wilxub322mej835ph','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-20 00:16:44','2025-08-20 00:18:15',0,NULL),
(46,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','ngpm3prassmej85asr','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','desktop','위치 정보 조회 실패','2025-08-20 00:18:24','2025-08-20 00:27:16',0,NULL),
(47,'93b59fa5-d9f7-47da-9883-df6062645cd1','2nkdszirevmej8blt1','203.145.94.41','Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.7258.94 Mobile Safari/537.36','mobile','위치 정보 조회 실패','2025-08-20 00:23:18','2025-08-20 00:26:09',0,NULL),
(48,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','umqz12e8i1mej8fftl','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-20 00:26:17','2025-08-20 00:27:16',0,NULL),
(49,'93b59fa5-d9f7-47da-9883-df6062645cd1','e9pgil0ab47mej8guoq','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-20 00:27:23','2025-08-20 00:40:23',0,NULL),
(50,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','3rz148o1mltmej8xs7s','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-20 00:40:33','2025-08-20 00:41:07',0,NULL),
(51,'93b59fa5-d9f7-47da-9883-df6062645cd1','gc6dm3d53hmej8yrk0','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-20 00:41:19','2025-08-20 00:43:36',0,NULL),
(52,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','iodumpov39fmej91tnd','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-20 00:43:41','2025-08-20 01:05:19',0,NULL),
(53,'93b59fa5-d9f7-47da-9883-df6062645cd1','40vtb1t3tcvmej9tr1c','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-20 01:05:24','2025-08-20 01:17:22',0,NULL),
(54,'febda45a-9339-4401-b9f9-f2449063785b','2e8thtntcxtmeja3tix','211.37.104.71','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-20 01:13:14','2025-08-20 01:34:18',0,NULL),
(55,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','7evtgvmjh0imeja97vi','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-20 01:17:26','2025-08-20 01:23:06',0,NULL),
(56,'93b59fa5-d9f7-47da-9883-df6062645cd1','zam2m7e0w0bmejagplp','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-20 01:23:15','2025-08-20 08:46:58',0,NULL),
(57,'febda45a-9339-4401-b9f9-f2449063785b','9lpiqim3fxgmejav2f4','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-20 01:34:25','2025-08-20 07:49:12',0,NULL),
(58,'febda45a-9339-4401-b9f9-f2449063785b','6tkya4jtxw8mejdfpat','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-20 02:46:27','2025-08-20 07:49:12',0,NULL),
(60,'febda45a-9339-4401-b9f9-f2449063785b','3pdfznrma66mejoopz2','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-20 08:01:24','2025-08-20 08:01:35',0,NULL),
(61,'febda45a-9339-4401-b9f9-f2449063785b','in34bndql8mejop5g0','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-20 08:01:44','2025-08-20 08:01:52',0,NULL),
(62,'febda45a-9339-4401-b9f9-f2449063785b','7251ubstml3mejopmns','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-20 08:02:06','2025-08-20 08:02:22',0,NULL),
(64,'febda45a-9339-4401-b9f9-f2449063785b','ta37ilvs6jjmejp1nj6','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-20 08:11:27','2025-08-20 08:11:27',1,NULL),
(65,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','mraumcqvh28mejqbdtu','103.182.123.11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-20 08:47:01','2025-08-22 07:25:39',0,NULL),
(66,'febda45a-9339-4401-b9f9-f2449063785b','ik14j11laumekt9ima','211.234.188.114','Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/139.0.7258.76 Mobile/15E148 Safari/604.1','mobile','위치 정보 조회 실패','2025-08-21 02:57:19','2025-08-21 02:57:19',1,NULL),
(67,'93b59fa5-d9f7-47da-9883-df6062645cd1','p3jc5xe5urgmem2j9q9','52.78.3.167','Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/22G86 Safari/604.1','mobile','위치 정보 조회 실패','2025-08-22 00:04:36','2025-08-22 00:04:36',1,NULL),
(68,'68193827-20f3-4c85-a8f1-ac3a4b5feffe','oh81fcc16ubmemibkar','61.78.159.162','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Whale/4.33.325.17 Safari/537.36','desktop','위치 정보 조회 실패','2025-08-22 07:26:31','2025-08-22 07:26:31',1,NULL),
(69,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','lmpijwhsg1meyk9z74','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-30 17:54:30','2025-08-30 18:07:09',0,NULL),
(70,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','gbzh3lgzbromeykqgsl','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-30 18:07:19','2025-08-30 19:32:01',0,NULL),
(71,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','f33oa6hh64vmeynn8qw','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-30 19:28:48','2025-08-30 19:32:01',0,NULL),
(72,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','7jdthj4jggkmeynrhu1','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-30 19:32:06','2025-08-30 19:32:06',1,NULL),
(73,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','0b6z8o9qcwqgmeyogm7g','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-30 19:51:38','2025-08-30 19:51:38',1,NULL),
(74,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','phqzi9t22qomeyojnqy','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-30 19:54:00','2025-08-30 19:54:00',1,NULL),
(75,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','6y21d1m5b66mez0u978','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-31 01:38:10','2025-08-31 01:38:10',1,NULL),
(76,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','vp4uw06b63smez0y2ce','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-31 01:41:08','2025-08-31 01:41:08',1,NULL),
(77,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','cdd13p8s4pgmez11x5s','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-31 01:44:08','2025-08-31 01:44:08',1,NULL),
(78,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','8kch74hi3p6mez1aiw1','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-31 01:50:49','2025-08-31 01:50:49',1,NULL),
(79,'40ec318c-85ca-11f0-bc84-9e5b0e551c7d','bnqgadj2zf7mezru18y','unknown','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','desktop','로컬 접속','2025-08-31 14:13:49','2025-08-31 14:13:49',1,NULL);
/*!40000 ALTER TABLE `active_sessions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `admin_alerts`
--

DROP TABLE IF EXISTS `admin_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_alerts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alert_type` enum('review','application','booking','inquiry','system') NOT NULL,
  `reference_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_by` varchar(255) DEFAULT NULL COMMENT '읽은 관리자 ID (UUID)',
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_alert` (`alert_type`,`reference_id`),
  KEY `idx_alert_type` (`alert_type`),
  KEY `idx_reference_id` (`reference_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_alerts`
--

LOCK TABLES `admin_alerts` WRITE;
/*!40000 ALTER TABLE `admin_alerts` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `admin_alerts` VALUES
(1,'booking','66a48c67-5ba7-41df-8258-35663adfe452','새로운 예약이 들어왔습니다','새로운 예약이 들어왔습니다. 예약번호: HT202508196982, 고객: 테스트 고객, 상품: 일본 오사카 3박4일 벚꽃여행',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-19 05:44:18','2025-08-19 05:38:14','2025-08-19 05:44:18'),
(2,'booking','00864fc7-0d6d-43ed-a04b-9de6d096f0f5','새로운 예약이 들어왔습니다','새로운 예약이 들어왔습니다. 확인해주세요.',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-19 05:44:22','2025-08-19 05:44:22','2025-08-19 05:44:22'),
(3,'booking','19660709-9125-4171-b51e-a6bef91c582a','새로운 예약이 들어왔습니다','새로운 예약이 들어왔습니다. 예약번호: HT202508205507, 고객: 김민제, 상품: 일본 오사카 3박4일 벚꽃여행',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-20 09:44:17','2025-08-20 00:31:38','2025-08-20 09:44:17'),
(4,'application','with','새로운 입출금 신청이 있습니다','새로운 입출금 신청이 있습니다. 처리해주세요.',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-20 04:24:29','2025-08-20 01:23:09','2025-08-20 04:24:29'),
(5,'review','fd18d888-88df-466c-8698-d3c8b4acc639','새로운 리뷰가 작성되었습니다','새로운 리뷰가 작성되었습니다. 승인을 기다리고 있습니다.',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-20 10:06:05','2025-08-20 01:23:15','2025-08-20 10:06:05'),
(6,'booking','605e2970-a7c7-4559-83a3-6d188aa82861','새로운 예약이 들어왔습니다','새로운 예약이 들어왔습니다. 예약번호: HT202508203294, 고객: 장미, 상품: 호주 시드니 & 멜버른 6박7일',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-20 10:05:03','2025-08-20 01:24:19','2025-08-20 10:05:03'),
(7,'booking','2798acea-ac4c-499d-9bff-1c851cd52d58','새로운 예약이 들어왔습니다','새로운 예약이 들어왔습니다. 예약번호: HT202508202455, 고객: 김민제, 상품: 일본 오사카 3박4일 벚꽃여행',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-20 10:05:59','2025-08-20 01:25:20','2025-08-20 10:05:59'),
(8,'application','with_40f301d897c6','새로운 입출금 신청이 있습니다','새로운 입출금 신청이 있습니다. 처리해주세요.',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-20 04:30:11','2025-08-20 04:30:11','2025-08-20 04:30:11'),
(9,'application','with_d0a031a31b3d','새로운 입출금 신청이 있습니다','새로운 입출금 신청이 있습니다. 처리해주세요.',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-20 10:05:51','2025-08-20 04:30:23','2025-08-20 10:05:51'),
(10,'inquiry','873c8547-975b-4637-a680-4630f521dd30','새로운 1:1 문의가 접수되었습니다','새로운 1:1 문의가 접수되었습니다. 문의번호: INQ-2025-003, 고객: test333, 제목: asdfadfasdf',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-20 09:43:44','2025-08-20 09:40:46','2025-08-20 09:43:44'),
(11,'inquiry','2cd3e489-c30a-4c8c-b938-6ae01a96a3a2','새로운 1:1 문의가 접수되었습니다','새로운 1:1 문의가 접수되었습니다. 문의번호: INQ-2025-004, 고객: test444, 제목: asdfasdfasdf',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-20 09:45:07','2025-08-20 09:44:56','2025-08-20 09:45:07'),
(12,'inquiry','3d335943-0c35-453a-ba45-d6bb46e0f50c','새로운 1:1 문의가 접수되었습니다','새로운 1:1 문의가 접수되었습니다. 문의번호: INQ-2025-005, 고객: test444, 제목: asdfasdfasdf',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-20 09:50:38','2025-08-20 09:50:22','2025-08-20 09:50:38'),
(13,'inquiry','22d1383f-7246-4d7a-8539-93a7548be0ce','새로운 1:1 문의가 접수되었습니다','새로운 1:1 문의가 접수되었습니다. 문의번호: INQ-2025-006, 고객: 김민제, 제목: asdfasdfasdf',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-20 10:11:13','2025-08-20 10:04:20','2025-08-20 10:11:13'),
(14,'inquiry','4ab871b0-c515-44df-a11d-44a36ab2beb5','새로운 1:1 문의가 접수되었습니다','새로운 1:1 문의가 접수되었습니다. 문의번호: INQ-2025-007, 고객: 김민제, 제목: 22asdfasdfadf',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-20 10:14:34','2025-08-20 10:14:27','2025-08-20 10:14:34'),
(15,'inquiry','b64fba10-505d-41c1-9439-b9ba1d42f6a7','새로운 1:1 문의가 접수되었습니다','새로운 1:1 문의가 접수되었습니다. 문의번호: INQ-2025-001, 고객: 김민제, 제목: asdfadsfasdf',1,'febda45a-9339-4401-b9f9-f2449063785b','2025-08-20 10:26:15','2025-08-20 10:26:07','2025-08-20 10:26:15');
/*!40000 ALTER TABLE `admin_alerts` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `bank_accounts`
--

DROP TABLE IF EXISTS `bank_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bankName` varchar(100) NOT NULL COMMENT '은행명',
  `accountNumber` varchar(50) NOT NULL COMMENT '계좌번호',
  `accountHolder` varchar(100) NOT NULL COMMENT '예금주',
  `isActive` tinyint(1) DEFAULT 1 COMMENT '사용여부',
  `displayOrder` int(11) DEFAULT 0 COMMENT '표시순서',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_bank_accounts_active` (`isActive`),
  KEY `idx_bank_accounts_order` (`displayOrder`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='은행 계좌 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank_accounts`
--

LOCK TABLES `bank_accounts` WRITE;
/*!40000 ALTER TABLE `bank_accounts` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `bank_accounts` VALUES
(1,'국민은행','123456-12-123456','(주)하나투어',1,1,'2025-08-01 07:38:48'),
(2,'신한은행','654321-21-654321','(주)하나투어',1,2,'2025-08-01 07:38:48'),
(3,'우리은행','111222-33-444555','(주)하나투어',1,3,'2025-08-01 07:38:48');
/*!40000 ALTER TABLE `bank_accounts` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `blocked_ips`
--

DROP TABLE IF EXISTS `blocked_ips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `blocked_ips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `reason` text DEFAULT NULL,
  `blocked_at` timestamp NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL COMMENT 'NULL이면 영구 차단',
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ip_address` (`ip_address`),
  KEY `idx_blocked_ips_ip_address` (`ip_address`),
  KEY `idx_blocked_ips_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocked_ips`
--

LOCK TABLES `blocked_ips` WRITE;
/*!40000 ALTER TABLE `blocked_ips` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `blocked_ips` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` varchar(36) NOT NULL,
  `bookingNumber` varchar(50) DEFAULT NULL,
  `tourId` varchar(36) NOT NULL,
  `tourTitle` varchar(255) DEFAULT NULL,
  `userId` varchar(36) DEFAULT NULL,
  `customerName` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `email` varchar(255) NOT NULL,
  `participants` int(11) NOT NULL,
  `specialRequests` text DEFAULT NULL,
  `status` enum('pending','payment_pending','payment_completed','payment_expired','confirmed','cancel_requested','cancelled','refund_completed') DEFAULT 'payment_pending' COMMENT '예약 상태',
  `departureDate` datetime DEFAULT NULL COMMENT '출발일시',
  `totalAmount` int(11) DEFAULT NULL,
  `paymentDueDate` datetime DEFAULT NULL COMMENT '입금기한',
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `bookingNumber` (`bookingNumber`),
  KEY `tourId` (`tourId`),
  KEY `userId` (`userId`),
  KEY `idx_bookings_paymentDueDate` (`paymentDueDate`),
  KEY `idx_bookings_bookingNumber` (`bookingNumber`),
  KEY `idx_bookings_departureDate` (`departureDate`),
  KEY `idx_bookings_status` (`status`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `bookings` VALUES
('00864fc7-0d6d-43ed-a04b-9de6d096f0f5','HT202508197404','7ad22fe7-2172-4505-bd20-0da6091638c8','일본 오사카 3박4일 벚꽃여행',NULL,'김민제','010-1341-3423','freitag1@naver.com',2,NULL,'payment_pending','2025-11-12 15:00:00',1780000,'2025-08-20 05:23:08','2025-08-19 14:23:10','2025-08-19 14:23:10'),
('19660709-9125-4171-b51e-a6bef91c582a','HT202508205507','7ad22fe7-2172-4505-bd20-0da6091638c8','일본 오사카 3박4일 벚꽃여행',NULL,'김민제','010-5312-8964','qweasd@naver.com',1,NULL,'payment_pending','2025-11-13 00:00:00',890000,'2025-08-21 00:31:38','2025-08-20 09:31:38','2025-08-20 09:31:38'),
('2798acea-ac4c-499d-9bff-1c851cd52d58','HT202508202455','7ad22fe7-2172-4505-bd20-0da6091638c8','일본 오사카 3박4일 벚꽃여행',NULL,'김민제','010-5312-8964','qweasd@naver.com',1,NULL,'payment_pending','2026-12-20 00:00:00',890000,'2025-08-21 01:25:20','2025-08-20 10:25:20','2025-08-20 10:25:20'),
('3522b906-30c4-4c81-8b87-69352e5c36df','HT202508056846','7ad22fe7-2172-4505-bd20-0da6091638c8','일본 오사카 3박4일 벚꽃여행',NULL,'김민제','010-5312-8964','freitag1@naver.com',3,'test','payment_completed','2025-11-12 15:00:00',2670000,'2025-08-06 09:09:17','2025-08-05 18:09:17','2025-08-19 09:50:50'),
('605e2970-a7c7-4559-83a3-6d188aa82861','HT202508203294','0093487d-9193-4269-bacc-282765ce64cc','호주 시드니 & 멜버른 6박7일',NULL,'장미','010-7352-6216','qweasd@naver.com',1,NULL,'payment_pending','2025-12-01 00:00:00',2390000,'2025-08-21 01:24:19','2025-08-20 10:24:19','2025-08-20 10:24:19'),
('66a48c67-5ba7-41df-8258-35663adfe452','HT202508196982','7ad22fe7-2172-4505-bd20-0da6091638c8','일본 오사카 3박4일 벚꽃여행',NULL,'테스트 고객','010-1234-5678','test@example.com',2,'테스트 예약입니다','payment_pending','2025-11-12 15:00:00',1780000,'2025-08-20 05:38:14','2025-08-19 14:38:14','2025-08-19 14:38:14'),
('9c39645b-07ef-4567-9d6f-8797909dc14c','HT202508053336','7ad22fe7-2172-4505-bd20-0da6091638c8','일본 오사카 3박4일 벚꽃여행',NULL,'김민제','010-5312-8964','freitag1@naver.com',1,'test','payment_completed','2025-11-12 15:00:00',890000,'2025-08-06 08:43:12','2025-08-05 17:43:13','2025-08-19 09:50:57');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) DEFAULT NULL,
  `sessionId` varchar(255) DEFAULT NULL,
  `tourId` varchar(36) NOT NULL,
  `tourTitle` varchar(255) NOT NULL,
  `mainImage` varchar(255) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `departureDate` datetime NOT NULL COMMENT '출발일시',
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
  KEY `idx_cart_user_session` (`userId`,`sessionId`),
  KEY `idx_cart_tour_user` (`tourId`,`userId`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `company_info`
--

DROP TABLE IF EXISTS `company_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(100) NOT NULL,
  `ceo_name` varchar(50) DEFAULT NULL,
  `established_date` varchar(50) DEFAULT NULL,
  `business_number` varchar(50) DEFAULT NULL,
  `online_business_number` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `privacy_officer` varchar(50) DEFAULT NULL,
  `introduction` text DEFAULT NULL,
  `vision_title` varchar(255) DEFAULT NULL,
  `vision_content` text DEFAULT NULL,
  `mission_title` varchar(255) DEFAULT NULL,
  `mission_content` text DEFAULT NULL,
  `core_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`core_values`)),
  `business_areas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`business_areas`)),
  `company_history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`company_history`)),
  `disclaimers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`disclaimers`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_info`
--

LOCK TABLES `company_info` WRITE;
/*!40000 ALTER TABLE `company_info` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `company_info` VALUES
(1,'test투어1234','김아무개12123','2020년 3월','892-86-02037','2020-서울구로-1996','서울특별시','010-1234-5678','abcd1234@naver.com','홍길동1','(주)하나투어는 2020년 3월 설립된 이래, 고객 중심의 여행 서비스를 제공하는 전문 여행사입니다. 우리는 단순한 여행 상품 판매를 넘어, 고객의 꿈과 추억을 현실로 만들어주는 신뢰할 수 있는 파트너가 되고자 합니다.\n\n공정거래위원회의 엄격한 심사를 통과하여 등록된 여행사로서, 투명하고 정직한 비즈니스를 통해 고객의 신뢰를 얻고 있습니다. 모든 여행 상품은 철저한 품질 관리와 안전 기준을 거쳐 제공되며, 고객의 만족도를 최우선으로 생각합니다.\n\n최신 기술을 활용한 온라인 예약 시스템과 전문 여행 상담사들의 맞춤형 서비스를 통해, 고객에게 편리하고 안전한 여행 경험을 제공합니다. 우리는 지속적인 혁신과 개선을 통해 여행업계의 새로운 표준을 제시하고 있습니다.','세계를 연결하는 여행의 새로운 기준','최고의 서비스와 혁신적인 기술로 고객에게 잊을 수 없는 여행 경험을 제공하여, 여행업계의 새로운 표준을 제시합니다.','고객 중심의 여행 솔루션','고객의 니즈를 최우선으로 생각하며, 안전하고 편리한 여행을 통해 고객의 꿈과 추억을 현실로 만들어드립니다.','[{\"icon\":\"Shield\",\"title\":\"신뢰성\",\"description\":\"투명하고 정직한 비즈니스로 고객의 신뢰를 얻습니다.\"},{\"icon\":\"Award\",\"title\":\"품질\",\"description\":\"최고의 서비스 품질로 고객 만족을 실현합니다.\"},{\"icon\":\"Globe\",\"title\":\"혁신\",\"description\":\"지속적인 혁신으로 여행의 새로운 경험을 제공합니다.\"}]','[{\"title\":\"패키지 여행\",\"description\":\"다양한 테마의 패키지 여행 상품 제공\"},{\"title\":\"자유여행\",\"description\":\"맞춤형 자유여행 플랜 설계 및 지원\"},{\"title\":\"단체 여행\",\"description\":\"기업 연수, 워크샵 등 단체 여행 전문\"},{\"title\":\"여행 상담\",\"description\":\"전문 여행 상담사가 제공하는 맞춤 상담\"}]','[{\"year\":\"2024\",\"title\":\"서비스 확장\",\"description\":\"온라인 예약 시스템 구축 및 모바일 앱 런칭\"},{\"year\":\"2023\",\"title\":\"성장기\",\"description\":\"연간 고객 수 10,000명 달성, 해외 지사 설립\"},{\"year\":\"2022\",\"title\":\"안정화\",\"description\":\"여행업 등록 및 통신판매업 신고 완료\"},{\"year\":\"2020\",\"title\":\"창립\",\"description\":\"(주)하나투어 설립, 서울 양천구 목동에 본사 설립\"}]','[{\"title\":\"여행 일정 변경 관련\",\"content\":\"부득이한 사정에 의해 확정된 여행일정이 변경되는 경우 여행자의 사전 동의를 받습니다.\"},{\"title\":\"통신판매중개 서비스\",\"content\":\"(주)하나투어는 항공사가 제공하는 개별 항공권 및 여행사가 제공하는 일부 여행상품에 대하여 통신판매중개자의 지위를 가지며, 해당 상품, 상품정보, 거래에 관한 의무와 책임은 판매자에게 있습니다.\"}]','2025-08-22 06:53:48','2025-08-22 07:43:39');
/*!40000 ALTER TABLE `company_info` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `deposit_applications`
--

DROP TABLE IF EXISTS `deposit_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `deposit_applications` (
  `id` varchar(36) NOT NULL COMMENT '입금 신청 ID',
  `userId` varchar(36) NOT NULL COMMENT '사용자 ID',
  `username` varchar(100) NOT NULL COMMENT '사용자 아이디',
  `applicantName` varchar(100) NOT NULL COMMENT '신청자명',
  `applicationType` enum('deposit','withdrawal') NOT NULL DEFAULT 'deposit' COMMENT '신청 종류',
  `amount` int(11) NOT NULL COMMENT '신청 금액',
  `applicationMethod` varchar(50) DEFAULT '직접충전' COMMENT '신청 방식',
  `status` enum('pending','processing','completed','rejected') NOT NULL DEFAULT 'pending' COMMENT '처리 상태',
  `adminNotes` text DEFAULT NULL COMMENT '관리자 메모',
  `processedAt` datetime DEFAULT NULL COMMENT '처리 완료 시간',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '신청 시간',
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정 시간',
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_status` (`status`),
  KEY `idx_createdAt` (`createdAt`),
  KEY `idx_applicationType` (`applicationType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='입금 신청 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deposit_applications`
--

LOCK TABLES `deposit_applications` WRITE;
/*!40000 ALTER TABLE `deposit_applications` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `deposit_applications` VALUES
('dep_001','user_001','john_doe','권영순','deposit',1000000,'직접충전','completed',NULL,NULL,'2025-06-24 11:47:00','2025-08-18 17:21:56'),
('dep_002','user_002','jane_smith','남혜진','deposit',470000,'직접충전','completed',NULL,NULL,'2025-06-20 15:05:00','2025-08-18 17:21:56'),
('dep_003','user_002','jane_smith','남혜진','deposit',350000,'직접충전','completed',NULL,NULL,'2025-06-20 14:59:00','2025-08-18 17:21:56'),
('dep_004','user_002','jane_smith','남혜진','deposit',170000,'직접충전','completed',NULL,NULL,'2025-06-20 14:51:00','2025-08-18 17:21:56'),
('dep_005','user_002','jane_smith','남혜진','deposit',95000,'직접충전','completed',NULL,NULL,'2025-06-19 13:27:00','2025-08-18 17:21:56'),
('dep_0dd7f73a07cc','febda45a-9339-4401-b9f9-f2449063785b','freitag1','김민제','deposit',2000000,'직접충전','completed',NULL,'2025-08-18 18:23:59','2025-08-18 18:23:31','2025-08-18 18:23:59'),
('dep_415d58f5e0f1','93b59fa5-d9f7-47da-9883-df6062645cd1','ROSE','장미','deposit',999999,'직접충전','completed',NULL,'2025-08-19 10:39:53','2025-08-19 10:39:12','2025-08-19 10:39:53'),
('dep_e1cd76688635','93b59fa5-d9f7-47da-9883-df6062645cd1','ROSE','장미','deposit',1000001,'직접충전','completed',NULL,'2025-08-19 10:41:13','2025-08-19 10:40:51','2025-08-19 10:41:13'),
('dep_ee1bb1bd34dd','93b59fa5-d9f7-47da-9883-df6062645cd1','ROSE','장미','deposit',450000,'직접충전','completed',NULL,'2025-08-19 10:20:37','2025-08-19 09:54:03','2025-08-19 10:20:37');
/*!40000 ALTER TABLE `deposit_applications` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `email_templates`
--

DROP TABLE IF EXISTS `email_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_templates` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT '템플릿 이름',
  `type` varchar(50) NOT NULL COMMENT '템플릿 타입 (booking_confirmation, payment_completed, payment_expired, payment_reminder)',
  `subject` varchar(200) NOT NULL COMMENT '이메일 제목',
  `html_content` longtext NOT NULL COMMENT 'HTML 내용',
  `text_content` text DEFAULT NULL COMMENT '텍스트 내용 (선택사항)',
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '사용 가능한 변수 목록' CHECK (json_valid(`variables`)),
  `is_active` tinyint(1) DEFAULT 1 COMMENT '활성화 여부',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_type` (`type`),
  KEY `idx_type` (`type`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='이메일 템플릿 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_templates`
--

LOCK TABLES `email_templates` WRITE;
/*!40000 ALTER TABLE `email_templates` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `email_templates` VALUES
('304cc2c6-71d7-11f0-a232-020017017948','예약 확인 이메일','booking_confirmation','[하나투어] 예약 신청 완료 - {bookingNumber}','<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>예약 신청 완료</title>\n  <style>\n    body { font-family: \'Malgun Gothic\', Arial, sans-serif; line-height: 1.6; color: #333; }\n    .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }\n    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }\n    .booking-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }\n    .highlight { color: #667eea; font-weight: bold; }\n    .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }\n    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }\n    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    <div class=\"header\">\n      <h1>? 예약 신청이 완료되었습니다!</h1>\n      <p>하나투어를 이용해 주셔서 감사합니다.</p>\n    </div>\n    \n    <div class=\"content\">\n      <h2>예약 정보</h2>\n      <div class=\"booking-info\">\n        <p><strong>예약번호:</strong> <span class=\"highlight\">{bookingNumber}</span></p>\n        <p><strong>상품명:</strong> {tourTitle}</p>\n        <p><strong>예약자:</strong> {customerName}</p>\n        <p><strong>인원:</strong> {participants}명</p>\n        <p><strong>총 금액:</strong> {totalAmount}원</p>\n        <p><strong>출발일:</strong> {departureDate}</p>\n      </div>\n      \n      <div class=\"warning\">\n        <h3>⚠️ 입금 안내</h3>\n        <p><strong>입금 기한:</strong> {paymentDueDate}</p>\n        <p>입금 기한 내에 입금을 완료해주시면 예약이 확정됩니다.</p>\n        <p>입금이 확인되지 않으면 예약이 자동으로 취소될 수 있습니다.</p>\n      </div>\n      \n      <h3>다음 단계</h3>\n      <ol>\n        <li>입금 기한 내에 지정된 계좌로 입금해주세요</li>\n        <li>입금 완료 후 관리자 확인을 기다려주세요</li>\n        <li>확정 이메일을 받으시면 예약이 완료됩니다</li>\n      </ol>\n      \n      <p style=\"text-align: center;\">\n        <a href=\"{baseUrl}/booking-lookup\" class=\"button\">예약 확인하기</a>\n      </p>\n    </div>\n    \n    <div class=\"footer\">\n      <p>본 이메일은 자동으로 발송되었습니다.</p>\n      <p>문의사항: <a href=\"mailto:support@hanatour.com\">support@hanatour.com</a></p>\n      <p>© 2024 하나투어. All rights reserved.</p>\n    </div>\n  </div>\n</body>\n</html>',NULL,'[\"bookingNumber\", \"tourTitle\", \"customerName\", \"participants\", \"totalAmount\", \"departureDate\", \"paymentDueDate\", \"baseUrl\"]',1,'2025-08-05 17:35:49','2025-08-05 17:35:49'),
('304cc6c5-71d7-11f0-a232-020017017948','결제 완료 이메일','payment_completed','[하나투어] 결제 완료 - {bookingNumber}','<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>결제 완료</title>\n  <style>\n    body { font-family: \'Malgun Gothic\', Arial, sans-serif; line-height: 1.6; color: #333; }\n    .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }\n    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }\n    .success-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }\n    .highlight { color: #28a745; font-weight: bold; }\n    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    <div class=\"header\">\n      <h1>✅ 결제가 완료되었습니다!</h1>\n      <p>예약이 확정되었습니다.</p>\n    </div>\n    \n    <div class=\"content\">\n      <h2>결제 정보</h2>\n      <div class=\"success-info\">\n        <p><strong>예약번호:</strong> <span class=\"highlight\">{bookingNumber}</span></p>\n        <p><strong>상품명:</strong> {tourTitle}</p>\n        <p><strong>결제 금액:</strong> {totalAmount}원</p>\n        <p><strong>결제 방법:</strong> {paymentMethod}</p>\n        <p><strong>결제 일시:</strong> {paymentDate}</p>\n      </div>\n      \n      <h3>여행 준비사항</h3>\n      <ul>\n        <li>출발 3일 전까지 여행 준비사항을 안내드립니다</li>\n        <li>여행 당일 집합 장소와 시간을 확인해주세요</li>\n        <li>필요한 서류와 준비물을 미리 준비해주세요</li>\n      </ul>\n      \n      <p style=\"text-align: center;\">\n        <a href=\"{baseUrl}/booking-lookup\" class=\"button\">예약 확인하기</a>\n      </p>\n    </div>\n    \n    <div class=\"footer\">\n      <p>본 이메일은 자동으로 발송되었습니다.</p>\n      <p>문의사항: <a href=\"mailto:support@hanatour.com\">support@hanatour.com</a></p>\n      <p>© 2024 하나투어. All rights reserved.</p>\n    </div>\n  </div>\n</body>\n</html>',NULL,'[\"bookingNumber\", \"tourTitle\", \"totalAmount\", \"paymentMethod\", \"paymentDate\", \"baseUrl\"]',1,'2025-08-05 17:35:49','2025-08-05 17:35:49'),
('304cc8e0-71d7-11f0-a232-020017017948','입금 기한 만료 이메일','payment_expired','[하나투어] 입금 기한 만료 - {bookingNumber}','<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>입금 기한 만료</title>\n  <style>\n    body { font-family: \'Malgun Gothic\', Arial, sans-serif; line-height: 1.6; color: #333; }\n    .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n    .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }\n    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }\n    .expired-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545; }\n    .highlight { color: #dc3545; font-weight: bold; }\n    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    <div class=\"header\">\n      <h1>⚠️ 입금 기한이 만료되었습니다</h1>\n      <p>예약이 자동으로 취소되었습니다.</p>\n    </div>\n    \n    <div class=\"content\">\n      <h2>취소된 예약 정보</h2>\n      <div class=\"expired-info\">\n        <p><strong>예약번호:</strong> <span class=\"highlight\">{bookingNumber}</span></p>\n        <p><strong>상품명:</strong> {tourTitle}</p>\n        <p><strong>예약자:</strong> {customerName}</p>\n        <p><strong>인원:</strong> {participants}명</p>\n        <p><strong>총 금액:</strong> {totalAmount}원</p>\n        <p><strong>입금 기한:</strong> {paymentDueDate}</p>\n      </div>\n      \n      <h3>안내사항</h3>\n      <ul>\n        <li>입금 기한이 지나 예약이 자동으로 취소되었습니다</li>\n        <li>다시 예약을 원하시면 새로운 예약을 진행해주세요</li>\n        <li>문의사항이 있으시면 고객센터로 연락해주세요</li>\n      </ul>\n    </div>\n    \n    <div class=\"footer\">\n      <p>본 이메일은 자동으로 발송되었습니다.</p>\n      <p>문의사항: <a href=\"mailto:support@hanatour.com\">support@hanatour.com</a></p>\n      <p>© 2024 하나투어. All rights reserved.</p>\n    </div>\n  </div>\n</body>\n</html>',NULL,'[\"bookingNumber\", \"tourTitle\", \"customerName\", \"participants\", \"totalAmount\", \"paymentDueDate\"]',1,'2025-08-05 17:35:49','2025-08-05 17:35:49'),
('304cc997-71d7-11f0-a232-020017017948','입금 기한 알림 이메일','payment_reminder','[하나투어] 입금 기한 안내 - {bookingNumber}','<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>입금 기한 안내</title>\n  <style>\n    body { font-family: \'Malgun Gothic\', Arial, sans-serif; line-height: 1.6; color: #333; }\n    .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n    .header { background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }\n    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }\n    .reminder-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }\n    .highlight { color: #ffc107; font-weight: bold; }\n    .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }\n    .button { display: inline-block; background: #ffc107; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }\n    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    <div class=\"header\">\n      <h1>⏰ 입금 기한이 임박했습니다</h1>\n      <p>예약 확정을 위해 입금을 완료해주세요.</p>\n    </div>\n    \n    <div class=\"content\">\n      <h2>예약 정보</h2>\n      <div class=\"reminder-info\">\n        <p><strong>예약번호:</strong> <span class=\"highlight\">{bookingNumber}</span></p>\n        <p><strong>상품명:</strong> {tourTitle}</p>\n        <p><strong>예약자:</strong> {customerName}</p>\n        <p><strong>인원:</strong> {participants}명</p>\n        <p><strong>총 금액:</strong> {totalAmount}원</p>\n        <p><strong>출발일:</strong> {departureDate}</p>\n      </div>\n      \n      <div class=\"warning\">\n        <h3>⚠️ 입금 기한 안내</h3>\n        <p><strong>입금 기한:</strong> {paymentDueDate}</p>\n        <p><strong>남은 시간:</strong> {remainingTime}</p>\n        <p>입금 기한이 지나면 예약이 자동으로 취소됩니다.</p>\n      </div>\n      \n      <h3>입금 계좌 정보</h3>\n      <ul>\n        <li>은행: 하나은행</li>\n        <li>계좌번호: 123-456789-01234</li>\n        <li>예금주: (주)하나투어</li>\n      </ul>\n      \n      <p style=\"text-align: center;\">\n        <a href=\"{baseUrl}/booking-lookup\" class=\"button\">예약 확인하기</a>\n      </p>\n    </div>\n    \n    <div class=\"footer\">\n      <p>본 이메일은 자동으로 발송되었습니다.</p>\n      <p>문의사항: <a href=\"mailto:support@hanatour.com\">support@hanatour.com</a></p>\n      <p>© 2024 하나투어. All rights reserved.</p>\n    </div>\n  </div>\n</body>\n</html>',NULL,'[\"bookingNumber\", \"tourTitle\", \"customerName\", \"participants\", \"totalAmount\", \"departureDate\", \"paymentDueDate\", \"remainingTime\", \"baseUrl\"]',1,'2025-08-05 17:35:49','2025-08-05 17:35:49');
/*!40000 ALTER TABLE `email_templates` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `footer_settings`
--

DROP TABLE IF EXISTS `footer_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `footer_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '설정 ID',
  `setting_key` varchar(100) NOT NULL COMMENT '설정 키',
  `setting_value` text NOT NULL COMMENT '설정 값',
  `setting_type` enum('text','textarea','link','email','phone') NOT NULL DEFAULT 'text' COMMENT '설정 타입',
  `display_name` varchar(200) NOT NULL COMMENT '표시 이름',
  `description` text DEFAULT NULL COMMENT '설정 설명',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT '활성화 여부',
  `sort_order` int(11) NOT NULL DEFAULT 0 COMMENT '정렬 순서',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일시',
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `idx_setting_key` (`setting_key`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='푸터 설정 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footer_settings`
--

LOCK TABLES `footer_settings` WRITE;
/*!40000 ALTER TABLE `footer_settings` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `footer_settings` VALUES
(1,'company_name','(주)하나투어','text','회사명','회사 이름을 입력하세요',1,1,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(2,'ceo_name','김대표','text','대표이사','대표이사 이름을 입력하세요',1,2,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(3,'company_address','서울특별시 강남구 테헤란로 123','text','회사 주소','회사 주소를 입력하세요',1,3,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(4,'business_number','123-45-67890','text','사업자등록번호','사업자등록번호를 입력하세요',1,4,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(5,'travel_agency_number','제2023-서울강남-0123호','text','통신판매업신고번호','통신판매업신고번호를 입력하세요',1,5,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(6,'privacy_officer','김개인정보','text','개인정보관리책임자','개인정보관리책임자를 입력하세요',1,6,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(7,'contact_email','info@hanatour.com','email','대표 이메일','대표 이메일을 입력하세요',1,7,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(8,'contact_phone','02-1111-2222','phone','대표 전화번호','대표 전화번호를 입력하세요',1,8,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(9,'link_terms','/terms','link','이용약관','이용약관 페이지 URL',1,10,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(10,'link_privacy','/privacy','link','개인정보처리방침','개인정보처리방침 페이지 URL',1,11,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(11,'link_travel_terms','/overseas-travel-terms','link','해외여행약관','해외여행약관 페이지 URL',1,12,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(12,'link_company','/company','link','회사소개','회사소개 페이지 URL',1,13,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(13,'disclaimer_1','하나투어는 개별 항공권, 호텔, 현지투어 상품에 대하여 통신판매중개자의 지위를 가지며, 해당상품, 상품정보, 거래에 관한 의무와 책임은 판매자에게 있습니다.','textarea','면책조항 1','첫 번째 면책조항',1,20,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(14,'disclaimer_2','하나투어는 상품정보, 상품가격, 예약가능 여부 등에 대하여 실시간으로 업데이트하고 있으나, 경우에 따라 실제 정보와 차이가 발생할 수 있습니다.','textarea','면책조항 2','두 번째 면책조항',1,21,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(15,'copyright_text','Copyright © 2024 하나투어. All rights reserved.','text','저작권 텍스트','저작권 정보를 입력하세요',1,30,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(16,'social_facebook','https://www.facebook.com/hanatour','link','페이스북','페이스북 페이지 URL',1,40,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(17,'social_instagram','https://www.instagram.com/hanatour','link','인스타그램','인스타그램 페이지 URL',1,41,'2025-08-22 02:03:46','2025-08-22 07:32:06'),
(18,'social_youtube','https://www.youtube.com/hanatour','link','유튜브','유튜브 채널 URL',1,42,'2025-08-22 02:03:46','2025-08-22 07:32:06');
/*!40000 ALTER TABLE `footer_settings` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `inquiries`
--

DROP TABLE IF EXISTS `inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiries` (
  `id` varchar(36) NOT NULL COMMENT '문의 ID',
  `inquiryNumber` varchar(50) NOT NULL COMMENT '문의번호',
  `customerName` varchar(100) NOT NULL COMMENT '고객명',
  `customerPhone` varchar(20) NOT NULL COMMENT '고객 전화번호',
  `customerEmail` varchar(100) DEFAULT NULL COMMENT '고객 이메일',
  `category` enum('general','booking','payment','refund','tour','technical','other') NOT NULL DEFAULT 'general' COMMENT '문의 카테고리',
  `subject` varchar(200) NOT NULL COMMENT '문의 제목',
  `content` text NOT NULL COMMENT '문의 내용',
  `status` enum('pending','in_progress','completed','closed') NOT NULL DEFAULT 'pending' COMMENT '처리 상태',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium' COMMENT '우선순위',
  `assignedTo` varchar(100) DEFAULT NULL COMMENT '담당자',
  `adminNotes` text DEFAULT NULL COMMENT '관리자 메모',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '등록일시',
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  `completedAt` datetime DEFAULT NULL COMMENT '완료일시',
  PRIMARY KEY (`id`),
  UNIQUE KEY `inquiryNumber` (`inquiryNumber`),
  KEY `idx_status` (`status`),
  KEY `idx_category` (`category`),
  KEY `idx_priority` (`priority`),
  KEY `idx_createdAt` (`createdAt`),
  KEY `idx_customerPhone` (`customerPhone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='1:1 문의 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiries`
--

LOCK TABLES `inquiries` WRITE;
/*!40000 ALTER TABLE `inquiries` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `inquiries` VALUES
('b64fba10-505d-41c1-9439-b9ba1d42f6a7','INQ-2025-001','김민제','010-2452-3423','freitag1@naver.com','general','asdfadsfasdf','asdfasdfasdfasdf','completed','medium',NULL,NULL,'2025-08-20 19:26:07','2025-08-20 19:26:20','2025-08-20 19:26:20');
/*!40000 ALTER TABLE `inquiries` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `inquiry_attachments`
--

DROP TABLE IF EXISTS `inquiry_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiry_attachments` (
  `id` varchar(36) NOT NULL COMMENT '첨부파일 ID',
  `inquiryId` varchar(36) NOT NULL COMMENT '문의 ID',
  `fileName` varchar(255) NOT NULL COMMENT '파일명',
  `filePath` varchar(500) NOT NULL COMMENT '파일 경로',
  `fileSize` int(11) NOT NULL COMMENT '파일 크기 (bytes)',
  `mimeType` varchar(100) NOT NULL COMMENT 'MIME 타입',
  `uploadedBy` varchar(100) NOT NULL COMMENT '업로드한 사용자',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '업로드일시',
  PRIMARY KEY (`id`),
  KEY `idx_inquiryId` (`inquiryId`),
  KEY `idx_createdAt` (`createdAt`),
  CONSTRAINT `inquiry_attachments_ibfk_1` FOREIGN KEY (`inquiryId`) REFERENCES `inquiries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='문의 첨부파일 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiry_attachments`
--

LOCK TABLES `inquiry_attachments` WRITE;
/*!40000 ALTER TABLE `inquiry_attachments` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `inquiry_attachments` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `inquiry_responses`
--

DROP TABLE IF EXISTS `inquiry_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiry_responses` (
  `id` varchar(36) NOT NULL COMMENT '답변 ID',
  `inquiryId` varchar(36) NOT NULL COMMENT '문의 ID',
  `responseType` enum('admin_response','customer_followup') NOT NULL DEFAULT 'admin_response' COMMENT '답변 유형',
  `content` text NOT NULL COMMENT '답변 내용',
  `adminName` varchar(100) DEFAULT NULL COMMENT '답변 관리자명',
  `isInternal` tinyint(1) NOT NULL DEFAULT 0 COMMENT '내부 메모 여부',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '답변일시',
  PRIMARY KEY (`id`),
  KEY `idx_inquiryId` (`inquiryId`),
  KEY `idx_responseType` (`responseType`),
  KEY `idx_createdAt` (`createdAt`),
  CONSTRAINT `inquiry_responses_ibfk_1` FOREIGN KEY (`inquiryId`) REFERENCES `inquiries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='문의 답변 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiry_responses`
--

LOCK TABLES `inquiry_responses` WRITE;
/*!40000 ALTER TABLE `inquiry_responses` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `inquiry_responses` VALUES
('0e0760d9-b0de-44b8-9d40-ce749d8b27d7','b64fba10-505d-41c1-9439-b9ba1d42f6a7','admin_response','asdfasdfasdfadf','관리자',0,'2025-08-20 19:26:20');
/*!40000 ALTER TABLE `inquiry_responses` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `location_id` varchar(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL COMMENT '장소명 (예: 스타벅스 강남점)',
  `address` text DEFAULT NULL COMMENT '주소',
  `latitude` decimal(10,8) NOT NULL COMMENT '위도',
  `longitude` decimal(11,8) NOT NULL COMMENT '경도',
  `category` varchar(100) DEFAULT NULL COMMENT '카테고리 (카페, 레스토랑, 쇼핑몰 등)',
  `place_id` varchar(255) DEFAULT NULL COMMENT 'Google Places API ID (외부 연동용)',
  `country` varchar(100) DEFAULT NULL COMMENT '국가',
  `city` varchar(100) DEFAULT NULL COMMENT '도시',
  `district` varchar(100) DEFAULT NULL COMMENT '구/군',
  `post_count` int(11) DEFAULT 0 COMMENT '이 위치의 총 포스트 수',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`location_id`),
  KEY `idx_location_coords` (`latitude`,`longitude`),
  KEY `idx_location_name` (`name`),
  KEY `idx_location_category` (`category`),
  KEY `idx_location_city` (`city`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`latitude` between -90 and 90),
  CONSTRAINT `CONSTRAINT_2` CHECK (`longitude` between -180 and 180)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='위치 정보 마스터 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `login_attempts`
--

DROP TABLE IF EXISTS `login_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_attempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `attempt_time` timestamp NULL DEFAULT current_timestamp(),
  `success` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_login_attempts_ip_address` (`ip_address`),
  KEY `idx_login_attempts_email` (`email`),
  KEY `idx_login_attempts_time` (`attempt_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_attempts`
--

LOCK TABLES `login_attempts` WRITE;
/*!40000 ALTER TABLE `login_attempts` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `login_attempts` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `menu_categories`
--

DROP TABLE IF EXISTS `menu_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_categories` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT '메뉴명',
  `parent_id` varchar(255) DEFAULT NULL COMMENT '상위 메뉴 ID',
  `menu_order` int(11) DEFAULT 0 COMMENT '메뉴 순서',
  `menu_level` enum('main','sub') DEFAULT 'main' COMMENT '메뉴 레벨',
  `menu_color` varchar(20) DEFAULT NULL COMMENT '메뉴 컬러',
  `menu_icon` varchar(100) DEFAULT NULL COMMENT '메뉴 아이콘',
  `menu_type` enum('destination','product','theme') DEFAULT 'destination' COMMENT '메뉴 타입',
  `is_active` tinyint(1) DEFAULT 1 COMMENT '활성화 여부',
  `show_in_menu` tinyint(1) DEFAULT 1 COMMENT '메뉴 표시 여부',
  `href_path` varchar(500) DEFAULT NULL COMMENT '링크 경로',
  `description` text DEFAULT NULL COMMENT '메뉴 설명',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_menu_order` (`menu_order`),
  KEY `idx_menu_type` (`menu_type`),
  KEY `idx_active_menu` (`is_active`,`show_in_menu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='메뉴 카테고리 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_categories`
--

LOCK TABLES `menu_categories` WRITE;
/*!40000 ALTER TABLE `menu_categories` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `menu_categories` VALUES
('africa','아프리카','europe-africa',5,'sub',NULL,NULL,'destination',1,1,'/tours/destination/africa',NULL,'2025-07-24 02:48:35','2025-07-24 02:48:35'),
('asia-southeast','아시아/동남아',NULL,5,'main','#EF4444',NULL,'destination',1,1,'/tours/destination/asia',NULL,'2025-07-24 02:48:27','2025-07-24 02:48:27'),
('brazil','브라질','canada-americas',4,'sub',NULL,NULL,'destination',1,1,'/tours/destination/brazil',NULL,'2025-07-24 02:48:33','2025-07-24 02:48:33'),
('canada','캐나다','canada-americas',1,'sub',NULL,NULL,'destination',1,1,'/tours/destination/canada',NULL,'2025-07-24 02:48:33','2025-07-24 02:48:33'),
('canada-americas','캐나다/중남미',NULL,2,'main','#10B981',NULL,'destination',1,0,'/tours/destination/americas',NULL,'2025-07-24 02:48:27','2025-07-30 05:11:17'),
('china','중국','asia-southeast',2,'sub',NULL,NULL,'destination',1,1,'/tours/destination/china',NULL,'2025-07-24 02:48:42','2025-07-24 02:48:42'),
('chungcheong','충청도','domestic',3,'sub',NULL,NULL,'destination',1,1,'/tours/destination/chungcheong',NULL,'2025-07-24 02:48:39','2025-07-24 02:48:39'),
('cuba','쿠바','canada-americas',3,'sub',NULL,NULL,'destination',1,1,'/tours/destination/cuba',NULL,'2025-07-24 02:48:33','2025-07-24 02:48:33'),
('deals','특가할인상품',NULL,7,'main','#06B6D4',NULL,'product',1,0,'/tours/product/deals',NULL,'2025-07-24 02:48:27','2025-07-24 08:37:11'),
('deals-early-bird','얼리버드','deals',1,'sub',NULL,NULL,'product',1,1,'/tours/product/deals/early-bird',NULL,'2025-07-24 02:48:47','2025-07-24 02:48:47'),
('deals-exclusive','독점상품','deals',2,'sub',NULL,NULL,'product',1,1,'/tours/product/deals/exclusive',NULL,'2025-07-24 02:48:47','2025-07-24 02:48:47'),
('deals-last-minute','막판특가','deals',3,'sub',NULL,NULL,'product',1,1,'/tours/product/deals/last-minute',NULL,'2025-07-24 02:48:47','2025-07-24 02:48:47'),
('domestic','국내',NULL,4,'main','#F59E0B',NULL,'destination',1,1,'/tours/destination/domestic',NULL,'2025-07-24 02:48:27','2025-07-24 02:48:27'),
('europe-africa','유럽/아프리카',NULL,3,'main','#10B981',NULL,'destination',1,1,'/tours/destination/europe',NULL,'2025-07-24 02:48:27','2025-07-24 02:48:27'),
('europe-east','동유럽','europe-africa',2,'sub',NULL,NULL,'destination',1,1,'/tours/destination/europe/east',NULL,'2025-07-24 02:48:35','2025-07-24 02:48:35'),
('europe-north','북유럽','europe-africa',3,'sub',NULL,NULL,'destination',1,1,'/tours/destination/europe/north',NULL,'2025-07-24 02:48:35','2025-07-24 02:48:35'),
('europe-south','남유럽','europe-africa',4,'sub',NULL,NULL,'destination',1,1,'/tours/destination/europe/south',NULL,'2025-07-24 02:48:35','2025-07-24 02:48:35'),
('europe-west','서유럽','europe-africa',1,'sub',NULL,NULL,'destination',1,1,'/tours/destination/europe/west',NULL,'2025-07-24 02:48:35','2025-07-24 02:48:35'),
('gangwon','강원도','domestic',2,'sub',NULL,NULL,'destination',1,1,'/tours/destination/gangwon',NULL,'2025-07-24 02:48:39','2025-07-24 02:48:39'),
('gyeongsang','경상도','domestic',5,'sub',NULL,NULL,'destination',1,1,'/tours/destination/gyeongsang',NULL,'2025-07-24 02:48:39','2025-07-24 02:48:39'),
('hongkong-macau','홍콩/마카오','asia-southeast',7,'sub',NULL,NULL,'destination',1,1,'/tours/destination/hongkong-macau',NULL,'2025-07-24 02:48:42','2025-07-24 02:48:42'),
('japan','일본','asia-southeast',1,'sub',NULL,NULL,'destination',1,1,'/tours/destination/japan',NULL,'2025-07-24 02:48:42','2025-07-24 08:37:46'),
('jeju','제주도','domestic',6,'sub',NULL,NULL,'destination',1,1,'/tours/destination/jeju',NULL,'2025-07-24 02:48:39','2025-07-24 02:48:39'),
('jeolla','전라도','domestic',4,'sub',NULL,NULL,'destination',1,1,'/tours/destination/jeolla',NULL,'2025-07-24 02:48:39','2025-07-24 02:48:39'),
('mexico','멕시코','canada-americas',2,'sub',NULL,NULL,'destination',1,1,'/tours/destination/mexico',NULL,'2025-07-24 02:48:33','2025-07-24 02:48:33'),
('seoul-metro','서울/수도권','domestic',1,'sub',NULL,NULL,'destination',1,1,'/tours/destination/seoul',NULL,'2025-07-24 02:48:39','2025-07-24 02:48:39'),
('singapore','싱가포르','asia-southeast',5,'sub',NULL,NULL,'destination',1,1,'/tours/destination/singapore',NULL,'2025-07-24 02:48:42','2025-07-24 02:48:42'),
('staycation','호캠스',NULL,6,'main','#8B5CF6',NULL,'product',1,0,'/tours/product/staycation',NULL,'2025-07-24 02:48:27','2025-07-24 08:37:10'),
('staycation-hotels','호텔','staycation',1,'sub',NULL,NULL,'product',1,1,'/tours/product/staycation/hotels',NULL,'2025-07-24 02:48:45','2025-07-24 02:48:45'),
('staycation-pool-villas','풀빌라','staycation',3,'sub',NULL,NULL,'product',1,1,'/tours/product/staycation/pool-villas',NULL,'2025-07-24 02:48:45','2025-07-24 02:48:45'),
('staycation-resorts','리조트','staycation',2,'sub',NULL,NULL,'product',1,1,'/tours/product/staycation/resorts',NULL,'2025-07-24 02:48:45','2025-07-24 02:48:45'),
('taiwan','대만','asia-southeast',6,'sub',NULL,NULL,'destination',1,1,'/tours/destination/taiwan',NULL,'2025-07-24 02:48:42','2025-07-24 02:48:42'),
('thailand','태국','asia-southeast',3,'sub',NULL,NULL,'destination',1,1,'/tours/destination/thailand',NULL,'2025-07-24 02:48:42','2025-07-24 02:48:42'),
('usa-alaska','알래스카','usa-travel',4,'sub',NULL,NULL,'destination',1,1,'/tours/destination/usa/alaska',NULL,'2025-07-24 02:48:30','2025-07-24 02:48:30'),
('usa-east','동부','usa-travel',1,'sub',NULL,NULL,'destination',1,1,'/tours/destination/usa/east',NULL,'2025-07-24 02:48:30','2025-07-24 08:37:01'),
('usa-hawaii','하와이','usa-travel',3,'sub',NULL,NULL,'destination',1,1,'/tours/destination/usa/hawaii',NULL,'2025-07-24 02:48:30','2025-07-24 02:48:30'),
('usa-travel','미국여행',NULL,1,'main','#3B82F6',NULL,'destination',1,1,'/tours/destination/usa',NULL,'2025-07-24 02:48:27','2025-07-30 05:10:59'),
('usa-west','서부','usa-travel',2,'sub',NULL,NULL,'destination',1,1,'/tours/destination/usa/west',NULL,'2025-07-24 02:48:30','2025-07-24 02:48:30'),
('vietnam','베트남','asia-southeast',4,'sub',NULL,NULL,'destination',1,1,'/tours/destination/vietnam',NULL,'2025-07-24 02:48:42','2025-07-24 02:48:42');
/*!40000 ALTER TABLE `menu_categories` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `mileage_transactions`
--

DROP TABLE IF EXISTS `mileage_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `mileage_transactions` (
  `id` varchar(36) NOT NULL COMMENT '거래 ID',
  `userId` varchar(36) NOT NULL COMMENT '사용자 ID',
  `transactionType` enum('deposit','withdrawal','reward','usage') NOT NULL COMMENT '거래 유형',
  `amount` int(11) NOT NULL COMMENT '거래 금액',
  `balanceBefore` int(11) NOT NULL COMMENT '거래 전 잔액',
  `balanceAfter` int(11) NOT NULL COMMENT '거래 후 잔액',
  `description` varchar(200) NOT NULL COMMENT '거래 설명',
  `referenceId` varchar(36) DEFAULT NULL COMMENT '참조 ID (입금/출금 신청 ID)',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '거래 시간',
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_transactionType` (`transactionType`),
  KEY `idx_createdAt` (`createdAt`),
  KEY `idx_referenceId` (`referenceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='마일리지 거래 내역 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mileage_transactions`
--

LOCK TABLES `mileage_transactions` WRITE;
/*!40000 ALTER TABLE `mileage_transactions` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `mileage_transactions` VALUES
('128c04b2-7c15-11f0-a232-020017017948','febda45a-9339-4401-b9f9-f2449063785b','deposit',2000000,31000,2031000,'입금 신청 완료: 2,000,000원','dep_0dd7f73a07cc','2025-08-18 18:23:59'),
('171346aa-7c95-11f0-a232-020017017948','user_001','withdrawal',500000,0,0,'출금 신청 완료: 500,000원','with_001','2025-08-19 09:40:22'),
('187602ed-7d92-11f0-a232-020017017948','febda45a-9339-4401-b9f9-f2449063785b','reward',1000,0,1000,'텔레진행입금시→→캠페인 클릭→→',NULL,'2025-08-20 15:51:27'),
('240f14b6-7d92-11f0-a232-020017017948','febda45a-9339-4401-b9f9-f2449063785b','reward',1000,1000,2000,'[발권금액+수익금]',NULL,'2025-08-20 15:51:47'),
('2420b03c-7c95-11f0-a232-020017017948','user_002','withdrawal',300000,0,0,'출금 신청 완료: 300,000원','with_002','2025-08-19 09:40:44'),
('46a28842-7d93-11f0-a232-020017017948','febda45a-9339-4401-b9f9-f2449063785b','reward',1000,4000,5000,'[N잡러 주문 포인트+수익금 지급]',NULL,'2025-08-20 15:59:54'),
('679bf2a9-7c9d-11f0-a232-020017017948','93b59fa5-d9f7-47da-9883-df6062645cd1','deposit',999999,455000,1454999,'입금 신청 완료: 999,999원','dep_415d58f5e0f1','2025-08-19 10:39:53'),
('7c986fc1-7da2-11f0-a232-020017017948','93b59fa5-d9f7-47da-9883-df6062645cd1','reward',1000,4915000,4916000,'[캠페인 주문 포인트 수익금 지급]',NULL,'2025-08-20 17:48:47'),
('8795ca62-7d93-11f0-a232-020017017948','febda45a-9339-4401-b9f9-f2449063785b','reward',1000,5000,6000,'[캠페인 주문 포인트 수익금 지급]',NULL,'2025-08-20 16:01:43'),
('8808c990-7da2-11f0-a232-020017017948','93b59fa5-d9f7-47da-9883-df6062645cd1','reward',20000000,4916000,24916000,'[EVENT] 후기작성 포인트 지급',NULL,'2025-08-20 17:49:06'),
('96e8e0ef-7c9d-11f0-a232-020017017948','93b59fa5-d9f7-47da-9883-df6062645cd1','deposit',1000001,1454999,2455000,'입금 신청 완료: 1,000,001원','dep_e1cd76688635','2025-08-19 10:41:13'),
('b184853e-7d92-11f0-a232-020017017948','febda45a-9339-4401-b9f9-f2449063785b','reward',1000,2000,3000,'[캠페인 주문 포인트 수익금 지급]',NULL,'2025-08-20 15:55:44'),
('b629421d-7c9a-11f0-a232-020017017948','93b59fa5-d9f7-47da-9883-df6062645cd1','deposit',450000,5000,455000,'입금 신청 완료: 450,000원','dep_ee1bb1bd34dd','2025-08-19 10:20:37'),
('bdaa1e3f-7d91-11f0-a232-020017017948','febda45a-9339-4401-b9f9-f2449063785b','reward',1000,2000000,2001000,'텔레진행입금시→→캠페인 클릭→→',NULL,'2025-08-20 15:48:55'),
('bdd68bbb-7d92-11f0-a232-020017017948','febda45a-9339-4401-b9f9-f2449063785b','reward',1000,3000,4000,'[캠페인 주문 포인트 수익금 지급]',NULL,'2025-08-20 15:56:05'),
('f20b0317-7e2b-11f0-a232-020017017948','93b59fa5-d9f7-47da-9883-df6062645cd1','withdrawal',500000,24916000,24416000,'출금 신청 완료: 500,000원','with_40f301d897c6','2025-08-21 10:12:45'),
('f2fa34a3-7e2b-11f0-a232-020017017948','93b59fa5-d9f7-47da-9883-df6062645cd1','withdrawal',500000,24416000,23916000,'출금 신청 완료: 500,000원','with_d0a031a31b3d','2025-08-21 10:12:47');
/*!40000 ALTER TABLE `mileage_transactions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notices` (
  `id` varchar(255) NOT NULL,
  `title` varchar(500) NOT NULL COMMENT '공지사항 제목',
  `content` text NOT NULL COMMENT '공지사항 내용',
  `author` varchar(100) NOT NULL COMMENT '작성자',
  `isImportant` tinyint(1) DEFAULT 0 COMMENT '중요 공지 여부',
  `viewCount` int(11) DEFAULT 0 COMMENT '조회수',
  `status` enum('published','draft','archived') DEFAULT 'published' COMMENT '게시 상태',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_isImportant` (`isImportant`),
  KEY `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='공지사항 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` varchar(255) NOT NULL COMMENT '결제 ID',
  `bookingId` varchar(255) NOT NULL COMMENT '예약 ID',
  `amount` int(11) NOT NULL COMMENT '결제 금액',
  `paymentMethod` enum('bank_transfer','card','cash') DEFAULT 'bank_transfer' COMMENT '결제 방식',
  `status` enum('pending','completed','failed','cancelled') DEFAULT 'pending' COMMENT '결제 상태',
  `paidAt` datetime DEFAULT NULL COMMENT '결제 완료일',
  `bankName` varchar(100) DEFAULT NULL COMMENT '입금 은행명',
  `accountHolder` varchar(100) DEFAULT NULL COMMENT '입금자명',
  `adminMemo` text DEFAULT NULL COMMENT '관리자 메모',
  `createdAt` timestamp NULL DEFAULT current_timestamp() COMMENT '생성일',
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
  PRIMARY KEY (`id`),
  KEY `idx_payments_bookingId` (`bookingId`),
  KEY `idx_payments_status` (`status`),
  KEY `idx_payments_paidAt` (`paidAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='결제 관리 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `payments` VALUES
('payment_1754383227082_897','7a31b6a5-658d-49fe-af55-b0f580fffa73',1780000,'bank_transfer','completed','2025-08-05 08:40:27',NULL,NULL,NULL,'2025-08-05 08:40:27','2025-08-05 08:40:27'),
('payment_1754383275370_166','298951ce-f5c0-4bc5-acb5-825c9d1c0302',890000,'bank_transfer','completed','2025-08-05 08:41:15','국민은행','김병일','01023654569','2025-08-05 08:41:15','2025-08-05 08:41:15'),
('payment_1755564647511_55','3522b906-30c4-4c81-8b87-69352e5c36df',2670000,'bank_transfer','completed','2025-08-19 00:50:47',NULL,NULL,NULL,'2025-08-19 00:50:47','2025-08-19 00:50:47'),
('payment_1755564655127_124','9c39645b-07ef-4567-9d6f-8797909dc14c',890000,'bank_transfer','completed','2025-08-19 00:50:55',NULL,NULL,NULL,'2025-08-19 00:50:55','2025-08-19 00:50:55');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `regions` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `parent_id` varchar(50) DEFAULT NULL,
  `level` enum('continent','country','city') NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `regions_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `regions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regions`
--

LOCK TABLES `regions` WRITE;
/*!40000 ALTER TABLE `regions` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `regions` VALUES
('africa','아프리카',NULL,'continent',5,1),
('africa-sub','아프리카','europe-africa-menu','city',5,1),
('americas','미주',NULL,'continent',1,1),
('asia','아시아',NULL,'continent',3,1),
('asia-menu','아시아/동남아',NULL,'continent',13,1),
('beijing','베이징','china','city',1,1),
('brazil','브라질','americas','country',4,1),
('brazil-sub','브라질','canada-americas-menu','city',4,1),
('canada','캐나다','americas','country',2,1),
('canada-americas-menu','캐나다/중남미',NULL,'continent',11,1),
('canada-sub','캐나다','canada-americas-menu','city',1,1),
('china','중국','asia-menu','country',2,1),
('chungcheong','충청도','domestic','city',3,1),
('cuba','쿠바','americas','country',5,1),
('cuba-sub','쿠바','canada-americas-menu','city',3,1),
('deals','특가할인상품',NULL,'continent',15,1),
('deals-early-bird','얼리버드','deals','country',1,1),
('deals-exclusive','독점상품','deals','country',2,1),
('deals-last-minute','막판특가','deals','country',3,1),
('domestic','국내',NULL,'continent',6,1),
('europe','유럽',NULL,'continent',2,1),
('europe-africa-menu','유럽/아프리카',NULL,'continent',12,1),
('europe-east','동유럽','europe-africa-menu','city',2,1),
('europe-north','북유럽','europe-africa-menu','city',3,1),
('europe-south','남유럽','europe-africa-menu','city',4,1),
('europe-west','서유럽','europe-africa-menu','city',1,1),
('france','프랑스','europe','country',1,1),
('gangwon','강원도','domestic','city',2,1),
('germany','독일','europe','country',4,1),
('gyeongsang','경상도','domestic','city',5,1),
('hongkong-macau','홍콩/마카오','asia-menu','country',7,1),
('italy','이탈리아','europe','country',2,1),
('japan','일본','asia-menu','country',1,1),
('jeju','제주도','domestic','city',6,1),
('jeolla','전라도','domestic','city',4,1),
('korea','대한민국','domestic','country',1,1),
('mexico','멕시코','americas','country',3,1),
('mexico-sub','멕시코','canada-americas-menu','city',2,1),
('oceania','오세아니아',NULL,'continent',4,1),
('osaka','오사카','japan','city',2,1),
('seoul','서울/수도권','domestic','city',1,1),
('shanghai','상하이','china','city',2,1),
('singapore','싱가포르','asia-menu','country',5,1),
('spain','스페인','europe','country',3,1),
('staycation','호캠스',NULL,'continent',14,1),
('staycation-hotels','호텔','staycation','country',1,1),
('staycation-pool-villas','풀빌라','staycation','country',3,1),
('staycation-resorts','리조트','staycation','country',2,1),
('taiwan','대만','asia-menu','country',6,1),
('thailand','태국','asia-menu','country',3,1),
('tokyo','도쿄','japan','city',1,1),
('uk','영국','europe','country',5,1),
('usa','미국','americas','country',1,1),
('usa-alaska','알래스카','usa-menu','city',4,1),
('usa-east','동부','usa-menu','city',1,1),
('usa-hawaii','하와이','usa-menu','city',3,1),
('usa-menu','미국여행',NULL,'continent',10,1),
('usa-west','서부','usa-menu','city',2,1),
('vietnam','베트남','asia-menu','country',4,1);
/*!40000 ALTER TABLE `regions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` varchar(36) NOT NULL,
  `tourId` varchar(36) DEFAULT NULL,
  `bookingId` varchar(36) DEFAULT NULL,
  `userId` varchar(36) DEFAULT NULL,
  `customerName` varchar(100) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `images` text DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `editedBy` varchar(255) DEFAULT NULL COMMENT '수정한 관리자 ID',
  `editReason` text DEFAULT NULL COMMENT '수정 사유',
  `originalContent` text DEFAULT NULL COMMENT '원본 내용 (수정 시 백업)',
  `originalRating` int(11) DEFAULT NULL COMMENT '원본 별점 (수정 시 백업)',
  `editCount` int(11) DEFAULT 0 COMMENT '수정 횟수',
  PRIMARY KEY (`id`),
  KEY `tourId` (`tourId`),
  KEY `bookingId` (`bookingId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `reviews` VALUES
('1b1c9903-2e26-4828-b67e-38891047e2fc','7ad22fe7-2172-4505-bd20-0da6091638c8','dummy_1755497713927','febda45a-9339-4401-b9f9-f2449063785b','김병일',4,'ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ','[]','approved','2025-08-18 15:15:13','2025-08-18 15:24:05',NULL,NULL,NULL,NULL,0),
('4ab491e5-583e-42d4-bd74-28584d31ab3e','7ad22fe7-2172-4505-bd20-0da6091638c8','dummy_1755155655883',NULL,'asdfasdfasdf',5,'asdfasdfasdfasdfasdfasdfasdfasdfasdf','[]','approved','2025-08-14 16:14:15','2025-08-18 12:11:29',NULL,NULL,NULL,NULL,0),
('54e406eb-ec25-472d-b202-f260eb94e1a0','7ad22fe7-2172-4505-bd20-0da6091638c8','dummy_1755579919013','febda45a-9339-4401-b9f9-f2449063785b','김민제111',4,'ㅁㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㅎㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ 11111111','[]','rejected','2025-08-19 14:05:21','2025-08-21 09:55:19','freitag1',NULL,'ㅁㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㅎㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ',4,1),
('5a9538a5-ea4c-4f36-9447-465d1a9b2c5d',NULL,NULL,NULL,'ㅅㄷㄴㅅ',4,'ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ','[]','approved','2025-08-14 15:45:00','2025-08-14 15:45:10',NULL,NULL,NULL,NULL,0),
('a5ae36aa-0089-4876-b466-b6a98d0094d7',NULL,NULL,NULL,'freitag1',4,'asdfasdfasdfasdfasdfasdfasdfasdf','[]','approved','2025-08-14 15:30:43','2025-08-14 15:30:58',NULL,NULL,NULL,NULL,0),
('b2d37397-2031-4f7a-bd6b-cfde37efddfd',NULL,NULL,NULL,'ㅁㄴㅇㄹㅁㄴㅈㅇㄹ',4,'ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ','[]','approved','2025-08-14 15:48:29','2025-08-14 15:48:38',NULL,NULL,NULL,NULL,0),
('d2b652cc-64ec-4d63-b866-946e2040d61e','7ad22fe7-2172-4505-bd20-0da6091638c8','dummy_1755490277531',NULL,'김민제',5,'너무 좋은 여행이었습니다. ','[]','approved','2025-08-18 13:11:17','2025-08-19 09:41:50',NULL,NULL,NULL,NULL,0),
('fd18d888-88df-466c-8698-d3c8b4acc639','0093487d-9193-4269-bacc-282765ce64cc','dummy_1755649929458','93b59fa5-d9f7-47da-9883-df6062645cd1','장미',5,'dsadasdsadasdsadsadas','[]','rejected','2025-08-20 09:32:09','2025-08-21 10:10:39',NULL,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `site_settings` VALUES
(1,'site_logo','/uploads/site/logo_1756608593962_kroz5cy3w4m.png','사이트 메인 로고 이미지 경로','2025-08-30 17:56:42','2025-08-31 02:49:53'),
(2,'site_favicon','/images/default-favicon.ico','사이트 파비콘 이미지 경로','2025-08-30 17:56:42','2025-08-30 17:56:42'),
(3,'site_title','Hana-Tour','사이트 제목','2025-08-30 17:56:42','2025-08-30 17:56:42'),
(4,'site_description','프리미엄 여행 예약 플랫폼','사이트 설명','2025-08-30 17:56:42','2025-08-30 17:56:42'),
(89,'logo_size','80','로고 크기 (픽셀)','2025-08-31 13:53:45','2025-08-31 14:17:57');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `tour_menu_mappings`
--

DROP TABLE IF EXISTS `tour_menu_mappings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_menu_mappings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tour_id` varchar(255) NOT NULL,
  `menu_category_id` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0 COMMENT '주 카테고리 여부',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_tour_menu` (`tour_id`,`menu_category_id`),
  KEY `idx_tour_id` (`tour_id`),
  KEY `idx_menu_category_id` (`menu_category_id`),
  KEY `idx_primary_category` (`is_primary`),
  CONSTRAINT `tour_menu_mappings_ibfk_1` FOREIGN KEY (`menu_category_id`) REFERENCES `menu_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='투어-메뉴 연결 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_menu_mappings`
--

LOCK TABLES `tour_menu_mappings` WRITE;
/*!40000 ALTER TABLE `tour_menu_mappings` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `tour_menu_mappings` VALUES
(1,'7ad22fe7-2172-4505-bd20-0da6091638c8','japan',1,'2025-07-24 13:07:56');
/*!40000 ALTER TABLE `tour_menu_mappings` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `tours`
--

DROP TABLE IF EXISTS `tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tours` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `images` text DEFAULT NULL,
  `mainImage` varchar(255) DEFAULT NULL,
  `departureDate` datetime NOT NULL COMMENT '출발일시',
  `maxParticipants` int(11) DEFAULT NULL,
  `currentParticipants` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `included` text DEFAULT NULL,
  `excluded` text DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `reviewCount` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `continent` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_region` (`region`),
  KEY `idx_status` (`status`),
  KEY `idx_departureDate` (`departureDate`),
  KEY `idx_price` (`price`),
  KEY `idx_status_region` (`status`,`region`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours`
--

LOCK TABLES `tours` WRITE;
/*!40000 ALTER TABLE `tours` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `tours` VALUES
('0093487d-9193-4269-bacc-282765ce64cc','호주 시드니 & 멜버른 6박7일','호주의 대표 도시 시드니와 멜버른을 모두 경험하는 여행. 오페라하우스, 하버브릿지, 그레이트 오션로드 등을 방문합니다.','[\"https://images.unsplash.com/photo-1523482580672-f109ba8cb9be\",\"https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9\",\"https://images.unsplash.com/photo-1514395462725-fb4566210144\"]','https://images.unsplash.com/photo-1523482580672-f109ba8cb9be','2025-12-01 00:00:00',20,1,2390000,'[\"왕복항공료\",\"6박 호텔\",\"국내선\",\"시티투어\",\"블루마운틴투어\"]','[\"식사\",\"선택관광\",\"개인경비\"]','sydney','published',0,0,'2025-07-22 16:16:37','2025-08-20 10:24:19','oceania','australia'),
('04e3cc23-aa33-4af5-a04d-08b45b5587c9','호주 시드니 & 멜버른 6박7일','호주의 대표 도시 시드니와 멜버른을 모두 경험하는 여행. 오페라하우스, 하버브릿지, 그레이트 오션로드 등을 방문합니다.','[\"https://images.unsplash.com/photo-1523482580672-f109ba8cb9be\",\"https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9\",\"https://images.unsplash.com/photo-1514395462725-fb4566210144\"]','https://images.unsplash.com/photo-1523482580672-f109ba8cb9be','2024-06-01 00:00:00',20,0,2390000,'[\"왕복항공료\",\"6박 호텔\",\"국내선\",\"시티투어\",\"블루마운틴투어\"]','[\"식사\",\"선택관광\",\"개인경비\"]','sydney','published',0,0,'2025-08-20 17:25:04','2025-08-20 17:25:04','oceania','australia'),
('13591fe7-bf34-4775-b669-54a8e67b7df2','파리 & 런던 7일 자유여행','유럽의 낭만 도시 파리와 런던을 자유롭게 탐방하는 일정. 에펠탑, 루브르 박물관, 빅벤, 타워브릿지 등 유명 관광지를 둘러봅니다.','[\"https://images.unsplash.com/photo-1502602898657-3e91760cbb34\",\"https://images.unsplash.com/photo-1513635269975-59663e0ac1ad\",\"https://images.unsplash.com/photo-1486299267070-83823f5448dd\"]','https://images.unsplash.com/photo-1502602898657-3e91760cbb34','2026-12-20 00:00:00',15,0,2290000,'[\"왕복항공료\",\"6박 호텔\",\"유로스타 티켓\",\"공항 픽업\"]','[\"식사\",\"입장료\",\"개인경비\"]','paris','published',0,0,'2025-07-22 16:16:37','2025-08-20 10:18:50','europe','france'),
('18f3dc9e-efa8-4d79-8c69-7ca94f2b11e2','파리 & 런던 7일 자유여행','유럽의 낭만 도시 파리와 런던을 자유롭게 탐방하는 일정. 에펠탑, 루브르 박물관, 빅벤, 타워브릿지 등 유명 관광지를 둘러봅니다.','[\"https://images.unsplash.com/photo-1502602898657-3e91760cbb34\",\"https://images.unsplash.com/photo-1513635269975-59663e0ac1ad\",\"https://images.unsplash.com/photo-1486299267070-83823f5448dd\"]','https://images.unsplash.com/photo-1502602898657-3e91760cbb34','2024-05-20 00:00:00',15,0,2290000,'[\"왕복항공료\",\"6박 호텔\",\"유로스타 티켓\",\"공항 픽업\"]','[\"식사\",\"입장료\",\"개인경비\"]','paris','published',0,0,'2025-08-20 17:25:04','2025-08-20 17:25:04','europe','france'),
('21ac7e97-2936-495d-9249-3ee89a933994','일본 오사카 3박4일 벚꽃여행','오사카성과 교토의 아름다운 벚꽃을 만끽하는 봄 시즌 특별 여행. 일본의 전통 정원과 사찰을 방문하며 벚꽃의 아름다움을 느낄 수 있습니다.','[\"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e\",\"https://images.unsplash.com/photo-1545569341-9eb8b30979d9\",\"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf\"]','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e','2024-04-15 00:00:00',20,0,890000,'[\"왕복항공료\",\"3박 호텔\",\"조식 3회\",\"전용차량\",\"가이드\"]','[\"중식/석식\",\"개인경비\",\"여행자보험\"]','osaka','published',0,0,'2025-08-20 17:25:04','2025-08-20 17:25:04','asia','japan'),
('424533a6-239c-47b7-95eb-220b74642baa','태국 방콕 & 파타야 5박6일','태국의 수도 방콕과 해변 도시 파타야를 모두 경험하는 여행. 왓 포 사원, 수상시장, 파타야 비치 등을 방문합니다.','[\"https://images.unsplash.com/photo-1506905925346-21bda4d32df4\",\"https://images.unsplash.com/photo-1528181304800-259b08848526\",\"https://images.unsplash.com/photo-1552465011-b4e21bf6e79a\"]','https://images.unsplash.com/photo-1506905925346-21bda4d32df4','2024-04-25 00:00:00',22,0,750000,'[\"왕복항공료\",\"5박 호텔\",\"조식\",\"시티투어\",\"쇼 관람\"]','[\"중식/석식\",\"마사지\",\"개인경비\"]','bangkok','published',0,0,'2025-08-20 17:25:04','2025-08-20 17:25:04','asia','thailand'),
('489b730d-16a1-4514-9c8f-282db7a910b7','test: 일본 도쿄 3박4일 자유여행','도쿄의 핫플레이스를 자유롭게 탐방하는 여행입니다. 신주쿠, 시부야, 하라주쿠 등 주요 관광지를 방문하며 일본의 전통과 현대를 모두 경험할 수 있습니다.','[\"/uploads/tours/tour_1755678300112_zpdbm4754o.jpg\",\"/uploads/tours/tour_1755678304662_srkm3l609b.jpg\",\"/uploads/tours/tour_1755678310549_h0tr5xeir76.jpg\"]','/uploads/tours/tour_1755678294511_s5oqk8lf4g.jpg','2024-03-14 00:00:00',20,0,890000,'[\"왕복항공료\",\"숙박(3박)\",\"조식\",\"가이드서비스\"]','[\"개인경비\",\"선택관광\",\"여행자보험\"]','japan','published',0,0,'2025-08-20 17:24:33','2025-08-20 17:36:59','Asia','Japan'),
('5fec34ff-0028-47d9-be79-0ec2e03c199c','제주도 2박3일 힐링여행','제주의 아름다운 자연과 맛집을 즐기는 국내 힐링 여행. 성산일출봉, 천지연폭포, 우도 등 제주의 대표 관광지를 방문합니다.','[\"https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0\",\"https://images.unsplash.com/photo-1615400014497-55bbc6b635c1\",\"https://images.unsplash.com/photo-1551632811-561732d1e306\"]','https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0','2024-03-25 00:00:00',30,0,299000,'[\"왕복항공료\",\"2박 호텔\",\"렌터카\",\"조식 2회\"]','[\"중식/석식\",\"입장료\",\"개인경비\"]','jeju','published',0,0,'2025-08-20 17:25:04','2025-08-20 17:25:04','domestic','korea'),
('64608f13-d8a6-43c0-8363-6ca337058b4e','뉴욕 5박6일 도시탐방','미국 동부의 중심 뉴욕을 완벽하게 경험하는 여행. 자유의 여신상, 엠파이어 스테이트 빌딩, 센트럴파크, 타임스퀘어 등을 방문합니다.','[\"https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9\",\"https://images.unsplash.com/photo-1534430480872-3498386e7856\",\"https://images.unsplash.com/photo-1522083165195-3424ed129620\"]','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9','2024-06-15 00:00:00',18,0,1890000,'[\"왕복항공료\",\"5박 호텔\",\"시티투어버스\",\"뮤지컬 티켓\"]','[\"식사\",\"쇼핑\",\"개인경비\"]','new-york','unpublished',0,0,'2025-08-20 17:25:04','2025-08-20 17:25:04','americas','usa'),
('68557eea-079e-465b-88a5-141b3b0e9422','뉴욕 5박6일 도시탐방','미국 동부의 중심 뉴욕을 완벽하게 경험하는 여행. 자유의 여신상, 엠파이어 스테이트 빌딩, 센트럴파크, 타임스퀘어 등을 방문합니다.','[\"https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9\",\"https://images.unsplash.com/photo-1534430480872-3498386e7856\",\"https://images.unsplash.com/photo-1522083165195-3424ed129620\"]','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9','2026-12-20 00:00:00',18,0,1890000,'[\"왕복항공료\",\"5박 호텔\",\"시티투어버스\",\"뮤지컬 티켓\"]','[\"식사\",\"쇼핑\",\"개인경비\"]','new-york','published',0,0,'2025-07-22 16:16:37','2025-08-20 10:22:29','americas','usa'),
('6e9a56bb-4401-46dd-b3da-9cbfe7b4a6cb','예시: 일본 도쿄 3박4일 자유여행','도쿄의 핫플레이스를 자유롭게 탐방하는 여행입니다. 신주쿠, 시부야, 하라주쿠 등 주요 관광지를 방문하며 일본의 전통과 현대를 모두 경험할 수 있습니다.','[\"/uploads/tours/tour_1755526152790_cbiqqp2t5zi.jpg\",\"/uploads/tours/tour_1755526157630_kmmaabrpc3i.jpg\",\"/uploads/tours/tour_1755526162940_1euuwfya40vj.jpg\"]','/uploads/tours/tour_1755526148445_4mq250v2nqf.jpg','2026-12-20 00:00:00',20,0,890000,'[\"왕복항공료\",\"숙박(3박)\",\"조식\",\"가이드서비스\"]','[\"개인경비\",\"선택관광\",\"여행자보험\"]','tokyo','published',0,0,'2025-07-22 16:16:37','2025-08-20 10:22:46','asia','japan'),
('79157a9d-9587-452f-98af-81eeb2ba1f1b','제주도 2박3일 힐링여행','제주의 아름다운 자연과 맛집을 즐기는 국내 힐링 여행. 성산일출봉, 천지연폭포, 우도 등 제주의 대표 관광지를 방문합니다.','[\"https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0\",\"https://images.unsplash.com/photo-1615400014497-55bbc6b635c1\",\"https://images.unsplash.com/photo-1551632811-561732d1e306\"]','https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0','2026-12-20 00:00:00',30,0,299000,'[\"왕복항공료\",\"2박 호텔\",\"렌터카\",\"조식 2회\"]','[\"중식/석식\",\"입장료\",\"개인경비\"]','jeju','published',0,0,'2025-07-22 16:16:37','2025-08-20 10:20:13','domestic','korea'),
('7ad22fe7-2172-4505-bd20-0da6091638c8','일본 오사카 3박4일 벚꽃여행','오사카성과 교토의 아름다운 벚꽃을 만끽하는 봄 시즌 특별 여행. 일본의 전통 정원과 사찰을 방문하며 벚꽃의 아름다움을 느낄 수 있습니다.','[\"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e\",\"https://images.unsplash.com/photo-1545569341-9eb8b30979d9\",\"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf\"]','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e','2026-12-20 00:00:00',20,6,890000,'[\"왕복항공료\",\"3박 호텔\",\"조식 3회\",\"전용차량\",\"가이드\"]','[\"중식/석식\",\"개인경비\",\"여행자보험\"]','japan','published',4.6667,3,'2025-07-22 16:16:37','2025-08-21 09:55:17','Asia','Japan'),
('7c3664bd-7f80-48ce-ad86-78c6cdfa910b','중국 베이징 4박5일 역사탐방','중국의 수도 베이징에서 만나는 유구한 역사. 만리장성, 천안문 광장, 자금성, 이화원 등 중국의 대표 유적지를 방문합니다.','[\"https://images.unsplash.com/photo-1508804185872-d7badad00f7d\",\"https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2\",\"https://images.unsplash.com/photo-1545558014-8692077e9b5c\"]','https://images.unsplash.com/photo-1508804185872-d7badad00f7d','2026-12-20 00:00:00',18,0,890000,'[\"왕복항공료\",\"4박 호텔\",\"전 식사\",\"전용차량\",\"한국어 가이드\"]','[\"개인경비\",\"선택관광\",\"팁\"]','china','published',0,0,'2025-07-22 16:16:37','2025-08-20 10:20:51','Asia','China'),
('9376bb79-c466-40db-9275-b3e918f70d0e','스페인 바르셀로나 & 마드리드 6일','스페인의 대표 도시들을 탐방하는 여행. 가우디의 건축물, 프라도 미술관, 플라멩코 쇼 등 스페인 문화를 체험합니다.','[\"https://images.unsplash.com/photo-1509845350455-fb0c36048db1\",\"https://images.unsplash.com/photo-1555881400-74d7acaacd8b\",\"/uploads/tours/tour_1755525070038_tygry7x0aa.jpg\"]','https://images.unsplash.com/photo-1509845350455-fb0c36048db1','2026-12-20 00:00:00',20,0,2290000,'[\"왕복항공료\",\"5박 호텔\",\"전용버스\",\"한국어 가이드\",\"입장료\"]','[\"식사\",\"개인경비\",\"선택관광\"]','europe-west','published',0,0,'2025-07-22 16:16:37','2025-08-20 10:21:16','Europe','Spain'),
('ac6bcefa-87c0-4cba-8b9f-14749dd692f7','태국 방콕 & 파타야 5박6일','태국의 수도 방콕과 해변 도시 파타야를 모두 경험하는 여행. 왓 포 사원, 수상시장, 파타야 비치 등을 방문합니다.111','[\"https://images.unsplash.com/photo-1506905925346-21bda4d32df4\",\"https://images.unsplash.com/photo-1528181304800-259b08848526\",\"https://images.unsplash.com/photo-1552465011-b4e21bf6e79a\"]','https://images.unsplash.com/photo-1506905925346-21bda4d32df4','2026-12-20 00:00:00',22,0,750000,'[\"왕복항공료\",\"5박 호텔\",\"조식\",\"시티투어\",\"쇼 관람\"]','[\"중식/석식\",\"마사지\",\"개인경비\"]','thailand','published',0,0,'2025-07-22 16:16:37','2025-08-20 10:21:34','Asia','Thailand'),
('b55a73fa-4654-49e6-8cb9-653eeeb098fa','중국 베이징 4박5일 역사탐방','중국의 수도 베이징에서 만나는 유구한 역사. 만리장성, 천안문 광장, 자금성, 이화원 등 중국의 대표 유적지를 방문합니다.','[\"https://images.unsplash.com/photo-1508804185872-d7badad00f7d\",\"https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2\",\"https://images.unsplash.com/photo-1545558014-8692077e9b5c\"]','https://images.unsplash.com/photo-1508804185872-d7badad00f7d','2024-05-10 00:00:00',18,0,890000,'[\"왕복항공료\",\"4박 호텔\",\"전 식사\",\"전용차량\",\"한국어 가이드\"]','[\"개인경비\",\"선택관광\",\"팁\"]','beijing','published',0,0,'2025-08-20 17:25:04','2025-08-20 17:25:04','asia','china'),
('b95e163b-9d94-4bbf-9051-8e4454726526','베트남 다낭 4박5일 리조트','다낭의 아름다운 해변과 리조트에서 즐기는 휴양 여행. 바나힐, 호이안 고도시, 미케비치 등을 방문하며 베트남의 매력을 만끽합니다.','[\"https://images.unsplash.com/photo-1559592413-7cec4d0cae2b\",\"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b\",\"https://images.unsplash.com/photo-1528127269322-539801943592\"]','https://images.unsplash.com/photo-1559592413-7cec4d0cae2b','2026-12-20 00:00:00',25,0,690000,'[\"왕복항공료\",\"4박 리조트\",\"조식\",\"공항 픽업\"]','[\"중식/석식\",\"액티비티\",\"팁\"]','danang','published',0,0,'2025-07-22 16:16:37','2025-08-20 10:21:55','asia','vietnam'),
('dbaac095-fc31-4c98-a9de-3b7d842e7e66','예시: 일본 도쿄 3박4일 자유여행','도쿄의 핫플레이스를 자유롭게 탐방하는 여행입니다. 신주쿠, 시부야, 하라주쿠 등 주요 관광지를 방문하며 일본의 전통과 현대를 모두 경험할 수 있습니다.','[\"https://example.com/tokyo-main.jpg\",\"https://example.com/tokyo-1.jpg\",\"https://example.com/tokyo-2.jpg\"]','https://example.com/tokyo-main.jpg','2024-03-15 00:00:00',20,0,890000,'[\"왕복항공료\",\"숙박(3박)\",\"조식\",\"가이드서비스\"]','[\"개인경비\",\"선택관광\",\"여행자보험\"]','tokyo','unpublished',0,0,'2025-08-20 17:25:04','2025-08-20 17:25:04','asia','japan'),
('f253a692-c4ab-4997-baf6-eb702840a1df','스페인 바르셀로나 & 마드리드 6일','스페인의 대표 도시들을 탐방하는 여행. 가우디의 건축물, 프라도 미술관, 플라멩코 쇼 등 스페인 문화를 체험합니다.','[\"https://images.unsplash.com/photo-1509845350455-fb0c36048db1\",\"https://images.unsplash.com/photo-1555881400-74d7acaacd8b\",\"https://images.unsplash.com/photo-1555881400-69c7c3d8e4a5\"]','https://images.unsplash.com/photo-1509845350455-fb0c36048db1','2024-05-15 00:00:00',20,0,2290000,'[\"왕복항공료\",\"5박 호텔\",\"전용버스\",\"한국어 가이드\",\"입장료\"]','[\"식사\",\"개인경비\",\"선택관광\"]','barcelona','published',0,0,'2025-08-20 17:25:04','2025-08-20 17:25:04','europe','spain'),
('fa167f7b-8ae7-4903-ba85-6d83bca3319d','베트남 다낭 4박5일 리조트','다낭의 아름다운 해변과 리조트에서 즐기는 휴양 여행. 바나힐, 호이안 고도시, 미케비치 등을 방문하며 베트남의 매력을 만끽합니다.','[\"https://images.unsplash.com/photo-1559592413-7cec4d0cae2b\",\"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b\",\"https://images.unsplash.com/photo-1528127269322-539801943592\"]','https://images.unsplash.com/photo-1559592413-7cec4d0cae2b','2024-04-10 00:00:00',25,0,690000,'[\"왕복항공료\",\"4박 리조트\",\"조식\",\"공항 픽업\"]','[\"중식/석식\",\"액티비티\",\"팁\"]','danang','published',0,0,'2025-08-20 17:25:04','2025-08-20 17:25:04','asia','vietnam'),
('tour_1755525996542_itewkwblc','test','test','[\"/uploads/tours/tour_1755526084957_qsh03wonou.jpg\"]','/uploads/tours/tour_1755526076409_mfyx36bkmy.jpg','2025-09-05 00:00:00',1,NULL,5000000,'[]','[]','europe-west','unpublished',NULL,NULL,'2025-08-18 23:06:36','2025-08-18 23:08:52','Europe','Spain');
/*!40000 ALTER TABLE `tours` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Temporary table structure for view `user_wishlist_stats`
--

DROP TABLE IF EXISTS `user_wishlist_stats`;
/*!50001 DROP VIEW IF EXISTS `user_wishlist_stats`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `user_wishlist_stats` AS SELECT
 1 AS `userId`,
  1 AS `username`,
  1 AS `name`,
  1 AS `wishlistCount`,
  1 AS `lastWishlistDate` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `nickname` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'customer',
  `status` varchar(20) DEFAULT 'pending',
  `createdAt` datetime DEFAULT current_timestamp(),
  `lastLogin` datetime DEFAULT NULL,
  `mileage` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `users` VALUES
('40ec318c-85ca-11f0-bc84-9e5b0e551c7d','admin@localhost','관리자','admin@localhost','$2b$10$26cJuYGUit2x.RTcx1xDD.atgV3EpSFGPXMI7.YsKeWIgPvYMsRP.','관리자',NULL,NULL,NULL,'admin','approved','2025-08-31 02:53:36','2025-08-31 23:13:49',0),
('47768c9c-6d07-11f0-a232-020017017948','admin','','admin@hanatour.com','$2a$10$7QJQwQnQwQnQwQnQwQnQOeQwQnQwQnQwQnQwQnQwQnQwQnQwQnQ','관리자','010-1234-5678','1990-01-01','서울시 강남구','admin','approved','2025-07-30 14:37:27',NULL,0),
('68193827-20f3-4c85-a8f1-ac3a4b5feffe','admin123','','admin123@hanatour.com','$2b$10$27WlFsveGFkpn/j5UmUuC.ptqMtjqgrDKDRidfCrmnzEtV.PDeupS','','010-1234-5678','2025-07-03','','admin','approved','2025-07-30 15:42:46','2025-08-22 16:26:31',0),
('93b59fa5-d9f7-47da-9883-df6062645cd1','ROSE','ROSE','qweasd@naver.com','$2b$10$lAdj0N5kDTYCzsMGrFJh8us840sVAIYv7DHYYRJWwlbpfY2kkOSKu','장미','010-7352-6216','1995-06-19','','customer','approved','2025-08-19 09:43:34','2025-08-22 09:04:36',23916000),
('febda45a-9339-4401-b9f9-f2449063785b','freitag1','김민제','freitag1@naver.com','$2b$10$NnnzN4QyWmFkKAt075Us...uPI0XLxrpYkR4EWvc4GfxFX.DVI72a','김민제111','010-5312-8964','1978-10-06','서울 양천구 공항대로 530','admin','approved','2025-07-30 14:25:30','2025-08-21 11:57:19',6000);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Temporary table structure for view `v_active_sessions_summary`
--

DROP TABLE IF EXISTS `v_active_sessions_summary`;
/*!50001 DROP VIEW IF EXISTS `v_active_sessions_summary`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `v_active_sessions_summary` AS SELECT
 1 AS `id`,
  1 AS `user_id`,
  1 AS `username`,
  1 AS `email`,
  1 AS `ip_address`,
  1 AS `device`,
  1 AS `location`,
  1 AS `login_time`,
  1 AS `last_activity`,
  1 AS `is_active`,
  1 AS `session_minutes` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_recent_access_logs`
--

DROP TABLE IF EXISTS `v_recent_access_logs`;
/*!50001 DROP VIEW IF EXISTS `v_recent_access_logs`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `v_recent_access_logs` AS SELECT
 1 AS `id`,
  1 AS `user_id`,
  1 AS `username`,
  1 AS `email`,
  1 AS `action`,
  1 AS `ip_address`,
  1 AS `device`,
  1 AS `location`,
  1 AS `status`,
  1 AS `created_at` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `id` varchar(36) NOT NULL COMMENT '찜하기 ID',
  `userId` varchar(36) NOT NULL COMMENT '사용자 ID',
  `tourId` varchar(36) NOT NULL COMMENT '여행상품 ID',
  `tourTitle` varchar(500) NOT NULL COMMENT '여행상품 제목',
  `mainImage` varchar(500) DEFAULT NULL COMMENT '대표 이미지 URL',
  `price` int(11) NOT NULL COMMENT '가격',
  `departureDate` date NOT NULL COMMENT '출발일',
  `region` enum('asia','europe','americas','oceania','africa','domestic') NOT NULL COMMENT '지역',
  `createdAt` timestamp NULL DEFAULT current_timestamp() COMMENT '찜한 날짜',
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정 날짜',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_tour` (`userId`,`tourId`),
  KEY `idx_userId` (`userId`),
  KEY `idx_tourId` (`tourId`),
  KEY `idx_createdAt` (`createdAt`),
  KEY `idx_region` (`region`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='찜하기 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `wishlist` VALUES
('wish_1755764404333_a8i6v2zun','febda45a-9339-4401-b9f9-f2449063785b','13591fe7-bf34-4775-b669-54a8e67b7df2','파리 & 런던 7일 자유여행','https://images.unsplash.com/photo-1502602898657-3e91760cbb34',2290000,'2026-12-20','asia','2025-08-21 08:20:04','2025-08-21 08:20:04'),
('wish_1755764406027_r6idj86zv','febda45a-9339-4401-b9f9-f2449063785b','04e3cc23-aa33-4af5-a04d-08b45b5587c9','호주 시드니 & 멜버른 6박7일','https://images.unsplash.com/photo-1523482580672-f109ba8cb9be',2390000,'2024-06-01','asia','2025-08-21 08:20:06','2025-08-21 08:20:06'),
('wish_1755764406825_e2f011w2d','febda45a-9339-4401-b9f9-f2449063785b','0093487d-9193-4269-bacc-282765ce64cc','호주 시드니 & 멜버른 6박7일','https://images.unsplash.com/photo-1523482580672-f109ba8cb9be',2390000,'2025-12-01','asia','2025-08-21 08:20:06','2025-08-21 08:20:06'),
('wish_1755764407756_wqzu152wc','febda45a-9339-4401-b9f9-f2449063785b','7ad22fe7-2172-4505-bd20-0da6091638c8','일본 오사카 3박4일 벚꽃여행','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',890000,'2026-12-20','asia','2025-08-21 08:20:07','2025-08-21 08:20:07'),
('wish_1755764444771_hsuf2b6vn','febda45a-9339-4401-b9f9-f2449063785b','5fec34ff-0028-47d9-be79-0ec2e03c199c','제주도 2박3일 힐링여행','https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0',299000,'2024-03-25','domestic','2025-08-21 08:20:44','2025-08-21 08:20:44');
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Temporary table structure for view `wishlist_stats`
--

DROP TABLE IF EXISTS `wishlist_stats`;
/*!50001 DROP VIEW IF EXISTS `wishlist_stats`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `wishlist_stats` AS SELECT
 1 AS `tourId`,
  1 AS `tourTitle`,
  1 AS `wishlistCount`,
  1 AS `price`,
  1 AS `region`,
  1 AS `departureDate` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `withdrawal_applications`
--

DROP TABLE IF EXISTS `withdrawal_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdrawal_applications` (
  `id` varchar(36) NOT NULL COMMENT '출금 신청 ID',
  `userId` varchar(36) NOT NULL COMMENT '사용자 ID',
  `username` varchar(100) NOT NULL COMMENT '사용자 아이디',
  `applicantName` varchar(100) NOT NULL COMMENT '신청자명',
  `applicationType` enum('deposit','withdrawal') NOT NULL DEFAULT 'withdrawal' COMMENT '신청 종류',
  `amount` int(11) NOT NULL COMMENT '신청 금액',
  `bankName` varchar(50) NOT NULL COMMENT '출금 은행',
  `accountNumber` varchar(50) NOT NULL COMMENT '출금 계좌',
  `accountHolder` varchar(100) NOT NULL COMMENT '예금주',
  `status` enum('pending','processing','completed','rejected') NOT NULL DEFAULT 'pending' COMMENT '처리 상태',
  `adminNotes` text DEFAULT NULL COMMENT '관리자 메모',
  `transferCompletedAt` datetime DEFAULT NULL COMMENT '송금 완료 시간',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '신청 시간',
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정 시간',
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_status` (`status`),
  KEY `idx_createdAt` (`createdAt`),
  KEY `idx_applicationType` (`applicationType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='출금 신청 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawal_applications`
--

LOCK TABLES `withdrawal_applications` WRITE;
/*!40000 ALTER TABLE `withdrawal_applications` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `withdrawal_applications` VALUES
('with_001','user_001','john_doe','권영순','withdrawal',500000,'신한은행','110-123-456789','권영순','completed',NULL,'2025-08-19 09:40:22','2025-06-25 10:00:00','2025-08-19 09:40:22'),
('with_002','user_002','jane_smith','남혜진','withdrawal',300000,'우리은행','1002-123-456789','남혜진','completed',NULL,'2025-08-19 09:40:44','2025-06-25 09:30:00','2025-08-19 09:40:44'),
('with_40f301d897c6','93b59fa5-d9f7-47da-9883-df6062645cd1','ROSE','장미','withdrawal',500000,'농협','1231231231231','장미','completed',NULL,'2025-08-21 10:12:45','2025-08-20 09:42:22','2025-08-21 10:12:45'),
('with_7b10253a6dd8','93b59fa5-d9f7-47da-9883-df6062645cd1','ROSE','장미','withdrawal',5000,'22277488849939','277377499495','장미','rejected',NULL,'2025-08-19 09:50:02','2025-08-19 09:48:45','2025-08-19 09:50:02'),
('with_d0a031a31b3d','93b59fa5-d9f7-47da-9883-df6062645cd1','ROSE','장미','withdrawal',500000,'농협','156165165165156','장미','completed',NULL,'2025-08-21 10:12:47','2025-08-20 09:41:37','2025-08-21 10:12:47');
/*!40000 ALTER TABLE `withdrawal_applications` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping routines for database 'hanatour_db'
--

--
-- Final view structure for view `user_wishlist_stats`
--

/*!50001 DROP VIEW IF EXISTS `user_wishlist_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`admin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `user_wishlist_stats` AS select `u`.`id` AS `userId`,`u`.`username` AS `username`,`u`.`name` AS `name`,count(`w`.`id`) AS `wishlistCount`,max(`w`.`createdAt`) AS `lastWishlistDate` from (`users` `u` left join `wishlist` `w` on(`u`.`id` = `w`.`userId`)) group by `u`.`id`,`u`.`username`,`u`.`name` order by count(`w`.`id`) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_active_sessions_summary`
--

/*!50001 DROP VIEW IF EXISTS `v_active_sessions_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`admin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_active_sessions_summary` AS select `s`.`id` AS `id`,`s`.`user_id` AS `user_id`,`u`.`username` AS `username`,`u`.`email` AS `email`,`s`.`ip_address` AS `ip_address`,`s`.`device` AS `device`,`s`.`location` AS `location`,`s`.`login_time` AS `login_time`,`s`.`last_activity` AS `last_activity`,`s`.`is_active` AS `is_active`,round(timestampdiff(MINUTE,`s`.`login_time`,current_timestamp()),2) AS `session_minutes` from (`active_sessions` `s` left join `users` `u` on(`s`.`user_id` = `u`.`id`)) where `s`.`is_active` = 1 order by `s`.`last_activity` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_recent_access_logs`
--

/*!50001 DROP VIEW IF EXISTS `v_recent_access_logs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`admin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_recent_access_logs` AS select `al`.`id` AS `id`,`al`.`user_id` AS `user_id`,`u`.`username` AS `username`,`u`.`email` AS `email`,`al`.`action` AS `action`,`al`.`ip_address` AS `ip_address`,`al`.`device` AS `device`,`al`.`location` AS `location`,`al`.`status` AS `status`,`al`.`created_at` AS `created_at` from (`access_logs` `al` left join `users` `u` on(`al`.`user_id` = `u`.`id`)) where `al`.`created_at` >= current_timestamp() - interval 7 day order by `al`.`created_at` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `wishlist_stats`
--

/*!50001 DROP VIEW IF EXISTS `wishlist_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`admin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `wishlist_stats` AS select `t`.`id` AS `tourId`,`t`.`title` AS `tourTitle`,count(`w`.`id`) AS `wishlistCount`,`t`.`price` AS `price`,`t`.`region` AS `region`,`t`.`departureDate` AS `departureDate` from (`tours` `t` left join `wishlist` `w` on(`t`.`id` = `w`.`tourId`)) where `t`.`status` = 'published' group by `t`.`id`,`t`.`title`,`t`.`price`,`t`.`region`,`t`.`departureDate` order by count(`w`.`id`) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-08-31 23:21:37
