-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 22, 2024 lúc 06:03 PM
-- Phiên bản máy phục vụ: 10.4.27-MariaDB
-- Phiên bản PHP: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `airline`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `blogs`
--

CREATE TABLE `blogs` (
  `Id` int(11) NOT NULL,
  `Name` longtext NOT NULL,
  `Description` longtext NOT NULL,
  `Image` longtext NOT NULL,
  `Posted_on` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `blogs`
--

INSERT INTO `blogs` (`Id`, `Name`, `Description`, `Image`, `Posted_on`) VALUES
(1, 'Kết luận SAG1 tháng 9/2024', '', '/blogs/b5.png', '2024-09-11 10:27:24.000000'),
(2, 'THÔNG TIN AN TOÀN THÁNG 08-2024', '(Ban ATCL ban hành) NỘI DUNG TIN THẾ GIỚI Sự cố: Tàu bay B787-9 của Hàng Royal Air Maroc bị nứt kính tại Casablanca. Ngày 23/08/2024, tàu bay Boeing B787-9 …', '/blogs/b1.png', '2024-08-21 10:31:35.000000'),
(3, 'SAFETY INFORMATION IN AUG 2024', '(Issued by Safety Quality Department) CONTENTS WORLD NEWS Incident: RAM B789 at Casablanca on Aug 23rd 2024, cracked windshield A RAM Royal Air Maroc Boeing 787-9, registration CN-RAM performing flight …', '/blogs/b1.png', '2024-08-19 10:32:15.000000'),
(4, 'Kết luận SAG2 tháng 8/2024', '', '/blogs/b4.png', '2024-08-13 10:33:12.000000'),
(5, 'Hội nghị tuyên truyền văn hóa an ninh, an toàn hàng không năm 2024', 'Tham dự Hội nghị có lãnh đạo Cảng hàng không Điện Biên, Đại diện Cảng vụ hàng không tại Điện Biên, đại diện lãnh đạo Đảng ủy, UBND phường Thanh …', '/blogs/b2.png', '2024-08-11 10:33:45.000000'),
(6, 'Kết luận SAG1 tháng 7/2024', '', '/blogs/b5.png', '2024-07-24 10:35:54.000000'),
(7, 'Hình ảnh: Hội nghị phối hợp an toàn hàng không quý III/2024 giữa 3 TCT: VATM, VNA, ACV ngày 14/8/2024', '', '/blogs/b6.jpg', '2024-08-17 10:36:20.000000'),
(8, 'Hội nghị phối hợp ATHK quý III/2024 giữa 3 TCT: VATM, VNA, ACV ngày 14/8/2024', 'Thời gian: 9h00 ngày 14/8/2024 Địa điểm: Hội trường 520 – Nhà B – TCT Quản lý bay Việt Nam 2. Báo cáo ACV 3. Báo cáo VNA Thư viện …', '/blogs/b6.jpg', '2024-08-15 10:37:17.000000'),
(9, 'THÔNG TIN AN TOÀN THÁNG 07-2024', '(Ban ATCL ban hành) NỘI DUNG TIN THẾ GIỚI Sự cố: Tàu bay B787-9 của Hàng American bị tắt động cơ trên không gần Chicago. Ngày 08/07/2024, tàu bay Boeing …', '/blogs/b2.png', '2024-07-24 10:38:55.000000'),
(10, 'SAFETY INFORMATION IN JUL 2024', '(Issued by Safety Quality Department) CONTENTS WORLD NEWS Incident: American B789 near Chicago on Jul 8th, 2024, engine shut down in flight An American Airlines Boeing 787-9, registration N836AA performing …', '/blogs/b2.png', '2024-07-19 10:39:49.000000'),
(11, 'THÔNG TIN AN TOÀN THÁNG 06-2024', '(Ban ATCL ban hành) NỘI DUNG TIN THẾ GIỚI Sự cố: Tàu bay B787-9 của Hàng KML bị nứt kính tại Tokyo. Ngày 16/06/2024, tàu bay Boeing B787-9 của Hãng …\r\n\r\nRead More', '/blogs/b3.png', '2024-06-17 10:40:54.000000'),
(12, 'SAFETY INFORMATION IN JUN 2024', '(Issued by Safety Quality Department) CONTENTS WORLD NEWS Incident: KLM B789 at Tokyo on Jun 16th, 2024, cracked windshield A KLM Boeing 787-9, registration PH-BHA performing flight KL-862 from Tokyo …', '/blogs/b3.png', '2024-06-21 10:41:34.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `flights`
--

CREATE TABLE `flights` (
  `Id` int(11) NOT NULL,
  `FlightNumber` longtext NOT NULL,
  `Origin` longtext NOT NULL,
  `Destination` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `flights`
--

INSERT INTO `flights` (`Id`, `FlightNumber`, `Origin`, `Destination`) VALUES
(1, 'VN123', 'HN', 'HCM'),
(2, 'VN456', 'HCM', 'HN'),
(4, 'A01', 'Hp', 'Dn'),
(5, 'A02', 'Cb', 'Bcan');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `flighttimes`
--

CREATE TABLE `flighttimes` (
  `Id` int(11) NOT NULL,
  `FlightID` int(11) NOT NULL,
  `DepartureDate` datetime(6) NOT NULL,
  `ArrivalDate` datetime(6) NOT NULL,
  `FlightType` enum('Departure','Return') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `flighttimes`
--

INSERT INTO `flighttimes` (`Id`, `FlightID`, `DepartureDate`, `ArrivalDate`, `FlightType`) VALUES
(1, 1, '2024-10-13 14:00:00.000000', '2024-10-13 15:00:00.000000', 'Departure'),
(2, 2, '2024-10-14 14:00:00.000000', '2024-10-14 15:00:00.000000', 'Return'),
(3, 1, '2024-10-13 10:00:00.000000', '2024-10-13 11:00:00.000000', 'Departure'),
(4, 1, '2024-10-14 15:00:00.000000', '2024-10-14 16:00:00.000000', 'Departure'),
(5, 5, '2024-10-25 15:32:00.000000', '2024-10-25 15:32:00.000000', 'Return');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderdetails`
--

CREATE TABLE `orderdetails` (
  `Id` int(11) NOT NULL,
  `OrderID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `TicketId` int(11) NOT NULL,
  `PositionSeat` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orderdetails`
--

INSERT INTO `orderdetails` (`Id`, `OrderID`, `Quantity`, `TicketId`, `PositionSeat`) VALUES
(61, 36, 1, 1, '9B'),
(62, 38, 1, 4, '3A'),
(63, 40, 1, 1, '9B'),
(64, 41, 1, 1, '9B'),
(65, 42, 1, 1, '9C'),
(66, 43, 1, 1, '8B'),
(67, 44, 1, 1, '8G');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Amount` bigint(20) NOT NULL,
  `TotalQuantity` int(11) NOT NULL,
  `Status` enum('Pending','Completed') NOT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`Id`, `UserId`, `Amount`, `TotalQuantity`, `Status`, `CreatedAt`) VALUES
(34, 5, 100000, 1, 'Pending', '2024-10-19 10:36:46.990149'),
(35, 5, 100000, 1, 'Pending', '2024-10-19 10:47:25.385807'),
(36, 5, 2000000, 1, 'Pending', '2024-10-22 04:35:40.577086'),
(37, 3, 10, 10, 'Pending', '2024-10-22 08:04:50.069843'),
(38, 3, 10, 1000001200, 'Pending', '2024-10-22 08:35:45.785576'),
(40, 5, 2000000, 1, 'Pending', '2024-10-22 13:46:23.798384'),
(41, 5, 2000000, 1, 'Pending', '2024-10-22 14:39:06.815457'),
(42, 5, 2000000, 1, 'Pending', '2024-10-22 15:05:51.260283'),
(43, 5, 2000000, 1, 'Pending', '2024-10-22 15:37:27.400762'),
(44, 5, 2000000, 1, 'Completed', '2024-10-22 15:40:42.333703');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `seats`
--

CREATE TABLE `seats` (
  `Id` int(11) NOT NULL,
  `FlightID` int(11) NOT NULL,
  `SeatNumber` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `seats`
--

INSERT INTO `seats` (`Id`, `FlightID`, `SeatNumber`) VALUES
(4, 1, 51);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ticket`
--

CREATE TABLE `ticket` (
  `Id` int(11) NOT NULL,
  `FlightID` int(11) NOT NULL,
  `TripType` enum('Popular','Merchant') NOT NULL,
  `TicketType` enum('OneWay','RoundTrip','MultiStage') NOT NULL,
  `TicketPrice` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ticket`
--

INSERT INTO `ticket` (`Id`, `FlightID`, `TripType`, `TicketType`, `TicketPrice`) VALUES
(1, 1, 'Popular', 'RoundTrip', 2000000),
(2, 2, 'Popular', 'RoundTrip', 2000000),
(4, 5, 'Merchant', 'RoundTrip', 200002);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Name` longtext DEFAULT NULL,
  `Phone` longtext NOT NULL,
  `Password` longtext DEFAULT NULL,
  `Dob` datetime(6) DEFAULT NULL,
  `Email` longtext NOT NULL,
  `FirstName` longtext DEFAULT NULL,
  `PasswordResetToken` longtext DEFAULT NULL,
  `ResetTokenExpires` datetime(6) DEFAULT NULL,
  `Passport` longtext DEFAULT NULL,
  `LastName` longtext DEFAULT NULL,
  `Age` int(11) NOT NULL,
  `Gender` enum('Male','FeMale') NOT NULL,
  `Role` enum('Admin','User') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`Id`, `Name`, `Phone`, `Password`, `Dob`, `Email`, `FirstName`, `PasswordResetToken`, `ResetTokenExpires`, `Passport`, `LastName`, `Age`, `Gender`, `Role`) VALUES
(3, 'nam', '234234', '12345', '2024-10-15 00:00:00.000000', 'dfgdfg', 'xcsdf', '123123', '0001-01-01 00:00:00.000000', '0', 'Male', 20, 'Male', 'User'),
(4, 'dat', '123123', '12345', '2024-10-23 00:00:00.000000', 'hadat120204@gmail.com', 'dg', '123', '0001-01-01 00:00:00.000000', '0', 'Male', 22, 'Male', 'User'),
(5, NULL, '0231984', '12345', '2024-10-05 00:00:00.000000', 'zopobmt@gmail.com', 'gdfgfd', NULL, NULL, '26165991', 'hhre', 0, 'Male', NULL),
(6, 'abc', '01325464', '12345', '2024-10-22 04:28:12.222000', 'aa@gmail.com', NULL, NULL, NULL, NULL, NULL, 0, 'Male', 'User'),
(7, 'abcde', '06165498494', '12345', '2024-10-22 14:43:50.551000', 'cc1@gmail.com', NULL, NULL, NULL, NULL, NULL, 0, 'Male', 'User'),
(8, 'aaa', '0216565464', '12345', '2024-10-22 14:52:22.296000', 'm@gmail.com', NULL, NULL, NULL, NULL, NULL, 0, 'Male', 'User'),
(9, 'gdfjhvhhbj', '02319844684', '12345', '2024-10-22 00:00:00.000000', 'x@gmail.com', NULL, NULL, NULL, NULL, NULL, 0, 'Male', 'User');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `__efmigrationshistory`
--

CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `__efmigrationshistory`
--

INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES
('20241019072923_final', '8.0.10');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`Id`);

--
-- Chỉ mục cho bảng `flights`
--
ALTER TABLE `flights`
  ADD PRIMARY KEY (`Id`);

--
-- Chỉ mục cho bảng `flighttimes`
--
ALTER TABLE `flighttimes`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_FlightTimes_FlightID` (`FlightID`);

--
-- Chỉ mục cho bảng `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_OrderDetails_OrderID` (`OrderID`),
  ADD KEY `IX_OrderDetails_TicketId` (`TicketId`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Orders_UserId` (`UserId`);

--
-- Chỉ mục cho bảng `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Seats_FlightID` (`FlightID`);

--
-- Chỉ mục cho bảng `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Ticket_FlightID` (`FlightID`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`);

--
-- Chỉ mục cho bảng `__efmigrationshistory`
--
ALTER TABLE `__efmigrationshistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `blogs`
--
ALTER TABLE `blogs`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `flights`
--
ALTER TABLE `flights`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `flighttimes`
--
ALTER TABLE `flighttimes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT cho bảng `seats`
--
ALTER TABLE `seats`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `ticket`
--
ALTER TABLE `ticket`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `flighttimes`
--
ALTER TABLE `flighttimes`
  ADD CONSTRAINT `FK_FlightTimes_Flights_FlightID` FOREIGN KEY (`FlightID`) REFERENCES `flights` (`Id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `FK_OrderDetails_Orders_OrderID` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_OrderDetails_Ticket_TicketId` FOREIGN KEY (`TicketId`) REFERENCES `ticket` (`Id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK_Orders_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `seats`
--
ALTER TABLE `seats`
  ADD CONSTRAINT `FK_Seats_Flights_FlightID` FOREIGN KEY (`FlightID`) REFERENCES `flights` (`Id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `FK_Ticket_Flights_FlightID` FOREIGN KEY (`FlightID`) REFERENCES `flights` (`Id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
