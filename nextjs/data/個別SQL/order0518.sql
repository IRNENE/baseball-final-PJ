-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-05-18 17:29:27
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
-- 資料表結構 `order`
--

CREATE TABLE `order` (
  `id` int(5) NOT NULL,
  `user_id` int(5) NOT NULL,
  `coding` varchar(200) NOT NULL,
  `order_time` datetime NOT NULL,
  `status` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(200) NOT NULL,
  `phone` varchar(200) NOT NULL,
  `address` varchar(255) NOT NULL,
  `note` varchar(200) NOT NULL,
  `payment` varchar(255) NOT NULL,
  `delivery` varchar(200) NOT NULL,
  `total_price` varchar(255) NOT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `discount_price` varchar(255) DEFAULT NULL,
  `final_price` varchar(200) NOT NULL,
  `all_amount` varchar(255) NOT NULL,
  `reservation` varchar(255) NOT NULL,
  `transaction_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `order`
--

INSERT INTO `order` (`id`, `user_id`, `coding`, `order_time`, `status`, `type`, `name`, `phone`, `address`, `note`, `payment`, `delivery`, `total_price`, `coupon_code`, `discount_price`, `final_price`, `all_amount`, `reservation`, `transaction_id`) VALUES
(1, 70, 'GgJu7lL5Nf', '2024-05-01 22:52:25', '待付款', '課程', 'TzuYu', '0912345678', '台北市大安區大林路1號', '', '貨到付款', '宅配', '2000', 'XRH6JYLKQ1', '10', '1990', '20', '', ''),
(2, 70, 'rdys9fCvpi', '2024-05-03 22:53:59', '已付款', '課程', 'TzuYu', '0912345678', '台北市大安區大林路1號', '請在月底寄出', 'LinePay', '宅配', '1400', 'Q1K62YN26S', '140', '1260', '7', '0000', '2024051702121068010'),
(3, 70, 'eyuNdcjMcA', '2024-05-04 22:55:07', '已付款', '課程', 'TzuYu', '0912345678', '台北市大安區大林路1號', '請附上小卡', '信用卡', '門市自取', '3000', 'RFHUUKVXU3', '100', '2900', '3', '', ''),
(4, 70, '9yzBCa66Tk', '2024-05-06 22:56:12', '待付款', '課程', 'TzuYu', '0912345678', '台北市大安區大林路1號', '請附上小卡', '貨到付款', '門市自取', '500', 'PRUXGMABKE', '10', '490', '5', '', ''),
(5, 70, 'tGMRc7E87J', '2024-05-09 22:58:58', '待付款', '商品', 'TzuYu', '0912345678', '台北市大安區大林路1號', '請在月底寄出', '貨到付款', '門市自取', '9920', '48K1F7FAHN', '3968', '5952', '5', '', ''),
(6, 70, 'Oioct0ZmjS', '2024-05-10 23:01:00', '已付款', '商品', 'TzuYu', '0912345678', '台北市大安區大林路1號', '', 'LinePay', '門市自取', '7296', '7EYM3BSNQ3', '2918', '4378', '4', '0000', '2024051802121071710'),
(7, 70, 'sh2Fgya1xa', '2024-05-12 23:02:58', '已付款', '商品', 'TzuYu', '0912345678', '台北市大安區大林路1號', '', '信用卡', '門市自取', '9536', 'YM4QITZ4CK', '8582', '954', '4', '', ''),
(8, 70, 's7I3POUwe0', '2024-05-13 23:05:38', '已付款', '商品', 'TzuYu', '0912345678', '台北市大安區大林路1號', '請附上小卡', 'LinePay', '門市自取', '6440', 'MPWEYBYFJY', '888', '5552', '23', '0000', '2024051802121073910'),
(9, 70, 'Xg8ZM1xFLn', '2024-05-14 23:07:57', '已付款', '租借', 'TzuYu', '0912345678', '台北市大安區大林路1號', '請在月底寄出', '信用卡', '門市自取', '67200', 'YW5VW393WL', '53760', '13440', '21', '', ''),
(10, 70, 'azxUkbYCpe', '2024-05-15 23:08:56', '已付款', '租借', 'TzuYu', '0912345678', '台北市大安區大林路1號', '', '信用卡', '門市自取', '22400', 'VXJG9R71RG', '2240', '20160', '5', '', ''),
(11, 70, 'DFYS0IDTwq', '2024-05-17 23:09:54', '待付款', '租借', 'TzuYu', '0912345678', '南投縣鹿谷鄉中正路25號', '請附上小卡', '貨到付款', '宅配', '4800', 'WHJBOLO8AH', '1440', '3360', '20', '', ''),
(12, 70, '6qBmAr1DNV', '2024-05-17 23:10:51', '待付款', '租借', 'TzuYu', '0912345678', '花蓮縣吉安鄉永興一街27號', '請在月底寄出', '貨到付款', '宅配', '10400', 'NYILN1SXLI', '250', '10150', '5', '', ''),
(13, 70, 'WhbETyV25g', '2024-05-17 23:12:08', '已付款', '綜合', 'TzuYu', '0912345678', '南投縣鹿谷鄉中正路25號', '請用藍色包裝', '信用卡', '門市自取', '50532', 'DOH3Q070PJ', '15160', '35372', '15', '', ''),
(14, 70, 'gSQIqLsuAv', '2024-05-17 23:14:07', '待付款', '綜合', 'TzuYu', '0912345678', '南投縣鹿谷鄉中正路25號', '請在月底寄出', '貨到付款', '門市自取', '58336', 'F5PNSN2NRY', '2000', '56336', '37', '', ''),
(15, 70, 'fn27l94rSI', '2024-05-17 23:14:50', '待付款', '綜合', 'TzuYu', '0912345678', '南投縣鹿谷鄉中正路25號', '', '貨到付款', '宅配', '15904', '3SC4KXVOCO', '3181', '12723', '14', '', ''),
(16, 70, 'JShomlGBuN', '2024-05-17 23:16:18', '已付款', '綜合', 'TzuYu', '0912345678', '南投縣鹿谷鄉中正路25號', '請用藍色包裝', '信用卡', '宅配', '32424', NULL, '0', '32424', '21', '', ''),
(17, 70, 'ry66PtPe45', '2024-05-17 23:18:00', '已付款', '綜合', 'TzuYu', '0912345678', '花蓮縣吉安鄉永興一街27號', '', 'LinePay', '宅配', '7300', '1IP5WVMKCB', '300', '7000', '2', '0000', '2024051802121079810'),
(18, 70, 'y0QB9KS54t', '2024-05-18 12:00:17', '已付款', '綜合', 'TzuYu', '0912345678', '台北市大安區大林路1號', '請在月底寄出', 'LinePay', '宅配', '7528', 'FFPHABCI89', '499', '7029', '6', '0000', '2024051802121336010'),
(19, 70, 'n6thpJhfNP', '2024-05-18 16:45:34', '已付款', '綜合', 'TzuYu', '0912345678', '台北市大安區大林路1號', '請用藍色包裝', 'LinePay', '宅配', '19824', 'KKT2W2Q2XO', '999', '18825', '22', '0000', '2024051802121435910');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order`
--
ALTER TABLE `order`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
