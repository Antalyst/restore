-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 08, 2025 at 02:27 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventorysystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `code` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `code`) VALUES
(1, 'Raw Materials ', 'RM01'),
(2, 'Consumable Materials', 'cm1');

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`id`, `name`) VALUES
(1, 'Joel');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `min_stock_level` int(11) NOT NULL,
  `max_stock_level` int(11) NOT NULL,
  `image_path` varchar(100) DEFAULT NULL,
  `current_stock` int(11) DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`, `min_stock_level`, `max_stock_level`, `image_path`, `current_stock`, `category_id`, `unit_id`) VALUES
(9, 'Molasis', 10, 1000, 'http://localhost:5000/images/image_1754354681448.jpg', 400, 1, 12),
(10, 'Sacks', 5, 2000, 'http://localhost:5000/images/image_1754358770633.jpg', 482, 1, 13),
(13, 'Bilog', 100, 2000, 'http://localhost:5000/images/image_1754359766166.jpg', 5100, 1, 11),
(16, 'Sugar', 100, 10000, NULL, 4000, 1, 11),
(17, 'Apog', 10, 100, 'http://localhost:5000/images/image_1754454507379.webp', 450, 2, 19),
(18, 'rsacks', 20, 100, 'http://localhost:5000/images/image_1754459326996.jpg', 498, 1, 13);

-- --------------------------------------------------------

--
-- Table structure for table `remarks`
--

CREATE TABLE `remarks` (
  `id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `attachment` varchar(256) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `remarks`
--

INSERT INTO `remarks` (`id`, `item_id`, `description`, `date`, `attachment`, `user_id`) VALUES
(21, 18, 'testing', '8/6/2025', NULL, 1001);

-- --------------------------------------------------------

--
-- Table structure for table `stage_one`
--

CREATE TABLE `stage_one` (
  `id` int(11) NOT NULL,
  `client` varchar(50) NOT NULL,
  `produce` varchar(100) NOT NULL,
  `sugar` int(11) DEFAULT NULL,
  `bilog` int(11) DEFAULT NULL,
  `gala` int(11) DEFAULT NULL,
  `recycle_sacks` int(11) DEFAULT NULL,
  `reject_bilog` int(11) DEFAULT NULL,
  `total_produce` int(11) DEFAULT NULL,
  `date` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stage_one`
--

INSERT INTO `stage_one` (`id`, `client`, `produce`, `sugar`, `bilog`, `gala`, `recycle_sacks`, `reject_bilog`, `total_produce`, `date`, `status`) VALUES
(21, 'Joel', 'Dark Mascuvado', 1000, 50, 50, 2, 100, 900, '8/8/2025', 'complete');

-- --------------------------------------------------------

--
-- Table structure for table `stage_two`
--

CREATE TABLE `stage_two` (
  `id` int(11) NOT NULL,
  `stage_one_id` int(11) DEFAULT NULL,
  `bilog` int(11) DEFAULT NULL,
  `produced` int(11) DEFAULT NULL,
  `sacks` int(11) DEFAULT NULL,
  `status_session` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stage_two`
--

INSERT INTO `stage_two` (`id`, `stage_one_id`, `bilog`, `produced`, `sacks`, `status_session`) VALUES
(9, 21, 100, 900, 18, 'complete');

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `name`) VALUES
(11, 'kg'),
(12, 'ton'),
(13, 'pcs'),
(19, 'cu');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Staff','Auditor') NOT NULL DEFAULT 'Staff'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1001, 'admin', '$2b$10$vKHTRD40dNo1eX1vR4.dFe0/SkYoXkWkuKSLtjvi3jFPjTM077IcK', 'Admin'),
(1002, 'user', '$2b$10$qV50WpwmNCrxy7mtqEp/kOU2Uo6iIZdXBa4twbJOy2xqORU9H8oQy', 'Staff');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_items_category` (`category_id`),
  ADD KEY `fk_items_unit` (`unit_id`);

--
-- Indexes for table `remarks`
--
ALTER TABLE `remarks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `remarks_user_fk` (`user_id`);

--
-- Indexes for table `stage_one`
--
ALTER TABLE `stage_one`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stage_two`
--
ALTER TABLE `stage_two`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stage_two_id` (`stage_one_id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `remarks`
--
ALTER TABLE `remarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `stage_one`
--
ALTER TABLE `stage_one`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `stage_two`
--
ALTER TABLE `stage_two`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1003;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `fk_items_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `fk_items_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`);

--
-- Constraints for table `remarks`
--
ALTER TABLE `remarks`
  ADD CONSTRAINT `remarks_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  ADD CONSTRAINT `remarks_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `stage_two`
--
ALTER TABLE `stage_two`
  ADD CONSTRAINT `stage_two_ibfk_1` FOREIGN KEY (`stage_one_id`) REFERENCES `stage_one` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
