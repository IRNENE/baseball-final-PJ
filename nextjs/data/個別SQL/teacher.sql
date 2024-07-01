-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-05-18 11:22:51
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
-- 資料表結構 `teacher`
--

CREATE TABLE `teacher` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `teacher_id` int(3) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `valid` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `teacher`
--

INSERT INTO `teacher` (`id`, `name`, `teacher_id`, `photo`, `description`, `valid`) VALUES
(1, '郭岱琦', 1, 'Kanas_Kociang.jpg\n', '前中職統一7-ELEVEn獅隊  球員<br>現任中崙高中棒球隊  總教練  ', 1),
(2, '李藍浩', 2, 'Li_Lanhao.jpg', '前 桃源國小少棒隊 教練<br>現任國泰國小棒球隊 主教練', 0),
(3, '許聖杰', 3, 'Xu_Shengjie.jpg', '前 中職和信鯨 球員<br>\n前 中職統一7-ELEVEn獅隊 首席教練<br>\n現任新竹明新科技大學棒球隊  總教練', 1),
(4, '黃文博', 4, 'Huang_Wenbo.jpg', '前 中職味全龍 球員<br>\n前 中職和信鯨 球員<br>\n前 巴塞隆納奧運 中華代表隊成員<br>\n中職總冠軍MVP<br>\n前中職 台鋼雄鷹 客座投手教練<br>\n現任 好棒河馬棒球俱樂部 教練', 1),
(5, '李品叡', 5, 'Li_Pinrui.jpg', '前中職統一7-ELEVEn獅隊  球員<br>\n現任竹林小飛熊棒球隊  教練<br>\n現任 好棒河馬棒球俱樂部 教練', 1),
(6, '林璿增', 6, 'Lin_Xuzeng.jpg', '前 崇越隼鷹棒球隊 球員<br>\n前 台中運動家成棒隊 球員<br>\n現任 好棒河馬棒球俱樂部 教練', 1),
(7, '何紹彬', 7, 'Ho_Shaopin.jpg', '前 MiLB 邁阿密馬林魚 球員<br>\n前 獨立聯盟 魁北克首都隊 球員<br>\n現任 帕菲克運動基地 教練', 1),
(8, '李岱祐', 8, 'Li_Daiyou.jpg', '前 三重商工青棒隊 總教練<br>\n前 台北城市科技大學棒球隊 教練<br>\n現任 好棒河馬棒球俱樂部 教練', 1),
(9, '林建宏', 9, 'Lin_Jianhong.jpg', '職棒選手私人體能訓練師<br>\n現任 平鎮高棒青棒隊 體能教練', 1),
(10, '何獻凡', 10, 'He_Xianfan.jpg', '前 中職中信鯨 守備教練<br>\n前 中華成棒U23培訓隊 教練<br>\n現任 好棒河馬棒球俱樂部 總教練', 1),
(11, '黃恩賜', 11, 'Huang_n4.jpg', '前 中職統一7-ELEVEn獅隊 球員<br>\n中職二軍打擊王、安打王<br>\n現任  好棒河馬棒球俱樂部 教練', 1);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `teacher`
--
ALTER TABLE `teacher`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
