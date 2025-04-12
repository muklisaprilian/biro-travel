-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 12, 2025 at 08:43 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_travel`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `nama` varchar(55) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `nama`, `created_at`, `updated_at`) VALUES
(2, 'Wisata Budaya', '2025-04-12 04:39:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `nama` varchar(55) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `nama`, `created_at`, `updated_at`) VALUES
(1, 'Bali', '2025-04-12 04:44:06', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `destinations`
--

CREATE TABLE `destinations` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `nama` varchar(55) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `destinations`
--

INSERT INTO `destinations` (`id`, `category_id`, `nama`, `created_at`, `updated_at`) VALUES
(1, 2, 'Bali', '2025-04-12 04:54:21', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `packages_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `telp` varchar(55) DEFAULT NULL,
  `status` varchar(55) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `packages_id`, `user_id`, `telp`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 3, '081232', '0', '2025-04-12 06:31:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` int(11) NOT NULL,
  `city_id` int(11) DEFAULT NULL,
  `nama` varchar(55) DEFAULT NULL,
  `peserta` varchar(55) DEFAULT NULL,
  `durasi` varchar(55) DEFAULT NULL,
  `harga` varchar(55) DEFAULT NULL,
  `gambar` varchar(55) DEFAULT NULL,
  `jumlah` varchar(55) DEFAULT NULL,
  `start_date` varchar(55) DEFAULT NULL,
  `end_date` varchar(55) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `city_id`, `nama`, `peserta`, `durasi`, `harga`, `gambar`, `jumlah`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
(1, 1, 'Paket 1', '10', '3', '3000000', 'nulls', '0', '2025-04-12 11:03:12', '2025-04-15 11:03:12', '2025-04-12 05:08:21', '2025-04-12 12:11:29');

-- --------------------------------------------------------

--
-- Table structure for table `packages_detail`
--

CREATE TABLE `packages_detail` (
  `id` int(11) NOT NULL,
  `packages_id` int(11) DEFAULT NULL,
  `destination_id` int(11) DEFAULT NULL,
  `fasilitas` varchar(55) DEFAULT NULL,
  `status` varchar(55) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `packages_detail`
--

INSERT INTO `packages_detail` (`id`, `packages_id`, `destination_id`, `fasilitas`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'wifi', '0', '2025-04-12 06:03:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(55) DEFAULT NULL,
  `last_name` varchar(55) DEFAULT NULL,
  `email` varchar(55) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 0,
  `role` enum('user','staff','admin') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `isActive`, `role`, `created_at`, `updated_at`) VALUES
(1, 'User', 'Nutech', 'muklisapriliansyah@gmail.com', '$argon2id$v=19$m=4096,t=3,p=1$PLLTwK0cN47RINA4BeiKEQ$2wVw6iFwo16zIEtp6J8UGCG/bR1o9lRbB2qe+8CsyJo', 1, 'admin', '2025-03-22 18:23:28', '2025-03-23 02:32:35'),
(2, 'aprilian', 'Nutechs', 'apriliangraphics@gmail.com', '$argon2id$v=19$m=4096,t=3,p=1$cIrc/yPa2onhUL4xLpbpuA$BBZmS0iPH83PnRRebs4EiH4Mt1/vppI17gagWaoe878', 1, 'staff', '2025-04-12 04:03:12', '2025-04-12 11:19:49'),
(3, 'User1', 'Nutech', 'user1@gmail.com', '$argon2id$v=19$m=4096,t=3,p=1$Gev69kMhvw/AHaKu8zeFPQ$pfiQ9BVriiKVGg2IpCvXFGvYzuJ91rq5VFyvZcGQzDc', 1, 'user', '2025-04-12 04:49:06', '2025-04-12 13:42:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `destinations`
--
ALTER TABLE `destinations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `packages_detail`
--
ALTER TABLE `packages_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `destinations`
--
ALTER TABLE `destinations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `packages_detail`
--
ALTER TABLE `packages_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
