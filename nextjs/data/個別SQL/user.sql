-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-05-18 15:36:33
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
-- 資料表結構 `user`
--

CREATE TABLE `user` (
  `id` int(3) UNSIGNED NOT NULL,
  `account` varchar(255) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `photo` varchar(255) DEFAULT 'm1.jpg',
  `address` varchar(255) DEFAULT NULL,
  `address_city` varchar(255) DEFAULT NULL,
  `address_district` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `google_uid` varchar(200) DEFAULT NULL,
  `line_uid` varchar(200) DEFAULT NULL,
  `line_access_token` varchar(200) DEFAULT NULL,
  `valid` int(3) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`id`, `account`, `email`, `password`, `birthday`, `created`, `phone`, `photo`, `address`, `address_city`, `address_district`, `gender`, `name`, `google_uid`, `line_uid`, `line_access_token`, `valid`) VALUES
(1, 'masiwei@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2024-01-01', '2024-01-24 12:08:11', '0970999388', 'm10.jpg', '桃園市龜山區文興路13號', NULL, NULL, 'Male', '馬思維', '', NULL, NULL, 1),
(2, 'psyp@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2024-01-31', '2024-01-24 12:08:00', '0912809316', 'm10.jpg', '花蓮縣吉安鄉永興一街27號', NULL, NULL, 'Male', '楊俊逸', '', NULL, NULL, 1),
(3, 'knowknow@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-05-08', '2024-01-24 11:50:57', '0970072068', 'm9.jpg', '桃園市桃園區榮華街17號', NULL, NULL, 'Male', '丁震', '', NULL, NULL, 1),
(4, 'melo@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-05-06', '2024-01-24 12:08:34', '0970426168', 'm8.jpg', '屏東縣高樹鄉南興路31號', NULL, NULL, 'Male', '謝宇傑', '', NULL, NULL, 1),
(5, 'bambii@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-10-24', '2024-01-24 12:08:56', '0955613340', 'm8.jpg', '臺中市東勢區東關路26號', NULL, NULL, 'Female', '斑比', '', NULL, NULL, 1),
(6, 'tom@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-02-21', '2024-01-24 12:14:25', '0952364565', 'm7.jpg', '南投縣鹿谷鄉中正路25號', NULL, NULL, 'Male', '蔡家豪', '', NULL, NULL, 1),
(7, 'eric@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2022-11-11', '2024-01-24 12:15:04', '0927572161', 'm7.jpg', '彰化縣永靖鄉永坡路14號', NULL, NULL, 'Male', '陳聖家', '', NULL, NULL, 1),
(8, 'luna@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-08-15', '2024-01-24 12:17:08', '0982603781', 'm6.jpg', '高雄市仁武區名山六街29號', NULL, NULL, 'Male', '林家媛', '', NULL, NULL, 1),
(9, 'emma@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-10-11', '2024-01-24 12:17:08', '0916207259', 'm6.jpg', '新北市泰山區忠孝街4號', NULL, NULL, 'Female', '黃怡婷', '', NULL, NULL, 1),
(10, 'nineone@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-07-18', '2024-01-24 12:20:27', '0916040631', 'm5.jpg', '新北市中和區四維街26號', NULL, NULL, 'Female', '趙馨玥', '', NULL, NULL, 1),
(11, 'ava@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-08-08', '2024-01-24 12:20:46', '0955452460', 'm5.jpg', '南投縣南投市信義街12號', NULL, NULL, 'Female', '張怡君', '', NULL, NULL, 1),
(12, 'tim@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-08-22', '2024-01-24 12:20:56', '0939778365', 'm4.jpg', '臺南市下營區中營2號', NULL, NULL, 'Male', '李小名', '', NULL, NULL, 1),
(13, 'sophia@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-08-30', '2024-01-24 12:21:00', '0928222037', 'm4.jpg', '桃園市桃園區中正一街24號', NULL, NULL, 'Female', '王小美', '', NULL, NULL, 1),
(14, 'vava@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-08-15', '2024-01-24 12:21:07', '0927049524', 'm3.jpg', '苗栗縣苗栗市建國街10號', NULL, NULL, 'Female', '毛衍七', '', NULL, NULL, 1),
(15, 'emily@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-07-04', '2024-01-24 12:21:10', '0937054249', 'm3.jpg', '臺南市東區龍山街34號', NULL, NULL, 'Female', '吳小芳', '', NULL, NULL, 1),
(16, 'olivia@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-09-27', '2024-01-24 12:21:14', '0970029794', 'm2.jpg', '彰化縣埔心鄉中山路30號', NULL, NULL, 'Female', '劉雅慧', '', NULL, NULL, 1),
(17, 'jason@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-09-25', '2024-01-24 12:21:18', '0912568724', 'm2.jpg', '臺南市安南區智安二街15號', NULL, NULL, 'Male', '許小安', '', NULL, NULL, 1),
(18, 'kevin@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-06-23', '2024-01-24 12:21:22', '0965723841', 'm1.jpg', '屏東縣潮州鎮田新路5號', NULL, NULL, 'Male', '葉家躍', '', NULL, NULL, 1),
(19, 'eric@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2024-01-09', '2024-01-24 12:21:27', '0987568243', 'm1.jpg', '高雄市鳳山區文清街10號', NULL, NULL, 'Male', '楊小華', '', NULL, NULL, 1),
(20, 'amy@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-06-08', '2024-01-24 12:21:32', '0943521687', 'm10.jpg', '雲林縣口湖鄉水尾1號', NULL, NULL, 'Female', '鄭雅婷', '', NULL, NULL, 1),
(21, 'alice@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-08-11', '2024-01-24 12:21:42', '0958236541', 'm10.jpg', '嘉義縣朴子市朴子工業區一街23號', NULL, NULL, 'Female', '謝雅雯', '', NULL, NULL, 1),
(22, 'david@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-09-20', '2024-01-24 12:21:47', '0998765359', 'm9.jpg', '苗栗縣竹南鎮大埔街16號', NULL, NULL, 'Male', '郭志成', '', NULL, NULL, 1),
(23, 'grace@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-09-29', '2024-01-24 12:21:52', '0975689325', 'm9.jpg', '澎湖縣馬公市中華路25號', NULL, NULL, 'Female', '洪淑惠', '', NULL, NULL, 1),
(24, 'james@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-10-22', '2024-01-24 12:22:15', '0999683215', 'm8.jpg', '南投縣草屯鎮信洋街32號', NULL, NULL, 'Male', '邱志明', '', NULL, NULL, 1),
(25, 'tina@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-03-27', '2024-01-24 12:22:22', '0956874258', 'm8.jpg', '屏東縣屏東市仁愛路22號', NULL, NULL, 'Female', '曾家梅', '', NULL, NULL, 1),
(26, 'alex@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-07-06', '2024-01-24 12:22:27', '0998623354', 'm7.jpg', '臺中市西屯區科園路13號', NULL, NULL, 'Male', '盧承家', '', NULL, NULL, 1),
(27, 'jerry@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-08-05', '2024-01-24 12:22:31', '0988756324', 'm7.jpg', '雲林縣元長鄉內寮5號', NULL, NULL, 'Male', '尤志偉', '', NULL, NULL, 1),
(28, 'andy@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-07-21', '2024-01-24 12:22:35', '0944365232', 'm6.jpg', '臺中市北屯區南興北一路9號', NULL, NULL, 'Male', '賴志豪', '', NULL, NULL, 1),
(29, 'joyce@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-09-20', '2024-01-24 12:22:38', '0922365985', 'm6.jpg', '新北市三芝區楓林六街11號', NULL, NULL, 'Female', '吳淑芬', '', NULL, NULL, 1),
(30, 'vivian@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-11-04', '2024-01-24 12:22:42', '0993365472', 'm5.jpg', '臺南市南區省躬橫街24號', NULL, NULL, 'Female', '彭家蓉', '', NULL, NULL, 1),
(31, 'cindy@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-10-26', '2024-01-24 12:22:46', '0987652303', 'm5.jpg', '南投縣鹿谷鄉光華巷31號', NULL, NULL, 'Female', '羅小薇', '', NULL, NULL, 1),
(32, 'jack@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-06-26', '2024-01-24 12:22:50', '0986325647', 'm4.jpg', '臺南市南區新仁路1號', NULL, NULL, 'Male', '康小東', '', NULL, NULL, 1),
(33, 'Ivy@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-10-30', '2024-01-24 12:22:55', '0933365258', 'm4.jpg', '高雄市前鎮區興順街3號', NULL, NULL, 'Female', '詹家瓊', '', NULL, NULL, 1),
(34, 'allen@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-05-26', '2024-01-24 12:23:02', '0922354785', 'm3.jpg', '高雄市小港區鳳福路26號', NULL, NULL, 'Male', '徐小凱', '', NULL, NULL, 1),
(35, 'vincent@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-06-09', '2024-01-24 12:23:02', '0966553328', 'm3.jpg', '新竹縣橫山鄉仁愛街10號', NULL, NULL, 'Male', '何小志', '', NULL, NULL, 1),
(36, 'jenny@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-08-06', '2024-01-24 12:23:02', '0922448856', 'm2.jpg', '高雄市前鎮區瑞東二街17號', NULL, NULL, 'Female', '方小惠', '', NULL, NULL, 1),
(37, 'sam@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-07-08', '2024-01-24 12:23:02', '0966325875', 'm2.jpg', '彰化縣伸港鄉大同九街34號', NULL, NULL, 'Male', '廖小妮', '', NULL, NULL, 1),
(38, 'ken@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2024-01-06', '2024-01-24 12:23:02', '0965322365', 'm1.jpg', '高雄市三民區重慶路19號', NULL, NULL, 'Male', '李佑廷', '', NULL, NULL, 1),
(39, 'chris@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2024-01-08', '2024-01-24 12:23:02', '0985236542', 'm1.jpg', '高雄市楠梓區大學五十六街6號', NULL, NULL, 'Male', '呂冠廷', '', NULL, NULL, 1),
(40, 'claire@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-11-21', '2024-01-24 12:23:02', '0953256235', 'm10.jpg', '彰化縣員林市豐年街14號', NULL, NULL, 'Female', '江家嫣', '', NULL, NULL, 1),
(41, 'tony@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-12-07', '2024-01-24 12:23:02', '0985356243', 'm10.jpg', '新竹縣竹北市自強一路30號', NULL, NULL, 'Male', '蕭冠宇', '', NULL, NULL, 1),
(42, 'annie@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-11-01', '2024-01-24 12:23:02', '0985235461', 'm9.jpg', '臺中市西屯區西安街16號', NULL, NULL, 'Female', '莊家歆', '', NULL, NULL, 1),
(43, 'vicky@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-12-01', '2024-01-24 12:23:02', '0928485823', 'm9.jpg', '臺中市后里區福興路16號', NULL, NULL, 'Female', '溫永晴', '', NULL, NULL, 1),
(44, 'jessica@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-12-08', '2024-01-24 12:23:02', '0923585823', 'm8.jpg', '雲林縣臺西鄉民生路12號', NULL, NULL, 'Female', '鄧子晴', '', NULL, NULL, 1),
(45, 'leo@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2023-11-30', '2024-01-24 12:23:02', '0936506696', 'm8.jpg', '臺南市南區健民街2號', NULL, NULL, 'Male', '周家輝', '', NULL, NULL, 1),
(46, 'peggy@example.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2024-01-30', '2024-01-24 12:23:02', '0924031885', 'm7.jpg', '彰化縣大村鄉東美路32號', NULL, NULL, 'Female', '孫家瑤', '', NULL, NULL, 1),
(48, 'test@test.com', NULL, '827ccb0eea8a706c4c34a16891f84e7b', '2024-02-09', '2024-02-03 18:31:20', '0911111111', 'm7.jpg', '111', NULL, NULL, 'Male', '卯咪', '', NULL, NULL, 1),
(49, 'test2@test.com', NULL, '12345', '2024-04-01', '2024-04-23 22:46:30', '0912345678', 'm6.jpg', '11111', NULL, NULL, 'Male', '狗勾', '', NULL, NULL, 1),
(50, 'boy@123.com', NULL, '96e79218965eb72c92a549dd5a330112', '0000-00-00', '2024-04-24 16:58:37', '0912345567', 'm6.jpg', 'undefined', 'undefined', 'undefined', 'undefined', '死神', '', NULL, NULL, 1),
(51, 'bbb@fff.cccc', NULL, 'af15d5fdacd5fdfea300e88a8e253e82', '0000-00-00', '2024-04-25 05:53:32', '0912345678', 'm5.jpg', 'undefined', 'undefined', 'undefined', 'undefined', '匿名', '', NULL, NULL, 1),
(52, 'joe@ddd.com', NULL, '96e79218965eb72c92a549dd5a330112', '0000-00-00', '2024-04-25 05:54:35', '0900000000', 'm5.jpg', 'undefined', 'undefined', 'undefined', 'undefined', '小丑', '', NULL, NULL, 1),
(53, 'joe1@aaa.com', NULL, '670b14728ad9902aecba32e22fa4f6bd', '0000-00-00', '2024-04-25 05:55:33', '0900000000', 'm4.jpg', 'undefined', 'undefined', 'undefined', 'undefined', '日本隊長', '', NULL, NULL, 1),
(54, 'ader@123.com', NULL, 'e10adc3949ba59abbe56e057f20f883e', '0000-00-00', '2024-04-25 05:56:10', '0900000000', 'm4.jpg', 'undefined', 'undefined', 'undefined', 'undefined', '台灣隊長', '', NULL, NULL, 1),
(55, 'user1@test.ccccc', NULL, 'e10adc3949ba59abbe56e057f20f883e', '0000-00-00', '2024-04-25 05:57:38', '0900000000', 'm3.jpg', 'undefined', 'undefined', 'undefined', 'undefined', '隱形人', '', NULL, NULL, 1),
(56, '13245@test.com', NULL, 'e10adc3949ba59abbe56e057f20f883e', '0000-00-00', '2024-04-25 05:58:08', '0900000000', 'm3.jpg', 'undefined', 'undefined', 'undefined', 'undefined', '維志', '', NULL, NULL, 1),
(57, 'ben@123.com', NULL, 'e10adc3949ba59abbe56e057f20f883e', '0000-00-00', '2024-04-25 05:58:39', '0900000000', 'm2.jpg', 'undefined', 'undefined', 'undefined', 'undefined', '品潔', '', NULL, NULL, 1),
(58, 'tttt@tttt.tt', NULL, 'e10adc3949ba59abbe56e057f20f883e', '2024-04-04', '2024-04-26 01:21:13', '0912345678', 'm2.jpg', 'undefined', 'undefined', 'undefined', 'undefined', '修竹', '', NULL, NULL, 1),
(59, 'ttt@ttt.tt', NULL, 'e10adc3949ba59abbe56e057f20f883e', '2024-04-02', '2024-04-27 03:19:28', '11111111', 'm10.jpg', '蘆洲', '基隆市', '中山區', 'Female', '王曉明u8', '', NULL, NULL, 1),
(60, 'aaa@aaa.aa', NULL, 'e10adc3949ba59abbe56e057f20f883e', '2024-04-17', '2024-04-27 03:40:13', '0912345677', 'm1.jpg', 'undefined', 'undefined', 'undefined', 'undefined', '宏穎', '', NULL, NULL, 1),
(61, 'boy2285256@gmail.com', NULL, 'e10adc3949ba59abbe56e057f20f883e', '1996-03-09', '2024-04-28 13:44:01', '0912345678', 'm1.jpg', 'undefined', 'undefined', 'undefined', 'undefined', '姿佑', '', NULL, NULL, 1),
(64, NULL, 'xxx@gmail.com', NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/xxxxxx', NULL, NULL, NULL, NULL, '柏彣', '100000685961710971999', NULL, NULL, 1),
(65, NULL, 'xxx@gmail.com', NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/xxxxxx', NULL, NULL, NULL, NULL, '截尼規', '100000685961710971991', NULL, NULL, 1),
(66, NULL, 'xxx@gmail.com', NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/xxxxxx', NULL, NULL, NULL, NULL, '小火龍', '100000685961710971990', NULL, NULL, 1),
(67, NULL, 'xxx@gmail.com', NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/xxxxxx', NULL, NULL, NULL, NULL, '皮卡丘', '100000685961710971993', NULL, NULL, 1),
(69, NULL, 'twbaseballteam@gmail.com', NULL, NULL, NULL, NULL, '1715844376207_umpire.png', NULL, NULL, NULL, NULL, '棒球好玩家', '112525581598621432124', NULL, NULL, 1),
(70, 'TzuYu@test.com', 'TzuYu@test.com', 'e10adc3949ba59abbe56e057f20f883e', '2024-04-30', '2024-04-30 02:53:29', '0912345678', 'm1.jpg', '聖德基督', '桃園市', '楊梅區', 'Female', 'TzuYu', NULL, NULL, NULL, 1),
(77, 'WTF@test.com', NULL, 'e10adc3949ba59abbe56e057f20f883e', '2000-05-05', '2024-05-09 06:12:28', '0975395146', 'm1.jpg', '大M3林公園1號', '臺北市', '大安區', 'Male', '王德發', NULL, NULL, NULL, 1),
(78, 'HLS@test.com', NULL, 'e10adc3949ba59abbe56e057f20f883e', '2000-06-06', '2024-05-09 06:13:38', '0978948615', 'm1.jpg', '安平古堡6號', '臺南市', '安平區', 'Male', '后里蟹', NULL, NULL, NULL, 1),
(80, NULL, '', NULL, NULL, NULL, NULL, 'https://profile.line-scdn.net/0hLoYUPM2zE0BkLAMMoktsF1hpHS0TAhUIHE0IL0ElTnZNTAcWC0kMJER7TSRMFAAVCEpbJ0YqS3Yd', NULL, NULL, NULL, NULL, '阿德', NULL, 'Ub22e419c54d40970d6c5e46cc40fcad9', 'eyJhbGciOiJIUzI1NiJ9.hauu1TVhFg-bxGI0ubJFe6yS1FYsjKohMknROtq8_O7yHPv2x3ccC5KxX9hcCE8ji0f5DaPoy5naTakKTWvNTWmIAsdd1yOLeZR6CsOaOa6ZeNF0IFaFlAzucXbThqWarxlgNxEQJCeQ76Km-O0O0O1XHdUkQKxZuiTMFuDaVs8.oFopFV1', 1),
(83, NULL, 'boy2285256@gmail.com', NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocIXQGwH-5PJWH32x87XdAYmCq-ntO0VCmpUQ0rQg6MDS2feBg=s96-c', NULL, NULL, NULL, NULL, '蘇偉德（阿德）', '116204341993205137138', NULL, NULL, 1);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user`
--
ALTER TABLE `user`
  MODIFY `id` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
