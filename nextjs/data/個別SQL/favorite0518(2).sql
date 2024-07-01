-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-05-18 15:57:59
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `baseball`
--

-- --------------------------------------------------------

--
-- 資料表結構 `favorite`
--

CREATE TABLE `favorite` (
  `id` int(5) NOT NULL,
  `user_id` int(5) NOT NULL,
  `product_id` int(5) NOT NULL,
  `class_id` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `favorite`
--

INSERT INTO `favorite` (`id`, `user_id`, `product_id`, `class_id`) VALUES
(1, 1, 2, 'P'),
(2, 1, 3, 'P'),
(3, 1, 1, 'C'),
(4, 1, 3, 'C'),
(5, 70, 2, 'R'),
(6, 70, 3, 'P'),
(7, 70, 7, 'R'),
(8, 70, 11, 'P'),
(9, 70, 18, 'P'),
(10, 70, 14, 'R'),
(11, 70, 79, 'R'),
(12, 70, 75, 'R'),
(13, 70, 66, 'P'),
(14, 70, 63, 'R'),
(15, 70, 118, 'R'),
(16, 70, 119, 'R'),
(17, 70, 117, 'P'),
(18, 70, 114, 'P'),
(19, 70, 111, 'R'),
(20, 70, 102, 'P'),
(21, 70, 122, 'P'),
(22, 70, 126, 'R'),
(23, 70, 127, 'P'),
(24, 70, 32, 'C'),
(25, 70, 15, 'C'),
(26, 70, 13, 'C'),
(27, 77, 6, 'C'),
(28, 70, 7, 'C'),
(29, 78, 2, 'P'),
(30, 78, 6, 'P'),
(31, 78, 11, 'R'),
(32, 70, 15, 'R'),
(33, 78, 17, 'P'),
(34, 78, 20, 'P'),
(35, 70, 58, 'R'),
(36, 78, 50, 'P'),
(37, 70, 51, 'P'),
(38, 70, 42, 'R'),
(39, 70, 44, 'R'),
(40, 70, 59, 'R'),
(41, 78, 98, 'P'),
(42, 78, 100, 'R'),
(43, 78, 95, 'P'),
(44, 78, 90, 'R'),
(45, 78, 86, 'R'),
(46, 78, 87, 'P'),
(47, 77, 82, 'R'),
(48, 78, 84, 'P'),
(49, 78, 130, 'P'),
(50, 78, 126, 'R'),
(51, 78, 122, 'P'),
(52, 78, 2, 'C'),
(53, 78, 4, 'C'),
(54, 70, 6, 'C'),
(55, 78, 11, 'C'),
(56, 70, 9, 'C'),
(57, 78, 19, 'C'),
(58, 70, 17, 'C'),
(59, 78, 28, 'C'),
(60, 78, 25, 'C'),
(61, 78, 33, 'C'),
(62, 59, 1, 'C'),
(63, 59, 14, 'R'),
(64, 70, 2, 'P');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `favorite`
--
ALTER TABLE `favorite`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `favorite`
--
ALTER TABLE `favorite`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
