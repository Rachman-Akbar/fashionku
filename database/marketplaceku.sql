-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 19, 2026 at 09:19 AM
-- Server version: 12.3.3-MariaDB
-- PHP Version: 8.5.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `marketplaceku`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `country` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `city_or_regency` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `subdistrict` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `full_address` text NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `label` varchar(100) NOT NULL,
  `recipient_name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `komerce_destination_id` varchar(50) DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `store_id`, `country`, `province`, `city_or_regency`, `district`, `subdistrict`, `postal_code`, `full_address`, `notes`, `label`, `recipient_name`, `phone_number`, `latitude`, `longitude`, `komerce_destination_id`, `is_primary`, `created_at`, `updated_at`) VALUES
(1, NULL, 1, 'Indonesia', 'Jawa Timur', 'Malang', 'Malang', 'Pusat', '65116', 'Jl. Ijen Nirwana No. 17, Kota Malang', 'Alamat toko', 'Toko', 'Toko Sari Nusantara', '081234561101', -7.97784054, 112.63107955, '46743', 1, '2026-09-14 00:59:39', '2026-09-21 21:19:30'),
(2, NULL, 2, 'Indonesia', 'DKI Jakarta', 'Jakarta Pusat', 'Jakarta Pusat', 'Pusat', '10270', 'Jl. Jend. Sudirman Kav. 21, Jakarta Pusat', 'Alamat toko', 'Toko', 'Raka Cell & Elektronik', '081234561102', -6.20876340, 106.84559900, NULL, 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, NULL, 3, 'Indonesia', 'DI Yogyakarta', 'Yogyakarta', 'Yogyakarta', 'Pusat', '55281', 'Jl. Kaliurang KM 5.5, Sleman, Yogyakarta', 'Alamat toko', 'Toko', 'Rumah Kopi Nusantara', '081234561103', -7.76108750, 110.37390850, NULL, 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(4, NULL, 4, 'Indonesia', 'Jawa Tengah', 'Surakarta', 'Surakarta', 'Pusat', '57112', 'Jl. Slamet Riyadi No. 328, Surakarta', 'Alamat toko', 'Toko', 'Purnama Batik & Fashion', '081234561104', -7.57548870, 110.82347310, NULL, 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(5, NULL, 5, 'Indonesia', 'Jawa Barat', 'Bandung', 'Bandung', 'Pusat', '40115', 'Jl. Braga No. 12, Kota Bandung', 'Alamat toko', 'Toko', 'Ananda Stationery & Kreatif', '081234561105', -6.91746390, 107.60912260, NULL, 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(6, NULL, 6, 'Indonesia', 'Jawa Barat', 'Bekasi', 'Bekasi', 'Pusat', '17148', 'Jl. Ahmad Yani No. 88, Bekasi Timur', 'Alamat toko', 'Toko', 'Sentra Operasional Mandiri', '081234561106', -6.23826960, 106.99153020, '6530', 1, '2026-09-14 00:59:39', '2026-09-15 00:51:06'),
(7, '00000000-0000-4000-8000-000000000201', NULL, 'Indonesia', 'DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', 'Senayan', '12190', 'Jl. Senayan Raya No. 12', NULL, 'Rumah', 'Angga Firmansyah', '081200111001', -6.22502110, 106.80739860, 'KMB-1219', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(8, '00000000-0000-4000-8000-000000000202', NULL, 'Indonesia', 'DKI Jakarta', 'Jakarta Timur', 'Matraman', 'Pal Meriam', '13140', 'Jl. Salemba Raya No. 45', NULL, 'Rumah', 'Dewi Lestari', '081200111002', -6.19839570, 106.86094180, 'KMB-1314', 0, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(9, '00000000-0000-4000-8000-000000000203', NULL, 'Indonesia', 'Jawa Barat', 'Depok', 'Beji', 'Kemiri Muka', '16423', 'Jl. Margonda Raya No. 77', NULL, 'Kantor', 'Rizky Ramadhan', '081200111003', -6.41023070, 106.83170140, 'KMB-1642', 0, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(10, '00000000-0000-4000-8000-000000000204', NULL, 'Indonesia', 'Jawa Barat', 'Bogor', 'Bogor Tengah', 'Pabaton', '16121', 'Jl. Siliwangi No. 23', NULL, 'Rumah', 'Putri Ayu Anindya', '081200111004', -6.59480300, 106.79601800, 'KMB-1612', 0, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(11, '00000000-0000-4000-8000-000000000205', NULL, 'Indonesia', 'Jawa Barat', 'Bandung', 'Coblong', 'Dago', '40135', 'Jl. Ir. H. Juanda No. 56', NULL, 'Rumah', 'Fajar Nugraha', '081200111005', -6.89052280, 107.60462700, 'KMB-4013', 0, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(12, '00000000-0000-4000-8000-000000000206', NULL, 'Indonesia', 'DKI Jakarta', 'Jakarta Utara', 'Kelapa Gading', 'Kelapa Gading Barat', '14240', 'Boulevard Raya No. 101', NULL, 'Kantor', 'Salsa Nadia Putri', '081200111006', -6.16037280, 106.90552610, 'KMB-1424', 0, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(13, '00000000-0000-4000-8000-000000000207', NULL, 'Indonesia', 'Jawa Tengah', 'Semarang', 'Semarang Tengah', 'Pekunden', '50135', 'Jl. Pemuda No. 150', NULL, 'Rumah', 'Dimas Aditya', '081200111007', -6.97168690, 110.41732260, 'KMB-5013', 0, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(14, '00000000-0000-4000-8000-000000000208', NULL, 'Indonesia', 'DI Yogyakarta', 'Sleman', 'Depok', 'Caturtunggal', '55281', 'Jl. Kaliurang KM 4.5', NULL, 'Rumah', 'Intan Permata', '081200111008', -7.77005660, 110.40787660, 'KMB-5528', 0, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(15, '00000000-0000-4000-8000-000000000209', NULL, 'Indonesia', 'Jawa Timur', 'Surabaya', 'Genteng', 'Genteng', '60275', 'Jl. Pemuda No. 88', NULL, 'Kantor', 'Galih Prakoso', '081200111009', -7.26149240, 112.75096510, 'KMB-6027', 0, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(16, '00000000-0000-4000-8000-000000000210', NULL, 'Indonesia', 'Jawa Timur', 'Malang', 'Klojen', 'Bareng', '65116', 'Jl. Ijen No. 9', NULL, 'Rumah', 'Nadia Salsabila', '081200111010', -7.97783810, 112.62294230, 'KMB-6511', 0, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(17, '1ae55236-f781-406a-baa7-62635f4c9545', NULL, 'Belanda', 'Zuid-Holland', 'Naaldwijk', 'Naaldwijk', 'Horti Campus', '2671 DC', 'Horti Campus, Naaldwijk, Westland, Zuid-Holland, Belanda, 2671 DC, Belanda', NULL, 'Rumah', 'uyiuyiuyiu', '078788797', 51.99626240, 4.22051840, NULL, 1, '2026-09-15 00:51:01', '2026-09-15 00:51:01'),
(18, NULL, 8, 'Indonesia', 'Jawa Timur', 'Sidoarjo', 'Tulangan', 'Modong', '61273', 'Modong, Tulangan, Sidoarjo, Jawa Timur, 61273, Indonesia', NULL, 'Alamat Toko', 'Mochammad Rachman Akbar Fahlevy', '079879878', -7.46151600, 112.64595300, '71053', 1, '2026-09-15 21:49:37', '2026-09-15 21:49:37');

-- --------------------------------------------------------

--
-- Table structure for table `admin_fee_configs`
--

CREATE TABLE `admin_fee_configs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `code` varchar(80) NOT NULL,
  `percentage` decimal(5,2) NOT NULL DEFAULT 0.00,
  `fixed_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `min_fee` decimal(15,2) NOT NULL DEFAULT 0.00,
  `max_fee` decimal(15,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `description` text DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_fee_configs`
--

INSERT INTO `admin_fee_configs` (`id`, `category_id`, `name`, `code`, `percentage`, `fixed_amount`, `min_fee`, `max_fee`, `is_active`, `description`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 3, 'Biaya layanan Keripik', 'fee-keripik', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(2, 4, 'Biaya layanan Kue kering', 'fee-kue-kering', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(3, 7, 'Biaya layanan Bakso', 'fee-bakso', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(4, 8, 'Biaya layanan Sate', 'fee-sate', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(5, 9, 'Biaya layanan Ayam goreng', 'fee-ayam-goreng', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(6, 11, 'Biaya layanan Kopi', 'fee-kopi', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(7, 12, 'Biaya layanan Teh', 'fee-teh', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(8, 25, 'Biaya layanan Speaker', 'fee-speaker', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(9, 26, 'Biaya layanan Headphone', 'fee-headphone', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(10, 28, 'Biaya layanan Charger kabel', 'fee-charger-kabel', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(11, 29, 'Biaya layanan Powerbank', 'fee-powerbank', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(12, 36, 'Biaya layanan Kemeja batik', 'fee-kemeja-batik', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(13, 40, 'Biaya layanan Kaos batik', 'fee-kaos-batik', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(14, 43, 'Biaya layanan Blouse', 'fee-blouse', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(15, 50, 'Biaya layanan Batik tulis', 'fee-batik-tulis', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(16, 51, 'Biaya layanan Batik cap', 'fee-batik-cap', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(17, 58, 'Biaya layanan Pulpen', 'fee-pulpen', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(18, 59, 'Biaya layanan Pensil', 'fee-pensil', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(19, 62, 'Biaya layanan Buku catatan', 'fee-buku-catatan', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(20, 67, 'Biaya layanan Stiker', 'fee-stiker', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(21, 78, 'Biaya layanan Serum skincare', 'fee-serum-skincare', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(22, 81, 'Biaya layanan Shampoo', 'fee-shampoo', 2.50, 0.00, 500.00, 25000.00, 1, 'Biaya layanan platform untuk transaksi kategori ini.', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `admin_notifications`
--

CREATE TABLE `admin_notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `actor_id` char(36) DEFAULT NULL,
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `module` varchar(80) NOT NULL,
  `type` varchar(100) NOT NULL,
  `title` varchar(180) NOT NULL,
  `message` text DEFAULT NULL,
  `reference_type` varchar(100) DEFAULT NULL,
  `reference_id` varchar(100) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `read_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_notifications`
--

INSERT INTO `admin_notifications` (`id`, `user_id`, `actor_id`, `store_id`, `module`, `type`, `title`, `message`, `reference_type`, `reference_id`, `url`, `meta`, `read_at`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000202', 2, 'order', 'order_created', 'Pesanan baru #INV-10004', 'Pesanan baru senilai Rp318,000 masuk ke toko raka-teknologi.', 'order', 'INV-10004', '/admin/orders/INV-10004', '{\"amount\":318000}', NULL, 1, '2026-09-06 04:21:50', '2026-09-06 04:21:50', NULL),
(2, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000202', 2, 'order', 'order_created', 'Pesanan baru #INV-10006', 'Pesanan baru senilai Rp349,000 masuk ke toko raka-teknologi.', 'order', 'INV-10006', '/admin/orders/INV-10006', '{\"amount\":349000}', NULL, 1, '2026-09-02 12:38:50', '2026-09-02 12:38:50', NULL),
(3, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000202', 5, 'order', 'order_created', 'Pesanan baru #INV-10011', 'Pesanan baru senilai Rp242,000 masuk ke toko ananda-stationery.', 'order', 'INV-10011', '/admin/orders/INV-10011', '{\"amount\":242000}', NULL, 1, '2026-08-16 04:39:50', '2026-08-16 04:39:50', NULL),
(4, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000207', 2, 'order', 'order_created', 'Pesanan baru #INV-10014', 'Pesanan baru senilai Rp80,000 masuk ke toko raka-teknologi.', 'order', 'INV-10014', '/admin/orders/INV-10014', '{\"amount\":80000}', NULL, 1, '2026-08-12 01:45:50', '2026-08-12 01:45:50', NULL),
(5, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000205', 1, 'order', 'order_created', 'Pesanan baru #INV-10018', 'Pesanan baru senilai Rp30,000 masuk ke toko sari-nusantara.', 'order', 'INV-10018', '/admin/orders/INV-10018', '{\"amount\":30000}', NULL, 1, '2026-08-06 12:45:50', '2026-08-06 12:45:50', NULL),
(6, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000206', 5, 'order', 'order_created', 'Pesanan baru #INV-10021', 'Pesanan baru senilai Rp108,000 masuk ke toko ananda-stationery.', 'order', 'INV-10021', '/admin/orders/INV-10021', '{\"amount\":108000}', NULL, 1, '2026-07-10 21:33:50', '2026-07-10 21:33:50', NULL),
(7, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000203', 5, 'order', 'order_created', 'Pesanan baru #INV-10022', 'Pesanan baru senilai Rp200,000 masuk ke toko ananda-stationery.', 'order', 'INV-10022', '/admin/orders/INV-10022', '{\"amount\":200000}', NULL, 1, '2026-08-08 21:20:50', '2026-08-08 21:20:50', NULL),
(8, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000209', 6, 'order', 'order_created', 'Pesanan baru #INV-10023', 'Pesanan baru senilai Rp456,000 masuk ke toko sentra-operasional.', 'order', 'INV-10023', '/admin/orders/INV-10023', '{\"amount\":456000}', NULL, 1, '2026-08-16 00:58:50', '2026-08-16 00:58:50', NULL),
(9, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000203', 3, 'review', 'review_received', 'Ulasan bintang 5 untuk Rumah Kopi Nusantara', 'Pembeli memberikan ulasan positif pada produk Kopi Arabika Gayo.', 'review', NULL, '/admin/reviews', '{\"rating\":5}', NULL, 1, '2026-02-10 08:59:56', '2026-02-10 08:59:56', NULL),
(10, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000102', 2, 'withdrawal', 'withdrawal_request', 'Permintaan penarikan dana dari Raka Cell', 'Seller mengajukan penarikan dana sebesar Rp1.200.000.', 'withdrawal', '', '/admin/withdrawals', '{\"amount\":1200000,\"status\":\"pending\"}', NULL, 1, '2026-02-10 08:59:56', '2026-02-10 08:59:56', NULL),
(11, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', 1, 'promotion', 'promotion_pending', 'Promo baru menunggu persetujuan', 'Toko Sari Nusantara mengajukan promo gratis ongkir.', 'promotion', '', '/admin/promotions', '{\"status\":\"pending\"}', '2026-02-10 08:59:56', 1, '2026-02-10 08:59:56', '2026-02-10 08:59:56', NULL),
(12, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000105', 5, 'stock', 'low_stock', 'Stok Buku Catatan A5 varian Merah habis', 'Varian Merah Buku Catatan Hardcover A5 berada di bawah stok minimum.', 'low_stock', '', '/admin/stocks', '{\"warning\":\"stok kurang dari minimum\"}', NULL, 1, '2026-02-10 08:59:56', '2026-02-10 08:59:56', NULL),
(13, '00000000-0000-4000-8000-000000000001', '1ae55236-f781-406a-baa7-62635f4c9545', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260915075147-B9B96E · Rp 52.000', 'order', '72', '/admin/orders?order=72', '{\"order_number\":\"ORD-20260915075147-B9B96E\",\"order_type\":\"normal\",\"payment_method\":\"midtrans\"}', NULL, 1, '2026-09-15 00:51:49', '2026-09-15 00:51:49', NULL),
(14, '00000000-0000-4000-8000-000000000002', '1ae55236-f781-406a-baa7-62635f4c9545', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260915075147-B9B96E · Rp 52.000', 'order', '72', '/admin/orders?order=72', '{\"order_number\":\"ORD-20260915075147-B9B96E\",\"order_type\":\"normal\",\"payment_method\":\"midtrans\"}', NULL, 1, '2026-09-15 00:51:49', '2026-09-15 00:51:49', NULL),
(15, '00000000-0000-4000-8000-000000000001', '1ae55236-f781-406a-baa7-62635f4c9545', 8, 'stores', 'store.registration.created', 'Pendaftaran toko baru', 'Akbar menunggu pemeriksaan admin.', 'store', '8', '/admin/stores?store=8', '{\"status\":\"pending\"}', '2026-09-18 18:40:16', 1, '2026-09-15 21:49:37', '2026-09-18 18:40:16', NULL),
(16, '00000000-0000-4000-8000-000000000002', '1ae55236-f781-406a-baa7-62635f4c9545', 8, 'stores', 'store.registration.created', 'Pendaftaran toko baru', 'Akbar menunggu pemeriksaan admin.', 'store', '8', '/admin/stores?store=8', '{\"status\":\"pending\"}', NULL, 1, '2026-09-15 21:49:37', '2026-09-15 21:49:37', NULL),
(17, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922041909-AAF655 · Rp 45.000', 'order', '74', '/admin/orders?order=74', '{\"order_number\":\"ORD-20260922041909-AAF655\",\"order_type\":\"normal\",\"payment_method\":\"tunai_toko\"}', NULL, 1, '2026-09-21 21:19:09', '2026-09-21 21:19:09', NULL),
(18, '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922041909-AAF655 · Rp 45.000', 'order', '74', '/admin/orders?order=74', '{\"order_number\":\"ORD-20260922041909-AAF655\",\"order_type\":\"normal\",\"payment_method\":\"tunai_toko\"}', NULL, 1, '2026-09-21 21:19:09', '2026-09-21 21:19:09', NULL),
(19, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922041955-894F42 · Rp 45.000', 'order', '75', '/admin/orders?order=75', '{\"order_number\":\"ORD-20260922041955-894F42\",\"order_type\":\"normal\",\"payment_method\":\"tunai_toko\"}', NULL, 1, '2026-09-21 21:19:55', '2026-09-21 21:19:55', NULL),
(20, '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922041955-894F42 · Rp 45.000', 'order', '75', '/admin/orders?order=75', '{\"order_number\":\"ORD-20260922041955-894F42\",\"order_type\":\"normal\",\"payment_method\":\"tunai_toko\"}', NULL, 1, '2026-09-21 21:19:55', '2026-09-21 21:19:55', NULL),
(21, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922042035-C3BC77 · Rp 45.000', 'order', '76', '/admin/orders?order=76', '{\"order_number\":\"ORD-20260922042035-C3BC77\",\"order_type\":\"normal\",\"payment_method\":\"tunai_toko\"}', NULL, 1, '2026-09-21 21:20:35', '2026-09-21 21:20:35', NULL),
(22, '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922042035-C3BC77 · Rp 45.000', 'order', '76', '/admin/orders?order=76', '{\"order_number\":\"ORD-20260922042035-C3BC77\",\"order_type\":\"normal\",\"payment_method\":\"tunai_toko\"}', NULL, 1, '2026-09-21 21:20:35', '2026-09-21 21:20:35', NULL),
(23, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922042156-FD5DB2 · Rp 57.000', 'order', '77', '/admin/orders?order=77', '{\"order_number\":\"ORD-20260922042156-FD5DB2\",\"order_type\":\"normal\",\"payment_method\":\"transfer_manual\"}', NULL, 1, '2026-09-21 21:21:56', '2026-09-21 21:21:56', NULL),
(24, '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922042156-FD5DB2 · Rp 57.000', 'order', '77', '/admin/orders?order=77', '{\"order_number\":\"ORD-20260922042156-FD5DB2\",\"order_type\":\"normal\",\"payment_method\":\"transfer_manual\"}', NULL, 1, '2026-09-21 21:21:56', '2026-09-21 21:21:56', NULL),
(25, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922042221-BD4857 · Rp 57.000', 'order', '78', '/admin/orders?order=78', '{\"order_number\":\"ORD-20260922042221-BD4857\",\"order_type\":\"normal\",\"payment_method\":\"transfer_manual\"}', NULL, 1, '2026-09-21 21:22:21', '2026-09-21 21:22:21', NULL),
(26, '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922042221-BD4857 · Rp 57.000', 'order', '78', '/admin/orders?order=78', '{\"order_number\":\"ORD-20260922042221-BD4857\",\"order_type\":\"normal\",\"payment_method\":\"transfer_manual\"}', NULL, 1, '2026-09-21 21:22:21', '2026-09-21 21:22:21', NULL),
(27, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922042222-B3A357 · Rp 42.000', 'order', '79', '/admin/orders?order=79', '{\"order_number\":\"ORD-20260922042222-B3A357\",\"order_type\":\"normal\",\"payment_method\":\"transfer_manual\"}', NULL, 1, '2026-09-21 21:22:22', '2026-09-21 21:22:22', NULL),
(28, '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922042222-B3A357 · Rp 42.000', 'order', '79', '/admin/orders?order=79', '{\"order_number\":\"ORD-20260922042222-B3A357\",\"order_type\":\"normal\",\"payment_method\":\"transfer_manual\"}', NULL, 1, '2026-09-21 21:22:22', '2026-09-21 21:22:22', NULL),
(29, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922045410-5E3B03 · Rp 57.000', 'order', '84', '/admin/orders?order=84', '{\"order_number\":\"ORD-20260922045410-5E3B03\",\"order_type\":\"normal\",\"payment_method\":\"transfer_manual\"}', NULL, 1, '2026-09-21 21:54:10', '2026-09-21 21:54:10', NULL),
(30, '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000202', NULL, 'orders', 'order.created', 'Pesanan baru', 'ORD-20260922045410-5E3B03 · Rp 57.000', 'order', '84', '/admin/orders?order=84', '{\"order_number\":\"ORD-20260922045410-5E3B03\",\"order_type\":\"normal\",\"payment_method\":\"transfer_manual\"}', NULL, 1, '2026-09-21 21:54:10', '2026-09-21 21:54:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `store_id`, `name`, `image_url`, `sort_order`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 7, 'Shopee Serba Bisa ala Marketku', 'https://picsum.photos/seed/banner-hero-1/1200/480', 1, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(2, 7, 'Promo Kategori Elektronik', 'https://picsum.photos/seed/banner-hero-2/1200/480', 2, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(3, 7, 'Batik Pilihan Pengrajin Nusantara', 'https://picsum.photos/seed/banner-hero-3/1200/480', 3, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(4, 1, 'Sebulan Kemerdekaan Belanja Sari Nusantara', 'https://picsum.photos/seed/banner-sari/1200/480', 1, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(5, 2, 'Gadget Gathering Raka Cell', 'https://picsum.photos/seed/banner-raka/1200/480', 1, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(6, 3, 'Launch Kopi Musang Kintamani', 'https://picsum.photos/seed/banner-kopi/1200/480', 1, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(7, 4, 'Batik Tulis Pilihan Oktober', 'https://picsum.photos/seed/banner-purnama/1200/480', 1, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(8, 2, '111111112ws', 'http://127.0.0.1:8000/storage/marketplace/banners/3n2O1Wlp4XPc54wb2MXJ2RyimEPd9JTPXuFHcoef.png', 0, 1, '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', '2026-09-18 19:05:34', '2026-09-18 19:05:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('marketapi-cache-26281a47653aeb94edd6405720e0c1eb05e61b69', 'i:3;', 1790154939),
('marketapi-cache-26281a47653aeb94edd6405720e0c1eb05e61b69:timer', 'i:1790154939;', 1790154939),
('marketapi-cache-3223f9162256d798e1a088840ac802b44623d36a', 'i:5;', 1789787391),
('marketapi-cache-3223f9162256d798e1a088840ac802b44623d36a:timer', 'i:1789787391;', 1789787391),
('marketapi-cache-329ec4f443e9dd75319f770816c5c1ee337f2134', 'i:3;', 1789995350),
('marketapi-cache-329ec4f443e9dd75319f770816c5c1ee337f2134:timer', 'i:1789995350;', 1789995350),
('marketapi-cache-4fef21ede8fad6e894fae4e6ade9df5bd4eea746', 'i:3;', 1790835481),
('marketapi-cache-4fef21ede8fad6e894fae4e6ade9df5bd4eea746:timer', 'i:1790835481;', 1790835481),
('marketapi-cache-5c785c036466adea360111aa28563bfd556b5fba', 'i:1;', 1792372530),
('marketapi-cache-5c785c036466adea360111aa28563bfd556b5fba:timer', 'i:1792372530;', 1792372530),
('marketapi-cache-97cb3bd7164840b03045ffa125a8054d71e57644', 'i:1;', 1792374765),
('marketapi-cache-97cb3bd7164840b03045ffa125a8054d71e57644:timer', 'i:1792374765;', 1792374765),
('marketapi-cache-admin_dashboard_stats_monthly', 'a:7:{s:6:\"period\";s:7:\"monthly\";s:10:\"start_date\";s:10:\"2026-09-01\";s:6:\"orders\";a:5:{s:5:\"total\";i:7;s:9:\"completed\";i:4;s:9:\"cancelled\";i:0;s:7:\"revenue\";d:1297000;s:15:\"conversion_rate\";d:57.1;}s:5:\"users\";a:2:{s:5:\"total\";i:19;s:3:\"new\";i:19;}s:6:\"stores\";a:2:{s:5:\"total\";i:8;s:3:\"new\";i:8;}s:8:\"products\";a:2:{s:5:\"total\";i:43;s:3:\"new\";i:43;}s:7:\"finance\";a:1:{s:20:\"admin_fees_collected\";d:16100;}}', 1789978880),
('marketapi-cache-admin_dashboard_top_stores_monthly_10', 'a:4:{i:0;a:4:{s:8:\"store_id\";i:2;s:10:\"store_name\";s:22:\"Raka Cell & Elektronik\";s:11:\"order_count\";i:3;s:7:\"revenue\";d:847000;}i:1;a:4:{s:8:\"store_id\";i:6;s:10:\"store_name\";s:26:\"Sentra Operasional Mandiri\";s:11:\"order_count\";i:2;s:7:\"revenue\";d:246000;}i:2;a:4:{s:8:\"store_id\";i:5;s:10:\"store_name\";s:27:\"Ananda Stationery & Kreatif\";s:11:\"order_count\";i:1;s:7:\"revenue\";d:126000;}i:3;a:4:{s:8:\"store_id\";i:4;s:10:\"store_name\";s:23:\"Purnama Batik & Fashion\";s:11:\"order_count\";i:1;s:7:\"revenue\";d:78000;}}', 1789978880),
('marketapi-cache-admin_dashboard_trend_monthly', 'a:2:{s:6:\"period\";s:7:\"monthly\";s:5:\"trend\";a:21:{i:0;a:4:{s:4:\"date\";s:10:\"2026-09-01\";s:6:\"orders\";i:1;s:7:\"revenue\";d:78000;s:9:\"completed\";i:1;}i:1;a:4:{s:4:\"date\";s:10:\"2026-09-02\";s:6:\"orders\";i:1;s:7:\"revenue\";d:364000;s:9:\"completed\";i:0;}i:2;a:4:{s:4:\"date\";s:10:\"2026-09-03\";s:6:\"orders\";i:1;s:7:\"revenue\";d:126000;s:9:\"completed\";i:1;}i:3;a:4:{s:4:\"date\";s:10:\"2026-09-04\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}i:4;a:4:{s:4:\"date\";s:10:\"2026-09-05\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}i:5;a:4:{s:4:\"date\";s:10:\"2026-09-06\";s:6:\"orders\";i:1;s:7:\"revenue\";d:333000;s:9:\"completed\";i:1;}i:6;a:4:{s:4:\"date\";s:10:\"2026-09-07\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}i:7;a:4:{s:4:\"date\";s:10:\"2026-09-08\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}i:8;a:4:{s:4:\"date\";s:10:\"2026-09-09\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}i:9;a:4:{s:4:\"date\";s:10:\"2026-09-10\";s:6:\"orders\";i:1;s:7:\"revenue\";d:150000;s:9:\"completed\";i:1;}i:10;a:4:{s:4:\"date\";s:10:\"2026-09-11\";s:6:\"orders\";i:1;s:7:\"revenue\";d:194000;s:9:\"completed\";i:0;}i:11;a:4:{s:4:\"date\";s:10:\"2026-09-12\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}i:12;a:4:{s:4:\"date\";s:10:\"2026-09-13\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}i:13;a:4:{s:4:\"date\";s:10:\"2026-09-14\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}i:14;a:4:{s:4:\"date\";s:10:\"2026-09-15\";s:6:\"orders\";i:1;s:7:\"revenue\";d:52000;s:9:\"completed\";i:0;}i:15;a:4:{s:4:\"date\";s:10:\"2026-09-16\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}i:16;a:4:{s:4:\"date\";s:10:\"2026-09-17\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}i:17;a:4:{s:4:\"date\";s:10:\"2026-09-18\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}i:18;a:4:{s:4:\"date\";s:10:\"2026-09-19\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}i:19;a:4:{s:4:\"date\";s:10:\"2026-09-20\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}i:20;a:4:{s:4:\"date\";s:10:\"2026-09-21\";s:6:\"orders\";i:0;s:7:\"revenue\";d:0;s:9:\"completed\";i:0;}}}', 1789978880),
('marketapi-cache-admin_store_context_stats_2_monthly', 'a:6:{s:6:\"period\";s:7:\"monthly\";s:10:\"start_date\";s:10:\"2026-09-01\";s:5:\"store\";a:4:{s:2:\"id\";i:2;s:4:\"name\";s:22:\"Raka Cell & Elektronik\";s:6:\"status\";s:8:\"approved\";s:9:\"is_active\";b:1;}s:6:\"orders\";a:5:{s:5:\"total\";i:3;s:7:\"revenue\";d:802000;s:8:\"shipping\";d:45000;s:10:\"admin_fees\";d:20050;s:10:\"seller_net\";d:826950;}s:11:\"settlements\";a:6:{s:5:\"total\";i:2;s:7:\"settled\";i:2;s:7:\"pending\";i:0;s:5:\"gross\";d:453000;s:9:\"admin_fee\";d:11325;s:3:\"net\";d:471675;}s:8:\"products\";a:2:{s:5:\"total\";i:8;s:6:\"active\";i:8;}}', 1789782339),
('marketapi-cache-auth.otp.5fae480f5e6bd904788ff6ae9755d07dabdfc14f98c84515713852fb60058f4c', 'a:3:{s:4:\"code\";s:6:\"939614\";s:5:\"email\";s:35:\"mochammad.rachman112@smk.belajar.id\";s:10:\"expires_at\";i:1792375305;}', 1792375305),
('marketapi-cache-catalog_categories_menu_rows_active_v3', 'a:82:{i:0;a:13:{s:2:\"id\";i:56;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Alat Tulis\";s:4:\"slug\";s:10:\"alat-tulis\";s:9:\"full_slug\";s:10:\"alat-tulis\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:1;a:13:{s:2:\"id\";i:23;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Elektronik\";s:4:\"slug\";s:10:\"elektronik\";s:9:\"full_slug\";s:10:\"elektronik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:2;a:13:{s:2:\"id\";i:72;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Kesehatan\";s:4:\"slug\";s:9:\"kesehatan\";s:9:\"full_slug\";s:9:\"kesehatan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:3;a:13:{s:2:\"id\";i:1;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Makanan\";s:4:\"slug\";s:7:\"makanan\";s:9:\"full_slug\";s:7:\"makanan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:4;a:13:{s:2:\"id\";i:34;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Pakaian Pria\";s:4:\"slug\";s:12:\"pakaian-pria\";s:9:\"full_slug\";s:12:\"pakaian-pria\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:5;a:13:{s:2:\"id\";i:14;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Rumah\";s:4:\"slug\";s:5:\"rumah\";s:9:\"full_slug\";s:5:\"rumah\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:6;a:13:{s:2:\"id\";i:76;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kecantikan\";s:4:\"slug\";s:10:\"kecantikan\";s:9:\"full_slug\";s:10:\"kecantikan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:7;a:13:{s:2:\"id\";i:65;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Kerajinan\";s:4:\"slug\";s:9:\"kerajinan\";s:9:\"full_slug\";s:9:\"kerajinan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:8;a:13:{s:2:\"id\";i:41;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Pakaian Wanita\";s:4:\"slug\";s:14:\"pakaian-wanita\";s:9:\"full_slug\";s:14:\"pakaian-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:9;a:13:{s:2:\"id\";i:48;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Batik & Kain\";s:4:\"slug\";s:10:\"batik-kain\";s:9:\"full_slug\";s:10:\"batik-kain\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:10;a:13:{s:2:\"id\";i:42;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:41;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Atasan Wanita\";s:4:\"slug\";s:13:\"atasan-wanita\";s:9:\"full_slug\";s:28:\"pakaian-wanita/atasan-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:11;a:13:{s:2:\"id\";i:24;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:23;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Audio\";s:4:\"slug\";s:5:\"audio\";s:9:\"full_slug\";s:16:\"elektronik/audio\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:12;a:13:{s:2:\"id\";i:49;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:48;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Batik\";s:4:\"slug\";s:5:\"batik\";s:9:\"full_slug\";s:16:\"batik-kain/batik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:13;a:13:{s:2:\"id\";i:15;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:14;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kebersihan\";s:4:\"slug\";s:10:\"kebersihan\";s:9:\"full_slug\";s:16:\"rumah/kebersihan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:14;a:13:{s:2:\"id\";i:35;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:34;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Kemeja Pria\";s:4:\"slug\";s:11:\"kemeja-pria\";s:9:\"full_slug\";s:24:\"pakaian-pria/kemeja-pria\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:15;a:13:{s:2:\"id\";i:2;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:1;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Makanan Ringan\";s:4:\"slug\";s:14:\"makanan-ringan\";s:9:\"full_slug\";s:22:\"makanan/makanan-ringan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:16;a:13:{s:2:\"id\";i:57;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:56;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Menulis\";s:4:\"slug\";s:7:\"menulis\";s:9:\"full_slug\";s:18:\"alat-tulis/menulis\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:17;a:13:{s:2:\"id\";i:77;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:76;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Perawatan Kulit\";s:4:\"slug\";s:15:\"perawatan-kulit\";s:9:\"full_slug\";s:26:\"kecantikan/perawatan-kulit\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:18;a:13:{s:2:\"id\";i:73;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:72;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Perawatan Tubuh\";s:4:\"slug\";s:15:\"perawatan-tubuh\";s:9:\"full_slug\";s:25:\"kesehatan/perawatan-tubuh\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:19;a:13:{s:2:\"id\";i:66;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:65;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Stiker & Tape\";s:4:\"slug\";s:11:\"stiker-tape\";s:9:\"full_slug\";s:21:\"kerajinan/stiker-tape\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:20;a:13:{s:2:\"id\";i:27;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:23;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Aksesori Gadget\";s:4:\"slug\";s:15:\"aksesori-gadget\";s:9:\"full_slug\";s:26:\"elektronik/aksesori-gadget\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:21;a:13:{s:2:\"id\";i:69;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:65;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Bahan Kerajinan\";s:4:\"slug\";s:15:\"bahan-kerajinan\";s:9:\"full_slug\";s:25:\"kerajinan/bahan-kerajinan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:22;a:13:{s:2:\"id\";i:45;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:41;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Bawahan Wanita\";s:4:\"slug\";s:14:\"bawahan-wanita\";s:9:\"full_slug\";s:29:\"pakaian-wanita/bawahan-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:23;a:13:{s:2:\"id\";i:19;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:14;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:8:\"Dekorasi\";s:4:\"slug\";s:8:\"dekorasi\";s:9:\"full_slug\";s:14:\"rumah/dekorasi\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:24;a:13:{s:2:\"id\";i:53;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:48;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:16:\"Kain Tradisional\";s:4:\"slug\";s:16:\"kain-tradisional\";s:9:\"full_slug\";s:27:\"batik-kain/kain-tradisional\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:25;a:13:{s:2:\"id\";i:38;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:34;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Kaos Pria\";s:4:\"slug\";s:9:\"kaos-pria\";s:9:\"full_slug\";s:22:\"pakaian-pria/kaos-pria\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:26;a:13:{s:2:\"id\";i:61;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:56;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Kertas & Buku\";s:4:\"slug\";s:11:\"kertas-buku\";s:9:\"full_slug\";s:22:\"alat-tulis/kertas-buku\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:27;a:13:{s:2:\"id\";i:6;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:1;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:17:\"Makanan Siap Saji\";s:4:\"slug\";s:17:\"makanan-siap-saji\";s:9:\"full_slug\";s:25:\"makanan/makanan-siap-saji\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:28;a:13:{s:2:\"id\";i:80;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:76;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:16:\"Perawatan Rambut\";s:4:\"slug\";s:16:\"perawatan-rambut\";s:9:\"full_slug\";s:27:\"kecantikan/perawatan-rambut\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:29;a:13:{s:2:\"id\";i:10;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:1;s:5:\"level\";i:2;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Minuman\";s:4:\"slug\";s:7:\"minuman\";s:9:\"full_slug\";s:15:\"makanan/minuman\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:30;a:13:{s:2:\"id\";i:31;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:23;s:5:\"level\";i:2;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Perangkat Lain\";s:4:\"slug\";s:14:\"perangkat-lain\";s:9:\"full_slug\";s:25:\"elektronik/perangkat-lain\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:31;a:13:{s:2:\"id\";i:7;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:6;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Bakso\";s:4:\"slug\";s:5:\"bakso\";s:9:\"full_slug\";s:31:\"makanan/makanan-siap-saji/bakso\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:32;a:13:{s:2:\"id\";i:50;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:49;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Batik Tulis\";s:4:\"slug\";s:11:\"batik-tulis\";s:9:\"full_slug\";s:28:\"batik-kain/batik/batik-tulis\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:33;a:13:{s:2:\"id\";i:43;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:42;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Blouse & Kemeja\";s:4:\"slug\";s:6:\"blouse\";s:9:\"full_slug\";s:35:\"pakaian-wanita/atasan-wanita/blouse\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:34;a:13:{s:2:\"id\";i:62;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:61;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Buku Catatan\";s:4:\"slug\";s:12:\"buku-catatan\";s:9:\"full_slug\";s:35:\"alat-tulis/kertas-buku/buku-catatan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:35;a:13:{s:2:\"id\";i:28;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:27;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Charger & Kabel\";s:4:\"slug\";s:13:\"charger-kabel\";s:9:\"full_slug\";s:40:\"elektronik/aksesori-gadget/charger-kabel\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:36;a:13:{s:2:\"id\";i:54;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:53;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kain Tenun\";s:4:\"slug\";s:10:\"kain-tenun\";s:9:\"full_slug\";s:38:\"batik-kain/kain-tradisional/kain-tenun\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:37;a:13:{s:2:\"id\";i:39;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:38;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kaos Polos\";s:4:\"slug\";s:10:\"kaos-polos\";s:9:\"full_slug\";s:33:\"pakaian-pria/kaos-pria/kaos-polos\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:38;a:13:{s:2:\"id\";i:36;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:35;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Kemeja Batik\";s:4:\"slug\";s:12:\"kemeja-batik\";s:9:\"full_slug\";s:37:\"pakaian-pria/kemeja-pria/kemeja-batik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:39;a:13:{s:2:\"id\";i:3;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:2;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Keripik & Snack\";s:4:\"slug\";s:7:\"keripik\";s:9:\"full_slug\";s:30:\"makanan/makanan-ringan/keripik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:40;a:13:{s:2:\"id\";i:70;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:69;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:29:\"Kertas Kerajinan (Papercraft)\";s:4:\"slug\";s:10:\"papercraft\";s:9:\"full_slug\";s:36:\"kerajinan/bahan-kerajinan/papercraft\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:41;a:13:{s:2:\"id\";i:11;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:10;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:4:\"Kopi\";s:4:\"slug\";s:4:\"kopi\";s:9:\"full_slug\";s:20:\"makanan/minuman/kopi\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:5;}i:42;a:13:{s:2:\"id\";i:32;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:31;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Lampu LED\";s:4:\"slug\";s:9:\"lampu-led\";s:9:\"full_slug\";s:35:\"elektronik/perangkat-lain/lampu-led\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:43;a:13:{s:2:\"id\";i:20;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:19;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:17:\"Lilin & Pengharum\";s:4:\"slug\";s:11:\"lilin-aroma\";s:9:\"full_slug\";s:26:\"rumah/dekorasi/lilin-aroma\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:44;a:13:{s:2:\"id\";i:16;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:15;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Pel & Lap\";s:4:\"slug\";s:7:\"pel-lap\";s:9:\"full_slug\";s:24:\"rumah/kebersihan/pel-lap\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:45;a:13:{s:2:\"id\";i:58;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:57;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:6:\"Pulpen\";s:4:\"slug\";s:6:\"pulpen\";s:9:\"full_slug\";s:25:\"alat-tulis/menulis/pulpen\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:46;a:13:{s:2:\"id\";i:46;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:45;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:3:\"Rok\";s:4:\"slug\";s:3:\"rok\";s:9:\"full_slug\";s:33:\"pakaian-wanita/bawahan-wanita/rok\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:47;a:13:{s:2:\"id\";i:74;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:73;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:17:\"Sabun & Body Care\";s:4:\"slug\";s:15:\"sabun-body-care\";s:9:\"full_slug\";s:41:\"kesehatan/perawatan-tubuh/sabun-body-care\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:48;a:13:{s:2:\"id\";i:78;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:77;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:16:\"Serum & Skincare\";s:4:\"slug\";s:14:\"serum-skincare\";s:9:\"full_slug\";s:41:\"kecantikan/perawatan-kulit/serum-skincare\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:49;a:13:{s:2:\"id\";i:81;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:80;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Shampoo\";s:4:\"slug\";s:7:\"shampoo\";s:9:\"full_slug\";s:35:\"kecantikan/perawatan-rambut/shampoo\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:50;a:13:{s:2:\"id\";i:25;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:24;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Speaker\";s:4:\"slug\";s:7:\"speaker\";s:9:\"full_slug\";s:24:\"elektronik/audio/speaker\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:51;a:13:{s:2:\"id\";i:67;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:66;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:6:\"Stiker\";s:4:\"slug\";s:6:\"stiker\";s:9:\"full_slug\";s:28:\"kerajinan/stiker-tape/stiker\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:52;a:13:{s:2:\"id\";i:33;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:31;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:19:\"Adaptor & Converter\";s:4:\"slug\";s:7:\"adaptor\";s:9:\"full_slug\";s:33:\"elektronik/perangkat-lain/adaptor\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:53;a:13:{s:2:\"id\";i:51;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:49;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Batik Cap\";s:4:\"slug\";s:9:\"batik-cap\";s:9:\"full_slug\";s:26:\"batik-kain/batik/batik-cap\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:54;a:13:{s:2:\"id\";i:47;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:45;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Celana Wanita\";s:4:\"slug\";s:13:\"celana-wanita\";s:9:\"full_slug\";s:43:\"pakaian-wanita/bawahan-wanita/celana-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:55;a:13:{s:2:\"id\";i:26;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:24;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:20:\"Headphone & Earphone\";s:4:\"slug\";s:9:\"headphone\";s:9:\"full_slug\";s:26:\"elektronik/audio/headphone\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:56;a:13:{s:2:\"id\";i:55;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:53;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kain Lurik\";s:4:\"slug\";s:10:\"kain-lurik\";s:9:\"full_slug\";s:38:\"batik-kain/kain-tradisional/kain-lurik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:57;a:13:{s:2:\"id\";i:40;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:38;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kaos Batik\";s:4:\"slug\";s:10:\"kaos-batik\";s:9:\"full_slug\";s:33:\"pakaian-pria/kaos-pria/kaos-batik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:58;a:13:{s:2:\"id\";i:44;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:42;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:21:\"Kebaya & Bahan Wanita\";s:4:\"slug\";s:6:\"kebaya\";s:9:\"full_slug\";s:35:\"pakaian-wanita/atasan-wanita/kebaya\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:59;a:13:{s:2:\"id\";i:37;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:35;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Kemeja Formal\";s:4:\"slug\";s:13:\"kemeja-formal\";s:9:\"full_slug\";s:38:\"pakaian-pria/kemeja-pria/kemeja-formal\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:60;a:13:{s:2:\"id\";i:63;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:61;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kertas HVS\";s:4:\"slug\";s:10:\"kertas-hvs\";s:9:\"full_slug\";s:33:\"alat-tulis/kertas-buku/kertas-hvs\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:61;a:13:{s:2:\"id\";i:4;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:2;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kue Kering\";s:4:\"slug\";s:10:\"kue-kering\";s:9:\"full_slug\";s:33:\"makanan/makanan-ringan/kue-kering\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:3;}i:62;a:13:{s:2:\"id\";i:82;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:80;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Minyak Rambut\";s:4:\"slug\";s:13:\"minyak-rambut\";s:9:\"full_slug\";s:41:\"kecantikan/perawatan-rambut/minyak-rambut\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:63;a:13:{s:2:\"id\";i:59;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:57;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:21:\"Pensil & Pensil Warna\";s:4:\"slug\";s:6:\"pensil\";s:9:\"full_slug\";s:25:\"alat-tulis/menulis/pensil\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:64;a:13:{s:2:\"id\";i:71;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:69;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Pita & Manik\";s:4:\"slug\";s:10:\"pita-manik\";s:9:\"full_slug\";s:36:\"kerajinan/bahan-kerajinan/pita-manik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:65;a:13:{s:2:\"id\";i:29;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:27;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Powerbank\";s:4:\"slug\";s:9:\"powerbank\";s:9:\"full_slug\";s:36:\"elektronik/aksesori-gadget/powerbank\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:66;a:13:{s:2:\"id\";i:17;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:15;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Sapu & Sikat\";s:4:\"slug\";s:9:\"sapu-siku\";s:9:\"full_slug\";s:26:\"rumah/kebersihan/sapu-siku\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:67;a:13:{s:2:\"id\";i:8;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:6;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:4:\"Sate\";s:4:\"slug\";s:4:\"sate\";s:9:\"full_slug\";s:30:\"makanan/makanan-siap-saji/sate\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:68;a:13:{s:2:\"id\";i:79;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:77;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Sunscreen\";s:4:\"slug\";s:9:\"sunscreen\";s:9:\"full_slug\";s:36:\"kecantikan/perawatan-kulit/sunscreen\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:69;a:13:{s:2:\"id\";i:75;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:73;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:18:\"Suplemen & Vitamin\";s:4:\"slug\";s:8:\"suplemen\";s:9:\"full_slug\";s:34:\"kesehatan/perawatan-tubuh/suplemen\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:70;a:13:{s:2:\"id\";i:12;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:10;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:3:\"Teh\";s:4:\"slug\";s:3:\"teh\";s:9:\"full_slug\";s:19:\"makanan/minuman/teh\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:71;a:13:{s:2:\"id\";i:21;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:19;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Vas & Pot\";s:4:\"slug\";s:7:\"vas-pot\";s:9:\"full_slug\";s:22:\"rumah/dekorasi/vas-pot\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:72;a:13:{s:2:\"id\";i:68;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:66;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Washi Tape\";s:4:\"slug\";s:10:\"washi-tape\";s:9:\"full_slug\";s:32:\"kerajinan/stiker-tape/washi-tape\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:73;a:13:{s:2:\"id\";i:9;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:6;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Ayam Goreng\";s:4:\"slug\";s:11:\"ayam-goreng\";s:9:\"full_slug\";s:37:\"makanan/makanan-siap-saji/ayam-goreng\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:74;a:13:{s:2:\"id\";i:52;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:49;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Batik Printing\";s:4:\"slug\";s:14:\"batik-printing\";s:9:\"full_slug\";s:31:\"batik-kain/batik/batik-printing\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:75;a:13:{s:2:\"id\";i:30;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:27;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:18:\"Casing & Pelindung\";s:4:\"slug\";s:16:\"casing-pelindung\";s:9:\"full_slug\";s:43:\"elektronik/aksesori-gadget/casing-pelindung\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:76;a:13:{s:2:\"id\";i:5;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:2;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:16:\"Cokelat & Permen\";s:4:\"slug\";s:7:\"cokelat\";s:9:\"full_slug\";s:30:\"makanan/makanan-ringan/cokelat\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:77;a:13:{s:2:\"id\";i:22;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:19;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Jam Dinding\";s:4:\"slug\";s:11:\"jam-dinding\";s:9:\"full_slug\";s:26:\"rumah/dekorasi/jam-dinding\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:78;a:13:{s:2:\"id\";i:64;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:61;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Kertas Kado\";s:4:\"slug\";s:11:\"kertas-kado\";s:9:\"full_slug\";s:34:\"alat-tulis/kertas-buku/kertas-kado\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:79;a:13:{s:2:\"id\";i:13;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:10;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Sirup & Jus\";s:4:\"slug\";s:9:\"sirup-jus\";s:9:\"full_slug\";s:25:\"makanan/minuman/sirup-jus\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:80;a:13:{s:2:\"id\";i:60;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:57;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:20:\"Spidol & Highlighter\";s:4:\"slug\";s:6:\"spidol\";s:9:\"full_slug\";s:25:\"alat-tulis/menulis/spidol\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:81;a:13:{s:2:\"id\";i:18;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:15;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Tempat Sampah\";s:4:\"slug\";s:13:\"tempat-sampah\";s:9:\"full_slug\";s:30:\"rumah/kebersihan/tempat-sampah\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}}', 1792383907);
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('marketapi-cache-catalog_categories_tree_rows_active_v3', 'a:82:{i:0;a:13:{s:2:\"id\";i:56;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Alat Tulis\";s:4:\"slug\";s:10:\"alat-tulis\";s:9:\"full_slug\";s:10:\"alat-tulis\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:1;a:13:{s:2:\"id\";i:23;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Elektronik\";s:4:\"slug\";s:10:\"elektronik\";s:9:\"full_slug\";s:10:\"elektronik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:2;a:13:{s:2:\"id\";i:72;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Kesehatan\";s:4:\"slug\";s:9:\"kesehatan\";s:9:\"full_slug\";s:9:\"kesehatan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:3;a:13:{s:2:\"id\";i:1;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Makanan\";s:4:\"slug\";s:7:\"makanan\";s:9:\"full_slug\";s:7:\"makanan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:4;a:13:{s:2:\"id\";i:34;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Pakaian Pria\";s:4:\"slug\";s:12:\"pakaian-pria\";s:9:\"full_slug\";s:12:\"pakaian-pria\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:5;a:13:{s:2:\"id\";i:14;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Rumah\";s:4:\"slug\";s:5:\"rumah\";s:9:\"full_slug\";s:5:\"rumah\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:6;a:13:{s:2:\"id\";i:76;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kecantikan\";s:4:\"slug\";s:10:\"kecantikan\";s:9:\"full_slug\";s:10:\"kecantikan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:7;a:13:{s:2:\"id\";i:65;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Kerajinan\";s:4:\"slug\";s:9:\"kerajinan\";s:9:\"full_slug\";s:9:\"kerajinan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:8;a:13:{s:2:\"id\";i:41;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Pakaian Wanita\";s:4:\"slug\";s:14:\"pakaian-wanita\";s:9:\"full_slug\";s:14:\"pakaian-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:9;a:13:{s:2:\"id\";i:48;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Batik & Kain\";s:4:\"slug\";s:10:\"batik-kain\";s:9:\"full_slug\";s:10:\"batik-kain\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:10;a:13:{s:2:\"id\";i:42;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:41;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Atasan Wanita\";s:4:\"slug\";s:13:\"atasan-wanita\";s:9:\"full_slug\";s:28:\"pakaian-wanita/atasan-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:11;a:13:{s:2:\"id\";i:24;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:23;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Audio\";s:4:\"slug\";s:5:\"audio\";s:9:\"full_slug\";s:16:\"elektronik/audio\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:12;a:13:{s:2:\"id\";i:49;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:48;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Batik\";s:4:\"slug\";s:5:\"batik\";s:9:\"full_slug\";s:16:\"batik-kain/batik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:13;a:13:{s:2:\"id\";i:15;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:14;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kebersihan\";s:4:\"slug\";s:10:\"kebersihan\";s:9:\"full_slug\";s:16:\"rumah/kebersihan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:14;a:13:{s:2:\"id\";i:35;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:34;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Kemeja Pria\";s:4:\"slug\";s:11:\"kemeja-pria\";s:9:\"full_slug\";s:24:\"pakaian-pria/kemeja-pria\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:15;a:13:{s:2:\"id\";i:2;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:1;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Makanan Ringan\";s:4:\"slug\";s:14:\"makanan-ringan\";s:9:\"full_slug\";s:22:\"makanan/makanan-ringan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:16;a:13:{s:2:\"id\";i:57;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:56;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Menulis\";s:4:\"slug\";s:7:\"menulis\";s:9:\"full_slug\";s:18:\"alat-tulis/menulis\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:17;a:13:{s:2:\"id\";i:77;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:76;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Perawatan Kulit\";s:4:\"slug\";s:15:\"perawatan-kulit\";s:9:\"full_slug\";s:26:\"kecantikan/perawatan-kulit\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:18;a:13:{s:2:\"id\";i:73;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:72;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Perawatan Tubuh\";s:4:\"slug\";s:15:\"perawatan-tubuh\";s:9:\"full_slug\";s:25:\"kesehatan/perawatan-tubuh\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:19;a:13:{s:2:\"id\";i:66;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:65;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Stiker & Tape\";s:4:\"slug\";s:11:\"stiker-tape\";s:9:\"full_slug\";s:21:\"kerajinan/stiker-tape\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:20;a:13:{s:2:\"id\";i:27;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:23;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Aksesori Gadget\";s:4:\"slug\";s:15:\"aksesori-gadget\";s:9:\"full_slug\";s:26:\"elektronik/aksesori-gadget\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:21;a:13:{s:2:\"id\";i:69;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:65;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Bahan Kerajinan\";s:4:\"slug\";s:15:\"bahan-kerajinan\";s:9:\"full_slug\";s:25:\"kerajinan/bahan-kerajinan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:22;a:13:{s:2:\"id\";i:45;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:41;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Bawahan Wanita\";s:4:\"slug\";s:14:\"bawahan-wanita\";s:9:\"full_slug\";s:29:\"pakaian-wanita/bawahan-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:23;a:13:{s:2:\"id\";i:19;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:14;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:8:\"Dekorasi\";s:4:\"slug\";s:8:\"dekorasi\";s:9:\"full_slug\";s:14:\"rumah/dekorasi\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:24;a:13:{s:2:\"id\";i:53;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:48;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:16:\"Kain Tradisional\";s:4:\"slug\";s:16:\"kain-tradisional\";s:9:\"full_slug\";s:27:\"batik-kain/kain-tradisional\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:25;a:13:{s:2:\"id\";i:38;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:34;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Kaos Pria\";s:4:\"slug\";s:9:\"kaos-pria\";s:9:\"full_slug\";s:22:\"pakaian-pria/kaos-pria\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:26;a:13:{s:2:\"id\";i:61;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:56;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Kertas & Buku\";s:4:\"slug\";s:11:\"kertas-buku\";s:9:\"full_slug\";s:22:\"alat-tulis/kertas-buku\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:27;a:13:{s:2:\"id\";i:6;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:1;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:17:\"Makanan Siap Saji\";s:4:\"slug\";s:17:\"makanan-siap-saji\";s:9:\"full_slug\";s:25:\"makanan/makanan-siap-saji\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:28;a:13:{s:2:\"id\";i:80;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:76;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:16:\"Perawatan Rambut\";s:4:\"slug\";s:16:\"perawatan-rambut\";s:9:\"full_slug\";s:27:\"kecantikan/perawatan-rambut\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:29;a:13:{s:2:\"id\";i:10;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:1;s:5:\"level\";i:2;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Minuman\";s:4:\"slug\";s:7:\"minuman\";s:9:\"full_slug\";s:15:\"makanan/minuman\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:30;a:13:{s:2:\"id\";i:31;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:23;s:5:\"level\";i:2;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Perangkat Lain\";s:4:\"slug\";s:14:\"perangkat-lain\";s:9:\"full_slug\";s:25:\"elektronik/perangkat-lain\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:31;a:13:{s:2:\"id\";i:7;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:6;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Bakso\";s:4:\"slug\";s:5:\"bakso\";s:9:\"full_slug\";s:31:\"makanan/makanan-siap-saji/bakso\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:32;a:13:{s:2:\"id\";i:50;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:49;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Batik Tulis\";s:4:\"slug\";s:11:\"batik-tulis\";s:9:\"full_slug\";s:28:\"batik-kain/batik/batik-tulis\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:33;a:13:{s:2:\"id\";i:43;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:42;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Blouse & Kemeja\";s:4:\"slug\";s:6:\"blouse\";s:9:\"full_slug\";s:35:\"pakaian-wanita/atasan-wanita/blouse\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:34;a:13:{s:2:\"id\";i:62;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:61;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Buku Catatan\";s:4:\"slug\";s:12:\"buku-catatan\";s:9:\"full_slug\";s:35:\"alat-tulis/kertas-buku/buku-catatan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:35;a:13:{s:2:\"id\";i:28;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:27;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Charger & Kabel\";s:4:\"slug\";s:13:\"charger-kabel\";s:9:\"full_slug\";s:40:\"elektronik/aksesori-gadget/charger-kabel\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:36;a:13:{s:2:\"id\";i:54;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:53;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kain Tenun\";s:4:\"slug\";s:10:\"kain-tenun\";s:9:\"full_slug\";s:38:\"batik-kain/kain-tradisional/kain-tenun\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:37;a:13:{s:2:\"id\";i:39;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:38;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kaos Polos\";s:4:\"slug\";s:10:\"kaos-polos\";s:9:\"full_slug\";s:33:\"pakaian-pria/kaos-pria/kaos-polos\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:38;a:13:{s:2:\"id\";i:36;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:35;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Kemeja Batik\";s:4:\"slug\";s:12:\"kemeja-batik\";s:9:\"full_slug\";s:37:\"pakaian-pria/kemeja-pria/kemeja-batik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:39;a:13:{s:2:\"id\";i:3;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:2;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Keripik & Snack\";s:4:\"slug\";s:7:\"keripik\";s:9:\"full_slug\";s:30:\"makanan/makanan-ringan/keripik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:40;a:13:{s:2:\"id\";i:70;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:69;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:29:\"Kertas Kerajinan (Papercraft)\";s:4:\"slug\";s:10:\"papercraft\";s:9:\"full_slug\";s:36:\"kerajinan/bahan-kerajinan/papercraft\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:41;a:13:{s:2:\"id\";i:11;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:10;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:4:\"Kopi\";s:4:\"slug\";s:4:\"kopi\";s:9:\"full_slug\";s:20:\"makanan/minuman/kopi\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:5;}i:42;a:13:{s:2:\"id\";i:32;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:31;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Lampu LED\";s:4:\"slug\";s:9:\"lampu-led\";s:9:\"full_slug\";s:35:\"elektronik/perangkat-lain/lampu-led\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:43;a:13:{s:2:\"id\";i:20;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:19;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:17:\"Lilin & Pengharum\";s:4:\"slug\";s:11:\"lilin-aroma\";s:9:\"full_slug\";s:26:\"rumah/dekorasi/lilin-aroma\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:44;a:13:{s:2:\"id\";i:16;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:15;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Pel & Lap\";s:4:\"slug\";s:7:\"pel-lap\";s:9:\"full_slug\";s:24:\"rumah/kebersihan/pel-lap\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:45;a:13:{s:2:\"id\";i:58;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:57;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:6:\"Pulpen\";s:4:\"slug\";s:6:\"pulpen\";s:9:\"full_slug\";s:25:\"alat-tulis/menulis/pulpen\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:46;a:13:{s:2:\"id\";i:46;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:45;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:3:\"Rok\";s:4:\"slug\";s:3:\"rok\";s:9:\"full_slug\";s:33:\"pakaian-wanita/bawahan-wanita/rok\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:47;a:13:{s:2:\"id\";i:74;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:73;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:17:\"Sabun & Body Care\";s:4:\"slug\";s:15:\"sabun-body-care\";s:9:\"full_slug\";s:41:\"kesehatan/perawatan-tubuh/sabun-body-care\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:48;a:13:{s:2:\"id\";i:78;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:77;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:16:\"Serum & Skincare\";s:4:\"slug\";s:14:\"serum-skincare\";s:9:\"full_slug\";s:41:\"kecantikan/perawatan-kulit/serum-skincare\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:49;a:13:{s:2:\"id\";i:81;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:80;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Shampoo\";s:4:\"slug\";s:7:\"shampoo\";s:9:\"full_slug\";s:35:\"kecantikan/perawatan-rambut/shampoo\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:50;a:13:{s:2:\"id\";i:25;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:24;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Speaker\";s:4:\"slug\";s:7:\"speaker\";s:9:\"full_slug\";s:24:\"elektronik/audio/speaker\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:51;a:13:{s:2:\"id\";i:67;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:66;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:6:\"Stiker\";s:4:\"slug\";s:6:\"stiker\";s:9:\"full_slug\";s:28:\"kerajinan/stiker-tape/stiker\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:52;a:13:{s:2:\"id\";i:33;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:31;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:19:\"Adaptor & Converter\";s:4:\"slug\";s:7:\"adaptor\";s:9:\"full_slug\";s:33:\"elektronik/perangkat-lain/adaptor\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:53;a:13:{s:2:\"id\";i:51;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:49;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Batik Cap\";s:4:\"slug\";s:9:\"batik-cap\";s:9:\"full_slug\";s:26:\"batik-kain/batik/batik-cap\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:54;a:13:{s:2:\"id\";i:47;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:45;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Celana Wanita\";s:4:\"slug\";s:13:\"celana-wanita\";s:9:\"full_slug\";s:43:\"pakaian-wanita/bawahan-wanita/celana-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:55;a:13:{s:2:\"id\";i:26;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:24;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:20:\"Headphone & Earphone\";s:4:\"slug\";s:9:\"headphone\";s:9:\"full_slug\";s:26:\"elektronik/audio/headphone\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:56;a:13:{s:2:\"id\";i:55;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:53;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kain Lurik\";s:4:\"slug\";s:10:\"kain-lurik\";s:9:\"full_slug\";s:38:\"batik-kain/kain-tradisional/kain-lurik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:57;a:13:{s:2:\"id\";i:40;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:38;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kaos Batik\";s:4:\"slug\";s:10:\"kaos-batik\";s:9:\"full_slug\";s:33:\"pakaian-pria/kaos-pria/kaos-batik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:58;a:13:{s:2:\"id\";i:44;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:42;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:21:\"Kebaya & Bahan Wanita\";s:4:\"slug\";s:6:\"kebaya\";s:9:\"full_slug\";s:35:\"pakaian-wanita/atasan-wanita/kebaya\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:59;a:13:{s:2:\"id\";i:37;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:35;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Kemeja Formal\";s:4:\"slug\";s:13:\"kemeja-formal\";s:9:\"full_slug\";s:38:\"pakaian-pria/kemeja-pria/kemeja-formal\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:60;a:13:{s:2:\"id\";i:63;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:61;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kertas HVS\";s:4:\"slug\";s:10:\"kertas-hvs\";s:9:\"full_slug\";s:33:\"alat-tulis/kertas-buku/kertas-hvs\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:61;a:13:{s:2:\"id\";i:4;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:2;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kue Kering\";s:4:\"slug\";s:10:\"kue-kering\";s:9:\"full_slug\";s:33:\"makanan/makanan-ringan/kue-kering\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:3;}i:62;a:13:{s:2:\"id\";i:82;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:80;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Minyak Rambut\";s:4:\"slug\";s:13:\"minyak-rambut\";s:9:\"full_slug\";s:41:\"kecantikan/perawatan-rambut/minyak-rambut\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:63;a:13:{s:2:\"id\";i:59;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:57;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:21:\"Pensil & Pensil Warna\";s:4:\"slug\";s:6:\"pensil\";s:9:\"full_slug\";s:25:\"alat-tulis/menulis/pensil\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:64;a:13:{s:2:\"id\";i:71;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:69;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Pita & Manik\";s:4:\"slug\";s:10:\"pita-manik\";s:9:\"full_slug\";s:36:\"kerajinan/bahan-kerajinan/pita-manik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:65;a:13:{s:2:\"id\";i:29;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:27;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Powerbank\";s:4:\"slug\";s:9:\"powerbank\";s:9:\"full_slug\";s:36:\"elektronik/aksesori-gadget/powerbank\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:66;a:13:{s:2:\"id\";i:17;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:15;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Sapu & Sikat\";s:4:\"slug\";s:9:\"sapu-siku\";s:9:\"full_slug\";s:26:\"rumah/kebersihan/sapu-siku\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:67;a:13:{s:2:\"id\";i:8;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:6;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:4:\"Sate\";s:4:\"slug\";s:4:\"sate\";s:9:\"full_slug\";s:30:\"makanan/makanan-siap-saji/sate\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:68;a:13:{s:2:\"id\";i:79;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:77;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Sunscreen\";s:4:\"slug\";s:9:\"sunscreen\";s:9:\"full_slug\";s:36:\"kecantikan/perawatan-kulit/sunscreen\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:69;a:13:{s:2:\"id\";i:75;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:73;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:18:\"Suplemen & Vitamin\";s:4:\"slug\";s:8:\"suplemen\";s:9:\"full_slug\";s:34:\"kesehatan/perawatan-tubuh/suplemen\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:70;a:13:{s:2:\"id\";i:12;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:10;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:3:\"Teh\";s:4:\"slug\";s:3:\"teh\";s:9:\"full_slug\";s:19:\"makanan/minuman/teh\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:71;a:13:{s:2:\"id\";i:21;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:19;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Vas & Pot\";s:4:\"slug\";s:7:\"vas-pot\";s:9:\"full_slug\";s:22:\"rumah/dekorasi/vas-pot\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:72;a:13:{s:2:\"id\";i:68;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:66;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Washi Tape\";s:4:\"slug\";s:10:\"washi-tape\";s:9:\"full_slug\";s:32:\"kerajinan/stiker-tape/washi-tape\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:73;a:13:{s:2:\"id\";i:9;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:6;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Ayam Goreng\";s:4:\"slug\";s:11:\"ayam-goreng\";s:9:\"full_slug\";s:37:\"makanan/makanan-siap-saji/ayam-goreng\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:74;a:13:{s:2:\"id\";i:52;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:49;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Batik Printing\";s:4:\"slug\";s:14:\"batik-printing\";s:9:\"full_slug\";s:31:\"batik-kain/batik/batik-printing\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:75;a:13:{s:2:\"id\";i:30;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:27;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:18:\"Casing & Pelindung\";s:4:\"slug\";s:16:\"casing-pelindung\";s:9:\"full_slug\";s:43:\"elektronik/aksesori-gadget/casing-pelindung\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:76;a:13:{s:2:\"id\";i:5;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:2;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:16:\"Cokelat & Permen\";s:4:\"slug\";s:7:\"cokelat\";s:9:\"full_slug\";s:30:\"makanan/makanan-ringan/cokelat\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:77;a:13:{s:2:\"id\";i:22;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:19;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Jam Dinding\";s:4:\"slug\";s:11:\"jam-dinding\";s:9:\"full_slug\";s:26:\"rumah/dekorasi/jam-dinding\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:78;a:13:{s:2:\"id\";i:64;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:61;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Kertas Kado\";s:4:\"slug\";s:11:\"kertas-kado\";s:9:\"full_slug\";s:34:\"alat-tulis/kertas-buku/kertas-kado\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:79;a:13:{s:2:\"id\";i:13;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:10;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Sirup & Jus\";s:4:\"slug\";s:9:\"sirup-jus\";s:9:\"full_slug\";s:25:\"makanan/minuman/sirup-jus\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:80;a:13:{s:2:\"id\";i:60;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:57;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:20:\"Spidol & Highlighter\";s:4:\"slug\";s:6:\"spidol\";s:9:\"full_slug\";s:25:\"alat-tulis/menulis/spidol\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:81;a:13:{s:2:\"id\";i:18;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:15;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Tempat Sampah\";s:4:\"slug\";s:13:\"tempat-sampah\";s:9:\"full_slug\";s:30:\"rumah/kebersihan/tempat-sampah\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}}', 1790830367);
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('marketapi-cache-catalog_categories_tree_rows_manage_v3', 'a:82:{i:0;a:13:{s:2:\"id\";i:56;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Alat Tulis\";s:4:\"slug\";s:10:\"alat-tulis\";s:9:\"full_slug\";s:10:\"alat-tulis\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:1;a:13:{s:2:\"id\";i:23;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Elektronik\";s:4:\"slug\";s:10:\"elektronik\";s:9:\"full_slug\";s:10:\"elektronik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:2;a:13:{s:2:\"id\";i:72;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Kesehatan\";s:4:\"slug\";s:9:\"kesehatan\";s:9:\"full_slug\";s:9:\"kesehatan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:3;a:13:{s:2:\"id\";i:1;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Makanan\";s:4:\"slug\";s:7:\"makanan\";s:9:\"full_slug\";s:7:\"makanan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:4;a:13:{s:2:\"id\";i:34;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Pakaian Pria\";s:4:\"slug\";s:12:\"pakaian-pria\";s:9:\"full_slug\";s:12:\"pakaian-pria\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:5;a:13:{s:2:\"id\";i:14;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Rumah\";s:4:\"slug\";s:5:\"rumah\";s:9:\"full_slug\";s:5:\"rumah\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:6;a:13:{s:2:\"id\";i:76;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kecantikan\";s:4:\"slug\";s:10:\"kecantikan\";s:9:\"full_slug\";s:10:\"kecantikan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:7;a:13:{s:2:\"id\";i:65;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Kerajinan\";s:4:\"slug\";s:9:\"kerajinan\";s:9:\"full_slug\";s:9:\"kerajinan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:8;a:13:{s:2:\"id\";i:41;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Pakaian Wanita\";s:4:\"slug\";s:14:\"pakaian-wanita\";s:9:\"full_slug\";s:14:\"pakaian-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:9;a:13:{s:2:\"id\";i:48;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Batik & Kain\";s:4:\"slug\";s:10:\"batik-kain\";s:9:\"full_slug\";s:10:\"batik-kain\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:10;a:13:{s:2:\"id\";i:42;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:41;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Atasan Wanita\";s:4:\"slug\";s:13:\"atasan-wanita\";s:9:\"full_slug\";s:28:\"pakaian-wanita/atasan-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:11;a:13:{s:2:\"id\";i:24;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:23;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Audio\";s:4:\"slug\";s:5:\"audio\";s:9:\"full_slug\";s:16:\"elektronik/audio\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:12;a:13:{s:2:\"id\";i:49;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:48;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Batik\";s:4:\"slug\";s:5:\"batik\";s:9:\"full_slug\";s:16:\"batik-kain/batik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:13;a:13:{s:2:\"id\";i:15;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:14;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kebersihan\";s:4:\"slug\";s:10:\"kebersihan\";s:9:\"full_slug\";s:16:\"rumah/kebersihan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:14;a:13:{s:2:\"id\";i:35;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:34;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Kemeja Pria\";s:4:\"slug\";s:11:\"kemeja-pria\";s:9:\"full_slug\";s:24:\"pakaian-pria/kemeja-pria\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:15;a:13:{s:2:\"id\";i:2;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:1;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Makanan Ringan\";s:4:\"slug\";s:14:\"makanan-ringan\";s:9:\"full_slug\";s:22:\"makanan/makanan-ringan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:16;a:13:{s:2:\"id\";i:57;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:56;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Menulis\";s:4:\"slug\";s:7:\"menulis\";s:9:\"full_slug\";s:18:\"alat-tulis/menulis\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:17;a:13:{s:2:\"id\";i:77;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:76;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Perawatan Kulit\";s:4:\"slug\";s:15:\"perawatan-kulit\";s:9:\"full_slug\";s:26:\"kecantikan/perawatan-kulit\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:18;a:13:{s:2:\"id\";i:73;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:72;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Perawatan Tubuh\";s:4:\"slug\";s:15:\"perawatan-tubuh\";s:9:\"full_slug\";s:25:\"kesehatan/perawatan-tubuh\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:19;a:13:{s:2:\"id\";i:66;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:65;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Stiker & Tape\";s:4:\"slug\";s:11:\"stiker-tape\";s:9:\"full_slug\";s:21:\"kerajinan/stiker-tape\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:20;a:13:{s:2:\"id\";i:27;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:23;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Aksesori Gadget\";s:4:\"slug\";s:15:\"aksesori-gadget\";s:9:\"full_slug\";s:26:\"elektronik/aksesori-gadget\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:21;a:13:{s:2:\"id\";i:69;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:65;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Bahan Kerajinan\";s:4:\"slug\";s:15:\"bahan-kerajinan\";s:9:\"full_slug\";s:25:\"kerajinan/bahan-kerajinan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:22;a:13:{s:2:\"id\";i:45;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:41;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Bawahan Wanita\";s:4:\"slug\";s:14:\"bawahan-wanita\";s:9:\"full_slug\";s:29:\"pakaian-wanita/bawahan-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:23;a:13:{s:2:\"id\";i:19;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:14;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:8:\"Dekorasi\";s:4:\"slug\";s:8:\"dekorasi\";s:9:\"full_slug\";s:14:\"rumah/dekorasi\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:24;a:13:{s:2:\"id\";i:53;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:48;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:16:\"Kain Tradisional\";s:4:\"slug\";s:16:\"kain-tradisional\";s:9:\"full_slug\";s:27:\"batik-kain/kain-tradisional\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:25;a:13:{s:2:\"id\";i:38;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:34;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Kaos Pria\";s:4:\"slug\";s:9:\"kaos-pria\";s:9:\"full_slug\";s:22:\"pakaian-pria/kaos-pria\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:26;a:13:{s:2:\"id\";i:61;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:56;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Kertas & Buku\";s:4:\"slug\";s:11:\"kertas-buku\";s:9:\"full_slug\";s:22:\"alat-tulis/kertas-buku\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:27;a:13:{s:2:\"id\";i:6;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:1;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:17:\"Makanan Siap Saji\";s:4:\"slug\";s:17:\"makanan-siap-saji\";s:9:\"full_slug\";s:25:\"makanan/makanan-siap-saji\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:28;a:13:{s:2:\"id\";i:80;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:76;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:16:\"Perawatan Rambut\";s:4:\"slug\";s:16:\"perawatan-rambut\";s:9:\"full_slug\";s:27:\"kecantikan/perawatan-rambut\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:29;a:13:{s:2:\"id\";i:10;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:1;s:5:\"level\";i:2;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Minuman\";s:4:\"slug\";s:7:\"minuman\";s:9:\"full_slug\";s:15:\"makanan/minuman\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:30;a:13:{s:2:\"id\";i:31;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:23;s:5:\"level\";i:2;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Perangkat Lain\";s:4:\"slug\";s:14:\"perangkat-lain\";s:9:\"full_slug\";s:25:\"elektronik/perangkat-lain\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:31;a:13:{s:2:\"id\";i:7;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:6;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Bakso\";s:4:\"slug\";s:5:\"bakso\";s:9:\"full_slug\";s:31:\"makanan/makanan-siap-saji/bakso\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:32;a:13:{s:2:\"id\";i:50;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:49;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Batik Tulis\";s:4:\"slug\";s:11:\"batik-tulis\";s:9:\"full_slug\";s:28:\"batik-kain/batik/batik-tulis\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:33;a:13:{s:2:\"id\";i:43;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:42;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Blouse & Kemeja\";s:4:\"slug\";s:6:\"blouse\";s:9:\"full_slug\";s:35:\"pakaian-wanita/atasan-wanita/blouse\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:34;a:13:{s:2:\"id\";i:62;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:61;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Buku Catatan\";s:4:\"slug\";s:12:\"buku-catatan\";s:9:\"full_slug\";s:35:\"alat-tulis/kertas-buku/buku-catatan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:35;a:13:{s:2:\"id\";i:28;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:27;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Charger & Kabel\";s:4:\"slug\";s:13:\"charger-kabel\";s:9:\"full_slug\";s:40:\"elektronik/aksesori-gadget/charger-kabel\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:36;a:13:{s:2:\"id\";i:54;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:53;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kain Tenun\";s:4:\"slug\";s:10:\"kain-tenun\";s:9:\"full_slug\";s:38:\"batik-kain/kain-tradisional/kain-tenun\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:37;a:13:{s:2:\"id\";i:39;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:38;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kaos Polos\";s:4:\"slug\";s:10:\"kaos-polos\";s:9:\"full_slug\";s:33:\"pakaian-pria/kaos-pria/kaos-polos\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:38;a:13:{s:2:\"id\";i:36;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:35;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Kemeja Batik\";s:4:\"slug\";s:12:\"kemeja-batik\";s:9:\"full_slug\";s:37:\"pakaian-pria/kemeja-pria/kemeja-batik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:39;a:13:{s:2:\"id\";i:3;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:2;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:15:\"Keripik & Snack\";s:4:\"slug\";s:7:\"keripik\";s:9:\"full_slug\";s:30:\"makanan/makanan-ringan/keripik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:40;a:13:{s:2:\"id\";i:70;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:69;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:29:\"Kertas Kerajinan (Papercraft)\";s:4:\"slug\";s:10:\"papercraft\";s:9:\"full_slug\";s:36:\"kerajinan/bahan-kerajinan/papercraft\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:41;a:13:{s:2:\"id\";i:11;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:10;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:4:\"Kopi\";s:4:\"slug\";s:4:\"kopi\";s:9:\"full_slug\";s:20:\"makanan/minuman/kopi\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:5;}i:42;a:13:{s:2:\"id\";i:32;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:31;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Lampu LED\";s:4:\"slug\";s:9:\"lampu-led\";s:9:\"full_slug\";s:35:\"elektronik/perangkat-lain/lampu-led\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:43;a:13:{s:2:\"id\";i:20;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:19;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:17:\"Lilin & Pengharum\";s:4:\"slug\";s:11:\"lilin-aroma\";s:9:\"full_slug\";s:26:\"rumah/dekorasi/lilin-aroma\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:44;a:13:{s:2:\"id\";i:16;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:15;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Pel & Lap\";s:4:\"slug\";s:7:\"pel-lap\";s:9:\"full_slug\";s:24:\"rumah/kebersihan/pel-lap\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:45;a:13:{s:2:\"id\";i:58;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:57;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:6:\"Pulpen\";s:4:\"slug\";s:6:\"pulpen\";s:9:\"full_slug\";s:25:\"alat-tulis/menulis/pulpen\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:46;a:13:{s:2:\"id\";i:46;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:45;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:3:\"Rok\";s:4:\"slug\";s:3:\"rok\";s:9:\"full_slug\";s:33:\"pakaian-wanita/bawahan-wanita/rok\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:47;a:13:{s:2:\"id\";i:74;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:73;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:17:\"Sabun & Body Care\";s:4:\"slug\";s:15:\"sabun-body-care\";s:9:\"full_slug\";s:41:\"kesehatan/perawatan-tubuh/sabun-body-care\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:48;a:13:{s:2:\"id\";i:78;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:77;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:16:\"Serum & Skincare\";s:4:\"slug\";s:14:\"serum-skincare\";s:9:\"full_slug\";s:41:\"kecantikan/perawatan-kulit/serum-skincare\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:49;a:13:{s:2:\"id\";i:81;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:80;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Shampoo\";s:4:\"slug\";s:7:\"shampoo\";s:9:\"full_slug\";s:35:\"kecantikan/perawatan-rambut/shampoo\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:50;a:13:{s:2:\"id\";i:25;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:24;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Speaker\";s:4:\"slug\";s:7:\"speaker\";s:9:\"full_slug\";s:24:\"elektronik/audio/speaker\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:51;a:13:{s:2:\"id\";i:67;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:66;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:6:\"Stiker\";s:4:\"slug\";s:6:\"stiker\";s:9:\"full_slug\";s:28:\"kerajinan/stiker-tape/stiker\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:52;a:13:{s:2:\"id\";i:33;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:31;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:19:\"Adaptor & Converter\";s:4:\"slug\";s:7:\"adaptor\";s:9:\"full_slug\";s:33:\"elektronik/perangkat-lain/adaptor\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:53;a:13:{s:2:\"id\";i:51;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:49;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Batik Cap\";s:4:\"slug\";s:9:\"batik-cap\";s:9:\"full_slug\";s:26:\"batik-kain/batik/batik-cap\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:54;a:13:{s:2:\"id\";i:47;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:45;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Celana Wanita\";s:4:\"slug\";s:13:\"celana-wanita\";s:9:\"full_slug\";s:43:\"pakaian-wanita/bawahan-wanita/celana-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:55;a:13:{s:2:\"id\";i:26;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:24;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:20:\"Headphone & Earphone\";s:4:\"slug\";s:9:\"headphone\";s:9:\"full_slug\";s:26:\"elektronik/audio/headphone\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:56;a:13:{s:2:\"id\";i:55;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:53;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kain Lurik\";s:4:\"slug\";s:10:\"kain-lurik\";s:9:\"full_slug\";s:38:\"batik-kain/kain-tradisional/kain-lurik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:57;a:13:{s:2:\"id\";i:40;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:38;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kaos Batik\";s:4:\"slug\";s:10:\"kaos-batik\";s:9:\"full_slug\";s:33:\"pakaian-pria/kaos-pria/kaos-batik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:58;a:13:{s:2:\"id\";i:44;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:42;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:21:\"Kebaya & Bahan Wanita\";s:4:\"slug\";s:6:\"kebaya\";s:9:\"full_slug\";s:35:\"pakaian-wanita/atasan-wanita/kebaya\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:59;a:13:{s:2:\"id\";i:37;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:35;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Kemeja Formal\";s:4:\"slug\";s:13:\"kemeja-formal\";s:9:\"full_slug\";s:38:\"pakaian-pria/kemeja-pria/kemeja-formal\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:60;a:13:{s:2:\"id\";i:63;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:61;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kertas HVS\";s:4:\"slug\";s:10:\"kertas-hvs\";s:9:\"full_slug\";s:33:\"alat-tulis/kertas-buku/kertas-hvs\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:61;a:13:{s:2:\"id\";i:4;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:2;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Kue Kering\";s:4:\"slug\";s:10:\"kue-kering\";s:9:\"full_slug\";s:33:\"makanan/makanan-ringan/kue-kering\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:3;}i:62;a:13:{s:2:\"id\";i:82;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:80;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Minyak Rambut\";s:4:\"slug\";s:13:\"minyak-rambut\";s:9:\"full_slug\";s:41:\"kecantikan/perawatan-rambut/minyak-rambut\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:63;a:13:{s:2:\"id\";i:59;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:57;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:21:\"Pensil & Pensil Warna\";s:4:\"slug\";s:6:\"pensil\";s:9:\"full_slug\";s:25:\"alat-tulis/menulis/pensil\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:64;a:13:{s:2:\"id\";i:71;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:69;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Pita & Manik\";s:4:\"slug\";s:10:\"pita-manik\";s:9:\"full_slug\";s:36:\"kerajinan/bahan-kerajinan/pita-manik\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:65;a:13:{s:2:\"id\";i:29;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:27;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Powerbank\";s:4:\"slug\";s:9:\"powerbank\";s:9:\"full_slug\";s:36:\"elektronik/aksesori-gadget/powerbank\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:66;a:13:{s:2:\"id\";i:17;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:15;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Sapu & Sikat\";s:4:\"slug\";s:9:\"sapu-siku\";s:9:\"full_slug\";s:26:\"rumah/kebersihan/sapu-siku\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:67;a:13:{s:2:\"id\";i:8;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:6;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:4:\"Sate\";s:4:\"slug\";s:4:\"sate\";s:9:\"full_slug\";s:30:\"makanan/makanan-siap-saji/sate\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:68;a:13:{s:2:\"id\";i:79;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:77;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Sunscreen\";s:4:\"slug\";s:9:\"sunscreen\";s:9:\"full_slug\";s:36:\"kecantikan/perawatan-kulit/sunscreen\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:69;a:13:{s:2:\"id\";i:75;s:16:\"catalog_group_id\";i:6;s:9:\"parent_id\";i:73;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:18:\"Suplemen & Vitamin\";s:4:\"slug\";s:8:\"suplemen\";s:9:\"full_slug\";s:34:\"kesehatan/perawatan-tubuh/suplemen\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:70;a:13:{s:2:\"id\";i:12;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:10;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:3:\"Teh\";s:4:\"slug\";s:3:\"teh\";s:9:\"full_slug\";s:19:\"makanan/minuman/teh\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:71;a:13:{s:2:\"id\";i:21;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:19;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Vas & Pot\";s:4:\"slug\";s:7:\"vas-pot\";s:9:\"full_slug\";s:22:\"rumah/dekorasi/vas-pot\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:72;a:13:{s:2:\"id\";i:68;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:66;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Washi Tape\";s:4:\"slug\";s:10:\"washi-tape\";s:9:\"full_slug\";s:32:\"kerajinan/stiker-tape/washi-tape\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:73;a:13:{s:2:\"id\";i:9;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:6;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Ayam Goreng\";s:4:\"slug\";s:11:\"ayam-goreng\";s:9:\"full_slug\";s:37:\"makanan/makanan-siap-saji/ayam-goreng\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:74;a:13:{s:2:\"id\";i:52;s:16:\"catalog_group_id\";i:4;s:9:\"parent_id\";i:49;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Batik Printing\";s:4:\"slug\";s:14:\"batik-printing\";s:9:\"full_slug\";s:31:\"batik-kain/batik/batik-printing\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:75;a:13:{s:2:\"id\";i:30;s:16:\"catalog_group_id\";i:3;s:9:\"parent_id\";i:27;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:18:\"Casing & Pelindung\";s:4:\"slug\";s:16:\"casing-pelindung\";s:9:\"full_slug\";s:43:\"elektronik/aksesori-gadget/casing-pelindung\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:76;a:13:{s:2:\"id\";i:5;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:2;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:16:\"Cokelat & Permen\";s:4:\"slug\";s:7:\"cokelat\";s:9:\"full_slug\";s:30:\"makanan/makanan-ringan/cokelat\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:77;a:13:{s:2:\"id\";i:22;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:19;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Jam Dinding\";s:4:\"slug\";s:11:\"jam-dinding\";s:9:\"full_slug\";s:26:\"rumah/dekorasi/jam-dinding\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:78;a:13:{s:2:\"id\";i:64;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:61;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Kertas Kado\";s:4:\"slug\";s:11:\"kertas-kado\";s:9:\"full_slug\";s:34:\"alat-tulis/kertas-buku/kertas-kado\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:1;}i:79;a:13:{s:2:\"id\";i:13;s:16:\"catalog_group_id\";i:1;s:9:\"parent_id\";i:10;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:11:\"Sirup & Jus\";s:4:\"slug\";s:9:\"sirup-jus\";s:9:\"full_slug\";s:25:\"makanan/minuman/sirup-jus\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:2;}i:80;a:13:{s:2:\"id\";i:60;s:16:\"catalog_group_id\";i:5;s:9:\"parent_id\";i:57;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:20:\"Spidol & Highlighter\";s:4:\"slug\";s:6:\"spidol\";s:9:\"full_slug\";s:25:\"alat-tulis/menulis/spidol\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:81;a:13:{s:2:\"id\";i:18;s:16:\"catalog_group_id\";i:2;s:9:\"parent_id\";i:15;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Tempat Sampah\";s:4:\"slug\";s:13:\"tempat-sampah\";s:9:\"full_slug\";s:30:\"rumah/kebersihan/tempat-sampah\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}}', 1789982228),
('marketapi-cache-fee_configs_active', 'a:22:{i:0;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:1;s:10:\"categoryId\";i:3;s:4:\"name\";s:21:\"Biaya layanan Keripik\";s:4:\"code\";s:11:\"fee-keripik\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:1;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:2;s:10:\"categoryId\";i:4;s:4:\"name\";s:24:\"Biaya layanan Kue kering\";s:4:\"code\";s:14:\"fee-kue-kering\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:2;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:3;s:10:\"categoryId\";i:7;s:4:\"name\";s:19:\"Biaya layanan Bakso\";s:4:\"code\";s:9:\"fee-bakso\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:3;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:4;s:10:\"categoryId\";i:8;s:4:\"name\";s:18:\"Biaya layanan Sate\";s:4:\"code\";s:8:\"fee-sate\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:4;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:5;s:10:\"categoryId\";i:9;s:4:\"name\";s:25:\"Biaya layanan Ayam goreng\";s:4:\"code\";s:15:\"fee-ayam-goreng\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:5;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:6;s:10:\"categoryId\";i:11;s:4:\"name\";s:18:\"Biaya layanan Kopi\";s:4:\"code\";s:8:\"fee-kopi\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:6;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:7;s:10:\"categoryId\";i:12;s:4:\"name\";s:17:\"Biaya layanan Teh\";s:4:\"code\";s:7:\"fee-teh\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:7;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:8;s:10:\"categoryId\";i:25;s:4:\"name\";s:21:\"Biaya layanan Speaker\";s:4:\"code\";s:11:\"fee-speaker\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:8;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:9;s:10:\"categoryId\";i:26;s:4:\"name\";s:23:\"Biaya layanan Headphone\";s:4:\"code\";s:13:\"fee-headphone\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:9;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:10;s:10:\"categoryId\";i:28;s:4:\"name\";s:27:\"Biaya layanan Charger kabel\";s:4:\"code\";s:17:\"fee-charger-kabel\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:10;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:11;s:10:\"categoryId\";i:29;s:4:\"name\";s:23:\"Biaya layanan Powerbank\";s:4:\"code\";s:13:\"fee-powerbank\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:11;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:12;s:10:\"categoryId\";i:36;s:4:\"name\";s:26:\"Biaya layanan Kemeja batik\";s:4:\"code\";s:16:\"fee-kemeja-batik\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:12;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:13;s:10:\"categoryId\";i:40;s:4:\"name\";s:24:\"Biaya layanan Kaos batik\";s:4:\"code\";s:14:\"fee-kaos-batik\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:13;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:14;s:10:\"categoryId\";i:43;s:4:\"name\";s:20:\"Biaya layanan Blouse\";s:4:\"code\";s:10:\"fee-blouse\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:14;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:15;s:10:\"categoryId\";i:50;s:4:\"name\";s:25:\"Biaya layanan Batik tulis\";s:4:\"code\";s:15:\"fee-batik-tulis\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:15;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:16;s:10:\"categoryId\";i:51;s:4:\"name\";s:23:\"Biaya layanan Batik cap\";s:4:\"code\";s:13:\"fee-batik-cap\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:16;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:17;s:10:\"categoryId\";i:58;s:4:\"name\";s:20:\"Biaya layanan Pulpen\";s:4:\"code\";s:10:\"fee-pulpen\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:17;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:18;s:10:\"categoryId\";i:59;s:4:\"name\";s:20:\"Biaya layanan Pensil\";s:4:\"code\";s:10:\"fee-pensil\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:18;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:19;s:10:\"categoryId\";i:62;s:4:\"name\";s:26:\"Biaya layanan Buku catatan\";s:4:\"code\";s:16:\"fee-buku-catatan\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:19;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:20;s:10:\"categoryId\";i:67;s:4:\"name\";s:20:\"Biaya layanan Stiker\";s:4:\"code\";s:10:\"fee-stiker\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:20;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:21;s:10:\"categoryId\";i:78;s:4:\"name\";s:28:\"Biaya layanan Serum skincare\";s:4:\"code\";s:18:\"fee-serum-skincare\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}i:21;O:61:\"App\\Domains\\Finance\\Commission\\Domain\\Entities\\AdminFeeConfig\":12:{s:2:\"id\";i:22;s:10:\"categoryId\";i:81;s:4:\"name\";s:21:\"Biaya layanan Shampoo\";s:4:\"code\";s:11:\"fee-shampoo\";s:10:\"percentage\";d:2.5;s:11:\"fixedAmount\";d:0;s:6:\"minFee\";d:500;s:6:\"maxFee\";d:25000;s:8:\"isActive\";b:1;s:11:\"description\";s:52:\"Biaya layanan platform untuk transaksi kategori ini.\";s:9:\"createdAt\";s:19:\"2026-09-14 07:59:44\";s:9:\"updatedAt\";s:19:\"2026-09-14 07:59:44\";}}', 1789982228),
('marketapi-cache-orders_cache_version', 'i:15;', 2105413275),
('marketapi-cache-orders:1:9c3bbb9ebcc94a096de4dac62982df9b.total', 'i:72;', 1789982332),
('marketapi-cache-orders:13:9c3bbb9ebcc94a096de4dac62982df9b.total', 'i:72;', 1790053417),
('marketapi-cache-orders:13:f511924d90e599cc81d2327449c20bf2.total', 'i:1;', 1790053153),
('marketapi-cache-orders:14:bb6bb6f7e960a1ce65fcf5a183e5fbfc.total', 'i:1;', 1790053432),
('marketapi-cache-orders:15:71bbfc76d8c24079e484aa39af9fca5b.total', 'i:0;', 1790140617),
('marketapi-cache-orders:15:94fe9512b72bd85540e01b0c84a40e3f.total', 'i:0;', 1792374432),
('marketapi-cache-orders:8:37a6b765481dc55a2ba23254be23b379.total', 'i:1;', 1790051261),
('marketapi-cache-orders:8:41a202de20b486f1f75a47ef991f7e7f.total', 'i:1;', 1790051261),
('marketapi-cache-orders:8:566a36f3d9ff79df56b4cefde4ec44d8.total', 'i:1;', 1790051261),
('marketapi-cache-orders:8:60ea14f40932d581b77301f18bcc2f37.total', 'i:1;', 1790051262),
('marketapi-cache-orders:8:7f6683743172c5f0ce5f0c421cc65cd3.total', 'i:1;', 1790051261),
('marketapi-cache-orders:8:af33eeb7d81aee4a846ab9c5ec85eb16.total', 'i:1;', 1790051261),
('marketapi-cache-ppob_price_product_1', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:1;s:11:\"operator_id\";i:1;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"PLSR5\";s:4:\"name\";s:13:\"Indosat 5.000\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:5:\"5.000\";s:14:\"provider_price\";d:5350;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:50;s:13:\"selling_price\";d:5600;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_10', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:10;s:11:\"operator_id\";i:2;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"TSEK10\";s:4:\"name\";s:16:\"Telkomsel 10.000\";s:5:\"brand\";s:9:\"Telkomsel\";s:7:\"nominal\";s:6:\"10.000\";s:14:\"provider_price\";d:10300;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:100;s:13:\"selling_price\";d:10600;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-telkomsel/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_11', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:11;s:11:\"operator_id\";i:2;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"TSEK20\";s:4:\"name\";s:16:\"Telkomsel 20.000\";s:5:\"brand\";s:9:\"Telkomsel\";s:7:\"nominal\";s:6:\"20.000\";s:14:\"provider_price\";d:20200;s:9:\"admin_fee\";d:300;s:10:\"commission\";d:0;s:6:\"margin\";d:200;s:13:\"selling_price\";d:20700;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-telkomsel/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_12', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:12;s:11:\"operator_id\";i:2;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"TSEK25\";s:4:\"name\";s:16:\"Telkomsel 25.000\";s:5:\"brand\";s:9:\"Telkomsel\";s:7:\"nominal\";s:6:\"25.000\";s:14:\"provider_price\";d:25200;s:9:\"admin_fee\";d:300;s:10:\"commission\";d:0;s:6:\"margin\";d:300;s:13:\"selling_price\";d:25800;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-telkomsel/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_13', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:13;s:11:\"operator_id\";i:2;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"TSEK50\";s:4:\"name\";s:16:\"Telkomsel 50.000\";s:5:\"brand\";s:9:\"Telkomsel\";s:7:\"nominal\";s:6:\"50.000\";s:14:\"provider_price\";d:50100;s:9:\"admin_fee\";d:400;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:51000;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-telkomsel/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_14', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:14;s:11:\"operator_id\";i:2;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:7:\"TSEK100\";s:4:\"name\";s:17:\"Telkomsel 100.000\";s:5:\"brand\";s:9:\"Telkomsel\";s:7:\"nominal\";s:7:\"100.000\";s:14:\"provider_price\";d:99100;s:9:\"admin_fee\";d:400;s:10:\"commission\";d:0;s:6:\"margin\";d:1000;s:13:\"selling_price\";d:100500;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-telkomsel/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_15', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:15;s:11:\"operator_id\";i:3;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:4:\"XLR5\";s:4:\"name\";s:8:\"XL 5.000\";s:5:\"brand\";s:2:\"XL\";s:7:\"nominal\";s:5:\"5.000\";s:14:\"provider_price\";d:5450;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:50;s:13:\"selling_price\";d:5700;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:42:\"https://picsum.photos/seed/ppob-xl/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_16', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:16;s:11:\"operator_id\";i:3;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"XLR10\";s:4:\"name\";s:9:\"XL 10.000\";s:5:\"brand\";s:2:\"XL\";s:7:\"nominal\";s:6:\"10.000\";s:14:\"provider_price\";d:10300;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:100;s:13:\"selling_price\";d:10600;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:42:\"https://picsum.photos/seed/ppob-xl/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_17', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:17;s:11:\"operator_id\";i:3;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"XLR15\";s:4:\"name\";s:9:\"XL 15.000\";s:5:\"brand\";s:2:\"XL\";s:7:\"nominal\";s:6:\"15.000\";s:14:\"provider_price\";d:15200;s:9:\"admin_fee\";d:300;s:10:\"commission\";d:0;s:6:\"margin\";d:200;s:13:\"selling_price\";d:15700;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:42:\"https://picsum.photos/seed/ppob-xl/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_18', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:18;s:11:\"operator_id\";i:3;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"XLR20\";s:4:\"name\";s:9:\"XL 20.000\";s:5:\"brand\";s:2:\"XL\";s:7:\"nominal\";s:6:\"20.000\";s:14:\"provider_price\";d:20200;s:9:\"admin_fee\";d:300;s:10:\"commission\";d:0;s:6:\"margin\";d:200;s:13:\"selling_price\";d:20700;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:42:\"https://picsum.photos/seed/ppob-xl/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206);
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('marketapi-cache-ppob_price_product_19', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:19;s:11:\"operator_id\";i:3;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"XLR50\";s:4:\"name\";s:9:\"XL 50.000\";s:5:\"brand\";s:2:\"XL\";s:7:\"nominal\";s:6:\"50.000\";s:14:\"provider_price\";d:50100;s:9:\"admin_fee\";d:400;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:51000;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:42:\"https://picsum.photos/seed/ppob-xl/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_2', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:2;s:11:\"operator_id\";i:1;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"PLSR10\";s:4:\"name\";s:14:\"Indosat 10.000\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:6:\"10.000\";s:14:\"provider_price\";d:10200;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:100;s:13:\"selling_price\";d:10500;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_20', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:20;s:11:\"operator_id\";i:3;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"XLR100\";s:4:\"name\";s:10:\"XL 100.000\";s:5:\"brand\";s:2:\"XL\";s:7:\"nominal\";s:7:\"100.000\";s:14:\"provider_price\";d:99000;s:9:\"admin_fee\";d:500;s:10:\"commission\";d:0;s:6:\"margin\";d:1000;s:13:\"selling_price\";d:100500;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:42:\"https://picsum.photos/seed/ppob-xl/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_21', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:21;s:11:\"operator_id\";i:4;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:4:\"TRI5\";s:4:\"name\";s:9:\"Tri 5.000\";s:5:\"brand\";s:3:\"Tri\";s:7:\"nominal\";s:5:\"5.000\";s:14:\"provider_price\";d:5400;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:50;s:13:\"selling_price\";d:5650;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:43:\"https://picsum.photos/seed/ppob-tri/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_22', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:22;s:11:\"operator_id\";i:4;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"TRI10\";s:4:\"name\";s:10:\"Tri 10.000\";s:5:\"brand\";s:3:\"Tri\";s:7:\"nominal\";s:6:\"10.000\";s:14:\"provider_price\";d:10150;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:100;s:13:\"selling_price\";d:10450;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:43:\"https://picsum.photos/seed/ppob-tri/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_23', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:23;s:11:\"operator_id\";i:4;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"TRI20\";s:4:\"name\";s:10:\"Tri 20.000\";s:5:\"brand\";s:3:\"Tri\";s:7:\"nominal\";s:6:\"20.000\";s:14:\"provider_price\";d:20100;s:9:\"admin_fee\";d:300;s:10:\"commission\";d:0;s:6:\"margin\";d:200;s:13:\"selling_price\";d:20600;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:43:\"https://picsum.photos/seed/ppob-tri/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_24', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:24;s:11:\"operator_id\";i:4;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"TRI50\";s:4:\"name\";s:10:\"Tri 50.000\";s:5:\"brand\";s:3:\"Tri\";s:7:\"nominal\";s:6:\"50.000\";s:14:\"provider_price\";d:49900;s:9:\"admin_fee\";d:400;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:50800;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:43:\"https://picsum.photos/seed/ppob-tri/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_25', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:25;s:11:\"operator_id\";i:5;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:3:\"AX5\";s:4:\"name\";s:10:\"Axis 5.000\";s:5:\"brand\";s:4:\"Axis\";s:7:\"nominal\";s:5:\"5.000\";s:14:\"provider_price\";d:5400;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:50;s:13:\"selling_price\";d:5650;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:44:\"https://picsum.photos/seed/ppob-axis/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_26', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:26;s:11:\"operator_id\";i:5;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:4:\"AX10\";s:4:\"name\";s:11:\"Axis 10.000\";s:5:\"brand\";s:4:\"Axis\";s:7:\"nominal\";s:6:\"10.000\";s:14:\"provider_price\";d:10100;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:100;s:13:\"selling_price\";d:10400;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:44:\"https://picsum.photos/seed/ppob-axis/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_27', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:27;s:11:\"operator_id\";i:5;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:4:\"AX20\";s:4:\"name\";s:11:\"Axis 20.000\";s:5:\"brand\";s:4:\"Axis\";s:7:\"nominal\";s:6:\"20.000\";s:14:\"provider_price\";d:20000;s:9:\"admin_fee\";d:300;s:10:\"commission\";d:0;s:6:\"margin\";d:200;s:13:\"selling_price\";d:20500;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:44:\"https://picsum.photos/seed/ppob-axis/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_28', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:28;s:11:\"operator_id\";i:5;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:4:\"AX50\";s:4:\"name\";s:11:\"Axis 50.000\";s:5:\"brand\";s:4:\"Axis\";s:7:\"nominal\";s:6:\"50.000\";s:14:\"provider_price\";d:49800;s:9:\"admin_fee\";d:400;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:50700;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:44:\"https://picsum.photos/seed/ppob-axis/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_29', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:29;s:11:\"operator_id\";i:6;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:4:\"SMR5\";s:4:\"name\";s:15:\"Smartfren 5.000\";s:5:\"brand\";s:9:\"Smartfren\";s:7:\"nominal\";s:5:\"5.000\";s:14:\"provider_price\";d:5450;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:50;s:13:\"selling_price\";d:5700;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-smartfren/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_3', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:3;s:11:\"operator_id\";i:1;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"PLSR12\";s:4:\"name\";s:14:\"Indosat 12.500\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:6:\"12.500\";s:14:\"provider_price\";d:12600;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:150;s:13:\"selling_price\";d:12950;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_30', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:30;s:11:\"operator_id\";i:6;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"SMR10\";s:4:\"name\";s:16:\"Smartfren 10.000\";s:5:\"brand\";s:9:\"Smartfren\";s:7:\"nominal\";s:6:\"10.000\";s:14:\"provider_price\";d:10200;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:100;s:13:\"selling_price\";d:10500;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-smartfren/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_31', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:31;s:11:\"operator_id\";i:6;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"SMR20\";s:4:\"name\";s:16:\"Smartfren 20.000\";s:5:\"brand\";s:9:\"Smartfren\";s:7:\"nominal\";s:6:\"20.000\";s:14:\"provider_price\";d:20100;s:9:\"admin_fee\";d:300;s:10:\"commission\";d:0;s:6:\"margin\";d:200;s:13:\"selling_price\";d:20600;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-smartfren/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_32', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:32;s:11:\"operator_id\";i:6;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"SMR50\";s:4:\"name\";s:16:\"Smartfren 50.000\";s:5:\"brand\";s:9:\"Smartfren\";s:7:\"nominal\";s:6:\"50.000\";s:14:\"provider_price\";d:50000;s:9:\"admin_fee\";d:400;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:50900;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-smartfren/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_33', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:33;s:11:\"operator_id\";i:7;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"BYU10\";s:4:\"name\";s:11:\"by.U 10.000\";s:5:\"brand\";s:4:\"by.U\";s:7:\"nominal\";s:6:\"10.000\";s:14:\"provider_price\";d:10200;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:100;s:13:\"selling_price\";d:10500;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:44:\"https://picsum.photos/seed/ppob-by.u/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_34', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:34;s:11:\"operator_id\";i:7;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"BYU25\";s:4:\"name\";s:11:\"by.U 25.000\";s:5:\"brand\";s:4:\"by.U\";s:7:\"nominal\";s:6:\"25.000\";s:14:\"provider_price\";d:25100;s:9:\"admin_fee\";d:300;s:10:\"commission\";d:0;s:6:\"margin\";d:300;s:13:\"selling_price\";d:25700;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:44:\"https://picsum.photos/seed/ppob-by.u/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_35', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:35;s:11:\"operator_id\";i:8;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"DF1GB\";s:4:\"name\";s:19:\"Indosat Freedom 1GB\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:4:\"1 GB\";s:14:\"provider_price\";d:9900;s:9:\"admin_fee\";d:400;s:10:\"commission\";d:0;s:6:\"margin\";d:300;s:13:\"selling_price\";d:10600;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_36', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:36;s:11:\"operator_id\";i:8;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"DF2GB\";s:4:\"name\";s:19:\"Indosat Freedom 2GB\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:4:\"2 GB\";s:14:\"provider_price\";d:14900;s:9:\"admin_fee\";d:500;s:10:\"commission\";d:0;s:6:\"margin\";d:300;s:13:\"selling_price\";d:15700;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_37', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:37;s:11:\"operator_id\";i:8;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"DF3GB\";s:4:\"name\";s:19:\"Indosat Freedom 3GB\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:4:\"3 GB\";s:14:\"provider_price\";d:19000;s:9:\"admin_fee\";d:500;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:20000;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_38', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:38;s:11:\"operator_id\";i:8;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"DF5GB\";s:4:\"name\";s:19:\"Indosat Freedom 5GB\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:4:\"5 GB\";s:14:\"provider_price\";d:25000;s:9:\"admin_fee\";d:500;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:26000;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_39', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:39;s:11:\"operator_id\";i:8;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"DF8GB\";s:4:\"name\";s:19:\"Indosat Freedom 8GB\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:4:\"8 GB\";s:14:\"provider_price\";d:36000;s:9:\"admin_fee\";d:600;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:37100;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_4', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:4;s:11:\"operator_id\";i:1;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"PLSR15\";s:4:\"name\";s:14:\"Indosat 15.000\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:6:\"15.000\";s:14:\"provider_price\";d:15100;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:200;s:13:\"selling_price\";d:15500;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_40', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:40;s:11:\"operator_id\";i:8;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"DF10GB\";s:4:\"name\";s:20:\"Indosat Freedom 10GB\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:5:\"10 GB\";s:14:\"provider_price\";d:40500;s:9:\"admin_fee\";d:600;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:41600;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_41', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:41;s:11:\"operator_id\";i:8;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"DF12GB\";s:4:\"name\";s:20:\"Indosat Freedom 12GB\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:5:\"12 GB\";s:14:\"provider_price\";d:45500;s:9:\"admin_fee\";d:700;s:10:\"commission\";d:0;s:6:\"margin\";d:800;s:13:\"selling_price\";d:47000;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_42', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:42;s:11:\"operator_id\";i:8;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"DF20GB\";s:4:\"name\";s:20:\"Indosat Freedom 20GB\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:5:\"20 GB\";s:14:\"provider_price\";d:67500;s:9:\"admin_fee\";d:900;s:10:\"commission\";d:0;s:6:\"margin\";d:1000;s:13:\"selling_price\";d:69400;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_43', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:43;s:11:\"operator_id\";i:9;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"TS1GB\";s:4:\"name\";s:21:\"Telkomsel Seluler 1GB\";s:5:\"brand\";s:9:\"Telkomsel\";s:7:\"nominal\";s:4:\"1 GB\";s:14:\"provider_price\";d:10500;s:9:\"admin_fee\";d:400;s:10:\"commission\";d:0;s:6:\"margin\";d:300;s:13:\"selling_price\";d:11200;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-telkomsel/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_44', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:44;s:11:\"operator_id\";i:9;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"TS3GB\";s:4:\"name\";s:21:\"Telkomsel Seluler 3GB\";s:5:\"brand\";s:9:\"Telkomsel\";s:7:\"nominal\";s:4:\"3 GB\";s:14:\"provider_price\";d:21000;s:9:\"admin_fee\";d:500;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:22000;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-telkomsel/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_45', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:45;s:11:\"operator_id\";i:9;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"TS5GB\";s:4:\"name\";s:21:\"Telkomsel Seluler 5GB\";s:5:\"brand\";s:9:\"Telkomsel\";s:7:\"nominal\";s:4:\"5 GB\";s:14:\"provider_price\";d:28000;s:9:\"admin_fee\";d:600;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:29100;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-telkomsel/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_46', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:46;s:11:\"operator_id\";i:9;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"TS10GB\";s:4:\"name\";s:22:\"Telkomsel Seluler 10GB\";s:5:\"brand\";s:9:\"Telkomsel\";s:7:\"nominal\";s:5:\"10 GB\";s:14:\"provider_price\";d:46000;s:9:\"admin_fee\";d:800;s:10:\"commission\";d:0;s:6:\"margin\";d:800;s:13:\"selling_price\";d:47600;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-telkomsel/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_47', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:47;s:11:\"operator_id\";i:10;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"XL1GB\";s:4:\"name\";s:16:\"XL Prioritas 1GB\";s:5:\"brand\";s:2:\"XL\";s:7:\"nominal\";s:4:\"1 GB\";s:14:\"provider_price\";d:10000;s:9:\"admin_fee\";d:400;s:10:\"commission\";d:0;s:6:\"margin\";d:300;s:13:\"selling_price\";d:10700;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:42:\"https://picsum.photos/seed/ppob-xl/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_48', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:48;s:11:\"operator_id\";i:10;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"XL5GB\";s:4:\"name\";s:16:\"XL Prioritas 5GB\";s:5:\"brand\";s:2:\"XL\";s:7:\"nominal\";s:4:\"5 GB\";s:14:\"provider_price\";d:24000;s:9:\"admin_fee\";d:500;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:25000;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:42:\"https://picsum.photos/seed/ppob-xl/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_49', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:49;s:11:\"operator_id\";i:10;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"XL20GB\";s:4:\"name\";s:17:\"XL Prioritas 20GB\";s:5:\"brand\";s:2:\"XL\";s:7:\"nominal\";s:5:\"20 GB\";s:14:\"provider_price\";d:62000;s:9:\"admin_fee\";d:900;s:10:\"commission\";d:0;s:6:\"margin\";d:1000;s:13:\"selling_price\";d:63900;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:42:\"https://picsum.photos/seed/ppob-xl/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_5', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:5;s:11:\"operator_id\";i:1;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"PLSR20\";s:4:\"name\";s:14:\"Indosat 20.000\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:6:\"20.000\";s:14:\"provider_price\";d:20100;s:9:\"admin_fee\";d:300;s:10:\"commission\";d:0;s:6:\"margin\";d:200;s:13:\"selling_price\";d:20600;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_50', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:50;s:11:\"operator_id\";i:11;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"TRD1GB\";s:4:\"name\";s:7:\"Tri 1GB\";s:5:\"brand\";s:3:\"Tri\";s:7:\"nominal\";s:4:\"1 GB\";s:14:\"provider_price\";d:9500;s:9:\"admin_fee\";d:400;s:10:\"commission\";d:0;s:6:\"margin\";d:300;s:13:\"selling_price\";d:10200;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:43:\"https://picsum.photos/seed/ppob-tri/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_51', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:51;s:11:\"operator_id\";i:11;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"TRD8GB\";s:4:\"name\";s:7:\"Tri 8GB\";s:5:\"brand\";s:3:\"Tri\";s:7:\"nominal\";s:4:\"8 GB\";s:14:\"provider_price\";d:30000;s:9:\"admin_fee\";d:600;s:10:\"commission\";d:0;s:6:\"margin\";d:600;s:13:\"selling_price\";d:31200;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:43:\"https://picsum.photos/seed/ppob-tri/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_52', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:52;s:11:\"operator_id\";i:12;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"AXD1GB\";s:4:\"name\";s:8:\"Axis 1GB\";s:5:\"brand\";s:4:\"Axis\";s:7:\"nominal\";s:4:\"1 GB\";s:14:\"provider_price\";d:9800;s:9:\"admin_fee\";d:400;s:10:\"commission\";d:0;s:6:\"margin\";d:300;s:13:\"selling_price\";d:10500;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:44:\"https://picsum.photos/seed/ppob-axis/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_53', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:53;s:11:\"operator_id\";i:12;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"AXD5GB\";s:4:\"name\";s:8:\"Axis 5GB\";s:5:\"brand\";s:4:\"Axis\";s:7:\"nominal\";s:4:\"5 GB\";s:14:\"provider_price\";d:23000;s:9:\"admin_fee\";d:500;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:24000;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:44:\"https://picsum.photos/seed/ppob-axis/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_54', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:54;s:11:\"operator_id\";i:13;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"SMD1GB\";s:4:\"name\";s:13:\"Smartfren 1GB\";s:5:\"brand\";s:9:\"Smartfren\";s:7:\"nominal\";s:4:\"1 GB\";s:14:\"provider_price\";d:9900;s:9:\"admin_fee\";d:400;s:10:\"commission\";d:0;s:6:\"margin\";d:300;s:13:\"selling_price\";d:10600;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-smartfren/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_55', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:55;s:11:\"operator_id\";i:13;s:8:\"category\";s:4:\"data\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"SMD5GB\";s:4:\"name\";s:13:\"Smartfren 5GB\";s:5:\"brand\";s:9:\"Smartfren\";s:7:\"nominal\";s:4:\"5 GB\";s:14:\"provider_price\";d:26000;s:9:\"admin_fee\";d:500;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:27000;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-smartfren/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044360),
('marketapi-cache-ppob_price_product_56', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:56;s:11:\"operator_id\";i:14;s:8:\"category\";s:13:\"token-listrik\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"TOK20\";s:4:\"name\";s:16:\"Token PLN 20.000\";s:5:\"brand\";s:5:\"Token\";s:7:\"nominal\";s:6:\"20.000\";s:14:\"provider_price\";d:19900;s:9:\"admin_fee\";d:2400;s:10:\"commission\";d:200;s:6:\"margin\";d:0;s:13:\"selling_price\";d:22300;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:45:\"https://picsum.photos/seed/ppob-token/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044361),
('marketapi-cache-ppob_price_product_57', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:57;s:11:\"operator_id\";i:14;s:8:\"category\";s:13:\"token-listrik\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"TOK50\";s:4:\"name\";s:16:\"Token PLN 50.000\";s:5:\"brand\";s:5:\"Token\";s:7:\"nominal\";s:6:\"50.000\";s:14:\"provider_price\";d:49900;s:9:\"admin_fee\";d:2600;s:10:\"commission\";d:200;s:6:\"margin\";d:0;s:13:\"selling_price\";d:52500;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:45:\"https://picsum.photos/seed/ppob-token/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044361),
('marketapi-cache-ppob_price_product_58', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:58;s:11:\"operator_id\";i:14;s:8:\"category\";s:13:\"token-listrik\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"TOK100\";s:4:\"name\";s:17:\"Token PLN 100.000\";s:5:\"brand\";s:5:\"Token\";s:7:\"nominal\";s:7:\"100.000\";s:14:\"provider_price\";d:99900;s:9:\"admin_fee\";d:2800;s:10:\"commission\";d:200;s:6:\"margin\";d:0;s:13:\"selling_price\";d:102700;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:45:\"https://picsum.photos/seed/ppob-token/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044361),
('marketapi-cache-ppob_price_product_59', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:59;s:11:\"operator_id\";i:14;s:8:\"category\";s:13:\"token-listrik\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"TOK200\";s:4:\"name\";s:17:\"Token PLN 200.000\";s:5:\"brand\";s:5:\"Token\";s:7:\"nominal\";s:7:\"200.000\";s:14:\"provider_price\";d:199900;s:9:\"admin_fee\";d:3200;s:10:\"commission\";d:200;s:6:\"margin\";d:0;s:13:\"selling_price\";d:203100;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:45:\"https://picsum.photos/seed/ppob-token/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044361),
('marketapi-cache-ppob_price_product_6', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:6;s:11:\"operator_id\";i:1;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"PLSR25\";s:4:\"name\";s:14:\"Indosat 25.000\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:6:\"25.000\";s:14:\"provider_price\";d:25100;s:9:\"admin_fee\";d:300;s:10:\"commission\";d:0;s:6:\"margin\";d:300;s:13:\"selling_price\";d:25700;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_60', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:60;s:11:\"operator_id\";i:14;s:8:\"category\";s:13:\"token-listrik\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"TOK500\";s:4:\"name\";s:17:\"Token PLN 500.000\";s:5:\"brand\";s:5:\"Token\";s:7:\"nominal\";s:7:\"500.000\";s:14:\"provider_price\";d:499900;s:9:\"admin_fee\";d:3500;s:10:\"commission\";d:200;s:6:\"margin\";d:0;s:13:\"selling_price\";d:503400;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:45:\"https://picsum.photos/seed/ppob-token/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044361),
('marketapi-cache-ppob_price_product_61', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:61;s:11:\"operator_id\";i:15;s:8:\"category\";s:7:\"tagihan\";s:12:\"product_type\";s:8:\"postpaid\";s:21:\"provider_product_code\";s:5:\"PLNPB\";s:4:\"name\";s:30:\"Pembayaran Tagihan Listrik PLN\";s:5:\"brand\";s:10:\"Pembayaran\";s:7:\"nominal\";N;s:14:\"provider_price\";d:0;s:9:\"admin_fee\";d:2500;s:10:\"commission\";d:0;s:6:\"margin\";d:0;s:13:\"selling_price\";d:2500;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:50:\"https://picsum.photos/seed/ppob-pembayaran/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044361),
('marketapi-cache-ppob_price_product_62', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:62;s:11:\"operator_id\";i:16;s:8:\"category\";s:7:\"tagihan\";s:12:\"product_type\";s:8:\"postpaid\";s:21:\"provider_product_code\";s:6:\"PDAMPB\";s:4:\"name\";s:23:\"Pembayaran Tagihan PDAM\";s:5:\"brand\";s:10:\"Pembayaran\";s:7:\"nominal\";N;s:14:\"provider_price\";d:0;s:9:\"admin_fee\";d:2000;s:10:\"commission\";d:0;s:6:\"margin\";d:0;s:13:\"selling_price\";d:2000;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:50:\"https://picsum.photos/seed/ppob-pembayaran/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1790044361),
('marketapi-cache-ppob_price_product_7', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:7;s:11:\"operator_id\";i:1;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:6:\"PLSR50\";s:4:\"name\";s:14:\"Indosat 50.000\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:6:\"50.000\";s:14:\"provider_price\";d:50000;s:9:\"admin_fee\";d:500;s:10:\"commission\";d:0;s:6:\"margin\";d:500;s:13:\"selling_price\";d:51000;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_8', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:8;s:11:\"operator_id\";i:1;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:7:\"PLSR100\";s:4:\"name\";s:15:\"Indosat 100.000\";s:5:\"brand\";s:7:\"Indosat\";s:7:\"nominal\";s:7:\"100.000\";s:14:\"provider_price\";d:99000;s:9:\"admin_fee\";d:500;s:10:\"commission\";d:0;s:6:\"margin\";d:1000;s:13:\"selling_price\";d:100500;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:47:\"https://picsum.photos/seed/ppob-indosat/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-ppob_price_product_9', 'a:2:{s:7:\"product\";a:20:{s:2:\"id\";i:9;s:11:\"operator_id\";i:2;s:8:\"category\";s:5:\"pulsa\";s:12:\"product_type\";s:7:\"prepaid\";s:21:\"provider_product_code\";s:5:\"TSEK5\";s:4:\"name\";s:15:\"Telkomsel 5.000\";s:5:\"brand\";s:9:\"Telkomsel\";s:7:\"nominal\";s:5:\"5.000\";s:14:\"provider_price\";d:5500;s:9:\"admin_fee\";d:200;s:10:\"commission\";d:0;s:6:\"margin\";d:50;s:13:\"selling_price\";d:5750;s:6:\"status\";s:6:\"active\";s:12:\"is_available\";b:1;s:9:\"is_active\";b:1;s:8:\"icon_url\";s:49:\"https://picsum.photos/seed/ppob-telkomsel/128/128\";s:8:\"metadata\";N;s:10:\"created_at\";s:19:\"2026-09-14 07:59:56\";s:10:\"updated_at\";s:19:\"2026-09-14 07:59:56\";}s:4:\"rule\";N;}', 1792381206),
('marketapi-cache-rajaongkir:destination:2cfd823b1400219890102b1fe14e0b20c396b3889346b13699e9b66dff3758d9', 'a:7:{s:2:\"id\";i:46743;s:5:\"label\";s:41:\"BARENG, KLOJEN, MALANG, JAWA TIMUR, 65116\";s:13:\"province_name\";s:10:\"JAWA TIMUR\";s:9:\"city_name\";s:6:\"MALANG\";s:13:\"district_name\";s:6:\"KLOJEN\";s:16:\"subdistrict_name\";s:6:\"BARENG\";s:8:\"zip_code\";s:5:\"65116\";}', 1792642770);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, '00000000-0000-4000-8000-000000000201', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, '00000000-0000-4000-8000-000000000202', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, '00000000-0000-4000-8000-000000000203', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(4, '00000000-0000-4000-8000-000000000204', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(5, '00000000-0000-4000-8000-000000000205', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(6, '00000000-0000-4000-8000-000000000206', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(7, '00000000-0000-4000-8000-000000000207', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(8, '00000000-0000-4000-8000-000000000208', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(9, '00000000-0000-4000-8000-000000000209', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(10, '00000000-0000-4000-8000-000000000210', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(11, '1ae55236-f781-406a-baa7-62635f4c9545', '2026-09-15 00:51:01', '2026-09-15 00:51:01');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cart_id` bigint(20) UNSIGNED NOT NULL,
  `product_variant_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `product_variant_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 9, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(2, 1, 21, 2, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(3, 1, 25, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(5, 2, 11, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(6, 2, 45, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(7, 3, 27, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(8, 3, 45, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(9, 3, 57, 2, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(10, 4, 25, 2, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(11, 4, 50, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(12, 4, 59, 2, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(13, 5, 16, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(14, 5, 26, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(15, 5, 50, 2, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(16, 6, 5, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(17, 6, 37, 2, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(18, 6, 61, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(19, 7, 22, 2, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(20, 7, 41, 2, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(21, 7, 52, 2, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(22, 8, 23, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(23, 8, 31, 2, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(24, 8, 54, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(25, 9, 8, 2, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(26, 9, 26, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(27, 9, 56, 2, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(28, 10, 14, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(29, 10, 58, 1, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(30, 10, 61, 2, '2026-09-14 00:59:55', '2026-09-14 00:59:55'),
(32, 2, 3, 2, '2026-09-21 21:23:07', '2026-09-21 21:23:07');

-- --------------------------------------------------------

--
-- Table structure for table `catalog_groups`
--

CREATE TABLE `catalog_groups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `catalog_groups`
--

INSERT INTO `catalog_groups` (`id`, `name`, `slug`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Makanan & Minuman', 'makanan-minuman', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(2, 'Rumah Tangga', 'rumah-tangga', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(3, 'Elektronik & Gadget', 'elektronik-gadget', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(4, 'Fesyen & Batik', 'fesyen-batik', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(5, 'Alat Tulis & Kerajinan', 'alat-tulis-kerajinan', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(6, 'Kesehatan & Kecantikan', 'kesehatan-kecantikan', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `catalog_group_id` bigint(20) UNSIGNED NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `parent_scope_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `level` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_visible_in_menu` tinyint(1) NOT NULL DEFAULT 1,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `full_slug` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `icon_url` varchar(255) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `catalog_group_id`, `parent_id`, `parent_scope_id`, `level`, `sort_order`, `is_active`, `is_visible_in_menu`, `name`, `slug`, `full_slug`, `image_url`, `icon_url`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, NULL, 0, 1, 10, 1, 1, 'Makanan', 'makanan', 'makanan', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(2, 1, 1, 1, 2, 10, 1, 1, 'Makanan Ringan', 'makanan-ringan', 'makanan/makanan-ringan', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(3, 1, 2, 2, 3, 10, 1, 1, 'Keripik & Snack', 'keripik', 'makanan/makanan-ringan/keripik', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(4, 1, 2, 2, 3, 20, 1, 1, 'Kue Kering', 'kue-kering', 'makanan/makanan-ringan/kue-kering', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(5, 1, 2, 2, 3, 30, 1, 1, 'Cokelat & Permen', 'cokelat', 'makanan/makanan-ringan/cokelat', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(6, 1, 1, 1, 2, 20, 1, 1, 'Makanan Siap Saji', 'makanan-siap-saji', 'makanan/makanan-siap-saji', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(7, 1, 6, 6, 3, 10, 1, 1, 'Bakso', 'bakso', 'makanan/makanan-siap-saji/bakso', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(8, 1, 6, 6, 3, 20, 1, 1, 'Sate', 'sate', 'makanan/makanan-siap-saji/sate', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(9, 1, 6, 6, 3, 30, 1, 1, 'Ayam Goreng', 'ayam-goreng', 'makanan/makanan-siap-saji/ayam-goreng', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(10, 1, 1, 1, 2, 30, 1, 1, 'Minuman', 'minuman', 'makanan/minuman', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(11, 1, 10, 10, 3, 10, 1, 1, 'Kopi', 'kopi', 'makanan/minuman/kopi', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(12, 1, 10, 10, 3, 20, 1, 1, 'Teh', 'teh', 'makanan/minuman/teh', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(13, 1, 10, 10, 3, 30, 1, 1, 'Sirup & Jus', 'sirup-jus', 'makanan/minuman/sirup-jus', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(14, 2, NULL, 0, 1, 10, 1, 1, 'Rumah', 'rumah', 'rumah', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(15, 2, 14, 14, 2, 10, 1, 1, 'Kebersihan', 'kebersihan', 'rumah/kebersihan', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(16, 2, 15, 15, 3, 10, 1, 1, 'Pel & Lap', 'pel-lap', 'rumah/kebersihan/pel-lap', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(17, 2, 15, 15, 3, 20, 1, 1, 'Sapu & Sikat', 'sapu-siku', 'rumah/kebersihan/sapu-siku', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(18, 2, 15, 15, 3, 30, 1, 1, 'Tempat Sampah', 'tempat-sampah', 'rumah/kebersihan/tempat-sampah', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(19, 2, 14, 14, 2, 20, 1, 1, 'Dekorasi', 'dekorasi', 'rumah/dekorasi', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(20, 2, 19, 19, 3, 10, 1, 1, 'Lilin & Pengharum', 'lilin-aroma', 'rumah/dekorasi/lilin-aroma', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(21, 2, 19, 19, 3, 20, 1, 1, 'Vas & Pot', 'vas-pot', 'rumah/dekorasi/vas-pot', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(22, 2, 19, 19, 3, 30, 1, 1, 'Jam Dinding', 'jam-dinding', 'rumah/dekorasi/jam-dinding', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(23, 3, NULL, 0, 1, 10, 1, 1, 'Elektronik', 'elektronik', 'elektronik', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(24, 3, 23, 23, 2, 10, 1, 1, 'Audio', 'audio', 'elektronik/audio', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(25, 3, 24, 24, 3, 10, 1, 1, 'Speaker', 'speaker', 'elektronik/audio/speaker', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(26, 3, 24, 24, 3, 20, 1, 1, 'Headphone & Earphone', 'headphone', 'elektronik/audio/headphone', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(27, 3, 23, 23, 2, 20, 1, 1, 'Aksesori Gadget', 'aksesori-gadget', 'elektronik/aksesori-gadget', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(28, 3, 27, 27, 3, 10, 1, 1, 'Charger & Kabel', 'charger-kabel', 'elektronik/aksesori-gadget/charger-kabel', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(29, 3, 27, 27, 3, 20, 1, 1, 'Powerbank', 'powerbank', 'elektronik/aksesori-gadget/powerbank', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(30, 3, 27, 27, 3, 30, 1, 1, 'Casing & Pelindung', 'casing-pelindung', 'elektronik/aksesori-gadget/casing-pelindung', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(31, 3, 23, 23, 2, 30, 1, 1, 'Perangkat Lain', 'perangkat-lain', 'elektronik/perangkat-lain', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(32, 3, 31, 31, 3, 10, 1, 1, 'Lampu LED', 'lampu-led', 'elektronik/perangkat-lain/lampu-led', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(33, 3, 31, 31, 3, 20, 1, 1, 'Adaptor & Converter', 'adaptor', 'elektronik/perangkat-lain/adaptor', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(34, 4, NULL, 0, 1, 10, 1, 1, 'Pakaian Pria', 'pakaian-pria', 'pakaian-pria', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(35, 4, 34, 34, 2, 10, 1, 1, 'Kemeja Pria', 'kemeja-pria', 'pakaian-pria/kemeja-pria', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(36, 4, 35, 35, 3, 10, 1, 1, 'Kemeja Batik', 'kemeja-batik', 'pakaian-pria/kemeja-pria/kemeja-batik', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(37, 4, 35, 35, 3, 20, 1, 1, 'Kemeja Formal', 'kemeja-formal', 'pakaian-pria/kemeja-pria/kemeja-formal', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(38, 4, 34, 34, 2, 20, 1, 1, 'Kaos Pria', 'kaos-pria', 'pakaian-pria/kaos-pria', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(39, 4, 38, 38, 3, 10, 1, 1, 'Kaos Polos', 'kaos-polos', 'pakaian-pria/kaos-pria/kaos-polos', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(40, 4, 38, 38, 3, 20, 1, 1, 'Kaos Batik', 'kaos-batik', 'pakaian-pria/kaos-pria/kaos-batik', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(41, 4, NULL, 0, 1, 20, 1, 1, 'Pakaian Wanita', 'pakaian-wanita', 'pakaian-wanita', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(42, 4, 41, 41, 2, 10, 1, 1, 'Atasan Wanita', 'atasan-wanita', 'pakaian-wanita/atasan-wanita', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(43, 4, 42, 42, 3, 10, 1, 1, 'Blouse & Kemeja', 'blouse', 'pakaian-wanita/atasan-wanita/blouse', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(44, 4, 42, 42, 3, 20, 1, 1, 'Kebaya & Bahan Wanita', 'kebaya', 'pakaian-wanita/atasan-wanita/kebaya', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(45, 4, 41, 41, 2, 20, 1, 1, 'Bawahan Wanita', 'bawahan-wanita', 'pakaian-wanita/bawahan-wanita', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(46, 4, 45, 45, 3, 10, 1, 1, 'Rok', 'rok', 'pakaian-wanita/bawahan-wanita/rok', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(47, 4, 45, 45, 3, 20, 1, 1, 'Celana Wanita', 'celana-wanita', 'pakaian-wanita/bawahan-wanita/celana-wanita', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(48, 4, NULL, 0, 1, 30, 1, 1, 'Batik & Kain', 'batik-kain', 'batik-kain', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(49, 4, 48, 48, 2, 10, 1, 1, 'Batik', 'batik', 'batik-kain/batik', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(50, 4, 49, 49, 3, 10, 1, 1, 'Batik Tulis', 'batik-tulis', 'batik-kain/batik/batik-tulis', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(51, 4, 49, 49, 3, 20, 1, 1, 'Batik Cap', 'batik-cap', 'batik-kain/batik/batik-cap', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(52, 4, 49, 49, 3, 30, 1, 1, 'Batik Printing', 'batik-printing', 'batik-kain/batik/batik-printing', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(53, 4, 48, 48, 2, 20, 1, 1, 'Kain Tradisional', 'kain-tradisional', 'batik-kain/kain-tradisional', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(54, 4, 53, 53, 3, 10, 1, 1, 'Kain Tenun', 'kain-tenun', 'batik-kain/kain-tradisional/kain-tenun', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(55, 4, 53, 53, 3, 20, 1, 1, 'Kain Lurik', 'kain-lurik', 'batik-kain/kain-tradisional/kain-lurik', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(56, 5, NULL, 0, 1, 10, 1, 1, 'Alat Tulis', 'alat-tulis', 'alat-tulis', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(57, 5, 56, 56, 2, 10, 1, 1, 'Menulis', 'menulis', 'alat-tulis/menulis', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(58, 5, 57, 57, 3, 10, 1, 1, 'Pulpen', 'pulpen', 'alat-tulis/menulis/pulpen', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(59, 5, 57, 57, 3, 20, 1, 1, 'Pensil & Pensil Warna', 'pensil', 'alat-tulis/menulis/pensil', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(60, 5, 57, 57, 3, 30, 1, 1, 'Spidol & Highlighter', 'spidol', 'alat-tulis/menulis/spidol', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(61, 5, 56, 56, 2, 20, 1, 1, 'Kertas & Buku', 'kertas-buku', 'alat-tulis/kertas-buku', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(62, 5, 61, 61, 3, 10, 1, 1, 'Buku Catatan', 'buku-catatan', 'alat-tulis/kertas-buku/buku-catatan', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(63, 5, 61, 61, 3, 20, 1, 1, 'Kertas HVS', 'kertas-hvs', 'alat-tulis/kertas-buku/kertas-hvs', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(64, 5, 61, 61, 3, 30, 1, 1, 'Kertas Kado', 'kertas-kado', 'alat-tulis/kertas-buku/kertas-kado', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(65, 5, NULL, 0, 1, 20, 1, 1, 'Kerajinan', 'kerajinan', 'kerajinan', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(66, 5, 65, 65, 2, 10, 1, 1, 'Stiker & Tape', 'stiker-tape', 'kerajinan/stiker-tape', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(67, 5, 66, 66, 3, 10, 1, 1, 'Stiker', 'stiker', 'kerajinan/stiker-tape/stiker', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(68, 5, 66, 66, 3, 20, 1, 1, 'Washi Tape', 'washi-tape', 'kerajinan/stiker-tape/washi-tape', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(69, 5, 65, 65, 2, 20, 1, 1, 'Bahan Kerajinan', 'bahan-kerajinan', 'kerajinan/bahan-kerajinan', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(70, 5, 69, 69, 3, 10, 1, 1, 'Kertas Kerajinan (Papercraft)', 'papercraft', 'kerajinan/bahan-kerajinan/papercraft', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(71, 5, 69, 69, 3, 20, 1, 1, 'Pita & Manik', 'pita-manik', 'kerajinan/bahan-kerajinan/pita-manik', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(72, 6, NULL, 0, 1, 10, 1, 1, 'Kesehatan', 'kesehatan', 'kesehatan', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(73, 6, 72, 72, 2, 10, 1, 1, 'Perawatan Tubuh', 'perawatan-tubuh', 'kesehatan/perawatan-tubuh', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(74, 6, 73, 73, 3, 10, 1, 1, 'Sabun & Body Care', 'sabun-body-care', 'kesehatan/perawatan-tubuh/sabun-body-care', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(75, 6, 73, 73, 3, 20, 1, 1, 'Suplemen & Vitamin', 'suplemen', 'kesehatan/perawatan-tubuh/suplemen', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(76, 6, NULL, 0, 1, 20, 1, 1, 'Kecantikan', 'kecantikan', 'kecantikan', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(77, 6, 76, 76, 2, 10, 1, 1, 'Perawatan Kulit', 'perawatan-kulit', 'kecantikan/perawatan-kulit', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(78, 6, 77, 77, 3, 10, 1, 1, 'Serum & Skincare', 'serum-skincare', 'kecantikan/perawatan-kulit/serum-skincare', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(79, 6, 77, 77, 3, 20, 1, 1, 'Sunscreen', 'sunscreen', 'kecantikan/perawatan-kulit/sunscreen', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(80, 6, 76, 76, 2, 20, 1, 1, 'Perawatan Rambut', 'perawatan-rambut', 'kecantikan/perawatan-rambut', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(81, 6, 80, 80, 3, 10, 1, 1, 'Shampoo', 'shampoo', 'kecantikan/perawatan-rambut/shampoo', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(82, 6, 80, 80, 3, 20, 1, 1, 'Minyak Rambut', 'minyak-rambut', 'kecantikan/perawatan-rambut/minyak-rambut', NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` char(36) DEFAULT NULL,
  `message_type` varchar(30) NOT NULL DEFAULT 'text',
  `message` text NOT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `edited_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `conversation_id`, `sender_id`, `message_type`, `message`, `attachments`, `edited_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, '00000000-0000-4000-8000-000000000201', 'text', 'Halo kak, keripik singkong balado masih ready ya?', NULL, NULL, '2026-09-03 23:59:56', '2026-09-03 23:59:56', NULL),
(2, 1, '00000000-0000-4000-8000-000000000101', 'text', 'Halo kak, ready kok. Mau pesan berapa?', NULL, NULL, '2026-08-31 01:59:56', '2026-08-31 01:59:56', NULL),
(3, 1, '00000000-0000-4000-8000-000000000201', 'text', '2 bungkus balado + 1 original ya kak.', NULL, NULL, '2026-08-27 05:59:56', '2026-08-27 05:59:56', NULL),
(4, 1, '00000000-0000-4000-8000-000000000101', 'text', 'Siap, nanti saya siapkan pesanannya. Terima kasih kak!', NULL, NULL, '2026-08-23 11:59:56', '2026-08-23 11:59:56', NULL),
(5, 2, '00000000-0000-4000-8000-000000000001', 'text', 'Selamat, promo toko Kak Raka sudah disetujui.', NULL, NULL, '2026-07-29 09:59:56', '2026-07-29 09:59:56', NULL),
(6, 2, '00000000-0000-4000-8000-000000000102', 'text', 'Terima kasih admin! Mau lanjut pasang yang lain bisa?', NULL, NULL, '2026-07-19 19:59:56', '2026-07-19 19:59:56', NULL),
(7, 2, '00000000-0000-4000-8000-000000000001', 'text', 'Tentu bisa. Ajukan lewat menu promosi ya.', NULL, NULL, '2026-07-10 15:59:56', '2026-07-10 15:59:56', NULL),
(18, 5, '00000000-0000-4000-8000-000000000001', 'text', 'Pesan banned test', NULL, NULL, '2026-09-14 02:01:15', '2026-09-14 02:01:15', NULL),
(19, 5, '00000000-0000-4000-8000-000000000001', 'text', 'Unban test', NULL, NULL, '2026-09-14 02:01:16', '2026-09-14 02:01:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chat_message_reads`
--

CREATE TABLE `chat_message_reads` (
  `message_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `read_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_message_reads`
--

INSERT INTO `chat_message_reads` (`message_id`, `user_id`, `read_at`) VALUES
(18, '00000000-0000-4000-8000-000000000002', '2026-09-18 20:04:16'),
(19, '00000000-0000-4000-8000-000000000002', '2026-09-18 20:04:16'),
(1, '00000000-0000-4000-8000-000000000101', '2026-09-18 20:06:11'),
(3, '00000000-0000-4000-8000-000000000101', '2026-09-18 20:06:11'),
(5, '00000000-0000-4000-8000-000000000102', '2026-09-17 23:19:42'),
(7, '00000000-0000-4000-8000-000000000102', '2026-09-17 23:19:42');

-- --------------------------------------------------------

--
-- Table structure for table `code_patterns`
--

CREATE TABLE `code_patterns` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` varchar(40) NOT NULL,
  `pattern` varchar(120) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(30) NOT NULL DEFAULT 'direct',
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `subject` varchar(180) DEFAULT NULL,
  `target_role` varchar(30) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `type`, `store_id`, `order_id`, `subject`, `target_role`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'direct', 1, NULL, 'Tanya produk keripik', 'seller', 1, '00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000201', '2026-09-12 00:59:56', '2026-09-12 00:59:56', NULL),
(2, 'admin', 2, NULL, 'Persetujuan promo', 'seller', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-18 11:59:56', '2026-08-18 11:59:56', NULL),
(5, 'direct', NULL, NULL, 'Akun Anda Dinonaktifkan', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 02:01:15', '2026-09-14 02:01:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `conversation_participants`
--

CREATE TABLE `conversation_participants` (
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `last_read_at` timestamp NULL DEFAULT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `left_at` timestamp NULL DEFAULT NULL,
  `is_muted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversation_participants`
--

INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_at`, `joined_at`, `left_at`, `is_muted`) VALUES
(1, '00000000-0000-4000-8000-000000000101', '2026-09-30 20:53:25', '2026-09-07 23:59:56', NULL, 0),
(1, '00000000-0000-4000-8000-000000000201', '2026-09-07 23:59:56', '2026-09-07 23:59:56', NULL, 0),
(2, '00000000-0000-4000-8000-000000000001', '2026-08-08 09:59:56', '2026-08-08 09:59:56', NULL, 0),
(2, '00000000-0000-4000-8000-000000000102', '2026-09-23 02:05:39', '2026-08-08 09:59:56', NULL, 0),
(5, '00000000-0000-4000-8000-000000000001', '2026-09-14 02:01:16', '2026-09-14 02:01:15', NULL, 0),
(5, '00000000-0000-4000-8000-000000000101', NULL, '2026-09-14 02:01:15', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `financial_payment_histories`
--

CREATE TABLE `financial_payment_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `financial_transaction_id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `recorded_by` char(36) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `balance_before` decimal(15,2) NOT NULL,
  `balance_after` decimal(15,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL DEFAULT 'manual',
  `reference_number` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `paid_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `financial_payment_histories`
--

INSERT INTO `financial_payment_histories` (`id`, `financial_transaction_id`, `store_id`, `recorded_by`, `amount`, `balance_before`, `balance_after`, `payment_method`, `reference_number`, `notes`, `paid_at`, `created_at`, `updated_at`) VALUES
(1, 13, 6, '00000000-0000-4000-8000-000000000106', 9000000.00, 0.00, 9000000.00, 'transfer_bank', 'PAYH-13', 'Cicilan 1/3 Katering Kantor PT Maju Jaya', '2026-07-29 00:59:55', '2026-07-29 00:59:55', '2026-07-29 00:59:55'),
(2, 16, 6, '00000000-0000-4000-8000-000000000106', 437500.00, 0.00, 437500.00, 'cash', 'PAYH-16', 'Pembayaran 1/2 Hutang Pengrajin Kemasan', '2026-08-29 00:59:55', '2026-08-29 00:59:55', '2026-08-29 00:59:55');

-- --------------------------------------------------------

--
-- Table structure for table `financial_transactions`
--

CREATE TABLE `financial_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `reference_number` varchar(100) NOT NULL,
  `type` varchar(30) NOT NULL,
  `title` varchar(160) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `paid_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `status` varchar(30) NOT NULL DEFAULT 'open',
  `due_date` date DEFAULT NULL,
  `occurred_at` timestamp NOT NULL,
  `settled_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `financial_transactions`
--

INSERT INTO `financial_transactions` (`id`, `store_id`, `order_id`, `user_id`, `reference_number`, `type`, `title`, `description`, `amount`, `paid_amount`, `status`, `due_date`, `occurred_at`, `settled_at`, `is_active`, `metadata`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-INC-3000', 'income', 'Pemasukan operasional April 2026', 'Rekap pendapatan penjualan harian dari dapur produksi.', 390000.00, 390000.00, 'settled', NULL, '2026-04-02 14:00:00', '2026-04-02 14:00:00', 1, '{\"period\":\"2026-04\"}', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-04-01 17:00:00', '2026-04-01 17:00:00', NULL),
(2, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-INC-3001', 'income', 'Pemasukan operasional May 2026', 'Rekap pendapatan penjualan harian dari dapur produksi.', 490000.00, 490000.00, 'settled', NULL, '2026-05-02 14:00:00', '2026-05-02 14:00:00', 1, '{\"period\":\"2026-05\"}', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-05-01 17:00:00', '2026-05-01 17:00:00', NULL),
(3, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-INC-3002', 'income', 'Pemasukan operasional June 2026', 'Rekap pendapatan penjualan harian dari dapur produksi.', 530000.00, 530000.00, 'settled', NULL, '2026-06-02 14:00:00', '2026-06-02 14:00:00', 1, '{\"period\":\"2026-06\"}', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-01 17:00:00', '2026-06-01 17:00:00', NULL),
(4, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-INC-3003', 'income', 'Pemasukan operasional July 2026', 'Rekap pendapatan penjualan harian dari dapur produksi.', 500000.00, 500000.00, 'settled', NULL, '2026-07-02 14:00:00', '2026-07-02 14:00:00', 1, '{\"period\":\"2026-07\"}', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-01 17:00:00', '2026-07-01 17:00:00', NULL),
(5, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-INC-3004', 'income', 'Pemasukan operasional August 2026', 'Rekap pendapatan penjualan harian dari dapur produksi.', 380000.00, 380000.00, 'settled', NULL, '2026-08-02 14:00:00', '2026-08-02 14:00:00', 1, '{\"period\":\"2026-08\"}', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-01 17:00:00', '2026-08-01 17:00:00', NULL),
(6, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-INC-3005', 'income', 'Pemasukan operasional September 2026', 'Rekap pendapatan penjualan harian dari dapur produksi.', 470000.00, 470000.00, 'settled', NULL, '2026-09-02 14:00:00', '2026-09-02 14:00:00', 1, '{\"period\":\"2026-09\"}', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-01 17:00:00', '2026-09-01 17:00:00', NULL),
(7, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-EXP-3006', 'expense', 'Belanja Beras 100kg', 'RM supply beras 100kg untuk 2 bulan.', 1250000.00, 0.00, 'open', NULL, '2026-08-22 08:00:00', NULL, 1, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:55', '2026-09-14 00:59:55', NULL),
(8, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-EXP-3007', 'expense', 'Belanja Ayam Potong', 'Ayam potong segar 50kg untuk produksi.', 1600000.00, 1600000.00, 'settled', NULL, '2026-07-16 08:00:00', '2026-08-03 08:00:00', 1, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:55', '2026-09-14 00:59:55', NULL),
(9, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-EXP-3008', 'expense', 'Belanja Daging Sapi Giling', 'Daging sapi giling 20kg untuk bakso.', 1760000.00, 1760000.00, 'settled', NULL, '2026-09-07 08:00:00', '2026-08-17 08:00:00', 1, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:55', '2026-09-14 00:59:55', NULL),
(10, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-EXP-3009', 'expense', 'Gas LPG 12kg x 2', 'Pengisian gas untuk operasional dapur.', 420000.00, 420000.00, 'settled', NULL, '2026-08-24 08:00:00', '2026-08-03 08:00:00', 1, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:55', '2026-09-14 00:59:55', NULL),
(11, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-EXP-3010', 'expense', 'Kemasan & Plastik', 'Packaging pesanan dan pembungkus.', 260000.00, 0.00, 'open', NULL, '2026-08-02 08:00:00', NULL, 1, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:55', '2026-09-14 00:59:55', NULL),
(12, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-EXP-3011', 'expense', 'Perawatan Alat Dapur', 'Servis mixer dan kompor.', 350000.00, 350000.00, 'settled', NULL, '2026-09-09 08:00:00', '2026-09-10 08:00:00', 1, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:55', '2026-09-14 00:59:55', NULL),
(13, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-RCV-3012', 'receivable', 'Katering Kantor PT Maju Jaya', 'Pesanan katering 3 bulan untuk 50 karyawan. Cicilan 3x.', 27000000.00, 9000000.00, 'partial', '2026-10-24', '2026-07-26 00:59:55', NULL, 1, '{\"payer\":\"PT Maju Jaya\",\"invoice_prefix\":\"INV-OP\"}', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-26 00:59:55', '2026-09-14 00:59:55', NULL),
(14, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-RCV-3013', 'receivable', 'Pesanan Partai Acara Nikah', 'Katering acara nikah 200 pax, sisa pelunasan.', 18000000.00, 0.00, 'open', '2026-11-23', '2026-08-25 00:59:55', NULL, 1, '{\"payer\":\"PT Maju Jaya\",\"invoice_prefix\":\"INV-OP\"}', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-25 00:59:55', '2026-09-14 00:59:55', NULL),
(15, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-PAY-3014', 'payable', 'Hutang Pemasok Beras', 'Beras premium 100kg diambil lebih dulu.', 1250000.00, 0.00, 'open', '2026-09-30', '2026-08-31 00:59:55', NULL, 1, '{\"supplier\":\"Supplier Pemasok\"}', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-31 00:59:55', '2026-09-14 00:59:55', NULL),
(16, 6, NULL, '00000000-0000-4000-8000-000000000106', 'FIN-PAY-3015', 'payable', 'Hutang Pengrajin Kemasan', 'Cetak kemasan edisi baru.', 875000.00, 437500.00, 'partial', '2026-09-23', '2026-08-24 00:59:55', NULL, 1, '{\"supplier\":\"Supplier Pemasok\"}', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-24 00:59:55', '2026-09-14 00:59:55', NULL),
(17, 2, NULL, NULL, 'INC-20260919015133-A2XKQ', 'income', '12sdddd', 'ssdsdsds', 6543.00, 0.00, 'posted', NULL, '2026-09-18 11:51:00', NULL, 1, NULL, '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', '2026-09-18 18:51:33', '2026-09-18 18:51:44', NULL),
(18, 2, NULL, NULL, 'EXP-20260919015229-3QJZ1', 'expense', '112wdexdwa', 'dwxccfcf', 98765432.00, 0.00, 'posted', NULL, '2026-09-18 18:52:00', NULL, 1, NULL, '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', '2026-09-18 18:52:29', '2026-09-18 18:52:29', NULL),
(19, 2, 59, '00000000-0000-4000-8000-000000000205', 'INC-20260922021951-4GGYZ', 'income', 'Pemasukan sesuai dengan no order SUB-INV-10058', 'Order product Case HP Silikon Transparan - Hitam x2, Kabel Data Type-C Nylon - 2m x1, Kabel Data Type-C Nylon - 0.5m x1 dengan jumlah 4 nomor order SUB-INV-10058', 146625.00, 0.00, 'posted', NULL, '2026-09-21 19:19:51', NULL, 1, '{\"source\":\"order_completed\",\"order_number\":\"SUB-INV-10058\",\"sub_order_id\":59}', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', '2026-09-21 19:19:51', '2026-09-21 19:19:51', NULL),
(20, 1, 54, '00000000-0000-4000-8000-000000000202', 'INC-20260922031723-A6H6F', 'income', 'Pemasukan sesuai dengan no order SUB-INV-10053', 'Order product Sari Kelapa Muda Botol - 300ml x 6 x2, Keripik Singkong Balado - Original 100g x3 dengan jumlah 5 nomor order SUB-INV-10053', 137775.00, 0.00, 'posted', NULL, '2026-09-21 20:17:23', NULL, 1, '{\"source\":\"order_completed\",\"order_number\":\"SUB-INV-10053\",\"sub_order_id\":54}', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-21 20:17:23', '2026-09-21 20:17:23', NULL),
(21, 1, NULL, NULL, 'EXP-20260927073424-ZZMSN', 'expense', 'hhjjfhg', 'ggfgfgf', 20000000000.00, 0.00, 'draft', NULL, '2026-09-27 00:34:00', NULL, 1, NULL, '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000101', '2026-09-27 00:34:24', '2026-09-27 00:34:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `game_contents`
--

CREATE TABLE `game_contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `game_type` varchar(40) NOT NULL,
  `title` varchar(160) NOT NULL,
  `difficulty` varchar(30) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`payload`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `game_contents`
--

INSERT INTO `game_contents` (`id`, `game_type`, `title`, `difficulty`, `payload`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(88, 'quiz', 'SDG nomor berapa yang membahas Aksi Iklim?', 'Mudah', '{\"question\":\"SDG nomor berapa yang membahas Aksi Iklim?\",\"options\":[\"SDG 6\",\"SDG 13\",\"SDG 4\",\"SDG 1\"],\"correct_answer\":\"SDG 13\",\"difficulty\":\"Mudah\",\"explanation\":\"Aksi Iklim adalah SDG 13.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(89, 'quiz', 'Apa tujuan utama SDG 4?', 'Mudah', '{\"question\":\"Apa tujuan utama SDG 4?\",\"options\":[\"Pendidikan berkualitas\",\"Energi bersih\",\"Kesehatan\",\"Infrastruktur\"],\"correct_answer\":\"Pendidikan berkualitas\",\"difficulty\":\"Mudah\",\"explanation\":\"SDG 4 fokus pada pendidikan berkualitas untuk semua.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(90, 'quiz', 'Mengurangi plastik sekali pakai mendukung SDG apa?', 'Mudah', '{\"question\":\"Mengurangi plastik sekali pakai mendukung SDG apa?\",\"options\":[\"SDG 12\",\"SDG 9\",\"SDG 5\",\"SDG 16\"],\"correct_answer\":\"SDG 12\",\"difficulty\":\"Mudah\",\"explanation\":\"SDG 12 adalah konsumsi dan produksi yang bertanggung jawab.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(91, 'quiz', 'Hemat air mendukung SDG apa?', 'Mudah', '{\"question\":\"Hemat air mendukung SDG apa?\",\"options\":[\"SDG 6\",\"SDG 10\",\"SDG 2\",\"SDG 14\"],\"correct_answer\":\"SDG 6\",\"difficulty\":\"Mudah\",\"explanation\":\"SDG 6 berfokus pada air bersih dan sanitasi.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(92, 'quiz', 'SDG 7 membahas tentang apa?', 'Mudah', '{\"question\":\"SDG 7 membahas tentang apa?\",\"options\":[\"Energi bersih dan terjangkau\",\"Pekerjaan layak\",\"Inovasi\",\"Keamanan\"],\"correct_answer\":\"Energi bersih dan terjangkau\",\"difficulty\":\"Mudah\",\"explanation\":\"SDG 7 fokus pada akses energi bersih dan terjangkau.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(93, 'quiz', 'SDG 3 berhubungan dengan?', 'Mudah', '{\"question\":\"SDG 3 berhubungan dengan?\",\"options\":[\"Kesehatan\",\"Pendidikan\",\"Air\",\"Iklim\"],\"correct_answer\":\"Kesehatan\",\"difficulty\":\"Mudah\",\"explanation\":\"SDG 3 tentang kehidupan sehat dan sejahtera.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(94, 'quiz', 'Contoh aksi SDG 11 adalah?', 'Sedang', '{\"question\":\"Contoh aksi SDG 11 adalah?\",\"options\":[\"Pilah sampah\",\"Menanam pohon\",\"Belajar\",\"Berhemat energi\"],\"correct_answer\":\"Pilah sampah\",\"difficulty\":\"Sedang\",\"explanation\":\"SDG 11 terkait kota dan permukiman berkelanjutan.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(95, 'quiz', 'SDG yang fokus pada kesetaraan gender adalah?', 'Sedang', '{\"question\":\"SDG yang fokus pada kesetaraan gender adalah?\",\"options\":[\"SDG 5\",\"SDG 8\",\"SDG 2\",\"SDG 12\"],\"correct_answer\":\"SDG 5\",\"difficulty\":\"Sedang\",\"explanation\":\"SDG 5 membahas kesetaraan gender.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(96, 'quiz', 'Mengurangi food waste termasuk SDG?', 'Sedang', '{\"question\":\"Mengurangi food waste termasuk SDG?\",\"options\":[\"SDG 12\",\"SDG 15\",\"SDG 3\",\"SDG 1\"],\"correct_answer\":\"SDG 12\",\"difficulty\":\"Sedang\",\"explanation\":\"Food waste terkait konsumsi dan produksi bertanggung jawab.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(97, 'quiz', 'SDG 14 berfokus pada?', 'Sedang', '{\"question\":\"SDG 14 berfokus pada?\",\"options\":[\"Ekosistem laut\",\"Energi\",\"Pendidikan\",\"Kesetaraan\"],\"correct_answer\":\"Ekosistem laut\",\"difficulty\":\"Sedang\",\"explanation\":\"SDG 14 adalah kehidupan bawah laut.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(98, 'quiz', 'SDG 15 membahas tentang?', 'Sedang', '{\"question\":\"SDG 15 membahas tentang?\",\"options\":[\"Ekosistem darat\",\"Iklim\",\"Kesehatan\",\"Pekerjaan\"],\"correct_answer\":\"Ekosistem darat\",\"difficulty\":\"Sedang\",\"explanation\":\"SDG 15 fokus pada ekosistem darat.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(99, 'quiz', 'SDG 8 berkaitan dengan?', 'Sedang', '{\"question\":\"SDG 8 berkaitan dengan?\",\"options\":[\"Pekerjaan layak dan pertumbuhan ekonomi\",\"Air bersih\",\"Energi\",\"Infrastruktur\"],\"correct_answer\":\"Pekerjaan layak dan pertumbuhan ekonomi\",\"difficulty\":\"Sedang\",\"explanation\":\"SDG 8 menekankan pekerjaan layak dan pertumbuhan ekonomi.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(100, 'quiz', 'SDG 10 bertujuan untuk?', 'Sedang', '{\"question\":\"SDG 10 bertujuan untuk?\",\"options\":[\"Mengurangi kesenjangan\",\"Menghapus kemiskinan\",\"Aksi iklim\",\"Kota berkelanjutan\"],\"correct_answer\":\"Mengurangi kesenjangan\",\"difficulty\":\"Sedang\",\"explanation\":\"SDG 10 tentang mengurangi ketimpangan.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(101, 'quiz', 'SDG 16 membahas tentang?', 'Sulit', '{\"question\":\"SDG 16 membahas tentang?\",\"options\":[\"Perdamaian dan keadilan\",\"Energi\",\"Pendidikan\",\"Kesehatan\"],\"correct_answer\":\"Perdamaian dan keadilan\",\"difficulty\":\"Sulit\",\"explanation\":\"SDG 16 fokus pada perdamaian, keadilan, dan kelembagaan yang kuat.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(102, 'quiz', 'SDG 9 berfokus pada?', 'Sulit', '{\"question\":\"SDG 9 berfokus pada?\",\"options\":[\"Industri, inovasi, dan infrastruktur\",\"Air bersih\",\"Iklim\",\"Kesehatan\"],\"correct_answer\":\"Industri, inovasi, dan infrastruktur\",\"difficulty\":\"Sulit\",\"explanation\":\"SDG 9 tentang industri, inovasi, dan infrastruktur.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(103, 'quiz', 'SDG 2 bertujuan untuk?', 'Sulit', '{\"question\":\"SDG 2 bertujuan untuk?\",\"options\":[\"Tanpa kelaparan\",\"Kehidupan laut\",\"Energi bersih\",\"Kota berkelanjutan\"],\"correct_answer\":\"Tanpa kelaparan\",\"difficulty\":\"Sulit\",\"explanation\":\"SDG 2 adalah tanpa kelaparan.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(104, 'quiz', 'SDG 1 fokus pada?', 'Sulit', '{\"question\":\"SDG 1 fokus pada?\",\"options\":[\"Tanpa kemiskinan\",\"Pendidikan\",\"Air bersih\",\"Kesehatan\"],\"correct_answer\":\"Tanpa kemiskinan\",\"difficulty\":\"Sulit\",\"explanation\":\"SDG 1 adalah tanpa kemiskinan.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(105, 'quiz', 'Contoh aksi SDG 7 yang paling tepat?', 'Sulit', '{\"question\":\"Contoh aksi SDG 7 yang paling tepat?\",\"options\":[\"Mematikan listrik saat tidak digunakan\",\"Menanam pohon\",\"Membaca buku\",\"Membuang sampah\"],\"correct_answer\":\"Mematikan listrik saat tidak digunakan\",\"difficulty\":\"Sulit\",\"explanation\":\"Hemat listrik mendukung energi bersih dan terjangkau.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(106, 'quiz', 'SDG yang terkait konsumsi bertanggung jawab adalah?', 'Sulit', '{\"question\":\"SDG yang terkait konsumsi bertanggung jawab adalah?\",\"options\":[\"SDG 12\",\"SDG 3\",\"SDG 14\",\"SDG 11\"],\"correct_answer\":\"SDG 12\",\"difficulty\":\"Sulit\",\"explanation\":\"SDG 12 adalah konsumsi dan produksi yang bertanggung jawab.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(107, 'quiz', 'Menggunakan transportasi umum mendukung SDG?', 'Sedang', '{\"question\":\"Menggunakan transportasi umum mendukung SDG?\",\"options\":[\"SDG 11\",\"SDG 5\",\"SDG 2\",\"SDG 6\"],\"correct_answer\":\"SDG 11\",\"difficulty\":\"Sedang\",\"explanation\":\"Transportasi umum membantu kota berkelanjutan.\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(108, 'myth_fact', 'Plastik bisa membutuhkan hingga 500 tahun untuk terurai di laut.', NULL, '{\"statement\":\"Plastik bisa membutuhkan hingga 500 tahun untuk terurai di laut.\",\"is_fact\":true,\"image_url\":\"https:\\/\\/lh3.googleusercontent.com\\/aida-public\\/AB6AXuCz_4TXD7jRsuq4r5m1U4h2yq7s_GG_xrTQ0Z7k8kL-0V1c8B9it8e9rjWfVh0tL4xU1mQAEf1B7D0gK_5oKrgyHulWzTqWvVx9NfJm1k8Y9\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(109, 'myth_fact', 'Semua plastik dapat terurai dalam waktu satu tahun.', NULL, '{\"statement\":\"Semua plastik dapat terurai dalam waktu satu tahun.\",\"is_fact\":false,\"image_url\":\"https:\\/\\/lh3.googleusercontent.com\\/aida-public\\/AB6AXuCz_4TXD7jRsuq4r5m1U4h2yq7s_GG_xrTQ0Z7k8kL-0V1c8B9it8e9rjWfVh0tL4xU1mQAEf1B7D0gK_5oKrgyHulWzTqWvVx9NfJm1k8Y9\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(110, 'myth_fact', 'Kaca bisa didaur ulang berulang kali tanpa kehilangan kualitas.', NULL, '{\"statement\":\"Kaca bisa didaur ulang berulang kali tanpa kehilangan kualitas.\",\"is_fact\":true,\"image_url\":\"https:\\/\\/lh3.googleusercontent.com\\/aida-public\\/AB6AXuCz_4TXD7jRsuq4r5m1U4h2yq7s_GG_xrTQ0Z7k8kL-0V1c8B9it8e9rjWfVh0tL4xU1mQAEf1B7D0gK_5oKrgyHulWzTqWvVx9NfJm1k8Y9\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(111, 'myth_fact', 'Semua program daur ulang menerima botol plastik.', NULL, '{\"statement\":\"Semua program daur ulang menerima botol plastik.\",\"is_fact\":false,\"image_url\":\"https:\\/\\/lh3.googleusercontent.com\\/aida-public\\/AB6AXuCz_4TXD7jRsuq4r5m1U4h2yq7s_GG_xrTQ0Z7k8kL-0V1c8B9it8e9rjWfVh0tL4xU1mQAEf1B7D0gK_5oKrgyHulWzTqWvVx9NfJm1k8Y9\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(112, 'myth_fact', 'Sampah elektronik termasuk jenis sampah yang paling cepat meningkat.', NULL, '{\"statement\":\"Sampah elektronik termasuk jenis sampah yang paling cepat meningkat.\",\"is_fact\":true,\"image_url\":\"https:\\/\\/lh3.googleusercontent.com\\/aida-public\\/AB6AXuCz_4TXD7jRsuq4r5m1U4h2yq7s_GG_xrTQ0Z7k8kL-0V1c8B9it8e9rjWfVh0tL4xU1mQAEf1B7D0gK_5oKrgyHulWzTqWvVx9NfJm1k8Y9\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(113, 'myth_fact', 'Kulit pisang membutuhkan ratusan tahun untuk terurai.', NULL, '{\"statement\":\"Kulit pisang membutuhkan ratusan tahun untuk terurai.\",\"is_fact\":false,\"image_url\":\"https:\\/\\/lh3.googleusercontent.com\\/aida-public\\/AB6AXuCz_4TXD7jRsuq4r5m1U4h2yq7s_GG_xrTQ0Z7k8kL-0V1c8B9it8e9rjWfVh0tL4xU1mQAEf1B7D0gK_5oKrgyHulWzTqWvVx9NfJm1k8Y9\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(114, 'myth_fact', 'Mendaur ulang aluminium menghemat jauh lebih banyak energi dibanding membuat yang baru.', NULL, '{\"statement\":\"Mendaur ulang aluminium menghemat jauh lebih banyak energi dibanding membuat yang baru.\",\"is_fact\":true,\"image_url\":\"https:\\/\\/lh3.googleusercontent.com\\/aida-public\\/AB6AXuCz_4TXD7jRsuq4r5m1U4h2yq7s_GG_xrTQ0Z7k8kL-0V1c8B9it8e9rjWfVh0tL4xU1mQAEf1B7D0gK_5oKrgyHulWzTqWvVx9NfJm1k8Y9\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(115, 'trash_sort', 'Botol plastik', NULL, '{\"name\":\"Botol plastik\",\"bin_color\":\"Kuning\",\"category\":\"Plastik\",\"image_key\":\"botolplastik\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(116, 'trash_sort', 'Kantong plastik', NULL, '{\"name\":\"Kantong plastik\",\"bin_color\":\"Kuning\",\"category\":\"Plastik\",\"image_key\":\"kresek\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(117, 'trash_sort', 'Gelas plastik', NULL, '{\"name\":\"Gelas plastik\",\"bin_color\":\"Kuning\",\"category\":\"Plastik\",\"image_key\":\"gelasplastik\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(118, 'trash_sort', 'Baterai', NULL, '{\"name\":\"Baterai\",\"bin_color\":\"Merah\",\"category\":\"B3\",\"image_key\":\"baterai\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(119, 'trash_sort', 'Lampu rusak', NULL, '{\"name\":\"Lampu rusak\",\"bin_color\":\"Merah\",\"category\":\"B3\",\"image_key\":\"lampurusak\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(120, 'trash_sort', 'Kaleng cat', NULL, '{\"name\":\"Kaleng cat\",\"bin_color\":\"Merah\",\"category\":\"B3\",\"image_key\":\"kalengcat\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(121, 'trash_sort', 'Kulit pisang', NULL, '{\"name\":\"Kulit pisang\",\"bin_color\":\"Hijau\",\"category\":\"Organik\",\"image_key\":\"kulitpisang\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(122, 'trash_sort', 'Sisa sayur', NULL, '{\"name\":\"Sisa sayur\",\"bin_color\":\"Hijau\",\"category\":\"Organik\",\"image_key\":\"sayur\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(123, 'trash_sort', 'Daun kering', NULL, '{\"name\":\"Daun kering\",\"bin_color\":\"Hijau\",\"category\":\"Organik\",\"image_key\":\"daunkering\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(124, 'trash_sort', 'Koran bekas', NULL, '{\"name\":\"Koran bekas\",\"bin_color\":\"Biru\",\"category\":\"Kertas\",\"image_key\":\"koran\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(125, 'trash_sort', 'Kardus', NULL, '{\"name\":\"Kardus\",\"bin_color\":\"Biru\",\"category\":\"Kertas\",\"image_key\":\"kardus\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(126, 'trash_sort', 'Buku rusak', NULL, '{\"name\":\"Buku rusak\",\"bin_color\":\"Biru\",\"category\":\"Kertas\",\"image_key\":\"buku\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(127, 'trash_sort', 'Popok sekali pakai', NULL, '{\"name\":\"Popok sekali pakai\",\"bin_color\":\"Abu\",\"category\":\"Residu\",\"image_key\":\"popok\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(128, 'trash_sort', 'Puntung rokok', NULL, '{\"name\":\"Puntung rokok\",\"bin_color\":\"Abu\",\"category\":\"Residu\",\"image_key\":\"puntungrokok\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(129, 'trash_sort', 'Masker sekali pakai', NULL, '{\"name\":\"Masker sekali pakai\",\"bin_color\":\"Abu\",\"category\":\"Residu\",\"image_key\":\"masker\"}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL),
(130, 'match_card', 'Dek Match Card SDG', NULL, '{\"goals\":[{\"goal_number\":1,\"name\":\"Tanpa Kemiskinan\"},{\"goal_number\":2,\"name\":\"Tanpa Kelaparan\"},{\"goal_number\":3,\"name\":\"Kehidupan Sehat dan Sejahtera\"},{\"goal_number\":4,\"name\":\"Pendidikan Berkualitas\"},{\"goal_number\":5,\"name\":\"Kesetaraan Gender\"},{\"goal_number\":6,\"name\":\"Air Bersih dan Sanitasi Layak\"},{\"goal_number\":7,\"name\":\"Energi Bersih dan Terjangkau\"},{\"goal_number\":8,\"name\":\"Pekerjaan Layak dan Pertumbuhan Ekonomi\"},{\"goal_number\":9,\"name\":\"Industri, Inovasi, dan Infrastruktur\"},{\"goal_number\":10,\"name\":\"Berkurangnya Kesenjangan\"},{\"goal_number\":11,\"name\":\"Kota dan Permukiman Berkelanjutan\"},{\"goal_number\":12,\"name\":\"Konsumsi dan Produksi Bertanggung Jawab\"},{\"goal_number\":13,\"name\":\"Penanganan Perubahan Iklim\"},{\"goal_number\":14,\"name\":\"Ekosistem Lautan\"},{\"goal_number\":15,\"name\":\"Ekosistem Daratan\"},{\"goal_number\":16,\"name\":\"Perdamaian, Keadilan, dan Kelembagaan Tangguh\"},{\"goal_number\":17,\"name\":\"Kemitraan untuk Mencapai Tujuan\"}],\"statements\":[{\"id\":1,\"text\":\"Pernyataan: Program bantuan tunai untuk keluarga miskin.\",\"goal_id\":1},{\"id\":2,\"text\":\"Masalah: Akses pendapatan stabil masih rendah di banyak wilayah.\",\"goal_id\":1},{\"id\":3,\"text\":\"Solusi: Perluas program perlindungan sosial dan pelatihan kerja.\",\"goal_id\":1},{\"id\":4,\"text\":\"Pernyataan: Inisiatif pangan lokal untuk mengurangi kelaparan.\",\"goal_id\":2},{\"id\":5,\"text\":\"Masalah: Distribusi pangan belum merata dan harga sering naik.\",\"goal_id\":2},{\"id\":6,\"text\":\"Solusi: Perkuat lumbung pangan komunitas dan rantai pasok lokal.\",\"goal_id\":2},{\"id\":7,\"text\":\"Pernyataan: Kampanye imunisasi dan layanan kesehatan dasar.\",\"goal_id\":3},{\"id\":8,\"text\":\"Masalah: Fasilitas kesehatan di daerah terpencil terbatas.\",\"goal_id\":3},{\"id\":9,\"text\":\"Solusi: Tambah klinik mobile dan tenaga kesehatan desa.\",\"goal_id\":3},{\"id\":10,\"text\":\"Pernyataan: Pembangunan sekolah dan pelatihan guru.\",\"goal_id\":4},{\"id\":11,\"text\":\"Masalah: Kualitas belajar tidak merata di sekolah terpencil.\",\"goal_id\":4},{\"id\":12,\"text\":\"Solusi: Sediakan pelatihan rutin dan akses materi digital.\",\"goal_id\":4},{\"id\":13,\"text\":\"Pernyataan: Kebijakan upah setara untuk perempuan.\",\"goal_id\":5},{\"id\":14,\"text\":\"Masalah: Kesenjangan upah dan peluang karier masih tinggi.\",\"goal_id\":5},{\"id\":15,\"text\":\"Solusi: Terapkan audit upah dan kebijakan anti diskriminasi.\",\"goal_id\":5},{\"id\":16,\"text\":\"Pernyataan: Penyediaan air bersih dan toilet layak.\",\"goal_id\":6},{\"id\":17,\"text\":\"Masalah: Sumber air bersih belum tersedia di semua desa.\",\"goal_id\":6},{\"id\":18,\"text\":\"Solusi: Bangun infrastruktur air dan sanitasi berbasis komunitas.\",\"goal_id\":6},{\"id\":19,\"text\":\"Pernyataan: Pengembangan energi surya untuk desa.\",\"goal_id\":7},{\"id\":20,\"text\":\"Masalah: Akses listrik stabil masih terbatas di wilayah terpencil.\",\"goal_id\":7},{\"id\":21,\"text\":\"Solusi: Perluas energi terbarukan dan mikrogrid desa.\",\"goal_id\":7},{\"id\":22,\"text\":\"Pernyataan: Pelatihan keterampilan kerja bagi pemuda.\",\"goal_id\":8},{\"id\":23,\"text\":\"Masalah: Pengangguran muda masih tinggi di beberapa daerah.\",\"goal_id\":8},{\"id\":24,\"text\":\"Solusi: Perkuat pelatihan vokasi dan kemitraan industri lokal.\",\"goal_id\":8},{\"id\":25,\"text\":\"Pernyataan: Pembangunan jaringan transportasi dan inovasi teknologi.\",\"goal_id\":9},{\"id\":26,\"text\":\"Masalah: Infrastruktur dan riset belum merata antar daerah.\",\"goal_id\":9},{\"id\":27,\"text\":\"Solusi: Investasi infrastruktur dan dukung pusat inovasi regional.\",\"goal_id\":9},{\"id\":28,\"text\":\"Pernyataan: Program inklusi untuk kelompok rentan.\",\"goal_id\":10},{\"id\":29,\"text\":\"Masalah: Kelompok rentan sering terpinggirkan dari layanan publik.\",\"goal_id\":10},{\"id\":30,\"text\":\"Solusi: Perluas akses pendidikan, kesehatan, dan layanan keuangan.\",\"goal_id\":10},{\"id\":31,\"text\":\"Pernyataan: Transportasi publik yang ramah lingkungan.\",\"goal_id\":11},{\"id\":32,\"text\":\"Masalah: Kemacetan dan polusi udara meningkat di kota besar.\",\"goal_id\":11},{\"id\":33,\"text\":\"Solusi: Kembangkan transportasi massal dan ruang hijau kota.\",\"goal_id\":11},{\"id\":34,\"text\":\"Pernyataan: Pengurangan sampah plastik sekali pakai.\",\"goal_id\":12},{\"id\":35,\"text\":\"Masalah: Sampah sulit terurai masih mendominasi TPA.\",\"goal_id\":12},{\"id\":36,\"text\":\"Solusi: Dorong pemilahan sampah dan penggunaan ulang.\",\"goal_id\":12},{\"id\":37,\"text\":\"Pernyataan: Aksi pengurangan emisi karbon.\",\"goal_id\":13},{\"id\":38,\"text\":\"Masalah: Emisi dari transportasi dan industri terus naik.\",\"goal_id\":13},{\"id\":39,\"text\":\"Solusi: Percepat transisi energi bersih dan efisiensi energi.\",\"goal_id\":13},{\"id\":40,\"text\":\"Pernyataan: Perlindungan terumbu karang dan laut.\",\"goal_id\":14},{\"id\":41,\"text\":\"Masalah: Pencemaran laut dan penangkapan berlebih merusak ekosistem.\",\"goal_id\":14},{\"id\":42,\"text\":\"Solusi: Terapkan kawasan konservasi dan pengawasan penangkapan.\",\"goal_id\":14},{\"id\":43,\"text\":\"Pernyataan: Rehabilitasi hutan dan konservasi satwa.\",\"goal_id\":15},{\"id\":44,\"text\":\"Masalah: Deforestasi dan kebakaran hutan mengurangi keanekaragaman hayati.\",\"goal_id\":15},{\"id\":45,\"text\":\"Solusi: Perkuat restorasi hutan dan patroli kawasan lindung.\",\"goal_id\":15},{\"id\":46,\"text\":\"Pernyataan: Transparansi hukum dan akses keadilan.\",\"goal_id\":16},{\"id\":47,\"text\":\"Masalah: Kepercayaan publik menurun karena proses hukum lambat.\",\"goal_id\":16},{\"id\":48,\"text\":\"Solusi: Perbaiki layanan hukum dan tingkatkan transparansi proses.\",\"goal_id\":16},{\"id\":49,\"text\":\"Pernyataan: Kerja sama global untuk pendanaan SDGs.\",\"goal_id\":17},{\"id\":50,\"text\":\"Masalah: Kesenjangan pendanaan menghambat program pembangunan.\",\"goal_id\":17},{\"id\":51,\"text\":\"Solusi: Perkuat kemitraan dan skema pendanaan lintas sektor.\",\"goal_id\":17}]}', 1, NULL, NULL, '2026-09-14 22:30:07', '2026-09-14 22:30:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `game_sessions`
--

CREATE TABLE `game_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `game_type` varchar(40) NOT NULL,
  `session_id` varchar(120) NOT NULL,
  `difficulty` varchar(30) DEFAULT NULL,
  `score` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `correct_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `total_questions` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `duration_seconds` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`answers`)),
  `validation_status` varchar(30) NOT NULL DEFAULT 'accepted',
  `validation_reason` varchar(255) DEFAULT NULL,
  `coins_awarded` int(10) UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(1, 'default', '{\"uuid\":\"bacf382e-dd8f-491a-a405-1b2e25aa8279\",\"displayName\":\"App\\\\Domains\\\\Identity\\\\Auth\\\\Infrastructure\\\\Mail\\\\EmailVerificationMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":19:{s:8:\\\"mailable\\\";O:67:\\\"App\\\\Domains\\\\Identity\\\\Auth\\\\Infrastructure\\\\Mail\\\\EmailVerificationMail\\\":4:{s:4:\\\"code\\\";s:6:\\\"853320\\\";s:14:\\\"expiresMinutes\\\";i:10;s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"akbarfahlevy39@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:3:\\\"job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:13:\\\"debounceOwner\\\";s:0:\\\"\\\";s:15:\\\"uniqueLockOwner\\\";s:0:\\\"\\\";s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\",\"batchId\":null},\"createdAt\":1789628470,\"delay\":null}', 0, NULL, 1789628470, 1789628470),
(2, 'default', '{\"uuid\":\"912e3642-7bc6-42d0-b12f-87adfcd09d9d\",\"displayName\":\"App\\\\Domains\\\\Identity\\\\Auth\\\\Infrastructure\\\\Mail\\\\EmailVerificationMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":19:{s:8:\\\"mailable\\\";O:67:\\\"App\\\\Domains\\\\Identity\\\\Auth\\\\Infrastructure\\\\Mail\\\\EmailVerificationMail\\\":4:{s:4:\\\"code\\\";s:6:\\\"128939\\\";s:14:\\\"expiresMinutes\\\";i:10;s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:24:\\\"akbarfahlevy39@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:3:\\\"job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:13:\\\"debounceOwner\\\";s:0:\\\"\\\";s:15:\\\"uniqueLockOwner\\\";s:0:\\\"\\\";s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\",\"batchId\":null},\"createdAt\":1789628553,\"delay\":null}', 0, NULL, 1789628553, 1789628553),
(3, 'default', '{\"uuid\":\"cd67f8e0-385b-48ba-933b-b6df4d60a391\",\"displayName\":\"App\\\\Domains\\\\Identity\\\\Auth\\\\Infrastructure\\\\Mail\\\\EmailVerificationMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":19:{s:8:\\\"mailable\\\";O:67:\\\"App\\\\Domains\\\\Identity\\\\Auth\\\\Infrastructure\\\\Mail\\\\EmailVerificationMail\\\":4:{s:4:\\\"code\\\";s:6:\\\"877409\\\";s:14:\\\"expiresMinutes\\\";i:10;s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:35:\\\"mochammad.rachman112@smk.belajar.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:3:\\\"job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:13:\\\"debounceOwner\\\";s:0:\\\"\\\";s:15:\\\"uniqueLockOwner\\\";s:0:\\\"\\\";s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\",\"batchId\":null},\"createdAt\":1792374633,\"delay\":null}', 0, NULL, 1792374633, 1792374633),
(4, 'default', '{\"uuid\":\"8ec06198-760c-4ce9-9179-6a2d19886ed6\",\"displayName\":\"App\\\\Domains\\\\Identity\\\\Auth\\\\Infrastructure\\\\Mail\\\\EmailVerificationMail\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":19:{s:8:\\\"mailable\\\";O:67:\\\"App\\\\Domains\\\\Identity\\\\Auth\\\\Infrastructure\\\\Mail\\\\EmailVerificationMail\\\":4:{s:4:\\\"code\\\";s:6:\\\"939614\\\";s:14:\\\"expiresMinutes\\\";i:10;s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:35:\\\"mochammad.rachman112@smk.belajar.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:3:\\\"job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:13:\\\"debounceOwner\\\";s:0:\\\"\\\";s:15:\\\"uniqueLockOwner\\\";s:0:\\\"\\\";s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\",\"batchId\":null},\"createdAt\":1792374705,\"delay\":null}', 0, NULL, 1792374705, 1792374705);

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_framework_tables', 1),
(2, '2026_07_23_000100_create_identity_tables', 1),
(3, '2026_07_23_000200_create_seller_tables', 1),
(4, '2026_07_23_000300_create_catalog_tables', 1),
(5, '2026_07_23_000400_create_marketing_tables', 1),
(6, '2026_07_23_000500_create_commerce_tables', 1),
(7, '2026_07_30_000001_add_catalog_product_query_indexes', 1),
(8, '2026_07_31_000002_add_product_table_header_indexes', 1),
(9, '2026_08_03_100000_add_advanced_marketplace_features', 1),
(10, '2026_08_08_120000_create_admin_notifications_table', 1),
(11, '2026_08_08_130000_rename_ticket_display_to_help', 1),
(12, '2026_08_13_130000_add_installment_inventory_costing', 1),
(13, '2026_08_15_100000_ensure_inventory_finance_costing_tables', 1),
(14, '2026_08_15_130000_add_raw_material_cost_hpp_reports', 1),
(15, '2026_08_25_100000_create_commission_system_tables', 1),
(16, '2026_08_25_110000_create_schedules_table', 1),
(17, '2026_08_25_120000_add_performance_indexes', 1),
(18, '2026_08_28_100000_create_ppob_tables', 1),
(19, '2026_08_28_110000_create_game_sessions_table', 1),
(20, '2026_08_30_111456_add_payment_to_ppob_transactions_table', 1),
(21, '2026_08_31_000100_add_voucher_terms_columns', 1),
(22, '2026_08_31_000200_add_has_set_password_to_users_table', 1),
(23, '2026_08_31_000300_add_po_stock_to_product_variants', 1),
(24, '2026_09_01_000001_add_payment_columns_to_ppob_transactions', 1),
(25, '2026_09_01_000002_create_receipts_table', 1),
(26, '2026_09_12_000000_add_kanban_to_schedules_table', 1),
(27, '2026_09_12_000001_booking_schedule_and_stock_ledger', 1),
(28, '2026_09_14_000001_add_min_stock_to_product_variants', 1),
(29, '2026_09_15_000000_create_game_contents_table', 2),
(30, '2026_09_15_000100_add_store_type_and_discount_columns', 3),
(31, '2026_09_19_000000_add_thumbnail_to_order_items_table', 4),
(32, '2026_09_19_000100_backfill_order_items_thumbnail', 5),
(33, '2026_09_21_000000_create_seller_customers_table', 6),
(34, '2026_09_23_000000_add_recurrence_to_schedules_table', 7),
(35, '2026_09_27_000000_create_code_patterns_table', 8);

-- --------------------------------------------------------

--
-- Table structure for table `missions`
--

CREATE TABLE `missions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `voucher_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(160) NOT NULL,
  `code` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `event_type` varchar(80) NOT NULL,
  `target_value` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `conditions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`conditions`)),
  `starts_at` timestamp NOT NULL,
  `ends_at` timestamp NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `missions`
--

INSERT INTO `missions` (`id`, `voucher_id`, `name`, `code`, `description`, `event_type`, `target_value`, `conditions`, `starts_at`, `ends_at`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, 'Misi Order Pertama', 'MISI-ORDER-1', 'Selesaikan 1 transaksi dalam 30 hari.', 'order_completed', 1, '{\"minimum_order_value\":0}', '2026-07-16 00:59:45', '2026-11-13 00:59:45', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(2, NULL, 'Pembeli Aktif', 'MISI-ORDER-5', 'Selesaikan 5 transaksi dalam 30 hari.', 'order_completed', 5, '{\"minimum_order_value\":0}', '2026-07-16 00:59:45', '2026-11-13 00:59:45', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(3, NULL, 'Periset Handal', 'MISI-REVIEW-3', 'Tulis 3 ulasan untuk pesanan yang sudah selesai.', 'review_submitted', 3, '{\"minimum_order_value\":0}', '2026-07-16 00:59:45', '2026-11-13 00:59:45', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(4, NULL, 'Kolektor Wishlist', 'MISI-WISHLIST-10', 'Simpan 10 produk ke wishlist favoritmu.', 'wishlist_added', 10, '{\"minimum_order_value\":0}', '2026-07-16 00:59:45', '2026-11-13 00:59:45', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(5, NULL, 'Main Game 3x Hari Ini', 'DAILY_20260915_PLAY_3', 'Mainkan game edukasi mana pun sebanyak 3 kali hari ini.', 'game_completed', 3, NULL, '2026-09-14 16:59:00', '2026-09-15 17:01:00', 1, NULL, NULL, '2026-09-14 21:36:57', '2026-09-14 21:36:57', NULL),
(6, NULL, 'Selesaikan 1 Kuis SDG', 'DAILY_20260915_QUIZ', 'Selesaikan satu sesi Kuis SDG sampai tuntas.', 'quiz_completed', 1, NULL, '2026-09-14 16:59:00', '2026-09-15 17:01:00', 1, NULL, NULL, '2026-09-14 21:36:57', '2026-09-14 21:36:57', NULL),
(7, NULL, 'Selesaikan 1 Trash Sort', 'DAILY_20260915_TRASH', 'Selesaikan satu sesi permainan pilah sampah.', 'trash_sort_completed', 1, NULL, '2026-09-14 16:59:00', '2026-09-15 17:01:00', 1, NULL, NULL, '2026-09-14 21:36:57', '2026-09-14 21:36:57', NULL),
(8, NULL, 'Pasangkan 1 Kartu SDG', 'DAILY_20260915_MATCH', 'Selesaikan satu sesi Match Card SDG.', 'match_card_completed', 1, NULL, '2026-09-14 16:59:00', '2026-09-15 17:01:00', 1, NULL, NULL, '2026-09-14 21:36:57', '2026-09-14 21:36:57', NULL),
(9, NULL, 'Tantangan Game Tervalidasi', 'DAILY_20260915_VERIFIED', 'Selesaikan satu permainan tervalidasi server (Arithmetic Kilat atau Sudoku).', 'game.*', 1, NULL, '2026-09-14 16:59:00', '2026-09-15 17:01:00', 1, NULL, NULL, '2026-09-14 21:36:57', '2026-09-14 21:36:57', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mission_user_progress`
--

CREATE TABLE `mission_user_progress` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `mission_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `progress_value` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'in_progress',
  `completed_at` timestamp NULL DEFAULT NULL,
  `rewarded_at` timestamp NULL DEFAULT NULL,
  `reward_voucher_id` bigint(20) UNSIGNED DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mission_user_progress`
--

INSERT INTO `mission_user_progress` (`id`, `mission_id`, `user_id`, `progress_value`, `status`, `completed_at`, `rewarded_at`, `reward_voucher_id`, `metadata`, `created_at`, `updated_at`) VALUES
(1, 1, '00000000-0000-4000-8000-000000000201', 1, 'completed', '2026-08-30 00:59:45', '2026-09-05 00:59:45', 1, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(2, 2, '00000000-0000-4000-8000-000000000201', 1, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(3, 3, '00000000-0000-4000-8000-000000000201', 1, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(4, 4, '00000000-0000-4000-8000-000000000201', 1, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(5, 1, '00000000-0000-4000-8000-000000000202', 1, 'completed', '2026-09-11 00:59:45', '2026-09-10 00:59:45', 1, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(6, 2, '00000000-0000-4000-8000-000000000202', 5, 'completed', '2026-09-13 00:59:45', '2026-09-13 00:59:45', NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(7, 3, '00000000-0000-4000-8000-000000000202', 3, 'completed', '2026-08-31 00:59:45', '2026-09-10 00:59:45', NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(8, 4, '00000000-0000-4000-8000-000000000202', 10, 'completed', '2026-09-08 00:59:45', '2026-09-11 00:59:45', NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(9, 1, '00000000-0000-4000-8000-000000000203', 1, 'completed', '2026-09-03 00:59:45', '2026-09-09 00:59:45', 1, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(10, 2, '00000000-0000-4000-8000-000000000203', 0, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(11, 3, '00000000-0000-4000-8000-000000000203', 3, 'completed', '2026-09-11 00:59:45', '2026-09-04 00:59:45', NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(12, 4, '00000000-0000-4000-8000-000000000203', 9, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(13, 1, '00000000-0000-4000-8000-000000000204', 0, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(14, 2, '00000000-0000-4000-8000-000000000204', 0, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(15, 3, '00000000-0000-4000-8000-000000000204', 3, 'completed', '2026-09-13 00:59:45', '2026-09-07 00:59:45', NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(16, 4, '00000000-0000-4000-8000-000000000204', 0, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(17, 1, '00000000-0000-4000-8000-000000000205', 0, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(18, 2, '00000000-0000-4000-8000-000000000205', 2, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(19, 3, '00000000-0000-4000-8000-000000000205', 1, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(20, 4, '00000000-0000-4000-8000-000000000205', 5, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(21, 1, '00000000-0000-4000-8000-000000000206', 1, 'completed', '2026-09-08 00:59:45', '2026-09-08 00:59:45', 1, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(22, 2, '00000000-0000-4000-8000-000000000206', 5, 'completed', '2026-09-10 00:59:45', '2026-09-06 00:59:45', NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(23, 3, '00000000-0000-4000-8000-000000000206', 1, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(24, 4, '00000000-0000-4000-8000-000000000206', 8, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(25, 1, '00000000-0000-4000-8000-000000000207', 1, 'completed', '2026-09-01 00:59:45', '2026-09-09 00:59:45', 1, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(26, 2, '00000000-0000-4000-8000-000000000207', 4, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(27, 3, '00000000-0000-4000-8000-000000000207', 3, 'completed', '2026-09-11 00:59:45', '2026-09-04 00:59:45', NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(28, 4, '00000000-0000-4000-8000-000000000207', 6, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(29, 1, '00000000-0000-4000-8000-000000000208', 1, 'completed', '2026-09-02 00:59:45', '2026-09-09 00:59:45', 1, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(30, 2, '00000000-0000-4000-8000-000000000208', 0, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(31, 3, '00000000-0000-4000-8000-000000000208', 1, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(32, 4, '00000000-0000-4000-8000-000000000208', 10, 'completed', '2026-09-04 00:59:45', '2026-09-09 00:59:45', NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(33, 1, '00000000-0000-4000-8000-000000000209', 0, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(34, 2, '00000000-0000-4000-8000-000000000209', 1, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(35, 3, '00000000-0000-4000-8000-000000000209', 2, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(36, 4, '00000000-0000-4000-8000-000000000209', 4, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(37, 1, '00000000-0000-4000-8000-000000000210', 1, 'completed', '2026-09-03 00:59:45', '2026-09-06 00:59:45', 1, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(38, 2, '00000000-0000-4000-8000-000000000210', 1, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(39, 3, '00000000-0000-4000-8000-000000000210', 0, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(40, 4, '00000000-0000-4000-8000-000000000210', 3, 'in_progress', NULL, NULL, NULL, '{\"progress_at\":\"2026-09-14 07:59:45\"}', '2026-09-14 00:59:44', '2026-09-14 00:59:44');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_number` varchar(100) NOT NULL,
  `order_type` varchar(30) NOT NULL DEFAULT 'normal',
  `preorder_release_at` timestamp NULL DEFAULT NULL,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `received_at` timestamp NULL DEFAULT NULL,
  `user_id` char(36) NOT NULL,
  `voucher_id` bigint(20) UNSIGNED DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `shipping_discount_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `admin_fee` decimal(15,2) NOT NULL DEFAULT 0.00,
  `seller_net` decimal(15,2) NOT NULL DEFAULT 0.00,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `payment_status` varchar(50) NOT NULL DEFAULT 'unpaid',
  `payment_method` varchar(100) DEFAULT NULL,
  `midtrans_snap_token` varchar(255) DEFAULT NULL,
  `shipping_address` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `order_type`, `preorder_release_at`, `scheduled_at`, `received_at`, `user_id`, `voucher_id`, `total_amount`, `discount_amount`, `shipping_discount_amount`, `admin_fee`, `seller_net`, `status`, `payment_status`, `payment_method`, `midtrans_snap_token`, `shipping_address`, `created_at`, `updated_at`) VALUES
(1, 'INV-10000', 'normal', NULL, NULL, '2026-07-03 08:01:50', '00000000-0000-4000-8000-000000000203', 3, 93800.00, 9200.00, 0.00, 2300.00, 91500.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10000', '{\"recipient\": \"Rizky Ramadhan\", \"address\": \"Jl. Margonda Raya No. 77, Beji, Depok, 16423\", \"phone\": \"081200111003\"}', '2026-06-28 08:01:50', '2026-07-01 08:01:50'),
(2, 'INV-10001', 'normal', NULL, NULL, '2026-08-13 23:54:50', '00000000-0000-4000-8000-000000000205', NULL, 468000.00, 0.00, 0.00, 11450.00, 456550.00, 'completed', 'settled', 'midtrans', 'demo-snap-INV-10001', '{\"recipient\": \"Fajar Nugraha\", \"address\": \"Jl. Ir. H. Juanda No. 56, Coblong, Bandung, 40135\", \"phone\": \"081200111005\"}', '2026-08-10 23:54:50', '2026-08-12 23:54:50'),
(3, 'INV-10002', 'normal', NULL, NULL, '2026-08-12 09:47:50', '00000000-0000-4000-8000-000000000203', NULL, 340000.00, 0.00, 0.00, 8250.00, 331750.00, 'completed', 'settled', 'qris', 'demo-snap-INV-10002', '{\"recipient\": \"Rizky Ramadhan\", \"address\": \"Jl. Margonda Raya No. 77, Beji, Depok, 16423\", \"phone\": \"081200111003\"}', '2026-08-10 09:47:50', '2026-08-13 09:47:50'),
(4, 'INV-10003', 'normal', NULL, NULL, '2026-08-31 12:51:50', '00000000-0000-4000-8000-000000000210', NULL, 196000.00, 0.00, 0.00, 4900.00, 191100.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10003', '{\"recipient\": \"Nadia Salsabila\", \"address\": \"Jl. Ijen No. 9, Klojen, Malang, 65116\", \"phone\": \"081200111010\"}', '2026-08-28 12:51:50', '2026-08-30 12:51:50'),
(5, 'INV-10004', 'normal', NULL, NULL, '2026-09-11 04:21:50', '00000000-0000-4000-8000-000000000202', NULL, 333000.00, 0.00, 0.00, 7950.00, 325050.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10004', '{\"recipient\": \"Dewi Lestari\", \"address\": \"Jl. Salemba Raya No. 45, Matraman, Jakarta Timur, 13140\", \"phone\": \"081200111002\"}', '2026-09-06 04:21:50', '2026-09-08 04:21:50'),
(6, 'INV-10005', 'normal', NULL, NULL, '2026-06-01 13:47:50', '00000000-0000-4000-8000-000000000202', NULL, 36000.00, 0.00, 0.00, 900.00, 35100.00, 'completed', 'settled', 'midtrans', 'demo-snap-INV-10005', '{\"recipient\": \"Dewi Lestari\", \"address\": \"Jl. Salemba Raya No. 45, Matraman, Jakarta Timur, 13140\", \"phone\": \"081200111002\"}', '2026-05-30 13:47:50', '2026-06-01 13:47:50'),
(7, 'INV-10006', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000202', NULL, 364000.00, 0.00, 0.00, 8725.00, 355275.00, 'shipped', 'paid', 'midtrans', 'demo-snap-INV-10006', '{\"recipient\": \"Dewi Lestari\", \"address\": \"Jl. Salemba Raya No. 45, Matraman, Jakarta Timur, 13140\", \"phone\": \"081200111002\"}', '2026-09-02 12:38:50', '2026-09-04 12:38:50'),
(8, 'INV-10007', 'normal', NULL, NULL, '2026-08-07 11:34:50', '00000000-0000-4000-8000-000000000203', NULL, 102000.00, 0.00, 0.00, 2250.00, 99750.00, 'completed', 'settled', 'midtrans', 'demo-snap-INV-10007', '{\"recipient\": \"Rizky Ramadhan\", \"address\": \"Jl. Margonda Raya No. 77, Beji, Depok, 16423\", \"phone\": \"081200111003\"}', '2026-08-04 11:34:50', '2026-08-07 11:34:50'),
(9, 'INV-10008', 'normal', NULL, NULL, '2026-05-29 16:41:50', '00000000-0000-4000-8000-000000000203', NULL, 121000.00, 0.00, 0.00, 2725.00, 118275.00, 'completed', 'settled', 'midtrans', 'demo-snap-INV-10008', '{\"recipient\": \"Rizky Ramadhan\", \"address\": \"Jl. Margonda Raya No. 77, Beji, Depok, 16423\", \"phone\": \"081200111003\"}', '2026-05-26 16:41:50', '2026-05-26 16:41:50'),
(10, 'INV-10009', 'normal', NULL, NULL, '2026-06-15 14:34:50', '00000000-0000-4000-8000-000000000205', 1, 341000.00, 15000.00, 0.00, 8650.00, 332350.00, 'completed', 'settled', 'qris', 'demo-snap-INV-10009', '{\"recipient\": \"Fajar Nugraha\", \"address\": \"Jl. Ir. H. Juanda No. 56, Coblong, Bandung, 40135\", \"phone\": \"081200111005\"}', '2026-06-13 14:34:50', '2026-06-13 14:34:50'),
(11, 'INV-10010', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000204', NULL, 104000.00, 0.00, 0.00, 2250.00, 101750.00, 'pending', 'unpaid', NULL, NULL, '{\"recipient\": \"Putri Ayu Anindya\", \"address\": \"Jl. Siliwangi No. 23, Bogor Tengah, Bogor, 16121\", \"phone\": \"081200111004\"}', '2026-07-17 23:47:50', '2026-07-17 23:47:50'),
(12, 'INV-10011', 'normal', NULL, NULL, '2026-08-18 04:39:50', '00000000-0000-4000-8000-000000000202', NULL, 253000.00, 0.00, 0.00, 6050.00, 246950.00, 'completed', 'settled', 'transfer_bank', 'demo-snap-INV-10011', '{\"recipient\": \"Dewi Lestari\", \"address\": \"Jl. Salemba Raya No. 45, Matraman, Jakarta Timur, 13140\", \"phone\": \"081200111002\"}', '2026-08-16 04:39:50', '2026-08-18 04:39:50'),
(13, 'INV-10012', 'normal', NULL, NULL, '2026-07-11 05:29:50', '00000000-0000-4000-8000-000000000207', NULL, 623000.00, 0.00, 0.00, 15575.00, 607425.00, 'completed', 'settled', 'transfer_bank', 'demo-snap-INV-10012', '{\"recipient\": \"Dimas Aditya\", \"address\": \"Jl. Pemuda No. 150, Semarang Tengah, Semarang, 50135\", \"phone\": \"081200111007\"}', '2026-07-08 05:29:50', '2026-07-10 05:29:50'),
(14, 'INV-10013', 'normal', NULL, NULL, '2026-07-31 22:48:50', '00000000-0000-4000-8000-000000000206', NULL, 43000.00, 0.00, 0.00, 800.00, 42200.00, 'completed', 'settled', 'qris', 'demo-snap-INV-10013', '{\"recipient\": \"Salsa Nadia Putri\", \"address\": \"Boulevard Raya No. 101, Kelapa Gading, Jakarta Utara, 14240\", \"phone\": \"081200111006\"}', '2026-07-28 22:48:50', '2026-07-29 22:48:50'),
(15, 'INV-10014', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000207', NULL, 95000.00, 0.00, 0.00, 2000.00, 93000.00, 'processing', 'paid', 'qris', 'demo-snap-INV-10014', '{\"recipient\": \"Dimas Aditya\", \"address\": \"Jl. Pemuda No. 150, Semarang Tengah, Semarang, 50135\", \"phone\": \"081200111007\"}', '2026-08-12 01:45:50', '2026-08-14 01:45:50'),
(16, 'INV-10015', 'normal', NULL, NULL, '2026-06-17 04:57:50', '00000000-0000-4000-8000-000000000205', NULL, 179000.00, 0.00, 0.00, 4200.00, 174800.00, 'completed', 'settled', 'transfer_bank', 'demo-snap-INV-10015', '{\"recipient\": \"Fajar Nugraha\", \"address\": \"Jl. Ir. H. Juanda No. 56, Coblong, Bandung, 40135\", \"phone\": \"081200111005\"}', '2026-06-12 04:57:50', '2026-06-12 04:57:50'),
(17, 'INV-10016', 'normal', NULL, NULL, '2026-06-20 18:56:50', '00000000-0000-4000-8000-000000000201', NULL, 69000.00, 0.00, 0.00, 1450.00, 67550.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10016', '{\"recipient\": \"Angga Firmansyah\", \"address\": \"Jl. Senayan Raya No. 12, Kebayoran Baru, Jakarta Selatan, 12190\", \"phone\": \"081200111001\"}', '2026-06-16 18:56:50', '2026-06-17 18:56:50'),
(18, 'INV-10017', 'normal', NULL, NULL, '2026-06-16 13:01:50', '00000000-0000-4000-8000-000000000203', NULL, 1348000.00, 0.00, 0.00, 33375.00, 1314625.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10017', '{\"recipient\": \"Rizky Ramadhan\", \"address\": \"Jl. Margonda Raya No. 77, Beji, Depok, 16423\", \"phone\": \"081200111003\"}', '2026-06-12 13:01:50', '2026-06-13 13:01:50'),
(19, 'INV-10018', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000205', 1, 39000.00, 3000.00, 0.00, 750.00, 38250.00, 'processing', 'paid', 'transfer_bank', 'demo-snap-INV-10018', '{\"recipient\": \"Fajar Nugraha\", \"address\": \"Jl. Ir. H. Juanda No. 56, Coblong, Bandung, 40135\", \"phone\": \"081200111005\"}', '2026-08-06 12:45:50', '2026-08-09 12:45:50'),
(20, 'INV-10019', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000203', NULL, 138000.00, 0.00, 0.00, 3150.00, 134850.00, 'processing', 'paid', 'transfer_bank', 'demo-snap-INV-10019', '{\"recipient\": \"Rizky Ramadhan\", \"address\": \"Jl. Margonda Raya No. 77, Beji, Depok, 16423\", \"phone\": \"081200111003\"}', '2026-07-10 09:47:50', '2026-07-10 09:47:50'),
(21, 'INV-10020', 'normal', NULL, NULL, '2026-06-18 18:13:50', '00000000-0000-4000-8000-000000000208', NULL, 279000.00, 0.00, 0.00, 6700.00, 272300.00, 'completed', 'settled', 'qris', 'demo-snap-INV-10020', '{\"recipient\": \"Intan Permata\", \"address\": \"Jl. Kaliurang KM 4.5, Depok, Sleman, 55281\", \"phone\": \"081200111008\"}', '2026-06-16 18:13:50', '2026-06-16 18:13:50'),
(22, 'INV-10021', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000206', NULL, 119000.00, 0.00, 0.00, 2700.00, 116300.00, 'pending', 'unpaid', NULL, NULL, '{\"recipient\": \"Salsa Nadia Putri\", \"address\": \"Boulevard Raya No. 101, Kelapa Gading, Jakarta Utara, 14240\", \"phone\": \"081200111006\"}', '2026-07-10 21:33:50', '2026-07-10 21:33:50'),
(23, 'INV-10022', 'normal', NULL, NULL, '2026-08-10 21:20:50', '00000000-0000-4000-8000-000000000203', NULL, 211000.00, 0.00, 0.00, 5000.00, 206000.00, 'completed', 'settled', 'qris', 'demo-snap-INV-10022', '{\"recipient\": \"Rizky Ramadhan\", \"address\": \"Jl. Margonda Raya No. 77, Beji, Depok, 16423\", \"phone\": \"081200111003\"}', '2026-08-08 21:20:50', '2026-08-09 21:20:50'),
(24, 'INV-10023', 'normal', NULL, NULL, '2026-08-20 00:58:50', '00000000-0000-4000-8000-000000000209', NULL, 456000.00, 0.00, 0.00, 11400.00, 444600.00, 'completed', 'settled', 'transfer_bank', 'demo-snap-INV-10023', '{\"recipient\": \"Galih Prakoso\", \"address\": \"Jl. Pemuda No. 88, Genteng, Surabaya, 60275\", \"phone\": \"081200111009\"}', '2026-08-16 00:58:50', '2026-08-18 00:58:50'),
(25, 'INV-10024', 'normal', NULL, NULL, '2026-09-08 14:44:50', '00000000-0000-4000-8000-000000000209', NULL, 126000.00, 0.00, 0.00, 3150.00, 122850.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10024', '{\"recipient\": \"Galih Prakoso\", \"address\": \"Jl. Pemuda No. 88, Genteng, Surabaya, 60275\", \"phone\": \"081200111009\"}', '2026-09-03 14:44:50', '2026-09-05 14:44:50'),
(26, 'INV-10025', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000201', NULL, 1830000.00, 0.00, 0.00, 45375.00, 1784625.00, 'cancelled', 'unpaid', NULL, NULL, '{\"recipient\": \"Angga Firmansyah\", \"address\": \"Jl. Senayan Raya No. 12, Kebayoran Baru, Jakarta Selatan, 12190\", \"phone\": \"081200111001\"}', '2026-05-30 09:07:50', '2026-05-30 09:07:50'),
(27, 'INV-10026', 'normal', NULL, NULL, '2026-06-13 16:37:50', '00000000-0000-4000-8000-000000000207', NULL, 129000.00, 0.00, 0.00, 2925.00, 126075.00, 'completed', 'settled', 'qris', 'demo-snap-INV-10026', '{\"recipient\": \"Dimas Aditya\", \"address\": \"Jl. Pemuda No. 150, Semarang Tengah, Semarang, 50135\", \"phone\": \"081200111007\"}', '2026-06-10 16:37:50', '2026-06-11 16:37:50'),
(28, 'INV-10027', 'normal', NULL, NULL, '2026-07-27 10:05:50', '00000000-0000-4000-8000-000000000203', 2, 165000.00, 15000.00, 0.00, 4250.00, 160750.00, 'completed', 'settled', 'qris', 'demo-snap-INV-10027', '{\"recipient\": \"Rizky Ramadhan\", \"address\": \"Jl. Margonda Raya No. 77, Beji, Depok, 16423\", \"phone\": \"081200111003\"}', '2026-07-25 10:05:50', '2026-07-28 10:05:50'),
(29, 'INV-10028', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000210', NULL, 508000.00, 0.00, 0.00, 12375.00, 495625.00, 'shipped', 'paid', 'e_wallet', 'demo-snap-INV-10028', '{\"recipient\": \"Nadia Salsabila\", \"address\": \"Jl. Ijen No. 9, Klojen, Malang, 65116\", \"phone\": \"081200111010\"}', '2026-08-20 15:28:50', '2026-08-22 15:28:50'),
(30, 'INV-10029', 'normal', NULL, NULL, '2026-05-23 04:03:50', '00000000-0000-4000-8000-000000000203', NULL, 220000.00, 0.00, 0.00, 5200.00, 214800.00, 'completed', 'settled', 'transfer_bank', 'demo-snap-INV-10029', '{\"recipient\": \"Rizky Ramadhan\", \"address\": \"Jl. Margonda Raya No. 77, Beji, Depok, 16423\", \"phone\": \"081200111003\"}', '2026-05-21 04:03:50', '2026-05-21 04:03:50'),
(31, 'INV-10030', 'normal', NULL, NULL, '2026-08-28 06:25:51', '00000000-0000-4000-8000-000000000205', NULL, 36000.00, 0.00, 0.00, 900.00, 35100.00, 'completed', 'settled', 'midtrans', 'demo-snap-INV-10030', '{\"recipient\": \"Fajar Nugraha\", \"address\": \"Jl. Ir. H. Juanda No. 56, Coblong, Bandung, 40135\", \"phone\": \"081200111005\"}', '2026-08-26 06:25:51', '2026-08-28 06:25:51'),
(32, 'INV-10031', 'normal', NULL, NULL, '2026-06-21 02:30:51', '00000000-0000-4000-8000-000000000207', NULL, 868000.00, 0.00, 0.00, 21375.00, 846625.00, 'completed', 'settled', 'transfer_bank', 'demo-snap-INV-10031', '{\"recipient\": \"Dimas Aditya\", \"address\": \"Jl. Pemuda No. 150, Semarang Tengah, Semarang, 50135\", \"phone\": \"081200111007\"}', '2026-06-18 02:30:51', '2026-06-21 02:30:51'),
(33, 'INV-10032', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000205', NULL, 80000.00, 0.00, 0.00, 1650.00, 78350.00, 'shipped', 'paid', 'qris', 'demo-snap-INV-10032', '{\"recipient\": \"Fajar Nugraha\", \"address\": \"Jl. Ir. H. Juanda No. 56, Coblong, Bandung, 40135\", \"phone\": \"081200111005\"}', '2026-08-01 02:28:51', '2026-08-01 02:28:51'),
(34, 'INV-10033', 'normal', NULL, NULL, '2026-09-03 22:48:51', '00000000-0000-4000-8000-000000000201', NULL, 868000.00, 0.00, 0.00, 21375.00, 846625.00, 'completed', 'settled', 'qris', 'demo-snap-INV-10033', '{\"recipient\": \"Angga Firmansyah\", \"address\": \"Jl. Senayan Raya No. 12, Kebayoran Baru, Jakarta Selatan, 12190\", \"phone\": \"081200111001\"}', '2026-08-29 22:48:51', '2026-08-29 22:48:51'),
(35, 'INV-10034', 'normal', NULL, NULL, '2026-09-03 20:10:51', '00000000-0000-4000-8000-000000000202', NULL, 78000.00, 0.00, 0.00, 1625.00, 76375.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10034', '{\"recipient\": \"Dewi Lestari\", \"address\": \"Jl. Salemba Raya No. 45, Matraman, Jakarta Timur, 13140\", \"phone\": \"081200111002\"}', '2026-08-31 20:10:51', '2026-09-02 20:10:51'),
(36, 'INV-10035', 'normal', NULL, NULL, '2026-06-25 23:52:51', '00000000-0000-4000-8000-000000000205', NULL, 1066000.00, 0.00, 0.00, 26275.00, 1039725.00, 'completed', 'settled', 'qris', 'demo-snap-INV-10035', '{\"recipient\": \"Fajar Nugraha\", \"address\": \"Jl. Ir. H. Juanda No. 56, Coblong, Bandung, 40135\", \"phone\": \"081200111005\"}', '2026-06-23 23:52:51', '2026-06-23 23:52:51'),
(37, 'INV-10036', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000203', 6, 197000.00, 15000.00, 0.00, 5050.00, 191950.00, 'cancelled', 'unpaid', NULL, NULL, '{\"recipient\": \"Rizky Ramadhan\", \"address\": \"Jl. Margonda Raya No. 77, Beji, Depok, 16423\", \"phone\": \"081200111003\"}', '2026-08-03 06:47:51', '2026-08-03 06:47:51'),
(38, 'INV-10037', 'normal', NULL, NULL, '2026-07-10 23:04:51', '00000000-0000-4000-8000-000000000210', NULL, 266000.00, 0.00, 0.00, 6300.00, 259700.00, 'completed', 'settled', 'midtrans', 'demo-snap-INV-10037', '{\"recipient\": \"Nadia Salsabila\", \"address\": \"Jl. Ijen No. 9, Klojen, Malang, 65116\", \"phone\": \"081200111010\"}', '2026-07-07 23:04:51', '2026-07-10 23:04:51'),
(39, 'INV-10038', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000209', NULL, 738000.00, 0.00, 0.00, 18125.00, 719875.00, 'shipped', 'paid', 'midtrans', 'demo-snap-INV-10038', '{\"recipient\": \"Galih Prakoso\", \"address\": \"Jl. Pemuda No. 88, Genteng, Surabaya, 60275\", \"phone\": \"081200111009\"}', '2026-07-23 17:50:51', '2026-07-24 17:50:51'),
(40, 'INV-10039', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000201', NULL, 1788000.00, 0.00, 0.00, 44375.00, 1743625.00, 'pending', 'unpaid', NULL, NULL, '{\"recipient\": \"Angga Firmansyah\", \"address\": \"Jl. Senayan Raya No. 12, Kebayoran Baru, Jakarta Selatan, 12190\", \"phone\": \"081200111001\"}', '2026-08-23 05:40:51', '2026-08-23 05:40:51'),
(41, 'INV-10040', 'normal', NULL, NULL, '2026-06-12 04:45:51', '00000000-0000-4000-8000-000000000207', NULL, 66000.00, 0.00, 0.00, 1650.00, 64350.00, 'completed', 'settled', 'midtrans', 'demo-snap-INV-10040', '{\"recipient\": \"Dimas Aditya\", \"address\": \"Jl. Pemuda No. 150, Semarang Tengah, Semarang, 50135\", \"phone\": \"081200111007\"}', '2026-06-09 04:45:51', '2026-06-09 04:45:51'),
(42, 'INV-10041', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000210', NULL, 96000.00, 0.00, 0.00, 2100.00, 93900.00, 'pending', 'unpaid', NULL, NULL, '{\"recipient\": \"Nadia Salsabila\", \"address\": \"Jl. Ijen No. 9, Klojen, Malang, 65116\", \"phone\": \"081200111010\"}', '2026-07-04 00:06:51', '2026-07-04 00:06:51'),
(43, 'INV-10042', 'normal', NULL, NULL, '2026-07-15 22:08:51', '00000000-0000-4000-8000-000000000207', NULL, 568000.00, 0.00, 0.00, 13875.00, 554125.00, 'completed', 'settled', 'transfer_bank', 'demo-snap-INV-10042', '{\"recipient\": \"Dimas Aditya\", \"address\": \"Jl. Pemuda No. 150, Semarang Tengah, Semarang, 50135\", \"phone\": \"081200111007\"}', '2026-07-12 22:08:51', '2026-07-14 22:08:51'),
(44, 'INV-10043', 'normal', NULL, NULL, '2026-08-20 12:19:51', '00000000-0000-4000-8000-000000000208', NULL, 99000.00, 0.00, 0.00, 2200.00, 96800.00, 'completed', 'settled', 'qris', 'demo-snap-INV-10043', '{\"recipient\": \"Intan Permata\", \"address\": \"Jl. Kaliurang KM 4.5, Depok, Sleman, 55281\", \"phone\": \"081200111008\"}', '2026-08-15 12:19:51', '2026-08-15 12:19:51'),
(45, 'INV-10044', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000205', NULL, 529000.00, 0.00, 0.00, 13225.00, 515775.00, 'processing', 'paid', 'midtrans', 'demo-snap-INV-10044', '{\"recipient\": \"Fajar Nugraha\", \"address\": \"Jl. Ir. H. Juanda No. 56, Coblong, Bandung, 40135\", \"phone\": \"081200111005\"}', '2026-08-04 16:25:51', '2026-08-04 16:25:51'),
(46, 'INV-10045', 'normal', NULL, NULL, '2026-08-11 21:15:51', '00000000-0000-4000-8000-000000000202', 3, 61400.00, 5600.00, 0.00, 1400.00, 60000.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10045', '{\"recipient\": \"Dewi Lestari\", \"address\": \"Jl. Salemba Raya No. 45, Matraman, Jakarta Timur, 13140\", \"phone\": \"081200111002\"}', '2026-08-06 21:15:51', '2026-08-07 21:15:51'),
(47, 'INV-10046', 'normal', NULL, NULL, '2026-08-20 12:40:51', '00000000-0000-4000-8000-000000000201', NULL, 54000.00, 0.00, 0.00, 1350.00, 52650.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10046', '{\"recipient\": \"Angga Firmansyah\", \"address\": \"Jl. Senayan Raya No. 12, Kebayoran Baru, Jakarta Selatan, 12190\", \"phone\": \"081200111001\"}', '2026-08-16 12:40:51', '2026-08-16 12:40:51'),
(48, 'INV-10047', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000208', NULL, 194000.00, 0.00, 0.00, 4500.00, 189500.00, 'pending', 'unpaid', NULL, NULL, '{\"recipient\": \"Intan Permata\", \"address\": \"Jl. Kaliurang KM 4.5, Depok, Sleman, 55281\", \"phone\": \"081200111008\"}', '2026-09-10 22:17:51', '2026-09-10 22:17:51'),
(49, 'INV-10048', 'normal', NULL, NULL, '2026-07-27 05:13:51', '00000000-0000-4000-8000-000000000205', NULL, 174000.00, 0.00, 0.00, 4050.00, 169950.00, 'completed', 'settled', 'midtrans', 'demo-snap-INV-10048', '{\"recipient\": \"Fajar Nugraha\", \"address\": \"Jl. Ir. H. Juanda No. 56, Coblong, Bandung, 40135\", \"phone\": \"081200111005\"}', '2026-07-24 05:13:51', '2026-07-27 05:13:51'),
(50, 'INV-10049', 'normal', NULL, NULL, '2026-08-29 14:42:51', '00000000-0000-4000-8000-000000000202', NULL, 114000.00, 0.00, 0.00, 2850.00, 111150.00, 'completed', 'settled', 'transfer_bank', 'demo-snap-INV-10049', '{\"recipient\": \"Dewi Lestari\", \"address\": \"Jl. Salemba Raya No. 45, Matraman, Jakarta Timur, 13140\", \"phone\": \"081200111002\"}', '2026-08-27 14:42:51', '2026-08-29 14:42:51'),
(51, 'INV-10050', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000201', NULL, 114000.00, 0.00, 0.00, 2850.00, 111150.00, 'processing', 'paid', 'midtrans', 'demo-snap-INV-10050', '{\"recipient\": \"Angga Firmansyah\", \"address\": \"Jl. Senayan Raya No. 12, Kebayoran Baru, Jakarta Selatan, 12190\", \"phone\": \"081200111001\"}', '2026-07-08 17:25:51', '2026-07-09 17:25:51'),
(52, 'INV-10051', 'normal', NULL, NULL, '2026-07-19 12:25:51', '00000000-0000-4000-8000-000000000210', NULL, 783000.00, 0.00, 0.00, 19250.00, 763750.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10051', '{\"recipient\": \"Nadia Salsabila\", \"address\": \"Jl. Ijen No. 9, Klojen, Malang, 65116\", \"phone\": \"081200111010\"}', '2026-07-14 12:25:51', '2026-07-15 12:25:51'),
(53, 'INV-10052', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000202', NULL, 603000.00, 0.00, 0.00, 15075.00, 587925.00, 'cancelled', 'unpaid', NULL, NULL, '{\"recipient\": \"Dewi Lestari\", \"address\": \"Jl. Salemba Raya No. 45, Matraman, Jakarta Timur, 13140\", \"phone\": \"081200111002\"}', '2026-05-27 03:47:51', '2026-05-27 03:47:51'),
(54, 'INV-10053', 'normal', NULL, NULL, '2026-08-30 23:15:52', '00000000-0000-4000-8000-000000000202', NULL, 141000.00, 0.00, 0.00, 3225.00, 137775.00, 'completed', 'settled', 'qris', 'demo-snap-INV-10053', '{\"recipient\": \"Dewi Lestari\", \"address\": \"Jl. Salemba Raya No. 45, Matraman, Jakarta Timur, 13140\", \"phone\": \"081200111002\"}', '2026-08-26 23:15:52', '2026-09-21 20:17:23'),
(55, 'INV-10054', 'normal', NULL, NULL, '2026-08-20 19:01:52', '00000000-0000-4000-8000-000000000202', 1, 73400.00, 6600.00, 0.00, 1650.00, 71750.00, 'completed', 'settled', 'qris', 'demo-snap-INV-10054', '{\"recipient\": \"Dewi Lestari\", \"address\": \"Jl. Salemba Raya No. 45, Matraman, Jakarta Timur, 13140\", \"phone\": \"081200111002\"}', '2026-08-17 19:01:52', '2026-08-17 19:01:52'),
(56, 'INV-10055', 'normal', NULL, NULL, '2026-07-21 16:41:52', '00000000-0000-4000-8000-000000000203', NULL, 140000.00, 0.00, 0.00, 3500.00, 136500.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10055', '{\"recipient\": \"Rizky Ramadhan\", \"address\": \"Jl. Margonda Raya No. 77, Beji, Depok, 16423\", \"phone\": \"081200111003\"}', '2026-07-18 16:41:52', '2026-07-18 16:41:52'),
(57, 'INV-10056', 'normal', NULL, NULL, '2026-07-24 11:01:52', '00000000-0000-4000-8000-000000000209', NULL, 583000.00, 0.00, 0.00, 14250.00, 568750.00, 'completed', 'settled', 'transfer_bank', 'demo-snap-INV-10056', '{\"recipient\": \"Galih Prakoso\", \"address\": \"Jl. Pemuda No. 88, Genteng, Surabaya, 60275\", \"phone\": \"081200111009\"}', '2026-07-20 11:01:52', '2026-07-20 11:01:52'),
(58, 'INV-10057', 'normal', NULL, NULL, '2026-06-08 16:34:52', '00000000-0000-4000-8000-000000000207', NULL, 214000.00, 0.00, 0.00, 5350.00, 208650.00, 'completed', 'settled', 'midtrans', 'demo-snap-INV-10057', '{\"recipient\": \"Dimas Aditya\", \"address\": \"Jl. Pemuda No. 150, Semarang Tengah, Semarang, 50135\", \"phone\": \"081200111007\"}', '2026-06-03 16:34:52', '2026-06-04 16:34:52'),
(59, 'INV-10058', 'normal', NULL, NULL, '2026-09-15 12:38:52', '00000000-0000-4000-8000-000000000205', NULL, 150000.00, 0.00, 0.00, 3375.00, 146625.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10058', '{\"recipient\": \"Fajar Nugraha\", \"address\": \"Jl. Ir. H. Juanda No. 56, Coblong, Bandung, 40135\", \"phone\": \"081200111005\"}', '2026-09-10 12:38:52', '2026-09-21 19:19:57'),
(60, 'INV-10059', 'normal', NULL, NULL, '2026-06-24 20:23:52', '00000000-0000-4000-8000-000000000203', NULL, 310000.00, 0.00, 0.00, 7750.00, 302250.00, 'completed', 'settled', 'qris', 'demo-snap-INV-10059', '{\"recipient\": \"Rizky Ramadhan\", \"address\": \"Jl. Margonda Raya No. 77, Beji, Depok, 16423\", \"phone\": \"081200111003\"}', '2026-06-19 20:23:52', '2026-06-21 20:23:52'),
(61, 'INV-10060', 'normal', NULL, NULL, '2026-06-17 16:07:52', '00000000-0000-4000-8000-000000000206', NULL, 167000.00, 0.00, 0.00, 3900.00, 163100.00, 'completed', 'settled', 'transfer_bank', 'demo-snap-INV-10060', '{\"recipient\": \"Salsa Nadia Putri\", \"address\": \"Boulevard Raya No. 101, Kelapa Gading, Jakarta Utara, 14240\", \"phone\": \"081200111006\"}', '2026-06-14 16:07:52', '2026-06-15 16:07:52'),
(62, 'INV-10061', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000210', NULL, 200000.00, 0.00, 0.00, 5000.00, 195000.00, 'cancelled', 'unpaid', NULL, NULL, '{\"recipient\": \"Nadia Salsabila\", \"address\": \"Jl. Ijen No. 9, Klojen, Malang, 65116\", \"phone\": \"081200111010\"}', '2026-06-18 10:47:52', '2026-06-18 10:47:52'),
(63, 'INV-10062', 'normal', NULL, NULL, '2026-07-14 17:11:52', '00000000-0000-4000-8000-000000000205', NULL, 164000.00, 0.00, 0.00, 4100.00, 159900.00, 'completed', 'settled', 'transfer_bank', 'demo-snap-INV-10062', '{\"recipient\": \"Fajar Nugraha\", \"address\": \"Jl. Ir. H. Juanda No. 56, Coblong, Bandung, 40135\", \"phone\": \"081200111005\"}', '2026-07-11 17:11:52', '2026-07-12 17:11:52'),
(64, 'INV-10063', 'normal', NULL, NULL, '2026-07-07 01:46:52', '00000000-0000-4000-8000-000000000204', 2, 448000.00, 15000.00, 0.00, 11250.00, 436750.00, 'completed', 'settled', 'midtrans', 'demo-snap-INV-10063', '{\"recipient\": \"Putri Ayu Anindya\", \"address\": \"Jl. Siliwangi No. 23, Bogor Tengah, Bogor, 16121\", \"phone\": \"081200111004\"}', '2026-07-03 01:46:52', '2026-07-05 01:46:52'),
(65, 'INV-10064', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000205', NULL, 535000.00, 0.00, 0.00, 13125.00, 521875.00, 'processing', 'paid', 'qris', 'demo-snap-INV-10064', '{\"recipient\": \"Fajar Nugraha\", \"address\": \"Jl. Ir. H. Juanda No. 56, Coblong, Bandung, 40135\", \"phone\": \"081200111005\"}', '2026-08-03 03:05:52', '2026-08-04 03:05:52'),
(66, 'INV-10065', 'normal', NULL, NULL, '2026-07-25 10:30:52', '00000000-0000-4000-8000-000000000207', NULL, 111000.00, 0.00, 0.00, 2475.00, 108525.00, 'completed', 'settled', 'midtrans', 'demo-snap-INV-10065', '{\"recipient\": \"Dimas Aditya\", \"address\": \"Jl. Pemuda No. 150, Semarang Tengah, Semarang, 50135\", \"phone\": \"081200111007\"}', '2026-07-23 10:30:52', '2026-07-26 10:30:52'),
(67, 'INV-10066', 'normal', NULL, NULL, '2026-06-25 02:16:52', '00000000-0000-4000-8000-000000000207', NULL, 539000.00, 0.00, 0.00, 13225.00, 525775.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10066', '{\"recipient\": \"Dimas Aditya\", \"address\": \"Jl. Pemuda No. 150, Semarang Tengah, Semarang, 50135\", \"phone\": \"081200111007\"}', '2026-06-20 02:16:52', '2026-06-20 02:16:52'),
(68, 'INV-10067', 'normal', NULL, NULL, '2026-06-07 04:12:52', '00000000-0000-4000-8000-000000000202', NULL, 66000.00, 0.00, 0.00, 1650.00, 64350.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10067', '{\"recipient\": \"Dewi Lestari\", \"address\": \"Jl. Salemba Raya No. 45, Matraman, Jakarta Timur, 13140\", \"phone\": \"081200111002\"}', '2026-06-03 04:12:52', '2026-06-06 04:12:52'),
(69, 'INV-10068', 'normal', NULL, NULL, '2026-08-03 19:37:52', '00000000-0000-4000-8000-000000000210', NULL, 102000.00, 0.00, 0.00, 2250.00, 99750.00, 'completed', 'settled', 'transfer_bank', 'demo-snap-INV-10068', '{\"recipient\": \"Nadia Salsabila\", \"address\": \"Jl. Ijen No. 9, Klojen, Malang, 65116\", \"phone\": \"081200111010\"}', '2026-07-31 19:37:52', '2026-08-02 19:37:52'),
(70, 'INV-10069', 'normal', NULL, NULL, NULL, '00000000-0000-4000-8000-000000000209', NULL, 238000.00, 0.00, 0.00, 5625.00, 232375.00, 'shipped', 'paid', 'qris', 'demo-snap-INV-10069', '{\"recipient\": \"Galih Prakoso\", \"address\": \"Jl. Pemuda No. 88, Genteng, Surabaya, 60275\", \"phone\": \"081200111009\"}', '2026-06-20 14:00:52', '2026-06-23 14:00:52'),
(71, 'INV-10070', 'normal', NULL, NULL, '2026-08-18 18:38:52', '00000000-0000-4000-8000-000000000202', NULL, 368000.00, 0.00, 0.00, 8850.00, 359150.00, 'completed', 'settled', 'e_wallet', 'demo-snap-INV-10070', '{\"recipient\": \"Dewi Lestari\", \"address\": \"Jl. Salemba Raya No. 45, Matraman, Jakarta Timur, 13140\", \"phone\": \"081200111002\"}', '2026-08-15 18:38:52', '2026-08-17 18:38:52'),
(72, 'ORD-20260915075147-B9B96E', 'normal', NULL, NULL, NULL, '1ae55236-f781-406a-baa7-62635f4c9545', NULL, 52000.00, 0.00, 0.00, 0.00, 0.00, 'pending', 'unpaid', 'midtrans', 'd8c202b6-5fbf-41e9-a317-e5c5397faef9', '{\"recipient\": \"uyiuyiuyiu\", \"phone\": \"078788797\", \"address\": \"Horti Campus, Naaldwijk, Westland, Zuid-Holland, Belanda, 2671 DC, Belanda, Horti Campus, Naaldwijk, Naaldwijk, 2671 DC\"}', '2026-09-15 00:51:49', '2026-09-15 00:51:49'),
(86, 'MAN-20260922050115-B40A85', 'booking', NULL, '2026-09-30 17:00:00', '2026-09-21 22:01:15', 'ae1c058b-18cd-4050-ae5f-ae9d24d703d7', NULL, 35000.00, 0.00, 0.00, 0.00, 0.00, 'processing', 'paid', 'tunai_toko', NULL, 'Ambil sendiri di toko', '2026-09-21 22:01:15', '2026-09-21 22:01:15');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sub_order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `sub_order_id`, `product_id`, `variant_id`, `product_name`, `sku`, `thumbnail`, `price`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 40, 60, 'Washi Tape Set 10 pcs - Set 10', 'ANA-0008-Set10-1', 'https://picsum.photos/seed/ananda-stationery-washi-tape-10/600/600', 32000.00, 1, '2026-06-28 08:01:50', '2026-06-28 08:01:50'),
(2, 1, 38, 58, 'Kertas Kado Motif (Pack 10) - Pack 10', 'ANA-0006-Pack10-1', 'https://picsum.photos/seed/ananda-stationery-kertas-kado-motif/600/600', 30000.00, 2, '2026-06-28 08:01:50', '2026-06-28 08:01:50'),
(3, 2, 22, 30, 'Teh Sari Daun Gambir - Box 25 Kantong', 'KOP-0006-Box25K-1', 'https://picsum.photos/seed/kopi-nusantara-teh-sari-gambir/600/600', 38000.00, 1, '2026-08-10 23:54:50', '2026-08-10 23:54:50'),
(4, 2, 21, 29, 'Teh Melati Premium 50 Kantong - 50 Kantong', 'KOP-0005-50Kant-1', 'https://picsum.photos/seed/kopi-nusantara-teh-melati-premium/600/600', 55000.00, 3, '2026-08-10 23:54:50', '2026-08-10 23:54:50'),
(5, 2, 17, 23, 'Kopi Arabika Gayo 250g - Biji', 'KOP-0001-Biji-1', 'https://picsum.photos/seed/kopi-nusantara-kopi-arabika-gayo/600/600', 85000.00, 3, '2026-08-10 23:54:50', '2026-08-10 23:54:50'),
(6, 3, 18, 25, 'Kopi Kintamani 250g - Biji', 'KOP-0002-Biji-1', 'https://picsum.photos/seed/kopi-nusantara-kopi-kintamani/600/600', 80000.00, 2, '2026-08-10 09:47:50', '2026-08-10 09:47:50'),
(7, 3, 17, 24, 'Kopi Arabika Gayo 250g - Giling', 'KOP-0001-Giling-2', 'https://picsum.photos/seed/kopi-nusantara-kopi-arabika-gayo/600/600', 85000.00, 2, '2026-08-10 09:47:50', '2026-08-10 09:47:50'),
(8, 4, 42, 64, 'Bakso Sapi Original 500g - Pack 1kg', 'SEN-0002-Pack1k-2', 'https://picsum.photos/seed/sentra-operasional-bakso-sapi-500g/600/600', 98000.00, 2, '2026-08-28 12:51:50', '2026-08-28 12:51:50'),
(9, 5, 14, 19, 'Powerbank 10000mAh Slim - Silver', 'RAK-0006-Silver-1', 'https://picsum.photos/seed/raka-teknologi-powerbank-10000/600/600', 159000.00, 2, '2026-09-06 04:21:50', '2026-09-06 04:21:50'),
(10, 6, 33, 51, 'Pulpen Gel JC Style 0.5 mm - Pack 12 Biru', 'ANA-0001-Pack12-2', 'https://picsum.photos/seed/ananda-stationery-pulpen-gel-jc/600/600', 36000.00, 1, '2026-05-30 13:47:50', '2026-05-30 13:47:50'),
(11, 7, 11, 14, 'Headphone Over-Ear Studio - Hitam', 'RAK-0003-Hitam-1', 'https://picsum.photos/seed/raka-teknologi-headphone-over-ear/600/600', 349000.00, 1, '2026-09-02 12:38:50', '2026-09-02 12:38:50'),
(12, 8, 4, 5, 'Kue Kering Kastengel - Toples 250g', 'SAR-0004-Toples-1', 'https://picsum.photos/seed/sari-nusantara-kue-kering-kastengel/600/600', 45000.00, 2, '2026-08-04 11:34:50', '2026-08-04 11:34:50'),
(13, 9, 7, 8, 'Oleh-Oleh Pisang Goreng Pasir - Box 500g', 'SAR-0007-Box500-1', 'https://picsum.photos/seed/sari-nusantara-pisang-goreng-pasir/600/600', 32000.00, 3, '2026-05-26 16:41:50', '2026-05-26 16:41:50'),
(14, 9, 1, 1, 'Keripik Singkong Balado - Original 100g', 'SAR-0001-Origin-1', 'https://picsum.photos/seed/sari-nusantara-keripik-singkong-balado/600/600', 13000.00, 1, '2026-05-26 16:41:50', '2026-05-26 16:41:50'),
(15, 10, 24, 32, 'Sirup Gula Aren Premium - Botol 500ml', 'KOP-0008-Botol5-1', 'https://picsum.photos/seed/kopi-nusantara-sirup-gula-aren/600/600', 35000.00, 3, '2026-06-13 14:34:50', '2026-06-13 14:34:50'),
(16, 10, 21, 29, 'Teh Melati Premium 50 Kantong - 50 Kantong', 'KOP-0005-50Kant-1', 'https://picsum.photos/seed/kopi-nusantara-teh-melati-premium/600/600', 55000.00, 3, '2026-06-13 14:34:50', '2026-06-13 14:34:50'),
(17, 10, 22, 30, 'Teh Sari Daun Gambir - Box 25 Kantong', 'KOP-0006-Box25K-1', 'https://picsum.photos/seed/kopi-nusantara-teh-sari-gambir/600/600', 38000.00, 2, '2026-06-13 14:34:50', '2026-06-13 14:34:50'),
(18, 11, 43, 65, 'Sate Ayam Maranggi (12 Tusuk) - 12 Tusuk', 'SEN-0003-12Tusu-1', 'https://picsum.photos/seed/sentra-operasional-sate-ayam-maranggi/600/600', 38000.00, 1, '2026-07-17 23:47:50', '2026-07-17 23:47:50'),
(19, 11, 42, 63, 'Bakso Sapi Original 500g - Pack 500g', 'SEN-0002-Pack50-1', 'https://picsum.photos/seed/sentra-operasional-bakso-sapi-500g/600/600', 52000.00, 1, '2026-07-17 23:47:50', '2026-07-17 23:47:50'),
(20, 12, 39, 59, 'Stiker Label Aneka Ukuran - 1 Pack 100 lbr', 'ANA-0007-1Pack1-1', 'https://picsum.photos/seed/ananda-stationery-stiker-label/600/600', 22000.00, 2, '2026-08-16 04:39:50', '2026-08-16 04:39:50'),
(21, 12, 33, 51, 'Pulpen Gel JC Style 0.5 mm - Pack 12 Biru', 'ANA-0001-Pack12-2', 'https://picsum.photos/seed/ananda-stationery-pulpen-gel-jc/600/600', 36000.00, 3, '2026-08-16 04:39:50', '2026-08-16 04:39:50'),
(22, 12, 38, 58, 'Kertas Kado Motif (Pack 10) - Pack 10', 'ANA-0006-Pack10-1', 'https://picsum.photos/seed/ananda-stationery-kertas-kado-motif/600/600', 30000.00, 3, '2026-08-16 04:39:50', '2026-08-16 04:39:50'),
(23, 13, 12, 17, 'Kabel Data Type-C Nylon - 2m', 'RAK-0004-2m-3', 'https://picsum.photos/seed/raka-teknologi-kabel-data-typec/600/600', 40000.00, 3, '2026-07-08 05:29:50', '2026-07-08 05:29:50'),
(24, 13, 10, 12, 'TWS Earbuds Pro - Putih', 'RAK-0002-Putih-1', 'https://picsum.photos/seed/raka-teknologi-tws-earbuds-pro/600/600', 199000.00, 2, '2026-07-08 05:29:50', '2026-07-08 05:29:50'),
(25, 13, 16, 21, 'Case HP Silikon Transparan - Bening', 'RAK-0008-Bening-1', 'https://picsum.photos/seed/raka-teknologi-case-hp-silikon/600/600', 35000.00, 3, '2026-07-08 05:29:50', '2026-07-08 05:29:50'),
(26, 14, 40, 60, 'Washi Tape Set 10 pcs - Set 10', 'ANA-0008-Set10-1', 'https://picsum.photos/seed/ananda-stationery-washi-tape-10/600/600', 32000.00, 1, '2026-07-28 22:48:50', '2026-07-28 22:48:50'),
(27, 15, 12, 17, 'Kabel Data Type-C Nylon - 2m', 'RAK-0004-2m-3', 'https://picsum.photos/seed/raka-teknologi-kabel-data-typec/600/600', 40000.00, 2, '2026-08-12 01:45:50', '2026-08-12 01:45:50'),
(28, 16, 40, 60, 'Washi Tape Set 10 pcs - Set 10', 'ANA-0008-Set10-1', 'https://picsum.photos/seed/ananda-stationery-washi-tape-10/600/600', 32000.00, 2, '2026-06-12 04:57:50', '2026-06-12 04:57:50'),
(29, 16, 37, 57, 'Kertas HVS A4 70gsm - 1 Rim', 'ANA-0005-1Rim-1', 'https://picsum.photos/seed/ananda-stationery-kertas-hvs-a4/600/600', 52000.00, 2, '2026-06-12 04:57:50', '2026-06-12 04:57:50'),
(30, 17, 39, 59, 'Stiker Label Aneka Ukuran - 1 Pack 100 lbr', 'ANA-0007-1Pack1-1', 'https://picsum.photos/seed/ananda-stationery-stiker-label/600/600', 22000.00, 1, '2026-06-16 18:56:50', '2026-06-16 18:56:50'),
(31, 17, 36, 55, 'Buku Catatan Hardcover A5 - Biru', 'ANA-0004-Biru-2', 'https://picsum.photos/seed/ananda-stationery-buku-catatan-a5/600/600', 18000.00, 2, '2026-06-16 18:56:50', '2026-06-16 18:56:50'),
(32, 18, 25, 33, 'Kemeja Batik Tulis Solo - M', 'PUR-0001-M-1', 'https://picsum.photos/seed/purnama-batik-kemeja-batik-tulis-solo/600/600', 285000.00, 3, '2026-06-12 13:01:50', '2026-06-12 13:01:50'),
(33, 18, 27, 38, 'Kaos Batik Printing Pria - S', 'PUR-0003-S-1', 'https://picsum.photos/seed/purnama-batik-kaos-batik-printing/600/600', 75000.00, 2, '2026-06-12 13:01:50', '2026-06-12 13:01:50'),
(34, 18, 29, 45, 'Blouse Batik Modern - L', 'PUR-0005-L-2', 'https://picsum.photos/seed/purnama-batik-blouse-batik-modern/600/600', 165000.00, 2, '2026-06-12 13:01:50', '2026-06-12 13:01:50'),
(35, 19, 2, 3, 'Keripik Pisang Cokelat - 125g', 'SAR-0002-125g-1', 'https://picsum.photos/seed/sari-nusantara-keripik-pisang-cokelat/600/600', 15000.00, 2, '2026-08-06 12:45:50', '2026-08-06 12:45:50'),
(36, 20, 3, 4, 'Kue Kering Nastar - Toples 250g', 'SAR-0003-Toples-1', 'https://picsum.photos/seed/sari-nusantara-kue-kering-nastar/600/600', 42000.00, 3, '2026-07-10 09:47:50', '2026-07-10 09:47:50'),
(37, 21, 37, 57, 'Kertas HVS A4 70gsm - 1 Rim', 'ANA-0005-1Rim-1', 'https://picsum.photos/seed/ananda-stationery-kertas-hvs-a4/600/600', 52000.00, 3, '2026-06-16 18:13:50', '2026-06-16 18:13:50'),
(38, 21, 35, 53, 'Pensil Kayu 2B (Pack 12) - Pack 12', 'ANA-0003-Pack12-1', 'https://picsum.photos/seed/ananda-stationery-pensil-2b-pack/600/600', 24000.00, 2, '2026-06-16 18:13:50', '2026-06-16 18:13:50'),
(39, 21, 40, 60, 'Washi Tape Set 10 pcs - Set 10', 'ANA-0008-Set10-1', 'https://picsum.photos/seed/ananda-stationery-washi-tape-10/600/600', 32000.00, 2, '2026-06-16 18:13:50', '2026-06-16 18:13:50'),
(40, 22, 36, 54, 'Buku Catatan Hardcover A5 - Hitam', 'ANA-0004-Hitam-1', 'https://picsum.photos/seed/ananda-stationery-buku-catatan-a5/600/600', 18000.00, 3, '2026-07-10 21:33:50', '2026-07-10 21:33:50'),
(41, 22, 36, 55, 'Buku Catatan Hardcover A5 - Biru', 'ANA-0004-Biru-2', 'https://picsum.photos/seed/ananda-stationery-buku-catatan-a5/600/600', 18000.00, 3, '2026-07-10 21:33:50', '2026-07-10 21:33:50'),
(42, 23, 40, 60, 'Washi Tape Set 10 pcs - Set 10', 'ANA-0008-Set10-1', 'https://picsum.photos/seed/ananda-stationery-washi-tape-10/600/600', 32000.00, 3, '2026-08-08 21:20:50', '2026-08-08 21:20:50'),
(43, 23, 37, 57, 'Kertas HVS A4 70gsm - 1 Rim', 'ANA-0005-1Rim-1', 'https://picsum.photos/seed/ananda-stationery-kertas-hvs-a4/600/600', 52000.00, 2, '2026-08-08 21:20:50', '2026-08-08 21:20:50'),
(44, 24, 43, 66, 'Sate Ayam Maranggi (12 Tusuk) - 24 Tusuk', 'SEN-0003-24Tusu-2', 'https://picsum.photos/seed/sentra-operasional-sate-ayam-maranggi/600/600', 72000.00, 3, '2026-08-16 00:58:50', '2026-08-16 00:58:50'),
(45, 24, 42, 64, 'Bakso Sapi Original 500g - Pack 1kg', 'SEN-0002-Pack1k-2', 'https://picsum.photos/seed/sentra-operasional-bakso-sapi-500g/600/600', 98000.00, 2, '2026-08-16 00:58:50', '2026-08-16 00:58:50'),
(46, 24, 41, 62, 'Paket Nasi Ayam Goreng - Plus Es Teh', 'SEN-0001-PlusEs-2', 'https://picsum.photos/seed/sentra-operasional-nasi-ayam-goreng/600/600', 22000.00, 2, '2026-08-16 00:58:50', '2026-08-16 00:58:50'),
(47, 25, 39, 59, 'Stiker Label Aneka Ukuran - 1 Pack 100 lbr', 'ANA-0007-1Pack1-1', 'https://picsum.photos/seed/ananda-stationery-stiker-label/600/600', 22000.00, 3, '2026-09-03 14:44:50', '2026-09-03 14:44:50'),
(48, 25, 38, 58, 'Kertas Kado Motif (Pack 10) - Pack 10', 'ANA-0006-Pack10-1', 'https://picsum.photos/seed/ananda-stationery-kertas-kado-motif/600/600', 30000.00, 2, '2026-09-03 14:44:50', '2026-09-03 14:44:50'),
(49, 26, 11, 14, 'Headphone Over-Ear Studio - Hitam', 'RAK-0003-Hitam-1', 'https://picsum.photos/seed/raka-teknologi-headphone-over-ear/600/600', 349000.00, 2, '2026-05-30 09:07:50', '2026-05-30 09:07:50'),
(50, 26, 13, 18, 'Adaptor Charger 45W GaN - Putih', 'RAK-0005-Putih-1', 'https://picsum.photos/seed/raka-teknologi-adaptor-charger-45w/600/600', 185000.00, 2, '2026-05-30 09:07:50', '2026-05-30 09:07:50'),
(51, 26, 9, 10, 'Smart Speaker Mini Bass - Hitam', 'RAK-0001-Hitam-1', 'https://picsum.photos/seed/raka-teknologi-smart-speaker-mini/600/600', 249000.00, 3, '2026-05-30 09:07:50', '2026-05-30 09:07:50'),
(52, 27, 5, 6, 'Cokelat Batik Mini - Isi 12 pcs', 'SAR-0005-Isi12p-1', 'https://picsum.photos/seed/sari-nusantara-cokelat-batik-mini/600/600', 25000.00, 2, '2026-06-10 16:37:50', '2026-06-10 16:37:50'),
(53, 27, 1, 2, 'Keripik Singkong Balado - Balado 100g', 'SAR-0001-Balado-2', 'https://picsum.photos/seed/sari-nusantara-keripik-singkong-balado/600/600', 14000.00, 2, '2026-06-10 16:37:50', '2026-06-10 16:37:50'),
(54, 27, 1, 1, 'Keripik Singkong Balado - Original 100g', 'SAR-0001-Origin-1', 'https://picsum.photos/seed/sari-nusantara-keripik-singkong-balado/600/600', 13000.00, 3, '2026-06-10 16:37:50', '2026-06-10 16:37:50'),
(55, 28, 17, 24, 'Kopi Arabika Gayo 250g - Giling', 'KOP-0001-Giling-2', 'https://picsum.photos/seed/kopi-nusantara-kopi-arabika-gayo/600/600', 85000.00, 2, '2026-07-25 10:05:50', '2026-07-25 10:05:50'),
(56, 29, 29, 45, 'Blouse Batik Modern - L', 'PUR-0005-L-2', 'https://picsum.photos/seed/purnama-batik-blouse-batik-modern/600/600', 165000.00, 3, '2026-08-20 15:28:50', '2026-08-20 15:28:50'),
(57, 30, 1, 2, 'Keripik Singkong Balado - Balado 100g', 'SAR-0001-Balado-2', 'https://picsum.photos/seed/sari-nusantara-keripik-singkong-balado/600/600', 14000.00, 2, '2026-05-21 04:03:50', '2026-05-21 04:03:50'),
(58, 30, 4, 5, 'Kue Kering Kastengel - Toples 250g', 'SAR-0004-Toples-1', 'https://picsum.photos/seed/sari-nusantara-kue-kering-kastengel/600/600', 45000.00, 1, '2026-05-21 04:03:50', '2026-05-21 04:03:50'),
(59, 30, 8, 9, 'Sari Kelapa Muda Botol - 300ml x 6', 'SAR-0008-300mlx-1', 'https://picsum.photos/seed/sari-nusantara-sari-kelapa-muda/600/600', 45000.00, 3, '2026-05-21 04:03:50', '2026-05-21 04:03:50'),
(60, 31, 36, 54, 'Buku Catatan Hardcover A5 - Hitam', 'ANA-0004-Hitam-1', 'https://picsum.photos/seed/ananda-stationery-buku-catatan-a5/600/600', 18000.00, 2, '2026-08-26 06:25:51', '2026-08-26 06:25:51'),
(61, 32, 25, 34, 'Kemeja Batik Tulis Solo - L', 'PUR-0001-L-2', 'https://picsum.photos/seed/purnama-batik-kemeja-batik-tulis-solo/600/600', 285000.00, 2, '2026-06-18 02:30:51', '2026-06-18 02:30:51'),
(62, 32, 25, 33, 'Kemeja Batik Tulis Solo - M', 'PUR-0001-M-1', 'https://picsum.photos/seed/purnama-batik-kemeja-batik-tulis-solo/600/600', 285000.00, 1, '2026-06-18 02:30:51', '2026-06-18 02:30:51'),
(63, 33, 41, 62, 'Paket Nasi Ayam Goreng - Plus Es Teh', 'SEN-0001-PlusEs-2', 'https://picsum.photos/seed/sentra-operasional-nasi-ayam-goreng/600/600', 22000.00, 3, '2026-08-01 02:28:51', '2026-08-01 02:28:51'),
(64, 34, 25, 35, 'Kemeja Batik Tulis Solo - XL', 'PUR-0001-XL-3', 'https://picsum.photos/seed/purnama-batik-kemeja-batik-tulis-solo/600/600', 285000.00, 3, '2026-08-29 22:48:51', '2026-08-29 22:48:51'),
(65, 35, 28, 43, 'Kaos Polos Katun Combed - XL', 'PUR-0004-XL-3', 'https://picsum.photos/seed/purnama-batik-kaos-polos-katun/600/600', 65000.00, 1, '2026-08-31 20:10:51', '2026-08-31 20:10:51'),
(66, 36, 16, 22, 'Case HP Silikon Transparan - Hitam', 'RAK-0008-Hitam-2', 'https://picsum.photos/seed/raka-teknologi-case-hp-silikon/600/600', 35000.00, 3, '2026-06-23 23:52:51', '2026-06-23 23:52:51'),
(67, 36, 10, 13, 'TWS Earbuds Pro - Hitam', 'RAK-0002-Hitam-2', 'https://picsum.photos/seed/raka-teknologi-tws-earbuds-pro/600/600', 199000.00, 1, '2026-06-23 23:52:51', '2026-06-23 23:52:51'),
(68, 36, 9, 11, 'Smart Speaker Mini Bass - Putih', 'RAK-0001-Putih-2', 'https://picsum.photos/seed/raka-teknologi-smart-speaker-mini/600/600', 249000.00, 3, '2026-06-23 23:52:51', '2026-06-23 23:52:51'),
(69, 37, 18, 26, 'Kopi Kintamani 250g - Giling', 'KOP-0002-Giling-2', 'https://picsum.photos/seed/kopi-nusantara-kopi-kintamani/600/600', 80000.00, 2, '2026-08-03 06:47:51', '2026-08-03 06:47:51'),
(70, 37, 23, 31, 'Kopi Tubruk Sachet - Box 20 Sachet', 'KOP-0007-Box20S-1', 'https://picsum.photos/seed/kopi-nusantara-kopi-tubruk-sachet/600/600', 42000.00, 1, '2026-08-03 06:47:51', '2026-08-03 06:47:51'),
(71, 38, 42, 64, 'Bakso Sapi Original 500g - Pack 1kg', 'SEN-0002-Pack1k-2', 'https://picsum.photos/seed/sentra-operasional-bakso-sapi-500g/600/600', 98000.00, 2, '2026-07-07 23:04:51', '2026-07-07 23:04:51'),
(72, 38, 43, 65, 'Sate Ayam Maranggi (12 Tusuk) - 12 Tusuk', 'SEN-0003-12Tusu-1', 'https://picsum.photos/seed/sentra-operasional-sate-ayam-maranggi/600/600', 38000.00, 1, '2026-07-07 23:04:51', '2026-07-07 23:04:51'),
(73, 38, 41, 61, 'Paket Nasi Ayam Goreng - Reguler', 'SEN-0001-Regule-1', 'https://picsum.photos/seed/sentra-operasional-nasi-ayam-goreng/600/600', 18000.00, 1, '2026-07-07 23:04:51', '2026-07-07 23:04:51'),
(74, 39, 29, 45, 'Blouse Batik Modern - L', 'PUR-0005-L-2', 'https://picsum.photos/seed/purnama-batik-blouse-batik-modern/600/600', 165000.00, 3, '2026-07-23 17:50:51', '2026-07-23 17:50:51'),
(75, 39, 28, 41, 'Kaos Polos Katun Combed - M', 'PUR-0004-M-1', 'https://picsum.photos/seed/purnama-batik-kaos-polos-katun/600/600', 65000.00, 1, '2026-07-23 17:50:51', '2026-07-23 17:50:51'),
(76, 39, 29, 44, 'Blouse Batik Modern - M', 'PUR-0005-M-1', 'https://picsum.photos/seed/purnama-batik-blouse-batik-modern/600/600', 165000.00, 1, '2026-07-23 17:50:51', '2026-07-23 17:50:51'),
(77, 40, 31, 48, 'Kain Batik Tulis 2 Meter - 2 Meter', 'PUR-0007-2Meter-1', 'https://picsum.photos/seed/purnama-batik-kain-batik-tulis/600/600', 425000.00, 1, '2026-08-23 05:40:51', '2026-08-23 05:40:51'),
(78, 40, 30, 47, 'Kebaya Encim Batik Pekalongan - L', 'PUR-0006-L-2', 'https://picsum.photos/seed/purnama-batik-kebaya-encim/600/600', 385000.00, 3, '2026-08-23 05:40:51', '2026-08-23 05:40:51'),
(79, 40, 28, 41, 'Kaos Polos Katun Combed - M', 'PUR-0004-M-1', 'https://picsum.photos/seed/purnama-batik-kaos-polos-katun/600/600', 65000.00, 3, '2026-08-23 05:40:51', '2026-08-23 05:40:51'),
(80, 41, 41, 62, 'Paket Nasi Ayam Goreng - Plus Es Teh', 'SEN-0001-PlusEs-2', 'https://picsum.photos/seed/sentra-operasional-nasi-ayam-goreng/600/600', 22000.00, 3, '2026-06-09 04:45:51', '2026-06-09 04:45:51'),
(81, 42, 3, 4, 'Kue Kering Nastar - Toples 250g', 'SAR-0003-Toples-1', 'https://picsum.photos/seed/sari-nusantara-kue-kering-nastar/600/600', 42000.00, 2, '2026-07-04 00:06:51', '2026-07-04 00:06:51'),
(82, 43, 25, 34, 'Kemeja Batik Tulis Solo - L', 'PUR-0001-L-2', 'https://picsum.photos/seed/purnama-batik-kemeja-batik-tulis-solo/600/600', 285000.00, 1, '2026-07-12 22:08:51', '2026-07-12 22:08:51'),
(83, 43, 27, 40, 'Kaos Batik Printing Pria - L', 'PUR-0003-L-3', 'https://picsum.photos/seed/purnama-batik-kaos-batik-printing/600/600', 75000.00, 1, '2026-07-12 22:08:51', '2026-07-12 22:08:51'),
(84, 43, 28, 42, 'Kaos Polos Katun Combed - L', 'PUR-0004-L-2', 'https://picsum.photos/seed/purnama-batik-kaos-polos-katun/600/600', 65000.00, 3, '2026-07-12 22:08:51', '2026-07-12 22:08:51'),
(85, 44, 34, 52, 'Pulpen Standard AE7 - Pack 10', 'ANA-0002-Pack10-1', 'https://picsum.photos/seed/ananda-stationery-pulpen-standard-ae7/600/600', 28000.00, 1, '2026-08-15 12:19:51', '2026-08-15 12:19:51'),
(86, 44, 38, 58, 'Kertas Kado Motif (Pack 10) - Pack 10', 'ANA-0006-Pack10-1', 'https://picsum.photos/seed/ananda-stationery-kertas-kado-motif/600/600', 30000.00, 2, '2026-08-15 12:19:51', '2026-08-15 12:19:51'),
(87, 45, 23, 31, 'Kopi Tubruk Sachet - Box 20 Sachet', 'KOP-0007-Box20S-1', 'https://picsum.photos/seed/kopi-nusantara-kopi-tubruk-sachet/600/600', 42000.00, 2, '2026-08-04 16:25:51', '2026-08-04 16:25:51'),
(88, 45, 19, 27, 'Kopi Toraja 250g - Biji', 'KOP-0003-Biji-1', 'https://picsum.photos/seed/kopi-nusantara-kopi-toraja/600/600', 95000.00, 3, '2026-08-04 16:25:51', '2026-08-04 16:25:51'),
(89, 45, 18, 25, 'Kopi Kintamani 250g - Biji', 'KOP-0002-Biji-1', 'https://picsum.photos/seed/kopi-nusantara-kopi-kintamani/600/600', 80000.00, 2, '2026-08-04 16:25:51', '2026-08-04 16:25:51'),
(90, 46, 34, 52, 'Pulpen Standard AE7 - Pack 10', 'ANA-0002-Pack10-1', 'https://picsum.photos/seed/ananda-stationery-pulpen-standard-ae7/600/600', 28000.00, 2, '2026-08-06 21:15:51', '2026-08-06 21:15:51'),
(91, 47, 41, 61, 'Paket Nasi Ayam Goreng - Reguler', 'SEN-0001-Regule-1', 'https://picsum.photos/seed/sentra-operasional-nasi-ayam-goreng/600/600', 18000.00, 3, '2026-08-16 12:40:51', '2026-08-16 12:40:51'),
(92, 48, 43, 65, 'Sate Ayam Maranggi (12 Tusuk) - 12 Tusuk', 'SEN-0003-12Tusu-1', 'https://picsum.photos/seed/sentra-operasional-sate-ayam-maranggi/600/600', 38000.00, 3, '2026-09-10 22:17:51', '2026-09-10 22:17:51'),
(93, 48, 41, 62, 'Paket Nasi Ayam Goreng - Plus Es Teh', 'SEN-0001-PlusEs-2', 'https://picsum.photos/seed/sentra-operasional-nasi-ayam-goreng/600/600', 22000.00, 3, '2026-09-10 22:17:51', '2026-09-10 22:17:51'),
(94, 49, 4, 5, 'Kue Kering Kastengel - Toples 250g', 'SAR-0004-Toples-1', 'https://picsum.photos/seed/sari-nusantara-kue-kering-kastengel/600/600', 45000.00, 2, '2026-07-24 05:13:51', '2026-07-24 05:13:51'),
(95, 49, 2, 3, 'Keripik Pisang Cokelat - 125g', 'SAR-0002-125g-1', 'https://picsum.photos/seed/sari-nusantara-keripik-pisang-cokelat/600/600', 15000.00, 2, '2026-07-24 05:13:51', '2026-07-24 05:13:51'),
(96, 49, 3, 4, 'Kue Kering Nastar - Toples 250g', 'SAR-0003-Toples-1', 'https://picsum.photos/seed/sari-nusantara-kue-kering-nastar/600/600', 42000.00, 1, '2026-07-24 05:13:51', '2026-07-24 05:13:51'),
(97, 50, 6, 7, 'Permen Jahe Jadul - Isi 20 pcs', 'SAR-0006-Isi20p-1', 'https://picsum.photos/seed/sari-nusantara-permen-jahe-jadul/600/600', 8000.00, 3, '2026-08-27 14:42:51', '2026-08-27 14:42:51'),
(98, 50, 8, 9, 'Sari Kelapa Muda Botol - 300ml x 6', 'SAR-0008-300mlx-1', 'https://picsum.photos/seed/sari-nusantara-sari-kelapa-muda/600/600', 45000.00, 2, '2026-08-27 14:42:51', '2026-08-27 14:42:51'),
(99, 51, 22, 30, 'Teh Sari Daun Gambir - Box 25 Kantong', 'KOP-0006-Box25K-1', 'https://picsum.photos/seed/kopi-nusantara-teh-sari-gambir/600/600', 38000.00, 3, '2026-07-08 17:25:51', '2026-07-08 17:25:51'),
(100, 52, 30, 46, 'Kebaya Encim Batik Pekalongan - M', 'PUR-0006-M-1', 'https://picsum.photos/seed/purnama-batik-kebaya-encim/600/600', 385000.00, 2, '2026-07-14 12:25:51', '2026-07-14 12:25:51'),
(101, 53, 9, 11, 'Smart Speaker Mini Bass - Putih', 'RAK-0001-Putih-2', 'https://picsum.photos/seed/raka-teknologi-smart-speaker-mini/600/600', 249000.00, 2, '2026-05-27 03:47:51', '2026-05-27 03:47:51'),
(102, 53, 16, 22, 'Case HP Silikon Transparan - Hitam', 'RAK-0008-Hitam-2', 'https://picsum.photos/seed/raka-teknologi-case-hp-silikon/600/600', 35000.00, 3, '2026-05-27 03:47:51', '2026-05-27 03:47:51'),
(103, 54, 8, 9, 'Sari Kelapa Muda Botol - 300ml x 6', 'SAR-0008-300mlx-1', 'https://picsum.photos/seed/sari-nusantara-sari-kelapa-muda/600/600', 45000.00, 2, '2026-08-26 23:15:52', '2026-08-26 23:15:52'),
(104, 54, 1, 1, 'Keripik Singkong Balado - Original 100g', 'SAR-0001-Origin-1', 'https://picsum.photos/seed/sari-nusantara-keripik-singkong-balado/600/600', 13000.00, 3, '2026-08-26 23:15:52', '2026-08-26 23:15:52'),
(105, 55, 41, 62, 'Paket Nasi Ayam Goreng - Plus Es Teh', 'SEN-0001-PlusEs-2', 'https://picsum.photos/seed/sentra-operasional-nasi-ayam-goreng/600/600', 22000.00, 3, '2026-08-17 19:01:52', '2026-08-17 19:01:52'),
(106, 56, 41, 61, 'Paket Nasi Ayam Goreng - Reguler', 'SEN-0001-Regule-1', 'https://picsum.photos/seed/sentra-operasional-nasi-ayam-goreng/600/600', 18000.00, 2, '2026-07-18 16:41:52', '2026-07-18 16:41:52'),
(107, 56, 42, 63, 'Bakso Sapi Original 500g - Pack 500g', 'SEN-0002-Pack50-1', 'https://picsum.photos/seed/sentra-operasional-bakso-sapi-500g/600/600', 52000.00, 2, '2026-07-18 16:41:52', '2026-07-18 16:41:52'),
(108, 57, 25, 35, 'Kemeja Batik Tulis Solo - XL', 'PUR-0001-XL-3', 'https://picsum.photos/seed/purnama-batik-kemeja-batik-tulis-solo/600/600', 285000.00, 2, '2026-07-20 11:01:52', '2026-07-20 11:01:52'),
(109, 58, 42, 64, 'Bakso Sapi Original 500g - Pack 1kg', 'SEN-0002-Pack1k-2', 'https://picsum.photos/seed/sentra-operasional-bakso-sapi-500g/600/600', 98000.00, 2, '2026-06-03 16:34:52', '2026-06-03 16:34:52'),
(110, 58, 41, 61, 'Paket Nasi Ayam Goreng - Reguler', 'SEN-0001-Regule-1', 'https://picsum.photos/seed/sentra-operasional-nasi-ayam-goreng/600/600', 18000.00, 1, '2026-06-03 16:34:52', '2026-06-03 16:34:52'),
(111, 59, 16, 22, 'Case HP Silikon Transparan - Hitam', 'RAK-0008-Hitam-2', 'https://picsum.photos/seed/raka-teknologi-case-hp-silikon/600/600', 35000.00, 2, '2026-09-10 12:38:52', '2026-09-10 12:38:52'),
(112, 59, 12, 17, 'Kabel Data Type-C Nylon - 2m', 'RAK-0004-2m-3', 'https://picsum.photos/seed/raka-teknologi-kabel-data-typec/600/600', 40000.00, 1, '2026-09-10 12:38:52', '2026-09-10 12:38:52'),
(113, 59, 12, 15, 'Kabel Data Type-C Nylon - 0.5m', 'RAK-0004-05m-1', 'https://picsum.photos/seed/raka-teknologi-kabel-data-typec/600/600', 25000.00, 1, '2026-09-10 12:38:52', '2026-09-10 12:38:52'),
(114, 60, 24, 32, 'Sirup Gula Aren Premium - Botol 500ml', 'KOP-0008-Botol5-1', 'https://picsum.photos/seed/kopi-nusantara-sirup-gula-aren/600/600', 35000.00, 2, '2026-06-19 20:23:52', '2026-06-19 20:23:52'),
(115, 60, 20, 28, 'Kopi Lanang Jawa 250g - Biji', 'KOP-0004-Biji-1', 'https://picsum.photos/seed/kopi-nusantara-kopi-lanang-jawa/600/600', 120000.00, 2, '2026-06-19 20:23:52', '2026-06-19 20:23:52'),
(116, 61, 37, 57, 'Kertas HVS A4 70gsm - 1 Rim', 'ANA-0005-1Rim-1', 'https://picsum.photos/seed/ananda-stationery-kertas-hvs-a4/600/600', 52000.00, 3, '2026-06-14 16:07:52', '2026-06-14 16:07:52'),
(117, 62, 42, 63, 'Bakso Sapi Original 500g - Pack 500g', 'SEN-0002-Pack50-1', 'https://picsum.photos/seed/sentra-operasional-bakso-sapi-500g/600/600', 52000.00, 3, '2026-06-18 10:47:52', '2026-06-18 10:47:52'),
(118, 62, 41, 62, 'Paket Nasi Ayam Goreng - Plus Es Teh', 'SEN-0001-PlusEs-2', 'https://picsum.photos/seed/sentra-operasional-nasi-ayam-goreng/600/600', 22000.00, 2, '2026-06-18 10:47:52', '2026-06-18 10:47:52'),
(119, 63, 18, 26, 'Kopi Kintamani 250g - Giling', 'KOP-0002-Giling-2', 'https://picsum.photos/seed/kopi-nusantara-kopi-kintamani/600/600', 80000.00, 1, '2026-07-11 17:11:52', '2026-07-11 17:11:52'),
(120, 63, 23, 31, 'Kopi Tubruk Sachet - Box 20 Sachet', 'KOP-0007-Box20S-1', 'https://picsum.photos/seed/kopi-nusantara-kopi-tubruk-sachet/600/600', 42000.00, 2, '2026-07-11 17:11:52', '2026-07-11 17:11:52'),
(121, 64, 29, 44, 'Blouse Batik Modern - M', 'PUR-0005-M-1', 'https://picsum.photos/seed/purnama-batik-blouse-batik-modern/600/600', 165000.00, 1, '2026-07-03 01:46:52', '2026-07-03 01:46:52'),
(122, 64, 25, 35, 'Kemeja Batik Tulis Solo - XL', 'PUR-0001-XL-3', 'https://picsum.photos/seed/purnama-batik-kemeja-batik-tulis-solo/600/600', 285000.00, 1, '2026-07-03 01:46:52', '2026-07-03 01:46:52'),
(123, 65, 18, 25, 'Kopi Kintamani 250g - Biji', 'KOP-0002-Biji-1', 'https://picsum.photos/seed/kopi-nusantara-kopi-kintamani/600/600', 80000.00, 3, '2026-08-03 03:05:52', '2026-08-03 03:05:52'),
(124, 65, 19, 27, 'Kopi Toraja 250g - Biji', 'KOP-0003-Biji-1', 'https://picsum.photos/seed/kopi-nusantara-kopi-toraja/600/600', 95000.00, 3, '2026-08-03 03:05:52', '2026-08-03 03:05:52'),
(125, 66, 2, 3, 'Keripik Pisang Cokelat - 125g', 'SAR-0002-125g-1', 'https://picsum.photos/seed/sari-nusantara-keripik-pisang-cokelat/600/600', 15000.00, 1, '2026-07-23 10:30:52', '2026-07-23 10:30:52'),
(126, 66, 3, 4, 'Kue Kering Nastar - Toples 250g', 'SAR-0003-Toples-1', 'https://picsum.photos/seed/sari-nusantara-kue-kering-nastar/600/600', 42000.00, 2, '2026-07-23 10:30:52', '2026-07-23 10:30:52'),
(127, 67, 22, 30, 'Teh Sari Daun Gambir - Box 25 Kantong', 'KOP-0006-Box25K-1', 'https://picsum.photos/seed/kopi-nusantara-teh-sari-gambir/600/600', 38000.00, 3, '2026-06-20 02:16:52', '2026-06-20 02:16:52'),
(128, 67, 17, 23, 'Kopi Arabika Gayo 250g - Biji', 'KOP-0001-Biji-1', 'https://picsum.photos/seed/kopi-nusantara-kopi-arabika-gayo/600/600', 85000.00, 3, '2026-06-20 02:16:52', '2026-06-20 02:16:52'),
(129, 67, 18, 26, 'Kopi Kintamani 250g - Giling', 'KOP-0002-Giling-2', 'https://picsum.photos/seed/kopi-nusantara-kopi-kintamani/600/600', 80000.00, 2, '2026-06-20 02:16:52', '2026-06-20 02:16:52'),
(130, 68, 41, 62, 'Paket Nasi Ayam Goreng - Plus Es Teh', 'SEN-0001-PlusEs-2', 'https://picsum.photos/seed/sentra-operasional-nasi-ayam-goreng/600/600', 22000.00, 3, '2026-06-03 04:12:52', '2026-06-03 04:12:52'),
(131, 69, 2, 3, 'Keripik Pisang Cokelat - 125g', 'SAR-0002-125g-1', 'https://picsum.photos/seed/sari-nusantara-keripik-pisang-cokelat/600/600', 15000.00, 3, '2026-07-31 19:37:52', '2026-07-31 19:37:52'),
(132, 69, 4, 5, 'Kue Kering Kastengel - Toples 250g', 'SAR-0004-Toples-1', 'https://picsum.photos/seed/sari-nusantara-kue-kering-kastengel/600/600', 45000.00, 1, '2026-07-31 19:37:52', '2026-07-31 19:37:52'),
(133, 70, 28, 42, 'Kaos Polos Katun Combed - L', 'PUR-0004-L-2', 'https://picsum.photos/seed/purnama-batik-kaos-polos-katun/600/600', 65000.00, 2, '2026-06-20 14:00:52', '2026-06-20 14:00:52'),
(134, 70, 32, 49, 'Kain Lurik Asli Klaten - 1.5 Meter', 'PUR-0008-15Mete-1', 'https://picsum.photos/seed/purnama-batik-kain-lurik-klaten/600/600', 95000.00, 1, '2026-06-20 14:00:52', '2026-06-20 14:00:52'),
(135, 71, 43, 65, 'Sate Ayam Maranggi (12 Tusuk) - 12 Tusuk', 'SEN-0003-12Tusu-1', 'https://picsum.photos/seed/sentra-operasional-sate-ayam-maranggi/600/600', 38000.00, 3, '2026-08-15 18:38:52', '2026-08-15 18:38:52'),
(136, 71, 42, 64, 'Bakso Sapi Original 500g - Pack 1kg', 'SEN-0002-Pack1k-2', 'https://picsum.photos/seed/sentra-operasional-bakso-sapi-500g/600/600', 98000.00, 2, '2026-08-15 18:38:52', '2026-08-15 18:38:52'),
(137, 71, 41, 62, 'Paket Nasi Ayam Goreng - Plus Es Teh', 'SEN-0001-PlusEs-2', 'https://picsum.photos/seed/sentra-operasional-nasi-ayam-goreng/600/600', 22000.00, 2, '2026-08-15 18:38:52', '2026-08-15 18:38:52'),
(138, 72, 43, 65, 'Sate Ayam Maranggi (12 Tusuk) - 12 Tusuk', 'SEN-0003-12Tusu-1', 'https://picsum.photos/seed/sentra-operasional-sate-ayam-maranggi/600/600', 38000.00, 1, '2026-09-15 00:51:49', '2026-09-15 00:51:49'),
(152, 86, 16, 22, 'Case HP Silikon Transparan - Hitam', 'RAK-0008-Hitam-2', 'https://picsum.photos/seed/raka-teknologi-case-hp-silikon/600/600', 35000.00, 1, '2026-09-21 22:01:15', '2026-09-21 22:01:15');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_number` varchar(100) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_method` varchar(100) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `payload` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_number`, `transaction_id`, `payment_method`, `amount`, `status`, `payload`, `created_at`, `updated_at`) VALUES
(1, 'INV-10000', 'TRX-INV-10000', 'transfer_bank', 93800.00, 'settled', '{\"paid_at\":\"2026-06-29 00:01:50\",\"channel\":\"demo\"}', '2026-06-28 08:01:50', '2026-06-28 08:01:50'),
(2, 'INV-10001', 'TRX-INV-10001', 'transfer_bank', 468000.00, 'paid', '{\"paid_at\":\"2026-08-11 10:54:50\",\"channel\":\"demo\"}', '2026-08-10 23:54:50', '2026-08-10 23:54:50'),
(3, 'INV-10002', 'TRX-INV-10002', 'transfer_bank', 340000.00, 'settled', '{\"paid_at\":\"2026-08-11 01:47:50\",\"channel\":\"demo\"}', '2026-08-10 09:47:50', '2026-08-10 09:47:50'),
(4, 'INV-10003', 'TRX-INV-10003', 'transfer_bank', 196000.00, 'paid', '{\"paid_at\":\"2026-08-29 04:51:50\",\"channel\":\"demo\"}', '2026-08-28 12:51:50', '2026-08-28 12:51:50'),
(5, 'INV-10004', 'TRX-INV-10004', 'transfer_bank', 333000.00, 'settled', '{\"paid_at\":\"2026-09-06 19:21:50\",\"channel\":\"demo\"}', '2026-09-06 04:21:50', '2026-09-06 04:21:50'),
(6, 'INV-10005', 'TRX-INV-10005', 'transfer_bank', 36000.00, 'paid', '{\"paid_at\":\"2026-05-31 04:47:50\",\"channel\":\"demo\"}', '2026-05-30 13:47:50', '2026-05-30 13:47:50'),
(7, 'INV-10006', 'TRX-INV-10006', 'transfer_bank', 364000.00, 'paid', '{\"paid_at\":\"2026-09-02 21:38:50\",\"channel\":\"demo\"}', '2026-09-02 12:38:50', '2026-09-02 12:38:50'),
(8, 'INV-10007', 'TRX-INV-10007', 'transfer_bank', 102000.00, 'paid', '{\"paid_at\":\"2026-08-05 02:34:50\",\"channel\":\"demo\"}', '2026-08-04 11:34:50', '2026-08-04 11:34:50'),
(9, 'INV-10008', 'TRX-INV-10008', 'transfer_bank', 121000.00, 'settled', '{\"paid_at\":\"2026-05-27 03:41:50\",\"channel\":\"demo\"}', '2026-05-26 16:41:50', '2026-05-26 16:41:50'),
(10, 'INV-10009', 'TRX-INV-10009', 'transfer_bank', 341000.00, 'paid', '{\"paid_at\":\"2026-06-14 07:34:50\",\"channel\":\"demo\"}', '2026-06-13 14:34:50', '2026-06-13 14:34:50'),
(11, 'INV-10011', 'TRX-INV-10011', 'transfer_bank', 253000.00, 'paid', '{\"paid_at\":\"2026-08-16 14:39:50\",\"channel\":\"demo\"}', '2026-08-16 04:39:50', '2026-08-16 04:39:50'),
(12, 'INV-10012', 'TRX-INV-10012', 'transfer_bank', 623000.00, 'settled', '{\"paid_at\":\"2026-07-08 15:29:50\",\"channel\":\"demo\"}', '2026-07-08 05:29:50', '2026-07-08 05:29:50'),
(13, 'INV-10013', 'TRX-INV-10013', 'transfer_bank', 43000.00, 'paid', '{\"paid_at\":\"2026-07-29 11:48:50\",\"channel\":\"demo\"}', '2026-07-28 22:48:50', '2026-07-28 22:48:50'),
(14, 'INV-10014', 'TRX-INV-10014', 'transfer_bank', 95000.00, 'paid', '{\"paid_at\":\"2026-08-12 16:45:50\",\"channel\":\"demo\"}', '2026-08-12 01:45:50', '2026-08-12 01:45:50'),
(15, 'INV-10015', 'TRX-INV-10015', 'transfer_bank', 179000.00, 'paid', '{\"paid_at\":\"2026-06-12 15:57:50\",\"channel\":\"demo\"}', '2026-06-12 04:57:50', '2026-06-12 04:57:50'),
(16, 'INV-10016', 'TRX-INV-10016', 'transfer_bank', 69000.00, 'settled', '{\"paid_at\":\"2026-06-17 03:56:50\",\"channel\":\"demo\"}', '2026-06-16 18:56:50', '2026-06-16 18:56:50'),
(17, 'INV-10017', 'TRX-INV-10017', 'transfer_bank', 1348000.00, 'paid', '{\"paid_at\":\"2026-06-13 00:01:50\",\"channel\":\"demo\"}', '2026-06-12 13:01:50', '2026-06-12 13:01:50'),
(18, 'INV-10018', 'TRX-INV-10018', 'transfer_bank', 39000.00, 'paid', '{\"paid_at\":\"2026-08-07 02:45:50\",\"channel\":\"demo\"}', '2026-08-06 12:45:50', '2026-08-06 12:45:50'),
(19, 'INV-10019', 'TRX-INV-10019', 'transfer_bank', 138000.00, 'paid', '{\"paid_at\":\"2026-07-11 02:47:50\",\"channel\":\"demo\"}', '2026-07-10 09:47:50', '2026-07-10 09:47:50'),
(20, 'INV-10020', 'TRX-INV-10020', 'transfer_bank', 279000.00, 'settled', '{\"paid_at\":\"2026-06-17 03:13:50\",\"channel\":\"demo\"}', '2026-06-16 18:13:50', '2026-06-16 18:13:50'),
(21, 'INV-10022', 'TRX-INV-10022', 'transfer_bank', 211000.00, 'settled', '{\"paid_at\":\"2026-08-09 13:20:50\",\"channel\":\"demo\"}', '2026-08-08 21:20:50', '2026-08-08 21:20:50'),
(22, 'INV-10023', 'TRX-INV-10023', 'transfer_bank', 456000.00, 'paid', '{\"paid_at\":\"2026-08-16 10:58:50\",\"channel\":\"demo\"}', '2026-08-16 00:58:50', '2026-08-16 00:58:50'),
(23, 'INV-10024', 'TRX-INV-10024', 'transfer_bank', 126000.00, 'settled', '{\"paid_at\":\"2026-09-04 02:44:50\",\"channel\":\"demo\"}', '2026-09-03 14:44:50', '2026-09-03 14:44:50'),
(24, 'INV-10026', 'TRX-INV-10026', 'transfer_bank', 129000.00, 'settled', '{\"paid_at\":\"2026-06-11 03:37:50\",\"channel\":\"demo\"}', '2026-06-10 16:37:50', '2026-06-10 16:37:50'),
(25, 'INV-10027', 'TRX-INV-10027', 'transfer_bank', 165000.00, 'paid', '{\"paid_at\":\"2026-07-26 00:05:50\",\"channel\":\"demo\"}', '2026-07-25 10:05:50', '2026-07-25 10:05:50'),
(26, 'INV-10028', 'TRX-INV-10028', 'transfer_bank', 508000.00, 'paid', '{\"paid_at\":\"2026-08-21 03:28:50\",\"channel\":\"demo\"}', '2026-08-20 15:28:50', '2026-08-20 15:28:50'),
(27, 'INV-10029', 'TRX-INV-10029', 'transfer_bank', 220000.00, 'paid', '{\"paid_at\":\"2026-05-21 18:03:50\",\"channel\":\"demo\"}', '2026-05-21 04:03:50', '2026-05-21 04:03:50'),
(28, 'INV-10030', 'TRX-INV-10030', 'transfer_bank', 36000.00, 'settled', '{\"paid_at\":\"2026-08-26 14:25:51\",\"channel\":\"demo\"}', '2026-08-26 06:25:51', '2026-08-26 06:25:51'),
(29, 'INV-10031', 'TRX-INV-10031', 'transfer_bank', 868000.00, 'paid', '{\"paid_at\":\"2026-06-18 17:30:51\",\"channel\":\"demo\"}', '2026-06-18 02:30:51', '2026-06-18 02:30:51'),
(30, 'INV-10032', 'TRX-INV-10032', 'transfer_bank', 80000.00, 'paid', '{\"paid_at\":\"2026-08-01 12:28:51\",\"channel\":\"demo\"}', '2026-08-01 02:28:51', '2026-08-01 02:28:51'),
(31, 'INV-10033', 'TRX-INV-10033', 'transfer_bank', 868000.00, 'paid', '{\"paid_at\":\"2026-08-30 10:48:51\",\"channel\":\"demo\"}', '2026-08-29 22:48:51', '2026-08-29 22:48:51'),
(32, 'INV-10034', 'TRX-INV-10034', 'transfer_bank', 78000.00, 'settled', '{\"paid_at\":\"2026-09-01 10:10:51\",\"channel\":\"demo\"}', '2026-08-31 20:10:51', '2026-08-31 20:10:51'),
(33, 'INV-10035', 'TRX-INV-10035', 'transfer_bank', 1066000.00, 'paid', '{\"paid_at\":\"2026-06-24 15:52:51\",\"channel\":\"demo\"}', '2026-06-23 23:52:51', '2026-06-23 23:52:51'),
(34, 'INV-10037', 'TRX-INV-10037', 'transfer_bank', 266000.00, 'paid', '{\"paid_at\":\"2026-07-08 13:04:51\",\"channel\":\"demo\"}', '2026-07-07 23:04:51', '2026-07-07 23:04:51'),
(35, 'INV-10038', 'TRX-INV-10038', 'transfer_bank', 738000.00, 'paid', '{\"paid_at\":\"2026-07-24 02:50:51\",\"channel\":\"demo\"}', '2026-07-23 17:50:51', '2026-07-23 17:50:51'),
(36, 'INV-10040', 'TRX-INV-10040', 'transfer_bank', 66000.00, 'settled', '{\"paid_at\":\"2026-06-09 15:45:51\",\"channel\":\"demo\"}', '2026-06-09 04:45:51', '2026-06-09 04:45:51'),
(37, 'INV-10042', 'TRX-INV-10042', 'transfer_bank', 568000.00, 'settled', '{\"paid_at\":\"2026-07-13 14:08:51\",\"channel\":\"demo\"}', '2026-07-12 22:08:51', '2026-07-12 22:08:51'),
(38, 'INV-10043', 'TRX-INV-10043', 'transfer_bank', 99000.00, 'paid', '{\"paid_at\":\"2026-08-16 02:19:51\",\"channel\":\"demo\"}', '2026-08-15 12:19:51', '2026-08-15 12:19:51'),
(39, 'INV-10044', 'TRX-INV-10044', 'transfer_bank', 529000.00, 'paid', '{\"paid_at\":\"2026-08-05 00:25:51\",\"channel\":\"demo\"}', '2026-08-04 16:25:51', '2026-08-04 16:25:51'),
(40, 'INV-10045', 'TRX-INV-10045', 'transfer_bank', 61400.00, 'paid', '{\"paid_at\":\"2026-08-07 11:15:51\",\"channel\":\"demo\"}', '2026-08-06 21:15:51', '2026-08-06 21:15:51'),
(41, 'INV-10046', 'TRX-INV-10046', 'transfer_bank', 54000.00, 'settled', '{\"paid_at\":\"2026-08-17 03:40:51\",\"channel\":\"demo\"}', '2026-08-16 12:40:51', '2026-08-16 12:40:51'),
(42, 'INV-10048', 'TRX-INV-10048', 'transfer_bank', 174000.00, 'settled', '{\"paid_at\":\"2026-07-24 19:13:51\",\"channel\":\"demo\"}', '2026-07-24 05:13:51', '2026-07-24 05:13:51'),
(43, 'INV-10049', 'TRX-INV-10049', 'transfer_bank', 114000.00, 'paid', '{\"paid_at\":\"2026-08-28 07:42:51\",\"channel\":\"demo\"}', '2026-08-27 14:42:51', '2026-08-27 14:42:51'),
(44, 'INV-10050', 'TRX-INV-10050', 'transfer_bank', 114000.00, 'paid', '{\"paid_at\":\"2026-07-09 09:25:51\",\"channel\":\"demo\"}', '2026-07-08 17:25:51', '2026-07-08 17:25:51'),
(45, 'INV-10051', 'TRX-INV-10051', 'transfer_bank', 783000.00, 'paid', '{\"paid_at\":\"2026-07-14 23:25:51\",\"channel\":\"demo\"}', '2026-07-14 12:25:51', '2026-07-14 12:25:51'),
(46, 'INV-10053', 'TRX-INV-10053', 'transfer_bank', 141000.00, 'paid', '{\"paid_at\":\"2026-08-27 09:15:52\",\"channel\":\"demo\"}', '2026-08-26 23:15:52', '2026-08-26 23:15:52'),
(47, 'INV-10054', 'TRX-INV-10054', 'transfer_bank', 73400.00, 'settled', '{\"paid_at\":\"2026-08-18 10:01:52\",\"channel\":\"demo\"}', '2026-08-17 19:01:52', '2026-08-17 19:01:52'),
(48, 'INV-10055', 'TRX-INV-10055', 'transfer_bank', 140000.00, 'paid', '{\"paid_at\":\"2026-07-19 06:41:52\",\"channel\":\"demo\"}', '2026-07-18 16:41:52', '2026-07-18 16:41:52'),
(49, 'INV-10056', 'TRX-INV-10056', 'transfer_bank', 583000.00, 'settled', '{\"paid_at\":\"2026-07-20 21:01:52\",\"channel\":\"demo\"}', '2026-07-20 11:01:52', '2026-07-20 11:01:52'),
(50, 'INV-10057', 'TRX-INV-10057', 'transfer_bank', 214000.00, 'paid', '{\"paid_at\":\"2026-06-04 05:34:52\",\"channel\":\"demo\"}', '2026-06-03 16:34:52', '2026-06-03 16:34:52'),
(51, 'INV-10058', 'TRX-INV-10058', 'transfer_bank', 150000.00, 'settled', '{\"paid_at\":\"2026-09-10 20:38:52\",\"channel\":\"demo\"}', '2026-09-10 12:38:52', '2026-09-10 12:38:52'),
(52, 'INV-10059', 'TRX-INV-10059', 'transfer_bank', 310000.00, 'paid', '{\"paid_at\":\"2026-06-20 13:23:52\",\"channel\":\"demo\"}', '2026-06-19 20:23:52', '2026-06-19 20:23:52'),
(53, 'INV-10060', 'TRX-INV-10060', 'transfer_bank', 167000.00, 'settled', '{\"paid_at\":\"2026-06-15 09:07:52\",\"channel\":\"demo\"}', '2026-06-14 16:07:52', '2026-06-14 16:07:52'),
(54, 'INV-10062', 'TRX-INV-10062', 'transfer_bank', 164000.00, 'settled', '{\"paid_at\":\"2026-07-12 05:11:52\",\"channel\":\"demo\"}', '2026-07-11 17:11:52', '2026-07-11 17:11:52'),
(55, 'INV-10063', 'TRX-INV-10063', 'transfer_bank', 448000.00, 'paid', '{\"paid_at\":\"2026-07-03 12:46:52\",\"channel\":\"demo\"}', '2026-07-03 01:46:52', '2026-07-03 01:46:52'),
(56, 'INV-10064', 'TRX-INV-10064', 'transfer_bank', 535000.00, 'paid', '{\"paid_at\":\"2026-08-03 19:05:52\",\"channel\":\"demo\"}', '2026-08-03 03:05:52', '2026-08-03 03:05:52'),
(57, 'INV-10065', 'TRX-INV-10065', 'transfer_bank', 111000.00, 'paid', '{\"paid_at\":\"2026-07-23 18:30:52\",\"channel\":\"demo\"}', '2026-07-23 10:30:52', '2026-07-23 10:30:52'),
(58, 'INV-10066', 'TRX-INV-10066', 'transfer_bank', 539000.00, 'settled', '{\"paid_at\":\"2026-06-20 17:16:52\",\"channel\":\"demo\"}', '2026-06-20 02:16:52', '2026-06-20 02:16:52'),
(59, 'INV-10067', 'TRX-INV-10067', 'transfer_bank', 66000.00, 'paid', '{\"paid_at\":\"2026-06-03 19:12:52\",\"channel\":\"demo\"}', '2026-06-03 04:12:52', '2026-06-03 04:12:52'),
(60, 'INV-10068', 'TRX-INV-10068', 'transfer_bank', 102000.00, 'settled', '{\"paid_at\":\"2026-08-01 12:37:52\",\"channel\":\"demo\"}', '2026-07-31 19:37:52', '2026-07-31 19:37:52'),
(61, 'INV-10069', 'TRX-INV-10069', 'transfer_bank', 238000.00, 'paid', '{\"paid_at\":\"2026-06-20 23:00:52\",\"channel\":\"demo\"}', '2026-06-20 14:00:52', '2026-06-20 14:00:52'),
(62, 'INV-10070', 'TRX-INV-10070', 'transfer_bank', 368000.00, 'settled', '{\"paid_at\":\"2026-08-16 02:38:52\",\"channel\":\"demo\"}', '2026-08-15 18:38:52', '2026-08-15 18:38:52'),
(63, 'ORD-20260915075147-B9B96E', NULL, 'midtrans', 52000.00, 'pending', NULL, '2026-09-15 00:51:49', '2026-09-15 00:51:49'),
(77, 'MAN-20260922050115-B40A85', NULL, 'tunai_toko', 35000.00, 'success', '\"{\\\"source\\\":\\\"manual\\\"}\"', '2026-09-21 22:01:15', '2026-09-21 22:01:15');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'users.view', 'Melihat pengguna', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 'users.create', 'Membuat pengguna', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 'users.update', 'Memperbarui pengguna', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(4, 'users.delete', 'Menghapus pengguna', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(5, 'roles.manage', 'Mengelola role dan permission', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(6, 'catalog.view', 'Melihat katalog', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(7, 'catalog.manage', 'Mengelola katalog', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(8, 'products.manage', 'Mengelola produk', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(9, 'stores.manage', 'Mengelola toko', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(10, 'banners.manage', 'Mengelola banner toko', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(11, 'promotions.manage', 'Mengelola promosi global', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(12, 'vouchers.manage', 'Mengelola voucher', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(13, 'orders.view', 'Melihat pesanan', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(14, 'orders.manage', 'Mengelola pesanan', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(15, 'checkout.create', 'Membuat checkout', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(16, 'reports.export', 'Mengekspor laporan', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(17, 'finance.manage', 'Mengelola pemasukan, pengeluaran, hutang, dan piutang', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(18, 'stock.manage', 'Mengelola stok dan riwayat pergerakan barang', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(19, 'showcases.manage', 'Mengelola etalase produk toko', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(20, 'tickets.create', 'Membuat dan membalas Help', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(21, 'tickets.manage', 'Mengelola seluruh Help', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(22, 'missions.manage', 'Mengelola misi dan reward voucher', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(23, 'missions.participate', 'Mengikuti misi pengguna', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(24, 'reviews.create', 'Membuat dan mengelola review milik sendiri', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(25, 'reviews.manage', 'Memoderasi seluruh review produk', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(26, 'chat.use', 'Menggunakan percakapan marketplace', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(27, 'announcements.manage', 'Mengirim announcement marketplace', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(28, 'promotion_payments.submit', 'Mengajukan pembayaran promosi seller', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(29, 'promotion_payments.review', 'Menyetujui atau menolak pembayaran promosi', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(30, 'legacy.dashboard', 'Dashboard legacy', 0, '2026-09-14 00:59:39', '2026-09-14 00:59:39');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web', '54ee736329955bd519c3ed737c7993de09f885095651cb8601893a9e097a7742', '[\"access-api\",\"active-role:admin\"]', '2026-09-14 02:01:16', NULL, '2026-09-14 02:01:14', '2026-09-14 02:01:16'),
(2, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000201', 'marketplace-web', 'd15380dc4c8af9560bacfe357749da753bf4a4be74407b65f4c54ec03e087e09', '[\"access-api\",\"active-role:buyer\"]', NULL, NULL, '2026-09-14 21:37:20', '2026-09-14 21:37:20'),
(3, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000201', 'marketplace-web', '15650334e31f26d5037b9b3a45470a6a5b49f44583a69019eebf24afced83285', '[\"access-api\",\"active-role:buyer\"]', NULL, NULL, '2026-09-14 21:37:23', '2026-09-14 21:37:23'),
(4, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000201', 'marketplace-web', '5bc37aba0cc30326b50d856322c5acc490995a0ef555cc5df9a8d435c975065c', '[\"access-api\",\"active-role:buyer\"]', '2026-09-14 21:37:31', NULL, '2026-09-14 21:37:25', '2026-09-14 21:37:31'),
(5, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'opencode-test', '41fbd8e798c70ce04e89f7fc1c0bec513c91378a502d0cbac1c3713d8bd09f57', '[\"access-api\",\"active-role:admin\"]', '2026-09-14 22:25:47', NULL, '2026-09-14 22:25:20', '2026-09-14 22:25:47'),
(7, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '1ae55236-f781-406a-baa7-62635f4c9545', 'marketplace-web-seller', 'e3754e3a5e3c5d5510b8610eda635232653f9f4606e536afd31ec58fee83564b', '[\"access-api\",\"active-role:seller\"]', '2026-09-15 23:58:14', NULL, '2026-09-15 21:49:37', '2026-09-15 23:58:14'),
(9, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '1ae55236-f781-406a-baa7-62635f4c9545', 'marketplace-web-seller', 'df367573248a76e2fc7a1f5a091dd096662a218cb3041982893ccba53a7d7106', '[\"access-api\",\"active-role:seller\"]', '2026-09-16 01:44:45', NULL, '2026-09-16 01:43:21', '2026-09-16 01:44:45'),
(13, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000102', 'marketplace-web-buyer', '8310b83bb994ef1cacdb5b4d5bc9b931a1a6c062877432e2dfa78f50d001f817', '[\"access-api\",\"active-role:buyer\"]', '2026-09-22 21:10:04', NULL, '2026-09-17 01:36:21', '2026-09-22 21:10:04'),
(15, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000102', 'marketplace-web-seller', 'c549a52276f85b3a4abcb86d9707eb37ac631a60ca64563a81a006eb48d386ff', '[\"access-api\",\"active-role:seller\"]', '2026-09-17 01:52:36', NULL, '2026-09-17 01:41:54', '2026-09-17 01:52:36'),
(16, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000102', 'marketplace-web-seller', 'fb82a8f0cc5ddfc56af7a928aef3ea1d7b57ab25ed7d007305a81d11bfbf23ef', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 00:06:50', NULL, '2026-09-17 23:15:45', '2026-09-18 00:06:50'),
(17, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000102', 'marketplace-web-seller', '2170e19c73f5e281fb7b8793125815f8a12775cfeb0eadd9ca861982a82930fe', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 02:29:20', NULL, '2026-09-18 00:15:00', '2026-09-18 02:29:20'),
(18, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '5e9290b114e90af354e8fbc3c562ee687a89fca9afaff794d961604c3c3ef8fc', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 00:36:59', NULL, '2026-09-18 00:36:59', '2026-09-18 00:36:59'),
(19, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '0756f9d975a7b55359606bf9a8ac35ffe1a16c94ee63071b8039430025a03adf', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 00:39:45', NULL, '2026-09-18 00:39:45', '2026-09-18 00:39:45'),
(20, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '01f11e24a586a31c0b3c128ef6e46bdf541f790432f2c84399835cb095d01e41', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 00:40:28', NULL, '2026-09-18 00:40:26', '2026-09-18 00:40:28'),
(21, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', 'e7015a5892e697bf7a600100e20498874e17dab5b21ac9de8c45e8fe37b9df25', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 00:42:44', NULL, '2026-09-18 00:42:40', '2026-09-18 00:42:44'),
(22, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '8a0b5e6f1524f69c5ce1f9eb4e7274137d9997160087d0ae3cb8e9108a31b112', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 00:42:58', NULL, '2026-09-18 00:42:54', '2026-09-18 00:42:58'),
(23, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-buyer', 'dc80b78e69de3c35aa9bc87ed3db0db3996bfc43903175f0d92c448105283337', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 00:43:28', NULL, '2026-09-18 00:43:24', '2026-09-18 00:43:28'),
(24, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-buyer', '18fde77a8c11fdf05bced210f459cfbdbf9098fcfd2f46a6fcbce74725e0b47a', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 00:45:52', NULL, '2026-09-18 00:45:46', '2026-09-18 00:45:52'),
(25, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-buyer', '92ed3fbea8107bb808530cdeea7404c1b51554fefe295b5a91c9bc228f29f9f4', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 00:46:28', NULL, '2026-09-18 00:46:23', '2026-09-18 00:46:28'),
(26, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-seller', 'd5e8f7072490c219232e2fd6763de2b903ccb068a6141359db2586434f5e46ff', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 00:46:29', NULL, '2026-09-18 00:46:28', '2026-09-18 00:46:29'),
(27, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-buyer', 'eaa0f4cc57efed1b2f1a1e20153faec57c773492e8efe32ad08c39c3b74056ca', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 00:47:06', NULL, '2026-09-18 00:47:01', '2026-09-18 00:47:06'),
(28, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-seller', 'b4cfbef56e9dc15ad01e1fec27d8b64ea05536d7f373b04049a768bcfa6fa8ec', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 00:47:06', NULL, '2026-09-18 00:47:06', '2026-09-18 00:47:06'),
(29, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-buyer', '1e15d76bea9168cf11755f9a8e04ae20cef9c4e8dd64d8d5c7763c598e721c47', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 00:47:53', NULL, '2026-09-18 00:47:48', '2026-09-18 00:47:53'),
(30, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-seller', '5670ea44e922c3a254e8378b6755586755805ad1da32e2f365e5773a0aa3c822', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 00:47:54', NULL, '2026-09-18 00:47:53', '2026-09-18 00:47:54'),
(31, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '1fe55a0e2102515ae910c27142696a36a44dafe2e1ec9d7c16c1a295a87ea187', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 01:24:05', NULL, '2026-09-18 01:23:49', '2026-09-18 01:24:05'),
(32, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '0d5276f06ae27257af9f05dd85dc05694301b32da452f1f8396d6abc7067ca2d', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 01:25:04', NULL, '2026-09-18 01:24:47', '2026-09-18 01:25:04'),
(33, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '492919fd6df70656bfbab0e87c2170ecc1cbf6e98fcc9a9e9254cd508a9cb38c', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 01:26:04', NULL, '2026-09-18 01:26:02', '2026-09-18 01:26:04'),
(34, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', 'ab829a3829e0da86e3b61c3e961492dd71b8361d0126f8e909638d8e99bbbc81', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 01:26:46', NULL, '2026-09-18 01:26:34', '2026-09-18 01:26:46'),
(35, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', 'da2c9ffda2d92cf56c3870dead5b8c8c641a10e2395322d569780ef8b120127b', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 01:27:21', NULL, '2026-09-18 01:27:19', '2026-09-18 01:27:21'),
(36, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '5471876c2ea82629a5d6e0f21de6c2e5a4c18dae7e8eeb0f75c1b802d509c936', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 01:27:56', NULL, '2026-09-18 01:27:51', '2026-09-18 01:27:56'),
(37, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '7c5e88bb5d9536dd9dc9d4c337273fe40728a6ef061d9b5da8b2261226ab2363', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 01:29:43', NULL, '2026-09-18 01:29:40', '2026-09-18 01:29:43'),
(38, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web', 'f0cf958e7452821d35028f91a9ec6fcc0b790da5b483cc97a519f33f6b95eda7', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 02:27:53', NULL, '2026-09-18 01:46:31', '2026-09-18 02:27:53'),
(39, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '76bfcbd30fbaaf471dd81c2174eac940f0423b0dd2f23708fbde1adc6632bc7c', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 02:16:43', NULL, '2026-09-18 01:46:54', '2026-09-18 02:16:43'),
(40, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', 'a7c3072e588364b6d6b6d8aaba3b9128999cac16feceae557be4886400ae520f', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 01:47:26', NULL, '2026-09-18 01:47:20', '2026-09-18 01:47:26'),
(41, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '0930f0b615ef4dd94693acefa5a03dd5309eb8787705afce9be4a53120bf84dd', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 02:09:36', NULL, '2026-09-18 02:09:33', '2026-09-18 02:09:36'),
(42, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '079338602b440fec4e24a0aea1b79657c8ed09fde857bbcbf7d2f8e6dd416d6e', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 02:10:33', NULL, '2026-09-18 02:10:30', '2026-09-18 02:10:33'),
(43, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '65ceec85e9742fbeb6329fb2be99ad412387ee59c2c48819fe920873a69fb5e6', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 02:10:59', NULL, '2026-09-18 02:10:56', '2026-09-18 02:10:59'),
(44, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '39626621f803d554dbe5ff92a1806df38c67edb7287452a3875a66a10edce47e', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 02:11:31', NULL, '2026-09-18 02:11:28', '2026-09-18 02:11:31'),
(45, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', 'ef41486ef7cfe4f8942fd7250a7cdd65a11d24895df97bd634ab7afcbf8f8039', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 02:12:53', NULL, '2026-09-18 02:12:37', '2026-09-18 02:12:53'),
(46, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-buyer', 'fd7e7777df670c5584d2204e142662f6fff0ebf2c3c279d3345f39a0bfb3456e', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 02:13:49', NULL, '2026-09-18 02:13:38', '2026-09-18 02:13:49'),
(47, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', 'f3f1ed2663b42e87797c4858f915a3d7045b173e6a766fdfd2702e86d7189b5a', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 02:15:57', NULL, '2026-09-18 02:15:48', '2026-09-18 02:15:57'),
(48, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '5d563d7b29ae03487d9e7788d01e84dd55b6c358db9a1a0b32958956910139c8', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 02:17:25', NULL, '2026-09-18 02:17:24', '2026-09-18 02:17:25'),
(49, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web', '287b32dd60cea09d1d064700126a287ebb1b018ec4e5fc2c450d14b459c98b26', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 02:17:44', NULL, '2026-09-18 02:17:36', '2026-09-18 02:17:44'),
(50, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '9928eb23b4aa67fdafff40ac9487490bd0dae6d3c02c6df1f2e469be8022676d', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 02:19:37', NULL, '2026-09-18 02:19:36', '2026-09-18 02:19:37'),
(51, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web', '4eb2c9b84532908bb0edcd4fe86994bede3e3b834095035609ea784bf3e52474', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 02:28:55', NULL, '2026-09-18 02:28:54', '2026-09-18 02:28:55'),
(52, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '9a36216baa6849b1db7f0805658dbf630f2f910fb118f5d2b7f68e007786e898', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 02:29:08', NULL, '2026-09-18 02:29:07', '2026-09-18 02:29:08'),
(53, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web', '5f54bbf78218f832521aa8c2eaa900885a4b06e750f000fa5fb1183214e1c085', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 02:29:45', NULL, '2026-09-18 02:29:44', '2026-09-18 02:29:45'),
(54, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web', '02d1517687a9db70e72ff50f256d4256779b1a0b6175fe0c5e25e7d3e6e6b46f', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 02:31:07', NULL, '2026-09-18 02:31:07', '2026-09-18 02:31:07'),
(55, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000102', 'marketplace-web-seller', '5f1ae34671772620351d98ce0753b6d51a800d847d2a35450d706d7fe3cb6119', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 22:42:32', NULL, '2026-09-18 18:00:48', '2026-09-18 22:42:32'),
(56, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '144371b90438525eeca0ee724680d2e7d92761fb7dbc6e15375895f0b31c10dd', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 18:10:40', NULL, '2026-09-18 18:10:36', '2026-09-18 18:10:40'),
(57, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web', '79ed7c87a1edb693a95402b56dc626391d6ac2886f71ca1d0594cd5692ce476c', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 18:11:00', NULL, '2026-09-18 18:10:55', '2026-09-18 18:11:00'),
(58, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web', 'd552bd0b4c7c3437ba6efae7eb51a60c3db3458a0373be3354b575123fddda99', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 18:11:03', NULL, '2026-09-18 18:11:00', '2026-09-18 18:11:03'),
(59, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', 'e0f8d83d3756d764bcba388f322335f7a7386165102e6094c0eb9eb336e1933b', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 18:12:08', NULL, '2026-09-18 18:11:17', '2026-09-18 18:12:08'),
(60, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '3951ad0898b737599fba6185095ab2b483f3676af73d01942f181861356608bf', '[\"access-api\",\"active-role:seller\"]', NULL, NULL, '2026-09-18 18:11:55', '2026-09-18 18:11:55'),
(61, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '53c20e700b3495ad23b1f8b88c44394260ef62d1ac110bb3f89232e90dbd9a5f', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 18:12:12', NULL, '2026-09-18 18:12:08', '2026-09-18 18:12:12'),
(62, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '3b9c5888b743d2d20a2285689772b3d0797487e87a107aed50bac94f9b27ce0e', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 18:34:49', NULL, '2026-09-18 18:34:49', '2026-09-18 18:34:49'),
(63, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '66ea2519707a69335116a1af1c52f2de3d272d3eebec9ebfbfe07a1aaa4243f1', '[\"access-api\",\"active-role:buyer\"]', NULL, NULL, '2026-09-18 18:34:52', '2026-09-18 18:34:52'),
(64, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '9896edd6cc873007f36fa712d81e49a4257169102540fa831b10253f28cbe112', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 18:34:55', NULL, '2026-09-18 18:34:55', '2026-09-18 18:34:55'),
(65, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '2072da4b003109b28c477e108d5983f6626ca06fb9ad60076c985a52620a0bd5', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 18:34:59', NULL, '2026-09-18 18:34:59', '2026-09-18 18:34:59'),
(66, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', 'da0a8e9f03da82e158e45fa21c79266a66787f370b21ac66efc4374b78546581', '[\"access-api\",\"active-role:seller\"]', NULL, NULL, '2026-09-18 18:34:59', '2026-09-18 18:34:59'),
(67, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', 'b8d49daffc247340f7486487d68395c29c9b913f87be29cb2f02b2514b75ecdd', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 18:35:03', NULL, '2026-09-18 18:35:03', '2026-09-18 18:35:03'),
(68, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', 'eaddfa2bed309a10abee3b86f4cc8631cd005bcd3a8d711c4debeb74f88233ca', '[\"access-api\",\"active-role:seller\"]', NULL, NULL, '2026-09-18 18:35:03', '2026-09-18 18:35:03'),
(69, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', 'dac84f5cbe607508cc8065b16a1501128bab3d25611947508e057e7e2e7150aa', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 18:35:07', NULL, '2026-09-18 18:35:07', '2026-09-18 18:35:07'),
(70, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', 'e7855253bb7b105f355d4d35f929fdf4b66fa3f6f56903aad8a4b834f3838740', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 18:35:07', NULL, '2026-09-18 18:35:07', '2026-09-18 18:35:07'),
(71, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-buyer', '6e8372e16f1589192860c941effc2050205b4c9d0b0d2ccb4f494ce0c5eb1072', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 18:36:35', NULL, '2026-09-18 18:36:31', '2026-09-18 18:36:35'),
(72, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '03486d2ea03036225c39f14d9570d970a850e0fbfeb9e1238b8aad2af966ef3e', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 18:41:36', NULL, '2026-09-18 18:39:47', '2026-09-18 18:41:36'),
(73, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-buyer', '88f0807850f4378274601d97649f756e69b07de9f2099f3aa2689d861cdcea29', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 18:43:24', NULL, '2026-09-18 18:43:19', '2026-09-18 18:43:24'),
(74, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-buyer', '419faa6ac9844999c3699bdaf76493b5f5488fcf457b67907c4ac84e4ac5aee6', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 18:47:59', NULL, '2026-09-18 18:47:54', '2026-09-18 18:47:59'),
(75, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '756e2b095b4d57b2ccb8d8ee88c6a015effaa89cf1362731d52e0ab99f5265e0', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 18:48:00', NULL, '2026-09-18 18:47:59', '2026-09-18 18:48:00'),
(76, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web-buyer', 'fd1cc6b0f123dc015fc87667380283917b873eeb4505c7740275218e651f26e0', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 18:56:29', NULL, '2026-09-18 18:56:24', '2026-09-18 18:56:29'),
(77, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web', '92c1dbf7b677b37a37b4344055faa27483032cbf3cd73d00f4087394bf4e17c6', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 18:58:12', NULL, '2026-09-18 18:56:29', '2026-09-18 18:58:12'),
(78, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web', '02df900d235c99efbc58594ded9e773a13f21e4f1390050c1fd346e12176cae7', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 18:59:02', NULL, '2026-09-18 18:58:12', '2026-09-18 18:59:02'),
(79, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-buyer', '526017db8500c8448fe8f46154fed8dea02ea7ff8a1b56b951a1a3548e9585b9', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 18:59:18', NULL, '2026-09-18 18:59:12', '2026-09-18 18:59:18'),
(80, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '4ab008c9ecb76dc886805821c1c60607e7ee983d4baaccf6ded5155ec480c260', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 18:59:25', NULL, '2026-09-18 18:59:18', '2026-09-18 18:59:25'),
(81, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', 'c75bda7ddc8c78fb267330c2a1762a3891717964817b2c485eacbd2ccc6dcc66', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 19:14:00', NULL, '2026-09-18 19:13:59', '2026-09-18 19:14:00'),
(82, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', 'ff25dd70bb5966d8e64d2d04ed0bb97aca5e5a0935dac5efd5ff514e1ecedd36', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 19:14:00', NULL, '2026-09-18 19:14:00', '2026-09-18 19:14:00'),
(83, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '350a2fa6aed6e81fe92961a7e776f0ceeb04c08a65d7d8ce1c92c6dd65197d6d', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 19:14:06', NULL, '2026-09-18 19:14:06', '2026-09-18 19:14:06'),
(84, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '24fba2c5d5fdad0925a03b7fa660de55c213e9cf8ba22bf4cefcc9020f4d37c7', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 19:14:06', NULL, '2026-09-18 19:14:06', '2026-09-18 19:14:06'),
(85, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '6e773fb1f1d173f3f0c076689e8d73752863f1421afa3a9e6ba4e2580cec8a2b', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 19:14:11', NULL, '2026-09-18 19:14:11', '2026-09-18 19:14:11'),
(86, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '7408427a3a38c644ef3aa9a4d4fc9460f18ba1f4614a7fefead365f6fc79a5f8', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 19:14:11', NULL, '2026-09-18 19:14:11', '2026-09-18 19:14:11'),
(87, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', 'b7e3393b58014bce51914772950ca64adf20b1562bc0547fc3b105ac7763fc70', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 19:45:14', NULL, '2026-09-18 19:45:14', '2026-09-18 19:45:14'),
(88, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '6ea857c88bb7f2ad4b094edd288fbf3d6653e67451a94a83da45e35cf5d0af3e', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 19:45:14', NULL, '2026-09-18 19:45:14', '2026-09-18 19:45:14'),
(89, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '6016cc330d672f35aac554473a58d7a02686c80726f6145b56483e9e00cab318', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 19:52:15', NULL, '2026-09-18 19:52:15', '2026-09-18 19:52:15'),
(90, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '40b7740c6e298033665b7e2eb9bced6146946d23f37c4255eb95a22046b6883c', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 19:52:15', NULL, '2026-09-18 19:52:15', '2026-09-18 19:52:15'),
(91, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web', '79cc370e6df6a66c3b4c1be6fb8680904af13e99aeeed8881ac4b1202a659308', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 19:52:36', NULL, '2026-09-18 19:52:36', '2026-09-18 19:52:36'),
(92, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web', '3155968663dd4ff0dc6d9f1b26d6317a1e4ebb5c73168f9860b37dd1dffd3edf', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 19:52:36', NULL, '2026-09-18 19:52:36', '2026-09-18 19:52:36'),
(93, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web-buyer', 'd350b7226c39bdfb236c97c41db1cd46edef1b97b882f132bc802979ac1cf80b', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 20:07:27', NULL, '2026-09-18 19:57:06', '2026-09-18 20:07:27'),
(94, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web', '4ab61e5f315ab5343288340b6d0ce999c62a1e8d5c2f6ce0e08aeb266fd87f8a', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 19:57:12', NULL, '2026-09-18 19:57:11', '2026-09-18 19:57:12'),
(95, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-buyer', 'c1d828f96b5d36a3632b30d07bca6552e799a90d9069be6900d77bcafe6ea81f', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 19:57:30', NULL, '2026-09-18 19:57:24', '2026-09-18 19:57:30'),
(96, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '3719875d8054aedb53d5ea2171d92a1f31531534085157ba9024765ac2d384bd', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 19:57:30', NULL, '2026-09-18 19:57:30', '2026-09-18 19:57:30'),
(97, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web-buyer', 'c78e68b998adc87dcc9f0d48e64e5bed51f28e90bd4b94800b45c30b8b6e3f34', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 20:01:59', NULL, '2026-09-18 20:01:53', '2026-09-18 20:01:59'),
(98, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web', 'a1acd6bb61a74bf436d2c17df70ad79a7785cfd9bb791b6ac19ce44186a2abe2', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 20:04:31', NULL, '2026-09-18 20:01:59', '2026-09-18 20:04:31'),
(99, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-buyer', '2f15c507b6d91ec7178ddf3ed7b7c5e23fa5b41475714dd0f6b9398110cc997a', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 20:04:45', NULL, '2026-09-18 20:04:39', '2026-09-18 20:04:45'),
(100, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '9b794ac1c8fe971f71f21f15435180b6edd4071f7d9ae2f0288ebcb0f9270def', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 20:06:16', NULL, '2026-09-18 20:04:45', '2026-09-18 20:06:16'),
(101, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '4794482782721c6ae2a0fdc6f3875bed8e62e5965e62355fc672aa5238589975', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 20:07:08', NULL, '2026-09-18 20:07:08', '2026-09-18 20:07:08'),
(102, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', 'a1dbc5e9eb17ae3b586e1c5666ba1be120d7de092a847264e71aff16cb45c44b', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 20:07:08', NULL, '2026-09-18 20:07:08', '2026-09-18 20:07:08'),
(103, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web', 'd7f364cfaeef0c8b93efe9d8a964123c1cc5ea384328950ab244b3de9bcbdf2d', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 20:07:09', NULL, '2026-09-18 20:07:09', '2026-09-18 20:07:09'),
(104, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web', '26bb9cda4468eb29e2aa160cfccc63966013454f63ece248a2d8e5fb0ee83b03', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 20:07:09', NULL, '2026-09-18 20:07:09', '2026-09-18 20:07:09'),
(105, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web', '686c3a24133e922771dc4ab36ab0752c2ff3b54563fca3497577f8342c0d807b', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 20:07:28', NULL, '2026-09-18 20:07:27', '2026-09-18 20:07:28'),
(106, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web-buyer', '780f7056bc4fa753c3e2f134f7ada1f76cdf1e5d510f47d290b2ae0deb62ffc5', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 20:07:45', NULL, '2026-09-18 20:07:40', '2026-09-18 20:07:45'),
(107, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '3cf7103d2ec46340dc5f2d6f95a981f3517377dd3cdc02b7811ca9e78f358f5c', '[\"access-api\",\"active-role:seller\"]', '2026-09-18 20:07:46', NULL, '2026-09-18 20:07:45', '2026-09-18 20:07:46'),
(108, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web-buyer', 'dad76e050112cf93a823f41b503b923c4ca5535d9d13a8b9f70d09715ffeedc2', '[\"access-api\",\"active-role:buyer\"]', '2026-09-18 20:08:50', NULL, '2026-09-18 20:08:44', '2026-09-18 20:08:50'),
(109, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000002', 'marketplace-web', '63ceb86aa3e77c54d1ecc57d5fa65c802ab09a064851cc690af5c7d115ca5fe6', '[\"access-api\",\"active-role:admin\"]', '2026-09-18 20:08:57', NULL, '2026-09-18 20:08:50', '2026-09-18 20:08:57'),
(110, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000102', 'marketplace-web-seller', '81bde14ba26d6b6dd30497483ca4aa9837c5dea50d31588530899aa1edae0533', '[\"access-api\",\"active-role:seller\"]', '2026-09-20 21:50:53', NULL, '2026-09-20 20:45:16', '2026-09-20 21:50:53'),
(111, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000102', 'marketplace-web-seller', 'f9b501d2c98209fea191cb8c1697e93fbcc353c9986505aec84d08aed91e455d', '[\"access-api\",\"active-role:seller\"]', '2026-09-21 02:36:46', NULL, '2026-09-20 21:57:58', '2026-09-21 02:36:46'),
(112, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web-admin', '85acf42daac5ebb9bf5e3ee65d49c6f406115f64f29fc2f8d17959bbe0d0f299', '[\"access-api\",\"active-role:admin\"]', '2026-09-21 05:54:50', NULL, '2026-09-21 01:16:20', '2026-09-21 05:54:50'),
(113, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000102', 'marketplace-web-seller', '31a3f4479702edb61ef574f6d4ce6a920250bb65d89409a1d95187cb80903170', '[\"access-api\",\"active-role:seller\"]', '2026-09-22 02:08:35', NULL, '2026-09-21 19:17:43', '2026-09-22 02:08:35'),
(114, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', 'c26209172271aa3d0f6f62b0d66a755d16ccc29844573efe0978d48d00c92441', '[\"access-api\",\"active-role:seller\"]', '2026-09-21 21:58:56', NULL, '2026-09-21 20:16:12', '2026-09-21 21:58:56'),
(115, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000001', 'marketplace-web', '70d5dd1248fe362c6e78502387abd57916e1189d34c84c94a48a6f5a433d4696', '[\"access-api\",\"active-role:admin\"]', '2026-09-21 21:58:52', NULL, '2026-09-21 20:17:23', '2026-09-21 21:58:52'),
(116, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000202', 'marketplace-web', '0571ac64ee8ace3e1016a93666bd1c1b81f1a77ff529b79d8b4f1ff23f34f34d', '[\"access-api\",\"active-role:buyer\"]', '2026-09-21 21:54:09', NULL, '2026-09-21 21:09:42', '2026-09-21 21:54:09'),
(117, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000102', 'marketplace-web-seller', 'da9107404ee94c0282c2809377967d787e3c7ba18ddc3398de338bcd9dea2539', '[\"access-api\",\"active-role:seller\"]', '2026-09-22 02:31:37', NULL, '2026-09-22 02:08:44', '2026-09-22 02:31:37'),
(118, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000102', 'marketplace-web-seller', 'b2ca1e6e04c57cfba0e8f3396400068979c8fa5ddaa4b59dc10c7929426a4993', '[\"access-api\",\"active-role:seller\"]', '2026-09-23 02:31:23', NULL, '2026-09-22 21:10:02', '2026-09-23 02:31:23'),
(119, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '3341a4d5-d0a6-4409-a0d2-e3a0746109e6', 'marketplace-web', 'a0fabc68b5e435c7846e91a655f40144026d2ff9b46b36d93b89f0b8d75fac14', '[\"access-api\",\"active-role:buyer\"]', '2026-09-22 21:28:03', NULL, '2026-09-22 21:27:59', '2026-09-22 21:28:03'),
(120, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '0b4473515674c1403b15bbea01d62d14718e12b7382e3c0bc155f642de8114e6', '[\"access-api\",\"active-role:buyer\"]', '2026-09-22 23:21:55', NULL, '2026-09-22 21:28:17', '2026-09-22 23:21:55'),
(122, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', 'ea17edc7489ee514fd3ef7624fc0fe04ceb4e3f45d3b7db577645a1ff639b283', '[\"access-api\",\"active-role:buyer\"]', NULL, NULL, '2026-09-22 22:28:56', '2026-09-22 22:28:56'),
(123, 'App\\Domains\\Identity\\User\\Domain\\Entities\\User', '00000000-0000-4000-8000-000000000101', 'marketplace-web', '93c17aa619d602d10fab9264b94766c9de89933dd79f657554e5500fc001b43b', '[\"access-api\",\"active-role:seller\"]', '2026-09-23 02:20:32', NULL, '2026-09-22 23:21:55', '2026-09-23 02:20:32');

-- --------------------------------------------------------

--
-- Table structure for table `ppob_finance_entries`
--

CREATE TABLE `ppob_finance_entries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `source_type` varchar(60) NOT NULL,
  `source_id` varchar(40) NOT NULL,
  `ppob_transaction_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reference_id` varchar(100) NOT NULL,
  `transaction_type` varchar(40) NOT NULL,
  `title` varchar(160) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'posted',
  `occurred_at` timestamp NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ppob_inquiries`
--

CREATE TABLE `ppob_inquiries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference_id` varchar(100) NOT NULL,
  `user_id` char(36) NOT NULL,
  `operator_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_code` varchar(80) DEFAULT NULL,
  `category` varchar(40) NOT NULL,
  `customer_id` varchar(120) NOT NULL,
  `tr_id` varchar(40) DEFAULT NULL,
  `customer_name` varchar(160) DEFAULT NULL,
  `customer_no` varchar(120) DEFAULT NULL,
  `bill_amount` decimal(15,2) DEFAULT NULL,
  `admin_charge` decimal(15,2) DEFAULT NULL,
  `admin_charge_message` varchar(255) DEFAULT NULL,
  `detail` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`detail`)),
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ppob_operators`
--

CREATE TABLE `ppob_operators` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `category` varchar(40) NOT NULL,
  `brand` varchar(120) DEFAULT NULL,
  `operator_prefix` varchar(120) DEFAULT NULL,
  `provider_name` varchar(120) NOT NULL DEFAULT 'IAK',
  `icon_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ppob_operators`
--

INSERT INTO `ppob_operators` (`id`, `name`, `slug`, `category`, `brand`, `operator_prefix`, `provider_name`, `icon_url`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Indosat Ooredoo', 'indosat-pulsa', 'pulsa', 'Indosat', '0814,0815,0816,0855,0856,0857,0858', 'IAK', 'https://picsum.photos/seed/ppob-indosat/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(2, 'Telkomsel', 'telkomsel-pulsa', 'pulsa', 'Telkomsel', '0811,0812,0813,0821,0822,0823,0852,0853', 'IAK', 'https://picsum.photos/seed/ppob-telkomsel/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(3, 'XL Axiata', 'xl-pulsa', 'pulsa', 'XL', '0817,0818,0819,0859,0877,0878', 'IAK', 'https://picsum.photos/seed/ppob-xl/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(4, 'Tri (3)', 'tri-pulsa', 'pulsa', 'Tri', '0895,0896,0897,0898', 'IAK', 'https://picsum.photos/seed/ppob-tri/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(5, 'Axis', 'axis-pulsa', 'pulsa', 'Axis', '0838,0831,0832,0833', 'IAK', 'https://picsum.photos/seed/ppob-axis/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(6, 'Smartfren', 'smartfren-pulsa', 'pulsa', 'Smartfren', '0881,0882,0883,0888', 'IAK', 'https://picsum.photos/seed/ppob-smartfren/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(7, 'by.U', 'byu-pulsa', 'pulsa', 'by.U', '0851', 'IAK', 'https://picsum.photos/seed/ppob-by.u/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(8, 'Indosat Freedom', 'indosat-data', 'data', 'Indosat', '0814,0815,0816,0855,0856,0857,0858', 'IAK', 'https://picsum.photos/seed/ppob-indosat/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(9, 'Telkomsel Seluler', 'telkomsel-data', 'data', 'Telkomsel', '0811,0812,0813,0821,0822,0823,0852,0853', 'IAK', 'https://picsum.photos/seed/ppob-telkomsel/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(10, 'XL Prioritas', 'xl-data', 'data', 'XL', '0817,0818,0819,0859,0877,0878', 'IAK', 'https://picsum.photos/seed/ppob-xl/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(11, 'Tri (3)', 'tri-data', 'data', 'Tri', '0895,0896,0897,0898', 'IAK', 'https://picsum.photos/seed/ppob-tri/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(12, 'Axis', 'axis-data', 'data', 'Axis', '0838,0831,0832,0833', 'IAK', 'https://picsum.photos/seed/ppob-axis/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(13, 'Smartfren', 'smartfren-data', 'data', 'Smartfren', '0881,0882,0883,0888', 'IAK', 'https://picsum.photos/seed/ppob-smartfren/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(14, 'PLN Token (Prepaid)', 'pln-token', 'token-listrik', 'PLN', NULL, 'IAK', 'https://picsum.photos/seed/ppob-pln/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(15, 'PLN Postpaid', 'pln-tagihan', 'tagihan', 'PLN', NULL, 'IAK', 'https://picsum.photos/seed/ppob-pln/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(16, 'PDAM', 'pdam-tagihan', 'tagihan', 'PDAM', NULL, 'IAK', 'https://picsum.photos/seed/ppob-pdam/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(17, 'IndiHome', 'indihome-internet', 'internet', 'IndiHome', NULL, 'IAK', 'https://picsum.photos/seed/ppob-indihome/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(18, 'First Media', 'firstmedia-internet', 'internet', 'First Media', NULL, 'IAK', 'https://picsum.photos/seed/ppob-first-media/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(19, 'Biznet Home', 'biznet-internet', 'internet', 'Biznet', NULL, 'IAK', 'https://picsum.photos/seed/ppob-biznet/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(20, 'Voucher Game', 'game-voucher', 'voucher', 'Game', NULL, 'IAK', 'https://picsum.photos/seed/ppob-game/128/128', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ppob_pricing_rules`
--

CREATE TABLE `ppob_pricing_rules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `level` varchar(20) NOT NULL,
  `category` varchar(40) DEFAULT NULL,
  `operator_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `margin_type` varchar(20) NOT NULL DEFAULT 'fixed',
  `margin_value` decimal(15,2) NOT NULL DEFAULT 0.00,
  `admin_fee_type` varchar(20) NOT NULL DEFAULT 'fixed',
  `admin_fee_value` decimal(15,2) NOT NULL DEFAULT 0.00,
  `commission_type` varchar(20) NOT NULL DEFAULT 'fixed',
  `commission_value` decimal(15,2) NOT NULL DEFAULT 0.00,
  `min_selling_price` decimal(15,2) DEFAULT NULL,
  `max_selling_price` decimal(15,2) DEFAULT NULL,
  `priority` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ppob_products`
--

CREATE TABLE `ppob_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `operator_id` bigint(20) UNSIGNED DEFAULT NULL,
  `category` varchar(40) NOT NULL,
  `product_type` varchar(20) NOT NULL DEFAULT 'prepaid',
  `provider_product_code` varchar(80) NOT NULL,
  `name` varchar(160) NOT NULL,
  `brand` varchar(120) DEFAULT NULL,
  `nominal` varchar(80) DEFAULT NULL,
  `provider_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `admin_fee` decimal(15,2) NOT NULL DEFAULT 0.00,
  `commission` decimal(15,2) NOT NULL DEFAULT 0.00,
  `margin` decimal(15,2) NOT NULL DEFAULT 0.00,
  `selling_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `icon_url` varchar(500) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ppob_products`
--

INSERT INTO `ppob_products` (`id`, `operator_id`, `category`, `product_type`, `provider_product_code`, `name`, `brand`, `nominal`, `provider_price`, `admin_fee`, `commission`, `margin`, `selling_price`, `status`, `is_available`, `icon_url`, `metadata`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'pulsa', 'prepaid', 'PLSR5', 'Indosat 5.000', 'Indosat', '5.000', 5350.00, 200.00, 0.00, 50.00, 5600.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(2, 1, 'pulsa', 'prepaid', 'PLSR10', 'Indosat 10.000', 'Indosat', '10.000', 10200.00, 200.00, 0.00, 100.00, 10500.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(3, 1, 'pulsa', 'prepaid', 'PLSR12', 'Indosat 12.500', 'Indosat', '12.500', 12600.00, 200.00, 0.00, 150.00, 12950.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(4, 1, 'pulsa', 'prepaid', 'PLSR15', 'Indosat 15.000', 'Indosat', '15.000', 15100.00, 200.00, 0.00, 200.00, 15500.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(5, 1, 'pulsa', 'prepaid', 'PLSR20', 'Indosat 20.000', 'Indosat', '20.000', 20100.00, 300.00, 0.00, 200.00, 20600.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(6, 1, 'pulsa', 'prepaid', 'PLSR25', 'Indosat 25.000', 'Indosat', '25.000', 25100.00, 300.00, 0.00, 300.00, 25700.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(7, 1, 'pulsa', 'prepaid', 'PLSR50', 'Indosat 50.000', 'Indosat', '50.000', 50000.00, 500.00, 0.00, 500.00, 51000.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(8, 1, 'pulsa', 'prepaid', 'PLSR100', 'Indosat 100.000', 'Indosat', '100.000', 99000.00, 500.00, 0.00, 1000.00, 100500.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(9, 2, 'pulsa', 'prepaid', 'TSEK5', 'Telkomsel 5.000', 'Telkomsel', '5.000', 5500.00, 200.00, 0.00, 50.00, 5750.00, 'active', 1, 'https://picsum.photos/seed/ppob-telkomsel/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(10, 2, 'pulsa', 'prepaid', 'TSEK10', 'Telkomsel 10.000', 'Telkomsel', '10.000', 10300.00, 200.00, 0.00, 100.00, 10600.00, 'active', 1, 'https://picsum.photos/seed/ppob-telkomsel/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(11, 2, 'pulsa', 'prepaid', 'TSEK20', 'Telkomsel 20.000', 'Telkomsel', '20.000', 20200.00, 300.00, 0.00, 200.00, 20700.00, 'active', 1, 'https://picsum.photos/seed/ppob-telkomsel/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(12, 2, 'pulsa', 'prepaid', 'TSEK25', 'Telkomsel 25.000', 'Telkomsel', '25.000', 25200.00, 300.00, 0.00, 300.00, 25800.00, 'active', 1, 'https://picsum.photos/seed/ppob-telkomsel/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(13, 2, 'pulsa', 'prepaid', 'TSEK50', 'Telkomsel 50.000', 'Telkomsel', '50.000', 50100.00, 400.00, 0.00, 500.00, 51000.00, 'active', 1, 'https://picsum.photos/seed/ppob-telkomsel/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(14, 2, 'pulsa', 'prepaid', 'TSEK100', 'Telkomsel 100.000', 'Telkomsel', '100.000', 99100.00, 400.00, 0.00, 1000.00, 100500.00, 'active', 1, 'https://picsum.photos/seed/ppob-telkomsel/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(15, 3, 'pulsa', 'prepaid', 'XLR5', 'XL 5.000', 'XL', '5.000', 5450.00, 200.00, 0.00, 50.00, 5700.00, 'active', 1, 'https://picsum.photos/seed/ppob-xl/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(16, 3, 'pulsa', 'prepaid', 'XLR10', 'XL 10.000', 'XL', '10.000', 10300.00, 200.00, 0.00, 100.00, 10600.00, 'active', 1, 'https://picsum.photos/seed/ppob-xl/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(17, 3, 'pulsa', 'prepaid', 'XLR15', 'XL 15.000', 'XL', '15.000', 15200.00, 300.00, 0.00, 200.00, 15700.00, 'active', 1, 'https://picsum.photos/seed/ppob-xl/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(18, 3, 'pulsa', 'prepaid', 'XLR20', 'XL 20.000', 'XL', '20.000', 20200.00, 300.00, 0.00, 200.00, 20700.00, 'active', 1, 'https://picsum.photos/seed/ppob-xl/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(19, 3, 'pulsa', 'prepaid', 'XLR50', 'XL 50.000', 'XL', '50.000', 50100.00, 400.00, 0.00, 500.00, 51000.00, 'active', 1, 'https://picsum.photos/seed/ppob-xl/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(20, 3, 'pulsa', 'prepaid', 'XLR100', 'XL 100.000', 'XL', '100.000', 99000.00, 500.00, 0.00, 1000.00, 100500.00, 'active', 1, 'https://picsum.photos/seed/ppob-xl/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(21, 4, 'pulsa', 'prepaid', 'TRI5', 'Tri 5.000', 'Tri', '5.000', 5400.00, 200.00, 0.00, 50.00, 5650.00, 'active', 1, 'https://picsum.photos/seed/ppob-tri/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(22, 4, 'pulsa', 'prepaid', 'TRI10', 'Tri 10.000', 'Tri', '10.000', 10150.00, 200.00, 0.00, 100.00, 10450.00, 'active', 1, 'https://picsum.photos/seed/ppob-tri/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(23, 4, 'pulsa', 'prepaid', 'TRI20', 'Tri 20.000', 'Tri', '20.000', 20100.00, 300.00, 0.00, 200.00, 20600.00, 'active', 1, 'https://picsum.photos/seed/ppob-tri/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(24, 4, 'pulsa', 'prepaid', 'TRI50', 'Tri 50.000', 'Tri', '50.000', 49900.00, 400.00, 0.00, 500.00, 50800.00, 'active', 1, 'https://picsum.photos/seed/ppob-tri/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(25, 5, 'pulsa', 'prepaid', 'AX5', 'Axis 5.000', 'Axis', '5.000', 5400.00, 200.00, 0.00, 50.00, 5650.00, 'active', 1, 'https://picsum.photos/seed/ppob-axis/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(26, 5, 'pulsa', 'prepaid', 'AX10', 'Axis 10.000', 'Axis', '10.000', 10100.00, 200.00, 0.00, 100.00, 10400.00, 'active', 1, 'https://picsum.photos/seed/ppob-axis/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(27, 5, 'pulsa', 'prepaid', 'AX20', 'Axis 20.000', 'Axis', '20.000', 20000.00, 300.00, 0.00, 200.00, 20500.00, 'active', 1, 'https://picsum.photos/seed/ppob-axis/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(28, 5, 'pulsa', 'prepaid', 'AX50', 'Axis 50.000', 'Axis', '50.000', 49800.00, 400.00, 0.00, 500.00, 50700.00, 'active', 1, 'https://picsum.photos/seed/ppob-axis/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(29, 6, 'pulsa', 'prepaid', 'SMR5', 'Smartfren 5.000', 'Smartfren', '5.000', 5450.00, 200.00, 0.00, 50.00, 5700.00, 'active', 1, 'https://picsum.photos/seed/ppob-smartfren/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(30, 6, 'pulsa', 'prepaid', 'SMR10', 'Smartfren 10.000', 'Smartfren', '10.000', 10200.00, 200.00, 0.00, 100.00, 10500.00, 'active', 1, 'https://picsum.photos/seed/ppob-smartfren/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(31, 6, 'pulsa', 'prepaid', 'SMR20', 'Smartfren 20.000', 'Smartfren', '20.000', 20100.00, 300.00, 0.00, 200.00, 20600.00, 'active', 1, 'https://picsum.photos/seed/ppob-smartfren/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(32, 6, 'pulsa', 'prepaid', 'SMR50', 'Smartfren 50.000', 'Smartfren', '50.000', 50000.00, 400.00, 0.00, 500.00, 50900.00, 'active', 1, 'https://picsum.photos/seed/ppob-smartfren/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(33, 7, 'pulsa', 'prepaid', 'BYU10', 'by.U 10.000', 'by.U', '10.000', 10200.00, 200.00, 0.00, 100.00, 10500.00, 'active', 1, 'https://picsum.photos/seed/ppob-by.u/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(34, 7, 'pulsa', 'prepaid', 'BYU25', 'by.U 25.000', 'by.U', '25.000', 25100.00, 300.00, 0.00, 300.00, 25700.00, 'active', 1, 'https://picsum.photos/seed/ppob-by.u/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(35, 8, 'data', 'prepaid', 'DF1GB', 'Indosat Freedom 1GB', 'Indosat', '1 GB', 9900.00, 400.00, 0.00, 300.00, 10600.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(36, 8, 'data', 'prepaid', 'DF2GB', 'Indosat Freedom 2GB', 'Indosat', '2 GB', 14900.00, 500.00, 0.00, 300.00, 15700.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(37, 8, 'data', 'prepaid', 'DF3GB', 'Indosat Freedom 3GB', 'Indosat', '3 GB', 19000.00, 500.00, 0.00, 500.00, 20000.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(38, 8, 'data', 'prepaid', 'DF5GB', 'Indosat Freedom 5GB', 'Indosat', '5 GB', 25000.00, 500.00, 0.00, 500.00, 26000.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(39, 8, 'data', 'prepaid', 'DF8GB', 'Indosat Freedom 8GB', 'Indosat', '8 GB', 36000.00, 600.00, 0.00, 500.00, 37100.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(40, 8, 'data', 'prepaid', 'DF10GB', 'Indosat Freedom 10GB', 'Indosat', '10 GB', 40500.00, 600.00, 0.00, 500.00, 41600.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(41, 8, 'data', 'prepaid', 'DF12GB', 'Indosat Freedom 12GB', 'Indosat', '12 GB', 45500.00, 700.00, 0.00, 800.00, 47000.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(42, 8, 'data', 'prepaid', 'DF20GB', 'Indosat Freedom 20GB', 'Indosat', '20 GB', 67500.00, 900.00, 0.00, 1000.00, 69400.00, 'active', 1, 'https://picsum.photos/seed/ppob-indosat/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(43, 9, 'data', 'prepaid', 'TS1GB', 'Telkomsel Seluler 1GB', 'Telkomsel', '1 GB', 10500.00, 400.00, 0.00, 300.00, 11200.00, 'active', 1, 'https://picsum.photos/seed/ppob-telkomsel/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(44, 9, 'data', 'prepaid', 'TS3GB', 'Telkomsel Seluler 3GB', 'Telkomsel', '3 GB', 21000.00, 500.00, 0.00, 500.00, 22000.00, 'active', 1, 'https://picsum.photos/seed/ppob-telkomsel/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(45, 9, 'data', 'prepaid', 'TS5GB', 'Telkomsel Seluler 5GB', 'Telkomsel', '5 GB', 28000.00, 600.00, 0.00, 500.00, 29100.00, 'active', 1, 'https://picsum.photos/seed/ppob-telkomsel/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(46, 9, 'data', 'prepaid', 'TS10GB', 'Telkomsel Seluler 10GB', 'Telkomsel', '10 GB', 46000.00, 800.00, 0.00, 800.00, 47600.00, 'active', 1, 'https://picsum.photos/seed/ppob-telkomsel/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(47, 10, 'data', 'prepaid', 'XL1GB', 'XL Prioritas 1GB', 'XL', '1 GB', 10000.00, 400.00, 0.00, 300.00, 10700.00, 'active', 1, 'https://picsum.photos/seed/ppob-xl/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(48, 10, 'data', 'prepaid', 'XL5GB', 'XL Prioritas 5GB', 'XL', '5 GB', 24000.00, 500.00, 0.00, 500.00, 25000.00, 'active', 1, 'https://picsum.photos/seed/ppob-xl/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(49, 10, 'data', 'prepaid', 'XL20GB', 'XL Prioritas 20GB', 'XL', '20 GB', 62000.00, 900.00, 0.00, 1000.00, 63900.00, 'active', 1, 'https://picsum.photos/seed/ppob-xl/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(50, 11, 'data', 'prepaid', 'TRD1GB', 'Tri 1GB', 'Tri', '1 GB', 9500.00, 400.00, 0.00, 300.00, 10200.00, 'active', 1, 'https://picsum.photos/seed/ppob-tri/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(51, 11, 'data', 'prepaid', 'TRD8GB', 'Tri 8GB', 'Tri', '8 GB', 30000.00, 600.00, 0.00, 600.00, 31200.00, 'active', 1, 'https://picsum.photos/seed/ppob-tri/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(52, 12, 'data', 'prepaid', 'AXD1GB', 'Axis 1GB', 'Axis', '1 GB', 9800.00, 400.00, 0.00, 300.00, 10500.00, 'active', 1, 'https://picsum.photos/seed/ppob-axis/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(53, 12, 'data', 'prepaid', 'AXD5GB', 'Axis 5GB', 'Axis', '5 GB', 23000.00, 500.00, 0.00, 500.00, 24000.00, 'active', 1, 'https://picsum.photos/seed/ppob-axis/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(54, 13, 'data', 'prepaid', 'SMD1GB', 'Smartfren 1GB', 'Smartfren', '1 GB', 9900.00, 400.00, 0.00, 300.00, 10600.00, 'active', 1, 'https://picsum.photos/seed/ppob-smartfren/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(55, 13, 'data', 'prepaid', 'SMD5GB', 'Smartfren 5GB', 'Smartfren', '5 GB', 26000.00, 500.00, 0.00, 500.00, 27000.00, 'active', 1, 'https://picsum.photos/seed/ppob-smartfren/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(56, 14, 'token-listrik', 'prepaid', 'TOK20', 'Token PLN 20.000', 'Token', '20.000', 19900.00, 2400.00, 200.00, 0.00, 22300.00, 'active', 1, 'https://picsum.photos/seed/ppob-token/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(57, 14, 'token-listrik', 'prepaid', 'TOK50', 'Token PLN 50.000', 'Token', '50.000', 49900.00, 2600.00, 200.00, 0.00, 52500.00, 'active', 1, 'https://picsum.photos/seed/ppob-token/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(58, 14, 'token-listrik', 'prepaid', 'TOK100', 'Token PLN 100.000', 'Token', '100.000', 99900.00, 2800.00, 200.00, 0.00, 102700.00, 'active', 1, 'https://picsum.photos/seed/ppob-token/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(59, 14, 'token-listrik', 'prepaid', 'TOK200', 'Token PLN 200.000', 'Token', '200.000', 199900.00, 3200.00, 200.00, 0.00, 203100.00, 'active', 1, 'https://picsum.photos/seed/ppob-token/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(60, 14, 'token-listrik', 'prepaid', 'TOK500', 'Token PLN 500.000', 'Token', '500.000', 499900.00, 3500.00, 200.00, 0.00, 503400.00, 'active', 1, 'https://picsum.photos/seed/ppob-token/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(61, 15, 'tagihan', 'postpaid', 'PLNPB', 'Pembayaran Tagihan Listrik PLN', 'Pembayaran', NULL, 0.00, 2500.00, 0.00, 0.00, 2500.00, 'active', 1, 'https://picsum.photos/seed/ppob-pembayaran/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(62, 16, 'tagihan', 'postpaid', 'PDAMPB', 'Pembayaran Tagihan PDAM', 'Pembayaran', NULL, 0.00, 2000.00, 0.00, 0.00, 2000.00, 'active', 1, 'https://picsum.photos/seed/ppob-pembayaran/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(63, 17, 'internet', 'postpaid', 'IH30', 'IndiHome 30 Mbps', 'IndiHome', '30 Mbps', 285000.00, 3000.00, 0.00, 0.00, 288000.00, 'active', 1, 'https://picsum.photos/seed/ppob-indihome/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(64, 17, 'internet', 'postpaid', 'IH50', 'IndiHome 50 Mbps', 'IndiHome', '50 Mbps', 360000.00, 3000.00, 0.00, 0.00, 363000.00, 'active', 1, 'https://picsum.photos/seed/ppob-indihome/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(65, 18, 'internet', 'postpaid', 'FM100', 'First Media 100 Mbps', 'First', '100 Mbps', 350000.00, 3000.00, 0.00, 0.00, 353000.00, 'active', 1, 'https://picsum.photos/seed/ppob-first/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(66, 19, 'internet', 'postpaid', 'BZ50', 'Biznet 50 Mbps', 'Biznet', '50 Mbps', 250000.00, 3000.00, 0.00, 0.00, 253000.00, 'active', 1, 'https://picsum.photos/seed/ppob-biznet/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(67, 20, 'voucher', 'prepaid', 'VCR10', 'Voucher Game 10.000', 'Voucher', '10.000', 10150.00, 200.00, 0.00, 100.00, 10450.00, 'active', 1, 'https://picsum.photos/seed/ppob-voucher/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL),
(68, 20, 'voucher', 'prepaid', 'VCR50', 'Voucher Game 50.000', 'Voucher', '50.000', 49900.00, 300.00, 0.00, 500.00, 50700.00, 'active', 1, 'https://picsum.photos/seed/ppob-voucher/128/128', NULL, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:56', '2026-09-14 00:59:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ppob_transactions`
--

CREATE TABLE `ppob_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference_id` varchar(100) NOT NULL,
  `user_id` char(36) NOT NULL,
  `operator_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `provider_product_code` varchar(80) DEFAULT NULL,
  `product_name` varchar(200) DEFAULT NULL,
  `category` varchar(40) NOT NULL,
  `product_type` varchar(20) NOT NULL DEFAULT 'prepaid',
  `customer_id` varchar(120) NOT NULL,
  `customer_name` varchar(160) DEFAULT NULL,
  `bill_amount` decimal(15,2) DEFAULT NULL,
  `provider_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `admin_fee` decimal(15,2) NOT NULL DEFAULT 0.00,
  `commission` decimal(15,2) NOT NULL DEFAULT 0.00,
  `margin` decimal(15,2) NOT NULL DEFAULT 0.00,
  `revenue` decimal(15,2) NOT NULL DEFAULT 0.00,
  `net_profit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` varchar(30) NOT NULL DEFAULT 'pending',
  `snap_token` varchar(500) DEFAULT NULL,
  `midtrans_snap_token` text DEFAULT NULL,
  `midtrans_transaction_id` varchar(100) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `provider_status` varchar(20) DEFAULT NULL,
  `provider_message` varchar(255) DEFAULT NULL,
  `tr_id` varchar(40) DEFAULT NULL,
  `sn` varchar(500) DEFAULT NULL,
  `pin` varchar(255) DEFAULT NULL,
  `provider_raw_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`provider_raw_response`)),
  `callback_signature` varchar(80) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ppob_transactions`
--

INSERT INTO `ppob_transactions` (`id`, `reference_id`, `user_id`, `operator_id`, `product_id`, `provider_product_code`, `product_name`, `category`, `product_type`, `customer_id`, `customer_name`, `bill_amount`, `provider_price`, `admin_fee`, `commission`, `margin`, `revenue`, `net_profit`, `total_amount`, `payment_method`, `payment_status`, `snap_token`, `midtrans_snap_token`, `midtrans_transaction_id`, `status`, `provider_status`, `provider_message`, `tr_id`, `sn`, `pin`, `provider_raw_response`, `callback_signature`, `paid_at`, `completed_at`, `expires_at`, `cancelled_at`, `metadata`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'PPOB260915075243BPQZVY', '1ae55236-f781-406a-baa7-62635f4c9545', 14, 56, 'TOK20', 'Token PLN 20.000', 'token-listrik', 'prepaid', '0766696986', NULL, NULL, 19900.00, 2400.00, 200.00, 0.00, 22300.00, 2400.00, 22300.00, 'midtrans', 'pending', NULL, '873ed0b0-d907-41cd-9c46-a31b915f920c', NULL, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-15 01:07:45', NULL, NULL, 1, '1ae55236-f781-406a-baa7-62635f4c9545', '1ae55236-f781-406a-baa7-62635f4c9545', '2026-09-15 00:52:45', '2026-09-15 00:52:45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ppob_transaction_logs`
--

CREATE TABLE `ppob_transaction_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ppob_transaction_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reference_id` varchar(100) NOT NULL,
  `action` varchar(40) NOT NULL,
  `direction` varchar(20) NOT NULL,
  `request_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`request_payload`)),
  `response_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`response_payload`)),
  `http_status` int(11) DEFAULT NULL,
  `provider_status` varchar(20) DEFAULT NULL,
  `provider_message` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `primary_category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'published',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `allows_preorder` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `store_id`, `primary_category_id`, `name`, `slug`, `description`, `brand`, `thumbnail`, `status`, `is_active`, `allows_preorder`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 3, 'Keripik Singkong Balado', 'sari-nusantara-keripik-singkong-balado', 'Keripik singkong gurih bumbu balado, tanpa pengawet.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Sari Nusantara', 'https://picsum.photos/seed/sari-nusantara-keripik-singkong-balado/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(2, 1, 3, 'Keripik Pisang Cokelat', 'sari-nusantara-keripik-pisang-cokelat', 'Keripik pisang renyah lapisan cokelat premium.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Sari Nusantara', 'https://picsum.photos/seed/sari-nusantara-keripik-pisang-cokelat/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(3, 1, 4, 'Kue Kering Nastar', 'sari-nusantara-kue-kering-nastar', 'Nastar lembut dengan selai nanas asli, kemasan toples 250g.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Sari Nusantara', 'https://picsum.photos/seed/sari-nusantara-kue-kering-nastar/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(4, 1, 4, 'Kue Kering Kastengel', 'sari-nusantara-kue-kering-kastengel', 'Kastengel renyah taburan keju edam.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Sari Nusantara', 'https://picsum.photos/seed/sari-nusantara-kue-kering-kastengel/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', '2026-09-14 00:59:45', '2026-09-26 23:07:54', NULL),
(5, 1, 5, 'Cokelat Batik Mini', 'sari-nusantara-cokelat-batik-mini', 'Cokelat mini motif batik, cocok untuk hantaran.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Sari Nusantara', 'https://picsum.photos/seed/sari-nusantara-cokelat-batik-mini/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(6, 1, 5, 'Permen Jahe Jadul', 'sari-nusantara-permen-jahe-jadul', 'Permen jahe legendaris, hangat di tenggorokan.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Sari Nusantara', 'https://picsum.photos/seed/sari-nusantara-permen-jahe-jadul/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(7, 1, 4, 'Oleh-Oleh Pisang Goreng Pasir', 'sari-nusantara-pisang-goreng-pasir', 'Bekal oleh-oleh khas, renyah dan manis.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Sari NusantaraaA', 'https://picsum.photos/seed/sari-nusantara-pisang-goreng-pasir/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', '2026-09-14 00:59:45', '2026-09-27 06:27:26', NULL),
(8, 1, 13, 'Sari Kelapa Muda Botol', 'sari-nusantara-sari-kelapa-muda', 'Minuman sari kelapa muda segar kemasan botol 300ml.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Sari Nusantara', 'https://picsum.photos/seed/sari-nusantara-sari-kelapa-muda/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', '2026-09-14 00:59:45', '2026-09-27 06:28:09', NULL),
(9, 2, 25, 'Smart Speaker Mini Bass', 'raka-teknologi-smart-speaker-mini', 'Speaker pintar bluetooth dengan bass solid dan mikrofon jernih.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Raka Audio', 'https://picsum.photos/seed/raka-teknologi-smart-speaker-mini/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(10, 2, 26, 'TWS Earbuds Pro', 'raka-teknologi-tws-earbuds-pro', 'Earbuds nirkabel dengan noise reduction dan game mode.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Raka Audio', 'https://picsum.photos/seed/raka-teknologi-tws-earbuds-pro/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(11, 2, 26, 'Headphone Over-Ear Studio', 'raka-teknologi-headphone-over-ear', 'Headphone studio dengan driver 40mm dan busa empuk.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Raka Audio', 'https://picsum.photos/seed/raka-teknologi-headphone-over-ear/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(12, 2, 28, 'Kabel Data Type-C Nylon', 'raka-teknologi-kabel-data-typec', 'Kabel data type-c nylon tahan lama, fast charging.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Raka Audio', 'https://picsum.photos/seed/raka-teknologi-kabel-data-typec/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(13, 2, 28, 'Adaptor Charger 45W GaN', 'raka-teknologi-adaptor-charger-45w', 'Charger GaN cepat 45W dual port.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Raka Audio', 'https://picsum.photos/seed/raka-teknologi-adaptor-charger-45w/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(14, 2, 29, 'Powerbank 10000mAh Slim', 'raka-teknologi-powerbank-10000', 'Powerbank tipis 10000mAh dengan indikator LED.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Raka Audio', 'https://picsum.photos/seed/raka-teknologi-powerbank-10000/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(15, 2, 29, 'Powerbank 20000mAh Fast', 'raka-teknologi-powerbank-20000', 'Powerbank 20000mAh dengan fast charging 22.5W.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Raka Audio', 'https://picsum.photos/seed/raka-teknologi-powerbank-20000/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000102', '2026-09-14 00:59:45', '2026-09-21 02:10:54', NULL),
(16, 2, 30, 'Case HP Silikon Transparan', 'raka-teknologi-case-hp-silikon', 'Case silikon anti gores, ringan dan pas di genggaman.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Raka Audioo', 'https://picsum.photos/seed/raka-teknologi-case-hp-silikon/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000102', '2026-09-14 00:59:45', '2026-09-22 21:10:48', NULL),
(17, 3, 11, 'Kopi Arabika Gayo 250g', 'kopi-nusantara-kopi-arabika-gayo', 'Arabika Gayo rasa cokelat-karamel, full body.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Rumah Kopi Nusantara', 'https://picsum.photos/seed/kopi-nusantara-kopi-arabika-gayo/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(18, 3, 11, 'Kopi Kintamani 250g', 'kopi-nusantara-kopi-kintamani', 'Kintamani terang dengan aroma citrus khas dataran tinggi Bali.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Rumah Kopi Nusantara', 'https://picsum.photos/seed/kopi-nusantara-kopi-kintamani/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(19, 3, 11, 'Kopi Toraja 250g', 'kopi-nusantara-kopi-toraja', 'Toraja dengan aftertaste rempah dan earthy.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Rumah Kopi Nusantara', 'https://picsum.photos/seed/kopi-nusantara-kopi-toraja/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(20, 3, 11, 'Kopi Lanang Jawa 250g', 'kopi-nusantara-kopi-lanang-jawa', 'Kopi lanang robusta Java premium.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Rumah Kopi Nusantara', 'https://picsum.photos/seed/kopi-nusantara-kopi-lanang-jawa/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(21, 3, 12, 'Teh Melati Premium 50 Kantong', 'kopi-nusantara-teh-melati-premium', 'Teh melati pilihan dengan wangi bunga yang lembut.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Rumah Kopi Nusantara', 'https://picsum.photos/seed/kopi-nusantara-teh-melati-premium/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(22, 3, 12, 'Teh Sari Daun Gambir', 'kopi-nusantara-teh-sari-gambir', 'Teh herbal daun gambir berkhasiat.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Rumah Kopi Nusantara', 'https://picsum.photos/seed/kopi-nusantara-teh-sari-gambir/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(23, 3, 11, 'Kopi Tubruk Sachet', 'kopi-nusantara-kopi-tubruk-sachet', 'Kopi tubruk siap seduh dalam sachet praktis.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Rumah Kopi Nusantara', 'https://picsum.photos/seed/kopi-nusantara-kopi-tubruk-sachet/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(24, 3, 13, 'Sirup Gula Aren Premium', 'kopi-nusantara-sirup-gula-aren', 'Sirup gula aren asli untuk pendamping kopi dan es.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Rumah Kopi Nusantara', 'https://picsum.photos/seed/kopi-nusantara-sirup-gula-aren/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(25, 4, 36, 'Kemeja Batik Tulis Solo', 'purnama-batik-kemeja-batik-tulis-solo', 'Kemeja batik tulis Sogan asli Solo, jahitan rapi.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Purnama Batik', 'https://picsum.photos/seed/purnama-batik-kemeja-batik-tulis-solo/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(26, 4, 36, 'Kemeja Batik Cap Mega Mendung', 'purnama-batik-kemeja-batik-cap', 'Batik cap Mega Mendung Cirebon, warna tajam.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Purnama Batik', 'https://picsum.photos/seed/purnama-batik-kemeja-batik-cap/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(27, 4, 40, 'Kaos Batik Printing Pria', 'purnama-batik-kaos-batik-printing', 'Kaos batik printing motif kontemporer, bahan cotton combed.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Purnama Batik', 'https://picsum.photos/seed/purnama-batik-kaos-batik-printing/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(28, 4, 39, 'Kaos Polos Katun Combed', 'purnama-batik-kaos-polos-katun', 'Kaos polos katun combed 30s, nyaman dipakai.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Purnama Batik', 'https://picsum.photos/seed/purnama-batik-kaos-polos-katun/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(29, 4, 43, 'Blouse Batik Modern', 'purnama-batik-blouse-batik-modern', 'Blouse batik modern flowy untuk acara formal dan santai.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Purnama Batik', 'https://picsum.photos/seed/purnama-batik-blouse-batik-modern/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(30, 4, 44, 'Kebaya Encim Batik Pekalongan', 'purnama-batik-kebaya-encim', 'Kebaya encim dengan detail payet dan batik Pekalongan.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Purnama Batik', 'https://picsum.photos/seed/purnama-batik-kebaya-encim/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(31, 4, 50, 'Kain Batik Tulis 2 Meter', 'purnama-batik-kain-batik-tulis', 'Kain batik tulis halus, cocok untuk busana custom.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Purnama Batik', 'https://picsum.photos/seed/purnama-batik-kain-batik-tulis/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(32, 4, 55, 'Kain Lurik Asli Klaten', 'purnama-batik-kain-lurik-klaten', 'Lurik tenun tangan asli Klaten, motif klasik.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Purnama Batik', 'https://picsum.photos/seed/purnama-batik-kain-lurik-klaten/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(33, 5, 58, 'Pulpen Gel JC Style 0.5 mm', 'ananda-stationery-pulpen-gel-jc', 'Pulpen gel tinta licin, pack isi 12.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Ananda', 'https://picsum.photos/seed/ananda-stationery-pulpen-gel-jc/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(34, 5, 58, 'Pulpen Standard AE7', 'ananda-stationery-pulpen-standard-ae7', 'Pulpen standard klasik, tinta awet.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Ananda', 'https://picsum.photos/seed/ananda-stationery-pulpen-standard-ae7/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(35, 5, 59, 'Pensil Kayu 2B (Pack 12)', 'ananda-stationery-pensil-2b-pack', 'Pensil kayu premium hitam 2B.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Ananda', 'https://picsum.photos/seed/ananda-stationery-pensil-2b-pack/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(36, 5, 62, 'Buku Catatan Hardcover A5', 'ananda-stationery-buku-catatan-a5', 'Buku catatan hardcover A5 80 halaman grid.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Ananda', 'https://picsum.photos/seed/ananda-stationery-buku-catatan-a5/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(37, 5, 63, 'Kertas HVS A4 70gsm', 'ananda-stationery-kertas-hvs-a4', 'Kertas HVS A4 70gsm, 1 rim 500 lembar.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Ananda', 'https://picsum.photos/seed/ananda-stationery-kertas-hvs-a4/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(38, 5, 64, 'Kertas Kado Motif (Pack 10)', 'ananda-stationery-kertas-kado-motif', 'Kertas kado aneka motif premium ukuran 70x100cm.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Ananda', 'https://picsum.photos/seed/ananda-stationery-kertas-kado-motif/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(39, 5, 67, 'Stiker Label Aneka Ukuran', 'ananda-stationery-stiker-label', 'Stiker label putih untuk barcode dan keperluan usaha.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Ananda', 'https://picsum.photos/seed/ananda-stationery-stiker-label/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(40, 5, 68, 'Washi Tape Set 10 pcs', 'ananda-stationery-washi-tape-10', 'Washi tape motif 10 pcs untuk dekorasi scrapbook.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Ananda', 'https://picsum.photos/seed/ananda-stationery-washi-tape-10/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(41, 6, 9, 'Paket Nasi Ayam Goreng', 'sentra-operasional-nasi-ayam-goreng', 'Paket nasi ayam goreng lengkap: nasi, ayam, sambal, sayur.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Sentra Ops', 'https://picsum.photos/seed/sentra-operasional-nasi-ayam-goreng/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(42, 6, 7, 'Bakso Sapi Original 500g', 'sentra-operasional-bakso-sapi-500g', 'Bakso sapi tanpa pengawet, tekstur kenyal.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Sentra Ops', 'https://picsum.photos/seed/sentra-operasional-bakso-sapi-500g/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(43, 6, 8, 'Sate Ayam Maranggi (12 Tusuk)', 'sentra-operasional-sate-ayam-maranggi', 'Sate ayam maranggi siap masak dengan bumbu lengkap.\n\nDikemas dengan standar higienis dan pengiriman aman. Garansi toko berlaku sesuai ketentuan.', 'Sentra Ops', 'https://picsum.photos/seed/sentra-operasional-sate-ayam-maranggi/600/600', 'published', 1, 0, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_attributes`
--

CREATE TABLE `product_attributes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'select',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_attributes`
--

INSERT INTO `product_attributes` (`id`, `name`, `slug`, `type`, `created_at`, `updated_at`) VALUES
(1, 'Warna', 'warna', 'select', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(2, 'Ukuran', 'ukuran', 'select', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(3, 'Kapasitas', 'kapasitas', 'select', '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(4, 'Berat', 'berat', 'select', '2026-09-14 00:59:44', '2026-09-14 00:59:44');

-- --------------------------------------------------------

--
-- Table structure for table `product_attribute_values`
--

CREATE TABLE `product_attribute_values` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `attribute_id` bigint(20) UNSIGNED NOT NULL,
  `value` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_attribute_values`
--

INSERT INTO `product_attribute_values` (`id`, `product_id`, `attribute_id`, `value`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(2, 2, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(3, 3, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(4, 4, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(5, 5, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(6, 6, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(7, 7, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(8, 8, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(9, 9, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(10, 10, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(11, 11, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(12, 12, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(13, 13, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(14, 14, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(15, 15, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(16, 16, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(17, 17, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(18, 18, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(19, 19, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(20, 20, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(21, 21, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(22, 22, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(23, 23, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(24, 24, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(25, 25, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(26, 26, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(27, 27, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(28, 28, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(29, 29, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(30, 30, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(31, 31, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(32, 32, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(33, 33, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(34, 34, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(35, 35, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(36, 36, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(37, 37, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(38, 38, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(39, 39, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(40, 40, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(41, 41, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(42, 42, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(43, 43, 1, 'default', '2026-09-14 00:59:45', '2026-09-14 00:59:45');

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`product_id`, `category_id`, `is_primary`, `created_at`, `updated_at`) VALUES
(1, 3, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(2, 3, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(3, 4, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(4, 4, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(5, 5, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(6, 5, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(7, 4, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(8, 13, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(9, 25, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(10, 26, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(11, 26, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(12, 28, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(13, 28, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(14, 29, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(15, 29, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(16, 30, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(17, 11, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(18, 11, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(19, 11, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(20, 11, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(21, 12, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(22, 12, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(23, 11, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(24, 13, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(25, 36, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(26, 36, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(27, 40, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(28, 39, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(29, 43, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(30, 44, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(31, 50, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(32, 55, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(33, 58, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(34, 58, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(35, 59, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(36, 62, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(37, 63, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(38, 64, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(39, 67, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(40, 68, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(41, 9, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(42, 7, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(43, 8, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45');

-- --------------------------------------------------------

--
-- Table structure for table `product_costings`
--

CREATE TABLE `product_costings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `material_cost` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `labor_cost` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `overhead_cost` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `other_cost` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `hpp` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `margin_percent` decimal(8,4) NOT NULL DEFAULT 0.0000,
  `suggested_price` decimal(18,2) NOT NULL DEFAULT 0.00,
  `selling_price` decimal(18,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_costings`
--

INSERT INTO `product_costings` (`id`, `product_id`, `store_id`, `material_cost`, `labor_cost`, `overhead_cost`, `other_cost`, `hpp`, `margin_percent`, `suggested_price`, `selling_price`, `created_at`, `updated_at`) VALUES
(1, 41, 6, 14740.0000, 2948.0000, 1768.8000, 0.0000, 19456.8000, -8.0900, 26300.00, 18000.00, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(2, 42, 6, 47740.0000, 9548.0000, 5728.8000, 0.0000, 63016.8000, -21.1900, 85100.00, 52000.00, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(3, 43, 6, 18560.0000, 3712.0000, 2227.2000, 0.0000, 24499.2000, 35.5300, 33100.00, 38000.00, '2026-09-14 00:59:45', '2026-09-14 00:59:45');

-- --------------------------------------------------------

--
-- Table structure for table `product_costing_impacts`
--

CREATE TABLE `product_costing_impacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `raw_material_id` bigint(20) UNSIGNED DEFAULT NULL,
  `raw_material_cost_history_id` bigint(20) UNSIGNED DEFAULT NULL,
  `old_material_cost` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `new_material_cost` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `old_hpp` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `new_hpp` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `hpp_change_amount` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `hpp_change_percent` decimal(12,4) NOT NULL DEFAULT 0.0000,
  `old_suggested_price` decimal(18,2) NOT NULL DEFAULT 0.00,
  `new_suggested_price` decimal(18,2) NOT NULL DEFAULT 0.00,
  `trigger_type` varchar(50) NOT NULL DEFAULT 'raw_material_cost_change',
  `occurred_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_costing_impacts`
--

INSERT INTO `product_costing_impacts` (`id`, `store_id`, `product_id`, `raw_material_id`, `raw_material_cost_history_id`, `old_material_cost`, `new_material_cost`, `old_hpp`, `new_hpp`, `hpp_change_amount`, `hpp_change_percent`, `old_suggested_price`, `new_suggested_price`, `trigger_type`, `occurred_at`, `created_at`, `updated_at`) VALUES
(1, 6, 41, 2, NULL, 30000.0000, 32000.0000, 13500.0000, 14500.0000, 1000.0000, 7.4100, 17000.00, 18000.00, 'raw_material_cost_change', '2026-09-06 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `url` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `url`, `alt_text`, `is_primary`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 1, 'https://picsum.photos/seed/seed-sari-nusantara-keripik-singkong-balado-1/800/800', 'Foto utama Keripik Singkong Balado', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(2, 1, 'https://picsum.photos/seed/seed-sari-nusantara-keripik-singkong-balado-2/800/800', 'Foto detail 2 Keripik Singkong Balado', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(3, 1, 'https://picsum.photos/seed/seed-sari-nusantara-keripik-singkong-balado-3/800/800', 'Foto detail 3 Keripik Singkong Balado', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(4, 1, 'https://picsum.photos/seed/seed-sari-nusantara-keripik-singkong-balado-4/800/800', 'Foto detail 4 Keripik Singkong Balado', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(5, 2, 'https://picsum.photos/seed/seed-sari-nusantara-keripik-pisang-cokelat-1/800/800', 'Foto utama Keripik Pisang Cokelat', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(6, 2, 'https://picsum.photos/seed/seed-sari-nusantara-keripik-pisang-cokelat-2/800/800', 'Foto detail 2 Keripik Pisang Cokelat', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(7, 2, 'https://picsum.photos/seed/seed-sari-nusantara-keripik-pisang-cokelat-3/800/800', 'Foto detail 3 Keripik Pisang Cokelat', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(8, 2, 'https://picsum.photos/seed/seed-sari-nusantara-keripik-pisang-cokelat-4/800/800', 'Foto detail 4 Keripik Pisang Cokelat', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(9, 3, 'https://picsum.photos/seed/seed-sari-nusantara-kue-kering-nastar-1/800/800', 'Foto utama Kue Kering Nastar', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(10, 3, 'https://picsum.photos/seed/seed-sari-nusantara-kue-kering-nastar-2/800/800', 'Foto detail 2 Kue Kering Nastar', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(11, 3, 'https://picsum.photos/seed/seed-sari-nusantara-kue-kering-nastar-3/800/800', 'Foto detail 3 Kue Kering Nastar', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(12, 3, 'https://picsum.photos/seed/seed-sari-nusantara-kue-kering-nastar-4/800/800', 'Foto detail 4 Kue Kering Nastar', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(17, 5, 'https://picsum.photos/seed/seed-sari-nusantara-cokelat-batik-mini-1/800/800', 'Foto utama Cokelat Batik Mini', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(18, 5, 'https://picsum.photos/seed/seed-sari-nusantara-cokelat-batik-mini-2/800/800', 'Foto detail 2 Cokelat Batik Mini', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(19, 5, 'https://picsum.photos/seed/seed-sari-nusantara-cokelat-batik-mini-3/800/800', 'Foto detail 3 Cokelat Batik Mini', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(20, 5, 'https://picsum.photos/seed/seed-sari-nusantara-cokelat-batik-mini-4/800/800', 'Foto detail 4 Cokelat Batik Mini', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(21, 6, 'https://picsum.photos/seed/seed-sari-nusantara-permen-jahe-jadul-1/800/800', 'Foto utama Permen Jahe Jadul', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(22, 6, 'https://picsum.photos/seed/seed-sari-nusantara-permen-jahe-jadul-2/800/800', 'Foto detail 2 Permen Jahe Jadul', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(23, 6, 'https://picsum.photos/seed/seed-sari-nusantara-permen-jahe-jadul-3/800/800', 'Foto detail 3 Permen Jahe Jadul', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(24, 6, 'https://picsum.photos/seed/seed-sari-nusantara-permen-jahe-jadul-4/800/800', 'Foto detail 4 Permen Jahe Jadul', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(33, 9, 'https://picsum.photos/seed/seed-raka-teknologi-smart-speaker-mini-1/800/800', 'Foto utama Smart Speaker Mini Bass', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(34, 9, 'https://picsum.photos/seed/seed-raka-teknologi-smart-speaker-mini-2/800/800', 'Foto detail 2 Smart Speaker Mini Bass', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(35, 9, 'https://picsum.photos/seed/seed-raka-teknologi-smart-speaker-mini-3/800/800', 'Foto detail 3 Smart Speaker Mini Bass', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(36, 9, 'https://picsum.photos/seed/seed-raka-teknologi-smart-speaker-mini-4/800/800', 'Foto detail 4 Smart Speaker Mini Bass', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(37, 10, 'https://picsum.photos/seed/seed-raka-teknologi-tws-earbuds-pro-1/800/800', 'Foto utama TWS Earbuds Pro', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(38, 10, 'https://picsum.photos/seed/seed-raka-teknologi-tws-earbuds-pro-2/800/800', 'Foto detail 2 TWS Earbuds Pro', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(39, 10, 'https://picsum.photos/seed/seed-raka-teknologi-tws-earbuds-pro-3/800/800', 'Foto detail 3 TWS Earbuds Pro', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(40, 10, 'https://picsum.photos/seed/seed-raka-teknologi-tws-earbuds-pro-4/800/800', 'Foto detail 4 TWS Earbuds Pro', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(41, 11, 'https://picsum.photos/seed/seed-raka-teknologi-headphone-over-ear-1/800/800', 'Foto utama Headphone Over-Ear Studio', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(42, 11, 'https://picsum.photos/seed/seed-raka-teknologi-headphone-over-ear-2/800/800', 'Foto detail 2 Headphone Over-Ear Studio', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(43, 11, 'https://picsum.photos/seed/seed-raka-teknologi-headphone-over-ear-3/800/800', 'Foto detail 3 Headphone Over-Ear Studio', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(44, 11, 'https://picsum.photos/seed/seed-raka-teknologi-headphone-over-ear-4/800/800', 'Foto detail 4 Headphone Over-Ear Studio', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(45, 12, 'https://picsum.photos/seed/seed-raka-teknologi-kabel-data-typec-1/800/800', 'Foto utama Kabel Data Type-C Nylon', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(46, 12, 'https://picsum.photos/seed/seed-raka-teknologi-kabel-data-typec-2/800/800', 'Foto detail 2 Kabel Data Type-C Nylon', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(47, 12, 'https://picsum.photos/seed/seed-raka-teknologi-kabel-data-typec-3/800/800', 'Foto detail 3 Kabel Data Type-C Nylon', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(48, 12, 'https://picsum.photos/seed/seed-raka-teknologi-kabel-data-typec-4/800/800', 'Foto detail 4 Kabel Data Type-C Nylon', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(49, 13, 'https://picsum.photos/seed/seed-raka-teknologi-adaptor-charger-45w-1/800/800', 'Foto utama Adaptor Charger 45W GaN', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(50, 13, 'https://picsum.photos/seed/seed-raka-teknologi-adaptor-charger-45w-2/800/800', 'Foto detail 2 Adaptor Charger 45W GaN', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(51, 13, 'https://picsum.photos/seed/seed-raka-teknologi-adaptor-charger-45w-3/800/800', 'Foto detail 3 Adaptor Charger 45W GaN', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(52, 13, 'https://picsum.photos/seed/seed-raka-teknologi-adaptor-charger-45w-4/800/800', 'Foto detail 4 Adaptor Charger 45W GaN', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(53, 14, 'https://picsum.photos/seed/seed-raka-teknologi-powerbank-10000-1/800/800', 'Foto utama Powerbank 10000mAh Slim', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(54, 14, 'https://picsum.photos/seed/seed-raka-teknologi-powerbank-10000-2/800/800', 'Foto detail 2 Powerbank 10000mAh Slim', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(55, 14, 'https://picsum.photos/seed/seed-raka-teknologi-powerbank-10000-3/800/800', 'Foto detail 3 Powerbank 10000mAh Slim', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(56, 14, 'https://picsum.photos/seed/seed-raka-teknologi-powerbank-10000-4/800/800', 'Foto detail 4 Powerbank 10000mAh Slim', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(65, 17, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-arabika-gayo-1/800/800', 'Foto utama Kopi Arabika Gayo 250g', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(66, 17, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-arabika-gayo-2/800/800', 'Foto detail 2 Kopi Arabika Gayo 250g', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(67, 17, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-arabika-gayo-3/800/800', 'Foto detail 3 Kopi Arabika Gayo 250g', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(68, 17, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-arabika-gayo-4/800/800', 'Foto detail 4 Kopi Arabika Gayo 250g', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(69, 18, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-kintamani-1/800/800', 'Foto utama Kopi Kintamani 250g', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(70, 18, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-kintamani-2/800/800', 'Foto detail 2 Kopi Kintamani 250g', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(71, 18, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-kintamani-3/800/800', 'Foto detail 3 Kopi Kintamani 250g', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(72, 18, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-kintamani-4/800/800', 'Foto detail 4 Kopi Kintamani 250g', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(73, 19, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-toraja-1/800/800', 'Foto utama Kopi Toraja 250g', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(74, 19, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-toraja-2/800/800', 'Foto detail 2 Kopi Toraja 250g', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(75, 19, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-toraja-3/800/800', 'Foto detail 3 Kopi Toraja 250g', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(76, 19, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-toraja-4/800/800', 'Foto detail 4 Kopi Toraja 250g', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(77, 20, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-lanang-jawa-1/800/800', 'Foto utama Kopi Lanang Jawa 250g', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(78, 20, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-lanang-jawa-2/800/800', 'Foto detail 2 Kopi Lanang Jawa 250g', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(79, 20, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-lanang-jawa-3/800/800', 'Foto detail 3 Kopi Lanang Jawa 250g', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(80, 20, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-lanang-jawa-4/800/800', 'Foto detail 4 Kopi Lanang Jawa 250g', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(81, 21, 'https://picsum.photos/seed/seed-kopi-nusantara-teh-melati-premium-1/800/800', 'Foto utama Teh Melati Premium 50 Kantong', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(82, 21, 'https://picsum.photos/seed/seed-kopi-nusantara-teh-melati-premium-2/800/800', 'Foto detail 2 Teh Melati Premium 50 Kantong', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(83, 21, 'https://picsum.photos/seed/seed-kopi-nusantara-teh-melati-premium-3/800/800', 'Foto detail 3 Teh Melati Premium 50 Kantong', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(84, 21, 'https://picsum.photos/seed/seed-kopi-nusantara-teh-melati-premium-4/800/800', 'Foto detail 4 Teh Melati Premium 50 Kantong', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(85, 22, 'https://picsum.photos/seed/seed-kopi-nusantara-teh-sari-gambir-1/800/800', 'Foto utama Teh Sari Daun Gambir', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(86, 22, 'https://picsum.photos/seed/seed-kopi-nusantara-teh-sari-gambir-2/800/800', 'Foto detail 2 Teh Sari Daun Gambir', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(87, 22, 'https://picsum.photos/seed/seed-kopi-nusantara-teh-sari-gambir-3/800/800', 'Foto detail 3 Teh Sari Daun Gambir', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(88, 22, 'https://picsum.photos/seed/seed-kopi-nusantara-teh-sari-gambir-4/800/800', 'Foto detail 4 Teh Sari Daun Gambir', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(89, 23, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-tubruk-sachet-1/800/800', 'Foto utama Kopi Tubruk Sachet', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(90, 23, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-tubruk-sachet-2/800/800', 'Foto detail 2 Kopi Tubruk Sachet', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(91, 23, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-tubruk-sachet-3/800/800', 'Foto detail 3 Kopi Tubruk Sachet', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(92, 23, 'https://picsum.photos/seed/seed-kopi-nusantara-kopi-tubruk-sachet-4/800/800', 'Foto detail 4 Kopi Tubruk Sachet', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(93, 24, 'https://picsum.photos/seed/seed-kopi-nusantara-sirup-gula-aren-1/800/800', 'Foto utama Sirup Gula Aren Premium', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(94, 24, 'https://picsum.photos/seed/seed-kopi-nusantara-sirup-gula-aren-2/800/800', 'Foto detail 2 Sirup Gula Aren Premium', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(95, 24, 'https://picsum.photos/seed/seed-kopi-nusantara-sirup-gula-aren-3/800/800', 'Foto detail 3 Sirup Gula Aren Premium', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(96, 24, 'https://picsum.photos/seed/seed-kopi-nusantara-sirup-gula-aren-4/800/800', 'Foto detail 4 Sirup Gula Aren Premium', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(97, 25, 'https://picsum.photos/seed/seed-purnama-batik-kemeja-batik-tulis-solo-1/800/800', 'Foto utama Kemeja Batik Tulis Solo', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(98, 25, 'https://picsum.photos/seed/seed-purnama-batik-kemeja-batik-tulis-solo-2/800/800', 'Foto detail 2 Kemeja Batik Tulis Solo', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(99, 25, 'https://picsum.photos/seed/seed-purnama-batik-kemeja-batik-tulis-solo-3/800/800', 'Foto detail 3 Kemeja Batik Tulis Solo', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(100, 25, 'https://picsum.photos/seed/seed-purnama-batik-kemeja-batik-tulis-solo-4/800/800', 'Foto detail 4 Kemeja Batik Tulis Solo', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(101, 26, 'https://picsum.photos/seed/seed-purnama-batik-kemeja-batik-cap-1/800/800', 'Foto utama Kemeja Batik Cap Mega Mendung', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(102, 26, 'https://picsum.photos/seed/seed-purnama-batik-kemeja-batik-cap-2/800/800', 'Foto detail 2 Kemeja Batik Cap Mega Mendung', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(103, 26, 'https://picsum.photos/seed/seed-purnama-batik-kemeja-batik-cap-3/800/800', 'Foto detail 3 Kemeja Batik Cap Mega Mendung', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(104, 26, 'https://picsum.photos/seed/seed-purnama-batik-kemeja-batik-cap-4/800/800', 'Foto detail 4 Kemeja Batik Cap Mega Mendung', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(105, 27, 'https://picsum.photos/seed/seed-purnama-batik-kaos-batik-printing-1/800/800', 'Foto utama Kaos Batik Printing Pria', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(106, 27, 'https://picsum.photos/seed/seed-purnama-batik-kaos-batik-printing-2/800/800', 'Foto detail 2 Kaos Batik Printing Pria', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(107, 27, 'https://picsum.photos/seed/seed-purnama-batik-kaos-batik-printing-3/800/800', 'Foto detail 3 Kaos Batik Printing Pria', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(108, 27, 'https://picsum.photos/seed/seed-purnama-batik-kaos-batik-printing-4/800/800', 'Foto detail 4 Kaos Batik Printing Pria', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(109, 28, 'https://picsum.photos/seed/seed-purnama-batik-kaos-polos-katun-1/800/800', 'Foto utama Kaos Polos Katun Combed', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(110, 28, 'https://picsum.photos/seed/seed-purnama-batik-kaos-polos-katun-2/800/800', 'Foto detail 2 Kaos Polos Katun Combed', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(111, 28, 'https://picsum.photos/seed/seed-purnama-batik-kaos-polos-katun-3/800/800', 'Foto detail 3 Kaos Polos Katun Combed', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(112, 28, 'https://picsum.photos/seed/seed-purnama-batik-kaos-polos-katun-4/800/800', 'Foto detail 4 Kaos Polos Katun Combed', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(113, 29, 'https://picsum.photos/seed/seed-purnama-batik-blouse-batik-modern-1/800/800', 'Foto utama Blouse Batik Modern', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(114, 29, 'https://picsum.photos/seed/seed-purnama-batik-blouse-batik-modern-2/800/800', 'Foto detail 2 Blouse Batik Modern', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(115, 29, 'https://picsum.photos/seed/seed-purnama-batik-blouse-batik-modern-3/800/800', 'Foto detail 3 Blouse Batik Modern', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(116, 29, 'https://picsum.photos/seed/seed-purnama-batik-blouse-batik-modern-4/800/800', 'Foto detail 4 Blouse Batik Modern', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(117, 30, 'https://picsum.photos/seed/seed-purnama-batik-kebaya-encim-1/800/800', 'Foto utama Kebaya Encim Batik Pekalongan', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(118, 30, 'https://picsum.photos/seed/seed-purnama-batik-kebaya-encim-2/800/800', 'Foto detail 2 Kebaya Encim Batik Pekalongan', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(119, 30, 'https://picsum.photos/seed/seed-purnama-batik-kebaya-encim-3/800/800', 'Foto detail 3 Kebaya Encim Batik Pekalongan', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(120, 30, 'https://picsum.photos/seed/seed-purnama-batik-kebaya-encim-4/800/800', 'Foto detail 4 Kebaya Encim Batik Pekalongan', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(121, 31, 'https://picsum.photos/seed/seed-purnama-batik-kain-batik-tulis-1/800/800', 'Foto utama Kain Batik Tulis 2 Meter', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(122, 31, 'https://picsum.photos/seed/seed-purnama-batik-kain-batik-tulis-2/800/800', 'Foto detail 2 Kain Batik Tulis 2 Meter', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(123, 31, 'https://picsum.photos/seed/seed-purnama-batik-kain-batik-tulis-3/800/800', 'Foto detail 3 Kain Batik Tulis 2 Meter', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(124, 31, 'https://picsum.photos/seed/seed-purnama-batik-kain-batik-tulis-4/800/800', 'Foto detail 4 Kain Batik Tulis 2 Meter', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(125, 32, 'https://picsum.photos/seed/seed-purnama-batik-kain-lurik-klaten-1/800/800', 'Foto utama Kain Lurik Asli Klaten', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(126, 32, 'https://picsum.photos/seed/seed-purnama-batik-kain-lurik-klaten-2/800/800', 'Foto detail 2 Kain Lurik Asli Klaten', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(127, 32, 'https://picsum.photos/seed/seed-purnama-batik-kain-lurik-klaten-3/800/800', 'Foto detail 3 Kain Lurik Asli Klaten', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(128, 32, 'https://picsum.photos/seed/seed-purnama-batik-kain-lurik-klaten-4/800/800', 'Foto detail 4 Kain Lurik Asli Klaten', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(129, 33, 'https://picsum.photos/seed/seed-ananda-stationery-pulpen-gel-jc-1/800/800', 'Foto utama Pulpen Gel JC Style 0.5 mm', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(130, 33, 'https://picsum.photos/seed/seed-ananda-stationery-pulpen-gel-jc-2/800/800', 'Foto detail 2 Pulpen Gel JC Style 0.5 mm', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(131, 33, 'https://picsum.photos/seed/seed-ananda-stationery-pulpen-gel-jc-3/800/800', 'Foto detail 3 Pulpen Gel JC Style 0.5 mm', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(132, 33, 'https://picsum.photos/seed/seed-ananda-stationery-pulpen-gel-jc-4/800/800', 'Foto detail 4 Pulpen Gel JC Style 0.5 mm', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(133, 34, 'https://picsum.photos/seed/seed-ananda-stationery-pulpen-standard-ae7-1/800/800', 'Foto utama Pulpen Standard AE7', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(134, 34, 'https://picsum.photos/seed/seed-ananda-stationery-pulpen-standard-ae7-2/800/800', 'Foto detail 2 Pulpen Standard AE7', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(135, 34, 'https://picsum.photos/seed/seed-ananda-stationery-pulpen-standard-ae7-3/800/800', 'Foto detail 3 Pulpen Standard AE7', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(136, 34, 'https://picsum.photos/seed/seed-ananda-stationery-pulpen-standard-ae7-4/800/800', 'Foto detail 4 Pulpen Standard AE7', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(137, 35, 'https://picsum.photos/seed/seed-ananda-stationery-pensil-2b-pack-1/800/800', 'Foto utama Pensil Kayu 2B (Pack 12)', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(138, 35, 'https://picsum.photos/seed/seed-ananda-stationery-pensil-2b-pack-2/800/800', 'Foto detail 2 Pensil Kayu 2B (Pack 12)', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(139, 35, 'https://picsum.photos/seed/seed-ananda-stationery-pensil-2b-pack-3/800/800', 'Foto detail 3 Pensil Kayu 2B (Pack 12)', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(140, 35, 'https://picsum.photos/seed/seed-ananda-stationery-pensil-2b-pack-4/800/800', 'Foto detail 4 Pensil Kayu 2B (Pack 12)', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(141, 36, 'https://picsum.photos/seed/seed-ananda-stationery-buku-catatan-a5-1/800/800', 'Foto utama Buku Catatan Hardcover A5', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(142, 36, 'https://picsum.photos/seed/seed-ananda-stationery-buku-catatan-a5-2/800/800', 'Foto detail 2 Buku Catatan Hardcover A5', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(143, 36, 'https://picsum.photos/seed/seed-ananda-stationery-buku-catatan-a5-3/800/800', 'Foto detail 3 Buku Catatan Hardcover A5', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(144, 36, 'https://picsum.photos/seed/seed-ananda-stationery-buku-catatan-a5-4/800/800', 'Foto detail 4 Buku Catatan Hardcover A5', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(145, 37, 'https://picsum.photos/seed/seed-ananda-stationery-kertas-hvs-a4-1/800/800', 'Foto utama Kertas HVS A4 70gsm', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(146, 37, 'https://picsum.photos/seed/seed-ananda-stationery-kertas-hvs-a4-2/800/800', 'Foto detail 2 Kertas HVS A4 70gsm', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(147, 37, 'https://picsum.photos/seed/seed-ananda-stationery-kertas-hvs-a4-3/800/800', 'Foto detail 3 Kertas HVS A4 70gsm', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(148, 37, 'https://picsum.photos/seed/seed-ananda-stationery-kertas-hvs-a4-4/800/800', 'Foto detail 4 Kertas HVS A4 70gsm', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(149, 38, 'https://picsum.photos/seed/seed-ananda-stationery-kertas-kado-motif-1/800/800', 'Foto utama Kertas Kado Motif (Pack 10)', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(150, 38, 'https://picsum.photos/seed/seed-ananda-stationery-kertas-kado-motif-2/800/800', 'Foto detail 2 Kertas Kado Motif (Pack 10)', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(151, 38, 'https://picsum.photos/seed/seed-ananda-stationery-kertas-kado-motif-3/800/800', 'Foto detail 3 Kertas Kado Motif (Pack 10)', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(152, 38, 'https://picsum.photos/seed/seed-ananda-stationery-kertas-kado-motif-4/800/800', 'Foto detail 4 Kertas Kado Motif (Pack 10)', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(153, 39, 'https://picsum.photos/seed/seed-ananda-stationery-stiker-label-1/800/800', 'Foto utama Stiker Label Aneka Ukuran', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(154, 39, 'https://picsum.photos/seed/seed-ananda-stationery-stiker-label-2/800/800', 'Foto detail 2 Stiker Label Aneka Ukuran', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(155, 39, 'https://picsum.photos/seed/seed-ananda-stationery-stiker-label-3/800/800', 'Foto detail 3 Stiker Label Aneka Ukuran', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(156, 39, 'https://picsum.photos/seed/seed-ananda-stationery-stiker-label-4/800/800', 'Foto detail 4 Stiker Label Aneka Ukuran', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(157, 40, 'https://picsum.photos/seed/seed-ananda-stationery-washi-tape-10-1/800/800', 'Foto utama Washi Tape Set 10 pcs', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(158, 40, 'https://picsum.photos/seed/seed-ananda-stationery-washi-tape-10-2/800/800', 'Foto detail 2 Washi Tape Set 10 pcs', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(159, 40, 'https://picsum.photos/seed/seed-ananda-stationery-washi-tape-10-3/800/800', 'Foto detail 3 Washi Tape Set 10 pcs', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(160, 40, 'https://picsum.photos/seed/seed-ananda-stationery-washi-tape-10-4/800/800', 'Foto detail 4 Washi Tape Set 10 pcs', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(161, 41, 'https://picsum.photos/seed/seed-sentra-operasional-nasi-ayam-goreng-1/800/800', 'Foto utama Paket Nasi Ayam Goreng', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(162, 41, 'https://picsum.photos/seed/seed-sentra-operasional-nasi-ayam-goreng-2/800/800', 'Foto detail 2 Paket Nasi Ayam Goreng', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(163, 41, 'https://picsum.photos/seed/seed-sentra-operasional-nasi-ayam-goreng-3/800/800', 'Foto detail 3 Paket Nasi Ayam Goreng', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(164, 41, 'https://picsum.photos/seed/seed-sentra-operasional-nasi-ayam-goreng-4/800/800', 'Foto detail 4 Paket Nasi Ayam Goreng', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(165, 42, 'https://picsum.photos/seed/seed-sentra-operasional-bakso-sapi-500g-1/800/800', 'Foto utama Bakso Sapi Original 500g', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(166, 42, 'https://picsum.photos/seed/seed-sentra-operasional-bakso-sapi-500g-2/800/800', 'Foto detail 2 Bakso Sapi Original 500g', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(167, 42, 'https://picsum.photos/seed/seed-sentra-operasional-bakso-sapi-500g-3/800/800', 'Foto detail 3 Bakso Sapi Original 500g', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(168, 42, 'https://picsum.photos/seed/seed-sentra-operasional-bakso-sapi-500g-4/800/800', 'Foto detail 4 Bakso Sapi Original 500g', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(169, 43, 'https://picsum.photos/seed/seed-sentra-operasional-sate-ayam-maranggi-1/800/800', 'Foto utama Sate Ayam Maranggi (12 Tusuk)', 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(170, 43, 'https://picsum.photos/seed/seed-sentra-operasional-sate-ayam-maranggi-2/800/800', 'Foto detail 2 Sate Ayam Maranggi (12 Tusuk)', 0, 2, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(171, 43, 'https://picsum.photos/seed/seed-sentra-operasional-sate-ayam-maranggi-3/800/800', 'Foto detail 3 Sate Ayam Maranggi (12 Tusuk)', 0, 3, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(172, 43, 'https://picsum.photos/seed/seed-sentra-operasional-sate-ayam-maranggi-4/800/800', 'Foto detail 4 Sate Ayam Maranggi (12 Tusuk)', 0, 4, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(233, 15, 'https://picsum.photos/seed/seed-raka-teknologi-powerbank-20000-1/800/800', 'Foto utama Powerbank 20000mAh Fast', 1, 0, '2026-09-21 02:10:54', '2026-09-21 02:10:54'),
(234, 15, 'https://picsum.photos/seed/seed-raka-teknologi-powerbank-20000-2/800/800', 'Foto detail 2 Powerbank 20000mAh Fast', 0, 1, '2026-09-21 02:10:54', '2026-09-21 02:10:54'),
(235, 15, 'https://picsum.photos/seed/seed-raka-teknologi-powerbank-20000-3/800/800', 'Foto detail 3 Powerbank 20000mAh Fast', 0, 2, '2026-09-21 02:10:54', '2026-09-21 02:10:54'),
(236, 15, 'https://picsum.photos/seed/seed-raka-teknologi-powerbank-20000-4/800/800', 'Foto detail 4 Powerbank 20000mAh Fast', 0, 3, '2026-09-21 02:10:54', '2026-09-21 02:10:54'),
(245, 16, 'https://picsum.photos/seed/seed-raka-teknologi-case-hp-silikon-1/800/800', 'Foto utama Case HP Silikon Transparan', 1, 0, '2026-09-22 21:10:48', '2026-09-22 21:10:48'),
(246, 16, 'https://picsum.photos/seed/seed-raka-teknologi-case-hp-silikon-2/800/800', 'Foto detail 2 Case HP Silikon Transparan', 0, 1, '2026-09-22 21:10:48', '2026-09-22 21:10:48'),
(247, 16, 'https://picsum.photos/seed/seed-raka-teknologi-case-hp-silikon-3/800/800', 'Foto detail 3 Case HP Silikon Transparan', 0, 2, '2026-09-22 21:10:48', '2026-09-22 21:10:48'),
(248, 16, 'https://picsum.photos/seed/seed-raka-teknologi-case-hp-silikon-4/800/800', 'Foto detail 4 Case HP Silikon Transparan', 0, 3, '2026-09-22 21:10:48', '2026-09-22 21:10:48'),
(317, 4, 'https://picsum.photos/seed/seed-sari-nusantara-kue-kering-kastengel-1/800/800', 'Foto utama Kue Kering Kastengel', 1, 0, '2026-09-26 23:07:54', '2026-09-26 23:07:54'),
(318, 4, 'https://picsum.photos/seed/seed-sari-nusantara-kue-kering-kastengel-2/800/800', 'Foto detail 2 Kue Kering Kastengel', 0, 1, '2026-09-26 23:07:54', '2026-09-26 23:07:54'),
(319, 4, 'https://picsum.photos/seed/seed-sari-nusantara-kue-kering-kastengel-3/800/800', 'Foto detail 3 Kue Kering Kastengel', 0, 2, '2026-09-26 23:07:54', '2026-09-26 23:07:54'),
(320, 4, 'https://picsum.photos/seed/seed-sari-nusantara-kue-kering-kastengel-4/800/800', 'Foto detail 4 Kue Kering Kastengel', 0, 3, '2026-09-26 23:07:54', '2026-09-26 23:07:54'),
(385, 7, 'https://picsum.photos/seed/seed-sari-nusantara-pisang-goreng-pasir-1/800/800', 'Foto utama Oleh-Oleh Pisang Goreng Pasir', 1, 0, '2026-09-27 06:27:26', '2026-09-27 06:27:26'),
(386, 7, 'https://picsum.photos/seed/seed-sari-nusantara-pisang-goreng-pasir-2/800/800', 'Foto detail 2 Oleh-Oleh Pisang Goreng Pasir', 0, 1, '2026-09-27 06:27:26', '2026-09-27 06:27:26'),
(387, 7, 'https://picsum.photos/seed/seed-sari-nusantara-pisang-goreng-pasir-3/800/800', 'Foto detail 3 Oleh-Oleh Pisang Goreng Pasir', 0, 2, '2026-09-27 06:27:26', '2026-09-27 06:27:26'),
(388, 7, 'https://picsum.photos/seed/seed-sari-nusantara-pisang-goreng-pasir-4/800/800', 'Foto detail 4 Oleh-Oleh Pisang Goreng Pasir', 0, 3, '2026-09-27 06:27:26', '2026-09-27 06:27:26'),
(393, 8, 'https://picsum.photos/seed/seed-sari-nusantara-sari-kelapa-muda-1/800/800', 'Foto utama Sari Kelapa Muda Botol', 1, 0, '2026-09-27 06:28:09', '2026-09-27 06:28:09'),
(394, 8, 'https://picsum.photos/seed/seed-sari-nusantara-sari-kelapa-muda-2/800/800', 'Foto detail 2 Sari Kelapa Muda Botol', 0, 1, '2026-09-27 06:28:09', '2026-09-27 06:28:09'),
(395, 8, 'https://picsum.photos/seed/seed-sari-nusantara-sari-kelapa-muda-3/800/800', 'Foto detail 3 Sari Kelapa Muda Botol', 0, 2, '2026-09-27 06:28:09', '2026-09-27 06:28:09'),
(396, 8, 'https://picsum.photos/seed/seed-sari-nusantara-sari-kelapa-muda-4/800/800', 'Foto detail 4 Sari Kelapa Muda Botol', 0, 3, '2026-09-27 06:28:09', '2026-09-27 06:28:09');

-- --------------------------------------------------------

--
-- Table structure for table `product_materials`
--

CREATE TABLE `product_materials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `raw_material_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` decimal(18,4) NOT NULL,
  `unit_cost` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `total_cost` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_materials`
--

INSERT INTO `product_materials` (`id`, `product_id`, `raw_material_id`, `quantity`, `unit_cost`, `total_cost`, `created_at`, `updated_at`) VALUES
(1, 41, 1, 0.2000, 12500.0000, 2500.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(2, 41, 2, 0.2500, 32000.0000, 8000.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(3, 41, 4, 0.0300, 28000.0000, 840.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(4, 41, 5, 0.0200, 30000.0000, 600.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(5, 41, 6, 0.1000, 15000.0000, 1500.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(6, 41, 7, 0.0500, 26000.0000, 1300.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(7, 42, 3, 0.5000, 88000.0000, 44000.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(8, 42, 5, 0.0300, 30000.0000, 900.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(9, 42, 8, 0.0800, 11000.0000, 880.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(10, 42, 9, 0.0200, 20000.0000, 400.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(11, 42, 7, 0.0600, 26000.0000, 1560.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(12, 43, 2, 0.4500, 32000.0000, 14400.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(13, 43, 9, 0.0500, 20000.0000, 1000.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(14, 43, 10, 0.0300, 18000.0000, 540.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(15, 43, 4, 0.0400, 28000.0000, 1120.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(16, 43, 6, 0.1000, 15000.0000, 1500.0000, '2026-09-14 00:59:45', '2026-09-14 00:59:45');

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

CREATE TABLE `product_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `order_item_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `review` text DEFAULT NULL,
  `media` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`media`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_reviews`
--

INSERT INTO `product_reviews` (`id`, `product_id`, `order_id`, `order_item_id`, `user_id`, `rating`, `review`, `media`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 40, 1, 1, '00000000-0000-4000-8000-000000000203', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000203', '2026-06-28 08:01:50', '2026-06-28 08:01:50', NULL),
(2, 38, 1, 2, '00000000-0000-4000-8000-000000000203', 4, 'Sesuai ekspektasi, akan repeat order.', NULL, 1, '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000203', '2026-06-28 08:01:50', '2026-06-28 08:01:50', NULL),
(3, 21, 2, 4, '00000000-0000-4000-8000-000000000205', 4, 'Pengiriman cepat, packing aman. Terima kasih.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-08-10 23:54:50', '2026-08-10 23:54:50', NULL),
(4, 17, 2, 5, '00000000-0000-4000-8000-000000000205', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-08-10 23:54:50', '2026-08-10 23:54:50', NULL),
(5, 17, 3, 7, '00000000-0000-4000-8000-000000000203', 4, 'Enak, dikemas rapi, cepat sampai. Recommended!', NULL, 1, '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000203', '2026-08-10 09:47:50', '2026-08-10 09:47:50', NULL),
(6, 33, 6, 10, '00000000-0000-4000-8000-000000000202', 4, 'Produk sesuai deskripsi, kualitas bagus.', NULL, 1, '00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000202', '2026-05-30 13:47:50', '2026-05-30 13:47:50', NULL),
(7, 4, 8, 12, '00000000-0000-4000-8000-000000000203', 4, 'Barang original, harga bersaing.', NULL, 1, '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000203', '2026-08-04 11:34:50', '2026-08-04 11:34:50', NULL),
(8, 21, 10, 16, '00000000-0000-4000-8000-000000000205', 5, 'Pengiriman cepat, packing aman. Terima kasih.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-06-13 14:34:50', '2026-06-13 14:34:50', NULL),
(9, 22, 10, 17, '00000000-0000-4000-8000-000000000205', 5, 'Mantap, rasanya enak dan segar.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-06-13 14:34:50', '2026-06-13 14:34:50', NULL),
(10, 39, 12, 20, '00000000-0000-4000-8000-000000000202', 4, 'Pengiriman cepat, packing aman. Terima kasih.', NULL, 1, '00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000202', '2026-08-16 04:39:50', '2026-08-16 04:39:50', NULL),
(11, 33, 12, 21, '00000000-0000-4000-8000-000000000202', 4, 'Sesuai ekspektasi, akan repeat order.', NULL, 1, '00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000202', '2026-08-16 04:39:50', '2026-08-16 04:39:50', NULL),
(12, 40, 14, 26, '00000000-0000-4000-8000-000000000206', 5, 'Barang original, harga bersaing.', NULL, 1, '00000000-0000-4000-8000-000000000206', '00000000-0000-4000-8000-000000000206', '2026-07-28 22:48:50', '2026-07-28 22:48:50', NULL),
(13, 40, 16, 28, '00000000-0000-4000-8000-000000000205', 5, 'Produk sesuai deskripsi, kualitas bagus.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-06-12 04:57:50', '2026-06-12 04:57:50', NULL),
(14, 37, 16, 29, '00000000-0000-4000-8000-000000000205', 5, 'Sesuai ekspektasi, akan repeat order.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-06-12 04:57:50', '2026-06-12 04:57:50', NULL),
(15, 36, 17, 31, '00000000-0000-4000-8000-000000000201', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000201', '2026-06-16 18:56:50', '2026-06-16 18:56:50', NULL),
(16, 25, 18, 32, '00000000-0000-4000-8000-000000000203', 4, 'Produk sesuai deskripsi, kualitas bagus.', NULL, 1, '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000203', '2026-06-12 13:01:50', '2026-06-12 13:01:50', NULL),
(17, 27, 18, 33, '00000000-0000-4000-8000-000000000203', 4, 'Produk sesuai deskripsi, kualitas bagus.', NULL, 1, '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000203', '2026-06-12 13:01:50', '2026-06-12 13:01:50', NULL),
(18, 29, 18, 34, '00000000-0000-4000-8000-000000000203', 5, 'Sudah belanja dua kali, selalu puas.', NULL, 1, '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000203', '2026-06-12 13:01:50', '2026-06-12 13:01:50', NULL),
(19, 37, 21, 37, '00000000-0000-4000-8000-000000000208', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000208', '00000000-0000-4000-8000-000000000208', '2026-06-16 18:13:50', '2026-06-16 18:13:50', NULL),
(20, 35, 21, 38, '00000000-0000-4000-8000-000000000208', 5, 'Sesuai ekspektasi, akan repeat order.', NULL, 1, '00000000-0000-4000-8000-000000000208', '00000000-0000-4000-8000-000000000208', '2026-06-16 18:13:50', '2026-06-16 18:13:50', NULL),
(21, 40, 21, 39, '00000000-0000-4000-8000-000000000208', 5, 'Enak, dikemas rapi, cepat sampai. Recommended!', NULL, 1, '00000000-0000-4000-8000-000000000208', '00000000-0000-4000-8000-000000000208', '2026-06-16 18:13:50', '2026-06-16 18:13:50', NULL),
(22, 41, 24, 46, '00000000-0000-4000-8000-000000000209', 4, 'Sesuai ekspektasi, akan repeat order.', NULL, 1, '00000000-0000-4000-8000-000000000209', '00000000-0000-4000-8000-000000000209', '2026-08-16 00:58:50', '2026-08-16 00:58:50', NULL),
(23, 17, 28, 55, '00000000-0000-4000-8000-000000000203', 4, 'Sudah belanja dua kali, selalu puas.', NULL, 1, '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000203', '2026-07-25 10:05:50', '2026-07-25 10:05:50', NULL),
(24, 4, 30, 58, '00000000-0000-4000-8000-000000000203', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000203', '2026-05-21 04:03:50', '2026-05-21 04:03:50', NULL),
(25, 8, 30, 59, '00000000-0000-4000-8000-000000000203', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000203', '2026-05-21 04:03:50', '2026-05-21 04:03:50', NULL),
(26, 25, 32, 62, '00000000-0000-4000-8000-000000000207', 5, 'Pengiriman cepat, packing aman. Terima kasih.', NULL, 1, '00000000-0000-4000-8000-000000000207', '00000000-0000-4000-8000-000000000207', '2026-06-18 02:30:51', '2026-06-18 02:30:51', NULL),
(27, 16, 36, 66, '00000000-0000-4000-8000-000000000205', 4, 'Pengiriman cepat, packing aman. Terima kasih.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-06-23 23:52:51', '2026-06-23 23:52:51', NULL),
(28, 10, 36, 67, '00000000-0000-4000-8000-000000000205', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-06-23 23:52:51', '2026-06-23 23:52:51', NULL),
(29, 9, 36, 68, '00000000-0000-4000-8000-000000000205', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-06-23 23:52:51', '2026-06-23 23:52:51', NULL),
(30, 42, 38, 71, '00000000-0000-4000-8000-000000000210', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000210', '00000000-0000-4000-8000-000000000210', '2026-07-07 23:04:51', '2026-07-07 23:04:51', NULL),
(31, 41, 41, 80, '00000000-0000-4000-8000-000000000207', 5, 'Produk sesuai deskripsi, kualitas bagus.', NULL, 1, '00000000-0000-4000-8000-000000000207', '00000000-0000-4000-8000-000000000207', '2026-06-09 04:45:51', '2026-06-09 04:45:51', NULL),
(32, 27, 43, 83, '00000000-0000-4000-8000-000000000207', 5, 'Sesuai ekspektasi, akan repeat order.', NULL, 1, '00000000-0000-4000-8000-000000000207', '00000000-0000-4000-8000-000000000207', '2026-07-12 22:08:51', '2026-07-12 22:08:51', NULL),
(33, 28, 43, 84, '00000000-0000-4000-8000-000000000207', 4, 'Produk sesuai deskripsi, kualitas bagus.', NULL, 1, '00000000-0000-4000-8000-000000000207', '00000000-0000-4000-8000-000000000207', '2026-07-12 22:08:51', '2026-07-12 22:08:51', NULL),
(34, 34, 44, 85, '00000000-0000-4000-8000-000000000208', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000208', '00000000-0000-4000-8000-000000000208', '2026-08-15 12:19:51', '2026-08-15 12:19:51', NULL),
(35, 38, 44, 86, '00000000-0000-4000-8000-000000000208', 5, 'Bagus tapi dikit, overall ok.', NULL, 1, '00000000-0000-4000-8000-000000000208', '00000000-0000-4000-8000-000000000208', '2026-08-15 12:19:51', '2026-08-15 12:19:51', NULL),
(36, 34, 46, 90, '00000000-0000-4000-8000-000000000202', 4, 'Mantap, rasanya enak dan segar.', NULL, 1, '00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000202', '2026-08-06 21:15:51', '2026-08-06 21:15:51', NULL),
(37, 41, 47, 91, '00000000-0000-4000-8000-000000000201', 4, 'Sesuai ekspektasi, akan repeat order.', NULL, 1, '00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000201', '2026-08-16 12:40:51', '2026-08-16 12:40:51', NULL),
(38, 4, 49, 94, '00000000-0000-4000-8000-000000000205', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-07-24 05:13:51', '2026-07-24 05:13:51', NULL),
(39, 2, 49, 95, '00000000-0000-4000-8000-000000000205', 5, 'Sesuai ekspektasi, akan repeat order.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-07-24 05:13:51', '2026-07-24 05:13:51', NULL),
(40, 30, 52, 100, '00000000-0000-4000-8000-000000000210', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000210', '00000000-0000-4000-8000-000000000210', '2026-07-14 12:25:51', '2026-07-14 12:25:51', NULL),
(41, 8, 54, 103, '00000000-0000-4000-8000-000000000202', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000202', '2026-08-26 23:15:52', '2026-08-26 23:15:52', NULL),
(42, 1, 54, 104, '00000000-0000-4000-8000-000000000202', 4, 'Enak, dikemas rapi, cepat sampai. Recommended!', NULL, 1, '00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000202', '2026-08-26 23:15:52', '2026-08-26 23:15:52', NULL),
(43, 41, 56, 106, '00000000-0000-4000-8000-000000000203', 5, 'Barang original, harga bersaing.', NULL, 1, '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000203', '2026-07-18 16:41:52', '2026-07-18 16:41:52', NULL),
(44, 25, 57, 108, '00000000-0000-4000-8000-000000000209', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000209', '00000000-0000-4000-8000-000000000209', '2026-07-20 11:01:52', '2026-07-20 11:01:52', NULL),
(45, 42, 58, 109, '00000000-0000-4000-8000-000000000207', 5, 'Produk sesuai deskripsi, kualitas bagus.', NULL, 1, '00000000-0000-4000-8000-000000000207', '00000000-0000-4000-8000-000000000207', '2026-06-03 16:34:52', '2026-06-03 16:34:52', NULL),
(46, 41, 58, 110, '00000000-0000-4000-8000-000000000207', 4, 'Enak, dikemas rapi, cepat sampai. Recommended!', NULL, 1, '00000000-0000-4000-8000-000000000207', '00000000-0000-4000-8000-000000000207', '2026-06-03 16:34:52', '2026-06-03 16:34:52', NULL),
(47, 16, 59, 111, '00000000-0000-4000-8000-000000000205', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-09-10 12:38:52', '2026-09-10 12:38:52', NULL),
(48, 12, 59, 112, '00000000-0000-4000-8000-000000000205', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-09-10 12:38:52', '2026-09-10 12:38:52', NULL),
(49, 12, 59, 113, '00000000-0000-4000-8000-000000000205', 4, 'Enak, dikemas rapi, cepat sampai. Recommended!', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-09-10 12:38:52', '2026-09-10 12:38:52', NULL),
(50, 18, 63, 119, '00000000-0000-4000-8000-000000000205', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', '2026-07-11 17:11:52', '2026-07-11 17:11:52', NULL),
(51, 3, 66, 126, '00000000-0000-4000-8000-000000000207', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000207', '00000000-0000-4000-8000-000000000207', '2026-07-23 10:30:52', '2026-07-23 10:30:52', NULL),
(52, 22, 67, 127, '00000000-0000-4000-8000-000000000207', 4, 'Enak, dikemas rapi, cepat sampai. Recommended!', NULL, 1, '00000000-0000-4000-8000-000000000207', '00000000-0000-4000-8000-000000000207', '2026-06-20 02:16:52', '2026-06-20 02:16:52', NULL),
(53, 17, 67, 128, '00000000-0000-4000-8000-000000000207', 5, 'Sesuai ekspektasi, akan repeat order.', NULL, 1, '00000000-0000-4000-8000-000000000207', '00000000-0000-4000-8000-000000000207', '2026-06-20 02:16:52', '2026-06-20 02:16:52', NULL),
(54, 4, 69, 132, '00000000-0000-4000-8000-000000000210', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000210', '00000000-0000-4000-8000-000000000210', '2026-07-31 19:37:52', '2026-07-31 19:37:52', NULL),
(55, 43, 71, 135, '00000000-0000-4000-8000-000000000202', 5, 'Barang original, harga bersaing.', NULL, 1, '00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000202', '2026-08-15 18:38:52', '2026-08-15 18:38:52', NULL),
(56, 42, 71, 136, '00000000-0000-4000-8000-000000000202', 3, 'Cukup oke, masih bisa diperbaiki kemasannya.', NULL, 1, '00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000202', '2026-08-15 18:38:52', '2026-08-15 18:38:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `sku` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `price_original` decimal(15,2) DEFAULT NULL,
  `price_sale` decimal(15,2) DEFAULT NULL,
  `stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `po_stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `stock_reserved` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `stock_booked` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `stock_preorder` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `max_order_qty` int(10) UNSIGNED NOT NULL DEFAULT 999999,
  `min_stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `store_id`, `sku`, `name`, `price`, `price_original`, `price_sale`, `stock`, `po_stock`, `stock_reserved`, `stock_booked`, `stock_preorder`, `max_order_qty`, `min_stock`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'SAR-0001-Origin-1', 'Original 100g', 13000.00, NULL, NULL, 34, 0, 0, 0, 0, 17, 8, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(2, 1, 1, 'SAR-0001-Balado-2', 'Balado 100g', 14000.00, NULL, NULL, 22, 0, 0, 0, 0, 11, 8, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(3, 2, 1, 'SAR-0002-125g-1', '125g', 15000.00, NULL, NULL, 40, 0, 2, 0, 0, 20, 6, 1, '2026-09-14 00:59:45', '2026-09-21 21:22:22'),
(4, 3, 1, 'SAR-0003-Toples-1', 'Toples 250g', 42000.00, NULL, NULL, 12, 0, 0, 0, 0, 6, 3, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(5, 4, 1, 'SAR-0004-Toples-1', 'Kue Kering Kastengel', 45000.00, NULL, NULL, 9, 0, 0, 0, 0, 5, 0, 1, '2026-09-14 00:59:45', '2026-09-26 23:07:49'),
(6, 5, 1, 'SAR-0005-Isi12p-1', 'Isi 12 pcs', 25000.00, NULL, NULL, 28, 0, 0, 0, 0, 14, 5, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(7, 6, 1, 'SAR-0006-Isi20p-1', 'Isi 20 pcs', 8000.00, NULL, NULL, 50, 0, 0, 0, 0, 25, 10, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(8, 7, 1, 'SAR-0007-Box500-1', 'Oleh-Oleh Pisang Goreng Pasir', 32000.00, NULL, NULL, 18, 0, 0, 0, 0, 9, 0, 1, '2026-09-14 00:59:45', '2026-09-27 05:59:05'),
(9, 8, 1, 'SAR-0008-300mlx-1', 'Sari Kelapa Muda Botol', 45000.00, NULL, NULL, 25, 0, 0, 0, 0, 12, 0, 1, '2026-09-14 00:59:45', '2026-09-27 06:28:09'),
(10, 9, 2, 'RAK-0001-Hitam-1', 'Hitam', 249000.00, NULL, NULL, 15, 0, 0, 0, 0, 7, 3, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(11, 9, 2, 'RAK-0001-Putih-2', 'Putih', 249000.00, NULL, NULL, 12, 0, 0, 0, 0, 6, 3, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(12, 10, 2, 'RAK-0002-Putih-1', 'Putih', 199000.00, NULL, NULL, 25, 0, 0, 0, 0, 12, 5, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(13, 10, 2, 'RAK-0002-Hitam-2', 'Hitam', 199000.00, NULL, NULL, 8, 0, 0, 0, 0, 5, 5, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(14, 11, 2, 'RAK-0003-Hitam-1', 'Hitam', 349000.00, NULL, NULL, 7, 0, 0, 0, 0, 5, 2, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(15, 12, 2, 'RAK-0004-05m-1', '0.5m', 25000.00, NULL, NULL, 60, 0, 0, 0, 0, 30, 10, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(16, 12, 2, 'RAK-0004-1m-2', '1m', 30000.00, NULL, NULL, 45, 0, 0, 0, 0, 22, 10, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(17, 12, 2, 'RAK-0004-2m-3', '2m', 40000.00, NULL, NULL, 30, 0, 0, 0, 0, 15, 10, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(18, 13, 2, 'RAK-0005-Putih-1', 'Putih', 185000.00, NULL, NULL, 20, 0, 0, 0, 0, 10, 4, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(19, 14, 2, 'RAK-0006-Silver-1', 'Silver', 159000.00, NULL, NULL, 18, 0, 0, 0, 0, 9, 3, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(20, 15, 2, 'RAK-0007-Hitam-1', 'Powerbank 20000mAh Fast', 259000.00, NULL, NULL, 10, 0, 0, 0, 0, 5, 0, 1, '2026-09-14 00:59:45', '2026-09-21 02:10:53'),
(21, 16, 2, 'RAK-0008-Bening-1', 'Bening', 35000.00, NULL, NULL, 50, 0, 0, 0, 0, 25, 0, 1, '2026-09-14 00:59:45', '2026-09-20 22:29:59'),
(22, 16, 2, 'RAK-0008-Hitam-2', 'Hitam', 35000.00, NULL, NULL, 14, 0, 0, 0, 0, 7, 0, 0, '2026-09-14 00:59:45', '2026-09-22 21:10:48'),
(23, 17, 3, 'KOP-0001-Biji-1', 'Biji', 85000.00, NULL, NULL, 20, 0, 0, 0, 0, 10, 4, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(24, 17, 3, 'KOP-0001-Giling-2', 'Giling', 85000.00, NULL, NULL, 16, 0, 0, 0, 0, 8, 4, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(25, 18, 3, 'KOP-0002-Biji-1', 'Biji', 80000.00, NULL, NULL, 18, 0, 0, 0, 0, 9, 4, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(26, 18, 3, 'KOP-0002-Giling-2', 'Giling', 80000.00, NULL, NULL, 5, 0, 0, 0, 0, 5, 4, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(27, 19, 3, 'KOP-0003-Biji-1', 'Biji', 95000.00, NULL, NULL, 14, 0, 0, 0, 0, 7, 3, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(28, 20, 3, 'KOP-0004-Biji-1', 'Biji', 120000.00, NULL, NULL, 10, 0, 0, 0, 0, 5, 2, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(29, 21, 3, 'KOP-0005-50Kant-1', '50 Kantong', 55000.00, NULL, NULL, 30, 0, 0, 0, 0, 15, 6, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(30, 22, 3, 'KOP-0006-Box25K-1', 'Box 25 Kantong', 38000.00, NULL, NULL, 22, 0, 0, 0, 0, 11, 5, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(31, 23, 3, 'KOP-0007-Box20S-1', 'Box 20 Sachet', 42000.00, NULL, NULL, 40, 0, 0, 0, 0, 20, 8, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(32, 24, 3, 'KOP-0008-Botol5-1', 'Botol 500ml', 35000.00, NULL, NULL, 26, 0, 0, 0, 0, 13, 5, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(33, 25, 4, 'PUR-0001-M-1', 'M', 285000.00, NULL, NULL, 6, 0, 0, 0, 0, 5, 2, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(34, 25, 4, 'PUR-0001-L-2', 'L', 285000.00, NULL, NULL, 12, 0, 0, 0, 0, 6, 2, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(35, 25, 4, 'PUR-0001-XL-3', 'XL', 285000.00, NULL, NULL, 4, 0, 0, 0, 0, 5, 2, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(36, 26, 4, 'PUR-0002-L-1', 'L', 195000.00, NULL, NULL, 15, 0, 0, 0, 0, 7, 3, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(37, 26, 4, 'PUR-0002-XL-2', 'XL', 195000.00, NULL, NULL, 8, 0, 0, 0, 0, 5, 3, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(38, 27, 4, 'PUR-0003-S-1', 'S', 75000.00, NULL, NULL, 20, 0, 0, 0, 0, 10, 5, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(39, 27, 4, 'PUR-0003-M-2', 'M', 75000.00, NULL, NULL, 18, 0, 0, 0, 0, 9, 5, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(40, 27, 4, 'PUR-0003-L-3', 'L', 75000.00, NULL, NULL, 6, 0, 0, 0, 0, 5, 5, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(41, 28, 4, 'PUR-0004-M-1', 'M', 65000.00, NULL, NULL, 30, 0, 0, 0, 0, 15, 5, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(42, 28, 4, 'PUR-0004-L-2', 'L', 65000.00, NULL, NULL, 22, 0, 0, 0, 0, 11, 5, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(43, 28, 4, 'PUR-0004-XL-3', 'XL', 65000.00, NULL, NULL, 10, 0, 0, 0, 0, 5, 5, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(44, 29, 4, 'PUR-0005-M-1', 'M', 165000.00, NULL, NULL, 12, 0, 0, 0, 0, 6, 3, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(45, 29, 4, 'PUR-0005-L-2', 'L', 165000.00, NULL, NULL, 9, 0, 0, 0, 0, 5, 3, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(46, 30, 4, 'PUR-0006-M-1', 'M', 385000.00, NULL, NULL, 5, 0, 0, 0, 0, 5, 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(47, 30, 4, 'PUR-0006-L-2', 'L', 385000.00, NULL, NULL, 7, 0, 0, 0, 0, 5, 1, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(48, 31, 4, 'PUR-0007-2Meter-1', '2 Meter', 425000.00, NULL, NULL, 3, 0, 0, 0, 0, 5, 1, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(49, 32, 4, 'PUR-0008-15Mete-1', '1.5 Meter', 95000.00, NULL, NULL, 16, 0, 0, 0, 0, 8, 3, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(50, 33, 5, 'ANA-0001-Pack12-1', 'Pack 12 Hitam', 36000.00, NULL, NULL, 45, 0, 0, 0, 0, 22, 10, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(51, 33, 5, 'ANA-0001-Pack12-2', 'Pack 12 Biru', 36000.00, NULL, NULL, 8, 0, 0, 0, 0, 5, 10, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(52, 34, 5, 'ANA-0002-Pack10-1', 'Pack 10', 28000.00, NULL, NULL, 35, 0, 0, 0, 0, 17, 8, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(53, 35, 5, 'ANA-0003-Pack12-1', 'Pack 12', 24000.00, NULL, NULL, 40, 0, 0, 0, 0, 20, 8, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(54, 36, 5, 'ANA-0004-Hitam-1', 'Hitam', 18000.00, NULL, NULL, 50, 0, 0, 0, 0, 25, 12, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(55, 36, 5, 'ANA-0004-Biru-2', 'Biru', 18000.00, NULL, NULL, 42, 0, 0, 0, 0, 21, 12, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(56, 36, 5, 'ANA-0004-Merah-3', 'Merah', 18000.00, NULL, NULL, 0, 0, 0, 0, 0, 5, 5, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(57, 37, 5, 'ANA-0005-1Rim-1', '1 Rim', 52000.00, NULL, NULL, 20, 0, 0, 0, 0, 10, 5, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(58, 38, 5, 'ANA-0006-Pack10-1', 'Pack 10', 30000.00, NULL, NULL, 25, 0, 0, 0, 0, 12, 6, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(59, 39, 5, 'ANA-0007-1Pack1-1', '1 Pack 100 lbr', 22000.00, NULL, NULL, 30, 0, 0, 0, 0, 15, 8, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(60, 40, 5, 'ANA-0008-Set10-1', 'Set 10', 32000.00, NULL, NULL, 18, 0, 0, 0, 0, 9, 4, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(61, 41, 6, 'SEN-0001-Regule-1', 'Reguler', 18000.00, NULL, NULL, 5, 0, 0, 0, 0, 5, 3, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(62, 41, 6, 'SEN-0001-PlusEs-2', 'Plus Es Teh', 22000.00, NULL, NULL, 7, 0, 0, 0, 0, 5, 3, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(63, 42, 6, 'SEN-0002-Pack50-1', 'Pack 500g', 52000.00, NULL, NULL, 8, 0, 0, 0, 0, 5, 3, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(64, 42, 6, 'SEN-0002-Pack1k-2', 'Pack 1kg', 98000.00, NULL, NULL, 4, 0, 0, 0, 0, 5, 2, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(65, 43, 6, 'SEN-0003-12Tusu-1', '12 Tusuk', 38000.00, NULL, NULL, 6, 0, 1, 0, 0, 5, 2, 1, '2026-09-14 00:59:45', '2026-09-15 00:51:49'),
(66, 43, 6, 'SEN-0003-24Tusu-2', '24 Tusuk', 72000.00, NULL, NULL, 3, 0, 0, 0, 0, 5, 2, 0, '2026-09-14 00:59:45', '2026-09-14 00:59:45');

-- --------------------------------------------------------

--
-- Table structure for table `product_variant_values`
--

CREATE TABLE `product_variant_values` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `attribute_id` bigint(20) UNSIGNED NOT NULL,
  `value` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `promotion_payment_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `mobile_image_url` varchar(255) DEFAULT NULL,
  `click_action` enum('none','product','category','url') NOT NULL DEFAULT 'none',
  `target_id` bigint(20) UNSIGNED DEFAULT NULL,
  `target_url` varchar(255) DEFAULT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `approval_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `rejection_reason` text DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by` char(36) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `promotions`
--

INSERT INTO `promotions` (`id`, `store_id`, `promotion_payment_id`, `name`, `image_url`, `mobile_image_url`, `click_action`, `target_id`, `target_url`, `sort_order`, `is_active`, `approval_status`, `rejection_reason`, `submitted_at`, `approved_at`, `approved_by`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 7, NULL, 'Tampil Promo Utama Kategori Makanan', 'https://picsum.photos/seed/promo-1/1200/480', 'https://picsum.photos/seed/promo-m-1/480/480', 'category', NULL, NULL, 1, 1, 'approved', NULL, '2026-08-17 00:59:44', '2026-08-16 00:59:44', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-17 00:59:44', '2026-09-14 00:59:44', NULL),
(2, 7, NULL, 'Semarak HUT RI: Diskon Pengiriman', 'https://picsum.photos/seed/promo-2/1200/480', 'https://picsum.photos/seed/promo-m-2/480/480', 'url', NULL, 'https://marketku.test/promo/2', 2, 1, 'approved', NULL, '2026-08-06 00:59:44', '2026-09-09 00:59:44', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-06 00:59:44', '2026-09-14 00:59:44', NULL),
(3, 2, NULL, 'Promo Elektronik Spesial Raka', 'https://picsum.photos/seed/promo-3/1200/480', 'https://picsum.photos/seed/promo-m-3/480/480', 'product', NULL, NULL, 3, 1, 'approved', NULL, '2026-08-29 00:59:44', '2026-08-30 00:59:44', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', '2026-08-29 00:59:44', '2026-09-14 00:59:44', NULL),
(4, 1, NULL, 'Gratis Ongkir Sari Nusantara', 'https://picsum.photos/seed/promo-4/1200/480', 'https://picsum.photos/seed/promo-m-4/480/480', 'url', NULL, 'https://marketku.test/promo/4', 4, 0, 'pending', NULL, '2026-08-12 00:59:44', NULL, NULL, '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', '2026-08-12 00:59:44', '2026-09-14 00:59:44', NULL),
(5, 4, NULL, 'Batik Tulis Diskon 20%', 'https://picsum.photos/seed/promo-5/1200/480', 'https://picsum.photos/seed/promo-m-5/480/480', 'product', NULL, NULL, 5, 0, 'pending', NULL, '2026-08-23 00:59:44', NULL, NULL, '00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000001', '2026-08-23 00:59:44', '2026-09-14 00:59:44', NULL),
(6, 3, NULL, 'Kopi Isi Ulang', 'https://picsum.photos/seed/promo-6/1200/480', 'https://picsum.photos/seed/promo-m-6/480/480', 'url', NULL, 'https://marketku.test/promo/6', 6, 0, 'rejected', 'Gambar tidak sesuai rasio banner yang diminta.', '2026-08-18 00:59:44', NULL, NULL, '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', '2026-08-18 00:59:44', '2026-09-14 00:59:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `promotion_payments`
--

CREATE TABLE `promotion_payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `payment_number` varchar(100) NOT NULL,
  `package_name` varchar(120) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  `proof_url` varchar(255) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `rejection_reason` text DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `reviewed_by` char(36) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `raw_materials`
--

CREATE TABLE `raw_materials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `unit` varchar(50) NOT NULL DEFAULT 'pcs',
  `stock` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `minimum_stock` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `average_cost` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `raw_materials`
--

INSERT INTO `raw_materials` (`id`, `store_id`, `code`, `name`, `unit`, `stock`, `minimum_stock`, `average_cost`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 6, 'RM-BERAS', 'Beras Premium', 'kg', 40.0000, 10.0000, 12500.0000, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(2, 6, 'RM-AYAM', 'Ayam Potong Segar', 'kg', 18.0000, 6.0000, 32000.0000, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(3, 6, 'RM-BAKISAPI', 'Daging Sapi Giling', 'kg', 12.0000, 4.0000, 88000.0000, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(4, 6, 'RM-CABAI', 'Cabai Merah Keriting', 'kg', 6.0000, 2.0000, 28000.0000, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(5, 6, 'RM-BAWANG', 'Bawang Merah & Putih', 'kg', 10.0000, 3.0000, 30000.0000, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(6, 6, 'RM-MINYAK', 'Minyak Goreng', 'liter', 25.0000, 8.0000, 15000.0000, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(7, 6, 'RM-TELUR', 'Telur Ayam', 'kg', 15.0000, 5.0000, 26000.0000, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(8, 6, 'RM-TEPUNG', 'Tepung Terigu', 'kg', 12.0000, 4.0000, 11000.0000, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(9, 6, 'RM-BUMBU', 'Bumbu Dasar Racikan', 'kg', 8.0000, 3.0000, 20000.0000, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(10, 6, 'RM-KECAP', 'Kecap & Saos', 'botol', 14.0000, 5.0000, 18000.0000, 1, '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(11, 1, 'BHT', 'Bahan Baku Tepung', 'kg', 0.0000, 5.0000, 12000.0000, 1, '2026-09-22 23:40:37', '2026-09-22 23:47:24', '2026-09-22 23:47:24'),
(12, 1, 'BMM', 'Bahan Baku Minyak', 'liter', 0.0000, 2.0000, 18000.0000, 1, '2026-09-22 23:40:37', '2026-09-22 23:47:24', '2026-09-22 23:47:24'),
(13, 1, 'BGS', 'Bahan Baku Gula', 'karung', 0.0000, 1.0000, 15000.0000, 1, '2026-09-22 23:40:37', '2026-09-22 23:47:24', '2026-09-22 23:47:24'),
(14, 1, 'BHKA1', 'Bahan Uji A1', 'kg', 0.0000, 1.0000, 1000.0000, 1, '2026-09-22 23:48:06', '2026-09-22 23:49:35', '2026-09-22 23:49:35'),
(15, 1, 'BHKA2', 'Bahan Uji A2', 'liter', 0.0000, 1.0000, 1000.0000, 1, '2026-09-22 23:48:06', '2026-09-22 23:49:35', '2026-09-22 23:49:35'),
(16, 1, 'BHKA3', 'Bahan Uji A3', 'kg', 0.0000, 1.0000, 1000.0000, 1, '2026-09-22 23:48:06', '2026-09-22 23:49:35', '2026-09-22 23:49:35'),
(17, 1, 'BHKX', 'Bahan Uji X', 'kg', 0.0000, 1.0000, 1000.0000, 1, '2026-09-22 23:49:25', '2026-09-22 23:49:35', '2026-09-22 23:49:35'),
(18, 1, 'TST-$(date +%s)', 'Bahan Uji Restyle', 'pcs', 0.0000, 0.0000, 5000.0000, 1, '2026-09-23 00:54:33', '2026-09-23 00:55:14', '2026-09-23 00:55:14');

-- --------------------------------------------------------

--
-- Table structure for table `raw_material_cost_histories`
--

CREATE TABLE `raw_material_cost_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `raw_material_id` bigint(20) UNSIGNED NOT NULL,
  `raw_material_stock_movement_id` bigint(20) UNSIGNED DEFAULT NULL,
  `old_average_cost` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `new_average_cost` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `change_amount` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `change_percent` decimal(12,4) NOT NULL DEFAULT 0.0000,
  `direction` varchar(20) NOT NULL DEFAULT 'unchanged',
  `reference_type` varchar(50) NOT NULL DEFAULT 'restock',
  `reference_number` varchar(100) DEFAULT NULL,
  `occurred_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `raw_material_cost_histories`
--

INSERT INTO `raw_material_cost_histories` (`id`, `store_id`, `raw_material_id`, `raw_material_stock_movement_id`, `old_average_cost`, `new_average_cost`, `change_amount`, `change_percent`, `direction`, `reference_type`, `reference_number`, `occurred_at`, `created_at`, `updated_at`) VALUES
(1, 6, 1, 1, 0.0000, 12500.0000, 12500.0000, 100.0000, 'up', 'restock', 'PBR-1-01', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(2, 6, 1, 2, 12500.0000, 12500.0000, 0.0000, 0.0000, 'neutral', 'usage', 'PKJ-1-02', '2026-08-10 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(3, 6, 2, 3, 0.0000, 32000.0000, 32000.0000, 100.0000, 'up', 'restock', 'PBR-2-01', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(4, 6, 2, 4, 32000.0000, 32000.0000, 0.0000, 0.0000, 'neutral', 'usage', 'PKJ-2-02', '2026-07-31 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(5, 6, 3, 5, 0.0000, 88000.0000, 88000.0000, 100.0000, 'up', 'restock', 'PBR-3-01', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(6, 6, 3, 6, 88000.0000, 88000.0000, 0.0000, 0.0000, 'neutral', 'usage', 'PKJ-3-02', '2026-08-14 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(7, 6, 4, 7, 0.0000, 28000.0000, 28000.0000, 100.0000, 'up', 'restock', 'PBR-4-01', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(8, 6, 4, 8, 28000.0000, 28000.0000, 0.0000, 0.0000, 'neutral', 'usage', 'PKJ-4-02', '2026-08-05 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(9, 6, 5, 9, 0.0000, 30000.0000, 30000.0000, 100.0000, 'up', 'restock', 'PBR-5-01', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(10, 6, 5, 10, 30000.0000, 30000.0000, 0.0000, 0.0000, 'neutral', 'usage', 'PKJ-5-02', '2026-08-06 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(11, 6, 6, 11, 0.0000, 15000.0000, 15000.0000, 100.0000, 'up', 'restock', 'PBR-6-01', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(12, 6, 6, 12, 15000.0000, 15000.0000, 0.0000, 0.0000, 'neutral', 'usage', 'PKJ-6-02', '2026-08-01 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(13, 6, 7, 13, 0.0000, 26000.0000, 26000.0000, 100.0000, 'up', 'restock', 'PBR-7-01', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(14, 6, 7, 14, 26000.0000, 26000.0000, 0.0000, 0.0000, 'neutral', 'usage', 'PKJ-7-02', '2026-08-02 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(15, 6, 8, 15, 0.0000, 11000.0000, 11000.0000, 100.0000, 'up', 'restock', 'PBR-8-01', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(16, 6, 8, 16, 11000.0000, 11000.0000, 0.0000, 0.0000, 'neutral', 'usage', 'PKJ-8-02', '2026-08-14 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(17, 6, 9, 17, 0.0000, 20000.0000, 20000.0000, 100.0000, 'up', 'restock', 'PBR-9-01', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(18, 6, 9, 18, 20000.0000, 20000.0000, 0.0000, 0.0000, 'neutral', 'usage', 'PKJ-9-02', '2026-08-07 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(19, 6, 10, 19, 0.0000, 18000.0000, 18000.0000, 100.0000, 'up', 'restock', 'PBR-10-01', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(20, 6, 10, 20, 18000.0000, 18000.0000, 0.0000, 0.0000, 'neutral', 'usage', 'PKJ-10-02', '2026-08-01 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45');

-- --------------------------------------------------------

--
-- Table structure for table `raw_material_stock_movements`
--

CREATE TABLE `raw_material_stock_movements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `raw_material_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(30) NOT NULL,
  `quantity_delta` decimal(18,4) NOT NULL,
  `balance_after` decimal(18,4) NOT NULL,
  `unit_cost` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `total_cost` decimal(18,4) NOT NULL DEFAULT 0.0000,
  `reference_type` varchar(50) NOT NULL DEFAULT 'manual',
  `reference_number` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `occurred_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `raw_material_stock_movements`
--

INSERT INTO `raw_material_stock_movements` (`id`, `store_id`, `raw_material_id`, `type`, `quantity_delta`, `balance_after`, `unit_cost`, `total_cost`, `reference_type`, `reference_number`, `notes`, `occurred_at`, `created_at`, `updated_at`) VALUES
(1, 6, 1, 'restock', 49.0000, 49.0000, 12500.0000, 612500.0000, 'manual', NULL, 'Opening restock Beras Premium', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(2, 6, 1, 'usage', -9.0000, 40.0000, 12500.0000, 112500.0000, 'manual', NULL, 'Pemakaian produksi Beras Premium', '2026-08-10 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(3, 6, 2, 'restock', 30.0000, 30.0000, 32000.0000, 960000.0000, 'manual', NULL, 'Opening restock Ayam Potong Segar', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(4, 6, 2, 'usage', -12.0000, 18.0000, 32000.0000, 384000.0000, 'manual', NULL, 'Pemakaian produksi Ayam Potong Segar', '2026-07-31 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(5, 6, 3, 'restock', 19.0000, 19.0000, 88000.0000, 1672000.0000, 'manual', NULL, 'Opening restock Daging Sapi Giling', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(6, 6, 3, 'usage', -7.0000, 12.0000, 88000.0000, 616000.0000, 'manual', NULL, 'Pemakaian produksi Daging Sapi Giling', '2026-08-14 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(7, 6, 4, 'restock', 13.0000, 13.0000, 28000.0000, 364000.0000, 'manual', NULL, 'Opening restock Cabai Merah Keriting', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(8, 6, 4, 'usage', -7.0000, 6.0000, 28000.0000, 196000.0000, 'manual', NULL, 'Pemakaian produksi Cabai Merah Keriting', '2026-08-05 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(9, 6, 5, 'restock', 16.0000, 16.0000, 30000.0000, 480000.0000, 'manual', NULL, 'Opening restock Bawang Merah & Putih', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(10, 6, 5, 'usage', -6.0000, 10.0000, 30000.0000, 180000.0000, 'manual', NULL, 'Pemakaian produksi Bawang Merah & Putih', '2026-08-06 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(11, 6, 6, 'restock', 34.0000, 34.0000, 15000.0000, 510000.0000, 'manual', NULL, 'Opening restock Minyak Goreng', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(12, 6, 6, 'usage', -9.0000, 25.0000, 15000.0000, 135000.0000, 'manual', NULL, 'Pemakaian produksi Minyak Goreng', '2026-08-01 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(13, 6, 7, 'restock', 20.0000, 20.0000, 26000.0000, 520000.0000, 'manual', NULL, 'Opening restock Telur Ayam', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(14, 6, 7, 'usage', -5.0000, 15.0000, 26000.0000, 130000.0000, 'manual', NULL, 'Pemakaian produksi Telur Ayam', '2026-08-02 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(15, 6, 8, 'restock', 24.0000, 24.0000, 11000.0000, 264000.0000, 'manual', NULL, 'Opening restock Tepung Terigu', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(16, 6, 8, 'usage', -12.0000, 12.0000, 11000.0000, 132000.0000, 'manual', NULL, 'Pemakaian produksi Tepung Terigu', '2026-08-14 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(17, 6, 9, 'restock', 16.0000, 16.0000, 20000.0000, 320000.0000, 'manual', NULL, 'Opening restock Bumbu Dasar Racikan', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(18, 6, 9, 'usage', -8.0000, 8.0000, 20000.0000, 160000.0000, 'manual', NULL, 'Pemakaian produksi Bumbu Dasar Racikan', '2026-08-07 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(19, 6, 10, 'restock', 19.0000, 19.0000, 18000.0000, 342000.0000, 'manual', NULL, 'Opening restock Kecap & Saos', '2026-07-15 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(20, 6, 10, 'usage', -5.0000, 14.0000, 18000.0000, 90000.0000, 'manual', NULL, 'Pemakaian produksi Kecap & Saos', '2026-08-01 17:00:00', '2026-09-14 00:59:45', '2026-09-14 00:59:45');

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

CREATE TABLE `receipts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `receipt_number` varchar(64) NOT NULL,
  `user_id` char(36) NOT NULL,
  `source_type` varchar(40) NOT NULL,
  `source_id` varchar(64) NOT NULL,
  `transaction_reference` varchar(100) DEFAULT NULL,
  `receipt_type` varchar(30) NOT NULL DEFAULT 'digital',
  `product_name` varchar(200) DEFAULT NULL,
  `category` varchar(40) DEFAULT NULL,
  `customer_id` varchar(120) DEFAULT NULL,
  `customer_name` varchar(160) DEFAULT NULL,
  `subtotal` decimal(15,2) NOT NULL DEFAULT 0.00,
  `admin_fee` decimal(15,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total` decimal(15,2) NOT NULL DEFAULT 0.00,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` varchar(30) NOT NULL DEFAULT 'pending',
  `transaction_status` varchar(30) NOT NULL DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `email_sent_at` timestamp NULL DEFAULT NULL,
  `email_status` varchar(30) NOT NULL DEFAULT 'none',
  `email_message_id` varchar(160) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'super_admin', 'Akses penuh seluruh sistem', 1, NULL, NULL, '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
(2, 'admin', 'Administrator operasional', 1, NULL, NULL, '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
(3, 'seller', 'Pemilik dan pengelola toko', 1, NULL, NULL, '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
(4, 'buyer', 'Pembeli marketplace', 1, NULL, NULL, '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
(5, 'legacy_operator', 'Role transisi yang sudah tidak digunakan', 0, NULL, NULL, '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 2, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 3, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 5, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 6, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 7, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 8, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 9, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 10, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 11, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 12, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 13, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 14, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 15, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 16, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 17, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 18, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 19, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 20, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 21, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 22, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 23, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 24, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 25, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 26, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 27, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 28, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(1, 29, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 2, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 3, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 5, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 6, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 7, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 8, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 9, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 10, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 11, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 12, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 13, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 14, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 16, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 17, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 18, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 19, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 20, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 21, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 22, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 23, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 24, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 25, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 26, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 27, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 29, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 6, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 8, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 9, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 10, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 11, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 12, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 13, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 14, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 17, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 18, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 19, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 20, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 23, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 24, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 26, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 28, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(4, 6, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(4, 13, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(4, 15, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(4, 20, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(4, 23, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(4, 24, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(4, 26, '2026-09-14 00:59:39', '2026-09-14 00:59:39');

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'todo',
  `position` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `assignee` varchar(120) DEFAULT NULL,
  `label` varchar(80) DEFAULT NULL,
  `priority` varchar(20) NOT NULL DEFAULT 'normal',
  `color` varchar(20) NOT NULL DEFAULT '#10B981',
  `date` date NOT NULL,
  `recurrence` varchar(20) NOT NULL DEFAULT 'none',
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `is_all_day` tinyint(1) NOT NULL DEFAULT 0,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `completion_proof` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`completion_proof`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`id`, `user_id`, `store_id`, `title`, `description`, `type`, `status`, `position`, `assignee`, `label`, `priority`, `color`, `date`, `recurrence`, `start_time`, `end_time`, `is_all_day`, `is_completed`, `completed_at`, `metadata`, `completion_proof`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '00000000-0000-4000-8000-000000000106', 6, 'Produksi bakso mingguan', 'Buat bakso 10kg untuk stok toko.', 'produksi', 'todo', 1, NULL, 'Produksi', 'high', '#10B981', '2026-09-21', 'none', '08:00:00', '12:00:00', 0, 0, NULL, '{\"source\":\"demo\"}', NULL, 1, '00000000-0000-4000-8000-000000000106', NULL, NULL, NULL, NULL),
(2, '00000000-0000-4000-8000-000000000106', 6, 'Stok opname bahan baku', 'Hitung stok beras, cabai, dan minyak.', 'produksi', 'in_progress', 2, NULL, 'Produksi', 'medium', '#10B981', '2026-09-14', 'none', '08:00:00', '12:00:00', 0, 0, NULL, '{\"source\":\"demo\"}', NULL, 1, '00000000-0000-4000-8000-000000000106', NULL, NULL, NULL, NULL),
(3, '00000000-0000-4000-8000-000000000106', 6, 'Kirim pesanan partai katering', 'Antarkan 50 boks pesanan PT Maju Jaya.', 'pesanan', 'done', 3, NULL, 'Operasional', 'high', '#F59E0B', '2026-09-13', 'none', '08:00:00', '12:00:00', 0, 1, '2026-09-13 05:00:00', '{\"source\":\"demo\"}', '{\"photo\":null}', 1, '00000000-0000-4000-8000-000000000106', NULL, NULL, NULL, NULL),
(4, '00000000-0000-4000-8000-000000000101', 1, 'Foto produk kue kering baru', 'Sesi foto untuk koleksi baru nastar.', 'promosi', 'todo', 4, NULL, 'Operasional', 'medium', '#F59E0B', '2026-09-16', 'none', '08:00:00', '12:00:00', 0, 0, NULL, '{\"source\":\"demo\"}', NULL, 1, '00000000-0000-4000-8000-000000000101', NULL, NULL, NULL, NULL),
(5, '00000000-0000-4000-8000-000000000104', 4, 'Terima kain batik dari pengrajin', 'Pengecekan kualitas 20 lembar kain.', 'produksi', 'in_progress', 5, NULL, 'Produksi', 'medium', '#10B981', '2026-09-14', 'none', '08:00:00', '12:00:00', 0, 0, NULL, '{\"source\":\"demo\"}', NULL, 1, '00000000-0000-4000-8000-000000000104', NULL, NULL, NULL, NULL),
(6, '00000000-0000-4000-8000-000000000102', 2, 'bagussss', NULL, 'reminder', 'todo', 1, NULL, NULL, 'normal', '#f59e0b', '2026-09-18', 'none', NULL, NULL, 1, 0, NULL, NULL, NULL, 1, '00000000-0000-4000-8000-000000000102', NULL, '2026-09-17 23:38:59', '2026-09-17 23:39:34', '2026-09-17 23:39:34');

-- --------------------------------------------------------

--
-- Table structure for table `seller_customers`
--

CREATE TABLE `seller_customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seller_settlements`
--

CREATE TABLE `seller_settlements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `sub_order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `settlement_number` varchar(100) NOT NULL,
  `gross_amount` decimal(15,2) NOT NULL,
  `admin_fee` decimal(15,2) NOT NULL DEFAULT 0.00,
  `shipping_fee` decimal(15,2) NOT NULL DEFAULT 0.00,
  `net_amount` decimal(15,2) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `settled_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seller_settlements`
--

INSERT INTO `seller_settlements` (`id`, `store_id`, `order_id`, `sub_order_id`, `settlement_number`, `gross_amount`, `admin_fee`, `shipping_fee`, `net_amount`, `status`, `settled_at`, `notes`, `metadata`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 5, 1, 1, 'STL-1000', 92000.00, 2300.00, 11000.00, 91500.00, 'settled', '2026-07-05 08:01:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-28 08:01:50', '2026-09-14 00:59:50', NULL),
(2, 3, 2, 2, 'STL-1001', 458000.00, 11450.00, 10000.00, 456550.00, 'settled', '2026-08-17 23:54:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-10 23:54:50', '2026-09-14 00:59:50', NULL),
(3, 3, 3, 3, 'STL-1002', 330000.00, 8250.00, 10000.00, 331750.00, 'settled', '2026-08-17 09:47:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-10 09:47:50', '2026-09-14 00:59:50', NULL),
(4, 6, 4, 4, 'STL-1003', 196000.00, 4900.00, 0.00, 191100.00, 'settled', '2026-09-04 12:51:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-28 12:51:50', '2026-09-14 00:59:50', NULL),
(5, 2, 5, 5, 'STL-1004', 318000.00, 7950.00, 15000.00, 325050.00, 'settled', '2026-09-13 04:21:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-06 04:21:50', '2026-09-14 00:59:50', NULL),
(6, 5, 6, 6, 'STL-1005', 36000.00, 900.00, 0.00, 35100.00, 'settled', '2026-06-06 13:47:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-05-30 13:47:50', '2026-09-14 00:59:50', NULL),
(7, 1, 8, 8, 'STL-1006', 90000.00, 2250.00, 12000.00, 99750.00, 'settled', '2026-08-11 11:34:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-04 11:34:50', '2026-09-14 00:59:50', NULL),
(8, 1, 9, 9, 'STL-1007', 109000.00, 2725.00, 12000.00, 118275.00, 'settled', '2026-06-02 16:41:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-05-26 16:41:50', '2026-09-14 00:59:50', NULL),
(9, 3, 10, 10, 'STL-1008', 346000.00, 8650.00, 10000.00, 332350.00, 'settled', '2026-06-20 14:34:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-13 14:34:50', '2026-09-14 00:59:50', NULL),
(10, 5, 12, 12, 'STL-1009', 242000.00, 6050.00, 11000.00, 246950.00, 'settled', '2026-08-23 04:39:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-16 04:39:50', '2026-09-14 00:59:50', NULL),
(11, 2, 13, 13, 'STL-1010', 623000.00, 15575.00, 0.00, 607425.00, 'settled', '2026-07-15 05:29:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-08 05:29:50', '2026-09-14 00:59:50', NULL),
(12, 5, 14, 14, 'STL-1011', 32000.00, 800.00, 11000.00, 42200.00, 'settled', '2026-08-04 22:48:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-28 22:48:50', '2026-09-14 00:59:50', NULL),
(13, 5, 16, 16, 'STL-1012', 168000.00, 4200.00, 11000.00, 174800.00, 'settled', '2026-06-19 04:57:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-12 04:57:50', '2026-09-14 00:59:50', NULL),
(14, 5, 17, 17, 'STL-1013', 58000.00, 1450.00, 11000.00, 67550.00, 'settled', '2026-06-23 18:56:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-16 18:56:50', '2026-09-14 00:59:50', NULL),
(15, 4, 18, 18, 'STL-1014', 1335000.00, 33375.00, 13000.00, 1314625.00, 'settled', '2026-06-19 13:01:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-12 13:01:50', '2026-09-14 00:59:50', NULL),
(16, 5, 21, 21, 'STL-1015', 268000.00, 6700.00, 11000.00, 272300.00, 'settled', '2026-06-23 18:13:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-16 18:13:50', '2026-09-14 00:59:50', NULL),
(17, 5, 23, 23, 'STL-1016', 200000.00, 5000.00, 11000.00, 206000.00, 'settled', '2026-08-15 21:20:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-08 21:20:50', '2026-09-14 00:59:50', NULL),
(18, 6, 24, 24, 'STL-1017', 456000.00, 11400.00, 0.00, 444600.00, 'settled', '2026-08-23 00:58:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-16 00:58:50', '2026-09-14 00:59:50', NULL),
(19, 5, 25, 25, 'STL-1018', 126000.00, 3150.00, 0.00, 122850.00, 'settled', '2026-09-10 14:44:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-03 14:44:50', '2026-09-14 00:59:50', NULL),
(20, 1, 27, 27, 'STL-1019', 117000.00, 2925.00, 12000.00, 126075.00, 'settled', '2026-06-17 16:37:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-10 16:37:50', '2026-09-14 00:59:50', NULL),
(21, 3, 28, 28, 'STL-1020', 170000.00, 4250.00, 10000.00, 160750.00, 'settled', '2026-08-01 10:05:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-25 10:05:50', '2026-09-14 00:59:50', NULL),
(22, 1, 30, 30, 'STL-1021', 208000.00, 5200.00, 12000.00, 214800.00, 'settled', '2026-05-28 04:03:50', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-05-21 04:03:50', '2026-09-14 00:59:50', NULL),
(23, 5, 31, 31, 'STL-1022', 36000.00, 900.00, 0.00, 35100.00, 'settled', '2026-09-02 06:25:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-26 06:25:51', '2026-09-14 00:59:50', NULL),
(24, 4, 32, 32, 'STL-1023', 855000.00, 21375.00, 13000.00, 846625.00, 'settled', '2026-06-25 02:30:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-18 02:30:51', '2026-09-14 00:59:50', NULL),
(25, 4, 34, 34, 'STL-1024', 855000.00, 21375.00, 13000.00, 846625.00, 'settled', '2026-09-05 22:48:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-29 22:48:51', '2026-09-14 00:59:50', NULL),
(26, 4, 35, 35, 'STL-1025', 65000.00, 1625.00, 13000.00, 76375.00, 'settled', '2026-09-07 20:10:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-31 20:10:51', '2026-09-14 00:59:50', NULL),
(27, 2, 36, 36, 'STL-1026', 1051000.00, 26275.00, 15000.00, 1039725.00, 'settled', '2026-06-30 23:52:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-23 23:52:51', '2026-09-14 00:59:50', NULL),
(28, 6, 38, 38, 'STL-1027', 252000.00, 6300.00, 14000.00, 259700.00, 'settled', '2026-07-14 23:04:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-07 23:04:51', '2026-09-14 00:59:50', NULL),
(29, 6, 41, 41, 'STL-1028', 66000.00, 1650.00, 0.00, 64350.00, 'settled', '2026-06-16 04:45:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-09 04:45:51', '2026-09-14 00:59:50', NULL),
(30, 4, 43, 43, 'STL-1029', 555000.00, 13875.00, 13000.00, 554125.00, 'settled', '2026-07-19 22:08:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-12 22:08:51', '2026-09-14 00:59:50', NULL),
(31, 5, 44, 44, 'STL-1030', 88000.00, 2200.00, 11000.00, 96800.00, 'settled', '2026-08-22 12:19:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-15 12:19:51', '2026-09-14 00:59:50', NULL),
(32, 5, 46, 46, 'STL-1031', 56000.00, 1400.00, 11000.00, 60000.00, 'settled', '2026-08-13 21:15:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-06 21:15:51', '2026-09-14 00:59:50', NULL),
(33, 6, 47, 47, 'STL-1032', 54000.00, 1350.00, 0.00, 52650.00, 'settled', '2026-08-23 12:40:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-16 12:40:51', '2026-09-14 00:59:50', NULL),
(34, 1, 49, 49, 'STL-1033', 162000.00, 4050.00, 12000.00, 169950.00, 'settled', '2026-07-31 05:13:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-24 05:13:51', '2026-09-14 00:59:50', NULL),
(35, 1, 50, 50, 'STL-1034', 114000.00, 2850.00, 0.00, 111150.00, 'settled', '2026-09-03 14:42:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-27 14:42:51', '2026-09-14 00:59:50', NULL),
(36, 4, 52, 52, 'STL-1035', 770000.00, 19250.00, 13000.00, 763750.00, 'settled', '2026-07-21 12:25:51', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-14 12:25:51', '2026-09-14 00:59:50', NULL),
(37, 1, 54, 54, 'STL-1036', 129000.00, 3225.00, 12000.00, 137775.00, 'settled', '2026-09-02 23:15:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-26 23:15:52', '2026-09-14 00:59:50', NULL),
(38, 6, 55, 55, 'STL-1037', 66000.00, 1650.00, 14000.00, 71750.00, 'settled', '2026-08-24 19:01:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-17 19:01:52', '2026-09-14 00:59:50', NULL),
(39, 6, 56, 56, 'STL-1038', 140000.00, 3500.00, 0.00, 136500.00, 'settled', '2026-07-25 16:41:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-18 16:41:52', '2026-09-14 00:59:50', NULL),
(40, 4, 57, 57, 'STL-1039', 570000.00, 14250.00, 13000.00, 568750.00, 'settled', '2026-07-27 11:01:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-20 11:01:52', '2026-09-14 00:59:50', NULL),
(41, 6, 58, 58, 'STL-1040', 214000.00, 5350.00, 0.00, 208650.00, 'settled', '2026-06-10 16:34:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-03 16:34:52', '2026-09-14 00:59:50', NULL),
(42, 2, 59, 59, 'STL-1041', 135000.00, 3375.00, 15000.00, 146625.00, 'settled', '2026-09-17 12:38:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-10 12:38:52', '2026-09-14 00:59:50', NULL),
(43, 3, 60, 60, 'STL-1042', 310000.00, 7750.00, 0.00, 302250.00, 'settled', '2026-06-26 20:23:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-19 20:23:52', '2026-09-14 00:59:50', NULL),
(44, 5, 61, 61, 'STL-1043', 156000.00, 3900.00, 11000.00, 163100.00, 'settled', '2026-06-21 16:07:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-14 16:07:52', '2026-09-14 00:59:50', NULL),
(45, 3, 63, 63, 'STL-1044', 164000.00, 4100.00, 0.00, 159900.00, 'settled', '2026-07-18 17:11:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-11 17:11:52', '2026-09-14 00:59:50', NULL),
(46, 4, 64, 64, 'STL-1045', 450000.00, 11250.00, 13000.00, 436750.00, 'settled', '2026-07-10 01:46:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-03 01:46:52', '2026-09-14 00:59:50', NULL),
(47, 1, 66, 66, 'STL-1046', 99000.00, 2475.00, 12000.00, 108525.00, 'settled', '2026-07-30 10:30:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-23 10:30:52', '2026-09-14 00:59:50', NULL),
(48, 3, 67, 67, 'STL-1047', 529000.00, 13225.00, 10000.00, 525775.00, 'settled', '2026-06-27 02:16:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-20 02:16:52', '2026-09-14 00:59:50', NULL),
(49, 6, 68, 68, 'STL-1048', 66000.00, 1650.00, 0.00, 64350.00, 'settled', '2026-06-10 04:12:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-06-03 04:12:52', '2026-09-14 00:59:50', NULL),
(50, 1, 69, 69, 'STL-1049', 90000.00, 2250.00, 12000.00, 99750.00, 'settled', '2026-08-07 19:37:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-07-31 19:37:52', '2026-09-14 00:59:50', NULL),
(51, 6, 71, 71, 'STL-1050', 354000.00, 8850.00, 14000.00, 359150.00, 'settled', '2026-08-22 18:38:52', 'Settlement otomatis pesanan selesai.', '{\"source\":\"demo\"}', 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-08-15 18:38:52', '2026-09-14 00:59:50', NULL),
(52, 1, 1, NULL, 'XzVdS5i', 5000.00, 0.00, 0.00, 5000.00, 'pending', NULL, NULL, NULL, 1, NULL, NULL, '2026-09-15 21:20:54', '2026-09-15 21:20:54', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `seller_withdrawals`
--

CREATE TABLE `seller_withdrawals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `withdrawal_number` varchar(100) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `method` varchar(50) NOT NULL,
  `bank_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`bank_details`)),
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `rejection_reason` text DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `processed_by` char(36) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seller_withdrawals`
--

INSERT INTO `seller_withdrawals` (`id`, `store_id`, `user_id`, `withdrawal_number`, `amount`, `method`, `bank_details`, `status`, `rejection_reason`, `processed_at`, `processed_by`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, '00000000-0000-4000-8000-000000000101', 'WD-2000', 395350.00, 'bank_transfer', '{\"bank\":\"BCA\",\"account_no\":\"50404688\",\"account_name\":\"Pemilik Toko\"}', 'completed', NULL, '2026-08-28 00:59:55', '00000000-0000-4000-8000-000000000001', 1, '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000101', '2026-08-27 00:59:55', '2026-08-27 00:59:55', NULL),
(2, 1, '00000000-0000-4000-8000-000000000101', 'WD-2001', 395350.00, 'e_wallet', '{\"bank\":\"BCA\",\"account_no\":\"50401800\",\"account_name\":\"Pemilik Toko\"}', 'pending', NULL, NULL, NULL, 1, '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000101', '2026-09-04 00:59:55', '2026-09-04 00:59:55', NULL),
(3, 2, '00000000-0000-4000-8000-000000000102', 'WD-2002', 706275.00, 'e_wallet', '{\"bank\":\"BCA\",\"account_no\":\"50405281\",\"account_name\":\"Pemilik Toko\"}', 'completed', NULL, '2026-08-26 00:59:55', '00000000-0000-4000-8000-000000000001', 1, '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', '2026-08-25 00:59:55', '2026-08-25 00:59:55', NULL),
(4, 2, '00000000-0000-4000-8000-000000000102', 'WD-2003', 706275.00, 'e_wallet', '{\"bank\":\"BCA\",\"account_no\":\"50401304\",\"account_name\":\"Pemilik Toko\"}', 'pending', NULL, NULL, NULL, 1, '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', '2026-09-01 00:59:55', '2026-09-01 00:59:55', NULL),
(5, 3, '00000000-0000-4000-8000-000000000103', 'WD-2004', 756441.67, 'e_wallet', '{\"bank\":\"BCA\",\"account_no\":\"50408405\",\"account_name\":\"Pemilik Toko\"}', 'completed', NULL, '2026-09-06 00:59:55', '00000000-0000-4000-8000-000000000001', 1, '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000103', '2026-09-05 00:59:55', '2026-09-05 00:59:55', NULL),
(6, 3, '00000000-0000-4000-8000-000000000103', 'WD-2005', 756441.67, 'e_wallet', '{\"bank\":\"BCA\",\"account_no\":\"50408099\",\"account_name\":\"Pemilik Toko\"}', 'pending', NULL, NULL, NULL, 1, '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000103', '2026-09-12 00:59:55', '2026-09-12 00:59:55', NULL),
(7, 4, '00000000-0000-4000-8000-000000000104', 'WD-2006', 1802541.67, 'e_wallet', '{\"bank\":\"BCA\",\"account_no\":\"50408310\",\"account_name\":\"Pemilik Toko\"}', 'completed', NULL, '2026-09-09 00:59:55', '00000000-0000-4000-8000-000000000001', 1, '00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000104', '2026-09-08 00:59:55', '2026-09-08 00:59:55', NULL),
(8, 4, '00000000-0000-4000-8000-000000000104', 'WD-2007', 1802541.67, 'e_wallet', '{\"bank\":\"BCA\",\"account_no\":\"50404802\",\"account_name\":\"Pemilik Toko\"}', 'pending', NULL, NULL, NULL, 1, '00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000104', '2026-09-13 00:59:55', '2026-09-13 00:59:55', NULL),
(9, 5, '00000000-0000-4000-8000-000000000105', 'WD-2008', 538083.33, 'bank_transfer', '{\"bank\":\"BCA\",\"account_no\":\"50402613\",\"account_name\":\"Pemilik Toko\"}', 'completed', NULL, '2026-09-01 00:59:55', '00000000-0000-4000-8000-000000000001', 1, '00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000105', '2026-08-31 00:59:55', '2026-08-31 00:59:55', NULL),
(10, 5, '00000000-0000-4000-8000-000000000105', 'WD-2009', 538083.33, 'bank_transfer', '{\"bank\":\"BCA\",\"account_no\":\"50402601\",\"account_name\":\"Pemilik Toko\"}', 'pending', NULL, NULL, NULL, 1, '00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000105', '2026-08-30 00:59:55', '2026-08-30 00:59:55', NULL),
(11, 6, '00000000-0000-4000-8000-000000000106', 'WD-2010', 926400.00, 'e_wallet', '{\"bank\":\"BCA\",\"account_no\":\"50406630\",\"account_name\":\"Pemilik Toko\"}', 'completed', NULL, '2026-08-31 00:59:55', '00000000-0000-4000-8000-000000000001', 1, '00000000-0000-4000-8000-000000000106', '00000000-0000-4000-8000-000000000106', '2026-08-30 00:59:55', '2026-08-30 00:59:55', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('ezYwkp2QIr5MPV9cju7qqOUKvdGvulw4KzZUIPQf', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/152.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJjNGJ5OU1JdEdkd2s0ZU1VOGFLdXJzZDlNNjFSWjQwM21jeWlTajFSIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1790146041),
('Fxd78tzdjTeV55aoRO3uUyF4YlQrTUgi2WbIp37S', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/152.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJPZHczMFhrY1g0Uk9PMmMyQnB3U2M3a3J3RFpINURKejVRUWxBdmxnIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1790146056),
('HGkJ0M5VeDfivD2zqsVYehafJgrfr6cblh0Z8dok', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJ6VjIzSmhPMWtWeVNjRWIxRGJ0aUNLSk1hUURRdGUzV2FIeENMc3lYIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1789719788),
('jlFFWEqxbj7OQl2ZpRQ0E6Pp0GGJKKhPj9WT7pXx', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/152.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ6TlhJWUJpc2NrYjhQTUZiYVN5dmN3T0FnZlpKTzZXa2tEUG9YTnpvIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1790146514),
('ldzxfdPzGqsk2CmVAKj98Bep1t1Omeat6fOInLg2', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/152.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI3TlIyb3V2V1ZxOE9SMHRIRlFta2x0WUJaQjlBU1NVMXR4dXJCWkduIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1790146041),
('R4E6Y6b7cAyUH3Mp2pQHlyX94bl2tlwtKogGCub7', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJmQzhBMFRiNlRFMUYyYUdpQXhpbUowUmFRbVJDZU9vRFZrZlBycndBIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1790480685),
('sZ0XA1SPRMuao6vgueO73bOpesRxO9K1uDnRYryM', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/152.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJnUEY3T1B1MUtlbVV3MHhQOUp2bklEcG5nUkxDTzZOVmdESmJDeEcwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1790146514),
('thPsLo3at0ginQ6r1uWsUYhq71MctVyMpLCMxG0i', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ1czRuQml0clBaUlV5cXJYTkgzbmZvb09Kd2xGcWl3RGNZZzRRMGdWIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1790480685),
('WN26eTHOFAOMptLcEuIkFUES65b12bUFjeBm9ISF', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/152.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI3aVZQb0M3TEZtUXJWcVZ3R2p5NXM0b0w3cXJKNVJKZkxxbFdmV2RlIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1790146056),
('XRFzlIBVya3fUmIvE3a4Bghl9RyCfWCp2DZUiWQp', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJGdnZWVHlBQzZGTGFHekVYMWZLUTVqbzhCbDk3Z3BUYXNrYUFsVWtYIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1789716970),
('zEyMaMvqJVmX9Yt6VMH1Hr1HW7RtIT3Qr8moG71y', NULL, '127.0.0.1', 'curl/8.22.0', 'eyJfdG9rZW4iOiJ3NWZ1NjUyS1RnZWU3OGNDMDA5SFFkbjd1elNkWXZ4VFAzME44dG5pIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1790127119);

-- --------------------------------------------------------

--
-- Table structure for table `shipping_settings`
--

CREATE TABLE `shipping_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `store_latitude` decimal(10,8) NOT NULL,
  `store_longitude` decimal(11,8) NOT NULL,
  `free_shipping_max_distance` decimal(8,2) NOT NULL DEFAULT 0.00,
  `default_flat_rate` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shipping_settings`
--

INSERT INTO `shipping_settings` (`id`, `store_id`, `store_latitude`, `store_longitude`, `free_shipping_max_distance`, `default_flat_rate`, `created_at`, `updated_at`) VALUES
(1, 1, -7.97784054, 112.63107955, 5.00, 12000.00, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 2, -6.20876340, 106.84559900, 8.00, 15000.00, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 3, -7.76108750, 110.37390850, 4.00, 10000.00, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(4, 4, -7.57548870, 110.82347310, 6.00, 13000.00, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(5, 5, -6.91746390, 107.60912260, 5.00, 11000.00, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(6, 6, -6.23826960, 106.99153020, 7.00, 14000.00, '2026-09-14 00:59:39', '2026-09-14 00:59:39');

-- --------------------------------------------------------

--
-- Table structure for table `showcases`
--

CREATE TABLE `showcases` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(160) NOT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `showcases`
--

INSERT INTO `showcases` (`id`, `store_id`, `name`, `slug`, `description`, `sort_order`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Terlaris', 'terlaris', 'Produk dengan penjualan terbanyak di toko ini.', 10, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(2, 1, 'Baru', 'baru-masuk', 'Produk terbaru pilihan.', 20, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(3, 2, 'Terlaris', 'terlaris', 'Produk dengan penjualan terbanyak di toko ini.', 10, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(4, 2, 'Baru', 'baru-masuk', 'Produk terbaru pilihan.', 20, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(5, 3, 'Terlaris', 'terlaris', 'Produk dengan penjualan terbanyak di toko ini.', 10, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(6, 3, 'Baru', 'baru-masuk', 'Produk terbaru pilihan.', 20, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(7, 4, 'Terlaris', 'terlaris', 'Produk dengan penjualan terbanyak di toko ini.', 10, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(8, 4, 'Baru', 'baru-masuk', 'Produk terbaru pilihan.', 20, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(9, 5, 'Terlaris', 'terlaris', 'Produk dengan penjualan terbanyak di toko ini.', 10, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(10, 5, 'Baru', 'baru-masuk', 'Produk terbaru pilihan.', 20, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(11, 6, 'Terlaris', 'terlaris', 'Produk dengan penjualan terbanyak di toko ini.', 10, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL),
(12, 6, 'Baru', 'baru-masuk', 'Produk terbaru pilihan.', 20, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:45', '2026-09-14 00:59:45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `showcase_products`
--

CREATE TABLE `showcase_products` (
  `showcase_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `showcase_products`
--

INSERT INTO `showcase_products` (`showcase_id`, `product_id`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 1, 10, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(1, 2, 20, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(1, 3, 30, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(1, 4, 40, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(2, 1, 10, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(2, 2, 20, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(2, 3, 30, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(3, 9, 10, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(3, 10, 20, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(3, 11, 30, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(3, 12, 40, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(4, 9, 10, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(4, 10, 20, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(4, 11, 30, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(5, 17, 10, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(5, 18, 20, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(5, 19, 30, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(5, 20, 40, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(6, 17, 10, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(6, 18, 20, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(6, 19, 30, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(7, 25, 10, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(7, 26, 20, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(7, 27, 30, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(7, 28, 40, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(8, 25, 10, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(8, 26, 20, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(8, 27, 30, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(9, 33, 10, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(9, 34, 20, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(9, 35, 30, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(9, 36, 40, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(10, 33, 10, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(10, 34, 20, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(10, 35, 30, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(11, 41, 10, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(11, 42, 20, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(11, 43, 30, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(12, 41, 10, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(12, 42, 20, '2026-09-14 00:59:45', '2026-09-14 00:59:45'),
(12, 43, 30, '2026-09-14 00:59:45', '2026-09-14 00:59:45');

-- --------------------------------------------------------

--
-- Table structure for table `stock_movements`
--

CREATE TABLE `stock_movements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_item_id` bigint(20) UNSIGNED DEFAULT NULL,
  `movement_key` varchar(120) DEFAULT NULL,
  `type` varchar(30) NOT NULL,
  `quantity_delta` int(11) NOT NULL,
  `balance_after` int(10) UNSIGNED NOT NULL,
  `stock_dimension` varchar(20) NOT NULL DEFAULT 'available',
  `reference_type` varchar(80) DEFAULT NULL,
  `reference_id` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `occurred_at` timestamp NOT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock_movements`
--

INSERT INTO `stock_movements` (`id`, `store_id`, `product_id`, `variant_id`, `order_id`, `order_item_id`, `movement_key`, `type`, `quantity_delta`, `balance_after`, `stock_dimension`, `reference_type`, `reference_id`, `notes`, `occurred_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, NULL, NULL, 'opening-1', 'opening_balance', 41, 41, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(2, 1, 1, 1, 9, 14, 'outbound-1-0', 'outbound', -1, 40, 'available', 'order', '9', 'Penjualan melalui pesanan.', '2026-05-26 16:41:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(3, 1, 1, 1, 27, 54, 'outbound-1-1', 'outbound', -3, 37, 'available', 'order', '27', 'Penjualan melalui pesanan.', '2026-06-10 16:37:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(4, 1, 1, 1, 54, 104, 'outbound-1-2', 'outbound', -3, 34, 'available', 'order', '54', 'Penjualan melalui pesanan.', '2026-08-26 23:15:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(5, 1, 1, 2, NULL, NULL, 'opening-2', 'opening_balance', 26, 26, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(6, 1, 1, 2, 30, 57, 'outbound-2-0', 'outbound', -2, 24, 'available', 'order', '30', 'Penjualan melalui pesanan.', '2026-05-21 04:03:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(7, 1, 1, 2, 27, 53, 'outbound-2-1', 'outbound', -2, 22, 'available', 'order', '27', 'Penjualan melalui pesanan.', '2026-06-10 16:37:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(8, 1, 2, 3, NULL, NULL, 'opening-3', 'opening_balance', 48, 48, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(9, 1, 2, 3, 66, 125, 'outbound-3-0', 'outbound', -1, 47, 'available', 'order', '66', 'Penjualan melalui pesanan.', '2026-07-23 10:30:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(10, 1, 2, 3, 49, 95, 'outbound-3-1', 'outbound', -2, 45, 'available', 'order', '49', 'Penjualan melalui pesanan.', '2026-07-24 05:13:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(11, 1, 2, 3, 69, 131, 'outbound-3-2', 'outbound', -3, 42, 'available', 'order', '69', 'Penjualan melalui pesanan.', '2026-07-31 19:37:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(12, 1, 2, 3, 19, 35, 'outbound-3-3', 'outbound', -2, 40, 'available', 'order', '19', 'Penjualan melalui pesanan.', '2026-08-06 12:45:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(13, 1, 3, 4, NULL, NULL, 'opening-4', 'opening_balance', 20, 20, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(14, 1, 3, 4, 42, 81, 'outbound-4-0', 'outbound', -2, 18, 'available', 'order', '42', 'Penjualan melalui pesanan.', '2026-07-04 00:06:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(15, 1, 3, 4, 20, 36, 'outbound-4-1', 'outbound', -3, 15, 'available', 'order', '20', 'Penjualan melalui pesanan.', '2026-07-10 09:47:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(16, 1, 3, 4, 66, 126, 'outbound-4-2', 'outbound', -2, 13, 'available', 'order', '66', 'Penjualan melalui pesanan.', '2026-07-23 10:30:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(17, 1, 3, 4, 49, 96, 'outbound-4-3', 'outbound', -1, 12, 'available', 'order', '49', 'Penjualan melalui pesanan.', '2026-07-24 05:13:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(18, 1, 4, 5, NULL, NULL, 'opening-5', 'opening_balance', 15, 15, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(19, 1, 4, 5, 30, 58, 'outbound-5-0', 'outbound', -1, 14, 'available', 'order', '30', 'Penjualan melalui pesanan.', '2026-05-21 04:03:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(20, 1, 4, 5, 49, 94, 'outbound-5-1', 'outbound', -2, 12, 'available', 'order', '49', 'Penjualan melalui pesanan.', '2026-07-24 05:13:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(21, 1, 4, 5, 69, 132, 'outbound-5-2', 'outbound', -1, 11, 'available', 'order', '69', 'Penjualan melalui pesanan.', '2026-07-31 19:37:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(22, 1, 4, 5, 8, 12, 'outbound-5-3', 'outbound', -2, 9, 'available', 'order', '8', 'Penjualan melalui pesanan.', '2026-08-04 11:34:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(23, 1, 5, 6, NULL, NULL, 'opening-6', 'opening_balance', 30, 30, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(24, 1, 5, 6, 27, 52, 'outbound-6-0', 'outbound', -2, 28, 'available', 'order', '27', 'Penjualan melalui pesanan.', '2026-06-10 16:37:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(25, 1, 6, 7, NULL, NULL, 'opening-7', 'opening_balance', 53, 53, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(26, 1, 6, 7, 50, 97, 'outbound-7-0', 'outbound', -3, 50, 'available', 'order', '50', 'Penjualan melalui pesanan.', '2026-08-27 14:42:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(27, 1, 7, 8, NULL, NULL, 'opening-8', 'opening_balance', 21, 21, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(28, 1, 7, 8, 9, 13, 'outbound-8-0', 'outbound', -3, 18, 'available', 'order', '9', 'Penjualan melalui pesanan.', '2026-05-26 16:41:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(29, 1, 8, 9, NULL, NULL, 'opening-9', 'opening_balance', 32, 32, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(30, 1, 8, 9, 30, 59, 'outbound-9-0', 'outbound', -3, 29, 'available', 'order', '30', 'Penjualan melalui pesanan.', '2026-05-21 04:03:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(31, 1, 8, 9, 54, 103, 'outbound-9-1', 'outbound', -2, 27, 'available', 'order', '54', 'Penjualan melalui pesanan.', '2026-08-26 23:15:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(32, 1, 8, 9, 50, 98, 'outbound-9-2', 'outbound', -2, 25, 'available', 'order', '50', 'Penjualan melalui pesanan.', '2026-08-27 14:42:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(33, 2, 9, 10, NULL, NULL, 'opening-10', 'opening_balance', 18, 18, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(34, 2, 9, 10, 26, 51, 'outbound-10-0', 'outbound', -3, 15, 'available', 'order', '26', 'Penjualan melalui pesanan.', '2026-05-30 09:07:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(35, 2, 9, 11, NULL, NULL, 'opening-11', 'opening_balance', 17, 17, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(36, 2, 9, 11, 53, 101, 'outbound-11-0', 'outbound', -2, 15, 'available', 'order', '53', 'Penjualan melalui pesanan.', '2026-05-27 03:47:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(37, 2, 9, 11, 36, 68, 'outbound-11-1', 'outbound', -3, 12, 'available', 'order', '36', 'Penjualan melalui pesanan.', '2026-06-23 23:52:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(38, 2, 10, 12, NULL, NULL, 'opening-12', 'opening_balance', 27, 27, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(39, 2, 10, 12, 13, 24, 'outbound-12-0', 'outbound', -2, 25, 'available', 'order', '13', 'Penjualan melalui pesanan.', '2026-07-08 05:29:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(40, 2, 10, 13, NULL, NULL, 'opening-13', 'opening_balance', 9, 9, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(41, 2, 10, 13, 36, 67, 'outbound-13-0', 'outbound', -1, 8, 'available', 'order', '36', 'Penjualan melalui pesanan.', '2026-06-23 23:52:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(42, 2, 11, 14, NULL, NULL, 'opening-14', 'opening_balance', 10, 10, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(43, 2, 11, 14, 26, 49, 'outbound-14-0', 'outbound', -2, 8, 'available', 'order', '26', 'Penjualan melalui pesanan.', '2026-05-30 09:07:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(44, 2, 11, 14, 7, 11, 'outbound-14-1', 'outbound', -1, 7, 'available', 'order', '7', 'Penjualan melalui pesanan.', '2026-09-02 12:38:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(45, 2, 12, 15, NULL, NULL, 'opening-15', 'opening_balance', 61, 61, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(46, 2, 12, 15, 59, 113, 'outbound-15-0', 'outbound', -1, 60, 'available', 'order', '59', 'Penjualan melalui pesanan.', '2026-09-10 12:38:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(47, 2, 12, 16, NULL, NULL, 'opening-16', 'opening_balance', 45, 45, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(48, 2, 12, 17, NULL, NULL, 'opening-17', 'opening_balance', 36, 36, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(49, 2, 12, 17, 13, 23, 'outbound-17-0', 'outbound', -3, 33, 'available', 'order', '13', 'Penjualan melalui pesanan.', '2026-07-08 05:29:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(50, 2, 12, 17, 15, 27, 'outbound-17-1', 'outbound', -2, 31, 'available', 'order', '15', 'Penjualan melalui pesanan.', '2026-08-12 01:45:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(51, 2, 12, 17, 59, 112, 'outbound-17-2', 'outbound', -1, 30, 'available', 'order', '59', 'Penjualan melalui pesanan.', '2026-09-10 12:38:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(52, 2, 13, 18, NULL, NULL, 'opening-18', 'opening_balance', 22, 22, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(53, 2, 13, 18, 26, 50, 'outbound-18-0', 'outbound', -2, 20, 'available', 'order', '26', 'Penjualan melalui pesanan.', '2026-05-30 09:07:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(54, 2, 14, 19, NULL, NULL, 'opening-19', 'opening_balance', 20, 20, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(55, 2, 14, 19, 5, 9, 'outbound-19-0', 'outbound', -2, 18, 'available', 'order', '5', 'Penjualan melalui pesanan.', '2026-09-06 04:21:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(56, 2, 15, 20, NULL, NULL, 'opening-20', 'opening_balance', 10, 10, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(57, 2, 16, 21, NULL, NULL, 'opening-21', 'opening_balance', 53, 53, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(58, 2, 16, 21, 13, 25, 'outbound-21-0', 'outbound', -3, 50, 'available', 'order', '13', 'Penjualan melalui pesanan.', '2026-07-08 05:29:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(59, 2, 16, 22, NULL, NULL, 'opening-22', 'opening_balance', 23, 23, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(60, 2, 16, 22, 53, 102, 'outbound-22-0', 'outbound', -3, 20, 'available', 'order', '53', 'Penjualan melalui pesanan.', '2026-05-27 03:47:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(61, 2, 16, 22, 36, 66, 'outbound-22-1', 'outbound', -3, 17, 'available', 'order', '36', 'Penjualan melalui pesanan.', '2026-06-23 23:52:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(62, 2, 16, 22, 59, 111, 'outbound-22-2', 'outbound', -2, 15, 'available', 'order', '59', 'Penjualan melalui pesanan.', '2026-09-10 12:38:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(63, 3, 17, 23, NULL, NULL, 'opening-23', 'opening_balance', 26, 26, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(64, 3, 17, 23, 67, 128, 'outbound-23-0', 'outbound', -3, 23, 'available', 'order', '67', 'Penjualan melalui pesanan.', '2026-06-20 02:16:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(65, 3, 17, 23, 2, 5, 'outbound-23-1', 'outbound', -3, 20, 'available', 'order', '2', 'Penjualan melalui pesanan.', '2026-08-10 23:54:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(66, 3, 17, 24, NULL, NULL, 'opening-24', 'opening_balance', 20, 20, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(67, 3, 17, 24, 28, 55, 'outbound-24-0', 'outbound', -2, 18, 'available', 'order', '28', 'Penjualan melalui pesanan.', '2026-07-25 10:05:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(68, 3, 17, 24, 3, 7, 'outbound-24-1', 'outbound', -2, 16, 'available', 'order', '3', 'Penjualan melalui pesanan.', '2026-08-10 09:47:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(69, 3, 18, 25, NULL, NULL, 'opening-25', 'opening_balance', 25, 25, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(70, 3, 18, 25, 65, 123, 'outbound-25-0', 'outbound', -3, 22, 'available', 'order', '65', 'Penjualan melalui pesanan.', '2026-08-03 03:05:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(71, 3, 18, 25, 45, 89, 'outbound-25-1', 'outbound', -2, 20, 'available', 'order', '45', 'Penjualan melalui pesanan.', '2026-08-04 16:25:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(72, 3, 18, 25, 3, 6, 'outbound-25-2', 'outbound', -2, 18, 'available', 'order', '3', 'Penjualan melalui pesanan.', '2026-08-10 09:47:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(73, 3, 18, 26, NULL, NULL, 'opening-26', 'opening_balance', 10, 10, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(74, 3, 18, 26, 67, 129, 'outbound-26-0', 'outbound', -2, 8, 'available', 'order', '67', 'Penjualan melalui pesanan.', '2026-06-20 02:16:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(75, 3, 18, 26, 63, 119, 'outbound-26-1', 'outbound', -1, 7, 'available', 'order', '63', 'Penjualan melalui pesanan.', '2026-07-11 17:11:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(76, 3, 18, 26, 37, 69, 'outbound-26-2', 'outbound', -2, 5, 'available', 'order', '37', 'Penjualan melalui pesanan.', '2026-08-03 06:47:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(77, 3, 19, 27, NULL, NULL, 'opening-27', 'opening_balance', 20, 20, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(78, 3, 19, 27, 65, 124, 'outbound-27-0', 'outbound', -3, 17, 'available', 'order', '65', 'Penjualan melalui pesanan.', '2026-08-03 03:05:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(79, 3, 19, 27, 45, 88, 'outbound-27-1', 'outbound', -3, 14, 'available', 'order', '45', 'Penjualan melalui pesanan.', '2026-08-04 16:25:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(80, 3, 20, 28, NULL, NULL, 'opening-28', 'opening_balance', 12, 12, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(81, 3, 20, 28, 60, 115, 'outbound-28-0', 'outbound', -2, 10, 'available', 'order', '60', 'Penjualan melalui pesanan.', '2026-06-19 20:23:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(82, 3, 21, 29, NULL, NULL, 'opening-29', 'opening_balance', 36, 36, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(83, 3, 21, 29, 10, 16, 'outbound-29-0', 'outbound', -3, 33, 'available', 'order', '10', 'Penjualan melalui pesanan.', '2026-06-13 14:34:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(84, 3, 21, 29, 2, 4, 'outbound-29-1', 'outbound', -3, 30, 'available', 'order', '2', 'Penjualan melalui pesanan.', '2026-08-10 23:54:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(85, 3, 22, 30, NULL, NULL, 'opening-30', 'opening_balance', 31, 31, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(86, 3, 22, 30, 10, 17, 'outbound-30-0', 'outbound', -2, 29, 'available', 'order', '10', 'Penjualan melalui pesanan.', '2026-06-13 14:34:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(87, 3, 22, 30, 67, 127, 'outbound-30-1', 'outbound', -3, 26, 'available', 'order', '67', 'Penjualan melalui pesanan.', '2026-06-20 02:16:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(88, 3, 22, 30, 51, 99, 'outbound-30-2', 'outbound', -3, 23, 'available', 'order', '51', 'Penjualan melalui pesanan.', '2026-07-08 17:25:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(89, 3, 22, 30, 2, 3, 'outbound-30-3', 'outbound', -1, 22, 'available', 'order', '2', 'Penjualan melalui pesanan.', '2026-08-10 23:54:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(90, 3, 23, 31, NULL, NULL, 'opening-31', 'opening_balance', 45, 45, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(91, 3, 23, 31, 63, 120, 'outbound-31-0', 'outbound', -2, 43, 'available', 'order', '63', 'Penjualan melalui pesanan.', '2026-07-11 17:11:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(92, 3, 23, 31, 37, 70, 'outbound-31-1', 'outbound', -1, 42, 'available', 'order', '37', 'Penjualan melalui pesanan.', '2026-08-03 06:47:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(93, 3, 23, 31, 45, 87, 'outbound-31-2', 'outbound', -2, 40, 'available', 'order', '45', 'Penjualan melalui pesanan.', '2026-08-04 16:25:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(94, 3, 24, 32, NULL, NULL, 'opening-32', 'opening_balance', 31, 31, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(95, 3, 24, 32, 10, 15, 'outbound-32-0', 'outbound', -3, 28, 'available', 'order', '10', 'Penjualan melalui pesanan.', '2026-06-13 14:34:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(96, 3, 24, 32, 60, 114, 'outbound-32-1', 'outbound', -2, 26, 'available', 'order', '60', 'Penjualan melalui pesanan.', '2026-06-19 20:23:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(97, 4, 25, 33, NULL, NULL, 'opening-33', 'opening_balance', 10, 10, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(98, 4, 25, 33, 18, 32, 'outbound-33-0', 'outbound', -3, 7, 'available', 'order', '18', 'Penjualan melalui pesanan.', '2026-06-12 13:01:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(99, 4, 25, 33, 32, 62, 'outbound-33-1', 'outbound', -1, 6, 'available', 'order', '32', 'Penjualan melalui pesanan.', '2026-06-18 02:30:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(100, 4, 25, 34, NULL, NULL, 'opening-34', 'opening_balance', 15, 15, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(101, 4, 25, 34, 32, 61, 'outbound-34-0', 'outbound', -2, 13, 'available', 'order', '32', 'Penjualan melalui pesanan.', '2026-06-18 02:30:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(102, 4, 25, 34, 43, 82, 'outbound-34-1', 'outbound', -1, 12, 'available', 'order', '43', 'Penjualan melalui pesanan.', '2026-07-12 22:08:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(103, 4, 25, 35, NULL, NULL, 'opening-35', 'opening_balance', 10, 10, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(104, 4, 25, 35, 64, 122, 'outbound-35-0', 'outbound', -1, 9, 'available', 'order', '64', 'Penjualan melalui pesanan.', '2026-07-03 01:46:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(105, 4, 25, 35, 57, 108, 'outbound-35-1', 'outbound', -2, 7, 'available', 'order', '57', 'Penjualan melalui pesanan.', '2026-07-20 11:01:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(106, 4, 25, 35, 34, 64, 'outbound-35-2', 'outbound', -3, 4, 'available', 'order', '34', 'Penjualan melalui pesanan.', '2026-08-29 22:48:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(107, 4, 26, 36, NULL, NULL, 'opening-36', 'opening_balance', 15, 15, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(108, 4, 26, 37, NULL, NULL, 'opening-37', 'opening_balance', 8, 8, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(109, 4, 27, 38, NULL, NULL, 'opening-38', 'opening_balance', 22, 22, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(110, 4, 27, 38, 18, 33, 'outbound-38-0', 'outbound', -2, 20, 'available', 'order', '18', 'Penjualan melalui pesanan.', '2026-06-12 13:01:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(111, 4, 27, 39, NULL, NULL, 'opening-39', 'opening_balance', 18, 18, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(112, 4, 27, 40, NULL, NULL, 'opening-40', 'opening_balance', 7, 7, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(113, 4, 27, 40, 43, 83, 'outbound-40-0', 'outbound', -1, 6, 'available', 'order', '43', 'Penjualan melalui pesanan.', '2026-07-12 22:08:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(114, 4, 28, 41, NULL, NULL, 'opening-41', 'opening_balance', 34, 34, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(115, 4, 28, 41, 39, 75, 'outbound-41-0', 'outbound', -1, 33, 'available', 'order', '39', 'Penjualan melalui pesanan.', '2026-07-23 17:50:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(116, 4, 28, 41, 40, 79, 'outbound-41-1', 'outbound', -3, 30, 'available', 'order', '40', 'Penjualan melalui pesanan.', '2026-08-23 05:40:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(117, 4, 28, 42, NULL, NULL, 'opening-42', 'opening_balance', 27, 27, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(118, 4, 28, 42, 70, 133, 'outbound-42-0', 'outbound', -2, 25, 'available', 'order', '70', 'Penjualan melalui pesanan.', '2026-06-20 14:00:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(119, 4, 28, 42, 43, 84, 'outbound-42-1', 'outbound', -3, 22, 'available', 'order', '43', 'Penjualan melalui pesanan.', '2026-07-12 22:08:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(120, 4, 28, 43, NULL, NULL, 'opening-43', 'opening_balance', 11, 11, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(121, 4, 28, 43, 35, 65, 'outbound-43-0', 'outbound', -1, 10, 'available', 'order', '35', 'Penjualan melalui pesanan.', '2026-08-31 20:10:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(122, 4, 29, 44, NULL, NULL, 'opening-44', 'opening_balance', 14, 14, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(123, 4, 29, 44, 64, 121, 'outbound-44-0', 'outbound', -1, 13, 'available', 'order', '64', 'Penjualan melalui pesanan.', '2026-07-03 01:46:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(124, 4, 29, 44, 39, 76, 'outbound-44-1', 'outbound', -1, 12, 'available', 'order', '39', 'Penjualan melalui pesanan.', '2026-07-23 17:50:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(125, 4, 29, 45, NULL, NULL, 'opening-45', 'opening_balance', 17, 17, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(126, 4, 29, 45, 18, 34, 'outbound-45-0', 'outbound', -2, 15, 'available', 'order', '18', 'Penjualan melalui pesanan.', '2026-06-12 13:01:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(127, 4, 29, 45, 39, 74, 'outbound-45-1', 'outbound', -3, 12, 'available', 'order', '39', 'Penjualan melalui pesanan.', '2026-07-23 17:50:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(128, 4, 29, 45, 29, 56, 'outbound-45-2', 'outbound', -3, 9, 'available', 'order', '29', 'Penjualan melalui pesanan.', '2026-08-20 15:28:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(129, 4, 30, 46, NULL, NULL, 'opening-46', 'opening_balance', 7, 7, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(130, 4, 30, 46, 52, 100, 'outbound-46-0', 'outbound', -2, 5, 'available', 'order', '52', 'Penjualan melalui pesanan.', '2026-07-14 12:25:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(131, 4, 30, 47, NULL, NULL, 'opening-47', 'opening_balance', 10, 10, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(132, 4, 30, 47, 40, 78, 'outbound-47-0', 'outbound', -3, 7, 'available', 'order', '40', 'Penjualan melalui pesanan.', '2026-08-23 05:40:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(133, 4, 31, 48, NULL, NULL, 'opening-48', 'opening_balance', 4, 4, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(134, 4, 31, 48, 40, 77, 'outbound-48-0', 'outbound', -1, 3, 'available', 'order', '40', 'Penjualan melalui pesanan.', '2026-08-23 05:40:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(135, 4, 32, 49, NULL, NULL, 'opening-49', 'opening_balance', 17, 17, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(136, 4, 32, 49, 70, 134, 'outbound-49-0', 'outbound', -1, 16, 'available', 'order', '70', 'Penjualan melalui pesanan.', '2026-06-20 14:00:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(137, 5, 33, 50, NULL, NULL, 'opening-50', 'opening_balance', 45, 45, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(138, 5, 33, 51, NULL, NULL, 'opening-51', 'opening_balance', 12, 12, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(139, 5, 33, 51, 6, 10, 'outbound-51-0', 'outbound', -1, 11, 'available', 'order', '6', 'Penjualan melalui pesanan.', '2026-05-30 13:47:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(140, 5, 33, 51, 12, 21, 'outbound-51-1', 'outbound', -3, 8, 'available', 'order', '12', 'Penjualan melalui pesanan.', '2026-08-16 04:39:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(141, 5, 34, 52, NULL, NULL, 'opening-52', 'opening_balance', 38, 38, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(142, 5, 34, 52, 46, 90, 'outbound-52-0', 'outbound', -2, 36, 'available', 'order', '46', 'Penjualan melalui pesanan.', '2026-08-06 21:15:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(143, 5, 34, 52, 44, 85, 'outbound-52-1', 'outbound', -1, 35, 'available', 'order', '44', 'Penjualan melalui pesanan.', '2026-08-15 12:19:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(144, 5, 35, 53, NULL, NULL, 'opening-53', 'opening_balance', 42, 42, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(145, 5, 35, 53, 21, 38, 'outbound-53-0', 'outbound', -2, 40, 'available', 'order', '21', 'Penjualan melalui pesanan.', '2026-06-16 18:13:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(146, 5, 36, 54, NULL, NULL, 'opening-54', 'opening_balance', 55, 55, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(147, 5, 36, 54, 22, 40, 'outbound-54-0', 'outbound', -3, 52, 'available', 'order', '22', 'Penjualan melalui pesanan.', '2026-07-10 21:33:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(148, 5, 36, 54, 31, 60, 'outbound-54-1', 'outbound', -2, 50, 'available', 'order', '31', 'Penjualan melalui pesanan.', '2026-08-26 06:25:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(149, 5, 36, 55, NULL, NULL, 'opening-55', 'opening_balance', 47, 47, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(150, 5, 36, 55, 17, 31, 'outbound-55-0', 'outbound', -2, 45, 'available', 'order', '17', 'Penjualan melalui pesanan.', '2026-06-16 18:56:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(151, 5, 36, 55, 22, 41, 'outbound-55-1', 'outbound', -3, 42, 'available', 'order', '22', 'Penjualan melalui pesanan.', '2026-07-10 21:33:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(152, 5, 36, 56, NULL, NULL, 'opening-56', 'opening_balance', 0, 0, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(153, 5, 37, 57, NULL, NULL, 'opening-57', 'opening_balance', 30, 30, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(154, 5, 37, 57, 16, 29, 'outbound-57-0', 'outbound', -2, 28, 'available', 'order', '16', 'Penjualan melalui pesanan.', '2026-06-12 04:57:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(155, 5, 37, 57, 61, 116, 'outbound-57-1', 'outbound', -3, 25, 'available', 'order', '61', 'Penjualan melalui pesanan.', '2026-06-14 16:07:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(156, 5, 37, 57, 21, 37, 'outbound-57-2', 'outbound', -3, 22, 'available', 'order', '21', 'Penjualan melalui pesanan.', '2026-06-16 18:13:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(157, 5, 37, 57, 23, 43, 'outbound-57-3', 'outbound', -2, 20, 'available', 'order', '23', 'Penjualan melalui pesanan.', '2026-08-08 21:20:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(158, 5, 38, 58, NULL, NULL, 'opening-58', 'opening_balance', 34, 34, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(159, 5, 38, 58, 1, 2, 'outbound-58-0', 'outbound', -2, 32, 'available', 'order', '1', 'Penjualan melalui pesanan.', '2026-06-28 08:01:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(160, 5, 38, 58, 44, 86, 'outbound-58-1', 'outbound', -2, 30, 'available', 'order', '44', 'Penjualan melalui pesanan.', '2026-08-15 12:19:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(161, 5, 38, 58, 12, 22, 'outbound-58-2', 'outbound', -3, 27, 'available', 'order', '12', 'Penjualan melalui pesanan.', '2026-08-16 04:39:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(162, 5, 38, 58, 25, 48, 'outbound-58-3', 'outbound', -2, 25, 'available', 'order', '25', 'Penjualan melalui pesanan.', '2026-09-03 14:44:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(163, 5, 39, 59, NULL, NULL, 'opening-59', 'opening_balance', 36, 36, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(164, 5, 39, 59, 17, 30, 'outbound-59-0', 'outbound', -1, 35, 'available', 'order', '17', 'Penjualan melalui pesanan.', '2026-06-16 18:56:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(165, 5, 39, 59, 12, 20, 'outbound-59-1', 'outbound', -2, 33, 'available', 'order', '12', 'Penjualan melalui pesanan.', '2026-08-16 04:39:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(166, 5, 39, 59, 25, 47, 'outbound-59-2', 'outbound', -3, 30, 'available', 'order', '25', 'Penjualan melalui pesanan.', '2026-09-03 14:44:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(167, 5, 40, 60, NULL, NULL, 'opening-60', 'opening_balance', 27, 27, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(168, 5, 40, 60, 16, 28, 'outbound-60-0', 'outbound', -2, 25, 'available', 'order', '16', 'Penjualan melalui pesanan.', '2026-06-12 04:57:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(169, 5, 40, 60, 21, 39, 'outbound-60-1', 'outbound', -2, 23, 'available', 'order', '21', 'Penjualan melalui pesanan.', '2026-06-16 18:13:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(170, 5, 40, 60, 1, 1, 'outbound-60-2', 'outbound', -1, 22, 'available', 'order', '1', 'Penjualan melalui pesanan.', '2026-06-28 08:01:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(171, 5, 40, 60, 14, 26, 'outbound-60-3', 'outbound', -1, 21, 'available', 'order', '14', 'Penjualan melalui pesanan.', '2026-07-28 22:48:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(172, 5, 40, 60, 23, 42, 'outbound-60-4', 'outbound', -3, 18, 'available', 'order', '23', 'Penjualan melalui pesanan.', '2026-08-08 21:20:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(173, 6, 41, 61, NULL, NULL, 'opening-61', 'opening_balance', 12, 12, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(174, 6, 41, 61, 58, 110, 'outbound-61-0', 'outbound', -1, 11, 'available', 'order', '58', 'Penjualan melalui pesanan.', '2026-06-03 16:34:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(175, 6, 41, 61, 38, 73, 'outbound-61-1', 'outbound', -1, 10, 'available', 'order', '38', 'Penjualan melalui pesanan.', '2026-07-07 23:04:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(176, 6, 41, 61, 56, 106, 'outbound-61-2', 'outbound', -2, 8, 'available', 'order', '56', 'Penjualan melalui pesanan.', '2026-07-18 16:41:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(177, 6, 41, 61, 47, 91, 'outbound-61-3', 'outbound', -3, 5, 'available', 'order', '47', 'Penjualan melalui pesanan.', '2026-08-16 12:40:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(178, 6, 41, 62, NULL, NULL, 'opening-62', 'opening_balance', 28, 28, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL);
INSERT INTO `stock_movements` (`id`, `store_id`, `product_id`, `variant_id`, `order_id`, `order_item_id`, `movement_key`, `type`, `quantity_delta`, `balance_after`, `stock_dimension`, `reference_type`, `reference_id`, `notes`, `occurred_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(179, 6, 41, 62, 68, 130, 'outbound-62-0', 'outbound', -3, 25, 'available', 'order', '68', 'Penjualan melalui pesanan.', '2026-06-03 04:12:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(180, 6, 41, 62, 41, 80, 'outbound-62-1', 'outbound', -3, 22, 'available', 'order', '41', 'Penjualan melalui pesanan.', '2026-06-09 04:45:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(181, 6, 41, 62, 62, 118, 'outbound-62-2', 'outbound', -2, 20, 'available', 'order', '62', 'Penjualan melalui pesanan.', '2026-06-18 10:47:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(182, 6, 41, 62, 33, 63, 'outbound-62-3', 'outbound', -3, 17, 'available', 'order', '33', 'Penjualan melalui pesanan.', '2026-08-01 02:28:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(183, 6, 41, 62, 71, 137, 'outbound-62-4', 'outbound', -2, 15, 'available', 'order', '71', 'Penjualan melalui pesanan.', '2026-08-15 18:38:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(184, 6, 41, 62, 24, 46, 'outbound-62-5', 'outbound', -2, 13, 'available', 'order', '24', 'Penjualan melalui pesanan.', '2026-08-16 00:58:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(185, 6, 41, 62, 55, 105, 'outbound-62-6', 'outbound', -3, 10, 'available', 'order', '55', 'Penjualan melalui pesanan.', '2026-08-17 19:01:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(186, 6, 41, 62, 48, 93, 'outbound-62-7', 'outbound', -3, 7, 'available', 'order', '48', 'Penjualan melalui pesanan.', '2026-09-10 22:17:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(187, 6, 42, 63, NULL, NULL, 'opening-63', 'opening_balance', 14, 14, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(188, 6, 42, 63, 62, 117, 'outbound-63-0', 'outbound', -3, 11, 'available', 'order', '62', 'Penjualan melalui pesanan.', '2026-06-18 10:47:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(189, 6, 42, 63, 11, 19, 'outbound-63-1', 'outbound', -1, 10, 'available', 'order', '11', 'Penjualan melalui pesanan.', '2026-07-17 23:47:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(190, 6, 42, 63, 56, 107, 'outbound-63-2', 'outbound', -2, 8, 'available', 'order', '56', 'Penjualan melalui pesanan.', '2026-07-18 16:41:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(191, 6, 42, 64, NULL, NULL, 'opening-64', 'opening_balance', 14, 14, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(192, 6, 42, 64, 58, 109, 'outbound-64-0', 'outbound', -2, 12, 'available', 'order', '58', 'Penjualan melalui pesanan.', '2026-06-03 16:34:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(193, 6, 42, 64, 38, 71, 'outbound-64-1', 'outbound', -2, 10, 'available', 'order', '38', 'Penjualan melalui pesanan.', '2026-07-07 23:04:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(194, 6, 42, 64, 71, 136, 'outbound-64-2', 'outbound', -2, 8, 'available', 'order', '71', 'Penjualan melalui pesanan.', '2026-08-15 18:38:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(195, 6, 42, 64, 24, 45, 'outbound-64-3', 'outbound', -2, 6, 'available', 'order', '24', 'Penjualan melalui pesanan.', '2026-08-16 00:58:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(196, 6, 42, 64, 4, 8, 'outbound-64-4', 'outbound', -2, 4, 'available', 'order', '4', 'Penjualan melalui pesanan.', '2026-08-28 12:51:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(197, 6, 43, 65, NULL, NULL, 'opening-65', 'opening_balance', 14, 14, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(198, 6, 43, 65, 38, 72, 'outbound-65-0', 'outbound', -1, 13, 'available', 'order', '38', 'Penjualan melalui pesanan.', '2026-07-07 23:04:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(199, 6, 43, 65, 11, 18, 'outbound-65-1', 'outbound', -1, 12, 'available', 'order', '11', 'Penjualan melalui pesanan.', '2026-07-17 23:47:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(200, 6, 43, 65, 71, 135, 'outbound-65-2', 'outbound', -3, 9, 'available', 'order', '71', 'Penjualan melalui pesanan.', '2026-08-15 18:38:52', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(201, 6, 43, 65, 48, 92, 'outbound-65-3', 'outbound', -3, 6, 'available', 'order', '48', 'Penjualan melalui pesanan.', '2026-09-10 22:17:51', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(202, 6, 43, 66, NULL, NULL, 'opening-66', 'opening_balance', 6, 6, 'available', 'seed', NULL, 'Saldo awal produk saat masuk demo.', '2026-05-15 17:00:00', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(203, 6, 43, 66, 24, 44, 'outbound-66-0', 'outbound', -3, 3, 'available', 'order', '24', 'Penjualan melalui pesanan.', '2026-08-16 00:58:50', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:50', '2026-09-14 00:59:50', NULL),
(204, 6, 43, 65, 72, 138, 'checkout-reserved.reserved', 'reservation', -1, 1, 'reserved', 'checkout', '72', 'Reservasi stok saat checkout', '2026-09-15 00:51:49', '1ae55236-f781-406a-baa7-62635f4c9545', '1ae55236-f781-406a-baa7-62635f4c9545', '2026-09-15 00:51:49', '2026-09-15 00:51:49', NULL),
(228, 1, 8, 9, NULL, NULL, 'checkout-reserved.reserved', 'reservation', -1, 6, 'reserved', 'checkout', '84', 'Reservasi stok saat checkout', '2026-09-21 21:54:10', '00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000202', '2026-09-21 21:54:10', '2026-09-21 21:54:10', NULL),
(229, 1, 8, 9, NULL, NULL, 'cancel-release.reserved', 'release', -1, 5, 'reserved', 'order_cancelled', '84', 'Komitmen reserved dilepas karena pesanan dibatalkan', '2026-09-21 21:54:13', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-21 21:54:13', '2026-09-21 21:54:13', NULL),
(234, 2, 16, 22, 86, 152, 'checkout-reserved.reserved', 'reservation', -1, 1, 'reserved', 'checkout', '86', 'Reservasi stok saat checkout', '2026-09-21 22:01:15', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', '2026-09-21 22:01:15', '2026-09-21 22:01:15', NULL),
(235, 2, 16, 22, 86, 152, 'checkout-reserved.booked', 'reservation', -1, 1, 'booked', 'checkout', '86', 'Reservasi stok saat checkout', '2026-09-21 22:01:15', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', '2026-09-21 22:01:15', '2026-09-21 22:01:15', NULL),
(236, 2, 16, 22, 86, 152, 'paid-commit.reserved', 'outbound', -1, 0, 'reserved', 'payment', '86', 'Komitmen reserved dipotong saat pembayaran berhasil', '2026-09-21 22:01:15', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', '2026-09-21 22:01:15', '2026-09-21 22:01:15', NULL),
(237, 2, 16, 22, 86, 152, 'paid-commit.booked', 'outbound', -1, 0, 'booked', 'payment', '86', 'Komitmen booked dipotong saat pembayaran berhasil', '2026-09-21 22:01:15', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', '2026-09-21 22:01:15', '2026-09-21 22:01:15', NULL),
(238, 2, 16, 22, 86, 152, 'paid-commit.available', 'outbound', -1, 14, 'available', 'payment', '86', 'Stok terpotong saat pembayaran berhasil', '2026-09-21 22:01:15', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', '2026-09-21 22:01:15', '2026-09-21 22:01:15', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `short_description` varchar(255) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `city` varchar(80) DEFAULT NULL,
  `province` varchar(80) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` enum('pending','approved','suspended') NOT NULL DEFAULT 'pending',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `store_type` varchar(40) NOT NULL DEFAULT 'regular',
  `logo` varchar(255) DEFAULT NULL,
  `banner_url` varchar(255) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `user_id`, `name`, `slug`, `description`, `short_description`, `phone`, `email`, `city`, `province`, `address`, `status`, `is_active`, `store_type`, `logo`, `banner_url`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '00000000-0000-4000-8000-000000000101', 'Toko Sari Nusantara', 'sari-nusantara', 'Toko Sari Nusantara menjual aneka keripik, kue kering, dan oleh-oleh khas Nusantara. Bahan pilihan, dikemas higienis, dan diproduksi setiap hari sehingga selalu segar.', 'Makanan ringan & oleh-oleh khas Nusantara.', '081234561101', 'sarinusantara@gmail.com', 'Malang', 'Jawa Timur', 'Jl. Ijen Nirwana No. 17, Kota Malang', 'approved', 1, 'regular', 'https://picsum.photos/seed/store-sari-nusantara/160/160', 'https://picsum.photos/seed/banner-sari-nusantara/1200/400', '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000101', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
(2, '00000000-0000-4000-8000-000000000102', 'Raka Cell & Elektronik', 'raka-teknologi', 'Raka Cell & Elektronik menyediakan perangkat elektronik dan aksesori gadget original bergaransi. Pengiriman cepat dengan packing aman.', 'Gadget, aksesori & elektronik rumah.', '081234561102', 'rakateknologi@gmail.com', 'Jakarta Pusat', 'DKI Jakarta', 'Jl. Jend. Sudirman Kav. 21, Jakarta Pusat', 'approved', 1, 'regular', 'https://picsum.photos/seed/store-raka-teknologi/160/160', 'https://picsum.photos/seed/banner-raka-teknologi/1200/400', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
(3, '00000000-0000-4000-8000-000000000103', 'Rumah Kopi Nusantara', 'kopi-nusantara', 'Rumah Kopi Nusantara menyajikan biji kopi pilihan dari Gayo, Kintamani, Toraja, dan Jawa yang disangrai setiap hari agar aromanya selalu prima.', 'Kopi nusantara sangrai harian.', '081234561103', 'kopinusantara@gmail.com', 'Yogyakarta', 'DI Yogyakarta', 'Jl. Kaliurang KM 5.5, Sleman, Yogyakarta', 'approved', 1, 'regular', 'https://picsum.photos/seed/store-kopi-nusantara/160/160', 'https://picsum.photos/seed/banner-kopi-nusantara/1200/400', '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000103', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
(4, '00000000-0000-4000-8000-000000000104', 'Purnama Batik & Fashion', 'purnama-batik', 'Purnama Batik & Fashion mengangkat kain batik dari pengrajin Solo dan Pekalongan. Tersedia batik tulis, cap, dan printing dengan desain eksklusif.', 'Batik tulis, cap & fashion khas Solo.', '081234561104', 'purnamabatik@gmail.com', 'Surakarta', 'Jawa Tengah', 'Jl. Slamet Riyadi No. 328, Surakarta', 'approved', 1, 'regular', 'https://picsum.photos/seed/store-purnama-batik/160/160', 'https://picsum.photos/seed/banner-purnama-batik/1200/400', '00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000104', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
(5, '00000000-0000-4000-8000-000000000105', 'Ananda Stationery & Kreatif', 'ananda-stationery', 'Ananda Stationery & Kreatif menyediakan alat tulis, buku catatan, dan perlengkapan kerajinan untuk kebutuhan sekolah, kantor, dan hobi.', 'Alat tulis, kertas & perlengkapan kreatif.', '081234561105', 'anandastationery@gmail.com', 'Bandung', 'Jawa Barat', 'Jl. Braga No. 12, Kota Bandung', 'approved', 1, 'regular', 'https://picsum.photos/seed/store-ananda-stationery/160/160', 'https://picsum.photos/seed/banner-ananda-stationery/1200/400', '00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000105', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
(6, '00000000-0000-4000-8000-000000000106', 'Sentra Operasional Mandiri', 'sentra-operasional', 'Sentra Operasional Mandiri adalah dapur produksi makanan siap saji yang mencatat seluruh operasional toko: stok bahan baku, HPP produksi, pengeluaran kas, hingga piutang atas pesanan khusus.', 'Dapur produksi makanan siap saji dengan pencatatan operasional lengkap.', '081234561106', 'sentraoperasional@gmail.com', 'Bekasi', 'Jawa Barat', 'Jl. Ahmad Yani No. 88, Bekasi Timur', 'approved', 1, 'regular', 'https://picsum.photos/seed/store-sentra-operasional/160/160', 'https://picsum.photos/seed/banner-sentra-operasional/1200/400', '00000000-0000-4000-8000-000000000106', '00000000-0000-4000-8000-000000000106', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
(7, '00000000-0000-4000-8000-000000000001', 'Marketku Official Store', 'marketku-official', 'Toko resmi platform Marketku untuk banner, promo, dan voucher platform.', 'Toko resmi platform Marketku.', '081234560000', 'official@marketku.id', 'Jakarta Selatan', 'DKI Jakarta', 'Gedung Marketku Tower, SCBD Lot 9, Jakarta Selatan', 'approved', 1, 'regular', 'https://picsum.photos/seed/store-marketku-official/160/160', 'https://picsum.photos/seed/banner-marketku-official/1200/400', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
(8, '1ae55236-f781-406a-baa7-62635f4c9545', 'Akbar', 'akbar', NULL, 'puyiuyiuyiu', '0987798798', 'akbarfahlevy39@gmail.com', 'Sidoarjo', 'Jawa Timur', 'Modong, Tulangan, Sidoarjo, Jawa Timur, 61273, Indonesia', 'pending', 1, 'regular', 'stores/logos/RpBjUwLPmSRH3bDPdDZcQt0GVzNUQOS4qOorOZit.png', 'stores/banners/g9VWN5Ym1fq0knz6jTPQhm7FOLJgnHpp5TvQsm7o.jpg', '1ae55236-f781-406a-baa7-62635f4c9545', '1ae55236-f781-406a-baa7-62635f4c9545', '2026-09-15 21:49:37', '2026-09-15 21:49:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `store_details`
--

CREATE TABLE `store_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `owner_name` varchar(120) DEFAULT NULL,
  `owner_phone` varchar(30) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `shipping_policy` text DEFAULT NULL,
  `return_policy` text DEFAULT NULL,
  `open_days` varchar(120) DEFAULT NULL,
  `open_time` time DEFAULT NULL,
  `close_time` time DEFAULT NULL,
  `whatsapp_url` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `tiktok_url` varchar(255) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `store_details`
--

INSERT INTO `store_details` (`id`, `store_id`, `owner_name`, `owner_phone`, `description`, `shipping_policy`, `return_policy`, `open_days`, `open_time`, `close_time`, `whatsapp_url`, `instagram_url`, `tiktok_url`, `website_url`, `created_at`, `updated_at`) VALUES
(1, 1, 'Sari Nurjanah', '081234561101', 'Toko Sari Nusantara menjual aneka keripik, kue kering, dan oleh-oleh khas Nusantara. Bahan pilihan, dikemas higienis, dan diproduksi setiap hari sehingga selalu segar.', 'Pesanan dikirim setiap hari sebelum jam 20:00 WIB. Packing rapi dengan bubble wrap.', 'Barang dapat dikembalikan maksimal 2 x 24 jam setelah diterima apabila rusak/keliru.', 'Senin s/d Minggu', '07:00:00', '20:00:00', 'https://wa.me/6281234561101', 'https://instagram.com/sarinusantara', 'https://tiktok.com/@sarinusantara', NULL, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(2, 2, 'Raka Wibawa', '081234561102', 'Raka Cell & Elektronik menyediakan perangkat elektronik dan aksesori gadget original bergaransi. Pengiriman cepat dengan packing aman.', 'Pesanan dikirim setiap hari sebelum jam 21:00 WIB. Packing rapi dengan bubble wrap.', 'Barang dapat dikembalikan maksimal 2 x 24 jam setelah diterima apabila rusak/keliru.', 'Senin s/d Sabtu', '08:00:00', '21:00:00', 'https://wa.me/6281234561102', 'https://instagram.com/rakaceltelektronik', 'https://tiktok.com/@rakaceltelektronik', NULL, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(3, 3, 'Bima Anggara', '081234561103', 'Rumah Kopi Nusantara menyajikan biji kopi pilihan dari Gayo, Kintamani, Toraja, dan Jawa yang disangrai setiap hari agar aromanya selalu prima.', 'Pesanan dikirim setiap hari sebelum jam 22:00 WIB. Packing rapi dengan bubble wrap.', 'Barang dapat dikembalikan maksimal 2 x 24 jam setelah diterima apabila rusak/keliru.', 'Senin s/d Minggu', '06:00:00', '22:00:00', 'https://wa.me/6281234561103', 'https://instagram.com/rumahkopinusantara', 'https://tiktok.com/@rumahkopinusantara', NULL, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(4, 4, 'Laras Purnama', '081234561104', 'Purnama Batik & Fashion mengangkat kain batik dari pengrajin Solo dan Pekalongan. Tersedia batik tulis, cap, dan printing dengan desain eksklusif.', 'Pesanan dikirim setiap hari sebelum jam 21:00 WIB. Packing rapi dengan bubble wrap.', 'Barang dapat dikembalikan maksimal 2 x 24 jam setelah diterima apabila rusak/keliru.', 'Senin s/d Minggu', '08:00:00', '21:00:00', 'https://wa.me/6281234561104', 'https://instagram.com/purnamabatik', 'https://tiktok.com/@purnamabatik', NULL, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(5, 5, 'Nanda Saputra', '081234561105', 'Ananda Stationery & Kreatif menyediakan alat tulis, buku catatan, dan perlengkapan kerajinan untuk kebutuhan sekolah, kantor, dan hobi.', 'Pesanan dikirim setiap hari sebelum jam 19:00 WIB. Packing rapi dengan bubble wrap.', 'Barang dapat dikembalikan maksimal 2 x 24 jam setelah diterima apabila rusak/keliru.', 'Senin s/d Sabtu', '08:00:00', '19:00:00', 'https://wa.me/6281234561105', 'https://instagram.com/anandastationery', 'https://tiktok.com/@anandastationery', NULL, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(6, 6, 'Oki Pratama', '081234561106', 'Sentra Operasional Mandiri adalah dapur produksi makanan siap saji yang mencatat seluruh operasional toko: stok bahan baku, HPP produksi, pengeluaran kas, hingga piutang atas pesanan khusus.', 'Pesanan dikirim setiap hari sebelum jam 22:00 WIB. Packing rapi dengan bubble wrap.', 'Barang dapat dikembalikan maksimal 2 x 24 jam setelah diterima apabila rusak/keliru.', 'Senin s/d Minggu', '05:00:00', '22:00:00', 'https://wa.me/6281234561106', 'https://instagram.com/sentraoperasionalmandiri', 'https://tiktok.com/@sentraoperasionalmandiri', NULL, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
(7, 8, 'Mochammad Rachman Akbar Fahlevy', '079879878', NULL, 'opipoipoioipo', 'yuyiuyiuiu', 'Senin - Minggu', '02:12:00', '14:22:00', NULL, NULL, NULL, NULL, '2026-09-15 21:49:37', '2026-09-15 21:49:37');

-- --------------------------------------------------------

--
-- Table structure for table `sub_orders`
--

CREATE TABLE `sub_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `sub_order_number` varchar(100) NOT NULL,
  `total_items_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `shipping_cost` decimal(15,2) NOT NULL DEFAULT 0.00,
  `admin_fee` decimal(15,2) NOT NULL DEFAULT 0.00,
  `seller_net` decimal(15,2) NOT NULL DEFAULT 0.00,
  `courier` varchar(50) DEFAULT NULL,
  `service` varchar(100) DEFAULT NULL,
  `destination_id` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `tracking_number` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sub_orders`
--

INSERT INTO `sub_orders` (`id`, `order_id`, `store_id`, `sub_order_number`, `total_items_price`, `shipping_cost`, `admin_fee`, `seller_net`, `courier`, `service`, `destination_id`, `status`, `tracking_number`, `created_at`, `updated_at`) VALUES
(1, 1, 5, 'SUB-INV-10000', 92000.00, 11000.00, 2300.00, 91500.00, 'jnt', 'Reguler', 'KMB-1642', 'completed', 'KMR223410298', '2026-06-28 08:01:50', '2026-06-30 08:01:50'),
(2, 2, 3, 'SUB-INV-10001', 458000.00, 10000.00, 11450.00, 456550.00, 'sicepat', 'Reguler', 'KMB-4013', 'completed', 'KMR317724617', '2026-08-10 23:54:50', '2026-08-13 23:54:50'),
(3, 3, 3, 'SUB-INV-10002', 330000.00, 10000.00, 8250.00, 331750.00, 'sicepat', 'Reguler', 'KMB-1642', 'completed', 'KMR188746214', '2026-08-10 09:47:50', '2026-08-12 09:47:50'),
(4, 4, 6, 'SUB-INV-10003', 196000.00, 0.00, 4900.00, 191100.00, 'anteraja', 'Reguler', 'KMB-6511', 'completed', 'KMR257973059', '2026-08-28 12:51:50', '2026-08-28 12:51:50'),
(5, 5, 2, 'SUB-INV-10004', 318000.00, 15000.00, 7950.00, 325050.00, 'jnt', 'Reguler', 'KMB-1314', 'completed', 'KMR603863409', '2026-09-06 04:21:50', '2026-09-07 04:21:50'),
(6, 6, 5, 'SUB-INV-10005', 36000.00, 0.00, 900.00, 35100.00, 'jne', 'Reguler', 'KMB-1314', 'completed', 'KMR589509819', '2026-05-30 13:47:50', '2026-06-02 13:47:50'),
(7, 7, 2, 'SUB-INV-10006', 349000.00, 15000.00, 8725.00, 355275.00, 'jne', 'Reguler', 'KMB-1314', 'shipped', 'KMR862819150', '2026-09-02 12:38:50', '2026-09-03 12:38:50'),
(8, 8, 1, 'SUB-INV-10007', 90000.00, 12000.00, 2250.00, 99750.00, 'anteraja', 'Reguler', 'KMB-1642', 'completed', 'KMR428552190', '2026-08-04 11:34:50', '2026-08-04 11:34:50'),
(9, 9, 1, 'SUB-INV-10008', 109000.00, 12000.00, 2725.00, 118275.00, 'jnt', 'Reguler', 'KMB-1642', 'completed', 'KMR157905392', '2026-05-26 16:41:50', '2026-05-27 16:41:50'),
(10, 10, 3, 'SUB-INV-10009', 346000.00, 10000.00, 8650.00, 332350.00, 'jnt', 'Reguler', 'KMB-4013', 'completed', 'KMR486335454', '2026-06-13 14:34:50', '2026-06-16 14:34:50'),
(11, 11, 6, 'SUB-INV-10010', 90000.00, 14000.00, 2250.00, 101750.00, NULL, NULL, 'KMB-1612', 'pending', NULL, '2026-07-17 23:47:50', '2026-07-19 23:47:50'),
(12, 12, 5, 'SUB-INV-10011', 242000.00, 11000.00, 6050.00, 246950.00, 'anteraja', 'Reguler', 'KMB-1314', 'completed', 'KMR361916740', '2026-08-16 04:39:50', '2026-08-17 04:39:50'),
(13, 13, 2, 'SUB-INV-10012', 623000.00, 0.00, 15575.00, 607425.00, 'jne', 'Reguler', 'KMB-5013', 'completed', 'KMR874909431', '2026-07-08 05:29:50', '2026-07-10 05:29:50'),
(14, 14, 5, 'SUB-INV-10013', 32000.00, 11000.00, 800.00, 42200.00, 'anteraja', 'Reguler', 'KMB-1424', 'completed', 'KMR768744869', '2026-07-28 22:48:50', '2026-07-28 22:48:50'),
(15, 15, 2, 'SUB-INV-10014', 80000.00, 15000.00, 2000.00, 93000.00, 'jne', 'Reguler', 'KMB-5013', 'processing', NULL, '2026-08-12 01:45:50', '2026-08-12 01:45:50'),
(16, 16, 5, 'SUB-INV-10015', 168000.00, 11000.00, 4200.00, 174800.00, 'jnt', 'Reguler', 'KMB-4013', 'completed', 'KMR706086666', '2026-06-12 04:57:50', '2026-06-15 04:57:50'),
(17, 17, 5, 'SUB-INV-10016', 58000.00, 11000.00, 1450.00, 67550.00, 'jne', 'Reguler', 'KMB-1219', 'completed', 'KMR153005838', '2026-06-16 18:56:50', '2026-06-18 18:56:50'),
(18, 18, 4, 'SUB-INV-10017', 1335000.00, 13000.00, 33375.00, 1314625.00, 'jnt', 'Reguler', 'KMB-1642', 'completed', 'KMR465210432', '2026-06-12 13:01:50', '2026-06-14 13:01:50'),
(19, 19, 1, 'SUB-INV-10018', 30000.00, 12000.00, 750.00, 38250.00, 'anteraja', 'Reguler', 'KMB-4013', 'processing', NULL, '2026-08-06 12:45:50', '2026-09-21 20:17:27'),
(20, 20, 1, 'SUB-INV-10019', 126000.00, 12000.00, 3150.00, 134850.00, 'sicepat', 'Reguler', 'KMB-1642', 'processing', NULL, '2026-07-10 09:47:50', '2026-07-10 09:47:50'),
(21, 21, 5, 'SUB-INV-10020', 268000.00, 11000.00, 6700.00, 272300.00, 'jnt', 'Reguler', 'KMB-5528', 'completed', 'KMR636053061', '2026-06-16 18:13:50', '2026-06-17 18:13:50'),
(22, 22, 5, 'SUB-INV-10021', 108000.00, 11000.00, 2700.00, 116300.00, NULL, NULL, 'KMB-1424', 'pending', NULL, '2026-07-10 21:33:50', '2026-07-13 21:33:50'),
(23, 23, 5, 'SUB-INV-10022', 200000.00, 11000.00, 5000.00, 206000.00, 'jne', 'Reguler', 'KMB-1642', 'completed', 'KMR696990917', '2026-08-08 21:20:50', '2026-08-11 21:20:50'),
(24, 24, 6, 'SUB-INV-10023', 456000.00, 0.00, 11400.00, 444600.00, 'jnt', 'Reguler', 'KMB-6027', 'completed', 'KMR864050983', '2026-08-16 00:58:50', '2026-08-16 00:58:50'),
(25, 25, 5, 'SUB-INV-10024', 126000.00, 0.00, 3150.00, 122850.00, 'sicepat', 'Reguler', 'KMB-6027', 'completed', 'KMR509299853', '2026-09-03 14:44:50', '2026-09-03 14:44:50'),
(26, 26, 2, 'SUB-INV-10025', 1815000.00, 15000.00, 45375.00, 1784625.00, NULL, NULL, 'KMB-1219', 'cancelled', NULL, '2026-05-30 09:07:50', '2026-05-31 09:07:50'),
(27, 27, 1, 'SUB-INV-10026', 117000.00, 12000.00, 2925.00, 126075.00, 'anteraja', 'Reguler', 'KMB-5013', 'completed', 'KMR277507826', '2026-06-10 16:37:50', '2026-06-12 16:37:50'),
(28, 28, 3, 'SUB-INV-10027', 170000.00, 10000.00, 4250.00, 160750.00, 'jnt', 'Reguler', 'KMB-1642', 'completed', 'KMR542366828', '2026-07-25 10:05:50', '2026-07-28 10:05:50'),
(29, 29, 4, 'SUB-INV-10028', 495000.00, 13000.00, 12375.00, 495625.00, 'jnt', 'Reguler', 'KMB-6511', 'shipped', 'KMR640997130', '2026-08-20 15:28:50', '2026-08-21 15:28:50'),
(30, 30, 1, 'SUB-INV-10029', 208000.00, 12000.00, 5200.00, 214800.00, 'jne', 'Reguler', 'KMB-1642', 'completed', 'KMR309656828', '2026-05-21 04:03:50', '2026-05-23 04:03:50'),
(31, 31, 5, 'SUB-INV-10030', 36000.00, 0.00, 900.00, 35100.00, 'jne', 'Reguler', 'KMB-4013', 'completed', 'KMR622926010', '2026-08-26 06:25:51', '2026-08-27 06:25:51'),
(32, 32, 4, 'SUB-INV-10031', 855000.00, 13000.00, 21375.00, 846625.00, 'anteraja', 'Reguler', 'KMB-5013', 'completed', 'KMR879543909', '2026-06-18 02:30:51', '2026-06-18 02:30:51'),
(33, 33, 6, 'SUB-INV-10032', 66000.00, 14000.00, 1650.00, 78350.00, 'jnt', 'Reguler', 'KMB-4013', 'shipped', 'KMR451402606', '2026-08-01 02:28:51', '2026-08-02 02:28:51'),
(34, 34, 4, 'SUB-INV-10033', 855000.00, 13000.00, 21375.00, 846625.00, 'sicepat', 'Reguler', 'KMB-1219', 'completed', 'KMR130556186', '2026-08-29 22:48:51', '2026-09-01 22:48:51'),
(35, 35, 4, 'SUB-INV-10034', 65000.00, 13000.00, 1625.00, 76375.00, 'anteraja', 'Reguler', 'KMB-1314', 'completed', 'KMR973866301', '2026-08-31 20:10:51', '2026-09-02 20:10:51'),
(36, 36, 2, 'SUB-INV-10035', 1051000.00, 15000.00, 26275.00, 1039725.00, 'sicepat', 'Reguler', 'KMB-4013', 'completed', 'KMR564912790', '2026-06-23 23:52:51', '2026-06-26 23:52:51'),
(37, 37, 3, 'SUB-INV-10036', 202000.00, 10000.00, 5050.00, 191950.00, NULL, NULL, 'KMB-1642', 'cancelled', NULL, '2026-08-03 06:47:51', '2026-08-05 06:47:51'),
(38, 38, 6, 'SUB-INV-10037', 252000.00, 14000.00, 6300.00, 259700.00, 'jnt', 'Reguler', 'KMB-6511', 'completed', 'KMR955649381', '2026-07-07 23:04:51', '2026-07-07 23:04:51'),
(39, 39, 4, 'SUB-INV-10038', 725000.00, 13000.00, 18125.00, 719875.00, 'sicepat', 'Reguler', 'KMB-6027', 'shipped', 'KMR719638070', '2026-07-23 17:50:51', '2026-07-24 17:50:51'),
(40, 40, 4, 'SUB-INV-10039', 1775000.00, 13000.00, 44375.00, 1743625.00, NULL, NULL, 'KMB-1219', 'pending', NULL, '2026-08-23 05:40:51', '2026-08-23 05:40:51'),
(41, 41, 6, 'SUB-INV-10040', 66000.00, 0.00, 1650.00, 64350.00, 'sicepat', 'Reguler', 'KMB-5013', 'completed', 'KMR777906862', '2026-06-09 04:45:51', '2026-06-11 04:45:51'),
(42, 42, 1, 'SUB-INV-10041', 84000.00, 12000.00, 2100.00, 93900.00, NULL, NULL, 'KMB-6511', 'pending', NULL, '2026-07-04 00:06:51', '2026-07-05 00:06:51'),
(43, 43, 4, 'SUB-INV-10042', 555000.00, 13000.00, 13875.00, 554125.00, 'anteraja', 'Reguler', 'KMB-5013', 'completed', 'KMR800358367', '2026-07-12 22:08:51', '2026-07-12 22:08:51'),
(44, 44, 5, 'SUB-INV-10043', 88000.00, 11000.00, 2200.00, 96800.00, 'jnt', 'Reguler', 'KMB-5528', 'completed', 'KMR189582933', '2026-08-15 12:19:51', '2026-08-15 12:19:51'),
(45, 45, 3, 'SUB-INV-10044', 529000.00, 0.00, 13225.00, 515775.00, 'sicepat', 'Reguler', 'KMB-4013', 'processing', NULL, '2026-08-04 16:25:51', '2026-08-04 16:25:51'),
(46, 46, 5, 'SUB-INV-10045', 56000.00, 11000.00, 1400.00, 60000.00, 'jne', 'Reguler', 'KMB-1314', 'completed', 'KMR335419726', '2026-08-06 21:15:51', '2026-08-09 21:15:51'),
(47, 47, 6, 'SUB-INV-10046', 54000.00, 0.00, 1350.00, 52650.00, 'anteraja', 'Reguler', 'KMB-1219', 'completed', 'KMR291834754', '2026-08-16 12:40:51', '2026-08-17 12:40:51'),
(48, 48, 6, 'SUB-INV-10047', 180000.00, 14000.00, 4500.00, 189500.00, NULL, NULL, 'KMB-5528', 'pending', NULL, '2026-09-10 22:17:51', '2026-09-11 22:17:51'),
(49, 49, 1, 'SUB-INV-10048', 162000.00, 12000.00, 4050.00, 169950.00, 'jne', 'Reguler', 'KMB-4013', 'completed', 'KMR322054698', '2026-07-24 05:13:51', '2026-07-26 05:13:51'),
(50, 50, 1, 'SUB-INV-10049', 114000.00, 0.00, 2850.00, 111150.00, 'jnt', 'Reguler', 'KMB-1314', 'completed', 'KMR613171475', '2026-08-27 14:42:51', '2026-08-27 14:42:51'),
(51, 51, 3, 'SUB-INV-10050', 114000.00, 0.00, 2850.00, 111150.00, 'sicepat', 'Reguler', 'KMB-1219', 'processing', NULL, '2026-07-08 17:25:51', '2026-07-08 17:25:51'),
(52, 52, 4, 'SUB-INV-10051', 770000.00, 13000.00, 19250.00, 763750.00, 'sicepat', 'Reguler', 'KMB-6511', 'completed', 'KMR878074669', '2026-07-14 12:25:51', '2026-07-15 12:25:51'),
(53, 53, 2, 'SUB-INV-10052', 603000.00, 0.00, 15075.00, 587925.00, NULL, NULL, 'KMB-1314', 'cancelled', NULL, '2026-05-27 03:47:51', '2026-05-28 03:47:51'),
(54, 54, 1, 'SUB-INV-10053', 129000.00, 12000.00, 3225.00, 137775.00, 'jnt', 'Reguler', 'KMB-1314', 'completed', 'KMR515726605', '2026-08-26 23:15:52', '2026-09-21 20:17:27'),
(55, 55, 6, 'SUB-INV-10054', 66000.00, 14000.00, 1650.00, 71750.00, 'jnt', 'Reguler', 'KMB-1314', 'completed', 'KMR376254441', '2026-08-17 19:01:52', '2026-08-17 19:01:52'),
(56, 56, 6, 'SUB-INV-10055', 140000.00, 0.00, 3500.00, 136500.00, 'sicepat', 'Reguler', 'KMB-1642', 'completed', 'KMR787196296', '2026-07-18 16:41:52', '2026-07-20 16:41:52'),
(57, 57, 4, 'SUB-INV-10056', 570000.00, 13000.00, 14250.00, 568750.00, 'jnt', 'Reguler', 'KMB-6027', 'completed', 'KMR952096384', '2026-07-20 11:01:52', '2026-07-21 11:01:52'),
(58, 58, 6, 'SUB-INV-10057', 214000.00, 0.00, 5350.00, 208650.00, 'anteraja', 'Reguler', 'KMB-5013', 'completed', 'KMR120395756', '2026-06-03 16:34:52', '2026-06-06 16:34:52'),
(59, 59, 2, 'SUB-INV-10058', 135000.00, 15000.00, 3375.00, 146625.00, 'jne', 'REGULER', 'KMB-4013', 'completed', 'KMR418844202', '2026-09-10 12:38:52', '2026-09-21 19:19:51'),
(60, 60, 3, 'SUB-INV-10059', 310000.00, 0.00, 7750.00, 302250.00, 'anteraja', 'Reguler', 'KMB-1642', 'completed', 'KMR447653360', '2026-06-19 20:23:52', '2026-06-20 20:23:52'),
(61, 61, 5, 'SUB-INV-10060', 156000.00, 11000.00, 3900.00, 163100.00, 'jnt', 'Reguler', 'KMB-1424', 'completed', 'KMR843596674', '2026-06-14 16:07:52', '2026-06-14 16:07:52'),
(62, 62, 6, 'SUB-INV-10061', 200000.00, 0.00, 5000.00, 195000.00, NULL, NULL, 'KMB-6511', 'cancelled', NULL, '2026-06-18 10:47:52', '2026-06-18 10:47:52'),
(63, 63, 3, 'SUB-INV-10062', 164000.00, 0.00, 4100.00, 159900.00, 'jnt', 'Reguler', 'KMB-4013', 'completed', 'KMR976517600', '2026-07-11 17:11:52', '2026-07-11 17:11:52'),
(64, 64, 4, 'SUB-INV-10063', 450000.00, 13000.00, 11250.00, 436750.00, 'jnt', 'Reguler', 'KMB-1612', 'completed', 'KMR405125370', '2026-07-03 01:46:52', '2026-07-06 01:46:52'),
(65, 65, 3, 'SUB-INV-10064', 525000.00, 10000.00, 13125.00, 521875.00, 'jne', 'Reguler', 'KMB-4013', 'processing', NULL, '2026-08-03 03:05:52', '2026-08-06 03:05:52'),
(66, 66, 1, 'SUB-INV-10065', 99000.00, 12000.00, 2475.00, 108525.00, 'jne', 'Reguler', 'KMB-5013', 'completed', 'KMR404108124', '2026-07-23 10:30:52', '2026-07-26 10:30:52'),
(67, 67, 3, 'SUB-INV-10066', 529000.00, 10000.00, 13225.00, 525775.00, 'sicepat', 'Reguler', 'KMB-5013', 'completed', 'KMR666958421', '2026-06-20 02:16:52', '2026-06-23 02:16:52'),
(68, 68, 6, 'SUB-INV-10067', 66000.00, 0.00, 1650.00, 64350.00, 'anteraja', 'Reguler', 'KMB-1314', 'completed', 'KMR420459461', '2026-06-03 04:12:52', '2026-06-05 04:12:52'),
(69, 69, 1, 'SUB-INV-10068', 90000.00, 12000.00, 2250.00, 99750.00, 'anteraja', 'Reguler', 'KMB-6511', 'completed', 'KMR135512521', '2026-07-31 19:37:52', '2026-08-01 19:37:52'),
(70, 70, 4, 'SUB-INV-10069', 225000.00, 13000.00, 5625.00, 232375.00, 'anteraja', 'Reguler', 'KMB-6027', 'shipped', 'KMR682167087', '2026-06-20 14:00:52', '2026-06-20 14:00:52'),
(71, 71, 6, 'SUB-INV-10070', 354000.00, 14000.00, 8850.00, 359150.00, 'anteraja', 'Reguler', 'KMB-1314', 'completed', 'KMR413622109', '2026-08-15 18:38:52', '2026-08-17 18:38:52'),
(72, 72, 6, 'ORD-20260915075147-B9B96E-S6', 38000.00, 14000.00, 0.00, 0.00, 'haversine', 'HAVERSINE', '', 'pending', NULL, '2026-09-15 00:51:49', '2026-09-15 00:51:49'),
(86, 86, 2, 'MAN-20260922050115-B40A85-S2', 35000.00, 0.00, 0.00, 0.00, 'ambil_sendiri', NULL, 'MANUAL-2', 'processing', NULL, '2026-09-21 22:01:15', '2026-09-21 22:01:15');

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ticket_number` varchar(100) NOT NULL,
  `user_id` char(36) NOT NULL,
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `category` varchar(80) NOT NULL,
  `subject` varchar(180) NOT NULL,
  `description` text NOT NULL,
  `priority` varchar(30) NOT NULL DEFAULT 'normal',
  `status` varchar(30) NOT NULL DEFAULT 'open',
  `assigned_to` char(36) DEFAULT NULL,
  `last_replied_at` timestamp NULL DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `support_tickets`
--

INSERT INTO `support_tickets` (`id`, `ticket_number`, `user_id`, `store_id`, `order_id`, `category`, `subject`, `description`, `priority`, `status`, `assigned_to`, `last_replied_at`, `resolved_at`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'TCK-4000', '00000000-0000-4000-8000-000000000203', NULL, NULL, 'pengiriman', 'Pesanan belum sampai', 'Pesanan sudah 5 hari tapi belum kunjung sampai. Mohon dibantu cek resinya.', 'high', 'open', NULL, NULL, NULL, 1, '00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000203', '2026-06-11 15:59:56', '2026-06-11 15:59:56', NULL),
(2, 'TCK-4001', '00000000-0000-4000-8000-000000000204', 4, NULL, 'produk', 'Barang kurang satu item', 'Saya menerima pesanan tapi kurang 1 item untuk varian yang dipesan.', 'medium', 'resolved', '00000000-0000-4000-8000-000000000001', '2026-06-12 15:59:56', '2026-06-12 15:59:56', 1, '00000000-0000-4000-8000-000000000204', '00000000-0000-4000-8000-000000000204', '2026-06-11 15:59:56', '2026-06-11 15:59:56', NULL),
(3, 'TCK-4002', '00000000-0000-4000-8000-000000000206', NULL, NULL, 'pembayaran', 'Voucher tidak terpotong', 'Saat checkout voucher tidak terpotong otomatis.', 'low', 'open', NULL, NULL, NULL, 1, '00000000-0000-4000-8000-000000000206', '00000000-0000-4000-8000-000000000206', '2026-06-11 15:59:56', '2026-06-11 15:59:56', NULL),
(4, 'TCK-4003', '00000000-0000-4000-8000-000000000208', 4, NULL, 'pengembalian', 'Minta pengembalian dana', 'Produk rusak saat diterima, ingin ajukan pengembalian.', 'high', 'resolved', '00000000-0000-4000-8000-000000000001', '2026-06-12 15:59:56', '2026-06-12 15:59:56', 1, '00000000-0000-4000-8000-000000000208', '00000000-0000-4000-8000-000000000208', '2026-06-11 15:59:56', '2026-06-11 15:59:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `support_ticket_messages`
--

CREATE TABLE `support_ticket_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ticket_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `message` text NOT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `is_internal` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `firebase_uid` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `has_set_password` tinyint(1) NOT NULL DEFAULT 0,
  `name` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `banned_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firebase_uid`, `email`, `password`, `has_set_password`, `name`, `avatar`, `is_email_verified`, `is_active`, `banned_at`, `remember_token`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
('00000000-0000-4000-8000-000000000001', NULL, 'admin@marketku.id', '$2y$12$DHFMphEKyUnOrO5uP1eqau9LoL.yHTRed9cQxjRYbkk7Av1gMQLc6', 1, 'Bagas Administrator', 'https://picsum.photos/seed/459c7999f440244b163b38e375fededd/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000002', NULL, 'citra.admin@marketku.id', '$2y$12$iZY1hAajAhqkhLqtJ72do.nBzzQ9uqlrfRlOxeDYaGV9PBtWQEt2u', 1, 'Citra Kusuma', 'https://picsum.photos/seed/9953167bc50f9ede04b1d8ac88713627/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000101', NULL, 'sarinusantara@gmail.com', '$2y$12$tIJyR3XLq43Tp4RxQLdj9uk3H90/OJ0samIkeLoQS.MRFug2QPWWq', 1, 'Test Name', 'https://picsum.photos/seed/f43f0025dbb0d1c6c16d56d9038119b4/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 02:01:16', NULL),
('00000000-0000-4000-8000-000000000102', NULL, 'rakateknologi@gmail.com', '$2y$12$RmRBF9T8cRz0qd/gUvDl4O.y2vSb5aLjfhY5krVV2zv7l9/M2KYxS', 1, 'Raka Wibawa', 'https://picsum.photos/seed/e72c52e667f61af21f6c2a00b9894ba4/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000103', NULL, 'kopinusantara@gmail.com', '$2y$12$N1zxDs1UWupz3D6SrngptOF8yiOd4SU4ggZfNWEWdqJxYsoiOqBtC', 1, 'Bima Anggara', 'https://picsum.photos/seed/43c6f09cfc4a57e4e31ac611d372a17e/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000104', NULL, 'purnamabatik@gmail.com', '$2y$12$VFHa8gnZoyKnJEm2zSmgruCRTHpYjabyDvdawcD2bn4kWuZ8ohpum', 1, 'Laras Purnama', 'https://picsum.photos/seed/b738359371a1da02a0139a1d9f80a675/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000105', NULL, 'anandastationery@gmail.com', '$2y$12$/gD3laRI0vELdfgJ2YidjeIM8T6.YPLdfKF99WHLJh/iSs45iK9Vi', 1, 'Nanda Saputra', 'https://picsum.photos/seed/10d14e26d1ec3b86ea1d38d2ccc90ca3/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000106', NULL, 'sentraoperasional@gmail.com', '$2y$12$kO9O9FSktPOzcZFWe.eXoer73QrijjYX3Ix5FGGFJlrRw7LYKAr.O', 1, 'Oki Pratama', 'https://picsum.photos/seed/3086268e5a63d4fe923cb8e2ce35e0a6/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000201', NULL, 'angga.firmansyah@gmail.com', '$2y$12$BjCSX9YerxPOYaGZmjt/K.fCVf2gonJkjLDGwaJrA4EhpV5tWDPDy', 1, 'Angga Firmansyah', 'https://picsum.photos/seed/5be0959f9791cbfdc2919122818bdbac/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000202', NULL, 'dewi.lestari@gmail.com', '$2y$12$XWnDVjW3Vg.nwTTamZ/BneEMo3lYIGyaePG7dmhJ4HEvib3jlEt62', 1, 'Dewi Lestari', 'https://picsum.photos/seed/1810ccdd0aa58bf3497a797e7f88416c/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000203', NULL, 'rizky.ramadhan@gmail.com', '$2y$12$tES.QCIptwb/oBSKOyAKouLAfQCXxUHboMWylaBMmAPMR.e3TqWUK', 1, 'Rizky Ramadhan', 'https://picsum.photos/seed/d007b71faafb1b8f7387196951d379c4/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000204', NULL, 'putri.ayu@gmail.com', '$2y$12$YyT5axBK06C7CZvc/0GSlejtZcbeks9vqygNR52ljw928K0lisnk2', 1, 'Putri Ayu Anindya', 'https://picsum.photos/seed/634eb9489ee97f4df195bbeb73cbde12/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000205', NULL, 'fajar.nugraha@gmail.com', '$2y$12$W0IkVcwL6G1C2.rEDOY1COlt0s4o.Yjx6V7Z3o15YvxpeYObOPqeC', 1, 'Fajar Nugraha', 'https://picsum.photos/seed/12f0d1a3a9dbff03a12dae0f3a897d9b/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000206', NULL, 'salsa.nadia@gmail.com', '$2y$12$olSyOOcy3i4w4GfPEYGuc.ZSw.HwUYNNf9mTBypgCVkrIv5NlaKYe', 1, 'Salsa Nadia Putri', 'https://picsum.photos/seed/75d4b3b94ed804aac9cb09fdca99d568/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000207', NULL, 'dimas.aditya@gmail.com', '$2y$12$ClR/v/uylUMP84Yu9utG5eeJCJZ3aymeDCtGUiuOhkwNlAMzrL.P6', 1, 'Dimas Aditya', 'https://picsum.photos/seed/7440915d94a89e89c405b114f9be1d09/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000208', NULL, 'intan.permata@gmail.com', '$2y$12$GrY9wTw/orfto6LpKfhP6.E6aEw5jHFaZyJnW5bw6Ed8/jd/swABm', 1, 'Intan Permata', 'https://picsum.photos/seed/2f478c11b763f22d100d7b0f42aff59e/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000209', NULL, 'galih.prakoso@gmail.com', '$2y$12$GRtrfy5QFOmRzqdk1p5ebemYjWlAyKfd60YOfO/sxKzTRuX1woB8C', 1, 'Galih Prakoso', 'https://picsum.photos/seed/d072c48cfaef815f33684c106b7984cc/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('00000000-0000-4000-8000-000000000210', NULL, 'nadia.salsabila@gmail.com', '$2y$12$spLMATCmi2PO20Gq5TWcd.riA17vpQNHJtpt4RpmjWvmZxW.Z.w4y', 1, 'Nadia Salsabila', 'https://picsum.photos/seed/311cd4de43ad254b43c17f319c94be3f/160/160', 1, 1, NULL, NULL, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:39', '2026-09-14 00:59:39', NULL),
('1ae55236-f781-406a-baa7-62635f4c9545', 'tiBXPX4QSaerp0fKFR91dDGv7P12', 'akbarfahlevy39@gmail.com', '$2y$12$P9pAZkklWu41M3ujaBjY9.kc9Xe64fBNy4/08.WI.8kTQ8EjHHX6O', 1, 'Mochammad Rachman Akbar Fahlevy', 'https://lh3.googleusercontent.com/a/ACg8ocLwIcW9YpN2423z6G110ndWsC_stH2vC89ST117X1UV-w1l_Q=s96-c', 1, 1, NULL, NULL, NULL, '1ae55236-f781-406a-baa7-62635f4c9545', '2026-09-15 00:49:37', '2026-09-17 01:21:32', NULL),
('3341a4d5-d0a6-4409-a0d2-e3a0746109e6', NULL, 'spamtest7472@example.com', '$2y$12$gWgJR.wcz.zzSA/U6qcohu03cDsXAM.SOzSHYlGD/UlJeF8BkgY16', 1, 'Test Spam User', NULL, 0, 1, NULL, NULL, NULL, NULL, '2026-09-22 21:27:59', '2026-09-22 21:27:59', NULL),
('5fdd933b-35d8-41ca-b595-4c9ad3d40f3a', 'DSgH8VTfP4cK5zLqZfqSgb8OBpk1', 'mochammad.rachman112@smk.belajar.id', '$2y$12$IslrnGeJ/Pe/bljVP/Y6d.wOKR28dPwXmMXgR7Q33tPTY6qNi2Fey', 0, 'MOCHAMMAD RACHMAN AKBAR FAHLEVY', 'https://lh3.googleusercontent.com/a/ACg8ocJLY1Kbfb_Lx2IP6C-x_XtJeqwGuhx_JJHP8qSxrLzlmgtKxA=s96-c', 1, 1, NULL, NULL, NULL, NULL, '2026-10-18 18:14:33', '2026-10-18 18:14:33', NULL),
('ae1c058b-18cd-4050-ae5f-ae9d24d703d7', NULL, 'guest-2-gwrikwbvwmln@manual.order', NULL, 0, 'Pelanggan Umum', NULL, 0, 1, NULL, NULL, NULL, NULL, '2026-09-21 22:01:15', '2026-09-21 22:01:15', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` char(36) NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`, `created_at`, `updated_at`) VALUES
('00000000-0000-4000-8000-000000000001', 1, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000001', 2, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000002', 2, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000002', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000101', 3, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000101', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000102', 3, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000102', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000103', 3, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000103', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000104', 3, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000104', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000105', 3, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000105', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000106', 3, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000106', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000201', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000202', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000203', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000204', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000205', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000206', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000207', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000208', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000209', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000210', 4, '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('1ae55236-f781-406a-baa7-62635f4c9545', 3, '2026-09-15 21:49:37', '2026-09-15 21:49:37'),
('1ae55236-f781-406a-baa7-62635f4c9545', 4, '2026-09-17 01:41:49', '2026-09-17 01:41:49'),
('3341a4d5-d0a6-4409-a0d2-e3a0746109e6', 4, '2026-09-22 21:27:59', '2026-09-22 21:27:59'),
('5fdd933b-35d8-41ca-b595-4c9ad3d40f3a', 4, '2026-10-18 18:14:33', '2026-10-18 18:14:33'),
('ae1c058b-18cd-4050-ae5f-ae9d24d703d7', 4, '2026-09-21 22:01:15', '2026-09-21 22:01:15');

-- --------------------------------------------------------

--
-- Table structure for table `user_vouchers`
--

CREATE TABLE `user_vouchers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `voucher_id` bigint(20) UNSIGNED NOT NULL,
  `source_type` varchar(80) DEFAULT NULL,
  `source_id` varchar(100) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'available',
  `claimed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_vouchers`
--

INSERT INTO `user_vouchers` (`id`, `user_id`, `voucher_id`, `source_type`, `source_id`, `status`, `claimed_at`, `used_at`, `created_at`, `updated_at`) VALUES
(1, '00000000-0000-4000-8000-000000000202', 1, 'claim', 'demo-claim-1', 'available', '2026-09-06 00:59:45', NULL, '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(2, '00000000-0000-4000-8000-000000000203', 2, 'referral', 'demo-referral-1', 'available', '2026-09-06 00:59:45', NULL, '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(3, '00000000-0000-4000-8000-000000000204', 3, 'claim', 'demo-claim-1', 'available', '2026-09-05 00:59:45', NULL, '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(4, '00000000-0000-4000-8000-000000000205', 4, 'membership', 'demo-membership-1', 'available', '2026-09-11 00:59:45', NULL, '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(5, '00000000-0000-4000-8000-000000000206', 5, 'claim', 'demo-claim-1', 'available', '2026-09-02 00:59:45', NULL, '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(6, '00000000-0000-4000-8000-000000000207', 6, 'claim', 'demo-claim-1', 'available', '2026-08-31 00:59:45', NULL, '2026-09-14 00:59:44', '2026-09-14 00:59:44'),
(7, '00000000-0000-4000-8000-000000000208', 1, 'claim', 'demo-claim-1', 'available', '2026-09-05 00:59:45', NULL, '2026-09-14 00:59:44', '2026-09-14 00:59:44');

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `voucher_scope` enum('platform','store') NOT NULL DEFAULT 'platform',
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `discount_target` enum('product','shipping') NOT NULL DEFAULT 'product',
  `discount_type` enum('fixed','percentage') NOT NULL,
  `discount_value` decimal(15,2) NOT NULL,
  `min_spend` decimal(15,2) NOT NULL DEFAULT 0.00,
  `min_items` int(10) UNSIGNED DEFAULT NULL,
  `min_distinct_products` int(10) UNSIGNED DEFAULT NULL,
  `terms` text DEFAULT NULL,
  `max_discount` decimal(15,2) DEFAULT NULL,
  `starts_at` timestamp NOT NULL,
  `ends_at` timestamp NOT NULL,
  `usage_limit` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `used_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ;

--
-- Dumping data for table `vouchers`
--

INSERT INTO `vouchers` (`id`, `store_id`, `voucher_scope`, `code`, `name`, `image`, `discount_target`, `discount_type`, `discount_value`, `min_spend`, `min_items`, `min_distinct_products`, `terms`, `max_discount`, `starts_at`, `ends_at`, `usage_limit`, `used_count`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, 'platform', 'WELCOME20', 'Voucher Baru Bergabung 20%', 'https://picsum.photos/seed/voucher-welcome20/400/240', 'product', 'percentage', 20.00, 50000.00, 1, 1, 'Berlaku untuk produk tertentu, maksimal diskon Rp20,000.', 20000.00, '2026-07-16 00:59:44', '2026-11-13 00:59:44', 100, 0, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(2, NULL, 'platform', 'HEMAT5RB', 'Potongan Rp5.000 s/d 30 Juni', 'https://picsum.photos/seed/voucher-hemat5rb/400/240', 'product', 'fixed', 5000.00, 25000.00, 1, 1, 'Potongan langsung, minimal belanja Rp25,000.', NULL, '2026-07-16 00:59:44', '2026-11-13 00:59:44', 200, 0, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(3, NULL, 'platform', 'GRATISONGKIR', 'Gratis Ongkir 10km pertama', 'https://picsum.photos/seed/voucher-gratisongkir/400/240', 'shipping', 'percentage', 100.00, 75000.00, 1, 1, 'Berlaku untuk produk tertentu, maksimal diskon Rp15,000.', 15000.00, '2026-07-16 00:59:44', '2026-11-13 00:59:44', 150, 0, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(4, NULL, 'platform', 'SETIA10', 'Diskon 10% untuk member setia', 'https://picsum.photos/seed/voucher-setia10/400/240', 'product', 'percentage', 10.00, 100000.00, 1, 1, 'Berlaku untuk produk tertentu, maksimal diskon Rp30,000.', 30000.00, '2026-07-16 00:59:45', '2026-11-13 00:59:45', 100, 0, 1, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(5, 1, 'store', 'SARINUS12', 'Diskon 12% Toko Sari Nusantara', 'https://picsum.photos/seed/voucher-sarinus12/400/240', 'product', 'percentage', 12.00, 40000.00, 1, 1, 'Berlaku untuk produk tertentu, maksimal diskon Rp15,000.', 15000.00, '2026-07-16 00:59:45', '2026-11-13 00:59:45', 50, 0, 1, '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(6, 3, 'store', 'KOPIPAGI', 'Diskon 8% Rumah Kopi Nusantara', 'https://picsum.photos/seed/voucher-kopipagi/400/240', 'product', 'percentage', 8.00, 30000.00, 1, 1, 'Berlaku untuk produk tertentu, maksimal diskon Rp10,000.', 10000.00, '2026-07-16 00:59:45', '2026-11-13 00:59:45', 50, 0, 1, '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', '2026-09-14 00:59:44', '2026-09-14 00:59:44', NULL),
(7, 2, 'store', '890okokgusss', 'ba', 'vouchers/nVgU7IJ4HpJDRSOzqDBaFkbQ3mMaDqL4F7H0mZfi.jpg', 'shipping', 'percentage', 30.00, 0.00, 90, 3, 'uiouoiuoiuoiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', 80989.00, '2026-09-19 01:45:00', '2026-09-26 01:45:00', 3, 0, 1, '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', '2026-09-18 18:47:06', '2026-09-18 18:47:41', NULL),
(8, 1, 'store', 'gmbrtest51599', 'Voucher Test Gambar', 'vouchers/EaT7i5ZYIjbambK5Z0ymjkcUHG0fXEviud7xVsTa.png', 'product', 'percentage', 10.00, 10000.00, 1, NULL, NULL, NULL, '2026-09-01 00:59:45', '2026-12-01 00:59:45', 100, 0, 1, '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000101', '2026-09-18 19:14:11', '2026-09-18 19:14:11', NULL),
(9, 2, 'store', '2345ygfd', '34txaccdcd', 'vouchers/z3wqTvC9jTACFaNDQ9C8QN7onG4OhSizCl0jpsyL.png', 'product', 'fixed', 12222.00, 22.00, 0, 2222, '222', 214.00, '2026-09-19 05:40:00', '2026-09-26 05:40:00', 0, 0, 0, '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', '2026-09-18 22:41:25', '2026-09-21 02:14:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT 'utama',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `name`, `created_at`, `updated_at`) VALUES
('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000201', 'utama', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000202', 'utama', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000203', 'utama', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000204', '00000000-0000-4000-8000-000000000204', 'utama', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000205', 'utama', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000206', '00000000-0000-4000-8000-000000000206', 'utama', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000207', '00000000-0000-4000-8000-000000000207', 'utama', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000208', '00000000-0000-4000-8000-000000000208', 'utama', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000209', '00000000-0000-4000-8000-000000000209', 'utama', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('00000000-0000-4000-8000-000000000210', '00000000-0000-4000-8000-000000000210', 'utama', '2026-09-14 00:59:39', '2026-09-14 00:59:39'),
('a1fec70e-5468-4e82-9f3e-4665ff7a6123', '1ae55236-f781-406a-baa7-62635f4c9545', 'Utama', '2026-09-15 00:50:13', '2026-09-15 00:50:13');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_items`
--

CREATE TABLE `wishlist_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `wishlist_id` char(36) NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlist_items`
--

INSERT INTO `wishlist_items` (`id`, `wishlist_id`, `product_id`, `added_at`) VALUES
(1, '00000000-0000-4000-8000-000000000201', 2, '2026-08-21 00:59:55'),
(2, '00000000-0000-4000-8000-000000000201', 10, '2026-08-31 00:59:55'),
(3, '00000000-0000-4000-8000-000000000201', 12, '2026-08-27 00:59:55'),
(4, '00000000-0000-4000-8000-000000000201', 18, '2026-08-16 00:59:55'),
(5, '00000000-0000-4000-8000-000000000201', 39, '2026-08-25 00:59:55'),
(6, '00000000-0000-4000-8000-000000000202', 2, '2026-08-16 00:59:55'),
(7, '00000000-0000-4000-8000-000000000202', 6, '2026-09-12 00:59:55'),
(8, '00000000-0000-4000-8000-000000000202', 10, '2026-09-13 00:59:55'),
(9, '00000000-0000-4000-8000-000000000202', 28, '2026-09-10 00:59:55'),
(10, '00000000-0000-4000-8000-000000000202', 39, '2026-08-22 00:59:55'),
(11, '00000000-0000-4000-8000-000000000203', 1, '2026-08-19 00:59:56'),
(12, '00000000-0000-4000-8000-000000000203', 2, '2026-09-10 00:59:56'),
(13, '00000000-0000-4000-8000-000000000203', 3, '2026-08-26 00:59:56'),
(14, '00000000-0000-4000-8000-000000000203', 13, '2026-08-21 00:59:56'),
(15, '00000000-0000-4000-8000-000000000203', 41, '2026-08-16 00:59:56'),
(16, '00000000-0000-4000-8000-000000000204', 3, '2026-09-13 00:59:56'),
(17, '00000000-0000-4000-8000-000000000204', 4, '2026-08-18 00:59:56'),
(18, '00000000-0000-4000-8000-000000000204', 23, '2026-09-07 00:59:56'),
(19, '00000000-0000-4000-8000-000000000204', 26, '2026-09-08 00:59:56'),
(20, '00000000-0000-4000-8000-000000000204', 34, '2026-09-06 00:59:56'),
(21, '00000000-0000-4000-8000-000000000205', 2, '2026-08-17 00:59:56'),
(22, '00000000-0000-4000-8000-000000000205', 3, '2026-09-13 00:59:56'),
(23, '00000000-0000-4000-8000-000000000205', 13, '2026-08-27 00:59:56'),
(24, '00000000-0000-4000-8000-000000000205', 38, '2026-09-12 00:59:56'),
(25, '00000000-0000-4000-8000-000000000205', 39, '2026-09-04 00:59:56'),
(26, '00000000-0000-4000-8000-000000000206', 4, '2026-08-29 00:59:56'),
(27, '00000000-0000-4000-8000-000000000206', 9, '2026-08-29 00:59:56'),
(28, '00000000-0000-4000-8000-000000000206', 35, '2026-08-16 00:59:56'),
(29, '00000000-0000-4000-8000-000000000206', 37, '2026-09-01 00:59:56'),
(30, '00000000-0000-4000-8000-000000000206', 41, '2026-08-17 00:59:56'),
(31, '00000000-0000-4000-8000-000000000207', 10, '2026-08-20 00:59:56'),
(32, '00000000-0000-4000-8000-000000000207', 26, '2026-08-21 00:59:56'),
(33, '00000000-0000-4000-8000-000000000207', 35, '2026-08-16 00:59:56'),
(34, '00000000-0000-4000-8000-000000000207', 38, '2026-08-30 00:59:56'),
(35, '00000000-0000-4000-8000-000000000207', 41, '2026-09-02 00:59:56'),
(36, '00000000-0000-4000-8000-000000000208', 2, '2026-08-20 00:59:56'),
(37, '00000000-0000-4000-8000-000000000208', 18, '2026-09-01 00:59:56'),
(38, '00000000-0000-4000-8000-000000000208', 24, '2026-09-07 00:59:56'),
(39, '00000000-0000-4000-8000-000000000208', 29, '2026-08-20 00:59:56'),
(40, '00000000-0000-4000-8000-000000000208', 38, '2026-08-15 00:59:56'),
(41, '00000000-0000-4000-8000-000000000209', 4, '2026-08-16 00:59:56'),
(42, '00000000-0000-4000-8000-000000000209', 23, '2026-08-18 00:59:56'),
(43, '00000000-0000-4000-8000-000000000209', 26, '2026-08-21 00:59:56'),
(44, '00000000-0000-4000-8000-000000000209', 27, '2026-08-30 00:59:56'),
(45, '00000000-0000-4000-8000-000000000209', 39, '2026-09-07 00:59:56'),
(46, '00000000-0000-4000-8000-000000000210', 1, '2026-08-19 00:59:56'),
(47, '00000000-0000-4000-8000-000000000210', 25, '2026-09-10 00:59:56'),
(48, '00000000-0000-4000-8000-000000000210', 28, '2026-09-13 00:59:56'),
(49, '00000000-0000-4000-8000-000000000210', 29, '2026-09-12 00:59:56'),
(50, '00000000-0000-4000-8000-000000000210', 42, '2026-08-18 00:59:56'),
(51, 'a1fec70e-5468-4e82-9f3e-4665ff7a6123', 43, '2026-09-15 00:50:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `addresses_store_id_unique` (`store_id`),
  ADD KEY `addresses_user_id_is_primary_index` (`user_id`,`is_primary`),
  ADD KEY `addresses_komerce_destination_id_index` (`komerce_destination_id`),
  ADD KEY `addresses_is_primary_index` (`is_primary`);

--
-- Indexes for table `admin_fee_configs`
--
ALTER TABLE `admin_fee_configs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_fee_configs_code_unique` (`code`),
  ADD KEY `admin_fee_configs_created_by_foreign` (`created_by`),
  ADD KEY `admin_fee_configs_updated_by_foreign` (`updated_by`),
  ADD KEY `admin_fee_configs_category_active_index` (`category_id`,`is_active`),
  ADD KEY `admin_fee_configs_is_active_index` (`is_active`),
  ADD KEY `admin_fee_configs_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_notifications_actor_id_foreign` (`actor_id`),
  ADD KEY `admin_notifications_store_id_foreign` (`store_id`),
  ADD KEY `admin_notifications_user_unread_index` (`user_id`,`read_at`,`created_at`),
  ADD KEY `admin_notifications_module_unread_index` (`user_id`,`module`,`read_at`),
  ADD KEY `admin_notifications_reference_index` (`reference_type`,`reference_id`),
  ADD KEY `admin_notifications_module_index` (`module`),
  ADD KEY `admin_notifications_type_index` (`type`),
  ADD KEY `admin_notifications_read_at_index` (`read_at`),
  ADD KEY `admin_notifications_is_active_index` (`is_active`),
  ADD KEY `admin_notifications_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `banners_store_name_unique` (`store_id`,`name`),
  ADD KEY `banners_created_by_foreign` (`created_by`),
  ADD KEY `banners_updated_by_foreign` (`updated_by`),
  ADD KEY `banners_public_index` (`store_id`,`is_active`,`sort_order`,`deleted_at`),
  ADD KEY `banners_is_active_index` (`is_active`),
  ADD KEY `banners_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `carts_user_id_unique` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cart_items_cart_id_product_variant_id_unique` (`cart_id`,`product_variant_id`),
  ADD KEY `cart_items_product_variant_id_foreign` (`product_variant_id`);

--
-- Indexes for table `catalog_groups`
--
ALTER TABLE `catalog_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `catalog_groups_name_unique` (`name`),
  ADD UNIQUE KEY `catalog_groups_slug_unique` (`slug`),
  ADD KEY `catalog_groups_created_by_foreign` (`created_by`),
  ADD KEY `catalog_groups_updated_by_foreign` (`updated_by`),
  ADD KEY `catalog_groups_status_index` (`is_active`,`deleted_at`),
  ADD KEY `catalog_groups_is_active_index` (`is_active`),
  ADD KEY `catalog_groups_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_parent_name_unique` (`catalog_group_id`,`parent_scope_id`,`name`),
  ADD UNIQUE KEY `categories_full_slug_unique` (`full_slug`),
  ADD KEY `categories_parent_id_foreign` (`parent_id`),
  ADD KEY `categories_created_by_foreign` (`created_by`),
  ADD KEY `categories_updated_by_foreign` (`updated_by`),
  ADD KEY `categories_catalog_group_id_parent_id_sort_order_index` (`catalog_group_id`,`parent_id`,`sort_order`),
  ADD KEY `categories_menu_status_index` (`is_active`,`is_visible_in_menu`,`deleted_at`),
  ADD KEY `categories_is_active_index` (`is_active`),
  ADD KEY `categories_is_visible_in_menu_index` (`is_visible_in_menu`),
  ADD KEY `categories_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_messages_sender_id_foreign` (`sender_id`),
  ADD KEY `chat_messages_conversation_index` (`conversation_id`,`created_at`),
  ADD KEY `chat_messages_message_type_index` (`message_type`),
  ADD KEY `chat_messages_edited_at_index` (`edited_at`),
  ADD KEY `chat_messages_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `chat_message_reads`
--
ALTER TABLE `chat_message_reads`
  ADD PRIMARY KEY (`message_id`,`user_id`),
  ADD KEY `chat_message_reads_user_index` (`user_id`,`read_at`);

--
-- Indexes for table `code_patterns`
--
ALTER TABLE `code_patterns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `code_patterns_store_id_foreign` (`store_id`),
  ADD KEY `code_patterns_type_store_id_index` (`type`,`store_id`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversations_order_id_foreign` (`order_id`),
  ADD KEY `conversations_created_by_foreign` (`created_by`),
  ADD KEY `conversations_updated_by_foreign` (`updated_by`),
  ADD KEY `conversations_context_index` (`store_id`,`order_id`,`type`),
  ADD KEY `conversations_type_index` (`type`),
  ADD KEY `conversations_target_role_index` (`target_role`),
  ADD KEY `conversations_is_active_index` (`is_active`),
  ADD KEY `conversations_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD PRIMARY KEY (`conversation_id`,`user_id`),
  ADD KEY `conversation_participants_user_index` (`user_id`,`left_at`),
  ADD KEY `conversation_participants_last_read_at_index` (`last_read_at`),
  ADD KEY `conversation_participants_left_at_index` (`left_at`),
  ADD KEY `conversation_participants_is_muted_index` (`is_muted`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `financial_payment_histories`
--
ALTER TABLE `financial_payment_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `financial_payment_histories_store_id_foreign` (`store_id`),
  ADD KEY `fph_txn_paid_index` (`financial_transaction_id`,`paid_at`),
  ADD KEY `financial_payment_histories_recorded_by_index` (`recorded_by`),
  ADD KEY `financial_payment_histories_reference_number_index` (`reference_number`);

--
-- Indexes for table `financial_transactions`
--
ALTER TABLE `financial_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `financial_transactions_reference_number_unique` (`reference_number`),
  ADD KEY `financial_transactions_order_id_foreign` (`order_id`),
  ADD KEY `financial_transactions_user_id_foreign` (`user_id`),
  ADD KEY `financial_transactions_created_by_foreign` (`created_by`),
  ADD KEY `financial_transactions_updated_by_foreign` (`updated_by`),
  ADD KEY `financial_transactions_scope_index` (`store_id`,`type`,`status`,`occurred_at`),
  ADD KEY `financial_transactions_type_index` (`type`),
  ADD KEY `financial_transactions_status_index` (`status`),
  ADD KEY `financial_transactions_due_date_index` (`due_date`),
  ADD KEY `financial_transactions_occurred_at_index` (`occurred_at`),
  ADD KEY `financial_transactions_settled_at_index` (`settled_at`),
  ADD KEY `financial_transactions_is_active_index` (`is_active`),
  ADD KEY `financial_transactions_deleted_at_index` (`deleted_at`),
  ADD KEY `financial_transactions_report_index` (`store_id`,`type`,`status`,`occurred_at`),
  ADD KEY `financial_transactions_aging_index` (`store_id`,`type`,`due_date`,`status`);

--
-- Indexes for table `game_contents`
--
ALTER TABLE `game_contents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_contents_created_by_foreign` (`created_by`),
  ADD KEY `game_contents_updated_by_foreign` (`updated_by`),
  ADD KEY `game_contents_game_type_active_index` (`game_type`,`is_active`,`difficulty`),
  ADD KEY `game_contents_game_type_index` (`game_type`),
  ADD KEY `game_contents_difficulty_index` (`difficulty`),
  ADD KEY `game_contents_is_active_index` (`is_active`),
  ADD KEY `game_contents_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `game_sessions`
--
ALTER TABLE `game_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `game_sessions_user_type_session_unique` (`user_id`,`game_type`,`session_id`),
  ADD KEY `game_sessions_created_by_foreign` (`created_by`),
  ADD KEY `game_sessions_updated_by_foreign` (`updated_by`),
  ADD KEY `game_sessions_user_type_created_index` (`user_id`,`game_type`,`created_at`),
  ADD KEY `game_sessions_game_type_index` (`game_type`),
  ADD KEY `game_sessions_difficulty_index` (`difficulty`),
  ADD KEY `game_sessions_validation_status_index` (`validation_status`),
  ADD KEY `game_sessions_is_active_index` (`is_active`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `missions`
--
ALTER TABLE `missions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `missions_code_unique` (`code`),
  ADD KEY `missions_voucher_id_foreign` (`voucher_id`),
  ADD KEY `missions_created_by_foreign` (`created_by`),
  ADD KEY `missions_updated_by_foreign` (`updated_by`),
  ADD KEY `missions_active_event_index` (`event_type`,`is_active`,`starts_at`,`ends_at`),
  ADD KEY `missions_event_type_index` (`event_type`),
  ADD KEY `missions_starts_at_index` (`starts_at`),
  ADD KEY `missions_ends_at_index` (`ends_at`),
  ADD KEY `missions_is_active_index` (`is_active`),
  ADD KEY `missions_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `mission_user_progress`
--
ALTER TABLE `mission_user_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mission_user_progress_unique` (`mission_id`,`user_id`),
  ADD KEY `mission_user_progress_reward_voucher_id_foreign` (`reward_voucher_id`),
  ADD KEY `mission_user_progress_user_index` (`user_id`,`status`),
  ADD KEY `mission_user_progress_status_index` (`status`),
  ADD KEY `mission_user_progress_completed_at_index` (`completed_at`),
  ADD KEY `mission_user_progress_rewarded_at_index` (`rewarded_at`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_number_unique` (`order_number`),
  ADD KEY `orders_voucher_id_foreign` (`voucher_id`),
  ADD KEY `orders_user_id_created_at_index` (`user_id`,`created_at`),
  ADD KEY `orders_status_index` (`status`),
  ADD KEY `orders_payment_status_index` (`payment_status`),
  ADD KEY `orders_order_type_index` (`order_type`),
  ADD KEY `orders_preorder_release_at_index` (`preorder_release_at`),
  ADD KEY `orders_received_at_index` (`received_at`),
  ADD KEY `orders_user_status_created_index` (`user_id`,`status`,`created_at`),
  ADD KEY `orders_payment_status_created_index` (`payment_status`,`created_at`),
  ADD KEY `orders_scheduled_at_index` (`scheduled_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_sub_order_id_foreign` (`sub_order_id`),
  ADD KEY `order_items_variant_id_foreign` (`variant_id`),
  ADD KEY `order_items_product_created_index` (`product_id`,`created_at`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_transaction_id_unique` (`transaction_id`),
  ADD KEY `payments_order_number_foreign` (`order_number`),
  ADD KEY `payments_status_index` (`status`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_unique` (`name`),
  ADD KEY `permissions_is_active_index` (`is_active`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `ppob_finance_entries`
--
ALTER TABLE `ppob_finance_entries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ppob_finance_entries_unique` (`source_type`,`source_id`,`transaction_type`),
  ADD KEY `ppob_finance_entries_ppob_transaction_id_foreign` (`ppob_transaction_id`),
  ADD KEY `ppob_finance_entries_created_by_foreign` (`created_by`),
  ADD KEY `ppob_finance_entries_updated_by_foreign` (`updated_by`),
  ADD KEY `ppob_finance_entries_source_index` (`source_type`,`source_id`),
  ADD KEY `ppob_finance_entries_source_type_index` (`source_type`),
  ADD KEY `ppob_finance_entries_reference_id_index` (`reference_id`),
  ADD KEY `ppob_finance_entries_transaction_type_index` (`transaction_type`),
  ADD KEY `ppob_finance_entries_status_index` (`status`),
  ADD KEY `ppob_finance_entries_occurred_at_index` (`occurred_at`),
  ADD KEY `ppob_finance_entries_is_active_index` (`is_active`),
  ADD KEY `ppob_finance_entries_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `ppob_inquiries`
--
ALTER TABLE `ppob_inquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ppob_inquiries_operator_id_foreign` (`operator_id`),
  ADD KEY `ppob_inquiries_user_status_index` (`user_id`,`status`),
  ADD KEY `ppob_inquiries_reference_id_index` (`reference_id`),
  ADD KEY `ppob_inquiries_category_index` (`category`),
  ADD KEY `ppob_inquiries_customer_id_index` (`customer_id`),
  ADD KEY `ppob_inquiries_tr_id_index` (`tr_id`),
  ADD KEY `ppob_inquiries_status_index` (`status`),
  ADD KEY `ppob_inquiries_expires_at_index` (`expires_at`),
  ADD KEY `ppob_inquiries_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `ppob_operators`
--
ALTER TABLE `ppob_operators`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ppob_operators_slug_unique` (`slug`),
  ADD KEY `ppob_operators_created_by_foreign` (`created_by`),
  ADD KEY `ppob_operators_updated_by_foreign` (`updated_by`),
  ADD KEY `ppob_operators_category_active_index` (`category`,`is_active`),
  ADD KEY `ppob_operators_category_index` (`category`),
  ADD KEY `ppob_operators_is_active_index` (`is_active`),
  ADD KEY `ppob_operators_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `ppob_pricing_rules`
--
ALTER TABLE `ppob_pricing_rules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ppob_pricing_rules_operator_id_foreign` (`operator_id`),
  ADD KEY `ppob_pricing_rules_product_id_foreign` (`product_id`),
  ADD KEY `ppob_pricing_rules_created_by_foreign` (`created_by`),
  ADD KEY `ppob_pricing_rules_updated_by_foreign` (`updated_by`),
  ADD KEY `ppob_pricing_rules_lookup_index` (`level`,`is_active`,`priority`),
  ADD KEY `ppob_pricing_rules_level_index` (`level`),
  ADD KEY `ppob_pricing_rules_category_index` (`category`),
  ADD KEY `ppob_pricing_rules_priority_index` (`priority`),
  ADD KEY `ppob_pricing_rules_is_active_index` (`is_active`),
  ADD KEY `ppob_pricing_rules_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `ppob_products`
--
ALTER TABLE `ppob_products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ppob_products_provider_product_code_unique` (`provider_product_code`),
  ADD KEY `ppob_products_created_by_foreign` (`created_by`),
  ADD KEY `ppob_products_updated_by_foreign` (`updated_by`),
  ADD KEY `ppob_products_category_status_index` (`category`,`status`,`is_available`),
  ADD KEY `ppob_products_operator_category_index` (`operator_id`,`category`),
  ADD KEY `ppob_products_category_index` (`category`),
  ADD KEY `ppob_products_product_type_index` (`product_type`),
  ADD KEY `ppob_products_margin_index` (`margin`),
  ADD KEY `ppob_products_selling_price_index` (`selling_price`),
  ADD KEY `ppob_products_status_index` (`status`),
  ADD KEY `ppob_products_is_available_index` (`is_available`),
  ADD KEY `ppob_products_is_active_index` (`is_active`),
  ADD KEY `ppob_products_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `ppob_transactions`
--
ALTER TABLE `ppob_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ppob_transactions_reference_id_unique` (`reference_id`),
  ADD KEY `ppob_transactions_operator_id_foreign` (`operator_id`),
  ADD KEY `ppob_transactions_created_by_foreign` (`created_by`),
  ADD KEY `ppob_transactions_updated_by_foreign` (`updated_by`),
  ADD KEY `ppob_transactions_user_status_index` (`user_id`,`status`,`created_at`),
  ADD KEY `ppob_transactions_product_created_index` (`product_id`,`created_at`),
  ADD KEY `ppob_transactions_status_created_index` (`status`,`created_at`),
  ADD KEY `ppob_transactions_category_index` (`category`),
  ADD KEY `ppob_transactions_status_index` (`status`),
  ADD KEY `ppob_transactions_tr_id_index` (`tr_id`),
  ADD KEY `ppob_transactions_paid_at_index` (`paid_at`),
  ADD KEY `ppob_transactions_completed_at_index` (`completed_at`),
  ADD KEY `ppob_transactions_is_active_index` (`is_active`),
  ADD KEY `ppob_transactions_deleted_at_index` (`deleted_at`),
  ADD KEY `ppob_transactions_payment_status_index` (`payment_status`);

--
-- Indexes for table `ppob_transaction_logs`
--
ALTER TABLE `ppob_transaction_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ppob_transaction_logs_tx_action_index` (`ppob_transaction_id`,`action`),
  ADD KEY `ppob_transaction_logs_reference_id_index` (`reference_id`),
  ADD KEY `ppob_transaction_logs_action_index` (`action`),
  ADD KEY `ppob_transaction_logs_direction_index` (`direction`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_store_name_unique` (`store_id`,`name`),
  ADD UNIQUE KEY `products_slug_unique` (`slug`),
  ADD KEY `products_created_by_foreign` (`created_by`),
  ADD KEY `products_updated_by_foreign` (`updated_by`),
  ADD KEY `products_public_feed_index` (`store_id`,`status`,`is_active`,`deleted_at`),
  ADD KEY `products_category_status_index` (`primary_category_id`,`status`,`is_active`),
  ADD KEY `products_brand_index` (`brand`),
  ADD KEY `products_status_index` (`status`),
  ADD KEY `products_is_active_index` (`is_active`),
  ADD KEY `products_deleted_at_index` (`deleted_at`),
  ADD KEY `products_public_feed_idx` (`status`,`is_active`,`created_at`,`id`),
  ADD KEY `products_store_feed_idx` (`store_id`,`status`,`is_active`,`created_at`,`id`),
  ADD KEY `products_category_feed_idx` (`primary_category_id`,`status`,`is_active`,`created_at`,`id`),
  ADD KEY `products_admin_name_sort_idx` (`name`,`id`),
  ADD KEY `products_seller_name_sort_idx` (`store_id`,`name`,`id`),
  ADD KEY `products_seller_active_idx` (`store_id`,`is_active`,`id`),
  ADD KEY `products_seller_status_idx` (`store_id`,`status`,`id`),
  ADD KEY `products_store_active_index` (`store_id`,`is_active`,`deleted_at`);

--
-- Indexes for table `product_attributes`
--
ALTER TABLE `product_attributes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_attributes_name_unique` (`name`),
  ADD UNIQUE KEY `product_attributes_slug_unique` (`slug`);

--
-- Indexes for table `product_attribute_values`
--
ALTER TABLE `product_attribute_values`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_attribute_values_product_id_attribute_id_unique` (`product_id`,`attribute_id`),
  ADD KEY `product_attribute_values_attribute_id_foreign` (`attribute_id`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`product_id`,`category_id`),
  ADD KEY `product_categories_category_id_product_id_index` (`category_id`,`product_id`),
  ADD KEY `product_categories_is_primary_index` (`is_primary`);

--
-- Indexes for table `product_costings`
--
ALTER TABLE `product_costings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_costings_product_id_unique` (`product_id`),
  ADD KEY `product_costings_store_id_product_id_index` (`store_id`,`product_id`);

--
-- Indexes for table `product_costing_impacts`
--
ALTER TABLE `product_costing_impacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_costing_impacts_product_id_foreign` (`product_id`),
  ADD KEY `product_costing_impacts_raw_material_id_foreign` (`raw_material_id`),
  ADD KEY `product_costing_impacts_raw_material_cost_history_id_foreign` (`raw_material_cost_history_id`),
  ADD KEY `product_costing_impact_lookup` (`store_id`,`product_id`,`occurred_at`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_images_product_id_is_primary_sort_order_index` (`product_id`,`is_primary`,`sort_order`),
  ADD KEY `product_images_is_primary_index` (`is_primary`);

--
-- Indexes for table `product_materials`
--
ALTER TABLE `product_materials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_materials_product_id_raw_material_id_unique` (`product_id`,`raw_material_id`),
  ADD KEY `product_materials_raw_material_id_foreign` (`raw_material_id`);

--
-- Indexes for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_reviews_order_item_id_unique` (`order_item_id`),
  ADD KEY `product_reviews_order_id_foreign` (`order_id`),
  ADD KEY `product_reviews_user_id_foreign` (`user_id`),
  ADD KEY `product_reviews_created_by_foreign` (`created_by`),
  ADD KEY `product_reviews_updated_by_foreign` (`updated_by`),
  ADD KEY `product_reviews_product_index` (`product_id`,`is_active`,`created_at`),
  ADD KEY `product_reviews_rating_index` (`rating`),
  ADD KEY `product_reviews_is_active_index` (`is_active`),
  ADD KEY `product_reviews_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_variants_store_sku_unique` (`store_id`,`sku`),
  ADD UNIQUE KEY `product_variants_product_name_unique` (`product_id`,`name`),
  ADD KEY `product_variants_product_id_is_default_index` (`product_id`,`is_default`),
  ADD KEY `product_variants_is_default_index` (`is_default`),
  ADD KEY `product_variants_summary_idx` (`product_id`,`is_default`,`id`),
  ADD KEY `product_variants_sku_search_idx` (`sku`),
  ADD KEY `product_variants_price_filter_idx` (`product_id`,`is_default`,`price`,`id`),
  ADD KEY `product_variants_stock_filter_idx` (`product_id`,`is_default`,`stock`,`id`),
  ADD KEY `product_variants_stock_index` (`product_id`,`stock`),
  ADD KEY `product_variants_sale_default_idx` (`price_sale`,`is_default`);

--
-- Indexes for table `product_variant_values`
--
ALTER TABLE `product_variant_values`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_variant_values_variant_id_attribute_id_unique` (`variant_id`,`attribute_id`),
  ADD KEY `product_variant_values_attribute_id_foreign` (`attribute_id`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `promotions_name_unique` (`name`),
  ADD KEY `promotions_approved_by_foreign` (`approved_by`),
  ADD KEY `promotions_created_by_foreign` (`created_by`),
  ADD KEY `promotions_updated_by_foreign` (`updated_by`),
  ADD KEY `promotions_public_index` (`approval_status`,`is_active`,`sort_order`,`deleted_at`),
  ADD KEY `promotions_store_index` (`store_id`,`approval_status`,`deleted_at`),
  ADD KEY `promotions_target_id_index` (`target_id`),
  ADD KEY `promotions_is_active_index` (`is_active`),
  ADD KEY `promotions_approval_status_index` (`approval_status`),
  ADD KEY `promotions_submitted_at_index` (`submitted_at`),
  ADD KEY `promotions_approved_at_index` (`approved_at`),
  ADD KEY `promotions_deleted_at_index` (`deleted_at`),
  ADD KEY `promotions_payment_approval_index` (`promotion_payment_id`,`approval_status`);

--
-- Indexes for table `promotion_payments`
--
ALTER TABLE `promotion_payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `promotion_payments_payment_number_unique` (`payment_number`),
  ADD KEY `promotion_payments_user_id_foreign` (`user_id`),
  ADD KEY `promotion_payments_reviewed_by_foreign` (`reviewed_by`),
  ADD KEY `promotion_payments_created_by_foreign` (`created_by`),
  ADD KEY `promotion_payments_updated_by_foreign` (`updated_by`),
  ADD KEY `promotion_payments_store_status_index` (`store_id`,`status`,`deleted_at`),
  ADD KEY `promotion_payments_status_index` (`status`),
  ADD KEY `promotion_payments_paid_at_index` (`paid_at`),
  ADD KEY `promotion_payments_reviewed_at_index` (`reviewed_at`),
  ADD KEY `promotion_payments_is_active_index` (`is_active`),
  ADD KEY `promotion_payments_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `raw_materials`
--
ALTER TABLE `raw_materials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `raw_materials_store_id_code_unique` (`store_id`,`code`),
  ADD KEY `raw_materials_store_id_name_index` (`store_id`,`name`),
  ADD KEY `raw_materials_is_active_index` (`is_active`);

--
-- Indexes for table `raw_material_cost_histories`
--
ALTER TABLE `raw_material_cost_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `raw_material_cost_histories_raw_material_id_foreign` (`raw_material_id`),
  ADD KEY `rm_cost_history_movement_fk` (`raw_material_stock_movement_id`),
  ADD KEY `raw_material_cost_history_lookup` (`store_id`,`raw_material_id`,`occurred_at`),
  ADD KEY `raw_material_cost_histories_reference_number_index` (`reference_number`);

--
-- Indexes for table `raw_material_stock_movements`
--
ALTER TABLE `raw_material_stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `raw_material_stock_movements_raw_material_id_foreign` (`raw_material_id`),
  ADD KEY `raw_material_movement_lookup` (`store_id`,`raw_material_id`,`occurred_at`),
  ADD KEY `raw_material_stock_movements_reference_number_index` (`reference_number`);

--
-- Indexes for table `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `receipts_source_unique` (`source_type`,`source_id`),
  ADD UNIQUE KEY `receipts_receipt_number_unique` (`receipt_number`),
  ADD KEY `receipts_user_created_index` (`user_id`,`created_at`),
  ADD KEY `receipts_source_type_index` (`source_type`),
  ADD KEY `receipts_source_id_index` (`source_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`),
  ADD KEY `roles_created_by_foreign` (`created_by`),
  ADD KEY `roles_updated_by_foreign` (`updated_by`),
  ADD KEY `roles_status_index` (`is_active`,`deleted_at`),
  ADD KEY `roles_is_active_index` (`is_active`),
  ADD KEY `roles_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `role_permissions_permission_id_role_id_index` (`permission_id`,`role_id`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schedules_created_by_foreign` (`created_by`),
  ADD KEY `schedules_updated_by_foreign` (`updated_by`),
  ADD KEY `schedules_user_date_index` (`user_id`,`date`,`is_active`),
  ADD KEY `schedules_store_date_type_index` (`store_id`,`date`,`type`),
  ADD KEY `schedules_type_index` (`type`),
  ADD KEY `schedules_priority_index` (`priority`),
  ADD KEY `schedules_date_index` (`date`),
  ADD KEY `schedules_is_active_index` (`is_active`),
  ADD KEY `schedules_deleted_at_index` (`deleted_at`),
  ADD KEY `schedules_user_completed_date_index` (`user_id`,`is_completed`,`date`),
  ADD KEY `schedules_status_index` (`status`),
  ADD KEY `schedules_recurrence_index` (`recurrence`);

--
-- Indexes for table `seller_customers`
--
ALTER TABLE `seller_customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `seller_customers_store_id_user_id_unique` (`store_id`,`user_id`),
  ADD KEY `seller_customers_created_by_foreign` (`created_by`),
  ADD KEY `seller_customers_updated_by_foreign` (`updated_by`),
  ADD KEY `seller_customers_user_id_store_id_index` (`user_id`,`store_id`);

--
-- Indexes for table `seller_settlements`
--
ALTER TABLE `seller_settlements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `seller_settlements_settlement_number_unique` (`settlement_number`),
  ADD KEY `seller_settlements_order_id_foreign` (`order_id`),
  ADD KEY `seller_settlements_sub_order_id_foreign` (`sub_order_id`),
  ADD KEY `seller_settlements_created_by_foreign` (`created_by`),
  ADD KEY `seller_settlements_updated_by_foreign` (`updated_by`),
  ADD KEY `seller_settlements_store_status_index` (`store_id`,`status`,`settled_at`),
  ADD KEY `seller_settlements_status_index` (`status`),
  ADD KEY `seller_settlements_settled_at_index` (`settled_at`),
  ADD KEY `seller_settlements_is_active_index` (`is_active`),
  ADD KEY `seller_settlements_deleted_at_index` (`deleted_at`),
  ADD KEY `seller_settlements_store_created_index` (`store_id`,`created_at`);

--
-- Indexes for table `seller_withdrawals`
--
ALTER TABLE `seller_withdrawals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `seller_withdrawals_withdrawal_number_unique` (`withdrawal_number`),
  ADD KEY `seller_withdrawals_user_id_foreign` (`user_id`),
  ADD KEY `seller_withdrawals_processed_by_foreign` (`processed_by`),
  ADD KEY `seller_withdrawals_created_by_foreign` (`created_by`),
  ADD KEY `seller_withdrawals_updated_by_foreign` (`updated_by`),
  ADD KEY `seller_withdrawals_store_status_index` (`store_id`,`status`,`created_at`),
  ADD KEY `seller_withdrawals_method_index` (`method`),
  ADD KEY `seller_withdrawals_status_index` (`status`),
  ADD KEY `seller_withdrawals_processed_at_index` (`processed_at`),
  ADD KEY `seller_withdrawals_is_active_index` (`is_active`),
  ADD KEY `seller_withdrawals_deleted_at_index` (`deleted_at`),
  ADD KEY `seller_withdrawals_store_created_index` (`store_id`,`created_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `shipping_settings`
--
ALTER TABLE `shipping_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `shipping_settings_store_id_unique` (`store_id`);

--
-- Indexes for table `showcases`
--
ALTER TABLE `showcases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `showcases_store_slug_unique` (`store_id`,`slug`),
  ADD KEY `showcases_created_by_foreign` (`created_by`),
  ADD KEY `showcases_updated_by_foreign` (`updated_by`),
  ADD KEY `showcases_scope_index` (`store_id`,`is_active`,`sort_order`),
  ADD KEY `showcases_is_active_index` (`is_active`),
  ADD KEY `showcases_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `showcase_products`
--
ALTER TABLE `showcase_products`
  ADD PRIMARY KEY (`showcase_id`,`product_id`),
  ADD KEY `showcase_products_product_id_sort_order_index` (`product_id`,`sort_order`);

--
-- Indexes for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stock_movements_order_item_key_unique` (`order_item_id`,`movement_key`),
  ADD KEY `stock_movements_product_id_foreign` (`product_id`),
  ADD KEY `stock_movements_variant_id_foreign` (`variant_id`),
  ADD KEY `stock_movements_order_id_foreign` (`order_id`),
  ADD KEY `stock_movements_created_by_foreign` (`created_by`),
  ADD KEY `stock_movements_updated_by_foreign` (`updated_by`),
  ADD KEY `stock_movements_scope_index` (`store_id`,`variant_id`,`occurred_at`),
  ADD KEY `stock_movements_type_index` (`type`),
  ADD KEY `stock_movements_occurred_at_index` (`occurred_at`),
  ADD KEY `stock_movements_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stores_user_id_unique` (`user_id`),
  ADD UNIQUE KEY `stores_slug_unique` (`slug`),
  ADD KEY `stores_created_by_foreign` (`created_by`),
  ADD KEY `stores_updated_by_foreign` (`updated_by`),
  ADD KEY `stores_public_index` (`status`,`is_active`,`deleted_at`),
  ADD KEY `stores_email_index` (`email`),
  ADD KEY `stores_city_index` (`city`),
  ADD KEY `stores_province_index` (`province`),
  ADD KEY `stores_status_index` (`status`),
  ADD KEY `stores_is_active_index` (`is_active`),
  ADD KEY `stores_deleted_at_index` (`deleted_at`),
  ADD KEY `stores_public_catalog_idx` (`status`,`is_active`,`id`),
  ADD KEY `stores_store_type_index` (`store_type`);

--
-- Indexes for table `store_details`
--
ALTER TABLE `store_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `store_details_store_id_unique` (`store_id`);

--
-- Indexes for table `sub_orders`
--
ALTER TABLE `sub_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sub_orders_sub_order_number_unique` (`sub_order_number`),
  ADD KEY `sub_orders_store_id_status_created_at_index` (`store_id`,`status`,`created_at`),
  ADD KEY `sub_orders_status_index` (`status`),
  ADD KEY `sub_orders_store_status_created_index` (`store_id`,`status`,`created_at`),
  ADD KEY `sub_orders_order_store_index` (`order_id`,`store_id`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `support_tickets_ticket_number_unique` (`ticket_number`),
  ADD KEY `support_tickets_store_id_foreign` (`store_id`),
  ADD KEY `support_tickets_order_id_foreign` (`order_id`),
  ADD KEY `support_tickets_assigned_to_foreign` (`assigned_to`),
  ADD KEY `support_tickets_created_by_foreign` (`created_by`),
  ADD KEY `support_tickets_updated_by_foreign` (`updated_by`),
  ADD KEY `support_tickets_user_status_index` (`user_id`,`status`,`created_at`),
  ADD KEY `support_tickets_category_index` (`category`),
  ADD KEY `support_tickets_priority_index` (`priority`),
  ADD KEY `support_tickets_status_index` (`status`),
  ADD KEY `support_tickets_last_replied_at_index` (`last_replied_at`),
  ADD KEY `support_tickets_resolved_at_index` (`resolved_at`),
  ADD KEY `support_tickets_is_active_index` (`is_active`),
  ADD KEY `support_tickets_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `support_ticket_messages`
--
ALTER TABLE `support_ticket_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `support_ticket_messages_user_id_foreign` (`user_id`),
  ADD KEY `support_ticket_messages_ticket_index` (`ticket_id`,`created_at`),
  ADD KEY `support_ticket_messages_is_internal_index` (`is_internal`),
  ADD KEY `support_ticket_messages_read_at_index` (`read_at`),
  ADD KEY `support_ticket_messages_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_firebase_uid_unique` (`firebase_uid`),
  ADD KEY `users_access_status_index` (`is_active`,`banned_at`,`deleted_at`),
  ADD KEY `users_is_email_verified_index` (`is_email_verified`),
  ADD KEY `users_is_active_index` (`is_active`),
  ADD KEY `users_banned_at_index` (`banned_at`),
  ADD KEY `users_created_by_index` (`created_by`),
  ADD KEY `users_updated_by_index` (`updated_by`),
  ADD KEY `users_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `user_roles_role_id_user_id_index` (`role_id`,`user_id`);

--
-- Indexes for table `user_vouchers`
--
ALTER TABLE `user_vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_vouchers_source_unique` (`user_id`,`voucher_id`,`source_type`,`source_id`),
  ADD KEY `user_vouchers_voucher_id_foreign` (`voucher_id`),
  ADD KEY `user_vouchers_user_status_index` (`user_id`,`status`),
  ADD KEY `user_vouchers_source_type_index` (`source_type`),
  ADD KEY `user_vouchers_status_index` (`status`),
  ADD KEY `user_vouchers_used_at_index` (`used_at`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vouchers_code_unique` (`code`),
  ADD UNIQUE KEY `vouchers_name_unique` (`name`),
  ADD KEY `vouchers_store_id_foreign` (`store_id`),
  ADD KEY `vouchers_created_by_foreign` (`created_by`),
  ADD KEY `vouchers_updated_by_foreign` (`updated_by`),
  ADD KEY `vouchers_scope_index` (`voucher_scope`,`store_id`,`is_active`,`deleted_at`),
  ADD KEY `vouchers_period_index` (`is_active`,`starts_at`,`ends_at`,`deleted_at`),
  ADD KEY `vouchers_voucher_scope_index` (`voucher_scope`),
  ADD KEY `vouchers_discount_target_index` (`discount_target`),
  ADD KEY `vouchers_starts_at_index` (`starts_at`),
  ADD KEY `vouchers_ends_at_index` (`ends_at`),
  ADD KEY `vouchers_is_active_index` (`is_active`),
  ADD KEY `vouchers_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wishlists_user_id_name_unique` (`user_id`,`name`);

--
-- Indexes for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wishlist_items_wishlist_id_product_id_unique` (`wishlist_id`,`product_id`),
  ADD KEY `wishlist_items_product_id_foreign` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `admin_fee_configs`
--
ALTER TABLE `admin_fee_configs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `catalog_groups`
--
ALTER TABLE `catalog_groups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `code_patterns`
--
ALTER TABLE `code_patterns`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `financial_payment_histories`
--
ALTER TABLE `financial_payment_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `financial_transactions`
--
ALTER TABLE `financial_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `game_contents`
--
ALTER TABLE `game_contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `game_sessions`
--
ALTER TABLE `game_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `missions`
--
ALTER TABLE `missions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `mission_user_progress`
--
ALTER TABLE `mission_user_progress`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=153;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `ppob_finance_entries`
--
ALTER TABLE `ppob_finance_entries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ppob_inquiries`
--
ALTER TABLE `ppob_inquiries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ppob_operators`
--
ALTER TABLE `ppob_operators`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `ppob_pricing_rules`
--
ALTER TABLE `ppob_pricing_rules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ppob_products`
--
ALTER TABLE `ppob_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `ppob_transactions`
--
ALTER TABLE `ppob_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ppob_transaction_logs`
--
ALTER TABLE `ppob_transaction_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `product_attributes`
--
ALTER TABLE `product_attributes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product_attribute_values`
--
ALTER TABLE `product_attribute_values`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `product_costings`
--
ALTER TABLE `product_costings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product_costing_impacts`
--
ALTER TABLE `product_costing_impacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=397;

--
-- AUTO_INCREMENT for table `product_materials`
--
ALTER TABLE `product_materials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `product_variant_values`
--
ALTER TABLE `product_variant_values`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `promotion_payments`
--
ALTER TABLE `promotion_payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `raw_materials`
--
ALTER TABLE `raw_materials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `raw_material_cost_histories`
--
ALTER TABLE `raw_material_cost_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `raw_material_stock_movements`
--
ALTER TABLE `raw_material_stock_movements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `receipts`
--
ALTER TABLE `receipts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `seller_customers`
--
ALTER TABLE `seller_customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `seller_settlements`
--
ALTER TABLE `seller_settlements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `seller_withdrawals`
--
ALTER TABLE `seller_withdrawals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `shipping_settings`
--
ALTER TABLE `shipping_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `showcases`
--
ALTER TABLE `showcases`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `stock_movements`
--
ALTER TABLE `stock_movements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=239;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `store_details`
--
ALTER TABLE `store_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sub_orders`
--
ALTER TABLE `sub_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `support_ticket_messages`
--
ALTER TABLE `support_ticket_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_vouchers`
--
ALTER TABLE `user_vouchers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `admin_fee_configs`
--
ALTER TABLE `admin_fee_configs`
  ADD CONSTRAINT `admin_fee_configs_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `admin_fee_configs_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `admin_fee_configs_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD CONSTRAINT `admin_notifications_actor_id_foreign` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `admin_notifications_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `admin_notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `banners`
--
ALTER TABLE `banners`
  ADD CONSTRAINT `banners_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `banners_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `banners_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_product_variant_id_foreign` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `catalog_groups`
--
ALTER TABLE `catalog_groups`
  ADD CONSTRAINT `catalog_groups_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `catalog_groups_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_catalog_group_id_foreign` FOREIGN KEY (`catalog_group_id`) REFERENCES `catalog_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categories_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categories_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `chat_message_reads`
--
ALTER TABLE `chat_message_reads`
  ADD CONSTRAINT `chat_message_reads_message_id_foreign` FOREIGN KEY (`message_id`) REFERENCES `chat_messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_message_reads_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `code_patterns`
--
ALTER TABLE `code_patterns`
  ADD CONSTRAINT `code_patterns_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `conversations_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `conversations_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `conversations_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD CONSTRAINT `conversation_participants_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversation_participants_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `financial_payment_histories`
--
ALTER TABLE `financial_payment_histories`
  ADD CONSTRAINT `financial_payment_histories_financial_transaction_id_foreign` FOREIGN KEY (`financial_transaction_id`) REFERENCES `financial_transactions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `financial_payment_histories_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `financial_transactions`
--
ALTER TABLE `financial_transactions`
  ADD CONSTRAINT `financial_transactions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `financial_transactions_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `financial_transactions_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `financial_transactions_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `financial_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `game_contents`
--
ALTER TABLE `game_contents`
  ADD CONSTRAINT `game_contents_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `game_contents_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `game_sessions`
--
ALTER TABLE `game_sessions`
  ADD CONSTRAINT `game_sessions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `game_sessions_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `game_sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `missions`
--
ALTER TABLE `missions`
  ADD CONSTRAINT `missions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `missions_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `missions_voucher_id_foreign` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `mission_user_progress`
--
ALTER TABLE `mission_user_progress`
  ADD CONSTRAINT `mission_user_progress_mission_id_foreign` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mission_user_progress_reward_voucher_id_foreign` FOREIGN KEY (`reward_voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `mission_user_progress_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_voucher_id_foreign` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `order_items_sub_order_id_foreign` FOREIGN KEY (`sub_order_id`) REFERENCES `sub_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_variant_id_foreign` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_order_number_foreign` FOREIGN KEY (`order_number`) REFERENCES `orders` (`order_number`) ON DELETE CASCADE;

--
-- Constraints for table `ppob_finance_entries`
--
ALTER TABLE `ppob_finance_entries`
  ADD CONSTRAINT `ppob_finance_entries_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ppob_finance_entries_ppob_transaction_id_foreign` FOREIGN KEY (`ppob_transaction_id`) REFERENCES `ppob_transactions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ppob_finance_entries_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `ppob_inquiries`
--
ALTER TABLE `ppob_inquiries`
  ADD CONSTRAINT `ppob_inquiries_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `ppob_operators` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ppob_inquiries_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ppob_operators`
--
ALTER TABLE `ppob_operators`
  ADD CONSTRAINT `ppob_operators_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ppob_operators_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `ppob_pricing_rules`
--
ALTER TABLE `ppob_pricing_rules`
  ADD CONSTRAINT `ppob_pricing_rules_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ppob_pricing_rules_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `ppob_operators` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ppob_pricing_rules_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `ppob_products` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ppob_pricing_rules_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `ppob_products`
--
ALTER TABLE `ppob_products`
  ADD CONSTRAINT `ppob_products_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ppob_products_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `ppob_operators` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ppob_products_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `ppob_transactions`
--
ALTER TABLE `ppob_transactions`
  ADD CONSTRAINT `ppob_transactions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ppob_transactions_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `ppob_operators` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ppob_transactions_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `ppob_products` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ppob_transactions_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ppob_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ppob_transaction_logs`
--
ALTER TABLE `ppob_transaction_logs`
  ADD CONSTRAINT `ppob_transaction_logs_ppob_transaction_id_foreign` FOREIGN KEY (`ppob_transaction_id`) REFERENCES `ppob_transactions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_primary_category_id_foreign` FOREIGN KEY (`primary_category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_attribute_values`
--
ALTER TABLE `product_attribute_values`
  ADD CONSTRAINT `product_attribute_values_attribute_id_foreign` FOREIGN KEY (`attribute_id`) REFERENCES `product_attributes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_attribute_values_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD CONSTRAINT `product_categories_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_categories_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_costings`
--
ALTER TABLE `product_costings`
  ADD CONSTRAINT `product_costings_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_costings_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_costing_impacts`
--
ALTER TABLE `product_costing_impacts`
  ADD CONSTRAINT `product_costing_impacts_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_costing_impacts_raw_material_cost_history_id_foreign` FOREIGN KEY (`raw_material_cost_history_id`) REFERENCES `raw_material_cost_histories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `product_costing_impacts_raw_material_id_foreign` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `product_costing_impacts_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_materials`
--
ALTER TABLE `product_materials`
  ADD CONSTRAINT `product_materials_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_materials_raw_material_id_foreign` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `product_reviews_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `product_reviews_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_reviews_order_item_id_foreign` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_reviews_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_reviews_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `product_reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_variants_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_variant_values`
--
ALTER TABLE `product_variant_values`
  ADD CONSTRAINT `product_variant_values_attribute_id_foreign` FOREIGN KEY (`attribute_id`) REFERENCES `product_attributes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_variant_values_variant_id_foreign` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `promotions`
--
ALTER TABLE `promotions`
  ADD CONSTRAINT `promotions_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `promotions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `promotions_promotion_payment_id_foreign` FOREIGN KEY (`promotion_payment_id`) REFERENCES `promotion_payments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `promotions_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `promotions_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `promotion_payments`
--
ALTER TABLE `promotion_payments`
  ADD CONSTRAINT `promotion_payments_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `promotion_payments_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `promotion_payments_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `promotion_payments_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `promotion_payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `raw_materials`
--
ALTER TABLE `raw_materials`
  ADD CONSTRAINT `raw_materials_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `raw_material_cost_histories`
--
ALTER TABLE `raw_material_cost_histories`
  ADD CONSTRAINT `raw_material_cost_histories_raw_material_id_foreign` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `raw_material_cost_histories_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rm_cost_history_movement_fk` FOREIGN KEY (`raw_material_stock_movement_id`) REFERENCES `raw_material_stock_movements` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `raw_material_stock_movements`
--
ALTER TABLE `raw_material_stock_movements`
  ADD CONSTRAINT `raw_material_stock_movements_raw_material_id_foreign` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `raw_material_stock_movements_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `receipts`
--
ALTER TABLE `receipts`
  ADD CONSTRAINT `receipts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `roles_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `schedules_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `schedules_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `schedules_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seller_customers`
--
ALTER TABLE `seller_customers`
  ADD CONSTRAINT `seller_customers_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `seller_customers_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `seller_customers_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `seller_customers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seller_settlements`
--
ALTER TABLE `seller_settlements`
  ADD CONSTRAINT `seller_settlements_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `seller_settlements_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `seller_settlements_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `seller_settlements_sub_order_id_foreign` FOREIGN KEY (`sub_order_id`) REFERENCES `sub_orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `seller_settlements_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `seller_withdrawals`
--
ALTER TABLE `seller_withdrawals`
  ADD CONSTRAINT `seller_withdrawals_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `seller_withdrawals_processed_by_foreign` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `seller_withdrawals_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `seller_withdrawals_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `seller_withdrawals_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shipping_settings`
--
ALTER TABLE `shipping_settings`
  ADD CONSTRAINT `shipping_settings_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `showcases`
--
ALTER TABLE `showcases`
  ADD CONSTRAINT `showcases_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `showcases_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `showcases_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `showcase_products`
--
ALTER TABLE `showcase_products`
  ADD CONSTRAINT `showcase_products_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `showcase_products_showcase_id_foreign` FOREIGN KEY (`showcase_id`) REFERENCES `showcases` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD CONSTRAINT `stock_movements_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_order_item_id_foreign` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_movements_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_movements_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_variant_id_foreign` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stores`
--
ALTER TABLE `stores`
  ADD CONSTRAINT `stores_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stores_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stores_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `store_details`
--
ALTER TABLE `store_details`
  ADD CONSTRAINT `store_details_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sub_orders`
--
ALTER TABLE `sub_orders`
  ADD CONSTRAINT `sub_orders_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sub_orders_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

--
-- Constraints for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `support_tickets_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `support_tickets_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `support_tickets_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `support_tickets_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `support_tickets_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `support_tickets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `support_ticket_messages`
--
ALTER TABLE `support_ticket_messages`
  ADD CONSTRAINT `support_ticket_messages_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `support_ticket_messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_vouchers`
--
ALTER TABLE `user_vouchers`
  ADD CONSTRAINT `user_vouchers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_vouchers_voucher_id_foreign` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD CONSTRAINT `vouchers_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `vouchers_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vouchers_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD CONSTRAINT `wishlist_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_items_wishlist_id_foreign` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
