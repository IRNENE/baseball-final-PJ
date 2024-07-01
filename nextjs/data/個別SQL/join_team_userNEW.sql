-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-05-20 15:14:27
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
-- 資料表結構 `join_team_user`
--

CREATE TABLE `join_team_user` (
  `id` int(4) UNSIGNED NOT NULL,
  `join_team_id` int(4) UNSIGNED NOT NULL,
  `user_id` int(4) UNSIGNED NOT NULL,
  `is_host` tinyint(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `join_team_user`
--

INSERT INTO `join_team_user` (`id`, `join_team_id`, `user_id`, `is_host`) VALUES
(1, 1, 70, 1),
(2, 2, 3, 1),
(3, 3, 21, 1),
(4, 4, 4, 1),
(5, 5, 10, 1),
(6, 6, 55, 1),
(7, 6, 12, 0),
(8, 6, 14, 0),
(9, 6, 25, 0),
(10, 6, 30, 0),
(11, 6, 8, 0),
(12, 6, 61, 0),
(13, 6, 1, 0),
(14, 6, 50, 0),
(15, 6, 9, 0),
(16, 6, 23, 0),
(17, 6, 11, 0),
(18, 6, 44, 0),
(19, 6, 33, 0),
(20, 6, 51, 0),
(21, 6, 52, 0),
(22, 6, 53, 0),
(23, 6, 70, 0),
(25, 7, 13, 1),
(27, 8, 14, 1),
(29, 9, 31, 1),
(30, 10, 32, 1),
(31, 11, 35, 1),
(32, 12, 37, 1),
(33, 13, 39, 1),
(34, 14, 41, 1),
(35, 15, 1, 1),
(36, 16, 46, 1),
(37, 17, 32, 1),
(38, 18, 42, 1),
(39, 19, 57, 1),
(40, 20, 5, 1),
(41, 21, 24, 1),
(42, 2, 29, 0),
(43, 1, 27, 0),
(44, 2, 30, 0),
(45, 2, 17, 0),
(46, 3, 2, 0),
(47, 3, 19, 0),
(48, 3, 40, 0),
(49, 3, 38, 0),
(50, 4, 17, 0),
(51, 5, 23, 0),
(52, 5, 27, 0),
(53, 9, 26, 0),
(54, 7, 53, 0),
(55, 7, 54, 0),
(56, 7, 55, 0),
(57, 11, 37, 0),
(59, 10, 70, 0),
(60, 5, 70, 0),
(62, 22, 43, 1),
(63, 13, 69, 0),
(64, 23, 33, 1),
(65, 24, 26, 1),
(66, 25, 22, 1),
(67, 26, 18, 1),
(68, 27, 12, 1),
(69, 28, 10, 1),
(70, 29, 7, 1),
(71, 30, 1, 1),
(72, 31, 70, 1),
(73, 32, 70, 1),
(74, 32, 6, 0),
(75, 32, 7, 0),
(76, 32, 8, 0),
(77, 31, 16, 0),
(78, 31, 17, 0),
(79, 31, 18, 0),
(80, 31, 19, 0),
(81, 31, 20, 0),
(82, 30, 24, 0),
(83, 29, 26, 0),
(84, 29, 27, 0),
(85, 29, 28, 0),
(86, 29, 30, 0),
(87, 29, 31, 0),
(88, 27, 37, 0),
(89, 27, 38, 0),
(90, 27, 40, 0),
(91, 24, 46, 0),
(92, 24, 45, 0),
(93, 19, 81, 0),
(94, 26, 81, 0),
(95, 25, 41, 0),
(96, 25, 28, 0),
(97, 25, 30, 0),
(98, 25, 32, 0),
(99, 22, 34, 0),
(100, 22, 36, 0),
(101, 22, 38, 0),
(102, 23, 1, 0),
(103, 23, 11, 0),
(106, 10, 37, 0),
(107, 10, 40, 0);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `join_team_user`
--
ALTER TABLE `join_team_user`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `join_team_user`
--
ALTER TABLE `join_team_user`
  MODIFY `id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
