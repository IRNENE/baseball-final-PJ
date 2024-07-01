-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-05-17 23:54:54
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.0.30

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
-- 資料表結構 `order_detail`
--

CREATE TABLE `order_detail` (
  `id` int(3) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(3) NOT NULL,
  `product_id` int(3) NOT NULL,
  `rent_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `p_color` varchar(255) DEFAULT NULL,
  `p_size` varchar(255) DEFAULT NULL,
  `p_price` varchar(100) NOT NULL,
  `p_total` int(5) NOT NULL,
  `p_amount` int(5) NOT NULL,
  `r_color` varchar(255) NOT NULL,
  `r_size` varchar(255) NOT NULL,
  `day_price` varchar(100) DEFAULT NULL,
  `r_total` int(5) NOT NULL,
  `r_amount` int(5) NOT NULL,
  `start_time` date DEFAULT NULL,
  `end_time` date DEFAULT NULL,
  `c_price` varchar(100) NOT NULL,
  `c_total` int(5) NOT NULL,
  `c_amount` int(5) NOT NULL,
  `img` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `order_detail`
--

INSERT INTO `order_detail` (`id`, `order_id`, `user_id`, `product_id`, `rent_id`, `course_id`, `p_color`, `p_size`, `p_price`, `p_total`, `p_amount`, `r_color`, `r_size`, `day_price`, `r_total`, `r_amount`, `start_time`, `end_time`, `c_price`, `c_total`, `c_amount`, `img`) VALUES
(1, 1, 70, 0, 0, 1, NULL, NULL, '0', 0, 0, '', '', '0', 0, 0, '2024-02-02', '2024-06-02', '100', 2000, 20, '1.jpg'),
(2, 2, 70, 0, 0, 4, NULL, NULL, '0', 0, 0, '', '', NULL, 0, 0, NULL, NULL, '200', 1400, 7, '4.jpg'),
(3, 3, 70, 0, 0, 10, NULL, NULL, '0', 0, 0, '', '', NULL, 0, 0, NULL, NULL, '1000', 3000, 3, '10.jpg'),
(4, 4, 70, 0, 0, 3, NULL, NULL, '0', 0, 0, '', '', NULL, 0, 0, NULL, NULL, '100', 500, 5, '3.jpg'),
(5, 5, 70, 2, 0, 0, '熱門色', 'S', '2480', 9920, 5, '', '', NULL, 0, 0, NULL, NULL, '0', 0, 0, 'baseball_glove002.jpg'),
(6, 6, 70, 13, 0, 0, '熱門色', 'M', '2280', 7296, 4, '', '', NULL, 0, 0, NULL, NULL, '0', 0, 0, 'batting_glove006.jpg'),
(7, 7, 70, 30, 0, 0, '熱門色', '31', '2980', 9536, 4, '', '', NULL, 0, 0, NULL, NULL, '0', 0, 0, 'spiked_shoes008.jpg'),
(8, 8, 70, 94, 0, 0, '藍', '均碼', '350', 6440, 23, '', '', NULL, 0, 0, NULL, NULL, '0', 0, 0, '1707118063.jpeg'),
(9, 9, 70, 0, 3, 0, NULL, NULL, '0', 0, 0, '黑', '均碼', '4000', 67200, 21, '2024-05-17', '2024-05-20', '0', 0, 0, 'wooden_bat003.jpg'),
(10, 10, 70, 0, 17, 0, NULL, NULL, '0', 0, 0, '黑', 'M', '5600', 22400, 5, '2024-05-17', '2024-05-20', '0', 0, 0, '1707117058.jfif'),
(11, 11, 70, 0, 20, 0, NULL, NULL, '0', 0, 0, '黑', '均碼', '300', 4800, 20, '2024-05-17', '2024-05-22', '0', 0, 0, '1707119632.jfif'),
(12, 12, 70, 0, 12, 0, NULL, NULL, '0', 0, 0, '黑', '28', '2600', 10400, 5, '2024-05-17', '2024-05-18', '0', 0, 0, 'spiked_shoes004.jpg'),
(13, 13, 70, 0, 0, 1, NULL, NULL, '0', 0, 0, '', '', '0', 0, 0, '2024-02-02', '2024-02-02', '100', 100, 1, '1.jpg'),
(14, 13, 70, 6, 0, 0, '熱門色', 'L', '2780', 17792, 8, '', '', NULL, 0, 0, NULL, NULL, '0', 0, 0, 'baseball_glove006.jpg'),
(15, 13, 70, 0, 16, 0, NULL, NULL, '0', 0, 0, '黑', 'M', '6800', 32640, 6, '2024-05-17', '2024-05-20', '0', 0, 0, '1707116996.jpg'),
(16, 14, 70, 0, 0, 3, NULL, NULL, '0', 0, 0, '', '', NULL, 0, 0, NULL, NULL, '100', 800, 8, '3.jpg'),
(17, 14, 70, 8, 0, 0, '熱門色', 'L', '2480', 57536, 29, '', '', NULL, 0, 0, NULL, NULL, '0', 0, 0, 'batting_glove001.jpg'),
(18, 15, 70, 0, 0, 4, NULL, NULL, '0', 0, 0, '', '', NULL, 0, 0, NULL, NULL, '200', 1600, 8, '4.jpg'),
(19, 15, 70, 4, 0, 0, '熱門色', 'M', '2980', 14304, 6, '', '', NULL, 0, 0, NULL, NULL, '0', 0, 0, 'baseball_glove004.jpg'),
(20, 16, 70, 0, 0, 1, NULL, NULL, '0', 0, 0, '', '', '0', 0, 0, '2024-02-02', '2024-02-02', '100', 1400, 14, '1.jpg'),
(21, 16, 70, 123, 0, 0, '熱門色', '均碼', '5540', 31024, 7, '', '', NULL, 0, 0, NULL, NULL, '0', 0, 0, '1707130540.jfif'),
(22, 17, 70, 0, 0, 10, NULL, NULL, '0', 0, 0, '', '', NULL, 0, 0, NULL, NULL, '1000', 1000, 1, '10.jpg'),
(23, 17, 70, 126, 0, 0, '熱門色', '均碼', '7875', 6300, 1, '', '', NULL, 0, 0, NULL, NULL, '0', 0, 0, '1707131166.jpg');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
